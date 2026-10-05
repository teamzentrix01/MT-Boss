// app/(moradabad_keywords)/home-construction-contractor-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Home Construction Contractor in Moradabad | MTBOSS",

  description:
    "Need a home construction contractor in Moradabad for building or renovation? MTBOSS handles civil execution and materials. Call +91 94584 10866.",

  keywords:
    "home construction contractor Moradabad, house renovation contractor Moradabad, house extension construction Moradabad, civil contractor Moradabad, home building contractor near me Moradabad, floor addition construction Moradabad, MTBOSS Moradabad, home contractor cost Moradabad, MTBOSS budget calculator, home construction materials Moradabad, MTBOSS Kanth Road, house repair contractor Moradabad, home contractor quote Moradabad, MTBOSS civil contractor, residential construction execution Moradabad",

  alternates: {
    canonical:
      "https://www.mtboss.in/home-construction-contractor-in-moradabad",
  },

  openGraph: {
    title: "Home Construction Contractor in Moradabad | MTBOSS",

    description:
      "Need a home construction contractor in Moradabad for building or renovation? MTBOSS handles civil execution and materials. Call +91 94584 10866.",

    url: "https://www.mtboss.in/home-construction-contractor-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-home-contractor-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Home Construction Contractor in Moradabad - MTBOSS Construction",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Home Construction Contractor in Moradabad | MTBOSS",

    description:
      "Need a home construction contractor in Moradabad for building or renovation? MTBOSS handles civil execution and materials. Call +91 94584 10866.",

    images: ["https://www.mtboss.in/og-home-contractor-moradabad.jpg"],
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

    url: "https://www.mtboss.in/home-construction-contractor-in-moradabad",

    telephone: "+91-9458410866",

    email: "mtboss2016@gmail.com",

    image: "https://www.mtboss.in/og-home-contractor-moradabad.jpg",

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
        "@type": "AdministrativeArea",
        name: "Moradabad District",
      },
      {
        "@type": "State",
        name: "Uttar Pradesh",
      },
    ],

    serviceType: [
      "Home Construction Contractor",
      "Residential Civil Construction",
      "House Renovation Contractor",
      "House Extension Construction",
      "Floor Addition Construction",
      "Vertical Home Expansion",
      "Independent House Construction",
      "Boundary Wall Construction",
      "Home Repair Contractor",
      "Construction Material Supply",
      "Home Construction Cost Estimation",
      "Property Services",
      "Doorstep Home Maintenance Services",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",

    name: "Home Construction Contractor Services in Moradabad",

    description:
      "MTBOSS provides home construction contractor services in Moradabad, including civil execution, independent house construction, home renovation, room extension, floor addition, boundary wall construction and wholesale material supply.",

    url: "https://www.mtboss.in/home-construction-contractor-in-moradabad",

    provider: {
      "@type": "GeneralContractor",
      name: "MTBOSS Construction Private Limited",
      telephone: "+91-9458410866",
      email: "mtboss2016@gmail.com",
      url: "https://www.mtboss.in",
    },

    areaServed: {
      "@type": "City",
      name: "Moradabad",
    },

    serviceType:
      "Home Construction Contractor, House Renovation, Floor Addition and Residential Civil Execution Services",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",

    mainEntity: [
      {
        "@type": "Question",
        name: "What does a home construction contractor like MTBOSS actually do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS executes civil construction work including the foundation, structure, walls and finishing according to approved drawings. The company also supplies core building materials for the project.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS handle renovation of an existing home?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Renovation and upgrading of existing home structures, including flooring, plastering, waterproofing and extensions, falls within MTBOSS contractor-level scope.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS add a floor to my existing house?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Floor addition and vertical expansion are part of MTBOSS contractor services. A structural assessment of the existing foundation and structure is required before adding an additional floor.",
        },
      },
      {
        "@type": "Question",
        name: "Can I get a free quote for contractor-level execution from MTBOSS?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can use the Get a Construction Quote option on the MTBOSS website or contact the team directly by phone or WhatsApp.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS supply materials for home construction projects?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS supplies cement, TMT steel bars, bricks, tiles and paints on a wholesale basis for construction and renovation projects.",
        },
      },
      {
        "@type": "Question",
        name: "Can construction work be done while my family is still living in the house?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS aims to sequence renovation and extension work to reduce disruption where possible. The practical approach depends on the specific scope, structural work and occupied areas of the home.",
        },
      },
      {
        "@type": "Question",
        name: "How can I estimate contractor cost before contacting MTBOSS?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can use the free online MTBOSS Budget Calculator for an initial construction cost estimate before discussing your project in detail with the team.",
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
        name: "Home Construction Contractor in Moradabad",
        item: "https://www.mtboss.in/home-construction-contractor-in-moradabad",
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