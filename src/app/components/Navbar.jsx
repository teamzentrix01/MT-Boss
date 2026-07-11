"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import GlobalSearch from "./GlobalSearch";

function DropdownButton({ label, children, text, textHover, dropdownBg }) {
  return (
    <div className="relative group">
      <button
        className={`nav-control flex items-center gap-1 px-2 2xl:px-3 py-2 text-xs 2xl:text-sm font-medium ${text} ${textHover} transition-colors rounded-md`}
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
}

export default function Navbar({ isDarkMode, toggleTheme }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [propertyOpen, setPropertyOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Detect logged in user - UPDATED TO LISTEN FOR CHANGES
  useEffect(() => {
    const checkUser = () => {
      const token = localStorage.getItem('token');
      const vendorToken = localStorage.getItem('vendor-token');
      const adminToken = localStorage.getItem('admin-token');
      const supplierToken = localStorage.getItem('supplier-token');
      const franchiseToken = localStorage.getItem('franchise-token');

      if (adminToken) {
        const adminData = localStorage.getItem('admin');
        if (adminData) {
          try { setUser({ ...JSON.parse(adminData), role: 'admin' }); }
          catch (e) { console.error('Error parsing admin data:', e); }
        }
      } else if (supplierToken) {
        const supplierData = localStorage.getItem('supplier');
        if (supplierData) {
          try { setUser({ ...JSON.parse(supplierData), role: 'supplier' }); }
          catch (e) { console.error('Error parsing supplier data:', e); }
        }
      } else if (franchiseToken) {
        const franchiseData = localStorage.getItem('franchise');
        if (franchiseData) {
          try { setUser({ ...JSON.parse(franchiseData), role: 'franchise' }); }
          catch (e) { console.error('Error parsing franchise data:', e); }
        }
      } else if (vendorToken) {
        const vendorData = localStorage.getItem('vendor');
        if (vendorData) {
          try { setUser({ ...JSON.parse(vendorData), role: 'vendor' }); }
          catch (e) { console.error('Error parsing vendor data:', e); }
        }
      } else if (token) {
        const userData = localStorage.getItem('user');
        if (userData) {
          try {
            const parsed = JSON.parse(userData);
            // Use the role stored in the user object (e.g. 'admin'), not a hardcoded 'user'
            setUser({ ...parsed, role: parsed.role || 'user' });
          }
          catch (e) { console.error('Error parsing user data:', e); }
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

  useEffect(() => {
    setIsOpen(false);
    setPropertyOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const closeMobileMenu = () => {
    setIsOpen(false);
    setPropertyOpen(false);
    setServicesOpen(false);
  };

  const handleLogout = async () => {
    const logoutRole = user?.role;

    [
      'token',
      'user',
      'admin-token',
      'admin',
      'vendor-token',
      'vendor',
      'supplier-token',
      'supplier',
      'franchise-token',
      'franchise',
    ].forEach((key) => localStorage.removeItem(key));

    await fetch('/api/auth/logout', { method: 'POST' });

    setUser(null);
    window.dispatchEvent(new Event('userLoggedIn'));
    router.push(logoutRole === 'supplier' ? '/supplier/login' : logoutRole === 'franchise' ? '/franchise/login' : '/login');
  };

  const handleDashboard = () => {
    closeMobileMenu();
    if (user?.role === 'vendor') router.push('/vendor/dashboard');
    else if (user?.role === 'admin') router.push('/dashboard');
    else if (user?.role === 'supplier') router.push('/supplier/dashboard');
    else if (user?.role === 'franchise') router.push('/franchise/dashboard');
    else router.push('/userdashboard');
  };

  const serviceDropdown = [
    { label: "Quick Services", href: "/quick" },
    { label: "Construction Services", href: "/Services/all" },
    { label: "Professional Services", href: "/Services/professionals" },
  ];

  const propertyDropdown = [
    { label: "🏠 Buy Property", href: "/property/buy", sub: "Browse verified listings" },
    { label: "💰 Sell Property", href: "/property/sell", sub: "List your property free" },
    { label: "🔑 Rent Property", href: "/property/rent", sub: "Find rentals near you" },
  ];

  const bg = isDarkMode ? "bg-black border-zinc-800" : "bg-white border-gray-100";
  const text = isDarkMode ? "text-zinc-300" : "text-zinc-600";
  const textHover = isDarkMode ? "hover:text-[var(--brand-blue)]" : "hover:text-zinc-900";
  const dropdownBg = isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100";
  const dropdownTxt = isDarkMode
    ? "text-zinc-400 hover:text-[var(--brand-blue)] hover:bg-zinc-800"
    : "text-zinc-600 hover:text-zinc-900 hover:bg-gray-50";

  return (
    <nav
      className={`site-navbar ${bg} border-b shadow-sm transition-all duration-500 sticky top-0 z-[100]`}
    >
      <div className="w-full mx-auto px-2 2xl:px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <img
              src="/logo.png"
              alt="MTBOSS"
              className="h-12 2xl:h-14 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden xl:flex flex-1 min-w-0 items-center justify-center gap-0.5 px-2">
            <Link
              href="/"
              className={`px-2 2xl:px-3 py-2 text-xs 2xl:text-sm font-medium whitespace-nowrap ${text} ${textHover} transition-colors rounded-md`}
            >
              Home
            </Link>

            {/* Services */}
            <DropdownButton label="Services" text={text} textHover={textHover} dropdownBg={dropdownBg}>
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
            <DropdownButton label="Property" text={text} textHover={textHover} dropdownBg={dropdownBg}>
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

            <Link
              href="/Services/all"
              className={`px-2 2xl:px-3 py-2 text-xs 2xl:text-sm font-medium whitespace-nowrap ${text} ${textHover} transition-colors rounded-md`}
            >
              Construction
            </Link>

            <Link
              href="/agent"
              className={`px-2 2xl:px-3 py-2 text-xs 2xl:text-sm font-medium whitespace-nowrap ${text} ${textHover} transition-colors rounded-md`}
            >
              Become an Agent
            </Link>
            {user && (
              <Link
                href="/franchise"
                className={`px-2 2xl:px-3 py-2 text-xs 2xl:text-sm font-medium whitespace-nowrap ${text} ${textHover} transition-colors rounded-md`}
              >
                Franchise
              </Link>
            )}

            <Link
              href="/calculator"
              className={`hidden 2xl:inline-flex px-3 py-2 text-sm font-medium whitespace-nowrap ${text} ${textHover} transition-colors rounded-md`}
            >
              Budget Calculator
            </Link>

            <Link
              href="/ShopNow"
              className={`px-2 2xl:px-3 py-2 text-xs 2xl:text-sm font-medium whitespace-nowrap ${text} ${textHover} transition-colors rounded-md`}
            >
              Shop Now
            </Link>
          </div>

          {/* Right Side */}
          <div className="hidden xl:flex min-w-0 flex-shrink-0 items-center gap-1.5 2xl:gap-3">
            <div className="block w-[160px] 2xl:w-[220px]">
              <GlobalSearch user={user} isDarkMode={isDarkMode} />
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              type="button"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              title={isDarkMode ? "Light mode" : "Dark mode"}
              className={`nav-theme-toggle flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border transition-all ${
                isDarkMode
                  ? "nav-theme-toggle-dark border-zinc-700 bg-zinc-900 text-zinc-200"
                  : "nav-theme-toggle-light border-gray-300 bg-white text-zinc-700"
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
                // Logged In User
                <div className={`flex min-w-0 items-center gap-1.5 px-2 py-1.5 rounded-lg border transition-all ${
                  isDarkMode 
                    ? 'border-zinc-700 bg-zinc-900/50' 
                    : 'border-gray-200 bg-gray-50'
                }`}>
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      user.role === 'admin' ? 'bg-red-500'
                      : user.role === 'vendor' ? 'bg-green-500'
                      : user.role === 'supplier' ? 'bg-sky-500'
                      : user.role === 'franchise' ? 'bg-[var(--brand-blue-deep)]'
                      : 'bg-blue-500'
                    } text-white`}
                  >
                    {(user.name || user.shop_name || user.email || 'U')[0].toUpperCase()}
                  </div>
                  <div className="hidden 2xl:flex min-w-0 flex-col text-xs">
                    <span className="font-semibold text-sm truncate max-w-[88px]" title={user.name || user.shop_name || user.email}>
                      {user.name || user.shop_name || user.email}
                    </span>
                    <span className={`text-[10px] capitalize ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={handleDashboard}
                    className={`nav-control nav-dashboard px-2 2xl:px-3 py-1 text-[11px] 2xl:text-xs font-semibold rounded-md transition-all whitespace-nowrap 2xl:ml-1 ${
                      isDarkMode
                        ? 'border border-zinc-500 text-zinc-300 hover:bg-zinc-700'
                        : 'border border-gray-400 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className={`nav-control nav-logout px-2 2xl:px-3 py-1 text-[11px] 2xl:text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
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
                        ? 'text-[var(--brand-blue)] border border-[var(--brand-blue)] hover:bg-[var(--brand-blue)] hover:text-black'
                        : 'text-[var(--brand-blue-deep)] border border-[var(--brand-blue-deep)] hover:bg-sky-50'
                    }`}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-5 py-2 text-sm font-semibold bg-[var(--brand-blue)] text-black rounded-md hover:bg-[var(--brand-blue-dark)] transition-all duration-200"
                  >
                    Sign Up
                  </Link>
                </>
              )
            ) : null}
          </div>

          {/* Mobile Hamburger */}
          <div className="xl:hidden flex items-center gap-2 sm:gap-3">
            {!loading && !user && (
              <div className="flex items-center gap-1.5 mr-1">
                <Link
                  href="/login"
                  className={`text-[10px] font-bold px-2 py-1.5 border rounded transition-all duration-200 ${
                    isDarkMode
                      ? 'text-[var(--brand-blue)] border-[var(--brand-blue)] hover:bg-[var(--brand-blue)]'
                      : 'text-[var(--brand-blue-deep)] border border-[var(--brand-blue-deep)]'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="text-[10px] font-bold px-2 py-1.5 bg-[var(--brand-blue)] text-black rounded hover:bg-[var(--brand-blue-dark)] transition-all duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
            <button
              onClick={toggleTheme}
              type="button"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              title={isDarkMode ? "Light mode" : "Dark mode"}
              className={`nav-theme-toggle flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border ${
                isDarkMode ? 'nav-theme-toggle-dark border-zinc-700 bg-zinc-900 text-zinc-200' : 'nav-theme-toggle-light border-gray-300 bg-white text-zinc-700'
              }`}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`nav-control p-2 rounded-md ${
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
      {isOpen && (
        <div
          aria-label="Close navigation menu"
          onClick={closeMobileMenu}
          className="xl:hidden fixed inset-x-0 top-16 bottom-0 z-[90] bg-black/50"
        />
      )}
      <div
        className={`xl:hidden fixed inset-x-0 top-16 z-[120] transition-all duration-300 ${
          isOpen
            ? 'visible translate-y-0 opacity-100'
            : 'invisible -translate-y-3 opacity-0 pointer-events-none'
        }`}
      >
        <div
          className={`${
            isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100'
          } border-t px-4 py-4 space-y-1 max-h-[calc(100dvh-4rem)] overflow-y-auto shadow-2xl`}
        >
          <div className="pb-3">
            <GlobalSearch user={user} isDarkMode={isDarkMode} onNavigate={() => setIsOpen(false)} />
          </div>

          {[
            { label: 'Home', href: '/' },
            { label: 'Construction', href: '/Services/all' },
            { label: 'Budget Calculator', href: '/calculator' },
            { label: 'Shop Now', href: '/ShopNow' },
            { label: 'Careers', href: '/careers' },
            { label: 'Contact', href: '/contact' },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={closeMobileMenu}
              className={`block px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                isDarkMode
                  ? 'text-zinc-300 hover:text-[var(--brand-blue)] hover:bg-zinc-800'
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
                  ? 'text-zinc-300 hover:text-[var(--brand-blue)] hover:bg-zinc-800'
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
                    onClick={closeMobileMenu}
                    className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                      isDarkMode
                        ? 'text-zinc-400 hover:text-[var(--brand-blue)] hover:bg-zinc-800'
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
                  ? 'text-zinc-300 hover:text-[var(--brand-blue)] hover:bg-zinc-800'
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
                    onClick={closeMobileMenu}
                    className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                      isDarkMode
                        ? 'text-zinc-400 hover:text-[var(--brand-blue)] hover:bg-zinc-800'
                        : 'text-zinc-500 hover:text-zinc-900 hover:bg-gray-50'
                    }`}
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/agent"
            onClick={closeMobileMenu}
            className={`block px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
              isDarkMode
                ? 'text-zinc-300 hover:text-[var(--brand-blue)] hover:bg-zinc-800'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-gray-50'
            }`}
          >
            Become an Agent
          </Link>
          {user && (
            <Link
              href="/franchise"
              onClick={closeMobileMenu}
              className={`block px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                isDarkMode
                  ? 'text-zinc-300 hover:text-[var(--brand-blue)] hover:bg-zinc-800'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-gray-50'
              }`}
            >
              Franchise
            </Link>
          )}

          {/* Mobile Auth */}
          <div className="pt-4 space-y-2 border-t" style={{ borderTopColor: isDarkMode ? '#27272a' : '#e5e7eb' }}>
            {user ? (
              <>
                <div className={`px-3 py-2 text-sm text-center font-semibold ${isDarkMode ? 'text-zinc-300' : 'text-gray-600'}`}>
                  Logged in as {user.role.toUpperCase()}
                </div>
                <button
                  onClick={handleDashboard}
                  className={`nav-control nav-dashboard w-full text-center px-5 py-2.5 text-sm font-semibold rounded-md transition-all ${
                    isDarkMode
                      ? 'border border-zinc-600 text-zinc-300 hover:bg-zinc-800'
                      : 'border border-gray-300 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className={`nav-control nav-logout w-full text-center px-5 py-2.5 text-sm font-semibold rounded-md transition-all ${
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
                  onClick={closeMobileMenu}
                  className={`block text-center px-5 py-2.5 text-sm font-semibold rounded-md transition-all ${
                    isDarkMode
                      ? 'text-[var(--brand-blue)] border border-[var(--brand-blue)] hover:bg-[var(--brand-blue)] hover:text-black'
                      : 'text-[var(--brand-blue-deep)] border border-[var(--brand-blue-deep)] hover:bg-sky-50'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={closeMobileMenu}
                  className="block text-center px-5 py-2.5 text-sm font-semibold bg-[var(--brand-blue)] text-black rounded-md hover:bg-[var(--brand-blue-dark)] transition-all"
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
