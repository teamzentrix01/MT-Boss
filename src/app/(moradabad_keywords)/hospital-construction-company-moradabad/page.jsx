// app/(moradabad_keywords)/hospital-construction-company-in-moradabad/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Hospital Construction Company in Moradabad | MTBoss",
  description:
    "Need a hospital construction company in Moradabad for civil work and materials? MTBoss supports structural build and supply. Call +91 94584 10866.",
  keywords:
    "hospital construction company Moradabad, healthcare building construction Moradabad, hospital civil contractor Moradabad, medical building construction Moradabad, clinic construction Moradabad, hospital building materials Moradabad, MTBoss Moradabad, hospital construction cost Moradabad, MTBoss budget calculator, nursing home construction Moradabad, MTBoss Kanth Road, healthcare infrastructure Moradabad, hospital building contractor UP, hospital construction quote Moradabad, MTBoss commercial construction",
  alternates: {
    canonical: "https://www.MTBoss.in/hospital-construction-company-in-moradabad",
  },
  openGraph: {
    title: "Hospital Construction Company in Moradabad | MTBoss",
    description:
      "Need a hospital construction company in Moradabad for civil work and materials? MTBoss supports structural build and supply. Call +91 94584 10866.",
    url: "https://www.MTBoss.in/hospital-construction-company-in-moradabad",
    siteName: "MTBoss Construction Private Limited",
    images: [
      {
        url: "https://www.MTBoss.in/og-hospital-construction-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Hospital Construction Company in Moradabad - MTBoss Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hospital Construction Company in Moradabad | MTBoss",
    description:
      "Need a hospital construction company in Moradabad for civil work and materials? MTBoss supports structural build and supply. Call +91 94584 10866.",
    images: [
      "https://www.MTBoss.in/og-hospital-construction-moradabad.jpg",
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
    url: "https://www.MTBoss.in/hospital-construction-company-in-moradabad",
    telephone: "+91-9458410866",
    email: "MTBoss2016@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Harthala Kanth Road, Behind KR Collection, near Domino's",
      addressLocality: "Moradabad",
      addressRegion: "Uttar Pradesh",
      addressCountry: "IN",
    },
    areaServed: [
      {
        "@type": "City",
        name: "Moradabad",
      },
      {
        "@type": "State",
        name: "Uttar Pradesh",
      },
    ],
    priceRange: "₹₹",
    serviceType: [
      "Hospital Construction",
      "Healthcare Building Construction",
      "Medical Building Construction",
      "Clinic Construction",
      "Nursing Home Construction",
      "Construction Material Supply",
      "Property Services",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Hospital Construction Company in Moradabad",
    description:
      "MTBoss provides civil construction, structural build and wholesale material supply for hospital, clinic, nursing home and healthcare facility projects in Moradabad.",
    provider: {
      "@type": "GeneralContractor",
      name: "MTBoss Construction Private Limited",
      telephone: "+91-9458410866",
      url: "https://www.MTBoss.in",
    },
    areaServed: {
      "@type": "City",
      name: "Moradabad",
    },
    serviceType: "Hospital and Healthcare Building Civil Construction Services",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
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