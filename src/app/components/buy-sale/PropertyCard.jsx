"use client";

export default function PropertyCard({ property, isDarkMode }) {
  const {
    id,
    title,
    type,
    price,
    location,
    beds,
    baths,
    area,
    image,
    tag,
  } = property;

  const tagColors = {
    Sale: "bg-[#facc15] text-black",
    Rent: "bg-blue-500 text-white",
    New: "bg-green-500 text-white",
    Featured: "bg-purple-500 text-white",
  };

  return (
    <div
      className={`group rounded-sm overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border ${
        isDarkMode
          ? "bg-zinc-900 border-zinc-800 hover:border-[#facc15]"
          : "bg-white border-gray-100 hover:border-zinc-300"
      }`}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <img
          src={image || "/images/property-placeholder.jpg"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Tag Badge */}
        {tag && (
          <span className={`absolute top-3 left-3 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-sm ${tagColors[tag] || "bg-[#facc15] text-black"}`}>
            {tag}
          </span>
        )}

        {/* Type Badge */}
        <span className={`absolute top-3 right-3 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-sm ${isDarkMode ? "bg-black text-[#facc15]" : "bg-white text-zinc-800"}`}>
          {type}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">

        {/* Price */}
        <p className="text-[#facc15] text-lg font-black tracking-wide mb-1">
          ₹ {price}
        </p>

        {/* Title */}
        <h3 className={`text-sm font-black uppercase tracking-widest mb-2 line-clamp-1 ${isDarkMode ? "text-white" : "text-zinc-800"}`}>
          {title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 mb-4">
          <svg className="w-3 h-3 text-[#facc15] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className={`text-[11px] font-bold truncate ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
            {location}
          </span>
        </div>

        {/* Divider */}
        <div className={`border-t mb-4 ${isDarkMode ? "border-zinc-800" : "border-gray-100"}`} />

        {/* Stats Row */}
        <div className="flex items-center justify-between">

          {/* Beds */}
          {beds && (
            <div className="flex items-center gap-1">
              <svg className={`w-4 h-4 ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className={`text-[11px] font-bold ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                {beds} Beds
              </span>
            </div>
          )}

          {/* Baths */}
          {baths && (
            <div className="flex items-center gap-1">
              <svg className={`w-4 h-4 ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className={`text-[11px] font-bold ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                {baths} Baths
              </span>
            </div>
          )}

          {/* Area */}
          {area && (
            <div className="flex items-center gap-1">
              <svg className={`w-4 h-4 ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span className={`text-[11px] font-bold ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                {area} sqft
              </span>
            </div>
          )}

        </div>

        {/* View Details Button */}
        <a
          href={`/buy-sale/${id}`}
          className={`mt-4 block text-center py-2 text-[10px] uppercase tracking-widest font-black border-2 rounded-sm transition-all duration-300 ${
            isDarkMode
              ? "border-[#facc15] text-[#facc15] hover:bg-[#facc15] hover:text-black"
              : "border-zinc-800 text-zinc-800 hover:bg-zinc-800 hover:text-white"
          }`}
        >
          View Details
        </a>

      </div>
    </div>
  );
}