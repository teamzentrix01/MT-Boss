import React from 'react';
import Hero from './components/Hero';
import AboutSection from './components/About';
import Services from './components/Services';
import QuickServices from './components/QuickServices';
import PropertyCTA from './components/PropertyCTA';
import AgentCTA from './components/AgentCTA';
import FranchiseCTA from './components/FranchiseCTA';
import ShopCTA from './components/ShopCTA';
import TestimonialsSection from './components/Testimonal';
import Footer from './components/Footer';
import FeaturedProjects from './components/FeaturedProjects';
import ExperienceSection from './components/ExperienceSection';

const Page = () => {
  return (
    <div className="transition-colors duration-500">
      <Hero />
      <AboutSection />
      <QuickServices />
      <PropertyCTA />
      <AgentCTA />
      <FranchiseCTA />
      <ShopCTA />
      <Services />
      <FeaturedProjects />
      <ExperienceSection />
      <TestimonialsSection />

    </div>
  );
}

export default Page;