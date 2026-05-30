'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react';

const cementBagIcon =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 180'%3E%3Crect width='240' height='180' fill='%23f8f8f8'/%3E%3Cg transform='translate(72 24)'%3E%3Cpath d='M16 6h66l14 118H2L16 6Z' fill='%23f7c948' stroke='%23242830' stroke-width='5'/%3E%3Cpath d='M18 6h62l-8 20H26L18 6Z' fill='%23fff4b8'/%3E%3Cpath d='M10 82h82l5 42H4l6-42Z' fill='%23fff' opacity='.72'/%3E%3Ctext x='48' y='62' text-anchor='middle' font-family='Arial,sans-serif' font-size='20' font-weight='900' fill='%23242830'%3ECEMENT%3C/text%3E%3Ctext x='48' y='105' text-anchor='middle' font-family='Arial,sans-serif' font-size='17' font-weight='900' fill='%23242830'%3E50 KG%3C/text%3E%3C/g%3E%3C/svg%3E";
const bricksIcon =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 180'%3E%3Crect width='240' height='180' fill='%23f8f8f8'/%3E%3Cg transform='translate(78 58)'%3E%3Crect x='22' y='34' width='48' height='26' rx='3' fill='%23e85d2a'/%3E%3Crect x='66' y='34' width='48' height='26' rx='3' fill='%23f47a37'/%3E%3Crect x='44' y='10' width='48' height='26' rx='3' fill='%23f17a36'/%3E%3Cpath d='M22 60h92L94 82H2l20-22Z' fill='%23c94723'/%3E%3Cpath d='M114 34 94 10v26l20 24V34Z' fill='%23d95b2c'/%3E%3C/g%3E%3Cg transform='translate(38 28) rotate(-20 35 60)'%3E%3Cpath d='M32 8c20 18 33 43 24 67-9 24-34 37-50 32 5-19 8-38 6-58C10 30 16 16 32 8Z' fill='%23d7d7d7' stroke='%23787878' stroke-width='4'/%3E%3Crect x='47' y='80' width='13' height='56' rx='6' fill='%23944a26'/%3E%3Crect x='43' y='70' width='22' height='18' rx='7' fill='%23b85b2d'/%3E%3C/g%3E%3C/svg%3E";

const categoryIcons = {
  Steel: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&q=80',
  Bricks: bricksIcon,
  Cement: cementBagIcon,
  Wiring: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=500&q=80',
  Plumbing: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=500&q=80',
  Putty: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=500&q=80',
  Paints: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=500&q=80',
  Window: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&q=80',
  Door: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&q=80',
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0);

const foundationTypes = ['Isolated (valid upto G+3)', 'Pile', 'Matt', 'Basement'];

export default function ConstructionCalculator() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [options, setOptions] = useState({
    city: 'Noida',
    slabArea: '1000',
    floors: '1',
    foundation: '',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/calculator-products', { cache: 'no-store' });
        const data = await res.json();
        if (data.success) {
          setProducts(data.data || []);
          setActiveCategory(data.data?.[0]?.category || '');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(
        document.documentElement.classList.contains('dark-mode') ||
        localStorage.getItem('theme') === 'dark'
      );
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  const categories = useMemo(() => {
    const map = new Map();
    products.forEach((product) => {
      if (!map.has(product.category)) {
        map.set(product.category, {
          name: product.category,
          badge: product.badge || 'Recommended',
          image: product.image_url || categoryIcons[product.category],
        });
      }
    });
    return Array.from(map.values());
  }, [products]);

  const visibleProducts = products.filter((product) => product.category === activeCategory);
  const selectedItems = Object.values(cart);
  const subtotal = selectedItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const slabMultiplier = Math.max(parseInt(options.slabArea, 10) || 0, 1) / 1000;
  const floorMultiplier = Math.max(parseInt(options.floors, 10) || 1, 1);
  const foundationMultiplier = options.foundation === 'Matt' ? 1.18 : options.foundation === 'Pile' ? 1.32 : 1;
  const estimate = Math.round(subtotal * slabMultiplier * floorMultiplier * foundationMultiplier);

  const addToCart = (product) => {
    setCart((current) => ({
      ...current,
      [product.id]: {
        ...product,
        quantity: (current[product.id]?.quantity || 0) + 1,
      },
    }));
  };

  const changeQty = (productId, delta) => {
    setCart((current) => {
      const item = current[productId];
      if (!item) return current;
      const nextQty = item.quantity + delta;
      if (nextQty <= 0) {
        const next = { ...current };
        delete next[productId];
        return next;
      }
      return { ...current, [productId]: { ...item, quantity: nextQty } };
    });
  };

  const categoryShift = (direction) => {
    const index = categories.findIndex((category) => category.name === activeCategory);
    if (index === -1) return;
    const nextIndex = (index + direction + categories.length) % categories.length;
    setActiveCategory(categories[nextIndex].name);
  };

  return (
    <>
      <style>{`
        .calc-page {
          --calc-bg: #ffffff;
          --calc-surface: #ffffff;
          --calc-card: #f7f7f8;
          --calc-card-soft: #fafafa;
          --calc-muted-surface: #f8f8f8;
          --calc-border: #e5e7eb;
          --calc-border-soft: #f0f0f0;
          --calc-text: #242830;
          --calc-heading: #111827;
          --calc-muted: #59606b;
          --calc-muted-strong: #6b7280;
          --calc-accent: #f6b400;
          min-height: 100vh;
          background: var(--calc-bg);
          color: var(--calc-text);
          font-family: 'DM Sans', system-ui, sans-serif;
          transition: background .2s ease, color .2s ease;
        }
        .dark-mode .calc-page,
        .calc-page.dark {
          --calc-bg: #000000;
          --calc-surface: #0f0f10;
          --calc-card: #141416;
          --calc-card-soft: #111113;
          --calc-muted-surface: #18181b;
          --calc-border: #2a2a2d;
          --calc-border-soft: #27272a;
          --calc-text: #f4f4f5;
          --calc-heading: #ffffff;
          --calc-muted: #a1a1aa;
          --calc-muted-strong: #8b8b94;
        }
        .calc-hero { height: 138px; background-image: linear-gradient(rgba(0,0,0,.7), rgba(0,0,0,.58)), url(https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=80); background-size: cover; background-position: center; display: flex; align-items: flex-start; justify-content: center; padding-top: 18px; color: #fff; }
        .calc-hero h1 { margin: 0; font-size: 1.35rem; font-weight: 900; }
        .calc-hero p { margin: .25rem auto 0; max-width: 520px; font-size: .75rem; color: rgba(255,255,255,.82); text-align: center; }
        .calc-shell { max-width: 1120px; margin: -46px auto 0; padding: 0 18px 48px; }
        .calc-filter { background: #fff; border-radius: 14px; padding: 18px; box-shadow: 0 18px 50px rgba(15,23,42,.08); display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
        .calc-select { width: 100%; height: 38px; border: 1px solid #dfe3ea; border-radius: 8px; background: #fff; color: #111827; padding: 0 14px; font-size: .78rem; font-weight: 700; }
        .calc-workspace { margin-top: 46px; }
        .calc-category-row { display: grid; grid-template-columns: repeat(4, minmax(120px, 1fr)); gap: 16px; }
        .calc-category { height: 164px; border: 1px solid #f0f0f0; border-radius: 14px; overflow: hidden; background: #fff; cursor: pointer; position: relative; transition: border .15s, transform .15s; }
        .calc-category.active { border: 4px solid #f6b400; }
        .calc-category:hover { transform: translateY(-2px); }
        .calc-category-badge { height: 22px; background: #f8f8f8; display: flex; align-items: center; justify-content: center; font-size: .75rem; font-weight: 900; }
        .calc-category img { width: 100%; height: 134px; object-fit: cover; display: block; }
        .calc-controls { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin: 24px 0 12px; }
        .calc-arrows { display: flex; gap: 8px; }
        .calc-icon-btn { width: 42px; height: 42px; border: 2px solid #f6b400; color: #f6b400; background: #fff; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; }
        .calc-cart-btn { border: none; background: #f6b400; color: #111; border-radius: 999px; padding: 10px 16px; display: inline-flex; gap: 6px; align-items: center; font-size: .8rem; font-weight: 900; cursor: pointer; }
        .calc-title { font-size: 2rem; margin: 0 0 14px; font-weight: 900; letter-spacing: 0; }
        .calc-products { display: grid; grid-template-columns: repeat(4, minmax(170px, 1fr)); gap: 20px; }
        .calc-card { background: #f7f7f8; border-radius: 12px; padding: 18px 16px 16px; min-height: 292px; display: flex; flex-direction: column; align-items: center; text-align: center; }
        .calc-card img { width: 132px; height: 100px; object-fit: contain; border-radius: 8px; margin: 8px 0 18px; }
        .calc-card h3 { margin: 0 0 6px; font-size: .96rem; font-weight: 900; }
        .calc-card p { margin: 0; min-height: 38px; color: #59606b; font-size: .74rem; line-height: 1.4; }
        .calc-price { margin: 10px 0 14px; font-weight: 900; color: #111827; }
        .calc-add { margin-top: auto; border: none; background: #f6b400; color: #111; border-radius: 999px; padding: 9px 13px; display: inline-flex; align-items: center; gap: 5px; font-size: .75rem; font-weight: 900; cursor: pointer; }
        .calc-inline-total { color: #111; font-size: .84rem; font-weight: 900; }
        .calc-modal-backdrop { position: fixed; inset: 0; z-index: 220; background: rgba(0,0,0,.48); display: flex; align-items: center; justify-content: center; padding: 18px; }
        .calc-modal { width: min(560px, 100%); max-height: 86vh; overflow: auto; background: #fff; border-radius: 12px; box-shadow: 0 24px 80px rgba(15,23,42,.28); }
        .calc-modal-head { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 16px 18px; border-bottom: 1px solid #e8e8e8; }
        .calc-modal-title { margin: 0; font-size: 1rem; font-weight: 900; }
        .calc-close { width: 34px; height: 34px; border: 1px solid #e5e7eb; border-radius: 999px; background: #fff; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; }
        .calc-modal-body { padding: 16px 18px 18px; }
        .calc-cart-empty { color: #6b7280; text-align: center; padding: 28px 10px; font-size: .9rem; }
        .calc-cart-list { display: grid; gap: 10px; }
        .calc-cart-row { display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: center; padding: 12px; border: 1px solid #ececec; border-radius: 9px; background: #fafafa; }
        .calc-cart-name { font-weight: 900; font-size: .86rem; }
        .calc-cart-meta { color: #6b7280; font-size: .76rem; margin-top: 3px; }
        .calc-qty { display: inline-flex; align-items: center; gap: 7px; }
        .calc-qty button { width: 27px; height: 27px; border-radius: 999px; border: 1px solid #ddd; background: #fff; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; }
        .calc-cart-total { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-top: 16px; padding-top: 16px; border-top: 1px solid #e8e8e8; font-weight: 900; }
        .calc-cart-total strong { color: #f6b400; font-size: 1.35rem; }
        .calc-clear { width: 100%; margin-top: 14px; border: none; background: #111827; color: #fff; border-radius: 999px; padding: 11px; display: inline-flex; align-items: center; justify-content: center; gap: 7px; font-weight: 900; cursor: pointer; }
        .calc-empty { padding: 2rem; color: #6b7280; text-align: center; background: #f7f7f8; border-radius: 12px; }
        .dark-mode .calc-page .calc-filter,
        .dark-mode .calc-page .calc-select,
        .dark-mode .calc-page .calc-category,
        .dark-mode .calc-page .calc-icon-btn,
        .dark-mode .calc-page .calc-modal,
        .dark-mode .calc-page .calc-close,
        .dark-mode .calc-page .calc-qty button,
        .calc-page.dark .calc-filter,
        .calc-page.dark .calc-select,
        .calc-page.dark .calc-category,
        .calc-page.dark .calc-icon-btn,
        .calc-page.dark .calc-modal,
        .calc-page.dark .calc-close,
        .calc-page.dark .calc-qty button {
          background: var(--calc-surface);
          border-color: var(--calc-border);
          color: var(--calc-heading);
        }
        .dark-mode .calc-page .calc-filter,
        .calc-page.dark .calc-filter { box-shadow: 0 18px 50px rgba(0,0,0,.45); }
        .dark-mode .calc-page .calc-category-badge,
        .calc-page.dark .calc-category-badge {
          background: var(--calc-muted-surface);
          color: var(--calc-heading);
        }
        .dark-mode .calc-page .calc-category.active,
        .calc-page.dark .calc-category.active {
          border-color: var(--calc-accent);
        }
        .dark-mode .calc-page .calc-card,
        .dark-mode .calc-page .calc-empty,
        .calc-page.dark .calc-card,
        .calc-page.dark .calc-empty {
          background: var(--calc-card);
          border: 1px solid var(--calc-border-soft);
          color: var(--calc-text);
        }
        .dark-mode .calc-page .calc-card h3,
        .dark-mode .calc-page .calc-title,
        .dark-mode .calc-page .calc-price,
        .dark-mode .calc-page .calc-modal-title,
        .dark-mode .calc-page .calc-cart-name,
        .calc-page.dark .calc-card h3,
        .calc-page.dark .calc-title,
        .calc-page.dark .calc-price,
        .calc-page.dark .calc-modal-title,
        .calc-page.dark .calc-cart-name {
          color: var(--calc-heading);
        }
        .dark-mode .calc-page .calc-card p,
        .dark-mode .calc-page .calc-cart-empty,
        .dark-mode .calc-page .calc-cart-meta,
        .dark-mode .calc-page .calc-empty,
        .calc-page.dark .calc-card p,
        .calc-page.dark .calc-cart-empty,
        .calc-page.dark .calc-cart-meta,
        .calc-page.dark .calc-empty {
          color: var(--calc-muted);
        }
        .dark-mode .calc-page .calc-cart-row,
        .calc-page.dark .calc-cart-row {
          background: var(--calc-card-soft);
          border-color: var(--calc-border);
        }
        .dark-mode .calc-page .calc-modal-head,
        .dark-mode .calc-page .calc-cart-total,
        .calc-page.dark .calc-modal-head,
        .calc-page.dark .calc-cart-total {
          border-color: var(--calc-border);
        }
        .dark-mode .calc-page .calc-modal,
        .calc-page.dark .calc-modal { box-shadow: 0 24px 80px rgba(0,0,0,.65); }
        .dark-mode .calc-page .calc-clear,
        .calc-page.dark .calc-clear { background: #27272a; }
        @media (max-width: 980px) { .calc-products { grid-template-columns: repeat(3, minmax(170px, 1fr)); } }
        @media (max-width: 760px) { .calc-filter { grid-template-columns: 1fr; } .calc-category-row, .calc-products { grid-template-columns: repeat(2, 1fr); } .calc-shell { margin-top: -28px; } }
        @media (max-width: 520px) { .calc-category-row, .calc-products { grid-template-columns: 1fr; } .calc-controls { align-items: flex-start; flex-direction: column; } }
      `}</style>
      <main className={`calc-page${isDark ? ' dark' : ''}`}>
        <section className="calc-hero">
          <div>
            <h1>Cost Estimator Tool</h1>
            <p>Select construction products, update quantities and get an instant material quotation.</p>
          </div>
        </section>

        <div className="calc-shell">
          <div className="calc-filter">
            <select className="calc-select" value={options.city} onChange={(e) => setOptions({ ...options, city: e.target.value })}>
              {['Noida', 'Delhi', 'Gurgaon', 'Ghaziabad', 'Mumbai'].map((item) => <option key={item}>{item}</option>)}
            </select>
            <select className="calc-select" value={options.slabArea} onChange={(e) => setOptions({ ...options, slabArea: e.target.value })}>
              <option value="750">Slab area: 750 sqft</option>
              <option value="1000">Slab area: 1000 sqft</option>
              <option value="1500">Slab area: 1500 sqft</option>
              <option value="2000">Slab area: 2000 sqft</option>
            </select>
            <select className="calc-select" value={options.floors} onChange={(e) => setOptions({ ...options, floors: e.target.value })}>
              <option value="1">No of Floors: 1</option>
              <option value="2">No of Floors: 2</option>
              <option value="3">No of Floors: 3</option>
              <option value="4">No of Floors: 4</option>
            </select>
            <select className="calc-select" value={options.foundation} onChange={(e) => setOptions({ ...options, foundation: e.target.value })}>
              <option value="">Foundation type</option>
              {foundationTypes.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="calc-empty" style={{ marginTop: 48 }}>Loading calculator...</div>
          ) : (
            <div className="calc-workspace">
              <section>
                <div className="calc-category-row">
                  {categories.map((category) => (
                    <button key={category.name} className={`calc-category${activeCategory === category.name ? ' active' : ''}`} onClick={() => setActiveCategory(category.name)}>
                      <div className="calc-category-badge">{category.name}</div>
                      <img src={category.image} alt={category.name} />
                    </button>
                  ))}
                </div>

                <div className="calc-controls">
                  <div>
                    <div className="calc-arrows">
                      <button className="calc-icon-btn" onClick={() => categoryShift(-1)} aria-label="Previous category"><ChevronLeft size={28} /></button>
                      <button className="calc-icon-btn" onClick={() => categoryShift(1)} aria-label="Next category"><ChevronRight size={28} /></button>
                    </div>
                    <h2 className="calc-title">{activeCategory || 'Products'}</h2>
                  </div>
                  <button className="calc-cart-btn" onClick={() => setCartOpen(true)}>
                    <ShoppingCart size={15} /> Check My Cart <span className="calc-inline-total">{formatCurrency(estimate)}</span>
                  </button>
                </div>

                <div className="calc-products">
                  {visibleProducts.map((product) => (
                    <article className="calc-card" key={product.id}>
                      <img src={product.image_url || categoryIcons[product.category] || categoryIcons.Cement} alt={product.name} />
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                      <div className="calc-price">{formatCurrency(Number(product.price))} / {product.unit}</div>
                      <button className="calc-add" onClick={() => addToCart(product)}><ShoppingCart size={14} /> Add To My Cart</button>
                    </article>
                  ))}
                </div>
              </section>

            </div>
          )}
        </div>

        {cartOpen && (
          <div className="calc-modal-backdrop" onClick={() => setCartOpen(false)}>
            <div className="calc-modal" onClick={(e) => e.stopPropagation()}>
              <div className="calc-modal-head">
                <h3 className="calc-modal-title">My Quotation Cart</h3>
                <button className="calc-close" onClick={() => setCartOpen(false)} aria-label="Close cart">
                  <X size={17} />
                </button>
              </div>
              <div className="calc-modal-body">
                {selectedItems.length === 0 ? (
                  <div className="calc-cart-empty">No products selected yet.</div>
                ) : (
                  <>
                    <div className="calc-cart-list">
                      {selectedItems.map((item) => (
                        <div className="calc-cart-row" key={item.id}>
                          <div>
                            <div className="calc-cart-name">{item.name}</div>
                            <div className="calc-cart-meta">{formatCurrency(Number(item.price))} / {item.unit} · {formatCurrency(Number(item.price) * item.quantity)}</div>
                          </div>
                          <div className="calc-qty">
                            <button onClick={() => changeQty(item.id, -1)} aria-label="Decrease quantity"><Minus size={13} /></button>
                            <strong>{item.quantity}</strong>
                            <button onClick={() => changeQty(item.id, 1)} aria-label="Increase quantity"><Plus size={13} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="calc-cart-total">
                      <span>Total quotation</span>
                      <strong>{formatCurrency(estimate)}</strong>
                    </div>
                    <button className="calc-clear" onClick={() => setCart({})}>
                      <Trash2 size={15} /> Clear Cart
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
