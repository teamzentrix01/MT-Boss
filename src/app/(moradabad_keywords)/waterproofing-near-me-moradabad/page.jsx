// app/(moradabad_keywords)/waterproofing-near-me-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Waterproofing Near Me in Moradabad | MT Boss',
  description:
    'Looking for waterproofing near you in Moradabad? MT Boss, Kanth Road, offers local inspection and leak treatment for terraces, bathrooms and tanks. Call +91 94584 10866.',
  keywords:
    'waterproofing near me Moradabad, waterproofing company near me Moradabad, waterproofing contractor near me Moradabad, local waterproofing Moradabad, waterproofing near Kanth Road Moradabad, waterproofing near Harthala Moradabad, terrace waterproofing near me Moradabad, bathroom waterproofing near me Moradabad, water tank waterproofing near me Moradabad, MT Boss waterproofing Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/waterproofing-near-me-moradabad',
  },
  openGraph: {
    title: 'Waterproofing Near Me in Moradabad | MT Boss',
    description:
      'Looking for waterproofing near you in Moradabad? MT Boss, Kanth Road, offers local inspection and leak treatment for terraces, bathrooms and tanks. Call +91 94584 10866.',
    url: 'https://www.mtboss.in/waterproofing-near-me-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-waterproofing-near-me-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Waterproofing Near Me in Moradabad - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Waterproofing Near Me in Moradabad | MT Boss',
    description:
      'Looking for waterproofing near you in Moradabad? MT Boss, Kanth Road, offers local inspection and leak treatment for terraces, bathrooms and tanks. Call +91 94584 10866.',
    images: ['https://www.mtboss.in/og-waterproofing-near-me-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/waterproofing-near-me-moradabad',
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