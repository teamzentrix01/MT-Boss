// app/(moradabad_keywords)/affordable-civil-contractor-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Affordable Civil Contractor in Moradabad | MT Boss",
  description:
    "Looking for an affordable civil contractor in Moradabad? MT Boss offers transparent pricing, smart budgeting and quality civil work for homes, shops and factories.",
  keywords:
    "affordable civil contractor Moradabad, budget civil contractor Moradabad, low cost construction contractor Moradabad, economical building contractor Moradabad, affordable house construction Moradabad, affordable commercial construction Moradabad, civil work contractor Moradabad, construction cost estimate Moradabad, MT Boss civil contractor Moradabad",
  alternates: {
    canonical:
      "https://www.mtboss.in/affordable-civil-contractor-moradabad",
  },
  openGraph: {
    title: "Affordable Civil Contractor in Moradabad | MT Boss",
    description:
      "Looking for an affordable civil contractor in Moradabad? MT Boss offers transparent pricing, smart budgeting and quality civil work for homes, shops and factories.",
    url: "https://www.mtboss.in/affordable-civil-contractor-moradabad",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-affordable-civil-contractor-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Affordable Civil Contractor in Moradabad - MT Boss",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Affordable Civil Contractor in Moradabad | MT Boss",
    description:
      "Looking for an affordable civil contractor in Moradabad? MT Boss offers transparent pricing, smart budgeting and quality civil work for homes, shops and factories.",
    images: [
      "https://www.mtboss.in/og-affordable-civil-contractor-moradabad.jpg",
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
  url: "https://www.mtboss.in/affordable-civil-contractor-moradabad",
  telephone: "+91-9458410866",
  email: "mtboss2016@gmail.com",
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