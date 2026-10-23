// app/(moradabad_keywords)/civil-contractor-boundary-wall-work-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Civil Contractor for Boundary Wall Work Moradabad | MTBoss',
  description:
    'MTBoss is a civil contractor for boundary wall work in Moradabad. Site marking, foundation, masonry and finishing with engineer supervision and clear quotes.',
  keywords:
    'civil contractor for boundary wall work Moradabad, boundary wall contractor Moradabad, compound wall contractor Moradabad, boundary wall construction Moradabad, brick boundary wall Moradabad, RCC boundary wall Moradabad, readymade boundary wall Moradabad, boundary wall repair Moradabad, gate pillar contractor Moradabad, MTBoss boundary wall Moradabad',
  alternates: {
    canonical:
      'https://www.MTBoss.in/civil-contractor-boundary-wall-work-moradabad',
  },
  openGraph: {
    title: 'Civil Contractor for Boundary Wall Work Moradabad | MTBoss',
    description:
      'MTBoss is a civil contractor for boundary wall work in Moradabad. Site marking, foundation, masonry and finishing with engineer supervision and clear quotes.',
    url: 'https://www.MTBoss.in/civil-contractor-boundary-wall-work-moradabad',
    siteName: 'MTBoss Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBoss.in/og-civil-contractor-boundary-wall-work-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Civil Contractor for Boundary Wall Work Moradabad - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Civil Contractor for Boundary Wall Work Moradabad | MTBoss',
    description:
      'MTBoss is a civil contractor for boundary wall work in Moradabad. Site marking, foundation, masonry and finishing with engineer supervision and clear quotes.',
    images: [
      'https://www.MTBoss.in/og-civil-contractor-boundary-wall-work-moradabad.jpg',
    ],
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
  url: 'https://www.MTBoss.in/civil-contractor-boundary-wall-work-moradabad',
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