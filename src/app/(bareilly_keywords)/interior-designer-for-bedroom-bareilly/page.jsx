// app/(bareilly_keywords)/interior-designer-for-bedroom-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer for Bedroom Bareilly | MTBOSS",

  description:
    "Looking for an interior designer for bedroom Bareilly? MTBOSS designs bedrooms with smart wardrobes, soft lighting and calm layouts. Call +91 94584 10866.",

  keywords:
    "interior designer for bedroom Bareilly, bedroom interior design Bareilly, master bedroom design Bareilly, bedroom wardrobe design Bareilly, kids bedroom design Bareilly, small bedroom design Bareilly, bedroom false ceiling Bareilly, bedroom renovation Bareilly, home interior Bareilly, modular wardrobe Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, bedroom interior quote Bareilly",

  alternates: {
    canonical:
      "https://www.mtboss.in/interior-designer-for-bedroom-in-bareilly",
  },

  openGraph: {
    title: "Interior Designer for Bedroom Bareilly | MTBOSS",

    description:
      "Looking for an interior designer for bedroom Bareilly? MTBOSS designs bedrooms with smart wardrobes, soft lighting and calm layouts. Call +91 94584 10866.",

    url: "https://www.mtboss.in/interior-designer-for-bedroom-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-interior-designer-bedroom-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer for Bedroom in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Designer for Bedroom Bareilly | MTBOSS",

    description:
      "Looking for an interior designer for bedroom Bareilly? MTBOSS designs bedrooms with smart wardrobes, soft lighting and calm layouts. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-interior-designer-bedroom-bareilly.jpg",
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
    url: "https://www.mtboss.in/interior-designer-for-bedroom-in-bareilly",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-interior-designer-bedroom-bareilly.jpg",
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
      "Interior Designer for Bedroom",
      "Bedroom Interior Design",
      "Master Bedroom Design",
      "Bedroom Wardrobe Design",
      "Kids Bedroom Design",
      "Small Bedroom Design",
      "Bedroom False Ceiling",
      "Bedroom Renovation",
      "Home Interior Design",
      "Modular Wardrobe",
      "Bedroom Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Bedroom Interior Design Services in Bareilly",
    description:
      "MTBOSS provides bedroom interior design services in Bareilly for master bedrooms, couple bedrooms, kids' bedrooms, teenagers' bedrooms, elders' bedrooms, guest bedrooms, shared sibling bedrooms and small bedrooms. Services include bedroom layout planning, bed and headboard design, wardrobe design, dressing area, study or work corner, false ceiling and lighting, wall treatment, flooring, curtains and window treatment, electrical planning, AC and fan planning, attached bathroom, woodwork and custom furniture, bedroom renovation and full home interiors.",
    url: "https://www.mtboss.in/interior-designer-for-bedroom-in-bareilly",
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
      "Interior Designer for Bedroom, Bedroom Interior Design, Master Bedroom Design, Bedroom Wardrobe Design, Kids Bedroom Design, Small Bedroom Design, Bedroom False Ceiling, Bedroom Renovation, Modular Wardrobe and Bedroom Interior Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does an interior designer for a bedroom do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A bedroom interior designer plans the layout, bed position, wardrobe, lighting, ceiling, finishes and furniture, coordinates the trades and manages the work until handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide bedroom interior design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your bedroom.",
        },
      },
      {
        "@type": "Question",
        name: "Which wardrobe is better, sliding or hinged?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sliding wardrobes save floor space and suit compact rooms, while hinged wardrobes give full access to every section. The right choice depends on your room size and habits.",
        },
      },
      {
        "@type": "Question",
        name: "How can I make a small bedroom look bigger?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Use light colours, mirrors, sliding wardrobe doors, a storage bed, wall-mounted furniture and closed storage to keep the room tidy and open.",
        },
      },
      {
        "@type": "Question",
        name: "Can you design a bedroom with a study corner or dressing area?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. If the room allows, a compact desk, shelves, dresser and proper lighting can be planned within the layout.",
        },
      },
      {
        "@type": "Question",
        name: "Can you renovate just one bedroom?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS can renovate a single bedroom or a few rooms, including storage, ceiling, lighting, painting and flooring.",
        },
      },
      {
        "@type": "Question",
        name: "Will I see the design before work starts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Layouts and designs are shared and refined with your feedback before execution begins, and scope and specifications are written down before work starts.",
        },
      },
      {
        "@type": "Question",
        name: "How much does bedroom interior design cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on room size, wardrobe type, bed and headboard design, ceiling and lighting, wall finishes, custom furniture and bathroom work. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS also handle electrical, AC planning and painting?",
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
        name: "Interior Designer for Bedroom in Bareilly",
        item: "https://www.mtboss.in/interior-designer-for-bedroom-in-bareilly",
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