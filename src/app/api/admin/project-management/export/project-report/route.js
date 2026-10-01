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
    const projectId = Number(sp.get('projectId'));
    const format = sp.get('format') || 'xlsx';
    if (!Number.isInteger(projectId) || projectId <= 0)
      return new Response('projectId required', { status: 400 });

    const [projRes, ppRes, vendorRes, stockRes, expRes] = await Promise.all([
      // Project overview (aggregated)
      pool.query(`
        WITH rcv AS(SELECT project_id,COALESCE(SUM(amount),0) received FROM pm_party_payments WHERE NOT is_deleted AND project_id=$1 GROUP BY project_id),
        lab AS(SELECT pv.project_id,COALESCE(SUM(a.wage_amount),0) amount FROM pm_project_vendors pv JOIN pm_attendance a ON a.project_vendor_id=pv.id WHERE pv.project_id=$1 GROUP BY pv.project_id),
        vmat AS(SELECT pv.project_id,COALESCE(SUM(s.amount),0) amount FROM pm_project_vendors pv JOIN pm_vendor_material_supply s ON s.project_vendor_id=pv.id WHERE NOT s.is_deleted AND pv.project_id=$1 GROUP BY pv.project_id),
        mrcv AS(SELECT project_id,COALESCE(SUM(amount),0) amount FROM pm_material_received WHERE NOT is_deleted AND project_id=$1 GROUP BY project_id),
        oth AS(SELECT project_id,COALESCE(SUM(amount),0) amount FROM pm_other_expenses WHERE NOT is_deleted AND project_id=$1 GROUP BY project_id)
        SELECT p.*,pa.name party_name,COALESCE(r.received,0) received,p.contract_value-COALESCE(r.received,0) pending,
          COALESCE(l.amount,0) labour_cost,COALESCE(vm.amount,0)+COALESCE(mr.amount,0) material_cost,COALESCE(oe.amount,0) other_cost,
          COALESCE(l.amount,0)+COALESCE(vm.amount,0)+COALESCE(mr.amount,0)+COALESCE(oe.amount,0) total_expense,
          COALESCE(r.received,0)-(COALESCE(l.amount,0)+COALESCE(vm.amount,0)+COALESCE(mr.amount,0)+COALESCE(oe.amount,0)) profit
        FROM pm_projects p JOIN pm_parties pa ON pa.id=p.party_id
        LEFT JOIN rcv r ON r.project_id=p.id LEFT JOIN lab l ON l.project_id=p.id
        LEFT JOIN vmat vm ON vm.project_id=p.id LEFT JOIN mrcv mr ON mr.project_id=p.id LEFT JOIN oth oe ON oe.project_id=p.id
        WHERE p.id=$1
      `, [projectId]),

      // Party payments
      pool.query(`SELECT payment_date,amount,mode,note,created_by FROM pm_party_payments WHERE project_id=$1 AND NOT is_deleted ORDER BY payment_date DESC LIMIT $2`,[projectId,MAX]),

      // Vendor summary
      pool.query(`
        WITH att AS(SELECT project_vendor_id,SUM(wage_amount) wage FROM pm_attendance GROUP BY project_vendor_id),
        vpay AS(SELECT project_vendor_id,SUM(amount) paid FROM pm_vendor_payments WHERE NOT is_deleted GROUP BY project_vendor_id)
        SELECT v.name vendor_name,pv.pay_type,pv.contract_amount,pv.status,
          CASE WHEN pv.pay_type='daily_wage' THEN COALESCE(a.wage,0) ELSE pv.contract_amount END earned,
          COALESCE(vp.paid,0) paid
        FROM pm_project_vendors pv JOIN pm_vendors v ON v.id=pv.vendor_id
        LEFT JOIN att a ON a.project_vendor_id=pv.id LEFT JOIN vpay vp ON vp.project_vendor_id=pv.id
        WHERE pv.project_id=$1 ORDER BY v.name LIMIT $2
      `,[projectId,MAX]),

      // Material stock
      pool.query(`
        WITH u AS(SELECT material_id,SUM(quantity) qty FROM pm_material_used WHERE project_id=$1 AND NOT is_deleted GROUP BY material_id),
        a AS(SELECT material_id,SUM(quantity) qty FROM pm_material_adjustments WHERE project_id=$1 AND NOT is_deleted GROUP BY material_id),
        r AS(SELECT material_id,SUM(CASE WHEN NOT is_deleted THEN quantity ELSE 0 END) qty,SUM(CASE WHEN NOT is_deleted THEN amount ELSE 0 END) amt FROM pm_material_received WHERE project_id=$1 GROUP BY material_id)
        SELECT m.name,m.unit,COALESCE(r.qty,0) received,COALESCE(u.qty,0) used,COALESCE(a.qty,0) adjusted,
          COALESCE(r.qty,0)-COALESCE(u.qty,0)-COALESCE(a.qty,0) stock,
          CASE WHEN COALESCE(r.qty,0)>0 THEN r.amt/r.qty ELSE 0 END avg_rate,
          (COALESCE(r.qty,0)-COALESCE(u.qty,0)-COALESCE(a.qty,0))*(CASE WHEN COALESCE(r.qty,0)>0 THEN r.amt/r.qty ELSE 0 END) stock_value
        FROM pm_materials m
        JOIN r ON r.material_id=m.id
        LEFT JOIN u ON u.material_id=m.id LEFT JOIN a ON a.material_id=m.id
        ORDER BY m.name LIMIT $2
      `,[projectId,MAX]),

      // Other expenses
      pool.query(`SELECT category,amount,expense_date,note FROM pm_other_expenses WHERE project_id=$1 AND NOT is_deleted ORDER BY expense_date DESC LIMIT $2`,[projectId,MAX]),
    ]);

    if (!projRes.rows[0]) return new Response('Project not found', { status: 404 });
    const p = projRes.rows[0];
    const title = `Project Report — ${p.name}`;
    const filename = `project_report_${p.id}`;
    const filterStr = `Project: ${p.name} | Party: ${p.party_name}`;

    if (format === 'xlsx') {
      const rows = [
        [title],[`Party: ${p.party_name}`],[`Generated: ${ddmmyyyy(new Date())}`],[],
        ['Project Overview'],
        ['Contract Value','Received','Pending','Labour','Material','Other','Total Expense','Profit/Loss'],
        [Number(p.contract_value),Number(p.received),Number(p.pending),Number(p.labour_cost),Number(p.material_cost),Number(p.other_cost),Number(p.total_expense),Number(p.profit)],
        [],['Party Payments'],['Date','Amount','Mode','Note'],
        ...ppRes.rows.map(r=>[ddmmyyyy(r.payment_date),Number(r.amount),r.mode||'',r.note||'']),
        [],['Vendor Summary'],['Vendor','Pay Type','Earned','Paid','Balance','Status'],
        ...vendorRes.rows.map(r=>[r.vendor_name,r.pay_type,Number(r.earned),Number(r.paid),Number(r.earned)-Number(r.paid),r.status]),
        [],['Material Stock'],['Material','Unit','Received','Used','Adjusted','Stock','Avg Rate','Stock Value'],
        ...stockRes.rows.map(r=>[r.name,r.unit||'',Number(r.received),Number(r.used),Number(r.adjusted),Number(r.stock),Number(r.avg_rate),Number(r.stock_value)]),
        [],['Other Expenses'],['Date','Category','Amount','Note'],
        ...expRes.rows.map(r=>[ddmmyyyy(r.expense_date),r.category,Number(r.amount),r.note||'']),
      ];
      return xlsxResponse(rows.slice(0,MAX), filename);
    }

    const html = `
<p><b>Party:</b> ${escHtml(p.party_name)} &nbsp;<b>Status:</b> ${escHtml(p.status)} &nbsp;<b>Start:</b> ${ddmmyyyy(p.start_date)} &nbsp;<b>Expected End:</b> ${ddmmyyyy(p.expected_end_date)}</p>
<h2>Financial Overview</h2>
<table><thead><tr><th>Contract</th><th class="num">Received</th><th class="num">Pending</th><th class="num">Labour</th><th class="num">Material</th><th class="num">Other</th><th class="num">Total Expense</th><th class="num">Profit / Loss</th></tr></thead>
<tbody><tr><td>${inr(p.contract_value)}</td><td class="num">${inr(p.received)}</td><td class="num">${inr(p.pending)}</td><td class="num">${inr(p.labour_cost)}</td><td class="num">${inr(p.material_cost)}</td><td class="num">${inr(p.other_cost)}</td><td class="num">${inr(p.total_expense)}</td><td class="num" style="color:${Number(p.profit)>=0?'#166534':'#991b1b'}">${inr(p.profit)}</td></tr></tbody></table>
<h2>Party Payments</h2>${tableHtml([{key:'date',label:'Date'},{key:'amount',label:'Amount',num:true},{key:'mode',label:'Mode'},{key:'note',label:'Note'}],ppRes.rows.map(r=>({date:ddmmyyyy(r.payment_date),amount:inr(r.amount),mode:r.mode||'—',note:r.note||'—'})))}
<h2>Vendor Summary</h2>${tableHtml([{key:'v',label:'Vendor'},{key:'pt',label:'Pay Type'},{key:'e',label:'Earned',num:true},{key:'p',label:'Paid',num:true},{key:'b',label:'Balance',num:true},{key:'s',label:'Status'}],vendorRes.rows.map(r=>({v:r.vendor_name,pt:r.pay_type,e:inr(r.earned),p:inr(r.paid),b:inr(Number(r.earned)-Number(r.paid)),s:r.status})))}
<h2>Material Stock</h2>${tableHtml([{key:'n',label:'Material'},{key:'u',label:'Unit'},{key:'r',label:'Received',num:true},{key:'us',label:'Used',num:true},{key:'a',label:'Adjusted',num:true},{key:'s',label:'Stock',num:true},{key:'ar',label:'Avg Rate',num:true},{key:'sv',label:'Stock Value',num:true}],stockRes.rows.map(r=>({n:r.name,u:r.unit||'',r:String(Number(r.received).toFixed(2)),us:String(Number(r.used).toFixed(2)),a:String(Number(r.adjusted).toFixed(2)),s:String(Number(r.stock).toFixed(2)),ar:inr(r.avg_rate),sv:inr(r.stock_value)})))}
<h2>Other Expenses</h2>${tableHtml([{key:'d',label:'Date'},{key:'c',label:'Category'},{key:'a',label:'Amount',num:true},{key:'n',label:'Note'}],expRes.rows.map(r=>({d:ddmmyyyy(r.expense_date),c:r.category,a:inr(r.amount),n:r.note||'—'})))}`;
    return pdfHtmlResponse(title, filterStr, html, filename);
  } catch (e) {
    return new Response(JSON.stringify({success:false,error:e.message}), {status:500,headers:{'Content-Type':'application/json'}});
  }
}
