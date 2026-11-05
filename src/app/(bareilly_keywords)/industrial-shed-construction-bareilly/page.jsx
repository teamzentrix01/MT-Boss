// app/(bareilly_keywords)/industrial-shed-construction-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Industrial Shed Construction Bareilly | MTBOSS Construction',
  description:
    'MTBOSS builds industrial sheds in Bareilly: PEB, steel truss and RCC-steel sheds for factories, warehouses and workshops. Strong design, fast erection, clear pricing. Get a quote.',
  keywords:
    'industrial shed construction in Bareilly, industrial shed Bareilly, PEB shed Bareilly, steel truss shed Bareilly, RCC steel shed Bareilly, factory shed construction Bareilly, warehouse shed Bareilly, workshop shed Bareilly, godown construction Bareilly, industrial building contractor Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/industrial-shed-construction-bareilly',
  },
  openGraph: {
    title:
      'Industrial Shed Construction in Bareilly | MTBOSS Construction',
    description:
      'MTBOSS builds industrial sheds in Bareilly: PEB, steel truss and RCC-steel sheds for factories, warehouses and workshops. Strong design, fast erection, clear pricing. Get a quote.',
    url:
      'https://www.mtboss.in/industrial-shed-construction-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-industrial-shed-construction-bareilly.jpg',
        width: 1200,
        height: 630,
        alt:
          'Industrial Shed Construction  Bareilly - MTBOSS Construction',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Industrial Shed Construction  Bareilly | MTBOSS Construction',
    description:
      'MTBOSS builds industrial sheds in Bareilly: PEB, steel truss and RCC-steel sheds for factories, warehouses and workshops. Strong design, fast erection, clear pricing. Get a quote.',
    images: [
      'https://www.mtboss.in/og-industrial-shed-construction-bareilly.jpg',
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
      'https://www.mtboss.in/industrial-shed-construction-bareilly',
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