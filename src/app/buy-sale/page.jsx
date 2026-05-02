"use client";
import { useState, useEffect } from "react";
import FilterBar from "../components/buy-sale/FilterBar";
import PropertyGrid from "../components/buy-sale/PropertyGrid";
import { properties } from "../data/properties";

export default function BuySalePage() {
  const isDarkMode =
    typeof window !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : true;

  const [filtered, setFiltered] = useState(properties);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const html = document.documentElement;
    const observer = new MutationObserver(() => {
      setDark(html.classList.contains("dark-mode"));
    });
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    setDark(html.classList.contains("dark-mode"));
    return () => observer.disconnect();
  }, []);

  const handleFilter = (filters) => {
    let result = [...properties];

    // Type filter
    if (filters.type !== "All") {
      result = result.filter((p) => p.type === filters.type);
    }

    // Location filter
    if (filters.location && filters.location !== "") {
      result = result.filter((p) =>
        p.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Min price filter
    if (filters.minPrice !== "") {
      result = result.filter((p) => p.priceRaw >= Number(filters.minPrice));
    }

    // Max price filter
    if (filters.maxPrice !== "") {
      result = result.filter((p) => p.priceRaw <= Number(filters.maxPrice));
    }

    // Beds filter
    if (filters.beds !== "Any") {
      if (filters.beds === "5+") {
        result = result.filter((p) => p.beds >= 5);
      } else {
        result = result.filter((p) => p.beds === Number(filters.beds));
      }
    }

    setFiltered(result);
  };

  return (
    <main className={`min-h-screen ${dark ? "bg-black" : "bg-gray-50"}`}>

      {/* Hero Banner */}
      <div className={`relative py-20 px-4 text-center ${dark ? "bg-zinc-900" : "bg-zinc-800"}`}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url('/images/property1.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="relative z-10">
          <span className="text-[#facc15] text-[10px] font-black uppercase tracking-widest">
            MTBOSS Construction
          </span>
          <h1 className="text-white text-3xl md:text-5xl font-black uppercase tracking-widest mt-2 mb-4">
            Buy and Sale
            <span className="block text-[#facc15]">Properties</span>
          </h1>
          <p className="text-zinc-400 text-xs max-w-xl mx-auto font-bold tracking-wide">
            Find your perfect property from our curated listings across Delhi NCR
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-8">
            {[
              { label: "Properties", value: `${properties.length}+` },
              { label: "Locations", value: "8+" },
              { label: "Happy Clients", value: "200+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-[#facc15] text-xl font-black">{stat.value}</p>
                <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Filter Bar */}
        <FilterBar isDarkMode={dark} onFilter={handleFilter} />

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className={`text-xs font-black uppercase tracking-widest ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
            Showing{" "}
            <span className={dark ? "text-[#facc15]" : "text-zinc-800"}>
              {filtered.length}
            </span>{" "}
            Properties
          </p>
        </div>

        {/* Property Grid */}
        <PropertyGrid properties={filtered} isDarkMode={dark} />

      </div>
    </main>
  );
}