'use client';

import { useState, useEffect } from 'react';

const STATUS_OPTIONS = ['Pending', 'Reviewing', 'Approved', 'Rejected'];

const statusStyle = {
  Pending:   { bg: '#fff7ed', tx: '#9a3412' },
  Reviewing: { bg: '#eff4ff', tx: '#1e3a8a' },
  Approved:  { bg: '#f0fdf4', tx: '#14532d' },
  Rejected:  { bg: '#fff1f2', tx: '#9f1239' },
};

const modelStyle = {
  'Associate Partner':  { bg: '#eff4ff', tx: '#1e3a8a' },
  'Regional Franchise': { bg: '#fefce8', tx: '#854d0e' },
  'Master Franchise':   { bg: '#faf5ff', tx: '#581c87' },
};

const Field = ({ label, value }) => (
  <div>
    <div style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)', marginBottom: '0.2rem' }}>{label}</div>
    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text)' }}>{value || '—'}</div>
  </div>
);

export default function FranchisesPage() {
  const [franchises, setFranchises] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState(null);
  const [search, setSearch]         = useState('');
  const [filter, setFilter]         = useState('All');
  const [modelFilter, setModelFilter] = useState('All');
  const [updating, setUpdating]     = useState(false);
  const [section, setSection]       = useState('personal');

  useEffect(() => { fetchFranchises(); }, []);

  const fetchFranchises = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/franchises', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setFranchises(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setUpdating(true);
    try {
      const res = await fetch('/api/franchises', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        setFranchises(prev => prev.map(f => f.id === id ? { ...f, status } : f));
        if (selected?.id === id) setSelected({ ...selected, status });
      }
    } finally {
      setUpdating(false);
    }
  };

  const models = ['All', 'Associate Partner', 'Regional Franchise', 'Master Franchise'];

  const filtered = franchises.filter(f => {
    const matchSearch =
      f.name?.toLowerCase().includes(search.toLowerCase()) ||
      f.email?.toLowerCase().includes(search.toLowerCase()) ||
      f.city?.toLowerCase().includes(search.toLowerCase()) ||
      f.territory?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filter === 'All' || f.status === filter;
    const matchModel  = modelFilter === 'All' || f.model === modelFilter;
    return matchSearch && matchStatus && matchModel;
  });

  const counts = {
    All:       franchises.length,
    Pending:   franchises.filter(f => f.status === 'Pending').length,
    Reviewing: franchises.filter(f => f.status === 'Reviewing').length,
    Approved:  franchises.filter(f => f.status === 'Approved').length,
    Rejected:  franchises.filter(f => f.status === 'Rejected').length,
  };

  const modalSections = [
    { id: 'personal',  label: 'Personal' },
    { id: 'address',   label: 'Address' },
    { id: 'business',  label: 'Business' },
    { id: 'banking',   label: 'Banking' },
    { id: 'franchise', label: 'Franchise' },
    { id: 'office',    label: 'Office' },
  ];

  return (
    <>
      <style>{`
        .fr-wrap { padding: 1.25rem 0; }

        .fr-toolbar {
          display: flex; align-items: center;
          justify-content: space-between;
          flex-wrap: wrap; gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .fr-title { font-size: 0.875rem; font-weight: 700; color: var(--text); }
        .fr-search {
          padding: 0.35rem 0.75rem;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: var(--surface); color: var(--text);
          font-size: 0.8125rem; outline: none; width: 200px;
          transition: border-color .15s;
        }
        .fr-search:focus { border-color: var(--accent); }
        .fr-search::placeholder { color: var(--muted); }

        .fr-stats {
          display: grid; grid-template-columns: repeat(4,1fr);
          gap: 0.75rem; margin-bottom: 1rem;
        }
        @media(max-width:640px){ .fr-stats { grid-template-columns: 1fr 1fr; } }
        .fr-stat {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px; padding: 0.875rem 1rem;
        }
        .fr-stat-label {
          font-size: 0.6875rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: .06em;
          color: var(--muted); margin-bottom: 0.25rem;
        }
        .fr-stat-value { font-size: 1.5rem; font-weight: 700; color: var(--text); }

        .fr-filters {
          display: flex; gap: 0.375rem;
          flex-wrap: wrap; margin-bottom: 0.5rem;
        }
        .fr-filter-btn {
          padding: 0.3rem 0.75rem;
          border: 1px solid var(--border); border-radius: 20px;
          background: var(--surface); color: var(--muted);
          font-size: 0.75rem; font-weight: 600;
          cursor: pointer; transition: all .15s;
          display: flex; align-items: center; gap: 0.35rem;
        }
        .fr-filter-btn.active { background: var(--accent); color: #fff; border-color: var(--accent); }
        .fr-filter-btn:not(.active):hover { border-color: var(--accent); color: var(--accent); }
        .fr-count {
          display: inline-flex; align-items: center; justify-content: center;
          width: 18px; height: 18px;
          background: rgba(255,255,255,.25); border-radius: 50%;
          font-size: 0.625rem; font-weight: 700;
        }
        .fr-filter-btn:not(.active) .fr-count { background: var(--bg); color: var(--muted); }

        .fr-model-filters {
          display: flex; gap: 0.375rem;
          flex-wrap: wrap; margin-bottom: 1rem;
        }
        .fr-model-btn {
          padding: 0.25rem 0.625rem;
          border: 1px solid var(--border); border-radius: 4px;
          background: var(--surface); color: var(--muted);
          font-size: 0.6875rem; font-weight: 600;
          cursor: pointer; transition: all .15s;
        }
        .fr-model-btn.active { background: var(--text); color: var(--surface); border-color: var(--text); }

        .fr-panel {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px; overflow: hidden;
        }
        .fr-table { width: 100%; border-collapse: collapse; font-size: 0.8125rem; }
        .fr-table th {
          padding: 0.5rem 0.875rem; text-align: left;
          font-size: 0.6875rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: .06em;
          color: var(--muted);
          border-bottom: 1px solid var(--border);
          background: var(--bg);
        }
        .fr-table td {
          padding: 0.65rem 0.875rem;
          border-bottom: 1px solid var(--border);
          color: var(--text);
        }
        .fr-table tr:last-child td { border-bottom: none; }
        .fr-table tr:hover td { background: var(--bg); cursor: pointer; }
        .fr-name  { font-weight: 600; }
        .fr-muted { color: var(--muted); font-size: 0.75rem; }

        .fr-badge {
          display: inline-block; padding: 0.15rem 0.6rem;
          border-radius: 999px; font-size: 0.6875rem; font-weight: 700;
        }
        .fr-model-badge {
          display: inline-block; padding: 0.15rem 0.5rem;
          border-radius: 4px; font-size: 0.6875rem; font-weight: 600;
        }
        .fr-view-btn {
          background: none; border: none;
          color: var(--accent); font-size: 0.8125rem; font-weight: 600;
          cursor: pointer; padding: 0;
        }
        .fr-view-btn:hover { text-decoration: underline; }
        .fr-empty { text-align: center; padding: 3rem; font-size: 0.8125rem; color: var(--muted); }
        .fr-loading { text-align: center; padding: 3rem; color: var(--muted); font-size: 0.8125rem; }

        /* Modal */
        .fr-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,.5);
          display: flex; align-items: center; justify-content: center;
          padding: 1rem; z-index: 50;
        }
        .fr-modal {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          width: 100%; max-width: 680px;
          max-height: 90vh;
          display: flex; flex-direction: column;
          box-shadow: 0 20px 60px rgba(0,0,0,.25);
        }
        .fr-modal-head {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
          flex-shrink: 0;
        }
        .fr-modal-title { font-size: 0.9375rem; font-weight: 700; color: var(--text); }
        .fr-modal-close {
          background: none; border: none; cursor: pointer;
          color: var(--muted); font-size: 1.25rem;
          padding: 0.125rem 0.25rem; border-radius: 4px;
        }
        .fr-modal-close:hover { background: var(--bg); }

        /* Section tabs inside modal */
        .fr-modal-tabs {
          display: flex; overflow-x: auto;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0; scrollbar-width: none;
        }
        .fr-modal-tabs::-webkit-scrollbar { display: none; }
        .fr-modal-tab {
          padding: 0.5rem 1rem; white-space: nowrap;
          font-size: 0.75rem; font-weight: 600;
          color: var(--muted); background: none; border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer; transition: all .15s;
          margin-bottom: -1px;
        }
        .fr-modal-tab.active { color: var(--accent); border-bottom-color: var(--accent); }
        .fr-modal-tab:hover:not(.active) { color: var(--text); }

        .fr-modal-body { padding: 1.25rem 1.5rem; overflow-y: auto; flex: 1; }

        .fr-modal-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 0.875rem; margin-bottom: 1rem;
        }
        @media(max-width:480px){ .fr-modal-grid { grid-template-columns: 1fr; } }

        .fr-modal-msg {
          background: var(--bg); border-radius: 6px;
          padding: 0.75rem; font-size: 0.8125rem;
          color: var(--muted); line-height: 1.6;
          margin-bottom: 1rem; margin-top: 0.375rem;
        }

        .fr-status-row {
          display: flex; align-items: center; gap: 0.5rem;
          flex-wrap: wrap; padding: 1rem 1.5rem;
          border-top: 1px solid var(--border);
          flex-shrink: 0;
        }
        .fr-status-label { font-size: 0.75rem; font-weight: 600; color: var(--muted); }
        .fr-status-opt {
          padding: 0.3rem 0.75rem; border-radius: 20px;
          border: 1px solid var(--border);
          font-size: 0.75rem; font-weight: 600;
          cursor: pointer; transition: all .15s;
          background: var(--surface); color: var(--muted);
        }
        .fr-status-opt.sel { border-color: transparent; color: #fff; }
        .fr-status-opt:disabled { opacity: .5; cursor: not-allowed; }

        .fr-section-title {
          font-size: 0.6875rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: .06em;
          color: var(--muted); margin-bottom: 0.875rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border);
        }
      `}</style>

      <div className="fr-wrap">

        {/* Toolbar */}
        <div className="fr-toolbar">
          <span className="fr-title">Franchise Applications</span>
          <input
            className="fr-search"
            placeholder="Search name, email, city…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Stats */}
        <div className="fr-stats">
          {[
            { label: 'Total',    value: counts.All },
            { label: 'Pending',  value: counts.Pending },
            { label: 'Approved', value: counts.Approved },
            { label: 'Rejected', value: counts.Rejected },
          ].map(s => (
            <div key={s.label} className="fr-stat">
              <div className="fr-stat-label">{s.label}</div>
              <div className="fr-stat-value">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Status filters */}
        <div className="fr-filters">
          {['All', ...STATUS_OPTIONS].map(f => (
            <button
              key={f}
              className={`fr-filter-btn${filter === f ? ' active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f} <span className="fr-count">{counts[f] ?? 0}</span>
            </button>
          ))}
        </div>

        {/* Model filters */}
        <div className="fr-model-filters">
          {models.map(m => (
            <button
              key={m}
              className={`fr-model-btn${modelFilter === m ? ' active' : ''}`}
              onClick={() => setModelFilter(m)}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="fr-panel">
          {loading ? (
            <div className="fr-loading">Loading franchise applications…</div>
          ) : filtered.length === 0 ? (
            <div className="fr-empty">No franchise applications found.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="fr-table">
                <thead>
                  <tr>
                    {['Applicant','Contact','Location','Model','Investment','Territory','Status','Date','Action'].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(fr => {
                    const st = statusStyle[fr.status] || statusStyle.Pending;
                    const ms = modelStyle[fr.model] || { bg: '#f5f5f7', tx: '#6b6b76' };
                    return (
                      <tr key={fr.id} onClick={() => { setSelected(fr); setSection('personal'); }}>
                        <td>
                          <div className="fr-name">{fr.name}</div>
                          <div className="fr-muted">{fr.occupation}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.8125rem' }}>{fr.email}</div>
                          <div className="fr-muted">{fr.phone}</div>
                        </td>
                        <td className="fr-muted">{fr.city}, {fr.state}</td>
                        <td>
                          <span className="fr-model-badge" style={{ background: ms.bg, color: ms.tx }}>
                            {fr.model}
                          </span>
                        </td>
                        <td className="fr-muted">{fr.investment}</td>
                        <td className="fr-muted">{fr.territory}</td>
                        <td>
                          <span className="fr-badge" style={{ background: st.bg, color: st.tx }}>
                            {fr.status}
                          </span>
                        </td>
                        <td className="fr-muted">{new Date(fr.created_at).toLocaleDateString()}</td>
                        <td>
                          <button
                            className="fr-view-btn"
                            onClick={e => { e.stopPropagation(); setSelected(fr); setSection('personal'); }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fr-backdrop" onClick={() => setSelected(null)}>
          <div className="fr-modal" onClick={e => e.stopPropagation()}>

            {/* Modal Header */}
            <div className="fr-modal-head">
              <div>
                <div className="fr-modal-title">{selected.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '2px' }}>
                  {selected.model} · {selected.city}, {selected.state}
                </div>
              </div>
              <button className="fr-modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>

            {/* Section Tabs */}
            <div className="fr-modal-tabs">
              {modalSections.map(s => (
                <button
                  key={s.id}
                  className={`fr-modal-tab${section === s.id ? ' active' : ''}`}
                  onClick={() => setSection(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Section Content */}
            <div className="fr-modal-body">

              {section === 'personal' && (
                <>
                  <div className="fr-section-title">Personal Details</div>
                  <div className="fr-modal-grid">
                    <Field label="Full Name"      value={selected.name} />
                    <Field label="Father/Husband" value={selected.father_name} />
                    <Field label="Date of Birth"  value={selected.dob} />
                    <Field label="Gender"         value={selected.gender} />
                    <Field label="Marital Status" value={selected.marital_status} />
                    <Field label="Phone"          value={selected.phone} />
                    <Field label="Email"          value={selected.email} />
                    <Field label="Occupation"     value={selected.occupation} />
                    <Field label="Qualification"  value={selected.qualification} />
                    <Field label="Annual Income"  value={selected.annual_income} />
                    <Field label="ID Type"        value={selected.id_type} />
                    <Field label="ID Number"      value={selected.id_number} />
                    <Field label="PAN Number"     value={selected.pan} />
                  </div>
                </>
              )}

              {section === 'address' && (
                <>
                  <div className="fr-section-title">Address Details</div>
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)', marginBottom: '0.2rem' }}>Full Address</div>
                    <div className="fr-modal-msg">{selected.address}</div>
                  </div>
                  <div className="fr-modal-grid">
                    <Field label="District" value={selected.district} />
                    <Field label="City"     value={selected.city} />
                    <Field label="State"    value={selected.state} />
                    <Field label="PIN Code" value={selected.pin_code} />
                  </div>
                </>
              )}

              {section === 'business' && (
                <>
                  <div className="fr-section-title">Business Experience</div>
                  <div className="fr-modal-grid">
                    <Field label="Current Business"       value={selected.current_business} />
                    <Field label="Years in Business"      value={selected.experience} />
                    <Field label="Construction Exp"       value={selected.construction_exp} />
                    <Field label="Employees"              value={selected.employees} />
                  </div>
                  <div style={{ marginBottom: '0.2rem', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)' }}>Network / Client Base</div>
                  <div className="fr-modal-msg">{selected.network || '—'}</div>
                </>
              )}

              {section === 'banking' && (
                <>
                  <div className="fr-section-title">Banking Details</div>
                  <div className="fr-modal-grid">
                    <Field label="Bank Name"       value={selected.bank_name} />
                    <Field label="Branch Name"     value={selected.branch_name} />
                    <Field label="Account Number"  value={selected.account_number} />
                    <Field label="IFSC Code"       value={selected.ifsc_code} />
                  </div>
                </>
              )}

              {section === 'franchise' && (
                <>
                  <div className="fr-section-title">Franchise Preference</div>
                  <div className="fr-modal-grid">
                    <Field label="Franchise Model"    value={selected.model} />
                    <Field label="Investment"         value={selected.investment} />
                    <Field label="Territory"          value={selected.territory} />
                    <Field label="Referral Source"    value={selected.referral_source} />
                    <Field label="Start Date"         value={selected.start_date} />
                    <Field label="Service Category"   value={selected.service_category} />
                    <Field label="Other Franchise"    value={selected.other_franchise} />
                    <Field label="Training Willing"   value={selected.training_willing} />
                  </div>
                  <div style={{ marginBottom: '0.2rem', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)' }}>Why MT BOSS</div>
                  <div className="fr-modal-msg">{selected.message}</div>
                </>
              )}

              {section === 'office' && (
                <>
                  <div className="fr-section-title">Proposed Office</div>
                  <div className="fr-modal-grid">
                    <Field label="Office Area"         value={selected.office_area} />
                    <Field label="Office District"     value={selected.office_district} />
                    <Field label="Premises Ownership"  value={selected.premises_ownership} />
                    <Field label="Lease Duration"      value={selected.lease_duration} />
                    <Field label="Office Size (sqft)"  value={selected.office_area_sqft} />
                    <Field label="Office Type"         value={selected.office_type} />
                  </div>
                </>
              )}

            </div>

            {/* Status Changer */}
            <div className="fr-status-row">
              <span className="fr-status-label">Status:</span>
              {STATUS_OPTIONS.map(s => {
                const st = statusStyle[s];
                const isSel = selected.status === s;
                return (
                  <button
                    key={s}
                    disabled={updating}
                    className={`fr-status-opt${isSel ? ' sel' : ''}`}
                    style={isSel ? { background: st.tx, borderColor: st.tx } : {}}
                    onClick={() => updateStatus(selected.id, s)}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}