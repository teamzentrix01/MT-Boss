import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { createInitializationGuard, handleApiError } from '@/lib/api-utils';
import { cleanText } from '@/lib/validation';

const ensureReviewReplySchema = createInitializationGuard(async () => {
  await pool.query('ALTER TABLE booking_ratings ADD COLUMN IF NOT EXISTS vendor_response TEXT');
  await pool.query('ALTER TABLE booking_ratings ADD COLUMN IF NOT EXISTS vendor_responded_at TIMESTAMP');
});

export async function GET(req) {
  const vendor = requireRole(req, 'vendor');
  if (!vendor) return unauthorized();

  try {
    await ensureReviewReplySchema();
    const result = await pool.query(
      `SELECT br.id, br.booking_id, br.rating_stars, br.review_text, br.vendor_response,
              br.would_recommend, br.created_at,
              COALESCE(sb.user_name, u.name) AS user_name,
              sb.booking_reference, qs.label AS service_label
         FROM booking_ratings br
         LEFT JOIN service_bookings sb ON sb.id = br.booking_id
         LEFT JOIN quick_services qs ON qs.id = sb.quick_service_id
         LEFT JOIN users u ON u.id = br.user_id
        WHERE br.vendor_id = $1
        ORDER BY br.created_at DESC`,
      [vendor.id]
    );
    const rows = result.rows;
    const average = rows.length ? rows.reduce((sum, row) => sum + Number(row.rating_stars || 0), 0) / rows.length : 0;
    return NextResponse.json({
      success: true,
      data: rows,
      summary: { average_rating: Number(average.toFixed(1)), total_reviews: rows.length },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req) {
  const vendor = requireRole(req, 'vendor');
  if (!vendor) return unauthorized();

  try {
    const body = await req.json().catch(() => ({}));
    const id = Number(body.id);
    const response = cleanText(body.vendor_response).slice(0, 1000);
    if (!Number.isInteger(id) || id <= 0 || !response) {
      return NextResponse.json({ success: false, error: 'Review id and a reply are required.' }, { status: 400 });
    }

    await ensureReviewReplySchema();
    const result = await pool.query(
      `UPDATE booking_ratings
          SET vendor_response = $1, vendor_responded_at = NOW()
        WHERE id = $2 AND vendor_id = $3
        RETURNING id, vendor_response`,
      [response, id, vendor.id]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Review not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    return handleApiError(error);
  }
}
