// app/(moradabad_keywords)/commercial-building-contractor-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Commercial Building Contractor in Moradabad | MTBOSS",

  description:
    "Hire a commercial building contractor in Moradabad. MTBOSS delivers shops, offices, showrooms and more with clear scope. Call +91 94584 10866.",

  keywords:
    "commercial building contractor Moradabad, commercial contractor Moradabad, commercial construction contractor Moradabad, building contractor Moradabad, civil contractor Moradabad, shop construction contractor Moradabad, showroom contractor Moradabad, office building contractor Moradabad, commercial complex contractor Moradabad, warehouse contractor Moradabad, school building contractor Moradabad, commercial construction cost Moradabad, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad",

  alternates: {
    canonical:
      "https://www.mtboss.in/commercial-building-contractor-in-moradabad",
  },

  openGraph: {
    title: "Commercial Building Contractor in Moradabad | MTBOSS",

    description:
      "Hire a commercial building contractor in Moradabad. MTBOSS delivers shops, offices, showrooms and more with clear scope. Call +91 94584 10866.",

    url: "https://www.mtboss.in/commercial-building-contractor-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-commercial-building-contractor-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Commercial Building Contractor in Moradabad - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Commercial Building Contractor in Moradabad | MTBOSS",

    description:
      "Hire a commercial building contractor in Moradabad. MTBOSS delivers shops, offices, showrooms and more with clear scope. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-commercial-building-contractor-moradabad.jpg",
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
    "@type": "GeneralContractor",

    name: "MTBOSS Construction Private Limited",

    url:
      "https://www.mtboss.in/commercial-building-contractor-in-moradabad",

    telephone: "+91-9458410866",

    email: "mtboss2016@gmail.com",

    image:
      "https://www.mtboss.in/og-commercial-building-contractor-moradabad.jpg",

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
        name: "Moradabad",
      },
      {
        "@type": "City",
        name: "Bareilly",
      },
      {
        "@type": "AdministrativeArea",
        name: "Moradabad District",
      },
      {
        "@type": "State",
        name: "Uttar Pradesh",
      },
    ],

    serviceType: [
      "Commercial Building Contractor",
      "Commercial Construction Contractor",
      "Commercial Civil Contractor",
      "Shop Construction Contractor",
      "Showroom Construction Contractor",
      "Office Building Contractor",
      "Commercial Complex Contractor",
      "Mall Construction Contractor",
      "Warehouse Contractor",
      "Godown Construction Contractor",
      "School Building Contractor",
      "College Building Contractor",
      "Hotel Building Contractor",
      "Industrial Building Contractor",
      "Commercial Renovation and Repair",
      "Commercial Waterproofing",
      "Construction Material Supply",
      "Commercial Construction Cost Estimation",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",

    name: "Commercial Building Contractor Services in Moradabad",

    description:
      "MTBOSS is a commercial building contractor in Moradabad delivering shops, offices, showrooms, commercial complexes, malls, schools, hotels, warehouses and industrial buildings with site preparation, RCC structure, masonry, services coordination, finishing, material supply and handover.",

    url:
      "https://www.mtboss.in/commercial-building-contractor-in-moradabad",

    provider: {
      "@type": "GeneralContractor",
      name: "MTBOSS Construction Private Limited",
      telephone: "+91-9458410866",
      email: "mtboss2016@gmail.com",
      url: "https://www.mtboss.in",
    },

    areaServed: [
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
      "Commercial Building Contractor, Commercial Construction Contractor, Shop Construction, Showroom Construction, Office Building Construction, Warehouse Construction and School Building Construction",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",

    mainEntity: [
      {
        "@type": "Question",
        name: "What does a commercial building contractor do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A commercial building contractor builds business properties according to approved drawings and specifications. The contractor manages labour, materials, site supervision, RCC structure, masonry, electrical and plumbing coordination, finishing, schedule and final handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS work as a commercial building contractor in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Commercial construction is part of the MTBOSS service list, alongside hotel, school, college, mall, industrial, infrastructure and residential construction projects in Moradabad and Bareilly.",
        },
      },
      {
        "@type": "Question",
        name: "What types of commercial buildings can MTBOSS build?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS can discuss construction scope for shops, showrooms, offices, commercial complexes, malls, schools, colleges, hotels, guest houses, warehouses, godowns, factory sheds, industrial buildings and mixed-use projects.",
        },
      },
      {
        "@type": "Question",
        name: "What documents should I have before commercial construction starts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Before commercial construction starts, you should have approved drawings, written specifications, a clear scope of work, material details, cost estimate, payment stages, timeline and a written process for handling design or scope changes.",
        },
      },
      {
        "@type": "Question",
        name: "How do I compare commercial contractor quotations?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Compare built-up area, number of floors, work scope, material grades, brands, finishing levels, exclusions, payment schedule, timeline and change-handling process. Do not compare only the total price.",
        },
      },
      {
        "@type": "Question",
        name: "How much does commercial building construction cost in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Commercial building cost depends on built-up area, building type, floors, structure, electrical and plumbing scope, material quality, finishing level, facade, glazing and site conditions. MTBOSS offers a free Budget Calculator and detailed quote option.",
        },
      },
      {
        "@type": "Question",
        name: "Can I manage a commercial project from outside Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. When design coordination, materials and construction are managed under one company, owners can receive project updates through phone, WhatsApp and email without visiting the site every day.",
        },
      },
      {
        "@type": "Question",
        name: "Where is the MTBOSS office located?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The MTBOSS office is located at Harthala, Kanth Road, Behind KR Collection, near Domino's, Moradabad, Uttar Pradesh.",
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
        name: "Construction Services",
        item: "https://www.mtboss.in/construction-services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Commercial Building Contractor in Moradabad",
        item: "https://www.mtboss.in/commercial-building-contractor-in-moradabad",
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