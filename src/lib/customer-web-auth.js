/**
 * Persist customer JWT + profile in browser storage (ShopNow / checkout).
 */
export function applyCustomerWebSession({ token, user, refreshToken }) {
  if (typeof window === 'undefined') return;
  try {
    if (token) localStorage.setItem('token', token);
    if (refreshToken) localStorage.setItem('mtboss.mobile.refreshToken', refreshToken);
    if (user) {
      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || user.mobile,
        role: user.role || 'user',
      }));
    }
    window.dispatchEvent(new Event('userLoggedIn'));
  } catch {
    /* ignore quota errors */
  }
}

export async function persistCustomerOtpCookie(token) {
  if (!token) return;
  try {
    await fetch('/api/auth/customer-otp-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
  } catch {
    /* cookie is optional for shop APIs using Bearer from localStorage */
  }
}
