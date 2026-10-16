// app/(bareilly_keywords)/best-interior-designer-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Best Interior Designer in Bareilly | MTBOSS",

  description:
    "Looking for the best interior designer in Bareilly? See how to choose, then get a clear quote from MTBOSS. Call +91 94584 10866.",

  keywords:
    "best interior designer in Bareilly, top interior designer Bareilly, how to choose interior designer Bareilly, interior designer near me Bareilly, home interior designer Bareilly, modular kitchen designer Bareilly, interior designer and builder Bareilly, affordable interior designer Bareilly, luxury interior designer Bareilly, interior design cost Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, interior design quote Bareilly",

  alternates: {
    canonical: "https://www.mtboss.in/best-interior-designer-in-bareilly",
  },

  openGraph: {
    title: "Best Interior Designer in Bareilly | MTBOSS",

    description:
      "Looking for the best interior designer in Bareilly? See how to choose, then get a clear quote from MTBOSS. Call +91 94584 10866.",

    url: "https://www.mtboss.in/best-interior-designer-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-best-interior-designer-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Best Interior Designer in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Best Interior Designer in Bareilly | MTBOSS",

    description:
      "Looking for the best interior designer in Bareilly? See how to choose, then get a clear quote from MTBOSS. Call +91 94584 10866.",

    images: ["https://www.mtboss.in/og-best-interior-designer-bareilly.jpg"],
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
    url: "https://www.mtboss.in/best-interior-designer-in-bareilly",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image: "https://www.mtboss.in/og-best-interior-designer-bareilly.jpg",
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
      "Best Interior Designer in Bareilly",
      "Top Interior Designer",
      "Interior Designer Near Me",
      "Home Interior Designer",
      "Modular Kitchen Designer",
      "Interior Designer and Builder",
      "Affordable Interior Designer",
      "Luxury Interior Designer",
      "Interior Design Cost Estimation",
      "Interior Design Quote",
      "Interior Renovation",
      "False Ceiling Design",
      "Wardrobe Design",
      "Office Interior Design",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Best Interior Design Services in Bareilly",
    description:
      "MTBOSS provides interior design services in Bareilly for homes, flats, offices, showrooms and clinics, including space planning, living room and dining interiors, modular kitchens, bedrooms and wardrobes, puja room design, false ceiling and lighting, flooring and wall finishes, woodwork and custom furniture, bathroom interiors, commercial interiors, coordination with construction, material supply and renovation and remodelling.",
    url: "https://www.mtboss.in/best-interior-designer-in-bareilly",
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
      "Best Interior Designer in Bareilly, Top Interior Designer, Home Interior Designer, Modular Kitchen Designer, Interior Designer and Builder, Affordable Interior Designer and Luxury Interior Designer",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I choose the best interior designer in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Decide your top priorities, then compare designers on portfolio, scope, written estimate, material specifications, payment schedule, timeline, supervision and after-work support. Ask for everything in writing.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide interior design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your location.",
        },
      },
      {
        "@type": "Question",
        name: "Is the cheapest interior designer the best choice?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Not always. A very low quote with a vague scope can lead to extra charges later. Compare quotes on equal terms, with the same scope and specifications.",
        },
      },
      {
        "@type": "Question",
        name: "Should I hire a designer who also does construction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It can help, because design, civil work and finishing are coordinated by one team. Whether it suits you depends on your project and priorities.",
        },
      },
      {
        "@type": "Question",
        name: "Can I see completed work before deciding?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ask any designer for completed project photos or a site visit. MTBOSS has a project gallery and blog on its website to help you review work.",
        },
      },
      {
        "@type": "Question",
        name: "How much does interior design cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on area, scope, material and finish level, kitchen and wardrobe specifications, ceiling and lighting design, custom furniture and site conditions. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
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
        name: "Best Interior Designer in Bareilly",
        item: "https://www.mtboss.in/best-interior-designer-in-bareilly",
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