// app/agent/page.jsx
import AgentClient from './AgentClient';

export const metadata = {
  title: 'MTBOSS | Become an Agent - Earn Up to 3% Commission Per Project',
  description:
    'Join MTBOSS agent network — refer property buyers, construction clients, or franchise partners and earn high commissions. Free to join, fast 7-day payouts, full training provided.',
  keywords:
    'become an agent, real estate agent commission, construction referral agent, franchise agent, earn commission referring clients, MTBOSS agent registration',
  alternates: {
    canonical: 'https://www.mtboss.in/agent',
  },
  openGraph: {
    title: 'MTBOSS | Become an Agent - Earn Up to 3% Commission Per Project',
    description:
      'Refer property buyers, construction clients, or franchise partners and earn high commissions. Free to join, 7-day payouts, full training provided.',
    url: 'https://www.mtboss.in/agent',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/icon.png',
        width: 1200,
        height: 630,
        alt: 'Become an MTBOSS Agent',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MTBOSS | Become an Agent - Earn Up to 3% Commission Per Project',
    description:
      'Refer property buyers, construction clients, or franchise partners and earn high commissions. Free to join, 7-day payouts, full training provided.',
    images: ['https://www.mtboss.in/icon.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <AgentClient />;
}