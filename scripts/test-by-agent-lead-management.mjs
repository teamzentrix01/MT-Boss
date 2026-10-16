import pool from '../src/lib/db.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  PASS: ${message}`);
    passed++;
  } else {
    console.error(`  FAIL: ${message}`);
    failed++;
  }
}

// Logic mirror of LeadManagementAdmin.jsx filtering
function filterLeads(leads, { search = '', status = '', source = '', city = '', byAgentTab = false, selectedAgentId = '' }) {
  const query = search.trim().toLocaleLowerCase();
  return leads.filter((lead) => {
    const matchesSearch = !query || [
      lead.client_name,
      lead.client_phone,
      lead.client_email,
      lead.city,
      lead.service_type,
      lead.lead_type,
      lead.lead_source,
      lead.agent_name,
      lead.franchise_name,
      lead.client_requirement,
    ].some((value) => String(value ?? '').toLocaleLowerCase().includes(query));

    const matchesAgent = !byAgentTab || (
      Boolean(lead.agent_id) && (!selectedAgentId || String(lead.agent_id) === String(selectedAgentId))
    );

    return matchesSearch
      && matchesAgent
      && (!status || lead.status === status)
      && (!source || lead.lead_source === source)
      && (!city || lead.city === city);
  });
}

function countByAgent(leads) {
  return leads.filter((lead) => Boolean(lead.agent_id)).length;
}

async function runTests() {
  console.log('--- Starting Admin Lead Management "By Agent" Tab Tests ---');
  let testLeadId = null;
  let agent1Id = null;
  let agent2Id = null;

  try {
    // 0. Setup: Ensure at least two approved agents exist for testing
    const agentRes = await pool.query(`SELECT id, name FROM agents WHERE status = 'Approved' LIMIT 2`);
    if (agentRes.rows.length >= 2) {
      agent1Id = agentRes.rows[0].id;
      agent2Id = agentRes.rows[1].id;
    } else {
      const ins = await pool.query(`
        INSERT INTO agents (name, email, phone, city, status, login_enabled)
        VALUES ('Test Agent Alpha', 'alpha_agent@test.com', '9900000001', 'Mumbai', 'Approved', TRUE),
               ('Test Agent Beta', 'beta_agent@test.com', '9900000002', 'Mumbai', 'Approved', TRUE)
        RETURNING id, name
      `);
      agent1Id = ins.rows[0].id;
      agent2Id = ins.rows[1].id;
    }
    console.log(`Using Agent 1 ID: ${agent1Id}, Agent 2 ID: ${agent2Id}`);

    // Create an unassigned test lead
    const leadIns = await pool.query(`
      INSERT INTO agent_leads
      (client_name, client_phone, client_email, city, service_type, lead_type, lead_source, status, assigned_by_role)
      VALUES ('Sunita Sharma', '9820011223', 'sunita@example.com', 'Mumbai', 'Home Renovation', 'Primary Service', 'primary-service', 'New', 'system')
      RETURNING *
    `);
    testLeadId = leadIns.rows[0].id;

    // Fetch baseline leads from database (mimicking GET /api/admin/lead-management)
    const baseQuery = await pool.query(`
      SELECT l.*, a.name AS agent_name
      FROM agent_leads l
      LEFT JOIN agents a ON a.id = l.agent_id
    `);
    let leadsList = baseQuery.rows;

    const initialTotalCount = leadsList.length;
    const initialByAgentCount = countByAgent(leadsList);
    console.log(`Initial total leads: ${initialTotalCount}, initial By Agent count: ${initialByAgentCount}`);

    // Baseline: Test lead should NOT be in By Agent tab
    let byAgentLeads = filterLeads(leadsList, { byAgentTab: true });
    assert(!byAgentLeads.some((l) => l.id === testLeadId), 'Initially unassigned lead is NOT in "By Agent" tab');

    // Test 1: Assign an agent to a lead
    console.log('\n[Test 1] Assigning Agent 1 to test lead');
    await pool.query(`UPDATE agent_leads SET agent_id = $1 WHERE id = $2`, [agent1Id, testLeadId]);

    // Refresh leads list
    let updatedQuery = await pool.query(`
      SELECT l.*, a.name AS agent_name
      FROM agent_leads l
      LEFT JOIN agents a ON a.id = l.agent_id
    `);
    leadsList = updatedQuery.rows;

    // 1a. Tab count increments
    const newByAgentCount = countByAgent(leadsList);
    assert(newByAgentCount === initialByAgentCount + 1, `"By Agent" tab count incremented by 1 (${newByAgentCount})`);

    // 1b. Total count on All Leads does not change
    assert(leadsList.length === initialTotalCount, `"All Leads" count remains unchanged (${leadsList.length})`);

    // 1c. Lead appears under By Agent
    byAgentLeads = filterLeads(leadsList, { byAgentTab: true });
    assert(byAgentLeads.some((l) => l.id === testLeadId), 'Lead appears under "By Agent" tab');

    // 1d. Lead STILL appears under All Leads
    const allLeads = filterLeads(leadsList, { byAgentTab: false, source: '' });
    assert(allLeads.some((l) => l.id === testLeadId), 'Lead still appears under "All Leads" tab');

    // 1e. Lead STILL appears under its original source tab ("primary-service")
    const primaryServiceLeads = filterLeads(leadsList, { byAgentTab: false, source: 'primary-service' });
    assert(primaryServiceLeads.some((l) => l.id === testLeadId), 'Lead still appears under original source tab ("primary-service")');

    // Test 2: Unassign agent from lead
    console.log('\n[Test 2] Unassigning agent from test lead');
    await pool.query(`UPDATE agent_leads SET agent_id = NULL WHERE id = $1`, [testLeadId]);

    updatedQuery = await pool.query(`
      SELECT l.*, a.name AS agent_name
      FROM agent_leads l
      LEFT JOIN agents a ON a.id = l.agent_id
    `);
    leadsList = updatedQuery.rows;

    // 2a. Tab count decrements back
    assert(countByAgent(leadsList) === initialByAgentCount, `"By Agent" tab count decremented back to ${initialByAgentCount}`);

    // 2b. Lead leaves By Agent tab
    byAgentLeads = filterLeads(leadsList, { byAgentTab: true });
    assert(!byAgentLeads.some((l) => l.id === testLeadId), 'Lead leaves "By Agent" tab when unassigned');

    // 2c. Lead remains under All Leads
    const allLeadsAfterUnassign = filterLeads(leadsList, { byAgentTab: false, source: '' });
    assert(allLeadsAfterUnassign.some((l) => l.id === testLeadId), 'Lead still appears in "All Leads" after unassigning');

    // Test 3: Agent dropdown filters correctly
    console.log('\n[Test 3] Agent dropdown filter');
    // Assign Agent 1 to test lead, and create/assign Agent 2 to another lead
    await pool.query(`UPDATE agent_leads SET agent_id = $1 WHERE id = $2`, [agent1Id, testLeadId]);

    const lead2Ins = await pool.query(`
      INSERT INTO agent_leads
      (agent_id, client_name, client_phone, city, service_type, lead_type, lead_source, status, assigned_by_role)
      VALUES ($1, 'Rohan Verma', '9820099887', 'Mumbai', 'Civil Work', 'Quick Service', 'quick-service', 'New', 'admin')
      RETURNING id
    `, [agent2Id]);
    const testLead2Id = lead2Ins.rows[0].id;

    updatedQuery = await pool.query(`
      SELECT l.*, a.name AS agent_name
      FROM agent_leads l
      LEFT JOIN agents a ON a.id = l.agent_id
    `);
    leadsList = updatedQuery.rows;

    // Filter By Agent with selectedAgentId = Agent 1
    const agent1Filtered = filterLeads(leadsList, { byAgentTab: true, selectedAgentId: String(agent1Id) });
    assert(agent1Filtered.some((l) => l.id === testLeadId), 'Agent 1 dropdown shows lead assigned to Agent 1');
    assert(!agent1Filtered.some((l) => l.id === testLead2Id), 'Agent 1 dropdown excludes lead assigned to Agent 2');

    // Filter By Agent with selectedAgentId = Agent 2
    const agent2Filtered = filterLeads(leadsList, { byAgentTab: true, selectedAgentId: String(agent2Id) });
    assert(agent2Filtered.some((l) => l.id === testLead2Id), 'Agent 2 dropdown shows lead assigned to Agent 2');
    assert(!agent2Filtered.some((l) => l.id === testLeadId), 'Agent 2 dropdown excludes lead assigned to Agent 1');

    // Filter By Agent with selectedAgentId = '' (All agents)
    const allAgentsFiltered = filterLeads(leadsList, { byAgentTab: true, selectedAgentId: '' });
    assert(allAgentsFiltered.some((l) => l.id === testLeadId) && allAgentsFiltered.some((l) => l.id === testLead2Id), 'All agents dropdown shows leads for both Agent 1 and Agent 2');

    // Test 4: An agent-created lead appears under By Agent
    console.log('\n[Test 4] Agent-created lead');
    const agentCreatedIns = await pool.query(`
      INSERT INTO agent_leads
      (agent_id, client_name, client_phone, city, service_type, lead_type, lead_source, status, assigned_by_role)
      VALUES ($1, 'Agent Created Lead Demo', '9811122233', 'Mumbai', 'Interior Design', 'offline', 'offline', 'New', 'agent')
      RETURNING id
    `, [agent1Id]);
    const agentCreatedId = agentCreatedIns.rows[0].id;

    updatedQuery = await pool.query(`
      SELECT l.*, a.name AS agent_name
      FROM agent_leads l
      LEFT JOIN agents a ON a.id = l.agent_id
    `);
    leadsList = updatedQuery.rows;

    byAgentLeads = filterLeads(leadsList, { byAgentTab: true });
    assert(byAgentLeads.some((l) => l.id === agentCreatedId), 'Agent-created lead appears under "By Agent" tab');

    const offlineLeads = filterLeads(leadsList, { byAgentTab: false, source: 'offline' });
    assert(offlineLeads.some((l) => l.id === agentCreatedId), 'Agent-created lead appears under "offline" source tab');

    const allLeadsWithAgentCreated = filterLeads(leadsList, { byAgentTab: false, source: '' });
    assert(allLeadsWithAgentCreated.some((l) => l.id === agentCreatedId), 'Agent-created lead appears under "All Leads" tab');

    // Test 5: Existing search, city, status and source filters work together with By Agent
    console.log('\n[Test 5] Multi-filter combination with By Agent');
    const combinedFiltered = filterLeads(leadsList, {
      byAgentTab: true,
      selectedAgentId: String(agent1Id),
      city: 'Mumbai',
      status: 'New',
      source: 'offline',
      search: 'Agent Created',
    });
    assert(combinedFiltered.length === 1 && combinedFiltered[0].id === agentCreatedId, 'Combined filters (agent + city + status + source + search) work together accurately');

    // Clean up test leads
    await pool.query('DELETE FROM agent_leads WHERE id IN ($1, $2, $3)', [testLeadId, testLead2Id, agentCreatedId]);
    console.log('\nCleaned up test leads.');

  } catch (err) {
    console.error('Error during test execution:', err);
    failed++;
  } finally {
    await pool.end();
  }

  console.log(`\n--- Test Summary: ${passed} Passed, ${failed} Failed ---`);
  if (failed > 0) process.exit(1);
}

runTests();
