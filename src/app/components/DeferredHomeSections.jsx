'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const CalculatorCTA = dynamic(() => import('./CalculatorCTA'), { ssr: false });
const ShopCTA = dynamic(() => import('./ShopCTA'), { ssr: false });
const PropertyCTA = dynamic(() => import('./PropertyCTA'), { ssr: false });
const FranchiseCTA = dynamic(() => import('./FranchiseCTA'), { ssr: false });
const AgentCTA = dynamic(() => import('./AgentCTA'), { ssr: false });
const FeaturedProjects = dynamic(() => import('./FeaturedProjects'), { ssr: false });
const ExperienceSection = dynamic(() => import('./ExperienceSection'), { ssr: false });

const SECTIONS = [
  { key: 'calculator', Component: CalculatorCTA, minHeight: 430 },
  { key: 'shop', Component: ShopCTA, minHeight: 560 },
  { key: 'property', Component: PropertyCTA, minHeight: 620 },
  { key: 'franchise', Component: FranchiseCTA, minHeight: 420 },
  { key: 'agent', Component: AgentCTA, minHeight: 540 },
  { key: 'projects', Component: FeaturedProjects, minHeight: 520 },
  { key: 'experience', Component: ExperienceSection, minHeight: 620 },
];

function DeferredSection({ Component, minHeight }) {
  const sectionRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element || !('IntersectionObserver' in window)) {
      const timerId = window.setTimeout(() => setReady(true), 0);
      return () => window.clearTimeout(timerId);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setReady(true);
        observer.disconnect();
      },
      { rootMargin: '600px 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="home-deferred-section"
      style={ready ? undefined : { minHeight }}
    >
      {ready ? <Component /> : null}
    </div>
  );
}

export default function DeferredHomeSections() {
  return SECTIONS.map(({ key, Component, minHeight }) => (
    <DeferredSection key={key} Component={Component} minHeight={minHeight} />
  ));
}
