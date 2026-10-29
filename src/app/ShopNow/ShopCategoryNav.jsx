"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { CATEGORY_NAV_TREE, DIRECT_NAV_BUTTONS, normalizeName, resolveCategoryNav, resolveDirectNavItem } from "./categoryNavTree";

const MOBILE_MQ = "(max-width: 800px)";

export default function ShopCategoryNav({
  categories = [],
  products = [],
  activeCategory,
  activeSearch = "",
  onSelectCategory,
}) {
  const parents = useMemo(
    () => resolveCategoryNav(CATEGORY_NAV_TREE, categories, products),
    [categories, products],
  );
  const directButtons = useMemo(
    () => DIRECT_NAV_BUTTONS.map((label) => resolveDirectNavItem(label, categories, products)),
    [categories, products],
  );
  const recentArrivals = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return [];
    const seen = new Set();
    return [...products]
      .filter((p) => {
        if (!p || (!p.name && !p.id)) return false;
        const key = p.product_id ? `supplier-${p.product_id}` : p.id;
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        if (dateB !== dateA) return dateB - dateA;
        return (Number(b.product_id || b.id) || 0) - (Number(a.product_id || a.id) || 0);
      })
      .slice(0, 10);
  }, [products]);

  const [openId, setOpenId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const navRef = useRef(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const media = window.matchMedia(MOBILE_MQ);
    const sync = () => {
      setIsMobile(media.matches);
      setOpenId(null);
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const closeMenu = useCallback(() => {
    clearCloseTimer();
    setOpenId(null);
  }, [clearCloseTimer]);

  const openMenu = useCallback((id) => {
    clearCloseTimer();
    setOpenId(id);
  }, [clearCloseTimer]);

  const toggleMenu = useCallback((id) => {
    clearCloseTimer();
    setOpenId((current) => (current === id ? null : id));
  }, [clearCloseTimer]);

  useEffect(() => {
    if (!openId) return undefined;

    const onPointerDown = (event) => {
      if (!navRef.current?.contains(event.target)) closeMenu();
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        const trigger = navRef.current?.querySelector(`[data-parent-id="${openId}"]`);
        closeMenu();
        if (trigger instanceof HTMLElement) trigger.focus();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openId, closeMenu]);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  if (!parents.length) return null;

  const leafIsActive = (child) => {
    // Never mark a fallback 'all' child as active — only real category IDs count
    if (child.categoryId == null || child.categoryId === 'all') return false;
    if (String(child.categoryId) !== String(activeCategory)) return false;
    if (!child.search) return !normalizeName(activeSearch);
    return normalizeName(activeSearch) === normalizeName(child.search)
      || normalizeName(activeSearch).includes(normalizeName(child.search))
      || normalizeName(child.search).includes(normalizeName(activeSearch));
  };

  const handleLeafSelect = (child) => {
    if (child.disabled && !child.search && child.categoryId == null) return;
    onSelectCategory?.(child.categoryId ?? "all", { search: child.search || child.label });
    closeMenu();
  };

  const handleParentKeyDown = (event, parent, childCount) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleMenu(parent.id);
      return;
    }
    if (event.key === "ArrowDown" && childCount > 0) {
      event.preventDefault();
      openMenu(parent.id);
      requestAnimationFrame(() => {
        const first = navRef.current?.querySelector(`[data-parent-panel="${parent.id}"] [role="menuitem"]:not([aria-disabled="true"])`)
          || navRef.current?.querySelector(`[data-parent-panel="${parent.id}"] [role="menuitem"]`);
        if (first instanceof HTMLElement) first.focus();
      });
    }
  };

  const handleLeafKeyDown = (event, parent, index, items) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
      const trigger = navRef.current?.querySelector(`[data-parent-id="${parent.id}"]`);
      if (trigger instanceof HTMLElement) trigger.focus();
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const delta = event.key === "ArrowDown" ? 1 : -1;
      const next = (index + delta + items.length) % items.length;
      const button = navRef.current?.querySelector(`[data-parent-panel="${parent.id}"] [data-leaf-index="${next}"]`);
      if (button instanceof HTMLElement) button.focus();
    }
  };

  return (
    <nav
      ref={navRef}
      className={`store-category-nav${openId ? " is-open" : ""}`}
      aria-label="Shop categories"
    >
      <div className="store-category-nav-inner">
        <button
          type="button"
          className={`store-category-all-btn${String(activeCategory) === "all" ? " is-active" : ""}`}
          onClick={() => {
            closeMenu();
            onSelectCategory?.("all");
          }}
        >
          All
        </button>
        {parents.map((parent) => {
          const isOpen = openId === parent.id;
          const hasActiveChild = parent.children.some((child) => leafIsActive(child));
          const isNewLaunches = parent.id === "new-launches";

          return (
            <div
              key={parent.id}
              className={`store-category-parent${isOpen ? " is-open" : ""}${hasActiveChild ? " has-active" : ""}`}
              onMouseEnter={() => {
                if (!isMobile) openMenu(parent.id);
              }}
              onMouseLeave={() => {
                if (!isMobile) {
                  clearCloseTimer();
                  closeTimer.current = setTimeout(() => {
                    setOpenId((current) => (current === parent.id ? null : current));
                  }, 120);
                }
              }}
            >
              <button
                type="button"
                className="store-category-parent-btn"
                data-parent-id={parent.id}
                aria-haspopup="true"
                aria-expanded={isOpen}
                aria-controls={`store-category-panel-${parent.id}`}
                onClick={() => toggleMenu(parent.id)}
                onKeyDown={(event) => handleParentKeyDown(event, parent, parent.children.length)}
              >
                <span>{parent.label}</span>
                <ChevronDown size={14} className="store-category-chevron" aria-hidden="true" />
              </button>

              <div
                id={`store-category-panel-${parent.id}`}
                className={`store-category-dropdown${isNewLaunches ? " is-recent-only" : ""}`}
                data-parent-panel={parent.id}
                role="menu"
                hidden={!isOpen}
              >
                {isNewLaunches ? (
                  <div className="store-category-recent-section">
                    <div className="store-category-recent-header">
                      <span className="store-category-recent-title">⚡ Just Added (New Arrivals)</span>
                      <span className="store-category-recent-pill">New</span>
                    </div>
                    <div className="store-category-recent-list">
                      {recentArrivals.length > 0 ? (
                        recentArrivals.map((product) => {
                          const detailId = product.product_id || (String(product.id).startsWith("supplier-") ? product.id.replace("supplier-", "") : product.id);
                          const detailHref = `/ShopNow/${detailId}`;
                          const price = Number(product.price);
                          const productImage = product.image_url || product.image;
                          return (
                            <a
                              key={product.id}
                              href={detailHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="store-category-recent-item"
                              onClick={closeMenu}
                              title={`Open ${product.name} in new tab`}
                            >
                              <div className="store-category-recent-thumb">
                                {productImage ? (
                                  <img src={productImage} alt={product.name} />
                                ) : (
                                  <span>📦</span>
                                )}
                              </div>
                              <div className="store-category-recent-info">
                                <span className="store-category-recent-name">{product.name}</span>
                                <span className="store-category-recent-meta">
                                  {price > 0 ? (
                                    <strong className="store-category-recent-price">
                                      ₹{price.toLocaleString("en-IN")}{product.unit ? ` / ${product.unit}` : ""}
                                    </strong>
                                  ) : (
                                    <span className="store-category-recent-cat">
                                      {typeof product.category === "object" ? product.category?.name : (product.category || "View product")}
                                    </span>
                                  )}
                                  <span className="store-category-recent-arrow" aria-hidden="true">↗</span>
                                </span>
                              </div>
                            </a>
                          );
                        })
                      ) : (
                        <div className="store-category-recent-empty">
                          No newly added products found.
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    {parent.children.map((child, index) => {
                      const isActive = leafIsActive(child);
                      return (
                        <button
                          key={child.label}
                          type="button"
                          role="menuitem"
                          data-leaf-index={index}
                          className={`store-category-leaf${isActive ? " is-active" : ""}${child.disabled ? " is-disabled" : ""}`}
                          disabled={child.disabled}
                          aria-disabled={child.disabled}
                          title={child.disabled ? "Coming soon" : undefined}
                          onClick={() => handleLeafSelect(child)}
                          onKeyDown={(event) => handleLeafKeyDown(event, parent, index, parent.children)}
                        >
                          <span>{child.label}</span>
                          {child.disabled && <small>Coming soon</small>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {directButtons.map((item) => {
          // Never highlight a direct button when its categoryId is 'all' (fallback)
          const isActive = item.categoryId != null
            && item.categoryId !== 'all'
            && String(item.categoryId) === String(activeCategory)
            && !normalizeName(activeSearch);
          return (
            <button
              key={item.label}
              type="button"
              className={`store-category-all-btn${isActive ? " is-active" : ""}${item.disabled ? " is-disabled" : ""}`}
              disabled={item.disabled}
              aria-disabled={item.disabled}
              title={item.disabled ? "Coming soon" : undefined}
              onClick={() => {
                if (item.disabled) return;
                closeMenu();
                if (item.categoryId === 'all' || item.categoryId == null) {
                  onSelectCategory?.('all', { search: item.search || item.label });
                } else {
                  onSelectCategory?.(item.categoryId, item.search ? { search: item.search } : undefined);
                }
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
