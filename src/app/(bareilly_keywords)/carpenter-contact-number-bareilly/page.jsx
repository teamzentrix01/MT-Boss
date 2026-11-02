// app/(bareilly_keywords)/hire-a-home-carpenter-in-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Hire a Home Carpenter in Bareilly | MTBOSS",
  description:
    "Hiring a carpenter for your home in Bareilly? Learn what to check, how to compare quotes, and get a free site visit from MTBOSS. Call +91 94584 10866.",
  keywords:
    "carpenter for home Bareilly, hire carpenter for home Bareilly, home carpenter Bareilly, house carpenter Bareilly, carpenter for house work Bareilly, home woodwork contractor Bareilly, carpenter for home interior Bareilly, how to hire a carpenter, carpenter quote Bareilly, carpenter for home renovation Bareilly, carpenter for new house Bareilly, carpenter services Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator",
  alternates: {
    canonical:
      "https://www.mtboss.in/hire-a-home-carpenter-in-bareilly",
  },
  openGraph: {
    title: "Hire a Home Carpenter in Bareilly | MTBOSS",
    description:
      "Hiring a carpenter for your home in Bareilly? Learn what to check, how to compare quotes, and get a free site visit from MTBOSS. Call +91 94584 10866.",
    url: "https://www.mtboss.in/hire-a-home-carpenter-in-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-hire-a-home-carpenter-in-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Hire a Home Carpenter in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hire a Home Carpenter in Bareilly | MTBOSS",
    description:
      "Hiring a carpenter for your home in Bareilly? Learn what to check, how to compare quotes, and get a free site visit from MTBOSS. Call +91 94584 10866.",
    images: [
      "https://www.mtboss.in/og-hire-a-home-carpenter-in-bareilly.jpg",
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
    url: "https://www.mtboss.in/hire-a-home-carpenter-in-bareilly",
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
      "Hire Carpenter for Home",
      "Home Carpenter",
      "House Carpenter",
      "Carpenter for House Work",
      "Home Woodwork Contractor",
      "Carpenter for Home Interior",
      "Carpenter Quote",
      "Carpenter for Home Renovation",
      "Carpenter for New House",
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
    name: "Hire a Home Carpenter in Bareilly",
    description:
      "MTBOSS helps homeowners in Bareilly hire a home carpenter with site visits, measurements, itemised quotes, written scope and specifications, material and hardware guidance, drawings, installation, handover inspection and carpentry repair or renovation services.",
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
      "Home Carpentry Hiring, Whole-Home Woodwork Planning, Quote Comparison and Installation",
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