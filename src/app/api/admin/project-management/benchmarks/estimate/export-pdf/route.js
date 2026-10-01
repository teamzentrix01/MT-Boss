import { requireRole, unauthorized } from '@/lib/auth';
import { requirePmAccess } from '@/lib/project-management';
import { ensureProjectManagementPhase5Schema } from '@/lib/project-management';
import { getEstimate } from '@/lib/pm-benchmarks';
import { pdfHtmlResponse, inr, escHtml } from '@/lib/pm-export';

export async function GET(req) {
  if (!await requirePmAccess(req)) return unauthorized();
  try {
    await ensureProjectManagementPhase5Schema();
    const sp = new URL(req.url).searchParams;
    const built_up_area = Number(sp.get('built_up_area') || 1000);
    const project_type = sp.get('project_type') || 'house';
    const quality_tier = sp.get('quality_tier') || 'standard';
    const floors = Number(sp.get('floors') || 1);
    const city = sp.get('city') || 'Moradabad';

    const est = await getEstimate({ built_up_area, project_type, quality_tier, floors, city });

    const confidenceBadge =
      est.confidence === 'high'
        ? '<span style="background:#16a34a;color:#fff;padding:2px 8px;border-radius:4px;font-weight:700;">HIGH CONFIDENCE (5+ projects)</span>'
        : est.confidence === 'medium'
        ? '<span style="background:#d97706;color:#fff;padding:2px 8px;border-radius:4px;font-weight:700;">MEDIUM CONFIDENCE (3-4 projects)</span>'
        : '<span style="background:#dc2626;color:#fff;padding:2px 8px;border-radius:4px;font-weight:700;">LOW CONFIDENCE (&lt;3 projects) — Preliminary estimate only</span>';

    const thinDataNote =
      est.sampleCount < 3
        ? `<div style="background:#fef2f2;border:1px solid #f87171;padding:8px 12px;margin:10px 0;border-radius:6px;color:#991b1b;font-size:11px;">
             <strong>⚠️ Thin Data Note:</strong> Sample count for this segment is small (${est.sampleCount} project(s)).
             Estimation used portfolio fallback segment: <em>${escHtml(est.fallbackLevel)}</em>.
           </div>`
        : '';

    const bodyHtml = `
      <div style="margin-bottom:14px;">
        <table style="width:100%;margin-bottom:12px;">
          <tr>
            <td style="font-weight:bold;width:25%;">Built-up Area:</td><td>${built_up_area.toLocaleString()} sq.ft</td>
            <td style="font-weight:bold;width:25%;">Project Type:</td><td style="text-transform:capitalize;">${escHtml(project_type)}</td>
          </tr>
          <tr>
            <td style="font-weight:bold;">Quality Tier:</td><td style="text-transform:capitalize;">${escHtml(quality_tier)}</td>
            <td style="font-weight:bold;">Floors:</td><td>${floors} floor(s)</td>
          </tr>
          <tr>
            <td style="font-weight:bold;">City:</td><td>${escHtml(city)}</td>
            <td style="font-weight:bold;">Sample Pool:</td><td>${est.sampleCount} project(s) &bull; ${confidenceBadge}</td>
          </tr>
        </table>
        ${thinDataNote}
      </div>

      <h2>Estimated Total Project Cost Range</h2>
      <div style="display:flex;gap:12px;margin:10px 0 16px;">
        <div style="flex:1;border:1px solid #cbd5e1;padding:10px;border-radius:6px;background:#f8fafc;text-align:center;">
          <div style="font-size:10px;color:#64748b;text-transform:uppercase;">Minimum Estimate</div>
          <div style="font-size:16px;font-weight:bold;color:#0f172a;margin-top:4px;">${inr(est.totalCost.min)}</div>
          <div style="font-size:10px;color:#64748b;">${inr(est.costPerSqft.min)} / sq.ft</div>
        </div>
        <div style="flex:1;border:2px solid #2563eb;padding:10px;border-radius:6px;background:#eff6ff;text-align:center;">
          <div style="font-size:10px;color:#1d4ed8;font-weight:bold;text-transform:uppercase;">Median Expected Cost</div>
          <div style="font-size:18px;font-weight:bold;color:#1e40af;margin-top:4px;">${inr(est.totalCost.median)}</div>
          <div style="font-size:11px;font-weight:bold;color:#1d4ed8;">${inr(est.costPerSqft.median)} / sq.ft</div>
        </div>
        <div style="flex:1;border:1px solid #cbd5e1;padding:10px;border-radius:6px;background:#f8fafc;text-align:center;">
          <div style="font-size:10px;color:#64748b;text-transform:uppercase;">Maximum Estimate</div>
          <div style="font-size:16px;font-weight:bold;color:#0f172a;margin-top:4px;">${inr(est.totalCost.max)}</div>
          <div style="font-size:10px;color:#64748b;">${inr(est.costPerSqft.max)} / sq.ft</div>
        </div>
      </div>

      <h2>Cost Split Breakdown (Expected Median)</h2>
      <table>
        <thead>
          <tr>
            <th>Component</th>
            <th class="num">Cost / sq.ft</th>
            <th class="num">Estimated Amount</th>
            <th class="num">% of Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Labour</td>
            <td class="num">${inr(est.split.labourPerSqft)}</td>
            <td class="num">${inr(est.split.labour)}</td>
            <td class="num">${Math.round((est.split.labour / (est.totalCost.median || 1)) * 100)}%</td>
          </tr>
          <tr>
            <td>Materials (Direct + Vendor)</td>
            <td class="num">${inr(est.split.materialPerSqft)}</td>
            <td class="num">${inr(est.split.material)}</td>
            <td class="num">${Math.round((est.split.material / (est.totalCost.median || 1)) * 100)}%</td>
          </tr>
          <tr>
            <td>Other Site Expenses & Overheads</td>
            <td class="num">${inr(est.split.otherPerSqft)}</td>
            <td class="num">${inr(est.split.other)}</td>
            <td class="num">${Math.round((est.split.other / (est.totalCost.median || 1)) * 100)}%</td>
          </tr>
          <tr class="total-row">
            <td>Total Project Estimate</td>
            <td class="num">${inr(est.costPerSqft.median)}</td>
            <td class="num">${inr(est.totalCost.median)}</td>
            <td class="num">100%</td>
          </tr>
        </tbody>
      </table>

      <h2>Estimated Major Material Quantities</h2>
      <table>
        <thead>
          <tr>
            <th>Material Item</th>
            <th class="num">Qty / sq.ft</th>
            <th class="num">Est. Total Qty</th>
            <th class="num">Avg Purchase Rate</th>
            <th class="num">Est. Material Cost</th>
          </tr>
        </thead>
        <tbody>
          ${est.materials
            .map(
              (m) => `
            <tr>
              <td style="text-transform:capitalize;">${escHtml(m.key)}</td>
              <td class="num">${m.qty_per_sqft !== null ? m.qty_per_sqft.toLocaleString() + ' ' + m.unit : '—'}</td>
              <td class="num">${m.estimated_quantity !== null ? m.estimated_quantity.toLocaleString() + ' ' + m.unit : '—'}</td>
              <td class="num">${m.avg_rate !== null ? inr(m.avg_rate) : '—'}</td>
              <td class="num">${m.estimated_cost !== null ? inr(m.estimated_cost) : '—'}</td>
            </tr>`
            )
            .join('')}
        </tbody>
      </table>

      <div style="margin-top:20px;padding:10px;background:#f8fafc;border-left:3px solid #1e40af;font-size:10px;color:#475569;">
        <strong>Notice:</strong> This estimate is generated based on historical cost benchmarks from completed projects in the MT-Boss Project Management system. Actual expenses may vary depending on architectural designs, site conditions, soil conditions, and prevailing market rates.
      </div>
    `;

    return pdfHtmlResponse(
      'Construction Cost Benchmark Estimate',
      `Area: ${built_up_area} sq.ft | Type: ${project_type} | Tier: ${quality_tier} | City: ${city}`,
      bodyHtml,
      `estimate_${project_type}_${quality_tier}_${built_up_area}sqft`
    );
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
