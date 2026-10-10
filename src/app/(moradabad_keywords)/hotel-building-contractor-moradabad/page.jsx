// app/(moradabad_keywords)/hotel-building-contractor-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Hotel Building Contractor in Moradabad | MTBOSS",

  description:
    "Hire a trusted hotel building contractor in Moradabad. MTBOSS manages structure, finishing, materials and handover. Call +91 94584 10866 for a free quote.",

  keywords:
    "hotel building contractor Moradabad, hotel contractor Moradabad, hotel construction contractor Moradabad, hotel civil contractor Moradabad, building contractor Moradabad, commercial building contractor Moradabad, resort contractor Moradabad, guest house contractor Moradabad, banquet hall contractor Moradabad, multi-storey building contractor Moradabad, hotel renovation contractor Moradabad, hotel construction cost Moradabad, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad",

  alternates: {
    canonical:
      "https://www.mtboss.in/hotel-building-contractor-in-moradabad",
  },

  openGraph: {
    title: "Hotel Building Contractor in Moradabad | MTBOSS",

    description:
      "Hire a trusted hotel building contractor in Moradabad. MTBOSS manages structure, finishing, materials and handover. Call +91 94584 10866 for a free quote.",

    url: "https://www.mtboss.in/hotel-building-contractor-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-hotel-building-contractor-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Hotel Building Contractor in Moradabad - MTBOSS Construction",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Hotel Building Contractor in Moradabad | MTBOSS",

    description:
      "Hire a trusted hotel building contractor in Moradabad. MTBOSS manages structure, finishing, materials and handover. Call +91 94584 10866 for a free quote.",

    images: [
      "https://www.mtboss.in/og-hotel-building-contractor-moradabad.jpg",
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

    url: "https://www.mtboss.in/hotel-building-contractor-in-moradabad",

    telephone: "+91-9458410866",

    email: "mtboss2016@gmail.com",

    image:
      "https://www.mtboss.in/og-hotel-building-contractor-moradabad.jpg",

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
      "Hotel Building Contractor",
      "Hotel Construction Contractor",
      "Hotel Civil Contractor",
      "Hotel RCC Construction",
      "Multi Storey Building Contractor",
      "Commercial Building Contractor",
      "Hotel Renovation Contractor",
      "Resort Construction Contractor",
      "Guest House Construction Contractor",
      "Banquet Hall Construction Contractor",
      "Hotel Waterproofing",
      "Hotel Interior Finishing",
      "Hotel Building Materials Supply",
      "Construction Cost Estimation",
      "Commercial Renovation and Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",

    name: "Hotel Building Contractor Services in Moradabad",

    description:
      "MTBOSS is a hotel building contractor in Moradabad providing foundation work, RCC structure, multi-storey hotel construction, masonry, electrical and plumbing coordination, waterproofing, flooring, finishing, banquet hall construction, renovation and final handover.",

    url: "https://www.mtboss.in/hotel-building-contractor-in-moradabad",

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
      "Hotel Building Contractor, Hotel Construction Contractor, Hotel Civil Construction, Multi Storey Building Construction and Hospitality Building Services",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",

    mainEntity: [
      {
        "@type": "Question",
        name: "What does a hotel building contractor do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A hotel building contractor constructs the hotel according to approved drawings and specifications. The contractor manages labour, materials, site supervision, quality checks, structure, masonry, plumbing, electrical coordination, finishing and handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS work as a hotel building contractor in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Hotel construction is part of the MTBOSS service list, which also covers residential, commercial, industrial and institutional construction projects in Moradabad and Bareilly.",
        },
      },
      {
        "@type": "Question",
        name: "What types of hotel projects can MTBOSS build?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS can discuss construction scope for budget hotels, business hotels, resorts, guest houses, service apartments, banquet halls and wedding venues. Share your hotel concept and plot details with the team to confirm project scope.",
        },
      },
      {
        "@type": "Question",
        name: "How do I choose a hotel building contractor?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Check multi-storey construction experience, completed or ongoing sites, written scope, material specifications, payment stages, timeline, site-supervision process, project references and communication method before hiring a hotel contractor.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS supply building materials for hotel construction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS supplies cement, TMT steel bars, bricks, tiles and paints through its material supply network, helping coordinate material delivery during hotel construction.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS renovate or extend an existing hotel?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS offers renovation, repair and waterproofing services for existing hotels and guest houses. The team can discuss extra floors, room upgrades, leakage repair, facade upgrades and hospitality-property renovation based on site requirements.",
        },
      },
      {
        "@type": "Question",
        name: "How much does hotel construction cost in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hotel construction cost depends on built-up area, number of floors, room count, facilities, structural requirements, material quality, finishing level, interior scope and site conditions. MTBOSS provides a free Budget Calculator and construction quote option.",
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
        name: "Hotel Building Contractor in Moradabad",
        item: "https://www.mtboss.in/hotel-building-contractor-in-moradabad",
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