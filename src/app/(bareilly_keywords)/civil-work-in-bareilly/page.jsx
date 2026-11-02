// app/(bareilly_keywords)/civil-work-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Civil Work in Bareilly | Planning, Stages & Site Checklist | MTBOSS',
  description:
    'Plan civil work in Bareilly with a season calendar, stage checklist and budget guide. MTBOSS handles construction, repair and waterproofing with supervised sites.',
  keywords:
    'civil work in Bareilly, civil contractor Bareilly, civil construction Bareilly, house construction Bareilly, building construction Bareilly, commercial construction Bareilly, building repair Bareilly, renovation Bareilly, waterproofing Bareilly, construction planning Bareilly, civil work checklist Bareilly, construction stages Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical: 'https://www.mtboss.in/civil-work-in-bareilly',
  },
  openGraph: {
    title:
      'Civil Work in Bareilly | Planning, Stages & Site Checklist | MTBOSS',
    description:
      'Plan civil work in Bareilly with a season calendar, stage checklist and budget guide. MTBOSS handles construction, repair and waterproofing with supervised sites.',
    url: 'https://www.mtboss.in/civil-work-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-civil-work-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Civil Work in Bareilly - Planning, Stages and Site Checklist - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Civil Work in Bareilly | Planning, Stages & Site Checklist | MTBOSS',
    description:
      'Plan civil work in Bareilly with a season calendar, stage checklist and budget guide. MTBOSS handles construction, repair and waterproofing with supervised sites.',
    images: ['https://www.mtboss.in/og-civil-work-in-bareilly.jpg'],
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
    url: 'https://www.mtboss.in/civil-work-in-bareilly',
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