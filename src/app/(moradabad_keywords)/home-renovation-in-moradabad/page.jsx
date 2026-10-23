// app/(moradabad_keywords)/home-renovation-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Home Renovation in Moradabad | MTBoss',
  description:
    'Planning a home renovation in Moradabad? MTBoss handles repair, remodelling, waterproofing, flooring, interiors and finishing, with clear quotes. Call +91 94584 10866.',
  keywords:
    'home renovation Moradabad, house renovation Moradabad, home remodelling Moradabad, renovation contractor Moradabad, home repair Moradabad, waterproofing Moradabad, flooring contractor Moradabad, interior renovation Moradabad, home finishing Moradabad, bathroom renovation Moradabad, kitchen renovation Moradabad, MTBoss renovation Moradabad',
  alternates: {
    canonical: 'https://www.MTBoss.in/home-renovation-moradabad',
  },
  openGraph: {
    title: 'Home Renovation in Moradabad | MTBoss',
    description:
      'Planning a home renovation in Moradabad? MTBoss handles repair, remodelling, waterproofing, flooring, interiors and finishing, with clear quotes. Call +91 94584 10866.',
    url: 'https://www.MTBoss.in/home-renovation-moradabad',
    siteName: 'MTBoss Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBoss.in/og-home-renovation-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Home Renovation in Moradabad - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home Renovation in Moradabad | MTBoss',
    description:
      'Planning a home renovation in Moradabad? MTBoss handles repair, remodelling, waterproofing, flooring, interiors and finishing, with clear quotes. Call +91 94584 10866.',
    images: ['https://www.MTBoss.in/og-home-renovation-moradabad.jpg'],
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
  url: 'https://www.MTBoss.in/home-renovation-moradabad',
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