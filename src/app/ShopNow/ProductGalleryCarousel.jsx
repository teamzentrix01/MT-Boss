'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, Package, Image as ImageIcon } from 'lucide-react';

export function getProductImages(product, category) {
  if (!product) return [];
  const list = [];
  if (product.image_url) list.push(product.image_url.trim());
  if (Array.isArray(product.images)) {
    for (const img of product.images) {
      if (img && typeof img === 'string') {
        list.push(img.trim());
      }
    }
  }
  const unique = Array.from(new Set(list.filter(Boolean)));
  if (unique.length === 0 && (category?.image || product.category?.image)) {
    unique.push(category?.image || product.category?.image);
  }
  return unique;
}

export default function ProductGalleryCarousel({ product, category }) {
  const images = useMemo(() => getProductImages(product, category), [product, category]);
  const hasMultiple = images.length > 1;
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Setup Autoplay plugin only when there are 2 or more images
  const autoplay = useMemo(() => {
    if (!hasMultiple) return null;
    return Autoplay({
      delay: 3500,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    });
  }, [hasMultiple]);

  const plugins = useMemo(() => (autoplay ? [autoplay] : []), [autoplay]);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: hasMultiple,
      duration: 25,
      watchDrag: hasMultiple,
    },
    plugins
  );

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

  const scrollTo = useCallback(
    (index) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  // Fallback when product has zero images
  if (images.length === 0) {
    return (
      <div className="product-carousel-root">
        <div className="product-carousel-single-box">
          <Package size={56} className="text-gray-400" strokeWidth={1.5} />
          <span className="text-xs text-gray-500 mt-2 font-medium">No image available</span>
        </div>
      </div>
    );
  }

  // Single Image Mode: DO NOT mount swiper or auto-swipe (Requirement)
  if (!hasMultiple) {
    return (
      <div className="product-carousel-root">
        <div className="product-carousel-viewport product-carousel-single">
          <div className="product-carousel-slide product-carousel-slide-active">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[0]}
              alt={product?.name || 'Product Image'}
              className="product-carousel-img"
              loading="eager"
            />
          </div>
        </div>
      </div>
    );
  }

  // Multiple Images: Active Embla Carousel with Auto-Swipe
  return (
    <div className="product-carousel-root">
      {/* Main Carousel Viewport */}
      <div className="product-carousel-container" onMouseEnter={() => autoplay?.stop?.()} onMouseLeave={() => autoplay?.play?.()}>
        <div className="product-carousel-viewport" ref={emblaRef}>
          <div className="product-carousel-track">
            {images.map((src, idx) => (
              <div
                className={`product-carousel-slide ${idx === selectedIndex ? 'product-carousel-slide-active' : ''}`}
                key={`${src}-${idx}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${product?.name || 'Product'} - View ${idx + 1}`}
                  className="product-carousel-img"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Prev & Next Navigation Arrows */}
        <button
          type="button"
          className="product-carousel-nav-btn product-carousel-prev"
          onClick={scrollPrev}
          aria-label="Previous product image"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          className="product-carousel-nav-btn product-carousel-next"
          onClick={scrollNext}
          aria-label="Next product image"
        >
          <ChevronRight size={18} />
        </button>

        {/* Slide Counter Badge */}
        <div className="product-carousel-badge">
          <span>{selectedIndex + 1} / {images.length}</span>
        </div>

        {/* Autoplay Pulse Indicator */}
        <div className="product-carousel-live-indicator" title="Auto-swipe enabled">
          <span className="product-carousel-live-dot" />
        </div>
      </div>

      {/* Bottom Thumbnail Strip */}
      <div className="product-carousel-thumbs" role="tablist" aria-label="Product image thumbnails">
        {images.map((src, idx) => (
          <button
            key={`thumb-${src}-${idx}`}
            type="button"
            role="tab"
            aria-selected={idx === selectedIndex}
            className={`product-carousel-thumb-btn ${idx === selectedIndex ? 'is-active' : ''}`}
            onClick={() => scrollTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              className="product-carousel-thumb-img"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
