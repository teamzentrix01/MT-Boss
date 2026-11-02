import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { addMaterialOrderEvent, ensureMaterialOrderSchema } from '@/lib/material-orders';
import { deliverReturnSubmissionEmails, deliverReturnStatusUpdateEmail } from '@/lib/customer-communications';

function resolveActor(req) {
  for (const role of ['admin', 'user', 'supplier', 'vendor', 'franchise']) {
    const account = requireRole(req, role);
    if (account) return { ...account, role };
  }
  return null;
}

// ── POST: Customer submits Return / Replacement request ───────────────────────
export async function POST(req, { params }) {
  const client = await pool.connect();
  try {
    await ensureMaterialOrderSchema();
    const resolvedParams = await params;
    const orderId = Number(resolvedParams?.id);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid order ID' }, { status: 400 });
    }

    const actor = resolveActor(req);
    if (!actor || actor.role !== 'user') {
      return NextResponse.json({ success: false, error: 'Customer login required to request returns' }, { status: 401 });
    }

    const body = await req.json();
    const {
      reason,
      description,
      proof_images = [],
      action_type = 'REPLACEMENT',
      refund_preference = 'WALLET',
      upi_id = '',
    } = body;

    if (!reason?.trim()) {
      return NextResponse.json({ success: false, error: 'Please select a reason for the return' }, { status: 400 });
    }

    await client.query('BEGIN');

    // Fetch order
    const orderRes = await client.query(
      `SELECT * FROM material_enquiries WHERE id = $1 FOR UPDATE`,
      [orderId]
    );
    const order = orderRes.rows[0];

    if (!order) {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // Verify ownership
    if (order.user_id && order.user_id !== actor.id && String(order.user_email || '').toLowerCase() !== String(actor.email || '').toLowerCase()) {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'You are not authorized to return this order' }, { status: 403 });
    }

    // Check delivery status
    if (!['delivered', 'fulfilled'].includes(order.status)) {
      await client.query('ROLLBACK');
      return NextResponse.json(
        { success: false, error: 'Returns can only be requested once the material has been delivered' },
        { status: 400 }
      );
    }

    // Check if return is already pending or approved
    if (order.return_status && ['REQUESTED', 'APPROVED', 'PICKED_UP', 'COMPLETED'].includes(order.return_status)) {
      await client.query('ROLLBACK');
      return NextResponse.json(
        { success: false, error: `A return request is already in status: ${order.return_status}` },
        { status: 409 }
      );
    }

    const refundAmount = Number(order.grand_total) > 0 ? Number(order.grand_total) : (Number(order.product_total) || 0);

    // Insert into product_returns
    const returnInsert = await client.query(
      `INSERT INTO product_returns
        (order_id, order_reference, user_id, customer_name, customer_phone,
         reason, description, proof_images, action_type, refund_preference, upi_id,
         status, refund_amount)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10, $11, 'REQUESTED', $12)
       RETURNING *`,
      [
        order.id,
        order.order_reference,
        actor.id,
        order.user_name || actor.name,
        order.user_phone || actor.phone,
        reason.trim(),
        description?.trim() || null,
        JSON.stringify(Array.isArray(proof_images) ? proof_images : []),
        action_type === 'REFUND' ? 'REFUND' : 'REPLACEMENT',
        refund_preference || 'WALLET',
        upi_id?.trim() || null,
        refundAmount,
      ]
    );

    const returnRecord = returnInsert.rows[0];

    // Update material_enquiries
    await client.query(
      `UPDATE material_enquiries
       SET return_status = 'REQUESTED',
           return_reason = $1,
           return_action = $2,
           return_requested_at = NOW(),
           return_details = $3::jsonb
       WHERE id = $4`,
      [
        reason.trim(),
        action_type === 'REFUND' ? 'REFUND' : 'REPLACEMENT',
        JSON.stringify(returnRecord),
        order.id,
      ]
    );

    // Add event to timeline
    await addMaterialOrderEvent(client, {
      orderId: order.id,
      status: order.status,
      title: `${action_type === 'REFUND' ? 'Return & Refund' : 'Product Replacement'} Requested`,
      note: `Customer requested ${action_type} for reason: "${reason}". Details: ${description || 'No additional note'}. ${proof_images.length ? `(${proof_images.length} proof photos attached)` : ''}`,
      actorRole: 'user',
      actorId: actor.id,
      actorName: actor.name || order.user_name || 'Customer',
    });

    await client.query('COMMIT');

    // Trigger email notifications in background
    deliverReturnSubmissionEmails({
      order,
      returnRecord,
      customerEmail: actor.email,
      customerName: actor.name,
    }).catch((e) => console.error('[return submission email error]:', e));

    return NextResponse.json({ success: true, data: returnRecord }, { status: 201 });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[return POST error]:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  } finally {
    client.release();
  }
}

// ── PATCH: Admin / Supplier updates Return status ─────────────────────────────
export async function PATCH(req, { params }) {
  const client = await pool.connect();
  try {
    await ensureMaterialOrderSchema();
    const resolvedParams = await params;
    const orderId = Number(resolvedParams?.id);

    const actor = resolveActor(req);
    if (!actor || !['admin', 'supplier'].includes(actor.role)) {
      return NextResponse.json({ success: false, error: 'Admin or supplier access required' }, { status: 403 });
    }

    const body = await req.json();
    const { status, admin_notes, pickup_date } = body;

    const validStatuses = ['APPROVED', 'PICKED_UP', 'COMPLETED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid return status' }, { status: 400 });
    }

    await client.query('BEGIN');

    // Fetch order & return
    const orderRes = await client.query(
      `SELECT * FROM material_enquiries WHERE id = $1 FOR UPDATE`,
      [orderId]
    );
    const order = orderRes.rows[0];

    if (!order) {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // If supplier, verify assigned
    if (actor.role === 'supplier' && order.accepted_by_supplier_id !== actor.id && order.assigned_entity_id !== actor.id) {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'You are not assigned to this order' }, { status: 403 });
    }

    const returnRes = await client.query(
      `SELECT * FROM product_returns WHERE order_id = $1 ORDER BY id DESC LIMIT 1 FOR UPDATE`,
      [orderId]
    );
    const returnRecord = returnRes.rows[0];

    if (!returnRecord) {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'No return request found for this order' }, { status: 404 });
    }

    // Update return record
    await client.query(
      `UPDATE product_returns
       SET status = $1,
           admin_notes = COALESCE($2, admin_notes),
           pickup_date = COALESCE($3, pickup_date),
           updated_at = NOW()
       WHERE id = $4`,
      [status, admin_notes || null, pickup_date || null, returnRecord.id]
    );

    // Update material_enquiries
    await client.query(
      `UPDATE material_enquiries
       SET return_status = $1,
           return_details = jsonb_set(COALESCE(return_details, '{}'::jsonb), '{status}', to_jsonb($1::text))
       WHERE id = $2`,
      [status, order.id]
    );

    // If status is COMPLETED and action is REFUND via WALLET, credit wallet
    if (status === 'COMPLETED' && returnRecord.action_type === 'REFUND' && returnRecord.refund_preference === 'WALLET') {
      const refundAmt = Number(returnRecord.refund_amount) || Number(order.grand_total) || 0;
      if (refundAmt > 0 && order.user_id) {
        // Ensure wallet exists
        await client.query(
          `INSERT INTO wallets (user_id, balance, pending_balance)
           VALUES ($1, $2, 0)
           ON CONFLICT (user_id) DO UPDATE
           SET balance = wallets.balance + EXCLUDED.balance,
               updated_at = NOW()`,
          [order.user_id, refundAmt]
        );

        // Record wallet transaction
        await client.query(
          `INSERT INTO wallet_transactions
            (user_id, order_id, type, source, amount, description, status)
           VALUES ($1, $2, 'CREDIT', 'REFUND', $3, $4, 'COMPLETED')`,
          [
            order.user_id,
            order.id,
            refundAmt,
            `Refund for returned order ${order.order_reference}`,
          ]
        ).catch(() => {});

        await client.query(
          `UPDATE product_returns SET refund_status = 'PROCESSED' WHERE id = $1`,
          [returnRecord.id]
        );
      }
    }

    // Add event log
    const eventTitles = {
      APPROVED: 'Return Request Approved',
      PICKED_UP: 'Material Picked Up from Site',
      COMPLETED: returnRecord.action_type === 'REFUND' ? 'Return Refund Completed' : 'Replacement Dispatched & Completed',
      REJECTED: 'Return Request Rejected',
    };

    await addMaterialOrderEvent(client, {
      orderId: order.id,
      status: order.status,
      title: eventTitles[status] || `Return status: ${status}`,
      note: admin_notes ? `Notes: ${admin_notes}` : `Return has been marked as ${status}.`,
      actorRole: actor.role,
      actorId: actor.id,
      actorName: actor.name || actor.shop_name || 'Admin',
    });

    await client.query('COMMIT');

    // Trigger status update email in background
    deliverReturnStatusUpdateEmail({
      order,
      returnRecord,
      newStatus: status,
      adminNotes: admin_notes,
      customerEmail: order.user_email,
      customerName: order.user_name,
    }).catch((e) => console.error('[return status update email error]:', e));

    return NextResponse.json({ success: true, message: `Return updated to ${status}` });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[return PATCH error]:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  } finally {
    client.release();
  }
}

