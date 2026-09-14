// app/services/page.jsx  (naya folder: "services" lowercase, purane "Services" ko yahan 301 redirect karo)
import ServicesClient from './ServicesClient';

export const metadata = {
  title: 'MTBOSS | Construction Services - Commercial, Residential & Hotel Projects',
  description:
    'Explore MTBOSS construction services — commercial buildings, hotel & hospitality projects, residential construction, and industrial infrastructure. 22+ years of engineering excellence.',
  keywords:
    'construction services, commercial construction, residential construction, hotel construction, industrial construction, construction company, turnkey construction',
  alternates: {
    canonical: 'https://www.mtboss.in/services/all',
  },
  openGraph: {
    title: 'MTBOSS | Construction Services - Commercial, Residential & Hotel Projects',
    description:
      'Commercial buildings, hotel & hospitality projects, residential construction, and industrial infrastructure — built with engineering excellence.',
    url: 'https://www.mtboss.in/services/all',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/icon.png',
        width: 1200,
        height: 630,
        alt: 'Construction Services - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MTBOSS | Construction Services - Commercial, Residential & Hotel Projects',
    description:
      'Commercial buildings, hotel & hospitality projects, residential construction, and industrial infrastructure — built with engineering excellence.',
    images: ['https://www.mtboss.in/icon.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const constructionServicesSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Construction Services',
  provider: {
    '@type': 'GeneralContractor',
    name: 'MTBOSS Construction Private Limited',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Construction Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Commercial Buildings' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Hotel & Hospitality Construction' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Residential Projects' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Industrial & Warehousing' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Infrastructure & Roads' } },
    ],
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(constructionServicesSchema) }}
      />
      <ServicesClient />
    </>
  );
}