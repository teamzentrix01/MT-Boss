// app/(bareilly_keywords)/architect-for-farmhouse-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect for Farmhouse  Bareilly',
  description:
    'Planning a farmhouse Bareilly  MTBoss designs farmhouses with land checks, water, solar, septic and build support. Call +91 94584 10866.',
  keywords:
    'architect for farmhouse Bareilly, farmhouse architect Bareilly, farmhouse design Bareilly, farmhouse planning Bareilly, farmhouse construction Bareilly, farmhouse builder Bareilly, farmhouse architect near me Bareilly, farmhouse land planning Bareilly, farmhouse water planning Bareilly, farmhouse solar design Bareilly, farmhouse septic design Bareilly, MTBoss Bareilly, farmhouse Bareilly',
  alternates: {
    canonical: 'https://www.MTBoss.in/architect-for-farmhouse-bareilly',
  },
  openGraph: {
    title: 'Architect for Farmhouse  Bareilly',
    description:
      'Planning a farmhouse Bareilly  MTBoss designs farmhouses with land checks, water, solar, septic and build support. Call +91 94584 10866.',
    url: 'https://www.MTBoss.in/architect-for-farmhouse-bareilly',
    siteName: 'MTBoss Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBoss.in/og-architect-for-farmhouse-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect for Farmhouse Bareilly - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect for Farmhouse  Bareilly',
    description:
      'Planning a farmhouse Bareilly  MTBoss designs farmhouses with land checks, water, solar, septic and build support. Call +91 94584 10866.',
    images: [
      'https://www.MTBoss.in/og-architect-for-farmhouse-bareilly.jpg',
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    name: 'MTBoss Construction Private Limited',
    url: 'https://www.MTBoss.in/architect-for-farmhouse-bareilly',
    telephone: '+91-9458410866',
    email: 'MTBoss2016@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress:
        "Harthala Kanth Road, Behind Kr Collection, near Domino's",
      addressLocality: 'Moradabad',
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN',
    },
    areaServed: {
      '@type': 'City',
      name: 'Bareilly',
    },
    priceRange: '₹₹',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Banner />
      <Content />
      <QuickServices />
      <Services />
      <CalculatorCTA />
    </>
  );
}