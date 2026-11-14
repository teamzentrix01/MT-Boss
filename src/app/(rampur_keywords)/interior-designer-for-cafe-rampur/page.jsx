// app/(bareilly_keywords)/cafe-interior-designer-rampur/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title:
    "Cafe Interior Designer Rampur | Coffee Shop Design – MTBOSS",
  description:
    "MTBOSS designs and builds cafe interiors Rampur: coffee counters, seating, lighting and branding for cafes, bakeries and dessert shops, delivered on time and on budget.",
  keywords:
    "cafe interior designer Rampur, cafe interior design Rampur, coffee shop design Rampur, bakery interior design Rampur, dessert shop interior design Rampur, cafe renovation Rampur, coffee counter design Rampur, cafe seating design Rampur, cafe lighting design Rampur, cafe branding design Rampur, MTBOSS Rampur",
  alternates: {
    canonical:
      "https://www.mtboss.in/cafe-interior-designer-rampur",
  },
  openGraph: {
    title:
      "Cafe Interior Designer Rampur | Coffee Shop Design – MTBOSS",
    description:
      "MTBOSS designs and builds cafe interiors Rampur: coffee counters, seating, lighting and branding for cafes, bakeries and dessert shops, delivered on time and on budget.",
    url:
      "https://www.mtboss.in/cafe-interior-designer-rampur",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url:
          "https://www.mtboss.in/og-cafe-interior-designer-rampur.jpg",
        width: 1200,
        height: 630,
        alt:
          "Cafe Interior Designer in Rampur - Coffee Shop Design - MTBOSS",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Cafe Interior Designer Rampur | Coffee Shop Design – MTBOSS",
    description:
      "MTBOSS designs and builds cafe interiors Rampur: coffee counters, seating, lighting and branding for cafes, bakeries and dessert shops, delivered on time and on budget.",
    images: [
      "https://www.mtboss.in/og-cafe-interior-designer-rampur.jpg",
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
    url:
      "https://www.mtboss.in/cafe-interior-designer-rampur",
    telephone: "+91-9458410866",
    email: "MTBOSS2016@gmail.com",
    image:
      "https://www.mtboss.in/og-cafe-interior-designer-rampur.jpg",
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
      "Cafe Interior Design",
      "Coffee Shop Design",
      "Bakery Interior Design",
      "Dessert Shop Interior Design",
      "Cafe Renovation",
      "Coffee Counter Design",
      "Cafe Seating Design",
      "Cafe Lighting Design",
      "Cafe Branding Design",
      "Interior Design Services",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Cafe Interior Designer in Rampur",
    description:
      "MTBOSS designs and builds cafe interiors in Rampur, including coffee counters, seating, lighting, display counters, kitchens, washrooms, facades, branding, flooring, wall finishes, false ceilings, electrical, plumbing and renovation work for cafes, bakeries and dessert shops.",
    url:
      "https://www.mtboss.in/cafe-interior-designer-rampur",
    provider: {
      "@type": "InteriorDesignService",
      name: "MTBOSS Construction Private Limited",
      telephone: "+91-9458410866",
      email: "MTBOSS2016@gmail.com",
      url: "https://www.mtboss.in",
    },
    areaServed: [
      {
        "@type": "City",
        name: "Rampur",
      },
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
      "Cafe Interior Design, Coffee Shop Design, Bakery Interior Design, Dessert Shop Interior Design, Cafe Renovation, Coffee Counter Design, Cafe Seating Design, Cafe Lighting Design and Cafe Branding Design",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name:
          "What cafe interior design services does MTBOSS offer in Rampur?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "MTBOSS offers cafe interior design for coffee counters, seating, lighting, display counters, kitchens, washrooms, facades, branding, flooring, wall finishes, false ceilings, electrical, plumbing and renovation work.",
        },
      },
      {
        "@type": "Question",
        name:
          "Can MTBOSS design and build cafe interiors in Rampur?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. MTBOSS provides design and construction support for cafe interiors, including coffee shops, bakeries, dessert shops and small food outlets, subject to the project scope and local requirements.",
        },
      },
      {
        "@type": "Question",
        name:
          "Can MTBOSS design a small cafe or takeaway kiosk?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. MTBOSS can design compact cafes, takeaway counters and kiosks with efficient layouts for service, seating and storage.",
        },
      },
      {
        "@type": "Question",
        name:
          "How much does cafe interior design cost in Rampur?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Cost depends on the cafe size, seating capacity, counter complexity, kitchen requirements, ceiling and lighting design, flooring, wall finishes, furniture and fixtures. Request a consultation for a detailed estimate.",
        },
      },
      {
        "@type": "Question",
        name:
          "Can MTBOSS renovate an existing cafe?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. MTBOSS can handle cafe makeovers, including new lighting, counters, furniture, flooring, facades, branding and interior upgrades.",
        },
      },
      {
        "@type": "Question",
        name:
          "Does MTBOSS supply kitchen and coffee equipment?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "MTBOSS handles the interior and building work and coordinates with equipment suppliers for sizes, power and plumbing requirements.",
        },
      },
      {
        "@type": "Question",
        name:
          "Where is the MTBOSS office located?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "The office is located at Harthala, Kanth Road, Behind KR Collection, near Domino's, Moradabad, Uttar Pradesh.",
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
        name: "Cafe Interior Designer in Rampur",
        item:
          "https://www.mtboss.in/cafe-interior-designer-rampur",
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