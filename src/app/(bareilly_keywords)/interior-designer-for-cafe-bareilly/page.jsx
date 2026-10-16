// app/(bareilly_keywords)/interior-designer-for-cafe-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer for Cafe in Bareilly | MTBOSS",

  description:
    "Need an interior designer for your cafe in Bareilly? Plan theme, coffee counter, seating and lighting with MTBOSS. Call +91 94584 10866.",

  keywords:
    "interior designer for cafe Bareilly, cafe interior design Bareilly, coffee shop interior Bareilly, small cafe design Bareilly, rooftop cafe interior Bareilly, themed cafe interior Bareilly, cafe counter design Bareilly, cafe lighting design Bareilly, cafe renovation Bareilly, bakery cafe interior Bareilly, commercial interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, cafe interior quote Bareilly",

  alternates: {
    canonical:
      "https://www.mtboss.in/interior-designer-for-cafe-in-bareilly",
  },

  openGraph: {
    title: "Interior Designer for Cafe in Bareilly | MTBOSS",

    description:
      "Need an interior designer for your cafe in Bareilly? Plan theme, coffee counter, seating and lighting with MTBOSS. Call +91 94584 10866.",

    url: "https://www.mtboss.in/interior-designer-for-cafe-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-interior-designer-cafe-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer for Cafe in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Designer for Cafe in Bareilly | MTBOSS",

    description:
      "Need an interior designer for your cafe in Bareilly? Plan theme, coffee counter, seating and lighting with MTBOSS. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-interior-designer-cafe-bareilly.jpg",
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
    url: "https://www.mtboss.in/interior-designer-for-cafe-in-bareilly",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image: "https://www.mtboss.in/og-interior-designer-cafe-bareilly.jpg",
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
      "Interior Designer for Cafe",
      "Cafe Interior Design",
      "Coffee Shop Interior",
      "Small Cafe Design",
      "Rooftop Cafe Interior",
      "Themed Cafe Interior",
      "Cafe Counter Design",
      "Cafe Lighting Design",
      "Cafe Renovation",
      "Bakery Cafe Interior",
      "Commercial Interior Design",
      "Cafe Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Cafe Interior Design Services in Bareilly",
    description:
      "MTBOSS provides cafe interior design services in Bareilly for coffee shops, espresso bars, casual dining cafes, bakery cafes, rooftop cafes, garden cafes, co-working cafes, themed cafes and takeaway kiosks. Services include concept and space planning, facade and entrance design, counter and coffee bar design, compact kitchen and pantry planning, seating and furniture, ceiling and lighting, wall and decor design, flooring and finishes, washrooms, outdoor and rooftop seating, services provisions, branding, construction coordination, material supply, renovation and cafe conversion.",
    url: "https://www.mtboss.in/interior-designer-for-cafe-in-bareilly",
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
      "Interior Designer for Cafe, Cafe Interior Design, Coffee Shop Interior, Small Cafe Design, Rooftop Cafe Interior, Themed Cafe Interior, Cafe Counter Design, Cafe Lighting Design, Cafe Renovation and Bakery Cafe Interior",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does a cafe interior designer do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A cafe interior designer plans the theme, seating, counter, kitchen layout, lighting, finishes and branding so the cafe is attractive, comfortable and efficient, and coordinates the work until opening.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide cafe interior design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your cafe.",
        },
      },
      {
        "@type": "Question",
        name: "Can you design a small cafe or takeaway kiosk?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, the planning approach applies to small cafes, kiosks and larger outlets alike. Smart layouts, a strong counter and good lighting help a compact space work well. Share your area and concept, and the team can suggest options.",
        },
      },
      {
        "@type": "Question",
        name: "Do you supply coffee machines and kitchen equipment?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Coffee machines, kitchen equipment and exhaust systems are usually supplied and installed by specialist vendors. MTBOSS plans and builds the interior and civil work, and coordinates with your vendors so provisions fit together.",
        },
      },
      {
        "@type": "Question",
        name: "Can you build a rooftop cafe?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In many cases, yes, if the structure can safely take the load and local rules allow it. A site visit and structural assessment will show what is possible, along with weather protection and safety needs.",
        },
      },
      {
        "@type": "Question",
        name: "How much does cafe interior design cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on area, number of seats, theme and finish level, counter and kitchen scope, ceiling and lighting design, furniture, facade and site conditions. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
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
        name: "Interior Designer for Cafe in Bareilly",
        item: "https://www.mtboss.in/interior-designer-for-cafe-in-bareilly",
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