// app/(moradabad_keywords)/residential-construction-company-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Residential Construction Company in Moradabad | MTBOSS",

  description:
    "Build your home with MTBOSS, a residential construction company in Moradabad. Design, build and finish under one roof. Call +91 94584 10866 for a quote.",

  keywords:
    "residential construction company Moradabad, residential builder Moradabad, house construction company Moradabad, home builders Moradabad, villa construction Moradabad, duplex construction Moradabad, independent house builder Moradabad, residential project Moradabad, house construction cost Moradabad, home construction contractor Moradabad, Vastu home construction Moradabad, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad",

  alternates: {
    canonical:
      "https://www.mtboss.in/residential-construction-company-in-moradabad",
  },

  openGraph: {
    title: "Residential Construction Company in Moradabad | MTBOSS",
    description:
      "Build your home with MTBOSS, a residential construction company in Moradabad. Design, build and finish under one roof. Call +91 94584 10866 for a quote.",
    url: "https://www.mtboss.in/residential-construction-company-in-moradabad",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-residential-construction-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Residential Construction Company in Moradabad - MTBOSS",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Residential Construction Company in Moradabad | MTBOSS",
    description:
      "Build your home with MTBOSS, a residential construction company in Moradabad. Design, build and finish under one roof. Call +91 94584 10866 for a quote.",
    images: [
      "https://www.mtboss.in/og-residential-construction-moradabad.jpg",
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
      "https://www.mtboss.in/residential-construction-company-in-moradabad",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-residential-construction-moradabad.jpg",
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
      { "@type": "City", name: "Moradabad" },
      { "@type": "City", name: "Bareilly" },
      { "@type": "State", name: "Uttar Pradesh" },
    ],
    serviceType: [
      "Residential Construction",
      "Independent House Construction",
      "Duplex Construction",
      "Villa Construction",
      "Multi Storey Home Construction",
      "Vastu Home Construction",
      "Home Design and Planning",
      "Modular Kitchen and Interiors",
      "Home Renovation and Repair",
      "Construction Material Supply",
      "Residential Construction Cost Estimation",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Residential Construction Services in Moradabad",
    description:
      "MTBOSS provides residential construction in Moradabad, including independent house construction, duplex construction, villa construction, floor planning, elevation design, civil work, materials, waterproofing, finishing, interiors and handover.",
    url:
      "https://www.mtboss.in/residential-construction-company-in-moradabad",
    provider: {
      "@type": "GeneralContractor",
      name: "MTBOSS Construction Private Limited",
      telephone: "+91-9458410866",
      url: "https://www.mtboss.in",
    },
    areaServed: {
      "@type": "City",
      name: "Moradabad",
    },
    serviceType:
      "Residential Construction, House Construction, Duplex Construction, Villa Construction and Home Design Build Services",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does a residential construction company do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A residential construction company plans and builds homes, handling design coordination, material supply, civil construction, finishing and handover so homeowners receive a ready-to-use house.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS build homes in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS builds residential projects including affordable homes, independent houses, duplexes, villas and multi-storey family homes in Moradabad and Bareilly.",
        },
      },
      {
        "@type": "Question",
        name: "What types of homes can MTBOSS build?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS can discuss independent house construction, duplex homes, villas, multi-storey family homes and Vastu-based home planning where requested.",
        },
      },
      {
        "@type": "Question",
        name: "How much does it cost to build a house in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "House construction cost depends on built-up area, number of floors, material quality, design complexity, finishing level, interiors and site conditions. MTBOSS offers a free Budget Calculator and detailed quote option.",
        },
      },
      {
        "@type": "Question",
        name: "Can I customise my home design?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Floor plans, room layouts and elevations can be prepared around your family requirements, plot dimensions, style preferences and Vastu requirements where requested.",
        },
      },
      {
        "@type": "Question",
        name: "Can I get a free quote from MTBOSS?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can use the Get a Construction Quote option on the MTBOSS website or contact the team directly by phone or WhatsApp.",
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
        name: "Residential Construction Company in Moradabad",
        item: "https://www.mtboss.in/residential-construction-company-in-moradabad",
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