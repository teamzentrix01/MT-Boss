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

  if (!categories.length || !parents.length) return null;

  const leafIsActive = (child) => {
    if (child.categoryId == null || String(child.categoryId) !== String(activeCategory)) return false;
    if (!child.search) return !normalizeName(activeSearch);
    return normalizeName(activeSearch) === normalizeName(child.search)
      || normalizeName(activeSearch).includes(normalizeName(child.search))
      || normalizeName(child.search).includes(normalizeName(activeSearch));
  };

  const handleLeafSelect = (child) => {
    if (child.disabled || child.categoryId == null) return;
    onSelectCategory?.(child.categoryId, child.search ? { search: child.search } : undefined);
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
                className="store-category-dropdown"
                data-parent-panel={parent.id}
                role="menu"
                hidden={!isOpen}
              >
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
            </div>
          );
        })}
        {directButtons.map((item) => {
          const isActive = item.categoryId != null
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
                if (item.disabled || item.categoryId == null) return;
                closeMenu();
                onSelectCategory?.(item.categoryId);
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
