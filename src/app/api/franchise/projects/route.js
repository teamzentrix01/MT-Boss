import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';

async function ensureProjectColumns() {
  await pool.query(`
    ALTER TABLE projects
      ADD COLUMN IF NOT EXISTS franchise_id INTEGER,
      ADD COLUMN IF NOT EXISTS assigned_agent_id INTEGER,
      ADD COLUMN IF NOT EXISTS created_by_role TEXT DEFAULT 'admin',
      ADD COLUMN IF NOT EXISTS project_notes TEXT
  `);
}

async function ensureAgentIsApproved(agentId) {
  if (!agentId) return null;
  const result = await pool.query(
    `SELECT id FROM agents WHERE id = $1 AND status = 'Approved'`,
    [agentId]
  );
  return result.rows[0] || null;
}

export async function GET(req) {
  try {
    const franchise = requireRole(req, 'franchise');
    if (!franchise) {
      return NextResponse.json({ success: false, error: 'Franchise access required' }, { status: 403 });
    }

    await ensureProjectColumns();
    const result = await pool.query(
      `SELECT p.*, a.name AS assigned_agent_name, a.email AS assigned_agent_email, a.phone AS assigned_agent_phone
       FROM projects p
       LEFT JOIN agents a ON a.id = p.assigned_agent_id
       WHERE p.franchise_id = $1
       ORDER BY p.created_at DESC`,
      [franchise.id]
    );

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Franchise projects fetch error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const franchise = requireRole(req, 'franchise');
    if (!franchise) {
      return NextResponse.json({ success: false, error: 'Franchise access required' }, { status: 403 });
    }

    await ensureProjectColumns();
    const {
      title,
      category,
      location,
      description,
      image_url,
      cloudinary_public_id,
      size,
      status,
      assigned_agent_id,
      project_notes,
    } = await req.json();

    if (!title || !category || !image_url) {
      return NextResponse.json({ success: false, error: 'Title, category and image are required' }, { status: 400 });
    }

    if (assigned_agent_id && !(await ensureAgentIsApproved(assigned_agent_id))) {
      return NextResponse.json({ success: false, error: 'Select a valid approved agent' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO projects (
        title, category, location, description, image_url, cloudinary_public_id,
        size, status, franchise_id, assigned_agent_id, created_by_role, project_notes
      )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'franchise',$11)
       RETURNING *`,
      [
        title,
        category,
        location || franchise.city || '',
        description || '',
        image_url,
        cloudinary_public_id || '',
        size || 'small',
        status === 'draft' ? 'draft' : 'published',
        franchise.id,
        assigned_agent_id || null,
        project_notes || '',
      ]
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Franchise project create error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const franchise = requireRole(req, 'franchise');
    if (!franchise) {
      return NextResponse.json({ success: false, error: 'Franchise access required' }, { status: 403 });
    }

    await ensureProjectColumns();
    const {
      id,
      title,
      category,
      location,
      description,
      image_url,
      cloudinary_public_id,
      size,
      status,
      assigned_agent_id,
      project_notes,
    } = await req.json();

    if (!id || !title || !category || !image_url) {
      return NextResponse.json({ success: false, error: 'Project id, title, category and image are required' }, { status: 400 });
    }

    if (assigned_agent_id && !(await ensureAgentIsApproved(assigned_agent_id))) {
      return NextResponse.json({ success: false, error: 'Select a valid approved agent' }, { status: 400 });
    }

    const result = await pool.query(
      `UPDATE projects
       SET title=$1, category=$2, location=$3, description=$4,
           image_url=$5, cloudinary_public_id=$6, size=$7, status=$8,
           assigned_agent_id=$9, project_notes=$10
       WHERE id=$11 AND franchise_id=$12
       RETURNING *`,
      [
        title,
        category,
        location || '',
        description || '',
        image_url,
        cloudinary_public_id || '',
        size || 'small',
        status === 'draft' ? 'draft' : 'published',
        assigned_agent_id || null,
        project_notes || '',
        id,
        franchise.id,
      ]
    );

    if (!result.rows[0]) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Franchise project update error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const franchise = requireRole(req, 'franchise');
    if (!franchise) {
      return NextResponse.json({ success: false, error: 'Franchise access required' }, { status: 403 });
    }

    await ensureProjectColumns();
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'Project id is required' }, { status: 400 });
    }

    const result = await pool.query(
      'DELETE FROM projects WHERE id = $1 AND franchise_id = $2 RETURNING id',
      [id, franchise.id]
    );

    if (!result.rows[0]) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Franchise project delete error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
