import { NextResponse } from 'next/server';
import { processScheduledMaturityAndExpiry } from '@/lib/cashback/service';

export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const secret = process.env.CRON_SECRET || 'mtboss-cashback-cron-secret';

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    if (token !== secret) {
      return NextResponse.json({ success: false, error: 'Unauthorized cron request' }, { status: 401 });
    }

    const result = await processScheduledMaturityAndExpiry();
    return NextResponse.json({
      success: true,
      message: 'Maturity and expiry processed successfully',
      data: result,
    });
  } catch (error) {
    console.error('POST /api/cron/cashback error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
