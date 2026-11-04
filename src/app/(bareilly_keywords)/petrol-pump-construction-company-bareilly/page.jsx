// app/(bareilly_keywords)/petrol-pump-construction-company-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Petrol Pump Construction Company in Bareilly | Choosing & Scope | MTBOSS',
  description:
    'Choosing a petrol pump construction company in Bareilly: scope split, due diligence and contract checklist. MTBOSS handles civil and building portions to approved drawings.',
  keywords:
    'petrol pump construction company in Bareilly, petrol pump construction Bareilly, petrol pump contractor Bareilly, fuel station construction Bareilly, petrol pump civil work Bareilly, petrol pump building construction Bareilly, petrol pump renovation Bareilly, petrol pump construction company Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/petrol-pump-construction-company-bareilly',
  },
  openGraph: {
    title:
      'Petrol Pump Construction Company in Bareilly | Choosing & Scope | MTBOSS',
    description:
      'Choosing a petrol pump construction company in Bareilly: scope split, due diligence and contract checklist. MTBOSS handles civil and building portions to approved drawings.',
    url:
      'https://www.mtboss.in/petrol-pump-construction-company-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-petrol-pump-construction-company-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt:
          'Petrol Pump Construction Company in Bareilly - Choosing and Scope - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Petrol Pump Construction Company in Bareilly | Choosing & Scope | MTBOSS',
    description:
      'Choosing a petrol pump construction company in Bareilly: scope split, due diligence and contract checklist. MTBOSS handles civil and building portions to approved drawings.',
    images: [
      'https://www.mtboss.in/og-petrol-pump-construction-company-in-bareilly.jpg',
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
      'https://www.mtboss.in/petrol-pump-construction-company-bareilly',
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