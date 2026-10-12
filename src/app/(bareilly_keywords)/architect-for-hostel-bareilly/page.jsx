// app/(bareilly_keywords)/architect-for-hostel-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect for Hostel in Bareilly',
  description:
    'Architect for hostel in Bareilly: room layouts, washrooms, mess, security and safe circulation for student hostels and PGs. MTBOSS designs and builds. Call or WhatsApp.',
  keywords:
    'architect for hostel in Bareilly, hostel architect Bareilly, hostel design Bareilly, hostel planning Bareilly, student hostel architect Bareilly, PG design Bareilly, hostel room layout Bareilly, hostel washroom design Bareilly, hostel mess design Bareilly, hostel security design Bareilly, hostel construction Bareilly, MTBOSS Bareilly, architect near me Bareilly',
  alternates: {
    canonical: 'https://www.mtboss.in/architect-for-hostel-in-bareilly',
  },
  openGraph: {
    title: 'Architect for Hostel in Bareilly',
    description:
      'Architect for hostel in Bareilly: room layouts, washrooms, mess, security and safe circulation for student hostels and PGs. MTBOSS designs and builds. Call or WhatsApp.',
    url: 'https://www.mtboss.in/architect-for-hostel-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-architect-for-hostel-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect for Hostel in Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect for Hostel in Bareilly',
    description:
      'Architect for hostel in Bareilly: room layouts, washrooms, mess, security and safe circulation for student hostels and PGs. MTBOSS designs and builds. Call or WhatsApp.',
    images: [
      'https://www.mtboss.in/og-architect-for-hostel-in-bareilly.jpg',
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
    url: 'https://www.mtboss.in/architect-for-hostel-in-bareilly',
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