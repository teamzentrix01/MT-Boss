// app/(moradabad_keywords)/construction-firm-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Construction Firm in Moradabad',
  description:
    'MT Boss is a construction firm in Moradabad with divisions for building, home services, materials and property, serving Moradabad and Bareilly with transparent pricing.',
  keywords:
    'construction firm Moradabad, construction company in Moradabad, building firm Moradabad, civil construction Moradabad, home services Moradabad, construction materials Moradabad, property buy sell rent Moradabad, construction company Bareilly, MT Boss Moradabad, MTBOSS Construction Private Limited',
  alternates: {
    canonical: 'https://www.mtboss.in/construction-firm-in-moradabad',
  },
  openGraph: {
    title: 'Construction Firm in Moradabad',
    description:
      'MT Boss is a construction firm in Moradabad with divisions for building, home services, materials and property, serving Moradabad and Bareilly with transparent pricing.',
    url: 'https://www.mtboss.in/construction-firm-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-construction-firm-in-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Construction Firm in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Construction Firm in Moradabad',
    description:
      'MT Boss is a construction firm in Moradabad with divisions for building, home services, materials and property, serving Moradabad and Bareilly with transparent pricing.',
    images: ['https://www.mtboss.in/og-construction-firm-in-moradabad.jpg'],
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
    url: 'https://www.mtboss.in/construction-firm-in-moradabad',
    telephone: '+91-9458410866',
    email: 'mtboss2016@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: "Harthala Kanth Road, Behind Kr Collection, near Domino's",
      addressLocality: 'Moradabad',
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN',
    },
    areaServed: {
      '@type': 'City',
      name: 'Moradabad',
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