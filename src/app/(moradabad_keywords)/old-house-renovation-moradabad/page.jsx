// app/(moradabad_keywords)/old-house-renovation-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Old House Renovation in Moradabad',
  description:
    'Old house renovation in Moradabad: fix seepage, cracks, old wiring and pipes, then upgrade interiors. MTBOSS inspects first and manages every trade. Call or WhatsApp.',
  keywords:
    'old house renovation Moradabad, old home renovation Moradabad, house renovation Moradabad, old house repair Moradabad, seepage repair Moradabad, damp wall repair Moradabad, old wiring replacement Moradabad, old pipe replacement Moradabad, house renovation contractor Moradabad, home renovation Moradabad, MTBOSS old house renovation Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/old-house-renovation-moradabad',
  },
  openGraph: {
    title: 'Old House Renovation in Moradabad',
    description:
      'Old house renovation in Moradabad: fix seepage, cracks, old wiring and pipes, then upgrade interiors. MTBOSS inspects first and manages every trade. Call or WhatsApp.',
    url: 'https://www.mtboss.in/old-house-renovation-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-old-house-renovation-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Old House Renovation in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Old House Renovation in Moradabad',
    description:
      'Old house renovation in Moradabad: fix seepage, cracks, old wiring and pipes, then upgrade interiors. MTBOSS inspects first and manages every trade. Call or WhatsApp.',
    images: ['https://www.mtboss.in/og-old-house-renovation-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/old-house-renovation-moradabad',
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