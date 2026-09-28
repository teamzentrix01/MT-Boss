import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { ensureProjectManagementPhase4Schema } from '@/lib/project-management';
import { xlsxResponse, pdfHtmlResponse, inr, ddmmyyyy, tableHtml } from '@/lib/pm-export';

const MAX = 50_000;

export async function GET(req) {
  if (!requireRole(req, 'admin')) return unauthorized();
  try {
    await ensureProjectManagementPhase4Schema();
    const sp = new URL(req.url).searchParams;
    const projectId = sp.get('projectId') ? Number(sp.get('projectId')) : null;
    const format = sp.get('format') || 'xlsx';

    const r = await pool.query(`
      WITH att_agg AS(SELECT project_vendor_id,SUM(wage_amount) wage FROM pm_attendance GROUP BY project_vendor_id),
      vpay_agg AS(SELECT project_vendor_id,SUM(amount) paid FROM pm_vendor_payments WHERE NOT is_deleted GROUP BY project_vendor_id)
      SELECT p.name project_name,v.name vendor_name,pv.pay_type,pv.status pv_status,
        CASE WHEN pv.pay_type='daily_wage' THEN COALESCE(a.wage,0) ELSE pv.contract_amount END earned,
        COALESCE(vp.paid,0) paid,
        CASE WHEN pv.pay_type='daily_wage' THEN COALESCE(a.wage,0) ELSE pv.contract_amount END - COALESCE(vp.paid,0) balance
      FROM pm_project_vendors pv
      JOIN pm_vendors v ON v.id=pv.vendor_id JOIN pm_projects p ON p.id=pv.project_id
      LEFT JOIN att_agg  a  ON a.project_vendor_id=pv.id
      LEFT JOIN vpay_agg vp ON vp.project_vendor_id=pv.id
      WHERE ($1::bigint IS NULL OR pv.project_id=$1::bigint)
      ORDER BY p.name,v.name LIMIT $2
    `, [projectId, MAX]);

    const title = `Vendor Balance Summary`;
    const filename = `vendor_balance${projectId ? `_proj${projectId}` : ''}`;
    const filterStr = projectId ? `Project ID: ${projectId}` : 'All Projects';

    const cols = [
      {key:'proj',label:'Project'},{key:'vendor',label:'Vendor'},{key:'pt',label:'Pay Type'},{key:'st',label:'Status'},
      {key:'earned',label:'Earned',num:true},{key:'paid',label:'Paid',num:true},{key:'balance',label:'Balance',num:true},
    ];

    if (format === 'xlsx') {
      const rows = [
        [title],[filterStr],[`Generated: ${ddmmyyyy(new Date())}`],[],
        cols.map(c=>c.label),
        ...r.rows.map(row=>[row.project_name,row.vendor_name,row.pay_type,row.pv_status,Number(row.earned),Number(row.paid),Number(row.balance)]),
        ['','','','Totals',
          r.rows.reduce((s,row)=>s+Number(row.earned),0),
          r.rows.reduce((s,row)=>s+Number(row.paid),0),
          r.rows.reduce((s,row)=>s+Number(row.balance),0),
        ],
      ];
      return xlsxResponse(rows.slice(0,MAX), filename);
    }

    const tableRows = r.rows.map(row=>({proj:row.project_name,vendor:row.vendor_name,pt:row.pay_type,st:row.pv_status,earned:inr(row.earned),paid:inr(row.paid),balance:inr(row.balance)}));
    const totalsRow = {proj:'',vendor:'',pt:'',st:'Total',earned:inr(r.rows.reduce((s,row)=>s+Number(row.earned),0)),paid:inr(r.rows.reduce((s,row)=>s+Number(row.paid),0)),balance:inr(r.rows.reduce((s,row)=>s+Number(row.balance),0))};
    return pdfHtmlResponse(title, filterStr, `<h2>Vendor Balance</h2>${tableHtml(cols, tableRows, totalsRow)}`, filename);
  } catch (e) {
    return new Response(JSON.stringify({success:false,error:e.message}),{status:500,headers:{'Content-Type':'application/json'}});
  }
}
