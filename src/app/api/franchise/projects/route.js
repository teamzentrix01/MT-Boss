import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureProjectOpsSchema, getProjectSummaries } from '@/lib/project-ops';
import { franchiseAccessResponse, getFranchiseAccess } from '@/lib/franchise-access';

async function ensureProjectColumns() {
  await ensureProjectOpsSchema();
}

async function ensureAgentIsApproved(agentId, city = '') {
  if (!agentId) return null;
  const result = await pool.query(
    `SELECT id FROM agents
      WHERE id = $1 AND status = 'Approved' AND login_enabled = TRUE AND must_change_password = FALSE
        AND ($2 = '' OR LOWER(TRIM(COALESCE(city, ''))) = LOWER(TRIM($2)))`,
    [agentId, String(city || '').trim()]
  );
  return result.rows[0] || null;
}

const PROJECT_STATUSES = new Set([
  'lead', 'estimate_sent', 'final', 'started', 'ongoing', 'running',
  'on_hold', 'completed', 'cancelled', 'lost',
]);

function filterProject(project, permissions) {
  const visible = { ...project };
  const can = (...keys) => keys.some((key) => permissions[key]);
  if (!can('projects.view_client_details', 'projects.manage_clients')) {
    delete visible.client_name;
    delete visible.client_phone;
    delete visible.client_email;
  }
  if (!can('projects.view_notes', 'projects.manage_notes')) delete visible.project_notes;
  if (!can('projects.view_assigned_agent', 'agents.assign', 'agents.assign_projects')) {
    delete visible.assigned_agent_id;
    delete visible.assigned_agent_name;
    delete visible.assigned_agent_email;
    delete visible.assigned_agent_phone;
  }
  if (!can('financials.view', 'financials.view_deal', 'financials.edit_deal')) delete visible.deal_amount;
  if (!can('financials.view', 'financials.view_payments')) {
    delete visible.total_received;
    delete visible.payment_count;
  }
  if (!can('financials.view', 'financials.view_costs')) {
    for (const field of [
      'labour_cost', 'labour_paid', 'material_cost', 'extra_expense',
      'transport_cost', 'transport_count', 'contractor_cost',
      'contractor_contract_value', 'contractor_count',
    ]) {
      delete visible[field];
    }
  }
  if (!can('financials.view', 'financials.view_commission')) delete visible.agent_commission;
  if (!can('financials.view', 'financials.view_profit_loss')) delete visible.profit_loss;
  return visible;
}

export async function GET(req) {
  try {
    const access = await getFranchiseAccess(req, 'projects.view');
    if (!access.allowed) return franchiseAccessResponse(access);

    const data = await getProjectSummaries(
      "WHERE p.franchise_id = $1 AND p.project_kind = 'operational'",
      [access.user.id]
    );

    return NextResponse.json({
      success: true,
      data: data.map((project) => filterProject(project, access.permissions)),
    });
  } catch (error) {
    console.error('Franchise projects fetch error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const access = await getFranchiseAccess(req, 'projects.create');
    if (!access.allowed) return franchiseAccessResponse(access);
    const franchise = access.user;

    await ensureProjectColumns();
    const {
      title,
      category,
      description,
      image_url,
      cloudinary_public_id,
      size,
      status,
      assigned_agent_id,
      project_notes,
      client_name,
      client_phone,
      client_email,
      deal_amount,
      project_status,
    } = await req.json();

    if (!title || !category || !image_url) {
      return NextResponse.json({ success: false, error: 'Title, category and image are required' }, { status: 400 });
    }

    if (assigned_agent_id && !access.permissions['agents.assign'] && !access.permissions['agents.assign_projects']) {
      return NextResponse.json({ success: false, error: 'Permission denied: agents.assign_projects' }, { status: 403 });
    }
    if (project_status && !PROJECT_STATUSES.has(project_status)) {
      return NextResponse.json({ success: false, error: 'Invalid project status' }, { status: 400 });
    }
    const parsedDealAmount = Number(deal_amount || 0);
    if (!Number.isFinite(parsedDealAmount) || parsedDealAmount < 0) {
      return NextResponse.json({ success: false, error: 'Deal amount must be a valid non-negative number' }, { status: 400 });
    }

    const projectCity = franchise.city || '';
    if (assigned_agent_id && !(await ensureAgentIsApproved(assigned_agent_id, projectCity))) {
      return NextResponse.json({ success: false, error: 'Select an approved agent from the project city' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO projects (
        title, category, location, description, image_url, cloudinary_public_id,
        size, status, franchise_id, assigned_agent_id, created_by_role, project_notes,
        client_name, client_phone, client_email, deal_amount, project_status,
        project_kind, assigned_by_role, assigned_by_id, assigned_at
      )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'franchise',$11,$12,$13,$14,$15,$16,
               'operational', CASE WHEN $10::INTEGER IS NULL THEN NULL ELSE 'franchise' END,
               CASE WHEN $10::INTEGER IS NULL THEN NULL ELSE $9 END,
               CASE WHEN $10::INTEGER IS NULL THEN NULL ELSE NOW() END)
       RETURNING *`,
      [
        title,
        category,
        projectCity,
        description || '',
        image_url,
        cloudinary_public_id || '',
        size || 'small',
        access.permissions['projects.publish'] && status !== 'draft' ? 'published' : 'draft',
        franchise.id,
        assigned_agent_id || null,
        access.permissions['projects.manage_notes'] ? project_notes || '' : '',
        access.permissions['projects.manage_clients'] ? client_name || null : null,
        access.permissions['projects.manage_clients'] ? client_phone || null : null,
        access.permissions['projects.manage_clients'] ? client_email || null : null,
        access.permissions['financials.edit_deal'] ? parsedDealAmount : 0,
        access.permissions['projects.manage_stage'] ? project_status || 'lead' : 'lead',
      ]
    );

    return NextResponse.json(
      { success: true, data: filterProject(result.rows[0], access.permissions) },
      { status: 201 }
    );
  } catch (error) {
    console.error('Franchise project create error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const access = await getFranchiseAccess(req, 'projects.view');
    if (!access.allowed) return franchiseAccessResponse(access);
    const franchise = access.user;

    await ensureProjectColumns();
    const {
      id,
      title,
      category,
      description,
      image_url,
      cloudinary_public_id,
      size,
      status,
      assigned_agent_id,
      project_notes,
      client_name,
      client_phone,
      client_email,
      deal_amount,
      project_status,
    } = await req.json();

    if (!id || !title || !category || !image_url) {
      return NextResponse.json({ success: false, error: 'Project id, title, category and image are required' }, { status: 400 });
    }
    if (project_status && !PROJECT_STATUSES.has(project_status)) {
      return NextResponse.json({ success: false, error: 'Invalid project status' }, { status: 400 });
    }
    const parsedDealAmount = Number(deal_amount || 0);
    if (access.permissions['financials.edit_deal'] && (!Number.isFinite(parsedDealAmount) || parsedDealAmount < 0)) {
      return NextResponse.json({ success: false, error: 'Deal amount must be a valid non-negative number' }, { status: 400 });
    }

    const currentProjectResult = await pool.query(
      `SELECT *
         FROM projects
        WHERE id = $1 AND franchise_id = $2 AND project_kind = 'operational'`,
      [id, franchise.id]
    );
    const currentProject = currentProjectResult.rows[0];
    if (!currentProject) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    const permits = (...keys) => keys.some((key) => access.permissions[key]);
    const changed = (key, next) => String(currentProject[key] ?? '') !== String(next ?? '');
    const deny = (permission) => NextResponse.json(
      { success: false, error: `Permission denied: ${permission}` },
      { status: 403 }
    );
    const currentCore = {
      title: currentProject.title || '',
      category: currentProject.category || '',
      description: currentProject.description || '',
      size: currentProject.size || 'small',
    };
    const requestedCore = { title, category, description: description || '', size: size || 'small' };
    if (Object.keys(requestedCore).some((key) => String(currentCore[key]) !== String(requestedCore[key] ?? ''))
      && !permits('projects.edit')) return deny('projects.edit');
    if ((changed('image_url', image_url) || changed('cloudinary_public_id', cloudinary_public_id || ''))
      && !permits('projects.manage_images')) return deny('projects.manage_images');
    if (String(currentProject.status || 'published') !== (status === 'draft' ? 'draft' : 'published')
      && !permits('projects.publish')) return deny('projects.publish');
    if (String(currentProject.project_status || 'lead') !== String(project_status || 'lead')
      && !permits('projects.manage_stage')) return deny('projects.manage_stage');
    if ([
      ['client_name', client_name || null], ['client_phone', client_phone || null],
      ['client_email', client_email || null],
    ].some(([key, value]) => changed(key, value)) && !permits('projects.manage_clients')) return deny('projects.manage_clients');
    if (changed('project_notes', project_notes || '') && !permits('projects.manage_notes')) return deny('projects.manage_notes');
    if (Number(currentProject.deal_amount || 0) !== parsedDealAmount
      && !permits('financials.edit_deal')) return deny('financials.edit_deal');

    const requestedAgentId = assigned_agent_id || null;
    const currentAgentId = currentProject.assigned_agent_id || null;
    if (String(requestedAgentId || '') !== String(currentAgentId || '')
      && !permits('agents.assign', 'agents.assign_projects')) {
      return deny('agents.assign_projects');
    }

    if (assigned_agent_id && !(await ensureAgentIsApproved(assigned_agent_id, franchise.city || ''))) {
      return NextResponse.json({ success: false, error: 'Select an approved agent from the project city' }, { status: 400 });
    }

    const result = await pool.query(
      `UPDATE projects
       SET title=$1, category=$2, location=$3, description=$4,
           image_url=$5, cloudinary_public_id=$6, size=$7, status=$8,
           assigned_agent_id=$9, project_notes=$10,
           client_name=$11, client_phone=$12, client_email=$13,
           deal_amount=$14, project_status=$15,
           assigned_by_role=CASE WHEN $9::INTEGER IS NULL THEN NULL ELSE 'franchise' END,
           assigned_by_id=CASE WHEN $9::INTEGER IS NULL THEN NULL ELSE $17 END,
           assigned_at=CASE WHEN assigned_agent_id IS DISTINCT FROM $9::INTEGER THEN NOW() ELSE assigned_at END
       WHERE id=$16 AND franchise_id=$17 AND project_kind='operational'
       RETURNING *`,
      [
        title,
        category,
        franchise.city || '',
        description || '',
        image_url,
        cloudinary_public_id || '',
        size || 'small',
        status === 'draft' ? 'draft' : 'published',
        assigned_agent_id || null,
        project_notes || '',
        client_name || null,
        client_phone || null,
        client_email || null,
        access.permissions['financials.edit_deal'] ? parsedDealAmount : Number(currentProject.deal_amount || 0),
        project_status || 'lead',
        id,
        franchise.id,
      ]
    );

    if (!result.rows[0]) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: filterProject(result.rows[0], access.permissions) });
  } catch (error) {
    console.error('Franchise project update error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const access = await getFranchiseAccess(req, 'projects.delete');
    if (!access.allowed) return franchiseAccessResponse(access);
    const franchise = access.user;

    await ensureProjectColumns();
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'Project id is required' }, { status: 400 });
    }

    const result = await pool.query(
      "DELETE FROM projects WHERE id = $1 AND franchise_id = $2 AND project_kind = 'operational' RETURNING id",
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
