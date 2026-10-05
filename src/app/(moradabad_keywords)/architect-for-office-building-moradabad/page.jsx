// app/(moradabad_keywords)/architect-for-office-building-moradabad/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Architect for Office Building Moradabad | MTBOSS",
  description:
    "Need an architect for office building construction in Moradabad? MTBOSS offers design, build and material supply together. Call +91 94584 10866.",
  keywords:
    "architect for office building Moradabad, office building construction Moradabad, commercial office design Moradabad, office space architect Moradabad, corporate office construction Moradabad, office building contractor Moradabad, MTBOSS Moradabad, office interior planning Moradabad, commercial construction company Moradabad, office building cost Moradabad, MTBOSS budget calculator, office building materials Moradabad, MTBOSS Kanth Road, workspace design Moradabad, office construction quote Moradabad",
  alternates: {
    canonical: "https://www.mtboss.in/architect-for-office-building-moradabad",
  },
  openGraph: {
    title: "Architect for Office Building Moradabad | MTBOSS",
    description:
      "Need an architect for office building construction in Moradabad? MTBOSS offers design, build and material supply together. Call +91 94584 10866.",
    url: "https://www.mtboss.in/architect-for-office-building-moradabad",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-office-building-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Architect for Office Building in Moradabad - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Architect for Office Building Moradabad | MTBOSS",
    description:
      "Need an architect for office building construction in Moradabad? MTBOSS offers design, build and material supply together. Call +91 94584 10866.",
    images: ["https://www.mtboss.in/og-office-building-moradabad.jpg"],
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
    name: "MTBOSS Construction Private Limited",
    url: "https://www.mtboss.in/architect-for-office-building-moradabad",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
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
      "Office Building Construction",
      "Commercial Office Design",
      "Corporate Office Construction",
      "Office Space Planning",
      "Construction Material Supply",
      "Property Services",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Architect for Office Building Construction in Moradabad",
    description:
      "MTBOSS provides architectural design coordination, office space planning, civil construction and material supply for office building projects in Moradabad.",
    provider: {
      "@type": "GeneralContractor",
      name: "MTBOSS Construction Private Limited",
      telephone: "+91-9458410866",
      url: "https://www.mtboss.in",
    },
    areaServed: {
      "@type": "City",
      name: "Moradabad",
    },
    serviceType: "Office Building Architectural and Construction Services",
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