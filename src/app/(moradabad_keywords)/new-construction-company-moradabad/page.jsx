// app/(moradabad_keywords)/new-construction-company-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "New Construction Company in Moradabad | MTBoss",

  description:
    "Looking for a new construction company in Moradabad? MTBoss offers design, quality materials and on-time handover. Call +91 94584 10866.",

  keywords:
    "new construction company Moradabad, new construction Moradabad, new house construction Moradabad, building construction company Moradabad, construction company in Moradabad, residential construction company Moradabad, commercial construction company Moradabad, turnkey construction Moradabad, construction contractor Moradabad, architect and builder Moradabad, construction cost Moradabad, MTBoss Moradabad, MTBoss Kanth Road, MTBoss budget calculator, construction quote Moradabad",

  alternates: {
    canonical:
      "https://www.MTBoss.in/new-construction-company-in-moradabad",
  },

  openGraph: {
    title: "New Construction Company in Moradabad | MTBoss",

    description:
      "Looking for a new construction company in Moradabad? MTBoss offers design, quality materials and on-time handover. Call +91 94584 10866.",

    url: "https://www.MTBoss.in/new-construction-company-in-moradabad",

    siteName: "MTBoss Construction Private Limited",

    images: [
      {
        url: "https://www.MTBoss.in/og-new-construction-company-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "New Construction Company in Moradabad - MTBoss",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "New Construction Company in Moradabad | MTBoss",

    description:
      "Looking for a new construction company in Moradabad? MTBoss offers design, quality materials and on-time handover. Call +91 94584 10866.",

    images: [
      "https://www.MTBoss.in/og-new-construction-company-moradabad.jpg",
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
    url: "https://www.MTBoss.in/new-construction-company-in-moradabad",
    telephone: "+91-9458410866",
    email: "MTBoss2016@gmail.com",
    image:
      "https://www.MTBoss.in/og-new-construction-company-moradabad.jpg",
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
      "New Construction Company",
      "New Construction",
      "New House Construction",
      "Building Construction Company",
      "Construction Company",
      "Residential Construction Company",
      "Commercial Construction Company",
      "Turnkey Construction",
      "Construction Contractor",
      "Architect and Builder",
      "Construction Cost Estimation",
      "Building Renovation",
      "Building Extension",
      "Construction Material Supply",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "New Construction Services in Moradabad",
    description:
      "MTBoss provides new construction services in Moradabad for houses, bungalows, duplex homes, farmhouses, multi storey buildings, commercial buildings, institutional buildings and specialist buildings, including design coordination, structure, facade, services provisions, waterproofing, flooring, finishing, modular kitchen and interiors, outdoor works and final handover.",
    url: "https://www.MTBoss.in/new-construction-company-in-moradabad",
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
      "New Construction Company, New Construction, New House Construction, Building Construction Company, Residential Construction Company, Commercial Construction Company, Turnkey Construction, Construction Contractor and Architect and Builder",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is new construction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "New construction is building a structure from the ground up on a plot or site, as opposed to renovating or extending an existing building. It includes design, structure, services, finishing and handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBoss handle new construction in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, MTBoss builds residential projects, from affordable housing to luxury villas, in Moradabad and Bareilly, and offers construction services for other buildings. Share your plan with the team to confirm the scope for your project.",
        },
      },
      {
        "@type": "Question",
        name: "What should I check before choosing a construction company?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Look at the scope of services, whether the estimate is itemised, material specifications, payment terms, timeline, past work, site supervision and after-handover support. A good company will answer these clearly.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBoss handle design as well as construction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, MTBoss is an architect, interior designer and construction company, so design, interiors and construction can be coordinated by one team.",
        },
      },
      {
        "@type": "Question",
        name: "How do I get an estimate for my project?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Start with the free Budget Calculator on the MTBoss website, then request a detailed quote after a site visit and design discussion.",
        },
      },
      {
        "@type": "Question",
        name: "How much does new construction cost in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on built-up area, number of floors, design complexity, material and finish level, interior scope, services scope and site conditions. MTBoss offers a free Budget Calculator and detailed quote option.",
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
        name: "New Construction Company in Moradabad",
        item: "https://www.MTBoss.in/new-construction-company-in-moradabad",
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