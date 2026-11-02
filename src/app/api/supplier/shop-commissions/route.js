import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import pool from '@/lib/db';
import { getSupplierOwnCommissionSummary } from '@/lib/shop-commissions';

export async function GET(req) {
  try {
    const decoded = requireRole(req, 'supplier');
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { success: false, error: 'Supplier authentication required' },
        { status: 401 }
      );
    }

    let supplierEmail = decoded.email || '';
    if (!supplierEmail) {
      try {
        const supRes = await pool.query('SELECT email FROM suppliers WHERE id = $1', [decoded.id]);
        supplierEmail = supRes.rows[0]?.email || '';
      } catch (_) {}
    }

    const data = await getSupplierOwnCommissionSummary(decoded.id, supplierEmail);
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error('Error fetching supplier own commission summary:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch supplier commissions' },
      { status: 500 }
    );
  }
}

