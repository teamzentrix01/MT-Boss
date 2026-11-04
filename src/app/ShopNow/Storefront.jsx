"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, CheckCircle2, ChevronDown, ClipboardList, Clock, CreditCard, Grid3X3,
  Hammer, MapPin, Minus, Mountain, Package, PaintBucket, Percent, Plus,
  Search, ShieldCheck, ShoppingCart, Truck, Wallet, Wrench, X, Sparkles,
} from "lucide-react";
import "./shop.css";
import ShopCategoryNav from "./ShopCategoryNav";
import {
  CATEGORY_NAV_TREE,
  getMainCategories,
  getSubcategoriesForParent,
  productMatchesCategoryAndSub,
  resolveParentAndSubFromParam,
  namesMatch,
  findCategoryByLabel,
} from "./categoryNavTree";
import MobileStorefront from "./MobileStorefront";
import ProductGalleryCarousel from "./ProductGalleryCarousel";
import AutoSwipeGallery from "./AutoSwipeGallery";
import HeroBannerGallery from "./HeroBannerGallery";
import { defaultHeroImages } from "@/lib/shop-storefront-defaults";
import { getCartStep } from "@/lib/cart-step";

const SEARCH_PLACEHOLDERS = [
  'Search "Cement"',
  'Search "Plywood & MDF"',
  'Search "Steel & TMT Bars"',
  'Search "Plumbing pipes & fittings"',
  'Search "Electrical wires & switches"',
  'Search "Paints & Waterproofing"',
  'Search "Hardware & Hinges"',
  'Search "Tiles & Adhesives"',
];

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
  if (/tile|floor|marble|glass/.test(value)) return { tone: "lavender", Icon: Grid3X3 };
  if (/plumb|pipe|sanitary|faucet|sink|tank/.test(value)) return { tone: "blue", Icon: Wrench };
  if (/electr|switch|socket|mcb|wire|cable|light/.test(value)) return { tone: "sand", Icon: Sparkles };
  if (/carpentry|timber|plywood|hpl|wood/.test(value)) return { tone: "coral", Icon: Hammer };
  if (/hardware|furniture|hinges|lock|handle|fittings/.test(value)) return { tone: "green", Icon: ShieldCheck };
  if (/chemical|waterproof|sealant|admixture/.test(value)) return { tone: "mint", Icon: Package };
  if (/launch|arrival|new/.test(value)) return { tone: "blue", Icon: Sparkles };
  if (/building/.test(value)) return { tone: "sand", Icon: Mountain };
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

export function getLowestBulkPrice(product) {
  if (!product) return null;
  const tiers = Array.isArray(product.bulk_pricing) ? product.bulk_pricing : [];
  const valid = tiers
    .map((t) => Number(t.price))
    .filter((p) => Number.isFinite(p) && p > 0);
  if (valid.length > 0) {
    return Math.min(...valid);
  }
  return null;
}

export function formatPromoSpend(value) {
  const num = Number(value) || 0;
  if (num >= 1000 && num % 1000 === 0) {
    return `${num / 1000}k`;
  }
  return `₹${num.toLocaleString('en-IN')}`;
}

export function productMatchesPromoCategories(product, applicableCategories) {
  if (!Array.isArray(applicableCategories) || applicableCategories.length === 0) {
    return true; // Empty array means applies to ALL materials & categories!
  }
  const rawCat = typeof product?.category === 'object' ? product?.category?.name : product?.category;
  const catNames = [
    rawCat,
    product?.category_name,
    product?.categoryName,
    product?.category?.title,
    product?.subcategory,
    product?.name,
  ].filter(Boolean).map((v) => String(v).trim().toLowerCase());

  return applicableCategories.some((c) => {
    const target = String(c).trim().toLowerCase();
    if (!target) return false;
    return catNames.some((cat) => cat === target || cat.includes(target) || target.includes(cat));
  });
}

export function getProductPromotions(product, promotions = []) {
  if (!promotions || !Array.isArray(promotions) || promotions.length === 0) return [];
  return promotions.filter((p) => {
    if (!p.is_active) return false;
    return productMatchesPromoCategories(product, p.applicable_categories);
  });
}

export function getProductPromotion(product, promotions = []) {
  const matches = getProductPromotions(product, promotions);
  if (matches.length === 0) return null;
  const discountPromo = matches.find((p) => p.promo_type === 'percentage' || p.promo_type === 'flat');
  return discountPromo || matches[0];
}

export function getProductFreeShippingPromo(product, promotions = []) {
  if (!promotions || !Array.isArray(promotions) || promotions.length === 0) return null;
  return promotions.find((p) => {
    if (!p.is_active || p.promo_type !== 'free_shipping') return false;
    return productMatchesPromoCategories(product, p.applicable_categories);
  }) || null;
}

function productCanOrder(product, selectedCity) {
  const normalizedCity = (selectedCity || "").trim().toLowerCase();
  const cityUnavailable = Boolean(
    normalizedCity &&
    Array.isArray(product.available_cities) &&
    product.available_cities.length > 0 &&
    !product.available_cities.some((city) => city && city.trim().toLowerCase() === normalizedCity)
  );
  const outOfStock = Boolean(product.fromSupplier && Number(product.quantity) <= 0);
  return !cityUnavailable && !outOfStock;
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

function ProductCard({ product, quantity, canAdd, onAdd, onChangeQty, onQuote, onBuy, selectedCity, promotions = [], shippingSettings }) {
  const productImage = getProductImage(product, product.category);
  const price = Number(product.price);
  const hasFixedPrice = Number.isFinite(price) && price > 0;
  const discount = discountPercent(product);
  const normalizedCity = (selectedCity || "").trim().toLowerCase();
  const cityUnavailable = Boolean(
    normalizedCity &&
    Array.isArray(product.available_cities) &&
    product.available_cities.length > 0 &&
    !product.available_cities.some((city) => city && city.trim().toLowerCase() === normalizedCity)
  );
  const outOfStock = Boolean(product.fromSupplier && Number(product.quantity) <= 0);
  const canOrder = !cityUnavailable && !outOfStock;
  const detailId = product.product_id || (String(product.id).startsWith('supplier-') ? product.id.replace('supplier-', '') : product.id);
  const detailHref = `/ShopNow/${detailId}`;

  // Bulk pricing & promotion logic
  const lowestBulkPrice = getLowestBulkPrice(product);
  const activePromos = getProductPromotions(product, promotions);

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
        <span className={`store-product-tag ${!canOrder ? 'store-product-tag-unavailable' : 'store-product-tag-available'}`}>
          {canOrder ? 'In Stock' : 'Out of Stock'}
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

        {/* Price row */}
        <div className="store-product-price-slot">
          {hasFixedPrice ? (
            <div className="store-product-price">
              {Number(product.compare_at_price) > price && <del>₹{Number(product.compare_at_price).toLocaleString('en-IN')}</del>}
              <strong>₹{price.toLocaleString('en-IN')} / {displayUnit(product.unit)}</strong>
            </div>
          ) : null}
        </div>

        {/* Promotion Strip(s) (HomeRun Image 2 style - supports ANY active promotion) */}
        {activePromos.slice(0, 2).map((promo) => {
          const isFreeShipping = promo.promo_type === 'free_shipping';
          const isFlat = promo.promo_type === 'flat';
          const isPercent = promo.promo_type === 'percentage';

          const stickerLabel = isFreeShipping ? 'FREE' : isFlat ? 'FLAT' : 'Special';
          const stickerVal = isFreeShipping ? 'SHIP' : isPercent ? `${promo.discount_value}%` : `₹${Number(promo.discount_value).toLocaleString('en-IN')}`;
          const promoTitle = isFreeShipping ? 'Free Delivery' : 'Discount';
          const promoSpendText = promo.min_cart_value > 0 ? `on orders above ${formatPromoSpend(promo.min_cart_value)}` : 'on all orders';

          return (
            <div
              key={promo.id || promo.name}
              className={`store-homerun-promo-strip ${isFreeShipping ? 'store-homerun-promo-shipping' : ''}`}
              title={promo.description || promo.name}
            >
              <div className={`store-promo-sticker ${isFreeShipping ? 'store-promo-sticker-shipping' : ''}`}>
                <span className="store-promo-sticker-label">{stickerLabel}</span>
                <span className="store-promo-sticker-pct">{stickerVal}</span>
              </div>
              <div className="store-promo-text">
                <strong className="store-promo-title">{promoTitle}</strong>
                <span className="store-promo-sub">{promoSpendText}</span>
              </div>
            </div>
          );
        })}

        {/* Bulk Prices link (Image 2 style: Unlock Bulk Prices of ₹335) */}
        {lowestBulkPrice ? (
          <button
            type="button"
            className="store-bulk-price-link"
            onClick={(e) => {
              e.stopPropagation();
              onQuote(product);
            }}
            title="Unlock bulk pricing — click to view tiers & request bulk quote"
          >
            Unlock Bulk Prices of ₹{lowestBulkPrice.toLocaleString('en-IN')}
          </button>
        ) : null}

        <div className="store-product-footer">
          {cityUnavailable && <span className="store-stock-note store-stock-note-red">Out of stock in {selectedCity}</span>}
          {outOfStock && !cityUnavailable && <span className="store-stock-note store-stock-note-red">Currently out of stock</span>}
          <div className="store-product-actions store-product-actions-single">
            <button type="button" className={`store-buy-btn ${!canOrder ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!canOrder} onClick={() => onBuy(product)}>
              {canOrder ? 'Buy Now' : 'Out of Stock'}
            </button>
          </div>
          {quantity ? (
            <div className="store-quantity-control" aria-label={`${product.name} quantity in cart`}>
              <button type="button" onClick={() => onChangeQty(product.id, -1)} aria-label={`Remove one ${product.name}`}><Minus size={15} /></button>
              <span>{quantity} in cart</span>
              <button type="button" disabled={!canOrder} onClick={() => onChangeQty(product.id, 1)} aria-label={`Add one ${product.name}`}><Plus size={15} /></button>
            </div>
          ) : (
            <button type="button" className={`store-add-btn ${!canOrder ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!canAdd || !canOrder} onClick={(e) => onAdd(product, e)}>
              <Plus size={15} /> {!canOrder ? 'Out of Stock' : canAdd ? "Add to cart" : "Cart limit reached"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Storefront({ categories, products, offers = [], content, loading, cities, selectedCity, setSelectedCity, cart, onAdd, onChangeQty, onQuote, onBuy, onCheckout, activeCoupon, couponCalculation, couponOffers, onApplyCoupon, onSelectCoupon, onClearCoupon, shippingSettings, shippingQuote, promotions = [], onOpenLocationModal }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedParentNav, setSelectedParentNav] = useState(null);
  const [selectedSubNav, setSelectedSubNav] = useState(null);
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
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const mainCategories = useMemo(() => {
    return getMainCategories(categories, products);
  }, [categories, products]);

  const currentParentCategory = useMemo(() => {
    if (!selectedParentNav || selectedParentNav === 'all') return null;
    return mainCategories.find((m) => namesMatch(m.label, selectedParentNav) || m.id === selectedParentNav) || null;
  }, [mainCategories, selectedParentNav]);

  const parentSubcategories = useMemo(() => {
    if (!currentParentCategory) return [];
    return getSubcategoriesForParent(currentParentCategory, categories, products);
  }, [currentParentCategory, categories, products]);

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const activeCatObj = useMemo(() => {
    return categories.find((c) => String(c.id) === String(activeCategory)) || null;
  }, [categories, activeCategory]);

  const activeSubcats = useMemo(() => {
    if (!activeCatObj) return [];
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
  }, [activeCatObj]);


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
    const syncFromUrl = () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get('category');
      const subParam = params.get('subcategory');
      const query = params.get('q') || '';

      if (query) {
        setSearch(query);
      } else {
        setSearch('');
      }

      if (catParam || subParam) {
        const resolved = resolveParentAndSubFromParam(catParam, subParam, categories);
        setSelectedParentNav(resolved.parentLabel);
        setSelectedSubNav(resolved.subLabel);
        if (resolved.subLabel) {
          const found = findCategoryByLabel(resolved.subLabel, categories);
          if (found) setActiveCategory(found.id);
        } else if (resolved.parentLabel) {
          const found = findCategoryByLabel(resolved.parentLabel, categories);
          if (found) setActiveCategory(found.id);
        }
      } else {
        setSelectedParentNav(null);
        setSelectedSubNav(null);
        setActiveCategory('all');
      }
    };

    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
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

  const goToAllCategories = () => {
    setSelectedParentNav(null);
    setSelectedSubNav(null);
    setActiveCategory('all');
    setSearch('');
    setBrandFilter('all');
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('category');
      url.searchParams.delete('subcategory');
      url.searchParams.delete('q');
      window.history.pushState({}, '', url);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleExploreParentCategory = (parent) => {
    const pLabel = typeof parent === 'object' ? parent.label || parent.name : parent;
    const parentDef = mainCategories.find((m) => namesMatch(m.label, pLabel) || m.id === parent?.id);

    if (parentDef?.isDirect) {
      setSelectedParentNav(parentDef.label);
      setSelectedSubNav(parentDef.label);
      setSearch('');
      setBrandFilter('all');
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('category', parentDef.label);
        url.searchParams.delete('subcategory');
        url.searchParams.delete('q');
        window.history.pushState({}, '', url);
      }
    } else {
      setSelectedParentNav(parentDef?.label || pLabel);
      setSelectedSubNav(null);
      setSearch('');
      setBrandFilter('all');
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('category', parentDef?.label || pLabel);
        url.searchParams.delete('subcategory');
        url.searchParams.delete('q');
        window.history.pushState({}, '', url);
      }
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectSubcategory = (subLabel, parentLabel = null) => {
    const parent = parentLabel || selectedParentNav;
    setSelectedParentNav(parent);
    setSelectedSubNav(subLabel);
    setSearch('');
    setBrandFilter('all');
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (parent) url.searchParams.set('category', parent);
      if (subLabel) url.searchParams.set('subcategory', subLabel);
      url.searchParams.delete('q');
      window.history.pushState({}, '', url);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const visible = dedupeProducts(
    catalog.filter((product) => {
      // 1. Hierarchy Match
      if (selectedSubNav) {
        if (!productMatchesCategoryAndSub(product, selectedParentNav, selectedSubNav)) {
          return false;
        }
      } else if (selectedParentNav && selectedParentNav !== 'all') {
        if (!productMatchesCategoryAndSub(product, selectedParentNav, null)) {
          return false;
        }
      } else if (activeCategory !== 'all') {
        const catId = product.category?.id != null ? String(product.category.id) : '';
        const catName = (typeof product.category === 'object' ? product.category?.name : (product.category || '')).toLowerCase().trim();
        const activeCatObj = categories.find((c) => String(c.id) === String(activeCategory));
        const activeCatName = activeCatObj ? activeCatObj.name.toLowerCase().trim() : String(activeCategory).toLowerCase().trim();
        const matchesCategory = catId === String(activeCategory)
          || (activeCatObj && catId === String(activeCatObj.id))
          || catName === activeCatName;
        if (!matchesCategory) return false;
      }

      // 2. Brand Match
      if (brandFilter !== 'all' && product.brand !== brandFilter) return false;

      // 3. Search Term Match
      if (searchTerm) {
        const catName = (typeof product.category === 'object' ? product.category?.name : (product.category || '')).toLowerCase().trim();
        const subName = (product.subcategory || '').toLowerCase();
        const prodName = (product.name || '').toLowerCase();
        const brandName = (product.brand || '').toLowerCase();
        const searchableText = `${prodName} ${catName} ${subName} ${brandName}`;

        if (searchableText.includes(searchTerm)) return true;

        const searchWords = searchTerm.split(/[\s,&/]+/).filter((w) => w.length > 2);
        if (searchWords.length > 0 && searchWords.some((word) => subName.includes(word) || prodName.includes(word))) {
          return true;
        }
        if (subName && searchTerm.includes(subName)) return true;
        return false;
      }

      return true;
    })
  ).sort((a, b) =>
    sortBy === 'price-asc'
      ? (Number(a.price) || Infinity) - (Number(b.price) || Infinity)
      : sortBy === 'price-desc'
      ? (Number(b.price) || 0) - (Number(a.price) || 0)
      : sortBy === 'name'
      ? a.name.localeCompare(b.name)
      : 0
  );

  const brands = [...new Set(visible.map((product) => product.brand).filter(Boolean))].sort();
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
    const parentCategory = options.parentCategory || null;
    const subcategory = options.subcategory || null;
    const exploreParent = Boolean(options.exploreParent);

    if (id === 'all' && !parentCategory && !nextSearch) {
      goToAllCategories();
      return;
    }

    if (exploreParent && parentCategory) {
      handleExploreParentCategory(parentCategory);
      return;
    }

    if (parentCategory && subcategory) {
      handleSelectSubcategory(subcategory, parentCategory);
      return;
    }

    if (nextSearch && parentCategory) {
      handleSelectSubcategory(nextSearch, parentCategory);
      return;
    }

    setActiveCategory(id);
    setBrandFilter('all');
    setSearch(nextSearch);
    const selected = categories.find((category) => String(category.id) === String(id));
    if (selected) {
      const resolved = resolveParentAndSubFromParam(selected.name, null, categories);
      setSelectedParentNav(resolved.parentLabel);
      setSelectedSubNav(resolved.subLabel);
    }
    const url = new URL(window.location.href);
    if (selected) url.searchParams.set('category', selected.name);
    else url.searchParams.delete('category');
    if (nextSearch) url.searchParams.set('q', nextSearch);
    else url.searchParams.delete('q');
    window.history.replaceState(window.history.state, '', url);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
          promotions={promotions}
          onOpenLocationModal={onOpenLocationModal}
        />
      </div>

      {/* Desktop Storefront View (viewport > 768px) */}
      <div className="storefront-desktop">
        <header className="store-header" ref={storeHeaderRef}>
          <div className="store-header-inner">
            <Link href="/" className="store-brand" aria-label="MTBOSS home"><picture className="store-brand-picture"><Image src="/logo.png" alt="MTBOSS" width={46} height={46} sizes="(max-width: 560px) 34px, (max-width: 800px) 39px, 46px" /></picture><small>SHOP</small></Link>
            <div className="store-location-wrap">
              <button type="button" className="store-location" onClick={() => (onOpenLocationModal ? onOpenLocationModal() : setCityOpen(!cityOpen))} aria-expanded={cityOpen}>
                <MapPin size={20} /><span><strong>Deliver to {selectedCity || "your city"}</strong><small>{selectedCity ? "Change location" : "Select delivery location"}</small></span><ChevronDown size={16} />
              </button>
              {cityOpen && <div className="store-city-popover"><label htmlFor="store-city">Choose your city</label><select id="store-city" value={selectedCity} onChange={(e) => { setSelectedCity(e.target.value); setCityOpen(false); }}><option value="">Select city</option>{[...new Set(cities)].map((city) => <option key={city} value={city}>{city}</option>)}</select><p>Availability is checked at checkout.</p></div>}
            </div>
            <label className="store-search"><Search size={20} /><input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={SEARCH_PLACEHOLDERS[placeholderIndex] || content.search_placeholder} aria-label="Search materials" /></label>

            {productManagerHref && <Link href={productManagerHref} className="store-admin-add"><Plus size={18} /> Add Product</Link>}
            <Link href="/material-orders?role=user" className="store-orders" title="Track orders"><ClipboardList size={18} /><span>Orders</span></Link>
            <Link
              href="/wallet"
              className="store-wallet-btn"
              aria-label="MTBOSS Cashback Wallet"
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
          activeParentCategory={selectedParentNav}
          activeSubcategory={selectedSubNav}
          onSelectCategory={chooseCategory}
        />

        <main className="store-main">
          {/* Breadcrumb Navigation (3-Level Flow) */}
          <div className="store-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            {!selectedParentNav && !selectedSubNav && !searchTerm && activeCategory === "all" ? (
              <strong>Shop materials</strong>
            ) : (
              <>
                <button type="button" className="store-breadcrumb-btn" onClick={goToAllCategories}>
                  Shop materials
                </button>
                {selectedParentNav && (
                  <>
                    <span>/</span>
                    {selectedSubNav ? (
                      <button
                        type="button"
                        className="store-breadcrumb-btn"
                        onClick={() => handleExploreParentCategory(currentParentCategory || selectedParentNav)}
                      >
                        {currentParentCategory?.label || selectedParentNav}
                      </button>
                    ) : (
                      <strong className="store-breadcrumb-btn is-current">
                        {currentParentCategory?.label || selectedParentNav}
                      </strong>
                    )}
                  </>
                )}
                {selectedSubNav && (
                  <>
                    <span>/</span>
                    <strong className="store-breadcrumb-btn is-current">
                      {selectedSubNav}
                    </strong>
                  </>
                )}
                {searchTerm && !selectedSubNav && (
                  <>
                    <span>/</span>
                    <strong className="store-breadcrumb-btn is-current">
                      Search: “{search}”
                    </strong>
                  </>
                )}
              </>
            )}
          </div>

          {/* Hero Banner (Always shown on all pages/categories) */}
          <section className="store-hero">
            <div className="store-hero-copy">
              <span className="store-eyebrow">{content.hero_kicker}</span>
              <h1>{content.hero_title} <em>{content.hero_highlight}</em></h1>
              <p>{content.hero_description}</p>
              <button type="button" className="store-hero-button" onClick={goToAllCategories}>
                {content.hero_button} <ArrowRight size={18} />
              </button>
            </div>
            <div className="store-hero-photo" role="img" aria-label="Construction materials" style={{ position: 'relative' }}>
              <HeroBannerGallery images={content?.hero_images || defaultHeroImages} alt="Construction materials" delay={3500} />
              <span className="store-hero-photo-label"><CheckCircle2 size={17} /> {content.hero_badge}</span>
            </div>
          </section>

          {/* 4 Value Proposition Badges */}
          <div className="store-hero-value-props" aria-label="Store highlights">
            <div className="store-value-badge">
              <Truck size={22} style={{ color: "var(--brand-blue, #0077c8)", flexShrink: 0 }} />
              <span>Site Delivery Guaranteed</span>
            </div>
            <div className="store-value-badge">
              <ShieldCheck size={22} style={{ color: "#16a34a", flexShrink: 0 }} />
              <span>100% Verified Suppliers</span>
            </div>
            <div className="store-value-badge">
              <CheckCircle2 size={22} style={{ color: "#d97706", flexShrink: 0 }} />
              <span>Pay on Delivery Available</span>
            </div>
            <div className="store-value-badge">
              <Percent size={22} style={{ color: "var(--brand-blue, #0077c8)", flexShrink: 0 }} />
              <span>Upto 2% Cashback on Orders</span>
            </div>
          </div>

          {!selectedParentNav && !selectedSubNav && !searchTerm && activeCategory === "all" ? (
            /* ── LEVEL 1: HOMEPAGE OVERVIEW (Navbar Main Categories Grid) ── */
            <>
              <section className="store-section" aria-labelledby="store-categories-heading">
                <div className="store-section-heading">
                  <div>
                    <span className="store-section-kicker">START SHOPPING</span>
                    <h2 id="store-categories-heading">{content.categories_heading || "Shop by category"}</h2>
                  </div>
                  <span className="store-section-note">Pick a category to explore subcategories</span>
                </div>

                {loading ? (
                  <div className="store-loading">Loading categories...</div>
                ) : mainCategories.length ? (
                  <div className="store-category-grid">
                    {mainCategories.map((mainCat) => {
                      const { tone, Icon } = categoryStyle(mainCat.label || mainCat.name);
                      const catImgs = mainCat.images && mainCat.images.length > 0 ? mainCat.images : (mainCat.image ? [mainCat.image] : []);
                      return (
                        <button
                          type="button"
                          key={mainCat.id}
                          className={`store-category store-category-${tone}`}
                          onClick={() => handleExploreParentCategory(mainCat)}
                        >
                          <span className="store-category-art" style={{ position: 'relative', display: 'block', overflow: 'hidden' }}>
                            {catImgs.length > 0 ? (
                              <AutoSwipeGallery images={catImgs} alt={mainCat.label} delay={3000} />
                            ) : (
                              <Icon size={37} strokeWidth={1.5} />
                            )}
                          </span>
                          <strong>{mainCat.label.toUpperCase()}</strong>
                          <span>Explore <ArrowRight size={13} /></span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="store-empty">Categories are being added. Please check back soon.</div>
                )}
              </section>

              {deals.length > 0 && (
                <section className="store-section" aria-labelledby="store-deals-heading">
                  <div className="store-section-heading">
                    <div>
                      <span className="store-section-kicker">CURRENT OFFERS</span>
                      <h2 id="store-deals-heading">{content.deals_heading}</h2>
                    </div>
                    <span className="store-section-note">Request today&apos;s best supplier quote</span>
                  </div>
                  <div className="store-product-grid">
                    {deals.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        quantity={cart.find((item) => item.product.id === product.id)?.quantity || 0}
                        canAdd={cart.length < 20}
                        onAdd={onAdd}
                        onChangeQty={onChangeQty}
                        onQuote={onQuote}
                        onBuy={onBuy}
                        selectedCity={selectedCity}
                        promotions={promotions}
                        shippingSettings={shippingSettings}
                      />
                    ))}
                  </div>
                </section>
              )}

              {arrivals.length > 0 && (
                <section className="store-section" aria-labelledby="store-arrivals-heading">
                  <div className="store-section-heading">
                    <div>
                      <span className="store-section-kicker">JUST ADDED</span>
                      <h2 id="store-arrivals-heading">{content.arrivals_heading}</h2>
                    </div>
                    <span className="store-section-note">Recently added products</span>
                  </div>
                  <div className="store-product-grid">
                    {arrivals.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        quantity={cart.find((item) => item.product.id === product.id)?.quantity || 0}
                        canAdd={cart.length < 20}
                        onAdd={onAdd}
                        onChangeQty={onChangeQty}
                        onQuote={onQuote}
                        onBuy={onBuy}
                        selectedCity={selectedCity}
                        promotions={promotions}
                        shippingSettings={shippingSettings}
                      />
                    ))}
                  </div>
                </section>
              )}

              <section className="store-section store-catalog" id="store-products" aria-labelledby="store-products-heading">
                <div className="store-homerun-header">
                  <h2 className="store-homerun-title" id="store-products-heading">
                    {content.catalog_heading || "All Materials"}
                  </h2>
                  <div className="store-homerun-filter-bar">
                    <div className="store-homerun-filter-left">
                      <span className="store-homerun-filter-label">Filter:</span>
                      <div className="store-homerun-select-wrap">
                        <select
                          value={activeCategory}
                          onChange={(e) => chooseCategory(e.target.value)}
                          className="store-homerun-filter-select"
                          aria-label="Filter by Category"
                        >
                          <option value="all">Category: All</option>
                          {mainCategories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="store-homerun-select-icon" />
                      </div>

                      {brands.length > 0 && (
                        <div className="store-homerun-select-wrap">
                          <select
                            value={brandFilter}
                            onChange={(e) => setBrandFilter(e.target.value)}
                            className="store-homerun-filter-select"
                            aria-label="Filter by Brand"
                          >
                            <option value="all">Brand: All</option>
                            {brands.map((brand) => (
                              <option key={brand} value={brand}>{brand}</option>
                            ))}
                          </select>
                          <ChevronDown size={14} className="store-homerun-select-icon" />
                        </div>
                      )}

                      <div className="store-homerun-select-wrap">
                        <select
                          value={sortBy.startsWith('price') ? sortBy : 'all'}
                          onChange={(e) => {
                            if (e.target.value !== 'all') setSortBy(e.target.value);
                          }}
                          className="store-homerun-filter-select"
                          aria-label="Filter by Price"
                        >
                          <option value="all">Price ▾</option>
                          <option value="price-asc">Price: Low to High</option>
                          <option value="price-desc">Price: High to Low</option>
                        </select>
                        <ChevronDown size={14} className="store-homerun-select-icon" />
                      </div>
                    </div>

                    <div className="store-homerun-filter-right">
                      <span className="store-homerun-product-count">
                        {visible.length} {visible.length === 1 ? 'product' : 'products'}
                      </span>
                      <div className="store-homerun-sort-wrap">
                        <span className="store-homerun-sort-label">Sort by:</span>
                        <div className="store-homerun-select-wrap">
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="store-homerun-sort-select"
                            aria-label="Sort by"
                          >
                            <option value="featured">Relevance</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="name">Name: A to Z</option>
                          </select>
                          <ChevronDown size={14} className="store-homerun-select-icon" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="store-loading">Loading materials...</div>
                ) : visible.length ? (
                  <div className="store-product-grid">
                    {visible.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        quantity={cart.find((item) => item.product.id === product.id)?.quantity || 0}
                        canAdd={cart.length < 20}
                        onAdd={onAdd}
                        onChangeQty={onChangeQty}
                        onQuote={onQuote}
                        onBuy={onBuy}
                        selectedCity={selectedCity}
                        promotions={promotions}
                        shippingSettings={shippingSettings}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="store-empty">No materials found. Try another search or category.</div>
                )}
              </section>
            </>
          ) : selectedParentNav && !selectedSubNav && !searchTerm ? (
            /* ── LEVEL 2: SUBCATEGORIES FLOW (When Main Category Explored) ── */
            <section className="store-section store-subcategories-section" aria-labelledby="store-subcategories-heading" style={{ marginTop: 0, paddingTop: 10 }}>
              <div style={{ marginBottom: 16 }}>
                <button
                  type="button"
                  onClick={goToAllCategories}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '13px',
                    fontWeight: '700',
                    color: 'var(--brand-blue, #0077c8)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  <ArrowLeft size={16} /> Back to all categories
                </button>
              </div>

              <div className="store-section-heading">
                <div>
                  <span className="store-section-kicker">EXPLORE {currentParentCategory?.label?.toUpperCase()}</span>
                  <h2 id="store-subcategories-heading">{currentParentCategory?.label} Subcategories</h2>
                </div>
                <span className="store-section-note">Pick a subcategory to see materials</span>
              </div>

              {parentSubcategories.length > 0 ? (
                <div className="store-category-grid">
                  {parentSubcategories.map((sub) => {
                    const { tone, Icon } = categoryStyle(sub.name);
                    const subImgs = sub.images && sub.images.length > 0 ? sub.images : (sub.image ? [sub.image] : []);
                    return (
                      <button
                        type="button"
                        key={sub.name}
                        className={`store-category store-category-${tone}`}
                        onClick={() => handleSelectSubcategory(sub.name, currentParentCategory?.label)}
                      >
                        <span className="store-category-art" style={{ position: 'relative', display: 'block', overflow: 'hidden' }}>
                          {subImgs.length > 0 ? (
                            <AutoSwipeGallery images={subImgs} alt={sub.name} delay={3000} />
                          ) : (
                            <Icon size={37} strokeWidth={1.5} />
                          )}
                        </span>
                        <strong>{sub.name.toUpperCase()}</strong>
                        <span>Explore Products <ArrowRight size={13} /></span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="store-empty">Subcategories are being added. You can browse all materials below.</div>
              )}

              {/* All products under this parent category */}
              <div className="store-homerun-header" style={{ marginTop: 36, paddingTop: 24, borderTop: '1px solid #e2e8f0' }}>
                <h3 className="store-homerun-title" style={{ fontSize: '22px', fontWeight: 800 }}>
                  All {currentParentCategory?.label} Materials
                </h3>
                <div className="store-homerun-filter-bar">
                  <div className="store-homerun-filter-left">
                    <span className="store-homerun-filter-label">Filter:</span>
                    {brands.length > 0 && (
                      <div className="store-homerun-select-wrap">
                        <select
                          value={brandFilter}
                          onChange={(e) => setBrandFilter(e.target.value)}
                          className="store-homerun-filter-select"
                          aria-label="Filter by Brand"
                        >
                          <option value="all">Brand: All</option>
                          {brands.map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="store-homerun-select-icon" />
                      </div>
                    )}
                    <div className="store-homerun-select-wrap">
                      <select
                        value={sortBy.startsWith('price') ? sortBy : 'all'}
                        onChange={(e) => {
                          if (e.target.value !== 'all') setSortBy(e.target.value);
                        }}
                        className="store-homerun-filter-select"
                        aria-label="Filter by Price"
                      >
                        <option value="all">Price ▾</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                      </select>
                      <ChevronDown size={14} className="store-homerun-select-icon" />
                    </div>
                  </div>
                  <div className="store-homerun-filter-right">
                    <span className="store-homerun-product-count">
                      {visible.length} {visible.length === 1 ? 'product' : 'products'}
                    </span>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="store-loading">Loading materials...</div>
              ) : visible.length ? (
                <div className="store-product-grid">
                  {visible.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      quantity={cart.find((item) => item.product.id === product.id)?.quantity || 0}
                      canAdd={cart.length < 20}
                      onAdd={onAdd}
                      onChangeQty={onChangeQty}
                      onQuote={onQuote}
                      onBuy={onBuy}
                      selectedCity={selectedCity}
                      promotions={promotions}
                      shippingSettings={shippingSettings}
                    />
                  ))}
                </div>
              ) : (
                <div className="store-empty">No materials found in this category.</div>
              )}
            </section>
          ) : (
            /* ── LEVEL 3: SUBCATEGORY PRODUCTS / SEARCH FLOW ── */
            <section className="store-section store-catalog" id="store-products" style={{ marginTop: 0, paddingTop: 10 }}>
              {currentParentCategory && (
                <div style={{ marginBottom: 14 }}>
                  <button
                    type="button"
                    onClick={() => handleExploreParentCategory(currentParentCategory)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: '13px',
                      fontWeight: '700',
                      color: 'var(--brand-blue, #0077c8)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    <ArrowLeft size={16} /> Back to {currentParentCategory.label} Subcategories
                  </button>
                </div>
              )}

              <div className="store-homerun-header">
                {/* Heading */}
                <h1 className="store-homerun-title">
                  {searchTerm ? `Search: “${search}”` : (selectedSubNav || currentParentCategory?.label || activeCatObj?.name || 'Materials')}
                </h1>

                {/* Horizontal Sibling Subcategory Pill Bar */}
                {parentSubcategories.length > 0 && (
                  <div
                    className="store-subnav-pills-bar"
                    style={{
                      display: 'flex',
                      gap: 8,
                      overflowX: 'auto',
                      padding: '8px 0 16px',
                      WebkitOverflowScrolling: 'touch',
                      scrollbarWidth: 'none'
                    }}
                  >
                    <button
                      type="button"
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                        border: !selectedSubNav ? '1px solid var(--brand-blue, #0077c8)' : '1px solid #cbd5e1',
                        background: !selectedSubNav ? 'var(--brand-blue, #0077c8)' : '#fff',
                        color: !selectedSubNav ? '#fff' : '#334155',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleExploreParentCategory(currentParentCategory)}
                    >
                      All {currentParentCategory.label}
                    </button>
                    {parentSubcategories.map((sub) => {
                      const isCur = selectedSubNav && (namesMatch(sub.name, selectedSubNav) || sub.name === selectedSubNav);
                      return (
                        <button
                          key={sub.name}
                          type="button"
                          style={{
                            padding: '6px 14px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            whiteSpace: 'nowrap',
                            border: isCur ? '1px solid var(--brand-blue, #0077c8)' : '1px solid #cbd5e1',
                            background: isCur ? 'var(--brand-blue, #0077c8)' : '#fff',
                            color: isCur ? '#fff' : '#334155',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleSelectSubcategory(sub.name, currentParentCategory.label)}
                        >
                          {sub.name}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Single Unified Filter Bar */}
                <div className="store-homerun-filter-bar">
                  <div className="store-homerun-filter-left">
                    <span className="store-homerun-filter-label">Filter:</span>

                    {/* Category Dropdown */}
                    <div className="store-homerun-select-wrap">
                      <select
                        value={selectedParentNav || activeCategory}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'all') goToAllCategories();
                          else handleExploreParentCategory(val);
                        }}
                        className="store-homerun-filter-select"
                        aria-label="Filter by Category"
                      >
                        <option value="all">Category: All</option>
                        {mainCategories.map((cat) => (
                          <option key={cat.id} value={cat.label}>{cat.label}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="store-homerun-select-icon" />
                    </div>

                    {/* Sub-category Dropdown */}
                    {parentSubcategories.length > 0 && (
                      <div className="store-homerun-select-wrap">
                        <select
                          value={selectedSubNav || "all"}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "all") handleExploreParentCategory(currentParentCategory);
                            else handleSelectSubcategory(val, currentParentCategory?.label);
                          }}
                          className="store-homerun-filter-select"
                          aria-label="Filter by Subcategory"
                        >
                          <option value="all">Sub-category: All</option>
                          {parentSubcategories.map((sub, sIdx) => (
                            <option key={`${sub.name}-${sIdx}`} value={sub.name}>
                              {sub.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="store-homerun-select-icon" />
                      </div>
                    )}

                    {/* Brand Dropdown */}
                    {brands.length > 0 && (
                      <div className="store-homerun-select-wrap">
                        <select
                          value={brandFilter}
                          onChange={(e) => setBrandFilter(e.target.value)}
                          className="store-homerun-filter-select"
                          aria-label="Filter by Brand"
                        >
                          <option value="all">Brand: All</option>
                          {brands.map((brand) => (
                            <option key={brand} value={brand}>{brand}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="store-homerun-select-icon" />
                      </div>
                    )}

                    {/* Price Filter */}
                    <div className="store-homerun-select-wrap">
                      <select
                        value={sortBy.startsWith('price') ? sortBy : 'all'}
                        onChange={(e) => {
                          if (e.target.value !== 'all') setSortBy(e.target.value);
                        }}
                        className="store-homerun-filter-select"
                        aria-label="Filter by Price"
                      >
                        <option value="all">Price ▾</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                      </select>
                      <ChevronDown size={14} className="store-homerun-select-icon" />
                    </div>

                    {/* Reset Button */}
                    {(selectedParentNav || selectedSubNav || activeCategory !== 'all' || searchTerm || brandFilter !== 'all') && (
                      <button
                        type="button"
                        className="store-homerun-reset-btn"
                        onClick={goToAllCategories}
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  <div className="store-homerun-filter-right">
                    <span className="store-homerun-product-count">
                      {visible.length} {visible.length === 1 ? 'product' : 'products'}
                    </span>
                    <div className="store-homerun-sort-wrap">
                      <span className="store-homerun-sort-label">Sort by:</span>
                      <div className="store-homerun-select-wrap">
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="store-homerun-sort-select"
                          aria-label="Sort by"
                        >
                          <option value="featured">Relevance</option>
                          <option value="price-asc">Price: Low to High</option>
                          <option value="price-desc">Price: High to Low</option>
                          <option value="name">Name: A to Z</option>
                        </select>
                        <ChevronDown size={14} className="store-homerun-select-icon" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="store-loading">Loading materials...</div>
              ) : visible.length ? (
                <div className="store-product-grid">
                  {visible.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      quantity={cart.find((item) => item.product.id === product.id)?.quantity || 0}
                      canAdd={cart.length < 20}
                      onAdd={onAdd}
                      onChangeQty={onChangeQty}
                      onQuote={onQuote}
                      onBuy={onBuy}
                      selectedCity={selectedCity}
                      promotions={promotions}
                      shippingSettings={shippingSettings}
                    />
                  ))}
                </div>
              ) : (
                <div className="store-empty">No materials found in this subcategory. Try another filter or search.</div>
              )}
            </section>
          )}

        </main>

      </div>
    </div>
  );
}
