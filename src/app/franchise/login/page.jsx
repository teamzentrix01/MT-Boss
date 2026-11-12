'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PartnerMobileOtpAuth from '@/app/components/PartnerMobileOtpAuth';

export default function FranchiseLoginPage() {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
  const [showLegacyLogin, setShowLegacyLogin] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const update = () => setDark(html.classList.contains('dark-mode'));
    update();
    const obs = new MutationObserver(update);
    obs.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/franchise/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid franchise credentials.');
        return;
      }

      localStorage.setItem('franchise-token', data.token);
      localStorage.setItem('franchise', JSON.stringify(data.franchise));
      window.dispatchEvent(new Event('userLoggedIn'));
      router.push('/franchise/dashboard');
    } catch {
      setError('Could not sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      background: dark ? '#050505' : '#f5f5f7',
      color: dark ? '#fff' : '#111',
      fontFamily: 'DM Sans, system-ui, sans-serif',
    }}>
      <section style={{
        width: '100%',
        maxWidth: 860,
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(320px, 420px)',
        background: dark ? '#111' : '#fff',
        border: `1px solid ${dark ? '#27272a' : '#e5e7eb'}`,
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,.14)',
      }}>
        <div style={{
          padding: '2.5rem',
          background: '#111',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 420,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
            <strong style={{ letterSpacing: '-.03em' }}>MT<span style={{ color: 'var(--brand-blue)' }}>BOSS</span></strong>
            <Link href="/" style={{ color: '#aaa', textDecoration: 'none', fontSize: '.8rem', fontWeight: 700 }}>Home</Link>
          </div>
          <div>
            <p style={{ color: 'var(--brand-blue)', fontSize: '.7rem', fontWeight: 900, letterSpacing: '.18em', textTransform: 'uppercase' }}>Franchise Portal</p>
            <h1 style={{ fontSize: '2.2rem', lineHeight: 1.08, margin: '0 0 1rem', letterSpacing: '-.05em' }}>
              Manage your approved territory.
            </h1>
            <p style={{ color: '#a1a1aa', fontSize: '.92rem', lineHeight: 1.7, maxWidth: 360 }}>
              Sign in with the credentials sent after admin approval to create projects and assign approved agents.
            </p>
          </div>
          <small style={{ color: '#666' }}>Access is limited to franchise features only.</small>
        </div>

        <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <PartnerMobileOtpAuth
            role="franchise"
            title="Franchise sign in"
            subtitle="Use the mobile number linked to your approved franchise account."
            onSuccess={() => router.push('/franchise/dashboard')}
          />

          <button
            type="button"
            onClick={() => setShowLegacyLogin((v) => !v)}
            style={{ marginTop: '1rem', border: 0, background: 'transparent', color: 'var(--brand-blue)', fontWeight: 800, fontSize: '.82rem', cursor: 'pointer' }}
          >
            {showLegacyLogin ? '← Use mobile OTP' : 'Sign in with email & password (legacy)'}
          </button>

          {showLegacyLogin && error && (
            <div style={{
              padding: '.8rem 1rem',
              borderRadius: 8,
              background: dark ? '#2a0a0a' : '#fff1f2',
              color: dark ? '#fca5a5' : '#9f1239',
              border: `1px solid ${dark ? '#7f1d1d' : '#fecdd3'}`,
              fontSize: '.85rem',
              marginBottom: '1rem',
            }}>
              {error}
            </div>
          )}

          {showLegacyLogin ? <form onSubmit={submit}>
          <label style={{ fontSize: '.76rem', fontWeight: 800, color: dark ? '#d4d4d8' : '#52525b', marginBottom: '.4rem', marginTop: '1rem' }}>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            autoComplete="email"
            required
            style={{ padding: '.8rem .9rem', borderRadius: 8, border: `1px solid ${dark ? '#3f3f46' : '#d4d4d8'}`, background: dark ? '#18181b' : '#fafafa', color: 'inherit', marginBottom: '1rem' }}
          />

          <label style={{ fontSize: '.76rem', fontWeight: 800, color: dark ? '#d4d4d8' : '#52525b', marginBottom: '.4rem' }}>Password</label>
          <div style={{ display: 'flex', border: `1px solid ${dark ? '#3f3f46' : '#d4d4d8'}`, borderRadius: 8, background: dark ? '#18181b' : '#fafafa', marginBottom: '1rem' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              autoComplete="current-password"
              required
              style={{ flex: 1, minWidth: 0, padding: '.8rem .9rem', border: 0, outline: 0, background: 'transparent', color: 'inherit' }}
            />
            <button type="button" onClick={() => setShowPassword(v => !v)} style={{ padding: '0 .9rem', border: 0, background: 'transparent', color: dark ? '#d4d4d8' : '#52525b', cursor: 'pointer', fontWeight: 800 }}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.85rem', color: dark ? '#a1a1aa' : '#52525b', marginBottom: '1.25rem' }}>
            <input
              type="checkbox"
              checked={form.rememberMe}
              onChange={e => setForm(f => ({ ...f, rememberMe: e.target.checked }))}
              style={{ accentColor: 'var(--brand-blue)' }}
            />
            Remember me
          </label>

          <button type="submit" disabled={loading} style={{
            border: 0,
            borderRadius: 8,
            background: 'var(--brand-blue)',
            color: '#111',
            padding: '.9rem 1rem',
            fontWeight: 900,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? .65 : 1,
          }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          </form> : null}

          <p style={{ margin: '1rem 0 0', fontSize: '.82rem', color: dark ? '#71717a' : '#71717a', lineHeight: 1.6 }}>
            Do not have credentials yet? Submit the <Link href="/franchise" style={{ color: 'var(--brand-blue-deep)', fontWeight: 800 }}>franchise form</Link> and wait for admin approval.
          </p>
        </div>
      </section>
    </main>
  );
}
