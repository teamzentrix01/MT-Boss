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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
            required
            placeholder="Your full name"
            value={form.name}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Phone Number *</label>
          <input
            type="tel"
            name="phone"
            required
            placeholder="+91 XXXXX XXXXX"
            value={form.phone}
            onChange={handleChange}
            className={inputClass}
          />
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