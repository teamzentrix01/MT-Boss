// app/(bareilly_keywords)/interior-designer-for-home-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer for Home in Bareilly | MTBOSS",

  description:
    "Looking for an interior designer for your home in Bareilly? Plan flats, houses and villas with MTBOSS. Call +91 94584 10866.",

  keywords:
    "interior designer for home in Bareilly, home interior designer Bareilly, home interior design Bareilly, flat interior design Bareilly, house interior design Bareilly, villa interior design Bareilly, new home interior Bareilly, home renovation interior Bareilly, family home interior Bareilly, joint family home interior Bareilly, work from home interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, home interior quote Bareilly",

  alternates: {
    canonical:
      "https://www.MTBOSS.in/interior-designer-for-home-in-bareilly",
  },

  openGraph: {
    title: "Interior Designer for Home in Bareilly | MTBOSS",

    description:
      "Looking for an interior designer for your home in Bareilly? Plan flats, houses and villas with MTBOSS. Call +91 94584 10866.",

    url: "https://www.MTBOSS.in/interior-designer-for-home-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.MTBOSS.in/og-interior-designer-for-home-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer for Home in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Designer for Home in Bareilly | MTBOSS",

    description:
      "Looking for an interior designer for your home in Bareilly? Plan flats, houses and villas with MTBOSS. Call +91 94584 10866.",

    images: [
      "https://www.MTBOSS.in/og-interior-designer-for-home-bareilly.jpg",
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
    url: "https://www.MTBOSS.in/interior-designer-for-home-in-bareilly",
    telephone: "+91-9458410866",
    email: "MTBOSS2016@gmail.com",
    image:
      "https://www.MTBOSS.in/og-interior-designer-for-home-bareilly.jpg",
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
      "Interior Designer for Home",
      "Home Interior Design",
      "Flat Interior Design",
      "House Interior Design",
      "Villa Interior Design",
      "New Home Interior Design",
      "Home Renovation Interior Design",
      "Family Home Interior Design",
      "Joint Family Home Interior Design",
      "Work from Home Interior Design",
      "Modular Kitchen Design",
      "Wardrobe Design",
      "Home Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Home Interior Design Services in Bareilly",
    description:
      "MTBOSS provides home interior design services in Bareilly for flats, houses and villas, including full home interiors, living and dining areas, modular kitchens, bedrooms and wardrobes, puja room design, false ceilings and lighting, flooring and wall finishes, woodwork and custom furniture, bathroom interiors, construction coordination, material supply, renovation and remodelling.",
    url: "https://www.MTBOSS.in/interior-designer-for-home-in-bareilly",
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
      "Interior Designer for Home, Home Interior Design, Flat Interior Design, House Interior Design, Villa Interior Design, New Home Interior Design, Home Renovation Interior Design, Family Home Interior Design and Work from Home Interior Design",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "When should I hire an interior designer for my home?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ideally before walls, wiring and plumbing are finalised, because layout, electrical points and ceiling plans can then be built in. If your home is already built, involve the designer before you buy furniture or decor.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide home interior design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your location.",
        },
      },
      {
        "@type": "Question",
        name: "Can you design interiors for a flat?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Flats need careful planning around fixed walls, society rules and lift access for materials. Share your floor plan, and the team can suggest options.",
        },
      },
      {
        "@type": "Question",
        name: "Can interiors be planned for a joint family or for elders?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Share your family details, and the team can plan separate private zones, safe flooring, easy-access layouts and enough storage.",
        },
      },
      {
        "@type": "Question",
        name: "Can I do my home in phases?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Many families start with the kitchen, bedrooms and living room, and complete other areas later. Planning the overall style and services at the beginning keeps later rooms consistent.",
        },
      },
      {
        "@type": "Question",
        name: "How much does home interior design cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on home size, property stage, scope, material and finish level, kitchen and wardrobe specifications, ceiling and lighting design, custom furniture and site conditions. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
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
        name: "Interior Designer for Home in Bareilly",
        item: "https://www.MTBOSS.in/interior-designer-for-home-in-bareilly",
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