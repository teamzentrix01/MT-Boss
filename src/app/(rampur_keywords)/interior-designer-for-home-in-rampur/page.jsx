// app/(bareilly_keywords)/interior-designer-for-home-in-rampur/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer for Home in Rampur | Home Interiors – MTBOSS",

  description:
    "Planning home interiors in Rampur? MTBOSS designs and builds complete home interiors for flats, houses and villas with 3D design, modular kitchens, wardrobes and clear pricing.",

  keywords:
    "interior designer for home in Rampur, home interior designer Rampur, home interior design Rampur, home interiors Rampur, interior designer in Rampur, interior design services Rampur, complete home interior Rampur, full home interior Rampur, flat interior design Rampur, house interior design Rampur, villa interior design Rampur, modular kitchen Rampur, wardrobe design Rampur, false ceiling Rampur, home renovation Rampur, 3D interior design Rampur, interior design company Rampur, MTBOSS Rampur, MTBOSS Moradabad, MTBOSS Bareilly, home interior consultation Rampur",

  alternates: {
    canonical:
      "https://www.mtboss.in/interior-designer-for-home-in-rampur",
  },

  openGraph: {
    title: "Interior Designer for Home in Rampur | Home Interiors – MTBOSS",

    description:
      "Planning home interiors in Rampur? MTBOSS designs and builds complete home interiors for flats, houses and villas with 3D design, modular kitchens, wardrobes and clear pricing.",

    url: "https://www.mtboss.in/interior-designer-for-home-in-rampur",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-interior-designer-for-home-in-rampur.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer for Home in Rampur - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Designer for Home in Rampur | Home Interiors – MTBOSS",

    description:
      "Planning home interiors in Rampur? MTBOSS designs and builds complete home interiors for flats, houses and villas with 3D design, modular kitchens, wardrobes and clear pricing.",

    images: [
      "https://www.mtboss.in/og-interior-designer-for-home-in-rampur.jpg",
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
    url: "https://www.mtboss.in/interior-designer-for-home-in-rampur",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-interior-designer-for-home-in-rampur.jpg",
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
      "Home Interior Design",
      "Complete Home Interior",
      "Full Home Interior",
      "Interior Designer for Home",
      "Modular Kitchen Service",
      "Wardrobe and Storage Design",
      "False Ceiling Service",
      "Bathroom Renovation",
      "Interior Renovation",
      "Home Interior Services Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Interior Designer for Home in Rampur",
    description:
      "MTBOSS designs and builds complete home interiors in Rampur for flats, houses and villas with 3D design, modular kitchens, wardrobes and clear pricing. Services include design and space planning, modular kitchen, wardrobes and storage, living room and dining area, bedrooms and kids' rooms, puja room and mandir, false ceiling and lighting, painting, wallpaper and wall panels, flooring and tiling, bathrooms, electrical, plumbing and waterproofing, renovation and remodelling, building materials, doorstep home services, and construction and property services.",
    url: "https://www.mtboss.in/interior-designer-for-home-in-rampur",
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
      "Interior Design Services, Home Interior Services, Home Interior Design, Complete Home Interior, Full Home Interior, Interior Designer for Home, Modular Kitchen Service, Wardrobe and Storage Design, False Ceiling Service, Bathroom Renovation, Interior Renovation and Home Interior Services Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What home interior services does MTBOSS offer in Rampur?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS offers complete home interiors, modular kitchens, wardrobes, living and bedroom interiors, false ceilings, bathrooms, pooja rooms, painting, flooring, electrical, plumbing, waterproofing, renovation, building materials and doorstep home services.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS design interiors for flats, houses and villas in Rampur?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS designs and executes interiors for flats, independent houses, duplexes and villas.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide 3D designs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can review the proposed design and request changes before work begins.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS handle modular kitchens and wardrobes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS plans and builds modular kitchens, wardrobes, lofts, walk-in closets, shoe units and utility storage.",
        },
      },
      {
        "@type": "Question",
        name: "How much do home interiors cost in Rampur?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on home size, scope, material and finish level, kitchen and wardrobe specifications, ceiling and lighting, custom furniture and civil work. Use the Budget Calculator on the MTBOSS website, or request a detailed quote.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS handle civil work along with home interiors?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS can handle civil changes, waterproofing, electrical, plumbing and finishing alongside interior work.",
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
        name: "Interior Designer for Home in Rampur",
        item: "https://www.mtboss.in/interior-designer-for-home-in-rampur",
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