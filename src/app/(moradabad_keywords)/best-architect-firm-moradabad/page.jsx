// app/(moradabad_keywords)/best-architect-firm-in-moradabad/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Best Architect Firm in Moradabad | MTBOSS Construction",
  description:
    "Searching for the best architect firm in Moradabad? MTBOSS offers design, construction and material supply together. Call +91 94584 10866 for a quote.",
  keywords:
    "best architect firm Moradabad, top architect firm Moradabad, architect and construction firm Moradabad, best construction company Moradabad, MTBOSS Moradabad, architect firm near me Moradabad, design and build firm Moradabad, MTBOSS budget calculator, MTBOSS Kanth Road, commercial construction firm Moradabad, residential construction firm Moradabad, trusted construction company Moradabad, architect firm reviews Moradabad, construction quote Moradabad, MTBOSS project gallery",
  alternates: {
    canonical: "https://www.mtboss.in/best-architect-firm-in-moradabad",
  },
  openGraph: {
    title: "Best Architect Firm in Moradabad | MTBOSS Construction",
    description:
      "Searching for the best architect firm in Moradabad? MTBOSS offers design, construction and material supply together. Call +91 94584 10866 for a quote.",
    url: "https://www.mtboss.in/best-architect-firm-in-moradabad",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-best-architect-firm-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Best Architect Firm in Moradabad - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Architect Firm in Moradabad | MTBOSS Construction",
    description:
      "Searching for the best architect firm in Moradabad? MTBOSS offers design, construction and material supply together. Call +91 94584 10866 for a quote.",
    images: [
      "https://www.mtboss.in/og-best-architect-firm-moradabad.jpg",
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
    url: "https://www.mtboss.in/best-architect-firm-in-moradabad",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "Harthala Kanth Road, Behind KR Collection, near Domino's",
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
    name: "Best Architect and Construction Firm in Moradabad",
    description:
      "MTBOSS provides architectural design coordination, civil construction, wholesale material supply and property services for residential, commercial and industrial projects in Moradabad.",
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
    serviceType:
      "Architectural Design and Construction Services",
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