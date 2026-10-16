// app/(bareilly_keywords)/interior-designer-for-false-ceiling-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer for False Ceiling Bareilly | MTBOSS",

  description:
    "Need an interior designer for false ceiling Bareilly? MTBOSS plans POP, gypsum and PVC ceilings with cove and spot lighting. Call +91 94584 10866.",

  keywords:
    "interior designer for false ceiling Bareilly, false ceiling design Bareilly, gypsum false ceiling Bareilly, POP false ceiling Bareilly, PVC false ceiling Bareilly, living room false ceiling Bareilly, bedroom false ceiling Bareilly, cove lighting ceiling Bareilly, ceiling design for home Bareilly, home interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, false ceiling quote Bareilly",

  alternates: {
    canonical:
      "https://www.mtboss.in/interior-designer-for-false-ceiling-in-bareilly",
  },

  openGraph: {
    title: "Interior Designer for False Ceiling Bareilly | MTBOSS",

    description:
      "Need an interior designer for false ceiling Bareilly? MTBOSS plans POP, gypsum and PVC ceilings with cove and spot lighting. Call +91 94584 10866.",

    url: "https://www.mtboss.in/interior-designer-for-false-ceiling-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-interior-designer-false-ceiling-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer for False Ceiling in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Designer for False Ceiling Bareilly | MTBOSS",

    description:
      "Need an interior designer for false ceiling Bareilly? MTBOSS plans POP, gypsum and PVC ceilings with cove and spot lighting. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-interior-designer-false-ceiling-bareilly.jpg",
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
    url: "https://www.mtboss.in/interior-designer-for-false-ceiling-in-bareilly",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-interior-designer-false-ceiling-bareilly.jpg",
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
      "Interior Designer for False Ceiling",
      "False Ceiling Design",
      "Gypsum False Ceiling",
      "POP False Ceiling",
      "PVC False Ceiling",
      "Living Room False Ceiling",
      "Bedroom False Ceiling",
      "Cove Lighting Ceiling",
      "Ceiling Design for Home",
      "Home Interior Design",
      "False Ceiling Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "False Ceiling Design and Installation Services in Bareilly",
    description:
      "MTBOSS provides false ceiling design and installation services in Bareilly. Services include false ceiling design, gypsum board ceilings, POP ceilings, PVC ceilings, cove and profile lighting, spot and downlight layouts, pendant and chandelier provisions, AC and fan coordination, electrical wiring, wall and ceiling finishing, wooden or panel accents, ceiling repair and renovation, and full home interiors.",
    url: "https://www.mtboss.in/interior-designer-for-false-ceiling-in-bareilly",
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
      "Interior Designer for False Ceiling, False Ceiling Design, Gypsum False Ceiling, POP False Ceiling, PVC False Ceiling, Living Room False Ceiling, Bedroom False Ceiling, Cove Lighting Ceiling, Ceiling Design for Home and False Ceiling Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does an interior designer for a false ceiling do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A false ceiling designer plans the ceiling levels, shapes, lighting, AC and fan positions, materials and finish, coordinates the trades and manages the work until handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide false ceiling design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your home.",
        },
      },
      {
        "@type": "Question",
        name: "Which is better, gypsum or POP false ceiling?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Gypsum boards give a smooth, clean finish and work well for layered and cove designs. POP suits decorative borders and mouldings. The right choice depends on the room, the design and your budget.",
        },
      },
      {
        "@type": "Question",
        name: "Will a false ceiling make my room feel smaller?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It lowers the ceiling height, so the design should match the room. Shallow, peripheral and minimal designs work well in compact rooms.",
        },
      },
      {
        "@type": "Question",
        name: "Will I see the design before work starts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Layouts and designs are shared and refined with your feedback before execution begins, and scope and specifications are written down before work starts.",
        },
      },
      {
        "@type": "Question",
        name: "How much does a false ceiling cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on the ceiling area, material, design complexity, lighting plan, wiring and finish. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS also handle electrical work and painting?",
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
        name: "Interior Designer for False Ceiling in Bareilly",
        item: "https://www.mtboss.in/interior-designer-for-false-ceiling-in-bareilly",
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