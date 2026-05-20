"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar({ isDarkMode, toggleTheme }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [propertyOpen, setPropertyOpen] = useState(false);
  const [partnerOpen, setPartnerOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Detect logged in user - UPDATED TO LISTEN FOR CHANGES
  useEffect(() => {
    const checkUser = () => {
      const token = localStorage.getItem('token');
      const vendorToken = localStorage.getItem('vendor-token');
      const adminToken = localStorage.getItem('admin-token');

      if (token) {
        const userData = localStorage.getItem('user');
        if (userData) {
          try {
            setUser({ ...JSON.parse(userData), role: 'user' });
          } catch (e) {
            console.error('Error parsing user data:', e);
          }
        }
      } else if (vendorToken) {
        const vendorData = localStorage.getItem('vendor');
        if (vendorData) {
          try {
            setUser({ ...JSON.parse(vendorData), role: 'vendor' });
          } catch (e) {
            console.error('Error parsing vendor data:', e);
          }
        }
      } else if (adminToken) {
        const adminData = localStorage.getItem('admin');
        if (adminData) {
          try {
            setUser({ ...JSON.parse(adminData), role: 'admin' });
          } catch (e) {
            console.error('Error parsing admin data:', e);
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkUser();

    window.addEventListener('storage', checkUser);
    window.addEventListener('userLoggedIn', checkUser);

    return () => {
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('userLoggedIn', checkUser);
    };
  }, [pathname]); // re-check on every route change too

  const handleLogout = () => {
    if (user?.role === 'vendor') {
      localStorage.removeItem('vendor-token');
      localStorage.removeItem('vendor');
      document.cookie = 'vendor-auth-token=; path=/; max-age=0';
    } else if (user?.role === 'admin') {
      localStorage.removeItem('admin-token');
      localStorage.removeItem('admin');
      document.cookie = 'admin-auth-token=; path=/; max-age=0';
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      document.cookie = 'auth-token=; path=/; max-age=0';
    }
    setUser(null);
    router.push('/login');
  };

  const handleDashboard = () => {
    if (user?.role === 'vendor') {
      router.push('/vendor/dashboard');
    } else if (user?.role === 'admin') {
      router.push('/dashboard');
    } else {
      router.push('/userdashboard');
    }
  };

  const serviceDropdown = [
    { label: "Quick Services", href: "/quick" },
    { label: "Primary Services", href: "/Services/all" },
  ];

  const propertyDropdown = [
    { label: "🏠 Buy Property", href: "/property/buy", sub: "Browse verified listings" },
    { label: "💰 Sell Property", href: "/property/sell", sub: "List your property free" },
    { label: "🔑 Rent Property", href: "/property/rent", sub: "Find rentals near you" },
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
  const dropdownTxt = isDarkMode
    ? "text-zinc-400 hover:text-[#facc15] hover:bg-zinc-800"
    : "text-zinc-600 hover:text-zinc-900 hover:bg-gray-50";

  const DropdownButton = ({ label, children }) => (
    <div className="relative group">
      <button
        className={`flex items-center gap-1 px-3 py-2 text-sm font-medium ${text} ${textHover} transition-colors rounded-md`}
      >
        {label}
        <svg
          className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`absolute top-full left-0 mt-1 rounded-md border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0 z-[110] ${dropdownBg}`}
      >
        <div className="py-1">{children}</div>
      </div>
    </div>
  );

  return (
    <nav
      className={`${bg} border-b shadow-sm transition-all duration-500 sticky top-0 z-[100]`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <img
              src="/logo.png"
              alt="MTBOSS"
              className="h-15 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            <Link
              href="/"
              className={`px-3 py-2 text-sm font-medium ${text} ${textHover} transition-colors rounded-md`}
            >
              Home
            </Link>
            <Link
              href="/About-us"
              className={`px-3 py-2 text-sm font-medium ${text} ${textHover} transition-colors rounded-md`}
            >
              About Us
            </Link>

            {/* Services */}
            <DropdownButton label="Services">
              <div className="w-48">
                {serviceDropdown.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`block px-4 py-2.5 text-sm transition-colors ${dropdownTxt}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </DropdownButton>

            {/* Property */}
            <DropdownButton label="Property">
              <div className="w-60">
                {propertyDropdown.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`block px-4 py-3 transition-colors ${dropdownTxt}`}
                  >
                    <p className="text-sm font-bold">{item.label}</p>
                    <p
                      className={`text-[11px] mt-0.5 ${
                        isDarkMode ? "text-zinc-600" : "text-zinc-400"
                      }`}
                    >
                      {item.sub}
                    </p>
                  </Link>
                ))}
              </div>
            </DropdownButton>

            {/* Partner With Us */}
            <DropdownButton label="Partner With Us">
              <div className="w-52">
                {partnerDropdown.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`block px-4 py-2.5 text-sm transition-colors ${dropdownTxt}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </DropdownButton>

            <Link
              href="/ShopNow"
              className={`px-3 py-2 text-sm font-medium ${text} ${textHover} transition-colors rounded-md`}
            >
              Shop Now
            </Link>
            <Link
              href="/careers"
              className={`px-3 py-2 text-sm font-medium ${text} ${textHover} transition-colors rounded-md`}
            >
              Careers
            </Link>
            <Link
              href="/contact"
              className={`px-3 py-2 text-sm font-medium ${text} ${textHover} transition-colors rounded-md`}
            >
              Contact
            </Link>
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
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* User Info / Auth Buttons */}
            {!loading ? (
              user ? (
                // Logged In User - IMPROVED
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  isDarkMode 
                    ? 'border-zinc-700 bg-zinc-900/50' 
                    : 'border-gray-200 bg-gray-50'
                }`}>
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      user.role === 'admin'
                        ? 'bg-red-500'
                        : user.role === 'vendor'
                        ? 'bg-green-500'
                        : 'bg-blue-500'
                    } text-white`}
                  >
                    {(user.name || user.email || user.shop_name || 'U')[0].toUpperCase()}
                  </div>
                  <div className="flex flex-col text-xs min-w-max">
                    <span className="font-semibold text-sm">
                      {user.name || user.shop_name || user.email}
                    </span>
                    <span
                      className={`text-[10px] ${
                        isDarkMode ? 'text-zinc-500' : 'text-gray-500'
                      }`}
                    >
                      {user.role === 'admin'
                        ? '👨‍💼 Admin'
                        : user.role === 'vendor'
                        ? '🏪 Vendor'
                        : '👤 User'}
                    </span>
                  </div>
                  <button
                    onClick={handleDashboard}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ml-2 ${
                      isDarkMode
                        ? 'border border-zinc-500 text-zinc-300 hover:bg-zinc-700'
                        : 'border border-gray-400 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                      isDarkMode
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                // Not Logged In
                <>
                  <Link
                    href="/login"
                    className={`px-5 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
                      isDarkMode
                        ? 'text-[#facc15] border border-[#facc15] hover:bg-[#facc15] hover:text-black'
                        : 'text-yellow-600 border border-yellow-600 hover:bg-yellow-50'
                    }`}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-5 py-2 text-sm font-semibold bg-[#facc15] text-black rounded-md hover:bg-yellow-400 transition-all duration-200"
                  >
                    Sign Up
                  </Link>
                </>
              )
            ) : null}
          </div>

          {/* Mobile Hamburger */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${
                isDarkMode ? 'text-zinc-400 hover:text-[#facc15]' : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${
                isDarkMode
                  ? 'text-zinc-300 hover:bg-zinc-800'
                  : 'text-zinc-600 hover:bg-gray-100'
              }`}
            >
              {isOpen ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <div
          className={`${
            isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100'
          } border-t px-6 py-4 space-y-1`}
        >
          {[
            { label: 'Home', href: '/' },
            { label: 'About Us', href: '/About-us' },
            { label: 'Shop Now', href: '/shop' },
            { label: 'Careers', href: '/careers' },
            { label: 'Contact', href: '/contact' },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`block px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                isDarkMode
                  ? 'text-zinc-300 hover:text-[#facc15] hover:bg-zinc-800'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-gray-50'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile Services */}
          <div>
            <button
              onClick={() => setServicesOpen(!servicesOpen)}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                isDarkMode
                  ? 'text-zinc-300 hover:text-[#facc15] hover:bg-zinc-800'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-gray-50'
              }`}
            >
              Services
              <svg
                className={`w-4 h-4 transition-transform ${
                  servicesOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {servicesOpen && (
              <div className="ml-4 mt-1 space-y-1">
                {serviceDropdown.map((s) => (
                  <Link
                    key={s.label}
                    href={s.href}
                    className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                      isDarkMode
                        ? 'text-zinc-400 hover:text-[#facc15] hover:bg-zinc-800'
                        : 'text-zinc-500 hover:text-zinc-900 hover:bg-gray-50'
                    }`}
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Property */}
          <div>
            <button
              onClick={() => setPropertyOpen(!propertyOpen)}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                isDarkMode
                  ? 'text-zinc-300 hover:text-[#facc15] hover:bg-zinc-800'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-gray-50'
              }`}
            >
              Property
              <svg
                className={`w-4 h-4 transition-transform ${
                  propertyOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {propertyOpen && (
              <div className="ml-4 mt-1 space-y-1">
                {propertyDropdown.map((s) => (
                  <Link
                    key={s.label}
                    href={s.href}
                    className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                      isDarkMode
                        ? 'text-zinc-400 hover:text-[#facc15] hover:bg-zinc-800'
                        : 'text-zinc-500 hover:text-zinc-900 hover:bg-gray-50'
                    }`}
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Partner */}
          <div>
            <button
              onClick={() => setPartnerOpen(!partnerOpen)}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                isDarkMode
                  ? 'text-zinc-300 hover:text-[#facc15] hover:bg-zinc-800'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-gray-50'
              }`}
            >
              Partner With Us
              <svg
                className={`w-4 h-4 transition-transform ${
                  partnerOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {partnerOpen && (
              <div className="ml-4 mt-1 space-y-1">
                {partnerDropdown.map((s) => (
                  <Link
                    key={s.label}
                    href={s.href}
                    className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                      isDarkMode
                        ? 'text-zinc-400 hover:text-[#facc15] hover:bg-zinc-800'
                        : 'text-zinc-500 hover:text-zinc-900 hover:bg-gray-50'
                    }`}
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Auth */}
          <div className="pt-4 space-y-2 border-t" style={{ borderTopColor: isDarkMode ? '#27272a' : '#e5e7eb' }}>
            {user ? (
              <>
                <div className={`px-3 py-2 text-sm text-center font-semibold ${isDarkMode ? 'text-zinc-300' : 'text-gray-600'}`}>
                  Logged in as {user.role.toUpperCase()}
                </div>
                <button
                  onClick={handleDashboard}
                  className={`w-full text-center px-5 py-2.5 text-sm font-semibold rounded-md transition-all ${
                    isDarkMode
                      ? 'border border-zinc-600 text-zinc-300 hover:bg-zinc-800'
                      : 'border border-gray-300 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className={`w-full text-center px-5 py-2.5 text-sm font-semibold rounded-md transition-all ${
                    isDarkMode
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`block text-center px-5 py-2.5 text-sm font-semibold rounded-md transition-all ${
                    isDarkMode
                      ? 'text-[#facc15] border border-[#facc15] hover:bg-[#facc15] hover:text-black'
                      : 'text-yellow-600 border border-yellow-600 hover:bg-yellow-50'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="block text-center px-5 py-2.5 text-sm font-semibold bg-[#facc15] text-black rounded-md hover:bg-yellow-400 transition-all"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}