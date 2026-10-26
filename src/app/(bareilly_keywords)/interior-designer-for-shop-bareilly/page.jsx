// app/(bareilly_keywords)/interior-designer-for-shop-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer for Shop in Bareilly | MTBOSS",

  description:
    "Need an interior designer for your shop in Bareilly? Plan display, lighting, counters and shopfront with MTBOSS. Call +91 94584 10866.",

  keywords:
    "interior designer for shop Bareilly, shop interior design Bareilly, retail shop interior Bareilly, shop design Bareilly, shopfront design Bareilly, clothing shop interior Bareilly, mobile shop interior Bareilly, medical store interior Bareilly, grocery store interior Bareilly, jewellery shop interior Bareilly, shop renovation Bareilly, commercial interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, shop interior quote Bareilly",

  alternates: {
    canonical:
      "https://www.MTBOSS.in/interior-designer-for-shop-in-bareilly",
  },

  openGraph: {
    title: "Interior Designer for Shop in Bareilly | MTBOSS",

    description:
      "Need an interior designer for your shop in Bareilly? Plan display, lighting, counters and shopfront with MTBOSS. Call +91 94584 10866.",

    url: "https://www.MTBOSS.in/interior-designer-for-shop-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.MTBOSS.in/og-interior-designer-shop-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer for Shop in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Designer for Shop in Bareilly | MTBOSS",

    description:
      "Need an interior designer for your shop in Bareilly? Plan display, lighting, counters and shopfront with MTBOSS. Call +91 94584 10866.",

    images: [
      "https://www.MTBOSS.in/og-interior-designer-shop-bareilly.jpg",
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
    url: "https://www.MTBOSS.in/interior-designer-for-shop-in-bareilly",
    telephone: "+91-9458410866",
    email: "MTBOSS2016@gmail.com",
    image: "https://www.MTBOSS.in/og-interior-designer-shop-bareilly.jpg",
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
      "Interior Designer for Shop",
      "Shop Interior Design",
      "Retail Shop Interior Design",
      "Shop Design",
      "Shopfront Design",
      "Clothing Shop Interior",
      "Mobile Shop Interior",
      "Medical Store Interior",
      "Grocery Store Interior",
      "Jewellery Shop Interior",
      "Shop Renovation",
      "Commercial Interior Design",
      "Shop Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Shop Interior Design Services in Bareilly",
    description:
      "MTBOSS provides shop interior design services in Bareilly for clothing and fashion shops, jewellery shops, mobile and electronics shops, grocery stores, medical stores, footwear shops, gift shops, boutiques and service shops. Services include space planning, shopfront and entrance design, display and shelving, billing counters, lighting, ceiling and wall design, flooring and finishes, trial rooms, storage, services provisions, branding, construction coordination, material supply, renovation and remodelling.",
    url: "https://www.MTBOSS.in/interior-designer-for-shop-in-bareilly",
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
      "Interior Designer for Shop, Shop Interior Design, Retail Shop Interior, Shopfront Design, Clothing Shop Interior, Mobile Shop Interior, Medical Store Interior, Grocery Store Interior, Jewellery Shop Interior, Shop Renovation and Commercial Interior Design",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does a shop interior designer do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A shop interior designer plans the shopfront, layout, displays, counter, lighting, storage and finishes so the shop attracts customers and works well day to day, and coordinates the work until opening.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide shop interior design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your shop.",
        },
      },
      {
        "@type": "Question",
        name: "Can you design a very small shop?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, the planning approach applies to small shops as well as larger ones. Smart use of vertical space, clear layouts and good lighting make small shops work well. Share your size and products, and the team can suggest options.",
        },
      },
      {
        "@type": "Question",
        name: "Can the work be done while I keep trading?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sometimes, by phasing the work and scheduling noisy jobs outside peak hours, though a short planned closure can be faster for a full renovation. Share your trading pattern, and the team can plan accordingly.",
        },
      },
      {
        "@type": "Question",
        name: "Do you supply fixtures, billing systems and signage?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Specialist items such as billing systems, security equipment, branded fixtures and AC units are usually supplied by specialist vendors. MTBOSS plans and builds the interior and civil work, and coordinates with your vendors so provisions fit together.",
        },
      },
      {
        "@type": "Question",
        name: "What if I rent my shop?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Check your lease for rules on alterations and signage, and plan removable or reusable fixtures where needed. The team can suggest options that suit a rented space.",
        },
      },
      {
        "@type": "Question",
        name: "How much does shop interior design cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on shop area, type and finish level, shopfront and signage, display and shelving, ceiling and lighting design, air conditioning and the condition of the premises. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
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
        name: "Interior Designer for Shop in Bareilly",
        item: "https://www.MTBOSS.in/interior-designer-for-shop-in-bareilly",
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