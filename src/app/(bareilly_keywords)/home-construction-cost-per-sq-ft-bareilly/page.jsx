// app/(bareilly_keywords)/home-construction-cost-per-sq-ft-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Home Construction Cost per Sq Ft Bareilly | MTBoss',
  description:
    'Planning a home in Bareilly? Understand construction cost per sq ft, what the rate covers, what pushes it up and how MTBoss gives itemised estimates.',
  keywords:
    'home construction cost per sq ft Bareilly, house construction cost Bareilly, construction rate per sq ft Bareilly, home construction budget Bareilly, house construction estimate Bareilly, residential construction cost Bareilly, building cost per sq ft Bareilly, MTBoss Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/home-construction-cost-per-sq-ft-bareilly',
  },
  openGraph: {
    title: 'Home Construction Cost per Sq Ft Bareilly | MTBoss',
    description:
      'Planning a home in Bareilly? Understand construction cost per sq ft, what the rate covers, what pushes it up and how MTBoss gives itemised estimates.',
    url:
      'https://www.mtboss.in/home-construction-cost-per-sq-ft-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-home-construction-cost-per-sq-ft-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Home Construction Cost per Sq Ft Bareilly - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home Construction Cost per Sq Ft Bareilly | MTBoss',
    description:
      'Planning a home in Bareilly? Understand construction cost per sq ft, what the rate covers, what pushes it up and how MTBoss gives itemised estimates.',
    images: [
      'https://www.mtboss.in/og-home-construction-cost-per-sq-ft-bareilly.jpg',
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
      'https://www.mtboss.in/home-construction-cost-per-sq-ft-bareilly',
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