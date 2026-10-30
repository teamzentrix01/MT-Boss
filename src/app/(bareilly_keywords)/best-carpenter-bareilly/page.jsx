// app/(bareilly_keywords)/best-carpenter-in-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Best Carpenter in Bareilly | MTBOSS",
  description:
    "How to choose the best carpenter in Bareilly? Use our checklist, then get measurement, design and clear quotes from MTBOSS. Call +91 94584 10866.",
  keywords:
    "best carpenter Bareilly, best carpenter in Bareilly, top carpenter in Bareilly, good carpenter in Bareilly, expert carpenter Bareilly, professional carpenter Bareilly, how to choose a carpenter, carpenter near me Bareilly, furniture carpenter Bareilly, wardrobe carpenter Bareilly, interior carpenter Bareilly, carpenter contractor Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator",
  alternates: {
    canonical: "https://www.mtboss.in/best-carpenter-in-bareilly",
  },
  openGraph: {
    title: "Best Carpenter in Bareilly | MTBOSS",
    description:
      "How to choose the best carpenter in Bareilly? Use our checklist, then get measurement, design and clear quotes from MTBOSS. Call +91 94584 10866.",
    url: "https://www.mtboss.in/best-carpenter-in-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-best-carpenter-in-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Best Carpenter in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Carpenter in Bareilly | MTBOSS",
    description:
      "How to choose the best carpenter in Bareilly? Use our checklist, then get measurement, design and clear quotes from MTBOSS. Call +91 94584 10866.",
    images: ["https://www.mtboss.in/og-best-carpenter-in-bareilly.jpg"],
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
    url: "https://www.mtboss.in/best-carpenter-in-bareilly",
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
      "Best Carpenter in Bareilly",
      "Professional Carpenter",
      "Expert Carpenter",
      "Furniture Carpenter",
      "Wardrobe Carpenter",
      "Interior Carpenter",
      "Carpenter Contractor",
      "Carpentry Work",
      "Wooden Furniture Repair",
      "Door and Window Carpenter",
      "Kitchen Woodwork",
      "Office and Shop Carpentry",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Best Carpenter in Bareilly",
    description:
      "MTBOSS helps homeowners and businesses in Bareilly choose a carpenter using a practical checklist: site measurement, drawing approval, named materials and hardware, past work review, itemised quotation, stage-wise timeline and aftercare. Services include wardrobes, beds, TV units, doors, kitchen woodwork, repairs, finishing and installation.",
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
      "Carpentry, Furniture Making, Woodwork Repair and Installation",
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