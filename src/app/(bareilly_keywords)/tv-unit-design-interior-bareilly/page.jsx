// app/(bareilly_keywords)/tv-unit-design-interior-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "TV Unit Design Interior Bareilly | MTBOSS",

  description:
    "Planning TV unit design interior Bareilly? MTBOSS builds storage-smart, wire-free TV units with clear costs. Call +91 94584 10866.",

  keywords:
    "TV unit design interior Bareilly, TV unit design Bareilly, TV unit for living room Bareilly, TV panel design Bareilly, wall mounted TV unit Bareilly, modern TV unit Bareilly, bedroom TV unit Bareilly, TV unit with storage Bareilly, TV unit cost Bareilly, living room interior Bareilly, home interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, TV unit quote Bareilly",

  alternates: {
    canonical: "https://www.mtboss.in/tv-unit-design-interior-in-bareilly",
  },

  openGraph: {
    title: "TV Unit Design Interior Bareilly | MTBOSS",

    description:
      "Planning TV unit design interior Bareilly? MTBOSS builds storage-smart, wire-free TV units with clear costs. Call +91 94584 10866.",

    url: "https://www.mtboss.in/tv-unit-design-interior-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-tv-unit-design-interior-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "TV Unit Design Interior in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "TV Unit Design Interior Bareilly | MTBOSS",

    description:
      "Planning TV unit design interior Bareilly? MTBOSS builds storage-smart, wire-free TV units with clear costs. Call +91 94584 10866.",

    images: ["https://www.mtboss.in/og-tv-unit-design-interior-bareilly.jpg"],
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
    url: "https://www.mtboss.in/tv-unit-design-interior-in-bareilly",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image: "https://www.mtboss.in/og-tv-unit-design-interior-bareilly.jpg",
    priceRange: "₹₹₹",
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
      "TV Unit Design Interior",
      "TV Unit Design",
      "TV Unit for Living Room",
      "TV Panel Design",
      "Wall Mounted TV Unit",
      "Modern TV Unit",
      "Bedroom TV Unit",
      "TV Unit with Storage",
      "TV Unit Cost",
      "Living Room Interior",
      "Home Interior Design",
      "TV Unit Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "TV Unit Design Interior Services in Bareilly",
    description:
      "MTBOSS provides TV unit design interior services in Bareilly. Services include site visit and measurement, TV wall planning, concept and 3D views, custom carpentry, wall panelling, texture, wallpaper and paint, concealed wiring and conduits, lighting design, false ceiling coordination, wall repair and waterproofing, living room and bedroom interiors, renovation of existing TV walls, material supply and home services.",
    url: "https://www.mtboss.in/tv-unit-design-interior-in-bareilly",
    provider: {
      "@type": "InteriorDesignService",
      name: "MTBOSS Construction Private Limited",
      telephone: "+91-9458410866",
      email: "mtboss2016@gmail.com",
      url: "https://www.mtboss.in",
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
      "TV Unit Design Interior, TV Unit Design, TV Unit for Living Room, TV Panel Design, Wall Mounted TV Unit, Modern TV Unit, Bedroom TV Unit, TV Unit with Storage, TV Unit Cost and TV Unit Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does TV unit design interior include?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It usually covers wall inspection, wiring and conduit planning, the TV unit and storage, backdrop panelling, lighting and final finishing. The exact scope is written in the agreement.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide TV unit design interior in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your home.",
        },
      },
      {
        "@type": "Question",
        name: "How high should a TV be mounted?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The centre of the screen should sit near eye level when you are seated. The team can confirm the exact height after seeing your seating layout.",
        },
      },
      {
        "@type": "Question",
        name: "Wall-mounted or floor-standing TV unit: which is better?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A wall-mounted unit keeps the floor open and suits smaller rooms, while a floor-standing unit gives more storage. Many homes combine both ideas.",
        },
      },
      {
        "@type": "Question",
        name: "How can wires be hidden in a TV unit?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Conduits and concealed routes behind the panel, with a ventilated device compartment, keep wires out of sight. These are planned before the wall finish goes on.",
        },
      },
      {
        "@type": "Question",
        name: "Will I see the design before work starts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Designs and 3D views are shared and refined with your feedback before execution begins, and scope and specifications are written down before work starts.",
        },
      },
      {
        "@type": "Question",
        name: "How much does a TV unit cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on the size of the unit, board and finish, amount of storage, panelling, lighting and electrical work. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
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
        item: "https://www.mtboss.in/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Interior Design Services",
        item: "https://www.mtboss.in/interior-design-services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "TV Unit Design Interior in Bareilly",
        item: "https://www.mtboss.in/tv-unit-design-interior-in-bareilly",
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