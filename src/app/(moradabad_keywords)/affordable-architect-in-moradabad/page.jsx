// app/(moradabad_keywords)/affordable-architect-in-moradabad/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Affordable Architect in Moradabad | MTBoss Construction",
  description:
    "Looking for an affordable architect in Moradabad? MTBoss offers design, construction and wholesale materials together. Call +91 94584 10866 for a free quote.",
  keywords:
    "affordable architect in Moradabad, budget architect Moradabad, low cost house construction Moradabad, cheap architect near me Moradabad, affordable construction company Moradabad, MTBoss Moradabad, house construction cost Moradabad, MTBoss budget calculator, wholesale building materials Moradabad, affordable home design Moradabad, MTBoss Kanth Road, budget friendly construction Moradabad, construction quote Moradabad, low cost commercial construction Moradabad, MTBoss material supply",
  alternates: {
    canonical: "https://www.MTBoss.in/affordable-architect-in-moradabad",
  },
  openGraph: {
    title: "Affordable Architect in Moradabad | MTBoss Construction",
    description:
      "Looking for an affordable architect in Moradabad? MTBoss offers design, construction and wholesale materials together. Call +91 94584 10866 for a free quote.",
    url: "https://www.MTBoss.in/affordable-architect-in-moradabad",
    siteName: "MTBoss Construction Private Limited",
    images: [
      {
        url: "https://www.MTBoss.in/og-affordable-architect-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Affordable Architect in Moradabad - MTBoss Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Affordable Architect in Moradabad | MTBoss Construction",
    description:
      "Looking for an affordable architect in Moradabad? MTBoss offers design, construction and wholesale materials together. Call +91 94584 10866 for a free quote.",
    images: [
      "https://www.MTBoss.in/og-affordable-architect-moradabad.jpg",
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
    url: "https://www.MTBoss.in/affordable-architect-in-moradabad",
    telephone: "+91-9458410866",
    email: "MTBoss2016@gmail.com",
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
      "Affordable Architectural Design",
      "Budget Home Construction",
      "Low Cost Commercial Construction",
      "Wholesale Building Materials",
      "Property Services",
      "Construction Material Supply",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Affordable Architect and Construction Services in Moradabad",
    description:
      "MTBoss provides budget-friendly architectural design coordination, civil construction, wholesale material supply and property services for residential, commercial and industrial projects in Moradabad.",
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
    serviceType:
      "Affordable Architectural Design and Construction Services",
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