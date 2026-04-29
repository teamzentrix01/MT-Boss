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
      <body className={`transition-colors duration-500 ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}>
        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        {children}
        <Footer/>
      </body>
    </html>
  );
}