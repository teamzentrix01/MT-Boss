// app/(bareilly_keywords)/apartment-interior-designer-rampur/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title:
    "Apartment Interior Designer Rampur | Home Interiors – MTBOSS",
  description:
    "MTBOSS designs apartment interiors Rampur: modular kitchen, wardrobes, false ceiling, lighting and finishing, planned around society rules and delivered on time.",
  keywords:
    "apartment interior designer Rampur, apartment interior design Rampur, home interiors Rampur, 1BHK interior design Rampur, 2BHK interior design Rampur, 3BHK interior design Rampur, modular kitchen Rampur, wardrobe design Rampur, false ceiling Rampur, apartment renovation Rampur, MTBOSS Rampur",
  alternates: {
    canonical:
      "https://www.mtboss.in/apartment-interior-designer-rampur",
  },
  openGraph: {
    title:
      "Apartment Interior Designer Rampur | Home Interiors – MTBOSS",
    description:
      "MTBOSS designs apartment interiors Rampur: modular kitchen, wardrobes, false ceiling, lighting and finishing, planned around society rules and delivered on time.",
    url:
      "https://www.mtboss.in/apartment-interior-designer-rampur",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url:
          "https://www.mtboss.in/og-apartment-interior-designer-rampur.jpg",
        width: 1200,
        height: 630,
        alt:
          "Apartment Interior Designer in Rampur - Home Interiors - MTBOSS",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Apartment Interior Designer Rampur | Home Interiors – MTBOSS",
    description:
      "MTBOSS designs apartment interiors Rampur: modular kitchen, wardrobes, false ceiling, lighting and finishing, planned around society rules and delivered on time.",
    images: [
      "https://www.mtboss.in/og-apartment-interior-designer-rampur.jpg",
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
    url:
      "https://www.mtboss.in/apartment-interior-designer-rampur",
    telephone: "+91-9458410866",
    email: "MTBOSS2016@gmail.com",
    image:
      "https://www.mtboss.in/og-apartment-interior-designer-rampur.jpg",
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
        name: "Bareilly",
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
      "Apartment Interior Design",
      "Home Interior Design",
      "1BHK Interior Design",
      "2BHK Interior Design",
      "3BHK Interior Design",
      "Modular Kitchen",
      "Wardrobe Design",
      "False Ceiling",
      "Lighting Design",
      "Apartment Renovation",
      "Interior Design Services",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Apartment Interior Designer in Rampur",
    description:
      "MTBOSS designs apartment interiors in Rampur, including modular kitchens, wardrobes, false ceilings, lighting, flooring, painting, bathrooms, electrical, plumbing, waterproofing, renovation and finishing work, planned around society rules and delivered on time.",
    url:
      "https://www.mtboss.in/apartment-interior-designer-rampur",
    provider: {
      "@type": "InteriorDesignService",
      name: "MTBOSS Construction Private Limited",
      telephone: "+91-9458410866",
      email: "MTBOSS2016@gmail.com",
      url: "https://www.mtboss.in",
    },
    areaServed: [
      {
        "@type": "City",
        name: "Rampur",
      },
      {
        "@type": "City",
        name: "Bareilly",
      },
      {
        "@type": "City",
        name: "Moradabad",
      },
    ],
    serviceType:
      "Apartment Interior Design, Home Interior Design, 1BHK Interior Design, 2BHK Interior Design, 3BHK Interior Design, Modular Kitchen, Wardrobe Design, False Ceiling, Lighting Design and Apartment Renovation",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name:
          "What apartment interior design services does MTBOSS offer in Rampur?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "MTBOSS offers apartment interior design for modular kitchens, wardrobes, false ceilings, lighting, flooring, painting, bathrooms, electrical, plumbing, waterproofing, renovation and finishing work.",
        },
      },
      {
        "@type": "Question",
        name:
          "Can MTBOSS design 1BHK, 2BHK and 3BHK apartments in Rampur?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. MTBOSS designs and executes interiors for 1BHK, 2BHK, 3BHK and larger apartments, with layouts planned around space, storage, comfort and budget.",
        },
      },
      {
        "@type": "Question",
        name:
          "Can MTBOSS handle only a modular kitchen or wardrobes?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. MTBOSS can take up individual services such as modular kitchens, wardrobes, false ceilings, painting, flooring or bathroom renovation, depending on the project scope.",
        },
      },
      {
        "@type": "Question",
        name:
          "How much does apartment interior design cost in Rampur?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Cost depends on apartment size, scope, material and finish level, kitchen and wardrobe specifications, ceiling and lighting, furniture and civil work. Request a consultation for a detailed estimate.",
        },
      },
      {
        "@type": "Question",
        name:
          "Can MTBOSS renovate an existing apartment?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. MTBOSS can handle apartment renovation, including painting, flooring, false ceilings, kitchens, wardrobes, bathrooms, electrical work, plumbing and waterproofing.",
        },
      },
      {
        "@type": "Question",
        name:
          "Does MTBOSS plan apartment work around society rules?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. MTBOSS plans apartment work around society rules, lift access, working hours and other requirements. Residents should confirm current society or builder rules before starting.",
        },
      },
      {
        "@type": "Question",
        name:
          "Where is the MTBOSS office located?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "The office is located at Harthala, Kanth Road, Behind KR Collection, near Domino's, Moradabad, Uttar Pradesh.",
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
        name: "Apartment Interior Designer in Rampur",
        item:
          "https://www.mtboss.in/apartment-interior-designer-rampur",
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