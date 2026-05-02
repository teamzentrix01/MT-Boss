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

const industrialProperties = [
  {
    id: "i1",
    title: "Large Warehouse Complex",
    type: "Warehouse",
    transaction: "Sale",
    location: "Noida Phase 2",
    price: "3,50,00,000",
    priceRaw: 35000000,
    area: 15000,
    clearHeight: "12 Meters",
    power: "200 KW",
    loading: "4 Docks",
    tag: "Featured",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
    features: ["24/7 Security", "Fire Suppression", "CCTV", "Truck Entry", "Office Space", "Solar Ready"],
  },
  {
    id: "i2",
    title: "Manufacturing Plant Unit",
    type: "Factory",
    transaction: "Sale",
    location: "Greater Noida Industrial Area",
    price: "8,00,00,000",
    priceRaw: 80000000,
    area: 30000,
    clearHeight: "15 Meters",
    power: "500 KW",
    loading: "8 Docks",
    tag: "Premium",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
    features: ["Heavy Power Load", "Effluent Treatment", "Worker Quarters", "Admin Block", "Weighbridge", "Railway Siding"],
  },
  {
    id: "i3",
    title: "Industrial Plot",
    type: "Plot",
    transaction: "Sale",
    location: "Ghaziabad Industrial Corridor",
    price: "1,80,00,000",
    priceRaw: 18000000,
    area: 8000,
    clearHeight: "N/A",
    power: "100 KW Available",
    loading: "Corner Plot",
    tag: "New",
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7edd?w=800&q=80",
    features: ["UPSIDC Approved", "Road Frontage", "Water Supply", "Power Available", "Clear Title", "Ready Registry"],
  },
  {
    id: "i4",
    title: "Cold Storage Facility",
    type: "Cold Storage",
    transaction: "Lease",
    location: "Delhi Kundli Highway",
    price: "2,50,000",
    priceRaw: 250000,
    area: 10000,
    clearHeight: "10 Meters",
    power: "300 KW",
    loading: "6 Docks",
    tag: "New",
    image: "https://images.unsplash.com/photo-1565891741441-64926e441838?w=800&q=80",
    features: ["Multi Temperature Zones", "Ammonia Plant", "Ripening Chambers", "24/7 Power", "Insurance Ready", "FSSAI Compliant"],
  },
  {
    id: "i5",
    title: "Logistics Hub",
    type: "Logistics",
    transaction: "Lease",
    location: "Gurgaon NH-48",
    price: "4,00,000",
    priceRaw: 400000,
    area: 20000,
    clearHeight: "14 Meters",
    power: "400 KW",
    loading: "12 Docks",
    tag: "Featured",
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80",
    features: ["Grade A Facility", "EV Charging", "Mezzanine Floor", "Sprinkler System", "GPS Tracking Ready", "Cross Dock"],
  },
  {
    id: "i6",
    title: "Small Industrial Unit",
    type: "Factory",
    transaction: "Sale",
    location: "Faridabad Sector 58",
    price: "95,00,000",
    priceRaw: 9500000,
    area: 4500,
    clearHeight: "8 Meters",
    power: "75 KW",
    loading: "2 Docks",
    tag: "New",
    image: "https://images.unsplash.com/photo-1495592822108-9e6261896da8?w=800&q=80",
    features: ["Ground Floor", "Office Attached", "Borewell", "Security Cabin", "Clear Title", "Loan Available"],
  },
];

const tagColors = {
  Featured: "bg-[#facc15] text-black",
  Premium: "bg-purple-500 text-white",
  New: "bg-green-500 text-white",
};

const typeColors = {
  "Warehouse": { dark: "bg-blue-500/10 text-blue-400 border-blue-500/20", light: "bg-blue-50 text-blue-600 border-blue-100" },
  "Factory": { dark: "bg-orange-500/10 text-orange-400 border-orange-500/20", light: "bg-orange-50 text-orange-600 border-orange-100" },
  "Plot": { dark: "bg-green-500/10 text-green-400 border-green-500/20", light: "bg-green-50 text-green-600 border-green-100" },
  "Cold Storage": { dark: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20", light: "bg-cyan-50 text-cyan-600 border-cyan-100" },
  "Logistics": { dark: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", light: "bg-yellow-50 text-yellow-600 border-yellow-100" },
};

export default function IndustrialPage() {
  const dark = useDarkMode();
  const [filters, setFilters] = useState({ type: "All", transaction: "All", location: "", minArea: "", maxPrice: "" });
  const [enquiryModal, setEnquiryModal] = useState(null);
  const [enquiryForm, setEnquiryForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [enquiryDone, setEnquiryDone] = useState(false);
  const [heroRef, heroVisible] = useInView(0.1);

  const types = ["All", "Warehouse", "Factory", "Plot", "Cold Storage", "Logistics"];

  const filtered = industrialProperties.filter((p) => {
    const matchType = filters.type === "All" || p.type === filters.type;
    const matchTx = filters.transaction === "All" || p.transaction === filters.transaction;
    const matchLoc = filters.location === "" || p.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchArea = filters.minArea === "" || p.area >= Number(filters.minArea);
    const matchPrice = filters.maxPrice === "" || p.priceRaw <= Number(filters.maxPrice);
    return matchType && matchTx && matchLoc && matchArea && matchPrice;
  });

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setEnquiryLoading(true);
    try {
      const res = await fetch("https://formsubmit.co/ajax/YOUR_EMAIL@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          "Full Name": enquiryForm.name,
          "Phone": enquiryForm.phone,
          "Email": enquiryForm.email,
          "Message": enquiryForm.message || "Interested in this property",
          "Property": enquiryModal?.title,
          "Type": enquiryModal?.type,
          "Transaction": enquiryModal?.transaction,
          "Location": enquiryModal?.location,
          "Price": `₹ ${enquiryModal?.price}`,
          "_subject": `Industrial Property Enquiry - ${enquiryModal?.title} - ${enquiryForm.name}`,
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
        style={{ backgroundImage: "url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80)", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-black/80" />
        <div ref={heroRef} className="relative z-10 max-w-3xl mx-auto"
          style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
          <span className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] block mb-4">MTBOSS Construction</span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase text-white mb-4 tracking-tighter">
            Industrial
            <span className="block text-[#facc15]">Properties</span>
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
            Warehouses, factories, logistics hubs, cold storages and industrial plots — buy, sell or lease across Delhi NCR's major industrial corridors.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {[
              { value: `${industrialProperties.length}+`, label: "Listings" },
              { value: "5", label: "Property Types" },
              { value: "Sale & Lease", label: "Options" },
              { value: "Verified", label: "Properties" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-[#facc15] text-2xl font-black">{s.value}</p>
                <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">{s.label}</p>
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
            <h2 className={`text-xs font-black uppercase tracking-widest ${dark ? "text-[#facc15]" : "text-zinc-800"}`}>Filter Properties</h2>
            <button onClick={() => setFilters({ type: "All", transaction: "All", location: "", minArea: "", maxPrice: "" })}
              className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 border rounded-sm transition-all ${dark ? "border-zinc-700 text-zinc-500 hover:border-[#facc15] hover:text-[#facc15]" : "border-gray-200 text-zinc-400 hover:border-zinc-800 hover:text-zinc-800"}`}>
              Reset
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Type</p>
              <div className="flex flex-wrap gap-1.5">
                {types.map((t) => <button key={t} onClick={() => setFilters({ ...filters, type: t })} className={filterBtn(filters.type === t)}>{t}</button>)}
              </div>
            </div>
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Transaction</p>
              <div className="flex gap-1.5">
                {["All", "Sale", "Lease"].map((t) => <button key={t} onClick={() => setFilters({ ...filters, transaction: t })} className={filterBtn(filters.transaction === t)}>{t}</button>)}
              </div>
            </div>
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Location</p>
              <input type="text" placeholder="e.g. Noida, Gurgaon..." value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} className={inputClass} />
            </div>
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Min Area (sqft)</p>
              <input type="number" placeholder="e.g. 5000" value={filters.minArea} onChange={(e) => setFilters({ ...filters, minArea: e.target.value })} className={inputClass} />
            </div>
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Max Price (₹)</p>
              <input type="number" placeholder="e.g. 10000000" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} className={inputClass} />
            </div>
          </div>
        </div>

        {/* COUNT */}
        <p className={`text-xs font-black uppercase tracking-widest mb-6 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
          Showing <span className={dark ? "text-[#facc15]" : "text-zinc-800"}>{filtered.length}</span> Industrial Properties
        </p>

        {/* GRID */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className={`text-xs font-black uppercase tracking-widest ${dark ? "text-zinc-600" : "text-gray-300"}`}>No Properties Found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <div key={p.id} className={`group rounded-sm overflow-hidden border transition-all duration-300 hover:shadow-xl ${dark ? "bg-zinc-900 border-zinc-800 hover:border-[#facc15]" : "bg-white border-gray-100 hover:border-zinc-300 shadow-sm"}`}>

                {/* Image */}
                <div className="relative overflow-hidden h-52">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {p.tag && (
                    <span className={`absolute top-3 left-3 px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm ${tagColors[p.tag]}`}>{p.tag}</span>
                  )}
                  <span className={`absolute top-3 right-3 px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm ${p.transaction === "Sale" ? "bg-blue-500 text-white" : "bg-purple-500 text-white"}`}>
                    {p.transaction}
                  </span>
                  <span className={`absolute bottom-3 left-3 px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm border ${dark ? (typeColors[p.type]?.dark || "bg-zinc-800 text-zinc-400 border-zinc-700") : (typeColors[p.type]?.light || "bg-gray-50 text-zinc-500 border-gray-200")}`}>
                    {p.type}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <p className="text-[#facc15] text-xl font-black mb-0.5">₹ {p.price}</p>
                  <p className={`text-[10px] font-bold mb-2 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
                    {p.transaction === "Lease" ? "Per Month" : "Sale Price"}
                  </p>
                  <h3 className={`text-sm font-black uppercase tracking-widest mb-2 line-clamp-1 ${dark ? "text-white" : "text-zinc-800"}`}>{p.title}</h3>
                  <div className="flex items-center gap-1 mb-4">
                    <svg className="w-3 h-3 text-[#facc15] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className={`text-[11px] font-bold truncate ${dark ? "text-zinc-400" : "text-zinc-500"}`}>{p.location}</span>
                  </div>

                  <div className={`grid grid-cols-2 gap-3 py-3 border-y mb-4 ${dark ? "border-zinc-800" : "border-gray-100"}`}>
                    {[
                      { label: "Area", value: `${p.area.toLocaleString()} sqft` },
                      { label: "Clear Ht.", value: p.clearHeight },
                      { label: "Power", value: p.power },
                      { label: "Loading", value: p.loading },
                    ].map((item) => (
                      <div key={item.label}>
                        <p className={`text-[9px] font-black uppercase tracking-widest ${dark ? "text-zinc-600" : "text-zinc-400"}`}>{item.label}</p>
                        <p className={`text-[11px] font-black ${dark ? "text-zinc-300" : "text-zinc-700"}`}>{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {p.features.slice(0, 4).map((f) => (
                      <span key={f} className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-sm ${dark ? "bg-zinc-800 text-zinc-400" : "bg-gray-50 text-zinc-500"}`}>{f}</span>
                    ))}
                    {p.features.length > 4 && (
                      <span className={`px-2 py-0.5 text-[9px] font-black rounded-sm ${dark ? "bg-zinc-800 text-zinc-500" : "bg-gray-50 text-zinc-400"}`}>+{p.features.length - 4}</span>
                    )}
                  </div>

                  <button
                    onClick={() => { setEnquiryModal(p); setEnquiryDone(false); setEnquiryForm({ name: "", phone: "", email: "", message: "" }); }}
                    className={`w-full py-2.5 text-[10px] font-black uppercase tracking-widest border-2 rounded-sm transition-all duration-300 ${dark ? "border-[#facc15] text-[#facc15] hover:bg-[#facc15] hover:text-black" : "border-zinc-800 text-zinc-800 hover:bg-zinc-800 hover:text-white"}`}
                  >
                    Enquire Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className={`mt-16 p-8 rounded-sm border flex flex-col md:flex-row items-center justify-between gap-6 ${dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100 shadow-sm"}`}>
          <div>
            <span className="text-[#facc15] text-[10px] font-black uppercase tracking-widest block mb-1">Have an Industrial Property?</span>
            <h3 className={`text-xl font-black uppercase tracking-tight mb-2 ${dark ? "text-white" : "text-zinc-800"}`}>List Your Industrial Property</h3>
            <p className={`text-xs max-w-lg ${dark ? "text-zinc-400" : "text-zinc-500"}`}>Connect with serious buyers and tenants. Zero commission, fast listing.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={() => { setEnquiryModal({ title: "List Industrial Property", type: "Listing Request", transaction: "", location: "", price: "" }); setEnquiryDone(false); setEnquiryForm({ name: "", phone: "", email: "", message: "" }); }}
              className="px-8 py-3 bg-[#facc15] text-black text-[10px] font-black uppercase tracking-widest hover:bg-yellow-400 transition-all rounded-sm"
            >
              List Property
            </button>
            <Link href="/contact" className={`px-8 py-3 border-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-sm ${dark ? "border-zinc-700 text-zinc-300 hover:border-[#facc15] hover:text-[#facc15]" : "border-gray-200 text-zinc-600 hover:border-zinc-800 hover:text-zinc-800"}`}>
              Contact Us
            </Link>
          </div>
        </div>
      </div>

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
                  <h3 className={`text-sm font-black uppercase mb-2 ${dark ? "text-white" : "text-zinc-800"}`}>Enquiry Sent!</h3>
                  <p className="text-[#facc15] font-black text-xs mb-4">{enquiryModal.title}</p>
                  <button onClick={() => setEnquiryModal(null)} className="px-6 py-2.5 bg-[#facc15] text-black text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-yellow-400 transition-all">Close</button>
                </div>
              ) : (
                <>
                  <div className="mb-5">
                    <span className="text-[#facc15] text-[10px] font-black uppercase tracking-widest block mb-1">Send Enquiry</span>
                    <h3 className={`text-base font-black uppercase tracking-tight ${dark ? "text-white" : "text-zinc-800"}`}>{enquiryModal.title}</h3>
                    {enquiryModal.price && <p className={`text-xs mt-1 ${dark ? "text-zinc-400" : "text-zinc-500"}`}>₹ {enquiryModal.price} • {enquiryModal.location}</p>}
                  </div>
                  <form onSubmit={handleEnquirySubmit} className="space-y-3">
                    <input type="text" name="name" required placeholder="Full name *" value={enquiryForm.name} onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })} className={modalInput} />
                    <input type="tel" name="phone" required placeholder="Phone number *" value={enquiryForm.phone} onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })} className={modalInput} />
                    <input type="email" name="email" placeholder="Email address" value={enquiryForm.email} onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })} className={modalInput} />
                    <textarea name="message" rows={3} placeholder="Message or requirements..." value={enquiryForm.message} onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })} className={`${modalInput} resize-none`} />
                    <button type="submit" disabled={enquiryLoading} className="w-full py-3 bg-[#facc15] text-black text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-yellow-400 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                      {enquiryLoading ? <><svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Sending...</> : "Send Enquiry"}
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