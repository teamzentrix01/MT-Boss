// app/(bareilly_keywords)/interior-designer-for-bathroom-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer for Bathroom Bareilly | MTBOSS",

  description:
    "Looking for an interior designer for bathroom Bareilly? MTBOSS plans waterproof, anti-skid and stylish bathrooms with smart storage. Call +91 94584 10866.",

  keywords:
    "interior designer for bathroom Bareilly, bathroom interior design Bareilly, bathroom renovation Bareilly, small bathroom design Bareilly, bathroom waterproofing Bareilly, bathroom tiles Bareilly, bathroom vanity design Bareilly, attached bathroom design Bareilly, home interior Bareilly, bathroom remodelling Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, bathroom interior quote Bareilly",

  alternates: {
    canonical:
      "https://www.MTBOSS.in/interior-designer-for-bathroom-in-bareilly",
  },

  openGraph: {
    title: "Interior Designer for Bathroom Bareilly | MTBOSS",

    description:
      "Looking for an interior designer for bathroom Bareilly? MTBOSS plans waterproof, anti-skid and stylish bathrooms with smart storage. Call +91 94584 10866.",

    url: "https://www.MTBOSS.in/interior-designer-for-bathroom-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.MTBOSS.in/og-interior-designer-bathroom-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer for Bathroom in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Designer for Bathroom Bareilly | MTBOSS",

    description:
      "Looking for an interior designer for bathroom Bareilly? MTBOSS plans waterproof, anti-skid and stylish bathrooms with smart storage. Call +91 94584 10866.",

    images: [
      "https://www.MTBOSS.in/og-interior-designer-bathroom-bareilly.jpg",
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
    url: "https://www.MTBOSS.in/interior-designer-for-bathroom-in-bareilly",
    telephone: "+91-9458410866",
    email: "MTBOSS2016@gmail.com",
    image:
      "https://www.MTBOSS.in/og-interior-designer-bathroom-bareilly.jpg",
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
      "Interior Designer for Bathroom",
      "Bathroom Interior Design",
      "Bathroom Renovation",
      "Small Bathroom Design",
      "Bathroom Waterproofing",
      "Bathroom Tiles",
      "Bathroom Vanity Design",
      "Attached Bathroom Design",
      "Home Interior Design",
      "Bathroom Remodelling",
      "Bathroom Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Bathroom Interior Design and Renovation Services in Bareilly",
    description:
      "MTBOSS provides bathroom interior design and renovation services in Bareilly. Services include bathroom layout planning, waterproofing, floor slope and drainage, wall and floor tiling, sanitaryware installation, CP fittings, plumbing work, electrical work, vanity and storage, mirror and lighting, shower area and partition, ventilation, false ceiling and painting, door and window fitting, bathroom renovation and full home interiors.",
    url: "https://www.MTBOSS.in/interior-designer-for-bathroom-in-bareilly",
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
      "Interior Designer for Bathroom, Bathroom Interior Design, Bathroom Renovation, Small Bathroom Design, Bathroom Waterproofing, Bathroom Tiles, Bathroom Vanity Design, Attached Bathroom Design, Bathroom Remodelling and Bathroom Interior Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does an interior designer for a bathroom do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A bathroom interior designer plans the layout, waterproofing, drainage, tiles, fittings, storage, lighting and ventilation, coordinates the trades and manages the work until handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide bathroom interior design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your bathroom.",
        },
      },
      {
        "@type": "Question",
        name: "Why is waterproofing so important in a bathroom?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Without proper waterproofing, water can seep into walls and floors, causing damp, peeling paint and damage to the rooms below. It is done before tiling and checked before the surface is closed.",
        },
      },
      {
        "@type": "Question",
        name: "How can I make a small bathroom look bigger?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Use light tiles, a large mirror, a wall-hung toilet or compact basin, a sliding or glass partition, niches for storage and good lighting.",
        },
      },
      {
        "@type": "Question",
        name: "Which tiles are best for bathroom floors?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Anti-skid tiles are the safest choice, especially in homes with children and elders. A site visit will help you choose the right type, size and finish.",
        },
      },
      {
        "@type": "Question",
        name: "How much does bathroom interior design cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on bathroom size, waterproofing scope, tile type, sanitaryware and fittings, vanity and storage, plumbing and electrical changes and ceiling and lighting. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS also handle plumbing, electrical work and tiling?",
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
        name: "Interior Designer for Bathroom in Bareilly",
        item: "https://www.MTBOSS.in/interior-designer-for-bathroom-in-bareilly",
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