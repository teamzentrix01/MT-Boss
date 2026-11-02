// app/(bareilly_keywords)/modular-kitchen-cost-in-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Modular Kitchen Cost in Bareilly | MTBOSS",
  description:
    "Want to know modular kitchen cost in Bareilly? MTBOSS offers site visit, 3D design and itemised quotes. Call +91 94584 10866.",
  keywords:
    "modular kitchen cost Bareilly, modular kitchen price in Bareilly, modular kitchen price per sq ft Bareilly, modular kitchen designer Bareilly, L shaped modular kitchen cost Bareilly, modular kitchen company Bareilly, kitchen interior Bareilly, modular kitchen quote Bareilly, kitchen renovation Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator",
  alternates: {
    canonical: "https://www.mtboss.in/modular-kitchen-cost-in-bareilly",
  },
  openGraph: {
    title: "Modular Kitchen Cost in Bareilly | MTBOSS",
    description:
      "Want to know modular kitchen cost in Bareilly? MTBOSS offers site visit, 3D design and itemised quotes. Call +91 94584 10866.",
    url: "https://www.mtboss.in/modular-kitchen-cost-in-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-modular-kitchen-cost-in-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Modular Kitchen Cost in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Modular Kitchen Cost in Bareilly | MTBOSS",
    description:
      "Want to know modular kitchen cost in Bareilly? MTBOSS offers site visit, 3D design and itemised quotes. Call +91 94584 10866.",
    images: ["https://www.mtboss.in/og-modular-kitchen-cost-in-bareilly.jpg"],
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
    url: "https://www.mtboss.in/modular-kitchen-cost-in-bareilly",
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
      "Modular Kitchen Costing",
      "Modular Kitchen Design",
      "Modular Kitchen Installation",
      "Kitchen Renovation",
      "Kitchen Interior Design",
      "L-Shaped Modular Kitchen",
      "U-Shaped Modular Kitchen",
      "Kitchen Cabinet Installation",
      "Countertop and Backsplash Installation",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Modular Kitchen Cost in Bareilly",
    description:
      "MTBOSS provides modular kitchen cost planning in Bareilly through site visits, measurement, 3D design, material selection and itemised quotations. The service covers layout planning, carcass and shutter work, hardware, countertop, sink, backsplash, chimney and hob planning, lighting, civil, plumbing and electrical work.",
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
    serviceType: "Modular Kitchen Design, Costing and Installation",
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