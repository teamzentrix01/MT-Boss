import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { PACKAGES, ensurePackageSchema, getPackageById, getPackageInfo } from '@/lib/packages';
import { requireRole, unauthorized } from '@/lib/auth';
import { createPayURequest } from '@/lib/payu';
import { createPayUIntent, getPayUCallbackUrl, newPayUTxnId } from '@/lib/payu-intents';

// GET - list available packages OR get vendor's package status
export async function GET(req) {
  try {
    await ensurePackageSchema();
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    if (action === 'status') {
      const vendor = requireRole(req, 'vendor');
      if (!vendor) return unauthorized();

      const result = await pool.query(
        `SELECT package_id, package_name, package_price, package_duration_months,
                package_purchased_at, package_starts_at, package_expires_at, package_status
         FROM vendors WHERE id = $1`,
        [vendor.id]
      );

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, package: getPackageInfo(result.rows[0]) });
    }

    return NextResponse.json({ success: true, packages: PACKAGES });
  } catch (error) {
    console.error('Package fetch error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST - create PayU checkout for a vendor package
export async function POST(req) {
  try {
    await ensurePackageSchema();
    const vendor = requireRole(req, 'vendor');
    if (!vendor) return unauthorized();

    const { package_id } = await req.json();
    const pkg = getPackageById(package_id);
    if (!pkg) {
      return NextResponse.json({ error: 'Invalid package selected' }, { status: 400 });
    }

    const account = await pool.query(
      `SELECT id, email, phone, COALESCE(business_name, email) AS customer_name FROM vendors WHERE id = $1`,
      [vendor.id]
    );
    if (account.rows.length === 0) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    const customer = account.rows[0];
    const txnid = newPayUTxnId('VPK');
    await createPayUIntent({ txnid, purpose: 'vendor_package', entityId: vendor.id, packageId: pkg.id, amount: pkg.price });
    const callbackUrl = getPayUCallbackUrl(req);
    const payment = createPayURequest({
      txnid, amount: pkg.price, productinfo: `MTBOSS vendor ${pkg.label}`,
      firstname: String(customer.customer_name).split(/\s+/)[0], email: customer.email,
      phone: customer.phone, surl: callbackUrl, furl: callbackUrl,
      udf1: String(vendor.id), udf2: pkg.id, udf3: 'vendor_package',
    });

    return NextResponse.json({
      success: true,
      message: `Redirecting to PayU for ${pkg.label}.`,
      payment,
    });
  } catch (error) {
    console.error('Package selection error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
