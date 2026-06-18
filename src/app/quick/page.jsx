'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const TIME_SLOTS = [
  '08:00 AM – 10:00 AM',
  '10:00 AM – 12:00 PM',
  '12:00 PM – 02:00 PM',
  '02:00 PM – 04:00 PM',
  '04:00 PM – 06:00 PM',
  '06:00 PM – 08:00 PM',
];

const PROPERTY_TYPES = ['Apartment', 'Independent House', 'Villa', 'Office / Commercial', 'Shop / Showroom', 'Other'];

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

// ─── Booking Modal ─────────────────────────────────────────────────────────────
function BookingModal({ service, isDark, onClose, onSuccess, initialForm, initialStep, initialSlotType, initialSelectedFreeSlot }) {
  const router = useRouter();

  const [step, setStep] = useState(initialStep || 1); // 1 = details, 2 = confirm, 3 = success
  const [form, setForm] = useState(() => {
    const defaultFields = {
      name: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      pincode: '',
      propertyType: '',
      propertyTypeOther: '',
      date: '',
      timeSlot: '',
      description: '',
      latitude: null,
      longitude: null,
      locationUrl: '',
    };
    return initialForm ? { ...defaultFields, ...initialForm } : defaultFields;
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [slotType, setSlotType] = useState(initialSlotType || 'paid'); // 'free' | 'paid'
  const [freeSlots, setFreeSlots] = useState([]);
  const [paidSlots, setPaidSlots] = useState(TIME_SLOTS.map((timeSlot) => ({ time_slot: timeSlot, is_available: true })));
  const [selectedFreeSlot, setSelectedFreeSlot] = useState(initialSelectedFreeSlot || null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [paidSlotsLoading, setPaidSlotsLoading] = useState(false);

  // ✅ FIX: Use admin_base_price or fallback to base_price — force number to avoid string concat
  const basePrice = parseFloat(service.admin_base_price || service.base_price || 199);
  const taxAmount = Math.round((basePrice * 18) / 100);
  const totalAmount = basePrice + taxAmount;

  const overlay = isDark ? 'bg-black/80' : 'bg-zinc-900/60';
  const modal = isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900';
  const input = isDark
    ? 'bg-zinc-900 border-zinc-700 text-white placeholder-zinc-600 focus:border-[var(--brand-blue)]'
    : 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900';
  const label = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const muted = isDark ? 'text-zinc-500' : 'text-zinc-400';
  const divider = isDark ? 'border-zinc-800' : 'border-zinc-100';
  const pillBase = 'px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer';
  const pillActive = isDark
    ? 'border-[var(--brand-blue)] bg-[var(--brand-blue)] text-black'
    : 'border-zinc-900 bg-zinc-900 text-white';
  const pillInactive = isDark
    ? 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
    : 'border-zinc-300 text-zinc-500 hover:border-zinc-500';

  function set(field, val) {
    setForm((f) => ({ ...f, [field]: val }));
    setErrors((e) => ({ ...e, [field]: '' }));
  }

  // Get user's live location
  function getCurrentLocation() {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          set('latitude', latitude);
          set('longitude', longitude);
          set('locationUrl', `https://maps.google.com/?q=${latitude},${longitude}`);
          setLocationLoading(false);
        },
        (error) => {
          console.error('Location error:', error);
          setErrors((e) => ({ ...e, location: 'Could not access location. Please enable GPS.' }));
          setLocationLoading(false);
        }
      );
    }
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Valid 10-digit phone required';
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.pincode || form.pincode.length !== 6) e.pincode = 'Valid 6-digit pincode required';
    if (!form.propertyType) e.propertyType = 'Select property type';
    if (slotType === 'free') {
      if (!selectedFreeSlot) e.freeSlot = 'Select a free slot';
    } else {
      if (!form.date) e.date = 'Select a date';
      if (!form.timeSlot) e.timeSlot = 'Select a time slot';
    }
    if (!form.latitude || !form.longitude) e.location = "Location is required. Please click 'Get Location'";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (validate()) setStep(2);
  }

  async function handleConfirm() {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Save the entire booking form before redirecting so it can be restored after login
        try {
          localStorage.setItem('pendingBooking', JSON.stringify({
            service,
            form,
            slotType,
            selectedFreeSlot,
            step: 2,
          }));
        } catch (e) { /* localStorage might be full — proceed to login anyway */ }
        router.push('/login?redirect=/quick');
        return;
      }

      const bookingDate = slotType === 'free' ? selectedFreeSlot.slot_date : form.date;
      const bookingTime = slotType === 'free'
        ? `${selectedFreeSlot.slot_start} – ${selectedFreeSlot.slot_end}`
        : form.timeSlot;

      const bookingData = {
        quick_service_id: service.id,
        user_name: form.name,
        user_phone: form.phone,
        user_email: form.email || null,
        service_address: form.address,
        service_city: form.city,
        service_pincode: form.pincode,
        property_type: form.propertyType === 'Other' ? (form.propertyTypeOther.trim() || 'Other') : form.propertyType,
        booking_date: bookingDate,
        booking_time: bookingTime,
        slot_type: slotType,
        time_slot_id: slotType === 'free' ? selectedFreeSlot.id : null,
        user_latitude: form.latitude,
        user_longitude: form.longitude,
        location_map_url: form.locationUrl,
        service_description: form.description,
      };

      const res = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrors({ submit: data.error || 'Booking failed' });
        return;
      }

      setStep(3);
    } catch (error) {
      console.error('Booking error:', error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  }

  // Fetch free slots when city is set and user switches to free mode
  useEffect(() => {
    if (slotType !== 'free' || !form.city.trim()) return;
    setSlotsLoading(true);
    fetch(`/api/free-slots?city=${encodeURIComponent(form.city)}&service_id=${service.id}&date=${getTodayStr()}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setFreeSlots(d.data);
          setSelectedFreeSlot((current) => (
            current && d.data.some((slot) => slot.id === current.id) ? current : null
          ));
        }
      })
      .catch(() => {})
      .finally(() => setSlotsLoading(false));
  }, [slotType, form.city, service.id]);

  useEffect(() => {
    if (slotType !== 'paid' || !form.city.trim() || !form.date) {
      setPaidSlots(TIME_SLOTS.map((timeSlot) => ({ time_slot: timeSlot, is_available: true })));
      return;
    }

    setPaidSlotsLoading(true);
    fetch(`/api/paid-slots?city=${encodeURIComponent(form.city)}&service_id=${service.id}&date=${form.date}&t=${Date.now()}`, {
      cache: 'no-store',
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          const slots = d.data || [];
          setPaidSlots(slots);
          const available = slots.filter((slot) => slot.is_available).map((slot) => slot.time_slot);
          if (form.timeSlot && !available.includes(form.timeSlot)) {
            set('timeSlot', '');
          }
        }
      })
      .catch(() => {})
      .finally(() => setPaidSlotsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slotType, form.city, form.date, service.id]);

  // Trap scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      className={`backdrop-blur-sm ${overlay}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full border shadow-2xl flex flex-col ${modal}`}
        style={{ maxHeight: 'calc(100vh - 32px)', maxWidth: '576px', width: '100%', zIndex: 100000 }}
      >
        {/* ── Header ── */}
        <div className={`flex-shrink-0 flex items-center justify-between px-6 py-4 border-b ${divider}`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{service.icon}</span>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--brand-blue)]">Book Service</p>
              <h2 className="text-lg font-black uppercase tracking-tight">{service.label}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 flex items-center justify-center border transition-all font-black text-sm ${isDark ? 'border-zinc-700 text-zinc-400 hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]' : 'border-zinc-300 text-zinc-400 hover:border-zinc-900 hover:text-zinc-900'}`}
          >
            ✕
          </button>
        </div>

        {/* ── Step Indicator ── */}
        {step < 3 && (
          <div className={`flex-shrink-0 flex border-b ${divider}`}>
            {['Your Details', 'Confirm & Pay'].map((s, i) => (
              <div
                key={i}
                className={`flex-1 py-2.5 text-center text-[9px] font-black uppercase tracking-widest transition-all ${
                  step === i + 1 ? "text-[var(--brand-blue)] border-b-2 border-[var(--brand-blue)]" : muted
                }`}
              >
                {i + 1}. {s}
              </div>
            ))}
          </div>
        )}

        {/* ── Scrollable Content ── */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>

          {/* ══ STEP 1 ══ */}
          {step === 1 && (
            <div className="p-6 space-y-5">

              {/* Service Info Bar */}
              <div className={`border overflow-hidden ${isDark ? 'border-zinc-800' : 'border-sky-200'}`}>
                {/* Top: price + duration */}
                <div className={`flex items-center justify-between px-4 py-3 ${isDark ? 'bg-zinc-900' : 'bg-sky-50'}`}>
                  <div>
                    <p className={`text-[8px] uppercase tracking-widest font-black mb-0.5 ${muted}`}>Visit / Inspection Charge</p>
                    <p className="text-xl font-black text-[var(--brand-blue)]">₹{basePrice} <span className={`text-[10px] font-bold ${muted}`}>only</span></p>
                  </div>
                  <div className="text-right">
                    <p className={`text-[8px] uppercase tracking-widest font-black mb-0.5 ${muted}`}>Duration</p>
                    <p className={`text-sm font-black ${isDark ? 'text-white' : 'text-zinc-800'}`}>15 mins</p>
                  </div>
                </div>
                {/* Bottom: clarification banner */}
                <div className={`flex items-start gap-2.5 px-4 py-2.5 border-t ${isDark ? 'border-zinc-800 bg-black' : 'border-sky-200 bg-sky-100/60'}`}>
                  <span className="text-base shrink-0 mt-0.5">⚠️</span>
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-wide mb-0.5 ${isDark ? 'text-[var(--brand-blue-light)]' : 'text-[var(--brand-blue-deep)]'}`}>
                      ₹{basePrice} is the visit/inspection fee only
                    </p>
                    <p className={`text-[10px] leading-relaxed ${isDark ? 'text-zinc-400' : 'text-[var(--brand-blue-deeper)]'}`}>
                      Actual repair &amp; work charges are <strong>separate</strong> and will be quoted by the technician <strong>after on-site inspection</strong>. You decide before any work begins.
                    </p>
                  </div>
                </div>
              </div>

              <SectionTitle isDark={isDark}>Personal Information</SectionTitle>

              <Field label="Full Name *" error={errors.name} isDark={isDark}>
                <input
                  className={`w-full px-3 py-2.5 text-sm border outline-none transition-all ${input}`}
                  placeholder="e.g. Rahul Sharma"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Phone *" error={errors.phone} isDark={isDark}>
                  <input
                    className={`w-full px-3 py-2.5 text-sm border outline-none transition-all ${input}`}
                    placeholder="10-digit mobile"
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value.replace(/\D/g, ''))}
                  />
                </Field>
                <Field label="Email (optional)" error={errors.email} isDark={isDark}>
                  <input
                    className={`w-full px-3 py-2.5 text-sm border outline-none transition-all ${input}`}
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                  />
                </Field>
              </div>

              <SectionTitle isDark={isDark}>Service Address</SectionTitle>

              <Field label="Full Address *" error={errors.address} isDark={isDark}>
                <textarea
                  rows={2}
                  className={`w-full px-3 py-2.5 text-sm border outline-none transition-all resize-none ${input}`}
                  placeholder="House/Flat No., Street, Landmark…"
                  value={form.address}
                  onChange={(e) => set('address', e.target.value)}
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="City *" error={errors.city} isDark={isDark}>
                  <input
                    className={`w-full px-3 py-2.5 text-sm border outline-none transition-all opacity-70 cursor-not-allowed ${input}`}
                    placeholder="e.g. Delhi"
                    value={form.city}
                    readOnly
                  />
                </Field>
                <Field label="Pincode *" error={errors.pincode} isDark={isDark}>
                  <input
                    className={`w-full px-3 py-2.5 text-sm border outline-none transition-all ${input}`}
                    placeholder="6-digit pincode"
                    maxLength={6}
                    value={form.pincode}
                    onChange={(e) => set('pincode', e.target.value.replace(/\D/g, ''))}
                  />
                </Field>
              </div>

              <Field label="Property Type *" error={errors.propertyType} isDark={isDark}>
                <div className="flex flex-wrap gap-2 mt-1">
                  {PROPERTY_TYPES.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => set('propertyType', p)}
                      className={`${pillBase} ${form.propertyType === p ? pillActive : pillInactive}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                {form.propertyType === 'Other' && (
                  <input
                    className={`w-full mt-2 px-3 py-2.5 text-sm border outline-none transition-all ${input}`}
                    placeholder="Please specify your property type…"
                    value={form.propertyTypeOther || ''}
                    onChange={(e) => set('propertyTypeOther', e.target.value)}
                  />
                )}
              </Field>

              <SectionTitle isDark={isDark}>Location</SectionTitle>

              <Field label="Live Location *" error={errors.location} isDark={isDark}>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                  className={`w-full py-2.5 px-3 text-[10px] font-black uppercase tracking-widest border transition-all ${
                    locationLoading
                      ? 'opacity-50 cursor-not-allowed'
                      : form.latitude && form.longitude
                      ? 'border-green-500 text-green-500 hover:bg-green-500/10'
                      : isDark
                      ? 'border-[var(--brand-blue)] text-[var(--brand-blue)] hover:bg-[var(--brand-blue)]/10'
                      : 'border-zinc-900 text-zinc-900 hover:bg-zinc-50'
                  }`}
                >
                  {locationLoading ? 'Getting Location...' : form.latitude ? '✓ Location Captured' : '📍 Get Live Location'}
                </button>
              </Field>

              <SectionTitle isDark={isDark}>Schedule & Timing</SectionTitle>

              {/* Slot type toggle */}
              <div className="flex gap-3">
                {[
                  { key: 'paid', icon: '📅', label: 'Choose My Time', sub: 'Pick any date & slot' },
                  { key: 'free', icon: '🎁', label: 'Free Admin Slot', sub: 'Pre-scheduled, no extra fee' },
                ].map(({ key, icon, label, sub }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => { setSlotType(key); setSelectedFreeSlot(null); }}
                    className={`flex-1 p-3 border text-left transition-all ${
                      slotType === key
                        ? isDark ? 'border-[var(--brand-blue)] bg-[var(--brand-blue)]/10' : 'border-zinc-900 bg-zinc-50'
                        : isDark ? 'border-zinc-800' : 'border-zinc-200'
                    }`}
                  >
                    <p className={`text-[10px] font-black uppercase tracking-widest ${
                      slotType === key ? (isDark ? 'text-[var(--brand-blue)]' : 'text-zinc-900') : muted
                    }`}>{icon} {label}</p>
                    <p className={`text-[10px] mt-0.5 ${muted}`}>{sub}</p>
                  </button>
                ))}
              </div>

              {/* FREE SLOT: show available admin slots */}
              {slotType === 'free' && (
                <Field label="Available Free Slots *" error={errors.freeSlot} isDark={isDark}>
                  {!form.city.trim() ? (
                    <p className={`text-[10px] font-bold ${muted}`}>Enter your city above to see available free slots.</p>
                  ) : slotsLoading ? (
                    <p className={`text-[10px] animate-pulse ${muted}`}>Loading slots...</p>
                  ) : freeSlots.length === 0 ? (
                    <div className={`p-3 border ${isDark ? 'border-zinc-700 bg-zinc-900' : 'border-sky-200 bg-sky-50'}`}>
                      <p className={`text-[10px] font-black uppercase tracking-wide mb-1 ${isDark ? 'text-[var(--brand-blue-light)]' : 'text-[var(--brand-blue-deep)]'}`}>
                        No upcoming slots in {form.city}
                      </p>
                      <p className={`text-[10px] leading-relaxed ${isDark ? 'text-zinc-400' : 'text-[var(--brand-blue-deeper)]'}`}>
                        The admin hasn&apos;t scheduled a free slot for your city yet — or existing slots may have expired. Please choose <strong>your own time</strong> instead, or check back later.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 mt-1">
                      {freeSlots.map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => { setSelectedFreeSlot(slot); setErrors((e) => ({ ...e, freeSlot: '' })); }}
                          className={`p-3 border text-left transition-all ${
                            selectedFreeSlot?.id === slot.id
                              ? isDark ? 'border-[var(--brand-blue)] bg-[var(--brand-blue)]/10' : 'border-zinc-900 bg-zinc-50'
                              : isDark ? 'border-zinc-800 hover:border-zinc-600' : 'border-zinc-200 hover:border-zinc-400'
                          }`}
                        >
                          <p className={`text-[10px] font-black uppercase tracking-widest ${selectedFreeSlot?.id === slot.id ? (isDark ? 'text-[var(--brand-blue)]' : 'text-zinc-900') : muted}`}>
                            {new Date(slot.slot_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                          <p className={`text-xs font-bold mt-0.5 ${selectedFreeSlot?.id === slot.id ? (isDark ? 'text-white' : 'text-zinc-900') : ''}`}>
                            {slot.slot_start?.slice(0, 5)} – {slot.slot_end?.slice(0, 5)}
                          </p>
                          <p className={`text-[10px] mt-0.5 ${muted}`}>
                            {slot.max_bookings - (slot.current_bookings || 0)} slot{slot.max_bookings - (slot.current_bookings || 0) !== 1 ? 's' : ''} left
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </Field>
              )}

              {/* PAID SLOT: date + time pickers */}
              {slotType === 'paid' && (
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Preferred Date *" error={errors.date} isDark={isDark}>
                    <input
                      type="date"
                      min={getTodayStr()}
                      className={`w-full px-3 py-2.5 text-sm border outline-none transition-all ${input}`}
                      value={form.date}
                      onChange={(e) => set('date', e.target.value)}
                    />
                  </Field>

                  <Field label="Time Slot *" error={errors.timeSlot} isDark={isDark}>
                    <select
                      className={`w-full px-3 py-2.5 text-sm border outline-none transition-all ${input}`}
                      value={form.timeSlot}
                      onChange={(e) => set('timeSlot', e.target.value)}
                    >
                      <option value="">{paidSlotsLoading ? 'Loading slots...' : 'Select slot'}</option>
                      {paidSlots.filter((slot) => slot.is_available).map((slot) => (
                        <option key={slot.time_slot} value={slot.time_slot}>{slot.time_slot}</option>
                      ))}
                    </select>
                    {!paidSlotsLoading && form.city && form.date && paidSlots.filter((slot) => slot.is_available).length === 0 && (
                      <p className={`text-[10px] mt-2 font-bold ${muted}`}>No paid slots available for this date. Please choose another date.</p>
                    )}
                  </Field>
                </div>
              )}


              <Field label="Describe the Problem (optional)" isDark={isDark}>
                <textarea
                  rows={3}
                  className={`w-full px-3 py-2.5 text-sm border outline-none transition-all resize-none ${input}`}
                  placeholder="Tell us more so our expert comes prepared…"
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                />
              </Field>

              <button
                onClick={handleNext}
                className="w-full py-3.5 bg-[var(--brand-blue)] text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[var(--brand-blue-light)] transition-all"
              >
                Proceed to Confirm →
              </button>
            </div>
          )}

          {/* ══ STEP 2: Confirm ══ */}
          {step === 2 && (
            <div className="p-6 space-y-5">
              <SectionTitle isDark={isDark}>Booking Summary</SectionTitle>

              <div className={`border divide-y ${divider} ${isDark ? 'divide-zinc-800' : 'divide-zinc-100'}`}>
                {[
                  ['Service', `${service.icon} ${service.label}`],
                  ['Name', form.name],
                  ['Phone', form.phone],
                  ['Email', form.email || '—'],
                  ['Address', `${form.address}, ${form.city} – ${form.pincode}`],
                  ['Property', form.propertyType === 'Other' ? (form.propertyTypeOther.trim() || 'Other') : form.propertyType],
                  ['Date', form.date],
                  ['Time Slot', form.timeSlot],
                  ['Issue', form.description || '—'],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-4 px-4 py-2.5">
                    <p className={`text-[10px] font-black uppercase tracking-widest w-24 shrink-0 ${muted}`}>{k}</p>
                    <p className={`text-xs font-medium ${isDark ? 'text-white' : 'text-zinc-800'}`}>{v}</p>
                  </div>
                ))}
              </div>

              <SectionTitle isDark={isDark}>Charges Breakdown</SectionTitle>

              {/* Visit fee clarification box */}
              <div className={`flex items-start gap-2.5 p-3 border ${isDark ? 'border-zinc-700 bg-zinc-900' : 'border-sky-200 bg-sky-50'}`}>
                <span className="text-base shrink-0">⚠️</span>
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-wide mb-0.5 ${isDark ? 'text-[var(--brand-blue-light)]' : 'text-[var(--brand-blue-deep)]'}`}>
                    Visit fee — ₹{basePrice} only
                  </p>
                  <p className={`text-[10px] leading-relaxed ${isDark ? 'text-zinc-400' : 'text-[var(--brand-blue-deeper)]'}`}>
                    This covers the technician&apos;s visit &amp; inspection. <strong>Repair / work charges are separate</strong> and will be communicated on-site before any work starts.
                  </p>
                </div>
              </div>

              <div className={`border ${divider}`}>
                {[
                  ['Visit / Inspection Fee', `₹${basePrice}`],
                  ['GST (18%)', `₹${taxAmount}`],
                  ['Amount Due Now', `₹${totalAmount}`],
                ].map(([k, v], i) => (
                  <div key={i} className={`flex justify-between px-4 py-2.5 border-b last:border-0 ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
                    <div>
                      <p className={`text-xs ${i === 2 ? 'font-black' : 'font-medium'} ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{k}</p>
                      {i === 2 && <p className={`text-[8px] mt-0.5 ${muted}`}>Repair charges billed separately after inspection</p>}
                    </div>
                    <p className={`text-xs font-black ${i === 2 ? 'text-[var(--brand-blue)]' : isDark ? 'text-white' : 'text-zinc-900'}`}>{v}</p>
                  </div>
                ))}
              </div>

              {errors.submit && <p className="text-[10px] text-red-500 font-bold p-3 bg-red-50 border border-red-200">{errors.submit}</p>}

              <p className={`text-[10px] leading-relaxed ${muted}`}>
                ✅ You only pay after the technician visits &amp; you approve the repair quote. Zero hidden charges.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest border transition-all ${isDark ? 'border-zinc-700 text-zinc-400 hover:border-zinc-500' : 'border-zinc-300 text-zinc-500 hover:border-zinc-700'}`}
                >
                  ← Edit Details
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className={`flex-1 py-3 bg-[var(--brand-blue)] text-black text-[9px] font-black uppercase tracking-widest hover:bg-[var(--brand-blue-light)] transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Confirming...' : 'Confirm Booking ✓'}
                </button>
              </div>
            </div>
          )}

          {/* ══ STEP 3: Success ══ */}
          {step === 3 && (
            <div className="p-10 text-center space-y-5">
              <div className="text-6xl animate-bounce">✅</div>
              <p className="text-[var(--brand-blue)] text-[9px] font-black uppercase tracking-[0.5em]">Booking Confirmed</p>
              <h3 className={`text-2xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                We&apos;re on our way!
              </h3>
              <p className={`text-xs leading-relaxed max-w-xs mx-auto ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Your <strong>{service.label}</strong> booking has been placed successfully. Our team will call you at <strong>{form.phone}</strong> within 15 minutes to confirm.
              </p>

              <div className={`border px-5 py-4 text-left space-y-1 ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
                <p className={`text-[9px] uppercase tracking-widest font-black ${muted}`}>Booking Reference</p>
                <p className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  #{String(Date.now()).slice(-8).toUpperCase()}
                </p>
                <p className={`text-[10px] ${muted}`}>{form.date} • {form.timeSlot}</p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-[var(--brand-blue)] text-black text-[9px] font-black uppercase tracking-widest hover:bg-[var(--brand-blue-light)] transition-all"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Location Check Modal ──────────────────────────────────────────────────────
function LocationCheckModal({ service, isDark, onClose, onProceed }) {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function fetchCities() {
      try {
        const res = await fetch(`/api/quick-services/${service.id}/cities`);
        const data = await res.json();
        if (active) {
          if (data.success) {
            setCities(data.cities);
            if (data.cities.length > 0) {
              setSelectedCity(data.cities[0]);
            }
          } else {
            setError(data.error || 'Failed to check service availability.');
          }
        }
      } catch (err) {
        if (active) {
          setError('Could not connect to service. Please try again.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchCities();
    return () => { active = false; };
  }, [service.id]);

  const overlay = isDark ? 'bg-black/80' : 'bg-zinc-900/60';
  const modal = isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900';
  const select = isDark
    ? 'bg-zinc-900 border-zinc-700 text-white focus:border-[var(--brand-blue)]'
    : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-zinc-900';
  const divider = isDark ? 'border-zinc-800' : 'border-zinc-100';

  return (
    <div
      className={`backdrop-blur-sm ${overlay}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full border shadow-2xl flex flex-col ${modal}`}
        style={{ maxWidth: '440px', width: '100%', zIndex: 100000 }}
      >
        <div className={`flex items-center justify-between px-6 py-4 border-b ${divider}`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{service.icon}</span>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--brand-blue)]">Availability Check</p>
              <h2 className="text-lg font-black uppercase tracking-tight">{service.label}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 flex items-center justify-center border transition-all font-black text-sm ${
              isDark ? 'border-zinc-700 text-zinc-400 hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]' : 'border-zinc-300 text-zinc-400 hover:border-zinc-900 hover:text-zinc-900'
            }`}
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4 text-center">
          {loading ? (
            <p className="text-sm font-black uppercase tracking-widest animate-pulse text-[var(--brand-blue)] py-4">Checking Availability...</p>
          ) : error ? (
            <div className="space-y-4">
              <p className="text-sm text-red-500 font-bold">{error}</p>
              <button
                onClick={onClose}
                className="w-full py-3 bg-[var(--brand-blue)] text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[var(--brand-blue-light)] transition-all"
              >
                Close
              </button>
            </div>
          ) : cities.length === 0 ? (
            <div className="space-y-4 py-2">
              <p className="text-3xl">⚠️</p>
              <h3 className="text-base font-black uppercase text-[var(--brand-blue)] tracking-wide">Service Not Available</h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                We are sorry! This service is currently not available in any location because there are no active technicians registered. Please try again later.
              </p>
              <button
                onClick={onClose}
                className="w-full py-3 bg-[var(--brand-blue)] text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[var(--brand-blue-light)] transition-all"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="space-y-4 text-left">
              <div>
                <label className={`block text-[9px] font-black uppercase tracking-widest mb-1.5 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  Choose Your City *
                </label>
                <select
                  className={`w-full px-3 py-2.5 text-sm border outline-none transition-all ${select}`}
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => onProceed(selectedCity)}
                className="w-full py-3 bg-[var(--brand-blue)] text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[var(--brand-blue-light)] transition-all"
              >
                Proceed to Book →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function SectionTitle({ children, isDark }) {
  return (
    <div className="flex items-center gap-3">
      <p className={`text-[9px] font-black uppercase tracking-[0.4em] ${isDark ? 'text-zinc-400' : 'text-zinc-400'}`}>{children}</p>
      <div className={`flex-1 h-px ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`} />
    </div>
  );
}

function Field({ label, error, isDark, children }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className={`block text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
          {label}
        </label>
      )}
      {children}
      {error && <p className="text-[10px] text-red-500 font-bold">{error}</p>}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AllQuickServicesPage() {
  const [isDark, setIsDark] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  // Stores saved form data that was pending before the user logged in
  const [pendingInitialData, setPendingInitialData] = useState(null);
  const [checkLocationService, setCheckLocationService] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');

  // Dark mode detection
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark-mode'));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/quick-services');
        const data = await res.json();
        if (data.success) {
          setServices(data.data);
        }
      } catch (error) {
        console.error('Error fetching quick services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // After services load, check if there's a pending booking saved before login
  useEffect(() => {
    if (loading) return; // wait until services are ready
    const token = localStorage.getItem('token');
    const pendingStr = localStorage.getItem('pendingBooking');
    if (pendingStr && token) {
      try {
        const pending = JSON.parse(pendingStr);
        localStorage.removeItem('pendingBooking'); // consume it
        setPendingInitialData(pending);
        setSelectedService(pending.service); // re-open the modal with the saved service
      } catch (e) {
        localStorage.removeItem('pendingBooking');
      }
    }
  }, [loading]);

  const bg = isDark ? 'bg-black text-white' : 'bg-white text-zinc-900';
  const border = isDark ? 'border-zinc-900' : 'border-zinc-100';
  const card = isDark
    ? 'bg-zinc-950 border-zinc-800 hover:border-[var(--brand-blue)]'
    : 'bg-zinc-50 border-zinc-200 hover:bg-white hover:shadow-lg hover:border-zinc-900';
  const muted = isDark ? 'text-zinc-500' : 'text-zinc-600';
  const btn = isDark
    ? 'border-[var(--brand-blue)] text-[var(--brand-blue)] hover:bg-[var(--brand-blue)] hover:text-black'
    : 'border-black text-black hover:bg-black hover:text-white';

  // Loading state
  if (loading) {
    return (
      <main className={`min-h-screen font-serif ${bg}`}>
        <section className={`pt-28 pb-10 px-6 text-center`}>
          <p className="text-[var(--brand-blue)]">Loading Services...</p>
        </section>
      </main>
    );
  }

  return (
    <main className={`min-h-screen font-serif transition-colors duration-500 ${bg}`}>

      {/* Hero */}
      <section className={`pt-28 pb-10 px-6 text-center border-b ${border}`}>
        <div className="max-w-3xl mx-auto">
          <p className="text-[var(--brand-blue)] text-[10px] font-black uppercase tracking-[0.5em] mb-3">Quality Guaranteed</p>
          <h1 className={`text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            Quick <span className="text-[var(--brand-blue)]">Home</span> Services
          </h1>
          <p className={`text-sm max-w-xl mx-auto leading-relaxed ${muted}`}>
            Hassle-free home maintenance with India&apos;s most trusted professionals. Select a service to book an appointment.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.length > 0 ? (
            services.map((s) => (
              <div key={s.id} className={`group p-5 border transition-all duration-300 relative overflow-hidden ${card}`}>
                <span className={`absolute -top-1 -right-1 text-6xl font-black opacity-[0.03] group-hover:opacity-10 group-hover:text-[var(--brand-blue)] transition-all ${isDark ? 'text-white' : 'text-black'}`}>
                  {s.id < 10 ? `0${s.id}` : s.id}
                </span>
                <div className="text-3xl mb-3 transform group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 origin-left">
                  {s.icon}
                </div>
                <h3 className={`text-base font-black uppercase tracking-tight mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  {s.label}
                </h3>
                <p className={`text-xs leading-relaxed mb-4 min-h-[48px] ${muted}`}>{s.description}</p>

                {/* ✅ FIX: Use admin_base_price or base_price */}
                <p className={`text-[10px] font-black mb-3 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  Starts at <span className="text-[var(--brand-blue)]">₹{s.admin_base_price || s.base_price || 199}</span>
                </p>

                <button
                  onClick={() => setCheckLocationService(s)}
                  className={`w-full py-2.5 text-[9px] font-black uppercase tracking-[0.2em] border transition-all ${btn}`}
                >
                  Book Service
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className={muted}>No services available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* ✅ Location Check Modal */}
      {checkLocationService && (
        <LocationCheckModal
          service={checkLocationService}
          isDark={isDark}
          onClose={() => setCheckLocationService(null)}
          onProceed={(city) => {
            setSelectedCity(city);
            setSelectedService(checkLocationService);
            setCheckLocationService(null);
          }}
        />
      )}

      {/* ✅ Modal - INTEGRATED IN SAME FILE */}
      {selectedService && (
        <BookingModal
          service={selectedService}
          isDark={isDark}
          onClose={() => { setSelectedService(null); setPendingInitialData(null); }}
          onSuccess={() => { setSelectedService(null); setPendingInitialData(null); }}
          initialForm={pendingInitialData?.form || { city: selectedCity }}
          initialStep={pendingInitialData?.step}
          initialSlotType={pendingInitialData?.slotType}
          initialSelectedFreeSlot={pendingInitialData?.selectedFreeSlot}
        />
      )}
    </main>
  );
}
