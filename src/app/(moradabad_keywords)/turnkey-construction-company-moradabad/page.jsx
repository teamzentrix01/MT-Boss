// app/(moradabad_keywords)/turnkey-construction-company-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Turnkey Construction Company in Moradabad | MTBOSS",

  description:
    "Looking for a turnkey construction company in Moradabad? MTBOSS manages design, construction, materials and handover. Call +91 94584 10866 for a free quote.",

  keywords:
    "turnkey construction company Moradabad, turnkey construction Moradabad, turnkey contractor Moradabad, turnkey project company Moradabad, construction company in Moradabad, building contractor Moradabad, commercial construction Moradabad, residential construction Moradabad, hotel construction Moradabad, industrial construction Moradabad, warehouse construction Moradabad, design and build company Moradabad, construction cost Moradabad, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad",

  alternates: {
    canonical:
      "https://www.mtboss.in/turnkey-construction-company-in-moradabad",
  },

  openGraph: {
    title: "Turnkey Construction Company in Moradabad | MTBOSS",

    description:
      "Looking for a turnkey construction company in Moradabad? MTBOSS manages design, construction, materials and handover. Call +91 94584 10866 for a free quote.",

    url: "https://www.mtboss.in/turnkey-construction-company-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-turnkey-construction-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Turnkey Construction Company in Moradabad - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Turnkey Construction Company in Moradabad | MTBOSS",

    description:
      "Looking for a turnkey construction company in Moradabad? MTBOSS manages design, construction, materials and handover. Call +91 94584 10866 for a free quote.",

    images: [
      "https://www.mtboss.in/og-turnkey-construction-moradabad.jpg",
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

    url: "https://www.mtboss.in/turnkey-construction-company-in-moradabad",

    telephone: "+91-9458410866",

    email: "mtboss2016@gmail.com",

    image: "https://www.mtboss.in/og-turnkey-construction-moradabad.jpg",

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
      "Turnkey Construction",
      "Turnkey Project Management",
      "Residential Construction",
      "Commercial Construction",
      "Hotel Construction",
      "Hospitality Construction",
      "Industrial Construction",
      "Warehouse Construction",
      "Godown Construction",
      "Factory Shed Construction",
      "Architecture and Design Coordination",
      "Interior Design Services",
      "Construction Material Supply",
      "Construction Cost Estimation",
      "Building Renovation and Repair",
      "Property Services",
      "Doorstep Maintenance Services",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",

    name: "Turnkey Construction Services in Moradabad",

    description:
      "MTBOSS provides turnkey construction services in Moradabad, including design coordination, floor planning, elevation, civil construction, material supply, electrical work, plumbing, waterproofing, finishing, interiors and final handover for residential, commercial, hospitality and industrial projects.",

    url: "https://www.mtboss.in/turnkey-construction-company-in-moradabad",

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
      "Turnkey Construction, Residential Construction, Commercial Construction, Hotel Construction, Industrial Construction and Warehouse Construction Services",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",

    mainEntity: [
      {
        "@type": "Question",
        name: "What is a turnkey construction company?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A turnkey construction company handles the complete project, including planning, design, materials, civil construction, finishing and final handover. The client receives a finished, ready-to-use building.",
        },
      },
      {
        "@type": "Question",
        name: "Is MTBOSS a turnkey construction company in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS combines design coordination, civil construction, material supply, finishing and handover under one company for projects in Moradabad and Bareilly.",
        },
      },
      {
        "@type": "Question",
        name: "What types of turnkey construction projects does MTBOSS handle?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS handles residential homes and villas, duplexes, commercial buildings, shops, showrooms, offices, hotels, hospitality projects, industrial buildings, warehouse projects, godowns and supporting infrastructure work.",
        },
      },
      {
        "@type": "Question",
        name: "What is included in a turnkey construction contract?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A turnkey construction contract typically covers planning, design, estimation, foundation and structure, masonry, electrical work, plumbing, waterproofing, flooring, painting, finishing, fixtures and final handover. The exact project scope is confirmed before construction begins.",
        },
      },
      {
        "@type": "Question",
        name: "How much does turnkey construction cost in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Turnkey construction cost depends on built-up area, building type, number of floors, material quality, design complexity, finishing level, interior scope and site conditions. MTBOSS offers a free Budget Calculator and project-specific construction quotes.",
        },
      },
      {
        "@type": "Question",
        name: "How is turnkey construction different from hiring separate contractors?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "With turnkey construction, one company coordinates design, construction, material supply and finishing under one agreement. This reduces coordination gaps between separate vendors and gives the client one point of contact for cost, quality and timelines.",
        },
      },
      {
        "@type": "Question",
        name: "Can I get a free construction quote from MTBOSS?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can use the Get a Construction Quote option on the MTBOSS website or contact the team directly through phone or WhatsApp for an initial project discussion and quote request.",
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
        name: "Turnkey Construction Company in Moradabad",
        item: "https://www.mtboss.in/turnkey-construction-company-in-moradabad",
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