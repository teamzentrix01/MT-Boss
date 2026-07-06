'use client';

import { useState, useEffect, useRef } from 'react';

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

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
}

const DEFAULT_OFFICES = [
  'Moradabad',
  'Bareilly',
  'Meerut',
  'Noida',
  'Delhi',
  'Gurgaon',
  'Haldwani',
  'Dehradun',
].map((city, index) => ({
  id: `default-${index}`,
  city,
  address: `MTBOSS Office, ${city}, India`,
  phone: '+91 94102 25039',
  email: `${city.toLowerCase()}@mtboss.com`,
  hours: 'Mon - Sat: 9:00 AM - 6:00 PM',
  mapUrl: `https://www.google.com/maps?q=${encodeURIComponent(`${city}, India`)}&output=embed`,
}));

const departments = [
  { icon: '🏗️', label: 'Construction Projects', value: 'projects' },
  { icon: '🏠', label: 'Buy & Sale Property', value: 'property' },
  { icon: '💼', label: 'Careers & Jobs', value: 'careers' },
  { icon: '🤝', label: 'Franchise Inquiry', value: 'franchise' },
  { icon: '👤', label: 'Become an Agent', value: 'agent' },
  { icon: '🔧', label: 'Contractor Registration', value: 'contractor' },
  { icon: '📦', label: 'Material Supply', value: 'material' },
  { icon: '💬', label: 'General Inquiry', value: 'general' },
];

const faqs = [
  { q: 'How quickly will you respond to my inquiry?', a: 'We aim to respond to all inquiries within 24 business hours. For urgent matters, please call us directly on our helpline number.' },
  { q: 'Which cities does MTBOSS operate in?', a: 'MTBOSS Construction operates across 50+ cities in India including Delhi, Noida, Gurgaon, Mumbai, Bangalore, Hyderabad, and more.' },
  { q: 'How can I get a project estimate?', a: 'Fill the contact form with your project details and select Construction Projects as the department. Our team will schedule a site visit and provide a detailed estimate.' },
  { q: 'I want to visit your office. Do I need an appointment?', a: 'Walk-ins are welcome during business hours. However, for project discussions, we recommend scheduling an appointment to ensure the right team member is available.' },
];

export default function ContactPage() {
  const dark = useDarkMode();
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeOffice, setActiveOffice] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [offices, setOffices] = useState(DEFAULT_OFFICES);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    subject: '',
    message: '',
  });

  const [formRef, formVisible] = useInView(0.1);
  const [infoRef, infoVisible] = useInView(0.1);

  useEffect(() => {
    let ignore = false;

    const loadOffices = async () => {
      try {
        const res = await fetch('/api/office-locations');
        const data = await res.json();
        if (!ignore && data.success && Array.isArray(data.data) && data.data.length > 0) {
          setOffices(data.data.map((office) => ({
            ...office,
            mapUrl: office.map_url || office.mapUrl || `https://www.google.com/maps?q=${encodeURIComponent(`${office.city}, India`)}&output=embed`,
          })));
          setActiveOffice(0);
        }
      } catch (err) {
        console.error('Office locations load error:', err);
      }
    };

    loadOffices();
    return () => { ignore = true; };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const rawDigits = value.replace(/\D/g, '');
      const digits = rawDigits && /^[6-9]/.test(rawDigits) ? rawDigits.slice(0, 10) : '';
      setForm({ ...form, phone: digits });
    } else {
      setForm({ ...form, [name]: value });
    }
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Full name is required.';
    if (!form.email) newErrors.email = 'Email address is required.';
    else if (!emailRegex.test(form.email)) newErrors.email = 'Please enter a valid email address.';
    if (!form.phone) newErrors.phone = 'Phone number is required.';
    else if (!phoneRegex.test(form.phone)) newErrors.phone = 'Enter a valid 10-digit Indian mobile number (starts with 6-9).';
    if (!form.subject.trim()) newErrors.subject = 'Subject is required.';
    if (!form.department) newErrors.department = 'Please select a department.';
    if (!form.message.trim()) newErrors.message = 'Message is required.';
    if (Object.keys(newErrors).length > 0) { setFieldErrors(newErrors); return; }
    setFieldErrors({});
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
        // Reset form after 3 seconds
        setTimeout(() => {
          setForm({ name: '', email: '', phone: '', department: '', subject: '', message: '' });
          setSubmitted(false);
        }, 3000);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Contact form error:', err);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full px-4 py-3 text-sm border rounded-lg outline-none transition-all duration-200 ${
    dark
      ? 'bg-black border-[var(--brand-blue-light)] text-white placeholder-[var(--brand-blue-deeper)] focus:border-[var(--brand-blue-lighter)] focus:ring-2 focus:ring-[var(--brand-blue)]/20'
      : 'bg-white border-[var(--brand-blue-light)] text-black placeholder-[var(--brand-blue-deep)] focus:border-[var(--brand-blue)] focus:ring-2 focus:ring-[var(--brand-blue)]/20'
  }`;

  const labelClass = `block text-xs font-bold uppercase tracking-widest mb-2 ${
    dark ? 'text-[var(--brand-blue-light)]' : 'text-[var(--brand-blue-deep)]'
  }`;

  const bgClass = dark ? 'bg-black' : 'bg-white';
  const textPrimaryClass = dark ? 'text-white' : 'text-black';
  const textSecondaryClass = dark ? 'text-[var(--brand-blue-light)]' : 'text-[var(--brand-blue-deep)]';
  const borderClass = dark ? 'border-[var(--brand-blue-light)]' : 'border-[var(--brand-blue)]';

  return (
    <main className={`min-h-screen transition-colors duration-500 ${dark ? 'bg-black' : 'bg-gray-50'}`}>
      {/* ── HERO ── */}
      <section
        className="relative flex items-center justify-center text-center py-24 px-6"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/80" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="text-[var(--brand-blue-light)] text-xs font-bold uppercase tracking-widest block mb-4">
            MTBOSS
          </span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase text-white mb-4 tracking-tight">
            Get In<span className="text-[var(--brand-blue-light)]"> Touch</span>
          </h1>
          <p className="text-gray-300 text-sm max-w-lg mx-auto leading-relaxed">
            Have a project in mind, a question, or want to partner with us? We would love to hear from you.
          </p>

          {/* Quick Contact Pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <a
              href="tel:+919410225039"
              className="flex items-center gap-2 px-5 py-2.5 bg-[var(--brand-blue)] text-black text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[var(--brand-blue-light)] transition-all"
            >
              📞 Call Us
            </a>
            <a
              href="mailto:info@mtboss.in"
              className="flex items-center gap-2 px-5 py-2.5 border-2 border-white text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-white hover:text-black transition-all"
            >
              ✉️ Email Us
            </a>
            <a
              href="https://wa.me/919410225039"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-green-400 transition-all"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── QUICK STATS ── */}
      <section className="py-10 px-6 bg-[var(--brand-blue)]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '< 24hrs', label: 'Response Time' },
              { value: offices.length, label: 'Office Locations' },
              { value: '50+', label: 'Cities Served' },
              { value: 'Mon-Sat', label: 'Working Hours' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-black text-black">{s.value}</p>
                <p className="text-black/60 text-xs uppercase tracking-widest font-bold mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* LEFT — Contact Form */}
            <div
              ref={formRef}
              className="lg:col-span-2"
              style={{
                opacity: formVisible ? 1 : 0,
                transform: formVisible ? 'translateX(0)' : 'translateX(-30px)',
                transition: 'opacity 0.7s ease, transform 0.7s ease',
              }}
            >
              <div className={`p-8 rounded-lg border-2 ${dark ? 'bg-black border-[var(--brand-blue-light)]' : 'bg-white border-[var(--brand-blue)] shadow-lg'}`}>
                {/* Header */}
                <div className="mb-8">
                  <span className={`text-xs font-bold uppercase tracking-widest block mb-2 ${textSecondaryClass}`}>
                    Send a Message
                  </span>
                  <h2 className={`text-3xl font-black uppercase tracking-tight ${textPrimaryClass}`}>
                    Contact Form
                  </h2>
                  <p className={`text-xs mt-3 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Fill in your details and we will get back to you within 24 hours.
                  </p>
                </div>

                {/* Department Selector */}
                <div className="mb-6">
                  <label className={labelClass}>What can we help you with? *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {departments.map((dept) => (
                      <button
                        key={dept.value}
                        type="button"
                        onClick={() => { setForm({ ...form, department: dept.label }); setFieldErrors(prev => ({ ...prev, department: '' })); }}
                        className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                          form.department === dept.label
                            ? dark ? 'border-[var(--brand-blue-light)] bg-[var(--brand-blue)]/10' : 'border-[var(--brand-blue)] bg-sky-50'
                            : dark ? 'border-[var(--brand-blue-deep)] hover:border-[var(--brand-blue-light)]' : 'border-[var(--brand-blue-lighter)] hover:border-[var(--brand-blue)]'
                        }`}
                      >
                        <span className="text-lg block mb-1 text-black">{dept.icon}</span>
                        <span className="text-xs font-bold uppercase tracking-widest leading-tight block text-black">
                          {dept.label}
                        </span>
                      </button>
                    ))}
                  </div>
                  {fieldErrors.department && <p className="text-red-500 text-xs mt-1 font-bold">{fieldErrors.department}</p>}
                </div>

                {/* Error */}
                {error && (
                  <div className={`mb-6 p-4 rounded-lg border-2 ${dark ? 'bg-red-900/20 border-red-600' : 'bg-red-50 border-red-400'}`}>
                    <p className={`text-sm font-bold ${dark ? 'text-red-400' : 'text-red-600'}`}>⚠️ {error}</p>
                  </div>
                )}

                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-[var(--brand-blue)] rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className={`text-xl font-black uppercase tracking-tight mb-2 ${textPrimaryClass}`}>
                      Message Sent! ✨
                    </h3>
                    <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Thank you! We will get back to you within 24 hours on <span className={`font-bold ${textSecondaryClass}`}>{form.email}</span>
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name + Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          placeholder="Your full name"
                          value={form.name}
                          onChange={handleChange}
                          className={inputClass}
                        />
                        {fieldErrors.name && <p className="text-red-500 text-xs mt-1 font-bold">{fieldErrors.name}</p>}
                      </div>
                      <div>
                        <label className={labelClass}>Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          placeholder="your@email.com"
                          value={form.email}
                          onChange={handleChange}
                          className={inputClass}
                        />
                        {fieldErrors.email && <p className="text-red-500 text-xs mt-1 font-bold">{fieldErrors.email}</p>}
                      </div>
                    </div>

                    {/* Phone + Subject */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="10-digit mobile number"
                          value={form.phone}
                          onChange={handleChange}
                          maxLength={10}
                          inputMode="numeric"
                          className={inputClass}
                        />
                        {fieldErrors.phone && <p className="text-red-500 text-xs mt-1 font-bold">{fieldErrors.phone}</p>}
                      </div>
                      <div>
                        <label className={labelClass}>Subject *</label>
                        <input
                          type="text"
                          name="subject"
                          placeholder="Brief subject"
                          value={form.subject}
                          onChange={handleChange}
                          className={inputClass}
                        />
                        {fieldErrors.subject && <p className="text-red-500 text-xs mt-1 font-bold">{fieldErrors.subject}</p>}
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className={labelClass}>Message *</label>
                      <textarea
                        name="message"
                        rows={5}
                        placeholder="Tell us more about your requirement..."
                        value={form.message}
                        onChange={handleChange}
                        className={`${inputClass} resize-none`}
                      />
                      {fieldErrors.message && <p className="text-red-500 text-xs mt-1 font-bold">{fieldErrors.message}</p>}
                    </div>

                    {/* Submit */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                      <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-600'}`}>
                        We never share your information with third parties.
                      </p>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-[var(--brand-blue)] text-black text-xs font-bold uppercase tracking-widest hover:bg-[var(--brand-blue-light)] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 rounded-lg"
                      >
                        {loading ? (
                          <>
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* RIGHT — Contact Info */}
            <div
              ref={infoRef}
              className="lg:col-span-1"
              style={{
                opacity: infoVisible ? 1 : 0,
                transform: infoVisible ? 'translateX(0)' : 'translateX(30px)',
                transition: 'opacity 0.7s ease, transform 0.7s ease',
              }}
            >
              <div className="space-y-5">
                {/* Quick Contact */}
                <div className={`p-6 rounded-lg border-2 ${dark ? 'bg-black border-[var(--brand-blue-light)]' : 'bg-white border-[var(--brand-blue)] shadow-lg'}`}>
                  <h3 className={`text-xs font-bold uppercase tracking-widest mb-5 ${textSecondaryClass}`}>
                    Quick Contact
                  </h3>
                  <div className="space-y-4">
                    <a href="tel:+919410225039" className="flex items-start gap-3 group">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${dark ? 'bg-[var(--brand-blue)]/20 group-hover:bg-[var(--brand-blue-dark)]' : 'bg-sky-100 group-hover:bg-[var(--brand-blue-dark)]'}`}>
                        <span className={`text-lg transition-all ${dark ? 'group-hover:text-black' : 'group-hover:text-white'}`}>📞</span>
                      </div>
                      <div>
                        <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${dark ? 'text-gray-500' : 'text-gray-600'}`}>Helpline</p>
                        <p className={`font-bold group-hover:${textSecondaryClass} transition-colors ${textPrimaryClass}`}>+91 94102 25039</p>
                      </div>
                    </a>

                    <a href="mailto:info@mtboss.in" className="flex items-start gap-3 group">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${dark ? 'bg-[var(--brand-blue)]/20 group-hover:bg-[var(--brand-blue-dark)]' : 'bg-sky-100 group-hover:bg-[var(--brand-blue-dark)]'}`}>
                        <span className="text-lg">✉️</span>
                      </div>
                      <div>
                        <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${dark ? 'text-gray-500' : 'text-gray-600'}`}>Email</p>
                        <p className={`font-bold transition-colors ${textPrimaryClass}`}>info@mtboss.in</p>
                      </div>
                    </a>

                    <a href="https://wa.me/919410225039" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 group">
                      <div className="w-10 h-10 rounded-lg bg-green-500/20 group-hover:bg-green-500 flex items-center justify-center flex-shrink-0 transition-all">
                        <span className="text-lg group-hover:text-white transition-all">💬</span>
                      </div>
                      <div>
                        <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${dark ? 'text-gray-500' : 'text-gray-600'}`}>WhatsApp</p>
                        <p className={`font-bold transition-colors ${textPrimaryClass}`}>+91 94102 25039</p>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Business Hours */}
                <div className={`p-6 rounded-lg border-2 ${dark ? 'bg-black border-[var(--brand-blue-light)]' : 'bg-white border-[var(--brand-blue)] shadow-lg'}`}>
                  <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 ${textSecondaryClass}`}>
                    Business Hours
                  </h3>
                  {[
                    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM', open: true },
                    { day: 'Saturday', hours: '9:00 AM - 2:00 PM', open: true },
                    { day: 'Sunday', hours: 'Closed', open: false },
                  ].map((item) => (
                    <div key={item.day} className={`flex justify-between items-center py-2.5 border-b last:border-0 ${dark ? 'border-[var(--brand-blue-light)]/20' : 'border-sky-200'}`}>
                      <span className={`text-xs font-bold ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{item.day}</span>
                      <span className={`text-xs font-bold ${item.open ? textSecondaryClass : dark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {item.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OFFICE LOCATIONS ── */}
      <section className={`py-20 px-6 transition-colors duration-500 ${dark ? 'bg-black' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className={`text-xs font-bold uppercase tracking-widest block mb-2 ${textSecondaryClass}`}>
              Find Us
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black uppercase tracking-tight ${textPrimaryClass}`}>
              Our Offices
            </h2>
          </div>

          {/* Office Tabs */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            {offices.map((office, i) => (
              <button
                key={office.id || office.city}
                onClick={() => setActiveOffice(i)}
                className={`px-6 py-2.5 text-xs font-bold uppercase tracking-widest border-2 rounded-lg transition-all duration-200 ${
                  activeOffice === i
                    ? 'bg-[var(--brand-blue)] border-[var(--brand-blue-light)] text-black'
                    : dark
                    ? 'border-[var(--brand-blue-light)] text-[var(--brand-blue-light)] hover:border-[var(--brand-blue-lighter)] hover:text-[var(--brand-blue-lighter)]'
                    : 'border-[var(--brand-blue)] text-[var(--brand-blue-deep)] hover:border-[var(--brand-blue-deep)]'
                }`}
              >
                {office.city}
              </button>
            ))}
          </div>

          {/* Active Office Details + Map */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Office Info */}
            <div className={`p-6 rounded-lg border-2 ${dark ? 'bg-black border-[var(--brand-blue-light)]' : 'bg-white border-[var(--brand-blue)] shadow-lg'}`}>
              <h3 className={`text-sm font-black uppercase tracking-widest mb-5 ${textSecondaryClass}`}>
                {offices[activeOffice].city}
              </h3>
              <div className="space-y-4">
                {[
                  { icon: '📍', label: 'Address', value: offices[activeOffice].address },
                  { icon: '📞', label: 'Phone', value: offices[activeOffice].phone },
                  { icon: '✉️', label: 'Email', value: offices[activeOffice].email },
                  { icon: '🕐', label: 'Hours', value: offices[activeOffice].hours },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <span className="text-lg flex-shrink-0 mt-0.5">{item.icon}</span>
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${dark ? 'text-gray-500' : 'text-gray-600'}`}>
                        {item.label}
                      </p>
                      <p className={`text-sm leading-relaxed ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(offices[activeOffice].address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-[var(--brand-blue)] text-black text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[var(--brand-blue-light)] transition-all"
              >
                📍 Get Directions
              </a>
            </div>

            {/* Map */}
            <div className="lg:col-span-2 rounded-lg overflow-hidden border-2 border-[var(--brand-blue-light)] h-80 lg:h-auto">
              <iframe
                src={offices[activeOffice].mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '320px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${offices[activeOffice].city} Office Map`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className={`py-20 px-6 transition-colors duration-500 ${dark ? 'bg-black' : 'bg-gray-50'}`}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className={`text-xs font-bold uppercase tracking-widest block mb-2 ${textSecondaryClass}`}>
              Common Questions
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black uppercase tracking-tight ${textPrimaryClass}`}>
              FAQ
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`rounded-lg border-2 overflow-hidden transition-all duration-300 ${
                  activeFaq === i
                    ? dark
                      ? 'border-[var(--brand-blue-light)] bg-black'
                      : 'border-[var(--brand-blue)] bg-white shadow-lg'
                    : dark
                    ? 'border-[var(--brand-blue-light)]/30 bg-black'
                    : 'border-sky-200 bg-white'
                }`}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className={`text-xs font-bold uppercase tracking-wide pr-4 ${textPrimaryClass}`}>{faq.q}</span>
                  <svg
                    className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 text-[var(--brand-blue-light)] ${activeFaq === i ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeFaq === i && (
                  <div className={`px-5 pb-5 text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-700'}`}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
