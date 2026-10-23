// app/(moradabad_keywords)/civil-contractor-company-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Civil Contractor Company in Moradabad | MTBoss Construction',
  description:
    'Looking for a civil contractor company in Moradabad? MTBoss delivers residential, commercial, industrial and infrastructure civil work with quality and transparency.',
  keywords:
    'civil contractor company Moradabad, civil contractor Moradabad, civil work contractor Moradabad, civil construction Moradabad, RCC contractor Moradabad, foundation contractor Moradabad, road contractor Moradabad, drainage contractor Moradabad, building contractor Moradabad, MTBoss Moradabad',
  alternates: {
    canonical: 'https://www.MTBoss.in/civil-contractor-company-moradabad',
  },
  openGraph: {
    title: 'Civil Contractor Company in Moradabad | MTBoss Construction',
    description:
      'Looking for a civil contractor company in Moradabad? MTBoss delivers residential, commercial, industrial and infrastructure civil work with quality and transparency.',
    url: 'https://www.MTBoss.in/civil-contractor-company-moradabad',
    siteName: 'MTBoss Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBoss.in/og-civil-contractor-company-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Civil Contractor Company in Moradabad - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Civil Contractor Company in Moradabad | MTBoss Construction',
    description:
      'Looking for a civil contractor company in Moradabad? MTBoss delivers residential, commercial, industrial and infrastructure civil work with quality and transparency.',
    images: ['https://www.MTBoss.in/og-civil-contractor-company-moradabad.jpg'],
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
    url: 'https://www.MTBoss.in/civil-contractor-company-moradabad',
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