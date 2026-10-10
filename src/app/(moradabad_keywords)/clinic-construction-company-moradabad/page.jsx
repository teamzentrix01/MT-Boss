// app/(moradabad_keywords)/clinic-construction-company-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Clinic Construction Company in Moradabad | MTBOSS",

  description:
    "Looking for a clinic construction company in Moradabad? MTBOSS offers design, quality materials and on-time handover. Call +91 94584 10866.",

  keywords:
    "clinic construction company Moradabad, clinic building construction Moradabad, clinic contractor Moradabad, clinic design Moradabad, doctor clinic construction Moradabad, polyclinic construction Moradabad, dental clinic construction Moradabad, clinic interior Moradabad, clinic construction cost Moradabad, commercial construction company Moradabad, construction company in Moradabad, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad",

  alternates: {
    canonical:
      "https://www.mtboss.in/clinic-construction-company-in-moradabad",
  },

  openGraph: {
    title: "Clinic Construction Company in Moradabad | MTBOSS",

    description:
      "Looking for a clinic construction company in Moradabad? MTBOSS offers design, quality materials and on-time handover. Call +91 94584 10866.",

    url: "https://www.mtboss.in/clinic-construction-company-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-clinic-construction-company-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Clinic Construction Company in Moradabad - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Clinic Construction Company in Moradabad | MTBOSS",

    description:
      "Looking for a clinic construction company in Moradabad? MTBOSS offers design, quality materials and on-time handover. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-clinic-construction-company-moradabad.jpg",
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
    url: "https://www.mtboss.in/clinic-construction-company-in-moradabad",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-clinic-construction-company-moradabad.jpg",
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
      "Clinic Construction Company",
      "Clinic Building Construction",
      "Clinic Contractor",
      "Clinic Design",
      "Doctor Clinic Construction",
      "Polyclinic Construction",
      "Dental Clinic Construction",
      "Clinic Interior",
      "Clinic Construction Cost Estimation",
      "Commercial Construction",
      "Building Renovation",
      "Building Extension",
      "Construction Material Supply",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Clinic Construction Services in Moradabad",
    description:
      "MTBOSS provides clinic construction in Moradabad for single-doctor clinics, dental clinics, polyclinics and clinics with pharmacy or diagnostic space, including design coordination, structure, facade, services provisions, washroom planning, dental and procedure room provisions, waterproofing, flooring, finishing, interiors, outdoor works and final handover.",
    url: "https://www.mtboss.in/clinic-construction-company-in-moradabad",
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
      "Clinic Construction Company, Clinic Building Construction, Clinic Contractor, Clinic Design, Doctor Clinic Construction, Polyclinic Construction, Dental Clinic Construction and Clinic Interior",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is clinic construction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Clinic construction is the planning and building of a small healthcare facility, including consultation and procedure rooms, waiting and reception areas, services and finishing, from design to handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS build clinics in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS builds residential projects, from affordable housing to luxury villas, in Moradabad and Bareilly, and offers construction services for other buildings. Share your plan with the team to confirm the scope for your clinic.",
        },
      },
      {
        "@type": "Question",
        name: "Can you convert a house or shop into a clinic?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In many cases, yes, subject to the building's structure, permitted use and local rules. A site visit helps the team assess what is possible.",
        },
      },
      {
        "@type": "Question",
        name: "Do you plan for dental chairs and other clinic equipment?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The team plans plumbing, drainage, power points and layout around the equipment list you share, which is usually supplied and installed by your vendors. Share the equipment details early so provisions can be built into the structure.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need special approvals to run a clinic?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Beyond the building map, clinics may need healthcare-related registrations, biomedical waste arrangements and, for certain equipment, extra permissions. Confirm the requirements with the relevant authorities and your professional council.",
        },
      },
      {
        "@type": "Question",
        name: "How much does clinic construction cost in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Clinic construction cost depends on built-up area, number of rooms, services scope, equipment provisions, material and finish level and site conditions. MTBOSS offers a free Budget Calculator and detailed quote option.",
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
        name: "Clinic Construction Company in Moradabad",
        item: "https://www.mtboss.in/clinic-construction-company-in-moradabad",
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