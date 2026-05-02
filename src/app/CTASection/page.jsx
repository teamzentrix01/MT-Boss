"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const InquiryCard = ({ title, subtitle, icon, isDark, href }) => (
  <div className={`p-8 border-l-4 transition-all duration-300 ${
    isDark ? "bg-zinc-950 border-[#facc15] hover:bg-zinc-900" : "bg-zinc-50 border-black hover:bg-white hover:shadow-xl"
  }`}>
    <div className="mb-4 text-[#facc15]">{icon}</div>
    <h3 className={`text-2xl font-black uppercase tracking-tighter mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>{title}</h3>
    <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-zinc-500' : 'text-zinc-600'}`}>{subtitle}</p>
    <Link href={href}>
      <button className={`w-full px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${
        isDark ? 'bg-[#facc15] text-black' : 'bg-black text-white hover:bg-[#facc15] hover:text-black'
      }`}>
        Proceed Now
      </button>
    </Link>
  </div>
);

export default function CTAHubPage() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark-mode"));
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <main className={`min-h-screen transition-colors duration-500 ${isDark ? "bg-black" : "bg-white"}`}>
      <section className={`pt-40 pb-20 px-6 text-center border-b ${isDark ? 'border-zinc-900' : 'border-zinc-100'}`}>
        <div className="max-w-4xl mx-auto">
          <p className="text-[#facc15] text-xs font-black uppercase tracking-[0.4em] mb-4">Connect With MTBOSS</p>
          <h1 className={`text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            Ready to <span className="text-[#facc15]">Build</span> <br /> Something Big?
          </h1>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <InquiryCard 
            isDark={isDark} 
            title="Get a Quote" 
            href="/CTASection/get-quote"
            subtitle="Send us your project requirements and get a detailed engineering estimate."
            icon={<svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
          />
          <InquiryCard 
            isDark={isDark} 
            title="Contact Us" 
            href="/CTASection/contact"
            subtitle="Need immediate assistance? Speak with our experts about your infrastructure concerns."
            icon={<svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
          />
          <InquiryCard 
            isDark={isDark} 
            title="Become an Agent" 
            href="/CTASection/become-agent"
            subtitle="Join MTBOSS as a strategic partner and help us deliver sustainable projects."
            icon={<svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
          />
        </div>
      </section>
    </main>
  );
}