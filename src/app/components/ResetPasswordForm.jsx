'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ResetForm({ loginHref, accentColor }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [dark, setDark] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const html = document.documentElement;
    const update = () => setDark(html.classList.contains('dark-mode'));
    update();
    const obs = new MutationObserver(update);
    obs.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!token) { setValidating(false); setTokenValid(false); return; }
    fetch(`/api/reset-password?token=${token}`)
      .then(r => r.json())
      .then(d => { setTokenValid(d.valid); setValidating(false); })
      .catch(() => { setTokenValid(false); setValidating(false); });
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (data.success) {
        setDone(true);
        setTimeout(() => router.push(loginHref), 3000);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch { setError('An error occurred. Please try again.'); }
    finally { setLoading(false); }
  };

  const bg      = dark ? '#0a0a0a' : '#f5f5f7';
  const surface = dark ? '#111'    : '#fff';
  const border  = dark ? '#27272a' : '#e2e2e7';
  const text    = dark ? '#f0f0f5' : '#111';
  const muted   = dark ? '#71717a' : '#6b6b76';
  const inputBg = dark ? '#1a1a1a' : '#f9f9fb';

  const inputStyle = {
    width:'100%', padding:'0.75rem 0.9rem', border:`1.5px solid ${border}`, borderRadius:8,
    background:inputBg, color:text, fontSize:'0.875rem', fontFamily:'inherit', outline:'none',
    boxSizing:'border-box', transition:'border-color .2s',
  };

  const btnStyle = {
    width:'100%', padding:'0.8rem', background:accentColor, color:accentColor==='#facc15'?'#000':'#fff',
    border:'none', borderRadius:8, fontSize:'0.9rem', fontWeight:700, cursor:'pointer',
    fontFamily:'inherit', transition:'opacity .2s', marginTop:'0.5rem',
  };

  return (
    <div style={{ minHeight:'100vh', background:bg, display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
      <div style={{ width:'100%', maxWidth:420, background:surface, border:`1px solid ${border}`, borderRadius:14, padding:'2.5rem', boxShadow:'0 8px 40px rgba(0,0,0,.08)' }}>

        {validating ? (
          <div style={{ textAlign:'center', color:muted, padding:'2rem 0' }}>Verifying link…</div>
        ) : !tokenValid ? (
          <>
            <div style={{ fontSize:'2.5rem', textAlign:'center', marginBottom:'1rem' }}>⛔</div>
            <h2 style={{ fontSize:'1.125rem', fontWeight:700, color:text, textAlign:'center', marginBottom:'0.5rem' }}>Link Invalid or Expired</h2>
            <p style={{ fontSize:'0.875rem', color:muted, textAlign:'center', lineHeight:1.6, marginBottom:'1.5rem' }}>
              This reset link is no longer valid. Please request a new one.
            </p>
            <Link href={loginHref.replace('login', 'forgot-password')}
              style={{ display:'block', textAlign:'center', padding:'0.75rem', background:accentColor, color:accentColor==='#facc15'?'#000':'#fff', borderRadius:8, fontWeight:700, textDecoration:'none' }}>
              Request New Link
            </Link>
          </>
        ) : done ? (
          <>
            <div style={{ fontSize:'3rem', textAlign:'center', marginBottom:'1rem' }}>✅</div>
            <h2 style={{ fontSize:'1.125rem', fontWeight:700, color:text, textAlign:'center', marginBottom:'0.5rem' }}>Password Reset!</h2>
            <p style={{ fontSize:'0.875rem', color:muted, textAlign:'center', lineHeight:1.6 }}>
              Your password has been updated. Redirecting to login…
            </p>
          </>
        ) : (
          <>
            <Link href={loginHref} style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:'0.78rem', fontWeight:600, color:muted, textDecoration:'none', marginBottom:'1.75rem' }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
              Back to Login
            </Link>

            <div style={{ width:48, height:48, borderRadius:12, background:`${accentColor}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', marginBottom:'1.25rem' }}>🔒</div>

            <h1 style={{ fontSize:'1.375rem', fontWeight:700, color:text, marginBottom:'0.4rem', letterSpacing:'-0.02em' }}>Set new password</h1>
            <p style={{ fontSize:'0.875rem', color:muted, marginBottom:'1.75rem', lineHeight:1.6 }}>
              Choose a strong password with at least 6 characters.
            </p>

            {error && (
              <div style={{ padding:'0.75rem 1rem', background:dark?'#2d0a0a':'#fff0f0', border:`1px solid ${dark?'#7f1d1d':'#fca5a5'}`, borderRadius:8, color:dark?'#f87171':'#dc2626', fontSize:'0.875rem', marginBottom:'1.25rem' }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom:'1rem' }}>
                <label style={{ display:'block', fontSize:'0.78rem', fontWeight:600, color:muted, marginBottom:'0.4rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>New Password</label>
                <div style={{ position:'relative' }}>
                  <input type={showPwd?'text':'password'} value={password} onChange={e=>{setPassword(e.target.value);setError('');}} placeholder="Min. 6 characters" required
                    style={{ ...inputStyle, paddingRight:'2.5rem' }}
                    onFocus={e=>e.target.style.borderColor=accentColor}
                    onBlur={e=>e.target.style.borderColor=border}
                  />
                  <button type="button" onClick={()=>setShowPwd(p=>!p)}
                    style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:muted, fontSize:'1rem' }}>
                    {showPwd?'🙈':'👁'}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom:'1.25rem' }}>
                <label style={{ display:'block', fontSize:'0.78rem', fontWeight:600, color:muted, marginBottom:'0.4rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Confirm Password</label>
                <input type={showPwd?'text':'password'} value={confirm} onChange={e=>{setConfirm(e.target.value);setError('');}} placeholder="Repeat password" required
                  style={inputStyle}
                  onFocus={e=>e.target.style.borderColor=accentColor}
                  onBlur={e=>e.target.style.borderColor=border}
                />
                {confirm && password !== confirm && (
                  <div style={{ fontSize:'0.75rem', color:'#ef4444', marginTop:'0.35rem' }}>Passwords don't match</div>
                )}
              </div>

              <button type="submit" disabled={loading} style={{ ...btnStyle, opacity:loading?.6:1, cursor:loading?'not-allowed':'pointer' }}>
                {loading ? 'Resetting…' : 'Reset Password →'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordForm(props) {
  return (
    <Suspense fallback={<div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>Loading…</div>}>
      <ResetForm {...props} />
    </Suspense>
  );
}
