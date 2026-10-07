'use client';

import React, { useState, useMemo } from 'react';
import * as Lucide from 'lucide-react';
import { ServiceIcon } from './ServiceIcon';

// Curated list of quick home services / construction / maintenance icons
export const SERVICE_ICON_CATEGORIES = {
  'Quick Services': [
    'HardHat', 'Wrench', 'Hammer', 'Droplets', 'Paintbrush', 'Palette',
    'ChefHat', 'CookingPot', 'AirVent', 'Fan', 'DoorClosed', 'Wallpaper',
    'Fence', 'LampCeiling', 'LayoutPanelLeft', 'Bug', 'Zap', 'Drill'
  ],
  'Construction': [
    'HardHat', 'Building2', 'Building', 'Hammer', 'Wrench', 'Drill',
    'Shovel', 'BrickWall', 'Ruler', 'Truck', 'Scale', 'Layers', 'Boxes'
  ],
  'Plumbing': [
    'Droplets', 'Umbrella', 'Pipette', 'ShieldCheck', 'ShieldAlert',
    'Wrench', 'Waves', 'Flame'
  ],
  'Electrical': [
    'Zap', 'Plug', 'PlugZap', 'Lightbulb', 'BatteryCharging', 'Power',
    'Cpu', 'Radio', 'Tv', 'Wifi'
  ],
  'Cooling / AC': [
    'AirVent', 'Wind', 'Fan', 'Thermometer', 'Snowflake'
  ],
  'Painting': [
    'Paintbrush', 'Palette', 'Brush', 'Sparkles', 'Wallpaper',
    'Scissors', 'Crop', 'Sliders'
  ],
  'Architecture': [
    'Compass', 'Home', 'Building', 'Building2', 'LayoutPanelLeft',
    'LayoutPanelTop', 'PanelTop', 'Maximize2'
  ],
  'Kitchen / Interior': [
    'ChefHat', 'CookingPot', 'UtensilsCrossed', 'Utensils', 'DoorClosed',
    'DoorOpen', 'LampCeiling', 'Grid', 'SquareSlash', 'Fence', 'Bed', 'Armchair'
  ],
  'Security / Other': [
    'Camera', 'Bug', 'ShieldCheck', 'Lock', 'Phone', 'FileText',
    'UserCheck', 'Settings', 'Package', 'Car'
  ],
};

// Flattened unique curated icons list
export const CURATED_ICONS = Array.from(
  new Set(Object.values(SERVICE_ICON_CATEGORIES).flat())
);

// All valid icon names from lucide-react
const ALL_LUCIDE_NAMES = Object.keys(Lucide).filter(
  (name) => /^[A-Z]/.test(name) && !name.endsWith('Icon') && !name.startsWith('Lucide') && Boolean(Lucide[name])
);

export default function IconPicker({
  iconType = 'lucide',
  iconName = '',
  iconUrl = '',
  onChange,
  onUploadImage,
  uploading = false,
  isDarkMode = false,
}) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Filtered icon list
  const filteredIcons = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (q) {
      const matched = ALL_LUCIDE_NAMES.filter((name) =>
        name.toLowerCase().includes(q)
      );
      return matched.slice(0, 72);
    }

    if (activeCategory === 'All') {
      return CURATED_ICONS;
    }

    return SERVICE_ICON_CATEGORIES[activeCategory] || CURATED_ICONS;
  }, [search, activeCategory]);

  const handleTabSwitch = (type) => {
    if (type === iconType) return;
    if (type === 'lucide') {
      onChange({
        iconType: 'lucide',
        iconName: iconName || 'Wrench',
        iconUrl: '',
      });
    } else {
      onChange({
        iconType: 'image',
        iconName: '',
        iconUrl: iconUrl || '',
      });
    }
  };

  const handleSelectLucide = (name) => {
    onChange({
      iconType: 'lucide',
      iconName: name,
      iconUrl: '',
    });
  };

  const handleImageUrlChange = (e) => {
    onChange({
      iconType: 'image',
      iconName: '',
      iconUrl: e.target.value,
    });
  };

  return (
    <div className="icon-picker-root" style={{ width: '100%', boxSizing: 'border-box' }}>
      {/* Tab toggle buttons */}
      <div
        style={{
          display: 'flex',
          gap: '0.375rem',
          marginBottom: '0.75rem',
          background: isDarkMode ? '#1e1e24' : '#e5e7eb',
          padding: '0.25rem',
          borderRadius: '8px',
          width: 'fit-content',
        }}
      >
        <button
          type="button"
          onClick={() => handleTabSwitch('lucide')}
          style={{
            padding: '0.35rem 0.85rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            background: iconType === 'lucide' ? 'var(--qs-accent, #2563eb)' : 'transparent',
            color: iconType === 'lucide' ? '#ffffff' : 'var(--qs-muted, #6b6b76)',
          }}
        >
          Lucide Icon (Fast & Crisp)
        </button>
        <button
          type="button"
          onClick={() => handleTabSwitch('image')}
          style={{
            padding: '0.35rem 0.85rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            background: iconType === 'image' ? 'var(--qs-accent, #2563eb)' : 'transparent',
            color: iconType === 'image' ? '#ffffff' : 'var(--qs-muted, #6b6b76)',
          }}
        >
          Upload Image
        </button>
      </div>

      {/* Lucide Mode */}
      {iconType === 'lucide' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', width: '100%', minWidth: 0 }}>
          {/* Quick Category Filter Pills */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.375rem',
              width: '100%',
              marginBottom: '0.15rem',
            }}
          >
            <button
              type="button"
              onClick={() => { setActiveCategory('All'); setSearch(''); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.3rem 0.65rem',
                fontSize: '0.72rem',
                fontWeight: 600,
                lineHeight: '1.2',
                borderRadius: '999px',
                border: activeCategory === 'All' && !search
                  ? '1px solid var(--qs-accent, #2563eb)'
                  : '1px solid var(--qs-border, #e2e2e7)',
                background: activeCategory === 'All' && !search
                  ? 'var(--qs-accent, #2563eb)'
                  : (isDarkMode ? '#27272a' : '#f4f4f5'),
                color: activeCategory === 'All' && !search
                  ? '#ffffff'
                  : 'var(--qs-text, inherit)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <span>⭐</span> All
            </button>
            {Object.keys(SERVICE_ICON_CATEGORIES).map((cat) => {
              const isActive = activeCategory === cat && !search;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => { setActiveCategory(cat); setSearch(''); }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.3rem 0.65rem',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    lineHeight: '1.2',
                    borderRadius: '999px',
                    border: isActive
                      ? '1px solid var(--qs-accent, #2563eb)'
                      : '1px solid var(--qs-border, #e2e2e7)',
                    background: isActive
                      ? 'var(--qs-accent, #2563eb)'
                      : (isDarkMode ? '#27272a' : '#f4f4f5'),
                    color: isActive ? '#ffffff' : 'var(--qs-text, inherit)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <input
            type="text"
            className="qs-input"
            placeholder="Search all Lucide icons (e.g. Hammer, Wrench, Droplets, Zap)…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Icon Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '0.45rem',
              maxHeight: '210px',
              overflowY: 'auto',
              padding: '0.5rem',
              border: '1px solid var(--qs-border, #e2e2e7)',
              borderRadius: '8px',
              background: 'var(--qs-input-bg, #ffffff)',
            }}
          >
            {filteredIcons.map((name) => {
              const IconComp = Lucide[name];
              if (!IconComp) return null;
              const isSelected = iconName === name;
              return (
                <button
                  key={name}
                  type="button"
                  title={name}
                  onClick={() => handleSelectLucide(name)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.5rem 0.25rem',
                    gap: '0.25rem',
                    borderRadius: '6px',
                    border: isSelected
                      ? '2px solid var(--qs-accent, #2563eb)'
                      : '1px solid var(--qs-border, #e2e2e7)',
                    background: isSelected
                      ? isDarkMode ? '#1e293b' : '#eff6ff'
                      : 'transparent',
                    color: isSelected ? 'var(--qs-accent, #2563eb)' : 'var(--qs-text, inherit)',
                    cursor: 'pointer',
                    transition: 'all 0.12s ease',
                  }}
                >
                  <IconComp size={22} />
                  <span
                    style={{
                      fontSize: '0.58rem',
                      lineHeight: 1.1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '100%',
                    }}
                  >
                    {name}
                  </span>
                </button>
              );
            })}
            {filteredIcons.length === 0 && (
              <div
                style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '1.5rem',
                  fontSize: '0.75rem',
                  color: 'var(--qs-muted, #7c7c8a)',
                }}
              >
                No icons found matching &quot;{search}&quot;
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Mode */}
      {iconType === 'image' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="qs-icon-input-row">
            <input
              className="qs-input"
              type="text"
              placeholder="Paste image URL (https://...)"
              value={iconUrl}
              onChange={handleImageUrlChange}
            />
            <label className={`qs-upload-btn${uploading ? ' disabled' : ''}`}>
              {uploading ? 'Uploading...' : 'Upload from gallery'}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                disabled={uploading}
                onChange={onUploadImage}
              />
            </label>
          </div>
        </div>
      )}

      {/* Selected icon preview box (works for both modes) */}
      {(iconName || iconUrl) && (
        <div className="qs-icon-preview" style={{ marginTop: '0.5rem' }}>
          <div className="qs-icon-preview-box">
            <ServiceIcon
              service={{
                iconType,
                iconName,
                iconUrl,
              }}
              size={28}
            />
          </div>
          <span>
            {iconType === 'lucide' ? `Selected icon: ${iconName}` : 'Selected image preview'}
          </span>
        </div>
      )}
    </div>
  );
}
