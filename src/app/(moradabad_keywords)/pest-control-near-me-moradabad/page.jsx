// app/(moradabad_keywords)/pest-control-near-me-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Pest Control Near Me in Moradabad',
  description:
    'Searching for pest control near me in Moradabad? MTBoss treats cockroaches, termites, bed bugs, ants, mosquitoes and rodents at homes, shops and offices. Call or WhatsApp.',
  keywords:
    'pest control near me Moradabad, pest control Moradabad, pest control services near me Moradabad, pest control company Moradabad, cockroach control near me Moradabad, termite control near me Moradabad, bed bug control near me Moradabad, mosquito control near me Moradabad, rodent control near me Moradabad, MTBoss pest control Moradabad',
  alternates: {
    canonical: 'https://www.MTBoss.in/pest-control-near-me-moradabad',
  },
  openGraph: {
    title: 'Pest Control Near Me in Moradabad',
    description:
      'Searching for pest control near me in Moradabad? MTBoss treats cockroaches, termites, bed bugs, ants, mosquitoes and rodents at homes, shops and offices. Call or WhatsApp.',
    url: 'https://www.MTBoss.in/pest-control-near-me-moradabad',
    siteName: 'MTBoss Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBoss.in/og-pest-control-near-me-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Pest Control Near Me in Moradabad - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pest Control Near Me in Moradabad',
    description:
      'Searching for pest control near me in Moradabad? MTBoss treats cockroaches, termites, bed bugs, ants, mosquitoes and rodents at homes, shops and offices. Call or WhatsApp.',
    images: ['https://www.MTBoss.in/og-pest-control-near-me-moradabad.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'GeneralContractor',
  name: 'MTBoss Construction Private Limited',
  url: 'https://www.MTBoss.in/pest-control-near-me-moradabad',
  telephone: '+91-9458410866',
  email: 'MTBoss2016@gmail.com',
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