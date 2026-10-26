import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

const title = 'Landscape Architect in Bareilly';
const description =
  'Plan gardens, outdoor areas and landscape features for homes and businesses in Bareilly with MTBOSS. Get practical design and construction guidance for your site.';
const canonical = 'https://www.MTBOSS.in/landscape-architect-bareilly';

export const metadata = {
  title,
  description,
  keywords:
    'landscape architect in Bareilly, landscape design Bareilly, garden design Bareilly, outdoor space planning Bareilly, residential landscape architect Bareilly, commercial landscape design Bareilly, MTBOSS Bareilly',
  alternates: { canonical },
  openGraph: {
    title,
    description,
    url: canonical,
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBOSS.in/og-landscape-architect-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Landscape Architect in Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.MTBOSS.in/og-landscape-architect-bareilly.jpg'],
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    name: 'MTBOSS Construction Private Limited',
    url: canonical,
    telephone: '+91-9458410866',
    email: 'MTBOSS2016@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: "Harthala Kanth Road, Behind Kr Collection, near Domino's",
      addressLocality: 'Moradabad',
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN',
    },
    areaServed: { '@type': 'City', name: 'Bareilly' },
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