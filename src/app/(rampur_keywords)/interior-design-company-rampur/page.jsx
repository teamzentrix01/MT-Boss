// app/(bareilly_keywords)/interior-design-company-rampur/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Design Company Rampur | Home & Commercial – MTBOSS",

  description:
    "MTBOSS is an interior design company serving Rampur with design, civil work, carpentry and finishing under one team. Home, kitchen, office and shop interiors with clear quotations.",

  keywords:
    "interior design company Rampur, interior design company in Rampur, interior design services Rampur, home interior company Rampur, commercial interior design Rampur, office interior design Rampur, shop interior design Rampur, kitchen interior design Rampur, modular kitchen Rampur, false ceiling Rampur, wardrobe design Rampur, interior renovation Rampur, civil work and interior Rampur, turnkey interior Rampur, interior design firm Rampur, MTBOSS Rampur, MTBOSS Moradabad, MTBOSS Bareilly, interior design consultation Rampur",

  alternates: {
    canonical:
      "https://www.mtboss.in/interior-design-company-rampur",
  },

  openGraph: {
    title: "Interior Design Company Rampur | Home & Commercial – MTBOSS",

    description:
      "MTBOSS is an interior design company serving Rampur with design, civil work, carpentry and finishing under one team. Home, kitchen, office and shop interiors with clear quotations.",

    url: "https://www.mtboss.in/interior-design-company-rampur",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-interior-design-company-rampur.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Design Company Rampur - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Design Company Rampur | Home & Commercial – MTBOSS",

    description:
      "MTBOSS is an interior design company serving Rampur with design, civil work, carpentry and finishing under one team. Home, kitchen, office and shop interiors with clear quotations.",

    images: [
      "https://www.mtboss.in/og-interior-design-company-rampur.jpg",
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
    url: "https://www.mtboss.in/interior-design-company-rampur",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-interior-design-company-rampur.jpg",
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
      "Interior Design Services",
      "Home Interior Services",
      "Interior Design Company",
      "Full Home Interior",
      "Turnkey Interior",
      "Modular Kitchen Service",
      "False Ceiling Service",
      "Bathroom Renovation",
      "Interior Renovation",
      "Home Interior Design",
      "Interior Services Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Interior Design Company in Rampur",
    description:
      "MTBOSS is an interior design company serving Rampur with design, civil work, carpentry and finishing under one team. Services include design and space planning, modular kitchen, wardrobes and storage, living room and dining area, bedrooms and kids' rooms, puja room and mandir, false ceiling and lighting, painting, wallpaper and wall panels, flooring and tiling, bathrooms, electrical, plumbing and waterproofing, renovation and remodelling, building materials, doorstep home services, and construction and property services.",
    url: "https://www.mtboss.in/interior-design-company-rampur",
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
      "Interior Design Services, Home Interior Services, Interior Design Company, Full Home Interior, Turnkey Interior, Modular Kitchen Service, False Ceiling Service, Bathroom Renovation, Interior Renovation and Interior Services Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does an interior design company do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It plans, designs, costs and executes interiors, including layout, 3D design, carpentry, ceilings, painting, flooring and handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS handle both design and execution?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Design, civil work, carpentry, finishing and installation are managed by the MTBOSS team.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS design only a kitchen or a few rooms?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS takes projects from a single modular kitchen to a full home or commercial space.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide 3D designs and itemised quotations?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can review visuals and a detailed estimate before work starts.",
        },
      },
      {
        "@type": "Question",
        name: "How long does an interior project take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It depends on scope and complexity. MTBOSS gives a schedule with the quotation after reviewing your site.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS offer renovation and repair services?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS handles remodelling, repainting, flooring, waterproofing and repair work.",
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
        name: "Interior Design Company Rampur",
        item: "https://www.mtboss.in/interior-design-company-rampur",
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