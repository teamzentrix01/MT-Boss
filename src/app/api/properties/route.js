import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireRole, unauthorized, verifyBearer } from '@/lib/auth';
import { cleanText, normalizePhone, validateContactFields } from '@/lib/validation';
import { resolveManagedCity } from '@/lib/cities';
import { createInitializationGuard } from '@/lib/api-utils';

const ensurePropertiesSchema = createInitializationGuard(async () => {
  await pool.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS area_unit VARCHAR(20) NOT NULL DEFAULT 'sqft'`);
  await pool.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS lister_user_id INTEGER`);
  await pool.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS tracking_token VARCHAR(64)`);
  await pool.query(`ALTER TABLE properties ALTER COLUMN status SET DEFAULT 'pending'`);
  await pool.query(`UPDATE properties SET tracking_token = CONCAT('PROP-', id, '-', SUBSTRING(MD5(RANDOM()::TEXT), 1, 8)) WHERE tracking_token IS NULL`);
  await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS properties_tracking_token_idx ON properties (tracking_token)`);
});

// GET — public. ?listing_type=buy|rent&status=verified for public pages.
//       ?status=all for admin (requires token).
export async function GET(req) {
  try {
    await ensurePropertiesSchema();
    const { searchParams } = new URL(req.url);
    const listing_type = searchParams.get('listing_type'); // buy | rent | null = all
    const status       = searchParams.get('status');       // verified | pending | rejected | all
    const id           = searchParams.get('id');
    const mine         = searchParams.get('mine');
    const tracking     = cleanText(searchParams.get('tracking') || '').toUpperCase();

    // Single property
    if (id) {
      const user = verifyBearer(req);
      const vals = [id];
      let query = `SELECT * FROM properties WHERE id=$1 AND status='verified'`;

      if (requireRole(req, 'admin')) {
        query = `SELECT * FROM properties WHERE id=$1`;
      } else if (user?.role === 'user') {
        vals.push(user.id);
        query = `SELECT * FROM properties WHERE id=$1 AND (status='verified' OR lister_user_id=$2)`;
      }

      const result = await pool.query(query, vals);
      if (result.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json({ success: true, data: result.rows[0] });
    }

    if (mine === 'true') {
      const user = verifyBearer(req);

      if (user?.role === 'user') {
        const result = await pool.query(
          `SELECT * FROM properties WHERE lister_user_id=$1 ORDER BY created_at DESC`,
          [user.id]
        );
        return NextResponse.json({ success: true, data: result.rows });
      }

      if (!tracking) {
        return NextResponse.json({ error: 'Enter a tracking id to view listing status' }, { status: 400 });
      }

      const result = await pool.query(
        `SELECT * FROM properties WHERE UPPER(tracking_token)=$1 ORDER BY created_at DESC`,
        [tracking]
      );
      return NextResponse.json({ success: true, data: result.rows });
    }

    // Admin wants all — requires token
    if (status === 'all') {
      if (!requireRole(req, 'admin')) return unauthorized();
      const result = await pool.query(`SELECT * FROM properties ORDER BY created_at DESC`);
      return NextResponse.json({ success: true, data: result.rows });
    }

    // Public — only verified
    let query  = `SELECT * FROM properties WHERE status = 'verified'`;
    const vals = [];
    if (listing_type) { vals.push(listing_type); query += ` AND listing_type = $${vals.length}`; }
    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, vals);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST — public (seller submits listing)
export async function POST(req) {
  try {
    await ensurePropertiesSchema();
    const {
      title, type, listing_type, category,
      price, price_raw, location, address,
      beds, baths, area, area_unit, description,
      highlights, images, tag,
      seller_type, seller_name, seller_phone, seller_email,
    } = await req.json();
    const currentUser = verifyBearer(req);
    const listerUserId = currentUser?.role === 'user' ? currentUser.id : null;
    const trackingToken = `PROP-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`.toUpperCase();

    if (!title || !type || !listing_type || !price || !price_raw || !location) {
      return NextResponse.json({ error: 'title, type, listing_type, price, price_raw and location are required' }, { status: 400 });
    }
    const canonicalLocation = await resolveManagedCity(location);
    if (!canonicalLocation) {
      return NextResponse.json({ error: 'Select an active city from the city list' }, { status: 400 });
    }
    const cleanSellerName = seller_name ? cleanText(seller_name) : null;
    const cleanSellerEmail = seller_email ? cleanText(seller_email).toLowerCase() : null;
    const cleanSellerPhone = seller_phone ? normalizePhone(seller_phone) : null;
    const contactError = validateContactFields({
      name: cleanSellerName || undefined,
      email: cleanSellerEmail || undefined,
      phone: cleanSellerPhone || undefined,
      phoneRequired: false,
      emailRequired: false,
      nameLabel: 'Seller name',
    });
    if (contactError) return NextResponse.json({ error: contactError }, { status: 400 });

    const result = await pool.query(
      `INSERT INTO properties
        (title, type, listing_type, category, price, price_raw, location, address,
         beds, baths, area, area_unit, description, highlights, images, tag,
         seller_type, seller_name, seller_phone, seller_email, status, verified_at, lister_user_id, tracking_token)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,'pending',NULL,$21,$22)
       RETURNING *`,
      [
        title, type, listing_type, category || type.toLowerCase(),
        price, price_raw, canonicalLocation, address || null,
        beds || null, baths || null, area || null,
        ['sqft', 'sqm', 'sqyd'].includes(area_unit) ? area_unit : 'sqft',
        description || null,
        JSON.stringify(highlights || []),
        JSON.stringify(images || []),
        tag || 'New',
        seller_type || 'owner',
        cleanSellerName, cleanSellerPhone, cleanSellerEmail,
        listerUserId, trackingToken,
      ]
    );
    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT — admin only (verify / reject / edit)
export async function PUT(req) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();
    await ensurePropertiesSchema();

    const body = await req.json();
    const { id, action } = body;

    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    // Quick status actions
    if (action === 'verify') {
      const r = await pool.query(
        `UPDATE properties SET status='verified', verified_at=NOW(), updated_at=NOW() WHERE id=$1 RETURNING *`, [id]
      );
      return NextResponse.json({ success: true, data: r.rows[0] });
    }
    if (action === 'reject') {
      const r = await pool.query(
        `UPDATE properties SET status='rejected', updated_at=NOW() WHERE id=$1 RETURNING *`, [id]
      );
      return NextResponse.json({ success: true, data: r.rows[0] });
    }
    if (action === 'pending') {
      const r = await pool.query(
        `UPDATE properties SET status='pending', verified_at=NULL, updated_at=NOW() WHERE id=$1 RETURNING *`, [id]
      );
      return NextResponse.json({ success: true, data: r.rows[0] });
    }

    // Full edit
    const {
      title, type, listing_type, category,
      price, price_raw, location, address,
      beds, baths, area, area_unit, description,
      highlights, images, tag,
      seller_type, seller_name, seller_phone, seller_email,
    } = body;
    const canonicalLocation = await resolveManagedCity(location);
    if (!canonicalLocation) {
      return NextResponse.json({ error: 'Select an active city from the city list' }, { status: 400 });
    }
    const cleanSellerName = seller_name ? cleanText(seller_name) : null;
    const cleanSellerEmail = seller_email ? cleanText(seller_email).toLowerCase() : null;
    const cleanSellerPhone = seller_phone ? normalizePhone(seller_phone) : null;
    const contactError = validateContactFields({
      name: cleanSellerName || undefined,
      email: cleanSellerEmail || undefined,
      phone: cleanSellerPhone || undefined,
      phoneRequired: false,
      emailRequired: false,
      nameLabel: 'Seller name',
    });
    if (contactError) return NextResponse.json({ error: contactError }, { status: 400 });

    const r = await pool.query(
      `UPDATE properties SET
        title=$1, type=$2, listing_type=$3, category=$4,
        price=$5, price_raw=$6, location=$7, address=$8,
        beds=$9, baths=$10, area=$11, area_unit=$12, description=$13,
        highlights=$14, images=$15, tag=$16,
        seller_type=$17, seller_name=$18, seller_phone=$19, seller_email=$20,
        updated_at=NOW()
       WHERE id=$21 RETURNING *`,
      [
        title, type, listing_type, category,
        price, price_raw, canonicalLocation, address,
        beds, baths, area,
        ['sqft', 'sqm', 'sqyd'].includes(area_unit) ? area_unit : 'sqft',
        description,
        JSON.stringify(highlights || []),
        JSON.stringify(images || []),
        tag, seller_type, cleanSellerName, cleanSellerPhone, cleanSellerEmail,
        id,
      ]
    );
    return NextResponse.json({ success: true, data: r.rows[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE — admin only
export async function DELETE(req) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    await pool.query(`DELETE FROM properties WHERE id=$1`, [id]);
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
