// app/(moradabad_keywords)/home-interior-renovation-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Home Interior Renovation in Moradabad | Redesign & Upgrade | MTBOSS',
  description:
    'Home interior renovation in Moradabad: new ceilings, flooring, woodwork, paint and lighting, planned and managed by MTBOSS. Call or WhatsApp for a site visit.',
  keywords:
    'home interior renovation Moradabad, interior renovation Moradabad, home interior designer Moradabad, false ceiling Moradabad, flooring renovation Moradabad, home woodwork Moradabad, home painting Moradabad, interior lighting Moradabad, home makeover Moradabad, room renovation Moradabad, MTBOSS interior renovation Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/home-interior-renovation-moradabad',
  },
  openGraph: {
    title:
      'Home Interior Renovation in Moradabad | Redesign & Upgrade | MTBOSS',
    description:
      'Home interior renovation in Moradabad: new ceilings, flooring, woodwork, paint and lighting, planned and managed by MTBOSS. Call or WhatsApp for a site visit.',
    url: 'https://www.mtboss.in/home-interior-renovation-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-home-interior-renovation-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Home Interior Renovation in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Home Interior Renovation in Moradabad | Redesign & Upgrade | MTBOSS',
    description:
      'Home interior renovation in Moradabad: new ceilings, flooring, woodwork, paint and lighting, planned and managed by MTBOSS. Call or WhatsApp for a site visit.',
    images: [
      'https://www.mtboss.in/og-home-interior-renovation-moradabad.jpg',
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'GeneralContractor',
  name: 'MTBOSS Construction Private Limited',
  url: 'https://www.mtboss.in/home-interior-renovation-moradabad',
  telephone: '+91-9458410866',
  email: 'mtboss2016@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: "Harthala Kanth Road, Behind Kr Collection, near Domino's",
    addressLocality: 'Moradabad',
    addressRegion: 'Uttar Pradesh',
    addressCountry: 'IN',
    // postalCode: 'ADD_PIN_CODE_HERE'
  },
  areaServed: {
    '@type': 'City',
    name: 'Moradabad',
  },
  priceRange: '₹₹',
};

export default function Page() {
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