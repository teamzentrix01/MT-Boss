// app/(moradabad_keywords)/villa-construction-company-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Villa Construction Company in Moradabad | MTBOSS",

  description:
    "Build your dream villa with MTBOSS, a villa construction company in Moradabad. Custom design and quality finish. Call +91 94584 10866.",

  keywords:
    "villa construction company Moradabad, villa construction Moradabad, luxury villa construction Moradabad, villa builder Moradabad, villa contractor Moradabad, custom villa design Moradabad, villa construction cost Moradabad, farmhouse construction Moradabad, luxury home construction Moradabad, bungalow construction Moradabad, residential construction company Moradabad, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad",

  alternates: {
    canonical:
      "https://www.mtboss.in/villa-construction-company-in-moradabad",
  },

  openGraph: {
    title: "Villa Construction Company in Moradabad | MTBOSS",

    description:
      "Build your dream villa with MTBOSS, a villa construction company in Moradabad. Custom design and quality finish. Call +91 94584 10866.",

    url: "https://www.mtboss.in/villa-construction-company-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-villa-construction-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Villa Construction Company in Moradabad - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Villa Construction Company in Moradabad | MTBOSS",

    description:
      "Build your dream villa with MTBOSS, a villa construction company in Moradabad. Custom design and quality finish. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-villa-construction-moradabad.jpg",
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
    "@type": "GeneralContractor",
    name: "MTBOSS Construction Private Limited",
    url: "https://www.mtboss.in/villa-construction-company-in-moradabad",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image: "https://www.mtboss.in/og-villa-construction-moradabad.jpg",
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
      "Villa Construction Company",
      "Villa Construction",
      "Luxury Villa Construction",
      "Villa Builder",
      "Villa Contractor",
      "Custom Villa Design",
      "Farmhouse Construction",
      "Luxury Home Construction",
      "Bungalow Construction",
      "Residential Construction",
      "Villa Renovation",
      "Villa Extension",
      "Construction Material Supply",
      "Villa Construction Cost Estimation",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Villa Construction Services in Moradabad",
    description:
      "MTBOSS provides villa construction in Moradabad for custom homes and luxury villas, including design coordination, structure, facade, services provisions, waterproofing, premium finishing, modular kitchen, interiors, outdoor works and final handover.",
    url: "https://www.mtboss.in/villa-construction-company-in-moradabad",
    provider: {
      "@type": "GeneralContractor",
      name: "MTBOSS Construction Private Limited",
      telephone: "+91-9458410866",
      email: "mtboss2016@gmail.com",
      url: "https://www.mtboss.in",
    },
    areaServed: [
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
      "Villa Construction, Luxury Villa Construction, Custom Villa Design, Farmhouse Construction, Luxury Home Construction and Bungalow Construction",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does a villa construction company do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A villa construction company plans and builds villas, handling design coordination, structure, services, premium finishing, outdoor works and handover. Work may include custom floor plans, 3D elevation, modular kitchen and interiors.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS build villas in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS builds residential projects from affordable homes to luxury villas in Moradabad and Bareilly.",
        },
      },
      {
        "@type": "Question",
        name: "Can I get a custom villa design?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Floor plans, elevation and 3D views are prepared around your lifestyle, plot and preferences, and refined with your feedback before construction begins.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS handle interiors and a modular kitchen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS works as an architect and interior designer and offers modular kitchen work, so interiors can be coordinated with construction. Confirm the interior scope with the team.",
        },
      },
      {
        "@type": "Question",
        name: "How much does villa construction cost in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Villa construction cost depends on built-up area, number of floors, design complexity, material and finish level, interior scope, outdoor development and site conditions. MTBOSS offers a free Budget Calculator and detailed quote option.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS supply building materials?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS supplies cement, TMT steel bars, bricks, tiles and paints through its wholesale material supply network, helping coordinate key materials during villa construction.",
        },
      },
      {
        "@type": "Question",
        name: "Can I build my villa from outside Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Because one company coordinates the project, you can stay updated by phone, WhatsApp or email without visiting the site daily.",
        },
      },
      {
        "@type": "Question",
        name: "Where is the MTBOSS office located?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The MTBOSS office is located at Harthala, Kanth Road, Behind KR Collection, near Domino's, Moradabad, Uttar Pradesh.",
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
        name: "Construction Services",
        item: "https://www.mtboss.in/construction-services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Villa Construction Company in Moradabad",
        item: "https://www.mtboss.in/villa-construction-company-in-moradabad",
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