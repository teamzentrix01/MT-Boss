"use client";
import { useEffect, useRef, useState } from "react";

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

// ── Company Story ──────────────────────────────────────────────
function CompanyStory() {
  const [ref, visible] = useInView(0.1);
  return (
    <section className="bg-[#f0f7ff]  py-16 px-6">
      <div
        ref={ref}
        className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(32px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        {/* Text */}
        <div>
          <p className="text-xs uppercase tracking-widest text-[#0d6ebd] mb-2">Who We Are</p>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0a3d6e] mb-4 leading-tight">
            Our Story
          </h2>
          <div className="w-10 h-0.5 bg-[#0d6ebd] mb-6 rounded" />
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
            MT BOSS Construction was founded with a single vision — to build infrastructure that stands the test of time. Starting as a small contracting firm, we have grown into one of India's most trusted engineering, procurement, and construction companies.
          </p>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
            Over two decades, we have delivered hundreds of projects across residential, commercial, industrial, and infrastructure sectors — always on time, always within budget, and always with uncompromising quality.
          </p>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Today, MT BOSS operates across India with a team of 500+ skilled professionals, engineers, and project managers — driven by a shared commitment to excellence and innovation.
          </p>
        </div>

        {/* Image */}
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80"
            alt="MT BOSS Construction"
            className="w-full h-80 object-cover rounded-sm shadow-lg"
          />
          <div className="absolute -bottom-4 -left-4 bg-[#0d6ebd] text-white px-6 py-4 rounded-sm shadow-md">
            <p className="text-3xl font-black">20+</p>
            <p className="text-xs uppercase tracking-widest">Years of Excellence</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Mission & Vision ───────────────────────────────────────────
function MissionVision() {
  const [ref, visible] = useInView(0.1);
  return (
    <section className="bg-[#e8f4ff] py-16 px-6">
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
          <p className="text-xs uppercase tracking-widest text-[#0d6ebd] mb-2">What Drives Us</p>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0a3d6e] mb-3">Mission & Vision</h2>
          <div className="w-10 h-0.5 bg-[#0d6ebd] mx-auto rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="bg-white rounded-sm shadow-md p-8 border-t-4 border-[#0d6ebd]">
            <div className="w-12 h-12 bg-[#0d6ebd] rounded-full flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-[#0a3d6e] mb-3 uppercase tracking-wide">Our Mission</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              To deliver sustainable, technology-led construction and infrastructure solutions that create lasting value for our clients, communities, and the nation — with integrity, precision, and innovation at every step.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-[#0d6ebd] rounded-sm shadow-md p-8 border-t-4 border-[#0a3d6e]">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-[#0d6ebd]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-white mb-3 uppercase tracking-wide">Our Vision</h3>
            <p className="text-sm text-[#cce8ff] leading-relaxed">
              To be India's most trusted and innovative construction company — setting new benchmarks in quality, safety, and sustainability while transforming the built environment for generations to come.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Why Choose Us ──────────────────────────────────────────────
function WhyChooseUs() {
  const [ref, visible] = useInView(0.1);
  const reasons = [
    {
      icon: "🏗️",
      title: "20+ Years Experience",
      desc: "Two decades of delivering complex projects across India with proven expertise.",
    },
    {
      icon: "✅",
      title: "On-Time Delivery",
      desc: "We have a consistent track record of completing projects on schedule, every time.",
    },
    {
      icon: "🔬",
      title: "Technology-Led",
      desc: "We leverage the latest construction technology for superior precision and efficiency.",
    },
    {
      icon: "🤝",
      title: "Trusted Partnerships",
      desc: "Long-term relationships with top clients built on transparency and mutual respect.",
    },
    {
      icon: "🛡️",
      title: "Safety First",
      desc: "Strict safety protocols and zero-compromise standards on every single project site.",
    },
    {
      icon: "🌱",
      title: "Sustainable Approach",
      desc: "Eco-conscious construction methods that protect the environment for future generations.",
    },
  ];

  return (
    <section className="bg-white py-16 px-6">
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
          <p className="text-xs uppercase tracking-widest text-[#0d6ebd] mb-2">Our Strengths</p>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0a3d6e] mb-3">Why Choose MT BOSS</h2>
          <div className="w-10 h-0.5 bg-[#0d6ebd] mx-auto rounded" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r, i) => (
            <div
              key={i}
              className="group bg-[#f0f7ff] hover:bg-[#0d6ebd] rounded-sm p-6 transition-all duration-300 shadow-sm hover:shadow-lg"
              style={{
                transitionDelay: `${i * 0.05}s`,
              }}
            >
              <span className="text-3xl block mb-4">{r.icon}</span>
              <h3 className="text-base font-black text-[#0a3d6e] group-hover:text-white mb-2 uppercase tracking-wide transition-colors duration-300">
                {r.title}
              </h3>
              <p className="text-sm text-gray-500 group-hover:text-[#cce8ff] leading-relaxed transition-colors duration-300">
                {r.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Achievements ───────────────────────────────────────────────
function Achievements() {
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
    <section className="bg-[#0d6ebd] py-16 px-6">
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
          <p className="text-xs uppercase tracking-widest text-[#cce8ff] mb-2">Our Milestones</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">Achievements & Awards</h2>
          <div className="w-10 h-0.5 bg-white mx-auto rounded" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {stats.map((s, i) => (
            <div key={i} className="text-center bg-white/10 rounded-sm py-8 px-4 backdrop-blur-sm">
              <p className="text-4xl sm:text-5xl font-black text-white mb-2">{s.number}</p>
              <p className="text-xs uppercase tracking-widest text-[#cce8ff]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Awards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {awards.map((a, i) => (
            <div key={i} className="flex items-start gap-4 bg-white/10 rounded-sm p-5 backdrop-blur-sm">
              <div className="bg-white text-[#0d6ebd] text-xs font-black px-3 py-2 rounded-sm shrink-0 uppercase tracking-wide">
                {a.year}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">{a.title}</h4>
                <p className="text-xs text-[#cce8ff]">{a.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Main About Page ────────────────────────────────────────────
export default function AboutPage() {
  return (
    <main>
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
        <div className="absolute inset-0 bg-[#0d6ebd]/75" />
        <div className="relative z-10 px-6">
          <p className="text-xs uppercase tracking-widest text-[#cce8ff] mb-3">MT BOSS Construction</p>
          <h1
            className="text-4xl sm:text-5xl font-black text-white mb-4"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            About Us
          </h1>
          <div className="w-10 h-0.5 bg-white mx-auto mb-4 rounded" />
          <p className="text-sm text-[#cce8ff] max-w-xl mx-auto leading-relaxed">
            Building India's future — one project at a time.
          </p>
        </div>
      </section>

      <CompanyStory />
      <MissionVision />
      <WhyChooseUs />
      <Achievements />
    </main>
  );
}