// app/property/sell/page.jsx
import PropertySellClient from './PropertySellClient';

export const metadata = {
  title: 'MTBoss | Sell Your Property Free - List in 3 Easy Steps',
  description:
    'List your property for sale free on MTBoss. Admin-verified listings, reach thousands of serious buyers instantly. No brokerage, fast approval.',
  keywords:
    'sell property free, list property online free, sell flat online, sell plot online, no brokerage property listing, list property for sale',
  alternates: {
    canonical: 'https://www.MTBoss.in/property/sell',
  },
  openGraph: {
    title: 'MTBoss | Sell Your Property Free',
    description:
      'List your property for sale free on MTBoss — admin-verified listings, reach thousands of serious buyers instantly.',
    url: 'https://www.MTBoss.in/property/sell',
    siteName: 'MTBoss Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBoss.in/icon.png',
        width: 1200,
        height: 630,
        alt: 'Sell Property Free - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MTBoss | Sell Your Property Free',
    description:
      'List your property for sale free on MTBoss — admin-verified listings, reach thousands of serious buyers instantly.',
    images: ['https://www.MTBoss.in/icon.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <PropertySellClient />;
}