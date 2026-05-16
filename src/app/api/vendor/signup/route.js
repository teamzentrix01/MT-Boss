import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  let client;
  try {
    const {
      email,
      password,
      shop_name,
      business_name,
      phone,
      city,
      state,
      country,
      postal_code,
      business_type,
      description,
      gst_number,
      pan_number,
      business_registration_number,
      bank_account_holder,
      bank_account_number,
      bank_name,
      bank_ifsc_code,
      services
    } = await req.json();

    console.log('=== Vendor Signup Request ===');
    console.log('Email:', email);
    console.log('Shop:', shop_name);
    console.log('Services:', services);

    // ── Validation ──
    if (!email || !password || !shop_name || !business_name || !city || !state) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!services || !Array.isArray(services) || services.length === 0) {
      return NextResponse.json(
        { error: 'Please select at least one service' },
        { status: 400 }
      );
    }

    // ── Check if vendor exists ──
    const existsResult = await pool.query(
      'SELECT id FROM vendors WHERE email = $1',
      [email]
    );

    if (existsResult.rows.length > 0) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // ── Hash password ──
    const hashedPassword = await bcrypt.hash(password, 10);

    client = await pool.connect();
    await client.query('BEGIN');

    try {
      // ── Insert vendor ──
      const vendorResult = await client.query(
        `INSERT INTO vendors (
          email, password, shop_name, business_name, phone,
          city, state, country, postal_code, business_type, description,
          bank_account_holder, bank_account_number, bank_name, bank_ifsc_code,
          gst_number, pan_number, business_registration_number,
          status, verification_status, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, NOW(), NOW())
        RETURNING 
          id, email, shop_name, business_name, phone, city, state, country, 
          postal_code, business_type, status, verification_status`,
        [
          email,
          hashedPassword,
          shop_name,
          business_name,
          phone || null,
          city,
          state,
          country || null,
          postal_code || null,
          business_type || null,
          description || null,
          bank_account_holder || null,
          bank_account_number || null,
          bank_name || null,
          bank_ifsc_code || null,
          gst_number || null,
          pan_number || null,
          business_registration_number || null,
          'active',
          'pending'
        ]
      );

      if (!vendorResult.rows[0]) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { error: 'Failed to create vendor account' },
          { status: 500 }
        );
      }

      const vendor = vendorResult.rows[0];
      console.log('✓ Vendor created:', vendor.id);

      // ── Assign services ──
      try {
        for (const serviceId of services) {
          await client.query(
            `INSERT INTO vendor_services (vendor_id, quick_service_id, is_active)
             VALUES ($1, $2, TRUE)
             ON CONFLICT (vendor_id, quick_service_id) 
             DO UPDATE SET is_active = TRUE`,
            [vendor.id, serviceId]
          );
        }
        console.log('✓ Services assigned:', services.length);
      } catch (serviceErr) {
        console.warn('⚠ Service assignment failed (non-critical):', serviceErr.message);
      }

      // ── Create vendor stats ──
      try {
        await client.query(
          `INSERT INTO vendor_stats (vendor_id, created_at, updated_at)
           VALUES ($1, NOW(), NOW())
           ON CONFLICT (vendor_id) DO NOTHING`,
          [vendor.id]
        );
        console.log('✓ Vendor stats created');
      } catch (statsErr) {
        console.warn('⚠ Stats creation failed (non-critical):', statsErr.message);
      }

      await client.query('COMMIT');
      console.log('✓ Transaction committed');

      // ── Generate JWT ──
      const token = jwt.sign(
        { id: vendor.id, email: vendor.email, role: 'vendor' },
        process.env.NEXT_PUBLIC_JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );

      console.log('✓ Signup successful');

      return NextResponse.json({
        success: true,
        message: 'Vendor account created successfully',
        token,
        vendor: {
          id: vendor.id,
          email: vendor.email,
          shop_name: vendor.shop_name,
          business_name: vendor.business_name,
          phone: vendor.phone,
          city: vendor.city,
          state: vendor.state,
          country: vendor.country,
          postal_code: vendor.postal_code,
          business_type: vendor.business_type,
          status: vendor.status,
          verification_status: vendor.verification_status,
          role: 'vendor'
        },
        redirectTo: '/vendor/dashboard',
      }, { status: 201 });

    } catch (dbErr) {
      await client.query('ROLLBACK');
      console.error('Database error:', dbErr.message);
      return NextResponse.json(
        { error: 'Database error: ' + dbErr.message },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  } finally {
    if (client) {
      try {
        await client.query('ROLLBACK');
      } catch (e) {
        // Ignore
      }
      client.release();
    }
  }
}