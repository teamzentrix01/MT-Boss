// app/(moradabad_keywords)/interior-design-cost-in-moradabad/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Design Cost in Moradabad 2026 | MT Boss Pricing Guide",
  description:
    "Know the interior design cost in Moradabad per sq ft for 1BHK, 2BHK, 3BHK, kitchen and offices. Get a free quote from MT Boss – transparent, on-time work.",
  keywords:
    "interior design cost in Moradabad, interior cost Moradabad, 2BHK interior cost Moradabad, 3BHK interior cost Moradabad, modular kitchen cost Moradabad, office interior cost Moradabad, home interior designer Moradabad, interior designer near me, MT Boss interiors Moradabad",
  alternates: {
    canonical: "https://www.mtboss.in/interior-design-cost-in-moradabad",
  },
  openGraph: {
    title: "Interior Design Cost in Moradabad 2026 | MT Boss Pricing Guide",
    description:
      "Know the interior design cost in Moradabad per sq ft for 1BHK, 2BHK, 3BHK, kitchen and offices. Get a free quote from MT Boss – transparent, on-time work.",
    url: "https://www.mtboss.in/interior-design-cost-in-moradabad",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-top-builder-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Design Cost in Moradabad - MT Boss",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Interior Design Cost in Moradabad 2026 | MT Boss Pricing Guide",
    description:
      "Know the interior design cost in Moradabad per sq ft for 1BHK, 2BHK, 3BHK, kitchen and offices. Get a free quote from MT Boss – transparent, on-time work.",
    images: ["https://www.mtboss.in/og-top-builder-moradabad.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  name: "MTBOSS Construction Private Limited",
  url: "https://www.mtboss.in/interior-design-cost-in-moradabad",
  telephone: "+91-9458410866",
  email: "mtboss2016@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Harthala Kanth Road, Behind Kr Collection, near Domino's",
    addressLocality: "Moradabad",
    addressRegion: "Uttar Pradesh",
    addressCountry: "IN",
    // postalCode: "ADD_PIN_CODE_HERE",
  },
  areaServed: {
    "@type": "City",
    name: "Moradabad",
  },
  priceRange: "₹₹",
};

export default function Page() {
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