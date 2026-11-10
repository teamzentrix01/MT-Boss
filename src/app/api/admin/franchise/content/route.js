import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';
import {
  ensureFranchiseSettingsSchema,
  getFranchisePageSettings,
  invalidateFranchiseContentCache,
} from '@/lib/franchise-settings';

export async function GET(req) {
  try {
    const admin = requireRole(req, 'admin');
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }

    await ensureFranchiseSettingsSchema();
    const settings = await getFranchisePageSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Admin franchise content GET error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const admin = requireRole(req, 'admin');
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }

    await ensureFranchiseSettingsSchema();
    const body = await req.json();
    const { section, data } = body;

    const validSections = ['hero', 'benefits', 'process', 'form_options'];
    if (!section || !validSections.includes(section)) {
      return NextResponse.json({ success: false, error: 'Invalid section' }, { status: 400 });
    }

    if (!data || typeof data !== 'object') {
      return NextResponse.json({ success: false, error: 'Section data is required' }, { status: 400 });
    }

    await pool.query(
      `INSERT INTO franchise_page_settings (key, data, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (key)
       DO UPDATE SET data = $2::jsonb, updated_at = NOW()`,
      [section, JSON.stringify(data)]
    );

    invalidateFranchiseContentCache();
    return NextResponse.json({
      success: true,
      message: `${section.toUpperCase()} section updated successfully`,
    });
  } catch (error) {
    console.error('Admin franchise content PUT error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}

