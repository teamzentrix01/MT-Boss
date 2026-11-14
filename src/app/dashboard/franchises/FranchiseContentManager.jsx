'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, CheckCircle2 } from '@/app/components/ui/icons';

export default function FranchiseContentManager() {
  const [activeSection, setActiveSection] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState({ type: '', text: '' });

  const [heroData, setHeroData] = useState({
    tagline: 'MTBOSS Construction',
    title: 'Franchise',
    highlightTitle: 'Opportunity',
    subtitle: "Partner with India's trusted construction brand. Build a profitable business with MTBOSS's proven model, technical expertise, and 20+ years of legacy.",
    backgroundImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80',
    stats: [
      { value: '50+', label: 'Cities' },
      { value: '20+', label: 'Years Legacy' },
      { value: '500+', label: 'Projects Done' },
      { value: '3', label: 'Franchise Models' },
    ],
  });

  const [benefitsData, setBenefitsData] = useState([]);
  const [processData, setProcessData] = useState([]);

  const token = () => localStorage.getItem('token') || localStorage.getItem('admin-token');

  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/franchise/content', {
        headers: { Authorization: `Bearer ${token()}` },
        cache: 'no-store',
      });
      const data = await res.json();
      if (data.success && data.data) {
        if (data.data.hero) setHeroData(data.data.hero);
        if (Array.isArray(data.data.benefits)) setBenefitsData(data.data.benefits);
        if (Array.isArray(data.data.process)) setProcessData(data.data.process);
      }
    } catch {
      setNotice({ type: 'error', text: 'Could not load page content' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const saveSection = async (sectionName, payload) => {
    setSaving(true);
    setNotice({ type: '', text: '' });
    try {
      const res = await fetch('/api/admin/franchise/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify({ section: sectionName, data: payload }),
      });
      const data = await res.json();
      if (data.success) {
        setNotice({ type: 'success', text: `${sectionName.toUpperCase()} section updated successfully!` });
      } else {
        setNotice({ type: 'error', text: data.error || 'Failed to save changes' });
      }
    } catch {
      setNotice({ type: 'error', text: 'Network error saving changes' });
    } finally {
      setSaving(false);
    }
  };

  const updateStat = (index, field, val) => {
    const updated = [...(heroData.stats || [])];
    updated[index] = { ...updated[index], [field]: val };
    setHeroData({ ...heroData, stats: updated });
  };

  const addBenefit = () => {
    setBenefitsData([
      ...benefitsData,
      { icon: '✨', title: 'New Benefit Title', desc: 'Add detailed description of this advantage.' },
    ]);
  };

  const updateBenefit = (index, field, val) => {
    const updated = [...benefitsData];
    updated[index] = { ...updated[index], [field]: val };
    setBenefitsData(updated);
  };

  const removeBenefit = (index) => {
    setBenefitsData(benefitsData.filter((_, i) => i !== index));
  };

  const addProcessStep = () => {
    const nextNum = String(processData.length + 1).padStart(2, '0');
    setProcessData([
      ...processData,
      { step: nextNum, title: 'New Process Step', desc: 'Describe this onboarding step.' },
    ]);
  };

  const updateProcessStep = (index, field, val) => {
    const updated = [...processData];
    updated[index] = { ...updated[index], [field]: val };
    setProcessData(updated);
  };

  const removeProcessStep = (index) => {
    setProcessData(processData.filter((_, i) => i !== index));
  };

  return (
    <div>
      <style>{`
        .fc-nav {
          display: flex; gap: 0.5rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border);
          padding-bottom: 0.75rem; overflow-x: auto; -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .fc-nav::-webkit-scrollbar { display: none; }
        .fc-nav-btn {
          padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.8rem; font-weight: 700;
          border: 1px solid var(--border); background: var(--surface); color: var(--muted);
          cursor: pointer; transition: all .15s; white-space: nowrap; flex-shrink: 0; min-height: 40px;
        }
        .fc-nav-btn.active {
          background: var(--text); color: var(--surface); border-color: var(--text);
        }
        .fc-form-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
        }
        @media(max-width:768px){
          .fc-form-grid { grid-template-columns: 1fr; gap: 0.75rem; }
        }
        .fc-stats-grid {
          display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.75rem;
        }
        @media(max-width:1024px){
          .fc-stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media(max-width:480px){
          .fc-stats-grid { grid-template-columns: 1fr; }
        }
        .fc-cards-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem; margin-bottom: 1.5rem;
        }
        @media(max-width:1024px){
          .fc-cards-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media(max-width:640px){
          .fc-cards-grid { grid-template-columns: 1fr; }
        }
        .fc-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;
        }
        .fc-section-title { font-size: 0.95rem; font-weight: 800; color: var(--text); margin-bottom: 0.35rem; }
        .fc-section-sub { font-size: 0.75rem; color: var(--muted); margin-bottom: 1.25rem; }
        .fc-label { display: block; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: var(--muted); margin-bottom: 0.3rem; }
        .fc-input {
          width: 100%; padding: 0.55rem 0.75rem; border-radius: 6px; border: 1px solid var(--border);
          background: var(--bg); color: var(--text); font-size: 0.82rem; margin-bottom: 0.85rem;
        }
        .fc-save-bar {
          display: flex; justify-content: flex-end; padding-top: 1rem; border-top: 1px solid var(--border);
        }
        .fc-save-btn {
          padding: 0.6rem 1.5rem; border-radius: 6px; border: none; background: var(--accent);
          color: #fff; font-size: 0.82rem; font-weight: 700; cursor: pointer;
        }
      `}</style>

      {notice.text && (
        <div style={{
          padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600,
          marginBottom: '1rem',
          background: notice.type === 'error' ? '#fff1f2' : '#f0fdf4',
          color: notice.type === 'error' ? '#9f1239' : '#166534',
          border: `1px solid ${notice.type === 'error' ? '#fecdd3' : '#bbf7d0'}`,
        }}>
          {notice.text}
        </div>
      )}

      {/* Sub-nav */}
      <div className="fc-nav">
        <button
          className={`fc-nav-btn ${activeSection === 'hero' ? 'active' : ''}`}
          onClick={() => setActiveSection('hero')}
        >
          Hero Banner & Live Stats
        </button>
        <button
          className={`fc-nav-btn ${activeSection === 'benefits' ? 'active' : ''}`}
          onClick={() => setActiveSection('benefits')}
        >
          Benefits Cards ({benefitsData.length})
        </button>
        <button
          className={`fc-nav-btn ${activeSection === 'process' ? 'active' : ''}`}
          onClick={() => setActiveSection('process')}
        >
          How It Works Steps ({processData.length})
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem' }}>
          Loading section content...
        </div>
      ) : activeSection === 'hero' ? (
        <div className="fc-card">
          <div className="fc-section-title">Hero Section & Key Counters</div>
          <div className="fc-section-sub">
            Customize the main banner text and live statistics displayed at the top of the franchise page.
          </div>

          <div className="fc-form-grid">
            <div>
              <label className="fc-label">Tagline (Small Top Badge)</label>
              <input
                className="fc-input"
                value={heroData.tagline || ''}
                onChange={e => setHeroData({ ...heroData, tagline: e.target.value })}
                placeholder="MTBOSS Construction"
              />
            </div>
            <div>
              <label className="fc-label">Background Image URL</label>
              <input
                className="fc-input"
                value={heroData.backgroundImage || ''}
                onChange={e => setHeroData({ ...heroData, backgroundImage: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="fc-form-grid">
            <div>
              <label className="fc-label">Main Heading (Line 1)</label>
              <input
                className="fc-input"
                value={heroData.title || ''}
                onChange={e => setHeroData({ ...heroData, title: e.target.value })}
                placeholder="Franchise"
              />
            </div>
            <div>
              <label className="fc-label">Highlighted Heading (Line 2)</label>
              <input
                className="fc-input"
                value={heroData.highlightTitle || ''}
                onChange={e => setHeroData({ ...heroData, highlightTitle: e.target.value })}
                placeholder="Opportunity"
              />
            </div>
          </div>

          <div>
            <label className="fc-label">Hero Subtitle / Description</label>
            <textarea
              rows={3}
              className="fc-input"
              value={heroData.subtitle || ''}
              onChange={e => setHeroData({ ...heroData, subtitle: e.target.value })}
              placeholder="Partner with India's trusted construction brand..."
            />
          </div>

          <div style={{ marginTop: '1.25rem', marginBottom: '1.5rem' }}>
            <div className="fc-section-title" style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              4 Key Statistics Counters:
            </div>
            <div className="fc-stats-grid">
              {(heroData.stats || []).map((s, idx) => (
                <div key={idx} style={{ padding: '0.75rem', background: 'var(--bg)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                  <label className="fc-label">Value</label>
                  <input
                    type="text"
                    value={s.value || ''}
                    onChange={e => updateStat(idx, 'value', e.target.value)}
                    style={{ width: '100%', padding: '0.35rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}
                  />
                  <label className="fc-label">Label</label>
                  <input
                    type="text"
                    value={s.label || ''}
                    onChange={e => updateStat(idx, 'label', e.target.value)}
                    style={{ width: '100%', padding: '0.35rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.75rem' }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="fc-save-bar">
            <button
              type="button"
              disabled={saving}
              className="fc-save-btn"
              onClick={() => saveSection('hero', heroData)}
            >
              {saving ? 'Saving...' : 'Save Hero & Stats'}
            </button>
          </div>
        </div>
      ) : activeSection === 'benefits' ? (
        <div className="fc-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <div className="fc-section-title">Franchise Benefits Cards</div>
              <div className="fc-section-sub">
                Cards displayed under &quot;Why Partner With Us&quot; on the public franchise page.
              </div>
            </div>
            <button
              type="button"
              onClick={addBenefit}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.45rem 0.85rem', borderRadius: '6px', background: 'var(--accent)', color: '#fff', border: 'none', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
            >
              <Plus size={14} /> Add Benefit Card
            </button>
          </div>

          <div className="fc-cards-grid">
            {benefitsData.map((b, idx) => (
              <div key={idx} style={{ padding: '1rem', background: 'var(--bg)', borderRadius: '6px', border: '1px solid var(--border)', position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => removeBenefit(idx)}
                  title="Remove card"
                  style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                >
                  <Trash2 size={13} />
                </button>

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ width: '70px' }}>
                    <label className="fc-label">Icon / Emoji</label>
                    <input
                      type="text"
                      value={b.icon || '🏆'}
                      onChange={e => updateBenefit(idx, 'icon', e.target.value)}
                      style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: '1.1rem', textAlign: 'center' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="fc-label">Title</label>
                    <input
                      type="text"
                      value={b.title || ''}
                      onChange={e => updateBenefit(idx, 'title', e.target.value)}
                      style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontWeight: 700, fontSize: '0.8rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="fc-label">Description</label>
                  <textarea
                    rows={2}
                    value={b.desc || ''}
                    onChange={e => updateBenefit(idx, 'desc', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.75rem', lineHeight: 1.4 }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="fc-save-bar">
            <button
              type="button"
              disabled={saving}
              className="fc-save-btn"
              onClick={() => saveSection('benefits', benefitsData)}
            >
              {saving ? 'Saving...' : 'Save Benefits Cards'}
            </button>
          </div>
        </div>
      ) : (
        <div className="fc-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <div className="fc-section-title">How It Works (Process Steps)</div>
              <div className="fc-section-sub">
                Step-by-step onboarding guide shown under &quot;Simple Steps&quot; on the public site.
              </div>
            </div>
            <button
              type="button"
              onClick={addProcessStep}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.45rem 0.85rem', borderRadius: '6px', background: 'var(--accent)', color: '#fff', border: 'none', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
            >
              <Plus size={14} /> Add Step
            </button>
          </div>

          <div className="fc-cards-grid">
            {processData.map((p, idx) => (
              <div key={idx} style={{ padding: '1rem', background: 'var(--bg)', borderRadius: '6px', border: '1px solid var(--border)', position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => removeProcessStep(idx)}
                  title="Remove step"
                  style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                >
                  <Trash2 size={13} />
                </button>

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ width: '60px' }}>
                    <label className="fc-label">Step No.</label>
                    <input
                      type="text"
                      value={p.step || ''}
                      onChange={e => updateProcessStep(idx, 'step', e.target.value)}
                      style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontWeight: 800, textAlign: 'center', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="fc-label">Step Title</label>
                    <input
                      type="text"
                      value={p.title || ''}
                      onChange={e => updateProcessStep(idx, 'title', e.target.value)}
                      style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontWeight: 700, fontSize: '0.8rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="fc-label">Description</label>
                  <textarea
                    rows={2}
                    value={p.desc || ''}
                    onChange={e => updateProcessStep(idx, 'desc', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.75rem', lineHeight: 1.4 }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="fc-save-bar">
            <button
              type="button"
              disabled={saving}
              className="fc-save-btn"
              onClick={() => saveSection('process', processData)}
            >
              {saving ? 'Saving...' : 'Save Process Steps'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

