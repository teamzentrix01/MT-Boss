"use client";

import { useEffect, useRef, useState } from "react";
import TeamPage from "./TeamPage";
import { COMPANY_CONTACT, COMPANY_NAME } from "../lib/company";

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

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

function SectionHeading({ eyebrow, title, dark, align = "left" }) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <p
        className={`text-[10px] uppercase tracking-[0.35em] mb-2 font-black ${
          dark ? "text-[var(--brand-blue)]" : "text-[var(--brand-blue-deep)]"
        }`}
      >
        {eyebrow}
      </p>
      <h2 className={`text-2xl sm:text-3xl font-black leading-tight ${dark ? "text-white" : "text-zinc-900"}`}>
        {title}
      </h2>
      <div
        className={`w-10 h-0.5 mt-4 ${align === "center" ? "mx-auto" : ""} ${
          dark ? "bg-[var(--brand-blue)]" : "bg-[var(--brand-blue-deep)]"
        }`}
      />
    </div>
  );
}

function CompanyStory({ dark }) {
  return (
    <section className={`py-14 px-6 transition-colors duration-500 ${dark ? "bg-zinc-950" : "bg-white"}`}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <FadeIn>
          <SectionHeading eyebrow="Who We Are" title="Built for dependable construction delivery" dark={dark} />
          <div className={`mt-6 space-y-4 text-sm leading-7 ${dark ? "text-zinc-400" : "text-zinc-600"}`}>
            <p>
              {COMPANY_NAME} is a construction-focused company serving clients across residential, commercial,
              industrial, property, contractor, material supply, and project support requirements.
            </p>
            <p>
              Our platform and team help customers plan construction work, estimate budgets, discover verified
              services, connect with relevant professionals, and submit enquiries with transparent communication.
            </p>
            <p>
              We work with a practical operating principle: clear scope, responsible coordination, quality-conscious
              execution, and timely support from first enquiry to project handover.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={120}>
          <div className="relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1000&q=80"
              alt="Construction site managed by Mtboss construction private limited"
              className="w-full h-72 object-cover"
            />
            <div className={`absolute inset-0 ${dark ? "bg-black/20" : "bg-[var(--brand-blue-deep)]/10"}`} />
            <div className={`absolute left-0 bottom-0 p-5 ${dark ? "bg-black/90" : "bg-white/95"}`}>
              <p className={`text-xs font-black uppercase tracking-[0.25em] ${dark ? "text-[var(--brand-blue)]" : "text-[var(--brand-blue-deep)]"}`}>
                Registered Company
              </p>
              <p className={`text-lg font-black mt-1 ${dark ? "text-white" : "text-zinc-900"}`}>{COMPANY_NAME}</p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function MissionVision({ dark }) {
  const items = [
    {
      title: "Our Mission",
      body: "To make construction services more organised, transparent, and accessible by connecting customers with dependable project support, verified professionals, and useful digital tools.",
    },
    {
      title: "Our Vision",
      body: "To become a trusted construction services partner for clients who want reliable planning, accountable execution, and better visibility across every stage of their project.",
    },
  ];

  return (
    <section className={`py-14 px-6 transition-colors duration-500 ${dark ? "bg-black" : "bg-[var(--brand-blue-faint)]"}`}>
      <div className="max-w-6xl mx-auto">
        <FadeIn className="mb-8">
          <SectionHeading eyebrow="Purpose" title="Construction support with accountability" dark={dark} align="center" />
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((item, index) => (
            <FadeIn key={item.title} delay={index * 100}>
              <div className={`h-full p-6 border-t-4 ${dark ? "bg-zinc-950 border-[var(--brand-blue)]" : "bg-white border-[var(--brand-blue-deep)] shadow-sm"}`}>
                <h3 className={`text-sm font-black uppercase tracking-wide mb-3 ${dark ? "text-[var(--brand-blue)]" : "text-zinc-900"}`}>
                  {item.title}
                </h3>
                <p className={`text-sm leading-7 ${dark ? "text-zinc-400" : "text-zinc-600"}`}>{item.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function Capabilities({ dark }) {
  const capabilities = [
    "Residential and commercial construction enquiries",
    "Construction budget calculator and project planning support",
    "Professional services and quick service coordination",
    "Material supplier and vendor network support",
    "Property buying, selling, renting, and project discovery",
    "Franchise, agent, contractor, and partner onboarding",
  ];

  return (
    <section className={`py-14 px-6 transition-colors duration-500 ${dark ? "bg-zinc-950" : "bg-white"}`}>
      <div className="max-w-6xl mx-auto">
        <FadeIn className="mb-8">
          <SectionHeading eyebrow="What We Do" title="Services around the construction journey" dark={dark} />
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {capabilities.map((item, index) => (
            <FadeIn key={item} delay={index * 60}>
              <div className={`h-full p-5 border ${dark ? "bg-black border-zinc-800" : "bg-zinc-50 border-zinc-100"}`}>
                <span className={`block text-[10px] font-black tracking-widest mb-3 ${dark ? "text-[var(--brand-blue)]" : "text-[var(--brand-blue-deep)]"}`}>
                  0{index + 1}
                </span>
                <p className={`text-sm font-bold leading-6 ${dark ? "text-zinc-200" : "text-zinc-800"}`}>{item}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function Principles({ dark }) {
  const principles = [
    { title: "Transparent Communication", body: "We keep service information, enquiry flow, and contact channels clear for customers and partners." },
    { title: "Quality Consciousness", body: "We focus on practical construction standards, proper coordination, and responsible project support." },
    { title: "Customer Support", body: "Customers can contact us through email, phone, WhatsApp, and website forms for construction-related assistance." },
    { title: "Partner Accountability", body: "Vendors, suppliers, contractors, agents, and franchises are expected to follow professional conduct and service commitments." },
  ];

  return (
    <section className={`py-14 px-6 transition-colors duration-500 ${dark ? "bg-black" : "bg-[var(--brand-blue-deep)]"}`}>
      <div className="max-w-6xl mx-auto">
        <FadeIn className="mb-8">
          <p className={`text-[10px] uppercase tracking-[0.35em] mb-2 font-black ${dark ? "text-[var(--brand-blue)]" : "text-[var(--brand-blue-pale)]"}`}>
            Operating Standards
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">How we work</h2>
          <div className={`w-10 h-0.5 mt-4 ${dark ? "bg-[var(--brand-blue)]" : "bg-white"}`} />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {principles.map((item, index) => (
            <FadeIn key={item.title} delay={index * 80}>
              <div className={`p-5 h-full ${dark ? "bg-zinc-950 border border-zinc-800" : "bg-white/10"}`}>
                <h3 className="text-sm font-black uppercase tracking-wide text-white mb-2">{item.title}</h3>
                <p className={`text-sm leading-7 ${dark ? "text-zinc-400" : "text-[var(--brand-blue-pale)]"}`}>{item.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactStrip({ dark }) {
  return (
    <section className={`py-12 px-6 transition-colors duration-500 ${dark ? "bg-zinc-950" : "bg-white"}`}>
      <FadeIn>
        <div className={`max-w-6xl mx-auto p-6 sm:p-8 flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between ${dark ? "bg-black border border-zinc-800" : "bg-zinc-50 border border-zinc-100"}`}>
          <div>
            <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${dark ? "text-[var(--brand-blue)]" : "text-[var(--brand-blue-deep)]"}`}>
              Contact Details
            </p>
            <h2 className={`text-xl sm:text-2xl font-black ${dark ? "text-white" : "text-zinc-900"}`}>{COMPANY_NAME}</h2>
            <p className={`text-sm leading-7 mt-3 max-w-2xl ${dark ? "text-zinc-400" : "text-zinc-600"}`}>
              {COMPANY_CONTACT.address}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href={`mailto:${COMPANY_CONTACT.email}`} className="px-6 py-3 bg-[var(--brand-blue)] text-black font-black uppercase text-[10px] tracking-widest">
              Email Us
            </a>
            <a href={`tel:${COMPANY_CONTACT.phone.replace(/\s/g, "")}`} className={`px-6 py-3 border font-black uppercase text-[10px] tracking-widest ${dark ? "border-zinc-700 text-white" : "border-zinc-300 text-zinc-900"}`}>
              Call {COMPANY_CONTACT.phone}
            </a>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

function AboutContent({ dark, onShowTeam }) {
  return (
    <main className={`transition-colors duration-500 ${dark ? "bg-black" : "bg-white"}`}>
      <section
        className="relative flex items-center justify-center text-center"
        style={{
          minHeight: "340px",
          backgroundImage: "url(https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className={`absolute inset-0 transition-colors duration-500 ${dark ? "bg-black/80" : "bg-[var(--brand-blue-deep)]/75"}`} />
        <div className="relative z-10 px-6 max-w-4xl mx-auto">
          <p className={`text-[10px] uppercase tracking-[0.35em] mb-3 font-black ${dark ? "text-[var(--brand-blue)]" : "text-[var(--brand-blue-pale)]"}`}>
            {COMPANY_NAME}
          </p>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-4">About Us</h1>
          <div className={`w-10 h-0.5 mx-auto mb-5 ${dark ? "bg-[var(--brand-blue)]" : "bg-white"}`} />
          <p className={`text-sm sm:text-base max-w-2xl mx-auto leading-7 ${dark ? "text-zinc-300" : "text-[var(--brand-blue-pale)]"}`}>
            A construction services company helping customers plan, connect, and execute construction-related work with clarity and dependable support.
          </p>
        </div>
      </section>

      <CompanyStory dark={dark} />
      <MissionVision dark={dark} />
      <Capabilities dark={dark} />
      <Principles dark={dark} />
      <ContactStrip dark={dark} />

      <section className={`pb-14 px-6 transition-colors duration-500 ${dark ? "bg-zinc-950" : "bg-white"}`}>
        <FadeIn>
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <p className={`text-[10px] uppercase tracking-[0.3em] font-black mb-2 ${dark ? "text-[var(--brand-blue)]" : "text-[var(--brand-blue-deep)]"}`}>
                Leadership
              </p>
              <h2 className={`text-2xl font-black ${dark ? "text-white" : "text-zinc-900"}`}>Meet the people behind MTBOSS</h2>
            </div>
            <button
              onClick={onShowTeam}
              className="px-7 py-3 bg-[var(--brand-blue)] text-black font-black uppercase text-[10px] tracking-widest"
            >
              Meet Our Team
            </button>
          </div>
        </FadeIn>
      </section>
    </main>
  );
}

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
        <div
          className={`flex items-center gap-3 px-6 py-3 border-b text-[10px] font-black uppercase tracking-widest ${
            dark ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-100"
          }`}
          style={{ position: "sticky", top: 0, zIndex: 99 }}
        >
          <button
            onClick={handleBack}
            className={`flex items-center gap-2 transition-colors hover:text-[var(--brand-blue)] ${
              dark ? "text-zinc-400" : "text-zinc-500"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            About Us
          </button>
          <span className={dark ? "text-zinc-700" : "text-zinc-200"}>/</span>
          <span className={dark ? "text-[var(--brand-blue)]" : "text-[var(--brand-blue-deep)]"}>Leadership Team</span>
        </div>
        <TeamPage />
      </div>
    );
  }

  return <AboutContent dark={dark} onShowTeam={handleShowTeam} />;
}
