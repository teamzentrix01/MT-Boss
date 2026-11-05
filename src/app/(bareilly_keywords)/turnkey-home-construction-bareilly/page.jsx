// app/(bareilly_keywords)/turnkey-home-construction-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Turnkey Home Construction  Bareilly | Key-in-Hand House Building | MTBOSS',
  description:
    'Turnkey home construction  Bareilly: one scope from design coordination to finishing and handover. See what turnkey includes and what to confirm. MTBOSS. Call or WhatsApp.',
  keywords:
    'turnkey home construction  Bareilly, turnkey house construction Bareilly, key in hand home construction Bareilly, complete house construction Bareilly, turnkey contractor Bareilly, home construction company Bareilly, house building contractor Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/turnkey-home-construction-bareilly',
  },
  openGraph: {
    title:
      'Turnkey Home Construction  Bareilly | Key-in-Hand House Building | MTBOSS',
    description:
      'Turnkey home construction in Bareilly: one scope from design coordination to finishing and handover. See what turnkey includes and what to confirm. MTBOSS. Call or WhatsApp.',
    url:
      'https://www.mtboss.in/turnkey-home-construction-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-turnkey-home-construction-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Turnkey Home Construction  Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Turnkey Home Construction Bareilly | Key-in-Hand House Building | MTBOSS',
    description:
      'Turnkey home construction in Bareilly: one scope from design coordination to finishing and handover. See what turnkey includes and what to confirm. MTBOSS. Call or WhatsApp.',
    images: [
      'https://www.mtboss.in/og-turnkey-home-construction-bareilly.jpg',
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
      'https://www.mtboss.in/turnkey-home-construction-bareilly',
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