"use client";
import { useState } from "react";

export default function EnquiryForm({ isDarkMode, propertyTitle }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const digits = value.replace(/\D/g, '').slice(0, 10);
      setForm({ ...form, phone: digits });
    } else {
      setForm({ ...form, [name]: value });
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Full name is required.';
    if (!form.phone) newErrors.phone = 'Phone number is required.';
    else if (!phoneRegex.test(form.phone)) newErrors.phone = 'Enter a valid 10-digit Indian mobile number (starts with 6-9).';
    if (form.email && !emailRegex.test(form.email)) newErrors.email = 'Please enter a valid email address.';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("https://formsubmit.co/ajax/pathakmansi608@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          message: form.message,
          property: propertyTitle,
          _subject: `New Property Enquiry - ${propertyTitle}`,
        }),
      });

      const data = await res.json();
      if (data.success === "true" || data.success === true) {
        setSubmitted(true);
        setForm({ name: "", phone: "", email: "", message: "" });
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full px-4 py-3 text-xs font-bold border rounded-sm outline-none transition-all duration-200 ${
    isDarkMode
      ? "bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#facc15]"
      : "bg-gray-50 border-gray-200 text-zinc-800 placeholder-zinc-400 focus:border-zinc-800"
  }`;

  const labelClass = `block text-[10px] font-black uppercase tracking-widest mb-2 ${
    isDarkMode ? "text-zinc-400" : "text-zinc-500"
  }`;

  if (submitted) {
    return (
      <div className={`rounded-sm border p-8 text-center ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"}`}>
        <div className="w-16 h-16 bg-[#facc15] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className={`text-sm font-black uppercase tracking-widest mb-2 ${isDarkMode ? "text-white" : "text-zinc-800"}`}>
          Enquiry Sent!
        </h3>
        <p className={`text-xs ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
          We will contact you shortly regarding
        </p>
        <p className="text-[#facc15] text-xs font-black mt-1">{propertyTitle}</p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 px-6 py-2 bg-[#facc15] text-black text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-yellow-400 transition-all"
        >
          Send Another
        </button>
      </div>
    );
  }

  return (
    <div className={`rounded-sm border shadow-lg p-6 ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"}`}>
      <div className="mb-6">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#facc15]">
          Interested?
        </span>
        <h3 className={`text-sm font-black uppercase tracking-widest mt-1 ${isDarkMode ? "text-white" : "text-zinc-800"}`}>
          Send an Enquiry
        </h3>
        {propertyTitle && (
          <p className={`text-[11px] mt-1 truncate ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
            For: {propertyTitle}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className={labelClass}>Full Name *</label>
          <input
            type="text"
            name="name"
            placeholder="Your full name"
            value={form.name}
            onChange={handleChange}
            className={inputClass}
          />
          {errors.name && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.name}</p>}
        </div>

        <div>
          <label className={labelClass}>Phone Number *</label>
          <input
            type="tel"
            name="phone"
            placeholder="10-digit mobile number"
            value={form.phone}
            onChange={handleChange}
            maxLength={10}
            inputMode="numeric"
            className={inputClass}
          />
          {errors.phone && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.phone}</p>}
        </div>

        <div>
          <label className={labelClass}>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
          />
          {errors.email && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.email}</p>}
        </div>

        <div>
          <label className={labelClass}>Message</label>
          <textarea
            name="message"
            rows={4}
            placeholder="I am interested in this property..."
            value={form.message}
            onChange={handleChange}
            className={`${inputClass} resize-none`}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#facc15] text-black text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-yellow-400 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Sending...
            </>
          ) : (
            "Send Enquiry"
          )}
        </button>

        <p className={`text-[10px] text-center ${isDarkMode ? "text-zinc-600" : "text-gray-400"}`}>
          We respect your privacy. No spam ever.
        </p>

      </form>
    </div>
  );
}