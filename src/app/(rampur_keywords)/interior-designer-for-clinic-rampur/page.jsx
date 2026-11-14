// app/(bareilly_keywords)/clinic-interior-designer-rampur/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title:
    "Clinic Interior Designer Rampur | Doctor's Clinic Design – MTBOSS",
  description:
    "MTBOSS designs clinic interiors Rampur: reception, waiting area, consultation rooms and procedure rooms, with hygienic finishes, patient comfort and on-time handover. Free consultation.",
  keywords:
    "clinic interior designer Rampur, doctor's clinic design Rampur, clinic interior design Rampur, medical clinic interiors Rampur, clinic reception design Rampur, clinic waiting area design Rampur, consultation room design Rampur, procedure room design Rampur, clinic renovation Rampur, MTBOSS Rampur",
  alternates: {
    canonical:
      "https://www.mtboss.in/clinic-interior-designer-rampur",
  },
  openGraph: {
    title:
      "Clinic Interior Designer Rampur | Doctor's Clinic Design – MTBOSS",
    description:
      "MTBOSS designs clinic interiors Rampur: reception, waiting area, consultation rooms and procedure rooms, with hygienic finishes, patient comfort and on-time handover. Free consultation.",
    url:
      "https://www.mtboss.in/clinic-interior-designer-rampur",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url:
          "https://www.mtboss.in/og-clinic-interior-designer-rampur.jpg",
        width: 1200,
        height: 630,
        alt:
          "Clinic Interior Designer in Rampur - Doctor's Clinic Design - MTBOSS",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Clinic Interior Designer Rampur | Doctor's Clinic Design – MTBOSS",
    description:
      "MTBOSS designs clinic interiors Rampur: reception, waiting area, consultation rooms and procedure rooms, with hygienic finishes, patient comfort and on-time handover. Free consultation.",
    images: [
      "https://www.mtboss.in/og-clinic-interior-designer-rampur.jpg",
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
    url:
      "https://www.mtboss.in/clinic-interior-designer-rampur",
    telephone: "+91-9458410866",
    email: "MTBOSS2016@gmail.com",
    image:
      "https://www.mtboss.in/og-clinic-interior-designer-rampur.jpg",
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
      "Clinic Interior Design",
      "Doctor's Clinic Design",
      "Medical Clinic Interiors",
      "Clinic Reception Design",
      "Clinic Waiting Area Design",
      "Consultation Room Design",
      "Procedure Room Design",
      "Clinic Renovation",
      "Healthcare Interior Design",
      "Interior Design Services",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Clinic Interior Designer in Rampur",
    description:
      "MTBOSS designs clinic interiors in Rampur, including reception areas, waiting areas, consultation rooms, procedure rooms, storage, lighting, flooring, wall finishes, ceilings, electrical and plumbing work, with hygienic finishes, patient comfort and on-time handover.",
    url:
      "https://www.mtboss.in/clinic-interior-designer-rampur",
    provider: {
      "@type": "InteriorDesignService",
      name: "MTBOSS Construction Private Limited",
      telephone: "+91-9458410866",
      email: "MTBOSS2016@gmail.com",
      url: "https://www.mtboss.in",
    },
    areaServed: [
      {
        "@type": "City",
        name: "Rampur",
      },
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
      "Clinic Interior Design, Doctor's Clinic Design, Medical Clinic Interiors, Clinic Reception Design, Clinic Waiting Area Design, Consultation Room Design, Procedure Room Design and Clinic Renovation",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name:
          "What clinic interior design services does MTBOSS offer in Rampur?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "MTBOSS offers clinic interior design for reception areas, waiting areas, consultation rooms, procedure rooms, storage, false ceilings, lighting, flooring, wall finishes, bathrooms, electrical, plumbing and renovation work.",
        },
      },
      {
        "@type": "Question",
        name:
          "Can MTBOSS design a doctor's clinic in Rampur?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. MTBOSS provides clinic interior design and renovation services for doctor's clinics, medical clinics and healthcare spaces, subject to the project scope and local requirements.",
        },
      },
      {
        "@type": "Question",
        name:
          "What areas of a clinic can MTBOSS design?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "MTBOSS can design reception and waiting areas, consultation rooms, procedure rooms, storage areas, staff areas, toilets, corridors, ceilings, lighting and exterior or facade elements.",
        },
      },
      {
        "@type": "Question",
        name:
          "How much does clinic interior design cost in Rampur?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Cost depends on clinic size, scope, material and finish level, furniture, ceiling and lighting, flooring, wall finishes, electrical and plumbing work. Request a consultation for a detailed estimate.",
        },
      },
      {
        "@type": "Question",
        name:
          "Does MTBOSS handle clinic renovation work?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. MTBOSS can support clinic renovation, including painting, flooring, false ceilings, electrical work, plumbing, waterproofing, storage and interior upgrades.",
        },
      },
      {
        "@type": "Question",
        name:
          "Where is the MTBOSS office located?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "The office is located at Harthala, Kanth Road, Behind KR Collection, near Domino's, Moradabad, Uttar Pradesh.",
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
        name: "Clinic Interior Designer in Rampur",
        item:
          "https://www.mtboss.in/clinic-interior-designer-rampur",
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