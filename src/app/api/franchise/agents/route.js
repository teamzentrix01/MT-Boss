import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { franchiseAccessResponse, getFranchiseAccess } from '@/lib/franchise-access';

export async function GET(req) {
  try {
    const access = await getFranchiseAccess(req, 'agents.view');
    if (!access.allowed) return franchiseAccessResponse(access);

    const result = await pool.query(
      `SELECT id, name, email, phone, city, state, agent_type
       FROM agents
       WHERE status = 'Approved'
         AND login_enabled = TRUE
         AND must_change_password = FALSE
         AND LOWER(TRIM(COALESCE(city, ''))) = LOWER(TRIM($1))
       ORDER BY name ASC`,
      [access.franchise.city]
    );

    const data = access.permissions['agents.view_contact_details']
      ? result.rows
      : result.rows.map(({ email, phone, ...agent }) => agent);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Franchise agents fetch error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
