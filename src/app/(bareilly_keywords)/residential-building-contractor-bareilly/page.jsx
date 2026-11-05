// app/(bareilly_keywords)/residential-building-contractor-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Residential Building Contractor Bareilly | Home Builders – MTBOSS',
  description:
    'Planning a house Bareilly? MTBOSS is a residential building contractor offering design, construction and finishing with clear contracts, stage-wise payments and quality checks.',
  keywords:
    'residential building contractor Bareilly, home builders Bareilly, house construction contractor Bareilly, residential construction Bareilly, home construction company Bareilly, house builder Bareilly, home renovation Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/residential-building-contractor-bareilly',
  },
  openGraph: {
    title:
      'Residential Building Contractor Bareilly | Home Builders – MTBOSS',
    description:
      'Planning a house Bareilly? MTBOSS is a residential building contractor offering design, construction and finishing with clear contracts, stage-wise payments and quality checks.',
    url:
      'https://www.mtboss.in/residential-building-contractor-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-residential-building-contractor-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Residential Building Contractor Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Residential Building Contractor Bareilly | Home Builders – MTBOSS',
    description:
      'Planning a house Bareilly? MTBOSS is a residential building contractor offering design, construction and finishing with clear contracts, stage-wise payments and quality checks.',
    images: [
      'https://www.mtboss.in/og-residential-building-contractor-bareilly.jpg',
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
      'https://www.mtboss.in/residential-building-contractor-bareilly',
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