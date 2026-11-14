// app/(bareilly_keywords)/gym-interior-designer-rampur/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Gym Interior Designer Rampur | Fitness Centre – MTBOSS",

  description:
    "MTBOSS designs gym and fitness centre interiors Rampur: layout, rubber flooring, lighting, ventilation, changing rooms and branding, delivered on time.",

  keywords:
    "gym interior designer Rampur, gym interior designer in Rampur, gym interior design Rampur, fitness centre interior design Rampur, gym renovation Rampur, fitness centre renovation Rampur, ladies gym interior design Rampur, gents gym interior design Rampur, unisex gym interior design Rampur, CrossFit gym interior design Rampur, functional training gym interior design Rampur, yoga studio interior design Rampur, Zumba studio interior design Rampur, aerobics studio interior design Rampur, personal training studio interior design Rampur, home gym interior design Rampur, society gym interior design Rampur, franchise gym interior design Rampur, gym rubber flooring Rampur, gym flooring design Rampur, gym lighting design Rampur, gym ventilation design Rampur, gym AC planning Rampur, gym electrical planning Rampur, gym false ceiling Rampur, gym changing room design Rampur, gym locker design Rampur, gym washroom design Rampur, gym reception design Rampur, gym lounge design Rampur, gym branding Rampur, gym signage Rampur, gym mirror design Rampur, gym soundproofing Rampur, gym structural check Rampur, MTBOSS Rampur, MTBOSS Moradabad, MTBOSS Bareilly, gym interior consultation Rampur",

  alternates: {
    canonical:
      "https://www.mtboss.in/gym-interior-designer-rampur",
  },

  openGraph: {
    title: "Gym Interior Designer Rampur | Fitness Centre – MTBOSS",

    description:
      "MTBOSS designs gym and fitness centre interiors Rampur: layout, rubber flooring, lighting, ventilation, changing rooms and branding, delivered on time.",

    url: "https://www.mtboss.in/gym-interior-designer-rampur",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-gym-interior-designer-rampur.jpg",
        width: 1200,
        height: 630,
        alt: "Gym Interior Designer Rampur - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Gym Interior Designer Rampur | Fitness Centre – MTBOSS",

    description:
      "MTBOSS designs gym and fitness centre interiors Rampur: layout, rubber flooring, lighting, ventilation, changing rooms and branding, delivered on time.",

    images: [
      "https://www.mtboss.in/og-gym-interior-designer-rampur.jpg",
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
    url: "https://www.mtboss.in/gym-interior-designer-rampur",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-gym-interior-designer-rampur.jpg",
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
      "Gym Interior Design",
      "Fitness Centre Interior Design",
      "Gym Interior Designer",
      "Ladies Gym Interior Design",
      "Gents Gym Interior Design",
      "Unisex Gym Interior Design",
      "CrossFit Gym Interior Design",
      "Functional Training Gym Interior Design",
      "Yoga Studio Interior Design",
      "Zumba Studio Interior Design",
      "Aerobics Studio Interior Design",
      "Personal Training Studio Interior Design",
      "Home Gym Interior Design",
      "Society Gym Interior Design",
      "Franchise Gym Interior Design",
      "Gym Rubber Flooring",
      "Gym Flooring Design",
      "Gym Lighting Design",
      "Gym Ventilation Design",
      "Gym AC Planning",
      "Gym Electrical Planning",
      "Gym False Ceiling Service",
      "Gym Changing Room Design",
      "Gym Locker Design",
      "Gym Washroom Design",
      "Gym Reception Design",
      "Gym Lounge Design",
      "Gym Branding",
      "Gym Signage",
      "Gym Mirror Design",
      "Gym Soundproofing",
      "Gym Structural Check",
      "Gym Renovation",
      "Gym Interior Services Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Gym Interior Designer in Rampur",
    description:
      "MTBOSS designs gym and fitness centre interiors in Rampur: layout, rubber flooring, lighting, ventilation, changing rooms and branding, delivered on time. Services include gym concept and space planning, reception and lounge design, cardio, weights and machine zone planning, functional and stretching area design, group studio design for yoga, Zumba and aerobics, changing room, locker and washroom design, juice bar and supplement counter design, false ceiling and lighting design.",
    url: "https://www.mtboss.in/gym-interior-designer-rampur",
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
      "Gym Interior Design, Fitness Centre Interior Design, Gym Interior Designer, Ladies Gym Interior Design, Gents Gym Interior Design, Unisex Gym Interior Design, CrossFit Gym Interior Design, Functional Training Gym Interior Design, Yoga Studio Interior Design, Zumba Studio Interior Design, Aerobics Studio Interior Design, Personal Training Studio Interior Design, Home Gym Interior Design, Society Gym Interior Design, Franchise Gym Interior Design, Gym Rubber Flooring, Gym Flooring Design, Gym Lighting Design, Gym Ventilation Design, Gym AC Planning, Gym Electrical Planning, Gym False Ceiling Service, Gym Changing Room Design, Gym Locker Design, Gym Washroom Design, Gym Reception Design, Gym Lounge Design, Gym Branding, Gym Signage, Gym Mirror Design, Gym Soundproofing, Gym Structural Check, Gym Renovation and Gym Interior Services Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does a gym interior designer do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A gym interior designer plans the layout, flooring, lighting, ventilation, changing rooms and branding, and manages execution until the gym is ready to open.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS design a small gym?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS designs gyms of different sizes, including compact spaces where careful planning matters most.",
        },
      },
      {
        "@type": "Question",
        name: "Which flooring is best for a gym?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Rubber flooring suits weight zones, softer surfaces suit stretching and functional areas, and anti-slip tiles suit walkways and wet areas.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS design a ladies' gym?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS plans privacy, controlled entry, partitions and comfortable changing facilities.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS plan ventilation and cooling?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS plans exhaust, fresh air and AC provisions suited to your area and member load.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS supply gym equipment?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS designs and builds the interior and custom units. Equipment is usually supplied by your chosen vendors, and MTBOSS coordinates sizes, power and floor load with them.",
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
        name: "How long does a gym interior project take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It depends on the size and scope. MTBOSS gives a schedule with the quotation after reviewing your space and your target opening date.",
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
        name: "Gym Interior Designer Rampur",
        item: "https://www.mtboss.in/gym-interior-designer-rampur",
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