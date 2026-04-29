"use client";
import { useState, useEffect } from "react";
import FilterBar from "../../components/buy-sale/FilterBar";
import PropertyGrid from "../../components/buy-sale/PropertyGrid";
import { properties } from "../../data/properties";

export default function ResidentialPage() {
  const [dark, setDark] = useState(true);
  const residentialProperties = properties.filter(
    (p) => p.category === "residential"
  );
  const [filtered, setFiltered] = useState(residentialProperties);

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
    let result = [...residentialProperties];

    if (filters.location && filters.location !== "") {
      result = result.filter((p) =>
        p.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters.minPrice !== "") {
      result = result.filter((p) => p.priceRaw >= Number(filters.minPrice));
    }
    if (filters.maxPrice !== "") {
      result = result.filter((p) => p.priceRaw <= Number(filters.maxPrice));
    }
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

      {/* Hero */}
      <div className={`relative py-16 px-4 text-center ${dark ? "bg-zinc-900" : "bg-zinc-800"}`}>
        <span className="text-[#facc15] text-[10px] font-black uppercase tracking-widest">
          Buy and Sale
        </span>
        <h1 className="text-white text-3xl md:text-4xl font-black uppercase tracking-widest mt-2 mb-3">
          Residential
          <span className="block text-[#facc15]">Properties</span>
        </h1>
        <p className="text-zinc-400 text-xs max-w-lg mx-auto font-bold">
          Villas, Apartments, Builder Floors and more
        </p>

        {/* Breadcrumb */}
        <div className="flex items-center justify-center gap-2 mt-4 text-[10px] font-black uppercase tracking-widest">
          <a href="/" className="text-zinc-500 hover:text-[#facc15] transition-colors">Home</a>
          <span className="text-zinc-700">›</span>
          <a href="/buy-sale" className="text-zinc-500 hover:text-[#facc15] transition-colors">Buy and Sale</a>
          <span className="text-zinc-700">›</span>
          <span className="text-[#facc15]">Residential</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <FilterBar isDarkMode={dark} onFilter={handleFilter} />

        <div className="flex items-center justify-between mb-6">
          <p className={`text-xs font-black uppercase tracking-widest ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
            Showing{" "}
            <span className={dark ? "text-[#facc15]" : "text-zinc-800"}>
              {filtered.length}
            </span>{" "}
            Residential Properties
          </p>
        </div>

        <PropertyGrid properties={filtered} isDarkMode={dark} />
      </div>

    </main>
  );
}