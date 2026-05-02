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
    review:
      "MTBOSS Construction delivered our commercial complex 2 weeks ahead of schedule. Their attention to detail, quality of materials, and professionalism is unmatched. We have already signed them for our next project.",
  },
  {
    id: 2,
    name: "Priya Mehta",
    company: "Mehta Group Hospitality",
    role: "CEO",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    review:
      "Our 5-star hotel project was handled with exceptional care by MTBOSS. From MEP systems to interior fit-outs, every detail was perfect. The team was responsive, transparent, and truly committed to excellence.",
  },
  {
    id: 3,
    name: "Anil Verma",
    company: "Verma Industrial Corp.",
    role: "Director of Operations",
    photo: "https://randomuser.me/api/portraits/men/55.jpg",
    rating: 5,
    review:
      "We entrusted MTBOSS with our 3-lakh sq ft warehouse project. They managed everything seamlessly — design, procurement, and execution. Delivery was on time and within the agreed budget. Highly recommended.",
  },
  {
    id: 4,
    name: "Sunita Agarwal",
    company: "Agarwal Realty",
    role: "Founder",
    photo: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
    review:
      "MTBOSS transformed our vision into a stunning residential township. Their sustainable construction approach and use of modern technology gave us a product that our buyers absolutely love. Outstanding work.",
  },
  {
    id: 5,
    name: "Vikram Singh",
    company: "National Highway Authority",
    role: "Project Head",
    photo: "https://randomuser.me/api/portraits/men/77.jpg",
    rating: 5,
    review:
      "The infrastructure division of MTBOSS executed a 42km highway stretch with precision and speed. Safety standards were strictly maintained and the quality of construction exceeded our expectations.",
  },
  {
    id: 6,
    name: "Deepa Nair",
    company: "Nair Tech Park",
    role: "General Manager",
    photo: "https://randomuser.me/api/portraits/women/12.jpg",
    rating: 5,
    review:
      "From foundation to finish, MTBOSS delivered our IT park with zero compromise on quality. Their project management team was always available and kept us informed at every stage. A truly reliable partner.",
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsPage() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState("next");
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const startTimeRef = useRef(null);
  const AUTOPLAY_DELAY = 5000;

  const resetProgress = () => {
    setProgress(0);
    startTimeRef.current = performance.now();
  };

  const goTo = useCallback((index, dir = "next") => {
    if (animating || index === current) return;
    setDirection(dir);
    setAnimating(true);
    setCurrent(index);
    resetProgress();
    setTimeout(() => setAnimating(false), 600);
  }, [animating, current]);

  const next = () => goTo((current + 1) % testimonials.length, "next");
  const prev = () => goTo((current - 1 + testimonials.length) % testimonials.length, "prev");

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length);
      resetProgress();
    }, AUTOPLAY_DELAY);
    return () => clearInterval(timerRef.current);
  }, [current]);

  useEffect(() => {
    startTimeRef.current = performance.now();
    const animate = (now) => {
      const elapsed = now - startTimeRef.current;
      const pct = Math.min((elapsed / AUTOPLAY_DELAY) * 100, 100);
      setProgress(pct);
      if (pct < 100) progressRef.current = requestAnimationFrame(animate);
    };
    progressRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(progressRef.current);
  }, [current]);

  const t = testimonials[current];

  return (
    <main>
      {/* Hero Banner */}
      <section
        className="relative flex items-center justify-center text-center"
        style={{
          height: "300px",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#0d6ebd]/75" />

       

        <div className="relative z-10 px-6">
          <p className="text-xs uppercase tracking-widest text-[#cce8ff] mb-3">MTBOSS Construction</p>
          <h1
            className="text-4xl sm:text-5xl font-black text-white mb-4"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Testimonials
          </h1>
          <div className="w-10 h-0.5 bg-white mx-auto mb-4 rounded" />
          <p className="text-sm text-[#cce8ff] max-w-xl mx-auto leading-relaxed">
            What our clients say about working with MTBOSS.
          </p>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="bg-[#f0f7ff] py-20 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Big Quote Icon */}
          <div className="text-center mb-6">
            <svg className="w-12 h-12 text-[#0d6ebd]/30 mx-auto" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>

          {/* Slide Card */}
          <div
            className="bg-white rounded-sm shadow-xl p-8 sm:p-12 relative overflow-hidden"
            style={{
              opacity: animating ? 0 : 1,
              transform: animating
                ? direction === "next" ? "translateX(40px)" : "translateX(-40px)"
                : "translateX(0)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
          >
            {/* Blue accent top bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#0d6ebd]" />

            {/* Rating */}
            <div className="flex justify-center mb-6">
              <StarRating rating={t.rating} />
            </div>

            {/* Review Text */}
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed text-center mb-8 max-w-2xl mx-auto italic">
              "{t.review}"
            </p>

            {/* Divider */}
            <div className="w-10 h-0.5 bg-[#0d6ebd] mx-auto mb-6 rounded" />

            {/* Client Info */}
            <div className="flex flex-col items-center gap-3">
              <img
                src={t.photo}
                alt={t.name}
                className="w-16 h-16 rounded-full object-cover border-4 border-[#0d6ebd] shadow-md"
              />
              <div className="text-center">
                <p className="text-sm font-black text-[#0a3d6e] uppercase tracking-wide">{t.name}</p>
                <p className="text-xs text-[#0d6ebd] font-semibold">{t.role}</p>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-0.5">{t.company}</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mt-10">
            {/* Prev */}
            <button
              onClick={prev}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-[#0d6ebd]/50 bg-white hover:bg-[#0d6ebd] text-[#0d6ebd] hover:text-white transition-all duration-200 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Dots with progress */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i, i > current ? "next" : "prev")}
                  aria-label={`Go to testimonial ${i + 1}`}
                >
                  {i === current ? (
                    <span className="relative block w-10 h-1.5 rounded-full bg-[#0d6ebd]/30 overflow-hidden">
                      <span
                        className="absolute left-0 top-0 h-full bg-[#0d6ebd] rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </span>
                  ) : (
                    <span className="block w-4 h-1.5 rounded-full bg-[#0d6ebd]/30 hover:bg-[#0d6ebd]/60 transition-colors duration-200" />
                  )}
                </button>
              ))}
            </div>

            {/* Next */}
            <button
              onClick={next}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-[#0d6ebd]/50 bg-white hover:bg-[#0d6ebd] text-[#0d6ebd] hover:text-white transition-all duration-200 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Counter */}
          <p className="text-center text-xs text-[#0d6ebd]/60 tracking-widest mt-4"
            style={{ fontFamily: "'Georgia', serif" }}>
            <span className="font-bold text-[#0d6ebd]">{String(current + 1).padStart(2, "0")}</span>
            {" / "}
            {String(testimonials.length).padStart(2, "0")}
          </p>
        </div>
      </section>

      {/* All Testimonials Grid */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-[#0d6ebd] mb-2">All Reviews</p>
            <h2 className="text-3xl font-black text-[#0a3d6e] mb-3">What Everyone Says</h2>
            <div className="w-10 h-0.5 bg-[#0d6ebd] mx-auto rounded" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((item, i) => (
              <div
                key={item.id}
                className={`bg-[#f0f7ff] rounded-sm p-6 shadow-sm border-t-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  i === current ? "border-[#0d6ebd]" : "border-[#b3d9f7]"
                }`}
              >
                <StarRating rating={item.rating} />
                <p className="text-sm text-gray-600 leading-relaxed mt-3 mb-5 italic">
                  "{item.review.slice(0, 120)}..."
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={item.photo}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#0d6ebd]"
                  />
                  <div>
                    <p className="text-xs font-black text-[#0a3d6e] uppercase tracking-wide">{item.name}</p>
                    <p className="text-xs text-[#0d6ebd]">{item.role}</p>
                    <p className="text-xs text-gray-400">{item.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}