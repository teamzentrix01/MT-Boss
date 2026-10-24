// app/(moradabad_keywords)/interior-designer-for-hotel-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer for Hotel Moradabad | MTBoss Hospitality Interiors",
  description:
    "MTBoss is an interior designer for hotels in Moradabad. We plan and build lobbies, guest rooms, restaurants and banquet halls with clear pricing and on-time delivery.",
  keywords:
    "interior designer for hotel Moradabad, hotel interior designer Moradabad, hospitality interior design Moradabad, hotel renovation Moradabad, hotel room interior designer Moradabad, hotel lobby interior design Moradabad, banquet hall interior designer Moradabad, hotel restaurant interior designer Moradabad, guest house interior designer Moradabad, MTBoss hotel interiors Moradabad",
  alternates: {
    canonical: "https://www.MTBoss.in/interior-designer-for-hotel-moradabad",
  },
  openGraph: {
    title:
      "Interior Designer for Hotel Moradabad | MTBoss Hospitality Interiors",
    description:
      "MTBoss is an interior designer for hotels in Moradabad. We plan and build lobbies, guest rooms, restaurants and banquet halls with clear pricing and on-time delivery.",
    url: "https://www.MTBoss.in/interior-designer-for-hotel-moradabad",
    siteName: "MTBoss Construction Private Limited",
    images: [
      {
        url: "https://www.MTBoss.in/og-interior-designer-for-hotel-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer for Hotel in Moradabad - MTBoss",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Interior Designer for Hotel Moradabad | MTBoss Hospitality Interiors",
    description:
      "MTBoss is an interior designer for hotels in Moradabad. We plan and build lobbies, guest rooms, restaurants and banquet halls with clear pricing and on-time delivery.",
    images: [
      "https://www.MTBoss.in/og-interior-designer-for-hotel-moradabad.jpg",
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  name: "MTBoss Construction Private Limited",
  url: "https://www.MTBoss.in/interior-designer-for-hotel-moradabad",
  telephone: "+91-9458410866",
  email: "MTBoss2016@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Harthala Kanth Road, Behind Kr Collection, near Domino's",
    addressLocality: "Moradabad",
    addressRegion: "Uttar Pradesh",
    addressCountry: "IN",
    // postalCode: "ADD_PIN_CODE_HERE",
  },
  areaServed: {
    "@type": "City",
    name: "Moradabad",
  },
  priceRange: "₹₹",
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Banner />
      <Content />
      <QuickServices />
      <Services />
      <CalculatorCTA />
    </>
  );
}