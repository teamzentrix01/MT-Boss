import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { sendEnquiryAcceptedEmail } from '@/lib/email';
import { requireRole } from '@/lib/auth';

function getSupplier(req) {
  return requireRole(req, 'supplier');
}

export async function POST(req, { params }) {
  try {
    const decoded = getSupplier(req);
    if (!decoded) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Lock and check the enquiry
      const check = await client.query(
        `SELECT * FROM material_enquiries WHERE id = $1 FOR UPDATE`,
        [id]
      );
      if (check.rows.length === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Enquiry not found' }, { status: 404 });
      }

      const enquiry = check.rows[0];
      if (enquiry.status !== 'open') {
        await client.query('ROLLBACK');
        return NextResponse.json({
          success: false,
          error: enquiry.accepted_by_supplier_id === decoded.id
            ? 'You already accepted this enquiry'
            : 'This enquiry has already been accepted by another supplier',
          already_taken: true,
        }, { status: 409 });
      }

      // Accept it
      const result = await client.query(
        `UPDATE material_enquiries
         SET status = 'accepted', accepted_by_supplier_id = $1, accepted_at = NOW(), updated_at = NOW()
         WHERE id = $2
         RETURNING *`,
        [decoded.id, id]
      );

      await client.query('COMMIT');

      // Send email to user (non-blocking)
      if (enquiry.user_email) {
        sendEnquiryAcceptedEmail({
          to: enquiry.user_email,
          userName: enquiry.user_name,
          shopName: decoded.shop_name,
          categoryName: enquiry.category_name,
          phone: enquiry.user_phone,
        }).catch(err => console.warn('Email send failed (non-critical):', err.message));
      }

      return NextResponse.json({ success: true, message: 'Enquiry accepted', data: result.rows[0] });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Accept enquiry error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
