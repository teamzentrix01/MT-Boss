// app/(moradabad_keywords)/industrial-building-contractor-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Industrial Building Contractor in Moradabad | MTBOSS",

  description:
    "Hire an industrial building contractor in Moradabad. MTBOSS builds factories, sheds and warehouses with clear scope. Call +91 94584 10866.",

  keywords:
    "industrial building contractor Moradabad, industrial contractor Moradabad, factory building contractor Moradabad, warehouse contractor Moradabad, industrial shed contractor Moradabad, godown construction contractor Moradabad, industrial civil contractor Moradabad, workshop construction contractor Moradabad, industrial construction cost Moradabad, manufacturing unit contractor Moradabad, building contractor Moradabad, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad",

  alternates: {
    canonical:
      "https://www.mtboss.in/industrial-building-contractor-in-moradabad",
  },

  openGraph: {
    title: "Industrial Building Contractor in Moradabad | MTBOSS",

    description:
      "Hire an industrial building contractor in Moradabad. MTBOSS builds factories, sheds and warehouses with clear scope. Call +91 94584 10866.",

    url: "https://www.mtboss.in/industrial-building-contractor-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-industrial-building-contractor-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Industrial Building Contractor in Moradabad - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Industrial Building Contractor in Moradabad | MTBOSS",

    description:
      "Hire an industrial building contractor in Moradabad. MTBOSS builds factories, sheds and warehouses with clear scope. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-industrial-building-contractor-moradabad.jpg",
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
      "https://www.mtboss.in/industrial-building-contractor-in-moradabad",

    telephone: "+91-9458410866",

    email: "mtboss2016@gmail.com",

    image:
      "https://www.mtboss.in/og-industrial-building-contractor-moradabad.jpg",

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
      "Industrial Building Contractor",
      "Industrial Contractor",
      "Industrial Civil Contractor",
      "Factory Building Contractor",
      "Manufacturing Unit Contractor",
      "Warehouse Contractor",
      "Godown Construction Contractor",
      "Industrial Shed Contractor",
      "Workshop Construction Contractor",
      "Industrial RCC Construction",
      "Industrial Flooring",
      "Industrial Roofing",
      "Machine Foundation Construction",
      "Industrial Building Renovation",
      "Industrial Building Extension",
      "Construction Material Supply",
      "Industrial Construction Cost Estimation",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",

    name: "Industrial Building Contractor Services in Moradabad",

    description:
      "MTBOSS is an industrial building contractor in Moradabad delivering factories, workshops, warehouses, godowns and industrial sheds with site development, foundations, RCC structure, roofing, industrial flooring, drainage, office blocks, material supply and final handover.",

    url:
      "https://www.mtboss.in/industrial-building-contractor-in-moradabad",

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
      "Industrial Building Contractor, Factory Building Construction, Warehouse Construction, Godown Construction, Industrial Shed Construction and Workshop Construction Services",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",

    mainEntity: [
      {
        "@type": "Question",
        name: "What does an industrial building contractor do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "An industrial building contractor builds factories, workshops, warehouses, godowns and industrial sheds according to approved drawings. The contractor manages labour, materials, site development, foundations, structure, flooring, roofing, quality checks, schedule and handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS work as an industrial building contractor in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Industrial and warehousing construction is part of the MTBOSS service list, alongside commercial, hotel, school, college, mall, infrastructure and residential construction projects in Moradabad and Bareilly.",
        },
      },
      {
        "@type": "Question",
        name: "What types of industrial buildings can MTBOSS build?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS can discuss construction scope for factories, manufacturing units, workshops, warehouses, godowns, industrial sheds, storage buildings and mixed industrial buildings with offices and staff areas.",
        },
      },
      {
        "@type": "Question",
        name: "Who builds machine foundations and special industrial provisions?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Machine foundations, pits, anchor-bolt locations, sleeves, openings and special provisions should be agreed in writing before construction begins, based on machine supplier drawings and equipment requirements. Discuss these details with the MTBOSS team at the planning stage.",
        },
      },
      {
        "@type": "Question",
        name: "How much does industrial building construction cost in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Industrial building cost depends on covered area, span, height, structural system, industrial flooring specification, roofing, drainage, services, office areas, external development, material quality and site conditions. MTBOSS offers a free Budget Calculator and detailed quote option.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS supply building materials?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS supplies cement, TMT steel bars, bricks, tiles and paints through its wholesale material supply network, helping coordinate key material availability during construction.",
        },
      },
      {
        "@type": "Question",
        name: "Can I manage my industrial project from outside Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. When design coordination, materials and construction are managed under one company, owners can receive project updates through phone, WhatsApp and email without visiting the site daily.",
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
        name: "Industrial Building Contractor in Moradabad",
        item: "https://www.mtboss.in/industrial-building-contractor-in-moradabad",
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