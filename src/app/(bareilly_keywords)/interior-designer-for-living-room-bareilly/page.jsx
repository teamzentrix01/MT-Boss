// app/(bareilly_keywords)/interior-designer-for-living-room-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer for Living Room Bareilly | MTBOSS",

  description:
    "Need an interior designer for living room Bareilly? MTBOSS plans TV walls, seating, ceilings and lighting for stylish family spaces. Call +91 94584 10866.",

  keywords:
    "interior designer for living room Bareilly, living room interior design Bareilly, living room design Bareilly, TV unit design Bareilly, living room false ceiling Bareilly, drawing room interior Bareilly, small living room design Bareilly, living room renovation Bareilly, home interior Bareilly, feature wall design Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, living room interior quote Bareilly",

  alternates: {
    canonical:
      "https://www.mtboss.in/interior-designer-for-living-room-in-bareilly",
  },

  openGraph: {
    title: "Interior Designer for Living Room Bareilly | MTBOSS",

    description:
      "Need an interior designer for living room Bareilly? MTBOSS plans TV walls, seating, ceilings and lighting for stylish family spaces. Call +91 94584 10866.",

    url: "https://www.mtboss.in/interior-designer-for-living-room-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-interior-designer-living-room-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer for Living Room in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Designer for Living Room Bareilly | MTBOSS",

    description:
      "Need an interior designer for living room Bareilly? MTBOSS plans TV walls, seating, ceilings and lighting for stylish family spaces. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-interior-designer-living-room-bareilly.jpg",
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
    url: "https://www.mtboss.in/interior-designer-for-living-room-in-bareilly",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-interior-designer-living-room-bareilly.jpg",
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
      "Interior Designer for Living Room",
      "Living Room Interior Design",
      "Living Room Design",
      "TV Unit Design",
      "Living Room False Ceiling",
      "Drawing Room Interior",
      "Small Living Room Design",
      "Living Room Renovation",
      "Home Interior Design",
      "Feature Wall Design",
      "Living Room Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Living Room Interior Design Services in Bareilly",
    description:
      "MTBOSS provides living room interior design services in Bareilly. Services include living room layout planning, TV wall and unit design, feature wall, false ceiling and lighting, seating and furniture planning, custom woodwork, flooring, wall finishes, curtains and window treatment, puja unit or mandir, open living and dining design, electrical planning, AC and fan planning, living room renovation and full home interiors.",
    url: "https://www.mtboss.in/interior-designer-for-living-room-in-bareilly",
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
        name: "Bareilly",
      },
      {
        "@type": "City",
        name: "Moradabad",
      },
    ],
    serviceType:
      "Interior Designer for Living Room, Living Room Interior Design, TV Unit Design, Living Room False Ceiling, Drawing Room Interior, Small Living Room Design, Living Room Renovation, Feature Wall Design and Living Room Interior Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does an interior designer for a living room do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A living room interior designer plans the layout, TV wall, seating, ceiling, lighting, finishes and furniture, coordinates the trades and manages the work until handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide living room interior design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your living room.",
        },
      },
      {
        "@type": "Question",
        name: "How can I make a small living room look bigger?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Use light colours, slim furniture, a wall-mounted TV unit, mirrors, simple curtains and closed storage to keep the room open and uncluttered.",
        },
      },
      {
        "@type": "Question",
        name: "Can you design a TV wall with hidden wiring and storage?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The TV wall can be planned with concealed wiring, proper sockets, closed storage and display shelves.",
        },
      },
      {
        "@type": "Question",
        name: "Is a false ceiling necessary in a living room?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It is not necessary, but it helps hide wiring and AC ducts and gives you more lighting options. The right choice depends on your room height and style.",
        },
      },
      {
        "@type": "Question",
        name: "How much does living room interior design cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on room size, TV wall design, ceiling and lighting, flooring, wall finishes, custom furniture and soft furnishings. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS also handle electrical work, painting and carpentry?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. These are part of the services offered, so you do not need to coordinate separate contractors.",
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
        name: "Interior Designer for Living Room in Bareilly",
        item: "https://www.mtboss.in/interior-designer-for-living-room-in-bareilly",
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