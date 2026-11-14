// app/(bareilly_keywords)/hospital-interior-designer-rampur/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Hospital Interior Designer Rampur | Clinic & Healthcare – MTBOSS",

  description:
    "MTBOSS designs and builds hospital and clinic interiors Rampur with patient-friendly layouts, hygienic finishes, clear signage and phased execution. Request a free consultation.",

  keywords:
    "hospital interior designer Rampur, hospital interior designer in Rampur, hospital interior design Rampur, clinic interior design Rampur, healthcare interior design Rampur, nursing home interior design Rampur, diagnostic centre interior design Rampur, pharmacy interior design Rampur, medical store interior design Rampur, OPD interior design Rampur, ward interior design Rampur, nursing station design Rampur, reception design Rampur, waiting area design Rampur, consultation room design Rampur, hospital renovation Rampur, clinic renovation Rampur, healthcare renovation Rampur, hospital false ceiling Rampur, hospital waterproofing Rampur, hospital plumbing Rampur, hospital electrical planning Rampur, hospital signage Rampur, MTBOSS Rampur, MTBOSS Moradabad, MTBOSS Bareilly, hospital interior consultation Rampur",

  alternates: {
    canonical:
      "https://www.mtboss.in/hospital-interior-designer-rampur",
  },

  openGraph: {
    title: "Hospital Interior Designer Rampur | Clinic & Healthcare – MTBOSS",

    description:
      "MTBOSS designs and builds hospital and clinic interiors Rampur with patient-friendly layouts, hygienic finishes, clear signage and phased execution. Request a free consultation.",

    url: "https://www.mtboss.in/hospital-interior-designer-rampur",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-hospital-interior-designer-rampur.jpg",
        width: 1200,
        height: 630,
        alt: "Hospital Interior Designer Rampur - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Hospital Interior Designer Rampur | Clinic & Healthcare – MTBOSS",

    description:
      "MTBOSS designs and builds hospital and clinic interiors Rampur with patient-friendly layouts, hygienic finishes, clear signage and phased execution. Request a free consultation.",

    images: [
      "https://www.mtboss.in/og-hospital-interior-designer-rampur.jpg",
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
    url: "https://www.mtboss.in/hospital-interior-designer-rampur",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-hospital-interior-designer-rampur.jpg",
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
        name: "Rampur",
      },
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
      "Hospital Interior Design",
      "Clinic Interior Design",
      "Healthcare Interior Design",
      "Nursing Home Interior Design",
      "Diagnostic Centre Interior Design",
      "Pharmacy Interior Design",
      "OPD Interior Design",
      "Ward Interior Design",
      "Nursing Station Design",
      "Reception Design",
      "Waiting Area Design",
      "Consultation Room Design",
      "Hospital Renovation",
      "Clinic Renovation",
      "Healthcare Interior Services Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Hospital Interior Designer in Rampur",
    description:
      "MTBOSS designs and builds hospital and clinic interiors in Rampur with patient-friendly layouts, hygienic finishes, clear signage and phased execution. Services include space planning with patient and staff movement in mind, reception and waiting area design, OPD and consultation room interiors, ward and private room interiors, nursing station and counter design, pharmacy and billing counter design, false ceiling and lighting design, partition systems, flooring, wall finishes and painting, waterproofing, electrical and plumbing coordination, and renovation support.",
    url: "https://www.mtboss.in/hospital-interior-designer-rampur",
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
        name: "Rampur",
      },
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
      "Hospital Interior Design, Clinic Interior Design, Healthcare Interior Design, Nursing Home Interior Design, Diagnostic Centre Interior Design, Pharmacy Interior Design, OPD Interior Design, Ward Interior Design, Nursing Station Design, Reception Design, Waiting Area Design, Consultation Room Design, Hospital Renovation, Clinic Renovation and Healthcare Interior Services Quote",
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
          text: "A hospital interior designer plans layouts, patient and staff movement, finishes, lighting, furniture and signage areas, and manages execution while coordinating with your medical team and suppliers.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS design small clinics and nursing homes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS handles clinics, nursing homes, diagnostic centres and hospitals of different sizes.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide medical equipment or medical gas systems?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. MTBOSS handles the building and interior work and coordinates with your equipment and specialist vendors. Medical equipment and specialised systems are installed by your chosen suppliers.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS renovate while the hospital stays open?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS can plan phased work to reduce disruption, depending on the scope and your operations.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide 3D designs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can review visuals before work begins.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS handle waterproofing and plumbing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS manages waterproofing, plumbing and electrical coordination as part of the project.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS serve Rampur and nearby cities?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS serves Rampur, Moradabad and Bareilly and can discuss nearby locations.",
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
        name: "Hospital Interior Designer Rampur",
        item: "https://www.mtboss.in/hospital-interior-designer-rampur",
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