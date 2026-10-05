// app/(moradabad_keywords)/contractor-for-building-construction-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Contractor for Building Construction in Moradabad | MT Boss',
  description:
    'Hire MT Boss, a trusted contractor for building construction in Moradabad. Residential, commercial and industrial buildings with quality materials and on-time delivery.',
  keywords:
    'building construction contractor Moradabad, building contractor Moradabad, construction contractor Moradabad, residential building contractor Moradabad, commercial building contractor Moradabad, industrial building contractor Moradabad, house construction contractor Moradabad, warehouse construction Moradabad, hotel construction Moradabad, MT Boss Moradabad',
  alternates: {
    canonical:
      'https://www.mtboss.in/contractor-for-building-construction-moradabad',
  },
  openGraph: {
    title: 'Contractor for Building Construction in Moradabad | MT Boss',
    description:
      'Hire MT Boss, a trusted contractor for building construction in Moradabad. Residential, commercial and industrial buildings with quality materials and on-time delivery.',
    url: 'https://www.mtboss.in/contractor-for-building-construction-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-contractor-for-building-construction-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Contractor for Building Construction in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contractor for Building Construction in Moradabad | MT Boss',
    description:
      'Hire MT Boss, a trusted contractor for building construction in Moradabad. Residential, commercial and industrial buildings with quality materials and on-time delivery.',
    images: [
      'https://www.mtboss.in/og-contractor-for-building-construction-moradabad.jpg',
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
    url: 'https://www.mtboss.in/contractor-for-building-construction-moradabad',
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