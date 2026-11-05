'use client';
import RequiredAsterisk from '../components/RequiredAsterisk';

import { Suspense, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { redirectToPayU } from '@/lib/payu-client';
import QuickServiceIcon from '../components/QuickServiceIcon';
import MaterialOrdersPanel from '@/app/components/MaterialOrdersPanel';
import JobApplicationsPanel from '@/app/components/JobApplicationsPanel';
import PanelLayout from '@/app/components/PanelLayout';
import {
  LayoutDashboard,
  Zap,
  History,
  HardHat,
  House,
  ShoppingCart,
  Briefcase,
  User,
  RefreshCw,
  Plus,
  Phone,
  Clock,
  CalendarDays,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  LogOut,
  Mail,
  Star,
  ChevronRight,
  ShieldCheck,
  Save,
} from '@/app/components/ui/icons';

// ── Status config ──────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  WAITING_FOR_VENDOR_ACCEPTANCE: { label: 'Searching Vendor', color: 'text-amber-500 border-amber-500/30', bg: 'bg-amber-500/10', pulse: true },
  WAITING_FOR_ADMIN_ASSIGNMENT:  { label: 'Admin Assigning Vendor', color: 'text-orange-500 border-orange-500/30', bg: 'bg-orange-500/10', pulse: true },
  ADMIN_ACCEPTED:                { label: 'Accepted by Admin', color: 'text-orange-500 border-orange-500/30', bg: 'bg-orange-500/10', pulse: true },
  VENDOR_ACCEPTED:               { label: 'Vendor On The Way', color: 'text-emerald-500 border-emerald-500/30', bg: 'bg-emerald-500/10', pulse: false },
  VENDOR_ON_WAY:                 { label: 'Vendor On The Way', color: 'text-emerald-500 border-emerald-500/30', bg: 'bg-emerald-500/10', pulse: false },
  IN_PROGRESS:                   { label: 'Work In Progress', color: 'text-sky-500 border-sky-500/30', bg: 'bg-sky-500/10', pulse: false },
  AWAITING_PAYMENT:              { label: 'Awaiting Payment', color: 'text-amber-500 border-amber-500/30', bg: 'bg-amber-500/10', pulse: true },
  COMPLETED:                     { label: 'Completed', color: 'text-zinc-400 border-zinc-500/30', bg: 'bg-zinc-500/10', pulse: false },
  CANCELLED:                     { label: 'Cancelled', color: 'text-red-500 border-red-500/30', bg: 'bg-red-500/10', pulse: false },
};

const PRIMARY_SERVICE_STAGES = ['Pending', 'Site Visit', 'Estimate', 'Planning', 'Work Start', 'Complete'];

// ── Payment Modal ─────────────────────────────────────────────────────────────
function PaymentModal({ booking, isDark, onClose }) {
  const [amount] = useState(String(booking.final_amount || booking.total_amount || ''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleConfirm() {
    if (!amount) { setError('Payable amount is unavailable'); return; }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/bookings/${booking.id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success && data.payment) redirectToPayU(data.payment);
      else if (data.success && data.completed) window.location.reload();
      else setError(data.error || 'Failed to start payment');
    } catch { setError('Something went wrong. Try again.'); }
    finally { setLoading(false); }
  }

  const modal   = isDark ? 'bg-zinc-900 border-zinc-700 text-white shadow-2xl' : 'bg-white border-slate-200 text-slate-900 shadow-2xl';
  const inp     = isDark ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400';
  const muted   = isDark ? 'text-zinc-400' : 'text-slate-500';
  const divider = isDark ? 'border-zinc-800' : 'border-slate-100';

  return (
    <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`w-full max-w-sm rounded-2xl border ${modal}`}>
        <div className={`flex items-center justify-between px-6 py-5 border-b ${divider}`}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#0284c7]">Confirm Payment</p>
            <h3 className="text-base font-bold tracking-tight mt-0.5">{booking.service_label}</h3>
          </div>
          <button onClick={onClose} className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-sm transition-all ${isDark ? 'border-zinc-700 text-zinc-400 hover:border-[#0284c7] hover:text-[#0284c7]' : 'border-slate-200 text-slate-500 hover:border-slate-400'}`}>✕</button>
        </div>
        <div className="p-6 space-y-4">
          <div className={`px-4 py-3 rounded-xl border ${isDark ? 'border-zinc-800 bg-zinc-950/50' : 'border-slate-100 bg-slate-50'}`}>
            <p className={`text-[10px] uppercase font-bold tracking-wider ${muted}`}>Quoted Final Amount</p>
            <p className="text-2xl font-black text-[#0284c7] mt-0.5">₹{booking.final_amount || booking.total_amount}</p>
          </div>

          <div>
            <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${muted}`}>Amount Payable via PayU (₹)</label>
            <input
              type="number"
              className={`w-full px-3.5 py-2.5 text-sm rounded-lg border outline-none font-semibold transition-all ${inp}`}
              placeholder={`e.g. ${booking.final_amount || booking.total_amount}`}
              value={amount}
              readOnly
            />
          </div>

          {error && <p className="text-xs text-red-500 font-bold">{error}</p>}

          <button onClick={handleConfirm} disabled={loading}
            className="w-full py-3 bg-[#0284c7] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#0369a1] transition-all disabled:opacity-50 shadow-md">
            {loading ? 'Opening PayU...' : 'Pay Online with PayU'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Rating Modal ──────────────────────────────────────────────────────────────
function SubRating({ label, value, onChange, isDark, muted }) {
  return (
    <div className="flex items-center justify-between">
      <p className={`text-xs font-semibold ${muted}`}>{label}</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button key={s} type="button" onClick={() => onChange(s)}
            className={`text-xl transition-transform hover:scale-110 ${s <= value ? 'text-amber-400' : isDark ? 'text-zinc-700' : 'text-slate-200'}`}>★</button>
        ))}
      </div>
    </div>
  );
}

function RatingModal({ booking, isDark, onClose, onSuccess }) {
  const [stars, setStars]                     = useState(0);
  const [hover, setHover]                     = useState(0);
  const [review, setReview]                   = useState('');
  const [cleanliness, setCleanliness]         = useState(0);
  const [professionalism, setProfessionalism] = useState(0);
  const [punctuality, setPunctuality]         = useState(0);
  const [recommend, setRecommend]             = useState(false);
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState('');

  async function handleSubmit() {
    if (!stars) { setError('Please select an overall star rating'); return; }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/bookings/${booking.id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          rating_stars: stars,
          review_text: review,
          cleanliness_rating: cleanliness || stars,
          professionalism_rating: professionalism || stars,
          punctuality_rating: punctuality || stars,
          would_recommend: recommend,
        }),
      });
      const data = await res.json();
      if (data.success) onSuccess();
      else setError(data.error || 'Failed to submit rating');
    } catch { setError('Something went wrong. Try again.'); }
    finally { setLoading(false); }
  }

  const modal   = isDark ? 'bg-zinc-900 border-zinc-700 text-white shadow-2xl' : 'bg-white border-slate-200 text-slate-900 shadow-2xl';
  const inp     = isDark ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400';
  const muted   = isDark ? 'text-zinc-400' : 'text-slate-500';
  const divider = isDark ? 'border-zinc-800' : 'border-slate-100';
  const LABELS  = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  return (
    <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`w-full max-w-sm rounded-2xl border ${modal}`} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div className={`flex items-center justify-between px-6 py-5 border-b ${divider}`}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#0284c7]">Feedback</p>
            <h3 className="text-base font-bold tracking-tight mt-0.5">Rate Your Experience</h3>
          </div>
          <button onClick={onClose} className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-sm ${isDark ? 'border-zinc-700 text-zinc-400 hover:border-zinc-500' : 'border-slate-200 text-slate-500'}`}>✕</button>
        </div>

        <div className="p-6 space-y-5">
          {booking.vendor_shop_name && (
            <p className={`text-xs ${muted}`}>Service Provider: <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{booking.vendor_shop_name}</span></p>
          )}

          {/* Overall Stars */}
          <div className="text-center">
            <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${muted}`}>Overall Rating <RequiredAsterisk /></p>
            <div className="flex justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} type="button"
                  onClick={() => setStars(s)}
                  onMouseEnter={() => setHover(s)}
                  onMouseLeave={() => setHover(0)}
                  className={`text-3xl transition-transform hover:scale-115 ${s <= (hover || stars) ? 'text-amber-400' : isDark ? 'text-zinc-700' : 'text-slate-200'}`}>★</button>
              ))}
            </div>
            {(hover || stars) > 0 && (
              <p className="text-xs font-bold text-amber-500 mt-1 uppercase tracking-wider">{LABELS[hover || stars]}</p>
            )}
          </div>

          {/* Category Ratings */}
          <div className={`space-y-3 p-4 rounded-xl border ${divider} ${isDark ? 'bg-zinc-950/40' : 'bg-slate-50/50'}`}>
            <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${muted}`}>Category Ratings</p>
            <SubRating label="Cleanliness"     value={cleanliness}     onChange={setCleanliness}     isDark={isDark} muted={muted} />
            <SubRating label="Professionalism"  value={professionalism}  onChange={setProfessionalism}  isDark={isDark} muted={muted} />
            <SubRating label="Punctuality"      value={punctuality}      onChange={setPunctuality}      isDark={isDark} muted={muted} />
          </div>

          {/* Review Text */}
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${muted}`}>Write a Review (optional)</label>
            <textarea rows={3} className={`w-full px-3.5 py-2.5 text-sm rounded-xl border outline-none resize-none transition-all ${inp}`}
              placeholder="How was the service? Any suggestions?" value={review} onChange={(e) => setReview(e.target.value)} />
          </div>

          {/* Would Recommend */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={recommend} onChange={(e) => setRecommend(e.target.checked)} className="w-4 h-4 rounded text-[#0284c7] accent-[#0284c7]" />
            <span className={`text-xs font-semibold ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>I would recommend this provider to others</span>
          </label>

          {error && <p className="text-xs text-red-500 font-bold">{error}</p>}

          <button onClick={handleSubmit} disabled={loading || !stars}
            className="w-full py-3 bg-[#0284c7] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#0369a1] transition-all disabled:opacity-50 shadow-md">
            {loading ? 'Submitting...' : 'Submit Review ★'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Primary Service Review Modal ──────────────────────────────────────────────
function PrimaryServiceReviewModal({ enquiry, isDark, onClose, onSuccess }) {
  const [stars, setStars]   = useState(enquiry.rating_stars || 0);
  const [hover, setHover]   = useState(0);
  const [review, setReview] = useState(enquiry.review_text || '');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const modal   = isDark ? 'bg-zinc-900 border-zinc-700 text-white shadow-2xl' : 'bg-white border-slate-200 text-slate-900 shadow-2xl';
  const inp     = isDark ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400';
  const muted   = isDark ? 'text-zinc-400' : 'text-slate-500';
  const divider = isDark ? 'border-zinc-800' : 'border-slate-100';

  function handlePhotos(fileList) {
    const selected = Array.from(fileList || []);
    if (selected.length > 10) {
      setError('Maximum 10 site photos allowed.');
      setPhotos([]);
      return;
    }
    setError('');
    setPhotos(selected);
  }

  async function handleSubmit() {
    if (!stars) { setError('Please select a star rating.'); return; }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = new FormData();
      payload.append('enquiry_id', enquiry.id);
      payload.append('rating_stars', stars);
      payload.append('review_text', review);
      photos.forEach((file) => payload.append('site_photos', file));

      const res = await fetch('/api/user/primary-services', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });
      const data = await res.json();
      if (data.success) onSuccess();
      else setError(data.error || 'Failed to submit review.');
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`w-full max-w-md rounded-2xl border ${modal}`} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div className={`flex items-center justify-between px-6 py-5 border-b ${divider}`}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#0284c7]">Construction Service</p>
            <h3 className="text-base font-bold tracking-tight mt-0.5">{enquiry.service_title}</h3>
          </div>
          <button onClick={onClose} className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-sm ${isDark ? 'border-zinc-700 text-zinc-400 hover:border-zinc-500' : 'border-slate-200 text-slate-500'}`}>✕</button>
        </div>
        <div className="p-6 space-y-5">
          <div className="text-center">
            <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${muted}`}>Overall Rating <RequiredAsterisk /></p>
            <div className="flex justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} type="button"
                  onClick={() => setStars(s)}
                  onMouseEnter={() => setHover(s)}
                  onMouseLeave={() => setHover(0)}
                  className={`text-3xl transition-transform hover:scale-115 ${s <= (hover || stars) ? 'text-amber-400' : isDark ? 'text-zinc-700' : 'text-slate-200'}`}>
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${muted}`}>Review Feedback</label>
            <textarea rows={3} className={`w-full px-3.5 py-2.5 text-sm rounded-xl border outline-none resize-none ${inp}`}
              placeholder="Share your project and site work experience..." value={review} onChange={(e) => setReview(e.target.value)} />
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${muted}`}>Upload Site Photos (Optional)</label>
            <input type="file" multiple accept="image/jpeg,image/png,image/webp" className={`w-full px-3 py-2 text-xs rounded-xl border ${inp}`}
              onChange={(e) => handlePhotos(e.target.files)} />
            {photos.length > 0 && <p className={`mt-2 text-xs font-bold ${muted}`}>{photos.length} photo(s) selected</p>}
          </div>

          {error && <p className="text-xs text-red-500 font-bold">{error}</p>}
          <button onClick={handleSubmit} disabled={loading || !stars}
            className="w-full py-3 bg-[#0284c7] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#0369a1] transition-all disabled:opacity-50 shadow-md">
            {loading ? 'Submitting...' : 'Submit Review ★'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Primary Service Card ──────────────────────────────────────────────────────
function PrimaryServiceCard({ enquiry, isDark, onReview }) {
  const muted = isDark ? 'text-zinc-400' : 'text-slate-500';
  const text  = isDark ? 'text-zinc-200' : 'text-slate-800';
  const card  = isDark ? 'bg-zinc-900/60 border-zinc-800 shadow-sm' : 'bg-white border-slate-200 shadow-xs';
  const activeIndex = Math.max(0, PRIMARY_SERVICE_STAGES.indexOf(enquiry.status));
  const sitePhotos = Array.isArray(enquiry.site_image_urls) ? enquiry.site_image_urls : [];

  return (
    <div className={`rounded-xl border p-5 ${card}`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className={`font-bold tracking-tight text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>{enquiry.service_title}</h3>
          <p className={`text-xs mt-0.5 ${muted}`}>{new Date(enquiry.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-bold tracking-wide bg-[#0284c7]/10 text-[#0284c7] border border-[#0284c7]/20">
          {enquiry.status}
        </span>
      </div>

      {/* Stage progress */}
      <div className="grid grid-cols-6 gap-1.5 mb-5">
        {PRIMARY_SERVICE_STAGES.map((stage, index) => {
          const done = index <= activeIndex;
          return (
            <div key={stage} className="min-w-0">
              <div className={`h-1.5 rounded-full mb-1.5 ${done ? 'bg-[#0284c7]' : isDark ? 'bg-zinc-800' : 'bg-slate-200'}`} />
              <p className={`text-[10px] font-bold truncate leading-tight ${done ? 'text-[#0284c7]' : muted}`}>{stage}</p>
            </div>
          );
        })}
      </div>

      <div className={`grid grid-cols-2 gap-x-4 gap-y-3 text-xs mb-4 ${muted}`}>
        <div><span className="font-bold text-[10px] uppercase tracking-wider block">Budget</span><p className={`${text} font-medium mt-0.5`}>{enquiry.budget || 'Not shared'}</p></div>
        <div><span className="font-bold text-[10px] uppercase tracking-wider block">Meeting</span><p className={`${text} font-medium mt-0.5`}>{enquiry.meeting_date ? new Date(enquiry.meeting_date).toLocaleDateString('en-IN') : 'Not scheduled'}</p></div>
        <div className="col-span-2"><span className="font-bold text-[10px] uppercase tracking-wider block">Address</span><p className={`${text} font-medium mt-0.5`}>{enquiry.address || 'Not shared'}</p></div>
        {enquiry.message && <div className="col-span-2"><span className="font-bold text-[10px] uppercase tracking-wider block">Details</span><p className={`${text} font-medium mt-0.5`}>{enquiry.message}</p></div>}
      </div>

      <div className={`border-t pt-3.5 ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
        {enquiry.status === 'Complete' && !enquiry.rating_stars && (
          <button onClick={() => onReview(enquiry)}
            className="px-4 py-2 rounded-lg bg-[#0284c7]/10 text-[#0284c7] hover:bg-[#0284c7]/20 text-xs font-bold tracking-wide transition-colors">
            Add Review + Site Photos
          </button>
        )}
        {enquiry.rating_stars && (
          <div>
            <p className="text-amber-400 text-sm">{'★'.repeat(enquiry.rating_stars)}{'☆'.repeat(5 - enquiry.rating_stars)}</p>
            {enquiry.review_text && <p className={`text-xs mt-1.5 ${muted}`}>{enquiry.review_text}</p>}
            {sitePhotos.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {sitePhotos.slice(0, 6).map((url, index) => (
                  <a key={url} href={url} target="_blank" rel="noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Site photo ${index + 1}`} className="w-16 h-16 object-cover rounded-lg border border-slate-300 dark:border-zinc-700" />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Booking Card ──────────────────────────────────────────────────────────────
function BookingCard({ booking, isDark, onPayment, onRate, onRefresh }) {
  const st      = STATUS_CONFIG[booking.status] || STATUS_CONFIG.WAITING_FOR_VENDOR_ACCEPTANCE;
  const card    = isDark ? 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs';
  const muted   = isDark ? 'text-zinc-400' : 'text-slate-500';
  const text    = isDark ? 'text-zinc-200' : 'text-slate-800';
  const divider = isDark ? 'border-zinc-800' : 'border-slate-100';

  const [loadingOtp, setLoadingOtp] = useState(false);
  const [errorOtp, setErrorOtp]     = useState('');
  const [copied, setCopied]         = useState(false);
  const [issuedOtp, setIssuedOtp]   = useState(null);

  const displayAmount = booking.final_amount || booking.total_amount;
  const startOtp = issuedOtp?.type === 'start' ? issuedOtp.value : '';
  const finishOtp = issuedOtp?.type === 'finish' ? issuedOtp.value : '';

  const handleCopy = (otp) => {
    navigator.clipboard.writeText(otp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  async function handleGenerateOtp(type) {
    setLoadingOtp(true);
    setErrorOtp('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/bookings/${booking.id}/${type}-otp`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (data.success) {
        setIssuedOtp({ type, value: data.otp });
        if (onRefresh) onRefresh();
      } else {
        setErrorOtp(data.error || `Failed to generate ${type} OTP`);
      }
    } catch (err) {
      setErrorOtp('Failed to connect to server');
    } finally {
      setLoadingOtp(false);
    }
  }

  return (
    <div className={`rounded-xl border p-5 transition-all duration-200 flex flex-col justify-between ${card}`}>
      <div>
        {/* Header row */}
        <div className="flex items-start justify-between mb-4 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <QuickServiceIcon value={booking.service_icon} label={booking.service_label}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl overflow-hidden bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700"
              imageClassName="h-9 w-9 object-contain" />
            <div className="min-w-0">
              <h3 className={`font-bold tracking-tight text-sm truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{booking.service_label}</h3>
              <p className={`text-[11px] font-mono ${muted}`}>#{booking.booking_reference}</p>
            </div>
          </div>
          {/* Status badge */}
          <div className={`shrink-0 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${st.color} ${st.bg}`}>
            {st.pulse && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse inline-block" />}
            {st.label}
          </div>
        </div>

        {/* Details grid */}
        <div className={`grid grid-cols-2 gap-x-4 gap-y-2 text-xs mb-4 ${muted}`}>
          <div>
            <span className="font-semibold text-[10px] uppercase tracking-wider block">Date</span>
            <p className={`${text} font-medium mt-0.5`}>{booking.booking_date || '—'}</p>
          </div>
          <div>
            <span className="font-semibold text-[10px] uppercase tracking-wider block">Time</span>
            <p className={`${text} font-medium mt-0.5 truncate`}>{booking.booking_time || '—'}</p>
          </div>
          {booking.service_subcategory && (
            <div className="col-span-2">
              <span className="font-semibold text-[10px] uppercase tracking-wider block">Sub Category</span>
              <p className={`${text} font-medium mt-0.5`}>{booking.service_subcategory}</p>
            </div>
          )}
          <div className="col-span-2">
            <span className="font-semibold text-[10px] uppercase tracking-wider block">Address</span>
            <p className={`${text} font-medium mt-0.5 truncate`}>{booking.service_address}, {booking.service_city}</p>
          </div>
          {booking.vendor_shop_name && (
            <div className="col-span-2">
              <span className="font-semibold text-[10px] uppercase tracking-wider block">Service Provider</span>
              <p className={`${text} font-bold mt-0.5`}>{booking.vendor_shop_name}</p>
            </div>
          )}
          {booking.status === 'WAITING_FOR_VENDOR_ACCEPTANCE' && (
            <div className="col-span-2">
              <p className="text-[#0284c7] font-semibold text-xs animate-pulse">Notifying active providers in {booking.service_city}...</p>
            </div>
          )}
        </div>

        {/* OTP Section */}
        {(booking.status === 'VENDOR_ACCEPTED' || booking.status === 'VENDOR_ON_WAY' || booking.status === 'IN_PROGRESS') && (
          <div className={`my-4 p-4 rounded-xl border ${isDark ? 'border-zinc-800 bg-zinc-950/50' : 'border-slate-100 bg-slate-50'} flex flex-col gap-3 transition-all`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#0284c7]">
                  {booking.status === 'IN_PROGRESS' ? 'Completion Verification' : 'Start Verification'}
                </p>
                <p className={`text-[11px] mt-0.5 ${muted}`}>
                  {booking.status === 'IN_PROGRESS' 
                    ? 'Share OTP with provider upon work completion' 
                    : 'Share OTP with provider when they arrive at site'}
                </p>
              </div>
              {booking.status === 'IN_PROGRESS' ? (
                (finishOtp || booking.finish_otp_pending) ? (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#0284c7] bg-[#0284c7]/10 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] animate-pulse" />
                    PENDING
                  </div>
                ) : null
              ) : (
                (startOtp || booking.start_otp_pending) ? (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#0284c7] bg-[#0284c7]/10 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] animate-pulse" />
                    PENDING
                  </div>
                ) : null
              )}
            </div>

            {booking.status === 'IN_PROGRESS' ? (
              finishOtp ? (
                <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-3 rounded-lg border border-dashed border-sky-400">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${muted}`}>Finish OTP</span>
                    <p className="text-xl font-black font-mono tracking-widest text-[#0284c7]">{finishOtp}</p>
                  </div>
                  <button 
                    onClick={() => handleCopy(finishOtp)}
                    className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-md border border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              ) : booking.finish_otp_pending ? (
                <button
                  disabled={loadingOtp}
                  onClick={() => handleGenerateOtp('finish')}
                  className="w-full py-2.5 rounded-lg border border-[#0284c7] text-[#0284c7] text-xs font-bold uppercase tracking-wider hover:bg-[#0284c7]/10 transition-colors disabled:opacity-50"
                >
                  {loadingOtp ? 'Regenerating OTP...' : 'Regenerate Finish OTP'}
                </button>
              ) : (
                <button
                  disabled={loadingOtp}
                  onClick={() => handleGenerateOtp('finish')}
                  className="w-full py-2.5 rounded-lg bg-[#0284c7] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#0369a1] transition-colors disabled:opacity-50 shadow-xs"
                >
                  {loadingOtp ? 'Generating OTP...' : 'Generate Finish OTP'}
                </button>
              )
            ) : (
              startOtp ? (
                <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-3 rounded-lg border border-dashed border-sky-400">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${muted}`}>Start OTP</span>
                    <p className="text-xl font-black font-mono tracking-widest text-[#0284c7]">{startOtp}</p>
                  </div>
                  <button 
                    onClick={() => handleCopy(startOtp)}
                    className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-md border border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              ) : booking.start_otp_pending ? (
                <button
                  disabled={loadingOtp}
                  onClick={() => handleGenerateOtp('start')}
                  className="w-full py-2.5 rounded-lg border border-[#0284c7] text-[#0284c7] text-xs font-bold uppercase tracking-wider hover:bg-[#0284c7]/10 transition-colors disabled:opacity-50"
                >
                  {loadingOtp ? 'Regenerating OTP...' : 'Regenerate Start OTP'}
                </button>
              ) : (
                <button
                  disabled={loadingOtp}
                  onClick={() => handleGenerateOtp('start')}
                  className="w-full py-2.5 rounded-lg bg-[#0284c7] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#0369a1] transition-colors disabled:opacity-50 shadow-xs"
                >
                  {loadingOtp ? 'Generating OTP...' : 'Generate Start OTP'}
                </button>
              )
            )}

            {errorOtp && (
              <p className="text-xs font-semibold text-red-500">{errorOtp}</p>
            )}
          </div>
        )}
      </div>

      {/* Footer row */}
      <div className={`flex items-center justify-between border-t pt-3.5 mt-2 ${divider}`}>
        <div>
          <p className={`text-[10px] font-bold uppercase tracking-wider ${muted}`}>
            {booking.status === 'AWAITING_PAYMENT' ? 'Final Payable' : 'Estimated'}
          </p>
          <p className="font-black text-[#0284c7] text-lg">₹{displayAmount}</p>
        </div>

        <div className="flex flex-col gap-2 items-end">
          {booking.status === 'AWAITING_PAYMENT' && (
            <button onClick={() => onPayment(booking)}
              className="px-4 py-2 rounded-lg bg-[#0284c7] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#0369a1] shadow-xs transition-colors">
              Confirm Payment
            </button>
          )}
          {booking.status === 'COMPLETED' && !booking.has_rating && (
            <button onClick={() => onRate(booking)}
              className="px-4 py-2 rounded-lg border border-[#0284c7] text-[#0284c7] hover:bg-[#0284c7]/10 text-xs font-bold uppercase tracking-wider transition-colors">
              Rate Service ★
            </button>
          )}
          {booking.status === 'COMPLETED' && booking.has_rating && (
            <div className={`flex items-center gap-1.5 ${muted}`}>
              <span className="text-amber-400 text-sm">{'★'.repeat(booking.rating_stars || 5)}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Rated</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Profile Tab View ──────────────────────────────────────────────────────────
function ProfileTabView({ user, isDark, onProfileUpdated }) {
  const [name, setName]         = useState(user?.name || '');
  const [phone, setPhone]       = useState(user?.phone || '');
  const [saving, setSaving]     = useState(false);
  const [message, setMessage]   = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, phone }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        onProfileUpdated(data.data);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Error connecting to server' });
    } finally {
      setSaving(false);
    }
  }

  const card    = isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-xs';
  const inp     = isDark ? 'bg-zinc-800/90 border-zinc-700 text-white placeholder-zinc-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400';
  const muted   = isDark ? 'text-zinc-400' : 'text-slate-500';

  return (
    <div className="space-y-6 max-w-4xl">
      <div className={`rounded-xl border p-6 ${card}`}>
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-zinc-800">
          <div className="w-16 h-16 rounded-2xl bg-[#0284c7] flex items-center justify-center font-black text-2xl text-white shadow-md">
            {(user?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{user?.name || 'Customer Account'}</h2>
            <p className={`text-xs ${muted} mt-0.5`}>{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldCheck size={12} />
                Verified Customer
              </span>
              <span className="text-[11px] font-mono text-slate-400">ID: #{user?.id || '—'}</span>
            </div>
          </div>
        </div>

        {message.text && (
          <div className={`mt-5 p-3.5 rounded-lg text-xs font-semibold ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${muted}`}>Full Name <RequiredAsterisk /></label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none font-medium transition-colors ${inp}`}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${muted}`}>Mobile Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none font-medium transition-colors ${inp}`}
                placeholder="10-digit mobile number"
              />
            </div>
            <div className="sm:col-span-2">
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${muted}`}>Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none font-medium opacity-60 cursor-not-allowed ${inp}`}
              />
              <p className={`text-[11px] mt-1 ${muted}`}>Your email is used for account login and notifications.</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-zinc-800">
            <span className={`text-xs ${muted}`}>
              Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '—'}
            </span>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#0284c7] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#0369a1] transition-colors shadow-xs disabled:opacity-50"
            >
              <Save size={15} />
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>

      <div className={`rounded-xl border p-5 ${card}`}>
        <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white mb-2">Quick Navigation</h3>
        <p className={`text-xs ${muted} mb-4`}>Quick access to other areas of your account.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/property/listings-status"
            className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 dark:border-zinc-800 hover:border-[#0284c7] transition-colors"
          >
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Track Property Listings</p>
              <p className={`text-[11px] ${muted}`}>View your listed properties and approvals</p>
            </div>
            <ExternalLink size={16} className="text-[#0284c7]" />
          </Link>
          <Link
            href="/material-orders?role=user"
            className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 dark:border-zinc-800 hover:border-[#0284c7] transition-colors"
          >
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Track Material Purchases</p>
              <p className={`text-[11px] ${muted}`}>Full page view of your construction orders</p>
            </div>
            <ExternalLink size={16} className="text-[#0284c7]" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Main Page Export with Suspense ─────────────────────────────────────────────
export default function UserDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center font-sans bg-slate-50 dark:bg-black text-slate-900 dark:text-white">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 text-[#0284c7] animate-spin" />
          <p className="text-xs font-bold uppercase tracking-wider text-[#0284c7]">Loading User Dashboard...</p>
        </div>
      </div>
    }>
      <UserDashboardContent />
    </Suspense>
  );
}

// ── Dashboard Inner Component ──────────────────────────────────────────────────
function UserDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isDark, setIsDark]                     = useState(false);
  const [user, setUser]                         = useState(null);
  const [bookings, setBookings]                 = useState([]);
  const [primaryServices, setPrimaryServices]   = useState([]);
  const [propertyEnquiries, setPropertyEnquiries] = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [refreshing, setRefreshing]             = useState(false);
  const [paymentBooking, setPaymentBooking]     = useState(null);
  const [rateBooking, setRateBooking]           = useState(null);
  const [reviewPrimaryService, setReviewPrimaryService] = useState(null);

  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(() => {
    return ['overview', 'active', 'history', 'primary', 'property', 'purchases', 'applications', 'profile'].includes(initialTab)
      ? initialTab
      : 'overview';
  });

  // Dark mode tracking
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark-mode'));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const fetchProfile = useCallback(async (token) => {
    try {
      const res = await fetch('/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.data) {
        setUser(data.data);
        localStorage.setItem('user', JSON.stringify(data.data));
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  }, []);

  const fetchBookings = useCallback(async (token) => {
    try {
      const [bookingRes, primaryRes, propertyRes] = await Promise.all([
        fetch('/api/user/bookings', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/user/primary-services', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/property-enquiries', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const [bookingData, primaryData, propertyData] = await Promise.all([
        bookingRes.json().catch(() => ({})),
        primaryRes.json().catch(() => ({})),
        propertyRes.json().catch(() => ({})),
      ]);
      if (bookingData.success) setBookings(bookingData.data || []);
      if (primaryData.success) setPrimaryServices(primaryData.data || []);
      if (propertyData.success) setPropertyEnquiries(propertyData.data || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login?redirect=/userdashboard');
      return;
    }

    const raw = localStorage.getItem('user');
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch {}
    }

    let active = true;
    const validateSession = async () => {
      try {
        const response = await fetch('/api/auth/session', { headers: { Authorization: `Bearer ${token}` } });
        if (!response.ok) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (active) router.replace('/login?error=account_suspended');
          return false;
        }
        return true;
      } catch {
        return true;
      }
    };

    validateSession().then((valid) => {
      if (valid && active) {
        fetchProfile(token);
        fetchBookings(token);
      }
    });

    const interval = setInterval(async () => {
      if (await validateSession()) {
        fetchBookings(token);
      }
    }, 12000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [router, fetchBookings, fetchProfile]);

  const activeBookings  = useMemo(() => bookings.filter((b) => b.payment_status === 'PAID' && !['COMPLETED', 'CANCELLED'].includes(b.status)), [bookings]);
  const historyBookings = useMemo(() => bookings.filter((b) => ['COMPLETED', 'CANCELLED'].includes(b.status)), [bookings]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    router.push(`/userdashboard?tab=${tabKey}`);
  };

  const menuItems = useMemo(() => [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    {
      key: 'active',
      label: 'Active Bookings',
      icon: Zap,
      badge: activeBookings.length,
      badgeColor: 'bg-[#0284c7] text-white',
    },
    {
      key: 'history',
      label: 'Booking History',
      icon: History,
      badge: historyBookings.length,
      badgeColor: 'bg-zinc-600 text-white',
    },
    {
      key: 'primary',
      label: 'Construction Services',
      icon: HardHat,
      badge: primaryServices.length,
      badgeColor: 'bg-emerald-600 text-white',
    },
    {
      key: 'property',
      label: 'Property Enquiries',
      icon: House,
      badge: propertyEnquiries.length,
      badgeColor: 'bg-amber-600 text-white',
    },
    { key: 'purchases', label: 'Material Orders', icon: ShoppingCart },
    { key: 'applications', label: 'Job Applications', icon: Briefcase },
    { key: 'profile', label: 'My Profile', icon: User },
  ], [activeBookings.length, historyBookings.length, primaryServices.length, propertyEnquiries.length]);

  const card  = isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-xs';
  const muted = isDark ? 'text-zinc-400' : 'text-slate-500';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans bg-slate-50 dark:bg-black text-slate-900 dark:text-white">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 text-[#0284c7] animate-spin" />
          <p className="text-xs font-bold uppercase tracking-wider text-[#0284c7]">Loading User Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <PanelLayout
      title="User Dashboard"
      subtitle={`Welcome back, ${user?.name || 'Customer'}`}
      user={{
        name: user?.name || 'Customer',
        email: user?.email || '',
        city: user?.city || '',
        role: 'Customer',
      }}
      roleBadge="Customer"
      menuItems={menuItems}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onLogout={handleLogout}
      actions={
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              const token = localStorage.getItem('token');
              if (token) {
                setRefreshing(true);
                fetchBookings(token).finally(() => setRefreshing(false));
                fetchProfile(token);
              }
            }}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 dark:border-zinc-700 text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            title="Refresh Dashboard"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <Link
            href="/quick"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0284c7] text-white text-xs font-bold rounded-lg hover:bg-[#0369a1] shadow-xs transition-colors"
          >
            <Plus size={15} />
            <span>Book Service</span>
          </Link>
        </div>
      }
    >
      <div className="space-y-6">

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Welcome banner */}
            <div className={`rounded-2xl border p-6 ${card} bg-gradient-to-r from-[#0284c7]/10 via-transparent to-amber-500/5`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#0284c7]">Account Overview</span>
                  <h2 className="text-2xl font-black tracking-tight mt-1 text-slate-900 dark:text-white">
                    Hello, {user?.name || 'Valued Customer'} 👋
                  </h2>
                  <p className={`text-xs mt-1 max-w-xl ${muted}`}>
                    Manage your quick home services, track ongoing construction projects, view property leads, and manage material purchases all from one place.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  <Link
                    href="/quick"
                    className="px-4 py-2 bg-[#0284c7] text-white text-xs font-bold rounded-lg hover:bg-[#0369a1] transition-colors shadow-xs"
                  >
                    + Book Quick Service
                  </Link>
                  <Link
                    href="/Services/all"
                    className="px-4 py-2 border border-slate-300 dark:border-zinc-700 text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Construction Services
                  </Link>
                  <Link
                    href="/ShopNow"
                    className="px-4 py-2 border border-slate-300 dark:border-zinc-700 text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Building Materials
                  </Link>
                </div>
              </div>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => handleTabChange('active')}
                className={`rounded-xl border p-5 ${card} cursor-pointer hover:border-[#0284c7] transition-all group`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284c7]">Active Bookings</span>
                  <div className="w-10 h-10 rounded-xl bg-[#0284c7]/10 text-[#0284c7] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Zap size={20} />
                  </div>
                </div>
                <p className="text-3xl font-black mt-2 text-slate-900 dark:text-white">{activeBookings.length}</p>
                <p className={`text-[11px] mt-1 ${muted}`}>In progress / awaiting vendor</p>
              </div>

              <div
                onClick={() => handleTabChange('history')}
                className={`rounded-xl border p-5 ${card} cursor-pointer hover:border-[#0284c7] transition-all group`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${muted}`}>Total Completed</span>
                  <div className="w-10 h-10 rounded-xl bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <History size={20} />
                  </div>
                </div>
                <p className="text-3xl font-black mt-2 text-slate-900 dark:text-white">{historyBookings.length}</p>
                <p className={`text-[11px] mt-1 ${muted}`}>Booking history</p>
              </div>

              <div
                onClick={() => handleTabChange('primary')}
                className={`rounded-xl border p-5 ${card} cursor-pointer hover:border-emerald-500 transition-all group`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Construction</span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <HardHat size={20} />
                  </div>
                </div>
                <p className="text-3xl font-black mt-2 text-slate-900 dark:text-white">{primaryServices.length}</p>
                <p className={`text-[11px] mt-1 ${muted}`}>Primary service inquiries</p>
              </div>

              <div
                onClick={() => handleTabChange('property')}
                className={`rounded-xl border p-5 ${card} cursor-pointer hover:border-amber-500 transition-all group`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Properties</span>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <House size={20} />
                  </div>
                </div>
                <p className="text-3xl font-black mt-2 text-slate-900 dark:text-white">{propertyEnquiries.length}</p>
                <p className={`text-[11px] mt-1 ${muted}`}>Inquiries & property leads</p>
              </div>
            </div>

            {/* Active Bookings Snapshot on Overview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">Active Service Bookings</h3>
                  <p className={`text-xs ${muted}`}>Quick services currently in progress or awaiting verification.</p>
                </div>
                {activeBookings.length > 0 && (
                  <button
                    onClick={() => handleTabChange('active')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0284c7] hover:underline"
                  >
                    <span>View all ({activeBookings.length})</span>
                    <ChevronRight size={14} />
                  </button>
                )}
              </div>

              {activeBookings.length === 0 ? (
                <div className={`rounded-xl border p-8 text-center ${card}`}>
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    <Zap size={22} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No active bookings right now</h4>
                  <p className={`text-xs mt-1 max-w-sm mx-auto ${muted}`}>Need plumbing, electrical, carpentry, or maintenance help? Book a trusted technician in minutes.</p>
                  <Link
                    href="/quick"
                    className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-[#0284c7] text-white text-xs font-bold rounded-lg hover:bg-[#0369a1] transition-colors shadow-xs"
                  >
                    <Plus size={14} />
                    <span>Book a Service Now</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeBookings.slice(0, 4).map((b) => (
                    <BookingCard
                      key={b.id}
                      booking={b}
                      isDark={isDark}
                      onPayment={setPaymentBooking}
                      onRate={setRateBooking}
                      onRefresh={() => {
                        const token = localStorage.getItem('token');
                        if (token) fetchBookings(token);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/Services/all"
                className={`rounded-xl border p-5 ${card} hover:border-[#0284c7] transition-all group flex items-start gap-3.5`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#0284c7]/10 text-[#0284c7] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <HardHat size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Construction Services</h4>
                  <p className={`text-xs mt-0.5 ${muted}`}>Architectural design, turnkey building, civil work, and renovation.</p>
                </div>
              </Link>

              <Link
                href="/ShopNow"
                className={`rounded-xl border p-5 ${card} hover:border-[#0284c7] transition-all group flex items-start gap-3.5`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <ShoppingCart size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Building Materials</h4>
                  <p className={`text-xs mt-0.5 ${muted}`}>Cement, steel, aggregates, bricks, tiles, and fittings at wholesale rates.</p>
                </div>
              </Link>

              <Link
                href="/property/listings-status"
                className={`rounded-xl border p-5 ${card} hover:border-[#0284c7] transition-all group flex items-start gap-3.5`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <House size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Property Hub</h4>
                  <p className={`text-xs mt-0.5 ${muted}`}>Track your posted properties, buy/sale inquiries, and approval statuses.</p>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* ── ACTIVE BOOKINGS TAB ── */}
        {activeTab === 'active' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Active Service Bookings</h2>
                <p className={`text-xs ${muted}`}>Bookings requiring vendor completion, OTP verification, or payment confirmation.</p>
              </div>
              <Link
                href="/quick"
                className="inline-flex items-center gap-1.5 self-start px-3.5 py-1.5 bg-[#0284c7] text-white text-xs font-bold rounded-lg hover:bg-[#0369a1] transition-colors shadow-xs"
              >
                <Plus size={15} />
                <span>Book Another Service</span>
              </Link>
            </div>

            {activeBookings.length === 0 ? (
              <div className={`rounded-xl border p-12 text-center ${card}`}>
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <Zap size={22} />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No active bookings</h3>
                <p className={`text-xs mt-1 max-w-sm mx-auto ${muted}`}>You don&apos;t have any ongoing service bookings right now.</p>
                <Link
                  href="/quick"
                  className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-[#0284c7] text-white text-xs font-bold rounded-lg hover:bg-[#0369a1] transition-colors shadow-xs"
                >
                  <Plus size={14} />
                  <span>Book a Service Now</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeBookings.map((b) => (
                  <BookingCard
                    key={b.id}
                    booking={b}
                    isDark={isDark}
                    onPayment={setPaymentBooking}
                    onRate={setRateBooking}
                    onRefresh={() => {
                      const token = localStorage.getItem('token');
                      if (token) fetchBookings(token);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── BOOKING HISTORY TAB ── */}
        {activeTab === 'history' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Booking History</h2>
              <p className={`text-xs ${muted}`}>Past service bookings completed or cancelled.</p>
            </div>

            {historyBookings.length === 0 ? (
              <div className={`rounded-xl border p-12 text-center ${card}`}>
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <History size={22} />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No booking history yet</h3>
                <p className={`text-xs mt-1 max-w-sm mx-auto ${muted}`}>Completed service visits will appear here along with ratings and invoices.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {historyBookings.map((b) => (
                  <BookingCard
                    key={b.id}
                    booking={b}
                    isDark={isDark}
                    onPayment={setPaymentBooking}
                    onRate={setRateBooking}
                    onRefresh={() => {
                      const token = localStorage.getItem('token');
                      if (token) fetchBookings(token);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── CONSTRUCTION SERVICES TAB ── */}
        {activeTab === 'primary' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Construction & Renovation Services</h2>
                <p className={`text-xs ${muted}`}>Track project milestones from Site Visit and Estimation to Work Completion.</p>
              </div>
              <Link
                href="/Services/all"
                className="inline-flex items-center gap-1.5 self-start px-3.5 py-1.5 bg-[#0284c7] text-white text-xs font-bold rounded-lg hover:bg-[#0369a1] transition-colors shadow-xs"
              >
                <Plus size={15} />
                <span>Explore Services</span>
              </Link>
            </div>

            {primaryServices.length === 0 ? (
              <div className={`rounded-xl border p-12 text-center ${card}`}>
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <HardHat size={22} />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No construction service inquiries yet</h3>
                <p className={`text-xs mt-1 max-w-sm mx-auto ${muted}`}>Looking to construct a home, commercial space, or get architectural plans? Submit an inquiry.</p>
                <Link
                  href="/Services/all"
                  className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-[#0284c7] text-white text-xs font-bold rounded-lg hover:bg-[#0369a1] transition-colors shadow-xs"
                >
                  <span>Explore Construction Services</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {primaryServices.map((enquiry) => (
                  <PrimaryServiceCard
                    key={enquiry.id}
                    enquiry={enquiry}
                    isDark={isDark}
                    onReview={setReviewPrimaryService}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── PROPERTY ENQUIRIES TAB ── */}
        {activeTab === 'property' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Property Inquiries & Leads</h2>
                <p className={`text-xs ${muted}`}>Leads on your property listings and inquiries you&apos;ve sent to other owners.</p>
              </div>
              <Link
                href="/property/listings-status"
                className="inline-flex items-center gap-1.5 self-start px-3.5 py-1.5 border border-slate-300 dark:border-zinc-700 text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <ExternalLink size={14} />
                <span>My Property Listings</span>
              </Link>
            </div>

            {propertyEnquiries.length === 0 ? (
              <div className={`rounded-xl border p-12 text-center ${card}`}>
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <House size={22} />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No property inquiries found</h3>
                <p className={`text-xs mt-1 max-w-sm mx-auto ${muted}`}>Inquiries you send on properties or leads from interested buyers will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {propertyEnquiries.map((enquiry) => {
                  const isOwner = (user?.id && enquiry.owner_user_id === user.id) ||
                    (user?.email && enquiry.owner_email && enquiry.owner_email.toLowerCase() === user.email.toLowerCase());
                  const cleanPhone = String(enquiry.enquirer_phone || '').replace(/\D/g, '');
                  const waLink = cleanPhone ? `https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(`Hello ${enquiry.enquirer_name}, regarding your inquiry for ${enquiry.property_title}...`)}` : '';
                  const isRent = (enquiry.listing_type || '').toLowerCase() === 'rent';

                  return (
                    <div key={enquiry.id} className={`rounded-xl border p-5 flex flex-col justify-between ${card}`}>
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            isOwner ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' : 'bg-[#0284c7]/10 text-[#0284c7] border border-[#0284c7]/20'
                          }`}>
                            {isOwner ? `Lead on Your Property (${isRent ? 'Rent' : 'Sell'})` : `Inquiry Sent (${isRent ? 'Rent' : 'Buy'})`}
                          </span>
                          <span className="text-[11px] font-semibold capitalize text-slate-400">Status: {enquiry.status}</span>
                        </div>

                        <h3 className={`mt-2.5 font-bold tracking-tight text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {enquiry.property_title}
                        </h3>
                        <p className={`mt-0.5 text-xs ${muted}`}>
                          {enquiry.property_type || 'Property'} · {enquiry.property_location || 'Location not set'}
                          {enquiry.property_price ? ` · ₹${enquiry.property_price}` : ''}
                        </p>

                        {isOwner && (
                          <div className={`mt-3.5 p-3.5 rounded-lg border ${isDark ? 'bg-black/40 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-[#0284c7]">Buyer / Renter Details</p>
                            <p className="text-xs font-bold mt-1 text-slate-800 dark:text-zinc-200">{enquiry.enquirer_name}</p>
                            <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5">📞 {enquiry.enquirer_phone}</p>
                            {enquiry.enquirer_email && <p className="text-xs text-slate-600 dark:text-zinc-400">✉️ {enquiry.enquirer_email}</p>}
                            {enquiry.message && <p className="mt-2 text-xs italic opacity-85">&ldquo;{enquiry.message}&rdquo;</p>}
                          </div>
                        )}

                        {!isOwner && enquiry.message && (
                          <p className={`mt-3 text-xs italic ${muted}`}>Your message: &ldquo;{enquiry.message}&rdquo;</p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2">
                        <span className={`text-[11px] ${muted}`}>
                          {new Date(enquiry.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>

                        {isOwner && cleanPhone && (
                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${cleanPhone}`}
                              className="px-3 py-1 bg-[#0284c7] text-white rounded-md text-xs font-bold hover:bg-[#0369a1] transition-colors"
                            >
                              📞 Call
                            </a>
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-emerald-600 text-white rounded-md text-xs font-bold hover:bg-emerald-700 transition-colors"
                            >
                              💬 WhatsApp
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── MATERIAL ORDERS TAB ── */}
        {activeTab === 'purchases' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Material Purchases</h2>
                <p className={`text-xs ${muted}`}>Orders placed for raw materials, cement, steel, bricks, and supplies.</p>
              </div>
              <Link
                href="/ShopNow"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0284c7] text-white text-xs font-bold rounded-lg hover:bg-[#0369a1] transition-colors shadow-xs"
              >
                <Plus size={15} />
                <span>Shop Materials</span>
              </Link>
            </div>
            <MaterialOrdersPanel role="user" embedded />
          </div>
        )}

        {/* ── JOB APPLICATIONS TAB ── */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Job Applications</h2>
                <p className={`text-xs ${muted}`}>Track status, interviews, and updates for positions you applied for.</p>
              </div>
              <Link
                href="/careers"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-slate-300 dark:border-zinc-700 text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <ExternalLink size={14} />
                <span>View Openings</span>
              </Link>
            </div>
            <JobApplicationsPanel />
          </div>
        )}

        {/* ── PROFILE TAB ── */}
        {activeTab === 'profile' && (
          <ProfileTabView
            user={user}
            isDark={isDark}
            onProfileUpdated={(updated) => {
              setUser(updated);
              localStorage.setItem('user', JSON.stringify(updated));
            }}
          />
        )}

      </div>

      {/* ── Modals ── */}
      {paymentBooking && (
        <PaymentModal
          booking={paymentBooking}
          isDark={isDark}
          onClose={() => setPaymentBooking(null)}
          onSuccess={() => {
            setPaymentBooking(null);
            const token = localStorage.getItem('token');
            if (token) fetchBookings(token);
          }}
        />
      )}
      {rateBooking && (
        <RatingModal
          booking={rateBooking}
          isDark={isDark}
          onClose={() => setRateBooking(null)}
          onSuccess={() => {
            setRateBooking(null);
            const token = localStorage.getItem('token');
            if (token) fetchBookings(token);
          }}
        />
      )}
      {reviewPrimaryService && (
        <PrimaryServiceReviewModal
          enquiry={reviewPrimaryService}
          isDark={isDark}
          onClose={() => setReviewPrimaryService(null)}
          onSuccess={() => {
            setReviewPrimaryService(null);
            const token = localStorage.getItem('token');
            if (token) fetchBookings(token);
          }}
        />
      )}
    </PanelLayout>
  );
}
