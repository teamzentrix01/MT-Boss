"use client";
import { useState, useEffect, useRef } from "react";
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


const franchiseModels = [
  {
    id: 1,
    name: "Associate Partner",
    investment: "₹ 5 - 10 Lakhs",
    returns: "Up to 20% ROI",
    area: "Single City",
    support: "Basic",
    color: "border-blue-500",
    badge: "bg-blue-500",
    features: [
      "Project referral rights",
      "Brand usage license",
      "Sales training provided",
      "Marketing materials",
      "Dedicated relationship manager",
    ],
  },
  {
    id: 2,
    name: "Regional Franchise",
    investment: "₹ 25 - 50 Lakhs",
    returns: "Up to 35% ROI",
    area: "Multiple Districts",
    support: "Premium",
    color: "border-[#facc15]",
    badge: "bg-[#facc15]",
    popular: true,
    features: [
      "Exclusive territory rights",
      "Full brand partnership",
      "On-site technical support",
      "Lead generation support",
      "Revenue sharing model",
      "Priority project allocation",
      "Joint marketing campaigns",
    ],
  },
  {
    id: 3,
    name: "Master Franchise",
    investment: "₹ 1 Cr+",
    returns: "Up to 50% ROI",
    area: "Entire State",
    support: "Elite",
    color: "border-purple-500",
    badge: "bg-purple-500",
    features: [
      "State-level exclusivity",
      "Sub-franchise rights",
      "Board-level representation",
      "Dedicated project pipeline",
      "Co-branding opportunities",
      "Annual profit sharing",
      "Infrastructure support",
      "Direct CEO access",
    ],
  },
];

const benefits = [
  { icon: "🏆", title: "Established Brand", desc: "20+ years of trust and recognition across India's construction industry." },
  { icon: "📈", title: "High ROI", desc: "Proven business model with returns up to 50% depending on franchise tier." },
  { icon: "🤝", title: "End-to-End Support", desc: "From training to project execution — we support you at every step." },
  { icon: "🌍", title: "Pan India Network", desc: "Join a network of 50+ cities and 500+ skilled professionals." },
  { icon: "🔧", title: "Technical Expertise", desc: "Access to MTBOSS's engineering and procurement capabilities." },
  { icon: "📣", title: "Marketing Support", desc: "Co-branded campaigns, digital marketing, and lead generation support." },
  { icon: "⚡", title: "Fast Onboarding", desc: "Get operational in 30 days with our streamlined onboarding process." },
  { icon: "💰", title: "Multiple Revenue Streams", desc: "Earn from referrals, project execution, and sub-franchise fees." },
];

const process = [
  { step: "01", title: "Submit Application", desc: "Fill the franchise inquiry form with your details and preferred model." },
  { step: "02", title: "Initial Review", desc: "Our franchise team reviews your application within 3-5 business days." },
  { step: "03", title: "Discovery Call", desc: "One-on-one call with our Franchise Head to discuss opportunities." },
  { step: "04", title: "Site Visit", desc: "Visit our headquarters and meet the leadership team in person." },
  { step: "05", title: "Agreement Signing", desc: "Finalize territory, investment, and sign the franchise agreement." },
  { step: "06", title: "Launch", desc: "Complete onboarding, training, and officially launch your franchise." },
];

const faqs = [
  { q: "What is the minimum investment required?", a: "The minimum investment starts at ₹5 Lakhs for the Associate Partner model. Regional and Master Franchise models require higher investment with proportionally higher returns." },
  { q: "Do I need prior construction experience?", a: "No prior construction experience is required. MTBOSS provides complete technical training and ongoing support. Business development and management skills are more important." },
  { q: "What territory will I get?", a: "Territory is allocated based on the franchise model chosen. Associate Partners get city-level rights, Regional Franchises get district-level, and Master Franchises get state-level exclusivity." },
  { q: "How long does onboarding take?", a: "Our streamlined onboarding process typically takes 30 days from agreement signing to being fully operational." },
  { q: "What kind of support does MTBOSS provide?", a: "We provide training, marketing materials, lead generation, technical support, project management assistance, and a dedicated relationship manager depending on your franchise tier." },
  { q: "Is there a royalty fee?", a: "Yes, a nominal royalty fee applies based on the franchise model. Full details are shared during the discovery call. Our revenue sharing model ensures mutual profitability." },
];

export default function FranchisePage() {
  const dark = useDarkMode();
  const [activeTab, setActiveTab] = useState("Associate Partner");
  const [activeFaq, setActiveFaq] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 const [form, setForm] = useState({
  // Personal
  name: "", fatherName: "", dob: "", gender: "", maritalStatus: "",
  phone: "", email: "", occupation: "", qualification: "", annualIncome: "",
  idType: "", idNumber: "", pan: "",
  // Address
  address: "", district: "", state: "", pinCode: "", city: "",
  // Business
  currentBusiness: "", experience: "", constructionExp: "",
  employees: "", network: "",
  // Banking
  bankName: "", branchName: "", accountNumber: "", ifscCode: "",
  // Franchise
  model: "", investment: "", territory: "", referralSource: "",
  startDate: "", serviceCategory: "",
  // Office
  officeArea: "", officeDistrict: "", premisesOwnership: "",
  leaseDuration: "", officeArea_sqft: "", officeType: "",
  // Additional
  message: "", otherFranchise: "", trainingWilling: "",
});
  const [heroRef, heroVisible] = useInView(0.1);
  const [benefitsRef, benefitsVisible] = useInView(0.1);
  const [processRef, processVisible] = useInView(0.1);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await fetch("https://formsubmit.co/ajax/team.zentrix01@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
  "Full Name": form.name,
  "Father / Husband Name": form.fatherName,
  "Date of Birth": form.dob,
  "Gender": form.gender,
  "Marital Status": form.maritalStatus || "Not Provided",
  "Phone": form.phone,
  "Email": form.email,
  "Occupation": form.occupation,
  "Qualification": form.qualification || "Not Provided",
  "Annual Income": form.annualIncome || "Not Provided",
  "ID Type": form.idType,
  "ID Number": form.idNumber,
  "PAN Number": form.pan,
  "Address": form.address,
  "District": form.district,
  "City": form.city,
  "State": form.state,
  "PIN Code": form.pinCode,
  "Current Business": form.currentBusiness || "None",
  "Business Experience": form.experience || "None",
  "Construction Experience": form.constructionExp || "None",
  "Employees": form.employees || "Not Provided",
  "Network": form.network || "Not Provided",
  "Bank Name": form.bankName,
  "Branch Name": form.branchName,
  "Account Number": form.accountNumber,
  "IFSC Code": form.ifscCode,
  "Franchise Model": form.model,
  "Investment Capacity": form.investment,
  "Preferred Territory": form.territory,
  "Referral Source": form.referralSource || "Not Provided",
  "Expected Start Date": form.startDate || "Not Provided",
  "Service Category": form.serviceCategory || "Not Provided",
  "Office Area": form.officeArea,
  "Office District": form.officeDistrict,
  "Premises Ownership": form.premisesOwnership || "Not Provided",
  "Lease Duration": form.leaseDuration || "Not Applicable",
  "Office Size (sqft)": form.officeArea_sqft || "Not Provided",
  "Office Type": form.officeType || "Not Provided",
  "Why MT BOSS": form.message,
  "Applied Other Franchise": form.otherFranchise || "Not Provided",
  "Willing for Training": form.trainingWilling || "Not Provided",
  "_subject": `New Franchise Application - ${form.model} - ${form.name}`,
  "_template": "table",
  "_captcha": "false",
}),
    });

    const data = await res.json();

    if (data.success === "true" || data.success === true) {
      setSubmitted(true);
    } else {
      setError("Something went wrong. Please try again.");
    }
  } catch (err) {
    setError("Network error. Please try again.");
  } finally {
    setLoading(false);
  }
};
  const inputClass = `w-full px-4 py-3 text-xs font-bold border rounded-sm outline-none transition-all duration-200 ${
    dark
      ? "bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#facc15]"
      : "bg-gray-50 border-gray-200 text-zinc-800 placeholder-zinc-400 focus:border-zinc-800"
  }`;

  const labelClass = `block text-[10px] font-black uppercase tracking-widest mb-2 ${
    dark ? "text-zinc-400" : "text-zinc-500"
  }`;

  const sectionCard = `p-6 rounded-sm border ${
    dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100 shadow-sm"
  }`;

  if (submitted) {
    return (
      <main className={`min-h-screen flex items-center justify-center px-6 ${dark ? "bg-black" : "bg-gray-50"}`}>
        <div className={`max-w-lg w-full text-center p-12 rounded-sm border ${dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100 shadow-xl"}`}>
          <div className="w-20 h-20 bg-[#facc15] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-[#facc15] text-[10px] font-black uppercase tracking-widest block mb-2">
            Inquiry Submitted!
          </span>
          <h2 className={`text-xl font-black uppercase tracking-tight mb-3 ${dark ? "text-white" : "text-zinc-800"}`}>
            Thank You, {form.name.split(" ")[0]}!
          </h2>
          <p className={`text-xs leading-relaxed mb-6 ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
            Our franchise team will review your application and contact you within 3-5 business days on{" "}
            <span className={`font-black ${dark ? "text-white" : "text-zinc-800"}`}>{form.email}</span>
          </p>
          <p className="text-[#facc15] font-black text-sm mb-8">{form.model} — {form.city}, {form.state}</p>
          <div className="flex gap-3 justify-center">
            <Link href="/" className={`px-6 py-3 border-2 text-[10px] font-black uppercase tracking-widest transition-all ${dark ? "border-zinc-700 text-zinc-400 hover:border-[#facc15] hover:text-[#facc15]" : "border-gray-200 text-zinc-500 hover:border-zinc-800 hover:text-zinc-800"}`}>
              Go Home
            </Link>
            <button
              onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", city: "", state: "", occupation: "", investment: "", model: "", experience: "", message: "" }); }}
              className="px-6 py-3 bg-[#facc15] text-black text-[10px] font-black uppercase tracking-widest hover:bg-yellow-400 transition-all"
            >
              New Inquiry
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen transition-colors duration-500 ${dark ? "bg-black" : "bg-gray-50"}`}>

      {/* ── HERO ── */}
      <section
        className="relative flex items-center justify-center text-center py-28 px-6"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/80" />
        <div
          ref={heroRef}
          className="relative z-10 max-w-3xl mx-auto"
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <span className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] block mb-4">
            MTBOSS Construction
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase text-white mb-4 tracking-tighter">
            Franchise
            <span className="block text-[#facc15]">Opportunity</span>
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
            Partner with India's trusted construction brand. Build a profitable business with MTBOSS's proven model, technical expertise, and 20+ years of legacy.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-6">
            {[
              { value: "50+", label: "Cities" },
              { value: "20+", label: "Years Legacy" },
              { value: "500+", label: "Projects Done" },
              { value: "3", label: "Franchise Models" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-[#facc15] text-2xl font-black">{s.value}</p>
                <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">{s.label}</p>
              </div>
            ))}
          </div>
<a
          
            href="#franchise-form"
            className="mt-10 inline-flex items-center gap-3 px-10 py-4 bg-[#facc15] text-black font-black uppercase text-xs tracking-widest hover:bg-yellow-400 transition-all"
          >
            Apply for Franchise
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>

      {/* ── FRANCHISE MODELS ── */}
      <section className={`py-20 px-6 transition-colors duration-500 ${dark ? "bg-zinc-900" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] block mb-2">
              Choose Your Path
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black uppercase tracking-tight ${dark ? "text-white" : "text-zinc-800"}`}>
              Franchise Models
            </h2>
            <p className={`text-xs mt-3 max-w-lg mx-auto ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
              Three flexible models designed for different investment levels and business goals
            </p>
          </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
  {franchiseModels.map((model) => (
    <div
      key={model.id}
      className={`relative rounded-sm border-2 p-8 transition-all duration-300 flex flex-col ${model.color} ${
        dark ? "bg-zinc-800" : "bg-white shadow-lg"
      }`}
    >
                {/* Popular Badge */}
                {model.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-[#facc15] text-black text-[10px] font-black uppercase tracking-widest rounded-sm">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Badge */}
                <span className={`inline-block px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm mb-4 ${model.badge} ${model.badge === "bg-[#facc15]" ? "text-black" : "text-white"}`}>
                  {model.support} Support
                </span>

                <h3 className={`text-lg font-black uppercase tracking-wide mb-2 ${dark ? "text-white" : "text-zinc-800"}`}>
                  {model.name}
                </h3>

                <p className="text-[#facc15] text-2xl font-black mb-1">{model.investment}</p>
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-6 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
                  Investment Range
                </p>

                <div className={`flex items-center justify-between py-3 border-y mb-6 ${dark ? "border-zinc-700" : "border-gray-100"}`}>
                  <div className="text-center">
                    <p className="text-[#facc15] font-black text-sm">{model.returns}</p>
                    <p className={`text-[9px] uppercase tracking-widest font-bold ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Returns</p>
                  </div>
                  <div className={`w-px h-8 ${dark ? "bg-zinc-700" : "bg-gray-200"}`} />
                  <div className="text-center">
                    <p className={`font-black text-sm ${dark ? "text-white" : "text-zinc-800"}`}>{model.area}</p>
                    <p className={`text-[9px] uppercase tracking-widest font-bold ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Territory</p>
                  </div>
                </div>

                <ul className="space-y-2 mb-8 flex-1">
                  {model.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <svg className="w-3.5 h-3.5 text-[#facc15] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className={`text-[11px] font-bold ${dark ? "text-zinc-400" : "text-zinc-500"}`}>{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#franchise-form"
                  onClick={() => setForm({ ...form, model: model.name })}
                  className={`block text-center py-3 text-[10px] font-black uppercase tracking-widest border-2 rounded-sm transition-all duration-300 ${
                    model.popular
                      ? "bg-[#facc15] border-[#facc15] text-black hover:bg-yellow-400"
                      : dark
                      ? "border-zinc-600 text-zinc-300 hover:border-[#facc15] hover:text-[#facc15]"
                      : "border-zinc-800 text-zinc-800 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  Apply for {model.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className={`py-20 px-6 transition-colors duration-500 ${dark ? "bg-black" : "bg-gray-50"}`}>
        <div
          ref={benefitsRef}
          className="max-w-7xl mx-auto"
          style={{
            opacity: benefitsVisible ? 1 : 0,
            transform: benefitsVisible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div className="text-center mb-14">
            <span className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] block mb-2">
              Why Partner With Us
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black uppercase tracking-tight ${dark ? "text-white" : "text-zinc-800"}`}>
              Franchise Benefits
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map((b, i) => (
              <div
                key={i}
                className={`group p-6 rounded-sm border transition-all duration-300 hover:border-[#facc15] ${
                  dark ? "bg-zinc-900 border-zinc-800 hover:bg-zinc-800" : "bg-white border-gray-100 hover:shadow-lg"
                }`}
              >
                <span className="text-3xl block mb-4">{b.icon}</span>
                <h3 className={`text-xs font-black uppercase tracking-widest mb-2 group-hover:text-[#facc15] transition-colors ${dark ? "text-white" : "text-zinc-800"}`}>
                  {b.title}
                </h3>
                <p className={`text-xs leading-relaxed ${dark ? "text-zinc-500" : "text-zinc-500"}`}>
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className={`py-20 px-6 transition-colors duration-500 ${dark ? "bg-zinc-900" : "bg-white"}`}>
        <div
          ref={processRef}
          className="max-w-6xl mx-auto"
          style={{
            opacity: processVisible ? 1 : 0,
            transform: processVisible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div className="text-center mb-14">
            <span className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] block mb-2">
              Simple Steps
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black uppercase tracking-tight ${dark ? "text-white" : "text-zinc-800"}`}>
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {process.map((p, i) => (
              <div
                key={i}
                className={`relative p-6 rounded-sm border transition-all duration-300 group hover:border-[#facc15] ${
                  dark ? "bg-zinc-800 border-zinc-700" : "bg-gray-50 border-gray-100 hover:bg-white hover:shadow-md"
                }`}
              >
                <span className={`text-5xl font-black opacity-10 group-hover:opacity-20 transition-opacity absolute top-4 right-4 ${dark ? "text-[#facc15]" : "text-zinc-800"}`}>
                  {p.step}
                </span>
                <div className="w-10 h-10 bg-[#facc15] rounded-sm flex items-center justify-center mb-4">
                  <span className="text-black font-black text-sm">{p.step}</span>
                </div>
                <h3 className={`text-xs font-black uppercase tracking-widest mb-2 group-hover:text-[#facc15] transition-colors ${dark ? "text-white" : "text-zinc-800"}`}>
                  {p.title}
                </h3>
                <p className={`text-xs leading-relaxed ${dark ? "text-zinc-500" : "text-zinc-500"}`}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className={`py-20 px-6 transition-colors duration-500 ${dark ? "bg-black" : "bg-gray-50"}`}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] block mb-2">
              Common Questions
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black uppercase tracking-tight ${dark ? "text-white" : "text-zinc-800"}`}>
              FAQ
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`rounded-sm border overflow-hidden transition-all duration-300 ${
                  activeFaq === i
                    ? dark ? "border-[#facc15] bg-zinc-900" : "border-zinc-800 bg-white shadow-md"
                    : dark ? "border-zinc-800 bg-zinc-900" : "border-gray-100 bg-white"
                }`}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className={`text-xs font-black uppercase tracking-wide ${dark ? "text-white" : "text-zinc-800"}`}>
                    {faq.q}
                  </span>
                  <svg
                    className={`w-4 h-4 flex-shrink-0 ml-4 transition-transform duration-300 text-[#facc15] ${activeFaq === i ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeFaq === i && (
                  <div className={`px-5 pb-5 text-xs leading-relaxed ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPLICATION FORM ── */}
     {/* ── APPLICATION FORM ── */}
<section
  id="franchise-form"
  className={`py-20 px-6 transition-colors duration-500 ${dark ? "bg-zinc-900" : "bg-white"}`}
>
  <div className="max-w-4xl mx-auto">

    <div className="text-center mb-12">
      <span className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] block mb-2">Get Started</span>
      <h2 className={`text-3xl sm:text-4xl font-black uppercase tracking-tight ${dark ? "text-white" : "text-zinc-800"}`}>
        Franchise Application Form
      </h2>
      <p className={`text-xs mt-3 max-w-lg mx-auto ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
        Fill all details carefully. Our franchise team will verify and contact you within 3-5 business days.
      </p>
    </div>

    <div className={`rounded-sm border ${dark ? "bg-zinc-800 border-zinc-700" : "bg-gray-50 border-gray-100 shadow-sm"}`}>

      {error && (
        <div className="mx-8 mt-8 p-4 bg-red-500/10 border border-red-500/30 rounded-sm flex items-start gap-3">
          <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-400 text-[11px] font-bold">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-8 space-y-10">

        {/* ── SECTION 1: PERSONAL DETAILS ── */}
        <div>
          <div className={`flex items-center gap-3 mb-6 pb-3 border-b ${dark ? "border-zinc-700" : "border-gray-200"}`}>
            <div className="w-7 h-7 bg-[#facc15] rounded-sm flex items-center justify-center flex-shrink-0">
              <span className="text-black text-[10px] font-black">01</span>
            </div>
            <h3 className={`text-xs font-black uppercase tracking-widest ${dark ? "text-white" : "text-zinc-800"}`}>
              Personal Details
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Full Name *</label>
              <input type="text" name="name" required placeholder="As per government ID" value={form.name} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Father / Husband Name *</label>
              <input type="text" name="fatherName" required placeholder="Father's or husband's name" value={form.fatherName || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Date of Birth *</label>
              <input type="date" name="dob" required value={form.dob || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Gender *</label>
              <select name="gender" required value={form.gender || ""} onChange={handleChange} className={inputClass}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Marital Status</label>
              <select name="maritalStatus" value={form.maritalStatus || ""} onChange={handleChange} className={inputClass}>
                <option value="">Select</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Mobile Number *</label>
              <input type="tel" name="phone" required placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email Address *</label>
              <input type="email" name="email" required placeholder="your@email.com" value={form.email} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Current Occupation *</label>
              <input type="text" name="occupation" required placeholder="e.g. Business Owner, Contractor" value={form.occupation} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Qualification</label>
              <select name="qualification" value={form.qualification || ""} onChange={handleChange} className={inputClass}>
                <option value="">Select</option>
                <option value="10th Pass">10th Pass</option>
                <option value="12th Pass">12th Pass</option>
                <option value="Diploma">Diploma</option>
                <option value="Graduate">Graduate</option>
                <option value="Post Graduate">Post Graduate</option>
                <option value="Professional Degree">Professional Degree (B.Tech/MBA etc.)</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Annual Income (Approx)</label>
              <select name="annualIncome" value={form.annualIncome || ""} onChange={handleChange} className={inputClass}>
                <option value="">Select Range</option>
                <option value="Below 5L">Below ₹5 Lakhs</option>
                <option value="5L-10L">₹5 - 10 Lakhs</option>
                <option value="10L-25L">₹10 - 25 Lakhs</option>
                <option value="25L-50L">₹25 - 50 Lakhs</option>
                <option value="50L+">Above ₹50 Lakhs</option>
              </select>
            </div>
          </div>

          {/* Identity Proof */}
          <div className={`mt-5 p-4 rounded-sm border ${dark ? "bg-zinc-900 border-zinc-700" : "bg-white border-gray-200"}`}>
            <p className={`text-[10px] font-black uppercase tracking-widest mb-3 ${dark ? "text-zinc-400" : "text-zinc-500"}`}>Identity Proof</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>ID Type *</label>
                <select name="idType" required value={form.idType || ""} onChange={handleChange} className={inputClass}>
                  <option value="">Select ID Type</option>
                  <option value="Aadhaar Card">Aadhaar Card</option>
                  <option value="Passport">Passport</option>
                  <option value="Voter ID">Voter ID</option>
                  <option value="Driving License">Driving License</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>ID Number *</label>
                <input type="text" name="idNumber" required placeholder="Enter ID number" value={form.idNumber || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>PAN Number *</label>
                <input type="text" name="pan" required placeholder="ABCDE1234F" value={form.pan || ""} onChange={handleChange} className={`${inputClass} uppercase`} />
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 2: ADDRESS DETAILS ── */}
        <div>
          <div className={`flex items-center gap-3 mb-6 pb-3 border-b ${dark ? "border-zinc-700" : "border-gray-200"}`}>
            <div className="w-7 h-7 bg-[#facc15] rounded-sm flex items-center justify-center flex-shrink-0">
              <span className="text-black text-[10px] font-black">02</span>
            </div>
            <h3 className={`text-xs font-black uppercase tracking-widest ${dark ? "text-white" : "text-zinc-800"}`}>
              Address Details
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className={labelClass}>Full Permanent Address *</label>
              <textarea name="address" required rows={2} placeholder="House No., Street, Area, Landmark..." value={form.address || ""} onChange={handleChange} className={`${inputClass} resize-none`} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>District *</label>
                <input type="text" name="district" required placeholder="Your district" value={form.district || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>State *</label>
                <select name="state" required value={form.state} onChange={handleChange} className={inputClass}>
                  <option value="">Select State</option>
                  {["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>PIN Code *</label>
                <input type="text" name="pinCode" required placeholder="6-digit PIN" maxLength={6} value={form.pinCode || ""} onChange={handleChange} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>City *</label>
              <input type="text" name="city" required placeholder="Your city" value={form.city} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>

        {/* ── SECTION 3: BUSINESS EXPERIENCE ── */}
        <div>
          <div className={`flex items-center gap-3 mb-6 pb-3 border-b ${dark ? "border-zinc-700" : "border-gray-200"}`}>
            <div className="w-7 h-7 bg-[#facc15] rounded-sm flex items-center justify-center flex-shrink-0">
              <span className="text-black text-[10px] font-black">03</span>
            </div>
            <h3 className={`text-xs font-black uppercase tracking-widest ${dark ? "text-white" : "text-zinc-800"}`}>
              Business Experience
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Current Business (if any)</label>
              <input type="text" name="currentBusiness" placeholder="e.g. Hardware Shop, Civil Contractor" value={form.currentBusiness || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Years in Business</label>
              <select name="experience" value={form.experience} onChange={handleChange} className={inputClass}>
                <option value="">Select</option>
                <option value="No Experience">No Prior Experience</option>
                <option value="1-2 Years">1-2 Years</option>
                <option value="3-5 Years">3-5 Years</option>
                <option value="5-10 Years">5-10 Years</option>
                <option value="10+ Years">10+ Years</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Construction Industry Experience</label>
              <select name="constructionExp" value={form.constructionExp || ""} onChange={handleChange} className={inputClass}>
                <option value="">Select</option>
                <option value="None">No Experience</option>
                <option value="Contractor">Civil Contractor</option>
                <option value="Material Supplier">Material Supplier</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Interior Designer">Interior Designer</option>
                <option value="Architect">Architect / Engineer</option>
                <option value="Other">Other Related Field</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Number of Employees (Current)</label>
              <select name="employees" value={form.employees || ""} onChange={handleChange} className={inputClass}>
                <option value="">Select</option>
                <option value="Solo">Solo / Proprietor</option>
                <option value="1-5">1-5 Employees</option>
                <option value="6-20">6-20 Employees</option>
                <option value="21-50">21-50 Employees</option>
                <option value="50+">50+ Employees</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Existing Network / Client Base</label>
              <input type="text" name="network" placeholder="e.g. 200+ builders, 50 architects, real estate agents..." value={form.network || ""} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>

        {/* ── SECTION 4: BANKING DETAILS ── */}
        <div>
          <div className={`flex items-center gap-3 mb-6 pb-3 border-b ${dark ? "border-zinc-700" : "border-gray-200"}`}>
            <div className="w-7 h-7 bg-[#facc15] rounded-sm flex items-center justify-center flex-shrink-0">
              <span className="text-black text-[10px] font-black">04</span>
            </div>
            <h3 className={`text-xs font-black uppercase tracking-widest ${dark ? "text-white" : "text-zinc-800"}`}>
              Banking Details
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Bank Name *</label>
              <input type="text" name="bankName" required placeholder="e.g. State Bank of India" value={form.bankName || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Branch Name *</label>
              <input type="text" name="branchName" required placeholder="Branch name" value={form.branchName || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Account Number *</label>
              <input type="text" name="accountNumber" required placeholder="Your bank account number" value={form.accountNumber || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>IFSC Code *</label>
              <input type="text" name="ifscCode" required placeholder="e.g. SBIN0001234" value={form.ifscCode || ""} onChange={handleChange} className={`${inputClass} uppercase`} />
            </div>
          </div>
          <p className={`text-[10px] mt-3 ${dark ? "text-zinc-600" : "text-zinc-400"}`}>
            Banking details are required for franchise fee processing and commission payments.
          </p>
        </div>

        {/* ── SECTION 5: FRANCHISE PREFERENCE ── */}
        <div>
          <div className={`flex items-center gap-3 mb-6 pb-3 border-b ${dark ? "border-zinc-700" : "border-gray-200"}`}>
            <div className="w-7 h-7 bg-[#facc15] rounded-sm flex items-center justify-center flex-shrink-0">
              <span className="text-black text-[10px] font-black">05</span>
            </div>
            <h3 className={`text-xs font-black uppercase tracking-widest ${dark ? "text-white" : "text-zinc-800"}`}>
              Franchise Preference
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Franchise Model *</label>
              <select name="model" required value={form.model} onChange={handleChange} className={inputClass}>
                <option value="">Select Model</option>
                <option value="Associate Partner">Associate Partner (₹5-10L)</option>
                <option value="Regional Franchise">Regional Franchise (₹25-50L)</option>
                <option value="Master Franchise">Master Franchise (₹1Cr+)</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Investment Capacity *</label>
              <select name="investment" required value={form.investment} onChange={handleChange} className={inputClass}>
                <option value="">Select Range</option>
                <option value="5-10 Lakhs">5 - 10 Lakhs</option>
                <option value="10-25 Lakhs">10 - 25 Lakhs</option>
                <option value="25-50 Lakhs">25 - 50 Lakhs</option>
                <option value="50L-1Cr">50 Lakhs - 1 Crore</option>
                <option value="1Cr+">1 Crore and above</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Preferred Territory *</label>
              <input type="text" name="territory" required placeholder="City or district you want" value={form.territory || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>How Did You Hear About Us?</label>
              <select name="referralSource" value={form.referralSource || ""} onChange={handleChange} className={inputClass}>
                <option value="">Select</option>
                <option value="Google Search">Google Search</option>
                <option value="Social Media">Social Media</option>
                <option value="Friend / Colleague">Friend / Colleague</option>
                <option value="Existing Franchisee">Existing Franchisee</option>
                <option value="Newspaper / Magazine">Newspaper / Magazine</option>
                <option value="Construction Expo">Construction Expo / Event</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Expected Start Date</label>
              <input type="date" name="startDate" value={form.startDate || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Preferred Service Category</label>
              <select name="serviceCategory" value={form.serviceCategory || ""} onChange={handleChange} className={inputClass}>
                <option value="">Select</option>
                <option value="Residential Construction">Residential Construction</option>
                <option value="Commercial Construction">Commercial Construction</option>
                <option value="Infrastructure">Infrastructure Projects</option>
                <option value="Interior Works">Interior Works</option>
                <option value="All Services">All Services</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── SECTION 6: PROPOSED OFFICE LOCATION ── */}
        <div>
          <div className={`flex items-center gap-3 mb-6 pb-3 border-b ${dark ? "border-zinc-700" : "border-gray-200"}`}>
            <div className="w-7 h-7 bg-[#facc15] rounded-sm flex items-center justify-center flex-shrink-0">
              <span className="text-black text-[10px] font-black">06</span>
            </div>
            <h3 className={`text-xs font-black uppercase tracking-widest ${dark ? "text-white" : "text-zinc-800"}`}>
              Proposed Office Location
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Village / Town / Area *</label>
              <input type="text" name="officeArea" required placeholder="Area where office will be set up" value={form.officeArea || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Office District *</label>
              <input type="text" name="officeDistrict" required placeholder="Office district" value={form.officeDistrict || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Do You Own the Premises?</label>
              <select name="premisesOwnership" value={form.premisesOwnership || ""} onChange={handleChange} className={inputClass}>
                <option value="">Select</option>
                <option value="Yes - Own Property">Yes — Own Property</option>
                <option value="No - Will Lease">No — Will Lease / Rent</option>
                <option value="Not Decided">Not Decided Yet</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>If Leased — Agreement Duration</label>
              <select name="leaseDuration" value={form.leaseDuration || ""} onChange={handleChange} className={inputClass}>
                <option value="">Select</option>
                <option value="1 Year">1 Year</option>
                <option value="2 Years">2 Years</option>
                <option value="3 Years">3 Years</option>
                <option value="5 Years">5 Years</option>
                <option value="More than 5 Years">More than 5 Years</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Office Area (sq. ft.)</label>
              <input type="number" name="officeArea_sqft" placeholder="e.g. 500" value={form.officeArea_sqft || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Office Type</label>
              <select name="officeType" value={form.officeType || ""} onChange={handleChange} className={inputClass}>
                <option value="">Select</option>
                <option value="Ground Floor Shop">Ground Floor Shop</option>
                <option value="Office Floor">Office Floor</option>
                <option value="Co-Working Space">Co-Working Space</option>
                <option value="Home Office">Home Office (Temporary)</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── SECTION 7: ADDITIONAL INFO ── */}
        <div>
          <div className={`flex items-center gap-3 mb-6 pb-3 border-b ${dark ? "border-zinc-700" : "border-gray-200"}`}>
            <div className="w-7 h-7 bg-[#facc15] rounded-sm flex items-center justify-center flex-shrink-0">
              <span className="text-black text-[10px] font-black">07</span>
            </div>
            <h3 className={`text-xs font-black uppercase tracking-widest ${dark ? "text-white" : "text-zinc-800"}`}>
              Additional Information
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Why do you want to partner with MT BOSS? *</label>
              <textarea name="message" required rows={4} placeholder="Share your motivation, goals, and what you bring to this partnership..." value={form.message} onChange={handleChange} className={`${inputClass} resize-none`} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Have You Applied to Any Other Franchise?</label>
                <select name="otherFranchise" value={form.otherFranchise || ""} onChange={handleChange} className={inputClass}>
                  <option value="">Select</option>
                  <option value="No">No</option>
                  <option value="Yes - Construction Related">Yes — Construction Related</option>
                  <option value="Yes - Other Industry">Yes — Other Industry</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Are You Willing to Attend Training?</label>
                <select name="trainingWilling" value={form.trainingWilling || ""} onChange={handleChange} className={inputClass}>
                  <option value="">Select</option>
                  <option value="Yes - Available Immediately">Yes — Available Immediately</option>
                  <option value="Yes - Within 1 Month">Yes — Within 1 Month</option>
                  <option value="Need Flexible Schedule">Need Flexible Schedule</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ── DECLARATION ── */}
        <div className={`p-6 rounded-sm border ${dark ? "bg-zinc-900 border-zinc-700" : "bg-yellow-50 border-yellow-100"}`}>
          <h3 className={`text-xs font-black uppercase tracking-widest mb-4 ${dark ? "text-[#facc15]" : "text-zinc-800"}`}>
            Declaration
          </h3>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" required className="mt-0.5 accent-[#facc15] flex-shrink-0" />
              <span className={`text-[11px] leading-relaxed ${dark ? "text-zinc-400" : "text-zinc-600"}`}>
                I hereby declare that all the information provided in this application form is true, correct, and complete to the best of my knowledge. I understand that any false information may result in rejection of my application.
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" required className="mt-0.5 accent-[#facc15] flex-shrink-0" />
              <span className={`text-[11px] leading-relaxed ${dark ? "text-zinc-400" : "text-zinc-600"}`}>
                I have read and understood all information available about MT BOSS Construction franchise opportunity, including the investment requirements, terms, and fee structure involved.
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" required className="mt-0.5 accent-[#facc15] flex-shrink-0" />
              <span className={`text-[11px] leading-relaxed ${dark ? "text-zinc-400" : "text-zinc-600"}`}>
                I agree that MT BOSS Construction may contact me regarding this franchise inquiry. I understand that submitting this form does not guarantee a franchise agreement.
              </span>
            </label>
          </div>
        </div>

        {/* ── SUBMIT ── */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t ${dark ? "border-zinc-700" : "border-gray-200"}`}>
          <p className={`text-[10px] ${dark ? "text-zinc-600" : "text-zinc-400"}`}>
            Your data is secure and will only be used for franchise processing purposes.
          </p>
          <button
            type="submit"
            disabled={loading}
            className="px-12 py-4 bg-[#facc15] text-black text-[10px] font-black uppercase tracking-widest hover:bg-yellow-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-3 rounded-sm"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Submitting...
              </>
            ) : (
              <>
                Submit Application
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  </div>
</section>

      {/* ── BOTTOM CTA ── */}
      <section className={`py-16 px-6 transition-colors duration-500 ${dark ? "bg-black" : "bg-zinc-800"}`}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] mb-3">
            Have Questions?
          </p>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-white mb-4 tracking-tight">
            Talk to Our Franchise Team
          </h2>
          <p className="text-zinc-400 text-xs mb-8 max-w-lg mx-auto leading-relaxed">
            Call us directly or send an email — our franchise experts are ready to answer all your questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+919999999999"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#facc15] text-black font-black uppercase text-xs tracking-widest hover:bg-yellow-400 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Now
            </a>
            <a
              href="mailto:franchise@mtboss.com"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-white text-white font-black uppercase text-xs tracking-widest hover:bg-white hover:text-zinc-800 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Us
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}