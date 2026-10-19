import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
import { getJwtSecret, getBearerToken } from '@/lib/auth';

function getContractor(req) {
  try {
    const token = getBearerToken(req, 'contractor');
    if (token) {
      return jwt.verify(token, getJwtSecret());
    }
  } catch {}
  return null;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const auth = getContractor(req);
    const email = searchParams.get('email') || auth?.email;
    const id = searchParams.get('id') || auth?.id;

    if (!email && !id) {
      return NextResponse.json({ success: false, error: 'Unauthorized or missing identifier' }, { status: 401 });
    }

    let vendorRes;
    if (id) {
      vendorRes = await pool.query(
        `SELECT id, email, vendor_name, shop_name, business_name, phone, city, state, country, postal_code,
                business_type, description, gst_number, pan_number, bank_account_holder, bank_account_number,
                bank_name, bank_ifsc_code, status, verification_status, is_approved, approval_date, created_at
         FROM vendors WHERE id = $1`,
        [id]
      );
    } else {
      vendorRes = await pool.query(
        `SELECT id, email, vendor_name, shop_name, business_name, phone, city, state, country, postal_code,
                business_type, description, gst_number, pan_number, bank_account_holder, bank_account_number,
                bank_name, bank_ifsc_code, status, verification_status, is_approved, approval_date, created_at
         FROM vendors WHERE LOWER(TRIM(email)) = $1`,
        [String(email).trim().toLowerCase()]
      );
    }

    if (vendorRes.rows.length > 0) {
      return NextResponse.json({ success: true, profile: vendorRes.rows[0] });
    }

    // Fallback to users table
    const userRes = await pool.query(
      `SELECT id, name as vendor_name, name as shop_name, name as business_name,
              email, phone, delivery_city as city, '' as state, 'India' as country,
              'contractor' as business_type, '' as description, null as gst_number, null as pan_number,
              'active' as status, 'verified' as verification_status, true as is_approved, created_at
       FROM users WHERE LOWER(TRIM(email)) = $1`,
      [String(email).trim().toLowerCase()]
    );

    if (userRes.rows.length > 0) {
      return NextResponse.json({ success: true, profile: userRes.rows[0] });
    }

    return NextResponse.json({ success: false, error: 'Contractor profile not found' }, { status: 404 });
  } catch (error) {
    console.error('Profile GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const auth = getContractor(req);
    const {
      id,
      email,
      vendor_name,
      shop_name,
      phone,
      city,
      state,
      business_type,
      description,
      gst_number,
      pan_number,
      bank_account_holder,
      bank_account_number,
      bank_name,
      bank_ifsc_code,
    } = body;

    const targetId = id || auth?.id;
    const targetEmail = String(email || auth?.email || '').trim().toLowerCase();

    if (!targetId && !targetEmail) {
      return NextResponse.json({ success: false, error: 'Identification required' }, { status: 400 });
    }

    const res = await pool.query(
      `UPDATE vendors
       SET vendor_name = COALESCE($1, vendor_name),
           shop_name = COALESCE($2, shop_name),
           business_name = COALESCE($2, business_name),
           phone = COALESCE($3, phone),
           city = COALESCE($4, city),
           state = COALESCE($5, state),
           business_type = COALESCE($6, business_type),
           description = COALESCE($7, description),
           gst_number = COALESCE($8, gst_number),
           pan_number = COALESCE($9, pan_number),
           bank_account_holder = COALESCE($10, bank_account_holder),
           bank_account_number = COALESCE($11, bank_account_number),
           bank_name = COALESCE($12, bank_name),
           bank_ifsc_code = COALESCE($13, bank_ifsc_code),
           updated_at = NOW()
       WHERE id = $14 OR LOWER(TRIM(email)) = $15
       RETURNING *`,
      [
        vendor_name || null,
        shop_name || null,
        phone || null,
        city || null,
        state || null,
        business_type || null,
        description || null,
        gst_number || null,
        pan_number || null,
        bank_account_holder || null,
        bank_account_number || null,
        bank_name || null,
        bank_ifsc_code || null,
        targetId || -1,
        targetEmail || '',
      ]
    );

    // Also update phone/city in users table
    if (phone || city) {
      await pool.query(
        `UPDATE users SET phone = COALESCE($1, phone), delivery_city = COALESCE($2, delivery_city)
         WHERE LOWER(TRIM(email)) = $3`,
        [phone || null, city || null, targetEmail]
      ).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      profile: res.rows[0],
    });
  } catch (error) {
    console.error('Profile PUT error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
