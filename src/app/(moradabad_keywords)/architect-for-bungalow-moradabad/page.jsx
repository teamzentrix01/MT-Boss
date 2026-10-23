// app/(moradabad_keywords)/architect-for-bungalow-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect for Bungalow in Moradabad | MTBoss',
  description:
    'Planning a bungalow in Moradabad? Learn about single-storey design, layout planning, costs, and how MTBoss supports bungalow design-to-build execution.',
  keywords:
    'architect for bungalow Moradabad, bungalow design Moradabad, bungalow construction company Moradabad, independent bungalow design near me, single storey house architect, bungalow building cost Moradabad, bungalow contractor near me, MTBoss Moradabad, farmhouse bungalow design Moradabad, bungalow plan design near me',
  alternates: {
    canonical: 'https://www.MTBoss.in/architect-for-bungalow-in-moradabad',
  },
  openGraph: {
    title: 'Architect for Bungalow in Moradabad | MTBoss',
    description:
      'Planning a bungalow in Moradabad? Learn about single-storey design, layout planning, costs, and how MTBoss supports bungalow design-to-build execution.',
    url: 'https://www.MTBoss.in/architect-for-bungalow-in-moradabad',
    siteName: 'MTBoss Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBoss.in/og-architect-bungalow-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect for Bungalow in Moradabad - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect for Bungalow in Moradabad | MTBoss',
    description:
      'Planning a bungalow in Moradabad? Learn about single-storey design, layout planning, costs, and how MTBoss supports bungalow design-to-build execution.',
    images: ['https://www.MTBoss.in/og-architect-bungalow-moradabad.jpg'],
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
    url: 'https://www.MTBoss.in/architect-for-bungalow-in-moradabad',
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