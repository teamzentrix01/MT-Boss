import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureProjectManagementSchema, assertAgentAccess, actorFromAdmin } from '@/lib/project-management';
import { createInitializationGuard } from '@/lib/api-utils';

const ensureLocalVendorsTable = createInitializationGuard(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pm_project_local_vendors (
      id BIGSERIAL PRIMARY KEY,
      project_id BIGINT NOT NULL REFERENCES pm_projects(id) ON DELETE CASCADE,
      name VARCHAR(200) NOT NULL,
      phone VARCHAR(30),
      city VARCHAR(100),
      address TEXT,
      material_type VARCHAR(100),
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_by TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(project_id, name)
    );
    CREATE INDEX IF NOT EXISTS pm_project_local_vendors_proj_idx ON pm_project_local_vendors(project_id);
    CREATE INDEX IF NOT EXISTS pm_project_local_vendors_proj_active_idx ON pm_project_local_vendors(project_id, is_active) WHERE is_active;
  `);
});

export async function GET(req) {
  try {
    await ensureProjectManagementSchema();
    await ensureLocalVendorsTable();
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId') ? Number(searchParams.get('projectId')) : null;

    if (!projectId || !Number.isInteger(projectId)) {
      return NextResponse.json({ success: false, error: 'Valid projectId is required' }, { status: 400 });
    }

    const auth = await assertAgentAccess(req, projectId, ['construction', 'payments']);
    if (!auth.allowed) return auth.response;

    const res = await pool.query(
      `SELECT id, project_id, name, phone, city, address, material_type, is_active, created_by, created_at
       FROM pm_project_local_vendors
       WHERE project_id = $1 AND is_active
       ORDER BY name ASC`,
      [projectId]
    );

    return NextResponse.json({ success: true, localVendors: res.rows });
  } catch (error) {
    console.error('Error fetching local vendors:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch local vendors' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await ensureProjectManagementSchema();
    await ensureLocalVendorsTable();
    const body = await req.json();
    const projectId = Number(body.projectId || body.project_id);
    const name = String(body.name || '').trim();
    const phone = String(body.phone || '').trim();
    const city = String(body.city || '').trim();
    const address = String(body.address || '').trim();
    const materialType = String(body.material_type || body.materialType || '').trim();

    if (!projectId || !Number.isInteger(projectId)) {
      return NextResponse.json({ success: false, error: 'Valid projectId is required' }, { status: 400 });
    }
    if (!name) {
      return NextResponse.json({ success: false, error: 'Vendor name is required' }, { status: 400 });
    }

    const auth = await assertAgentAccess(req, projectId, ['construction', 'payments']);
    if (!auth.allowed) return auth.response;

    const createdBy = actorFromAdmin(auth.user);

    // Check if vendor already exists for this project (case-insensitive)
    const existing = await pool.query(
      `SELECT id, name FROM pm_project_local_vendors 
       WHERE project_id = $1 AND LOWER(TRIM(name)) = LOWER(TRIM($2))`,
      [projectId, name]
    );

    if (existing.rows.length > 0) {
      // If already exists, update details and ensure active
      const updated = await pool.query(
        `UPDATE pm_project_local_vendors
         SET phone = COALESCE(NULLIF($3, ''), phone),
             city = COALESCE(NULLIF($4, ''), city),
             address = COALESCE(NULLIF($5, ''), address),
             material_type = COALESCE(NULLIF($6, ''), material_type),
             is_active = TRUE
         WHERE id = $1
         RETURNING *`,
        [existing.rows[0].id, projectId, phone, city, address, materialType]
      );
      return NextResponse.json({
        success: true,
        message: 'Local vendor already existed and details were updated',
        localVendor: updated.rows[0],
      });
    }

    const res = await pool.query(
      `INSERT INTO pm_project_local_vendors (project_id, name, phone, city, address, material_type, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [projectId, name, phone, city, address, materialType, createdBy]
    );

    return NextResponse.json({
      success: true,
      message: 'Local vendor added successfully',
      localVendor: res.rows[0],
    });
  } catch (error) {
    console.error('Error creating local vendor:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to save local vendor' }, { status: 500 });
  }
}
