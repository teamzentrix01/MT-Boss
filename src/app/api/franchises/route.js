import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { requireRole, randomPassword } from '@/lib/auth';
import { sendMail } from '@/lib/email';
import { normalizePhone, validateContactFields, isValidEmail } from '@/lib/validation';
import { createInitializationGuard } from '@/lib/api-utils';
import { ensureFranchiseAccessColumns } from '@/lib/franchise-access';
import { resolveFranchisePermissionDependencies } from '@/lib/franchise-permissions';
import { resolveManagedCity } from '@/lib/cities';
import { createPayURequest } from '@/lib/payu';
import { createPayUIntent, getPayUCallbackUrl, newPayUTxnId } from '@/lib/payu-intents';

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

function getFranchiseRegistrationFee(model) {
  const modelEnvKey = FRANCHISE_FEE_ENV_KEYS[model];
  if (!modelEnvKey) {
    throw new Error('Invalid franchise model');
  }
  const amount = Number(
    process.env[modelEnvKey]
    || process.env.FRANCHISE_REGISTRATION_FEE
  );
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Franchise registration fee is not configured');
  }
  return amount;
}

async function cityTaken(city, excludeId = null) {
  const normalized = normalizeCity(city);
  if (!normalized) return false;

  const params = [normalized];
  let idFilter = '';
  if (excludeId) {
    params.push(excludeId);
    idFilter = 'AND id <> $2';
  }

  const result = await pool.query(
    `SELECT id, name, status
     FROM franchises
     WHERE LOWER(TRIM(city)) = $1
       AND COALESCE(status, 'Pending') <> 'Rejected'
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
      <h2 style="margin:0 0 12px;">MTBoss Franchise Approved</h2>
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
        Please keep these credentials private. For security, change this password by contacting the MTBoss admin team if it is ever shared.
      </p>
      <p style="font-size:12px;color:#777;margin-top:24px;">MTBoss Construction</p>
    </div>
  `;
}

function credentialsEmail({ name, email, password, city }) {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, '');
  return `
    <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;padding:24px;color:#111;">
      <h2 style="margin:0 0 12px;">Your MTBoss Franchise Login Credentials</h2>
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
      <p style="font-size:12px;color:#777;margin-top:24px;">MTBoss Construction</p>
    </div>
  `;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    if (searchParams.get('action') === 'registration-fee') {
      const model = clean(searchParams.get('model'));
      if (!FRANCHISE_FEE_ENV_KEYS[model]) {
        return NextResponse.json({ success: false, error: 'Valid franchise model is required' }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        model,
        amount: getFranchiseRegistrationFee(model),
      });
    }

    const admin = requireRole(req, 'admin');
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }

    await ensureFranchiseColumns();
    const result = await pool.query(
      'SELECT * FROM franchises ORDER BY created_at DESC'
    );
    return NextResponse.json({ success: true, data: result.rows });
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
    const canonicalCity = await resolveManagedCity(city);

    if (!cleanName || !cleanEmail || !cleanPhone || !clean(model) || !canonicalCity) {
      return NextResponse.json({ success: false, error: 'Name, email, phone, city and franchise model are required' }, { status: 400 });
    }
    if (!FRANCHISE_FEE_ENV_KEYS[model]) {
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

    const registrationFee = getFranchiseRegistrationFee(model);
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const existing = await client.query(
        `SELECT *
         FROM franchises
         WHERE LOWER(email) = LOWER($1)
         FOR UPDATE`,
        [cleanEmail]
      );

      let franchise;
      let isRetry = false;
      if (existing.rows[0]) {
        franchise = existing.rows[0];
        const passwordMatches = franchise.password_hash
          && await bcrypt.compare(password, franchise.password_hash);
        const paymentCanBeRetried = passwordMatches
          && normalizeCity(franchise.city) === normalizeCity(canonicalCity)
          && ['Pending', 'Reviewing'].includes(franchise.status)
          && franchise.payment_status !== 'PAID';
        if (!paymentCanBeRetried) {
          await client.query('ROLLBACK');
          return NextResponse.json({
            success: false,
            error: 'An application already exists for this email',
          }, { status: 409 });
        }
        isRetry = true;
      } else {
        const existingCity = await cityTaken(canonicalCity);
        if (existingCity) {
          await client.query('ROLLBACK');
          return NextResponse.json({
            success: false,
            error: `A franchise application already exists for ${city}. Only one franchise is allowed in one city.`,
          }, { status: 409 });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const result = await client.query(
          `INSERT INTO franchises (
            name, father_name, dob, gender, marital_status, phone, email,
            occupation, qualification, annual_income, id_type, id_number, pan,
            address, district, city, state, pin_code, current_business, experience,
            construction_exp, employees, network, bank_name, branch_name,
            account_number, ifsc_code, model, investment, territory, referral_source,
            start_date, service_category, office_area, office_district, premises_ownership,
            lease_duration, office_area_sqft, office_type, message, other_franchise,
            training_willing, password_hash, login_enabled, permissions
          ) VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,
            $19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,
            $35,$36,$37,$38,$39,$40,$41,$42,$43,FALSE,'{}'::jsonb
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

      await client.query(
        `UPDATE franchises
         SET registration_fee = $1, payment_status = 'PENDING',
             payment_gateway = 'PAYU', payment_gateway_id = NULL
         WHERE id = $2`,
        [registrationFee, franchise.id]
      );
      const txnid = newPayUTxnId('FRG');
      await createPayUIntent({
        txnid,
        purpose: 'franchise_registration',
        entityId: franchise.id,
        amount: registrationFee,
        client,
      });
      const callbackUrl = getPayUCallbackUrl(req);
      const payment = createPayURequest({
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

      await client.query('COMMIT');
      return NextResponse.json({
        success: true,
        data: { ...franchise, registration_fee: registrationFee, payment_status: 'PENDING' },
        payment,
      }, { status: isRetry ? 200 : 201 });
    } catch (paymentError) {
      try { await client.query('ROLLBACK'); } catch {}
      throw paymentError;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Franchise submit error:', error);
    const configurationError = error.message === 'Franchise registration fee is not configured'
      || error.message?.includes('PayU is not configured');
    return NextResponse.json({
      success: false,
      error: configurationError ? 'Online registration payment is temporarily unavailable' : 'Server error',
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
          subject: 'Your MTBoss franchise login credentials',
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
    if (status === 'Approved' && !current.password_hash) {
      generatedPassword = randomPassword();
      const passwordHash = await bcrypt.hash(generatedPassword, 10);
      result = await pool.query(
        `UPDATE franchises
         SET status = $1::VARCHAR, password_hash = $2, approved_at = NOW(),
             approved_by_email = $3, login_enabled = TRUE
         WHERE id = $4
         RETURNING *`,
        [status, passwordHash, admin.email, id]
      );
    } else {
      result = await pool.query(
        `UPDATE franchises
         SET status = $1::VARCHAR,
             login_enabled = CASE WHEN $1::VARCHAR = 'Approved' THEN TRUE ELSE FALSE END,
             approved_at = CASE WHEN $1::VARCHAR = 'Approved' THEN COALESCE(approved_at, NOW()) ELSE approved_at END,
             approved_by_email = CASE WHEN $1::VARCHAR = 'Approved' THEN COALESCE(approved_by_email, $2) ELSE approved_by_email END
         WHERE id = $3
         RETURNING *`,
        [status, admin.email, id]
      );
    }

    if (status === 'Approved') {
      try {
        await sendMail({
          to: current.email,
          subject: 'Your MTBoss franchise has been approved',
          html: approvalEmail({
            name: current.name,
            email: current.email,
            password: generatedPassword,
            city: current.city,
          }),
        });
        return NextResponse.json({
          success: true,
          data: result.rows[0],
          credentialsEmailed: true,
          message: generatedPassword
            ? `Franchise approved and credentials sent to ${current.email}`
            : `Franchise approved. Login details sent to ${current.email}; use the password created in the form.`,
        });
      } catch (mailError) {
        console.warn('Franchise approval email failed:', mailError.message);
        return NextResponse.json({
          success: true,
          data: result.rows[0],
          credentialsEmailed: false,
          warning: `Franchise approved, but credentials email failed: ${mailError.message}`,
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
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
