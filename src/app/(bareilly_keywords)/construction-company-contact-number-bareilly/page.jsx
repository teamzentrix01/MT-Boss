// app/(bareilly_keywords)/construction-company-contact-number-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Construction Company Contact Number  Bareilly | MTBOSS',
  description:
    'Need a construction company contact number in Bareilly? Call or WhatsApp MTBOSS on +91 94584 10866 for site visits, estimates and building services.',
  keywords:
    'construction company contact number Bareilly, construction company phone number Bareilly, construction company near me Bareilly, building contractor contact Bareilly, civil contractor contact number Bareilly, construction company WhatsApp number Bareilly, MTBOSS Bareilly contact',
  alternates: {
    canonical:
      'https://www.mtboss.in/construction-company-contact-number-bareilly',
  },
  openGraph: {
    title:
      'Construction Company Contact Number Bareilly | MTBOSS',
    description:
      'Need a construction company contact number in Bareilly? Call or WhatsApp MTBOSS on +91 94584 10866 for site visits, estimates and building services.',
    url:
      'https://www.mtboss.in/construction-company-contact-number-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-construction-company-contact-number-bareilly.jpg',
        width: 1200,
        height: 630,
        alt:
          'Construction Company Contact Number Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Construction Company Contact Number  Bareilly | MTBOSS',
    description:
      'Need a construction company contact number in Bareilly? Call or WhatsApp MTBOSS on +91 94584 10866 for site visits, estimates and building services.',
    images: [
      'https://www.mtboss.in/og-construction-company-contact-number-bareilly.jpg',
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
    url:
      'https://www.mtboss.in/construction-company-contact-number-in-bareilly',
    telephone: '+91-9458410866',
    email: 'mtboss2016@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress:
        "Harthala Kanth Road, Behind Kr Collection, near Domino's",
      addressLocality: 'Moradabad',
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN',
    },
    areaServed: {
      '@type': 'City',
      name: 'Bareilly',
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