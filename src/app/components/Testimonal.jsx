"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const testimonials = [
  {
    id: 1,
    name: "Rajesh Sharma",
    company: "Sharma Infra Pvt. Ltd.",
    role: "Managing Director",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    review: "MTBOSS Construction delivered our commercial complex 2 weeks ahead of schedule. Their attention to detail, quality of materials, and professionalism is unmatched.",
  },
  {
    id: 2,
    name: "Priya Mehta",
    company: "Mehta Group Hospitality",
    role: "CEO",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    review: "Our 5-star hotel project was handled with exceptional care by MTBOSS. From MEP systems to interior fit-outs, every detail was perfect. The team was responsive and transparent.",
  },
  {
    id: 3,
    name: "Anil Verma",
    company: "Verma Industrial Corp.",
    role: "Director of Operations",
    photo: "https://randomuser.me/api/portraits/men/55.jpg",
    rating: 5,
    review: "We entrusted MTBOSS with our 3-lakh sq ft warehouse project. They managed everything seamlessly — design, procurement, and execution. Delivery was on time.",
  },
  {
    id: 4,
    name: "Sunita Agarwal",
    company: "Agarwal Realty",
    role: "Founder",
    photo: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
    review: "MTBOSS transformed our vision into a stunning residential township. Their sustainable construction approach and use of modern technology gave us a product buyers love.",
  },
  {
    id: 5,
    name: "Vikram Singh",
    company: "National Highway Authority",
    role: "Project Head",
    photo: "https://randomuser.me/api/portraits/men/77.jpg",
    rating: 5,
    review: "The infrastructure division executed a 42km highway stretch with precision. Safety standards were strictly maintained and the quality exceeded our expectations.",
  },
  {
    id: 6,
    name: "Deepa Nair",
    company: "Nair Tech Park",
    role: "General Manager",
    photo: "https://randomuser.me/api/portraits/women/12.jpg",
    rating: 5,
    review: "From foundation to finish, MTBOSS delivered our IT park with zero compromise on quality. Their project management team was always available and reliable.",
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "text-[#facc15]" : "text-gray-400 opacity-30"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState("next");
  const [progress, setProgress] = useState(0);
  const [isDark, setIsDark] = useState(false);

  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const startTimeRef = useRef(null);
  const AUTOPLAY_DELAY = 5000;

  // ✅ FIXED DARK MODE
  useEffect(() => {
    const checkTheme = () => {
      const hasDark =
        document.documentElement.classList.contains("dark-mode") ||
        document.documentElement.classList.contains("dark");
      setIsDark(hasDark);
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(0);
    startTimeRef.current = performance.now();
  }, []);

  const goTo = useCallback((index, dir = "next") => {
    if (animating || index === current) return;
    setDirection(dir);
    setAnimating(true);
    setCurrent(index);
    resetProgress();
    setTimeout(() => setAnimating(false), 600);
  }, [animating, current, resetProgress]);

  const next = useCallback(
    () => goTo((current + 1) % testimonials.length, "next"),
    [current, goTo]
  );
  const prev = useCallback(
    () =>
      goTo(
        (current - 1 + testimonials.length) % testimonials.length,
        "prev"
      ),
    [current, goTo]
  );

  useEffect(() => {
    timerRef.current = setInterval(next, AUTOPLAY_DELAY);
    return () => clearInterval(timerRef.current);
  }, [next]);

  useEffect(() => {
    startTimeRef.current = performance.now();
    const animate = (now) => {
      const elapsed = now - startTimeRef.current;
      const pct = Math.min((elapsed / AUTOPLAY_DELAY) * 100, 100);
      setProgress(pct);
      if (pct < 100)
        progressRef.current = requestAnimationFrame(animate);
    };
    progressRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(progressRef.current);
  }, [current]);

  const t = testimonials[current];
  const themeYellow = "#facc15";

  return (
    <section
      className={`transition-colors duration-500 py-20 px-6 ${
        isDark ? "bg-[#050505]" : "bg-white"
      }`}
    >
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-12">
          <p
            className="text-xs font-black uppercase tracking-[0.3em] mb-2"
            style={{ color: themeYellow }}
          >
            Success Stories
          </p>
          <h2
            className={`text-3xl sm:text-5xl font-black tracking-tighter mb-4 uppercase ${
              isDark ? "text-gray-100" : "text-black"
            }`}
          >
            Client Feedback
          </h2>
          <div className="w-12 h-1 bg-[#facc15] mx-auto rounded-full" />
        </div>

        <div
          className={`rounded-sm shadow-2xl p-8 sm:p-14 relative overflow-hidden transition-all duration-500 border ${
            isDark
              ? "bg-[#0a0a0a] border-yellow-500/30 shadow-yellow-500/10"
              : "bg-white border-yellow-200"
          }`}
          style={{
            opacity: animating ? 0 : 1,
            transform: animating
              ? direction === "next"
                ? "translateX(40px)"
                : "translateX(-40px)"
              : "translateX(0)",
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#facc15]" />

          <div className="flex justify-center mb-8">
            <StarRating rating={t.rating} />
          </div>

          <p
            className={`text-lg sm:text-2xl font-medium leading-relaxed text-center mb-10 max-w-2xl mx-auto italic tracking-tight ${
              isDark ? "text-gray-400" : "text-gray-700"
            }`}
          >
            "{t.review}"
          </p>

          <div className="flex flex-col items-center gap-4">
            <img
              src={t.photo}
              alt={t.name}
              className="w-20 h-20 rounded-full object-cover border-4 shadow-xl"
              style={{ borderColor: themeYellow }}
            />
            <div className="text-center">
              <p
                className={`text-base font-black uppercase tracking-widest ${
                  isDark ? "text-gray-100" : "text-black"
                }`}
              >
                {t.name}
              </p>
              <p
                className="text-sm font-bold uppercase tracking-wide"
                style={{ color: themeYellow }}
              >
                {t.role}
              </p>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">
                {t.company}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-8 mt-12">
          <div className="flex items-center gap-8">

            <button onClick={prev} className={`w-12 h-12 flex items-center justify-center rounded-full border-2 ${
              isDark ? 'border-yellow-500 text-yellow-400' : 'border-yellow-400 text-yellow-600'
            }`}>
              ←
            </button>

            <div className="flex items-center gap-3">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => goTo(i)}>
                  {i === current ? "●" : "○"}
                </button>
              ))}
            </div>

            <button onClick={next} className={`w-12 h-12 flex items-center justify-center rounded-full border-2 ${
              isDark ? 'border-yellow-500 text-yellow-400' : 'border-yellow-400 text-yellow-600'
            }`}>
              →
            </button>

          </div>
        </div>

      </div>
    </section>
  );
}