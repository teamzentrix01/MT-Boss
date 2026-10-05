// app/(moradabad_keywords)/turnkey-contractor-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Turnkey Contractor in Moradabad | MT Boss Construction',
  description:
    'Looking for a turnkey contractor in Moradabad? MT Boss handles design, construction and finishing in one package with transparent pricing and on-time handover.',
  keywords:
    'turnkey contractor Moradabad, turnkey construction Moradabad, turnkey house construction Moradabad, design and build contractor Moradabad, complete construction package Moradabad, turnkey home construction Moradabad, turnkey commercial construction Moradabad, construction company Moradabad, MT Boss Moradabad, MTBOSS Construction',
  alternates: {
    canonical: 'https://www.mtboss.in/turnkey-contractor-moradabad',
  },
  openGraph: {
    title: 'Turnkey Contractor in Moradabad | MT Boss Construction',
    description:
      'Looking for a turnkey contractor in Moradabad? MT Boss handles design, construction and finishing in one package with transparent pricing and on-time handover.',
    url: 'https://www.mtboss.in/turnkey-contractor-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-turnkey-contractor-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Turnkey Contractor in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Turnkey Contractor in Moradabad | MT Boss Construction',
    description:
      'Looking for a turnkey contractor in Moradabad? MT Boss handles design, construction and finishing in one package with transparent pricing and on-time handover.',
    images: ['https://www.mtboss.in/og-turnkey-contractor-moradabad.jpg'],
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
    url: 'https://www.mtboss.in/turnkey-contractor-moradabad',
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