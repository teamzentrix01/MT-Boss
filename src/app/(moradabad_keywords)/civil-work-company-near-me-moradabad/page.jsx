// app/(moradabad_keywords)/civil-work-company-near-me-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Civil Work Company Near Me in Moradabad | MT Boss',
  description:
    'Looking for a civil work company near you in Moradabad? MT Boss, Kanth Road, handles construction, repair and waterproofing. Call +91 94584 10866 for a site visit.',
  keywords:
    'civil work company near me Moradabad, civil work company Moradabad, construction company near me Moradabad, civil contractor near me Moradabad, building repair company Moradabad, waterproofing company Moradabad, civil work contractor Kanth Road Moradabad, construction company Harthala Moradabad, MT Boss civil work Moradabad, civil work company Bareilly',
  alternates: {
    canonical: 'https://www.mtboss.in/civil-work-company-near-me-moradabad',
  },
  openGraph: {
    title: 'Civil Work Company Near Me in Moradabad | MT Boss',
    description:
      'Looking for a civil work company near you in Moradabad? MT Boss, Kanth Road, handles construction, repair and waterproofing. Call +91 94584 10866 for a site visit.',
    url: 'https://www.mtboss.in/civil-work-company-near-me-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-civil-work-company-near-me-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Civil Work Company Near Me in Moradabad - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Civil Work Company Near Me in Moradabad | MT Boss',
    description:
      'Looking for a civil work company near you in Moradabad? MT Boss, Kanth Road, handles construction, repair and waterproofing. Call +91 94584 10866 for a site visit.',
    images: [
      'https://www.mtboss.in/og-civil-work-company-near-me-moradabad.jpg',
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
  url: 'https://www.mtboss.in/civil-work-company-near-me-moradabad',
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