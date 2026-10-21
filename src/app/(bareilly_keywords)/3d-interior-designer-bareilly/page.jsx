// app/(bareilly_keywords)/3d-interior-designer-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "3D Interior Designer Bareilly | MTBOSS",

  description:
    "Looking for a 3D interior designer Bareilly? See your home in 3D before work starts with MTBOSS. Call +91 94584 10866.",

  keywords:
    "3D interior designer Bareilly, 3D interior design Bareilly, 3D home design Bareilly, 3D kitchen design Bareilly, 3D bedroom design Bareilly, 3D living room design Bareilly, 3D visualisation interior Bareilly, 3D view of home interior Bareilly, 2D layout and 3D design Bareilly, home interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, 3D interior quote Bareilly",

  alternates: {
    canonical: "https://www.mtboss.in/3d-interior-designer-in-bareilly",
  },

  openGraph: {
    title: "3D Interior Designer Bareilly | MTBOSS",

    description:
      "Looking for a 3D interior designer Bareilly? See your home in 3D before work starts with MTBOSS. Call +91 94584 10866.",

    url: "https://www.mtboss.in/3d-interior-designer-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-3d-interior-designer-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "3D Interior Designer in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "3D Interior Designer Bareilly | MTBOSS",

    description:
      "Looking for a 3D interior designer Bareilly? See your home in 3D before work starts with MTBOSS. Call +91 94584 10866.",

    images: ["https://www.mtboss.in/og-3d-interior-designer-bareilly.jpg"],
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
    url: "https://www.mtboss.in/3d-interior-designer-in-bareilly",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image: "https://www.mtboss.in/og-3d-interior-designer-bareilly.jpg",
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
      "3D Interior Designer",
      "3D Interior Design",
      "3D Home Design",
      "3D Kitchen Design",
      "3D Bedroom Design",
      "3D Living Room Design",
      "3D Visualisation Interior",
      "3D View of Home Interior",
      "2D Layout and 3D Design",
      "Home Interior Design",
      "3D Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "3D Interior Design Services in Bareilly",
    description:
      "MTBOSS provides 3D interior design services in Bareilly. Services include site visit and measurement, requirement discussion, 2D space planning, 3D views of key rooms, material and colour visualisation, lighting and ceiling visualisation, modular kitchen and wardrobe design, design revisions, itemised estimate, specifications and agreement, execution and supervision, handover and after-handover support.",
    url: "https://www.mtboss.in/3d-interior-designer-in-bareilly",
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
      "3D Interior Designer, 3D Interior Design, 3D Home Design, 3D Kitchen Design, 3D Bedroom Design, 3D Living Room Design, 3D Visualisation Interior, 3D View of Home Interior, 2D Layout and 3D Design and 3D Interior Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does a 3D interior designer do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A 3D interior designer plans your layout, then creates 3D views of your rooms so you can see the look, colours, materials and lighting before work starts. The designer then revises the design based on your feedback.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide 3D interior design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. The team prepares 3D views of key rooms as part of the design process. Share your project details to confirm the rooms covered and the arrangements for your home.",
        },
      },
      {
        "@type": "Question",
        name: "Is a 3D design the same as a 2D layout?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. A 2D layout is a flat plan with measurements, while a 3D design shows how the room will look. Both are used together for good planning.",
        },
      },
      {
        "@type": "Question",
        name: "How accurate is a 3D design?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It is a helpful guide, but it is still a picture. Real colours, textures, daylight and site conditions can differ, so always check physical samples and written specifications.",
        },
      },
      {
        "@type": "Question",
        name: "Can I ask for changes after seeing the 3D design?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Changes are expected during the design stage. Changes after the design is approved and work has started can add cost and delay.",
        },
      },
      {
        "@type": "Question",
        name: "Can I get 3D views for only some rooms?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, depending on the project. Please confirm with the team which rooms are covered for your home.",
        },
      },
      {
        "@type": "Question",
        name: "How much does interior design cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on home size, scope, material and finish level, kitchen and wardrobe specifications, ceiling and lighting, custom furniture and civil work. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
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
        name: "3D Interior Designer in Bareilly",
        item: "https://www.mtboss.in/3d-interior-designer-in-bareilly",
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