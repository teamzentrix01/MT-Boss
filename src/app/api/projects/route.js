import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { handleApiError, isDatabaseConnectionError } from '@/lib/api-utils';
import { fallbackProjects, fallbackResponse } from '@/lib/public-fallbacks';
import { convertFinalLeadToProject, ensureProjectOpsSchema, getProjectSummaries } from '@/lib/project-ops';
import { ensureAgentSchema } from '@/lib/agent-auth';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const kind = searchParams.get('kind');
    const isAdminView = status === 'all' || kind === 'operational';

    if (isAdminView && !requireRole(req, 'admin')) return unauthorized();

    if (kind === 'operational') {
      await ensureAgentSchema();
      await ensureProjectOpsSchema();
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const finalLeads = await client.query(
          `SELECT l.id
             FROM agent_leads l
             LEFT JOIN projects p ON p.source_lead_id = l.id
            WHERE l.lead_stage = 'Final' AND p.id IS NULL`
        );
        for (const lead of finalLeads.rows) {
          await convertFinalLeadToProject(client, lead.id);
        }
        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK').catch(() => {});
        throw error;
      } finally {
        client.release();
      }
      const [data, agents] = await Promise.all([
        getProjectSummaries("WHERE p.project_kind = 'operational'"),
        pool.query(`SELECT id, name, city FROM agents WHERE status = 'Approved' ORDER BY name ASC`),
      ]);
      return NextResponse.json({ success: true, data, agents: agents.rows });
    }

    if (status === 'all') {
      await ensureProjectOpsSchema();
      return NextResponse.json({
        success: true,
        data: await getProjectSummaries("WHERE p.project_kind = 'portfolio'"),
      });
    }

    await ensureProjectOpsSchema();
    const result = await pool.query(
      `SELECT id, title, category, location, description, image_url, cloudinary_public_id,
              size, status, created_at
         FROM projects
        WHERE project_kind = 'portfolio' AND status = 'published'
        ORDER BY created_at DESC`
    );
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('GET projects error:', error.message);
    if (isDatabaseConnectionError(error)) {
      const { searchParams } = new URL(req.url);
      if (searchParams.get('status') === 'all' || searchParams.get('kind') === 'operational') {
        return handleApiError(error);
      }
      return NextResponse.json(fallbackResponse(fallbackProjects));
    }
    return handleApiError(error);
  }
}

export async function POST(req) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();

    const { title, category, location, description, image_url, cloudinary_public_id, size, status } = await req.json();

    if (!title || !image_url || !category) {
      return NextResponse.json({ success: false, error: 'Title, category and image are required' }, { status: 400 });
    }

    await ensureProjectOpsSchema();
    const result = await pool.query(
      `INSERT INTO projects (title, category, location, description, image_url, cloudinary_public_id, size, status, project_kind)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'portfolio') RETURNING *`,
      [title, category, location || '', description || '', image_url, cloudinary_public_id || '', size || 'small', status || 'published']
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Project create error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();
    await ensureProjectOpsSchema();

    const { id, title, category, location, description, image_url, cloudinary_public_id, size, status } = await req.json();

    const result = await pool.query(
      `UPDATE projects SET title=$1, category=$2, location=$3, description=$4,
       image_url=$5, cloudinary_public_id=$6, size=$7, status=$8
       WHERE id=$9 AND project_kind='portfolio' RETURNING *`,
      [title, category, location, description, image_url, cloudinary_public_id, size, status, id]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();

    const { id, cloudinary_public_id } = await req.json();

    await ensureProjectOpsSchema();
    const portfolioProject = await pool.query(
      "SELECT id FROM projects WHERE id = $1 AND project_kind = 'portfolio'",
      [id]
    );
    if (!portfolioProject.rows[0]) {
      return NextResponse.json({ success: false, error: 'Portfolio project not found' }, { status: 404 });
    }

    // Delete from Cloudinary if public_id exists
    if (cloudinary_public_id) {
      await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          public_id: cloudinary_public_id,
          api_key: process.env.CLOUDINARY_API_KEY,
          timestamp: Math.floor(Date.now() / 1000),
        }),
      });
    }

    await pool.query("DELETE FROM projects WHERE id = $1 AND project_kind = 'portfolio'", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
