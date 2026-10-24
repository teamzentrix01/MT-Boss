import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireRole, unauthorized, verifyBearer } from '@/lib/auth';
import { cleanText, normalizePhone, validateContactFields } from '@/lib/validation';
import { createInitializationGuard } from '@/lib/api-utils';
import { notifyAdminSubmission, deliverPropertyEnquiryNotification } from '@/lib/customer-communications';

const ensureTable = createInitializationGuard(async () => {
  await pool.query(`CREATE TABLE IF NOT EXISTS property_enquiries (
    id SERIAL PRIMARY KEY, property_id INTEGER NOT NULL, property_title VARCHAR(250) NOT NULL,
    property_type VARCHAR(100), property_location VARCHAR(200), enquirer_name VARCHAR(200) NOT NULL,
    enquirer_phone VARCHAR(20) NOT NULL, enquirer_email VARCHAR(200), message TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'new', created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  )`);
  await pool.query(`ALTER TABLE property_enquiries ADD COLUMN IF NOT EXISTS user_id INTEGER`);
  await pool.query(`ALTER TABLE property_enquiries ADD COLUMN IF NOT EXISTS listing_type VARCHAR(50)`);
  await pool.query(`ALTER TABLE property_enquiries ADD COLUMN IF NOT EXISTS property_price VARCHAR(100)`);
  await pool.query(`ALTER TABLE property_enquiries ADD COLUMN IF NOT EXISTS owner_name VARCHAR(200)`);
  await pool.query(`ALTER TABLE property_enquiries ADD COLUMN IF NOT EXISTS owner_phone VARCHAR(50)`);
  await pool.query(`ALTER TABLE property_enquiries ADD COLUMN IF NOT EXISTS owner_email VARCHAR(200)`);
  await pool.query(`ALTER TABLE property_enquiries ADD COLUMN IF NOT EXISTS owner_user_id INTEGER`);
  await pool.query(`ALTER TABLE property_enquiries ADD COLUMN IF NOT EXISTS admin_notes TEXT`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_pe_status_created ON property_enquiries (status, created_at DESC)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_pe_user_id ON property_enquiries (user_id)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_pe_owner_user_id ON property_enquiries (owner_user_id)`);
});

export async function POST(req) {
  try {
    await ensureTable();
    const body = await req.json();
    const propertyId = Number(body.property_id);
    const currentUser = verifyBearer(req, 'user');
    const name = cleanText(body.name);
    const phone = normalizePhone(body.phone);
    const email = cleanText(body.email).toLowerCase();
    const message = cleanText(body.message);
    if (!Number.isInteger(propertyId) || propertyId <= 0) return NextResponse.json({ success: false, error: 'Invalid property' }, { status: 400 });
    const contactError = validateContactFields({ name, phone, email: email || undefined, emailRequired: false, nameLabel: 'Full name' });
    if (contactError) return NextResponse.json({ success: false, error: contactError }, { status: 400 });

    const found = await pool.query(
      `SELECT id, title, type, listing_type, price, location, address, seller_type, seller_name, seller_phone, seller_email, lister_user_id
       FROM properties WHERE id=$1 AND status='verified'`,
      [propertyId]
    );
    if (!found.rows.length) return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    const property = found.rows[0];

    const owner = {
      name: property.seller_name || 'Property Owner',
      phone: property.seller_phone || null,
      email: property.seller_email || null,
      userId: property.lister_user_id || null,
    };

    const result = await pool.query(
      `INSERT INTO property_enquiries
        (property_id, property_title, property_type, property_location, listing_type, property_price,
         enquirer_name, enquirer_phone, enquirer_email, message, user_id,
         owner_name, owner_phone, owner_email, owner_user_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
      [
        property.id,
        property.title,
        property.type,
        property.location,
        property.listing_type || 'buy',
        property.price || null,
        name,
        phone,
        email || null,
        message || null,
        currentUser?.id || null,
        owner.name,
        owner.phone,
        owner.email,
        owner.userId,
      ]
    );

    const createdEnquiry = result.rows[0];

    // Notify Admin with comprehensive inquiry, property, and owner details
    await notifyAdminSubmission({
      type: `Property Inquiry (${property.listing_type === 'rent' ? 'Rent' : 'Sell/Buy'})`,
      name,
      phone,
      email,
      reference: `PROP-ENQ-${createdEnquiry.id}`,
      details: {
        'Property Title': property.title,
        'Listing Type': property.listing_type === 'rent' ? 'For Rent' : 'For Sale / Buy',
        'Location': property.location,
        'Property Price': property.price ? `₹${property.price}` : 'Not specified',
        'Customer Message': message || 'No message provided',
        'Property Owner': owner.name,
        'Owner Phone': owner.phone || 'N/A',
        'Owner Email': owner.email || 'N/A',
      },
    });

    // Notify Property Owner and send Customer Acknowledgment
    await deliverPropertyEnquiryNotification({
      enquiry: { id: createdEnquiry.id, name, phone, email, message },
      property,
      owner,
    });

    return NextResponse.json({ success: true, data: createdEnquiry }, { status: 201 });
  } catch (error) {
    console.error('POST property enquiry error:', error);
    return NextResponse.json({ success: false, error: 'Unable to submit enquiry' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await ensureTable();
    const user = verifyBearer(req, 'user');
    if (user) {
      // User can see enquiries submitted by themselves OR enquiries received for their properties
      const result = await pool.query(
        `SELECT id, property_id, property_title, property_location, listing_type,
                enquirer_name, enquirer_phone, enquirer_email, message, status,
                admin_notes, user_id, owner_user_id, owner_name, owner_email,
                created_at, updated_at
          FROM property_enquiries
          WHERE user_id=$1
             OR owner_user_id=$1
             OR (owner_email IS NOT NULL AND LOWER(TRIM(owner_email))=LOWER(TRIM($2)))
             OR (enquirer_email IS NOT NULL AND LOWER(TRIM(enquirer_email))=LOWER(TRIM($2)))
          ORDER BY created_at DESC
          LIMIT 100`,
        [user.id, user.email || '']
      );
      return NextResponse.json({ success: true, data: result.rows });
    }
    if (!requireRole(req, 'admin')) return unauthorized();
    const { searchParams } = new URL(req.url);
    const status = (searchParams.get('status') || '').trim();
    const listingType = (searchParams.get('listing_type') || '').trim().toLowerCase();
    const q = (searchParams.get('q') || '').trim();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '25', 10) || 25));
    const offset = (page - 1) * limit;
    const sort = ['created_at', 'status', 'property_title'].includes(searchParams.get('sort'))
      ? searchParams.get('sort')
      : 'created_at';
    const order = String(searchParams.get('order') || 'desc').toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    const metricsOnly = searchParams.get('metrics') === '1' || searchParams.get('counts') === '1';

    if (metricsOnly) {
      const metricsRes = await pool.query(`
        SELECT
          COUNT(*)::INT AS total,
          COUNT(*) FILTER (WHERE status = 'new')::INT AS new_count,
          COUNT(*) FILTER (WHERE status = 'contacted')::INT AS contacted_count,
          COUNT(*) FILTER (WHERE status = 'converted')::INT AS converted_count,
          COUNT(*) FILTER (WHERE COALESCE(listing_type, 'buy') = 'buy')::INT AS buy_count,
          COUNT(*) FILTER (WHERE COALESCE(listing_type, 'buy') = 'rent')::INT AS rent_count
        FROM property_enquiries
      `);
      const m = metricsRes.rows[0] || {};
      return NextResponse.json({
        success: true,
        data: {
          total: m.total || 0,
          newCount: m.new_count || 0,
          contactedCount: m.contacted_count || 0,
          convertedCount: m.converted_count || 0,
          buyCount: m.buy_count || 0,
          rentCount: m.rent_count || 0,
        },
      });
    }

    const vals = [];
    const where = [];
    if (status && status !== 'all') {
      vals.push(status);
      where.push(`status = $${vals.length}`);
    }
    if (listingType === 'buy' || listingType === 'rent') {
      vals.push(listingType);
      where.push(`COALESCE(listing_type, 'buy') = $${vals.length}`);
    }
    if (q) {
      vals.push(`%${q}%`);
      where.push(`(
        property_title ILIKE $${vals.length}
        OR enquirer_name ILIKE $${vals.length}
        OR enquirer_phone ILIKE $${vals.length}
        OR COALESCE(enquirer_email,'') ILIKE $${vals.length}
        OR COALESCE(property_location,'') ILIKE $${vals.length}
        OR COALESCE(owner_name,'') ILIKE $${vals.length}
      )`);
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const countRes = await pool.query(`SELECT COUNT(*)::INT AS total FROM property_enquiries ${whereSql}`, vals);
    const total = countRes.rows[0]?.total || 0;
    vals.push(limit, offset);
    const result = await pool.query(
      `SELECT * FROM property_enquiries ${whereSql}
       ORDER BY ${sort} ${order}, id DESC
       LIMIT $${vals.length - 1} OFFSET $${vals.length}`,
      vals
    );
    let metrics = null;
    if (page === 1 || searchParams.get('include_metrics') === '1') {
      const metricsRes = await pool.query(`
        SELECT
          COUNT(*)::INT AS total,
          COUNT(*) FILTER (WHERE status = 'new')::INT AS new_count,
          COUNT(*) FILTER (WHERE status = 'contacted')::INT AS contacted_count,
          COUNT(*) FILTER (WHERE status = 'converted')::INT AS converted_count,
          COUNT(*) FILTER (WHERE COALESCE(listing_type, 'buy') = 'buy')::INT AS buy_count,
          COUNT(*) FILTER (WHERE COALESCE(listing_type, 'buy') = 'rent')::INT AS rent_count
        FROM property_enquiries
      `);
      const m = metricsRes.rows[0] || {};
      metrics = {
        total: m.total || 0,
        newCount: m.new_count || 0,
        contactedCount: m.contacted_count || 0,
        convertedCount: m.converted_count || 0,
        buyCount: m.buy_count || 0,
        rentCount: m.rent_count || 0,
      };
    }

    return NextResponse.json({
      success: true,
      data: result.rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
      sort: { field: sort, order: order.toLowerCase() },
      ...(metrics ? { metrics } : {}),
    });
  } catch (error) {
    console.error('GET property enquiries error:', error);
    return NextResponse.json({ success: false, error: 'Unable to load enquiries' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();
    await ensureTable();
    const { id, status, admin_notes } = await req.json();
    if (!id) return NextResponse.json({ success: false, error: 'Inquiry ID is required' }, { status: 400 });

    const updates = [];
    const vals = [];

    if (status) {
      if (!['new', 'contacted', 'follow-up', 'converted', 'lost'].includes(status)) {
        return NextResponse.json({ success: false, error: 'Invalid status update' }, { status: 400 });
      }
      vals.push(status);
      updates.push(`status=$${vals.length}`);
    }

    if (admin_notes !== undefined) {
      vals.push(cleanText(admin_notes));
      updates.push(`admin_notes=$${vals.length}`);
    }

    updates.push(`updated_at=NOW()`);
    vals.push(id);

    const result = await pool.query(
      `UPDATE property_enquiries SET ${updates.join(', ')} WHERE id=$${vals.length} RETURNING *`,
      vals
    );
    if (!result.rows.length) return NextResponse.json({ success: false, error: 'Enquiry not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('PATCH property enquiry error:', error);
    return NextResponse.json({ success: false, error: 'Unable to update enquiry' }, { status: 500 });
  }
}
