import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';
import {
  MATERIAL_ORDER_STATUSES,
  addMaterialOrderEvent,
  ensureMaterialOrderSchema,
  materialOrderStatusLabel,
} from '@/lib/material-orders';

function resolveActor(req) {
  for (const role of ['admin', 'user', 'supplier', 'vendor', 'franchise']) {
    const account = requireRole(req, role);
    if (account) return { ...account, role };
  }
  return null;
}

function actorName(actor) {
  return actor.name || actor.shop_name || actor.email || actor.role;
}

function orderScope(actor, startAt = 1) {
  if (actor.role === 'admin') return { sql: 'TRUE', params: [] };
  if (actor.role === 'user') {
    return {
      sql: `(me.user_id = $${startAt} OR (me.user_id IS NULL AND LOWER(me.user_email) = LOWER($${startAt + 1})))`,
      params: [actor.id, actor.email || ''],
    };
  }
  if (actor.role === 'supplier') {
    return {
      sql: `((me.assigned_role = 'supplier' AND me.assigned_entity_id = $${startAt})
             OR me.accepted_by_supplier_id = $${startAt})`,
      params: [actor.id],
    };
  }
  return {
    sql: `(me.assigned_role = $${startAt} AND me.assigned_entity_id = $${startAt + 1})`,
    params: [actor.role, actor.id],
  };
}

const ORDER_SELECT = `
  SELECT me.*,
         s.shop_name AS accepted_by_shop,
         CASE me.assigned_role
           WHEN 'supplier' THEN (SELECT COALESCE(shop_name, business_name, email) FROM suppliers WHERE id = me.assigned_entity_id)
           WHEN 'vendor' THEN (SELECT COALESCE(shop_name, business_name, email) FROM vendors WHERE id = me.assigned_entity_id)
           WHEN 'franchise' THEN (SELECT COALESCE(name, email) FROM franchises WHERE id = me.assigned_entity_id)
           WHEN 'admin' THEN 'MTBoss Admin'
           ELSE NULL
         END AS assigned_name,
         COALESCE((
           SELECT json_agg(json_build_object(
             'id', event.id,
             'status', event.status,
             'title', event.title,
             'note', event.note,
             'actor_role', event.actor_role,
             'actor_name', event.actor_name,
             'created_at', event.created_at
           ) ORDER BY event.created_at ASC, event.id ASC)
           FROM material_order_events event
           WHERE event.order_id = me.id
         ), '[]'::json) AS history
    FROM material_enquiries me
    LEFT JOIN suppliers s ON s.id = me.accepted_by_supplier_id
`;

export async function GET(req) {
  try {
    await ensureMaterialOrderSchema();
    const actor = resolveActor(req);
    if (!actor) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    if (searchParams.get('action') === 'assignees') {
      if (actor.role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
      }
      const city = String(searchParams.get('city') || '').trim();
      const [suppliers, vendors, franchises] = await Promise.all([
        pool.query(
          `SELECT id, COALESCE(shop_name, business_name, email) AS name, city, 'supplier' AS role
             FROM suppliers
            WHERE status = 'approved' AND COALESCE(is_active, TRUE) = TRUE
              AND ($1 = '' OR LOWER(TRIM(city)) = LOWER(TRIM($1)))
            ORDER BY name`,
          [city]
        ),
        pool.query(
          `SELECT id, COALESCE(shop_name, business_name, email) AS name, city, 'vendor' AS role
             FROM vendors
            WHERE is_approved = TRUE AND LOWER(COALESCE(status, 'active')) IN ('active', 'approved')
              AND ($1 = '' OR LOWER(TRIM(city)) = LOWER(TRIM($1)))
            ORDER BY name`,
          [city]
        ),
        pool.query(
          `SELECT id, COALESCE(name, email) AS name, city, 'franchise' AS role
             FROM franchises
            WHERE status = 'Approved' AND login_enabled = TRUE
              AND ($1 = '' OR LOWER(TRIM(city)) = LOWER(TRIM($1)))
            ORDER BY name`,
          [city]
        ),
      ]);
      return NextResponse.json({
        success: true,
        data: [...suppliers.rows, ...vendors.rows, ...franchises.rows],
      });
    }

    const scope = orderScope(actor);
    const result = await pool.query(
      `${ORDER_SELECT} WHERE ${scope.sql} ORDER BY me.created_at DESC`,
      scope.params
    );
    return NextResponse.json({
      success: true,
      data: result.rows,
      actor: { role: actor.role, id: actor.id },
      statuses: MATERIAL_ORDER_STATUSES,
    });
  } catch (error) {
    console.error('Material orders GET error:', error);
    return NextResponse.json({ success: false, error: 'Orders could not be loaded' }, { status: 500 });
  }
}

export async function PATCH(req) {
  const client = await pool.connect();
  try {
    await ensureMaterialOrderSchema();
    const actor = resolveActor(req);
    if (!actor) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    const orderId = Number(body.id);
    if (!Number.isInteger(orderId) || orderId <= 0) {
      return NextResponse.json({ success: false, error: 'Valid order id is required' }, { status: 400 });
    }

    await client.query('BEGIN');
    const locked = await client.query(
      `SELECT * FROM material_enquiries WHERE id = $1 FOR UPDATE`,
      [orderId]
    );
    const order = locked.rows[0];
    if (!order) {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    if (body.action === 'assign') {
      if (actor.role !== 'admin') {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
      }
      const assignedRole = String(body.assigned_role || '');
      const assignedId = Number(body.assigned_entity_id);
      if (!['supplier', 'vendor', 'franchise'].includes(assignedRole) || !Number.isInteger(assignedId)) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Select a valid assignee' }, { status: 400 });
      }
      const table = assignedRole === 'supplier' ? 'suppliers' : assignedRole === 'vendor' ? 'vendors' : 'franchises';
      const nameColumn = assignedRole === 'franchise'
        ? 'COALESCE(name, email)'
        : 'COALESCE(shop_name, business_name, email)';
      const assignee = await client.query(
        `SELECT id, ${nameColumn} AS name FROM ${table} WHERE id = $1`,
        [assignedId]
      );
      if (!assignee.rows[0]) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Assignee not found' }, { status: 404 });
      }
      await client.query(
        `UPDATE material_enquiries
            SET assigned_role = $1::TEXT, assigned_entity_id = $2::INTEGER,
                accepted_by_supplier_id = CASE WHEN $1::TEXT = 'supplier' THEN $2::INTEGER ELSE NULL END,
                status = CASE WHEN status = 'open' THEN 'accepted' ELSE status END,
                accepted_at = COALESCE(accepted_at, NOW()), updated_at = NOW()
          WHERE id = $3`,
        [assignedRole, assignedId, orderId]
      );
      await addMaterialOrderEvent(client, {
        orderId,
        status: order.status === 'open' ? 'accepted' : order.status,
        title: `Assigned to ${assignee.rows[0].name}`,
        note: body.note || null,
        actorRole: actor.role,
        actorId: actor.id,
        actorName: actorName(actor),
      });
    } else {
      const nextStatus = String(body.status || '');
      if (!MATERIAL_ORDER_STATUSES.includes(nextStatus) || nextStatus === 'open') {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Select a valid order status' }, { status: 400 });
      }
      if (actor.role === 'supplier' && ['delivered', 'fulfilled'].includes(nextStatus)) {
        await client.query('ROLLBACK');
        return NextResponse.json({
          success: false,
          error: 'Use the supplier fulfil order action to record the received amount and commission',
        }, { status: 400 });
      }
      const canUpdate = actor.role === 'admin'
        || (
          order.assigned_role === actor.role
          && Number(order.assigned_entity_id) === Number(actor.id)
        )
        || (
          actor.role === 'supplier'
          && Number(order.accepted_by_supplier_id) === Number(actor.id)
        );
      if (!canUpdate) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'This order is not assigned to your account' }, { status: 403 });
      }
      const note = String(body.note || '').trim() || null;
      const estimatedDelivery = body.estimated_delivery_date || null;
      const deliveryAmount = Number(body.amount_received || 0);
      const isSupplierDelivery = order.assigned_role === 'supplier' || order.accepted_by_supplier_id;
      if (actor.role === 'admin' && isSupplierDelivery && ['delivered', 'fulfilled'].includes(nextStatus) && (!Number.isFinite(deliveryAmount) || deliveryAmount <= 0)) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Enter the final order amount to mark a supplier order as delivered and calculate commission.' }, { status: 400 });
      }
      const finalStatus = actor.role === 'admin' && isSupplierDelivery && ['delivered', 'fulfilled'].includes(nextStatus) ? 'fulfilled' : nextStatus;
      const commission = actor.role === 'admin' && isSupplierDelivery && ['delivered', 'fulfilled'].includes(nextStatus)
        ? Math.round(deliveryAmount * 0.15 * 100) / 100
        : null;
      await client.query(
        `UPDATE material_enquiries
             SET status = $1::TEXT, status_note = $2::TEXT,
                 estimated_delivery_date = COALESCE($3::DATE, estimated_delivery_date),
                 amount_received = COALESCE($4::NUMERIC, amount_received),
                 admin_commission = COALESCE($5::NUMERIC, admin_commission),
                 fulfilled_at = CASE WHEN $1::TEXT IN ('delivered', 'fulfilled') THEN COALESCE(fulfilled_at, NOW()) ELSE fulfilled_at END,
                 updated_at = NOW()
           WHERE id = $6`,
        [finalStatus, note, estimatedDelivery, commission === null ? null : deliveryAmount, commission, orderId]
      );
      await addMaterialOrderEvent(client, {
        orderId,
        status: finalStatus,
        title: materialOrderStatusLabel(finalStatus),
        note,
        actorRole: actor.role,
        actorId: actor.id,
        actorName: actorName(actor),
      });
    }

    await client.query('COMMIT');
    const scope = orderScope(actor, 2);
    const updated = await pool.query(
      `${ORDER_SELECT} WHERE me.id = $1 AND (${scope.sql})`,
      [orderId, ...scope.params]
    );
    return NextResponse.json({ success: true, data: updated.rows[0] || null });
  } catch (error) {
    try { await client.query('ROLLBACK'); } catch {}
    console.error('Material orders PATCH error:', error);
    return NextResponse.json({ success: false, error: 'Order could not be updated' }, { status: 500 });
  } finally {
    client.release();
  }
}
