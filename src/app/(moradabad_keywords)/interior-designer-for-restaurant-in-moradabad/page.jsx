// app/(moradabad_keywords)/interior-designer-for-restaurant-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer for Restaurant in Moradabad | MTBoss",
  description:
    "Planning a restaurant, café or food outlet? MTBoss designs and builds restaurant interiors in Moradabad with smart layouts, durable finishes and clear pricing.",
  keywords:
    "interior designer for restaurant Moradabad, restaurant interior designer Moradabad, cafe interior designer Moradabad, food outlet interior design Moradabad, restaurant interior design company Moradabad, restaurant renovation Moradabad, commercial interior designer Moradabad, MTBoss restaurant interiors Moradabad",
  alternates: {
    canonical: "https://www.MTBoss.in/interior-designer-for-restaurant-moradabad",
  },
  openGraph: {
    title: "Interior Designer for Restaurant in Moradabad | MTBoss",
    description:
      "Planning a restaurant, café or food outlet? MTBoss designs and builds restaurant interiors in Moradabad with smart layouts, durable finishes and clear pricing.",
    url: "https://www.MTBoss.in/interior-designer-for-restaurant-moradabad",
    siteName: "MTBoss Construction Private Limited",
    images: [
      {
        url: "https://www.MTBoss.in/og-interior-designer-for-restaurant-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer for Restaurant in Moradabad - MTBoss",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Interior Designer for Restaurant in Moradabad | MTBoss",
    description:
      "Planning a restaurant, café or food outlet? MTBoss designs and builds restaurant interiors in Moradabad with smart layouts, durable finishes and clear pricing.",
    images: [
      "https://www.MTBoss.in/og-interior-designer-for-restaurant-moradabad.jpg",
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    name: "MTBoss Construction Private Limited",
    url: "https://www.MTBoss.in/interior-designer-for-restaurant-moradabad",
    telephone: "+91-9458410866",
    email: "MTBoss2016@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Harthala Kanth Road, Behind Kr Collection, near Domino's",
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