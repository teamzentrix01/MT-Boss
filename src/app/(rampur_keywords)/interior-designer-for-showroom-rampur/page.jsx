// app/(bareilly_keywords)/showroom-interior-designer-rampur/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Showroom Interior Designer Rampur | Retail Display – MTBOSS",

  description:
    "MTBOSS designs showroom interiors Rampur for furniture, car, electronics, tile, jewellery and fashion brands, with display planning, lighting, branding and on-time handover.",

  keywords:
    "showroom interior designer Rampur, showroom interior designer in Rampur, showroom interior design Rampur, retail display design Rampur, showroom renovation Rampur, furniture showroom interior Rampur, car showroom interior Rampur, automobile showroom interior Rampur, electronics showroom interior Rampur, appliance showroom interior Rampur, tile showroom interior Rampur, sanitaryware showroom interior Rampur, kitchen showroom interior Rampur, jewellery showroom interior Rampur, fashion showroom interior Rampur, apparel showroom interior Rampur, mobile showroom interior Rampur, gadget showroom interior Rampur, building material showroom interior Rampur, hardware showroom interior Rampur, franchise showroom interior Rampur, multi brand showroom interior Rampur, showroom display design Rampur, showroom product wall design Rampur, showroom lighting design Rampur, showroom false ceiling Rampur, showroom branding Rampur, showroom signage Rampur, showroom reception design Rampur, showroom sales cabin design Rampur, showroom consultation lounge design Rampur, showroom CCTV planning Rampur, showroom AC planning Rampur, MTBOSS Rampur, MTBOSS Moradabad, MTBOSS Bareilly, showroom interior consultation Rampur",

  alternates: {
    canonical:
      "https://www.mtboss.in/showroom-interior-designer-rampur",
  },

  openGraph: {
    title: "Showroom Interior Designer Rampur | Retail Display – MTBOSS",

    description:
      "MTBOSS designs showroom interiors Rampur for furniture, car, electronics, tile, jewellery and fashion brands, with display planning, lighting, branding and on-time handover.",

    url: "https://www.mtboss.in/showroom-interior-designer-rampur",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-showroom-interior-designer-rampur.jpg",
        width: 1200,
        height: 630,
        alt: "Showroom Interior Designer Rampur - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Showroom Interior Designer Rampur | Retail Display – MTBOSS",

    description:
      "MTBOSS designs showroom interiors Rampur for furniture, car, electronics, tile, jewellery and fashion brands, with display planning, lighting, branding and on-time handover.",

    images: [
      "https://www.mtboss.in/og-showroom-interior-designer-rampur.jpg",
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
    url: "https://www.mtboss.in/showroom-interior-designer-rampur",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-showroom-interior-designer-rampur.jpg",
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
      "Showroom Interior Design",
      "Retail Display Design",
      "Showroom Interior Designer",
      "Furniture Showroom Interior Design",
      "Car Showroom Interior Design",
      "Automobile Showroom Interior Design",
      "Electronics Showroom Interior Design",
      "Appliance Showroom Interior Design",
      "Tile Showroom Interior Design",
      "Sanitaryware Showroom Interior Design",
      "Kitchen Showroom Interior Design",
      "Jewellery Showroom Interior Design",
      "Fashion Showroom Interior Design",
      "Apparel Showroom Interior Design",
      "Mobile Showroom Interior Design",
      "Gadget Showroom Interior Design",
      "Building Material Showroom Interior Design",
      "Hardware Showroom Interior Design",
      "Franchise Showroom Interior Design",
      "Multi Brand Showroom Interior Design",
      "Showroom Display Design",
      "Showroom Product Wall Design",
      "Showroom Lighting Design",
      "Showroom False Ceiling Service",
      "Showroom Branding",
      "Showroom Signage",
      "Showroom Reception Design",
      "Showroom Sales Cabin Design",
      "Showroom Consultation Lounge Design",
      "Showroom Renovation",
      "Showroom Interior Services Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Showroom Interior Designer in Rampur",
    description:
      "MTBOSS designs showroom interiors in Rampur for furniture, car, electronics, tile, jewellery and fashion brands, with display planning, lighting, branding and on-time handover. Services include showroom concept and layout planning, display zone and product wall design, reception, sales cabin and consultation lounge design, hero display and feature wall design, lighting design for products and spaces, false ceiling and ceiling feature design, flooring, wall finishes and cladding, counter, billing and customer service desk design, and custom furniture and display units.",
    url: "https://www.mtboss.in/showroom-interior-designer-rampur",
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
      "Showroom Interior Design, Retail Display Design, Showroom Interior Designer, Furniture Showroom Interior Design, Car Showroom Interior Design, Automobile Showroom Interior Design, Electronics Showroom Interior Design, Appliance Showroom Interior Design, Tile Showroom Interior Design, Sanitaryware Showroom Interior Design, Kitchen Showroom Interior Design, Jewellery Showroom Interior Design, Fashion Showroom Interior Design, Apparel Showroom Interior Design, Mobile Showroom Interior Design, Gadget Showroom Interior Design, Building Material Showroom Interior Design, Hardware Showroom Interior Design, Franchise Showroom Interior Design, Multi Brand Showroom Interior Design, Showroom Display Design, Showroom Product Wall Design, Showroom Lighting Design, Showroom False Ceiling Service, Showroom Branding, Showroom Signage, Showroom Reception Design, Showroom Sales Cabin Design, Showroom Consultation Lounge Design, Showroom Renovation and Showroom Interior Services Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does a showroom interior designer do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A showroom interior designer plans the layout, display zones, lighting, finishes, branding and customer areas, and manages execution until the showroom is ready to open.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS follow my franchise brand's design guidelines?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS studies the brand manual and executes to its drawings and specifications, coordinating with the brand team where needed.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS design car and furniture showrooms?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS designs showrooms for different products, including vehicles, furniture, electronics, tiles, jewellery and fashion.",
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
        name: "Can MTBOSS work around my opening date?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS prepares a schedule linked to your target date and tells you early if anything may affect it.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS handle electrical, data and AC provisions?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS plans and coordinates these as part of the design and execution.",
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
        name: "Showroom Interior Designer Rampur",
        item: "https://www.mtboss.in/showroom-interior-designer-rampur",
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