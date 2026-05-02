"use client";
import { useState, useEffect, useRef } from "react";

function useDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const html = document.documentElement;
    const update = () => setDark(html.classList.contains("dark-mode"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
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

const offices = [
  {
    city: "Delhi (HQ)",
    address: "123, MTBOSS Tower, Connaught Place, New Delhi - 110001",
    phone: "+91 99999 99999",
    email: "delhi@mtboss.com",
    hours: "Mon - Sat: 9:00 AM - 6:00 PM",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.9!2d77.2167!3d28.6289!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM3JzQ0LjAiTiA3N8KwMTMnMDAuMCJF!5e0!3m2!1sen!2sin!4v1",
  },
  {
    city: "Noida",
    address: "456, Sector 62, MTBOSS Office, Noida - 201309",
    phone: "+91 88888 88888",
    email: "noida@mtboss.com",
    hours: "Mon - Sat: 9:00 AM - 6:00 PM",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.9!2d77.3667!3d28.6189!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM3JzA4LjAiTiA3N8KwMjInMDAuMCJF!5e0!3m2!1sen!2sin!4v1",
  },
  {
    city: "Gurgaon",
    address: "789, DLF Cyber City, MTBOSS Office, Gurgaon - 122002",
    phone: "+91 77777 77777",
    email: "gurgaon@mtboss.com",
    hours: "Mon - Sat: 9:00 AM - 6:00 PM",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.9!2d77.0867!3d28.4689!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDI4JzA4LjAiTiA3N8KwMDUnMTIuMCJF!5e0!3m2!1sen!2sin!4v1",
  },
];

const departments = [
  { icon: "🏗️", label: "Construction Projects", value: "projects" },
  { icon: "🏠", label: "Buy & Sale Property", value: "property" },
  { icon: "💼", label: "Careers & Jobs", value: "careers" },
  { icon: "🤝", label: "Franchise Inquiry", value: "franchise" },
  { icon: "👤", label: "Become an Agent", value: "agent" },
  { icon: "🔧", label: "Contractor Registration", value: "contractor" },
  { icon: "📦", label: "Material Supply", value: "material" },
  { icon: "💬", label: "General Inquiry", value: "general" },
];

const faqs = [
  { q: "How quickly will you respond to my inquiry?", a: "We aim to respond to all inquiries within 24 business hours. For urgent matters, please call us directly on our helpline number." },
  { q: "Which cities does MTBOSS operate in?", a: "MTBOSS Construction operates across 50+ cities in India including Delhi, Noida, Gurgaon, Mumbai, Bangalore, Hyderabad, and more." },
  { q: "How can I get a project estimate?", a: "Fill the contact form with your project details and select 'Construction Projects' as the department. Our team will schedule a site visit and provide a detailed estimate." },
  { q: "I want to visit your office. Do I need an appointment?", a: "Walk-ins are welcome during business hours. However, for project discussions, we recommend scheduling an appointment to ensure the right team member is available." },
];

export default function ContactPage() {
  const dark = useDarkMode();
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeOffice, setActiveOffice] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    subject: "",
    message: "",
  });

  const [formRef, formVisible] = useInView(0.1);
  const [infoRef, infoVisible] = useInView(0.1);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("https://formsubmit.co/ajax/YOUR_EMAIL@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          "Full Name": form.name,
          "Email": form.email,
          "Phone": form.phone,
          "Department": form.department,
          "Subject": form.subject,
          "Message": form.message,
          "_subject": `New Contact Inquiry - ${form.department} - ${form.name}`,
          "_template": "table",
          "_captcha": "false",
        }),
      });

      const data = await res.json();
      if (data.success === "true" || data.success === true) {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full px-4 py-3 text-sm border rounded-sm outline-none transition-all duration-200 ${
    dark
      ? "bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#facc15]"
      : "bg-white border-gray-200 text-zinc-800 placeholder-zinc-400 focus:border-zinc-800"
  }`;

  const labelClass = `block text-[10px] font-black uppercase tracking-widest mb-2 ${
    dark ? "text-zinc-400" : "text-zinc-500"
  }`;

  return (
    <main className={`min-h-screen transition-colors duration-500 ${dark ? "bg-black" : "bg-gray-50"}`}>

      {/* ── HERO ── */}
      <section
        className="relative flex items-center justify-center text-center py-24 px-6"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/80" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] block mb-4">
            MTBOSS Construction
          </span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase text-white mb-4 tracking-tighter">
            Get In
            <span className="text-[#facc15]"> Touch</span>
          </h1>
          <p className="text-zinc-400 text-sm max-w-lg mx-auto leading-relaxed">
            Have a project in mind, a question, or want to partner with us? We would love to hear from you.
          </p>

          {/* Quick Contact Pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <a
              href="tel:+919999999999"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#facc15] text-black text-xs font-black uppercase tracking-widest rounded-sm hover:bg-yellow-400 transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Us
            </a>
            <a
              href="mailto:info@mtboss.com"
              className="flex items-center gap-2 px-5 py-2.5 border-2 border-white text-white text-xs font-black uppercase tracking-widest rounded-sm hover:bg-white hover:text-zinc-800 transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Us
            </a>
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white text-xs font-black uppercase tracking-widest rounded-sm hover:bg-green-400 transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── QUICK STATS ── */}
      <section className="py-10 px-6 bg-[#facc15]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "< 24hrs", label: "Response Time" },
              { value: "3", label: "Office Locations" },
              { value: "50+", label: "Cities Served" },
              { value: "Mon-Sat", label: "Working Hours" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-black text-black">{s.value}</p>
                <p className="text-black/60 text-[10px] uppercase tracking-widest font-bold mt-1">{s.label}</p>
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
                transform: formVisible ? "translateX(0)" : "translateX(-30px)",
                transition: "opacity 0.7s ease, transform 0.7s ease",
              }}
            >
              <div className={`p-8 rounded-sm border ${dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100 shadow-sm"}`}>

                {/* Header */}
                <div className="mb-8">
                  <span className="text-[#facc15] text-[10px] font-black uppercase tracking-widest block mb-1">
                    Send a Message
                  </span>
                  <h2 className={`text-2xl font-black uppercase tracking-tight ${dark ? "text-white" : "text-zinc-800"}`}>
                    Contact Form
                  </h2>
                  <p className={`text-xs mt-2 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
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
                        onClick={() => setForm({ ...form, department: dept.label })}
                        className={`p-3 rounded-sm border text-left transition-all duration-200 ${
                          form.department === dept.label
                            ? "border-[#facc15] bg-[#facc15]/10"
                            : dark
                            ? "border-zinc-700 hover:border-zinc-600 bg-zinc-800"
                            : "border-gray-200 hover:border-gray-300 bg-gray-50"
                        }`}
                      >
                        <span className="text-lg block mb-1">{dept.icon}</span>
                        <span className={`text-[9px] font-black uppercase tracking-widest leading-tight block ${
                          form.department === dept.label
                            ? "text-[#facc15]"
                            : dark ? "text-zinc-400" : "text-zinc-500"
                        }`}>
                          {dept.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-sm flex items-start gap-3">
                    <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-400 text-[11px] font-bold">{error}</p>
                  </div>
                )}

                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-[#facc15] rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className={`text-lg font-black uppercase tracking-tight mb-2 ${dark ? "text-white" : "text-zinc-800"}`}>
                      Message Sent!
                    </h3>
                    <p className={`text-xs mb-6 ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
                      Thank you {form.name.split(" ")[0]}! We will get back to you within 24 hours on{" "}
                      <span className="text-[#facc15] font-black">{form.email}</span>
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", department: "", subject: "", message: "" }); }}
                      className="px-8 py-3 bg-[#facc15] text-black text-[10px] font-black uppercase tracking-widest hover:bg-yellow-400 transition-all rounded-sm"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Name + Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Full Name *</label>
                        <input type="text" name="name" required placeholder="Your full name" value={form.name} onChange={handleChange} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Email Address *</label>
                        <input type="email" name="email" required placeholder="your@email.com" value={form.email} onChange={handleChange} className={inputClass} />
                      </div>
                    </div>

                    {/* Phone + Subject */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Phone Number *</label>
                        <input type="tel" name="phone" required placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={handleChange} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Subject *</label>
                        <input type="text" name="subject" required placeholder="Brief subject of your message" value={form.subject} onChange={handleChange} className={inputClass} />
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className={labelClass}>Message *</label>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        placeholder="Tell us more about your requirement, project details, or question..."
                        value={form.message}
                        onChange={handleChange}
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                    {/* Submit */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                      <p className={`text-[10px] ${dark ? "text-zinc-600" : "text-zinc-400"}`}>
                        We never share your information with third parties.
                      </p>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-10 py-3.5 bg-[#facc15] text-black text-[10px] font-black uppercase tracking-widest hover:bg-yellow-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-3 rounded-sm"
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
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
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
                transform: infoVisible ? "translateX(0)" : "translateX(30px)",
                transition: "opacity 0.7s ease, transform 0.7s ease",
              }}
            >
              <div className="space-y-5">

                {/* Quick Contact */}
                <div className={`p-6 rounded-sm border ${dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100 shadow-sm"}`}>
                  <h3 className={`text-xs font-black uppercase tracking-widest mb-5 ${dark ? "text-[#facc15]" : "text-zinc-800"}`}>
                    Quick Contact
                  </h3>
                  <div className="space-y-4">

                    {/* Phone */}
                    <a href="tel:+919999999999" className="flex items-start gap-4 group">
                      <div className={`w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0 transition-colors ${dark ? "bg-zinc-800 group-hover:bg-[#facc15]" : "bg-gray-50 group-hover:bg-[#facc15]"}`}>
                        <svg className={`w-4 h-4 transition-colors ${dark ? "text-[#facc15] group-hover:text-black" : "text-zinc-500 group-hover:text-black"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Helpline</p>
                        <p className={`text-sm font-bold group-hover:text-[#facc15] transition-colors ${dark ? "text-white" : "text-zinc-800"}`}>+91 99999 99999</p>
                        <p className={`text-[10px] ${dark ? "text-zinc-600" : "text-zinc-400"}`}>Mon - Sat, 9AM - 6PM</p>
                      </div>
                    </a>

                    {/* Email */}
                    <a href="mailto:info@mtboss.com" className="flex items-start gap-4 group">
                      <div className={`w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0 transition-colors ${dark ? "bg-zinc-800 group-hover:bg-[#facc15]" : "bg-gray-50 group-hover:bg-[#facc15]"}`}>
                        <svg className={`w-4 h-4 transition-colors ${dark ? "text-[#facc15] group-hover:text-black" : "text-zinc-500 group-hover:text-black"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Email</p>
                        <p className={`text-sm font-bold group-hover:text-[#facc15] transition-colors ${dark ? "text-white" : "text-zinc-800"}`}>info@mtboss.com</p>
                        <p className={`text-[10px] ${dark ? "text-zinc-600" : "text-zinc-400"}`}>We reply within 24 hours</p>
                      </div>
                    </a>

                    {/* WhatsApp */}
                    <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
                      <div className={`w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0 transition-colors ${dark ? "bg-zinc-800 group-hover:bg-green-500" : "bg-gray-50 group-hover:bg-green-500"}`}>
                        <svg className={`w-4 h-4 transition-colors ${dark ? "text-green-400 group-hover:text-white" : "text-green-500 group-hover:text-white"}`} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      </div>
                      <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>WhatsApp</p>
                        <p className={`text-sm font-bold group-hover:text-green-400 transition-colors ${dark ? "text-white" : "text-zinc-800"}`}>+91 99999 99999</p>
                        <p className={`text-[10px] ${dark ? "text-zinc-600" : "text-zinc-400"}`}>Chat with us anytime</p>
                      </div>
                    </a>

                    {/* Location */}
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0 ${dark ? "bg-zinc-800" : "bg-gray-50"}`}>
                        <svg className={`w-4 h-4 ${dark ? "text-[#facc15]" : "text-zinc-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Headquarters</p>
                        <p className={`text-sm font-bold ${dark ? "text-white" : "text-zinc-800"}`}>New Delhi, India</p>
                        <p className={`text-[10px] ${dark ? "text-zinc-600" : "text-zinc-400"}`}>Connaught Place, 110001</p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Social Media */}
                <div className={`p-6 rounded-sm border ${dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100 shadow-sm"}`}>
                  <h3 className={`text-xs font-black uppercase tracking-widest mb-4 ${dark ? "text-[#facc15]" : "text-zinc-800"}`}>
                    Follow Us
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "LinkedIn", icon: "in", href: "#", color: "hover:bg-blue-600" },
                      { label: "Instagram", icon: "ig", href: "#", color: "hover:bg-pink-500" },
                      { label: "Facebook", icon: "fb", href: "#", color: "hover:bg-blue-500" },
                      { label: "YouTube", icon: "yt", href: "#", color: "hover:bg-red-500" },
                    ].map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        className={`flex items-center gap-2 px-3 py-2.5 border rounded-sm text-xs font-bold transition-all group ${
                          dark ? "border-zinc-700 text-zinc-400 hover:text-white hover:border-transparent" : "border-gray-200 text-zinc-500 hover:text-white hover:border-transparent"
                        } ${s.color}`}
                      >
                        <span className="font-black text-[10px] uppercase">{s.icon}</span>
                        {s.label}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Business Hours */}
                <div className={`p-6 rounded-sm border ${dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100 shadow-sm"}`}>
                  <h3 className={`text-xs font-black uppercase tracking-widest mb-4 ${dark ? "text-[#facc15]" : "text-zinc-800"}`}>
                    Business Hours
                  </h3>
                  {[
                    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM", open: true },
                    { day: "Saturday", hours: "9:00 AM - 2:00 PM", open: true },
                    { day: "Sunday", hours: "Closed", open: false },
                  ].map((item) => (
                    <div key={item.day} className={`flex justify-between items-center py-2.5 border-b last:border-0 ${dark ? "border-zinc-800" : "border-gray-50"}`}>
                      <span className={`text-xs font-bold ${dark ? "text-zinc-400" : "text-zinc-500"}`}>{item.day}</span>
                      <span className={`text-xs font-black ${item.open ? "text-[#facc15]" : dark ? "text-zinc-600" : "text-zinc-400"}`}>
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
      <section className={`py-20 px-6 transition-colors duration-500 ${dark ? "bg-zinc-900" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] block mb-2">
              Find Us
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black uppercase tracking-tight ${dark ? "text-white" : "text-zinc-800"}`}>
              Our Offices
            </h2>
          </div>

          {/* Office Tabs */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            {offices.map((office, i) => (
              <button
                key={i}
                onClick={() => setActiveOffice(i)}
                className={`px-6 py-2.5 text-xs font-black uppercase tracking-widest border-2 rounded-sm transition-all duration-200 ${
                  activeOffice === i
                    ? "bg-[#facc15] border-[#facc15] text-black"
                    : dark
                    ? "border-zinc-700 text-zinc-400 hover:border-[#facc15] hover:text-[#facc15]"
                    : "border-gray-200 text-zinc-500 hover:border-zinc-800 hover:text-zinc-800"
                }`}
              >
                {office.city}
              </button>
            ))}
          </div>

          {/* Active Office Details + Map */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Office Info */}
            <div className={`p-6 rounded-sm border ${dark ? "bg-zinc-800 border-zinc-700" : "bg-gray-50 border-gray-100"}`}>
              <h3 className={`text-sm font-black uppercase tracking-widest mb-5 text-[#facc15]`}>
                {offices[activeOffice].city}
              </h3>
              <div className="space-y-4">
                {[
                  { icon: "📍", label: "Address", value: offices[activeOffice].address },
                  { icon: "📞", label: "Phone", value: offices[activeOffice].phone },
                  { icon: "✉️", label: "Email", value: offices[activeOffice].email },
                  { icon: "🕐", label: "Hours", value: offices[activeOffice].hours },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <span className="text-base flex-shrink-0 mt-0.5">{item.icon}</span>
                    <div>
                      <p className={`text-[9px] font-black uppercase tracking-widest mb-0.5 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>{item.label}</p>
                      <p className={`text-xs font-bold leading-relaxed ${dark ? "text-zinc-300" : "text-zinc-600"}`}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(offices[activeOffice].address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-[#facc15] text-black text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-yellow-400 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                Get Directions
              </a>
            </div>

            {/* Map */}
            <div className="lg:col-span-2 rounded-sm overflow-hidden border h-80 lg:h-auto">
              <iframe
                src={offices[activeOffice].mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "320px" }}
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
      <section className={`py-20 px-6 transition-colors duration-500 ${dark ? "bg-black" : "bg-gray-50"}`}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] block mb-2">
              Common Questions
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black uppercase tracking-tight ${dark ? "text-white" : "text-zinc-800"}`}>
              FAQ
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`rounded-sm border overflow-hidden transition-all duration-300 ${
                  activeFaq === i
                    ? dark ? "border-[#facc15] bg-zinc-900" : "border-zinc-800 bg-white shadow-md"
                    : dark ? "border-zinc-800 bg-zinc-900" : "border-gray-100 bg-white"
                }`}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className={`text-xs font-black uppercase tracking-wide pr-4 ${dark ? "text-white" : "text-zinc-800"}`}>{faq.q}</span>
                  <svg
                    className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 text-[#facc15] ${activeFaq === i ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeFaq === i && (
                  <div className={`px-5 pb-5 text-xs leading-relaxed ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
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