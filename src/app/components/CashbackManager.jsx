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
        <div className={`shop-admin-notice ${notice.type === 'error' ? 'bg-red-50 text-red-700 border-red-300' : ''}`}>
          {notice.text}
        </div>
      )}

      {/* Internal Subtabs */}
      <div className="shop-admin-tabs" style={{ marginBottom: '20px' }}>
        <button
          type="button"
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Global Settings
        </button>
        <button
          type="button"
          className={activeTab === 'first-order' ? 'active' : ''}
          onClick={() => setActiveTab('first-order')}
        >
          🎉 First Order Bonus
        </button>
        <button
          type="button"
          className={activeTab === 'category' ? 'active' : ''}
          onClick={() => setActiveTab('category')}
        >
          📁 Category Cashback
        </button>
        <button
          type="button"
          className={activeTab === 'slab' ? 'active' : ''}
          onClick={() => setActiveTab('slab')}
        >
          📊 Order Amount Slabs
        </button>
      </div>

      {loading ? (
        <div className="shop-admin-card"><p>Loading cashback configuration...</p></div>
      ) : (
        <>
          {/* TAB 1: GLOBAL SETTINGS */}
          {activeTab === 'settings' && (
            <form className="shop-admin-card" onSubmit={saveSettings}>
              <h3>Global Cashback Configuration</h3>
              <div className="shop-admin-fields">
                <label className="shop-admin-check shop-admin-wide">
                  <input
                    type="checkbox"
                    checked={settings.enabled}
                    onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                  />
                  <span><strong>Master Cashback Enabled</strong> (Turn off to globally disable earning cashback)</span>
                </label>

                <label>
                  Stacking Mode (Category + Order Slab)
                  <select
                    value={settings.stacking_mode}
                    onChange={(e) => setSettings({ ...settings, stacking_mode: e.target.value })}
                  >
                    <option value="HIGHEST">HIGHEST (Apply whichever is greater: Category or Slab)</option>
                    <option value="SUM">SUM (Add both Category & Slab cashback together)</option>
                  </select>
                  <small>First-order cashback bonus is always added on top.</small>
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
                  <small>Days after delivery before cashback becomes spendable (0 = immediately available).</small>
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

                <label>
                  Max Cashback Cap Per Order (₹)
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 2000 (leave blank for unlimited)"
                    value={settings.max_cashback_per_order}
                    onChange={(e) => setSettings({ ...settings, max_cashback_per_order: e.target.value })}
                  />
                  <small>Absolute maximum cashback a single order can earn across all rules.</small>
                </label>

                <label className="shop-admin-check shop-admin-wide">
                  <input
                    type="checkbox"
                    checked={settings.allow_with_coupon}
                    onChange={(e) => setSettings({ ...settings, allow_with_coupon: e.target.checked })}
                  />
                  <span><strong>Allow Cashback When Coupon is Applied</strong> (If unchecked, orders with coupons earn ₹0 cashback)</span>
                </label>

                <div className="shop-admin-wide" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginTop: '8px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: '700', color: '#12283F' }}>
                    💰 Wallet Balance Redemption (Pay with Wallet at Checkout)
                  </h4>
                </div>

                <label className="shop-admin-check shop-admin-wide">
                  <input
                    type="checkbox"
                    checked={settings.redeem_enabled !== false}
                    onChange={(e) => setSettings({ ...settings, redeem_enabled: e.target.checked })}
                  />
                  <span><strong>Enable Wallet Balance Redemption at Checkout</strong> (Turn off to stop users from paying using their cashback wallet)</span>
                </label>

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
                  <small>The wallet can pay at most this percentage of the payable order amount (Default: 10%).</small>
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

                <label>
                  Min Redeem Amount (₹)
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="e.g. 50 (0 for no minimum)"
                    value={settings.min_redeem_amount ?? 0}
                    onChange={(e) => setSettings({ ...settings, min_redeem_amount: e.target.value })}
                  />
                  <small>Smallest wallet amount a user can apply towards an order.</small>
                </label>

                <label className="shop-admin-check shop-admin-wide">
                  <input
                    type="checkbox"
                    checked={settings.allow_redeem_with_coupon !== false}
                    onChange={(e) => setSettings({ ...settings, allow_redeem_with_coupon: e.target.checked })}
                  />
                  <span><strong>Allow Wallet Redemption when Coupon is Applied</strong> (If unchecked, users cannot use wallet balance if they also used a coupon code)</span>
                </label>

                <label className="shop-admin-check shop-admin-wide">
                  <input
                    type="checkbox"
                    checked={Boolean(settings.cashback_on_wallet_paid_amount)}
                    onChange={(e) => setSettings({ ...settings, cashback_on_wallet_paid_amount: e.target.checked })}
                  />
                  <span><strong>Earn Cashback on Wallet-Paid Amount</strong> (When unchecked, cashback is calculated strictly on the amount excluding what was paid from the wallet, preventing earning cashback on cashback)</span>
                </label>
              </div>

              <div className="shop-admin-form-footer">
                <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</button>
              </div>
            </form>
          )}

          {/* TAB 2: FIRST ORDER BONUS */}
          {activeTab === 'first-order' && (
            <form className="shop-admin-card" onSubmit={saveFirstOrder}>
              <h3>First Order Cashback Bonus</h3>
              <p>Rewards new customers on their very first delivered order. It is added on top of any category or slab cashback.</p>
              
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
                  <small>Cap limit for percentage bonuses.</small>
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

                <label className="shop-admin-check shop-admin-wide">
                  <input
                    type="checkbox"
                    checked={firstOrderForm.is_active}
                    onChange={(e) => setFirstOrderForm({ ...firstOrderForm, is_active: e.target.checked })}
                  />
                  <span>Active Rule</span>
                </label>
              </div>

              <div className="shop-admin-form-footer">
                <button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : firstOrderRule ? 'Update First Order Bonus' : 'Create First Order Bonus'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: CATEGORY CASHBACK */}
          {activeTab === 'category' && (
            <>
              <form className="shop-admin-card" onSubmit={saveCategoryRule}>
                <h3>Add / Edit Category Cashback Rule</h3>
                <p>Set specific cashback rates for individual product categories (e.g. Cement 1%, Paint 3%, Sanitary 2%).</p>

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

                  <label className="shop-admin-check">
                    <input
                      type="checkbox"
                      checked={categoryForm.is_active}
                      onChange={(e) => setCategoryForm({ ...categoryForm, is_active: e.target.checked })}
                    />
                    <span>Active</span>
                  </label>
                </div>

                <div className="shop-admin-form-footer">
                  <button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Category Rule'}
                  </button>
                  {categoryForm.category_id && (
                    <button
                      type="button"
                      onClick={() => setCategoryForm({ category_id: '', value_type: 'PERCENT', value: '', min_order_value: '', max_cashback: '', is_active: true })}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </form>

              {/* Table of active category rules */}
              <div className="shop-admin-card">
                <h3>Configured Category Rules ({categoryRules.length})</h3>
                {!categoryRules.length ? (
                  <p>No category rules added yet.</p>
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
                            <td><strong>{rule.category_name || `Category #${rule.category_id}`}</strong></td>
                            <td>{rule.value_type === 'PERCENT' ? `${rule.value}%` : `₹${rule.value}`}</td>
                            <td>{Number(rule.min_order_value) > 0 ? `₹${rule.min_order_value}` : 'None'}</td>
                            <td>{rule.max_cashback ? `₹${rule.max_cashback}` : 'Unlimited'}</td>
                            <td>{rule.is_active ? 'Active' : 'Inactive'}</td>
                            <td>
                              <div className="shop-admin-actions">
                                <button
                                  type="button"
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
                                <button type="button" onClick={() => deleteRule(rule.id)}>Delete</button>
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
              <h3>Tier / Slab-based Order Amount Cashback</h3>
              <p>Configure ascending cart tiers. The last tier is automatically open-ended so there are no overlaps or gaps.</p>

              <div style={{ marginBottom: '20px' }}>
                <table style={{ width: '100%', maxWidth: '600px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '8px' }}>Tier Range</th>
                      <th style={{ padding: '8px' }}>Cashback %</th>
                      <th style={{ padding: '8px', width: '80px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slabsList.map((tier, idx) => {
                      const isLast = idx === slabsList.length - 1;
                      const prevLimit = idx === 0 ? 0 : slabsList[idx - 1].upto;
                      return (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '8px' }}>
                            {isLast ? (
                              <span>Above ₹{prevLimit?.toLocaleString('en-IN') || 0}</span>
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>Up to ₹</span>
                                <input
                                  type="number"
                                  min={prevLimit ? prevLimit + 1 : 1}
                                  value={tier.upto ?? ''}
                                  onChange={(e) => handleSlabChange(idx, 'upto', e.target.value)}
                                  style={{ width: '120px', minHeight: '32px', padding: '4px 8px' }}
                                  required
                                />
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={tier.percent ?? ''}
                                onChange={(e) => handleSlabChange(idx, 'percent', e.target.value)}
                                style={{ width: '80px', minHeight: '32px', padding: '4px 8px' }}
                                required
                              />
                              <span>%</span>
                            </div>
                          </td>
                          <td style={{ padding: '8px' }}>
                            {!isLast && (
                              <button
                                type="button"
                                onClick={() => removeSlabTier(idx)}
                                style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
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
                    marginTop: '12px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px dashed #0284c7',
                    background: '#f0f9ff',
                    color: '#0284c7',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  + Add Slab Tier
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
                </label>

                <label className="shop-admin-check shop-admin-wide">
                  <input
                    type="checkbox"
                    checked={slabSettingsForm.is_active}
                    onChange={(e) => setSlabSettingsForm({ ...slabSettingsForm, is_active: e.target.checked })}
                  />
                  <span>Active Slab Rule</span>
                </label>
              </div>

              <div className="shop-admin-form-footer">
                <button type="submit" disabled={saving}>
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
