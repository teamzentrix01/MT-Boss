// app/(bareilly_keywords)/architect-for-school-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect for School in Bareilly',
  description:
    'Architect for school in Bareilly: planning, design and construction guidance for new schools, extensions and renovations. MTBOSS supports safe, practical campuses. Call or WhatsApp.',
  keywords:
    'architect for school in Bareilly, school architect Bareilly, school design Bareilly, school planning Bareilly, school building design Bareilly, school construction Bareilly, school renovation architect Bareilly, school extension design Bareilly, campus design Bareilly, coaching institute architect Bareilly, MTBOSS Bareilly, architect near me Bareilly',
  alternates: {
    canonical: 'https://www.mtboss.in/architect-for-school-bareilly',
  },
  openGraph: {
    title: 'Architect for School in Bareilly',
    description:
      'Architect for school in Bareilly: planning, design and construction guidance for new schools, extensions and renovations. MTBOSS supports safe, practical campuses. Call or WhatsApp.',
    url: 'https://www.mtboss.in/architect-for-school-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-architect-for-school-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect for School in Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect for School in Bareilly',
    description:
      'Architect for school in Bareilly: planning, design and construction guidance for new schools, extensions and renovations. MTBOSS supports safe, practical campuses. Call or WhatsApp.',
    images: ['https://www.mtboss.in/og-architect-for-school-bareilly.jpg'],
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
    url: 'https://www.mtboss.in/architect-for-school-bareilly',
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