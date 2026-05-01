import React from 'react';
import Hero from './components/Hero';
import AboutSection from './components/About';
import Services from './components/Services';
import QuickServices from './components/QuickServices';
import TestimonialsSection from './components/Testimonal';
import Footer from './components/Footer';
import FeaturedProjects from './components/FeaturedProjects';
import ExperienceSection from './components/ExperienceSection';

const Page = () => {
  // Ab props pass karne ki zaroorat nahi hai.
  // Har component apne andar se global theme detect kar lega.
  return (
    <div className="transition-colors duration-500">
      <Hero />
      <AboutSection />
      <Services />
      <QuickServices />
      <FeaturedProjects />
      <ExperienceSection />
      <TestimonialsSection />
      
    </div>
  );
}

export default Page;