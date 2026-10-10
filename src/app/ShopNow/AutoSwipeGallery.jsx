'use client';

import React, { useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

/**
 * AutoSwipeGallery:
 * - If 0 images: returns null.
 * - If 1 image: returns static <img> (no swiper, no autoplay overhead).
 * - If 2+ images: mounts Embla Carousel with Autoplay, smoothly sliding every `delay` ms.
 */
export default function AutoSwipeGallery({
  images = [],
  alt = '',
  className = '',
  style = {},
  imageStyle = {},
  delay = 3000,
  showDots = true,
}) {
  const cleanImages = useMemo(() => {
    if (!Array.isArray(images)) return [];
    return Array.from(
      new Set(
        images.filter((img) => typeof img === 'string' && img.trim().length > 0)
      )
    ).map((s) => s.trim());
  }, [images]);

  const hasMultiple = cleanImages.length > 1;

  const autoplay = useMemo(() => {
    if (!hasMultiple) return null;
    return Autoplay({
      delay,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    });
  }, [hasMultiple, delay]);

  const plugins = useMemo(() => (autoplay ? [autoplay] : []), [autoplay]);

  const [emblaRef] = useEmblaCarousel(
    {
      loop: hasMultiple,
      duration: 25,
      watchDrag: hasMultiple,
    },
    plugins
  );

  if (cleanImages.length === 0) return null;

  // Single Image Mode: DO NOT mount swiper or auto-swipe (Requirement)
  if (!hasMultiple) {
    return (
      <div
        className={`auto-swipe-single ${className}`}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          ...style,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cleanImages[0]}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            ...imageStyle,
          }}
          loading="lazy"
        />
      </div>
    );
  }

  // Multiple Images Mode: Embla Carousel with Auto-Swipe
  return (
    <div
      className={`auto-swipe-container ${className}`}
      ref={emblaRef}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        ...style,
      }}
    >
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        {cleanImages.map((src, i) => (
          <div
            key={`${src}-${i}`}
            style={{
              flex: '0 0 100%',
              minWidth: 0,
              height: '100%',
              position: 'relative',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${alt} ${i + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                ...imageStyle,
              }}
              loading="lazy"
            />
          </div>
        ))}
      </div>
      {showDots && (
        <div
          style={{
            position: 'absolute',
            bottom: 4,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 3,
            zIndex: 3,
            pointerEvents: 'none',
          }}
        >
          {cleanImages.map((_, i) => (
            <span
              key={i}
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.9)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.6)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
