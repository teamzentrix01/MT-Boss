import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const query = status === 'all'
      ? 'SELECT * FROM projects ORDER BY created_at DESC'
      : "SELECT * FROM projects WHERE status = 'published' ORDER BY created_at DESC";

    const result = await pool.query(query);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Projects fetch error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { title, category, location, description, image_url, cloudinary_public_id, size, status } = await req.json();

    if (!title || !image_url || !category) {
      return NextResponse.json({ success: false, error: 'Title, category and image are required' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO projects (title, category, location, description, image_url, cloudinary_public_id, size, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [title, category, location || '', description || '', image_url, cloudinary_public_id || '', size || 'small', status || 'published']
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Project create error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const { id, title, category, location, description, image_url, cloudinary_public_id, size, status } = await req.json();

    const result = await pool.query(
      `UPDATE projects SET title=$1, category=$2, location=$3, description=$4,
       image_url=$5, cloudinary_public_id=$6, size=$7, status=$8
       WHERE id=$9 RETURNING *`,
      [title, category, location, description, image_url, cloudinary_public_id, size, status, id]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { id, cloudinary_public_id } = await req.json();

    // Delete from Cloudinary if public_id exists
    if (cloudinary_public_id) {
      await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          public_id: cloudinary_public_id,
          api_key: process.env.CLOUDINARY_API_KEY,
          timestamp: Math.floor(Date.now() / 1000),
        }),
      });
    }

    await pool.query('DELETE FROM projects WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}