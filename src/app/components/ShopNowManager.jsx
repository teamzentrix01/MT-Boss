'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ShopCategoriesManager from './ShopCategoriesManager';
import { defaultShopStorefront } from '@/lib/shop-storefront-defaults';
import { QUALITY_TIERS, qualityTierLabel } from '@/lib/quality-tier';
import './ShopNowManager.css';

const units = ['bag', 'bags', 'pcs', 'kg', 'quintal', 'box', 'bundle', 'cft', 'ton', 'meter', 'set', 'bucket'];
const emptyProduct = { name: '', description: '', category: '', quality_tier: '', quote_price_range: '', price: '', compare_at_price: '', brand: '', unit: '', quantity: 0, image_url: '', available_cities: [], is_available: true };
const fields = [
  ['hero_kicker', 'Banner eyebrow'], ['hero_title', 'Banner title'],
  ['hero_highlight', 'Highlighted title'], ['hero_description', 'Banner description'],
  ['hero_badge', 'Image badge text'],
  ['hero_button', 'Banner button'], ['search_placeholder', 'Search placeholder'],
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
  const [tierFilter, setTierFilter] = useState('all');
  const untieredCount = products.filter((product) => !product.quality_tier).length;
  const visibleProducts = tierFilter === 'all'
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
      name: product.name || '', description: product.description || '', category: product.category || '', quality_tier: product.quality_tier || '',
      quote_price_range: product.quote_price_range || '', price: product.price ?? '', compare_at_price: product.compare_at_price ?? '', brand: product.brand || '', unit: product.unit || '', quantity: product.quantity ?? 0,
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
        <label>Category *<select required value={form.category} onChange={(e) => { const cat = categories.find((item) => item.name === e.target.value); setForm({ ...form, category: e.target.value, unit: cat?.unit || form.unit }); }}><option value="">Select category</option>{categories.map((cat) => <option key={cat.id} value={cat.name}>{cat.name}</option>)}</select></label>
        <label>Quality Tier *<select required value={form.quality_tier} onChange={(e) => setForm({ ...form, quality_tier: e.target.value })}><option value="">Select quality tier</option>{QUALITY_TIERS.map((tier) => <option key={tier.value} value={tier.value}>{tier.label}</option>)}</select><small>Used by the Budget Calculator to match this product to a Quality Package.</small></label>
        <label>Get Quote price range (₹) *<input required type="text" maxLength={100} value={form.quote_price_range} onChange={(e) => setForm({ ...form, quote_price_range: e.target.value })} placeholder="Example: 40-80" /><small>Enter a minimum and maximum lump-sum range, e.g. 40-80.</small></label>
        <label>Buy Now fixed price (₹) *<input required type="number" min="0.01" max="99999999.99" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Example: 60" /></label>
        <label>Original price (₹, optional)<input type="number" min="0" step="0.01" value={form.compare_at_price} onChange={(e) => setForm({ ...form, compare_at_price: e.target.value })} placeholder="Shows discount when above selling price" /></label>
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
      <div className="shop-admin-form-footer"><label className="shop-admin-check"><input type="checkbox" checked={form.is_available} onChange={(e) => setForm({ ...form, is_available: e.target.checked })} /> Show on Shop Now</label><label className="shop-admin-upload">{uploading ? 'Uploading...' : 'Upload image'}<input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} hidden /></label>{form.image_url && <Image className="shop-admin-thumb" src={form.image_url} alt="Product preview" width={43} height={43} unoptimized />}<button type="submit" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Save changes' : 'Add product'}</button>{editingId && <button type="button" onClick={reset}>Cancel</button>}</div>
    </form>
    <div className="shop-admin-card"><div className="shop-admin-list-head"><h3>{isVendor ? 'My products' : 'All products'} ({tierFilter === 'all' ? products.length : `${visibleProducts.length} of ${products.length}`})</h3><label className="shop-admin-tier-filter">Quality Tier<select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)}><option value="all">All products</option><option value="none">No Quality Tier set ({untieredCount})</option>{QUALITY_TIERS.map((tier) => <option key={tier.value} value={tier.value}>{tier.label}</option>)}</select></label></div>{loading ? <p>Loading products...</p> : !products.length ? <p>No products yet. Add the first product above.</p> : !visibleProducts.length ? <p>No products match this Quality Tier filter.</p> : <div className="shop-admin-table-wrap"><table><thead><tr><th>Product</th><th>Category</th><th>Quality</th><th>Get Quote range</th><th>Buy Now price / unit</th>{!isVendor && <th>Source</th>}<th>Status</th><th>Actions</th></tr></thead><tbody>{visibleProducts.map((product) => <tr key={product.id}><td><strong>{product.name}</strong>{product.description && <small>{product.description}</small>}</td><td>{product.category || 'Unassigned'}</td><td>{qualityTierLabel(product.quality_tier) || <span className="shop-admin-tier-missing">Not set</span>}</td><td>{product.quote_price_range ? `₹${product.quote_price_range}` : '—'}</td><td>{Number(product.price) > 0 ? `₹${Number(product.price).toLocaleString('en-IN')} / ${product.unit || 'unit'}` : '—'}</td>{!isVendor && <td>{product.vendor_id ? `Vendor #${product.vendor_id}` : product.supplier_id === 0 ? 'Admin' : `Supplier #${product.supplier_id}`}</td>}<td>{product.is_available ? 'Visible' : 'Hidden'}</td><td><div className="shop-admin-actions"><button type="button" onClick={() => edit(product)}>Edit</button><button type="button" onClick={() => toggle(product)}>{product.is_available ? 'Hide' : 'Show'}</button><button type="button" onClick={() => remove(product)}>Delete</button></div></td></tr>)}</tbody></table></div>}</div>
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
      setNotice('Storefront content saved.');
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

  return <div className="shop-admin-panel"><div className="shop-admin-heading"><div><h2>Storefront content</h2><p>Edit the Shop Now banner, promotion cards, headings and search text. Colors follow the MT Boss blue theme.</p></div><Link href="/ShopNow" target="_blank">Preview Shop Now</Link></div>{notice && <p className="shop-admin-notice" role="status">{notice}</p>}{loading ? <p>Loading storefront...</p> : <form className="shop-admin-card" onSubmit={save}><h3>Banner and page text</h3><div className="shop-admin-fields">{fields.map(([key, label]) => <label key={key}>{label}<input value={content[key]} onChange={(e) => setContent({ ...content, [key]: e.target.value })} /></label>)}<label className="shop-admin-wide">Banner image URL<input value={content.hero_image} onChange={(e) => setContent({ ...content, hero_image: e.target.value })} /></label></div><div className="shop-admin-form-footer"><label className="shop-admin-upload">{uploading ? 'Uploading...' : 'Upload banner image'}<input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} hidden /></label></div><h3>Promotion cards</h3><div className="shop-admin-fields">{content.promos.map((promo, index) => <div className="shop-admin-promo" key={index}><strong>Card {index + 1}</strong><label>Title<input value={promo.title} onChange={(e) => updatePromo(index, 'title', e.target.value)} /></label><label>Subtitle<input value={promo.subtitle} onChange={(e) => updatePromo(index, 'subtitle', e.target.value)} /></label></div>)}</div><div className="shop-admin-form-footer"><button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save storefront'}</button></div></form>}</div>;
}

export default function ShopNowManager({ isDarkMode, initialTab = 'categories' }) {
  const [tab, setTab] = useState(initialTab);
  const openAddProduct = () => {
    setTab('products');
    requestAnimationFrame(() => document.getElementById('shop-product-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };
  return <div className="shop-admin-root">
    <div className="shop-admin-toolbar"><div><h2>Shop Now Manager</h2><p>Add products and manage what customers see on Shop Now.</p></div><button type="button" onClick={openAddProduct}>+ Add Product</button></div>
    <div className="shop-admin-tabs" role="tablist" aria-label="Shop Now management"><button type="button" role="tab" aria-selected={tab === 'categories'} className={tab === 'categories' ? 'active' : ''} onClick={() => setTab('categories')}>Categories</button><button type="button" role="tab" aria-selected={tab === 'products'} className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}>Products</button><button type="button" role="tab" aria-selected={tab === 'content'} className={tab === 'content' ? 'active' : ''} onClick={() => setTab('content')}>Storefront Content</button></div>
    {tab === 'categories' && <ShopCategoriesManager isDarkMode={isDarkMode} />}{tab === 'products' && <ProductManager />}{tab === 'content' && <AppearanceManager />}
  </div>;
}

export function VendorShopProductsManager() {
  const openAddProduct = () => {
    requestAnimationFrame(() => document.getElementById('vendor-shop-product-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  return <div className="shop-admin-root">
    <div className="shop-admin-toolbar"><div><h2>Shop Products</h2><p>Add and manage the products customers can order from your shop.</p></div><button type="button" onClick={openAddProduct}>+ Add Product</button></div>
    <ProductManager ownerRole="vendor" formId="vendor-shop-product-form" />
  </div>;
}
