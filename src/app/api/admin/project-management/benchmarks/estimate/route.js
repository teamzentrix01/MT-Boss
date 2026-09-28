import { NextResponse } from 'next/server';
import { requireRole, unauthorized } from '@/lib/auth';
import { ensureProjectManagementPhase5Schema } from '@/lib/project-management';
import { getEstimate } from '@/lib/pm-benchmarks';

export async function POST(req) {
  if (!requireRole(req, 'admin')) return unauthorized();
  try {
    await ensureProjectManagementPhase5Schema();
    const body = await req.json();
    const estimate = await getEstimate(body);
    return NextResponse.json({ success: true, data: estimate });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
