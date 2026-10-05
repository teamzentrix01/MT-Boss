// app/(moradabad_keywords)/construction-contractor-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Construction Contractor in Moradabad',
  description:
    'Hire MT Boss, a construction contractor in Moradabad, for houses, shops, hotels and factories. Get clear estimates, skilled teams, quality supervision and timely handover.',
  keywords:
    'construction contractor Moradabad, building contractor in Moradabad, civil contractor Moradabad, house construction contractor Moradabad, commercial contractor Moradabad, industrial contractor Moradabad, hotel construction contractor Moradabad, renovation contractor Moradabad, MT Boss Moradabad, construction company Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/construction-contractor-in-moradabad',
  },
  openGraph: {
    title: 'Construction Contractor in Moradabad',
    description:
      'Hire MT Boss, a construction contractor in Moradabad, for houses, shops, hotels and factories. Get clear estimates, skilled teams, quality supervision and timely handover.',
    url: 'https://www.mtboss.in/construction-contractor-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-construction-contractor-in-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Construction Contractor in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Construction Contractor in Moradabad',
    description:
      'Hire MT Boss, a construction contractor in Moradabad, for houses, shops, hotels and factories. Get clear estimates, skilled teams, quality supervision and timely handover.',
    images: [
      'https://www.mtboss.in/og-construction-contractor-in-moradabad.jpg',
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
    url: 'https://www.mtboss.in/construction-contractor-in-moradabad',
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