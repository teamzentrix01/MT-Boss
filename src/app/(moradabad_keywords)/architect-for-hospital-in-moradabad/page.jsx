// app/(moradabad_keywords)/architect-for-hospital-construction-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect for Hospital in Moradabad | Design & Build',
  description:
    'Planning a hospital or clinic in Moradabad? Learn what healthcare facility design involves, compliance needs, costs, and how MTBOSS supports construction execution.',
  keywords:
    'architect for hospital Moradabad, hospital design and construction Moradabad, hospital building contractor Moradabad, healthcare facility architect near me, clinic construction company Moradabad, hospital building cost Moradabad, medical facility construction Moradabad, MTBOSS Moradabad, hospital infrastructure contractor, nursing home construction Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/architect-for-hospital-construction-in-moradabad',
  },
  openGraph: {
    title: 'Architect for Hospital in Moradabad | Design & Build',
    description:
      'Planning a hospital or clinic in Moradabad? Learn what healthcare facility design involves, compliance needs, costs, and how MTBOSS supports construction execution.',
    url: 'https://www.mtboss.in/architect-for-hospital-construction-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-architect-hospital-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect for Hospital Construction in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect for Hospital in Moradabad | Design & Build',
    description:
      'Planning a hospital or clinic in Moradabad? Learn what healthcare facility design involves, compliance needs, costs, and how MTBOSS supports construction execution.',
    images: ['https://www.mtboss.in/og-architect-hospital-moradabad.jpg'],
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
    url: 'https://www.mtboss.in/architect-for-hospital-construction-in-moradabad',
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