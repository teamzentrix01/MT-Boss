// app/(bareilly_keywords)/interior-designer-in-rampur/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer in Rampur | MTBoss",

  description:
    "Looking for an interior designer in Rampur? MTBoss plans ceilings, lighting, wardrobes, kitchens and finishes for homes and shops, with clear estimates.",

  keywords:
    "interior designer in Rampur, interior design Rampur, home interior designer Rampur, interior designer near Rampur, modular kitchen Rampur, false ceiling Rampur, wardrobe design Rampur, home renovation Rampur, shop interior Rampur, MTBoss Rampur, MTBoss Moradabad, interior design services Rampur, interior designer Rampur Uttar Pradesh, interior services quote Rampur",

  alternates: {
    canonical:
      "https://www.mtboss.in/interior-designer-in-rampur",
  },

  openGraph: {
    title: "Interior Designer in Rampur | MTBoss",

    description:
      "Looking for an interior designer in Rampur? MTBoss plans ceilings, lighting, wardrobes, kitchens and finishes for homes and shops, with clear estimates.",

    url: "https://www.mtboss.in/interior-designer-in-rampur",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-interior-designer-in-rampur.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer in Rampur - MTBoss",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Designer in Rampur | MTBoss",

    description:
      "Looking for an interior designer in Rampur? MTBoss plans ceilings, lighting, wardrobes, kitchens and finishes for homes and shops, with clear estimates.",

    images: [
      "https://www.mtboss.in/og-interior-designer-in-rampur.jpg",
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
    url: "https://www.mtboss.in/interior-designer-in-rampur",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-interior-designer-in-rampur.jpg",
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
    name: "Interior Designer in Rampur",
    description:
      "MTBoss provides interior design services in Rampur. Services include design and space planning, modular kitchen, wardrobes and storage, living room and dining area, bedrooms and kids' rooms, puja room and mandir, false ceiling and lighting, painting, wallpaper and wall panels, flooring and tiling, bathrooms, electrical, plumbing and waterproofing, renovation and remodelling, building materials, doorstep home services, and construction and property services.",
    url: "https://www.mtboss.in/interior-designer-in-rampur",
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
        name: "Who offers interior design services in Rampur?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBoss plans interiors for homes and shops, serving clients from its Kanth Road office in Moradabad.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBoss have an office in Rampur?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. MTBoss serves Rampur through visits, shared drawings and updates.",
        },
      },
      {
        "@type": "Question",
        name: "What do you need to start?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Location, room photographs, a short brief and a budget range.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBoss design a single room?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Describe the room, and the team will say what is needed.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBoss handle kitchens, wardrobes and ceilings?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The website lists modular kitchen, carpenter and false ceiling services.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBoss work in a home we are living in?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The team plans sections, working hours and dust control around your routine.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBoss give itemised quotations?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Estimates list work items, materials, labour, timeline and payment stages.",
        },
      },
      {
        "@type": "Question",
        name: "Can I check the likely cost first?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Use the Budget Calculator on www.mtboss.in for an early idea.",
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
        name: "Interior Designer in Rampur",
        item: "https://www.mtboss.in/interior-designer-in-rampur",
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