import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensurePackageSchema, getPackageById } from '@/lib/packages';
import { cleanText, normalizePhone, isValidEmail, isValidIndianMobile } from '@/lib/validation';
import { resolveManagedCity } from '@/lib/cities';
import { createPayURequest } from '@/lib/payu';
import { createPayUIntent, getPayUCallbackUrl, newPayUTxnId } from '@/lib/payu-intents';

export async function POST(request) {
  try {
    const body = await request.json();
    let {
      email, password, shop_name, phone, city, state, country, postal_code,
      aadhaar_number, product_categories, package_id,
    } = body;
    email = cleanText(email).toLowerCase();
    phone = normalizePhone(phone);
    postal_code = cleanText(postal_code);
    const canonicalCity = await resolveManagedCity(city);

    if (!email || !password || !shop_name || !phone || !canonicalCity) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 });
    }
    if (!isValidIndianMobile(phone)) {
      return NextResponse.json({ error: 'Phone number must be 10 digits and start with 6, 7, 8 or 9' }, { status: 400 });
    }
    if (postal_code && !/^\d{6}$/.test(postal_code)) {
      return NextResponse.json({ error: 'Postal code must be exactly 6 digits' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }
    if (!aadhaar_number || !/^\d{12}$/.test(aadhaar_number.replace(/\s/g, ''))) {
      return NextResponse.json({ error: 'Valid 12-digit Aadhaar number is required' }, { status: 400 });
    }
    if (!Array.isArray(product_categories) || product_categories.length === 0) {
      return NextResponse.json({ error: 'Select at least one product category' }, { status: 400 });
    }

    await ensurePackageSchema();
    await pool.query(`ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS product_categories TEXT[] DEFAULT '{}'`);

    const pkg = getPackageById(package_id || 'pkg_6m');
    if (!pkg) {
      return NextResponse.json({ error: 'Select a valid subscription plan' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const existing = await client.query(
        `SELECT id, email, shop_name, phone, status, package_status,
                (password_hash = crypt($2, password_hash)) AS password_match
         FROM suppliers
         WHERE LOWER(email) = LOWER($1)
         FOR UPDATE`,
        [email, password]
      );

      let supplier;
      if (existing.rows[0]) {
        supplier = existing.rows[0];
        const paymentCanBeRetried = supplier.password_match
          && supplier.status === 'pending'
          && !['pending', 'active'].includes(supplier.package_status);
        if (!paymentCanBeRetried) {
          await client.query('ROLLBACK');
          return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
        }
        await client.query(
          `UPDATE suppliers
           SET package_id = $1, package_name = $2, package_price = $3,
               package_duration_months = $4, package_status = 'unpaid'
           WHERE id = $5`,
          [pkg.id, pkg.name, pkg.price, pkg.duration_months, supplier.id]
        );
      } else {
        const result = await client.query(
          `INSERT INTO suppliers (
            email, password_hash,
            shop_name, business_name, phone,
            city, state, country, postal_code,
            aadhaar_number, product_categories, status,
            package_id, package_name, package_price, package_duration_months,
            package_purchased_at, package_status
          ) VALUES (
            $1, crypt($2, gen_salt('bf')),
            $3, $4, $5,
            $6, $7, $8, $9,
            $10, $11, 'pending',
            $12, $13, $14, $15,
            NULL, 'unpaid'
          )
          RETURNING id, email, shop_name, phone, status, created_at`,
          [
            email, password,
            shop_name, shop_name, phone,
            canonicalCity, state || null, country || 'India', postal_code || null,
            aadhaar_number.replace(/\s/g, ''),
            product_categories,
            pkg.id, pkg.name, pkg.price, pkg.duration_months,
          ]
        );
        supplier = result.rows[0];
      }

      const txnid = newPayUTxnId('SRG');
      await createPayUIntent({
        txnid,
        purpose: 'supplier_registration',
        entityId: supplier.id,
        packageId: pkg.id,
        amount: pkg.price,
        client,
      });
      const callbackUrl = getPayUCallbackUrl(request);
      const payment = createPayURequest({
        txnid,
        amount: pkg.price,
        productinfo: `MTBOSS supplier registration - ${pkg.label}`,
        firstname: String(shop_name).trim().split(/\s+/)[0],
        email,
        phone,
        surl: callbackUrl,
        furl: callbackUrl,
        udf1: String(supplier.id),
        udf2: pkg.id,
        udf3: 'supplier_registration',
      });

      await client.query('COMMIT');
      return NextResponse.json({
        success: true,
        message: 'Registration saved. Redirecting to PayU for subscription payment.',
        supplier: {
          id: supplier.id,
          email: supplier.email,
          shop_name: supplier.shop_name,
          status: 'pending',
        },
        payment,
      }, { status: existing.rows[0] ? 200 : 201 });
    } catch (error) {
      try { await client.query('ROLLBACK'); } catch {}
      throw error;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({
      error: err.message?.includes('PayU is not configured')
        ? 'Online payment is temporarily unavailable'
        : 'Internal server error',
    }, { status: 500 });
  }
}
