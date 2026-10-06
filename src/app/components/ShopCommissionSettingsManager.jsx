'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import './ShopNowManager.css';

const PRESETS = [0, 1, 2, 5, 7.5, 10, 12, 15, 20];

export default function ShopCommissionSettingsManager({ isDarkMode = false }) {
  // Global Default State
  const [commissionPercent, setCommissionPercent] = useState('');
  const [savedPercent, setSavedPercent] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null); // { type: 'success' | 'error', message: '' }

  // Custom Rules State
  const [rules, setRules] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [rulesLoading, setRulesLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState(null);
  const [ruleForm, setRuleForm] = useState({
    scope_type: 'category',
    scope_id: '',
    commission_percent: '',
    is_active: true,
  });
  const [ruleSaving, setRuleSaving] = useState(false);

  // Live Calculator State
  const [exampleAmount, setExampleAmount] = useState(10000);
  const [previewSelector, setPreviewSelector] = useState('default'); // 'default' | 'cat_<id>' | 'prod_<id>'

  // Tracked Commission Records Table State
  const [records, setRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [recordPagination, setRecordPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'pending' | 'paid'
  const [filterVendorId, setFilterVendorId] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [vendorList, setVendorList] = useState([]);
  const [settlingRecordId, setSettlingRecordId] = useState(null);
  const [settleModalRecord, setSettleModalRecord] = useState(null);
  const [settleNote, setSettleNote] = useState('');

  const authHeaders = useMemo(() => {
    const token = typeof window === 'undefined'
      ? ''
      : localStorage.getItem('admin-token') || localStorage.getItem('token') || '';
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }, []);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/shop-settings', {
        headers: authHeaders,
        cache: 'no-store',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to load shop settings');
      }

      const val = data.data?.shop_vendor_commission_percent ?? 10;
      setCommissionPercent(String(val));
      setSavedPercent(Number(val));
      setUpdatedAt(data.data?.updated_at || null);
      if (data.data?.stats) {
        setStats(data.data.stats);
      }
    } catch (err) {
      setNotice({ type: 'error', message: err.message || 'Could not load default commission setting' });
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  const loadRules = useCallback(async () => {
    setRulesLoading(true);
    try {
      const res = await fetch('/api/admin/shop-settings/rules', {
        headers: authHeaders,
        cache: 'no-store',
      });
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        setRules(data.data.rules || []);
        if (data.data.targets) {
          setCategories(data.data.targets.categories || []);
          setProducts(data.data.targets.products || []);
        }
      }
    } catch (err) {
      console.error('Error loading commission rules:', err);
    } finally {
      setRulesLoading(false);
    }
  }, [authHeaders]);

  const loadCommissionRecords = useCallback(async (page = 1) => {
    setRecordsLoading(true);
    try {
      const params = new URLSearchParams({
        records: '1',
        page: String(page),
        limit: String(recordPagination.limit || 15),
      });
      if (filterStatus && filterStatus !== 'all') params.set('status', filterStatus);
      if (filterVendorId) params.set('vendor_id', filterVendorId);
      if (filterStartDate) params.set('start_date', filterStartDate);
      if (filterEndDate) params.set('end_date', filterEndDate);

      const res = await fetch(`/api/admin/shop-commissions?${params.toString()}`, {
        headers: authHeaders,
        cache: 'no-store',
      });
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        setRecords(data.data.records || []);
        setRecordPagination(data.data.pagination || { page: 1, limit: 15, total: 0, totalPages: 1 });
        if (data.data.vendors) {
          setVendorList(data.data.vendors);
        }
      }
    } catch (err) {
      console.error('Error loading commission records:', err);
    } finally {
      setRecordsLoading(false);
    }
  }, [authHeaders, filterStatus, filterVendorId, filterStartDate, filterEndDate, recordPagination.limit]);

  useEffect(() => {
    loadSettings();
    loadRules();
    loadCommissionRecords(1);
  }, [loadSettings, loadRules, loadCommissionRecords]);

  // Mark Commission Row as Paid
  const handleMarkRowAsPaid = async (record, note = '') => {
    if (!record) return;
    setSettlingRecordId(record.id);
    try {
      const res = await fetch('/api/admin/shop-commissions', {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({
          commission_id: record.id,
          paid_note: note || 'Settled offline by admin',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update commission record');
      }

      setNotice({
        type: 'success',
        message: `Marked commission #${record.id} (₹${Number(record.commission_amount).toFixed(2)}) for "${record.vendor_name}" as Paid.`,
      });

      setSettleModalRecord(null);
      setSettleNote('');

      // Refresh both summary cards (Pending/Paid Out) and current table records immediately
      await Promise.all([
        loadSettings(),
        loadCommissionRecords(recordPagination.page),
      ]);
    } catch (err) {
      setNotice({ type: 'error', message: err.message || 'Error marking commission as paid' });
    } finally {
      setSettlingRecordId(null);
    }
  };

  // Save Default Commission
  const handleSaveDefault = async (e) => {
    if (e) e.preventDefault();
    const num = parseFloat(commissionPercent);
    if (!Number.isFinite(num) || num < 0 || num > 100) {
      setNotice({ type: 'error', message: 'Please enter a valid default commission percentage between 0 and 100.' });
      return;
    }

    setSaving(true);
    setNotice(null);
    try {
      const res = await fetch('/api/admin/shop-settings', {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ shop_vendor_commission_percent: num }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save default commission setting');
      }

      const updatedVal = data.data?.shop_vendor_commission_percent ?? num;
      setCommissionPercent(String(updatedVal));
      setSavedPercent(Number(updatedVal));
      setUpdatedAt(new Date().toISOString());
      setNotice({
        type: 'success',
        message: Number(updatedVal) === 0
          ? 'Default commission rate set to 0% (Zero platform fee). Applied whenever no custom rule exists.'
          : `Default commission rate set to ${updatedVal}%. Applied whenever no category or product rule exists.`,
      });
    } catch (err) {
      setNotice({ type: 'error', message: err.message || 'Error saving commission setting' });
    } finally {
      setSaving(false);
    }
  };

  // Save / Update Rule
  const handleSaveRule = async (e) => {
    if (e) e.preventDefault();
    const sid = parseInt(ruleForm.scope_id, 10);
    const rate = parseFloat(ruleForm.commission_percent);

    if (!sid || isNaN(sid)) {
      setNotice({ type: 'error', message: `Please select a valid ${ruleForm.scope_type}.` });
      return;
    }

    if (!Number.isFinite(rate) || rate < 0 || rate > 100) {
      setNotice({ type: 'error', message: 'Commission rate must be a valid percentage between 0 and 100.' });
      return;
    }

    setRuleSaving(true);
    setNotice(null);
    try {
      const res = await fetch('/api/admin/shop-settings/rules', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          scope_type: ruleForm.scope_type,
          scope_id: sid,
          commission_percent: rate,
          is_active: ruleForm.is_active,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save rule');
      }

      setNotice({
        type: 'success',
        message: `Saved ${rate}% commission rule for ${ruleForm.scope_type}.`,
      });
      setShowAddForm(false);
      setEditingRuleId(null);
      setRuleForm({ scope_type: 'category', scope_id: '', commission_percent: '', is_active: true });
      loadRules();
    } catch (err) {
      setNotice({ type: 'error', message: err.message || 'Error saving rule' });
    } finally {
      setRuleSaving(false);
    }
  };

  // Toggle Rule Active State
  const handleToggleRule = async (rule) => {
    try {
      const res = await fetch('/api/admin/shop-settings/rules', {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ id: rule.id, is_active: !rule.is_active }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRules((prev) =>
          prev.map((r) => (r.id === rule.id ? { ...r, is_active: !r.is_active } : r))
        );
        setNotice({
          type: 'success',
          message: `Rule for "${rule.target_name}" is now ${!rule.is_active ? 'Active' : 'Inactive'}.`,
        });
      } else {
        alert(data.error || 'Failed to update rule');
      }
    } catch (err) {
      console.error('Error toggling rule:', err);
    }
  };

  // Delete Rule
  const handleDeleteRule = async (rule) => {
    if (!window.confirm(`Are you sure you want to remove the custom commission rule for "${rule.target_name}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/shop-settings/rules?id=${rule.id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRules((prev) => prev.filter((r) => r.id !== rule.id));
        setNotice({ type: 'success', message: `Deleted custom rule for "${rule.target_name}".` });
      } else {
        alert(data.error || 'Failed to delete rule');
      }
    } catch (err) {
      console.error('Error deleting rule:', err);
    }
  };

  // Start Editing Rule
  const handleEditRule = (rule) => {
    setEditingRuleId(rule.id);
    setRuleForm({
      scope_type: rule.scope_type,
      scope_id: String(rule.scope_id),
      commission_percent: String(rule.commission_percent),
      is_active: rule.is_active,
    });
    setShowAddForm(true);
    requestAnimationFrame(() => {
      document.getElementById('rule-editor-card')?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  // Resolve Live Calculation Breakdown based on previewSelector
  const resolvedPreview = useMemo(() => {
    const defaultRate = Number.isFinite(parseFloat(commissionPercent)) ? parseFloat(commissionPercent) : (savedPercent ?? 0);
    const sampleOrder = Math.max(0, parseFloat(exampleAmount) || 0);

    if (previewSelector === 'default') {
      const comm = Math.round((sampleOrder * (defaultRate / 100)) * 100) / 100;
      return {
        rate: defaultRate,
        rateSource: 'default',
        label: 'Default Rate',
        reason: 'Using Global Default Rate (no specific category or product selected)',
        fee: comm,
        vendorNet: Math.max(0, sampleOrder - comm),
      };
    }

    if (previewSelector.startsWith('cat_')) {
      const cid = parseInt(previewSelector.replace('cat_', ''), 10);
      const cat = categories.find((c) => c.id === cid);
      const rule = rules.find((r) => r.scope_type === 'category' && r.scope_id === cid && r.is_active);
      const effectiveRate = rule ? Number(rule.commission_percent) : defaultRate;
      const comm = Math.round((sampleOrder * (effectiveRate / 100)) * 100) / 100;

      return {
        rate: effectiveRate,
        rateSource: rule ? 'category' : 'default',
        label: cat ? `Category: ${cat.name}` : 'Category',
        reason: rule
          ? `Active category rule applied (${rule.commission_percent}%)`
          : `No active category rule for "${cat?.name || 'Category'}"; falls back to Default Rate (${defaultRate}%)`,
        fee: comm,
        vendorNet: Math.max(0, sampleOrder - comm),
      };
    }

    if (previewSelector.startsWith('prod_')) {
      const pid = parseInt(previewSelector.replace('prod_', ''), 10);
      const prod = products.find((p) => p.id === pid);
      // 1. Check Product rule
      const prodRule = rules.find((r) => r.scope_type === 'product' && r.scope_id === pid && r.is_active);
      if (prodRule) {
        const comm = Math.round((sampleOrder * (Number(prodRule.commission_percent) / 100)) * 100) / 100;
        return {
          rate: Number(prodRule.commission_percent),
          rateSource: 'product',
          label: prod ? `Product: ${prod.name}` : 'Product',
          reason: `Active product rule applied (${prodRule.commission_percent}%)`,
          fee: comm,
          vendorNet: Math.max(0, sampleOrder - comm),
        };
      }

      // 2. Check Category rule for this product
      const cat = categories.find((c) => c.name.toLowerCase() === (prod?.category || '').toLowerCase());
      const catRule = cat ? rules.find((r) => r.scope_type === 'category' && r.scope_id === cat.id && r.is_active) : null;
      if (catRule) {
        const comm = Math.round((sampleOrder * (Number(catRule.commission_percent) / 100)) * 100) / 100;
        return {
          rate: Number(catRule.commission_percent),
          rateSource: 'category',
          label: prod ? `Product: ${prod.name}` : 'Product',
          reason: `No product rule; inherited from Category "${cat.name}" rule (${catRule.commission_percent}%)`,
          fee: comm,
          vendorNet: Math.max(0, sampleOrder - comm),
        };
      }

      // 3. Default rate
      const comm = Math.round((sampleOrder * (defaultRate / 100)) * 100) / 100;
      return {
        rate: defaultRate,
        rateSource: 'default',
        label: prod ? `Product: ${prod.name}` : 'Product',
        reason: `No product or category rule; falls back to Default Rate (${defaultRate}%)`,
        fee: comm,
        vendorNet: Math.max(0, sampleOrder - comm),
      };
    }

    return {
      rate: defaultRate,
      rateSource: 'default',
      label: 'Default Rate',
      reason: 'Global Default Rate',
      fee: 0,
      vendorNet: 0,
    };
  }, [commissionPercent, exampleAmount, previewSelector, categories, products, rules, savedPercent]);

  const parsedCurrent = useMemo(() => {
    const val = parseFloat(commissionPercent);
    return Number.isFinite(val) ? val : (savedPercent ?? 10);
  }, [commissionPercent, savedPercent]);

  const isDirty = savedPercent !== null && parseFloat(commissionPercent) !== savedPercent;

  if (loading) {
    return (
      <section className="shop-admin-root shop-admin-panel" style={{ padding: '1.5rem 0' }}>
        <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Loading Shop Vendor Commission settings...</p>
      </section>
    );
  }

  return (
    <section className={`shop-admin-root shop-admin-panel ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Page Heading */}
      <div className="shop-admin-heading">
        <div>
          <h2>Shop Vendor Commission</h2>
          <p>
            Configure platform fee rates applied to vendor shop orders.
            Supports <strong>Category-wise</strong> and <strong>Product-wise</strong> custom rates with hierarchical fallback to the default rate.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            loadSettings();
            loadRules();
          }}
          style={{
            padding: '8px 14px',
            fontSize: '12px',
            fontWeight: 700,
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Notice Banner */}
      {notice && (
        <div
          className="shop-admin-notice"
          role="status"
          style={{
            background: notice.type === 'error' ? '#fee2e2' : 'var(--brand-blue-soft, #eff6ff)',
            color: notice.type === 'error' ? '#b91c1c' : 'var(--brand-blue-deep, #1e40af)',
            borderColor: notice.type === 'error' ? '#fca5a5' : 'color-mix(in srgb, var(--brand-blue, #2563eb) 40%, white)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <span>{notice.message}</span>
          <button
            type="button"
            onClick={() => setNotice(null)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'inherit',
              fontWeight: 800,
              fontSize: '14px',
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Card 1: Default Commission Rate (Global Fallback) */}
      <form className="shop-admin-card" onSubmit={handleSaveDefault}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ margin: 0 }}>Default Commission Rate</h3>
            <p style={{ margin: '4px 0 16px 0', fontSize: '13px', color: 'var(--shop-admin-muted)' }}>
              Standard baseline fee charged when no specific category or product rule matches a vendor item.
            </p>
          </div>
          <span
            style={{
              background: 'var(--shop-admin-subtle, #f3f4f6)',
              border: '1px solid var(--shop-admin-border, #d1d5db)',
              padding: '3px 10px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--shop-admin-muted)',
            }}
          >
            Fallback Level 3
          </span>
        </div>

        <div className="shop-admin-fields" style={{ gridTemplateColumns: 'minmax(240px, 320px) 1fr', alignItems: 'start' }}>
          <div>
            <label>
              Default Rate (%) *
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  required
                  value={commissionPercent}
                  onChange={(e) => setCommissionPercent(e.target.value)}
                  placeholder="e.g. 10"
                  style={{
                    paddingRight: '36px',
                    fontSize: '1.125rem',
                    fontWeight: 700,
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    right: '12px',
                    fontWeight: 800,
                    color: 'var(--shop-admin-muted)',
                    pointerEvents: 'none',
                  }}
                >
                  %
                </span>
              </div>
              <small>0% to 100% (e.g. 0% for zero platform fee, or 10.00)</small>
            </label>

            {/* Quick Presets */}
            <div style={{ marginTop: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--shop-admin-muted)', display: 'block', marginBottom: '6px' }}>
                Quick Presets:
              </span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setCommissionPercent(String(p))}
                    style={{
                      padding: '4px 10px',
                      fontSize: '12px',
                      fontWeight: 700,
                      borderRadius: '6px',
                      border: '1px solid var(--shop-admin-border)',
                      background: parseFloat(commissionPercent) === p ? 'var(--brand-blue)' : 'var(--shop-admin-bg)',
                      color: parseFloat(commissionPercent) === p ? '#fff' : 'var(--shop-admin-text)',
                      cursor: 'pointer',
                    }}
                  >
                    {p}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Policy Information Box */}
          <div
            style={{
              padding: '16px',
              borderRadius: '8px',
              background: 'var(--bg, #f8fafc)',
              border: '1px solid var(--shop-admin-border)',
              fontSize: '12px',
              lineHeight: 1.6,
            }}
          >
            <div style={{ fontWeight: 800, color: 'var(--shop-admin-text)', marginBottom: '8px' }}>
              🎯 Rate Resolution Hierarchy
            </div>
            <ol style={{ margin: 0, paddingLeft: '18px', color: 'var(--shop-admin-muted)' }}>
              <li>
                <strong>1. Product Rule (Highest):</strong> If an active rule exists for the product, its rate is applied.
              </li>
              <li>
                <strong>2. Category Rule:</strong> If no product rule exists, the product&apos;s category rule is applied.
              </li>
              <li>
                <strong>3. Default Rate (Baseline):</strong> If neither rule matches, this Default Commission Rate is applied.
              </li>
            </ol>
            {updatedAt && (
              <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--shop-admin-muted)' }}>
                Default rate last updated: {new Date(updatedAt).toLocaleString('en-IN')}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="shop-admin-form-footer" style={{ marginTop: '20px' }}>
          <button
            type="submit"
            disabled={saving || commissionPercent === '' || isNaN(parseFloat(commissionPercent)) || (!isDirty && savedPercent !== null)}
            style={{
              opacity: saving || (!isDirty && savedPercent !== null) ? 0.7 : 1,
              cursor: saving || (!isDirty && savedPercent !== null) ? 'default' : 'pointer',
            }}
          >
            {saving ? 'Saving...' : isDirty ? 'Save Default Rate' : 'Saved'}
          </button>
          {isDirty && (
            <button
              type="button"
              onClick={() => {
                setCommissionPercent(String(savedPercent));
                setNotice(null);
              }}
            >
              Reset
            </button>
          )}
        </div>
      </form>

      {/* Card 2: Category & Product Rates */}
      <div className="shop-admin-card" id="rules-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          <div>
            <h3 style={{ margin: 0 }}>Category &amp; Product Rates</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--shop-admin-muted)' }}>
              Override default commission for specific categories (e.g. Cement 5%, Sariya 1%) or individual products.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingRuleId(null);
              setRuleForm({ scope_type: 'category', scope_id: categories[0]?.id ? String(categories[0].id) : '', commission_percent: '', is_active: true });
              setShowAddForm(!showAddForm);
            }}
            style={{
              background: showAddForm ? 'transparent' : 'var(--brand-blue)',
              color: showAddForm ? 'var(--shop-admin-text)' : '#fff',
              border: '1px solid var(--brand-blue)',
              borderRadius: '6px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {showAddForm ? 'Cancel' : '+ Add Custom Rate'}
          </button>
        </div>

        {/* Add / Edit Rule Form */}
        {showAddForm && (
          <form
            id="rule-editor-card"
            onSubmit={handleSaveRule}
            style={{
              background: 'var(--bg, #f8fafc)',
              border: '1px solid var(--shop-admin-border)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px',
            }}
          >
            <div style={{ fontWeight: 800, fontSize: '13px', marginBottom: '12px', color: 'var(--shop-admin-text)' }}>
              {editingRuleId ? '✏️ Edit Custom Commission Rule' : '➕ Create Custom Commission Rule'}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', alignItems: 'end' }}>
              {/* Scope Type */}
              <label>
                Scope Type *
                <select
                  value={ruleForm.scope_type}
                  disabled={Boolean(editingRuleId)}
                  onChange={(e) => {
                    const st = e.target.value;
                    const defaultId = st === 'category'
                      ? (categories[0]?.id ? String(categories[0].id) : '')
                      : (products[0]?.id ? String(products[0].id) : '');
                    setRuleForm({ ...ruleForm, scope_type: st, scope_id: defaultId });
                  }}
                  style={{ width: '100%' }}
                >
                  <option value="category">Category (Applies to all products in category)</option>
                  <option value="product">Specific Product (Overrides category)</option>
                </select>
              </label>

              {/* Target Selector */}
              <label>
                {ruleForm.scope_type === 'category' ? 'Select Category *' : 'Select Vendor Product *'}
                <select
                  required
                  value={ruleForm.scope_id}
                  disabled={Boolean(editingRuleId)}
                  onChange={(e) => setRuleForm({ ...ruleForm, scope_id: e.target.value })}
                  style={{ width: '100%' }}
                >
                  <option value="">-- Choose {ruleForm.scope_type} --</option>
                  {ruleForm.scope_type === 'category'
                    ? categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))
                    : products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.category}) · {p.vendor_name || 'Vendor'} · ₹{p.price}
                        </option>
                      ))}
                </select>
              </label>

              {/* Commission Rate */}
              <label>
                Commission Rate (%) *
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    required
                    value={ruleForm.commission_percent}
                    onChange={(e) => setRuleForm({ ...ruleForm, commission_percent: e.target.value })}
                    placeholder="e.g. 5.00"
                    style={{ width: '100%', paddingRight: '28px', fontWeight: 700 }}
                  />
                  <span style={{ position: 'absolute', right: '10px', fontWeight: 800, color: 'var(--shop-admin-muted)', pointerEvents: 'none' }}>
                    %
                  </span>
                </div>
              </label>

              {/* Active Checkbox & Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', margin: 0 }}>
                  <input
                    type="checkbox"
                    checked={ruleForm.is_active}
                    onChange={(e) => setRuleForm({ ...ruleForm, is_active: e.target.checked })}
                  />
                  <span style={{ fontSize: '12px', fontWeight: 700 }}>Active Rule</span>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingRuleId(null);
                }}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--shop-admin-border)',
                  borderRadius: '6px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={ruleSaving}
                style={{
                  background: 'var(--brand-blue)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 16px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: ruleSaving ? 'not-allowed' : 'pointer',
                  opacity: ruleSaving ? 0.7 : 1,
                }}
              >
                {ruleSaving ? 'Saving...' : editingRuleId ? 'Update Rule' : 'Save Rule'}
              </button>
            </div>
          </form>
        )}

        {/* Rules Table */}
        {rulesLoading ? (
          <p style={{ color: 'var(--shop-admin-muted)', fontSize: '13px' }}>Loading commission rules...</p>
        ) : rules.length === 0 ? (
          <div
            style={{
              padding: '24px',
              textAlign: 'center',
              background: 'var(--bg, #f8fafc)',
              borderRadius: '8px',
              border: '1px solid var(--shop-admin-border)',
              color: 'var(--shop-admin-muted)',
              fontSize: '13px',
            }}
          >
            No custom category or product commission rules configured yet.
            <br />
            All vendor products currently use the <strong>Default Commission Rate ({parsedCurrent}%)</strong>.
          </div>
        ) : (
          <div className="shop-admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '90px' }}>Scope</th>
                  <th>Target Name</th>
                  <th style={{ textAlign: 'center', width: '120px' }}>Priority</th>
                  <th style={{ textAlign: 'right', width: '130px' }}>Commission Rate</th>
                  <th style={{ textAlign: 'center', width: '110px' }}>Status</th>
                  <th style={{ textAlign: 'right', width: '140px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule) => {
                  const isCat = rule.scope_type === 'category';
                  return (
                    <tr key={rule.id}>
                      <td>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: '999px',
                            fontSize: '10px',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            background: isCat ? '#e0f2fe' : '#f3e8ff',
                            color: isCat ? '#0369a1' : '#7e22ce',
                          }}
                        >
                          {rule.scope_type}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{rule.target_name}</div>
                        {rule.scope_type === 'product' && rule.product_category && (
                          <div style={{ fontSize: '11px', color: 'var(--shop-admin-muted)' }}>
                            Category: {rule.product_category} · {rule.vendor_name || 'Vendor'}
                          </div>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '11px', color: isCat ? 'var(--shop-admin-muted)' : '#7e22ce', fontWeight: 600 }}>
                          {isCat ? 'Category (2)' : 'Product (1 - Highest)'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--brand-blue, #2563eb)', fontSize: '14px' }}>
                        {Number(rule.commission_percent).toFixed(2)}%
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleRule(rule)}
                          style={{
                            background: rule.is_active ? '#dcfce7' : '#fee2e2',
                            color: rule.is_active ? '#15803d' : '#b91c1c',
                            border: 'none',
                            padding: '3px 10px',
                            borderRadius: '999px',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          {rule.is_active ? '● Active' : '○ Inactive'}
                        </button>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="shop-admin-actions" style={{ justifyContent: 'flex-end', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => handleEditRule(rule)}
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRule(rule)}
                            style={{ padding: '4px 8px', fontSize: '11px', color: '#b91c1c' }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Card 3: Live Calculation Breakdown with Category/Product Selector */}
      <div className="shop-admin-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ margin: 0 }}>Live Calculation Breakdown</h3>
            <p style={{ margin: '4px 0 16px 0', fontSize: '13px', color: 'var(--shop-admin-muted)' }}>
              Test how rates resolve for different categories and products against any sample order value.
            </p>
          </div>
        </div>

        {/* Target Selector Dropdown */}
        <div style={{ maxWidth: '440px', marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--shop-admin-muted)', display: 'block', marginBottom: '6px' }}>
            Select Category or Product to Preview:
          </label>
          <select
            value={previewSelector}
            onChange={(e) => setPreviewSelector(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: '6px',
              border: '1px solid var(--shop-admin-border)',
              background: 'var(--shop-admin-bg)',
              color: 'var(--shop-admin-text)',
            }}
          >
            <option value="default">🌐 Default (No Specific Category or Product)</option>
            <optgroup label="Categories">
              {categories.map((c) => {
                const rule = rules.find((r) => r.scope_type === 'category' && r.scope_id === c.id && r.is_active);
                return (
                  <option key={`cat_${c.id}`} value={`cat_${c.id}`}>
                    📁 {c.name} {rule ? `(Custom rule: ${rule.commission_percent}%)` : `(Uses default: ${parsedCurrent}%)`}
                  </option>
                );
              })}
            </optgroup>
            <optgroup label="Vendor Products">
              {products.map((p) => {
                const rule = rules.find((r) => r.scope_type === 'product' && r.scope_id === p.id && r.is_active);
                const cat = categories.find((c) => c.name.toLowerCase() === (p.category || '').toLowerCase());
                const catRule = !rule && cat
                  ? rules.find((r) => r.scope_type === 'category' && r.scope_id === cat.id && r.is_active)
                  : null;
                const note = rule
                  ? `(Custom rule: ${rule.commission_percent}%)`
                  : catRule
                  ? `(Category rule: ${catRule.commission_percent}%)`
                  : `(Uses default: ${parsedCurrent}%)`;
                return (
                  <option key={`prod_${p.id}`} value={`prod_${p.id}`}>
                    📦 {p.name} ({p.category}) {note}
                  </option>
                );
              })}
            </optgroup>
          </select>
          <div style={{ fontSize: '11px', color: 'var(--shop-admin-muted)', marginTop: '4px' }}>
            {resolvedPreview.reason}
          </div>
        </div>

        {/* Live Calculation Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginTop: '16px' }}>
          {/* Order Value Input */}
          <div style={{ padding: '14px', background: 'var(--bg, #f8fafc)', border: '1px solid var(--shop-admin-border)', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--shop-admin-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Sample Order Value
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontWeight: 800, marginRight: '4px' }}>₹</span>
              <input
                type="number"
                min="0"
                step="100"
                value={exampleAmount}
                onChange={(e) => setExampleAmount(e.target.value)}
                style={{
                  width: '100%',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--shop-admin-border)',
                  background: 'var(--shop-admin-bg)',
                  color: 'var(--shop-admin-text)',
                }}
              />
            </div>
            <small style={{ color: 'var(--shop-admin-muted)', display: 'block', marginTop: '4px' }}>Customer pays this full amount</small>
          </div>

          {/* Applied Commission % */}
          <div style={{ padding: '14px', background: 'var(--bg, #f8fafc)', border: '1px solid var(--shop-admin-border)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--shop-admin-muted)', textTransform: 'uppercase' }}>
                Effective Rate
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: '999px',
                  background:
                    resolvedPreview.rateSource === 'product'
                      ? '#f3e8ff'
                      : resolvedPreview.rateSource === 'category'
                      ? '#e0f2fe'
                      : '#f3f4f6',
                  color:
                    resolvedPreview.rateSource === 'product'
                      ? '#7e22ce'
                      : resolvedPreview.rateSource === 'category'
                      ? '#0369a1'
                      : '#4b5563',
                  textTransform: 'uppercase',
                }}
              >
                {resolvedPreview.rateSource} rule
              </span>
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--brand-blue, #2563eb)' }}>
              {resolvedPreview.rate.toFixed(2)}%
            </div>
            <small style={{ color: 'var(--shop-admin-muted)', display: 'block', marginTop: '4px' }}>
              {resolvedPreview.label}
            </small>
          </div>

          {/* Platform Fee Amount */}
          <div style={{ padding: '14px', background: 'var(--bg, #f8fafc)', border: '1px solid var(--shop-admin-border)', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--shop-admin-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Platform Fee (MT-Boss)
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#16a34a' }}>
              ₹{resolvedPreview.fee.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <small style={{ color: 'var(--shop-admin-muted)', display: 'block', marginTop: '4px' }}>Recorded in shop_vendor_commissions</small>
          </div>

          {/* Net Vendor Payout */}
          <div style={{ padding: '14px', background: 'var(--bg, #f8fafc)', border: '1px solid var(--shop-admin-border)', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--shop-admin-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Vendor Net Earnings
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--shop-admin-text)' }}>
              ₹{resolvedPreview.vendorNet.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <small style={{ color: 'var(--shop-admin-muted)', display: 'block', marginTop: '4px' }}>Order Amount − Platform Fee</small>
          </div>
        </div>
      </div>

      {/* Card 4: Tracked Commissions Summary */}
      {stats && (
        <div className="shop-admin-card">
          <h3>Tracked Commissions Activity</h3>
          <p>Overview of all vendor order records tracked in <code>shop_vendor_commissions</code>:</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginTop: '16px' }}>
            <div style={{ padding: '14px', background: 'var(--bg, #f8fafc)', border: '1px solid var(--shop-admin-border)', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--shop-admin-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Tracked Orders
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--shop-admin-text)' }}>
                {stats.total_count}
              </div>
            </div>

            <div style={{ padding: '14px', background: 'var(--bg, #f8fafc)', border: '1px solid var(--shop-admin-border)', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--shop-admin-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Total Commission Tracked
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--brand-blue, #2563eb)' }}>
                ₹{Number(stats.total_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div style={{ padding: '14px', background: 'var(--bg, #f8fafc)', border: '1px solid var(--shop-admin-border)', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--shop-admin-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Pending Payouts
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#f59e0b' }}>
                ₹{Number(stats.pending_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div style={{ padding: '14px', background: 'var(--bg, #f8fafc)', border: '1px solid var(--shop-admin-border)', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--shop-admin-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Paid Out
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#16a34a' }}>
                ₹{Number(stats.paid_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Card 5: All Commission Records Table */}
      <div className="shop-admin-card" id="commission-records-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🧾</span> Tracked Commission Records
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--shop-admin-muted)' }}>
              Complete audit log of all vendor shop orders tracked in <code>shop_vendor_commissions</code> with status and settlement controls.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--shop-admin-muted)' }}>
              Total: {recordPagination.total} {recordPagination.total === 1 ? 'record' : 'records'}
            </span>
            <button
              type="button"
              onClick={() => {
                loadCommissionRecords(recordPagination.page);
                loadSettings();
              }}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 600,
                borderRadius: '6px',
                border: '1px solid var(--shop-admin-border)',
                background: 'var(--shop-admin-bg)',
                color: 'var(--shop-admin-text)',
                cursor: 'pointer',
              }}
            >
              ↻ Refresh Table
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px',
            background: 'var(--bg, #f8fafc)',
            border: '1px solid var(--shop-admin-border)',
            borderRadius: '8px',
            padding: '14px',
            marginBottom: '16px',
            alignItems: 'end',
          }}
        >
          {/* Status Filter */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--shop-admin-muted)', display: 'block', marginBottom: '5px' }}>
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px',
                fontSize: '12px',
                fontWeight: 600,
                borderRadius: '6px',
                border: '1px solid var(--shop-admin-border)',
                background: 'var(--shop-admin-bg)',
                color: 'var(--shop-admin-text)',
              }}
            >
              <option value="all">All Statuses</option>
              <option value="pending">⏳ Pending Only</option>
              <option value="paid">✓ Paid Only</option>
            </select>
          </div>

          {/* Vendor Filter */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--shop-admin-muted)', display: 'block', marginBottom: '5px' }}>
              Vendor
            </label>
            <select
              value={filterVendorId}
              onChange={(e) => setFilterVendorId(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px',
                fontSize: '12px',
                fontWeight: 600,
                borderRadius: '6px',
                border: '1px solid var(--shop-admin-border)',
                background: 'var(--shop-admin-bg)',
                color: 'var(--shop-admin-text)',
              }}
            >
              <option value="">All Vendors</option>
              {vendorList.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} (#{v.id})
                </option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--shop-admin-muted)', display: 'block', marginBottom: '5px' }}>
              Date From
            </label>
            <input
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px',
                fontSize: '12px',
                borderRadius: '6px',
                border: '1px solid var(--shop-admin-border)',
                background: 'var(--shop-admin-bg)',
                color: 'var(--shop-admin-text)',
              }}
            />
          </div>

          {/* Date To */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--shop-admin-muted)', display: 'block', marginBottom: '5px' }}>
              Date To
            </label>
            <input
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px',
                fontSize: '12px',
                borderRadius: '6px',
                border: '1px solid var(--shop-admin-border)',
                background: 'var(--shop-admin-bg)',
                color: 'var(--shop-admin-text)',
              }}
            />
          </div>

          {/* Reset Filters */}
          {(filterStatus !== 'all' || filterVendorId || filterStartDate || filterEndDate) && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setFilterStatus('all');
                  setFilterVendorId('');
                  setFilterStartDate('');
                  setFilterEndDate('');
                }}
                style={{
                  padding: '7px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: '1px solid var(--shop-admin-border)',
                  background: 'transparent',
                  color: '#b91c1c',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                ✕ Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Table Content */}
        {recordsLoading ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--shop-admin-muted)', fontSize: '13px' }}>
            Loading commission records...
          </div>
        ) : records.length === 0 ? (
          <div
            style={{
              padding: '30px',
              textAlign: 'center',
              background: 'var(--bg, #f8fafc)',
              borderRadius: '8px',
              border: '1px solid var(--shop-admin-border)',
              color: 'var(--shop-admin-muted)',
              fontSize: '13px',
            }}
          >
            No commission records found matching the selected filters.
          </div>
        ) : (
          <>
            <div className="shop-admin-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: '135px' }}>Date</th>
                    <th style={{ width: '120px' }}>Order ID</th>
                    <th>Vendor</th>
                    <th>Product</th>
                    <th style={{ textAlign: 'right', width: '110px' }}>Order Amount</th>
                    <th style={{ textAlign: 'center', width: '110px' }}>Rate Applied</th>
                    <th style={{ textAlign: 'right', width: '125px' }}>Commission</th>
                    <th style={{ textAlign: 'center', width: '95px' }}>Status</th>
                    <th style={{ width: '135px' }}>Paid At</th>
                    <th style={{ textAlign: 'right', width: '120px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => {
                    const isPending = r.status === 'pending';
                    return (
                      <tr key={r.id}>
                        {/* Date */}
                        <td style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                          <div style={{ fontWeight: 600 }}>
                            {new Date(r.created_at).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </div>
                          <div style={{ fontSize: '10px', color: 'var(--shop-admin-muted)' }}>
                            {new Date(r.created_at).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </td>

                        {/* Order ID */}
                        <td>
                          <div style={{ fontWeight: 700, fontSize: '12px' }}>
                            {r.order_reference || `#${r.order_id}`}
                          </div>
                          <div style={{ fontSize: '10px', color: 'var(--shop-admin-muted)' }}>
                            Order #{r.order_id}
                          </div>
                        </td>

                        {/* Vendor */}
                        <td>
                          <div style={{ fontWeight: 700 }}>{r.vendor_name}</div>
                          <div style={{ fontSize: '10px', color: 'var(--shop-admin-muted)' }}>
                            Vendor #{r.vendor_id} {r.vendor_phone ? `· ${r.vendor_phone}` : ''}
                          </div>
                        </td>

                        {/* Product */}
                        <td>
                          <div style={{ fontWeight: 600 }}>{r.product_name}</div>
                          {r.product_category && (
                            <span
                              style={{
                                display: 'inline-block',
                                fontSize: '10px',
                                fontWeight: 700,
                                padding: '1px 6px',
                                borderRadius: '4px',
                                background: 'var(--shop-admin-subtle, #f3f4f6)',
                                color: 'var(--shop-admin-muted)',
                                marginTop: '2px',
                              }}
                            >
                              {r.product_category}
                            </span>
                          )}
                        </td>

                        {/* Order Amount */}
                        <td style={{ textAlign: 'right', fontWeight: 700, fontSize: '12px' }}>
                          ₹{Number(r.order_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>

                        {/* Rate Applied */}
                        <td style={{ textAlign: 'center' }}>
                          <span style={{ fontWeight: 800, fontSize: '12px', color: 'var(--brand-blue, #2563eb)' }}>
                            {Number(r.commission_percent_applied).toFixed(2)}%
                          </span>
                          <div
                            style={{
                              fontSize: '9px',
                              textTransform: 'uppercase',
                              fontWeight: 700,
                              color: 'var(--shop-admin-muted)',
                              marginTop: '2px',
                            }}
                          >
                            {r.rate_source}
                          </div>
                        </td>

                        {/* Commission Amount */}
                        <td style={{ textAlign: 'right', fontWeight: 900, fontSize: '13px', color: '#16a34a' }}>
                          ₹{Number(r.commission_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>

                        {/* Status */}
                        <td style={{ textAlign: 'center' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              borderRadius: '999px',
                              fontSize: '11px',
                              fontWeight: 700,
                              background: isPending ? '#fef3c7' : '#dcfce7',
                              color: isPending ? '#b45309' : '#15803d',
                            }}
                          >
                            {isPending ? '⏳ Pending' : '✓ Paid'}
                          </span>
                        </td>

                        {/* Paid At */}
                        <td style={{ fontSize: '11px' }}>
                          {r.paid_at ? (
                            <div>
                              <div style={{ fontWeight: 600 }}>
                                {new Date(r.paid_at).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </div>
                              <div style={{ fontSize: '10px', color: 'var(--shop-admin-muted)' }}>
                                {new Date(r.paid_at).toLocaleTimeString('en-IN', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                              {r.paid_note && (
                                <div style={{ fontSize: '10px', color: 'var(--shop-admin-muted)', marginTop: '2px', fontStyle: 'italic' }}>
                                  Note: {r.paid_note}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span style={{ color: 'var(--shop-admin-muted)' }}>—</span>
                          )}
                        </td>

                        {/* Action */}
                        <td style={{ textAlign: 'right' }}>
                          {isPending ? (
                            <button
                              type="button"
                              onClick={() => {
                                setSettleModalRecord(r);
                                setSettleNote(`Settled offline via admin on ${new Date().toLocaleDateString('en-IN')}`);
                              }}
                              disabled={settlingRecordId === r.id}
                              style={{
                                padding: '4px 9px',
                                fontSize: '11px',
                                fontWeight: 700,
                                borderRadius: '6px',
                                border: '1px solid #16a34a',
                                background: '#16a34a',
                                color: '#fff',
                                cursor: settlingRecordId === r.id ? 'not-allowed' : 'pointer',
                                opacity: settlingRecordId === r.id ? 0.6 : 1,
                              }}
                            >
                              {settlingRecordId === r.id ? 'Saving...' : 'Mark as Paid'}
                            </button>
                          ) : (
                            <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700 }}>
                              ✓ Settled
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {recordPagination.totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginTop: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--shop-admin-border)',
                }}
              >
                <div style={{ fontSize: '12px', color: 'var(--shop-admin-muted)' }}>
                  Page {recordPagination.page} of {recordPagination.totalPages} ({recordPagination.total} total records)
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    type="button"
                    disabled={recordPagination.page <= 1 || recordsLoading}
                    onClick={() => loadCommissionRecords(recordPagination.page - 1)}
                    style={{
                      padding: '5px 10px',
                      fontSize: '12px',
                      fontWeight: 600,
                      borderRadius: '6px',
                      border: '1px solid var(--shop-admin-border)',
                      background: 'var(--shop-admin-bg)',
                      color: 'var(--shop-admin-text)',
                      cursor: recordPagination.page <= 1 ? 'not-allowed' : 'pointer',
                      opacity: recordPagination.page <= 1 ? 0.5 : 1,
                    }}
                  >
                    ← Previous
                  </button>

                  {Array.from({ length: Math.min(5, recordPagination.totalPages) }, (_, i) => {
                    let pageNum = i + 1;
                    if (recordPagination.totalPages > 5 && recordPagination.page > 3) {
                      pageNum = recordPagination.page - 2 + i;
                      if (pageNum > recordPagination.totalPages) {
                        pageNum = recordPagination.totalPages - 4 + i;
                      }
                    }
                    if (pageNum <= 0) pageNum = 1;

                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => loadCommissionRecords(pageNum)}
                        style={{
                          padding: '5px 10px',
                          fontSize: '12px',
                          fontWeight: 700,
                          borderRadius: '6px',
                          border: '1px solid var(--shop-admin-border)',
                          background: recordPagination.page === pageNum ? 'var(--brand-blue)' : 'var(--shop-admin-bg)',
                          color: recordPagination.page === pageNum ? '#fff' : 'var(--shop-admin-text)',
                          cursor: 'pointer',
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    disabled={recordPagination.page >= recordPagination.totalPages || recordsLoading}
                    onClick={() => loadCommissionRecords(recordPagination.page + 1)}
                    style={{
                      padding: '5px 10px',
                      fontSize: '12px',
                      fontWeight: 600,
                      borderRadius: '6px',
                      border: '1px solid var(--shop-admin-border)',
                      background: 'var(--shop-admin-bg)',
                      color: 'var(--shop-admin-text)',
                      cursor: recordPagination.page >= recordPagination.totalPages ? 'not-allowed' : 'pointer',
                      opacity: recordPagination.page >= recordPagination.totalPages ? 0.5 : 1,
                    }}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Modal: Confirm Mark as Paid with Note */}
        {settleModalRecord && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
          >
            <div
              style={{
                background: 'var(--shop-admin-bg)',
                border: '1px solid var(--shop-admin-border)',
                borderRadius: '12px',
                padding: '24px',
                maxWidth: '480px',
                width: '100%',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              }}
            >
              <h3 style={{ margin: '0 0 12px 0', fontSize: '18px' }}>
                💳 Mark Commission as Paid
              </h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'var(--shop-admin-muted)' }}>
                Confirm offline settlement for this vendor commission tracking record:
              </p>

              <div
                style={{
                  background: 'var(--bg, #f8fafc)',
                  border: '1px solid var(--shop-admin-border)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '16px',
                  fontSize: '12px',
                }}
              >
                <div><strong>Order Reference:</strong> {settleModalRecord.order_reference}</div>
                <div style={{ marginTop: '4px' }}><strong>Vendor:</strong> {settleModalRecord.vendor_name} (ID: #{settleModalRecord.vendor_id})</div>
                <div style={{ marginTop: '4px' }}><strong>Product:</strong> {settleModalRecord.product_name}</div>
                <div style={{ marginTop: '4px' }}>
                  <strong>Commission Due:</strong>{' '}
                  <span style={{ fontWeight: 800, color: '#16a34a' }}>
                    ₹{Number(settleModalRecord.commission_amount).toFixed(2)}
                  </span>{' '}
                  ({settleModalRecord.commission_percent_applied}%)
                </div>
              </div>

              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                Settlement Note (Optional)
              </label>
              <input
                type="text"
                value={settleNote}
                onChange={(e) => setSettleNote(e.target.value)}
                placeholder="e.g. Paid cash offline / Bank NEFT ref #12345"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '13px',
                  borderRadius: '6px',
                  border: '1px solid var(--shop-admin-border)',
                  background: 'var(--shop-admin-bg)',
                  color: 'var(--shop-admin-text)',
                  marginBottom: '20px',
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setSettleModalRecord(null);
                    setSettleNote('');
                  }}
                  style={{
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: 600,
                    borderRadius: '6px',
                    border: '1px solid var(--shop-admin-border)',
                    background: 'transparent',
                    color: 'var(--shop-admin-text)',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkRowAsPaid(settleModalRecord, settleNote)}
                  disabled={settlingRecordId === settleModalRecord.id}
                  style={{
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: 700,
                    borderRadius: '6px',
                    border: 'none',
                    background: '#16a34a',
                    color: '#fff',
                    cursor: settlingRecordId === settleModalRecord.id ? 'not-allowed' : 'pointer',
                    opacity: settlingRecordId === settleModalRecord.id ? 0.7 : 1,
                  }}
                >
                  {settlingRecordId === settleModalRecord.id ? 'Updating...' : 'Confirm as Paid'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
