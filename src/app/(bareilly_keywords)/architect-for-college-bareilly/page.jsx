// app/(bareilly_keywords)/architect-for-college-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect for College in Bareilly',
  description:
    'Architect for college in Bareilly: campus master planning, lecture halls, labs, library and hostels for new and growing colleges. MTBOSS designs and builds. Call or WhatsApp.',
  keywords:
    'architect for college in Bareilly, college architect Bareilly, college design Bareilly, campus master planning Bareilly, college campus planning Bareilly, college building design Bareilly, lecture hall design Bareilly, college laboratory design Bareilly, college library design Bareilly, hostel design Bareilly, college construction Bareilly, MTBOSS Bareilly, architect near me Bareilly',
  alternates: {
    canonical: 'https://www.mtboss.in/architect-for-college-in-bareilly',
  },
  openGraph: {
    title: 'Architect for College in Bareilly',
    description:
      'Architect for college in Bareilly: campus master planning, lecture halls, labs, library and hostels for new and growing colleges. MTBOSS designs and builds. Call or WhatsApp.',
    url: 'https://www.mtboss.in/architect-for-college-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-architect-for-college-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect for College in Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect for College in Bareilly',
    description:
      'Architect for college in Bareilly: campus master planning, lecture halls, labs, library and hostels for new and growing colleges. MTBOSS designs and builds. Call or WhatsApp.',
    images: [
      'https://www.mtboss.in/og-architect-for-college-in-bareilly.jpg',
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
    name: 'MTBOSS Construction Private Limited',
    url: 'https://www.mtboss.in/architect-for-college-in-bareilly',
    telephone: '+91-9458410866',
    email: 'mtboss2016@gmail.com',
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