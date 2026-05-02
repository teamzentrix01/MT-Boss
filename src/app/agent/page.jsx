"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

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

const benefits = [
  { icon: "💰", title: "High Commissions", desc: "Earn industry-leading commissions on every successful project referral and closure." },
  { icon: "🏗️", title: "Strong Brand", desc: "Represent MTBOSS — 20+ years of trust, quality, and recognition across India." },
  { icon: "📋", title: "Ready Leads", desc: "Get access to warm leads from our marketing campaigns and digital channels." },
  { icon: "📚", title: "Full Training", desc: "Complete product training, sales scripts, and ongoing support from our team." },
  { icon: "🌍", title: "Flexible Work", desc: "Work from anywhere, anytime. No fixed hours, no targets pressure." },
  { icon: "🚀", title: "Fast Payouts", desc: "Commissions processed within 7 working days of successful project closure." },
  { icon: "📱", title: "Digital Tools", desc: "Access to CRM, brochures, proposals, and marketing materials digitally." },
  { icon: "🤝", title: "Dedicated Support", desc: "A dedicated relationship manager to help you close deals faster." },
];

const howItWorks = [
  { step: "01", title: "Register as Agent", desc: "Fill the form below with your details and area of operation." },
  { step: "02", title: "Get Verified", desc: "Our team reviews your application and onboards you within 2-3 days." },
  { step: "03", title: "Receive Training", desc: "Complete a short product training session with our sales team." },
  { step: "04", title: "Start Referring", desc: "Share leads from your network — builders, buyers, businesses." },
  { step: "05", title: "Track Progress", desc: "Monitor your leads and commissions via your agent dashboard." },
  { step: "06", title: "Earn Commission", desc: "Get paid on every successful project closure. No cap on earnings." },
];

const agentTypes = [
  {
    icon: "🏘️",
    title: "Property Agent",
    desc: "Refer residential and commercial property buyers to our Buy & Sale division.",
    earn: "Up to 2% per deal",
    color: "border-blue-500/30",
    badge: "bg-blue-500/10 text-blue-400",
  },
  {
    icon: "🏗️",
    title: "Construction Agent",
    desc: "Connect clients who need construction, renovation, or infrastructure projects.",
    earn: "Up to 3% per project",
    color: "border-[#facc15]/30",
    badge: "bg-[#facc15]/10 text-[#facc15]",
    popular: true,
  },
  {
    icon: "🤝",
    title: "Franchise Agent",
    desc: "Help us find franchise partners across India and earn on every successful sign-up.",
    earn: "Up to ₹1L per franchise",
    color: "border-purple-500/30",
    badge: "bg-purple-500/10 text-purple-400",
  },
];

const faqs = [
  { q: "Is there any registration fee to become an agent?", a: "No, becoming an MTBOSS agent is completely free. There are no registration fees, no hidden charges, and no monthly commitments." },
  { q: "How much can I earn as an agent?", a: "Your earnings depend on the type and value of deals you close. Property agents earn up to 2%, construction agents up to 3%, and franchise agents can earn up to ₹1 Lakh per successful franchise onboarding." },
  { q: "Do I need prior real estate or construction experience?", a: "No prior experience is required. We provide complete training and all the tools you need to succeed as an MTBOSS agent." },
  { q: "How are leads tracked and assigned?", a: "All leads you submit go through our CRM system. Each lead is tagged to your agent profile and tracked until closure. You earn commission on every deal that converts." },
  { q: "When and how will I receive my commission?", a: "Commissions are processed within 7 working days of a successful project closure or deal confirmation. Payment is made via bank transfer directly to your account." },
  { q: "Can I work as an agent part-time?", a: "Absolutely. Most of our agents work part-time alongside their regular jobs. There are no fixed working hours or minimum lead requirements." },
];

export default function AgentPage() {
  const dark = useDarkMode();
  const [activeFaq, setActiveFaq] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    occupation: "",
    agentType: "",
    experience: "",
    network: "",
    message: "",
  });

  const [heroRef, heroVisible] = useInView(0.1);
  const [benefitsRef, benefitsVisible] = useInView(0.1);
  const [processRef, processVisible] = useInView(0.1);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("https://formsubmit.co/ajax/team.zentrix01@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          "Full Name": form.name,
          "Email": form.email,
          "Phone": form.phone,
          "City": form.city,
          "State": form.state,
          "Current Occupation": form.occupation,
          "Agent Type": form.agentType,
          "Prior Experience": form.experience || "Not Provided",
          "Network Size": form.network || "Not Provided",
          "Message": form.message || "Not Provided",
          "_subject": `New Agent Application - ${form.agentType} - ${form.name}`,
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

  const inputClass = `w-full px-4 py-3 text-xs font-bold border rounded-sm outline-none transition-all duration-200 ${
    dark
      ? "bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#facc15]"
      : "bg-gray-50 border-gray-200 text-zinc-800 placeholder-zinc-400 focus:border-zinc-800"
  }`;

  const labelClass = `block text-[10px] font-black uppercase tracking-widest mb-2 ${
    dark ? "text-zinc-400" : "text-zinc-500"
  }`;

  if (submitted) {
    return (
      <main className={`min-h-screen flex items-center justify-center px-6 ${dark ? "bg-black" : "bg-gray-50"}`}>
        <div className={`max-w-lg w-full text-center p-12 rounded-sm border ${dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100 shadow-xl"}`}>
          <div className="w-20 h-20 bg-[#facc15] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-[#facc15] text-[10px] font-black uppercase tracking-widest block mb-2">
            Application Received!
          </span>
          <h2 className={`text-xl font-black uppercase tracking-tight mb-3 ${dark ? "text-white" : "text-zinc-800"}`}>
            Welcome Aboard, {form.name.split(" ")[0]}!
          </h2>
          <p className={`text-xs leading-relaxed mb-3 ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
            Your agent application has been submitted successfully.
          </p>
          <p className="text-[#facc15] font-black text-sm mb-2">{form.agentType}</p>
          <p className={`text-xs mb-8 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
            Our team will contact you within 2-3 business days on{" "}
            <span className={`font-black ${dark ? "text-white" : "text-zinc-800"}`}>{form.email}</span>
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/"
              className={`px-6 py-3 border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                dark ? "border-zinc-700 text-zinc-400 hover:border-[#facc15] hover:text-[#facc15]" : "border-gray-200 text-zinc-500 hover:border-zinc-800 hover:text-zinc-800"
              }`}
            >
              Go Home
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setForm({ name: "", email: "", phone: "", city: "", state: "", occupation: "", agentType: "", experience: "", network: "", message: "" });
              }}
              className="px-6 py-3 bg-[#facc15] text-black text-[10px] font-black uppercase tracking-widest hover:bg-yellow-400 transition-all"
            >
              New Application
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen transition-colors duration-500 ${dark ? "bg-black" : "bg-gray-50"}`}>

      {/* ── HERO ── */}
      <section
        className="relative flex items-center justify-center text-center py-28 px-6"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/80" />
        <div
          ref={heroRef}
          className="relative z-10 max-w-3xl mx-auto"
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <span className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] block mb-4">
            MTBOSS Construction
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase text-white mb-4 tracking-tighter">
            Become an
            <span className="block text-[#facc15]">Agent</span>
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
            Expand your income by joining MTBOSS's growing agent network. Refer clients, close deals, and earn high commissions — on your own schedule.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-6">
            {[
              { value: "500+", label: "Active Agents" },
              { value: "₹2Cr+", label: "Commissions Paid" },
              { value: "3", label: "Agent Types" },
              { value: "Free", label: "To Join" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-[#facc15] text-2xl font-black">{s.value}</p>
                <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">{s.label}</p>
              </div>
            ))}
          </div>
<a
          
            href="#agent-form"
            className="mt-10 inline-flex items-center gap-3 px-10 py-4 bg-[#facc15] text-black font-black uppercase text-xs tracking-widest hover:bg-yellow-400 transition-all"
          >
            Register as Agent
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>

      {/* ── AGENT TYPES ── */}
      <section className={`py-20 px-6 transition-colors duration-500 ${dark ? "bg-zinc-900" : "bg-white"}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] block mb-2">
              Choose Your Role
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black uppercase tracking-tight ${dark ? "text-white" : "text-zinc-800"}`}>
              Agent Types
            </h2>
            <p className={`text-xs mt-3 max-w-lg mx-auto ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
              Pick the agent type that matches your network and expertise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {agentTypes.map((type, i) => (
              <div
                key={i}
                className={`relative p-8 rounded-sm border-2 transition-all duration-300 flex flex-col ${type.color} ${
                  dark ? "bg-zinc-800" : "bg-white shadow-lg"
                }`}
              >
                {type.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-[#facc15] text-black text-[10px] font-black uppercase tracking-widest rounded-sm">
                      Most Popular
                    </span>
                  </div>
                )}

                <span className="text-4xl mb-5 block">{type.icon}</span>
                <span className={`inline-block self-start px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm mb-4 ${type.badge}`}>
                  {type.earn}
                </span>
                <h3 className={`text-lg font-black uppercase tracking-wide mb-3 ${dark ? "text-white" : "text-zinc-800"}`}>
                  {type.title}
                </h3>
                <p className={`text-xs leading-relaxed flex-1 mb-6 ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
                  {type.desc}
                </p>
                <a
                  href="#agent-form"
                  onClick={() => setForm({ ...form, agentType: type.title })}
                  className={`block text-center py-3 text-[10px] font-black uppercase tracking-widest border-2 rounded-sm transition-all duration-300 ${
                    type.popular
                      ? "bg-[#facc15] border-[#facc15] text-black hover:bg-yellow-400"
                      : dark
                      ? "border-zinc-600 text-zinc-300 hover:border-[#facc15] hover:text-[#facc15]"
                      : "border-zinc-800 text-zinc-800 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  Apply as {type.title}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className={`py-20 px-6 transition-colors duration-500 ${dark ? "bg-black" : "bg-gray-50"}`}>
        <div
          ref={benefitsRef}
          className="max-w-7xl mx-auto"
          style={{
            opacity: benefitsVisible ? 1 : 0,
            transform: benefitsVisible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div className="text-center mb-14">
            <span className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] block mb-2">
              Why Join Us
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black uppercase tracking-tight ${dark ? "text-white" : "text-zinc-800"}`}>
              Agent Benefits
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map((b, i) => (
              <div
                key={i}
                className={`group p-6 rounded-sm border transition-all duration-300 hover:border-[#facc15] ${
                  dark ? "bg-zinc-900 border-zinc-800 hover:bg-zinc-800" : "bg-white border-gray-100 hover:shadow-lg"
                }`}
              >
                <span className="text-3xl block mb-4">{b.icon}</span>
                <h3 className={`text-xs font-black uppercase tracking-widest mb-2 group-hover:text-[#facc15] transition-colors ${dark ? "text-white" : "text-zinc-800"}`}>
                  {b.title}
                </h3>
                <p className={`text-xs leading-relaxed ${dark ? "text-zinc-500" : "text-zinc-500"}`}>
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className={`py-20 px-6 transition-colors duration-500 ${dark ? "bg-zinc-900" : "bg-white"}`}>
        <div
          ref={processRef}
          className="max-w-6xl mx-auto"
          style={{
            opacity: processVisible ? 1 : 0,
            transform: processVisible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div className="text-center mb-14">
            <span className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] block mb-2">
              Simple Process
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black uppercase tracking-tight ${dark ? "text-white" : "text-zinc-800"}`}>
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {howItWorks.map((p, i) => (
              <div
                key={i}
                className={`relative p-6 rounded-sm border transition-all duration-300 group hover:border-[#facc15] ${
                  dark ? "bg-zinc-800 border-zinc-700" : "bg-gray-50 border-gray-100 hover:bg-white hover:shadow-md"
                }`}
              >
                <span className={`text-5xl font-black opacity-10 group-hover:opacity-20 transition-opacity absolute top-4 right-4 ${dark ? "text-[#facc15]" : "text-zinc-800"}`}>
                  {p.step}
                </span>
                <div className="w-10 h-10 bg-[#facc15] rounded-sm flex items-center justify-center mb-4">
                  <span className="text-black font-black text-sm">{p.step}</span>
                </div>
                <h3 className={`text-xs font-black uppercase tracking-widest mb-2 group-hover:text-[#facc15] transition-colors ${dark ? "text-white" : "text-zinc-800"}`}>
                  {p.title}
                </h3>
                <p className={`text-xs leading-relaxed ${dark ? "text-zinc-500" : "text-zinc-500"}`}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEAD CAPTURE STATS STRIP ── */}
      <section className={`py-12 px-6 transition-colors duration-500 ${dark ? "bg-[#facc15]" : "bg-[#facc15]"}`}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "500+", label: "Registered Agents" },
              { value: "₹2Cr+", label: "Total Commissions Paid" },
              { value: "1200+", label: "Leads Generated" },
              { value: "7 Days", label: "Average Payout Time" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-black text-black">{s.value}</p>
                <p className="text-black/60 text-[10px] uppercase tracking-widest font-bold mt-1">{s.label}</p>
              </div>
            ))}
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
                  <span className={`text-xs font-black uppercase tracking-wide pr-4 ${dark ? "text-white" : "text-zinc-800"}`}>
                    {faq.q}
                  </span>
                  <svg
                    className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 text-[#facc15] ${activeFaq === i ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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

      {/* ── AGENT REGISTRATION FORM ── */}
      <section
        id="agent-form"
        className={`py-20 px-6 transition-colors duration-500 ${dark ? "bg-zinc-900" : "bg-white"}`}
      >
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-12">
            <span className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] block mb-2">
              Join Now
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black uppercase tracking-tight ${dark ? "text-white" : "text-zinc-800"}`}>
              Agent Registration
            </h2>
            <p className={`text-xs mt-3 max-w-lg mx-auto ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
              Fill in your details below. Our team will verify and onboard you within 2-3 business days.
            </p>
          </div>

          <div className={`p-8 rounded-sm border ${dark ? "bg-zinc-800 border-zinc-700" : "bg-gray-50 border-gray-100 shadow-sm"}`}>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-sm flex items-start gap-3">
                <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-400 text-[11px] font-bold">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Personal Info */}
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-4 pb-2 border-b ${dark ? "text-zinc-500 border-zinc-700" : "text-zinc-400 border-gray-200"}`}>
                  Personal Information
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input type="text" name="name" required placeholder="Your full name" value={form.name} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Email Address *</label>
                    <input type="email" name="email" required placeholder="your@email.com" value={form.email} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number *</label>
                    <input type="tel" name="phone" required placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Current Occupation *</label>
                    <input type="text" name="occupation" required placeholder="e.g. Real Estate Broker, Engineer" value={form.occupation} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-4 pb-2 border-b ${dark ? "text-zinc-500 border-zinc-700" : "text-zinc-400 border-gray-200"}`}>
                  Location
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>City *</label>
                    <input type="text" name="city" required placeholder="Your city" value={form.city} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>State *</label>
                    <select name="state" required value={form.state} onChange={handleChange} className={inputClass}>
                      <option value="">Select State</option>
                      {[
                        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
                        "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana",
                        "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
                        "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
                        "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
                        "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
                        "Uttar Pradesh", "Uttarakhand", "West Bengal",
                      ].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Agent Preferences */}
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-4 pb-2 border-b ${dark ? "text-zinc-500 border-zinc-700" : "text-zinc-400 border-gray-200"}`}>
                  Agent Preferences
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Agent Type *</label>
                    <select name="agentType" required value={form.agentType} onChange={handleChange} className={inputClass}>
                      <option value="">Select Type</option>
                      <option value="Property Agent">Property Agent</option>
                      <option value="Construction Agent">Construction Agent</option>
                      <option value="Franchise Agent">Franchise Agent</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Prior Experience</label>
                    <select name="experience" value={form.experience} onChange={handleChange} className={inputClass}>
                      <option value="">Select</option>
                      <option value="No Experience">No Experience</option>
                      <option value="1-2 Years">1-2 Years</option>
                      <option value="3-5 Years">3-5 Years</option>
                      <option value="5+ Years">5+ Years</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Network Size</label>
                    <select name="network" value={form.network} onChange={handleChange} className={inputClass}>
                      <option value="">Select</option>
                      <option value="Less than 50">Less than 50 contacts</option>
                      <option value="50-200">50 - 200 contacts</option>
                      <option value="200-500">200 - 500 contacts</option>
                      <option value="500+">500+ contacts</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-4 pb-2 border-b ${dark ? "text-zinc-500 border-zinc-700" : "text-zinc-400 border-gray-200"}`}>
                  Additional Info
                </p>
                <label className={labelClass}>Tell us about yourself (Optional)</label>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Share your background, existing network, or any questions about the agent program..."
                  value={form.message}
                  onChange={handleChange}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Agreement */}
              <div className={`p-4 rounded-sm border ${dark ? "bg-zinc-900 border-zinc-700" : "bg-yellow-50 border-yellow-100"}`}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" required className="mt-0.5 accent-[#facc15]" />
                  <span className={`text-[11px] leading-relaxed ${dark ? "text-zinc-400" : "text-zinc-600"}`}>
                    I confirm that the information provided is accurate. I agree to MTBOSS Construction's agent terms and understand that registration does not guarantee agent status until verified.
                  </span>
                </label>
              </div>

              {/* Submit */}
              <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t ${dark ? "border-zinc-700" : "border-gray-200"}`}>
                <p className={`text-[10px] ${dark ? "text-zinc-600" : "text-zinc-400"}`}>
                  Free to join. No hidden charges whatsoever.
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-12 py-4 bg-[#facc15] text-black text-[10px] font-black uppercase tracking-widest hover:bg-yellow-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-3 rounded-sm"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Register as Agent
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className={`py-16 px-6 transition-colors duration-500 ${dark ? "bg-black" : "bg-zinc-800"}`}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] mb-3">
            Have Questions?
          </p>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-white mb-4 tracking-tight">
            Talk to Our Agent Team
          </h2>
          <p className="text-zinc-400 text-xs mb-8 max-w-lg mx-auto leading-relaxed">
            Call or email us directly — our team will answer all your questions about the agent program.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+919999999999"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#facc15] text-black font-black uppercase text-xs tracking-widest hover:bg-yellow-400 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Now
            </a>
            <a
              href="mailto:agents@mtboss.com"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-white text-white font-black uppercase text-xs tracking-widest hover:bg-white hover:text-zinc-800 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Us
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}