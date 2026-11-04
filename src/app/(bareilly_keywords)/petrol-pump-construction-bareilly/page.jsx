// app/(bareilly_keywords)/petrol-pump-construction-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Petrol Pump Construction in Bareilly | Civil & Building Work | MTBOSS',
  description:
    'Petrol pump construction in Bareilly: civil and building work for forecourt, canopy, office and drainage, built to approved drawings and OMC requirements. MTBOSS. Call or WhatsApp.',
  keywords:
    'petrol pump construction in Bareilly, fuel station construction Bareilly, petrol pump contractor Bareilly, canopy construction Bareilly, forecourt construction Bareilly, petrol pump building work Bareilly, oil company construction Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/petrol-pump-construction-in-bareilly',
  },
  openGraph: {
    title:
      'Petrol Pump Construction in Bareilly | Civil & Building Work | MTBOSS',
    description:
      'Petrol pump construction in Bareilly: civil and building work for forecourt, canopy, office and drainage, built to approved drawings and OMC requirements. MTBOSS. Call or WhatsApp.',
    url:
      'https://www.mtboss.in/petrol-pump-construction-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-petrol-pump-construction-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Petrol Pump Construction in Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Petrol Pump Construction in Bareilly | Civil & Building Work | MTBOSS',
    description:
      'Petrol pump construction in Bareilly: civil and building work for forecourt, canopy, office and drainage, built to approved drawings and OMC requirements. MTBOSS. Call or WhatsApp.',
    images: [
      'https://www.mtboss.in/og-petrol-pump-construction-in-bareilly.jpg',
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
      'https://www.mtboss.in/petrol-pump-construction-bareilly',
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