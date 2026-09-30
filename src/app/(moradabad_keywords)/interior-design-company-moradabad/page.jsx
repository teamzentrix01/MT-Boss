// app/(moradabad_keywords)/interior-design-company-in-moradabad/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Design Company in Moradabad | MT Boss – Home & Office",
  description:
    "Looking for a trusted interior design company in Moradabad? MT Boss offers home, office and showroom interiors with clear scope, quality work and timely delivery.",
  keywords:
    "interior design company in Moradabad, interior designer Moradabad, home interior design Moradabad, office interior design Moradabad, showroom interior designer Moradabad, modular kitchen Moradabad, residential interior designer Moradabad, commercial interior design Moradabad, MT Boss interiors Moradabad",
  alternates: {
    canonical:
      "https://www.mtboss.in/interior-design-company-in-moradabad",
  },
  openGraph: {
    title: "Interior Design Company in Moradabad | MT Boss – Home & Office",
    description:
      "Looking for a trusted interior design company in Moradabad? MT Boss offers home, office and showroom interiors with clear scope, quality work and timely delivery.",
    url: "https://www.mtboss.in/interior-design-company-in-moradabad",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-structural-architect-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Design Company in Moradabad - MT Boss",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Interior Design Company in Moradabad | MT Boss – Home & Office",
    description:
      "Looking for a trusted interior design company in Moradabad? MT Boss offers home, office and showroom interiors with clear scope, quality work and timely delivery.",
    images: ["https://www.mtboss.in/og-structural-architect-moradabad.jpg"],
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
    url: "https://www.mtboss.in/interior-design-company-in-moradabad",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
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