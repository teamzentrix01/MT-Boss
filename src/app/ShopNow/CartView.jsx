'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Tag,
  ShieldCheck,
  Package,
  CheckCircle2,
  AlertCircle,
  Truck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { calculateCoupon } from '@/lib/coupon-calculations';
import { evaluateCartPromotions } from '@/lib/promotion-calculations';
import { getCartStep } from '@/lib/cart-step';
import { displayUnit, getProductImage, ShopImage } from './Storefront';
import './shop.css';

function useDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const html = document.documentElement;
    const update = () => setDark(html.classList.contains('dark-mode'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return dark;
}

export default function CartView() {
  const router = useRouter();
  const isDark = useDarkMode();

  const [cart, setCart] = useState([]);
  const [cartReady, setCartReady] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [manualCoupon, setManualCoupon] = useState(null);
  const [couponNotice, setCouponNotice] = useState('');
  const [offersOpen, setOffersOpen] = useState(false);
  const [cashbackPreview, setCashbackPreview] = useState(null);

  // Load cart from localStorage
  const loadCart = useCallback(() => {
    try {
      const raw = localStorage.getItem('MTBOSS-shop-cart') || '[]';
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setCart(parsed);
      }
    } catch {
      setCart([]);
    } finally {
      setCartReady(true);
    }
  }, []);

  useEffect(() => {
    loadCart();
    const handleStorage = () => loadCart();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [loadCart]);

  // Save cart changes
  const saveCart = (newCart) => {
    setCart(newCart);
    try {
      localStorage.setItem('MTBOSS-shop-cart', JSON.stringify(newCart));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  };

  // Fetch coupons and promotions from API
  useEffect(() => {
    fetch('/api/shop-coupons')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.success && Array.isArray(d.data)) {
          setCoupons(d.data);
        }
      })
      .catch(() => {});

    fetch('/api/shop-promotions')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.success && Array.isArray(d.data)) {
          setPromotions(d.data);
        }
      })
      .catch(() => {});
  }, []);

  // Update item quantity
  const handleQtyChange = (productId, delta) => {
    const updated = cart
      .map((item) => {
        const pId = item.product?.product_id || item.product?.id;
        if (String(pId) !== String(productId)) return item;
        const step = getCartStep(item.product);
        const limit = item.product?.fromSupplier
          ? Math.max(0, Number(item.product?.quantity) || 0)
          : 10000;
        const nextQty = Math.max(0, Math.min(limit || 10000, 10000, item.quantity + delta * step));
        return { ...item, quantity: nextQty };
      })
      .filter((item) => item.quantity > 0);

    saveCart(updated);
  };

  // Remove item completely
  const handleRemoveItem = (productId) => {
    const updated = cart.filter((item) => {
      const pId = item.product?.product_id || item.product?.id;
      return String(pId) !== String(productId);
    });
    saveCart(updated);
  };

  // Clear entire cart
  const handleClearCart = () => {
    saveCart([]);
  };

  // Calculate pricing
  const { pricedTotal, hasUnpricedItems, totalItemsCount } = useMemo(() => {
    let total = 0;
    let unpriced = false;
    let count = 0;

    for (const item of cart) {
      count += Number(item.quantity) || 1;
      const price = Number(item.product?.price);
      if (Number.isFinite(price) && price > 0) {
        total += price * (Number(item.quantity) || 1);
      } else {
        unpriced = true;
      }
    }
    return { pricedTotal: total, hasUnpricedItems: unpriced, totalItemsCount: count };
  }, [cart]);

  // Coupons calculation
  const autoCoupon = useMemo(() => {
    return coupons
      .filter((c) => !c.code)
      .map((c) => ({ coupon: c, calculation: calculateCoupon(cart, c) }))
      .filter(({ calculation }) => calculation.eligible)
      .sort((a, b) => b.calculation.discount - a.calculation.discount)[0]?.coupon || null;
  }, [cart, coupons]);

  const activeCoupon = manualCoupon || autoCoupon;
  const couponCalculation = useMemo(
    () => calculateCoupon(cart, activeCoupon),
    [cart, activeCoupon]
  );
  const couponOffers = useMemo(
    () => coupons.map((c) => ({ coupon: c, calculation: calculateCoupon(cart, c) })),
    [cart, coupons]
  );

  // Automatic Cart Promotions evaluation (e.g. 50k+ = 5% off / free shipping)
  const {
    bestDiscount: promoDiscount,
    discountAmount: promoDiscountAmount,
    activeFreeShipping: promoFreeShipping,
    nextPromotion,
  } = useMemo(() => evaluateCartPromotions(cart, promotions), [cart, promotions]);

  const applyCouponCode = (code) => {
    const cleaned = String(code || '').trim().toUpperCase();
    if (!cleaned) return;
    const found = coupons.find(
      (c) => c.code && c.code.toUpperCase() === cleaned
    );
    if (!found) {
      setCouponNotice('Invalid coupon code.');
      return;
    }
    const calc = calculateCoupon(cart, found);
    setManualCoupon(found);
    if (calc.eligible) {
      setCouponNotice(`Coupon ${found.code} applied! ₹${calc.discount} saved.`);
    } else {
      setCouponNotice(`Add ₹${calc.gap.toLocaleString('en-IN')} more to unlock this coupon.`);
    }
  };

  const removeCoupon = () => {
    setManualCoupon(null);
    setCouponCode('');
    setCouponNotice('');
  };

  const couponDiscountAmount = activeCoupon && couponCalculation?.eligible ? (Number(couponCalculation.discount) || 0) : 0;
  const totalDiscount = couponDiscountAmount + promoDiscountAmount;
  const finalTotal = Math.max(0, pricedTotal - totalDiscount);

  // Live Cashback preview
  useEffect(() => {
    if (!Array.isArray(cart) || cart.length === 0) {
      setCashbackPreview(null);
      return;
    }
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const items = cart.map((item) => ({
      product_id: item.product?.product_id || item.product?.id,
      category_id: item.product?.category?.id,
      category_name: item.product?.category?.name || item.product?.category,
      price: Number(item.product?.price) || 0,
      quantity: Number(item.quantity) || 1,
      total: (Number(item.product?.price) || 0) * (Number(item.quantity) || 1),
    }));

    const subtotal = pricedTotal;

    fetch('/api/cashback/preview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        items,
        order_total: Math.max(0, subtotal - totalDiscount),
      }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.success && d?.data) {
          setCashbackPreview(d.data);
        }
      })
      .catch(() => {});
  }, [cart, pricedTotal, totalDiscount]);

  // Styles
  const bg = isDark ? 'bg-zinc-950 text-white' : 'bg-[#f8fafc] text-slate-900';
  const cardBg = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200/80 shadow-xs';
  const muted = isDark ? 'text-zinc-400' : 'text-slate-500';

  if (!cartReady) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${bg}`}>
        <div className="w-10 h-10 border-4 border-[var(--brand-blue)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bg} pb-24`}>
      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md ${isDark ? 'bg-zinc-950/95 border-zinc-800' : 'bg-white/95 border-slate-200 shadow-xs'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push('/ShopNow')}
              className={`p-2 rounded-xl border transition-all ${
                isDark ? 'border-zinc-800 hover:bg-zinc-800 text-zinc-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
              title="Back to Shop Catalog"
              aria-label="Back to Shop"
            >
              <ArrowLeft size={18} />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="MT-Boss" width={100} height={28} className="h-7 w-auto object-contain" priority />
              <span className="hidden sm:inline text-[10px] font-black tracking-widest px-1.5 py-0.5 rounded bg-[var(--brand-blue)] text-slate-950 uppercase">
                CART
              </span>
            </Link>
          </div>

          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
            <ShieldCheck size={16} className="text-emerald-500" />
            <span className="hidden sm:inline">100% Verified Supplier Checkout</span>
          </div>
        </div>
      </header>

      {/* ── BREADCRUMB ────────────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className={`max-w-6xl mx-auto px-4 sm:px-6 py-3 text-xs ${muted} flex items-center gap-2 overflow-x-auto whitespace-nowrap`}>
        <Link href="/" className="hover:text-[var(--brand-blue)] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/ShopNow" className="hover:text-[var(--brand-blue)] transition-colors">Shop Materials</Link>
        <span>/</span>
        <span className="font-bold text-slate-900 dark:text-white">My Cart</span>
      </nav>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-4 pb-24 lg:pb-12">
        {cart.length === 0 ? (
          /* Empty Cart State */
          <div className={`max-w-md mx-auto text-center py-16 px-6 rounded-3xl border mt-6 ${cardBg}`}>
            <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-sky-50 dark:bg-zinc-800/80 text-[var(--brand-blue)]">
              <ShoppingCart size={40} strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-black">Your Cart is Empty</h2>
            <p className={`text-sm mt-1.5 ${muted}`}>
              Add building materials, hardware, or tools from our verified suppliers to build your order.
            </p>
            <Link
              href="/ShopNow"
              className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--brand-blue)] text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-sky-400 transition-all shadow-md"
            >
              Explore Materials →
            </Link>
          </div>
        ) : (
          /* Cart Grid: Left Items + Right Summary */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ── LEFT: CART ITEMS LIST ────────────────────────────────────────── */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight">Shopping Cart</h1>
                  <p className={`text-xs mt-0.5 ${muted}`}>
                    {cart.length} {cart.length === 1 ? 'material category' : 'material categories'} · {totalItemsCount} total items
                  </p>
                </div>
                {cart.length > 1 && (
                  <button
                    type="button"
                    onClick={handleClearCart}
                    className="text-xs text-rose-500 hover:text-rose-600 font-bold hover:underline transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Items Cards */}
              <div className="space-y-3">
                {cart.map((item, index) => {
                  const p = item.product || {};
                  const pId = p.product_id || p.id;
                  const price = Number(p.price) || 0;
                  const itemTotal = price > 0 ? price * (Number(item.quantity) || 1) : null;
                  const productImg = getProductImage(p, p.category);

                  return (
                    <div
                      key={pId ? `${pId}-${index}` : `item-${index}`}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${cardBg} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
                    >
                      {/* Product Thumbnail & Details */}
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <Link
                          href={`/ShopNow/${pId}`}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-white flex-none flex items-center justify-center relative hover:opacity-90 transition-opacity"
                        >
                          {productImg ? (
                            <ShopImage
                              src={productImg}
                              alt={p.name}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          ) : (
                            <Package size={28} className={muted} />
                          )}
                        </Link>

                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/ShopNow/${pId}`}
                            className="font-extrabold text-sm sm:text-base hover:text-[var(--brand-blue)] transition-colors truncate block"
                          >
                            {p.name}
                          </Link>
                          <p className={`text-xs mt-0.5 truncate ${muted}`}>
                            {(typeof p.category === 'object' ? p.category?.name : p.category) || 'Material'}
                            {p.unit ? ` · ${displayUnit(p.unit)}` : ''}
                          </p>

                          <div className="mt-1 flex items-center gap-2">
                            {price > 0 ? (
                              <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                                ₹{price.toLocaleString('en-IN')} / {displayUnit(p.unit)}
                              </span>
                            ) : (
                              <span className="text-[11px] font-bold text-amber-500">
                                Price on supplier confirmation
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stepper + Subtotal + Remove */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-zinc-800">
                        {/* Stepper */}
                        <div className={`inline-flex items-center rounded-xl border p-1 ${isDark ? 'border-zinc-700 bg-zinc-800' : 'border-slate-200 bg-slate-50'}`}>
                          <button
                            type="button"
                            onClick={() => handleQtyChange(pId, -1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-700 active:scale-95 transition-all text-xs"
                            aria-label={`Decrease quantity of ${p.name}`}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center font-black text-xs">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQtyChange(pId, 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-700 active:scale-95 transition-all text-xs"
                            aria-label={`Increase quantity of ${p.name}`}
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Line total */}
                        <div className="text-right min-w-[70px]">
                          {itemTotal !== null ? (
                            <strong className="text-sm sm:text-base font-black">
                              ₹{itemTotal.toLocaleString('en-IN')}
                            </strong>
                          ) : (
                            <span className={`text-[11px] ${muted}`}>TBD</span>
                          )}
                        </div>

                        {/* Trash Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(pId)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
                          title="Remove item"
                          aria-label={`Remove ${p.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add more items link */}
              <div className="pt-2">
                <Link
                  href="/ShopNow"
                  className="inline-flex items-center gap-2 text-xs font-black text-[var(--brand-blue)] hover:underline"
                >
                  + Add more building materials to this order
                </Link>
              </div>
            </div>

            {/* ── RIGHT: ORDER SUMMARY & CHECKOUT SIDEBAR ─────────────────────── */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
              <div className={`p-5 sm:p-6 rounded-3xl border ${cardBg}`}>
                <h2 className="text-base font-black uppercase tracking-wider mb-4">
                  Order Summary
                </h2>

                {/* Pricing Lines */}
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className={muted}>
                      {hasUnpricedItems ? 'Current priced materials' : 'Materials total'}
                    </span>
                    <strong className="font-bold text-sm">
                      {pricedTotal > 0
                        ? `₹${pricedTotal.toLocaleString('en-IN')}${hasUnpricedItems ? ' + quote items' : ''}`
                        : 'Price on confirmation'}
                    </strong>
                  </div>

                  {/* Promotional Extra Discount if active */}
                  {promoDiscount && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                      <span className="flex items-center gap-1">
                        <Zap size={13} className="text-amber-500 flex-none" /> {promoDiscount.promotion.name}
                      </span>
                      <span>-₹{promoDiscount.calc.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {/* Coupon Discount if active */}
                  {activeCoupon && couponCalculation?.eligible && (
                    <div className="flex justify-between text-emerald-500 font-bold">
                      <span className="flex items-center gap-1">
                        <Tag size={13} /> Coupon {activeCoupon.code ? `"${activeCoupon.code}"` : 'Applied'}
                      </span>
                      <span>-₹{couponCalculation.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {/* Free Shipping Promotion or Standard Notice */}
                  {promoFreeShipping ? (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                      <span className="flex items-center gap-1">
                        <Truck size={13} className="flex-none" /> Free Delivery Promotion
                      </span>
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full text-emerald-700 dark:text-emerald-300 font-black">
                        FREE (₹0)
                      </span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-slate-500">
                      <span>Delivery charges</span>
                      <span>Calculated at checkout</span>
                    </div>
                  )}

                  {/* Spend Threshold Prompt for next unlocked promotion */}
                  {nextPromotion && (
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/30 dark:to-indigo-950/30 border border-sky-200 dark:border-sky-800 text-xs">
                      <div className="flex items-center gap-2">
                        <Zap size={15} className="text-amber-500 flex-none" />
                        <span className="font-extrabold text-slate-900 dark:text-white">
                          {nextPromotion.promotion.badge_text || nextPromotion.promotion.name}
                        </span>
                      </div>
                      <p className={`text-[11px] mt-1 ${muted}`}>
                        Add <strong className="text-[var(--brand-blue)]">₹{nextPromotion.calc.gap.toLocaleString('en-IN')}</strong> more to unlock {nextPromotion.promotion.promo_type === 'free_shipping' ? 'FREE Delivery' : `${nextPromotion.promotion.discount_value}% Extra Discount`}!
                      </p>
                    </div>
                  )}

                  {/* Cashback earning badge */}
                  {cashbackPreview?.totalCashback > 0 && (
                    <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 flex items-center gap-2 text-xs font-bold">
                      <Sparkles size={16} className="text-amber-500 flex-none" />
                      <span>
                        You will earn <strong>₹{cashbackPreview.totalCashback.toLocaleString('en-IN')}</strong> cashback on this order!
                      </span>
                    </div>
                  )}

                  {/* Grand total */}
                  <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 flex justify-between items-baseline">
                    <div>
                      <span className="text-sm font-extrabold">Estimated Subtotal</span>
                      <p className={`text-[10px] ${muted}`}>Inclusive of taxes & supplier invoice</p>
                    </div>
                    <strong className="text-xl font-black text-[var(--brand-blue)]">
                      {pricedTotal > 0 ? `₹${finalTotal.toLocaleString('en-IN')}` : 'TBD'}
                    </strong>
                  </div>
                </div>

                {/* ── COUPON ACCORDION ────────────────────────────────────────── */}
                <div className="mt-5 pt-4 border-t border-slate-200 dark:border-zinc-800">
                  {activeCoupon?.code ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-500 flex-none" />
                        <div>
                          <p className="font-black text-emerald-700 dark:text-emerald-300">
                            {activeCoupon.code} Applied
                          </p>
                          <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                            Saved ₹{couponCalculation?.discount?.toLocaleString('en-IN') || 0}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-xs text-rose-500 hover:text-rose-600 font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        applyCouponCode(couponCode);
                      }}
                      className="space-y-2"
                    >
                      <label htmlFor="cart-coupon-input" className="text-xs font-bold block">
                        Have a discount coupon?
                      </label>
                      <div className="flex gap-2">
                        <input
                          id="cart-coupon-input"
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder="ENTER CODE"
                          className={`flex-1 px-3 py-2 rounded-xl border text-xs font-bold uppercase tracking-wider ${
                            isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                          }`}
                        />
                        <button
                          type="submit"
                          disabled={!couponCode.trim()}
                          className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-zinc-100 text-white dark:text-slate-950 text-xs font-bold uppercase tracking-wider hover:opacity-90 disabled:opacity-40 transition-all"
                        >
                          Apply
                        </button>
                      </div>

                      {couponNotice && (
                        <p className={`text-[11px] font-bold ${couponNotice.includes('saved') || couponNotice.includes('applied') ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {couponNotice}
                        </p>
                      )}

                      {/* View Available Offers toggle */}
                      {couponOffers.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setOffersOpen(!offersOpen)}
                          className="text-[11px] font-extrabold text-[var(--brand-blue)] hover:underline pt-1 block"
                        >
                          {offersOpen ? 'Hide available offers ▲' : `View available offers (${couponOffers.length}) ▼`}
                        </button>
                      )}

                      {offersOpen && (
                        <div className="space-y-2 pt-2 max-h-48 overflow-y-auto">
                          {couponOffers.map(({ coupon, calculation }) => (
                            <div
                              key={coupon.id}
                              className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                                calculation.eligible
                                  ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20'
                                  : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/40 opacity-70'
                              }`}
                            >
                              <div className="min-w-0">
                                <p className="font-extrabold text-[11px] text-[var(--brand-blue)]">
                                  {coupon.code || 'Automatic Deal'}
                                </p>
                                <p className={`text-[10px] ${muted}`}>
                                  {coupon.discount_type === 'percentage'
                                    ? `${coupon.discount_value}% OFF`
                                    : `₹${coupon.discount_value} OFF`}
                                  {coupon.min_cart_value > 0 ? ` on orders above ₹${coupon.min_cart_value}` : ''}
                                </p>
                                {!calculation.eligible && (
                                  <p className="text-[9px] text-amber-500 font-bold">
                                    Add ₹{calculation.gap.toLocaleString('en-IN')} more to unlock
                                  </p>
                                )}
                              </div>
                              {coupon.code && (
                                <button
                                  type="button"
                                  disabled={!calculation.eligible}
                                  onClick={() => {
                                    setCouponCode(coupon.code);
                                    applyCouponCode(coupon.code);
                                    setOffersOpen(false);
                                  }}
                                  className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                    calculation.eligible
                                      ? 'bg-[var(--brand-blue)] text-slate-950 hover:bg-sky-400'
                                      : 'bg-slate-200 dark:bg-zinc-700 text-slate-400 cursor-not-allowed'
                                  }`}
                                >
                                  {calculation.eligible ? 'Apply' : 'Locked'}
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </form>
                  )}
                </div>

                {/* ── CHECKOUT BUTTON ─────────────────────────────────────────── */}
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => router.push('/ShopNow/checkout?mode=cart&from=cart')}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[var(--brand-blue)] to-sky-400 hover:from-sky-400 hover:to-[var(--brand-blue)] text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-sky-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={18} />
                  </button>

                  <p className={`text-[10px] text-center mt-3 ${muted}`}>
                    Delivery address, city shipping calculator & payment on next step
                  </p>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className={`p-4 rounded-2xl border ${cardBg} flex items-center justify-around text-center text-xs`}>
                <div className="flex flex-col items-center">
                  <ShieldCheck size={20} className="text-emerald-500 mb-1" />
                  <span className="font-extrabold text-[11px]">Direct Suppliers</span>
                </div>
                <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800" />
                <div className="flex flex-col items-center">
                  <Truck size={20} className="text-[var(--brand-blue)] mb-1" />
                  <span className="font-extrabold text-[11px]">Site Logistics</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
