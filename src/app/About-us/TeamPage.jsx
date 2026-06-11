"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

function useDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const html = document.documentElement;
    const update = () => setDark(html.classList.contains("dark-mode"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return dark;
}

function useInView(threshold = 0.08) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
}

function FadeIn({ children, className = "", delay = 0 }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// ── Hardcoded Admin ─────────────────────────────────────────────
const ADMIN = {
  id: "admin",
  name: "MTbossAdmin",
  title: "Chairman & Managing Director",
  category: "Executive Leadership",
  profile_picture: null,
  experience: 20,
  description:
    "Founder of MTBOSS, with a vision to redefine construction and real-estate excellence in India. Under their leadership the company has grown into a trusted platform connecting clients with top-tier professionals, projects, and services nationwide.",
  specializations: ["Strategic Planning", "Business Development", "EPC Management", "Client Relations"],
  city: "India",
  linkedin: null,
  instagram: null,
  website: null,
  isAdmin: true,
};

// ── Social icon SVGs ────────────────────────────────────────────
function LinkedInIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17A1.4 1.4 0 0 1 15.71 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3z" />
    </svg>
  );
}
function WebIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

// ── Admin Featured Card ─────────────────────────────────────────
function AdminCard({ dark }) {
  const accent = dark ? "text-[#facc15]" : "text-[#0d6ebd]";
  const accentBg = dark ? "bg-[#facc15] text-black" : "bg-[#0d6ebd] text-white";
  return (
    <FadeIn>
      <div className={`relative overflow-hidden border-2 ${dark ? "border-[#facc15] bg-zinc-950" : "border-[#0d6ebd] bg-white shadow-xl"}`}>
        <div className="flex flex-col sm:flex-row">
          {/* Photo */}
          <div className={`relative sm:w-56 shrink-0 flex items-center justify-center ${dark ? "bg-zinc-900" : "bg-[#e8f4ff]"}`} style={{ minHeight: 220 }}>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl font-black ${accentBg}`}>
              M
            </div>
            <div className={`absolute top-3 left-3 px-2.5 py-1 text-[8px] font-black uppercase tracking-widest ${accentBg}`}>
              Founder
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
              <div>
                <h2 className={`text-xl font-black uppercase tracking-tight ${dark ? "text-white" : "text-zinc-900"}`}>{ADMIN.name}</h2>
                <p className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${accent}`}>{ADMIN.title}</p>
                <p className={`text-[10px] mt-1 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>📍 {ADMIN.city} &nbsp;·&nbsp; {ADMIN.experience}+ Years</p>
              </div>
              <span className={`px-3 py-1.5 text-[8px] font-black uppercase tracking-widest shrink-0 self-start ${accentBg}`}>
                {ADMIN.category}
              </span>
            </div>

            <p className={`text-[11px] leading-relaxed mb-4 ${dark ? "text-zinc-400" : "text-zinc-500"}`}>{ADMIN.description}</p>

            <div className="flex flex-wrap gap-1.5">
              {ADMIN.specializations.map((tag) => (
                <span key={tag} className={`px-2 py-1 text-[8px] font-black uppercase tracking-wide border ${dark ? "border-[#facc15]/30 text-[#facc15]/70 bg-[#facc15]/5" : "border-[#0d6ebd]/30 text-[#0d6ebd]/70 bg-[#e8f4ff]"}`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

// ── Professional Card ───────────────────────────────────────────
function ProfCard({ member, dark, idx }) {
  return (
    <Link href={`/Services/professionals/${member.id}`} className="block h-full">
      <ProfCardInner member={member} dark={dark} idx={idx} />
    </Link>
  );
}

function ProfCardInner({ member, dark, idx }) {
  const specs = Array.isArray(member.specializations)
    ? member.specializations
    : (typeof member.specializations === "string"
        ? JSON.parse(member.specializations || "[]")
        : []);

  const accent = dark ? "text-[#facc15]" : "text-[#0d6ebd]";
  const accentBg = dark ? "bg-[#facc15] text-black" : "bg-[#0d6ebd] text-white";
  const initials = member.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <FadeIn delay={idx * 60}>
      <div className={`group flex flex-col h-full border transition-all duration-300 cursor-pointer ${
        dark
          ? "bg-zinc-950 border-zinc-800 hover:border-[#facc15]/60"
          : "bg-white border-zinc-100 hover:border-zinc-300 hover:shadow-lg"
      }`}>
        {/* Photo / Avatar */}
        <div className="relative overflow-hidden" style={{ height: 200 }}>
          {member.profile_picture ? (
            <img
              src={member.profile_picture}
              alt={member.name}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center text-4xl font-black ${dark ? "bg-zinc-900" : "bg-[#e8f4ff]"}`}>
              <span className={accent}>{initials}</span>
            </div>
          )}
          {/* gradient */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)" }} />
          {/* category badge */}
          <div className={`absolute top-3 left-3 px-2 py-1 text-[7px] font-black uppercase tracking-widest ${accentBg}`}>
            {member.category}
          </div>
          {/* experience badge */}
          <div className={`absolute top-3 right-3 px-2 py-1 text-[7px] font-black uppercase tracking-widest border ${dark ? "border-zinc-600 text-white bg-black/50" : "border-white/40 text-white bg-black/40"}`}>
            {member.experience}+ Yrs
          </div>
          {/* name overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-white text-sm font-black uppercase tracking-tight leading-tight">{member.name}</h3>
            <p className={`text-[9px] font-black uppercase tracking-widest mt-0.5 text-[#facc15]`}>{member.title}</p>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-4">
          {/* Location */}
          {member.city && (
            <p className={`text-[9px] mb-3 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>📍 {member.city}</p>
          )}

          {/* Bio */}
          <p className={`text-[10px] leading-relaxed mb-3 flex-1 line-clamp-3 ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
            {member.description}
          </p>

          {/* Specializations */}
          {specs.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {specs.slice(0, 4).map((tag) => (
                <span key={tag} className={`px-2 py-0.5 text-[7px] font-black uppercase tracking-wide border ${dark ? "border-zinc-800 text-zinc-500" : "border-zinc-200 text-zinc-400"}`}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer: social links + view profile */}
          <div className={`flex items-center justify-between gap-2 pt-3 border-t ${dark ? "border-zinc-800" : "border-zinc-100"}`}>
            <div className="flex items-center gap-2">
              {member.linkedin && (
                <span className={`p-1.5 border ${dark ? "border-zinc-700 text-zinc-500" : "border-zinc-200 text-zinc-400"}`}>
                  <LinkedInIcon />
                </span>
              )}
              {member.instagram && (
                <span className={`p-1.5 border ${dark ? "border-zinc-700 text-zinc-500" : "border-zinc-200 text-zinc-400"}`}>
                  <InstagramIcon />
                </span>
              )}
              {member.website && (
                <span className={`p-1.5 border ${dark ? "border-zinc-700 text-zinc-500" : "border-zinc-200 text-zinc-400"}`}>
                  <WebIcon />
                </span>
              )}
            </div>
            <span className={`flex items-center gap-1 text-[8px] font-black uppercase tracking-widest transition-colors ${dark ? "text-zinc-600 group-hover:text-[#facc15]" : "text-zinc-300 group-hover:text-[#0d6ebd]"}`}>
              View Profile
              <svg className="w-2.5 h-2.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

// ── Main TeamPage ───────────────────────────────────────────────
export default function TeamPage({ onBack }) {
  const dark = useDarkMode();
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch("/api/professional-services")
      .then((r) => r.json())
      .then((res) => { if (res.success) setProfessionals(res.data); })
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...Array.from(new Set(professionals.map((p) => p.category)))];
  const filtered = filter === "All" ? professionals : professionals.filter((p) => p.category === filter);

  const bg = dark ? "bg-black" : "bg-white";
  const muted = dark ? "text-zinc-400" : "text-zinc-500";
  const divider = dark ? "border-zinc-800" : "border-zinc-100";

  return (
    <main className={`min-h-screen transition-colors duration-500 ${bg}`}>

      {/* ── Hero ── */}
      <section
        className="relative flex items-center justify-center text-center"
        style={{
          height: 260,
          backgroundImage: "url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <div className={`absolute inset-0 ${dark ? "bg-black/85" : "bg-[#0a3d6e]/82"}`} />
        <div className="relative z-10 px-6">
          <p className={`text-[9px] uppercase tracking-[0.5em] mb-2 font-black ${dark ? "text-[#facc15]" : "text-[#cce8ff]"}`}>MTBOSS Construction</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter mb-3 leading-none">
            Our <span className="text-[#facc15]">Team</span>
          </h1>
          <div className={`w-8 h-0.5 mx-auto mb-3 ${dark ? "bg-[#facc15]" : "bg-white"}`} />
          <p className={`text-xs max-w-md mx-auto leading-relaxed ${dark ? "text-zinc-400" : "text-[#cce8ff]"}`}>
            The professionals who power every project, service, and relationship at MTBOSS.
          </p>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <div className={`border-b ${divider} ${dark ? "bg-zinc-950" : "bg-zinc-50"}`}>
        <div className="max-w-6xl mx-auto grid grid-cols-4 text-center" style={{ borderColor: dark ? "#27272a" : "#f4f4f5" }}>
          {[
            { val: "500+", label: "Professionals" },
            { val: loading ? "—" : `${professionals.length + 1}`, label: "Team Members" },
            { val: "20+", label: "Categories" },
            { val: "India", label: "Nationwide" },
          ].map((s, i) => (
            <div key={i} className={`py-5 px-4 border-r last:border-r-0 ${dark ? "border-zinc-800" : "border-zinc-100"}`}>
              <p className={`text-xl sm:text-2xl font-black ${dark ? "text-[#facc15]" : "text-[#0d6ebd]"}`}>{s.val}</p>
              <p className={`text-[8px] uppercase tracking-widest ${muted}`}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Admin / Founder ── */}
      <section className={`py-10 px-6 ${dark ? "bg-black" : "bg-white"}`}>
        <div className="max-w-6xl mx-auto">
          <FadeIn className="mb-6">
            <p className="text-[#facc15] text-[9px] font-black uppercase tracking-[0.4em] mb-1">Executive Leadership</p>
            <h2 className={`text-2xl font-black uppercase tracking-tighter ${dark ? "text-white" : "text-zinc-900"}`}>
              Founder &amp; Director
            </h2>
          </FadeIn>
          <AdminCard dark={dark} />
        </div>
      </section>

      <div className={`h-px w-full ${divider}`} />

      {/* ── Professionals Team ── */}
      <section className={`py-10 px-6 ${dark ? "bg-zinc-950" : "bg-zinc-50"}`}>
        <div className="max-w-6xl mx-auto">
          <FadeIn className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-[#facc15] text-[9px] font-black uppercase tracking-[0.4em] mb-1">Our Professionals</p>
                <h2 className={`text-2xl font-black uppercase tracking-tighter ${dark ? "text-white" : "text-zinc-900"}`}>
                  Expert Team Members
                </h2>
              </div>
              {/* Category filter */}
              {categories.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className={`px-3 py-1.5 text-[8px] font-black uppercase tracking-widest border transition-all ${
                        filter === cat
                          ? "bg-[#facc15] border-[#facc15] text-black"
                          : dark
                          ? "border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300"
                          : "border-zinc-300 text-zinc-400 hover:border-zinc-600 hover:text-zinc-700"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </FadeIn>

          {loading && (
            <div className={`text-center py-20 text-sm font-black uppercase tracking-widest ${dark ? "text-zinc-600" : "text-zinc-300"}`}>
              Loading team members…
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className={`text-center py-20 border ${dark ? "border-zinc-800 text-zinc-600" : "border-zinc-200 text-zinc-400"}`}>
              <p className="text-sm font-black uppercase tracking-widest mb-2">No professionals yet</p>
              <p className="text-[10px]">Team members will appear here once approved.</p>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((member, i) => (
                <ProfCard key={member.id} member={member} dark={dark} idx={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Values ── */}
      <section className={`py-10 px-6 ${dark ? "bg-black" : "bg-[#0a3d6e]"}`}>
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-8">
            <p className={`text-[9px] uppercase tracking-[0.4em] font-black mb-1.5 ${dark ? "text-[#facc15]" : "text-[#cce8ff]"}`}>What Drives Us</p>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">What Unites Our Team</h2>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: "🎯", val: "Integrity", desc: "Honest in every action" },
              { icon: "⚙️", val: "Precision", desc: "Excellence in execution" },
              { icon: "🤝", val: "Collaboration", desc: "Stronger together" },
              { icon: "🌱", val: "Innovation", desc: "Building tomorrow today" },
            ].map((v, i) => (
              <FadeIn key={i} delay={i * 60}>
                <div className={`p-5 text-center border transition-all hover:border-[#facc15] ${dark ? "border-zinc-800 bg-zinc-950 hover:bg-zinc-900" : "border-white/20 bg-white/10 hover:bg-white/20"}`}>
                  <span className="text-3xl block mb-3">{v.icon}</span>
                  <p className="text-sm font-black uppercase tracking-wide mb-1 text-white">{v.val}</p>
                  <p className={`text-[9px] ${dark ? "text-zinc-500" : "text-[#99ccf0]"}`}>{v.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={`py-10 px-6 ${dark ? "bg-zinc-950" : "bg-white"}`}>
        <FadeIn>
          <div className="max-w-6xl mx-auto">
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-6 p-7 border ${dark ? "border-zinc-800 bg-zinc-900" : "border-zinc-100 bg-zinc-50"}`}>
              <div>
                <p className={`text-[9px] uppercase tracking-[0.4em] font-black mb-1 ${dark ? "text-[#facc15]" : "text-[#0d6ebd]"}`}>Join Our Network</p>
                <p className={`text-base font-black uppercase tracking-tight ${dark ? "text-white" : "text-zinc-900"}`}>Become a Professional Partner</p>
                <p className={`text-xs mt-1 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>List your services and connect with thousands of clients across India.</p>
              </div>
              <div className="flex gap-3 shrink-0">
                {onBack && (
                  <button
                    onClick={onBack}
                    className={`px-6 py-3 text-[9px] font-black uppercase tracking-widest border transition-all ${dark ? "border-zinc-700 text-zinc-300 hover:border-zinc-500" : "border-zinc-300 text-zinc-600 hover:border-zinc-700"}`}
                  >
                    ← About Us
                  </button>
                )}
                <Link href="/ProfessionalServices" className="px-6 py-3 bg-[#facc15] text-black text-[9px] font-black uppercase tracking-widest hover:bg-yellow-300 transition-all">
                  Join as Professional →
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

    </main>
  );
}
