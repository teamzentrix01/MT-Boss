import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getPayUConfig, verifyPayUResponse } from '@/lib/payu';
import { ensurePayUIntentSchema } from '@/lib/payu-intents';
import { ensurePackageSchema, getPackageById } from '@/lib/packages';

function resultRedirect(req, status, reference, message, returnTo = '/userdashboard') {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
  const url = new URL('/payment/payu', configured || new URL(req.url).origin);
  url.searchParams.set('status', status);
  if (reference) url.searchParams.set('booking', reference);
  if (message) url.searchParams.set('message', message);
  url.searchParams.set('returnTo', returnTo);
  return NextResponse.redirect(url, 303);
}

export async function POST(req) {
  const client = await pool.connect();

  try {
    const formData = await req.formData();
    const fields = Object.fromEntries(formData.entries());
    const { key } = getPayUConfig();

    if (String(fields.key || '') !== key || !verifyPayUResponse(fields)) {
      return resultRedirect(req, 'failed', fields.udf2, 'Payment response verification failed.');
    }

    await client.query('BEGIN');

    // Package purchases and the final service payment use the shared intent ledger.
    if (fields.udf3) {
      await ensurePayUIntentSchema(client);
      const intentResult = await client.query(
        `SELECT * FROM payu_payment_intents WHERE txnid = $1 FOR UPDATE`,
        [String(fields.txnid || '')]
      );
      const intent = intentResult.rows[0];
      const validIntent = intent
        && intent.purpose === fields.udf3
        && String(intent.entity_id) === String(fields.udf1 || '')
        && Number(intent.amount).toFixed(2) === Number(fields.amount).toFixed(2);

      if (!validIntent) {
        await client.query('ROLLBACK');
        return resultRedirect(req, 'failed', fields.udf2, 'Payment details could not be matched.');
      }

      const succeeded = fields.status === 'success' && fields.unmappedstatus !== 'failed';
      if (succeeded && intent.status !== 'PAID') {
        if (intent.purpose === 'booking_final') {
          await client.query(
            `UPDATE service_bookings
             SET status = 'COMPLETED', user_status = 'COMPLETED', payment_status = 'PAID',
                 user_paid_amount = $1, payment_gateway = 'PAYU', payment_gateway_id = $2,
                 payment_completed_at = NOW(), completed_at = NOW()
             WHERE id = $3 AND status = 'AWAITING_PAYMENT'`,
            [intent.amount, String(fields.mihpayid || ''), intent.entity_id]
          );
        } else if (intent.purpose === 'vendor_package' || intent.purpose === 'supplier_package') {
          await ensurePackageSchema();
          const pkg = getPackageById(intent.package_id);
          if (!pkg) throw new Error('Paid package no longer exists');
          const table = intent.purpose === 'vendor_package' ? 'vendors' : 'suppliers';
          await client.query(
            `UPDATE ${table}
             SET package_id = $1, package_name = $2, package_price = $3,
                 package_duration_months = $4, package_purchased_at = NOW(), package_status = 'pending'
             WHERE id = $5`,
            [pkg.id, pkg.name, pkg.price, pkg.duration_months, intent.entity_id]
          );
        }

        await client.query(
          `UPDATE payu_payment_intents
           SET status = 'PAID', gateway_id = $1, completed_at = NOW()
           WHERE id = $2`,
          [String(fields.mihpayid || ''), intent.id]
        );
      } else if (!succeeded && intent.status === 'PENDING') {
        await client.query(`UPDATE payu_payment_intents SET status = 'FAILED' WHERE id = $1`, [intent.id]);
      }

      await client.query('COMMIT');
      return resultRedirect(
        req,
        succeeded ? 'success' : 'failed',
        intent.purpose === 'booking_final' ? fields.udf2 : null,
        succeeded
          ? (intent.purpose.includes('package') ? 'Payment received. Package is pending admin approval.' : null)
          : fields.error_Message || 'Payment was not completed.',
        intent.purpose === 'vendor_package'
          ? '/vendor/dashboard?tab=packages'
          : intent.purpose === 'supplier_package'
            ? '/supplier/dashboard?tab=packages'
            : '/userdashboard'
      );
    }

    const bookingResult = await client.query(
      `SELECT id, booking_reference, user_name, service_city, base_amount,
              total_amount, slot_type, time_slot_id, payment_status
       FROM service_bookings
       WHERE payment_txnid = $1
       FOR UPDATE`,
      [String(fields.txnid || '')]
    );
    const booking = bookingResult.rows[0];

    if (!booking || String(booking.id) !== String(fields.udf1 || '')) {
      await client.query('ROLLBACK');
      return resultRedirect(req, 'failed', fields.udf2, 'Booking could not be matched to this payment.');
    }

    const expectedAmount = Number(booking.total_amount).toFixed(2);
    if (Number(fields.amount).toFixed(2) !== expectedAmount) {
      await client.query('ROLLBACK');
      return resultRedirect(req, 'failed', booking.booking_reference, 'Payment amount verification failed.');
    }

    const succeeded = fields.status === 'success' && fields.unmappedstatus !== 'failed';
    if (succeeded) {
      if (booking.payment_status !== 'PAID') {
        await client.query(
          `UPDATE service_bookings
           SET status = 'WAITING_FOR_VENDOR_ACCEPTANCE',
               user_status = 'PENDING',
               payment_status = 'PAID',
               payment_gateway_id = $1,
               payment_completed_at = NOW()
           WHERE id = $2`,
          [String(fields.mihpayid || ''), booking.id]
        );

        const vendors = await client.query(
          `SELECT DISTINCT v.id
           FROM vendors v
           WHERE LOWER(TRIM(v.city)) = LOWER(TRIM($1))
             AND v.is_approved = TRUE
             AND LOWER(COALESCE(v.status, 'active')) IN ('active', 'approved')
             AND COALESCE(v.verification_status, 'verified') IN ('verified', 'approved')`,
          [booking.service_city]
        );

        for (const vendor of vendors.rows) {
          await client.query(
            `INSERT INTO service_notifications
               (booking_id, vendor_id, notification_type, title, message, is_read, created_at)
             SELECT $1, $2, 'new_booking', 'New Service Request', $3, FALSE, NOW()
             WHERE NOT EXISTS (
               SELECT 1 FROM service_notifications
               WHERE booking_id = $1 AND vendor_id = $2 AND notification_type = 'new_booking'
             )`,
            [booking.id, vendor.id, `New ${booking.user_name} booking in ${booking.service_city}. Base: ₹${booking.base_amount}`]
          );
        }
      }

      await client.query('COMMIT');
      return resultRedirect(req, 'success', booking.booking_reference);
    }

    if (booking.payment_status === 'PENDING') {
      await client.query(
        `UPDATE service_bookings
         SET status = 'PAYMENT_FAILED', user_status = 'PAYMENT_FAILED', payment_status = 'FAILED'
         WHERE id = $1`,
        [booking.id]
      );

      if (booking.slot_type === 'free' && booking.time_slot_id) {
        await client.query(
          `UPDATE free_time_slots
           SET current_bookings = GREATEST(COALESCE(current_bookings, 0) - 1, 0),
               is_available = TRUE
           WHERE id = $1`,
          [booking.time_slot_id]
        );
      }
    }

    await client.query('COMMIT');
    return resultRedirect(req, 'failed', booking.booking_reference, fields.error_Message || 'Payment was not completed.');
  } catch (error) {
    try { await client.query('ROLLBACK'); } catch {}
    console.error('PayU callback error:', error);
    return resultRedirect(req, 'failed', null, 'Unable to verify the payment response.');
  } finally {
    client.release();
  }
}
