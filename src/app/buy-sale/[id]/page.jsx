"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { properties } from "../../data/properties";
import EnquiryForm from "../../components/buy-sale/EnquiryForm";

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [dark, setDark] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const property = properties.find((p) => p.id === id);

  useEffect(() => {
    const html = document.documentElement;
    const observer = new MutationObserver(() => {
      setDark(html.classList.contains("dark-mode"));
    });
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    setDark(html.classList.contains("dark-mode"));
    return () => observer.disconnect();
  }, []);

  if (!property) {
    return (
      <main className={`min-h-screen flex items-center justify-center ${dark ? "bg-black" : "bg-gray-50"}`}>
        <div className="text-center">
          <p className={`text-xs font-black uppercase tracking-widest ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
            Property not found
          </p>
          <a
            href="/buy-sale"
            className="mt-4 inline-block px-6 py-2 bg-[#facc15] text-black text-[10px] font-black uppercase tracking-widest rounded-sm"
          >
            Back to Listings
          </a>
        </div>
      </main>
    );
  }

  const images = [
    property.image,
    "/images/property-detail1.jpg",
    "/images/property-detail2.jpg",
    "/images/property-detail3.jpg",
  ];

  const tagColors = {
    Sale: "bg-[#facc15] text-black",
    Rent: "bg-blue-500 text-white",
    New: "bg-green-500 text-white",
    Featured: "bg-purple-500 text-white",
  };

  return (
    <main className={`min-h-screen ${dark ? "bg-black" : "bg-gray-50"}`}>

      {/* Breadcrumb */}
      <div className={`py-4 px-4 border-b ${dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"}`}>
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
          <a href="/" className={`${dark ? "text-zinc-500 hover:text-[#facc15]" : "text-zinc-400 hover:text-zinc-800"} transition-colors`}>Home</a>
          <span className={dark ? "text-zinc-700" : "text-gray-300"}>›</span>
          <a href="/buy-sale" className={`${dark ? "text-zinc-500 hover:text-[#facc15]" : "text-zinc-400 hover:text-zinc-800"} transition-colors`}>Buy and Sale</a>
          <span className={dark ? "text-zinc-700" : "text-gray-300"}>›</span>
          <span className="text-[#facc15]">{property.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT — Images + Details */}
          <div className="lg:col-span-2 space-y-8">

            {/* Main Image */}
            <div className="relative rounded-sm overflow-hidden h-72 md:h-96">
              <img
                src={images[activeImage]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              {/* Tag */}
              {property.tag && (
                <span className={`absolute top-4 left-4 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-sm ${tagColors[property.tag] || "bg-[#facc15] text-black"}`}>
                  {property.tag}
                </span>
              )}
              {/* Type */}
              <span className={`absolute top-4 right-4 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-sm ${dark ? "bg-black text-[#facc15]" : "bg-white text-zinc-800"}`}>
                {property.type}
              </span>
            </div>

            {/* Thumbnail Row */}
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-16 rounded-sm overflow-hidden border-2 transition-all ${activeImage === i ? "border-[#facc15]" : dark ? "border-zinc-800" : "border-gray-200"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Title + Price */}
            <div className={`p-6 rounded-sm border ${dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"}`}>
              <p className="text-[#facc15] text-2xl font-black mb-1">
                ₹ {property.price}
              </p>
              <h1 className={`text-xl font-black uppercase tracking-widest mb-4 ${dark ? "text-white" : "text-zinc-800"}`}>
                {property.title}
              </h1>

              {/* Location */}
              <div className="flex items-center gap-2 mb-6">
                <svg className="w-4 h-4 text-[#facc15]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className={`text-xs font-bold ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
                  {property.location}
                </span>
              </div>

              {/* Stats */}
              <div className={`grid grid-cols-3 gap-4 py-4 border-y ${dark ? "border-zinc-800" : "border-gray-100"}`}>
                {property.beds && (
                  <div className="text-center">
                    <p className={`text-lg font-black ${dark ? "text-white" : "text-zinc-800"}`}>{property.beds}</p>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Bedrooms</p>
                  </div>
                )}
                {property.baths && (
                  <div className="text-center">
                    <p className={`text-lg font-black ${dark ? "text-white" : "text-zinc-800"}`}>{property.baths}</p>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Bathrooms</p>
                  </div>
                )}
                {property.area && (
                  <div className="text-center">
                    <p className={`text-lg font-black ${dark ? "text-white" : "text-zinc-800"}`}>{property.area}</p>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Sq Ft</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mt-6">
                <h2 className={`text-xs font-black uppercase tracking-widest mb-3 ${dark ? "text-[#facc15]" : "text-zinc-800"}`}>
                  About This Property
                </h2>
                <p className={`text-xs leading-relaxed font-medium ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
                  {property.description}
                </p>
              </div>
            </div>

            {/* Location Highlights */}
            <div className={`p-6 rounded-sm border ${dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"}`}>
              <h2 className={`text-xs font-black uppercase tracking-widest mb-4 ${dark ? "text-[#facc15]" : "text-zinc-800"}`}>
                Location Highlights
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className={`flex items-center gap-2 p-3 rounded-sm border ${dark ? "border-zinc-800 bg-zinc-800/50" : "border-gray-100 bg-gray-50"}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#facc15] flex-shrink-0" />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${dark ? "text-zinc-300" : "text-zinc-600"}`}>
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT — Enquiry Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">

              {/* Quick Info Card */}
              <div className={`p-5 rounded-sm border ${dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"}`}>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-3 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
                  Property Details
                </p>
                {[
                  { label: "Type", value: property.type },
                  { label: "Location", value: property.location },
                  { label: "Area", value: property.area ? `${property.area} sqft` : "N/A" },
                  { label: "Price", value: `₹ ${property.price}` },
                  { label: "Status", value: property.tag },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex justify-between py-2 border-b text-[11px] ${dark ? "border-zinc-800" : "border-gray-50"}`}
                  >
                    <span className={`font-bold ${dark ? "text-zinc-500" : "text-zinc-400"}`}>{item.label}</span>
                    <span className={`font-black ${dark ? "text-white" : "text-zinc-800"}`}>{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Enquiry Form */}
              <EnquiryForm isDarkMode={dark} propertyTitle={property.title} />

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}