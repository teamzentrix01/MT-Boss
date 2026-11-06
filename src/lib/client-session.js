/** Browser-only session helpers — one active portal role at a time. */

export const ACTIVE_ROLE_KEY = 'mtboss.activeRole';

const ALL_STORAGE_KEYS = [
  'token',
  'user',
  'admin-token',
  'admin',
  'agent-token',
  'agent',
  'vendor-token',
  'vendor',
  'service-provider-token',
  'service-provider',
  'supplier-token',
  'supplier',
  'franchise-token',
  'franchise',
];

const ROLE_KEYS = {
  admin: { tokens: ['admin-token', 'token'], profiles: ['admin', 'user'] },
  user: { tokens: ['token'], profiles: ['user'] },
  agent: { tokens: ['agent-token'], profiles: ['agent'] },
  vendor: { tokens: ['vendor-token', 'service-provider-token'], profiles: ['vendor', 'service-provider'] },
  supplier: { tokens: ['supplier-token'], profiles: ['supplier'] },
  franchise: { tokens: ['franchise-token'], profiles: ['franchise'] },
};

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** Remove every auth key except the active role's token/profile. */
export function clearWebSessionExcept(activeRole) {
  if (typeof window === 'undefined') return;

  const keep = new Set();
  if (activeRole && ROLE_KEYS[activeRole]) {
    for (const key of ROLE_KEYS[activeRole].tokens) keep.add(key);
    for (const key of ROLE_KEYS[activeRole].profiles) keep.add(key);
  }

  for (const key of ALL_STORAGE_KEYS) {
    if (!keep.has(key)) localStorage.removeItem(key);
  }

  if (activeRole) {
    localStorage.setItem(ACTIVE_ROLE_KEY, activeRole);
  } else {
    localStorage.removeItem(ACTIVE_ROLE_KEY);
  }
}

export function clearAllWebSessions() {
  if (typeof window === 'undefined') return;
  for (const key of ALL_STORAGE_KEYS) localStorage.removeItem(key);
  localStorage.removeItem(ACTIVE_ROLE_KEY);
}

function readRoleSession(role) {
  const config = ROLE_KEYS[role];
  if (!config) return null;

  const token = config.tokens.map((k) => localStorage.getItem(k)).find(Boolean);
  if (!token) return null;

  let profile = null;
  for (const key of config.profiles) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    profile = safeParse(raw);
    if (profile) break;
  }
  if (!profile) return null;

  const resolvedRole = role === 'user' ? (profile.role || 'user') : role;
  return { ...profile, role: resolvedRole };
}

/** Resolve the currently active signed-in user for navbar / storefront UI. */
export function resolveWebAuthUser() {
  if (typeof window === 'undefined') return null;

  const activeRole = localStorage.getItem(ACTIVE_ROLE_KEY);
  if (activeRole) {
    const fromActive = readRoleSession(activeRole);
    if (fromActive) return fromActive;
    localStorage.removeItem(ACTIVE_ROLE_KEY);
  }

  const priority = ['agent', 'admin', 'supplier', 'franchise', 'vendor', 'user'];
  for (const role of priority) {
    const user = readRoleSession(role);
    if (user) {
      localStorage.setItem(ACTIVE_ROLE_KEY, user.role === 'admin' ? 'admin' : role);
      return user;
    }
  }

  return null;
}

export function getDashboardPath(role) {
  switch (role) {
    case 'admin':
      return '/dashboard';
    case 'agent':
      return '/agent/dashboard';
    case 'vendor':
    case 'service provider':
      return '/vendor/dashboard';
    case 'supplier':
      return '/supplier/dashboard';
    case 'franchise':
      return '/franchise/dashboard';
    default:
      return '/userdashboard';
  }
}

export async function syncWebLogout() {
  if (typeof window === 'undefined') return;
  clearAllWebSessions();
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch {
    /* local sign-out still applies */
  }
  window.dispatchEvent(new Event('userLoggedIn'));
}
