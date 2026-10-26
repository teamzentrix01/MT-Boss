// app/(bareilly_keywords)/interior-designer-near-me-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer Near Me in Bareilly | MTBOSS",

  description:
    "Searching for an interior designer near you in Bareilly? Talk to MTBOSS on WhatsApp and plan your site visit. Call +91 94584 10866.",

  keywords:
    "interior designer near me Bareilly, interior designer near me, local interior designer Bareilly, interior design services in Bareilly, home interior designer Bareilly, modular kitchen near me Bareilly, interior designer for flat Bareilly, interior designer for house Bareilly, office interior near me Bareilly, interior designer site visit Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, interior design quote Bareilly",

  alternates: {
    canonical: "https://www.MTBOSS.in/interior-designer-near-me-bareilly",
  },

  openGraph: {
    title: "Interior Designer Near Me in Bareilly | MTBOSS",

    description:
      "Searching for an interior designer near you in Bareilly? Talk to MTBOSS on WhatsApp and plan your site visit. Call +91 94584 10866.",

    url: "https://www.MTBOSS.in/interior-designer-near-me-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.MTBOSS.in/og-interior-designer-near-me-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer Near Me in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Designer Near Me in Bareilly | MTBOSS",

    description:
      "Searching for an interior designer near you in Bareilly? Talk to MTBOSS on WhatsApp and plan your site visit. Call +91 94584 10866.",

    images: [
      "https://www.MTBOSS.in/og-interior-designer-near-me-bareilly.jpg",
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
    url: "https://www.MTBOSS.in/interior-designer-near-me-bareilly",
    telephone: "+91-9458410866",
    email: "MTBOSS2016@gmail.com",
    image:
      "https://www.MTBOSS.in/og-interior-designer-near-me-bareilly.jpg",
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
      "Interior Designer Near Me Bareilly",
      "Local Interior Designer",
      "Interior Design Services",
      "Home Interior Designer",
      "Modular Kitchen Design",
      "Interior Designer for Flat",
      "Interior Designer for House",
      "Office Interior Design",
      "Interior Designer Site Visit",
      "Interior Design Quote",
      "Interior Renovation",
      "False Ceiling Design",
      "Wardrobe Design",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Interior Design Services in Bareilly",
    description:
      "MTBOSS provides interior design services for homes, flats, offices, showrooms and clinics in Bareilly. Services include site visits and measurement, space planning, living and dining areas, modular kitchens, bedrooms and wardrobes, puja room design, false ceilings and lighting, flooring and wall finishes, woodwork and custom furniture, bathroom interiors, construction coordination, material supply, renovation and remodelling.",
    url: "https://www.MTBOSS.in/interior-designer-near-me-bareilly",
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
      "Local Interior Designer Bareilly, Interior Design Services, Home Interior Designer, Modular Kitchen Design, Interior Designer for Flat, Interior Designer for House, Office Interior Design and Interior Designer Site Visit",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is there an MTBOSS office in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The MTBOSS office is in Harthala, Kanth Road, Moradabad. The team serves clients in Bareilly, and you can start by phone or WhatsApp.",
        },
      },
      {
        "@type": "Question",
        name: "Will someone visit my home in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Site visits are part of the process, because accurate measurements and site conditions are needed for design and estimates. Share your locality, and the team will confirm arrangements.",
        },
      },
      {
        "@type": "Question",
        name: "Can I start the process online?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can share photos, floor plans and preferences by WhatsApp, and use the free Budget Calculator on the website for a first idea of cost. A site visit is still needed before final designs and estimates.",
        },
      },
      {
        "@type": "Question",
        name: "Can you design interiors for a flat?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Flats need careful planning around fixed walls, society rules and lift access for materials. Share your floor plan, and the team can suggest options.",
        },
      },
      {
        "@type": "Question",
        name: "Can you do only a kitchen or wardrobe?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, you can start with a single room or item, or plan the full home. Tell the team what you need at the first contact.",
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
        name: "Interior Designer Near Me in Bareilly",
        item: "https://www.MTBOSS.in/interior-designer-near-me-bareilly",
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