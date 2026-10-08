// app/(moradabad_keywords)/carpenter-contact-number-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Carpenter Contact Number in Moradabad | MT Boss',
  description:
    'Need a carpenter contact number in Moradabad? Call or WhatsApp MT Boss on +91 94584 10866 for doors, wardrobes, repairs and furniture work, with clear quotes.',
  keywords:
    'carpenter contact number Moradabad, carpenter contact Moradabad, carpenter phone number Moradabad, carpenter WhatsApp number Moradabad, carpenter near me Moradabad, carpenter services Moradabad, carpenter for doors Moradabad, carpenter for wardrobes Moradabad, carpenter for furniture repair Moradabad, carpenter for repairs Moradabad, MT Boss carpenter Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/carpenter-contact-number-moradabad',
  },
  openGraph: {
    title: 'Carpenter Contact Number in Moradabad | MT Boss',
    description:
      'Need a carpenter contact number in Moradabad? Call or WhatsApp MT Boss on +91 94584 10866 for doors, wardrobes, repairs and furniture work, with clear quotes.',
    url: 'https://www.mtboss.in/carpenter-contact-number-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-carpenter-contact-number-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Carpenter Contact Number in Moradabad - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Carpenter Contact Number in Moradabad | MT Boss',
    description:
      'Need a carpenter contact number in Moradabad? Call or WhatsApp MT Boss on +91 94584 10866 for doors, wardrobes, repairs and furniture work, with clear quotes.',
    images: ['https://www.mtboss.in/og-carpenter-contact-number-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/carpenter-contact-number-moradabad',
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