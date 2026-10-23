import ConstructionCalculator from '../components/ConstructionCalculator';
import { cookies } from 'next/headers';

export const metadata = {
  title: 'MTBoss | Free Construction Cost Calculator - Instant Estimate',
  description:
    'Calculate your construction cost instantly. Select city, plot size, floors, and finish quality to get a live BOQ breakdown of cement, steel, bricks, and labor costs.',
  keywords:
    'construction cost calculator, building cost estimator, house construction budget calculator, BOQ calculator, construction cost per sqft calculator india',
  alternates: {
    canonical: 'https://www.MTBoss.in/calculator',
  },
  openGraph: {
    title: 'MTBoss | Free Construction Cost Calculator',
    description:
      'Get an instant BOQ estimate for your home or project. Select city, size, floors and finish — live cost breakdown in seconds.',
    url: 'https://www.MTBoss.in/calculator',
    siteName: 'MTBoss Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBoss.in/icon.png',
        width: 1200,
        height: 630,
        alt: 'Free Construction Cost Calculator - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MTBoss | Free Construction Cost Calculator',
    description:
      'Get an instant BOQ estimate for your home or project. Select city, size, floors and finish — live cost breakdown in seconds.',
    images: ['https://www.MTBoss.in/icon.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const calculatorSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'MTBoss Construction Cost Calculator',
  url: 'https://www.MTBoss.in/calculator',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
  },
  provider: {
    '@type': 'GeneralContractor',
    name: 'MTBoss Construction Private Limited',
  },
};

export default async function CalculatorPage() {
  const cookieStore = await cookies();
  const isAuthenticated = Boolean(cookieStore.get('auth-token')?.value);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorSchema) }}
      />
      <ConstructionCalculator initialIsLoggedIn={isAuthenticated} />
    </>
  );
}