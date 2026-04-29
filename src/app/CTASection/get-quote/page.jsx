"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function GetQuotePage() {
  const [isDark, setIsDark] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "Commercial",
    budget: "",
    message: "",
  });

  useEffect(() => {
    const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark-mode"));
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Quote Requested:", formData);
    alert("Request Sent! Our engineering team will contact you shortly.");
  };

  return (
    <main className={`min-h-screen py-24 px-6 transition-colors duration-500 ${isDark ? "bg-black" : "bg-zinc-50"}`}>
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation Back */}
        <Link href="/CTASection" className="inline-flex items-center gap-2 text-[#facc15] font-black uppercase text-[10px] tracking-widest mb-12 hover:gap-4 transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Hub
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left Side: Info */}
          <div>
            <p className="text-[#facc15] text-xs font-black uppercase tracking-[0.4em] mb-4">Engineering Estimate</p>
            <h1 className={`text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-8 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Request a <br /> <span className="text-[#facc15]">Quote</span>
            </h1>
            <p className={`text-lg mb-12 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Provide your project details and our team of structural engineers will provide a comprehensive cost breakdown and timeline within 48 hours.
            </p>

            <div className="space-y-6">
              {[
                { label: "Quick Response", detail: "Within 48 Business Hours" },
                { label: "Expert Analysis", detail: "Structural & MEP Review" },
                { label: "No Obligations", detail: "Completely Free Consultation" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 bg-[#facc15] rotate-45" />
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{item.label}</p>
                    <p className={`font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Form */}
          <div className={`p-8 md:p-12 border-t-8 border-[#facc15] shadow-2xl ${isDark ? 'bg-zinc-900' : 'bg-white'}`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Full Name</label>
                  <input type="text" name="name" required onChange={handleChange} className={`w-full p-4 text-sm font-bold border-b-2 outline-none transition-all ${isDark ? 'bg-zinc-800 border-zinc-700 text-white focus:border-[#facc15]' : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-black'}`} />
                </div>
                <div>
                  <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Email Address</label>
                  <input type="email" name="email" required onChange={handleChange} className={`w-full p-4 text-sm font-bold border-b-2 outline-none transition-all ${isDark ? 'bg-zinc-800 border-zinc-700 text-white focus:border-[#facc15]' : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-black'}`} />
                </div>
              </div>

              <div>
                <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Project Type</label>
                <select name="projectType" onChange={handleChange} className={`w-full p-4 text-sm font-bold border-b-2 outline-none appearance-none ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'}`}>
                  <option>Commercial</option>
                  <option>Residential</option>
                  <option>Industrial</option>
                  <option>Infrastructure</option>
                </select>
              </div>

              <div>
                <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Estimated Budget (₹)</label>
                <input type="text" name="budget" placeholder="e.g. 50 Lakhs" onChange={handleChange} className={`w-full p-4 text-sm font-bold border-b-2 outline-none transition-all ${isDark ? 'bg-zinc-800 border-zinc-700 text-white focus:border-[#facc15]' : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-black'}`} />
              </div>

              <div>
                <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Project Brief</label>
                <textarea name="message" rows="4" required onChange={handleChange} placeholder="Describe your vision..." className={`w-full p-4 text-sm font-bold border-b-2 outline-none transition-all resize-none ${isDark ? 'bg-zinc-800 border-zinc-700 text-white focus:border-[#facc15]' : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-black'}`}></textarea>
              </div>

              <button type="submit" className="w-full py-5 bg-[#facc15] text-black font-black uppercase text-xs tracking-[0.3em] hover:bg-white hover:shadow-lg transition-all active:scale-95">
                Send Request
              </button>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}