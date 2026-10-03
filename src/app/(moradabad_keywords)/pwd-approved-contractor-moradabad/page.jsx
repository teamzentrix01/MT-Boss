// app/(moradabad_keywords)/pwd-approved-contractor-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'PWD Approved Contractor in Moradabad | MT Boss Construction',
  description:
    'Looking for a PWD approved contractor in Moradabad? MT Boss delivers government, commercial and residential construction with quality, transparency and on-time delivery.',
  keywords:
    'PWD approved contractor Moradabad, PWD registered contractor Moradabad, government contractor Moradabad, Public Works Department contractor Moradabad, civil contractor Moradabad, road contractor Moradabad, drainage contractor Moradabad, government building contractor Moradabad, construction company Moradabad, MT Boss Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/pwd-approved-contractor-moradabad',
  },
  openGraph: {
    title: 'PWD Approved Contractor in Moradabad | MT Boss Construction',
    description:
      'Looking for a PWD approved contractor in Moradabad? MT Boss delivers government, commercial and residential construction with quality, transparency and on-time delivery.',
    url: 'https://www.mtboss.in/pwd-approved-contractor-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-pwd-approved-contractor-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'PWD Approved Contractor in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PWD Approved Contractor in Moradabad | MT Boss Construction',
    description:
      'Looking for a PWD approved contractor in Moradabad? MT Boss delivers government, commercial and residential construction with quality, transparency and on-time delivery.',
    images: ['https://www.mtboss.in/og-pwd-approved-contractor-moradabad.jpg'],
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
    url: 'https://www.mtboss.in/pwd-approved-contractor-moradabad',
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