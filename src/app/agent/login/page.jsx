'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AgentLoginPage() {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    const html = document.documentElement;
    const update = () => setDark(html.classList.contains('dark-mode'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/agent/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid credentials.');
        return;
      }

      localStorage.setItem('agent-token', data.token);
      localStorage.setItem('agent', JSON.stringify(data.agent));
      document.cookie = `agent-auth-token=${data.token}; path=/; max-age=604800`;
      window.dispatchEvent(new Event('userLoggedIn'));
      router.push('/agent/dashboard');
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const bg = dark ? '#000' : '#f5f5f7';
  const surface = dark ? '#0a0a0a' : '#fff';
  const border = dark ? '#27272a' : '#e2e2e7';
  const text = dark ? '#fff' : '#111113';
  const muted = dark ? '#8a8a94' : '#666';
  const inputBg = dark ? '#111' : '#f9f9fb';

  return (
    <main style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 820, display: 'flex', background: surface, border: `1px solid ${border}`, borderRadius: 12, overflow: 'hidden', boxShadow: '0 10px 42px rgba(0,0,0,.08)' }}>
        <section className="hidden sm:flex" style={{ flex: '0 0 300px', background: '#111113', color: '#fff', padding: '2.5rem 2rem', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: '1rem', marginBottom: '2rem' }}>
              MT<span style={{ color: 'var(--brand-blue)' }}>BOSS</span>
              <span style={{ marginLeft: 8, fontSize: 10, color: '#111', background: 'var(--brand-blue)', padding: '3px 8px', borderRadius: 99 }}>AGENT</span>
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.25, marginBottom: 10 }}>Manage your city leads with focus.</h1>
            <p style={{ fontSize: 13, color: '#aaa', lineHeight: 1.7 }}>Sign in to track leads, follow-ups, and your daily schedule.</p>
          </div>
          <p style={{ fontSize: 11, color: '#666' }}>Approved agents only</p>
        </section>

        <section style={{ flex: 1, padding: '2.25rem 2rem' }}>
          <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: muted, fontSize: 12, fontWeight: 700, textDecoration: 'none', marginBottom: '1.5rem' }}>
            Back to user login
          </Link>

          <h2 style={{ color: text, fontSize: '1.125rem', fontWeight: 800, margin: 0 }}>Agent Sign In</h2>
          <p style={{ color: muted, fontSize: 13, marginTop: 4, marginBottom: 22 }}>Use the credentials sent by admin after approval.</p>

          {error && (
            <div style={{ padding: '0.6rem 0.85rem', border: '1px solid #fca5a5', background: dark ? '#3f1515' : '#fff1f2', color: dark ? '#fca5a5' : '#9f1239', borderRadius: 7, fontSize: 13, marginBottom: 14 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: muted, marginBottom: 6 }}>Email address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="agent@example.com"
              style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem 0.75rem', border: `1px solid ${border}`, borderRadius: 7, background: inputBg, color: text, fontSize: 13, outline: 'none', marginBottom: 14 }}
            />

            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: muted, marginBottom: 6 }}>Password</label>
            <div style={{ position: 'relative', marginBottom: 18 }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="Temporary password"
                style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem 4.5rem 0.65rem 0.75rem', border: `1px solid ${border}`, borderRadius: 7, background: inputBg, color: text, fontSize: 13, outline: 'none' }}
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', border: 0, background: 'transparent', color: 'var(--brand-blue)', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.7rem 1rem', border: 0, borderRadius: 7, background: 'var(--brand-blue)', color: '#111', fontSize: 13, fontWeight: 900, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.65 : 1 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ color: muted, fontSize: 12, lineHeight: 1.6, marginTop: 18 }}>
            No credentials yet? Submit the agent application first and wait for admin approval.
          </p>
        </section>
      </div>
    </main>
  );
}
