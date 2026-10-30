// app/(bareilly_keywords)/home-renovation-contractor-in-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Home Renovation Contractor Bareilly | MTBOSS",
  description:
    "Need a home renovation contractor in Bareilly? MTBOSS manages repairs, waterproofing, services and finishing with clear contracts. Call +91 94584 10866.",
  keywords:
    "home renovation contractor Bareilly, house renovation contractor Bareilly, renovation contractors in Bareilly, civil contractor for renovation Bareilly, turnkey renovation contractor Bareilly, building repair contractor Bareilly, interior and renovation contractor Bareilly, renovation work contractor Bareilly, contractor for house repair Bareilly, renovation contractor near me Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator",
  alternates: {
    canonical:
      "https://www.mtboss.in/home-renovation-contractor-in-bareilly",
  },
  openGraph: {
    title: "Home Renovation Contractor Bareilly | MTBOSS",
    description:
      "Need a home renovation contractor in Bareilly? MTBOSS manages repairs, waterproofing, services and finishing with clear contracts. Call +91 94584 10866.",
    url: "https://www.mtboss.in/home-renovation-contractor-in-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url:
          "https://www.mtboss.in/og-home-renovation-contractor-in-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Home Renovation Contractor in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Home Renovation Contractor Bareilly | MTBOSS",
    description:
      "Need a home renovation contractor in Bareilly? MTBOSS manages repairs, waterproofing, services and finishing with clear contracts. Call +91 94584 10866.",
    images: [
      "https://www.mtboss.in/og-home-renovation-contractor-in-bareilly.jpg",
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
    url: "https://www.mtboss.in/home-renovation-contractor-in-bareilly",
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
      "Home Renovation Contractor",
      "House Renovation Contractor",
      "Renovation Contractors",
      "Civil Contractor for Renovation",
      "Turnkey Renovation Contractor",
      "Building Repair Contractor",
      "Interior and Renovation Contractor",
      "Renovation Work Contractor",
      "Contractor for House Repair",
      "Renovation Contractor Near Me",
      "Home Renovation in Bareilly",
      "Waterproofing",
      "Bathroom Renovation",
      "Kitchen Renovation",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Home Renovation Contractor in Bareilly",
    description:
      "MTBOSS provides home renovation contracting in Bareilly with site inspection, written scope, contract planning, civil and structural repair, waterproofing, plumbing, electrical work, flooring, bathroom and kitchen renovation, carpentry, false ceilings, painting, site supervision and handover.",
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
      "Home Renovation Contracting, Turnkey Renovation, Waterproofing, Building Repair and Interior Renovation",
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