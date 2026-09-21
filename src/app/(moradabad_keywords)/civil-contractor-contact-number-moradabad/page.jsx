// app/(moradabad_keywords)/civil-contractor-contact-number-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Civil Contractor Contact Number Moradabad | MTBOSS',
  description:
    'Need a civil contractor&apos;s contact number in Moradabad? Call, email or WhatsApp MTBOSS Construction for a fast, free quote on your project today!',
  keywords:
    'civil contractor contact number Moradabad, contractor phone number Moradabad, construction company contact number, civil contractor whatsapp number, builder contact number Moradabad, contractor mobile number near me, MTBOSS contact number, construction company email Moradabad, civil contractor helpline, contractor near me contact',
  alternates: {
    canonical: 'https://www.mtboss.in/civil-contractor-contact-number-in-moradabad',
  },
  openGraph: {
    title: 'Civil Contractor Contact Number Moradabad | MTBOSS',
    description:
      'Need a civil contractor&apos;s contact number in Moradabad? Call, email or WhatsApp MTBOSS Construction for a fast, free quote on your project today!',
    url: 'https://www.mtboss.in/civil-contractor-contact-number-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-civil-contractor-contact-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Civil Contractor Contact Number in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Civil Contractor Contact Number Moradabad | MTBOSS',
    description:
      'Need a civil contractor&apos;s contact number in Moradabad? Call, email or WhatsApp MTBOSS Construction for a fast, free quote on your project today!',
    images: ['https://www.mtboss.in/og-civil-contractor-contact-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/civil-contractor-contact-number-in-moradabad',
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