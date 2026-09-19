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
];

export function normalizeShopStorefront(value = {}) {
  const result = { ...defaultShopStorefront };
  for (const field of textFields) {
    const text = String(value?.[field] ?? '').trim();
    if (text) result[field] = text.slice(0, field === 'hero_image' ? 1000 : 300);
  }
  result.promos = defaultShopStorefront.promos.map((fallback, index) => ({
    title: String(value?.promos?.[index]?.title || fallback.title).trim().slice(0, 100),
    subtitle: String(value?.promos?.[index]?.subtitle || fallback.subtitle).trim().slice(0, 160),
  }));
  return result;
}
