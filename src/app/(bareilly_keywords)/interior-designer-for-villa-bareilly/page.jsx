// app/(bareilly_keywords)/interior-designer-for-villa-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer for Villa Bareilly | MTBOSS",

  description:
    "Looking for an interior designer for villa Bareilly? MTBOSS plans luxury villa interiors, modular kitchens, ceilings and woodwork. Call +91 94584 10866.",

  keywords:
    "interior designer for villa Bareilly, villa interior design Bareilly, luxury villa interior Bareilly, villa interior designer Bareilly, duplex villa interior Bareilly, independent house interior Bareilly, modular kitchen for villa Bareilly, villa renovation Bareilly, home interior Bareilly, false ceiling Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, villa interior quote Bareilly",

  alternates: {
    canonical:
      "https://www.MTBOSS.in/interior-designer-for-villa-in-bareilly",
  },

  openGraph: {
    title: "Interior Designer for Villa Bareilly | MTBOSS",

    description:
      "Looking for an interior designer for villa Bareilly? MTBOSS plans luxury villa interiors, modular kitchens, ceilings and woodwork. Call +91 94584 10866.",

    url: "https://www.MTBOSS.in/interior-designer-for-villa-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.MTBOSS.in/og-interior-designer-villa-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer for Villa in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Designer for Villa Bareilly | MTBOSS",

    description:
      "Looking for an interior designer for villa Bareilly? MTBOSS plans luxury villa interiors, modular kitchens, ceilings and woodwork. Call +91 94584 10866.",

    images: [
      "https://www.MTBOSS.in/og-interior-designer-villa-bareilly.jpg",
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
    "@type": "InteriorDesignService",
    name: "MTBOSS Construction Private Limited",
    url: "https://www.MTBOSS.in/interior-designer-for-villa-in-bareilly",
    telephone: "+91-9458410866",
    email: "MTBOSS2016@gmail.com",
    image:
      "https://www.MTBOSS.in/og-interior-designer-villa-bareilly.jpg",
    priceRange: "₹₹",
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
    serviceType: [
      "Interior Designer for Villa",
      "Villa Interior Design",
      "Luxury Villa Interior",
      "Villa Interior Designer",
      "Duplex Villa Interior",
      "Independent House Interior",
      "Modular Kitchen for Villa",
      "Villa Renovation",
      "Home Interior Design",
      "False Ceiling",
      "Villa Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Villa Interior Design Services in Bareilly",
    description:
      "MTBOSS provides villa interior design services in Bareilly for independent villas, bungalows, duplex and triplex villas, row villas, townhouses, gated-community villas, newly built villas and older family houses. Services include complete villa interiors, grand entrance and foyer, living and family lounge, dining area, modular kitchen, master suite, bedrooms, puja room, home office, entertainment room, staircase design, false ceiling and lighting, woodwork and custom furniture, flooring, tile and marble work, painting, wallpaper and PVC panels, doors and windows, electrical, plumbing and waterproofing, AC and HVAC provisions, building elevation and boundary coordination, renovation and remodelling.",
    url: "https://www.MTBOSS.in/interior-designer-for-villa-in-bareilly",
    provider: {
      "@type": "InteriorDesignService",
      name: "MTBOSS Construction Private Limited",
      telephone: "+91-9458410866",
      email: "MTBOSS2016@gmail.com",
      url: "https://www.MTBOSS.in",
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
    ],
    serviceType:
      "Interior Designer for Villa, Villa Interior Design, Luxury Villa Interior, Duplex Villa Interior, Independent House Interior, Modular Kitchen for Villa, Villa Renovation, Home Interior Design and False Ceiling",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does an interior designer for a villa do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A villa interior designer plans layouts, floor-wise zoning, storage, lighting, finishes and furniture, coordinates the trades and manages the work until handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide villa interior design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your villa.",
        },
      },
      {
        "@type": "Question",
        name: "Can the interiors be done floor by floor?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Many owners complete the ground floor first and move to the next floor later. A single overall plan keeps the style consistent across phases.",
        },
      },
      {
        "@type": "Question",
        name: "Can you design a double-height living room and staircase?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. These are usually the most visible parts of a villa, so lighting, ceiling, wall treatment and railing are planned together.",
        },
      },
      {
        "@type": "Question",
        name: "Should I start interiors before the villa is fully ready?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Early planning is best, because wiring, AC, plumbing and ceiling points can be set before finishing. Share your floor plan, and the team can start the design.",
        },
      },
      {
        "@type": "Question",
        name: "How much does villa interior design cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on built-up area, number of floors, scope, material and finish level, kitchen and wardrobe specifications, ceiling and lighting design, custom furniture and outdoor work. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS also handle electrical, plumbing and waterproofing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. These are part of the services offered, so you do not need to coordinate separate contractors.",
        },
      },
      {
        "@type": "Question",
        name: "Where is the MTBOSS office located?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The office is located at Harthala, Kanth Road, Behind KR Collection, near Domino's, Moradabad, Uttar Pradesh.",
        },
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.MTBOSS.in/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Interior Design Services",
        item: "https://www.MTBOSS.in/interior-design-services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Interior Designer for Villa in Bareilly",
        item: "https://www.MTBOSS.in/interior-designer-for-villa-in-bareilly",
      },
    ],
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
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