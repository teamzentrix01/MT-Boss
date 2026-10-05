import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { requirePmAccess } from '@/lib/project-management';
import { ensureProjectManagementPhase4Schema } from '@/lib/project-management';
import { xlsxResponse, pdfHtmlResponse, inr, ddmmyyyy, tableHtml } from '@/lib/pm-export';

const MAX = 50_000;

export async function GET(req) {
  if (!await requirePmAccess(req)) return unauthorized();
  try {
    await ensureProjectManagementPhase4Schema();
    const sp = new URL(req.url).searchParams;
    const projectId = sp.get('projectId') ? Number(sp.get('projectId')) : null;
    const format = sp.get('format') || 'xlsx';

    const r = await pool.query(`
      WITH u AS(SELECT project_id,material_id,SUM(quantity) qty FROM pm_material_used WHERE NOT is_deleted GROUP BY project_id,material_id),
      a AS(SELECT project_id,material_id,SUM(quantity) qty FROM pm_material_adjustments WHERE NOT is_deleted GROUP BY project_id,material_id),
      rv AS(SELECT project_id,material_id,SUM(CASE WHEN NOT is_deleted THEN quantity ELSE 0 END) qty,SUM(CASE WHEN NOT is_deleted THEN amount ELSE 0 END) amt FROM pm_material_received GROUP BY project_id,material_id)
      SELECT p.name project_name,m.name material_name,m.unit,m.min_stock_level,
        COALESCE(rv.qty,0) received,COALESCE(u.qty,0) used,COALESCE(a.qty,0) adjusted,
        COALESCE(rv.qty,0)-COALESCE(u.qty,0)-COALESCE(a.qty,0) stock,
        CASE WHEN COALESCE(rv.qty,0)>0 THEN rv.amt/rv.qty ELSE 0 END avg_rate,
        (COALESCE(rv.qty,0)-COALESCE(u.qty,0)-COALESCE(a.qty,0))*(CASE WHEN COALESCE(rv.qty,0)>0 THEN rv.amt/rv.qty ELSE 0 END) stock_value,
        COALESCE(rv.amt,0) total_received_amount
      FROM pm_material_received base_rv
      JOIN pm_projects p ON p.id=base_rv.project_id
      JOIN pm_materials m ON m.id=base_rv.material_id
      LEFT JOIN rv ON rv.material_id=base_rv.material_id AND rv.project_id=base_rv.project_id
      LEFT JOIN u  ON u.material_id=base_rv.material_id  AND u.project_id=base_rv.project_id
      LEFT JOIN a  ON a.material_id=base_rv.material_id  AND a.project_id=base_rv.project_id
      WHERE ($1::bigint IS NULL OR base_rv.project_id=$1::bigint)
      GROUP BY p.name,m.name,m.unit,m.min_stock_level,rv.qty,u.qty,a.qty,rv.amt
      ORDER BY p.name,m.name LIMIT $2
    `, [projectId, MAX]);

    const title = `Material & Stock Report${projectId ? '' : ' (All Projects)'}`;
    const filename = `material_stock${projectId ? `_proj${projectId}` : ''}`;
    const filterStr = projectId ? `Project ID: ${projectId}` : 'All Projects';

    const cols = [
      {key:'proj',label:'Project'},{key:'mat',label:'Material'},{key:'unit',label:'Unit'},
      {key:'rcv',label:'Received',num:true},{key:'used',label:'Used',num:true},{key:'adj',label:'Adjusted',num:true},
      {key:'stock',label:'Stock',num:true},{key:'ar',label:'Avg Rate',num:true},{key:'sv',label:'Stock Value',num:true},
    ];

    if (format === 'xlsx') {
      const rows = [
        [title],[`Generated: ${ddmmyyyy(new Date())}`],[],
        cols.map(c=>c.label),
        ...r.rows.map(row=>[row.project_name,row.material_name,row.unit||'',Number(row.received),Number(row.used),Number(row.adjusted),Number(row.stock),Number(row.avg_rate),Number(row.stock_value)]),
      ];
      return xlsxResponse(rows.slice(0,MAX), filename);
    }

    const tableRows = r.rows.map(row=>({
      proj:row.project_name,mat:row.material_name,unit:row.unit||'—',
      rcv:String(Number(row.received).toFixed(3)),used:String(Number(row.used).toFixed(3)),adj:String(Number(row.adjusted).toFixed(3)),
      stock:String(Number(row.stock).toFixed(3)),ar:inr(row.avg_rate),sv:inr(row.stock_value),
    }));
    return pdfHtmlResponse(title, filterStr, `<h2>Stock Ledger</h2>${tableHtml(cols, tableRows)}`, filename);
  } catch (e) {
    return new Response(JSON.stringify({success:false,error:e.message}),{status:500,headers:{'Content-Type':'application/json'}});
  }
}
