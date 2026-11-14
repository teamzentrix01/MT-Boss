// app/(bareilly_keywords)/shop-interior-designer-rampur/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Shop Interior Designer Rampur | Retail Shop Design – MTBOSS",

  description:
    "MTBOSS designs and builds shop interiors Rampur: display, shelving, counters, lighting and facade for garments, jewellery, mobile, general and other shops. Get a free consultation.",

  keywords:
    "shop interior designer Rampur, shop interior designer in Rampur, shop interior design Rampur, retail shop design Rampur, shop renovation Rampur, garment shop interior Rampur, jewellery shop interior Rampur, mobile shop interior Rampur, electronics shop interior Rampur, general store interior Rampur, grocery store interior Rampur, footwear shop interior Rampur, cosmetics shop interior Rampur, gift shop interior Rampur, pharmacy shop interior Rampur, stationery shop interior Rampur, toy shop interior Rampur, book shop interior Rampur, sweet shop interior Rampur, bakery shop interior Rampur, furniture shop interior Rampur, tile shop interior Rampur, hardware shop interior Rampur, salon interior design Rampur, boutique interior design Rampur, shop display design Rampur, shop shelving design Rampur, shop counter design Rampur, shop facade design Rampur, signboard design Rampur, shop lighting design Rampur, shop false ceiling Rampur, shop CCTV planning Rampur, shop AC planning Rampur, MTBOSS Rampur, MTBOSS Moradabad, MTBOSS Bareilly, shop interior consultation Rampur",

  alternates: {
    canonical:
      "https://www.mtboss.in/shop-interior-designer-rampur",
  },

  openGraph: {
    title: "Shop Interior Designer Rampur | Retail Shop Design – MTBOSS",

    description:
      "MTBOSS designs and builds shop interiors Rampur: display, shelving, counters, lighting and facade for garments, jewellery, mobile, general and other shops. Get a free consultation.",

    url: "https://www.mtboss.in/shop-interior-designer-rampur",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-shop-interior-designer-rampur.jpg",
        width: 1200,
        height: 630,
        alt: "Shop Interior Designer Rampur - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Shop Interior Designer Rampur | Retail Shop Design – MTBOSS",

    description:
      "MTBOSS designs and builds shop interiors Rampur: display, shelving, counters, lighting and facade for garments, jewellery, mobile, general and other shops. Get a free consultation.",

    images: [
      "https://www.mtboss.in/og-shop-interior-designer-rampur.jpg",
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
    url: "https://www.mtboss.in/shop-interior-designer-rampur",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-shop-interior-designer-rampur.jpg",
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
      "Shop Interior Design",
      "Retail Shop Design",
      "Shop Interior Designer",
      "Garment Shop Interior Design",
      "Jewellery Shop Interior Design",
      "Mobile Shop Interior Design",
      "Electronics Shop Interior Design",
      "General Store Interior Design",
      "Grocery Store Interior Design",
      "Footwear Shop Interior Design",
      "Cosmetics Shop Interior Design",
      "Gift Shop Interior Design",
      "Pharmacy Shop Interior Design",
      "Stationery Shop Interior Design",
      "Toy Shop Interior Design",
      "Book Shop Interior Design",
      "Sweet Shop Interior Design",
      "Bakery Shop Interior Design",
      "Furniture Shop Interior Design",
      "Tile Shop Interior Design",
      "Hardware Shop Interior Design",
      "Salon Interior Design",
      "Boutique Interior Design",
      "Shop Display Design",
      "Shop Shelving Design",
      "Shop Counter Design",
      "Shop Facade Design",
      "Signboard Design",
      "Shop Lighting Design",
      "Shop False Ceiling Service",
      "Shop Renovation",
      "Shop Interior Services Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Shop Interior Designer in Rampur",
    description:
      "MTBOSS designs and builds shop interiors in Rampur: display, shelving, counters, lighting and facade for garments, jewellery, mobile, general and other shops. Services include space planning for small and large shops, display wall, shelf and rack design, counter and billing area design, facade, shutter area and signboard planning, false ceiling and lighting design, flooring and wall finishes, custom furniture and storage units, trial room and cabin design, and mezzanine and loft planning where height allows.",
    url: "https://www.mtboss.in/shop-interior-designer-rampur",
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
      "Shop Interior Design, Retail Shop Design, Shop Interior Designer, Garment Shop Interior Design, Jewellery Shop Interior Design, Mobile Shop Interior Design, Electronics Shop Interior Design, General Store Interior Design, Grocery Store Interior Design, Footwear Shop Interior Design, Cosmetics Shop Interior Design, Gift Shop Interior Design, Pharmacy Shop Interior Design, Stationery Shop Interior Design, Toy Shop Interior Design, Book Shop Interior Design, Sweet Shop Interior Design, Bakery Shop Interior Design, Furniture Shop Interior Design, Tile Shop Interior Design, Hardware Shop Interior Design, Salon Interior Design, Boutique Interior Design, Shop Display Design, Shop Shelving Design, Shop Counter Design, Shop Facade Design, Signboard Design, Shop Lighting Design, Shop False Ceiling Service, Shop Renovation and Shop Interior Services Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does a shop interior designer do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A shop interior designer plans the layout, display, counters, lighting, finishes and storage, and manages execution until the shop is ready to open.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS design very small shops?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS designs shops of different sizes, including small shops where careful planning matters most.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS handle facade and signboard planning?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS plans the facade and signboard area, subject to local market rules.",
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
        name: "Can MTBOSS work to my opening date?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS prepares a schedule linked to your target date and tells you early if anything may affect it.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS handle electrical, CCTV and AC provisions?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS plans and coordinates wiring, CCTV points and AC provisions as part of the project.",
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
        name: "Shop Interior Designer Rampur",
        item: "https://www.mtboss.in/shop-interior-designer-rampur",
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