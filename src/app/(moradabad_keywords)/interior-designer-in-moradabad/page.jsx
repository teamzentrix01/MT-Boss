// app/(moradabad_keywords)/interior-designer-in-moradabad/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer in Moradabad | MTBOSS",
  description:
    "Looking for an interior designer in Moradabad? MTBOSS offers home, office and modular kitchen interiors along with construction. Call +91 94584 10866.",
  keywords:
    "interior designer in Moradabad, interior design company Moradabad, modular kitchen design Moradabad, home interior designer Moradabad, office interior designer Moradabad, bungalow interior design Moradabad, MTBOSS Moradabad, interior decoration Moradabad, affordable interior designer Moradabad, MTBOSS budget calculator, interior design and construction Moradabad, MTBOSS Kanth Road, false ceiling design Moradabad, interior design quote Moradabad, MTBOSS interior projects",
  alternates: {
    canonical: "https://www.mtboss.in/interior-designer-in-moradabad",
  },
  openGraph: {
    title: "Interior Designer in Moradabad | MTBOSS",
    description:
      "Looking for an interior designer in Moradabad? MTBOSS offers home, office and modular kitchen interiors along with construction. Call +91 94584 10866.",
    url: "https://www.mtboss.in/interior-designer-in-moradabad",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-interior-designer-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer in Moradabad - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Interior Designer in Moradabad | MTBOSS",
    description:
      "Looking for an interior designer in Moradabad? MTBOSS offers home, office and modular kitchen interiors along with construction. Call +91 94584 10866.",
    images: ["https://www.mtboss.in/og-interior-designer-moradabad.jpg"],
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
    url: "https://www.mtboss.in/interior-designer-in-moradabad",
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
      "Interior Design",
      "Modular Kitchen Design",
      "Home Interior Design",
      "Office Interior Design",
      "Bungalow Interior Design",
      "False Ceiling Design",
      "Construction Material Supply",
      "Property Services",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Interior Designer in Moradabad",
    description:
      "MTBOSS provides interior design services including home interiors, office interiors, modular kitchen design, bungalow interiors, false ceiling and lighting design, along with construction and material supply in Moradabad.",
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
    serviceType: "Interior Design and Decoration Services",
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