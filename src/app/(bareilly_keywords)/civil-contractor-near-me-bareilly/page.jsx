// app/(bareilly_keywords)/civil-contractor-near-me-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Civil Contractor Near Me in Bareilly | MTBoss',
  description:
    'Searching for a civil contractor near you in Bareilly? See how MTBoss, based in Moradabad, runs site visits, supervision and estimates for Bareilly projects.',
  keywords:
    'civil contractor near me in Bareilly, civil contractor near me Bareilly, civil contractor Bareilly, building contractor near me Bareilly, construction contractor Bareilly, house construction Bareilly, commercial construction Bareilly, civil work Bareilly, building repair Bareilly, renovation contractor Bareilly, waterproofing Bareilly, road contractor Bareilly, paver block contractor Bareilly, boundary wall contractor Bareilly, MTBoss Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/civil-contractor-near-me-in-bareilly',
  },
  openGraph: {
    title: 'Civil Contractor Near Me in Bareilly | MTBoss',
    description:
      'Searching for a civil contractor near you in Bareilly? See how MTBoss, based in Moradabad, runs site visits, supervision and estimates for Bareilly projects.',
    url: 'https://www.mtboss.in/civil-contractor-near-me-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-civil-contractor-near-me-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Civil Contractor Near Me in Bareilly - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Civil Contractor Near Me in Bareilly | MTBoss',
    description:
      'Searching for a civil contractor near you in Bareilly? See how MTBoss, based in Moradabad, runs site visits, supervision and estimates for Bareilly projects.',
    images: [
      'https://www.mtboss.in/og-civil-contractor-near-me-in-bareilly.jpg',
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
    url:
      'https://www.mtboss.in/civil-contractor-near-me-in-bareilly',
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