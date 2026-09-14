// app/contact/page.jsx
import ContactClient from './ContactClient';

export const metadata = {
  title: 'MTBOSS | Contact Us - Get a Free Quote in 24 Hours',
  description:
    'Get in touch with MTBOSS for construction projects, property inquiries, franchise opportunities, or agent registration. Response within 24 hours across all our office locations.',
  keywords:
    'contact construction company, get construction quote, MTBOSS contact, construction company phone number, franchise inquiry contact',
  alternates: {
    canonical: 'https://www.mtboss.in/contact',
  },
  openGraph: {
    title: 'MTBOSS | Contact Us - Get a Free Quote in 24 Hours',
    description:
      'Construction, property, franchise, or agent inquiries — we respond within 24 hours.',
    url: 'https://www.mtboss.in/contact',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/icon.png',
        width: 1200,
        height: 630,
        alt: 'Contact MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MTBOSS | Contact Us - Get a Free Quote in 24 Hours',
    description:
      'Construction, property, franchise, or agent inquiries — we respond within 24 hours.',
    images: ['https://www.mtboss.in/icon.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const contactPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact MTBOSS',
  url: 'https://www.mtboss.in/contact',
  mainEntity: {
    '@type': 'GeneralContractor',
    name: 'MTBOSS Construction Private Limited',
    telephone: '+91-9458410866',
    email: 'mtboss2016@gmail.com',
    // Real addresses milne ke baad, har office ke liye ek "location" object daal denge yahan (LocalBusiness array)
  },
};
export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }} />
      <ContactClient />
    </>
  );
}