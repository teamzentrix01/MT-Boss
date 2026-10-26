import pool from '../src/lib/db.js';

async function inspect() {
  const tables = await pool.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND (table_name LIKE '%supplier%' OR table_name LIKE '%vendor%' OR table_name LIKE '%payment%' OR table_name LIKE '%material%' OR table_name LIKE 'pm_%')
    ORDER BY table_name;
  `);
  console.log('Relevant tables:');
  for (const r of tables.rows) {
    console.log(' - ' + r.table_name);
  }

  // Inspect columns of pm_material_received, suppliers, pm_vendor_payments, etc.
  for (const t of ['suppliers', 'pm_material_received', 'pm_vendor_payments', 'pm_project_vendors', 'pm_vendor_material_supply', 'project_payments', 'pm_materials']) {
    const cols = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = $1
      ORDER BY ordinal_position;
    `, [t]);
    console.log(`\nColumns for ${t}:`);
    for (const c of cols.rows) {
      console.log(`  ${c.column_name}: ${c.data_type} (nullable: ${c.is_nullable})`);
    }
  }

  process.exit(0);
}

inspect().catch(e => { console.error(e); process.exit(1); });
