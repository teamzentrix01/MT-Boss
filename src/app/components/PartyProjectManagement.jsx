'use client';

import React, { useState, useEffect, useCallback, useMemo, useId, useRef } from 'react';
import { useSubmitAction } from '../../hooks/useSubmitAction';
import SubmitToast from './SubmitToast';

function today() {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
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

let _globalIsAgent = false;

async function api(path, opts = {}) {
  const isAgentContext =
    opts.isAgent ||
    _globalIsAgent ||
    (typeof window !== 'undefined' && window.location.pathname.startsWith('/agent'));

  let token = '';
  if (typeof window !== 'undefined') {
    if (isAgentContext) {
      token = localStorage.getItem('agent-token') || localStorage.getItem('token') || '';
    } else {
      token = localStorage.getItem('admin-token') || localStorage.getItem('token') || localStorage.getItem('agent-token') || '';
    }
  }

  const res = await fetch(path, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
  });

  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  if (!res.ok || data.success === false) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  return data;
}

async function uploadFile(file) {
  const isAgentContext =
    _globalIsAgent ||
    (typeof window !== 'undefined' && window.location.pathname.startsWith('/agent'));
  let token = '';
  if (typeof window !== 'undefined') {
    if (isAgentContext) {
      token = localStorage.getItem('agent-token') || localStorage.getItem('token') || '';
    } else {
      token = localStorage.getItem('admin-token') || localStorage.getItem('token') || '';
    }
  }
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: fd,
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || 'Upload failed');
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
const receivedBlank = { material_id: '', material_name: '', supplier_id: '', quantity: '', rate: '', received_date: today(), supplier_name: '', challan_no: '', note: '', bill_url: '', bill_filename: '' };
const contractorTrades = ['General Vendor', 'Civil Contractor', 'Plumber / Plumbing', 'Electrician', 'Mason', 'Carpenter', 'Painter', 'Fabricator', 'Tile / Flooring', 'Waterproofing', 'HVAC', 'Other'];
const matchesContractorType = (trade, filter) => {
  if (!filter || filter === 'all') return true;
  const f = String(filter).toLowerCase().trim();
  const v = String(trade || '').toLowerCase().trim();
  if (!v) return f === 'all' || f === 'general vendor' || f === 'other';
  if (f.includes('civil')) return v.includes('civil');
  if (f.includes('plumb')) return v.includes('plumb');
  if (f.includes('elect')) return v.includes('elect');
  if (f.includes('mason')) return v.includes('mason');
  if (f.includes('carpent')) return v.includes('carpent');
  if (f.includes('paint')) return v.includes('paint');
  if (f.includes('fabricat')) return v.includes('fabricat');
  if (f.includes('tile') || f.includes('floor')) return v.includes('tile') || v.includes('floor');
  if (f.includes('waterproof')) return v.includes('waterproof');
  if (f.includes('hvac')) return v.includes('hvac');
  if (f === 'general vendor' || f === 'general') return v.includes('general') || v.includes('vendor');
  return v.includes(f) || f.includes(v);
};
const usedBlank = { material_id: '', material_name: '', quantity: '', used_date: today(), used_for: '', note: '' };
const adjustmentBlank = { material_id: '', material_name: '', adjustment_type: 'wastage', quantity: '', adjustment_date: today(), to_project_id: '', supplier_id: '', supplier_name: '', amount: '', note: '', bill_url: '', bill_filename: '' };
const expenseBlank = { category: 'transport', amount: '', expense_date: today(), note: '' };

export default function PartyProjectManagement({ initialScreen = 'parties', initialProjectId = null, isDarkMode, isAgent, agent: passedAgent }) {
  const submitAction = useSubmitAction();
  if (isAgent) {
    _globalIsAgent = true;
  }
  // Navigation: 'parties' | 'party' | 'partyForm' | 'project' | 'projectForm' | 'reports'
  const [screen, setScreen] = useState(initialProjectId ? 'project' : (isAgent ? 'projects' : initialScreen));
  const [role, setRole] = useState(isAgent ? 'agent' : 'admin');

  // Check supervisor role
  useEffect(() => {
    if (isAgent) {
      setRole('agent');
      return;
    }
    try {
      const u = JSON.parse(localStorage.getItem('admin-user') || localStorage.getItem('user') || '{}');
      if (u.role === 'site_supervisor') setRole('site_supervisor');
    } catch {}
  }, [isAgent]);

  const isSupervisor = role === 'site_supervisor';

  // Agent Specialization state
  const [currentAgent, setCurrentAgent] = useState(passedAgent || null);

  useEffect(() => {
    if (passedAgent) {
      setCurrentAgent(passedAgent);
    } else if (isAgent) {
      const token = typeof window !== 'undefined' ? localStorage.getItem('agent-token') : null;
      if (token) {
        fetch('/api/agent/profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => {
            if (data?.agent) setCurrentAgent(data.agent);
          })
          .catch(() => {});
      }
    }
  }, [passedAgent, isAgent]);

  const agentSpecs = useMemo(() => {
    if (!isAgent) return ['payments', 'labor', 'vendor', 'construction'];
    const rawSpecs = currentAgent?.specializations;
    return Array.isArray(rawSpecs) ? rawSpecs : (typeof rawSpecs === 'string' ? JSON.parse(rawSpecs || '[]') : []);
  }, [isAgent, currentAgent?.specializations]);

  const hasAgentPayment = !isAgent || agentSpecs.includes('payments');
  const hasAgentLabor = !isAgent || agentSpecs.includes('labor');
  const hasAgentVendor = !isAgent || agentSpecs.includes('vendor');
  const hasAgentConstruction = !isAgent || agentSpecs.includes('construction');

  // 5 Main tabs (in this order): Vendors, Labor, Attendance, Payments, Construction
  const allowedMainTabs = useMemo(() => {
    const tabs = [];
    if (!isAgent || agentSpecs.includes('vendor')) {
      tabs.push('vendors');
    }
    if (!isAgent || agentSpecs.includes('labor')) {
      tabs.push('labor');
    }
    if (!isAgent || agentSpecs.includes('labor') || agentSpecs.includes('vendor')) {
      tabs.push('attendance');
    }
    if ((!isAgent && !isSupervisor) || (isAgent && agentSpecs.includes('payments'))) {
      tabs.push('payments');
    }
    if (!isAgent || agentSpecs.includes('construction')) {
      tabs.push('construction');
    }
    if (!isAgent || agentSpecs.includes('construction') || agentSpecs.includes('payments')) {
      tabs.push('suppliers');
    }
    return tabs;
  }, [isAgent, isSupervisor, agentSpecs]);

  const allowedAttendanceSubTabs = useMemo(() => {
    const subs = [];
    if (!isAgent || agentSpecs.includes('vendor')) subs.push('vendor');
    if (!isAgent || agentSpecs.includes('labor')) subs.push('labor');
    return subs;
  }, [isAgent, agentSpecs]);

  const allowedTabs = allowedMainTabs;

  const getUrlParam = (key) => {
    if (typeof window === 'undefined') return null;
    return new URLSearchParams(window.location.search).get(key);
  };

  const normalizeSection = (sec) => {
    if (!sec) return null;
    const s = sec.toLowerCase().trim();
    if (s === 'vendors' || s === 'vendor') return 'vendors';
    if (s === 'labor' || s === 'labour') return 'labor';
    if (s === 'attendance') return 'attendance';
    if (s === 'payments' || s === 'payment') return 'payments';
    if (s === 'construction' || s === 'materials' || s === 'expenses') return 'construction';
    if (s === 'suppliers' || s === 'supplier') return 'suppliers';
    return null;
  };

  const normalizeAttendanceSub = (sub) => {
    if (!sub) return null;
    const s = sub.toLowerCase().trim();
    if (s === 'labor' || s === 'labor-attendance' || s === 'labor_attendance') return 'labor';
    if (s === 'vendor' || s === 'vendor-attendance' || s === 'vendor_attendance') return 'vendor';
    return null;
  };

  const normalizePaymentsSub = (sub) => {
    if (!sub) return null;
    const s = sub.toLowerCase().trim();
    if (s === 'labor' || s === 'labor-payment' || s === 'labor_payment') return 'labor';
    if (s === 'party' || s === 'party-payment' || s === 'party_payment') return 'party';
    if (s === 'vendor' || s === 'vendor-payment' || s === 'vendor_payment') return 'vendor';
    if (s === 'supplier' || s === 'supplier-payment' || s === 'supplier_payment') return 'supplier';
    return null;
  };

  const normalizeConstructionSub = (sub) => {
    if (!sub) return null;
    const s = sub.toLowerCase().trim();
    if (s === 'adjustments' || s === 'adjustment' || s === 'wastage') return 'adjustments';
    if (s === 'return' || s === 'return_material' || s === 'return-material' || s === 'returns') return 'return';
    if (s === 'scrap' || s === 'scrap_material' || s === 'scrap-material') return 'scrap';
    if (s === 'expenses' || s === 'other-expenses' || s === 'other_expenses') return 'expenses';
    return null;
  };

  // Parties state
  const [parties, setParties] = useState([]);
  const [party, setParty] = useState(null);
  const [partyForm, setPartyForm] = useState(partyBlank);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [message, setMessage] = useState('');

  // Project state
  const [project, setProject] = useState(null);
  const [projectForm, setProjectForm] = useState(projectBlank);

  // Main Project Tab: 'vendors' | 'labor' | 'attendance' | 'payments' | 'construction'
  const [projectTab, setProjectTab] = useState(() => {
    const rawSec = getUrlParam('section');
    const norm = normalizeSection(rawSec);
    if (norm && allowedMainTabs.includes(norm)) return norm;
    return allowedMainTabs.length > 0 ? allowedMainTabs[0] : 'vendors';
  });

  // Sub-tabs
  const [attendanceSubTab, setAttendanceSubTab] = useState(() => {
    const rawSub = getUrlParam('sub');
    const norm = normalizeAttendanceSub(rawSub);
    if (norm && allowedAttendanceSubTabs.includes(norm)) return norm;
    return allowedAttendanceSubTabs.includes('vendor') ? 'vendor' : (allowedAttendanceSubTabs[0] || 'vendor');
  });

  const [paymentsSubTab, setPaymentsSubTab] = useState(() => {
    const rawSub = getUrlParam('sub');
    const norm = normalizePaymentsSub(rawSub);
    if (norm) return norm;
    return 'vendor';
  });

  const [constructionSubTab, setConstructionSubTab] = useState(() => {
    const rawSub = getUrlParam('sub');
    const norm = normalizeConstructionSub(rawSub);
    if (norm) return norm;
    return 'adjustments';
  });

  useEffect(() => {
    if (allowedMainTabs.length > 0 && !allowedMainTabs.includes(projectTab)) {
      setProjectTab(allowedMainTabs[0]);
    }
  }, [allowedMainTabs, projectTab]);

  useEffect(() => {
    if (allowedAttendanceSubTabs.length > 0 && !allowedAttendanceSubTabs.includes(attendanceSubTab)) {
      setAttendanceSubTab(allowedAttendanceSubTabs[0]);
    }
  }, [allowedAttendanceSubTabs, attendanceSubTab]);

  const updateUrlParams = useCallback((section, sub) => {
    if (typeof window !== 'undefined' && window.history?.replaceState) {
      const url = new URL(window.location.href);
      if (section) url.searchParams.set('section', section);
      if (sub) {
        url.searchParams.set('sub', sub);
      } else {
        url.searchParams.delete('sub');
      }
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  const updateProjectUrl = useCallback((projectId) => {
    if (typeof window !== 'undefined' && window.history?.replaceState) {
      const url = new URL(window.location.href);
      if (projectId) url.searchParams.set('projectId', String(projectId));
      else {
        url.searchParams.delete('projectId');
        url.searchParams.delete('section');
        url.searchParams.delete('sub');
      }
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  const handleSectionChange = (sec) => {
    setProjectTab(sec);
    setSelectedVendor(null);
    setSelectedLabor(null);
    let subVal = null;
    if (sec === 'attendance') subVal = attendanceSubTab;
    else if (sec === 'payments') subVal = paymentsSubTab;
    else if (sec === 'construction') subVal = constructionSubTab;
    updateUrlParams(sec, subVal);
  };

  const handleAttendanceSubChange = (sub) => {
    setAttendanceSubTab(sub);
    updateUrlParams('attendance', sub);
  };

  const handlePaymentsSubChange = (sub) => {
    setPaymentsSubTab(sub);
    updateUrlParams('payments', sub);
  };

  const handleConstructionSubChange = (sub) => {
    setConstructionSubTab(sub);
    updateUrlParams('construction', sub);
  };

  useEffect(() => {
    const handlePopState = () => {
      const sec = normalizeSection(getUrlParam('section'));
      if (sec && allowedMainTabs.includes(sec)) {
        setProjectTab(sec);
        const sub = getUrlParam('sub');
        if (sec === 'attendance') {
          const normSub = normalizeAttendanceSub(sub);
          if (normSub) setAttendanceSubTab(normSub);
        } else if (sec === 'payments') {
          const normSub = normalizePaymentsSub(sub);
          if (normSub) setPaymentsSubTab(normSub);
        } else if (sec === 'construction') {
          const normSub = normalizeConstructionSub(sub);
          if (normSub) setConstructionSubTab(normSub);
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [allowedMainTabs]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPagination((prev) => (prev.page === 1 ? prev : { ...prev, page: 1 }));
  }, [debouncedSearch]);

  // Phase 1: Party payments
  const [partyPayments, setPartyPayments] = useState([]);
  const [partyPaymentForm, setPartyPaymentForm] = useState({ amount: '', payment_date: today(), mode: 'bank', note: '', transaction_reference: '' });

  // Phase 2: Project Vendors
  const [projectVendors, setProjectVendors] = useState([]);
  const [allVendorsMaster, setAllVendorsMaster] = useState([]);
  const [contractorSearch, setContractorSearch] = useState('');
  const [contractorsLoading, setContractorsLoading] = useState(false);
  const [suppliersMaster, setSuppliersMaster] = useState([]);
  const [projectSuppliers, setProjectSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [supplierLedgerData, setSupplierLedgerData] = useState({ deliveries: [], payments: [], summary: {} });
  const [loadingSupplierLedger, setLoadingSupplierLedger] = useState(false);
  const [supplierLedgerTab, setSupplierLedgerTab] = useState('deliveries');
  const [supplierPaymentsList, setSupplierPaymentsList] = useState([]);
  const [supplierSearch, setSupplierSearch] = useState('');
  const [supplierPaymentModal, setSupplierPaymentModal] = useState(false);
  const [supplierPaymentForm, setSupplierPaymentForm] = useState({
    supplier_id: '',
    supplier_name: '',
    amount: '',
    payment_date: today(),
    mode: 'bank',
    transaction_reference: '',
    note: '',
  });
  const [vendorTypeFilter, setVendorTypeFilter] = useState('all');
  const [contractorMenuOpen, setContractorMenuOpen] = useState(false);
  const [supplierView, setSupplierView] = useState(false);
  const [addVendorModal, setAddVendorModal] = useState(false);
  const [vendorMode, setVendorMode] = useState('existing');

  const loadContractorsList = useCallback(async (trade = 'all', searchQuery = '') => {
    setContractorsLoading(true);
    try {
      const q = encodeURIComponent(searchQuery || '');
      const t = encodeURIComponent(trade || 'all');
      const res = await api(`/api/admin/project-management/contractors?trade=${t}&search=${q}&pageSize=100`);
      setAllVendorsMaster(res.data || []);
      return res.data || [];
    } catch (e) {
      console.warn('Could not load from contractors route, falling back to vendors:', e.message);
      try {
        const fb = await api('/api/admin/project-management/vendors?page=1&pageSize=100');
        setAllVendorsMaster(fb.data || []);
        return fb.data || [];
      } catch {
        return [];
      }
    } finally {
      setContractorsLoading(false);
    }
  }, []);

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
  const [projectVendorAttendanceHistory, setProjectVendorAttendanceHistory] = useState([]);
  const [projectLaborAttendanceHistory, setProjectLaborAttendanceHistory] = useState([]);

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
    transaction_reference: '',
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

  // ── Labor (Individual Worker) State ───────────────────────────────────────
  const [projectLabors, setProjectLabors] = useState([]);
  const [laborSubTab, setLaborSubTab] = useState('list'); // 'list' | 'attendance' | 'payments'
  const [selectedLabor, setSelectedLabor] = useState(null);
  const [addLaborModal, setAddLaborModal] = useState(false);
  const [editingLaborId, setEditingLaborId] = useState(null);
  const [laborForm, setLaborForm] = useState({ name: '', phone: '', trade: '', project_vendor_id: '', daily_rate: '' });
  const [laborAttendanceDate, setLaborAttendanceDate] = useState(today());
  const [laborAttendanceRows, setLaborAttendanceRows] = useState([]);
  const [savingLaborAttendance, setSavingLaborAttendance] = useState(false);
  const [laborPaymentsList, setLaborPaymentsList] = useState([]);
  const [laborPaymentFilterLabor, setLaborPaymentFilterLabor] = useState('');
  const [laborPaymentFilterFrom, setLaborPaymentFilterFrom] = useState('');
  const [laborPaymentFilterTo, setLaborPaymentFilterTo] = useState('');
  const [laborPaymentModal, setLaborPaymentModal] = useState(false);
  const [laborPaymentForm, setLaborPaymentForm] = useState({ labor_id: '', amount: '', payment_date: today(), mode: 'cash', payment_type: 'wage', note: '', transaction_reference: '' });
  const [editingLaborPaymentId, setEditingLaborPaymentId] = useState(null);
  const [laborCalendarMonth, setLaborCalendarMonth] = useState(() => today().slice(0, 7));
  const [laborAttendanceHistory, setLaborAttendanceHistory] = useState([]);
  const [laborPaymentsHistory, setLaborPaymentsHistory] = useState([]);
  const [manageTeamVendor, setManageTeamVendor] = useState(null);
  const [lockedContractorId, setLockedContractorId] = useState(null);
  const [laborTypeFilter, setLaborTypeFilter] = useState('all'); // 'all' | 'independent' | 'contractor' | string(id)
  const [laborAttendanceSection, setLaborAttendanceSection] = useState('all'); // 'all' | 'direct' | 'contractor'
  const [attendanceContractorFilter, setAttendanceContractorFilter] = useState('');
  // Retained only for compatibility with the existing bulk-selection code; the
  // checkbox UI is intentionally hidden in favor of per-worker marking.
  const [selectedLaborIds, setSelectedLaborIds] = useState([]);
  const [modalError, setModalError] = useState('');

  // ── Phase 3: Materials & Stock State ───────────────────────────────────────
  const [materialsMaster, setMaterialsMaster] = useState([]);
  const [stockRows, setStockRows] = useState([]);
  const materialsSubTab = constructionSubTab;
  const setMaterialsSubTab = setConstructionSubTab;
  const [receivedRows, setReceivedRows] = useState([]);
  const [usedRows, setUsedRows] = useState([]);
  const [adjustmentRows, setAdjustmentRows] = useState([]);
  const wastageAdjRows = adjustmentRows.filter((r) =>
    ['wastage', 'damage', 'transfer_out'].includes(r.adjustment_type) ||
    (!['return_to_supplier', 'return_material', 'scrap_material', 'scrap'].includes(r.adjustment_type))
  );
  const returnMaterialRows = adjustmentRows.filter((r) =>
    ['return_to_supplier', 'return_material'].includes(r.adjustment_type)
  );
  const scrapMaterialRows = adjustmentRows.filter((r) =>
    ['scrap_material', 'scrap'].includes(r.adjustment_type)
  );

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

  const [billFile, setBillFile] = useState(null);

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

  // ── Agent Assignment State ────────────────────────────────────────────────
  const [projectAgents, setProjectAgents] = useState([]);
  const [allAgentsList, setAllAgentsList] = useState([]);
  const [assignAgentModal, setAssignAgentModal] = useState(false);
  const [assigningAgentId, setAssigningAgentId] = useState('');

  // ── Delete Project State & Handlers ─────────────────────────────────────────
  const [deleteProjectModal, setDeleteProjectModal] = useState(null);
  const [deletingProject, setDeletingProject] = useState(false);
  const deletingProjectRef = useRef(false);
  const [deleteProjectError, setDeleteProjectError] = useState('');

  const openDeleteProjectModal = (proj, partyName = '') => {
    setDeleteProjectError('');
    setDeletingProject(false);
    deletingProjectRef.current = false;
    setDeleteProjectModal({
      id: proj.id,
      name: proj.name,
      partyName: partyName || proj.party_name || party?.party?.name || 'Party',
      partyId: proj.party_id || party?.party?.id,
    });
  };

  const confirmDeleteProject = async () => {
    if (deletingProjectRef.current || !deleteProjectModal) return;
    deletingProjectRef.current = true;
    setDeletingProject(true);
    setDeleteProjectError('');

    try {
      await api(`/api/admin/project-management/projects/${deleteProjectModal.id}`, {
        method: 'DELETE',
      });
      const deletedPartyId = deleteProjectModal.partyId;
      setDeleteProjectModal(null);
      deletingProjectRef.current = false;
      setDeletingProject(false);
      setMessage('Project deleted successfully.');

      if (screen === 'project') {
        if (deletedPartyId) {
          await showParty(deletedPartyId);
        } else {
          setScreen('parties');
          await loadParties();
        }
      } else if (screen === 'party' && party) {
        await showParty(party.party.id);
      } else {
        await loadParties();
      }
    } catch (err) {
      setDeleteProjectError(err.message || 'Could not delete project');
      deletingProjectRef.current = false;
      setDeletingProject(false);
    }
  };



  // ── Load Parties ─────────────────────────────────────────────────────────────
  const loadParties = useCallback(async () => {
    try {
      const d = await api(`/api/admin/project-management/parties?search=${encodeURIComponent(debouncedSearch)}&page=${pagination.page}&pageSize=20`);
      setParties(d.data || []);
      setPagination(d.pagination || { page: 1, totalPages: 1 });
    } catch (e) {
      setMessage(e.message);
    }
  }, [debouncedSearch, pagination.page]);

  const loadAgentProjects = useCallback(async () => {
    try {
      const d = await api(`/api/admin/project-management/projects?search=${encodeURIComponent(debouncedSearch)}&page=${pagination.page}&pageSize=20`);
      setAllProjectsList(d.data || []);
      setPagination(d.pagination || { page: 1, totalPages: 1 });
    } catch (e) {
      setMessage(e.message);
    }
  }, [debouncedSearch, pagination.page]);

  useEffect(() => {
    if (screen === 'parties') loadParties();
    if (screen === 'projects') loadAgentProjects();
  }, [screen, loadParties, loadAgentProjects]);

  // Auto-open a project if initialProjectId was passed (e.g. from Lead Management conversion)
  useEffect(() => {
    if (initialProjectId) {
      showProject(initialProjectId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialProjectId]);

  // ── Show Single Party ────────────────────────────────────────────────────────
  const showParty = async (id) => {
    try {
      const d = await api(`/api/admin/project-management/parties/${id}?page=1&pageSize=100`);
      setParty(d.data);
      setScreen('party');
      updateProjectUrl(null);
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

  // ── Load Labor Data ────────────────────────────────────────────────────────
  const loadProjectLabors = useCallback(async (projId) => {
    const pid = projId || project?.id;
    if (!pid) return;
    try {
      const d = await api(`/api/admin/project-management/labor?projectId=${pid}&pageSize=200`);
      const seen = new Set();
      const deduped = (d.data || []).filter((item) => {
        if (!item?.id || seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });
      setProjectLabors(deduped);
    } catch (e) {
      console.error('Error loading labor:', e);
    }
  }, [project?.id]);

  const loadProjectSuppliers = useCallback(async (projId) => {
    const pid = projId || project?.id;
    if (!pid) return;
    try {
      const res = await api(`/api/admin/project-management/suppliers?projectId=${pid}`);
      setProjectSuppliers(res.projectSuppliers || []);
      if (res.allSuppliers && res.allSuppliers.length > 0) {
        setSuppliersMaster(res.allSuppliers);
      }
    } catch (err) {
      console.error('Error loading project suppliers:', err);
    }
  }, [project?.id]);

  const loadSupplierLedger = useCallback(async (projId, supplierId, supplierName) => {
    const pid = projId || project?.id;
    if (!pid) return;
    setLoadingSupplierLedger(true);
    try {
      let url = `/api/admin/project-management/supplier-ledger?projectId=${pid}`;
      if (supplierId) url += `&supplierId=${supplierId}`;
      if (supplierName) url += `&supplierName=${encodeURIComponent(supplierName)}`;
      const res = await api(url);
      setSupplierLedgerData(res || { deliveries: [], payments: [], summary: {} });
    } catch (err) {
      console.error('Error loading supplier ledger:', err);
    } finally {
      setLoadingSupplierLedger(false);
    }
  }, [project?.id]);

  const loadSupplierPayments = useCallback(async (projId) => {
    const pid = projId || project?.id;
    if (!pid) return;
    try {
      const res = await api(`/api/admin/project-management/supplier-payments?projectId=${pid}&pageSize=200`);
      setSupplierPaymentsList(res.data || []);
    } catch (err) {
      console.error('Error loading supplier payments:', err);
    }
  }, [project?.id]);

  const openSupplierLedger = (supplier) => {
    setSelectedSupplier(supplier);
    setSupplierLedgerTab('deliveries');
    loadSupplierLedger(project?.id, supplier.supplier_id, supplier.raw_supplier_name || supplier.supplier_name);
  };

  const loadLaborAttendance = useCallback(async (date, projId) => {
    const pid = projId || project?.id;
    const d = date || laborAttendanceDate;
    if (!pid || !d) return;
    try {
      const r = await api(`/api/admin/project-management/labor/attendance?projectId=${pid}&date=${d}`);
      const seen = new Set();
      const rows = (r.data || [])
        .filter((row) => {
          const lid = row.labor_id || row.id;
          if (!lid || seen.has(lid)) return false;
          seen.add(lid);
          return true;
        })
        .map((row) => ({
          ...row,
          name: row.name || row.labor_name || '',
          is_marked: Boolean(row.attendance_id),
          // A loaded record is informational until the user explicitly changes it.
          // Untouched workers deliberately have no default attendance status.
          status: row.attendance_id ? (row.attendance_status || row.status || 'present') : '',
          wage_amount: row.attendance_id ? Number(row.wage_amount) : 0,
          dirty: false,
        }));
      setLaborAttendanceRows(rows);
      setSelectedLaborIds([]);
    } catch (e) {
      console.error('Error loading labor attendance:', e);
    }
  }, [project?.id, laborAttendanceDate]);

  const loadLaborPayments = useCallback(async (projId, laborId, from, to) => {
    const pid = projId || project?.id;
    if (!pid) return;
    try {
      const q = new URLSearchParams({
        projectId: String(pid),
        laborId: laborId || '',
        from: from || '',
        to: to || '',
        pageSize: '100',
      });
      const r = await api(`/api/admin/project-management/labor/payments?${q.toString()}`);
      setLaborPaymentsList(r.data || []);
    } catch (e) {
      console.error('Error loading labor payments:', e);
    }
  }, [project?.id]);

  const openLaborDetail = async (labor) => {
    try {
      setSelectedVendor(null);
      setTimelineMaterial(null);
      setSelectedLabor(labor);
      const [attRes, payRes] = await Promise.all([
        api(`/api/admin/project-management/labor/attendance?laborId=${labor.id}&month=${laborCalendarMonth}`).catch(() => ({ data: [] })),
        api(`/api/admin/project-management/labor/payments?projectId=${project.id}&laborId=${labor.id}&pageSize=100`).catch(() => ({ data: [] })),
      ]);
      setLaborAttendanceHistory(attRes.data || []);
      setLaborPaymentsHistory(payRes.data || []);
    } catch (e) {
      setMessage(e.message);
    }
  };

  // ── Show Single Project Overview ─────────────────────────────────────────────
  const showProject = async (id) => {
    try {
      const [projRes, ppRes, pvRes, vListRes, laborRes, assignedAgentsRes, allAgentsRes, suppliersRes] = await Promise.all([
        api(`/api/admin/project-management/projects/${id}`),
        api(`/api/admin/project-management/payments?projectId=${id}&page=1&pageSize=100`).catch(() => ({ data: [] })),
        api(`/api/admin/project-management/project-vendors?projectId=${id}&page=1&pageSize=100`).catch(() => ({ data: [] })),
        api(`/api/admin/project-management/contractors?trade=all&pageSize=100`).catch(() => api('/api/admin/project-management/vendors?page=1&pageSize=100')).catch(() => ({ data: [] })),
        api(`/api/admin/project-management/labor?projectId=${id}&pageSize=200`).catch(() => ({ data: [] })),
        api(`/api/admin/project-management/projects/${id}/agents`).catch(() => ({ data: [] })),
        api(`/api/admin/lead-management?assigneesOnly=1`).catch(() => ({ agents: [] })),
        api(`/api/admin/project-management/suppliers?projectId=${id}`).catch(() => ({ projectSuppliers: [], allSuppliers: [] })),
        api(`/api/admin/project-management/supplier-payments?projectId=${id}&pageSize=200`).catch(() => ({ data: [] })),
      ]);
      const supPayRes = arguments[0] || {};
      setProject(projRes.data);
      setPartyPayments(ppRes.data || []);
      setProjectVendors(pvRes.data || []);
      setAllVendorsMaster(vListRes.data || []);
      setProjectSuppliers(suppliersRes.projectSuppliers || []);
      setSuppliersMaster(suppliersRes.allSuppliers || []);
      loadSupplierPayments(id);
      setProjectLabors(laborRes.data || []);
      setProjectAgents(assignedAgentsRes.data || []);
      setAllAgentsList(allAgentsRes.agents || []);
      setSelectedVendor(null);
      setSelectedLabor(null);
      setTimelineMaterial(null);
      setScreen('project');
      updateProjectUrl(id);
      const rawSec = getUrlParam('section');
      const normSec = normalizeSection(rawSec);
      const targetSec = (normSec && allowedMainTabs.includes(normSec))
        ? normSec
        : (allowedMainTabs.includes(projectTab) ? projectTab : (allowedMainTabs[0] || 'vendors'));
      setProjectTab(targetSec);
      const rawSub = getUrlParam('sub');
      if (rawSub) {
        if (targetSec === 'attendance') {
          const nSub = normalizeAttendanceSub(rawSub);
          if (nSub && allowedAttendanceSubTabs.includes(nSub)) setAttendanceSubTab(nSub);
        } else if (targetSec === 'payments') {
          const nSub = normalizePaymentsSub(rawSub);
          if (nSub) setPaymentsSubTab(nSub);
        } else if (targetSec === 'construction') {
          const nSub = normalizeConstructionSub(rawSub);
          if (nSub) setConstructionSubTab(nSub);
        }
      }
      loadPhase3ProjectData(id);
      loadProjectVendorAttendanceHistory(id);
      loadProjectLaborAttendanceHistory(id);
    } catch (e) {
      setMessage(e.message);
    }
  };

  // ── Agent Assignment Functions ────────────────────────────────────────────────
  const assignAgent = async () => {
    if (!assigningAgentId || !project?.id) return;
    try {
      const res = await api(`/api/admin/project-management/projects/${project.id}/agents`, {
        method: 'POST',
        body: JSON.stringify({ agent_id: assigningAgentId }),
      });
      if (res.success !== false) {
        const agentsRes = await api(`/api/admin/project-management/projects/${project.id}/agents`);
        setProjectAgents(agentsRes.data || []);
        setAssigningAgentId('');
        setAssignAgentModal(false);
      } else {
        setMessage(res.error || 'Could not assign agent');
      }
    } catch (e) {
      setMessage(e.message);
      throw e;
    }
  };

  const removeAgent = async (agentId) => {
    if (!project?.id) return;
    try {
      await api(`/api/admin/project-management/projects/${project.id}/agents/${agentId}`, { method: 'DELETE' });
      setProjectAgents((prev) => prev.filter((a) => a.id !== agentId));
    } catch (e) {
      setMessage(e.message);
    }
  };

  // ── Refresh Project Data ─────────────────────────────────────────────────────
  const refreshProjectData = async (projId) => {
    const pid = projId || project?.id;
    if (!pid) return;
    try {
      const [projRes, pvRes, ppRes, laborRes] = await Promise.all([
        api(`/api/admin/project-management/projects/${pid}`),
        api(`/api/admin/project-management/project-vendors?projectId=${pid}&page=1&pageSize=100`),
        api(`/api/admin/project-management/payments?projectId=${pid}&page=1&pageSize=100`),
        api(`/api/admin/project-management/labor?projectId=${pid}&pageSize=200`).catch(() => ({ data: [] })),
      ]);
      setProject(projRes.data);
      setProjectVendors(pvRes.data || []);
      setPartyPayments(ppRes.data || []);
      setProjectLabors(laborRes.data || []);
      if (selectedVendor) {
        const uv = (pvRes.data || []).find((v) => Number(v.id) === Number(selectedVendor.id));
        if (uv) setSelectedVendor(uv);
      }
      loadPhase3ProjectData(pid);
      loadProjectVendorAttendanceHistory(pid);
      loadProjectLaborAttendanceHistory(pid);
      loadContractorsList('all');
      loadProjectSuppliers(pid);
      loadSupplierPayments(pid);
      if (selectedSupplier) {
        loadSupplierLedger(pid, selectedSupplier.supplier_id, selectedSupplier.raw_supplier_name || selectedSupplier.supplier_name);
      }
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
      const matId = material.id || material.material_id;
      const res = await api(`/api/admin/project-management/material-timeline?projectId=${project.id}&materialId=${matId}`);
      setSelectedVendor(null);
      setSelectedLabor(null);
      setTimelineMaterial(res.material);
      setTimelineData(res.timeline || []);
      setTimelineStock(res.current_stock ?? 0);
    } catch (e) {
      setMessage(e.message);
    }
  };

  // ── Save Master Material ────────────────────────────────────────────────────
  // Material endpoints retain their material_id contract. The simplified UI uses
  // a name, resolving an existing master record or creating one invisibly.
  const resolveMaterialId = async (materialName, fallbackId = '') => {
    const name = String(materialName || '').trim();
    if (!name) throw new Error('Material name is required');
    const matching = materialsMaster.find((material) => String(material.name || '').trim().toLowerCase() === name.toLowerCase());
    if (matching) return matching.id;
    if (fallbackId) return fallbackId;
    const created = await api('/api/admin/project-management/materials', {
      method: 'POST',
      body: JSON.stringify({ ...materialBlank, name }),
    });
    if (created.data) setMaterialsMaster((previous) => [...previous, created.data]);
    return created.data?.id;
  };

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
      throw err;
    }
  };

  // ── Save Received Entry ─────────────────────────────────────────────────────
  const saveReceivedEntry = async (e) => {
    e.preventDefault();
    if (!project?.id) return;
    try {
      let bill_url = receivedForm.bill_url;
      let bill_filename = receivedForm.bill_filename;
      
      if (billFile) {
        const uploadData = await uploadFile(billFile);
        bill_url = uploadData.url;
        bill_filename = uploadData.filename;
      }
      
      const material_id = await resolveMaterialId(receivedForm.material_name, receivedForm.material_id);
      const payload = { ...receivedForm, material_id, project_id: project.id, bill_url, bill_filename };
      
      if (editingReceivedId) {
        await api(`/api/admin/project-management/material-received/${editingReceivedId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        setMessage('Material received entry updated');
      } else {
        await api('/api/admin/project-management/material-received', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setMessage('Material received recorded successfully');
      }
      setReceivedModal(false);
      setEditingReceivedId(null);
      setReceivedForm(receivedBlank);
      setBillFile(null);
      refreshProjectData(project.id);
      loadProjectSuppliers(project.id);
      if (selectedSupplier) {
        loadSupplierLedger(project.id, selectedSupplier.supplier_id, selectedSupplier.raw_supplier_name || selectedSupplier.supplier_name);
      }
    } catch (err) {
      setMessage(err.message);
      throw err;
    }
  };

  // ── Save Supplier Payment ──────────────────────────────────────────────────
  const saveSupplierPayment = async (e) => {
    e.preventDefault();
    if (!project?.id) return;
    try {
      const payload = {
        ...supplierPaymentForm,
        project_id: project.id,
      };
      const res = await api('/api/admin/project-management/supplier-payments', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setMessage(res.is_advance ? `Supplier payment recorded as advance of ${INR(res.advance_amount)}` : 'Supplier payment recorded successfully');
      setSupplierPaymentModal(false);
      setSupplierPaymentForm({
        supplier_id: '',
        supplier_name: '',
        amount: '',
        payment_date: today(),
        mode: 'bank',
        transaction_reference: '',
        note: '',
      });
      refreshProjectData(project.id);
      loadProjectSuppliers(project.id);
      loadSupplierPayments(project.id);
      if (selectedSupplier) {
        loadSupplierLedger(project.id, selectedSupplier.supplier_id, selectedSupplier.raw_supplier_name || selectedSupplier.supplier_name);
      }
    } catch (err) {
      setModalError(err.message);
      throw err;
    }
  };

  // ── Save Used Entry ─────────────────────────────────────────────────────────
  const saveUsedEntry = async (e) => {
    e.preventDefault();
    if (!project?.id) return;
    try {
      const material_id = await resolveMaterialId(usedForm.material_name, usedForm.material_id);
      let res;
      if (editingUsedId) {
        res = await api(`/api/admin/project-management/material-used/${editingUsedId}`, {
          method: 'PATCH',
          body: JSON.stringify({ ...usedForm, material_id }),
        });
      } else {
        res = await api('/api/admin/project-management/material-used', {
          method: 'POST',
          body: JSON.stringify({ ...usedForm, material_id, project_id: project.id }),
        });
      }
      if (res.warning) {
        setMessage(`${res.warning} The wastage entry was saved.`);
      }
      setMessage('Material usage recorded');
      setUsedModal(false);
      setEditingUsedId(null);
      setUsedForm(usedBlank);
      refreshProjectData(project.id);
    } catch (err) {
      setMessage(err.message);
      throw err;
    }
  };

  // ── Save Adjustment Entry ───────────────────────────────────────────────────
  const saveAdjustmentEntry = async (e) => {
    e.preventDefault();
    if (!project?.id) return;
    try {
      let bill_url = adjustmentForm.bill_url;
      let bill_filename = adjustmentForm.bill_filename;
      
      if (billFile) {
        const uploadData = await uploadFile(billFile);
        bill_url = uploadData.url;
        bill_filename = uploadData.filename;
      }
      
      const material_id = await resolveMaterialId(adjustmentForm.material_name, adjustmentForm.material_id);
      const payload = {
        ...adjustmentForm,
        material_id,
        project_id: project.id,
        amount: adjustmentForm.amount ? Number(adjustmentForm.amount) : null,
        supplier_id: adjustmentForm.supplier_id ? Number(adjustmentForm.supplier_id) : null,
        supplier_name: adjustmentForm.supplier_name ? String(adjustmentForm.supplier_name).trim() : null,
        bill_url,
        bill_filename,
      };

      let res;
      if (editingAdjId) {
        res = await api(`/api/admin/project-management/material-adjustments/${editingAdjId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        res = await api('/api/admin/project-management/material-adjustments', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      setMessage(res.warning ? `${res.warning} Entry saved.` : 'Entry recorded successfully');
      if (res.data) {
        const returnedRow = {
          ...res.data,
          material_name: adjustmentForm.material_name || res.data.material_name,
          supplier_name: adjustmentForm.supplier_name || res.data.supplier_name,
          amount: adjustmentForm.amount ? Number(adjustmentForm.amount) : res.data.amount,
        };
        setAdjustmentRows((previous) => [returnedRow, ...previous.filter((row) => Number(row.id) !== Number(res.data.id))]);
      }
      setAdjustmentModal(false);
      setEditingAdjId(null);
      setAdjustmentForm(adjustmentBlank);
      setBillFile(null);
      loadProjectSuppliers(project.id);
      if (selectedSupplier) {
        loadSupplierLedger(project?.id, selectedSupplier.supplier_id, selectedSupplier.raw_supplier_name || selectedSupplier.supplier_name);
      }
      refreshProjectData(project.id);
    } catch (err) {
      setMessage(err.message);
      throw err;
    }
  };

  // ── Save Expense Entry ──────────────────────────────────────────────────────
  const saveExpenseEntry = async (e) => {
    e.preventDefault();
    if (!project?.id) return;
    try {
      if (editingExpenseId) {
        const previousExpense = expenseRows.find((row) => Number(row.id) === Number(editingExpenseId));
        const result = await api(`/api/admin/project-management/other-expenses/${editingExpenseId}`, {
          method: 'PATCH',
          body: JSON.stringify(expenseForm),
        });
        if (result.data) {
          setExpenseRows((previous) => previous.map((row) => Number(row.id) === Number(editingExpenseId) ? result.data : row));
          setExpenseSummary((previous) => ({
            ...previous,
            totalAmount: Number(previous.totalAmount || 0) + Number(result.data.amount || 0) - Number(previousExpense?.amount || 0),
          }));
        }
        setMessage('Expense updated successfully');
      } else {
        const result = await api('/api/admin/project-management/other-expenses', {
          method: 'POST',
          body: JSON.stringify({ ...expenseForm, project_id: project.id }),
        });
        if (result.data) {
          setExpenseRows((previous) => [result.data, ...previous.filter((row) => Number(row.id) !== Number(result.data.id))]);
          setExpenseSummary((previous) => ({ ...previous, totalAmount: Number(previous.totalAmount || 0) + Number(result.data.amount || 0) }));
        }
        setMessage('Expense recorded successfully');
      }
      setExpenseModal(false);
      setEditingExpenseId(null);
      setExpenseForm(expenseBlank);
      // Refresh related project cards in the background. The expense list above
      // is updated immediately from the authoritative save response.
      refreshProjectData(project.id);
    } catch (err) {
      setMessage(err.message);
      throw err;
    }
  };

  // ── Party CRUD ───────────────────────────────────────────────────────────────
  const saveParty = async (e) => {
    e.preventDefault();
    try {
      if (partyForm.id) {
        await api(`/api/admin/project-management/parties/${partyForm.id}`, { method: 'PATCH', body: JSON.stringify(partyForm) });
        setMessage('Party updated');
        setPartyForm(partyBlank);
        setScreen('parties');
        loadParties();
      } else {
        const res = await api('/api/admin/project-management/parties', { method: 'POST', body: JSON.stringify(partyForm) });
        setMessage(res.is_existing ? 'Existing party found. You can add a project here.' : 'Party created');
        setPartyForm(partyBlank);
        // Open the party immediately
        showParty(res.data.id);
      }
    } catch (e) {
      setMessage(e.message);
      throw e;
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
      throw e;
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
      } else if (kind === 'supplierPayment') {
        await api(`/api/admin/project-management/supplier-payments?id=${id}`, { method: 'DELETE' });
        loadSupplierPayments(project?.id);
        loadProjectSuppliers(project?.id);
        if (selectedSupplier) {
          loadSupplierLedger(project?.id, selectedSupplier.supplier_id, selectedSupplier.raw_supplier_name || selectedSupplier.supplier_name);
        }
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
        loadProjectSuppliers(project?.id);
        if (selectedSupplier) {
          loadSupplierLedger(project?.id, selectedSupplier.supplier_id, selectedSupplier.raw_supplier_name || selectedSupplier.supplier_name);
        }
        refreshProjectData();
      } else if (kind === 'expense') {
        await api(`/api/admin/project-management/other-expenses/${id}`, { method: 'DELETE' });
        refreshProjectData();
      } else if (kind === 'labor') {
        await api(`/api/admin/project-management/labor/${id}`, { method: 'DELETE' });
        loadProjectLabors(project.id);
        refreshProjectData();
      } else if (kind === 'laborPayment') {
        await api(`/api/admin/project-management/labor/payments/${id}`, { method: 'DELETE' });
        loadLaborPayments(project.id, laborPaymentFilterLabor, laborPaymentFilterFrom, laborPaymentFilterTo);
        if (selectedLabor) openLaborDetail(selectedLabor);
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
      setPartyPaymentForm({ amount: '', payment_date: today(), mode: 'bank', note: '', transaction_reference: '' });
      setMessage('Party payment recorded');
      refreshProjectData();
    } catch (e) {
      setMessage(e.message);
      throw e;
    }
  };

  // ── Phase 2: Assign Vendor ───────────────────────────────────────────────────
  const assignVendorToProject = async (e) => {
    e.preventDefault();
    setModalError('');
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

      setMessage('Contractor added to project successfully');
      setAddVendorModal(false);
      setModalError('');
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
      console.error('Error assigning contractor:', e);
      throw e;
      setModalError(e.message || 'Could not assign contractor');
      setMessage(`❌ ${e.message || 'Could not assign contractor'}`);
    }
  };

  // ── Phase 2: View Vendor Details ─────────────────────────────────────────────
  const openVendorDetail = async (pv) => {
    setSelectedLabor(null);
    setTimelineMaterial(null);
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

  const loadProjectVendorAttendanceHistory = useCallback(async (projId) => {
    const pid = projId || project?.id;
    if (!pid) return;
    try {
      const res = await api(`/api/admin/project-management/attendance?projectId=${pid}&history=1`);
      setProjectVendorAttendanceHistory(res.data || []);
    } catch {
      setProjectVendorAttendanceHistory([]);
    }
  }, [project?.id]);

  const loadProjectLaborAttendanceHistory = useCallback(async (projId) => {
    const pid = projId || project?.id;
    if (!pid) return;
    try {
      const res = await api(`/api/admin/project-management/labor/attendance?projectId=${pid}&history=1`);
      setProjectLaborAttendanceHistory(res.data || []);
    } catch {
      setProjectLaborAttendanceHistory([]);
    }
  }, [project?.id]);

  // ── Phase 2: Bulk Attendance ────────────────────────────────────────────────
  const loadDailyAttendance = useCallback(async (date) => {
    if (!project?.id) return;
    try {
      const attData = await api(`/api/admin/project-management/attendance?projectId=${project.id}&date=${date}`).catch(() => ({ data: [] }));
      const existingMap = new Map((attData.data || []).map((a) => [Number(a.project_vendor_id || a.id), a]));
      const dailyVendors = projectVendors.filter((pv) => pv.pay_type === 'daily_wage');

      const rows = dailyVendors.map((pv) => {
        const ex = existingMap.get(Number(pv.id));
        const hasLinkedLabor = Boolean(ex?.has_linked_labor);
        const isMarked = Boolean(ex && ex.attendance_id);
        const initialStatus = isMarked ? (ex.attendance_status || 'present') : '';
        const workers = isMarked ? Number(ex.workers_count || 1) : 1;
        const rate = isMarked ? Number(ex.rate_per_worker || pv.daily_rate || 0) : Number(pv.daily_rate || 0);
        const mult = initialStatus === 'present' ? 1 : initialStatus === 'half_day' ? 0.5 : 0;
        const wage = isMarked ? Number(ex.wage_amount) : mult * workers * rate;

        return {
          project_vendor_id: pv.id,
          vendor_name: pv.vendor_name,
          trade: pv.trade,
          status: initialStatus,
          workers_count: workers,
          rate_per_worker: rate,
          wage_amount: wage,
          note: ex ? ex.note || '' : '',
          has_linked_labor: hasLinkedLabor,
          is_marked: isMarked,
          dirty: false,
          created_by: ex?.created_by || null,
          created_at: ex?.created_at || null,
        };
      });
      setAttendanceRows(rows);
    } catch (e) {
      setMessage(e.message);
    }
  }, [project?.id, projectVendors]);

  useEffect(() => {
    if (projectTab === 'attendance' && project?.id) {
      if (attendanceSubTab === 'vendor') {
        loadDailyAttendance(attendanceDate);
        loadProjectVendorAttendanceHistory(project.id);
      } else if (attendanceSubTab === 'labor') {
        loadLaborAttendance(laborAttendanceDate, project.id);
        loadProjectLaborAttendanceHistory(project.id);
      }
    }
  }, [projectTab, attendanceSubTab, attendanceDate, laborAttendanceDate, loadDailyAttendance, loadLaborAttendance, loadProjectVendorAttendanceHistory, loadProjectLaborAttendanceHistory, project?.id]);

  const saveAllAttendance = async () => {
    setSavingAttendance(true);
    try {
      const payloadEntries = attendanceRows
        .filter((r) => r.dirty)
        .map((r) => ({
          project_vendor_id: r.project_vendor_id,
          attendance_date: attendanceDate,
          status: r.status,
          workers_count: r.workers_count,
          rate_per_worker: r.rate_per_worker,
          note: r.note,
        }));

      if (!payloadEntries.length) return;
      await api('/api/admin/project-management/attendance', {
        method: 'POST',
        body: JSON.stringify({
          attendance_date: attendanceDate,
          entries: payloadEntries,
          records: payloadEntries,
        }),
      });
      setMessage('Attendance saved for all vendors');
      refreshProjectData();
      loadDailyAttendance(attendanceDate);
      loadProjectVendorAttendanceHistory(project?.id);
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
      if (paymentsSubTab === 'vendor') {
        loadVendorPayments();
      } else if (paymentsSubTab === 'labor') {
        loadLaborPayments(project.id, laborPaymentFilterLabor, laborPaymentFilterFrom, laborPaymentFilterTo);
      }
    }
  }, [projectTab, paymentsSubTab, loadVendorPayments, loadLaborPayments, laborPaymentFilterLabor, laborPaymentFilterFrom, laborPaymentFilterTo, project?.id]);

  useEffect(() => {
    if (project?.id && (projectTab === 'labor' || (projectTab === 'payments' && paymentsSubTab === 'labor') || (projectTab === 'attendance' && attendanceSubTab === 'labor'))) {
      loadProjectLabors(project.id);
    }
  }, [projectTab, paymentsSubTab, attendanceSubTab, loadProjectLabors, project?.id]);

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
        transaction_reference: '',
      });
      refreshProjectData();
      loadVendorPayments();
    } catch (e) {
      setMessage(e.message);
      throw e;
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
          material_id: supplyForm.item_name ? await resolveMaterialId(supplyForm.item_name, supplyForm.material_id) : null,
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
      throw e;
    }
  };

  // ── Labor (Individual Worker) Handlers ─────────────────────────────────────
  useEffect(() => {
    if (projectTab === 'labor' && project?.id) {
      loadProjectLabors(project.id);
    }
  }, [projectTab, loadProjectLabors, project?.id]);

  const saveLabor = async (e) => {
    e.preventDefault();
    if (!project?.id) return;
    setModalError('');
    try {
      const payload = {
        project_id: project.id,
        name: laborForm.name,
        phone: laborForm.phone,
        trade: laborForm.trade,
        project_vendor_id: laborForm.project_vendor_id ? Number(laborForm.project_vendor_id) : null,
        daily_rate: Number(laborForm.daily_rate || 0),
        is_active: laborForm.is_active !== undefined ? laborForm.is_active : true,
      };

      if (editingLaborId) {
        await api(`/api/admin/project-management/labor/${editingLaborId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        setMessage('Labor worker updated successfully');
      } else {
        await api('/api/admin/project-management/labor', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setMessage('Labor worker added successfully');
      }
      setAddLaborModal(false);
      setEditingLaborId(null);
      setLockedContractorId(null);
      setModalError('');
      setLaborForm({ name: '', phone: '', trade: '', project_vendor_id: '', daily_rate: '', is_active: true });
      loadProjectLabors(project.id);
      refreshProjectData(project.id);
    } catch (err) {
      console.error('Error saving labor:', err);
      throw err;
      setModalError(err.message || 'Could not save laborer');
      setMessage(`❌ ${err.message || 'Could not save laborer'}`);
    }
  };

  /* Bulk checkbox controls intentionally removed; attendance is per worker. */
  const applyBulkStatus = (status) => {
    if (laborAttendanceDate !== today()) {
      setMessage(`❌ Purani date par attendance edit nahi kar sakte.`);
      return;
    }
    const selectedSet = new Set(selectedLaborIds);
    if (!selectedSet.size) {
      setMessage('Please select at least one worker first using the checkboxes.');
      return;
    }
    const mult = status === 'present' ? 1 : status === 'half_day' ? 0.5 : 0;
    setLaborAttendanceRows((prev) =>
      prev.map((r) => {
        const lid = r.labor_id || r.id;
        if (selectedSet.has(lid)) {
          return {
            ...r,
            status,
            dirty: true,
            wage_amount: Math.round(mult * Number(r.daily_rate || 0) * 100) / 100,
          };
        }
        return r;
      })
    );
    const label = status === 'present' ? 'Present' : status === 'half_day' ? 'Half Day' : 'Absent';
    setMessage(`✓ Marked ${selectedSet.size} worker(s) as ${label}. Click "Save Attendance" to finalize.`);
  };

  const saveAllLaborAttendance = async (customRows, includeUntouched = false) => {
    if (!project?.id) return;
    if (laborAttendanceDate !== today()) {
      setMessage(`❌ Sirf aaj ki date (${today()}) ki attendance save ki ja sakti hai.`);
      return;
    }
    const rowsToSave = (customRows || laborAttendanceRows).filter((row) =>
      includeUntouched ? (!row.is_marked || row.dirty) : row.dirty
    );
    if (!rowsToSave.length) {
      setMessage('Mark at least one worker before saving attendance.');
      return;
    }
    setSavingLaborAttendance(true);
    try {
      const payloadEntries = rowsToSave.map((r) => ({
        labor_id: Number(r.labor_id || r.id),
        attendance_date: laborAttendanceDate,
        status: r.status || 'present',
        overtime_hours: Number(r.overtime_hours || 0),
        wage_amount: Number(r.wage_amount || 0),
        note: r.note || '',
      }));

      await api('/api/admin/project-management/labor/attendance', {
        method: 'PUT',
        body: JSON.stringify({
          project_id: project.id,
          attendance_date: laborAttendanceDate,
          entries: payloadEntries,
          records: payloadEntries,
        }),
      });
      setMessage('✅ Labor attendance saved successfully');
      setSelectedLaborIds([]);
      loadLaborAttendance(laborAttendanceDate, project.id);
      loadProjectLabors(project.id);
      refreshProjectData(project.id);
      loadProjectLaborAttendanceHistory(project.id);
    } catch (e) {
      console.error('Error saving labor attendance:', e);
      setMessage(`❌ ${e.message || 'Could not save labor attendance'}`);
    } finally {
      setSavingLaborAttendance(false);
    }
  };

  const saveLaborPayment = async (e) => {
    e.preventDefault();
    if (!project?.id) return;
    try {
      if (editingLaborPaymentId) {
        await api(`/api/admin/project-management/labor/payments/${editingLaborPaymentId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            amount: Number(laborPaymentForm.amount),
            payment_date: laborPaymentForm.payment_date,
            mode: laborPaymentForm.mode,
            payment_type: laborPaymentForm.payment_type || 'wage',
            transaction_reference: laborPaymentForm.transaction_reference || null,
            note: laborPaymentForm.note,
          }),
        });
        setMessage('Labor payment updated successfully');
      } else {
        await api('/api/admin/project-management/labor/payments', {
          method: 'POST',
          body: JSON.stringify({
            labor_id: Number(laborPaymentForm.labor_id),
            amount: Number(laborPaymentForm.amount),
            payment_date: laborPaymentForm.payment_date,
            mode: laborPaymentForm.mode,
            payment_type: laborPaymentForm.payment_type || 'wage',
            transaction_reference: laborPaymentForm.transaction_reference || null,
            note: laborPaymentForm.note,
          }),
        });
        setMessage('Labor payment recorded successfully');
      }
      setLaborPaymentModal(false);
      setEditingLaborPaymentId(null);
      setLaborPaymentForm({ labor_id: '', amount: '', payment_date: today(), mode: 'cash', payment_type: 'wage', note: '', transaction_reference: '' });
      loadLaborPayments(project.id, laborPaymentFilterLabor, laborPaymentFilterFrom, laborPaymentFilterTo);
      loadProjectLabors(project.id);
      if (selectedLabor) {
        openLaborDetail(selectedLabor);
      }
      refreshProjectData(project.id);
    } catch (e) {
      setMessage(e.message);
      throw e;
    }
  };

  return (
    <section className={`pm-container${isDarkMode ? ' dark-mode' : ''}`}>
      <SubmitToast toast={submitAction.toast} onDismiss={submitAction.dismissToast} />
      {/* ── TOP NAV BAR ───────────────────────────────────────────────────── */}
      <div className="bar" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {screen !== (isAgent ? 'projects' : 'parties') && (
            <button
              className="muted"
              onClick={() => {
                if (screen === 'project' && party && !isAgent) setScreen('party');
                else if (screen === 'projectForm' && party && !isAgent) setScreen('party');
                else setScreen(isAgent ? 'projects' : 'parties');
                updateProjectUrl(null);
              }}
            >
              &larr; Back
            </button>
          )}
          <h2 style={{ margin: 0, fontSize: 20 }}>Project Management Party</h2>
          {!isAgent && (
            <span style={{ fontSize: 12, background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
              {role.toUpperCase()}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            className={screen === 'reports' ? 'active-btn' : 'muted'}
            onClick={openReportsScreen}
            style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
          >
            📊 Reports &amp; CSV
          </button>
          {screen === 'parties' && !isAgent && (
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
                <tr
                  key={p.id}
                  className="clickable-row"
                  onClick={() => showParty(p.id)}
                  title="Click to view party overview & projects"
                >
                  <td>
                    <b>{p.name}</b>
                    <br />
                    <span style={{ fontSize: 11, color: '#64748b' }}>{p.phone || p.email || '—'}</span>
                  </td>
                  <td>{p.project_count}</td>
                  <td style={{ fontWeight: 600 }}>{INR(p.total_contract_value)}</td>
                  <td style={{ color: '#16a34a', fontWeight: 600 }}>{INR(p.total_received)}</td>
                  <td style={{ color: '#dc2626', fontWeight: 600 }}>{INR(p.total_pending)}</td>
                  <td className="actions" style={{ justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => showParty(p.id)}>View Party</button>
                    {!isAgent && (
                      <button
                        className="muted"
                        onClick={() => {
                          setPartyForm(p);
                          setScreen('partyForm');
                        }}
                      >
                        Edit
                      </button>
                    )}
                    {!isAgent && (
                      <button className="danger" onClick={() => del('party', p.id)}>
                        Delete
                      </button>
                    )}
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

      {screen === 'projects' && (
        <>
          {isAgent && agentSpecs.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: '#64748b' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔒</div>
              <h3 style={{ margin: '0 0 8px', color: '#0f172a', fontSize: '18px' }}>No access assigned. Contact admin.</h3>
              <p style={{ margin: 0, fontSize: '13px' }}>Your account does not have any active project specializations. Please contact your administrator to grant access.</p>
            </div>
          ) : isAgent && allProjectsList.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: '#64748b' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📋</div>
              <h3 style={{ margin: '0 0 8px', color: '#0f172a', fontSize: '18px' }}>No access assigned. Contact admin.</h3>
              <p style={{ margin: 0, fontSize: '13px' }}>You have not been assigned to any projects yet. Please contact your administrator.</p>
            </div>
          ) : (
            <>
              <div className="bar" style={{ marginBottom: 12 }}>
                <input
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ maxWidth: 300 }}
                />
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Project</th>
                    {hasAgentPayment && <th>Contract Value</th>}
                    {hasAgentPayment && <th>Received</th>}
                    {hasAgentPayment && <th>Pending</th>}
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allProjectsList.map((p) => (
                    <tr
                      key={p.id}
                      className="clickable-row"
                      onClick={() => showProject(p.id)}
                      title="Click to open project dashboard"
                    >
                      <td>
                        <b>{p.name}</b>
                        <br />
                        <span style={{ fontSize: 11, color: '#64748b' }}>{p.site_address || 'No site address'}</span>
                      </td>
                      {hasAgentPayment && <td>{INR(p.contract_value)}</td>}
                      {hasAgentPayment && <td style={{ color: '#16a34a' }}>{INR(p.received)}</td>}
                      {hasAgentPayment && <td style={{ color: '#dc2626' }}>{INR(p.pending)}</td>}
                      <td>
                        <span className={`badge ${p.status === 'completed' ? 'badge-completed' : 'badge-active'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="actions" style={{ justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => showProject(p.id)}>Overview</button>
                      </td>
                    </tr>
                  ))}
                  {allProjectsList.length === 0 && (
                    <tr>
                      <td colSpan={hasAgentPayment ? 6 : 3} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                        No assigned projects found.
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
        </>
      )}

      {/* ── 2. ADD/EDIT PARTY FORM ────────────────────────────────────────── */}
      {screen === 'partyForm' && (
        <form onSubmit={(e) => submitAction.submit('party', () => saveParty(e), { successMessage: partyForm.id ? 'Party updated successfully' : 'Party added successfully', onError: setMessage })}>
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
            <button type="submit" disabled={submitAction.isSubmitting('party')}>{submitAction.isSubmitting('party') ? 'Saving…' : (partyForm.id ? 'Save Party' : 'Add Party')}</button>
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

            {(() => {
              const projectsList = party.projects || [];
              const liveContractValue = projectsList.length > 0
                ? projectsList.reduce((acc, p) => acc + Number(p.contract_value || 0), 0)
                : Number(party.party.total_contract_value || 0);
              const liveReceived = projectsList.length > 0
                ? projectsList.reduce((acc, p) => acc + Number(p.received || 0), 0)
                : Number(party.party.total_received || 0);
              const livePending = liveContractValue - liveReceived;
              const liveExpense = projectsList.length > 0
                ? projectsList.reduce((acc, p) => acc + Number(p.total_expense || 0), 0)
                : Number(party.party.total_expense || 0);
              const liveProfit = liveReceived - liveExpense;

              return (
                <div className="stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
                  <div className="stat">
                    <small>Contract Value</small>
                    <b>{INR(liveContractValue)}</b>
                  </div>
                  <div className="stat">
                    <small>Received</small>
                    <b style={{ color: '#16a34a' }}>{INR(liveReceived)}</b>
                  </div>
                  <div className="stat">
                    <small>Pending</small>
                    <b style={{ color: '#dc2626' }}>{INR(livePending)}</b>
                  </div>
                  {!isSupervisor && (
                    <>
                      <div className="stat">
                        <small>Total Party Expense</small>
                        <b style={{ color: '#b45309' }}>{INR(liveExpense)}</b>
                      </div>
                      <div className="stat" style={{ background: Number(liveProfit) >= 0 ? '#f0fdf4' : '#fef2f2' }}>
                        <small style={{ color: Number(liveProfit) >= 0 ? '#166534' : '#991b1b' }}>Net Profit</small>
                        <b style={{ color: Number(liveProfit) >= 0 ? '#16a34a' : '#dc2626' }}>
                          {INR(liveProfit)}
                        </b>
                      </div>
                    </>
                  )}
                  <div className="stat">
                    <small>Projects</small>
                    <b>{party.projects.length}</b>
                  </div>
                </div>
              );
            })()}
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
                <tr
                  key={p.id}
                  className="clickable-row"
                  onClick={() => showProject(p.id)}
                  title="Click to open project dashboard"
                >
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
                  <td className="actions" style={{ justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => showProject(p.id)}>Overview</button>
                    {!isAgent && (
                      <button
                        className="muted"
                        onClick={() => {
                          setProjectForm(p);
                          setScreen('projectForm');
                        }}
                      >
                        Edit
                      </button>
                    )}
                    {!isAgent && !isSupervisor && (
                      <button
                        className="danger"
                        onClick={() => openDeleteProjectModal(p, party?.party?.name)}
                      >
                        Delete
                      </button>
                    )}
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
        <form onSubmit={(e) => submitAction.submit('project', () => saveProject(e), { successMessage: projectForm.id ? 'Project updated successfully' : 'Project added successfully', onError: setMessage })}>
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
            <button type="submit" disabled={submitAction.isSubmitting('project')}>{submitAction.isSubmitting('project') ? 'Saving…' : (projectForm.id ? 'Save Edit Project' : 'Add Project')}</button>
          </p>
        </form>
      )}

      {/* ── 5. PROJECT OVERVIEW & ALL PHASE 1, 2, 3 TABS ────────────────────── */}
      {screen === 'project' && project && (
        <>
          {isAgent && agentSpecs.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: '#64748b' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔒</div>
              <h3 style={{ margin: '0 0 8px', color: '#0f172a', fontSize: '18px' }}>No access assigned. Contact admin.</h3>
              <p style={{ margin: 0, fontSize: '13px' }}>Your account does not have any active project specializations. Please contact your administrator to grant access.</p>
            </div>
          ) : (
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
                  {!isAgent && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      {!isSupervisor && (
                        <button onClick={() => setAssignAgentModal(true)}>+ Assign Agent</button>
                      )}
                      <button
                        className="muted"
                        onClick={() => {
                          setProjectForm(project);
                          setScreen('projectForm');
                        }}
                      >
                        Edit Project
                      </button>
                      {!isSupervisor && (
                        <button
                          className="danger"
                          onClick={() => openDeleteProjectModal(project, party?.party?.name || project.party_name)}
                        >
                          Delete Project
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Assigned Agents */}
                {projectAgents.length > 0 && (
                  <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600, alignSelf: 'center' }}>Agents:</span>
                    {projectAgents.map((a) => (
                      <span key={a.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600, color: '#1d4ed8' }}>
                        {a.name}
                        {!isSupervisor && !isAgent && (
                          <button onClick={() => removeAgent(a.id)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 13, lineHeight: 1, padding: '0 2px' }}>&times;</button>
                        )}
                      </span>
                    ))}
                  </div>
                )}

                {/* Assign Agent Modal */}
                {assignAgentModal && (
                  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#fff', borderRadius: 10, padding: '1.5rem', width: 360, boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}>
                      <h4 style={{ margin: '0 0 12px' }}>Assign Agent to Project</h4>
                      <select
                        value={assigningAgentId}
                        onChange={(e) => setAssigningAgentId(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #e2e8f0', marginBottom: 12 }}
                      >
                        <option value="">-- Select Agent --</option>
                        {allAgentsList
                          .filter((a) => !projectAgents.find((pa) => pa.id === a.id))
                          .map((a) => (
                            <option key={a.id} value={a.id}>{a.name} ({a.city || 'No city'})</option>
                          ))}
                      </select>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => submitAction.submit('agent', assignAgent, { successMessage: 'Agent assigned successfully', onError: setModalError })} disabled={!assigningAgentId || submitAction.isSubmitting('agent')}>{submitAction.isSubmitting('agent') ? 'Adding…' : 'Assign Agent'}</button>
                        <button className="muted" disabled={submitAction.isSubmitting('agent')} onClick={() => { setAssignAgentModal(false); setAssigningAgentId(''); }}>Cancel</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Financial Overview Cards */}
                <div className="stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
                  {hasAgentPayment && (
                    <>
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
                    </>
                  )}
                  {!isSupervisor && (
                    <>
                      {hasAgentLabor && (
                        <div className="stat">
                          <small>Total Labour Cost</small>
                          <b>{INR(project.total_labour_cost)}</b>
                          <span style={{ fontSize: 10, color: '#64748b', display: 'block', marginTop: 2 }}>
                            Vendor: {INR(project.vendor_labour_cost ?? (Number(project.daily_labour_cost || 0) + Number(project.contract_labour_cost || 0)))} | Labor: {INR(project.individual_labour_cost || 0)}
                          </span>
                        </div>
                      )}
                      {hasAgentConstruction && (
                        <>
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
                        </>
                      )}
                      {hasAgentPayment && (
                        <>
                          <div className="stat">
                            <small>Total Project Expense</small>
                            <b style={{ color: '#b45309' }}>{INR(project.total_expense)}</b>
                          </div>
                          <div className="stat">
                            <small>Paid to Vendors</small>
                            <b style={{ color: '#ea580c' }}>{INR(project.total_paid_to_vendors)}</b>
                          </div>
                          <div className="stat">
                            <small>Paid to Suppliers</small>
                            <b style={{ color: '#0284c7' }}>{INR(project.total_paid_to_suppliers ?? projectSuppliers.reduce((sum, s) => sum + (Number(s.total_paid) || 0), 0))}</b>
                          </div>
                          <div className="stat" style={{ background: Number(project.profit_or_loss ?? project.profit_so_far) >= 0 ? '#f0fdf4' : '#fef2f2', border: `1px solid ${Number(project.profit_or_loss ?? project.profit_so_far) >= 0 ? '#bbf7d0' : '#fecaca'}` }}>
                            <small style={{ color: Number(project.profit_or_loss ?? project.profit_so_far) >= 0 ? '#166534' : '#991b1b' }}>Profit So Far</small>
                            <b style={{ color: Number(project.profit_or_loss ?? project.profit_so_far) >= 0 ? '#16a34a' : '#dc2626' }}>
                              {INR(project.profit_or_loss ?? project.profit_so_far)}
                            </b>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Subtabs Navigation */}
              {!selectedVendor && !selectedLabor && !timelineMaterial ? (
                <>
                  {/* 5 Main Tabs Navigation: Vendors, Labor, Attendance, Payments, Construction */}
                  <div className="subtabs" style={{ marginBottom: '1.25rem' }}>
                    {allowedMainTabs.includes('vendors') && (
                      <button
                        className={projectTab === 'vendors' ? 'active' : ''}
                        onClick={() => { setSelectedSupplier(null); handleSectionChange('vendors'); setContractorMenuOpen((open) => !open); }}
                      >
                        👷 Contractors ({projectVendors.length}) ▾
                      </button>
                    )}
                    {allowedMainTabs.includes('labor') && (
                      <button
                        className={projectTab === 'labor' ? 'active' : ''}
                        onClick={() => { setSelectedSupplier(null); setContractorMenuOpen(false); handleSectionChange('labor'); }}
                      >
                        🦺 Labor ({projectLabors.length})
                      </button>
                    )}
                    {allowedMainTabs.includes('attendance') && (
                      <button
                        className={projectTab === 'attendance' ? 'active' : ''}
                        onClick={() => { setSelectedSupplier(null); setContractorMenuOpen(false); handleSectionChange('attendance'); }}
                      >
                        📅 Attendance
                      </button>
                    )}
                    {allowedMainTabs.includes('payments') && (
                      <button
                        className={projectTab === 'payments' ? 'active' : ''}
                        onClick={() => { setSelectedSupplier(null); setContractorMenuOpen(false); handleSectionChange('payments'); }}
                      >
                        💳 Payments
                      </button>
                    )}
                    {allowedMainTabs.includes('construction') && (
                      <button
                        className={projectTab === 'construction' ? 'active' : ''}
                        onClick={() => { setSelectedSupplier(null); setContractorMenuOpen(false); handleSectionChange('construction'); }}
                      >
                        🏗️ Construction
                      </button>
                    )}
                    {allowedMainTabs.includes('suppliers') && (
                      <button
                        className={projectTab === 'suppliers' ? 'active' : ''}
                        onClick={() => { setSelectedSupplier(null); setContractorMenuOpen(false); handleSectionChange('suppliers'); }}
                      >
                        🚚 Suppliers ({projectSuppliers.length})
                      </button>
                    )}
                  </div>

                  {contractorMenuOpen && projectTab === 'vendors' && (
                    <div className="card" style={{ margin: '-8px 0 16px', padding: 12, border: '1px solid #bfdbfe', background: '#f8fbff' }}>
                      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: '#1e3a8a' }}>Select contractor / vendor type</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        <button className={vendorTypeFilter === 'all' ? 'active-btn' : 'muted'} onClick={() => setVendorTypeFilter('all')}>All Contractors</button>
                        {contractorTrades.map((trade) => (
                          <button key={trade} className={vendorTypeFilter === trade.toLowerCase() ? 'active-btn' : 'muted'} onClick={() => setVendorTypeFilter(trade.toLowerCase())}>{trade}</button>
                        ))}
                      </div>
                      {vendorTypeFilter !== 'all' && vendorTypeFilter !== 'general vendor' && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid #dbeafe', alignItems: 'center' }}>
                          <strong style={{ fontSize: 13, padding: '4px 2px' }}>
                            👷 {contractorTrades.find((trade) => trade.toLowerCase() === vendorTypeFilter) || vendorTypeFilter} team:
                          </strong>
                          {(() => {
                            const matching = projectVendors.filter((pv) => matchesContractorType(pv.trade, vendorTypeFilter));
                            const hasMatching = matching.length > 0;
                            return (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!hasMatching) {
                                      setMessage(`⚠️ Pehle ${vendorTypeFilter} contractor add karein. Click "+ Add Contractor" to assign one.`);
                                      return;
                                    }
                                    const targetVendor = matching[0];
                                    setLockedContractorId(String(targetVendor.id));
                                    setLaborForm({ name: '', phone: '', trade: targetVendor.trade || '', project_vendor_id: String(targetVendor.id), daily_rate: '', is_active: true });
                                    setEditingLaborId(null);
                                    setModalError('');
                                    setAddLaborModal(true);
                                  }}
                                  style={{ opacity: hasMatching ? 1 : 0.65 }}
                                >
                                  + Add Labour
                                </button>
                                <button
                                  type="button"
                                  className="muted"
                                  onClick={() => {
                                    if (!hasMatching) {
                                      setMessage(`⚠️ Pehle ${vendorTypeFilter} contractor add karein.`);
                                      return;
                                    }
                                    setContractorMenuOpen(false);
                                    handleSectionChange('attendance');
                                    setAttendanceSubTab('labor');
                                    setLaborAttendanceSection('contractor');
                                    setAttendanceContractorFilter(String(matching[0].id));
                                  }}
                                  style={{ opacity: hasMatching ? 1 : 0.65 }}
                                >
                                  📅 Labour Attendance
                                </button>
                                {!hasMatching && (
                                  <span style={{ fontSize: 12, color: '#dc2626' }}>
                                    (No {vendorTypeFilter} assigned yet — pehle contractor add karein)
                                  </span>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── 1. VENDORS TAB ────────────────────────────────────────── */}
                  {/* ── TAB 1: VENDORS ON THIS PROJECT ──────────────────────────── */}
              {projectTab === 'vendors' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                    <h4 style={{ margin: 0, fontSize: 16 }}>Project Contractors &amp; Subcontractors</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <button
                        onClick={() => {
                          setModalError('');
                          setContractorSearch('');
                          loadContractorsList('all', '');
                          setAddVendorModal(true);
                        }}
                      >
                        + Add Contractor
                      </button>
                    </div>
                  </div>

                  <table>
                    <thead>
                      <tr>
                        <th>Vendor</th>
                        <th>Trade</th>
                        <th>Work Description</th>
                        <th>Pay Type</th>
                        {(!isAgent || hasAgentPayment) && <th>Rate / Contract</th>}
                        {(!isAgent || hasAgentPayment) && <th>Total Earned</th>}
                        {!isSupervisor && (!isAgent || hasAgentPayment) && <th>Total Paid</th>}
                        {!isSupervisor && (!isAgent || hasAgentPayment) && <th>Balance</th>}
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectVendors.filter((pv) => matchesContractorType(pv.trade, vendorTypeFilter)).map((pv) => {
                        const earnedVal = pv.total_earned ?? pv.earned ?? 0;
                        const paidVal = pv.total_paid ?? pv.paid ?? 0;
                        const dueVal = pv.balance_due ?? pv.balance ?? (Number(earnedVal) - Number(paidVal));
                        const isAdvance = Number(dueVal || 0) < 0;
                        const isDue = Number(dueVal || 0) > 0;
                        return (
                          <tr
                            key={pv.id}
                            className="clickable-row"
                            onClick={() => openVendorDetail(pv)}
                            title="Click to open contractor detail page"
                          >
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
                            {(!isAgent || hasAgentPayment) && (
                              <td>
                                {pv.pay_type === 'daily_wage' ? `${INR(pv.daily_rate)}/day` : INR(pv.contract_amount)}
                              </td>
                            )}
                            {(!isAgent || hasAgentPayment) && (
                              <td style={{ fontWeight: 600 }}>{INR(earnedVal)}</td>
                            )}
                            {!isSupervisor && (!isAgent || hasAgentPayment) && <td style={{ color: '#16a34a' }}>{INR(paidVal)}</td>}
                            {!isSupervisor && (!isAgent || hasAgentPayment) && (
                              <td>
                                {isDue ? (
                                  <span style={{ fontWeight: 700, color: '#ea580c' }}>
                                    Due: {INR(dueVal)}
                                  </span>
                                ) : isAdvance ? (
                                  <span className="badge badge-active" style={{ background: '#dcfce7', color: '#15803d', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                    Advance: {INR(Math.abs(dueVal))}
                                  </span>
                                ) : (
                                  <span style={{ color: '#64748b', fontWeight: 600 }}>Settled (₹0)</span>
                                )}
                              </td>
                            )}
                            <td>
                              <span className={`badge ${pv.status === 'completed' ? 'badge-completed' : 'badge-active'}`}>
                                {pv.status}
                              </span>
                            </td>
                            <td className="actions" style={{ justifyContent: 'flex-end', display: 'flex', gap: 6, flexWrap: 'wrap' }} onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                className="muted"
                                style={{ padding: '4px 8px', fontSize: 12 }}
                                onClick={() => openVendorDetail(pv)}
                              >
                                👥 Team &amp; Details
                              </button>
                              <button onClick={() => openVendorDetail(pv)}>View Details &amp; History &rarr;</button>
                            </td>
                          </tr>
                        );
                      })}
                      {projectVendors.filter((pv) => matchesContractorType(pv.trade, vendorTypeFilter)).length === 0 && (
                        <tr>
                          <td colSpan={(!isAgent || hasAgentPayment) ? (isSupervisor ? 8 : 10) : 6} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                            {vendorTypeFilter === 'all'
                              ? 'No contractors assigned to this project yet.'
                              : `No ${vendorTypeFilter.toLowerCase().endsWith('contractor') ? vendorTypeFilter : `${vendorTypeFilter} contractor`} assigned to this project.`} Click &ldquo;+ Add Contractor&rdquo; above.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

                  {/* ── 2. LABOR TAB ──────────────────────────────────────────── */}
                  {projectTab === 'labor' && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
                        <h4 style={{ margin: 0, fontSize: 16 }}>Laborers &amp; Direct Workers</h4>
                        <button
                          onClick={() => {
                            setLockedContractorId(null);
                            setLaborForm({ name: '', phone: '', trade: '', project_vendor_id: '', daily_rate: '', is_active: true });
                            setEditingLaborId(null);
                            setModalError('');
                            setAddLaborModal(true);
                          }}
                        >
                          + Add Labor
                        </button>
                      </div>

                      {/* Filter Chips Bar */}
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 14, background: '#f8fafc', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>Filter:</span>
                        <button
                          type="button"
                          className={laborTypeFilter === 'all' ? 'active-btn' : 'muted'}
                          onClick={() => setLaborTypeFilter('all')}
                          style={{ fontSize: 12, padding: '4px 10px' }}
                        >
                          All ({projectLabors.length})
                        </button>
                        <button
                          type="button"
                          className={laborTypeFilter === 'independent' ? 'active-btn' : 'muted'}
                          onClick={() => setLaborTypeFilter('independent')}
                          style={{ fontSize: 12, padding: '4px 10px' }}
                        >
                          ⚡ Independent ({projectLabors.filter((l) => !l.project_vendor_id && !l.vendor_name).length})
                        </button>
                        <button
                          type="button"
                          className={laborTypeFilter === 'contractor' ? 'active-btn' : 'muted'}
                          onClick={() => setLaborTypeFilter('contractor')}
                          style={{ fontSize: 12, padding: '4px 10px' }}
                        >
                          🏢 Contractor Teams ({projectLabors.filter((l) => l.project_vendor_id || l.vendor_name).length})
                        </button>
                        {projectVendors.length > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
                            <span style={{ fontSize: 11, color: '#64748b' }}>By Contractor:</span>
                            <select
                              value={!['all', 'independent', 'contractor'].includes(laborTypeFilter) ? laborTypeFilter : ''}
                              onChange={(e) => setLaborTypeFilter(e.target.value || 'all')}
                              style={{ fontSize: 12, padding: '4px 8px', maxWidth: 220 }}
                            >
                              <option value="">-- All Contractors --</option>
                              {projectVendors.map((pv) => (
                                <option key={pv.id} value={String(pv.id)}>
                                  🏢 {pv.vendor_name} ({pv.trade || 'Vendor'})
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>

                      <table>
                      <thead>
                        <tr>
                          <th>Labor Name</th>
                          <th>Trade</th>
                          <th>Contractor / Vendor</th>
                          <th>Daily Rate</th>
                          <th>Total Earned</th>
                          {!isSupervisor && <th>Total Paid</th>}
                          {!isSupervisor && <th>Balance</th>}
                          <th>Status</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projectLabors
                          .filter((lab) => {
                            if (laborTypeFilter === 'all') return true;
                            if (laborTypeFilter === 'independent') return !lab.project_vendor_id && !lab.vendor_name;
                            if (laborTypeFilter === 'contractor') return Boolean(lab.project_vendor_id || lab.vendor_name);
                            return String(lab.project_vendor_id) === String(laborTypeFilter);
                          })
                          .map((lab) => {
                          const balVal = Number(lab.balance_due ?? (Number(lab.total_earned || 0) - Number(lab.total_paid || 0)));
                          const isAdvance = balVal < 0;
                          const isDue = balVal > 0;
                          return (
                            <tr
                              key={lab.id}
                              className="clickable-row"
                              onClick={() => openLaborDetail(lab)}
                              title="Click to open laborer detail page"
                            >
                              <td>
                                <b>{lab.name}</b>
                                {lab.phone && <div style={{ fontSize: 11, color: '#64748b' }}>{lab.phone}</div>}
                              </td>
                              <td>{lab.trade || 'Helper'}</td>
                              <td>
                                {lab.vendor_name || lab.contractor_name ? (
                                  <span style={{ fontSize: 11, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
                                    🏢 Via {lab.vendor_name || lab.contractor_name}
                                  </span>
                                ) : (
                                  <span style={{ fontSize: 11, background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
                                    ⚡ Independent
                                  </span>
                                )}
                              </td>
                              <td style={{ fontWeight: 600 }}>{INR(lab.daily_rate)}/day</td>
                              <td style={{ fontWeight: 600 }}>{INR(lab.total_earned)}</td>
                              {!isSupervisor && <td style={{ color: '#16a34a', fontWeight: 600 }}>{INR(lab.total_paid)}</td>}
                              {!isSupervisor && (
                                <td>
                                  {isDue ? (
                                    <span style={{ fontWeight: 700, color: '#ea580c' }}>
                                      Due: {INR(balVal)}
                                    </span>
                                  ) : isAdvance ? (
                                    <span className="badge badge-active" style={{ background: '#dcfce7', color: '#15803d', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                      Advance: {INR(Math.abs(balVal))}
                                    </span>
                                  ) : (
                                    <span style={{ color: '#64748b', fontWeight: 600 }}>Settled (₹0)</span>
                                  )}
                                </td>
                              )}
                              <td>
                                <span className={`badge ${lab.is_active ? 'badge-active' : 'badge-completed'}`}>
                                  {lab.is_active ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="actions" style={{ justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => openLaborDetail(lab)}>
                                  View Details &rarr;
                                </button>
                                <button
                                  className="muted"
                                  onClick={() => {
                                    setLockedContractorId(lab.project_vendor_id ? String(lab.project_vendor_id) : null);
                                    setLaborForm({
                                      name: lab.name,
                                      phone: lab.phone || '',
                                      trade: lab.trade || '',
                                      project_vendor_id: lab.project_vendor_id ? String(lab.project_vendor_id) : '',
                                      daily_rate: lab.daily_rate,
                                      is_active: lab.is_active,
                                    });
                                    setEditingLaborId(lab.id);
                                    setModalError('');
                                    setAddLaborModal(true);
                                  }}
                                >
                                  Edit
                                </button>
                                {!isAgent && (
                                  <button className="danger" onClick={() => del('labor', lab.id)}>
                                    Delete
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                        {projectLabors.filter((lab) => {
                          if (laborTypeFilter === 'all') return true;
                          if (laborTypeFilter === 'independent') return !lab.project_vendor_id && !lab.vendor_name;
                          if (laborTypeFilter === 'contractor') return Boolean(lab.project_vendor_id || lab.vendor_name);
                          return String(lab.project_vendor_id) === String(laborTypeFilter);
                        }).length === 0 && (
                          <tr>
                            <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                              {laborTypeFilter === 'independent'
                                ? 'No independent laborers found for this project.'
                                : laborTypeFilter !== 'all'
                                ? 'No laborers found for this selected contractor.'
                                : 'No laborers added to this project yet. Click "+ Add Labor" above.'}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    </div>
                  )}

                  {/* ── 3. ATTENDANCE TAB ─────────────────────────────────────── */}
                  {projectTab === 'attendance' && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {allowedAttendanceSubTabs.includes('vendor') && (
                            <button
                              className={attendanceSubTab === 'vendor' ? 'active-btn' : 'muted'}
                              onClick={() => handleAttendanceSubChange('vendor')}
                            >
                              Contractors Attendance
                            </button>
                          )}
                          {allowedAttendanceSubTabs.includes('labor') && (
                            <button
                              className={attendanceSubTab === 'labor' ? 'active-btn' : 'muted'}
                              onClick={() => handleAttendanceSubChange('labor')}
                            >
                              Labor Attendance
                            </button>
                          )}
                        </div>

                        {attendanceSubTab === 'vendor' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 13, fontWeight: 600 }}>Attendance Date:</span>
                            <input
                              type="date"
                              value={attendanceDate}
                              onChange={(e) => {
                                setAttendanceDate(e.target.value);
                                loadDailyAttendance(e.target.value);
                              }}
                              style={{ maxWidth: 170 }}
                            />
                            <button onClick={saveAllAttendance} disabled={savingAttendance || !attendanceRows.some((row) => row.dirty)}>
                              {savingAttendance ? 'Saving...' : `💾 Save Attendance (${attendanceRows.filter((row) => row.dirty).length} marked)`}
                            </button>
                            {attendanceRows.some((r) => r.is_marked) ? (
                              <span style={{ fontSize: 12, padding: '4px 8px', borderRadius: 4, background: '#dcfce7', color: '#166534', fontWeight: 600 }}>
                                ✓ Marked for {attendanceDate}
                                {attendanceRows.find((r) => r.created_by)?.created_by ? ` (by ${attendanceRows.find((r) => r.created_by)?.created_by})` : ''}
                              </span>
                            ) : (
                              <span style={{ fontSize: 12, padding: '4px 8px', borderRadius: 4, background: '#fef3c7', color: '#92400e', fontWeight: 600 }}>
                                ⏳ Not yet saved for {attendanceDate}
                              </span>
                            )}
                          </div>
                        )}

                        {attendanceSubTab === 'labor' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 13, fontWeight: 600 }}>Date:</span>
                            <input
                              type="date"
                              value={laborAttendanceDate}
                              max={today()}
                              onChange={(e) => {
                                setLaborAttendanceDate(e.target.value);
                                loadLaborAttendance(e.target.value, project.id);
                              }}
                              style={{ maxWidth: 160 }}
                            />
                            {laborAttendanceDate !== today() && (
                              <button
                                type="button"
                                className="active-btn"
                                style={{ fontSize: 12, padding: '4px 10px' }}
                                onClick={() => {
                                  setLaborAttendanceDate(today());
                                  loadLaborAttendance(today(), project.id);
                                }}
                              >
                                ↩️ Go to Today ({today()})
                              </button>
                            )}
                            <button
                              onClick={() => saveAllLaborAttendance()}
                              disabled={savingLaborAttendance || laborAttendanceDate !== today()}
                              style={{ opacity: laborAttendanceDate !== today() ? 0.6 : 1 }}
                            >
                              {savingLaborAttendance ? 'Saving...' : '💾 Save Attendance'}
                            </button>
                            {laborAttendanceRows.some((r) => r.is_marked) ? (
                              <span style={{ fontSize: 12, padding: '4px 8px', borderRadius: 4, background: '#dcfce7', color: '#166534', fontWeight: 600 }}>
                                ✓ Marked for {laborAttendanceDate}
                              </span>
                            ) : (
                              <span style={{ fontSize: 12, padding: '4px 8px', borderRadius: 4, background: '#fef3c7', color: '#92400e', fontWeight: 600 }}>
                                ⏳ Not yet saved for {laborAttendanceDate}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {attendanceSubTab === 'labor' && laborAttendanceDate !== today() && (
                        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', borderRadius: 8, padding: '8px 14px', fontSize: 12, margin: '10px 0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span>🔒</span>
                          <span>
                            <b>Past Date View ({laborAttendanceDate}):</b> Sirf aaj ki date ({today()}) ki attendance mark/edit ki ja sakti hai. Purani date ki attendance view mode me locked hai.
                          </span>
                          <button
                            type="button"
                            className="active-btn"
                            style={{ marginLeft: 'auto', fontSize: 11, padding: '3px 8px' }}
                            onClick={() => {
                              setLaborAttendanceDate(today());
                              loadLaborAttendance(today(), project.id);
                            }}
                          >
                            Jump to Today
                          </button>
                        </div>
                      )}

                      {attendanceSubTab === 'vendor' && (
                        <div>
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
                          <td>
                            <b>{row.vendor_name}</b>
                            {row.has_linked_labor && (
                              <div style={{ fontSize: 11, color: '#1d4ed8', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '2px 6px', borderRadius: 4, display: 'inline-block', marginTop: 3 }}>
                                👥 Has Team
                              </div>
                            )}
                          </td>
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
                                    next[idx].dirty = true;
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

                  {/* Contractors Attendance History Log */}
                  <div style={{ marginTop: 24, borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
                    <h4 style={{ margin: '0 0 10px', fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
                      📋 Contractors Attendance History
                      <span style={{ fontSize: 12, color: '#64748b', fontWeight: 400 }}>
                        ({projectVendorAttendanceHistory.length} records)
                      </span>
                    </h4>
                    {projectVendorAttendanceHistory.length > 0 ? (
                      <table>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Vendor</th>
                            <th>Trade</th>
                            <th>Status</th>
                            <th>Workers</th>
                            <th>Rate / Worker</th>
                            <th>Wage Amount</th>
                            <th>Marked By</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projectVendorAttendanceHistory.map((h) => {
                            const dateStr = typeof h.attendance_date === 'string' ? h.attendance_date.slice(0, 10) : new Date(h.attendance_date).toISOString().slice(0, 10);
                            return (
                              <tr
                                key={h.id}
                                className="clickable-row"
                                onClick={() => {
                                  const pv = projectVendors.find((v) => Number(v.id) === Number(h.project_vendor_id));
                                  if (pv) openVendorDetail(pv);
                                }}
                                title="Click to open contractor detail page"
                              >
                                <td><b>{dateStr}</b></td>
                                <td>{h.vendor_name}</td>
                                <td>{h.trade || '—'}</td>
                                <td>
                                  <span className={`badge badge-${h.status === 'present' ? 'active' : h.status === 'half_day' ? 'warning' : 'danger'}`}>
                                    {h.status === 'present' ? 'Present' : h.status === 'half_day' ? 'Half Day' : 'Absent'}
                                  </span>
                                </td>
                                <td>{h.workers_count || 1}</td>
                                <td>{INR(h.rate_per_worker)}</td>
                                <td style={{ fontWeight: 600, color: '#16a34a' }}>{INR(h.wage_amount)}</td>
                                <td style={{ fontSize: 12, color: '#64748b' }}>{h.created_by || '—'}</td>
                                <td onClick={(e) => e.stopPropagation()}>
                                  <button
                                    type="button"
                                    className="muted"
                                    style={{ padding: '2px 8px', fontSize: 11 }}
                                    onClick={() => {
                                      setAttendanceDate(dateStr);
                                      loadDailyAttendance(dateStr);
                                    }}
                                  >
                                    View / Edit Date
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <p style={{ color: '#64748b', fontSize: 13, margin: '8px 0' }}>
                        No attendance recorded yet for this project.
                      </p>
                    )}
                  </div>
                </div>
              )}

                      {attendanceSubTab === 'labor' && (
                        <div>
                          {/* Sub-view Section Toggle & Filters */}
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 14, background: '#f8fafc', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                            <strong style={{ fontSize: 13, color: '#334155' }}>Section:</strong>
                            <button
                              type="button"
                              className={laborAttendanceSection === 'all' ? 'active-btn' : 'muted'}
                              onClick={() => setLaborAttendanceSection('all')}
                              style={{ fontSize: 12, padding: '4px 10px' }}
                            >
                              All Workers ({laborAttendanceRows.length})
                            </button>
                            <button
                              type="button"
                              className={laborAttendanceSection === 'direct' ? 'active-btn' : 'muted'}
                              onClick={() => setLaborAttendanceSection('direct')}
                              style={{ fontSize: 12, padding: '4px 10px' }}
                            >
                              ⚡ Direct (Independent) ({laborAttendanceRows.filter((r) => !r.project_vendor_id && !r.vendor_name).length})
                            </button>
                            <button
                              type="button"
                              className={laborAttendanceSection === 'contractor' ? 'active-btn' : 'muted'}
                              onClick={() => setLaborAttendanceSection('contractor')}
                              style={{ fontSize: 12, padding: '4px 10px' }}
                            >
                              🏢 Contractor Teams ({laborAttendanceRows.filter((r) => r.project_vendor_id || r.vendor_name).length})
                            </button>

                            {laborAttendanceSection === 'contractor' && projectVendors.length > 0 && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
                                <span style={{ fontSize: 11, color: '#64748b' }}>Contractor:</span>
                                <select
                                  value={attendanceContractorFilter}
                                  onChange={(e) => setAttendanceContractorFilter(e.target.value)}
                                  style={{ fontSize: 12, padding: '4px 8px', maxWidth: 220 }}
                                >
                                  <option value="">All Contractor Teams</option>
                                  {projectVendors.map((pv) => (
                                    <option key={pv.id} value={String(pv.id)}>
                                      🏢 {pv.vendor_name} ({pv.trade || 'Vendor'})
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </div>

                          {/* Separate Totals Summary Cards */}
                          {(() => {
                            const directRows = laborAttendanceRows.filter((r) => !r.project_vendor_id && !r.vendor_name);
                            const contractorRows = laborAttendanceRows.filter((r) => {
                              if (!r.project_vendor_id && !r.vendor_name) return false;
                              if (attendanceContractorFilter) return String(r.project_vendor_id) === String(attendanceContractorFilter);
                              return true;
                            });

                            const directWage = directRows.reduce((acc, r) => acc + (Number(r.wage_amount) || 0), 0);
                            const directPresent = directRows.filter((r) => r.status === 'present').length;
                            const directHalf = directRows.filter((r) => r.status === 'half_day').length;
                            const directAbsent = directRows.filter((r) => r.status === 'absent').length;

                            const contractorWage = contractorRows.reduce((acc, r) => acc + (Number(r.wage_amount) || 0), 0);
                            const contractorPresent = contractorRows.filter((r) => r.status === 'present').length;
                            const contractorHalf = contractorRows.filter((r) => r.status === 'half_day').length;
                            const contractorAbsent = contractorRows.filter((r) => r.status === 'absent').length;

                            return (
                              <div style={{ display: 'grid', gridTemplateColumns: laborAttendanceSection === 'all' ? '1fr 1fr' : '1fr', gap: 12, marginBottom: 16 }}>
                                {(laborAttendanceSection === 'all' || laborAttendanceSection === 'direct') && (
                                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: 12 }}>
                                    <div style={{ fontWeight: 700, fontSize: 13, color: '#166534', marginBottom: 4 }}>
                                      ⚡ Direct (Independent) Labor Summary
                                    </div>
                                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 12, color: '#14532d' }}>
                                      <span>Workers: <b>{directRows.length}</b></span>
                                      <span>Present: <b style={{ color: '#16a34a' }}>{directPresent}</b></span>
                                      <span>Half Day: <b style={{ color: '#d97706' }}>{directHalf}</b></span>
                                      <span>Absent: <b style={{ color: '#dc2626' }}>{directAbsent}</b></span>
                                      <span style={{ marginLeft: 'auto', fontWeight: 700 }}>Total Wages: {INR(directWage)}</span>
                                    </div>
                                  </div>
                                )}

                                {(laborAttendanceSection === 'all' || laborAttendanceSection === 'contractor') && (
                                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: 12 }}>
                                    <div style={{ fontWeight: 700, fontSize: 13, color: '#1e40af', marginBottom: 4 }}>
                                      🏢 Contractor Labor Team Summary {attendanceContractorFilter ? `(${projectVendors.find((v) => String(v.id) === String(attendanceContractorFilter))?.vendor_name || 'Selected'})` : ''}
                                    </div>
                                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 12, color: '#1e3a8a' }}>
                                      <span>Workers: <b>{contractorRows.length}</b></span>
                                      <span>Present: <b style={{ color: '#16a34a' }}>{contractorPresent}</b></span>
                                      <span>Half Day: <b style={{ color: '#d97706' }}>{contractorHalf}</b></span>
                                      <span>Absent: <b style={{ color: '#dc2626' }}>{contractorAbsent}</b></span>
                                      <span style={{ marginLeft: 'auto', fontWeight: 700 }}>Team Wages: {INR(contractorWage)}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })()}

                          {(() => {
                            const isLaborDateToday = laborAttendanceDate === today();
                            const visibleLaborAttendanceRows = laborAttendanceRows.filter((r) => {
                              const isContractor = Boolean(r.project_vendor_id || r.vendor_name);
                              if (laborAttendanceSection === 'direct' && isContractor) return false;
                              if (laborAttendanceSection === 'contractor' && !isContractor) return false;
                              if (laborAttendanceSection === 'contractor' && attendanceContractorFilter && String(r.project_vendor_id) !== String(attendanceContractorFilter)) return false;
                              return true;
                            });

                            const selectedFromVisible = selectedLaborIds.filter((id) =>
                              visibleLaborAttendanceRows.some((r) => (r.labor_id || r.id) === id)
                            );

                            const groups = {};
                            laborAttendanceRows.forEach((r) => {
                              const isContractor = Boolean(r.project_vendor_id || r.vendor_name);
                              if (laborAttendanceSection === 'direct' && isContractor) return;
                              if (laborAttendanceSection === 'contractor' && !isContractor) return;
                              if (laborAttendanceSection === 'contractor' && attendanceContractorFilter && String(r.project_vendor_id) !== String(attendanceContractorFilter)) return;

                              const key = r.vendor_name ? `Vendor: ${r.vendor_name}` : 'Independent (Direct Workers)';
                              if (!groups[key]) groups[key] = [];
                              groups[key].push(r);
                            });

                            const groupKeys = Object.keys(groups);
                            if (groupKeys.length === 0) {
                              return (
                                <div style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                                  {laborAttendanceSection === 'direct'
                                    ? 'No direct independent laborers found. Add laborers in the Labor tab.'
                                    : laborAttendanceSection === 'contractor'
                                    ? 'No contractor laborers found matching the filter.'
                                    : 'No active laborers found for this project. Add laborers in the Labor tab first.'}
                                </div>
                              );
                            }

                            return (
                              <div>
                                {/* Bulk Action Bar */}
                                {false && isLaborDateToday && (
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      gap: 12,
                                      flexWrap: 'wrap',
                                      background: '#f8fafc',
                                      border: '1px solid #cbd5e1',
                                      borderRadius: 8,
                                      padding: '10px 14px',
                                      marginBottom: 16,
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                      <label
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 6,
                                          cursor: 'pointer',
                                          fontWeight: 600,
                                          fontSize: 13,
                                          userSelect: 'none',
                                          margin: 0,
                                        }}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={
                                            visibleLaborAttendanceRows.length > 0 &&
                                            visibleLaborAttendanceRows.every((r) => selectedLaborIds.includes(r.labor_id || r.id))
                                          }
                                          onChange={(e) => {
                                            const visibleIds = visibleLaborAttendanceRows.map((r) => r.labor_id || r.id);
                                            if (e.target.checked) {
                                              setSelectedLaborIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
                                            } else {
                                              const vSet = new Set(visibleIds);
                                              setSelectedLaborIds((prev) => prev.filter((id) => !vSet.has(id)));
                                            }
                                          }}
                                          style={{ width: 16, height: 16, cursor: 'pointer' }}
                                        />
                                        <span>Select All ({visibleLaborAttendanceRows.length})</span>
                                      </label>

                                      {selectedFromVisible.length > 0 && (
                                        <span
                                          style={{
                                            fontSize: 12,
                                            background: '#e0e7ff',
                                            color: '#3730a3',
                                            padding: '2px 8px',
                                            borderRadius: 12,
                                            fontWeight: 700,
                                          }}
                                        >
                                          {selectedFromVisible.length} selected
                                        </span>
                                      )}
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                      <span style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>Mark Selected as:</span>
                                      <button
                                        type="button"
                                        disabled={selectedFromVisible.length === 0}
                                        onClick={() => applyBulkStatus('present')}
                                        style={{
                                          padding: '5px 12px',
                                          fontSize: 12,
                                          background: '#16a34a',
                                          color: '#fff',
                                          border: 'none',
                                          borderRadius: 6,
                                          cursor: selectedFromVisible.length === 0 ? 'not-allowed' : 'pointer',
                                          fontWeight: 600,
                                          opacity: selectedFromVisible.length === 0 ? 0.5 : 1,
                                        }}
                                      >
                                        🟢 Present
                                      </button>
                                      <button
                                        type="button"
                                        disabled={selectedFromVisible.length === 0}
                                        onClick={() => applyBulkStatus('half_day')}
                                        style={{
                                          padding: '5px 12px',
                                          fontSize: 12,
                                          background: '#f59e0b',
                                          color: '#fff',
                                          border: 'none',
                                          borderRadius: 6,
                                          cursor: selectedFromVisible.length === 0 ? 'not-allowed' : 'pointer',
                                          fontWeight: 600,
                                          opacity: selectedFromVisible.length === 0 ? 0.5 : 1,
                                        }}
                                      >
                                        🟡 Half Day
                                      </button>
                                      <button
                                        type="button"
                                        disabled={selectedFromVisible.length === 0}
                                        onClick={() => applyBulkStatus('absent')}
                                        style={{
                                          padding: '5px 12px',
                                          fontSize: 12,
                                          background: '#dc2626',
                                          color: '#fff',
                                          border: 'none',
                                          borderRadius: 6,
                                          cursor: selectedFromVisible.length === 0 ? 'not-allowed' : 'pointer',
                                          fontWeight: 600,
                                          opacity: selectedFromVisible.length === 0 ? 0.5 : 1,
                                        }}
                                      >
                                        🔴 Absent
                                      </button>
                                      {selectedFromVisible.length > 0 && (
                                        <button
                                          type="button"
                                          className="muted"
                                          onClick={() => setSelectedLaborIds([])}
                                          style={{ padding: '4px 8px', fontSize: 11 }}
                                        >
                                          Clear Selection
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Group Worker Tables */}
                                {groupKeys.map((grpTitle) => (
                                  <div key={grpTitle} className="card" style={{ marginBottom: 16 }}>
                                    <h4 style={{ margin: '0 0 10px', fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
                                      <span>{grpTitle.startsWith('Vendor') ? '🏢' : '⚡'}</span>
                                      <span>{grpTitle}</span>
                                      <span style={{ fontSize: 12, color: '#64748b', fontWeight: 'normal' }}>
                                        ({groups[grpTitle].length} {groups[grpTitle].length === 1 ? 'worker' : 'workers'})
                                      </span>
                                    </h4>

                                    <table>
                                      <thead>
                                        <tr>
                                          <th style={{ width: 40, textAlign: 'center', display: 'none' }}>
                                            <input
                                              type="checkbox"
                                              disabled={!isLaborDateToday}
                                              checked={
                                                groups[grpTitle].length > 0 &&
                                                groups[grpTitle].every((r) => selectedLaborIds.includes(r.labor_id || r.id))
                                              }
                                              onChange={(e) => {
                                                const grpIds = groups[grpTitle].map((r) => r.labor_id || r.id);
                                                if (e.target.checked) {
                                                  setSelectedLaborIds((prev) => Array.from(new Set([...prev, ...grpIds])));
                                                } else {
                                                  const grpSet = new Set(grpIds);
                                                  setSelectedLaborIds((prev) => prev.filter((id) => !grpSet.has(id)));
                                                }
                                              }}
                                              style={{ cursor: isLaborDateToday ? 'pointer' : 'not-allowed' }}
                                            />
                                          </th>
                                          <th>Labor Name</th>
                                          <th>Trade</th>
                                          <th>Daily Rate</th>
                                          <th>Status</th>
                                          <th>Wage Amount</th>
                                          <th>Note</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {groups[grpTitle].map((row) => {
                                          const rowId = row.labor_id || row.id;
                                          const isSelected = selectedLaborIds.includes(rowId);
                                          const idx = laborAttendanceRows.findIndex((x) => (x.labor_id || x.id) === rowId);

                                          return (
                                            <tr
                                              key={rowId}
                                              style={{
                                                background: isSelected ? '#eff6ff' : undefined,
                                                transition: 'background 0.15s ease',
                                              }}
                                            >
                                              <td style={{ textAlign: 'center', display: 'none' }}>
                                                <input
                                                  type="checkbox"
                                                  disabled={!isLaborDateToday}
                                                  checked={isSelected}
                                                  onChange={(e) => {
                                                    if (e.target.checked) {
                                                      setSelectedLaborIds((prev) => [...prev, rowId]);
                                                    } else {
                                                      setSelectedLaborIds((prev) => prev.filter((id) => id !== rowId));
                                                    }
                                                  }}
                                                  style={{ cursor: isLaborDateToday ? 'pointer' : 'not-allowed' }}
                                                />
                                              </td>
                                              <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                                  <b>{row.name}</b>
                                                  {row.is_marked && (
                                                    <span
                                                      style={{
                                                        fontSize: 10,
                                                        padding: '1px 6px',
                                                        borderRadius: 4,
                                                        background:
                                                          row.status === 'present'
                                                            ? '#dcfce7'
                                                            : row.status === 'half_day'
                                                            ? '#fef3c7'
                                                            : '#fee2e2',
                                                        color:
                                                          row.status === 'present'
                                                            ? '#166534'
                                                            : row.status === 'half_day'
                                                            ? '#92400e'
                                                            : '#991b1b',
                                                        fontWeight: 700,
                                                      }}
                                                    >
                                                      Already marked: {row.status === 'present' ? 'Present' : row.status === 'half_day' ? 'Half Day' : 'Absent'}
                                                    </span>
                                                  )}
                                                </div>
                                                {row.phone && <span style={{ fontSize: 11, color: '#64748b', display: 'block' }}>{row.phone}</span>}
                                              </td>
                                              <td>{row.trade || 'Helper'}</td>
                                              <td>{INR(row.daily_rate)}/day</td>
                                              <td>
                                                <div style={{ display: 'flex', gap: 4 }}>
                                                  {['present', 'half_day', 'absent'].map((st) => (
                                                    <button
                                                      key={st}
                                                      type="button"
                                                      disabled={!isLaborDateToday}
                                                      onClick={() => {
                                                        const next = [...laborAttendanceRows];
                                                        next[idx].status = st;
                                                        next[idx].dirty = true;
                                                        const mult = st === 'present' ? 1 : st === 'half_day' ? 0.5 : 0;
                                                        next[idx].wage_amount = Math.round(mult * Number(row.daily_rate || 0) * 100) / 100;
                                                        setLaborAttendanceRows(next);
                                                      }}
                                                      className={row.status === st ? 'active-btn' : 'muted'}
                                                      style={{
                                                        padding: '3px 8px',
                                                        fontSize: 11,
                                                        cursor: isLaborDateToday ? 'pointer' : 'not-allowed',
                                                        opacity: !isLaborDateToday && row.status !== st ? 0.4 : 1,
                                                      }}
                                                    >
                                                      {st === 'present' ? 'Present' : st === 'half_day' ? 'Half Day' : 'Absent'}
                                                    </button>
                                                  ))}
                                                </div>
                                              </td>
                                              <td style={{ fontWeight: 700, color: '#16a34a' }}>
                                                {INR(row.wage_amount)}
                                              </td>
                                              <td>
                                                <input
                                                  type="text"
                                                  placeholder="Note..."
                                                  value={row.note || ''}
                                                  disabled={!isLaborDateToday}
                                                  onChange={(e) => {
                                                    const next = [...laborAttendanceRows];
                                                    next[idx].note = e.target.value;
                                                    setLaborAttendanceRows(next);
                                                  }}
                                                  style={{ width: 140 }}
                                                />
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                ))}

                                {/* Sticky Save Attendance Bar */}
                                {isLaborDateToday && laborAttendanceRows.length > 0 && (
                                  <div
                                    style={{
                                      position: 'sticky',
                                      bottom: 12,
                                      zIndex: 20,
                                      background: '#ffffff',
                                      border: '1px solid #cbd5e1',
                                      borderRadius: 10,
                                      padding: '12px 18px',
                                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      gap: 12,
                                      marginTop: 18,
                                      flexWrap: 'wrap',
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                                      <span style={{ fontSize: 13, color: '#334155', fontWeight: 600 }}>
                                        Ready to Save: <b>{laborAttendanceRows.filter((r) => r.dirty).length}</b> of <b>{laborAttendanceRows.length}</b> workers (marked)
                                      </span>
                                      <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 700 }}>
                                        Total Wages: {INR(laborAttendanceRows.filter((r) => r.dirty).reduce((acc, r) => acc + (Number(r.wage_amount) || 0), 0))}
                                      </span>
                                      {selectedFromVisible.length > 0 && (
                                        <span style={{ fontSize: 12, color: '#4338ca', background: '#e0e7ff', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
                                          {selectedFromVisible.length} checked
                                        </span>
                                      )}
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                      <button
                                        type="button"
                                        className="muted"
                                        disabled={savingLaborAttendance}
                                        onClick={() => {
                                          if (!window.confirm('Mark every untouched worker absent and save attendance?')) return;
                                          const next = laborAttendanceRows.map((r) => {
                                            if (!r.is_marked && !r.dirty) {
                                              return { ...r, status: 'absent', wage_amount: 0, dirty: true };
                                            }
                                            return r;
                                          });
                                          setLaborAttendanceRows(next);
                                          saveAllLaborAttendance(next, true);
                                        }}
                                        style={{ padding: '8px 14px', fontSize: 12 }}
                                      >
                                        Mark Remaining as Absent & Save
                                      </button>
                                      <button
                                        type="button"
                                        className="active-btn"
                                        disabled={savingLaborAttendance || laborAttendanceRows.filter((r) => r.dirty).length === 0}
                                        onClick={() => saveAllLaborAttendance()}
                                        style={{
                                          padding: '8px 18px',
                                          fontSize: 13,
                                          fontWeight: 700,
                                          background: '#2563eb',
                                          color: '#fff',
                                          border: 'none',
                                          borderRadius: 6,
                                          cursor: 'pointer',
                                        }}
                                      >
                                        {savingLaborAttendance ? 'Saving...' : `💾 Save Attendance for Today (${today()})`}
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })()}

                          {/* Labor Attendance History Log */}
                          <div style={{ marginTop: 24, borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
                            <h4 style={{ margin: '0 0 10px', fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
                              📋 Labor Attendance History
                              <span style={{ fontSize: 12, color: '#64748b', fontWeight: 400 }}>
                                ({projectLaborAttendanceHistory.length} records)
                              </span>
                            </h4>
                            {projectLaborAttendanceHistory.length > 0 ? (
                              <table>
                                <thead>
                                  <tr>
                                    <th>Date</th>
                                    <th>Labor Name</th>
                                    <th>Trade</th>
                                    <th>Status</th>
                                    <th>Wage Amount</th>
                                    <th>Marked By</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {projectLaborAttendanceHistory.map((h) => {
                                    const dateStr = typeof h.attendance_date === 'string' ? h.attendance_date.slice(0, 10) : new Date(h.attendance_date).toISOString().slice(0, 10);
                                    const isTodayEntry = dateStr === today();
                                    return (
                                      <tr
                                        key={h.id}
                                        className="clickable-row"
                                        onClick={() => {
                                          const lab = projectLabors.find((l) => Number(l.id) === Number(h.labor_id));
                                          if (lab) openLaborDetail(lab);
                                        }}
                                        title="Click to view worker details"
                                      >
                                        <td><b>{dateStr}</b></td>
                                        <td>{h.labor_name}</td>
                                        <td>{h.trade || 'Helper'}</td>
                                        <td>
                                          <span className={`badge badge-${h.status === 'present' ? 'active' : h.status === 'half_day' ? 'warning' : 'danger'}`}>
                                            {h.status === 'present' ? 'Present' : h.status === 'half_day' ? 'Half Day' : 'Absent'}
                                          </span>
                                        </td>
                                        <td style={{ fontWeight: 600, color: '#16a34a' }}>{INR(h.wage_amount)}</td>
                                        <td style={{ fontSize: 12, color: '#64748b' }}>{h.created_by || '—'}</td>
                                        <td onClick={(e) => e.stopPropagation()}>
                                          {isTodayEntry ? (
                                            <button
                                              type="button"
                                              className="active-btn"
                                              style={{ padding: '2px 8px', fontSize: 11 }}
                                              onClick={() => {
                                                setLaborAttendanceDate(dateStr);
                                                loadLaborAttendance(dateStr, project.id);
                                              }}
                                            >
                                              ✏️ Edit Today
                                            </button>
                                          ) : (
                                            <button
                                              type="button"
                                              className="muted"
                                              style={{ padding: '2px 8px', fontSize: 11 }}
                                              onClick={() => {
                                                setLaborAttendanceDate(dateStr);
                                                loadLaborAttendance(dateStr, project.id);
                                              }}
                                            >
                                              👁️ View (Read Only)
                                            </button>
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            ) : (
                              <p style={{ color: '#64748b', fontSize: 13, margin: '8px 0' }}>
                                No labor attendance recorded yet for this project.
                              </p>
                            )}
                          </div>
                        </div>
                  )}
                </div>
              )}

                  {/* ── 4. PAYMENTS TAB ───────────────────────────────────────── */}
                  {projectTab === 'payments' && !isSupervisor && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            className={paymentsSubTab === 'vendor' ? 'active-btn' : 'muted'}
                            onClick={() => handlePaymentsSubChange('vendor')}
                          >
                            Vendor Payment ({vendorPaymentsList.length})
                          </button>
                          <button
                            className={paymentsSubTab === 'labor' ? 'active-btn' : 'muted'}
                            onClick={() => handlePaymentsSubChange('labor')}
                          >
                            Labor Payment ({laborPaymentsList.length})
                          </button>
                          <button
                            className={paymentsSubTab === 'party' ? 'active-btn' : 'muted'}
                            onClick={() => handlePaymentsSubChange('party')}
                          >
                            Party Payment ({partyPayments.length})
                          </button>
                          <button
                            className={paymentsSubTab === 'supplier' ? 'active-btn' : 'muted'}
                            onClick={() => handlePaymentsSubChange('supplier')}
                          >
                            Supplier Payment ({supplierPaymentsList.length})
                          </button>
                        </div>

                        {paymentsSubTab === 'labor' && !isSupervisor && (
                          <button
                            onClick={() => {
                              setLaborPaymentForm({
                                labor_id: projectLabors[0]?.id || '',
                                amount: '',
                                payment_date: today(),
                                mode: 'cash',
                                note: '',
                              });
                              setEditingLaborPaymentId(null);
                              setLaborPaymentModal(true);
                            }}
                          >
                            + Record Labor Payment
                          </button>
                        )}
                        {paymentsSubTab === 'supplier' && !isSupervisor && (
                          <button
                            onClick={() => {
                              setSupplierPaymentForm({
                                supplier_id: projectSuppliers[0]?.supplier_id || '',
                                supplier_name: projectSuppliers[0]?.supplier_name || '',
                                amount: '',
                                payment_date: today(),
                                mode: 'bank',
                                transaction_reference: '',
                                note: '',
                              });
                              setModalError('');
                              setSupplierPaymentModal(true);
                            }}
                          >
                            + Record Supplier Payment
                          </button>
                        )}
                      </div>

                      {paymentsSubTab === 'vendor' && (
                        <div>
                          <form onSubmit={(e) => submitAction.submit('vendorPayment', () => saveVendorPayment(e), { successMessage: 'Vendor payment recorded successfully', onError: setMessage })} className="card" style={{ marginBottom: 16 }}>
                    <h4 style={{ margin: '0 0 12px', fontSize: 15 }}>Record Vendor Payment</h4>
                    <div className="grid">
                      <label>
                        <small style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: '#475569' }}>Vendor</small>
                        <select
                          required
                          value={vendorPaymentForm.project_vendor_id}
                          onChange={(e) => {
                            const pvid = e.target.value;
                            const pv = projectVendors.find((v) => String(v.id) === String(pvid));
                            const earned = pv ? Number(pv.total_earned ?? pv.earned ?? 0) : 0;
                            const paid = pv ? Number(pv.total_paid ?? pv.paid ?? 0) : 0;
                            const bal = pv ? Number(pv.balance_due ?? pv.balance ?? (earned - paid)) : 0;
                            const defType = pv ? (bal <= 0 ? 'advance' : pv.pay_type === 'contract' ? 'contract' : 'labour') : 'labour';
                            setVendorPaymentForm({ ...vendorPaymentForm, project_vendor_id: pvid, payment_type: defType });
                          }}
                        >
                          <option value="">Select Vendor</option>
                          {projectVendors.map((pv) => {
                            const earned = Number(pv.total_earned ?? pv.earned ?? 0);
                            const paid = Number(pv.total_paid ?? pv.paid ?? 0);
                            const bal = Number(pv.balance_due ?? pv.balance ?? (earned - paid));
                            const balLabel = bal > 0 ? `Due: ${INR(bal)}` : bal < 0 ? `Advance: ${INR(Math.abs(bal))}` : 'Settled (₹0)';
                            const rateLabel = pv.pay_type === 'daily_wage' ? `Daily Wage: ${INR(pv.daily_rate)}/day` : `Contract: ${INR(pv.contract_amount)}`;
                            return (
                              <option value={pv.id} key={pv.id}>
                                {pv.vendor_name} ({rateLabel}) &bull; {balLabel}
                              </option>
                            );
                          })}
                        </select>
                      </label>
                      {(() => {
                        const sel = projectVendors.find((pv) => String(pv.id) === String(vendorPaymentForm.project_vendor_id));
                        if (!sel) return null;
                        const earned = Number(sel.total_earned ?? sel.earned ?? 0);
                        const paid = Number(sel.total_paid ?? sel.paid ?? 0);
                        const bal = Number(sel.balance_due ?? sel.balance ?? (earned - paid));
                        const rateLabel = sel.pay_type === 'daily_wage' ? `Daily Wage: ${INR(sel.daily_rate)}/day` : `Contract Amount: ${INR(sel.contract_amount)}`;
                        return (
                          <div style={{ gridColumn: '1 / -1', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
                            <div>
                              <small style={{ color: '#64748b', display: 'block' }}>Contractor / Vendor</small>
                              <b>{sel.vendor_name}</b> <span style={{ fontSize: 12, color: '#64748b' }}>({sel.trade || 'General'})</span>
                            </div>
                            <div>
                              <small style={{ color: '#64748b', display: 'block' }}>Rate / Contract Value</small>
                              <span style={{ fontWeight: 600, color: '#0f172a' }}>{rateLabel}</span>
                            </div>
                            <div>
                              <small style={{ color: '#64748b', display: 'block' }}>Vendor Earned</small>
                              <span style={{ fontWeight: 600, color: '#0f172a' }}>{INR(earned)}</span>
                            </div>
                            <div>
                              <small style={{ color: '#64748b', display: 'block' }}>Total Paid</small>
                              <span style={{ fontWeight: 600, color: '#16a34a' }}>{INR(paid)}</span>
                            </div>
                            <div>
                              <small style={{ color: '#64748b', display: 'block' }}>Current Balance</small>
                              {bal > 0 ? (
                                <span style={{ fontWeight: 700, color: '#ea580c' }}>Due: {INR(bal)}</span>
                              ) : bal < 0 ? (
                                <span className="badge badge-active" style={{ background: '#dcfce7', color: '#15803d', fontWeight: 700 }}>
                                  Advance: {INR(Math.abs(bal))}
                                </span>
                              ) : (
                                <span style={{ color: '#64748b', fontWeight: 600 }}>Settled (₹0)</span>
                              )}
                            </div>
                          </div>
                        );
                      })()}
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
                      {(vendorPaymentForm.mode === 'upi' || vendorPaymentForm.mode === 'bank') && (
                        <Input label="Transaction Reference / UPI ID" name="transaction_reference" value={vendorPaymentForm.transaction_reference || ''} set={setVendorPaymentForm} placeholder="e.g. UPI ID, UTR number, or bank transaction ID" />
                      )}
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
                      <button type="submit" disabled={submitAction.isSubmitting('vendorPayment')}>{submitAction.isSubmitting('vendorPayment') ? 'Saving…' : 'Record Payment'}</button>
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
                        <th>Advance Payment</th>
                        <th>Balance</th>
                        <th>Mode</th>
                        <th>Note</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendorPaymentsList.map((p) => {
                        const pv = projectVendors.find((v) => Number(v.id) === Number(p.project_vendor_id));
                        const bal = Number(pv?.balance_due ?? pv?.balance ?? (Number(pv?.total_earned ?? pv?.earned ?? 0) - Number(pv?.total_paid ?? pv?.paid ?? 0)));
                        const isAdvance = p.payment_type === 'advance';
                        return (
                          <tr
                            key={p.id}
                            className="clickable-row"
                            onClick={() => {
                              if (pv) openVendorDetail(pv);
                            }}
                            title="Click to open contractor detail page"
                          >
                            <td>{p.payment_date ? String(p.payment_date).slice(0, 10) : '—'}</td>
                            <td><b>{p.vendor_name}</b></td>
                            <td>
                              <span
                                className="badge badge-active"
                                style={{
                                  textTransform: 'capitalize',
                                  background: isAdvance ? '#dcfce7' : undefined,
                                  color: isAdvance ? '#15803d' : undefined,
                                  fontWeight: isAdvance ? 700 : undefined,
                                }}
                              >
                                {p.payment_type}
                              </span>
                            </td>
                            <td style={{ fontWeight: 700, color: '#16a34a' }}>{INR(p.amount)}</td>
                            <td>
                              {isAdvance ? (
                                <span className="badge badge-active" style={{ background: '#dcfce7', color: '#15803d', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                  Advance: {INR(p.amount)}
                                </span>
                              ) : (
                                <span style={{ color: '#94a3b8' }}>—</span>
                              )}
                            </td>
                            <td>
                              {bal < 0 ? (
                                <span className="badge badge-active" style={{ background: '#dcfce7', color: '#15803d', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                  Advance: {INR(Math.abs(bal))}
                                </span>
                              ) : bal > 0 ? (
                                <span style={{ fontWeight: 700, color: '#ea580c', whiteSpace: 'nowrap' }}>
                                  Due: {INR(bal)}
                                </span>
                              ) : (
                                <span style={{ color: '#64748b', fontWeight: 600 }}>Settled (₹0)</span>
                              )}
                            </td>
                            <td style={{ textTransform: 'uppercase', fontSize: 11 }}>{p.mode}</td>
                            <td>
                              {p.note || '—'}
                              {p.transaction_reference && <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Ref: {p.transaction_reference}</div>}
                            </td>
                            <td className="actions" style={{ justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                              {!isAgent && (
                                <button className="danger" onClick={() => del('vendorPayment', p.id)}>
                                  Delete
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                      {vendorPaymentsList.length === 0 && (
                        <tr>
                          <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                            No vendor payments recorded yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                        </div>
                      )}

                      {paymentsSubTab === 'labor' && (
                        <div>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
                        <select
                          value={laborPaymentFilterLabor}
                          onChange={(e) => setLaborPaymentFilterLabor(e.target.value)}
                          style={{ maxWidth: 200 }}
                        >
                          <option value="">All Laborers</option>
                          {projectLabors.map((l) => (
                            <option key={l.id} value={l.id}>{l.name} ({l.trade || 'Helper'})</option>
                          ))}
                        </select>

                        <input
                          type="date"
                          value={laborPaymentFilterFrom}
                          onChange={(e) => setLaborPaymentFilterFrom(e.target.value)}
                          placeholder="From Date"
                          style={{ maxWidth: 150 }}
                        />

                        <input
                          type="date"
                          value={laborPaymentFilterTo}
                          onChange={(e) => setLaborPaymentFilterTo(e.target.value)}
                          placeholder="To Date"
                          style={{ maxWidth: 150 }}
                        />

                        {(laborPaymentFilterLabor || laborPaymentFilterFrom || laborPaymentFilterTo) && (
                          <button
                            className="muted"
                            onClick={() => {
                              setLaborPaymentFilterLabor('');
                              setLaborPaymentFilterFrom('');
                              setLaborPaymentFilterTo('');
                            }}
                          >
                            Clear Filters
                          </button>
                        )}
                      </div>

                      <table>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Laborer</th>
                            <th>Trade</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Advance Payment</th>
                            <th>Balance</th>
                            <th>Mode</th>
                            <th>Note</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {laborPaymentsList.map((p) => {
                            const lab = projectLabors.find((l) => Number(l.id) === Number(p.labor_id));
                            const balVal = Number(lab?.balance_due ?? (Number(lab?.total_earned || 0) - Number(lab?.total_paid || 0)));
                            const isAdvancePay = p.payment_type === 'advance';
                            return (
                              <tr
                                key={p.id}
                                className="clickable-row"
                                onClick={() => {
                                  if (lab) openLaborDetail(lab);
                                }}
                                title="Click to open laborer detail page"
                              >
                                <td>{p.payment_date ? String(p.payment_date).slice(0, 10) : '—'}</td>
                                <td><b>{p.labor_name}</b></td>
                                <td>{p.trade || '—'}</td>
                                <td>
                                  <span
                                    className="badge badge-active"
                                    style={{
                                      textTransform: 'capitalize',
                                      background: isAdvancePay ? '#dcfce7' : undefined,
                                      color: isAdvancePay ? '#15803d' : undefined,
                                      fontWeight: isAdvancePay ? 700 : undefined,
                                    }}
                                  >
                                    {p.payment_type || 'wage'}
                                  </span>
                                </td>
                                <td style={{ fontWeight: 700, color: '#16a34a' }}>{INR(p.amount)}</td>
                                <td>
                                  {isAdvancePay ? (
                                    <span className="badge badge-active" style={{ background: '#dcfce7', color: '#15803d', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                      Advance: {INR(p.amount)}
                                    </span>
                                  ) : (
                                    <span style={{ color: '#94a3b8' }}>—</span>
                                  )}
                                </td>
                                <td>
                                  {balVal < 0 ? (
                                    <span className="badge badge-active" style={{ background: '#dcfce7', color: '#15803d', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                      Advance: {INR(Math.abs(balVal))}
                                    </span>
                                  ) : balVal > 0 ? (
                                    <span style={{ fontWeight: 700, color: '#ea580c', whiteSpace: 'nowrap' }}>
                                      Due: {INR(balVal)}
                                    </span>
                                  ) : (
                                    <span style={{ color: '#64748b', fontWeight: 600 }}>Settled (₹0)</span>
                                  )}
                                </td>
                                <td>
                                  <span className="badge badge-active" style={{ textTransform: 'uppercase', fontSize: 10 }}>
                                    {p.mode}
                                  </span>
                                </td>
                                <td>
                                  {p.note || '—'}
                                  {p.transaction_reference && <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Ref: {p.transaction_reference}</div>}
                                </td>
                                <td className="actions" style={{ justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                                  <button
                                    className="muted"
                                    onClick={() => {
                                      setLaborPaymentForm({
                                        labor_id: p.labor_id,
                                        amount: p.amount,
                                        payment_date: p.payment_date ? String(p.payment_date).slice(0, 10) : today(),
                                        mode: p.mode || 'cash',
                                        payment_type: p.payment_type || 'wage',
                                        note: p.note || '',
                                        transaction_reference: p.transaction_reference || '',
                                      });
                                      setEditingLaborPaymentId(p.id);
                                      setLaborPaymentModal(true);
                                    }}
                                  >
                                    Edit
                                  </button>
                                  {!isAgent && (
                                    <button className="danger" onClick={() => del('laborPayment', p.id)}>
                                      Delete
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                          {laborPaymentsList.length === 0 && (
                            <tr>
                              <td colSpan={10} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                                No labor payments recorded yet. Click &ldquo;+ Record Labor Payment&rdquo; above.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                        </div>
                      )}

                      {paymentsSubTab === 'party' && (
                        <div>
                          <form onSubmit={(e) => submitAction.submit('partyPayment', () => savePartyPayment(e), { successMessage: 'Party payment recorded successfully', onError: setMessage })} className="card" style={{ marginBottom: 16 }}>
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
                      {(partyPaymentForm.mode === 'upi' || partyPaymentForm.mode === 'bank') && (
                        <Input label="Transaction Reference / UPI ID" name="transaction_reference" value={partyPaymentForm.transaction_reference || ''} set={setPartyPaymentForm} placeholder="e.g. UPI ID, UTR number, or bank transaction ID" />
                      )}
                      <Input label="Note / Reference" name="note" value={partyPaymentForm.note} set={setPartyPaymentForm} />
                    </div>
                    <p style={{ marginTop: 12, textAlign: 'right' }}>
                      <button type="submit" disabled={submitAction.isSubmitting('partyPayment')}>{submitAction.isSubmitting('partyPayment') ? 'Saving…' : 'Record Payment'}</button>
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
                          <td>
                            {p.note || '—'}
                            {p.transaction_reference && <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Ref: {p.transaction_reference}</div>}
                          </td>
                          <td className="actions" style={{ justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                            {!isAgent && (
                              <button className="danger" onClick={() => del('partyPayment', p.id)}>
                                Delete
                              </button>
                            )}
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
                    </div>
                  )}

                  {/* ── SUPPLIERS TAB: SUPPLIER LEDGER ─────────────────────── */}
                  {projectTab === 'suppliers' && (
                    <div>
                      {!selectedSupplier ? (
                        /* ── 1. SUPPLIERS LIST VIEW ────────────────────────── */
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                              <h4 style={{ margin: 0, fontSize: 16 }}>Project Suppliers ({projectSuppliers.length})</h4>
                              <input
                                type="text"
                                placeholder="Search supplier by name or phone..."
                                value={supplierSearch}
                                onChange={(e) => setSupplierSearch(e.target.value)}
                                style={{ minWidth: 240, padding: '6px 12px', fontSize: 13 }}
                              />
                            </div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              {hasAgentConstruction && (
                                <button
                                  onClick={() => {
                                    setReceivedForm({
                                      ...receivedBlank,
                                      received_date: today(),
                                    });
                                    setEditingReceivedId(null);
                                    setBillFile(null);
                                    setModalError('');
                                    setReceivedModal(true);
                                  }}
                                >
                                  + Record Material Delivered to Site
                                </button>
                              )}
                              {hasAgentPayment && (
                                <button
                                  className="btn-secondary"
                                  onClick={() => {
                                    setSupplierPaymentForm({
                                      supplier_id: projectSuppliers[0]?.supplier_id || '',
                                      supplier_name: projectSuppliers[0]?.supplier_name || '',
                                      amount: '',
                                      payment_date: today(),
                                      mode: 'bank',
                                      transaction_reference: '',
                                      note: '',
                                    });
                                    setModalError('');
                                    setSupplierPaymentModal(true);
                                  }}
                                >
                                  + Record Supplier Payment
                                </button>
                              )}
                            </div>
                          </div>

                          <table>
                            <thead>
                              <tr>
                                <th>Supplier</th>
                                <th>Total Supplied</th>
                                <th>Total Returned</th>
                                <th>Total Paid</th>
                                <th>Balance</th>
                                <th>Last Delivery</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {projectSuppliers
                                .filter((s) => {
                                  if (!supplierSearch.trim()) return true;
                                  const q = supplierSearch.toLowerCase();
                                  return (
                                    (s.supplier_name && s.supplier_name.toLowerCase().includes(q)) ||
                                    (s.phone && s.phone.includes(q)) ||
                                    (s.city && s.city.toLowerCase().includes(q))
                                  );
                                })
                                .map((s) => (
                                  <tr
                                    key={s.key}
                                    className="clickable-row"
                                    onClick={() => openSupplierLedger(s)}
                                    title="Click to open supplier ledger"
                                  >
                                    <td>
                                      <b>{s.supplier_name}</b>
                                      {s.is_registered ? (
                                        <span className="badge badge-active" style={{ marginLeft: 6, fontSize: 10 }}>Registered</span>
                                      ) : (
                                        <span className="badge" style={{ marginLeft: 6, fontSize: 10, background: '#f1f5f9', color: '#64748b' }}>Unregistered</span>
                                      )}
                                      {s.phone && (
                                        <span style={{ fontSize: 11, color: '#64748b', display: 'block', marginTop: 2 }}>
                                          📞 {s.phone} {s.city ? `• ${s.city}` : ''}
                                        </span>
                                      )}
                                    </td>
                                    <td style={{ fontWeight: 600 }}>
                                      {INR(s.total_supplied)}
                                      <span style={{ fontSize: 11, color: '#64748b', display: 'block' }}>
                                        {s.delivery_count} {s.delivery_count === 1 ? 'delivery' : 'deliveries'}
                                      </span>
                                    </td>
                                    <td style={{ fontWeight: 600, color: '#dc2626' }}>
                                      {INR(s.total_returned || 0)}
                                      <span style={{ fontSize: 11, color: '#64748b', display: 'block' }}>
                                        {s.return_count || 0} {s.return_count === 1 ? 'return' : 'returns'}
                                      </span>
                                    </td>
                                    <td style={{ fontWeight: 600, color: '#16a34a' }}>
                                      {INR(s.total_paid)}
                                      <span style={{ fontSize: 11, color: '#64748b', display: 'block' }}>
                                        {s.payment_count} {s.payment_count === 1 ? 'payment' : 'payments'}
                                      </span>
                                    </td>
                                    <td>
                                      {s.balance > 0 ? (
                                        <span style={{ fontWeight: 700, color: '#ea580c' }}>
                                          Due: {INR(s.balance)}
                                        </span>
                                      ) : s.balance < 0 ? (
                                        <span className="badge badge-active" style={{ background: '#dcfce7', color: '#15803d', fontWeight: 700 }}>
                                          Advance: {INR(Math.abs(s.balance))}
                                        </span>
                                      ) : (
                                        <span style={{ color: '#64748b', fontWeight: 600 }}>Settled (₹0)</span>
                                      )}
                                    </td>
                                    <td>{s.last_delivery ? s.last_delivery.slice(0, 10) : '—'}</td>
                                    <td className="actions" style={{ justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                                      <button
                                        className="muted"
                                        onClick={() => openSupplierLedger(s)}
                                        title="Open full ledger"
                                      >
                                        📒 View Ledger
                                      </button>
                                      {hasAgentPayment && (
                                        <button
                                          onClick={() => {
                                            setSupplierPaymentForm({
                                              supplier_id: s.supplier_id || '',
                                              supplier_name: s.supplier_name || '',
                                              amount: '',
                                              payment_date: today(),
                                              mode: 'bank',
                                              transaction_reference: '',
                                              note: '',
                                            });
                                            setModalError('');
                                            setSupplierPaymentModal(true);
                                          }}
                                          title="Record payment to this supplier"
                                        >
                                          + Pay
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              {projectSuppliers.length === 0 && (
                                <tr>
                                  <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                                    No suppliers recorded for this project yet.<br />
                                    Click <b>&ldquo;+ Record Material Delivered to Site&rdquo;</b> to record initial supplier deliveries.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        /* ── 2. SUPPLIER LEDGER VIEW ───────────────────────── */
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <button
                                className="muted"
                                onClick={() => setSelectedSupplier(null)}
                                style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                              >
                                ← Back to Suppliers
                              </button>
                              <div>
                                <h4 style={{ margin: 0, fontSize: 18 }}>
                                  {selectedSupplier.supplier_name}
                                  {selectedSupplier.is_registered ? (
                                    <span className="badge badge-active" style={{ marginLeft: 8, fontSize: 11 }}>Registered</span>
                                  ) : (
                                    <span className="badge" style={{ marginLeft: 8, fontSize: 11, background: '#f1f5f9', color: '#64748b' }}>Unregistered</span>
                                  )}
                                </h4>
                                {selectedSupplier.phone && (
                                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                                    📞 {selectedSupplier.phone} {selectedSupplier.city ? `• ${selectedSupplier.city}` : ''}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              {hasAgentConstruction && (
                                <button
                                  onClick={() => {
                                    setReceivedForm({
                                      ...receivedBlank,
                                      supplier_id: selectedSupplier.supplier_id || '',
                                      supplier_name: selectedSupplier.supplier_name || '',
                                      received_date: today(),
                                    });
                                    setEditingReceivedId(null);
                                    setBillFile(null);
                                    setModalError('');
                                    setReceivedModal(true);
                                  }}
                                >
                                  + Record Delivery
                                </button>
                              )}
                              {hasAgentPayment && (
                                <button
                                  className="btn-secondary"
                                  onClick={() => {
                                    setSupplierPaymentForm({
                                      supplier_id: selectedSupplier.supplier_id || '',
                                      supplier_name: selectedSupplier.supplier_name || '',
                                      amount: '',
                                      payment_date: today(),
                                      mode: 'bank',
                                      transaction_reference: '',
                                      note: '',
                                    });
                                    setModalError('');
                                    setSupplierPaymentModal(true);
                                  }}
                                >
                                  + Record Payment
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Summary Cards */}
                          <div className="stat-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16 }}>
                            <div className="card" style={{ padding: '12px 16px', borderLeft: '4px solid #0369a1' }}>
                              <small style={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', fontSize: 11 }}>Total Supplied</small>
                              <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
                                {INR(supplierLedgerData.summary?.total_supplied ?? selectedSupplier.total_supplied)}
                              </div>
                              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                                {supplierLedgerData.deliveries?.length || selectedSupplier.delivery_count || 0} deliveries
                              </div>
                            </div>
                            <div className="card" style={{ padding: '12px 16px', borderLeft: '4px solid #dc2626' }}>
                              <small style={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', fontSize: 11 }}>Total Returned</small>
                              <div style={{ fontSize: 20, fontWeight: 800, color: '#dc2626', marginTop: 4 }}>
                                {INR(supplierLedgerData.summary?.total_returned ?? selectedSupplier.total_returned ?? 0)}
                              </div>
                              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                                {supplierLedgerData.returns?.length || selectedSupplier.return_count || 0} returns
                              </div>
                            </div>
                            <div className="card" style={{ padding: '12px 16px', borderLeft: '4px solid #16a34a' }}>
                              <small style={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', fontSize: 11 }}>Total Paid</small>
                              <div style={{ fontSize: 20, fontWeight: 800, color: '#16a34a', marginTop: 4 }}>
                                {INR(supplierLedgerData.summary?.total_paid ?? selectedSupplier.total_paid)}
                              </div>
                              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                                {supplierLedgerData.payments?.length || selectedSupplier.payment_count || 0} payments
                              </div>
                            </div>
                            <div
                              className="card"
                              style={{
                                padding: '12px 16px',
                                borderLeft: `4px solid ${(supplierLedgerData.summary?.balance ?? selectedSupplier.balance) < 0 ? '#10b981' : '#f97316'}`,
                                background: (supplierLedgerData.summary?.balance ?? selectedSupplier.balance) < 0 ? '#f0fdf4' : '#fff'
                              }}
                            >
                              <small style={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', fontSize: 11 }}>
                                {(supplierLedgerData.summary?.balance ?? selectedSupplier.balance) < 0 ? 'Advance Paid' : 'Balance Due'}
                              </small>
                              <div
                                style={{
                                  fontSize: 20,
                                  fontWeight: 800,
                                  color: (supplierLedgerData.summary?.balance ?? selectedSupplier.balance) < 0 ? '#15803d' : '#ea580c',
                                  marginTop: 4
                                }}
                              >
                                {INR(Math.abs(supplierLedgerData.summary?.balance ?? selectedSupplier.balance))}
                              </div>
                              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                                {(supplierLedgerData.summary?.balance ?? selectedSupplier.balance) < 0
                                  ? 'Overpayment / Advance available'
                                  : (supplierLedgerData.summary?.balance ?? selectedSupplier.balance) === 0
                                  ? 'All cleared'
                                  : 'Net payment pending'}
                              </div>
                            </div>
                          </div>

                          {/* Ledger Sub-tabs */}
                          <div style={{ display: 'flex', gap: 8, marginBottom: 12, borderBottom: '1px solid #e2e8f0', paddingBottom: 8 }}>
                            <button
                              className={supplierLedgerTab === 'deliveries' ? 'active-btn' : 'muted'}
                              onClick={() => setSupplierLedgerTab('deliveries')}
                            >
                              📦 Deliveries ({supplierLedgerData.deliveries?.length || 0})
                            </button>
                            <button
                              className={supplierLedgerTab === 'returns' ? 'active-btn' : 'muted'}
                              onClick={() => setSupplierLedgerTab('returns')}
                            >
                              🔄 Returns ({supplierLedgerData.returns?.length || 0})
                            </button>
                            <button
                              className={supplierLedgerTab === 'payments' ? 'active-btn' : 'muted'}
                              onClick={() => setSupplierLedgerTab('payments')}
                            >
                              💳 Payments ({supplierLedgerData.payments?.length || 0})
                            </button>
                          </div>

                          {loadingSupplierLedger ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading ledger entries...</div>
                          ) : supplierLedgerTab === 'deliveries' ? (
                            <table>
                              <thead>
                                <tr>
                                  <th>Date</th>
                                  <th>Material Name</th>
                                  <th>Quantity</th>
                                  <th>Unit</th>
                                  {!isSupervisor && <th>Rate</th>}
                                  {!isSupervisor && <th>Amount</th>}
                                  <th>Challan No</th>
                                  <th>Bill</th>
                                  <th>Note</th>
                                  <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(supplierLedgerData.deliveries || []).map((d) => (
                                  <tr key={d.id}>
                                    <td>{d.received_date ? d.received_date.slice(0, 10) : '—'}</td>
                                    <td><b>{d.material_name}</b></td>
                                    <td>{Number(d.quantity).toFixed(2)}</td>
                                    <td>{d.material_unit || 'units'}</td>
                                    {!isSupervisor && <td>{INR(d.rate)}</td>}
                                    {!isSupervisor && <td style={{ fontWeight: 600 }}>{INR(d.amount)}</td>}
                                    <td>{d.challan_no || '—'}</td>
                                    <td>
                                      {d.bill_url ? (
                                        <a href={d.bill_url} target="_blank" rel="noreferrer" title={d.bill_filename || 'View Bill'} style={{ textDecoration: 'none', fontSize: 16 }}>
                                          📄
                                        </a>
                                      ) : '—'}
                                    </td>
                                    <td>{d.note || '—'}</td>
                                    <td className="actions" style={{ justifyContent: 'flex-end' }}>
                                      {!isAgent && (
                                        <button className="danger" onClick={() => del('received', d.id)}>
                                          Delete
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                                {(supplierLedgerData.deliveries || []).length === 0 && (
                                  <tr>
                                    <td colSpan={10} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                                      No material deliveries recorded for this supplier.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          ) : supplierLedgerTab === 'returns' ? (
                            <table>
                              <thead>
                                <tr>
                                  <th>Date</th>
                                  <th>Material Name</th>
                                  <th>Returned Qty</th>
                                  <th>Unit</th>
                                  {!isSupervisor && <th>Credit / Amount</th>}
                                  <th>Slip</th>
                                  <th>Note / Reason</th>
                                  <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(supplierLedgerData.returns || []).map((ret) => (
                                  <tr key={ret.id}>
                                    <td>{ret.adjustment_date ? ret.adjustment_date.slice(0, 10) : '—'}</td>
                                    <td><b>{ret.material_name}</b></td>
                                    <td style={{ color: '#dc2626', fontWeight: 600 }}>{Number(ret.quantity).toFixed(2)}</td>
                                    <td>{ret.material_unit || 'units'}</td>
                                    {!isSupervisor && (
                                      <td style={{ fontWeight: 600, color: '#dc2626' }}>
                                        {ret.amount ? INR(ret.amount) : '—'}
                                      </td>
                                    )}
                                    <td>
                                      {ret.bill_url ? (
                                        <a href={ret.bill_url} target="_blank" rel="noreferrer" title={ret.bill_filename || 'View Slip'} style={{ textDecoration: 'none', fontSize: 16 }}>
                                          📄
                                        </a>
                                      ) : '—'}
                                    </td>
                                    <td>{ret.note || ret.reason || '—'}</td>
                                    <td className="actions" style={{ justifyContent: 'flex-end' }}>
                                      {!isAgent && (
                                        <button className="danger" onClick={() => del('adjustment', ret.id)}>
                                          Delete
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                                {(supplierLedgerData.returns || []).length === 0 && (
                                  <tr>
                                    <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                                      No material returns recorded for this supplier.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          ) : (
                            <table>
                              <thead>
                                <tr>
                                  <th>Date</th>
                                  <th>Amount</th>
                                  <th>Payment Mode</th>
                                  <th>Reference / Cheque</th>
                                  <th>Note</th>
                                  <th>Recorded By</th>
                                  <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(supplierLedgerData.payments || []).map((p) => (
                                  <tr key={p.id}>
                                    <td>{p.payment_date ? p.payment_date.slice(0, 10) : '—'}</td>
                                    <td style={{ fontWeight: 700, color: '#16a34a' }}>{INR(p.amount)}</td>
                                    <td><span className="badge" style={{ textTransform: 'capitalize' }}>{p.mode || 'bank'}</span></td>
                                    <td>{p.transaction_reference || '—'}</td>
                                    <td>{p.note || '—'}</td>
                                    <td style={{ fontSize: 12, color: '#64748b' }}>{p.created_by || '—'}</td>
                                    <td className="actions" style={{ justifyContent: 'flex-end' }}>
                                      {!isAgent && (
                                        <button className="danger" onClick={() => del('supplierPayment', p.id)}>
                                          Delete
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                                {(supplierLedgerData.payments || []).length === 0 && (
                                  <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                                      No payments recorded for this supplier.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── 5. CONSTRUCTION TAB ───────────────────────────────────── */}
                  {projectTab === 'construction' && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          <button
                            className={constructionSubTab === 'adjustments' ? 'active-btn' : 'muted'}
                            onClick={() => handleConstructionSubChange('adjustments')}
                          >
                            Wastage / Adjustments ({wastageAdjRows.length})
                          </button>
                          <button
                            className={constructionSubTab === 'return' ? 'active-btn' : 'muted'}
                            onClick={() => handleConstructionSubChange('return')}
                          >
                            Return Material ({returnMaterialRows.length})
                          </button>
                          <button
                            className={constructionSubTab === 'scrap' ? 'active-btn' : 'muted'}
                            onClick={() => handleConstructionSubChange('scrap')}
                          >
                            Scrap Material ({scrapMaterialRows.length})
                          </button>
                          <button
                            className={constructionSubTab === 'expenses' ? 'active-btn' : 'muted'}
                            onClick={() => handleConstructionSubChange('expenses')}
                          >
                            Other Expenses ({expenseRows.length})
                          </button>
                        </div>

                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {constructionSubTab === 'adjustments' && (
                            <button
                              onClick={() => {
                                setAdjustmentForm({ ...adjustmentBlank, adjustment_type: 'wastage' });
                                setEditingAdjId(null);
                                setAdjustmentModal(true);
                              }}
                            >
                              ⚡ + Record Wastage / Adjustment
                            </button>
                          )}
                          {constructionSubTab === 'return' && (
                            <button
                              onClick={() => {
                                setAdjustmentForm({ ...adjustmentBlank, adjustment_type: 'return_material' });
                                setEditingAdjId(null);
                                setAdjustmentModal(true);
                              }}
                            >
                              🔄 + Record Return Material
                            </button>
                          )}
                          {constructionSubTab === 'scrap' && (
                            <button
                              onClick={() => {
                                setAdjustmentForm({ ...adjustmentBlank, adjustment_type: 'scrap_material' });
                                setEditingAdjId(null);
                                setAdjustmentModal(true);
                              }}
                            >
                              ♻️ + Record Scrap Material
                            </button>
                          )}
                          {constructionSubTab === 'expenses' && (
                            <button
                              onClick={() => {
                                setExpenseForm(expenseBlank);
                                setEditingExpenseId(null);
                                setExpenseModal(true);
                              }}
                            >
                              + Record Other Expense
                            </button>
                          )}
                        </div>
                      </div>

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
                            <tr
                              key={r.id}
                              className="clickable-row"
                              onClick={() => openMaterialTimeline(r)}
                              title="Click to view full material ledger & transaction timeline"
                            >
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
                              <td className="actions" style={{ justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
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
                            <th>Bill</th>
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
                              <tr
                                key={r.id}
                                className="clickable-row"
                                onClick={() => {
                                  const mat = stockRows.find((s) => Number(s.id) === Number(r.material_id)) || { id: r.material_id, name: r.material_name, unit: r.material_unit };
                                  openMaterialTimeline(mat);
                                }}
                                title="Click to view material ledger & transaction timeline"
                              >
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
                                <td onClick={(e) => e.stopPropagation()}>
                                  {r.bill_url ? (
                                    <a href={r.bill_url} target="_blank" rel="noreferrer" title={r.bill_filename} style={{ textDecoration: 'none' }}>
                                      📄
                                    </a>
                                  ) : '—'}
                                </td>
                                <td>{r.note || '—'}</td>
                                <td className="actions" style={{ justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                                  <button
                                    className="muted"
                                    onClick={() => {
                                      setEditingReceivedId(r.id);
                                      setReceivedForm({
                                        material_id: String(r.material_id),
                                        material_name: r.material_name || stockRows.find((m) => Number(m.id) === Number(r.material_id))?.name || '',
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
                                  {!isAgent && (
                                    <button className="danger" onClick={() => del('received', r.id)}>
                                      Delete
                                    </button>
                                  )}
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
                              <tr
                                key={r.id}
                                className="clickable-row"
                                onClick={() => {
                                  const mat = stockRows.find((s) => Number(s.id) === Number(r.material_id)) || { id: r.material_id, name: r.material_name, unit: r.material_unit };
                                  openMaterialTimeline(mat);
                                }}
                                title="Click to view material ledger & transaction timeline"
                              >
                                <td>{r.used_date}</td>
                                <td><b>{r.material_name}</b></td>
                                <td style={{ fontWeight: 600 }}>{Number(r.quantity).toFixed(2)} {r.material_unit}</td>
                                <td>{r.used_for || '—'}</td>
                                <td>{r.note || '—'}</td>
                                <td>
                                  {r.over_used && <span className="badge badge-overused">Over-used</span>}
                                </td>
                                <td className="actions" style={{ justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                                  <button
                                    className="muted"
                                    onClick={() => {
                                      setEditingUsedId(r.id);
                                      setUsedForm({
                                        material_id: String(r.material_id),
                                        material_name: r.material_name || stockRows.find((m) => Number(m.id) === Number(r.material_id))?.name || '',
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
                                  {!isAgent && (
                                    <button className="danger" onClick={() => del('used', r.id)}>
                                      Delete
                                    </button>
                                  )}
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

                      {constructionSubTab === 'adjustments' && (
                    <table>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Material</th>
                          <th>Type</th>
                          <th>Quantity</th>
                          <th>Destination / Details</th>
                          <th>Bill</th>
                          <th>Note</th>
                          <th>Status</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wastageAdjRows.map((r) => (
                          <tr
                            key={r.id}
                            className="clickable-row"
                            onClick={() => {
                              const mat = stockRows.find((s) => Number(s.id) === Number(r.material_id)) || { id: r.material_id, name: r.material_name, unit: r.material_unit };
                              openMaterialTimeline(mat);
                            }}
                            title="Click to view material ledger & transaction timeline"
                          >
                            <td>{r.adjustment_date ? String(r.adjustment_date).slice(0, 10) : '—'}</td>
                            <td><b>{r.material_name}</b></td>
                            <td>
                              <span className="badge badge-active" style={{ textTransform: 'capitalize' }}>
                                {r.adjustment_type?.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td style={{ fontWeight: 600 }}>{Number(r.quantity).toFixed(2)} {r.material_unit}</td>
                            <td>{r.to_project_name ? `Transfer to: ${r.to_project_name}` : '—'}</td>
                            <td onClick={(e) => e.stopPropagation()}>
                              {r.bill_url ? (
                                <a href={r.bill_url} target="_blank" rel="noreferrer" title={r.bill_filename} style={{ textDecoration: 'none' }}>
                                  📄
                                </a>
                              ) : '—'}
                            </td>
                            <td>{r.note || '—'}</td>
                            <td>{r.over_used && <span className="badge badge-overused">Over-used</span>}</td>
                            <td className="actions" style={{ justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                              <button
                                className="muted"
                                onClick={() => {
                                  setEditingAdjId(r.id);
                                  setAdjustmentForm({
                                    material_id: String(r.material_id),
                                    material_name: r.material_name || stockRows.find((m) => Number(m.id) === Number(r.material_id))?.name || '',
                                    adjustment_type: r.adjustment_type,
                                    quantity: r.quantity,
                                    adjustment_date: r.adjustment_date ? String(r.adjustment_date).slice(0, 10) : today(),
                                    to_project_id: r.to_project_id ? String(r.to_project_id) : '',
                                    supplier_name: r.supplier_name || '',
                                    amount: r.amount || '',
                                    note: r.note || '',
                                    bill_url: r.bill_url || '',
                                    bill_filename: r.bill_filename || '',
                                  });
                                  setAdjustmentModal(true);
                                }}
                              >
                                Edit
                              </button>
                              {!isAgent && (
                                <button className="danger" onClick={() => del('adjustment', r.id)}>
                                  Delete
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                        {wastageAdjRows.length === 0 && (
                          <tr>
                            <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                              No adjustments or wastage entries recorded. Click &ldquo;⚡ + Record Wastage / Adjustment&rdquo; above.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}

                  {constructionSubTab === 'return' && (
                    <table>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Material</th>
                          <th>Type</th>
                          <th>Quantity</th>
                          <th>Returned To / Supplier</th>
                          <th>Refund / Credit Amount</th>
                          <th>Challan / Bill</th>
                          <th>Note</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {returnMaterialRows.map((r) => (
                          <tr
                            key={r.id}
                            className="clickable-row"
                            onClick={() => {
                              const mat = stockRows.find((s) => Number(s.id) === Number(r.material_id)) || { id: r.material_id, name: r.material_name, unit: r.material_unit };
                              openMaterialTimeline(mat);
                            }}
                            title="Click to view material ledger & transaction timeline"
                          >
                            <td>{r.adjustment_date ? String(r.adjustment_date).slice(0, 10) : '—'}</td>
                            <td><b>{r.material_name}</b></td>
                            <td>
                              <span className="badge badge-active" style={{ background: '#e0f2fe', color: '#0369a1', fontWeight: 600, textTransform: 'capitalize' }}>
                                {r.adjustment_type === 'return_to_supplier' ? 'Return to Supplier' : 'Return Material'}
                              </span>
                            </td>
                            <td style={{ fontWeight: 600 }}>{Number(r.quantity).toFixed(2)} {r.material_unit}</td>
                            <td>{r.supplier_name || '—'}</td>
                            <td style={{ fontWeight: 600, color: r.amount ? '#16a34a' : '#64748b' }}>
                              {r.amount ? INR(r.amount) : '—'}
                            </td>
                            <td onClick={(e) => e.stopPropagation()}>
                              {r.bill_url ? (
                                <a href={r.bill_url} target="_blank" rel="noreferrer" title={r.bill_filename} style={{ textDecoration: 'none' }}>
                                  📄 View Slip
                                </a>
                              ) : '—'}
                            </td>
                            <td>{r.note || '—'}</td>
                            <td className="actions" style={{ justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                              <button
                                className="muted"
                                onClick={() => {
                                  setEditingAdjId(r.id);
                                  setAdjustmentForm({
                                    material_id: String(r.material_id),
                                    material_name: r.material_name || stockRows.find((m) => Number(m.id) === Number(r.material_id))?.name || '',
                                    adjustment_type: r.adjustment_type,
                                    quantity: r.quantity,
                                    adjustment_date: r.adjustment_date ? String(r.adjustment_date).slice(0, 10) : today(),
                                    to_project_id: r.to_project_id ? String(r.to_project_id) : '',
                                    supplier_id: r.supplier_id ? String(r.supplier_id) : '',
                                    supplier_name: r.supplier_name || '',
                                    amount: r.amount || '',
                                    note: r.note || '',
                                    bill_url: r.bill_url || '',
                                    bill_filename: r.bill_filename || '',
                                  });
                                  setAdjustmentModal(true);
                                }}
                              >
                                Edit
                              </button>
                              {!isAgent && (
                                <button className="danger" onClick={() => del('adjustment', r.id)}>
                                  Delete
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                        {returnMaterialRows.length === 0 && (
                          <tr>
                            <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                              No material returns recorded yet. Click &ldquo;🔄 + Record Return Material&rdquo; above.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}

                  {constructionSubTab === 'scrap' && (
                    <table>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Material</th>
                          <th>Type</th>
                          <th>Quantity</th>
                          <th>Scrap Sold Amount</th>
                          <th>Buyer / Dealer</th>
                          <th>Receipt / Bill</th>
                          <th>Note</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scrapMaterialRows.map((r) => (
                          <tr
                            key={r.id}
                            className="clickable-row"
                            onClick={() => {
                              const mat = stockRows.find((s) => Number(s.id) === Number(r.material_id)) || { id: r.material_id, name: r.material_name, unit: r.material_unit };
                              openMaterialTimeline(mat);
                            }}
                            title="Click to view material ledger & transaction timeline"
                          >
                            <td>{r.adjustment_date ? String(r.adjustment_date).slice(0, 10) : '—'}</td>
                            <td><b>{r.material_name}</b></td>
                            <td>
                              <span className="badge badge-active" style={{ background: '#fef3c7', color: '#b45309', fontWeight: 600, textTransform: 'capitalize' }}>
                                Scrap Material
                              </span>
                            </td>
                            <td style={{ fontWeight: 600 }}>{Number(r.quantity).toFixed(2)} {r.material_unit}</td>
                            <td style={{ fontWeight: 700, color: r.amount ? '#16a34a' : '#64748b' }}>
                              {r.amount ? INR(r.amount) : '—'}
                            </td>
                            <td>{r.supplier_name || '—'}</td>
                            <td onClick={(e) => e.stopPropagation()}>
                              {r.bill_url ? (
                                <a href={r.bill_url} target="_blank" rel="noreferrer" title={r.bill_filename} style={{ textDecoration: 'none' }}>
                                  📄 View Slip
                                </a>
                              ) : '—'}
                            </td>
                            <td>{r.note || '—'}</td>
                            <td className="actions" style={{ justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                              <button
                                className="muted"
                                onClick={() => {
                                  setEditingAdjId(r.id);
                                  setAdjustmentForm({
                                    material_id: String(r.material_id),
                                    material_name: r.material_name || stockRows.find((m) => Number(m.id) === Number(r.material_id))?.name || '',
                                    adjustment_type: r.adjustment_type,
                                    quantity: r.quantity,
                                    adjustment_date: r.adjustment_date ? String(r.adjustment_date).slice(0, 10) : today(),
                                    to_project_id: r.to_project_id ? String(r.to_project_id) : '',
                                    supplier_name: r.supplier_name || '',
                                    amount: r.amount || '',
                                    note: r.note || '',
                                    bill_url: r.bill_url || '',
                                    bill_filename: r.bill_filename || '',
                                  });
                                  setAdjustmentModal(true);
                                }}
                              >
                                Edit
                              </button>
                              {!isAgent && (
                                <button className="danger" onClick={() => del('adjustment', r.id)}>
                                  Delete
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                        {scrapMaterialRows.length === 0 && (
                          <tr>
                            <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                              No scrap material entries recorded yet. Click &ldquo;♻️ + Record Scrap Material&rdquo; above.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}

                      {constructionSubTab === 'expenses' && (
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
                        <option value="tools">Tools</option>
                        <option value="rent">Rent</option>
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
                            <td className="actions" style={{ justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
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
                              {!isAgent && (
                                <button className="danger" onClick={() => del('expense', r.id)}>
                                  Delete
                                </button>
                              )}
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
                    </div>
                  )}

            </>
          ) : selectedVendor ? (
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
                {(!isAgent || hasAgentPayment) && (
                  <div className="stats" style={{ marginTop: 12 }}>
                    <div className="stat">
                      <small>Total Earned</small>
                      <b>{INR(selectedVendor.total_earned ?? selectedVendor.earned)}</b>
                    </div>
                    {!isSupervisor && (
                      <>
                        <div className="stat">
                          <small>Total Paid</small>
                          <b style={{ color: '#16a34a' }}>{INR(selectedVendor.total_paid ?? selectedVendor.paid)}</b>
                        </div>
                        <div className="stat">
                          <small>Balance</small>
                          {(() => {
                            const bal = Number(selectedVendor.balance_due ?? selectedVendor.balance ?? (Number(selectedVendor.total_earned ?? selectedVendor.earned ?? 0) - Number(selectedVendor.total_paid ?? selectedVendor.paid ?? 0)));
                            if (bal > 0) return <b style={{ color: '#ea580c' }}>Due: {INR(bal)}</b>;
                            if (bal < 0) return <span className="badge badge-active" style={{ background: '#dcfce7', color: '#15803d', fontWeight: 700, fontSize: 13, padding: '3px 8px' }}>Advance: {INR(Math.abs(bal))}</span>;
                            return <b style={{ color: '#64748b' }}>Settled (₹0)</b>;
                          })()}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Contractor Team & Assigned Workers */}
              <div className="card" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 15 }}>👥 Assigned Team Members ({projectLabors.filter((l) => String(l.project_vendor_id) === String(selectedVendor.id)).length})</h4>
                    <p style={{ margin: '3px 0 0', color: '#64748b', fontSize: 12 }}>Workers working under this contractor. Click any row to view worker details.</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => {
                        setLaborForm({
                          name: '',
                          phone: '',
                          trade: selectedVendor.trade || '',
                          project_vendor_id: String(selectedVendor.id),
                          daily_rate: '',
                          is_active: true,
                        });
                        setLockedContractorId(String(selectedVendor.id));
                        setEditingLaborId(null);
                        setModalError('');
                        setAddLaborModal(true);
                      }}
                    >
                      + Add Worker to Team
                    </button>
                    <button
                      type="button"
                      className="muted"
                      onClick={() => {
                        setSelectedVendor(null);
                        handleSectionChange('attendance');
                        setAttendanceSubTab('labor');
                        setLaborAttendanceSection('contractor');
                        setAttendanceContractorFilter(String(selectedVendor.id));
                      }}
                    >
                      📅 Team Attendance
                    </button>
                  </div>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>Worker Name</th>
                      <th>Trade</th>
                      <th>Daily Rate</th>
                      <th>Days Present</th>
                      <th>Total Earned</th>
                      {!isSupervisor && <th>Total Paid</th>}
                      {!isSupervisor && <th>Balance</th>}
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectLabors
                      .filter((l) => String(l.project_vendor_id) === String(selectedVendor.id))
                      .map((lab) => {
                        const bal = Number(lab.balance_due ?? (Number(lab.total_earned || 0) - Number(lab.total_paid || 0)));
                        return (
                          <tr
                            key={lab.id}
                            className="clickable-row"
                            onClick={() => openLaborDetail(lab)}
                            title="Click to view worker details and attendance calendar"
                          >
                            <td>
                              <b>{lab.name}</b>
                              {lab.phone && <span style={{ fontSize: 11, color: '#64748b', display: 'block' }}>{lab.phone}</span>}
                            </td>
                            <td>{lab.trade || 'Helper'}</td>
                            <td style={{ fontWeight: 600 }}>{INR(lab.daily_rate)}/day</td>
                            <td>{lab.days_present || 0}</td>
                            <td style={{ fontWeight: 600, color: '#16a34a' }}>{INR(lab.total_earned)}</td>
                            {!isSupervisor && (
                              <>
                                <td style={{ fontWeight: 600, color: '#16a34a' }}>{INR(lab.total_paid)}</td>
                                <td>
                                  {bal < 0 ? (
                                    <span className="badge badge-active" style={{ background: '#dcfce7', color: '#15803d', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                      Advance: {INR(Math.abs(bal))}
                                    </span>
                                  ) : bal > 0 ? (
                                    <span style={{ fontWeight: 700, color: '#ea580c', whiteSpace: 'nowrap' }}>
                                      Due: {INR(bal)}
                                    </span>
                                  ) : (
                                    <span style={{ color: '#64748b', fontWeight: 600 }}>Settled (₹0)</span>
                                  )}
                                </td>
                              </>
                            )}
                            <td>
                              <span className={`badge ${lab.is_active ? 'badge-active' : 'badge-completed'}`}>
                                {lab.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="actions" style={{ justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                className="muted"
                                onClick={() => openLaborDetail(lab)}
                              >
                                View Details &rarr;
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    {projectLabors.filter((l) => String(l.project_vendor_id) === String(selectedVendor.id)).length === 0 && (
                      <tr>
                        <td colSpan={isSupervisor ? 7 : 9} style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b' }}>
                          No laborers added for this contractor yet. Click &ldquo;+ Add Worker to Team&rdquo; above.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
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
                      <tr
                        key={m.id}
                        className={m.material_id ? 'clickable-row' : ''}
                        onClick={() => {
                          if (m.material_id) {
                            const mat = stockRows.find((s) => Number(s.id) === Number(m.material_id)) || { id: m.material_id, name: m.item_name, unit: m.unit };
                            openMaterialTimeline(mat);
                          }
                        }}
                        title={m.material_id ? 'Click to view material ledger & transaction timeline' : undefined}
                      >
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
              {!isSupervisor && (!isAgent || hasAgentPayment) && (
                <div className="card">
                  <h4 style={{ margin: '0 0 12px', fontSize: 15 }}>Payment History</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Advance Payment</th>
                        <th>Mode</th>
                        <th>Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendorPaymentsHistory.map((p) => {
                        const isAdvance = p.payment_type === 'advance';
                        return (
                          <tr key={p.id}>
                            <td>{p.payment_date ? String(p.payment_date).slice(0, 10) : '—'}</td>
                            <td>
                              <span
                                className="badge badge-active"
                                style={{
                                  textTransform: 'capitalize',
                                  background: isAdvance ? '#dcfce7' : undefined,
                                  color: isAdvance ? '#15803d' : undefined,
                                  fontWeight: isAdvance ? 700 : undefined,
                                }}
                              >
                                {p.payment_type}
                              </span>
                            </td>
                            <td style={{ fontWeight: 700, color: '#16a34a' }}>{INR(p.amount)}</td>
                            <td>
                              {isAdvance ? (
                                <span className="badge badge-active" style={{ background: '#dcfce7', color: '#15803d', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                  Advance: {INR(p.amount)}
                                </span>
                              ) : (
                                <span style={{ color: '#94a3b8' }}>—</span>
                              )}
                            </td>
                            <td style={{ textTransform: 'uppercase', fontSize: 11 }}>{p.mode}</td>
                            <td>{p.note || '—'}</td>
                          </tr>
                        );
                      })}
                      {vendorPaymentsHistory.length === 0 && (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b' }}>
                            No payments recorded yet for this vendor.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : selectedLabor ? (
            /* ── LABOR DETAIL SCREEN (ATTENDANCE CALENDAR & PAYMENT HISTORY) ── */
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <button className="muted" onClick={() => setSelectedLabor(null)}>
                  &larr; Back to Project Overview
                </button>

              </div>

              <div className="card" style={{ marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 18 }}>{selectedLabor.name}</h3>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
                  Trade: <b>{selectedLabor.trade || 'Helper'}</b> &bull; Rate: <b>{INR(selectedLabor.daily_rate)}/day</b> &bull; Contractor:{' '}
                  <b>{selectedLabor.vendor_name ? selectedLabor.vendor_name : 'Independent (Direct Worker)'}</b>
                  {selectedLabor.phone ? ` • Phone: ${selectedLabor.phone}` : ''}
                </p>
                <div className="stats" style={{ marginTop: 12 }}>
                  <div className="stat">
                    <small>Total Earned</small>
                    <b>{INR(selectedLabor.total_earned)}</b>
                  </div>
                  {!isSupervisor && (
                    <>
                      <div className="stat">
                        <small>Total Paid</small>
                        <b style={{ color: '#16a34a' }}>{INR(selectedLabor.total_paid)}</b>
                      </div>
                      <div className="stat">
                        <small>Balance</small>
                        {(() => {
                          const bal = Number(selectedLabor.balance_due ?? (Number(selectedLabor.total_earned || 0) - Number(selectedLabor.total_paid || 0)));
                          if (bal > 0) return <b style={{ color: '#ea580c' }}>Due: {INR(bal)}</b>;
                          if (bal < 0) return <span className="badge badge-active" style={{ background: '#dcfce7', color: '#15803d', fontWeight: 700, fontSize: 13, padding: '3px 8px' }}>Advance: {INR(Math.abs(bal))}</span>;
                          return <b style={{ color: '#64748b' }}>Settled (₹0)</b>;
                        })()}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Monthly Attendance Calendar */}
              <div className="card" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h4 style={{ margin: 0, fontSize: 15 }}>Attendance Calendar</h4>
                  <input
                    type="month"
                    value={laborCalendarMonth}
                    onChange={(e) => {
                      setLaborCalendarMonth(e.target.value);
                      api(`/api/admin/project-management/labor/attendance?laborId=${selectedLabor.id}&month=${e.target.value}`)
                        .then((r) => setLaborAttendanceHistory(r.data || []))
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
                    const dKey = `${laborCalendarMonth}-${dayStr}`;
                    const match = laborAttendanceHistory.find((a) => a.attendance_date?.slice(0, 10) === dKey);
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
                        {match && match.wage_amount > 0 && (
                          <div style={{ fontSize: 9, marginTop: 1, color: '#16a34a' }}>{INR(match.wage_amount)}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Labor Payment History */}
              {!isSupervisor && (
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h4 style={{ margin: 0, fontSize: 15 }}>Payment History</h4>

                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Advance Payment</th>
                        <th>Mode</th>
                        <th>Note</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {laborPaymentsHistory.map((p) => {
                        const isAdvance = p.payment_type === 'advance';
                        return (
                          <tr key={p.id}>
                            <td>{p.payment_date ? String(p.payment_date).slice(0, 10) : '—'}</td>
                            <td>
                              <span
                                className="badge badge-active"
                                style={{
                                  textTransform: 'capitalize',
                                  background: isAdvance ? '#dcfce7' : undefined,
                                  color: isAdvance ? '#15803d' : undefined,
                                  fontWeight: isAdvance ? 700 : undefined,
                                }}
                              >
                                {p.payment_type || 'wage'}
                              </span>
                            </td>
                            <td style={{ fontWeight: 700, color: '#16a34a' }}>{INR(p.amount)}</td>
                            <td>
                              {isAdvance ? (
                                <span className="badge badge-active" style={{ background: '#dcfce7', color: '#15803d', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                  Advance: {INR(p.amount)}
                                </span>
                              ) : (
                                <span style={{ color: '#94a3b8' }}>—</span>
                              )}
                            </td>
                            <td>
                              <span className="badge badge-active" style={{ textTransform: 'uppercase', fontSize: 10 }}>
                                {p.mode}
                              </span>
                            </td>
                            <td>
                              {p.note || '—'}
                              {p.transaction_reference && <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Ref: {p.transaction_reference}</div>}
                            </td>
                            <td className="actions" style={{ justifyContent: 'flex-end' }}>
                              {!isAgent && (
                                <button
                                  className="danger"
                                  onClick={() => del('laborPayment', p.id)}
                                >
                                  Delete
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                      {laborPaymentsHistory.length === 0 && (
                        <tr>
                          <td colSpan={7} style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b' }}>
                            No payments recorded yet for this worker.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : timelineMaterial ? (
            /* ── MATERIAL TIMELINE DETAIL SCREEN ── */
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <button className="muted" onClick={() => setTimelineMaterial(null)}>
                  &larr; Back to Project Overview
                </button>
              </div>

              <div className="card" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 18 }}>{timelineMaterial.name}</h3>
                    <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
                      Category: <b>{timelineMaterial.category || 'General'}</b> &bull; Unit: <b>{timelineMaterial.unit}</b>
                      {timelineMaterial.min_stock_level > 0 && ` • Min Stock Alert: ${timelineMaterial.min_stock_level} ${timelineMaterial.unit}`}
                    </p>
                  </div>
                  <div style={{ background: timelineStock < 0 ? '#fef2f2' : '#f0fdf4', padding: '10px 16px', borderRadius: 8, border: `1px solid ${timelineStock < 0 ? '#fecaca' : '#bbf7d0'}`, textAlign: 'right' }}>
                    <span style={{ fontSize: 11, color: timelineStock < 0 ? '#991b1b' : '#166534', fontWeight: 600, display: 'block' }}>
                      Current Stock Balance
                    </span>
                    <div style={{ fontSize: 22, fontWeight: 900, color: timelineStock < 0 ? '#dc2626' : '#16a34a' }}>
                      {Number(timelineStock).toFixed(2)} {timelineMaterial.unit}
                      {timelineStock < 0 && <span className="badge badge-overused" style={{ marginLeft: 8, fontSize: 11 }}>Over-used</span>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h4 style={{ margin: '0 0 12px', fontSize: 15 }}>Running Stock Ledger &amp; Transaction History</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Details / Supplier / Destination</th>
                      <th>Quantity</th>
                      <th>Running Stock</th>
                      {!isSupervisor && <th>Rate / Amount</th>}
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
          ) : null}

          {/* ── MODAL: ADD / EDIT LABOR ─────────────────────────────────────── */}
          {/* ── MODAL: ADD / EDIT LABOR ─────────────────────────────────────── */}
          {addLaborModal && (
            <div className="modal-overlay">
              <form onSubmit={(e) => submitAction.submit('labor', () => saveLabor(e), { successMessage: editingLaborId ? 'Laborer updated successfully' : 'Laborer added successfully', onError: setModalError })} className="modal-card">
                <h3 style={{ margin: '0 0 12px', fontSize: 17, color: '#0f172a' }}>
                  {editingLaborId ? 'Edit Labor Worker' : 'Add Labor Worker to Project'}
                </h3>

                {modalError && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '8px 12px', borderRadius: 6, marginBottom: 12, fontSize: 13 }}>
                    ⚠️ {modalError}
                  </div>
                )}

                {lockedContractorId && (
                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, padding: '8px 12px', marginBottom: 12, fontSize: 12, color: '#1e40af' }}>
                    👷 <b>Contractor Team Worker:</b> Adding worker directly to <b>{projectVendors.find((pv) => String(pv.id) === String(lockedContractorId))?.vendor_name || 'Contractor'}</b> team.
                  </div>
                )}

                <div style={{ marginBottom: 12 }}>
                  <Input
                    label="Worker Full Name"
                    name="name"
                    value={laborForm.name}
                    set={setLaborForm}
                    required
                    placeholder="e.g. Ramesh Kumar"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                  <Input
                    label="Phone Number"
                    name="phone"
                    value={laborForm.phone}
                    set={setLaborForm}
                    placeholder="e.g. 9876543210"
                  />
                  <Input
                    label="Trade / Skill"
                    name="trade"
                    value={laborForm.trade}
                    set={setLaborForm}
                    placeholder="e.g. Mason, Helper, Painter, Carpenter"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                  <div>
                    <label>
                      <small style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: '#475569' }}>
                        Contractor / Linked Vendor
                      </small>
                      <select
                        value={laborForm.project_vendor_id}
                        disabled={Boolean(lockedContractorId)}
                        onChange={(e) => setLaborForm({ ...laborForm, project_vendor_id: e.target.value })}
                      >
                        <option value="">⚡ Independent (Direct Worker / No Contractor)</option>
                        {projectVendors.map((pv) => (
                          <option key={pv.id} value={pv.id}>
                            🏢 {pv.vendor_name} ({pv.trade || 'Vendor'} — {pv.work_description})
                          </option>
                        ))}
                      </select>
                    </label>
                    <span style={{ fontSize: 10, color: '#64748b', display: 'block', marginTop: 2 }}>
                      {lockedContractorId ? 'Locked to this contractor team.' : 'Leave Independent if directly hired without a contractor.'}
                    </span>
                  </div>

                  <Input
                    label="Daily Rate (₹/day)"
                    name="daily_rate"
                    type="number"
                    value={laborForm.daily_rate}
                    set={setLaborForm}
                    required
                    min="0"
                    placeholder="e.g. 600"
                  />
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
                  <button
                    type="button"
                    className="muted"
                    disabled={submitAction.isSubmitting('labor')}
                    onClick={() => {
                      setAddLaborModal(false);
                      setEditingLaborId(null);
                      setLockedContractorId(null);
                      setModalError('');
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={submitAction.isSubmitting('labor')}>
                    {submitAction.isSubmitting('labor') ? 'Saving…' : (editingLaborId ? 'Update Laborer' : 'Add Laborer')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── MODAL: RECORD LABOR PAYMENT ─────────────────────────────────── */}
          {laborPaymentModal && !isSupervisor && (
            <div className="modal-overlay">
              <form onSubmit={(e) => submitAction.submit('laborPayment', () => saveLaborPayment(e), { successMessage: 'Labor payment recorded successfully', onError: setModalError })} className="modal-card">
                <h3 style={{ margin: '0 0 12px', fontSize: 17, color: '#0f172a' }}>
                  {editingLaborPaymentId ? 'Edit Labor Payment' : 'Record Labor Payment'}
                </h3>

                <div style={{ marginBottom: 12 }}>
                  <label>
                    <small style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: '#475569' }}>
                      Select Laborer
                    </small>
                    <select
                      required
                      value={laborPaymentForm.labor_id}
                      disabled={Boolean(editingLaborPaymentId || (selectedLabor && !editingLaborPaymentId))}
                      onChange={(e) => {
                        const labId = e.target.value;
                        const lab = projectLabors.find((l) => String(l.id) === String(labId));
                        const bal = lab ? Number(lab.balance_due ?? (Number(lab.total_earned || 0) - Number(lab.total_paid || 0))) : 0;
                        setLaborPaymentForm({
                          ...laborPaymentForm,
                          labor_id: labId,
                          payment_type: bal <= 0 ? 'advance' : 'wage',
                        });
                      }}
                    >
                      <option value="">-- Choose Worker --</option>
                      {projectLabors.map((lab) => {
                        const bal = Number(lab.balance_due ?? (Number(lab.total_earned || 0) - Number(lab.total_paid || 0)));
                        const balLabel = bal > 0 ? `Due: ${INR(bal)}` : bal < 0 ? `Advance: ${INR(Math.abs(bal))}` : 'Settled (₹0)';
                        return (
                          <option key={lab.id} value={lab.id}>
                            {lab.name} ({lab.trade || 'Helper'} &bull; {INR(lab.daily_rate)}/day) &bull; {balLabel}
                          </option>
                        );
                      })}
                    </select>
                  </label>
                </div>

                {(() => {
                  const selLab = projectLabors.find((l) => String(l.id) === String(laborPaymentForm.labor_id));
                  if (!selLab) return null;
                  const bal = Number(selLab.balance_due ?? (Number(selLab.total_earned || 0) - Number(selLab.total_paid || 0)));
                  return (
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
                      <div>
                        <small style={{ color: '#64748b', display: 'block' }}>Laborer</small>
                        <b>{selLab.name}</b> <span style={{ fontSize: 11, color: '#64748b' }}>({selLab.trade || 'Helper'})</span>
                      </div>
                      <div>
                        <small style={{ color: '#64748b', display: 'block' }}>Daily Wage</small>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{INR(selLab.daily_rate)}/day</span>
                      </div>
                      <div>
                        <small style={{ color: '#64748b', display: 'block' }}>Total Earned</small>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{INR(selLab.total_earned)}</span>
                      </div>
                      <div>
                        <small style={{ color: '#64748b', display: 'block' }}>Total Paid</small>
                        <span style={{ fontWeight: 600, color: '#16a34a' }}>{INR(selLab.total_paid)}</span>
                      </div>
                      <div>
                        <small style={{ color: '#64748b', display: 'block' }}>Current Balance</small>
                        {bal > 0 ? (
                          <span style={{ fontWeight: 700, color: '#ea580c' }}>Due: {INR(bal)}</span>
                        ) : bal < 0 ? (
                          <span className="badge badge-active" style={{ background: '#dcfce7', color: '#15803d', fontWeight: 700 }}>
                            Advance: {INR(Math.abs(bal))}
                          </span>
                        ) : (
                          <span style={{ color: '#64748b', fontWeight: 600 }}>Settled (₹0)</span>
                        )}
                      </div>
                    </div>
                  );
                })()}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                  <Input
                    label="Amount (₹)"
                    name="amount"
                    type="number"
                    value={laborPaymentForm.amount}
                    set={setLaborPaymentForm}
                    required
                    min="1"
                    placeholder="e.g. 3000"
                  />
                  <Input
                    label="Payment Date"
                    name="payment_date"
                    type="date"
                    value={laborPaymentForm.payment_date}
                    set={setLaborPaymentForm}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                  <label>
                    <small style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: '#475569' }}>
                      Payment Type
                    </small>
                    <select
                      value={laborPaymentForm.payment_type || 'wage'}
                      onChange={(e) => setLaborPaymentForm({ ...laborPaymentForm, payment_type: e.target.value })}
                    >
                      <option value="wage">Wage Payment</option>
                      <option value="advance">Advance Payment</option>
                    </select>
                  </label>

                  <label>
                    <small style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: '#475569' }}>
                      Payment Mode
                    </small>
                    <select
                      value={laborPaymentForm.mode}
                      onChange={(e) => setLaborPaymentForm({ ...laborPaymentForm, mode: e.target.value })}
                    >
                      <option value="cash">Cash</option>
                      <option value="bank">Bank Transfer</option>
                      <option value="upi">UPI / Online</option>
                      <option value="cheque">Cheque</option>
                    </select>
                  </label>
                  {(laborPaymentForm.mode === 'upi' || laborPaymentForm.mode === 'bank') && (
                    <Input label="Transaction Reference / UPI ID" name="transaction_reference" value={laborPaymentForm.transaction_reference || ''} set={setLaborPaymentForm} placeholder="e.g. UPI ID, UTR number, or bank transaction ID" />
                  )}

                  <Input
                    label="Note / Remarks"
                    name="note"
                    value={laborPaymentForm.note}
                    set={setLaborPaymentForm}
                    placeholder="e.g. Weekly wage, advance"
                  />
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
                  <button
                    type="button"
                    className="muted"
                    onClick={() => {
                      setLaborPaymentModal(false);
                      setEditingLaborPaymentId(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={submitAction.isSubmitting('laborPayment')}>
                    {submitAction.isSubmitting('laborPayment') ? 'Saving…' : (editingLaborPaymentId ? 'Update Payment' : 'Save Payment')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── MODAL: ASSIGN VENDOR ────────────────────────────────────────── */}
          {addVendorModal && (
            <div className="modal-overlay">
              <form onSubmit={(e) => submitAction.submit('contractor', () => assignVendorToProject(e), { successMessage: vendorMode === 'new' ? 'Contractor created and assigned successfully' : 'Contractor assigned successfully', onError: setModalError })} className="modal-card">
                <h3 style={{ margin: '0 0 12px', fontSize: 17, color: '#0f172a' }}>
                  Add Contractor to Project
                </h3>

                {modalError && (
                  <div style={{ background: '#fee2e2', border: '1px solid #f87171', borderRadius: 6, padding: '8px 12px', marginBottom: 12, fontSize: 13, color: '#991b1b' }}>
                    ⚠️ {modalError}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                  <button
                    type="button"
                    className={vendorMode === 'existing' ? 'active-btn' : 'muted'}
                    onClick={() => { setVendorMode('existing'); setModalError(''); }}
                  >
                    Select Existing Contractor
                  </button>
                  <button
                    type="button"
                    className={vendorMode === 'new' ? 'active-btn' : 'muted'}
                    onClick={() => { setVendorMode('new'); setModalError(''); }}
                  >
                    + Create New Contractor
                  </button>
                </div>

                {vendorMode === 'existing' ? (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="Search contractor by name or phone..."
                        value={contractorSearch}
                        onChange={(e) => {
                          setContractorSearch(e.target.value);
                          loadContractorsList('all', e.target.value);
                        }}
                        style={{ flex: 1, padding: '7px 10px', fontSize: 13, borderRadius: 6, border: '1px solid #cbd5e1' }}
                      />
                      <button
                        type="button"
                        className="muted"
                        style={{ padding: '7px 12px', fontSize: 12, whiteSpace: 'nowrap' }}
                        onClick={() => {
                          setContractorSearch('');
                          loadContractorsList('all', '');
                        }}
                      >
                        Reset
                      </button>
                    </div>

                    <label>
                      <small style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: '#475569' }}>
                        Select Registered Contractor <span style={{ color: '#ef4444' }}>*</span>
                      </small>
                      {contractorsLoading ? (
                        <div style={{ padding: '10px', fontSize: 12, color: '#64748b' }}>
                          Loading registered contractors...
                        </div>
                      ) : allVendorsMaster.length > 0 ? (
                        <select
                          required
                          value={assignForm.vendor_id}
                          onChange={(e) => setAssignForm({ ...assignForm, vendor_id: e.target.value })}
                        >
                          <option value="">-- Choose Registered Contractor ({allVendorsMaster.length} available) --</option>
                          {allVendorsMaster.map((v) => (
                            <option value={v.id} key={v.id}>
                              {v.name} ({v.contractor_trade || v.trade || 'General'}) — {v.phone || 'No phone'}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: '10px 12px', fontSize: 12, color: '#991b1b', lineHeight: 1.5 }}>
                          ⚠️ Koi registered contractor nahi mila. Vendors &gt; Customers me jakar &apos;Register as Contractor&apos; enable karein.
                        </div>
                      )}
                    </label>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                    <Input label="Contractor Name" name="new_vendor_name" value={assignForm.new_vendor_name} set={setAssignForm} required />
                    <Input label="Phone" name="new_vendor_phone" value={assignForm.new_vendor_phone} set={setAssignForm} />
                    <label>
                      <small style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: '#475569' }}>Contractor Type / Trade</small>
                      <select value={assignForm.new_vendor_trade} onChange={(e) => setAssignForm({ ...assignForm, new_vendor_trade: e.target.value })}>
                        <option value="">Select contractor type</option>
                        {contractorTrades.map((trade) => <option key={trade} value={trade}>{trade}</option>)}
                      </select>
                    </label>
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
                  <button type="button" className="muted" disabled={submitAction.isSubmitting('contractor')} onClick={() => { setAddVendorModal(false); setModalError(''); }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submitAction.isSubmitting('contractor')}>{submitAction.isSubmitting('contractor') ? 'Adding…' : 'Assign Contractor'}</button>
                </div>
              </form>
            </div>
          )}

          {/* ── MODAL: RECORD VENDOR MATERIAL SUPPLY ────────────────────────── */}
          {supplyModal && selectedVendor && (
            <div className="modal-overlay">
              <form onSubmit={(e) => submitAction.submit('supply', () => saveMaterialSupply(e), { successMessage: 'Supplier delivery saved successfully', onError: setModalError })} className="modal-card">
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

                  <Input label="Note" name="note" value={supplyForm.note} set={setSupplyForm} />
                </div>

                <div style={{ marginTop: 12, textAlign: 'right', fontWeight: 700 }}>
                  Estimated Total: {INR(Number(supplyForm.quantity || 0) * Number(supplyForm.rate || 0))}
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
                  <button type="button" className="muted" disabled={submitAction.isSubmitting('supply')} onClick={() => setSupplyModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submitAction.isSubmitting('supply')}>{submitAction.isSubmitting('supply') ? 'Saving…' : 'Save Supply'}</button>
                </div>
              </form>
            </div>
          )}

          {/* ── MODAL: CREATE MASTER MATERIAL ───────────────────────────────── */}
          {addMaterialModal && (
            <div className="modal-overlay">
              <form onSubmit={(e) => submitAction.submit('material', () => saveMaterialMaster(e), { successMessage: 'Material created successfully', onError: setModalError })} className="modal-card">
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
                  <button type="button" className="muted" disabled={submitAction.isSubmitting('material')} onClick={() => setAddMaterialModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submitAction.isSubmitting('material')}>{submitAction.isSubmitting('material') ? 'Adding…' : 'Create Material'}</button>
                </div>
              </form>
            </div>
          )}

          {/* ── MODAL: RECORD SUPPLIER PAYMENT ─────────────────────────────── */}
          {supplierPaymentModal && (
            <div className="modal-overlay">
              <form
                onSubmit={(e) =>
                  submitAction.submit('supplierPayment', () => saveSupplierPayment(e), {
                    successMessage: 'Supplier payment recorded successfully',
                    onError: setModalError,
                  })
                }
                className="modal-card"
              >
                <h3 style={{ margin: '0 0 14px', fontSize: 17, color: '#0f172a' }}>
                  Record Payment to Supplier
                </h3>
                {modalError && (
                  <div
                    role="alert"
                    style={{
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      color: '#b91c1c',
                      padding: '8px 12px',
                      borderRadius: 6,
                      marginBottom: 12,
                      fontSize: 13,
                    }}
                  >
                    {modalError}
                  </div>
                )}

                <div className="grid">
                  <label>
                    <small style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: '#475569' }}>
                      Supplier *
                    </small>
                    <select
                      required
                      value={supplierPaymentForm.supplier_id ? `reg_${supplierPaymentForm.supplier_id}` : (supplierPaymentForm.supplier_name ? `unreg_${supplierPaymentForm.supplier_name.toLowerCase().trim()}` : '')}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val.startsWith('reg_')) {
                          const sId = Number(val.replace('reg_', ''));
                          const sup = suppliersMaster.find((s) => Number(s.id) === sId) || projectSuppliers.find((s) => Number(s.supplier_id) === sId);
                          setSupplierPaymentForm({
                            ...supplierPaymentForm,
                            supplier_id: sId,
                            supplier_name: sup?.shop_name || sup?.business_name || '',
                          });
                        } else if (val.startsWith('unreg_')) {
                          const sup = projectSuppliers.find((s) => s.key === val);
                          setSupplierPaymentForm({
                            ...supplierPaymentForm,
                            supplier_id: '',
                            supplier_name: sup?.supplier_name || val.replace('unreg_', ''),
                          });
                        } else {
                          setSupplierPaymentForm({
                            ...supplierPaymentForm,
                            supplier_id: '',
                            supplier_name: '',
                          });
                        }
                      }}
                    >
                      <option value="">Select Supplier</option>
                      {projectSuppliers.length > 0 && (
                        <optgroup label="Suppliers Used in Project">
                          {projectSuppliers.map((s) => (
                            <option key={s.key} value={s.key}>
                              {s.supplier_name} • Balance: {s.balance > 0 ? `Due ${INR(s.balance)}` : s.balance < 0 ? `Advance ${INR(Math.abs(s.balance))}` : '₹0'}
                            </option>
                          ))}
                        </optgroup>
                      )}
                      <optgroup label="All Registered Suppliers">
                        {suppliersMaster.filter((m) => m.is_registered).map((s) => (
                          <option key={`reg_${s.id}`} value={`reg_${s.id}`}>
                            {s.shop_name || s.business_name || `Supplier #${s.id}`} {s.phone ? `(${s.phone})` : ''} {s.city ? `• ${s.city}` : ''}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </label>

                  {!supplierPaymentForm.supplier_id && (
                    <Input
                      label="Supplier Name (if not registered)"
                      name="supplier_name"
                      value={supplierPaymentForm.supplier_name}
                      set={setSupplierPaymentForm}
                      required={!supplierPaymentForm.supplier_id}
                      placeholder="e.g. Ultratech Distributor"
                    />
                  )}

                  <Input
                    label="Amount (₹) *"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={supplierPaymentForm.amount}
                    set={setSupplierPaymentForm}
                    required
                  />

                  <Input
                    label="Payment Date *"
                    name="payment_date"
                    type="date"
                    value={supplierPaymentForm.payment_date}
                    set={setSupplierPaymentForm}
                    required
                  />

                  <label>
                    <small style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: '#475569' }}>
                      Payment Mode *
                    </small>
                    <select
                      value={supplierPaymentForm.mode}
                      onChange={(e) => setSupplierPaymentForm({ ...supplierPaymentForm, mode: e.target.value })}
                    >
                      <option value="bank">Bank Transfer / NEFT / RTGS</option>
                      <option value="upi">UPI / GPay / PhonePe</option>
                      <option value="cash">Cash</option>
                      <option value="cheque">Cheque</option>
                    </select>
                  </label>

                  <Input
                    label="Transaction Ref / Cheque No."
                    name="transaction_reference"
                    value={supplierPaymentForm.transaction_reference}
                    set={setSupplierPaymentForm}
                    placeholder="e.g. UTR12345678 or Chq #000123"
                  />

                  <Input
                    label="Note / Purpose"
                    name="note"
                    value={supplierPaymentForm.note}
                    set={setSupplierPaymentForm}
                    placeholder="e.g. 50 bags cement payment"
                  />
                </div>

                {/* Advance / Balance warning */}
                {(() => {
                  const selSup = projectSuppliers.find((s) =>
                    supplierPaymentForm.supplier_id
                      ? Number(s.supplier_id) === Number(supplierPaymentForm.supplier_id)
                      : (s.supplier_name && supplierPaymentForm.supplier_name && s.supplier_name.toLowerCase().trim() === supplierPaymentForm.supplier_name.toLowerCase().trim())
                  );
                  const curBalance = selSup ? selSup.balance : 0;
                  const enteredAmt = Number(supplierPaymentForm.amount || 0);

                  if (enteredAmt > 0 && selSup) {
                    if (enteredAmt > curBalance) {
                      const excess = enteredAmt - Math.max(0, curBalance);
                      return (
                        <div
                          style={{
                            background: '#fef3c7',
                            border: '1px solid #f59e0b',
                            color: '#92400e',
                            padding: '10px 14px',
                            borderRadius: 6,
                            marginTop: 12,
                            fontSize: 13,
                          }}
                        >
                          ⚠️ <b>Notice: Advance Payment</b>
                          <div style={{ marginTop: 2 }}>
                            Payment of <b>{INR(enteredAmt)}</b> exceeds the current balance due ({INR(Math.max(0, curBalance))}).
                            The excess <b>{INR(excess)}</b> will be recorded as an <b>Advance Payment</b> to this supplier.
                          </div>
                        </div>
                      );
                    }
                  }
                  return null;
                })()}

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
                  <button
                    type="button"
                    className="muted"
                    disabled={submitAction.isSubmitting('supplierPayment')}
                    onClick={() => {
                      setSupplierPaymentModal(false);
                      setModalError('');
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={submitAction.isSubmitting('supplierPayment')}>
                    {submitAction.isSubmitting('supplierPayment') ? 'Saving…' : 'Record Payment'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── MODAL: MATERIAL RECEIVED ────────────────────────────────────── */}
          {receivedModal && (
            <div className="modal-overlay">
              <form onSubmit={(e) => submitAction.submit('delivery', () => saveReceivedEntry(e), { successMessage: 'Supplier delivery saved successfully', onError: setModalError })} className="modal-card">
                <h3 style={{ margin: '0 0 14px', fontSize: 17, color: '#0f172a' }}>
                  {editingReceivedId ? 'Edit' : 'Record'} Supplier Material Delivery
                </h3>
                {modalError && <div role="alert" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '8px 12px', borderRadius: 6, marginBottom: 12, fontSize: 13 }}>{modalError}</div>}
                <div className="grid">
                  <Input label="Material Name" name="material_name" value={receivedForm.material_name} set={setReceivedForm} required placeholder="e.g. Cement 53 Grade" />
                  <Input label="Quantity" name="quantity" type="number" step="any" min="0.001" value={receivedForm.quantity} set={setReceivedForm} required />
                  {!isSupervisor && (
                    <Input label="Rate (₹ per unit)" name="rate" type="number" step="any" min="0" value={receivedForm.rate} set={setReceivedForm} required />
                  )}
                  <Input label="Received Date" name="received_date" type="date" value={receivedForm.received_date} set={setReceivedForm} required />
                  <label>
                    <small style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: '#475569' }}>Supplier</small>
                    <select
                      value={receivedForm.supplier_id || ''}
                      onChange={(e) => {
                        const sId = e.target.value;
                        const supplier = suppliersMaster.find((item) => String(item.id) === String(sId));
                        setReceivedForm({
                          ...receivedForm,
                          supplier_id: sId,
                          supplier_name: supplier ? (supplier.shop_name || supplier.business_name || '') : receivedForm.supplier_name,
                        });
                      }}
                    >
                      <option value="">Select registered supplier (or type name below)</option>
                      {suppliersMaster.filter((s) => s.is_registered).map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.shop_name || supplier.business_name || `Supplier #${supplier.id}`} {supplier.phone ? `(${supplier.phone})` : ''} {supplier.city ? `• ${supplier.city}` : ''}
                        </option>
                      ))}
                    </select>
                  </label>
                  <Input label="Supplier Name (if not registered)" name="supplier_name" value={receivedForm.supplier_name} set={setReceivedForm} placeholder="e.g. Ultratech Distributor" />
                  <Input label="Challan / Invoice No." name="challan_no" value={receivedForm.challan_no} set={setReceivedForm} />
                  <Input label="Note" name="note" value={receivedForm.note} set={setReceivedForm} />
                  <label>
                    <small style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: '#475569' }}>Upload Bill (optional)</small>
                    <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={(e) => setBillFile(e.target.files[0] || null)} />
                  </label>
                </div>
                {!isSupervisor && (
                  <div style={{ marginTop: 12, textAlign: 'right', fontWeight: 700 }}>
                    Total Amount: {INR(Number(receivedForm.quantity || 0) * Number(receivedForm.rate || 0))}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
                  <button type="button" className="muted" disabled={submitAction.isSubmitting('delivery')} onClick={() => setReceivedModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submitAction.isSubmitting('delivery')}>{submitAction.isSubmitting('delivery') ? 'Saving…' : 'Save Supplier Delivery'}</button>
                </div>
              </form>
            </div>
          )}

          {/* ── MODAL: MATERIAL USED ────────────────────────────────────────── */}
          {usedModal && (
            <div className="modal-overlay">
              <form onSubmit={(e) => submitAction.submit('usage', () => saveUsedEntry(e), { successMessage: 'Material usage saved successfully', onError: setModalError })} className="modal-card">
                <h3 style={{ margin: '0 0 14px', fontSize: 17, color: '#0f172a' }}>
                  {editingUsedId ? 'Edit' : 'Record'} Material Usage
                </h3>
                <div className="grid">
                  <Input label="Material Name" name="material_name" value={usedForm.material_name} set={setUsedForm} required placeholder="e.g. Cement 53 Grade" />
                  <Input label="Quantity Used" name="quantity" type="number" step="any" min="0.001" value={usedForm.quantity} set={setUsedForm} required />
                  <Input label="Usage Date" name="used_date" type="date" value={usedForm.used_date} set={setUsedForm} required />
                  <Input label="Used For (e.g. Foundation, Slab, Plaster)" name="used_for" value={usedForm.used_for} set={setUsedForm} placeholder="e.g. 1st Floor Slab casting" />
                  <Input label="Note" name="note" value={usedForm.note} set={setUsedForm} />
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
                  <button type="button" className="muted" disabled={submitAction.isSubmitting('usage')} onClick={() => setUsedModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submitAction.isSubmitting('usage')}>{submitAction.isSubmitting('usage') ? 'Saving…' : 'Record Usage'}</button>
                </div>
              </form>
            </div>
          )}

          {/* ── MODAL: ADJUSTMENT / WASTAGE / RETURN / SCRAP ────────────────── */}
          {adjustmentModal && (
            <div className="modal-overlay">
              <form onSubmit={(e) => submitAction.submit('adjustment', () => saveAdjustmentEntry(e), { successMessage: 'Entry saved successfully', onError: setModalError })} className="modal-card">
                <h3 style={{ margin: '0 0 14px', fontSize: 17, color: '#0f172a' }}>
                  {editingAdjId ? 'Edit' : 'Record'} {
                    ['return_material', 'return_to_supplier'].includes(adjustmentForm.adjustment_type)
                      ? 'Return Material'
                      : ['scrap_material', 'scrap'].includes(adjustmentForm.adjustment_type)
                      ? 'Scrap Material'
                      : 'Material Adjustment / Wastage'
                  }
                </h3>
                <div className="grid">
                  <Input label="Material Name" name="material_name" value={adjustmentForm.material_name} set={setAdjustmentForm} required placeholder="e.g. Cement, Steel, Bricks, Copper Wire" />

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
                      <option value="return_material">Return Material (Return to Supplier / Site)</option>
                      <option value="scrap_material">Scrap Material</option>
                      <option value="transfer_out">Transfer to Another Project</option>
                    </select>
                  </label>

                  <Input label="Quantity" name="quantity" type="number" step="any" min="0.001" value={adjustmentForm.quantity} set={setAdjustmentForm} required />
                  <Input label="Date" name="adjustment_date" type="date" value={adjustmentForm.adjustment_date} set={setAdjustmentForm} required />

                  {['return_material', 'return_to_supplier'].includes(adjustmentForm.adjustment_type) && (
                    <>
                      <label>
                        <small style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: '#475569' }}>
                          Returned To / Supplier Name (Optional)
                        </small>
                        <input
                          type="text"
                          list="project-suppliers-list"
                          placeholder="Select or enter supplier name"
                          value={adjustmentForm.supplier_name || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            const matched = (projectSuppliers || []).find((s) => (s.supplier_name || s.name || '').toLowerCase() === val.trim().toLowerCase());
                            setAdjustmentForm({
                              ...adjustmentForm,
                              supplier_name: val,
                              supplier_id: matched ? (matched.supplier_id || matched.id || '') : adjustmentForm.supplier_id
                            });
                          }}
                        />
                        <datalist id="project-suppliers-list">
                          {projectSuppliers.map((s) => (
                            <option key={s.key || s.id || s.supplier_id} value={s.supplier_name || s.name} />
                          ))}
                        </datalist>
                      </label>
                      <Input
                        label="Refund / Credit Amount (₹) (Optional)"
                        name="amount"
                        type="number"
                        step="any"
                        min="0"
                        value={adjustmentForm.amount || ''}
                        set={setAdjustmentForm}
                        placeholder="e.g. 1500"
                      />
                    </>
                  )}

                  {['scrap_material', 'scrap'].includes(adjustmentForm.adjustment_type) && (
                    <>
                      <Input
                        label="Scrap Sold Amount (₹) (Optional)"
                        name="amount"
                        type="number"
                        step="any"
                        min="0"
                        value={adjustmentForm.amount || ''}
                        set={setAdjustmentForm}
                        placeholder="e.g. 500"
                      />
                      <label>
                        <small style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: '#475569' }}>
                          Buyer / Scrap Dealer Name (Optional)
                        </small>
                        <input
                          type="text"
                          placeholder="e.g. Gupta Scrap Center"
                          value={adjustmentForm.supplier_name || ''}
                          onChange={(e) => setAdjustmentForm({ ...adjustmentForm, supplier_name: e.target.value })}
                        />
                      </label>
                    </>
                  )}

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

                  <Input label="Note / Reason" name="note" value={adjustmentForm.note} set={setAdjustmentForm} placeholder="e.g. Rain damage / scrap pieces / returned unused bags" />
                  
                  <label>
                    <small style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: '#475569' }}>
                      Upload Bill / Return Slip / Receipt (optional)
                    </small>
                    <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={(e) => setBillFile(e.target.files[0] || null)} />
                  </label>
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
                  <button type="button" className="muted" disabled={submitAction.isSubmitting('adjustment')} onClick={() => setAdjustmentModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submitAction.isSubmitting('adjustment')}>
                    {submitAction.isSubmitting('adjustment') ? 'Saving…' : 'Save Entry'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── MODAL: OTHER EXPENSE ────────────────────────────────────────── */}
          {expenseModal && (
            <div className="modal-overlay">
              <form onSubmit={(e) => submitAction.submit('expense', () => saveExpenseEntry(e), { successMessage: 'Expense saved successfully', onError: setModalError })} className="modal-card">
                <h3 style={{ margin: '0 0 14px', fontSize: 17, color: '#0f172a' }}>
                  {editingExpenseId ? 'Edit' : 'Record'} Other Expense
                </h3>
                {modalError && <div role="alert" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '8px 12px', borderRadius: 6, marginBottom: 12, fontSize: 13 }}>{modalError}</div>}
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
                      <option value="tools">Tools</option>
                      <option value="rent">Rent</option>
                    </select>
                  </label>
                  <Input label="Amount (₹)" name="amount" type="number" step="any" min="1" value={expenseForm.amount} set={setExpenseForm} required />
                  <Input label="Expense Date" name="expense_date" type="date" value={expenseForm.expense_date} set={setExpenseForm} required />
                  <Input label="Note / Details" name="note" value={expenseForm.note} set={setExpenseForm} placeholder="e.g. Generator diesel 50L" />
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
                  <button type="button" className="muted" disabled={submitAction.isSubmitting('expense')} onClick={() => setExpenseModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submitAction.isSubmitting('expense')}>{submitAction.isSubmitting('expense') ? 'Saving…' : 'Save Expense'}</button>
                </div>
              </form>
            </div>
          )}
            </>
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
                { id: 'labor_summary', label: '5. Labor & Worker Summary' },
                { id: 'party_summary', label: '6. Party-wise Contract & Payment' },
              ].map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  className={reportType === tab.id ? 'active' : ''}
                  onClick={() => setReportType(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Optional Project Filter for consumption and labor report */}
            {(reportType === 'material_consumption' || reportType === 'labor_summary') && (
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

      {/* ── DELETE PROJECT CONFIRMATION MODAL ─────────────────────────────── */}
      {deleteProjectModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
            zIndex: 2500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => {
            if (!deletingProject) {
              setDeleteProjectModal(null);
              setDeleteProjectError('');
            }
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 14,
              padding: '24px',
              width: '100%',
              maxWidth: 480,
              boxShadow: '0 20px 45px rgba(0, 0, 0, 0.2)',
              border: '1px solid #fecaca',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: '#fee2e2',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                !
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, color: '#991b1b', fontWeight: 700 }}>
                  Delete Project
                </h3>
                <small style={{ color: '#64748b', fontSize: 13 }}>
                  Party: <b>{deleteProjectModal.partyName}</b>
                </small>
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 14px', marginBottom: 16 }}>
              <div style={{ fontSize: 14, color: '#334155' }}>
                Are you sure you want to delete project <strong style={{ color: '#0f172a' }}>{deleteProjectModal.name}</strong>?
              </div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 6, lineHeight: 1.4 }}>
                This will permanently remove the project and its agent assignments. If this project was converted from a lead, the lead will be unlocked so it can be converted again.
              </div>
            </div>

            {deleteProjectError && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #f87171',
                  borderRadius: 8,
                  padding: '12px 14px',
                  marginBottom: 16,
                  color: '#991b1b',
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 4 }}>Cannot Delete Project</div>
                {deleteProjectError}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                className="muted"
                disabled={deletingProject}
                onClick={() => {
                  setDeleteProjectModal(null);
                  setDeleteProjectError('');
                }}
                style={{ padding: '8px 16px', borderRadius: 6 }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="danger"
                disabled={deletingProject}
                onClick={confirmDeleteProject}
                style={{
                  padding: '8px 18px',
                  borderRadius: 6,
                  background: deletingProject ? '#94a3b8' : '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 600,
                  cursor: deletingProject ? 'not-allowed' : 'pointer',
                }}
              >
                {deletingProject ? 'Deleting…' : 'Delete Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── COMPONENT STYLES ──────────────────────────────────────────────── */}
      <style jsx>{`
        .pm-container {
          padding: 16px;
          font-family: inherit;
          color: var(--text, #0f172a);
          background: var(--bg, transparent);
          min-height: 100%;
          flex: 1;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }
        :global(.dark-mode) .pm-container,
        .pm-container.dark-mode {
          color: #f0f0f5;
        }
        :global(.dark-mode) .pm-container .card,
        .pm-container.dark-mode .card,
        :global(.dark-mode) .pm-container .modal-card,
        .pm-container.dark-mode .modal-card,
        :global(.dark-mode) .pm-container table,
        .pm-container.dark-mode table {
          background: #18181c;
          border-color: #2a2a30;
          color: #f0f0f5;
        }
        :global(.dark-mode) .pm-container th,
        .pm-container.dark-mode th {
          background: #1e1e24;
          color: #a1a1aa;
          border-bottom-color: #2a2a30;
        }
        :global(.dark-mode) .pm-container td,
        .pm-container.dark-mode td {
          border-bottom-color: #232328;
          color: #f0f0f5;
        }
        :global(.dark-mode) .pm-container tr:hover td,
        .pm-container.dark-mode tr:hover td {
          background: #1e1e24;
        }
        .pm-container tr.clickable-row {
          cursor: pointer;
          transition: background-color 0.15s ease;
        }
        .pm-container tr.clickable-row:hover td {
          background-color: #f1f5f9 !important;
        }
        :global(.dark-mode) .pm-container tr.clickable-row:hover td,
        .pm-container.dark-mode tr.clickable-row:hover td {
          background-color: #27272a !important;
        }
        :global(.dark-mode) .pm-container .stat,
        .pm-container.dark-mode .stat {
          background: #18181c;
          border-color: #2a2a30;
        }
        :global(.dark-mode) .pm-container .stat b,
        .pm-container.dark-mode .stat b {
          color: #f0f0f5;
        }
        :global(.dark-mode) .pm-container .stat small,
        .pm-container.dark-mode .stat small {
          color: #a1a1aa;
        }
        :global(.dark-mode) .pm-container input,
        .pm-container.dark-mode input,
        :global(.dark-mode) .pm-container select,
        .pm-container.dark-mode select,
        :global(.dark-mode) .pm-container textarea,
        .pm-container.dark-mode textarea {
          background: #18181c;
          color: #f0f0f5;
          border-color: #2a2a30;
        }
        :global(.dark-mode) .pm-container button.muted,
        .pm-container.dark-mode button.muted {
          background: #27272a;
          color: #e4e4e7;
          border-color: #3f3f46;
        }
        :global(.dark-mode) .pm-container button.muted:hover,
        .pm-container.dark-mode button.muted:hover {
          background: #3f3f46;
        }
        :global(.dark-mode) .pm-container .subtabs,
        .pm-container.dark-mode .subtabs {
          border-bottom-color: #2a2a30;
        }
        :global(.dark-mode) .pm-container .subtabs button,
        .pm-container.dark-mode .subtabs button {
          background: #27272a;
          color: #e4e4e7;
          border-color: #3f3f46;
        }
        :global(.dark-mode) .pm-container .subtabs button:hover,
        .pm-container.dark-mode .subtabs button:hover {
          background: #3f3f46;
          color: #60a5fa;
          border-color: #52525b;
        }
        :global(.dark-mode) .pm-container .subtabs button.active,
        .pm-container.dark-mode .subtabs button.active {
          background: #2563eb;
          color: #ffffff;
          border-color: #2563eb;
          box-shadow: 0 1px 3px rgba(37, 99, 235, 0.35);
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
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          border-bottom: 2px solid #e2e8f0;
          margin-bottom: 16px;
          padding-bottom: 10px;
        }
        .subtabs button {
          background: #f8fafc;
          color: #475569;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          padding: 8px 14px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0 !important;
          min-width: max-content !important;
          transition: all 0.15s ease;
        }
        .subtabs select {
          background: #f8fafc;
          color: #475569;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 10px 14px;
          min-height: 42px;
          font-weight: 700;
          font-size: 14px;
          transition: all 0.15s ease;
        }
        .subtabs select.active {
          color: #ffffff;
          background: #1e40af;
          border-color: #1e40af;
        }
        .subtabs button:hover {
          color: #1e40af;
          background: #f1f5f9;
          border-color: #93c5fd;
        }
        .subtabs button.active {
          color: #ffffff;
          background: #1e40af;
          border-color: #1e40af;
          font-weight: 700;
          box-shadow: 0 1px 3px rgba(30, 64, 175, 0.25);
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
