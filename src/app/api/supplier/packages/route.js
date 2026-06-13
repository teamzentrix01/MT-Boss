import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { PACKAGES, ensurePackageSchema, getPackageById, getPackageInfo } from '@/lib/packages';
import { requireRole, unauthorized } from '@/lib/auth';

// GET - list packages or get supplier's package status
export async function GET(req) {
  try {
    await ensurePackageSchema();
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    if (action === 'status') {
      const supplier = requireRole(req, 'supplier');
      if (!supplier) return unauthorized();

      const result = await pool.query(
        `SELECT package_id, package_name, package_price, package_duration_months,
                package_purchased_at, package_starts_at, package_expires_at, package_status
         FROM suppliers WHERE id = $1`,
        [supplier.id]
      );

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, package: getPackageInfo(result.rows[0]) });
    }

    return NextResponse.json({ success: true, packages: PACKAGES });
  } catch (error) {
    console.error('Supplier package fetch error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST - supplier selects a package
export async function POST(req) {
  try {
    await ensurePackageSchema();
    const supplier = requireRole(req, 'supplier');
    if (!supplier) return unauthorized();

    const { package_id } = await req.json();
    const pkg = getPackageById(package_id);
    if (!pkg) {
      return NextResponse.json({ error: 'Invalid package selected' }, { status: 400 });
    }

    const result = await pool.query(
      `UPDATE suppliers
       SET package_id = $1,
           package_name = $2,
           package_price = $3,
           package_duration_months = $4,
           package_purchased_at = NOW(),
           package_status = 'pending'
       WHERE id = $5
       RETURNING id, package_id, package_name, package_price, package_status`,
      [pkg.id, pkg.name, pkg.price, pkg.duration_months, supplier.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `${pkg.label} selected! Your package will be activated once approved by admin.`,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Supplier package selection error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
