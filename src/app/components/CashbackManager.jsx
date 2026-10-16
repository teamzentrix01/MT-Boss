'use client';

import { useEffect, useState } from 'react';
import './ShopNowManager.css';

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('admin-token') || localStorage.getItem('token') || ''}`,
});

export default function CashbackManager({ isDarkMode }) {
  const [activeTab, setActiveTab] = useState('settings'); // 'settings' | 'first-order' | 'category' | 'slab'
  const [notice, setNotice] = useState({ text: '', type: 'info' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Global settings state
  const [settings, setSettings] = useState({
    enabled: true,
    stacking_mode: 'HIGHEST',
    allow_with_coupon: true,
    calc_base: 'AFTER_DISCOUNT',
    max_cashback_per_order: '',
    pending_days: 7,
    expiry_days: 0,
    redeem_enabled: true,
    max_redeem_percent_of_order: 10,
    min_order_for_redeem: 0,
    min_redeem_amount: 0,
    allow_redeem_with_coupon: true,
    cashback_on_wallet_paid_amount: false,
  });

  // Categories list (for category-wise rules)
  const [categories, setCategories] = useState([]);

  // Rules lists
  const [firstOrderRule, setFirstOrderRule] = useState(null);
  const [categoryRules, setCategoryRules] = useState([]);
  const [slabRule, setSlabRule] = useState(null);

  // Forms
  const [firstOrderForm, setFirstOrderForm] = useState({
    value_type: 'PERCENT',
    value: '',
    min_order_value: '',
    max_cashback: '',
    start_date: '',
    end_date: '',
    is_active: true,
  });

  const [categoryForm, setCategoryForm] = useState({
    category_id: '',
    value_type: 'PERCENT',
    value: '',
    min_order_value: '',
    max_cashback: '',
    is_active: true,
  });

  const [slabsList, setSlabsList] = useState([
    { upto: 5000, percent: 1 },
    { upto: 20000, percent: 2 },
    { upto: null, percent: 3 },
  ]);
  const [slabSettingsForm, setSlabSettingsForm] = useState({
    min_order_value: '',
    max_cashback: '',
    is_active: true,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [settingsRes, rulesRes, catRes] = await Promise.all([
        fetch('/api/admin/cashback/settings', { headers: headers() }),
        fetch('/api/admin/cashback/rules', { headers: headers() }),
        fetch('/api/shop-categories'),
      ]);

      const [settingsData, rulesData, catData] = await Promise.all([
        settingsRes.json(),
        rulesRes.json(),
        catRes.json(),
      ]);

      if (settingsData.success && settingsData.data) {
        setSettings({
          ...settingsData.data,
          max_cashback_per_order: settingsData.data.max_cashback_per_order ?? '',
        });
      }

      if (catData.success && catData.data) {
        setCategories(catData.data);
      }

      if (rulesData.success && Array.isArray(rulesData.data)) {
        const rules = rulesData.data;
        const fo = rules.find((r) => r.rule_type === 'FIRST_ORDER');
        const sl = rules.find((r) => r.rule_type === 'SLAB');
        const cr = rules.filter((r) => r.rule_type === 'CATEGORY');

        setFirstOrderRule(fo || null);
        if (fo) {
          setFirstOrderForm({
            value_type: fo.value_type,
            value: fo.value,
            min_order_value: fo.min_order_value || '',
            max_cashback: fo.max_cashback ?? '',
            start_date: fo.start_date ? String(fo.start_date).slice(0, 10) : '',
            end_date: fo.end_date ? String(fo.end_date).slice(0, 10) : '',
            is_active: fo.is_active,
          });
        }

        setSlabRule(sl || null);
        if (sl) {
          if (Array.isArray(sl.slabs) && sl.slabs.length > 0) {
            setSlabsList(sl.slabs);
          }
          setSlabSettingsForm({
            min_order_value: sl.min_order_value || '',
            max_cashback: sl.max_cashback ?? '',
            is_active: sl.is_active,
          });
        }

        setCategoryRules(cr);
      }
    } catch (err) {
      setNotice({ text: err.message || 'Failed to load cashback data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const saveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotice({ text: '', type: 'info' });
    try {
      const res = await fetch('/api/admin/cashback/settings', {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save settings');
      setNotice({ text: 'Global cashback settings updated successfully.', type: 'success' });
    } catch (err) {
      setNotice({ text: err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const saveFirstOrder = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotice({ text: '', type: 'info' });
    try {
      const payload = {
        rule_type: 'FIRST_ORDER',
        ...firstOrderForm,
      };
      const url = firstOrderRule ? `/api/admin/cashback/rules/${firstOrderRule.id}` : '/api/admin/cashback/rules';
      const method = firstOrderRule ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: headers(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save first order rule');
      setNotice({ text: 'First order cashback rule saved.', type: 'success' });
      await loadData();
    } catch (err) {
      setNotice({ text: err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const saveCategoryRule = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotice({ text: '', type: 'info' });
    try {
      const payload = {
        rule_type: 'CATEGORY',
        ...categoryForm,
      };
      const existing = categoryRules.find((r) => String(r.category_id) === String(categoryForm.category_id));
      const url = existing ? `/api/admin/cashback/rules/${existing.id}` : '/api/admin/cashback/rules';
      const method = existing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: headers(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save category rule');
      setNotice({ text: 'Category cashback rule saved.', type: 'success' });
      setCategoryForm({ category_id: '', value_type: 'PERCENT', value: '', min_order_value: '', max_cashback: '', is_active: true });
      await loadData();
    } catch (err) {
      setNotice({ text: err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const deleteRule = async (ruleId) => {
    if (!window.confirm('Are you sure you want to delete this rule?')) return;
    try {
      const res = await fetch(`/api/admin/cashback/rules/${ruleId}`, {
        method: 'DELETE',
        headers: headers(),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to delete rule');
      setNotice({ text: 'Rule deleted.', type: 'success' });
      await loadData();
    } catch (err) {
      setNotice({ text: err.message, type: 'error' });
    }
  };

  // Slab helpers
  const handleSlabChange = (index, field, val) => {
    const updated = [...slabsList];
    updated[index][field] = field === 'upto' ? (val === '' ? null : Number(val)) : Number(val);
    setSlabsList(updated);
  };

  const addSlabTier = () => {
    const last = slabsList[slabsList.length - 1];
    const prevUpto = slabsList.length > 1 ? slabsList[slabsList.length - 2].upto : 5000;
    const newLimit = (prevUpto || 5000) + 10000;

    // Insert before the last open-ended slab
    const updated = [
      ...slabsList.slice(0, -1),
      { upto: newLimit, percent: last.percent || 2 },
      { upto: null, percent: (last.percent || 2) + 1 },
    ];
    setSlabsList(updated);
  };

  const removeSlabTier = (index) => {
    if (slabsList.length <= 2) {
      alert('You need at least one tier plus the final open-ended tier.');
      return;
    }
    const updated = slabsList.filter((_, idx) => idx !== index);
    // Ensure the last one is always open-ended
    updated[updated.length - 1].upto = null;
    setSlabsList(updated);
  };

  const saveSlabRule = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotice({ text: '', type: 'info' });
    try {
      const payload = {
        rule_type: 'SLAB',
        slabs: slabsList,
        ...slabSettingsForm,
      };
      const url = slabRule ? `/api/admin/cashback/rules/${slabRule.id}` : '/api/admin/cashback/rules';
      const method = slabRule ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: headers(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save slab rule');
      setNotice({ text: 'Order amount slabs saved.', type: 'success' });
      await loadData();
    } catch (err) {
      setNotice({ text: err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="shop-admin-root shop-admin-panel">
      <div className="shop-admin-heading">
        <div>
          <h2>Cashback & Wallet System</h2>
          <p>Configure dynamic cashback rewards earned by customers when ordering building materials.</p>
        </div>
      </div>

      {notice.text && (
        <div
          className={`shop-admin-notice ${
            notice.type === 'error'
              ? 'bg-slate-100 text-[#12283F] border-slate-300'
              : 'bg-blue-50 text-blue-900 border-blue-200'
          }`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 600,
            background: notice.type === 'error' ? 'rgba(18, 40, 63, 0.08)' : 'rgba(33, 150, 243, 0.08)',
            border: notice.type === 'error' ? '1px solid rgba(18, 40, 63, 0.2)' : '1px solid rgba(33, 150, 243, 0.3)',
            color: '#12283F',
          }}
        >
          <span>{notice.type === 'error' ? '⚠️' : notice.type === 'success' ? '✅' : 'ℹ️'}</span>
          <span>{notice.text}</span>
        </div>
      )}

      {/* Internal Subtabs */}
      <div
        className="shop-admin-tabs"
        style={{
          marginBottom: '24px',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
          paddingBottom: '12px',
        }}
      >
        <button
          type="button"
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => setActiveTab('settings')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
          }}
        >
          <span>⚙️</span>
          <span>Global Settings</span>
          <span
            style={{
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '10px',
              fontWeight: 800,
              background: settings.enabled ? 'rgba(33, 150, 243, 0.15)' : (isDarkMode ? '#334155' : '#f1f5f9'),
              color: settings.enabled ? '#2196F3' : (isDarkMode ? '#94a3b8' : '#64748b'),
            }}
          >
            {settings.enabled ? 'Live' : 'Off'}
          </span>
        </button>

        <button
          type="button"
          className={activeTab === 'first-order' ? 'active' : ''}
          onClick={() => setActiveTab('first-order')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
          }}
        >
          <span>🎉</span>
          <span>First Order Bonus</span>
          {firstOrderRule && (
            <span
              style={{
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '10px',
                fontWeight: 800,
                background: firstOrderRule.is_active ? 'rgba(33, 150, 243, 0.15)' : (isDarkMode ? '#334155' : '#f1f5f9'),
                color: firstOrderRule.is_active ? '#2196F3' : (isDarkMode ? '#94a3b8' : '#64748b'),
              }}
            >
              {firstOrderRule.is_active ? 'Active' : 'Inactive'}
            </span>
          )}
        </button>

        <button
          type="button"
          className={activeTab === 'category' ? 'active' : ''}
          onClick={() => setActiveTab('category')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
          }}
        >
          <span>📁</span>
          <span>Category Cashback</span>
          <span
            style={{
              fontSize: '10px',
              padding: '2px 7px',
              borderRadius: '10px',
              fontWeight: 800,
              background: categoryRules.length > 0 ? 'rgba(33, 150, 243, 0.15)' : (isDarkMode ? '#334155' : '#f1f5f9'),
              color: categoryRules.length > 0 ? '#2196F3' : (isDarkMode ? '#94a3b8' : '#64748b'),
            }}
          >
            {categoryRules.length}
          </span>
        </button>

        <button
          type="button"
          className={activeTab === 'slab' ? 'active' : ''}
          onClick={() => setActiveTab('slab')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
          }}
        >
          <span>📊</span>
          <span>Order Amount Slabs</span>
          {slabRule && (
            <span
              style={{
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '10px',
                fontWeight: 800,
                background: slabRule.is_active ? 'rgba(33, 150, 243, 0.15)' : (isDarkMode ? '#334155' : '#f1f5f9'),
                color: slabRule.is_active ? '#2196F3' : (isDarkMode ? '#94a3b8' : '#64748b'),
              }}
            >
              {slabRule.is_active ? 'Active' : 'Inactive'}
            </span>
          )}
        </button>
      </div>

      {loading ? (
        <div className="shop-admin-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p style={{ fontWeight: 600 }}>Loading cashback configuration...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: GLOBAL SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={saveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              {/* Card 1: Cashback Earning Engine */}
              <div className="shop-admin-card" style={{ margin: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '20px' }}>🎁</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800 }}>Cashback Earning Engine</h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                      Controls when and how customers accumulate cashback rewards upon material delivery.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                  {/* Master Cashback Switch */}
                  <StatusToggleRow
                    label="Master Cashback Program"
                    description="Turn on to activate cashback calculations across the storefront. Turn off to globally disable all cashback earning."
                    checked={settings.enabled}
                    onChange={(val) => setSettings({ ...settings, enabled: val })}
                    isDarkMode={isDarkMode}
                    activeText="Active"
                    inactiveText="Inactive"
                  />

                  {/* Allow with coupon */}
                  <StatusToggleRow
                    label="Allow Cashback With Coupon"
                    description="If active, customers earn cashback even when applying promo coupons. If inactive, orders using a coupon earn ₹0 cashback."
                    checked={settings.allow_with_coupon}
                    onChange={(val) => setSettings({ ...settings, allow_with_coupon: val })}
                    isDarkMode={isDarkMode}
                    activeText="Active"
                    inactiveText="Inactive"
                  />
                </div>

                <div className="shop-admin-fields">
                  <label>
                    Stacking Mode (Category + Order Slab)
                    <select
                      value={settings.stacking_mode}
                      onChange={(e) => setSettings({ ...settings, stacking_mode: e.target.value })}
                    >
                      <option value="HIGHEST">HIGHEST (Apply whichever is greater: Category or Slab)</option>
                      <option value="SUM">SUM (Add both Category & Slab cashback together)</option>
                    </select>
                    <small>First-order cashback bonus is always added on top of regular cashback.</small>
                  </label>

                  <label>
                    Calculation Base
                    <select
                      value={settings.calc_base}
                      onChange={(e) => setSettings({ ...settings, calc_base: e.target.value })}
                    >
                      <option value="AFTER_DISCOUNT">AFTER_DISCOUNT (Calculate on price after coupon discount)</option>
                      <option value="BEFORE_DISCOUNT">BEFORE_DISCOUNT (Calculate on original subtotal)</option>
                    </select>
                    <small>AFTER_DISCOUNT proportionally distributes coupons across category items.</small>
                  </label>

                  <label>
                    Pending Return Window (Days)
                    <input
                      type="number"
                      min="0"
                      value={settings.pending_days}
                      onChange={(e) => setSettings({ ...settings, pending_days: e.target.value })}
                      required
                    />
                    <small>Days after delivery before cashback becomes spendable in wallet (0 = immediately available).</small>
                  </label>

                  <label>
                    Cashback Expiry (Days)
                    <input
                      type="number"
                      min="0"
                      value={settings.expiry_days}
                      onChange={(e) => setSettings({ ...settings, expiry_days: e.target.value })}
                      required
                    />
                    <small>Days until available cashback expires (0 = never expires).</small>
                  </label>

                  <label className="shop-admin-wide">
                    Max Cashback Cap Per Order (₹)
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="e.g. 2000 (leave blank for unlimited)"
                      value={settings.max_cashback_per_order}
                      onChange={(e) => setSettings({ ...settings, max_cashback_per_order: e.target.value })}
                    />
                    <small>Absolute maximum cashback a single order can earn across all rules combined.</small>
                  </label>
                </div>
              </div>

              {/* Card 2: Wallet Balance Redemption */}
              <div className="shop-admin-card" style={{ margin: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '20px' }}>👛</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800 }}>Wallet Balance Redemption (Pay at Checkout)</h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                      Configure rules under which customers can redeem their cashback balance to pay for carts.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                  {/* Enable Wallet Redemption Switch */}
                  <StatusToggleRow
                    label="Wallet Redemption at Checkout"
                    description="Allow customers to spend their available cashback wallet balance directly on the checkout screen."
                    checked={settings.redeem_enabled !== false}
                    onChange={(val) => setSettings({ ...settings, redeem_enabled: val })}
                    isDarkMode={isDarkMode}
                    activeText="Active"
                    inactiveText="Inactive"
                  />

                  {/* Allow wallet redeem with coupon */}
                  <StatusToggleRow
                    label="Allow Wallet Redemption With Coupon"
                    description="If active, customers can combine both wallet money and coupon discounts. If inactive, wallet redemption is blocked when a coupon is active."
                    checked={settings.allow_redeem_with_coupon !== false}
                    onChange={(val) => setSettings({ ...settings, allow_redeem_with_coupon: val })}
                    isDarkMode={isDarkMode}
                    activeText="Active"
                    inactiveText="Inactive"
                  />

                  {/* Cashback on wallet paid amount */}
                  <StatusToggleRow
                    label="Earn Cashback on Wallet-Paid Portion"
                    description="When active, the whole order earns cashback. When inactive, wallet-paid amount is subtracted from the base, avoiding earning cashback on cashback."
                    checked={Boolean(settings.cashback_on_wallet_paid_amount)}
                    onChange={(val) => setSettings({ ...settings, cashback_on_wallet_paid_amount: val })}
                    isDarkMode={isDarkMode}
                    activeText="Active"
                    inactiveText="Inactive"
                  />
                </div>

                <div className="shop-admin-fields">
                  <label>
                    Max Redeem % of Order
                    <input
                      type="number"
                      min="1"
                      max="100"
                      step="1"
                      value={settings.max_redeem_percent_of_order ?? 10}
                      onChange={(e) => setSettings({ ...settings, max_redeem_percent_of_order: e.target.value })}
                      required
                    />
                    <small>The wallet can pay at most this percentage of the payable order amount (Default: 10%, 100% for full wallet coverage).</small>
                  </label>

                  <label>
                    Min Order Value for Redemption (₹)
                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="e.g. 1000 (0 for no limit)"
                      value={settings.min_order_for_redeem ?? 0}
                      onChange={(e) => setSettings({ ...settings, min_order_for_redeem: e.target.value })}
                    />
                    <small>Minimum cart order value required before a user can apply their wallet balance.</small>
                  </label>

                  <label className="shop-admin-wide">
                    Min Redeem Amount (₹)
                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="e.g. 50 (0 for no minimum)"
                      value={settings.min_redeem_amount ?? 0}
                      onChange={(e) => setSettings({ ...settings, min_redeem_amount: e.target.value })}
                    />
                    <small>Smallest wallet balance amount a customer is allowed to redeem on an order.</small>
                  </label>
                </div>
              </div>

              <div className="shop-admin-form-footer" style={{ marginTop: '4px' }}>
                <button type="submit" disabled={saving} style={{ cursor: 'pointer' }}>
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: FIRST ORDER BONUS */}
          {activeTab === 'first-order' && (
            <form className="shop-admin-card" onSubmit={saveFirstOrder}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>First Order Cashback Bonus</h3>
                  <p style={{ margin: '3px 0 0 0', fontSize: '13px', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                    Rewards new customers on their very first delivered order. It is added on top of category and slab cashback.
                  </p>
                </div>
                {firstOrderRule && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '11px',
                      fontWeight: 800,
                      background: firstOrderRule.is_active
                        ? isDarkMode
                          ? 'rgba(33, 150, 243, 0.2)'
                          : '#e3f2fd'
                        : isDarkMode
                        ? '#1e293b'
                        : '#f1f5f9',
                      color: firstOrderRule.is_active
                        ? isDarkMode
                          ? '#90caf9'
                          : '#1976D2'
                        : isDarkMode
                        ? '#94a3b8'
                        : '#64748b',
                    }}
                  >
                    <span>{firstOrderRule.is_active ? '●' : '○'}</span>
                    {firstOrderRule.is_active ? 'Active on Storefront' : 'Currently Inactive'}
                  </span>
                )}
              </div>

              <div className="shop-admin-fields">
                <label>
                  Reward Type
                  <select
                    value={firstOrderForm.value_type}
                    onChange={(e) => setFirstOrderForm({ ...firstOrderForm, value_type: e.target.value })}
                  >
                    <option value="PERCENT">Percentage (%)</option>
                    <option value="FLAT">Flat Amount (₹)</option>
                  </select>
                </label>

                <label>
                  Reward Value *
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    placeholder={firstOrderForm.value_type === 'PERCENT' ? 'e.g. 5 for 5%' : 'e.g. 250 for ₹250'}
                    value={firstOrderForm.value}
                    onChange={(e) => setFirstOrderForm({ ...firstOrderForm, value: e.target.value })}
                  />
                </label>

                <label>
                  Minimum Order Value (₹)
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 1000"
                    value={firstOrderForm.min_order_value}
                    onChange={(e) => setFirstOrderForm({ ...firstOrderForm, min_order_value: e.target.value })}
                  />
                  <small>Minimum cart value required for first-order bonus.</small>
                </label>

                <label>
                  Maximum Cashback Cap (₹)
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 500 (optional)"
                    value={firstOrderForm.max_cashback}
                    onChange={(e) => setFirstOrderForm({ ...firstOrderForm, max_cashback: e.target.value })}
                  />
                  <small>Upper cap limit for percentage bonuses.</small>
                </label>

                <label>
                  Start Date (Optional)
                  <input
                    type="date"
                    value={firstOrderForm.start_date}
                    onChange={(e) => setFirstOrderForm({ ...firstOrderForm, start_date: e.target.value })}
                  />
                </label>

                <label>
                  End Date (Optional)
                  <input
                    type="date"
                    value={firstOrderForm.end_date}
                    onChange={(e) => setFirstOrderForm({ ...firstOrderForm, end_date: e.target.value })}
                  />
                </label>

                {/* Status Switch (Replaces Checkbox) */}
                <div className="shop-admin-wide" style={{ marginTop: '6px' }}>
                  <FormStatusSwitch
                    label="Rule Status"
                    checked={firstOrderForm.is_active}
                    onChange={(val) => setFirstOrderForm({ ...firstOrderForm, is_active: val })}
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>

              <div className="shop-admin-form-footer">
                <button type="submit" disabled={saving} style={{ cursor: 'pointer' }}>
                  {saving ? 'Saving...' : firstOrderRule ? 'Update First Order Bonus' : 'Create First Order Bonus'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: CATEGORY CASHBACK */}
          {activeTab === 'category' && (
            <>
              <form className="shop-admin-card" onSubmit={saveCategoryRule}>
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Add / Edit Category Cashback Rule</h3>
                  <p style={{ margin: '3px 0 0 0', fontSize: '13px', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                    Set specific cashback rates for individual product categories (e.g. Cement 1%, Paint 3%, Sanitary 2%).
                  </p>
                </div>

                <div className="shop-admin-fields">
                  <label>
                    Category *
                    <select
                      required
                      value={categoryForm.category_id}
                      onChange={(e) => {
                        const catId = e.target.value;
                        const existing = categoryRules.find((r) => String(r.category_id) === String(catId));
                        if (existing) {
                          setCategoryForm({
                            category_id: existing.category_id,
                            value_type: existing.value_type,
                            value: existing.value,
                            min_order_value: existing.min_order_value || '',
                            max_cashback: existing.max_cashback ?? '',
                            is_active: existing.is_active,
                          });
                        } else {
                          setCategoryForm({ ...categoryForm, category_id: catId });
                        }
                      }}
                    >
                      <option value="">Select a Category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} {categoryRules.some((r) => String(r.category_id) === String(c.id)) ? '✓ (Configured)' : ''}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Reward Type
                    <select
                      value={categoryForm.value_type}
                      onChange={(e) => setCategoryForm({ ...categoryForm, value_type: e.target.value })}
                    >
                      <option value="PERCENT">Percentage (%)</option>
                      <option value="FLAT">Flat Amount (₹)</option>
                    </select>
                  </label>

                  <label>
                    Cashback Value *
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      required
                      placeholder={categoryForm.value_type === 'PERCENT' ? 'e.g. 2 for 2%' : 'e.g. 100 for ₹100'}
                      value={categoryForm.value}
                      onChange={(e) => setCategoryForm({ ...categoryForm, value: e.target.value })}
                    />
                  </label>

                  <label>
                    Minimum Order Value (₹)
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 0"
                      value={categoryForm.min_order_value}
                      onChange={(e) => setCategoryForm({ ...categoryForm, min_order_value: e.target.value })}
                    />
                  </label>

                  <label>
                    Max Cashback Cap (₹)
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 500 (optional)"
                      value={categoryForm.max_cashback}
                      onChange={(e) => setCategoryForm({ ...categoryForm, max_cashback: e.target.value })}
                    />
                  </label>

                  {/* Status Switch (Replaces Checkbox) */}
                  <div style={{ marginTop: '2px' }}>
                    <FormStatusSwitch
                      label="Rule Status"
                      checked={categoryForm.is_active}
                      onChange={(val) => setCategoryForm({ ...categoryForm, is_active: val })}
                      isDarkMode={isDarkMode}
                    />
                  </div>
                </div>

                <div className="shop-admin-form-footer">
                  <button type="submit" disabled={saving} style={{ cursor: 'pointer' }}>
                    {saving ? 'Saving...' : 'Save Category Rule'}
                  </button>
                  {categoryForm.category_id && (
                    <button
                      type="button"
                      style={{ cursor: 'pointer' }}
                      onClick={() =>
                        setCategoryForm({
                          category_id: '',
                          value_type: 'PERCENT',
                          value: '',
                          min_order_value: '',
                          max_cashback: '',
                          is_active: true,
                        })
                      }
                    >
                      Clear
                    </button>
                  )}
                </div>
              </form>

              {/* Table of active category rules */}
              <div className="shop-admin-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800 }}>
                    Configured Category Rules ({categoryRules.length})
                  </h3>
                </div>

                {!categoryRules.length ? (
                  <p style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: '13px' }}>
                    No category rules added yet. Select a category above to create one.
                  </p>
                ) : (
                  <div className="shop-admin-table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Category</th>
                          <th>Cashback</th>
                          <th>Min Order</th>
                          <th>Max Cap</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categoryRules.map((rule) => (
                          <tr key={rule.id}>
                            <td>
                              <strong>{rule.category_name || `Category #${rule.category_id}`}</strong>
                            </td>
                            <td>
                              <span style={{ fontWeight: 700 }}>
                                {rule.value_type === 'PERCENT' ? `${rule.value}%` : `₹${rule.value}`}
                              </span>
                            </td>
                            <td>{Number(rule.min_order_value) > 0 ? `₹${rule.min_order_value}` : 'None'}</td>
                            <td>{rule.max_cashback ? `₹${rule.max_cashback}` : 'Unlimited'}</td>
                            <td>
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '3px 10px',
                                  borderRadius: '12px',
                                  fontSize: '11px',
                                  fontWeight: 800,
                                  background: rule.is_active
                                    ? isDarkMode
                                      ? 'rgba(33, 150, 243, 0.2)'
                                      : '#e3f2fd'
                                    : isDarkMode
                                    ? '#1e293b'
                                    : '#f1f5f9',
                                  color: rule.is_active
                                    ? isDarkMode
                                      ? '#90caf9'
                                      : '#1976D2'
                                    : isDarkMode
                                    ? '#94a3b8'
                                    : '#64748b',
                                }}
                              >
                                <span>{rule.is_active ? '●' : '○'}</span>
                                {rule.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td>
                              <div className="shop-admin-actions">
                                <button
                                  type="button"
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => {
                                    setCategoryForm({
                                      category_id: rule.category_id,
                                      value_type: rule.value_type,
                                      value: rule.value,
                                      min_order_value: rule.min_order_value || '',
                                      max_cashback: rule.max_cashback ?? '',
                                      is_active: rule.is_active,
                                    });
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  style={{ cursor: 'pointer', color: '#ef4444' }}
                                  onClick={() => deleteRule(rule.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 4: ORDER AMOUNT SLABS */}
          {activeTab === 'slab' && (
            <form className="shop-admin-card" onSubmit={saveSlabRule}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Tier / Slab-based Order Amount Cashback</h3>
                  <p style={{ margin: '3px 0 0 0', fontSize: '13px', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                    Configure ascending cart tiers. The last tier is automatically open-ended so there are no overlaps or gaps.
                  </p>
                </div>
                {slabRule && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '11px',
                      fontWeight: 800,
                      background: slabRule.is_active
                        ? isDarkMode
                          ? 'rgba(33, 150, 243, 0.2)'
                          : '#e3f2fd'
                        : isDarkMode
                        ? '#1e293b'
                        : '#f1f5f9',
                      color: slabRule.is_active
                        ? isDarkMode
                          ? '#90caf9'
                          : '#1976D2'
                        : isDarkMode
                        ? '#94a3b8'
                        : '#64748b',
                    }}
                  >
                    <span>{slabRule.is_active ? '●' : '○'}</span>
                    {slabRule.is_active ? 'Active on Storefront' : 'Currently Inactive'}
                  </span>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <table style={{ width: '100%', maxWidth: '640px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0' }}>
                      <th style={{ padding: '10px 8px', fontSize: '11px', textTransform: 'uppercase', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                        Tier Range
                      </th>
                      <th style={{ padding: '10px 8px', fontSize: '11px', textTransform: 'uppercase', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                        Cashback %
                      </th>
                      <th style={{ padding: '10px 8px', width: '80px', fontSize: '11px', textTransform: 'uppercase', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {slabsList.map((tier, idx) => {
                      const isLast = idx === slabsList.length - 1;
                      const prevLimit = idx === 0 ? 0 : slabsList[idx - 1].upto;
                      return (
                        <tr
                          key={idx}
                          style={{
                            borderBottom: isDarkMode ? '1px solid #1e293b' : '1px solid #f1f5f9',
                          }}
                        >
                          <td style={{ padding: '10px 8px' }}>
                            {isLast ? (
                              <span style={{ fontWeight: 700, color: isDarkMode ? '#38bdf8' : '#0284c7' }}>
                                Above ₹{prevLimit?.toLocaleString('en-IN') || 0} (Unlimited)
                              </span>
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontWeight: 600, fontSize: '12px' }}>Up to ₹</span>
                                <input
                                  type="number"
                                  min={prevLimit ? prevLimit + 1 : 1}
                                  value={tier.upto ?? ''}
                                  onChange={(e) => handleSlabChange(idx, 'upto', e.target.value)}
                                  style={{ width: '130px', minHeight: '34px', padding: '4px 8px', fontWeight: 700 }}
                                  required
                                />
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '10px 8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={tier.percent ?? ''}
                                onChange={(e) => handleSlabChange(idx, 'percent', e.target.value)}
                                style={{ width: '85px', minHeight: '34px', padding: '4px 8px', fontWeight: 700 }}
                                required
                              />
                              <span style={{ fontWeight: 800 }}>%</span>
                            </div>
                          </td>
                          <td style={{ padding: '10px 8px' }}>
                            {!isLast && (
                              <button
                                type="button"
                                onClick={() => removeSlabTier(idx)}
                                style={{
                                  color: '#dc2626',
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  fontWeight: 'bold',
                                  fontSize: '12px',
                                }}
                              >
                                ✕ Remove
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <button
                  type="button"
                  onClick={addSlabTier}
                  style={{
                    marginTop: '14px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px dashed #0284c7',
                    background: isDarkMode ? '#0c4a6e25' : '#f0f9ff',
                    color: isDarkMode ? '#38bdf8' : '#0284c7',
                    fontWeight: 800,
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>+</span> Add Slab Tier
                </button>
              </div>

              <div className="shop-admin-fields">
                <label>
                  Minimum Order Value (₹)
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 0"
                    value={slabSettingsForm.min_order_value}
                    onChange={(e) => setSlabSettingsForm({ ...slabSettingsForm, min_order_value: e.target.value })}
                  />
                  <small>Cart total before slab cashback unlocks.</small>
                </label>

                <label>
                  Max Cashback Cap (₹)
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 1000 (optional)"
                    value={slabSettingsForm.max_cashback}
                    onChange={(e) => setSlabSettingsForm({ ...slabSettingsForm, max_cashback: e.target.value })}
                  />
                  <small>Maximum slab cashback a customer can receive.</small>
                </label>

                {/* Status Switch (Replaces Checkbox) */}
                <div className="shop-admin-wide" style={{ marginTop: '6px' }}>
                  <FormStatusSwitch
                    label="Slab Rule Status"
                    checked={slabSettingsForm.is_active}
                    onChange={(val) => setSlabSettingsForm({ ...slabSettingsForm, is_active: val })}
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>

              <div className="shop-admin-form-footer">
                <button type="submit" disabled={saving} style={{ cursor: 'pointer' }}>
                  {saving ? 'Saving...' : 'Save Order Slabs'}
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </section>
  );
}

/**
 * Reusable row switch component replacing checkboxes for global settings.
 * Displays title, helper description and a clean Active/Inactive segmented toggle.
 */
function StatusToggleRow({ label, description, checked, onChange, isDarkMode, activeText = 'Active', inactiveText = 'Inactive' }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        padding: '14px 18px',
        borderRadius: '10px',
        border: checked
          ? isDarkMode
            ? '1px solid rgba(33, 150, 243, 0.4)'
            : '1px solid #90caf9'
          : isDarkMode
          ? '1px solid #334155'
          : '1px solid #e2e8f0',
        background: checked
          ? isDarkMode
            ? 'rgba(33, 150, 243, 0.12)'
            : '#f0f7ff'
          : isDarkMode
          ? '#1e293b'
          : '#f8fafc',
        transition: 'all 0.2s ease',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 800,
            fontSize: '13px',
            color: isDarkMode ? '#f8fafc' : '#0f172a',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          <span>{label}</span>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 800,
              textTransform: 'uppercase',
              padding: '2px 8px',
              borderRadius: '12px',
              letterSpacing: '0.04em',
              background: checked
                ? isDarkMode
                  ? 'rgba(33, 150, 243, 0.25)'
                  : '#e3f2fd'
                : isDarkMode
                ? '#334155'
                : '#f1f5f9',
              color: checked
                ? isDarkMode
                  ? '#90caf9'
                  : '#1976D2'
                : isDarkMode
                ? '#94a3b8'
                : '#64748b',
            }}
          >
            {checked ? activeText : inactiveText}
          </span>
        </div>
        {description && (
          <div
            style={{
              fontSize: '11px',
              color: isDarkMode ? '#94a3b8' : '#64748b',
              marginTop: '4px',
              lineHeight: 1.45,
            }}
          >
            {description}
          </div>
        )}
      </div>

      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '3px',
          borderRadius: '8px',
          background: isDarkMode ? '#0f172a' : '#e2e8f0',
          gap: '3px',
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={() => onChange(true)}
          style={{
            padding: '6px 14px',
            fontSize: '11px',
            fontWeight: 800,
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            background: checked ? '#2196F3' : 'transparent',
            color: checked ? '#ffffff' : isDarkMode ? '#94a3b8' : '#64748b',
            boxShadow: checked ? '0 1px 3px rgba(33, 150, 243, 0.4)' : 'none',
          }}
        >
          <span>●</span> {activeText}
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          style={{
            padding: '6px 14px',
            fontSize: '11px',
            fontWeight: 800,
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            background: !checked ? (isDarkMode ? '#334155' : '#12283F') : 'transparent',
            color: !checked ? '#ffffff' : isDarkMode ? '#94a3b8' : '#64748b',
            boxShadow: !checked ? '0 1px 3px rgba(18, 40, 63, 0.3)' : 'none',
          }}
        >
          <span>○</span> {inactiveText}
        </button>
      </div>
    </div>
  );
}

/**
 * Reusable form switch component replacing checkboxes in individual rule forms.
 * Displays label and a clean Active/Inactive segmented toggle.
 */
function FormStatusSwitch({ label = 'Status', checked, onChange, isDarkMode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <span style={{ fontSize: '12px', fontWeight: 700, color: isDarkMode ? '#f8fafc' : '#1e293b' }}>
        {label}
      </span>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '3px',
          borderRadius: '8px',
          background: isDarkMode ? '#0f172a' : '#f1f5f9',
          border: isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1',
          width: 'fit-content',
          gap: '3px',
        }}
      >
        <button
          type="button"
          onClick={() => onChange(true)}
          style={{
            padding: '7px 16px',
            fontSize: '12px',
            fontWeight: 800,
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: checked ? '#2196F3' : 'transparent',
            color: checked ? '#ffffff' : isDarkMode ? '#94a3b8' : '#64748b',
            boxShadow: checked ? '0 1px 3px rgba(33, 150, 243, 0.4)' : 'none',
          }}
        >
          <span>●</span> Active
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          style={{
            padding: '7px 16px',
            fontSize: '12px',
            fontWeight: 800,
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: !checked ? (isDarkMode ? '#334155' : '#12283F') : 'transparent',
            color: !checked ? '#ffffff' : isDarkMode ? '#94a3b8' : '#64748b',
            boxShadow: !checked ? '0 1px 3px rgba(18, 40, 63, 0.3)' : 'none',
          }}
        >
          <span>○</span> Inactive
        </button>
      </div>
    </div>
  );
}

