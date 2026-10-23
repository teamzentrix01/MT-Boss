// app/(moradabad_keywords)/civil-contractor-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Best Civil Contractor in Moradabad | MTBoss Construction',
  description:
    'Looking for a trusted civil contractor in Moradabad? MTBoss delivers expert construction, renovation & building material supply. Get a free quote today!',
  keywords:
    'civil contractor in Moradabad, best civil contractor Moradabad, construction company in Moradabad, building contractor near me, residential contractor Moradabad, commercial construction Moradabad, civil engineering services Moradabad, house construction contractor Moradabad, construction material supplier Moradabad, MTBoss Moradabad',
  alternates: {
    canonical: 'https://www.MTBoss.in/civil-contractor-in-moradabad',
  },
  openGraph: {
    title: 'Best Civil Contractor in Moradabad | MTBoss Construction',
    description:
      'Trusted civil contractor in Moradabad — expert construction, renovation & building material supply with 22+ years of experience.',
    url: 'https://www.MTBoss.in/civil-contractor-in-moradabad',
    siteName: 'MTBoss Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBoss.in/og-civil-contractor-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Civil Contractor in Moradabad - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Civil Contractor in Moradabad | MTBoss Construction',
    description:
      'Trusted civil contractor in Moradabad — expert construction, renovation & building material supply with 22+ years of experience.',
    images: ['https://www.MTBoss.in/og-civil-contractor-moradabad.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'GeneralContractor',
  name: 'MTBoss Construction Private Limited',
  url: 'https://www.MTBoss.in/civil-contractor-in-moradabad',
  telephone: '+91-9458410866',
  email: 'MTBoss2016@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: "Harthala Kanth Road, Behind Kr Collection, near Domino's",
    addressLocality: 'Moradabad',
    addressRegion: 'Uttar Pradesh',
    addressCountry: 'IN',
    // postalCode: 'ADD_PIN_CODE_HERE'
  },
  areaServed: {
    '@type': 'City',
    name: 'Moradabad',
  },
  priceRange: '₹₹',
};

export default function Page() {
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