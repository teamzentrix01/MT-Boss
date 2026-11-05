'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, Package } from 'lucide-react';

export function normalizeShopImageUrl(value) {
  const imageUrl = String(value || '').trim();
  if (!imageUrl) return '';
  if (/^(?:https?:|data:image\/|blob:|\/)/i.test(imageUrl)) return imageUrl;
  if (/^(?:www\.)/i.test(imageUrl)) return `https://${imageUrl}`;
  return `/${imageUrl}`;
}

export function getProductImages(product) {
  if (!product) return [];
  const list = [];

  // 1. Primary image of THIS specific product
  const primary = product.image_url || product.image || product.imageUrl || product.product_image;
  if (primary && typeof primary === 'string' && primary.trim()) {
    list.push(normalizeShopImageUrl(primary.trim()));
  }

  // 2. Extra images of THIS specific product (if uploaded as multiple images)
  if (Array.isArray(product.images) && product.images.length > 0) {
    for (const img of product.images) {
      if (img && typeof img === 'string' && img.trim()) {
        const norm = normalizeShopImageUrl(img.trim());
        if (!list.includes(norm)) {
          list.push(norm);
        }
      }
    }
  }

  // IMPORTANT: Do NOT inject product.category_images or related products' images!
  // If product only has 1 image, return ONLY that 1 image.
  return Array.from(new Set(list.filter(Boolean)));
}

export default function ProductGalleryCarousel({ product }) {
  const images = useMemo(() => getProductImages(product), [product]);
  const hasMultiple = images.length > 1;
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Setup Autoplay only when there are 2 or more images
  const autoplay = useMemo(() => {
    if (!hasMultiple) return null;
    return Autoplay({
      delay: 4000,
      stopOnInteraction: true,
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
      <div className="product-carousel-root w-full flex items-center justify-center p-8 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800">
        <div className="flex flex-col items-center">
          <Package size={56} className="text-gray-400" strokeWidth={1.5} />
          <span className="text-xs text-gray-500 mt-2 font-medium">No image available</span>
        </div>
      </div>
    );
  }

  // Single Image Mode: DO NOT show thumbnails or carousel controls (Requirement)
  if (!hasMultiple) {
    return (
      <div className="product-carousel-root w-full flex items-center justify-center">
        <div className="w-full aspect-square max-h-[460px] flex items-center justify-center bg-white dark:bg-zinc-900 rounded-xl overflow-hidden p-2 sm:p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[0]}
            alt={product?.name || 'Product Image'}
            className="w-full h-full object-contain max-h-[420px]"
            loading="eager"
          />
        </div>
      </div>
    );
  }

  // Multiple Images: Embla Carousel with clean bottom Thumbnail Strip + < > arrows
  return (
    <div className="product-carousel-root w-full flex flex-col items-center">
      {/* Main Image Viewport */}
      <div className="relative w-full aspect-square max-h-[440px] flex items-center justify-center bg-white dark:bg-zinc-900 rounded-xl overflow-hidden p-2">
        <div className="overflow-hidden w-full h-full" ref={emblaRef}>
          <div className="flex h-full touch-pan-y">
            {images.map((src, idx) => (
              <div
                className="flex-[0_0_100%] min-w-0 h-full flex items-center justify-center"
                key={`${src}-${idx}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${product?.name || 'Product'} - View ${idx + 1}`}
                  className="w-full h-full object-contain max-h-[400px]"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Thumbnail Strip with < and > arrows */}
      <div className="flex items-center justify-center gap-2 mt-4 w-full">
        <button
          type="button"
          onClick={scrollPrev}
          className="w-8 h-8 rounded border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 flex items-center justify-center text-slate-700 dark:text-zinc-300 transition-colors shadow-xs"
          aria-label="Previous image"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="flex items-center gap-2.5 overflow-x-auto py-1 px-1 max-w-[340px] scrollbar-none">
          {images.map((src, idx) => (
            <button
              key={`thumb-${src}-${idx}`}
              type="button"
              onClick={() => scrollTo(idx)}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all p-1 bg-white dark:bg-zinc-900 flex-shrink-0 flex items-center justify-center ${
                idx === selectedIndex
                  ? 'border-slate-900 dark:border-white shadow-xs'
                  : 'border-slate-200 dark:border-zinc-800 opacity-60 hover:opacity-100'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={scrollNext}
          className="w-8 h-8 rounded border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 flex items-center justify-center text-slate-700 dark:text-zinc-300 transition-colors shadow-xs"
          aria-label="Next image"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
