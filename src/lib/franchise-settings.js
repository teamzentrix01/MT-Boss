import pool from './db';
import { createInitializationGuard } from './api-utils';

export const DEFAULT_FRANCHISE_MODELS = [
  {
    id: 1,
    name: 'Associate Partner',
    investment: 'Details after consultation',
    returns: 'Revenue model shared on call',
    area: 'Single City',
    support: 'Basic',
    color: 'border-blue-500',
    badge: 'bg-blue-500',
    popular: false,
    registration_fee: Number(process.env.FRANCHISE_ASSOCIATE_REGISTRATION_FEE || 499999),
    features: [
      'Project referral rights',
      'Brand usage license',
      'Sales training provided',
      'Marketing materials',
      'Dedicated relationship manager',
    ],
    sort_order: 1,
    is_active: true,
  },
  {
    id: 2,
    name: 'Regional Franchise',
    investment: 'Custom proposal after review',
    returns: 'Revenue model shared on call',
    area: 'Multiple Districts',
    support: 'Premium',
    color: 'border-[var(--brand-blue)]',
    badge: 'bg-[var(--brand-blue)]',
    popular: true,
    registration_fee: Number(process.env.FRANCHISE_REGIONAL_REGISTRATION_FEE || 799999),
    features: [
      'Exclusive territory rights',
      'Full brand partnership',
      'On-site technical support',
      'Lead generation support',
      'Revenue sharing model',
      'Priority project allocation',
      'Joint marketing campaigns',
    ],
    sort_order: 2,
    is_active: true,
  },
  {
    id: 3,
    name: 'Master Franchise',
    investment: 'Tailored state-level proposal',
    returns: 'Revenue model shared on call',
    area: 'Entire State',
    support: 'Elite',
    color: 'border-purple-500',
    badge: 'bg-purple-500',
    popular: false,
    registration_fee: Number(process.env.FRANCHISE_MASTER_REGISTRATION_FEE || 4799999),
    features: [
      'State-level exclusivity',
      'Sub-franchise rights',
      'Board-level representation',
      'Dedicated project pipeline',
      'Co-branding opportunities',
      'Annual profit sharing',
      'Infrastructure support',
      'Direct CEO access',
    ],
    sort_order: 3,
    is_active: true,
  },
];

export const DEFAULT_PAGE_SETTINGS = {
  hero: {
    tagline: 'MTBOSS Construction',
    title: 'Franchise',
    highlightTitle: 'Opportunity',
    subtitle: "Partner with India's trusted construction brand. Build a profitable business with MTBOSS's proven model, technical expertise, and 20+ years of legacy.",
    backgroundImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80',
    stats: [
      { value: '50+', label: 'Cities' },
      { value: '20+', label: 'Years Legacy' },
      { value: '500+', label: 'Projects Done' },
      { value: '3', label: 'Franchise Models' },
    ],
  },
  benefits: [
    { icon: '🏆', title: 'Established Brand', desc: "20+ years of trust and recognition across India's construction industry." },
    { icon: '📈', title: 'Structured Revenue Model', desc: 'Franchise commercials, revenue share, and territory economics are discussed after profile review.' },
    { icon: '🤝', title: 'End-to-End Support', desc: 'From training to project execution — we support you at every step.' },
    { icon: '🌍', title: 'Pan India Network', desc: 'Join a network of 50+ cities and 500+ skilled professionals.' },
    { icon: '🔧', title: 'Technical Expertise', desc: "Access to MTBOSS's engineering and procurement capabilities." },
    { icon: '📣', title: 'Marketing Support', desc: 'Co-branded campaigns, digital marketing, and lead generation support.' },
    { icon: '⚡', title: 'Fast Onboarding', desc: 'Get operational in 30 days with our streamlined onboarding process.' },
    { icon: '💰', title: 'Multiple Revenue Streams', desc: 'Earn from referrals, project execution, and sub-franchise fees.' },
  ],
  process: [
    { step: '01', title: 'Submit Application', desc: 'Fill the franchise inquiry form with your details and preferred model.' },
    { step: '02', title: 'Initial Review', desc: 'Our franchise team reviews your application within 3-5 business days.' },
    { step: '03', title: 'Discovery Call', desc: 'One-on-one call with our Franchise Head to discuss opportunities.' },
    { step: '04', title: 'Site Visit', desc: 'Visit our headquarters and meet the leadership team in person.' },
    { step: '05', title: 'Agreement Signing', desc: 'Finalize territory, investment, and sign the franchise agreement.' },
    { step: '06', title: 'Launch', desc: 'Complete onboarding, training, and officially launch your franchise.' },
  ],
};

let contentCache = { data: null, expiresAt: 0 };
const CACHE_TTL_MS = 60 * 1000; // 1 minute in-memory cache

export const ensureFranchiseSettingsSchema = createInitializationGuard(async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Create franchise_models table
    await client.query(`
      CREATE TABLE IF NOT EXISTS franchise_models (
        id SERIAL PRIMARY KEY,
        name VARCHAR(120) NOT NULL UNIQUE,
        slug VARCHAR(120),
        investment TEXT NOT NULL DEFAULT 'Details after consultation',
        returns TEXT NOT NULL DEFAULT 'Revenue model shared on call',
        area TEXT NOT NULL DEFAULT 'Single City',
        support TEXT NOT NULL DEFAULT 'Basic',
        color TEXT DEFAULT 'border-blue-500',
        badge TEXT DEFAULT 'bg-blue-500',
        popular BOOLEAN NOT NULL DEFAULT FALSE,
        registration_fee NUMERIC(12,2) NOT NULL DEFAULT 499999,
        features JSONB NOT NULL DEFAULT '[]'::jsonb,
        sort_order INT NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 2. Create franchise_page_settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS franchise_page_settings (
        key VARCHAR(80) PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 3. Seed default models if table is empty
    const countModels = await client.query('SELECT COUNT(*)::INT AS total FROM franchise_models');
    if ((countModels.rows[0]?.total || 0) === 0) {
      for (const m of DEFAULT_FRANCHISE_MODELS) {
        await client.query(
          `INSERT INTO franchise_models
             (name, investment, returns, area, support, color, badge, popular, registration_fee, features, sort_order, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, $11, $12)
           ON CONFLICT (name) DO NOTHING`,
          [
            m.name,
            m.investment,
            m.returns,
            m.area,
            m.support,
            m.color,
            m.badge,
            m.popular,
            m.registration_fee,
            JSON.stringify(m.features),
            m.sort_order,
            m.is_active,
          ]
        );
      }
    }

    // 4. Seed default page settings if empty
    for (const [key, val] of Object.entries(DEFAULT_PAGE_SETTINGS)) {
      await client.query(
        `INSERT INTO franchise_page_settings (key, data, updated_at)
         VALUES ($1, $2::jsonb, NOW())
         ON CONFLICT (key) DO NOTHING`,
        [key, JSON.stringify(val)]
      );
    }

    await client.query('COMMIT');
  } catch (err) {
    try { await client.query('ROLLBACK'); } catch {}
    console.error('ensureFranchiseSettingsSchema error:', err.message);
    throw err;
  } finally {
    client.release();
  }
});

export function invalidateFranchiseContentCache() {
  contentCache = { data: null, expiresAt: 0 };
}

export async function getFranchiseModels({ activeOnly = true } = {}) {
  await ensureFranchiseSettingsSchema();
  const where = activeOnly ? 'WHERE is_active = TRUE' : '';
  const result = await pool.query(
    `SELECT id, name, slug, investment, returns, area, support, color, badge,
            popular, registration_fee, features, sort_order, is_active, updated_at
       FROM franchise_models
       ${where}
       ORDER BY sort_order ASC, id ASC`
  );
  return result.rows.map(row => ({
    ...row,
    registration_fee: Number(row.registration_fee || 0),
    features: Array.isArray(row.features) ? row.features : (typeof row.features === 'string' ? JSON.parse(row.features) : []),
  }));
}

export async function getFranchisePageSettings() {
  await ensureFranchiseSettingsSchema();
  const result = await pool.query(`SELECT key, data FROM franchise_page_settings`);
  const settings = { ...DEFAULT_PAGE_SETTINGS };
  for (const row of result.rows) {
    settings[row.key] = row.data;
  }
  return settings;
}

export async function getFranchisePublicContent() {
  if (contentCache.data && contentCache.expiresAt > Date.now()) {
    return contentCache.data;
  }

  try {
    const [models, settings] = await Promise.all([
      getFranchiseModels({ activeOnly: true }),
      getFranchisePageSettings(),
    ]);

    const payload = {
      models: models.length ? models : DEFAULT_FRANCHISE_MODELS,
      hero: settings.hero || DEFAULT_PAGE_SETTINGS.hero,
      benefits: settings.benefits || DEFAULT_PAGE_SETTINGS.benefits,
      process: settings.process || DEFAULT_PAGE_SETTINGS.process,
    };

    contentCache = {
      data: payload,
      expiresAt: Date.now() + CACHE_TTL_MS,
    };

    return payload;
  } catch (err) {
    console.warn('getFranchisePublicContent fallback error:', err.message);
    return {
      models: DEFAULT_FRANCHISE_MODELS,
      hero: DEFAULT_PAGE_SETTINGS.hero,
      benefits: DEFAULT_PAGE_SETTINGS.benefits,
      process: DEFAULT_PAGE_SETTINGS.process,
    };
  }
}

