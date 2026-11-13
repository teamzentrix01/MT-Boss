// app/(bareilly_keywords)/top-interior-designer-rampur/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Top Interior Designer Rampur | Home & Office Interiors – MTBOSS",

  description:
    "MTBOSS offers modern home, kitchen and office interiors Rampur with 3D design, quality materials and complete execution. Explore packages and get a free consultation.",

  keywords:
    "top interior designer Rampur, best interior designer Rampur, interior designer in Rampur, interior design services Rampur, home interior designer Rampur, kitchen interior designer Rampur, office interior designer Rampur, interior design company Rampur, 3D interior design Rampur, modular kitchen Rampur, false ceiling Rampur, wardrobe design Rampur, home renovation Rampur, interior designer near Rampur, MTBOSS Rampur, MTBOSS Moradabad, MTBOSS Bareilly, interior design consultation Rampur",

  alternates: {
    canonical:
      "https://www.mtboss.in/top-interior-designer-rampur",
  },

  openGraph: {
    title: "Top Interior Designer Rampur | Home & Office Interiors – MTBOSS",

    description:
      "MTBOSS offers modern home, kitchen and office interiors Rampur with 3D design, quality materials and complete execution. Explore packages and get a free consultation.",

    url: "https://www.mtboss.in/top-interior-designer-rampur",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-top-interior-designer-rampur.jpg",
        width: 1200,
        height: 630,
        alt: "Top Interior Designer Rampur - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Top Interior Designer Rampur | Home & Office Interiors – MTBOSS",

    description:
      "MTBOSS offers modern home, kitchen and office interiors Rampur with 3D design, quality materials and complete execution. Explore packages and get a free consultation.",

    images: [
      "https://www.mtboss.in/og-top-interior-designer-rampur.jpg",
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
    url: "https://www.mtboss.in/top-interior-designer-rampur",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-top-interior-designer-rampur.jpg",
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
    name: "Top Interior Designer in Rampur",
    description:
      "MTBOSS provides modern home, kitchen and office interiors in Rampur with 3D design, quality materials and complete execution. Services include design and space planning, modular kitchen, wardrobes and storage, living room and dining area, bedrooms and kids' rooms, puja room and mandir, false ceiling and lighting, painting, wallpaper and wall panels, flooring and tiling, bathrooms, electrical, plumbing and waterproofing, renovation and remodelling, building materials, doorstep home services, and construction and property services.",
    url: "https://www.mtboss.in/top-interior-designer-rampur",
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
        name: "How do I choose a top interior designer in Rampur?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Look at past work, ask for 3D designs, compare itemised quotes, check material samples and confirm who will execute and supervise the work.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide 3D designs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can review visuals before any work begins.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS design only a kitchen or one room?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS takes projects from a single modular kitchen to a complete home.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS handle civil work along with interiors?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS can manage civil changes, waterproofing, electrical, plumbing and finishing along with interior work.",
        },
      },
      {
        "@type": "Question",
        name: "How long does interior work take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It depends on scope and complexity. MTBOSS gives a schedule with the quotation after reviewing your site.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS offer renovation of old homes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS handles remodelling, repainting, flooring, kitchen and wardrobe upgrades and more.",
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
        name: "Top Interior Designer Rampur",
        item: "https://www.mtboss.in/top-interior-designer-rampur",
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