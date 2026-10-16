// app/(bareilly_keywords)/interior-designer-for-wardrobe-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer for Wardrobe Bareilly | MTBOSS",

  description:
    "Looking for an interior designer for wardrobe Bareilly? MTBOSS designs sliding, hinged and walk-in wardrobes with smart storage. Call +91 94584 10866.",

  keywords:
    "interior designer for wardrobe Bareilly, wardrobe design Bareilly, modular wardrobe Bareilly, sliding wardrobe Bareilly, walk-in wardrobe Bareilly, bedroom wardrobe design Bareilly, wardrobe with loft Bareilly, custom wardrobe Bareilly, kids wardrobe design Bareilly, home interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, wardrobe interior quote Bareilly",

  alternates: {
    canonical:
      "https://www.mtboss.in/interior-designer-for-wardrobe-in-bareilly",
  },

  openGraph: {
    title: "Interior Designer for Wardrobe Bareilly | MTBOSS",

    description:
      "Looking for an interior designer for wardrobe Bareilly? MTBOSS designs sliding, hinged and walk-in wardrobes with smart storage. Call +91 94584 10866.",

    url: "https://www.mtboss.in/interior-designer-for-wardrobe-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-interior-designer-wardrobe-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer for Wardrobe in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Designer for Wardrobe Bareilly | MTBOSS",

    description:
      "Looking for an interior designer for wardrobe Bareilly? MTBOSS designs sliding, hinged and walk-in wardrobes with smart storage. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-interior-designer-wardrobe-bareilly.jpg",
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
    url: "https://www.mtboss.in/interior-designer-for-wardrobe-in-bareilly",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-interior-designer-wardrobe-bareilly.jpg",
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
      "Interior Designer for Wardrobe",
      "Wardrobe Design",
      "Modular Wardrobe",
      "Sliding Wardrobe",
      "Walk-in Wardrobe",
      "Bedroom Wardrobe Design",
      "Wardrobe with Loft",
      "Custom Wardrobe",
      "Kids Wardrobe Design",
      "Home Interior Design",
      "Wardrobe Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Wardrobe Design and Custom Storage Services in Bareilly",
    description:
      "MTBOSS provides wardrobe design and custom storage services in Bareilly. Services include wardrobe design and planning, sliding wardrobes, hinged wardrobes, walk-in wardrobes, L-shaped and corner wardrobes, loft storage, internal organisers, shutter finish options, mirror and dressing unit, internal lighting, bed and wardrobe coordination, kids' wardrobes, wardrobe renovation and full home interiors.",
    url: "https://www.mtboss.in/interior-designer-for-wardrobe-in-bareilly",
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
      "Interior Designer for Wardrobe, Wardrobe Design, Modular Wardrobe, Sliding Wardrobe, Walk-in Wardrobe, Bedroom Wardrobe Design, Wardrobe with Loft, Custom Wardrobe, Kids Wardrobe Design and Wardrobe Interior Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does an interior designer for a wardrobe do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A wardrobe designer plans the type, size, internal layout, finish, hardware and lighting based on your belongings and room, coordinates the work and manages it until handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide wardrobe design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your wardrobe.",
        },
      },
      {
        "@type": "Question",
        name: "Which is better, a sliding or a hinged wardrobe?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sliding wardrobes save floor space and suit compact rooms, while hinged wardrobes give full access to every section. The right choice depends on your room size and habits.",
        },
      },
      {
        "@type": "Question",
        name: "How can I get more storage in a small bedroom?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Use a floor-to-ceiling wardrobe with a loft, sliding doors, a corner or L-shaped design, a storage bed and slim internal organisers.",
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
        name: "How much does a wardrobe cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on wardrobe size and type, carcass board, shutter finish, hardware, internal accessories, loft, lighting and mirror. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS also handle electrical work, painting and the bedroom ceiling?",
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
        name: "Interior Designer for Wardrobe in Bareilly",
        item: "https://www.mtboss.in/interior-designer-for-wardrobe-in-bareilly",
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