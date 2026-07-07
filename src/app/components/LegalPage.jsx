"use client";

import { useEffect, useState } from "react";
import { COMPANY_CONTACT, COMPANY_NAME } from "../lib/company";

export default function LegalPage({ eyebrow, title, intro, updated, sections }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const update = () => setDark(html.classList.contains("dark-mode"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <main className={`transition-colors duration-500 ${dark ? "bg-black" : "bg-white"}`}>
      <section className={`px-6 py-16 sm:py-20 ${dark ? "bg-zinc-950" : "bg-[var(--brand-blue-faint)]"}`}>
        <div className="max-w-5xl mx-auto">
          <p className={`text-[10px] uppercase tracking-[0.35em] font-black mb-3 ${dark ? "text-[var(--brand-blue)]" : "text-[var(--brand-blue-deep)]"}`}>
            {eyebrow}
          </p>
          <h1 className={`text-3xl sm:text-5xl font-black leading-tight ${dark ? "text-white" : "text-zinc-900"}`}>
            {title}
          </h1>
          <p className={`mt-5 max-w-3xl text-sm sm:text-base leading-7 ${dark ? "text-zinc-400" : "text-zinc-600"}`}>
            {intro}
          </p>
          <p className={`mt-5 text-xs font-black uppercase tracking-widest ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
            Last updated: {updated}
          </p>
        </div>
      </section>

      <section className="px-6 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 lg:gap-12">
          <aside className={`h-fit lg:sticky lg:top-24 p-5 border ${dark ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-100"}`}>
            <p className={`text-[10px] font-black uppercase tracking-[0.25em] mb-3 ${dark ? "text-[var(--brand-blue)]" : "text-[var(--brand-blue-deep)]"}`}>
              Company
            </p>
            <p className={`text-sm font-black leading-6 ${dark ? "text-white" : "text-zinc-900"}`}>{COMPANY_NAME}</p>
            <div className={`mt-4 space-y-2 text-xs leading-6 ${dark ? "text-zinc-400" : "text-zinc-600"}`}>
              <p>{COMPANY_CONTACT.address}</p>
              <p>{COMPANY_CONTACT.email}</p>
              <p>{COMPANY_CONTACT.phone}</p>
            </div>
          </aside>

          <div className="space-y-8">
            {sections.map((section, index) => (
              <article key={section.title} className={`p-6 border ${dark ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-100 shadow-sm"}`}>
                <div className="flex items-start gap-4">
                  <span className={`text-[10px] font-black tracking-widest shrink-0 mt-1 ${dark ? "text-[var(--brand-blue)]" : "text-[var(--brand-blue-deep)]"}`}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className={`text-lg sm:text-xl font-black mb-4 ${dark ? "text-white" : "text-zinc-900"}`}>{section.title}</h2>
                    <div className={`space-y-3 text-sm leading-7 ${dark ? "text-zinc-400" : "text-zinc-600"}`}>
                      {section.body.map((item) =>
                        Array.isArray(item) ? (
                          <ul key={item.join("-")} className="list-disc pl-5 space-y-2">
                            {item.map((point) => (
                              <li key={point}>{point}</li>
                            ))}
                          </ul>
                        ) : (
                          <p key={item}>{item}</p>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
