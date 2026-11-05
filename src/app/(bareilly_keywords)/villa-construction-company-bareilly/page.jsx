// app/(bareilly_keywords)/villa-construction-company-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Villa Construction Company Bareilly | MTBOSS Construction',
  description:
    'MTBOSS is a villa construction company Bareilly that designs and builds luxury villas and bungalows with premium finishes, smart planning and on-time handover. Request a quote.',
  keywords:
    'villa construction company Bareilly, villa construction Bareilly, luxury villa construction Bareilly, bungalow construction Bareilly, villa builder Bareilly, residential construction Bareilly, villa design Bareilly, villa renovation Bareilly, premium home construction Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/villa-construction-company-bareilly',
  },
  openGraph: {
    title:
      'Villa Construction Company Bareilly | MTBOSS Construction',
    description:
      'MTBOSS is a villa construction company Bareilly that designs and builds luxury villas and bungalows with premium finishes, smart planning and on-time handover. Request a quote.',
    url:
      'https://www.mtboss.in/villa-construction-company-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-villa-construction-company-bareilly.jpg',
        width: 1200,
        height: 630,
        alt:
          'Villa Construction Company in Bareilly - MTBOSS Construction',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Villa Construction Company Bareilly | MTBOSS Construction',
    description:
      'MTBOSS is a villa construction company Bareilly that designs and builds luxury villas and bungalows with premium finishes, smart planning and on-time handover. Request a quote.',
    images: [
      'https://www.mtboss.in/og-villa-construction-company-bareilly.jpg',
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
      'https://www.mtboss.in/villa-construction-company-bareilly',
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
    priceRange: '₹₹₹',
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