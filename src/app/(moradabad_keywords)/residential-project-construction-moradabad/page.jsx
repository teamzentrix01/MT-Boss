// app/(moradabad_keywords)/residential-project-construction-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Residential Project Construction in Moradabad | MTBOSS",

  description:
    "Planning a residential project in Moradabad? MTBOSS handles design, construction, materials and handover. Call +91 94584 10866 for a free quote.",

  keywords:
    "residential project construction Moradabad, residential projects Moradabad, residential building construction Moradabad, builder floor construction Moradabad, multi-storey residential building Moradabad, apartment building construction Moradabad, housing project construction Moradabad, residential construction company Moradabad, residential construction cost Moradabad, rental building construction Moradabad, MTBOSS residential projects, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad",

  alternates: {
    canonical:
      "https://www.mtboss.in/residential-project-construction-in-moradabad",
  },

  openGraph: {
    title: "Residential Project Construction in Moradabad | MTBOSS",

    description:
      "Planning a residential project in Moradabad? MTBOSS handles design, construction, materials and handover. Call +91 94584 10866 for a free quote.",

    url: "https://www.mtboss.in/residential-project-construction-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-residential-project-construction-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Residential Project Construction in Moradabad - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Residential Project Construction in Moradabad | MTBOSS",

    description:
      "Planning a residential project in Moradabad? MTBOSS handles design, construction, materials and handover. Call +91 94584 10866 for a free quote.",

    images: [
      "https://www.mtboss.in/og-residential-project-construction-moradabad.jpg",
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
    "@type": "GeneralContractor",

    name: "MTBOSS Construction Private Limited",

    url:
      "https://www.mtboss.in/residential-project-construction-in-moradabad",

    telephone: "+91-9458410866",

    email: "mtboss2016@gmail.com",

    image:
      "https://www.mtboss.in/og-residential-project-construction-moradabad.jpg",

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
        name: "Moradabad",
      },
      {
        "@type": "City",
        name: "Bareilly",
      },
      {
        "@type": "AdministrativeArea",
        name: "Moradabad District",
      },
      {
        "@type": "State",
        name: "Uttar Pradesh",
      },
    ],

    serviceType: [
      "Residential Project Construction",
      "Residential Building Construction",
      "Builder Floor Construction",
      "Multi Storey Residential Building Construction",
      "Apartment Building Construction",
      "Housing Project Construction",
      "Rental Building Construction",
      "Independent House Construction",
      "Duplex Construction",
      "Villa Construction",
      "Residential RCC Construction",
      "Residential Project Planning",
      "Construction Material Supply",
      "Residential Construction Cost Estimation",
      "Residential Renovation and Extension",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",

    name: "Residential Project Construction Services in Moradabad",

    description:
      "MTBOSS provides residential project construction in Moradabad, including builder floors, multi-storey residential buildings, rental buildings, independent houses, duplexes, villas, design coordination, RCC structure, material supply, finishing and final handover.",

    url:
      "https://www.mtboss.in/residential-project-construction-in-moradabad",

    provider: {
      "@type": "GeneralContractor",
      name: "MTBOSS Construction Private Limited",
      telephone: "+91-9458410866",
      email: "mtboss2016@gmail.com",
      url: "https://www.mtboss.in",
    },

    areaServed: [
      {
        "@type": "City",
        name: "Moradabad",
      },
      {
        "@type": "City",
        name: "Bareilly",
      },
    ],

    serviceType:
      "Residential Project Construction, Builder Floor Construction, Multi Storey Residential Building Construction, Housing Project Construction and Rental Building Construction",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",

    mainEntity: [
      {
        "@type": "Question",
        name: "What is residential project construction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Residential project construction is the planning and construction of residential properties such as independent houses, duplexes, builder floors, rental buildings, multi-storey family buildings and housing projects from design to final handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS handle residential projects in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Residential projects are a listed MTBOSS service category, covering affordable homes, independent houses, duplexes, villas and multi-storey residential buildings in Moradabad and Bareilly.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS build builder floors or multi-storey residential buildings?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS can discuss multi-storey residential construction, builder floors, rental buildings and family buildings based on your plot, approved drawings, number of floors, project requirements and applicable permissions.",
        },
      },
      {
        "@type": "Question",
        name: "How much does residential project construction cost in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Residential project cost depends on built-up area, number of floors, number of units, structure, material quality, finishing level, interiors, design complexity and site conditions. MTBOSS provides a free Budget Calculator and detailed quote option.",
        },
      },
      {
        "@type": "Question",
        name: "How long does a residential construction project take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Project timeline depends on built-up area, number of floors, design complexity, site conditions, material availability, weather and finishing scope. MTBOSS discusses milestones, timeline and payment stages before construction begins.",
        },
      },
      {
        "@type": "Question",
        name: "Can I manage a residential project from outside Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. With design coordination, material supply and construction managed under one company, owners can receive project updates through phone, WhatsApp and email without visiting the site daily.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS supply building materials for residential projects?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS supplies cement, TMT steel bars, bricks, tiles and paints through its wholesale material supply network, helping coordinate material delivery during residential construction.",
        },
      },
      {
        "@type": "Question",
        name: "Where is the MTBOSS office located?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The MTBOSS office is located at Harthala, Kanth Road, Behind KR Collection, near Domino's, Moradabad, Uttar Pradesh.",
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
        name: "Construction Services",
        item: "https://www.mtboss.in/construction-services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Residential Project Construction in Moradabad",
        item: "https://www.mtboss.in/residential-project-construction-in-moradabad",
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