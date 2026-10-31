// app/(bareilly_keywords)/complete-home-makeover-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Complete Home Makeover in Bareilly | MTBOSS",
  description:
    "Planning a complete home makeover in Bareilly? MTBOSS plans repairs, interiors, kitchen, bathrooms and finishing as one project. Call +91 94584 10866.",
  keywords:
    "complete home makeover Bareilly, full home makeover Bareilly, whole house makeover Bareilly, home transformation Bareilly, complete home renovation Bareilly, full house renovation Bareilly, home makeover cost Bareilly, home makeover timeline, turnkey home makeover Bareilly, house makeover contractor Bareilly, interior and renovation Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator",
  alternates: {
    canonical: "https://www.mtboss.in/complete-home-makeover-bareilly",
  },
  openGraph: {
    title: "Complete Home Makeover in Bareilly | MTBOSS",
    description:
      "Planning a complete home makeover in Bareilly? MTBOSS plans repairs, interiors, kitchen, bathrooms and finishing as one project. Call +91 94584 10866.",
    url: "https://www.mtboss.in/complete-home-makeover-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-complete-home-makeover-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Complete Home Makeover in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Complete Home Makeover in Bareilly | MTBOSS",
    description:
      "Planning a complete home makeover in Bareilly? MTBOSS plans repairs, interiors, kitchen, bathrooms and finishing as one project. Call +91 94584 10866.",
    images: ["https://www.mtboss.in/og-complete-home-makeover-bareilly.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: "MTBOSS Construction Private Limited",
    url: "https://www.mtboss.in/complete-home-makeover-bareilly",
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
      "Complete Home Makeover",
      "Full Home Makeover",
      "Whole House Makeover",
      "Home Transformation",
      "Complete Home Renovation",
      "Full House Renovation",
      "Turnkey Home Makeover",
      "Interior Renovation",
      "Kitchen Renovation",
      "Bathroom Renovation",
      "Waterproofing",
      "Carpentry and Storage",
      "Painting and Finishing",
      "False Ceiling and Lighting",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Complete Home Makeover in Bareilly",
    description:
      "MTBOSS provides complete home makeover services in Bareilly, including whole-home inspection, makeover planning and design, civil and repair work, waterproofing, plumbing and electrical upgrades, flooring and tiling, kitchen and bathroom makeover, false ceiling, carpentry, painting, exterior improvements and turnkey project management.",
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: "MTBOSS Construction Private Limited",
      telephone: "+91-9458410866",
      url: "https://www.mtboss.in",
    },
    areaServed: {
      "@type": "City",
      name: "Bareilly",
    },
    serviceType:
      "Complete Home Makeover, Renovation, Interiors and Turnkey Construction Services",
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