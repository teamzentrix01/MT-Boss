import pool from '@/lib/db';
import { createInitializationGuard } from '@/lib/api-utils';
import { materialOrderStatusLabel } from '@/lib/material-orders';

export const ensureUserNotificationsSchema = createInitializationGuard(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_notifications (
      id BIGSERIAL PRIMARY KEY,
      user_id INTEGER,
      user_email VARCHAR(255),
      type VARCHAR(50) NOT NULL,
      title VARCHAR(160) NOT NULL,
      message TEXT,
      entity_type VARCHAR(40),
      entity_id INTEGER,
      dedupe_key VARCHAR(180),
      is_read BOOLEAN NOT NULL DEFAULT FALSE,
      read_at TIMESTAMPTZ,
      metadata JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS user_notifications_dedupe_uidx
    ON user_notifications (dedupe_key)
    WHERE dedupe_key IS NOT NULL
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS user_notifications_user_idx
    ON user_notifications (user_id, created_at DESC)
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS user_notifications_email_idx
    ON user_notifications (LOWER(user_email), created_at DESC)
  `);
});

function orderAudienceSql(startAt = 1) {
  return {
    sql: `(me.user_id = $${startAt} OR (me.user_id IS NULL AND LOWER(me.user_email) = LOWER($${startAt + 1})))`,
    params: [],
  };
}

export async function upsertUserNotification(client, {
  userId = null,
  userEmail = null,
  type,
  title,
  message = null,
  entityType = null,
  entityId = null,
  dedupeKey = null,
  metadata = {},
}) {
  if (!userId && !userEmail) return;
  const db = client || pool;
  await db.query(
    `INSERT INTO user_notifications
      (user_id, user_email, type, title, message, entity_type, entity_id, dedupe_key, metadata, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, NOW())
     ON CONFLICT (dedupe_key) WHERE dedupe_key IS NOT NULL DO NOTHING`,
    [
      userId,
      userEmail ? String(userEmail).trim().toLowerCase() : null,
      type,
      title,
      message,
      entityType,
      entityId,
      dedupeKey,
      JSON.stringify(metadata || {}),
    ]
  );
}

function notificationCopyForOrderEvent(order, event) {
  const ref = order.order_reference || `#${order.id}`;
  const status = String(event.status || order.status || '').toLowerCase();
  const label = materialOrderStatusLabel(status);
  const deliveryDate = order.estimated_delivery_date || order.delivery_date;
  const deliveryText = deliveryDate ? new Date(deliveryDate).toLocaleDateString('en-IN') : null;

  if (status === 'open') {
    return {
      type: 'order_placed',
      title: 'Order booked',
      message: `Your order ${ref} for ${order.material_type || order.category_name || 'materials'} has been placed.${deliveryText ? ` Requested delivery: ${deliveryText}.` : ''}`,
    };
  }
  if (['delivered', 'fulfilled'].includes(status)) {
    return {
      type: 'order_delivered',
      title: 'Order delivered',
      message: `Your order ${ref} has been delivered. Thank you for shopping with MTBOSS.`,
    };
  }
  if (deliveryText && ['confirmed', 'processing', 'accepted', 'packed', 'dispatched', 'out_for_delivery'].includes(status)) {
    return {
      type: 'order_scheduled',
      title: 'Delivery scheduled',
      message: `Order ${ref} is ${label.toLowerCase()}${deliveryText ? `. Expected by ${deliveryText}` : ''}.`,
    };
  }
  return {
    type: 'order_update',
    title: label,
    message: `Order ${ref}: ${event.title || label}${event.note ? `. ${event.note}` : ''}`,
  };
}

export async function notifyUserForMaterialOrderEvent(client, orderId, eventMeta = {}) {
  await ensureUserNotificationsSchema();
  const db = client || pool;
  const orderRes = await db.query(
    `SELECT id, user_id, user_email, order_reference, material_type, category_name,
            status, delivery_date, estimated_delivery_date
       FROM material_enquiries WHERE id = $1`,
    [orderId]
  );
  const order = orderRes.rows[0];
  if (!order) return;

  const event = {
    status: eventMeta.status || order.status,
    title: eventMeta.title,
    note: eventMeta.note,
  };
  const copy = notificationCopyForOrderEvent(order, event);
  const eventKey = eventMeta.eventId ? String(eventMeta.eventId) : `${event.status}-${Date.now()}`;
  await upsertUserNotification(db, {
    userId: order.user_id,
    userEmail: order.user_email,
    ...copy,
    entityType: 'material_order',
    entityId: order.id,
    dedupeKey: `material-order-${order.id}-${eventKey}`,
    metadata: { order_reference: order.order_reference, status: event.status },
  });
}

export async function syncUserNotificationsFromHistory(user) {
  await ensureUserNotificationsSchema();
  const audience = orderAudienceSql(1);
  audience.params = [user.id, user.email || ''];

  await pool.query(
    `INSERT INTO user_notifications
      (user_id, user_email, type, title, message, entity_type, entity_id, dedupe_key, created_at)
     SELECT me.user_id, LOWER(me.user_email),
            CASE
              WHEN LOWER(event.status) IN ('delivered', 'fulfilled') THEN 'order_delivered'
              WHEN LOWER(event.status) = 'open' THEN 'order_placed'
              WHEN COALESCE(me.estimated_delivery_date, me.delivery_date) IS NOT NULL
                   AND LOWER(event.status) NOT IN ('cancelled') THEN 'order_scheduled'
              ELSE 'order_update'
            END,
            COALESCE(NULLIF(TRIM(event.title), ''), 'Order update'),
            COALESCE(event.note, event.title, 'Your order ' || COALESCE(me.order_reference, me.id::TEXT) || ' was updated.'),
            'material_order', me.id, 'material-order-event-' || event.id, event.created_at
       FROM material_enquiries me
       JOIN material_order_events event ON event.order_id = me.id
      WHERE ${audience.sql}
     ON CONFLICT (dedupe_key) WHERE dedupe_key IS NOT NULL DO NOTHING`,
    audience.params
  );

  await pool.query(
    `INSERT INTO user_notifications
      (user_id, user_email, type, title, message, entity_type, entity_id, dedupe_key, created_at)
     SELECT $1, LOWER($2), 'service_booking', 'Service scheduled',
            COALESCE(qs.label, 'Quick service') || ' on '
            || TO_CHAR(sb.booking_date, 'DD Mon YYYY') || ' at ' || COALESCE(sb.booking_time, 'TBD')
            || CASE WHEN sb.service_city IS NOT NULL THEN ' · ' || sb.service_city ELSE '' END,
            'service_booking', sb.id, 'service-booking-' || sb.id || '-created', COALESCE(sb.created_at, NOW())
       FROM service_bookings sb
       LEFT JOIN quick_services qs ON qs.id = sb.quick_service_id
      WHERE (LOWER(sb.user_email) = LOWER($2) OR sb.user_phone = $3)
        AND NOT EXISTS (
          SELECT 1 FROM user_notifications un WHERE un.dedupe_key = 'service-booking-' || sb.id || '-created'
        )`,
    [user.id, user.email || '', String(user.phone || '').replace(/\D/g, '')]
  );
}
