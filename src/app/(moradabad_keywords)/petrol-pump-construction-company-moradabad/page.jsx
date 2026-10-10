// app/(moradabad_keywords)/petrol-pump-construction-company-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Petrol Pump Construction Company in Moradabad | MTBOSS",

  description:
    "Looking for a petrol pump construction company in Moradabad? MTBOSS offers civil work, canopy, forecourt and building. Call +91 94584 10866 for a quote.",

  keywords:
    "petrol pump construction company Moradabad, petrol pump builder Moradabad, petrol pump contractor Moradabad, fuel station construction company Moradabad, petrol pump civil contractor, petrol pump canopy contractor, petrol pump forecourt work, retail outlet construction company, commercial construction company Moradabad, construction company in Moradabad, petrol pump construction cost Moradabad, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad",

  alternates: {
    canonical:
      "https://www.mtboss.in/petrol-pump-construction-company-in-moradabad",
  },

  openGraph: {
    title: "Petrol Pump Construction Company in Moradabad | MTBOSS",

    description:
      "Looking for a petrol pump construction company in Moradabad? MTBOSS offers civil work, canopy, forecourt and building. Call +91 94584 10866 for a quote.",

    url: "https://www.mtboss.in/petrol-pump-construction-company-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-petrol-pump-construction-company-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Petrol Pump Construction Company in Moradabad - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Petrol Pump Construction Company in Moradabad | MTBOSS",

    description:
      "Looking for a petrol pump construction company in Moradabad? MTBOSS offers civil work, canopy, forecourt and building. Call +91 94584 10866 for a quote.",

    images: [
      "https://www.mtboss.in/og-petrol-pump-construction-company-moradabad.jpg",
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
      "https://www.mtboss.in/petrol-pump-construction-company-in-moradabad",

    telephone: "+91-9458410866",

    email: "mtboss2016@gmail.com",

    image:
      "https://www.mtboss.in/og-petrol-pump-construction-company-moradabad.jpg",

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
      "Petrol Pump Construction Company",
      "Petrol Pump Builder",
      "Petrol Pump Contractor",
      "Petrol Pump Civil Contractor",
      "Fuel Station Construction",
      "Fuel Station Civil Work",
      "Retail Outlet Construction",
      "Petrol Pump Forecourt Work",
      "Petrol Pump Canopy Construction",
      "Canopy Foundation Construction",
      "Forecourt Paving",
      "Commercial Building Construction",
      "Roadside Construction",
      "RCC Construction",
      "Drainage Construction",
      "Boundary Wall Construction",
      "Construction Material Supply",
      "Construction Cost Estimation",
      "Petrol Pump Renovation and Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",

    name: "Petrol Pump Construction Company Services in Moradabad",

    description:
      "MTBOSS is a petrol pump construction company in Moradabad providing site development, RCC civil work, canopy foundations, forecourt paving, dispenser island platforms, drainage, office and shop building construction, boundary wall work, finishing and building material supply.",

    url:
      "https://www.mtboss.in/petrol-pump-construction-company-in-moradabad",

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
      "Petrol Pump Construction, Fuel Station Construction, Petrol Pump Civil Work, Forecourt Paving, Canopy Construction and Retail Outlet Building Services",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",

    mainEntity: [
      {
        "@type": "Question",
        name: "What does a petrol pump construction company do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A petrol pump construction company handles the civil and building work for a fuel outlet, including site development, foundation work, forecourt paving, canopy civil structure, dispenser island platforms, office and shop building, drainage, boundary wall and finishing work based on the oil company's approved layout.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS work as a petrol pump construction company in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS provides commercial, industrial and infrastructure construction services in Moradabad and Bareilly. Contact the team to discuss the approved layout, civil scope and construction requirements of your petrol pump project.",
        },
      },
      {
        "@type": "Question",
        name: "How do I choose a petrol pump construction company?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Check the company's commercial and roadside project experience, ability to follow oil company approved drawings, forecourt and drainage planning, canopy structural capability, material supply control, written scope, payment stages, site supervision process and completed project references.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS install fuel tanks and dispensers?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Fuel tanks, dispensers and fuel pipelines are generally installed by authorised vendors according to the oil company's specifications. MTBOSS focuses on the civil and building work around the approved equipment layout. Confirm the exact scope directly with the MTBOSS team.",
        },
      },
      {
        "@type": "Question",
        name: "What approvals are needed for a petrol pump?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Requirements can include oil marketing company approval, dealership allotment, approved layouts, local authority permissions, road access permissions, fire and safety clearances, explosives-related approvals and environmental requirements. Rules vary by location and oil company, so confirm current requirements with relevant authorities.",
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
        name: "Can I get a petrol pump construction quote from MTBOSS?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can use the Get a Construction Quote option on the MTBOSS website or contact the team directly by phone or WhatsApp with your plot size, approved layout, planned facilities and rough budget.",
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
        name: "Petrol Pump Construction Company in Moradabad",
        item: "https://www.mtboss.in/petrol-pump-construction-company-in-moradabad",
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