const LEGACY_ADMIN_EMAILS = ['admin@MTBOSS.in', 'admin@mtboss.in', 'admin@mtboss.com', 'clear'];

function cleanEnv(value) {
  return String(value || '').replace(/^\uFEFF/, '').trim().toLowerCase();
}

export function isAdminEmail(email) {
  const normalized = cleanEnv(email);
  if (!normalized) return false;

  const configured = [
    process.env.ADMIN_EMAIL,
    process.env.NEXT_PUBLIC_ADMIN_EMAIL,
    ...(process.env.ADMIN_EMAIL_ALIASES || '').split(','),
    ...LEGACY_ADMIN_EMAILS,
  ]
    .map(cleanEnv)
    .filter(Boolean);

  return new Set(configured).has(normalized);
}
