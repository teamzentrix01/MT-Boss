import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getJwtSecret, setAuthCookie } from '@/lib/auth';

export async function POST(req) {
  try {
    const { email, password, rememberMe } = await req.json().catch(() => ({}));

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // 1. First check vendors table (where business_type is contractor or created as contractor)
    let vendorRes = await pool.query(
      `SELECT 
        id, email, password_hash, vendor_name, shop_name, business_name, 
        phone, city, state, country, postal_code, business_type, description,
        status, verification_status, is_approved, approval_date, created_at 
       FROM vendors 
       WHERE LOWER(TRIM(email)) = $1`,
      [cleanEmail]
    );

    let contractor = null;
    let isFromVendors = false;

    if (vendorRes.rows.length > 0) {
      contractor = vendorRes.rows[0];
      isFromVendors = true;
    } else {
      // 2. Check users table for role = 'Contractor'
      const userRes = await pool.query(
        `SELECT id, name, email, phone, delivery_city as city, password, role, is_blocked, created_at
         FROM users
         WHERE LOWER(TRIM(email)) = $1 AND LOWER(role) = 'contractor'`,
        [cleanEmail]
      );

      if (userRes.rows.length > 0) {
        const u = userRes.rows[0];
        if (u.is_blocked) {
          return NextResponse.json(
            { error: 'Your contractor account is blocked. Please contact support.' },
            { status: 403 }
          );
        }
        contractor = {
          id: u.id,
          email: u.email,
          password_hash: u.password,
          vendor_name: u.name,
          shop_name: u.name,
          business_name: u.name,
          phone: u.phone,
          city: u.city,
          state: '',
          business_type: 'contractor',
          status: 'active',
          verification_status: 'verified',
          is_approved: true,
          created_at: u.created_at,
        };
      }
    }

    if (!contractor) {
      return NextResponse.json(
        { error: 'No contractor account found for this email. Please register first.' },
        { status: 401 }
      );
    }

    // Verify password (handle bcrypt or raw comparison)
    let isPasswordValid = false;
    if (contractor.password_hash) {
      if (contractor.password_hash.startsWith('$2a$') || contractor.password_hash.startsWith('$2b$') || contractor.password_hash.startsWith('$2y$')) {
        isPasswordValid = await bcrypt.compare(password, contractor.password_hash);
      } else {
        // Fallback to direct match or postgres crypt
        isPasswordValid = password === contractor.password_hash;
        if (!isPasswordValid) {
          try {
            const cryptCheck = await pool.query(
              `SELECT (password_hash = crypt($2, password_hash)) as ok FROM vendors WHERE id = $1`,
              [contractor.id, password]
            );
            isPasswordValid = Boolean(cryptCheck.rows[0]?.ok);
          } catch {}
        }
      }
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Incorrect email or password.' },
        { status: 401 }
      );
    }

    // Check account status if in vendors table
    if (isFromVendors) {
      if (!contractor.is_approved) {
        return NextResponse.json(
          {
            error: 'Your contractor account is under review by admin.',
            code: 'PENDING_APPROVAL',
            message: 'Your registration is being verified. Verification usually completes in 24 hours.'
          },
          { status: 403 }
        );
      }

      if (contractor.status === 'inactive' || contractor.status === 'rejected') {
        return NextResponse.json(
          {
            error: 'Your contractor account is currently inactive.',
            code: 'ACCOUNT_INACTIVE',
            message: 'Please contact MTBOSS support to reactivate your contractor account.'
          },
          { status: 403 }
        );
      }
    }

    // Generate JWT token
    const tokenExpiry = rememberMe ? '30d' : '7d';
    const token = jwt.sign(
      {
        id: contractor.id,
        email: contractor.email,
        role: 'contractor',
        name: contractor.vendor_name || contractor.shop_name,
        business_type: contractor.business_type || 'contractor',
      },
      getJwtSecret(),
      { expiresIn: tokenExpiry }
    );

    // Update last_login
    if (isFromVendors) {
      await pool.query(
        `UPDATE vendors SET last_login = NOW() WHERE id = $1`,
        [contractor.id]
      ).catch(() => {});
    }

    const safeContractor = {
      id: contractor.id,
      name: contractor.vendor_name || contractor.shop_name || contractor.name,
      shop_name: contractor.shop_name,
      business_name: contractor.business_name,
      email: contractor.email,
      phone: contractor.phone,
      city: contractor.city,
      state: contractor.state,
      business_type: contractor.business_type || 'contractor',
      status: contractor.status,
      verification_status: contractor.verification_status,
      is_approved: contractor.is_approved,
      created_at: contractor.created_at,
    };

    const response = NextResponse.json({
      success: true,
      token,
      contractor: safeContractor,
      user: {
        ...safeContractor,
        role: 'Contractor',
      }
    });

    try {
      setAuthCookie(response, token, {
        maxAge: rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60,
      });
    } catch {}

    return response;
  } catch (error) {
    console.error('Contractor login error:', error);
    return NextResponse.json(
      { error: 'An unexpected server error occurred during login.' },
      { status: 500 }
    );
  }
}
