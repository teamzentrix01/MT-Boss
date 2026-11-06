import { CONSTRUCTION_HERO_IMAGE_URL, defaultHeroBanners } from '@/lib/hero-banner-defaults.mjs';

/** Keep static generation under Next's 60s page budget when the DB is cold or unreachable. */
const HOMEPAGE_QUERY_MS = 8000;

function isProductionBuildPhase() {
  return process.env.NEXT_PHASE === 'phase-production-build';
}

function withQueryBudget(promise, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`${label}_timeout`)), HOMEPAGE_QUERY_MS);
    }),
  ]);
}

export async function fetchHomeHeroBanners() {
  if (isProductionBuildPhase()) {
    return defaultHeroBanners;
  }

  try {
    const { default: pool } = await import('@/lib/db');
    const result = await withQueryBudget(
      pool.query(
        'SELECT * FROM hero_banners WHERE is_active = true ORDER BY sort_order ASC, id ASC'
      ),
      'hero_banners'
    );
    if (result.rows.length > 0) {
      return result.rows.map((banner) =>
        banner.service_name?.trim().toLowerCase() === 'construction'
          ? { ...banner, image_url: CONSTRUCTION_HERO_IMAGE_URL, cloudinary_public_id: '' }
          : banner
      );
    }
    return defaultHeroBanners;
  } catch {
    return defaultHeroBanners;
  }
}

export async function fetchHomeQuickServices() {
  if (isProductionBuildPhase()) {
    const { fallbackQuickServices } = await import('@/lib/public-fallbacks');
    return fallbackQuickServices;
  }

  try {
    const { default: pool } = await import('@/lib/db');
    let result;
    try {
      result = await withQueryBudget(
        pool.query(
          'SELECT * FROM quick_services ORDER BY COALESCE(sort_order, 0) ASC, id ASC'
        ),
        'quick_services'
      );
    } catch {
      result = await withQueryBudget(
        pool.query('SELECT * FROM quick_services ORDER BY id ASC'),
        'quick_services_fallback'
      );
    }
    if (result.rows.length > 0) {
      return result.rows;
    }
    const { fallbackQuickServices } = await import('@/lib/public-fallbacks');
    return fallbackQuickServices;
  } catch {
    const { fallbackQuickServices } = await import('@/lib/public-fallbacks');
    return fallbackQuickServices;
  }
}
