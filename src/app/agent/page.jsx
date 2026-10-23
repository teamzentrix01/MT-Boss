// app/agent/page.jsx
import AgentClient from './AgentClient';

export const metadata = {
  title: 'MTBoss | Become an Agent - Earn Up to 3% Commission Per Project',
  description:
    'Join MTBoss agent network — refer property buyers, construction clients, or franchise partners and earn high commissions. Free to join, fast 7-day payouts, full training provided.',
  keywords:
    'become an agent, real estate agent commission, construction referral agent, franchise agent, earn commission referring clients, MTBoss agent registration',
  alternates: {
    canonical: 'https://www.MTBoss.in/agent',
  },
  openGraph: {
    title: 'MTBoss | Become an Agent - Earn Up to 3% Commission Per Project',
    description:
      'Refer property buyers, construction clients, or franchise partners and earn high commissions. Free to join, 7-day payouts, full training provided.',
    url: 'https://www.MTBoss.in/agent',
    siteName: 'MTBoss Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBoss.in/icon.png',
        width: 1200,
        height: 630,
        alt: 'Become an MTBoss Agent',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MTBoss | Become an Agent - Earn Up to 3% Commission Per Project',
    description:
      'Refer property buyers, construction clients, or franchise partners and earn high commissions. Free to join, 7-day payouts, full training provided.',
    images: ['https://www.MTBoss.in/icon.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <AgentClient />;
}