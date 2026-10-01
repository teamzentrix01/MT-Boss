import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { requirePmAccess } from '@/lib/project-management';
import { ensureProjectManagementPhase4Schema } from '@/lib/project-management';
import { xlsxResponse, pdfHtmlResponse, inr, ddmmyyyy, tableHtml, escHtml } from '@/lib/pm-export';

const MAX = 50_000;

export async function GET(req) {
  if (!await requirePmAccess(req)) return unauthorized();
  try {
    await ensureProjectManagementPhase4Schema();
    const sp = new URL(req.url).searchParams;
    const pvId = Number(sp.get('projectVendorId'));
    const format = sp.get('format') || 'xlsx';
    if (!Number.isInteger(pvId) || pvId <= 0) return new Response('projectVendorId required', { status: 400 });

    const [pvRes, attRes, vpayRes, vsupRes] = await Promise.all([
      pool.query(`
        SELECT pv.*,v.name vendor_name,v.phone vendor_phone,v.trade,p.name project_name
        FROM pm_project_vendors pv JOIN pm_vendors v ON v.id=pv.vendor_id JOIN pm_projects p ON p.id=pv.project_id
        WHERE pv.id=$1
      `, [pvId]),

      // Attendance by month
      pool.query(`
        SELECT to_char(attendance_date,'YYYY-MM') AS month,
          SUM(CASE WHEN status!='absent' THEN workers_count ELSE 0 END) AS days_present,
          SUM(CASE WHEN status='absent' THEN workers_count ELSE 0 END) AS days_absent,
          SUM(wage_amount) AS wage
        FROM pm_attendance WHERE project_vendor_id=$1
        GROUP BY 1 ORDER BY 1 LIMIT $2
      `, [pvId, MAX]),

      // Payments
      pool.query(`SELECT payment_date,amount,payment_type,mode,note,transaction_reference FROM pm_vendor_payments WHERE project_vendor_id=$1 AND NOT is_deleted ORDER BY payment_date DESC LIMIT $2`,[pvId,MAX]),

      // Material supply
      pool.query(`SELECT supply_date,item_name,quantity,unit,rate,amount,note FROM pm_vendor_material_supply WHERE project_vendor_id=$1 AND NOT is_deleted ORDER BY supply_date DESC LIMIT $2`,[pvId,MAX]),
    ]);

    if (!pvRes.rows[0]) return new Response('Project vendor not found', { status: 404 });
    const pv = pvRes.rows[0];
    const earned = pv.pay_type === 'daily_wage'
      ? attRes.rows.reduce((s,r) => s + Number(r.wage), 0)
      : Number(pv.contract_amount || 0);
    const paid = vpayRes.rows.reduce((s,r) => s + Number(r.amount), 0);
    const title = `Vendor Statement — ${pv.vendor_name}`;
    const filename = `vendor_statement_pv${pvId}`;
    const filterStr = `Vendor: ${pv.vendor_name} | Project: ${pv.project_name} | Pay Type: ${pv.pay_type}`;

    if (format === 'xlsx') {
      const rows = [
        [title],[`Vendor: ${pv.vendor_name} | Phone: ${pv.vendor_phone||''} | Trade: ${pv.trade||''}`],
        [`Project: ${pv.project_name} | Pay Type: ${pv.pay_type}`],[`Earned: ${earned} | Paid: ${paid} | Balance: ${earned-paid}`],[],
        ['Attendance Summary (by Month)'],['Month','Present Days','Absent Days','Wage'],
        ...attRes.rows.map(r=>[r.month,Number(r.days_present),Number(r.days_absent),Number(r.wage)]),
        [],['Payments'],['Date','Amount','Type','Mode','Note','Transaction Ref'],
        ...vpayRes.rows.map(r=>[ddmmyyyy(r.payment_date),Number(r.amount),r.payment_type,r.mode||'',r.note||'',r.transaction_reference||'']),
        [],['Material Supplied'],['Date','Item','Qty','Unit','Rate','Amount','Note'],
        ...vsupRes.rows.map(r=>[ddmmyyyy(r.supply_date),r.item_name,Number(r.quantity),r.unit||'',Number(r.rate),Number(r.amount),r.note||'']),
      ];
      return xlsxResponse(rows.slice(0,MAX), filename);
    }

    const html = `
<p><b>Vendor:</b> ${escHtml(pv.vendor_name)} &nbsp;<b>Phone:</b> ${escHtml(pv.vendor_phone||'—')} &nbsp;<b>Trade:</b> ${escHtml(pv.trade||'—')}</p>
<p><b>Project:</b> ${escHtml(pv.project_name)} &nbsp;<b>Pay Type:</b> ${escHtml(pv.pay_type)} &nbsp;<b>Status:</b> ${escHtml(pv.status)}</p>
<table style="margin:10px 0"><tr><td style="padding:4px 10px"><b>Earned</b><br>${inr(earned)}</td><td style="padding:4px 10px"><b>Paid</b><br>${inr(paid)}</td><td style="padding:4px 10px;color:${earned-paid>=0?'#166534':'#991b1b'}"><b>Balance</b><br>${inr(earned-paid)}</td></tr></table>
<h2>Attendance Summary</h2>${tableHtml([{key:'m',label:'Month'},{key:'p',label:'Present',num:true},{key:'a',label:'Absent',num:true},{key:'w',label:'Wage',num:true}],attRes.rows.map(r=>({m:r.month,p:String(Number(r.days_present).toFixed(1)),a:String(Number(r.days_absent).toFixed(1)),w:inr(r.wage)})))}
<h2>Payments</h2>${tableHtml([{key:'d',label:'Date'},{key:'a',label:'Amount',num:true},{key:'t',label:'Type'},{key:'m',label:'Mode'},{key:'n',label:'Note'},{key:'ref',label:'Ref'}],vpayRes.rows.map(r=>({d:ddmmyyyy(r.payment_date),a:inr(r.amount),t:r.payment_type,m:r.mode||'—',n:r.note||'—',ref:r.transaction_reference||'—'})))}
<h2>Material Supplied</h2>${tableHtml([{key:'d',label:'Date'},{key:'i',label:'Item'},{key:'q',label:'Qty',num:true},{key:'u',label:'Unit'},{key:'r',label:'Rate',num:true},{key:'a',label:'Amount',num:true},{key:'n',label:'Note'}],vsupRes.rows.map(r=>({d:ddmmyyyy(r.supply_date),i:r.item_name,q:String(Number(r.quantity).toFixed(3)),u:r.unit||'',r:inr(r.rate),a:inr(r.amount),n:r.note||'—'})))}`;
    return pdfHtmlResponse(title, filterStr, html, filename);
  } catch (e) {
    return new Response(JSON.stringify({success:false,error:e.message}),{status:500,headers:{'Content-Type':'application/json'}});
  }
}
