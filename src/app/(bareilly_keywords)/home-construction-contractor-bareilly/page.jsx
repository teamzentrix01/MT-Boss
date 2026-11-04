// app/(bareilly_keywords)/home-construction-contractor-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Home Construction Contractor in Bareilly | Contract, Stages & Payments | MTBOSS',
  description:
    'Home construction contractor in Bareilly: written scope, stage-wise payments, owner checkpoints and records. MTBOSS builds houses to approved drawings. Call or WhatsApp.',
  keywords:
    'home construction contractor in Bareilly, house construction contractor Bareilly, home builder Bareilly, residential construction Bareilly, house construction company Bareilly, home renovation Bareilly, home extension Bareilly, construction contractor Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/home-construction-contractor-bareilly',
  },
  openGraph: {
    title:
      'Home Construction Contractor in Bareilly | Contract, Stages & Payments | MTBOSS',
    description:
      'Home construction contractor in Bareilly: written scope, stage-wise payments, owner checkpoints and records. MTBOSS builds houses to approved drawings. Call or WhatsApp.',
    url:
      'https://www.mtboss.in/home-construction-contractor-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-home-construction-contractor-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Home Construction Contractor in Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Home Construction Contractor in Bareilly | Contract, Stages & Payments | MTBOSS',
    description:
      'Home construction contractor in Bareilly: written scope, stage-wise payments, owner checkpoints and records. MTBOSS builds houses to approved drawings. Call or WhatsApp.',
    images: [
      'https://www.mtboss.in/og-home-construction-contractor-in-bareilly.jpg',
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
      'https://www.mtboss.in/home-construction-contractor-bareilly',
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