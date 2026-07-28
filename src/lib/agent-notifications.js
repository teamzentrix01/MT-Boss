import pool from '@/lib/db';
import { createInitializationGuard } from '@/lib/api-utils';

export const ensureAgentNotificationsSchema = createInitializationGuard(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS agent_notifications (
      id BIGSERIAL PRIMARY KEY,
      agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
      type VARCHAR(60) NOT NULL,
      title VARCHAR(180) NOT NULL,
      message TEXT NOT NULL,
      entity_type VARCHAR(60),
      entity_id INTEGER,
      metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
      dedupe_key VARCHAR(180),
      is_read BOOLEAN NOT NULL DEFAULT FALSE,
      read_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS agent_notifications_agent_created_idx
    ON agent_notifications (agent_id, created_at DESC)
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS agent_notifications_agent_unread_idx
    ON agent_notifications (agent_id, is_read)
    WHERE is_read = FALSE
  `);
  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS agent_notifications_dedupe_uidx
    ON agent_notifications (agent_id, dedupe_key)
    WHERE dedupe_key IS NOT NULL
  `);

  await pool.query(`
    CREATE OR REPLACE FUNCTION record_agent_activity()
    RETURNS TRIGGER AS $$
    DECLARE
      target_agent_id INTEGER;
      lead_label TEXT;
      project_label TEXT;
    BEGIN
      IF TG_TABLE_NAME = 'agents' THEN
        IF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status THEN
          INSERT INTO agent_notifications (
            agent_id, type, title, message, entity_type, entity_id, dedupe_key, metadata
          ) VALUES (
            NEW.id,
            'account_status',
            CASE
              WHEN NEW.status = 'Approved' THEN 'Account approved'
              ELSE 'Account status updated'
            END,
            CASE
              WHEN NEW.status = 'Approved' THEN 'Your agent account has been approved and activated.'
              ELSE 'Your agent account status changed from ' || COALESCE(OLD.status, 'Unknown') || ' to ' || COALESCE(NEW.status, 'Unknown') || '.'
            END,
            'agent',
            NEW.id,
            CASE WHEN NEW.status = 'Approved' THEN 'account-approved-' || COALESCE(NEW.auth_version, 0)::TEXT ELSE NULL END,
            jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status)
          )
          ON CONFLICT (agent_id, dedupe_key) WHERE dedupe_key IS NOT NULL DO NOTHING;
        ELSIF TG_OP = 'UPDATE'
          AND NEW.auth_version IS DISTINCT FROM OLD.auth_version
          AND NEW.status = 'Approved' THEN
          INSERT INTO agent_notifications (
            agent_id, type, title, message, entity_type, entity_id, metadata
          ) VALUES (
            NEW.id,
            'account_security',
            'Account security updated',
            'Your agent login credentials or password security settings were updated.',
            'agent',
            NEW.id,
            jsonb_build_object('auth_version', NEW.auth_version)
          );
        END IF;
        RETURN NEW;
      END IF;

      IF TG_TABLE_NAME = 'agent_leads' THEN
        lead_label := COALESCE(NULLIF(NEW.client_name, ''), 'Lead #' || NEW.id::TEXT);

        IF TG_OP = 'INSERT' AND NEW.agent_id IS NOT NULL THEN
          INSERT INTO agent_notifications (
            agent_id, type, title, message, entity_type, entity_id, metadata
          ) VALUES (
            NEW.agent_id,
            'lead_assigned',
            'New lead assigned',
            lead_label || ' has been assigned to you.',
            'lead',
            NEW.id,
            jsonb_build_object('client_name', NEW.client_name, 'status', NEW.status, 'stage', NEW.lead_stage)
          );
        ELSIF TG_OP = 'UPDATE' AND NEW.agent_id IS DISTINCT FROM OLD.agent_id THEN
          IF OLD.agent_id IS NOT NULL THEN
            INSERT INTO agent_notifications (
              agent_id, type, title, message, entity_type, entity_id, metadata
            ) VALUES (
              OLD.agent_id,
              'lead_reassigned',
              'Lead reassigned',
              lead_label || ' is no longer assigned to you.',
              'lead',
              NEW.id,
              jsonb_build_object('previous_agent_id', OLD.agent_id, 'new_agent_id', NEW.agent_id)
            );
          END IF;
          IF NEW.agent_id IS NOT NULL THEN
            INSERT INTO agent_notifications (
              agent_id, type, title, message, entity_type, entity_id, metadata
            ) VALUES (
              NEW.agent_id,
              'lead_assigned',
              'New lead assigned',
              lead_label || ' has been assigned to you.',
              'lead',
              NEW.id,
              jsonb_build_object('previous_agent_id', OLD.agent_id, 'status', NEW.status, 'stage', NEW.lead_stage)
            );
          END IF;
        END IF;

        target_agent_id := NEW.agent_id;
        IF TG_OP = 'UPDATE' AND target_agent_id IS NOT NULL AND NEW.status IS DISTINCT FROM OLD.status THEN
          INSERT INTO agent_notifications (
            agent_id, type, title, message, entity_type, entity_id, metadata
          ) VALUES (
            target_agent_id,
            'lead_status',
            'Lead status changed',
            lead_label || ' changed from ' || COALESCE(OLD.status, 'Unknown') || ' to ' || COALESCE(NEW.status, 'Unknown') || '.',
            'lead',
            NEW.id,
            jsonb_build_object('client_name', NEW.client_name, 'old_status', OLD.status, 'new_status', NEW.status)
          );
        END IF;
        IF TG_OP = 'UPDATE' AND target_agent_id IS NOT NULL AND NEW.lead_stage IS DISTINCT FROM OLD.lead_stage THEN
          INSERT INTO agent_notifications (
            agent_id, type, title, message, entity_type, entity_id, metadata
          ) VALUES (
            target_agent_id,
            'lead_stage',
            'Lead stage changed',
            lead_label || ' moved from ' || COALESCE(OLD.lead_stage, 'Unknown') || ' to ' || COALESCE(NEW.lead_stage, 'Unknown') || '.',
            'lead',
            NEW.id,
            jsonb_build_object('client_name', NEW.client_name, 'old_stage', OLD.lead_stage, 'new_stage', NEW.lead_stage)
          );
        END IF;
        RETURN NEW;
      END IF;

      IF TG_TABLE_NAME = 'projects' THEN
        project_label := COALESCE(NULLIF(NEW.client_name, ''), 'Project #' || NEW.id::TEXT);

        IF TG_OP = 'INSERT' AND NEW.assigned_agent_id IS NOT NULL THEN
          INSERT INTO agent_notifications (
            agent_id, type, title, message, entity_type, entity_id, metadata
          ) VALUES (
            NEW.assigned_agent_id,
            'project_assigned',
            'New project assigned',
            project_label || ' has been assigned to you.',
            'project',
            NEW.id,
            jsonb_build_object('client_name', NEW.client_name, 'status', NEW.project_status)
          );
        ELSIF TG_OP = 'UPDATE' AND NEW.assigned_agent_id IS DISTINCT FROM OLD.assigned_agent_id THEN
          IF OLD.assigned_agent_id IS NOT NULL THEN
            INSERT INTO agent_notifications (
              agent_id, type, title, message, entity_type, entity_id, metadata
            ) VALUES (
              OLD.assigned_agent_id,
              'project_reassigned',
              'Project reassigned',
              project_label || ' is no longer assigned to you.',
              'project',
              NEW.id,
              jsonb_build_object('previous_agent_id', OLD.assigned_agent_id, 'new_agent_id', NEW.assigned_agent_id)
            );
          END IF;
          IF NEW.assigned_agent_id IS NOT NULL THEN
            INSERT INTO agent_notifications (
              agent_id, type, title, message, entity_type, entity_id, metadata
            ) VALUES (
              NEW.assigned_agent_id,
              'project_assigned',
              'New project assigned',
              project_label || ' has been assigned to you.',
              'project',
              NEW.id,
              jsonb_build_object('previous_agent_id', OLD.assigned_agent_id, 'status', NEW.project_status)
            );
          END IF;
        END IF;

        target_agent_id := NEW.assigned_agent_id;
        IF TG_OP = 'UPDATE' AND target_agent_id IS NOT NULL AND NEW.project_status IS DISTINCT FROM OLD.project_status THEN
          INSERT INTO agent_notifications (
            agent_id, type, title, message, entity_type, entity_id, metadata
          ) VALUES (
            target_agent_id,
            'project_status',
            'Project status changed',
            project_label || ' changed from ' || COALESCE(OLD.project_status, 'Unknown') || ' to ' || COALESCE(NEW.project_status, 'Unknown') || '.',
            'project',
            NEW.id,
            jsonb_build_object('client_name', NEW.client_name, 'old_status', OLD.project_status, 'new_status', NEW.project_status)
          );
        END IF;
        RETURN NEW;
      END IF;

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql
  `);

  await pool.query(`
    DROP TRIGGER IF EXISTS agents_activity_trigger ON agents;
    CREATE TRIGGER agents_activity_trigger
    AFTER UPDATE ON agents
    FOR EACH ROW EXECUTE FUNCTION record_agent_activity()
  `);
  await pool.query(`
    DROP TRIGGER IF EXISTS agent_leads_activity_trigger ON agent_leads;
    CREATE TRIGGER agent_leads_activity_trigger
    AFTER INSERT OR UPDATE ON agent_leads
    FOR EACH ROW EXECUTE FUNCTION record_agent_activity()
  `);

  const projectsTable = await pool.query(`SELECT to_regclass('public.projects') AS table_name`);
  if (projectsTable.rows[0]?.table_name) {
    await pool.query(`
      DROP TRIGGER IF EXISTS projects_activity_trigger ON projects;
      CREATE TRIGGER projects_activity_trigger
      AFTER INSERT OR UPDATE ON projects
      FOR EACH ROW EXECUTE FUNCTION record_agent_activity()
    `);
  }
});
