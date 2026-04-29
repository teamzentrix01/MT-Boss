"use client";
import PropertyCard from "./PropertyCard";

export default function PropertyGrid({ properties, isDarkMode }) {
  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <svg
          className={`w-16 h-16 mb-4 ${isDarkMode ? "text-zinc-700" : "text-gray-200"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <p className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? "text-zinc-600" : "text-gray-300"}`}>
          No Properties Found
        </p>
        <p className={`text-[11px] mt-2 ${isDarkMode ? "text-zinc-700" : "text-gray-300"}`}>
          Try changing your filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          isDarkMode={isDarkMode}
        />
      ))}
    </div>
  );
}