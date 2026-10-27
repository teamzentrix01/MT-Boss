// app/(bareilly_keywords)/interior-designer-for-clinic-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer for Clinic in Bareilly | MTBOSS",

  description:
    "Need an interior designer for your clinic in Bareilly? Plan waiting area, consultation rooms and easy-clean finishes with MTBOSS. Call +91 94584 10866.",

  keywords:
    "interior designer for clinic Bareilly, clinic interior design Bareilly, doctor clinic interior Bareilly, dental clinic interior Bareilly, skin clinic interior Bareilly, physiotherapy clinic interior Bareilly, polyclinic interior Bareilly, clinic waiting area design Bareilly, clinic renovation Bareilly, healthcare interior Bareilly, commercial interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, clinic interior quote Bareilly",

  alternates: {
    canonical:
      "https://www.MTBOSS.in/interior-designer-for-clinic-in-bareilly",
  },

  openGraph: {
    title: "Interior Designer for Clinic in Bareilly | MTBOSS",

    description:
      "Need an interior designer for your clinic in Bareilly? Plan waiting area, consultation rooms and easy-clean finishes with MTBOSS. Call +91 94584 10866.",

    url: "https://www.MTBOSS.in/interior-designer-for-clinic-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.MTBOSS.in/og-interior-designer-clinic-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer for Clinic in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Designer for Clinic in Bareilly | MTBOSS",

    description:
      "Need an interior designer for your clinic in Bareilly? Plan waiting area, consultation rooms and easy-clean finishes with MTBOSS. Call +91 94584 10866.",

    images: [
      "https://www.MTBOSS.in/og-interior-designer-clinic-bareilly.jpg",
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
    url: "https://www.MTBOSS.in/interior-designer-for-clinic-in-bareilly",
    telephone: "+91-9458410866",
    email: "MTBOSS2016@gmail.com",
    image: "https://www.MTBOSS.in/og-interior-designer-clinic-bareilly.jpg",
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
      "Interior Designer for Clinic",
      "Clinic Interior Design",
      "Doctor Clinic Interior",
      "Dental Clinic Interior",
      "Skin Clinic Interior",
      "Physiotherapy Clinic Interior",
      "Polyclinic Interior",
      "Clinic Waiting Area Design",
      "Clinic Renovation",
      "Healthcare Interior Design",
      "Commercial Interior Design",
      "Clinic Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Clinic Interior Design Services in Bareilly",
    description:
      "MTBOSS provides clinic interior design services in Bareilly for doctor clinics, dental clinics, skin and cosmetic clinics, physiotherapy clinics, eye and ENT clinics, polyclinics and diagnostic centres. Services include space planning, reception and waiting areas, consultation rooms, treatment and procedure rooms, sterilisation areas, washrooms, ceiling and lighting design, flooring and wall finishes, furniture and woodwork, services provisions, branding, construction coordination, material supply, renovation and clinic conversion.",
    url: "https://www.MTBOSS.in/interior-designer-for-clinic-in-bareilly",
    provider: {
      "@type": "InteriorDesignService",
      name: "MTBOSS Construction Private Limited",
      telephone: "+91-9458410866",
      email: "MTBOSS2016@gmail.com",
      url: "https://www.MTBOSS.in",
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
      "Interior Designer for Clinic, Clinic Interior Design, Doctor Clinic Interior, Dental Clinic Interior, Skin Clinic Interior, Physiotherapy Clinic Interior, Polyclinic Interior, Clinic Waiting Area Design, Clinic Renovation and Healthcare Interior Design",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does a clinic interior designer do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A clinic interior designer plans the reception, waiting area, consultation and treatment rooms, lighting, finishes and branding so the clinic is welcoming, hygienic and efficient, and coordinates the work until opening.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide clinic interior design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your clinic.",
        },
      },
      {
        "@type": "Question",
        name: "Can you design a small, single-doctor clinic?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, the planning approach applies to small clinics as well as larger ones. Smart layouts, good lighting and easy-clean finishes help a compact clinic feel professional and comfortable.",
        },
      },
      {
        "@type": "Question",
        name: "Do you plan for dental chairs and other equipment?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The team plans plumbing, drainage, power points and layout around the equipment list you share, which is usually supplied and installed by your vendors. Share equipment details early so provisions can be built into the plan.",
        },
      },
      {
        "@type": "Question",
        name: "Can an existing shop or house be converted into a clinic?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In many cases, yes, subject to the building's structure, permitted use and local rules. A site visit helps the team assess what is possible.",
        },
      },
      {
        "@type": "Question",
        name: "How much does clinic interior design cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on area, number of rooms, speciality and equipment, finish level, flooring, plumbing, lighting, ventilation and the condition of the premises. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
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
        item: "https://www.MTBOSS.in/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Interior Design Services",
        item: "https://www.MTBOSS.in/interior-design-services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Interior Designer for Clinic in Bareilly",
        item: "https://www.MTBOSS.in/interior-designer-for-clinic-in-bareilly",
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