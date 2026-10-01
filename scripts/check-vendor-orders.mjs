import pool from '../src/lib/db.js';

async function checkVendorOrders() {
  const voCols = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='vendor_orders'");
  console.log('vendor_orders cols:', voCols.rows);
  const count = await pool.query("SELECT count(*) FROM vendor_orders");
  console.log('vendor_orders count:', count.rows[0]);
  process.exit(0);
}
checkVendorOrders();
