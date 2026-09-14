import ConstructionCalculator from '../components/ConstructionCalculator';
import { cookies } from 'next/headers';

export const metadata = {
  title: 'MTBOSS | Free Construction Cost Calculator - Instant Estimate',
  description:
    'Calculate your construction cost instantly. Select city, plot size, floors, and finish quality to get a live BOQ breakdown of cement, steel, bricks, and labor costs.',
  keywords:
    'construction cost calculator, building cost estimator, house construction budget calculator, BOQ calculator, construction cost per sqft calculator india',
  alternates: {
    canonical: 'https://www.mtboss.in/calculator',
  },
  openGraph: {
    title: 'MTBOSS | Free Construction Cost Calculator',
    description:
      'Get an instant BOQ estimate for your home or project. Select city, size, floors and finish — live cost breakdown in seconds.',
    url: 'https://www.mtboss.in/calculator',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/icon.png',
        width: 1200,
        height: 630,
        alt: 'Free Construction Cost Calculator - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MTBOSS | Free Construction Cost Calculator',
    description:
      'Get an instant BOQ estimate for your home or project. Select city, size, floors and finish — live cost breakdown in seconds.',
    images: ['https://www.mtboss.in/icon.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const calculatorSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'MTBOSS Construction Cost Calculator',
  url: 'https://www.mtboss.in/calculator',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
  },
  provider: {
    '@type': 'GeneralContractor',
    name: 'MTBOSS Construction Private Limited',
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