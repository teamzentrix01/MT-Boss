import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { loadActiveCalculatorOverrides } from '@/lib/pm-calculator-bridge';
import { ensureProjectManagementPhase5Schema } from '@/lib/project-management';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await ensureProjectManagementPhase5Schema();
    const data = await loadActiveCalculatorOverrides(pool);
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    return NextResponse.json(
      { success: false, useRealRates: false, overrides: [], error: error.message },
      { status: 500 }
    );
  }
}
