// app/(bareilly_keywords)/carpenter-for-home-in-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Carpenter for Home in Bareilly | MTBOSS",
  description:
    "Need a carpenter for your home in Bareilly? MTBOSS plans woodwork room by room, with clear quotes and home visits. Call +91 94584 10866.",
  keywords:
    "carpenter for home Bareilly, home carpenter Bareilly, carpenter for house Bareilly, house carpenter Bareilly, carpenter for new home Bareilly, home interior carpenter Bareilly, carpenter for home renovation Bareilly, carpenter for flat Bareilly, home woodwork Bareilly, home furniture and woodwork Bareilly, carpenter at home Bareilly, carpenter services Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator",
  alternates: {
    canonical:
      "https://www.mtboss.in/carpenter-for-home-in-bareilly",
  },
  openGraph: {
    title: "Carpenter for Home in Bareilly | MTBOSS",
    description:
      "Need a carpenter for your home in Bareilly? MTBOSS plans woodwork room by room, with clear quotes and home visits. Call +91 94584 10866.",
    url: "https://www.mtboss.in/carpenter-for-home-in-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-carpenter-for-home-in-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Carpenter for Home in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Carpenter for Home in Bareilly | MTBOSS",
    description:
      "Need a carpenter for your home in Bareilly? MTBOSS plans woodwork room by room, with clear quotes and home visits. Call +91 94584 10866.",
    images: [
      "https://www.mtboss.in/og-carpenter-for-home-in-bareilly.jpg",
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
    url: "https://www.mtboss.in/carpenter-for-home-in-bareilly",
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
      "Carpenter for Home",
      "Home Carpenter",
      "Carpenter for House",
      "House Carpenter",
      "Carpenter for New Home",
      "Home Interior Carpenter",
      "Carpenter for Home Renovation",
      "Carpenter for Flat",
      "Home Woodwork",
      "Home Furniture and Woodwork",
      "Carpenter at Home",
      "Carpenter Services",
      "Wardrobes and Storage",
      "Doors and Window Woodwork",
      "Kitchen Woodwork",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Carpenter for Home in Bareilly",
    description:
      "MTBOSS provides home carpentry in Bareilly with room-wise planning, measurement, wardrobes, beds, TV units, kitchen and pantry woodwork, doors, window woodwork, pooja units, kids' furniture, repairs, refinishing, installation and handover under one team.",
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
      "Home Carpentry, Whole-Home Woodwork Planning and Installation",
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