// app/(bareilly_keywords)/interior-designer-near-me-rampur/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer Near Me Rampur | Free Site Visit – MTBOSS",

  description:
    "Looking for an interior designer near you Rampur? MTBOSS offers home, kitchen and office interiors with free consultation, site visits, 3D design and complete execution.",

  keywords:
    "interior designer near me Rampur, interior designer near me in Rampur, interior designer Rampur, interior design services Rampur, home interior designer Rampur, kitchen interior designer Rampur, office interior designer Rampur, interior designer near Rampur, free site visit interior designer Rampur, 3D interior design Rampur, interior design company Rampur, home renovation Rampur, modular kitchen Rampur, false ceiling Rampur, MTBOSS Rampur, MTBOSS Moradabad, MTBOSS Bareilly",

  alternates: {
    canonical:
      "https://www.mtboss.in/interior-designer-near-me-rampur",
  },

  openGraph: {
    title: "Interior Designer Near Me Rampur | Free Site Visit – MTBOSS",

    description:
      "Looking for an interior designer near you Rampur? MTBOSS offers home, kitchen and office interiors with free consultation, site visits, 3D design and complete execution.",

    url: "https://www.mtboss.in/interior-designer-near-me-rampur",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-interior-designer-near-me-rampur.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer Near Me Rampur - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Designer Near Me Rampur | Free Site Visit – MTBOSS",

    description:
      "Looking for an interior designer near you Rampur? MTBOSS offers home, kitchen and office interiors with free consultation, site visits, 3D design and complete execution.",

    images: [
      "https://www.mtboss.in/og-interior-designer-near-me-rampur.jpg",
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
    url: "https://www.mtboss.in/interior-designer-near-me-rampur",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-interior-designer-near-me-rampur.jpg",
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
    name: "Interior Designer Near Me Rampur",
    description:
      "MTBOSS provides interior design services in Rampur. Services include design and space planning, modular kitchen, wardrobes and storage, living room and dining area, bedrooms and kids' rooms, puja room and mandir, false ceiling and lighting, painting, wallpaper and wall panels, flooring and tiling, bathrooms, electrical, plumbing and waterproofing, renovation and remodelling, building materials, doorstep home services, and construction and property services.",
    url: "https://www.mtboss.in/interior-designer-near-me-rampur",
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
        name: "How do I find a reliable interior designer near me in Rampur?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Check their website and reviews, ask for completed projects, meet the team, compare written quotations and confirm who will execute the work.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS offer a free site visit?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can call or message us to arrange a consultation and site visit.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS serve my area in Rampur?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS serves Rampur, Moradabad and Bareilly. Send your location on WhatsApp, and the team will confirm.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS design just one room or a kitchen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS takes projects of every size, from one modular kitchen to a complete home or shop.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide 3D designs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can see visuals before work begins.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS also handle civil work, painting and electrical work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS can manage these together with interior work.",
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
        name: "Interior Designer Near Me Rampur",
        item: "https://www.mtboss.in/interior-designer-near-me-rampur",
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