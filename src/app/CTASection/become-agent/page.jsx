"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function BecomeAgentPage() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark-mode"));
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <main className={`min-h-screen py-24 px-6 transition-colors duration-500 ${isDark ? "bg-black" : "bg-white"}`}>
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation */}
        <Link href="/CTASection" className="inline-flex items-center gap-2 text-[#facc15] font-black uppercase text-[10px] tracking-widest mb-12 hover:gap-4 transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Hub
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Left Content: Benefits */}
          <div>
            <p className="text-[#facc15] text-xs font-black uppercase tracking-[0.4em] mb-4">Partnership Program</p>
            <h1 className={`text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-10 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Grow With <br /> <span className="text-[#facc15]">MTBOSS.</span>
            </h1>

            <div className="space-y-10">
              {[
                { title: "High Commission", desc: "Industry-leading incentives for every successful project referral." },
                { title: "Project Support", desc: "Direct access to our engineering team for technical feasibility reports." },
                { title: "Marketing Kit", desc: "Get professional branding materials and project portfolios to showcase." }
              ].map((benefit, idx) => (
                <div key={idx} className="flex gap-6 group">
                  <span className="text-4xl font-black text-zinc-800/20 group-hover:text-[#facc15]/30 transition-colors">0{idx + 1}</span>
                  <div>
                    <h3 className={`text-xl font-black uppercase tracking-tight mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>{benefit.title}</h3>
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-500' : 'text-zinc-600'}`}>{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content: Registration Form */}
          <div className={`relative p-8 md:p-12 border ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#facc15] clip-path-polygon" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
            
            <h2 className={`text-2xl font-black uppercase tracking-tighter mb-8 ${isDark ? 'text-white' : 'text-zinc-900'}`}>Partner Registration</h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Agent Name</label>
                  <input type="text" className={`w-full bg-transparent border-b-2 py-3 text-sm font-bold outline-none transition-all ${isDark ? 'border-zinc-800 text-white focus:border-[#facc15]' : 'border-zinc-200 text-zinc-900 focus:border-black'}`} />
                </div>
                <div>
                  <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Phone Number</label>
                  <input type="tel" className={`w-full bg-transparent border-b-2 py-3 text-sm font-bold outline-none transition-all ${isDark ? 'border-zinc-800 text-white focus:border-[#facc15]' : 'border-zinc-200 text-zinc-900 focus:border-black'}`} />
                </div>
              </div>

              <div>
                <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Company Name (Optional)</label>
                <input type="text" className={`w-full bg-transparent border-b-2 py-3 text-sm font-bold outline-none transition-all ${isDark ? 'border-zinc-800 text-white focus:border-[#facc15]' : 'border-zinc-200 text-zinc-900 focus:border-black'}`} />
              </div>

              <div>
                <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Primary Region / State</label>
                <input type="text" placeholder="e.g. Uttar Pradesh" className={`w-full bg-transparent border-b-2 py-3 text-sm font-bold outline-none transition-all ${isDark ? 'border-zinc-800 text-white focus:border-[#facc15]' : 'border-zinc-200 text-zinc-900 focus:border-black'}`} />
              </div>

              <div>
                <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Experience in Infrastructure</label>
                <select className={`w-full bg-transparent border-b-2 py-3 text-sm font-bold outline-none ${isDark ? 'border-zinc-800 text-white' : 'border-zinc-200 text-zinc-900'}`}>
                  <option className="text-black">No Experience</option>
                  <option className="text-black">1-3 Years</option>
                  <option className="text-black">3-5 Years</option>
                  <option className="text-black">5+ Years</option>
                </select>
              </div>

              <button className="w-full py-5 bg-black text-white font-black uppercase text-xs tracking-[0.3em] hover:bg-[#facc15] hover:text-black transition-all mt-4 border border-black">
                Submit Application
              </button>
            </form>

            <p className={`text-[9px] uppercase tracking-widest mt-6 text-center ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
              By submitting, you agree to our partnership terms and background verification process.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}