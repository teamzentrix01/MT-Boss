// app/(moradabad_keywords)/bed-bug-treatment-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Bed Bug Treatment in Moradabad | MTBoss',
  description:
    'Bed bug treatment in Moradabad by MTBoss. Inspection, targeted treatment for beds, sofas and rooms, plus follow-up. Call or WhatsApp +91 94584 10866.',
  keywords:
    'bed bug treatment Moradabad, bed bugs control Moradabad, bed bug pest control Moradabad, bed bug removal Moradabad, bed bug treatment near me Moradabad, bed bug treatment for hotels Moradabad, bed bug treatment for hostels Moradabad, bed bug treatment for PG Moradabad, mattress bed bug treatment Moradabad, MTBoss bed bug treatment Moradabad',
  alternates: {
    canonical: 'https://www.MTBoss.in/bed-bug-treatment-moradabad',
  },
  openGraph: {
    title: 'Bed Bug Treatment in Moradabad | MTBoss',
    description:
      'Bed bug treatment in Moradabad by MTBoss. Inspection, targeted treatment for beds, sofas and rooms, plus follow-up. Call or WhatsApp +91 94584 10866.',
    url: 'https://www.MTBoss.in/bed-bug-treatment-moradabad',
    siteName: 'MTBoss Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBoss.in/og-bed-bug-treatment-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Bed Bug Treatment in Moradabad - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bed Bug Treatment in Moradabad | MTBoss',
    description:
      'Bed bug treatment in Moradabad by MTBoss. Inspection, targeted treatment for beds, sofas and rooms, plus follow-up. Call or WhatsApp +91 94584 10866.',
    images: ['https://www.MTBoss.in/og-bed-bug-treatment-moradabad.jpg'],
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
  url: 'https://www.MTBoss.in/bed-bug-treatment-moradabad',
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