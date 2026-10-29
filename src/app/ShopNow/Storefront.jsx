"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, CheckCircle2, ChevronDown, ClipboardList, Grid3X3,
  Hammer, MapPin, Minus, Mountain, Package, PaintBucket, Plus,
  Search, ShieldCheck, ShoppingCart, Truck, Wallet, Wrench, X,
} from "lucide-react";
import "./shop.css";
import ShopCategoryNav from "./ShopCategoryNav";
import { CATEGORY_NAV_TREE } from "./categoryNavTree";
import MobileStorefront from "./MobileStorefront";
import ProductGalleryCarousel from "./ProductGalleryCarousel";
import AutoSwipeGallery from "./AutoSwipeGallery";
import HeroBannerGallery from "./HeroBannerGallery";
import { defaultHeroImages } from "@/lib/shop-storefront-defaults";
import { getCartStep } from "@/lib/cart-step";
export function normalizeShopImageUrl(value) {
  const imageUrl = String(value || '').trim();
  if (!imageUrl) return '';
  if (/^(?:https?:|data:image\/|blob:|\/)/i.test(imageUrl)) return imageUrl;
  if (/^(?:www\.)/i.test(imageUrl)) return `https://${imageUrl}`;
  // Older product records sometimes contain `uploads/file.jpg` without the
  // leading slash, which would otherwise resolve relative to /ShopNow.
  return `/${imageUrl}`;
}

function imageValue(value) {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') return value.secure_url || value.url || value.image_url || '';
  return '';
}

export function getProductImage(product, category = null) {
  if (!product || typeof product !== 'object') return '';
  const direct = [product.image, product.image_url, product.imageUrl, product.product_image]
    .map(imageValue).find(Boolean);
  if (direct) return normalizeShopImageUrl(direct);
  const gallery = Array.isArray(product.images) ? product.images : [];
  const galleryImage = gallery.map(imageValue).find(Boolean);
  if (galleryImage) return normalizeShopImageUrl(galleryImage);

  if (Array.isArray(category)) {
    const catName = typeof product.category === 'object' ? product.category?.name : product.category;
    const found = category.find((c) => c.name?.toLowerCase() === String(catName || '').trim().toLowerCase());
    if (found?.image) return normalizeShopImageUrl(imageValue(found.image));
  }
  const cat = (category && !Array.isArray(category)) ? category : (typeof product.category === 'object' ? product.category : null);
  if (cat?.image) return normalizeShopImageUrl(imageValue(cat.image));
  return '';
}

export function ShopImage({ src, alt = '', className = '', ...props }) {
  const normalizedSrc = normalizeShopImageUrl(src);
  if (!normalizedSrc) return null;

  const isPng = typeof normalizedSrc === 'string' && (/\.png(\?|$)/i.test(normalizedSrc) || normalizedSrc.toLowerCase().includes('.png') || normalizedSrc.includes('image/png'));
  const combinedClassName = [className, isPng ? 'is-png-image' : ''].filter(Boolean).join(' ');

  const isExternal = /^https?:\/\//i.test(normalizedSrc);
  let isNextImageSafe = !isExternal;
  try {
    const hostname = new URL(normalizedSrc).hostname;
    isNextImageSafe = hostname === 'res.cloudinary.com'
      || hostname === 'images.unsplash.com'
      || hostname.endsWith('pinimg.com');
  } catch {
    isNextImageSafe = !isExternal;
  }

  // Product URLs can point to any supplier's CDN. Use a regular image for
  // those URLs so Next.js remote-host allowlisting cannot hide valid images.
  if (isExternal && !isNextImageSafe) {
    const { fill, sizes, quality, priority, unoptimized, style, ...imgProps } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img
      {...imgProps}
      className={combinedClassName}
      src={normalizedSrc}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      style={{
        ...(fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } : {}),
        ...style,
      }}
    />;
  }

  return <Image src={normalizedSrc} alt={alt} className={combinedClassName} {...props} unoptimized={!isNextImageSafe} />;
}

function OptimizedImage({ src, alt = '', ...props }) {
  let unoptimized = false;
  try {
    if (!String(src).startsWith('/')) {
      const hostname = new URL(src).hostname;
      unoptimized = hostname !== 'res.cloudinary.com' && hostname !== 'images.unsplash.com' && !hostname.endsWith('pinimg.com');
    }
  } catch {
    unoptimized = true;
  }
  return <ShopImage src={src} alt={alt} unoptimized={unoptimized} {...props} />;
}

function categoryStyle(name = "") {
  const value = name.toLowerCase();
  if (/cement|concrete/.test(value)) return { tone: "sand", Icon: Package };
  if (/steel|iron|tmt/.test(value)) return { tone: "blue", Icon: Wrench };
  if (/sand|gravel|aggregate/.test(value)) return { tone: "cream", Icon: Mountain };
  if (/brick|block/.test(value)) return { tone: "coral", Icon: Hammer };
  if (/paint|colour/.test(value)) return { tone: "mint", Icon: PaintBucket };
  if (/tile|floor/.test(value)) return { tone: "lavender", Icon: Grid3X3 };
  return { tone: "green", Icon: Package };
}

function ProductVisual({ image, category, name, compact = false }) {
  const { tone, Icon } = categoryStyle(category?.name || name);
  return (
    <div className={`store-visual store-visual-${tone}${compact ? " store-visual-compact" : ""}`}>
      {image || category?.image ? (
        <OptimizedImage
          src={image || category.image}
          alt={name}
          fill
          sizes={compact ? '68px' : '(max-width: 560px) 50vw, (max-width: 1100px) 25vw, 220px'}
          quality={70}
        />
      ) : (
        <><span className="store-visual-ring" /><Icon size={compact ? 27 : 54} strokeWidth={1.4} aria-hidden="true" /></>
      )}
    </div>
  );
}

function unitPrice(product, quantity = 1) {
  const base = Number(product.price) || 0;
  const tier = (product.bulk_pricing || []).filter((entry) => quantity >= Number(entry.min_quantity)).sort((a, b) => Number(b.min_quantity) - Number(a.min_quantity))[0];
  return tier ? Number(tier.price) : base;
}

export function displayUnit(value, fallback = 'unit') {
  return String(value || '').trim().replace(/^per\s+/i, '') || fallback;
}

function productCanOrder(product, selectedCity) {
  const normalizedCity = selectedCity.trim().toLowerCase();
  const cityUnavailable = Boolean(normalizedCity && product.available_cities?.length && !product.available_cities.some((city) => city.trim().toLowerCase() === normalizedCity));
  return !cityUnavailable && (!product.fromSupplier || Number(product.quantity) > 0);
}

function discountPercent(product) {
  const price = Number(product?.price);
  const originalPrice = Number(product?.compare_at_price);
  return originalPrice > price && price > 0
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;
}

function offerMatches(offer, product, category) {
  const same = (left, right) => !left || String(left).trim().toLowerCase() === String(right || '').trim().toLowerCase();
  return same(offer.category, category?.name) && same(offer.subcategory, product.subcategory) && same(offer.brand, product.brand);
}

function applyOffer(product, offer) {
  if (!offer || !(Number(product.price) > 0)) return product;
  const basePrice = Number(product.price);
  const discount = offer.discount_type === 'fixed'
    ? Number(offer.discount_value)
    : basePrice * Number(offer.discount_value) / 100;
  const salePrice = Math.max(0.01, Number((basePrice - discount).toFixed(2)));
  if (salePrice >= basePrice) return product;
  const percent = Math.round(((basePrice - salePrice) / basePrice) * 100);
  return {
    ...product,
    price: salePrice,
    compare_at_price: Math.max(Number(product.compare_at_price) || 0, basePrice),
    offer: { ...offer, display_badge: offer.badge_text || `${percent}% OFF` },
  };
}

function ProductCard({ product, quantity, canAdd, onAdd, onChangeQty, onQuote, onBuy, selectedCity }) {
  const productImage = getProductImage(product, product.category);
  const price = Number(product.price);
  const hasFixedPrice = Number.isFinite(price) && price > 0;
  const discount = discountPercent(product);
  const normalizedCity = selectedCity.trim().toLowerCase();
  const cityUnavailable = Boolean(normalizedCity && product.available_cities?.length && !product.available_cities.some((city) => city.trim().toLowerCase() === normalizedCity));
  const canOrder = productCanOrder(product, selectedCity);
  const detailId = product.product_id || (String(product.id).startsWith('supplier-') ? product.id.replace('supplier-', '') : product.id);
  const detailHref = `/ShopNow/${detailId}`;
  return (
    <article className="store-product-card">
      {(product.offer?.display_badge || discount > 0) && (
        <span className="store-discount-badge">{product.offer?.display_badge || `${discount}% OFF`}</span>
      )}
      <Link
        href={detailHref}
        target="_blank"
        rel="noopener noreferrer"
        className="store-product-image-button"
        aria-label={`View ${product.name} details`}
      >
        <ProductVisual image={productImage} category={product.category} name={product.name} />
      </Link>
      <div className="store-product-details">
        <span className={`store-product-tag ${!canOrder ? 'store-product-tag-unavailable' : ''}`}>
          {canOrder ? 'Available' : 'Unavailable'}
        </span>
        <Link
          href={detailHref}
          target="_blank"
          rel="noopener noreferrer"
          className="store-product-title"
        >
          <h3>{product.name}</h3>
        </Link>
        <p className="store-product-category">{(typeof product.category === 'object' ? product.category?.name : product.category) || ''}{product.unit ? ` · ${product.unit}` : ""}</p>
        <div className="store-product-price-slot">
          {hasFixedPrice ? (
            <div className="store-product-price">
              <strong>₹{price.toLocaleString('en-IN')} / {displayUnit(product.unit)}</strong>
              {Number(product.compare_at_price) > price && <del>₹{Number(product.compare_at_price).toLocaleString('en-IN')}</del>}
            </div>
          ) : null}
        </div>
        <div className="store-product-footer">
          {cityUnavailable && <span className="store-stock-note">Not delivered in {selectedCity}</span>}
          {product.fromSupplier && Number(product.quantity) === 0 && <span className="store-stock-note">Currently unavailable</span>}
          <div className="store-product-actions store-product-actions-single">
            <button type="button" className="store-buy-btn" disabled={!canOrder} onClick={() => onBuy(product)}>{canOrder ? 'Buy Now' : 'Unavailable'}</button>
          </div>
          {quantity ? (
            <div className="store-quantity-control" aria-label={`${product.name} quantity in cart`}>
              <button type="button" onClick={() => onChangeQty(product.id, -1)} aria-label={`Remove one ${product.name}`}><Minus size={15} /></button>
              <span>{quantity} in cart</span>
              <button type="button" onClick={() => onChangeQty(product.id, 1)} aria-label={`Add one ${product.name}`}><Plus size={15} /></button>
            </div>
          ) : (
            <button type="button" className="store-add-btn" disabled={!canAdd || !canOrder} onClick={(e) => onAdd(product, e)}><Plus size={15} /> {!canOrder ? 'Unavailable' : canAdd ? "Add to cart" : "Cart limit reached"}</button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Storefront({ categories, products, offers = [], content, loading, cities, selectedCity, setSelectedCity, cart, onAdd, onChangeQty, onQuote, onBuy, onCheckout, activeCoupon, couponCalculation, couponOffers, onApplyCoupon, onSelectCoupon, onClearCoupon, shippingSettings, shippingQuote }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [cartOpen, setCartOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [productManagerHref, setProductManagerHref] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [brandFilter, setBrandFilter] = useState('all');
  const [cartOverlayTop, setCartOverlayTop] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [couponNotice, setCouponNotice] = useState('');
  const [offersOpen, setOffersOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [cashbackPreview, setCashbackPreview] = useState(null);
  const searchScrolled = useRef(false);
  const catalogScrollFrame = useRef(null);
  const storeHeaderRef = useRef(null);

  const effectiveCashbackPreview = (Array.isArray(cart) && cart.length > 0) ? cashbackPreview : null;

  useEffect(() => {
    if (!Array.isArray(cart) || cart.length === 0) {
      return;
    }
    const token = localStorage.getItem('token');
    const items = cart.map((item) => ({
      product_id: item.product?.product_id || item.product?.id,
      category_id: item.product?.category?.id,
      category_name: item.product?.category?.name || item.product?.category,
      price: Number(item.product?.price) || 0,
      quantity: Number(item.quantity) || 1,
      total: (Number(item.product?.price) || 0) * (Number(item.quantity) || 1),
    }));

    const subtotal = cart.reduce((sum, it) => sum + (Number(it.product?.price) || 0) * (Number(it.quantity) || 1), 0);
    const discount = (activeCoupon && couponCalculation?.eligible) ? (Number(couponCalculation.discount) || 0) : 0;

    fetch('/api/cashback/preview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        items,
        subtotal,
        coupon_discount: discount,
        coupon_code: activeCoupon?.code || '',
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) setCashbackPreview(d.data);
      })
      .catch(() => {});
  }, [cart, activeCoupon, couponCalculation]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/wallet', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => {
          if (r.status === 401) {
            // Stale or invalid token
            return null;
          }
          return r.ok ? r.json() : null;
        })
        .then((d) => {
          if (d?.success && d?.data) {
            setWalletBalance(Number(d.data.balance) || 0);
          }
        })
        .catch(() => {});
    }
  }, []);

  // When user types a search term, scroll the catalog into view automatically
  useEffect(() => {
    const term = search.trim();
    if (term && !searchScrolled.current) {
      searchScrolled.current = true;
      // Small delay lets React render the filtered results before scrolling
      const id = setTimeout(() => {
        document.getElementById('store-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
      return () => clearTimeout(id);
    }
    if (!term) searchScrolled.current = false;
  }, [search]);

  // Scroll-lock: add .shop-is-scrolling to .shop-page while scrolling so CSS
  // :hover never sticks on product/category cards during wheel or trackpad scroll.
  // 500ms delay ensures the hover state fully clears before pointer-events are restored.
  useEffect(() => {
    const page = document.querySelector('.shop-page');
    if (!page) return;
    let timer = null;
    const onScroll = () => {
      page.classList.add('shop-is-scrolling');
      clearTimeout(timer);
      timer = setTimeout(() => page.classList.remove('shop-is-scrolling'), 500);
    };
    // Listen on both window and document to catch all scroll events
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('scroll', onScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('scroll', onScroll, { capture: true });
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => () => {
    if (catalogScrollFrame.current) cancelAnimationFrame(catalogScrollFrame.current);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get('category');
    const query = params.get('q') || '';
    const match = categories.find((category) => category.name.toLowerCase() === requested?.toLowerCase());
    if (!match && !query) return undefined;
    const frame = requestAnimationFrame(() => {
      if (match) setActiveCategory(match.id);
      if (query) setSearch(query);
    });
    return () => cancelAnimationFrame(frame);
  }, [categories]);

  useEffect(() => {
    const checkProductManagerAccess = () => {
      let hasAdminRole = false;
      try { hasAdminRole = JSON.parse(localStorage.getItem('user') || '{}').role === 'admin'; }
      catch { /* Ignore stale user data. */ }
      const hasAdminAccess = Boolean(localStorage.getItem('admin-token')) || (Boolean(localStorage.getItem('token')) && hasAdminRole);
      if (hasAdminAccess) setProductManagerHref('/dashboard?tab=shop-products');
      else if (localStorage.getItem('vendor-token')) setProductManagerHref('/vendor/dashboard?tab=products');
      else setProductManagerHref('');
    };
    const frame = requestAnimationFrame(checkProductManagerAccess);
    window.addEventListener('storage', checkProductManagerAccess);
    window.addEventListener('userLoggedIn', checkProductManagerAccess);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('storage', checkProductManagerAccess);
      window.removeEventListener('userLoggedIn', checkProductManagerAccess);
    };
  }, []);

  const catalog = useMemo(() => {
    const fromCategories = categories.flatMap((category) => {
      const listed = products.filter((product) => {
        const prodCat = (typeof product.category === 'object' ? product.category?.name : product.category) || '';
        const assignedCategory = prodCat.trim().toLowerCase();
        const categoryName = (category.name || '').trim().toLowerCase();
        if (!assignedCategory) return product.name?.toLowerCase().includes(categoryName);
        return assignedCategory === categoryName ||
          assignedCategory.replace(/\s+/g, '') === categoryName.replace(/\s+/g, '') ||
          assignedCategory.replace(/&/g, 'and') === categoryName.replace(/&/g, 'and');
      });
      if (listed.length) return listed.map((product) => ({
        id: `supplier-${product.id}`,
        product_id: product.id,
        name: product.name,
        category,
        subcategory: product.subcategory,
        unit: product.unit || category.unit || "unit",
        price: product.price,
        image: product.image_url || category?.image || "",
        description: product.description,
        quote_price_range: product.quote_price_range,
        brand: product.brand,
        compare_at_price: product.compare_at_price,
        is_featured_deal: product.is_featured_deal === true,
        images: product.images,
        specifications: product.specifications,
        bulk_pricing: product.bulk_pricing,
        quantity: product.quantity,
        supplier_id: product.supplier_id,
        available_cities: product.available_cities,
        created_at: product.created_at,
        fromSupplier: true,
      })).map((product) => {
        const matchingOffers = offers.filter((offer) => offerMatches(offer, product, category));
        const offer = matchingOffers.sort((a, b) => {
          const score = (item) => (item.category ? 4 : 0) + (item.subcategory ? 2 : 0) + (item.brand ? 1 : 0);
          return score(b) - score(a) || Number(a.sort_order) - Number(b.sort_order);
        })[0];
        return applyOffer(product, offer);
      });
      // Subcategories are categories/filters, not products. Only real products should be displayed.
      return [];
    });

    const mappedProductIds = new Set(fromCategories.map((p) => p.product_id || p.id));
    const extraProducts = products
      .filter((p) => p && !mappedProductIds.has(p.id) && !mappedProductIds.has(`supplier-${p.id}`))
      .map((product) => {
        const syntheticCategory = {
          id: `custom-${product.category || 'other'}`,
          name: product.category || 'Other Materials',
          image: product.image_url || '',
          unit: product.unit || 'unit',
        };
        const item = {
          id: `supplier-${product.id}`,
          product_id: product.id,
          name: product.name,
          category: syntheticCategory,
          subcategory: product.subcategory,
          unit: product.unit || "unit",
          price: product.price,
          image: product.image_url || "",
          description: product.description,
          quote_price_range: product.quote_price_range,
          brand: product.brand,
          compare_at_price: product.compare_at_price,
          is_featured_deal: product.is_featured_deal === true,
          images: product.images,
          specifications: product.specifications,
          bulk_pricing: product.bulk_pricing,
          quantity: product.quantity,
          supplier_id: product.supplier_id,
          available_cities: product.available_cities,
          created_at: product.created_at,
          fromSupplier: true,
        };
        const matchingOffers = offers.filter((offer) => offerMatches(offer, item, syntheticCategory));
        const offer = matchingOffers[0];
        return applyOffer(item, offer);
      });

    return [...fromCategories, ...extraProducts];
  }, [categories, products, offers]);

  const dedupeProducts = (list) => {
    const seen = new Set();
    return list.filter((p) => {
      const k = p?.product_id ? `supplier-${p.product_id}` : p?.id;
      if (!k || seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  };

  const searchTerm = search.trim().toLowerCase();
  const visible = dedupeProducts(catalog.filter((product) => {
    const catId = product.category?.id != null ? String(product.category.id) : '';
    const catName = (typeof product.category === 'object' ? product.category?.name : (product.category || '')).toLowerCase().trim();
    const activeCatObj = categories.find((c) => String(c.id) === String(activeCategory));
    const activeCatName = activeCatObj ? activeCatObj.name.toLowerCase().trim() : String(activeCategory).toLowerCase().trim();
    const matchesCategory = activeCategory === "all"
      || catId === String(activeCategory)
      || (activeCatObj && catId === String(activeCatObj.id))
      || catName === activeCatName;
    const matchesBrand = brandFilter === 'all' || product.brand === brandFilter;

    if (!matchesCategory || !matchesBrand) return false;
    if (!searchTerm) return true;

    const subName = (product.subcategory || '').toLowerCase();
    const prodName = (product.name || '').toLowerCase();
    const brandName = (product.brand || '').toLowerCase();
    const searchableText = `${prodName} ${catName} ${subName} ${brandName}`;

    // Direct substring
    if (searchableText.includes(searchTerm)) return true;

    // Word/alias match for subcategory searches like "Hinges, Channels & Handles"
    const searchWords = searchTerm.split(/[\s,&/]+/).filter((w) => w.length > 2);
    if (searchWords.length > 0 && searchWords.some((word) => subName.includes(word) || prodName.includes(word))) {
      return true;
    }

    if (subName && searchTerm.includes(subName)) return true;

    return false;
  }).sort((a, b) => sortBy === 'price-asc' ? (Number(a.price) || Infinity) - (Number(b.price) || Infinity) : sortBy === 'price-desc' ? (Number(b.price) || 0) - (Number(a.price) || 0) : sortBy === 'name' ? a.name.localeCompare(b.name) : 0));
  const brands = [...new Set(catalog.filter((product) => activeCategory === 'all' || String(product.category?.id || product.category) === String(activeCategory)).map((product) => product.brand).filter(Boolean))].sort();
  const featured = dedupeProducts(categories.map((category) => catalog.find((product) => product.category?.id === category.id)).filter(Boolean)).slice(0, 8);
  const deals = dedupeProducts(catalog.filter((product) => product.is_featured_deal === true).sort((a, b) => discountPercent(b) - discountPercent(a))).slice(0, 6);
  const arrivals = dedupeProducts(
    catalog
      .filter((product) => product.fromSupplier || product.product_id || product.id)
      .sort((a, b) => {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        if (timeB !== timeA) return timeB - timeA;
        return (Number(b.product_id || b.id) || 0) - (Number(a.product_id || a.id) || 0);
      })
  ).slice(0, 8);
  const cartCount = useMemo(() => {
    if (!Array.isArray(cart) || cart.length === 0) return 0;
    const uniqueCategories = new Set();
    cart.forEach((item) => {
      const p = item?.product || {};
      const cat = p.category;
      let name = '';
      if (typeof cat === 'object' && cat !== null) {
        name = cat.name || cat.title || String(cat.id || '');
      } else if (typeof cat === 'string') {
        name = cat;
      }
      if (!name) name = p.category_name || p.categoryName || '';
      const key = (name || p.name || String(p.id || '')).trim().toLowerCase();
      if (key) uniqueCategories.add(key);
    });
    return uniqueCategories.size;
  }, [cart]);
  const pricedTotal = cart.reduce((sum, item) => sum + unitPrice(item.product, item.quantity) * item.quantity, 0);
  const hasUnpricedItems = cart.some((item) => !(Number(item.product.price) > 0));

  const toggleCart = () => {
    if (cartOpen) {
      setCartOpen(false);
      return;
    }
    const headerBottom = storeHeaderRef.current?.getBoundingClientRect().bottom || 0;
    setCartOverlayTop(Math.max(0, Math.ceil(headerBottom)));
    setCartOpen(true);
  };

  const chooseCategory = (id, options = {}) => {
    const nextSearch = typeof options.search === "string" ? options.search : "";
    setActiveCategory(id);
    setBrandFilter('all');
    setSearch(nextSearch);
    const url = new URL(window.location.href);
    const selected = categories.find((category) => String(category.id) === String(id));
    if (selected) url.searchParams.set('category', selected.name);
    else url.searchParams.delete('category');
    if (nextSearch) url.searchParams.set('q', nextSearch);
    else url.searchParams.delete('q');
    window.history.replaceState(window.history.state, '', url);
    // Wait for React to remove the other catalogue sections before calculating
    // the target position. Scrolling against the old layout lands at the footer.
    if (catalogScrollFrame.current) cancelAnimationFrame(catalogScrollFrame.current);
    catalogScrollFrame.current = requestAnimationFrame(() => {
      catalogScrollFrame.current = requestAnimationFrame(() => {
        document.getElementById("store-products")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    // Immediately drop focus from the clicked card so :focus style never sticks during scroll
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  };

  return (
    <div className={`shop-page${cartOpen ? ' store-cart-is-open' : ''}`}>
      {/* Mobile Quick-Commerce View (viewport <= 768px) */}
      <div className="storefront-mobile">
        <MobileStorefront
          categories={categories}
          products={products}
          catalog={catalog}
          content={content}
          loading={loading}
          cities={cities}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          cart={cart}
          onAdd={onAdd}
          onChangeQty={onChangeQty}
          onQuote={onQuote}
          onBuy={onBuy}
          onCheckout={onCheckout}
          shippingSettings={shippingSettings}
          shippingQuote={shippingQuote}
          activeCoupon={activeCoupon}
          couponCalculation={couponCalculation}
          couponOffers={couponOffers}
          onApplyCoupon={onApplyCoupon}
          onSelectCoupon={onSelectCoupon}
          onClearCoupon={onClearCoupon}
        />
      </div>

      {/* Desktop Storefront View (viewport > 768px) */}
      <div className="storefront-desktop">
        <header className="store-header" ref={storeHeaderRef}>
          <div className="store-header-inner">
            <Link href="/" className="store-brand" aria-label="MTBOSS home"><picture className="store-brand-picture"><Image src="/logo.png" alt="MTBOSS" width={46} height={46} sizes="(max-width: 560px) 34px, (max-width: 800px) 39px, 46px" /></picture><small>SHOP</small></Link>
            <div className="store-location-wrap">
              <button type="button" className="store-location" onClick={() => setCityOpen(!cityOpen)} aria-expanded={cityOpen}>
                <MapPin size={20} /><span><strong>Deliver to {selectedCity || "your city"}</strong><small>{selectedCity ? "Change location" : "Select delivery location"}</small></span><ChevronDown size={16} />
              </button>
              {cityOpen && <div className="store-city-popover"><label htmlFor="store-city">Choose your city</label><select id="store-city" value={selectedCity} onChange={(e) => { setSelectedCity(e.target.value); setCityOpen(false); }}><option value="">Select city</option>{[...new Set(cities)].map((city) => <option key={city} value={city}>{city}</option>)}</select><p>Availability is checked at checkout.</p></div>}
            </div>
            <label className="store-search"><Search size={20} /><input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={content.search_placeholder} aria-label="Search materials" /></label>
            {productManagerHref && <Link href={productManagerHref} className="store-admin-add"><Plus size={18} /> Add Product</Link>}
            <Link href="/material-orders?role=user" className="store-orders" title="Track orders"><ClipboardList size={18} /><span>Orders</span></Link>
            <Link
              href="/wallet"
              className="store-wallet-btn"
              aria-label="MT-Boss Cashback Wallet"
              title="My Cashback Wallet"
            >
              <Wallet size={18} />
              <span className="store-wallet-text">Wallet</span>
              <span className="store-wallet-pill">₹{walletBalance.toLocaleString('en-IN')}</span>
            </Link>
            <Link
              href="/ShopNow/cart"
              className="store-cart-button"
              aria-label="Shopping Cart"
            >
              <ShoppingCart size={18} />
              <span>My Cart</span>
              {cartCount > 0 && <b>{cartCount}</b>}
            </Link>
          </div>
        </header>

        <ShopCategoryNav
          categories={categories}
          products={products}
          activeCategory={activeCategory}
          activeSearch={search}
          onSelectCategory={chooseCategory}
        />

        <main className="store-main">
          <div className="store-breadcrumb"><Link href="/">Home</Link><span>/</span><strong>Shop materials</strong></div>
          <section className="store-hero">
            <div className="store-hero-copy"><span className="store-eyebrow">{content.hero_kicker}</span><h1>{content.hero_title} <em>{content.hero_highlight}</em></h1><p>{content.hero_description}</p><button type="button" className="store-hero-button" onClick={() => chooseCategory("all")}>{content.hero_button} <ArrowRight size={18} /></button></div>
            <div className="store-hero-photo" role="img" aria-label="Construction materials" style={{ position: 'relative' }}>
              <HeroBannerGallery images={content?.hero_images || defaultHeroImages} alt="Construction materials" delay={3500} />
              <span className="store-hero-photo-label"><CheckCircle2 size={17} /> {content.hero_badge}</span>
            </div>
          </section>

          <section className="store-promos" aria-label="Shopping benefits">
            {[Package, ShieldCheck, Truck].map((Icon, index) => <div key={index} className={`store-promo store-promo-${index}`}><Icon size={32} /><div><strong>{content.promos[index].title}</strong><span>{content.promos[index].subtitle}</span></div><ArrowRight size={18} /></div>)}
          </section>

          <section className="store-section" aria-labelledby="store-categories-heading">
            <div className="store-section-heading"><div><span className="store-section-kicker">START SHOPPING</span><h2 id="store-categories-heading">{content.categories_heading}</h2></div><span className="store-section-note">Pick a category to see materials</span></div>
            {loading ? <div className="store-loading">Loading categories...</div> : categories.length ? <div className="store-category-grid">{categories.map((category) => {
              const { tone, Icon } = categoryStyle(category.name);
              const catImgs = Array.from(new Set([
                category.image,
                ...(Array.isArray(category.images) ? category.images : [])
              ].filter(Boolean)));
              return <button type="button" key={category.id} className={`store-category store-category-${tone}`} onClick={() => chooseCategory(category.id)}>
                <span className="store-category-art" style={{ position: 'relative', display: 'block', overflow: 'hidden' }}>
                  {catImgs.length > 0 ? (
                    <AutoSwipeGallery images={catImgs} alt={category.name} delay={3000} />
                  ) : (
                    <Icon size={37} strokeWidth={1.5} />
                  )}
                </span>
                <strong>{category.name}</strong>
                <span>Explore <ArrowRight size={13} /></span>
              </button>;
            })}</div> : <div className="store-empty">Categories are being added. Please check back soon.</div>}
          </section>

          {!searchTerm && activeCategory === "all" && featured.length > 0 && <section className="store-section" aria-labelledby="store-featured-heading"><div className="store-section-heading"><div><span className="store-section-kicker">POPULAR PICKS</span><h2 id="store-featured-heading">{content.featured_heading}</h2></div><span className="store-section-note">Fixed-price orders and custom quotes</span></div><div className="store-product-grid">{featured.map((product) => <ProductCard key={product.id} product={product} quantity={cart.find((item) => item.product.id === product.id)?.quantity || 0} canAdd={cart.length < 20} onAdd={onAdd} onChangeQty={onChangeQty} onQuote={onQuote} onBuy={onBuy} selectedCity={selectedCity} />)}</div></section>}

          {!searchTerm && activeCategory === 'all' && deals.length > 0 && <section className="store-section" aria-labelledby="store-deals-heading"><div className="store-section-heading"><div><span className="store-section-kicker">CURRENT OFFERS</span><h2 id="store-deals-heading">{content.deals_heading}</h2></div><span className="store-section-note">Request today&apos;s best supplier quote</span></div><div className="store-product-grid">{deals.map((product) => <ProductCard key={product.id} product={product} quantity={cart.find((item) => item.product.id === product.id)?.quantity || 0} canAdd={cart.length < 20} onAdd={onAdd} onChangeQty={onChangeQty} onQuote={onQuote} onBuy={onBuy} selectedCity={selectedCity} />)}</div></section>}

          {!searchTerm && activeCategory === 'all' && arrivals.length > 0 && <section className="store-section" aria-labelledby="store-arrivals-heading"><div className="store-section-heading"><div><span className="store-section-kicker">JUST ADDED</span><h2 id="store-arrivals-heading">{content.arrivals_heading}</h2></div><span className="store-section-note">Recently added products</span></div><div className="store-product-grid">{arrivals.map((product) => <ProductCard key={product.id} product={product} quantity={cart.find((item) => item.product.id === product.id)?.quantity || 0} canAdd={cart.length < 20} onAdd={onAdd} onChangeQty={onChangeQty} onQuote={onQuote} onBuy={onBuy} selectedCity={selectedCity} />)}</div></section>}

          <section className="store-section store-catalog" id="store-products" aria-labelledby="store-products-heading">
            <div className="store-section-heading"><div><span className="store-section-kicker">THE CATALOGUE</span><h2 id="store-products-heading">{searchTerm ? `Results for “${search}”` : activeCategory === "all" ? content.catalog_heading : categories.find((category) => String(category.id) === String(activeCategory))?.name || "Materials"}</h2></div><span className="store-section-note">{visible.length} items</span></div>
            <div className="store-filter-row"><button type="button" className={activeCategory === "all" ? "is-active" : ""} onClick={() => chooseCategory("all")}>All</button>{categories.map((category) => <button key={category.id} type="button" className={String(activeCategory) === String(category.id) ? "is-active" : ""} onClick={() => chooseCategory(category.id)}>{category.name}</button>)}</div>

            {/* Sub-categories showcase strip when a category is selected */}
            {(() => {
              if (activeCategory === "all") return null;
              const activeCatObj = categories.find((c) => String(c.id) === String(activeCategory));
              if (!activeCatObj) return null;
              const subcats = (() => {
                const list = [];
                if (Array.isArray(activeCatObj.subcategories) && activeCatObj.subcategories.length > 0) {
                  activeCatObj.subcategories.forEach((s) => {
                    const name = typeof s === 'object' && s !== null ? s.name : s;
                    if (name && !list.some((item) => (typeof item === 'object' ? item.name : item) === name)) list.push(s);
                  });
                }
                if (Array.isArray(activeCatObj.types) && activeCatObj.types.length > 0) {
                  activeCatObj.types.forEach((t) => {
                    if (t && !list.some((item) => (typeof item === 'object' ? item.name : item) === t)) list.push(t);
                  });
                }
                if (list.length === 0) {
                  const treeMatch = CATEGORY_NAV_TREE.find(
                    (p) =>
                      p.label.toLowerCase().includes(activeCatObj.name.toLowerCase()) ||
                      activeCatObj.name.toLowerCase().includes(p.label.toLowerCase())
                  );
                  if (treeMatch && Array.isArray(treeMatch.children)) {
                    list.push(...treeMatch.children);
                  }
                }
                return list;
              })();
              if (!subcats.length) return null;
              return (
                <div className="store-subcategories-strip">
                  <div className="store-subcategories-title">
                    <span>Sub-categories &amp; Varieties in {activeCatObj.name}</span>
                    {searchTerm && (
                      <button
                        type="button"
                        className="store-subcategories-reset"
                        onClick={() => {
                          setSearch("");
                          const url = new URL(window.location.href);
                          url.searchParams.delete('q');
                          window.history.replaceState(window.history.state, '', url);
                        }}
                      >
                        Show All {activeCatObj.name}
                      </button>
                    )}
                  </div>
                  <div className="store-subcategories-grid">
                    {subcats.map((sub, sIdx) => {
                      const subName = typeof sub === 'object' && sub !== null ? sub.name : sub;
                      const subPrice = typeof sub === 'object' && sub !== null ? sub.price : '';
                      const subImgs = typeof sub === 'object' && sub !== null
                        ? Array.from(new Set([sub.image, ...(Array.isArray(sub.images) ? sub.images : [])].filter(Boolean)))
                        : [];
                      const isSelected = Boolean(
                        searchTerm && (
                          searchTerm === subName.toLowerCase() ||
                          subName.toLowerCase().includes(searchTerm) ||
                          searchTerm.includes(subName.toLowerCase())
                        )
                      );
                      return (
                        <div
                          key={`${subName}-${sIdx}`}
                          className={`store-subcategory-card${isSelected ? " is-active" : ""}`}
                          onClick={() => {
                            const nextSearch = isSelected ? "" : subName;
                            setSearch(nextSearch);
                            const url = new URL(window.location.href);
                            if (nextSearch) url.searchParams.set('q', nextSearch);
                            else url.searchParams.delete('q');
                            window.history.replaceState(window.history.state, '', url);
                            document.getElementById("store-products")?.scrollIntoView({ behavior: "smooth", block: "start" });
                          }}
                          title={`Browse ${subName}`}
                        >
                          <div className="store-subcategory-img-box">
                            {subImgs.length > 0 ? (
                              <AutoSwipeGallery images={subImgs} alt={subName} delay={3200} />
                            ) : (
                              <Package size={26} className="text-gray-400" />
                            )}
                          </div>
                          <div className="store-subcategory-info">
                            <strong className="store-subcategory-name">{subName}</strong>
                            {subPrice ? (
                              <span className="store-subcategory-price">{subPrice.startsWith('₹') ? subPrice : `₹${subPrice}`}</span>
                            ) : (
                              <span className="store-subcategory-explore">Explore</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            <div className="store-catalog-tools"><label>Brand <select value={brandFilter} onChange={(event) => setBrandFilter(event.target.value)}><option value="all">All brands</option>{brands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}</select></label><label>Sort by <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="featured">Featured</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="name">Name: A to Z</option></select></label></div>
            {loading ? <div className="store-loading">Loading materials...</div> : visible.length ? <div className="store-product-grid">{visible.map((product) => <ProductCard key={product.id} product={product} quantity={cart.find((item) => item.product.id === product.id)?.quantity || 0} canAdd={cart.length < 20} onAdd={onAdd} onChangeQty={onChangeQty} onQuote={onQuote} onBuy={onBuy} selectedCity={selectedCity} />)}</div> : <div className="store-empty">No materials found. Try another search or category.</div>}
          </section>
        </main>
      </div>
    </div>
  );
}
