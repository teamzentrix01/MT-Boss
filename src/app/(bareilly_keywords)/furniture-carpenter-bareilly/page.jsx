// app/(bareilly_keywords)/furniture-carpenter-in-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Furniture Carpenter in Bareilly | MTBOSS",
  description:
    "Need a furniture carpenter in Bareilly? MTBOSS makes custom beds, tables, TV units and storage furniture with clear quotes. Call +91 94584 10866.",
  keywords:
    "furniture carpenter Bareilly, custom furniture Bareilly, furniture maker Bareilly, wooden furniture Bareilly, bed carpenter Bareilly, dining table carpenter Bareilly, TV unit carpenter Bareilly, study table carpenter Bareilly, sofa frame carpenter Bareilly, custom wooden furniture Bareilly, home furniture Bareilly, carpenter services Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator",
  alternates: {
    canonical:
      "https://www.mtboss.in/furniture-carpenter-in-bareilly",
  },
  openGraph: {
    title: "Furniture Carpenter in Bareilly | MTBOSS",
    description:
      "Need a furniture carpenter in Bareilly? MTBOSS makes custom beds, tables, TV units and storage furniture with clear quotes. Call +91 94584 10866.",
    url: "https://www.mtboss.in/furniture-carpenter-in-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-furniture-carpenter-in-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Furniture Carpenter in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Furniture Carpenter in Bareilly | MTBOSS",
    description:
      "Need a furniture carpenter in Bareilly? MTBOSS makes custom beds, tables, TV units and storage furniture with clear quotes. Call +91 94584 10866.",
    images: [
      "https://www.mtboss.in/og-furniture-carpenter-in-bareilly.jpg",
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
    url: "https://www.mtboss.in/furniture-carpenter-in-bareilly",
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
      "Furniture Carpenter",
      "Custom Furniture",
      "Furniture Maker",
      "Wooden Furniture",
      "Bed Carpenter",
      "Dining Table Carpenter",
      "TV Unit Carpenter",
      "Study Table Carpenter",
      "Sofa Frame Carpenter",
      "Custom Wooden Furniture",
      "Home Furniture",
      "Wardrobe Carpenter",
      "Office and Shop Furniture",
      "Furniture Repair and Refinishing",
      "Carpenter Services",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Furniture Carpenter in Bareilly",
    description:
      "MTBOSS provides furniture carpentry in Bareilly for custom beds, wardrobes, TV units, dining tables, study and office tables, sofa frames, storage units, kids' furniture, office and shop furniture, furniture repair, refinishing, installation and handover with clear itemised quotations.",
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
      "Custom Furniture Making, Woodwork, Repair and Installation",
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