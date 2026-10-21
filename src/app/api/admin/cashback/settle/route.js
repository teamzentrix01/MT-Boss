import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { ensureCashbackSchema, processScheduledMaturityAndExpiry } from '@/lib/cashback/service';

export async function POST(req) {
  try {
    const admin = requireRole(req, 'admin');
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }

    await ensureCashbackSchema();
    const result = await processScheduledMaturityAndExpiry(pool);

    return NextResponse.json({
      success: true,
      message: `Processed cashback maturity successfully (${result.maturedCount} matured, ${result.expiredCount} expired)`,
      data: result,
    });
  } catch (error) {
    console.error('POST /api/admin/cashback/settle error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to settle cashback' }, { status: 500 });
  }
}
