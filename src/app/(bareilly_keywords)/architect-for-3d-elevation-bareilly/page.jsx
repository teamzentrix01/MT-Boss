// app/(bareilly_keywords)/architect-for-3d-elevation-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect for 3D Elevation in Bareilly | MTBoss',
  description:
    'Need a 3D elevation in Bareilly? MTBoss designs house and shop fronts with realistic views, material choices and drawings ready for construction.',
  keywords:
    'architect for 3D elevation in Bareilly, 3D elevation architect Bareilly, 3D elevation design Bareilly, house elevation design Bareilly, building elevation architect Bareilly, front elevation design Bareilly, 3D front elevation Bareilly, house 3D elevation Bareilly, elevation designer Bareilly, 3D building design Bareilly, MTBoss Bareilly, architect for 3D elevation in Bareilly',
  alternates: {
    canonical:
      'https://www.MTBoss.in/architect-for-3d-elevation-in-bareilly',
  },
  openGraph: {
    title: 'Architect for 3D Elevation in Bareilly | MTBoss',
    description:
      'Need a 3D elevation in Bareilly? MTBoss designs house and shop fronts with realistic views, material choices and drawings ready for construction.',
    url: 'https://www.MTBoss.in/architect-for-3d-elevation-in-bareilly',
    siteName: 'MTBoss Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBoss.in/og-architect-for-3d-elevation-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect for 3D Elevation in Bareilly - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect for 3D Elevation in Bareilly | MTBoss',
    description:
      'Need a 3D elevation in Bareilly? MTBoss designs house and shop fronts with realistic views, material choices and drawings ready for construction.',
    images: [
      'https://www.MTBoss.in/og-architect-for-3d-elevation-in-bareilly.jpg',
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
    url: 'https://www.MTBoss.in/architect-for-3d-elevation-in-bareilly',
    telephone: '+91-9458410866',
    email: 'MTBoss2016@gmail.com',
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