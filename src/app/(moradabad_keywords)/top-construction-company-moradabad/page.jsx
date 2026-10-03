// app/(moradabad_keywords)/top-construction-company-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Top Construction Company in Moradabad |',
  description:
    'Build with MT Boss, a top construction company in Moradabad for homes, shops, hotels and factories. Get clear costing, strong structures and timely handover.',
  keywords:
    'top construction company Moradabad, construction company in Moradabad, building contractor Moradabad, residential construction Moradabad, commercial construction Moradabad, industrial construction Moradabad, hotel construction Moradabad, MT Boss Moradabad, MTBOSS Construction Moradabad, construction company near me',
  alternates: {
    canonical: 'https://www.mtboss.in/top-construction-company-moradabad',
  },
  openGraph: {
    title: 'Top Construction Company in Moradabad |',
    description:
      'Build with MT Boss, a top construction company in Moradabad for homes, shops, hotels and factories. Get clear costing, strong structures and timely handover.',
    url: 'https://www.mtboss.in/top-construction-company-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-top-construction-company-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Top Construction Company in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top Construction Company in Moradabad |',
    description:
      'Build with MT Boss, a top construction company in Moradabad for homes, shops, hotels and factories. Get clear costing, strong structures and timely handover.',
    images: ['https://www.mtboss.in/og-top-construction-company-moradabad.jpg'],
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
    url: 'https://www.mtboss.in/top-construction-company-moradabad',
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