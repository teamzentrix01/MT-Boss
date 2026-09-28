'use client';

import React, { useState, useEffect, useCallback, useId } from 'react';

function today() {
  return new Date().toISOString().slice(0, 10);
}

function INR(val) {
  const n = Number(val);
  if (!Number.isFinite(n)) return '₹0';
  return '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

function Input({ label, name, type = 'text', value, set, required, placeholder, min, step }) {
  const inputId = useId();
  return (
    <label htmlFor={inputId}>
      <small style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: '#475569' }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </small>
      <input
        id={inputId}
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        min={min}
        step={step}
        value={value ?? ''}
        onChange={(e) => set((prev) => ({ ...prev, [name]: e.target.value }))}
      />
    </label>
  );
}

async function api(path, opts = {}) {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('admin-token') || localStorage.getItem('token') || ''
    : '';

  const res = await fetch(path, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
  });

  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

const partyBlank = { name: '', phone: '', email: '', gst_no: '', address: '' };
const projectBlank = {
  name: '',
  party_id: '',
  site_address: '',
  start_date: today(),
  expected_end_date: '',
  contract_value: '',
  built_up_area: '',
  status: 'running',
  project_type: '',
  floors: '',
  quality_tier: '',
  city: '',
  foundation_type: '',
  include_in_benchmark: false,
};

const materialBlank = { name: '', unit: 'kg', category: 'Civil', min_stock_level: 0, is_active: true };
const receivedBlank = { material_id: '', quantity: '', rate: '', received_date: today(), supplier_name: '', challan_no: '', note: '' };
const usedBlank = { material_id: '', quantity: '', used_date: today(), used_for: '', note: '' };
const adjustmentBlank = { material_id: '', adjustment_type: 'wastage', quantity: '', adjustment_date: today(), to_project_id: '', note: '' };
const expenseBlank = { category: 'transport', amount: '', expense_date: today(), note: '' };

export default function PartyProjectManagement({ initialScreen = 'parties' }) {
  // Navigation: 'parties' | 'party' | 'partyForm' | 'project' | 'projectForm' | 'reports'
  const [screen, setScreen] = useState(initialScreen);
  const [role, setRole] = useState('admin');

  // Parties state
  const [parties, setParties] = useState([]);
  const [party, setParty] = useState(null);
  const [partyForm, setPartyForm] = useState(partyBlank);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [message, setMessage] = useState('');

  // Project state
  const [project, setProject] = useState(null);
  const [projectForm, setProjectForm] = useState(projectBlank);
  // 'vendors' | 'attendance' | 'materials' | 'expenses' | 'payments' | 'party_payments'
  const [projectTab, setProjectTab] = useState('materials');

  // Phase 1: Party payments
  const [partyPayments, setPartyPayments] = useState([]);
  const [partyPaymentForm, setPartyPaymentForm] = useState({ amount: '', payment_date: today(), mode: 'bank', note: '' });

  // Phase 2: Project Vendors
  const [projectVendors, setProjectVendors] = useState([]);
  const [allVendorsMaster, setAllVendorsMaster] = useState([]);
  const [addVendorModal, setAddVendorModal] = useState(false);
  const [vendorMode, setVendorMode] = useState('existing');
  const [assignForm, setAssignForm] = useState({
    vendor_id: '',
    work_description: '',
    pay_type: 'daily_wage',
    daily_rate: '',
    contract_amount: '',
    new_vendor_name: '',
    new_vendor_phone: '',
    new_vendor_trade: '',
    new_vendor_address: '',
  });

  // Phase 2: Vendor Detail View
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorAttendanceHistory, setVendorAttendanceHistory] = useState([]);
  const [vendorPaymentsHistory, setVendorPaymentsHistory] = useState([]);
  const [vendorMaterialHistory, setVendorMaterialHistory] = useState([]);
  const [calendarMonth, setCalendarMonth] = useState(() => today().slice(0, 7));

  // Phase 2: Bulk Attendance
  const [attendanceDate, setAttendanceDate] = useState(today());
  const [attendanceRows, setAttendanceRows] = useState([]);
  const [savingAttendance, setSavingAttendance] = useState(false);

  // Phase 2: Vendor Payments Tab
  const [vendorPaymentsList, setVendorPaymentsList] = useState([]);
  const [vPayFilterVendor, setVPayFilterVendor] = useState('');
  const [vPayFilterType, setVPayFilterType] = useState('');
  const [vPayFilterFrom, setVPayFilterFrom] = useState('');
  const [vPayFilterTo, setVPayFilterTo] = useState('');
  const [vendorPaymentForm, setVendorPaymentForm] = useState({
    project_vendor_id: '',
    amount: '',
    payment_date: today(),
    mode: 'bank',
    payment_type: 'labour',
    note: '',
  });

  // Phase 2: Vendor Material Supply Modal
  const [supplyModal, setSupplyModal] = useState(false);
  const [supplyForm, setSupplyForm] = useState({
    item_name: '',
    unit: '',
    quantity: '',
    rate: '',
    supply_date: today(),
    material_id: '',
    note: '',
  });

  // ── Phase 3: Materials & Stock State ───────────────────────────────────────
  const [materialsMaster, setMaterialsMaster] = useState([]);
  const [stockRows, setStockRows] = useState([]);
  const [materialsSubTab, setMaterialsSubTab] = useState('stock'); // 'stock' | 'received' | 'used' | 'adjustments'
  const [receivedRows, setReceivedRows] = useState([]);
  const [usedRows, setUsedRows] = useState([]);
  const [adjustmentRows, setAdjustmentRows] = useState([]);

  // Filters for materials tables
  const [matFilterId, setMatFilterId] = useState('');
  const [matFilterFrom, setMatFilterFrom] = useState('');
  const [matFilterTo, setMatFilterTo] = useState('');

  // Modals for Phase 3
  const [addMaterialModal, setAddMaterialModal] = useState(false);
  const [materialForm, setMaterialForm] = useState(materialBlank);

  const [receivedModal, setReceivedModal] = useState(false);
  const [receivedForm, setReceivedForm] = useState(receivedBlank);
  const [editingReceivedId, setEditingReceivedId] = useState(null);

  const [usedModal, setUsedModal] = useState(false);
  const [usedForm, setUsedForm] = useState(usedBlank);
  const [editingUsedId, setEditingUsedId] = useState(null);

  const [adjustmentModal, setAdjustmentModal] = useState(false);
  const [adjustmentForm, setAdjustmentForm] = useState(adjustmentBlank);
  const [editingAdjId, setEditingAdjId] = useState(null);

  // Material detail timeline drawer
  const [timelineMaterial, setTimelineMaterial] = useState(null);
  const [timelineData, setTimelineData] = useState([]);
  const [timelineStock, setTimelineStock] = useState(0);

  // ── Phase 3: Other Expenses State ──────────────────────────────────────────
  const [expenseRows, setExpenseRows] = useState([]);
  const [expenseSummary, setExpenseSummary] = useState({ totalAmount: 0 });
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState('');
  const [expenseModal, setExpenseModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState(expenseBlank);
  const [editingExpenseId, setEditingExpenseId] = useState(null);

  // ── Phase 3: Reports State ────────────────────────────────────────────────
  const [reportType, setReportType] = useState('cost_summary');
  const [reportProjectFilter, setReportProjectFilter] = useState('');
  const [reportData, setReportData] = useState({ title: '', headers: [], data: [] });
  const [loadingReport, setLoadingReport] = useState(false);
  const [allProjectsList, setAllProjectsList] = useState([]);

  // Check supervisor role
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('admin-user') || localStorage.getItem('user') || '{}');
      if (u.role === 'site_supervisor') setRole('site_supervisor');
    } catch {}
  }, []);

  const isSupervisor = role === 'site_supervisor';

  // ── Load Parties ─────────────────────────────────────────────────────────────
  const loadParties = useCallback(async () => {
    try {
      const d = await api(`/api/admin/project-management/parties?search=${encodeURIComponent(search)}&page=${pagination.page}&pageSize=20`);
      setParties(d.data || []);
      setPagination(d.pagination || { page: 1, totalPages: 1 });
    } catch (e) {
      setMessage(e.message);
    }
  }, [search, pagination.page]);

  useEffect(() => {
    if (screen === 'parties') loadParties();
  }, [screen, loadParties]);

  // ── Show Single Party ────────────────────────────────────────────────────────
  const showParty = async (id) => {
    try {
      const d = await api(`/api/admin/project-management/parties/${id}?page=1&pageSize=100`);
      setParty(d.data);
      setScreen('party');
    } catch (e) {
      setMessage(e.message);
    }
  };

  // ── Load Phase 3 Materials & Expenses Data ──────────────────────────────────
  const loadPhase3ProjectData = useCallback(async (projId) => {
    const pid = projId || project?.id;
    if (!pid) return;
    try {
      const [mRes, stRes, rcRes, usRes, adRes, expRes] = await Promise.all([
        api('/api/admin/project-management/materials?pageSize=100').catch(() => ({ data: [] })),
        api(`/api/admin/project-management/stock?projectId=${pid}&pageSize=100`).catch(() => ({ data: [] })),
        api(`/api/admin/project-management/material-received?projectId=${pid}&pageSize=100`).catch(() => ({ data: [] })),
        api(`/api/admin/project-management/material-used?projectId=${pid}&pageSize=100`).catch(() => ({ data: [] })),
        api(`/api/admin/project-management/material-adjustments?projectId=${pid}&pageSize=100`).catch(() => ({ data: [] })),
        api(`/api/admin/project-management/other-expenses?projectId=${pid}&pageSize=100`).catch(() => ({ data: [], summary: {} })),
      ]);

      setMaterialsMaster(mRes.data || []);
      setStockRows(stRes.data || []);
      setReceivedRows(rcRes.data || []);
      setUsedRows(usRes.data || []);
      setAdjustmentRows(adRes.data || []);
      setExpenseRows(expRes.data || []);
      setExpenseSummary(expRes.summary || { totalAmount: 0 });
    } catch (e) {
      console.error('Error loading Phase 3 data:', e);
    }
  }, [project?.id]);

  // ── Show Single Project Overview ─────────────────────────────────────────────
  const showProject = async (id) => {
    try {
      const [projRes, ppRes, pvRes, vListRes] = await Promise.all([
        api(`/api/admin/project-management/projects/${id}`),
        api(`/api/admin/project-management/payments?projectId=${id}&page=1&pageSize=100`).catch(() => ({ data: [] })),
        api(`/api/admin/project-management/project-vendors?projectId=${id}&page=1&pageSize=100`).catch(() => ({ data: [] })),
        api(`/api/admin/project-management/vendors?page=1&pageSize=100`).catch(() => ({ data: [] })),
      ]);
      setProject(projRes.data);
      setPartyPayments(ppRes.data || []);
      setProjectVendors(pvRes.data || []);
      setAllVendorsMaster(vListRes.data || []);
      setSelectedVendor(null);
      setScreen('project');
      setProjectTab('materials');
      loadPhase3ProjectData(id);
    } catch (e) {
      setMessage(e.message);
    }
  };

  // ── Refresh Project Data ─────────────────────────────────────────────────────
  const refreshProjectData = async (projId) => {
    const pid = projId || project?.id;
    if (!pid) return;
    try {
      const [projRes, pvRes, ppRes] = await Promise.all([
        api(`/api/admin/project-management/projects/${pid}`),
        api(`/api/admin/project-management/project-vendors?projectId=${pid}&page=1&pageSize=100`),
        api(`/api/admin/project-management/payments?projectId=${pid}&page=1&pageSize=100`),
      ]);
      setProject(projRes.data);
      setProjectVendors(pvRes.data || []);
      setPartyPayments(ppRes.data || []);
      loadPhase3ProjectData(pid);
    } catch (e) {
      setMessage(e.message);
    }
  };

  // ── Load Reports Data ───────────────────────────────────────────────────────
  const loadReportsData = useCallback(async (type, projFilter) => {
    setLoadingReport(true);
    try {
      const url = `/api/admin/project-management/reports?type=${type}${projFilter ? `&projectId=${projFilter}` : ''}`;
      const res = await api(url);
      setReportData(res);
    } catch (e) {
      setMessage(e.message);
    } finally {
      setLoadingReport(false);
    }
  }, []);

  const openReportsScreen = async () => {
    setScreen('reports');
    try {
      const pRes = await api('/api/admin/project-management/projects?pageSize=100').catch(() => ({ data: [] }));
      setAllProjectsList(pRes.data || []);
    } catch {}
    loadReportsData(reportType, reportProjectFilter);
  };

  useEffect(() => {
    if (screen === 'reports') {
      loadReportsData(reportType, reportProjectFilter);
    }
  }, [screen, reportType, reportProjectFilter, loadReportsData]);

  // ── Open Timeline Drawer ────────────────────────────────────────────────────
  const openMaterialTimeline = async (material) => {
    if (!project?.id) return;
    try {
      const res = await api(`/api/admin/project-management/material-timeline?projectId=${project.id}&materialId=${material.id || material.material_id}`);
      setTimelineMaterial(res.material);
      setTimelineData(res.timeline || []);
      setTimelineStock(res.current_stock ?? 0);
    } catch (e) {
      setMessage(e.message);
    }
  };

  // ── Save Master Material ────────────────────────────────────────────────────
  const saveMaterialMaster = async (e) => {
    e.preventDefault();
    try {
      const res = await api('/api/admin/project-management/materials', {
        method: 'POST',
        body: JSON.stringify(materialForm),
      });
      setMessage('Material saved successfully');
      setAddMaterialModal(false);
      setMaterialForm(materialBlank);
      setMaterialsMaster((prev) => [...prev, res.data]);
      if (project?.id) loadPhase3ProjectData(project.id);
    } catch (err) {
      setMessage(err.message);
    }
  };

  // ── Save Received Entry ─────────────────────────────────────────────────────
  const saveReceivedEntry = async (e) => {
    e.preventDefault();
    if (!project?.id) return;
    try {
      if (editingReceivedId) {
        await api(`/api/admin/project-management/material-received/${editingReceivedId}`, {
          method: 'PATCH',
          body: JSON.stringify(receivedForm),
        });
        setMessage('Material received entry updated');
      } else {
        await api('/api/admin/project-management/material-received', {
          method: 'POST',
          body: JSON.stringify({ ...receivedForm, project_id: project.id }),
        });
        setMessage('Material received recorded successfully');
      }
      setReceivedModal(false);
      setEditingReceivedId(null);
      setReceivedForm(receivedBlank);
      refreshProjectData(project.id);
    } catch (err) {
      setMessage(err.message);
    }
  };

  // ── Save Used Entry ─────────────────────────────────────────────────────────
  const saveUsedEntry = async (e) => {
    e.preventDefault();
    if (!project?.id) return;
    try {
      let res;
      if (editingUsedId) {
        res = await api(`/api/admin/project-management/material-used/${editingUsedId}`, {
          method: 'PATCH',
          body: JSON.stringify(usedForm),
        });
      } else {
        res = await api('/api/admin/project-management/material-used', {
          method: 'POST',
          body: JSON.stringify({ ...usedForm, project_id: project.id }),
        });
      }
      if (res.warning) {
        alert(res.warning);
      }
      setMessage('Material usage recorded');
      setUsedModal(false);
      setEditingUsedId(null);
      setUsedForm(usedBlank);
      refreshProjectData(project.id);
    } catch (err) {
      setMessage(err.message);
    }
  };

  // ── Save Adjustment Entry ───────────────────────────────────────────────────
  const saveAdjustmentEntry = async (e) => {
    e.preventDefault();
    if (!project?.id) return;
    try {
      let res;
      if (editingAdjId) {
        res = await api(`/api/admin/project-management/material-adjustments/${editingAdjId}`, {
          method: 'PATCH',
          body: JSON.stringify(adjustmentForm),
        });
      } else {
        res = await api('/api/admin/project-management/material-adjustments', {
          method: 'POST',
          body: JSON.stringify({ ...adjustmentForm, project_id: project.id }),
        });
      }
      if (res.warning) {
        alert(res.warning);
      }
      setMessage('Material adjustment recorded');
      setAdjustmentModal(false);
      setEditingAdjId(null);
      setAdjustmentForm(adjustmentBlank);
      refreshProjectData(project.id);
    } catch (err) {
      setMessage(err.message);
    }
  };

  // ── Save Expense Entry ──────────────────────────────────────────────────────
  const saveExpenseEntry = async (e) => {
    e.preventDefault();
    if (!project?.id) return;
    try {
      if (editingExpenseId) {
        await api(`/api/admin/project-management/other-expenses/${editingExpenseId}`, {
          method: 'PATCH',
          body: JSON.stringify(expenseForm),
        });
        setMessage('Expense updated successfully');
      } else {
        await api('/api/admin/project-management/other-expenses', {
          method: 'POST',
          body: JSON.stringify({ ...expenseForm, project_id: project.id }),
        });
        setMessage('Expense recorded successfully');
      }
      setExpenseModal(false);
      setEditingExpenseId(null);
      setExpenseForm(expenseBlank);
      refreshProjectData(project.id);
    } catch (err) {
      setMessage(err.message);
    }
  };

  // ── Party CRUD ───────────────────────────────────────────────────────────────
  const saveParty = async (e) => {
    e.preventDefault();
    try {
      if (partyForm.id) {
        await api(`/api/admin/project-management/parties/${partyForm.id}`, { method: 'PATCH', body: JSON.stringify(partyForm) });
        setMessage('Party updated');
      } else {
        await api('/api/admin/project-management/parties', { method: 'POST', body: JSON.stringify(partyForm) });
        setMessage('Party created');
      }
      setPartyForm(partyBlank);
      setScreen('parties');
      loadParties();
    } catch (e) {
      setMessage(e.message);
    }
  };

  // ── Project CRUD ─────────────────────────────────────────────────────────────
  const saveProject = async (e) => {
    e.preventDefault();
    try {
      if (projectForm.id) {
        await api(`/api/admin/project-management/projects/${projectForm.id}`, { method: 'PATCH', body: JSON.stringify(projectForm) });
        setMessage('Project updated');
      } else {
        await api('/api/admin/project-management/projects', { method: 'POST', body: JSON.stringify(projectForm) });
        setMessage('Project created');
      }
      setProjectForm(projectBlank);
      if (party?.party?.id) {
        showParty(party.party.id);
      } else {
        setScreen('parties');
      }
    } catch (e) {
      setMessage(e.message);
    }
  };

  // ── Generic Deletion ────────────────────────────────────────────────────────
  const del = async (kind, id) => {
    if (!confirm('Are you sure? This action cannot be undone.')) return;
    try {
      if (kind === 'party') {
        await api(`/api/admin/project-management/parties/${id}`, { method: 'DELETE' });
        loadParties();
      } else if (kind === 'partyPayment') {
        await api(`/api/admin/project-management/payments/${id}`, { method: 'DELETE' });
        refreshProjectData();
      } else if (kind === 'vendorPayment') {
        await api(`/api/admin/project-management/vendor-payments/${id}`, { method: 'DELETE' });
        refreshProjectData();
      } else if (kind === 'received') {
        await api(`/api/admin/project-management/material-received/${id}`, { method: 'DELETE' });
        refreshProjectData();
      } else if (kind === 'used') {
        await api(`/api/admin/project-management/material-used/${id}`, { method: 'DELETE' });
        refreshProjectData();
      } else if (kind === 'adjustment') {
        await api(`/api/admin/project-management/material-adjustments/${id}`, { method: 'DELETE' });
        refreshProjectData();
      } else if (kind === 'expense') {
        await api(`/api/admin/project-management/other-expenses/${id}`, { method: 'DELETE' });
        refreshProjectData();
      }
      setMessage('Record deleted successfully');
    } catch (e) {
      setMessage(e.message);
    }
  };

  // ── Phase 1: Party Payment ───────────────────────────────────────────────────
  const savePartyPayment = async (e) => {
    e.preventDefault();
    try {
      await api('/api/admin/project-management/payments', {
        method: 'POST',
        body: JSON.stringify({ ...partyPaymentForm, project_id: project.id }),
      });
      setPartyPaymentForm({ amount: '', payment_date: today(), mode: 'bank', note: '' });
      setMessage('Party payment recorded');
      refreshProjectData();
    } catch (e) {
      setMessage(e.message);
    }
  };

  // ── Phase 2: Assign Vendor ───────────────────────────────────────────────────
  const assignVendorToProject = async (e) => {
    e.preventDefault();
    try {
      let vId = assignForm.vendor_id;
      if (vendorMode === 'new') {
        const nv = await api('/api/admin/project-management/vendors', {
          method: 'POST',
          body: JSON.stringify({
            name: assignForm.new_vendor_name,
            phone: assignForm.new_vendor_phone,
            trade: assignForm.new_vendor_trade,
            address: assignForm.new_vendor_address,
          }),
        });
        vId = nv.data.id;
      }

      await api('/api/admin/project-management/project-vendors', {
        method: 'POST',
        body: JSON.stringify({
          project_id: project.id,
          vendor_id: vId,
          work_description: assignForm.work_description,
          pay_type: assignForm.pay_type,
          daily_rate: assignForm.pay_type === 'daily_wage' ? assignForm.daily_rate : null,
          contract_amount: assignForm.pay_type === 'contract' ? assignForm.contract_amount : null,
        }),
      });

      setMessage('Vendor added to project');
      setAddVendorModal(false);
      setAssignForm({
        vendor_id: '',
        work_description: '',
        pay_type: 'daily_wage',
        daily_rate: '',
        contract_amount: '',
        new_vendor_name: '',
        new_vendor_phone: '',
        new_vendor_trade: '',
        new_vendor_address: '',
      });
      refreshProjectData();
    } catch (e) {
      setMessage(e.message);
    }
  };

  // ── Phase 2: View Vendor Details ─────────────────────────────────────────────
  const openVendorDetail = async (pv) => {
    setSelectedVendor(pv);
    try {
      const [attRes, payRes, matRes] = await Promise.all([
        api(`/api/admin/project-management/attendance?projectVendorId=${pv.id}&month=${calendarMonth}`).catch(() => ({ data: [] })),
        api(`/api/admin/project-management/vendor-payments?projectVendorId=${pv.id}&pageSize=100`).catch(() => ({ data: [] })),
        api(`/api/admin/project-management/material-supply?projectVendorId=${pv.id}&pageSize=100`).catch(() => ({ data: [] })),
      ]);
      setVendorAttendanceHistory(attRes.data || []);
      setVendorPaymentsHistory(payRes.data || []);
      setVendorMaterialHistory(matRes.data || []);
    } catch (e) {
      setMessage(e.message);
    }
  };

  // ── Phase 2: Bulk Attendance ────────────────────────────────────────────────
  const loadDailyAttendance = useCallback(async (date) => {
    if (!project?.id) return;
    try {
      const attData = await api(`/api/admin/project-management/attendance?projectId=${project.id}&date=${date}`).catch(() => ({ data: [] }));
      const existingMap = new Map((attData.data || []).map((a) => [Number(a.project_vendor_id), a]));
      const dailyVendors = projectVendors.filter((pv) => pv.pay_type === 'daily_wage');

      const rows = dailyVendors.map((pv) => {
        const ex = existingMap.get(Number(pv.id));
        return {
          project_vendor_id: pv.id,
          vendor_name: pv.vendor_name,
          trade: pv.trade,
          status: ex ? ex.status : 'present',
          workers_count: ex ? Number(ex.workers_count) : 1,
          rate_per_worker: ex ? Number(ex.rate_per_worker) : Number(pv.daily_rate || 0),
          wage_amount: ex ? Number(ex.wage_amount) : Number(pv.daily_rate || 0),
          note: ex ? ex.note || '' : '',
        };
      });
      setAttendanceRows(rows);
    } catch (e) {
      setMessage(e.message);
    }
  }, [project?.id, projectVendors]);

  useEffect(() => {
    if (projectTab === 'attendance' && project?.id) {
      loadDailyAttendance(attendanceDate);
    }
  }, [projectTab, attendanceDate, loadDailyAttendance, project?.id]);

  const saveAllAttendance = async () => {
    setSavingAttendance(true);
    try {
      await api('/api/admin/project-management/attendance', {
        method: 'POST',
        body: JSON.stringify({
          attendance_date: attendanceDate,
          records: attendanceRows.map((r) => ({
            project_vendor_id: r.project_vendor_id,
            status: r.status,
            workers_count: r.workers_count,
            rate_per_worker: r.rate_per_worker,
            note: r.note,
          })),
        }),
      });
      setMessage('Attendance saved for all vendors');
      refreshProjectData();
    } catch (e) {
      setMessage(e.message);
    } finally {
      setSavingAttendance(false);
    }
  };

  // ── Phase 2: Vendor Payments Tab ─────────────────────────────────────────────
  const loadVendorPayments = useCallback(async () => {
    if (!project?.id) return;
    try {
      let q = `/api/admin/project-management/vendor-payments?projectId=${project.id}&pageSize=100`;
      if (vPayFilterVendor) q += `&projectVendorId=${vPayFilterVendor}`;
      if (vPayFilterType) q += `&paymentType=${vPayFilterType}`;
      if (vPayFilterFrom) q += `&startDate=${vPayFilterFrom}`;
      if (vPayFilterTo) q += `&endDate=${vPayFilterTo}`;
      const d = await api(q);
      setVendorPaymentsList(d.data || []);
    } catch (e) {
      setMessage(e.message);
    }
  }, [project?.id, vPayFilterVendor, vPayFilterType, vPayFilterFrom, vPayFilterTo]);

  useEffect(() => {
    if (projectTab === 'payments' && project?.id) {
      loadVendorPayments();
    }
  }, [projectTab, loadVendorPayments, project?.id]);

  const saveVendorPayment = async (e) => {
    e.preventDefault();
    try {
      await api('/api/admin/project-management/vendor-payments', {
        method: 'POST',
        body: JSON.stringify(vendorPaymentForm),
      });
      setMessage('Vendor payment recorded');
      setVendorPaymentForm({
        project_vendor_id: '',
        amount: '',
        payment_date: today(),
        mode: 'bank',
        payment_type: 'labour',
        note: '',
      });
      refreshProjectData();
      loadVendorPayments();
    } catch (e) {
      setMessage(e.message);
    }
  };

  // ── Phase 2: Save Material Supply (Vendor) ──────────────────────────────────
  const saveMaterialSupply = async (e) => {
    e.preventDefault();
    if (!selectedVendor) return;
    try {
      await api('/api/admin/project-management/material-supply', {
        method: 'POST',
        body: JSON.stringify({
          ...supplyForm,
          project_vendor_id: selectedVendor.id,
        }),
      });
      setMessage('Vendor material supply recorded');
      setSupplyModal(false);
      setSupplyForm({ item_name: '', unit: '', quantity: '', rate: '', supply_date: today(), material_id: '', note: '' });
      openVendorDetail(selectedVendor);
      refreshProjectData();
    } catch (e) {
      setMessage(e.message);
    }
  };

  return (
    <section className="pm-container">
      {/* ── TOP NAV BAR ───────────────────────────────────────────────────── */}
      <div className="bar" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {screen !== 'parties' && (
            <button
              className="muted"
              onClick={() => {
                if (screen === 'project' && party) setScreen('party');
                else if (screen === 'projectForm' && party) setScreen('party');
                else setScreen('parties');
              }}
            >
              &larr; Back
            </button>
          )}
          <h2 style={{ margin: 0, fontSize: 20 }}>Project Management</h2>
          <span style={{ fontSize: 12, background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
            {role.toUpperCase()}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            className={screen === 'reports' ? 'active-btn' : 'muted'}
            onClick={openReportsScreen}
            style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
          >
            📊 Reports &amp; CSV
          </button>
          {screen === 'parties' && (
            <button
              onClick={() => {
                setPartyForm(partyBlank);
                setScreen('partyForm');
              }}
            >
              + Add Party
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className="alert" onClick={() => setMessage('')} style={{ cursor: 'pointer' }}>
          {message} <small style={{ float: 'right' }}>&times;</small>
        </div>
      )}

      {/* ── 1. PARTIES LIST ───────────────────────────────────────────────── */}
      {screen === 'parties' && (
        <>
          <div className="bar" style={{ marginBottom: 12 }}>
            <input
              placeholder="Search parties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: 300 }}
            />
          </div>

          <table>
            <thead>
              <tr>
                <th>Party</th>
                <th>Projects</th>
                <th>Contract Value</th>
                <th>Received</th>
                <th>Pending</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {parties.map((p) => (
                <tr key={p.id}>
                  <td>
                    <b>{p.name}</b>
                    <br />
                    <span style={{ fontSize: 11, color: '#64748b' }}>{p.phone || p.email || '—'}</span>
                  </td>
                  <td>{p.project_count}</td>
                  <td style={{ fontWeight: 600 }}>{INR(p.total_contract_value)}</td>
                  <td style={{ color: '#16a34a', fontWeight: 600 }}>{INR(p.total_received)}</td>
                  <td style={{ color: '#dc2626', fontWeight: 600 }}>{INR(p.total_pending)}</td>
                  <td className="actions" style={{ justifyContent: 'flex-end' }}>
                    <button onClick={() => showParty(p.id)}>View Party</button>
                    <button
                      className="muted"
                      onClick={() => {
                        setPartyForm(p);
                        setScreen('partyForm');
                      }}
                    >
                      Edit
                    </button>
                    <button className="danger" onClick={() => del('party', p.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {parties.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No parties found. Click &ldquo;+ Add Party&rdquo; to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="bar" style={{ marginTop: 14, justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: '#64748b' }}>
              Page {pagination.page} / {pagination.totalPages || 1}
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                className="muted"
                disabled={pagination.page <= 1}
                onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
              >
                Previous
              </button>
              <button
                className="muted"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── 2. ADD/EDIT PARTY FORM ────────────────────────────────────────── */}
      {screen === 'partyForm' && (
        <form onSubmit={saveParty}>
          <h3>{partyForm.id ? 'Edit' : 'Add'} Party</h3>
          <div className="grid">
            <Input label="Name" name="name" value={partyForm.name} set={setPartyForm} required />
            <Input label="Phone" name="phone" value={partyForm.phone} set={setPartyForm} />
            <Input label="Email" name="email" value={partyForm.email} set={setPartyForm} type="email" />
            <Input label="GST No." name="gst_no" value={partyForm.gst_no} set={setPartyForm} />
            <label style={{ gridColumn: '1/-1' }}>
              <small style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: '#475569' }}>Address</small>
              <textarea
                value={partyForm.address || ''}
                onChange={(e) => setPartyForm((x) => ({ ...x, address: e.target.value }))}
                style={{ height: 60 }}
              />
            </label>
          </div>
          <p style={{ marginTop: 14 }}>
            <button type="submit">Save Party</button>
          </p>
        </form>
      )}

      {/* ── 3. SINGLE PARTY DETAIL SCREEN ─────────────────────────────────── */}
      {screen === 'party' && party && (
        <>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18 }}>{party.party.name}</h3>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 12 }}>
                  {party.party.phone} &bull; {party.party.email || 'No email'} &bull; GST: {party.party.gst_no || '—'}
                </p>
              </div>
              <button
                onClick={() => {
                  setProjectForm({ ...projectBlank, party_id: String(party.party.id) });
                  setScreen('projectForm');
                }}
              >
                + Add Project
              </button>
            </div>

            <div className="stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
              <div className="stat">
                <small>Contract Value</small>
                <b>{INR(party.party.total_contract_value)}</b>
              </div>
              <div className="stat">
                <small>Received</small>
                <b style={{ color: '#16a34a' }}>{INR(party.party.total_received)}</b>
              </div>
              <div className="stat">
                <small>Pending</small>
                <b style={{ color: '#dc2626' }}>{INR(party.party.total_pending)}</b>
              </div>
              {!isSupervisor && (
                <>
                  <div className="stat">
                    <small>Total Party Expense</small>
                    <b style={{ color: '#b45309' }}>{INR(party.party.total_expense)}</b>
                  </div>
                  <div className="stat" style={{ background: Number(party.party.total_profit) >= 0 ? '#f0fdf4' : '#fef2f2' }}>
                    <small style={{ color: Number(party.party.total_profit) >= 0 ? '#166534' : '#991b1b' }}>Net Profit</small>
                    <b style={{ color: Number(party.party.total_profit) >= 0 ? '#16a34a' : '#dc2626' }}>
                      {INR(party.party.total_profit)}
                    </b>
                  </div>
                </>
              )}
              <div className="stat">
                <small>Projects</small>
                <b>{party.projects.length}</b>
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Project</th>
                <th>Contract Value</th>
                <th>Received</th>
                <th>Pending</th>
                {!isSupervisor && <th>Total Expense</th>}
                {!isSupervisor && <th>Profit / Loss</th>}
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {party.projects.map((p) => (
                <tr key={p.id}>
                  <td>
                    <b>{p.name}</b>
                    <br />
                    <span style={{ fontSize: 11, color: '#64748b' }}>{p.site_address || 'No site address'}</span>
                  </td>
                  <td>{INR(p.contract_value)}</td>
                  <td style={{ color: '#16a34a' }}>{INR(p.received)}</td>
                  <td style={{ color: '#dc2626' }}>{INR(p.pending)}</td>
                  {!isSupervisor && <td style={{ fontWeight: 600, color: '#b45309' }}>{INR(p.total_expense)}</td>}
                  {!isSupervisor && (
                    <td style={{ fontWeight: 700, color: Number(p.profit_or_loss) >= 0 ? '#16a34a' : '#dc2626' }}>
                      {INR(p.profit_or_loss)}
                    </td>
                  )}
                  <td>
                    <span className={`badge ${p.status === 'completed' ? 'badge-completed' : 'badge-active'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="actions" style={{ justifyContent: 'flex-end' }}>
                    <button onClick={() => showProject(p.id)}>Overview</button>
                    <button
                      className="muted"
                      onClick={() => {
                        setProjectForm(p);
                        setScreen('projectForm');
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {party.projects.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No projects found for this party.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}

      {/* ── 4. ADD/EDIT PROJECT FORM ───────────────────────────────────────── */}
      {screen === 'projectForm' && (
        <form onSubmit={saveProject}>
          <h3>{projectForm.id ? 'Edit' : 'Add'} Project</h3>
          <div className="grid">
            <Input label="Project Name" name="name" value={projectForm.name} set={setProjectForm} required />
            <Input label="Site Address" name="site_address" value={projectForm.site_address} set={setProjectForm} />
            <Input label="Start Date" name="start_date" type="date" value={projectForm.start_date} set={setProjectForm} required />
            <Input label="Expected End Date" name="expected_end_date" type="date" value={projectForm.expected_end_date} set={setProjectForm} />
            <Input label="Contract Value (₹)" name="contract_value" type="number" step="any" min="0" value={projectForm.contract_value} set={setProjectForm} required />
            <Input label="Built-up Area (sq ft)" name="built_up_area" type="number" step="any" min="0" value={projectForm.built_up_area} set={setProjectForm} />
            <label>
              <small style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: '#475569' }}>Status</small>
              <select
                value={projectForm.status || 'running'}
                onChange={(e) => setProjectForm((p) => ({ ...p, status: e.target.value }))}
              >
                <option value="running">Running</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
              </select>
            </label>
          </div>
          <p style={{ marginTop: 14 }}>
            <button type="submit">Save Project</button>
          </p>
        </form>
      )}

      {/* ── 5. PROJECT OVERVIEW & ALL PHASE 1, 2, 3 TABS ────────────────────── */}
      {screen === 'project' && project && (
        <>
          {/* Project Summary Cards */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 20 }}>{project.name}</h3>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
                  Party: <b>{project.party_name}</b> &bull; Site: {project.site_address || 'No address'} &bull; Status: <b>{project.status}</b> &bull; Running: <b>{project.days_running || 0} days</b>
                </p>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  className="muted"
                  onClick={() => {
                    setProjectForm(project);
                    setScreen('projectForm');
                  }}
                >
                  Edit Project
                </button>
              </div>
            </div>

            {/* Financial Overview Cards */}
            <div className="stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
              <div className="stat">
                <small>Contract Value</small>
                <b>{INR(project.contract_value)}</b>
              </div>
              <div className="stat">
                <small>Received from Party</small>
                <b style={{ color: '#16a34a' }}>{INR(project.received)}</b>
              </div>
              <div className="stat">
                <small>Pending from Party</small>
                <b style={{ color: '#dc2626' }}>{INR(project.pending)}</b>
              </div>
              {!isSupervisor && (
                <>
                  <div className="stat">
                    <small>Total Labour Cost</small>
                    <b>{INR(project.total_labour_cost)}</b>
                  </div>
                  <div className="stat">
                    <small>Total Material Cost</small>
                    <b style={{ color: '#0369a1' }}>{INR(project.total_material_cost)}</b>
                    <span style={{ fontSize: 10, color: '#64748b', display: 'block', marginTop: 2 }}>
                      Dir: {INR(project.direct_material_cost)} | Ven: {INR(project.total_vendor_material_cost)}
                    </span>
                  </div>
                  <div className="stat">
                    <small>Other Expenses</small>
                    <b>{INR(project.total_other_expenses)}</b>
                  </div>
                  <div className="stat">
                    <small>Total Project Expense</small>
                    <b style={{ color: '#b45309' }}>{INR(project.total_expense)}</b>
                  </div>
                  <div className="stat">
                    <small>Paid to Vendors</small>
                    <b style={{ color: '#ea580c' }}>{INR(project.total_paid_to_vendors)}</b>
                  </div>
                  <div className="stat" style={{ background: Number(project.profit_or_loss ?? project.profit_so_far) >= 0 ? '#f0fdf4' : '#fef2f2', border: `1px solid ${Number(project.profit_or_loss ?? project.profit_so_far) >= 0 ? '#bbf7d0' : '#fecaca'}` }}>
                    <small style={{ color: Number(project.profit_or_loss ?? project.profit_so_far) >= 0 ? '#166534' : '#991b1b' }}>Profit So Far</small>
                    <b style={{ color: Number(project.profit_or_loss ?? project.profit_so_far) >= 0 ? '#16a34a' : '#dc2626' }}>
                      {INR(project.profit_or_loss ?? project.profit_so_far)}
                    </b>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Subtabs Navigation */}
          {!selectedVendor ? (
            <>
              <div className="subtabs">
                <button
                  className={projectTab === 'materials' ? 'active' : ''}
                  onClick={() => setProjectTab('materials')}
                >
                  📦 Materials &amp; Stock
                </button>
                <button
                  className={projectTab === 'expenses' ? 'active' : ''}
                  onClick={() => setProjectTab('expenses')}
                >
                  🧾 Other Expenses
                </button>
                <button
                  className={projectTab === 'vendors' ? 'active' : ''}
                  onClick={() => setProjectTab('vendors')}
                >
                  👷 Vendors ({projectVendors.length})
                </button>
                <button
                  className={projectTab === 'attendance' ? 'active' : ''}
                  onClick={() => setProjectTab('attendance')}
                >
                  📅 Daily Attendance
                </button>
                {!isSupervisor && (
                  <>
                    <button
                      className={projectTab === 'payments' ? 'active' : ''}
                      onClick={() => setProjectTab('payments')}
                    >
                      💸 Vendor Payments
                    </button>
                    <button
                      className={projectTab === 'party_payments' ? 'active' : ''}
                      onClick={() => setProjectTab('party_payments')}
                    >
                      🏦 Party Payments ({partyPayments.length})
                    </button>
                  </>
                )}
              </div>

              {/* ── TAB: MATERIALS & STOCK (PHASE 3) ────────────────────────── */}
              {projectTab === 'materials' && (
                <div>
                  {/* Action Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        className={materialsSubTab === 'stock' ? 'active-btn' : 'muted'}
                        onClick={() => setMaterialsSubTab('stock')}
                      >
                        Stock Summary ({stockRows.length})
                      </button>
                      <button
                        className={materialsSubTab === 'received' ? 'active-btn' : 'muted'}
                        onClick={() => setMaterialsSubTab('received')}
                      >
                        Received History ({receivedRows.length})
                      </button>
                      <button
                        className={materialsSubTab === 'used' ? 'active-btn' : 'muted'}
                        onClick={() => setMaterialsSubTab('used')}
                      >
                        Usage History ({usedRows.length})
                      </button>
                      <button
                        className={materialsSubTab === 'adjustments' ? 'active-btn' : 'muted'}
                        onClick={() => setMaterialsSubTab('adjustments')}
                      >
                        Adjustments ({adjustmentRows.length})
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <button
                        onClick={() => {
                          setReceivedForm(receivedBlank);
                          setEditingReceivedId(null);
                          setReceivedModal(true);
                        }}
                      >
                        + Material Received
                      </button>
                      <button
                        onClick={() => {
                          setUsedForm(usedBlank);
                          setEditingUsedId(null);
                          setUsedModal(true);
                        }}
                      >
                        - Material Used
                      </button>
                      <button
                        className="muted"
                        onClick={() => {
                          setAdjustmentForm(adjustmentBlank);
                          setEditingAdjId(null);
                          setAdjustmentModal(true);
                        }}
                      >
                        ⚡ Adjustment / Wastage
                      </button>
                      <button
                        className="muted"
                        onClick={() => {
                          setMaterialForm(materialBlank);
                          setAddMaterialModal(true);
                        }}
                      >
                        + Master Material
                      </button>
                    </div>
                  </div>

                  {/* SUBTAB 1: STOCK SUMMARY */}
                  {materialsSubTab === 'stock' && (
                    <table>
                      <thead>
                        <tr>
                          <th>Material</th>
                          <th>Category</th>
                          <th>Unit</th>
                          <th>Received</th>
                          <th>Used</th>
                          <th>Adjusted</th>
                          <th>Current Stock</th>
                          {!isSupervisor && <th>Avg Rate</th>}
                          {!isSupervisor && <th>Stock Value</th>}
                          <th>Status</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stockRows.map((r) => {
                          const isLow = Number(r.stock) <= Number(r.min_stock_level || 0);
                          const isOverUsed = Number(r.stock) < 0;
                          return (
                            <tr key={r.id}>
                              <td>
                                <b>{r.name}</b>
                                {r.min_stock_level > 0 && (
                                  <span style={{ fontSize: 10, color: '#64748b', display: 'block' }}>
                                    Min: {Number(r.min_stock_level).toFixed(2)} {r.unit}
                                  </span>
                                )}
                              </td>
                              <td>{r.category || '—'}</td>
                              <td>{r.unit}</td>
                              <td>{Number(r.received).toFixed(2)}</td>
                              <td>{Number(r.used).toFixed(2)}</td>
                              <td>{Number(r.adjusted).toFixed(2)}</td>
                              <td style={{ fontWeight: 700, color: isOverUsed ? '#dc2626' : '#0f172a' }}>
                                {Number(r.stock).toFixed(2)}
                              </td>
                              {!isSupervisor && <td>{INR(r.average_rate)}</td>}
                              {!isSupervisor && <td style={{ fontWeight: 600 }}>{INR(r.stock_value)}</td>}
                              <td>
                                {isOverUsed ? (
                                  <span className="badge badge-overused">⚠️ Over-used</span>
                                ) : isLow ? (
                                  <span className="badge badge-lowstock">Low Stock</span>
                                ) : (
                                  <span className="badge badge-active">Adequate</span>
                                )}
                              </td>
                              <td className="actions" style={{ justifyContent: 'flex-end' }}>
                                <button
                                  className="muted"
                                  onClick={() => openMaterialTimeline(r)}
                                  title="View running timeline history"
                                >
                                  🔍 Timeline History
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        {stockRows.length === 0 && (
                          <tr>
                            <td colSpan={11} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                              No material records yet for this project. Click &ldquo;+ Material Received&rdquo; to record initial deliveries.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}

                  {/* SUBTAB 2: RECEIVED HISTORY */}
                  {materialsSubTab === 'received' && (
                    <>
                      <div className="bar" style={{ marginBottom: 12, gap: 10, flexWrap: 'wrap' }}>
                        <select
                          value={matFilterId}
                          onChange={(e) => setMatFilterId(e.target.value)}
                          style={{ maxWidth: 200 }}
                        >
                          <option value="">All Materials</option>
                          {materialsMaster.map((m) => (
                            <option value={m.id} key={m.id}>{m.name}</option>
                          ))}
                        </select>
                        <input
                          type="date"
                          value={matFilterFrom}
                          onChange={(e) => setMatFilterFrom(e.target.value)}
                          placeholder="From date"
                        />
                        <input
                          type="date"
                          value={matFilterTo}
                          onChange={(e) => setMatFilterTo(e.target.value)}
                          placeholder="To date"
                        />
                      </div>

                      <table>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Material</th>
                            <th>Supplier / Source</th>
                            <th>Quantity</th>
                            {!isSupervisor && <th>Rate</th>}
                            {!isSupervisor && <th>Total Amount</th>}
                            <th>Challan No</th>
                            <th>Note</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {receivedRows
                            .filter((r) => !matFilterId || String(r.material_id) === matFilterId)
                            .filter((r) => !matFilterFrom || r.received_date >= matFilterFrom)
                            .filter((r) => !matFilterTo || r.received_date <= matFilterTo)
                            .map((r) => (
                              <tr key={r.id}>
                                <td>{r.received_date}</td>
                                <td><b>{r.material_name}</b></td>
                                <td>
                                  {r.supplier_name || '—'}
                                  {r.transfer_in && <span className="badge badge-active" style={{ marginLeft: 4 }}>Transfer In</span>}
                                </td>
                                <td>{Number(r.quantity).toFixed(2)} {r.material_unit}</td>
                                {!isSupervisor && <td>{INR(r.rate)}</td>}
                                {!isSupervisor && <td style={{ fontWeight: 600 }}>{INR(r.amount)}</td>}
                                <td>{r.challan_no || '—'}</td>
                                <td>{r.note || '—'}</td>
                                <td className="actions" style={{ justifyContent: 'flex-end' }}>
                                  <button
                                    className="muted"
                                    onClick={() => {
                                      setEditingReceivedId(r.id);
                                      setReceivedForm({
                                        material_id: String(r.material_id),
                                        quantity: r.quantity,
                                        rate: r.rate,
                                        received_date: r.received_date,
                                        supplier_name: r.supplier_name || '',
                                        challan_no: r.challan_no || '',
                                        note: r.note || '',
                                      });
                                      setReceivedModal(true);
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button className="danger" onClick={() => del('received', r.id)}>
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          {receivedRows.length === 0 && (
                            <tr>
                              <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                                No material received entries.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </>
                  )}

                  {/* SUBTAB 3: USAGE HISTORY */}
                  {materialsSubTab === 'used' && (
                    <>
                      <div className="bar" style={{ marginBottom: 12, gap: 10, flexWrap: 'wrap' }}>
                        <select
                          value={matFilterId}
                          onChange={(e) => setMatFilterId(e.target.value)}
                          style={{ maxWidth: 200 }}
                        >
                          <option value="">All Materials</option>
                          {materialsMaster.map((m) => (
                            <option value={m.id} key={m.id}>{m.name}</option>
                          ))}
                        </select>
                        <input
                          type="date"
                          value={matFilterFrom}
                          onChange={(e) => setMatFilterFrom(e.target.value)}
                        />
                        <input
                          type="date"
                          value={matFilterTo}
                          onChange={(e) => setMatFilterTo(e.target.value)}
                        />
                      </div>

                      <table>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Material</th>
                            <th>Quantity Used</th>
                            <th>Used For</th>
                            <th>Note</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {usedRows
                            .filter((r) => !matFilterId || String(r.material_id) === matFilterId)
                            .filter((r) => !matFilterFrom || r.used_date >= matFilterFrom)
                            .filter((r) => !matFilterTo || r.used_date <= matFilterTo)
                            .map((r) => (
                              <tr key={r.id}>
                                <td>{r.used_date}</td>
                                <td><b>{r.material_name}</b></td>
                                <td style={{ fontWeight: 600 }}>{Number(r.quantity).toFixed(2)} {r.material_unit}</td>
                                <td>{r.used_for || '—'}</td>
                                <td>{r.note || '—'}</td>
                                <td>
                                  {r.over_used && <span className="badge badge-overused">Over-used</span>}
                                </td>
                                <td className="actions" style={{ justifyContent: 'flex-end' }}>
                                  <button
                                    className="muted"
                                    onClick={() => {
                                      setEditingUsedId(r.id);
                                      setUsedForm({
                                        material_id: String(r.material_id),
                                        quantity: r.quantity,
                                        used_date: r.used_date,
                                        used_for: r.used_for || '',
                                        note: r.note || '',
                                      });
                                      setUsedModal(true);
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button className="danger" onClick={() => del('used', r.id)}>
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          {usedRows.length === 0 && (
                            <tr>
                              <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                                No material usage entries yet.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </>
                  )}

                  {/* SUBTAB 4: ADJUSTMENTS HISTORY */}
                  {materialsSubTab === 'adjustments' && (
                    <table>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Material</th>
                          <th>Type</th>
                          <th>Quantity</th>
                          <th>Destination / Details</th>
                          <th>Note</th>
                          <th>Status</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adjustmentRows.map((r) => (
                          <tr key={r.id}>
                            <td>{r.adjustment_date}</td>
                            <td><b>{r.material_name}</b></td>
                            <td>
                              <span className="badge badge-active" style={{ textTransform: 'capitalize' }}>
                                {r.adjustment_type?.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td style={{ fontWeight: 600 }}>{Number(r.quantity).toFixed(2)} {r.material_unit}</td>
                            <td>{r.to_project_name ? `Transfer to: ${r.to_project_name}` : '—'}</td>
                            <td>{r.note || '—'}</td>
                            <td>{r.over_used && <span className="badge badge-overused">Over-used</span>}</td>
                            <td className="actions" style={{ justifyContent: 'flex-end' }}>
                              <button
                                className="muted"
                                onClick={() => {
                                  setEditingAdjId(r.id);
                                  setAdjustmentForm({
                                    material_id: String(r.material_id),
                                    adjustment_type: r.adjustment_type,
                                    quantity: r.quantity,
                                    adjustment_date: r.adjustment_date,
                                    to_project_id: r.to_project_id ? String(r.to_project_id) : '',
                                    note: r.note || '',
                                  });
                                  setAdjustmentModal(true);
                                }}
                              >
                                Edit
                              </button>
                              <button className="danger" onClick={() => del('adjustment', r.id)}>
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                        {adjustmentRows.length === 0 && (
                          <tr>
                            <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                              No adjustments or wastage entries recorded.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* ── TAB: OTHER EXPENSES (PHASE 3) ───────────────────────────── */}
              {projectTab === 'expenses' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <select
                        value={expenseCategoryFilter}
                        onChange={(e) => setExpenseCategoryFilter(e.target.value)}
                        style={{ maxWidth: 220 }}
                      >
                        <option value="">All Categories</option>
                        <option value="transport">Transport</option>
                        <option value="machine_rent">Machine Rent</option>
                        <option value="electricity_water">Electricity &amp; Water</option>
                        <option value="permit">Permits &amp; Approvals</option>
                        <option value="misc">Miscellaneous</option>
                      </select>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                        Total: {INR(expenseSummary.totalAmount)}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setExpenseForm(expenseBlank);
                        setEditingExpenseId(null);
                        setExpenseModal(true);
                      }}
                    >
                      + Record Other Expense
                    </button>
                  </div>

                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Note</th>
                        <th>Recorded By</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenseRows
                        .filter((r) => !expenseCategoryFilter || r.category === expenseCategoryFilter)
                        .map((r) => (
                          <tr key={r.id}>
                            <td>{r.expense_date}</td>
                            <td>
                              <span className="badge badge-active" style={{ textTransform: 'capitalize' }}>
                                {r.category?.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td style={{ fontWeight: 700, color: '#b45309' }}>{INR(r.amount)}</td>
                            <td>{r.note || '—'}</td>
                            <td style={{ fontSize: 11, color: '#64748b' }}>{r.created_by}</td>
                            <td className="actions" style={{ justifyContent: 'flex-end' }}>
                              <button
                                className="muted"
                                onClick={() => {
                                  setEditingExpenseId(r.id);
                                  setExpenseForm({
                                    category: r.category,
                                    amount: r.amount,
                                    expense_date: r.expense_date,
                                    note: r.note || '',
                                  });
                                  setExpenseModal(true);
                                }}
                              >
                                Edit
                              </button>
                              <button className="danger" onClick={() => del('expense', r.id)}>
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      {expenseRows.length === 0 && (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                            No other expenses recorded for this project.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ── TAB 1: VENDORS ON THIS PROJECT ──────────────────────────── */}
              {projectTab === 'vendors' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h4 style={{ margin: 0, fontSize: 16 }}>Project Vendors &amp; Subcontractors</h4>
                    <button onClick={() => setAddVendorModal(true)}>+ Add Vendor to Project</button>
                  </div>

                  <table>
                    <thead>
                      <tr>
                        <th>Vendor</th>
                        <th>Trade</th>
                        <th>Work Description</th>
                        <th>Pay Type</th>
                        <th>Rate / Contract</th>
                        <th>Total Earned</th>
                        {!isSupervisor && <th>Total Paid</th>}
                        {!isSupervisor && <th>Balance Due</th>}
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectVendors.map((pv) => {
                        const isOverpaid = Number(pv.balance_due || 0) < 0;
                        return (
                          <tr key={pv.id}>
                            <td>
                              <b>{pv.vendor_name}</b>
                              <br />
                              <span style={{ fontSize: 11, color: '#64748b' }}>{pv.vendor_phone || '—'}</span>
                            </td>
                            <td>{pv.trade || 'General'}</td>
                            <td>{pv.work_description}</td>
                            <td>
                              <span className="badge badge-active">
                                {pv.pay_type === 'daily_wage' ? 'Daily Wage' : 'Contract'}
                              </span>
                            </td>
                            <td>
                              {pv.pay_type === 'daily_wage' ? `${INR(pv.daily_rate)}/day` : INR(pv.contract_amount)}
                            </td>
                            <td style={{ fontWeight: 600 }}>{INR(pv.total_earned)}</td>
                            {!isSupervisor && <td style={{ color: '#16a34a' }}>{INR(pv.total_paid)}</td>}
                            {!isSupervisor && (
                              <td>
                                <b style={{ color: isOverpaid ? '#dc2626' : '#0f172a' }}>
                                  {INR(pv.balance_due)}
                                </b>
                                {isOverpaid && (
                                  <span className="badge badge-overused" style={{ marginLeft: 4 }}>
                                    ⚠️ Overpaid
                                  </span>
                                )}
                              </td>
                            )}
                            <td>
                              <span className={`badge ${pv.status === 'completed' ? 'badge-completed' : 'badge-active'}`}>
                                {pv.status}
                              </span>
                            </td>
                            <td className="actions" style={{ justifyContent: 'flex-end' }}>
                              <button onClick={() => openVendorDetail(pv)}>View Details &amp; History &rarr;</button>
                            </td>
                          </tr>
                        );
                      })}
                      {projectVendors.length === 0 && (
                        <tr>
                          <td colSpan={10} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                            No vendors assigned to this project yet. Click &ldquo;+ Add Vendor to Project&rdquo; above.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ── TAB 2: DAILY ATTENDANCE ─────────────────────────────────── */}
              {projectTab === 'attendance' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>Attendance Date:</span>
                      <input
                        type="date"
                        value={attendanceDate}
                        onChange={(e) => setAttendanceDate(e.target.value)}
                        style={{ maxWidth: 170 }}
                      />
                    </div>
                    <button onClick={saveAllAttendance} disabled={savingAttendance}>
                      {savingAttendance ? 'Saving...' : '💾 Save Attendance for All'}
                    </button>
                  </div>

                  <table>
                    <thead>
                      <tr>
                        <th>Vendor (Daily Wage)</th>
                        <th>Trade</th>
                        <th>Status</th>
                        <th>Workers Count</th>
                        <th>Rate / Worker</th>
                        <th>Wage Amount</th>
                        <th>Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceRows.map((row, idx) => (
                        <tr key={row.project_vendor_id}>
                          <td><b>{row.vendor_name}</b></td>
                          <td>{row.trade || '—'}</td>
                          <td>
                            <div style={{ display: 'flex', gap: 4 }}>
                              {['present', 'half_day', 'absent'].map((st) => (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => {
                                    const next = [...attendanceRows];
                                    next[idx].status = st;
                                    const mult = st === 'present' ? 1 : st === 'half_day' ? 0.5 : 0;
                                    next[idx].wage_amount = mult * Number(next[idx].workers_count) * Number(next[idx].rate_per_worker);
                                    setAttendanceRows(next);
                                  }}
                                  className={row.status === st ? 'active-btn' : 'muted'}
                                  style={{ padding: '3px 8px', fontSize: 11 }}
                                >
                                  {st === 'present' ? 'Present' : st === 'half_day' ? 'Half Day' : 'Absent'}
                                </button>
                              ))}
                            </div>
                          </td>
                          <td>
                            <input
                              type="number"
                              min="0.5"
                              step="0.5"
                              value={row.workers_count}
                              onChange={(e) => {
                                const next = [...attendanceRows];
                                next[idx].workers_count = e.target.value;
                                const mult = row.status === 'present' ? 1 : row.status === 'half_day' ? 0.5 : 0;
                                next[idx].wage_amount = mult * Number(e.target.value) * Number(row.rate_per_worker);
                                setAttendanceRows(next);
                              }}
                              style={{ width: 70 }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              min="0"
                              value={row.rate_per_worker}
                              onChange={(e) => {
                                const next = [...attendanceRows];
                                next[idx].rate_per_worker = e.target.value;
                                const mult = row.status === 'present' ? 1 : row.status === 'half_day' ? 0.5 : 0;
                                next[idx].wage_amount = mult * Number(row.workers_count) * Number(e.target.value);
                                setAttendanceRows(next);
                              }}
                              style={{ width: 90 }}
                            />
                          </td>
                          <td style={{ fontWeight: 700, color: '#16a34a' }}>
                            {INR(row.wage_amount)}
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="Note..."
                              value={row.note}
                              onChange={(e) => {
                                const next = [...attendanceRows];
                                next[idx].note = e.target.value;
                                setAttendanceRows(next);
                              }}
                              style={{ width: 140 }}
                            />
                          </td>
                        </tr>
                      ))}
                      {attendanceRows.length === 0 && (
                        <tr>
                          <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                            No daily-wage vendors assigned to this project. Assign a daily wage vendor under the &ldquo;Vendors&rdquo; tab.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ── TAB 3: VENDOR PAYMENTS ───────────────────────────────────── */}
              {projectTab === 'payments' && !isSupervisor && (
                <div>
                  <form onSubmit={saveVendorPayment} className="card" style={{ marginBottom: 16 }}>
                    <h4 style={{ margin: '0 0 12px', fontSize: 15 }}>Record Vendor Payment</h4>
                    <div className="grid">
                      <label>
                        <small style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: '#475569' }}>Vendor</small>
                        <select
                          required
                          value={vendorPaymentForm.project_vendor_id}
                          onChange={(e) => setVendorPaymentForm({ ...vendorPaymentForm, project_vendor_id: e.target.value })}
                        >
                          <option value="">Select Vendor</option>
                          {projectVendors.map((pv) => (
                            <option value={pv.id} key={pv.id}>
                              {pv.vendor_name} ({pv.pay_type === 'daily_wage' ? 'Daily Wage' : 'Contract'}) &bull; Due: {INR(pv.balance_due)}
                            </option>
                          ))}
                        </select>
                      </label>
                      <Input label="Amount (₹)" name="amount" type="number" step="any" min="1" value={vendorPaymentForm.amount} set={setVendorPaymentForm} required />
                      <Input label="Payment Date" name="payment_date" type="date" value={vendorPaymentForm.payment_date} set={setVendorPaymentForm} required />
                      <label>
                        <small style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: '#475569' }}>Payment Mode</small>
                        <select
                          value={vendorPaymentForm.mode}
                          onChange={(e) => setVendorPaymentForm({ ...vendorPaymentForm, mode: e.target.value })}
                        >
                          <option value="bank">Bank Transfer</option>
                          <option value="cash">Cash</option>
                          <option value="cheque">Cheque</option>
                          <option value="upi">UPI</option>
                        </select>
                      </label>
                      <label>
                        <small style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: '#475569' }}>Payment Type</small>
                        <select
                          value={vendorPaymentForm.payment_type}
                          onChange={(e) => setVendorPaymentForm({ ...vendorPaymentForm, payment_type: e.target.value })}
                        >
                          <option value="labour">Labour</option>
                          <option value="advance">Advance</option>
                          <option value="material">Material</option>
                          <option value="contract">Contract</option>
                        </select>
                      </label>
                      <Input label="Note / Transaction Ref" name="note" value={vendorPaymentForm.note} set={setVendorPaymentForm} />
                    </div>
                    <p style={{ marginTop: 12, textAlign: 'right' }}>
                      <button type="submit">Record Payment</button>
                    </p>
                  </form>

                  {/* Payment Filters */}
                  <div className="bar" style={{ marginBottom: 12, gap: 10, flexWrap: 'wrap' }}>
                    <select
                      value={vPayFilterVendor}
                      onChange={(e) => setVPayFilterVendor(e.target.value)}
                      style={{ maxWidth: 200 }}
                    >
                      <option value="">All Vendors</option>
                      {projectVendors.map((pv) => (
                        <option value={pv.id} key={pv.id}>{pv.vendor_name}</option>
                      ))}
                    </select>
                    <select
                      value={vPayFilterType}
                      onChange={(e) => setVPayFilterType(e.target.value)}
                      style={{ maxWidth: 160 }}
                    >
                      <option value="">All Types</option>
                      <option value="advance">Advance</option>
                      <option value="labour">Labour</option>
                      <option value="material">Material</option>
                      <option value="contract">Contract</option>
                    </select>
                    <input
                      type="date"
                      value={vPayFilterFrom}
                      onChange={(e) => setVPayFilterFrom(e.target.value)}
                      placeholder="From Date"
                    />
                    <input
                      type="date"
                      value={vPayFilterTo}
                      onChange={(e) => setVPayFilterTo(e.target.value)}
                      placeholder="To Date"
                    />
                  </div>

                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Vendor</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Mode</th>
                        <th>Note</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendorPaymentsList.map((p) => (
                        <tr key={p.id}>
                          <td>{p.payment_date}</td>
                          <td><b>{p.vendor_name}</b></td>
                          <td>
                            <span className="badge badge-active" style={{ textTransform: 'capitalize' }}>
                              {p.payment_type}
                            </span>
                          </td>
                          <td style={{ fontWeight: 700, color: '#16a34a' }}>{INR(p.amount)}</td>
                          <td style={{ textTransform: 'uppercase', fontSize: 11 }}>{p.mode}</td>
                          <td>{p.note || '—'}</td>
                          <td className="actions" style={{ justifyContent: 'flex-end' }}>
                            <button className="danger" onClick={() => del('vendorPayment', p.id)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {vendorPaymentsList.length === 0 && (
                        <tr>
                          <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                            No vendor payments recorded yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ── TAB 4: PARTY PAYMENTS ───────────────────────────────────── */}
              {projectTab === 'party_payments' && !isSupervisor && (
                <div>
                  <form onSubmit={savePartyPayment} className="card" style={{ marginBottom: 16 }}>
                    <h4 style={{ margin: '0 0 12px', fontSize: 15 }}>Record Party Payment (Client Receipts)</h4>
                    <div className="grid">
                      <Input label="Amount (₹)" name="amount" type="number" step="any" min="1" value={partyPaymentForm.amount} set={setPartyPaymentForm} required />
                      <Input label="Date" name="payment_date" type="date" value={partyPaymentForm.payment_date} set={setPartyPaymentForm} required />
                      <label>
                        <small style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: '#475569' }}>Mode</small>
                        <select
                          value={partyPaymentForm.mode}
                          onChange={(e) => setPartyPaymentForm((f) => ({ ...f, mode: e.target.value }))}
                        >
                          <option value="bank">Bank Transfer</option>
                          <option value="cheque">Cheque</option>
                          <option value="cash">Cash</option>
                          <option value="upi">UPI</option>
                        </select>
                      </label>
                      <Input label="Note / Reference" name="note" value={partyPaymentForm.note} set={setPartyPaymentForm} />
                    </div>
                    <p style={{ marginTop: 12, textAlign: 'right' }}>
                      <button type="submit">Record Payment</button>
                    </p>
                  </form>

                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Mode</th>
                        <th>Note</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {partyPayments.map((p) => (
                        <tr key={p.id}>
                          <td>{p.payment_date}</td>
                          <td style={{ fontWeight: 700, color: '#16a34a' }}>{INR(p.amount)}</td>
                          <td style={{ textTransform: 'uppercase', fontSize: 11 }}>{p.mode}</td>
                          <td>{p.note || '—'}</td>
                          <td className="actions" style={{ justifyContent: 'flex-end' }}>
                            <button className="danger" onClick={() => del('partyPayment', p.id)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {partyPayments.length === 0 && (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                            No party payments recorded yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            /* ── VENDOR DETAIL SCREEN (ATTENDANCE CALENDAR & MATERIAL HISTORY) ── */
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <button className="muted" onClick={() => setSelectedVendor(null)}>
                  &larr; Back to Project Overview
                </button>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setSupplyModal(true)}>
                    + Record Material Supply
                  </button>
                </div>
              </div>

              <div className="card" style={{ marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 18 }}>{selectedVendor.vendor_name}</h3>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
                  Trade: <b>{selectedVendor.trade}</b> &bull; Work: {selectedVendor.work_description} &bull; Type: <b>{selectedVendor.pay_type}</b>
                </p>
                <div className="stats" style={{ marginTop: 12 }}>
                  <div className="stat">
                    <small>Total Earned</small>
                    <b>{INR(selectedVendor.total_earned)}</b>
                  </div>
                  {!isSupervisor && (
                    <>
                      <div className="stat">
                        <small>Total Paid</small>
                        <b style={{ color: '#16a34a' }}>{INR(selectedVendor.total_paid)}</b>
                      </div>
                      <div className="stat">
                        <small>Balance Due</small>
                        <b style={{ color: selectedVendor.balance_due < 0 ? '#dc2626' : '#0f172a' }}>
                          {INR(selectedVendor.balance_due)}
                        </b>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Monthly Attendance Calendar */}
              {selectedVendor.pay_type === 'daily_wage' && (
                <div className="card" style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h4 style={{ margin: 0, fontSize: 15 }}>Attendance Calendar</h4>
                    <input
                      type="month"
                      value={calendarMonth}
                      onChange={(e) => {
                        setCalendarMonth(e.target.value);
                        api(`/api/admin/project-management/attendance?projectVendorId=${selectedVendor.id}&month=${e.target.value}`)
                          .then((r) => setVendorAttendanceHistory(r.data || []))
                          .catch(() => {});
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: 14, marginBottom: 12, fontSize: 12 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 12, height: 12, background: '#22c55e', borderRadius: 2 }} /> Present (1.0)
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 12, height: 12, background: '#eab308', borderRadius: 2 }} /> Half Day (0.5)
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 12, height: 12, background: '#ef4444', borderRadius: 2 }} /> Absent (0.0)
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(65px, 1fr))', gap: 6 }}>
                    {Array.from({ length: 31 }).map((_, i) => {
                      const dayStr = String(i + 1).padStart(2, '0');
                      const dKey = `${calendarMonth}-${dayStr}`;
                      const match = vendorAttendanceHistory.find((a) => a.attendance_date?.slice(0, 10) === dKey);
                      let bg = '#f8fafc';
                      let color = '#94a3b8';
                      if (match) {
                        if (match.status === 'present') { bg = '#dcfce7'; color = '#15803d'; }
                        else if (match.status === 'half_day') { bg = '#fef9c3'; color = '#a16207'; }
                        else if (match.status === 'absent') { bg = '#fee2e2'; color = '#b91c1c'; }
                      }
                      return (
                        <div
                          key={dKey}
                          style={{
                            background: bg,
                            color,
                            padding: '8px 4px',
                            textAlign: 'center',
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 700,
                            border: '1px solid #e2e8f0',
                          }}
                        >
                          <div>{i + 1}</div>
                          <div style={{ fontSize: 9, marginTop: 2 }}>{match ? match.status : '—'}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Vendor Material Supply History */}
              <div className="card" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h4 style={{ margin: 0, fontSize: 15 }}>Material Supply History</h4>
                  <button onClick={() => setSupplyModal(true)}>+ Add Supply</button>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Item Name</th>
                      <th>Quantity</th>
                      <th>Unit</th>
                      <th>Rate</th>
                      <th>Amount</th>
                      <th>Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendorMaterialHistory.map((m) => (
                      <tr key={m.id}>
                        <td>{m.supply_date}</td>
                        <td><b>{m.item_name}</b></td>
                        <td>{m.quantity}</td>
                        <td>{m.unit}</td>
                        <td>{INR(m.rate)}</td>
                        <td style={{ fontWeight: 700, color: '#16a34a' }}>{INR(m.amount)}</td>
                        <td>{m.note || '—'}</td>
                      </tr>
                    ))}
                    {vendorMaterialHistory.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b' }}>
                          No materials recorded for this vendor.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Vendor Payment History */}
              {!isSupervisor && (
                <div className="card">
                  <h4 style={{ margin: '0 0 12px', fontSize: 15 }}>Payment History</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Mode</th>
                        <th>Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendorPaymentsHistory.map((p) => (
                        <tr key={p.id}>
                          <td>{p.payment_date}</td>
                          <td><span className="badge badge-active">{p.payment_type}</span></td>
                          <td style={{ fontWeight: 700, color: '#16a34a' }}>{INR(p.amount)}</td>
                          <td>{p.mode}</td>
                          <td>{p.note || '—'}</td>
                        </tr>
                      ))}
                      {vendorPaymentsHistory.length === 0 && (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b' }}>
                            No payments recorded yet for this vendor.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── MODAL: ASSIGN VENDOR ────────────────────────────────────────── */}
          {addVendorModal && (
            <div className="modal-overlay">
              <form onSubmit={assignVendorToProject} className="modal-card">
                <h3 style={{ margin: '0 0 12px', fontSize: 17, color: '#0f172a' }}>
                  Add Vendor to Project
                </h3>

                <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                  <button
                    type="button"
                    className={vendorMode === 'existing' ? 'active-btn' : 'muted'}
                    onClick={() => setVendorMode('existing')}
                  >
                    Select Existing Vendor
                  </button>
                  <button
                    type="button"
                    className={vendorMode === 'new' ? 'active-btn' : 'muted'}
                    onClick={() => setVendorMode('new')}
                  >
                    + Create New Vendor
                  </button>
                </div>

                {vendorMode === 'existing' ? (
                  <div style={{ marginBottom: 12 }}>
                    <label>
                      <small style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: '#475569' }}>Vendor</small>
                      <select
                        required
                        value={assignForm.vendor_id}
                        onChange={(e) => setAssignForm({ ...assignForm, vendor_id: e.target.value })}
                      >
                        <option value="">Select Vendor</option>
                        {allVendorsMaster.map((v) => (
                          <option value={v.id} key={v.id}>
                            {v.name} ({v.trade || 'General'})
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                    <Input label="Vendor Name" name="new_vendor_name" value={assignForm.new_vendor_name} set={setAssignForm} required />
                    <Input label="Phone" name="new_vendor_phone" value={assignForm.new_vendor_phone} set={setAssignForm} />
                    <Input label="Trade (e.g. Mason, Electrician)" name="new_vendor_trade" value={assignForm.new_vendor_trade} set={setAssignForm} />
                    <Input label="Address" name="new_vendor_address" value={assignForm.new_vendor_address} set={setAssignForm} />
                  </div>
                )}

                <div style={{ marginBottom: 12 }}>
                  <Input label="Work Description" name="work_description" value={assignForm.work_description} set={setAssignForm} required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                  <label>
                    <small style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: '#475569' }}>Pay Type</small>
                    <select
                      value={assignForm.pay_type}
                      onChange={(e) => setAssignForm({ ...assignForm, pay_type: e.target.value })}
                    >
                      <option value="daily_wage">Daily Wage</option>
                      <option value="contract">Fixed Contract</option>
                    </select>
                  </label>

                  {assignForm.pay_type === 'daily_wage' ? (
                    <Input label="Daily Rate (₹/day)" name="daily_rate" type="number" value={assignForm.daily_rate} set={setAssignForm} required min="0" />
                  ) : (
                    <Input label="Total Contract Amount (₹)" name="contract_amount" type="number" value={assignForm.contract_amount} set={setAssignForm} required min="0" />
                  )}
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
                  <button type="button" className="muted" onClick={() => setAddVendorModal(false)}>
                    Cancel
                  </button>
                  <button type="submit">Assign Vendor</button>
                </div>
              </form>
            </div>
          )}

          {/* ── MODAL: RECORD VENDOR MATERIAL SUPPLY ────────────────────────── */}
          {supplyModal && selectedVendor && (
            <div className="modal-overlay">
              <form onSubmit={saveMaterialSupply} className="modal-card">
                <h3 style={{ margin: '0 0 14px', fontSize: 17, color: '#0f172a' }}>
                  Record Vendor Material Supply
                </h3>
                <p style={{ margin: '0 0 12px', fontSize: 12, color: '#64748b' }}>
                  Vendor: <strong>{selectedVendor.vendor_name}</strong>
                </p>

                <div className="grid">
                  <Input label="Item Name (e.g. Red Bricks, Sand)" name="item_name" value={supplyForm.item_name} set={setSupplyForm} required />
                  <Input label="Unit (e.g. cft, pcs, bags)" name="unit" value={supplyForm.unit} set={setSupplyForm} required />
                  <Input label="Quantity" name="quantity" type="number" step="any" min="0.01" value={supplyForm.quantity} set={setSupplyForm} required />
                  <Input label="Rate (₹)" name="rate" type="number" step="any" min="0" value={supplyForm.rate} set={setSupplyForm} required />
                  <Input label="Supply Date" name="supply_date" type="date" value={supplyForm.supply_date} set={setSupplyForm} required />

                  <label>
                    <small style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: '#475569' }}>
                      Link to Master Material (Optional)
                    </small>
                    <select
                      value={supplyForm.material_id}
                      onChange={(e) => setSupplyForm({ ...supplyForm, material_id: e.target.value })}
                    >
                      <option value="">None (Vendor Supply Only)</option>
                      {materialsMaster.map((m) => (
                        <option value={m.id} key={m.id}>
                          {m.name} ({m.unit})
                        </option>
                      ))}
                    </select>
                  </label>
                  <Input label="Note" name="note" value={supplyForm.note} set={setSupplyForm} />
                </div>

                <div style={{ marginTop: 12, textAlign: 'right', fontWeight: 700 }}>
                  Estimated Total: {INR(Number(supplyForm.quantity || 0) * Number(supplyForm.rate || 0))}
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
                  <button type="button" className="muted" onClick={() => setSupplyModal(false)}>
                    Cancel
                  </button>
                  <button type="submit">Save Supply</button>
                </div>
              </form>
            </div>
          )}

          {/* ── MODAL: CREATE MASTER MATERIAL ───────────────────────────────── */}
          {addMaterialModal && (
            <div className="modal-overlay">
              <form onSubmit={saveMaterialMaster} className="modal-card">
                <h3 style={{ margin: '0 0 14px', fontSize: 17, color: '#0f172a' }}>
                  Add Master Material
                </h3>
                <div className="grid">
                  <Input label="Material Name" name="name" value={materialForm.name} set={setMaterialForm} required placeholder="e.g. Cement 53 Grade" />
                  <Input label="Unit" name="unit" value={materialForm.unit} set={setMaterialForm} required placeholder="e.g. bags, tons, kg, cft" />
                  <Input label="Category" name="category" value={materialForm.category} set={setMaterialForm} placeholder="e.g. Civil, Electrical, Plumbing" />
                  <Input label="Min Stock Alert Level" name="min_stock_level" type="number" step="any" min="0" value={materialForm.min_stock_level} set={setMaterialForm} />
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
                  <button type="button" className="muted" onClick={() => setAddMaterialModal(false)}>
                    Cancel
                  </button>
                  <button type="submit">Create Material</button>
                </div>
              </form>
            </div>
          )}

          {/* ── MODAL: MATERIAL RECEIVED ────────────────────────────────────── */}
          {receivedModal && (
            <div className="modal-overlay">
              <form onSubmit={saveReceivedEntry} className="modal-card">
                <h3 style={{ margin: '0 0 14px', fontSize: 17, color: '#0f172a' }}>
                  {editingReceivedId ? 'Edit' : 'Record'} Material Received
                </h3>
                <div className="grid">
                  <label>
                    <small style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: '#475569' }}>
                      Material <span style={{ color: '#ef4444' }}>*</span>
                    </small>
                    <select
                      required
                      value={receivedForm.material_id}
                      onChange={(e) => setReceivedForm({ ...receivedForm, material_id: e.target.value })}
                    >
                      <option value="">Select Material</option>
                      {materialsMaster.map((m) => (
                        <option value={m.id} key={m.id}>{m.name} ({m.unit})</option>
                      ))}
                    </select>
                  </label>
                  <Input label="Quantity" name="quantity" type="number" step="any" min="0.001" value={receivedForm.quantity} set={setReceivedForm} required />
                  {!isSupervisor && (
                    <Input label="Rate (₹ per unit)" name="rate" type="number" step="any" min="0" value={receivedForm.rate} set={setReceivedForm} required />
                  )}
                  <Input label="Received Date" name="received_date" type="date" value={receivedForm.received_date} set={setReceivedForm} required />
                  <Input label="Supplier / Vendor Name" name="supplier_name" value={receivedForm.supplier_name} set={setReceivedForm} placeholder="e.g. Ultratech Distributor" />
                  <Input label="Challan / Invoice No." name="challan_no" value={receivedForm.challan_no} set={setReceivedForm} />
                  <Input label="Note" name="note" value={receivedForm.note} set={setReceivedForm} />
                </div>
                {!isSupervisor && (
                  <div style={{ marginTop: 12, textAlign: 'right', fontWeight: 700 }}>
                    Total Amount: {INR(Number(receivedForm.quantity || 0) * Number(receivedForm.rate || 0))}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
                  <button type="button" className="muted" onClick={() => setReceivedModal(false)}>
                    Cancel
                  </button>
                  <button type="submit">Save Received Entry</button>
                </div>
              </form>
            </div>
          )}

          {/* ── MODAL: MATERIAL USED ────────────────────────────────────────── */}
          {usedModal && (
            <div className="modal-overlay">
              <form onSubmit={saveUsedEntry} className="modal-card">
                <h3 style={{ margin: '0 0 14px', fontSize: 17, color: '#0f172a' }}>
                  {editingUsedId ? 'Edit' : 'Record'} Material Usage
                </h3>
                <div className="grid">
                  <label>
                    <small style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: '#475569' }}>
                      Material <span style={{ color: '#ef4444' }}>*</span>
                    </small>
                    <select
                      required
                      value={usedForm.material_id}
                      onChange={(e) => setUsedForm({ ...usedForm, material_id: e.target.value })}
                    >
                      <option value="">Select Material</option>
                      {materialsMaster.map((m) => (
                        <option value={m.id} key={m.id}>{m.name} ({m.unit})</option>
                      ))}
                    </select>
                  </label>
                  <Input label="Quantity Used" name="quantity" type="number" step="any" min="0.001" value={usedForm.quantity} set={setUsedForm} required />
                  <Input label="Usage Date" name="used_date" type="date" value={usedForm.used_date} set={setUsedForm} required />
                  <Input label="Used For (e.g. Foundation, Slab, Plaster)" name="used_for" value={usedForm.used_for} set={setUsedForm} placeholder="e.g. 1st Floor Slab casting" />
                  <Input label="Note" name="note" value={usedForm.note} set={setUsedForm} />
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
                  <button type="button" className="muted" onClick={() => setUsedModal(false)}>
                    Cancel
                  </button>
                  <button type="submit">Record Usage</button>
                </div>
              </form>
            </div>
          )}

          {/* ── MODAL: ADJUSTMENT / WASTAGE ─────────────────────────────────── */}
          {adjustmentModal && (
            <div className="modal-overlay">
              <form onSubmit={saveAdjustmentEntry} className="modal-card">
                <h3 style={{ margin: '0 0 14px', fontSize: 17, color: '#0f172a' }}>
                  {editingAdjId ? 'Edit' : 'Record'} Material Adjustment / Wastage
                </h3>
                <div className="grid">
                  <label>
                    <small style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: '#475569' }}>
                      Material <span style={{ color: '#ef4444' }}>*</span>
                    </small>
                    <select
                      required
                      value={adjustmentForm.material_id}
                      onChange={(e) => setAdjustmentForm({ ...adjustmentForm, material_id: e.target.value })}
                    >
                      <option value="">Select Material</option>
                      {materialsMaster.map((m) => (
                        <option value={m.id} key={m.id}>{m.name} ({m.unit})</option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <small style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: '#475569' }}>
                      Adjustment Type <span style={{ color: '#ef4444' }}>*</span>
                    </small>
                    <select
                      value={adjustmentForm.adjustment_type}
                      onChange={(e) => setAdjustmentForm({ ...adjustmentForm, adjustment_type: e.target.value })}
                    >
                      <option value="wastage">Wastage</option>
                      <option value="damage">Damage</option>
                      <option value="return_to_supplier">Return to Supplier</option>
                      <option value="transfer_out">Transfer to Another Project</option>
                    </select>
                  </label>

                  <Input label="Quantity" name="quantity" type="number" step="any" min="0.001" value={adjustmentForm.quantity} set={setAdjustmentForm} required />
                  <Input label="Adjustment Date" name="adjustment_date" type="date" value={adjustmentForm.adjustment_date} set={setAdjustmentForm} required />

                  {adjustmentForm.adjustment_type === 'transfer_out' && (
                    <label>
                      <small style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: '#475569' }}>
                        Destination Project <span style={{ color: '#ef4444' }}>*</span>
                      </small>
                      <select
                        required
                        value={adjustmentForm.to_project_id}
                        onChange={(e) => setAdjustmentForm({ ...adjustmentForm, to_project_id: e.target.value })}
                      >
                        <option value="">Select Destination Project</option>
                        {allProjectsList
                          .filter((p) => p.id !== project.id)
                          .map((p) => (
                            <option value={p.id} key={p.id}>{p.name}</option>
                          ))}
                      </select>
                    </label>
                  )}

                  <Input label="Note / Reason" name="note" value={adjustmentForm.note} set={setAdjustmentForm} placeholder="e.g. Rain damage during storm" />
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
                  <button type="button" className="muted" onClick={() => setAdjustmentModal(false)}>
                    Cancel
                  </button>
                  <button type="submit">Record Adjustment</button>
                </div>
              </form>
            </div>
          )}

          {/* ── MODAL: OTHER EXPENSE ────────────────────────────────────────── */}
          {expenseModal && (
            <div className="modal-overlay">
              <form onSubmit={saveExpenseEntry} className="modal-card">
                <h3 style={{ margin: '0 0 14px', fontSize: 17, color: '#0f172a' }}>
                  {editingExpenseId ? 'Edit' : 'Record'} Other Expense
                </h3>
                <div className="grid">
                  <label>
                    <small style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: '#475569' }}>
                      Category <span style={{ color: '#ef4444' }}>*</span>
                    </small>
                    <select
                      value={expenseForm.category}
                      onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                    >
                      <option value="transport">Transport</option>
                      <option value="machine_rent">Machine Rent</option>
                      <option value="electricity_water">Electricity &amp; Water</option>
                      <option value="permit">Permits &amp; Approvals</option>
                      <option value="misc">Miscellaneous</option>
                    </select>
                  </label>
                  <Input label="Amount (₹)" name="amount" type="number" step="any" min="1" value={expenseForm.amount} set={setExpenseForm} required />
                  <Input label="Expense Date" name="expense_date" type="date" value={expenseForm.expense_date} set={setExpenseForm} required />
                  <Input label="Note / Details" name="note" value={expenseForm.note} set={setExpenseForm} placeholder="e.g. Generator diesel 50L" />
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
                  <button type="button" className="muted" onClick={() => setExpenseModal(false)}>
                    Cancel
                  </button>
                  <button type="submit">Save Expense</button>
                </div>
              </form>
            </div>
          )}

          {/* ── DRAWER / MODAL: MATERIAL DETAIL TIMELINE ────────────────────── */}
          {timelineMaterial && (
            <div className="modal-overlay">
              <div className="modal-card" style={{ maxWidth: 760, maxHeight: '85vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 18, color: '#0f172a' }}>
                      {timelineMaterial.name} &bull; Timeline History
                    </h3>
                    <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 12 }}>
                      Category: <b>{timelineMaterial.category || 'General'}</b> &bull; Unit: <b>{timelineMaterial.unit}</b> &bull; Min Level: <b>{timelineMaterial.min_stock_level}</b>
                    </p>
                  </div>
                  <button className="muted" onClick={() => setTimelineMaterial(null)} style={{ fontSize: 16 }}>
                    &times;
                  </button>
                </div>

                <div className="card" style={{ background: timelineStock < 0 ? '#fef2f2' : '#f0fdf4', marginBottom: 14, padding: 12 }}>
                  <span style={{ fontSize: 12, color: timelineStock < 0 ? '#991b1b' : '#166534', fontWeight: 600 }}>
                    Current Stock Balance
                  </span>
                  <div style={{ fontSize: 22, fontWeight: 900, color: timelineStock < 0 ? '#dc2626' : '#16a34a' }}>
                    {timelineStock} {timelineMaterial.unit}
                    {timelineStock < 0 && <span className="badge badge-overused" style={{ marginLeft: 8, fontSize: 11 }}>Over-used</span>}
                  </div>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Details</th>
                      <th>Quantity</th>
                      <th>Running Stock</th>
                      {!isSupervisor && <th>Rate / Cost</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {timelineData.map((tx) => {
                      const isPlus = tx.type === 'received';
                      return (
                        <tr key={`${tx.type}-${tx.id}`}>
                          <td>{tx.tx_date}</td>
                          <td>
                            <span className={`badge ${isPlus ? 'badge-completed' : tx.type === 'used' ? 'badge-active' : 'badge-overused'}`}>
                              {tx.type === 'received' ? 'Received' : tx.type === 'used' ? 'Used' : tx.adjustment_type || 'Adjusted'}
                            </span>
                          </td>
                          <td style={{ fontSize: 12 }}>
                            {tx.type === 'received' && (tx.supplier_name || 'Direct Receipt')}
                            {tx.type === 'used' && (tx.used_for ? `Used for: ${tx.used_for}` : 'Site Usage')}
                            {tx.type === 'adjustment' && (tx.to_project_name ? `Transfer to ${tx.to_project_name}` : tx.note || 'Adjustment')}
                            {tx.challan_no && <span style={{ color: '#64748b' }}> (Challan: {tx.challan_no})</span>}
                          </td>
                          <td style={{ fontWeight: 700, color: isPlus ? '#16a34a' : '#dc2626' }}>
                            {isPlus ? '+' : ''}{Number(tx.quantity).toFixed(2)}
                          </td>
                          <td style={{ fontWeight: 800 }}>
                            {Number(tx.running_stock).toFixed(2)} {timelineMaterial.unit}
                          </td>
                          {!isSupervisor && (
                            <td>
                              {tx.amount ? INR(tx.amount) : '—'}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                    {timelineData.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b' }}>
                          No transactions recorded for this material.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── 6. REPORTS SCREEN (PHASE 3) ───────────────────────────────────── */}
      {screen === 'reports' && (
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18 }}>Project Management &bull; Reports &amp; Analytics</h3>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 12 }}>
                  Material consumption, site stock across running projects, cost summaries, and vendor balances with CSV export.
                </p>
              </div>

              <a
                href={`/api/admin/project-management/reports?type=${reportType}${reportProjectFilter ? `&projectId=${reportProjectFilter}` : ''}&format=csv`}
                download
                className="active-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 14px',
                  borderRadius: 6,
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                📥 Download CSV
              </a>
            </div>

            {/* Report Type Selector Tabs */}
            <div className="subtabs" style={{ marginTop: 14 }}>
              {[
                { id: 'cost_summary', label: '1. Project Cost Summary' },
                { id: 'material_consumption', label: '2. Material Consumption' },
                { id: 'stock_running', label: '3. Stock Across Running Projects' },
                { id: 'vendor_balance', label: '4. Vendor Balance Summary' },
                { id: 'party_summary', label: '5. Party-wise Contract & Payment' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={reportType === tab.id ? 'active' : ''}
                  onClick={() => setReportType(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Optional Project Filter for consumption report */}
            {reportType === 'material_consumption' && (
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>Filter Project:</span>
                <select
                  value={reportProjectFilter}
                  onChange={(e) => setReportProjectFilter(e.target.value)}
                  style={{ maxWidth: 260 }}
                >
                  <option value="">All Projects</option>
                  {allProjectsList.map((p) => (
                    <option value={p.id} key={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Report Data Table */}
          {loadingReport ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading report data...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  {reportData.headers?.map((h) => (
                    <th key={h.key}>{h.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportData.data?.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {reportData.headers?.map((h) => {
                      const val = row[h.key];
                      const isMoney = String(h.label).includes('(₹)');
                      return (
                        <td key={h.key} style={isMoney ? { fontWeight: 600 } : {}}>
                          {isMoney ? INR(val) : val ?? '—'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {(!reportData.data || reportData.data.length === 0) && (
                  <tr>
                    <td colSpan={reportData.headers?.length || 5} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      No data available for this report.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── COMPONENT STYLES ──────────────────────────────────────────────── */}
      <style jsx>{`
        .pm-container {
          padding: 16px;
          font-family: inherit;
          color: #0f172a;
        }
        .bar {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
        }
        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 10px;
          margin-top: 14px;
        }
        .stat {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 10px 12px;
        }
        .stat small {
          display: block;
          font-size: 11px;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .stat b {
          font-size: 16px;
          color: #0f172a;
        }
        .subtabs {
          display: flex;
          gap: 4px;
          border-bottom: 2px solid #e2e8f0;
          margin-bottom: 16px;
          overflow-x: auto;
        }
        .subtabs button {
          background: transparent;
          color: #64748b;
          border: none;
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
          padding: 8px 14px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          white-space: nowrap;
          border-radius: 0;
        }
        .subtabs button:hover {
          color: #1e40af;
        }
        .subtabs button.active {
          color: #1e40af;
          border-bottom-color: #1e40af;
          background: transparent;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
          font-size: 13px;
        }
        th {
          background: #f8fafc;
          color: #475569;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          text-align: left;
          padding: 10px 12px;
          border-bottom: 1px solid #e2e8f0;
        }
        td {
          padding: 10px 12px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }
        tr:hover td {
          background: #fafafa;
        }
        button {
          background: #2563eb;
          color: #ffffff;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        button:hover {
          opacity: 0.9;
        }
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        button.muted {
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #cbd5e1;
        }
        button.muted:hover {
          background: #e2e8f0;
        }
        button.danger {
          background: #fee2e2;
          color: #b91c1c;
          border: 1px solid #fca5a5;
        }
        button.danger:hover {
          background: #fecaca;
        }
        button.active-btn {
          background: #1e40af;
          color: #ffffff;
        }
        input, select, textarea {
          width: 100%;
          box-sizing: border-box;
          padding: 7px 10px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 13px;
          color: #0f172a;
          background: #ffffff;
        }
        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }
        .actions {
          display: flex;
          gap: 6px;
          align-items: center;
        }
        .badge {
          display: inline-block;
          padding: 2px 7px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
        }
        .badge-active {
          background: #dbeafe;
          color: #1e40af;
        }
        .badge-completed {
          background: #dcfce7;
          color: #166534;
        }
        .badge-lowstock {
          background: #fef9c3;
          color: #854d0e;
          border: 1px solid #fef08a;
        }
        .badge-overused {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        }
        .alert {
          background: #eff6ff;
          color: #1e40af;
          border: 1px solid #bfdbfe;
          padding: 10px 14px;
          border-radius: 6px;
          margin-bottom: 14px;
          font-size: 13px;
          font-weight: 600;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 16px;
        }
        .modal-card {
          background: #ffffff;
          padding: 22px;
          border-radius: 10px;
          width: 100%;
          maxWidth: 520px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </section>
  );
}
