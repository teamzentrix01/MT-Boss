"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ContactPage() {
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
        
        {/* Breadcrumb */}
        <Link href="/CTASection" className="inline-flex items-center gap-2 text-[#facc15] font-black uppercase text-[10px] tracking-widest mb-12 hover:gap-4 transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Hub
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: Contact Info (4 Columns) */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <p className="text-[#facc15] text-xs font-black uppercase tracking-[0.4em] mb-4">Get In Touch</p>
              <h1 className={`text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-8 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                Let's Talk <br /> <span className="text-[#facc15]">Business.</span>
              </h1>
            </div>

            <div className="space-y-8">
              {/* Office Address */}
              <div className="flex gap-6">
                <div className={`w-12 h-12 flex items-center justify-center border ${isDark ? 'border-zinc-800 text-white' : 'border-zinc-200 text-zinc-900'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <p className="text-[#facc15] text-[10px] font-black uppercase tracking-widest mb-1">Headquarters</p>
                  <p className={`font-bold leading-tight ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>123 Industrial Hub, Phase II,<br />Sector 62, Noida, UP - 201301</p>
                </div>
              </div>

              {/* Direct Contact */}
              <div className="flex gap-6">
                <div className={`w-12 h-12 flex items-center justify-center border ${isDark ? 'border-zinc-800 text-white' : 'border-zinc-200 text-zinc-900'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <div>
                  <p className="text-[#facc15] text-[10px] font-black uppercase tracking-widest mb-1">Call Us Directly</p>
                  <p className={`font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>+91 98765 43210</p>
                  <p className={`font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>0120-456-7890</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-6">
                <div className={`w-12 h-12 flex items-center justify-center border ${isDark ? 'border-zinc-800 text-white' : 'border-zinc-200 text-zinc-900'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <p className="text-[#facc15] text-[10px] font-black uppercase tracking-widest mb-1">Email Support</p>
                  <p className={`font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>info@mtboss.in</p>
                  <p className={`font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>projects@mtboss.in</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form (7 Columns) */}
          <div className={`lg:col-span-7 p-8 md:p-12 border ${isDark ? 'bg-zinc-950 border-zinc-900' : 'bg-zinc-50 border-zinc-100'}`}>
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative">
                  <input type="text" placeholder="YOUR NAME" className={`w-full bg-transparent border-b-2 py-4 text-sm font-black outline-none transition-all ${isDark ? 'border-zinc-800 text-white focus:border-[#facc15]' : 'border-zinc-200 text-zinc-900 focus:border-black'}`} />
                </div>
                <div className="relative">
                  <input type="email" placeholder="EMAIL ADDRESS" className={`w-full bg-transparent border-b-2 py-4 text-sm font-black outline-none transition-all ${isDark ? 'border-zinc-800 text-white focus:border-[#facc15]' : 'border-zinc-200 text-zinc-900 focus:border-black'}`} />
                </div>
              </div>

              <div className="relative">
                <input type="text" placeholder="SUBJECT" className={`w-full bg-transparent border-b-2 py-4 text-sm font-black outline-none transition-all ${isDark ? 'border-zinc-800 text-white focus:border-[#facc15]' : 'border-zinc-200 text-zinc-900 focus:border-black'}`} />
              </div>

              <div className="relative">
                <textarea rows="5" placeholder="HOW CAN WE HELP YOU?" className={`w-full bg-transparent border-b-2 py-4 text-sm font-black outline-none transition-all resize-none ${isDark ? 'border-zinc-800 text-white focus:border-[#facc15]' : 'border-zinc-200 text-zinc-900 focus:border-black'}`}></textarea>
              </div>

              <button className="flex items-center justify-between w-full px-8 py-5 bg-[#facc15] text-black font-black uppercase text-xs tracking-[0.3em] hover:bg-white transition-all group">
                Send Message
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}