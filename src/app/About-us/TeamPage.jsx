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
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// ── Data ───────────────────────────────────────────────────────
const leadership = [
  {
    name: "Rajiv Mehta",
    role: "Chairman & Managing Director",
    dept: "Executive Leadership",
    exp: "32 Years",
    education: "B.Tech Civil, IIT Delhi · MBA, IIM Ahmedabad",
    bio: "Rajiv founded MTBOSS with a vision to redefine construction excellence in India. Under his leadership, the company has grown from a 5-person startup to a 500+ strong organization delivering landmark projects nationwide.",
    expertise: ["Strategic Planning", "EPC Management", "Government Relations", "Business Development"],
    projects: 120,
    awards: 8,
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
    linkedin: "#",
    featured: true,
  },
  {
    name: "Priya Sharma",
    role: "Chief Executive Officer",
    dept: "Operations",
    exp: "24 Years",
    education: "B.E. Civil, NIT Trichy · PMP Certified",
    bio: "Priya drives operational excellence at MTBOSS, overseeing end-to-end project delivery across all verticals. Her data-driven approach has improved on-time delivery rates to 97%.",
    expertise: ["Operations", "Project Delivery", "Quality Systems", "ISO 9001"],
    projects: 85,
    awards: 5,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    linkedin: "#",
    featured: true,
  },
  {
    name: "Arjun Nair",
    role: "Chief Technical Officer",
    dept: "Engineering",
    exp: "28 Years",
    education: "M.Tech Structural Eng., IISc Bangalore",
    bio: "Arjun leads all technical innovation at MTBOSS, pioneering the adoption of BIM, drone surveying, and green construction methodologies that have set new industry benchmarks.",
    expertise: ["Structural Design", "BIM Technology", "Sustainability", "R&D"],
    projects: 95,
    awards: 6,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    linkedin: "#",
    featured: true,
  },
  {
    name: "Sunita Kapoor",
    role: "Chief Financial Officer",
    dept: "Finance",
    exp: "20 Years",
    education: "CA, ICAI · CFA Charterholder",
    bio: "Sunita manages MTBOSS's financial strategy, fund planning, and investor relations. Her stewardship has delivered consistent year-on-year growth with zero instances of cost overruns.",
    expertise: ["Financial Planning", "Risk Management", "Investor Relations", "Auditing"],
    projects: 0,
    awards: 3,
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    linkedin: "#",
    featured: false,
  },
  {
    name: "Vikram Singh",
    role: "VP – Business Development",
    dept: "Growth",
    exp: "16 Years",
    education: "MBA Marketing, XLRI Jamshedpur",
    bio: "Vikram has been instrumental in expanding MTBOSS's client portfolio across public and private sectors, forging partnerships worth ₹2,000+ crore in new contracts.",
    expertise: ["Client Relations", "Tendering", "Market Expansion", "Partnerships"],
    projects: 40,
    awards: 2,
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80",
    linkedin: "#",
    featured: false,
  },
  {
    name: "Meera Iyer",
    role: "Head – Human Resources",
    dept: "People & Culture",
    exp: "14 Years",
    education: "MBA HR, Symbiosis Pune · SHRM Certified",
    bio: "Meera has built MTBOSS's people-first culture, scaling the workforce from 80 to 500+ professionals while maintaining industry-leading retention rates and employee satisfaction scores.",
    expertise: ["Talent Acquisition", "L&D", "Culture Building", "Workforce Planning"],
    projects: 0,
    awards: 2,
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&q=80",
    linkedin: "#",
    featured: false,
  },
  {
    name: "Rahul Bansal",
    role: "Head – Project Management",
    dept: "Delivery",
    exp: "18 Years",
    education: "B.Tech Civil, DTU · PMP · LEED AP",
    bio: "Rahul oversees a portfolio of concurrent projects across India, ensuring schedule adherence, resource optimization, and safety compliance on every single site.",
    expertise: ["Project Controls", "Risk Mitigation", "LEED", "Multi-site Management"],
    projects: 72,
    awards: 4,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    linkedin: "#",
    featured: false,
  },
  {
    name: "Anjali Verma",
    role: "Head – Design & Architecture",
    dept: "Design",
    exp: "15 Years",
    education: "B.Arch, SPA Delhi · M.Arch, UCL London",
    bio: "Anjali leads MTBOSS's in-house design studio, blending form with function to create award-winning facades, interiors, and master plans that have won international recognition.",
    expertise: ["Architecture", "Interior Design", "Facade Engineering", "Master Planning"],
    projects: 55,
    awards: 7,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    linkedin: "#",
    featured: false,
  },
];

const departments = ["All", "Executive Leadership", "Engineering", "Operations", "Finance", "Growth", "Delivery", "Design", "People & Culture"];

// ── Featured Leader Card ────────────────────────────────────────
function FeaturedCard({ member, dark, idx }) {
  const [hovered, setHovered] = useState(false);
  return (
    <FadeIn delay={idx * 100}>
      <div
        className={`group relative overflow-hidden transition-all duration-500 border ${
          dark ? "bg-zinc-950 border-zinc-800 hover:border-[#facc15]" : "bg-white border-zinc-100 hover:border-zinc-900 hover:shadow-xl"
        }`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
          {/* Gradient overlay */}
          <div className={`absolute inset-0 transition-opacity duration-500 ${hovered ? "opacity-80" : "opacity-40"}`}
            style={{ background: dark ? "linear-gradient(to top, #09090b 60%, transparent)" : "linear-gradient(to top, #0a3d6e 50%, transparent)" }}
          />
          {/* Dept badge */}
          <div className={`absolute top-3 left-3 px-2.5 py-1 text-[8px] font-black uppercase tracking-widest ${dark ? "bg-[#facc15] text-black" : "bg-[#0d6ebd] text-white"}`}>
            {member.dept}
          </div>
          {/* Exp badge */}
          <div className={`absolute top-3 right-3 px-2.5 py-1 text-[8px] font-black uppercase tracking-widest border ${dark ? "border-zinc-600 text-white bg-black/60" : "border-white/40 text-white bg-black/40"}`}>
            {member.exp}
          </div>
          {/* Name over image */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white text-lg font-black uppercase tracking-tight leading-tight">{member.name}</h3>
            <p className="text-[#facc15] text-[9px] font-black uppercase tracking-widest mt-0.5">{member.role}</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          <p className={`text-[10px] leading-relaxed mb-4 ${dark ? "text-zinc-400" : "text-zinc-500"}`}>{member.bio}</p>

          {/* Expertise Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {member.expertise.map((tag) => (
              <span key={tag} className={`px-2 py-1 text-[8px] font-black uppercase tracking-wide ${dark ? "bg-zinc-900 text-zinc-400 border border-zinc-800 group-hover:border-[#facc15]/30" : "bg-zinc-50 text-zinc-500 border border-zinc-200"}`}>
                {tag}
              </span>
            ))}
          </div>

          {/* Stats row */}
          <div className={`flex items-center gap-0 border-t pt-4 ${dark ? "border-zinc-800" : "border-zinc-100"}`}>
            <div className="flex-1 text-center">
              <p className={`text-xl font-black ${dark ? "text-[#facc15]" : "text-[#0d6ebd]"}`}>{member.projects}+</p>
              <p className={`text-[8px] uppercase tracking-widest ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Projects</p>
            </div>
            <div className={`w-px h-8 ${dark ? "bg-zinc-800" : "bg-zinc-200"}`} />
            <div className="flex-1 text-center">
              <p className={`text-xl font-black ${dark ? "text-[#facc15]" : "text-[#0d6ebd]"}`}>{member.awards}</p>
              <p className={`text-[8px] uppercase tracking-widest ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Awards</p>
            </div>
            <div className={`w-px h-8 ${dark ? "bg-zinc-800" : "bg-zinc-200"}`} />
            <div className="flex-1 text-center">
              <p className={`text-[9px] font-black leading-tight ${dark ? "text-white" : "text-zinc-700"}`}>{member.exp}</p>
              <p className={`text-[8px] uppercase tracking-widest ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Experience</p>
            </div>
          </div>

          {/* Education */}
          <div className={`mt-3 px-3 py-2 text-[9px] leading-relaxed ${dark ? "bg-zinc-900 text-zinc-500" : "bg-zinc-50 text-zinc-400"}`}>
            🎓 {member.education}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

// ── Compact Leader Row ─────────────────────────────────────────
function LeaderRow({ member, dark, idx }) {
  const [open, setOpen] = useState(false);
  return (
    <FadeIn delay={idx * 60}>
      <div className={`border transition-all duration-300 ${dark ? "border-zinc-800 hover:border-zinc-700 bg-zinc-950" : "border-zinc-100 hover:border-zinc-300 bg-white hover:shadow-sm"}`}>
        {/* Row header */}
        <button
          className="w-full flex items-center gap-4 p-4 text-left"
          onClick={() => setOpen(!open)}
        >
          <img src={member.image} alt={member.name} className="w-12 h-12 object-cover object-top shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={`text-sm font-black uppercase tracking-tight ${dark ? "text-white" : "text-zinc-900"}`}>{member.name}</h3>
              <span className={`px-2 py-0.5 text-[7px] font-black uppercase tracking-widest ${dark ? "bg-[#facc15] text-black" : "bg-[#0d6ebd] text-white"}`}>{member.dept}</span>
            </div>
            <p className={`text-[10px] ${dark ? "text-zinc-400" : "text-zinc-500"}`}>{member.role}</p>
          </div>
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            <div className="text-right">
              <p className={`text-sm font-black ${dark ? "text-[#facc15]" : "text-[#0d6ebd]"}`}>{member.exp}</p>
              <p className={`text-[8px] uppercase tracking-widest ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Experience</p>
            </div>
          </div>
          <div className={`ml-2 w-6 h-6 flex items-center justify-center border shrink-0 transition-all duration-300 ${open ? (dark ? "border-[#facc15] text-[#facc15]" : "border-zinc-900 text-zinc-900") : (dark ? "border-zinc-700 text-zinc-500" : "border-zinc-300 text-zinc-400")}`}>
            <svg className={`w-3 h-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {/* Expanded */}
        {open && (
          <div className={`px-4 pb-4 border-t ${dark ? "border-zinc-800" : "border-zinc-100"}`}>
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className={`text-[10px] leading-relaxed mb-3 ${dark ? "text-zinc-400" : "text-zinc-500"}`}>{member.bio}</p>
                <div className={`px-3 py-2 text-[9px] ${dark ? "bg-zinc-900 text-zinc-500" : "bg-zinc-50 text-zinc-400"}`}>
                  🎓 {member.education}
                </div>
              </div>
              <div>
                <p className={`text-[8px] font-black uppercase tracking-widest mb-2 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Areas of Expertise</p>
                <div className="flex flex-wrap gap-1.5">
                  {member.expertise.map((tag) => (
                    <span key={tag} className={`px-2 py-1 text-[8px] font-black uppercase tracking-wide ${dark ? "bg-zinc-900 text-zinc-400 border border-zinc-800" : "bg-zinc-50 text-zinc-500 border border-zinc-200"}`}>
                      {tag}
                    </span>
                  ))}
                </div>
                {member.projects > 0 && (
                  <div className="flex gap-4 mt-3">
                    <div>
                      <p className={`text-base font-black ${dark ? "text-[#facc15]" : "text-[#0d6ebd]"}`}>{member.projects}+</p>
                      <p className={`text-[8px] uppercase tracking-widest ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Projects</p>
                    </div>
                    <div>
                      <p className={`text-base font-black ${dark ? "text-[#facc15]" : "text-[#0d6ebd]"}`}>{member.awards}</p>
                      <p className={`text-[8px] uppercase tracking-widest ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Awards</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </FadeIn>
  );
}

// ── Main TeamPage ──────────────────────────────────────────────
export default function TeamPage({ onBack }) {
  const dark = useDarkMode();
  const [dept, setDept] = useState("All");

  const featured = leadership.filter((m) => m.featured);
  const rest = leadership.filter((m) => !m.featured);
  const filteredRest = dept === "All" ? rest : rest.filter((m) => m.dept === dept);

  const bg = dark ? "bg-black" : "bg-white";
  const muted = dark ? "text-zinc-400" : "text-zinc-500";
  const divider = dark ? "border-zinc-800" : "border-zinc-100";

  return (
    <main className={`min-h-screen transition-colors duration-500 ${bg}`}>

      {/* ── Hero ── */}
      <section
        className="relative flex items-center justify-center text-center"
        style={{
          height: "280px",
          backgroundImage: "url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <div className={`absolute inset-0 ${dark ? "bg-black/85" : "bg-[#0a3d6e]/82"}`} />
        <div className="relative z-10 px-6">
          <p className={`text-[9px] uppercase tracking-[0.5em] mb-2 font-black ${dark ? "text-[#facc15]" : "text-[#cce8ff]"}`}>MTBOSS Construction</p>
          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tighter mb-3 leading-none">
            Our <span className="text-[#facc15]">Leadership</span>
          </h1>
          <div className={`w-8 h-0.5 mx-auto mb-3 ${dark ? "bg-[#facc15]" : "bg-white"}`} />
          <p className={`text-xs max-w-md mx-auto leading-relaxed ${dark ? "text-zinc-400" : "text-[#cce8ff]"}`}>
            The experienced minds who have built MTBOSS from the ground up — and continue to shape its future.
          </p>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <div className={`border-b ${divider} ${dark ? "bg-zinc-950" : "bg-zinc-50"}`}>
        <div className="max-w-6xl mx-auto grid grid-cols-4 divide-x text-center py-0" style={{ borderColor: dark ? "#27272a" : "#f4f4f5" }}>
          {[
            { val: "500+", label: "Professionals" },
            { val: "8", label: "Leadership Team" },
            { val: "150+", label: "Combined Yrs Exp" },
            { val: "30+", label: "Awards Won" },
          ].map((s, i) => (
            <div key={i} className={`py-5 px-4 divide-x ${dark ? "divide-zinc-800" : "divide-zinc-100"}`}>
              <p className={`text-xl sm:text-2xl font-black ${dark ? "text-[#facc15]" : "text-[#0d6ebd]"}`}>{s.val}</p>
              <p className={`text-[8px] uppercase tracking-widest ${muted}`}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── C-Suite Featured ── */}
      <section className={`py-12 px-6 ${dark ? "bg-black" : "bg-white"}`}>
        <div className="max-w-6xl mx-auto">
          <FadeIn className="mb-8">
            <p className={`text-[9px] uppercase tracking-[0.4em] font-black mb-1.5 text-[#facc15]`}>Executive Leadership</p>
            <div className="flex items-end justify-between gap-4">
              <h2 className={`text-2xl sm:text-3xl font-black uppercase tracking-tighter ${dark ? "text-white" : "text-zinc-900"}`}>
                C-Suite &amp; Founders
              </h2>
              <div className={`hidden sm:block h-px flex-1 mb-2 ${dark ? "bg-zinc-800" : "bg-zinc-100"}`} />
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((member, i) => (
              <FeaturedCard key={member.name} member={member} dark={dark} idx={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className={`h-px w-full ${divider}`} />

      {/* ── Full Team ── */}
      <section className={`py-12 px-6 ${dark ? "bg-zinc-950" : "bg-zinc-50"}`}>
        <div className="max-w-6xl mx-auto">
          <FadeIn className="mb-6">
            <p className={`text-[9px] uppercase tracking-[0.4em] font-black mb-1.5 text-[#facc15]`}>Department Heads</p>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
              <h2 className={`text-2xl sm:text-3xl font-black uppercase tracking-tighter ${dark ? "text-white" : "text-zinc-900"}`}>
                Senior Leadership
              </h2>
              {/* Filter pills */}
              <div className="flex flex-wrap gap-2">
                {departments.filter(d => d === "All" || rest.some(m => m.dept === d)).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDept(d)}
                    className={`px-3 py-1.5 text-[8px] font-black uppercase tracking-widest border transition-all ${
                      dept === d
                        ? "bg-[#facc15] border-[#facc15] text-black"
                        : dark
                        ? "border-zinc-700 text-zinc-500 hover:border-zinc-500"
                        : "border-zinc-300 text-zinc-400 hover:border-zinc-600"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          <div className="space-y-2">
            {filteredRest.map((member, i) => (
              <LeaderRow key={member.name} member={member} dark={dark} idx={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Culture Strip ── */}
      <section className={`py-12 px-6 ${dark ? "bg-black" : "bg-[#0a3d6e]"}`}>
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-8">
            <p className={`text-[9px] uppercase tracking-[0.4em] font-black mb-1.5 ${dark ? "text-[#facc15]" : "text-[#cce8ff]"}`}>Our Values</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter">What Unites Our Team</h2>
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
                  <p className={`text-sm font-black uppercase tracking-wide mb-1 ${dark ? "text-white" : "text-white"}`}>{v.val}</p>
                  <p className={`text-[9px] ${dark ? "text-zinc-500" : "text-[#99ccf0]"}`}>{v.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Join Us CTA ── */}
      <section className={`py-10 px-6 ${dark ? "bg-zinc-950" : "bg-white"}`}>
        <FadeIn>
          <div className="max-w-6xl mx-auto">
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-6 p-7 border ${dark ? "border-zinc-800 bg-zinc-900" : "border-zinc-100 bg-zinc-50"}`}>
              <div>
                <p className={`text-[9px] uppercase tracking-[0.4em] font-black mb-1 ${dark ? "text-[#facc15]" : "text-[#0d6ebd]"}`}>Careers at MTBOSS</p>
                <p className={`text-base font-black uppercase tracking-tight ${dark ? "text-white" : "text-zinc-900"}`}>Want to join our team?</p>
                <p className={`text-xs mt-1 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>We're always looking for talented engineers and professionals.</p>
              </div>
              <div className="flex gap-3 shrink-0">
                <button
                  onClick={onBack}
                  className={`px-6 py-3 text-[9px] font-black uppercase tracking-widest border transition-all ${dark ? "border-zinc-700 text-zinc-300 hover:border-zinc-500" : "border-zinc-300 text-zinc-600 hover:border-zinc-700"}`}
                >
                  ← Back to About
                </button>
                <Link href="/Careers" className="px-6 py-3 bg-[#facc15] text-black text-[9px] font-black uppercase tracking-widest hover:bg-yellow-300 transition-all">
                  View Openings →
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

    </main>
  );
}