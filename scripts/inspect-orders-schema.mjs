import pool from '../src/lib/db.js';

async function inspectColumns() {
  try {
    const mat = await pool.query(
      "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name='material_enquiries' ORDER BY ordinal_position"
    );
    console.log('--- material_enquiries ---');
    console.table(mat.rows);

    const srv = await pool.query(
      "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name='service_bookings' ORDER BY ordinal_position"
    );
    console.log('--- service_bookings ---');
    console.table(srv.rows);

    const users = await pool.query(
      "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name='users' ORDER BY ordinal_position"
    );
    console.log('--- users ---');
    console.table(users.rows);

    // Also check sample rows
    const matSample = await pool.query("SELECT * FROM material_enquiries LIMIT 3");
    console.log('--- material_enquiries sample row ---', matSample.rows[0]);

    const srvSample = await pool.query("SELECT * FROM service_bookings LIMIT 3");
    console.log('--- service_bookings sample row ---', srvSample.rows[0]);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

inspectColumns();
