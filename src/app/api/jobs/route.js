import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { jobs as defaultJobs } from '@/app/careers/data/jobs';

function toList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') {
    return value
      .split('\n')
      .map(item => item.trim())
      .filter(Boolean);
  }
  return [];
}

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS jobs (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      department VARCHAR(120) NOT NULL,
      location VARCHAR(180) NOT NULL,
      type VARCHAR(80) NOT NULL DEFAULT 'Full Time',
      experience VARCHAR(120) NOT NULL,
      salary VARCHAR(120),
      description TEXT NOT NULL,
      responsibilities JSONB DEFAULT '[]'::jsonb,
      requirements JSONB DEFAULT '[]'::jsonb,
      skills JSONB DEFAULT '[]'::jsonb,
      urgent BOOLEAN DEFAULT FALSE,
      status VARCHAR(30) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await pool.query(`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'active'`);
  await pool.query(`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()`);
}

async function seedDefaultJobs() {
  const count = await pool.query('SELECT COUNT(*)::int AS count FROM jobs');
  if (count.rows[0]?.count > 0) return;

  for (const job of defaultJobs) {
    await pool.query(
      `INSERT INTO jobs (
        id, title, department, location, type, experience, salary, description,
        responsibilities, requirements, skills, urgent, status, created_at, updated_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10::jsonb,$11::jsonb,$12,$13,NOW(),NOW())
      ON CONFLICT (id) DO NOTHING`,
      [
        Number(job.id),
        job.title,
        job.department,
        job.location,
        job.type,
        job.experience,
        job.salary,
        job.description,
        JSON.stringify(job.responsibilities || []),
        JSON.stringify(job.requirements || []),
        JSON.stringify(job.skills || []),
        Boolean(job.urgent),
        'active',
      ]
    );
  }

  await pool.query(`SELECT setval(pg_get_serial_sequence('jobs', 'id'), COALESCE((SELECT MAX(id) FROM jobs), 1), true)`);
}

function normalizeJob(row) {
  const createdAt = row.created_at ? new Date(row.created_at).getTime() : null;
  const days = createdAt ? Math.max(0, Math.floor((Date.now() - createdAt) / 86400000)) : null;
  let posted = 'Recently posted';

  if (days === 0) posted = 'Today';
  else if (days === 1) posted = '1 day ago';
  else if (days && days < 7) posted = `${days} days ago`;
  else if (days && days < 14) posted = '1 week ago';
  else if (days) posted = `${Math.floor(days / 7)} weeks ago`;

  return {
    ...row,
    id: String(row.id),
    responsibilities: Array.isArray(row.responsibilities) ? row.responsibilities : [],
    requirements: Array.isArray(row.requirements) ? row.requirements : [],
    skills: Array.isArray(row.skills) ? row.skills : [],
    urgent: Boolean(row.urgent),
    status: row.status || 'active',
    posted,
  };
}

export async function GET(req) {
  try {
    await ensureTable();
    await seedDefaultJobs();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const id = searchParams.get('id');

    if (id) {
      const result = await pool.query('SELECT * FROM jobs WHERE id = $1 LIMIT 1', [id]);
      if (!result.rows[0]) {
        return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: normalizeJob(result.rows[0]) });
    }

    const result = status === 'all'
      ? await pool.query('SELECT * FROM jobs ORDER BY created_at DESC')
      : await pool.query("SELECT * FROM jobs WHERE status = 'active' ORDER BY urgent DESC, created_at DESC");

    return NextResponse.json({ success: true, data: result.rows.map(normalizeJob) });
  } catch (error) {
    console.error('Jobs fetch error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await ensureTable();
    const body = await req.json();
    const {
      title,
      department,
      location,
      type,
      experience,
      salary,
      description,
      responsibilities,
      requirements,
      skills,
      urgent,
      status,
    } = body;

    if (!title || !department || !location || !experience || !description) {
      return NextResponse.json(
        { success: false, error: 'Title, department, location, experience, and description are required' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO jobs (
        title, department, location, type, experience, salary, description,
        responsibilities, requirements, skills, urgent, status, created_at, updated_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9::jsonb,$10::jsonb,$11,$12,NOW(),NOW())
      RETURNING *`,
      [
        title.trim(),
        department.trim(),
        location.trim(),
        type?.trim() || 'Full Time',
        experience.trim(),
        salary?.trim() || '',
        description.trim(),
        JSON.stringify(toList(responsibilities)),
        JSON.stringify(toList(requirements)),
        JSON.stringify(toList(skills)),
        Boolean(urgent),
        status || 'active',
      ]
    );

    return NextResponse.json({ success: true, data: normalizeJob(result.rows[0]) }, { status: 201 });
  } catch (error) {
    console.error('Job create error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await ensureTable();
    const body = await req.json();
    const {
      id,
      title,
      department,
      location,
      type,
      experience,
      salary,
      description,
      responsibilities,
      requirements,
      skills,
      urgent,
      status,
    } = body;

    if (!id || !title || !department || !location || !experience || !description) {
      return NextResponse.json(
        { success: false, error: 'ID, title, department, location, experience, and description are required' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE jobs SET
        title=$1,
        department=$2,
        location=$3,
        type=$4,
        experience=$5,
        salary=$6,
        description=$7,
        responsibilities=$8::jsonb,
        requirements=$9::jsonb,
        skills=$10::jsonb,
        urgent=$11,
        status=$12,
        updated_at=NOW()
      WHERE id=$13
      RETURNING *`,
      [
        title.trim(),
        department.trim(),
        location.trim(),
        type?.trim() || 'Full Time',
        experience.trim(),
        salary?.trim() || '',
        description.trim(),
        JSON.stringify(toList(responsibilities)),
        JSON.stringify(toList(requirements)),
        JSON.stringify(toList(skills)),
        Boolean(urgent),
        status || 'active',
        id,
      ]
    );

    if (!result.rows[0]) {
      return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: normalizeJob(result.rows[0]) });
  } catch (error) {
    console.error('Job update error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await ensureTable();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: 'Job ID is required' }, { status: 400 });
    }

    await pool.query('DELETE FROM jobs WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Job delete error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
