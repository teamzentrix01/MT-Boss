// app/(moradabad_keywords)/petrol-pump-construction-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Petrol Pump Construction in Moradabad | MTBOSS",

  description:
    "Need petrol pump construction in Moradabad? MTBOSS handles civil work, canopy, forecourt, building and finishing. Call +91 94584 10866 for a free quote.",

  keywords:
    "petrol pump construction Moradabad, petrol pump construction company Moradabad, petrol pump contractor Moradabad, fuel station construction Moradabad, petrol pump civil work Moradabad, petrol pump canopy construction, petrol pump building construction, petrol pump forecourt construction, retail outlet construction Moradabad, petrol pump cost Moradabad, commercial construction Moradabad, turnkey construction Moradabad, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad",

  alternates: {
    canonical: "https://www.mtboss.in/petrol-pump-construction-in-moradabad",
  },

  openGraph: {
    title: "Petrol Pump Construction in Moradabad | MTBOSS",

    description:
      "Need petrol pump construction in Moradabad? MTBOSS handles civil work, canopy, forecourt, building and finishing. Call +91 94584 10866 for a free quote.",

    url: "https://www.mtboss.in/petrol-pump-construction-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-petrol-pump-construction-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Petrol Pump Construction in Moradabad - MTBOSS Construction",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Petrol Pump Construction in Moradabad | MTBOSS",

    description:
      "Need petrol pump construction in Moradabad? MTBOSS handles civil work, canopy, forecourt, building and finishing. Call +91 94584 10866 for a free quote.",

    images: [
      "https://www.mtboss.in/og-petrol-pump-construction-moradabad.jpg",
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

    url: "https://www.mtboss.in/petrol-pump-construction-in-moradabad",

    telephone: "+91-9458410866",

    email: "mtboss2016@gmail.com",

    image:
      "https://www.mtboss.in/og-petrol-pump-construction-moradabad.jpg",

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
      "Petrol Pump Construction",
      "Fuel Station Construction",
      "Retail Outlet Construction",
      "Petrol Pump Civil Work",
      "Petrol Pump Forecourt Construction",
      "Petrol Pump Canopy Construction",
      "Petrol Pump Building Construction",
      "Commercial Construction",
      "Roadside Construction",
      "Site Development",
      "Forecourt Paving",
      "RCC Construction",
      "Boundary Wall Construction",
      "Drainage Construction",
      "Construction Material Supply",
      "Building Renovation and Repair",
      "Construction Cost Estimation",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",

    name: "Petrol Pump Construction Services in Moradabad",

    description:
      "MTBOSS provides petrol pump construction services in Moradabad, including site development, forecourt paving, canopy civil work, dispenser island platforms, office and shop buildings, drainage, boundary wall construction, finishing and building material supply.",

    url: "https://www.mtboss.in/petrol-pump-construction-in-moradabad",

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
      "Petrol Pump Construction, Fuel Station Civil Work, Forecourt Construction, Canopy Construction and Retail Outlet Building Services",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",

    mainEntity: [
      {
        "@type": "Question",
        name: "What does petrol pump construction include?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Petrol pump construction includes site development, levelling, forecourt paving, canopy civil structure, dispenser islands, office and shop buildings, drainage, driveways, boundary wall and finishing work built around the oil company's approved layout.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS offer petrol pump construction in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS provides commercial, industrial and infrastructure construction services in Moradabad and Bareilly. Contact the team to discuss the scope, layout and civil requirements of your petrol pump project.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS install fuel tanks and fuel dispensers?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Fuel tanks, dispensers and fuel pipelines are generally installed according to the oil company's specifications by authorised vendors. MTBOSS focuses on civil and building work around the approved equipment layout. Confirm the final project scope directly with the team.",
        },
      },
      {
        "@type": "Question",
        name: "What approvals are needed for petrol pump construction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Petrol pump projects may require oil marketing company approval, approved layout drawings, local authority permissions, road access permissions, safety and fire clearances, environmental requirements and electrical compliance. Requirements vary by location and oil company, so confirm current rules with the relevant authorities.",
        },
      },
      {
        "@type": "Question",
        name: "How much does petrol pump construction cost in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Petrol pump construction cost depends on plot size, forecourt area, canopy design, pavement specification, building area, drainage requirements, site conditions, material quality and oil company specifications. MTBOSS offers a free Budget Calculator and construction quote option for project-specific planning.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS construct petrol pump forecourts and canopy foundations?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS can discuss civil construction scope for forecourt paving, RCC work, dispenser island platforms, canopy foundations, office buildings, drainage, boundary walls and site development based on approved project drawings.",
        },
      },
      {
        "@type": "Question",
        name: "Can I get a free petrol pump construction quote from MTBOSS?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can request a quote through the Get a Construction Quote option on the MTBOSS website or contact the team directly by phone or WhatsApp with your plot, approved layout and planned facilities.",
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
        name: "Petrol Pump Construction in Moradabad",
        item: "https://www.mtboss.in/petrol-pump-construction-in-moradabad",
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