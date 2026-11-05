// app/(bareilly_keywords)/turnkey-construction-company-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Turnkey Construction Company Bareilly | Design-Build Delivery | MTBOSS',
  description:
    'Turnkey construction company Bareilly: design coordination, construction, finishing and handover under one responsibility for homes and commercial buildings. MTBOSS. Call or WhatsApp.',
  keywords:
    'turnkey construction company Bareilly, turnkey construction Bareilly, design build company Bareilly, turnkey contractor Bareilly, complete construction Bareilly, turnkey building construction Bareilly, commercial turnkey construction Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/turnkey-construction-company-bareilly',
  },
  openGraph: {
    title:
      'Turnkey Construction Company Bareilly | Design-Build Delivery | MTBOSS',
    description:
      'Turnkey construction company Bareilly: design coordination, construction, finishing and handover under one responsibility for homes and commercial buildings. MTBOSS. Call or WhatsApp.',
    url:
      'https://www.mtboss.in/turnkey-construction-company-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-turnkey-construction-company-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Turnkey Construction Company Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Turnkey Construction Company Bareilly | Design-Build Delivery | MTBOSS',
    description:
      'Turnkey construction company Bareilly: design coordination, construction, finishing and handover under one responsibility for homes and commercial buildings. MTBOSS. Call or WhatsApp.',
    images: [
      'https://www.mtboss.in/og-turnkey-construction-company-bareilly.jpg',
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
      'https://www.mtboss.in/turnkey-construction-company-bareilly',
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