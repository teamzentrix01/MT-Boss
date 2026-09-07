export const BANNER_LIMITS = { service_name: 32, label: 60, title: 80, subtitle: 80, description: 220, image_alt: 160, cta_text: 32, cta_href: 300, secondary_cta_text: 32, secondary_cta_href: 300 };

export function isInternalBannerLink(value) {
  return typeof value === 'string' && /^\/(?!\/)/.test(value) && !/[\\\s\u0000-\u001f]/.test(value) && !/%(?:2f|5c|0[0-9a-f]|1[0-9a-f])/i.test(value);
}

export function isCloudinaryBannerImage(value, cloudName) {
  try {
    const url = new URL(value);
    const parts = url.pathname.split('/');
    return url.protocol === 'https:' && url.hostname === 'res.cloudinary.com' && !url.username && !url.password && !url.port && parts[2] === 'image' && parts[3] === 'upload' && Boolean(parts[4]) && (!cloudName || parts[1] === cloudName);
  } catch { return false; }
}

export function validateBanner(payload, cloudName) {
  const data = {};
  for (const [key, limit] of Object.entries(BANNER_LIMITS)) {
    data[key] = String(payload[key] ?? '').trim();
    if (data[key].length > limit) return { error: `${key.replaceAll('_', ' ')} must be ${limit} characters or fewer.` };
  }
  if (!data.title) return { error: 'A banner title is required.' };
  data.image_url = String(payload.image_url ?? '').trim();
  if (!isCloudinaryBannerImage(data.image_url, cloudName)) return { error: 'Upload an image to Cloudinary or paste an image URL from your Cloudinary account.' };
  for (const prefix of ['cta', 'secondary_cta']) {
    if (Boolean(data[`${prefix}_text`]) !== Boolean(data[`${prefix}_href`])) return { error: 'Each button needs both its text and destination.' };
    if (data[`${prefix}_href`] && !isInternalBannerLink(data[`${prefix}_href`])) return { error: 'Button destinations must be site paths, such as /quick or /buy-sale.' };
  }
  data.cloudinary_public_id = String(payload.cloudinary_public_id ?? '').trim();
  if (data.cloudinary_public_id.length > 255) return { error: 'Image public ID is too long.' };
  data.image_position = payload.image_position || 'center';
  if (!['left', 'center', 'right'].includes(data.image_position)) return { error: 'Choose a valid image focal point.' };
  data.sort_order = Number(payload.sort_order ?? 0);
  if (!Number.isInteger(data.sort_order) || data.sort_order < 0 || data.sort_order > 2147483647) return { error: 'Sort order must be a non-negative integer.' };
  if (payload.is_active !== undefined && typeof payload.is_active !== 'boolean') return { error: 'Invalid banner status.' };
  data.is_active = payload.is_active ?? true;
  return { data };
}

export function bannerImageUrl(url, width = 1920) {
  if (!isCloudinaryBannerImage(url)) return url;
  // The original is kept in the database; delivery is optimized for each screen.
  return url.replace('/image/upload/', `/image/upload/f_auto,q_auto,c_limit,w_${width}/`);
}
