export const defaultShopStorefront = {
  hero_kicker: 'MT BOSS MATERIAL MARKETPLACE',
  hero_title: 'Everything you need to',
  hero_highlight: 'build better.',
  hero_description: 'Explore construction essentials from verified suppliers. Add to cart, buy now, or request a quote in a few taps.',
  hero_image: '/images/banners/materials.jpg',
  hero_badge: 'Built for every project',
  hero_button: 'Explore materials',
  search_placeholder: 'Search "cement", "steel" and more',
  categories_heading: 'Shop by category',
  featured_heading: 'Materials for your next project',
  deals_heading: 'Deals on materials',
  arrivals_heading: 'New arrivals',
  catalog_heading: 'Browse all materials',
  footer_tagline: 'Construction materials, made easier to source.',
  // Mobile Quick-Commerce Header & Badges
  delivery_tagline: '60 Mins delivery',
  trust_badge_1: 'Free Delivery',
  trust_badge_2: '2% Cashback',
  trust_badge_3: 'Pay on Delivery',
  trust_badge_4: '60 Mins Express',
  // Mobile Promo Banner (Bulk Offer)
  mobile_banner_pill: '⚡ Delivered in 60 mins',
  mobile_banner_subpill: 'Direct Factory Rates',
  mobile_banner_title: 'Save up to 25% on Bulk Construction Materials',
  mobile_banner_desc: 'Verified suppliers for Cement, TMT Bars, Brick & Sand with immediate site dispatch.',
  mobile_banner_btn: 'Request Bulk Quote',
  mobile_banner_enabled: true,
  promos: [
    { title: 'Material for every job', subtitle: 'From structure to finishing' },
    { title: 'Verified suppliers', subtitle: 'Shop with more confidence' },
    { title: 'Site delivery', subtitle: 'Confirm availability by city' },
  ],
};

const textFields = [
  'hero_kicker', 'hero_title', 'hero_highlight', 'hero_description',
  'hero_image', 'hero_badge', 'hero_button', 'search_placeholder', 'categories_heading',
  'featured_heading', 'deals_heading', 'arrivals_heading', 'catalog_heading', 'footer_tagline',
  'delivery_tagline', 'trust_badge_1', 'trust_badge_2', 'trust_badge_3', 'trust_badge_4',
  'mobile_banner_pill', 'mobile_banner_subpill', 'mobile_banner_title', 'mobile_banner_desc',
  'mobile_banner_btn',
];

export function normalizeShopStorefront(value = {}) {
  const result = { ...defaultShopStorefront };
  for (const field of textFields) {
    const text = String(value?.[field] ?? '').trim();
    if (text) result[field] = text.slice(0, field === 'hero_image' ? 1000 : 500);
  }
  if (value?.mobile_banner_enabled !== undefined) {
    result.mobile_banner_enabled = Boolean(value.mobile_banner_enabled);
  }
  result.promos = defaultShopStorefront.promos.map((fallback, index) => ({
    title: String(value?.promos?.[index]?.title || fallback.title).trim().slice(0, 100),
    subtitle: String(value?.promos?.[index]?.subtitle || fallback.subtitle).trim().slice(0, 160),
  }));
  return result;
}

