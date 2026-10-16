// app/(bareilly_keywords)/interior-designer-for-hospital-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer for Hospital in Bareilly | MTBOSS",

  description:
    "Need an interior designer for your hospital in Bareilly? Plan wards, OPD, waiting areas and easy-clean finishes with MTBOSS. Call +91 94584 10866.",

  keywords:
    "interior designer for hospital Bareilly, hospital interior design Bareilly, healthcare interior design Bareilly, nursing home interior Bareilly, clinic interior design Bareilly, hospital ward design Bareilly, hospital OPD design Bareilly, hospital renovation Bareilly, patient room interior Bareilly, hospital lobby design Bareilly, commercial interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, hospital interior quote Bareilly",

  alternates: {
    canonical:
      "https://www.mtboss.in/interior-designer-for-hospital-in-bareilly",
  },

  openGraph: {
    title: "Interior Designer for Hospital in Bareilly | MTBOSS",

    description:
      "Need an interior designer for your hospital in Bareilly? Plan wards, OPD, waiting areas and easy-clean finishes with MTBOSS. Call +91 94584 10866.",

    url: "https://www.mtboss.in/interior-designer-for-hospital-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-interior-designer-hospital-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer for Hospital in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Designer for Hospital in Bareilly | MTBOSS",

    description:
      "Need an interior designer for your hospital in Bareilly? Plan wards, OPD, waiting areas and easy-clean finishes with MTBOSS. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-interior-designer-hospital-bareilly.jpg",
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
    url: "https://www.mtboss.in/interior-designer-for-hospital-in-bareilly",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-interior-designer-hospital-bareilly.jpg",
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
      "Interior Designer for Hospital",
      "Hospital Interior Design",
      "Healthcare Interior Design",
      "Nursing Home Interior",
      "Clinic Interior Design",
      "Hospital Ward Design",
      "Hospital OPD Design",
      "Hospital Renovation",
      "Patient Room Interior",
      "Hospital Lobby Design",
      "Commercial Interior Design",
      "Hospital Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Hospital Interior Design Services in Bareilly",
    description:
      "MTBOSS provides hospital interior design services in Bareilly for hospitals, nursing homes, clinics, polyclinics, maternity centres, speciality hospitals, diagnostic centres and rehabilitation facilities. Services include space planning, reception and waiting areas, OPD and consultation rooms, wards and patient rooms, nursing stations, corridors and wayfinding, washrooms, ceiling and lighting design, flooring and wall finishes, furniture and woodwork, services provisions, construction coordination, material supply, renovation and remodelling.",
    url: "https://www.mtboss.in/interior-designer-for-hospital-in-bareilly",
    provider: {
      "@type": "InteriorDesignService",
      name: "MTBOSS Construction Private Limited",
      telephone: "+91-9458410866",
      email: "mtboss2016@gmail.com",
      url: "https://www.mtboss.in",
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
      "Interior Designer for Hospital, Hospital Interior Design, Healthcare Interior Design, Nursing Home Interior, Clinic Interior Design, Hospital Ward Design, Hospital OPD Design, Hospital Renovation, Patient Room Interior and Hospital Lobby Design",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does a hospital interior designer do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A hospital interior designer plans reception, OPD, wards, corridors and support areas, including layouts, finishes, lighting, furniture and signage, and coordinates the work until the facility is ready.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide hospital interior design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your hospital, nursing home or clinic.",
        },
      },
      {
        "@type": "Question",
        name: "Can you renovate a hospital while it keeps running?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In many cases, yes, by phasing the work department by department, separating work zones and controlling dust and noise. Share your department timings, and the team can plan accordingly.",
        },
      },
      {
        "@type": "Question",
        name: "Do you handle operation theatres and medical gas systems?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Operation theatre systems, medical gas, specialised ventilation and medical equipment are usually supplied and installed by specialist vendors. MTBOSS plans and builds the interior and civil work, and coordinates with your vendors so provisions fit together.",
        },
      },
      {
        "@type": "Question",
        name: "How do interiors help with infection control?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Seamless, easy-to-clean surfaces, coved edges, good ventilation, handwash stations and well-planned routes for waste and linen all support hygiene. Discuss specific requirements with your clinical team and the relevant authorities.",
        },
      },
      {
        "@type": "Question",
        name: "Can you also build the hospital or nursing home building?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS builds residential projects and offers construction services for other buildings. Share your plan with the team to confirm the scope for a new building.",
        },
      },
      {
        "@type": "Question",
        name: "How much does hospital interior design cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on total area, number of beds, departments, finish level, flooring and wall protection, washrooms, lighting and ventilation, furniture and building condition. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
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
        item: "https://www.mtboss.in/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Interior Design Services",
        item: "https://www.mtboss.in/interior-design-services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Interior Designer for Hospital in Bareilly",
        item: "https://www.mtboss.in/interior-designer-for-hospital-in-bareilly",
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