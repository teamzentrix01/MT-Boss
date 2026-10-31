'use client';

import React, { Fragment, useEffect, useMemo, useState } from 'react';
import {
  Truck,
  Layers,
  Settings as SettingsIcon,
  Calculator as CalcIcon,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  MapPin,
  RefreshCw,
  Info,
} from 'lucide-react';
import {
  calculateShipping,
  DEFAULT_QUANTITY_SHIPPING_RULES,
  validateQuantityRules,
} from '@/lib/shipping-calc';

const headers = { 'Content-Type': 'application/json' };
const blankCore = { city_name: '', fixed_cost: 0, is_active: true };
const blankDistance = { from_city: '', to_city: '', distance_km: 0, is_active: true };

export default function ShippingSettingsManager({ vendor = false, supplier = false, city = '' }) {
  const isPartner = Boolean(vendor || supplier);
  const [activeTab, setActiveTab] = useState(isPartner ? 'quantity_rules' : 'city_distance');
  const [settings, setSettings] = useState(null);
  const [shopCategories, setShopCategories] = useState([]);
  const [notice, setNotice] = useState('');
  const [noticeType, setNoticeType] = useState('info'); // 'info' | 'success' | 'error'
  const [saving, setSaving] = useState(false);
  const [expandedCats, setExpandedCats] = useState(new Set());

  // Category addition modal / form state
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatUnit, setNewCatUnit] = useState('bag');
  const [newCatMaxTrip, setNewCatMaxTrip] = useState(100);
  const [newCatCap, setNewCatCap] = useState(5000);

  // New city addition inside expanded category
  const [addingCityToCatId, setAddingCityToCatId] = useState(null);
  const [newCityName, setNewCityName] = useState('');
  const [newCityBase, setNewCityBase] = useState(500);
  const [newCityExtra, setNewCityExtra] = useState(5);

  // Calculator Tab state
  const [calcCategory, setCalcCategory] = useState('');
  const [calcCity, setCalcCity] = useState('');
  const [calcQty, setCalcQty] = useState(100);
  const [calcOrderValue, setCalcOrderValue] = useState(0);

  const authHeaders = useMemo(() => {
    const token =
      typeof window === 'undefined'
        ? ''
        : localStorage.getItem(vendor ? 'vendor-token' : 'admin-token') ||
          localStorage.getItem('token') ||
          '';
    return { ...headers, Authorization: `Bearer ${token}` };
  }, [vendor]);

  // Load shipping settings & shop categories
  useEffect(() => {
    fetch('/api/shipping-settings', { headers: authHeaders })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const s = data.data;
          if (!s.quantityRules || !Array.isArray(s.quantityRules.categories)) {
            s.quantityRules = DEFAULT_QUANTITY_SHIPPING_RULES;
          }
          setSettings(s);
          // Auto-expand first 2 categories
          const initialExpanded = new Set();
          (s.quantityRules.categories || []).slice(0, 2).forEach((c) => {
            if (c.id || c.category) initialExpanded.add(c.id || c.category);
          });
          setExpandedCats(initialExpanded);
        } else {
          setNotice(data.error || 'Could not load shipping settings');
          setNoticeType('error');
        }
      })
      .catch(() => {
        setNotice('Could not load shipping settings');
        setNoticeType('error');
      });

    fetch('/api/shop-categories')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setShopCategories(data.data);
        }
      })
      .catch(() => {});
  }, [authHeaders]);

  // Set default calculator values once settings load
  useEffect(() => {
    if (settings && !calcCategory) {
      const firstCat = settings.quantityRules?.categories?.[0]?.category || '';
      setCalcCategory(firstCat);
      const firstCity =
        settings.coreCities?.[0]?.city_name ||
        Object.keys(settings.quantityRules?.categories?.[0]?.cities || {})[0] ||
        'Moradabad';
      setCalcCity(firstCity);
    }
  }, [settings, calcCategory]);

  const update = (key, value) => setSettings((current) => ({ ...current, [key]: value }));

  const toggleExpand = (catId) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  };

  // ── Validation before save ────────────────────────────────────────────────
  const validateBeforeSave = () => {
    if (!settings) return 'Settings not loaded';

    // Core cities validation
    if (
      (settings.coreCities || []).some(
        (row) =>
          !String(row.city_name || '').trim() ||
          !Number.isFinite(Number(row.fixed_cost)) ||
          Number(row.fixed_cost) < 0
      )
    ) {
      return 'Each core city must have a valid name and a non-negative fixed cost (≥ 0)';
    }

    // Distances validation
    if (
      (settings.distances || []).some(
        (row) =>
          !String(row.from_city || '').trim() ||
          !String(row.to_city || '').trim() ||
          String(row.from_city).trim().toLowerCase() === String(row.to_city).trim().toLowerCase() ||
          !Number.isFinite(Number(row.distance_km)) ||
          Number(row.distance_km) < 0
      )
    ) {
      return 'Each distance route must have two different cities and a non-negative distance (≥ 0)';
    }

    // Distance and free rule validation
    if (
      !Number.isFinite(Number(settings.distanceRule?.rate_per_km)) ||
      Number(settings.distanceRule.rate_per_km) < 0
    ) {
      return 'Distance rate per km must be a non-negative number (≥ 0)';
    }

    if (
      !Number.isFinite(Number(settings.freeRule?.min_order_value)) ||
      Number(settings.freeRule.min_order_value) < 0
    ) {
      return 'Free shipping minimum order value must be a non-negative number (≥ 0)';
    }

    // Quantity rules validation
    try {
      validateQuantityRules(settings.quantityRules);
    } catch (err) {
      return err.message;
    }

    return null;
  };

  const save = async () => {
    const errorMsg = validateBeforeSave();
    if (errorMsg) {
      setNotice(errorMsg);
      setNoticeType('error');
      return;
    }

    setSaving(true);
    setNotice('');
    try {
      const res = await fetch('/api/shipping-settings', {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setSettings(data.data);
      setNotice('Shipping settings saved successfully.');
      setNoticeType('success');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('shippingSettingsUpdated'));
      }
    } catch (error) {
      setNotice(error.message || 'Could not save shipping settings');
      setNoticeType('error');
    } finally {
      setSaving(false);
    }
  };

  // ── Category Rule Actions ──────────────────────────────────────────────────
  const handleToggleCategory = (catId, enabled) => {
    const updated = (settings.quantityRules.categories || []).map((c) =>
      (c.id || c.category) === catId ? { ...c, enabled } : c
    );
    update('quantityRules', { ...settings.quantityRules, categories: updated });
  };

  const handleUpdateCategoryField = (catId, field, val) => {
    const updated = (settings.quantityRules.categories || []).map((c) =>
      (c.id || c.category) === catId ? { ...c, [field]: val } : c
    );
    update('quantityRules', { ...settings.quantityRules, categories: updated });
  };

  const handleRemoveCategory = (catId) => {
    if (!confirm('Are you sure you want to remove this category rule?')) return;
    const updated = (settings.quantityRules.categories || []).filter(
      (c) => (c.id || c.category) !== catId
    );
    update('quantityRules', { ...settings.quantityRules, categories: updated });
  };

  const handleAddCategorySubmit = () => {
    const catName = String(newCatName || '').trim();
    if (!catName) {
      alert('Please enter or select a category name');
      return;
    }

    // Check if category already exists
    const exists = (settings.quantityRules.categories || []).some(
      (c) => String(c.category || '').trim().toLowerCase() === catName.toLowerCase()
    );
    if (exists) {
      alert(`Category "${catName}" already has a quantity rule.`);
      return;
    }

    // Seed default cities based on core cities or Moradabad/Bareilly
    const defaultCities = {};
    if (settings.coreCities && settings.coreCities.length > 0) {
      settings.coreCities.forEach((c) => {
        defaultCities[c.city_name] = { base_charge: 500, extra_unit_rate: 5 };
      });
    } else {
      defaultCities['Moradabad'] = { base_charge: 500, extra_unit_rate: 5 };
      defaultCities['Bareilly'] = { base_charge: 800, extra_unit_rate: 8 };
    }

    const newRule = {
      id: catName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      category: catName,
      unit: newCatUnit.trim() || 'bag',
      enabled: true,
      cap: Math.max(0, Number(newCatCap) || 0),
      max_units_per_trip: Math.max(0, Number(newCatMaxTrip) || 100),
      cities: defaultCities,
    };

    const updated = [...(settings.quantityRules.categories || []), newRule];
    update('quantityRules', { ...settings.quantityRules, categories: updated });
    setExpandedCats((prev) => new Set(prev).add(newRule.id));

    // Reset modal
    setNewCatName('');
    setShowAddCatModal(false);
  };

  // City-wise rate updates inside a category
  const handleUpdateCityRate = (catId, cityName, field, val) => {
    const updated = (settings.quantityRules.categories || []).map((c) => {
      if ((c.id || c.category) !== catId) return c;
      const currentCities = { ...(c.cities || {}) };
      const currentRate = { ...(currentCities[cityName] || { base_charge: 0, extra_unit_rate: 0 }) };
      currentRate[field] = val;
      currentCities[cityName] = currentRate;
      return { ...c, cities: currentCities };
    });
    update('quantityRules', { ...settings.quantityRules, categories: updated });
  };

  const handleRemoveCityFromCat = (catId, cityName) => {
    const updated = (settings.quantityRules.categories || []).map((c) => {
      if ((c.id || c.category) !== catId) return c;
      const currentCities = { ...(c.cities || {}) };
      delete currentCities[cityName];
      return { ...c, cities: currentCities };
    });
    update('quantityRules', { ...settings.quantityRules, categories: updated });
  };

  const handleAddCityToCatSubmit = (catId) => {
    const cName = String(newCityName || '').trim();
    if (!cName) {
      alert('Please select or enter a city name');
      return;
    }

    const updated = (settings.quantityRules.categories || []).map((c) => {
      if ((c.id || c.category) !== catId) return c;
      const currentCities = { ...(c.cities || {}) };
      currentCities[cName] = {
        base_charge: Math.max(0, Number(newCityBase) || 0),
        extra_unit_rate: Math.max(0, Number(newCityExtra) || 0),
      };
      return { ...c, cities: currentCities };
    });

    update('quantityRules', { ...settings.quantityRules, categories: updated });
    setAddingCityToCatId(null);
    setNewCityName('');
  };

  // ── Calculator Evaluation ─────────────────────────────────────────────────
  const calcResult = useMemo(() => {
    if (!settings || !calcCategory || !calcCity) return null;
    const catRule = (settings.quantityRules?.categories || []).find(
      (c) => String(c.category || '').trim().toLowerCase() === String(calcCategory).trim().toLowerCase()
    );

    const items = [
      {
        product_id: 1,
        category: calcCategory,
        unit: catRule?.unit || 'unit',
        quantity: Math.max(1, Number(calcQty) || 1),
        price: Number(calcOrderValue) > 0 ? Number(calcOrderValue) : 100,
        source_city: calcCity,
      },
    ];

    return calculateShipping({ items, customerCity: calcCity, settings });
  }, [settings, calcCategory, calcCity, calcQty, calcOrderValue]);

  if (!settings) {
    return (
      <div className="shipping-loading">
        <RefreshCw className="spin-icon" size={20} />
        <p>Loading shipping settings...</p>
      </div>
    );
  }

  // ── VENDOR READ-ONLY VIEW OR ADMIN VIEW ────────────────────────────────────
  const ownCity = vendor
    ? settings.coreCities?.find(
        (row) => row.is_active && row.city_name.trim().toLowerCase() === String(city).trim().toLowerCase()
      )
    : null;
  const activeCats = vendor
    ? (settings.quantityRules?.categories || []).filter((c) => c.enabled !== false)
    : [];

  return (
    <section className="shop-admin-root shop-admin-panel">
      {isPartner ? (
        <>
          <div className="shop-admin-heading">
            <div>
              <h2>Shipping Settings (Vendor View)</h2>
              <p>Platform-wide shipping rules are set by the MTBOSS Admin.</p>
            </div>
          </div>

          {notice && <p className={`shop-admin-notice ${noticeType}`}>{notice}</p>}

          <div className="vendor-summary-grid">
            <div className="shop-admin-card stat-card">
              <h4>Your City Fixed Rate</h4>
              <strong>
                {ownCity ? `₹${ownCity.fixed_cost} (${ownCity.city_name})` : 'Not configured as core city'}
              </strong>
              <small>Applies to same-city deliveries when no quantity rule matches.</small>
            </div>

            <div className="shop-admin-card stat-card">
              <h4>Cross-City Distance Rate</h4>
              <strong>
                {settings.distanceRule?.is_active ? `₹${settings.distanceRule.rate_per_km}/km` : 'Disabled'}
              </strong>
              <small>Calculated on actual route distance.</small>
            </div>

            <div className="shop-admin-card stat-card">
              <h4>Free Shipping Threshold</h4>
              <strong>
                {settings.freeRule?.is_active
                  ? `₹${Number(settings.freeRule.min_order_value).toLocaleString('en-IN')}+`
                  : 'Disabled'}
              </strong>
              <small>
                {settings.freeRule?.applicable_only_to_same_city ? 'Same-city orders only' : 'All orders'}
              </small>
            </div>
          </div>

          <div className="shop-admin-card">
            <div className="card-header-row">
              <div>
                <h3>Category Quantity-Based Shipping Rules</h3>
                <p>These rates are charged automatically based on customer order quantity.</p>
              </div>
              {settings.quantityRules?.minimum_shipping > 0 && (
                <span className="badge-info">
                  Min order shipping: ₹{Number(settings.quantityRules.minimum_shipping).toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <div className="table-responsive">
              <table className="rules-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Unit</th>
                    <th>Max Per Trip</th>
                    <th>Trip Cap</th>
                    <th>City Rates (Base + Extra/unit)</th>
                  </tr>
                </thead>
                <tbody>
                  {activeCats.map((cat) => {
                    const cityEntries = Object.entries(cat.cities || {});
                    return (
                      <tr key={cat.id || cat.category}>
                        <td>
                          <strong>{cat.category}</strong>
                        </td>
                        <td>{cat.unit}</td>
                        <td>{cat.max_units_per_trip || 'Single trip'}</td>
                        <td>{cat.cap > 0 ? `₹${Number(cat.cap).toLocaleString('en-IN')}` : 'No Cap'}</td>
                        <td>
                          <div className="city-chips-wrap">
                            {cityEntries.map(([cName, rate]) => {
                              const isOwnCity = cName.trim().toLowerCase() === String(city).trim().toLowerCase();
                              return (
                                <span
                                  key={cName}
                                  className={`city-rate-chip ${isOwnCity ? 'is-own-city' : ''}`}
                                >
                                  <b>{cName}:</b> ₹{rate.base_charge} base + ₹{rate.extra_unit_rate}/unit
                                  {isOwnCity && <em className="own-tag"> (Your City)</em>}
                                </span>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="shop-admin-heading">
            <div>
              <h2>Shipping Settings</h2>
          <p>Configure category quantity rules, city & distance delivery rates, and platform thresholds.</p>
        </div>
        <div className="header-actions">
          <button type="button" className="save-btn" onClick={save} disabled={saving}>
            {saving ? 'Saving Changes...' : 'Save Shipping Settings'}
          </button>
        </div>
      </div>

      {notice && (
        <div className={`shop-admin-notice ${noticeType}`}>
          {noticeType === 'success' ? (
            <CheckCircle size={18} />
          ) : noticeType === 'error' ? (
            <AlertCircle size={18} />
          ) : (
            <Info size={18} />
          )}
          <span>{notice}</span>
        </div>
      )}

      {/* ── Tab Navigation ───────────────────────────────────────────────── */}
      <div className="shipping-tabs-bar">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'city_distance' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('city_distance')}
        >
          <MapPin size={17} />
          <span>City & Distance</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'quantity_rules' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('quantity_rules')}
        >
          <Layers size={17} />
          <span>Quantity Rules</span>
          <span className="tab-pill">
            {(settings.quantityRules?.categories || []).filter((c) => c.enabled !== false).length}
          </span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'global_settings' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('global_settings')}
        >
          <SettingsIcon size={17} />
          <span>Global Settings</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'calculator' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('calculator')}
        >
          <CalcIcon size={17} />
          <span>Calculator</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 1: CITY & DISTANCE (UNCHANGED CORE LOGIC)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'city_distance' && (
        <div className="tab-content">
          <div className="shop-admin-card">
            <h3>Core City Fixed Rates</h3>
            <p className="card-subtext">
              Fixed shipping rates charged for same-city orders when items fall back to city delivery.
            </p>
            {(settings.coreCities || []).map((row, index) => (
              <div className="shipping-row" key={`${row.city_name}-${index}`}>
                <input
                  value={row.city_name}
                  placeholder="City"
                  onChange={(e) =>
                    update(
                      'coreCities',
                      (settings.coreCities || []).map((item, i) =>
                        i === index ? { ...item, city_name: e.target.value } : item
                      )
                    )
                  }
                />
                <input
                  type="number"
                  min="0"
                  value={row.fixed_cost}
                  placeholder="Fixed Cost (₹)"
                  onChange={(e) =>
                    update(
                      'coreCities',
                      (settings.coreCities || []).map((item, i) =>
                        i === index ? { ...item, fixed_cost: e.target.value } : item
                      )
                    )
                  }
                />
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={row.is_active}
                    onChange={(e) =>
                      update(
                        'coreCities',
                        (settings.coreCities || []).map((item, i) =>
                          i === index ? { ...item, is_active: e.target.checked } : item
                        )
                      )
                    }
                  />{' '}
                  Active
                </label>
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() =>
                    update(
                      'coreCities',
                      settings.coreCities.filter((_, i) => i !== index)
                    )
                  }
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="add-inline-btn"
              onClick={() => update('coreCities', [...settings.coreCities, blankCore])}
            >
              <Plus size={15} /> Add core city
            </button>
          </div>

          <div className="shop-admin-card">
            <h3>Distance-based Rate</h3>
            <div className="shipping-row">
              <label>
                Rate (₹ per km)
                <input
                  type="number"
                  min="0"
                  value={settings.distanceRule?.rate_per_km ?? 10}
                  onChange={(e) =>
                    update('distanceRule', { ...settings.distanceRule, rate_per_km: e.target.value })
                  }
                />
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.distanceRule?.is_active ?? true}
                  onChange={(e) =>
                    update('distanceRule', { ...settings.distanceRule, is_active: e.target.checked })
                  }
                />{' '}
                Active
              </label>
            </div>

            <h3 style={{ marginTop: '22px' }}>City-to-city distance lookup</h3>
            <p className="card-subtext">Pre-configured highway distances between supplier and buyer cities.</p>
            {(settings.distances || []).map((row, index) => (
              <div className="shipping-row" key={`${row.from_city}-${row.to_city}-${index}`}>
                <input
                  value={row.from_city}
                  placeholder="From city"
                  onChange={(e) =>
                    update(
                      'distances',
                      (settings.distances || []).map((item, i) =>
                        i === index ? { ...item, from_city: e.target.value } : item
                      )
                    )
                  }
                />
                <input
                  value={row.to_city}
                  placeholder="To city"
                  onChange={(e) =>
                    update(
                      'distances',
                      (settings.distances || []).map((item, i) =>
                        i === index ? { ...item, to_city: e.target.value } : item
                      )
                    )
                  }
                />
                <input
                  type="number"
                  min="0"
                  value={row.distance_km}
                  placeholder="Distance (km)"
                  onChange={(e) =>
                    update(
                      'distances',
                      (settings.distances || []).map((item, i) =>
                        i === index ? { ...item, distance_km: e.target.value } : item
                      )
                    )
                  }
                />
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={row.is_active}
                    onChange={(e) =>
                      update(
                        'distances',
                        (settings.distances || []).map((item, i) =>
                          i === index ? { ...item, is_active: e.target.checked } : item
                        )
                      )
                    }
                  />{' '}
                  Active
                </label>
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() =>
                    update(
                      'distances',
                      settings.distances.filter((_, i) => i !== index)
                    )
                  }
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="add-inline-btn"
              onClick={() => update('distances', [...settings.distances, blankDistance])}
            >
              <Plus size={15} /> Add route
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 2: QUANTITY RULES
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'quantity_rules' && (
        <div className="tab-content">
          <div className="shop-admin-card">
            <div className="card-header-row">
              <div>
                <h3>Category Quantity Rules</h3>
                <p className="card-subtext">
                  Formula: <code>Trips = ceil(Qty / MaxPerTrip)</code>. Shipping ={' '}
                  <code>Trips × Base + (Qty − Trips) × Extra</code> (capped at Cap).
                </p>
              </div>
              <button
                type="button"
                className="add-category-btn"
                onClick={() => setShowAddCatModal(true)}
              >
                <Plus size={16} /> Add Category Rule
              </button>
            </div>

            {/* Modal / Inline Add Category Form */}
            {showAddCatModal && (
              <div className="add-cat-banner">
                <h4>Add Category Quantity Rule</h4>
                <div className="add-cat-grid">
                  <label>
                    Pick Shop Category
                    <select
                      value={newCatName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNewCatName(val);
                        const matched = shopCategories.find((sc) => sc.name === val);
                        if (matched?.unit) setNewCatUnit(matched.unit);
                      }}
                    >
                      <option value="">-- Choose Category or type custom --</option>
                      {shopCategories.map((sc) => (
                        <option key={sc.id} value={sc.name}>
                          {sc.name} ({sc.unit || 'no unit'})
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Or Custom Category Name
                    <input
                      type="text"
                      placeholder="e.g. Electrical"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                    />
                  </label>

                  <label>
                    Unit (Required)
                    <input
                      type="text"
                      placeholder="e.g. bag, pcs, kg"
                      value={newCatUnit}
                      onChange={(e) => setNewCatUnit(e.target.value)}
                    />
                  </label>

                  <label>
                    Max Units Per Trip
                    <input
                      type="number"
                      min="0"
                      value={newCatMaxTrip}
                      onChange={(e) => setNewCatMaxTrip(e.target.value)}
                    />
                  </label>

                  <label>
                    Category Cap (₹, 0 for none)
                    <input
                      type="number"
                      min="0"
                      value={newCatCap}
                      onChange={(e) => setNewCatCap(e.target.value)}
                    />
                  </label>
                </div>

                <div className="modal-actions-row">
                  <button type="button" className="confirm-btn" onClick={handleAddCategorySubmit}>
                    Add Category
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowAddCatModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Category Rules Table */}
            <div className="table-responsive">
              <table className="rules-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}></th>
                    <th>Category</th>
                    <th>Unit</th>
                    <th>Status</th>
                    <th>Max / Trip</th>
                    <th>Cap (₹)</th>
                    <th>Configured Cities</th>
                    <th style={{ width: '80px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(settings.quantityRules?.categories || []).map((cat) => {
                    const catId = cat.id || cat.category;
                    const isExpanded = expandedCats.has(catId);
                    const cityList = Object.keys(cat.cities || {});

                    return (
                      <Fragment key={catId}>
                        <tr className={`category-row ${isExpanded ? 'is-expanded' : ''}`}>
                          <td>
                            <button
                              type="button"
                              className="expand-toggle-btn"
                              onClick={() => toggleExpand(catId)}
                              title={isExpanded ? 'Collapse city rates' : 'Expand city rates'}
                            >
                              {isExpanded ? <ChevronDown size={17} /> : <ChevronRight size={17} />}
                            </button>
                          </td>
                          <td>
                            <strong>{cat.category}</strong>
                          </td>
                          <td>
                            <input
                              className="table-input sm"
                              value={cat.unit || ''}
                              placeholder="Unit"
                              onChange={(e) =>
                                handleUpdateCategoryField(catId, 'unit', e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <label className="toggle-switch">
                              <input
                                type="checkbox"
                                checked={cat.enabled !== false}
                                onChange={(e) => handleToggleCategory(catId, e.target.checked)}
                              />
                              <span className="toggle-slider"></span>
                              <span className="toggle-text">
                                {cat.enabled !== false ? 'Enabled' : 'Disabled'}
                              </span>
                            </label>
                          </td>
                          <td>
                            <input
                              type="number"
                              min="0"
                              className="table-input sm"
                              value={cat.max_units_per_trip ?? 100}
                              onChange={(e) =>
                                handleUpdateCategoryField(catId, 'max_units_per_trip', e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              min="0"
                              className="table-input sm"
                              value={cat.cap ?? 0}
                              placeholder="0 (no cap)"
                              onChange={(e) =>
                                handleUpdateCategoryField(catId, 'cap', e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <span className="cities-count-pill" onClick={() => toggleExpand(catId)}>
                              {cityList.length} {cityList.length === 1 ? 'city' : 'cities'} rates{' '}
                              <ChevronDown size={13} />
                            </span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              className="remove-btn"
                              title="Delete category rule"
                              onClick={() => handleRemoveCategory(catId)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>

                        {/* Collapsible City Rates Drawer */}
                        {isExpanded && (
                          <tr className="expanded-rates-tr">
                            <td colSpan="8">
                              <div className="city-rates-drawer">
                                <div className="drawer-header">
                                  <h4>City-wise Base & Extra Unit Rates for “{cat.category}”</h4>
                                  <button
                                    type="button"
                                    className="add-city-btn"
                                    onClick={() => {
                                      setAddingCityToCatId(catId);
                                      setNewCityName(settings.coreCities?.[0]?.city_name || 'Moradabad');
                                    }}
                                  >
                                    <Plus size={14} /> Add City Rate
                                  </button>
                                </div>

                                {/* Inline Add City Rate Form */}
                                {addingCityToCatId === catId && (
                                  <div className="add-city-inline-box">
                                    <label>
                                      City:
                                      <select
                                        value={newCityName}
                                        onChange={(e) => setNewCityName(e.target.value)}
                                      >
                                        <option value="">-- Choose city or type below --</option>
                                        {(settings.coreCities || []).map((c) => (
                                          <option key={c.city_name} value={c.city_name}>
                                            {c.city_name}
                                          </option>
                                        ))}
                                      </select>
                                    </label>
                                    <label>
                                      Or Custom City:
                                      <input
                                        type="text"
                                        placeholder="City Name"
                                        value={newCityName}
                                        onChange={(e) => setNewCityName(e.target.value)}
                                      />
                                    </label>
                                    <label>
                                      Base Charge (₹):
                                      <input
                                        type="number"
                                        min="0"
                                        value={newCityBase}
                                        onChange={(e) => setNewCityBase(e.target.value)}
                                      />
                                    </label>
                                    <label>
                                      Extra Unit Rate (₹/{cat.unit || 'unit'}):
                                      <input
                                        type="number"
                                        min="0"
                                        value={newCityExtra}
                                        onChange={(e) => setNewCityExtra(e.target.value)}
                                      />
                                    </label>
                                    <button
                                      type="button"
                                      className="confirm-btn sm"
                                      onClick={() => handleAddCityToCatSubmit(catId)}
                                    >
                                      Save City
                                    </button>
                                    <button
                                      type="button"
                                      className="cancel-btn sm"
                                      onClick={() => setAddingCityToCatId(null)}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                )}

                                {/* City rates table */}
                                <table className="inner-city-table">
                                  <thead>
                                    <tr>
                                      <th>City Name</th>
                                      <th>Base Charge (₹)</th>
                                      <th>Extra Rate (₹ per extra {cat.unit || 'unit'})</th>
                                      <th style={{ width: '60px' }}>Remove</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {Object.entries(cat.cities || {}).map(([cName, rate]) => (
                                      <tr key={cName}>
                                        <td>
                                          <div className="city-cell">
                                            <MapPin size={14} />
                                            <span>{cName}</span>
                                          </div>
                                        </td>
                                        <td>
                                          <div className="input-with-symbol">
                                            <span>₹</span>
                                            <input
                                              type="number"
                                              min="0"
                                              value={rate.base_charge ?? 0}
                                              onChange={(e) =>
                                                handleUpdateCityRate(
                                                  catId,
                                                  cName,
                                                  'base_charge',
                                                  e.target.value
                                                )
                                              }
                                            />
                                          </div>
                                        </td>
                                        <td>
                                          <div className="input-with-symbol">
                                            <span>₹</span>
                                            <input
                                              type="number"
                                              min="0"
                                              value={rate.extra_unit_rate ?? 0}
                                              onChange={(e) =>
                                                handleUpdateCityRate(
                                                  catId,
                                                  cName,
                                                  'extra_unit_rate',
                                                  e.target.value
                                                )
                                              }
                                            />
                                          </div>
                                        </td>
                                        <td>
                                          <button
                                            type="button"
                                            className="remove-btn sm"
                                            title={`Remove ${cName} rate`}
                                            onClick={() => handleRemoveCityFromCat(catId, cName)}
                                          >
                                            <Trash2 size={14} />
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                    {Object.keys(cat.cities || {}).length === 0 && (
                                      <tr>
                                        <td colSpan="4" className="empty-rates-td">
                                          No city rates defined yet. Click “+ Add City Rate” above.
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}

                  {(settings.quantityRules?.categories || []).length === 0 && (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '30px' }}>
                        No category rules defined. Click “+ Add Category Rule” to create your first rule.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 3: GLOBAL SETTINGS
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'global_settings' && (
        <div className="tab-content">
          <div className="shop-admin-card">
            <h3>Minimum Order Shipping</h3>
            <p className="card-subtext">
              Ensures that if an order has any quantity-based shipping charge, the total will never fall below this
              amount.
            </p>
            <div className="shipping-row">
              <label>
                Minimum Shipping Amount (₹)
                <input
                  type="number"
                  min="0"
                  value={settings.quantityRules?.minimum_shipping ?? 0}
                  onChange={(e) =>
                    update('quantityRules', {
                      ...settings.quantityRules,
                      minimum_shipping: e.target.value,
                    })
                  }
                />
              </label>
            </div>
          </div>

          <div className="shop-admin-card">
            <h3>Free Shipping Threshold</h3>
            <p className="card-subtext">
              Orders meeting or exceeding this threshold receive free shipping across the shop.
            </p>
            <div className="shipping-row">
              <label>
                Minimum order value (₹)
                <input
                  type="number"
                  min="0"
                  value={settings.freeRule?.min_order_value ?? 50000}
                  onChange={(e) =>
                    update('freeRule', { ...settings.freeRule, min_order_value: e.target.value })
                  }
                />
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.freeRule?.applicable_only_to_same_city ?? true}
                  onChange={(e) =>
                    update('freeRule', {
                      ...settings.freeRule,
                      applicable_only_to_same_city: e.target.checked,
                    })
                  }
                />{' '}
                Applies to same-city orders only
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.freeRule?.is_active ?? true}
                  onChange={(e) =>
                    update('freeRule', { ...settings.freeRule, is_active: e.target.checked })
                  }
                />{' '}
                Active
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 4: CALCULATOR (LIVE PREVIEW OF SHARED CALCULATION FUNCTION)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'calculator' && (
        <div className="tab-content">
          <div className="shop-admin-card">
            <div className="card-header-row">
              <div>
                <h3>Shipping Cost Calculator</h3>
                <p className="card-subtext">
                  Uses the exact same server calculation function that is executed during checkout and quote
                  creation.
                </p>
              </div>
            </div>

            <div className="calc-inputs-grid">
              <label>
                Select Category:
                <select value={calcCategory} onChange={(e) => setCalcCategory(e.target.value)}>
                  {(settings.quantityRules?.categories || []).map((c) => (
                    <option key={c.id || c.category} value={c.category}>
                      {c.category} ({c.unit}) {c.enabled === false ? '[Disabled]' : ''}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Delivery City:
                <select value={calcCity} onChange={(e) => setCalcCity(e.target.value)}>
                  {(settings.coreCities || []).map((c) => (
                    <option key={c.city_name} value={c.city_name}>
                      {c.city_name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Order Quantity:
                <input
                  type="number"
                  min="1"
                  value={calcQty}
                  onChange={(e) => setCalcQty(Math.max(1, Number(e.target.value) || 1))}
                />
              </label>

              <label>
                Order Value (₹, optional):
                <input
                  type="number"
                  min="0"
                  value={calcOrderValue}
                  placeholder="e.g. 50000"
                  onChange={(e) => setCalcOrderValue(Math.max(0, Number(e.target.value) || 0))}
                />
              </label>
            </div>

            {/* Live Calculation Output Display */}
            {calcResult && (
              <div className="calc-result-display">
                <div className="calc-result-header">
                  <div className="total-block">
                    <span>Estimated Shipping Charge</span>
                    <strong>
                      {calcResult.totalShipping !== null
                        ? `₹${Number(calcResult.totalShipping).toLocaleString('en-IN')}`
                        : 'Unconfigured Route'}
                    </strong>
                    {calcResult.free && <span className="free-badge">FREE DELIVERY UNLOCKED</span>}
                  </div>
                </div>

                <div className="calc-breakdown-steps">
                  <h4>Step-by-Step Breakdown</h4>
                  <ul className="breakdown-list">
                    {calcResult.breakdown.map((row, idx) => (
                      <li key={idx} className="breakdown-item">
                        <CheckCircle size={16} className="bullet-icon" />
                        <div className="breakdown-text">
                          <strong>{row.label}</strong>
                          {row.trips && (
                            <small>
                              Formula: {row.trips} trips × ₹{row.baseCharge} base + ({row.quantity} - {row.trips}
                              ) × ₹{row.extraRate} extra
                              {row.cap ? ` (Cap: ₹${row.cap.toLocaleString('en-IN')})` : ''}
                            </small>
                          )}
                        </div>
                        <span className="breakdown-price">
                          {row.shippingCost !== null
                            ? `₹${Number(row.shippingCost).toLocaleString('en-IN')}`
                            : 'N/A'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )}

      {/* ── Scoped CSS Styles ────────────────────────────────────────────── */}
      <style jsx>{`
        .shop-admin-panel {
          font-family: inherit;
        }
        .shop-admin-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 14px;
        }
        .shop-admin-heading h2 {
          margin: 0;
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
        }
        .shop-admin-heading p {
          margin: 4px 0 0;
          font-size: 13px;
          color: #64748b;
        }
        .save-btn {
          background: #2563eb !important;
          color: #fff !important;
          font-weight: 700 !important;
          font-size: 13px !important;
          padding: 10px 20px !important;
          border-radius: 8px !important;
          border: 0 !important;
          cursor: pointer;
          transition: background 0.18s ease;
        }
        .save-btn:hover {
          background: #1d4ed8 !important;
        }
        .save-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .shop-admin-notice {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 18px;
        }
        .shop-admin-notice.success {
          background: #ecfdf5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }
        .shop-admin-notice.error {
          background: #fef2f2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }
        .shop-admin-notice.info {
          background: #eff6ff;
          color: #1e40af;
          border: 1px solid #bfdbfe;
        }

        .shipping-tabs-bar {
          display: flex;
          gap: 8px;
          border-bottom: 2px solid #e2e8f0;
          margin-bottom: 22px;
          overflow-x: auto;
        }
        .tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px !important;
          border: 0 !important;
          border-bottom: 2px solid transparent !important;
          margin-bottom: -2px;
          background: transparent !important;
          font-size: 13.5px !important;
          font-weight: 700 !important;
          color: #64748b !important;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.18s ease;
        }
        .tab-btn:hover {
          color: #0f172a !important;
        }
        .tab-btn.is-active {
          color: #2563eb !important;
          border-bottom-color: #2563eb !important;
        }
        .tab-pill {
          background: #dbeafe;
          color: #1e40af;
          font-size: 11px;
          font-weight: 800;
          padding: 1px 7px;
          border-radius: 10px;
        }

        .shop-admin-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 22px;
          margin-bottom: 22px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        .card-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 18px;
        }
        .shop-admin-card h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
        }
        .card-subtext {
          margin: 4px 0 0;
          font-size: 12px;
          color: #64748b;
        }
        .card-subtext code {
          background: #f1f5f9;
          padding: 2px 5px;
          border-radius: 4px;
          font-family: monospace;
          color: #0f172a;
        }

        .shipping-row {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
          margin: 12px 0;
        }
        .shipping-row input:not([type='checkbox']) {
          width: 170px;
          padding: 8px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 13px;
        }
        .shipping-row label {
          display: inline-flex;
          flex-direction: column;
          gap: 4px;
          font-size: 11px;
          font-weight: 700;
          color: #475569;
        }
        .checkbox-label {
          flex-direction: row !important;
          align-items: center;
          gap: 6px !important;
          font-size: 13px !important;
          cursor: pointer;
          margin-top: 18px;
        }

        .add-inline-btn,
        .add-category-btn,
        .add-city-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px !important;
          border-radius: 6px !important;
          border: 1px solid #cbd5e1 !important;
          background: #f8fafc !important;
          color: #1e293b !important;
          font-size: 12.5px !important;
          font-weight: 700 !important;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .add-inline-btn:hover,
        .add-category-btn:hover,
        .add-city-btn:hover {
          background: #f1f5f9 !important;
          border-color: #94a3b8 !important;
        }
        .add-category-btn {
          background: #eff6ff !important;
          border-color: #bfdbfe !important;
          color: #1d4ed8 !important;
        }
        .add-category-btn:hover {
          background: #dbeafe !important;
        }

        .remove-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: 1px solid #fecaca !important;
          background: #fef2f2 !important;
          color: #dc2626 !important;
          border-radius: 6px !important;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .remove-btn:hover {
          background: #fee2e2 !important;
        }
        .remove-btn.sm {
          width: 28px;
          height: 28px;
        }

        /* Table styles */
        .table-responsive {
          overflow-x: auto;
          margin-top: 14px;
        }
        .rules-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        .rules-table th {
          text-align: left;
          background: #f8fafc;
          padding: 10px 12px;
          border-bottom: 2px solid #e2e8f0;
          color: #475569;
          font-weight: 700;
          font-size: 12px;
          white-space: nowrap;
        }
        .rules-table td {
          padding: 10px 12px;
          border-bottom: 1px solid #e2e8f0;
          vertical-align: middle;
        }
        .category-row:hover {
          background: #f8fafc;
        }
        .category-row.is-expanded {
          background: #f1f5f9;
        }

        .expand-toggle-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          background: transparent !important;
          border: 0 !important;
          color: #64748b !important;
          cursor: pointer;
        }

        .table-input {
          padding: 6px 10px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 12.5px;
        }
        .table-input.sm {
          width: 90px;
        }

        .cities-count-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          background: #eff6ff;
          color: #1e40af;
          border-radius: 12px;
          font-size: 11.5px;
          font-weight: 700;
          cursor: pointer;
        }
        .cities-count-pill:hover {
          background: #dbeafe;
        }

        /* Toggle switch */
        .toggle-switch {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          user-select: none;
        }
        .toggle-switch input {
          display: none;
        }
        .toggle-slider {
          position: relative;
          width: 36px;
          height: 20px;
          background-color: #cbd5e1;
          border-radius: 20px;
          transition: 0.2s;
        }
        .toggle-slider:before {
          content: '';
          position: absolute;
          height: 14px;
          width: 14px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          border-radius: 50%;
          transition: 0.2s;
        }
        .toggle-switch input:checked + .toggle-slider {
          background-color: #10b981;
        }
        .toggle-switch input:checked + .toggle-slider:before {
          transform: translateX(16px);
        }
        .toggle-text {
          font-size: 12px;
          font-weight: 700;
          color: #475569;
        }

        /* Collapsible Drawer */
        .expanded-rates-tr td {
          padding: 0 !important;
          background: #f8fafc;
        }
        .city-rates-drawer {
          padding: 16px 20px;
          border-bottom: 2px solid #cbd5e1;
        }
        .drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .drawer-header h4 {
          margin: 0;
          font-size: 13.5px;
          font-weight: 800;
          color: #1e293b;
        }

        .inner-city-table {
          width: 100%;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          border-collapse: collapse;
          font-size: 12.5px;
        }
        .inner-city-table th {
          background: #f1f5f9;
          padding: 8px 12px;
          font-size: 11.5px;
          color: #475569;
          text-align: left;
        }
        .inner-city-table td {
          padding: 8px 12px;
          border-bottom: 1px solid #f1f5f9;
        }
        .city-cell {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          color: #0f172a;
        }
        .input-with-symbol {
          display: inline-flex;
          align-items: center;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          overflow: hidden;
        }
        .input-with-symbol span {
          padding: 0 8px;
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
        }
        .input-with-symbol input {
          border: 0;
          outline: none;
          padding: 6px 8px;
          width: 100px;
          font-size: 12.5px;
          background: transparent;
        }

        .add-city-inline-box {
          display: flex;
          gap: 12px;
          align-items: flex-end;
          flex-wrap: wrap;
          background: #ffffff;
          padding: 12px 14px;
          border: 1px solid #bfdbfe;
          border-radius: 8px;
          margin-bottom: 14px;
        }
        .add-city-inline-box label {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 11px;
          font-weight: 700;
          color: #334155;
        }
        .add-city-inline-box input,
        .add-city-inline-box select {
          padding: 6px 10px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 12px;
        }

        .confirm-btn {
          background: #2563eb !important;
          color: #fff !important;
          padding: 8px 16px !important;
          border-radius: 6px !important;
          border: 0 !important;
          font-weight: 700 !important;
          font-size: 12.5px !important;
          cursor: pointer;
        }
        .confirm-btn.sm {
          padding: 6px 12px !important;
          font-size: 11.5px !important;
        }
        .cancel-btn {
          background: transparent !important;
          color: #64748b !important;
          padding: 8px 14px !important;
          border-radius: 6px !important;
          border: 1px solid #cbd5e1 !important;
          font-weight: 700 !important;
          font-size: 12.5px !important;
          cursor: pointer;
        }
        .cancel-btn.sm {
          padding: 6px 12px !important;
          font-size: 11.5px !important;
        }

        /* Add Category Banner */
        .add-cat-banner {
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          padding: 18px;
          margin-bottom: 20px;
        }
        .add-cat-banner h4 {
          margin: 0 0 14px;
          font-size: 14px;
          font-weight: 800;
          color: #0f172a;
        }
        .add-cat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 14px;
          margin-bottom: 16px;
        }
        .add-cat-grid label {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 11px;
          font-weight: 700;
          color: #334155;
        }
        .add-cat-grid input,
        .add-cat-grid select {
          padding: 8px 10px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 12.5px;
        }
        .modal-actions-row {
          display: flex;
          gap: 10px;
        }

        /* Calculator Styles */
        .calc-inputs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        .calc-inputs-grid label {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          color: #334155;
        }
        .calc-inputs-grid input,
        .calc-inputs-grid select {
          padding: 10px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 13.5px;
        }

        .calc-result-display {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 20px;
        }
        .calc-result-header {
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 16px;
          margin-bottom: 16px;
        }
        .total-block {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .total-block span {
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
        }
        .total-block strong {
          font-size: 32px;
          font-weight: 900;
          color: #0f172a;
        }
        .free-badge {
          display: inline-block;
          background: #10b981;
          color: white;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 800;
          width: fit-content;
        }

        .calc-breakdown-steps h4 {
          margin: 0 0 10px;
          font-size: 13px;
          font-weight: 800;
          color: #334155;
        }
        .breakdown-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .breakdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          margin-bottom: 8px;
        }
        .bullet-icon {
          color: #10b981;
          flex-shrink: 0;
        }
        .breakdown-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .breakdown-text strong {
          font-size: 13px;
          color: #0f172a;
        }
        .breakdown-text small {
          font-size: 11.5px;
          color: #64748b;
        }
        .breakdown-price {
          font-size: 14px;
          font-weight: 800;
          color: #0f172a;
        }

        /* Vendor view specific */
        .vendor-summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
          margin-bottom: 20px;
        }
        .stat-card h4 {
          margin: 0;
          font-size: 12px;
          color: #64748b;
          text-transform: uppercase;
        }
        .stat-card strong {
          display: block;
          margin: 8px 0 4px;
          font-size: 20px;
          color: #0f172a;
        }
        .stat-card small {
          font-size: 11px;
          color: #94a3b8;
        }
        .city-chips-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .city-rate-chip {
          display: inline-block;
          background: #f1f5f9;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11.5px;
          color: #334155;
        }
        .city-rate-chip.is-own-city {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #1e40af;
          font-weight: 700;
        }
        .own-tag {
          color: #2563eb;
          font-weight: 800;
        }

        .shipping-loading {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 40px;
          color: #64748b;
          font-size: 14px;
        }
        .spin-icon {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
}
