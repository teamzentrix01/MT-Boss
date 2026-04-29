"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { jobs } from "./data/jobs";

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

const departmentColors = {
  Engineering: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Management: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Design: "bg-green-500/10 text-green-400 border-green-500/20",
  "Human Resources": "bg-pink-500/10 text-pink-400 border-pink-500/20",
  Sales: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

const departmentColorsLight = {
  Engineering: "bg-blue-50 text-blue-600 border-blue-100",
  Management: "bg-purple-50 text-purple-600 border-purple-100",
  Design: "bg-green-50 text-green-600 border-green-100",
  "Human Resources": "bg-pink-50 text-pink-600 border-pink-100",
  Sales: "bg-orange-50 text-orange-600 border-orange-100",
};

export default function CareersPage() {
  const dark = useDarkMode();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  const departments = ["All", "Engineering", "Management", "Design", "Human Resources", "Sales"];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const filtered = jobs.filter((job) => {
    const matchDept = filter === "All" || job.department === filter;
    const matchSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase()) ||
      job.department.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  });

  return (
    <main className={`min-h-screen transition-colors duration-500 ${dark ? "bg-black" : "bg-gray-50"}`}>

      {/* Hero */}
      <section
        className="relative flex items-center justify-center text-center py-24 px-6"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
            MT Boss Construction
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase text-white mb-4 tracking-tighter">
            Build Your
            <span className="block text-[#facc15]">Career With Us</span>
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
            Join a team of 500+ engineers, architects, and professionals building India's future. We offer growth, challenges, and the chance to work on landmark projects.
          </p>

          {/* Stats Row */}
          <div className="flex items-center justify-center gap-8 mt-6">
            {[
              { value: "500+", label: "Team Members" },
              { value: "6+", label: "Open Positions" },
              { value: "20+", label: "Years Legacy" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-[#facc15] text-2xl font-black">{s.value}</p>
                <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className={`py-16 px-6 transition-colors duration-500 ${dark ? "bg-zinc-900" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] mb-2">Perks and Benefits</p>
            <h2 className={`text-3xl font-black uppercase tracking-tight ${dark ? "text-white" : "text-zinc-800"}`}>
              Why Join MT BOSS?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🚀", title: "Fast Growth", desc: "Clear career paths with regular promotions and skill development programs." },
              { icon: "💰", title: "Competitive Pay", desc: "Industry-leading salaries, performance bonuses, and annual appraisals." },
              { icon: "🏗️", title: "Landmark Projects", desc: "Work on mega infrastructure and iconic construction projects across India." },
              { icon: "🤝", title: "Great Culture", desc: "Collaborative, inclusive work environment with experienced mentors." },
              { icon: "📚", title: "Learning Support", desc: "Sponsored certifications, training programs, and international exposure." },
              { icon: "🏥", title: "Health Benefits", desc: "Comprehensive medical insurance for you and your family." },
              { icon: "🌍", title: "Pan India Exposure", desc: "Opportunity to work on projects across 50+ cities in India." },
              { icon: "⚖️", title: "Work Life Balance", desc: "Structured work hours, flexible policies, and employee wellness programs." },
            ].map((item, i) => (
              <div
                key={i}
                className={`p-6 rounded-sm border transition-all duration-300 group hover:border-[#facc15] ${
                  dark ? "bg-zinc-800 border-zinc-700" : "bg-gray-50 border-gray-100 hover:bg-white hover:shadow-md"
                }`}
              >
                <span className="text-2xl block mb-3">{item.icon}</span>
                <h3 className={`text-xs font-black uppercase tracking-widest mb-2 group-hover:text-[#facc15] transition-colors ${dark ? "text-white" : "text-zinc-800"}`}>
                  {item.title}
                </h3>
                <p className={`text-xs leading-relaxed ${dark ? "text-zinc-500" : "text-zinc-500"}`}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section
        ref={ref}
        className={`py-16 px-6 transition-colors duration-500 ${dark ? "bg-black" : "bg-gray-50"}`}
      >
        <div
          className="max-w-7xl mx-auto"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] mb-2">
                Join Our Team
              </p>
              <h2 className={`text-3xl font-black uppercase tracking-tight ${dark ? "text-white" : "text-zinc-800"}`}>
                Open Positions
                <span className={`ml-3 text-sm font-black px-3 py-1 rounded-sm ${dark ? "bg-zinc-800 text-zinc-400" : "bg-gray-200 text-zinc-500"}`}>
                  {filtered.length} Jobs
                </span>
              </h2>
            </div>

            {/* Search */}
            <div className="relative">
              <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${dark ? "text-zinc-500" : "text-zinc-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search jobs, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`pl-10 pr-4 py-3 text-xs font-bold border rounded-sm outline-none w-64 transition-all ${
                  dark
                    ? "bg-zinc-900 border-zinc-700 text-white placeholder-zinc-600 focus:border-[#facc15]"
                    : "bg-white border-gray-200 text-zinc-800 placeholder-zinc-400 focus:border-zinc-800"
                }`}
              />
            </div>
          </div>

          {/* Department Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setFilter(dept)}
                className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest border-2 rounded-sm transition-all duration-300 ${
                  filter === dept
                    ? "bg-[#facc15] border-[#facc15] text-black"
                    : dark
                    ? "border-zinc-700 text-zinc-500 hover:border-[#facc15] hover:text-[#facc15]"
                    : "border-gray-200 text-zinc-400 hover:border-zinc-800 hover:text-zinc-800"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Job Cards */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className={`text-xs font-black uppercase tracking-widest ${dark ? "text-zinc-600" : "text-gray-300"}`}>
                No jobs found matching your search
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filtered.map((job, i) => (
                <div
                  key={job.id}
                  className={`group relative p-6 border rounded-sm transition-all duration-300 hover:border-[#facc15] ${
                    dark
                      ? "bg-zinc-900 border-zinc-800 hover:bg-zinc-900"
                      : "bg-white border-gray-100 hover:shadow-lg"
                  }`}
                  style={{
                    transitionDelay: `${i * 50}ms`,
                  }}
                >
                  {/* Urgent Badge */}
                  {job.urgent && (
                    <span className="absolute top-4 right-4 px-2 py-1 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest rounded-sm">
                      Urgent
                    </span>
                  )}

                  {/* Top Row */}
                  <div className="flex items-start gap-4 mb-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-sm flex items-center justify-center flex-shrink-0 ${dark ? "bg-zinc-800" : "bg-gray-50"}`}>
                      <svg className="w-6 h-6 text-[#facc15]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm font-black uppercase tracking-wide mb-1 group-hover:text-[#facc15] transition-colors ${dark ? "text-white" : "text-zinc-800"}`}>
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-black px-2 py-0.5 border rounded-sm ${dark ? departmentColors[job.department] : departmentColorsLight[job.department]}`}>
                          {job.department}
                        </span>
                        <span className={`text-[10px] font-bold ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
                          • {job.posted}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Info Row */}
                  <div className={`grid grid-cols-3 gap-3 py-4 border-y mb-4 ${dark ? "border-zinc-800" : "border-gray-50"}`}>
                    {[
                      { icon: "📍", label: job.location },
                      { icon: "⏱️", label: job.experience },
                      { icon: "💼", label: job.type },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-1">
                        <span className="text-xs">{item.icon}</span>
                        <span className={`text-[10px] font-bold truncate ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Salary + CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${dark ? "text-zinc-600" : "text-zinc-400"}`}>
                        Salary Range
                      </p>
                      <p className="text-[#facc15] text-sm font-black">{job.salary}</p>
                    </div>
                    <Link
                      href={`/careers/${job.id}`}
                      className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest border-2 rounded-sm transition-all duration-300 ${
                        dark
                          ? "border-[#facc15] text-[#facc15] hover:bg-[#facc15] hover:text-black"
                          : "border-zinc-800 text-zinc-800 hover:bg-zinc-800 hover:text-white"
                      }`}
                    >
                      Apply Now →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className={`py-16 px-6 transition-colors duration-500 ${dark ? "bg-zinc-900" : "bg-zinc-800"}`}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] mb-3">
            Do not see your role?
          </p>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-white mb-4 tracking-tight">
            Send Us Your Resume Anyway
          </h2>
          <p className="text-zinc-400 text-xs mb-8 max-w-lg mx-auto leading-relaxed">
            We are always looking for talented people. Drop your resume and we will reach out when the right opportunity comes up.
          </p>
          <a
            href="mailto:careers@mtboss.com"
            className="inline-flex items-center gap-3 px-10 py-4 bg-[#facc15] text-black font-black uppercase text-xs tracking-widest hover:bg-yellow-400 transition-all"
          >
            Send Your Resume
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>

    </main>
  );
}