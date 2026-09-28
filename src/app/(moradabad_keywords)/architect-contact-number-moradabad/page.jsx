// app/(moradabad_keywords)/architect-contact-number-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect Contact Number Moradabad | MTBOSS',
  description:
    "Need an architect's contact number in Moradabad? Call, email or WhatsApp MTBOSS for design and construction queries — get a fast, free quote today!",
  keywords:
    'architect contact number Moradabad, architect phone number near me, house design contact number, architect whatsapp number Moradabad, design company contact number, architect email address Moradabad, architect helpline near me, MTBOSS contact number, architect near me phone number, design consultation contact number',
  alternates: {
    canonical: 'https://www.mtboss.in/architect-contact-number-in-moradabad',
  },
  openGraph: {
    title: 'Architect Contact Number Moradabad | MTBOSS',
    description:
      "Need an architect's contact number in Moradabad? Call, email or WhatsApp MTBOSS for design and construction queries — get a fast, free quote today!",
    url: 'https://www.mtboss.in/architect-contact-number-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-architect-contact-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect Contact Number in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect Contact Number Moradabad | MTBOSS',
    description:
      "Need an architect's contact number in Moradabad? Call, email or WhatsApp MTBOSS for design and construction queries — get a fast, free quote today!",
    images: ['https://www.mtboss.in/og-architect-contact-moradabad.jpg'],
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
    url: 'https://www.mtboss.in/architect-contact-number-in-moradabad',
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