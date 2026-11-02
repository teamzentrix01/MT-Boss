// app/(bareilly_keywords)/renovation-repair-services-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Home Repair and Renovation Services Bareilly | MTBOSS",
  description:
    "Looking for renovation and repair services in Bareilly? See room-wise services, how work starts and how pricing works. Call MTBOSS: +91 94584 10866.",
  keywords:
    "renovation and repair services Bareilly, home repair and renovation services Bareilly, house repair services Bareilly, room wise renovation Bareilly, home maintenance Bareilly, repair contractor Bareilly, renovation services near me Bareilly, house repair and painting Bareilly, bathroom and kitchen repair Bareilly, roof leakage repair Bareilly, building repair Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator",
  alternates: {
    canonical: "https://www.mtboss.in/renovation-repair-services-bareilly",
  },
  openGraph: {
    title: "Home Repair and Renovation Services Bareilly | MTBOSS",
    description:
      "Looking for renovation and repair services in Bareilly? See room-wise services, how work starts and how pricing works. Call MTBOSS: +91 94584 10866.",
    url: "https://www.mtboss.in/renovation-repair-services-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-renovation-repair-services-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Home Repair and Renovation Services in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Home Repair and Renovation Services Bareilly | MTBOSS",
    description:
      "Looking for renovation and repair services in Bareilly? See room-wise services, how work starts and how pricing works. Call MTBOSS: +91 94584 10866.",
    images: [
      "https://www.mtboss.in/og-renovation-repair-services-bareilly.jpg",
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
    "@type": "HomeAndConstructionBusiness",
    name: "MTBOSS Construction Private Limited",
    url: "https://www.mtboss.in/renovation-repair-services-bareilly",
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
    priceRange: "₹₹",
    serviceType: [
      "Renovation and Repair Services",
      "Home Repair Services",
      "House Renovation Services",
      "Waterproofing and Leakage Repair",
      "Roof Leakage Repair",
      "Bathroom Repair",
      "Kitchen Renovation",
      "Plumbing Repair",
      "Electrical Repair",
      "Carpentry Services",
      "Painting Services",
      "Tile and Flooring Repair",
      "Crack and Plaster Repair",
      "Building Maintenance",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Renovation and Repair Services in Bareilly",
    description:
      "MTBOSS provides renovation and repair services in Bareilly, including inspection and diagnosis, waterproofing and leakage repair, crack and plaster repair, plumbing, electrical work, carpentry, flooring and tiling, painting, false ceiling, kitchen and bathroom renovation, interior renovation and building maintenance.",
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: "MTBOSS Construction Private Limited",
      telephone: "+91-9458410866",
      url: "https://www.mtboss.in",
    },
    areaServed: {
      "@type": "City",
      name: "Bareilly",
    },
    serviceType:
      "Home Repair, Renovation, Waterproofing and Building Maintenance Services",
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