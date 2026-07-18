const LEGACY_ADMIN_EMAILS = ['admin@mtboss.in'];

export function isAdminEmail(email) {
  const normalized = String(email || '').trim().toLowerCase();
  if (!normalized) return false;

  const configured = [
    process.env.ADMIN_EMAIL,
    process.env.NEXT_PUBLIC_ADMIN_EMAIL,
    ...(process.env.ADMIN_EMAIL_ALIASES || '').split(','),
    ...LEGACY_ADMIN_EMAILS,
  ]
    .map(value => String(value || '').trim().toLowerCase())
    .filter(Boolean);

  return new Set(configured).has(normalized);
}
