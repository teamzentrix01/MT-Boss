import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('project_id');
    const date = searchParams.get('date');

    let query = `
      SELECT ple.*, COALESCE(p.title, 'Project #' || ple.project_id) AS project_title
      FROM project_labour_entries ple
      LEFT JOIN projects p ON p.id = ple.project_id
    `;
    const params = [];

    if (projectId) {
      query += ` WHERE ple.project_id = $1`;
      params.push(projectId);
      if (date) {
        query += ` AND ple.work_date = $2`;
        params.push(date);
      }
    } else if (date) {
      query += ` WHERE ple.work_date = $1`;
      params.push(date);
    }

    query += ` ORDER BY ple.work_date DESC, ple.id DESC LIMIT 100`;

    const res = await pool.query(query, params);
    return NextResponse.json({ success: true, labourEntries: res.rows });
  } catch (error) {
    console.error('Labour entries GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      project_id,
      labour_name,
      labour_role,
      work_date,
      attendance_status,
      wage_amount,
      paid_amount,
      notes,
    } = body;

    if (!labour_name) {
      return NextResponse.json({ success: false, error: 'Worker name is required' }, { status: 400 });
    }

    let projId = Number(project_id);
    if (!projId) {
      const firstProj = await pool.query('SELECT id FROM projects ORDER BY id ASC LIMIT 1');
      projId = firstProj.rows[0]?.id || 3;
    }

    const res = await pool.query(
      `INSERT INTO project_labour_entries (
        project_id,
        labour_name,
        labour_role,
        work_date,
        attendance_status,
        wage_amount,
        paid_amount,
        notes,
        created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, NOW()
      ) RETURNING *`,
      [
        projId,
        String(labour_name).trim(),
        labour_role || 'General Worker',
        work_date || new Date().toISOString().slice(0, 10),
        attendance_status || 'Present',
        Number(wage_amount) || 600,
        Number(paid_amount) || 0,
        notes || '',
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Worker attendance logged successfully',
      entry: res.rows[0],
    }, { status: 201 });
  } catch (error) {
    console.error('Labour entries POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
