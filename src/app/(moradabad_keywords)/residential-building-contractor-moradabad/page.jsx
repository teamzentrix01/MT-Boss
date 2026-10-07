// app/(moradabad_keywords)/residential-building-contractor-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Residential Building Contractor in Moradabad | MTBOSS",

  description:
    "Hire a residential building contractor in Moradabad. MTBOSS offers clear scope, quality materials and on-time handover. Call +91 94584 10866.",

  keywords:
    "residential building contractor Moradabad, house building contractor Moradabad, home construction contractor Moradabad, building contractor Moradabad, civil contractor Moradabad, residential contractor Moradabad, house contractor with material Moradabad, labour contractor Moradabad, duplex building contractor Moradabad, villa contractor Moradabad, residential construction cost Moradabad, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad",

  alternates: {
    canonical:
      "https://www.mtboss.in/residential-building-contractor-in-moradabad",
  },

  openGraph: {
    title: "Residential Building Contractor in Moradabad | MTBOSS",

    description:
      "Hire a residential building contractor in Moradabad. MTBOSS offers clear scope, quality materials and on-time handover. Call +91 94584 10866.",

    url: "https://www.mtboss.in/residential-building-contractor-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-residential-building-contractor-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Residential Building Contractor in Moradabad - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Residential Building Contractor in Moradabad | MTBOSS",

    description:
      "Hire a residential building contractor in Moradabad. MTBOSS offers clear scope, quality materials and on-time handover. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-residential-building-contractor-moradabad.jpg",
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
      "https://www.mtboss.in/residential-building-contractor-in-moradabad",

    telephone: "+91-9458410866",

    email: "mtboss2016@gmail.com",

    image:
      "https://www.mtboss.in/og-residential-building-contractor-moradabad.jpg",

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
      "Residential Building Contractor",
      "House Building Contractor",
      "Home Construction Contractor",
      "Residential Civil Contractor",
      "House Contractor With Material",
      "Labour Contract Construction",
      "Labour and Material Contract",
      "Independent House Construction",
      "Duplex Building Construction",
      "Villa Construction",
      "Multi Storey Home Construction",
      "Home Renovation and Repair",
      "Home Waterproofing",
      "Construction Material Supply",
      "Residential Construction Cost Estimation",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",

    name: "Residential Building Contractor Services in Moradabad",

    description:
      "MTBOSS is a residential building contractor in Moradabad offering labour coordination, material supply, foundation work, RCC structure, masonry, electrical and plumbing coordination, waterproofing, flooring, finishing, renovation and final home handover.",

    url:
      "https://www.mtboss.in/residential-building-contractor-in-moradabad",

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
      "Residential Building Contractor, House Construction Contractor, Civil Construction, Labour and Material Contract and Home Renovation Services",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",

    mainEntity: [
      {
        "@type": "Question",
        name: "What does a residential building contractor do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A residential building contractor arranges labour and materials, plans work stages, supervises construction, manages civil work, coordinates electrical and plumbing services, checks quality and delivers the house according to approved drawings from foundation to handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS work as a residential building contractor in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS handles residential projects including affordable homes, independent houses, duplexes, villas and multi-storey family homes in Moradabad and Bareilly.",
        },
      },
      {
        "@type": "Question",
        name: "Should I choose a labour contract or a contract with materials?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A labour-only contract requires the owner to source, inspect, store and manage materials. A labour-and-material contract reduces owner workload when specifications, grades, brands, quantities, scope and payment stages are clearly documented. MTBOSS can discuss the structure suitable for your project.",
        },
      },
      {
        "@type": "Question",
        name: "How do I choose a good residential building contractor?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Check completed work, visit sites where possible, ask about engineer supervision, insist on a written scope, review material specifications, link payments to completed work stages, confirm project timeline and understand how changes will be priced and approved.",
        },
      },
      {
        "@type": "Question",
        name: "How much does it cost to build a house in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "House construction cost depends on built-up area, number of floors, material quality, design complexity, finishing level, interior scope and site conditions. MTBOSS offers a free Budget Calculator and detailed construction quote option.",
        },
      },
      {
        "@type": "Question",
        name: "Can I manage my home project from outside Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. When one company coordinates design, materials and construction, homeowners can receive project updates through phone, WhatsApp and email without visiting the site daily.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS supply building materials for home construction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS supplies cement, TMT steel bars, bricks, tiles and paints through its wholesale material supply network, helping coordinate material delivery during construction.",
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
        name: "Residential Building Contractor in Moradabad",
        item: "https://www.mtboss.in/residential-building-contractor-in-moradabad",
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