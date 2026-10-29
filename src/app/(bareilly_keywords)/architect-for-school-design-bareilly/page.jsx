// app/(bareilly_keywords)/architect-for-school-design-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Architect for School Design in Bareilly | Classrooms & Campus | MTBOSS',
  description:
    'Architect for school design in Bareilly: bright classrooms, safe corridors, labs, play areas and durable finishes planned for learning. MTBOSS designs and builds. Call or WhatsApp.',
  keywords:
    'architect for school design in Bareilly, school architect Bareilly, school design architect Bareilly, school building design Bareilly, school campus design Bareilly, school plan architect Bareilly, classroom design Bareilly, school building plan Bareilly, school construction architect Bareilly, school design and build Bareilly, MTBOSS Bareilly, architect for school design in Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/architect-for-school-design-in-bareilly',
  },
  openGraph: {
    title:
      'Architect for School Design in Bareilly | Classrooms & Campus | MTBOSS',
    description:
      'Architect for school design in Bareilly: bright classrooms, safe corridors, labs, play areas and durable finishes planned for learning. MTBOSS designs and builds. Call or WhatsApp.',
    url:
      'https://www.mtboss.in/architect-for-school-design-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-architect-for-school-design-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect for School Design in Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Architect for School Design in Bareilly | Classrooms & Campus | MTBOSS',
    description:
      'Architect for school design in Bareilly: bright classrooms, safe corridors, labs, play areas and durable finishes planned for learning. MTBOSS designs and builds. Call or WhatsApp.',
    images: [
      'https://www.mtboss.in/og-architect-for-school-design-in-bareilly.jpg',
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
    url:
      'https://www.mtboss.in/architect-for-school-design-in-bareilly',
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