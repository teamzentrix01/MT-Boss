import pool from '../src/lib/db.js';

async function check() {
  try {
    const res = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name"
    );
    console.log('Tables:\n', res.rows.map(r => r.table_name).join('\n'));

    const pmAudit = res.rows.find(r => r.table_name === 'pm_audit_log');
    if (pmAudit) {
      const cols = await pool.query(
        "SELECT column_name, data_type FROM information_schema.columns WHERE table_name='pm_audit_log'"
      );
      console.log('\npm_audit_log columns:\n', cols.rows);
    } else {
      console.log('\npm_audit_log does NOT exist');
    }

    const matEvents = res.rows.find(r => r.table_name === 'material_order_events');
    if (matEvents) {
      const cols = await pool.query(
        "SELECT column_name, data_type FROM information_schema.columns WHERE table_name='material_order_events'"
      );
      console.log('\nmaterial_order_events columns:\n', cols.rows);
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

check();
