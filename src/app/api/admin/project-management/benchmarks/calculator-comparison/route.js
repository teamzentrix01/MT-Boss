import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { ensureProjectManagementPhase5Schema } from '@/lib/project-management';

// Default hardcoded / base calculator values for comparison
const CALCULATOR_DEFAULTS = [
  { metric_key: 'labour_rate', label: 'Labour Base Rate (/sq.ft)', unit: '₹/sq.ft', quality_tier: 'all', default_value: 310 },
  { metric_key: 'qty_steel', label: 'Steel Quantity (/sq.ft)', unit: 'kg/sq.ft', quality_tier: 'all', default_value: 3.8 },
  { metric_key: 'rate_steel', label: 'Steel Unit Rate', unit: '₹/kg', quality_tier: 'all', default_value: 66 },
  { metric_key: 'qty_cement', label: 'Cement Quantity (/sq.ft)', unit: 'bags/sq.ft', quality_tier: 'all', default_value: 0.42 },
  { metric_key: 'rate_cement', label: 'Cement Unit Rate', unit: '₹/bag', quality_tier: 'all', default_value: 410 },
  { metric_key: 'qty_bricks', label: 'Bricks Quantity (/sq.ft)', unit: 'pcs/sq.ft', quality_tier: 'all', default_value: 8.2 },
  { metric_key: 'rate_bricks', label: 'Bricks Unit Rate', unit: '₹/pc', quality_tier: 'all', default_value: 10 },
  { metric_key: 'qty_sand', label: 'Sand Quantity (/sq.ft)', unit: 'cft/sq.ft', quality_tier: 'all', default_value: 1.35 },
  { metric_key: 'rate_sand', label: 'Sand Unit Rate', unit: '₹/cft', quality_tier: 'all', default_value: 48 },
  { metric_key: 'qty_aggregate', label: 'Aggregate Quantity (/sq.ft)', unit: 'cft/sq.ft', quality_tier: 'all', default_value: 0.9 },
  { metric_key: 'rate_aggregate', label: 'Aggregate Unit Rate', unit: '₹/cft', quality_tier: 'all', default_value: 46 },
  { metric_key: 'cost_basic', label: 'Basic Package Total Cost (/sq.ft)', unit: '₹/sq.ft', quality_tier: 'basic', default_value: 1550 },
  { metric_key: 'cost_standard', label: 'Standard Package Total Cost (/sq.ft)', unit: '₹/sq.ft', quality_tier: 'standard', default_value: 1750 },
  { metric_key: 'cost_premium', label: 'Premium Package Total Cost (/sq.ft)', unit: '₹/sq.ft', quality_tier: 'premium', default_value: 2050 },
  { metric_key: 'cost_luxury', label: 'Luxury Package Total Cost (/sq.ft)', unit: '₹/sq.ft', quality_tier: 'luxury', default_value: 2450 },
];

export async function GET(req) {
  if (!requireRole(req, 'admin')) return unauthorized();
  try {
    await ensureProjectManagementPhase5Schema();

    // 1. Fetch benchmark rate summary for overall portfolio
    const summaryRes = await pool.query(
      `SELECT metric, quality_tier, median, sample_count, confidence
       FROM pm_rate_summary
       WHERE segment_key = 'all__all__all__all'
          OR segment_key LIKE 'all__%__all__all'`
    );
    const summaryMap = new Map();
    for (const r of summaryRes.rows) {
      const k = `${r.metric}_${r.quality_tier || 'all'}`;
      summaryMap.set(k, r);
      if (!summaryMap.has(r.metric)) summaryMap.set(r.metric, r);
    }

    // 2. Fetch active overrides
    const overridesRes = await pool.query(
      `SELECT id, metric_key, quality_tier, old_value, new_value, applied_by, applied_at, note
       FROM pm_calculator_rate_overrides
       WHERE reverted_at IS NULL`
    );
    const overrideMap = new Map();
    for (const o of overridesRes.rows) {
      overrideMap.set(`${o.metric_key}_${o.quality_tier || 'all'}`, o);
    }

    // 3. Build comparison rows
    const comparison = CALCULATOR_DEFAULTS.map((def) => {
      let benchmarkRow = null;
      if (def.metric_key === 'labour_rate') {
        benchmarkRow = summaryMap.get('labour_per_sqft');
      } else if (def.metric_key.startsWith('cost_')) {
        benchmarkRow = summaryMap.get(`cost_per_sqft_${def.quality_tier}`) || summaryMap.get('cost_per_sqft');
      } else {
        benchmarkRow = summaryMap.get(def.metric_key);
      }

      const activeOverride = overrideMap.get(`${def.metric_key}_${def.quality_tier}`);
      const benchmarkMedian = benchmarkRow ? Number(benchmarkRow.median) : null;
      const sampleCount = benchmarkRow ? Number(benchmarkRow.sample_count) : 0;
      const confidence = benchmarkRow ? benchmarkRow.confidence : 'low';

      const currentVal = activeOverride ? Number(activeOverride.new_value) : def.default_value;
      const diffPercent =
        benchmarkMedian !== null && def.default_value > 0
          ? Math.round(((benchmarkMedian - def.default_value) / def.default_value) * 1000) / 10
          : null;

      return {
        metric_key: def.metric_key,
        label: def.label,
        unit: def.unit,
        quality_tier: def.quality_tier,
        calculator_default: def.default_value,
        active_override: activeOverride || null,
        current_effective: currentVal,
        benchmark_median: benchmarkMedian,
        diff_percent: diffPercent,
        sample_count: sampleCount,
        confidence,
      };
    });

    // 4. Check feature flag status
    const settingRes = await pool.query(
      `SELECT value FROM pm_settings WHERE key = 'use_real_rates' LIMIT 1`
    );
    const useRealRates = settingRes.rows[0]?.value === 'true';

    return NextResponse.json({
      success: true,
      useRealRates,
      data: comparison,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
