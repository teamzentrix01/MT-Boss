'use client';

import { useEffect, useMemo, useState } from 'react';

const RESOURCE_META = [
  { key: 'construction_services', label: 'Construction Services' },
  { key: 'quick_services', label: 'Quick Services' },
  { key: 'vendors', label: 'Vendors' },
  { key: 'agents', label: 'Agents' },
];

const emptyForms = {
  construction_services: { title: '', description: '', image: '' },
  quick_services: { label: '', description: '', image: '', duration: '', base_price: '', visiting_price: '' },
  vendors: { shop_name: '', email: '', phone: '', password: '', postal_code: '', aadhar_number: '' },
  agents: { name: '', email: '', phone: '', occupation: '', agent_type: 'Agent', experience: '' },
};

export default function FranchiseOperationsManager({ permissions }) {
  const available = useMemo(
    () => RESOURCE_META.filter((item) => permissions[
      item.key === 'agents' ? 'agents.manage_directory' : `${item.key}.view`
    ]),
    [permissions]
  );
  const [resource, setResource] = useState(available[0]?.key || '');
  const [records, setRecords] = useState([]);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForms[available[0]?.key] || {});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [vendorServices, setVendorServices] = useState({});

  const can = (key) => permissions[key] === true;
  const token = () => localStorage.getItem('franchise-token');
  const headers = (json = false) => ({
    ...(json ? { 'Content-Type': 'application/json' } : {}),
    Authorization: `Bearer ${token()}`,
  });

  useEffect(() => {
    if (!available.some((item) => item.key === resource)) {
      const next = available[0]?.key || '';
      setResource(next);
      setForm(emptyForms[next] || {});
    }
  }, [available, resource]);

  useEffect(() => {
    if (resource) load(resource);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource]);

  async function load(nextResource = resource) {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`/api/franchise/operations?resource=${nextResource}`, {
        headers: headers(),
        cache: 'no-store',
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Could not load records');
      setRecords(data.data || []);
      setServices(data.services || []);
      setVendorServices(Object.fromEntries((data.data || []).map((vendor) => [
        vendor.id,
        (vendor.services || []).map((service) => Number(service.id)),
      ])));
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function uploadFile(file) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !preset) throw new Error('Image upload is not configured');
    const body = new FormData();
    body.append('file', file);
    body.append('upload_preset', preset);
    body.append('folder', `mtboss/franchise-${resource}`);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body });
    const data = await res.json();
    if (!data.secure_url) throw new Error('Image upload failed');
    return data.secure_url;
  }

  async function createRecord(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/franchise/operations', {
        method: 'POST',
        headers: headers(true),
        body: JSON.stringify({ resource, ...form }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Could not create record');
      setForm(emptyForms[resource]);
      setMessage(`${RESOURCE_META.find((item) => item.key === resource)?.label} record created.`);
      await load();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function patchRecord(record, patch) {
    setMessage('');
    const res = await fetch('/api/franchise/operations', {
      method: 'PATCH',
      headers: headers(true),
      body: JSON.stringify({ resource, id: record.id, ...patch }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      setMessage(data.error || 'Update failed');
      return;
    }
    if (data.temporaryPassword) {
      setMessage(`Agent login created. Temporary password: ${data.temporaryPassword}`);
    } else {
      setMessage('Updated successfully.');
    }
    await load();
  }

  async function removeRecord(record) {
    if (!confirm(`Delete ${record.title || record.label || record.shop_name || record.name || record.email}?`)) return;
    const res = await fetch('/api/franchise/operations', {
      method: 'DELETE',
      headers: headers(true),
      body: JSON.stringify({ resource, id: record.id }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      setMessage(data.error || 'Delete failed');
      return;
    }
    setMessage('Deleted successfully.');
    await load();
  }

  async function replaceImage(record, file) {
    if (!file) return;
    try {
      setSaving(true);
      const image = await uploadFile(file);
      await patchRecord(record, { action: 'image', image });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  function editService(record) {
    const isConstruction = resource === 'construction_services';
    const name = prompt('Name', isConstruction ? record.title : record.label);
    if (!name) return;
    const description = prompt('Description', record.description || '');
    if (description === null) return;
    patchRecord(record, isConstruction
      ? { title: name, description, image: record.image }
      : {
        label: name, description, image: record.icon, duration: record.duration,
        base_price: record.base_price, visiting_price: record.visiting_price,
      });
  }

  function editQuickPricing(record) {
    const basePrice = prompt('Base price', record.base_price ?? 0);
    if (basePrice === null) return;
    const visitingPrice = prompt('Visiting price (before GST)', record.visiting_price ?? 0);
    if (visitingPrice === null) return;
    patchRecord(record, {
      action: 'pricing',
      label: record.label,
      description: record.description,
      image: record.icon,
      duration: record.duration,
      base_price: basePrice,
      visiting_price: visitingPrice,
    });
  }

  function editVendor(record) {
    const shopName = prompt('Business / shop name', record.shop_name || '');
    if (shopName === null) return;
    const phone = prompt('Phone', record.phone || '');
    if (phone === null) return;
    patchRecord(record, { shop_name: shopName, phone, state: record.state, postal_code: record.postal_code });
  }

  function editAgent(record) {
    const name = prompt('Agent name', record.name || '');
    if (!name) return;
    const phone = prompt('Phone', record.phone || '');
    if (phone === null) return;
    patchRecord(record, { name, phone, email: record.email, state: record.state, occupation: record.occupation, agent_type: record.agent_type, experience: record.experience });
  }

  if (!available.length) return null;
  const isService = resource === 'construction_services' || resource === 'quick_services';

  return (
    <section className="fom">
      <style>{`
        .fom{margin-top:1.25rem;background:#fff;border:1px solid #e5e7eb;border-radius:9px;overflow:hidden}
        .fom-head{padding:1rem;border-bottom:1px solid #e5e7eb}.fom-title{font-weight:900}.fom-sub{font-size:.78rem;color:#71717a;margin-top:.25rem}
        .fom-tabs{display:flex;gap:.45rem;flex-wrap:wrap;padding:.75rem 1rem;border-bottom:1px solid #e5e7eb;background:#f8fafc}
        .fom-tab,.fom-btn{border:1px solid #d4d4d8;background:#fff;border-radius:6px;padding:.48rem .7rem;font-weight:800;font-size:.75rem;cursor:pointer}
        .fom-tab.active,.fom-btn.primary{background:var(--brand-blue);color:#111;border-color:var(--brand-blue)}
        .fom-btn.danger{color:#be123c;border-color:#fecdd3}.fom-btn:disabled{opacity:.5;cursor:not-allowed}
        .fom-form{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.65rem;padding:1rem;border-bottom:1px solid #e5e7eb}
        .fom-input{width:100%;box-sizing:border-box;border:1px solid #d4d4d8;border-radius:6px;padding:.62rem;background:#fafafa;font:inherit;font-size:.8rem}
        .fom-wide{grid-column:span 2}.fom-file{padding:.5rem}.fom-message{margin:1rem;padding:.7rem;border-radius:6px;background:#f8fafc;font-size:.8rem;font-weight:700}
        .fom-list{padding:1rem;display:grid;gap:.65rem}.fom-row{border:1px solid #e5e7eb;border-radius:7px;padding:.8rem;display:flex;justify-content:space-between;gap:1rem;align-items:center}
        .fom-main{min-width:0}.fom-name{font-weight:900}.fom-meta{font-size:.74rem;color:#71717a;margin-top:.2rem;overflow-wrap:anywhere}
        .fom-actions{display:flex;gap:.4rem;flex-wrap:wrap;justify-content:flex-end}.fom-services{min-width:180px;min-height:64px}
        @media(max-width:760px){.fom-form{grid-template-columns:1fr}.fom-wide{grid-column:auto}.fom-row{align-items:flex-start;flex-direction:column}.fom-actions{justify-content:flex-start}}
      `}</style>

      <div className="fom-head">
        <div className="fom-title">Franchise Business Management</div>
        <div className="fom-sub">Only options granted by the super admin are shown. Services created here remain owned by this franchise.</div>
      </div>
      <div className="fom-tabs">
        {available.map((item) => (
          <button key={item.key} className={`fom-tab ${resource === item.key ? 'active' : ''}`} onClick={() => {
            setResource(item.key);
            setForm(emptyForms[item.key]);
          }}>{item.label}</button>
        ))}
      </div>

      {can(`${resource}.create`) && <form className="fom-form" onSubmit={createRecord}>
        {resource === 'construction_services' && <>
          <input className="fom-input" placeholder="Service title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <input className="fom-input fom-wide" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        </>}
        {resource === 'quick_services' && <>
          <input className="fom-input" placeholder="Service name" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required />
          <input className="fom-input" placeholder="Duration (e.g. 2 hours)" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} required />
          <input className="fom-input" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          {can('quick_services.manage_pricing') && <>
            <input className="fom-input" type="number" min="0" placeholder="Base price" value={form.base_price} onChange={(e) => setForm({ ...form, base_price: e.target.value })} required />
            <input className="fom-input" type="number" min="0" placeholder="Visiting price" value={form.visiting_price} onChange={(e) => setForm({ ...form, visiting_price: e.target.value })} />
          </>}
        </>}
        {isService && <input className="fom-input fom-file" type="file" accept="image/*" required onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          try {
            setSaving(true);
            const image = await uploadFile(file);
            setForm((current) => ({ ...current, image }));
          } catch (error) {
            setMessage(error.message);
          } finally {
            setSaving(false);
          }
        }} />}
        {resource === 'vendors' && <>
          <input className="fom-input" placeholder="Shop / business name" value={form.shop_name} onChange={(e) => setForm({ ...form, shop_name: e.target.value })} />
          <input className="fom-input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="fom-input" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <input className="fom-input" type="password" minLength={8} placeholder="Temporary password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <input className="fom-input" placeholder="Postal code" value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} required />
          <input className="fom-input" pattern="[0-9]{12}" placeholder="12-digit Aadhaar number" value={form.aadhar_number} onChange={(e) => setForm({ ...form, aadhar_number: e.target.value })} required />
        </>}
        {resource === 'agents' && <>
          <input className="fom-input" placeholder="Agent name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="fom-input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="fom-input" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <input className="fom-input" placeholder="Occupation" value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} />
          <input className="fom-input" placeholder="Agent type" value={form.agent_type} onChange={(e) => setForm({ ...form, agent_type: e.target.value })} />
          <input className="fom-input" placeholder="Experience" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
        </>}
        <button className="fom-btn primary" disabled={saving || (isService && !form.image)}>{saving ? 'Saving...' : `Create ${RESOURCE_META.find((item) => item.key === resource)?.label}`}</button>
      </form>}

      {message && <div className="fom-message">{message}</div>}
      <div className="fom-list">
        {loading ? <div className="fom-meta">Loading...</div> : records.length === 0 ? <div className="fom-meta">No records available.</div> : records.map((record) => (
          <div className="fom-row" key={record.id}>
            <div className="fom-main">
              <div className="fom-name">{record.title || record.label || record.shop_name || record.name || record.email}</div>
              <div className="fom-meta">
                {record.email || record.description || ''} {record.phone ? `• ${record.phone}` : ''} {record.status ? `• ${record.status}` : ''}
              </div>
            </div>
            {resource === 'vendors' && can('vendors.manage_services') && (
              <select multiple className="fom-input fom-services" value={(vendorServices[record.id] || []).map(String)} onChange={(e) => {
                const selected = [...e.target.selectedOptions].map((option) => Number(option.value));
                setVendorServices((current) => ({ ...current, [record.id]: selected }));
              }}>
                {services.map((service) => <option key={service.id} value={service.id}>{service.label}</option>)}
              </select>
            )}
            <div className="fom-actions">
              {isService && can(`${resource}.edit`) && <button className="fom-btn" onClick={() => editService(record)}>Edit</button>}
              {resource === 'quick_services' && can('quick_services.manage_pricing') && <button className="fom-btn" onClick={() => editQuickPricing(record)}>Pricing</button>}
              {isService && can(`${resource}.upload_images`) && <label className="fom-btn">
                Replace Image<input hidden type="file" accept="image/*" onChange={(e) => replaceImage(record, e.target.files?.[0])} />
              </label>}
              {resource === 'quick_services' && can('quick_services.manage_status') && <button className="fom-btn" onClick={() => patchRecord(record, { action: 'status', is_service_active: !record.is_service_active })}>{record.is_service_active ? 'Deactivate' : 'Activate'}</button>}
              {resource === 'vendors' && can('vendors.edit') && <button className="fom-btn" onClick={() => editVendor(record)}>Edit</button>}
              {resource === 'vendors' && can('vendors.approve') && !record.is_approved && <button className="fom-btn primary" onClick={() => patchRecord(record, { action: 'approve' })}>Approve</button>}
              {resource === 'vendors' && can('vendors.reject') && record.verification_status !== 'rejected' && <button className="fom-btn danger" onClick={() => patchRecord(record, { action: 'reject' })}>Reject</button>}
              {resource === 'vendors' && can('vendors.manage_status') && record.is_approved && <button className="fom-btn" onClick={() => patchRecord(record, { action: 'status', active: record.status !== 'active' })}>{record.status === 'active' ? 'Deactivate' : 'Activate'}</button>}
              {resource === 'vendors' && can('vendors.manage_services') && <button className="fom-btn" onClick={() => patchRecord(record, { action: 'services', services: vendorServices[record.id] || [] })}>Save Services</button>}
              {resource === 'agents' && can('agents.edit') && <button className="fom-btn" onClick={() => editAgent(record)}>Edit</button>}
              {resource === 'agents' && can('agents.approve') && record.status !== 'Approved' && <button className="fom-btn primary" onClick={() => patchRecord(record, { action: 'approve' })}>Approve + Login</button>}
              {resource === 'agents' && can('agents.manage_status') && record.status !== 'Rejected' && <button className="fom-btn danger" onClick={() => patchRecord(record, { action: 'status', status: 'Rejected' })}>Reject</button>}
              {resource === 'agents' && can('agents.reset_password') && record.status === 'Approved' && <button className="fom-btn" onClick={() => patchRecord(record, { action: 'reset_password' })}>Reset Password</button>}
              {can(`${resource}.delete`) && <button className="fom-btn danger" onClick={() => removeRecord(record)}>Delete</button>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
