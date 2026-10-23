// app/property/buy/page.jsx
import PropertyBuyClient from './PropertyBuyClient';

export const metadata = {
  title: 'MTBoss | Buy Verified Properties - Flats, Plots & Homes',
  description:
    'Browse verified residential flats, plots, and commercial properties for sale. 100% verified listings, transparent pricing, direct owner/agent contact.',
  keywords:
    'buy property, flats for sale, plots for sale, residential property, commercial property, verified property listings',
  alternates: {
    canonical: 'https://www.MTBoss.in/property/buy',
  },
  openGraph: {
    title: 'MTBoss | Buy Verified Properties',
    description:
      'Browse verified flats, plots, and commercial properties for sale — 100% verified, transparent pricing.',
    url: 'https://www.MTBoss.in/property/buy',
    siteName: 'MTBoss Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBoss.in/icon.png',
        width: 1200,
        height: 630,
        alt: 'Buy Property - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MTBoss | Buy Verified Properties',
    description:
      'Browse verified flats, plots, and commercial properties for sale — 100% verified, transparent pricing.',
    images: ['https://www.MTBoss.in/icon.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <PropertyBuyClient />;
}