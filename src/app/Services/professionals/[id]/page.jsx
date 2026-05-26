'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

/* ── dark-mode hook ─────────────────────────────────────────────────────────── */
function useDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const check = () => setDark(document.documentElement.classList.contains('dark-mode'));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

/* ── theme ──────────────────────────────────────────────────────────────────── */
function th(d) {
  return {
    pageBg:    d ? '#000000' : '#f4f5f7',
    card:      d ? '#111111' : '#ffffff',
    text:      d ? '#ffffff' : '#111827',
    sub:       d ? '#71717a' : '#6b7280',
    muted:     d ? '#52525b' : '#9ca3af',
    border:    d ? '#27272a' : '#e5e7eb',
    inputBg:   d ? '#0a0a0a' : '#ffffff',
    accent:    d ? '#facc15' : '#111827',
    accentFg:  d ? '#000000' : '#ffffff',
    heroBg:    d ? '#070707' : '#111827',
    tagBg:     d ? '#1c1c1c' : '#f3f4f6',
    sectionBg: d ? '#0d0d0d' : '#ffffff',
    strip:     d ? '#0a0a0a' : '#f9fafb',
  };
}

/* ── parse JSON safely ──────────────────────────────────────────────────────── */
function parseArr(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try { return JSON.parse(val); } catch { return val.split(',').map(s => s.trim()).filter(Boolean); }
  }
  return [];
}

/* ══════════════════════════════════════════════════════════════════════════════
   PROFILE PAGE
══════════════════════════════════════════════════════════════════════════════ */
export default function ProfessionalProfilePage() {
  const isDark = useDark();
  const t = th(isDark);
  const { id } = useParams();
  const enquiryRef = useRef(null);

  const [pro, setPro]           = useState(null);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [lightbox, setLightbox] = useState(null); // index into portfolio

  /* enquiry form */
  const [form, setForm]     = useState({ name: '', email: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [err, setErr]         = useState('');

  useEffect(() => {
    if (!id) return;
    fetch(`/api/professional-services?id=${id}`)
      .then(r => r.json())
      .then(d => { if (d.success && d.data) setPro(d.data); else setNotFound(true); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleEnquiry(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { setErr('Name, email and message are required.'); return; }
    setSending(true); setErr('');
    try {
      const res = await fetch('/api/professional-enquiries', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ professional_id: pro.id, enquirer_name: form.name,
          enquirer_email: form.email, enquirer_phone: form.phone, message: form.message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setSent(true);
    } catch (e) { setErr(e.message); }
    finally { setSending(false); }
  }

  /* ── shared input style ─── */
  const inp = {
    border: `1px solid ${t.border}`, borderRadius: '4px', padding: '11px 14px',
    background: t.inputBg, color: t.text, fontSize: '13px', outline: 'none',
    width: '100%', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.15s',
  };

  /* ── states ───────────────────────────────────────────────────────────────── */
  if (loading) return (
    <div style={{ minHeight: '100vh', background: t.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '36px', height: '36px', border: `2px solid ${t.border}`, borderTopColor: t.accent, borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: t.sub, fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Loading…</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  if (notFound || !pro) return (
    <div style={{ minHeight: '100vh', background: t.pageBg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <div style={{ fontSize: '56px' }}>👤</div>
      <h2 style={{ color: t.text, fontSize: '22px', fontWeight: 800, margin: 0, textTransform: 'uppercase' }}>Professional not found</h2>
      <p style={{ color: t.sub, fontSize: '13px', margin: 0 }}>This profile may have been removed or is not yet approved.</p>
      <Link href="/Services/professionals"
        style={{ marginTop: '8px', background: t.accent, color: t.accentFg, padding: '11px 28px', textDecoration: 'none', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        ← Back to Professionals
      </Link>
    </div>
  );

  const specializations = parseArr(pro.specializations);
  const portfolio       = parseArr(pro.portfolio_images);
  const socials = [
    pro.website   && { icon: '🌐', label: 'Website',   href: pro.website.startsWith('http')   ? pro.website   : `https://${pro.website}` },
    pro.instagram && { icon: '📸', label: 'Instagram', href: pro.instagram.startsWith('http') ? pro.instagram : `https://instagram.com/${pro.instagram.replace('@','')}` },
    pro.linkedin  && { icon: '💼', label: 'LinkedIn',  href: pro.linkedin.startsWith('http')  ? pro.linkedin  : `https://linkedin.com/in/${pro.linkedin}` },
  ].filter(Boolean);

  const firstName = pro.name?.split(' ')[0] || 'Professional';

  /* ══════════════════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════════════════ */
  return (
    <div style={{ minHeight: '100vh', background: t.pageBg, fontFamily: "'Inter',system-ui,sans-serif", color: t.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .enq-inp:focus  { border-color: ${t.accent} !important; box-shadow: 0 0 0 3px ${isDark ? 'rgba(250,204,21,0.12)' : 'rgba(17,24,39,0.08)'} !important; }
        .enq-inp::placeholder { color: ${t.muted}; }
        .back-lnk:hover { color: ${t.accent} !important; }
        .port-thumb { transition: transform 0.25s, box-shadow 0.25s; cursor: zoom-in; }
        .port-thumb:hover { transform: scale(1.04); box-shadow: 0 8px 32px rgba(0,0,0,0.35); }
        .contact-row:hover { background: ${isDark ? '#1a1a1a' : '#f9fafb'} !important; }
        .social-row:hover  { background: ${isDark ? '#1a1a1a' : '#f9fafb'} !important; }
        .cta-btn:hover { opacity: 0.88; }
        @media (max-width: 860px) {
          .pro-body  { flex-direction: column !important; }
          .pro-aside { width: 100% !important; position: static !important; }
          .hero-row  { flex-direction: column !important; align-items: flex-start !important; gap: 20px !important; }
          .hero-cta  { width: 100% !important; }
          .hero-cta button, .hero-cta a { width: 100% !important; text-align: center !important; justify-content: center; }
        }
      `}</style>

      {/* ═══════════════════════════════ HERO ═════════════════════════════════ */}
      <div style={{ background: t.heroBg, borderBottom: `3px solid ${t.accent}` }}>
        {/* Breadcrumb */}
        <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '20px 24px 0' }}>
          <Link href="/Services/professionals" className="back-lnk"
            style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: 700, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'color 0.15s' }}>
            ← Professional Services
          </Link>
        </div>

        {/* Hero row */}
        <div className="hero-row" style={{ maxWidth: '1120px', margin: '0 auto', padding: '28px 24px 40px', display: 'flex', gap: '28px', alignItems: 'flex-end', flexWrap: 'wrap' }}>

          {/* Avatar */}
          <div style={{ flexShrink: 0 }}>
            {pro.profile_picture
              ? <img src={pro.profile_picture} alt={pro.name}
                  style={{ width: '140px', height: '140px', objectFit: 'cover', display: 'block', border: `3px solid ${t.accent}` }} />
              : <div style={{ width: '140px', height: '140px', background: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px', color: t.accentFg, fontWeight: 900, border: `3px solid ${t.accent}`, flexShrink: 0 }}>
                  {pro.name?.[0]?.toUpperCase()}
                </div>
            }
          </div>

          {/* Name block */}
          <div style={{ flex: 1, minWidth: '180px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(250,204,21,0.1)', border: '1px solid rgba(250,204,21,0.28)', color: t.accent, fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', padding: '4px 12px', marginBottom: '14px' }}>
              {pro.category}
            </div>
            <h1 style={{ color: '#fff', margin: '0 0 6px', fontSize: 'clamp(26px,4vw,42px)', fontWeight: 900, letterSpacing: '-0.025em', lineHeight: 1.05 }}>
              {pro.name}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', margin: '0 0 20px', fontSize: '15px', fontWeight: 500 }}>{pro.title}</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', padding: '5px 14px', fontSize: '11px', fontWeight: 600 }}>
                📍 {pro.city}
              </span>
              <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', padding: '5px 14px', fontSize: '11px', fontWeight: 600 }}>
                ⏱ {pro.experience} yr{pro.experience !== 1 ? 's' : ''} experience
              </span>
              <span style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', padding: '5px 14px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ✓ Verified
              </span>
            </div>
          </div>

          {/* Hero CTA */}
          <div className="hero-cta" style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '170px' }}>
            <button className="cta-btn"
              onClick={() => enquiryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              style={{ background: t.accent, color: t.accentFg, border: 'none', padding: '13px 24px', cursor: 'pointer', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', transition: 'opacity 0.15s', whiteSpace: 'nowrap' }}>
              ✉ Send Enquiry
            </button>
            {pro.phone && (
              <a href={`tel:${pro.phone}`}
                style={{ display: 'block', textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)', padding: '10px 24px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', textDecoration: 'none', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
                📞 Call Now
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════ STATS STRIP ══════════════════════════ */}
      <div style={{ background: t.strip, borderBottom: `1px solid ${t.border}` }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 24px', display: 'flex', flexWrap: 'wrap' }}>
          {[
            { label: 'Category',   value: pro.category },
            { label: 'Experience', value: `${pro.experience} Years` },
            { label: 'Location',   value: pro.city },
            ...(specializations.length > 0 ? [{ label: 'Specializations', value: specializations.length }] : []),
            ...(portfolio.length       > 0 ? [{ label: 'Portfolio Works',  value: portfolio.length       }] : []),
          ].map((s, i) => (
            <div key={i} style={{ padding: '18px 32px 18px 0', marginRight: '32px', borderRight: `1px solid ${t.border}` }}>
              <div style={{ fontSize: '9px', fontWeight: 700, color: t.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>{s.label}</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: t.accent }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════ BODY ════════════════════════════════ */}
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '36px 24px 60px' }}>
        <div className="pro-body" style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}>

          {/* ──────────────────── SIDEBAR ──────────────────────────────────── */}
          <aside className="pro-aside" style={{ width: '292px', flexShrink: 0, position: 'sticky', top: '24px' }}>

            {/* Contact Card */}
            <div style={{ background: t.card, border: `1px solid ${t.border}`, marginBottom: '16px', overflow: 'hidden' }}>
              <div style={{ background: isDark ? '#0d0d0d' : '#f9fafb', padding: '14px 20px', borderBottom: `1px solid ${t.border}` }}>
                <p style={{ margin: 0, fontSize: '9px', fontWeight: 800, color: t.accent, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Contact</p>
              </div>
              <div style={{ padding: '8px 0' }}>
                {pro.email && (
                  <a href={`mailto:${pro.email}`} className="contact-row"
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 20px', color: t.text, textDecoration: 'none', fontSize: '12px', fontWeight: 600, transition: 'background 0.12s' }}>
                    <span style={{ width: '34px', height: '34px', background: isDark ? '#1c1c1c' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0, border: `1px solid ${t.border}` }}>✉️</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pro.email}</span>
                  </a>
                )}
                {pro.phone && (
                  <a href={`tel:${pro.phone}`} className="contact-row"
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 20px', color: t.text, textDecoration: 'none', fontSize: '12px', fontWeight: 600, transition: 'background 0.12s' }}>
                    <span style={{ width: '34px', height: '34px', background: isDark ? '#1c1c1c' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0, border: `1px solid ${t.border}` }}>📞</span>
                    {pro.phone}
                  </a>
                )}
              </div>
            </div>

            {/* Social Links */}
            {socials.length > 0 && (
              <div style={{ background: t.card, border: `1px solid ${t.border}`, marginBottom: '16px', overflow: 'hidden' }}>
                <div style={{ background: isDark ? '#0d0d0d' : '#f9fafb', padding: '14px 20px', borderBottom: `1px solid ${t.border}` }}>
                  <p style={{ margin: 0, fontSize: '9px', fontWeight: 800, color: t.accent, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Social & Web</p>
                </div>
                <div style={{ padding: '8px 0' }}>
                  {socials.map((s, i) => (
                    <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="social-row"
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 20px', color: t.accent, textDecoration: 'none', fontSize: '12px', fontWeight: 700, transition: 'background 0.12s' }}>
                      <span style={{ width: '34px', height: '34px', background: isDark ? '#1c1c1c' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0, border: `1px solid ${t.border}` }}>{s.icon}</span>
                      {s.label} ↗
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Info */}
            <div style={{ background: t.card, border: `1px solid ${t.border}`, marginBottom: '16px', overflow: 'hidden' }}>
              <div style={{ background: isDark ? '#0d0d0d' : '#f9fafb', padding: '14px 20px', borderBottom: `1px solid ${t.border}` }}>
                <p style={{ margin: 0, fontSize: '9px', fontWeight: 800, color: t.accent, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Profile Info</p>
              </div>
              <div style={{ padding: '4px 0' }}>
                {[
                  ['Category',   pro.category],
                  ['Experience', `${pro.experience} years`],
                  ['Location',   pro.city],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', borderBottom: `1px solid ${t.border}` }}>
                    <span style={{ fontSize: '11px', color: t.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</span>
                    <span style={{ fontSize: '12px', color: t.text, fontWeight: 700, textAlign: 'right', maxWidth: '60%' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar CTA */}
            <button className="cta-btn"
              onClick={() => enquiryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              style={{ width: '100%', background: t.accent, color: t.accentFg, border: 'none', padding: '15px', cursor: 'pointer', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', transition: 'opacity 0.15s' }}>
              ✉ Send Enquiry to {firstName}
            </button>
          </aside>

          {/* ──────────────────── MAIN CONTENT ─────────────────────────────── */}
          <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* About */}
            {pro.description && (
              <section style={{ background: t.card, border: `1px solid ${t.border}`, overflow: 'hidden' }}>
                <div style={{ background: isDark ? '#0d0d0d' : '#f9fafb', padding: '16px 24px', borderBottom: `1px solid ${t.border}` }}>
                  <p style={{ margin: 0, fontSize: '9px', fontWeight: 800, color: t.accent, textTransform: 'uppercase', letterSpacing: '0.12em' }}>About {firstName}</p>
                </div>
                <div style={{ padding: '24px' }}>
                  <p style={{ color: t.sub, fontSize: '14px', lineHeight: '1.85', margin: 0 }}>{pro.description}</p>
                </div>
              </section>
            )}

            {/* Specializations */}
            {specializations.length > 0 && (
              <section style={{ background: t.card, border: `1px solid ${t.border}`, overflow: 'hidden' }}>
                <div style={{ background: isDark ? '#0d0d0d' : '#f9fafb', padding: '16px 24px', borderBottom: `1px solid ${t.border}` }}>
                  <p style={{ margin: 0, fontSize: '9px', fontWeight: 800, color: t.accent, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Specializations</p>
                </div>
                <div style={{ padding: '20px 24px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {specializations.map((s, i) => (
                    <span key={i} style={{ background: t.tagBg, color: t.text, border: `1px solid ${t.border}`, padding: '6px 16px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.02em' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {pro.certifications && (
              <section style={{ background: t.card, border: `1px solid ${t.border}`, overflow: 'hidden' }}>
                <div style={{ background: isDark ? '#0d0d0d' : '#f9fafb', padding: '16px 24px', borderBottom: `1px solid ${t.border}` }}>
                  <p style={{ margin: 0, fontSize: '9px', fontWeight: 800, color: t.accent, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Certifications & Awards</p>
                </div>
                <div style={{ padding: '20px 24px' }}>
                  <p style={{ color: t.sub, fontSize: '13px', margin: 0, lineHeight: '1.75' }}>{pro.certifications}</p>
                </div>
              </section>
            )}

            {/* Portfolio */}
            {portfolio.length > 0 && (
              <section style={{ background: t.card, border: `1px solid ${t.border}`, overflow: 'hidden' }}>
                <div style={{ background: isDark ? '#0d0d0d' : '#f9fafb', padding: '16px 24px', borderBottom: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ margin: 0, fontSize: '9px', fontWeight: 800, color: t.accent, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Portfolio</p>
                  <span style={{ fontSize: '10px', color: t.muted, fontWeight: 600 }}>{portfolio.length} works</span>
                </div>
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '8px' }}>
                    {portfolio.map((url, i) => (
                      <div key={i} className="port-thumb" onClick={() => setLightbox(i)}
                        style={{ aspectRatio: '1', overflow: 'hidden', border: `1px solid ${t.border}`, position: 'relative' }}>
                        <img src={url} alt={`Work ${i + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          onError={e => { e.target.parentElement.style.display = 'none'; }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ color: '#fff', fontSize: '20px', opacity: 0, transition: 'opacity 0.2s' }}>🔍</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

          </main>
        </div>

        {/* ═══════════════════════════ ENQUIRY FORM ═══════════════════════════ */}
        <section ref={enquiryRef} style={{ background: t.card, border: `1px solid ${t.border}`, marginTop: '28px', overflow: 'hidden' }}>
          <div style={{ background: isDark ? '#0d0d0d' : '#f9fafb', padding: '20px 32px', borderBottom: `1px solid ${t.border}` }}>
            <p style={{ margin: '0 0 4px', fontSize: '9px', fontWeight: 800, color: t.accent, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Get in Touch</p>
            <h2 style={{ margin: '0', color: t.text, fontSize: '20px', fontWeight: 800 }}>
              Send an Enquiry to {pro.name}
            </h2>
          </div>

          <div style={{ padding: '32px' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ width: '72px', height: '72px', background: t.accent, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '30px', color: t.accentFg }}>✓</div>
                <h3 style={{ color: t.text, margin: '0 0 10px', fontSize: '22px', fontWeight: 800, textTransform: 'uppercase' }}>Enquiry Sent!</h3>
                <p style={{ color: t.sub, fontSize: '14px', margin: '0 0 28px', maxWidth: '360px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.7' }}>
                  {pro.name} will receive your message and reach out to you on <strong style={{ color: t.text }}>{form.email}</strong>.
                </p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', message: '' }); }}
                  style={{ background: t.accent, color: t.accentFg, border: 'none', padding: '12px 32px', cursor: 'pointer', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Send Another Enquiry
                </button>
              </div>
            ) : (
              <>
                <p style={{ color: t.sub, fontSize: '13px', margin: '0 0 24px', lineHeight: '1.6' }}>
                  Fill in your details below. {firstName} will respond directly to your email address.
                </p>
                {err && (
                  <div style={{ background: isDark ? '#2d1515' : '#fee2e2', color: '#ef4444', padding: '10px 16px', fontSize: '13px', marginBottom: '16px', border: '1px solid rgba(239,68,68,0.3)' }}>
                    {err}
                  </div>
                )}
                <form onSubmit={handleEnquiry}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                    <div>
                      <label style={{ fontSize: '10px', fontWeight: 700, color: t.muted, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '6px' }}>Your Name *</label>
                      <input className="enq-inp" style={inp} placeholder="Full name" value={form.name} onChange={set('name')} />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', fontWeight: 700, color: t.muted, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '6px' }}>Email Address *</label>
                      <input className="enq-inp" style={inp} type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', fontWeight: 700, color: t.muted, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '6px' }}>Phone (optional)</label>
                      <input className="enq-inp" style={inp} type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} />
                    </div>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '10px', fontWeight: 700, color: t.muted, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '6px' }}>Your Message *</label>
                    <textarea className="enq-inp" style={{ ...inp, resize: 'vertical' }} rows={5}
                      placeholder={`Describe your project or requirement to ${firstName}…`}
                      value={form.message} onChange={set('message')} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="cta-btn" type="submit" disabled={sending}
                      style={{ background: t.accent, color: t.accentFg, border: 'none', padding: '14px 40px', cursor: sending ? 'wait' : 'pointer', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: sending ? 0.7 : 1, transition: 'opacity 0.15s' }}>
                      {sending ? 'Sending…' : `Send Enquiry to ${firstName} →`}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </section>
      </div>

      {/* ════════════════════════════ LIGHTBOX ════════════════════════════════ */}
      {lightbox !== null && (
        <div
          onClick={() => setLightbox(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.93)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <button onClick={() => setLightbox(null)}
            style={{ position: 'fixed', top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: '36px', height: '36px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ✕
          </button>
          {lightbox > 0 && (
            <button onClick={e => { e.stopPropagation(); setLightbox(lightbox - 1); }}
              style={{ position: 'fixed', left: '16px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: '44px', height: '44px', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ‹
            </button>
          )}
          <img src={portfolio[lightbox]} alt={`Work ${lightbox + 1}`} onClick={e => e.stopPropagation()}
            style={{ maxWidth: '90vw', maxHeight: '88vh', objectFit: 'contain', border: `2px solid ${t.accent}` }} />
          {lightbox < portfolio.length - 1 && (
            <button onClick={e => { e.stopPropagation(); setLightbox(lightbox + 1); }}
              style={{ position: 'fixed', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: '44px', height: '44px', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ›
            </button>
          )}
          <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em' }}>
            {lightbox + 1} / {portfolio.length}
          </div>
        </div>
      )}
    </div>
  );
}
