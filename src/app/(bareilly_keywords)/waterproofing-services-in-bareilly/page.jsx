// app/(bareilly_keywords)/waterproofing-services-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Waterproofing Services in Bareilly | MTBOSS",

  description:
    "Need waterproofing services in Bareilly? MTBOSS fixes terrace, bathroom and wall leakage with site inspection and clear costs. Call +91 94584 10866.",

  keywords:
    "waterproofing services in Bareilly, terrace waterproofing Bareilly, bathroom waterproofing Bareilly, wall leakage repair Bareilly, roof leakage solution Bareilly, damp proofing Bareilly, basement waterproofing Bareilly, water tank waterproofing Bareilly, waterproofing cost Bareilly, building repair Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, waterproofing quote Bareilly",

  alternates: {
    canonical: "https://www.mtboss.in/waterproofing-services-in-bareilly",
  },

  openGraph: {
    title: "Waterproofing Services in Bareilly | MTBOSS",

    description:
      "Need waterproofing services in Bareilly? MTBOSS fixes terrace, bathroom and wall leakage with site inspection and clear costs. Call +91 94584 10866.",

    url: "https://www.mtboss.in/waterproofing-services-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-waterproofing-services-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Waterproofing Services in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Waterproofing Services in Bareilly | MTBOSS",

    description:
      "Need waterproofing services in Bareilly? MTBOSS fixes terrace, bathroom and wall leakage with site inspection and clear costs. Call +91 94584 10866.",

    images: ["https://www.mtboss.in/og-waterproofing-services-bareilly.jpg"],
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
    url: "https://www.mtboss.in/waterproofing-services-in-bareilly",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image: "https://www.mtboss.in/og-waterproofing-services-bareilly.jpg",
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
      "Waterproofing Services",
      "Terrace Waterproofing",
      "Bathroom Waterproofing",
      "Wall Leakage Repair",
      "Roof Leakage Solution",
      "Damp Proofing",
      "Basement Waterproofing",
      "Water Tank Waterproofing",
      "Waterproofing Cost",
      "Building Repair",
      "Waterproofing Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Waterproofing Services in Bareilly",
    description:
      "MTBOSS provides waterproofing services in Bareilly. Services include site inspection, terrace and roof waterproofing, bathroom and toilet waterproofing, kitchen and wet area waterproofing, balcony and sunshade waterproofing, external wall waterproofing, damp proofing, basement and underground structure waterproofing, water tank waterproofing, crack repair and joint sealing, pre-construction waterproofing advice, finishing after repair, renovation of existing buildings, material supply and home services.",
    url: "https://www.mtboss.in/waterproofing-services-in-bareilly",
    provider: {
      "@type": "HomeAndConstructionBusiness",
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
      "Waterproofing Services, Terrace Waterproofing, Bathroom Waterproofing, Wall Leakage Repair, Roof Leakage Solution, Damp Proofing, Basement Waterproofing, Water Tank Waterproofing, Waterproofing Cost, Building Repair and Waterproofing Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What do waterproofing services include?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "They usually cover site inspection, finding the source of leakage, surface preparation, application of waterproofing layers, testing and restoration of finishes. The exact scope is written in the agreement.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide waterproofing services in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your building.",
        },
      },
      {
        "@type": "Question",
        name: "Which areas of a house need waterproofing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Terraces, bathrooms, kitchens, balconies, external walls, water tanks and basements are the most common. Window and door gaps and pipe openings also need attention.",
        },
      },
      {
        "@type": "Question",
        name: "Can leakage be repaired from inside the room?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sometimes. Internal treatment can reduce dampness, but leaks usually need to be treated at the source, such as the terrace or the bathroom above. An inspection shows the right approach.",
        },
      },
      {
        "@type": "Question",
        name: "When should I waterproof my terrace?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Before the monsoon is ideal, but treatment can be done at any time when surfaces are dry enough. Early action at the first sign of leakage keeps repair simple.",
        },
      },
      {
        "@type": "Question",
        name: "Will I see the plan before work starts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The treatment plan, scope and specifications are explained and written down before work begins, so you know what will be done and where.",
        },
      },
      {
        "@type": "Question",
        name: "How much do waterproofing services cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on the area, method, surface condition, severity of leakage, access and finishing needed. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote after inspection.",
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
        name: "Construction and Repair Services",
        item: "https://www.mtboss.in/construction-and-repair-services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Waterproofing Services in Bareilly",
        item: "https://www.mtboss.in/waterproofing-services-in-bareilly",
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