'use client';

import { useEffect, useMemo, useState } from 'react';

const EMPTY_JOB = {
  title: '',
  department: '',
  location: '',
  type: 'Full Time',
  experience: '',
  salary: '',
  description: '',
  responsibilities: '',
  requirements: '',
  skills: '',
  urgent: false,
  status: 'active',
};

const DEPARTMENTS = ['Engineering', 'Management', 'Design', 'Human Resources', 'Sales', 'Operations', 'Finance'];
const TYPES = ['Full Time', 'Part Time', 'Contract', 'Internship', 'Remote'];

function listToText(value) {
  return Array.isArray(value) ? value.join('\n') : value || '';
}

function textToList(value) {
  return value
    .split('\n')
    .map(item => item.trim())
    .filter(Boolean);
}

function th(dark) {
  return {
    bg: dark ? '#000000' : '#f8f9fa',
    card: dark ? '#111111' : '#ffffff',
    text: dark ? '#ffffff' : '#111827',
    sub: dark ? '#a1a1aa' : '#6b7280',
    muted: dark ? '#71717a' : '#9ca3af',
    border: dark ? '#27272a' : '#e5e7eb',
    input: dark ? '#0a0a0a' : '#f9fafb',
    accent: dark ? '#facc15' : '#111827',
    accentFg: dark ? '#000000' : '#ffffff',
  };
}

export default function JobsManager({ isDarkMode }) {
  const t = th(isDarkMode);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_JOB);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/jobs?status=all');
      const data = await res.json();
      if (data.success) setJobs(data.data);
    } catch (error) {
      console.error('Jobs load failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const stats = useMemo(() => ([
    { label: 'Total Jobs', value: jobs.length },
    { label: 'Active', value: jobs.filter(job => job.status === 'active').length },
    { label: 'Draft', value: jobs.filter(job => job.status === 'draft').length },
    { label: 'Urgent', value: jobs.filter(job => job.urgent).length },
  ]), [jobs]);

  const openAdd = () => {
    setForm(EMPTY_JOB);
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (job) => {
    setForm({
      title: job.title || '',
      department: job.department || '',
      location: job.location || '',
      type: job.type || 'Full Time',
      experience: job.experience || '',
      salary: job.salary || '',
      description: job.description || '',
      responsibilities: listToText(job.responsibilities),
      requirements: listToText(job.requirements),
      skills: listToText(job.skills),
      urgent: Boolean(job.urgent),
      status: job.status || 'active',
    });
    setEditing(job);
    setShowForm(true);
  };

  const payload = () => ({
    ...form,
    responsibilities: textToList(form.responsibilities),
    requirements: textToList(form.requirements),
    skills: form.skills.split(',').map(item => item.trim()).filter(Boolean),
  });

  const handleSave = async () => {
    if (!form.title || !form.department || !form.location || !form.experience || !form.description) {
      alert('Title, department, location, experience, and description are required.');
      return;
    }

    setSaving(true);
    try {
      const method = editing ? 'PATCH' : 'POST';
      const body = editing ? { ...payload(), id: editing.id } : payload();
      const res = await fetch('/api/jobs', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.error || 'Save failed.');
        return;
      }

      if (editing) {
        setJobs(prev => prev.map(job => job.id === editing.id ? data.data : job));
      } else {
        setJobs(prev => [data.data, ...prev]);
      }
      setShowForm(false);
    } catch (error) {
      console.error('Job save failed:', error);
      alert('Server error.');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (job) => {
    const nextStatus = job.status === 'active' ? 'draft' : 'active';
    const res = await fetch('/api/jobs', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...job, status: nextStatus }),
    });
    const data = await res.json();
    if (data.success) setJobs(prev => prev.map(item => item.id === job.id ? data.data : item));
  };

  const handleDelete = async (job) => {
    if (!confirm(`Delete "${job.title}"?`)) return;
    const res = await fetch('/api/jobs', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: job.id }),
    });
    const data = await res.json();
    if (data.success) setJobs(prev => prev.filter(item => item.id !== job.id));
  };

  const fieldStyle = {
    width: '100%',
    boxSizing: 'border-box',
    background: t.input,
    color: t.text,
    border: `1px solid ${t.border}`,
    borderRadius: '4px',
    padding: '10px 12px',
    fontSize: '13px',
    outline: 'none',
  };

  const labelStyle = {
    display: 'block',
    color: t.sub,
    fontSize: '10px',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '6px',
  };

  return (
    <div style={{ background: t.bg, minHeight: '100vh', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div>
          <p style={{ color: t.accent, fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>Open Positions</p>
          <h2 style={{ color: t.text, margin: '0 0 4px', fontSize: '20px', fontWeight: 800, textTransform: 'uppercase' }}>New Jobs</h2>
          <p style={{ color: t.sub, margin: 0, fontSize: '12px' }}>Add and manage job postings shown on the Careers page.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={loadJobs} style={{ background: 'none', border: `1px solid ${t.border}`, borderRadius: '4px', padding: '8px 14px', color: t.sub, cursor: 'pointer', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>
            Refresh
          </button>
          <button onClick={openAdd} style={{ background: t.accent, color: t.accentFg, border: 'none', borderRadius: '4px', padding: '8px 18px', cursor: 'pointer', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>
            + Add Job
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '20px' }}>
        {stats.map(item => (
          <div key={item.label} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '6px', padding: '16px' }}>
            <div style={{ color: t.text, fontSize: '24px', fontWeight: 800 }}>{item.value}</div>
            <div style={{ color: t.sub, fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.label}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: t.sub, fontSize: '12px', fontWeight: 700 }}>Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', border: `1px solid ${t.border}`, borderRadius: '6px', color: t.sub }}>
          <p style={{ margin: '0 0 16px', color: t.text, fontSize: '14px', fontWeight: 800 }}>No job postings yet.</p>
          <button onClick={openAdd} style={{ background: t.accent, color: t.accentFg, border: 'none', borderRadius: '4px', padding: '10px 18px', cursor: 'pointer', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>Add First Job</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
          {jobs.map(job => (
            <div key={job.id} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '6px', padding: '16px', opacity: job.status === 'draft' ? 0.66 : 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '10px' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: t.text, fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</div>
                  <div style={{ color: t.sub, fontSize: '11px', marginTop: '3px' }}>{job.department} · {job.location}</div>
                </div>
                {job.urgent && <span style={{ alignSelf: 'flex-start', background: '#fee2e2', color: '#dc2626', borderRadius: '999px', padding: '3px 8px', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase' }}>Urgent</span>}
              </div>
              <div style={{ color: t.muted, fontSize: '12px', lineHeight: 1.5, minHeight: '36px', marginBottom: '12px' }}>
                {job.experience} · {job.type} · {job.salary || 'Salary not listed'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${t.border}`, paddingTop: '12px', gap: '8px' }}>
                <button onClick={() => toggleStatus(job)} style={{ background: job.status === 'active' ? '#dcfce7' : '#ffedd5', color: job.status === 'active' ? '#166534' : '#9a3412', border: 'none', borderRadius: '999px', padding: '4px 10px', cursor: 'pointer', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}>
                  {job.status === 'active' ? 'Active' : 'Draft'}
                </button>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => openEdit(job)} style={{ background: 'none', border: `1px solid ${t.border}`, color: t.sub, borderRadius: '4px', padding: '6px 10px', cursor: 'pointer', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}>Edit</button>
                  <button onClick={() => handleDelete(job)} style={{ background: 'none', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '4px', padding: '6px 10px', cursor: 'pointer', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div onClick={() => setShowForm(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '6px', width: '100%', maxWidth: '760px', maxHeight: '92vh', overflowY: 'auto' }}>
            <div style={{ position: 'sticky', top: 0, zIndex: 1, background: t.card, borderBottom: `1px solid ${t.border}`, padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: t.text, fontSize: '16px', fontWeight: 800, margin: 0 }}>{editing ? 'Edit Job Posting' : 'Add New Job Posting'}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: `1px solid ${t.border}`, color: t.sub, borderRadius: '4px', width: '30px', height: '30px', cursor: 'pointer' }}>x</button>
            </div>

            <div style={{ padding: '22px', display: 'grid', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Job Title *</label>
                  <input style={fieldStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Senior Civil Engineer" />
                </div>
                <div>
                  <label style={labelStyle}>Department *</label>
                  <input list="job-departments" style={fieldStyle} value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} placeholder="Engineering" />
                  <datalist id="job-departments">{DEPARTMENTS.map(item => <option key={item} value={item} />)}</datalist>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Location *</label>
                  <input style={fieldStyle} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Delhi, IN" />
                </div>
                <div>
                  <label style={labelStyle}>Job Type</label>
                  <select style={fieldStyle} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                    {TYPES.map(item => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Experience *</label>
                  <input style={fieldStyle} value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} placeholder="5-8 Years" />
                </div>
                <div>
                  <label style={labelStyle}>Salary</label>
                  <input style={fieldStyle} value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} placeholder="12-18 LPA" />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Description *</label>
                <textarea style={{ ...fieldStyle, minHeight: '92px', resize: 'vertical', lineHeight: 1.6 }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short role overview shown on the job detail page." />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Responsibilities</label>
                  <textarea style={{ ...fieldStyle, minHeight: '130px', resize: 'vertical', lineHeight: 1.6 }} value={form.responsibilities} onChange={e => setForm(f => ({ ...f, responsibilities: e.target.value }))} placeholder="One responsibility per line" />
                </div>
                <div>
                  <label style={labelStyle}>Requirements</label>
                  <textarea style={{ ...fieldStyle, minHeight: '130px', resize: 'vertical', lineHeight: 1.6 }} value={form.requirements} onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))} placeholder="One requirement per line" />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Skills</label>
                <input style={fieldStyle} value={form.skills} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))} placeholder="AutoCAD, STAAD Pro, Site Management" />
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <label style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', color: t.text, fontSize: '12px', fontWeight: 700 }}>
                  <input type="checkbox" checked={form.urgent} onChange={e => setForm(f => ({ ...f, urgent: e.target.checked }))} />
                  Mark as urgent
                </label>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select style={{ ...fieldStyle, minWidth: '150px' }} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ position: 'sticky', bottom: 0, background: t.card, borderTop: `1px solid ${t.border}`, padding: '16px 22px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: `1px solid ${t.border}`, color: t.sub, borderRadius: '4px', padding: '10px 16px', cursor: 'pointer', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ background: t.accent, color: t.accentFg, border: 'none', borderRadius: '4px', padding: '10px 18px', cursor: saving ? 'default' : 'pointer', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', opacity: saving ? 0.65 : 1 }}>
                {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Job'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
