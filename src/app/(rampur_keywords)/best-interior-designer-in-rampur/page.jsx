// app/(bareilly_keywords)/best-interior-designer-in-rampur/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Best Interior Designer in Rampur | Home & Office Interiors – MTBOSS",

  description:
    "Looking for the best interior designer in Rampur? MTBOSS offers home, kitchen, office and shop interiors with 3D design, quality materials and on-time execution. Get a free consultation.",

  keywords:
    "best interior designer in Rampur, best interior designer Rampur, interior designer in Rampur, interior design services Rampur, home interior designer Rampur, kitchen interior designer Rampur, office interior designer Rampur, shop interior designer Rampur, 3D interior design Rampur, interior design company Rampur, modular kitchen Rampur, false ceiling Rampur, wardrobe design Rampur, home renovation Rampur, interior designer near Rampur, MTBOSS Rampur, MTBOSS Moradabad, MTBOSS Bareilly, interior design consultation Rampur",

  alternates: {
    canonical:
      "https://www.mtboss.in/best-interior-designer-in-rampur",
  },

  openGraph: {
    title: "Best Interior Designer in Rampur | Home & Office Interiors – MTBOSS",

    description:
      "Looking for the best interior designer in Rampur? MTBOSS offers home, kitchen, office and shop interiors with 3D design, quality materials and on-time execution. Get a free consultation.",

    url: "https://www.mtboss.in/best-interior-designer-in-rampur",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-best-interior-designer-in-rampur.jpg",
        width: 1200,
        height: 630,
        alt: "Best Interior Designer in Rampur - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Best Interior Designer in Rampur | Home & Office Interiors – MTBOSS",

    description:
      "Looking for the best interior designer in Rampur? MTBOSS offers home, kitchen, office and shop interiors with 3D design, quality materials and on-time execution. Get a free consultation.",

    images: [
      "https://www.mtboss.in/og-best-interior-designer-in-rampur.jpg",
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
    url: "https://www.mtboss.in/best-interior-designer-in-rampur",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-best-interior-designer-in-rampur.jpg",
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
    name: "Best Interior Designer in Rampur",
    description:
      "MTBOSS provides home, kitchen, office and shop interiors in Rampur with 3D design, quality materials and on-time execution. Services include design and space planning, modular kitchen, wardrobes and storage, living room and dining area, bedrooms and kids' rooms, puja room and mandir, false ceiling and lighting, painting, wallpaper and wall panels, flooring and tiling, bathrooms, electrical, plumbing and waterproofing, renovation and remodelling, building materials, doorstep home services, and construction and property services.",
    url: "https://www.mtboss.in/best-interior-designer-in-rampur",
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
        name: "How do I choose the best interior designer in Rampur?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Check their past work, ask for 3D designs, compare itemised quotations, see material samples and confirm who will execute and supervise the work.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS offer free consultation?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can call MTBOSS to discuss your project and get initial guidance on design and next steps.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide 3D designs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS prepares visuals so you can see the design before work begins.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS do only the kitchen or only a few rooms?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS takes projects of different sizes, from one modular kitchen to a full home.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS handle civil work along with interiors?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS can handle civil changes, waterproofing, electrical, plumbing and finishing alongside interior work.",
        },
      },
      {
        "@type": "Question",
        name: "How long does interior work take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Time depends on scope and complexity. MTBOSS gives a schedule with the quotation after reviewing your site and design.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS serve Rampur?",
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
        name: "Best Interior Designer in Rampur",
        item: "https://www.mtboss.in/best-interior-designer-in-rampur",
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