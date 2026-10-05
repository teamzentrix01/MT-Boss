/**
 * Bridge between PM Benchmarks and the Budget Calculator.
 * Safe, minimal helper that guarantees 100% byte-for-byte backward compatibility
 * whenever use_real_rates is false or unconfigured.
 */

/**
 * Returns the effective rate for a given metric and quality tier.
 * Only returns the override value if useRealRates is true AND an active override exists.
 * Otherwise unconditionally returns defaultValue.
 */
export function getEffectiveRate(metricKey, qualityTier, defaultValue, { useRealRates = false, overrides = [] } = {}) {
  if (!useRealRates || !Array.isArray(overrides) || overrides.length === 0) {
    return defaultValue;
  }

  const key = String(metricKey).toLowerCase();
  const tier = String(qualityTier || '').toLowerCase();

  // Look for exact tier match first, then wildcard ('all' or empty)
  const match =
    overrides.find(
      (o) => !o.reverted_at && String(o.metric_key).toLowerCase() === key && String(o.quality_tier || '').toLowerCase() === tier
    ) ||
    overrides.find(
      (o) => !o.reverted_at && String(o.metric_key).toLowerCase() === key && (!o.quality_tier || String(o.quality_tier).toLowerCase() === 'all')
    );

  if (match && match.new_value !== undefined && match.new_value !== null) {
    const val = Number(match.new_value);
    return Number.isFinite(val) ? val : defaultValue;
  }

  return defaultValue;
}

/**
 * Server-side helper to load active overrides and the feature flag status.
 */
export async function loadActiveCalculatorOverrides(pool) {
  try {
    const settingsRes = await pool.query(
      `SELECT value FROM pm_settings WHERE key = 'use_real_rates' LIMIT 1`
    );
    const useRealRates = settingsRes.rows[0]?.value === 'true';

    if (!useRealRates) {
      return { useRealRates: false, overrides: [] };
    }

    const overridesRes = await pool.query(
      `SELECT id, metric_key, quality_tier, old_value, new_value, applied_by, applied_at, note
       FROM pm_calculator_rate_overrides
       WHERE reverted_at IS NULL
       ORDER BY applied_at DESC`
    );

    return {
      useRealRates: true,
      overrides: overridesRes.rows.map((r) => ({
        ...r,
        old_value: Number(r.old_value),
        new_value: Number(r.new_value),
      })),
    };
  } catch {
    return { useRealRates: false, overrides: [] };
  }
}
