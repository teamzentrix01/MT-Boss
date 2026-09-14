// app/franchise/page.jsx
import FranchiseClient from './FranchiseClient';

export const metadata = {
  title: 'MTBOSS | Construction Franchise Opportunity - Start Your Own Business',
  description:
    'Start a territory-based construction franchise with MTBOSS. Get training, lead support, and operating guidance. Commercial details shared after eligibility review.',
  keywords:
    'construction franchise india, construction business opportunity, franchise with training support, low investment franchise, construction franchise cost',
  alternates: {
    canonical: 'https://www.mtboss.in/franchise',
  },
  openGraph: {
    title: 'MTBOSS | Construction Franchise Opportunity',
    description:
      'Start a territory-based construction franchise with MTBOSS — training, lead support, and operating guidance included.',
    url: 'https://www.mtboss.in/franchise',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/icon.png',
        width: 1200,
        height: 630,
        alt: 'MTBOSS Construction Franchise',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MTBOSS | Construction Franchise Opportunity',
    description:
      'Start a territory-based construction franchise with MTBOSS — training, lead support, and operating guidance included.',
    images: ['https://www.mtboss.in/icon.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const franchiseSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Franchise Opportunity',
  provider: {
    '@type': 'GeneralContractor',
    name: 'MTBOSS Construction Private Limited',
  },
  description:
    'Territory-based construction franchise with training, lead support, and operating guidance. Commercials shared after eligibility review.',
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(franchiseSchema) }} />
      <FranchiseClient />
    </>
  );
}