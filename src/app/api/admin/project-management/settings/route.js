import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { requirePmAccess } from '@/lib/project-management';
import { ensureProjectManagementPhase5Schema } from '@/lib/project-management';

const ALLOWED = ['party_payment_gap_days', 'contract_paid_warning_percent', 'use_real_rates'];

export async function GET(req) {
  if (!await requirePmAccess(req)) return unauthorized();
  try {
    await ensureProjectManagementPhase5Schema();
    const r = await pool.query(`SELECT key, value, updated_at FROM pm_settings ORDER BY key`);
    return NextResponse.json({ success: true, data: r.rows });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  const admin = await requirePmAccess(req);
  if (!admin) return unauthorized();
  try {
    await ensureProjectManagementPhase5Schema();
    const body = await req.json();
    const updates = Object.entries(body).filter(([k]) => ALLOWED.includes(k));
    if (!updates.length) return NextResponse.json({ success: false, error: 'No valid settings provided' }, { status: 400 });
    for (const [k, v] of updates) {
      if (k === 'use_real_rates') {
        const strVal = String(v).toLowerCase() === 'true' || v === true ? 'true' : 'false';
        await pool.query(
          `INSERT INTO pm_settings(key,value,updated_at) VALUES($1,$2,NOW()) ON CONFLICT(key) DO UPDATE SET value=$2, updated_at=NOW()`,
          [k, strVal]
        );
      } else {
        const n = Number(v);
        if (!Number.isFinite(n) || n <= 0) return NextResponse.json({ success: false, error: `Invalid value for ${k}` }, { status: 400 });
        await pool.query(
          `INSERT INTO pm_settings(key,value,updated_at) VALUES($1,$2,NOW()) ON CONFLICT(key) DO UPDATE SET value=$2, updated_at=NOW()`,
          [k, String(n)]
        );
      }
    }
    const r = await pool.query(`SELECT key, value, updated_at FROM pm_settings ORDER BY key`);
    return NextResponse.json({ success: true, data: r.rows });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
