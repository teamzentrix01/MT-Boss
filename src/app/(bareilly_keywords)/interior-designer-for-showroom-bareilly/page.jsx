// app/(bareilly_keywords)/interior-designer-for-showroom-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer for Showroom in Bareilly | MTBOSS",

  description:
    "Need an interior designer for your showroom in Bareilly? Plan displays, facade, lighting and brand standards with MTBOSS. Call +91 94584 10866.",

  keywords:
    "interior designer for showroom Bareilly, showroom interior design Bareilly, showroom design Bareilly, car showroom interior Bareilly, bike showroom interior Bareilly, furniture showroom interior Bareilly, electronics showroom interior Bareilly, jewellery showroom interior Bareilly, brand showroom fit-out Bareilly, showroom renovation Bareilly, commercial interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, showroom interior quote Bareilly",

  alternates: {
    canonical:
      "https://www.MTBOSS.in/interior-designer-for-showroom-in-bareilly",
  },

  openGraph: {
    title: "Interior Designer for Showroom in Bareilly | MTBOSS",

    description:
      "Need an interior designer for your showroom in Bareilly? Plan displays, facade, lighting and brand standards with MTBOSS. Call +91 94584 10866.",

    url: "https://www.MTBOSS.in/interior-designer-for-showroom-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.MTBOSS.in/og-interior-designer-showroom-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer for Showroom in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Designer for Showroom in Bareilly | MTBOSS",

    description:
      "Need an interior designer for your showroom in Bareilly? Plan displays, facade, lighting and brand standards with MTBOSS. Call +91 94584 10866.",

    images: [
      "https://www.MTBOSS.in/og-interior-designer-showroom-bareilly.jpg",
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
    url: "https://www.MTBOSS.in/interior-designer-for-showroom-in-bareilly",
    telephone: "+91-9458410866",
    email: "MTBOSS2016@gmail.com",
    image:
      "https://www.MTBOSS.in/og-interior-designer-showroom-bareilly.jpg",
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
      "Interior Designer for Showroom",
      "Showroom Interior Design",
      "Showroom Design",
      "Car Showroom Interior",
      "Bike Showroom Interior",
      "Furniture Showroom Interior",
      "Electronics Showroom Interior",
      "Jewellery Showroom Interior",
      "Brand Showroom Fit-Out",
      "Showroom Renovation",
      "Commercial Interior Design",
      "Showroom Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Showroom Interior Design Services in Bareilly",
    description:
      "MTBOSS provides showroom interior design services in Bareilly for car and bike showrooms, furniture and home decor showrooms, electronics and appliance showrooms, tiles and building material showrooms, jewellery and luxury showrooms, apparel showrooms and franchise showrooms. Services include space planning, facade and entrance design, display design, reception and sales desks, customer lounges, lighting, ceiling and wall design, flooring and finishes, trial rooms and demo areas, back office and storage, services provisions, brand compliance, construction coordination, material supply, renovation and remodelling.",
    url: "https://www.MTBOSS.in/interior-designer-for-showroom-in-bareilly",
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
      "Interior Designer for Showroom, Showroom Interior Design, Car Showroom Interior, Bike Showroom Interior, Furniture Showroom Interior, Electronics Showroom Interior, Jewellery Showroom Interior, Brand Showroom Fit-Out, Showroom Renovation and Commercial Interior Design",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does a showroom interior designer do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A showroom interior designer plans the facade, display zones, lounge, sales desks, lighting, storage and finishes so the showroom presents products well and works smoothly for customers and staff, and coordinates the work until opening.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide showroom interior design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your showroom.",
        },
      },
      {
        "@type": "Question",
        name: "Can you work to a brand's design manual?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The team can plan the fit-out around your brand manual or franchise guidelines if you share them early, so layouts, materials and details can be built into the design and estimate.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between a shop and a showroom interior?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A shop is usually smaller and focused on quick selling, while a showroom is typically larger, brand-led and built around displays, consultation and a premium experience. The planning approach differs accordingly.",
        },
      },
      {
        "@type": "Question",
        name: "Can the showroom stay open during renovation?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sometimes, by phasing the work zone by zone and scheduling noisy work outside business hours. Share your business hours, and the team can plan accordingly.",
        },
      },
      {
        "@type": "Question",
        name: "Do you supply brand fixtures, signage and ACs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Brand-specific fixtures, signage, security systems and air conditioning are usually supplied by the brand or specialist vendors. MTBOSS plans and builds the interior and civil work, and coordinates with them so provisions fit together.",
        },
      },
      {
        "@type": "Question",
        name: "How much does showroom interior design cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on showroom area, brand standards, finish level, facade and glazing, display design, ceiling and lighting, structural work, air conditioning and the condition of the premises. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
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
        name: "Interior Designer for Showroom in Bareilly",
        item: "https://www.MTBOSS.in/interior-designer-for-showroom-in-bareilly",
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