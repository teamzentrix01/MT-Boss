// app/(bareilly_keywords)/best-construction-company-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Best Construction Company in Bareilly | Standards & Proof | MTBOSS',
  description:
    'Choosing the best construction company in Bareilly takes more than a slogan. See the standards to check, and how MTBOSS builds homes and commercial spaces. Call or WhatsApp..',
  keywords:
    'best construction company in Bareilly, top construction company Bareilly, best builder in Bareilly, construction company Bareilly, building contractor Bareilly, civil contractor Bareilly, house construction Bareilly, home construction company Bareilly, commercial construction Bareilly, construction contractor Bareilly, reliable builder Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/best-construction-company-in-bareilly',
  },
  openGraph: {
    title: 'Best Construction Company in Bareilly | Standards & Proof | MTBOSS',
    description:
      'Choosing the best construction company in Bareilly takes more than a slogan. See the standards to check, and how MTBOSS builds homes and commercial spaces. Call or WhatsApp..',
    url:
      'https://www.mtboss.in/best-construction-company-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-best-construction-company-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Best Construction Company in Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Construction Company in Bareilly | Standards & Proof | MTBOSS',
    description:
      'Choosing the best construction company in Bareilly takes more than a slogan. See the standards to check, and how MTBOSS builds homes and commercial spaces. Call or WhatsApp..',
    images: [
      'https://www.mtboss.in/og-best-construction-company-in-bareilly.jpg',
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
      'https://www.mtboss.in/best-construction-company-in-bareilly',
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