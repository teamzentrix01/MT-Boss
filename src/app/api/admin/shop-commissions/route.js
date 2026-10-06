import { NextResponse } from 'next/server';
import { requireRole, unauthorized } from '@/lib/auth';
import {
  getShopVendorCommissionOverview,
  getShopVendorCommissionRecords,
  markShopVendorCommissionPaid,
} from '@/lib/shop-commissions';

export async function GET(req) {
  try {
    const admin = requireRole(req, 'admin');
    if (!admin) return unauthorized();

    const { searchParams } = new URL(req.url);
    const hasRecordFilters =
      searchParams.get('records') === '1' ||
      searchParams.get('view') === 'records' ||
      searchParams.has('status') ||
      searchParams.has('vendor_id') ||
      searchParams.has('page') ||
      searchParams.has('start_date') ||
      searchParams.has('end_date');

    if (hasRecordFilters) {
      const recordsData = await getShopVendorCommissionRecords({
        status: searchParams.get('status') || 'all',
        vendorId: searchParams.get('vendor_id') || null,
        startDate: searchParams.get('start_date') || null,
        endDate: searchParams.get('end_date') || null,
        page: searchParams.get('page') || 1,
        limit: searchParams.get('limit') || 15,
      });

      return NextResponse.json({
        success: true,
        data: recordsData,
      });
    }

    const data = await getShopVendorCommissionOverview();
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error('Error fetching shop vendor commissions overview:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch shop vendor commissions' },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    const admin = requireRole(req, 'admin');
    if (!admin) return unauthorized();

    const body = await req.json().catch(() => ({}));
    const vendorId = body.vendor_id ? Number(body.vendor_id) : null;
    const commissionId = body.commission_id ? Number(body.commission_id) : null;
    const note = body.paid_note || body.note || null;

    if (!vendorId && !commissionId) {
      return NextResponse.json(
        { success: false, error: 'vendor_id or commission_id is required' },
        { status: 400 }
      );
    }

    const updatedRows = await markShopVendorCommissionPaid({
      vendorId,
      commissionId,
      paidNote: note,
    });

    const overview = await getShopVendorCommissionOverview();

    return NextResponse.json({
      success: true,
      message: `Marked ${updatedRows.length} commission record(s) as paid`,
      updatedCount: updatedRows.length,
      updatedRows,
      data: overview,
    });
  } catch (err) {
    console.error('Error settling shop vendor commissions:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update commission status' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  return PATCH(req);
}
