// app/(bareilly_keywords)/interior-designer-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer in Bareilly | MTBOSS",

  description:
    "Looking for an interior designer in Bareilly? MTBOSS offers home and office interiors, modular kitchens and on-time handover. Call +91 94584 10866.",

  keywords:
    "interior designer in Bareilly, interior design Bareilly, home interior Bareilly, modular kitchen Bareilly, office interior Bareilly, false ceiling design Bareilly, wardrobe design Bareilly, living room interior Bareilly, bedroom interior Bareilly, interior designer and builder Bareilly, interior design cost Bareilly, architect and interior designer Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, interior design quote Bareilly",

  alternates: {
    canonical: "https://www.MTBOSS.in/interior-designer-in-bareilly",
  },

  openGraph: {
    title: "Interior Designer in Bareilly | MTBOSS",

    description:
      "Looking for an interior designer in Bareilly? MTBOSS offers home and office interiors, modular kitchens and on-time handover. Call +91 94584 10866.",

    url: "https://www.MTBOSS.in/interior-designer-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.MTBOSS.in/og-interior-designer-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Designer in Bareilly | MTBOSS",

    description:
      "Looking for an interior designer in Bareilly? MTBOSS offers home and office interiors, modular kitchens and on-time handover. Call +91 94584 10866.",

    images: ["https://www.MTBOSS.in/og-interior-designer-bareilly.jpg"],
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
    url: "https://www.MTBOSS.in/interior-designer-in-bareilly",
    telephone: "+91-9458410866",
    email: "MTBOSS2016@gmail.com",
    image: "https://www.MTBOSS.in/og-interior-designer-bareilly.jpg",
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
      "Interior Designer in Bareilly",
      "Interior Design",
      "Home Interior",
      "Modular Kitchen",
      "Office Interior",
      "False Ceiling Design",
      "Wardrobe Design",
      "Living Room Interior",
      "Bedroom Interior",
      "Interior Designer and Builder",
      "Interior Design Cost Estimation",
      "Architect and Interior Designer",
      "Interior Renovation",
      "Interior Design Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Interior Design Services in Bareilly",
    description:
      "MTBOSS provides interior design services in Bareilly for homes, flats, offices, showrooms and clinics, including space planning, living room interiors, modular kitchens, bedroom interiors, wardrobes and storage, puja room design, false ceiling and lighting, flooring and wall finishes, doors, windows and woodwork, bathroom interiors, commercial interiors, coordination with construction, material supply and renovation and remodelling.",
    url: "https://www.MTBOSS.in/interior-designer-in-bareilly",
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
      "Interior Designer in Bareilly, Interior Design, Home Interior, Modular Kitchen, Office Interior, False Ceiling Design, Wardrobe Design, Living Room Interior, Bedroom Interior and Interior Designer and Builder",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does an interior designer do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "An interior designer plans how a space will look and work, including layout, furniture, storage, lighting, colours and finishes, and coordinates the work until it is completed.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide interior design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your location.",
        },
      },
      {
        "@type": "Question",
        name: "Can you design only a kitchen or wardrobe?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, you can start with a single room or item, or plan the full home. Tell the team what you need at the first consultation.",
        },
      },
      {
        "@type": "Question",
        name: "Can interiors be done together with construction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Coordinating interiors with construction helps wiring, plumbing and ceilings fit the design from the start, and often saves time and cost.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to be present during the work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Not every day, but decisions on finishes, colours and fixtures need to be made on time. The team can agree on how you want updates, such as photos, calls or visits.",
        },
      },
      {
        "@type": "Question",
        name: "How much does interior design cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on area, scope, material and finish level, kitchen and wardrobe specifications, ceiling and lighting design, custom furniture and site conditions. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
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
        name: "Interior Designer in Bareilly",
        item: "https://www.MTBOSS.in/interior-designer-in-bareilly",
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