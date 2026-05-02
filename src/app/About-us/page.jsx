"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import TeamPage from "./TeamPage";

function useInView(threshold = 0.1) {
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

function FadeIn({ children, className = "", delay = 0 }) {
  const [ref, visible] = useInView(0.08);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ── Company Story ──────────────────────────────────────────────
function CompanyStory({ dark }) {
  return (
    <section className={`py-10 px-6 transition-colors duration-500 ${dark ? "bg-zinc-900" : "bg-[#f0f7ff]"}`}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <FadeIn>
          <p className={`text-[10px] uppercase tracking-[0.4em] mb-1.5 font-black ${dark ? "text-[#facc15]" : "text-[#0d6ebd]"}`}>Who We Are</p>
          <h2 className={`text-2xl sm:text-3xl font-black mb-3 leading-tight ${dark ? "text-white" : "text-[#0a3d6e]"}`}>Our Story</h2>
          <div className={`w-8 h-0.5 mb-4 ${dark ? "bg-[#facc15]" : "bg-[#0d6ebd]"}`} />
          <p className={`text-sm leading-relaxed mb-3 ${dark ? "text-zinc-400" : "text-gray-600"}`}>
            MTBOSS Construction was founded with a single vision — to build infrastructure that stands the test of time. Starting as a small contracting firm, we have grown into one of India's most trusted EPC companies.
          </p>
          <p className={`text-sm leading-relaxed ${dark ? "text-zinc-400" : "text-gray-600"}`}>
            Over two decades, we have delivered hundreds of projects across residential, commercial, industrial, and infrastructure sectors — always on time, within budget, and with uncompromising quality.
          </p>
        </FadeIn>
        <FadeIn delay={150}>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80"
              alt="MTBOSS Construction"
              className="w-full h-56 object-cover shadow-lg"
            />
            <div className={`absolute -bottom-3 -left-3 px-5 py-3 shadow-md ${dark ? "bg-[#facc15]" : "bg-[#0d6ebd]"}`}>
              <p className={`text-2xl font-black leading-none ${dark ? "text-black" : "text-white"}`}>20+</p>
              <p className={`text-[9px] uppercase tracking-widest ${dark ? "text-black" : "text-white"}`}>Years of Excellence</p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ── Mission & Vision ───────────────────────────────────────────
function MissionVision({ dark }) {
  return (
    <section className={`py-10 px-6 transition-colors duration-500 ${dark ? "bg-zinc-800" : "bg-[#e8f4ff]"}`}>
      <div className="max-w-6xl mx-auto">
        <FadeIn className="text-center mb-8">
          <p className={`text-[10px] uppercase tracking-[0.4em] mb-1.5 font-black ${dark ? "text-[#facc15]" : "text-[#0d6ebd]"}`}>What Drives Us</p>
          <h2 className={`text-2xl sm:text-3xl font-black mb-2 ${dark ? "text-white" : "text-[#0a3d6e]"}`}>Mission & Vision</h2>
          <div className={`w-8 h-0.5 mx-auto ${dark ? "bg-[#facc15]" : "bg-[#0d6ebd]"}`} />
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            {
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
              title: "Our Mission",
              text: "To deliver sustainable, technology-led construction and infrastructure solutions that create lasting value for our clients, communities, and the nation — with integrity and precision.",
              inv: false,
            },
            {
              icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>,
              title: "Our Vision",
              text: "To be India's most trusted and innovative construction company — setting new benchmarks in quality, safety, and sustainability for generations to come.",
              inv: true,
            },
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div className={`p-6 border-t-4 shadow-sm transition-colors duration-500 ${item.inv
                ? (dark ? "bg-[#facc15] border-yellow-400" : "bg-[#0d6ebd] border-[#0a3d6e]")
                : (dark ? "bg-zinc-900 border-[#facc15]" : "bg-white border-[#0d6ebd]")
              }`}>
                <div className={`w-10 h-10 flex items-center justify-center mb-4 ${item.inv ? (dark ? "bg-black" : "bg-white") : (dark ? "bg-[#facc15]" : "bg-[#0d6ebd]")}`}>
                  <svg className={`w-5 h-5 ${item.inv ? (dark ? "text-[#facc15]" : "text-[#0d6ebd]") : (dark ? "text-black" : "text-white")}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {item.icon}
                  </svg>
                </div>
                <h3 className={`text-sm font-black mb-2 uppercase tracking-wide ${item.inv ? (dark ? "text-black" : "text-white") : (dark ? "text-[#facc15]" : "text-[#0a3d6e]")}`}>{item.title}</h3>
                <p className={`text-xs leading-relaxed ${item.inv ? (dark ? "text-black/70" : "text-[#cce8ff]") : (dark ? "text-zinc-400" : "text-gray-600")}`}>{item.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Why Choose Us ──────────────────────────────────────────────
function WhyChooseUs({ dark }) {
  const reasons = [
    { icon: "🏗️", title: "20+ Years Experience", desc: "Two decades of delivering complex projects across India." },
    { icon: "✅", title: "On-Time Delivery", desc: "Consistent track record of completing projects on schedule." },
    { icon: "🔬", title: "Technology-Led", desc: "Latest construction technology for superior precision." },
    { icon: "🤝", title: "Trusted Partnerships", desc: "Long-term relationships built on transparency and respect." },
    { icon: "🛡️", title: "Safety First", desc: "Zero-compromise safety standards on every project site." },
    { icon: "🌱", title: "Sustainable Approach", desc: "Eco-conscious methods protecting the environment." },
  ];
  return (
    <section className={`py-10 px-6 transition-colors duration-500 ${dark ? "bg-black" : "bg-white"}`}>
      <div className="max-w-6xl mx-auto">
        <FadeIn className="text-center mb-8">
          <p className={`text-[10px] uppercase tracking-[0.4em] mb-1.5 font-black ${dark ? "text-[#facc15]" : "text-[#0d6ebd]"}`}>Our Strengths</p>
          <h2 className={`text-2xl sm:text-3xl font-black mb-2 ${dark ? "text-white" : "text-[#0a3d6e]"}`}>Why Choose MTBOSS</h2>
          <div className={`w-8 h-0.5 mx-auto ${dark ? "bg-[#facc15]" : "bg-[#0d6ebd]"}`} />
        </FadeIn>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {reasons.map((r, i) => (
            <FadeIn key={i} delay={i * 60}>
              <div className={`group p-4 transition-all duration-300 ${
                dark ? "bg-zinc-900 hover:bg-[#facc15] border border-zinc-800 hover:border-[#facc15]"
                     : "bg-[#f0f7ff] hover:bg-[#0d6ebd]"
              }`}>
                <span className="text-2xl block mb-2">{r.icon}</span>
                <h3 className={`text-xs font-black mb-1 uppercase tracking-wide transition-colors duration-300 ${dark ? "text-[#facc15] group-hover:text-black" : "text-[#0a3d6e] group-hover:text-white"}`}>{r.title}</h3>
                <p className={`text-[11px] leading-relaxed transition-colors duration-300 ${dark ? "text-zinc-400 group-hover:text-black/70" : "text-gray-500 group-hover:text-[#cce8ff]"}`}>{r.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Achievements ───────────────────────────────────────────────
function Achievements({ dark }) {
  const stats = [
    { number: "500+", label: "Projects Completed" },
    { number: "20+", label: "Years Experience" },
    { number: "50+", label: "Cities Across India" },
    { number: "500+", label: "Professionals" },
  ];
  const awards = [
    { year: "2023", title: "Best EPC Company of the Year", body: "Construction World Awards" },
    { year: "2022", title: "Excellence in Infrastructure", body: "India Construction Summit" },
    { year: "2021", title: "Sustainable Builder Award", body: "Green Building Council India" },
    { year: "2019", title: "Top 10 Construction Companies", body: "Forbes India" },
  ];
  return (
    <section className={`py-10 px-6 transition-colors duration-500 ${dark ? "bg-zinc-900" : "bg-[#0d6ebd]"}`}>
      <div className="max-w-6xl mx-auto">
        <FadeIn className="text-center mb-8">
          <p className={`text-[10px] uppercase tracking-[0.4em] mb-1.5 font-black ${dark ? "text-[#facc15]" : "text-[#cce8ff]"}`}>Our Milestones</p>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Achievements & Awards</h2>
          <div className={`w-8 h-0.5 mx-auto ${dark ? "bg-[#facc15]" : "bg-white"}`} />
        </FadeIn>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {stats.map((s, i) => (
            <FadeIn key={i} delay={i * 60}>
              <div className={`text-center py-5 px-3 ${dark ? "bg-zinc-800 border border-zinc-700" : "bg-white/10 backdrop-blur-sm"}`}>
                <p className={`text-3xl sm:text-4xl font-black mb-1 ${dark ? "text-[#facc15]" : "text-white"}`}>{s.number}</p>
                <p className={`text-[9px] uppercase tracking-widest ${dark ? "text-zinc-400" : "text-[#cce8ff]"}`}>{s.label}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Awards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {awards.map((a, i) => (
            <FadeIn key={i} delay={i * 60}>
              <div className={`flex items-start gap-3 p-4 ${dark ? "bg-zinc-800 border border-zinc-700" : "bg-white/10 backdrop-blur-sm"}`}>
                <div className={`text-[10px] font-black px-2.5 py-1.5 shrink-0 uppercase tracking-wide ${dark ? "bg-[#facc15] text-black" : "bg-white text-[#0d6ebd]"}`}>{a.year}</div>
                <div>
                  <h4 className="text-xs font-bold text-white mb-0.5">{a.title}</h4>
                  <p className={`text-[10px] ${dark ? "text-zinc-400" : "text-[#cce8ff]"}`}>{a.body}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Projects ───────────────────────────────────────────────────
const featuredProjects = [
  { id: 1, title: "The Sky Atrium", category: "Commercial", location: "Mumbai, MH", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80" },
  { id: 2, title: "Golden Sands Resort", category: "Hospitality", location: "Goa, IN", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80" },
  { id: 3, title: "Eco-Tech Park", category: "Industrial", location: "Bangalore, KA", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80" },
  { id: 4, title: "Urban Heights", category: "Residential", location: "Delhi, IN", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80" },
  { id: 5, title: "Heritage Resort", category: "Hospitality", location: "Rajasthan, IN", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80" },
  { id: 6, title: "Tech Park Phase II", category: "IT Infrastructure", location: "Bangalore, KA", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" },
];

function OurProjects({ dark }) {
  const [filter, setFilter] = useState("All");
  const categories = ["All", "Commercial", "Residential", "Hospitality", "Industrial"];
  const filtered = filter === "All" ? featuredProjects : featuredProjects.filter((p) => p.category === filter);

  return (
    <section className={`py-10 px-6 transition-colors duration-500 ${dark ? "bg-black" : "bg-zinc-50"}`}>
      <div className="max-w-7xl mx-auto">
        <FadeIn className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] mb-1.5">Our Portfolio</p>
            <h2 className={`text-2xl sm:text-3xl font-black uppercase tracking-tighter ${dark ? "text-white" : "text-zinc-900"}`}>
              Our <span className="text-[#facc15]">Projects</span>
            </h2>
          </div>
          <Link
            href="/FeaturedProjects/ProjectGallery"
            className={`group flex items-center gap-2 px-6 py-3 border-2 font-black uppercase text-[10px] tracking-widest transition-all self-start ${
              dark ? "border-[#facc15] text-[#facc15] hover:bg-[#facc15] hover:text-black"
                   : "border-zinc-800 text-zinc-800 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            View Full Portfolio
            <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </FadeIn>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all border ${
                filter === cat ? "bg-[#facc15] border-[#facc15] text-black"
                : dark ? "border-zinc-700 text-zinc-500 hover:border-[#facc15] hover:text-[#facc15]"
                       : "border-zinc-300 text-zinc-400 hover:border-zinc-800 hover:text-zinc-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          {filtered.map((project, idx) => (
            <div key={project.id} className="group relative h-64 overflow-hidden bg-zinc-800">
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-40"
              />
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <p className="text-[#facc15] text-[9px] font-black uppercase tracking-widest mb-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {project.category} — {project.location}
                </p>
                <h3 className="text-white text-base font-black uppercase leading-tight mb-2">{project.title}</h3>
                <div className="h-0 group-hover:h-8 overflow-hidden transition-all duration-500">
                  <Link href="/FeaturedProjects/ProjectGallery" className="inline-block bg-[#facc15] text-black px-4 py-1.5 text-[9px] font-black uppercase tracking-widest hover:bg-white transition-colors">
                    Explore Details
                  </Link>
                </div>
              </div>
              <span className="absolute top-3 right-3 text-white/10 text-3xl font-black italic group-hover:text-[#facc15]/20 transition-colors">
                0{idx + 1}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Strip */}
        <FadeIn>
          <div className={`mt-6 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 ${dark ? "bg-zinc-900 border border-zinc-800" : "bg-white border border-gray-100 shadow-sm"}`}>
            <div>
              <p className={`text-[9px] font-black uppercase tracking-widest mb-0.5 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Want to see more?</p>
              <p className={`text-sm font-black uppercase ${dark ? "text-white" : "text-zinc-800"}`}>Explore our complete project portfolio</p>
            </div>
            <Link href="/FeaturedProjects/ProjectGallery" className="px-8 py-3 bg-[#facc15] text-black font-black uppercase text-[9px] tracking-widest hover:bg-yellow-400 transition-all shrink-0">
              View All Projects →
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ── Meet The Team CTA ──────────────────────────────────────────
function MeetTeamCTA({ dark, onShowTeam }) {
  return (
    <section className={`py-10 px-6 transition-colors duration-500 ${dark ? "bg-zinc-900" : "bg-white"}`}>
      <FadeIn>
        <div className="max-w-6xl mx-auto">
          <div className={`relative overflow-hidden p-8 sm:p-10 ${dark ? "bg-zinc-950 border border-zinc-800" : "bg-[#0a3d6e]"}`}>
            <span className="absolute -right-4 top-1/2 -translate-y-1/2 text-[80px] sm:text-[120px] font-black uppercase leading-none pointer-events-none select-none"
              style={{ color: dark ? "rgba(250,204,21,0.04)" : "rgba(255,255,255,0.05)" }}>
              TEAM
            </span>
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className={`text-[9px] uppercase tracking-[0.4em] font-black mb-2 ${dark ? "text-[#facc15]" : "text-[#cce8ff]"}`}>Leadership</p>
                <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-tight">
                  Meet the Minds<br />Behind MTBOSS
                </h2>
                <p className={`text-xs mt-2 max-w-sm ${dark ? "text-zinc-400" : "text-[#99ccf0]"}`}>
                  Our leadership team brings decades of expertise across engineering, finance, and operations.
                </p>
              </div>
              <button
                onClick={onShowTeam}
                className="shrink-0 flex items-center gap-2 px-7 py-3.5 bg-[#facc15] text-black font-black uppercase text-[10px] tracking-widest hover:bg-yellow-300 transition-all group"
              >
                Meet Our Team
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

// ── About Content ──────────────────────────────────────────────
function AboutContent({ dark, onShowTeam }) {
  return (
    <main className={`transition-colors duration-500 ${dark ? "bg-black" : "bg-white"}`}>
      <section
        className="relative flex items-center justify-center text-center"
        style={{
          height: "260px",
          backgroundImage: "url(https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className={`absolute inset-0 transition-colors duration-500 ${dark ? "bg-black/80" : "bg-[#0d6ebd]/75"}`} />
        <div className="relative z-10 px-6">
          <p className={`text-[10px] uppercase tracking-[0.4em] mb-2 ${dark ? "text-[#facc15]" : "text-[#cce8ff]"}`}>MTBOSS Construction</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">About Us</h1>
          <div className={`w-8 h-0.5 mx-auto mb-3 ${dark ? "bg-[#facc15]" : "bg-white"}`} />
          <p className={`text-xs max-w-md mx-auto leading-relaxed ${dark ? "text-zinc-400" : "text-[#cce8ff]"}`}>
            Building India's future — one project at a time.
          </p>
        </div>
      </section>
      <CompanyStory dark={dark} />
      <MissionVision dark={dark} />
      <WhyChooseUs dark={dark} />
      <Achievements dark={dark} />
      <div className={`h-px w-full ${dark ? "bg-zinc-800" : "bg-gray-100"}`} />
      <OurProjects dark={dark} />
      <MeetTeamCTA dark={dark} onShowTeam={onShowTeam} />
    </main>
  );
}

// ── Main Page Export ───────────────────────────────────────────
export default function AboutPage() {
  const dark = useDarkMode();
  const [showTeam, setShowTeam] = useState(false);

  const handleShowTeam = () => {
    setShowTeam(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setShowTeam(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (showTeam) {
    return (
      <div>
        {/* Breadcrumb back bar */}
        <div
          className={`flex items-center gap-3 px-6 py-3 border-b text-[10px] font-black uppercase tracking-widest ${dark ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-100"}`}
          style={{ position: "sticky", top: 0, zIndex: 99998 }}
        >
          <button
            onClick={handleBack}
            className={`flex items-center gap-2 transition-colors hover:text-[#facc15] ${dark ? "text-zinc-400" : "text-zinc-500"}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            About Us
          </button>
          <span className={dark ? "text-zinc-700" : "text-zinc-200"}>/</span>
          <span className={dark ? "text-[#facc15]" : "text-[#0d6ebd]"}>Leadership Team</span>
        </div>
        <TeamPage />
      </div>
    );
  }

  return <AboutContent dark={dark} onShowTeam={handleShowTeam} />;
}