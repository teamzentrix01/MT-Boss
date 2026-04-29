"use client";
import { useState } from "react";

export default function FilterBar({ isDarkMode, onFilter }) {
  const [filters, setFilters] = useState({
    type: "All",
    location: "",
    minPrice: "",
    maxPrice: "",
    beds: "Any",
  });

  const propertyTypes = ["All", "Residential", "Commercial", "Plots"];
  const bedOptions = ["Any", "1", "2", "3", "4", "5+"];

  const locations = [
    "All Locations",
    "Delhi",
    "Noida",
    "Gurgaon",
    "Faridabad",
    "Ghaziabad",
    "Greater Noida",
    "Bulandshahr",
  ];

  const handleChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onFilter(updated);
  };

  const handleReset = () => {
    const reset = {
      type: "All",
      location: "",
      minPrice: "",
      maxPrice: "",
      beds: "Any",
    };
    setFilters(reset);
    onFilter(reset);
  };

  const inputClass = `w-full px-3 py-2 text-xs font-bold uppercase tracking-wide border rounded-sm outline-none transition-all duration-200 ${
    isDarkMode
      ? "bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#facc15]"
      : "bg-white border-gray-200 text-zinc-800 placeholder-zinc-400 focus:border-zinc-800"
  }`;

  const labelClass = `block text-[10px] font-black uppercase tracking-widest mb-1 ${
    isDarkMode ? "text-zinc-400" : "text-zinc-500"
  }`;

  return (
    <div
      className={`w-full rounded-sm border shadow-md p-6 mb-8 ${
        isDarkMode
          ? "bg-zinc-900 border-zinc-800"
          : "bg-white border-gray-100"
      }`}
    >
      {/* Heading */}
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? "text-[#facc15]" : "text-zinc-800"}`}>
          Filter Properties
        </h2>
        <button
          onClick={handleReset}
          className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 border rounded-sm transition-all ${
            isDarkMode
              ? "border-zinc-700 text-zinc-400 hover:border-[#facc15] hover:text-[#facc15]"
              : "border-gray-200 text-zinc-400 hover:border-zinc-800 hover:text-zinc-800"
          }`}
        >
          Reset All
        </button>
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

        {/* Property Type */}
        <div>
          <label className={labelClass}>Property Type</label>
          <div className="flex flex-wrap gap-1">
            {propertyTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleChange("type", type)}
                className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-sm border transition-all ${
                  filters.type === type
                    ? "bg-[#facc15] text-black border-[#facc15]"
                    : isDarkMode
                    ? "border-zinc-700 text-zinc-400 hover:border-[#facc15] hover:text-[#facc15]"
                    : "border-gray-200 text-zinc-500 hover:border-zinc-800 hover:text-zinc-800"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className={labelClass}>Location</label>
          <select
            value={filters.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className={inputClass}
          >
            {locations.map((loc) => (
              <option key={loc} value={loc === "All Locations" ? "" : loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label className={labelClass}>Min Price (₹)</label>
          <input
            type="number"
            placeholder="e.g. 500000"
            value={filters.minPrice}
            onChange={(e) => handleChange("minPrice", e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Max Price */}
        <div>
          <label className={labelClass}>Max Price (₹)</label>
          <input
            type="number"
            placeholder="e.g. 5000000"
            value={filters.maxPrice}
            onChange={(e) => handleChange("maxPrice", e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Beds */}
        <div>
          <label className={labelClass}>Bedrooms</label>
          <div className="flex flex-wrap gap-1">
            {bedOptions.map((bed) => (
              <button
                key={bed}
                onClick={() => handleChange("beds", bed)}
                className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-sm border transition-all ${
                  filters.beds === bed
                    ? "bg-[#facc15] text-black border-[#facc15]"
                    : isDarkMode
                    ? "border-zinc-700 text-zinc-400 hover:border-[#facc15] hover:text-[#facc15]"
                    : "border-gray-200 text-zinc-500 hover:border-zinc-800 hover:text-zinc-800"
                }`}
              >
                {bed}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}