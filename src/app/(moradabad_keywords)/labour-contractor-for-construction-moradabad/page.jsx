// app/(moradabad_keywords)/labour-contractor-for-construction-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Labour Contractor for Construction in Moradabad',
  description:
    'MT Boss is a labour contractor for construction in Moradabad, providing skilled masons, bar benders, carpenters, painters and plumbers with engineer supervision and clear rates.',
  keywords:
    'labour contractor Moradabad, construction labour contractor Moradabad, skilled labour contractor Moradabad, mason contractor Moradabad, bar bender contractor Moradabad, carpenter contractor Moradabad, painter contractor Moradabad, plumber contractor Moradabad, construction manpower Moradabad, MT Boss Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/labour-contractor-for-construction-moradabad',
  },
  openGraph: {
    title: 'Labour Contractor for Construction in Moradabad',
    description:
      'MT Boss is a labour contractor for construction in Moradabad, providing skilled masons, bar benders, carpenters, painters and plumbers with engineer supervision and clear rates.',
    url: 'https://www.mtboss.in/labour-contractor-for-construction-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-labour-contractor-for-construction-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Labour Contractor for Construction in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Labour Contractor for Construction in Moradabad',
    description:
      'MT Boss is a labour contractor for construction in Moradabad, providing skilled masons, bar benders, carpenters, painters and plumbers with engineer supervision and clear rates.',
    images: [
      'https://www.mtboss.in/og-labour-contractor-for-construction-moradabad.jpg',
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
    url: 'https://www.mtboss.in/labour-contractor-for-construction-moradabad',
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