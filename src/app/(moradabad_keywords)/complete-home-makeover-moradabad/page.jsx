// app/(moradabad_keywords)/complete-home-makeover-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Complete Home Makeover in Moradabad',
  description:
    'Complete home makeover in Moradabad: exterior, interiors, kitchen, bathrooms and finishing planned as one project. MTBOSS manages every trade. Call or WhatsApp.',
  keywords:
    'complete home makeover Moradabad, whole home makeover Moradabad, full home renovation Moradabad, home transformation Moradabad, exterior makeover Moradabad, interior makeover Moradabad, kitchen makeover Moradabad, bathroom makeover Moradabad, home exterior painting Moradabad, complete renovation Moradabad, MTBOSS home makeover Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/complete-home-makeover-moradabad',
  },
  openGraph: {
    title: 'Complete Home Makeover in Moradabad',
    description:
      'Complete home makeover in Moradabad: exterior, interiors, kitchen, bathrooms and finishing planned as one project. MTBOSS manages every trade. Call or WhatsApp.',
    url: 'https://www.mtboss.in/complete-home-makeover-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-complete-home-makeover-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Complete Home Makeover in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Complete Home Makeover in Moradabad',
    description:
      'Complete home makeover in Moradabad: exterior, interiors, kitchen, bathrooms and finishing planned as one project. MTBOSS manages every trade. Call or WhatsApp.',
    images: [
      'https://www.mtboss.in/og-complete-home-makeover-moradabad.jpg',
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
  url: 'https://www.mtboss.in/complete-home-makeover-moradabad',
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