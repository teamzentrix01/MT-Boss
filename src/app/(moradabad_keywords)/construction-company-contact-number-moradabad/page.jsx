// app/(moradabad_keywords)/construction-company-contact-number-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Construction Company Contact Number Moradabad | MT Boss",
  description:
    "Need a construction company contact number in Moradabad? Call or WhatsApp MT Boss on +91 94584 10866 for quotes, site visits and civil, home and industrial projects.",
  keywords:
    "construction company contact number Moradabad, construction company phone number Moradabad, builder contact number Moradabad, civil contractor contact number Moradabad, construction company near me Moradabad, MT Boss contact number Moradabad, construction quote Moradabad, building contractor contact Moradabad, construction company WhatsApp Moradabad, construction office Moradabad",
  alternates: {
    canonical:
      "https://www.mtboss.in/construction-company-contact-number-moradabad",
  },
  openGraph: {
    title: "Construction Company Contact Number Moradabad | MT Boss",
    description:
      "Need a construction company contact number in Moradabad? Call or WhatsApp MT Boss on +91 94584 10866 for quotes, site visits and civil, home and industrial projects.",
    url:
      "https://www.mtboss.in/construction-company-contact-number-moradabad",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-construction-company-contact-number-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Construction Company Contact Number in Moradabad - MT Boss",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Construction Company Contact Number Moradabad | MT Boss",
    description:
      "Need a construction company contact number in Moradabad? Call or WhatsApp MT Boss on +91 94584 10866 for quotes, site visits and civil, home and industrial projects.",
    images: [
      "https://www.mtboss.in/og-construction-company-contact-number-moradabad.jpg",
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
  url: "https://www.mtboss.in/construction-company-contact-number-moradabad",
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