import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { handleApiError } from '@/lib/api-utils';
import { ensureSiteContent } from '@/lib/site-content';
import { validateReview } from '@/lib/site-content-validation.mjs';
import { notifyAdminSubmission, deliverReviewConfirmation } from '@/lib/customer-communications';

const fail = (error, status = 400) => NextResponse.json({ success: false, error }, { status });

export async function POST(req) {
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object') return fail('Invalid review details.');

    // Ensure consent is passed or defaulted
    const payload = {
      ...body,
      consent: body.consent !== undefined ? body.consent : true,
    };

    const { data, error } = validateReview(payload);
    if (error) return fail(error);

    await ensureSiteContent();
    const result = await pool.query(
      `INSERT INTO site_reviews (name, email, rating, service, message, status, created_at)
       VALUES ($1, $2, $3, $4, $5, 'pending', NOW())
       RETURNING id, name, email, rating, service, message, status, created_at`,
      [data.name, data.email, data.rating, data.service, data.message]
    );

    const created = result.rows[0];

    // Send notifications to Admin and confirmation to User
    await Promise.allSettled([
      notifyAdminSubmission({
        type: 'customer review',
        name: created.name,
        email: created.email,
        reference: `REV-${created.id}`,
        details: {
          Service: created.service,
          Rating: `${created.rating} / 5 Stars`,
          Review: created.message,
        },
      }),
      deliverReviewConfirmation({
        email: created.email,
        name: created.name,
        rating: created.rating,
        service: created.service,
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your review! It has been submitted successfully.',
        data: created,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof SyntaxError) return fail('Invalid JSON body.');
    console.error('Reviews POST error:', error);
    return handleApiError(error);
  }
}

export async function GET(req) {
  const params = new URL(req.url).searchParams;
  const manager = params.get('mode') === 'manager';
  if (manager && !requireRole(req, 'admin')) return unauthorized();

  try {
    await ensureSiteContent();
    const result = await pool.query(
      `SELECT * FROM site_reviews ${manager ? '' : "WHERE status = 'approved'"} ORDER BY created_at DESC LIMIT 200`
    );
    return NextResponse.json({ success: true, data: result.rows }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req) {
  if (!requireRole(req, 'admin')) return unauthorized();
  try {
    const { id, status } = await req.json();
    if (!Number.isInteger(Number(id)) || Number(id) < 1) return fail('Valid review ID required.');
    if (!['approved', 'rejected', 'pending'].includes(status)) return fail('Invalid status.');

    await ensureSiteContent();
    const result = await pool.query(
      `UPDATE site_reviews SET status = $1 WHERE id = $2 RETURNING *`,
      [status, Number(id)]
    );
    if (!result.rows.length) return fail('Review not found.', 404);

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req) {
  if (!requireRole(req, 'admin')) return unauthorized();
  try {
    const { id } = await req.json();
    if (!Number.isInteger(Number(id)) || Number(id) < 1) return fail('Valid review ID required.');

    await ensureSiteContent();
    const result = await pool.query(`DELETE FROM site_reviews WHERE id = $1 RETURNING id`, [Number(id)]);
    if (!result.rows.length) return fail('Review not found.', 404);

    return NextResponse.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
