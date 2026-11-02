// app/(bareilly_keywords)/building-construction-company-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Building Construction Company Bareilly | Planning to Handover | MTBOSS',
  description:
    'MTBOSS is a building construction company serving Bareilly for houses, shops and offices, from feasibility and design coordination to supervised construction and handover.',
  keywords:
    'building construction company Bareilly, construction company in Bareilly, building construction Bareilly, house construction company Bareilly, commercial construction Bareilly, turnkey construction Bareilly, building renovation Bareilly, waterproofing Bareilly, construction and handover Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical: 'https://www.mtboss.in/building-construction-company-bareilly',
  },
  openGraph: {
    title:
      'Building Construction Company Bareilly | Planning to Handover | MTBOSS',
    description:
      'MTBOSS is a building construction company serving Bareilly for houses, shops and offices, from feasibility and design coordination to supervised construction and handover.',
    url: 'https://www.mtboss.in/building-construction-company-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-building-construction-company-bareilly.jpg',
        width: 1200,
        height: 630,
        alt:
          'Building Construction Company in Bareilly - Planning to Handover - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Building Construction Company Bareilly | Planning to Handover | MTBOSS',
    description:
      'MTBOSS is a building construction company serving Bareilly for houses, shops and offices, from feasibility and design coordination to supervised construction and handover.',
    images: [
      'https://www.mtboss.in/og-building-construction-company-bareilly.jpg',
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
    url: 'https://www.mtboss.in/building-construction-company-bareilly',
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