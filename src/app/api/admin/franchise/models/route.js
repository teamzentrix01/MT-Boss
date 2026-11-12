import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';
import {
  ensureFranchiseSettingsSchema,
  getFranchiseModels,
  invalidateFranchiseContentCache,
} from '@/lib/franchise-settings';

export async function GET(req) {
  try {
    const admin = requireRole(req, 'admin');
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }

    await ensureFranchiseSettingsSchema();
    const models = await getFranchiseModels({ activeOnly: false });
    return NextResponse.json({ success: true, data: models });
  } catch (error) {
    console.error('Admin franchise models GET error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const admin = requireRole(req, 'admin');
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }

    await ensureFranchiseSettingsSchema();
    const body = await req.json();
    const {
      name,
      investment,
      returns,
      area,
      support,
      color,
      badge,
      popular,
      registration_fee,
      features,
      sort_order,
      is_active,
    } = body;

    const cleanName = String(name || '').trim();
    if (!cleanName) {
      return NextResponse.json({ success: false, error: 'Model name is required' }, { status: 400 });
    }

    const feeNum = Number(registration_fee);
    if (!Number.isFinite(feeNum) || feeNum < 0) {
      return NextResponse.json({ success: false, error: 'Valid registration fee amount is required' }, { status: 400 });
    }

    const featureList = Array.isArray(features)
      ? features.map(f => String(f).trim()).filter(Boolean)
      : [];

    const result = await pool.query(
      `INSERT INTO franchise_models (
         name, investment, returns, area, support, color, badge,
         popular, registration_fee, features, sort_order, is_active, updated_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, $11, $12, NOW())
       RETURNING *`,
      [
        cleanName,
        String(investment || 'Details after consultation').trim(),
        String(returns || 'Revenue model shared on call').trim(),
        String(area || 'Single City').trim(),
        String(support || 'Basic').trim(),
        String(color || 'border-blue-500').trim(),
        String(badge || 'bg-blue-500').trim(),
        Boolean(popular),
        feeNum,
        JSON.stringify(featureList),
        Number(sort_order || 0),
        is_active !== false,
      ]
    );

    invalidateFranchiseContentCache();
    return NextResponse.json({
      success: true,
      data: {
        ...result.rows[0],
        registration_fee: Number(result.rows[0].registration_fee),
        features: featureList,
      },
      message: 'Franchise model created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Admin franchise models POST error:', error);
    if (error.code === '23505') {
      return NextResponse.json({ success: false, error: 'A franchise model with this name already exists' }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
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
    const {
      id,
      name,
      investment,
      returns,
      area,
      support,
      color,
      badge,
      popular,
      registration_fee,
      features,
      sort_order,
      is_active,
    } = body;

    const modelId = Number(id);
    if (!modelId) {
      return NextResponse.json({ success: false, error: 'Valid model ID is required' }, { status: 400 });
    }

    const cleanName = String(name || '').trim();
    if (!cleanName) {
      return NextResponse.json({ success: false, error: 'Model name cannot be empty' }, { status: 400 });
    }

    const feeNum = Number(registration_fee);
    if (!Number.isFinite(feeNum) || feeNum < 0) {
      return NextResponse.json({ success: false, error: 'Valid registration fee amount is required' }, { status: 400 });
    }

    const featureList = Array.isArray(features)
      ? features.map(f => String(f).trim()).filter(Boolean)
      : [];

    const result = await pool.query(
      `UPDATE franchise_models
          SET name = $1,
              investment = $2,
              returns = $3,
              area = $4,
              support = $5,
              color = $6,
              badge = $7,
              popular = $8,
              registration_fee = $9,
              features = $10::jsonb,
              sort_order = $11,
              is_active = $12,
              updated_at = NOW()
        WHERE id = $13
        RETURNING *`,
      [
        cleanName,
        String(investment || '').trim(),
        String(returns || '').trim(),
        String(area || '').trim(),
        String(support || 'Basic').trim(),
        String(color || 'border-blue-500').trim(),
        String(badge || 'bg-blue-500').trim(),
        Boolean(popular),
        feeNum,
        JSON.stringify(featureList),
        Number(sort_order || 0),
        is_active !== false,
        modelId,
      ]
    );

    if (!result.rows[0]) {
      return NextResponse.json({ success: false, error: 'Franchise model not found' }, { status: 404 });
    }

    invalidateFranchiseContentCache();
    return NextResponse.json({
      success: true,
      data: {
        ...result.rows[0],
        registration_fee: Number(result.rows[0].registration_fee),
        features: featureList,
      },
      message: 'Franchise model updated successfully',
    });
  } catch (error) {
    console.error('Admin franchise models PUT error:', error);
    if (error.code === '23505') {
      return NextResponse.json({ success: false, error: 'Another model with this name already exists' }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const admin = requireRole(req, 'admin');
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get('id'));
    if (!id) {
      return NextResponse.json({ success: false, error: 'Model ID is required' }, { status: 400 });
    }

    await ensureFranchiseSettingsSchema();
    const result = await pool.query(
      `DELETE FROM franchise_models WHERE id = $1 RETURNING id, name`,
      [id]
    );

    if (!result.rows[0]) {
      return NextResponse.json({ success: false, error: 'Model not found' }, { status: 404 });
    }

    invalidateFranchiseContentCache();
    return NextResponse.json({
      success: true,
      message: `Model "${result.rows[0].name}" deleted successfully`,
    });
  } catch (error) {
    console.error('Admin franchise models DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

