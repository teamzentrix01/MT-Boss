'use client';

import { useState, useEffect } from 'react';

export default function ReviewModal({ isOpen, onClose, isDarkMode }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('Construction');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || name.length < 2) {
      setError('Please enter your name.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!message.trim() || message.length < 10) {
      setError('Please share at least 10 characters in your review.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          rating,
          service,
          message: message.trim(),
          consent: true,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setName('');
          setEmail('');
          setMessage('');
          setRating(5);
          setSuccess(false);
        }, 3000);
      } else {
        setError(data.error || 'Failed to submit review. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const ratingDescriptions = {
    1: 'Needs Major Improvement',
    2: 'Below Expectations',
    3: 'Satisfactory / Average',
    4: 'Great & Professional Service',
    5: 'Outstanding / Highly Recommended! 🌟',
  };

  const activeRating = hoverRating || rating;

  // Premium High-Contrast Colors
  const modalContainer = isDarkMode
    ? 'bg-gradient-to-b from-zinc-900/95 via-black/95 to-zinc-950/95 border-zinc-700/60 text-white shadow-[0_25px_60px_-15px_rgba(0,180,216,0.2)]'
    : 'bg-white border-zinc-200 text-zinc-900 shadow-[0_25px_60px_-15px_rgba(0,119,182,0.15)]';

  const headerBg = isDarkMode
    ? 'bg-zinc-800/60 border-zinc-700/50'
    : 'bg-sky-50/80 border-sky-100';

  const textPrimary = isDarkMode ? 'text-white' : 'text-zinc-900';
  const textSecondary = isDarkMode ? 'text-zinc-300' : 'text-zinc-700';
  const textMuted = isDarkMode ? 'text-zinc-400' : 'text-zinc-500';

  const inputClass = isDarkMode
    ? 'bg-zinc-900/90 border-zinc-700 text-white placeholder-zinc-500 focus:border-[var(--brand-blue)] focus:ring-2 focus:ring-[var(--brand-blue)]/20'
    : 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-[var(--brand-blue-deep)] focus:ring-2 focus:ring-[var(--brand-blue)]/20';

  const labelClass = `block text-xs font-bold uppercase tracking-wider mb-1.5 ${textSecondary}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        className={`w-full max-w-lg rounded-2xl border shadow-2xl relative ${modalContainer} max-h-[92vh] overflow-y-auto transition-all duration-300 overflow-hidden`}
      >
        {/* Header */}
        <div className={`p-6 border-b ${headerBg} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-black font-black flex items-center justify-center text-xl shadow">
              ★
            </div>
            <div>
              <h3 className={`text-lg font-black tracking-tight ${textPrimary}`}>
                Review MTBOSS Experience
              </h3>
              <p className={`text-xs ${textSecondary}`}>
                Your ratings and feedback help us build higher standards.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Direct Google Reviews Callout Strip */}
        <div className="mx-6 mt-4 p-3 rounded-2xl bg-gradient-to-r from-blue-600/15 via-amber-500/15 to-emerald-500/15 border border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">4.6 ★★★★☆</span>
                <span className="text-[10px] text-zinc-400">(170+ Google Reviews)</span>
              </div>
              <p className="text-[10px] text-zinc-300">Verified MT-Boss Google Business Profile</p>
            </div>
          </div>
          <a
            href="https://www.google.com/search?q=MTBOSS+CONSTRUCTION+PRIVATE+LIMITED+Moradabad#lrd=0x39a2ce08b8b0e51b:0x5e5a2db39df48259,3,,,"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-white text-zinc-900 hover:bg-zinc-100 font-bold text-[11px] transition-all shadow shrink-0 flex items-center gap-1 hover:scale-105 active:scale-95"
          >
            <span>Write on Google</span>
            <span>↗</span>
          </a>
        </div>

        {/* Success Screen */}
        {success ? (
          <div className="p-8 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-3xl shadow-lg">
              ✓
            </div>
            <h4 className={`text-xl font-black ${textPrimary}`}>
              Thank You for Your Feedback!
            </h4>
            <p className={`text-xs ${textSecondary} max-w-sm mx-auto leading-relaxed`}>
              Your review has been submitted to MT-Boss and sent to our team.
            </p>

            {/* Direct Google Post Prompt on Success */}
            <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 text-left space-y-3 mt-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌟</span>
                <div>
                  <h5 className="text-xs font-bold text-white">Help Us On Google Too!</h5>
                  <p className="text-[11px] text-zinc-400">Post this review directly to our official Google Profile (1-Click):</p>
                </div>
              </div>
              <a
                href="https://www.google.com/search?q=MTBOSS+CONSTRUCTION+PRIVATE+LIMITED+Moradabad#lrd=0x39a2ce08b8b0e51b:0x5e5a2db39df48259,3,,,"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow hover:brightness-110 transition-all"
              >
                <span>Post on Google Reviews</span>
                <span>↗</span>
              </a>
            </div>

            <button
              onClick={onClose}
              className="mt-2 text-xs text-zinc-400 hover:text-white underline"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Star Rating Card */}
            <div className={`p-4 rounded-xl border text-center ${headerBg}`}>
              <span className={`block text-xs font-bold uppercase tracking-wider mb-2 ${textSecondary}`}>
                Select Rating
              </span>
              <div className="flex items-center justify-center gap-2.5">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= activeRating;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="text-3xl sm:text-4xl transition-all transform hover:scale-125 focus:outline-none p-1"
                      aria-label={`${star} star rating`}
                    >
                      <span
                        className={
                          isFilled
                            ? 'text-amber-400 drop-shadow-[0_2px_10px_rgba(251,191,36,0.6)]'
                            : isDarkMode
                            ? 'text-zinc-600'
                            : 'text-zinc-300'
                        }
                      >
                        ★
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-2.5 inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-400/15 text-amber-500 dark:text-amber-300 border border-amber-400/30">
                {ratingDescriptions[activeRating]}
              </div>
            </div>

            {/* Service Availed */}
            <div>
              <label className={labelClass}>Service Availed *</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className={`w-full px-3.5 py-3 rounded-xl border text-xs font-medium outline-none transition-all ${inputClass}`}
                required
              >
                <option value="Construction">🏗️ Construction Projects & Buildings</option>
                <option value="Home Services">🔧 Home Services & Maintenance</option>
                <option value="Materials">📦 Building Materials & Supplies</option>
                <option value="Property">🏠 Property Buy, Sell & Rent</option>
                <option value="Other">💬 General / Other Services</option>
              </select>
            </div>

            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Your Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-3.5 py-3 rounded-xl border text-xs font-medium outline-none transition-all ${inputClass}`}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Your Email *</label>
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-3.5 py-3 rounded-xl border text-xs font-medium outline-none transition-all ${inputClass}`}
                  required
                />
              </div>
            </div>

            {/* Review text */}
            <div>
              <label className={labelClass}>Your Review / Feedback *</label>
              <textarea
                placeholder="Share your experience regarding project quality, timely delivery, communication, or staff responsiveness..."
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={2000}
                className={`w-full px-3.5 py-3 rounded-xl border text-xs font-medium outline-none resize-none transition-all ${inputClass}`}
                required
              />
              <div className="flex justify-between items-center mt-1">
                <span className={`text-[11px] ${textMuted}`}>Minimum 10 characters</span>
                <span className={`text-[11px] font-medium ${textMuted}`}>{message.length}/2000</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-[var(--brand-blue)] via-[var(--brand-blue-light)] to-[var(--brand-blue)] text-black text-xs font-black uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-[0.99] shadow-lg hover:shadow-[0_10px_25px_rgba(0,180,216,0.3)] transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin text-black" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  <span>Submitting Review...</span>
                </>
              ) : (
                <>
                  <span>Submit Review</span>
                  <span>⭐</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
