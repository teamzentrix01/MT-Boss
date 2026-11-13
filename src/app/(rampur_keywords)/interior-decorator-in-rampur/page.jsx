// app/(bareilly_keywords)/interior-decorator-rampur/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Decorator Rampur | Home & Shop Decoration – MTBOSS",

  description:
    "Looking for an interior decorator Rampur? MTBOSS offers home and shop decoration, wall finishes, false ceilings, lighting and makeovers with clear pricing and quick service.",

  keywords:
    "interior decorator Rampur, interior decorator in Rampur, home decorator Rampur, shop decorator Rampur, interior decoration services Rampur, wall painting Rampur, wallpaper installation Rampur, false ceiling Rampur, lighting design Rampur, home makeover Rampur, shop decoration Rampur, feature wall Rampur, wall panelling Rampur, interior designer Rampur, interior renovation Rampur, MTBOSS Rampur, MTBOSS Moradabad, MTBOSS Bareilly, decoration consultation Rampur",

  alternates: {
    canonical:
      "https://www.mtboss.in/interior-decorator-rampur",
  },

  openGraph: {
    title: "Interior Decorator Rampur | Home & Shop Decoration – MTBOSS",

    description:
      "Looking for an interior decorator Rampur? MTBOSS offers home and shop decoration, wall finishes, false ceilings, lighting and makeovers with clear pricing and quick service.",

    url: "https://www.mtboss.in/interior-decorator-rampur",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-interior-decorator-rampur.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Decorator Rampur - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Decorator Rampur | Home & Shop Decoration – MTBOSS",

    description:
      "Looking for an interior decorator Rampur? MTBOSS offers home and shop decoration, wall finishes, false ceilings, lighting and makeovers with clear pricing and quick service.",

    images: [
      "https://www.mtboss.in/og-interior-decorator-rampur.jpg",
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
    url: "https://www.mtboss.in/interior-decorator-rampur",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-interior-decorator-rampur.jpg",
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
      "Interior Decoration Services",
      "Home Decoration Services",
      "Shop Decoration Services",
      "Wall Painting and Texture Finishes",
      "Wallpaper Installation",
      "Feature Walls and Panelling",
      "False Ceiling and Lighting Decoration",
      "Furniture Arrangement and Furniture Makeover",
      "Flooring and Tile Enhancement",
      "Doors, Windows and Carpentry Details",
      "Home Makeover and Renovation",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Interior Decorator in Rampur",
    description:
      "MTBOSS offers home and shop decoration in Rampur with wall finishes, false ceilings, lighting and makeovers. Services include wall painting and texture finishes, wallpaper installation, feature walls and panelling, false ceiling and lighting decoration, furniture arrangement and furniture makeover, flooring and tile enhancement, doors, windows and carpentry details, shop and showroom decoration, festive and occasion decoration planning, home makeover and renovation, civil work, waterproofing, electrical and plumbing support, and related home services.",
    url: "https://www.mtboss.in/interior-decorator-rampur",
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
      "Interior Decoration Services, Home Decoration Services, Shop Decoration Services, Wall Painting and Texture Finishes, Wallpaper Installation, Feature Walls and Panelling, False Ceiling and Lighting Decoration, Furniture Arrangement and Furniture Makeover, Flooring and Tile Enhancement, Doors, Windows and Carpentry Details, Home Makeover and Renovation",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does an interior decorator do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A decorator improves the look and feel of a space through colours, wall finishes, lighting, furniture arrangement, curtains and accessories.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS decorate just one room?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS takes projects of every size, from one room or one feature wall to a full home or shop.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide wallpaper and painting services?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS handles painting, texture finishes and wallpaper installation.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS fix damp walls before decorating?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS checks for moisture and treats the problem before applying paint or wallpaper.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS also do false ceilings and lighting?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS designs and installs false ceilings and plans lighting to suit your rooms.",
        },
      },
      {
        "@type": "Question",
        name: "How long does decoration work take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It depends on the area and the work involved. MTBOSS gives a schedule with the quotation after seeing your space.",
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
        name: "Interior Decorator Rampur",
        item: "https://www.mtboss.in/interior-decorator-rampur",
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