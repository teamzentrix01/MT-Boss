'use client';

import { useEffect, useState } from 'react';
import { Plus, ArrowLeft, Zap, Tag, Truck, Percent, Gift, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import './ShopNowManager.css';

const blankCoupon = {
  code: '',
  discount_type: 'percentage',
  discount_value: '',
  max_discount_cap: '',
  min_cart_value: '',
  is_active: true,
  start_date: '',
  end_date: '',
  applicable_categories: [],
};

const blankPromo = {
  name: '',
  promo_type: 'percentage',
  discount_value: '',
  max_discount_cap: '',
  min_cart_value: '50000',
  free_shipping_same_city_only: false,
  badge_text: '',
  description: '',
  is_active: true,
  start_date: '',
  end_date: '',
  applicable_categories: [],
};

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('admin-token') || localStorage.getItem('token') || ''}`,
});

export default function ShopCouponsManager() {
  const [subTab, setSubTab] = useState('promotions'); // 'promotions' | 'coupons'

  // Data states
  const [promotions, setPromotions] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [categories, setCategories] = useState([]);

  // Coupon form state
  const [couponForm, setCouponForm] = useState(blankCoupon);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [showCouponForm, setShowCouponForm] = useState(false);

  // Promotion form state
  const [promoForm, setPromoForm] = useState(blankPromo);
  const [editingPromo, setEditingPromo] = useState(null);
  const [showPromoForm, setShowPromoForm] = useState(false);

  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [promoRes, couponRes, catRes] = await Promise.all([
        fetch('/api/shop-promotions', { headers: headers() }),
        fetch('/api/shop-coupons', { headers: headers() }),
        fetch('/api/shop-categories'),
      ]);

      const [promoData, couponData, catData] = await Promise.all([
        promoRes.json(),
        couponRes.json(),
        catRes.json(),
      ]);

      if (promoData.success) setPromotions(promoData.data || []);
      if (couponData.success) setCoupons(couponData.data || []);
      if (catData.success) setCategories(catData.data || []);
    } catch (error) {
      setNotice(error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // ── PROMOTION ACTIONS ────────────────────────────────────────────────────────
  const savePromotion = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotice('');
    try {
      const payload = editingPromo ? { ...promoForm, id: editingPromo } : promoForm;
      const res = await fetch('/api/shop-promotions', {
        method: editingPromo ? 'PUT' : 'POST',
        headers: headers(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Could not save promotion');

      setPromoForm(blankPromo);
      setEditingPromo(null);
      setShowPromoForm(false);
      setNotice('Promotion saved successfully!');
      await loadAll();
    } catch (error) {
      setNotice(error.message);
    } finally {
      setSaving(false);
    }
  };

  const editPromo = (promo) => {
    setEditingPromo(promo.id);
    setShowPromoForm(true);
    setPromoForm({
      name: promo.name || '',
      promo_type: promo.promo_type || 'percentage',
      discount_value: promo.discount_value != null ? promo.discount_value : '',
      max_discount_cap: promo.max_discount_cap ?? '',
      min_cart_value: promo.min_cart_value != null ? promo.min_cart_value : '50000',
      free_shipping_same_city_only: Boolean(promo.free_shipping_same_city_only),
      badge_text: promo.badge_text || '',
      description: promo.description || '',
      is_active: promo.is_active !== false,
      start_date: promo.start_date ? String(promo.start_date).slice(0, 10) : '',
      end_date: promo.end_date ? String(promo.end_date).slice(0, 10) : '',
      applicable_categories: promo.applicable_categories || [],
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deletePromo = async (promo) => {
    if (!window.confirm(`Delete promotion "${promo.name}"?`)) return;
    try {
      const res = await fetch(`/api/shop-promotions?id=${promo.id}`, {
        method: 'DELETE',
        headers: headers(),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      setNotice('Promotion deleted.');
      await loadAll();
    } catch (error) {
      setNotice(error.message);
    }
  };

  const togglePromoActive = async (promo) => {
    try {
      const res = await fetch('/api/shop-promotions', {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify({ ...promo, is_active: !promo.is_active }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      await loadAll();
    } catch (error) {
      setNotice(error.message);
    }
  };

  // ── COUPON ACTIONS ──────────────────────────────────────────────────────────
  const saveCoupon = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotice('');
    try {
      const res = await fetch('/api/shop-coupons', {
        method: editingCoupon ? 'PUT' : 'POST',
        headers: headers(),
        body: JSON.stringify(editingCoupon ? { ...couponForm, id: editingCoupon } : couponForm),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Could not save coupon');
      setCouponForm(blankCoupon);
      setEditingCoupon(null);
      setShowCouponForm(false);
      setNotice('Coupon saved.');
      await loadAll();
    } catch (error) {
      setNotice(error.message);
    } finally {
      setSaving(false);
    }
  };

  const editCouponItem = (coupon) => {
    setEditingCoupon(coupon.id);
    setShowCouponForm(true);
    setCouponForm({
      code: coupon.code || '',
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      max_discount_cap: coupon.max_discount_cap ?? '',
      min_cart_value: coupon.min_cart_value,
      is_active: coupon.is_active,
      start_date: coupon.start_date ? String(coupon.start_date).slice(0, 10) : '',
      end_date: coupon.end_date ? String(coupon.end_date).slice(0, 10) : '',
      applicable_categories: coupon.applicable_categories || [],
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteCoupon = async (coupon) => {
    if (!window.confirm(`Delete coupon ${coupon.code || 'automatic offer'}?`)) return;
    try {
      const res = await fetch(`/api/shop-coupons?id=${coupon.id}`, { method: 'DELETE', headers: headers() });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      await loadAll();
    } catch (error) {
      setNotice(error.message);
    }
  };

  return (
    <section className="shop-admin-root shop-admin-panel">
      {/* ── TOP SUB-TABS (PROMOTIONS vs COUPONS) ── */}
      <div className="shop-promo-subtabs">
        <button
          type="button"
          className={`shop-promo-subtab-btn ${subTab === 'promotions' ? 'active' : ''}`}
          onClick={() => {
            setSubTab('promotions');
            setShowCouponForm(false);
            setNotice('');
          }}
        >
          <Zap size={16} />
          Automatic Promotions
          <span className="shop-promo-count-pill">{promotions.length}</span>
        </button>

        <button
          type="button"
          className={`shop-promo-subtab-btn ${subTab === 'coupons' ? 'active' : ''}`}
          onClick={() => {
            setSubTab('coupons');
            setShowPromoForm(false);
            setNotice('');
          }}
        >
          <Tag size={16} />
          Coupons & Promo Codes
          <span className="shop-promo-count-pill">{coupons.length}</span>
        </button>
      </div>

      {notice && (
        <p className="shop-admin-notice" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle size={16} /> {notice}
        </p>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          SUBTAB 1: AUTOMATIC PROMOTIONS
          ══════════════════════════════════════════════════════════════════════════ */}
      {subTab === 'promotions' && (
        <>
          {showPromoForm || editingPromo ? (
            /* ── PROMOTION FORM ── */
            <>
              <div className="shop-admin-heading">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPromoForm(false);
                      setEditingPromo(null);
                      setPromoForm(blankPromo);
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '6px 14px',
                      border: '1px solid var(--border, #dce3eb)',
                      borderRadius: 6,
                      background: 'transparent',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: 13,
                    }}
                  >
                    <ArrowLeft size={16} /> Back to promotions
                  </button>
                  <div>
                    <h2>{editingPromo ? 'Edit Promotion' : 'Create Automatic Promotion'}</h2>
                    <p>Configure spend thresholds (e.g. 50k+ shopping = 5% extra discount or Free Shipping).</p>
                  </div>
                </div>
              </div>

              <form className="shop-admin-card" onSubmit={savePromotion}>
                <div className="shop-admin-fields">
                  <label className="shop-admin-wide">
                    Promotion Name *
                    <input
                      required
                      value={promoForm.name}
                      maxLength="120"
                      onChange={(e) => setPromoForm({ ...promoForm, name: e.target.value })}
                      placeholder="e.g. 5% Extra Discount on ₹50,000+ Orders or Free Shipping on ₹50k+"
                    />
                    <small>Descriptive title shown in Admin & during order summary.</small>
                  </label>

                  <label>
                    Promotion Type *
                    <select
                      value={promoForm.promo_type}
                      onChange={(e) => setPromoForm({ ...promoForm, promo_type: e.target.value })}
                    >
                      <option value="percentage">Percentage Discount (e.g. 5% Extra OFF)</option>
                      <option value="free_shipping">Free Shipping Charges (100% Free Delivery)</option>
                      <option value="flat">Flat Amount Discount (e.g. ₹2,500 OFF)</option>
                    </select>
                    <small>Choose whether customers get a percentage off, flat discount, or free delivery charges.</small>
                  </label>

                  <label>
                    Minimum Cart Spend Required (₹) *
                    <input
                      required
                      type="number"
                      min="0"
                      step="1"
                      value={promoForm.min_cart_value}
                      onChange={(e) => setPromoForm({ ...promoForm, min_cart_value: e.target.value })}
                      placeholder="50000"
                    />
                    <small>Customers must add at least this amount to unlock this promotion (e.g. 50000 for ₹50k).</small>
                  </label>

                  {promoForm.promo_type === 'percentage' && (
                    <>
                      <label>
                        Discount Percentage (%) *
                        <input
                          required
                          type="number"
                          min="0.1"
                          max="100"
                          step="0.1"
                          value={promoForm.discount_value}
                          onChange={(e) => setPromoForm({ ...promoForm, discount_value: e.target.value })}
                          placeholder="5 for 5%"
                        />
                        <small>e.g. Enter 5 for 5% discount on the cart value.</small>
                      </label>

                      <label>
                        Maximum Discount Cap (₹) (Optional)
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={promoForm.max_discount_cap}
                          onChange={(e) => setPromoForm({ ...promoForm, max_discount_cap: e.target.value })}
                          placeholder="e.g. 5000 (leave blank for unlimited)"
                        />
                        <small>Max discount ceiling in Rupees (optional).</small>
                      </label>
                    </>
                  )}

                  {promoForm.promo_type === 'flat' && (
                    <label>
                      Flat Discount Amount (₹) *
                      <input
                        required
                        type="number"
                        min="1"
                        step="1"
                        value={promoForm.discount_value}
                        onChange={(e) => setPromoForm({ ...promoForm, discount_value: e.target.value })}
                        placeholder="2500"
                      />
                      <small>Fixed Rupee amount deducted automatically from cart total.</small>
                    </label>
                  )}

                  {promoForm.promo_type === 'free_shipping' && (
                    <label>
                      Free Shipping Scope
                      <select
                        value={promoForm.free_shipping_same_city_only ? 'same_city' : 'all'}
                        onChange={(e) => setPromoForm({ ...promoForm, free_shipping_same_city_only: e.target.value === 'same_city' })}
                      >
                        <option value="all">All Deliveries (All Cities & Outstation)</option>
                        <option value="same_city">Same-City Deliveries Only</option>
                      </select>
                      <small>When cart reaches the minimum spend, shipping charges become ₹0 automatically.</small>
                    </label>
                  )}

                  <label className="shop-admin-wide">
                    Banner / Tagline Text (Optional)
                    <input
                      value={promoForm.badge_text}
                      maxLength="100"
                      onChange={(e) => setPromoForm({ ...promoForm, badge_text: e.target.value })}
                      placeholder={promoForm.promo_type === 'free_shipping' ? '🎉 Orders above ₹50,000 get FREE SHIPPING!' : '🎉 Shop for ₹50,000+ & get 5% EXTRA DISCOUNT!'}
                    />
                    <small>Shown to customers in Cart & Checkout to encourage reaching the minimum spend.</small>
                  </label>

                  <label className="shop-admin-wide">
                    Description (Optional)
                    <textarea
                      rows="2"
                      value={promoForm.description}
                      onChange={(e) => setPromoForm({ ...promoForm, description: e.target.value })}
                      placeholder="e.g. Automatically applied on all orders where shopping cart is ₹50,000 or more."
                    />
                  </label>

                  <label>
                    Start Date (Optional)
                    <input
                      type="date"
                      value={promoForm.start_date}
                      onChange={(e) => setPromoForm({ ...promoForm, start_date: e.target.value })}
                    />
                  </label>

                  <label>
                    End Date (Optional)
                    <input
                      type="date"
                      value={promoForm.end_date}
                      onChange={(e) => setPromoForm({ ...promoForm, end_date: e.target.value })}
                    />
                  </label>

                  <fieldset className="shop-admin-wide shop-admin-city-field">
                    <legend>Applicable Categories (Optional)</legend>
                    <div>
                      {categories.map((category) => (
                        <label key={category.id}>
                          <input
                            type="checkbox"
                            checked={promoForm.applicable_categories.includes(category.name)}
                            onChange={(e) => setPromoForm({
                              ...promoForm,
                              applicable_categories: e.target.checked
                                ? [...promoForm.applicable_categories, category.name]
                                : promoForm.applicable_categories.filter((name) => name !== category.name),
                            })}
                          /> {category.name}
                        </label>
                      ))}
                    </div>
                    <small>Leave all unchecked to apply across all products & materials.</small>
                  </fieldset>
                </div>

                <div className="shop-admin-form-footer">
                  <label className="shop-admin-check">
                    <input
                      type="checkbox"
                      checked={promoForm.is_active}
                      onChange={(e) => setPromoForm({ ...promoForm, is_active: e.target.checked })}
                    /> Active Promotion
                  </label>
                  <button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : editingPromo ? 'Save Promotion' : 'Create Promotion'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPromo(null);
                      setPromoForm(blankPromo);
                      setShowPromoForm(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* ── PROMOTIONS TABLE LIST ── */
            <>
              <div className="shop-admin-heading">
                <div>
                  <h2>Automatic Promotions & Cart Offers</h2>
                  <p>Automatic spend-based rules (e.g. 50k ke upar ki shopping par 5% extra discount ya free shipping charges).</p>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPromoForm(true);
                      setEditingPromo(null);
                      setPromoForm(blankPromo);
                    }}
                    style={{
                      background: 'var(--brand-blue, #2563eb)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '8px 16px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 13,
                    }}
                  >
                    <Plus size={16} /> Create Promotion
                  </button>
                  <button type="button" onClick={loadAll} disabled={loading}>
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
                  </button>
                </div>
              </div>

              {/* Info banner explaining the feature */}
              <div className="shop-promo-info-banner">
                <div className="shop-promo-info-text">
                  <strong>⚡ How Automatic Promotions Work:</strong>
                  <p>
                    Unlike coupons, promotions do not require entering a code. When a customer adds items totaling ₹50,000+ (or your configured spend threshold), MT-Boss automatically applies the 5% extra discount or makes shipping charges ₹0!
                  </p>
                </div>
              </div>

              <div className="shop-admin-card">
                <h3>All Promotions ({promotions.length})</h3>
                {!promotions.length ? (
                  <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                    <p>No promotions configured yet.</p>
                    <button
                      type="button"
                      onClick={() => setShowPromoForm(true)}
                      style={{
                        marginTop: 10,
                        background: 'var(--brand-blue, #2563eb)',
                        color: '#fff',
                        padding: '8px 16px',
                        borderRadius: 6,
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 700,
                      }}
                    >
                      + Create First Promotion (e.g. 50k+ = 5% OFF)
                    </button>
                  </div>
                ) : (
                  <div className="shop-admin-table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Promotion</th>
                          <th>Type</th>
                          <th>Benefit / Offer</th>
                          <th>Min Spend</th>
                          <th>Categories</th>
                          <th>Schedule</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {promotions.map((promo) => (
                          <tr key={promo.id}>
                            <td>
                              <strong>{promo.name}</strong>
                              {promo.badge_text && (
                                <small style={{ color: 'var(--brand-blue, #2563eb)', fontWeight: 600 }}>
                                  Tag: {promo.badge_text}
                                </small>
                              )}
                            </td>
                            <td>
                              <span className={`shop-promo-badge type-${promo.promo_type}`}>
                                {promo.promo_type === 'free_shipping' && <Truck size={12} />}
                                {promo.promo_type === 'percentage' && <Percent size={12} />}
                                {promo.promo_type === 'flat' && <Gift size={12} />}
                                {promo.promo_type === 'free_shipping'
                                  ? 'Free Shipping'
                                  : promo.promo_type === 'percentage'
                                  ? 'Percentage Off'
                                  : 'Flat Discount'}
                              </span>
                            </td>
                            <td>
                              <strong>
                                {promo.promo_type === 'free_shipping'
                                  ? '100% Free Shipping'
                                  : promo.promo_type === 'percentage'
                                  ? `${promo.discount_value}% OFF${Number(promo.max_discount_cap) > 0 ? ` (up to ₹${promo.max_discount_cap})` : ''}`
                                  : `₹${promo.discount_value} OFF`}
                              </strong>
                            </td>
                            <td>
                              <strong>₹{Number(promo.min_cart_value).toLocaleString('en-IN')}</strong>
                              <small>Cart value threshold</small>
                            </td>
                            <td>
                              {promo.applicable_categories?.length
                                ? promo.applicable_categories.join(', ')
                                : 'All materials & items'}
                            </td>
                            <td>
                              {promo.start_date || promo.end_date
                                ? `${promo.start_date || 'Now'} – ${promo.end_date || 'Ongoing'}`
                                : 'Always Active'}
                            </td>
                            <td>
                              <button
                                type="button"
                                onClick={() => togglePromoActive(promo)}
                                title="Click to toggle status"
                                className={promo.is_active ? 'shop-promo-status-active' : 'shop-promo-status-inactive'}
                                style={{ border: 'none', cursor: 'pointer' }}
                              >
                                {promo.is_active ? '● Active' : '○ Inactive'}
                              </button>
                            </td>
                            <td>
                              <div className="shop-admin-actions">
                                <button type="button" onClick={() => editPromo(promo)}>Edit</button>
                                <button type="button" onClick={() => deletePromo(promo)}>Delete</button>
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
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          SUBTAB 2: COUPONS & PROMO CODES
          ══════════════════════════════════════════════════════════════════════════ */}
      {subTab === 'coupons' && (
        <>
          {showCouponForm || editingCoupon ? (
            /* ── COUPON FORM ── */
            <>
              <div className="shop-admin-heading">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCouponForm(false);
                      setEditingCoupon(null);
                      setCouponForm(blankCoupon);
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '6px 14px',
                      border: '1px solid var(--border, #dce3eb)',
                      borderRadius: 6,
                      background: 'transparent',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: 13,
                    }}
                  >
                    <ArrowLeft size={16} /> Back to coupons
                  </button>
                  <div>
                    <h2>{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</h2>
                    <p>Configure manual promo code rules and customer eligibility.</p>
                  </div>
                </div>
              </div>

              <form className="shop-admin-card" onSubmit={saveCoupon}>
                <div className="shop-admin-fields">
                  <label>
                    Coupon Code *
                    <input
                      required
                      value={couponForm.code}
                      maxLength="60"
                      onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                      placeholder="e.g. SAVE60, PROMO900"
                    />
                    <small>Customers enter this code at checkout to claim discount.</small>
                  </label>

                  <label>
                    Discount Type
                    <select
                      value={couponForm.discount_type}
                      onChange={(e) => setCouponForm({ ...couponForm, discount_type: e.target.value })}
                    >
                      <option value="percentage">Percentage</option>
                      <option value="flat">Flat amount</option>
                    </select>
                  </label>

                  <label>
                    Discount Value *
                    <input
                      required
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={couponForm.discount_value}
                      onChange={(e) => setCouponForm({ ...couponForm, discount_value: e.target.value })}
                      placeholder={couponForm.discount_type === 'percentage' ? '10 for 10%' : '500'}
                    />
                  </label>

                  <label>
                    Maximum Discount Cap {couponForm.discount_type === 'percentage' ? '*' : '(optional)'}
                    <input
                      required={couponForm.discount_type === 'percentage'}
                      type="number"
                      min="0"
                      step="0.01"
                      value={couponForm.max_discount_cap}
                      onChange={(e) => setCouponForm({ ...couponForm, max_discount_cap: e.target.value })}
                      placeholder="120"
                    />
                  </label>

                  <label>
                    Minimum Regular-Price Cart Value *
                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      value={couponForm.min_cart_value}
                      onChange={(e) => setCouponForm({ ...couponForm, min_cart_value: e.target.value })}
                      placeholder="199"
                    />
                    <small>Offer-priced products do not count toward this amount.</small>
                  </label>

                  <label>
                    Start Date (Optional)
                    <input
                      type="date"
                      value={couponForm.start_date}
                      onChange={(e) => setCouponForm({ ...couponForm, start_date: e.target.value })}
                    />
                  </label>

                  <label>
                    End Date (Optional)
                    <input
                      type="date"
                      value={couponForm.end_date}
                      onChange={(e) => setCouponForm({ ...couponForm, end_date: e.target.value })}
                    />
                  </label>

                  <fieldset className="shop-admin-wide shop-admin-city-field">
                    <legend>Applicable Categories (Optional)</legend>
                    <div>
                      {categories.map((category) => (
                        <label key={category.id}>
                          <input
                            type="checkbox"
                            checked={couponForm.applicable_categories.includes(category.name)}
                            onChange={(e) => setCouponForm({
                              ...couponForm,
                              applicable_categories: e.target.checked
                                ? [...couponForm.applicable_categories, category.name]
                                : couponForm.applicable_categories.filter((name) => name !== category.name),
                            })}
                          /> {category.name}
                        </label>
                      ))}
                    </div>
                    <small>Leave all unchecked to apply to every regular-price product.</small>
                  </fieldset>
                </div>

                <div className="shop-admin-form-footer">
                  <label className="shop-admin-check">
                    <input
                      type="checkbox"
                      checked={couponForm.is_active}
                      onChange={(e) => setCouponForm({ ...couponForm, is_active: e.target.checked })}
                    /> Active Coupon
                  </label>
                  <button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : editingCoupon ? 'Save Coupon' : 'Create Coupon'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCoupon(null);
                      setCouponForm(blankCoupon);
                      setShowCouponForm(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* ── ALL COUPONS TABLE ── */
            <>
              <div className="shop-admin-heading">
                <div>
                  <h2>All Coupons & Promo Codes</h2>
                  <p>Customer-entered promo vouchers (e.g. SAVE60, PROMO900) applied during checkout.</p>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCouponForm(true);
                      setEditingCoupon(null);
                      setCouponForm(blankCoupon);
                    }}
                    style={{
                      background: 'var(--brand-blue, #2563eb)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '8px 16px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 13,
                    }}
                  >
                    <Plus size={16} /> Create Coupon
                  </button>
                  <button type="button" onClick={loadAll} disabled={loading}>
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
                  </button>
                </div>
              </div>

              <div className="shop-admin-card">
                <h3>All Coupons ({coupons.length})</h3>
                {!coupons.length ? (
                  <p>No coupons created yet.</p>
                ) : (
                  <div className="shop-admin-table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Coupon Code</th>
                          <th>Offer</th>
                          <th>Minimum</th>
                          <th>Categories</th>
                          <th>Schedule</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {coupons.map((coupon) => (
                          <tr key={coupon.id}>
                            <td>
                              <strong>{coupon.code || 'Automatic offer'}</strong>
                            </td>
                            <td>
                              {coupon.discount_type === 'percentage'
                                ? `${coupon.discount_value}%${Number(coupon.max_discount_cap) > 0 ? ` up to ₹${coupon.max_discount_cap}` : ''}`
                                : `₹${coupon.discount_value} off`}
                            </td>
                            <td>₹{coupon.min_cart_value}</td>
                            <td>
                              {coupon.applicable_categories?.length
                                ? coupon.applicable_categories.join(', ')
                                : 'All regular items'}
                            </td>
                            <td>
                              {coupon.start_date || coupon.end_date
                                ? `${coupon.start_date || 'Now'} – ${coupon.end_date || 'No end date'}`
                                : 'Always'}
                            </td>
                            <td>
                              <span className={coupon.is_active ? 'shop-promo-status-active' : 'shop-promo-status-inactive'}>
                                {coupon.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td>
                              <div className="shop-admin-actions">
                                <button type="button" onClick={() => editCouponItem(coupon)}>Edit</button>
                                <button type="button" onClick={() => deleteCoupon(coupon)}>Delete</button>
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
        </>
      )}
    </section>
  );
}
