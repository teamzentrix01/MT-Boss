// app/(moradabad_keywords)/government-approved-contractor-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Government Approved Contractor in Moradabad',
  description:
    'Hire MT Boss, a government approved contractor in Moradabad, for government, commercial and residential construction. Transparent pricing, quality work, on-time delivery.',
  keywords:
    'government approved contractor Moradabad, government contractor Moradabad, registered contractor Moradabad, PWD contractor Moradabad, civil contractor Moradabad, government building contractor Moradabad, road contractor Moradabad, construction company Moradabad, building contractor Moradabad, MT Boss Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/government-approved-contractor-moradabad',
  },
  openGraph: {
    title: 'Government Approved Contractor in Moradabad',
    description:
      'Hire MT Boss, a government approved contractor in Moradabad, for government, commercial and residential construction. Transparent pricing, quality work, on-time delivery.',
    url: 'https://www.mtboss.in/government-approved-contractor-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-government-approved-contractor-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Government Approved Contractor in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Government Approved Contractor in Moradabad',
    description:
      'Hire MT Boss, a government approved contractor in Moradabad, for government, commercial and residential construction. Transparent pricing, quality work, on-time delivery.',
    images: [
      'https://www.mtboss.in/og-government-approved-contractor-moradabad.jpg',
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
    url: 'https://www.mtboss.in/government-approved-contractor-moradabad',
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