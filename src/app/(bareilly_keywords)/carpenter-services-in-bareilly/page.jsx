// app/(bareilly_keywords)/carpenter-services-in-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Carpenter Services in Bareilly | MTBOSS",
  description:
    "Need carpenter services in Bareilly? MTBOSS offers furniture, wardrobes, doors, repairs and woodwork with clear quotes. Call +91 94584 10866.",
  keywords:
    "carpenter services in Bareilly, carpenter in Bareilly, best carpenter in Bareilly, carpenter near me Bareilly, furniture carpenter Bareilly, wardrobe carpenter Bareilly, door and window carpenter Bareilly, carpentry work Bareilly, wooden furniture repair Bareilly, interior carpenter Bareilly, carpenter contractor Bareilly, home carpenter service Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator",
  alternates: {
    canonical:
      "https://www.mtboss.in/carpenter-services-in-bareilly",
  },
  openGraph: {
    title: "Carpenter Services in Bareilly | MTBOSS",
    description:
      "Need carpenter services in Bareilly? MTBOSS offers furniture, wardrobes, doors, repairs and woodwork with clear quotes. Call +91 94584 10866.",
    url: "https://www.mtboss.in/carpenter-services-in-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-carpenter-services-in-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Carpenter Services in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Carpenter Services in Bareilly | MTBOSS",
    description:
      "Need carpenter services in Bareilly? MTBOSS offers furniture, wardrobes, doors, repairs and woodwork with clear quotes. Call +91 94584 10866.",
    images: [
      "https://www.mtboss.in/og-carpenter-services-in-bareilly.jpg",
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
    url: "https://www.mtboss.in/carpenter-services-in-bareilly",
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
      "Carpenter Services",
      "Carpenter in Bareilly",
      "Furniture Carpenter",
      "Wardrobe Carpenter",
      "Door and Window Carpenter",
      "Carpentry Work",
      "Wooden Furniture Repair",
      "Interior Carpenter",
      "Carpenter Contractor",
      "Home Carpenter Service",
      "Kitchen Woodwork",
      "Office and Shop Carpentry",
      "False Ceiling Woodwork",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Carpenter Services in Bareilly",
    description:
      "MTBOSS provides carpenter services in Bareilly for wardrobes, beds, TV units, doors, window frames, kitchen woodwork, office and shop furniture, repairs, polish, finishing, false ceiling woodwork, installation and handover with clear itemised quotations.",
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