// app/(bareilly_keywords)/wall-design-interior-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Wall Design Interior Bareilly | MTBOSS",

  description:
    "Planning wall design interior Bareilly? MTBOSS creates panels, wallpaper and texture walls with clear costs. Call +91 94584 10866.",

  keywords:
    "wall design interior Bareilly, wall design for living room Bareilly, bedroom wall design Bareilly, TV wall design Bareilly, wall panel design Bareilly, PVC louvers Bareilly, wallpaper installation Bareilly, wall texture design Bareilly, feature wall design Bareilly, wall design cost Bareilly, home interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, wall design quote Bareilly",

  alternates: {
    canonical: "https://www.mtboss.in/wall-design-interior-in-bareilly",
  },

  openGraph: {
    title: "Wall Design Interior Bareilly | MTBOSS",

    description:
      "Planning wall design interior Bareilly? MTBOSS creates panels, wallpaper and texture walls with clear costs. Call +91 94584 10866.",

    url: "https://www.mtboss.in/wall-design-interior-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-wall-design-interior-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Wall Design Interior in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Wall Design Interior Bareilly | MTBOSS",

    description:
      "Planning wall design interior Bareilly? MTBOSS creates panels, wallpaper and texture walls with clear costs. Call +91 94584 10866.",

    images: ["https://www.mtboss.in/og-wall-design-interior-bareilly.jpg"],
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
    url: "https://www.mtboss.in/wall-design-interior-in-bareilly",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image: "https://www.mtboss.in/og-wall-design-interior-bareilly.jpg",
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
      "Wall Design Interior",
      "Wall Design for Living Room",
      "Bedroom Wall Design",
      "TV Wall Design",
      "Wall Panel Design",
      "PVC Louvers",
      "Wallpaper Installation",
      "Wall Texture Design",
      "Feature Wall Design",
      "Wall Design Cost",
      "Home Interior Design",
      "Wall Design Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Wall Design Interior Services in Bareilly",
    description:
      "MTBOSS provides wall design interior services in Bareilly. Services include site visit and wall inspection, wall design planning, concept and 3D views, PVC panels and louvers, wallpaper installation, texture and accent painting, wooden and laminate panelling, tile and marble cladding, TV wall and display units, false ceiling and lighting coordination, waterproofing and wall repair, renovation of existing walls, material supply and home services.",
    url: "https://www.mtboss.in/wall-design-interior-in-bareilly",
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
      "Wall Design Interior, Wall Design for Living Room, Bedroom Wall Design, TV Wall Design, Wall Panel Design, PVC Louvers, Wallpaper Installation, Wall Texture Design, Feature Wall Design, Wall Design Cost and Wall Design Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does wall design interior include?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It usually covers wall inspection, repair, waterproofing, design planning, panels, wallpaper, texture or paint finishes, lighting coordination and final finishing. The exact scope is written in the agreement.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide wall design interior in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your home.",
        },
      },
      {
        "@type": "Question",
        name: "Which wall design is best for a living room?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A panelled or textured TV wall with concealed lighting is a popular choice. The right option depends on room size, furniture and budget, and the team can suggest it after a site visit.",
        },
      },
      {
        "@type": "Question",
        name: "Should I choose PVC panels or wallpaper?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PVC panels are sturdier and easier to clean, while wallpaper offers more patterns and is easier to change. Many homes use both in different rooms.",
        },
      },
      {
        "@type": "Question",
        name: "Can walls be designed in phases?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Start with the living room or bedroom feature wall and add other rooms later. A single design plan keeps everything consistent.",
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
        name: "How much does wall design interior cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on the number of walls, material type, surface condition, lighting, carpentry and finish level. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
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
        name: "Wall Design Interior in Bareilly",
        item: "https://www.mtboss.in/wall-design-interior-in-bareilly",
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