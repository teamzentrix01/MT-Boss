"use client";
import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import "./globals.css";
import Footer from "./components/Footer";
import { COMPANY_CONTACT } from "./lib/company";
import PrivacyConsentGuard from "./components/PrivacyConsentGuard";
import FreeWhatsAppNotifier from "./components/FreeWhatsAppNotifier";
import ChatbotWidget from "./components/ChatbotWidget";
import LeadConsultationModal from "./components/LeadConsultationModal";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isShopPage = pathname?.toLowerCase() === "/shopnow";
  const [isDarkMode, setIsDarkMode] = useState(false);


  // 1. Page load hote hi localStorage se theme check karein
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const dark = localStorage.getItem("theme") === "dark";
      setIsDarkMode(dark);
      document.documentElement.classList.toggle("dark-mode", dark);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const phoneLike = (el) => {
      if (el.type === 'tel') return true;
      if (!['text', 'number', ''].includes(el.type)) return false;
      const nameId = `${el.name || ''} ${el.id || ''}`.toLowerCase();
      if (/(?:cta|href|url|button|btn|text|subject|message|dest|title|subtitle|desc|image|order|slug|query)/i.test(nameId)) return false;
      if (/(?:phone|mobile|whatsapp|contact_?(?:no|num|number)|calling)(?![a-z])/i.test(nameId)) return true;
      const placeholder = (el.placeholder || '').toLowerCase();
      if (/(?:cta|href|url|button|btn|http|\/|services|explore|page)/i.test(placeholder)) return false;
      return /(?:phone|mobile|whatsapp|\bcontact\s*(?:no|num|number)\b|10[- ]?digit)/i.test(placeholder);
    };
    const nameLike = (el) => {
      if (!['text', ''].includes(el.type)) return false;
      const nameId = `${el.name || ''} ${el.id || ''}`.toLowerCase();
      if (/(?:service|shop|category|file|banner|company|page|brand|product|user_name|username|role|type|cta|dest)/i.test(nameId)) return false;
      return /(^|[^a-z])(full[_-]?name|client[_-]?name|customer[_-]?name|first[_-]?name|last[_-]?name)([^a-z]|$)/i.test(nameId) || nameId.trim() === 'name';
    };
    const validateField = (el) => {
      if (!(el instanceof HTMLInputElement)) return true;
      if (el.form?.noValidate || el.hasAttribute('data-no-validate') || el.closest('[data-no-auto-validate]')) {
        el.setCustomValidity('');
        return true;
      }
      if (['hidden', 'submit', 'button', 'checkbox', 'radio', 'file', 'image', 'reset', 'url'].includes(el.type)) {
        el.setCustomValidity('');
        return true;
      }
      const value = el.value.trim();
      if (!value) {
        el.setCustomValidity('');
        return true;
      }
      if (phoneLike(el)) {
        const rawDigits = value.replace(/\D/g, '');
        const digits = rawDigits.length > 10 ? rawDigits.slice(-10) : rawDigits;
        el.setCustomValidity(/^[6-9]\d{9}$/.test(digits) ? '' : 'Enter a valid 10-digit mobile number starting with 6, 7, 8 or 9.');
        return !el.validationMessage;
      }
      if (el.type === 'email') {
        el.setCustomValidity(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Enter a valid email address.');
        return !el.validationMessage;
      }
      if (nameLike(el)) {
        el.setCustomValidity(/\d/.test(value) ? 'Name cannot contain digits.' : '');
        return !el.validationMessage;
      }
      el.setCustomValidity('');
      return true;
    };
    const onInput = (event) => validateField(event.target);
    const onSubmit = (event) => {
      if (event.target.noValidate || event.target.hasAttribute('data-no-auto-validate')) return;
      const fields = Array.from(event.target.querySelectorAll('input'));
      const ok = fields.every(validateField);
      if (!ok) {
        event.preventDefault();
        event.stopPropagation();
        fields.find((field) => field.validationMessage)?.reportValidity();
      }
    };
    document.addEventListener('input', onInput, true);
    document.addEventListener('submit', onSubmit, true);
    return () => {
      document.removeEventListener('input', onInput, true);
      document.removeEventListener('submit', onSubmit, true);
    };
  }, []);

  // 2. Theme toggle karne ka function
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <html lang="en" className={`${isDarkMode ? "dark-mode" : ""} ${isShopPage ? "shop-html" : ""}`}>
      <head>
        <meta name="google-site-verification" content="_HIsDPgunnMsWo7iWtmz2fX3YW9aG406vj5zL02lWXY" />
      </head>
      <body className={`transition-colors duration-500 ${isShopPage ? "shop-route overflow-x-clip" : "overflow-x-hidden"} ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}>
        <PrivacyConsentGuard />
        <FreeWhatsAppNotifier />
        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        {children}
        <Footer />

        {/* Floating Chatbot Assistant Widget */}
        <ChatbotWidget isDarkMode={isDarkMode} />

        {/* On-Arrival Project Consultation Modal */}
        {!isShopPage && <LeadConsultationModal isDarkMode={isDarkMode} />}

        {/* Floating WhatsApp support button */}
        {isShopPage && COMPANY_CONTACT.telHref && <a
          href={COMPANY_CONTACT.telHref}
          aria-label={`Call MT Boss at ${COMPANY_CONTACT.phone}`}
          title={`Call ${COMPANY_CONTACT.phone}`}
          className="fixed bottom-24 right-6 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-blue)] text-white shadow-lg transition-transform hover:scale-110"
        >
          <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.09 5.18 2 2 0 0 1 5.08 3h3a2 2 0 0 1 2 1.72c.12.96.35 1.9.68 2.79a2 2 0 0 1-.45 2.11L9.04 10.9a16 16 0 0 0 4.06 4.06l1.28-1.27a2 2 0 0 1 2.11-.45c.89.33 1.83.56 2.79.68A2 2 0 0 1 22 16.92z" />
          </svg>
        </a>}
        <a
          href={COMPANY_CONTACT.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            backgroundColor: '#25D366',
            color: '#fff',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            transition: 'transform 0.3s ease, background-color 0.3s ease',
            animation: 'pulse-wa 2s infinite'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          title="Chat with us on WhatsApp"
        >
          <svg
            width="32"
            height="32"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.724-1.466L0 24zm6.59-4.846c1.6.95 3.498 1.45 5.419 1.451 5.428 0 9.842-4.417 9.845-9.851.002-2.63-1.02-5.101-2.877-6.958C17.18 1.988 14.71 1.96 12.008 1.96c-5.435 0-9.853 4.418-9.856 9.853-.001 1.925.503 3.807 1.458 5.424l-.995 3.635 3.722-.975zm11.367-7.051c-.302-.15-1.78-.88-2.057-.982-.277-.101-.479-.15-.679.15-.2.301-.773.98-.949 1.18-.175.201-.35.226-.652.075-.302-.15-1.276-.47-2.43-1.499-.899-.8-1.505-1.79-1.68-2.091-.176-.302-.019-.465.132-.614.136-.135.302-.35.454-.526.151-.176.201-.302.302-.503.101-.201.05-.376-.025-.526-.075-.15-.679-1.636-.93-2.24-.244-.588-.493-.508-.679-.518-.175-.01-.376-.01-.577-.01-.201 0-.528.075-.804.376-.277.301-1.057 1.03-1.057 2.512 0 1.48 1.078 2.912 1.229 3.112.15.2 2.122 3.241 5.14 4.545.718.309 1.279.495 1.716.634.721.23 1.378.197 1.9.119.58-.087 1.78-.727 2.032-1.43.252-.703.252-1.305.176-1.43-.075-.125-.276-.201-.578-.351z" />
          </svg>
        </a>

        {/* CSS for WhatsApp Pulse animation */}
        <style>{`
          @keyframes pulse-wa {
            0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.5); }
            70% { box-shadow: 0 0 0 15px rgba(37, 211, 102, 0); }
            100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
          }
        `}</style>
      </body>
    </html>
  );
}
