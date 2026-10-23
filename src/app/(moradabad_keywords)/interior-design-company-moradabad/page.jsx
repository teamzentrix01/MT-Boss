// app/(moradabad_keywords)/interior-design-company-in-moradabad/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Design Company in Moradabad | MTBoss – Home & Office",
  description:
    "Looking for a trusted interior design company in Moradabad? MTBoss offers home, office and showroom interiors with clear scope, quality work and timely delivery.",
  keywords:
    "interior design company in Moradabad, interior designer Moradabad, home interior design Moradabad, office interior design Moradabad, showroom interior designer Moradabad, modular kitchen Moradabad, residential interior designer Moradabad, commercial interior design Moradabad, MTBoss interiors Moradabad",
  alternates: {
    canonical:
      "https://www.MTBoss.in/interior-design-company-in-moradabad",
  },
  openGraph: {
    title: "Interior Design Company in Moradabad | MTBoss – Home & Office",
    description:
      "Looking for a trusted interior design company in Moradabad? MTBoss offers home, office and showroom interiors with clear scope, quality work and timely delivery.",
    url: "https://www.MTBoss.in/interior-design-company-in-moradabad",
    siteName: "MTBoss Construction Private Limited",
    images: [
      {
        url: "https://www.MTBoss.in/og-structural-architect-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Design Company in Moradabad - MTBoss",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Interior Design Company in Moradabad | MTBoss – Home & Office",
    description:
      "Looking for a trusted interior design company in Moradabad? MTBoss offers home, office and showroom interiors with clear scope, quality work and timely delivery.",
    images: ["https://www.MTBoss.in/og-structural-architect-moradabad.jpg"],
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
    name: "MTBoss Construction Private Limited",
    url: "https://www.MTBoss.in/interior-design-company-in-moradabad",
    telephone: "+91-9458410866",
    email: "MTBoss2016@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Harthala Kanth Road, Behind Kr Collection, near Domino's",
      addressLocality: "Moradabad",
      addressRegion: "Uttar Pradesh",
      addressCountry: "IN",
    },
    areaServed: {
      "@type": "City",
      name: "Moradabad",
    },
    priceRange: "₹₹",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
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