'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { uploadPropertyImages } from '@/lib/property-image-upload';

const ROOM_AMENITIES = ['Wi-Fi', 'AC', 'Bed', 'Wardrobe', 'Parking', 'Attached Bathroom', 'Kitchen', 'Washing Machine'];
const FLAT_BHKS = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'];

/** Preset nearby place types users can multi-select via checkboxes */
const NEARBY_PRESETS = [
  { type: 'airport', name: 'Airport' },
  { type: 'hospital', name: 'Hospital' },
  { type: 'school', name: 'School' },
  { type: 'university', name: 'University / College' },
  { type: 'market', name: 'Market' },
  { type: 'metro', name: 'Metro / Public transport' },
  { type: 'bus_stand', name: 'Bus stand' },
  { type: 'railway', name: 'Railway station' },
  { type: 'park', name: 'Park' },
  { type: 'mall', name: 'Shopping mall' },
  { type: 'bank', name: 'Bank / ATM' },
  { type: 'landmark', name: 'Landmark' },
];

const emptyForm = (category = 'room_rent') => ({
  title: '',
  property_category: category,
  listing_type: category === 'room_rent' ? 'rent' : category === 'plot' ? 'buy' : 'rent',
  type: category === 'room_rent' ? 'Room Rent' : category === 'flat' ? 'Apartment' : category === 'plot' ? 'Plots' : 'Residential',
  price: '',
  price_raw: '',
  security_deposit: '',
  location: '',
  locality: '',
  state: '',
  postal_code: '',
  address: '',
  latitude: '',
  longitude: '',
  description: '',
  furnishing: '',
  available_from: '',
  beds: '',
  baths: '',
  area: '',
  area_unit: 'sqft',
  images: [],
  floor_plans: [],
  documents: [],
  amenities: [],
  nearby_places: [],
  seller_type: 'owner',
  seller_name: '',
  seller_phone: '',
  seller_email: '',
  publish: true,
  details: {},
});

function nearbyKey(place) {
  return `${String(place.type || '').toLowerCase()}::${String(place.name || '').toLowerCase()}`;
}

async function uploadViaAdminApi(files) {
  const token = localStorage.getItem('token') || localStorage.getItem('admin-token');
  const urls = [];
  for (const file of files) {
    const body = new FormData();
    body.append('file', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body,
    });
    const data = await res.json();
    if (!data.success || !data.url) {
      throw new Error(data.error || `Failed to upload ${file.name}`);
    }
    urls.push(data.url);
  }
  return urls;
}

export default function PropertyEditor({
  isDarkMode,
  initialCategory = 'room_rent',
  property = null,
  onSaved,
  onCancel,
}) {
  const [form, setForm] = useState(() => emptyForm(initialCategory));
  const [cities, setCities] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [customNearby, setCustomNearby] = useState({ type: 'landmark', name: '', distance_km: '' });
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch('/api/cities')
      .then((r) => r.json())
      .then((d) => {
        const list = d.data || d.cities || d || [];
        setCities(Array.isArray(list) ? list : []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!property) {
      setForm(emptyForm(initialCategory));
      return;
    }
    setForm({
      ...emptyForm(property.property_category || initialCategory),
      ...property,
      price: property.price || String(property.price_raw || ''),
      price_raw: property.price_raw || '',
      security_deposit: property.security_deposit ?? '',
      details: property.details || {},
      amenities: Array.isArray(property.amenities) ? property.amenities : [],
      nearby_places: Array.isArray(property.nearby_places) ? property.nearby_places : [],
      images: Array.isArray(property.images) ? property.images : [],
      floor_plans: Array.isArray(property.floor_plans) ? property.floor_plans : [],
      documents: Array.isArray(property.documents) ? property.documents : [],
      publish: property.status === 'verified',
    });
  }, [property, initialCategory]);

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const setDetail = (key, value) => setForm((f) => ({ ...f, details: { ...f.details, [key]: value } }));

  const category = form.property_category;
  const images = Array.isArray(form.images) ? form.images : [];

  const styles = useMemo(() => ({
    label: { display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4, color: isDarkMode ? '#a1a1aa' : '#52525b' },
    input: {
      width: '100%', padding: '8px 10px', borderRadius: 6,
      border: `1px solid ${isDarkMode ? '#3f3f46' : '#e4e4e7'}`,
      background: isDarkMode ? '#18181b' : '#fff', color: isDarkMode ? '#fafafa' : '#18181b',
      fontSize: 13, marginBottom: 10,
    },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
    section: { fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.06em', margin: '14px 0 8px', color: isDarkMode ? '#93c5fd' : '#1d4ed8' },
    chip: {
      display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 999,
      border: `1px solid ${isDarkMode ? '#3f3f46' : '#d4d4d8'}`, fontSize: 12, marginRight: 6, marginBottom: 6, cursor: 'pointer',
      background: isDarkMode ? '#27272a' : '#f4f4f5', color: isDarkMode ? '#e4e4e7' : '#27272a',
    },
    checkBox: {
      display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 10px',
      borderRadius: 8, border: `1px solid ${isDarkMode ? '#3f3f46' : '#e4e4e7'}`,
      background: isDarkMode ? '#18181b' : '#fafafa', marginBottom: 8,
    },
  }), [isDarkMode]);

  const toggleAmenity = (name) => {
    setForm((f) => {
      const exists = (f.amenities || []).some((a) => (a.name || a) === name);
      if (exists) return { ...f, amenities: f.amenities.filter((a) => (a.name || a) !== name) };
      return { ...f, amenities: [...(f.amenities || []), { name, enabled: true }] };
    });
  };

  const isNearbyChecked = (preset) =>
    (form.nearby_places || []).some((p) => nearbyKey(p) === nearbyKey(preset));

  const getNearbyDistance = (preset) => {
    const found = (form.nearby_places || []).find((p) => nearbyKey(p) === nearbyKey(preset));
    return found?.distance_km != null ? String(found.distance_km) : '';
  };

  const toggleNearbyPreset = (preset, checked) => {
    setForm((f) => {
      const list = Array.isArray(f.nearby_places) ? [...f.nearby_places] : [];
      const key = nearbyKey(preset);
      if (checked) {
        if (list.some((p) => nearbyKey(p) === key)) return f;
        return { ...f, nearby_places: [...list, { type: preset.type, name: preset.name, distance_km: null }] };
      }
      return { ...f, nearby_places: list.filter((p) => nearbyKey(p) !== key) };
    });
  };

  const setNearbyDistance = (preset, distanceKm) => {
    setForm((f) => ({
      ...f,
      nearby_places: (f.nearby_places || []).map((p) =>
        nearbyKey(p) === nearbyKey(preset)
          ? { ...p, distance_km: distanceKm === '' ? null : Number(distanceKm) }
          : p
      ),
    }));
  };

  const addCustomNearby = () => {
    const name = customNearby.name.trim();
    if (!name) return;
    const place = {
      type: customNearby.type || 'landmark',
      name,
      distance_km: customNearby.distance_km !== '' ? Number(customNearby.distance_km) : null,
    };
    setForm((f) => {
      const list = Array.isArray(f.nearby_places) ? f.nearby_places : [];
      if (list.some((p) => nearbyKey(p) === nearbyKey(place))) return f;
      return { ...f, nearby_places: [...list, place] };
    });
    setCustomNearby({ type: 'landmark', name: '', distance_km: '' });
  };

  const removeNearby = (place) => {
    setForm((f) => ({
      ...f,
      nearby_places: (f.nearby_places || []).filter((p) => nearbyKey(p) !== nearbyKey(place)),
    }));
  };

  const removeImage = (url) => {
    setForm((f) => ({ ...f, images: (f.images || []).filter((img) => img !== url) }));
  };

  const handleDeviceUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (!files.length) return;

    setError('');
    setUploading(true);
    setUploadProgress(0);
    try {
      let urls = [];
      const hasCloudinary =
        Boolean(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)
        && Boolean(process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

      if (hasCloudinary) {
        urls = await uploadPropertyImages(files, setUploadProgress);
      } else {
        urls = await uploadViaAdminApi(files);
        setUploadProgress(100);
      }

      setForm((f) => ({
        ...f,
        images: [...(Array.isArray(f.images) ? f.images : []), ...urls].slice(0, 20),
      }));
    } catch (err) {
      setError(err?.message || 'Image upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const submit = async (asDraft = false) => {
    setError('');
    setSaving(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('admin-token');
      const priceRaw = Number(String(form.price_raw || form.price).replace(/\D/g, '')) || 0;
      const body = {
        ...form,
        images,
        price: String(form.price || priceRaw),
        price_raw: priceRaw,
        security_deposit: form.security_deposit !== '' ? Number(form.security_deposit) : null,
        latitude: form.latitude !== '' ? Number(form.latitude) : null,
        longitude: form.longitude !== '' ? Number(form.longitude) : null,
        beds: form.beds !== '' ? Number(form.beds) : form.details?.bedrooms || null,
        baths: form.baths !== '' ? Number(form.baths) : form.details?.bathrooms || null,
        area: form.area !== '' ? Number(form.area) : form.details?.plot_area || form.details?.carpet_area || null,
        publish: !asDraft && form.publish !== false,
        status: asDraft ? 'pending' : form.publish ? 'verified' : 'pending',
      };

      if (!body.title || !body.location || !priceRaw) {
        setError('Title, city/location, and price are required');
        setSaving(false);
        return;
      }

      const isEdit = Boolean(property?.id);
      const res = await fetch('/api/properties', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(isEdit ? { id: property.id, ...body } : body),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Save failed');
        setSaving(false);
        return;
      }
      onSaved?.(data.data);
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {error ? <div style={{ ...styles.input, borderColor: '#f87171', color: '#b91c1c' }}>{error}</div> : null}

      <div style={styles.section}>Category & listing</div>
      <div style={styles.row}>
        <div>
          <label style={styles.label}>Category</label>
          <select style={styles.input} value={form.property_category} onChange={(e) => {
            const c = e.target.value;
            setForm((f) => ({
              ...f,
              property_category: c,
              listing_type: c === 'room_rent' ? 'rent' : c === 'plot' ? 'buy' : f.listing_type,
              type: c === 'room_rent' ? 'Room Rent' : c === 'flat' ? 'Apartment' : c === 'plot' ? 'Plots' : f.type,
            }));
          }}>
            <option value="room_rent">Room Rent</option>
            <option value="flat">Flat</option>
            <option value="plot">Plot</option>
            <option value="general">General</option>
          </select>
        </div>
        <div>
          <label style={styles.label}>Sale / Rent</label>
          <select style={styles.input} value={form.listing_type} onChange={(e) => setField('listing_type', e.target.value)} disabled={category === 'room_rent' || category === 'plot'}>
            <option value="rent">Rent</option>
            <option value="buy">Sale / Buy</option>
          </select>
        </div>
      </div>

      <label style={styles.label}>Title *</label>
      <input style={styles.input} value={form.title} onChange={(e) => setField('title', e.target.value)} placeholder="e.g. Spacious 2 BHK near Civil Lines" />

      <div style={styles.row}>
        <div>
          <label style={styles.label}>{form.listing_type === 'rent' ? 'Monthly rent *' : 'Price *'}</label>
          <input style={styles.input} value={form.price} onChange={(e) => setField('price', e.target.value)} />
        </div>
        <div>
          <label style={styles.label}>Security deposit</label>
          <input style={styles.input} value={form.security_deposit} onChange={(e) => setField('security_deposit', e.target.value)} />
        </div>
      </div>

      <div style={styles.section}>Location</div>
      <div style={styles.row}>
        <div>
          <label style={styles.label}>City *</label>
          <select style={styles.input} value={form.location} onChange={(e) => setField('location', e.target.value)}>
            <option value="">Select city</option>
            {cities.map((c) => {
              const name = c.city_name || c.name || c.city || c;
              return <option key={name} value={name}>{name}</option>;
            })}
          </select>
        </div>
        <div>
          <label style={styles.label}>Locality</label>
          <input style={styles.input} value={form.locality || ''} onChange={(e) => setField('locality', e.target.value)} />
        </div>
      </div>
      <div style={styles.row}>
        <div>
          <label style={styles.label}>State</label>
          <input style={styles.input} value={form.state || ''} onChange={(e) => setField('state', e.target.value)} />
        </div>
        <div>
          <label style={styles.label}>Postal code</label>
          <input style={styles.input} value={form.postal_code || ''} onChange={(e) => setField('postal_code', e.target.value)} />
        </div>
      </div>
      <label style={styles.label}>Full address</label>
      <textarea style={{ ...styles.input, minHeight: 70 }} value={form.address || ''} onChange={(e) => setField('address', e.target.value)} />
      <div style={styles.row}>
        <div>
          <label style={styles.label}>Latitude</label>
          <input style={styles.input} value={form.latitude || ''} onChange={(e) => setField('latitude', e.target.value)} />
        </div>
        <div>
          <label style={styles.label}>Longitude</label>
          <input style={styles.input} value={form.longitude || ''} onChange={(e) => setField('longitude', e.target.value)} />
        </div>
      </div>

      {category === 'room_rent' && (
        <>
          <div style={styles.section}>Room details</div>
          <div style={styles.row}>
            <div>
              <label style={styles.label}>Room type</label>
              <select style={styles.input} value={form.details.room_type || ''} onChange={(e) => setDetail('room_type', e.target.value)}>
                <option value="">Select</option>
                <option value="single">Single room</option>
                <option value="shared">Shared room</option>
                <option value="independent">Independent room</option>
                <option value="pg">PG</option>
              </select>
            </div>
            <div>
              <label style={styles.label}>Suitable for</label>
              <input style={styles.input} value={form.details.suitable_for || ''} onChange={(e) => setDetail('suitable_for', e.target.value)} placeholder="Students / Working professionals" />
            </div>
          </div>
          <div style={styles.row}>
            <div>
              <label style={styles.label}>Furnishing</label>
              <select style={styles.input} value={form.furnishing || ''} onChange={(e) => setField('furnishing', e.target.value)}>
                <option value="">Select</option>
                <option value="furnished">Furnished</option>
                <option value="semi-furnished">Semi-furnished</option>
                <option value="unfurnished">Unfurnished</option>
              </select>
            </div>
            <div>
              <label style={styles.label}>Available from</label>
              <input type="date" style={styles.input} value={form.available_from || ''} onChange={(e) => setField('available_from', e.target.value)} />
            </div>
          </div>
          <label style={styles.label}>House rules</label>
          <textarea style={{ ...styles.input, minHeight: 60 }} value={form.details.house_rules || ''} onChange={(e) => setDetail('house_rules', e.target.value)} />
          <div style={{ marginBottom: 8 }}>
            {ROOM_AMENITIES.map((name) => {
              const active = (form.amenities || []).some((a) => (a.name || a) === name);
              return (
                <button type="button" key={name} style={{ ...styles.chip, borderColor: active ? '#2563eb' : styles.chip.border, color: active ? '#2563eb' : styles.chip.color }} onClick={() => toggleAmenity(name)}>
                  {active ? '✓ ' : ''}{name}
                </button>
              );
            })}
          </div>
        </>
      )}

      {category === 'flat' && (
        <>
          <div style={styles.section}>Flat details</div>
          <div style={styles.row}>
            <div>
              <label style={styles.label}>Configuration</label>
              <select style={styles.input} value={form.details.bhk_config || ''} onChange={(e) => setDetail('bhk_config', e.target.value)}>
                <option value="">Select BHK</option>
                {FLAT_BHKS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label style={styles.label}>Furnishing</label>
              <select style={styles.input} value={form.furnishing || ''} onChange={(e) => setField('furnishing', e.target.value)}>
                <option value="">Select</option>
                <option value="furnished">Furnished</option>
                <option value="semi-furnished">Semi-furnished</option>
                <option value="unfurnished">Unfurnished</option>
              </select>
            </div>
          </div>
          <div style={styles.row}>
            <div>
              <label style={styles.label}>Carpet area</label>
              <input style={styles.input} value={form.details.carpet_area || ''} onChange={(e) => setDetail('carpet_area', e.target.value)} />
            </div>
            <div>
              <label style={styles.label}>Built-up area</label>
              <input style={styles.input} value={form.details.builtup_area || ''} onChange={(e) => setDetail('builtup_area', e.target.value)} />
            </div>
          </div>
          <div style={styles.row}>
            <div>
              <label style={styles.label}>Floor</label>
              <input style={styles.input} value={form.details.floor_number || ''} onChange={(e) => setDetail('floor_number', e.target.value)} />
            </div>
            <div>
              <label style={styles.label}>Total floors</label>
              <input style={styles.input} value={form.details.total_floors || ''} onChange={(e) => setDetail('total_floors', e.target.value)} />
            </div>
          </div>
          <div style={styles.row}>
            <div>
              <label style={styles.label}>Bedrooms</label>
              <input style={styles.input} value={form.details.bedrooms || form.beds || ''} onChange={(e) => { setDetail('bedrooms', e.target.value); setField('beds', e.target.value); }} />
            </div>
            <div>
              <label style={styles.label}>Bathrooms</label>
              <input style={styles.input} value={form.details.bathrooms || form.baths || ''} onChange={(e) => { setDetail('bathrooms', e.target.value); setField('baths', e.target.value); }} />
            </div>
          </div>
          <div style={styles.row}>
            <div>
              <label style={styles.label}>Balconies</label>
              <input style={styles.input} value={form.details.balconies || ''} onChange={(e) => setDetail('balconies', e.target.value)} />
            </div>
            <div>
              <label style={styles.label}>Parking spaces</label>
              <input style={styles.input} value={form.details.parking_spaces || ''} onChange={(e) => setDetail('parking_spaces', e.target.value)} />
            </div>
          </div>
          <div style={styles.row}>
            <div>
              <label style={styles.label}>Possession</label>
              <input style={styles.input} value={form.details.possession_status || ''} onChange={(e) => setDetail('possession_status', e.target.value)} />
            </div>
            <div>
              <label style={styles.label}>Property age</label>
              <input style={styles.input} value={form.details.property_age || ''} onChange={(e) => setDetail('property_age', e.target.value)} />
            </div>
          </div>
        </>
      )}

      {category === 'plot' && (
        <>
          <div style={styles.section}>Plot details</div>
          <div style={styles.row}>
            <div>
              <label style={styles.label}>Intended use</label>
              <select style={styles.input} value={form.details.plot_category || ''} onChange={(e) => setDetail('plot_category', e.target.value)}>
                <option value="">Select</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
                <option value="agricultural">Agricultural</option>
              </select>
            </div>
            <div>
              <label style={styles.label}>Plot area</label>
              <input style={styles.input} value={form.details.plot_area || form.area || ''} onChange={(e) => { setDetail('plot_area', e.target.value); setField('area', e.target.value); }} />
            </div>
          </div>
          <div style={styles.row}>
            <div>
              <label style={styles.label}>Length</label>
              <input style={styles.input} value={form.details.length || ''} onChange={(e) => setDetail('length', e.target.value)} />
            </div>
            <div>
              <label style={styles.label}>Width</label>
              <input style={styles.input} value={form.details.width || ''} onChange={(e) => setDetail('width', e.target.value)} />
            </div>
          </div>
          <div style={styles.row}>
            <div>
              <label style={styles.label}>Price / unit area</label>
              <input style={styles.input} value={form.details.price_per_unit || ''} onChange={(e) => setDetail('price_per_unit', e.target.value)} />
            </div>
            <div>
              <label style={styles.label}>Facing</label>
              <input style={styles.input} value={form.details.facing || ''} onChange={(e) => setDetail('facing', e.target.value)} />
            </div>
          </div>
          <div style={styles.row}>
            <div>
              <label style={styles.label}>Road width</label>
              <input style={styles.input} value={form.details.road_width || ''} onChange={(e) => setDetail('road_width', e.target.value)} />
            </div>
            <div>
              <label style={styles.label}>Development status</label>
              <input style={styles.input} value={form.details.development_status || ''} onChange={(e) => setDetail('development_status', e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
            {[
              ['price_negotiable', 'Negotiable'],
              ['boundary_wall', 'Boundary wall'],
              ['water', 'Water'],
              ['electricity', 'Electricity'],
              ['drainage', 'Drainage'],
            ].map(([key, label]) => (
              <label key={key} style={{ fontSize: 13, display: 'flex', gap: 6, alignItems: 'center' }}>
                <input type="checkbox" checked={Boolean(form.details[key])} onChange={(e) => setDetail(key, e.target.checked)} />
                {label}
              </label>
            ))}
          </div>
        </>
      )}

      <div style={styles.section}>Nearby places</div>
      <p style={{ fontSize: 12, color: isDarkMode ? '#a1a1aa' : '#71717a', marginBottom: 10 }}>
        Select all that apply. Optionally add distance (km) for each.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
        {NEARBY_PRESETS.map((preset) => {
          const checked = isNearbyChecked(preset);
          return (
            <div key={nearbyKey(preset)} style={styles.checkBox}>
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => toggleNearbyPreset(preset, e.target.checked)}
                style={{ marginTop: 2 }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{preset.name}</div>
                {checked ? (
                  <input
                    style={{ ...styles.input, marginBottom: 0, marginTop: 6 }}
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="Distance (km)"
                    value={getNearbyDistance(preset)}
                    onChange={(e) => setNearbyDistance(preset, e.target.value)}
                  />
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <label style={styles.label}>Add custom nearby place</label>
      <div style={styles.row}>
        <select
          style={styles.input}
          value={customNearby.type}
          onChange={(e) => setCustomNearby((d) => ({ ...d, type: e.target.value }))}
        >
          {NEARBY_PRESETS.map((p) => (
            <option key={p.type} value={p.type}>{p.name}</option>
          ))}
        </select>
        <input
          style={styles.input}
          placeholder="Place name"
          value={customNearby.name}
          onChange={(e) => setCustomNearby((d) => ({ ...d, name: e.target.value }))}
        />
      </div>
      <div style={styles.row}>
        <input
          style={styles.input}
          type="number"
          min="0"
          step="0.1"
          placeholder="Distance (km)"
          value={customNearby.distance_km}
          onChange={(e) => setCustomNearby((d) => ({ ...d, distance_km: e.target.value }))}
        />
        <button type="button" style={{ ...styles.input, cursor: 'pointer', fontWeight: 700 }} onClick={addCustomNearby}>
          Add custom place
        </button>
      </div>

      {(form.nearby_places || []).length > 0 ? (
        <div style={{ marginBottom: 12 }}>
          {(form.nearby_places || []).map((place) => (
            <div key={nearbyKey(place)} style={{ ...styles.chip, display: 'inline-flex', borderRadius: 6 }}>
              <span>
                {place.name}
                {place.distance_km != null && place.distance_km !== '' ? ` · ${place.distance_km} km` : ''}
              </span>
              <button type="button" onClick={() => removeNearby(place)} aria-label={`Remove ${place.name}`} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'inherit' }}>
                ×
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <div style={styles.section}>Media & owner</div>
      <label style={styles.label}>Property photos</label>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/*"
        multiple
        hidden
        onChange={handleDeviceUpload}
      />
      <button
        type="button"
        disabled={uploading || saving}
        onClick={() => fileInputRef.current?.click()}
        style={{
          width: '100%',
          padding: '14px 12px',
          marginBottom: 10,
          borderRadius: 8,
          border: `2px dashed ${isDarkMode ? '#3f3f46' : '#d4d4d8'}`,
          background: isDarkMode ? '#18181b' : '#fafafa',
          color: isDarkMode ? '#e4e4e7' : '#18181b',
          fontWeight: 700,
          fontSize: 13,
          cursor: uploading ? 'wait' : 'pointer',
        }}
      >
        {uploading ? `Uploading… ${uploadProgress}%` : 'Upload images from device'}
      </button>
      {uploading ? (
        <div style={{ height: 6, borderRadius: 999, background: isDarkMode ? '#27272a' : '#e4e4e7', marginBottom: 12, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${uploadProgress}%`, background: '#2563eb', transition: 'width .2s' }} />
        </div>
      ) : null}

      {images.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 12 }}>
          {images.map((url) => (
            <div key={url} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: `1px solid ${isDarkMode ? '#3f3f46' : '#e4e4e7'}` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" style={{ width: '100%', height: 80, objectFit: 'cover', display: 'block' }} />
              <button
                type="button"
                onClick={() => removeImage(url)}
                style={{
                  position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: 999,
                  border: 'none', background: 'rgba(0,0,0,.7)', color: '#fff', cursor: 'pointer', fontSize: 14, lineHeight: '22px',
                }}
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: 12, color: isDarkMode ? '#a1a1aa' : '#71717a', marginBottom: 12 }}>
          No photos yet. Upload JPG, PNG, or WEBP from your device.
        </p>
      )}

      <label style={styles.label}>Description</label>
      <textarea style={{ ...styles.input, minHeight: 80 }} value={form.description || ''} onChange={(e) => setField('description', e.target.value)} />
      <div style={styles.row}>
        <div>
          <label style={styles.label}>Owner / agent name</label>
          <input style={styles.input} value={form.seller_name || ''} onChange={(e) => setField('seller_name', e.target.value)} />
        </div>
        <div>
          <label style={styles.label}>Phone</label>
          <input style={styles.input} value={form.seller_phone || ''} onChange={(e) => setField('seller_phone', e.target.value)} />
        </div>
      </div>
      <label style={styles.label}>Email</label>
      <input style={styles.input} value={form.seller_email || ''} onChange={(e) => setField('seller_email', e.target.value)} />

      <label style={{ ...styles.label, display: 'flex', gap: 8, alignItems: 'center' }}>
        <input type="checkbox" checked={form.publish !== false} onChange={(e) => setField('publish', e.target.checked)} />
        Publish immediately (verified)
      </label>

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button type="button" disabled={saving || uploading} onClick={() => submit(false)} style={{ flex: 1, padding: '10px 12px', borderRadius: 6, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
          {saving ? 'Saving…' : property ? 'Update property' : 'Create & publish'}
        </button>
        <button type="button" disabled={saving || uploading} onClick={() => submit(true)} style={{ padding: '10px 12px', borderRadius: 6, border: `1px solid ${isDarkMode ? '#3f3f46' : '#d4d4d8'}`, background: 'transparent', color: isDarkMode ? '#e4e4e7' : '#18181b', fontWeight: 700, cursor: 'pointer' }}>
          Save draft
        </button>
        {onCancel ? (
          <button type="button" onClick={onCancel} style={{ padding: '10px 12px', borderRadius: 6, border: 'none', background: isDarkMode ? '#3f3f46' : '#e4e4e7', fontWeight: 700, cursor: 'pointer' }}>
            Cancel
          </button>
        ) : null}
      </div>
    </div>
  );
}
