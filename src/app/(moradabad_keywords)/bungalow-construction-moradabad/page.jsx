// app/(moradabad_keywords)/bungalow-construction-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Bungalow Construction in Moradabad | MTBOSS",

  description:
    "Planning bungalow construction in Moradabad? MTBOSS offers custom design, quality materials and on-time handover. Call +91 94584 10866.",

  keywords:
    "bungalow construction Moradabad, bungalow builder Moradabad, kothi construction Moradabad, bungalow design Moradabad, bungalow contractor Moradabad, bungalow construction cost Moradabad, single storey bungalow Moradabad, double storey bungalow Moradabad, independent house construction Moradabad, luxury bungalow Moradabad, residential construction company Moradabad, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad",

  alternates: {
    canonical: "https://www.mtboss.in/bungalow-construction-in-moradabad",
  },

  openGraph: {
    title: "Bungalow Construction in Moradabad | MTBOSS",

    description:
      "Planning bungalow construction in Moradabad? MTBOSS offers custom design, quality materials and on-time handover. Call +91 94584 10866.",

    url: "https://www.mtboss.in/bungalow-construction-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-bungalow-construction-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Bungalow Construction in Moradabad - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Bungalow Construction in Moradabad | MTBOSS",

    description:
      "Planning bungalow construction in Moradabad? MTBOSS offers custom design, quality materials and on-time handover. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-bungalow-construction-moradabad.jpg",
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
    url: "https://www.mtboss.in/bungalow-construction-in-moradabad",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image: "https://www.mtboss.in/og-bungalow-construction-moradabad.jpg",
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
        "@type": "State",
        name: "Uttar Pradesh",
      },
    ],
    serviceType: [
      "Bungalow Construction",
      "Bungalow Builder",
      "Kothi Construction",
      "Bungalow Design",
      "Bungalow Contractor",
      "Single Storey Bungalow",
      "Double Storey Bungalow",
      "Independent House Construction",
      "Luxury Bungalow",
      "Residential Construction",
      "Bungalow Renovation",
      "Bungalow Extension",
      "Construction Material Supply",
      "Bungalow Construction Cost Estimation",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Bungalow Construction Services in Moradabad",
    description:
      "MTBOSS provides bungalow construction in Moradabad for single and double-storey family homes, including design coordination, structure, facade, services provisions, waterproofing, flooring, finishing, modular kitchen, interiors, outdoor works and final handover.",
    url: "https://www.mtboss.in/bungalow-construction-in-moradabad",
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
      "Bungalow Construction, Kothi Construction, Bungalow Design, Independent House Construction, Single Storey Bungalow and Double Storey Bungalow",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is bungalow construction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Bungalow construction is the planning and building of a spacious, usually one or two-storey family home with open areas such as a verandah, garden and parking, from design to handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS build bungalows in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS builds residential projects, including independent houses and luxury villas, in Moradabad and Bareilly. Share your plan with the team to confirm the scope for your bungalow.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between a bungalow and a villa?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The terms overlap. A bungalow usually suggests a spacious family home with open areas, while a villa often suggests a more premium, design-led home. Your plot and budget matter more than the label.",
        },
      },
      {
        "@type": "Question",
        name: "Should I build a single-storey or double-storey bungalow?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Single-storey suits easy movement and larger plots, while double-storey gives more rooms on a smaller footprint. You can also build one floor now and plan for an extra floor later.",
        },
      },
      {
        "@type": "Question",
        name: "How much does bungalow construction cost in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Bungalow construction cost depends on built-up area, number of floors, design complexity, material and finish level, interior scope, outdoor development and site conditions. MTBOSS offers a free Budget Calculator and detailed quote option.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS supply building materials?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS supplies cement, TMT steel bars, bricks, tiles and paints through its wholesale material supply network, helping coordinate key materials during bungalow construction.",
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
        name: "Bungalow Construction in Moradabad",
        item: "https://www.mtboss.in/bungalow-construction-in-moradabad",
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