'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// ── Status config ──────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  WAITING_FOR_VENDOR_ACCEPTANCE: { label: 'Searching Vendor', color: 'text-yellow-500 border-yellow-500', bg: 'bg-yellow-500/10', pulse: true },
  VENDOR_ACCEPTED:               { label: 'Vendor On The Way', color: 'text-green-500 border-green-500',  bg: 'bg-green-500/10',  pulse: false },
  VENDOR_ON_WAY:                 { label: 'Vendor On The Way', color: 'text-green-500 border-green-500',  bg: 'bg-green-500/10',  pulse: false },
  IN_PROGRESS:                   { label: 'Work In Progress',  color: 'text-blue-500 border-blue-500',    bg: 'bg-blue-500/10',   pulse: false },
  AWAITING_PAYMENT:              { label: 'Awaiting Payment',  color: 'text-orange-500 border-orange-500',bg: 'bg-orange-500/10', pulse: true  },
  COMPLETED:                     { label: 'Completed',         color: 'text-zinc-400 border-zinc-400',    bg: 'bg-zinc-500/10',   pulse: false },
  CANCELLED:                     { label: 'Cancelled',         color: 'text-red-500 border-red-500',      bg: 'bg-red-500/10',    pulse: false },
};

// ── Payment Modal ─────────────────────────────────────────────────────────────
function PaymentModal({ booking, isDark, onClose, onSuccess }) {
  const [amount, setAmount] = useState(String(booking.final_amount || booking.total_amount || ''));
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleConfirm() {
    if (!amount) { setError('Enter the amount you paid'); return; }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/bookings/${booking.id}/confirm-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ user_paid_amount: parseFloat(amount), user_note: note }),
      });
      const data = await res.json();
      if (data.success) onSuccess();
      else setError(data.error || 'Failed to confirm payment');
    } catch { setError('Something went wrong. Try again.'); }
    finally { setLoading(false); }
  }

  const modal  = isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900';
  const inp    = isDark ? 'bg-zinc-900 border-zinc-700 text-white placeholder-zinc-600' : 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder-zinc-400';
  const muted  = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const divider= isDark ? 'border-zinc-800' : 'border-zinc-100';

  return (
    <div className="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`w-full max-w-sm border shadow-2xl ${modal}`}>
        <div className={`flex items-center justify-between px-5 py-4 border-b ${divider}`}>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#facc15]">Confirm Payment</p>
            <h3 className="text-base font-black uppercase tracking-tight">{booking.service_label}</h3>
          </div>
          <button onClick={onClose} className={`w-8 h-8 border flex items-center justify-center font-black text-sm transition-all ${isDark ? 'border-zinc-700 text-zinc-400 hover:border-[#facc15] hover:text-[#facc15]' : 'border-zinc-300 text-zinc-400 hover:border-zinc-900'}`}>✕</button>
        </div>
        <div className="p-5 space-y-4">
          <div className={`px-4 py-3 border ${isDark ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-100 bg-zinc-50'}`}>
            <p className={`text-[9px] uppercase font-black tracking-widest ${muted}`}>Vendor Quoted Amount</p>
            <p className="text-2xl font-black text-[#facc15]">₹{booking.final_amount || booking.total_amount}</p>
          </div>

          <div>
            <label className={`block text-[9px] font-black uppercase tracking-widest mb-1.5 ${muted}`}>Amount You Paid (₹) *</label>
            <input
              type="number"
              className={`w-full px-3 py-2.5 text-sm border outline-none transition-all ${inp}`}
              placeholder={`e.g. ${booking.final_amount || booking.total_amount}`}
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setError(''); }}
            />
          </div>

          <div>
            <label className={`block text-[9px] font-black uppercase tracking-widest mb-1.5 ${muted}`}>Note (optional)</label>
            <textarea rows={2} className={`w-full px-3 py-2.5 text-sm border outline-none resize-none transition-all ${inp}`}
              placeholder="Any payment remarks..." value={note} onChange={(e) => setNote(e.target.value)} />
          </div>

          {error && <p className="text-[10px] text-red-500 font-bold">{error}</p>}

          <button onClick={handleConfirm} disabled={loading}
            className="w-full py-3 bg-[#facc15] text-black text-[9px] font-black uppercase tracking-[0.3em] hover:bg-yellow-300 transition-all disabled:opacity-50">
            {loading ? 'Confirming...' : 'Confirm Payment ✓'}
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
      <p className={`text-[9px] uppercase font-black tracking-widest ${muted}`}>{label}</p>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <button key={s} type="button" onClick={() => onChange(s)}
            className={`text-xl transition-all ${s <= value ? 'text-[#facc15]' : isDark ? 'text-zinc-700' : 'text-zinc-200'}`}>★</button>
        ))}
      </div>
    </div>
  );
}

function RatingModal({ booking, isDark, onClose, onSuccess }) {
  const [stars, setStars]               = useState(0);
  const [hover, setHover]               = useState(0);
  const [review, setReview]             = useState('');
  const [cleanliness, setCleanliness]   = useState(0);
  const [professionalism, setProfessionalism] = useState(0);
  const [punctuality, setPunctuality]   = useState(0);
  const [recommend, setRecommend]       = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');

  async function handleSubmit() {
    if (!stars) { setError('Please select a star rating'); return; }
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

  const modal   = isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900';
  const inp     = isDark ? 'bg-zinc-900 border-zinc-700 text-white placeholder-zinc-600' : 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder-zinc-400';
  const muted   = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const divider = isDark ? 'border-zinc-800' : 'border-zinc-100';
  const LABELS  = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  return (
    <div className="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`w-full max-w-sm border shadow-2xl ${modal}`} style={{ maxHeight: '90vh', overflowY: 'auto', scrollbarWidth: 'none' }}>
        <div className={`flex items-center justify-between px-5 py-4 border-b ${divider}`}>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#facc15]">Rate Your Service</p>
            <h3 className="text-base font-black uppercase tracking-tight">{booking.service_label}</h3>
          </div>
          <button onClick={onClose} className={`w-8 h-8 border flex items-center justify-center font-black text-sm transition-all ${isDark ? 'border-zinc-700 text-zinc-400 hover:border-[#facc15] hover:text-[#facc15]' : 'border-zinc-300 text-zinc-400 hover:border-zinc-900'}`}>✕</button>
        </div>

        <div className="p-5 space-y-5">
          {booking.vendor_shop_name && (
            <p className={`text-xs ${muted}`}>Vendor: <span className={`font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{booking.vendor_shop_name}</span></p>
          )}

          {/* Overall Stars */}
          <div className="text-center">
            <p className={`text-[9px] font-black uppercase tracking-widest mb-3 ${muted}`}>Overall Rating *</p>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} type="button"
                  onClick={() => setStars(s)}
                  onMouseEnter={() => setHover(s)}
                  onMouseLeave={() => setHover(0)}
                  className={`text-4xl transition-all ${s <= (hover || stars) ? 'text-[#facc15] scale-110' : isDark ? 'text-zinc-700' : 'text-zinc-200'}`}>★</button>
              ))}
            </div>
            {(hover || stars) > 0 && (
              <p className="text-[10px] font-black text-[#facc15] mt-1 uppercase tracking-widest">{LABELS[hover || stars]}</p>
            )}
          </div>

          {/* Category Ratings */}
          <div className={`space-y-3 p-4 border ${divider}`}>
            <p className={`text-[9px] font-black uppercase tracking-widest mb-2 ${muted}`}>Category Ratings</p>
            <SubRating label="Cleanliness"     value={cleanliness}     onChange={setCleanliness}     isDark={isDark} muted={muted} />
            <SubRating label="Professionalism"  value={professionalism}  onChange={setProfessionalism}  isDark={isDark} muted={muted} />
            <SubRating label="Punctuality"      value={punctuality}      onChange={setPunctuality}      isDark={isDark} muted={muted} />
          </div>

          {/* Review Text */}
          <div>
            <label className={`block text-[9px] font-black uppercase tracking-widest mb-1.5 ${muted}`}>Write a Review (optional)</label>
            <textarea rows={3} className={`w-full px-3 py-2.5 text-sm border outline-none resize-none transition-all ${inp}`}
              placeholder="How was your experience?" value={review} onChange={(e) => setReview(e.target.value)} />
          </div>

          {/* Would Recommend */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={recommend} onChange={(e) => setRecommend(e.target.checked)} className="w-4 h-4 accent-[#facc15]" />
            <span className={`text-xs font-bold ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>I would recommend this vendor to others</span>
          </label>

          {error && <p className="text-[10px] text-red-500 font-bold">{error}</p>}

          <button onClick={handleSubmit} disabled={loading || !stars}
            className="w-full py-3 bg-[#facc15] text-black text-[9px] font-black uppercase tracking-[0.3em] hover:bg-yellow-300 transition-all disabled:opacity-50">
            {loading ? 'Submitting...' : 'Submit Review ★'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Booking Card ──────────────────────────────────────────────────────────────
function BookingCard({ booking, isDark, onPayment, onRate }) {
  const st     = STATUS_CONFIG[booking.status] || STATUS_CONFIG.WAITING_FOR_VENDOR_ACCEPTANCE;
  const card   = isDark ? 'bg-zinc-950 border-zinc-800 hover:border-zinc-700' : 'bg-white border-zinc-200 hover:border-zinc-300';
  const muted  = isDark ? 'text-zinc-500' : 'text-zinc-400';
  const text   = isDark ? 'text-zinc-200' : 'text-zinc-800';
  const divider= isDark ? 'border-zinc-800' : 'border-zinc-100';

  const displayAmount = booking.final_amount || booking.total_amount;

  return (
    <div className={`border p-5 transition-all duration-200 ${card}`}>
      {/* Header row */}
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl flex-shrink-0">{booking.service_icon || '🔧'}</span>
          <div className="min-w-0">
            <h3 className={`font-black uppercase tracking-tight text-sm truncate ${isDark ? 'text-white' : 'text-zinc-900'}`}>{booking.service_label}</h3>
            <p className={`text-[10px] ${muted}`}>#{booking.booking_reference}</p>
          </div>
        </div>
        {/* Status badge */}
        <div className={`flex-shrink-0 px-2.5 py-1 border text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${st.color} ${st.bg}`}>
          {st.pulse && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse inline-block" />}
          {st.label}
        </div>
      </div>

      {/* Details grid */}
      <div className={`grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] mb-4 ${muted}`}>
        <div>
          <span className="font-black uppercase">Date</span>
          <p className={text}>{booking.booking_date || '—'}</p>
        </div>
        <div>
          <span className="font-black uppercase">Time</span>
          <p className={`${text} truncate`}>{booking.booking_time || '—'}</p>
        </div>
        <div className="col-span-2">
          <span className="font-black uppercase">Address</span>
          <p className={text}>{booking.service_address}, {booking.service_city}</p>
        </div>
        {booking.vendor_shop_name && (
          <div className="col-span-2">
            <span className="font-black uppercase">Vendor</span>
            <p className={`${text} font-bold`}>{booking.vendor_shop_name}</p>
          </div>
        )}
        {booking.status === 'WAITING_FOR_VENDOR_ACCEPTANCE' && (
          <div className="col-span-2">
            <p className="text-yellow-500 font-bold animate-pulse">Notifying vendors in {booking.service_city}...</p>
          </div>
        )}
      </div>

      {/* Footer row */}
      <div className={`flex items-center justify-between border-t pt-3 ${divider}`}>
        <div>
          <p className={`text-[9px] font-black uppercase tracking-widest ${muted}`}>
            {booking.status === 'AWAITING_PAYMENT' ? 'Final Amount' : 'Estimated'}
          </p>
          <p className="font-black text-[#facc15] text-lg">₹{displayAmount}</p>
        </div>

        <div className="flex flex-col gap-2 items-end">
          {booking.status === 'AWAITING_PAYMENT' && (
            <button onClick={() => onPayment(booking)}
              className="px-4 py-2 bg-[#facc15] text-black text-[9px] font-black uppercase tracking-widest hover:bg-yellow-300 transition-all">
              Confirm Payment
            </button>
          )}
          {booking.status === 'COMPLETED' && !booking.has_rating && (
            <button onClick={() => onRate(booking)}
              className={`px-4 py-2 border text-[9px] font-black uppercase tracking-widest transition-all ${isDark ? 'border-[#facc15] text-[#facc15] hover:bg-[#facc15]/10' : 'border-zinc-900 text-zinc-900 hover:bg-zinc-50'}`}>
              Rate Service ★
            </button>
          )}
          {booking.status === 'COMPLETED' && booking.has_rating && (
            <div className={`flex items-center gap-1 ${muted}`}>
              <span className="text-[#facc15] text-sm">{'★'.repeat(booking.rating_stars || 5)}</span>
              <span className="text-[9px] font-black uppercase tracking-widest">Rated</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function UserDashboard() {
  const router = useRouter();
  const [isDark, setIsDark]           = useState(false);
  const [user, setUser]               = useState(null);
  const [bookings, setBookings]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [tab, setTab]                 = useState('active');
  const [paymentBooking, setPaymentBooking] = useState(null);
  const [rateBooking, setRateBooking]       = useState(null);

  // Dark mode
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark-mode'));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const fetchBookings = useCallback(async (token) => {
    try {
      const res = await fetch('/api/user/bookings', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setBookings(data.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login?redirect=/userdashboard'); return; }

    const raw = localStorage.getItem('user');
    if (raw) { try { setUser(JSON.parse(raw)); } catch {} }

    fetchBookings(token);
    const interval = setInterval(() => fetchBookings(token), 10000);
    return () => clearInterval(interval);
  }, [router, fetchBookings]);

  const activeBookings  = bookings.filter((b) => !['COMPLETED', 'CANCELLED'].includes(b.status));
  const historyBookings = bookings.filter((b) =>  ['COMPLETED', 'CANCELLED'].includes(b.status));
  const displayed       = tab === 'active' ? activeBookings : historyBookings;

  const bg      = isDark ? 'bg-black text-white' : 'bg-zinc-50 text-zinc-900';
  const muted   = isDark ? 'text-zinc-500' : 'text-zinc-400';
  const border  = isDark ? 'border-zinc-900' : 'border-zinc-100';
  const statCard= isDark ? 'border-zinc-900' : 'border-zinc-100';

  function handlePaymentSuccess() {
    setPaymentBooking(null);
    fetchBookings(localStorage.getItem('token'));
  }
  function handleRateSuccess() {
    setRateBooking(null);
    fetchBookings(localStorage.getItem('token'));
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center font-serif ${bg}`}>
        <p className="text-[#facc15] text-[9px] font-black uppercase tracking-[0.5em] animate-pulse">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <main className={`min-h-screen font-serif transition-colors duration-500 ${bg}`}>

      {/* ── Header ── */}
      <section className={`pt-24 pb-6 px-6 border-b ${border}`}>
        <div className="max-w-4xl mx-auto flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-[#facc15] text-[9px] font-black uppercase tracking-[0.5em] mb-1">My Account</p>
            <h1 className={`text-3xl md:text-4xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              {user?.name || 'Dashboard'}
            </h1>
            {user?.email && <p className={`text-xs mt-1 ${muted}`}>{user.email}</p>}
          </div>
          <Link href="/quick"
            className={`self-start px-5 py-2.5 text-[9px] font-black uppercase tracking-widest border transition-all ${isDark ? 'border-[#facc15] text-[#facc15] hover:bg-[#facc15]/10' : 'border-zinc-900 text-zinc-900 hover:bg-zinc-100'}`}>
            + Book a Service
          </Link>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className={`border-b ${border}`}>
        <div className={`max-w-4xl mx-auto grid grid-cols-3 divide-x ${isDark ? 'divide-zinc-900' : 'divide-zinc-100'}`}>
          {[
            { label: 'Total Bookings', value: bookings.length, color: '' },
            { label: 'Active',          value: activeBookings.length, color: 'text-yellow-500' },
            { label: 'Completed',       value: historyBookings.filter((b) => b.status === 'COMPLETED').length, color: 'text-green-500' },
          ].map(({ label, value, color }) => (
            <div key={label} className="py-5 px-6 text-center">
              <p className={`text-2xl font-black ${color || (isDark ? 'text-white' : 'text-zinc-900')}`}>{value}</p>
              <p className={`text-[9px] font-black uppercase tracking-widest mt-0.5 ${muted}`}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tabs + Content ── */}
      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Tab selector */}
          <div className={`flex border-b mb-6 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
            {[
              { key: 'active',  label: `Active (${activeBookings.length})` },
              { key: 'history', label: `History (${historyBookings.length})` },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setTab(key)}
                className={`px-5 py-3 text-[9px] font-black uppercase tracking-widest border-b-2 transition-all ${
                  tab === key ? 'border-[#facc15] text-[#facc15]' : `border-transparent ${muted} hover:text-current`
                }`}>
                {label}
              </button>
            ))}
          </div>

          {/* Empty state */}
          {displayed.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">{tab === 'active' ? '🔍' : '📋'}</p>
              <p className={`text-[9px] font-black uppercase tracking-widest mb-4 ${muted}`}>
                {tab === 'active' ? 'No active bookings' : 'No booking history yet'}
              </p>
              {tab === 'active' && (
                <Link href="/quick"
                  className="inline-block px-6 py-3 bg-[#facc15] text-black text-[9px] font-black uppercase tracking-widest hover:bg-yellow-300 transition-all">
                  Book a Service Now
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayed.map((b) => (
                <BookingCard
                  key={b.id}
                  booking={b}
                  isDark={isDark}
                  onPayment={setPaymentBooking}
                  onRate={setRateBooking}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Modals ── */}
      {paymentBooking && (
        <PaymentModal
          booking={paymentBooking}
          isDark={isDark}
          onClose={() => setPaymentBooking(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}
      {rateBooking && (
        <RatingModal
          booking={rateBooking}
          isDark={isDark}
          onClose={() => setRateBooking(null)}
          onSuccess={handleRateSuccess}
        />
      )}
    </main>
  );
}
