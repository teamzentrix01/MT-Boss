import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { requirePmAccess } from '@/lib/project-management';
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

    if (isAdminView) {
      const pmAccessResult = await requirePmAccess(req);
      if (!pmAccessResult) return unauthorized();
    }

    if (kind === 'operational') {
      await ensureAgentSchema();
      
      const query = `
        WITH project_payments AS (
          SELECT project_id, COALESCE(SUM(amount), 0) AS received
          FROM pm_party_payments
          WHERE NOT is_deleted
          GROUP BY project_id
        ),
        project_agent_agg AS (
          SELECT 
            pa.project_id,
            json_agg(json_build_object(
              'id', a.id,
              'name', a.name,
              'email', a.email,
              'phone', a.phone,
              'city', a.city
            ) ORDER BY pa.assigned_at ASC) AS agents,
            (array_agg(a.id ORDER BY pa.assigned_at ASC))[1] AS primary_agent_id,
            (array_agg(a.name ORDER BY pa.assigned_at ASC))[1] AS primary_agent_name
          FROM pm_project_agents pa
          JOIN agents a ON a.id = pa.agent_id
          GROUP BY pa.project_id
        ),
        combined_pm_projects AS (
          SELECT 
            p.id::text AS id,
            p.party_id::text AS party_id,
            p.name AS title,
            p.name AS project_name,
            COALESCE(p.site_address, pa.address, '') AS site_address,
            COALESCE(p.city, p.site_address, pa.address, '') AS location,
            p.start_date,
            p.expected_end_date,
            COALESCE(p.contract_value, 0)::numeric AS deal_amount,
            COALESCE(p.contract_value, 0)::numeric AS contract_value,
            p.built_up_area,
            p.status AS project_status,
            p.status,
            p.project_type,
            COALESCE(al.service_type, p.project_type, 'General') AS category,
            p.city AS project_city,
            p.source_lead_id::text AS source_lead_id,
            p.created_at,
            pa.name AS client_name,
            pa.name AS party_name,
            pa.phone AS client_phone,
            pa.phone AS party_phone,
            pa.email AS client_email,
            pa.email AS party_email,
            pa.address AS party_address,
            al.id::text AS lead_id,
            al.service_type AS lead_service_type,
            al.client_requirement AS lead_client_requirement,
            al.notes AS lead_notes,
            al.daily_visit_notes AS lead_daily_visit_notes,
            al.city AS lead_city,
            COALESCE(pp.received, 0)::numeric AS received,
            (COALESCE(p.contract_value, 0) - COALESCE(pp.received, 0))::numeric AS pending,
            COALESCE(paa.agents, '[]'::json) AS assigned_agents,
            paa.primary_agent_id AS assigned_agent_id,
            paa.primary_agent_name AS assigned_agent_name,
            'Lead' AS source,
            false AS is_lead_only
          FROM pm_projects p
          JOIN pm_parties pa ON pa.id = p.party_id
          LEFT JOIN agent_leads al ON (al.id = p.source_lead_id OR al.converted_project_id = p.id)
          LEFT JOIN project_payments pp ON pp.project_id = p.id
          LEFT JOIN project_agent_agg paa ON paa.project_id = p.id
          WHERE (p.source_lead_id IS NOT NULL OR al.id IS NOT NULL)
        )
        SELECT * FROM combined_pm_projects
        ORDER BY created_at DESC;
      `;

      const [dataRes, agentsRes] = await Promise.all([
        pool.query(query),
        pool.query(`SELECT id, name, city FROM agents WHERE status = 'Approved' AND login_enabled = TRUE AND must_change_password = FALSE ORDER BY name ASC`),
      ]);

      return NextResponse.json({ success: true, data: dataRes.rows, agents: agentsRes.rows });
    }

    if (status === 'all') {
      await ensureProjectOpsSchema();
      return NextResponse.json({
        success: true,
        data: await getProjectSummaries(
          "WHERE p.project_kind = 'portfolio'",
          [],
          'ORDER BY COALESCE(p.sort_order, 0) ASC, p.created_at DESC'
        ),
      });
    }

    await ensureProjectOpsSchema();
    const result = await pool.query(
      `SELECT id, title, category, location, description, image_url, cloudinary_public_id,
              size, status, sort_order, created_at, additional_images
         FROM projects
        WHERE project_kind = 'portfolio' AND status = 'published'
        ORDER BY COALESCE(sort_order, 0) ASC, created_at DESC`
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

    const { title, category, location, description, image_url, cloudinary_public_id, size, status, additional_images } = await req.json();

    if (!title || !image_url || !category) {
      return NextResponse.json({ success: false, error: 'Title, category and image are required' }, { status: 400 });
    }

    await ensureProjectOpsSchema();
    const result = await pool.query(
      `INSERT INTO projects (title, category, location, description, image_url, cloudinary_public_id, size, status, sort_order, project_kind, additional_images)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,
         (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM projects WHERE project_kind = 'portfolio'),
         'portfolio', $9) RETURNING *`,
      [title, category, location || '', description || '', image_url, cloudinary_public_id || '', size || 'small', status || 'published', additional_images ? JSON.stringify(additional_images) : '[]']
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

    const payload = await req.json();

    if (Array.isArray(payload.items)) {
      if (payload.items.length === 0) {
        return NextResponse.json({ success: false, error: 'items array required' }, { status: 400 });
      }

      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        for (const item of payload.items) {
          const id = Number(item.id);
          const sortOrder = Number(item.sort_order);
          if (!Number.isInteger(id) || !Number.isInteger(sortOrder) || sortOrder < 1) {
            throw new Error('Invalid project order');
          }
          await client.query(
            `UPDATE projects SET sort_order=$1 WHERE id=$2 AND project_kind='portfolio'`,
            [sortOrder, id]
          );
        }
        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }

      return NextResponse.json({ success: true });
    }

    const { id, title, category, location, description, image_url, cloudinary_public_id, size, status, additional_images } = payload;

    const result = await pool.query(
      `UPDATE projects SET title=$1, category=$2, location=$3, description=$4,
       image_url=$5, cloudinary_public_id=$6, size=$7, status=$8, additional_images=$10
       WHERE id=$9 AND project_kind='portfolio' RETURNING *`,
      [title, category, location, description, image_url, cloudinary_public_id, size, status, id, additional_images ? JSON.stringify(additional_images) : '[]']
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
      "SELECT id, additional_images FROM projects WHERE id = $1 AND project_kind = 'portfolio'",
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
      }).catch(e => console.error('Cloudinary delete error:', e));
    }
    
    // Delete additional images
    const projectRow = portfolioProject.rows[0];
    if (projectRow.additional_images && Array.isArray(projectRow.additional_images)) {
      for (const img of projectRow.additional_images) {
        if (img.cloudinary_public_id) {
          await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              public_id: img.cloudinary_public_id,
              api_key: process.env.CLOUDINARY_API_KEY,
              timestamp: Math.floor(Date.now() / 1000),
            }),
          }).catch(e => console.error('Cloudinary additional delete error:', e));
        }
      }
    }

    await pool.query("DELETE FROM projects WHERE id = $1 AND project_kind = 'portfolio'", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
