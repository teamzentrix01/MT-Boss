import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireRole, unauthorized, verifyBearer } from '@/lib/auth';
import { cleanText, normalizePhone, validateContactFields } from '@/lib/validation';
import { datesOverlap, ensurePropertyListingSchema } from '@/lib/property-listings';

async function findOverlappingApproved(client, propertyId, startDate, endDate, excludeId = null) {
  const vals = [propertyId];
  let sql = `
    SELECT id, start_date, end_date, status
    FROM property_bookings
    WHERE property_id = $1 AND status = 'approved'
  `;
  if (excludeId) {
    vals.push(excludeId);
    sql += ` AND id <> $${vals.length}`;
  }
  const result = await client.query(sql, vals);
  return result.rows.filter((row) => datesOverlap(startDate, endDate, row.start_date, row.end_date));
}

export async function GET(req) {
  try {
    await ensurePropertyListingSchema();
    const user = verifyBearer(req);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const propertyId = searchParams.get('property_id');
    const status = searchParams.get('status');
    const mine = searchParams.get('mine') === 'true';

    if (id) {
      const result = await pool.query(
        `SELECT b.*, p.title AS property_title, p.property_category, p.location AS property_location,
                p.images AS property_images, p.listing_type
         FROM property_bookings b
         JOIN properties p ON p.id = b.property_id
         WHERE b.id = $1`,
        [id]
      );
      if (!result.rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      const booking = result.rows[0];
      const isAdmin = requireRole(req, 'admin');
      const isOwner = user?.role === 'user' && booking.user_id === user.id;
      if (!isAdmin && !isOwner) return unauthorized();
      return NextResponse.json({ success: true, data: booking });
    }

    if (mine) {
      if (!user || user.role !== 'user') return unauthorized();
      const result = await pool.query(
        `SELECT b.*, p.title AS property_title, p.property_category, p.location AS property_location,
                p.price, p.price_raw, p.images AS property_images
         FROM property_bookings b
         JOIN properties p ON p.id = b.property_id
         WHERE b.user_id = $1
         ORDER BY b.created_at DESC`,
        [user.id]
      );
      return NextResponse.json({ success: true, data: result.rows });
    }

    if (!requireRole(req, 'admin')) return unauthorized();

    const q = (searchParams.get('q') || '').trim();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '25', 10) || 25));
    const offset = (page - 1) * limit;
    const sort = ['created_at', 'start_date', 'status'].includes(searchParams.get('sort'))
      ? searchParams.get('sort')
      : 'created_at';
    const order = String(searchParams.get('order') || 'desc').toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    const vals = [];
    const where = [];
    if (propertyId) {
      vals.push(propertyId);
      where.push(`b.property_id = $${vals.length}`);
    }
    if (status && status !== 'all') {
      vals.push(status);
      where.push(`b.status = $${vals.length}`);
    }
    if (q) {
      vals.push(`%${q}%`);
      where.push(`(
        b.name ILIKE $${vals.length}
        OR b.phone ILIKE $${vals.length}
        OR COALESCE(b.email,'') ILIKE $${vals.length}
        OR p.title ILIKE $${vals.length}
      )`);
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const countRes = await pool.query(
      `SELECT COUNT(*)::INT AS total
       FROM property_bookings b
       JOIN properties p ON p.id = b.property_id
       ${whereSql}`,
      vals
    );
    const total = countRes.rows[0]?.total || 0;
    vals.push(limit, offset);
    const result = await pool.query(
      `SELECT b.*, p.title AS property_title, p.property_category, p.location AS property_location,
              p.seller_name, p.seller_phone
       FROM property_bookings b
       JOIN properties p ON p.id = b.property_id
       ${whereSql}
       ORDER BY b.${sort} ${order}, b.id DESC
       LIMIT $${vals.length - 1} OFFSET $${vals.length}`,
      vals
    );
    return NextResponse.json({
      success: true,
      data: result.rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
      sort: { field: sort, order: order.toLowerCase() },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await ensurePropertyListingSchema();
    const body = await req.json();
    const user = verifyBearer(req);

    const propertyId = Number(body.property_id);
    const name = cleanText(body.name || user?.name || '');
    const email = cleanText(body.email || user?.email || '').toLowerCase();
    const phone = normalizePhone(body.phone || user?.phone || '');
    const startDate = body.start_date;
    const endDate = body.end_date || null;
    const durationMonths = body.duration_months != null ? Number(body.duration_months) : null;
    const message = body.message ? String(body.message) : null;

    if (!propertyId || !name || !phone || !startDate) {
      return NextResponse.json({ error: 'property_id, name, phone and start_date are required' }, { status: 400 });
    }

    const contactError = validateContactFields({
      name,
      email: email || undefined,
      phone,
      phoneRequired: true,
      emailRequired: false,
      nameLabel: 'Name',
    });
    if (contactError) return NextResponse.json({ error: contactError }, { status: 400 });

    const propertyRes = await pool.query(
      `SELECT id, status, property_category, listing_type, available_from
       FROM properties WHERE id=$1`,
      [propertyId]
    );
    if (!propertyRes.rows.length || propertyRes.rows[0].status !== 'verified') {
      return NextResponse.json({ error: 'Property not available for booking' }, { status: 404 });
    }

    const property = propertyRes.rows[0];
    if (property.property_category === 'plot') {
      return NextResponse.json({ error: 'Plots do not support booking requests. Please send an enquiry instead.' }, { status: 400 });
    }

    const overlaps = await findOverlappingApproved(pool, propertyId, startDate, endDate);
    if (overlaps.length) {
      return NextResponse.json(
        { error: 'Selected dates overlap an existing confirmed booking', conflicts: overlaps },
        { status: 409 }
      );
    }

    const result = await pool.query(
      `INSERT INTO property_bookings
        (property_id, user_id, name, email, phone, start_date, end_date, duration_months, message, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'requested')
       RETURNING *`,
      [
        propertyId,
        user?.role === 'user' ? user.id : null,
        name,
        email || null,
        phone,
        startDate,
        endDate,
        durationMonths,
        message,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        data: result.rows[0],
        message: 'Booking request submitted. It is not confirmed until approved.',
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await ensurePropertyListingSchema();
    const body = await req.json();
    const { id, action, admin_notes } = body;
    if (!id || !action) {
      return NextResponse.json({ error: 'id and action are required' }, { status: 400 });
    }

    const existing = await pool.query(`SELECT * FROM property_bookings WHERE id=$1`, [id]);
    if (!existing.rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const booking = existing.rows[0];
    const user = verifyBearer(req);
    const isAdmin = requireRole(req, 'admin');

    if (action === 'cancel') {
      const isOwner = user?.role === 'user' && booking.user_id === user.id;
      if (!isAdmin && !isOwner) return unauthorized();
      if (!['requested', 'approved'].includes(booking.status)) {
        return NextResponse.json({ error: 'Only requested or approved bookings can be cancelled' }, { status: 400 });
      }
      const r = await pool.query(
        `UPDATE property_bookings SET status='cancelled', updated_at=NOW(), admin_notes=COALESCE($2, admin_notes)
         WHERE id=$1 RETURNING *`,
        [id, admin_notes || null]
      );
      return NextResponse.json({ success: true, data: r.rows[0] });
    }

    if (!isAdmin) return unauthorized();

    if (action === 'reject') {
      const r = await pool.query(
        `UPDATE property_bookings
         SET status='rejected', admin_notes=$2, reviewed_by=$3, reviewed_at=NOW(), updated_at=NOW()
         WHERE id=$1 RETURNING *`,
        [id, admin_notes || null, user.id || null]
      );
      return NextResponse.json({ success: true, data: r.rows[0] });
    }

    if (action === 'approve') {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const locked = await client.query(
          `SELECT * FROM property_bookings WHERE id=$1 FOR UPDATE`,
          [id]
        );
        if (!locked.rows.length) {
          await client.query('ROLLBACK');
          return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }
        const row = locked.rows[0];
        if (row.status !== 'requested') {
          await client.query('ROLLBACK');
          return NextResponse.json({ error: 'Only requested bookings can be approved' }, { status: 400 });
        }

        const overlaps = await findOverlappingApproved(
          client,
          row.property_id,
          row.start_date,
          row.end_date,
          row.id
        );
        if (overlaps.length) {
          await client.query('ROLLBACK');
          return NextResponse.json(
            { error: 'Cannot approve: overlapping confirmed booking exists', conflicts: overlaps },
            { status: 409 }
          );
        }

        const r = await client.query(
          `UPDATE property_bookings
           SET status='approved', admin_notes=$2, reviewed_by=$3, reviewed_at=NOW(), updated_at=NOW()
           WHERE id=$1 RETURNING *`,
          [id, admin_notes || null, user.id || null]
        );
        await client.query('COMMIT');
        return NextResponse.json({ success: true, data: r.rows[0] });
      } catch (e) {
        await client.query('ROLLBACK');
        throw e;
      } finally {
        client.release();
      }
    }

    if (action === 'complete') {
      const r = await pool.query(
        `UPDATE property_bookings
         SET status='completed', admin_notes=COALESCE($2, admin_notes), reviewed_by=$3, reviewed_at=NOW(), updated_at=NOW()
         WHERE id=$1 RETURNING *`,
        [id, admin_notes || null, user.id || null]
      );
      return NextResponse.json({ success: true, data: r.rows[0] });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
