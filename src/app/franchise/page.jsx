// app/franchise/page.jsx
import FranchiseClient from './FranchiseClient';

export const metadata = {
  title: 'MTBoss | Construction Franchise Opportunity - Start Your Own Business',
  description:
    'Start a territory-based construction franchise with MTBoss. Get training, lead support, and operating guidance. Commercial details shared after eligibility review.',
  keywords:
    'construction franchise india, construction business opportunity, franchise with training support, low investment franchise, construction franchise cost',
  alternates: {
    canonical: 'https://www.MTBoss.in/franchise',
  },
  openGraph: {
    title: 'MTBoss | Construction Franchise Opportunity',
    description:
      'Start a territory-based construction franchise with MTBoss — training, lead support, and operating guidance included.',
    url: 'https://www.MTBoss.in/franchise',
    siteName: 'MTBoss Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBoss.in/icon.png',
        width: 1200,
        height: 630,
        alt: 'MTBoss Construction Franchise',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MTBoss | Construction Franchise Opportunity',
    description:
      'Start a territory-based construction franchise with MTBoss — training, lead support, and operating guidance included.',
    images: ['https://www.MTBoss.in/icon.png'],
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
    name: 'MTBoss Construction Private Limited',
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