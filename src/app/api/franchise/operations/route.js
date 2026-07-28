import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { ensureAgentSchema } from '@/lib/agent-auth';
import { getFranchiseAccess, franchiseAccessResponse } from '@/lib/franchise-access';
import { ensureAgentNotificationsSchema } from '@/lib/agent-notifications';

const RESOURCES = new Set(['construction_services', 'quick_services', 'vendors', 'agents']);
const clean = (value) => String(value || '').trim();
const slugify = (value) => clean(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function ensureSchema() {
  await ensureAgentSchema();
  await pool.query(`ALTER TABLE primary_services ADD COLUMN IF NOT EXISTS created_by_franchise_id INTEGER`);
  await pool.query(`ALTER TABLE primary_services ADD COLUMN IF NOT EXISTS cities TEXT[] NOT NULL DEFAULT '{}'`);
  await pool.query(`ALTER TABLE quick_services ADD COLUMN IF NOT EXISTS created_by_franchise_id INTEGER`);
  await pool.query(`ALTER TABLE quick_services ADD COLUMN IF NOT EXISTS cities TEXT[] NOT NULL DEFAULT '{}'`);
  await pool.query(`ALTER TABLE quick_services ADD COLUMN IF NOT EXISTS slug TEXT`);
  await pool.query(`ALTER TABLE quick_services ADD COLUMN IF NOT EXISTS visiting_price DECIMAL(10,2) DEFAULT 0`);
  await pool.query(`ALTER TABLE quick_services ADD COLUMN IF NOT EXISTS is_service_active BOOLEAN DEFAULT TRUE`);
  await pool.query(`ALTER TABLE agents ADD COLUMN IF NOT EXISTS created_by_franchise_id INTEGER`);
  await pool.query(`ALTER TABLE vendors ADD COLUMN IF NOT EXISTS created_by_franchise_id INTEGER`);
}

async function authorize(req, permission) {
  const access = await getFranchiseAccess(req, permission);
  if (!access.allowed) return { response: franchiseAccessResponse(access) };
  await ensureSchema();
  return { access };
}

function invalidResource() {
  return NextResponse.json({ success: false, error: 'Invalid management resource' }, { status: 400 });
}

function temporaryPassword(prefix) {
  return `${prefix}@${Math.random().toString(36).slice(2, 8)}${Math.floor(10 + Math.random() * 90)}`;
}

async function ownedService(table, id, franchiseId) {
  const result = await pool.query(
    `SELECT * FROM ${table} WHERE id = $1 AND created_by_franchise_id = $2`,
    [id, franchiseId]
  );
  return result.rows[0] || null;
}

export async function GET(req) {
  try {
    const resource = new URL(req.url).searchParams.get('resource');
    if (!RESOURCES.has(resource)) return invalidResource();
    const viewPermission = resource === 'agents' ? 'agents.manage_directory' : `${resource}.view`;
    const { access, response } = await authorize(req, viewPermission);
    if (response) return response;
    const city = access.franchise.city;
    let data = [];
    let services = [];

    if (resource === 'construction_services') {
      data = (await pool.query(
        `SELECT id, slug, title, description, image, created_at
           FROM primary_services
          WHERE created_by_franchise_id = $1
          ORDER BY id DESC`,
        [access.user.id]
      )).rows;
    } else if (resource === 'quick_services') {
      data = (await pool.query(
        `SELECT id, slug, label, description, icon, base_price, visiting_price,
                duration, is_service_active, cities, created_at
           FROM quick_services
          WHERE created_by_franchise_id = $1
          ORDER BY id DESC`,
        [access.user.id]
      )).rows;
    } else if (resource === 'agents') {
      data = (await pool.query(
        `SELECT id, name, email, phone, city, state, occupation, agent_type,
                experience, status, login_enabled, created_by_franchise_id, created_at
           FROM agents
          WHERE LOWER(TRIM(COALESCE(city, ''))) = LOWER(TRIM($1))
          ORDER BY created_at DESC`,
        [city]
      )).rows;
    } else {
      data = (await pool.query(
        `SELECT v.id, v.email, v.phone, v.city, v.state, v.postal_code,
                COALESCE(v.shop_name, v.business_name, SPLIT_PART(v.email, '@', 1)) AS shop_name,
                v.status, v.verification_status, v.is_approved,
                v.created_by_franchise_id, v.created_at,
                COALESCE(json_agg(json_build_object('id', qs.id, 'label', qs.label))
                  FILTER (WHERE qs.id IS NOT NULL), '[]') AS services
           FROM vendors v
           LEFT JOIN vendor_services vs ON vs.vendor_id = v.id AND vs.is_active = TRUE
           LEFT JOIN quick_services qs ON qs.id = vs.quick_service_id
          WHERE LOWER(TRIM(COALESCE(v.city, ''))) = LOWER(TRIM($1))
          GROUP BY v.id
          ORDER BY v.created_at DESC`,
        [city]
      )).rows;
      services = (await pool.query(
        `SELECT id, label FROM quick_services
          WHERE COALESCE(is_service_active, TRUE) = TRUE
            AND EXISTS (
              SELECT 1 FROM UNNEST(COALESCE(cities, '{}'::text[])) configured_city
              WHERE LOWER(TRIM(configured_city)) = LOWER(TRIM($1))
            )
          ORDER BY label`,
        [city]
      )).rows;
    }
    return NextResponse.json({ success: true, data, services });
  } catch (error) {
    console.error('Franchise operations GET error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const resource = body.resource;
    if (!RESOURCES.has(resource)) return invalidResource();
    const { access, response } = await authorize(req, `${resource}.create`);
    if (response) return response;
    const franchise = access.franchise;

    if (resource === 'construction_services') {
      if (!access.permissions['construction_services.upload_images']) {
        return NextResponse.json({ success: false, error: 'Permission denied: construction_services.upload_images' }, { status: 403 });
      }
      const title = clean(body.title);
      const description = clean(body.description);
      const image = clean(body.image);
      if (!title || !description || !image) {
        return NextResponse.json({ success: false, error: 'Title, description and image are required' }, { status: 400 });
      }
      const result = await pool.query(
        `INSERT INTO primary_services (slug, title, description, image, cities, created_by_franchise_id)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [`${slugify(title)}-${access.user.id}-${Date.now()}`, title, description, image, [franchise.city], access.user.id]
      );
      return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
    }

    if (resource === 'quick_services') {
      if (!access.permissions['quick_services.upload_images']) {
        return NextResponse.json({ success: false, error: 'Permission denied: quick_services.upload_images' }, { status: 403 });
      }
      const label = clean(body.label);
      const description = clean(body.description);
      const icon = clean(body.icon);
      const duration = clean(body.duration);
      const basePrice = Number(body.base_price);
      const visitingPrice = Number(body.visiting_price);
      if (!label || !description || !icon || !duration || !Number.isFinite(basePrice) || basePrice < 0) {
        return NextResponse.json({ success: false, error: 'Name, description, image, duration and valid price are required' }, { status: 400 });
      }
      const result = await pool.query(
        `INSERT INTO quick_services (
          slug, label, description, icon, base_price, visiting_price, duration,
          cities, is_service_active, created_by_franchise_id
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,TRUE,$9) RETURNING *`,
        [
          `${slugify(label)}-${access.user.id}-${Date.now()}`, label, description, icon,
          access.permissions['quick_services.manage_pricing'] ? basePrice : 0,
          access.permissions['quick_services.manage_pricing'] && Number.isFinite(visitingPrice) ? visitingPrice : 0,
          duration, [franchise.city], access.user.id,
        ]
      );
      return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
    }

    if (resource === 'agents') {
      const name = clean(body.name);
      const email = clean(body.email).toLowerCase();
      const phone = clean(body.phone);
      if (!name || !email || !phone) {
        return NextResponse.json({ success: false, error: 'Name, email and phone are required' }, { status: 400 });
      }
      const result = await pool.query(
        `INSERT INTO agents (
          name, email, phone, city, state, occupation, agent_type, experience,
          status, created_by_franchise_id
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'Pending',$9)
        RETURNING id, name, email, phone, city, state, occupation, agent_type, experience, status, created_at`,
        [name, email, phone, franchise.city, franchise.state || '', clean(body.occupation), clean(body.agent_type) || 'Agent', clean(body.experience), access.user.id]
      );
      return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
    }

    const email = clean(body.email).toLowerCase();
    const phone = clean(body.phone);
    const password = clean(body.password);
    const postalCode = clean(body.postal_code);
    const aadharNumber = clean(body.aadhar_number).replace(/\s/g, '');
    if (!email || !phone || password.length < 8 || !/^\d{6}$/.test(postalCode) || !/^\d{12}$/.test(aadharNumber)) {
      return NextResponse.json({ success: false, error: 'Valid email, phone, 8-character password, 6-digit postal code and 12-digit Aadhaar are required' }, { status: 400 });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const columnsResult = await pool.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'vendors'`
    );
    const columns = new Set(columnsResult.rows.map((row) => row.column_name));
    const fields = {
      email, password_hash: passwordHash, phone, city: franchise.city,
      state: franchise.state || '', country: 'India', postal_code: postalCode,
      status: 'inactive', verification_status: 'pending', is_approved: false,
      created_by_franchise_id: access.user.id,
    };
    if (columns.has('shop_name')) fields.shop_name = clean(body.shop_name) || email.split('@')[0];
    if (columns.has('business_name')) fields.business_name = clean(body.shop_name) || email.split('@')[0];
    if (columns.has('aadhar_number')) fields.aadhar_number = aadharNumber;
    const names = Object.keys(fields).filter((key) => columns.has(key));
    const values = names.map((key) => fields[key]);
    const result = await pool.query(
      `INSERT INTO vendors (${names.join(',')}, created_at, updated_at)
       VALUES (${values.map((_, index) => `$${index + 1}`).join(',')}, NOW(), NOW())
       RETURNING id, email, phone, city, state, postal_code, status, verification_status, is_approved, created_at`,
      values
    );
    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Franchise operations POST error:', error);
    const status = error.code === '23505' ? 409 : 500;
    return NextResponse.json({ success: false, error: error.code === '23505' ? 'Email or service already exists' : error.message || 'Server error' }, { status });
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json();
    const resource = body.resource;
    if (!RESOURCES.has(resource) || !body.id) return invalidResource();
    const permission = body.action === 'approve' ? `${resource}.approve`
      : body.action === 'reject' ? `${resource}.reject`
      : body.action === 'status' ? `${resource}.manage_status`
      : body.action === 'reset_password' ? `${resource}.reset_password`
      : body.action === 'services' ? `${resource}.manage_services`
      : body.action === 'image' ? `${resource}.upload_images`
      : body.action === 'pricing' ? `${resource}.manage_pricing`
      : `${resource}.edit`;
    const { access, response } = await authorize(req, permission);
    if (response) return response;
    const city = access.franchise.city;

    if (resource === 'construction_services' || resource === 'quick_services') {
      const table = resource === 'construction_services' ? 'primary_services' : 'quick_services';
      const current = await ownedService(table, body.id, access.user.id);
      if (!current) return NextResponse.json({ success: false, error: 'Record not found or not owned by this franchise' }, { status: 404 });
      if (body.image && body.image !== (current.image || current.icon)
        && !access.permissions[`${resource}.upload_images`]) {
        return NextResponse.json({ success: false, error: `Permission denied: ${resource}.upload_images` }, { status: 403 });
      }
      if (resource === 'construction_services') {
        const result = await pool.query(
          `UPDATE primary_services SET title=$1, description=$2, image=$3, updated_at=NOW()
            WHERE id=$4 AND created_by_franchise_id=$5 RETURNING *`,
          [clean(body.title) || current.title, clean(body.description) || current.description, clean(body.image) || current.image, body.id, access.user.id]
        );
        return NextResponse.json({ success: true, data: result.rows[0] });
      }
      const basePrice = Number(body.base_price);
      const visitingPrice = Number(body.visiting_price);
      const result = await pool.query(
        `UPDATE quick_services SET
          label=$1, description=$2, icon=$3, duration=$4,
          base_price=$5, visiting_price=$6,
          is_service_active=$7
         WHERE id=$8 AND created_by_franchise_id=$9 RETURNING *`,
        [
          clean(body.label) || current.label, clean(body.description) || current.description,
          clean(body.image) || current.icon, clean(body.duration) || current.duration,
          access.permissions['quick_services.manage_pricing'] && Number.isFinite(basePrice) ? basePrice : current.base_price,
          access.permissions['quick_services.manage_pricing'] && Number.isFinite(visitingPrice) ? visitingPrice : current.visiting_price,
          access.permissions['quick_services.manage_status'] && typeof body.is_service_active === 'boolean' ? body.is_service_active : current.is_service_active,
          body.id, access.user.id,
        ]
      );
      return NextResponse.json({ success: true, data: result.rows[0] });
    }

    if (resource === 'agents') {
      await ensureAgentNotificationsSchema();
      const currentResult = await pool.query(
        `SELECT * FROM agents WHERE id=$1 AND LOWER(TRIM(COALESCE(city,'')))=LOWER(TRIM($2))`,
        [body.id, city]
      );
      const current = currentResult.rows[0];
      if (!current) return NextResponse.json({ success: false, error: 'Agent not found in franchise city' }, { status: 404 });
      if (body.action === 'approve' || body.action === 'reset_password') {
        const password = temporaryPassword('Agent');
        const passwordHash = await bcrypt.hash(password, 10);
        const result = await pool.query(
          `UPDATE agents SET status='Approved', login_enabled=TRUE, password_hash=$1,
            must_change_password=TRUE, auth_version=auth_version+1, approved_at=NOW(),
            approved_by=$2, updated_at=NOW() WHERE id=$3 RETURNING id,name,email,phone,city,state,status,login_enabled`,
          [passwordHash, access.franchise.email, body.id]
        );
        return NextResponse.json({ success: true, data: result.rows[0], temporaryPassword: password });
      }
      if (body.action === 'status') {
        const allowedStatuses = new Set(['Pending', 'Reviewing', 'Rejected']);
        if (!allowedStatuses.has(body.status)) return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
        const result = await pool.query(
          `UPDATE agents SET status=$1, login_enabled=FALSE, updated_at=NOW() WHERE id=$2 RETURNING id,name,email,phone,city,state,status`,
          [body.status, body.id]
        );
        return NextResponse.json({ success: true, data: result.rows[0] });
      }
      const result = await pool.query(
        `UPDATE agents SET name=$1,email=$2,phone=$3,state=$4,occupation=$5,agent_type=$6,experience=$7,updated_at=NOW()
          WHERE id=$8 RETURNING id,name,email,phone,city,state,occupation,agent_type,experience,status`,
        [clean(body.name) || current.name, clean(body.email).toLowerCase() || current.email, clean(body.phone) || current.phone,
          clean(body.state) || current.state, clean(body.occupation), clean(body.agent_type) || current.agent_type,
          clean(body.experience), body.id]
      );
      return NextResponse.json({ success: true, data: result.rows[0] });
    }

    const vendorResult = await pool.query(
      `SELECT * FROM vendors WHERE id=$1 AND LOWER(TRIM(COALESCE(city,'')))=LOWER(TRIM($2))`,
      [body.id, city]
    );
    const vendor = vendorResult.rows[0];
    if (!vendor) return NextResponse.json({ success: false, error: 'Vendor not found in franchise city' }, { status: 404 });
    if (body.action === 'approve' || body.action === 'reject' || body.action === 'status') {
      const approved = body.action === 'approve';
      const rejected = body.action === 'reject';
      const nextActive = body.action === 'status' ? Boolean(body.active) : approved;
      const result = await pool.query(
        `UPDATE vendors SET is_approved=$1, verification_status=$2, status=$3, updated_at=NOW()
          WHERE id=$4 RETURNING id,email,phone,city,state,status,verification_status,is_approved`,
        [
          approved ? true : rejected ? false : vendor.is_approved,
          approved ? 'verified' : rejected ? 'rejected' : vendor.verification_status,
          nextActive ? 'active' : 'inactive', body.id,
        ]
      );
      return NextResponse.json({ success: true, data: result.rows[0] });
    }
    if (body.action === 'services') {
      const ids = [...new Set((body.services || []).map(Number).filter(Number.isInteger))];
      const valid = await pool.query(
        `SELECT id FROM quick_services WHERE id=ANY($1::int[]) AND COALESCE(is_service_active,TRUE)=TRUE
          AND EXISTS (SELECT 1 FROM UNNEST(COALESCE(cities,'{}'::text[])) c WHERE LOWER(TRIM(c))=LOWER(TRIM($2)))`,
        [ids, city]
      );
      if (valid.rows.length !== ids.length) return NextResponse.json({ success: false, error: 'Invalid service selection for franchise city' }, { status: 400 });
      await pool.query(`UPDATE vendor_services SET is_active=FALSE WHERE vendor_id=$1`, [body.id]);
      for (const id of ids) {
        await pool.query(
          `INSERT INTO vendor_services(vendor_id,quick_service_id,is_active) VALUES($1,$2,TRUE)
           ON CONFLICT(vendor_id,quick_service_id) DO UPDATE SET is_active=TRUE`,
          [body.id, id]
        );
      }
      return NextResponse.json({ success: true });
    }
    const result = await pool.query(
      `UPDATE vendors SET phone=$1,state=$2,postal_code=$3,
        shop_name=COALESCE(NULLIF($4,''),shop_name), updated_at=NOW()
       WHERE id=$5 RETURNING id,email,phone,city,state,postal_code,status,verification_status,is_approved`,
      [clean(body.phone) || vendor.phone, clean(body.state) || vendor.state, clean(body.postal_code) || vendor.postal_code, clean(body.shop_name), body.id]
    );
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Franchise operations PATCH error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const body = await req.json();
    const resource = body.resource;
    if (!RESOURCES.has(resource) || !body.id) return invalidResource();
    const { access, response } = await authorize(req, `${resource}.delete`);
    if (response) return response;
    let result;
    if (resource === 'construction_services' || resource === 'quick_services') {
      const table = resource === 'construction_services' ? 'primary_services' : 'quick_services';
      result = await pool.query(
        `DELETE FROM ${table} WHERE id=$1 AND created_by_franchise_id=$2 RETURNING id`,
        [body.id, access.user.id]
      );
    } else {
      const table = resource;
      result = await pool.query(
        `DELETE FROM ${table} WHERE id=$1 AND created_by_franchise_id=$2
          AND LOWER(TRIM(COALESCE(city,'')))=LOWER(TRIM($3)) RETURNING id`,
        [body.id, access.user.id, access.franchise.city]
      );
    }
    if (!result.rows[0]) return NextResponse.json({ success: false, error: 'Record not found, not owned, or has linked work' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Franchise operations DELETE error:', error);
    return NextResponse.json({ success: false, error: error.code === '23503' ? 'Cannot delete a record with linked work' : error.message || 'Server error' }, { status: error.code === '23503' ? 409 : 500 });
  }
}
