import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { requireRole, randomPassword } from '@/lib/auth';
import { sendMail } from '@/lib/email';
import { normalizePhone, validateContactFields, isValidEmail } from '@/lib/validation';
import { createInitializationGuard } from '@/lib/api-utils';
import { ensureFranchiseAccessColumns } from '@/lib/franchise-access';
import {
  DEFAULT_APPROVED_FRANCHISE_PERMISSIONS,
  resolveFranchisePermissionDependencies,
} from '@/lib/franchise-permissions';
import { resolveManagedCityWithMessage } from '@/lib/cities';
import { createPayURequest } from '@/lib/payu';
import { createPayUIntent, getPayUCallbackUrl, newPayUTxnId } from '@/lib/payu-intents';
import { notifyAdminSubmission } from '@/lib/customer-communications';

const STATUSES = ['Pending', 'Reviewing', 'Approved', 'Rejected'];
const FRANCHISE_FEE_ENV_KEYS = Object.freeze({
  'Associate Partner': 'FRANCHISE_ASSOCIATE_REGISTRATION_FEE',
  'Regional Franchise': 'FRANCHISE_REGIONAL_REGISTRATION_FEE',
  'Master Franchise': 'FRANCHISE_MASTER_REGISTRATION_FEE',
});

const ensureFranchiseColumns = createInitializationGuard(async () => {
  await ensureFranchiseAccessColumns();
  await pool.query(`
    ALTER TABLE franchises
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW(),
      ADD COLUMN IF NOT EXISTS registration_fee NUMERIC(12,2),
      ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'UNPAID',
      ADD COLUMN IF NOT EXISTS payment_gateway TEXT,
      ADD COLUMN IF NOT EXISTS payment_gateway_id TEXT,
      ADD COLUMN IF NOT EXISTS payment_completed_at TIMESTAMPTZ
  `);
});

function clean(value) {
  return String(value || '').trim();
}

function normalizeCity(value) {
  return clean(value).toLowerCase();
}

async function isFranchiseModelValid(model) {
  if (FRANCHISE_FEE_ENV_KEYS[model]) return true;
  try {
    const res = await pool.query(
      `SELECT 1 FROM franchise_models WHERE LOWER(TRIM(name)) = LOWER(TRIM($1)) AND is_active = TRUE LIMIT 1`,
      [model]
    );
    return res.rows.length > 0;
  } catch {
    return false;
  }
}

async function getFranchiseRegistrationFee(model) {
  // First attempt: check dynamic franchise_models table
  try {
    const res = await pool.query(
      `SELECT registration_fee FROM franchise_models WHERE LOWER(TRIM(name)) = LOWER(TRIM($1)) AND is_active = TRUE LIMIT 1`,
      [model]
    );
    if (res.rows[0]) {
      const amount = Number(res.rows[0].registration_fee);
      if (Number.isFinite(amount) && amount >= 0) {
        return amount;
      }
    }
  } catch (err) {
    // Database table may not be ready or active
  }

  // Second attempt: check environment variables
  const modelEnvKey = FRANCHISE_FEE_ENV_KEYS[model];
  if (modelEnvKey) {
    const amount = Number(
      process.env[modelEnvKey]
      || process.env.FRANCHISE_REGISTRATION_FEE
    );
    if (Number.isFinite(amount) && amount > 0) {
      return amount;
    }
  }

  // Default fallback amount
  const defaultFallback = Number(process.env.FRANCHISE_REGISTRATION_FEE || 499999);
  return defaultFallback;
}

function hasSavedPermissions(value) {
  return value && typeof value === 'object' && Object.values(value).some(Boolean);
}

function sanitizeFranchise(row) {
  if (!row) return row;
  const { password_hash: _passwordHash, ...safe } = row;
  return safe;
}

const FRANCHISE_LIST_COLUMNS = `
  id, name, father_name, dob, gender, marital_status, phone, email,
  occupation, qualification, annual_income, id_type, id_number, pan,
  address, district, city, state, pin_code, current_business, experience,
  construction_exp, employees, network, bank_name, branch_name,
  account_number, ifsc_code, model, investment, territory, referral_source,
  start_date, service_category, office_area, office_district, premises_ownership,
  lease_duration, office_area_sqft, office_type, message, other_franchise,
  training_willing, status, login_enabled, permissions,
  registration_fee, payment_status, payment_gateway, payment_gateway_id,
  payment_completed_at, created_at, approved_at, approved_by_email,
  last_login_at
`;

async function cityTaken(city, excludeId = null, onlyApproved = false) {
  const normalized = normalizeCity(city);
  if (!normalized) return false;

  const params = [normalized];
  let idFilter = '';
  if (excludeId) {
    params.push(excludeId);
    idFilter = 'AND id <> $2';
  }

  const statusFilter = onlyApproved
    ? "AND status = 'Approved'"
    : "AND status = 'Approved'"; // Only block application if already an APPROVED franchise exists

  const result = await pool.query(
    `SELECT id, name, status
     FROM franchises
     WHERE LOWER(TRIM(city)) = $1
       ${statusFilter}
       ${idFilter}
     LIMIT 1`,
    params
  );

  return result.rows[0] || null;
}

function approvalEmail({ name, email, password, city }) {
  const passwordText = password || 'Use the password you created while filling the franchise application form.';
  return `
    <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;padding:24px;color:#111;">
      <h2 style="margin:0 0 12px;">MTBOSS Franchise Approved</h2>
      <p style="line-height:1.6;">Hello ${name || 'Franchise Partner'},</p>
      <p style="line-height:1.6;">
        Your franchise application for <strong>${city}</strong> has been approved.
        You can now sign in to your franchise dashboard and create projects for your territory.
      </p>
      <div style="background:#f5f5f5;border:1px solid #e5e5e5;border-radius:8px;padding:16px;margin:20px 0;">
        <p style="margin:0 0 8px;"><strong>Login URL:</strong> ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/franchise/login</p>
        <p style="margin:0 0 8px;"><strong>Email:</strong> ${email}</p>
        <p style="margin:0;"><strong>Password:</strong> ${passwordText}</p>
      </div>
      <p style="line-height:1.6;">
        Please keep these credentials private. For security, change this password by contacting the MTBOSS admin team if it is ever shared.
      </p>
      <p style="font-size:12px;color:#777;margin-top:24px;">MTBOSS Construction</p>
    </div>
  `;
}

function credentialsEmail({ name, email, password, city }) {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, '');
  return `
    <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;padding:24px;color:#111;">
      <h2 style="margin:0 0 12px;">Your MTBOSS Franchise Login Credentials</h2>
      <p style="line-height:1.6;">Hello ${name || 'Franchise Partner'},</p>
      <p style="line-height:1.6;">
        Fresh login credentials were requested for your approved franchise in <strong>${city || 'your territory'}</strong>.
        Your previous password has been replaced by the temporary password below.
      </p>
      <div style="background:#f5f5f5;border:1px solid #e5e5e5;border-radius:8px;padding:16px;margin:20px 0;">
        <p style="margin:0 0 8px;"><strong>Login URL:</strong> <a href="${appUrl}/franchise/login">${appUrl}/franchise/login</a></p>
        <p style="margin:0 0 8px;"><strong>Email:</strong> ${email}</p>
        <p style="margin:0;"><strong>Temporary Password:</strong> ${password}</p>
      </div>
      <p style="line-height:1.6;">Sign in using this temporary password and change it from the franchise dashboard.</p>
      <p style="font-size:12px;color:#777;margin-top:24px;">MTBOSS Construction</p>
    </div>
  `;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    if (searchParams.get('action') === 'registration-fee') {
      const model = clean(searchParams.get('model'));
      const isValid = await isFranchiseModelValid(model);
      if (!isValid) {
        return NextResponse.json({ success: false, error: 'Valid franchise model is required' }, { status: 400 });
      }
      const fee = await getFranchiseRegistrationFee(model);
      return NextResponse.json({
        success: true,
        model,
        amount: fee,
      });
    }

    const admin = requireRole(req, 'admin');
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }

    await ensureFranchiseColumns();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(500, Math.max(1, parseInt(searchParams.get('limit') || '200', 10) || 200));
    const offset = (page - 1) * limit;
    const countRes = await pool.query(`SELECT COUNT(*)::INT AS total FROM franchises`);
    const total = countRes.rows[0]?.total || 0;

    // 1. Fetch from franchises table
    const result = await pool.query(
      `SELECT ${FRANCHISE_LIST_COLUMNS}
       FROM franchises
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    // 2. Fetch franchise inquiries from contact_submissions (department='franchise' or text mentions franchise)
    let contactInquiries = [];
    try {
      const contactRes = await pool.query(
        `SELECT id, name, phone, email, city, department, subject, message,
                status, created_at
           FROM contact_submissions
          WHERE department = 'franchise'
             OR LOWER(COALESCE(subject, '')) LIKE '%franchise%'
             OR LOWER(COALESCE(message, '')) LIKE '%franchise%'
          ORDER BY created_at DESC
          LIMIT 200`
      );
      contactInquiries = contactRes.rows.map((row) => ({
        id: `contact-${row.id}`,
        raw_id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        city: row.city || '—',
        state: '—',
        model: 'Contact Inquiry',
        investment: 'Inquiry',
        territory: row.subject || row.city || '—',
        status: row.status || 'Pending',
        message: row.message,
        created_at: row.created_at,
        _source: 'contact',
        payment_status: 'NOT_APPLICABLE',
      }));
    } catch (err) {
      console.warn('Could not load contact franchise inquiries:', err.message);
    }

    // 3. Fetch franchise inquiries from consultation_leads if any mention franchise
    let consultInquiries = [];
    try {
      const consultRes = await pool.query(
        `SELECT id, name, phone, email, city, service, preferred_slot, plot_area, status, created_at
           FROM consultation_leads
          WHERE LOWER(COALESCE(service, '')) LIKE '%franchise%'
             OR LOWER(COALESCE(city, '')) LIKE '%franchise%'
          ORDER BY created_at DESC
          LIMIT 100`
      );
      consultInquiries = consultRes.rows.map((row) => ({
        id: `consult-${row.id}`,
        raw_id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        city: row.city || '—',
        state: '—',
        model: 'Consultation Modal',
        investment: 'Inquiry',
        territory: row.city || '—',
        status: row.status || 'Pending',
        message: `Service: ${row.service || ''} | Slot: ${row.preferred_slot || ''} | Area: ${row.plot_area || ''}`,
        created_at: row.created_at,
        _source: 'consultation',
        payment_status: 'NOT_APPLICABLE',
      }));
    } catch (err) {
      // Table may not exist yet
    }

    // Combine all franchise submissions: main applications first, then other sources
    const combinedData = [
      ...result.rows.map(r => ({ ...r, _source: 'franchise' })),
      ...contactInquiries,
      ...consultInquiries,
    ];

    return NextResponse.json({
      success: true,
      data: combinedData,
      pagination: {
        page,
        limit,
        total: total + contactInquiries.length + consultInquiries.length,
        pages: Math.ceil((total + contactInquiries.length + consultInquiries.length) / limit) || 1,
      },
    });
  } catch (error) {
    console.error('Franchises fetch error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await ensureFranchiseColumns();
    const body = await req.json();
    const {
      name, fatherName, dob, gender, maritalStatus, phone, email,
      password, confirmPassword,
      occupation, qualification, annualIncome, idType, idNumber, pan,
      address, district, city, state, pinCode, currentBusiness, experience,
      constructionExp, employees, network, bankName, branchName,
      accountNumber, ifscCode, model, investment, territory, referralSource,
      startDate, serviceCategory, officeArea, officeDistrict, premisesOwnership,
      leaseDuration, officeArea_sqft, officeType, message, otherFranchise,
      trainingWilling,
    } = body;

    const cleanName = clean(name);
    const cleanEmail = clean(email).toLowerCase();
    const cleanPhone = normalizePhone(phone);
    if (!cleanName) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }
    if (!cleanEmail) {
      return NextResponse.json({ success: false, error: 'Email address is required' }, { status: 400 });
    }
    if (!cleanPhone) {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }
    if (!clean(model)) {
      return NextResponse.json({ success: false, error: 'Franchise model is required' }, { status: 400 });
    }
    // Lenient city resolution: works both on local and production
    let canonicalCity = clean(city);
    try {
      const cityResult = await resolveManagedCityWithMessage(city);
      if (cityResult?.city) canonicalCity = cityResult.city;
    } catch {}
    if (!canonicalCity) {
      return NextResponse.json({ success: false, error: 'City is required.' }, { status: 400 });
    }
    const isValidModel = await isFranchiseModelValid(model);
    if (!isValidModel) {
      return NextResponse.json({ success: false, error: 'Select a valid franchise model' }, { status: 400 });
    }
    const contactError = validateContactFields({ name: cleanName, email: cleanEmail, phone: cleanPhone });
    if (contactError) {
      return NextResponse.json({ success: false, error: contactError }, { status: 400 });
    }
    if (fatherName && !/^[A-Za-z][A-Za-z\s'.-]*$/.test(clean(fatherName))) {
      return NextResponse.json({ success: false, error: 'Father or husband name must contain letters only.' }, { status: 400 });
    }
    if (pinCode && !/^\d{6}$/.test(clean(pinCode))) {
      return NextResponse.json({ success: false, error: 'PIN code must be exactly 6 digits.' }, { status: 400 });
    }
    if (email && !isValidEmail(cleanEmail)) {
      return NextResponse.json({ success: false, error: 'Enter a valid email address.' }, { status: 400 });
    }
    if (!password || password.length < 8) {
      return NextResponse.json({ success: false, error: 'Password must be at least 8 characters' }, { status: 400 });
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ success: false, error: 'Password and confirm password do not match' }, { status: 400 });
    }

    // --- STEP 1: Franchise application ko pehle DB me permanently save karo ---
    // Payment attempt se pehle application save hoti hai taki admin panel me
    // turant show ho, chahe payment ho ya na ho.
    const dbClient = await pool.connect();
    let franchise;
    let isRetry = false;
    try {
      await dbClient.query('BEGIN');
      const existing = await dbClient.query(
        `SELECT *
         FROM franchises
         WHERE LOWER(email) = LOWER($1)
         FOR UPDATE`,
        [cleanEmail]
      );

      if (existing.rows[0]) {
        franchise = existing.rows[0];
        const passwordMatches = franchise.password_hash
          && await bcrypt.compare(password, franchise.password_hash);
        const canRetry = passwordMatches
          && normalizeCity(franchise.city) === normalizeCity(canonicalCity)
          && ['Pending', 'Reviewing'].includes(franchise.status)
          && franchise.payment_status !== 'PAID';
        if (!canRetry) {
          await dbClient.query('ROLLBACK');
          return NextResponse.json({
            success: false,
            error: 'An application already exists for this email',
          }, { status: 409 });
        }
        isRetry = true;
      } else {
        const existingCity = await cityTaken(canonicalCity);
        if (existingCity) {
          await dbClient.query('ROLLBACK');
          return NextResponse.json({
            success: false,
            error: `A franchise application already exists for ${city}. Only one franchise is allowed in one city.`,
          }, { status: 409 });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const result = await dbClient.query(
          `INSERT INTO franchises (
            name, father_name, dob, gender, marital_status, phone, email,
            occupation, qualification, annual_income, id_type, id_number, pan,
            address, district, city, state, pin_code, current_business, experience,
            construction_exp, employees, network, bank_name, branch_name,
            account_number, ifsc_code, model, investment, territory, referral_source,
            start_date, service_category, office_area, office_district, premises_ownership,
            lease_duration, office_area_sqft, office_type, message, other_franchise,
            training_willing, password_hash, login_enabled, permissions,
            payment_status
          ) VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,
            $19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,
            $35,$36,$37,$38,$39,$40,$41,$42,$43,FALSE,'{}',
            'UNPAID'
          ) RETURNING *`,
          [
            cleanName, fatherName, dob, gender, maritalStatus, cleanPhone, cleanEmail,
            occupation, qualification, annualIncome, idType, idNumber, pan,
            address, district, canonicalCity, state, pinCode, currentBusiness, experience,
            constructionExp, employees, network, bankName, branchName,
            accountNumber, ifscCode, model, investment, territory, referralSource,
            startDate, serviceCategory, officeArea, officeDistrict, premisesOwnership,
            leaseDuration, officeArea_sqft, officeType, message, otherFranchise,
            trainingWilling, passwordHash,
          ]
        );
        franchise = result.rows[0];
      }

      // Application permanently save - commit immediately
      await dbClient.query('COMMIT');
    } catch (dbError) {
      try { await dbClient.query('ROLLBACK'); } catch { /* ignore */ }
      throw dbError;
    } finally {
      dbClient.release();
    }

    // Admin ko notification bhejo (background, non-blocking)
    notifyAdminSubmission({
      type: 'franchise application received',
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      reference: `FRANCHISE-${franchise.id}`,
      details: { Model: model, City: canonicalCity },
    }).catch((e) => console.warn('Franchise admin notify error:', e.message));

    // --- STEP 2: PayU payment setup (optional, best-effort) ---
    // Agar PayU configured nahi hai ya fail hota hai, application already saved hai
    // aur admin panel me show hoti rahegi. Payment baad me bhi ho sakti hai.
    let payment = null;
    let registrationFee = null;
    try {
      registrationFee = await getFranchiseRegistrationFee(model);
      const payClient = await pool.connect();
      try {
        await payClient.query('BEGIN');
        await payClient.query(
          `UPDATE franchises
           SET registration_fee = $1, payment_status = 'PENDING',
               payment_gateway = 'PAYU', payment_gateway_id = NULL
           WHERE id = $2 AND payment_status = 'UNPAID'`,
          [registrationFee, franchise.id]
        );
        const txnid = newPayUTxnId('FRG');
        await createPayUIntent({
          txnid,
          purpose: 'franchise_registration',
          entityId: franchise.id,
          amount: registrationFee,
          client: payClient,
        });
        const callbackUrl = getPayUCallbackUrl(req);
        payment = createPayURequest({
          txnid,
          amount: registrationFee,
          productinfo: `MTBOSS ${model} registration`,
          firstname: cleanName.split(/\s+/)[0],
          email: cleanEmail,
          phone: cleanPhone,
          surl: callbackUrl,
          furl: callbackUrl,
          udf1: String(franchise.id),
          udf2: String(franchise.id),
          udf3: 'franchise_registration',
        });
        await payClient.query('COMMIT');
      } catch (payErr) {
        try { await payClient.query('ROLLBACK'); } catch { /* ignore */ }
        console.warn('Franchise PayU setup failed (application already saved to DB):', payErr.message);
        payment = null;
      } finally {
        payClient.release();
      }
    } catch (feeError) {
      console.warn('Franchise fee not configured (application saved to DB):', feeError.message);
      payment = null;
    }

    return NextResponse.json({
      success: true,
      data: {
        ...franchise,
        registration_fee: registrationFee,
        payment_status: payment ? 'PENDING' : 'UNPAID',
      },
      payment,
    }, { status: isRetry ? 200 : 201 });
  } catch (error) {
    console.error('Franchise submit error:', error);
    return NextResponse.json({
      success: false,
      error: 'Server error',
    }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const admin = requireRole(req, 'admin');
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }

    await ensureFranchiseColumns();
    const { id, status, action, permissions } = await req.json();
    if (typeof id === 'string' && id.startsWith('contact-')) {
      const contactId = parseInt(id.replace('contact-', ''), 10);
      const res = await pool.query(
        `UPDATE contact_submissions SET status = $1 WHERE id = $2 RETURNING *`,
        [status, contactId]
      );
      if (!res.rows[0]) return NextResponse.json({ success: false, error: 'Inquiry not found' }, { status: 404 });
      const row = res.rows[0];
      return NextResponse.json({
        success: true,
        data: {
          id: `contact-${row.id}`,
          raw_id: row.id,
          name: row.name,
          email: row.email,
          phone: row.phone,
          city: row.city || '—',
          state: '—',
          model: 'Contact Inquiry',
          investment: 'Inquiry',
          territory: row.subject || row.city || '—',
          status: row.status || 'Pending',
          message: row.message,
          created_at: row.created_at,
          _source: 'contact',
          payment_status: 'NOT_APPLICABLE',
        },
        message: `Franchise inquiry status updated to ${status}.`,
      });
    }

    if (typeof id === 'string' && id.startsWith('consult-')) {
      const consultId = parseInt(id.replace('consult-', ''), 10);
      const res = await pool.query(
        `UPDATE consultation_leads SET status = $1 WHERE id = $2 RETURNING *`,
        [status, consultId]
      );
      if (!res.rows[0]) return NextResponse.json({ success: false, error: 'Inquiry not found' }, { status: 404 });
      const row = res.rows[0];
      return NextResponse.json({
        success: true,
        data: {
          id: `consult-${row.id}`,
          raw_id: row.id,
          name: row.name,
          email: row.email,
          phone: row.phone,
          city: row.city || '—',
          state: '—',
          model: 'Consultation Modal',
          investment: 'Inquiry',
          territory: row.city || '—',
          status: row.status || 'Pending',
          message: `Service: ${row.service || ''} | Slot: ${row.preferred_slot || ''} | Area: ${row.plot_area || ''}`,
          created_at: row.created_at,
          _source: 'consultation',
          payment_status: 'NOT_APPLICABLE',
        },
        message: `Franchise inquiry status updated to ${status}.`,
      });
    }

    if (action === 'updatePermissions') {
      if (!id) {
        return NextResponse.json({ success: false, error: 'Franchise id is required' }, { status: 400 });
      }

      const normalizedPermissions = resolveFranchisePermissionDependencies(permissions);
      const result = await pool.query(
        `UPDATE franchises
            SET permissions = $1::jsonb
          WHERE id = $2
          RETURNING *`,
        [JSON.stringify(normalizedPermissions), id]
      );
      if (!result.rows[0]) {
        return NextResponse.json({ success: false, error: 'Franchise not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: result.rows[0],
        message: 'Franchise permissions updated successfully.',
      });
    }

    if (action === 'resendCredentials') {
      if (!id) {
        return NextResponse.json({ success: false, error: 'Franchise id is required' }, { status: 400 });
      }
      const smtpConfigured = Boolean(
        (process.env.SMTP_HOST || process.env.EMAIL_HOST)
        && (process.env.SMTP_USER || process.env.EMAIL_USER)
        && (process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD)
      );
      if (!smtpConfigured) {
        return NextResponse.json(
          { success: false, error: 'Email service is not configured. Credentials were not reset.' },
          { status: 503 }
        );
      }
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const currentResult = await client.query(
          'SELECT * FROM franchises WHERE id = $1 FOR UPDATE',
          [id]
        );
        const current = currentResult.rows[0];
        if (!current) {
          await client.query('ROLLBACK');
          return NextResponse.json({ success: false, error: 'Franchise not found' }, { status: 404 });
        }
        if (current.status !== 'Approved') {
          await client.query('ROLLBACK');
          return NextResponse.json({ success: false, error: 'Only approved franchises can receive login credentials' }, { status: 400 });
        }
        if (!isValidEmail(clean(current.email))) {
          await client.query('ROLLBACK');
          return NextResponse.json({ success: false, error: 'The franchise registered email address is invalid' }, { status: 400 });
        }

        const generatedPassword = randomPassword();
        const passwordHash = await bcrypt.hash(generatedPassword, 10);
        const result = await client.query(
          `UPDATE franchises
           SET password_hash = $1, login_enabled = TRUE,
               approved_at = COALESCE(approved_at, NOW()),
               approved_by_email = COALESCE(approved_by_email, $2)
           WHERE id = $3
           RETURNING *`,
          [passwordHash, admin.email, id]
        );

        await sendMail({
          to: current.email,
          subject: 'Your MTBOSS franchise login credentials',
          html: credentialsEmail({
            name: current.name,
            email: current.email,
            password: generatedPassword,
            city: current.city,
          }),
        });
        await client.query('COMMIT');

        return NextResponse.json({
          success: true,
          data: result.rows[0],
          credentialsEmailed: true,
          message: `Fresh credentials sent to ${current.email}`,
        });
      } catch (error) {
        await client.query('ROLLBACK').catch(() => {});
        throw error;
      } finally {
        client.release();
      }
    }

    if (!id || !STATUSES.includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid franchise status update' }, { status: 400 });
    }

    const currentResult = await pool.query('SELECT * FROM franchises WHERE id = $1', [id]);
    const current = currentResult.rows[0];
    if (!current) {
      return NextResponse.json({ success: false, error: 'Franchise not found' }, { status: 404 });
    }

    if (status === 'Approved') {
      if (current.payment_status !== 'PAID') {
        return NextResponse.json({
          success: false,
          error: 'Franchise registration payment must be completed before approval',
        }, { status: 409 });
      }
      const existingCity = await cityTaken(current.city, id);
      if (existingCity) {
        return NextResponse.json({
          success: false,
          error: `Cannot approve. ${current.city} already has a franchise application that is not rejected.`,
        }, { status: 409 });
      }
    }

    let result;
    let generatedPassword = null;
    const nextPermissions = status === 'Approved' && !hasSavedPermissions(current.permissions)
      ? resolveFranchisePermissionDependencies(DEFAULT_APPROVED_FRANCHISE_PERMISSIONS)
      : current.permissions;
    if (status === 'Approved' && !current.password_hash) {
      generatedPassword = randomPassword();
      const passwordHash = await bcrypt.hash(generatedPassword, 10);
      result = await pool.query(
        `UPDATE franchises
         SET status = $1::VARCHAR, password_hash = $2, approved_at = NOW(),
             approved_by_email = $3, login_enabled = TRUE,
             permissions = $5::jsonb
         WHERE id = $4
         RETURNING *`,
        [status, passwordHash, admin.email, id, JSON.stringify(nextPermissions)]
      );
    } else {
      result = await pool.query(
        `UPDATE franchises
         SET status = $1::VARCHAR,
             login_enabled = CASE WHEN $1::VARCHAR = 'Approved' THEN TRUE ELSE FALSE END,
             approved_at = CASE WHEN $1::VARCHAR = 'Approved' THEN COALESCE(approved_at, NOW()) ELSE approved_at END,
             approved_by_email = CASE WHEN $1::VARCHAR = 'Approved' THEN COALESCE(approved_by_email, $2) ELSE approved_by_email END,
             permissions = CASE WHEN $1::VARCHAR = 'Approved' THEN $4::jsonb ELSE permissions END
         WHERE id = $3
         RETURNING *`,
        [status, admin.email, id, JSON.stringify(nextPermissions)]
      );
    }

    if (status === 'Approved') {
      try {
        await sendMail({
          to: current.email,
          subject: 'Your MTBOSS franchise has been approved',
          html: approvalEmail({
            name: current.name,
            email: current.email,
            password: generatedPassword,
            city: current.city,
          }),
        });
        return NextResponse.json({
          success: true,
          data: sanitizeFranchise(result.rows[0]),
          credentialsEmailed: true,
          message: generatedPassword
            ? `Franchise approved and credentials sent to ${current.email}`
            : `Franchise approved. Login details sent to ${current.email}; use the password created in the form.`,
        });
      } catch (mailError) {
        console.warn('Franchise approval email failed:', mailError.message);
        return NextResponse.json({
          success: true,
          data: sanitizeFranchise(result.rows[0]),
          credentialsEmailed: false,
          warning: `Franchise approved, but credentials email failed: ${mailError.message}`,
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: sanitizeFranchise(result.rows[0]),
      credentialsEmailed: false,
      message: `Franchise status updated to ${status}.`,
    });
  } catch (error) {
    console.error('Franchise update error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Server error',
      code: error.code || null,
      detail: error.detail || null,
    }, { status: 500 });
  }
}
