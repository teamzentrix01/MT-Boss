// app/(moradabad_keywords)/architect-for-petrol-pump-in-moradabad/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Architect for Petrol Pump in Moradabad | MTBOSS Construction",
  description:
    "Looking for an experienced architect for petrol pump construction in Moradabad? MTBOSS offers complete design, layout planning, PESO-compliant construction and material supply. Call +91 94584 10866.",
  keywords:
    "architect for petrol pump Moradabad, petrol pump construction Moradabad, petrol pump architect near me, petrol pump design company Moradabad, fuel station architect India, petrol pump layout planning, PESO approved petrol pump design, petrol pump civil contractor Moradabad, petrol pump canopy design, MTBOSS construction Moradabad, petrol pump construction cost Moradabad, best architect Moradabad, commercial architect Moradabad, petrol pump building contractor UP",
  alternates: {
    canonical: "https://www.mtboss.in/architect-for-petrol-pump-in-moradabad",
  },
  openGraph: {
    title: "Architect for Petrol Pump in Moradabad | MTBOSS Construction",
    description:
      "Looking for an experienced architect for petrol pump construction in Moradabad? MTBOSS offers complete design, layout planning, PESO-compliant construction and material supply. Call +91 94584 10866.",
    url: "https://www.mtboss.in/architect-for-petrol-pump-in-moradabad",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-architect-petrol-pump-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Architect for Petrol Pump Construction in Moradabad - MTBOSS",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Architect for Petrol Pump in Moradabad | MTBOSS Construction",
    description:
      "Looking for an experienced architect for petrol pump construction in Moradabad? MTBOSS offers complete design, layout planning, PESO-compliant construction and material supply. Call +91 94584 10866.",
    images: [
      "https://www.mtboss.in/og-architect-petrol-pump-moradabad.jpg",
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
    name: "MTBOSS Construction Private Limited",
    url: "https://www.mtboss.in/architect-for-petrol-pump-in-moradabad",
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
    priceRange: "₹₹₹",
    serviceType: [
      "Petrol Pump Construction",
      "Fuel Station Layout Planning",
      "Commercial Construction",
      "Canopy Construction",
      "Civil Construction",
      "Construction Material Supply",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Petrol Pump Design and Construction in Moradabad",
    description:
      "MTBOSS provides petrol pump layout planning, civil construction, canopy construction, material supply, and support for compliance documentation in Moradabad.",
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
    serviceType: "Petrol Pump Construction",
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