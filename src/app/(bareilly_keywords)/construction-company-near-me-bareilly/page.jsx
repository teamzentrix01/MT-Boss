// app/(bareilly_keywords)/construction-company-near-me-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Construction Company Near Me In Bareilly | House & Commercial | MTBOSS',
  description:
    'Looking for a construction company near you in Bareilly? MTBOSS builds homes and commercial spaces, with repair and finishing under one team. Call or WhatsApp..',
  keywords:
    'construction company near me in Bareilly, construction company near me Bareilly, builders near me Bareilly, building contractor near me Bareilly, civil contractor near me Bareilly, house construction near me Bareilly, home construction company Bareilly, commercial construction Bareilly, building repair Bareilly, renovation company Bareilly, waterproofing Bareilly, construction contractor Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/construction-company-near-me-in-bareilly',
  },
  openGraph: {
    title:
      'Construction Company Near Me In Bareilly | House & Commercial | MTBOSS',
    description:
      'Looking for a construction company near you in Bareilly? MTBOSS builds homes and commercial spaces, with repair and finishing under one team. Call or WhatsApp..',
    url:
      'https://www.mtboss.in/construction-company-near-me-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-construction-company-near-me-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Construction Company Near Me in Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Construction Company Near Me In Bareilly | House & Commercial | MTBOSS',
    description:
      'Looking for a construction company near you in Bareilly? MTBOSS builds homes and commercial spaces, with repair and finishing under one team. Call or WhatsApp..',
    images: [
      'https://www.mtboss.in/og-construction-company-near-me-in-bareilly.jpg',
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
      'https://www.mtboss.in/construction-company-near-me-in-bareilly',
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