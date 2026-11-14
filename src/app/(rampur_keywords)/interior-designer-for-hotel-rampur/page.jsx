// app/(bareilly_keywords)/interior-designer-for-hotel-rampur/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer for Hotel Rampur | MTBoss",

  description:
    "Planning a hotel or guest house Rampur? MTBoss designs room interiors, lobbies, lighting and finishes built for guests, housekeeping and long service life.",

  keywords:
    "interior designer for hotel Rampur, hotel interior designer Rampur, hotel interior design Rampur, guest house interior design Rampur, hotel room interior design Rampur, hotel lobby design Rampur, hotel renovation Rampur, hotel interior designer in Rampur, hotel design company Rampur, hospitality interior design Rampur, hotel bathroom design Rampur, hotel lighting design Rampur, hotel furniture design Rampur, hotel interior renovation Rampur, hotel interior company Rampur, MTBoss Rampur, MTBoss Moradabad, MTBoss Bareilly, hotel interior consultation Rampur",

  alternates: {
    canonical:
      "https://www.mtboss.in/interior-designer-for-hotel-rampur",
  },

  openGraph: {
    title: "Interior Designer for Hotel Rampur | MTBoss",

    description:
      "Planning a hotel or guest house Rampur? MTBoss designs room interiors, lobbies, lighting and finishes built for guests, housekeeping and long service life.",

    url: "https://www.mtboss.in/interior-designer-for-hotel-rampur",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-interior-designer-for-hotel-rampur.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer for Hotel Rampur - MTBoss",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Designer for Hotel Rampur | MTBoss",

    description:
      "Planning a hotel or guest house Rampur? MTBoss designs room interiors, lobbies, lighting and finishes built for guests, housekeeping and long service life.",

    images: [
      "https://www.mtboss.in/og-interior-designer-for-hotel-rampur.jpg",
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
    "@type": "InteriorDesignService",
    name: "MTBOSS Construction Private Limited",
    url: "https://www.mtboss.in/interior-designer-for-hotel-rampur",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-interior-designer-for-hotel-rampur.jpg",
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
        name: "Rampur",
      },
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
      "Hotel Interior Design",
      "Guest House Interior Design",
      "Hotel Room Interior Design",
      "Hotel Lobby Design",
      "Hotel Bathroom Design",
      "Hotel Lighting Design",
      "Hotel Furniture Design",
      "Hotel Renovation",
      "Hospitality Interior Design",
      "Hotel Interior Services Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Interior Designer for Hotel in Rampur",
    description:
      "MTBoss designs hotel and guest house interiors in Rampur, including room interiors, lobbies, lighting and finishes built for guests, housekeeping and long service life. Services include guest rooms and suites, bathrooms, lobby and reception, restaurants, banquet and meeting spaces, corridors, lift lobbies and staircases, guest houses and lodges, staff and back-of-house areas, false ceiling, carpenter, painter, tile and marble, electrician, plumber, renovation and repair services.",
    url: "https://www.mtboss.in/interior-designer-for-hotel-rampur",
    provider: {
      "@type": "InteriorDesignService",
      name: "MTBOSS Construction Private Limited",
      telephone: "+91-9458410866",
      email: "mtboss2016@gmail.com",
      url: "https://www.mtboss.in",
    },
    areaServed: [
      {
        "@type": "City",
        name: "Rampur",
      },
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
      "Hotel Interior Design, Guest House Interior Design, Hotel Room Interior Design, Hotel Lobby Design, Hotel Bathroom Design, Hotel Lighting Design, Hotel Furniture Design, Hotel Renovation, Hospitality Interior Design and Hotel Interior Services Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Who designs hotel interiors in Rampur?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBoss plans hotel and guest house interiors from its Kanth Road office in Moradabad.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBoss have an office in Rampur?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. MTBoss serves Rampur through visits, shared drawings and updates.",
        },
      },
      {
        "@type": "Question",
        name: "What does MTBoss need to start?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Location, drawings or photos, room count, target guests and budget range.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBoss design to a brand's standards?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Share the manual, and MTBoss adapts it to your building.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBoss plan bathrooms and lighting too?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, with waterproofing, fittings and layered lighting coordinated.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBoss plan a sample room first?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBoss recommends approving one room before the design is repeated.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBoss renovate an existing hotel in stages?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBoss plans floor-by-floor work so some rooms stay in service.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBoss give itemised quotations?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBoss lists work items, materials, labour, timeline and payment stages.",
        },
      },
      {
        "@type": "Question",
        name: "How do I contact MTBoss?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Call or WhatsApp +91 94584 10866, or use 'Get a Construction Quote' on www.mtboss.in.",
        },
      },
      {
        "@type": "Question",
        name: "Which areas does MTBoss serve?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Moradabad, Bareilly and nearby areas of western Uttar Pradesh. Confirm Rampur when you first contact MTBoss.",
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
        name: "Interior Design Services",
        item: "https://www.mtboss.in/interior-design-services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Interior Designer for Hotel Rampur",
        item: "https://www.mtboss.in/interior-designer-for-hotel-rampur",
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