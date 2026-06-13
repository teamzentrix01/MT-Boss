import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensurePackageSchema, calculateExpiry } from '@/lib/packages';
import { requireRole, unauthorized } from '@/lib/auth';

// GET - list all vendors/suppliers with pending packages
export async function GET(req) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();

    await ensurePackageSchema();

    const vendors = await pool.query(
      `SELECT id, email, phone, city,
              package_id, package_name, package_price, package_status,
              package_purchased_at, package_starts_at, package_expires_at
       FROM vendors
       WHERE package_status IN ('pending', 'active')
       ORDER BY package_purchased_at DESC`
    );

    let suppliers = { rows: [] };
    try {
      suppliers = await pool.query(
        `SELECT id, email, phone, city,
                package_id, package_name, package_price, package_status,
                package_purchased_at, package_starts_at, package_expires_at
         FROM suppliers
         WHERE package_status IN ('pending', 'active')
         ORDER BY package_purchased_at DESC`
      );
    } catch (_) { /* suppliers table might not have these columns yet */ }

    return NextResponse.json({
      success: true,
      vendors: vendors.rows,
      suppliers: suppliers.rows,
    });
  } catch (error) {
    console.error('Admin packages fetch error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST - approve a vendor/supplier package → activates it, sets start + expiry dates
export async function POST(req) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();

    await ensurePackageSchema();
    const { entity_type, entity_id, action } = await req.json();

    if (!entity_type || !entity_id) {
      return NextResponse.json({ error: 'entity_type and entity_id are required' }, { status: 400 });
    }

    const table = entity_type === 'supplier' ? 'suppliers' : 'vendors';

    if (action === 'reject') {
      await pool.query(
        `UPDATE ${table}
         SET package_status = 'rejected'
         WHERE id = $1`,
        [entity_id]
      );
      return NextResponse.json({ success: true, message: 'Package rejected.' });
    }

    // Approve: set start date to NOW and calculate expiry
    const current = await pool.query(
      `SELECT package_duration_months FROM ${table} WHERE id = $1`,
      [entity_id]
    );

    if (current.rows.length === 0) {
      return NextResponse.json({ error: 'Entity not found' }, { status: 404 });
    }

    const months = current.rows[0].package_duration_months || 6;
    const startDate = new Date();
    const expiryDate = calculateExpiry(startDate, months);

    const result = await pool.query(
      `UPDATE ${table}
       SET package_status = 'active',
           package_starts_at = $1,
           package_expires_at = $2
       WHERE id = $3
       RETURNING id, package_id, package_name, package_status, package_starts_at, package_expires_at`,
      [startDate.toISOString(), expiryDate.toISOString(), entity_id]
    );

    return NextResponse.json({
      success: true,
      message: `Package activated! Expires on ${expiryDate.toLocaleDateString('en-IN')}.`,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Admin package approve error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
