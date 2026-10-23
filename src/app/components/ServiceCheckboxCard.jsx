'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Wrench } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { isQuickServiceIconImage } from './QuickServiceIcon';

export const SERVICE_COLOR_TINTS = {
  blue:   { light: '#eff6ff', dark: '#172554', text: '#2563eb' },
  amber:  { light: '#fffbeb', dark: '#451a03', text: '#d97706' },
  coral:  { light: '#fff1f2', dark: '#4c0519', text: '#e11d48' },
  teal:   { light: '#f0fdfa', dark: '#042f2e', text: '#0d9488' },
  purple: { light: '#faf5ff', dark: '#3b0764', text: '#9333ea' },
  green:  { light: '#f0fdf4', dark: '#052e16', text: '#16a34a' },
  gray:   { light: '#f8fafc', dark: '#18181b', text: '#64748b' },
  pink:   { light: '#fdf2f8', dark: '#500724', text: '#db2777' },
};

/**
 * ServiceCheckboxCard
 * Fixed 150px height card:
 * - Upper area (inset 0 0 36px 0) displays image/icon in "cover", "contain", or "icon" mode.
 * - Bottom 36px solid name bar with 2-line clamp.
 * - Top-left 18px checkbox with surface-color background.
 * - Clickable, keyboard accessible (Space / Enter).
 */
export default function ServiceCheckboxCard({
  service,
  selected,
  checked,
  onToggle,
  onChange,
  isDarkMode = false,
  className = '',
  style = {},
}) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isChecked = selected !== undefined ? Boolean(selected) : Boolean(checked);

  const serviceId = Number(service?.id);
  const serviceName = service?.label || service?.name || service?.title || `Service #${serviceId}`;
  const iconValue = service?.icon || service?.icon_url || service?.iconUrl || '';

  // Determine imageFit: "cover" | "contain" | "icon"
  const rawFit = service?.image_fit || service?.imageFit || '';
  const imageFit = rawFit ? rawFit.toLowerCase() : (
    serviceName.toLowerCase().includes('painter') ? 'cover' :
    serviceName.toLowerCase().includes('dismantling') ? 'contain' : 'icon'
  );

  // Determine color tint
  const rawColor = (service?.color || 'blue').toLowerCase();
  const colorTint = SERVICE_COLOR_TINTS[rawColor] || SERVICE_COLOR_TINTS.blue;

  const isUrl = isQuickServiceIconImage(iconValue);
  const LucideComponent = !isUrl && iconValue && LucideIcons[iconValue] ? LucideIcons[iconValue] : null;

  const handleToggle = () => {
    const nextVal = !isChecked;
    if (onToggle) onToggle(serviceId, nextVal);
    else if (onChange) onChange(serviceId, nextVal);
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
    }
  };

  // Border & Surface Colors
  const surfaceBg = isDarkMode ? '#18181c' : '#ffffff';
  const cardBorder = isChecked
    ? '#2563eb'
    : isHovered
      ? isDarkMode ? '#475569' : '#94a3b8'
      : isDarkMode ? '#27272a' : '#e2e8f0';

  // Bottom Name Bar Styling
  const nameBarBg = isChecked
    ? isDarkMode ? '#1e293b' : '#eff6ff'
    : surfaceBg;

  const nameBarText = isChecked
    ? isDarkMode ? '#60a5fa' : '#2563eb'
    : isDarkMode ? '#f1f5f9' : '#0f172a';

  // Image Area Background
  let imageAreaBg = surfaceBg;
  if (imageFit === 'contain') {
    imageAreaBg = isDarkMode ? '#232328' : '#ffffff';
  } else if (imageFit === 'icon') {
    imageAreaBg = isDarkMode ? colorTint.dark : colorTint.light;
  }

  return (
    <div
      role="checkbox"
      aria-checked={isChecked}
      tabIndex={0}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={serviceName}
      className={`service-checkbox-card ${isChecked ? 'selected' : ''} ${className}`}
      style={{
        position: 'relative',
        height: '150px',
        minHeight: '150px',
        maxHeight: '150px',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        boxSizing: 'border-box',
        background: surfaceBg,
        border: `${isChecked ? '2px' : '0.5px'} solid ${cardBorder}`,
        boxShadow: isChecked ? '0 2px 8px rgba(37, 99, 235, 0.2)' : 'none',
        transition: 'border 150ms ease, box-shadow 150ms ease',
        userSelect: 'none',
        outline: 'none',
        ...style,
      }}
    >
      {/* 18px Checkbox with surface-color pill/bg so it is visible over photos */}
      <div
        style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: surfaceBg,
          borderRadius: '4px',
          padding: '2px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}
      >
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => {}}
          onClick={(e) => e.stopPropagation()}
          tabIndex={-1}
          style={{
            width: '18px',
            height: '18px',
            cursor: 'pointer',
            accentColor: '#2563eb',
            margin: 0,
            display: 'block',
          }}
        />
      </div>

      {/* Image Area: Inset 0 0 36px 0 */}
      <div
        className="service-image-area"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: imageAreaBg,
          padding: imageFit === 'contain' ? '12px' : 0,
        }}
      >
        {isUrl && !imageError ? (
          imageFit === 'cover' ? (
            /* Cover mode: fills entire upper portion */
            <Image
              src={iconValue}
              alt={serviceName}
              fill
              sizes="(max-width: 640px) 50vw, 170px"
              quality={85}
              loading="lazy"
              unoptimized
              onError={() => setImageError(true)}
              style={{
                objectFit: 'cover',
                display: 'block',
              }}
            />
          ) : imageFit === 'contain' ? (
            /* Contain mode: logo centered without cropping */
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <Image
                src={iconValue}
                alt={serviceName}
                fill
                sizes="(max-width: 640px) 50vw, 170px"
                quality={85}
                loading="lazy"
                unoptimized
                onError={() => setImageError(true)}
                style={{
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>
          ) : (
            /* Icon mode: 64px crisp contain in colored tint */
            <div
              style={{
                width: '64px',
                height: '64px',
                minWidth: '64px',
                minHeight: '64px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                src={iconValue}
                alt={serviceName}
                width={64}
                height={64}
                sizes="64px"
                quality={85}
                loading="lazy"
                unoptimized
                onError={() => setImageError(true)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>
          )
        ) : LucideComponent ? (
          <LucideComponent size={44} color={colorTint.text} />
        ) : iconValue && !isUrl ? (
          <span style={{ fontSize: '44px', lineHeight: 1 }}>{iconValue}</span>
        ) : (
          <Wrench size={48} color={isDarkMode ? '#94a3b8' : '#64748b'} />
        )}
      </div>

      {/* Name Bar: 36px Solid Bottom Bar */}
      <div
        className="service-name-bar"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '36px',
          background: nameBarBg,
          borderTop: `0.5px solid ${isChecked ? '#3b82f6' : isDarkMode ? '#27272a' : '#e2e8f0'}`,
          padding: '0 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          transition: 'background 150ms ease',
        }}
      >
        <span
          style={{
            fontSize: '13px',
            fontWeight: 500,
            lineHeight: 1.2,
            textAlign: 'center',
            color: nameBarText,
            width: '100%',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            wordBreak: 'break-word',
          }}
        >
          {serviceName}
        </span>
      </div>
    </div>
  );
}
