// app/(bareilly_keywords)/modular-interior-design-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Modular Interior Design Bareilly | MTBOSS",

  description:
    "Looking for modular interior design Bareilly? MTBOSS plans modular kitchens, wardrobes, TV units and more with clean finish. Call +91 94584 10866.",

  keywords:
    "modular interior design Bareilly, modular interior designer Bareilly, modular kitchen Bareilly, modular wardrobe Bareilly, modular TV unit Bareilly, modular furniture Bareilly, modular home interior Bareilly, modular interior cost Bareilly, modular vs carpenter work Bareilly, home interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, modular interior quote Bareilly",

  alternates: {
    canonical:
      "https://www.MTBOSS.in/modular-interior-design-in-bareilly",
  },

  openGraph: {
    title: "Modular Interior Design Bareilly | MTBOSS",

    description:
      "Looking for modular interior design Bareilly? MTBOSS plans modular kitchens, wardrobes, TV units and more with clean finish. Call +91 94584 10866.",

    url: "https://www.MTBOSS.in/modular-interior-design-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.MTBOSS.in/og-modular-interior-design-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Modular Interior Design in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Modular Interior Design Bareilly | MTBOSS",

    description:
      "Looking for modular interior design Bareilly? MTBOSS plans modular kitchens, wardrobes, TV units and more with clean finish. Call +91 94584 10866.",

    images: [
      "https://www.MTBOSS.in/og-modular-interior-design-bareilly.jpg",
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
    url: "https://www.MTBOSS.in/modular-interior-design-in-bareilly",
    telephone: "+91-9458410866",
    email: "MTBOSS2016@gmail.com",
    image:
      "https://www.MTBOSS.in/og-modular-interior-design-bareilly.jpg",
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
      "Modular Interior Design",
      "Modular Interior Designer",
      "Modular Kitchen",
      "Modular Wardrobe",
      "Modular TV Unit",
      "Modular Furniture",
      "Modular Home Interior",
      "Modular Interior Cost",
      "Modular vs Carpenter Work",
      "Home Interior Design",
      "Modular Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Modular Interior Design Services in Bareilly",
    description:
      "MTBOSS provides modular interior design services in Bareilly. Services include modular kitchen design and installation, modular wardrobe design, TV unit and living room storage, bedroom modular furniture, kids' room modular units, dining and crockery units, entrance and shoe storage, bathroom vanity units, puja and utility units, space planning and 3D views, electrical, plumbing and civil coordination, false ceiling, painting and finishing, renovation and upgrade, and full home interiors.",
    url: "https://www.MTBOSS.in/modular-interior-design-in-bareilly",
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
      "Modular Interior Design, Modular Interior Designer, Modular Kitchen, Modular Wardrobe, Modular TV Unit, Modular Furniture, Modular Home Interior, Modular Interior Cost and Modular Interior Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is modular interior design?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Modular interior design uses units, or modules, designed to planned sizes and fitted together in your home. It is commonly used for kitchens, wardrobes, TV units, study tables and other storage.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide modular interior design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your home.",
        },
      },
      {
        "@type": "Question",
        name: "Is modular better than carpenter-made furniture?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Each has strengths. Modular offers a consistent finish, cleaner installation and standard hardware, while site-built carpentry is more flexible for unusual shapes. Many homes use a mix of both.",
        },
      },
      {
        "@type": "Question",
        name: "Can modular interiors be customised?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Layouts, sizes, finishes, handles and internal organisers are all planned for your room. Very irregular spaces may need custom elements alongside modules.",
        },
      },
      {
        "@type": "Question",
        name: "Will I see the design before work starts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Layouts and designs are shared and refined with your feedback before production begins, and scope and specifications are written down before work starts.",
        },
      },
      {
        "@type": "Question",
        name: "How much does modular interior design cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on the number of rooms, size of units, board quality, shutter finish, hardware, accessories, countertop and appliances, and civil and services work. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS also handle electrical work, ceiling and painting?",
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
        name: "Modular Interior Design in Bareilly",
        item: "https://www.MTBOSS.in/modular-interior-design-in-bareilly",
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