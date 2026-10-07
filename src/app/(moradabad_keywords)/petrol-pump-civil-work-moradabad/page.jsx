// app/(moradabad_keywords)/petrol-pump-civil-work-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Petrol Pump Civil Work in Moradabad | MTBOSS",

  description:
    "Need petrol pump civil work in Moradabad? MTBOSS handles site development, forecourt, canopy foundation and buildings. Call +91 94584 10866 for a quote.",

  keywords:
    "petrol pump civil work Moradabad, petrol pump civil contractor Moradabad, petrol pump forecourt construction, petrol pump canopy foundation, petrol pump drainage work, fuel station civil work, retail outlet civil work, petrol pump RCC work, petrol pump site development, petrol pump building construction, commercial construction Moradabad, civil contractor Moradabad, petrol pump construction cost Moradabad, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad",

  alternates: {
    canonical: "https://www.mtboss.in/petrol-pump-civil-work-in-moradabad",
  },

  openGraph: {
    title: "Petrol Pump Civil Work in Moradabad | MTBOSS",

    description:
      "Need petrol pump civil work in Moradabad? MTBOSS handles site development, forecourt, canopy foundation and buildings. Call +91 94584 10866 for a quote.",

    url: "https://www.mtboss.in/petrol-pump-civil-work-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-petrol-pump-civil-work-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Petrol Pump Civil Work in Moradabad - MTBOSS Construction",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Petrol Pump Civil Work in Moradabad | MTBOSS",

    description:
      "Need petrol pump civil work in Moradabad? MTBOSS handles site development, forecourt, canopy foundation and buildings. Call +91 94584 10866 for a quote.",

    images: ["https://www.mtboss.in/og-petrol-pump-civil-work-moradabad.jpg"],
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

    url: "https://www.mtboss.in/petrol-pump-civil-work-in-moradabad",

    telephone: "+91-9458410866",

    email: "mtboss2016@gmail.com",

    image:
      "https://www.mtboss.in/og-petrol-pump-civil-work-moradabad.jpg",

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
      "Petrol Pump Civil Work",
      "Petrol Pump Civil Contractor",
      "Fuel Station Civil Work",
      "Retail Outlet Civil Work",
      "Petrol Pump Site Development",
      "Petrol Pump RCC Work",
      "Petrol Pump Forecourt Construction",
      "Forecourt Paving",
      "Petrol Pump Canopy Foundation",
      "Petrol Pump Drainage Work",
      "Petrol Pump Building Construction",
      "Boundary Wall Construction",
      "Commercial Civil Construction",
      "Roadside Construction",
      "Construction Material Supply",
      "Construction Cost Estimation",
      "Petrol Pump Renovation and Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",

    name: "Petrol Pump Civil Work Services in Moradabad",

    description:
      "MTBOSS provides petrol pump civil work in Moradabad, including site development, excavation, RCC foundations, canopy foundations, forecourt paving, dispenser island platforms, drainage, office and shop building construction, boundary walls, waterproofing, finishing and material supply.",

    url: "https://www.mtboss.in/petrol-pump-civil-work-in-moradabad",

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
      "Petrol Pump Civil Work, Fuel Station Civil Construction, Forecourt Paving, Canopy Foundation Work, RCC Work and Retail Outlet Construction",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",

    mainEntity: [
      {
        "@type": "Question",
        name: "What is included in petrol pump civil work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Petrol pump civil work includes site development, excavation, foundations, RCC work, forecourt paving, drainage, canopy foundations, office and shop buildings, boundary walls, waterproofing and finishing work built around the oil company's approved layout.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS handle petrol pump civil work in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS provides commercial, industrial and infrastructure construction services in Moradabad and Bareilly. Contact the team to discuss the civil scope, approved layout and requirements of your petrol pump project.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS install fuel tanks and dispensers?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Fuel tanks, dispensers and pipelines are usually installed according to the oil company's specifications by authorised vendors. MTBOSS focuses on civil and building work around the approved equipment layout. Confirm the exact project scope directly with the MTBOSS team.",
        },
      },
      {
        "@type": "Question",
        name: "Why is forecourt paving important for a petrol pump?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A petrol pump forecourt faces continuous vehicle movement, including heavy vehicles, fuel exposure and regular washing. Strong RCC or concrete paving with proper thickness, joints and surface slopes helps reduce cracking, standing water and future repair costs.",
        },
      },
      {
        "@type": "Question",
        name: "Why is drainage important in a petrol pump?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Proper drainage helps prevent standing water, reduces slip risks, protects paving and foundations, and helps manage rainwater and spills through planned slopes, surface drains and collection arrangements.",
        },
      },
      {
        "@type": "Question",
        name: "What approvals are needed for petrol pump construction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Requirements can include oil marketing company approval, dealership allotment, approved layout drawings, local authority permissions, road-access permissions, safety and fire clearances, explosives-related approvals and environmental requirements. Rules vary by location and oil company, so confirm current requirements with relevant authorities.",
        },
      },
      {
        "@type": "Question",
        name: "How much does petrol pump civil work cost in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on plot size, site conditions, filling requirements, forecourt specification, canopy foundation, building area, drainage scope, material quality and oil company specifications. MTBOSS offers a free Budget Calculator and project-specific quote option.",
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
        name: "Petrol Pump Civil Work in Moradabad",
        item: "https://www.mtboss.in/petrol-pump-civil-work-in-moradabad",
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