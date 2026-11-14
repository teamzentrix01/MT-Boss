// app/(bareilly_keywords)/salon-interior-designer-rampur/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Salon Interior Designer Rampur | Beauty Parlour & Spa – MTBOSS",

  description:
    "MTBOSS designs salon and beauty parlour interiors Rampur: styling stations, wash area, lighting, bridal room and reception, built with durable finishes and delivered on time.",

  keywords:
    "salon interior designer Rampur, salon interior designer in Rampur, salon interior design Rampur, beauty parlour interior design Rampur, beauty parlour interior designer Rampur, spa interior design Rampur, salon renovation Rampur, ladies salon interior design Rampur, gents salon interior design Rampur, barber shop interior design Rampur, unisex salon interior design Rampur, bridal studio interior design Rampur, makeup studio interior design Rampur, nail studio interior design Rampur, lash studio interior design Rampur, hair studio interior design Rampur, salon styling station design Rampur, salon wash area design Rampur, salon plumbing Rampur, salon drainage design Rampur, salon waterproofing Rampur, salon lighting design Rampur, salon mirror design Rampur, salon false ceiling Rampur, salon reception design Rampur, salon waiting area design Rampur, salon bridal room design Rampur, salon treatment room design Rampur, salon product display design Rampur, salon branding Rampur, salon signage Rampur, salon AC planning Rampur, salon ventilation Rampur, salon electrical planning Rampur, MTBOSS Rampur, MTBOSS Moradabad, MTBOSS Bareilly, salon interior consultation Rampur",

  alternates: {
    canonical:
      "https://www.mtboss.in/salon-interior-designer-rampur",
  },

  openGraph: {
    title: "Salon Interior Designer Rampur | Beauty Parlour & Spa – MTBOSS",

    description:
      "MTBOSS designs salon and beauty parlour interiors Rampur: styling stations, wash area, lighting, bridal room and reception, built with durable finishes and delivered on time.",

    url: "https://www.mtboss.in/salon-interior-designer-rampur",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-salon-interior-designer-rampur.jpg",
        width: 1200,
        height: 630,
        alt: "Salon Interior Designer Rampur - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Salon Interior Designer Rampur | Beauty Parlour & Spa – MTBOSS",

    description:
      "MTBOSS designs salon and beauty parlour interiors Rampur: styling stations, wash area, lighting, bridal room and reception, built with durable finishes and delivered on time.",

    images: [
      "https://www.mtboss.in/og-salon-interior-designer-rampur.jpg",
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
    url: "https://www.mtboss.in/salon-interior-designer-rampur",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-salon-interior-designer-rampur.jpg",
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
      "Salon Interior Design",
      "Beauty Parlour Interior Design",
      "Spa Interior Design",
      "Salon Interior Designer",
      "Ladies Salon Interior Design",
      "Gents Salon Interior Design",
      "Barber Shop Interior Design",
      "Unisex Salon Interior Design",
      "Bridal Studio Interior Design",
      "Makeup Studio Interior Design",
      "Nail Studio Interior Design",
      "Lash Studio Interior Design",
      "Hair Studio Interior Design",
      "Salon Styling Station Design",
      "Salon Wash Area Design",
      "Salon Plumbing",
      "Salon Drainage Design",
      "Salon Waterproofing",
      "Salon Lighting Design",
      "Salon Mirror Design",
      "Salon False Ceiling Service",
      "Salon Reception Design",
      "Salon Waiting Area Design",
      "Salon Bridal Room Design",
      "Salon Treatment Room Design",
      "Salon Product Display Design",
      "Salon Branding",
      "Salon Signage",
      "Salon AC Planning",
      "Salon Ventilation",
      "Salon Electrical Planning",
      "Salon Renovation",
      "Salon Interior Services Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Salon Interior Designer in Rampur",
    description:
      "MTBOSS designs salon and beauty parlour interiors in Rampur: styling stations, wash area, lighting, bridal room and reception, built with durable finishes and delivered on time. Services include salon concept and space planning, reception and waiting area design, styling station and mirror unit design, hair wash area planning, treatment room and bridal room design, product display and retail corner design, false ceiling and lighting design, flooring, wall finishes and feature walls, and storage, trolley and cabinet design.",
    url: "https://www.mtboss.in/salon-interior-designer-rampur",
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
      "Salon Interior Design, Beauty Parlour Interior Design, Spa Interior Design, Salon Interior Designer, Ladies Salon Interior Design, Gents Salon Interior Design, Barber Shop Interior Design, Unisex Salon Interior Design, Bridal Studio Interior Design, Makeup Studio Interior Design, Nail Studio Interior Design, Lash Studio Interior Design, Hair Studio Interior Design, Salon Styling Station Design, Salon Wash Area Design, Salon Plumbing, Salon Drainage Design, Salon Waterproofing, Salon Lighting Design, Salon Mirror Design, Salon False Ceiling Service, Salon Reception Design, Salon Waiting Area Design, Salon Bridal Room Design, Salon Treatment Room Design, Salon Product Display Design, Salon Branding, Salon Signage, Salon AC Planning, Salon Ventilation, Salon Electrical Planning, Salon Renovation and Salon Interior Services Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does a salon interior designer do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A salon interior designer plans the layout, stations, wash area, lighting, mirrors, finishes and branding, and manages execution until the salon is ready to open.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS design a small salon or parlour?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS designs salons of different sizes, including compact spaces where careful planning matters most.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS plan plumbing and wash units?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS plans water supply, drainage and waterproofing for wash units and basins, and coordinates with the units you choose.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS design a separate bridal room?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS can plan a private bridal or makeup room with good lighting, mirrors, seating and storage.",
        },
      },
      {
        "@type": "Question",
        name: "How does MTBOSS plan lighting and mirrors?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS designs shadow-free, comfortable lighting around each station and selects mirror sizes and positions that suit your work.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide privacy for ladies' salons?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS can plan glass finishes, curtains, partitions and private treatment areas.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS supply salon chairs and equipment?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS designs and builds the interior and custom units. Salon chairs, wash units and equipment are usually supplied by your chosen vendors, and MTBOSS coordinates sizes, power and plumbing with them.",
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
        name: "How long does a salon interior project take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It depends on the size and scope. MTBOSS gives a schedule with the quotation after reviewing your space and your target opening date.",
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
        name: "Salon Interior Designer Rampur",
        item: "https://www.mtboss.in/salon-interior-designer-rampur",
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