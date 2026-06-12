// ════════════════════════════════════════════════════════════════════════════════
// FILE: app/api/bookings/[id]/rate/route.js
// USER LEAVES RATING AND REVIEW
// ════════════════════════════════════════════════════════════════════════════════
 
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
 
export async function POST(req, { params }) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
 
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET || 'fallback-secret');
      const rawId = decoded.id;
      if (!rawId || rawId === 0) {
        userId = null;
      } else {
        const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [rawId]);
        userId = userCheck.rows.length > 0 ? rawId : null;
      }
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
 
    const { id: bookingId } = await params;
    const { rating_stars, review_text, cleanliness_rating, professionalism_rating, punctuality_rating, would_recommend } = await req.json();
 
    if (!rating_stars || rating_stars < 1 || rating_stars > 5) {
      return NextResponse.json({ error: 'Invalid rating (1-5)' }, { status: 400 });
    }
 
    // Get booking details — handle nullable user_id
    const bookingResult = await pool.query(
      'SELECT vendor_id FROM service_bookings WHERE id = $1 AND (user_id = $2 OR ($2::INTEGER IS NULL AND user_id IS NULL))',
      [bookingId, userId]
    );
 
    if (bookingResult.rows.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
 
    const vendorId = bookingResult.rows[0].vendor_id;
 
    // Create rating
    await pool.query(
      `INSERT INTO booking_ratings (booking_id, vendor_id, user_id, rating_stars, review_text, cleanliness_rating, professionalism_rating, punctuality_rating, would_recommend, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
      [bookingId, vendorId, userId, rating_stars, review_text, cleanliness_rating, professionalism_rating, punctuality_rating, would_recommend]
    );
 
    // Update vendor average ratings
    const avgResult = await pool.query(
      `SELECT 
        AVG(rating_stars)::DECIMAL(3,2) as avg_rating,
        COUNT(*) as total_ratings,
        SUM(CASE WHEN rating_stars = 5 THEN 1 ELSE 0 END) as five_star,
        SUM(CASE WHEN rating_stars = 4 THEN 1 ELSE 0 END) as four_star,
        SUM(CASE WHEN rating_stars = 3 THEN 1 ELSE 0 END) as three_star,
        SUM(CASE WHEN rating_stars = 2 THEN 1 ELSE 0 END) as two_star,
        SUM(CASE WHEN rating_stars = 1 THEN 1 ELSE 0 END) as one_star,
        AVG(cleanliness_rating)::DECIMAL(3,2) as cleanliness_avg,
        AVG(professionalism_rating)::DECIMAL(3,2) as professionalism_avg,
        AVG(punctuality_rating)::DECIMAL(3,2) as punctuality_avg,
        ROUND(100.0 * SUM(CASE WHEN would_recommend = TRUE THEN 1 ELSE 0 END) / COUNT(*))::INTEGER as recommend_pct
       FROM booking_ratings WHERE vendor_id = $1`,
      [vendorId]
    );
 
    const avg = avgResult.rows[0];
 
    // Update or insert vendor average ratings
    await pool.query(
      `INSERT INTO vendor_average_ratings (vendor_id, average_rating, total_ratings, five_star_count, four_star_count, three_star_count, two_star_count, one_star_count, cleanliness_avg, professionalism_avg, punctuality_avg, recommend_percentage, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
       ON CONFLICT (vendor_id) DO UPDATE SET
       average_rating = $2, total_ratings = $3, five_star_count = $4, four_star_count = $5, three_star_count = $6, two_star_count = $7, one_star_count = $8, 
       cleanliness_avg = $9, professionalism_avg = $10, punctuality_avg = $11, recommend_percentage = $12, updated_at = NOW()`,
      [vendorId, avg.avg_rating, avg.total_ratings, avg.five_star, avg.four_star, avg.three_star, avg.two_star, avg.one_star, avg.cleanliness_avg, avg.professionalism_avg, avg.punctuality_avg, avg.recommend_pct]
    );
 
    return NextResponse.json({
      success: true,
      message: 'Thank you for your feedback!',
      rating: {
        booking_id: bookingId,
        rating_stars: rating_stars,
        review_text: review_text
      }
    });
 
  } catch (error) {
    console.error('Rating error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
 