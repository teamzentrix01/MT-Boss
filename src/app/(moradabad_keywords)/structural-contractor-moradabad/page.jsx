// app/(moradabad_keywords)/structural-contractor-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Structural Contractor in Moradabad',
  description:
    'MTBoss is a structural contractor in Moradabad for building frames, additional floors, structural repair and industrial structures, with engineer supervision and clear pricing.',
  keywords:
    'structural contractor Moradabad, structural engineer contractor Moradabad, building structure contractor Moradabad, additional floor contractor Moradabad, structural repair Moradabad, structural strengthening Moradabad, industrial structure contractor Moradabad, RCC structural work Moradabad, civil contractor Moradabad, MTBoss Moradabad',
  alternates: {
    canonical: 'https://www.MTBoss.in/structural-contractor-moradabad',
  },
  openGraph: {
    title: 'Structural Contractor in Moradabad',
    description:
      'MTBoss is a structural contractor in Moradabad for building frames, additional floors, structural repair and industrial structures, with engineer supervision and clear pricing.',
    url: 'https://www.MTBoss.in/structural-contractor-moradabad',
    siteName: 'MTBoss Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBoss.in/og-structural-contractor-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Structural Contractor in Moradabad - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Structural Contractor in Moradabad',
    description:
      'MTBoss is a structural contractor in Moradabad for building frames, additional floors, structural repair and industrial structures, with engineer supervision and clear pricing.',
    images: ['https://www.MTBoss.in/og-structural-contractor-moradabad.jpg'],
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
    name: 'MTBoss Construction Private Limited',
    url: 'https://www.MTBoss.in/structural-contractor-moradabad',
    telephone: '+91-9458410866',
    email: 'MTBoss2016@gmail.com',
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