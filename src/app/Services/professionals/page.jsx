'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = ['All', 'Interior Designer', 'Architect', 'Landscape Designer',
  'Civil Engineer', 'Vastu Consultant', 'Home Stager', 'Other'];

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

function th(isDark) {
  return {
    pageBg:    isDark ? '#000000' : '#ffffff',
    card:      isDark ? '#111111' : '#ffffff',
    cardHov:   isDark ? '#1a1a1a' : '#f9fafb',
    text:      isDark ? '#ffffff' : '#111827',
    sub:       isDark ? '#71717a'  : '#6b7280',
    muted:     isDark ? '#52525b'  : '#9ca3af',
    border:    isDark ? '#27272a'  : '#e5e7eb',
    borderHov: isDark ? 'var(--brand-blue)'  : '#111827',
    accent:    isDark ? 'var(--brand-blue)'  : '#111827',
    accentFg:  isDark ? '#000000'  : '#ffffff',
    inputBg:   isDark ? '#0a0a0a'  : '#f9fafb',
    tagBg:     isDark ? '#1c1c1c'  : '#f3f4f6',
    heroBg:    isDark ? '#000000'  : '#111827',
  };
}

// ─── Cloudinary uploader ─────────────────────────────────────────────────────
async function uploadToCloudinary(file) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
  fd.append('cloud_name',    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
  const res  = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: fd }
  );
  const data = await res.json();
  if (data.secure_url) return data.secure_url;
  throw new Error(data.error?.message || 'Upload failed');
}

// ─── Image Upload Field (single) ─────────────────────────────────────────────
function SingleImageUpload({ label, value, onChange, isDark, required }) {
  const t = th(isDark);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true); setErr('');
    try {
      const url = await uploadToCloudinary(file);
      onChange(url);
    } catch (e) { setErr(e.message); }
    finally { setUploading(false); }
  }

  return (
    <div>
      <label style={{ fontSize:'10px',fontWeight:700,color:t.sub,textTransform:'uppercase',letterSpacing:'0.07em',display:'block',marginBottom:'6px' }}>
        {label}{required ? ' *' : ''}
      </label>
      <div style={{ display:'flex',gap:'10px',alignItems:'center' }}>
        {value && (
          <div style={{ position:'relative',flexShrink:0 }}>
            <img src={value} alt="Preview" style={{ width:'56px',height:'56px',objectFit:'cover',border:`1px solid ${t.border}`,borderRadius:'2px' }} />
            <button type="button" onClick={()=>onChange('')}
              style={{ position:'absolute',top:'-6px',right:'-6px',width:'18px',height:'18px',borderRadius:'50%',background:'#ef4444',border:'none',color:'#fff',fontSize:'10px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',lineHeight:1 }}>✕</button>
          </div>
        )}
        <label style={{ flex:1,border:`1px dashed ${t.border}`,borderRadius:'4px',padding:'10px 14px',cursor:'pointer',display:'flex',alignItems:'center',gap:'8px',background:t.inputBg,transition:'border-color 0.15s' }}>
          <span style={{ fontSize:'18px' }}>{uploading ? '⏳' : '📁'}</span>
          <span style={{ fontSize:'12px',color:t.sub,fontWeight:600 }}>
            {uploading ? 'Uploading…' : value ? 'Replace image' : 'Click to upload'}
          </span>
          <input type="file" accept="image/*" onChange={handleFile} style={{ display:'none' }} disabled={uploading} />
        </label>
      </div>
      {err && <p style={{ color:'#ef4444',fontSize:'11px',margin:'4px 0 0' }}>{err}</p>}
    </div>
  );
}

// ─── Multi Image Upload Field ─────────────────────────────────────────────────
function MultiImageUpload({ label, value = [], onChange, isDark }) {
  const t = th(isDark);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');

  async function handleFiles(e) {
    const files = Array.from(e.target.files).slice(0, 8);
    if (!files.length) return;
    setUploading(true); setErr('');
    try {
      const urls = await Promise.all(files.map(uploadToCloudinary));
      onChange([...value, ...urls]);
    } catch (e) { setErr(e.message); }
    finally { setUploading(false); e.target.value = ''; }
  }

  function remove(idx) {
    onChange(value.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <label style={{ fontSize:'10px',fontWeight:700,color:t.sub,textTransform:'uppercase',letterSpacing:'0.07em',display:'block',marginBottom:'6px' }}>{label}</label>
      {value.length > 0 && (
        <div style={{ display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'8px' }}>
          {value.map((url,i)=>(
            <div key={i} style={{ position:'relative' }}>
              <img src={url} alt="" style={{ width:'52px',height:'52px',objectFit:'cover',border:`1px solid ${t.border}`,borderRadius:'2px' }} />
              <button type="button" onClick={()=>remove(i)}
                style={{ position:'absolute',top:'-6px',right:'-6px',width:'18px',height:'18px',borderRadius:'50%',background:'#ef4444',border:'none',color:'#fff',fontSize:'10px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',lineHeight:1 }}>✕</button>
            </div>
          ))}
        </div>
      )}
      <label style={{ display:'flex',alignItems:'center',gap:'8px',border:`1px dashed ${t.border}`,borderRadius:'4px',padding:'10px 14px',cursor:'pointer',background:t.inputBg }}>
        <span style={{ fontSize:'18px' }}>{uploading ? '⏳' : '🖼'}</span>
        <span style={{ fontSize:'12px',color:t.sub,fontWeight:600 }}>
          {uploading ? 'Uploading…' : `Add images (${value.length}/8)`}
        </span>
        <input type="file" accept="image/*" multiple onChange={handleFiles} style={{ display:'none' }} disabled={uploading || value.length >= 8} />
      </label>
      {err && <p style={{ color:'#ef4444',fontSize:'11px',margin:'4px 0 0' }}>{err}</p>}
    </div>
  );
}

// ─── Enquiry Modal ────────────────────────────────────────────────────────────
function EnquiryModal({ professional, isDark, onClose }) {
  const t = th(isDark);
  const [form, setForm] = useState({ name:'', email:'', phone:'', message:'' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSend(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { setErr('Name, email and message are required.'); return; }
    setSending(true); setErr('');
    try {
      const res = await fetch('/api/professional-enquiries', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ professional_id: professional.id, enquirer_name: form.name, enquirer_email: form.email, enquirer_phone: form.phone, message: form.message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setSent(true);
    } catch (e) { setErr(e.message); }
    finally { setSending(false); }
  }

  const inp = { border:`1px solid ${t.border}`,borderRadius:'4px',padding:'10px 14px',background:t.inputBg,color:t.text,fontSize:'13px',outline:'none',width:'100%',boxSizing:'border-box',fontFamily:'inherit' };

  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',padding:'16px' }} onClick={onClose}>
      <div style={{ background:t.card,border:`1px solid ${t.border}`,borderRadius:'4px',width:'100%',maxWidth:'460px',padding:'32px',position:'relative',maxHeight:'90vh',overflowY:'auto' }} onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} style={{ position:'absolute',top:'12px',right:'12px',background:'none',border:`1px solid ${t.border}`,borderRadius:'2px',width:'28px',height:'28px',cursor:'pointer',color:t.sub,fontSize:'14px',display:'flex',alignItems:'center',justifyContent:'center' }}>✕</button>
        {sent ? (
          <div style={{ textAlign:'center',padding:'24px 0' }}>
            <div style={{ width:'56px',height:'56px',background:t.accent,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',fontSize:'24px',color:t.accentFg }}>✓</div>
            <h3 style={{ color:t.text,margin:'0 0 8px',fontSize:'18px',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.04em' }}>Enquiry Sent</h3>
            <p style={{ color:t.sub,fontSize:'13px',margin:'0 0 24px' }}>{professional.name} will reach out to you soon.</p>
            <button onClick={onClose} style={{ background:t.accent,color:t.accentFg,border:'none',borderRadius:'2px',padding:'10px 28px',cursor:'pointer',fontSize:'11px',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em' }}>Close</button>
          </div>
        ) : (
          <>
            <p style={{ color:t.accent,fontSize:'10px',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em',margin:'0 0 4px' }}>Contact Professional</p>
            <h3 style={{ color:t.text,margin:'0 0 20px',fontSize:'20px',fontWeight:800 }}>{professional.name}</h3>
            {err && <div style={{ background:isDark?'#2d1515':'#fee2e2',color:'#ef4444',padding:'8px 12px',borderRadius:'4px',fontSize:'12px',marginBottom:'12px' }}>{err}</div>}
            <form onSubmit={handleSend} style={{ display:'flex',flexDirection:'column',gap:'12px' }}>
              {[['name','Your Name','text'],['email','Your Email','email'],['phone','Phone (optional)','tel']].map(([k,ph,type])=>(
                <input key={k} type={type} placeholder={ph} value={form[k]} onChange={set(k)} style={inp} />
              ))}
              <textarea placeholder="Your message…" value={form.message} onChange={set('message')} rows={4} style={{...inp,resize:'vertical'}} />
              <button type="submit" disabled={sending}
                style={{ background:t.accent,color:t.accentFg,border:'none',borderRadius:'2px',padding:'12px',cursor:sending?'wait':'pointer',fontSize:'11px',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',opacity:sending?0.7:1 }}>
                {sending ? 'Sending…' : 'Send Enquiry'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Apply Modal ──────────────────────────────────────────────────────────────
function ApplyModal({ isDark, onClose }) {
  const t = th(isDark);
  const [form, setForm] = useState({
    name:'', title:'', category:'Interior Designer', experience:'',
    city:'', phone:'', email:'', description:'', certifications:'',
    specializations:'', website:'', instagram:'', linkedin:'',
  });
  const [profilePic, setProfilePic] = useState('');       // Cloudinary URL
  const [portfolioImgs, setPortfolioImgs] = useState([]); // Cloudinary URLs[]
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name||!form.title||!form.category||!form.email||!form.phone||!form.city||!form.description) {
      setErr('Please fill all required fields.'); return;
    }
    setSending(true); setErr('');
    try {
      const payload = {
        ...form,
        experience: parseInt(form.experience) || 0,
        profile_picture: profilePic || null,
        portfolio_images: portfolioImgs,
        specializations: form.specializations ? form.specializations.split(',').map(s=>s.trim()).filter(Boolean) : [],
      };
      const res = await fetch('/api/professional-services', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      setSent(true);
    } catch (e) { setErr(e.message); }
    finally { setSending(false); }
  }

  const inp = { border:`1px solid ${t.border}`,borderRadius:'4px',padding:'9px 12px',background:t.inputBg,color:t.text,fontSize:'13px',outline:'none',width:'100%',boxSizing:'border-box',fontFamily:'inherit' };
  const lbl = { fontSize:'10px',fontWeight:700,color:t.sub,textTransform:'uppercase',letterSpacing:'0.07em',display:'block',marginBottom:'4px' };

  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',zIndex:9999,display:'flex',alignItems:'flex-start',justifyContent:'center',padding:'24px 16px',overflowY:'auto' }} onClick={onClose}>
      <div style={{ background:t.card,border:`1px solid ${t.border}`,borderRadius:'4px',width:'100%',maxWidth:'620px',padding:'36px',position:'relative' }} onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} style={{ position:'absolute',top:'12px',right:'12px',background:'none',border:`1px solid ${t.border}`,borderRadius:'2px',width:'28px',height:'28px',cursor:'pointer',color:t.sub,fontSize:'14px',display:'flex',alignItems:'center',justifyContent:'center' }}>✕</button>

        {sent ? (
          <div style={{ textAlign:'center',padding:'40px 0' }}>
            <div style={{ width:'64px',height:'64px',background:t.accent,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',fontSize:'28px',color:t.accentFg }}>✓</div>
            <h3 style={{ color:t.text,margin:'0 0 10px',fontSize:'20px',fontWeight:800,textTransform:'uppercase' }}>Application Submitted</h3>
            <p style={{ color:t.sub,fontSize:'13px',maxWidth:'340px',margin:'0 auto 28px',lineHeight:'1.6' }}>Our team will review your profile and get back to you shortly.</p>
            <button onClick={onClose} style={{ background:t.accent,color:t.accentFg,border:'none',borderRadius:'2px',padding:'11px 32px',cursor:'pointer',fontSize:'11px',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em' }}>Done</button>
          </div>
        ) : (
          <>
            <p style={{ color:t.accent,fontSize:'10px',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em',margin:'0 0 6px' }}>Professional Network</p>
            <h2 style={{ color:t.text,margin:'0 0 4px',fontSize:'22px',fontWeight:800 }}>Apply as a Professional</h2>
            <p style={{ color:t.sub,fontSize:'13px',margin:'0 0 28px',lineHeight:'1.5' }}>Fill in the details. Our team will review and approve your profile.</p>
            {err && <div style={{ background:isDark?'#2d1515':'#fee2e2',color:'#ef4444',padding:'8px 12px',borderRadius:'4px',fontSize:'12px',marginBottom:'14px' }}>{err}</div>}

            <form onSubmit={handleSubmit}>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px' }}>
                <div><label style={lbl}>Full Name *</label><input style={inp} value={form.name} onChange={set('name')} placeholder="John Doe" /></div>
                <div><label style={lbl}>Professional Title *</label><input style={inp} value={form.title} onChange={set('title')} placeholder="Senior Interior Designer" /></div>
                <div>
                  <label style={lbl}>Category *</label>
                  <select style={inp} value={form.category} onChange={set('category')}>
                    {CATEGORIES.filter(c=>c!=='All').map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><label style={lbl}>Years of Experience *</label><input style={inp} type="number" min="0" value={form.experience} onChange={set('experience')} placeholder="5" /></div>
                <div><label style={lbl}>City *</label><input style={inp} value={form.city} onChange={set('city')} placeholder="Mumbai" /></div>
                <div><label style={lbl}>Phone *</label><input style={inp} value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" /></div>
                <div style={{ gridColumn:'span 2' }}><label style={lbl}>Email *</label><input style={inp} type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" /></div>
                <div style={{ gridColumn:'span 2' }}>
                  <label style={lbl}>Bio / Description *</label>
                  <textarea style={{...inp,resize:'vertical'}} rows={4} value={form.description} onChange={set('description')} placeholder="Describe your expertise, style and approach…" />
                </div>
                <div style={{ gridColumn:'span 2' }}><label style={lbl}>Specializations (comma-separated)</label><input style={inp} value={form.specializations} onChange={set('specializations')} placeholder="Residential Design, 3D Visualization…" /></div>
                <div style={{ gridColumn:'span 2' }}><label style={lbl}>Certifications</label><input style={inp} value={form.certifications} onChange={set('certifications')} placeholder="NCIDQ Certified, LEED AP…" /></div>

                {/* ── Cloudinary uploads ── */}
                <div style={{ gridColumn:'span 2' }}>
                  <SingleImageUpload label="Profile Photo" value={profilePic} onChange={setProfilePic} isDark={isDark} />
                </div>
                <div style={{ gridColumn:'span 2' }}>
                  <MultiImageUpload label="Portfolio Images (up to 8)" value={portfolioImgs} onChange={setPortfolioImgs} isDark={isDark} />
                </div>

                {/* ── Social links only ── */}
                <div style={{ gridColumn:'span 2',borderTop:`1px solid ${t.border}`,paddingTop:'14px',marginTop:'2px' }}>
                  <p style={{ color:t.muted,fontSize:'10px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',margin:'0 0 12px' }}>Social & Web Links</p>
                  <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px' }}>
                    <div><label style={lbl}>Website</label><input style={inp} value={form.website} onChange={set('website')} placeholder="https://yoursite.com" /></div>
                    <div><label style={lbl}>Instagram</label><input style={inp} value={form.instagram} onChange={set('instagram')} placeholder="@handle" /></div>
                    <div style={{ gridColumn:'span 2' }}><label style={lbl}>LinkedIn</label><input style={inp} value={form.linkedin} onChange={set('linkedin')} placeholder="https://linkedin.com/in/…" /></div>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={sending}
                style={{ marginTop:'24px',width:'100%',background:t.accent,color:t.accentFg,border:'none',borderRadius:'2px',padding:'13px',cursor:sending?'wait':'pointer',fontSize:'11px',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em',opacity:sending?0.7:1 }}>
                {sending ? 'Submitting…' : 'Submit Application →'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Profile Detail Modal ─────────────────────────────────────────────────────
function ProfileModal({ pro, isDark, onEnquire, onClose }) {
  const t = th(isDark);
  const specializations = Array.isArray(pro.specializations) ? pro.specializations :
    (typeof pro.specializations === 'string' ? JSON.parse(pro.specializations || '[]') : []);
  const portfolio = Array.isArray(pro.portfolio_images) ? pro.portfolio_images :
    (typeof pro.portfolio_images === 'string' ? JSON.parse(pro.portfolio_images || '[]') : []);

  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',zIndex:9998,display:'flex',alignItems:'flex-start',justifyContent:'center',padding:'24px 16px',overflowY:'auto' }} onClick={onClose}>
      <div style={{ background:t.card,border:`1px solid ${t.border}`,borderRadius:'4px',width:'100%',maxWidth:'640px',overflow:'hidden',position:'relative' }} onClick={e=>e.stopPropagation()}>
        {/* Header */}
        <div style={{ background:t.heroBg,padding:'32px',position:'relative',borderBottom:`2px solid ${t.accent}` }}>
          <button onClick={onClose} style={{ position:'absolute',top:'12px',right:'12px',background:'none',border:'1px solid rgba(255,255,255,0.2)',borderRadius:'2px',width:'28px',height:'28px',cursor:'pointer',color:'#fff',fontSize:'14px',display:'flex',alignItems:'center',justifyContent:'center' }}>✕</button>
          <div style={{ display:'flex',gap:'20px',alignItems:'flex-start' }}>
            {pro.profile_picture
              ? <img src={pro.profile_picture} alt={pro.name} style={{ width:'80px',height:'80px',borderRadius:'2px',objectFit:'cover',border:`2px solid ${t.accent}`,flexShrink:0 }} />
              : <div style={{ width:'80px',height:'80px',borderRadius:'2px',background:t.accent,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'28px',flexShrink:0,color:t.accentFg,fontWeight:800 }}>{pro.name?.[0]?.toUpperCase()}</div>
            }
            <div style={{ flex:1 }}>
              <p style={{ color:t.accent,fontSize:'10px',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em',margin:'0 0 4px' }}>{pro.category}</p>
              <h2 style={{ color:'#fff',margin:'0 0 4px',fontSize:'22px',fontWeight:800 }}>{pro.name}</h2>
              <p style={{ color:'rgba(255,255,255,0.6)',margin:'0 0 12px',fontSize:'14px' }}>{pro.title}</p>
              <div style={{ display:'flex',gap:'8px',flexWrap:'wrap' }}>
                <span style={{ background:'rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.75)',padding:'3px 10px',border:'1px solid rgba(255,255,255,0.12)',fontSize:'11px',fontWeight:600 }}>📍 {pro.city}</span>
                <span style={{ background:'rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.75)',padding:'3px 10px',border:'1px solid rgba(255,255,255,0.12)',fontSize:'11px',fontWeight:600 }}>⏱ {pro.experience} yrs exp</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding:'28px 32px' }}>
          <p style={{ color:t.accent,fontSize:'10px',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em',margin:'0 0 6px' }}>About</p>
          <p style={{ color:t.sub,fontSize:'14px',lineHeight:'1.7',margin:'0 0 24px' }}>{pro.description}</p>

          {specializations.length > 0 && (
            <>
              <p style={{ color:t.accent,fontSize:'10px',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em',margin:'0 0 10px' }}>Specializations</p>
              <div style={{ display:'flex',flexWrap:'wrap',gap:'8px',marginBottom:'24px' }}>
                {specializations.map((s,i)=>(
                  <span key={i} style={{ background:t.tagBg,color:t.text,border:`1px solid ${t.border}`,padding:'4px 12px',fontSize:'12px',fontWeight:600 }}>{s}</span>
                ))}
              </div>
            </>
          )}

          {pro.certifications && (
            <>
              <p style={{ color:t.accent,fontSize:'10px',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em',margin:'0 0 6px' }}>Certifications</p>
              <p style={{ color:t.sub,fontSize:'13px',margin:'0 0 24px' }}>{pro.certifications}</p>
            </>
          )}

          {portfolio.length > 0 && (
            <>
              <p style={{ color:t.accent,fontSize:'10px',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em',margin:'0 0 12px' }}>Portfolio</p>
              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:'8px',marginBottom:'24px' }}>
                {portfolio.map((url,i)=>(
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                    <img src={url} alt={`Portfolio ${i+1}`} style={{ width:'100%',aspectRatio:'1',objectFit:'cover',border:`1px solid ${t.border}` }} onError={e=>{e.target.style.display='none';}} />
                  </a>
                ))}
              </div>
            </>
          )}

          <div style={{ borderTop:`1px solid ${t.border}`,paddingTop:'18px',marginBottom:'24px',display:'flex',gap:'18px',flexWrap:'wrap' }}>
            {[
              pro.email    && { icon:'✉️', val:pro.email,    href:`mailto:${pro.email}` },
              pro.phone    && { icon:'📞', val:pro.phone,    href:`tel:${pro.phone}` },
              pro.website  && { icon:'🌐', val:'Website',    href:pro.website },
              pro.instagram && { icon:'📸', val:'Instagram', href:pro.instagram.startsWith('http')?pro.instagram:`https://instagram.com/${pro.instagram.replace('@','')}` },
              pro.linkedin  && { icon:'💼', val:'LinkedIn',  href:pro.linkedin },
            ].filter(Boolean).map((item,i)=>(
              <a key={i} href={item.href} target="_blank" rel="noopener noreferrer"
                style={{ color:t.accent,fontSize:'12px',textDecoration:'none',fontWeight:600,display:'flex',alignItems:'center',gap:'4px' }}>
                {item.icon} {item.val}
              </a>
            ))}
          </div>

          <button onClick={onEnquire}
            style={{ width:'100%',background:t.accent,color:t.accentFg,border:'none',borderRadius:'2px',padding:'13px',cursor:'pointer',fontSize:'11px',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em' }}>
            Send Enquiry →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Professional Card ────────────────────────────────────────────────────────
function ProCard({ pro, isDark, onClick }) {
  const t = th(isDark);
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:hov?t.cardHov:t.card,border:`1px solid ${hov?t.borderHov:t.border}`,cursor:'pointer',overflow:'hidden',
               transition:'transform 0.18s,border-color 0.18s,box-shadow 0.18s',
               transform:hov?'translateY(-3px)':'none',
               boxShadow:hov?(isDark?'0 8px 24px color-mix(in srgb, var(--brand-blue) 12%, transparent)':'0 8px 24px rgba(0,0,0,0.12)'):'none' }}>
      <div style={{ height:'200px',position:'relative',overflow:'hidden',background:isDark?'#1a1a1a':'#f3f4f6' }}>
        {pro.profile_picture
          ? <img src={pro.profile_picture} alt={pro.name} style={{ width:'100%',height:'100%',objectFit:'cover' }} />
          : <div style={{ width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'52px',color:isDark?'#333':'#d1d5db' }}>👤</div>
        }
        <div style={{ position:'absolute',bottom:0,left:0,right:0,background:'linear-gradient(transparent,rgba(0,0,0,0.75))',padding:'20px 12px 10px' }}>
          <span style={{ color:t.accent,fontSize:'9px',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em' }}>{pro.category}</span>
        </div>
      </div>
      <div style={{ padding:'16px',borderTop:`1px solid ${t.border}` }}>
        <h3 style={{ color:t.text,margin:'0 0 2px',fontSize:'15px',fontWeight:800 }}>{pro.name}</h3>
        <p style={{ color:t.accent,margin:'0 0 10px',fontSize:'12px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.04em' }}>{pro.title}</p>
        <div style={{ display:'flex',gap:'12px',fontSize:'11px',color:t.sub,fontWeight:600 }}>
          <span>⏱ {pro.experience} yr{pro.experience!==1?'s':''}</span>
          <span>📍 {pro.city}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProfessionalsPage() {
  const isDark = useDark();
  const t = th(isDark);
  const router = useRouter();
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [enquirePro, setEnquirePro] = useState(null);
  const [showApply, setShowApply] = useState(false);

  useEffect(() => {
    fetch('/api/professional-services')
      .then(r=>r.json())
      .then(d=>{ if (d.success) setProfessionals(d.data); })
      .catch(console.error)
      .finally(()=>setLoading(false));
  }, []);

  const filtered = professionals.filter(p => {
    const matchCat = category === 'All' || p.category === category;
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.title?.toLowerCase().includes(q) || p.city?.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div style={{ minHeight:'100vh',background:t.pageBg,fontFamily:'Inter,system-ui,sans-serif',color:t.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .pro-search:focus { border-color: ${t.accent} !important; }
        .pro-search::placeholder { color: ${t.muted}; }
        .cat-chip:hover { border-color: ${t.accent} !important; color: ${t.accent} !important; }
      `}</style>

      {/* Hero */}
      <div style={{ background:t.heroBg,padding:'72px 24px 80px',textAlign:'center',position:'relative',overflow:'hidden',borderBottom:`2px solid ${t.accent}` }}>
        <div style={{ position:'absolute',inset:0,backgroundImage:`linear-gradient(${isDark?'color-mix(in srgb, var(--brand-blue) 3%, transparent)':'rgba(255,255,255,0.03)'} 1px,transparent 1px),linear-gradient(90deg,${isDark?'color-mix(in srgb, var(--brand-blue) 3%, transparent)':'rgba(255,255,255,0.03)'} 1px,transparent 1px)`,backgroundSize:'40px 40px',pointerEvents:'none' }} />
        <p style={{ color:t.accent,fontSize:'10px',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.15em',margin:'0 0 14px' }}>MTbossProfessional Services</p>
        <h1 style={{ color:'#fff',fontSize:'clamp(28px,5vw,52px)',fontWeight:800,margin:'0 0 16px',lineHeight:1.1,textTransform:'uppercase',letterSpacing:'-0.02em' }}>Meet Our Professionals</h1>
        <p style={{ color:'rgba(255,255,255,0.55)',fontSize:'15px',maxWidth:'480px',margin:'0 auto 40px',lineHeight:1.7 }}>
          Verified interior designers, architects and home experts — handpicked for quality and excellence.
        </p>
        <button onClick={()=>setShowApply(true)}
          style={{ background:t.accent,color:t.accentFg,border:'none',borderRadius:'2px',padding:'14px 36px',cursor:'pointer',fontSize:'11px',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.12em',boxShadow:isDark?'0 0 24px color-mix(in srgb, var(--brand-blue) 30%, transparent)':'0 4px 16px rgba(0,0,0,0.25)' }}>
          Apply as a Professional →
        </button>
      </div>

      {/* Filters */}
      <div style={{ maxWidth:'1200px',margin:'0 auto',padding:'36px 24px 0' }}>
        <div style={{ position:'relative',marginBottom:'20px' }}>
          <span style={{ position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',color:t.muted,fontSize:'14px' }}>🔍</span>
          <input className="pro-search" value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search by name, title or city…"
            style={{ width:'100%',boxSizing:'border-box',border:`1px solid ${t.border}`,borderRadius:'4px',padding:'11px 14px 11px 40px',background:t.inputBg,color:t.text,fontSize:'13px',outline:'none',transition:'border-color 0.15s' }} />
        </div>

        <div style={{ display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'36px' }}>
          {CATEGORIES.map(cat=>{
            const active = category===cat;
            return (
              <button key={cat} className="cat-chip" onClick={()=>setCategory(cat)}
                style={{ padding:'6px 16px',border:`1px solid ${active?t.accent:t.border}`,borderRadius:'2px',cursor:'pointer',fontSize:'11px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',background:active?t.accent:'transparent',color:active?t.accentFg:t.sub,transition:'all 0.15s' }}>
                {cat}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div style={{ textAlign:'center',padding:'80px 0',color:t.sub }}>
            <div style={{ width:'32px',height:'32px',border:`2px solid ${t.border}`,borderTopColor:t.accent,borderRadius:'50%',margin:'0 auto 16px',animation:'spin 0.8s linear infinite' }} />
            <p style={{ fontSize:'13px',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em' }}>Loading professionals…</p>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:'center',padding:'80px 0',border:`1px solid ${t.border}`,borderRadius:'4px' }}>
            <div style={{ fontSize:'40px',marginBottom:'16px' }}>🔍</div>
            <p style={{ color:t.text,fontSize:'15px',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.05em',margin:'0 0 8px' }}>No professionals found</p>
            <p style={{ color:t.sub,fontSize:'13px' }}>Try a different category or search term.</p>
          </div>
        ) : (
          <>
            <p style={{ color:t.muted,fontSize:'11px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'20px' }}>
              {filtered.length} professional{filtered.length!==1?'s':''} found
            </p>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))',gap:'16px' }}>
              {filtered.map(pro=>(
                <ProCard key={pro.id} pro={pro} isDark={isDark} onClick={()=>router.push(`/Services/professionals/${pro.id}`)} />
              ))}
            </div>
          </>
        )}

        <div style={{ textAlign:'center',padding:'72px 0 56px',borderTop:`1px solid ${t.border}`,marginTop:'56px' }}>
          <p style={{ color:t.accent,fontSize:'10px',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'12px' }}>Join our network</p>
          <h3 style={{ color:t.text,fontSize:'22px',fontWeight:800,margin:'0 0 8px' }}>Are you a home design professional?</h3>
          <p style={{ color:t.sub,fontSize:'13px',marginBottom:'24px',lineHeight:1.6 }}>List your services and get discovered by thousands of homeowners.</p>
          <button onClick={()=>setShowApply(true)}
            style={{ background:t.accent,color:t.accentFg,border:'none',borderRadius:'2px',padding:'12px 32px',cursor:'pointer',fontSize:'11px',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em' }}>
            Apply Now →
          </button>
        </div>
      </div>

      {enquirePro && <EnquiryModal professional={enquirePro} isDark={isDark} onClose={()=>setEnquirePro(null)} />}
      {showApply   && <ApplyModal isDark={isDark} onClose={()=>setShowApply(false)} />}
    </div>
  );
}
