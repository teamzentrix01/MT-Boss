// app/(moradabad_keywords)/factory-construction-company-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Factory Construction Company in Moradabad | MTBoss",

  description:
    "Build your factory with MTBoss, a factory construction company in Moradabad. Plan, build and hand over. Call +91 94584 10866 for a free quote.",

  keywords:
    "factory construction company Moradabad, factory building construction Moradabad, factory builder Moradabad, factory construction contractor Moradabad, manufacturing unit construction Moradabad, industrial plant construction Moradabad, factory construction cost Moradabad, factory plot Moradabad, factory shed construction Moradabad, factory layout planning Moradabad, industrial construction company Moradabad, MTBoss Moradabad, MTBoss Kanth Road, MTBoss budget calculator, construction quote Moradabad",

  alternates: {
    canonical:
      "https://www.MTBoss.in/factory-construction-company-in-moradabad",
  },

  openGraph: {
    title: "Factory Construction Company in Moradabad | MTBoss",

    description:
      "Build your factory with MTBoss, a factory construction company in Moradabad. Plan, build and hand over. Call +91 94584 10866 for a free quote.",

    url: "https://www.MTBoss.in/factory-construction-company-in-moradabad",

    siteName: "MTBoss Construction Private Limited",

    images: [
      {
        url: "https://www.MTBoss.in/og-factory-construction-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Factory Construction Company in Moradabad - MTBoss",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Factory Construction Company in Moradabad | MTBoss",

    description:
      "Build your factory with MTBoss, a factory construction company in Moradabad. Plan, build and hand over. Call +91 94584 10866 for a free quote.",

    images: [
      "https://www.MTBoss.in/og-factory-construction-moradabad.jpg",
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
    name: "MTBoss Construction Private Limited",
    url: "https://www.MTBoss.in/factory-construction-company-in-moradabad",
    telephone: "+91-9458410866",
    email: "MTBoss2016@gmail.com",
    image: "https://www.MTBoss.in/og-factory-construction-moradabad.jpg",
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
        "@type": "State",
        name: "Uttar Pradesh",
      },
    ],
    serviceType: [
      "Factory Construction Company",
      "Factory Building Construction",
      "Factory Builder",
      "Factory Construction Contractor",
      "Manufacturing Unit Construction",
      "Industrial Plant Construction",
      "Factory Shed Construction",
      "Factory Layout Planning",
      "Industrial Flooring",
      "Industrial Roofing",
      "Factory Extension",
      "Factory Renovation",
      "Construction Material Supply",
      "Factory Construction Cost Estimation",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Factory Construction Services in Moradabad",
    description:
      "MTBoss provides factory construction in Moradabad for manufacturing units and industrial plants, including plot review, layout planning, site development, foundations, structural framing, roofing, industrial flooring, drainage, offices, amenities, external works, material supply and final handover.",
    url: "https://www.MTBoss.in/factory-construction-company-in-moradabad",
    provider: {
      "@type": "GeneralContractor",
      name: "MTBoss Construction Private Limited",
      telephone: "+91-9458410866",
      email: "MTBoss2016@gmail.com",
      url: "https://www.MTBoss.in",
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
      "Factory Construction, Factory Building Construction, Manufacturing Unit Construction, Industrial Plant Construction and Factory Shed Construction",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does a factory construction company do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A factory construction company plans and builds factory buildings, handling site development, foundations, structure, roof, flooring, offices, drainage, external works and handover. The contractor coordinates labour, materials, quality, schedule and safety during construction.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBoss offer factory construction in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Industrial and warehousing construction is part of the MTBoss service list, alongside commercial, hotel, school, college, mall and residential construction projects in Moradabad and Bareilly.",
        },
      },
      {
        "@type": "Question",
        name: "What should I check before buying a plot for a factory?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Check road access for trucks, permitted land use, power and water availability, soil and ground levels, plot shape for efficient layout and room for future expansion. MTBoss engineers can review a plot's construction implications before you finalise.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBoss help me find a factory plot?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBoss offers verified property buying, selling and renting services in and around Moradabad. The team can also review construction implications of shortlisted plots to help you choose a suitable site.",
        },
      },
      {
        "@type": "Question",
        name: "Can I build a factory in phases?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, a phased approach can protect cash flow if planned from the start. Share your growth plans so the foundation, layout and service routes allow later expansion without major rework.",
        },
      },
      {
        "@type": "Question",
        name: "How much does factory construction cost in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Factory construction cost depends on built-up area, span, height, floor specification, roof and wall system, services scope, offices and amenities, external development, site conditions and material quality. MTBoss offers a free Budget Calculator and detailed quote option.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBoss supply building materials?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBoss supplies cement, TMT steel bars, bricks, tiles and paints through its wholesale material supply network, helping coordinate key materials during factory construction.",
        },
      },
      {
        "@type": "Question",
        name: "Where is the MTBoss office located?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The MTBoss office is located at Harthala, Kanth Road, Behind KR Collection, near Domino's, Moradabad, Uttar Pradesh.",
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
        item: "https://www.MTBoss.in/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Construction Services",
        item: "https://www.MTBoss.in/construction-services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Factory Construction Company in Moradabad",
        item: "https://www.MTBoss.in/factory-construction-company-in-moradabad",
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