/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, CheckCircle2, ChevronDown, ClipboardList, Grid3X3,
  Hammer, MapPin, Minus, Mountain, Package, PaintBucket, Plus,
  Search, ShieldCheck, ShoppingCart, Truck, Wrench, X,
} from "lucide-react";
import "./shop.css";

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
        <img src={image || category.image} alt={name} loading="lazy" />
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

function ProductCard({ product, quantity, canAdd, onAdd, onChangeQty, onQuote, onBuy, onDetails, selectedCity }) {
  const price = Number(product.price);
  const hasPrice = Number.isFinite(price) && price > 0;
  const normalizedCity = selectedCity.trim().toLowerCase();
  const cityUnavailable = Boolean(normalizedCity && product.available_cities?.length && !product.available_cities.some((city) => city.trim().toLowerCase() === normalizedCity));
  const canOrder = productCanOrder(product, selectedCity);
  return (
    <article className="store-product-card">
      <button type="button" className="store-product-image-button" onClick={() => onDetails(product)} aria-label={`View ${product.name} details`}><ProductVisual image={product.image} category={product.category} name={product.name} /></button>
      <div className="store-product-details">
        <span className="store-product-tag">Available for quote</span>
        <button type="button" className="store-product-title" onClick={() => onDetails(product)}><h3>{product.name}</h3></button>
        <p className="store-product-category">{product.category.name}{product.unit ? ` · ${product.unit}` : ""}</p>
        <div className="store-product-price">
          <strong>Price on request</strong>
        </div>
        {cityUnavailable && <span className="store-stock-note">Not delivered in {selectedCity}</span>}
        {product.fromSupplier && Number(product.quantity) === 0 && <span className="store-stock-note">Currently unavailable</span>}
        <div className="store-product-actions">
          <button type="button" className="store-quote-btn" disabled={!canOrder} onClick={() => onQuote(product)}>{canOrder ? 'Get Quote' : 'Unavailable'}</button>
          <button type="button" className="store-buy-btn" disabled={!canOrder || !hasPrice} title={!hasPrice ? 'Exact price is required for Buy Now' : undefined} onClick={() => onBuy(product)}>{canOrder ? 'Buy Now' : 'Unavailable'}</button>
        </div>
        {hasPrice && quantity ? (
          <div className="store-quantity-control" aria-label={`${product.name} quantity in cart`}>
            <button type="button" onClick={() => onChangeQty(product.id, -1)} aria-label={`Remove one ${product.name}`}><Minus size={15} /></button>
            <span>{quantity} in cart</span>
            <button type="button" onClick={() => onChangeQty(product.id, 1)} aria-label={`Add one ${product.name}`}><Plus size={15} /></button>
          </div>
        ) : (
          <button type="button" className="store-add-btn" disabled={!hasPrice || !canAdd || !canOrder} title={!hasPrice ? 'Exact price is required for cart orders' : undefined} onClick={() => onAdd(product)}><Plus size={15} /> {!canOrder ? 'Unavailable' : canAdd ? "Add to cart" : "Cart limit reached"}</button>
        )}
      </div>
    </article>
  );
}

export default function Storefront({ categories, products, content, loading, cities, selectedCity, setSelectedCity, cart, onAdd, onChangeQty, onQuote, onBuy, onCheckout }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [cartOpen, setCartOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [detailsProduct, setDetailsProduct] = useState(null);
  const [sortBy, setSortBy] = useState('featured');
  const [brandFilter, setBrandFilter] = useState('all');
  const searchScrolled = useRef(false);

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

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('category');
    const match = categories.find((category) => category.name.toLowerCase() === requested?.toLowerCase());
    if (!match) return undefined;
    const frame = requestAnimationFrame(() => setActiveCategory(match.id));
    return () => cancelAnimationFrame(frame);
  }, [categories]);

  useEffect(() => {
    const checkAdmin = () => {
      let hasAdminRole = false;
      try { hasAdminRole = JSON.parse(localStorage.getItem('user') || '{}').role === 'admin'; }
      catch { /* Ignore stale user data. */ }
      setIsAdmin(Boolean(localStorage.getItem('admin-token')) || (Boolean(localStorage.getItem('token')) && hasAdminRole));
    };
    const frame = requestAnimationFrame(checkAdmin);
    window.addEventListener('storage', checkAdmin);
    window.addEventListener('userLoggedIn', checkAdmin);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('storage', checkAdmin);
      window.removeEventListener('userLoggedIn', checkAdmin);
    };
  }, []);

  const catalog = useMemo(() => categories.flatMap((category) => {
    const listed = products.filter((product) => {
      const assignedCategory = product.category?.trim().toLowerCase();
      const categoryName = category.name.trim().toLowerCase();
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
      supplier_id: product.supplier_id,
      available_cities: product.available_cities,
      created_at: product.created_at,
      fromSupplier: true,
    }));
    const names = Array.isArray(category.types) && category.types.length ? category.types : [category.name];
    return names.map((name, index) => ({
      id: `catalog-${category.id}-${index}`,
      name,
      category,
      unit: category.unit || "unit",
      price: null,
      image: "",
      fromSupplier: false,
    }));
  }), [categories, products]);

  const searchTerm = search.trim().toLowerCase();
  const visible = catalog.filter((product) => (
    (activeCategory === "all" || String(product.category.id) === String(activeCategory)) &&
    (brandFilter === 'all' || product.brand === brandFilter) &&
    (!searchTerm || `${product.name} ${product.category.name}`.toLowerCase().includes(searchTerm))
  )).sort((a, b) => sortBy === 'price-asc' ? (Number(a.price) || Infinity) - (Number(b.price) || Infinity) : sortBy === 'price-desc' ? (Number(b.price) || 0) - (Number(a.price) || 0) : sortBy === 'name' ? a.name.localeCompare(b.name) : 0);
  const brands = [...new Set(catalog.filter((product) => activeCategory === 'all' || String(product.category.id) === String(activeCategory)).map((product) => product.brand).filter(Boolean))].sort();
  const featured = categories.map((category) => catalog.find((product) => product.category.id === category.id)).filter(Boolean).slice(0, 8);
  const deals = catalog.filter((product) => Number(product.price) > 0 && Number(product.compare_at_price) > Number(product.price)).sort((a, b) => (1 - Number(b.price) / Number(b.compare_at_price)) - (1 - Number(a.price) / Number(a.compare_at_price))).slice(0, 6);
  const arrivals = catalog.filter((product) => product.fromSupplier && product.created_at).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 6);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const pricedTotal = cart.reduce((sum, item) => sum + unitPrice(item.product, item.quantity) * item.quantity, 0);
  const detailsCanOrder = detailsProduct ? productCanOrder(detailsProduct, selectedCity) : false;

  const chooseCategory = (id) => {
    setActiveCategory(id);
    setBrandFilter('all');
    setSearch("");
    const url = new URL(window.location.href);
    const selected = categories.find((category) => String(category.id) === String(id));
    if (selected) url.searchParams.set('category', selected.name);
    else url.searchParams.delete('category');
    window.history.replaceState(window.history.state, '', url);
    document.getElementById("store-products")?.scrollIntoView({ behavior: "smooth", block: "start" });
    // Immediately drop focus from the clicked card so :focus style never sticks during scroll
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  };

  return (
    <div className="shop-page">
      <header className="store-header">
        <div className="store-header-inner">
          <Link href="/" className="store-brand" aria-label="MT Boss home"><picture className="store-brand-picture"><img src="/logo.png" alt="MT Boss" /></picture><small>SHOP</small></Link>
          <div className="store-location-wrap">
            <button type="button" className="store-location" onClick={() => setCityOpen(!cityOpen)} aria-expanded={cityOpen}>
              <MapPin size={20} /><span><strong>Deliver to {selectedCity || "your city"}</strong><small>{selectedCity ? "Change location" : "Select delivery location"}</small></span><ChevronDown size={16} />
            </button>
            {cityOpen && <div className="store-city-popover"><label htmlFor="store-city">Choose your city</label><select id="store-city" value={selectedCity} onChange={(e) => { setSelectedCity(e.target.value); setCityOpen(false); }}><option value="">Select city</option>{cities.map((city) => <option key={city} value={city}>{city}</option>)}</select><p>Availability is checked at checkout.</p></div>}
          </div>
          <label className="store-search"><Search size={20} /><input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={content.search_placeholder} aria-label="Search materials" /></label>
          {isAdmin && <Link href="/dashboard?tab=shop-products" className="store-admin-add"><Plus size={17} /> Add Product</Link>}
          <Link href="/material-orders?role=user" className="store-orders" title="Track orders"><ClipboardList size={20} /><span>Orders</span></Link>
          <button type="button" className="store-cart-button" onClick={() => setCartOpen(true)}><ShoppingCart size={20} /><span>My Cart</span>{cartCount > 0 && <b>{cartCount}</b>}</button>
        </div>
      </header>

      {categories.length > 0 && <nav className="store-category-nav" aria-label="Shop categories"><div>{categories.map((category) => <button type="button" key={category.id} onClick={() => chooseCategory(category.id)}>{category.name}</button>)}</div></nav>}

      <main className="store-main">
        <div className="store-breadcrumb"><Link href="/">Home</Link><span>/</span><strong>Shop materials</strong></div>
        <section className="store-hero">
          <div className="store-hero-copy"><span className="store-eyebrow">{content.hero_kicker}</span><h1>{content.hero_title} <em>{content.hero_highlight}</em></h1><p>{content.hero_description}</p><button type="button" className="store-hero-button" onClick={() => chooseCategory("all")}>{content.hero_button} <ArrowRight size={18} /></button></div>
          <div className="store-hero-photo" role="img" aria-label="Construction materials"><picture className="store-hero-picture"><img src={content.hero_image} alt="" /></picture><span className="store-hero-photo-label"><CheckCircle2 size={17} /> {content.hero_badge}</span></div>
        </section>

        <section className="store-promos" aria-label="Shopping benefits">
          {[Package, ShieldCheck, Truck].map((Icon, index) => <div key={index} className={`store-promo store-promo-${index}`}><Icon size={32} /><div><strong>{content.promos[index].title}</strong><span>{content.promos[index].subtitle}</span></div><ArrowRight size={18} /></div>)}
        </section>

        <section className="store-section" aria-labelledby="store-categories-heading">
          <div className="store-section-heading"><div><span className="store-section-kicker">START SHOPPING</span><h2 id="store-categories-heading">{content.categories_heading}</h2></div><span className="store-section-note">Pick a category to see materials</span></div>
          {loading ? <div className="store-loading">Loading categories...</div> : categories.length ? <div className="store-category-grid">{categories.map((category) => {
            const { tone, Icon } = categoryStyle(category.name);
            return <button type="button" key={category.id} className={`store-category store-category-${tone}`} onClick={() => chooseCategory(category.id)}><span className="store-category-art">{category.image ? <>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={category.image} alt="" loading="lazy" /></> : <Icon size={37} strokeWidth={1.5} />}</span><strong>{category.name}</strong><span>Explore <ArrowRight size={13} /></span></button>;
          })}</div> : <div className="store-empty">Categories are being added. Please check back soon.</div>}
        </section>

        {!searchTerm && activeCategory === "all" && featured.length > 0 && <section className="store-section" aria-labelledby="store-featured-heading"><div className="store-section-heading"><div><span className="store-section-kicker">POPULAR PICKS</span><h2 id="store-featured-heading">{content.featured_heading}</h2></div><span className="store-section-note">Fixed-price orders and custom quotes</span></div><div className="store-product-grid">{featured.map((product) => <ProductCard key={product.id} product={product} quantity={cart.find((item) => item.product.id === product.id)?.quantity || 0} canAdd={cart.length < 20} onAdd={onAdd} onChangeQty={onChangeQty} onQuote={onQuote} onBuy={onBuy} onDetails={setDetailsProduct} selectedCity={selectedCity} />)}</div></section>}

        {!searchTerm && activeCategory === 'all' && deals.length > 0 && <section className="store-section" aria-labelledby="store-deals-heading"><div className="store-section-heading"><div><span className="store-section-kicker">CURRENT OFFERS</span><h2 id="store-deals-heading">{content.deals_heading}</h2></div><span className="store-section-note">Request today&apos;s best supplier quote</span></div><div className="store-product-grid">{deals.map((product) => <ProductCard key={product.id} product={product} quantity={cart.find((item) => item.product.id === product.id)?.quantity || 0} canAdd={cart.length < 20} onAdd={onAdd} onChangeQty={onChangeQty} onQuote={onQuote} onBuy={onBuy} onDetails={setDetailsProduct} selectedCity={selectedCity} />)}</div></section>}

        {!searchTerm && activeCategory === 'all' && arrivals.length > 0 && <section className="store-section" aria-labelledby="store-arrivals-heading"><div className="store-section-heading"><div><span className="store-section-kicker">JUST ADDED</span><h2 id="store-arrivals-heading">{content.arrivals_heading}</h2></div><span className="store-section-note">Recently added products</span></div><div className="store-product-grid">{arrivals.map((product) => <ProductCard key={product.id} product={product} quantity={cart.find((item) => item.product.id === product.id)?.quantity || 0} canAdd={cart.length < 20} onAdd={onAdd} onChangeQty={onChangeQty} onQuote={onQuote} onBuy={onBuy} onDetails={setDetailsProduct} selectedCity={selectedCity} />)}</div></section>}

        <section className="store-section store-catalog" id="store-products" aria-labelledby="store-products-heading">
          <div className="store-section-heading"><div><span className="store-section-kicker">THE CATALOGUE</span><h2 id="store-products-heading">{searchTerm ? `Results for “${search}”` : activeCategory === "all" ? content.catalog_heading : categories.find((category) => String(category.id) === String(activeCategory))?.name || "Materials"}</h2></div><span className="store-section-note">{visible.length} items</span></div>
          <div className="store-filter-row"><button type="button" className={activeCategory === "all" ? "is-active" : ""} onClick={() => setActiveCategory("all")}>All</button>{categories.map((category) => <button key={category.id} type="button" className={String(activeCategory) === String(category.id) ? "is-active" : ""} onClick={() => setActiveCategory(category.id)}>{category.name}</button>)}</div>
          <div className="store-catalog-tools"><label>Brand <select value={brandFilter} onChange={(event) => setBrandFilter(event.target.value)}><option value="all">All brands</option>{brands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}</select></label><label>Sort by <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="featured">Featured</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="name">Name: A to Z</option></select></label></div>
          {loading ? <div className="store-loading">Loading materials...</div> : visible.length ? <div className="store-product-grid">{visible.map((product) => <ProductCard key={product.id} product={product} quantity={cart.find((item) => item.product.id === product.id)?.quantity || 0} canAdd={cart.length < 20} onAdd={onAdd} onChangeQty={onChangeQty} onQuote={onQuote} onBuy={onBuy} onDetails={setDetailsProduct} selectedCity={selectedCity} />)}</div> : <div className="store-empty">No materials found. Try another search or category.</div>}
        </section>
      </main>

      {detailsProduct && (
        <div className="store-overlay" onClick={() => setDetailsProduct(null)}>
          <section className="store-detail-dialog" role="dialog" aria-modal="true" aria-label={`${detailsProduct.name} details`} onClick={(event) => event.stopPropagation()}>
            <button type="button" className="store-detail-close" onClick={() => setDetailsProduct(null)} aria-label="Close product details"><X size={22} /></button>
            <div className="store-detail-gallery">
              <ProductVisual image={detailsProduct.image} category={detailsProduct.category} name={detailsProduct.name} />
              {detailsProduct.images?.length > 0 && <div className="store-detail-thumbs">{detailsProduct.images.map((url) => <img key={url} src={url} alt={`${detailsProduct.name} additional view`} loading="lazy" />)}</div>}
            </div>
            <div className="store-detail-info">
              <span className="store-product-tag">{detailsProduct.brand || detailsProduct.category.name}</span>
              <h2>{detailsProduct.name}</h2>
              <p>{detailsProduct.category.name} · {displayUnit(detailsProduct.unit)}</p>
              <div className="store-detail-price">Price on request</div>
              {detailsProduct.description && <p className="store-detail-description">{detailsProduct.description}</p>}
              {Object.keys(detailsProduct.specifications || {}).length > 0 && <><h3>Specifications</h3><dl className="store-specs">{Object.entries(detailsProduct.specifications).map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl></>}
              <div className="store-detail-actions store-detail-actions-priced">
                <button type="button" className="store-detail-quote" disabled={!detailsCanOrder} onClick={() => { onQuote(detailsProduct); setDetailsProduct(null); }}>{detailsCanOrder ? 'Get Quote' : 'Unavailable'}</button>
                <button type="button" className="store-detail-buy" disabled={!detailsCanOrder || !(Number(detailsProduct.price) > 0)} title={!(Number(detailsProduct.price) > 0) ? 'Exact price is required for Buy Now' : undefined} onClick={() => { onBuy(detailsProduct); setDetailsProduct(null); }}>{detailsCanOrder ? 'Buy Now' : 'Unavailable'}</button>
                <button type="button" className="store-detail-add" disabled={!detailsCanOrder || !(Number(detailsProduct.price) > 0) || cart.length >= 20} title={!(Number(detailsProduct.price) > 0) ? 'Exact price is required for cart orders' : undefined} onClick={() => onAdd(detailsProduct)}>Add to cart</button>
              </div>
            </div>
          </section>
        </div>
      )}

      {cartOpen && (
        <div className="store-overlay" onClick={() => setCartOpen(false)}>
          <aside className="store-cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping cart" onClick={(e) => e.stopPropagation()}>
            <div className="store-drawer-head"><div><span>YOUR SELECTION</span><h2>My cart <small>({cartCount} items)</small></h2></div><button type="button" aria-label="Close cart" onClick={() => setCartOpen(false)}><X size={23} /></button></div>
            {cart.length ? <>
              <div className="store-cart-list">{cart.map((item) => {
                const itemUnitPrice = unitPrice(item.product, item.quantity);
                return <div className="store-cart-item" key={item.product.id}>
                  <ProductVisual compact image={item.product.image} category={item.product.category} name={item.product.name} />
                  <div>
                    <strong>{item.product.name}</strong>
                    <span>{item.product.category.name} · ₹{itemUnitPrice.toLocaleString('en-IN')} / {displayUnit(item.product.unit)}</span>
                    <span>Line total: ₹{(itemUnitPrice * item.quantity).toLocaleString('en-IN')}</span>
                    <div className="store-cart-quantity"><button type="button" onClick={() => onChangeQty(item.product.id, -1)} aria-label={`Remove one ${item.product.name}`}><Minus size={14} /></button><b>{item.quantity}</b><button type="button" onClick={() => onChangeQty(item.product.id, 1)} aria-label={`Add one ${item.product.name}`}><Plus size={14} /></button></div>
                  </div>
                </div>;
              })}</div>
              <div className="store-cart-bottom">
                <div className="store-cart-estimate"><span>Product total</span><strong>₹{pricedTotal.toLocaleString("en-IN")}</strong></div>
                <p>Delivery charges, if applicable, are confirmed separately.</p>
                <button type="button" className="store-checkout-button" onClick={() => { setCartOpen(false); onCheckout(); }}>Continue to checkout <ArrowRight size={18} /></button>
              </div>
            </> : <div className="store-cart-empty"><ShoppingCart size={48} /><h3>Your cart is empty</h3><p>Add fixed-price materials to place an order together.</p><button type="button" onClick={() => setCartOpen(false)}>Continue shopping</button></div>}
          </aside>
        </div>
      )}
    </div>
  );
}
