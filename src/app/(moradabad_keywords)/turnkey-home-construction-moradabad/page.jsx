// app/(moradabad_keywords)/turnkey-home-construction-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Turnkey Home Construction in Moradabad | MTBOSS",

  description:
    "Need turnkey home construction in Moradabad? MTBOSS handles design, build, materials and handover in one place.",

  keywords:
    "turnkey home construction Moradabad, turnkey construction company Moradabad, turnkey house construction Moradabad, turnkey home builders Moradabad, complete home construction Moradabad, house construction company Moradabad, residential construction Moradabad, turnkey villa construction Moradabad, duplex house construction Moradabad, house construction cost Moradabad, MTBOSS Moradabad, MTBOSS budget calculator, MTBOSS Kanth Road, house construction quote Moradabad, independent house construction Moradabad, Vastu house construction Moradabad",

  alternates: {
    canonical:
      "https://www.mtboss.in/turnkey-home-construction-in-moradabad",
  },

  openGraph: {
    title: "Turnkey Home Construction in Moradabad | MTBOSS",

    description:
      "Need turnkey home construction in Moradabad? MTBOSS handles design, build, materials and handover in one place.",

    url: "https://www.mtboss.in/turnkey-home-construction-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-turnkey-home-construction-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Turnkey Home Construction in Moradabad - MTBOSS Construction",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Turnkey Home Construction in Moradabad | MTBOSS",

    description:
      "Need turnkey home construction in Moradabad? MTBOSS handles design, build, materials and handover in one place.",

    images: [
      "https://www.mtboss.in/og-turnkey-home-construction-moradabad.jpg",
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

    url: "https://www.mtboss.in/turnkey-home-construction-in-moradabad",

    telephone: "+91-9458410866",

    email: "mtboss2016@gmail.com",

    image:
      "https://www.mtboss.in/og-turnkey-home-construction-moradabad.jpg",

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
      "Turnkey Home Construction",
      "Turnkey House Construction",
      "Independent House Construction",
      "Duplex House Construction",
      "Villa Construction",
      "Residential Construction",
      "Home Design and Build",
      "Home Interior and Modular Kitchen",
      "Home Construction Material Supply",
      "Vastu House Construction",
      "Home Construction Cost Estimation",
      "Property Services",
      "Doorstep Home Maintenance Services",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",

    name: "Turnkey Home Construction Services in Moradabad",

    description:
      "MTBOSS provides turnkey home construction in Moradabad, including floor planning, elevation design, civil construction, electrical work, plumbing, waterproofing, flooring, finishing, interiors, modular kitchens, material supply and final handover.",

    url: "https://www.mtboss.in/turnkey-home-construction-in-moradabad",

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
      "Turnkey Home Construction, Turnkey House Construction, Residential Construction and Home Design Build Services",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",

    mainEntity: [
      {
        "@type": "Question",
        name: "What is turnkey home construction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Turnkey home construction is a model in which one company handles the complete project, including planning, design, materials, civil construction, finishing and final handover, so the owner receives a ready-to-use home.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS offer turnkey home construction in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS offers turnkey home construction that combines design coordination, civil construction, building material supply, electrical work, plumbing, finishing and handover under one company in Moradabad and Bareilly.",
        },
      },
      {
        "@type": "Question",
        name: "What does a turnkey home construction package include?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A turnkey home package can include planning, floor plans, elevation, foundation, RCC structure, masonry, electrical work, plumbing, waterproofing, flooring, painting, doors, windows, interiors, modular kitchen and handover. The final scope is confirmed before construction starts.",
        },
      },
      {
        "@type": "Question",
        name: "How much does turnkey home construction cost in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Turnkey home construction cost depends on the built-up area, number of floors, material quality, structural requirements, design complexity, finishing level and interior scope. MTBOSS offers a free Budget Calculator and project-specific construction quote.",
        },
      },
      {
        "@type": "Question",
        name: "Can I get a free quote for my turnkey home construction project?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can request a free construction quote through the MTBOSS website or contact the team directly through phone or WhatsApp.",
        },
      },
      {
        "@type": "Question",
        name: "Can I customise the design of my turnkey home?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS prepares floor plans and elevation designs based on the family's requirements, plot size, number of floors, preferred architectural style and Vastu requirements where requested.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide materials for turnkey house construction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS supplies cement, TMT steel bars, bricks, tiles and paints through its building material supply network, helping coordinate material delivery during construction.",
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
        name: "Turnkey Home Construction in Moradabad",
        item: "https://www.mtboss.in/turnkey-home-construction-in-moradabad",
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