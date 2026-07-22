"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import FilterBar from "../../components/buy-sale/FilterBar";

export default function BrowsePropertiesPage() {
  const [dark, setDark] = useState(true);
  const [mode, setMode] = useState("buy"); // buy | rent | all
  const [allProps, setAllProps] = useState([]);
  const [filters, setFilters] = useState({ type: 'All', location: '', minPrice: '', maxPrice: '', beds: 'Any' });
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
      setLoading(true);
      try {
        // Fetch both buy and rent properties
        const [buyRes, rentRes] = await Promise.all([
          fetch("/api/properties?listing_type=buy", { cache: "no-store" }),
          fetch("/api/properties?listing_type=rent", { cache: "no-store" }),
        ]);
        const [buyData, rentData] = await Promise.all([
          buyRes.json(), rentRes.json(),
        ]);

        if (buyData.success && rentData.success) {
          const combined = [
            ...buyData.data.map(p => ({ ...p, listing_type: "buy" })),
            ...rentData.data.map(p => ({ ...p, listing_type: "rent" }))
          ];
          setAllProps(combined);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    let result = [...allProps];

    // Filter by mode (buy/rent/all)
    if (mode === "buy") {
      result = result.filter(p => p.listing_type === "buy");
    } else if (mode === "rent") {
      result = result.filter(p => p.listing_type === "rent");
    }
    // else mode === "all" - show all

    // Filter by type
    if (filters.type !== "All") {
      result = result.filter(p => p.type === filters.type);
    }

    // Filter by location
    if (filters.location) {
      result = result.filter(p => p.location.toLowerCase().includes(filters.location.toLowerCase()));
    }

    // Filter by price range
    if (filters.minPrice !== "") {
      result = result.filter(p => p.price_raw >= Number(filters.minPrice));
    }
    if (filters.maxPrice !== "") {
      result = result.filter(p => p.price_raw <= Number(filters.maxPrice));
    }

    // Filter by beds
    if (filters.beds !== "Any") {
      if (filters.beds === "5+") {
        result = result.filter(p => p.beds >= 5);
      } else {
        result = result.filter(p => p.beds === Number(filters.beds));
      }
    }

    return result;
  }, [allProps, filters, mode]);

  const handleFilter = (nextFilters) => setFilters(nextFilters);

  const goToDetail = (propertyId) => {
    router.push(`/property/details/${propertyId}`);
  };

  // Count by type
  const buyCount = allProps.filter(p => p.listing_type === "buy").length;
  const rentCount = allProps.filter(p => p.listing_type === "rent").length;

  // Get tag color based on listing type
  const getTagColor = (listingType) => {
    return listingType === "rent" ? "bg-blue-500 text-white" : "bg-[var(--brand-blue)] text-black";
  };

  const getTagLabel = (listingType) => {
    return listingType === "rent" ? "Rent" : "Buy";
  };

  return (
    <main className={`min-h-screen ${dark ? "bg-black" : "bg-gray-50"}`}>

      {/* Hero */}
      <div className={`relative py-20 px-4 text-center ${dark ? "bg-zinc-900" : "bg-zinc-800"}`}>
        <span className="text-[var(--brand-blue)] text-[10px] font-black uppercase tracking-widest">MTBOSS Property</span>
        <h1 className="text-white text-3xl md:text-5xl font-black uppercase tracking-widest mt-2 mb-4">
          Browse<span className="block text-[var(--brand-blue)]">Properties</span>
        </h1>
        <p className="text-zinc-400 text-xs max-w-xl mx-auto font-bold tracking-wide">
          Find properties to buy or rent across Delhi NCR
        </p>

        {/* Mode Toggle */}
        <div className="flex justify-center gap-3 mt-8">
          <button
            onClick={() => setMode("buy")}
            className={`px-6 py-2.5 text-xs font-black uppercase tracking-widest transition-all rounded-sm ${
              mode === "buy"
                ? "bg-[var(--brand-blue)] text-black"
                : `border ${dark ? "border-zinc-600 text-zinc-300 hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]" : "border-gray-300 text-gray-600 hover:border-zinc-800 hover:text-zinc-800"}`
            }`}
          >
            🏠 Buy Properties ({buyCount})
          </button>
          <button
            onClick={() => setMode("rent")}
            className={`px-6 py-2.5 text-xs font-black uppercase tracking-widest transition-all rounded-sm ${
              mode === "rent"
                ? "bg-blue-500 text-white"
                : `border ${dark ? "border-zinc-600 text-zinc-300 hover:border-blue-400 hover:text-blue-400" : "border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500"}`
            }`}
          >
            🔑 Rent Properties ({rentCount})
          </button>
          <button
            onClick={() => setMode("all")}
            className={`px-6 py-2.5 text-xs font-black uppercase tracking-widest transition-all rounded-sm ${
              mode === "all"
                ? "bg-purple-500 text-white"
                : `border ${dark ? "border-zinc-600 text-zinc-300 hover:border-purple-400 hover:text-purple-400" : "border-gray-300 text-gray-600 hover:border-purple-500 hover:text-purple-500"}`
            }`}
          >
            📋 All Properties ({allProps.length})
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mt-8">
          {[
            ["Buy", `${buyCount}+`],
            ["Rent", `${rentCount}+`],
            ["Verified Only", "✓"]
          ].map(([label, val]) => (
            <div key={label} className="text-center">
              <p className="text-[var(--brand-blue)] text-xl font-black">{val}</p>
              <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <FilterBar isDarkMode={dark} onFilter={handleFilter}
        propertyLocations={allProps.map(property => property.location)}
        propertyTypes={allProps.map(property => property.type)} />

        <div className="flex items-center justify-between mb-6">
          <p className={`text-xs font-black uppercase tracking-widest ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
            Showing <span className={dark ? "text-[var(--brand-blue)]" : "text-zinc-800"}>{filtered.length}</span> Properties
          </p>
          <div className="flex gap-2">
            <a href="/property/sell" className="px-4 py-2 bg-[var(--brand-blue)] text-black text-[10px] font-black uppercase tracking-widest hover:bg-[var(--brand-blue-dark)] transition-all rounded-sm">
              + Sell Property
            </a>
            <a href="/property/rent" className="px-4 py-2 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all rounded-sm">
              + Rent Property
            </a>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <p className={`text-xs font-black uppercase tracking-widest animate-pulse ${dark ? "text-zinc-600" : "text-zinc-400"}`}>Loading properties...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={`text-center py-12 ${dark ? "bg-zinc-900" : "bg-white"} rounded-lg`}>
            <p className={`text-sm font-bold ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
              No {mode === "buy" ? "buy" : mode === "rent" ? "rent" : ""} properties found matching your filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((property) => (
              <div
                key={`${property.id}-${property.listing_type}`}
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
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover hover:scale-110 transition-transform"
                    onError={(e) => {
                      e.target.src = "/placeholder.jpg";
                    }}
                  />
                  {/* Tags */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between">
                    <span className={`px-3 py-1 text-[9px] font-black uppercase rounded-sm ${getTagColor(property.listing_type)}`}>
                      {getTagLabel(property.listing_type)}
                    </span>
                    <span className={`px-3 py-1 text-[9px] font-black uppercase rounded-sm ${dark ? "bg-black/60 text-[var(--brand-blue)]" : "bg-white/90 text-zinc-800"}`}>
                      {property.type}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Price */}
                  <p className="text-[var(--brand-blue)] text-lg font-black mb-2">
                    ₹{property.price}{property.listing_type === "rent" ? "/mo" : ""}
                  </p>

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
                        <p className={`text-[8px] font-black uppercase ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
                          {{ sqft: 'Sq. Ft.', sqm: 'Sq. Meter', sqyd: 'Sq. Yard' }[property.area_unit] || 'Sq. Ft.'}
                        </p>
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
