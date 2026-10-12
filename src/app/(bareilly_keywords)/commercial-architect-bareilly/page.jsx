// app/(bareilly_keywords)/commercial-architect-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Commercial Architect in Bareilly',
  description:
    'Commercial architect in Bareilly for shops, showrooms, offices and complexes. MTBOSS plans layouts, drawings and construction around your business. Call or WhatsApp.',
  keywords:
    'commercial architect in Bareilly, commercial building design Bareilly, shop architect Bareilly, showroom architect Bareilly, office architect Bareilly, commercial complex design Bareilly, restaurant architect Bareilly, godown architect Bareilly, warehouse design Bareilly, commercial interior design Bareilly, MTBOSS Bareilly, architect near me Bareilly',
  alternates: {
    canonical: 'https://www.mtboss.in/commercial-architect-bareilly',
  },
  openGraph: {
    title: 'Commercial Architect in Bareilly',
    description:
      'Commercial architect in Bareilly for shops, showrooms, offices and complexes. MTBOSS plans layouts, drawings and construction around your business. Call or WhatsApp.',
    url: 'https://www.mtboss.in/commercial-architect-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-commercial-architect-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Commercial Architect in Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Commercial Architect in Bareilly',
    description:
      'Commercial architect in Bareilly for shops, showrooms, offices and complexes. MTBOSS plans layouts, drawings and construction around your business. Call or WhatsApp.',
    images: ['https://www.mtboss.in/og-commercial-architect-bareilly.jpg'],
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
    url: 'https://www.mtboss.in/commercial-architect-bareilly',
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