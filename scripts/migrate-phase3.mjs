import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

import pg from 'pg';
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL;
const pool = new Pool({ connectionString });

async function runMigration() {
  console.log('--- Running Phase 3 Migration ---');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. pm_materials
    await client.query(`
      CREATE TABLE IF NOT EXISTS pm_materials (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL UNIQUE,
        unit VARCHAR(40),
        category VARCHAR(100),
        min_stock_level NUMERIC(14,3) NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✓ pm_materials table ensured');

    // 2. pm_material_received
    await client.query(`
      CREATE TABLE IF NOT EXISTS pm_material_received (
        id BIGSERIAL PRIMARY KEY,
        project_id BIGINT NOT NULL REFERENCES pm_projects(id) ON DELETE RESTRICT,
        material_id BIGINT NOT NULL REFERENCES pm_materials(id) ON DELETE RESTRICT,
        supplier_name TEXT,
        supplier_vendor_id BIGINT REFERENCES pm_vendors(id) ON DELETE SET NULL,
        vendor_supply_id BIGINT REFERENCES pm_vendor_material_supply(id) ON DELETE SET NULL,
        quantity NUMERIC(14,3) NOT NULL CHECK (quantity > 0),
        rate NUMERIC(14,2) NOT NULL CHECK (rate >= 0),
        amount NUMERIC(14,2) NOT NULL,
        received_date DATE NOT NULL,
        challan_no VARCHAR(100),
        note TEXT,
        is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
        created_by TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ,
        transfer_in BOOLEAN NOT NULL DEFAULT FALSE
      );
    `);
    console.log('✓ pm_material_received table ensured');

    // 3. pm_material_used
    await client.query(`
      CREATE TABLE IF NOT EXISTS pm_material_used (
        id BIGSERIAL PRIMARY KEY,
        project_id BIGINT NOT NULL REFERENCES pm_projects(id) ON DELETE RESTRICT,
        material_id BIGINT NOT NULL REFERENCES pm_materials(id) ON DELETE RESTRICT,
        quantity NUMERIC(14,3) NOT NULL CHECK (quantity > 0),
        used_date DATE NOT NULL,
        used_for TEXT,
        note TEXT,
        is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
        created_by TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ,
        over_used BOOLEAN NOT NULL DEFAULT FALSE
      );
    `);
    console.log('✓ pm_material_used table ensured');

    // 4. pm_material_adjustments
    await client.query(`
      CREATE TABLE IF NOT EXISTS pm_material_adjustments (
        id BIGSERIAL PRIMARY KEY,
        project_id BIGINT NOT NULL REFERENCES pm_projects(id) ON DELETE RESTRICT,
        material_id BIGINT NOT NULL REFERENCES pm_materials(id) ON DELETE RESTRICT,
        adjustment_type VARCHAR(30) NOT NULL CHECK (adjustment_type IN ('wastage','damage','return_to_supplier','transfer_out')),
        quantity NUMERIC(14,3) NOT NULL CHECK (quantity > 0),
        adjustment_date DATE NOT NULL,
        to_project_id BIGINT REFERENCES pm_projects(id) ON DELETE RESTRICT,
        note TEXT,
        is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
        created_by TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        over_used BOOLEAN NOT NULL DEFAULT FALSE
      );
    `);
    console.log('✓ pm_material_adjustments table ensured');

    // 5. pm_other_expenses
    await client.query(`
      CREATE TABLE IF NOT EXISTS pm_other_expenses (
        id BIGSERIAL PRIMARY KEY,
        project_id BIGINT NOT NULL REFERENCES pm_projects(id) ON DELETE RESTRICT,
        category VARCHAR(30) NOT NULL CHECK (category IN ('transport','machine_rent','electricity_water','permit','misc')),
        amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
        expense_date DATE NOT NULL,
        note TEXT,
        is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
        created_by TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✓ pm_other_expenses table ensured');

    // 6. Foreign key on pm_vendor_material_supply.material_id -> pm_materials(id)
    await client.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pm_vendor_material_supply_material_id_fkey') THEN
          ALTER TABLE pm_vendor_material_supply
          ADD CONSTRAINT pm_vendor_material_supply_material_id_fkey
          FOREIGN KEY (material_id) REFERENCES pm_materials(id) ON DELETE SET NULL;
        END IF;
      END $$;
    `);
    console.log('✓ pm_vendor_material_supply.material_id FK constraint ensured');

    // 7. Indexes
    const indexes = [
      `CREATE INDEX IF NOT EXISTS pm_material_received_proj_idx ON pm_material_received(project_id)`,
      `CREATE INDEX IF NOT EXISTS pm_material_received_mat_idx ON pm_material_received(material_id)`,
      `CREATE INDEX IF NOT EXISTS pm_material_received_vendor_idx ON pm_material_received(supplier_vendor_id)`,
      `CREATE INDEX IF NOT EXISTS pm_material_received_supply_idx ON pm_material_received(vendor_supply_id)`,
      `CREATE INDEX IF NOT EXISTS pm_material_received_proj_mat_date_idx ON pm_material_received(project_id, material_id, received_date)`,
      `CREATE INDEX IF NOT EXISTS pm_material_used_proj_idx ON pm_material_used(project_id)`,
      `CREATE INDEX IF NOT EXISTS pm_material_used_mat_idx ON pm_material_used(material_id)`,
      `CREATE INDEX IF NOT EXISTS pm_material_used_proj_mat_date_idx ON pm_material_used(project_id, material_id, used_date)`,
      `CREATE INDEX IF NOT EXISTS pm_material_adj_proj_idx ON pm_material_adjustments(project_id)`,
      `CREATE INDEX IF NOT EXISTS pm_material_adj_mat_idx ON pm_material_adjustments(material_id)`,
      `CREATE INDEX IF NOT EXISTS pm_material_adj_to_proj_idx ON pm_material_adjustments(to_project_id)`,
      `CREATE INDEX IF NOT EXISTS pm_material_adj_proj_mat_date_idx ON pm_material_adjustments(project_id, material_id, adjustment_date)`,
      `CREATE INDEX IF NOT EXISTS pm_other_expenses_proj_idx ON pm_other_expenses(project_id)`,
      `CREATE INDEX IF NOT EXISTS pm_other_expenses_proj_date_idx ON pm_other_expenses(project_id, expense_date)`,
    ];

    for (const idxSql of indexes) {
      await client.query(idxSql);
    }
    console.log('✓ All Phase 3 indexes ensured');

    await client.query('COMMIT');
    console.log('--- Phase 3 Migration Completed Successfully ---');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
