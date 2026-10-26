'use client';

import { useMemo } from 'react';

export default function PropertyFilterBar({
  search = '',
  onSearchChange,
  status = 'all',
  onStatusChange,
  listingType = 'all',
  onListingTypeChange,
  category = 'all',
  onCategoryChange,
  categoryFilter = null,
  statusCounts = {},
  onClear,
  isDarkMode = false,
}) {
  const isFiltered = useMemo(() => {
    return Boolean(
      (search && search.trim() !== '') ||
      status !== 'all' ||
      listingType !== 'all' ||
      (category !== 'all' && !categoryFilter)
    );
  }, [search, status, listingType, category, categoryFilter]);

  const theme = useMemo(() => {
    return {
      bg: isDarkMode ? '#18181b' : '#ffffff',
      border: isDarkMode ? '#27272a' : '#e5e7eb',
      text: isDarkMode ? '#f4f4f5' : '#111827',
      muted: isDarkMode ? '#a1a1aa' : '#6b7280',
      label: isDarkMode ? '#d4d4d8' : '#111827',
      inputBg: isDarkMode ? '#27272a' : '#ffffff',
      inputBorder: isDarkMode ? '#3f3f46' : '#e5e7eb',
      placeholder: isDarkMode ? '#71717a' : '#9ca3af',
    };
  }, [isDarkMode]);

  return (
    <div
      className="property-filter-card"
      style={{
        background: theme.bg,
        border: `1px solid ${theme.border}`,
        borderRadius: '10px',
        padding: '16px 20px',
        marginBottom: '16px',
        boxShadow: isDarkMode ? 'none' : '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
      }}
    >
      {/* Top Filter Controls Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '14px',
          alignItems: 'end',
        }}
      >
        {/* Search */}
        <div style={{ minWidth: '220px' }}>
          <label
            htmlFor="property-filter-search"
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: theme.label,
              marginBottom: '6px',
            }}
          >
            Search
          </label>
          <input
            id="property-filter-search"
            type="text"
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Name, phone, title, ID, location..."
            style={{
              width: '100%',
              height: '38px',
              padding: '0 12px',
              fontSize: '13px',
              color: theme.text,
              background: theme.inputBg,
              border: `1px solid ${theme.inputBorder}`,
              borderRadius: '7px',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s ease',
            }}
          />
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="property-filter-status"
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: theme.label,
              marginBottom: '6px',
            }}
          >
            Status
          </label>
          <select
            id="property-filter-status"
            value={status}
            onChange={(e) => onStatusChange?.(e.target.value)}
            style={{
              width: '100%',
              height: '38px',
              padding: '0 12px',
              fontSize: '13px',
              color: theme.text,
              background: theme.inputBg,
              border: `1px solid ${theme.inputBorder}`,
              borderRadius: '7px',
              outline: 'none',
              cursor: 'pointer',
              boxSizing: 'border-box',
            }}
          >
            <option value="all">All</option>
            <option value="pending">
              Pending {statusCounts?.pending ? `(${statusCounts.pending})` : ''}
            </option>
            <option value="verified">
              Verified {statusCounts?.verified ? `(${statusCounts.verified})` : ''}
            </option>
            <option value="rejected">
              Rejected {statusCounts?.rejected ? `(${statusCounts.rejected})` : ''}
            </option>
          </select>
        </div>

        {/* Listing Type / Source */}
        <div>
          <label
            htmlFor="property-filter-listing"
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: theme.label,
              marginBottom: '6px',
            }}
          >
            Listing Type
          </label>
          <select
            id="property-filter-listing"
            value={listingType}
            onChange={(e) => onListingTypeChange?.(e.target.value)}
            style={{
              width: '100%',
              height: '38px',
              padding: '0 12px',
              fontSize: '13px',
              color: theme.text,
              background: theme.inputBg,
              border: `1px solid ${theme.inputBorder}`,
              borderRadius: '7px',
              outline: 'none',
              cursor: 'pointer',
              boxSizing: 'border-box',
            }}
          >
            <option value="all">All</option>
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="property-filter-category"
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: theme.label,
              marginBottom: '6px',
            }}
          >
            Category
          </label>
          <select
            id="property-filter-category"
            value={categoryFilter || category}
            disabled={Boolean(categoryFilter)}
            onChange={(e) => onCategoryChange?.(e.target.value)}
            style={{
              width: '100%',
              height: '38px',
              padding: '0 12px',
              fontSize: '13px',
              color: theme.text,
              background: theme.inputBg,
              border: `1px solid ${theme.inputBorder}`,
              borderRadius: '7px',
              outline: 'none',
              cursor: categoryFilter ? 'not-allowed' : 'pointer',
              opacity: categoryFilter ? 0.75 : 1,
              boxSizing: 'border-box',
            }}
          >
            <option value="all">All</option>
            <option value="room_rent">Room Rent</option>
            <option value="flat">Flats</option>
            <option value="plot">Plots</option>
            <option value="general">General</option>
          </select>
        </div>
      </div>

      {/* Bottom Row: Clear Filters */}
      {isFiltered && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '14px',
          }}
        >
          <button
            type="button"
            onClick={onClear}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              fontSize: '13px',
              fontWeight: 500,
              color: theme.muted,
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
