export const QUALITY_TIERS = [
  { value: 'basic', label: 'Basic' },
  { value: 'standard', label: 'Standard' },
  { value: 'premium', label: 'Premium' },
  { value: 'luxury', label: 'Luxury' },
];

// 'all' means the product is offered in every Quality Package.
export const QUALITY_TIER_OPTIONS = [{ value: 'all', label: 'All' }, ...QUALITY_TIERS];

export function normalizeQualityTier(value) {
  const tier = String(value || '').trim().toLowerCase();
  return QUALITY_TIER_OPTIONS.some((item) => item.value === tier) ? tier : '';
}

export function qualityTierLabel(value) {
  return QUALITY_TIER_OPTIONS.find((item) => item.value === value)?.label || '';
}

export const QUALITY_TIER_COLUMN_SQL = 'ALTER TABLE supplier_materials ADD COLUMN IF NOT EXISTS quality_tier VARCHAR(20)';
