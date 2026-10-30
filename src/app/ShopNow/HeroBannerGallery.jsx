'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { defaultHeroImages } from '@/lib/shop-storefront-defaults';

export default function HeroBannerGallery({
  images = [],
  alt = 'Construction materials',
  delay = 3500,
  className = '',
}) {
  const cleanImages = useMemo(() => {
    const list = Array.isArray(images) && images.length > 0 ? images : defaultHeroImages;
    const filtered = list
      .map((img) => (typeof img === 'string' ? img.trim() : ''))
      .filter((s) => s.length > 0);
    return filtered.length > 0 ? filtered : defaultHeroImages;
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

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: hasMultiple,
      duration: 25,
      watchDrag: hasMultiple,
    },
    plugins
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(
    (e) => {
      e?.preventDefault?.();
      e?.stopPropagation?.();
      if (emblaApi) emblaApi.scrollPrev();
    },
    [emblaApi]
  );

  const scrollNext = useCallback(
    (e) => {
      e?.preventDefault?.();
      e?.stopPropagation?.();
      if (emblaApi) emblaApi.scrollNext();
    },
    [emblaApi]
  );

  const scrollTo = useCallback(
    (index, e) => {
      e?.preventDefault?.();
      e?.stopPropagation?.();
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  return (
    <div
      className={`hero-banner-gallery-root ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Embla Viewport */}
      <div
        ref={emblaRef}
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
          }}
        >
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
                loading={i === 0 ? 'eager' : 'lazy'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  position: 'absolute',
                  inset: 0,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Manual Arrow Controls (Hover on gallery) */}
      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous slide"
            className="hero-gallery-arrow hero-gallery-arrow-prev"
            style={{
              position: 'absolute',
              top: '50%',
              left: 12,
              transform: 'translateY(-50%)',
              zIndex: 10,
              background: 'rgba(15, 23, 42, 0.5)',
              backdropFilter: 'blur(4px)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              width: 34,
              height: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              opacity: 0,
              transition: 'all 0.25s ease',
            }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next slide"
            className="hero-gallery-arrow hero-gallery-arrow-next"
            style={{
              position: 'absolute',
              top: '50%',
              right: 12,
              transform: 'translateY(-50%)',
              zIndex: 10,
              background: 'rgba(15, 23, 42, 0.5)',
              backdropFilter: 'blur(4px)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              width: 34,
              height: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              opacity: 0,
              transition: 'all 0.25s ease',
            }}
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Slide Indicators / Dots on bottom-left */}
      {hasMultiple && (
        <div
          className="hero-gallery-dots"
          style={{
            position: 'absolute',
            bottom: 22,
            left: 22,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(6px)',
            padding: '5px 10px',
            borderRadius: 9999,
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          {cleanImages.map((_, i) => {
            const isActive = selectedIndex === i;
            return (
              <button
                key={i}
                type="button"
                onClick={(e) => scrollTo(i, e)}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  padding: 0,
                  margin: 0,
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  width: isActive ? 22 : 6,
                  height: 6,
                  borderRadius: 9999,
                  background: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.55)',
                  boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.5)' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
