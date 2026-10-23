// app/(bareilly_keywords)/architect-contact-number-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect Contact Number Bareilly | MTBoss',
  description:
    'Need an architect contact number in Bareilly? Call or WhatsApp MTBoss on +91 94584 10866 for house, shop and building design, with site visits and clear proposals.',
  keywords:
    'architect contact number Bareilly, architect number Bareilly, architect phone number Bareilly, architect WhatsApp number Bareilly, architect contact Bareilly, architect near me Bareilly, architect in Bareilly contact, house architect contact number Bareilly, building architect Bareilly contact, MTBoss Bareilly contact, MTBoss architect contact number, architect Bareilly',
  alternates: {
    canonical: 'https://www.MTBoss.in/architect-contact-number-bareilly',
  },
  openGraph: {
    title: 'Architect Contact Number Bareilly | MTBoss',
    description:
      'Need an architect contact number in Bareilly? Call or WhatsApp MTBoss on +91 94584 10866 for house, shop and building design, with site visits and clear proposals.',
    url: 'https://www.MTBoss.in/architect-contact-number-bareilly',
    siteName: 'MTBoss Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBoss.in/og-architect-contact-number-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect Contact Number Bareilly - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect Contact Number Bareilly | MTBoss',
    description:
      'Need an architect contact number in Bareilly? Call or WhatsApp MTBoss on +91 94584 10866 for house, shop and building design, with site visits and clear proposals.',
    images: [
      'https://www.MTBoss.in/og-architect-contact-number-bareilly.jpg',
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
    name: 'MTBoss Construction Private Limited',
    url: 'https://www.MTBoss.in/architect-contact-number-bareilly',
    telephone: '+91-9458410866',
    email: 'MTBoss2016@gmail.com',
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