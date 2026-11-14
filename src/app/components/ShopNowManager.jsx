'use client';

import { useCallback, useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { UploadCloud, Plus, X, Star, Sparkles, Image as ImageIcon, ArrowLeft, HelpCircle, ShieldCheck, CheckCircle2, RotateCcw, FileText, ListChecks } from 'lucide-react';
import VendorCommissionSummary from './VendorCommissionSummary';
import { defaultShopStorefront } from '@/lib/shop-storefront-defaults';
import { QUALITY_TIER_OPTIONS, qualityTierLabel } from '@/lib/quality-tier';
import { getCategoryAttributeConfig, extractProductAttributes } from '@/lib/product-attributes';
import './ShopNowManager.css';

const ShopCategoriesManager = dynamic(() => import('./ShopCategoriesManager'), {
  ssr: false,
  loading: () => <p>Loading categories…</p>,
});
const ShopCouponsManager = dynamic(() => import('./ShopCouponsManager'), {
  ssr: false,
  loading: () => <p>Loading coupons…</p>,
});

const units = ['bag', 'bags', 'pcs', 'kg', 'quintal', 'box', 'bundle', 'cft', 'ton', 'meter', 'set', 'bucket'];
const emptyProduct = { name: '', description: '', category: '', subcategory: '', quality_tier: 'all', quote_price_range: '', price: '', compare_at_price: '', is_featured_deal: false, brand: '', unit: '', quantity: 0, image_url: '', available_cities: [], is_available: true };
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

const ATTRIBUTE_FIELD_DEFS = {
  grade: {
    icon: '⭐',
    label: 'Grade / Standard',
    eg: 'e.g. OPC 53 Grade, Fe 500D, Class 1, Zone II',
    placeholder: 'e.g. OPC 53 Grade, Fe 500D',
  },
  type: {
    icon: '🏷️',
    label: 'Type / Variety',
    eg: 'e.g. PPC Cement, TMT Rebar, AAC Block, M-Sand',
    placeholder: 'e.g. PPC Cement, TMT Rebar',
  },
  pack_size: {
    icon: '📦',
    label: 'Pack / Bag Size',
    eg: 'e.g. 50 Kg Bag, 1 Ton, CFT, 25 Kg Bag',
    placeholder: 'e.g. 50 Kg Bag, 1 Ton',
  },
  thickness: {
    icon: '📏',
    label: 'Thickness / Diameter',
    eg: 'e.g. 8mm, 10mm, 12mm, 16mm, 20mm',
    placeholder: 'e.g. 12mm, 16mm, 20mm',
  },
  size: {
    icon: '📐',
    label: 'Dimensions / Size',
    eg: 'e.g. 9x4x3 inch, 600x600 mm, 12m Length',
    placeholder: 'e.g. 9x4x3 inch, 600x600 mm',
  },
  material: {
    icon: '🧱',
    label: 'Material Composition',
    eg: 'e.g. Primary Virgin Steel, Vitrified Porcelain, Clay',
    placeholder: 'e.g. Primary Virgin Steel, Clay',
  },
  color: {
    icon: '🎨',
    label: 'Color / Shade / Finish',
    eg: 'e.g. Grey, Super White, Terracotta',
    placeholder: 'e.g. Grey, Super White',
  },
};


const shopHeaders = (ownerRole = 'admin') => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${
    ownerRole === 'vendor'
      ? localStorage.getItem('vendor-token') || localStorage.getItem('service-provider-token') || ''
      : ownerRole === 'supplier'
      ? localStorage.getItem('supplier-token') || ''
      : localStorage.getItem('admin-token') || localStorage.getItem('token') || ''
  }`,
});

async function readApiJson(response) {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    throw new Error(`Shop product service returned an invalid response (${response.status}). Please refresh after restarting the development server.`);
  }
  return response.json();
}

function notifyShopProductsUpdated() {
  try { localStorage.setItem('MTBOSS-shop-products-updated', String(Date.now())); }
  catch { /* Same-tab refresh event still keeps Shop Now in sync. */ }
  window.dispatchEvent(new Event('MTBOSSShopProductsUpdated'));
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

function ProductManager({ ownerRole = 'admin', formId = 'shop-product-form', initialShowForm = false, isDarkMode = false }) {
  const isVendor = ownerRole === 'vendor';
  const isSupplier = ownerRole === 'supplier';
  const isSeller = isVendor || isSupplier;
  const productEndpoint = isSupplier
    ? '/api/supplier/shop-products'
    : isVendor
    ? '/api/vendor/shop-products'
    : '/api/admin/shop-products';
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [imagesList, setImagesList] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [galleryText, setGalleryText] = useState('');
  const [specsText, setSpecsText] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [highlights, setHighlights] = useState([]);
  const [newHighlight, setNewHighlight] = useState('');
  const [faqs, setFaqs] = useState([]);
  const [returnsPolicy, setReturnsPolicy] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showProductForm, setShowProductForm] = useState(initialShowForm);
  const [isCustomSubcategory, setIsCustomSubcategory] = useState(false);
  const [formAttributes, setFormAttributes] = useState({ thickness: '', size: '', type: '', color: '', material: '', grade: '', pack_size: '' });
  const [isDark, setIsDark] = useState(isDarkMode);

  useEffect(() => {
    setIsDark(isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const html = document.documentElement;
    const checkDark = () => {
      const dark = html.classList.contains('dark-mode') || html.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
      setIsDark(dark);
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    window.addEventListener('storage', checkDark);
    return () => {
      observer.disconnect();
      window.removeEventListener('storage', checkDark);
    };
  }, []);

  useEffect(() => {
    if (initialShowForm) setShowProductForm(true);
  }, [initialShowForm]);

  useEffect(() => {
    const handleOpen = () => setShowProductForm(true);
    window.addEventListener('openSupplierAddProduct', handleOpen);
    return () => window.removeEventListener('openSupplierAddProduct', handleOpen);
  }, []);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState('');
  const [tierFilter, setTierFilter] = useState('any');
  const [productPage, setProductPage] = useState(1);
  const [productPagination, setProductPagination] = useState({ page: 1, limit: 25, total: 0, pages: 1 });
  const [productSearch, setProductSearch] = useState('');
  const [debouncedProductSearch, setDebouncedProductSearch] = useState('');
  const untieredCount = 0;
  const visibleProducts = products;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedProductSearch(productSearch.trim()), 300);
    return () => clearTimeout(t);
  }, [productSearch]);

  useEffect(() => { setProductPage(1); }, [tierFilter, debouncedProductSearch]);

  const loadReferenceData = useCallback(async () => {
    try {
      const [categoryRes, cityRes] = await Promise.all([
        fetch(isSeller ? '/api/shop-categories' : '/api/shop-categories?admin=true', { headers: shopHeaders(ownerRole) }),
        fetch('/api/cities'),
      ]);
      const [categoryData, cityData] = await Promise.all([readApiJson(categoryRes), readApiJson(cityRes)]);
      if (!categoryRes.ok || !cityRes.ok) throw new Error(categoryData.error || cityData.error || 'Could not load shop reference data');
      setCategories(categoryData.data || []);
      setCities(cityData.cities || []);
    } catch (error) {
      setNotice(error.message);
    }
  }, [isSeller, ownerRole]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const productUrl = isSeller
        ? productEndpoint
        : (() => {
            const params = new URLSearchParams({
              page: String(productPage),
              limit: '25',
              fields: 'list',
              sort: 'created_at',
              order: 'desc',
            });
            if (debouncedProductSearch) params.set('q', debouncedProductSearch);
            if (tierFilter !== 'any') params.set('tier', tierFilter);
            return `${productEndpoint}?${params}`;
          })();
      const productRes = await fetch(productUrl, { headers: shopHeaders(ownerRole) });
      const productData = await readApiJson(productRes);
      if (!productRes.ok) throw new Error(productData.error || 'Could not load shop data');
      setProducts(productData.data || []);
      setProductPagination(productData.pagination || { page: 1, limit: 25, total: (productData.data || []).length, pages: 1 });
    } catch (error) { setNotice(error.message); }
    finally { setLoading(false); }
  }, [isSeller, ownerRole, productEndpoint, productPage, debouncedProductSearch, tierFilter]);

  useEffect(() => { loadReferenceData(); }, [loadReferenceData]);
  useEffect(() => { load(); }, [load]);

  const edit = async (product) => {
    let full = product;
    if (!isSeller && (!Array.isArray(product.images) || product.specifications == null)) {
      try {
        const res = await fetch(`${productEndpoint}?id=${product.id}`, { headers: shopHeaders(ownerRole) });
        const data = await readApiJson(res);
        if (res.ok && data.data) full = data.data;
      } catch { /* use list row */ }
    }
    setEditingId(full.id);
    setShowProductForm(true);
    const existingImgs = Array.from(new Set([
      full.image_url,
      ...(Array.isArray(full.images) ? full.images : [])
    ].filter(Boolean)));
    setImagesList(existingImgs);
    const extractedAttrs = extractProductAttributes(full);
    setFormAttributes({
      thickness: extractedAttrs.thickness || '',
      size: extractedAttrs.size || '',
      type: extractedAttrs.type || '',
      color: extractedAttrs.color || '',
      material: extractedAttrs.material || '',
      grade: extractedAttrs.grade || '',
      pack_size: extractedAttrs.pack_size || '',
    });
    setForm({
      name: full.name || '', description: full.description || '', category: full.category || '', subcategory: full.subcategory || '', quality_tier: full.quality_tier || '',
      quote_price_range: full.quote_price_range || '', price: full.price ?? '', compare_at_price: full.compare_at_price ?? '', is_featured_deal: full.is_featured_deal === true, brand: full.brand || '', unit: full.unit || '', quantity: full.quantity ?? 0,
      image_url: existingImgs[0] || full.image_url || '', available_cities: full.available_cities || [], is_available: full.is_available !== false,
    });
    setGalleryText(existingImgs.join('\n'));
    setSpecsText(Object.entries(full.specifications || {}).map(([key, value]) => `${key}: ${value}`).join('\n'));
    setBulkText((full.bulk_pricing || []).map((tier) => `${tier.min_quantity}: ${tier.price}`).join('\n'));
    setHighlights(Array.isArray(full.highlights) ? full.highlights : []);
    setNewHighlight('');
    setFaqs(Array.isArray(full.faqs) ? full.faqs : []);
    setReturnsPolicy(full.returns_policy || '');
    setNotice('');
    document.getElementById(formId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const reset = () => {
    setEditingId(null);
    setShowProductForm(false);
    setIsCustomSubcategory(false);
    setFormAttributes({ thickness: '', size: '', type: '', color: '', material: '', grade: '', pack_size: '' });
    setForm(emptyProduct);
    setImagesList([]);
    setNewImageUrl('');
    setGalleryText('');
    setSpecsText('');
    setBulkText('');
    setHighlights([]);
    setNewHighlight('');
    setFaqs([]);
    setReturnsPolicy('');
    setNotice('');
  };

  const startAddProduct = () => {
    setEditingId(null);
    setIsCustomSubcategory(false);
    setFormAttributes({ thickness: '', size: '', type: '', color: '', material: '', grade: '', pack_size: '' });
    setForm(emptyProduct);
    setImagesList([]);
    setNewImageUrl('');
    setGalleryText('');
    setSpecsText('');
    setBulkText('');
    setHighlights([]);
    setNewHighlight('');
    setFaqs([]);
    setReturnsPolicy('');
    setNotice('');
    setShowProductForm(true);
    requestAnimationFrame(() => {
      document.getElementById(formId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setNotice('');
    try {
      if (form.price === '' || form.price == null || Number(form.price) <= 0 || !Number.isFinite(Number(form.price))) {
        throw new Error('Please enter a valid positive Buy Now fixed price.');
      }

      const parseLines = (value) => (value || '').split('\n').map((line) => line.trim()).filter(Boolean);
      const specifications = {};
      if (formAttributes.thickness?.trim()) specifications.Thickness = formAttributes.thickness.trim();
      if (formAttributes.size?.trim()) specifications.Size = formAttributes.size.trim();
      if (formAttributes.type?.trim()) specifications.Type = formAttributes.type.trim();
      if (formAttributes.color?.trim()) specifications.Colors = formAttributes.color.trim();
      if (formAttributes.material?.trim()) specifications.Material = formAttributes.material.trim();
      if (formAttributes.grade?.trim()) specifications.Grade = formAttributes.grade.trim();
      if (formAttributes.pack_size?.trim()) specifications.PackSize = formAttributes.pack_size.trim();
      parseLines(specsText).forEach((line) => {
        const separator = line.indexOf(':');
        if (separator !== -1) {
          const key = line.slice(0, separator).trim();
          const val = line.slice(separator + 1).trim();
          if (key && val) specifications[key] = val;
        } else if (line.trim()) {
          specifications[line.trim()] = 'Yes';
        }
      });

      const bulk_pricing = [];
      parseLines(bulkText).forEach((line) => {
        const parts = line.split(/[:\s-]+/).map((part) => part.trim()).filter(Boolean);
        if (parts.length >= 2) {
          const minQty = Number(parts[0]);
          const tierPrice = Number(parts[1]);
          if (Number.isInteger(minQty) && minQty >= 1 && Number.isFinite(tierPrice) && tierPrice > 0) {
            bulk_pricing.push({ min_quantity: minQty, price: tierPrice });
          }
        }
      });

      const allImgs = Array.from(new Set([
        ...imagesList,
        ...parseLines(galleryText)
      ].filter(Boolean)));
      const mainCover = allImgs[0] || form.image_url || '';

      const isEditing = Boolean(editingId);
      const response = await fetch(productEndpoint, {
        method: isEditing ? 'PUT' : 'POST', headers: shopHeaders(ownerRole),
        body: JSON.stringify({
          ...form,
          quote_price_range: form.quote_price_range || null,
          image_url: mainCover,
          images: allImgs,
          specifications,
          bulk_pricing,
          highlights: highlights.map((h) => String(h).trim()).filter(Boolean),
          faqs: faqs.map((f) => ({ q: String(f.q || '').trim(), a: String(f.a || '').trim() })).filter((f) => f.q && f.a),
          returns_policy: returnsPolicy.trim(),
          ...(isEditing ? { id: editingId } : {})
        }),
      });
      const data = await readApiJson(response);
      if (!response.ok) throw new Error(data.error || 'Could not save product');
      notifyShopProductsUpdated();
      reset();
      if (isSeller) {
        setNotice(
          isEditing
            ? (data?.resubmitted_for_approval ? 'Submitted for admin approval.' : 'Product updated.')
            : 'Submitted for admin approval.'
        );
      } else {
        setNotice(isEditing ? 'Product updated.' : 'Product added successfully.');
      }
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
      const nextList = Array.from(new Set([imageUrl, ...imagesList]));
      setImagesList(nextList);
      setGalleryText(nextList.join('\n'));
    }
    catch (error) { setNotice(error.message); }
    finally { setUploading(false); event.target.value = ''; }
  };

  const handleMultipleUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setNotice('');
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const url = await uploadImage(file);
        if (url) uploadedUrls.push(url);
      }
      if (uploadedUrls.length > 0) {
        const nextList = Array.from(new Set([...imagesList, ...uploadedUrls]));
        setImagesList(nextList);
        setGalleryText(nextList.join('\n'));
        if (!form.image_url) {
          setForm((current) => ({ ...current, image_url: nextList[0] }));
        }
        setNotice(`Uploaded ${uploadedUrls.length} image(s) successfully.`);
      }
    } catch (error) {
      setNotice(error.message);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const addImageUrl = () => {
    const url = newImageUrl.trim();
    if (!url) return;
    const nextList = Array.from(new Set([...imagesList, url]));
    setImagesList(nextList);
    setGalleryText(nextList.join('\n'));
    if (!form.image_url) {
      setForm((current) => ({ ...current, image_url: url }));
    }
    setNewImageUrl('');
  };

  const removeImage = (index) => {
    const nextList = imagesList.filter((_, i) => i !== index);
    setImagesList(nextList);
    setGalleryText(nextList.join('\n'));
    setForm((current) => ({
      ...current,
      image_url: nextList[0] || ''
    }));
  };

  const setAsCover = (index) => {
    const target = imagesList[index];
    if (!target) return;
    const nextList = [target, ...imagesList.filter((_, i) => i !== index)];
    setImagesList(nextList);
    setGalleryText(nextList.join('\n'));
    setForm((current) => ({
      ...current,
      image_url: target
    }));
  };

  const addHighlightItem = () => {
    const trimmed = newHighlight.trim();
    if (!trimmed) return;
    setHighlights((prev) => [...prev, trimmed]);
    setNewHighlight('');
  };

  const removeHighlightItem = (index) => {
    setHighlights((prev) => prev.filter((_, idx) => idx !== index));
  };

  const loadPresetHighlights = () => {
    const presets = [
      '100% Genuine & Brand Certified Material',
      'Tested for Structural Strength & Load Bearing Capacity',
      'Direct Sourced from Authorized Manufacturers / Mills',
      'Standard Weight & Packaging Verification at Dispatch',
      'Express Delivery & Safe On-site Unloading Support'
    ];
    setHighlights((prev) => Array.from(new Set([...prev, ...presets])));
  };

  const addFaqItem = () => {
    setFaqs((prev) => [...prev, { q: '', a: '' }]);
  };

  const updateFaqItem = (index, field, value) => {
    setFaqs((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const removeFaqItem = (index) => {
    setFaqs((prev) => prev.filter((_, idx) => idx !== index));
  };

  const loadPresetFaqs = () => {
    const presets = [
      {
        q: 'How should this material be stored at the site?',
        a: 'Store in an elevated, dry, covered shed on wooden pallets away from moisture and direct rainwater.'
      },
      {
        q: 'Is an official GST tax invoice provided?',
        a: 'Yes, 100% genuine manufacturer test certificate and GST invoice accompany every delivery.'
      },
      {
        q: 'How do bulk order discounts work?',
        a: 'Bulk discounts unlock automatically for high volume orders or above ₹50,000 at checkout.'
      },
      {
        q: 'What is the estimated delivery timeline?',
        a: 'Orders within service cities are typically dispatched and delivered within 24 to 48 hours.'
      }
    ];
    setFaqs((prev) => (prev.length === 0 ? presets : [...prev, ...presets]));
  };

  const loadPresetReturnsPolicy = () => {
    setReturnsPolicy(
      'Site Inspection: Customers can inspect quantity, brand stamps, and packaging at the time of truck unloading.\n' +
      'Transit Damage: Any burst bags or damaged items reported on the delivery challan will be replaced immediately or refunded.\n' +
      'Unopened Materials: Standard 48-hour return policy applies for unopened, undamaged materials.'
    );
  };

  return <div className="shop-admin-panel">
    {showProductForm || editingId ? (
      <>
        <div className="shop-admin-heading">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              type="button"
              onClick={reset}
              className="shop-admin-back-btn"
            >
              <ArrowLeft size={16} /> Back to products
            </button>
            <div>
              <h2>{editingId ? 'Edit product' : 'Add product'}</h2>
              <p>{isSeller ? 'Fill out product details for admin approval.' : 'Enter product details and fixed Buy Now price.'}</p>
            </div>
          </div>
        </div>
        {notice && <p className="shop-admin-notice" role="status">{notice}</p>}
        <form id={formId} className="shop-admin-card" onSubmit={save}>
      <h3>{editingId ? 'Edit product' : 'Add product'}</h3>
      <div className="shop-admin-fields">
        <label>
          <span>Product name <span style={{ color: '#ef4444' }}>*</span></span>
          <input required maxLength={255} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label>
          <span>Category <span style={{ color: '#ef4444' }}>*</span></span>
          <select
            required
            value={form.category}
            onChange={(e) => {
              const selectedVal = e.target.value;
              const cat = categories.find((item) => (item.name || '').trim().toLowerCase() === selectedVal.trim().toLowerCase());
              setForm({
                ...form,
                category: selectedVal,
                subcategory: '',
                unit: cat?.unit || form.unit,
              });
              setIsCustomSubcategory(false);
            }}
          >
            <option value="">Select category</option>
            {(() => {
              const standardNavbarCats = [
                'Building Materials',
                'Carpentry',
                'Plumbing',
                'Electrical',
                'Furniture & Architectural Hardware',
                'New Launches',
                'Chemicals',
                'Paints',
              ];
              const catNames = new Set(standardNavbarCats);
              categories.forEach((c) => {
                if (c.name && c.name.trim()) catNames.add(c.name.trim());
              });
              if (form.category && !catNames.has(form.category)) {
                catNames.add(form.category);
              }
              return Array.from(catNames).map((name) => (
                <option key={name} value={name}>{name}</option>
              ));
            })()}
          </select>
        </label>
        <label>
          <span>Subcategory</span>
          {!isCustomSubcategory ? (
            <select
              value={form.subcategory}
              onChange={(e) => {
                if (e.target.value === '__CUSTOM__') {
                  setIsCustomSubcategory(true);
                  setForm({ ...form, subcategory: '' });
                } else {
                  setForm({ ...form, subcategory: e.target.value });
                }
              }}
            >
              <option value="">Select subcategory (optional)</option>
              {(() => {
                const cat = categories.find(
                  (item) => (item.name || '').trim().toLowerCase() === (form.category || '').trim().toLowerCase()
                );
                const list = [];

                // 1. Category DB subcategories
                let rawSubs = cat?.subcategories;
                if (typeof rawSubs === 'string') {
                  try { rawSubs = JSON.parse(rawSubs); } catch {}
                }
                if (Array.isArray(rawSubs)) {
                  rawSubs.forEach((s) => {
                    const name = typeof s === 'object' && s !== null ? s.name : s;
                    if (name && typeof name === 'string' && name.trim() && !list.includes(name.trim())) {
                      list.push(name.trim());
                    }
                  });
                }

                // 2. Category DB types
                let rawTypes = cat?.types;
                if (typeof rawTypes === 'string') {
                  try { rawTypes = JSON.parse(rawTypes); } catch {}
                }
                if (Array.isArray(rawTypes)) {
                  rawTypes.forEach((t) => {
                    if (t && typeof t === 'string' && t.trim() && !list.includes(t.trim())) {
                      list.push(t.trim());
                    }
                  });
                }

                // 3. Fallback tree lookup
                const defaultTree = {
                  'furniture & architectural hardware': ['Hinges, Channels & Handles', 'Kitchen Systems & Accessories', 'Wardrobe & Bed Fittings', 'Door Locks & Hardware', 'Cabinet Fittings', 'Glass Hardware'],
                  'building materials': ['Cement', 'Iron', 'Steel', 'Aggregate (Barjri)', 'Coarse Sand', 'Fine Sand', 'Brick', 'Block', 'POP', 'Tiles', 'Marble', 'Glass', 'Waterproofing'],
                  'carpentry': ['Timber', 'Plywood', 'HPL', 'Rough Carpentry', 'Veneer', 'Flush Doors', 'Laminates'],
                  'plumbing': ['Sanitary', 'CPVC Pipes', 'Bath Fittings', 'Overhead Tanks', 'Pipes & Fittings', 'Drainage', 'Water Tanks', 'Taps & Showers'],
                  'electrical': ['Sockets', 'Switches', 'MCB', 'Distribution Board (DB)', 'LED Lights', 'Electrical Cables', 'Wires & Conduits', 'Fans'],
                  'timber ( lakdi)': ['Teak Wood', 'Imported Teak', 'Sal Wood', 'Pine Wood', 'Sheesham', 'Plywood', 'Board'],
                  'timber': ['Teak Wood', 'Imported Teak', 'Sal Wood', 'Pine Wood', 'Sheesham', 'Plywood', 'Board'],
                  'cement': ['OPC 43 & PPC', 'OPC 53', 'Waterproof & White Cement'],
                  'brick': ['Laal eent', 'Grey eent', 'Concrete Bricks', 'AAC Blocks', 'Fly Ash Bricks'],
                  'steel': ['TMT Bars', 'Mild Steel Plain Bars', 'Deformed Bars', 'TMX Bars', 'HYSD Bars', 'Binding Wire'],
                  'sand': ['River Sand (Nadi ki Ret)', 'M-Sand (Manufactured Sand)', 'Coarse Sand', 'Fine Sand', 'Pit Sand'],
                  'aggregate ( barjri)': ['Fine Aggregate', 'Coarse Aggregate'],
                  'new launches': ['Cabinet Hardware', 'Kitchen Systems & Hardware', 'General Hardware & Tools', 'Bathroom Renovation Materials', 'Conduits & Piping', 'PVC Pipes', 'Kitchen Sinks & Faucets', 'Home Appliances & Power Backup'],
                  'chemicals': ['Construction Chemicals', 'Waterproofing Chemicals', 'Tile Adhesives', 'Admixtures'],
                  'paints': ['Interior Paints', 'Exterior Paints', 'Primers', 'Enamels & Distempers', 'Wall Putty'],
                };

                const normCatKey = (form.category || '').toLowerCase().trim();
                const matchedKey = Object.keys(defaultTree).find((key) => {
                  return normCatKey === key ||
                         normCatKey.replace(/\s+/g, '') === key.replace(/\s+/g, '') ||
                         normCatKey.includes(key) ||
                         key.includes(normCatKey);
                });

                if (matchedKey && defaultTree[matchedKey]) {
                  defaultTree[matchedKey].forEach((name) => {
                    if (!list.includes(name)) list.push(name);
                  });
                }

                if (form.subcategory && !list.includes(form.subcategory)) {
                  list.unshift(form.subcategory);
                }

                return list.map((name) => <option key={name} value={name}>{name}</option>);
              })()}
              <option value="__CUSTOM__">✍️ + Type custom subcategory...</option>
            </select>
          ) : (
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Enter subcategory name..."
                value={form.subcategory}
                onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                style={{ flex: 1 }}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setIsCustomSubcategory(false)}
                className="shop-admin-subcat-btn"
              >
                Choose from list
              </button>
            </div>
          )}
        </label>
        {/* Dynamic Category Specifications Section (HomeRun Engine) */}
        {form.category && form.subcategory && (() => {
          const config = getCategoryAttributeConfig(form.category, form.subcategory);
          const fields = config.fields || [];
          if (!fields.length) return null;

          const renderFieldCard = (key) => {
            const def = ATTRIBUTE_FIELD_DEFS[key] || {
              icon: '⚙️',
              label: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
              eg: `Enter ${key.replace(/_/g, ' ')}...`,
              placeholder: `e.g. ${key.replace(/_/g, ' ')}`,
            };
            const valList = Array.isArray(config[key]) ? config[key] : [];
            const currentVal = formAttributes[key] || '';

            return (
              <div key={key} className="shop-spec-card">
                <div>
                  <div className="shop-spec-card-head">
                    <label className="shop-spec-label">
                      <span>{def.icon}</span> {def.label}
                    </label>
                    {currentVal && (
                      <button
                        type="button"
                        onClick={() => setFormAttributes({ ...formAttributes, [key]: '' })}
                        className="shop-spec-clear-btn"
                        title="Clear selection"
                      >
                        ✕ Clear
                      </button>
                    )}
                  </div>
                  <div className="shop-spec-eg">{def.eg}</div>
                  <input
                    type="text"
                    placeholder={def.placeholder}
                    value={currentVal}
                    onChange={(e) => setFormAttributes({ ...formAttributes, [key]: e.target.value })}
                    className="shop-spec-input"
                  />
                </div>
                {valList.length > 0 && (
                  <div className="shop-spec-pills">
                    {valList.map((val) => {
                      const isSelected = currentVal.toLowerCase().trim() === val.toLowerCase().trim();
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setFormAttributes({ ...formAttributes, [key]: isSelected ? '' : val })}
                          className={`shop-spec-pill ${isSelected ? 'selected' : ''}`}
                        >
                          {isSelected && <span className="shop-spec-pill-check">✓</span>}
                          {val}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          };

          return (
            <div className="shop-admin-wide shop-spec-box">
              <div className="shop-spec-head">
                <div>
                  <div className="shop-spec-title-row">
                    <Sparkles size={17} className="shop-spec-sparkle-icon" />
                    <strong className="shop-spec-title">
                      {config.label}
                    </strong>
                  </div>
                  <small className="shop-spec-sub">
                    Fill specifications for {form.subcategory} so buyers on Shop Now can filter by these exact attributes.
                  </small>
                </div>
                <span className="shop-spec-badge">
                  <span>✓</span> Subcategory: {form.subcategory}
                </span>
              </div>

              <div className="shop-spec-grid">
                {fields.map((fKey) => renderFieldCard(fKey))}
              </div>
            </div>
          );
        })()}

        <label>
          <span>Quality Tier <span style={{ color: '#ef4444' }}>*</span></span>
          <select required value={form.quality_tier} onChange={(e) => setForm({ ...form, quality_tier: e.target.value })}>
            <option value="">Select quality tier</option>
            {QUALITY_TIER_OPTIONS.map((tier) => <option key={tier.value} value={tier.value}>{tier.label}</option>)}
          </select>
          <small>Used by the Budget Calculator to match this product to a Quality Package.</small>
        </label>
        <label>
          <span>Product Selling Price (₹) <span style={{ color: '#ef4444' }}>*</span></span>
          <input required type="number" min="0.01" max="99999999.99" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Enter fixed price (e.g. 450)" />
          <small>Required: Enter the selling price per unit.</small>
        </label>
        <label>
          <span>Product Discount Price (₹)</span>
          <input type="number" min="0" step="0.01" value={form.compare_at_price} onChange={(e) => setForm({ ...form, compare_at_price: e.target.value })} placeholder="Shows discount when above selling price" />
          <small>A discount badge is calculated automatically when this is above the Buy Now price.</small>
        </label>
        <label>
          <span>Brand</span>
          <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="e.g. UltraTech" />
        </label>
        <label>
          <span>Unit <span style={{ color: '#ef4444' }}>*</span></span>
          <select required value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
            <option value="">Select unit</option>
            {form.unit && !units.includes(form.unit) && <option value={form.unit}>{form.unit}</option>}
            {units.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
          </select>
        </label>
        <label>
          <span>Quantity available</span>
          <input type="number" min="0" step="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
        </label>
        <label className="shop-admin-wide">
          <span>Description</span>
          <textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </label>

        {/* Multi-Image Gallery Box */}
        <div className="shop-admin-wide shop-admin-gallery-box">
          <div className="shop-admin-gallery-head">
            <div>
              <strong>📸 Product Images ({imagesList.length})</strong>
              <div style={{ marginTop: 4 }}>
                {imagesList.length > 1 ? (
                  <span className="shop-admin-carousel-status multi">
                    ✨ Embla Auto-Swiper Active ({imagesList.length} images will auto-rotate on product view)
                  </span>
                ) : imagesList.length === 1 ? (
                  <span className="shop-admin-carousel-status single">
                    Static view (1 image uploaded — swiper disabled until 2+ images)
                  </span>
                ) : (
                  <span className="shop-admin-carousel-status single">
                    No images added yet. Upload files or paste URLs below.
                  </span>
                )}
              </div>
            </div>

            <div className="shop-admin-gallery-actions">
              <label className="shop-admin-upload-multi">
                {uploading ? 'Uploading...' : '📁 + Upload Images (Multiple)'}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMultipleUpload}
                  disabled={uploading}
                  hidden
                />
              </label>
            </div>
          </div>

          <div className="shop-admin-url-add">
            <input
              type="text"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Or paste image URL (https://...)"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addImageUrl();
                }
              }}
            />
            <button type="button" onClick={addImageUrl}>+ Add URL</button>
          </div>

          {imagesList.length > 0 && (
            <div className="shop-admin-gallery-grid">
              {imagesList.map((img, idx) => {
                const isCover = idx === 0;
                return (
                  <div key={`${img}-${idx}`} className={`shop-admin-gallery-item ${isCover ? 'is-cover' : ''}`}>
                    {isCover && <span className="shop-admin-gallery-cover-badge">Cover</span>}
                    <button
                      type="button"
                      className="shop-admin-gallery-del"
                      title="Remove image"
                      onClick={() => removeImage(idx)}
                    >
                      ✕
                    </button>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`Product ${idx + 1}`} className="shop-admin-gallery-img" />
                    {!isCover && (
                      <button
                        type="button"
                        className="shop-admin-gallery-set-cover"
                        onClick={() => setAsCover(idx)}
                      >
                        Set as Cover
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <details className="shop-admin-gallery-details">
            <summary>Bulk edit URLs / Manual raw list</summary>
            <div style={{ marginTop: 6 }}>
              <textarea
                rows="3"
                value={galleryText}
                onChange={(e) => {
                  const val = e.target.value;
                  setGalleryText(val);
                  const parsed = val.split('\n').map((l) => l.trim()).filter(Boolean);
                  setImagesList(parsed);
                  if (parsed.length > 0) {
                    setForm((curr) => ({ ...curr, image_url: parsed[0] }));
                  }
                }}
                placeholder="One URL per line..."
              />
            </div>
          </details>
        </div>

        <label className="shop-admin-wide">
          <span>Specifications (one Name: Value per line, optional)</span>
          <textarea rows="3" value={specsText} onChange={(e) => setSpecsText(e.target.value)} placeholder="Optional: e.g. Grade: PPC&#10;Pack size: 50 kg" />
          <small>Optional: Leave blank if not applicable, or enter specifications one per line.</small>
        </label>
        <label className="shop-admin-wide">
          <span>Bulk prices (one Quantity: Price per line, optional)</span>
          <textarea rows="3" value={bulkText} onChange={(e) => setBulkText(e.target.value)} placeholder="Optional: e.g. 10: 415&#10;30: 405" />
          <small>Optional: Leave blank if not offering bulk tier discounts.</small>
        </label>

        {/* Product Page Accordions Section: Highlights, FAQs & Returns Policy */}
        <div className="shop-admin-wide shop-spec-box shop-pdp-content-box">
          <div className="shop-spec-head">
            <div>
              <div className="shop-spec-title-row">
                <Sparkles size={17} className="shop-spec-sparkle-icon" />
                <strong className="shop-spec-title">
                  Shop Now Page Accordions (Highlights, FAQs &amp; Return Policy)
                </strong>
              </div>
              <small className="shop-spec-sub">
                Configure the dynamic accordions shown to buyers on the Shop Now product detail page.
              </small>
            </div>
            <span className="shop-spec-badge">
              <span>✓</span> Live on Product Page
            </span>
          </div>

          <div className="shop-pdp-sections-grid">
            {/* Section 1: Highlights */}
            <div className="shop-pdp-card">
              <div className="shop-pdp-card-head">
                <div>
                  <div className="shop-pdp-card-title">
                    <span className="shop-pdp-card-icon">✨</span>
                    <strong>1. Product Highlights (Key Bullets)</strong>
                  </div>
                  <div className="shop-pdp-card-sub">
                    Appears in the 1st accordion with verified checkmark badges.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={loadPresetHighlights}
                  className="shop-pdp-preset-btn"
                  title="Insert recommended construction highlights"
                >
                  ⚡ Preset Highlights
                </button>
              </div>

              <div className="shop-pdp-input-row">
                <input
                  type="text"
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addHighlightItem();
                    }
                  }}
                  placeholder="e.g. 100% Genuine &amp; Brand Certified Material"
                  className="shop-spec-input"
                />
                <button
                  type="button"
                  onClick={addHighlightItem}
                  className="shop-pdp-add-btn"
                >
                  + Add
                </button>
              </div>

              {highlights.length > 0 ? (
                <div className="shop-pdp-list">
                  {highlights.map((h, idx) => (
                    <div key={idx} className="shop-pdp-list-item">
                      <span className="shop-pdp-bullet-check">✓</span>
                      <span className="shop-pdp-item-text">{h}</span>
                      <button
                        type="button"
                        onClick={() => removeHighlightItem(idx)}
                        className="shop-pdp-del-btn"
                        title="Remove highlight"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="shop-pdp-empty-state">
                  No custom highlights added. (Default category specifications will be shown if left blank).
                </div>
              )}
            </div>

            {/* Section 2: FAQs */}
            <div className="shop-pdp-card">
              <div className="shop-pdp-card-head">
                <div>
                  <div className="shop-pdp-card-title">
                    <span className="shop-pdp-card-icon">❓</span>
                    <strong>2. Frequently Asked Questions (FAQs)</strong>
                  </div>
                  <div className="shop-pdp-card-sub">
                    Appears in the 3rd accordion (FAQs) on the product page.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={loadPresetFaqs}
                    className="shop-pdp-preset-btn"
                    title="Insert standard construction FAQs"
                  >
                    📋 Standard FAQs
                  </button>
                  <button
                    type="button"
                    onClick={addFaqItem}
                    className="shop-pdp-add-btn"
                  >
                    + Add Question
                  </button>
                </div>
              </div>

              {faqs.length > 0 ? (
                <div className="shop-pdp-faq-list">
                  {faqs.map((f, idx) => (
                    <div key={idx} className="shop-pdp-faq-card">
                      <div className="shop-pdp-faq-head">
                        <span className="shop-pdp-faq-num">Q{idx + 1}</span>
                        <input
                          type="text"
                          value={f.q}
                          onChange={(e) => updateFaqItem(idx, 'q', e.target.value)}
                          placeholder="Question: e.g. How should this material be stored?"
                          className="shop-spec-input shop-pdp-faq-q-input"
                        />
                        <button
                          type="button"
                          onClick={() => removeFaqItem(idx)}
                          className="shop-pdp-del-btn"
                          title="Remove FAQ"
                        >
                          ✕
                        </button>
                      </div>
                      <textarea
                        rows="2"
                        value={f.a}
                        onChange={(e) => updateFaqItem(idx, 'a', e.target.value)}
                        placeholder="Answer: e.g. Store in a dry elevated shed away from moisture..."
                        className="shop-pdp-faq-a-input"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="shop-pdp-empty-state">
                  No custom FAQs added. (Standard site FAQs will be displayed if left blank).
                </div>
              )}
            </div>

            {/* Section 3: Returns & Exchange Policy */}
            <div className="shop-pdp-card">
              <div className="shop-pdp-card-head">
                <div>
                  <div className="shop-pdp-card-title">
                    <span className="shop-pdp-card-icon">🔄</span>
                    <strong>3. Returns &amp; Exchange Policy</strong>
                  </div>
                  <div className="shop-pdp-card-sub">
                    Appears in the 4th accordion (Returns &amp; Exchange Policy).
                  </div>
                </div>
                <button
                  type="button"
                  onClick={loadPresetReturnsPolicy}
                  className="shop-pdp-preset-btn"
                  title="Insert 48-Hour Return Policy"
                >
                  📋 Standard Policy
                </button>
              </div>

              <textarea
                rows="4"
                value={returnsPolicy}
                onChange={(e) => setReturnsPolicy(e.target.value)}
                placeholder="e.g. Site Inspection: Customers can inspect quantity at unloading.&#10;Transit Damage: Damaged items reported on delivery challan replaced immediately.&#10;Unopened Materials: 48-hour return policy for unopened items."
                className="shop-pdp-policy-textarea"
              />
              <div className="shop-pdp-hint">
                Tip: Leave blank to use MT-Boss standard construction return &amp; replacement policy.
              </div>
            </div>
          </div>
        </div>
        <fieldset className="shop-admin-wide shop-admin-city-field">
          <legend>Delivery cities for this product</legend>
          <div>
            {cities.map((city) => (
              <label key={city}>
                <input
                  type="checkbox"
                  checked={form.available_cities.includes(city)}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      available_cities: event.target.checked
                        ? [...form.available_cities, city]
                        : form.available_cities.filter((item) => item !== city),
                    })
                  }
                />{' '}
                {city}
              </label>
            ))}
          </div>
          <small>Select the cities where this product can actually be delivered.</small>
        </fieldset>
      </div>
      <div className="shop-admin-form-footer">
        <label className="shop-admin-check">
          <input
            type="checkbox"
            checked={form.is_available}
            onChange={(e) => setForm({ ...form, is_available: e.target.checked })}
          />{' '}
          Show on Shop Now
        </label>
        <label className="shop-admin-check">
          <input
            type="checkbox"
            checked={form.is_featured_deal}
            onChange={(e) => setForm({ ...form, is_featured_deal: e.target.checked })}
          />{' '}
          Feature in Deals of the Week
        </label>
        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add product'}
        </button>
        <button type="button" onClick={reset}>
          Cancel
        </button>
      </div>
    </form>
      </>
    ) : (
      <>
        <div className="shop-admin-heading">
          <div>
            <h2>{isSeller ? 'My products' : 'Products'}</h2>
            <p>Enter product details and fixed Buy Now price.{!isSeller && ' Supplier and vendor uploads appear here too.'}</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              type="button"
              onClick={startAddProduct}
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
                fontSize: 13
              }}
            >
              <Plus size={16} /> Add Product
            </button>
            <button type="button" onClick={load}>Refresh</button>
          </div>
        </div>
        {notice && <p className="shop-admin-notice" role="status">{notice}</p>}
        <div className="shop-admin-card"><div className="shop-admin-list-head"><h3>{isSeller ? 'My products' : 'All products'} ({isSeller ? products.length : productPagination.total})</h3><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>{!isSeller && <input value={productSearch} onChange={(e) => setProductSearch(e.target.value)} placeholder="Search products…" style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', minWidth: 180 }} />}<label className="shop-admin-tier-filter">Quality Tier<select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)}><option value="any">All products</option><option value="none">No Quality Tier set</option>{QUALITY_TIER_OPTIONS.map((tier) => <option key={tier.value} value={tier.value}>{tier.value === 'all' ? 'All tiers' : tier.label}</option>)}</select></label></div></div>{loading ? <p>Loading products...</p> : !products.length ? <p>No products yet. Add the first product above.</p> : !visibleProducts.length ? <p>No products match this Quality Tier filter.</p> : <div className="shop-admin-table-wrap"><table><thead><tr><th>Product</th><th>Category</th><th>Quality</th><th>Get Quote range</th><th>Buy Now price / unit</th>{!isSeller && <th>Discount</th>}{!isSeller && <th>Source</th>}<th>Status</th><th>Actions</th></tr></thead><tbody>{visibleProducts.map((product) => { const price = Number(product.price); const originalPrice = Number(product.compare_at_price); const discountPercent = originalPrice > price && price > 0 ? Math.round(((originalPrice - price) / originalPrice) * 100) : null; return <tr key={product.id}><td><strong>{product.name}</strong>{product.description && <small>{product.description}</small>}</td><td>{product.category || 'Unassigned'}</td><td>{qualityTierLabel(product.quality_tier) || <span className="shop-admin-tier-missing">Not set</span>}</td><td>{product.quote_price_range ? `₹${product.quote_price_range}` : '—'}</td><td>{price > 0 ? `₹${price.toLocaleString('en-IN')} / ${product.unit || 'unit'}` : <span style={{ color: '#d97706', fontWeight: 600 }}>Price on request</span>}</td>{!isSeller && <td>{discountPercent === null ? '—' : `${discountPercent}% OFF`}</td>}{!isSeller && <td>{product.vendor_id ? `Vendor #${product.vendor_id}` : product.supplier_id === 0 ? 'Admin' : `Supplier #${product.supplier_id}`}</td>}<td>{isSeller ? (() => {
  const approval = product.specifications?.__approval__;
  const status = approval?.status || 'approved';
  if (status === 'pending') {
    return <span className="shop-approval-badge badge-pending" title="Awaiting admin approval">⏳ Pending approval</span>;
  }
  if (status === 'rejected') {
    return (
      <div className="shop-approval-rejected-wrap">
        <span className="shop-approval-badge badge-rejected" title={approval?.rejection_reason || 'Rejected by admin'}>✕ Rejected</span>
        {approval?.rejection_reason && (
          <small className="shop-approval-reason" title={approval.rejection_reason}>
            Reason: {approval.rejection_reason}
          </small>
        )}
      </div>
    );
  }
  return <span className="shop-approval-badge badge-approved" title="Approved by admin">✓ Approved {product.is_available ? '' : '(Hidden)'}</span>;
})() : (product.is_available ? 'Visible' : 'Hidden')}</td><td><div className="shop-admin-actions"><button type="button" onClick={() => edit(product)}>Edit</button>{(!isSeller || !product.specifications?.__approval__?.status || product.specifications.__approval__.status === 'approved') && <button type="button" onClick={() => toggle(product)}>{product.is_available ? 'Hide' : 'Show'}</button>}<button type="button" onClick={() => remove(product)}>Delete</button></div></td></tr>; })}</tbody></table></div>}
    {!isSeller && !loading && productPagination.pages > 1 ? (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>Page {productPagination.page} of {productPagination.pages}</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button type="button" disabled={productPage <= 1} onClick={() => setProductPage((p) => Math.max(1, p - 1))}>Prev</button>
          <button type="button" disabled={productPage >= productPagination.pages} onClick={() => setProductPage((p) => p + 1)}>Next</button>
        </div>
      </div>
    ) : null}
    </div>
      </>
    )}
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
        window.dispatchEvent(new Event('MTBOSSShopProductsUpdated'));
      }
      setNotice('Storefront content saved successfully.');
    } catch (error) { setNotice(error.message); }
    finally { setSaving(false); }
  };

  const [newHeroUrl, setNewHeroUrl] = useState('');

  const updatePromo = (index, field, value) => setContent((current) => ({ ...current, promos: current.promos.map((promo, i) => i === index ? { ...promo, [field]: value } : promo) }));

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setContent((current) => {
        const existing = Array.isArray(current.hero_images) ? current.hero_images : [current.hero_image].filter(Boolean);
        return {
          ...current,
          hero_image: imageUrl,
          hero_images: [...existing, imageUrl],
        };
      });
    }
    catch (error) { setNotice(error.message); }
    finally { setUploading(false); event.target.value = ''; }
  };

  const addHeroImageUrl = () => {
    if (!newHeroUrl.trim()) return;
    setContent((current) => {
      const existing = Array.isArray(current.hero_images) ? current.hero_images : [current.hero_image].filter(Boolean);
      return {
        ...current,
        hero_images: [...existing, newHeroUrl.trim()],
      };
    });
    setNewHeroUrl('');
  };

  const removeHeroImage = (idx) => {
    setContent((current) => {
      const existing = Array.isArray(current.hero_images) ? current.hero_images : [];
      const updated = existing.filter((_, i) => i !== idx);
      return {
        ...current,
        hero_images: updated,
        hero_image: updated[0] || '',
      };
    });
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
              Banner primary image URL
              <input
                value={content.hero_image ?? ''}
                onChange={(e) => setContent({ ...content, hero_image: e.target.value })}
              />
            </label>
          </div>

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
            <strong style={{ display: 'block', marginBottom: 10, fontSize: 13, color: '#1e293b' }}>
              🔄 Auto-Scroll Banner Images ({Array.isArray(content.hero_images) ? content.hero_images.length : 0})
            </strong>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
              These images automatically scroll in the banner on the Shop Now page.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              {(Array.isArray(content.hero_images) ? content.hero_images : []).map((imgUrl, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'relative',
                    width: 100,
                    height: 70,
                    borderRadius: 8,
                    overflow: 'hidden',
                    border: '2px solid #cbd5e1',
                    background: '#f1f5f9',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgUrl}
                    alt={`Banner ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button
                    type="button"
                    onClick={() => removeHeroImage(idx)}
                    title="Remove image"
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      background: 'rgba(239, 68, 68, 0.9)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50%',
                      width: 20,
                      height: 20,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 'bold',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                    }}
                  >
                    ✕
                  </button>
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 3,
                      left: 4,
                      background: 'rgba(15, 23, 42, 0.75)',
                      color: '#fff',
                      fontSize: 9,
                      fontWeight: 700,
                      padding: '1px 5px',
                      borderRadius: 4,
                    }}
                  >
                    #{idx + 1}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="url"
                placeholder="Paste Cloudinary / image URL to add..."
                value={newHeroUrl}
                onChange={(e) => setNewHeroUrl(e.target.value)}
                style={{ flex: '1 1 280px', minWidth: 200 }}
              />
              <button
                type="button"
                onClick={addHeroImageUrl}
                className="shop-admin-button"
                style={{ padding: '8px 16px', fontWeight: 700 }}
              >
                + Add Image URL
              </button>
              <label className="shop-admin-upload" style={{ margin: 0 }}>
                {uploading ? 'Uploading...' : 'Upload Image'}
                <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} hidden />
              </label>
            </div>
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
  const loadCategories = useCallback(async () => {
    try {
      const categoriesRes = await fetch('/api/shop-categories?admin=true', { headers: shopHeaders() });
      const categoriesData = await readApiJson(categoriesRes);
      if (categoriesRes.ok) setCategories(categoriesData.data || []);
    } catch { /* optional for offer form */ }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const offersRes = await fetch('/api/shop-offers?admin=true', { headers: shopHeaders() });
      const offersData = await readApiJson(offersRes);
      if (!offersRes.ok) throw new Error(offersData.error || 'Could not load offers');
      setOffers(offersData.data || []);
    } catch (error) { setNotice(error.message); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { loadCategories(); }, [loadCategories]);
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
      <label>
        <span>Offer name <span style={{ color: '#ef4444' }}>*</span></span>
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Cement sale" />
      </label>
      <label>Category<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value, subcategory: '' })}><option value="">All categories</option>{categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}</select></label>
      <label>Subcategory<select value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} disabled={!form.category}><option value="">All subcategories</option>{subcategories.map((item) => { const name = typeof item === 'object' && item !== null ? item.name : item; return <option key={name} value={name}>{name}</option>; })}</select></label>
      <label>Brand<input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="e.g. UltraTech" /></label>
      <label>Discount type<select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })}><option value="percent">Percentage</option><option value="fixed">Fixed amount</option></select></label>
      <label>
        <span>Discount value <span style={{ color: '#ef4444' }}>*</span></span>
        <input required type="number" min="0.01" step="0.01" max={form.discount_type === 'percent' ? '100' : undefined} value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: e.target.value })} />
      </label>
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
  const router = useRouter();

  const openAddProduct = () => {
    if (router) {
      router.push('/dashboard?tab=shop-products&action=add');
    } else if (typeof window !== 'undefined') {
      window.location.href = '/dashboard?tab=shop-products&action=add';
    }
  };

  return <div className={`shop-admin-root ${isDarkMode ? 'dark-mode dark' : ''}`}>
    <div className="shop-admin-toolbar"><div><h2>Shop Now Manager</h2><p>Add products and manage what customers see on Shop Now.</p></div><button type="button" onClick={openAddProduct}>+ Add Product</button></div>
    <div className="shop-admin-tabs" role="tablist" aria-label="Shop Now management">
      <button type="button" role="tab" aria-selected={tab === 'categories'} className={tab === 'categories' ? 'active' : ''} onClick={() => setTab('categories')}>Categories</button>
      <button type="button" role="tab" aria-selected={tab === 'content'} className={tab === 'content' ? 'active' : ''} onClick={() => setTab('content')}>Storefront Content</button>
      <button type="button" role="tab" aria-selected={tab === 'coupons'} className={tab === 'coupons' ? 'active' : ''} onClick={() => setTab('coupons')}>Promotions & Coupons</button>
    </div>
    <Suspense fallback={<p>Loading shop panel…</p>}>
      {tab === 'categories' && <ShopCategoriesManager isDarkMode={isDarkMode} />}
      {tab === 'products' && <ProductManager isDarkMode={isDarkMode} />}
      {tab === 'content' && <AppearanceManager />}
      {tab === 'coupons' && <ShopCouponsManager />}
    </Suspense>

    <style jsx>{`
      .shop-admin-root {
        font-family: Arial, Helvetica, sans-serif !important;
      }
      .shop-admin-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 18px;
      }
      .shop-admin-toolbar h2 {
        font: 800 24px Arial, sans-serif !important;
        color: var(--shop-admin-text, #1d2939);
        margin: 0 0 5px;
      }
      .shop-admin-toolbar p {
        font: 13px Arial, sans-serif !important;
        color: var(--shop-admin-muted, #667085);
        margin: 0;
      }
      .shop-admin-toolbar button {
        flex: none;
        padding: 12px 18px !important;
        border: 1px solid var(--brand-blue, #2196F3) !important;
        border-radius: 8px !important;
        background: var(--brand-blue, #2196F3) !important;
        color: #fff !important;
        font: 800 13px Arial, sans-serif !important;
        cursor: pointer;
      }
      .shop-admin-tabs {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 24px;
        border-bottom: 1px solid var(--shop-admin-border, #dce3eb);
        padding-bottom: 12px;
      }
      .shop-admin-tabs button {
        padding: 10px 16px !important;
        border: 1px solid var(--shop-admin-border, #dce3eb) !important;
        background: var(--shop-admin-bg, #fff) !important;
        color: var(--shop-admin-text, #1d2939) !important;
        border-radius: 8px !important;
        font: 700 13px Arial, sans-serif !important;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .shop-admin-tabs button:hover {
        border-color: #94a3b8 !important;
      }
      .shop-admin-tabs button.active {
        background: var(--brand-blue, #2196F3) !important;
        border-color: var(--brand-blue, #2196F3) !important;
        color: #fff !important;
      }
    `}</style>
  </div>;
}

export function VendorShopProductsManager({ isDarkMode = false }) {
  return <div className={`shop-admin-root ${isDarkMode ? 'dark-mode dark' : ''}`}>
    <VendorCommissionSummary isDarkMode={isDarkMode} />
    <ProductManager ownerRole="vendor" formId="vendor-shop-product-form" isDarkMode={isDarkMode} />
  </div>;
}

export function ShopProductsManager({ isDarkMode = false }) {
  const searchParams = useSearchParams();
  const showForm = searchParams ? searchParams.get('action') === 'add' : false;

  return (
    <div className={`shop-admin-root ${isDarkMode ? 'dark-mode dark' : ''}`}>
      <ProductManager ownerRole="admin" formId="shop-product-form" initialShowForm={showForm} isDarkMode={isDarkMode} />
    </div>
  );
}

export function SupplierShopProductsManager({ isDarkMode = false }) {
  const searchParams = useSearchParams();
  const showForm = searchParams ? searchParams.get('action') === 'add' : false;

  return (
    <div className={`shop-admin-root ${isDarkMode ? 'dark-mode dark' : ''}`}>
      <ProductManager ownerRole="supplier" formId="supplier-shop-product-form" initialShowForm={showForm} isDarkMode={isDarkMode} />
    </div>
  );
}
