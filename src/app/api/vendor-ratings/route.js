import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// POST - Submit rating and review
export async function POST(req) {
  try {
    const {
      booking_id,
      vendor_id,
      user_id,
      rating,
      review_text
    } = await req.json();

    if (!booking_id || !vendor_id || !user_id || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if booking exists and is completed
    const bookingResult = await pool.query(
      'SELECT status FROM service_bookings WHERE id = $1',
      [booking_id]
    );

    if (bookingResult.rows.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (bookingResult.rows[0].status !== 'completed') {
      return NextResponse.json(
        { error: 'Can only rate completed bookings' },
        { status: 400 }
      );
    }

    // Check if rating already exists
    const existingRatingResult = await pool.query(
      'SELECT id FROM vendor_ratings WHERE booking_id = $1',
      [booking_id]
    );

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      let ratingResult;

      if (existingRatingResult.rows.length > 0) {
        // Update existing rating
        ratingResult = await client.query(
          `UPDATE vendor_ratings 
           SET rating = $1, review_text = $2, updated_at = NOW()
           WHERE booking_id = $3
           RETURNING *`,
          [rating, review_text || '', booking_id]
        );
      } else {
        // Create new rating
        ratingResult = await client.query(
          `INSERT INTO vendor_ratings (
            booking_id, vendor_id, user_id, rating, review_text, is_verified_purchase
          ) VALUES ($1, $2, $3, $4, $5, TRUE)
          RETURNING *`,
          [booking_id, vendor_id, user_id, rating, review_text || '']
        );
      }

      // Update vendor average rating
      const statsResult = await client.query(
        `SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews 
         FROM vendor_ratings WHERE vendor_id = $1`,
        [vendor_id]
      );

      const avgRating = parseFloat(statsResult.rows[0].avg_rating) || 0;
      const totalReviews = statsResult.rows[0].total_reviews || 0;

      await client.query(
        `UPDATE vendor_stats 
         SET average_rating = $1, total_reviews = $2, updated_at = NOW()
         WHERE vendor_id = $3`,
        [avgRating.toFixed(1), totalReviews, vendor_id]
      );

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        message: 'Rating submitted successfully',
        data: ratingResult.rows[0],
        vendor_avg_rating: avgRating.toFixed(1),
        total_reviews: totalReviews
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error submitting rating:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

// GET - Fetch vendor ratings
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const vendor_id = searchParams.get('vendor_id');
    const booking_id = searchParams.get('booking_id');

    let result;

    if (vendor_id) {
      result = await pool.query(
        `SELECT vr.*, u.name as user_name 
         FROM vendor_ratings vr
         LEFT JOIN users u ON vr.user_id = u.id
         WHERE vr.vendor_id = $1
         ORDER BY vr.created_at DESC`,
        [vendor_id]
      );
    } else if (booking_id) {
      result = await pool.query(
        `SELECT * FROM vendor_ratings WHERE booking_id = $1`,
        [booking_id]
      );
    } else {
      return NextResponse.json(
        { error: 'vendor_id or booking_id required' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error fetching ratings:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

// PATCH - Vendor respond to review
export async function PATCH(req) {
  try {
    const {
      rating_id,
      vendor_response
    } = await req.json();

    if (!rating_id || !vendor_response) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE vendor_ratings 
       SET response_from_vendor = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [vendor_response, rating_id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Rating not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Response added successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating rating response:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}