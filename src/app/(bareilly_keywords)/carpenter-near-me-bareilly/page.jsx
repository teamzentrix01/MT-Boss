// app/(bareilly_keywords)/carpenter-near-me-in-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Carpenter Near Me in Bareilly | MTBOSS",
  description:
    "Looking for a carpenter near you in Bareilly? MTBOSS offers home visits, repairs, furniture and woodwork with clear quotes. Call +91 94584 10866.",
  keywords:
    "carpenter near me Bareilly, carpenter near me, local carpenter Bareilly, home carpenter Bareilly, carpenter at home Bareilly, carpenter for repair Bareilly, furniture repair near me Bareilly, door repair carpenter Bareilly, wardrobe carpenter near me, carpenter contact number Bareilly, carpenter services Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator",
  alternates: {
    canonical:
      "https://www.mtboss.in/carpenter-near-me-in-bareilly",
  },
  openGraph: {
    title: "Carpenter Near Me in Bareilly | MTBOSS",
    description:
      "Looking for a carpenter near you in Bareilly? MTBOSS offers home visits, repairs, furniture and woodwork with clear quotes. Call +91 94584 10866.",
    url: "https://www.mtboss.in/carpenter-near-me-in-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-carpenter-near-me-in-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Carpenter Near Me in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Carpenter Near Me in Bareilly | MTBOSS",
    description:
      "Looking for a carpenter near you in Bareilly? MTBOSS offers home visits, repairs, furniture and woodwork with clear quotes. Call +91 94584 10866.",
    images: [
      "https://www.mtboss.in/og-carpenter-near-me-in-bareilly.jpg",
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
    url: "https://www.mtboss.in/carpenter-near-me-in-bareilly",
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
      "Carpenter Near Me",
      "Local Carpenter",
      "Home Carpenter Service",
      "Carpenter for Repair",
      "Furniture Repair Near Me",
      "Door Repair Carpenter",
      "Wardrobe Carpenter Near Me",
      "Carpenter Contact Number Bareilly",
      "Carpenter Services Bareilly",
      "Furniture Making",
      "Woodwork Repair",
      "Kitchen Woodwork",
      "Office and Shop Carpentry",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Carpenter Near Me in Bareilly",
    description:
      "MTBOSS provides carpenter services near you in Bareilly with home visits, inspection, small repairs, door and window work, furniture making and repair, wardrobe work, kitchen woodwork, polish and finishing, office and shop carpentry, installation and handover.",
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
      "Local Carpentry, Furniture Repair, Woodwork and Installation",
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