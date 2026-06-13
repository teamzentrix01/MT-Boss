// ════════════════════════════════════════════════════════════════════════════════
// FILE: app/vendor/dashboard/page.jsx
// VENDOR DASHBOARD - Notifications, Active Booking, Messages
// ════════════════════════════════════════════════════════════════════════════════
 
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
 
export default function VendorDashboard() {
  const router = useRouter();
  const [vendor, setVendor] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [activeBooking, setActiveBooking] = useState(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [isQuickJob, setIsQuickJob] = useState(true);
  const [extraAmount, setExtraAmount] = useState("");
  const [vendorNote, setVendorNote] = useState("");
  const [completeLoading, setCompleteLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("notifications");
  const [vendorProfile, setVendorProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({ shop_name: "", phone: "", city: "", state: "", description: "" });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const [allServices, setAllServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [totalEarning, setTotalEarning] = useState(0);
  const [startOtpInput, setStartOtpInput] = useState('');
  const [finishOtpInput, setFinishOtpInput] = useState('');
  const [otpMsg, setOtpMsg] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [pkgList, setPkgList] = useState([]);
  const [pkgStatus, setPkgStatus] = useState(null);
  const [pkgLoading, setPkgLoading] = useState(false);
  const [pkgMsg, setPkgMsg] = useState('');
 
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark-mode"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
 
  useEffect(() => {
    const token = localStorage.getItem("vendor-token");
    if (!token) {
      router.push("/vendor/login");
      return;
    }
 
    fetchVendorData(token);
    const interval = setInterval(() => fetchVendorData(token), 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [router]);
 
  async function fetchVendorData(token) {
    try {
      const [notRes, bookRes, compRes, profRes] = await Promise.all([
        fetch("/api/vendor/notifications", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/vendor/bookings?type=active", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/vendor/bookings?type=completed", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/vendor/profile", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const notData = await notRes.json();
      if (notData.success) setNotifications(notData.notifications);

      const bookData = await bookRes.json();
      let awaitingPaymentCount = 0;
      if (bookData.success && bookData.bookings.length > 0) {
        setActiveBooking(bookData.bookings[0]);
        awaitingPaymentCount = bookData.bookings.filter((b) => b.status === 'AWAITING_PAYMENT').length;
      } else {
        setActiveBooking(null);
      }

      const compData = await compRes.json();
      if (compData.success) {
        setCompletedCount(compData.bookings.length + awaitingPaymentCount);
        setCompletedBookings(compData.bookings);
        const earned = compData.bookings.reduce((sum, b) => sum + parseFloat(b.vendor_earning || 0), 0);
        setTotalEarning(Math.round(earned));
        // Update stats card label too
      }

      const profData = await profRes.json();
      if (profData.success) {
        setVendorProfile(profData.vendor);
        setSelectedServices((profData.vendor.services || []).map((s) => s.id));
        setProfileForm({
          shop_name: profData.vendor.shop_name || "",
          phone: profData.vendor.phone || "",
          city: profData.vendor.city || "",
          state: profData.vendor.state || "",
          description: profData.vendor.description || "",
        });
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching vendor data:", error);
      setLoading(false);
    }
  }

  async function loadPackages() {
    const token = localStorage.getItem('vendor-token');
    try {
      const [listRes, statusRes] = await Promise.all([
        fetch('/api/vendor/packages', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/vendor/packages?action=status', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const listData = await listRes.json();
      const statusData = await statusRes.json();
      if (listData.success) setPkgList(listData.packages || []);
      if (statusData.success) setPkgStatus(statusData.package || null);
    } catch { /* ignore */ }
  }

  async function selectPackage(pkgId) {
    setPkgLoading(true);
    setPkgMsg('');
    const token = localStorage.getItem('vendor-token');
    try {
      const res = await fetch('/api/vendor/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ package_id: pkgId }),
      });
      const data = await res.json();
      if (data.success) {
        setPkgMsg(data.message || 'Package selected!');
        await loadPackages();
      } else {
        setPkgMsg(data.error || 'Failed to select package');
      }
    } catch { setPkgMsg('Network error'); } finally { setPkgLoading(false); }
  }

  async function verifyStartOtp(bookingId) {
    setOtpLoading(true);
    setOtpMsg('');
    const token = localStorage.getItem('vendor-token');
    try {
      const res = await fetch(`/api/bookings/${bookingId}/verify-start-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ otp: startOtpInput }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpMsg('✓ Start OTP verified! Service in progress.');
        setStartOtpInput('');
        fetchVendorData(token);
      } else {
        setOtpMsg(data.error || 'Invalid OTP');
      }
    } catch { setOtpMsg('Network error'); } finally { setOtpLoading(false); }
  }

  async function verifyFinishOtp(bookingId) {
    setOtpLoading(true);
    setOtpMsg('');
    const token = localStorage.getItem('vendor-token');
    try {
      const res = await fetch(`/api/bookings/${bookingId}/verify-finish-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ otp: finishOtpInput }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpMsg('✓ Finish OTP verified! Work complete.');
        setFinishOtpInput('');
        fetchVendorData(token);
      } else {
        setOtpMsg(data.error || 'Invalid OTP');
      }
    } catch { setOtpMsg('Network error'); } finally { setOtpLoading(false); }
  }

  async function loadAllServices() {
    if (allServices.length > 0) return;
    try {
      const res = await fetch("/api/quick-services");
      const data = await res.json();
      if (data.success) setAllServices(data.data || data.services || []);
    } catch {
      console.error("Failed to load services list");
    }
  }

  async function saveProfile() {
    setProfileLoading(true);
    setProfileMsg("");
    const token = localStorage.getItem("vendor-token");
    try {
      const res = await fetch("/api/vendor/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...profileForm, services: selectedServices }),
      });
      const data = await res.json();
      if (data.success) {
        setVendorProfile(data.vendor);
        setSelectedServices((data.vendor.services || []).map((s) => s.id));
        setEditMode(false);
        setProfileMsg("Profile updated successfully.");
      } else {
        setProfileMsg(data.error || "Update failed.");
      }
    } catch {
      setProfileMsg("Network error. Please try again.");
    } finally {
      setProfileLoading(false);
    }
  }

  function toggleService(id) {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }
 
  async function acceptBooking(bookingId) {
    const token = localStorage.getItem("vendor-token");
    try {
      const res = await fetch(`/api/bookings/${bookingId}/accept`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSelectedNotification(null);
        setNotifications((n) => n.filter((x) => x.booking_id !== bookingId));
        fetchVendorData(token);
      }
    } catch (error) {
      console.error("Error accepting booking:", error);
    }
  }
 
  async function rejectBooking(bookingId) {
    const token = localStorage.getItem("vendor-token");
    try {
      const res = await fetch(`/api/bookings/${bookingId}/reject`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSelectedNotification(null);
        setNotifications((n) => n.filter((x) => x.booking_id !== bookingId));
      }
    } catch (error) {
      console.error("Error rejecting booking:", error);
    }
  }
 
  async function markComplete() {
    if (!activeBooking) return;
    if (!isQuickJob && !extraAmount) return;
    setCompleteLoading(true);
    const token = localStorage.getItem("vendor-token");
    try {
      const res = await fetch(`/api/bookings/${activeBooking.id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          is_quick_job: isQuickJob,
          extra_amount: isQuickJob ? 0 : parseFloat(extraAmount),
          vendor_note: vendorNote,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowCompleteModal(false);
        setExtraAmount("");
        setVendorNote("");
        setIsQuickJob(true);
        fetchVendorData(token);
      }
    } catch (err) {
      console.error("Complete error:", err);
    } finally {
      setCompleteLoading(false);
    }
  }

  async function updateLocation() {
    if (!activeBooking || !navigator.geolocation) return;
 
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const token = localStorage.getItem("vendor-token");
 
        try {
          const res = await fetch("/api/vendor/location/update", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              booking_id: activeBooking.id,
              latitude,
              longitude
            })
          });
 
          if (res.ok) {
            setVendorLocation({ latitude, longitude });
          }
        } catch (error) {
          console.error("Location update error:", error);
        }
      }
    );
  }
 
  const bg = isDark ? "bg-black text-white" : "bg-white text-zinc-900";
  const card = isDark ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-200";
  const muted = isDark ? "text-zinc-500" : "text-zinc-600";
 
  if (loading) {
    return (
      <main className={`min-h-screen font-serif ${bg} flex items-center justify-center`}>
        <p className={muted}>Loading dashboard...</p>
      </main>
    );
  }
 
  return (
    <main className={`min-h-screen font-serif ${bg} p-6`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-black uppercase">Vendor Dashboard</h1>
            <p className={`text-sm ${muted} mt-1`}>{vendorProfile?.shop_name || "My Shop"} · {vendorProfile?.city || ""}</p>
          </div>
          <div className={`flex border ${isDark ? "border-zinc-800" : "border-zinc-200"} flex-wrap`}>
            {[
              { key: "notifications", label: "📬 Bookings" },
              { key: "history", label: "📋 History" },
              { key: "packages", label: "📦 Package" },
              { key: "profile", label: "👤 Profile" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); if (tab.key === 'packages') loadPackages(); }}
                className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.key
                    ? "bg-[var(--brand-blue)] text-black"
                    : isDark ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
 
        {activeTab === "history" ? (
          /* ── History Tab ── */
          <div className="space-y-4">
            {/* Earnings Summary */}
            <div className={`border ${card} p-5`}>
              <p className="text-[10px] font-black uppercase text-[var(--brand-blue)] tracking-widest mb-4">Earnings Breakdown</p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Your Net Earnings (85%)", value: `₹${totalEarning.toLocaleString('en-IN')}`, color: "text-green-500" },
                  { label: "Admin Commission (15%)", value: `₹${Math.round(completedBookings.reduce((s,b) => s + parseFloat(b.admin_commission||0), 0)).toLocaleString('en-IN')}`, color: "text-[var(--brand-blue)]" },
                  { label: "GST Collected (18%)", value: `₹${Math.round(completedBookings.reduce((s,b) => s + parseFloat(b.gst_amount||0), 0)).toLocaleString('en-IN')}`, color: "text-zinc-400" },
                ].map(({ label, value, color }) => (
                  <div key={label} className={`p-4 border ${isDark ? "border-zinc-800 bg-zinc-900" : "border-zinc-100 bg-zinc-50"}`}>
                    <p className={`text-[9px] font-black uppercase tracking-widest ${muted}`}>{label}</p>
                    <p className={`text-2xl font-black mt-1 ${color}`}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Completed Bookings List */}
            {completedBookings.length === 0 ? (
              <div className={`border ${card} p-10 text-center`}>
                <p className={muted}>No completed bookings yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {completedBookings.map((b) => (
                  <div key={b.id} className={`border ${card} p-5`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        {/* Header */}
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{b.icon}</span>
                          <div>
                            <p className="font-black text-sm">{b.label}</p>
                            <p className={`text-[10px] ${muted}`}>{b.booking_reference} · {b.service_city}</p>
                          </div>
                        </div>

                        {/* Customer */}
                        <div className="flex gap-6">
                          <div>
                            <p className={`text-[9px] font-black uppercase ${muted}`}>Customer</p>
                            <p className="text-sm font-medium">{b.user_name}</p>
                            <p className={`text-[10px] ${muted}`}>{b.user_phone}</p>
                          </div>
                          <div>
                            <p className={`text-[9px] font-black uppercase ${muted}`}>Date</p>
                            <p className="text-sm font-medium">{b.booking_date ? new Date(b.booking_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</p>
                          </div>
                          <div>
                            <p className={`text-[9px] font-black uppercase ${muted}`}>Completed</p>
                            <p className="text-sm font-medium">{b.completed_at ? new Date(b.completed_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}</p>
                          </div>
                        </div>

                        {/* Rating */}
                        {b.rating_stars ? (
                          <div className={`p-3 border-l-2 border-[var(--brand-blue)] ${isDark ? "bg-zinc-900" : "bg-zinc-50"}`}>
                            <div className="flex items-center gap-2">
                              <span className="text-[var(--brand-blue)] font-black">{"★".repeat(b.rating_stars)}{"☆".repeat(5 - b.rating_stars)}</span>
                              <span className={`text-[10px] font-black ${muted}`}>{b.rating_stars}/5</span>
                            </div>
                            {b.review_text && <p className={`text-xs mt-1 ${muted}`}>"{b.review_text}"</p>}
                          </div>
                        ) : (
                          <p className={`text-[10px] ${muted}`}>No rating yet</p>
                        )}
                      </div>

                      {/* Earnings */}
                      <div className={`min-w-35 p-4 border ${isDark ? "border-zinc-800 bg-zinc-900" : "border-zinc-100 bg-zinc-50"} space-y-2`}>
                        <p className={`text-[9px] font-black uppercase tracking-widest ${muted}`}>Earnings</p>
                        <div>
                          <p className={`text-[9px] ${muted}`}>Total Charged</p>
                          <p className="text-sm font-black">₹{b.final_amount || b.total_amount}</p>
                        </div>
                        <div>
                          <p className={`text-[9px] ${muted}`}>− GST (18%)</p>
                          <p className="text-xs text-red-400">− ₹{b.gst_amount}</p>
                        </div>
                        <div>
                          <p className={`text-[9px] ${muted}`}>− Commission (15%)</p>
                          <p className="text-xs text-red-400">− ₹{b.admin_commission}</p>
                        </div>
                        <div className={`border-t pt-2 ${isDark ? "border-zinc-700" : "border-zinc-200"}`}>
                          <p className={`text-[9px] font-black uppercase ${muted}`}>Your Net</p>
                          <p className="text-lg font-black text-green-500">₹{b.vendor_earning}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === "packages" ? (
          /* ── Packages Tab ── */
          <div className={`border ${card} p-6 max-w-2xl`}>
            <p className="text-[10px] font-black uppercase text-[var(--brand-blue)] tracking-widest mb-4">Subscription Packages</p>
            {pkgMsg && <p className="text-xs text-[var(--brand-blue)] font-bold mb-4">{pkgMsg}</p>}
            
            {/* Current Package Status */}
            {pkgStatus && (
              <div className={`p-4 border mb-6 ${isDark ? 'border-green-500/30 bg-green-500/10' : 'border-green-200 bg-green-50'}`}>
                <p className="text-[10px] font-black uppercase tracking-widest text-green-500 mb-2">Current Package</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-base font-black">{pkgStatus.package_name || 'No Plan Active'}</p>
                    <p className={`text-xs ${muted} mt-1`}>
                      {pkgStatus.is_active 
                        ? `Expires in ${pkgStatus.days_remaining} days (${new Date(pkgStatus.package_expires_at).toLocaleDateString('en-IN')})`
                        : pkgStatus.package_status === 'pending'
                          ? '⏳ Pending Admin Approval'
                          : 'No active subscription'
                      }
                    </p>
                  </div>
                  <span className={`badge ${pkgStatus.is_active ? 'badge-verified' : pkgStatus.package_status === 'pending' ? 'badge-pending' : 'badge-inactive'}`}>
                    {pkgStatus.package_status}
                  </span>
                </div>
              </div>
            )}

            {/* Upgrade/Change Packages */}
            <h3 className="text-lg font-black uppercase mb-3">Upgrade Your Plan</h3>
            <div className="space-y-3">
              {pkgList.map(pkg => (
                <div
                  key={pkg.id}
                  className={`p-4 border flex items-center justify-between gap-4 ${isDark ? 'border-zinc-800 bg-zinc-900/40' : 'border-zinc-200 bg-zinc-50'}`}
                >
                  <div>
                    <p className="font-black text-sm">{pkg.name} Plan</p>
                    <p className={`text-xs ${muted} mt-1`}>{pkg.label} · Complete booking lead access</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-sm text-[var(--brand-blue)] mb-2">₹{pkg.price}</p>
                    <button
                      onClick={() => selectPackage(pkg.id)}
                      disabled={pkgLoading || pkgStatus?.package_id === pkg.id}
                      className="px-4 py-2 bg-[var(--brand-blue)] text-black text-[9px] font-black uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--brand-blue-light)]"
                    >
                      {pkgStatus?.package_id === pkg.id ? 'Current' : 'Select Plan'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === "profile" ? (
          /* ── Profile Tab ── */
          <div className={`border ${card} p-6 max-w-2xl`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] font-black uppercase text-[var(--brand-blue)] tracking-widest">Your Profile</p>
                <h2 className="text-2xl font-black uppercase mt-0.5">{vendorProfile?.shop_name || "My Shop"}</h2>
              </div>
              {!editMode && (
                <button
                  onClick={() => { setEditMode(true); loadAllServices(); }}
                  className="px-5 py-2 border border-[var(--brand-blue)] text-[var(--brand-blue)] text-[9px] font-black uppercase tracking-widest hover:bg-[var(--brand-blue)]/10 transition-all"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {profileMsg && (
              <p className={`text-xs mb-4 ${profileMsg.includes("success") ? "text-green-500" : "text-red-400"}`}>{profileMsg}</p>
            )}

            {editMode ? (
              <div className="space-y-4">
                {[
                  { label: "Shop Name", key: "shop_name", placeholder: "Your business name" },
                  { label: "Phone", key: "phone", placeholder: "10-digit mobile number" },
                  { label: "City", key: "city", placeholder: "Operating city" },
                  { label: "State", key: "state", placeholder: "State" },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className={`block text-[9px] font-black uppercase tracking-widest mb-1.5 ${muted}`}>{label}</label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2.5 text-sm border outline-none transition-all ${isDark ? "bg-zinc-900 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-300 text-zinc-900"}`}
                      placeholder={placeholder}
                      value={profileForm[key]}
                      onChange={(e) => setProfileForm((f) => ({ ...f, [key]: e.target.value }))}
                    />
                  </div>
                ))}
                <div>
                  <label className={`block text-[9px] font-black uppercase tracking-widest mb-1.5 ${muted}`}>About / Description</label>
                  <textarea
                    rows={3}
                    className={`w-full px-3 py-2.5 text-sm border outline-none resize-none transition-all ${isDark ? "bg-zinc-900 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-300 text-zinc-900"}`}
                    placeholder="Describe your services..."
                    value={profileForm.description}
                    onChange={(e) => setProfileForm((f) => ({ ...f, description: e.target.value }))}
                  />
                </div>

                {/* Services selection */}
                <div>
                  <label className={`block text-[9px] font-black uppercase tracking-widest mb-2 ${muted}`}>Services You Provide</label>
                  {allServices.length === 0 ? (
                    <p className={`text-xs ${muted}`}>Loading services...</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {allServices.map((svc) => (
                        <label
                          key={svc.id}
                          className={`flex items-center gap-2 p-2 border cursor-pointer transition-all ${
                            selectedServices.includes(svc.id)
                              ? "border-[var(--brand-blue)] bg-[var(--brand-blue)]/10"
                              : isDark ? "border-zinc-800 hover:border-zinc-600" : "border-zinc-200 hover:border-zinc-300"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedServices.includes(svc.id)}
                            onChange={() => toggleService(svc.id)}
                            className="accent-[var(--brand-blue)]"
                          />
                          <span className="text-xs">{svc.icon} {svc.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => { setEditMode(false); setProfileMsg(""); }}
                    className={`flex-1 py-2.5 border text-[9px] font-black uppercase ${isDark ? "border-zinc-700 text-zinc-400" : "border-zinc-300 text-zinc-500"} hover:border-red-400 hover:text-red-400 transition-all`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveProfile}
                    disabled={profileLoading}
                    className="flex-1 py-2.5 bg-[var(--brand-blue)] text-black text-[9px] font-black uppercase tracking-widest hover:bg-[var(--brand-blue-light)] transition-all disabled:opacity-50"
                  >
                    {profileLoading ? "Saving..." : "Save Changes →"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  { label: "Email", value: vendorProfile?.email },
                  { label: "Phone", value: vendorProfile?.phone },
                  { label: "City", value: vendorProfile?.city },
                  { label: "State", value: vendorProfile?.state },
                  { label: "Account Status", value: vendorProfile?.is_approved ? "✅ Approved" : "⏳ Pending Approval" },
                  { label: "Verification", value: vendorProfile?.verification_status },
                  { label: "Member Since", value: vendorProfile?.created_at ? new Date(vendorProfile.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : "—" },
                ].map(({ label, value }) => (
                  <div key={label} className={`flex justify-between py-2 border-b ${isDark ? "border-zinc-800" : "border-zinc-100"}`}>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${muted}`}>{label}</span>
                    <span className="text-sm font-medium">{value || "—"}</span>
                  </div>
                ))}
                {vendorProfile?.description && (
                  <div className={`p-3 ${isDark ? "bg-zinc-900" : "bg-zinc-50"}`}>
                    <p className={`text-[9px] font-black uppercase ${muted} mb-1`}>About</p>
                    <p className="text-sm">{vendorProfile.description}</p>
                  </div>
                )}

                {/* Services provided */}
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${muted}`}>Services Provided</p>
                  {vendorProfile?.services?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {vendorProfile.services.map((svc) => (
                        <span
                          key={svc.id}
                          className={`px-3 py-1 text-xs font-medium border ${isDark ? "border-zinc-700 bg-zinc-900" : "border-zinc-200 bg-zinc-50"}`}
                        >
                          {svc.icon} {svc.label}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className={`text-xs ${muted}`}>
                      No services assigned yet.{" "}
                      <button
                        onClick={() => { setEditMode(true); loadAllServices(); }}
                        className="text-[var(--brand-blue)] underline"
                      >
                        Add services
                      </button>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
        <>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className={`p-6 border ${card}`}>
            <p className="text-[10px] font-black uppercase text-[var(--brand-blue)] tracking-widest">Pending</p>
            <p className="text-3xl font-black mt-2">{notifications.length}</p>
            <p className={`text-[10px] ${muted} mt-1`}>Incoming requests</p>
          </div>
 
          <div className={`p-6 border ${card}`}>
            <p className="text-[10px] font-black uppercase text-[var(--brand-blue)] tracking-widest">Active</p>
            <p className="text-3xl font-black mt-2">{activeBooking ? 1 : 0}</p>
            <p className={`text-[10px] ${muted} mt-1`}>Current booking</p>
          </div>
 
          <div className={`p-6 border ${card}`}>
            <p className="text-[10px] font-black uppercase text-[var(--brand-blue)] tracking-widest">Completed</p>
            <p className="text-3xl font-black mt-2">{completedCount}</p>
            <p className={`text-[10px] ${muted} mt-1`}>Total jobs</p>
          </div>
 
          <div className={`p-6 border ${card}`}>
            <p className="text-[10px] font-black uppercase text-[var(--brand-blue)] tracking-widest">Your Earnings</p>
            <p className="text-3xl font-black mt-2">₹{totalEarning.toLocaleString('en-IN')}</p>
            <p className={`text-[10px] ${muted} mt-1`}>After GST + commission</p>
          </div>
        </div>
 
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notifications / Incoming Requests */}
          <div className="lg:col-span-2">
            <div className={`border ${card} p-6`}>
              <h2 className="text-xl font-black uppercase mb-4">📬 Incoming Requests ({notifications.length})</h2>
 
              {notifications.length === 0 ? (
                <p className={`${muted} text-center py-8`}>No new booking requests</p>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <button
                      key={notif.booking_id}
                      onClick={() => setSelectedNotification(notif)}
                      className={`w-full text-left p-4 border transition-all ${selectedNotification?.booking_id === notif.booking_id
                        ? "border-[var(--brand-blue)] bg-[var(--brand-blue)]/5"
                        : isDark
                          ? "border-zinc-800 hover:border-zinc-700"
                          : "border-zinc-200 hover:border-zinc-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-black text-[var(--brand-blue)]">{notif.label} 📍 {notif.service_city}</p>
                          <p className={`text-sm ${muted} mt-1`}>📞 {notif.user_phone}</p>
                          <p className="text-[10px] text-green-500 mt-1">₹{notif.base_amount} base + ₹{notif.total_amount - notif.base_amount} (fees & tax)</p>
                        </div>
                        <span className="text-2xl">{notif.icon}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
 
          {/* Details Panel */}
          <div className={`border ${card} p-6 h-fit`}>
            {selectedNotification ? (
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black uppercase text-[var(--brand-blue)]">Customer</p>
                  <p className="font-black">{selectedNotification.user_name}</p>
                  <p className={`text-[10px] ${muted}`}>{selectedNotification.user_phone}</p>
                </div>
 
                <div>
                  <p className="text-[10px] font-black uppercase text-[var(--brand-blue)]">Location</p>
                  <p className="text-sm font-medium">{selectedNotification.service_address}</p>
                  {selectedNotification.location_map_url && (
                    <a href={selectedNotification.location_map_url} target="_blank" className="text-[10px] text-[var(--brand-blue)] hover:underline mt-1 inline-block">
                      📍 View on Map
                    </a>
                  )}
                </div>
 
                <div>
                  <p className="text-[10px] font-black uppercase text-[var(--brand-blue)]">Details</p>
                  <p className="text-sm">{selectedNotification.service_description || "No description"}</p>
                </div>
 
                <div>
                  <p className="text-[10px] font-black uppercase text-[var(--brand-blue)]">Date & Time</p>
                  <p className="text-sm">{selectedNotification.booking_date} • {selectedNotification.booking_time}</p>
                </div>
 
                <div className="flex gap-2">
                  <button
                    onClick={() => rejectBooking(selectedNotification.booking_id)}
                    className="flex-1 py-2.5 border border-red-500 text-red-500 text-[9px] font-black uppercase hover:bg-red-50 transition-all"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => acceptBooking(selectedNotification.booking_id)}
                    className="flex-1 py-2.5 bg-[var(--brand-blue)] text-black text-[9px] font-black uppercase hover:bg-[var(--brand-blue-light)] transition-all"
                  >
                    Accept →
                  </button>
                </div>
              </div>
            ) : (
              <p className={`${muted} text-center py-8`}>Select a request to view details</p>
            )}
          </div>
        </div>
 
        {/* Active Booking */}
        {activeBooking && (
          <div className={`border ${card} p-6 mt-6`}>
            <h2 className="text-xl font-black uppercase mb-4">🚀 Active Booking</h2>
 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-black uppercase text-[var(--brand-blue)]">Reference</p>
                  <p className="font-black text-lg">{activeBooking.booking_reference}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-[var(--brand-blue)]">Customer</p>
                  <p className="font-medium">{activeBooking.user_name}</p>
                  <p className={`text-[10px] ${muted}`}>{activeBooking.user_phone}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-[var(--brand-blue)]">Address</p>
                  <p className="text-sm">{activeBooking.service_address}</p>
                  <a href={activeBooking.location_map_url} target="_blank" className="text-[10px] text-[var(--brand-blue)] hover:underline mt-1 inline-block">
                    📍 Open in Maps
                  </a>
                </div>
              </div>
 
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-black uppercase text-[var(--brand-blue)]">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-3 h-3 rounded-full animate-pulse ${activeBooking.status === 'AWAITING_PAYMENT' ? 'bg-green-500' : activeBooking.status === 'IN_PROGRESS' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                    <p className={`font-black uppercase ${activeBooking.status === 'AWAITING_PAYMENT' ? 'text-green-500' : activeBooking.status === 'IN_PROGRESS' ? 'text-orange-500' : 'text-blue-500'}`}>
                      {activeBooking.status === 'AWAITING_PAYMENT' ? 'Work Done · Awaiting Payment' : activeBooking.status === 'IN_PROGRESS' ? 'Service In Progress' : activeBooking.status}
                    </p>
                  </div>
                </div>

                {otpMsg && <p className={`text-xs font-bold ${otpMsg.includes('✓') ? 'text-green-500' : 'text-red-400'}`}>{otpMsg}</p>}

                {/* OTP Start Flow - Vendor enters start OTP to begin */}
                {(activeBooking.status === 'VENDOR_ACCEPTED' || activeBooking.status === 'VENDOR_ON_WAY') && !activeBooking.start_otp_verified && (
                  <div className={`p-4 border ${isDark ? 'border-blue-500/30 bg-blue-500/10' : 'border-blue-200 bg-blue-50'}`}>
                    <p className="text-[9px] font-black uppercase text-blue-400 tracking-widest mb-2">🔑 Enter Start OTP</p>
                    <p className={`text-[10px] mb-3 ${muted}`}>Ask customer for the 4-digit Start OTP to begin service</p>
                    <div className="flex gap-2">
                      <input
                        type="text" maxLength={4} placeholder="Enter 4-digit OTP"
                        className={`flex-1 px-3 py-2.5 text-center text-lg font-black tracking-[0.3em] border outline-none ${isDark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`}
                        value={startOtpInput}
                        onChange={(e) => setStartOtpInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      />
                      <button
                        onClick={() => verifyStartOtp(activeBooking.id)}
                        disabled={startOtpInput.length !== 4 || otpLoading}
                        className="px-6 py-2.5 bg-blue-500 text-white text-[9px] font-black uppercase tracking-widest disabled:opacity-50"
                      >
                        {otpLoading ? '...' : 'Verify'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Service In Progress - Vendor enters finish OTP */}
                {activeBooking.status === 'IN_PROGRESS' && (
                  <div className={`p-4 border ${isDark ? 'border-orange-500/30 bg-orange-500/10' : 'border-orange-200 bg-orange-50'}`}>
                    <p className="text-[9px] font-black uppercase text-orange-400 tracking-widest mb-2">🏁 Enter Finish OTP</p>
                    <p className={`text-[10px] mb-3 ${muted}`}>When work is done, ask customer for Finish OTP to complete service</p>
                    <div className="flex gap-2">
                      <input
                        type="text" maxLength={4} placeholder="Enter 4-digit OTP"
                        className={`flex-1 px-3 py-2.5 text-center text-lg font-black tracking-[0.3em] border outline-none ${isDark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`}
                        value={finishOtpInput}
                        onChange={(e) => setFinishOtpInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      />
                      <button
                        onClick={() => verifyFinishOtp(activeBooking.id)}
                        disabled={finishOtpInput.length !== 4 || otpLoading}
                        className="px-6 py-2.5 bg-orange-500 text-white text-[9px] font-black uppercase tracking-widest disabled:opacity-50"
                      >
                        {otpLoading ? '...' : 'Verify'}
                      </button>
                    </div>
                  </div>
                )}

                {activeBooking.status === 'AWAITING_PAYMENT' ? (
                  <div className={`w-full py-4 text-center border border-green-500/30 ${isDark ? 'bg-green-500/10' : 'bg-green-50'}`}>
                    <p className="text-green-500 text-[10px] font-black uppercase tracking-widest">✓ Work Marked Complete</p>
                    <p className={`text-xs mt-1 ${muted}`}>Waiting for customer to confirm payment</p>
                    {activeBooking.final_amount && (
                      <p className="text-green-500 font-black text-lg mt-2">₹{activeBooking.final_amount}</p>
                    )}
                  </div>
                ) : activeBooking.status !== 'IN_PROGRESS' ? (
                  <>
                    <button
                      onClick={updateLocation}
                      className="w-full py-2.5 border border-[var(--brand-blue)] text-[var(--brand-blue)] text-[9px] font-black uppercase hover:bg-[var(--brand-blue)]/10 transition-all"
                    >
                      📍 Update My Location
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        )}
        </>
        )}
      </div>

      {/* ── Mark Complete Modal ── */}
      {showCompleteModal && activeBooking && (
        <div className="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setShowCompleteModal(false)}>
          <div className={`w-full max-w-sm border shadow-2xl ${isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"}`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${isDark ? "border-zinc-800" : "border-zinc-100"}`}>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--brand-blue)]">Mark Complete</p>
                <h3 className="text-base font-black uppercase">{activeBooking.label}</h3>
              </div>
              <button onClick={() => setShowCompleteModal(false)}
                className={`w-8 h-8 border flex items-center justify-center font-black text-sm transition-all ${isDark ? "border-zinc-700 text-zinc-400 hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]" : "border-zinc-300 text-zinc-400 hover:border-zinc-900"}`}>
                ✕
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* Customer info */}
              <div className={`px-4 py-3 border ${isDark ? "border-zinc-800 bg-zinc-900" : "border-zinc-100 bg-zinc-50"}`}>
                <p className={`text-[9px] uppercase font-black tracking-widest ${muted}`}>Customer</p>
                <p className={`font-bold text-sm ${isDark ? "text-white" : "text-zinc-900"}`}>{activeBooking.user_name}</p>
                <p className={`text-[10px] ${muted}`}>{activeBooking.booking_reference} · Base: ₹{activeBooking.base_amount}</p>
              </div>

              {/* Job type toggle */}
              <div>
                <label className={`block text-[9px] font-black uppercase tracking-widest mb-2 ${muted}`}>Job Duration</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setIsQuickJob(true)}
                    className={`py-3 text-[10px] font-black uppercase border transition-all ${isQuickJob ? "bg-[var(--brand-blue)] border-[var(--brand-blue)] text-black" : isDark ? "border-zinc-700 text-zinc-400" : "border-zinc-300 text-zinc-500"}`}>
                    ⚡ Within 15 mins
                  </button>
                  <button type="button" onClick={() => setIsQuickJob(false)}
                    className={`py-3 text-[10px] font-black uppercase border transition-all ${!isQuickJob ? "bg-[var(--brand-blue)] border-[var(--brand-blue)] text-black" : isDark ? "border-zinc-700 text-zinc-400" : "border-zinc-300 text-zinc-500"}`}>
                    🕐 More than 15 mins
                  </button>
                </div>
              </div>

              {/* Earnings preview */}
              {isQuickJob ? (
                <div className={`px-4 py-3 border border-green-500/30 ${isDark ? "bg-green-500/10" : "bg-green-50"}`}>
                  <p className="text-[9px] font-black uppercase text-green-500 mb-2">Earnings Preview</p>
                  <div className="flex justify-between text-xs">
                    <span className={muted}>Total charged</span>
                    <span className="font-bold">₹{activeBooking.base_amount}</span>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className={muted}>Admin (50%)</span>
                    <span className="text-red-400">₹{Math.round(activeBooking.base_amount * 0.5)}</span>
                  </div>
                  <div className="flex justify-between text-xs mt-1 font-black">
                    <span>Your earning (50%)</span>
                    <span className="text-green-500">₹{Math.round(activeBooking.base_amount * 0.5)}</span>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className={`block text-[9px] font-black uppercase tracking-widest mb-1.5 ${muted}`}>Extra Amount Beyond Base (₹) *</label>
                    <input type="number" min="0"
                      className={`w-full px-3 py-2.5 text-sm border outline-none transition-all ${isDark ? "bg-zinc-900 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-300 text-zinc-900"}`}
                      placeholder="Amount charged above ₹150 base"
                      value={extraAmount}
                      onChange={(e) => setExtraAmount(e.target.value)}
                    />
                  </div>
                  {extraAmount > 0 && (
                    <div className={`px-4 py-3 border border-[var(--brand-blue)]/30 ${isDark ? "bg-sky-500/10" : "bg-sky-50"}`}>
                      <p className="text-[9px] font-black uppercase text-[var(--brand-blue)] mb-2">Earnings Preview</p>
                      <div className="flex justify-between text-xs"><span className={muted}>Base (admin)</span><span className="text-red-400">₹{activeBooking.base_amount}</span></div>
                      <div className="flex justify-between text-xs mt-1"><span className={muted}>Extra charged</span><span>₹{extraAmount}</span></div>
                      <div className="flex justify-between text-xs mt-1"><span className={muted}>GST on extra (18%)</span><span className="text-red-400">−₹{Math.round(extraAmount * 0.18)}</span></div>
                      <div className="flex justify-between text-xs mt-1"><span className={muted}>Commission on extra (15%)</span><span className="text-red-400">−₹{Math.round(extraAmount * 0.15)}</span></div>
                      <div className="flex justify-between text-xs mt-1 font-black border-t pt-1" style={{ borderColor: isDark ? '#3f3f46' : '#e4e4e7' }}>
                        <span>Your earning (67% of extra)</span>
                        <span className="text-green-500">₹{Math.round(extraAmount * 0.67)}</span>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Note */}
              <div>
                <label className={`block text-[9px] font-black uppercase tracking-widest mb-1.5 ${muted}`}>Note for Customer (optional)</label>
                <textarea rows={2}
                  className={`w-full px-3 py-2.5 text-sm border outline-none resize-none transition-all ${isDark ? "bg-zinc-900 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-300 text-zinc-900"}`}
                  placeholder="Any work notes..."
                  value={vendorNote}
                  onChange={(e) => setVendorNote(e.target.value)}
                />
              </div>

              <button onClick={markComplete} disabled={completeLoading || (!isQuickJob && !extraAmount)}
                className="w-full py-3 bg-[var(--brand-blue)] text-black text-[9px] font-black uppercase tracking-[0.3em] hover:bg-[var(--brand-blue-light)] transition-all disabled:opacity-50">
                {completeLoading ? "Submitting..." : "Confirm Completion →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
 
