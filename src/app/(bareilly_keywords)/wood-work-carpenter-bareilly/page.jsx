// app/(bareilly_keywords)/wood-work-carpenter-in-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Wood Work Carpenter in Bareilly | MTBOSS",
  description:
    "Need a wood work carpenter in Bareilly? MTBOSS handles doors, frames, paneling, ceilings, railings and more with clear quotes. Call +91 94584 10866.",
  keywords:
    "wood work carpenter Bareilly, woodwork contractor Bareilly, wooden work Bareilly, wood work in Bareilly, door frame carpenter Bareilly, wooden paneling Bareilly, wooden ceiling work Bareilly, staircase railing wood Bareilly, pooja unit carpenter Bareilly, wooden partition Bareilly, wooden flooring Bareilly, interior woodwork Bareilly, carpenter services Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator",
  alternates: {
    canonical:
      "https://www.mtboss.in/wood-work-carpenter-in-bareilly",
  },
  openGraph: {
    title: "Wood Work Carpenter in Bareilly | MTBOSS",
    description:
      "Need a wood work carpenter in Bareilly? MTBOSS handles doors, frames, paneling, ceilings, railings and more with clear quotes. Call +91 94584 10866.",
    url: "https://www.mtboss.in/wood-work-carpenter-in-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-wood-work-carpenter-in-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Wood Work Carpenter in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wood Work Carpenter in Bareilly | MTBOSS",
    description:
      "Need a wood work carpenter in Bareilly? MTBOSS handles doors, frames, paneling, ceilings, railings and more with clear quotes. Call +91 94584 10866.",
    images: [
      "https://www.mtboss.in/og-wood-work-carpenter-in-bareilly.jpg",
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
    "@type": "LocalBusiness",
    name: "MTBOSS Construction Private Limited",
    url: "https://www.mtboss.in/wood-work-carpenter-in-bareilly",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
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
      "Wood Work Carpenter",
      "Woodwork Contractor",
      "Wooden Work",
      "Door Frame Carpenter",
      "Wooden Paneling",
      "Wooden Ceiling Work",
      "Staircase Railing Woodwork",
      "Pooja Unit Carpenter",
      "Wooden Partition",
      "Wooden Flooring",
      "Interior Woodwork",
      "Carpenter Services",
      "Door and Frame Fitting",
      "Woodwork Repair and Restoration",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Wood Work Carpenter in Bareilly",
    description:
      "MTBOSS provides wood work carpentry in Bareilly for doors, frames, windows, wall paneling, wooden ceilings, staircases and railings, pooja units, partitions, wooden flooring, outdoor woodwork, shop and office woodwork, repair, restoration, installation and handover with clear itemised quotations.",
    provider: {
      "@type": "LocalBusiness",
      name: "MTBOSS Construction Private Limited",
      telephone: "+91-9458410866",
      url: "https://www.mtboss.in",
    },
    areaServed: {
      "@type": "City",
      name: "Bareilly",
    },
    serviceType:
      "Fixed Woodwork, Paneling, Doors, Ceilings, Railings and Installation",
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