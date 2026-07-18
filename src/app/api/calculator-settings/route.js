import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireRole, unauthorized } from '@/lib/auth';

const DEFAULT_SETTINGS = {
  cityRates: {
    Moradabad: { labour: 310, transport: 18, multiplier: 0.94 },
    Noida: { labour: 380, transport: 24, multiplier: 1.08 },
    Delhi: { labour: 410, transport: 28, multiplier: 1.14 },
    Gurgaon: { labour: 430, transport: 30, multiplier: 1.18 },
    Ghaziabad: { labour: 360, transport: 22, multiplier: 1.02 },
    Lucknow: { labour: 340, transport: 20, multiplier: 0.98 },
    Agra: { labour: 330, transport: 19, multiplier: 0.96 },
    Mumbai: { labour: 520, transport: 42, multiplier: 1.35 },
  },
  qualityLevels: {
    Basic: { costMultiplier: 0.92, labourMultiplier: 0.9, finishMultiplier: 0.82 },
    Standard: { costMultiplier: 1, labourMultiplier: 1, finishMultiplier: 1 },
    Premium: { costMultiplier: 1.16, labourMultiplier: 1.14, finishMultiplier: 1.28 },
    Luxury: { costMultiplier: 1.34, labourMultiplier: 1.28, finishMultiplier: 1.65 },
  },
  foundationTypes: {
    Normal: { materialMultiplier: 1, labourMultiplier: 1 },
    Raft: { materialMultiplier: 1.14, labourMultiplier: 1.08 },
    Basement: { materialMultiplier: 1.32, labourMultiplier: 1.22 },
    Pile: { materialMultiplier: 1.28, labourMultiplier: 1.18 },
  },
  materialFactors: {
    Steel: 3.8,
    Cement: 0.42,
    Bricks: 8.2,
    Sand: 1.35,
    Aggregate: 0.9,
    Plumbing: 0.012,
    Wiring: 0.018,
    Putty: 0.08,
    Paints: 0.035,
    Window: 0.012,
    Door: 0.01,
  },
};

let readyPromise;

function hasAuth(req) {
  return Boolean(requireRole(req, 'admin'));
}

function mergeSettings(saved = {}) {
  return {
    cityRates: {
      ...DEFAULT_SETTINGS.cityRates,
      ...(saved.cityRates || {}),
    },
    qualityLevels: Object.fromEntries(
      Object.entries(DEFAULT_SETTINGS.qualityLevels).map(([key, value]) => [
        key,
        { ...value, ...(saved.qualityLevels?.[key] || {}) },
      ])
    ),
    foundationTypes: Object.fromEntries(
      Object.entries(DEFAULT_SETTINGS.foundationTypes).map(([key, value]) => [
        key,
        { ...value, ...(saved.foundationTypes?.[key] || {}) },
      ])
    ),
    materialFactors: {
      ...DEFAULT_SETTINGS.materialFactors,
      ...(saved.materialFactors || {}),
    },
  };
}

function cleanNumber(value, fallback) {
  const next = Number(value);
  return Number.isFinite(next) && next >= 0 ? next : fallback;
}

function sanitizeSettings(input = {}) {
  const merged = mergeSettings(input);

  return {
    cityRates: Object.fromEntries(
      Object.entries(merged.cityRates).map(([city, value]) => {
        const fallback = DEFAULT_SETTINGS.cityRates[city] || { labour: 0, transport: 0, multiplier: 1 };
        return [
          city,
          {
            labour: cleanNumber(value.labour, fallback.labour),
            transport: cleanNumber(value.transport, fallback.transport),
            multiplier: cleanNumber(value.multiplier, fallback.multiplier),
          },
        ];
      })
    ),
    qualityLevels: Object.fromEntries(
      Object.entries(merged.qualityLevels).map(([key, value]) => {
        const fallback = DEFAULT_SETTINGS.qualityLevels[key];
        return [
          key,
          {
            costMultiplier: cleanNumber(value.costMultiplier, fallback.costMultiplier),
            labourMultiplier: cleanNumber(value.labourMultiplier, fallback.labourMultiplier),
            finishMultiplier: cleanNumber(value.finishMultiplier, fallback.finishMultiplier),
          },
        ];
      })
    ),
    foundationTypes: Object.fromEntries(
      Object.entries(merged.foundationTypes).map(([key, value]) => {
        const fallback = DEFAULT_SETTINGS.foundationTypes[key];
        return [
          key,
          {
            materialMultiplier: cleanNumber(value.materialMultiplier, fallback.materialMultiplier),
            labourMultiplier: cleanNumber(value.labourMultiplier, fallback.labourMultiplier),
          },
        ];
      })
    ),
    materialFactors: Object.fromEntries(
      Object.entries(merged.materialFactors).map(([key, value]) => [
        key,
        cleanNumber(value, DEFAULT_SETTINGS.materialFactors[key] || 0),
      ])
    ),
  };
}

async function initializeTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS calculator_settings (
      id INTEGER PRIMARY KEY DEFAULT 1,
      settings JSONB NOT NULL DEFAULT '{}',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      CONSTRAINT calculator_settings_single_row CHECK (id = 1)
    )
  `);

  await pool.query(
    `INSERT INTO calculator_settings (id, settings, created_at, updated_at)
     VALUES (1, $1, NOW(), NOW())
     ON CONFLICT (id) DO NOTHING`,
    [JSON.stringify(DEFAULT_SETTINGS)]
  );
}

function ensureTable() {
  if (!readyPromise) {
    readyPromise = initializeTable().catch((error) => {
      readyPromise = undefined;
      throw error;
    });
  }
  return readyPromise;
}

export async function GET() {
  try {
    await ensureTable();
    const result = await pool.query('SELECT settings FROM calculator_settings WHERE id=1 LIMIT 1');
    const settings = mergeSettings(result.rows[0]?.settings || {});
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('GET calculator-settings error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await ensureTable();
    if (!hasAuth(req)) return unauthorized();

    const body = await req.json();
    const settings = sanitizeSettings(body.settings || body);
    const result = await pool.query(
      `UPDATE calculator_settings
       SET settings=$1, updated_at=NOW()
       WHERE id=1
       RETURNING settings`,
      [JSON.stringify(settings)]
    );

    return NextResponse.json({ success: true, data: mergeSettings(result.rows[0].settings) });
  } catch (error) {
    console.error('PUT calculator-settings error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
