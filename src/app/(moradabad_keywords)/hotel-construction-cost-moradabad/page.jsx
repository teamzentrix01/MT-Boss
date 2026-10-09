// app/(moradabad_keywords)/hotel-construction-cost-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Hotel Construction Cost in Moradabad | MTBOSS",

  description:
    "Wondering about hotel construction cost in Moradabad? Learn what affects the budget and get a free quote from MTBOSS. Call +91 94584 10866.",

  keywords:
    "hotel construction cost Moradabad, hotel building cost Moradabad, cost of building a hotel Moradabad, hotel construction budget Moradabad, hotel construction cost per room, hotel construction cost per sq ft Moradabad, budget hotel construction cost, guest house construction cost Moradabad, banquet hall construction cost Moradabad, hotel construction estimate Moradabad, hotel construction company Moradabad, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad",

  alternates: {
    canonical: "https://www.mtboss.in/hotel-construction-cost-in-moradabad",
  },

  openGraph: {
    title: "Hotel Construction Cost in Moradabad | MTBOSS",

    description:
      "Wondering about hotel construction cost in Moradabad? Learn what affects the budget and get a free quote from MTBOSS. Call +91 94584 10866.",

    url: "https://www.mtboss.in/hotel-construction-cost-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-hotel-construction-cost-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Hotel Construction Cost in Moradabad - MTBOSS Construction",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Hotel Construction Cost in Moradabad | MTBOSS",

    description:
      "Wondering about hotel construction cost in Moradabad? Learn what affects the budget and get a free quote from MTBOSS. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-hotel-construction-cost-moradabad.jpg",
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

    url: "https://www.mtboss.in/hotel-construction-cost-in-moradabad",

    telephone: "+91-9458410866",

    email: "mtboss2016@gmail.com",

    image:
      "https://www.mtboss.in/og-hotel-construction-cost-moradabad.jpg",

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
      "Hotel Construction Cost Estimation",
      "Hotel Building Cost Estimate",
      "Hotel Construction Budget Planning",
      "Hotel Construction Quote",
      "Hotel Construction Cost Per Square Foot",
      "Hotel Construction Cost Per Room",
      "Budget Hotel Construction",
      "Guest House Construction",
      "Banquet Hall Construction",
      "Hospitality Construction",
      "Hotel Renovation Cost Estimation",
      "Construction Material Supply",
      "Hotel Construction Services",
      "Commercial Construction",
      "Property Services",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",

    name: "Hotel Construction Cost Estimate in Moradabad",

    description:
      "MTBOSS provides hotel construction cost estimation in Moradabad, including budget planning for hotel buildings, guest houses, resorts, banquet halls and hospitality projects based on built-up area, room count, floors, facilities, finishing level and material requirements.",

    url: "https://www.mtboss.in/hotel-construction-cost-in-moradabad",

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
      "Hotel Construction Cost Estimation, Hotel Building Budget Planning, Guest House Construction Cost Estimate and Hospitality Construction Quote Services",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",

    mainEntity: [
      {
        "@type": "Question",
        name: "How much does it cost to build a hotel in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hotel construction cost depends on built-up area, number of rooms, floors, hotel category, facilities, material quality, structural requirements, finishing level and interior scope. Use the MTBOSS Budget Calculator for an early estimate or request a project-specific construction quote.",
        },
      },
      {
        "@type": "Question",
        name: "What is the biggest factor in hotel construction cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The total built-up area is generally the biggest cost factor. Other major factors include the number of floors, room count, structure, finishing level and facilities such as banquet halls, lifts, restaurants, parking and landscaping.",
        },
      },
      {
        "@type": "Question",
        name: "Is furniture included in hotel construction cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Furniture, beds, linen, kitchen equipment, appliances, decor and other hotel operating equipment are often budgeted separately from the core civil construction quotation. Confirm all inclusions and exclusions before signing an agreement.",
        },
      },
      {
        "@type": "Question",
        name: "How can I reduce hotel construction cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can control hotel construction cost by standardising room layouts, stacking bathrooms and services, finalising the design before construction, selecting materials wisely, planning projects in phases where suitable and avoiding shortcuts on structural work and waterproofing.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS offer hotel construction in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Hotel construction is included in the MTBOSS service list, alongside residential, commercial, industrial and institutional construction projects in Moradabad and Bareilly.",
        },
      },
      {
        "@type": "Question",
        name: "How accurate is the MTBOSS Budget Calculator?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The MTBOSS Budget Calculator provides a practical early estimate to help with hotel project planning. A site visit, drawing review, facility list and material specification discussion are needed for a more precise project-specific estimate.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS supply building materials for hotel construction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS supplies cement, TMT steel bars, bricks, tiles and paints through its material supply network, helping coordinate material availability during hotel construction.",
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
        name: "Hotel Construction Cost in Moradabad",
        item: "https://www.mtboss.in/hotel-construction-cost-in-moradabad",
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