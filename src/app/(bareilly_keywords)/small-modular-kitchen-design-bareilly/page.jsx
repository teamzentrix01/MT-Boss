// app/(bareilly_keywords)/small-modular-kitchen-design-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Small Modular Kitchen Design Bareilly | MTBOSS",
  description:
    "Need a small modular kitchen design in Bareilly? MTBOSS offers space-saving layouts, 3D design and clear quotes. Call +91 94584 10866 for a site visit.",
  keywords:
    "small modular kitchen design Bareilly, small kitchen design Bareilly, compact modular kitchen Bareilly, small kitchen interior Bareilly, space saving kitchen design, small L shaped kitchen, small straight kitchen design, small kitchen storage ideas, modular kitchen for flats Bareilly, modular kitchen company Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator",
  alternates: {
    canonical:
      "https://www.mtboss.in/small-modular-kitchen-design-bareilly",
  },
  openGraph: {
    title: "Small Modular Kitchen Design Bareilly | MTBOSS",
    description:
      "Need a small modular kitchen design in Bareilly? MTBOSS offers space-saving layouts, 3D design and clear quotes. Call +91 94584 10866 for a site visit.",
    url: "https://www.mtboss.in/small-modular-kitchen-design-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-small-modular-kitchen-design-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Small Modular Kitchen Design in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Small Modular Kitchen Design Bareilly | MTBOSS",
    description:
      "Need a small modular kitchen design in Bareilly? MTBOSS offers space-saving layouts, 3D design and clear quotes. Call +91 94584 10866 for a site visit.",
    images: [
      "https://www.mtboss.in/og-small-modular-kitchen-design-bareilly.jpg",
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
    "@type": "LocalBusiness",
    name: "MTBOSS Construction Private Limited",
    url: "https://www.mtboss.in/small-modular-kitchen-design-bareilly",
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
        name: "Bareilly",
      },
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
      "Small Modular Kitchen Design",
      "Compact Modular Kitchen",
      "Small Kitchen Interior Design",
      "Space Saving Kitchen Design",
      "Small L Shaped Kitchen Design",
      "Small Straight Kitchen Design",
      "Modular Kitchen for Flats",
      "Modular Kitchen Company",
      "Kitchen Renovation",
      "Kitchen Interior Design",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Small Modular Kitchen Design in Bareilly",
    description:
      "MTBOSS designs small and compact modular kitchens in Bareilly with space-saving layouts, vertical storage, corner solutions, 3D design, material guidance, itemised quotations, countertop, sink, backsplash, chimney planning, civil, plumbing and electrical work, installation and after-sales support.",
    provider: {
      "@type": "LocalBusiness",
      name: "MTBOSS Construction Private Limited",
      telephone: "+91-9458410866",
      url: "https://www.mtboss.in",
    },
    areaServed: {
      "@type": "City",
      name: "Bareilly",
    },
    serviceType:
      "Small Modular Kitchen Design, Supply and Installation",
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