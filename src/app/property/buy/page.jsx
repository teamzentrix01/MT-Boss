// app/property/buy/page.jsx
import PropertyBuyClient from './PropertyBuyClient';

export const metadata = {
  title: 'MTBOSS | Buy Verified Properties - Flats, Plots & Homes',
  description:
    'Browse verified residential flats, plots, and commercial properties for sale. 100% verified listings, transparent pricing, direct owner/agent contact.',
  keywords:
    'buy property, flats for sale, plots for sale, residential property, commercial property, verified property listings',
  alternates: {
    canonical: 'https://www.mtboss.in/property/buy',
  },
  openGraph: {
    title: 'MTBOSS | Buy Verified Properties',
    description:
      'Browse verified flats, plots, and commercial properties for sale — 100% verified, transparent pricing.',
    url: 'https://www.mtboss.in/property/buy',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/icon.png',
        width: 1200,
        height: 630,
        alt: 'Buy Property - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MTBOSS | Buy Verified Properties',
    description:
      'Browse verified flats, plots, and commercial properties for sale — 100% verified, transparent pricing.',
    images: ['https://www.mtboss.in/icon.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <PropertyBuyClient />;
}