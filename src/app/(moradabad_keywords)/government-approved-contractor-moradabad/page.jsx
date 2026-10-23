// app/(moradabad_keywords)/government-approved-contractor-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Government Approved Contractor in Moradabad',
  description:
    'Hire MTBoss, a government approved contractor in Moradabad, for government, commercial and residential construction. Transparent pricing, quality work, on-time delivery.',
  keywords:
    'government approved contractor Moradabad, government contractor Moradabad, registered contractor Moradabad, PWD contractor Moradabad, civil contractor Moradabad, government building contractor Moradabad, road contractor Moradabad, construction company Moradabad, building contractor Moradabad, MTBoss Moradabad',
  alternates: {
    canonical: 'https://www.MTBoss.in/government-approved-contractor-moradabad',
  },
  openGraph: {
    title: 'Government Approved Contractor in Moradabad',
    description:
      'Hire MTBoss, a government approved contractor in Moradabad, for government, commercial and residential construction. Transparent pricing, quality work, on-time delivery.',
    url: 'https://www.MTBoss.in/government-approved-contractor-moradabad',
    siteName: 'MTBoss Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBoss.in/og-government-approved-contractor-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Government Approved Contractor in Moradabad - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Government Approved Contractor in Moradabad',
    description:
      'Hire MTBoss, a government approved contractor in Moradabad, for government, commercial and residential construction. Transparent pricing, quality work, on-time delivery.',
    images: [
      'https://www.MTBoss.in/og-government-approved-contractor-moradabad.jpg',
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
    name: 'MTBoss Construction Private Limited',
    url: 'https://www.MTBoss.in/government-approved-contractor-moradabad',
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