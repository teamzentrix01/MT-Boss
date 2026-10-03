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

    const [labRes, matRes, othRes] = await Promise.all([
      // Labour by project
      pool.query(`
        SELECT p.name project_name,'Labour' category,SUM(a.wage_amount) amount
        FROM pm_project_vendors pv JOIN pm_attendance a ON a.project_vendor_id=pv.id JOIN pm_projects p ON p.id=pv.project_id
        WHERE ($1::bigint IS NULL OR pv.project_id=$1::bigint) GROUP BY p.name ORDER BY p.name LIMIT $2
      `,[projectId,MAX]),
      // Material by project
      pool.query(`
        SELECT p.name project_name,'Material' category,
          COALESCE(SUM(s.amount),0)+COALESCE((SELECT SUM(mr.amount) FROM pm_material_received mr WHERE mr.project_id=pv.project_id AND NOT mr.is_deleted),0) amount
        FROM pm_project_vendors pv JOIN pm_vendor_material_supply s ON s.project_vendor_id=pv.id JOIN pm_projects p ON p.id=pv.project_id
        WHERE NOT s.is_deleted AND ($1::bigint IS NULL OR pv.project_id=$1::bigint) GROUP BY p.name,pv.project_id ORDER BY p.name LIMIT $2
      `,[projectId,MAX]),
      // Other expenses
      pool.query(`
        SELECT p.name project_name,oe.category,SUM(oe.amount) amount
        FROM pm_other_expenses oe JOIN pm_projects p ON p.id=oe.project_id
        WHERE NOT oe.is_deleted AND ($1::bigint IS NULL OR oe.project_id=$1::bigint) GROUP BY p.name,oe.category ORDER BY p.name,oe.category LIMIT $2
      `,[projectId,MAX]),
    ]);

    const title = `Expense Summary`;
    const filename = `expense_summary${projectId ? `_proj${projectId}` : ''}`;
    const filterStr = projectId ? `Project ID: ${projectId}` : 'All Projects';
    const cols = [{key:'proj',label:'Project'},{key:'cat',label:'Category'},{key:'amt',label:'Amount',num:true}];

    const allRows = [
      ...labRes.rows.map(r=>({proj:r.project_name,cat:'Labour',amt:r.amount})),
      ...matRes.rows.map(r=>({proj:r.project_name,cat:'Material',amt:r.amount})),
      ...othRes.rows.map(r=>({proj:r.project_name,cat:r.category,amt:r.amount})),
    ].sort((a,b)=>a.proj.localeCompare(b.proj)||a.cat.localeCompare(b.cat));

    const grandTotal = allRows.reduce((s,r)=>s+Number(r.amt),0);

    if (format === 'xlsx') {
      const rows = [
        [title],[filterStr],[`Generated: ${ddmmyyyy(new Date())}`],[],
        ['Project','Category','Amount'],
        ...allRows.map(r=>[r.proj,r.cat,Number(r.amt)]),
        ['','Grand Total',grandTotal],
      ];
      return xlsxResponse(rows.slice(0,MAX), filename);
    }

    const tableRows = allRows.map(r=>({proj:r.proj,cat:r.cat,amt:inr(r.amt)}));
    const totalsRow = {proj:'',cat:'Grand Total',amt:inr(grandTotal)};
    return pdfHtmlResponse(title, filterStr, `<h2>Expense by Project & Category</h2>${tableHtml(cols,tableRows,totalsRow)}`, filename);
  } catch (e) {
    return new Response(JSON.stringify({success:false,error:e.message}),{status:500,headers:{'Content-Type':'application/json'}});
  }
}
