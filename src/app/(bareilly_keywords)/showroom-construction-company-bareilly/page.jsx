// app/(bareilly_keywords)/showroom-construction-company-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Showroom Construction Company Bareilly | MTBOSS Construction',
  description:
    'MTBOSS is a showroom construction company Bareilly that builds eye-catching, customer-friendly showrooms with strong facades, smart interiors and on-time handover. Get a quote.',
  keywords:
    'showroom construction company Bareilly, showroom construction Bareilly, showroom builder Bareilly, retail construction Bareilly, showroom interior Bareilly, showroom facade Bareilly, commercial construction Bareilly, showroom renovation Bareilly, shop construction Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/showroom-construction-company-bareilly',
  },
  openGraph: {
    title:
      'Showroom Construction Company Bareilly | MTBOSS Construction',
    description:
      'MTBOSS is a showroom construction company Bareilly that builds eye-catching, customer-friendly showrooms with strong facades, smart interiors and on-time handover. Get a quote.',
    url:
      'https://www.mtboss.in/showroom-construction-company-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-showroom-construction-company-bareilly.jpg',
        width: 1200,
        height: 630,
        alt:
          'Showroom Construction Company in Bareilly - MTBOSS Construction',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Showroom Construction Company Bareilly | MTBOSS Construction',
    description:
      'MTBOSS is a showroom construction company Bareilly that builds eye-catching, customer-friendly showrooms with strong facades, smart interiors and on-time handover. Get a quote.',
    images: [
      'https://www.mtboss.in/og-showroom-construction-company-bareilly.jpg',
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
      'https://www.mtboss.in/showroom-construction-company-bareilly',
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