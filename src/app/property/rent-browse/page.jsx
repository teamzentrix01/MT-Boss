"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FilterBar from "../../components/buy-sale/FilterBar";

export default function RentBrowsePage() {
  const [dark, setDark] = useState(true);
  const [allProps, setAllProps] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const html = document.documentElement;
    const obs = new MutationObserver(() => setDark(html.classList.contains("dark-mode")));
    obs.observe(html, { attributes: true, attributeFilter: ["class"] });
    setDark(html.classList.contains("dark-mode"));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/properties?listing_type=rent");
        const data = await res.json();
        if (data.success) {
          setAllProps(data.data);
          setFiltered(data.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleFilter = (filters) => {
    let result = [...allProps];
    if (filters.type !== "All") {
      result = result.filter(p => p.type === filters.type);
    }
    if (filters.location) {
      result = result.filter(p => p.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters.minPrice !== "") {
      result = result.filter(p => p.price_raw >= Number(filters.minPrice));
    }
    if (filters.maxPrice !== "") {
      result = result.filter(p => p.price_raw <= Number(filters.maxPrice));
    }
    if (filters.beds !== "Any") {
      if (filters.beds === "5+") {
        result = result.filter(p => p.beds >= 5);
      } else {
        result = result.filter(p => p.beds === Number(filters.beds));
      }
    }
    setFiltered(result);
  };

  const goToDetail = (propertyId) => {
    router.push(`/property/details/${propertyId}`);
  };

  return (
    <main className={`min-h-screen ${dark ? "bg-black" : "bg-gray-50"}`}>

      {/* Hero */}
      <div className={`relative py-20 px-4 text-center ${dark ? "bg-zinc-900" : "bg-zinc-800"}`}>
        <span className="text-[var(--brand-blue)] text-[10px] font-black uppercase tracking-widest">MTBOSS Property</span>
        <h1 className="text-white text-3xl md:text-5xl font-black uppercase tracking-widest mt-2 mb-4">
          Rent<span className="block text-[var(--brand-blue)]">Properties</span>
        </h1>
        <p className="text-zinc-400 text-xs max-w-xl mx-auto font-bold tracking-wide">
          Verified rental listings across Delhi NCR — find your perfect rental home
        </p>
        <div className="flex items-center justify-center gap-8 mt-8">
          {[["Listings", `${allProps.length}+`], ["Locations", "8+"], ["Verified Only", "✓"]].map(([label, val]) => (
            <div key={label} className="text-center">
              <p className="text-[var(--brand-blue)] text-xl font-black">{val}</p>
              <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <FilterBar isDarkMode={dark} onFilter={handleFilter} />

        <div className="flex items-center justify-between mb-6">
          <p className={`text-xs font-black uppercase tracking-widest ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
            Showing <span className={dark ? "text-[var(--brand-blue)]" : "text-zinc-800"}>{filtered.length}</span> Rental Properties
          </p>
          <a href="/property/rent" className="px-4 py-2 bg-[var(--brand-blue)] text-black text-[10px] font-black uppercase tracking-widest hover:bg-[var(--brand-blue-dark)] transition-all">
            + List Your Property
          </a>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <p className={`text-xs font-black uppercase tracking-widest animate-pulse ${dark ? "text-zinc-600" : "text-zinc-400"}`}>Loading properties...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={`text-center py-12 ${dark ? "bg-zinc-900" : "bg-white"} rounded-lg`}>
            <p className={`text-sm font-bold ${dark ? "text-zinc-400" : "text-zinc-500"}`}>No rental properties found matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((property) => (
              <div
                key={property.id}
                className={`rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer ${dark ? "bg-zinc-900 border border-zinc-800" : "bg-white border border-gray-100"}`}
                onClick={() => goToDetail(property.id)}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={
                      property.images && property.images.length > 0
                        ? property.images[0]
                        : "/placeholder.jpg"
                    }
                    alt={property.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform"
                    onError={(e) => {
                      e.target.src = "/placeholder.jpg";
                    }}
                  />
                  {/* Tags */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between">
                    {property.tag && (
                      <span className="px-3 py-1 bg-blue-500 text-white text-[9px] font-black uppercase rounded-sm">
                        {property.tag}
                      </span>
                    )}
                    <span className={`px-3 py-1 text-[9px] font-black uppercase rounded-sm ${dark ? "bg-black/60 text-[var(--brand-blue)]" : "bg-white/90 text-zinc-800"}`}>
                      {property.type}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Price - Monthly Rent */}
                  <p className="text-[var(--brand-blue)] text-lg font-black mb-2">₹{property.price}/mo</p>

                  {/* Title */}
                  <h3 className={`font-black text-sm uppercase tracking-tight mb-2 line-clamp-2 ${dark ? "text-white" : "text-zinc-800"}`}>
                    {property.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-3 h-3 text-[var(--brand-blue)]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className={`text-[10px] font-bold ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
                      {property.location}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className={`grid grid-cols-3 gap-2 py-3 border-t border-b ${dark ? "border-zinc-800" : "border-gray-100"}`}>
                    {property.beds && (
                      <div className="text-center">
                        <p className={`text-sm font-black ${dark ? "text-white" : "text-zinc-800"}`}>{property.beds}</p>
                        <p className={`text-[8px] font-black uppercase ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Beds</p>
                      </div>
                    )}
                    {property.baths && (
                      <div className="text-center">
                        <p className={`text-sm font-black ${dark ? "text-white" : "text-zinc-800"}`}>{property.baths}</p>
                        <p className={`text-[8px] font-black uppercase ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Baths</p>
                      </div>
                    )}
                    {property.area && (
                      <div className="text-center">
                        <p className={`text-sm font-black ${dark ? "text-white" : "text-zinc-800"}`}>{property.area}</p>
                        <p className={`text-[8px] font-black uppercase ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Sqft</p>
                      </div>
                    )}
                  </div>

                  {/* View Button */}
                  <button className="w-full mt-3 py-2 bg-[var(--brand-blue)] text-black text-[10px] font-black uppercase tracking-widest hover:bg-[var(--brand-blue-dark)] transition-all rounded-sm">
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}