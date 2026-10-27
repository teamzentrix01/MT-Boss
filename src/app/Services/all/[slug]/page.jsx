"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PortfolioProjectCard from "@/app/components/PortfolioProjectCard";
import { fallbackProjects } from "@/lib/public-fallbacks";
import { COMPANY_CONTACT } from "../../../lib/company";
import { 
  CheckCircle2, 
  ChevronDown, 
  Check, 
  Navigation, 
  UploadCloud, 
  Trash2, 
  ArrowRight,
  Building2,
  ShieldCheck,
  Phone,
  Mail,
  Layers,
  Calendar,
  IndianRupee,
  Search,
  Leaf,
  Key
} from "lucide-react";

const fallbackProcess = [
  { step: "01", title: "Consultation & Brief",  desc: "We analyse your goals, site conditions, budget, and timeline before anything begins." },
  { step: "02", title: "Design & Planning",      desc: "Architects and engineers finalise blueprints tailored to your vision and local regulations." },
  { step: "03", title: "Approvals & Permits",   desc: "We handle all municipal approvals, RERA registrations, and statutory clearances." },
  { step: "04", title: "Execution & Structure", desc: "Premium-grade materials, strict quality control, and milestone-based site management." },
  { step: "05", title: "MEP & Finishing",       desc: "Electrical, plumbing, HVAC, and premium finishing — tiles, paint, woodwork, fixtures." },
  { step: "06", title: "Handover & Support",    desc: "Snag-free possession with full warranty and a dedicated post-handover support team." },
];

const fallbackBenefits = [
  { icon: "🏗️", title: "Quality Materials",     desc: "Only certified, premium-grade materials used across all projects." },
  { icon: "⏱️", title: "On-Time Delivery",      desc: "Milestone-based scheduling ensures zero delays." },
  { icon: "💰", title: "Transparent Pricing",   desc: "Fixed-cost contracts — no hidden charges, ever." },
  { icon: "🔬", title: "Quality Audits",        desc: "Third-party inspections at every critical stage." },
  { icon: "🌿", title: "Sustainable Practices", desc: "Eco-friendly methods and green building options available." },
  { icon: "🔑", title: "Turnkey Ready",         desc: "Complete delivery with zero coordination hassle for the client." },
];

const INDIA_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka',
  'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const TIME_SLOTS = [
  "Morning (9AM – 12PM)",
  "Afternoon (12PM – 4PM)",
  "Evening (4PM – 7PM)",
];

const PROJECT_TYPES = [
  "Commercial Construction",
  "Corporate Office / Complex",
  "Retail Showroom / Mall",
  "Hotel & Hospitality",
  "Warehouse & Industrial Shed",
  "Hospital & Healthcare",
  "Institutional & Educational",
  "Other Commercial Space",
];

const BUDGET_RANGES = [
  "Under ₹25L",
  "₹25L – ₹50L",
  "₹50L – ₹1Cr",
  "₹1Cr – ₹2Cr",
  "₹2Cr – ₹5Cr",
  "₹5Cr+",
];

export default function ServiceDetailPage() {
  const { slug }   = useParams();
  const router     = useRouter();

  const [service,           setService]           = useState(null);
  const [portfolioProjects, setPortfolioProjects] = useState([]);
  const [loading,           setLoading]           = useState(true);
  const [notFound,          setNotFound]          = useState(false);
  const [isDark,            setIsDark]            = useState(false);

  const [form, setForm] = useState({
    name: "", phone: "", alternatePhone: "", email: "", message: "",
    projectType: "", budget: "", carpetArea: "", timeSlot: "9 AM – 12 PM", meetingDate: "", state: "", city: "", address: "",
  });

  const [gpsCoords,    setGpsCoords]    = useState(null);
  const [fetchingGps,  setFetchingGps]  = useState(false);
  const [gpsError,     setGpsError]     = useState("");

  const [submitted,    setSubmitted]    = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [submitError,  setSubmitError]  = useState("");
  const [propertyImages, setPropertyImages] = useState([]);
  const [showScopeDrawer, setShowScopeDrawer] = useState(false);

  const removePropertyImage = (idxToRemove) => {
    setPropertyImages(prev => prev.filter((_, i) => i !== idxToRemove));
  };

  const BUDGET_PRESETS = ["Under ₹25L", "₹25L – ₹50L", "₹50L – ₹1Cr", "₹1Cr+"];

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark-mode"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const res  = await fetch(`/api/primary-services?slug=${slug}`);
        const data = await res.json();
        if (data.success) setService(data.data);
        else setNotFound(true);
      } catch { setNotFound(true); }
      finally { setLoading(false); }
    })();
  }, [slug]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.data)) {
          setPortfolioProjects(data.data);
        }
      } catch (err) {
        console.error("Error fetching portfolio projects:", err);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const bg   = isDark ? "bg-black text-white"            : "bg-white text-zinc-900";
  const muted= isDark ? "text-zinc-400"                  : "text-zinc-600";
  const card = isDark ? "bg-zinc-950 border-zinc-800"    : "bg-zinc-50 border-zinc-100";
  const inp  = `w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-all duration-200 ${isDark
    ? "bg-zinc-900 border-zinc-700/80 text-white placeholder:text-zinc-500 focus:border-[var(--brand-blue)] focus:ring-1 focus:ring-[var(--brand-blue)]/30"
    : "bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/15"}`;

  const fetchLiveLocation = () => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation not supported by your browser. Enter address manually.");
      return;
    }
    setFetchingGps(true);
    setGpsError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setGpsCoords({ lat, lng });
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const d = await r.json();
          const location = d.address || {};
          const detectedCity = location.city || location.town || location.village || location.suburb || location.municipality || location.county || location.city_district || '';
          const detectedState = location.state || location.state_district || '';
          const matchedState = INDIA_STATES.find(item => 
            item.toLowerCase() === detectedState.toLowerCase() ||
            detectedState.toLowerCase().includes(item.toLowerCase()) ||
            item.toLowerCase().includes(detectedState.toLowerCase())
          );
          if (d.display_name || detectedCity || detectedState) {
            setForm(f => ({
              ...f,
              address: d.display_name || f.address,
              city: detectedCity || f.city,
              state: matchedState || f.state,
            }));
          }
        } catch {}
        setFetchingGps(false);
      },
      () => {
        setGpsError("Could not fetch location. Please allow location access or enter address manually.");
        setFetchingGps(false);
      },
      { timeout: 10000 }
    );
  };

  const handlePropertyImages = (files) => {
    const selected = Array.from(files || []);
    if (selected.length === 0) { setPropertyImages([]); setSubmitError(""); return; }
    if (selected.length > 10) { setSubmitError("Max 10 property images."); setPropertyImages([]); return; }
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (selected.some(f => !allowed.includes(f.type))) { setSubmitError("Only JPG, PNG or WEBP images."); return; }
    if (selected.some(f => f.size > 5 * 1024 * 1024)) { setSubmitError("Each image must be under 5MB."); return; }
    setSubmitError("");
    setPropertyImages(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);

    if (!form.name.trim() || !form.phone.trim()) {
      setSubmitError("Please provide your Full Name and Main Phone Number.");
      setSubmitting(false);
      return;
    }

    if (!form.state || !form.city.trim() || !form.address.trim()) {
      setSubmitError("Please select State, enter City, and provide Full Address.");
      setSubmitting(false);
      return;
    }

    if (form.meetingDate) {
      const selectedDate = new Date(form.meetingDate + "T00:00:00");
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      if (isNaN(selectedDate.getTime()) || selectedDate <= todayDate) {
        setSubmitError("Preferred meeting date must be from tomorrow onwards. Same-day booking is not available.");
        setSubmitting(false);
        return;
      }
      if (selectedDate.getFullYear() > 9999) {
        setSubmitError("Please enter a valid year for the preferred meeting date.");
        setSubmitting(false);
        return;
      }
    }

    try {
      const payload = new FormData();
      payload.append("service_slug", slug);
      payload.append("service_title", service.title);
      payload.append("name", form.name);
      payload.append("phone", form.phone);
      payload.append("alternate_phone", form.alternatePhone);
      payload.append("email", form.email);
      payload.append("message", form.message);
      payload.append("budget", form.budget);
      payload.append("carpet_area", form.carpetArea);
      payload.append("time_slot", form.timeSlot);
      payload.append("meeting_date", form.meetingDate);
      payload.append("state", form.state);
      payload.append("city", form.city);
      payload.append("gps_location", gpsCoords ? `${gpsCoords.lat.toFixed(6)},${gpsCoords.lng.toFixed(6)}` : "");
      payload.append("address", form.address);
      propertyImages.forEach(file => payload.append("property_images", file));

      const token = localStorage.getItem('token');
      const res = await fetch("/api/primary-service-enquiries", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: payload,
      });
      const data = await res.json();
      if (!res.ok || !data.success) { setSubmitError(data.error || "Something went wrong. Please try again."); return; }
      setSubmitted(true);
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <main className={`min-h-screen flex items-center justify-center font-serif ${bg}`}>
      <p className="text-[var(--brand-blue)] text-sm font-black uppercase tracking-widest animate-pulse">Loading...</p>
    </main>
  );

  if (notFound || !service) return (
    <main className={`min-h-screen flex flex-col items-center justify-center font-serif ${bg}`}>
      <p className="text-6xl mb-4">🏗️</p>
      <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Service Not Found</h1>
      <p className={`text-sm mb-6 ${muted}`}>This service doesn&apos;t exist or has been removed.</p>
      <button onClick={() => router.push("/Services/all")}
        className="px-6 py-3 bg-[var(--brand-blue)] text-black font-black uppercase text-[9px] tracking-widest hover:bg-black hover:text-[var(--brand-blue)] transition-all">
        ← Back to Services
      </button>
    </main>
  );

  const processList  = Array.isArray(service.process)  && service.process.length  > 0 ? service.process  : fallbackProcess;
  const benefitsList = Array.isArray(service.benefits) && service.benefits.length > 0 ? service.benefits : fallbackBenefits;
  const rawProjects = (() => {
    if (portfolioProjects.length > 0) {
      const sTitle = (service.title || "").toLowerCase();
      const sSlug = (slug || "").toLowerCase().replace(/-/g, " ");

      const matchesCategory = (category) => {
        if (!category) return false;
        const cat = category.toLowerCase().trim();
        return sTitle.includes(cat) || cat.includes(sTitle) || sSlug.includes(cat) || cat.includes(sSlug);
      };

      const matching = portfolioProjects.filter((p) => matchesCategory(p.category));
      const nonMatching = portfolioProjects.filter((p) => !matching.some((m) => m.id === p.id));
      const combined = [...matching, ...nonMatching];
      return combined.slice(0, 4);
    }
    if (Array.isArray(service.projects) && service.projects.length > 0) {
      return service.projects;
    }
    return fallbackProjects;
  })();

  const projectsList = rawProjects.map((p, idx) => ({
    id: p.id || `fallback-${idx}`,
    title: p.title || p.name || "Signature Project",
    category: p.category || p.type || "Construction",
    location: p.location || p.area || "India",
    description: p.description || "",
    image_url: p.image_url || p.image || p.img,
    status: p.status || "Completed",
  }));

  const stats = [
    service.stat1_value ? [service.stat1_value, service.stat1_label] : null,
    service.stat2_value ? [service.stat2_value, service.stat2_label] : null,
    service.stat3_value ? [service.stat3_value, service.stat3_label] : null,
    service.stat4_value ? [service.stat4_value, service.stat4_label] : null,
  ].filter(Boolean);

  const defaultStats = [
    ["500+", "Projects delivered"],
    ["12+", "Years of experience"],
    ["98%", "On-time rate"],
    ["0", "Hidden charges"],
  ];
  const finalStats   = stats.length > 0 ? stats : defaultStats;

  const words     = service.title.split(" ");
  const titleMain = words.slice(0, -1).join(" ");
  const titleLast = words[words.length - 1];

  const heroSubtitle  = service.hero_subtitle  || service.description;
  const aboutHeading  = service.about_heading  || "Built with Precision";
  const aboutBody     = service.about_body     || service.description;
  const ctaHeading    = service.cta_heading    || `Start Your ${service.title} Project`;
  const phone         = service.contact_phone || COMPANY_CONTACT.phone;
  const email         = service.contact_email  || "MTBOSS2016@gmail.com";

  const getTomorrowIso = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const minDate = getTomorrowIso();

  return (
    <main className={`min-h-screen font-sans antialiased transition-colors duration-500 flex flex-col ${isDark ? "bg-zinc-950 text-white" : "bg-[#f4f6fa] text-zinc-900"}`}>

      {/* ── Hero ── */}
      <section className="relative h-[40vh] min-h-[300px] flex items-end overflow-hidden">
        {service.image && <Image src={service.image} alt={service.title} fill sizes="100vw" quality={80} priority className="object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-8 w-full">
          <p className="text-[var(--brand-blue)] text-xs font-bold uppercase tracking-[0.4em] mb-2">MTBOSS Construction</p>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight mb-2">
            {titleMain} <span className="text-[var(--brand-blue)]">{titleLast}</span>
          </h1>
          <p className="text-zinc-300 text-xs md:text-sm max-w-lg leading-relaxed">{heroSubtitle}</p>
        </div>
      </section>

      {/* ── Main Consultation & Portfolio Container ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full flex-1 space-y-16">

        {/* ── Row 1: Two Cards (Left: Information Card, Right: The Actual Form Card) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Side: Information Card (Gradient #0B3D91 to #1F6FEB, 24px rounded card) */}
          <div className="lg:col-span-5 flex flex-col">
            <div 
              style={{ background: 'linear-gradient(180deg, #0B3D91 0%, #1F6FEB 100%)' }}
              className="text-white rounded-[24px] p-6 sm:p-7 shadow-2xl flex flex-col justify-between h-full relative overflow-hidden"
            >
              <div>
                {/* 1. Header & Quick Contact Cards */}
                <div>
                  {/* Response within 24 hours Pill */}
                  <div className="inline-block px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs mb-3 w-fit">
                    Response within 24 hours
                  </div>

                  {/* Headline */}
                  <h2 className="text-2xl sm:text-[27px] font-extrabold text-white tracking-tight leading-[1.2] mb-2">
                    Start your commercial construction project
                  </h2>

                  {/* Subtext */}
                  <p className="text-white/85 text-[12px] leading-relaxed mb-3.5 font-normal">
                    Direct technical consultation, architectural feasibility and a fixed-price quotation for your commercial space.
                  </p>

                  {/* Helpline & Email: Two Compact Cards Side by Side */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <a
                      href={`tel:${phone.replace(/\s+/g, '')}`}
                      className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5 transition-all min-w-0"
                    >
                      <div className="w-8 h-8 rounded-full bg-white text-[#0B3D91] flex items-center justify-center shrink-0 shadow-xs">
                        <Phone size={14} className="fill-current" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white/70 text-[10px] leading-none mb-1">Direct helpline</p>
                        <p className="text-white font-bold text-xs leading-tight truncate">{phone || "+91 94584 10866"}</p>
                      </div>
                    </a>

                    <a
                      href={`mailto:${email}`}
                      className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5 transition-all min-w-0"
                    >
                      <div className="w-8 h-8 rounded-full bg-white text-[#0B3D91] flex items-center justify-center shrink-0 shadow-xs">
                        <Mail size={14} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white/70 text-[10px] leading-none mb-1">Corporate email</p>
                        <p className="text-white font-bold text-xs leading-tight truncate">{email || "mtboss2016@gmail.com"}</p>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Thin Translucent Divider */}
                <div className="border-t border-white/15 my-4" />

                {/* 2. Built with precision & 4 Mini Stat Cards */}
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">Built with precision</h3>
                  <p className="text-white/85 text-[12px] leading-normal mt-0.5 mb-2.5">
                    You deal with one contractor instead of juggling architects, engineers and subcontractors.
                  </p>

                  {/* 4 Mini Stat Cards in One Row */}
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                    <div className="bg-white rounded-xl p-2 sm:p-2.5 text-zinc-900 shadow-xs text-left">
                      <p className="text-sm sm:text-base font-black text-[#0B3D91] leading-none mb-1">500+</p>
                      <p className="text-[10px] sm:text-[11px] text-zinc-500 font-medium leading-tight">Projects delivered</p>
                    </div>
                    <div className="bg-white rounded-xl p-2 sm:p-2.5 text-zinc-900 shadow-xs text-left">
                      <p className="text-sm sm:text-base font-black text-[#0B3D91] leading-none mb-1">12+</p>
                      <p className="text-[10px] sm:text-[11px] text-zinc-500 font-medium leading-tight">Years experience</p>
                    </div>
                    <div className="bg-white rounded-xl p-2 sm:p-2.5 text-zinc-900 shadow-xs text-left">
                      <p className="text-sm sm:text-base font-black text-[#0B3D91] leading-none mb-1">98%</p>
                      <p className="text-[10px] sm:text-[11px] text-zinc-500 font-medium leading-tight">On-time rate</p>
                    </div>
                    <div className="bg-white rounded-xl p-2 sm:p-2.5 text-zinc-900 shadow-xs text-left">
                      <p className="text-sm sm:text-base font-black text-[#0B3D91] leading-none mb-1">0</p>
                      <p className="text-[10px] sm:text-[11px] text-zinc-500 font-medium leading-tight">Hidden charges</p>
                    </div>
                  </div>
                </div>

                {/* Thin Translucent Divider */}
                <div className="border-t border-white/15 my-4" />

                {/* 3. Our process (6 Compact Steps) */}
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight mb-2.5">Our process</h3>
                  <div className="space-y-2">
                    {[
                      {
                        num: 1,
                        title: "Consultation and brief",
                        desc: "We analyse your goals, site conditions, budget and timeline before anything begins.",
                      },
                      {
                        num: 2,
                        title: "Design and planning",
                        desc: "Architects and engineers finalise blueprints tailored to your vision and local rules.",
                      },
                      {
                        num: 3,
                        title: "Approvals and permits",
                        desc: "We handle municipal approvals, RERA registrations and statutory clearances.",
                      },
                      {
                        num: 4,
                        title: "Execution and structure",
                        desc: "Premium-grade materials, strict quality control and milestone-based site management.",
                      },
                      {
                        num: 5,
                        title: "MEP and finishing",
                        desc: "Electrical, plumbing, HVAC and premium finishing: tiles, paint, woodwork, fixtures.",
                      },
                      {
                        num: 6,
                        title: "Handover and support",
                        desc: "Snag-free possession with full warranty and a dedicated post-handover support team.",
                      },
                    ].map((step) => (
                      <div key={step.num} className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-white/20 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {step.num}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-white leading-tight">{step.title}</p>
                          <p className="text-white/80 text-[12px] leading-snug mt-0.5">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Thin Translucent Divider */}
                <div className="border-t border-white/15 my-4" />

                {/* 4. The MTBOSS advantage (2-Column Grid of 6 Cards) */}
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight mb-2.5">The MTBOSS advantage</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {
                        icon: <Layers size={15} className="text-amber-600" />,
                        title: "Quality materials",
                        desc: "Only certified, premium-grade materials on every project.",
                      },
                      {
                        icon: <Calendar size={15} className="text-red-500" />,
                        title: "On-time delivery",
                        desc: "Milestone-based scheduling ensures zero delays.",
                      },
                      {
                        icon: <IndianRupee size={15} className="text-amber-500" />,
                        title: "Transparent pricing",
                        desc: "Fixed-cost contracts, no hidden charges, ever.",
                      },
                      {
                        icon: <Search size={15} className="text-teal-600" />,
                        title: "Quality audits",
                        desc: "Third-party inspections at every critical stage.",
                      },
                      {
                        icon: <Leaf size={15} className="text-emerald-600" />,
                        title: "Sustainable practices",
                        desc: "Eco-friendly methods and green building options.",
                      },
                      {
                        icon: <Key size={15} className="text-amber-500" />,
                        title: "Turnkey ready",
                        desc: "Complete delivery with zero coordination hassle.",
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white/10 border border-white/10 rounded-xl p-2.5 flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white leading-tight truncate">{item.title}</p>
                          <p className="text-white/75 text-[11px] leading-tight mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Side: The Actual Form Card (Matching Image) */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="bg-white rounded-[28px] border border-zinc-200/90 p-8 sm:p-10 text-center shadow-xl text-zinc-900">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <CheckCircle2 size={32} />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">Consultation Scheduled</p>
                <h3 className="text-2xl font-bold text-zinc-900 tracking-tight">Enquiry Received</h3>
                <p className="mt-2 text-sm text-zinc-600 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{form.name}</strong>. Our senior commercial project engineer will review your request and connect at <strong>{form.phone}</strong> within 24 hours.
                </p>

                <div className="mt-6 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-left text-xs space-y-1.5 text-zinc-700">
                  <p className="font-bold text-[11px] uppercase tracking-wider text-[#1258d4]">Booking Summary</p>
                  <p><span className="text-zinc-500">Service:</span> <strong>{service.title}</strong></p>
                  <p><span className="text-zinc-500">Location:</span> <strong>{form.city}, {form.state}</strong></p>
                  {form.meetingDate && (
                    <p><span className="text-zinc-500">Site Visit:</span> <strong>{form.meetingDate} ({form.timeSlot})</strong></p>
                  )}
                  {form.budget && (
                    <p><span className="text-zinc-500">Budget:</span> <strong>{form.budget}</strong></p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setForm({
                      name: "", phone: "", alternatePhone: "", email: "", message: "",
                      projectType: "", budget: "", carpetArea: "", timeSlot: "9 AM – 12 PM", meetingDate: "", state: "", city: "", address: "",
                    });
                    setPropertyImages([]);
                  }}
                  className="mt-6 px-6 py-2.5 rounded-xl border border-zinc-300 text-xs font-bold uppercase tracking-wider hover:bg-zinc-100 transition-all cursor-pointer"
                >
                  Book Another Consultation
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-[28px] border border-zinc-200/90 shadow-xl p-8 sm:p-10 text-zinc-900 transition-all">
                {/* Form Header */}
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
                  Book a site consultation
                </h2>
                <p className="text-zinc-500 text-xs sm:text-sm mt-1 mb-6 font-normal">
                  Tell us where and when. It takes about 2 minutes.
                </p>

                {/* 3-Step Progress Stepper Bar */}
                <div className="flex items-center gap-3 sm:gap-6 mb-8 text-xs font-semibold">
                  <div className="flex-1 pb-2 border-b-2 border-[#1258d4] text-[#1258d4] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1258d4] text-white text-[11px] font-bold flex items-center justify-center shrink-0">1</span>
                    <span className="truncate">Your details</span>
                  </div>
                  <div className="flex-1 pb-2 border-b-2 border-[#1258d4] text-[#1258d4] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1258d4] text-white text-[11px] font-bold flex items-center justify-center shrink-0">2</span>
                    <span className="truncate">Site and meeting</span>
                  </div>
                  <div className="flex-1 pb-2 border-b-2 border-zinc-200 text-zinc-400 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-600 text-[11px] font-bold flex items-center justify-center shrink-0">3</span>
                    <span className="truncate">Project info</span>
                  </div>
                </div>

                {/* Section 1: Your details */}
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 mb-3">Your details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-zinc-700 mb-1.5 block">Full name <span className="text-red-500">*</span></label>
                      <input
                        required
                        type="text"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#1258d4] focus:ring-1 focus:ring-[#1258d4] transition-all"
                        placeholder="e.g. Vikram Mehta"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-zinc-700 mb-1.5 block">Phone number <span className="text-red-500">*</span></label>
                      <input
                        required
                        type="tel"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#1258d4] focus:ring-1 focus:ring-[#1258d4] transition-all"
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="text-xs font-semibold text-zinc-700 mb-1.5 block">
                      Work email <span className="text-zinc-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="email"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#1258d4] focus:ring-1 focus:ring-[#1258d4] transition-all"
                      placeholder="name@company.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>

                {/* Section 2: Site and meeting */}
                <div className="mt-7">
                  <h3 className="font-bold text-sm text-zinc-900 mb-3">Site and meeting</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-zinc-700 mb-1.5 block">State / UT <span className="text-red-500">*</span></label>
                      <select
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-800 focus:outline-none focus:border-[#1258d4] focus:ring-1 focus:ring-[#1258d4] transition-all"
                        value={form.state}
                        onChange={e => setForm({ ...form, state: e.target.value })}
                      >
                        <option value="">Select state</option>
                        {INDIA_STATES.map(st => <option key={st} value={st}>{st}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-zinc-700 mb-1.5 block">City <span className="text-red-500">*</span></label>
                      <input
                        required
                        type="text"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#1258d4] focus:ring-1 focus:ring-[#1258d4] transition-all"
                        placeholder="City name"
                        value={form.city}
                        onChange={e => setForm({ ...form, city: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-zinc-700">Full site address <span className="text-red-500">*</span></label>
                      <button
                        type="button"
                        onClick={fetchLiveLocation}
                        disabled={fetchingGps}
                        className="text-xs font-semibold text-[#1258d4] bg-blue-50 hover:bg-blue-100 px-4 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer border border-blue-200/80 shadow-xs"
                        title="Use my location to auto-detect address"
                      >
                        <Navigation size={12} className={fetchingGps ? "animate-spin" : "rotate-45"} />
                        <span>{fetchingGps ? "Locating..." : gpsCoords ? "✓ Located" : "Use my location"}</span>
                      </button>
                    </div>
                    <textarea
                      required
                      rows={2}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#1258d4] focus:ring-1 focus:ring-[#1258d4] transition-all"
                      placeholder="Plot no., commercial complex, landmark, PIN code"
                      value={form.address}
                      onChange={e => setForm({ ...form, address: e.target.value })}
                    />
                  </div>

                  {gpsError && (
                    <div className="mt-2 p-2 rounded-md bg-amber-50 border border-amber-200 text-amber-600 text-xs font-medium flex items-center gap-1.5">
                      <span>⚠️</span>
                      <span>{gpsError}</span>
                    </div>
                  )}

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-zinc-700 mb-1.5 block">Meeting date</label>
                      <input
                        type="date"
                        min={minDate}
                        max="9999-12-31"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-800 focus:outline-none focus:border-[#1258d4] focus:ring-1 focus:ring-[#1258d4] transition-all"
                        value={form.meetingDate}
                        onChange={e => setForm({ ...form, meetingDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-zinc-700">Preferred time</label>
                        {form.timeSlot ? (
                          <span className="text-[11px] font-bold text-[#1258d4] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                            Selected: {form.timeSlot}
                          </span>
                        ) : (
                          <span className="text-[11px] text-zinc-400">Select slot</span>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: "9 AM – 12 PM", val: "9 AM – 12 PM", num: "912" },
                          { label: "12 PM – 4 PM", val: "12 PM – 4 PM", num: "124" },
                          { label: "4 PM – 7 PM", val: "4 PM – 7 PM", num: "47" },
                        ].map((slot) => {
                          const cleanDigits = (s) => String(s || "").replace(/[^0-9]/g, "");
                          const isSel = form.timeSlot === slot.val || cleanDigits(form.timeSlot) === slot.num;
                          return (
                            <button
                              key={slot.val}
                              type="button"
                              onClick={() => setForm(f => ({ ...f, timeSlot: slot.val }))}
                              className={`py-2 px-1 text-center rounded-xl text-xs transition-all cursor-pointer border ${
                                isSel
                                  ? "bg-[#1258d4] text-white border-[#1258d4] font-bold shadow-sm"
                                  : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300 font-medium"
                              }`}
                            >
                              {slot.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

{/* Section 3: Project scope, budget and drawings */}
<div className="mt-6 rounded-2xl border border-zinc-200 p-4.5 bg-zinc-50/50 space-y-4">
  <div className="flex items-center justify-between">
    <h4 className="font-bold text-sm text-zinc-900">
      Project scope, budget and drawings
    </h4>
    <span className="text-xs text-zinc-400 font-medium">
      Optional
    </span>
  </div>

  {/* Live Location */}
  <div>
    <label
      className={`text-xs font-semibold block mb-1.5 ${
        isDark ? "text-zinc-400" : "text-zinc-600"
      }`}
    >
      Your Location
    </label>

    <button
      type="button"
      onClick={fetchLiveLocation}
      disabled={fetchingGps}
      className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
        gpsCoords
          ? "bg-green-600 text-white border-green-600"
          : isDark
            ? "bg-zinc-800 text-zinc-300 border-zinc-600 hover:border-blue-500"
            : "bg-white text-zinc-700 border-zinc-300 hover:border-blue-500"
      }`}
    >
      {fetchingGps
        ? "Fetching location..."
        : gpsCoords
          ? `✓ Location Fetched (${gpsCoords.lat.toFixed(4)}, ${gpsCoords.lng.toFixed(4)})`
          : "Use My Live Location"}
    </button>

    {gpsError && (
      <p className="mt-1.5 text-xs font-medium text-red-500">
        {gpsError}
      </p>
    )}
  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-xs font-semibold text-zinc-700 mb-1.5 block">Project type</label>
                      <select
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-800 focus:outline-none focus:border-[#1258d4] focus:ring-1 focus:ring-[#1258d4] transition-all"
                        value={form.projectType || ""}
                        onChange={e => setForm({ ...form, projectType: e.target.value })}
                      >
                        <option value="">Select type</option>
                        {PROJECT_TYPES.map(pt => <option key={pt} value={pt}>{pt}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-zinc-700 mb-1.5 block">Approx. budget</label>
                      <select
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-800 focus:outline-none focus:border-[#1258d4] focus:ring-1 focus:ring-[#1258d4] transition-all"
                        value={form.budget}
                        onChange={e => setForm({ ...form, budget: e.target.value })}
                      >
                        <option value="">Select range</option>
                        {BUDGET_RANGES.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="border border-dashed border-blue-300 bg-blue-50/40 hover:bg-blue-50/80 rounded-xl py-3 px-4 flex items-center justify-center gap-2 cursor-pointer transition-all">
                      <span className="text-xs font-semibold text-[#1258d4]">⬆ Upload drawings or reference files</span>
                      <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp,.pdf"
                        className="hidden"
                        onChange={e => handlePropertyImages(e.target.files)}
                      />
                    </label>

                    {propertyImages.length > 0 && (
                      <div className="mt-2.5 space-y-1">
                        {propertyImages.map((file, idx) => (
                          <div key={`${file.name}-${idx}`} className="flex items-center justify-between text-xs px-3 py-1.5 rounded-lg border border-zinc-200 bg-white">
                            <span className="truncate max-w-[220px] font-medium text-zinc-700">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removePropertyImage(idx)}
                              className="text-red-500 hover:text-red-700 text-xs font-bold cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Agreement Checkbox */}
                <div className="mt-6 flex items-start gap-2.5">
                  <input
                    required
                    type="checkbox"
                    id="site-terms"
                    className="mt-0.5 rounded border-zinc-300 text-[#1258d4] focus:ring-[#1258d4] cursor-pointer"
                  />
                  <label htmlFor="site-terms" className="text-xs text-zinc-500 leading-relaxed cursor-pointer select-none">
                    I agree to the <Link href="/privacy-policy" className="text-[#1258d4] font-semibold underline hover:underline">Privacy Policy</Link> and consent to MTBOSS using my details to follow up on this request. <span className="text-red-500">*</span>
                  </label>
                </div>

                {submitError && (
                  <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                    ⚠️ {submitError}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-6 w-full py-3.5 sm:py-4 rounded-xl bg-[#1258d4] hover:bg-[#0e4bc0] text-white font-semibold text-sm transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {submitting ? "Submitting Request..." : "Schedule site consultation"}
                </button>

                {/* Trust Line */}
                {/* <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-zinc-400 font-medium">
                  <ShieldCheck size={14} className="text-zinc-400" />
                  <span>Confidential · RERA compliant · No spam</span>
                </div> */}
              </form>
            )}
          </div>
        </div>

        {/* ── Row 2: Signature Projects (Project Reference Section - Horizontally 3 or 4 in a row) ── */}
        <section className={`pt-10 border-t ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-[var(--brand-blue)] text-[10px] font-black uppercase tracking-[0.4em] mb-1">Project References</p>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">Signature Projects</h2>
              <p className={`text-xs mt-1 ${muted}`}>Explore our recent executed projects and commercial developments</p>
            </div>
            <Link
              href="/FeaturedProjects/ProjectGallery"
              className={`group self-start sm:self-end flex items-center gap-2 px-4 py-2 border font-black uppercase text-[9px] tracking-widest transition-all rounded ${
                isDark
                  ? "border-zinc-700 text-white hover:bg-[var(--brand-blue)] hover:text-black hover:border-[var(--brand-blue)]"
                  : "border-zinc-300 text-zinc-800 hover:bg-zinc-900 hover:text-white hover:border-zinc-900"
              }`}
            >
              View All Portfolio
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>

          {/* Horizontally: 3 or 4 in a row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {projectsList.map((p, i) => (
              <PortfolioProjectCard
                key={p.id || i}
                project={p}
                index={i}
                isDark={isDark}
                isVisible={true}
              />
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
