// app/(bareilly_keywords)/interior-designing-firm-rampur/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designing Firm Rampur | Design & Execution – MTBOSS",

  description:
    "MTBOSS is an interior designing firm serving Rampur with thoughtful design, 3D visuals and complete execution for homes, kitchens, offices and shops. Book a free consultation.",

  keywords:
    "interior designing firm Rampur, interior design firm Rampur, interior design firm in Rampur, interior design services Rampur, interior designer Rampur, home interior design Rampur, kitchen interior design Rampur, office interior design Rampur, shop interior design Rampur, 3D interior design Rampur, interior design company Rampur, modular kitchen Rampur, false ceiling Rampur, wardrobe design Rampur, home renovation Rampur, civil work and interior Rampur, turnkey interior Rampur, MTBOSS Rampur, MTBOSS Moradabad, MTBOSS Bareilly, interior design consultation Rampur",

  alternates: {
    canonical:
      "https://www.mtboss.in/interior-designing-firm-rampur",
  },

  openGraph: {
    title: "Interior Designing Firm Rampur | Design & Execution – MTBOSS",

    description:
      "MTBOSS is an interior designing firm serving Rampur with thoughtful design, 3D visuals and complete execution for homes, kitchens, offices and shops. Book a free consultation.",

    url: "https://www.mtboss.in/interior-designing-firm-rampur",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-interior-designing-firm-rampur.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designing Firm Rampur - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Designing Firm Rampur | Design & Execution – MTBOSS",

    description:
      "MTBOSS is an interior designing firm serving Rampur with thoughtful design, 3D visuals and complete execution for homes, kitchens, offices and shops. Book a free consultation.",

    images: [
      "https://www.mtboss.in/og-interior-designing-firm-rampur.jpg",
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
    url: "https://www.mtboss.in/interior-designing-firm-rampur",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-interior-designing-firm-rampur.jpg",
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
    name: "Interior Designing Firm in Rampur",
    description:
      "MTBOSS is an interior designing firm serving Rampur with thoughtful design, 3D visuals and complete execution for homes, kitchens, offices and shops. Services include design and space planning, modular kitchen, wardrobes and storage, living room and dining area, bedrooms and kids' rooms, puja room and mandir, false ceiling and lighting, painting, wallpaper and wall panels, flooring and tiling, bathrooms, electrical, plumbing and waterproofing, renovation and remodelling, building materials, doorstep home services, and construction and property services.",
    url: "https://www.mtboss.in/interior-designing-firm-rampur",
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
        name: "What does an interior designing firm do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It studies your needs, plans layouts, prepares designs and 3D visuals, estimates costs and manages execution until handover.",
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
        name: "Can MTBOSS incorporate vastu preferences?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS discusses your preferences and includes them where the building and layout allow.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS design commercial spaces too?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS designs offices, shops, showrooms, clinics and other business spaces.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS handle civil work and waterproofing along with interiors?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS’s construction background lets it manage these together with interior work.",
        },
      },
      {
        "@type": "Question",
        name: "How long does an interior project take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It depends on scope and complexity. MTBOSS provides a schedule with the quotation after reviewing your site.",
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
        name: "Interior Designing Firm Rampur",
        item: "https://www.mtboss.in/interior-designing-firm-rampur",
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