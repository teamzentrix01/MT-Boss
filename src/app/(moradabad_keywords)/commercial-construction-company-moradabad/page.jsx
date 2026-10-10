// app/(moradabad_keywords)/commercial-construction-company-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Commercial Construction Company in Moradabad | MTBOSS",

  description:
    "MTBOSS is a commercial construction company in Moradabad for shops, offices, showrooms, malls and more. Call +91 94584 10866 for a free quote.",

  keywords:
    "commercial construction company Moradabad, commercial building construction Moradabad, commercial contractor Moradabad, shop construction Moradabad, showroom construction Moradabad, office building construction Moradabad, mall construction Moradabad, school construction Moradabad, college construction Moradabad, warehouse construction Moradabad, commercial complex construction Moradabad, commercial construction cost Moradabad, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad",

  alternates: {
    canonical:
      "https://www.mtboss.in/commercial-construction-company-in-moradabad",
  },

  openGraph: {
    title: "Commercial Construction Company in Moradabad | MTBOSS",

    description:
      "MTBOSS is a commercial construction company in Moradabad for shops, offices, showrooms, malls and more. Call +91 94584 10866 for a free quote.",

    url: "https://www.mtboss.in/commercial-construction-company-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-commercial-construction-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Commercial Construction Company in Moradabad - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Commercial Construction Company in Moradabad | MTBOSS",

    description:
      "MTBOSS is a commercial construction company in Moradabad for shops, offices, showrooms, malls and more. Call +91 94584 10866 for a free quote.",

    images: [
      "https://www.mtboss.in/og-commercial-construction-moradabad.jpg",
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
      "https://www.mtboss.in/commercial-construction-company-in-moradabad",

    telephone: "+91-9458410866",

    email: "mtboss2016@gmail.com",

    image:
      "https://www.mtboss.in/og-commercial-construction-moradabad.jpg",

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
      "Commercial Construction",
      "Commercial Building Construction",
      "Commercial Contractor",
      "Shop Construction",
      "Showroom Construction",
      "Office Building Construction",
      "Commercial Complex Construction",
      "Mall Construction",
      "School Construction",
      "College Construction",
      "Hotel Construction",
      "Warehouse Construction",
      "Industrial Construction",
      "Retail Space Construction",
      "Commercial Renovation and Repair",
      "Commercial Interior Coordination",
      "Construction Material Supply",
      "Commercial Construction Cost Estimation",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",

    name: "Commercial Construction Services in Moradabad",

    description:
      "MTBOSS provides commercial construction in Moradabad for shops, showrooms, offices, commercial complexes, malls, schools, colleges, hotels, warehouses and industrial buildings, including planning, RCC construction, material supply, finishing and handover.",

    url:
      "https://www.mtboss.in/commercial-construction-company-in-moradabad",

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
      "Commercial Construction, Commercial Building Construction, Shop Construction, Showroom Construction, Office Construction, Mall Construction, School Construction and Warehouse Construction",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",

    mainEntity: [
      {
        "@type": "Question",
        name: "What does a commercial construction company do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A commercial construction company plans and builds properties for business use, including shops, showrooms, offices, commercial complexes, malls, schools, hotels and warehouses. It can coordinate design, civil construction, building services, finishing and handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS offer commercial construction in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Commercial construction is part of the MTBOSS service range, alongside hotel, school, college, mall, industrial, infrastructure and residential construction projects in Moradabad and Bareilly.",
        },
      },
      {
        "@type": "Question",
        name: "What types of commercial buildings can MTBOSS build?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS can discuss project scope for shops, showrooms, offices, commercial complexes, malls, schools, colleges, hotels, guest houses, warehouses, godowns, factory sheds and mixed-use buildings.",
        },
      },
      {
        "@type": "Question",
        name: "How is commercial construction different from residential construction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Commercial construction focuses on business operations, customer flow, visibility, parking, flexible space, higher electrical loads, wider spans, durability under heavy use and opening-date timelines. These requirements can differ significantly from family-home construction.",
        },
      },
      {
        "@type": "Question",
        name: "How much does commercial construction cost in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Commercial construction cost depends on built-up area, building type, number of floors, structural requirements, services, material quality, finishing level, facade scope and site conditions. MTBOSS provides a free Budget Calculator and detailed quote option.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS renovate or extend an existing commercial building?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS can discuss renovation, repair, waterproofing, extra-floor construction, remodelling and facade upgrades for existing commercial properties. Share your project requirements for a site assessment.",
        },
      },
      {
        "@type": "Question",
        name: "Can I manage a commercial project from outside Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. With design coordination, materials and construction managed under one company, owners can receive project updates through phone, WhatsApp and email without visiting the site every day.",
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
        name: "Commercial Construction Company in Moradabad",
        item: "https://www.mtboss.in/commercial-construction-company-in-moradabad",
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