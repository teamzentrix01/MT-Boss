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

const vendorTypes = [
  {
    icon: "🏗️",
    title: "Civil Contractor",
    desc: "Structural work, RCC, brickwork, plastering and all civil construction activities.",
    tag: "Most Needed",
    color: "border-blue-500/30",
    badge: "bg-blue-500/10 text-blue-400",
    popular: false,
  },
  {
    icon: "⚡",
    title: "MEP Contractor",
    desc: "Mechanical, electrical, plumbing, HVAC, fire fighting and allied services.",
    tag: "High Demand",
    color: "border-[#facc15]/30",
    badge: "bg-[#facc15]/10 text-[#facc15]",
    popular: true,
  },
  {
    icon: "🪟",
    title: "Interior Vendor",
    desc: "Flooring, false ceiling, glazing, woodwork, painting and interior fit-outs.",
    tag: "Growing",
    color: "border-green-500/30",
    badge: "bg-green-500/10 text-green-400",
    popular: false,
  },
  {
    icon: "🚛",
    title: "Material Supplier",
    desc: "Supply of cement, steel, sand, aggregates, bricks and construction materials.",
    tag: "Always Open",
    color: "border-purple-500/30",
    badge: "bg-purple-500/10 text-purple-400",
    popular: false,
  },
];

const plans = [
  {
    name: "Free Listing",
    price: "₹ 0",
    period: "Forever",
    color: "border-zinc-500/30",
    features: [
      "Basic profile listing",
      "Listed in vendor directory",
      "1 category listing",
      "Standard visibility",
      "Email support",
    ],
    missing: [
      "Priority placement",
      "Verified badge",
      "Direct project leads",
      "Featured in search",
    ],
    cta: "Register Free",
    highlight: false,
  },
  {
    name: "Professional",
    price: "₹ 2,999",
    period: "Per Year",
    color: "border-[#facc15]",
    features: [
      "Priority profile placement",
      "Verified contractor badge",
      "3 category listings",
      "Direct project lead access",
      "Featured in search results",
      "Dedicated account manager",
      "Phone & email support",
    ],
    missing: [],
    cta: "Get Professional",
    highlight: true,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "₹ 7,999",
    period: "Per Year",
    color: "border-purple-500/30",
    features: [
      "Top placement in directory",
      "Gold verified badge",
      "Unlimited category listings",
      "Priority project lead access",
      "Featured homepage placement",
      "Co-branding opportunities",
      "Dedicated project coordinator",
      "24/7 priority support",
    ],
    missing: [],
    cta: "Get Enterprise",
    highlight: false,
  },
];

const benefits = [
  { icon: "📋", title: "Project Leads", desc: "Get direct access to MTBOSS construction project requirements and tenders." },
  { icon: "✅", title: "Verified Status", desc: "Earn a verified contractor badge that builds trust with clients and partners." },
  { icon: "🌍", title: "Pan India Reach", desc: "Get listed in our national vendor directory visible across 50+ cities." },
  { icon: "💼", title: "Long Term Work", desc: "Build a lasting relationship with one of India's top construction companies." },
  { icon: "📈", title: "Business Growth", desc: "Scale your contracting business with consistent project inflow from MTBOSS." },
  { icon: "🤝", title: "Network Access", desc: "Connect with other vendors, suppliers, and contractors in our ecosystem." },
];

const requirements = [
  { icon: "📄", title: "Legal Documents", desc: "GST registration, PAN card, company registration certificate or proprietorship proof." },
  { icon: "⭐", title: "Experience Proof", desc: "Minimum 2 years of experience with work completion certificates or portfolio." },
  { icon: "📝", title: "Reviews & References", desc: "At least 2 client references or testimonials from previous projects." },
  { icon: "🔗", title: "Supplier Connections", desc: "Details of material suppliers or subcontractors you work with regularly." },
];

const faqs = [
  { q: "Is free registration really free forever?", a: "Yes, the free listing is completely free and stays active indefinitely. However, free listings have limited visibility and do not include direct project lead access." },
  { q: "What documents are required for registration?", a: "You need GST registration, PAN card, company or proprietorship documents, work experience certificates, and at least 2 client references. Professional and Enterprise plans require additional verification." },
  { q: "How long does verification take?", a: "Free listings are activated within 24 hours. Professional and Enterprise plan verifications take 3-5 business days as we verify all documents and references." },
  { q: "What kind of projects will I get access to?", a: "Depending on your category and plan, you can access residential projects, commercial construction, infrastructure work, interior fit-outs, and material supply requirements from MTBOSS and its clients." },
  { q: "Can I upgrade from Free to Professional later?", a: "Yes, you can upgrade your plan at any time. Your profile data and history will be retained and your listing will be upgraded immediately after payment." },
  { q: "Is there a small franchise option available?", a: "Yes, qualified contractors with strong track records can explore our Small Franchise model for specific service categories. Contact our team for details after registration." },
];

export default function ContractorPage() {
  const dark = useDarkMode();
  const [activeFaq, setActiveFaq] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("Free Listing");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    city: "",
    state: "",
    vendorType: "",
    experience: "",
    gst: "",
    pan: "",
    plan: "Free Listing",
    supplierDetails: "",
    message: "",
  });

  const [benefitsRef, benefitsVisible] = useInView(0.1);
  const [reqRef, reqVisible] = useInView(0.1);
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
          "Company Name": form.companyName || "Not Provided",
          "City": form.city,
          "State": form.state,
          "Vendor Type": form.vendorType,
          "Experience": form.experience,
          "GST Number": form.gst || "Not Provided",
          "PAN Number": form.pan || "Not Provided",
          "Registration Plan": form.plan,
          "Supplier Details": form.supplierDetails || "Not Provided",
          "Additional Message": form.message || "Not Provided",
          "_subject": `New Contractor Registration - ${form.vendorType} - ${form.name}`,
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
            Registration Submitted!
          </span>
          <h2 className={`text-xl font-black uppercase tracking-tight mb-3 ${dark ? "text-white" : "text-zinc-800"}`}>
            Welcome, {form.name.split(" ")[0]}!
          </h2>
          <p className={`text-xs leading-relaxed mb-3 ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
            Your contractor registration has been received.
          </p>
          <p className="text-[#facc15] font-black text-sm mb-2">{form.vendorType} — {form.plan}</p>
          <p className={`text-xs mb-8 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
            Our team will verify your details and contact you within 2-3 business days on{" "}
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
                setForm({ name: "", email: "", phone: "", companyName: "", city: "", state: "", vendorType: "", experience: "", gst: "", pan: "", plan: "Free Listing", supplierDetails: "", message: "" });
              }}
              className="px-6 py-3 bg-[#facc15] text-black text-[10px] font-black uppercase tracking-widest hover:bg-yellow-400 transition-all"
            >
              New Registration
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
          backgroundImage: "url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/80" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] block mb-4">
            MTBOSS Construction
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase text-white mb-4 tracking-tighter">
            Join Our
            <span className="block text-[#facc15]">Vendor Network</span>
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
            Register as a contractor or vendor with MTBOSS Construction. Get access to real projects, verified status, and a growing network of opportunities across India.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 mt-6">
            {[
              { value: "200+", label: "Registered Vendors" },
              { value: "50+", label: "Active Projects" },
              { value: "4", label: "Vendor Categories" },
              { value: "Free", label: "Basic Registration" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-[#facc15] text-2xl font-black">{s.value}</p>
                <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">{s.label}</p>
              </div>
            ))}
          </div>
<a
          
            href="#contractor-form"
            className="mt-10 inline-flex items-center gap-3 px-10 py-4 bg-[#facc15] text-black font-black uppercase text-xs tracking-widest hover:bg-yellow-400 transition-all"
          >
            Register Now
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>

      {/* ── VENDOR TYPES ── */}
      <section className={`py-20 px-6 transition-colors duration-500 ${dark ? "bg-zinc-900" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] block mb-2">
              Who Can Join
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black uppercase tracking-tight ${dark ? "text-white" : "text-zinc-800"}`}>
              Vendor Categories
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vendorTypes.map((type, i) => (
              <div
                key={i}
                className={`relative p-6 rounded-sm border-2 transition-all duration-300 flex flex-col group hover:border-[#facc15] ${type.color} ${
                  dark ? "bg-zinc-800" : "bg-white shadow-md"
                }`}
              >
                {type.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-[#facc15] text-black text-[9px] font-black uppercase tracking-widest rounded-sm">
                      High Demand
                    </span>
                  </div>
                )}
                <span className="text-3xl mb-4 block">{type.icon}</span>
                <span className={`inline-block self-start px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm mb-3 ${type.badge}`}>
                  {type.tag}
                </span>
                <h3 className={`text-sm font-black uppercase tracking-wide mb-2 group-hover:text-[#facc15] transition-colors ${dark ? "text-white" : "text-zinc-800"}`}>
                  {type.title}
                </h3>
                <p className={`text-xs leading-relaxed flex-1 ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
                  {type.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REQUIREMENTS ── */}
      <section className={`py-20 px-6 transition-colors duration-500 ${dark ? "bg-black" : "bg-gray-50"}`}>
        <div
          ref={reqRef}
          className="max-w-6xl mx-auto"
          style={{
            opacity: reqVisible ? 1 : 0,
            transform: reqVisible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div className="text-center mb-14">
            <span className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] block mb-2">
              What We Need
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black uppercase tracking-tight ${dark ? "text-white" : "text-zinc-800"}`}>
              Registration Requirements
            </h2>
            <p className={`text-xs mt-3 max-w-lg mx-auto ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
              Keep these documents and details ready before filling the form
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {requirements.map((r, i) => (
              <div
                key={i}
                className={`p-6 rounded-sm border transition-all duration-300 hover:border-[#facc15] group ${
                  dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100 shadow-sm hover:shadow-md"
                }`}
              >
                <span className="text-3xl block mb-4">{r.icon}</span>
                <h3 className={`text-xs font-black uppercase tracking-widest mb-2 group-hover:text-[#facc15] transition-colors ${dark ? "text-white" : "text-zinc-800"}`}>
                  {r.title}
                </h3>
                <p className={`text-xs leading-relaxed ${dark ? "text-zinc-500" : "text-zinc-500"}`}>
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING PLANS ── */}
      <section className={`py-20 px-6 transition-colors duration-500 ${dark ? "bg-zinc-900" : "bg-white"}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] block mb-2">
              Choose Your Plan
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black uppercase tracking-tight ${dark ? "text-white" : "text-zinc-800"}`}>
              Free and Paid Plans
            </h2>
            <p className={`text-xs mt-3 max-w-lg mx-auto ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
              Start free and upgrade anytime as your business grows
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative p-8 rounded-sm border-2 flex flex-col transition-all duration-300 ${plan.color} ${
                  dark ? "bg-zinc-800" : "bg-white shadow-lg"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-[#facc15] text-black text-[10px] font-black uppercase tracking-widest rounded-sm">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className={`text-sm font-black uppercase tracking-widest mb-3 ${dark ? "text-white" : "text-zinc-800"}`}>
                    {plan.name}
                  </h3>
                  <p className="text-[#facc15] text-3xl font-black">{plan.price}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
                    {plan.period}
                  </p>
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <svg className="w-3.5 h-3.5 text-[#facc15] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className={`text-[11px] font-bold ${dark ? "text-zinc-300" : "text-zinc-600"}`}>{f}</span>
                    </li>
                  ))}
                  {plan.missing.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 opacity-40">
                      <svg className="w-3.5 h-3.5 text-zinc-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className={`text-[11px] font-bold ${dark ? "text-zinc-500" : "text-zinc-400"}`}>{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#contractor-form"
                  onClick={() => {
                    setSelectedPlan(plan.name);
                    setForm({ ...form, plan: plan.name });
                  }}
                  className={`block text-center py-3 text-[10px] font-black uppercase tracking-widest border-2 rounded-sm transition-all duration-300 ${
                    plan.highlight
                      ? "bg-[#facc15] border-[#facc15] text-black hover:bg-yellow-400"
                      : dark
                      ? "border-zinc-600 text-zinc-300 hover:border-[#facc15] hover:text-[#facc15]"
                      : "border-zinc-800 text-zinc-800 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  {plan.cta}
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
              Why Register
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black uppercase tracking-tight ${dark ? "text-white" : "text-zinc-800"}`}>
              Vendor Benefits
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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

      {/* ── STATS STRIP ── */}
      <section className="py-12 px-6 bg-[#facc15]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "200+", label: "Registered Vendors" },
              { value: "50+", label: "Active Projects" },
              { value: "₹10Cr+", label: "Work Awarded" },
              { value: "3 Days", label: "Avg Verification Time" },
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
      <section className={`py-20 px-6 transition-colors duration-500 ${dark ? "bg-zinc-900" : "bg-white"}`}>
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
                    ? dark ? "border-[#facc15] bg-zinc-800" : "border-zinc-800 bg-white shadow-md"
                    : dark ? "border-zinc-700 bg-zinc-800" : "border-gray-100 bg-white"
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

      {/* ── REGISTRATION FORM ── */}
      <section
        id="contractor-form"
        className={`py-20 px-6 transition-colors duration-500 ${dark ? "bg-black" : "bg-gray-50"}`}
      >
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-12">
            <span className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] block mb-2">
              Get Started
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black uppercase tracking-tight ${dark ? "text-white" : "text-zinc-800"}`}>
              Contractor Registration
            </h2>
            <p className={`text-xs mt-3 max-w-lg mx-auto ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
              Fill in your details. Our verification team will contact you within 2-3 business days.
            </p>
            {/* Selected Plan Badge */}
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#facc15]/10 border border-[#facc15]/30 rounded-sm">
              <span className="text-[#facc15] text-[10px] font-black uppercase tracking-widest">
                Selected Plan:
              </span>
              <span className="text-[#facc15] text-[10px] font-black uppercase tracking-widest">
                {form.plan}
              </span>
            </div>
          </div>

          <div className={`p-8 rounded-sm border ${dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100 shadow-sm"}`}>

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
                <p className={`text-[10px] font-black uppercase tracking-widest mb-4 pb-2 border-b ${dark ? "text-zinc-500 border-zinc-800" : "text-zinc-400 border-gray-200"}`}>
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
                    <label className={labelClass}>Company / Firm Name</label>
                    <input type="text" name="companyName" placeholder="Your company or firm name" value={form.companyName} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-4 pb-2 border-b ${dark ? "text-zinc-500 border-zinc-800" : "text-zinc-400 border-gray-200"}`}>
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

              {/* Contractor Details */}
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-4 pb-2 border-b ${dark ? "text-zinc-500 border-zinc-800" : "text-zinc-400 border-gray-200"}`}>
                  Contractor Details
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Vendor Type *</label>
                    <select name="vendorType" required value={form.vendorType} onChange={handleChange} className={inputClass}>
                      <option value="">Select Type</option>
                      <option value="Civil Contractor">Civil Contractor</option>
                      <option value="MEP Contractor">MEP Contractor</option>
                      <option value="Interior Vendor">Interior Vendor</option>
                      <option value="Material Supplier">Material Supplier</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Years of Experience *</label>
                    <select name="experience" required value={form.experience} onChange={handleChange} className={inputClass}>
                      <option value="">Select</option>
                      <option value="Less than 2 Years">Less than 2 Years</option>
                      <option value="2-5 Years">2-5 Years</option>
                      <option value="5-10 Years">5-10 Years</option>
                      <option value="10+ Years">10+ Years</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Registration Plan *</label>
                    <select name="plan" required value={form.plan} onChange={(e) => { handleChange(e); setSelectedPlan(e.target.value); }} className={inputClass}>
                      <option value="Free Listing">Free Listing — ₹0</option>
                      <option value="Professional">Professional — ₹2,999/yr</option>
                      <option value="Enterprise">Enterprise — ₹7,999/yr</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Legal Documents */}
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-4 pb-2 border-b ${dark ? "text-zinc-500 border-zinc-800" : "text-zinc-400 border-gray-200"}`}>
                  Legal Details
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>GST Number</label>
                    <input type="text" name="gst" placeholder="Your GST registration number" value={form.gst} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>PAN Number *</label>
                    <input type="text" name="pan" required placeholder="Your PAN card number" value={form.pan} onChange={handleChange} className={inputClass} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Supplier / Subcontractor Connections</label>
                    <input type="text" name="supplierDetails" placeholder="e.g. Ultratech Cement dealer, local steel supplier..." value={form.supplierDetails} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-4 pb-2 border-b ${dark ? "text-zinc-500 border-zinc-800" : "text-zinc-400 border-gray-200"}`}>
                  Additional Info
                </p>
                <label className={labelClass}>Tell us about your work (Optional)</label>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Describe your past projects, specializations, team size, or any other relevant information..."
                  value={form.message}
                  onChange={handleChange}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Agreement */}
              <div className={`p-4 rounded-sm border ${dark ? "bg-zinc-800 border-zinc-700" : "bg-yellow-50 border-yellow-100"}`}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" required className="mt-0.5 accent-[#facc15]" />
                  <span className={`text-[11px] leading-relaxed ${dark ? "text-zinc-400" : "text-zinc-600"}`}>
                    I confirm that all information provided is accurate and that I have the required documents available for verification. I agree to MTBOSS Construction's vendor terms and conditions.
                  </span>
                </label>
              </div>

              {/* Submit */}
              <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t ${dark ? "border-zinc-800" : "border-gray-200"}`}>
                <p className={`text-[10px] ${dark ? "text-zinc-600" : "text-zinc-400"}`}>
                  Your information is secure and will only be used for verification purposes.
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
                      Submit Registration
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
      <section className={`py-16 px-6 transition-colors duration-500 ${dark ? "bg-zinc-900" : "bg-zinc-800"}`}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] mb-3">
            Need Help?
          </p>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-white mb-4 tracking-tight">
            Talk to Our Vendor Team
          </h2>
          <p className="text-zinc-400 text-xs mb-8 max-w-lg mx-auto leading-relaxed">
            Have questions about registration, plans, or the verification process? Our vendor management team is here to help.
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
              href="mailto:vendors@mtboss.com"
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