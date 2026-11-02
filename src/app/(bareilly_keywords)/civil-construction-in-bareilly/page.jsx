// app/(bareilly_keywords)/civil-construction-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Civil Construction in Bareilly | RCC, Masonry & Site Work | MTBOSS',
  description:
    'Civil construction in Bareilly for houses, shops and offices: foundation, RCC, masonry, plastering and drainage, built from approved drawings. MTBOSS. Call or WhatsApp.',
  keywords:
    'civil construction in Bareilly, civil construction Bareilly, RCC construction Bareilly, masonry work Bareilly, site work Bareilly, foundation construction Bareilly, plastering contractors Bareilly, drainage construction Bareilly, house construction Bareilly, shop construction Bareilly, office construction Bareilly, MTBoss Bareilly, MTBoss construction',
  alternates: {
    canonical: 'https://www.mtboss.in/civil-construction-in-bareilly',
  },
  openGraph: {
    title: 'Civil Construction in Bareilly | RCC, Masonry & Site Work | MTBOSS',
    description:
      'Civil construction in Bareilly for houses, shops and offices: foundation, RCC, masonry, plastering and drainage, built from approved drawings. MTBOSS. Call or WhatsApp.',
    url: 'https://www.mtboss.in/civil-construction-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-civil-construction-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Civil Construction in Bareilly - MTBoss Construction',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Civil Construction in Bareilly | RCC, Masonry & Site Work | MTBOSS',
    description:
      'Civil construction in Bareilly for houses, shops and offices: foundation, RCC, masonry, plastering and drainage, built from approved drawings. MTBOSS. Call or WhatsApp.',
    images: ['https://www.mtboss.in/og-civil-construction-in-bareilly.jpg'],
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
    url: 'https://www.mtboss.in/civil-construction-in-bareilly',
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