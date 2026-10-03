// app/(moradabad_keywords)/construction-service-provider-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Construction Service Provider in Moradabad',
  description:
    'MT Boss is a construction service provider in Moradabad offering building, architecture, interiors, painting, plumbing and electrical services with quick quotes and clear pricing.',
  keywords:
    'construction service provider Moradabad, construction services Moradabad, building services Moradabad, architecture services Moradabad, interior design Moradabad, painting services Moradabad, plumbing services Moradabad, electrical services Moradabad, home services Moradabad, MT Boss Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/construction-service-provider-moradabad',
  },
  openGraph: {
    title: 'Construction Service Provider in Moradabad',
    description:
      'MT Boss is a construction service provider in Moradabad offering building, architecture, interiors, painting, plumbing and electrical services with quick quotes and clear pricing.',
    url: 'https://www.mtboss.in/construction-service-provider-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-construction-service-provider-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Construction Service Provider in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Construction Service Provider in Moradabad',
    description:
      'MT Boss is a construction service provider in Moradabad offering building, architecture, interiors, painting, plumbing and electrical services with quick quotes and clear pricing.',
    images: [
      'https://www.mtboss.in/og-construction-service-provider-moradabad.jpg',
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
    url: 'https://www.mtboss.in/construction-service-provider-moradabad',
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