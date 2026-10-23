// app/(moradabad_keywords)/architect-for-home-design-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect for Home Design in Moradabad | MTBoss',
  description:
    'Need an architect for home design in Moradabad? Learn about layout planning, vastu, 3D visualization, costs, and how MTBoss supports design-to-build.',
  keywords:
    'architect for home design Moradabad, home design architect near me, house layout design Moradabad, vastu home design Moradabad, 3D home design near me, home interior design architect, house plan design Moradabad, MTBoss Moradabad, home design cost Moradabad, house design consultant near me',
  alternates: {
    canonical: 'https://www.MTBoss.in/architect-for-home-design-in-moradabad',
  },
  openGraph: {
    title: 'Architect for Home Design in Moradabad | MTBoss',
    description:
      'Need an architect for home design in Moradabad? Learn about layout planning, vastu, 3D visualization, costs, and how MTBoss supports design-to-build.',
    url: 'https://www.MTBoss.in/architect-for-home-design-in-moradabad',
    siteName: 'MTBoss Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBoss.in/og-architect-home-design-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect for Home Design in Moradabad - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect for Home Design in Moradabad | MTBoss',
    description:
      'Need an architect for home design in Moradabad? Learn about layout planning, vastu, 3D visualization, costs, and how MTBoss supports design-to-build.',
    images: ['https://www.MTBoss.in/og-architect-home-design-moradabad.jpg'],
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
    url: 'https://www.MTBoss.in/architect-for-home-design-in-moradabad',
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