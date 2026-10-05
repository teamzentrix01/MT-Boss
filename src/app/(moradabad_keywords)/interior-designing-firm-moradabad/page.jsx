// app/(moradabad_keywords)/interior-designing-firm-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designing Firm in Moradabad | Trusted Home & Office Interiors",
  description:
    "Hiring an interior designing firm in Moradabad? MT Boss offers home, office and shop interiors with clear pricing, quality work and on-time handover. Get a free quote.",
  keywords:
    "interior designing firm in Moradabad, interior designer Moradabad, home interiors Moradabad, office interior designer Moradabad, shop interior design Moradabad, modular kitchen Moradabad, wardrobe design Moradabad, interior contractor Moradabad, commercial interiors Moradabad, showroom interior design Moradabad, turnkey interiors Moradabad, MT Boss interiors, best interior designer in Moradabad",
  alternates: {
    canonical: "https://www.mtboss.in/interior-designing-firm-in-moradabad",
  },
  openGraph: {
    title:
      "Interior Designing Firm in Moradabad | Trusted Home & Office Interiors",
    description:
      "Hiring an interior designing firm in Moradabad? MT Boss offers home, office and shop interiors with clear pricing, quality work and on-time handover. Get a free quote.",
    url: "https://www.mtboss.in/interior-designing-firm-in-moradabad",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-interior-designing-firm-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designing Firm in Moradabad - MT Boss",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Interior Designing Firm in Moradabad | Trusted Home & Office Interiors",
    description:
      "Hiring an interior designing firm in Moradabad? MT Boss offers home, office and shop interiors with clear pricing, quality work and on-time handover. Get a free quote.",
    images: [
      "https://www.mtboss.in/og-interior-designing-firm-moradabad.jpg",
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
    url: "https://www.mtboss.in/interior-designing-firm-in-moradabad",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Harthala Kanth Road, Behind KR Collection, near Domino's",
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
        "@type": "State",
        name: "Uttar Pradesh",
      },
    ],
    priceRange: "₹₹₹",
    serviceType: [
      "Interior Design",
      "Home Interiors",
      "Office Interiors",
      "Shop and Showroom Interiors",
      "Modular Kitchen Design",
      "Wardrobe Design",
      "False Ceiling Work",
      "Commercial Interior Fit-Out",
      "Construction Material Supply",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Interior Designing Services in Moradabad",
    description:
      "MTBOSS provides home, office, shop and showroom interior design services in Moradabad, including modular kitchens, wardrobes, false ceilings, lighting, civil work, carpentry and complete interior execution.",
    provider: {
      "@type": "GeneralContractor",
      name: "MTBOSS Construction Private Limited",
      telephone: "+91-9458410866",
      url: "https://www.mtboss.in",
    },
    areaServed: {
      "@type": "City",
      name: "Moradabad",
    },
    serviceType: "Interior Design and Interior Execution",
    url: "https://www.mtboss.in/interior-designing-firm-in-moradabad",
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

      <Banner />
      <Content />
      <QuickServices />
      <Services />
      <CalculatorCTA />
    </>
  );
}