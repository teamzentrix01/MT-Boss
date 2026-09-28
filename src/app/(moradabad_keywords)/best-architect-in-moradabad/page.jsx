// app/(moradabad_keywords)/best-architect-in-moradabad/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Best Architect in Moradabad: How to Choose | MTBOSS",
  description:
    "Wondering who is the best architect in Moradabad? Learn what to check before hiring, and how MTBOSS offers design, construction and materials in one place. Call +91 94584 10866.",
  keywords:
    "best architect in Moradabad, top architect in Moradabad, best architect near me Moradabad, best house architect Moradabad, best commercial architect Moradabad, how to choose architect Moradabad, architect fees Moradabad, architect and builder Moradabad, house plan Moradabad, building design Moradabad, construction company Moradabad, MTBOSS construction Moradabad, trusted architect Moradabad, affordable architect Moradabad, architect consultation Moradabad",
  alternates: {
    canonical: "https://www.mtboss.in/best-architect-in-moradabad",
  },
  openGraph: {
    title: "Best Architect in Moradabad: How to Choose | MTBOSS",
    description:
      "Wondering who is the best architect in Moradabad? Learn what to check before hiring, and how MTBOSS offers design, construction and materials in one place. Call +91 94584 10866.",
    url: "https://www.mtboss.in/best-architect-in-moradabad",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-best-architect-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Best Architect in Moradabad - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Architect in Moradabad: How to Choose | MTBOSS",
    description:
      "Wondering who is the best architect in Moradabad? Learn what to check before hiring, and how MTBOSS offers design, construction and materials in one place. Call +91 94584 10866.",
    images: ["https://www.mtboss.in/og-best-architect-moradabad.jpg"],
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
    url: "https://www.mtboss.in/best-architect-in-moradabad",
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
      "Architectural Design",
      "Residential Construction",
      "Commercial Construction",
      "Industrial Construction",
      "Hospitality Construction",
      "Construction Material Supply",
      "Property Services",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Architect Selection and Construction Services in Moradabad",
    description:
      "MTBOSS provides guidance on choosing the right architect, along with architectural design coordination, construction execution and material supply for residential, commercial and industrial projects in Moradabad.",
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
    serviceType: "Architectural and Construction Services",
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