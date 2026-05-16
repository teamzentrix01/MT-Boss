import pool from '@/lib/db';
import { NextResponse } from 'next/server';

// GET all quick services — public, no auth required
export async function GET(req) {
  try {
    const result = await pool.query(
      `SELECT * FROM quick_services ORDER BY id ASC`
    );

    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching quick services:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST - Create new quick service
export async function POST(req) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { icon, label, desc, basePrice, duration } = await req.json();

    if (!icon || !label || !desc || !basePrice || !duration) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO quick_services (icon, label, description, base_price, duration)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [icon, label, desc, parseFloat(basePrice), duration]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating quick service:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT - Update quick service
export async function PUT(req) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, icon, label, desc, basePrice, duration } = await req.json();

    if (!id || !icon || !label || !desc || !basePrice || !duration) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE quick_services
       SET icon=$1, label=$2, description=$3, base_price=$4, duration=$5
       WHERE id=$6
       RETURNING *`,
      [icon, label, desc, parseFloat(basePrice), duration, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating quick service:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE - Remove quick service
export async function DELETE(req) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }

    const result = await pool.query(
      `DELETE FROM quick_services WHERE id=$1 RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting quick service:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}