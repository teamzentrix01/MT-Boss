import React, { forwardRef } from "react";

const STATUS_TONES = {
  success: "admin-status-success",
  completed: "admin-status-success",
  paid: "admin-status-success",
  active: "admin-status-success",
  warning: "admin-status-warning",
  open: "admin-status-warning",
  attention: "admin-status-warning",
  info: "admin-status-info",
  pending: "admin-status-info",
  new: "admin-status-info",
  accent: "admin-status-accent",
  vendor: "admin-status-accent",
  danger: "admin-status-danger",
  rejected: "admin-status-danger",
  failed: "admin-status-danger",
  error: "admin-status-danger",
};

export function AdminButton({ variant = "primary", className = "", children, type = "button", ...props }) {
  const variantClass = {
    primary: "admin-primary-button",
    secondary: "admin-secondary-button",
    danger: "admin-danger-button",
  }[variant] || "admin-primary-button";

  return (
    <button type={type} className={`${variantClass} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}

export const AdminInput = forwardRef(function AdminInput(
  { as: Element = "input", label, error, helper, className = "", id, bare = false, ...props },
  ref,
) {
  const inputId = id || props.name;
  if (bare) return <Element ref={ref} id={inputId} className={className} aria-invalid={error ? "true" : undefined} {...props} />;
  return (
    <label className="admin-field" htmlFor={inputId}>
      {label && <span className="admin-field__label">{label}</span>}
      <Element
        ref={ref}
        id={inputId}
        className={`${error ? "admin-input--error" : ""} ${className}`.trim()}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-help` : undefined}
        {...props}
      />
      {error ? <span id={`${inputId}-error`} className="admin-field__error">{error}</span> : helper ? <span id={`${inputId}-help`} className="admin-field__helper">{helper}</span> : null}
    </label>
  );
});

export function AdminStatusBadge({ status, tone, children, className = "" }) {
  const normalized = String(tone || status || "info").toLowerCase();
  const toneClass = STATUS_TONES[normalized] || "admin-status-info";
  return (
    <span className={`admin-status-badge ${toneClass} ${className}`.trim()}>
      {children || status}
    </span>
  );
}

export function AdminStatCard({ label, value, icon: Icon, tone = "info", helper }) {
  return (
    <section className={`admin-stat-card admin-stat-card--${tone}`} aria-label={label}>
      {Icon && <span className="admin-stat-card__icon"><Icon size={22} strokeWidth={1.7} aria-hidden="true" /></span>}
      <div className="admin-stat-card__content">
        <p className="admin-stat-card__label">{label}</p>
        <p className="admin-stat-card__value">{value}</p>
        {helper && <p className="admin-stat-card__helper">{helper}</p>}
      </div>
    </section>
  );
}

export function AdminSectionCard({ title, tag, action, children, className = "", bodyClassName = "" }) {
  return (
    <section className={`admin-section-card ${className}`.trim()}>
      {(title || tag || action) && (
        <header className="admin-section-card__header">
          <div className="admin-section-card__heading">
            {title && <h2 className="admin-section-card__title">{title}</h2>}
            {tag && <AdminStatusBadge tone="info">{tag}</AdminStatusBadge>}
          </div>
          {action && <div className="admin-section-card__action">{action}</div>}
        </header>
      )}
      <div className={`admin-section-card__body ${bodyClassName}`.trim()}>{children}</div>
    </section>
  );
}

const INR_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

export function formatAdminMoney(value) {
  const amount = Number(value);
  return INR_FORMATTER.format(Number.isFinite(amount) ? amount : 0);
}

export function AdminMoney({ value, className = "" }) {
  return <span className={`admin-money ${className}`.trim()}>{formatAdminMoney(value)}</span>;
}