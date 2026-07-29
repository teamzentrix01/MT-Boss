import pool from '@/lib/db';
import { createInitializationGuard } from '@/lib/api-utils';

export const CAREER_APPLICATION_STATUSES = [
  'New',
  'Under Review',
  'Shortlisted',
  'Interview Scheduled',
  'Selected',
  'Rejected',
  'Withdrawn',
];

export const ensureCareerTrackingSchema = createInitializationGuard(async () => {
  await pool.query(`
    ALTER TABLE career_enquiries
      ADD COLUMN IF NOT EXISTS user_id INTEGER,
      ADD COLUMN IF NOT EXISTS application_reference VARCHAR(40),
      ADD COLUMN IF NOT EXISTS status_note TEXT,
      ADD COLUMN IF NOT EXISTS interview_at TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW()
  `);
  await pool.query(`
    UPDATE career_enquiries
       SET application_reference = 'JA-' || TO_CHAR(COALESCE(created_at, NOW()), 'YYYYMMDD') || '-' || LPAD(id::TEXT, 6, '0')
     WHERE application_reference IS NULL OR TRIM(application_reference) = ''
  `);
  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS career_enquiries_reference_uidx
    ON career_enquiries (application_reference)
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS career_enquiries_user_idx
    ON career_enquiries (user_id, created_at DESC)
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS career_application_events (
      id BIGSERIAL PRIMARY KEY,
      application_id INTEGER NOT NULL REFERENCES career_enquiries(id) ON DELETE CASCADE,
      status VARCHAR(50) NOT NULL,
      title VARCHAR(160) NOT NULL,
      note TEXT,
      actor_role VARCHAR(30) NOT NULL,
      actor_id INTEGER,
      actor_name VARCHAR(180),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS career_application_events_application_idx
    ON career_application_events (application_id, created_at ASC, id ASC)
  `);
  await pool.query(`
    INSERT INTO career_application_events
      (application_id, status, title, note, actor_role, actor_name, created_at)
    SELECT application.id, application.status, 'Application submitted',
           application.status_note, 'system', 'MTBoss HR', COALESCE(application.created_at, NOW())
      FROM career_enquiries application
     WHERE NOT EXISTS (
       SELECT 1 FROM career_application_events event
        WHERE event.application_id = application.id
     )
  `);
});

export async function addCareerApplicationEvent(client, {
  applicationId,
  status,
  title,
  note = null,
  actorRole,
  actorId = null,
  actorName = null,
}) {
  await client.query(
    `INSERT INTO career_application_events
      (application_id, status, title, note, actor_role, actor_id, actor_name)
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [applicationId, status, title, note, actorRole, actorId, actorName]
  );
}
