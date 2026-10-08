// app/(moradabad_keywords)/bathroom-renovation-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Bathroom Renovation in Moradabad | Waterproofing & Remodel | MTBOSS',
  description:
    'Bathroom renovation in Moradabad: fix leaks, redo waterproofing, plumbing, tiles and fittings. MTBOSS manages every trade for a safe, lasting bathroom. Call or WhatsApp.',
  keywords:
    'bathroom renovation Moradabad, bathroom remodelling Moradabad, bathroom renovation contractor Moradabad, bathroom waterproofing Moradabad, bathroom leak repair Moradabad, bathroom plumbing Moradabad, bathroom tiles Moradabad, bathroom fittings Moradabad, small bathroom renovation Moradabad, bathroom renovation cost Moradabad, MTBOSS bathroom renovation Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/bathroom-renovation-moradabad',
  },
  openGraph: {
    title:
      'Bathroom Renovation in Moradabad | Waterproofing & Remodel | MTBOSS',
    description:
      'Bathroom renovation in Moradabad: fix leaks, redo waterproofing, plumbing, tiles and fittings. MTBOSS manages every trade for a safe, lasting bathroom. Call or WhatsApp.',
    url: 'https://www.mtboss.in/bathroom-renovation-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-bathroom-renovation-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Bathroom Renovation in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Bathroom Renovation in Moradabad | Waterproofing & Remodel | MTBOSS',
    description:
      'Bathroom renovation in Moradabad: fix leaks, redo waterproofing, plumbing, tiles and fittings. MTBOSS manages every trade for a safe, lasting bathroom. Call or WhatsApp.',
    images: ['https://www.mtboss.in/og-bathroom-renovation-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/bathroom-renovation-moradabad',
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