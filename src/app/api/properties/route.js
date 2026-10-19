import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireRole, unauthorized, verifyBearer } from '@/lib/auth';
import { cleanText, normalizePhone, validateContactFields } from '@/lib/validation';
import { resolveManagedCity } from '@/lib/cities';
import {
  coerceDetails,
  defaultListingType,
  defaultTypeForCategory,
  ensurePropertyListingSchema,
  normalizeAmenities,
  normalizeCategory,
  normalizeNearbyPlaces,
  parseJsonField,
} from '@/lib/property-listings';

function mapRow(row) {
  if (!row) return row;
  return {
    ...row,
    images: parseJsonField(row.images, []),
    highlights: parseJsonField(row.highlights, []),
    amenities: parseJsonField(row.amenities, []),
    nearby_places: parseJsonField(row.nearby_places, []),
    details: parseJsonField(row.details, {}),
    floor_plans: parseJsonField(row.floor_plans, []),
    documents: parseJsonField(row.documents, []),
  };
}

function mapListRow(row) {
  if (!row) return row;
  const images = parseJsonField(row.images, []);
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    listing_type: row.listing_type,
    category: row.category,
    property_category: row.property_category,
    price: row.price,
    price_raw: row.price_raw,
    security_deposit: row.security_deposit,
    location: row.location,
    locality: row.locality,
    address: row.address,
    beds: row.beds,
    baths: row.baths,
    area: row.area,
    area_unit: row.area_unit,
    status: row.status,
    seller_name: row.seller_name,
    seller_type: row.seller_type,
    furnishing: row.furnishing,
    available_from: row.available_from,
    created_at: row.created_at,
    updated_at: row.updated_at,
    images: images.slice(0, 1),
    thumbnail: images[0] || null,
    details: row.details ? { bhk_config: parseJsonField(row.details, {})?.bhk_config } : {},
  };
}

const PROPERTY_SORT = {
  created_at: 'created_at',
  price_raw: 'price_raw',
  title: 'title',
  status: 'status',
};

function buildListingPayload(body, { forUpdate = false } = {}) {
  const category = normalizeCategory(body.property_category) || (forUpdate ? null : 'general');
  const listing_type = defaultListingType(category || 'general', body.listing_type);
  const type = cleanText(body.type || '') || defaultTypeForCategory(category || 'general');
  const title = cleanText(body.title || '');
  const priceRaw = Number(body.price_raw != null ? body.price_raw : String(body.price || '').replace(/\D/g, ''));
  const price = body.price != null ? String(body.price) : String(priceRaw || '');

  return {
    category,
    listing_type,
    type,
    title,
    price,
    price_raw: Number.isFinite(priceRaw) ? priceRaw : 0,
    location: body.location,
    address: body.address ? cleanText(body.address) : null,
    beds: body.beds != null ? Number(body.beds) : null,
    baths: body.baths != null ? Number(body.baths) : null,
    area: body.area != null ? Number(body.area) : null,
    area_unit: ['sqft', 'sqm', 'sqyd'].includes(body.area_unit) ? body.area_unit : 'sqft',
    description: body.description ? String(body.description) : null,
    highlights: Array.isArray(body.highlights) ? body.highlights : [],
    images: Array.isArray(body.images) ? body.images : [],
    tag: body.tag || 'New',
    seller_type: body.seller_type || 'owner',
    seller_name: body.seller_name ? cleanText(body.seller_name) : null,
    seller_phone: body.seller_phone ? normalizePhone(body.seller_phone) : null,
    seller_email: body.seller_email ? cleanText(body.seller_email).toLowerCase() : null,
    property_category: category,
    details: coerceDetails(category || 'general', body.details || {}),
    amenities: normalizeAmenities(body.amenities || body.highlights),
    nearby_places: normalizeNearbyPlaces(body.nearby_places),
    security_deposit: body.security_deposit != null ? Number(body.security_deposit) : null,
    latitude: body.latitude != null ? Number(body.latitude) : null,
    longitude: body.longitude != null ? Number(body.longitude) : null,
    locality: body.locality ? cleanText(body.locality) : null,
    state: body.state ? cleanText(body.state) : null,
    postal_code: body.postal_code ? cleanText(body.postal_code) : null,
    available_from: body.available_from || null,
    furnishing: body.furnishing ? cleanText(body.furnishing) : null,
    floor_plans: Array.isArray(body.floor_plans) ? body.floor_plans : [],
    documents: Array.isArray(body.documents) ? body.documents : [],
    category_label: body.category || (category ? category : type.toLowerCase()),
  };
}

// GET — public filters + admin all + single id + mine
export async function GET(req) {
  try {
    await ensurePropertyListingSchema();
    const { searchParams } = new URL(req.url);
    const listing_type = searchParams.get('listing_type');
    const status = searchParams.get('status');
    const id = searchParams.get('id');
    const mine = searchParams.get('mine');
    const tracking = cleanText(searchParams.get('tracking') || '').toUpperCase();
    const category = normalizeCategory(searchParams.get('category') || searchParams.get('property_category'));
    const q = cleanText(searchParams.get('q') || searchParams.get('search') || '');
    const city = cleanText(searchParams.get('city') || searchParams.get('location') || '');
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    const bhk = cleanText(searchParams.get('bhk') || searchParams.get('bhk_config') || '');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '25', 10) || 25));
    const offset = (page - 1) * limit;
    const availableOnly = searchParams.get('available') === 'true';
    const fields = searchParams.get('fields') === 'full' ? 'full' : 'list';
    const sortKey = PROPERTY_SORT[searchParams.get('sort')] ? searchParams.get('sort') : 'created_at';
    const order = String(searchParams.get('order') || 'desc').toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    const sortSql = PROPERTY_SORT[sortKey];
    const countsOnly = searchParams.get('counts') === '1' || searchParams.get('counts') === 'true';

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
      return NextResponse.json({ success: true, data: mapRow(result.rows[0]) });
    }

    if (mine === 'true') {
      const user = verifyBearer(req);

      if (user?.role === 'user') {
        const result = await pool.query(
          `SELECT * FROM properties WHERE lister_user_id=$1 ORDER BY created_at DESC`,
          [user.id]
        );
        return NextResponse.json({ success: true, data: result.rows.map(mapRow) });
      }

      if (!tracking) {
        return NextResponse.json({ error: 'Enter a tracking id to view listing status' }, { status: 400 });
      }

      const result = await pool.query(
        `SELECT * FROM properties WHERE UPPER(tracking_token)=$1 ORDER BY created_at DESC`,
        [tracking]
      );
      return NextResponse.json({ success: true, data: result.rows.map(mapRow) });
    }

    const isAdmin = Boolean(requireRole(req, 'admin'));
    if (status === 'all' && !isAdmin) return unauthorized();

    const vals = [];
    const where = [];

    if (status === 'all') {
      // admin: no status filter
    } else if (status && ['pending', 'verified', 'rejected'].includes(status)) {
      if (!isAdmin && status !== 'verified') return unauthorized();
      vals.push(status);
      where.push(`status = $${vals.length}`);
    } else {
      where.push(`status = 'verified'`);
    }

    if (listing_type === 'buy' || listing_type === 'rent') {
      vals.push(listing_type);
      where.push(`listing_type = $${vals.length}`);
    }
    if (category) {
      vals.push(category);
      where.push(`property_category = $${vals.length}`);
    }
    if (city) {
      vals.push(`%${city}%`);
      where.push(`(location ILIKE $${vals.length} OR locality ILIKE $${vals.length} OR address ILIKE $${vals.length})`);
    }
    if (q) {
      vals.push(`%${q}%`);
      where.push(`(
        title ILIKE $${vals.length}
        OR CAST(id AS TEXT) ILIKE $${vals.length}
        OR location ILIKE $${vals.length}
        OR locality ILIKE $${vals.length}
        OR COALESCE(seller_name,'') ILIKE $${vals.length}
        OR COALESCE(address,'') ILIKE $${vals.length}
      )`);
    }
    if (minPrice != null && minPrice !== '') {
      vals.push(Number(minPrice));
      where.push(`price_raw >= $${vals.length}`);
    }
    if (maxPrice != null && maxPrice !== '') {
      vals.push(Number(maxPrice));
      where.push(`price_raw <= $${vals.length}`);
    }
    if (bhk) {
      vals.push(`%${bhk}%`);
      where.push(`(details->>'bhk_config' ILIKE $${vals.length} OR type ILIKE $${vals.length})`);
    }
    if (availableOnly) {
      where.push(`(available_from IS NULL OR available_from <= CURRENT_DATE)`);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    if (countsOnly) {
      const countByListing = await pool.query(
        `SELECT listing_type, COUNT(*)::INT AS count
         FROM properties ${whereSql}
         GROUP BY listing_type`,
        vals
      );
      const counts = { buy: 0, rent: 0, total: 0 };
      for (const row of countByListing.rows) {
        counts[row.listing_type] = row.count;
        counts.total += row.count;
      }
      return NextResponse.json({ success: true, data: counts });
    }

    const countRes = await pool.query(`SELECT COUNT(*)::INT AS total FROM properties ${whereSql}`, vals);
    const total = countRes.rows[0]?.total || 0;

    const selectSql = fields === 'full'
      ? 'SELECT *'
      : `SELECT id, title, type, listing_type, category, property_category, price, price_raw,
               security_deposit, location, locality, address, beds, baths, area, area_unit,
               status, seller_name, seller_type, furnishing, available_from, created_at, updated_at,
               images, details`;

    vals.push(limit);
    vals.push(offset);
    const result = await pool.query(
      `${selectSql} FROM properties ${whereSql}
       ORDER BY ${sortSql} ${order}, id DESC
       LIMIT $${vals.length - 1} OFFSET $${vals.length}`,
      vals
    );

    const rows = fields === 'full' ? result.rows.map(mapRow) : result.rows.map(mapListRow);
    return NextResponse.json({
      success: true,
      data: rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
      sort: { field: sortKey, order: order.toLowerCase() },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST — public seller submit OR admin create (admin can verify immediately)
export async function POST(req) {
  try {
    await ensurePropertyListingSchema();
    const body = await req.json();
    const currentUser = verifyBearer(req);
    const isAdmin = currentUser?.role === 'admin';
    const payload = buildListingPayload(body);

    if (!payload.title || !payload.type || !payload.listing_type || !payload.price || !payload.price_raw || !payload.location) {
      return NextResponse.json({ error: 'title, type, listing_type, price, price_raw and location are required' }, { status: 400 });
    }
    if (!payload.property_category) {
      return NextResponse.json({ error: 'property_category must be room_rent, flat, plot, or general' }, { status: 400 });
    }

    const canonicalLocation = await resolveManagedCity(payload.location);
    if (!canonicalLocation) {
      return NextResponse.json({ error: 'Select an active city from the city list' }, { status: 400 });
    }

    const contactError = validateContactFields({
      name: payload.seller_name || undefined,
      email: payload.seller_email || undefined,
      phone: payload.seller_phone || undefined,
      phoneRequired: false,
      emailRequired: false,
      nameLabel: 'Seller name',
    });
    if (contactError) return NextResponse.json({ error: contactError }, { status: 400 });

    const listerUserId = currentUser?.role === 'user' ? currentUser.id : (body.lister_user_id || null);
    const trackingToken = `PROP-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`.toUpperCase();
    const publish = isAdmin && (body.status === 'verified' || body.publish === true);
    const status = publish ? 'verified' : 'pending';

    const result = await pool.query(
      `INSERT INTO properties
        (title, type, listing_type, category, price, price_raw, location, address,
         beds, baths, area, area_unit, description, highlights, images, tag,
         seller_type, seller_name, seller_phone, seller_email, status, verified_at,
         lister_user_id, tracking_token, property_category, details, amenities, nearby_places,
         security_deposit, latitude, longitude, locality, state, postal_code,
         available_from, furnishing, floor_plans, documents)
       VALUES (
         $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14::jsonb,$15::jsonb,$16,
         $17,$18,$19,$20,$21,$22,$23,$24,$25,$26::jsonb,$27::jsonb,$28::jsonb,
         $29,$30,$31,$32,$33,$34,$35,$36,$37::jsonb,$38::jsonb
       )
       RETURNING *`,
      [
        payload.title,
        payload.type,
        payload.listing_type,
        payload.category_label,
        payload.price,
        payload.price_raw,
        canonicalLocation,
        payload.address,
        payload.beds,
        payload.baths,
        payload.area,
        payload.area_unit,
        payload.description,
        JSON.stringify(payload.highlights),
        JSON.stringify(payload.images),
        payload.tag,
        payload.seller_type,
        payload.seller_name,
        payload.seller_phone,
        payload.seller_email,
        status,
        publish ? new Date() : null,
        listerUserId,
        trackingToken,
        payload.property_category,
        JSON.stringify(payload.details),
        JSON.stringify(payload.amenities),
        JSON.stringify(payload.nearby_places),
        payload.security_deposit,
        payload.latitude,
        payload.longitude,
        payload.locality,
        payload.state,
        payload.postal_code,
        payload.available_from,
        payload.furnishing,
        JSON.stringify(payload.floor_plans),
        JSON.stringify(payload.documents),
      ]
    );

    return NextResponse.json({ success: true, data: mapRow(result.rows[0]) }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT — admin verify / reject / edit
export async function PUT(req) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();
    await ensurePropertyListingSchema();

    const body = await req.json();
    const { id, action } = body;
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    if (action === 'verify' || action === 'publish') {
      const r = await pool.query(
        `UPDATE properties SET status='verified', verified_at=NOW(), updated_at=NOW() WHERE id=$1 RETURNING *`,
        [id]
      );
      return NextResponse.json({ success: true, data: mapRow(r.rows[0]) });
    }
    if (action === 'reject' || action === 'unpublish') {
      const r = await pool.query(
        `UPDATE properties SET status='rejected', updated_at=NOW() WHERE id=$1 RETURNING *`,
        [id]
      );
      return NextResponse.json({ success: true, data: mapRow(r.rows[0]) });
    }
    if (action === 'pending') {
      const r = await pool.query(
        `UPDATE properties SET status='pending', verified_at=NULL, updated_at=NOW() WHERE id=$1 RETURNING *`,
        [id]
      );
      return NextResponse.json({ success: true, data: mapRow(r.rows[0]) });
    }

    const existing = await pool.query(`SELECT * FROM properties WHERE id=$1`, [id]);
    if (!existing.rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const current = mapRow(existing.rows[0]);

    const payload = buildListingPayload(
      {
        ...current,
        ...body,
        property_category: body.property_category || current.property_category,
        details: body.details != null ? body.details : current.details,
        amenities: body.amenities != null ? body.amenities : current.amenities,
        nearby_places: body.nearby_places != null ? body.nearby_places : current.nearby_places,
      },
      { forUpdate: true }
    );

    const canonicalLocation = await resolveManagedCity(payload.location || current.location);
    if (!canonicalLocation) {
      return NextResponse.json({ error: 'Select an active city from the city list' }, { status: 400 });
    }

    const contactError = validateContactFields({
      name: payload.seller_name || undefined,
      email: payload.seller_email || undefined,
      phone: payload.seller_phone || undefined,
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
        highlights=$14::jsonb, images=$15::jsonb, tag=$16,
        seller_type=$17, seller_name=$18, seller_phone=$19, seller_email=$20,
        property_category=$21, details=$22::jsonb, amenities=$23::jsonb, nearby_places=$24::jsonb,
        security_deposit=$25, latitude=$26, longitude=$27, locality=$28, state=$29, postal_code=$30,
        available_from=$31, furnishing=$32, floor_plans=$33::jsonb, documents=$34::jsonb,
        updated_at=NOW()
       WHERE id=$35 RETURNING *`,
      [
        payload.title || current.title,
        payload.type || current.type,
        payload.listing_type || current.listing_type,
        payload.category_label || current.category,
        payload.price || current.price,
        payload.price_raw || current.price_raw,
        canonicalLocation,
        payload.address,
        payload.beds,
        payload.baths,
        payload.area,
        payload.area_unit,
        payload.description,
        JSON.stringify(payload.highlights),
        JSON.stringify(payload.images?.length ? payload.images : current.images),
        payload.tag,
        payload.seller_type,
        payload.seller_name,
        payload.seller_phone,
        payload.seller_email,
        payload.property_category || current.property_category,
        JSON.stringify(payload.details),
        JSON.stringify(payload.amenities),
        JSON.stringify(payload.nearby_places),
        payload.security_deposit,
        payload.latitude,
        payload.longitude,
        payload.locality,
        payload.state,
        payload.postal_code,
        payload.available_from,
        payload.furnishing,
        JSON.stringify(payload.floor_plans),
        JSON.stringify(payload.documents),
        id,
      ]
    );

    return NextResponse.json({ success: true, data: mapRow(r.rows[0]) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();
    await ensurePropertyListingSchema();

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
