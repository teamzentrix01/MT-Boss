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

const rentalProperties = [
  {
    id: "r1",
    title: "Furnished 2BHK Apartment",
    type: "Residential",
    location: "Noida Sector 62",
    rent: "25,000",
    rentRaw: 25000,
    deposit: "1,00,000",
    beds: 2,
    baths: 2,
    area: 1050,
    furnishing: "Fully Furnished",
    available: "Immediate",
    tag: "Featured",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    amenities: ["AC", "WiFi", "Parking", "Security", "Lift", "Power Backup"],
  },
  {
    id: "r2",
    title: "Commercial Office Space",
    type: "Commercial",
    location: "Gurgaon Cyber City",
    rent: "85,000",
    rentRaw: 85000,
    deposit: "3,00,000",
    beds: null,
    baths: 3,
    area: 2200,
    furnishing: "Semi Furnished",
    available: "15 Days",
    tag: "New",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    amenities: ["AC", "WiFi", "Parking", "Reception", "Conference Room", "Generator"],
  },
  {
    id: "r3",
    title: "Spacious 3BHK Villa",
    type: "Residential",
    location: "Delhi Greater Kailash",
    rent: "65,000",
    rentRaw: 65000,
    deposit: "2,00,000",
    beds: 3,
    baths: 3,
    area: 2800,
    furnishing: "Fully Furnished",
    available: "Immediate",
    tag: "Featured",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    amenities: ["AC", "Garden", "Parking", "Security", "Servant Room", "Modular Kitchen"],
  },
  {
    id: "r4",
    title: "Studio Apartment",
    type: "Residential",
    location: "Noida Sector 18",
    rent: "12,000",
    rentRaw: 12000,
    deposit: "36,000",
    beds: 1,
    baths: 1,
    area: 450,
    furnishing: "Semi Furnished",
    available: "Immediate",
    tag: "New",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    amenities: ["AC", "WiFi", "Security", "Lift", "Power Backup"],
  },
  {
    id: "r5",
    title: "Retail Shop Space",
    type: "Commercial",
    location: "Delhi Connaught Place",
    rent: "1,20,000",
    rentRaw: 120000,
    deposit: "5,00,000",
    beds: null,
    baths: 1,
    area: 800,
    furnishing: "Bare Shell",
    available: "30 Days",
    tag: "Premium",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    amenities: ["Main Road Facing", "High Footfall", "Parking", "Loading Area"],
  },
  {
    id: "r6",
    title: "4BHK Builder Floor",
    type: "Residential",
    location: "Faridabad Sector 15",
    rent: "35,000",
    rentRaw: 35000,
    deposit: "1,05,000",
    beds: 4,
    baths: 3,
    area: 2000,
    furnishing: "Unfurnished",
    available: "Immediate",
    tag: "New",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    amenities: ["Terrace", "Parking", "Security", "Water 24/7", "Near Metro"],
  },
];

const tagColors = {
  Featured: "bg-[#facc15] text-black",
  New: "bg-green-500 text-white",
  Premium: "bg-purple-500 text-white",
};

const furnishingColors = {
  "Fully Furnished": { dark: "bg-green-500/10 text-green-400 border-green-500/20", light: "bg-green-50 text-green-600 border-green-100" },
  "Semi Furnished": { dark: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", light: "bg-yellow-50 text-yellow-600 border-yellow-100" },
  "Unfurnished": { dark: "bg-zinc-700 text-zinc-400 border-zinc-600", light: "bg-gray-50 text-gray-500 border-gray-200" },
  "Bare Shell": { dark: "bg-zinc-700 text-zinc-400 border-zinc-600", light: "bg-gray-50 text-gray-500 border-gray-200" },
};

export default function RentingPage() {
  const dark = useDarkMode();
  const [filters, setFilters] = useState({
    type: "All",
    furnishing: "All",
    minRent: "",
    maxRent: "",
    location: "",
  });
  const [enquiryModal, setEnquiryModal] = useState(null);
  const [enquiryForm, setEnquiryForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [enquiryDone, setEnquiryDone] = useState(false);

  const [heroRef, heroVisible] = useInView(0.1);

  const filtered = rentalProperties.filter((p) => {
    const matchType = filters.type === "All" || p.type === filters.type;
    const matchFurnishing = filters.furnishing === "All" || p.furnishing === filters.furnishing;
    const matchMin = filters.minRent === "" || p.rentRaw >= Number(filters.minRent);
    const matchMax = filters.maxRent === "" || p.rentRaw <= Number(filters.maxRent);
    const matchLocation = filters.location === "" || p.location.toLowerCase().includes(filters.location.toLowerCase());
    return matchType && matchFurnishing && matchMin && matchMax && matchLocation;
  });

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleEnquiryChange = (e) => {
    setEnquiryForm({ ...enquiryForm, [e.target.name]: e.target.value });
  };

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
          "Message": enquiryForm.message || "Interested in this property",
          "Property": enquiryModal?.title,
          "Property Type": enquiryModal?.type,
          "Location": enquiryModal?.location,
          "Rent": `₹ ${enquiryModal?.rent}/month`,
          "_subject": `Rental Enquiry - ${enquiryModal?.title} - ${enquiryForm.name}`,
          "_template": "table",
          "_captcha": "false",
        }),
      });
      const data = await res.json();
      if (data.success === "true" || data.success === true) {
        setEnquiryDone(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEnquiryLoading(false);
    }
  };

  const inputClass = `w-full px-4 py-3 text-xs font-bold border rounded-sm outline-none transition-all duration-200 ${
    dark
      ? "bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#facc15]"
      : "bg-white border-gray-200 text-zinc-800 placeholder-zinc-400 focus:border-zinc-800"
  }`;

  const filterBtnClass = (active) =>
    `px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border-2 rounded-sm transition-all ${
      active
        ? "bg-[#facc15] border-[#facc15] text-black"
        : dark
        ? "border-zinc-700 text-zinc-400 hover:border-[#facc15] hover:text-[#facc15]"
        : "border-gray-200 text-zinc-500 hover:border-zinc-800 hover:text-zinc-800"
    }`;

  return (
    <main className={`min-h-screen transition-colors duration-500 ${dark ? "bg-black" : "bg-gray-50"}`}>

      {/* ── HERO ── */}
      <section
        className="relative flex items-center justify-center text-center py-24 px-6"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80)",
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
            Find Your
            <span className="block text-[#facc15]">Rental Property</span>
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
            Residential and commercial properties for rent across Delhi NCR. Verified listings, zero brokerage, and direct owner contact.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8">
            {[
              { value: `${rentalProperties.length}+`, label: "Active Listings" },
              { value: "Zero", label: "Brokerage" },
              { value: "24hrs", label: "Response Time" },
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

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── FILTER BAR ── */}
        <div className={`p-6 rounded-sm border mb-8 ${dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100 shadow-sm"}`}>
          <div className="flex items-center justify-between mb-5">
            <h2 className={`text-xs font-black uppercase tracking-widest ${dark ? "text-[#facc15]" : "text-zinc-800"}`}>
              Filter Rentals
            </h2>
            <button
              onClick={() => setFilters({ type: "All", furnishing: "All", minRent: "", maxRent: "", location: "" })}
              className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 border rounded-sm transition-all ${
                dark ? "border-zinc-700 text-zinc-500 hover:border-[#facc15] hover:text-[#facc15]" : "border-gray-200 text-zinc-400 hover:border-zinc-800 hover:text-zinc-800"
              }`}
            >
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">

            {/* Type */}
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Property Type</p>
              <div className="flex flex-wrap gap-1.5">
                {["All", "Residential", "Commercial"].map((t) => (
                  <button key={t} onClick={() => handleFilterChange("type", t)} className={filterBtnClass(filters.type === t)}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Furnishing */}
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Furnishing</p>
              <div className="flex flex-wrap gap-1.5">
                {["All", "Fully Furnished", "Semi Furnished", "Unfurnished"].map((f) => (
                  <button key={f} onClick={() => handleFilterChange("furnishing", f)} className={filterBtnClass(filters.furnishing === f)}>
                    {f === "Fully Furnished" ? "Full" : f === "Semi Furnished" ? "Semi" : f === "Unfurnished" ? "Unfurn." : f}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Location</p>
              <input
                type="text"
                placeholder="e.g. Noida, Delhi..."
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Min Rent */}
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Min Rent (₹)</p>
              <input
                type="number"
                placeholder="e.g. 10000"
                value={filters.minRent}
                onChange={(e) => handleFilterChange("minRent", e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Max Rent */}
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Max Rent (₹)</p>
              <input
                type="number"
                placeholder="e.g. 100000"
                value={filters.maxRent}
                onChange={(e) => handleFilterChange("maxRent", e.target.value)}
                className={inputClass}
              />
            </div>

          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className={`text-xs font-black uppercase tracking-widest ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
            Showing{" "}
            <span className={dark ? "text-[#facc15]" : "text-zinc-800"}>{filtered.length}</span>{" "}
            Rental Properties
          </p>
          <Link
            href="/buy-sale"
            className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 transition-colors ${dark ? "text-zinc-500 hover:text-[#facc15]" : "text-zinc-400 hover:text-zinc-800"}`}
          >
            View Properties for Sale →
          </Link>
        </div>

        {/* ── PROPERTY GRID ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className={`text-xs font-black uppercase tracking-widest mb-2 ${dark ? "text-zinc-600" : "text-gray-300"}`}>
              No Properties Found
            </p>
            <p className={`text-[11px] ${dark ? "text-zinc-700" : "text-gray-300"}`}>
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((property) => (
              <div
                key={property.id}
                className={`group rounded-sm overflow-hidden border transition-all duration-300 hover:shadow-xl ${
                  dark
                    ? "bg-zinc-900 border-zinc-800 hover:border-[#facc15]"
                    : "bg-white border-gray-100 hover:border-zinc-300 shadow-sm"
                }`}
              >
                {/* Image */}
                <div className="relative overflow-hidden h-52">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Tag */}
                  {property.tag && (
                    <span className={`absolute top-3 left-3 px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm ${tagColors[property.tag] || "bg-[#facc15] text-black"}`}>
                      {property.tag}
                    </span>
                  )}
                  {/* Availability */}
                  <span className={`absolute top-3 right-3 px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm ${
                    property.available === "Immediate"
                      ? "bg-green-500 text-white"
                      : "bg-zinc-800 text-zinc-300"
                  }`}>
                    {property.available === "Immediate" ? "Available Now" : `Available in ${property.available}`}
                  </span>
                  {/* Furnishing */}
                  <span className={`absolute bottom-3 left-3 px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm border ${
                    dark ? furnishingColors[property.furnishing].dark : furnishingColors[property.furnishing].light
                  }`}>
                    {property.furnishing}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Rent */}
                  <div className="flex items-baseline gap-1 mb-1">
                    <p className="text-[#facc15] text-xl font-black">₹ {property.rent}</p>
                    <p className={`text-[10px] font-bold ${dark ? "text-zinc-500" : "text-zinc-400"}`}>/month</p>
                  </div>

                  {/* Deposit */}
                  <p className={`text-[10px] font-bold mb-2 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
                    Deposit: ₹ {property.deposit}
                  </p>

                  {/* Title */}
                  <h3 className={`text-sm font-black uppercase tracking-widest mb-2 line-clamp-1 ${dark ? "text-white" : "text-zinc-800"}`}>
                    {property.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-1 mb-4">
                    <svg className="w-3 h-3 text-[#facc15] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className={`text-[11px] font-bold truncate ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
                      {property.location}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className={`border-t mb-4 ${dark ? "border-zinc-800" : "border-gray-100"}`} />

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4">
                    {property.beds && (
                      <div className="flex items-center gap-1">
                        <svg className={`w-3.5 h-3.5 ${dark ? "text-zinc-500" : "text-zinc-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className={`text-[10px] font-bold ${dark ? "text-zinc-400" : "text-zinc-500"}`}>{property.beds} Beds</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <svg className={`w-3.5 h-3.5 ${dark ? "text-zinc-500" : "text-zinc-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      <span className={`text-[10px] font-bold ${dark ? "text-zinc-400" : "text-zinc-500"}`}>{property.area} sqft</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className={`w-3.5 h-3.5 ${dark ? "text-zinc-500" : "text-zinc-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span className={`text-[10px] font-bold ${dark ? "text-zinc-400" : "text-zinc-500"}`}>{property.type}</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {property.amenities.slice(0, 4).map((a) => (
                      <span
                        key={a}
                        className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-sm ${
                          dark ? "bg-zinc-800 text-zinc-400" : "bg-gray-50 text-zinc-500"
                        }`}
                      >
                        {a}
                      </span>
                    ))}
                    {property.amenities.length > 4 && (
                      <span className={`px-2 py-0.5 text-[9px] font-black rounded-sm ${dark ? "bg-zinc-800 text-zinc-500" : "bg-gray-50 text-zinc-400"}`}>
                        +{property.amenities.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => { setEnquiryModal(property); setEnquiryDone(false); setEnquiryForm({ name: "", phone: "", email: "", message: "" }); }}
                    className={`w-full py-2.5 text-[10px] font-black uppercase tracking-widest border-2 rounded-sm transition-all duration-300 ${
                      dark
                        ? "border-[#facc15] text-[#facc15] hover:bg-[#facc15] hover:text-black"
                        : "border-zinc-800 text-zinc-800 hover:bg-zinc-800 hover:text-white"
                    }`}
                  >
                    Enquire Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── LIST YOUR PROPERTY CTA ── */}
        <div className={`mt-16 p-8 rounded-sm border ${dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100 shadow-sm"}`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-[#facc15] text-[10px] font-black uppercase tracking-widest block mb-1">
                Property Owner?
              </span>
              <h3 className={`text-xl font-black uppercase tracking-tight mb-2 ${dark ? "text-white" : "text-zinc-800"}`}>
                List Your Property for Rent
              </h3>
              <p className={`text-xs max-w-lg ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
                Reach thousands of verified tenants. Zero commission, direct contact, and fast listing — completely free.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={() => { setEnquiryModal({ title: "List My Property", type: "Listing Request", location: "", rent: "" }); setEnquiryDone(false); setEnquiryForm({ name: "", phone: "", email: "", message: "" }); }}
                className="px-8 py-3 bg-[#facc15] text-black text-[10px] font-black uppercase tracking-widest hover:bg-yellow-400 transition-all rounded-sm"
              >
                List for Free
              </button>
              <a
                href="/contact"
                className={`px-8 py-3 border-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-sm ${
                  dark ? "border-zinc-700 text-zinc-300 hover:border-[#facc15] hover:text-[#facc15]" : "border-gray-200 text-zinc-600 hover:border-zinc-800 hover:text-zinc-800"
                }`}
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* ── WHY RENT WITH US ── */}
      <section className={`py-20 px-6 transition-colors duration-500 ${dark ? "bg-zinc-900" : "bg-white"}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] block mb-2">Our Promise</span>
            <h2 className={`text-3xl sm:text-4xl font-black uppercase tracking-tight ${dark ? "text-white" : "text-zinc-800"}`}>
              Why Rent With MTBOSS
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: "🚫", title: "Zero Brokerage", desc: "No broker fees ever. Direct connection between tenant and owner." },
              { icon: "✅", title: "Verified Listings", desc: "All properties are physically verified by our team before listing." },
              { icon: "⚡", title: "Fast Response", desc: "Get owner contact details and schedule visits within 24 hours." },
              { icon: "📋", title: "Legal Support", desc: "Assistance with rental agreements, police verification, and documentation." },
              { icon: "🏠", title: "Wide Inventory", desc: "Studio apartments to luxury villas, shops to large office spaces." },
              { icon: "🔒", title: "Safe & Secure", desc: "Tenant and owner details are verified for a safe renting experience." },
              { icon: "💬", title: "Dedicated Support", desc: "A dedicated rental advisor to help you throughout the process." },
              { icon: "📍", title: "Pan NCR Coverage", desc: "Properties across Delhi, Noida, Gurgaon, Faridabad and Ghaziabad." },
            ].map((b, i) => (
              <div
                key={i}
                className={`group p-5 rounded-sm border transition-all duration-300 hover:border-[#facc15] ${
                  dark ? "bg-zinc-800 border-zinc-700 hover:bg-zinc-700" : "bg-gray-50 border-gray-100 hover:bg-white hover:shadow-md"
                }`}
              >
                <span className="text-2xl block mb-3">{b.icon}</span>
                <h3 className={`text-xs font-black uppercase tracking-widest mb-1.5 group-hover:text-[#facc15] transition-colors ${dark ? "text-white" : "text-zinc-800"}`}>
                  {b.title}
                </h3>
                <p className={`text-[11px] leading-relaxed ${dark ? "text-zinc-500" : "text-zinc-500"}`}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ENQUIRY MODAL ── */}
      {enquiryModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setEnquiryModal(null)}
          />

          {/* Modal */}
          <div className={`relative w-full max-w-md rounded-sm border shadow-2xl ${dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"}`}>

            {/* Close */}
            <button
              onClick={() => setEnquiryModal(null)}
              className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors ${dark ? "text-zinc-500 hover:text-white hover:bg-zinc-800" : "text-zinc-400 hover:text-zinc-800 hover:bg-gray-100"}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6">
              {enquiryDone ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-[#facc15] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className={`text-sm font-black uppercase tracking-widest mb-2 ${dark ? "text-white" : "text-zinc-800"}`}>
                    Enquiry Sent!
                  </h3>
                  <p className={`text-xs mb-1 ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
                    We will contact you shortly regarding
                  </p>
                  <p className="text-[#facc15] font-black text-xs">{enquiryModal.title}</p>
                  <button
                    onClick={() => setEnquiryModal(null)}
                    className="mt-5 px-6 py-2.5 bg-[#facc15] text-black text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-yellow-400 transition-all"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-5">
                    <span className="text-[#facc15] text-[10px] font-black uppercase tracking-widest block mb-1">
                      Send Enquiry
                    </span>
                    <h3 className={`text-base font-black uppercase tracking-tight ${dark ? "text-white" : "text-zinc-800"}`}>
                      {enquiryModal.title}
                    </h3>
                    {enquiryModal.rent && (
                      <p className={`text-xs mt-1 ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
                        ₹ {enquiryModal.rent}/month • {enquiryModal.location}
                      </p>
                    )}
                  </div>

                  <form onSubmit={handleEnquirySubmit} className="space-y-3">
                    <div>
                      <input type="text" name="name" required placeholder="Your full name *" value={enquiryForm.name} onChange={handleEnquiryChange}
                        className={`w-full px-4 py-3 text-xs font-bold border rounded-sm outline-none transition-all ${dark ? "bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#facc15]" : "bg-gray-50 border-gray-200 text-zinc-800 placeholder-zinc-400 focus:border-zinc-800"}`}
                      />
                    </div>
                    <div>
                      <input type="tel" name="phone" required placeholder="Phone number *" value={enquiryForm.phone} onChange={handleEnquiryChange}
                        className={`w-full px-4 py-3 text-xs font-bold border rounded-sm outline-none transition-all ${dark ? "bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#facc15]" : "bg-gray-50 border-gray-200 text-zinc-800 placeholder-zinc-400 focus:border-zinc-800"}`}
                      />
                    </div>
                    <div>
                      <input type="email" name="email" placeholder="Email address" value={enquiryForm.email} onChange={handleEnquiryChange}
                        className={`w-full px-4 py-3 text-xs font-bold border rounded-sm outline-none transition-all ${dark ? "bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#facc15]" : "bg-gray-50 border-gray-200 text-zinc-800 placeholder-zinc-400 focus:border-zinc-800"}`}
                      />
                    </div>
                    <div>
                      <textarea name="message" rows={3} placeholder="Any specific requirements or message..." value={enquiryForm.message} onChange={handleEnquiryChange}
                        className={`w-full px-4 py-3 text-xs font-bold border rounded-sm outline-none transition-all resize-none ${dark ? "bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#facc15]" : "bg-gray-50 border-gray-200 text-zinc-800 placeholder-zinc-400 focus:border-zinc-800"}`}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={enquiryLoading}
                      className="w-full py-3 bg-[#facc15] text-black text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-yellow-400 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {enquiryLoading ? (
                        <>
                          <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Sending...
                        </>
                      ) : "Send Enquiry"}
                    </button>
                    <p className={`text-[10px] text-center ${dark ? "text-zinc-600" : "text-zinc-400"}`}>
                      We will contact you within 24 hours
                    </p>
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