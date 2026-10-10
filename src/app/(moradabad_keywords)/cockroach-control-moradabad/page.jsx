// app/(moradabad_keywords)/cockroach-control-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Cockroach Control in Moradabad | MT Boss',
  description:
    'Cockroach control in Moradabad by MT Boss. Gel baiting, drain and kitchen treatment for homes, restaurants and godowns. Call or WhatsApp +91 94584 10866.',
  keywords:
    'cockroach control Moradabad, cockroach pest control Moradabad, cockroach treatment Moradabad, kitchen cockroach control Moradabad, gel bait cockroach treatment Moradabad, cockroach control near me Moradabad, cockroach control for restaurants Moradabad, cockroach control for godowns Moradabad, cockroach removal Moradabad, MT Boss cockroach control Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/cockroach-control-moradabad',
  },
  openGraph: {
    title: 'Cockroach Control in Moradabad | MT Boss',
    description:
      'Cockroach control in Moradabad by MT Boss. Gel baiting, drain and kitchen treatment for homes, restaurants and godowns. Call or WhatsApp +91 94584 10866.',
    url: 'https://www.mtboss.in/cockroach-control-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-cockroach-control-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Cockroach Control in Moradabad - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cockroach Control in Moradabad | MT Boss',
    description:
      'Cockroach control in Moradabad by MT Boss. Gel baiting, drain and kitchen treatment for homes, restaurants and godowns. Call or WhatsApp +91 94584 10866.',
    images: ['https://www.mtboss.in/og-cockroach-control-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/cockroach-control-moradabad',
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