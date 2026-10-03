import pool from '@/lib/db';
import { ensureProjectManagementPhase5Schema } from '@/lib/project-management';

export function getFloorsBucket(floors) {
  const f = Number.parseInt(floors, 10);
  if (!Number.isFinite(f) || f <= 0) return 'all';
  if (f === 1) return '1';
  if (f === 2) return '2';
  if (f === 3 || f === 4) return '3 to 4';
  return '5 or more';
}

export function calcStats(numbers) {
  const valid = numbers.map(Number).filter((n) => Number.isFinite(n) && n >= 0);
  if (!valid.length) {
    return { count: 0, min: null, max: null, median: null, confidence: 'low' };
  }
  valid.sort((a, b) => a - b);
  const count = valid.length;
  const min = Math.round(valid[0] * 100) / 100;
  const max = Math.round(valid[count - 1] * 100) / 100;
  const mid = Math.floor(count / 2);
  const medianVal = count % 2 !== 0 ? valid[mid] : (valid[mid - 1] + valid[mid]) / 2;
  const median = Math.round(medianVal * 100) / 100;
  const confidence = count >= 5 ? 'high' : count >= 3 ? 'medium' : 'low';
  return { count, min, max, median, confidence };
}

/**
 * Recomputes pm_project_benchmarks and pm_project_material_benchmarks for a single project.
 */
export async function recomputeProjectBenchmark(projectId, client = pool) {
  await ensureProjectManagementPhase5Schema();
  const pid = Number(projectId);
  if (!Number.isInteger(pid) || pid <= 0) throw new Error('Invalid project ID');

  // 1. Fetch project header
  const projRes = await client.query(
    `SELECT id, name, status, built_up_area, project_type, floors, quality_tier, city, foundation_type,
            include_in_benchmark, progress_percent, completed_date
     FROM pm_projects WHERE id = $1`,
    [pid]
  );
  if (!projRes.rows[0]) throw new Error('Project not found');
  const project = projRes.rows[0];
  const area = Number(project.built_up_area);
  const hasArea = Number.isFinite(area) && area > 0;

  const flags = [];
  if (!hasArea) flags.push('missing_area');
  if (project.status !== 'completed' && Number(project.progress_percent) >= 90) {
    flags.push('running_project_included');
  }

  // 2. Compute cost components using single aggregated CTE
  const costRes = await client.query(
    `WITH
      labour AS (
        SELECT pv.project_id, COALESCE(SUM(a.wage_amount), 0) AS amount
        FROM pm_project_vendors pv
        JOIN pm_attendance a ON a.project_vendor_id = pv.id
        WHERE pv.project_id = $1
        GROUP BY pv.project_id
      ),
      vmat AS (
        SELECT pv.project_id, COALESCE(SUM(s.amount), 0) AS amount
        FROM pm_project_vendors pv
        JOIN pm_vendor_material_supply s ON s.project_vendor_id = pv.id
        WHERE NOT s.is_deleted AND pv.project_id = $1
        GROUP BY pv.project_id
      ),
      mrcv AS (
        SELECT project_id, COALESCE(SUM(amount), 0) AS amount
        FROM pm_material_received
        WHERE NOT is_deleted AND NOT transfer_in AND vendor_supply_id IS NULL AND project_id = $1
        GROUP BY project_id
      ),
      oth AS (
        SELECT project_id, COALESCE(SUM(amount), 0) AS amount
        FROM pm_other_expenses
        WHERE NOT is_deleted AND project_id = $1
        GROUP BY project_id
      )
    SELECT
      COALESCE(l.amount, 0) AS labour_cost,
      COALESCE(vm.amount, 0) AS vendor_material_cost,
      COALESCE(mr.amount, 0) AS direct_material_cost,
      COALESCE(oe.amount, 0) AS other_cost
    FROM (SELECT $1::bigint AS project_id) p
    LEFT JOIN labour l ON l.project_id = p.project_id
    LEFT JOIN vmat vm ON vm.project_id = p.project_id
    LEFT JOIN mrcv mr ON mr.project_id = p.project_id
    LEFT JOIN oth oe ON oe.project_id = p.project_id`,
    [pid]
  );

  const row = costRes.rows[0] || {};
  const labourCost = Number(row.labour_cost || 0);
  const vendorMatCost = Number(row.vendor_material_cost || 0);
  const directMatCost = Number(row.direct_material_cost || 0);
  const matCost = vendorMatCost + directMatCost;
  const otherCost = Number(row.other_cost || 0);
  const totalCost = labourCost + vendorMatCost + directMatCost + otherCost;

  if (totalCost === 0) flags.push('zero_total_cost');

  const costPerSqft = hasArea ? Math.round((totalCost / area) * 100) / 100 : null;
  const labourPerSqft = hasArea ? Math.round((labourCost / area) * 100) / 100 : null;
  const matPerSqft = hasArea ? Math.round((matCost / area) * 100) / 100 : null;
  const otherPerSqft = hasArea ? Math.round((otherCost / area) * 100) / 100 : null;

  // Upsert pm_project_benchmarks
  await client.query(
    `INSERT INTO pm_project_benchmarks (
      project_id, built_up_area, labour_cost, vendor_material_cost, direct_material_cost,
      other_cost, total_cost, cost_per_sqft, labour_per_sqft, material_per_sqft, other_per_sqft,
      computed_at, data_quality_flags
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), $12::jsonb)
    ON CONFLICT (project_id) DO UPDATE SET
      built_up_area = EXCLUDED.built_up_area,
      labour_cost = EXCLUDED.labour_cost,
      vendor_material_cost = EXCLUDED.vendor_material_cost,
      direct_material_cost = EXCLUDED.direct_material_cost,
      other_cost = EXCLUDED.other_cost,
      total_cost = EXCLUDED.total_cost,
      cost_per_sqft = EXCLUDED.cost_per_sqft,
      labour_per_sqft = EXCLUDED.labour_per_sqft,
      material_per_sqft = EXCLUDED.material_per_sqft,
      other_per_sqft = EXCLUDED.other_per_sqft,
      computed_at = NOW(),
      data_quality_flags = EXCLUDED.data_quality_flags`,
    [
      pid,
      hasArea ? area : null,
      labourCost,
      vendorMatCost,
      directMatCost,
      otherCost,
      totalCost,
      costPerSqft,
      labourPerSqft,
      matPerSqft,
      otherPerSqft,
      JSON.stringify(flags),
    ]
  );

  // 3. Compute material benchmarks
  // net_quantity = sum(used) + sum(wastage and damage adjustments)
  // avg_rate from pm_material_received (non-transfer_in)
  const matRes = await client.query(
    `WITH
      mat_used AS (
        SELECT material_id, COALESCE(SUM(quantity), 0) AS qty
        FROM pm_material_used
        WHERE project_id = $1 AND NOT is_deleted
        GROUP BY material_id
      ),
      mat_adj AS (
        SELECT material_id, COALESCE(SUM(quantity), 0) AS qty
        FROM pm_material_adjustments
        WHERE project_id = $1 AND NOT is_deleted AND adjustment_type IN ('wastage', 'damage')
        GROUP BY material_id
      ),
      mat_rcv AS (
        SELECT material_id,
               COALESCE(SUM(quantity), 0) AS rcv_qty,
               COALESCE(SUM(amount), 0) AS rcv_amt
        FROM pm_material_received
        WHERE project_id = $1 AND NOT is_deleted AND NOT transfer_in
        GROUP BY material_id
      )
    SELECT
      m.id AS material_id,
      m.name,
      m.unit,
      m.benchmark_key,
      COALESCE(u.qty, 0) + COALESCE(a.qty, 0) AS net_quantity,
      CASE WHEN COALESCE(r.rcv_qty, 0) > 0 THEN r.rcv_amt / r.rcv_qty ELSE 0 END AS avg_rate
    FROM pm_materials m
    LEFT JOIN mat_used u ON u.material_id = m.id
    LEFT JOIN mat_adj a ON a.material_id = m.id
    LEFT JOIN mat_rcv r ON r.material_id = m.id
    WHERE (COALESCE(u.qty, 0) + COALESCE(a.qty, 0) > 0 OR COALESCE(r.rcv_qty, 0) > 0)`,
    [pid]
  );

  // Upsert each material benchmark
  for (const m of matRes.rows) {
    const netQty = Number(m.net_quantity || 0);
    const avgRate = Number(m.avg_rate || 0);
    const qtyPerSqft = hasArea && netQty > 0 ? Math.round((netQty / area) * 10000) / 10000 : null;
    const matCostPerSqft = hasArea && netQty > 0 ? Math.round(((netQty * avgRate) / area) * 100) / 100 : null;

    await client.query(
      `INSERT INTO pm_project_material_benchmarks (
        project_id, material_id, benchmark_key, net_quantity, quantity_per_sqft, avg_rate, cost_per_sqft, computed_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      ON CONFLICT (project_id, material_id) DO UPDATE SET
        benchmark_key = EXCLUDED.benchmark_key,
        net_quantity = EXCLUDED.net_quantity,
        quantity_per_sqft = EXCLUDED.quantity_per_sqft,
        avg_rate = EXCLUDED.avg_rate,
        cost_per_sqft = EXCLUDED.cost_per_sqft,
        computed_at = NOW()`,
      [pid, m.material_id, m.benchmark_key || null, netQty, qtyPerSqft, avgRate, matCostPerSqft]
    );
  }

  return { projectId: pid, totalCost, costPerSqft, flags };
}

/**
 * Recomputes all project benchmarks and updates rate summaries across segments.
 */
export async function recomputeAllRateSummaries(client = pool) {
  await ensureProjectManagementPhase5Schema();

  // 1. Recompute all projects with include_in_benchmark = true or completed
  const eligibleProjects = await client.query(
    `SELECT id FROM pm_projects WHERE include_in_benchmark = true OR status = 'completed'`
  );
  for (const row of eligibleProjects.rows) {
    await recomputeProjectBenchmark(row.id, client);
  }

  // 2. Fetch all qualified projects for summary
  // Rule: include_in_benchmark = true AND (status = 'completed' OR progress_percent >= 90)
  // Must have built_up_area > 0 and cost_per_sqft > 0
  const sampleRes = await client.query(`
    SELECT
      p.id, p.name, p.project_type, p.floors, p.quality_tier, p.city, p.foundation_type,
      p.status, p.progress_percent,
      pb.built_up_area, pb.total_cost, pb.cost_per_sqft, pb.labour_per_sqft,
      pb.material_per_sqft, pb.other_per_sqft, pb.data_quality_flags
    FROM pm_projects p
    JOIN pm_project_benchmarks pb ON pb.project_id = p.id
    WHERE p.include_in_benchmark = true
      AND (p.status = 'completed' OR p.progress_percent >= 90)
      AND pb.built_up_area > 0
      AND pb.cost_per_sqft > 0
  `);

  const samples = sampleRes.rows.map((row) => ({
    ...row,
    floorsBucket: getFloorsBucket(row.floors),
    cost_per_sqft: Number(row.cost_per_sqft),
    labour_per_sqft: Number(row.labour_per_sqft),
    material_per_sqft: Number(row.material_per_sqft),
    other_per_sqft: Number(row.other_per_sqft),
    built_up_area: Number(row.built_up_area),
  }));

  // Outlier detection across overall portfolio:
  // Median cost_per_sqft
  const allCosts = samples.map((s) => s.cost_per_sqft);
  const overallCostStats = calcStats(allCosts);
  if (overallCostStats.median) {
    const med = overallCostStats.median;
    for (const s of samples) {
      const isOutlier = s.cost_per_sqft > 2 * med || s.cost_per_sqft < 0.5 * med;
      const flags = Array.isArray(s.data_quality_flags) ? [...s.data_quality_flags] : [];
      const hasOutlier = flags.includes('outlier_cost');
      if (isOutlier && !hasOutlier) {
        flags.push('outlier_cost');
        await client.query(
          `UPDATE pm_project_benchmarks SET data_quality_flags = $1::jsonb WHERE project_id = $2`,
          [JSON.stringify(flags), s.id]
        );
      } else if (!isOutlier && hasOutlier) {
        const cleaned = flags.filter((f) => f !== 'outlier_cost');
        await client.query(
          `UPDATE pm_project_benchmarks SET data_quality_flags = $1::jsonb WHERE project_id = $2`,
          [JSON.stringify(cleaned), s.id]
        );
      }
    }
  }

  // 3. Fetch material benchmarks for qualified projects
  const matSamplesRes = await client.query(`
    SELECT
      pmb.project_id, pmb.benchmark_key, pmb.quantity_per_sqft, pmb.avg_rate, pmb.cost_per_sqft,
      p.project_type, p.quality_tier, p.floors, p.city
    FROM pm_project_material_benchmarks pmb
    JOIN pm_projects p ON p.id = pmb.project_id
    WHERE p.include_in_benchmark = true
      AND (p.status = 'completed' OR p.progress_percent >= 90)
      AND pmb.benchmark_key IS NOT NULL
      AND pmb.quantity_per_sqft > 0
  `);

  const matSamples = matSamplesRes.rows.map((r) => ({
    ...r,
    floorsBucket: getFloorsBucket(r.floors),
    quantity_per_sqft: Number(r.quantity_per_sqft),
    avg_rate: Number(r.avg_rate),
    cost_per_sqft: Number(r.cost_per_sqft),
  }));

  // 4. Generate all segment combinations:
  // Exact: (type, quality, floors_bucket, city)
  // Broader: (type, quality, floors_bucket), (type, quality), (type), (overall)
  const segmentMap = new Map();

  function addSampleToSegment(segKey, meta, sample) {
    if (!segmentMap.has(segKey)) {
      segmentMap.set(segKey, {
        segment_key: segKey,
        meta,
        cost_per_sqft: [],
        labour_per_sqft: [],
        material_per_sqft: [],
        other_per_sqft: [],
        materials: {}, // benchmark_key -> { qty: [], rate: [] }
      });
    }
    const seg = segmentMap.get(segKey);
    seg.cost_per_sqft.push(sample.cost_per_sqft);
    seg.labour_per_sqft.push(sample.labour_per_sqft);
    seg.material_per_sqft.push(sample.material_per_sqft);
    seg.other_per_sqft.push(sample.other_per_sqft);
  }

  function addMatToSegment(segKey, mat) {
    if (!segmentMap.has(segKey)) return;
    const seg = segmentMap.get(segKey);
    const k = mat.benchmark_key;
    if (!seg.materials[k]) seg.materials[k] = { qty: [], rate: [] };
    if (mat.quantity_per_sqft > 0) seg.materials[k].qty.push(mat.quantity_per_sqft);
    if (mat.avg_rate > 0) seg.materials[k].rate.push(mat.avg_rate);
  }

  // Populate segments
  for (const s of samples) {
    const type = s.project_type || 'all';
    const quality = s.quality_tier || 'all';
    const fb = s.floorsBucket || 'all';
    const city = s.city || 'all';

    const keys = [
      { key: `${type}__${quality}__${fb}__${city}`, meta: { type, quality, fb, city } },
      { key: `${type}__${quality}__${fb}__all`, meta: { type, quality, fb, city: null } },
      { key: `${type}__${quality}__all__all`, meta: { type, quality, fb: null, city: null } },
      { key: `${type}__all__all__all`, meta: { type, quality: null, fb: null, city: null } },
      { key: `all__all__all__all`, meta: { type: null, quality: null, fb: null, city: null } },
    ];

    for (const k of keys) {
      addSampleToSegment(k.key, k.meta, s);
    }
  }

  for (const m of matSamples) {
    const type = m.project_type || 'all';
    const quality = m.quality_tier || 'all';
    const fb = m.floorsBucket || 'all';
    const city = m.city || 'all';

    const keys = [
      `${type}__${quality}__${fb}__${city}`,
      `${type}__${quality}__${fb}__all`,
      `${type}__${quality}__all__all`,
      `${type}__all__all__all`,
      `all__all__all__all`,
    ];
    for (const k of keys) {
      addMatToSegment(k, m);
    }
  }

  // Clear existing pm_rate_summary
  await client.query(`TRUNCATE TABLE pm_rate_summary`);

  // Insert computed summaries
  const insertStmt = `
    INSERT INTO pm_rate_summary (
      segment_key, project_type, quality_tier, floors_bucket, city, metric,
      median, min, max, sample_count, confidence, computed_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
  `;

  for (const [segKey, data] of segmentMap.entries()) {
    const metrics = [
      { name: 'cost_per_sqft', list: data.cost_per_sqft },
      { name: 'labour_per_sqft', list: data.labour_per_sqft },
      { name: 'material_per_sqft', list: data.material_per_sqft },
      { name: 'other_per_sqft', list: data.other_per_sqft },
    ];

    for (const m of metrics) {
      const stats = calcStats(m.list);
      await client.query(insertStmt, [
        segKey,
        data.meta.type,
        data.meta.quality,
        data.meta.fb,
        data.meta.city,
        m.name,
        stats.median,
        stats.min,
        stats.max,
        stats.count,
        stats.confidence,
      ]);
    }

    // Material metrics: qty_<key>, rate_<key>
    for (const [matKey, mdata] of Object.entries(data.materials)) {
      const qStats = calcStats(mdata.qty);
      if (qStats.count > 0) {
        await client.query(insertStmt, [
          segKey,
          data.meta.type,
          data.meta.quality,
          data.meta.fb,
          data.meta.city,
          `qty_${matKey}`,
          qStats.median,
          qStats.min,
          qStats.max,
          qStats.count,
          qStats.confidence,
        ]);
      }
      const rStats = calcStats(mdata.rate);
      if (rStats.count > 0) {
        await client.query(insertStmt, [
          segKey,
          data.meta.type,
          data.meta.quality,
          data.meta.fb,
          data.meta.city,
          `rate_${matKey}`,
          rStats.median,
          rStats.min,
          rStats.max,
          rStats.count,
          rStats.confidence,
        ]);
      }
    }
  }

  return { totalSegments: segmentMap.size, sampleCount: samples.length };
}

/**
 * Estimation query engine with segment fallback:
 * exact (type, quality, floors, city) -> drop city -> drop floors -> drop quality -> overall portfolio
 */
export async function getEstimate({ built_up_area, project_type, quality_tier, floors, city }) {
  await ensureProjectManagementPhase5Schema();
  const area = Number(built_up_area);
  if (!Number.isFinite(area) || area <= 0) {
    throw new Error('Valid built_up_area greater than 0 is required');
  }

  const type = project_type || 'all';
  const quality = quality_tier || 'all';
  const fb = getFloorsBucket(floors);
  const c = city || 'all';

  const lookupHierarchy = [
    { key: `${type}__${quality}__${fb}__${c}`, level: 'exact' },
    { key: `${type}__${quality}__${fb}__all`, level: 'broad_no_city' },
    { key: `${type}__${quality}__all__all`, level: 'broad_no_floors' },
    { key: `${type}__all__all__all`, level: 'broad_type_only' },
    { key: `all__all__all__all`, level: 'portfolio_overall' },
  ];

  let resolvedSegment = null;
  let fallbackLevel = 'portfolio_overall';
  let rows = [];

  for (const step of lookupHierarchy) {
    const res = await pool.query(
      `SELECT metric, median, min, max, sample_count, confidence FROM pm_rate_summary WHERE segment_key = $1`,
      [step.key]
    );
    if (res.rows.length > 0) {
      const costRow = res.rows.find((r) => r.metric === 'cost_per_sqft');
      if (costRow && Number(costRow.sample_count) > 0) {
        resolvedSegment = step.key;
        fallbackLevel = step.level;
        rows = res.rows;
        // If sample_count >= 3 we accept this segment, otherwise continue to see if broader has more data
        if (Number(costRow.sample_count) >= 3 || step.level === 'portfolio_overall') {
          break;
        }
      }
    }
  }

  const metricsMap = Object.fromEntries(rows.map((r) => [r.metric, r]));
  const cost = metricsMap.cost_per_sqft || { median: 1800, min: 1400, max: 2400, sample_count: 0, confidence: 'low' };
  const labour = metricsMap.labour_per_sqft || { median: 400, min: 300, max: 550 };
  const mat = metricsMap.material_per_sqft || { median: 1200, min: 950, max: 1600 };
  const other = metricsMap.other_per_sqft || { median: 200, min: 100, max: 300 };

  // Calculate estimated totals
  const totalMin = Math.round(Number(cost.min || cost.median * 0.8) * area);
  const totalMedian = Math.round(Number(cost.median) * area);
  const totalMax = Math.round(Number(cost.max || cost.median * 1.25) * area);

  const labourEstimated = Math.round(Number(labour.median || 0) * area);
  const matEstimated = Math.round(Number(mat.median || 0) * area);
  const otherEstimated = Math.round(Number(other.median || 0) * area);

  // Material list estimates
  const benchmarkMaterials = ['steel', 'cement', 'bricks', 'sand', 'aggregate'];
  const materialUnits = {
    steel: 'kg',
    cement: 'bags',
    bricks: 'pcs',
    sand: 'cft',
    aggregate: 'cft',
  };

  const materialsList = benchmarkMaterials.map((key) => {
    const qRow = metricsMap[`qty_${key}`];
    const rRow = metricsMap[`rate_${key}`];
    const qtyPerSqft = qRow ? Number(qRow.median) : null;
    const avgRate = rRow ? Number(rRow.median) : null;
    const estQty = qtyPerSqft ? Math.round(qtyPerSqft * area) : null;
    const estCost = estQty && avgRate ? Math.round(estQty * avgRate) : null;

    return {
      key,
      unit: materialUnits[key] || 'unit',
      qty_per_sqft: qtyPerSqft,
      avg_rate: avgRate,
      estimated_quantity: estQty,
      estimated_cost: estCost,
      sample_count: qRow?.sample_count || 0,
    };
  });

  return {
    inputs: { built_up_area: area, project_type: type, quality_tier: quality, floors, city: c },
    resolvedSegment,
    fallbackLevel,
    sampleCount: Number(cost.sample_count || 0),
    confidence: cost.confidence || 'low',
    costPerSqft: {
      min: Number(cost.min || 0),
      median: Number(cost.median || 0),
      max: Number(cost.max || 0),
    },
    totalCost: {
      min: totalMin,
      median: totalMedian,
      max: totalMax,
    },
    split: {
      labour: labourEstimated,
      material: matEstimated,
      other: otherEstimated,
      labourPerSqft: Number(labour.median || 0),
      materialPerSqft: Number(mat.median || 0),
      otherPerSqft: Number(other.median || 0),
    },
    materials: materialsList,
  };
}
