import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// PUT - Vendor accept/reject booking
export async function PUT(req) {
  try {
    const {
      booking_id,
      vendor_id,
      action, // 'accept', 'reject'
      vendor_notes
    } = await req.json();

    if (!booking_id || !vendor_id || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get booking details
    const bookingResult = await pool.query(
      'SELECT * FROM service_bookings WHERE id = $1',
      [booking_id]
    );

    if (bookingResult.rows.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const booking = bookingResult.rows[0];

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      if (action === 'accept') {
        // Accept booking
        const updateResult = await client.query(
          `UPDATE service_bookings 
           SET vendor_id = $1, 
               vendor_status = 'vendor_accepted',
               status = 'assigned',
               vendor_notes = $2,
               accepted_at = NOW()
           WHERE id = $3
           RETURNING *`,
          [vendor_id, vendor_notes || '', booking_id]
        );

        // Notify other vendors that booking is taken
        await client.query(
          `UPDATE service_notifications 
           SET is_read = TRUE
           WHERE booking_id = $1 AND vendor_id != $2`,
          [booking_id, vendor_id]
        );

        // Mark other vendors' notifications as read and send rejection
        const otherVendorsResult = await client.query(
          `SELECT vendor_id FROM service_notifications 
           WHERE booking_id = $1 AND vendor_id != $2`,
          [booking_id, vendor_id]
        );

        for (const otherVendor of otherVendorsResult.rows) {
          await client.query(
            `INSERT INTO service_notifications (
              booking_id, vendor_id, notification_type, title, message
            ) VALUES ($1, $2, $3, $4, $5)`,
            [
              booking_id,
              otherVendor.vendor_id,
              'booking_cancelled',
              'Booking Assigned to Another Vendor',
              'This booking has been accepted by another vendor'
            ]
          );
        }

        await client.query('COMMIT');

        return NextResponse.json({
          success: true,
          message: 'Booking accepted successfully',
          data: updateResult.rows[0]
        });

      } else if (action === 'reject') {
        // Reject booking
        await client.query(
          `UPDATE service_bookings 
           SET vendor_status = 'vendor_rejected',
               vendor_notes = $1,
               updated_at = NOW()
           WHERE id = $2`,
          [vendor_notes || '', booking_id]
        );

        // Create notification for user
        await client.query(
          `INSERT INTO service_notifications (
            booking_id, vendor_id, notification_type, title, message
          ) VALUES ($1, $2, $3, $4, $5)`,
          [
            booking_id,
            vendor_id,
            'vendor_update',
            'Vendor Unavailable',
            'The vendor cannot serve this request at the moment'
          ]
        );

        await client.query('COMMIT');

        return NextResponse.json({
          success: true,
          message: 'Booking rejected successfully'
        });
      }

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update booking status
export async function PATCH(req) {
  try {
    const {
      booking_id,
      vendor_status, // 'on_the_way', 'reached', 'work_done'
      user_status,   // 'payment_done'
      final_amount,
      user_paid_amount,
      vendor_notes,
      admin_notes
    } = await req.json();

    if (!booking_id) {
      return NextResponse.json(
        { error: 'Booking ID required' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const updateQuery = `UPDATE service_bookings SET `;
      const updates = [];
      const params = [booking_id];
      let paramIndex = 2;

      if (vendor_status) {
        updates.push(`vendor_status = $${paramIndex++}`);
        params.push(vendor_status);
        
        if (vendor_status === 'on_the_way') {
          updates.push(`started_at = NOW()`);
        } else if (vendor_status === 'work_done') {
          updates.push(`status = 'completed'`);
          updates.push(`completed_at = NOW()`);
        }
      }

      if (user_status === 'payment_done') {
        updates.push(`user_status = $${paramIndex++}`);
        params.push('payment_done');
        updates.push(`payment_status = 'completed'`);
        updates.push(`user_paid_amount = $${paramIndex++}`);
        params.push(user_paid_amount);
        updates.push(`status = 'completed'`);
      }

      if (final_amount) {
        updates.push(`final_amount = $${paramIndex++}`);
        params.push(final_amount);
      }

      if (vendor_notes) {
        updates.push(`vendor_notes = $${paramIndex++}`);
        params.push(vendor_notes);
      }

      if (admin_notes) {
        updates.push(`admin_notes = $${paramIndex++}`);
        params.push(admin_notes);
      }

      updates.push(`updated_at = NOW()`);

      params.push(booking_id);

      const result = await client.query(
        `${updateQuery}${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
        params.slice(0, -1).concat(booking_id)
      );

      // Update vendor stats if booking is completed
      if (user_status === 'payment_done' && result.rows[0]) {
        const booking = result.rows[0];
        await client.query(
          `UPDATE vendor_stats 
           SET completed_bookings = completed_bookings + 1,
               total_earnings = total_earnings + $1
           WHERE vendor_id = $2`,
          [user_paid_amount || final_amount || 0, booking.vendor_id]
        );
      }

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        message: 'Booking updated successfully',
        data: result.rows[0]
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error updating booking status:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

// DELETE - Cancel booking
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const booking_id = searchParams.get('booking_id');

    if (!booking_id) {
      return NextResponse.json({ error: 'Booking ID required' }, { status: 400 });
    }

    const result = await pool.query(
      `UPDATE service_bookings 
       SET status = 'cancelled', updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [booking_id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Booking cancelled successfully'
    });

  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}