"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { defaultHeroBanners } from '@/lib/hero-banner-defaults.mjs';
import HeroBannerSlide from './HeroBannerSlide';
import styles from './Hero.module.css';

export default function Hero() {
  const [slides, setSlides] = useState(defaultHeroBanners);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/hero-banners', { cache: 'no-store', signal: controller.signal })
      .then(response => response.ok ? response.json() : null)
      .then(data => {
        if (data?.success && Array.isArray(data.data)) {
          setSlides(data.data);
          setCurrent(0);
        }
      }).catch(() => {});
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motion = () => setReducedMotion(preference.matches);
    const visibility = () => setVisible(!document.hidden);
    motion(); visibility();
    preference.addEventListener('change', motion);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      preference.removeEventListener('change', motion);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);

  const playing = !paused && !reducedMotion && visible;
  useEffect(() => {
    if (!playing || slides.length < 2) return;
    const timer = setTimeout(() => setCurrent(index => (index + 1) % slides.length), 7000);
    return () => clearTimeout(timer);
  }, [current, playing, slides.length]);

  if (!slides.length) return null;
  const index = Math.min(current, slides.length - 1);
  const goTo = next => setCurrent((next + slides.length) % slides.length);
  return (
    <section className={styles.hero} aria-label="Explore MTBOSS services" aria-roledescription="carousel">
      <div className={styles.stage} aria-live={playing ? 'off' : 'polite'}>
        {slides.map((banner, slideIndex) => <HeroBannerSlide key={banner.id} banner={banner} active={slideIndex === index} />)}
      </div>
      <div className={styles.bottom}>
        {slides.length > 1 && <div className={styles.tabs} aria-label="Choose a service banner">
          {slides.map((banner, slideIndex) => <button type="button" key={banner.id} className={styles.tab}
            data-active={index === slideIndex} aria-pressed={index === slideIndex} onClick={() => goTo(slideIndex)}>
            <span className={styles.tabNumber}>{String(slideIndex + 1).padStart(2, '0')}</span>
            {banner.service_name || banner.label || `Service ${slideIndex + 1}`}
          </button>)}
        </div>}
        <div className={styles.controls}>
          <Link href="/quick" className={styles.quickLink}>Quick Services <span aria-hidden="true">↗</span></Link>
          {slides.length > 1 && <>
          <span className={styles.count}>{String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
          {!reducedMotion && <button type="button" className={styles.control} onClick={() => setPaused(value => !value)} aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}>
            {paused ? <Play size={15} /> : <Pause size={15} />}
          </button>}
          <button type="button" className={styles.control} onClick={() => goTo(index - 1)} aria-label="Previous banner"><ChevronLeft size={19} /></button>
          <button type="button" className={styles.control} onClick={() => goTo(index + 1)} aria-label="Next banner"><ChevronRight size={19} /></button>
          </>}
        </div>
      </div>
    </section>
  );
}
