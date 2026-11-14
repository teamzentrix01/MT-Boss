import pool from '@/lib/db';

let schemaPromise = null;

export async function ensureFranchiseStaffSchema() {
  if (schemaPromise) return schemaPromise;

  schemaPromise = (async () => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS franchise_staff (
        id BIGSERIAL PRIMARY KEY,
        franchise_id INTEGER NOT NULL REFERENCES franchises(id) ON DELETE CASCADE,
        name VARCHAR(200) NOT NULL,
        phone VARCHAR(30),
        email VARCHAR(150),
        role VARCHAR(100) NOT NULL DEFAULT 'Site Supervisor',
        department VARCHAR(100) DEFAULT 'Operations',
        joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
        relieving_date DATE,
        status VARCHAR(30) NOT NULL DEFAULT 'working' CHECK (status IN ('working', 'resigned', 'terminated', 'on_leave', 'inactive')),
        assigned_project_or_site VARCHAR(255),
        notes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ
      );

      CREATE INDEX IF NOT EXISTS franchise_staff_franchise_idx ON franchise_staff(franchise_id);
      CREATE INDEX IF NOT EXISTS franchise_staff_status_idx ON franchise_staff(franchise_id, status);
      CREATE INDEX IF NOT EXISTS franchise_staff_role_idx ON franchise_staff(franchise_id, role);

      ALTER TABLE franchise_staff ADD COLUMN IF NOT EXISTS staff_code VARCHAR(50);
      UPDATE franchise_staff SET staff_code = 'FS-' || LPAD(id::text, 4, '0') WHERE staff_code IS NULL;
      CREATE INDEX IF NOT EXISTS franchise_staff_code_idx ON franchise_staff(franchise_id, staff_code);
    `);
  })().catch((err) => {
    schemaPromise = null;
    throw err;
  });

  return schemaPromise;
}

export const COMMON_STAFF_ROLES = [
  'Site Supervisor',
  'Site Engineer',
  'Project Manager',
  'Store Keeper / Incharge',
  'Accountant',
  'HR',
  'Quality Surveyor',
  'Safety Officer',
  'Driver / Logistics',
  'Field Officer',
  'Designer',
  'Cleaning Staff',
  'Office Staff',
  'Forman',
  'Other',
];

export const STAFF_STATUS_OPTIONS = [
  { value: 'working', label: 'Currently Working', color: 'green' },
  { value: 'on_leave', label: 'On Leave', color: 'amber' },
  { value: 'resigned', label: 'Resigned / Left', color: 'gray' },
  { value: 'terminated', label: 'Terminated', color: 'red' },
  { value: 'inactive', label: 'Inactive', color: 'gray' },
];

