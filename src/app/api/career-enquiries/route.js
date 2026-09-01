import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { notifyAdminSubmission } from '@/lib/customer-communications';
import { requireRole, unauthorized } from '@/lib/auth';
import { cleanText, normalizePhone, validateContactFields } from '@/lib/validation';
import { createInitializationGuard } from '@/lib/api-utils';
import {
  CAREER_APPLICATION_STATUSES,
  addCareerApplicationEvent,
  ensureCareerTrackingSchema,
} from '@/lib/career-applications';

const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL ||
  process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
  'mtboss2016@gmail.com';

const ensureTable = createInitializationGuard(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS career_enquiries (
      id SERIAL PRIMARY KEY,
      job_id VARCHAR(100),
      position VARCHAR(255) NOT NULL,
      department VARCHAR(255),
      job_location VARCHAR(255),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      experience VARCHAR(100) NOT NULL,
      current_company VARCHAR(255),
      notice_period VARCHAR(100),
      current_salary VARCHAR(100),
      expected_salary VARCHAR(100),
      resume_name VARCHAR(255),
      resume_url TEXT,
      cover_letter TEXT,
      status VARCHAR(50) DEFAULT 'New',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await pool.query(`
    ALTER TABLE career_enquiries
    ADD COLUMN IF NOT EXISTS resume_url TEXT
  `);

  await pool.query(`
    ALTER TABLE career_enquiries
    ADD COLUMN IF NOT EXISTS resume_data BYTEA
  `);

  await pool.query(`
    ALTER TABLE career_enquiries
    ADD COLUMN IF NOT EXISTS resume_content_type TEXT
  `);

  await pool.query(`
    ALTER TABLE career_enquiries
    ADD COLUMN IF NOT EXISTS alternative_phone VARCHAR(50)
  `);
  await ensureCareerTrackingSchema();
});

async function prepareResume(file) {
  if (!file || file.size === 0) return null;

  const validTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (!validTypes.includes(file.type)) {
    throw new Error('Only PDF or Word documents allowed');
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size must be under 5MB');
  }

  const extMap = {
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  };
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName || `resume.${extMap[file.type]}`}`;

  return {
    data: Buffer.from(await file.arrayBuffer()),
    contentType: file.type,
    originalName: file.name,
    url: `/uploads/resumes/${filename}`,
  };
}

function buildApplicationEditPayload(body, current = {}) {
  const cleanName = cleanText(body.name ?? current.name);
  const cleanEmail = cleanText(body.email ?? current.email).toLowerCase();
  const cleanPhone = normalizePhone(body.phone ?? current.phone);
  const cleanAltPhone = body.alternative_phone ?? current.alternative_phone
    ? normalizePhone(body.alternative_phone ?? current.alternative_phone)
    : null;
  const cleanExperience = cleanText(body.experience ?? current.experience);

  if (!cleanName || !cleanEmail || !cleanPhone || !cleanExperience) {
    throw new Error('Name, email, phone, and experience are required');
  }

  const contactError = validateContactFields({ name: cleanName, email: cleanEmail, phone: cleanPhone });
  if (contactError) throw new Error(contactError);

  if (cleanAltPhone) {
    const altError = validateContactFields({ name: 'Temp', email: 'temp@temp.com', phone: cleanAltPhone });
    if (altError) throw new Error('Alternative Phone: ' + altError);
  }

  return {
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    alternative_phone: cleanAltPhone,
    experience: cleanExperience,
    current_company: cleanText(body.current_company ?? current.current_company) || null,
    notice_period: cleanText(body.notice_period ?? current.notice_period) || null,
    current_salary: cleanText(body.current_salary ?? current.current_salary) || null,
    expected_salary: cleanText(body.expected_salary ?? current.expected_salary) || null,
    cover_letter: cleanText(body.cover_letter ?? current.cover_letter) || null,
  };
}

async function getApplicationWithHistory(id, queryable = pool) {
  const refreshed = await queryable.query(
    `SELECT application.id, application.user_id, application.application_reference,
      application.job_id, application.position, application.department, application.job_location,
      application.name, application.email, application.phone, application.alternative_phone,
      application.experience, application.current_company, application.notice_period,
      application.current_salary, application.expected_salary, application.resume_name,
      application.resume_url, application.cover_letter, application.status, application.status_note,
      application.interview_at, application.created_at, application.updated_at,
      COALESCE((
        SELECT json_agg(json_build_object(
          'id', event.id, 'status', event.status, 'title', event.title,
          'note', event.note, 'actor_role', event.actor_role,
          'actor_name', event.actor_name, 'created_at', event.created_at
        ) ORDER BY event.created_at ASC, event.id ASC)
        FROM career_application_events event
        WHERE event.application_id = application.id
      ), '[]'::json) AS history
     FROM career_enquiries application WHERE application.id = $1`,
    [id]
  );
  return refreshed.rows[0] || null;
}

async function sendAdminNotification(enquiry) {
  try {
    await fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        Position: enquiry.position,
        Department: enquiry.department || 'Not Provided',
        Location: enquiry.job_location || 'Not Provided',
        'Full Name': enquiry.name,
        Email: enquiry.email,
        Phone: enquiry.phone,
        'Alternative Phone': enquiry.alternative_phone || 'Not Provided',
        Experience: enquiry.experience,
        'Current Company': enquiry.current_company || 'Not Provided',
        'Notice Period': enquiry.notice_period || 'Not Specified',
        'Current Salary': enquiry.current_salary || 'Not Provided',
        'Expected Salary': enquiry.expected_salary || 'Not Provided',
        Resume: enquiry.resume_name || 'Not Uploaded',
        'Resume Link': enquiry.resume_url || 'Not Uploaded',
        'Cover Letter': enquiry.cover_letter || 'Not Provided',
        _subject: `New Career Enquiry - ${enquiry.position} - ${enquiry.name}`,
        _template: 'table',
        _captcha: 'false',
      }),
    });
  } catch (error) {
    console.warn('Career enquiry email failed:', error);
  }
}

export async function POST(req) {
  try {
    const user = requireRole(req, 'user');
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Please login as a customer before applying so you can track your application' },
        { status: 401 }
      );
    }
    const contentType = req.headers.get('content-type') || '';
    let body;
    let resumeFile = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      resumeFile = formData.get('resume');
      body = Object.fromEntries(formData.entries());
    } else {
      body = await req.json();
    }

    const {
      job_id,
      position,
      department,
      job_location,
      name,
      email,
      phone,
      alternative_phone,
      experience,
      current_company,
      notice_period,
      current_salary,
      expected_salary,
      resume_name,
      cover_letter,
    } = body;
    const cleanName = cleanText(name);
    const cleanEmail = cleanText(email).toLowerCase();
    const cleanPhone = normalizePhone(phone);
    const cleanAltPhone = alternative_phone ? normalizePhone(alternative_phone) : null;

    if (!position || !cleanName || !cleanEmail || !cleanPhone || !experience) {
      return NextResponse.json(
        { success: false, error: 'Position, name, email, phone, and experience are required' },
        { status: 400 }
      );
    }

    if (!resumeFile || typeof resumeFile.arrayBuffer !== 'function' || resumeFile.size === 0) {
      return NextResponse.json(
        { success: false, error: 'Please upload your resume in PDF or Word format' },
        { status: 400 }
      );
    }
    const contactError = validateContactFields({ name: cleanName, email: cleanEmail, phone: cleanPhone });
    if (contactError) return NextResponse.json({ success: false, error: contactError }, { status: 400 });

    if (cleanAltPhone) {
      const altError = validateContactFields({ name: 'Temp', email: 'temp@temp.com', phone: cleanAltPhone });
      if (altError) return NextResponse.json({ success: false, error: 'Alternative Phone: ' + altError }, { status: 400 });
    }

    await ensureTable();
    const resume = await prepareResume(resumeFile);

    const client = await pool.connect();
    let result;
    try {
      await client.query('BEGIN');
      const applicationReference = `JA-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      result = await client.query(
        `INSERT INTO career_enquiries (
        user_id, application_reference,
        job_id, position, department, job_location, name, email, phone, alternative_phone, experience,
        current_company, notice_period, current_salary, expected_salary, resume_name,
        resume_url, resume_data, resume_content_type, cover_letter, status, created_at, updated_at
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,NOW(),NOW()
      )
      RETURNING id, user_id, application_reference, job_id, position, department, job_location, name, email, phone, alternative_phone,
        experience, current_company, notice_period, current_salary, expected_salary,
        resume_name, resume_url, cover_letter, status, status_note, interview_at, created_at, updated_at`,
      [
        user.id,
        applicationReference,
        job_id || null,
        position,
        department || null,
        job_location || null,
        cleanName,
        cleanEmail,
        cleanPhone,
        cleanAltPhone,
        experience,
        current_company || null,
        notice_period || null,
        current_salary || null,
        expected_salary || null,
        resume.originalName || resume_name || null,
        resume.url,
        resume.data,
        resume.contentType,
        cover_letter || null,
        'New',
      ]
      );
      await addCareerApplicationEvent(client, {
        applicationId: result.rows[0].id,
        status: 'New',
        title: 'Application submitted',
        note: 'Your application has been received by the MTBOSS HR team.',
        actorRole: 'user',
        actorId: user.id,
        actorName: cleanName,
      });
      await client.query('COMMIT');
    } catch (error) {
      try { await client.query('ROLLBACK'); } catch {}
      throw error;
    } finally {
      client.release();
    }

    const enquiry = result.rows[0];
    await sendAdminNotification(enquiry);
    await notifyAdminSubmission({ type: 'job application', name: enquiry.name, phone: enquiry.phone, email: enquiry.email, reference: enquiry.application_reference, details: { Position: enquiry.position, Department: enquiry.department, Experience: enquiry.experience, Location: enquiry.job_location } });

    return NextResponse.json(
      {
        success: true,
        message: 'Your application has been submitted successfully!',
        data: enquiry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Career enquiry error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await ensureTable();
    const admin = requireRole(req, 'admin');
    const user = admin ? null : requireRole(req, 'user');
    if (!admin && !user) return unauthorized();

    const scope = admin
      ? { sql: 'TRUE', params: [] }
      : {
          sql: `(application.user_id = $1 OR (application.user_id IS NULL AND LOWER(application.email) = LOWER($2)))`,
          params: [user.id, user.email || ''],
        };
    const result = await pool.query(
      `SELECT application.id, application.user_id, application.application_reference,
        application.job_id, application.position, application.department, application.job_location,
        application.name, application.email, application.phone, application.alternative_phone,
        application.experience, application.current_company, application.notice_period,
        application.current_salary, application.expected_salary, application.resume_name,
        application.resume_url, application.cover_letter, application.status, application.status_note,
        application.interview_at, application.created_at, application.updated_at,
        COALESCE((
          SELECT json_agg(json_build_object(
            'id', event.id, 'status', event.status, 'title', event.title,
            'note', event.note, 'actor_role', event.actor_role,
            'actor_name', event.actor_name, 'created_at', event.created_at
          ) ORDER BY event.created_at ASC, event.id ASC)
          FROM career_application_events event
          WHERE event.application_id = application.id
        ), '[]'::json) AS history
       FROM career_enquiries application
       WHERE ${scope.sql}
       ORDER BY application.created_at DESC
       LIMIT 100`,
      scope.params
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching career enquiries:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  await ensureTable();
  const admin = requireRole(req, 'admin');
  const user = admin ? null : requireRole(req, 'user');
  if (!admin && !user) return unauthorized();

  const client = await pool.connect();
  try {
    const contentType = req.headers.get('content-type') || '';
    let body;
    let resumeFile = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      resumeFile = formData.get('resume');
      body = Object.fromEntries(formData.entries());
    } else {
      body = await req.json();
    }

    const id = Number(body.id);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ success: false, error: 'Valid application id is required' }, { status: 400 });
    }

    const lookup = admin
      ? await client.query('SELECT * FROM career_enquiries WHERE id = $1 LIMIT 1', [id])
      : await client.query(
          `SELECT * FROM career_enquiries
           WHERE id = $1 AND (user_id = $2 OR (user_id IS NULL AND LOWER(email) = LOWER($3)))
           LIMIT 1`,
          [id, user.id, user.email || '']
        );
    const current = lookup.rows[0];
    if (!current) {
      return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 });
    }

    let payload;
    try {
      payload = buildApplicationEditPayload(body, current);
    } catch (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    const hasNewResume = resumeFile && typeof resumeFile.arrayBuffer === 'function' && resumeFile.size > 0;
    let resume = null;
    if (hasNewResume) {
      try {
        resume = await prepareResume(resumeFile);
      } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
      }
    }

    await client.query('BEGIN');
    await client.query(
      `UPDATE career_enquiries SET
          user_id = COALESCE(user_id, $1),
          name = $2,
          email = $3,
          phone = $4,
          alternative_phone = $5,
          experience = $6,
          current_company = $7,
          notice_period = $8,
          current_salary = $9,
          expected_salary = $10,
          cover_letter = $11,
          resume_name = COALESCE($12, resume_name),
          resume_url = COALESCE($13, resume_url),
          resume_data = COALESCE($14, resume_data),
          resume_content_type = COALESCE($15, resume_content_type),
          updated_at = NOW()
        WHERE id = $16`,
      [
        admin ? current.user_id : user.id,
        payload.name,
        payload.email,
        payload.phone,
        payload.alternative_phone,
        payload.experience,
        payload.current_company,
        payload.notice_period,
        payload.current_salary,
        payload.expected_salary,
        payload.cover_letter,
        resume?.originalName || null,
        resume?.url || null,
        resume?.data || null,
        resume?.contentType || null,
        id,
      ]
    );
    await addCareerApplicationEvent(client, {
      applicationId: id,
      status: current.status || 'New',
      title: 'Application details updated',
      note: admin ? 'HR updated the application details.' : 'Applicant updated application details.',
      actorRole: admin ? 'admin' : 'user',
      actorId: admin ? admin.id : user.id,
      actorName: admin
        ? admin.name || admin.email || 'MTBoss HR'
        : payload.name,
    });
    const refreshed = await getApplicationWithHistory(id, client);
    await client.query('COMMIT');

    return NextResponse.json({ success: true, data: refreshed });
  } catch (error) {
    try { await client.query('ROLLBACK'); } catch {}
    console.error('Career application edit error:', error);
    return NextResponse.json({ success: false, error: 'Application details could not be updated' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function PATCH(req) {
  const admin = requireRole(req, 'admin');
  if (!admin) return unauthorized();

  const client = await pool.connect();
  try {
    await ensureTable();
    const body = await req.json();
    const id = Number(body.id);
    const status = cleanText(body.status);
    const note = cleanText(body.note) || null;
    const interviewAt = body.interview_at || null;
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ success: false, error: 'Valid application id is required' }, { status: 400 });
    }
    if (!CAREER_APPLICATION_STATUSES.includes(status)) {
      return NextResponse.json({ success: false, error: 'Select a valid application status' }, { status: 400 });
    }
    if (status === 'Interview Scheduled' && !interviewAt) {
      return NextResponse.json({ success: false, error: 'Interview date and time are required' }, { status: 400 });
    }

    await client.query('BEGIN');
    const updated = await client.query(
      `UPDATE career_enquiries
          SET status = $1::TEXT, status_note = $2::TEXT,
              interview_at = CASE
                WHEN $1::TEXT = 'Interview Scheduled' THEN $3::TIMESTAMPTZ
                ELSE interview_at
              END,
              updated_at = NOW()
        WHERE id = $4
        RETURNING *`,
      [status, note, interviewAt, id]
    );
    if (!updated.rows[0]) {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 });
    }
    await addCareerApplicationEvent(client, {
      applicationId: id,
      status,
      title: status,
      note,
      actorRole: 'admin',
      actorId: admin.id,
      actorName: admin.name || admin.email || 'MTBoss HR',
    });
    await client.query('COMMIT');

    const refreshed = await getApplicationWithHistory(id);
    return NextResponse.json({ success: true, data: refreshed });
  } catch (error) {
    try { await client.query('ROLLBACK'); } catch {}
    console.error('Career application update error:', error);
    return NextResponse.json({ success: false, error: 'Application could not be updated' }, { status: 500 });
  } finally {
    client.release();
  }
}
