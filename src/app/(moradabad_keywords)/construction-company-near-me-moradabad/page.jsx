// app/(moradabad_keywords)/construction-company-near-me-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Construction Company Near Me in Moradabad',
  description:
    'Searching for a construction company near you in Moradabad? MT Boss is a local builder for homes, shops, hotels and factories with clear pricing and quick site support.',
  keywords:
    'construction company near me Moradabad, construction company in Moradabad, local builder Moradabad, building contractor near me, home construction Moradabad, commercial construction Moradabad, factory construction Moradabad, hotel construction Moradabad, renovation contractor Moradabad, MT Boss Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/construction-company-near-me-moradabad',
  },
  openGraph: {
    title: 'Construction Company Near Me in Moradabad',
    description:
      'Searching for a construction company near you in Moradabad? MT Boss is a local builder for homes, shops, hotels and factories with clear pricing and quick site support.',
    url: 'https://www.mtboss.in/construction-company-near-me-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-construction-company-near-me-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Construction Company Near Me in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Construction Company Near Me in Moradabad',
    description:
      'Searching for a construction company near you in Moradabad? MT Boss is a local builder for homes, shops, hotels and factories with clear pricing and quick site support.',
    images: [
      'https://www.mtboss.in/og-construction-company-near-me-moradabad.jpg',
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
    url: 'https://www.mtboss.in/construction-company-near-me-moradabad',
    telephone: '+91-9458410866',
    email: 'mtboss2016@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: "Harthala Kanth Road, Behind Kr Collection, near Domino's",
      addressLocality: 'Moradabad',
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN',
    },
    areaServed: {
      '@type': 'City',
      name: 'Moradabad',
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