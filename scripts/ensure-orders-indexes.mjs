import pool from '../src/lib/db.js';

async function setupIndexes() {
  try {
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_material_enquiries_user_id ON material_enquiries(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_material_enquiries_status ON material_enquiries(status)',
      'CREATE INDEX IF NOT EXISTS idx_material_enquiries_created_at ON material_enquiries(created_at DESC)',
      'CREATE INDEX IF NOT EXISTS idx_material_enquiries_delivery_date ON material_enquiries(delivery_date)',
      'CREATE INDEX IF NOT EXISTS idx_material_enquiries_supplier ON material_enquiries(accepted_by_supplier_id)',
      'CREATE INDEX IF NOT EXISTS idx_material_enquiries_city ON material_enquiries(selected_city)',
      'CREATE INDEX IF NOT EXISTS idx_service_bookings_user_id ON service_bookings(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_service_bookings_status ON service_bookings(status)',
      'CREATE INDEX IF NOT EXISTS idx_service_bookings_created_at ON service_bookings(created_at DESC)',
      'CREATE INDEX IF NOT EXISTS idx_material_order_events_order_id ON material_order_events(order_id)'
    ];

    for (const sql of indexes) {
      await pool.query(sql);
      console.log('Executed:', sql);
    }
    console.log('All indexes ensured successfully!');
  } catch (err) {
    console.error('Error setting up indexes:', err);
  } finally {
    process.exit(0);
  }
}

setupIndexes();
