// app/(moradabad_keywords)/mosquito-control-services-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Mosquito Control Services in Moradabad | MT Boss',
  description:
    'Mosquito control services in Moradabad by MT Boss. Breeding-spot inspection, larvicide, fogging and barrier treatment for homes, societies and sites. Call +91 94584 10866.',
  keywords:
    'mosquito control services Moradabad, mosquito control Moradabad, mosquito fogging Moradabad, mosquito larvicide treatment Moradabad, mosquito control near me Moradabad, society mosquito control Moradabad, mosquito treatment for construction sites Moradabad, mosquito control for homes Moradabad, mosquito pest control Moradabad, MT Boss mosquito control Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/mosquito-control-services-moradabad',
  },
  openGraph: {
    title: 'Mosquito Control Services in Moradabad | MT Boss',
    description:
      'Mosquito control services in Moradabad by MT Boss. Breeding-spot inspection, larvicide, fogging and barrier treatment for homes, societies and sites. Call +91 94584 10866.',
    url: 'https://www.mtboss.in/mosquito-control-services-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-mosquito-control-services-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Mosquito Control Services in Moradabad - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mosquito Control Services in Moradabad | MT Boss',
    description:
      'Mosquito control services in Moradabad by MT Boss. Breeding-spot inspection, larvicide, fogging and barrier treatment for homes, societies and sites. Call +91 94584 10866.',
    images: [
      'https://www.mtboss.in/og-mosquito-control-services-moradabad.jpg',
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
  url: 'https://www.mtboss.in/mosquito-control-services-moradabad',
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