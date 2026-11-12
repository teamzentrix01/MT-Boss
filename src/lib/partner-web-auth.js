/**
 * Store partner JWT sessions in browser (vendor, agent, supplier, franchise).
 */

import { ACTIVE_ROLE_KEY, clearWebSessionExcept } from '@/lib/client-session';
import { normalizeFranchisePermissions } from '@/lib/franchise-permissions';

/**
 * @param {'agent'|'vendor'|'supplier'|'franchise'} role
 * @param {object} data verify-otp JSON
 */
export function applyPartnerWebSession(role, data) {
  if (typeof window === 'undefined') return;

  clearWebSessionExcept(role);
  const token = data.accessToken || data.token;
  if (!token) return;

  const entity = data[role] || data.user || {};
  const refreshToken = data.refreshToken;

  if (refreshToken) {
    localStorage.setItem('mtboss.mobile.refreshToken', refreshToken);
  }

  if (role === 'agent') {
    localStorage.setItem('agent-token', token);
    localStorage.setItem(
      'agent',
      JSON.stringify({
        ...entity,
        role: 'agent',
        has_project_management_access: Boolean(entity.has_project_management_access),
        is_manager: Boolean(entity.is_manager),
      }),
    );
  } else if (role === 'vendor') {
    localStorage.setItem('vendor-token', token);
    localStorage.setItem('service-provider-token', token);
    localStorage.setItem('vendor', JSON.stringify({ ...entity, role: 'vendor' }));
    localStorage.setItem('service-provider', JSON.stringify({ ...entity, role: 'vendor' }));
  } else if (role === 'supplier') {
    localStorage.setItem('supplier-token', token);
    localStorage.setItem('supplier', JSON.stringify({ ...entity, role: 'supplier' }));
  } else if (role === 'franchise') {
    localStorage.setItem('franchise-token', token);
    localStorage.setItem('franchise', JSON.stringify({
      ...entity,
      permissions: normalizeFranchisePermissions(entity.permissions),
      role: 'franchise',
    }));
  }

  localStorage.setItem(ACTIVE_ROLE_KEY, role);
  window.dispatchEvent(new Event('userLoggedIn'));
}
