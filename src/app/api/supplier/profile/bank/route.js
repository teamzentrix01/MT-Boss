

import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { bank_account_holder, bank_account_number, bank_name, bank_ifsc_code, supplierId } = body;

    if (!bank_account_holder || !bank_account_number || !bank_name || !bank_ifsc_code || !supplierId) {
      return NextResponse.json({ success: false, error: 'All bank fields are required.' }, { status: 400 });
    }

    const result = await pool.query(
      `UPDATE suppliers
       SET bank_account_holder = $1,
           bank_account_number = $2,
           bank_name           = $3,
           bank_ifsc_code      = $4,
           updated_at          = NOW()
       WHERE id = $5
       RETURNING id, bank_account_holder, bank_account_number, bank_name, bank_ifsc_code`,
      [bank_account_holder, bank_account_number, bank_name, bank_ifsc_code, parseInt(supplierId)]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Supplier not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });

  } catch (err) {
    console.error('PUT bank error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}