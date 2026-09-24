// app/(moradabad_keywords)/architect-for-school-construction-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect for School in Moradabad | Design & Build',
  description:
    'Planning a school building in Moradabad? Learn what a school architect handles, design requirements & costs, plus how MTBOSS supports design-to-build execution.',
  keywords:
    'architect for school Moradabad, school building design Moradabad, school construction company Moradabad, educational institute architect near me, school building contractor Moradabad, school design and construction, institutional building architect Moradabad, MTBOSS Moradabad, school building cost Moradabad, school infrastructure contractor',
  alternates: {
    canonical: 'https://www.mtboss.in/architect-for-school-construction-in-moradabad',
  },
  openGraph: {
    title: 'Architect for School in Moradabad | Design & Build',
    description:
      'Planning a school building in Moradabad? Learn what a school architect handles, design requirements & costs, plus how MTBOSS supports design-to-build execution.',
    url: 'https://www.mtboss.in/architect-for-school-construction-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-architect-school-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect for School Construction in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect for School in Moradabad | Design & Build',
    description:
      'Planning a school building in Moradabad? Learn what a school architect handles, design requirements & costs, plus how MTBOSS supports design-to-build execution.',
    images: ['https://www.mtboss.in/og-architect-school-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/architect-for-school-construction-in-moradabad',
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