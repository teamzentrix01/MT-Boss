import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getPayUConfig, verifyPayUResponse } from '@/lib/payu';
import { ensurePayUIntentSchema } from '@/lib/payu-intents';
import { ensurePackageSchema, getPackageById } from '@/lib/packages';
import { deliverPaymentInvoice, notifyAdminSubmission } from '@/lib/customer-communications';

function resultRedirect(req, status, reference, message, returnTo = '/userdashboard', receipt = null) {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
  const url = new URL('/payment/payu', configured || new URL(req.url).origin);
  url.searchParams.set('status', status);
  if (reference) url.searchParams.set('booking', reference);
  if (message) url.searchParams.set('message', message);
  url.searchParams.set('returnTo', returnTo);
  if (receipt?.service) url.searchParams.set('service', receipt.service);
  if (receipt?.amount !== undefined) url.searchParams.set('amount', String(receipt.amount));
  if (receipt?.paymentId) url.searchParams.set('paymentId', receipt.paymentId);
  return NextResponse.redirect(url, 303);
}

function withPaymentParams(path, status, message) {
  const url = new URL(path, 'https://mtboss.local');
  url.searchParams.set('payment', status);
  if (message) url.searchParams.set('message', message);
  return `${url.pathname}${url.search}`;
}

export async function POST(req) {
  const client = await pool.connect();
  let paymentNotice = null;

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
                 user_paid_amount = COALESCE(user_paid_amount, 0) + $1,
                 payment_gateway = 'PAYU', payment_gateway_id = $2,
                 payment_completed_at = NOW(), completed_at = NOW()
             WHERE id = $3 AND status = 'AWAITING_PAYMENT'`,
            [intent.amount, String(fields.mihpayid || ''), intent.entity_id]
          );
        } else if (
          intent.purpose === 'vendor_package'
          || intent.purpose === 'vendor_registration'
          || intent.purpose === 'supplier_package'
          || intent.purpose === 'supplier_registration'
        ) {
          await ensurePackageSchema();
          const pkg = getPackageById(intent.package_id);
          if (!pkg) throw new Error('Paid package no longer exists');
          const table = intent.purpose.startsWith('vendor_') ? 'vendors' : 'suppliers';
          await client.query(
            `UPDATE ${table}
             SET package_id = $1, package_name = $2, package_price = $3,
                 package_duration_months = $4, package_purchased_at = NOW(), package_status = 'pending'
             WHERE id = $5`,
            [pkg.id, pkg.name, pkg.price, pkg.duration_months, intent.entity_id]
          );
          if (intent.purpose === 'vendor_registration') {
            await client.query(
              `UPDATE vendors
               SET verification_status = 'pending', status = 'inactive', updated_at = NOW()
               WHERE id = $1 AND verification_status = 'payment_pending'`,
              [intent.entity_id]
            );
          }
        } else if (intent.purpose === 'franchise_registration') {
          await client.query(
            `UPDATE franchises
             SET payment_status = 'PAID',
                 registration_fee = $1,
                 payment_gateway = 'PAYU',
                 payment_gateway_id = $2,
                 payment_completed_at = NOW()
             WHERE id = $3`,
            [intent.amount, String(fields.mihpayid || ''), intent.entity_id]
          );
        }

        await client.query(
          `UPDATE payu_payment_intents
           SET status = 'PAID', gateway_id = $1, completed_at = NOW()
           WHERE id = $2`,
          [String(fields.mihpayid || ''), intent.id]
        );

        if (intent.purpose === 'booking_final') {
          const recipient = await client.query(
            `SELECT sb.user_name AS name, sb.user_email AS email, sb.user_phone AS phone,
                    sb.booking_reference AS reference,
                    COALESCE(qs.label, sb.service_subcategory, 'Service booking') AS service
             FROM service_bookings sb LEFT JOIN quick_services qs ON qs.id = sb.quick_service_id
             WHERE sb.id = $1`,
            [intent.entity_id]
          );
          paymentNotice = { ...recipient.rows[0], amount: intent.amount };
        } else {
          const table = intent.purpose.startsWith('vendor_')
            ? 'vendors' : intent.purpose.startsWith('supplier_') ? 'suppliers' : 'franchises';
          const nameColumn = table === 'vendors' ? 'vendor_name' : table === 'suppliers' ? 'shop_name' : 'name';
          const recipient = await client.query(`SELECT ${nameColumn} AS name, email, phone FROM ${table} WHERE id = $1`, [intent.entity_id]);
          paymentNotice = {
            ...recipient.rows[0], amount: intent.amount, reference: fields.txnid,
            service: intent.purpose === 'franchise_registration'
              ? 'Franchise registration'
              : (getPackageById(intent.package_id)?.name || intent.purpose.replaceAll('_', ' ')),
          };
        }
      } else if (!succeeded && intent.status === 'PENDING') {
        await client.query(`UPDATE payu_payment_intents SET status = 'FAILED' WHERE id = $1`, [intent.id]);
        if (intent.purpose === 'franchise_registration') {
          await client.query(
            `UPDATE franchises
             SET payment_status = 'FAILED'
             WHERE id = $1 AND payment_status <> 'PAID'`,
            [intent.entity_id]
          );
        }
      }

      await client.query('COMMIT');
      if (paymentNotice) {
        const invoice = {
          customerName: paymentNotice.name, email: paymentNotice.email, phone: paymentNotice.phone,
          service: paymentNotice.service, amount: paymentNotice.amount,
          reference: paymentNotice.reference || fields.txnid, paymentId: String(fields.mihpayid || ''), paymentMethod: 'PayU',
        };
        await Promise.all([
          deliverPaymentInvoice(invoice),
          notifyAdminSubmission({ type: 'successful payment', name: invoice.customerName, phone: invoice.phone, email: invoice.email, reference: invoice.reference, details: { Service: invoice.service, Amount: `INR ${invoice.amount}`, 'Payment ID': invoice.paymentId } }),
        ]);
      }
      const resultMessage = succeeded
        ? (
          intent.purpose.includes('package')
            ? 'Payment received. Package is pending admin approval.'
            : intent.purpose.includes('registration')
              ? 'Payment received. Your registration is pending admin approval.'
              : null
        )
        : fields.error_Message || 'Payment was not completed.';
      const franchiseReturnTo = withPaymentParams('/franchise', succeeded ? 'success' : 'failed', resultMessage);

      return resultRedirect(
        req,
        succeeded ? 'success' : 'failed',
        intent.purpose === 'booking_final' ? fields.udf2 : null,
        resultMessage,
        intent.purpose === 'vendor_package'
          ? '/vendor/dashboard?tab=packages'
        : intent.purpose === 'vendor_registration'
            ? (succeeded ? '/vendor/pending-approval' : '/vendor/signup')
          : intent.purpose === 'supplier_package'
            ? '/supplier/dashboard?tab=packages'
            : intent.purpose === 'supplier_registration'
              ? '/supplier/pending-approval'
              : intent.purpose === 'franchise_registration'
                ? franchiseReturnTo
            : '/userdashboard',
        paymentNotice ? { service: paymentNotice.service, amount: paymentNotice.amount, paymentId: String(fields.mihpayid || '') } : null
      );
    }

    const bookingResult = await client.query(
      `SELECT id, booking_reference, user_name, user_email, user_phone, service_city, service_subcategory, quick_service_id, base_amount,
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
        const vendors = await client.query(
          `SELECT DISTINCT v.id
           FROM vendors v
           JOIN vendor_services vs
             ON vs.vendor_id = v.id
            AND vs.quick_service_id = $2
            AND vs.is_active = TRUE
           WHERE LOWER(TRIM(v.city)) = LOWER(TRIM($1))
             AND v.is_approved = TRUE
             AND LOWER(COALESCE(v.status, 'active')) IN ('active', 'approved')
             AND COALESCE(v.verification_status, 'verified') IN ('verified', 'approved')
             AND v.package_status = 'active'
             AND (v.package_expires_at IS NULL OR v.package_expires_at > NOW())`,
          [booking.service_city, booking.quick_service_id]
        );

        const nextStatus = vendors.rows.length > 0
          ? 'WAITING_FOR_VENDOR_ACCEPTANCE'
          : 'WAITING_FOR_ADMIN_ASSIGNMENT';
        await client.query(
          `UPDATE service_bookings
           SET status = $1, user_status = $2, payment_status = 'PAID',
               user_paid_amount = COALESCE(user_paid_amount, 0) + total_amount,
               payment_gateway_id = $3, payment_completed_at = NOW()
           WHERE id = $4`,
          [nextStatus, nextStatus, String(fields.mihpayid || ''), booking.id]
        );
        const serviceResult = await client.query('SELECT label FROM quick_services WHERE id = $1', [booking.quick_service_id]);
        paymentNotice = {
          name: booking.user_name, email: booking.user_email, phone: booking.user_phone,
          service: serviceResult.rows[0]?.label || booking.service_subcategory || 'Service booking',
          amount: booking.total_amount, reference: booking.booking_reference,
        };

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
      if (paymentNotice) {
        const invoice = {
          customerName: paymentNotice.name, email: paymentNotice.email, phone: paymentNotice.phone,
          service: paymentNotice.service, amount: paymentNotice.amount, reference: paymentNotice.reference,
          paymentId: String(fields.mihpayid || ''), paymentMethod: 'PayU',
        };
        await Promise.all([
          deliverPaymentInvoice(invoice),
          notifyAdminSubmission({ type: 'paid service booking', name: invoice.customerName, phone: invoice.phone, email: invoice.email, reference: invoice.reference, details: { Service: invoice.service, Amount: `INR ${invoice.amount}`, City: booking.service_city } }),
        ]);
      }
      return resultRedirect(req, 'success', booking.booking_reference, null, '/userdashboard', {
        service: paymentNotice?.service,
        amount: paymentNotice?.amount,
        paymentId: String(fields.mihpayid || ''),
      });
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
