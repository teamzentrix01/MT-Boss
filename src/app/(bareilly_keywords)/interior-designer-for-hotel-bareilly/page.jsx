// app/(bareilly_keywords)/interior-designer-for-hotel-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer for Hotel in Bareilly | MTBOSS",

  description:
    "Need an interior designer for your hotel in Bareilly? Plan lobby, rooms, lighting and durable finishes with MTBOSS. Call +91 94584 10866.",

  keywords:
    "interior designer for hotel Bareilly, hotel interior design Bareilly, hotel room interior Bareilly, hotel lobby design Bareilly, guest house interior Bareilly, boutique hotel interior Bareilly, hotel renovation Bareilly, hospitality interior Bareilly, resort interior design Bareilly, hotel construction and interior Bareilly, commercial interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, hotel interior quote Bareilly",

  alternates: {
    canonical:
      "https://www.MTBOSS.in/interior-designer-for-hotel-in-bareilly",
  },

  openGraph: {
    title: "Interior Designer for Hotel in Bareilly | MTBOSS",

    description:
      "Need an interior designer for your hotel in Bareilly? Plan lobby, rooms, lighting and durable finishes with MTBOSS. Call +91 94584 10866.",

    url: "https://www.MTBOSS.in/interior-designer-for-hotel-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.MTBOSS.in/og-interior-designer-hotel-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer for Hotel in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Designer for Hotel in Bareilly | MTBOSS",

    description:
      "Need an interior designer for your hotel in Bareilly? Plan lobby, rooms, lighting and durable finishes with MTBOSS. Call +91 94584 10866.",

    images: [
      "https://www.MTBOSS.in/og-interior-designer-hotel-bareilly.jpg",
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
    url: "https://www.MTBOSS.in/interior-designer-for-hotel-in-bareilly",
    telephone: "+91-9458410866",
    email: "MTBOSS2016@gmail.com",
    image: "https://www.MTBOSS.in/og-interior-designer-hotel-bareilly.jpg",
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
        name: "Bareilly",
      },
      {
        "@type": "City",
        name: "Moradabad",
      },
      {
        "@type": "State",
        name: "Uttar Pradesh",
      },
    ],
    serviceType: [
      "Interior Designer for Hotel",
      "Hotel Interior Design",
      "Hotel Room Interior Design",
      "Hotel Lobby Design",
      "Guest House Interior Design",
      "Boutique Hotel Interior Design",
      "Hotel Renovation",
      "Hospitality Interior Design",
      "Resort Interior Design",
      "Hotel Construction and Interior",
      "Commercial Interior Design",
      "Hotel Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Hotel Interior Design Services in Bareilly",
    description:
      "MTBOSS provides hotel interior design services in Bareilly for hotels, guest houses, boutique hotels, resorts and homestays. Services include concept and space planning, lobby and reception design, guest room interiors, bathroom design, corridor and staircase design, ceiling and lighting design, furniture and woodwork, flooring and wall finishes, services provisions, branding and signage, construction coordination, material supply, renovation and remodelling.",
    url: "https://www.MTBOSS.in/interior-designer-for-hotel-in-bareilly",
    provider: {
      "@type": "InteriorDesignService",
      name: "MTBOSS Construction Private Limited",
      telephone: "+91-9458410866",
      email: "MTBOSS2016@gmail.com",
      url: "https://www.MTBOSS.in",
    },
    areaServed: [
      {
        "@type": "City",
        name: "Bareilly",
      },
      {
        "@type": "City",
        name: "Moradabad",
      },
    ],
    serviceType:
      "Interior Designer for Hotel, Hotel Interior Design, Hotel Room Interior, Hotel Lobby Design, Guest House Interior, Boutique Hotel Interior, Hotel Renovation, Hospitality Interior, Resort Interior Design and Commercial Interior Design",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does a hotel interior designer do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A hotel interior designer plans the lobby, rooms, bathrooms, corridors and common areas, including layouts, lighting, furniture, finishes and branding, and coordinates the work until the property is ready.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide hotel interior design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your hotel or guest house.",
        },
      },
      {
        "@type": "Question",
        name: "Can you renovate rooms while the hotel stays open?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In many cases, yes, by phasing the work floor by floor or wing by wing and scheduling noisy work at quiet times. Share your occupancy pattern, and the team can plan accordingly.",
        },
      },
      {
        "@type": "Question",
        name: "Why is a model room recommended?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A model room lets you check design, comfort, finishes and cost before repeating them across the property. It helps prevent expensive mistakes across many rooms.",
        },
      },
      {
        "@type": "Question",
        name: "Do you supply branded fittings, ACs or lifts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Specialist systems and branded fittings are usually supplied and installed by specialist vendors. MTBOSS plans and builds the interior and civil work, and coordinates with your vendors so provisions fit together.",
        },
      },
      {
        "@type": "Question",
        name: "Can you also build the hotel building itself?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS builds residential projects and offers construction services for other buildings. Share your plan with the team to confirm the scope for a new hotel or guest house.",
        },
      },
      {
        "@type": "Question",
        name: "How much does hotel interior design cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on the number of rooms, property category, bathroom scope, furniture, lobby and common areas, lighting, air conditioning and building condition. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
        },
      },
      {
        "@type": "Question",
        name: "Where is the MTBOSS office located?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The office is located at Harthala, Kanth Road, Behind KR Collection, near Domino's, Moradabad, Uttar Pradesh.",
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
        item: "https://www.MTBOSS.in/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Interior Design Services",
        item: "https://www.MTBOSS.in/interior-design-services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Interior Designer for Hotel in Bareilly",
        item: "https://www.MTBOSS.in/interior-designer-for-hotel-in-bareilly",
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