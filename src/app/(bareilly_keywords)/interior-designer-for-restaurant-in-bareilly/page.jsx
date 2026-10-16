// app/(bareilly_keywords)/interior-designer-for-restaurant-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer for Restaurant in Bareilly | MTBOSS",

  description:
    "Need an interior designer for your restaurant in Bareilly? Plan layout, kitchen flow, lighting and ambience with MTBOSS. Call +91 94584 10866.",

  keywords:
    "interior designer for restaurant in Bareilly, restaurant interior design Bareilly, cafe interior design Bareilly, restaurant design Bareilly, hotel restaurant interior Bareilly, fast food outlet interior Bareilly, restaurant layout Bareilly, restaurant lighting design Bareilly, restaurant kitchen planning Bareilly, commercial interior Bareilly, restaurant renovation Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, restaurant interior quote Bareilly",

  alternates: {
    canonical:
      "https://www.mtboss.in/interior-designer-for-restaurant-in-bareilly",
  },

  openGraph: {
    title: "Interior Designer for Restaurant in Bareilly | MTBOSS",

    description:
      "Need an interior designer for your restaurant in Bareilly? Plan layout, kitchen flow, lighting and ambience with MTBOSS. Call +91 94584 10866.",

    url: "https://www.mtboss.in/interior-designer-for-restaurant-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-interior-designer-restaurant-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer for Restaurant in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Designer for Restaurant in Bareilly | MTBOSS",

    description:
      "Need an interior designer for your restaurant in Bareilly? Plan layout, kitchen flow, lighting and ambience with MTBOSS. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-interior-designer-restaurant-bareilly.jpg",
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
    url: "https://www.mtboss.in/interior-designer-for-restaurant-in-bareilly",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-interior-designer-restaurant-bareilly.jpg",
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
      "Interior Designer for Restaurant",
      "Restaurant Interior Design",
      "Cafe Interior Design",
      "Restaurant Design",
      "Hotel Restaurant Interior Design",
      "Fast Food Outlet Interior Design",
      "Restaurant Layout Design",
      "Restaurant Lighting Design",
      "Restaurant Kitchen Planning",
      "Commercial Interior Design",
      "Restaurant Renovation",
      "Restaurant Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Restaurant Interior Design Services in Bareilly",
    description:
      "MTBOSS provides restaurant and cafe interior design services in Bareilly, including concept and space planning, dining layouts, kitchen and service planning, facade and entrance design, ceiling and lighting design, wall and furniture design, flooring and finishes, washroom planning, services provisions, branding elements, construction coordination, material supply, renovation and remodelling.",
    url: "https://www.mtboss.in/interior-designer-for-restaurant-in-bareilly",
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
      "Interior Designer for Restaurant, Restaurant Interior Design, Cafe Interior Design, Restaurant Layout Design, Restaurant Lighting Design, Restaurant Kitchen Planning, Commercial Interior Design and Restaurant Renovation",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does a restaurant interior designer do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A restaurant interior designer plans the dining layout, kitchen workflow, lighting, seating, finishes and branding so the space works well for guests and staff, and coordinates the work until opening.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide restaurant interior design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your restaurant or cafe.",
        },
      },
      {
        "@type": "Question",
        name: "Can you design a cafe or small outlet?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, the planning approach applies to cafes, fast food outlets, sweet shops and larger restaurants alike. Share your concept, area and budget, and the team can suggest options.",
        },
      },
      {
        "@type": "Question",
        name: "Do you supply kitchen equipment?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Kitchen equipment and exhaust systems are usually supplied and installed by specialist vendors. MTBOSS plans and builds the interior and civil work, and coordinates with your vendors so provisions fit together.",
        },
      },
      {
        "@type": "Question",
        name: "Can an existing shop be converted into a restaurant?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In many cases, yes, subject to the building's structure, permitted use and local rules. A site visit helps the team assess what is possible.",
        },
      },
      {
        "@type": "Question",
        name: "How long does a restaurant interior take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The time depends on size, scope and design complexity. The team will give a milestone-based timeline in writing after discussing your project, so you can plan your opening date.",
        },
      },
      {
        "@type": "Question",
        name: "How much does restaurant interior design cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on area, number of seats, concept and finish level, kitchen scope, ceiling and lighting design, furniture, facade and site conditions. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
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
        name: "Interior Designer for Restaurant in Bareilly",
        item: "https://www.mtboss.in/interior-designer-for-restaurant-in-bareilly",
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