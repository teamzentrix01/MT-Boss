import pool from '@/lib/db';

export async function ensurePayUIntentSchema(client = pool) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS payu_payment_intents (
      id BIGSERIAL PRIMARY KEY,
      txnid TEXT NOT NULL UNIQUE,
      purpose TEXT NOT NULL,
      entity_id INTEGER NOT NULL,
      package_id TEXT,
      amount NUMERIC(12,2) NOT NULL,
      status TEXT NOT NULL DEFAULT 'PENDING',
      gateway_id TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      completed_at TIMESTAMPTZ
    )
  `);
}

export function newPayUTxnId(prefix = 'MTB') {
  return `${prefix}${Date.now()}${Math.random().toString(36).slice(2, 8)}`.slice(0, 50);
}

export async function createPayUIntent({ txnid, purpose, entityId, packageId = null, amount }) {
  await ensurePayUIntentSchema();
  await pool.query(
    `INSERT INTO payu_payment_intents (txnid, purpose, entity_id, package_id, amount)
     VALUES ($1, $2, $3, $4, $5)`,
    [txnid, purpose, entityId, packageId, amount]
  );
}

export function getPayUCallbackUrl(req) {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
  return `${configured || new URL(req.url).origin}/api/payu/callback`;
}
