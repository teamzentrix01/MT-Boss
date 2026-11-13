// app/(bareilly_keywords)/restaurant-interior-designer-rampur/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Restaurant Interior Designer Rampur | Café & Dining – MTBOSS",

  description:
    "MTBOSS is an interior designer for restaurants Rampur. We plan layouts, kitchens, lighting and branding for restaurants, cafés, sweet shops and banquet halls, built on time for your launch.",

  keywords:
    "restaurant interior designer Rampur, restaurant interior design Rampur, café interior designer Rampur, restaurant interior designer in Rampur, restaurant design Rampur, café design Rampur, sweet shop interior design Rampur, fast food restaurant interior Rampur, banquet hall interior design Rampur, cloud kitchen interior design Rampur, restaurant renovation Rampur, restaurant kitchen layout Rampur, restaurant lighting design Rampur, restaurant facade design Rampur, restaurant branding interior Rampur, restaurant interior company Rampur, MTBOSS Rampur, MTBOSS Moradabad, MTBOSS Bareilly, restaurant interior consultation Rampur",

  alternates: {
    canonical:
      "https://www.mtboss.in/restaurant-interior-designer-rampur",
  },

  openGraph: {
    title: "Restaurant Interior Designer Rampur | Café & Dining – MTBOSS",

    description:
      "MTBOSS is an interior designer for restaurants Rampur. We plan layouts, kitchens, lighting and branding for restaurants, cafés, sweet shops and banquet halls, built on time for your launch.",

    url: "https://www.mtboss.in/restaurant-interior-designer-rampur",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-restaurant-interior-designer-rampur.jpg",
        width: 1200,
        height: 630,
        alt: "Restaurant Interior Designer Rampur - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Restaurant Interior Designer Rampur | Café & Dining – MTBOSS",

    description:
      "MTBOSS is an interior designer for restaurants Rampur. We plan layouts, kitchens, lighting and branding for restaurants, cafés, sweet shops and banquet halls, built on time for your launch.",

    images: [
      "https://www.mtboss.in/og-restaurant-interior-designer-rampur.jpg",
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
    url: "https://www.mtboss.in/restaurant-interior-designer-rampur",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-restaurant-interior-designer-rampur.jpg",
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
        name: "Moradabad",
      },
      {
        "@type": "City",
        name: "Bareilly",
      },
      {
        "@type": "State",
        name: "Uttar Pradesh",
      },
    ],
    serviceType: [
      "Restaurant Interior Design",
      "Café Interior Design",
      "Restaurant Interior Designer",
      "Sweet Shop Interior Design",
      "Fast Food Restaurant Interior Design",
      "Banquet Hall Interior Design",
      "Cloud Kitchen Interior Design",
      "Restaurant Renovation",
      "Restaurant Kitchen Layout Coordination",
      "Restaurant Lighting Design",
      "Restaurant Facade Design",
      "Restaurant Interior Services Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Restaurant Interior Designer in Rampur",
    description:
      "MTBOSS is an interior designer for restaurants in Rampur. We plan layouts, kitchens, lighting and branding for restaurants, cafés, sweet shops and banquet halls, built on time for your launch. Services include concept and theme development, space planning and seating layout, kitchen layout coordination, 3D design and visuals, facade and entrance design, false ceiling and lighting design, flooring, wall finishes and tile work, custom furniture, counters and display units, washroom planning, signage areas and branding elements, civil work, waterproofing, electrical and plumbing support, and renovation and makeover of existing restaurants.",
    url: "https://www.mtboss.in/restaurant-interior-designer-rampur",
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
        name: "Rampur",
      },
      {
        "@type": "City",
        name: "Moradabad",
      },
      {
        "@type": "City",
        name: "Bareilly",
      },
    ],
    serviceType:
      "Restaurant Interior Design, Café Interior Design, Restaurant Interior Designer, Sweet Shop Interior Design, Fast Food Restaurant Interior Design, Banquet Hall Interior Design, Cloud Kitchen Interior Design, Restaurant Renovation, Restaurant Kitchen Layout Coordination, Restaurant Lighting Design, Restaurant Facade Design and Restaurant Interior Services Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does a restaurant interior designer do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A restaurant interior designer plans the layout, seating, lighting, finishes, branding and coordination with the kitchen, and oversees execution until the space is ready to open.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS design cafés and small food outlets too?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS designs restaurants, cafés, sweet shops, fast food outlets and banquet spaces of different sizes.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS handle kitchen layout?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS coordinates the kitchen layout and utilities with your equipment plan, so that civil, electrical, plumbing and ventilation work match your needs.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide 3D designs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can review visuals before work begins.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS work around my opening date?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS prepares a schedule linked to your target launch date and tells you early if anything may affect it.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS renovate my existing restaurant?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS handles renovation, facade upgrades, new interiors and repair work.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS serve Rampur and nearby cities?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS serves Rampur, Moradabad and Bareilly and can discuss nearby locations.",
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
        name: "Restaurant Interior Designer Rampur",
        item: "https://www.mtboss.in/restaurant-interior-designer-rampur",
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