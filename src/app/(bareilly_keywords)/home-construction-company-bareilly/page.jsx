// app/(bareilly_keywords)/home-construction-company-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Home Construction Company in Bareilly | Plot to Griha Pravesh | MTBOSS',
  description:
    'Home construction company in Bareilly: design coordination, supervised construction and finishing for houses and duplexes. MTBOSS builds to approved drawings. Call or WhatsApp.',
  keywords:
    'home construction company in Bareilly, home construction Bareilly, house construction company Bareilly, house construction Bareilly, duplex construction Bareilly, bungalow construction Bareilly, residential construction Bareilly, home renovation Bareilly, home finishing Bareilly, waterproofing Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/home-construction-company-bareilly',
  },
  openGraph: {
    title:
      'Home Construction Company in Bareilly | Plot to Griha Pravesh | MTBOSS',
    description:
      'Home construction company in Bareilly: design coordination, supervised construction and finishing for houses and duplexes. MTBOSS builds to approved drawings. Call or WhatsApp.',
    url:
      'https://www.mtboss.in/home-construction-company-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-home-construction-company-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt:
          'Home Construction Company in Bareilly - Plot to Griha Pravesh - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Home Construction Company in Bareilly | Plot to Griha Pravesh | MTBOSS',
    description:
      'Home construction company in Bareilly: design coordination, supervised construction and finishing for houses and duplexes. MTBOSS builds to approved drawings. Call or WhatsApp.',
    images: [
      'https://www.mtboss.in/og-home-construction-company-in-bareilly.jpg',
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
      'https://www.mtboss.in/home-construction-company-bareilly',
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