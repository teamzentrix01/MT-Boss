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

const buildings = [
  {
    id: "b1",
    title: "Government Office Complex",
    type: "Government",
    transaction: "Tender",
    location: "New Delhi Lutyen's Zone",
    value: "45,00,00,000",
    valueRaw: 450000000,
    area: 80000,
    floors: 12,
    status: "Upcoming Tender",
    tag: "Government",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    description: "Multi-floor government office complex with ministerial suites, conference halls, and public service counters.",
    features: ["GRIHA Certified", "Earthquake Resistant", "Accessibility Compliant", "Solar Panels", "Rainwater Harvesting", "Smart Building"],
  },
  {
    id: "b2",
    title: "Corporate Headquarters Tower",
    type: "Private",
    transaction: "Sale",
    location: "Gurgaon Cyber City",
    value: "1,20,00,00,000",
    valueRaw: 1200000000,
    area: 1500000,
    floors: 35,
    status: "Ready to Move",
    tag: "Premium",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    description: "Class A corporate tower with LEED Platinum certification, rooftop helipad, and full smart building automation.",
    features: ["LEED Platinum", "Helipad", "Smart Automation", "Grade A Lobby", "Multi-level Parking", "Data Center Ready"],
  },
  {
    id: "b3",
    title: "Public Hospital Building",
    type: "Government",
    transaction: "Tender",
    location: "Noida Sector 39",
    value: "28,00,00,000",
    valueRaw: 280000000,
    area: 120000,
    floors: 8,
    status: "Tender Open",
    tag: "Government",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
    description: "200-bed public hospital with emergency block, OPD, ICU, operation theatres and residential quarters for medical staff.",
    features: ["Medical Gas Lines", "HVAC Isolation", "Emergency Power", "Modular OT", "Staff Quarters", "Helipad"],
  },
  {
    id: "b4",
    title: "IT Park Private Tower",
    type: "Private",
    transaction: "Lease",
    location: "Delhi Aerocity",
    value: "12,00,000",
    valueRaw: 1200000,
    area: 200000,
    floors: 18,
    status: "Available",
    tag: "New",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    description: "Grade A IT park tower in Aerocity with dedicated fiber connectivity, massive floor plates ideal for large tech teams.",
    features: ["Fiber Ready", "Large Floor Plates", "Food Court", "Gym", "24/7 AC", "Car Parking"],
  },
  {
    id: "b5",
    title: "Municipal Corporation Building",
    type: "Government",
    transaction: "Tender",
    location: "Ghaziabad Municipal Area",
    value: "18,00,00,000",
    valueRaw: 180000000,
    area: 45000,
    floors: 6,
    status: "Tender Open",
    tag: "Government",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
    description: "New municipal corporation headquarter building with public service halls, record rooms, and parking facility.",
    features: ["Public Service Halls", "Record Management", "Citizen Kiosks", "CCTV", "Solar Power", "Disabled Access"],
  },
  {
    id: "b6",
    title: "Private University Campus",
    type: "Private",
    transaction: "Sale",
    location: "Greater Noida Knowledge Park",
    value: "2,50,00,00,000",
    valueRaw: 2500000000,
    area: 5000000,
    floors: 4,
    status: "Under Construction",
    tag: "Premium",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    description: "Large private university campus with academic blocks, hostel facilities, sports complex, auditorium, and research labs.",
    features: ["Academic Blocks", "Hostel Facility", "Sports Complex", "Auditorium", "Research Labs", "Smart Campus"],
  },
  {
    id: "b7",
    title: "Police Headquarters",
    type: "Government",
    transaction: "Tender",
    location: "Delhi Police Lines",
    value: "35,00,00,000",
    valueRaw: 350000000,
    area: 95000,
    floors: 9,
    status: "Upcoming Tender",
    tag: "Government",
    image: "https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=800&q=80",
    description: "Modern police headquarters with command control center, armory, barracks, training hall, and vehicle yard.",
    features: ["Command Control", "Armory Block", "Training Hall", "Barracks", "Vehicle Yard", "High Security"],
  },
  {
    id: "b8",
    title: "Luxury Private Office Tower",
    type: "Private",
    transaction: "Sale",
    location: "Delhi Connaught Place",
    value: "85,00,00,000",
    valueRaw: 850000000,
    area: 300000,
    floors: 22,
    status: "Ready to Move",
    tag: "Premium",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
    description: "Premium office tower at the most prime address in Delhi with sky lobby, panoramic views, and concierge services.",
    features: ["Sky Lobby", "Concierge", "Panoramic Views", "Valet Parking", "Fine Dining", "LEED Gold"],
  },
];

const tagColors = {
  Government: "bg-blue-600 text-white",
  Premium: "bg-purple-500 text-white",
  New: "bg-green-500 text-white",
  Featured: "bg-[#facc15] text-black",
};

const statusColors = {
  "Tender Open": { dark: "bg-green-500/10 text-green-400 border-green-500/20", light: "bg-green-50 text-green-600 border-green-100" },
  "Upcoming Tender": { dark: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", light: "bg-yellow-50 text-yellow-600 border-yellow-100" },
  "Ready to Move": { dark: "bg-blue-500/10 text-blue-400 border-blue-500/20", light: "bg-blue-50 text-blue-600 border-blue-100" },
  "Under Construction": { dark: "bg-orange-500/10 text-orange-400 border-orange-500/20", light: "bg-orange-50 text-orange-600 border-orange-100" },
  "Available": { dark: "bg-green-500/10 text-green-400 border-green-500/20", light: "bg-green-50 text-green-600 border-green-100" },
};

export default function BuildingsPage() {
  const dark = useDarkMode();
  const [filters, setFilters] = useState({ type: "All", transaction: "All", location: "", status: "All" });
  const [enquiryModal, setEnquiryModal] = useState(null);
  const [enquiryForm, setEnquiryForm] = useState({ name: "", phone: "", email: "", organization: "", message: "" });
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [enquiryDone, setEnquiryDone] = useState(false);
  const [heroRef, heroVisible] = useInView(0.1);
  const [statsRef, statsVisible] = useInView(0.1);

  const statuses = ["All", "Tender Open", "Upcoming Tender", "Ready to Move", "Under Construction", "Available"];

  const filtered = buildings.filter((b) => {
    const matchType = filters.type === "All" || b.type === filters.type;
    const matchTx = filters.transaction === "All" || b.transaction === filters.transaction;
    const matchLoc = filters.location === "" || b.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchStatus = filters.status === "All" || b.status === filters.status;
    return matchType && matchTx && matchLoc && matchStatus;
  });

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setEnquiryLoading(true);
    try {
      const res = await fetch("https://formsubmit.co/ajax/team.zentrix01@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          "Full Name": enquiryForm.name,
          "Phone": enquiryForm.phone,
          "Email": enquiryForm.email,
          "Organization": enquiryForm.organization || "Not Provided",
          "Message": enquiryForm.message || "Interested in this building",
          "Building": enquiryModal?.title,
          "Type": enquiryModal?.type,
          "Transaction": enquiryModal?.transaction,
          "Location": enquiryModal?.location,
          "Value": `₹ ${enquiryModal?.value}`,
          "Status": enquiryModal?.status,
          "_subject": `Building Enquiry - ${enquiryModal?.title} - ${enquiryForm.name}`,
          "_template": "table",
          "_captcha": "false",
        }),
      });
      const data = await res.json();
      if (data.success === "true" || data.success === true) setEnquiryDone(true);
    } catch (err) { console.error(err); }
    finally { setEnquiryLoading(false); }
  };

  const filterBtn = (active) => `px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border-2 rounded-sm transition-all ${
    active ? "bg-[#facc15] border-[#facc15] text-black"
    : dark ? "border-zinc-700 text-zinc-400 hover:border-[#facc15] hover:text-[#facc15]"
    : "border-gray-200 text-zinc-500 hover:border-zinc-800 hover:text-zinc-800"
  }`;

  const inputClass = `w-full px-4 py-3 text-xs font-bold border rounded-sm outline-none transition-all ${
    dark ? "bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#facc15]"
    : "bg-white border-gray-200 text-zinc-800 placeholder-zinc-400 focus:border-zinc-800"
  }`;

  const modalInput = `w-full px-4 py-3 text-xs font-bold border rounded-sm outline-none transition-all ${
    dark ? "bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#facc15]"
    : "bg-gray-50 border-gray-200 text-zinc-800 placeholder-zinc-400 focus:border-zinc-800"
  }`;

  return (
    <main className={`min-h-screen transition-colors duration-500 ${dark ? "bg-black" : "bg-gray-50"}`}>

      {/* HERO */}
      <section className="relative flex items-center justify-center text-center py-24 px-6"
        style={{ backgroundImage: "url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80)", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-black/80" />
        <div ref={heroRef} className="relative z-10 max-w-3xl mx-auto"
          style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
          <span className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] block mb-4">MTBOSS Construction</span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase text-white mb-4 tracking-tighter">
            Government &
            <span className="block text-[#facc15]">Private Buildings</span>
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
            Government tenders, private corporate towers, institutional buildings and large infrastructure projects — buy, lease or bid with MTBOSS.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {[
              { value: `${buildings.length}+`, label: "Listings" },
              { value: "Govt & Private", label: "Categories" },
              { value: "Tender Support", label: "Available" },
              { value: "₹1000Cr+", label: "Project Value" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-[#facc15] text-2xl font-black">{s.value}</p>
                <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES STRIP */}
      <section className="py-10 px-6 bg-[#facc15]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: "🏛️", label: "Government Buildings", count: buildings.filter(b => b.type === "Government").length },
              { icon: "🏢", label: "Private Towers", count: buildings.filter(b => b.type === "Private").length },
              { icon: "📋", label: "Open Tenders", count: buildings.filter(b => b.status === "Tender Open").length },
              { icon: "✅", label: "Ready Properties", count: buildings.filter(b => b.status === "Ready to Move").length },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center">
                <span className="text-3xl mb-1">{s.icon}</span>
                <p className="text-2xl font-black text-black">{s.count}+</p>
                <p className="text-black/60 text-[10px] uppercase tracking-widest font-bold">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* FILTERS */}
        <div className={`p-6 rounded-sm border mb-8 ${dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100 shadow-sm"}`}>
          <div className="flex items-center justify-between mb-5">
            <h2 className={`text-xs font-black uppercase tracking-widest ${dark ? "text-[#facc15]" : "text-zinc-800"}`}>Filter Buildings</h2>
            <button onClick={() => setFilters({ type: "All", transaction: "All", location: "", status: "All" })}
              className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 border rounded-sm transition-all ${dark ? "border-zinc-700 text-zinc-500 hover:border-[#facc15] hover:text-[#facc15]" : "border-gray-200 text-zinc-400 hover:border-zinc-800 hover:text-zinc-800"}`}>
              Reset
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Building Type</p>
              <div className="flex gap-1.5 flex-wrap">
                {["All", "Government", "Private"].map((t) => <button key={t} onClick={() => setFilters({ ...filters, type: t })} className={filterBtn(filters.type === t)}>{t}</button>)}
              </div>
            </div>
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Transaction</p>
              <div className="flex gap-1.5 flex-wrap">
                {["All", "Sale", "Lease", "Tender"].map((t) => <button key={t} onClick={() => setFilters({ ...filters, transaction: t })} className={filterBtn(filters.transaction === t)}>{t}</button>)}
              </div>
            </div>
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Status</p>
              <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className={inputClass}>
                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Location</p>
              <input type="text" placeholder="e.g. Delhi, Noida..." value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} className={inputClass} />
            </div>
          </div>
        </div>

        {/* COUNT */}
        <p className={`text-xs font-black uppercase tracking-widest mb-6 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
          Showing <span className={dark ? "text-[#facc15]" : "text-zinc-800"}>{filtered.length}</span> Buildings
        </p>

        {/* GRID */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className={`text-xs font-black uppercase tracking-widest ${dark ? "text-zinc-600" : "text-gray-300"}`}>No Buildings Found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map((b) => (
              <div key={b.id} className={`group rounded-sm overflow-hidden border transition-all duration-300 hover:shadow-xl flex flex-col md:flex-row ${dark ? "bg-zinc-900 border-zinc-800 hover:border-[#facc15]" : "bg-white border-gray-100 hover:border-zinc-300 shadow-sm"}`}>

                {/* Image */}
                <div className="relative overflow-hidden md:w-56 flex-shrink-0 h-52 md:h-auto">
                  <img src={b.image} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {b.tag && (
                    <span className={`absolute top-3 left-3 px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm ${tagColors[b.tag]}`}>{b.tag}</span>
                  )}
                  <span className={`absolute bottom-3 left-3 px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm border ${dark ? (statusColors[b.status]?.dark || "bg-zinc-800 text-zinc-400 border-zinc-700") : (statusColors[b.status]?.light || "bg-gray-50 text-zinc-500 border-gray-200")}`}>
                    {b.status}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className={`text-sm font-black uppercase tracking-widest leading-tight flex-1 ${dark ? "text-white" : "text-zinc-800"}`}>{b.title}</h3>
                    <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm flex-shrink-0 ${b.transaction === "Tender" ? "bg-blue-600 text-white" : b.transaction === "Sale" ? "bg-[#facc15] text-black" : "bg-purple-500 text-white"}`}>
                      {b.transaction}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    <svg className="w-3 h-3 text-[#facc15] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className={`text-[11px] font-bold truncate ${dark ? "text-zinc-400" : "text-zinc-500"}`}>{b.location}</span>
                  </div>

                  <p className={`text-[11px] leading-relaxed mb-3 line-clamp-2 flex-1 ${dark ? "text-zinc-400" : "text-zinc-500"}`}>{b.description}</p>

                  <div className={`grid grid-cols-3 gap-2 py-3 border-y mb-3 ${dark ? "border-zinc-800" : "border-gray-100"}`}>
                    {[
                      { label: "Area", value: `${(b.area / 1000).toFixed(0)}K sqft` },
                      { label: "Floors", value: `G+${b.floors - 1}` },
                      { label: "Value", value: `₹${b.value.split(",")[0]}Cr+` },
                    ].map((item) => (
                      <div key={item.label} className="text-center">
                        <p className={`text-[9px] font-black uppercase tracking-widest ${dark ? "text-zinc-600" : "text-zinc-400"}`}>{item.label}</p>
                        <p className={`text-[11px] font-black ${dark ? "text-zinc-300" : "text-zinc-700"}`}>{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {b.features.slice(0, 3).map((f) => (
                      <span key={f} className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-sm ${dark ? "bg-zinc-800 text-zinc-400" : "bg-gray-50 text-zinc-500"}`}>{f}</span>
                    ))}
                    {b.features.length > 3 && (
                      <span className={`px-2 py-0.5 text-[9px] font-black rounded-sm ${dark ? "bg-zinc-800 text-zinc-500" : "bg-gray-50 text-zinc-400"}`}>+{b.features.length - 3}</span>
                    )}
                  </div>

                  <button
                    onClick={() => { setEnquiryModal(b); setEnquiryDone(false); setEnquiryForm({ name: "", phone: "", email: "", organization: "", message: "" }); }}
                    className={`py-2.5 text-[10px] font-black uppercase tracking-widest border-2 rounded-sm transition-all duration-300 ${dark ? "border-[#facc15] text-[#facc15] hover:bg-[#facc15] hover:text-black" : "border-zinc-800 text-zinc-800 hover:bg-zinc-800 hover:text-white"}`}
                  >
                    {b.transaction === "Tender" ? "Express Interest" : "Enquire Now"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TENDER SUPPORT CTA */}
        <div className={`mt-16 p-8 rounded-sm border ${dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100 shadow-sm"}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-[#facc15] text-[10px] font-black uppercase tracking-widest block mb-2">Need Tender Support?</span>
              <h3 className={`text-xl font-black uppercase tracking-tight mb-3 ${dark ? "text-white" : "text-zinc-800"}`}>
                We Help You Win Government Tenders
              </h3>
              <p className={`text-xs leading-relaxed ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
                From bid preparation to project execution — MTBOSS provides end-to-end support for government construction tenders across India.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {["Bid Preparation", "Technical Evaluation", "Cost Estimation", "Project Execution"].map((item) => (
                  <span key={item} className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-sm border ${dark ? "border-zinc-700 text-zinc-400" : "border-gray-200 text-zinc-500"}`}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => { setEnquiryModal({ title: "Government Tender Support", type: "Government", transaction: "Tender", location: "", value: "" }); setEnquiryDone(false); setEnquiryForm({ name: "", phone: "", email: "", organization: "", message: "" }); }}
                className="px-8 py-3.5 bg-[#facc15] text-black text-[10px] font-black uppercase tracking-widest hover:bg-yellow-400 transition-all rounded-sm"
              >
                Get Tender Support
              </button>
              <Link href="/contact" className={`px-8 py-3.5 text-center border-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-sm ${dark ? "border-zinc-700 text-zinc-300 hover:border-[#facc15] hover:text-[#facc15]" : "border-gray-200 text-zinc-600 hover:border-zinc-800 hover:text-zinc-800"}`}>
                Talk to Our Team
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* WHY MTBOSS */}
      <section className={`py-20 px-6 transition-colors duration-500 ${dark ? "bg-zinc-900" : "bg-white"}`}>
        <div
          ref={statsRef}
          className="max-w-6xl mx-auto"
          style={{ opacity: statsVisible ? 1 : 0, transform: statsVisible ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}
        >
          <div className="text-center mb-14">
            <span className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] block mb-2">Our Track Record</span>
            <h2 className={`text-3xl sm:text-4xl font-black uppercase tracking-tight ${dark ? "text-white" : "text-zinc-800"}`}>
              Why Choose MTBOSS
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: "🏛️", title: "Government Experience", desc: "Successfully delivered 50+ government construction projects across ministries and PSUs." },
              { icon: "🏆", title: "Award Winning", desc: "Recognized by multiple government bodies for quality construction and timely delivery." },
              { icon: "📋", title: "Tender Expertise", desc: "20+ years of experience in government tender bidding, compliance, and execution." },
              { icon: "🔒", title: "Fully Compliant", desc: "ISO certified, CPWD empanelled, and compliant with all government construction norms." },
              { icon: "💰", title: "Best Value Bids", desc: "Our cost engineering ensures competitive bids without compromising quality." },
              { icon: "⚡", title: "On Time Delivery", desc: "99% on-time delivery track record across government and private mega projects." },
              { icon: "🌍", title: "Pan India Presence", desc: "Active in 20+ states with local teams that understand regional compliance." },
              { icon: "🤝", title: "Joint Ventures", desc: "Open to JV arrangements for large government and private infrastructure projects." },
            ].map((b, i) => (
              <div key={i} className={`group p-5 rounded-sm border transition-all duration-300 hover:border-[#facc15] ${dark ? "bg-zinc-800 border-zinc-700 hover:bg-zinc-700" : "bg-gray-50 border-gray-100 hover:bg-white hover:shadow-md"}`}>
                <span className="text-2xl block mb-3">{b.icon}</span>
                <h3 className={`text-xs font-black uppercase tracking-widest mb-1.5 group-hover:text-[#facc15] transition-colors ${dark ? "text-white" : "text-zinc-800"}`}>{b.title}</h3>
                <p className={`text-[11px] leading-relaxed ${dark ? "text-zinc-500" : "text-zinc-500"}`}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ENQUIRY MODAL */}
      {enquiryModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEnquiryModal(null)} />
          <div className={`relative w-full max-w-md rounded-sm border shadow-2xl ${dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"}`}>
            <button onClick={() => setEnquiryModal(null)} className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors ${dark ? "text-zinc-500 hover:text-white hover:bg-zinc-800" : "text-zinc-400 hover:text-zinc-800 hover:bg-gray-100"}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="p-6">
              {enquiryDone ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-[#facc15] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className={`text-sm font-black uppercase mb-2 ${dark ? "text-white" : "text-zinc-800"}`}>
                    {enquiryModal.transaction === "Tender" ? "Interest Registered!" : "Enquiry Sent!"}
                  </h3>
                  <p className="text-[#facc15] font-black text-xs mb-4">{enquiryModal.title}</p>
                  <p className={`text-[11px] mb-5 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Our team will contact you within 24 business hours.</p>
                  <button onClick={() => setEnquiryModal(null)} className="px-6 py-2.5 bg-[#facc15] text-black text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-yellow-400 transition-all">Close</button>
                </div>
              ) : (
                <>
                  <div className="mb-5">
                    <span className="text-[#facc15] text-[10px] font-black uppercase tracking-widest block mb-1">
                      {enquiryModal.transaction === "Tender" ? "Express Interest" : "Send Enquiry"}
                    </span>
                    <h3 className={`text-base font-black uppercase tracking-tight ${dark ? "text-white" : "text-zinc-800"}`}>{enquiryModal.title}</h3>
                    {enquiryModal.value && <p className={`text-xs mt-1 ${dark ? "text-zinc-400" : "text-zinc-500"}`}>₹ {enquiryModal.value} • {enquiryModal.location}</p>}
                  </div>
                  <form onSubmit={handleEnquirySubmit} className="space-y-3">
                    <input type="text" name="name" required placeholder="Full name *" value={enquiryForm.name} onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })} className={modalInput} />
                    <input type="tel" name="phone" required placeholder="Phone number *" value={enquiryForm.phone} onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })} className={modalInput} />
                    <input type="email" name="email" placeholder="Email address" value={enquiryForm.email} onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })} className={modalInput} />
                    <input type="text" name="organization" placeholder="Organization / Company name" value={enquiryForm.organization} onChange={(e) => setEnquiryForm({ ...enquiryForm, organization: e.target.value })} className={modalInput} />
                    <textarea name="message" rows={3} placeholder="Message or specific requirements..." value={enquiryForm.message} onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })} className={`${modalInput} resize-none`} />
                    <button type="submit" disabled={enquiryLoading} className="w-full py-3 bg-[#facc15] text-black text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-yellow-400 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                      {enquiryLoading ? (
                        <><svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Sending...</>
                      ) : enquiryModal.transaction === "Tender" ? "Register Interest" : "Send Enquiry"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </main>
  );
}