"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { jobs as fallbackJobs } from "../data/jobs";
import { COMPANY_CONTACT } from "../../lib/company";

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

export default function JobDetailPage() {
  const { id } = useParams();
  const dark = useDarkMode();
  const fallbackJob = fallbackJobs.find((j) => j.id === id);
  const [job, setJob] = useState(fallbackJob || null);
  const [jobs, setJobs] = useState(fallbackJobs);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    alternativePhone: "",
    experience: "",
    currentCompany: "",
    noticePeriod: "",
    currentSalary: "",
    expectedSalary: "",
    coverLetter: "",
    resume: null,
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resumeName, setResumeName] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const [jobRes, jobsRes] = await Promise.all([
          fetch(`/api/jobs?id=${encodeURIComponent(id)}`),
          fetch("/api/jobs"),
        ]);
        const jobData = await jobRes.json();
        const jobsData = await jobsRes.json();

        if (jobData.success) setJob(jobData.data);
        if (jobsData.success && jobsData.data.length > 0) setJobs(jobsData.data);
      } catch (fetchError) {
        console.error("Job detail fetch failed:", fetchError);
      }
    };

    if (id) fetchJobs();
  }, [id]);

  const getPostedLabel = (item) => {
    if (item.posted) return item.posted;
    if (!item.created_at) return "Recently posted";

    const days = Math.max(0, Math.floor((Date.now() - new Date(item.created_at).getTime()) / 86400000));
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    if (days < 7) return `${days} days ago`;
    if (days < 14) return "1 week ago";
    return `${Math.floor(days / 7)} weeks ago`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone' || name === 'alternativePhone') {
      const rawDigits = value.replace(/\D/g, '');
      setForm(prev => ({ ...prev, [name]: rawDigits && /^[6-9]/.test(rawDigits) ? rawDigits.slice(0, 10) : '' }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (file) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be under 5MB");
        return;
      }
      const allowed = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowed.includes(file.type)) {
        setError("Only PDF or Word documents allowed");
        return;
      }
      setError("");
      setForm({ ...form, resume: file });
      setResumeName(file.name);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileChange(e.dataTransfer.files[0]);
  };

  const openWhatsApp = (enquiry) => {
    const num = COMPANY_CONTACT.phoneDigits;
    const msg = [
      `💼 *New Job Application – MTBOSS*`,
      ``,
      `👤 *Name:* ${enquiry.name}`,
      `📧 *Email:* ${enquiry.email}`,
      `📱 *Phone:* ${enquiry.phone}`,
      enquiry.alternative_phone ? `📱 *Alt Phone:* ${enquiry.alternative_phone}` : null,
      `🎯 *Position:* ${enquiry.position}`,
      `💼 *Experience:* ${enquiry.experience}`,
      enquiry.current_company ? `🏢 *Current Company:* ${enquiry.current_company}` : null,
      enquiry.notice_period ? `⏳ *Notice Period:* ${enquiry.notice_period}` : null,
      enquiry.expected_salary ? `💰 *Expected Salary:* ${enquiry.expected_salary}` : null,
      enquiry.resume_url ? `📄 *Resume Link:* ${window.location.origin}${enquiry.resume_url}` : null,
      enquiry.cover_letter ? `📝 *Cover Letter:* ${enquiry.cover_letter}` : null,
    ].filter(Boolean).join('\n');

    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, '_blank');
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!form.phone) { setError('Phone number is required.'); return; }
  if (!phoneRegex.test(form.phone)) { setError('Enter a valid 10-digit Indian mobile number (starts with 6-9).'); return; }
  if (form.alternativePhone && !phoneRegex.test(form.alternativePhone)) {
    setError('Enter a valid 10-digit alternative Indian mobile number.');
    return;
  }
  if (!form.resume) {
    setError('Please upload your resume in PDF or Word format.');
    return;
  }
  setLoading(true);

  try {
    const payload = new FormData();
    payload.append("job_id", id);
    payload.append("position", job.title);
    payload.append("department", job.department);
    payload.append("job_location", job.location);
    payload.append("name", form.name);
    payload.append("email", form.email);
    payload.append("phone", form.phone);
    payload.append("alternative_phone", form.alternativePhone);
    payload.append("experience", form.experience);
    payload.append("current_company", form.currentCompany);
    payload.append("notice_period", form.noticePeriod);
    payload.append("current_salary", form.currentSalary);
    payload.append("expected_salary", form.expectedSalary);
    payload.append("cover_letter", form.coverLetter);
    payload.append("resume_name", resumeName);
    payload.append("resume", form.resume);

    const res = await fetch("/api/career-enquiries", {
      method: "POST",
      body: payload,
    });
    const data = await res.json();

    if (!data.success) {
      setError(data.error || "Failed to send. Please try again.");
      return;
    }

    if (data.data) {
      openWhatsApp(data.data);
    }

    setSubmitted(true);
  } catch (err) {
    console.error("Career enquiry error:", err);
    setError("Failed to send. Please try again.");
  } finally {
    setLoading(false);
  }
};

  if (!job) {
    return (
      <main className={`min-h-screen flex items-center justify-center ${dark ? "bg-black" : "bg-gray-50"}`}>
        <div className="text-center">
          <p className={`text-xs font-black uppercase tracking-widest mb-4 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
            Job not found
          </p>
          <Link href="/careers" className="px-6 py-3 bg-[var(--brand-blue)] text-black text-[10px] font-black uppercase tracking-widest">
            Back to Careers
          </Link>
        </div>
      </main>
    );
  }

  const inputClass = `w-full px-4 py-3 text-xs font-bold border rounded-sm outline-none transition-all duration-200 ${
    dark
      ? "bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[var(--brand-blue)]"
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
          <div className="w-20 h-20 bg-[var(--brand-blue)] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-[var(--brand-blue)] text-[10px] font-black uppercase tracking-widest block mb-2">
            Application Submitted!
          </span>
          <h2 className={`text-xl font-black uppercase tracking-tight mb-3 ${dark ? "text-white" : "text-zinc-800"}`}>
            Thank You, {form.name.split(" ")[0]}!
          </h2>
          <p className={`text-xs leading-relaxed mb-2 ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
            Your application for
          </p>
          <p className="text-[var(--brand-blue)] font-black text-sm mb-6">{job.title}</p>
          <p className={`text-xs leading-relaxed mb-8 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
            Our HR team will review your application and get back to you within 3-5 business days on{" "}
            <span className={`font-black ${dark ? "text-white" : "text-zinc-800"}`}>{form.email}</span>
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/careers"
              className={`px-6 py-3 border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                dark
                  ? "border-zinc-700 text-zinc-400 hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
                  : "border-gray-200 text-zinc-500 hover:border-zinc-800 hover:text-zinc-800"
              }`}
            >
              View More Jobs
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-[var(--brand-blue)] text-black text-[10px] font-black uppercase tracking-widest hover:bg-[var(--brand-blue-dark)] transition-all"
            >
              Go Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen transition-colors duration-500 ${dark ? "bg-black" : "bg-gray-50"}`}>

      {/* Breadcrumb */}
      <div className={`py-4 px-6 border-b ${dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"}`}>
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
          <Link href="/" className={`transition-colors ${dark ? "text-zinc-500 hover:text-[var(--brand-blue)]" : "text-zinc-400 hover:text-zinc-800"}`}>Home</Link>
          <span className={dark ? "text-zinc-700" : "text-gray-300"}>›</span>
          <Link href="/careers" className={`transition-colors ${dark ? "text-zinc-500 hover:text-[var(--brand-blue)]" : "text-zinc-400 hover:text-zinc-800"}`}>Careers</Link>
          <span className={dark ? "text-zinc-700" : "text-gray-300"}>›</span>
          <span className="text-[var(--brand-blue)] truncate max-w-48">{job.title}</span>
        </div>
      </div>

      {/* Hero */}
      <div className={`py-12 px-6 border-b transition-colors duration-500 ${dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              {job.urgent && (
                <span className="inline-block mb-3 px-3 py-1 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest rounded-sm">
                  Urgent Hiring
                </span>
              )}
              <h1 className={`text-3xl sm:text-4xl font-black uppercase tracking-tight mb-3 ${dark ? "text-white" : "text-zinc-800"}`}>
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`text-[10px] font-black px-3 py-1 border rounded-sm ${dark ? departmentColors[job.department] : departmentColorsLight[job.department]}`}>
                  {job.department}
                </span>
                {[
                  { icon: "📍", text: job.location },
                  { icon: "💼", text: job.type },
                  { icon: "⏱️", text: job.experience },
                  { icon: "🕐", text: `Posted ${getPostedLabel(job)}` },
                ].map((item) => (
                  <span key={item.text} className={`flex items-center gap-1 text-[10px] font-bold ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
                    {item.icon} {item.text}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-left md:text-right shrink-0">
              <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${dark ? "text-zinc-600" : "text-zinc-400"}`}>
                Salary Range
              </p>
              <p className="text-[var(--brand-blue)] text-2xl font-black">{job.salary}</p>
              <a
                href="#apply-form"
                className="mt-3 inline-block px-8 py-3 bg-[var(--brand-blue)] text-black text-[10px] font-black uppercase tracking-widest hover:bg-[var(--brand-blue-dark)] transition-all"
              >
                Apply Now →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            <div className={sectionCard}>
              <h2 className={`text-xs font-black uppercase tracking-widest mb-4 ${dark ? "text-[var(--brand-blue)]" : "text-zinc-800"}`}>
                About This Role
              </h2>
              <p className={`text-xs leading-relaxed ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
                {job.description}
              </p>
            </div>

            <div className={sectionCard}>
              <h2 className={`text-xs font-black uppercase tracking-widest mb-4 ${dark ? "text-[var(--brand-blue)]" : "text-zinc-800"}`}>
                Key Responsibilities
              </h2>
              <ul className="space-y-3">
                {job.responsibilities.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-blue)] mt-1.5 flex-shrink-0" />
                    <span className={`text-xs leading-relaxed ${dark ? "text-zinc-400" : "text-zinc-500"}`}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={sectionCard}>
              <h2 className={`text-xs font-black uppercase tracking-widest mb-4 ${dark ? "text-[var(--brand-blue)]" : "text-zinc-800"}`}>
                Requirements
              </h2>
              <ul className="space-y-3">
                {job.requirements.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-3.5 h-3.5 text-[var(--brand-blue)] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className={`text-xs leading-relaxed ${dark ? "text-zinc-400" : "text-zinc-500"}`}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={sectionCard}>
              <h2 className={`text-xs font-black uppercase tracking-widest mb-4 ${dark ? "text-[var(--brand-blue)]" : "text-zinc-800"}`}>
                Skills Required
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span key={skill} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border rounded-sm ${dark ? "border-zinc-700 text-zinc-300 bg-zinc-800" : "border-gray-200 text-zinc-600 bg-gray-50"}`}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">

              <div className={sectionCard}>
                <h3 className={`text-[10px] font-black uppercase tracking-widest mb-4 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
                  Job Overview
                </h3>
                {[
                  { label: "Department", value: job.department },
                  { label: "Location", value: job.location },
                  { label: "Job Type", value: job.type },
                  { label: "Experience", value: job.experience },
                  { label: "Salary", value: job.salary },
                  { label: "Posted", value: getPostedLabel(job) },
                ].map((item) => (
                  <div key={item.label} className={`flex justify-between py-2.5 border-b text-[11px] last:border-0 ${dark ? "border-zinc-800" : "border-gray-50"}`}>
                    <span className={`font-bold ${dark ? "text-zinc-500" : "text-zinc-400"}`}>{item.label}</span>
                    <span className={`font-black ${dark ? "text-white" : "text-zinc-800"}`}>{item.value}</span>
                  </div>
                ))}
                <a
                  href="#apply-form"
                  className="mt-5 block text-center py-3 bg-[var(--brand-blue)] text-black text-[10px] font-black uppercase tracking-widest hover:bg-[var(--brand-blue-dark)] transition-all rounded-sm"
                >
                  Apply for this Job
                </a>
              </div>

              <div className={sectionCard}>
                <h3 className={`text-[10px] font-black uppercase tracking-widest mb-4 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
                  Similar Jobs
                </h3>
                <div className="space-y-3">
                  {jobs
                    .filter((j) => j.id !== job.id && j.department === job.department)
                    .slice(0, 2)
                    .map((j) => (
                      <Link
                        key={j.id}
                        href={`/careers/${j.id}`}
                        className={`block p-3 border rounded-sm transition-all hover:border-[var(--brand-blue)] group ${dark ? "border-zinc-800 hover:bg-zinc-800" : "border-gray-100 hover:bg-gray-50"}`}
                      >
                        <p className={`text-[10px] font-black uppercase tracking-wide group-hover:text-[var(--brand-blue)] transition-colors ${dark ? "text-white" : "text-zinc-800"}`}>
                          {j.title}
                        </p>
                        <p className={`text-[10px] mt-1 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
                          {j.location} • {j.experience}
                        </p>
                      </Link>
                    ))}
                  {jobs.filter((j) => j.id !== job.id && j.department === job.department).length === 0 && (
                    <p className={`text-[10px] ${dark ? "text-zinc-600" : "text-zinc-400"}`}>
                      No similar jobs right now.
                    </p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* APPLICATION FORM */}
        <div id="apply-form" className={`mt-12 p-8 rounded-sm border ${dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100 shadow-sm"}`}>

          <div className="mb-8">
            <span className="text-[var(--brand-blue)] text-[10px] font-black uppercase tracking-widest block mb-1">
              Apply Now
            </span>
            <h2 className={`text-2xl font-black uppercase tracking-tight ${dark ? "text-white" : "text-zinc-800"}`}>
              Application Form
            </h2>
            <p className={`text-xs mt-2 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
              Applying for: <span className="text-[var(--brand-blue)] font-black">{job.title}</span> — {job.department} — {job.location}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-sm flex items-start gap-3">
              <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-400 text-[11px] font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Personal Info */}
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-4 pb-2 border-b ${dark ? "text-zinc-500 border-zinc-800" : "text-zinc-400 border-gray-100"}`}>
                Personal Information
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input type="text" name="name" required placeholder="Your full name" value={form.name} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Email Address *</label>
                  <input type="email" name="email" required placeholder="your@email.com" value={form.email} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Phone Number *</label>
                  <input type="tel" name="phone" placeholder="10-digit mobile number" value={form.phone} onChange={handleChange} maxLength={10} inputMode="numeric" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Alternative Phone Number</label>
                  <input type="tel" name="alternativePhone" placeholder="Optional 10-digit mobile number" value={form.alternativePhone} onChange={handleChange} maxLength={10} inputMode="numeric" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Years of Experience *</label>
                  <input type="text" name="experience" required placeholder="e.g. 5 Years" value={form.experience} onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </div>

            {/* Professional Info */}
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-4 pb-2 border-b ${dark ? "text-zinc-500 border-zinc-800" : "text-zinc-400 border-gray-100"}`}>
                Professional Details
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className={labelClass}>Current Company</label>
                  <input type="text" name="currentCompany" placeholder="Company or Fresher" value={form.currentCompany} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Notice Period</label>
                  <select name="noticePeriod" value={form.noticePeriod} onChange={handleChange} className={inputClass}>
                    <option value="">Select</option>
                    <option value="Immediate">Immediate</option>
                    <option value="15 Days">15 Days</option>
                    <option value="30 Days">30 Days</option>
                    <option value="60 Days">60 Days</option>
                    <option value="90 Days">90 Days</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Current Salary</label>
                  <input type="text" name="currentSalary" placeholder="e.g. 8 LPA" value={form.currentSalary} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Expected Salary</label>
                  <input type="text" name="expectedSalary" placeholder="e.g. 12 LPA" value={form.expectedSalary} onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </div>

            {/* Resume Upload */}
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-4 pb-2 border-b ${dark ? "text-zinc-500 border-zinc-800" : "text-zinc-400 border-gray-100"}`}>
                Resume Upload *
              </p>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`relative border-2 border-dashed rounded-sm p-10 text-center cursor-pointer transition-all duration-300 ${
                  dragOver
                    ? "border-[var(--brand-blue)] bg-[var(--brand-blue)]/5"
                    : resumeName
                    ? dark ? "border-green-500/40 bg-green-500/5" : "border-green-400 bg-green-50"
                    : dark
                    ? "border-zinc-700 hover:border-[var(--brand-blue)] hover:bg-zinc-800/50"
                    : "border-gray-200 hover:border-zinc-400 hover:bg-gray-50"
                }`}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                />

                {resumeName ? (
                  <div>
                    <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className={`text-xs font-black truncate max-w-xs mx-auto mb-1 ${dark ? "text-white" : "text-zinc-800"}`}>
                      {resumeName}
                    </p>
                    <p className={`text-[10px] ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
                      Resume uploaded — click to change
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${dark ? "bg-zinc-800" : "bg-gray-100"}`}>
                      <svg className={`w-7 h-7 ${dark ? "text-zinc-500" : "text-zinc-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className={`text-xs font-black uppercase tracking-widest mb-1 ${dark ? "text-white" : "text-zinc-700"}`}>
                      Drag and Drop your Resume
                    </p>
                    <p className={`text-[10px] ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
                      or click to browse — PDF or Word only, max 5MB
                    </p>
                  </div>
                )}
              </div>

              {/* Note about resume */}
              <p className={`text-[10px] mt-2 ${dark ? "text-zinc-600" : "text-zinc-400"}`}>
                Note: Resume filename will be included in the email. For best results upload a PDF.
              </p>
            </div>

            {/* Cover Letter */}
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-4 pb-2 border-b ${dark ? "text-zinc-500 border-zinc-800" : "text-zinc-400 border-gray-100"}`}>
                Cover Letter
              </p>
              <label className={labelClass}>Why do you want to join MTBOSS? *</label>
              <textarea
                name="coverLetter"
                required
                rows={5}
                placeholder="Tell us about yourself, your experience, and why you are the right fit for this role..."
                value={form.coverLetter}
                onChange={handleChange}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Submit */}
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t ${dark ? "border-zinc-800" : "border-gray-100"}`}>
              <p className={`text-[10px] ${dark ? "text-zinc-600" : "text-zinc-400"}`}>
                Your data is safe. We never share your information.
              </p>
              <button
                type="submit"
                disabled={loading}
                className="px-12 py-4 bg-[var(--brand-blue)] text-black text-[10px] font-black uppercase tracking-widest hover:bg-[var(--brand-blue-dark)] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-3 rounded-sm"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Submitting Application...
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
    </main>
  );
}
