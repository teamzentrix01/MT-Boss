"use client";

import React, { useState } from "react";
import { ChevronDown, User, Mail, Phone, MessageSquare } from "lucide-react";

const LandingEnquiry = ({ landingPage = "general" }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", service: "", message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!formData.phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://formsubmit.co/ajax/seo.mtboss@gmail.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            service: formData.service,
            message: formData.message,
            landingPage: landingPage,
            _subject: `New MTBOSS Inquiry from ${formData.name} (${landingPage})`,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setShowThankYou(true);
        resetForm();
      } else {
        throw new Error(result.message || "Submission failed.");
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setError("There was an error submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-full max-w-sm mx-auto relative">
      <div className="text-center mb-5">
        <h3 className="text-xl font-bold text-gray-900">
          Get a Free Consultation
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Fill the form and our team will reach out within 24 hours
        </p>
      </div>

      {error && (
        <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate data-privacy-consent="off">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 text-gray-900 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Phone <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="10-digit number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 text-gray-900 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Optional"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 text-gray-900 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Service Needed</label>
            <div className="relative">
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full px-3 py-2.5 pr-8 text-gray-900 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent bg-white appearance-none transition-all"
              >
                <option value="" disabled>Select a service</option>
                <option value="Construction">Construction</option>
                <option value="Home Services">Home Services</option>
                <option value="Buy/Sell Property">Buy/Sell Property</option>
                <option value="Rent Property">Rent Property</option>
                <option value="Building Materials">Building Materials</option>
                <option value="Franchise">Franchise</option>
                <option value="Others">Others</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Message</label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <textarea
                name="message"
                placeholder="Tell us about your project..."
                rows={3}
                value={formData.message}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2.5 text-gray-900 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent resize-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[var(--brand-blue)] text-black font-bold rounded-lg text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit Enquiry"}
          </button>

          <p className="text-[10px] text-gray-400 text-center">
            We&apos;ll get back to you within 24 hours
          </p>
        </div>
      </form>

      {/* Thank You Popup */}
      {showThankYou && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-7 text-center relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowThankYou(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Thank You!
            </h3>
            <p className="text-sm text-gray-600 mb-5">
              Your enquiry has been submitted successfully. Our team will get
              back to you within 24 hours.
            </p>
            <button
              onClick={() => setShowThankYou(false)}
              className="w-full py-2.5 bg-[var(--brand-blue)] text-black font-semibold rounded-lg text-sm hover:opacity-90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingEnquiry;
