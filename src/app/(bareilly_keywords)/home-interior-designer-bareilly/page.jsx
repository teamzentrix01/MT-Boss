// app/(bareilly_keywords)/home-interior-designer-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Home Interior Designer in Bareilly | MTBOSS",

  description:
    "Home interior designer in Bareilly: how to choose, what to expect and how MTBOSS plans flats, houses and villas. Call +91 94584 10866.",

  keywords:
    "home interior designer Bareilly, interior designer in Bareilly, best home interior designer Bareilly, top interior designer Bareilly, interior designer near me Bareilly, interior design company Bareilly, interior designing firm Bareilly, flat interior design Bareilly, villa interior design Bareilly, modular kitchen Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, home interior quote Bareilly",

  alternates: {
    canonical: "https://www.MTBOSS.in/home-interior-designer-in-bareilly",
  },

  openGraph: {
    title: "Home Interior Designer in Bareilly | MTBOSS",

    description:
      "Home interior designer in Bareilly: how to choose, what to expect and how MTBOSS plans flats, houses and villas. Call +91 94584 10866.",

    url: "https://www.MTBOSS.in/home-interior-designer-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.MTBOSS.in/og-home-interior-designer-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Home Interior Designer in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Home Interior Designer in Bareilly | MTBOSS",

    description:
      "Home interior designer in Bareilly: how to choose, what to expect and how MTBOSS plans flats, houses and villas. Call +91 94584 10866.",

    images: [
      "https://www.MTBOSS.in/og-home-interior-designer-bareilly.jpg",
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
    url: "https://www.MTBOSS.in/home-interior-designer-in-bareilly",
    telephone: "+91-9458410866",
    email: "MTBOSS2016@gmail.com",
    image: "https://www.MTBOSS.in/og-home-interior-designer-bareilly.jpg",
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
      "Home Interior Designer",
      "Interior Designer in Bareilly",
      "Best Home Interior Designer",
      "Top Interior Designer",
      "Interior Designer Near Me",
      "Interior Design Company",
      "Interior Designing Firm",
      "Flat Interior Design",
      "Villa Interior Design",
      "Modular Kitchen Design",
      "Home Interior Design",
      "Home Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Home Interior Design Services in Bareilly",
    description:
      "MTBOSS provides home interior design services in Bareilly for flats, houses and villas, including full home interiors, living and dining areas, modular kitchens, bedrooms and wardrobes, puja room design, false ceilings and lighting, flooring and wall finishes, woodwork and custom furniture, bathroom interiors, construction coordination, material supply, renovation and remodelling.",
    url: "https://www.MTBOSS.in/home-interior-designer-in-bareilly",
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
      "Home Interior Designer, Interior Designer in Bareilly, Flat Interior Design, Villa Interior Design, Modular Kitchen Design and Home Interior Design",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does a home interior designer do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A home interior designer plans how your home will look and work, including layout, storage, lighting, materials and finishes, and coordinates the work until it is completed.",
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
        name: "How do I find the best interior designer for my home?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Compare designers on portfolio, scope, written estimate, material specifications, payment schedule, timeline, supervision and after-work support, instead of relying on titles alone.",
        },
      },
      {
        "@type": "Question",
        name: "Is there an MTBOSS office in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The MTBOSS office is in Harthala, Kanth Road, Moradabad. The team serves clients in Bareilly, and you can start by phone or WhatsApp.",
        },
      },
      {
        "@type": "Question",
        name: "Will someone visit my home?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Site visits are part of the process, because accurate measurements and site conditions are needed for design and estimates. Share your locality, and the team will confirm arrangements.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between an interior design company and a freelancer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A company usually handles design and execution together with written terms and a defined process, while a freelancer may focus on design and leave execution to others. The right choice depends on your project.",
        },
      },
      {
        "@type": "Question",
        name: "How much does home interior design cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on home size, scope, material and finish level, kitchen and wardrobe specifications, ceiling and lighting design, custom furniture and site conditions. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
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
        name: "Home Interior Designer in Bareilly",
        item: "https://www.MTBOSS.in/home-interior-designer-in-bareilly",
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