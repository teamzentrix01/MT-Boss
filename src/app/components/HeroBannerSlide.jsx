import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { bannerImageUrl, isInternalBannerLink } from '@/lib/hero-banner-fields.mjs';
import styles from './Hero.module.css';

export default function HeroBannerSlide({ banner, active = true, preview = false, headingId }) {
  const Heading = preview ? 'h3' : 'h1';
  return (
    <div className={`${styles.slide} ${!active ? styles.hidden : ''}`} aria-hidden={!active} inert={!active ? true : undefined}>
      {banner.image_url && <img className={styles.photo} src={bannerImageUrl(banner.image_url)}
        srcSet={`${bannerImageUrl(banner.image_url, 800)} 800w, ${bannerImageUrl(banner.image_url, 1280)} 1280w, ${bannerImageUrl(banner.image_url)} 1920w`}
        sizes="100vw" alt={banner.image_alt || banner.service_name || ''}
        style={{ objectPosition: banner.image_position || 'center' }} fetchPriority={active ? 'high' : 'low'} loading={active ? 'eager' : 'lazy'} decoding="async" />}
      <div className={styles.shade} />
      <div className={styles.content}>
        <div className={styles.copy} key={`${banner.id}-${active}`}>
          {banner.label && <p className={styles.eyebrow}>{banner.label}</p>}
          <Heading className={styles.heading} id={headingId}>{banner.title || (preview ? 'Your banner headline' : '')}{banner.subtitle && <span>{banner.subtitle}</span>}</Heading>
          {banner.description && <p className={styles.description}>{banner.description}</p>}
          <div className={styles.actions}>
            {['cta', 'secondary_cta'].map((prefix, index) => {
              if (!banner[`${prefix}_text`] || !isInternalBannerLink(banner[`${prefix}_href`])) return null;
              const className = `${styles.action} ${index ? styles.secondary : ''}`;
              const content = <>{banner[`${prefix}_text`]}{!index && <ArrowUpRight size={16} aria-hidden="true" />}</>;
              return preview ? <span key={prefix} className={className}>{content}</span> : <Link key={prefix} className={className} href={banner[`${prefix}_href`]} tabIndex={active ? 0 : -1}>{content}</Link>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
