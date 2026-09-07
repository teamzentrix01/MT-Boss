'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BANNER_LIMITS, bannerImageUrl, validateBanner } from '@/lib/hero-banner-fields.mjs';
import HeroBannerSlide from './HeroBannerSlide';
import heroStyles from './Hero.module.css';
import styles from './HeroBannersManager.module.css';

const EMPTY = {
  service_name: '', label: '', title: '', subtitle: '', description: '',
  image_url: '', image_alt: '', image_position: 'center', cloudinary_public_id: '',
  cta_text: '', cta_href: '', secondary_cta_text: '', secondary_cta_href: '',
  sort_order: 0, is_active: true,
};

async function request(method = 'GET', body) {
  const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers['Content-Type'] = 'application/json';
  const response = await fetch(`/api/hero-banners${method === 'GET' ? '?mode=manager' : ''}`, {
    method, headers, ...(body ? { body: JSON.stringify(body) } : {}), cache: 'no-store',
  });
  const data = await response.json();
  if (!response.ok || !data.success || data.fallback) throw new Error(data.error || 'Banners could not be loaded or saved. Please try again.');
  return data.data;
}

export default function HeroBannersManager({ isDarkMode }) {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState(null);
  const [formError, setFormError] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mobilePreview, setMobilePreview] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const dialog = useRef(null);
  const deleteDialog = useRef(null);
  const theme = {
    '--panel-bg': isDarkMode ? '#0a1018' : '#f5f7fa',
    '--panel-card': isDarkMode ? '#121c28' : '#fff',
    '--panel-text': isDarkMode ? '#f1f5f9' : '#172536',
    '--panel-muted': isDarkMode ? '#b0bfd0' : '#526174',
    '--panel-border': isDarkMode ? '#334155' : '#d8e0e9',
  };

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const rows = await request();
      if (!Array.isArray(rows)) throw new Error('The server returned an invalid banner list.');
      setBanners(rows);
    } catch (error) { setError(error.message); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => {
    let cancelled = false;
    request().then(rows => {
      if (!Array.isArray(rows)) throw new Error('The server returned an invalid banner list.');
      if (!cancelled) setBanners(rows);
    }).catch(error => {
      if (!cancelled) setError(error.message);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);
  const editingOpen = Boolean(form);
  useEffect(() => { if (editingOpen) dialog.current?.showModal(); }, [editingOpen]);
  useEffect(() => { if (deleting) deleteDialog.current?.showModal(); }, [deleting]);

  function edit(banner) {
    setForm({ ...EMPTY, ...banner });
    setFormError(''); setUploadMessage(''); setNotice(''); setMobilePreview(false);
  }
  function closeEditor() {
    if (busy || uploading) return;
    dialog.current?.close(); setForm(null);
  }
  const change = (key, value) => setForm(current => ({ ...current, [key]: value }));

  async function upload(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setFormError(''); setUploadMessage('');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setFormError('Choose a JPG, PNG or WEBP image smaller than 5 MB.'); return;
    }
    setUploading(true);
    try {
      const body = new FormData(); body.append('file', file);
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      const response = await fetch('/api/hero-banners/upload', {
        method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {}, body,
      });
      const data = await response.json();
      if (!response.ok || !data.success || !data.url) throw new Error(data.error || 'Image upload failed.');
      setForm(current => ({ ...current, image_url: data.url, cloudinary_public_id: data.public_id }));
      setUploadMessage(`Uploaded to Cloudinary (${data.width} x ${data.height}).${data.width < 1200 ? ' A wider image is recommended for desktop.' : ''} Save the banner to publish this image.`);
    } catch (error) { setFormError(error.message); }
    finally { setUploading(false); }
  }

  async function save(event) {
    event.preventDefault();
    const result = validateBanner(form, process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
    if (result.error) { setFormError(result.error); return; }
    setBusy(true); setFormError('');
    try {
      const saved = await request(form.id ? 'PATCH' : 'POST', { ...result.data, ...(form.id ? { id: form.id } : {}) });
      setBanners(rows => form.id ? rows.map(row => row.id === saved.id ? saved : row) : [...rows, saved]);
      dialog.current.close(); setForm(null); setNotice('Banner saved. The homepage will use it on its next load.');
    } catch (error) { setFormError(error.message); }
    finally { setBusy(false); }
  }

  async function toggle(banner) {
    setBusy(true); setError(''); setNotice('');
    try {
      const saved = await request('PATCH', { id: banner.id, is_active: !banner.is_active });
      setBanners(rows => rows.map(row => row.id === saved.id ? saved : row));
    } catch (error) { setError(error.message); }
    finally { setBusy(false); }
  }
  async function remove() {
    setBusy(true); setError('');
    try {
      await request('DELETE', { id: deleting.id });
      setBanners(rows => rows.filter(row => row.id !== deleting.id));
      deleteDialog.current.close(); setDeleting(null); setNotice('Banner deleted.');
    } catch (error) { setError(error.message); deleteDialog.current.close(); setDeleting(null); }
    finally { setBusy(false); }
  }

  function field(key, label, placeholder, wide = false) {
    return <label className={`${styles.field} ${wide ? styles.wide : ''}`}>
      {label}
      <input aria-label={label} value={form[key] || ''} onChange={event => change(key, event.target.value)}
        maxLength={BANNER_LIMITS[key]} placeholder={placeholder} required={key === 'title'} />
      {['title', 'subtitle'].includes(key) && <small>{(form[key] || '').length}/{BANNER_LIMITS[key]} characters. Keep this line short.</small>}
    </label>;
  }

  const sorted = [...banners].sort((a, b) => a.sort_order - b.sort_order || a.id - b.id);
  return <div className={styles.manager} style={theme}>
    <div className={styles.header}>
      <div><h2>Homepage Banners</h2><p className={styles.muted}>Manage service banners, Cloudinary images, buttons and display order.</p></div>
      <button type="button" disabled={busy || loading || Boolean(error)} onClick={() => edit({ ...EMPTY, sort_order: Math.max(0, ...banners.map(b => b.sort_order)) + 1 })}>Add Banner</button>
    </div>
    {error && <div role="alert" className={`${styles.message} ${styles.error}`}>{error} <button type="button" onClick={load}>Retry</button></div>}
    {notice && <p role="status" className={styles.message}>{notice}</p>}
    {loading ? <p>Loading banners...</p> : <div className={styles.list}>
      {!sorted.length && !error && <p>No banners yet. Add a banner to feature a service on the homepage.</p>}
      {sorted.map(banner => <article key={banner.id} className={styles.card}>
        <img src={bannerImageUrl(banner.image_url, 400)} alt={banner.image_alt || banner.title} className={styles.thumbnail} />
        <div className={styles.cardCopy}>
          <span className={styles.status}>{banner.service_name || 'Service banner'} / Order {banner.sort_order} / {banner.is_active ? 'Active' : 'Hidden'}</span>
          <h3>{banner.title}</h3><p className={styles.muted}>{banner.subtitle}</p>
          {banner.cta_text && <p className={styles.muted}>{banner.cta_text} &rarr; {banner.cta_href}</p>}
        </div>
        <div className={styles.actions}>
          <button type="button" disabled={busy} onClick={() => edit(banner)}>Edit</button>
          <button type="button" disabled={busy} onClick={() => toggle(banner)}>{banner.is_active ? 'Hide' : 'Show'}</button>
          <button type="button" disabled={busy} onClick={() => setDeleting(banner)}>Delete</button>
        </div>
      </article>)}
    </div>}
    {form && <dialog ref={dialog} className={styles.dialog} style={theme} aria-labelledby="banner-editor-title"
      onCancel={event => { event.preventDefault(); closeEditor(); }}>
      <form onSubmit={save}>
        <div className={styles.header}>
          <div><h2 id="banner-editor-title">{form.id ? 'Edit Banner' : 'Add Banner'}</h2><p className={styles.muted}>Use English text and a clear image for this service.</p></div>
          <button type="button" disabled={busy || uploading} onClick={closeEditor} aria-label="Close banner editor">Close</button>
        </div>
        <div className={styles.editor}>
          <div className={styles.fields}>
            {field('service_name', 'Service tab name', 'Construction')}
            {field('label', 'Small label above heading', 'PLANNING TO COMPLETION')}
            {field('title', 'Main heading (white)', 'Your vision.', true)}
            {field('subtitle', 'Highlight line (blue)', 'Built to last.', true)}
            <label className={`${styles.field} ${styles.wide}`}>Description
              <textarea aria-label="Description" value={form.description || ''} onChange={event => change('description', event.target.value)} rows={3} maxLength={BANNER_LIMITS.description} />
              <small>{(form.description || '').length}/{BANNER_LIMITS.description} characters</small>
            </label>
            <label className={`${styles.field} ${styles.wide}`}>Upload banner image
              <input aria-label="Upload banner image" type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading || busy} onChange={upload} />
              <small>{uploading ? 'Uploading to Cloudinary...' : 'JPG, PNG or WEBP, up to 5 MB. Recommended width: 1920 px. Use a photo without embedded text.'}</small>
            </label>
            {uploadMessage && <p role="status" className={`${styles.muted} ${styles.wide}`}>{uploadMessage}</p>}
            <label className={`${styles.field} ${styles.wide}`}>Cloudinary image URL
              <input aria-label="Cloudinary image URL" type="url" required value={form.image_url} disabled={uploading} placeholder="https://res.cloudinary.com/..."
                onChange={event => { change('image_url', event.target.value); change('cloudinary_public_id', ''); setUploadMessage(''); }} />
              <small>Upload a file above, or paste an image URL from your Cloudinary account.</small>
            </label>
            {field('image_alt', 'Image description (accessibility)', 'Construction workers on a building site', true)}
            <label className={styles.field}>Image focal point
              <select aria-label="Image focal point" value={form.image_position} onChange={event => change('image_position', event.target.value)}>
                <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
              </select>
            </label>
            <label className={styles.field}>Display order
              <input aria-label="Display order" type="number" min="0" max="2147483647" required value={form.sort_order} onChange={event => change('sort_order', event.target.value)} />
            </label>
            {field('cta_text', 'Primary button text', 'Explore Services')}
            {field('cta_href', 'Primary button destination', '/Services/all')}
            {field('secondary_cta_text', 'Secondary button text', 'Contact Us')}
            {field('secondary_cta_href', 'Secondary button destination', '/contact')}
            <p className={`${styles.muted} ${styles.wide}`}>Use a page path such as /quick, /ShopNow or /buy-sale. Leave both fields blank to remove a button.</p>
            <label className={styles.field}>Visibility
              <select aria-label="Visibility" value={form.is_active ? 'active' : 'hidden'} onChange={event => change('is_active', event.target.value === 'active')}>
                <option value="active">Active on homepage</option><option value="hidden">Hidden</option>
              </select>
            </label>
          </div>
          <div className={styles.previewColumn}>
            <div className={styles.previewHeader}><strong>Banner preview</strong><button type="button" onClick={() => setMobilePreview(value => !value)}>{mobilePreview ? 'Wide Preview' : 'Mobile Preview'}</button></div>
            <div className={mobilePreview ? styles.mobilePreview : ''}>
              <div className={heroStyles.preview}><HeroBannerSlide banner={form} preview /></div>
            </div>
            <p className={styles.muted}>The image crops to fit each screen. Check both widths before saving.</p>
          </div>
        </div>
        {formError && <p role="alert" className={`${styles.message} ${styles.error}`}>{formError}</p>}
        <div className={styles.footer}>
          <button type="button" disabled={busy || uploading} onClick={closeEditor}>Cancel</button>
          <button type="submit" disabled={busy || uploading}>{busy ? 'Saving...' : uploading ? 'Uploading...' : 'Save Banner'}</button>
        </div>
      </form>
    </dialog>}
    {deleting && <dialog ref={deleteDialog} className={`${styles.dialog} ${styles.deleteDialog}`} style={theme} aria-labelledby="delete-banner-title"
      onCancel={event => { if (busy) event.preventDefault(); else setDeleting(null); }}>
      <h2 id="delete-banner-title">Delete this banner?</h2><p>{deleting.title}</p>
      <p className={styles.muted}>This removes the banner from the homepage. You can hide it instead if you want to use it later.</p>
      <div className={styles.footer}>
        <button type="button" disabled={busy} onClick={() => { deleteDialog.current.close(); setDeleting(null); }}>Cancel</button>
        <button type="button" disabled={busy} onClick={remove}>{busy ? 'Deleting...' : 'Delete Banner'}</button>
      </div>
    </dialog>}
  </div>;
}
