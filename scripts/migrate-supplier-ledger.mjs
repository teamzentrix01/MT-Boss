import pool from '../src/lib/db.js';

async function run() {
  console.log('Running minimal migration for Supplier Ledger...');

  // 1. Add supplier_id to pm_material_received if missing
  await pool.query(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pm_material_received' AND column_name = 'supplier_id'
      ) THEN
        ALTER TABLE pm_material_received ADD COLUMN supplier_id BIGINT REFERENCES suppliers(id) ON DELETE SET NULL;
        RAISE NOTICE 'Added supplier_id to pm_material_received';
      ELSE
        RAISE NOTICE 'supplier_id already exists on pm_material_received';
      END IF;
    END $$;
  `);

  // 2. Create pm_supplier_payments table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pm_supplier_payments (
      id BIGSERIAL PRIMARY KEY,
      project_id BIGINT NOT NULL REFERENCES pm_projects(id) ON DELETE RESTRICT,
      supplier_id BIGINT NULL REFERENCES suppliers(id) ON DELETE SET NULL,
      supplier_name TEXT NOT NULL,
      amount NUMERIC(14,2) NOT NULL CHECK(amount > 0),
      payment_date DATE NOT NULL,
      mode VARCHAR(50),
      transaction_reference TEXT,
      note TEXT,
      is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
      created_by TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ
    );
  `);
  console.log('pm_supplier_payments table ready.');

  // 3. Create indexes
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_pm_supplier_payments_proj 
    ON pm_supplier_payments(project_id, payment_date DESC) 
    WHERE NOT is_deleted;
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_pm_supplier_payments_supplier
    ON pm_supplier_payments(supplier_id)
    WHERE NOT is_deleted;
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_pm_material_received_supplier
    ON pm_material_received(supplier_id)
    WHERE NOT is_deleted;
  `);

  console.log('Indexes created successfully.');

  // Verify
  const cols = await pool.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'pm_supplier_payments'
    ORDER BY ordinal_position;
  `);
  console.log('pm_supplier_payments columns:', cols.rows.map(c => `${c.column_name}: ${c.data_type}`));

  const mrCols = await pool.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'pm_material_received' AND column_name = 'supplier_id';
  `);
  console.log('pm_material_received supplier_id column:', mrCols.rows);

  console.log('Migration completed successfully.');
  process.exit(0);
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
