// app/(bareilly_keywords)/building-contractor-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Building Contractor in Bareilly | Turnkey House & Commercial Building | MTBOSS',
  description:
    'Building contractor in Bareilly for houses, shops and offices: structure-only or turnkey delivery with finishing, supervised sites and written scope. MTBOSS. Call or WhatsApp.',
  keywords:
    'building contractor in Bareilly, building contractor Bareilly, construction company Bareilly, house construction Bareilly, turnkey construction Bareilly, commercial building contractor Bareilly, shop construction Bareilly, office construction Bareilly, building renovation Bareilly, building repair Bareilly, waterproofing Bareilly, finishing contractor Bareilly, interior construction Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical: 'https://www.mtboss.in/building-contractor-in-bareilly',
  },
  openGraph: {
    title:
      'Building Contractor in Bareilly | Turnkey House & Commercial Building | MTBOSS',
    description:
      'Building contractor in Bareilly for houses, shops and offices: structure-only or turnkey delivery with finishing, supervised sites and written scope. MTBOSS. Call or WhatsApp.',
    url: 'https://www.mtboss.in/building-contractor-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-building-contractor-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt:
          'Building Contractor in Bareilly - Turnkey House and Commercial Building - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Building Contractor in Bareilly | Turnkey House & Commercial Building | MTBOSS',
    description:
      'Building contractor in Bareilly for houses, shops and offices: structure-only or turnkey delivery with finishing, supervised sites and written scope. MTBOSS. Call or WhatsApp.',
    images: [
      'https://www.mtboss.in/og-building-contractor-in-bareilly.jpg',
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
    url: 'https://www.mtboss.in/building-contractor-in-bareilly',
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