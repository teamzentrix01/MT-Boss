import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { PACKAGES, ensurePackageSchema, getPackageById, getPackageInfo } from '@/lib/packages';
import { requireRole, unauthorized } from '@/lib/auth';
import { createPayURequest } from '@/lib/payu';
import { createPayUIntent, getPayUCallbackUrl, newPayUTxnId } from '@/lib/payu-intents';

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

// POST - create PayU checkout for a supplier package
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

    const account = await pool.query(
      `SELECT id, email, phone, COALESCE(shop_name, business_name, email) AS customer_name FROM suppliers WHERE id = $1`,
      [supplier.id]
    );
    if (account.rows.length === 0) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
    }

    const customer = account.rows[0];
    const txnid = newPayUTxnId('SPK');
    await createPayUIntent({ txnid, purpose: 'supplier_package', entityId: supplier.id, packageId: pkg.id, amount: pkg.price });
    const callbackUrl = getPayUCallbackUrl(req);
    const payment = createPayURequest({
      txnid, amount: pkg.price, productinfo: `MTBOSS supplier ${pkg.label}`,
      firstname: String(customer.customer_name).split(/\s+/)[0], email: customer.email,
      phone: customer.phone, surl: callbackUrl, furl: callbackUrl,
      udf1: String(supplier.id), udf2: pkg.id, udf3: 'supplier_package',
    });

    return NextResponse.json({
      success: true,
      message: `Redirecting to PayU for ${pkg.label}.`,
      payment,
    });
  } catch (error) {
    console.error('Supplier package selection error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
