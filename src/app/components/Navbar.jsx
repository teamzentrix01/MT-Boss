"use client";
import { useState } from "react";

export default function Navbar({ isDarkMode, toggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [buySaleOpen, setBuySaleOpen] = useState(false);
  const [partnerOpen, setPartnerOpen] = useState(false);

  const serviceDropdown = [
    { label: "Quick Services", href: "/quick" },
    { label: "Primary Services", href: "/Services/all" },
  ];

  const buySaleDropdown = [
    { label: "View All Properties", href: "/buy-sale", highlight: true },
    { label: "Residential", href: "/buy-sale/residential" },
    { label: "Commercial", href: "/buy-sale/commercial" },
    { label: "Plots & Apartments", href: "/buy-sale/plots" },
    { label: "Renting", href: "/renting" },
     { label: "Industrial", href: "/industrial" },        // ← add
  { label: "Gov & Private Buildings", href: "/buildings" }, // ← add
  ];

  const partnerDropdown = [
    { label: "Become an Agent", href: "/agent" },
    { label: "Franchise", href: "/franchise" },
    { label: "Add Vendor", href: "/contractor" },
    { label: "Material Suppliers", href: "/material-suppliers" },
  ];

  const bg = isDarkMode ? "bg-black border-zinc-800" : "bg-white border-gray-100";
  const text = isDarkMode ? "text-zinc-300" : "text-zinc-600";
  const textHover = isDarkMode ? "hover:text-[#facc15]" : "hover:text-zinc-900";
  const dropdownBg = isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100";
  const dropdownText = isDarkMode
    ? "text-zinc-400 hover:text-[#facc15] hover:bg-zinc-800"
    : "text-zinc-600 hover:text-zinc-900 hover:bg-gray-50";

  const DropdownButton = ({ label, children }) => (
    <div className="relative group">
      <button className={`flex items-center gap-1 px-3 py-2 text-sm font-medium ${text} ${textHover} transition-colors rounded-md`}>
        {label}
        <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`absolute top-full left-0 mt-1 rounded-md border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0 z-[110] ${dropdownBg}`}>
        <div className="py-1">{children}</div>
      </div>
    </div>
  );

  return (
    <nav className={`${bg} border-b shadow-sm transition-all duration-500 sticky top-0 z-[100]`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <a href="/" className="flex items-center flex-shrink-0">
            <img src="/logo.png" alt="MTBOSS" className="h-15 w-auto object-contain" />
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5">

            {/* Home */}
            <a href="/" className={`px-3 py-2 text-sm font-medium ${text} ${textHover} transition-colors rounded-md`}>
              Home
            </a>

            {/* About */}
            <a href="/About-us" className={`px-3 py-2 text-sm font-medium ${text} ${textHover} transition-colors rounded-md`}>
              About Us
            </a>

            {/* Services Dropdown */}
            <DropdownButton label="Services">
              <div className="w-48">
                {serviceDropdown.map((item) => (
                  <a key={item.label} href={item.href} className={`block px-4 py-2.5 text-sm transition-colors ${dropdownText}`}>
                    {item.label}
                  </a>
                ))}
              </div>
            </DropdownButton>

            {/* Buy & Sale Dropdown */}
            <DropdownButton label="Buy & Sale">
              <div className="w-52">
                {buySaleDropdown.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`block px-4 py-2.5 text-sm transition-colors ${
                      item.highlight
                        ? isDarkMode
                          ? "text-[#facc15] font-semibold hover:bg-zinc-800 border-b border-zinc-800"
                          : "text-yellow-600 font-semibold hover:bg-gray-50 border-b border-gray-100"
                        : dropdownText
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </DropdownButton>

            {/* Partner With Us Dropdown */}
            <DropdownButton label="Partner With Us">
              <div className="w-52">
                {partnerDropdown.map((item) => (
                  <a key={item.label} href={item.href} className={`block px-4 py-2.5 text-sm transition-colors ${dropdownText}`}>
                    {item.label}
                  </a>
                ))}
              </div>
            </DropdownButton>

            {/* Careers */}
            <a href="/careers" className={`px-3 py-2 text-sm font-medium ${text} ${textHover} transition-colors rounded-md`}>
              Careers
            </a>

            {/* Contact */}
            <a href="/contact" className={`px-3 py-2 text-sm font-medium ${text} ${textHover} transition-colors rounded-md`}>
              Contact
            </a>

          </div>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all ${
                isDarkMode
                  ? "text-zinc-400 hover:text-[#facc15] hover:bg-zinc-800"
                  : "text-zinc-500 hover:text-zinc-800 hover:bg-gray-100"
              }`}
            >
              {isDarkMode ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* Sign In */}
            <a
              href="#"
              className="px-5 py-2 text-sm font-semibold bg-[#facc15] text-black rounded-md hover:bg-yellow-400 transition-all duration-200"
            >
              Sign In
            </a>
          </div>

          {/* Mobile Hamburger */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${isDarkMode ? "text-zinc-400 hover:text-[#facc15]" : "text-zinc-500 hover:text-zinc-800"}`}
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${isDarkMode ? "text-zinc-300 hover:bg-zinc-800" : "text-zinc-600 hover:bg-gray-100"}`}
            >
              {isOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isOpen ? "max-h-screen" : "max-h-0"}`}>
        <div className={`${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"} border-t px-6 py-4 space-y-1`}>

          {/* Static Links */}
          {[
            { label: "Home", href: "/" },
            { label: "About Us", href: "/About-us" },
            { label: "Careers", href: "/careers" },
            { label: "Contact", href: "#" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`block px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                isDarkMode ? "text-zinc-300 hover:text-[#facc15] hover:bg-zinc-800" : "text-zinc-600 hover:text-zinc-900 hover:bg-gray-50"
              }`}
            >
              {link.label}
            </a>
          ))}

          {/* Mobile Services */}
          <div>
            <button
              onClick={() => setServicesOpen(!servicesOpen)}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                isDarkMode ? "text-zinc-300 hover:text-[#facc15] hover:bg-zinc-800" : "text-zinc-600 hover:text-zinc-900 hover:bg-gray-50"
              }`}
            >
              Services
              <svg className={`w-4 h-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {servicesOpen && (
              <div className="ml-4 mt-1 space-y-1">
                {serviceDropdown.map((s) => (
                  <a key={s.label} href={s.href} className={`block px-3 py-2 text-sm rounded-md transition-colors ${isDarkMode ? "text-zinc-400 hover:text-[#facc15] hover:bg-zinc-800" : "text-zinc-500 hover:text-zinc-900 hover:bg-gray-50"}`}>
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Buy & Sale */}
          <div>
            <button
              onClick={() => setBuySaleOpen(!buySaleOpen)}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                isDarkMode ? "text-zinc-300 hover:text-[#facc15] hover:bg-zinc-800" : "text-zinc-600 hover:text-zinc-900 hover:bg-gray-50"
              }`}
            >
              Buy & Sale
              <svg className={`w-4 h-4 transition-transform ${buySaleOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {buySaleOpen && (
              <div className="ml-4 mt-1 space-y-1">
                {buySaleDropdown.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                      s.highlight
                        ? isDarkMode ? "text-[#facc15] font-semibold" : "text-yellow-600 font-semibold"
                        : isDarkMode ? "text-zinc-400 hover:text-[#facc15] hover:bg-zinc-800" : "text-zinc-500 hover:text-zinc-900 hover:bg-gray-50"
                    }`}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Partner With Us */}
          <div>
            <button
              onClick={() => setPartnerOpen(!partnerOpen)}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                isDarkMode ? "text-zinc-300 hover:text-[#facc15] hover:bg-zinc-800" : "text-zinc-600 hover:text-zinc-900 hover:bg-gray-50"
              }`}
            >
              Partner With Us
              <svg className={`w-4 h-4 transition-transform ${partnerOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {partnerOpen && (
              <div className="ml-4 mt-1 space-y-1">
                {partnerDropdown.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                      isDarkMode ? "text-zinc-400 hover:text-[#facc15] hover:bg-zinc-800" : "text-zinc-500 hover:text-zinc-900 hover:bg-gray-50"
                    }`}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Sign In */}
          <div className="pt-2">
            <a
              href="#"
              className="block text-center px-5 py-2.5 text-sm font-semibold bg-[#facc15] text-black rounded-md hover:bg-yellow-400 transition-all"
            >
              Sign In
            </a>
          </div>

        </div>
      </div>
    </nav>
  );
}