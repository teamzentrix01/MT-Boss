// app/property/rent/page.jsx
import PropertyRentClient from './PropertyRentClient';

export const metadata = {
  title: 'MTBoss | List Property for Rent Free - Zero Brokerage',
  description:
    'List your property for rent free on MTBoss. Admin-verified listings, reach thousands of tenants instantly. Zero brokerage, transparent pricing.',
  keywords:
    'list property for rent free, rent out property online, sell flat for rent, zero brokerage rental listing, list rental property',
  alternates: {
    canonical: 'https://www.MTBoss.in/property/rent',
  },
  openGraph: {
    title: 'MTBoss | List Property for Rent Free',
    description:
      'List your property for rent free on MTBoss — admin-verified listings, reach thousands of tenants instantly. Zero brokerage.',
    url: 'https://www.MTBoss.in/property/rent',
    siteName: 'MTBoss Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBoss.in/icon.png',
        width: 1200,
        height: 630,
        alt: 'List Property for Rent Free - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MTBoss | List Property for Rent Free',
    description:
      'List your property for rent free on MTBoss — admin-verified listings, reach thousands of tenants instantly. Zero brokerage.',
    images: ['https://www.MTBoss.in/icon.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <PropertyRentClient />;
}