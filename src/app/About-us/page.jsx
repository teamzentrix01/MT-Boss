"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

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

// ── Company Story ──────────────────────────────────────────────
function CompanyStory({ dark }) {
  const [ref, visible] = useInView(0.1);
  return (
    <section className={`py-16 px-6 transition-colors duration-500 ${dark ? "bg-zinc-900" : "bg-[#f0f7ff]"}`}>
      <div
        ref={ref}
        className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(32px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <div>
          <p className={`text-xs uppercase tracking-widest mb-2 font-black ${dark ? "text-[#facc15]" : "text-[#0d6ebd]"}`}>Who We Are</p>
          <h2 className={`text-3xl sm:text-4xl font-black mb-4 leading-tight ${dark ? "text-white" : "text-[#0a3d6e]"}`}>Our Story</h2>
          <div className={`w-10 h-0.5 mb-6 rounded ${dark ? "bg-[#facc15]" : "bg-[#0d6ebd]"}`} />
          <p className={`text-sm sm:text-base leading-relaxed mb-4 ${dark ? "text-zinc-400" : "text-gray-600"}`}>
            MT BOSS Construction was founded with a single vision — to build infrastructure that stands the test of time. Starting as a small contracting firm, we have grown into one of India's most trusted engineering, procurement, and construction companies.
          </p>
          <p className={`text-sm sm:text-base leading-relaxed mb-4 ${dark ? "text-zinc-400" : "text-gray-600"}`}>
            Over two decades, we have delivered hundreds of projects across residential, commercial, industrial, and infrastructure sectors — always on time, always within budget, and always with uncompromising quality.
          </p>
          <p className={`text-sm sm:text-base leading-relaxed ${dark ? "text-zinc-400" : "text-gray-600"}`}>
            Today, MT BOSS operates across India with a team of 500+ skilled professionals, engineers, and project managers — driven by a shared commitment to excellence and innovation.
          </p>
        </div>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80"
            alt="MT BOSS Construction"
            className="w-full h-80 object-cover rounded-sm shadow-lg"
          />
          <div className={`absolute -bottom-4 -left-4 px-6 py-4 rounded-sm shadow-md ${dark ? "bg-[#facc15]" : "bg-[#0d6ebd]"}`}>
            <p className={`text-3xl font-black ${dark ? "text-black" : "text-white"}`}>20+</p>
            <p className={`text-xs uppercase tracking-widest ${dark ? "text-black" : "text-white"}`}>Years of Excellence</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Mission & Vision ───────────────────────────────────────────
function MissionVision({ dark }) {
  const [ref, visible] = useInView(0.1);
  return (
    <section className={`py-16 px-6 transition-colors duration-500 ${dark ? "bg-zinc-800" : "bg-[#e8f4ff]"}`}>
      <div
        ref={ref}
        className="max-w-6xl mx-auto"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(32px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <div className="text-center mb-12">
          <p className={`text-xs uppercase tracking-widest mb-2 font-black ${dark ? "text-[#facc15]" : "text-[#0d6ebd]"}`}>What Drives Us</p>
          <h2 className={`text-3xl sm:text-4xl font-black mb-3 ${dark ? "text-white" : "text-[#0a3d6e]"}`}>Mission and Vision</h2>
          <div className={`w-10 h-0.5 mx-auto rounded ${dark ? "bg-[#facc15]" : "bg-[#0d6ebd]"}`} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className={`rounded-sm shadow-md p-8 border-t-4 transition-colors duration-500 ${dark ? "bg-zinc-900 border-[#facc15]" : "bg-white border-[#0d6ebd]"}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-5 ${dark ? "bg-[#facc15]" : "bg-[#0d6ebd]"}`}>
              <svg className={`w-6 h-6 ${dark ? "text-black" : "text-white"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className={`text-xl font-black mb-3 uppercase tracking-wide ${dark ? "text-[#facc15]" : "text-[#0a3d6e]"}`}>Our Mission</h3>
            <p className={`text-sm leading-relaxed ${dark ? "text-zinc-400" : "text-gray-600"}`}>
              To deliver sustainable, technology-led construction and infrastructure solutions that create lasting value for our clients, communities, and the nation — with integrity, precision, and innovation at every step.
            </p>
          </div>
          <div className={`rounded-sm shadow-md p-8 border-t-4 transition-colors duration-500 ${dark ? "bg-[#facc15] border-yellow-400" : "bg-[#0d6ebd] border-[#0a3d6e]"}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-5 ${dark ? "bg-black" : "bg-white"}`}>
              <svg className={`w-6 h-6 ${dark ? "text-[#facc15]" : "text-[#0d6ebd]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className={`text-xl font-black mb-3 uppercase tracking-wide ${dark ? "text-black" : "text-white"}`}>Our Vision</h3>
            <p className={`text-sm leading-relaxed ${dark ? "text-black/70" : "text-[#cce8ff]"}`}>
              To be India's most trusted and innovative construction company — setting new benchmarks in quality, safety, and sustainability while transforming the built environment for generations to come.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Why Choose Us ──────────────────────────────────────────────
function WhyChooseUs({ dark }) {
  const [ref, visible] = useInView(0.1);
  const reasons = [
    { icon: "🏗️", title: "20+ Years Experience", desc: "Two decades of delivering complex projects across India with proven expertise." },
    { icon: "✅", title: "On-Time Delivery", desc: "We have a consistent track record of completing projects on schedule, every time." },
    { icon: "🔬", title: "Technology-Led", desc: "We leverage the latest construction technology for superior precision and efficiency." },
    { icon: "🤝", title: "Trusted Partnerships", desc: "Long-term relationships with top clients built on transparency and mutual respect." },
    { icon: "🛡️", title: "Safety First", desc: "Strict safety protocols and zero-compromise standards on every single project site." },
    { icon: "🌱", title: "Sustainable Approach", desc: "Eco-conscious construction methods that protect the environment for future generations." },
  ];
  return (
    <section className={`py-16 px-6 transition-colors duration-500 ${dark ? "bg-black" : "bg-white"}`}>
      <div
        ref={ref}
        className="max-w-6xl mx-auto"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(32px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <div className="text-center mb-12">
          <p className={`text-xs uppercase tracking-widest mb-2 font-black ${dark ? "text-[#facc15]" : "text-[#0d6ebd]"}`}>Our Strengths</p>
          <h2 className={`text-3xl sm:text-4xl font-black mb-3 ${dark ? "text-white" : "text-[#0a3d6e]"}`}>Why Choose MT BOSS</h2>
          <div className={`w-10 h-0.5 mx-auto rounded ${dark ? "bg-[#facc15]" : "bg-[#0d6ebd]"}`} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r, i) => (
            <div
              key={i}
              className={`group rounded-sm p-6 transition-all duration-300 shadow-sm hover:shadow-lg ${
                dark ? "bg-zinc-900 hover:bg-[#facc15] border border-zinc-800 hover:border-[#facc15]" : "bg-[#f0f7ff] hover:bg-[#0d6ebd]"
              }`}
            >
              <span className="text-3xl block mb-4">{r.icon}</span>
              <h3 className={`text-base font-black mb-2 uppercase tracking-wide transition-colors duration-300 ${dark ? "text-[#facc15] group-hover:text-black" : "text-[#0a3d6e] group-hover:text-white"}`}>{r.title}</h3>
              <p className={`text-sm leading-relaxed transition-colors duration-300 ${dark ? "text-zinc-400 group-hover:text-black/70" : "text-gray-500 group-hover:text-[#cce8ff]"}`}>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Achievements ───────────────────────────────────────────────
function Achievements({ dark }) {
  const [ref, visible] = useInView(0.1);
  const stats = [
    { number: "500+", label: "Projects Completed" },
    { number: "20+", label: "Years of Experience" },
    { number: "50+", label: "Cities Across India" },
    { number: "500+", label: "Skilled Professionals" },
  ];
  const awards = [
    { year: "2023", title: "Best EPC Company of the Year", body: "Construction World Awards" },
    { year: "2022", title: "Excellence in Infrastructure", body: "India Construction Summit" },
    { year: "2021", title: "Sustainable Builder Award", body: "Green Building Council India" },
    { year: "2019", title: "Top 10 Construction Companies", body: "Forbes India" },
  ];
  return (
    <section className={`py-16 px-6 transition-colors duration-500 ${dark ? "bg-zinc-900" : "bg-[#0d6ebd]"}`}>
      <div
        ref={ref}
        className="max-w-6xl mx-auto"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(32px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <div className="text-center mb-12">
          <p className={`text-xs uppercase tracking-widest mb-2 font-black ${dark ? "text-[#facc15]" : "text-[#cce8ff]"}`}>Our Milestones</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">Achievements and Awards</h2>
          <div className={`w-10 h-0.5 mx-auto rounded ${dark ? "bg-[#facc15]" : "bg-white"}`} />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {stats.map((s, i) => (
            <div key={i} className={`text-center rounded-sm py-8 px-4 ${dark ? "bg-zinc-800 border border-zinc-700" : "bg-white/10 backdrop-blur-sm"}`}>
              <p className={`text-4xl sm:text-5xl font-black mb-2 ${dark ? "text-[#facc15]" : "text-white"}`}>{s.number}</p>
              <p className={`text-xs uppercase tracking-widest ${dark ? "text-zinc-400" : "text-[#cce8ff]"}`}>{s.label}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {awards.map((a, i) => (
            <div key={i} className={`flex items-start gap-4 rounded-sm p-5 ${dark ? "bg-zinc-800 border border-zinc-700" : "bg-white/10 backdrop-blur-sm"}`}>
              <div className={`text-xs font-black px-3 py-2 rounded-sm shrink-0 uppercase tracking-wide ${dark ? "bg-[#facc15] text-black" : "bg-white text-[#0d6ebd]"}`}>{a.year}</div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">{a.title}</h4>
                <p className={`text-xs ${dark ? "text-zinc-400" : "text-[#cce8ff]"}`}>{a.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Featured Projects Section (About Page version) ─────────────
const featuredProjects = [
  {
    id: 1,
    title: "The Sky Atrium",
    category: "Commercial",
    location: "Mumbai, MH",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  },
  {
    id: 2,
    title: "Golden Sands Resort",
    category: "Hospitality",
    location: "Goa, IN",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
  },
  {
    id: 3,
    title: "Eco-Tech Park",
    category: "Industrial",
    location: "Bangalore, KA",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
  },
  {
    id: 4,
    title: "Urban Heights",
    category: "Residential",
    location: "Delhi, IN",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
  },
  {
    id: 5,
    title: "Heritage Resort",
    category: "Hospitality",
    location: "Rajasthan, IN",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
  },
  {
    id: 6,
    title: "Tech Park Phase II",
    category: "IT Infrastructure",
    location: "Bangalore, KA",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  },
];

function OurProjects({ dark }) {
  const [ref, visible] = useInView(0.1);
  const [filter, setFilter] = useState("All");
  const categories = ["All", "Commercial", "Residential", "Hospitality", "Industrial"];

  const filtered = filter === "All"
    ? featuredProjects
    : featuredProjects.filter((p) => p.category === filter);

  return (
    <section
      className={`py-20 px-6 transition-colors duration-500 ${dark ? "bg-black" : "bg-zinc-50"}`}
    >
      <div ref={ref} className="max-w-7xl mx-auto"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(32px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <p className="text-[#facc15] text-xs font-black uppercase tracking-[0.3em] mb-3">
              Our Portfolio
            </p>
            <h2 className={`text-4xl sm:text-5xl font-black uppercase tracking-tighter ${dark ? "text-white" : "text-zinc-900"}`}>
              Our <span className="text-[#facc15]">Projects</span>
            </h2>
            <p className={`mt-3 text-sm max-w-md ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
              A glimpse of the landmarks we have built across India — from commercial towers to luxury resorts.
            </p>
          </div>

          {/* View All Button */}
          <Link
            href="/FeaturedProjects/ProjectGallery"
            className={`group flex items-center gap-3 px-8 py-4 border-2 font-black uppercase text-xs tracking-widest transition-all self-start md:self-auto ${
              dark
                ? "border-[#facc15] text-[#facc15] hover:bg-[#facc15] hover:text-black"
                : "border-zinc-800 text-zinc-800 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            View Full Portfolio
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 border-2 rounded-sm ${
                filter === cat
                  ? "bg-[#facc15] border-[#facc15] text-black"
                  : dark
                  ? "border-zinc-700 text-zinc-500 hover:border-[#facc15] hover:text-[#facc15]"
                  : "border-zinc-300 text-zinc-400 hover:border-zinc-800 hover:text-zinc-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          {filtered.map((project, idx) => (
            <div
              key={project.id}
              className="group relative h-[400px] overflow-hidden bg-zinc-800 transition-all duration-700"
              style={{
                transitionDelay: `${idx * 100}ms`,
              }}
            >
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-40"
              />

              {/* Overlay content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-[#facc15] text-xs font-black uppercase tracking-widest mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {project.category} — {project.location}
                </p>
                <h3 className="text-white text-2xl font-black uppercase leading-tight mb-4">
                  {project.title}
                </h3>
                <div className="h-0 group-hover:h-10 overflow-hidden transition-all duration-500">
                  <Link
                    href="/FeaturedProjects/ProjectGallery"
                    className="inline-block bg-[#facc15] text-black px-5 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-colors"
                  >
                    Explore Details
                  </Link>
                </div>
              </div>

              {/* Decorative number */}
              <span className="absolute top-6 right-6 text-white/10 text-5xl font-black italic group-hover:text-[#facc15]/20 transition-colors">
                0{idx + 1}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom CTA Strip */}
        <div className={`mt-12 p-8 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6 ${dark ? "bg-zinc-900 border border-zinc-800" : "bg-white border border-gray-100 shadow-sm"}`}>
          <div>
            <p className={`text-xs font-black uppercase tracking-widest mb-1 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
              Want to see more?
            </p>
            <p className={`text-lg font-black uppercase ${dark ? "text-white" : "text-zinc-800"}`}>
              Explore our complete project portfolio
            </p>
          </div>
          <Link
            href="/FeaturedProjects/ProjectGallery"
            className="px-10 py-4 bg-[#facc15] text-black font-black uppercase text-xs tracking-widest hover:bg-yellow-400 transition-all shrink-0"
          >
            View All Projects →
          </Link>
        </div>

      </div>
    </section>
  );
}

// ── Main About Page ────────────────────────────────────────────
export default function AboutPage() {
  const dark = useDarkMode();

  return (
    <main className={`transition-colors duration-500 ${dark ? "bg-black" : "bg-white"}`}>

      {/* Hero Banner */}
      <section
        className="relative flex items-center justify-center text-center"
        style={{
          height: "340px",
          backgroundImage: "url(https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className={`absolute inset-0 transition-colors duration-500 ${dark ? "bg-black/80" : "bg-[#0d6ebd]/75"}`} />
        <div className="relative z-10 px-6">
          <p className={`text-xs uppercase tracking-widest mb-3 ${dark ? "text-[#facc15]" : "text-[#cce8ff]"}`}>
            MT BOSS Construction
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">About Us</h1>
          <div className={`w-10 h-0.5 mx-auto mb-4 rounded ${dark ? "bg-[#facc15]" : "bg-white"}`} />
          <p className={`text-sm max-w-xl mx-auto leading-relaxed ${dark ? "text-zinc-400" : "text-[#cce8ff]"}`}>
            Building India's future — one project at a time.
          </p>
        </div>
      </section>

      <CompanyStory dark={dark} />
      <MissionVision dark={dark} />
      <WhyChooseUs dark={dark} />
      <Achievements dark={dark} />

      {/* Divider */}
      <div className={`h-px w-full ${dark ? "bg-zinc-800" : "bg-gray-100"}`} />

      {/* Projects Portfolio */}
      <OurProjects dark={dark} />

    </main>
  );
}