'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ShopCategoriesManager from './ShopCategoriesManager';
import ShippingSettingsManager from './ShippingSettingsManager';
import ShopCouponsManager from './ShopCouponsManager';
import ShopCommissionSettingsManager from './ShopCommissionSettingsManager';
import CashbackManager from './CashbackManager';
import VendorCommissionSummary from './VendorCommissionSummary';
import { defaultShopStorefront } from '@/lib/shop-storefront-defaults';
import { QUALITY_TIER_OPTIONS, qualityTierLabel } from '@/lib/quality-tier';
import './ShopNowManager.css';

const units = ['bag', 'bags', 'pcs', 'kg', 'quintal', 'box', 'bundle', 'cft', 'ton', 'meter', 'set', 'bucket'];
const emptyProduct = { name: '', description: '', category: '', subcategory: '', quality_tier: '', quote_price_range: '', price: '', compare_at_price: '', is_featured_deal: false, brand: '', unit: '', quantity: 0, image_url: '', available_cities: [], is_available: true };
const mobileHeaderFields = [
  ['delivery_tagline', 'Delivery Tagline (e.g. 60 Mins delivery)'],
  ['search_placeholder', 'Search Placeholder (e.g. Search for Cement, TMT Bars, Tiles...)'],
  ['trust_badge_1', 'Trust Badge 1 (e.g. Free Delivery)'],
  ['trust_badge_2', 'Trust Badge 2 (e.g. 2% Cashback)'],
  ['trust_badge_3', 'Trust Badge 3 (e.g. Pay on Delivery)'],
  ['trust_badge_4', 'Trust Badge 4 (e.g. 60 Mins Express)'],
];

const mobileBannerFields = [
  ['mobile_banner_pill', 'Top Badge / Pill (e.g. ⚡ Delivered in 60 mins)'],
  ['mobile_banner_subpill', 'Top Sub-badge (e.g. Direct Factory Rates)'],
  ['mobile_banner_title', 'Promo Banner Heading'],
  ['mobile_banner_btn', 'CTA Button Text (e.g. Request Bulk Quote)'],
];

const desktopBannerFields = [
  ['hero_kicker', 'Banner eyebrow'], ['hero_title', 'Banner title'],
  ['hero_highlight', 'Highlighted title'], ['hero_description', 'Banner description'],
  ['hero_badge', 'Image badge text'],
  ['hero_button', 'Banner button'],
  ['categories_heading', 'Categories heading'], ['featured_heading', 'Featured heading'],
  ['deals_heading', 'Deals heading'], ['arrivals_heading', 'New arrivals heading'],
  ['catalog_heading', 'Catalogue heading'], ['footer_tagline', 'Footer tagline'],
];


const shopHeaders = (ownerRole = 'admin') => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${ownerRole === 'vendor'
    ? localStorage.getItem('vendor-token') || ''
    : localStorage.getItem('admin-token') || localStorage.getItem('token') || ''}`,
});

async function readApiJson(response) {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    throw new Error(`Shop product service returned an invalid response (${response.status}). Please refresh after restarting the development server.`);
  }
  return response.json();
}

function notifyShopProductsUpdated() {
  try { localStorage.setItem('mtboss-shop-products-updated', String(Date.now())); }
  catch { /* Same-tab refresh event still keeps Shop Now in sync. */ }
  window.dispatchEvent(new Event('mtbossShopProductsUpdated'));
}

async function uploadImage(file) {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!cloud || !preset) throw new Error('Cloudinary upload is not configured. Paste an image URL instead.');
  const body = new FormData();
  body.append('file', file);
  body.append('upload_preset', preset);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: 'POST', body });
  const data = await response.json();
  if (!response.ok || !data.secure_url) throw new Error(data.error?.message || 'Image upload failed');
  return data.secure_url;
}

function ProductManager({ ownerRole = 'admin', formId = 'shop-product-form' }) {
  const isVendor = ownerRole === 'vendor';
  const productEndpoint = isVendor ? '/api/vendor/shop-products' : '/api/admin/shop-products';
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [galleryText, setGalleryText] = useState('');
  const [specsText, setSpecsText] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState('');
  const [tierFilter, setTierFilter] = useState('any');
  const untieredCount = products.filter((product) => !product.quality_tier).length;
  const visibleProducts = tierFilter === 'any'
    ? products
    : products.filter((product) => (tierFilter === 'none' ? !product.quality_tier : product.quality_tier === tierFilter));

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [productRes, categoryRes, cityRes] = await Promise.all([
        fetch(productEndpoint, { headers: shopHeaders(ownerRole) }),
        fetch(isVendor ? '/api/shop-categories' : '/api/shop-categories?admin=true', { headers: shopHeaders(ownerRole) }),
        fetch('/api/cities'),
      ]);
      const [productData, categoryData, cityData] = await Promise.all([readApiJson(productRes), readApiJson(categoryRes), readApiJson(cityRes)]);
      if (!productRes.ok || !categoryRes.ok || !cityRes.ok) throw new Error(productData.error || categoryData.error || cityData.error || 'Could not load shop data');
      setProducts(productData.data || []);
      setCategories(categoryData.data || []);
      setCities(cityData.cities || []);
    } catch (error) { setNotice(error.message); }
    finally { setLoading(false); }
  }, [isVendor, ownerRole, productEndpoint]);

  useEffect(() => { load(); }, [load]);

  const edit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name || '', description: product.description || '', category: product.category || '', subcategory: product.subcategory || '', quality_tier: product.quality_tier || '',
      quote_price_range: product.quote_price_range || '', price: product.price ?? '', compare_at_price: product.compare_at_price ?? '', is_featured_deal: product.is_featured_deal === true, brand: product.brand || '', unit: product.unit || '', quantity: product.quantity ?? 0,
      image_url: product.image_url || '', available_cities: product.available_cities || [], is_available: product.is_available !== false,
    });
    setGalleryText((product.images || []).join('\n'));
    setSpecsText(Object.entries(product.specifications || {}).map(([key, value]) => `${key}: ${value}`).join('\n'));
    setBulkText((product.bulk_pricing || []).map((tier) => `${tier.min_quantity}: ${tier.price}`).join('\n'));
    setNotice('');
    document.getElementById(formId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const reset = () => { setEditingId(null); setForm(emptyProduct); setGalleryText(''); setSpecsText(''); setBulkText(''); setNotice(''); };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setNotice('');
    try {
      const parseLines = (value) => value.split('\n').map((line) => line.trim()).filter(Boolean);
      const specifications = Object.fromEntries(parseLines(specsText).map((line) => {
        const separator = line.indexOf(':');
        if (separator < 1 || !line.slice(separator + 1).trim()) throw new Error('Specifications: use Name: Value on each line');
        return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
      }));
      const bulk_pricing = parseLines(bulkText).map((line) => {
        const [minimum, price] = line.split(':').map((part) => part.trim());
        if (!minimum || !price || !Number.isInteger(Number(minimum)) || Number(minimum) < 2 || Number(price) <= 0) throw new Error('Bulk prices: use Quantity: Price, for example 10: 415');
        return { min_quantity: Number(minimum), price: Number(price) };
      });
      const response = await fetch(productEndpoint, {
        method: editingId ? 'PUT' : 'POST', headers: shopHeaders(ownerRole),
        body: JSON.stringify({ ...form, images: parseLines(galleryText), specifications, bulk_pricing, ...(editingId ? { id: editingId } : {}) }),
      });
      const data = await readApiJson(response);
      if (!response.ok) throw new Error(data.error || 'Could not save product');
      notifyShopProductsUpdated();
      reset();
      setNotice(editingId ? 'Product updated.' : 'Product added.');
      await load();
    } catch (error) { setNotice(error.message); }
    finally { setSaving(false); }
  };

  const toggle = async (product) => {
    try {
      const response = await fetch(productEndpoint, {
        method: 'PUT', headers: shopHeaders(ownerRole),
        body: JSON.stringify({ id: product.id, action: 'toggle', is_available: !product.is_available }),
      });
      const data = await readApiJson(response);
      if (!response.ok) throw new Error(data.error || 'Could not update product');
      notifyShopProductsUpdated();
      await load();
    } catch (error) { setNotice(error.message); }
  };

  const remove = async (product) => {
    if (!window.confirm(`Delete ${product.name}?`)) return;
    try {
      const response = await fetch(`${productEndpoint}?id=${product.id}`, { method: 'DELETE', headers: shopHeaders(ownerRole) });
      const data = await readApiJson(response);
      if (!response.ok) throw new Error(data.error || 'Could not delete product');
      notifyShopProductsUpdated();
      setNotice('Product deleted.');
      await load();
    } catch (error) { setNotice(error.message); }
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setForm((current) => ({ ...current, image_url: imageUrl }));
    }
    catch (error) { setNotice(error.message); }
    finally { setUploading(false); event.target.value = ''; }
  };

  return <div className="shop-admin-panel">
    <div className="shop-admin-heading"><div><h2>{isVendor ? 'My products' : 'Products'}</h2><p>Every product needs a Get Quote range and a fixed Buy Now price.{!isVendor && ' Supplier and vendor uploads appear here too.'}</p></div><button type="button" onClick={load}>Refresh</button></div>
    {notice && <p className="shop-admin-notice" role="status">{notice}</p>}
    <form id={formId} className="shop-admin-card" onSubmit={save}>
      <h3>{editingId ? 'Edit product' : 'Add product'}</h3>
      <div className="shop-admin-fields">
        <label>Product name *<input required maxLength={255} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label>Category *<select required value={form.category} onChange={(e) => { const cat = categories.find((item) => item.name === e.target.value); setForm({ ...form, category: e.target.value, subcategory: '', unit: cat?.unit || form.unit }); }}><option value="">Select category</option>{categories.map((cat) => <option key={cat.id} value={cat.name}>{cat.name}</option>)}</select></label>
        <label>Subcategory<select value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })}><option value="">Select subcategory</option>{(categories.find((cat) => cat.name === form.category)?.subcategories || []).map((subcategory) => { const name = typeof subcategory === 'object' && subcategory !== null ? subcategory.name : subcategory; return <option key={name} value={name}>{name}</option>; })}</select></label>
        <label>Quality Tier *<select required value={form.quality_tier} onChange={(e) => setForm({ ...form, quality_tier: e.target.value })}><option value="">Select quality tier</option>{QUALITY_TIER_OPTIONS.map((tier) => <option key={tier.value} value={tier.value}>{tier.label}</option>)}</select><small>Used by the Budget Calculator to match this product to a Quality Package.</small></label>
        <label>Get Quote price range (₹) *<input required type="text" maxLength={100} value={form.quote_price_range} onChange={(e) => setForm({ ...form, quote_price_range: e.target.value })} placeholder="Example: 40-80" /><small>Enter a minimum and maximum lump-sum range, e.g. 40-80.</small></label>
        <label>Buy Now fixed price (₹) *<input required type="number" min="0.01" max="99999999.99" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Example: 60" /></label>
        <label>Original price (₹, optional)<input type="number" min="0" step="0.01" value={form.compare_at_price} onChange={(e) => setForm({ ...form, compare_at_price: e.target.value })} placeholder="Shows discount when above selling price" /><small>A discount badge is calculated automatically when this is above the Buy Now price.</small></label>
        <label>Brand<input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="e.g. UltraTech" /></label>
        <label>Unit *<select required value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}><option value="">Select unit</option>{units.map((unit) => <option key={unit} value={unit}>{unit}</option>)}</select></label>
        <label>Quantity available<input type="number" min="0" step="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></label>
        <label>Product image URL<input type="text" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://... or /uploads/..." /></label>
        <label className="shop-admin-wide">Description<textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
        <label className="shop-admin-wide">More product images (one URL per line)<textarea rows="3" value={galleryText} onChange={(e) => setGalleryText(e.target.value)} /></label>
        <label className="shop-admin-wide">Specifications (one Name: Value per line)<textarea rows="3" value={specsText} onChange={(e) => setSpecsText(e.target.value)} placeholder="Grade: PPC&#10;Pack size: 50 kg" /></label>
        <label className="shop-admin-wide">Bulk prices (one Quantity: Price per line)<textarea rows="3" value={bulkText} onChange={(e) => setBulkText(e.target.value)} placeholder="10: 415&#10;30: 405" /></label>
        <fieldset className="shop-admin-wide shop-admin-city-field"><legend>Delivery cities for this product</legend><div>{cities.map((city) => <label key={city}><input type="checkbox" checked={form.available_cities.includes(city)} onChange={(event) => setForm({ ...form, available_cities: event.target.checked ? [...form.available_cities, city] : form.available_cities.filter((item) => item !== city) })} /> {city}</label>)}</div><small>Select the cities where this product can actually be delivered.</small></fieldset>
      </div>
      <div className="shop-admin-form-footer"><label className="shop-admin-check"><input type="checkbox" checked={form.is_available} onChange={(e) => setForm({ ...form, is_available: e.target.checked })} /> Show on Shop Now</label><label className="shop-admin-check"><input type="checkbox" checked={form.is_featured_deal} onChange={(e) => setForm({ ...form, is_featured_deal: e.target.checked })} /> Feature in Deals of the Week</label><label className="shop-admin-upload">{uploading ? 'Uploading...' : 'Upload image'}<input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} hidden /></label>{form.image_url && <Image className="shop-admin-thumb" src={form.image_url} alt="Product preview" width={43} height={43} unoptimized />}<button type="submit" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Save changes' : 'Add product'}</button>{editingId && <button type="button" onClick={reset}>Cancel</button>}</div>
    </form>
    <div className="shop-admin-card"><div className="shop-admin-list-head"><h3>{isVendor ? 'My products' : 'All products'} ({tierFilter === 'any' ? products.length : `${visibleProducts.length} of ${products.length}`})</h3><label className="shop-admin-tier-filter">Quality Tier<select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)}><option value="any">All products</option><option value="none">No Quality Tier set ({untieredCount})</option>{QUALITY_TIER_OPTIONS.map((tier) => <option key={tier.value} value={tier.value}>{tier.value === 'all' ? 'All tiers' : tier.label}</option>)}</select></label></div>{loading ? <p>Loading products...</p> : !products.length ? <p>No products yet. Add the first product above.</p> : !visibleProducts.length ? <p>No products match this Quality Tier filter.</p> : <div className="shop-admin-table-wrap"><table><thead><tr><th>Product</th><th>Category</th><th>Quality</th><th>Get Quote range</th><th>Buy Now price / unit</th>{!isVendor && <th>Discount</th>}{!isVendor && <th>Source</th>}<th>Status</th><th>Actions</th></tr></thead><tbody>{visibleProducts.map((product) => { const price = Number(product.price); const originalPrice = Number(product.compare_at_price); const discountPercent = originalPrice > price && price > 0 ? Math.round(((originalPrice - price) / originalPrice) * 100) : null; return <tr key={product.id}><td><strong>{product.name}</strong>{product.description && <small>{product.description}</small>}</td><td>{product.category || 'Unassigned'}</td><td>{qualityTierLabel(product.quality_tier) || <span className="shop-admin-tier-missing">Not set</span>}</td><td>{product.quote_price_range ? `₹${product.quote_price_range}` : '—'}</td><td>{price > 0 ? `₹${price.toLocaleString('en-IN')} / ${product.unit || 'unit'}` : '—'}</td>{!isVendor && <td>{discountPercent === null ? '—' : `${discountPercent}% OFF`}</td>}{!isVendor && <td>{product.vendor_id ? `Vendor #${product.vendor_id}` : product.supplier_id === 0 ? 'Admin' : `Supplier #${product.supplier_id}`}</td>}<td>{product.is_available ? 'Visible' : 'Hidden'}</td><td><div className="shop-admin-actions"><button type="button" onClick={() => edit(product)}>Edit</button><button type="button" onClick={() => toggle(product)}>{product.is_available ? 'Hide' : 'Show'}</button><button type="button" onClick={() => remove(product)}>Delete</button></div></td></tr>; })}</tbody></table></div>}</div>
  </div>;
}

function AppearanceManager() {
  const [content, setContent] = useState(defaultShopStorefront);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    fetch('/api/shop-storefront').then(readApiJson)
      .then((data) => { if (data.success) setContent(data.data); else setNotice(data.error || 'Could not load storefront'); })
      .catch((error) => setNotice(error.message)).finally(() => setLoading(false));
  }, []);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setNotice('');
    try {
      const response = await fetch('/api/shop-storefront', { method: 'PUT', headers: shopHeaders(), body: JSON.stringify(content) });
      const data = await readApiJson(response);
      if (!response.ok) throw new Error(data.error || 'Could not save storefront');
      setContent(data.data);
      notifyShopProductsUpdated();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('mtbossShopProductsUpdated'));
      }
      setNotice('Storefront content saved successfully.');
    } catch (error) { setNotice(error.message); }
    finally { setSaving(false); }
  };

  const updatePromo = (index, field, value) => setContent((current) => ({ ...current, promos: current.promos.map((promo, i) => i === index ? { ...promo, [field]: value } : promo) }));

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setContent((current) => ({ ...current, hero_image: imageUrl }));
    }
    catch (error) { setNotice(error.message); }
    finally { setUploading(false); event.target.value = ''; }
  };

  return <div className="shop-admin-panel">
    <div className="shop-admin-heading">
      <div>
        <h2>Storefront Content Manager</h2>
        <p>Manage Mobile Quick-Commerce Header, Trust Badges, Promo Banners, and Desktop Storefront Text.</p>
      </div>
      <Link href="/ShopNow" target="_blank">Preview Shop Now</Link>
    </div>
    {notice && <p className="shop-admin-notice" role="status">{notice}</p>}
    {loading ? <p>Loading storefront...</p> : (
      <form onSubmit={save}>
        {/* 1. Mobile Quick-Commerce Header & Trust Strip */}
        <div className="shop-admin-card">
          <h3>📱 Mobile Header & Trust Badges</h3>
          <p style={{ marginBottom: 16 }}>Configure the delivery tagline, search bar placeholder, and the 4 quick trust badges displayed at the top of the mobile storefront.</p>
          <div className="shop-admin-fields">
            {mobileHeaderFields.map(([key, label]) => (
              <label key={key}>
                {label}
                <input
                  value={content[key] ?? ''}
                  onChange={(e) => setContent({ ...content, [key]: e.target.value })}
                />
              </label>
            ))}
          </div>
        </div>

        {/* 2. Mobile Promo Banner (Special Bulk Order Offer) */}
        <div className="shop-admin-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
            <h3 style={{ margin: 0 }}>⚡ Mobile Promo Banner (Special Bulk Order Offer)</h3>
            <label className="shop-admin-check" style={{ margin: 0 }}>
              <input
                type="checkbox"
                checked={content.mobile_banner_enabled !== false}
                onChange={(e) => setContent({ ...content, mobile_banner_enabled: e.target.checked })}
              /> Show Promo Banner
            </label>
          </div>
          <p style={{ marginBottom: 16 }}>Customize the dark promotional banner shown on the mobile storefront home/discovery feed.</p>
          <div className="shop-admin-fields">
            {mobileBannerFields.map(([key, label]) => (
              <label key={key}>
                {label}
                <input
                  value={content[key] ?? ''}
                  onChange={(e) => setContent({ ...content, [key]: e.target.value })}
                />
              </label>
            ))}
            <label className="shop-admin-wide">
              Banner Description
              <textarea
                rows={2}
                value={content.mobile_banner_desc ?? ''}
                onChange={(e) => setContent({ ...content, mobile_banner_desc: e.target.value })}
                placeholder="Verified suppliers for Cement, TMT Bars, Brick & Sand with immediate site dispatch."
              />
            </label>
          </div>
        </div>

        {/* 3. Desktop Storefront Banner & Headings */}
        <div className="shop-admin-card">
          <h3>🖥️ Desktop Banner & Page Text</h3>
          <div className="shop-admin-fields">
            {desktopBannerFields.map(([key, label]) => (
              <label key={key}>
                {label}
                <input
                  value={content[key] ?? ''}
                  onChange={(e) => setContent({ ...content, [key]: e.target.value })}
                />
              </label>
            ))}
            <label className="shop-admin-wide">
              Banner image URL
              <input
                value={content.hero_image ?? ''}
                onChange={(e) => setContent({ ...content, hero_image: e.target.value })}
              />
            </label>
          </div>
          <div className="shop-admin-form-footer">
            <label className="shop-admin-upload">
              {uploading ? 'Uploading...' : 'Upload banner image'}
              <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} hidden />
            </label>
          </div>
        </div>

        {/* 4. Desktop Promotion Cards */}
        <div className="shop-admin-card">
          <h3>🎁 Desktop Promotion Cards</h3>
          <div className="shop-admin-fields">
            {content.promos.map((promo, index) => (
              <div className="shop-admin-promo" key={index}>
                <strong>Card {index + 1}</strong>
                <label>
                  Title
                  <input
                    value={promo.title}
                    onChange={(e) => updatePromo(index, 'title', e.target.value)}
                  />
                </label>
                <label>
                  Subtitle
                  <input
                    value={promo.subtitle}
                    onChange={(e) => updatePromo(index, 'subtitle', e.target.value)}
                  />
                </label>
              </div>
            ))}
          </div>
          <div className="shop-admin-form-footer" style={{ marginTop: 20 }}>
            <button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Storefront Content'}
            </button>
          </div>
        </div>
      </form>
    )}
  </div>;
}

function OfferManager() {
  const empty = { name: '', category: '', subcategory: '', brand: '', discount_type: 'percent', discount_value: '', badge_text: '', sort_order: 0, is_active: true, starts_at: '', ends_at: '' };
  const [offers, setOffers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [offersRes, categoriesRes] = await Promise.all([
        fetch('/api/shop-offers?admin=true', { headers: shopHeaders() }),
        fetch('/api/shop-categories?admin=true', { headers: shopHeaders() }),
      ]);
      const offersData = await readApiJson(offersRes);
      const categoriesData = await readApiJson(categoriesRes);
      if (!offersRes.ok) throw new Error(offersData.error || 'Could not load offers');
      setOffers(offersData.data || []); setCategories(categoriesData.data || []);
    } catch (error) { setNotice(error.message); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);
  const save = async (event) => {
    event.preventDefault(); setNotice('');
    try {
      const response = await fetch('/api/shop-offers', { method: editingId ? 'PUT' : 'POST', headers: shopHeaders(), body: JSON.stringify({ ...form, ...(editingId ? { id: editingId } : {}) }) });
      const data = await readApiJson(response);
      if (!response.ok) throw new Error(data.error || 'Could not save offer');
      setForm(empty); setEditingId(null); setNotice(editingId ? 'Offer updated.' : 'Offer created.'); await load();
    } catch (error) { setNotice(error.message); }
  };
  const edit = (offer) => {
    setEditingId(offer.id);
    setForm({ ...empty, ...offer, starts_at: offer.starts_at ? String(offer.starts_at).slice(0, 16) : '', ends_at: offer.ends_at ? String(offer.ends_at).slice(0, 16) : '' });
  };
  const remove = async (offer) => {
    if (!window.confirm(`Delete ${offer.name}?`)) return;
    const response = await fetch(`/api/shop-offers?id=${offer.id}`, { method: 'DELETE', headers: shopHeaders() });
    const data = await readApiJson(response); if (!response.ok) setNotice(data.error || 'Could not delete offer'); else { setNotice('Offer deleted.'); load(); }
  };
  const selectedCategory = categories.find((category) => category.name === form.category);
  const subcategories = Array.isArray(selectedCategory?.subcategories) ? selectedCategory.subcategories : [];
  return <div className="shop-admin-panel">
    <div className="shop-admin-heading"><div><h2>Offers</h2><p>Show offer badges on Shop Now products by category, subcategory and/or brand. Blank targeting fields apply to everything.</p></div><button type="button" onClick={load}>Refresh</button></div>
    {notice && <p className="shop-admin-notice" role="status">{notice}</p>}
    <form className="shop-admin-card" onSubmit={save}><h3>{editingId ? 'Edit offer' : 'Create offer'}</h3><div className="shop-admin-fields">
      <label>Offer name *<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Cement sale" /></label>
      <label>Category<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value, subcategory: '' })}><option value="">All categories</option>{categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}</select></label>
      <label>Subcategory<select value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} disabled={!form.category}><option value="">All subcategories</option>{subcategories.map((item) => { const name = typeof item === 'object' && item !== null ? item.name : item; return <option key={name} value={name}>{name}</option>; })}</select></label>
      <label>Brand<input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="e.g. UltraTech" /></label>
      <label>Discount type<select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })}><option value="percent">Percentage</option><option value="fixed">Fixed amount</option></select></label>
      <label>Discount value *<input required type="number" min="0.01" step="0.01" max={form.discount_type === 'percent' ? '100' : undefined} value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: e.target.value })} /></label>
      <label>Badge text<input maxLength={80} value={form.badge_text} onChange={(e) => setForm({ ...form, badge_text: e.target.value })} placeholder="6% OFF (blank = automatic)" /></label>
      <label>Priority<input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} /><small>Lower number wins when multiple offers match.</small></label>
      <label>Start date/time<input type="datetime-local" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} /></label>
      <label>End date/time<input type="datetime-local" value={form.ends_at} onChange={(e) => setForm({ ...form, ends_at: e.target.value })} /></label>
    </div><div className="shop-admin-form-footer"><label className="shop-admin-check"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active</label><button type="submit">{editingId ? 'Save changes' : 'Create offer'}</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(empty); }}>Cancel</button>}</div></form>
    <div className="shop-admin-card"><h3>Configured offers ({offers.length})</h3>{loading ? <p>Loading offers...</p> : !offers.length ? <p>No offers created yet.</p> : <div className="shop-admin-table-wrap"><table><thead><tr><th>Offer</th><th>Applies to</th><th>Discount</th><th>Status</th><th>Actions</th></tr></thead><tbody>{offers.map((offer) => <tr key={offer.id}><td><strong>{offer.name}</strong><small>{offer.badge_text || 'Automatic badge'}</small></td><td>{[offer.category, offer.subcategory, offer.brand].filter(Boolean).join(' · ') || 'All products'}</td><td>{offer.discount_type === 'percent' ? `${offer.discount_value}%` : `₹${offer.discount_value}`}</td><td>{offer.is_active ? 'Active' : 'Hidden'}</td><td><div className="shop-admin-actions"><button type="button" onClick={() => { setEditingId(offer.id); edit(offer); }}>Edit</button><button type="button" onClick={() => remove(offer)}>Delete</button></div></td></tr>)}</tbody></table></div>}</div>
  </div>;
}

export default function ShopNowManager({ isDarkMode, initialTab = 'categories' }) {
  const [tab, setTab] = useState(initialTab);
  const openAddProduct = () => {
    setTab('products');
    requestAnimationFrame(() => document.getElementById('shop-product-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };
  return <div className="shop-admin-root">
    <div className="shop-admin-toolbar"><div><h2>Shop Now Manager</h2><p>Add products and manage what customers see on Shop Now.</p></div><button type="button" onClick={openAddProduct}>+ Add Product</button></div>
    <div className="shop-admin-tabs" role="tablist" aria-label="Shop Now management">
      <button type="button" role="tab" aria-selected={tab === 'categories'} className={tab === 'categories' ? 'active' : ''} onClick={() => setTab('categories')}>Categories</button>
      <button type="button" role="tab" aria-selected={tab === 'products'} className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}>Products</button>
      <button type="button" role="tab" aria-selected={tab === 'content'} className={tab === 'content' ? 'active' : ''} onClick={() => setTab('content')}>Storefront Content</button>
      <button type="button" role="tab" aria-selected={tab === 'shipping'} className={tab === 'shipping' ? 'active' : ''} onClick={() => setTab('shipping')}>Shipping Settings</button>
      <button type="button" role="tab" aria-selected={tab === 'commission'} className={tab === 'commission' ? 'active' : ''} onClick={() => setTab('commission')}>Vendor Commission</button>
      <button type="button" role="tab" aria-selected={tab === 'coupons'} className={tab === 'coupons' ? 'active' : ''} onClick={() => setTab('coupons')}>Promotions & Coupons</button>
      <button type="button" role="tab" aria-selected={tab === 'cashback'} className={tab === 'cashback' ? 'active' : ''} onClick={() => setTab('cashback')}>Cashback & Wallet</button>
    </div>
    {tab === 'categories' && <ShopCategoriesManager isDarkMode={isDarkMode} />}
    {tab === 'products' && <ProductManager />}
    {tab === 'content' && <AppearanceManager />}
    {tab === 'shipping' && <ShippingSettingsManager />}
    {tab === 'commission' && <ShopCommissionSettingsManager isDarkMode={isDarkMode} />}
    {tab === 'coupons' && <ShopCouponsManager />}
    {tab === 'cashback' && <CashbackManager isDarkMode={isDarkMode} />}
  </div>;
}

export function VendorShopProductsManager({ isDarkMode = false }) {
  const openAddProduct = () => {
    requestAnimationFrame(() => document.getElementById('vendor-shop-product-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  return <div className="shop-admin-root">
    <VendorCommissionSummary isDarkMode={isDarkMode} />
    <div className="shop-admin-toolbar"><div><h2>Shop Products</h2><p>Add and manage the products customers can order from your shop.</p></div><button type="button" onClick={openAddProduct}>+ Add Product</button></div>
    <ProductManager ownerRole="vendor" formId="vendor-shop-product-form" />
  </div>;
}
