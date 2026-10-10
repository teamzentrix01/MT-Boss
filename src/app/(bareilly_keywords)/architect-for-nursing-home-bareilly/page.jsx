// app/(bareilly_keywords)/architect-for-nursing-home-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect for Nursing Home in Bareilly | Planning & Design | MTBOSS',
  description:
    'Architect for nursing home in Bareilly: ward, OT, labour room and nursing station planning for small inpatient facilities. MTBOSS designs and builds. Call or WhatsApp.',
  keywords:
    'architect for nursing home in Bareilly, nursing home architect Bareilly, nursing home design Bareilly, nursing home planning Bareilly, inpatient facility architect Bareilly, hospital architect Bareilly, ward design Bareilly, operation theatre architect Bareilly, labour room design Bareilly, nursing home construction Bareilly, MTBOSS Bareilly, architect near me Bareilly',
  alternates: {
    canonical: 'https://www.mtboss.in/architect-for-nursing-home-bareilly',
  },
  openGraph: {
    title: 'Architect for Nursing Home in Bareilly | Planning & Design | MTBOSS',
    description:
      'Architect for nursing home in Bareilly: ward, OT, labour room and nursing station planning for small inpatient facilities. MTBOSS designs and builds. Call or WhatsApp.',
    url: 'https://www.mtboss.in/architect-for-nursing-home-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-architect-for-nursing-home-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect for Nursing Home in Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect for Nursing Home in Bareilly | Planning & Design | MTBOSS',
    description:
      'Architect for nursing home in Bareilly: ward, OT, labour room and nursing station planning for small inpatient facilities. MTBOSS designs and builds. Call or WhatsApp.',
    images: [
      'https://www.mtboss.in/og-architect-for-nursing-home-bareilly.jpg',
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
    url: 'https://www.mtboss.in/architect-for-nursing-home-bareilly',
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