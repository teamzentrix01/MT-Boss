// app/(bareilly_keywords)/apartment-construction-company-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Apartment Construction Company Bareilly | MTBOSS Construction',
  description:
    'MTBOSS is an apartment construction company Bareilly building builder floors, flats and multi-storey residential projects with efficient layouts, safe structures and on-time delivery.',
  keywords:
    'apartment construction company Bareilly, apartment construction Bareilly, builder floors Bareilly, flats construction Bareilly, multi-storey residential construction Bareilly, apartment builder Bareilly, residential project construction Bareilly, apartment renovation Bareilly, group housing Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/apartment-construction-company-bareilly',
  },
  openGraph: {
    title:
      'Apartment Construction Company Bareilly | MTBOSS Construction',
    description:
      'MTBOSS is an apartment construction company Bareilly building builder floors, flats and multi-storey residential projects with efficient layouts, safe structures and on-time delivery.',
    url:
      'https://www.mtboss.in/apartment-construction-company-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-apartment-construction-company-bareilly.jpg',
        width: 1200,
        height: 630,
        alt:
          'Apartment Construction Company in Bareilly - MTBOSS Construction',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Apartment Construction Company Bareilly | MTBOSS Construction',
    description:
      'MTBOSS is an apartment construction company Bareilly building builder floors, flats and multi-storey residential projects with efficient layouts, safe structures and on-time delivery.',
    images: [
      'https://www.mtboss.in/og-apartment-construction-company-bareilly.jpg',
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
      'https://www.mtboss.in/apartment-construction-company-bareilly',
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