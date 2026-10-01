import pool from '../src/lib/db.js';

async function checkAuditRows() {
  const rows = await pool.query('SELECT * FROM pm_audit_log ORDER BY id DESC LIMIT 5');
  console.log('pm_audit_log rows:', rows.rows);
  process.exit(0);
}
checkAuditRows();
