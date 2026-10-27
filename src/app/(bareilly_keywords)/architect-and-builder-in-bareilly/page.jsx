// app/(bareilly_keywords)/architect-and-builder-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect and Builder in Bareilly',
  description:
    'Need an architect and builder in Bareilly MTBOSS designs and builds homes, shops and warehouses with one team, clear stages and written terms.',
  keywords:
    'architect and builder in Bareilly, architect builder Bareilly, design and build Bareilly, construction company Bareilly, house construction Bareilly, home builder Bareilly, commercial builder Bareilly, warehouse construction Bareilly, shop construction Bareilly, architect and contractor Bareilly, turnkey construction Bareilly, MTBOSS Bareilly, builder near me Bareilly',
  alternates: {
    canonical: 'https://www.MTBOSS.in/architect-and-builder-in-bareilly',
  },
  openGraph: {
    title: 'Architect and Builder in Bareilly',
    description:
      'Need an architect and builder in Bareilly MTBOSS designs and builds homes, shops and warehouses with one team, clear stages and written terms.',
    url: 'https://www.MTBOSS.in/architect-and-builder-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBOSS.in/og-architect-and-builder-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect and Builder in Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect and Builder in Bareilly',
    description:
      'Need an architect and builder in Bareilly MTBOSS designs and builds homes, shops and warehouses with one team, clear stages and written terms.',
    images: [
      'https://www.MTBOSS.in/og-architect-and-builder-in-bareilly.jpg',
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
    url: 'https://www.MTBOSS.in/architect-and-builder-in-bareilly',
    telephone: '+91-9458410866',
    email: 'MTBOSS2016@gmail.com',
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