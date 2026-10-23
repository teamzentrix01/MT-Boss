// app/(moradabad_keywords)/experienced-civil-contractor-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Experienced Civil Contractor in Moradabad | MTBoss",
  description:
    "Hire MTBoss, an experienced civil contractor in Moradabad for homes, shops, factories and roads. Engineer-led work, transparent pricing and on-time delivery.",
  keywords:
    "experienced civil contractor Moradabad, civil contractor Moradabad, building contractor Moradabad, engineer supervised construction Moradabad, house construction contractor Moradabad, commercial construction contractor Moradabad, industrial contractor Moradabad, road contractor Moradabad, civil work company Moradabad, MTBoss civil contractor",
  alternates: {
    canonical:
      "https://www.MTBoss.in/experienced-civil-contractor-moradabad",
  },
  openGraph: {
    title: "Experienced Civil Contractor in Moradabad | MTBoss",
    description:
      "Hire MTBoss, an experienced civil contractor in Moradabad for homes, shops, factories and roads. Engineer-led work, transparent pricing and on-time delivery.",
    url: "https://www.MTBoss.in/experienced-civil-contractor-moradabad",
    siteName: "MTBoss Construction Private Limited",
    images: [
      {
        url: "https://www.MTBoss.in/og-experienced-civil-contractor-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Experienced Civil Contractor in Moradabad - MTBoss",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Experienced Civil Contractor in Moradabad | MTBoss",
    description:
      "Hire MTBoss, an experienced civil contractor in Moradabad for homes, shops, factories and roads. Engineer-led work, transparent pricing and on-time delivery.",
    images: [
      "https://www.MTBoss.in/og-experienced-civil-contractor-moradabad.jpg",
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
  url: "https://www.MTBoss.in/experienced-civil-contractor-moradabad",
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