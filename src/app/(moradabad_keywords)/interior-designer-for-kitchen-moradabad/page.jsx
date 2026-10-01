// app/(moradabad_keywords)/interior-designer-for-kitchen-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer for Kitchen in Moradabad | MT Boss",
  description:
    "Need a kitchen interior designer in Moradabad? MT Boss designs modular kitchens with smart storage, durable materials and on-time delivery. Get a free quote today.",
  keywords:
    "interior designer for kitchen in Moradabad, kitchen interior designer Moradabad, modular kitchen Moradabad, kitchen designer near me, modular kitchen design Moradabad, L shaped kitchen Moradabad, U shaped kitchen Moradabad, kitchen renovation Moradabad, kitchen contractor Moradabad, kitchen interior work Moradabad, kitchen cabinets Moradabad, kitchen wardrobe and cabinet designer Moradabad, MT Boss kitchen interiors",
  alternates: {
    canonical:
      "https://www.mtboss.in/interior-designer-for-kitchen-in-moradabad",
  },
  openGraph: {
    title: "Interior Designer for Kitchen in Moradabad | MT Boss",
    description:
      "Need a kitchen interior designer in Moradabad? MT Boss designs modular kitchens with smart storage, durable materials and on-time delivery. Get a free quote today.",
    url: "https://www.mtboss.in/interior-designer-for-kitchen-in-moradabad",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-interior-designer-kitchen-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer for Kitchen in Moradabad - MT Boss",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Interior Designer for Kitchen in Moradabad | MT Boss",
    description:
      "Need a kitchen interior designer in Moradabad? MT Boss designs modular kitchens with smart storage, durable materials and on-time delivery. Get a free quote today.",
    images: [
      "https://www.mtboss.in/og-interior-designer-kitchen-moradabad.jpg",
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
  name: "MTBOSS Construction Private Limited",
  url: "https://www.mtboss.in/interior-designer-for-kitchen-in-moradabad",
  telephone: "+91-9458410866",
  email: "mtboss2016@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Harthala Kanth Road, Behind KR Collection, near Domino's",
    addressLocality: "Moradabad",
    addressRegion: "Uttar Pradesh",
    addressCountry: "IN",
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />

      <Banner />
      <Content />
      <QuickServices />
      <Services />
      <CalculatorCTA />
    </>
  );
}