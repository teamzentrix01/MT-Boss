// app/(moradabad_keywords)/hotel-construction-company-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Hotel Construction Company in Moradabad | MTBOSS",

  description:
    "Looking for a hotel construction company in Moradabad? MTBOSS offers design, construction, interiors and handover. Call +91 94584 10866 for a free quote.",

  keywords:
    "hotel construction company Moradabad, hotel builder Moradabad, hotel construction contractor Moradabad, hotel building construction Moradabad, resort construction Moradabad, guest house construction Moradabad, boutique hotel construction, budget hotel construction Moradabad, banquet hall construction Moradabad, hotel interior design Moradabad, hospitality construction Moradabad, commercial construction company Moradabad, hotel construction cost Moradabad, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad",

  alternates: {
    canonical: "https://www.mtboss.in/hotel-construction-company-in-moradabad",
  },

  openGraph: {
    title: "Hotel Construction Company in Moradabad | MTBOSS",

    description:
      "Looking for a hotel construction company in Moradabad? MTBOSS offers design, construction, interiors and handover. Call +91 94584 10866 for a free quote.",

    url: "https://www.mtboss.in/hotel-construction-company-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-hotel-construction-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Hotel Construction Company in Moradabad - MTBOSS Construction",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Hotel Construction Company in Moradabad | MTBOSS",

    description:
      "Looking for a hotel construction company in Moradabad? MTBOSS offers design, construction, interiors and handover. Call +91 94584 10866 for a free quote.",

    images: ["https://www.mtboss.in/og-hotel-construction-moradabad.jpg"],
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

    url: "https://www.mtboss.in/hotel-construction-company-in-moradabad",

    telephone: "+91-9458410866",

    email: "mtboss2016@gmail.com",

    image: "https://www.mtboss.in/og-hotel-construction-moradabad.jpg",

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
      "Hotel Construction",
      "Hotel Building Construction",
      "Hotel Construction Contractor",
      "Hotel Interior Design",
      "Hospitality Construction",
      "Budget Hotel Construction",
      "Business Hotel Construction",
      "Boutique Hotel Construction",
      "Resort Construction",
      "Guest House Construction",
      "Service Apartment Construction",
      "Banquet Hall Construction",
      "Event Venue Construction",
      "Restaurant Construction",
      "Hotel Renovation and Upgrade",
      "Commercial Construction",
      "Construction Material Supply",
      "Construction Cost Estimation",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",

    name: "Hotel Construction Services in Moradabad",

    description:
      "MTBOSS provides hotel construction services in Moradabad, including hotel planning, room layouts, elevation design, RCC civil construction, guest-room construction, lobby and reception work, restaurant and kitchen areas, banquet halls, interiors, waterproofing, finishing and final handover.",

    url: "https://www.mtboss.in/hotel-construction-company-in-moradabad",

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
      "Hotel Construction, Hotel Building Construction, Hospitality Construction, Resort Construction, Guest House Construction and Hotel Interior Design Services",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",

    mainEntity: [
      {
        "@type": "Question",
        name: "What does a hotel construction company do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A hotel construction company plans and builds the structure, services and interiors of a hotel or hospitality property. It coordinates architecture, structural work, electrical and plumbing systems, guest rooms, public areas, finishing, interiors and final handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS offer hotel construction in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Hotel construction is part of the MTBOSS service range, alongside residential, commercial, industrial and institutional construction projects in Moradabad and Bareilly.",
        },
      },
      {
        "@type": "Question",
        name: "What types of hospitality projects can MTBOSS handle?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS can discuss construction scope for budget hotels, business hotels, boutique hotels, resorts, farmhouse stays, guest houses, service apartments, banquet halls and event venues. Share your project concept with the team to confirm scope.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS handle hotel interiors too?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS positions itself as an architect, interior designer and construction company. Hotel interiors, false ceilings, wall finishes, flooring, woodwork, guest-room finishing, lobby design and public-area finishing can be coordinated with construction.",
        },
      },
      {
        "@type": "Question",
        name: "What approvals are needed for hotel construction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hotel projects may require building-plan approval, fire-safety clearance, food and kitchen licences, electrical safety checks, environmental requirements and tourism or hospitality registrations where applicable. Requirements vary, so confirm current rules with relevant authorities and consultants.",
        },
      },
      {
        "@type": "Question",
        name: "How much does hotel construction cost in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hotel construction cost depends on built-up area, number of floors, room count, facilities, material quality, finishing level, interior scope, structural complexity and site conditions. MTBOSS offers a free Budget Calculator and detailed construction quote option.",
        },
      },
      {
        "@type": "Question",
        name: "Can I get a free hotel construction quote from MTBOSS?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can use the Get a Construction Quote option on the MTBOSS website or contact the team directly through phone or WhatsApp with your plot details, hotel concept, room requirement and rough budget.",
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
        name: "Hotel Construction Company in Moradabad",
        item: "https://www.mtboss.in/hotel-construction-company-in-moradabad",
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