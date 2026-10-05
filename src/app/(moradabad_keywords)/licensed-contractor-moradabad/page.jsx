// app/(moradabad_keywords)/licensed-contractor-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Licensed Contractor in Moradabad | MT Boss Construction",
  description:
    "Hire MT Boss, a licensed contractor in Moradabad for homes, shops, factories and roads. Registered, compliant, transparent pricing and engineer-led delivery.",
  keywords:
    "licensed contractor Moradabad, licensed civil contractor Moradabad, registered construction company Moradabad, GST registered contractor Moradabad, government registered contractor Moradabad, compliant contractor Moradabad, building contractor Moradabad, civil contractor Moradabad, construction company Moradabad, MT Boss licensed contractor Moradabad",
  alternates: {
    canonical: "https://www.mtboss.in/licensed-contractor-moradabad",
  },
  openGraph: {
    title: "Licensed Contractor in Moradabad | MT Boss Construction",
    description:
      "Hire MT Boss, a licensed contractor in Moradabad for homes, shops, factories and roads. Registered, compliant, transparent pricing and engineer-led delivery.",
    url: "https://www.mtboss.in/licensed-contractor-moradabad",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-licensed-contractor-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Licensed Contractor in Moradabad - MT Boss Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Licensed Contractor in Moradabad | MT Boss Construction",
    description:
      "Hire MT Boss, a licensed contractor in Moradabad for homes, shops, factories and roads. Registered, compliant, transparent pricing and engineer-led delivery.",
    images: ["https://www.mtboss.in/og-licensed-contractor-moradabad.jpg"],
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
  url: "https://www.mtboss.in/licensed-contractor-moradabad",
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