// app/(bareilly_keywords)/best-civil-contractor-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Best Civil Contractor in Bareilly | MTBoss',
  description:
    'Looking for the best civil contractor in Bareilly? Check measurement, testing, supervision and billing before you hire, and see how MTBoss works.',
  keywords:
    'best civil contractor in Bareilly, civil contractor Bareilly, civil contractor near me Bareilly, building contractor Bareilly, house construction Bareilly, commercial construction Bareilly, road contractor Bareilly, paver block contractor Bareilly, boundary wall contractor Bareilly, waterproofing contractor Bareilly, civil work Bareilly, MTBoss Bareilly',
  alternates: {
    canonical: 'https://www.mtboss.in/best-civil-contractor-in-bareilly',
  },
  openGraph: {
    title: 'Best Civil Contractor in Bareilly | MTBoss',
    description:
      'Looking for the best civil contractor in Bareilly? Check measurement, testing, supervision and billing before you hire, and see how MTBoss works.',
    url: 'https://www.mtboss.in/best-civil-contractor-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-best-civil-contractor-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Best Civil Contractor in Bareilly - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Civil Contractor in Bareilly | MTBoss',
    description:
      'Looking for the best civil contractor in Bareilly? Check measurement, testing, supervision and billing before you hire, and see how MTBoss works.',
    images: [
      'https://www.mtboss.in/og-best-civil-contractor-in-bareilly.jpg',
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
    url: 'https://www.mtboss.in/best-civil-contractor-in-bareilly',
    telephone: '+91-9458410866',
    email: 'mtboss2016@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress:
        "Harthala Kanth Road, Behind Kr Collection, near Domino's",
      addressLocality: 'Moradabad',
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN',
    },
    areaServed: {
      '@type': 'City',
      name: 'Bareilly',
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