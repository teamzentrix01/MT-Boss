import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { ensureProjectManagementPhase4Schema } from '@/lib/project-management';
import { xlsxResponse, pdfHtmlResponse, inr, ddmmyyyy, tableHtml, escHtml } from '@/lib/pm-export';

const MAX_ROWS = 50_000;

export async function GET(req) {
  if (!requireRole(req, 'admin')) return unauthorized();
  try {
    await ensureProjectManagementPhase4Schema();
    const sp = new URL(req.url).searchParams;
    const partyId = Number(sp.get('partyId'));
    const format  = sp.get('format') || 'xlsx';
    if (!Number.isInteger(partyId) || partyId <= 0)
      return new Response(JSON.stringify({ success: false, error: 'partyId required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    const [partyRes, projectsRes, paymentsRes] = await Promise.all([
      pool.query(`SELECT * FROM pm_parties WHERE id=$1`, [partyId]),
      // Projects with aggregated financials
      pool.query(`
        WITH rcv AS (SELECT project_id,COALESCE(SUM(amount),0) AS received FROM pm_party_payments WHERE NOT is_deleted GROUP BY project_id)
        SELECT p.*, pa.name AS party_name, COALESCE(r.received,0) AS received,
               p.contract_value-COALESCE(r.received,0) AS pending
        FROM pm_projects p JOIN pm_parties pa ON pa.id=p.party_id LEFT JOIN rcv r ON r.project_id=p.id
        WHERE p.party_id=$1 ORDER BY p.start_date DESC LIMIT $2
      `, [partyId, MAX_ROWS]),
      // Payment history
      pool.query(`
        SELECT pp.*, p.name AS project_name FROM pm_party_payments pp
        JOIN pm_projects p ON p.id=pp.project_id
        WHERE p.party_id=$1 AND NOT pp.is_deleted ORDER BY pp.payment_date DESC LIMIT $2
      `, [partyId, MAX_ROWS]),
    ]);

    if (!partyRes.rows[0]) return new Response('Party not found', { status: 404 });
    const party = partyRes.rows[0];
    const projects = projectsRes.rows;
    const payments = paymentsRes.rows;

    const filterStr = `Party: ${party.name}`;
    const title = `Party Statement — ${party.name}`;
    const filename = `party_statement_${party.id}`;

    if (format === 'xlsx') {
      const rows = [
        [`${title}`], [`Generated: ${ddmmyyyy(new Date())}`], [],
        ['Project Summary'],
        ['Project', 'Status', 'Start Date', 'Contract Value', 'Received', 'Pending'],
        ...projects.map(r => [r.name, r.status, ddmmyyyy(r.start_date), Number(r.contract_value), Number(r.received), Number(r.pending)]),
        ['', '', 'Totals',
          projects.reduce((s,r) => s+Number(r.contract_value),0),
          projects.reduce((s,r) => s+Number(r.received),0),
          projects.reduce((s,r) => s+Number(r.pending),0),
        ],
        [],
        ['Payment History'],
        ['Date', 'Project', 'Amount', 'Mode', 'Note'],
        ...payments.map(r => [ddmmyyyy(r.payment_date), r.project_name, Number(r.amount), r.mode||'', r.note||'']),
      ];
      return xlsxResponse(rows.slice(0, MAX_ROWS), filename);
    }

    const projCols = [
      { key:'name', label:'Project' }, { key:'status', label:'Status' }, { key:'start', label:'Start Date' },
      { key:'contract', label:'Contract', num:true }, { key:'received', label:'Received', num:true }, { key:'pending', label:'Pending', num:true },
    ];
    const projRows = projects.map(r => ({ name:r.name, status:r.status, start:ddmmyyyy(r.start_date),
      contract:inr(r.contract_value), received:inr(r.received), pending:inr(r.pending) }));
    const projTotals = { name:'', status:'', start:'Total',
      contract: inr(projects.reduce((s,r)=>s+Number(r.contract_value),0)),
      received: inr(projects.reduce((s,r)=>s+Number(r.received),0)),
      pending:  inr(projects.reduce((s,r)=>s+Number(r.pending),0)),
    };
    const payCols = [
      { key:'date', label:'Date' }, { key:'project', label:'Project' },
      { key:'amount', label:'Amount', num:true }, { key:'mode', label:'Mode' }, { key:'note', label:'Note' },
    ];
    const payRows = payments.map(r => ({ date:ddmmyyyy(r.payment_date), project:r.project_name, amount:inr(r.amount), mode:r.mode||'—', note:r.note||'—' }));

    const html = `
<p><b>Party:</b> ${escHtml(party.name)}&nbsp;&nbsp;<b>Phone:</b> ${escHtml(party.phone||'—')}&nbsp;&nbsp;<b>GST:</b> ${escHtml(party.gst_no||'—')}</p>
<h2>Project Summary</h2>${tableHtml(projCols, projRows, projTotals)}
<h2>Payment History</h2>${tableHtml(payCols, payRows)}`;
    return pdfHtmlResponse(title, filterStr, html, filename);
  } catch (e) {
    return new Response(JSON.stringify({ success:false, error:e.message }), { status:500, headers:{'Content-Type':'application/json'} });
  }
}
