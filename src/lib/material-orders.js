import pool from '@/lib/db';
import { createInitializationGuard } from '@/lib/api-utils';

export const MATERIAL_ORDER_STATUSES = [
  'open',
  'accepted',
  'confirmed',
  'processing',
  'packed',
  'dispatched',
  'out_for_delivery',
  'delivered',
  'fulfilled',
  'cancelled',
];

export const MATERIAL_ORDER_STATUS_LABELS = {
  open: 'Order Placed',
  accepted: 'Accepted',
  confirmed: 'Confirmed',
  processing: 'Processing',
  packed: 'Packed',
  dispatched: 'Dispatched',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  fulfilled: 'Delivered',
  cancelled: 'Cancelled',
};

export const ensureMaterialOrderSchema = createInitializationGuard(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS material_enquiries (
      id SERIAL PRIMARY KEY,
      user_name VARCHAR(255) NOT NULL,
      user_phone VARCHAR(20) NOT NULL,
      user_email VARCHAR(255),
      category_name VARCHAR(255) NOT NULL,
      category_emoji TEXT DEFAULT '',
      material_type VARCHAR(255),
      subcategory_name VARCHAR(255),
      brand_company VARCHAR(255),
      quantity_text VARCHAR(255),
      order_unit VARCHAR(100),
      delivery_date DATE,
      delivery_address TEXT,
      latitude DECIMAL(10,8),
      longitude DECIMAL(11,8),
      message TEXT,
      selected_city VARCHAR(100),
      status VARCHAR(50) DEFAULT 'open',
      accepted_by_supplier_id INTEGER,
      accepted_at TIMESTAMP,
      fulfilled_at TIMESTAMP,
      amount_received NUMERIC(10,2),
      admin_commission NUMERIC(10,2),
      supplier_notes TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  await pool.query(`
    ALTER TABLE material_enquiries
      ADD COLUMN IF NOT EXISTS user_id INTEGER,
      ADD COLUMN IF NOT EXISTS order_reference VARCHAR(40),
      ADD COLUMN IF NOT EXISTS assigned_role VARCHAR(30),
      ADD COLUMN IF NOT EXISTS assigned_entity_id INTEGER,
      ADD COLUMN IF NOT EXISTS status_note TEXT,
      ADD COLUMN IF NOT EXISTS estimated_delivery_date DATE
  `);
  await pool.query(`
    UPDATE material_enquiries
       SET order_reference = 'MO-' || TO_CHAR(COALESCE(created_at, NOW()), 'YYYYMMDD') || '-' || LPAD(id::TEXT, 6, '0')
     WHERE order_reference IS NULL OR TRIM(order_reference) = ''
  `);
  await pool.query(`
    UPDATE material_enquiries
       SET assigned_role = 'supplier',
           assigned_entity_id = accepted_by_supplier_id
     WHERE accepted_by_supplier_id IS NOT NULL
       AND (assigned_role IS NULL OR assigned_entity_id IS NULL)
  `);
  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS material_enquiries_order_reference_uidx
    ON material_enquiries (order_reference)
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS material_enquiries_user_idx
    ON material_enquiries (user_id, created_at DESC)
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS material_enquiries_assignment_idx
    ON material_enquiries (assigned_role, assigned_entity_id, created_at DESC)
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS material_order_events (
      id BIGSERIAL PRIMARY KEY,
      order_id INTEGER NOT NULL REFERENCES material_enquiries(id) ON DELETE CASCADE,
      status VARCHAR(50) NOT NULL,
      title VARCHAR(160) NOT NULL,
      note TEXT,
      actor_role VARCHAR(30) NOT NULL,
      actor_id INTEGER,
      actor_name VARCHAR(180),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS material_order_events_order_idx
    ON material_order_events (order_id, created_at ASC, id ASC)
  `);
  await pool.query(`
    INSERT INTO material_order_events
      (order_id, status, title, note, actor_role, actor_name, created_at)
    SELECT me.id, me.status,
           CASE me.status
             WHEN 'fulfilled' THEN 'Delivered'
             WHEN 'accepted' THEN 'Accepted'
             WHEN 'cancelled' THEN 'Cancelled'
             ELSE 'Order placed'
           END,
           me.status_note, 'system', 'MTBoss', COALESCE(me.created_at, NOW())
      FROM material_enquiries me
     WHERE NOT EXISTS (
       SELECT 1 FROM material_order_events event WHERE event.order_id = me.id
     )
  `);
});

export async function addMaterialOrderEvent(client, {
  orderId,
  status,
  title,
  note = null,
  actorRole,
  actorId = null,
  actorName = null,
}) {
  await client.query(
    `INSERT INTO material_order_events
      (order_id, status, title, note, actor_role, actor_id, actor_name)
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [orderId, status, title, note, actorRole, actorId, actorName]
  );
}

export function materialOrderStatusLabel(status) {
  return MATERIAL_ORDER_STATUS_LABELS[status] || status;
}
