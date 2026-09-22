"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, CheckCircle2, ChevronDown, ClipboardList, Grid3X3,
  Hammer, MapPin, Minus, Mountain, Package, PaintBucket, Plus,
  Search, ShieldCheck, ShoppingCart, Truck, User, Wrench, X,
} from "lucide-react";
import "./shop.css";

// ── Category tone + icon mapping (preserved) ──────────────────────────────────
function categoryStyle(name = "") {
  const value = name.toLowerCase();
  if (/cement|concrete/.test(value)) return { tone: "sand", Icon: Package };
  if (/steel|iron|tmt/.test(value))  return { tone: "blue", Icon: Wrench };
  if (/sand|gravel|aggregate/.test(value)) return { tone: "cream", Icon: Mountain };
  if (/brick|block/.test(value))     return { tone: "coral", Icon: Hammer };
  if (/paint|colour/.test(value))    return { tone: "mint",  Icon: PaintBucket };
  if (/tile|floor/.test(value))      return { tone: "lavender", Icon: Grid3X3 };
  return { tone: "green", Icon: Package };
}

// ── Product visual (image or icon fallback) ────────────────────────────────────
function ProductVisual({ image, category, name, compact = false }) {
  const { tone, Icon } = categoryStyle(category?.name || name);
  return (
    <div className={`hr-visual hr-visual-${tone}${compact ? " hr-visual-compact" : ""}`}>
      {image || category?.image ? (
        <img src={image || category.image} alt={name} loading="lazy" />
      ) : (
        <><span className="hr-visual-ring" /><Icon size={compact ? 27 : 52} strokeWidth={1.4} aria-hidden="true" /></>
      )}
    </div>
  );
}

// ── Bulk pricing helper (preserved) ────────────────────────────────────────────
function unitPrice(product, quantity = 1) {
  const base = Number(product.price) || 0;
  const tier = (product.bulk_pricing || [])
    .filter((e) => quantity >= Number(e.min_quantity))
    .sort((a, b) => Number(b.min_quantity) - Number(a.min_quantity))[0];
  return tier ? Number(tier.price) : base;
}

export function displayUnit(value, fallback = 'unit') {
  return String(value || '').trim().replace(/^per\s+/i, '') || fallback;
}

export function productCanOrder(product, selectedCity) {
  const normalizedCity = String(selectedCity || '').trim().toLowerCase();
  const cityUnavailable = Boolean(
    normalizedCity &&
    product.available_cities?.length &&
    !product.available_cities.some((city) => city.trim().toLowerCase() === normalizedCity)
  );
  return !cityUnavailable && (!product.fromSupplier || Number(product.quantity) > 0);
}


// ── Product Card — HomeRun style ───────────────────────────────────────────────
function ProductCard({ product, quantity, canAdd, onAdd, onChangeQty, onQuote, onBuy, onDetails, selectedCity }) {
  const price    = Number(product.price);
  const hasPrice = Number.isFinite(price) && price > 0;
  const compareAt = Number(product.compare_at_price);
  const discount = hasPrice && compareAt > price
    ? Math.round((1 - price / compareAt) * 100) : 0;
  const normalizedCity = String(selectedCity || '').trim().toLowerCase();
  const cityUnavailable = Boolean(
    normalizedCity &&
    product.available_cities?.length &&
    !product.available_cities.some((c) => c.trim().toLowerCase() === normalizedCity)
  );
  const canOrder = productCanOrder(product, selectedCity);

  return (
    <article className="hr-card">
      {/* Discount badge */}
      {discount > 0 && <span className="hr-card-badge">{discount}% OFF</span>}

      {/* Product image */}
      <button
        type="button"
        className="hr-card-img-btn"
        onClick={() => onDetails(product)}
        aria-label={`View ${product.name} details`}
      >
        <ProductVisual image={product.image} category={product.category} name={product.name} />
      </button>

      {/* Card body */}
      <div className="hr-card-body">
        {/* Source tag */}
        <span className="hr-card-tag">
          {product.brand || (product.supplier_id === 0 ? "MT Boss" : product.fromSupplier ? "Supplier" : "For quote")}
        </span>

        {/* Name */}
        <button type="button" className="hr-card-name-btn" onClick={() => onDetails(product)}>
          <h3 className="hr-card-name">{product.name}</h3>
        </button>

        {/* Category · Unit */}
        <p className="hr-card-cat">{product.category.name}{product.unit ? ` · ${displayUnit(product.unit)}` : ""}</p>

        {/* Price row */}
        <div className="hr-card-price">
          {hasPrice ? (
            <>
              {compareAt > price && (
                <del className="hr-price-was">₹{compareAt.toLocaleString("en-IN")}</del>
              )}
              <strong className="hr-price-now">₹{price.toLocaleString("en-IN")}</strong>
              <span className="hr-price-unit"> / {displayUnit(product.unit, "unit")}</span>
            </>
          ) : (
            <strong className="hr-price-now">Price on request</strong>
          )}
        </div>

        {/* Bulk pricing link */}
        {product.bulk_pricing?.length > 0 && (
          <button type="button" className="hr-bulk-link" onClick={() => onDetails(product)}>
            Unlock Bulk Prices →
          </button>
        )}

        {/* Availability notes */}
        {cityUnavailable && <span className="hr-stock-note">Not delivered in {selectedCity}</span>}
        {product.fromSupplier && Number(product.quantity) === 0 && (
          <span className="hr-stock-note">Currently unavailable</span>
        )}

        {/* Action buttons */}
        <div className="hr-card-actions">
          <button type="button" className="hr-btn-quote" disabled={!canOrder} onClick={() => onQuote(product)}>
            Get Quote
          </button>
          <button type="button" className="hr-btn-buy" disabled={!canOrder} onClick={() => onBuy(product)}>
            {canOrder ? "Buy Now" : "Unavailable"}
          </button>
        </div>

        {/* Cart quantity control */}
        {quantity ? (
          <div className="hr-qty-control" aria-label={`${product.name} quantity in cart`}>
            <button type="button" onClick={() => onChangeQty(product.id, -1)} aria-label={`Remove one ${product.name}`}>
              <Minus size={14} />
            </button>
            <span>{quantity} in cart</span>
            <button type="button" onClick={() => onChangeQty(product.id, 1)} aria-label={`Add one ${product.name}`}>
              <Plus size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="hr-btn-add"
            disabled={!canAdd || !canOrder}
            onClick={() => onAdd(product)}
          >
            <Plus size={14} />
            {!canOrder ? "Unavailable" : canAdd ? "Add to cart" : "Cart limit reached"}
          </button>
        )}
      </div>
    </article>
  );
}

// ── Main Storefront component ─────────────────────────────────────────────────
export default function Storefront({
  categories, products, content, loading, cities,
  selectedCity, setSelectedCity, cart,
  onAdd, onChangeQty, onQuote, onBuy, onCheckout,
}) {
  const [search,         setSearch]         = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [cartOpen,       setCartOpen]       = useState(false);
  const [cityOpen,       setCityOpen]       = useState(false);
  const [isAdmin,        setIsAdmin]        = useState(false);
  const [detailsProduct, setDetailsProduct] = useState(null);
  const [sortBy,         setSortBy]         = useState("featured");
  const [brandFilter,    setBrandFilter]    = useState("all");
  const searchScrolled = useRef(false);

  // Auto-scroll to catalog when user types a search term
  useEffect(() => {
    const term = search.trim();
    if (term && !searchScrolled.current) {
      searchScrolled.current = true;
      const id = setTimeout(() => {
        document.getElementById("store-products")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
      return () => clearTimeout(id);
    }
    if (!term) searchScrolled.current = false;
  }, [search]);

  // Scroll-lock: add .shop-is-scrolling during wheel/trackpad scroll to prevent stuck hover states
  useEffect(() => {
    const page = document.querySelector(".shop-page");
    if (!page) return;
    let timer = null;
    const onScroll = () => {
      page.classList.add("shop-is-scrolling");
      clearTimeout(timer);
      timer = setTimeout(() => page.classList.remove("shop-is-scrolling"), 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, { capture: true });
      clearTimeout(timer);
    };
  }, []);

  // Body scroll-lock when cart or detail overlay is open
  useEffect(() => {
    const isOpen = cartOpen || Boolean(detailsProduct);
    document.body.style.overflow = isOpen ? "hidden" : "";
    document.documentElement.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [cartOpen, detailsProduct]);

  // Sync active category from URL query param
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("category");
    const match = categories.find((c) => c.name.toLowerCase() === requested?.toLowerCase());
    if (!match) return undefined;
    const frame = requestAnimationFrame(() => setActiveCategory(match.id));
    return () => cancelAnimationFrame(frame);
  }, [categories]);

  // Admin check
  useEffect(() => {
    const checkAdmin = () => {
      let hasAdminRole = false;
      try { hasAdminRole = JSON.parse(localStorage.getItem("user") || "{}").role === "admin"; }
      catch { /* Ignore stale data. */ }
      setIsAdmin(Boolean(localStorage.getItem("admin-token")) || (Boolean(localStorage.getItem("token")) && hasAdminRole));
    };
    const frame = requestAnimationFrame(checkAdmin);
    window.addEventListener("storage", checkAdmin);
    window.addEventListener("userLoggedIn", checkAdmin);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("storage", checkAdmin);
      window.removeEventListener("userLoggedIn", checkAdmin);
    };
  }, []);

  // ── Data derivation (all preserved) ─────────────────────────────────────────
  const catalog = useMemo(() => categories.flatMap((category) => {
    const listed = products.filter((product) => {
      const assignedCategory = product.category?.trim().toLowerCase();
      const categoryName     = category.name.trim().toLowerCase();
      return assignedCategory
        ? assignedCategory === categoryName
        : product.name?.toLowerCase().includes(categoryName);
    });
    if (listed.length) return listed.map((product) => ({
      id: `supplier-${product.id}`,
      product_id: product.id,
      name: product.name,
      category,
      unit: product.unit || category.unit || "unit",
      price: product.price,
      image: product.image_url,
      description: product.description,
      brand: product.brand,
      compare_at_price: product.compare_at_price,
      images: product.images,
      specifications: product.specifications,
      bulk_pricing: product.bulk_pricing,
      quantity: product.quantity,
      fromSupplier: true,
      supplier_id: product.supplier_id,
      available_cities: product.available_cities,
      created_at: product.created_at,
    }));
    return (category.products || []).map((name, i) => ({
      id: `${category.id}-${i}`,
      name,
      category,
      unit: category.unit || "unit",
      price: null,
      image: "",
      fromSupplier: false,
    }));
  }), [categories, products]);

  const searchTerm = search.trim().toLowerCase();
  const visible = catalog.filter((p) => (
    (activeCategory === "all" || String(p.category.id) === String(activeCategory)) &&
    (brandFilter === "all" || p.brand === brandFilter) &&
    (!searchTerm || `${p.name} ${p.category.name}`.toLowerCase().includes(searchTerm))
  )).sort((a, b) =>
    sortBy === "price-asc"  ? (Number(a.price) || Infinity) - (Number(b.price) || Infinity) :
    sortBy === "price-desc" ? (Number(b.price) || 0) - (Number(a.price) || 0) :
    sortBy === "name"       ? a.name.localeCompare(b.name) : 0
  );

  const brands   = [...new Set(catalog
    .filter((p) => activeCategory === "all" || String(p.category.id) === String(activeCategory))
    .map((p) => p.brand).filter(Boolean))].sort();
  const featured = categories
    .map((cat) => catalog.find((p) => p.category.id === cat.id))
    .filter(Boolean).slice(0, 10);
  const deals    = catalog
    .filter((p) => Number(p.price) > 0 && Number(p.compare_at_price) > Number(p.price))
    .sort((a, b) => (1 - Number(b.price) / Number(b.compare_at_price)) - (1 - Number(a.price) / Number(a.compare_at_price)))
    .slice(0, 10);
  const arrivals = catalog
    .filter((p) => p.fromSupplier && p.created_at)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 10);

  const cartCount   = cart.reduce((s, i) => s + i.quantity, 0);
  const pricedTotal = cart.reduce((s, i) => s + unitPrice(i.product, i.quantity) * i.quantity, 0);
  const hasUnpriced = cart.some((i) => !Number(i.product.price));
  const detailsHasPrice = Number(detailsProduct?.price) > 0;
  const detailsCanOrder = detailsProduct ? productCanOrder(detailsProduct, selectedCity) : false;

  const chooseCategory = (id) => {
    setActiveCategory(id);
    setBrandFilter("all");
    setSearch("");
    const url = new URL(window.location.href);
    const selected = categories.find((c) => String(c.id) === String(id));
    if (selected) url.searchParams.set("category", selected.name);
    else url.searchParams.delete("category");
    window.history.replaceState(window.history.state, "", url);
    document.getElementById("store-products")?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  };

  // ── Section helper ───────────────────────────────────────────────────────────
  const ProductGrid = ({ items }) => (
    <div className="hr-product-grid">
      {items.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          quantity={cart.find((i) => i.product.id === product.id)?.quantity || 0}
          canAdd={cart.length < 20}
          onAdd={onAdd} onChangeQty={onChangeQty}
          onQuote={onQuote} onBuy={onBuy}
          onDetails={setDetailsProduct}
          selectedCity={selectedCity}
        />
      ))}
    </div>
  );

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="shop-page">

      {/* ── Primary Header ─────────────────────────────────────────────────── */}
      <header className="hr-header">
        <div className="hr-header-inner">

          {/* Logo */}
          <Link href="/" className="hr-logo" aria-label="MT Boss home">
            <img src="/logo.png" alt="MT Boss" />
            <small>SHOP</small>
          </Link>

          {/* Delivery city */}
          <div className="hr-loc-wrap">
            <button
              type="button"
              className="hr-loc-btn"
              onClick={() => setCityOpen(!cityOpen)}
              aria-expanded={cityOpen}
            >
              <MapPin size={16} />
              <span>
                <small>Deliver To</small>
                <strong>{selectedCity || "Select city"}</strong>
              </span>
              <ChevronDown size={14} />
            </button>
            {cityOpen && (
              <div className="store-city-popover">
                <label htmlFor="store-city">Choose your city</label>
                <select
                  id="store-city"
                  value={selectedCity}
                  onChange={(e) => { setSelectedCity(e.target.value); setCityOpen(false); }}
                >
                  <option value="">Select city</option>
                  {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                </select>
                <p>Availability is checked at checkout.</p>
              </div>
            )}
          </div>

          {/* Search */}
          <label className="hr-search">
            <Search size={18} />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={content.search_placeholder || "Search for cement, steel, sand…"}
              aria-label="Search materials"
            />
          </label>

          {/* Right zone */}
          <div className="hr-header-right">
            {isAdmin && (
              <Link href="/dashboard?tab=shop-products" className="hr-admin-add">
                <Plus size={16} /> Add Product
              </Link>
            )}
            <Link href="/material-orders?role=user" className="hr-nav-icon" title="Track orders">
              <ClipboardList size={22} />
              <span>Orders</span>
            </Link>
            <Link href="/login" className="hr-nav-icon" title="Login">
              <User size={22} />
              <span>Login</span>
            </Link>
            <button type="button" className="hr-cart-btn" onClick={() => setCartOpen(true)}>
              <ShoppingCart size={20} />
              <span>My Cart</span>
              {cartCount > 0 && <b className="hr-cart-count">{cartCount}</b>}
            </button>
          </div>
        </div>
      </header>

      {/* ── Category Navigation Bar ─────────────────────────────────────────── */}
      {categories.length > 0 && (
        <nav className="hr-cat-nav" aria-label="Shop categories">
          <div className="hr-cat-nav-inner">
            <button
              type="button"
              className={activeCategory === "all" ? "is-active" : ""}
              onClick={() => chooseCategory("all")}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={String(activeCategory) === String(cat.id) ? "is-active" : ""}
                onClick={() => chooseCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* ── Main Content ────────────────────────────────────────────────────── */}
      <main className="store-main">

        {/* Breadcrumb */}
        <div className="store-breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <strong>Shop materials</strong>
        </div>

        {/* ── Hero Banner ───────────────────────────────────────────────────── */}
        <section className="hr-hero">
          <div className="hr-hero-copy">
            <span className="hr-hero-kicker">{content.hero_kicker}</span>
            <h1>{content.hero_title} <em>{content.hero_highlight}</em></h1>
            <p>{content.hero_description}</p>
            <button type="button" className="hr-hero-btn" onClick={() => chooseCategory("all")}>
              {content.hero_button} <ArrowRight size={18} />
            </button>
          </div>
          <div className="hr-hero-img" role="img" aria-label="Construction materials">
            <img src={content.hero_image} alt="" />
            {content.hero_badge && (
              <span className="hr-hero-badge">
                <CheckCircle2 size={16} /> {content.hero_badge}
              </span>
            )}
          </div>
        </section>

        {/* ── Value Props ───────────────────────────────────────────────────── */}
        {content.promos?.length > 0 && (
          <section className="hr-promos" aria-label="Shopping benefits">
            {[Package, ShieldCheck, Truck].map((Icon, i) => (
              <div key={i} className="hr-promo">
                <span className="hr-promo-icon"><Icon size={26} /></span>
                <div>
                  <strong>{content.promos[i]?.title}</strong>
                  <span>{content.promos[i]?.subtitle}</span>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* ── Shop by Category ──────────────────────────────────────────────── */}
        <section className="store-section" aria-labelledby="hr-cats-heading">
          <div className="store-section-heading">
            <div>
              <span className="store-section-kicker">START SHOPPING</span>
              <h2 id="hr-cats-heading">{content.categories_heading}</h2>
            </div>
            <span className="store-section-note">Pick a category to see materials</span>
          </div>
          {loading ? (
            <div className="store-loading">Loading categories…</div>
          ) : categories.length ? (
            <div className="hr-cat-grid">
              {categories.map((cat) => {
                const { tone, Icon } = categoryStyle(cat.name);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`hr-cat-card hr-cat-${tone}`}
                    onClick={() => chooseCategory(cat.id)}
                  >
                    <span className="hr-cat-img">
                      {cat.image
                        ? <img src={cat.image} alt="" loading="lazy" />
                        : <Icon size={36} strokeWidth={1.4} />
                      }
                    </span>
                    <span className="hr-cat-name">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="store-empty">Categories are being added. Please check back soon.</div>
          )}
        </section>

        {/* ── Popular / Featured ────────────────────────────────────────────── */}
        {!searchTerm && activeCategory === "all" && featured.length > 0 && (
          <section className="store-section" aria-labelledby="hr-featured-heading">
            <div className="store-section-heading">
              <div>
                <span className="store-section-kicker">POPULAR PICKS</span>
                <h2 id="hr-featured-heading">{content.featured_heading}</h2>
              </div>
              <span className="store-section-note">Get a quote or order directly</span>
            </div>
            <ProductGrid items={featured} />
          </section>
        )}

        {/* ── Current Deals ─────────────────────────────────────────────────── */}
        {!searchTerm && activeCategory === "all" && deals.length > 0 && (
          <section className="store-section" aria-labelledby="hr-deals-heading">
            <div className="store-section-heading">
              <div>
                <span className="store-section-kicker">CURRENT OFFERS</span>
                <h2 id="hr-deals-heading">{content.deals_heading}</h2>
              </div>
              <span className="store-section-note">Savings shown against original price</span>
            </div>
            <ProductGrid items={deals} />
          </section>
        )}

        {/* ── New Arrivals ──────────────────────────────────────────────────── */}
        {!searchTerm && activeCategory === "all" && arrivals.length > 0 && (
          <section className="store-section" aria-labelledby="hr-arrivals-heading">
            <div className="store-section-heading">
              <div>
                <span className="store-section-kicker">NEWLY LAUNCHED</span>
                <h2 id="hr-arrivals-heading">{content.arrivals_heading}</h2>
              </div>
              <span className="store-section-note">Recently added products</span>
            </div>
            <ProductGrid items={arrivals} />
          </section>
        )}

        {/* ── Full Catalogue ────────────────────────────────────────────────── */}
        <section className="store-section store-catalog" id="store-products" aria-labelledby="hr-catalog-heading">
          <div className="store-section-heading">
            <div>
              <span className="store-section-kicker">THE CATALOGUE</span>
              <h2 id="hr-catalog-heading">
                {searchTerm
                  ? `Results for "${search}"`
                  : activeCategory === "all"
                    ? content.catalog_heading
                    : categories.find((c) => String(c.id) === String(activeCategory))?.name || "Materials"}
              </h2>
            </div>
            <span className="store-section-note">{visible.length} items</span>
          </div>

          {/* Filter pill row */}
          <div className="store-filter-row">
            <button type="button" className={activeCategory === "all" ? "is-active" : ""} onClick={() => setActiveCategory("all")}>All</button>
            {categories.map((cat) => (
              <button key={cat.id} type="button"
                className={String(activeCategory) === String(cat.id) ? "is-active" : ""}
                onClick={() => setActiveCategory(cat.id)}>
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort / Brand tools */}
          <div className="store-catalog-tools">
            <label>Brand
              <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}>
                <option value="all">All brands</option>
                {brands.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </label>
            <label>Sort by
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </label>
          </div>

          {loading
            ? <div className="store-loading">Loading materials…</div>
            : visible.length
              ? <ProductGrid items={visible} />
              : <div className="store-empty">No materials found. Try another search or category.</div>}
        </section>
      </main>

      {/* ── Product Detail Dialog ────────────────────────────────────────────── */}
      {detailsProduct && (
        <div className="store-overlay" onClick={() => setDetailsProduct(null)}>
          <section
            className="store-detail-dialog"
            role="dialog" aria-modal="true"
            aria-label={`${detailsProduct.name} details`}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="store-detail-close" onClick={() => setDetailsProduct(null)} aria-label="Close product details">
              <X size={22} />
            </button>
            <div className="store-detail-gallery">
              <ProductVisual image={detailsProduct.image} category={detailsProduct.category} name={detailsProduct.name} />
              {detailsProduct.images?.length > 0 && (
                <div className="store-detail-thumbs">
                  {detailsProduct.images.map((url) => (
                    <img key={url} src={url} alt={`${detailsProduct.name} additional view`} loading="lazy" />
                  ))}
                </div>
              )}
            </div>
            <div className="store-detail-info">
              <span className="store-product-tag">{detailsProduct.brand || detailsProduct.category.name}</span>
              <h2>{detailsProduct.name}</h2>
              <p>{detailsProduct.category.name} · {displayUnit(detailsProduct.unit)}</p>
              <div className="store-detail-price">
                {detailsHasPrice
                  ? <>₹{Number(detailsProduct.price).toLocaleString("en-IN")} / {displayUnit(detailsProduct.unit)}
                      {Number(detailsProduct.compare_at_price) > Number(detailsProduct.price) && (
                        <del>₹{Number(detailsProduct.compare_at_price).toLocaleString("en-IN")}</del>
                      )}</>
                  : "Price on request"}
              </div>
              {detailsProduct.description && <p className="store-detail-description">{detailsProduct.description}</p>}
              {Object.keys(detailsProduct.specifications || {}).length > 0 && (
                <><h3>Specifications</h3>
                  <dl className="store-specs">
                    {Object.entries(detailsProduct.specifications).map(([k, v]) => (
                      <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                    ))}
                  </dl></>
              )}
              {detailsProduct.bulk_pricing?.length > 0 && (
                <><h3>Bulk prices</h3>
                  <div className="store-bulk-tiers">
                    {detailsProduct.bulk_pricing.map((t) => (
                      <span key={t.min_quantity}>{t.min_quantity}+ {displayUnit(detailsProduct.unit)}: ₹{Number(t.price).toLocaleString("en-IN")} each</span>
                    ))}
                  </div></>
              )}
              <div className="store-detail-actions store-detail-actions-priced">
                <button type="button" className="store-detail-quote" disabled={!detailsCanOrder} onClick={() => { onQuote(detailsProduct); setDetailsProduct(null); }}>{detailsCanOrder ? 'Get Quote' : 'Unavailable'}</button>
                <button type="button" className="store-detail-buy" disabled={!detailsCanOrder} onClick={() => { onBuy(detailsProduct); setDetailsProduct(null); }}>{detailsCanOrder ? 'Buy Now' : 'Unavailable'}</button>
                <button type="button" className="store-detail-add" disabled={!detailsCanOrder || cart.length >= 20} onClick={() => onAdd(detailsProduct)}>Add to cart</button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ── Cart Drawer ──────────────────────────────────────────────────────── */}
      {cartOpen && (
        <div className="store-overlay" onClick={() => setCartOpen(false)}>
          <aside
            className="store-cart-drawer"
            role="dialog" aria-modal="true" aria-label="Shopping cart"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="store-drawer-head">
              <div>
                <span>YOUR SELECTION</span>
                <h2>My cart <small>({cartCount} items)</small></h2>
              </div>
              <button type="button" aria-label="Close cart" onClick={() => setCartOpen(false)}>
                <X size={23} />
              </button>
            </div>
            {cart.length ? (
              <>
                <div className="store-cart-list">
                  {cart.map((item) => {
                    const itemUnitPrice = unitPrice(item.product, item.quantity);
                    return (
                      <div className="store-cart-item" key={item.product.id}>
                        <ProductVisual compact image={item.product.image} category={item.product.category} name={item.product.name} />
                        <div>
                          <strong>{item.product.name}</strong>
                          <span>{item.product.category.name} · ₹{itemUnitPrice.toLocaleString('en-IN')} / {displayUnit(item.product.unit)}</span>
                          <span>Line total: ₹{(itemUnitPrice * item.quantity).toLocaleString('en-IN')}</span>
                          <div className="store-cart-quantity">
                            <button type="button" onClick={() => onChangeQty(item.product.id, -1)} aria-label={`Remove one ${item.product.name}`}><Minus size={14} /></button>
                            <b>{item.quantity}</b>
                            <button type="button" onClick={() => onChangeQty(item.product.id, 1)} aria-label={`Add one ${item.product.name}`}><Plus size={14} /></button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="store-cart-bottom">
                  <div className="store-cart-estimate">
                    <span>Product total</span>
                    <strong>₹{pricedTotal.toLocaleString("en-IN")}{hasUnpriced ? " + quote items" : ""}</strong>
                  </div>
                  <p>Delivery charges, if applicable, are confirmed separately.</p>
                  <button type="button" className="store-checkout-button" onClick={() => { setCartOpen(false); onCheckout(); }}>
                    Continue to checkout <ArrowRight size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div className="store-cart-empty">
                <ShoppingCart size={48} />
                <h3>Your cart is empty</h3>
                <p>Add materials to place an order together.</p>
                <button type="button" onClick={() => setCartOpen(false)}>Continue shopping</button>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
