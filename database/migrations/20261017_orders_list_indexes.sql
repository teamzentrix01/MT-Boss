-- Speed admin orders-history + bookings list sorts by created_at
CREATE INDEX IF NOT EXISTS idx_material_enquiries_created_at
  ON material_enquiries (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_material_enquiries_status_created
  ON material_enquiries (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_service_bookings_created_at
  ON service_bookings (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_service_bookings_status_created
  ON service_bookings (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_material_order_events_order_id
  ON material_order_events (order_id, created_at ASC);
