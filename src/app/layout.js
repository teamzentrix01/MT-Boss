"use client";
import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import "./globals.css";
import Footer from "./components/Footer";

export default function RootLayout({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 1. Page load hote hi localStorage se theme check karein
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark-mode");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark-mode");
    }
  }, []);

  useEffect(() => {
    const phoneLike = (el) => {
      const key = `${el.name || ''} ${el.id || ''} ${el.placeholder || ''}`.toLowerCase();
      return el.type === 'tel' || /phone|mobile|contact|whatsapp/.test(key);
    };
    const nameLike = (el) => {
      const key = `${el.name || ''} ${el.id || ''} ${el.placeholder || ''}`.toLowerCase();
      return /(^|[^a-z])(name|full name|client_name|user_name|shop_name)([^a-z]|$)/.test(key);
    };
    const validateField = (el) => {
      if (!(el instanceof HTMLInputElement)) return true;
      const value = el.value.trim();
      if (!value) {
        el.setCustomValidity('');
        return true;
      }
      if (phoneLike(el)) {
        const digits = value.replace(/\D/g, '').slice(-10);
        if (digits !== value.replace(/\D/g, '') && value.replace(/\D/g, '').length <= 10) {
          el.value = digits;
        }
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
      return true;
    };
    const onInput = (event) => validateField(event.target);
    const onSubmit = (event) => {
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
    <html lang="en" className={isDarkMode ? "dark-mode" : ""}>
      <body className={`transition-colors duration-500 overflow-x-hidden ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}>
        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        {children}
        <Footer/>
      </body>
    </html>
  );
}
