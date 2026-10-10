// app/(moradabad_keywords)/industrial-construction-company-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Industrial Construction Company in Moradabad | MTBOSS",

  description:
    "Need an industrial construction company in Moradabad? MTBOSS builds factories, sheds and warehouses. Call +91 94584 10866 for a free quote.",

  keywords:
    "industrial construction company Moradabad, industrial building construction Moradabad, factory construction Moradabad, warehouse construction Moradabad, industrial shed construction Moradabad, godown construction Moradabad, industrial contractor Moradabad, factory building contractor Moradabad, industrial construction cost Moradabad, manufacturing unit construction Moradabad, commercial construction company Moradabad, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad",

  alternates: {
    canonical:
      "https://www.mtboss.in/industrial-construction-company-in-moradabad",
  },

  openGraph: {
    title: "Industrial Construction Company in Moradabad | MTBOSS",

    description:
      "Need an industrial construction company in Moradabad? MTBOSS builds factories, sheds and warehouses. Call +91 94584 10866 for a free quote.",

    url: "https://www.mtboss.in/industrial-construction-company-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-industrial-construction-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Industrial Construction Company in Moradabad - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Industrial Construction Company in Moradabad | MTBOSS",

    description:
      "Need an industrial construction company in Moradabad? MTBOSS builds factories, sheds and warehouses. Call +91 94584 10866 for a free quote.",

    images: [
      "https://www.mtboss.in/og-industrial-construction-moradabad.jpg",
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
      "https://www.mtboss.in/industrial-construction-company-in-moradabad",

    telephone: "+91-9458410866",

    email: "mtboss2016@gmail.com",

    image:
      "https://www.mtboss.in/og-industrial-construction-moradabad.jpg",

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
      "Industrial Construction",
      "Industrial Building Construction",
      "Factory Construction",
      "Manufacturing Unit Construction",
      "Warehouse Construction",
      "Godown Construction",
      "Industrial Shed Construction",
      "Factory Building Contractor",
      "Industrial Contractor",
      "Industrial RCC Construction",
      "Industrial Flooring",
      "Industrial Roofing",
      "Industrial Site Development",
      "Industrial Renovation and Expansion",
      "Construction Material Supply",
      "Industrial Construction Cost Estimation",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",

    name: "Industrial Construction Services in Moradabad",

    description:
      "MTBOSS provides industrial construction in Moradabad for factories, manufacturing units, workshops, warehouses, godowns and industrial sheds, including site development, foundations, structure, industrial flooring, roofing, drainage, offices, material supply and handover.",

    url:
      "https://www.mtboss.in/industrial-construction-company-in-moradabad",

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
      "Industrial Construction, Factory Construction, Warehouse Construction, Godown Construction, Industrial Shed Construction and Manufacturing Unit Construction",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",

    mainEntity: [
      {
        "@type": "Question",
        name: "What does an industrial construction company do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "An industrial construction company plans and builds industrial properties such as factories, workshops, warehouses, godowns and sheds. It can handle site development, foundations, structure, industrial flooring, roofing, drainage, services coordination, finishing and handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS offer industrial construction in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Industrial and warehousing construction is part of the MTBOSS service list, alongside commercial, hotel, school, college, mall, infrastructure and residential construction projects in Moradabad and Bareilly.",
        },
      },
      {
        "@type": "Question",
        name: "What types of industrial buildings can MTBOSS build?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS can discuss construction scope for factories, manufacturing units, workshops, warehouses, godowns, industrial sheds, storage buildings and mixed industrial units with office and staff areas.",
        },
      },
      {
        "@type": "Question",
        name: "Why is flooring important in an industrial building?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Industrial floors carry machinery, stacked goods, forklifts, loaders and other vehicles every day. Floor strength, levels, reinforcement, concrete quality, curing and finishing directly affect operational efficiency, safety and maintenance costs.",
        },
      },
      {
        "@type": "Question",
        name: "What approvals are needed for an industrial building?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Industrial projects can require land-use permission, sanctioned building plans, fire-safety provisions, utility connections and activity-specific licences or environmental requirements. Rules vary by location, activity and current regulations, so confirm the latest requirements with relevant authorities.",
        },
      },
      {
        "@type": "Question",
        name: "How much does industrial construction cost in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Industrial construction cost depends on built-up area, span, height, structural system, flooring specification, roofing, services, office areas, external development, material quality and site conditions. MTBOSS offers a free Budget Calculator and detailed quote option.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS supply building materials?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS supplies cement, TMT steel bars, bricks, tiles and paints through its wholesale material supply network, helping coordinate material delivery during industrial construction.",
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
        name: "Industrial Construction Company in Moradabad",
        item: "https://www.mtboss.in/industrial-construction-company-in-moradabad",
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