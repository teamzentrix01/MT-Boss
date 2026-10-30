// app/(bareilly_keywords)/modular-kitchen-dealer-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Modular Kitchen Dealer Bareilly | MTBOSS",
  description:
    "Looking for a modular kitchen dealer in Bareilly? MTBOSS offers material choices, 3D design, installation and clear quotes. Call +91 94584 10866.",
  keywords:
    "modular kitchen dealer Bareilly, modular kitchen dealers in Bareilly, modular kitchen supplier Bareilly, modular kitchen shop Bareilly, modular kitchen showroom Bareilly, buy modular kitchen Bareilly, modular kitchen brands Bareilly, kitchen cabinet dealer Bareilly, modular kitchen price Bareilly, modular kitchen company Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator",
  alternates: {
    canonical: "https://www.mtboss.in/modular-kitchen-dealer-bareilly",
  },
  openGraph: {
    title: "Modular Kitchen Dealer Bareilly | MTBOSS",
    description:
      "Looking for a modular kitchen dealer in Bareilly? MTBOSS offers material choices, 3D design, installation and clear quotes. Call +91 94584 10866.",
    url: "https://www.mtboss.in/modular-kitchen-dealer-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-modular-kitchen-dealer-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Modular Kitchen Dealer in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Modular Kitchen Dealer Bareilly | MTBOSS",
    description:
      "Looking for a modular kitchen dealer in Bareilly? MTBOSS offers material choices, 3D design, installation and clear quotes. Call +91 94584 10866.",
    images: ["https://www.mtboss.in/og-modular-kitchen-dealer-bareilly.jpg"],
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
    url: "https://www.mtboss.in/modular-kitchen-dealer-bareilly",
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
      "Modular Kitchen Dealer",
      "Modular Kitchen Supplier",
      "Modular Kitchen Showroom",
      "Kitchen Cabinet Dealer",
      "Buy Modular Kitchen",
      "Modular Kitchen Design",
      "Modular Kitchen Installation",
      "Kitchen Renovation",
      "Kitchen Interior Design",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Modular Kitchen Dealer in Bareilly",
    description:
      "MTBOSS helps homeowners in Bareilly buy modular kitchens with material guidance, samples, layout planning, 3D design, itemised quotations, cabinets and shutters, hardware, countertop, sink, backsplash, chimney planning, civil, plumbing and electrical work, installation and after-sales support.",
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
    serviceType: "Modular Kitchen Supply, Design and Installation",
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