// app/(bareilly_keywords)/villa-interior-designer-in-rampur/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title:
    "Villa Interior Designer in Rampur | Luxury Homes – MTBOSS",
  description:
    "MTBOSS designs villa and bungalow interiors in Rampur: living areas, staircase, modular kitchen, bedrooms, lighting and finishing, with clear pricing and on-time delivery.",
  keywords:
    "villa interior designer in Rampur, villa interior design Rampur, bungalow interior designer Rampur, luxury villa interiors Rampur, villa renovation Rampur, modular kitchen Rampur, staircase design Rampur, bedroom interior design Rampur, villa lighting design Rampur, duplex villa interiors Rampur, MTBOSS Rampur",
  alternates: {
    canonical:
      "https://www.mtboss.in/villa-interior-designer-in-rampur",
  },
  openGraph: {
    title:
      "Villa Interior Designer in Rampur | Luxury Homes – MTBOSS",
    description:
      "MTBOSS designs villa and bungalow interiors in Rampur: living areas, staircase, modular kitchen, bedrooms, lighting and finishing, with clear pricing and on-time delivery.",
    url:
      "https://www.mtboss.in/villa-interior-designer-in-rampur",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url:
          "https://www.mtboss.in/og-villa-interior-designer-in-rampur.jpg",
        width: 1200,
        height: 630,
        alt:
          "Villa Interior Designer in Rampur - Luxury Homes - MTBOSS",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Villa Interior Designer in Rampur | Luxury Homes – MTBOSS",
    description:
      "MTBOSS designs villa and bungalow interiors in Rampur: living areas, staircase, modular kitchen, bedrooms, lighting and finishing, with clear pricing and on-time delivery.",
    images: [
      "https://www.mtboss.in/og-villa-interior-designer-in-rampur.jpg",
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
      "https://www.mtboss.in/villa-interior-designer-in-rampur",
    telephone: "+91-9458410866",
    email: "MTBOSS2016@gmail.com",
    image:
      "https://www.mtboss.in/og-villa-interior-designer-in-rampur.jpg",
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
      "Villa Interior Design",
      "Bungalow Interior Design",
      "Luxury Villa Interiors",
      "Villa Renovation",
      "Modular Kitchen",
      "Staircase Design",
      "Bedroom Interior Design",
      "Villa Lighting Design",
      "Duplex Villa Interiors",
      "Interior Design Services",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Villa Interior Designer in Rampur",
    description:
      "MTBOSS designs villa and bungalow interiors in Rampur, including living areas, staircases, modular kitchens, bedrooms, lighting, false ceilings, wardrobes, bathrooms, flooring, painting, electrical, plumbing, waterproofing, renovation and finishing work for luxury homes.",
    url:
      "https://www.mtboss.in/villa-interior-designer-in-rampur",
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
      "Villa Interior Design, Bungalow Interior Design, Luxury Villa Interiors, Villa Renovation, Modular Kitchen, Staircase Design, Bedroom Interior Design, Villa Lighting Design and Duplex Villa Interiors",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name:
          "What villa interior design services does MTBOSS offer in Rampur?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "MTBOSS offers villa and bungalow interior design for living areas, staircases, modular kitchens, bedrooms, lighting, false ceilings, wardrobes, bathrooms, flooring, painting, electrical, plumbing, waterproofing, renovation and finishing work.",
        },
      },
      {
        "@type": "Question",
        name:
          "Can MTBOSS design luxury villa and bungalow interiors in Rampur?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. MTBOSS designs villa and bungalow interiors in Rampur, including living areas, staircases, modular kitchens, bedrooms, lighting and finishing work, with clear pricing and on-time delivery.",
        },
      },
      {
        "@type": "Question",
        name:
          "Can MTBOSS design a multi-floor villa or duplex home?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. MTBOSS can plan multi-floor villas, duplex homes and bungalows, including staircases, landings, double-height spaces and connected design across floors.",
        },
      },
      {
        "@type": "Question",
        name:
          "How much does villa interior design cost in Rampur?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Cost depends on villa size, number of floors, scope, material and finish level, modular kitchen, wardrobes, staircase design, lighting, furniture and civil work. Request a consultation for a detailed estimate.",
        },
      },
      {
        "@type": "Question",
        name:
          "Can MTBOSS renovate an existing villa or bungalow?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. MTBOSS can handle villa and bungalow renovation, including layout updates, modular kitchens, bathroom upgrades, false ceilings, flooring, lighting and fresh finishes.",
        },
      },
      {
        "@type": "Question",
        name:
          "Does MTBOSS provide clear pricing and on-time delivery?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "MTBOSS provides clear pricing and prepares a schedule for the project. Final timelines and costs depend on the scope, materials and site conditions.",
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
        name: "Villa Interior Designer in Rampur",
        item:
          "https://www.mtboss.in/villa-interior-designer-in-rampur",
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