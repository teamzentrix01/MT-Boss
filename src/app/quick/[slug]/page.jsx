'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import QuickServiceIcon, { isQuickServiceIconImage } from '../../components/QuickServiceIcon';
import { redirectToPayU } from '@/lib/payu-client';

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

function useDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const html = document.documentElement;
    const update = () => setDark(html.classList.contains('dark-mode'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return dark;
}

function SectionTitle({ children, isDark }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <p className={`text-[9px] font-black uppercase tracking-[0.4em] ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{children}</p>
      <div className={`flex-1 h-px ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
    </div>
  );
}

function Field({ label, error, isDark, children }) {
  return (
    <div className="space-y-1.5 text-left">
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

export default function QuickServiceSlugPage() {
  const dark = useDarkMode();
  const { slug } = useParams();
  const router = useRouter();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking states
  const [step, setStep] = useState(0); // 0 = city verification, 1 = details, 2 = confirm, 3 = success
  const [selectedCity, setSelectedCity] = useState('');
  const [checkingCity, setCheckingCity] = useState(false);
  const [cityError, setCityError] = useState('');
  const [available, setAvailable] = useState(false);

  const [form, setForm] = useState({
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
  });

  const [errors, setErrors] = useState({});
  const [bookingLoading, setBookingLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [slotType, setSlotType] = useState('paid'); // 'free' | 'paid'
  const [freeSlots, setFreeSlots] = useState([]);
  const [paidSlots, setPaidSlots] = useState(TIME_SLOTS.map((timeSlot) => ({ time_slot: timeSlot, is_available: true })));
  const [selectedFreeSlot, setSelectedFreeSlot] = useState(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [paidSlotsLoading, setPaidSlotsLoading] = useState(false);
  const [bookingReference, setBookingReference] = useState('');

  const displayDate = slotType === 'free' ? selectedFreeSlot?.slot_date : form.date;
  const displayTime = slotType === 'free'
    ? selectedFreeSlot ? `${selectedFreeSlot.slot_start?.slice(0, 5)} - ${selectedFreeSlot.slot_end?.slice(0, 5)}` : ''
    : form.timeSlot;

  // Load Service
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/quick-services?slug=${encodeURIComponent(slug)}`);
        const data = await res.json();
        if (data.success && data.data) {
          setService(data.data);
          
          // Set meta tags dynamically
          const seoTitle = data.data.seo_title || `${data.data.label} - Quick Service | MTBOSS`;
          const seoDesc = data.data.seo_description || data.data.description || `Book ${data.data.label} service from MTBOSS. Professional, reliable, and affordable.`;
          
          document.title = seoTitle;
          document.querySelector('meta[name="description"]')?.setAttribute('content', seoDesc);
          document.querySelector('meta[property="og:title"]')?.setAttribute('content', seoTitle);
          document.querySelector('meta[property="og:description"]')?.setAttribute('content', seoDesc);
        } else {
          setError('Service not found');
        }
      } catch {
        setError('Failed to load service');
      } finally {
        setLoading(false);
      }
    }
    if (slug) load();
  }, [slug]);

  // Restore pending booking after redirecting from login
  useEffect(() => {
    if (!service) return;
    const pendingStr = localStorage.getItem('pendingBooking');
    if (pendingStr) {
      try {
        const pending = JSON.parse(pendingStr);
        if (pending.service.id === service.id) {
          localStorage.removeItem('pendingBooking');
          setForm(pending.form);
          setSlotType(pending.slotType);
          setSelectedFreeSlot(pending.selectedFreeSlot);
          setStep(pending.step);
          setSelectedCity(pending.form.city);
          setAvailable(true);
          
          // Scroll to the booking form section
          setTimeout(() => {
            document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 600);
        }
      } catch (e) {
        localStorage.removeItem('pendingBooking');
      }
    }
  }, [service]);

  // Fetch free slots
  useEffect(() => {
    if (slotType !== 'free' || !form.city.trim() || !service?.id) return;
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
  }, [slotType, form.city, service?.id]);

  // Fetch paid slots
  useEffect(() => {
    if (slotType !== 'paid' || !form.city.trim() || !form.date || !service?.id) {
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
            setForm(f => ({ ...f, timeSlot: '' }));
          }
        }
      })
      .catch(() => {})
      .finally(() => setPaidSlotsLoading(false));
  }, [slotType, form.city, form.date, service?.id]);

  if (loading) {
    return (
      <main className={`min-h-screen flex items-center justify-center ${dark ? 'bg-black text-white' : 'bg-gray-50 text-zinc-900'}`}>
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[var(--brand-blue)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-bold">Loading service details...</p>
        </div>
      </main>
    );
  }

  if (error || !service) {
    return (
      <main className={`min-h-screen flex items-center justify-center ${dark ? 'bg-black text-white' : 'bg-gray-50 text-zinc-900'}`}>
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <h1 className="text-2xl font-black uppercase mb-2">Service Not Found</h1>
          <p className={`text-sm mb-6 ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>{error || 'The requested service does not exist.'}</p>
          <Link href="/quick" className="px-6 py-3 bg-[var(--brand-blue)] text-black text-xs font-black uppercase tracking-widest">
            Browse All Services
          </Link>
        </div>
      </main>
    );
  }

  const basePrice = Number(service.admin_base_price ?? service.base_price ?? 150);
  const taxAmount = Math.round((basePrice * 18) / 100);
  const totalAmount = basePrice + taxAmount;

  const bg = dark ? 'bg-black text-white' : 'bg-white text-zinc-900';
  const border = dark ? 'border-zinc-800' : 'border-zinc-200';
  const card = dark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200';
  const muted = dark ? 'text-zinc-400' : 'text-zinc-600';
  const inputCls = `w-full px-3 py-2.5 border text-sm outline-none transition-all ${
    dark
      ? 'bg-zinc-900 border-zinc-700 text-white placeholder-zinc-600 focus:border-[var(--brand-blue)]'
      : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-black'
  }`;
  const pillBase = 'qs-choice px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer';
  const pillActive = dark
    ? 'border-[var(--brand-blue)] bg-[var(--brand-blue)] text-black'
    : 'border-zinc-900 bg-zinc-900 text-white';
  const pillInactive = dark
    ? 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
    : 'border-zinc-300 text-zinc-500 hover:border-zinc-500';

  const bannerImg = isQuickServiceIconImage(service.icon) 
    ? service.icon 
    : "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&q=80";

  const stats = [
    [`₹${basePrice}`, "Visiting / Inspection Price"],
    [service.duration || "15 mins", "Duration"],
    [service.main_category || "Home Services", "Category"],
    ["On-Site", "Service Location"]
  ];

  // Helper functions
  function setField(field, val) {
    setForm((f) => ({ ...f, [field]: val }));
    setErrors((e) => ({ ...e, [field]: '' }));
  }

  const handleVerifyCity = async (val) => {
    const cityVal = val || selectedCity;
    if (!cityVal) {
      setCityError('Please select a city');
      setAvailable(false);
      return;
    }
    setCityError('');
    setCheckingCity(true);
    setAvailable(false);
    try {
      const serviceName = service.label?.toLowerCase().replace(/\s+/g, '-') || '';
      const res = await fetch(`/api/pincode-check?city=${encodeURIComponent(cityVal)}&type=service&name=${serviceName}`);
      const data = await res.json();
      if (data.success && data.available) {
        setAvailable(true);
        setForm(f => ({ ...f, city: cityVal }));
        setStep(1); // Proceed to form details step
      } else {
        setAvailable(false);
        setCityError(data.message || `Service not available in ${cityVal} yet.`);
      }
    } catch (err) {
      setCityError('Error checking city availability. Please try again.');
    } finally {
      setCheckingCity(false);
    }
  };

  const handleNextStep = () => {
    // Validate Step 1
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Valid 10-digit phone required';
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Valid 6-digit pincode required';
    if (!form.propertyType) e.propertyType = 'Select property type';
    if (slotType === 'free') {
      if (!selectedFreeSlot) e.freeSlot = 'Select a free slot';
    } else {
      if (!form.date) {
        e.date = 'Select a date';
      } else {
        const year = new Date(form.date).getFullYear();
        const currentYear = new Date().getFullYear();
        if (year < currentYear || year > 9999 || isNaN(year)) {
          e.date = 'Enter a valid year (current year or later)';
        }
      }
      if (!form.timeSlot) e.timeSlot = 'Select a time slot';
    }
    if (!form.latitude || !form.longitude) e.location = "Location is required. Please click 'Get Location'";

    setErrors(e);
    if (Object.keys(e).length === 0) {
      setStep(2);
    }
  };

  function fetchLiveLocation() {
    setLocationLoading(true);
    setErrors(e => ({ ...e, location: '' }));
    if (!navigator.geolocation) {
      setErrors(e => ({ ...e, location: 'Geolocation is not supported by your browser.' }));
      setLocationLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setForm(f => ({
          ...f,
          latitude,
          longitude,
          locationUrl: `https://maps.google.com/?q=${latitude},${longitude}`
        }));
        
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const d = await r.json();
          if (d.display_name) {
            setForm(f => ({ ...f, address: d.display_name }));
          }
        } catch (e) {
          console.error("OSM Geocoding error:", e);
        }
        setLocationLoading(false);
      },
      (error) => {
        console.error('Location capture error:', error);
        setErrors((e) => ({ ...e, location: 'Could not access location. Please enable GPS permissions.' }));
        setLocationLoading(false);
      },
      { timeout: 10000 }
    );
  }

  async function handleConfirmBooking() {
    setBookingLoading(true);
    setErrors({});
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        try {
          localStorage.setItem('pendingBooking', JSON.stringify({
            service,
            form,
            slotType,
            selectedFreeSlot,
            step: 2,
          }));
        } catch (e) {}
        setErrors({
          submit: 'Please login first. Your booking details are saved and you will be returned here after login.',
        });
        await new Promise((resolve) => setTimeout(resolve, 1500));
        router.push(`/login?redirect=/quick/${slug}`);
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
        if (res.status === 401) {
          try {
            localStorage.setItem('pendingBooking', JSON.stringify({
              service,
              form,
              slotType,
              selectedFreeSlot,
              step: 2,
            }));
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          } catch (e) {}
          setErrors({
            submit: 'Please login with a user account first. Your booking details are saved.',
          });
          await new Promise((resolve) => setTimeout(resolve, 1500));
          router.push(`/login?redirect=/quick/${slug}`);
          return;
        }
        setErrors({ submit: data.error || 'Booking failed' });
        return;
      }

      setBookingReference(data.booking?.booking_reference || '');
      redirectToPayU(data.payment);
    } catch (error) {
      console.error('Booking error:', error);
      setErrors({ submit: error.message || 'Server error' });
    } finally {
      setBookingLoading(false);
    }
  }

  return (
    <main className={`min-h-screen font-serif transition-colors duration-500 flex flex-col ${bg}`}>
      {/* ── Hero ── */}
      <section className="relative h-[55vh] min-h-[400px] flex items-end overflow-hidden">
        <img src={bannerImg} alt={service.label} className="absolute inset-0 w-full h-full object-cover blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 pb-12 w-full">
          <p className="text-[var(--brand-blue)] text-[10px] font-black uppercase tracking-[0.5em] mb-3">MTBOSS Quick Service</p>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-white leading-none mb-4">
            {service.label}
          </h1>
          <p className="text-zinc-300 text-sm max-w-md leading-relaxed">
            {service.description || `Professional ${service.label} service delivered to your doorstep.`}
          </p>
        </div>
      </section>

      {/* ── About stats ── */}
      <section className={`py-12 px-6 border-b ${border}`}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[var(--brand-blue)] text-[10px] font-black uppercase tracking-[0.4em] mb-3">About This Service</p>
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">
              Doorstep <span className="text-[var(--brand-blue)]">{service.label}</span>
            </h2>
            <p className={`text-sm leading-relaxed ${muted}`}>
              Select your preferred appointment details below. We verify technician availability in your pincode area and offer transparent, milestone-free bookings.
            </p>
            {service.sub_category && (
              <div className="mt-6">
                <p className="text-[var(--brand-blue)] text-[9px] font-black uppercase tracking-[0.4em] mb-2">Sub-Services Covered</p>
                <div className="flex flex-wrap gap-2">
                  {service.sub_category.split(',').map((sub) => (
                    <span key={sub} className={`px-3 py-1.5 text-[10px] font-black border uppercase tracking-wider ${dark ? 'border-zinc-800 bg-zinc-900 text-zinc-300' : 'border-zinc-200 bg-zinc-50 text-zinc-700'}`}>
                      {sub.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {stats.map(([val, label]) => (
              <div key={label} className={`border p-4 ${card}`}>
                <p className="text-xl font-black text-[var(--brand-blue)]">{val}</p>
                <p className={`text-[9px] uppercase tracking-widest mt-1 font-bold ${muted}`}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Booking Form Section ── */}
      <section id="booking-section" className={`py-12 px-6 ${dark ? 'bg-zinc-950' : 'bg-zinc-50'} border-b ${border}`}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-[var(--brand-blue)] text-[10px] font-black uppercase tracking-[0.4em] mb-2">Instant Booking</p>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">Schedule Your Service Visit</h2>
            <div className={`w-8 h-0.5 mx-auto mt-2 rounded bg-[var(--brand-blue)]`} />
          </div>

          <div className={`border p-6 rounded ${dark ? 'bg-black border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
            
            {errors.submit && (
              <div className="mb-6 p-4 border border-red-500/20 bg-red-500/10 text-red-500 text-xs font-bold rounded">
                ⚠ {errors.submit}
              </div>
            )}

            {/* Success State */}
            {step === 3 && (
              <div className="p-8 text-center space-y-4">
                <div className="text-6xl animate-bounce">✅</div>
                <p className="text-[var(--brand-blue)] text-[9px] font-black uppercase tracking-[0.5em]">Booking Confirmed</p>
                <h3 className="text-2xl font-black uppercase">We&apos;re on our way!</h3>
                <p className={`text-xs leading-relaxed max-w-sm mx-auto ${muted}`}>
                  Your <strong>{service.label}</strong> booking has been placed successfully. Reference ID: <strong>#{bookingReference}</strong>.
                  Our team will call you at <strong>{form.phone}</strong> within 15 minutes to confirm.
                </p>
                <div className={`border p-4 max-w-xs mx-auto text-left rounded ${border} mt-4`}>
                  <p className={`text-[9px] uppercase tracking-widest font-black ${muted}`}>Details</p>
                  <p className="text-sm font-bold mt-1">{displayDate} • {displayTime}</p>
                  <p className={`text-xs mt-1 ${muted}`}>{form.address}</p>
                </div>
                <button
                  onClick={() => {
                    setStep(0);
                    setAvailable(false);
                    setSelectedCity('');
                    setForm({
                      name: '', phone: '', email: '', address: '', city: '', pincode: '',
                      propertyType: '', propertyTypeOther: '', date: '', timeSlot: '',
                      description: '', latitude: null, longitude: null, locationUrl: ''
                    });
                  }}
                  className="mt-6 px-6 py-2.5 bg-[var(--brand-blue)] text-black text-[9px] font-black uppercase tracking-widest"
                >
                  Book Another Visit
                </button>
              </div>
            )}

            {/* Step 0: City Check */}
            {step === 0 && (
              <div className="space-y-4 max-w-md mx-auto py-4">
                <div className="text-left">
                  <label className={`block text-[9px] font-black uppercase tracking-widest mb-1.5 ${muted}`}>
                    Select Delivery City *
                  </label>
                  <div className="flex gap-2">
                    <select
                      className={`${inputCls} flex-1`}
                      value={selectedCity}
                      onChange={(e) => {
                        setSelectedCity(e.target.value);
                        setAvailable(false);
                        setCityError('');
                      }}
                    >
                      <option value="">Select a city</option>
                      {(service.cities || []).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleVerifyCity(selectedCity)}
                      disabled={checkingCity || !selectedCity}
                      className="px-6 py-2.5 text-xs font-black uppercase tracking-widest bg-[var(--brand-blue)] text-black transition-all disabled:opacity-50"
                    >
                      {checkingCity ? 'Checking...' : 'Verify'}
                    </button>
                  </div>
                </div>

                {cityError && (
                  <p className="text-xs text-red-500 font-bold text-left">
                    ⚠️ {cityError}
                  </p>
                )}
              </div>
            )}

            {/* Step 1: Booking Details */}
            {step === 1 && (
              <div className="space-y-6">
                
                {/* Verified Location Bar */}
                <div className={`flex items-center justify-between p-3 border ${border} rounded text-xs`}>
                  <p className="font-bold">
                    ✓ Available in: <span className="text-[var(--brand-blue)]">{form.city}</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(0);
                      setAvailable(false);
                    }}
                    className="text-[9px] font-black uppercase tracking-widest border border-zinc-500/30 px-3 py-1 hover:border-zinc-500"
                  >
                    Change City
                  </button>
                </div>

                {/* Visit Clarification Banner */}
                <div className={`p-4 border ${border} rounded text-left ${dark ? 'bg-zinc-900/50' : 'bg-sky-50'}`}>
                  <p className="text-xs font-black uppercase text-[var(--brand-blue)]">Visit Fee Clarification</p>
                  <p className={`text-xs leading-relaxed mt-1 ${muted}`}>
                    The visit/inspection fee is <strong>₹{basePrice}</strong>. 
                    Technicians will diagnose the issue and provide a separate quote for repairs. You pay only after you approve the quote.
                  </p>
                </div>

                <SectionTitle isDark={dark}>Personal Information</SectionTitle>

                <Field label="Full Name *" error={errors.name} isDark={dark}>
                  <input
                    type="text"
                    className={inputCls}
                    placeholder="e.g. Rahul Sharma"
                    value={form.name}
                    onChange={(e) => setField('name', e.target.value)}
                  />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Phone *" error={errors.phone} isDark={dark}>
                    <input
                      type="text"
                      className={inputCls}
                      placeholder="10-digit mobile"
                      maxLength={10}
                      value={form.phone}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '');
                        setField('phone', raw && /^[6-9]/.test(raw) ? raw.slice(0, 10) : '');
                      }}
                    />
                  </Field>
                  <Field label="Email (optional)" error={errors.email} isDark={dark}>
                    <input
                      type="email"
                      className={inputCls}
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setField('email', e.target.value)}
                    />
                  </Field>
                </div>

                <SectionTitle isDark={dark}>Service Location Details</SectionTitle>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="City (Prefilled)" isDark={dark}>
                    <input
                      type="text"
                      className={`${inputCls} opacity-70 cursor-not-allowed`}
                      value={form.city}
                      readOnly
                    />
                  </Field>
                  <Field label="Pincode *" error={errors.pincode} isDark={dark}>
                    <input
                      type="text"
                      maxLength={6}
                      className={inputCls}
                      placeholder="6-digit pincode"
                      value={form.pincode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setField('pincode', val);
                      }}
                    />
                  </Field>
                </div>

                <Field label="Full Address *" error={errors.address} isDark={dark}>
                  <textarea
                    rows={2}
                    className={`${inputCls} resize-none`}
                    placeholder="House/Flat No., Street, Landmark…"
                    value={form.address}
                    onChange={(e) => setField('address', e.target.value)}
                  />
                </Field>

                <Field label="Property Type *" error={errors.propertyType} isDark={dark}>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {PROPERTY_TYPES.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setField('propertyType', p)}
                        className={`${pillBase} ${form.propertyType === p ? `qs-choice-active ${pillActive}` : pillInactive}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  {form.propertyType === 'Other' && (
                    <input
                      type="text"
                      className={`w-full mt-2 ${inputCls}`}
                      placeholder="Please specify property type…"
                      value={form.propertyTypeOther || ''}
                      onChange={(e) => setField('propertyTypeOther', e.target.value)}
                    />
                  )}
                  {form.propertyType && (
                    <p className={`mt-2 text-[10px] font-black uppercase tracking-widest ${dark ? 'text-[var(--brand-blue)]' : 'text-zinc-900'}`}>
                      Selected property type:{' '}
                      {form.propertyType === 'Other'
                        ? form.propertyTypeOther?.trim() || 'Other'
                        : form.propertyType}
                    </p>
                  )}
                </Field>

                <Field label="Capture Live GPS *" error={errors.location} isDark={dark}>
                  <button
                    type="button"
                    onClick={fetchLiveLocation}
                    disabled={locationLoading}
                    className={`w-full py-2.5 px-3 text-[10px] font-black uppercase tracking-widest border transition-all ${
                      locationLoading
                        ? 'opacity-50 cursor-wait'
                        : form.latitude && form.longitude
                        ? 'border-green-500 text-green-500 hover:bg-green-500/10'
                        : dark
                        ? 'border-[var(--brand-blue)] text-[var(--brand-blue)] hover:bg-[var(--brand-blue)]/10'
                        : 'border-zinc-900 text-zinc-900 hover:bg-zinc-100'
                    }`}
                  >
                    {locationLoading ? '📡 Getting Location...' : form.latitude ? '✓ GPS Coordinates Captured' : '📍 Get Live Location'}
                  </button>
                </Field>

                <SectionTitle isDark={dark}>Appointment Schedule</SectionTitle>

                <div className="flex gap-4">
                  {[
                    { key: 'paid', icon: '📅', label: 'Choose My Time', sub: 'Pick any date & slot' },
                    { key: 'free', icon: '🎁', label: 'Free Admin Slot', sub: 'Pre-scheduled free visit' },
                  ].map(({ key, icon, label, sub }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => { setSlotType(key); setSelectedFreeSlot(null); }}
                      className={`appointment-tab flex-1 p-3 rounded transition-all !border-2 ${
                        slotType === key
                          ? dark ? '!border-white' : '!border-black'
                          : dark ? '!border-zinc-800/40' : '!border-zinc-300/40'
                      }`}
                    >
                      <p className="text-[10px] font-black uppercase tracking-widest !text-black">
                        {icon} {label}
                      </p>
                      <p className="text-[9px] mt-0.5 !text-zinc-900 font-bold">
                        {sub}
                      </p>
                    </button>
                  ))}
                </div>

                {slotType === 'free' ? (
                  <Field label="Available Free Slots *" error={errors.freeSlot} isDark={dark}>
                    {slotsLoading ? (
                      <p className={`text-[10px] animate-pulse ${muted}`}>Loading slots...</p>
                    ) : freeSlots.length === 0 ? (
                      <div className={`p-3 border rounded text-left ${dark ? 'border-zinc-700 bg-zinc-900' : 'border-zinc-200 bg-zinc-50'}`}>
                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-wide">No slots available</p>
                        <p className={`text-[9px] mt-1 ${muted}`}>
                          There are no pre-scheduled free slots in {form.city} at this time. Please use &quot;Choose My Time&quot; instead.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-2">
                        {freeSlots.map((slot) => (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => { setSelectedFreeSlot(slot); setErrors((e) => ({ ...e, freeSlot: '' })); }}
                            className={`p-3 border rounded text-left transition-all ${
                              selectedFreeSlot?.id === slot.id
                                ? dark ? 'border-[var(--brand-blue)] bg-[var(--brand-blue)]/10' : 'border-zinc-900 bg-zinc-50'
                                : border
                            }`}
                          >
                            <p className="text-[10px] font-black uppercase">
                              {new Date(slot.slot_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                            <p className="text-xs font-bold mt-0.5">
                              {slot.slot_start?.slice(0, 5)} – {slot.slot_end?.slice(0, 5)}
                            </p>
                            <p className={`text-[9px] mt-0.5 ${muted}`}>
                              {slot.max_bookings - (slot.current_bookings || 0)} slots remaining
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </Field>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Preferred Date *" error={errors.date} isDark={dark}>
                      <input
                        type="date"
                        min={getTodayStr()}
                        max="9999-12-31"
                        className={inputCls}
                        value={form.date}
                        onChange={(e) => setField('date', e.target.value)}
                      />
                    </Field>
                    <Field label="Time Slot *" error={errors.timeSlot} isDark={dark}>
                      <select
                        className={inputCls}
                        value={form.timeSlot}
                        onChange={(e) => setField('timeSlot', e.target.value)}
                      >
                        <option value="">{paidSlotsLoading ? 'Loading slots...' : 'Select a slot'}</option>
                        {paidSlots.filter((slot) => slot.is_available).map((slot) => (
                          <option key={slot.time_slot} value={slot.time_slot}>{slot.time_slot}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                )}

                <Field label="Problem Description (optional)" isDark={dark}>
                  <textarea
                    rows={3}
                    className={`${inputCls} resize-none`}
                    placeholder="Describe what needs repair or servicing..."
                    value={form.description}
                    onChange={(e) => setField('description', e.target.value)}
                  />
                </Field>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full py-3.5 bg-[var(--brand-blue)] text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-yellow-500 transition-all"
                >
                  Proceed to Confirm →
                </button>
              </div>
            )}

            {/* Step 2: Confirm Booking */}
            {step === 2 && (
              <div className="space-y-6">
                <SectionTitle isDark={dark}>Verify Information</SectionTitle>

                <div className={`border divide-y ${border} text-left rounded overflow-hidden`}>
                  {[
                    ['Service', service.label],
                    ['Client Name', form.name],
                    ['Phone', form.phone],
                    ['Email', form.email || '—'],
                    ['Location Address', `${form.address}, ${form.city} – ${form.pincode}`],
                    ['Property Type', form.propertyType === 'Other' ? form.propertyTypeOther : form.propertyType],
                    ['Date Requested', displayDate],
                    ['Time Slot', displayTime],
                    ['Description', form.description || '—'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex gap-4 px-4 py-2.5 text-xs">
                      <p className={`font-black uppercase tracking-wider w-28 shrink-0 ${muted}`}>{k}</p>
                      <p className="font-semibold">{v}</p>
                    </div>
                  ))}
                </div>

                <SectionTitle isDark={dark}>Visiting Invoice</SectionTitle>

                <div className={`border ${border} divide-y ${border} rounded text-left`}>
                  <div className="flex justify-between px-4 py-2.5 text-xs">
                    <p className={muted}>Inspection / Visiting Fee</p>
                    <p className="font-bold">₹{basePrice}</p>
                  </div>
                  <div className="flex justify-between px-4 py-2.5 text-xs">
                    <p className={muted}>GST (18%)</p>
                    <p className="font-bold">₹{taxAmount}</p>
                  </div>
                  <div className="flex justify-between px-4 py-3 bg-[var(--brand-blue)]/5 text-xs">
                    <div>
                      <p className="font-black text-sm uppercase">Total Due Now</p>
                      <p className={`text-[8px] mt-0.5 ${muted}`}>Secure online payment via PayU</p>
                    </div>
                    <p className="font-black text-base text-[var(--brand-blue)]">₹{totalAmount}</p>
                  </div>
                </div>

                <p className={`text-[10px] text-left leading-relaxed ${muted}`}>
                  ✓ Repair prices are separate. Technician will examine the appliance/issue and provide a full repair quote. Zero hidden charges.
                </p>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest border transition-all ${
                      dark ? 'border-zinc-700 hover:border-zinc-500' : 'border-zinc-300 hover:border-zinc-400'
                    }`}
                  >
                    ← Edit details
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmBooking}
                    disabled={bookingLoading}
                    className="flex-1 py-3 bg-[var(--brand-blue)] text-black text-[9px] font-black uppercase tracking-widest hover:bg-yellow-500 transition-all disabled:opacity-50"
                  >
                    {bookingLoading ? 'Opening PayU...' : 'Pay & Confirm Visit'}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* ── What We Cover ── */}
      {service.coverage_details && (
        <section className={`py-16 px-6 border-b ${border}`}>
          <div className="max-w-4xl mx-auto">
            <span className="text-[var(--brand-blue)] text-[10px] font-black uppercase tracking-[0.4em] block mb-2">Coverage Details</span>
            <h2 className="text-3xl font-black uppercase tracking-tight mb-6">Service Coverage</h2>
            <div className={`border ${card} p-6 rounded`}>
              {service.coverage_details.split('\n').map((line, i) => (
                <div key={i} className="flex items-start gap-3 mb-3 last:mb-0 text-left">
                  <span className="text-[var(--brand-blue)] font-black">✓</span>
                  <p className={`text-sm ${muted}`}>{line.trim()}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── How to Use ── */}
      {service.how_to_use && (
        <section className={`py-16 px-6 border-b ${border}`}>
          <div className="max-w-4xl mx-auto">
            <span className="text-[var(--brand-blue)] text-[10px] font-black uppercase tracking-[0.4em] block mb-2">Process flow</span>
            <h2 className="text-3xl font-black uppercase tracking-tight mb-6">How to Use This Service</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.how_to_use.split('\n').filter(Boolean).map((stepVal, i) => (
                <div key={i} className={`border ${card} p-5 rounded text-left`}>
                  <div className="w-8 h-8 bg-[var(--brand-blue)] rounded flex items-center justify-center mb-3">
                    <span className="text-black text-xs font-black">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <p className={`text-sm ${muted}`}>{stepVal.trim()}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Video Overview ── */}
      {service.video_url && (
        <section className={`py-16 px-6`}>
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-[var(--brand-blue)] text-[10px] font-black uppercase tracking-[0.4em] block mb-2">Watch Video</span>
            <h2 className="text-3xl font-black uppercase tracking-tight mb-6">Service Overview</h2>
            <div className="relative w-full overflow-hidden shadow-2xl rounded" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={service.video_url.replace('watch?v=', 'embed/')}
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                title={`${service.label} overview video`}
              />
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
