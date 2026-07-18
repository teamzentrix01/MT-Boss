import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireRole, unauthorized } from '@/lib/auth';
import { cleanText, normalizePhone, validateContactFields } from '@/lib/validation';
import { createInitializationGuard } from '@/lib/api-utils';

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

    const result = await pool.query(
      `INSERT INTO career_enquiries (
        job_id, position, department, job_location, name, email, phone, alternative_phone, experience,
        current_company, notice_period, current_salary, expected_salary, resume_name,
        resume_url, resume_data, resume_content_type, cover_letter, status, created_at
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,NOW()
      )
      RETURNING id, job_id, position, department, job_location, name, email, phone, alternative_phone,
        experience, current_company, notice_period, current_salary, expected_salary,
        resume_name, resume_url, cover_letter, status, created_at`,
      [
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

    const enquiry = result.rows[0];
    await sendAdminNotification(enquiry);

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
    if (!requireRole(req, 'admin')) return unauthorized();

    await ensureTable();

    const result = await pool.query(
      `SELECT id, job_id, position, department, job_location, name, email, phone, alternative_phone,
        experience, current_company, notice_period, current_salary, expected_salary,
        resume_name, resume_url, cover_letter, status, created_at
       FROM career_enquiries
       ORDER BY created_at DESC
       LIMIT 100`
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
