'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = ['Commercial', 'Residential', 'Hospitality', 'Industrial', 'IT Infrastructure', 'Luxury Home'];
const SIZES = [
  { value: 'small',  label: 'Small (1 col)' },
  { value: 'medium', label: 'Medium (2 col)' },
  { value: 'large',  label: 'Large (2 col × 2 row)' },
];

const statusStyle = {
  published: { bg: '#f0fdf4', tx: '#14532d' },
  draft:     { bg: '#fff7ed', tx: '#9a3412' },
};

export default function ProjectsManager() {
  const router = useRouter();
  const [projects, setProjects]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showForm, setShowForm]       = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [uploading, setUploading]     = useState(false);
  const [saving, setSaving]           = useState(false);
  const [deleteId, setDeleteId]       = useState(null);
  const [preview, setPreview]         = useState('');
  const fileRef = useRef(null);

  const emptyForm = {
    title: '', category: '', location: '', description: '',
    image_url: '', cloudinary_public_id: '', size: 'small', status: 'published',
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects?status=all');
      const data = await res.json();
      if (data.success) setProjects(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setForm(emptyForm);
    setPreview('');
    setEditProject(null);
    setShowForm(true);
  };

  const openEdit = (project) => {
    setForm({
      title:                project.title,
      category:             project.category,
      location:             project.location || '',
      description:          project.description || '',
      image_url:            project.image_url,
      cloudinary_public_id: project.cloudinary_public_id || '',
      size:                 project.size || 'small',
      status:               project.status || 'published',
    });
    setPreview(project.image_url);
    setEditProject(project);
    setShowForm(true);
  };

  // Upload to Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'mtboss/projects');

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      if (data.secure_url) {
        setForm(f => ({ ...f, image_url: data.secure_url, cloudinary_public_id: data.public_id }));
        setPreview(data.secure_url);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.category || !form.image_url) {
      alert('Title, category and image are required.');
      return;
    }
    setSaving(true);
    try {
      const method = editProject ? 'PATCH' : 'POST';
      const body   = editProject ? { ...form, id: editProject.id } : form;

      const res  = await fetch('/api/projects', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        if (editProject) {
          setProjects(prev => prev.map(p => p.id === editProject.id ? data.data : p));
        } else {
          setProjects(prev => [data.data, ...prev]);
        }
        setShowForm(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, cloudinary_public_id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await fetch('/api/projects', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, cloudinary_public_id }),
      });
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (project) => {
    const newStatus = project.status === 'published' ? 'draft' : 'published';
    const res = await fetch('/api/projects', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...project, status: newStatus }),
    });
    const data = await res.json();
    if (data.success) setProjects(prev => prev.map(p => p.id === project.id ? data.data : p));
  };

  return (
    <>
      <style>{`
        .pm-wrap { padding: 1.25rem 0; }
        .pm-toolbar {
          display: flex; align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .pm-title { font-size: 0.875rem; font-weight: 700; color: var(--text); }
        .pm-add-btn {
          display: inline-flex; align-items: center; gap: 0.375rem;
          padding: 0.4rem 0.875rem;
          background: var(--accent); color: #fff;
          border: none; border-radius: 6px;
          font-size: 0.8125rem; font-weight: 600;
          cursor: pointer; transition: opacity .15s;
        }
        .pm-add-btn:hover { opacity: .85; }

        /* Stats */
        .pm-stats {
          display: grid; grid-template-columns: repeat(3,1fr);
          gap: 0.75rem; margin-bottom: 1rem;
        }
        .pm-stat {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 8px; padding: 0.875rem 1rem;
        }
        .pm-stat-label { font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); margin-bottom: 0.25rem; }
        .pm-stat-value { font-size: 1.5rem; font-weight: 700; color: var(--text); }

        /* Grid */
        .pm-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 0.75rem;
        }
        .pm-card {
          background: var(--surface) !important;
          background-image: none !important;
          border: 1px solid var(--border);
          border-radius: 8px; overflow: hidden;
          cursor: pointer;
          transition: border-color .15s, transform .15s, box-shadow .15s;
        }
        .pm-card:hover {
          border-color: var(--accent);
          transform: translateY(-1px);
          box-shadow: 0 10px 28px rgba(15, 23, 42, .08);
        }
        .pm-card-img {
          width: 100%; height: 160px;
          object-fit: cover; display: block;
        }
        .pm-card-img-placeholder {
          width: 100%; height: 160px;
          background: var(--bg);
          display: flex; align-items: center; justify-content: center;
          font-size: 2rem; color: var(--muted);
        }
        .pm-card-body { padding: 0.875rem; }
        .pm-card-top {
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .pm-card-title { font-size: 0.875rem; font-weight: 700; color: var(--text); }
        .pm-card-cat {
          display: inline-block;
          padding: 0.15rem 0.55rem;
          border-radius: 999px; font-size: 0.6875rem; font-weight: 600;
          background: var(--accent-lt); color: var(--accent);
          white-space: nowrap;
        }
        .pm-card-meta { font-size: 0.75rem; color: var(--muted); margin-bottom: 0.5rem; }
        .pm-card-desc {
          font-size: 0.75rem; color: var(--muted);
          line-height: 1.5;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
          margin-bottom: 0.75rem;
        }
        .pm-card-footer {
          display: flex; align-items: center;
          justify-content: space-between;
          padding-top: 0.625rem;
          border-top: 1px solid var(--border);
        }
        .pm-badge {
          display: inline-block; padding: 0.15rem 0.55rem;
          border-radius: 999px; font-size: 0.6875rem; font-weight: 600;
          cursor: pointer;
        }
        .pm-actions { display: flex; gap: 0.375rem; }
        .pm-edit-btn {
          padding: 0.3rem 0.625rem;
          border: 1px solid var(--border); border-radius: 5px;
          background: var(--surface); color: var(--text);
          font-size: 0.75rem; font-weight: 600; cursor: pointer;
          transition: all .15s;
        }
        .pm-edit-btn:hover { border-color: var(--accent); color: var(--accent); }
        .pm-del-btn {
          padding: 0.3rem 0.625rem;
          border: 1px solid var(--border); border-radius: 5px;
          background: var(--surface); color: var(--muted);
          font-size: 0.75rem; font-weight: 600; cursor: pointer;
          transition: all .15s;
        }
        .pm-del-btn:hover { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }

        .pm-empty { text-align: center; padding: 3rem; color: var(--muted); font-size: 0.8125rem; }

        /* Form Modal */
        .pm-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,.5);
          display: flex; align-items: center; justify-content: center;
          padding: 1rem; z-index: 50;
        }
        .pm-modal {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          width: 100%; max-width: 560px;
          max-height: 90vh; overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0,0,0,.25);
        }
        .pm-modal-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border);
          position: sticky; top: 0; background: var(--surface); z-index: 1;
        }
        .pm-modal-title { font-size: 0.9375rem; font-weight: 700; color: var(--text); }
        .pm-modal-close {
          background: none; border: none; cursor: pointer;
          color: var(--muted); font-size: 1.25rem;
          padding: 0.125rem 0.25rem; border-radius: 4px;
        }
        .pm-modal-close:hover { background: var(--bg); }
        .pm-modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }

        .pm-field-label {
          display: block; font-size: 0.75rem; font-weight: 600;
          color: var(--muted); margin-bottom: 0.35rem;
          text-transform: uppercase; letter-spacing: .04em;
        }
        .pm-input {
          width: 100%; padding: 0.45rem 0.75rem;
          border: 1px solid var(--border); border-radius: 6px;
          background: var(--bg); color: var(--text);
          font-size: 0.8125rem; outline: none;
          transition: border-color .15s; box-sizing: border-box;
        }
        .pm-input:focus { border-color: var(--accent); background: var(--surface); }
        .pm-textarea {
          width: 100%; padding: 0.45rem 0.75rem;
          border: 1px solid var(--border); border-radius: 6px;
          background: var(--bg); color: var(--text);
          font-size: 0.8125rem; outline: none; resize: vertical;
          transition: border-color .15s; box-sizing: border-box;
          min-height: 80px;
        }
        .pm-textarea:focus { border-color: var(--accent); background: var(--surface); }

        .pm-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }

        .pm-upload-area {
          border: 2px dashed var(--border); border-radius: 8px;
          padding: 1.5rem; text-align: center; cursor: pointer;
          transition: border-color .15s;
        }
        .pm-upload-area:hover { border-color: var(--accent); }
        .pm-upload-preview {
          width: 100%; height: 160px;
          object-fit: cover; border-radius: 6px;
          margin-bottom: 0.75rem; display: block;
        }
        .pm-upload-label {
          font-size: 0.8125rem; color: var(--muted); margin-bottom: 0.5rem;
        }
        .pm-upload-btn {
          padding: 0.4rem 0.875rem;
          border: 1px solid var(--border); border-radius: 6px;
          background: var(--surface); color: var(--text);
          font-size: 0.75rem; font-weight: 600; cursor: pointer;
          transition: all .15s; display: inline-block;
        }
        .pm-upload-btn:hover { border-color: var(--accent); color: var(--accent); }
        .pm-url-helper {
          margin-top: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .pm-size-opts { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .pm-size-opt {
          padding: 0.35rem 0.75rem;
          border: 1px solid var(--border); border-radius: 6px;
          background: var(--surface); color: var(--muted);
          font-size: 0.75rem; font-weight: 600; cursor: pointer;
          transition: all .15s;
        }
        .pm-size-opt.sel {
          background: var(--accent); color: #fff; border-color: var(--accent);
        }

        .pm-modal-footer {
          display: flex; gap: 0.5rem; justify-content: flex-end;
          padding: 1rem 1.5rem;
          border-top: 1px solid var(--border);
          position: sticky; bottom: 0; background: var(--surface);
        }
        .pm-cancel-btn {
          padding: 0.45rem 1rem;
          background: var(--bg); color: var(--muted);
          border: 1px solid var(--border); border-radius: 6px;
          font-size: 0.8125rem; font-weight: 600; cursor: pointer;
        }
        .pm-save-btn {
          padding: 0.45rem 1.25rem;
          background: var(--accent); color: #fff;
          border: none; border-radius: 6px;
          font-size: 0.8125rem; font-weight: 600; cursor: pointer;
          transition: opacity .15s;
        }
        .pm-save-btn:disabled { opacity: .5; cursor: not-allowed; }
      `}</style>

      <div className="pm-wrap">

        {/* Toolbar */}
        <div className="pm-toolbar">
          <span className="pm-title">Portfolio Projects</span>
          <button className="pm-add-btn" onClick={openAdd}>+ Add Project</button>
        </div>

        {/* Stats */}
        <div className="pm-stats">
          {[
            { label: 'Total',     value: projects.length },
            { label: 'Published', value: projects.filter(p => p.status === 'published').length },
            { label: 'Draft',     value: projects.filter(p => p.status === 'draft').length },
          ].map(s => (
            <div key={s.label} className="pm-stat">
              <div className="pm-stat-label">{s.label}</div>
              <div className="pm-stat-value">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="pm-empty">Loading projects…</div>
        ) : projects.length === 0 ? (
          <div className="pm-empty">No projects yet. Click Add Project to get started.</div>
        ) : (
          <div className="pm-grid">
            {projects.map(project => {
              const st = statusStyle[project.status] || statusStyle.published;
              return (
                <div
                  key={project.id}
                  className="pm-card"
                  tabIndex={0}
                  onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      router.push(`/dashboard/projects/${project.id}`);
                    }
                  }}
                  title="Open project management"
                >
                  {project.image_url
                    ? <img src={project.image_url} alt={project.title} className="pm-card-img" />
                    : <div className="pm-card-img-placeholder">🏗️</div>
                  }
                  <div className="pm-card-body">
                    <div className="pm-card-top">
                      <span className="pm-card-title">{project.title}</span>
                      <span className="pm-card-cat">{project.category}</span>
                    </div>
                    {project.location && (
                      <div className="pm-card-meta">📍 {project.location} · {project.size}</div>
                    )}
                    {project.description && (
                      <div className="pm-card-desc">{project.description}</div>
                    )}
                    <div className="pm-card-footer">
                      <span
                        className="pm-badge"
                        style={{ background: st.bg, color: st.tx, cursor: 'pointer' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStatus(project);
                        }}
                        title="Click to toggle"
                      >
                        {project.status}
                      </span>
                      <div className="pm-actions">
                        <button className="pm-edit-btn" onClick={(e) => { e.stopPropagation(); openEdit(project); }}>Edit</button>
                        <button className="pm-del-btn" onClick={(e) => { e.stopPropagation(); handleDelete(project.id, project.cloudinary_public_id); }}>Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="pm-backdrop" onClick={() => setShowForm(false)}>
          <div className="pm-modal" onClick={e => e.stopPropagation()}>
            <div className="pm-modal-head">
              <span className="pm-modal-title">{editProject ? 'Edit Project' : 'Add Project'}</span>
              <button className="pm-modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>

            <div className="pm-modal-body">

              {/* Image Upload */}
              <div>
                <label className="pm-field-label">Project Image *</label>
                <div className="pm-upload-area" onClick={() => fileRef.current?.click()}>
                  {preview && <img src={preview} alt="preview" className="pm-upload-preview" />}
                  <p className="pm-upload-label">
                    {uploading ? '⏳ Uploading to Cloudinary…' : preview ? 'Click to change image' : 'Click to upload image'}
                  </p>
                  {!uploading && <span className="pm-upload-btn">Choose Image</span>}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />
                <div className="pm-url-helper">
                  <label className="pm-field-label">Or Paste Image URL</label>
                  <input
                    className="pm-input"
                    type="url"
                    placeholder="https://..."
                    value={form.image_url}
                    onChange={e => {
                      const imageUrl = e.target.value;
                      setForm(f => ({ ...f, image_url: imageUrl, cloudinary_public_id: '' }));
                      setPreview(imageUrl);
                    }}
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="pm-field-label">Project Title *</label>
                <input
                  className="pm-input"
                  placeholder="e.g. The Sky Atrium"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                />
              </div>

              {/* Category + Location */}
              <div className="pm-row">
                <div>
                  <label className="pm-field-label">Category *</label>
                  <select
                    className="pm-input"
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="pm-field-label">Location</label>
                  <input
                    className="pm-input"
                    placeholder="e.g. Mumbai, MH"
                    value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="pm-field-label">Short Description</label>
                <textarea
                  className="pm-textarea"
                  placeholder="Brief description of the project…"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>

              {/* Size */}
              <div>
                <label className="pm-field-label">Grid Size (for gallery layout)</label>
                <div className="pm-size-opts">
                  {SIZES.map(s => (
                    <button
                      key={s.value}
                      className={`pm-size-opt${form.size === s.value ? ' sel' : ''}`}
                      onClick={() => setForm(f => ({ ...f, size: s.value }))}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="pm-field-label">Status</label>
                <div className="pm-size-opts">
                  {['published', 'draft'].map(s => (
                    <button
                      key={s}
                      className={`pm-size-opt${form.status === s ? ' sel' : ''}`}
                      onClick={() => setForm(f => ({ ...f, status: s }))}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <div className="pm-modal-footer">
              <button className="pm-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
              <button
                className="pm-save-btn"
                disabled={saving || uploading}
                onClick={handleSave}
              >
                {saving ? 'Saving…' : editProject ? 'Save Changes' : 'Add Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
