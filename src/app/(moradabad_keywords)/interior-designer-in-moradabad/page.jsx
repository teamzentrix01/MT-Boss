// app/(moradabad_keywords)/interior-designer-in-moradabad/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer in Moradabad | MTBoss",
  description:
    "Looking for an interior designer in Moradabad? MTBoss offers home, office and modular kitchen interiors along with construction. Call +91 94584 10866.",
  keywords:
    "interior designer in Moradabad, interior design company Moradabad, modular kitchen design Moradabad, home interior designer Moradabad, office interior designer Moradabad, bungalow interior design Moradabad, MTBoss Moradabad, interior decoration Moradabad, affordable interior designer Moradabad, MTBoss budget calculator, interior design and construction Moradabad, MTBoss Kanth Road, false ceiling design Moradabad, interior design quote Moradabad, MTBoss interior projects",
  alternates: {
    canonical: "https://www.MTBoss.in/interior-designer-in-moradabad",
  },
  openGraph: {
    title: "Interior Designer in Moradabad | MTBoss",
    description:
      "Looking for an interior designer in Moradabad? MTBoss offers home, office and modular kitchen interiors along with construction. Call +91 94584 10866.",
    url: "https://www.MTBoss.in/interior-designer-in-moradabad",
    siteName: "MTBoss Construction Private Limited",
    images: [
      {
        url: "https://www.MTBoss.in/og-interior-designer-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer in Moradabad - MTBoss Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Interior Designer in Moradabad | MTBoss",
    description:
      "Looking for an interior designer in Moradabad? MTBoss offers home, office and modular kitchen interiors along with construction. Call +91 94584 10866.",
    images: ["https://www.MTBoss.in/og-interior-designer-moradabad.jpg"],
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
    url: "https://www.MTBoss.in/interior-designer-in-moradabad",
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
      "MTBoss provides interior design services including home interiors, office interiors, modular kitchen design, bungalow interiors, false ceiling and lighting design, along with construction and material supply in Moradabad.",
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