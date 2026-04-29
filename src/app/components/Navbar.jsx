"use client";
import { useState } from "react";

export default function Navbar({ isDarkMode, toggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "#" },
    { label: "Want to be an Agent?", href: "#" },
  ];

  const serviceDropdown = [
    { label: "Quick Services", href: "/quick" },
    { label: "Primary Services", href: "/Services/all" },
  ];

  const buySaleDropdown = [
    { label: "Residential Properties", href: "/buy-sale/residential" },
    { label: "Commercial Properties", href: "/buy-sale/commercial" },
    { label: "Plots and Apartments", href: "/buy-sale/plots" },
  ];

  const bgMain = isDarkMode ? "bg-black" : "bg-white";
  const textMain = isDarkMode ? "text-[#facc15]" : "text-zinc-800";
  const textHover = isDarkMode ? "hover:text-white" : "hover:text-[#eab308]";
  const borderAction = isDarkMode ? "border-[#facc15]" : "border-zinc-800";

  return (
    <nav className={`${bgMain} ${isDarkMode ? "" : "border-b border-gray-100"} shadow-sm font-sans transition-all duration-500 sticky top-0 z-[100]`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center">
              <img
                src="/logo.png"
                alt="MT BOSS Logo"
                className="h-12 w-auto object-contain"
              />
            </a>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">

            <a href="/" className={`px-4 py-2 ${textMain} ${textHover} text-xs uppercase tracking-widest font-bold transition-all`}>
              Home
            </a>

            <a href="/about-us" className={`px-4 py-2 ${textMain} ${textHover} text-xs uppercase tracking-widest font-bold transition-all`}>
              About Us
            </a>

            {/* Services Dropdown */}
            <div className="relative group">
              <button className={`flex items-center gap-1 px-4 py-2 ${textMain} ${textHover} text-xs uppercase tracking-widest font-bold transition-all cursor-pointer`}>
                Services
                <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 w-52 mt-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-[110]">
                <div className={`${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"} border shadow-xl rounded-sm py-2`}>
                  {serviceDropdown.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className={`block px-6 py-3 text-[10px] uppercase tracking-widest font-black transition-colors ${isDarkMode ? "text-zinc-400 hover:bg-[#facc15] hover:text-black" : "text-zinc-600 hover:bg-zinc-50 hover:text-[#eab308]"}`}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Buy and Sale Dropdown */}
            <div className="relative group">
              <button className={`flex items-center gap-1 px-4 py-2 ${textMain} ${textHover} text-xs uppercase tracking-widest font-bold transition-all cursor-pointer`}>
                Buy and Sale
                <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 w-56 mt-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-[110]">
                <div className={`${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"} border shadow-xl rounded-sm py-2`}>
                  <a
                    href="/buy-sale"
                    className={`block px-6 py-3 text-[10px] uppercase tracking-widest font-black transition-colors border-b ${isDarkMode ? "text-[#facc15] border-zinc-800 hover:bg-[#facc15] hover:text-black" : "text-[#eab308] border-gray-100 hover:bg-zinc-50 hover:text-[#eab308]"}`}
                  >
                    View All Properties
                  </a>
                  {buySaleDropdown.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className={`block px-6 py-3 text-[10px] uppercase tracking-widest font-black transition-colors ${isDarkMode ? "text-zinc-400 hover:bg-[#facc15] hover:text-black" : "text-zinc-600 hover:bg-zinc-50 hover:text-[#eab308]"}`}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Careers, Contact, Agent */}
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`px-4 py-2 ${textMain} ${textHover} text-xs uppercase tracking-widest font-bold transition-all`}
              >
                {link.label}
              </a>
            ))}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`ml-4 p-2 rounded-full border ${borderAction} ${textMain} hover:bg-[#facc15] hover:text-black transition-all`}
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
              className={`ml-3 px-6 py-2 border-2 ${borderAction} ${textMain} text-xs uppercase tracking-widest font-black rounded hover:bg-[#facc15] hover:text-black hover:border-[#facc15] transition-all duration-300`}
            >
              Sign In
            </a>

          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleTheme} className={textMain}>
              {isDarkMode ? "☀️" : "🌙"}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className={`p-2 ${textMain}`}>
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? "max-h-screen border-t" : "max-h-0"}`}>
        <div className={`${isDarkMode ? "bg-zinc-900" : "bg-gray-50"} px-4 py-6 space-y-3`}>

          <a href="/" className={`block px-4 py-2 ${textMain} text-xs uppercase tracking-widest font-bold`}>Home</a>
          <a href="/about-us" className={`block px-4 py-2 ${textMain} text-xs uppercase tracking-widest font-bold`}>About Us</a>

          {/* Mobile Services */}
          <div className="px-4 py-2">
            <p className={`${textMain} text-[10px] font-black uppercase tracking-tighter mb-2 opacity-50`}>Our Services</p>
            {serviceDropdown.map((s) => (
              <a key={s.label} href={s.href} className={`block py-2 ${textMain} text-xs font-bold pl-4 border-l-2 border-[#facc15]/30 hover:border-[#facc15]`}>
                {s.label}
              </a>
            ))}
          </div>

          {/* Mobile Buy and Sale */}
          <div className="px-4 py-2">
            <p className={`${textMain} text-[10px] font-black uppercase tracking-tighter mb-2 opacity-50`}>Buy and Sale</p>
            <a href="/buy-sale" className={`block py-2 ${textMain} text-xs font-bold pl-4 border-l-2 border-[#facc15] hover:border-[#facc15]`}>
              View All Properties
            </a>
            {buySaleDropdown.map((s) => (
              <a key={s.label} href={s.href} className={`block py-2 ${textMain} text-xs font-bold pl-4 border-l-2 border-[#facc15]/30 hover:border-[#facc15]`}>
                {s.label}
              </a>
            ))}
          </div>

          {/* Other Links */}
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`block px-4 py-2 ${textMain} text-xs uppercase tracking-widest font-bold border-l-4 border-transparent hover:border-[#facc15] hover:bg-white/10`}
            >
              {link.label}
            </a>
          ))}

        </div>
      </div>
    </nav>
  );
}