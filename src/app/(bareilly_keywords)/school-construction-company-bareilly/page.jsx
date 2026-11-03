// app/(bareilly_keywords)/school-construction-company-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'School Construction Company in Bareilly | Safe, Session-Ready Building | MTBOSS',
  description:
    'School construction company in Bareilly: supervised building work for classrooms, washrooms, halls and play areas, planned around your academic session. MTBOSS. Call or WhatsApp.',
  keywords:
    'school construction company in Bareilly, school construction Bareilly, school building contractor Bareilly, classroom construction Bareilly, school renovation Bareilly, institutional building construction Bareilly, college construction Bareilly, school extension Bareilly, school washroom construction Bareilly, playground construction Bareilly, waterproofing Bareilly, building contractor Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/school-construction-company-in-bareilly',
  },
  openGraph: {
    title:
      'School Construction Company in Bareilly | Safe, Session-Ready Building | MTBOSS',
    description:
      'School construction company in Bareilly: supervised building work for classrooms, washrooms, halls and play areas, planned around your academic session. MTBOSS. Call or WhatsApp.',
    url:
      'https://www.mtboss.in/school-construction-company-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-school-construction-company-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt:
          'School Construction Company in Bareilly - Safe, Session-Ready Building - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'School Construction Company in Bareilly | Safe, Session-Ready Building | MTBOSS',
    description:
      'School construction company in Bareilly: supervised building work for classrooms, washrooms, halls and play areas, planned around your academic session. MTBOSS. Call or WhatsApp.',
    images: [
      'https://www.mtboss.in/og-school-construction-company-in-bareilly.jpg',
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
      'https://www.mtboss.in/school-construction-company-in-bareilly',
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