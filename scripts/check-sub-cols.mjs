import pool from '../src/lib/db.js';

async function checkCols() {
  const qs = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name='quick_services'");
  console.log('quick_services cols:', qs.rows.map(r => r.column_name).join(', '));

  const sup = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name='suppliers'");
  console.log('suppliers cols:', sup.rows.map(r => r.column_name).join(', '));

  const ven = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name='vendors'");
  console.log('vendors cols:', ven.rows.map(r => r.column_name).join(', '));
  process.exit(0);
}
checkCols();
