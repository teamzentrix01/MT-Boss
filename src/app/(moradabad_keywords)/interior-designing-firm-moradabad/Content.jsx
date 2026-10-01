import React from "react";
import LandingEnquiry from "../../components/LandingEnquiry";

const SectionTitle = ({ children }) => (
  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
    {children}
  </h3>
);

const BulletList = ({ items, className = "" }) => (
  <ul className={`list-disc list-inside space-y-2 ml-4 ${className}`}>
    {items.map((item, index) => (
      <li key={`${item.title || item}-${index}`}>
        {item.title ? (
          <>
            <strong>{item.title}</strong> {item.description}
          </>
        ) : (
          item
        )}
      </li>
    ))}
  </ul>
);

const Content = () => {
  const firmRoles = [
    {
      title: "Understands your needs:",
      description:
        "A good firm starts with questions about your family, habits, work style, storage needs and budget, not with a catalogue.",
    },
    {
      title: "Plans the space:",
      description:
        "It decides where furniture, lighting, storage and walkways should go, so the room feels comfortable and uncluttered.",
    },
    {
      title: "Selects materials:",
      description:
        "It helps you choose boards, laminates, paints, tiles, hardware and fabrics that suit your budget and the room&apos;s use.",
    },
    {
      title: "Designs custom elements:",
      description:
        "Kitchens, wardrobes, TV units, ceilings and study tables are designed to fit your room&apos;s exact size.",
    },
    {
      title: "Coordinates trades:",
      description:
        "Electricians, plumbers, carpenters and painters must work in the right order for a clean result.",
    },
    {
      title: "Manages cost and time:",
      description:
        "A firm keeps track of spending and schedules, so your project does not drift.",
    },
    {
      title: "Delivers a finished space:",
      description:
        "You should receive a clean, tested and ready-to-use room, not a half-done site.",
    },
  ];

  const questions = [
    {
      title: "Can I see similar completed projects?",
      description:
        "A firm should show work that resembles your size, style and budget. You can browse the MTBOSS project gallery.",
    },
    {
      title: "What exactly is included in the quote?",
      description:
        "Confirm whether civil work, electrical, painting, lighting, furniture, hardware and cleaning are included.",
    },
    {
      title: "Which materials will you use?",
      description:
        "Ask for specific grades and brands of plywood, laminate, hardware and paint.",
    },
    {
      title: "Who will supervise my site?",
      description:
        "A named supervisor who visits regularly is a good sign.",
    },
    {
      title: "What is the timeline, and what if there is a delay?",
      description: "Ask for dates in writing.",
    },
    {
      title: "How do payments work?",
      description:
        "Prefer stage-wise payments linked to progress over large advances.",
    },
    {
      title: "What happens after handover?",
      description: "Find out who fixes issues that appear later.",
    },
    {
      title: "Can I make changes during the project?",
      description:
        "Understand how revisions affect cost and time before approving the work.",
    },
  ];

  const redFlags = [
    {
      title: "No written quote:",
      description: "Verbal promises are hard to enforce.",
    },
    {
      title: "Very low price with vague scope:",
      description: "Extra charges may appear later.",
    },
    {
      title: "Pressure to pay a large amount upfront:",
      description: "This raises your risk if work stalls.",
    },
    {
      title: "No portfolio or references:",
      description: "You cannot judge quality without evidence.",
    },
    {
      title: "No site visit before quoting:",
      description: "A quote without measurements is only a guess.",
    },
    {
      title: "Unclear material details:",
      description:
        "Best quality plywood means nothing without a grade or brand.",
    },
    {
      title: "Poor communication:",
      description:
        "If a firm is hard to reach before you sign, it will be harder afterwards.",
    },
    {
      title: "No plan for electrical and plumbing:",
      description:
        "Ignoring services leads to broken walls and unnecessary rework.",
    },
  ];

  const mtBossBenefits = [
    {
      title: "Construction expertise:",
      description:
        "We understand building work as well as decoration, so designs are safe, practical and buildable.",
    },
    {
      title: "Clear scope and pricing:",
      description:
        "Customers know what they are paying for before work starts.",
    },
    {
      title: "One partner for everything:",
      description:
        "Design, execution, materials and home services are available in one place.",
    },
    {
      title: "Access to materials:",
      description:
        "Our Shop Now platform and supplier network support material sourcing at competitive prices.",
    },
    {
      title: "Verified professionals:",
      description:
        "We connect projects with trained tradespeople from our professionals network.",
    },
    {
      title: "Local knowledge:",
      description:
        "We understand Moradabad&apos;s weather, buildings, suppliers and business needs.",
    },
    {
      title: "Respect for budget:",
      description:
        "Options at various price points help you avoid overspending.",
    },
    {
      title: "Responsive support:",
      description:
        "Reach us by phone, WhatsApp or email at each stage.",
    },
    {
      title: "Wide project range:",
      description:
        "From small flat interiors to commercial and hospitality spaces.",
    },
    {
      title: "Accountable partners:",
      description:
        "Our vendors and contractors are expected to follow professional conduct and service commitments.",
    },
  ];

  const practicalTips = [
    {
      title: "Set your budget early:",
      description:
        "Include a small buffer of around 10 percent for unexpected items.",
    },
    {
      title: "List your priorities:",
      description:
        "Decide which rooms matter most and spend accordingly.",
    },
    {
      title: "Plan electrical points first:",
      description:
        "Adding points after carpentry is costly and messy.",
    },
    {
      title: "Invest in kitchen and wardrobe hardware:",
      description: "These are used daily and must last.",
    },
    {
      title: "Choose durable finishes for high-use areas:",
      description:
        "Kitchens, entrances and kids&apos; rooms need easy-to-clean surfaces.",
    },
    {
      title: "Think about lighting in layers:",
      description: "Combine general, task and accent lights.",
    },
    {
      title: "Leave breathing space:",
      description: "Do not fill every wall or corner.",
    },
    {
      title: "Avoid too many trends at once:",
      description:
        "Pick one or two features and keep the base timeless.",
    },
    {
      title: "Get everything in writing:",
      description: "Confirm the scope, materials, timeline and payment plan.",
    },
    {
      title: "Visit the site regularly:",
      description:
        "A short weekly visit helps catch small issues early.",
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-0">
      <div className="flex flex-col lg:flex-row">
        {/* Content Section */}
        <div className="flex-1 px-4 sm:px-8 md:px-16 py-12 order-1 lg:order-1">
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-8 text-gray-900">
            Interior Designing Firm in Moradabad: How to Choose the Right One
            and Why Customers Trust MTBOSS
          </h2>

          <div className="space-y-6 text-gray-700 leading-relaxed max-w-4xl">
            <section>
              <p>
                Your home or business says a lot about you. The right interiors
                make daily life easier, impress guests and customers, and add
                long-term value to your property.
              </p>
              <p className="mt-3">
                Moradabad has many interior designers, decorators and
                contractors, so choosing the right one can feel confusing.
                Prices, promises and portfolios all look different.
              </p>
              <p className="mt-3">
                MTBOSS Construction Private Limited is a Moradabad-based
                company that helps customers plan, build and finish their
                spaces with clear communication and dependable support.
              </p>
              <p className="mt-3">
                This guide explains what a good interior designing firm should
                offer, how to compare firms, and how MTBOSS handles interiors
                for homes, shops, showrooms and offices. Whether you are
                furnishing a new flat, renovating an older house or setting up
                a business space, this guide helps you decide with confidence.
              </p>
            </section>

            <section>
              <SectionTitle>
                What an Interior Designing Firm Actually Does
              </SectionTitle>
              <BulletList items={firmRoles} />
            </section>

            <section>
              <SectionTitle>
                Interior Designer, Decorator or Design-and-Build Firm: Know the
                Difference
              </SectionTitle>

              <div className="space-y-5">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Interior Designer
                  </h4>
                  <BulletList
                    items={[
                      "Focuses on layout, concept, materials and visual design.",
                      "May not always handle on-site execution.",
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Interior Decorator
                  </h4>
                  <BulletList
                    items={[
                      "Focuses on surface styling such as colours, furnishings, curtains and accessories.",
                      "Usually works with the existing structure and layout.",
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Design-and-Build Firm
                  </h4>
                  <BulletList
                    items={[
                      "Handles design, civil changes, electrical, carpentry, finishing and handover.",
                      "Reduces the risk of miscommunication between separate vendors.",
                      "Suits owners who want one responsible partner from start to finish.",
                    ]}
                  />
                </div>
              </div>
            </section>

            <section>
              <SectionTitle>Where MTBOSS Fits</SectionTitle>
              <p>
                MTBOSS works as a construction-backed firm, so we can support
                both design and execution.
              </p>
              <p className="mt-3">
                Because we build as well as design, we understand walls,
                wiring, plumbing and load requirements. This helps avoid costly
                on-site surprises and makes the final design more practical.
              </p>
            </section>

            <section>
              <SectionTitle>
                Interior Design Services Offered by MTBOSS
              </SectionTitle>

              <div className="space-y-5">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Home Interiors
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Apartments and flats:",
                        description:
                          "Smart layouts with hidden storage for 1BHK, 2BHK and 3BHK homes.",
                      },
                      {
                        title: "Independent houses and villas:",
                        description:
                          "Complete planning across floors, staircases, balconies and terraces.",
                      },
                      {
                        title: "Builder floors:",
                        description:
                          "Full turnkey interiors so you can move in without managing many vendors.",
                      },
                      {
                        title: "Renovations:",
                        description:
                          "Room upgrades or complete redesigns of older homes.",
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Kitchen and Storage Solutions
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Modular kitchens:",
                        description:
                          "Straight, L-shaped, U-shaped, parallel and island layouts.",
                      },
                      {
                        title: "Wardrobes:",
                        description:
                          "Sliding or hinged units with drawers, lofts and shoe racks.",
                      },
                      {
                        title: "Utility storage:",
                        description:
                          "Pantry units, balcony cabinets and laundry storage.",
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Living and Bedroom Design
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Living rooms:",
                        description:
                          "TV units, wall paneling, console tables, seating layouts and lighting.",
                      },
                      {
                        title: "Bedrooms:",
                        description:
                          "Storage beds, headboards, dressing units and bedside tables.",
                      },
                      {
                        title: "Kids&apos; rooms:",
                        description:
                          "Durable, safe and playful designs with study and storage areas.",
                      },
                      {
                        title: "Pooja rooms:",
                        description:
                          "Compact or wall-mounted mandir designs with proper lighting.",
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Ceilings, Walls and Lighting
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "False ceilings:",
                        description:
                          "Gypsum, POP and PVC ceilings with cove and profile lights.",
                      },
                      {
                        title: "Wall finishes:",
                        description:
                          "Paint, texture, wallpaper, fluted panels and feature walls.",
                      },
                      {
                        title: "Lighting plans:",
                        description:
                          "Ambient, task and accent lights planned with switch layouts.",
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Commercial Interiors
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Showrooms:",
                        description:
                          "Display layouts and lighting that highlight products, ideal for Moradabad&apos;s handicraft and brassware businesses.",
                      },
                      {
                        title: "Shops and stores:",
                        description:
                          "Counters, shelves, storage and customer flow.",
                      },
                      {
                        title: "Offices:",
                        description:
                          "Workstations, cabins, meeting rooms and reception areas.",
                      },
                      {
                        title: "Clinics, salons and cafés:",
                        description:
                          "Hygienic, comfortable and brand-friendly designs.",
                      },
                      {
                        title: "Hospitality:",
                        description:
                          "Guest rooms, lobbies and dining spaces supported by our hotel and hospitality construction experience.",
                      },
                    ]}
                  />
                </div>
              </div>
            </section>

            <section>
              <SectionTitle>
                Questions to Ask Before Hiring Any Interior Designing Firm
              </SectionTitle>

              <BulletList
                items={questions.map((question) => ({
                  title: `${question.title}`,
                  description: question.description,
                }))}
              />

              <p className="mt-4">
                View completed work in the{" "}
                <a
                  href="https://www.mtboss.in/FeaturedProjects/ProjectGallery"
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  MTBOSS project gallery
                </a>
                .
              </p>
            </section>

            <section>
              <SectionTitle>Red Flags to Avoid</SectionTitle>
              <BulletList items={redFlags} />
            </section>

            <section>
              <SectionTitle>How MTBOSS Runs an Interior Project</SectionTitle>

              <div className="space-y-5">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Stage 1: Enquiry and Discussion
                  </h4>
                  <BulletList
                    items={[
                      "Contact us by phone, WhatsApp, email or the website form.",
                      "We discuss your space, budget, timeline and style preferences.",
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Stage 2: Site Visit and Measurement
                  </h4>
                  <BulletList
                    items={[
                      "Our team visits your property to measure rooms and study the site.",
                      "We note electrical points, plumbing lines, windows, beams and access routes.",
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Stage 3: Design Planning
                  </h4>
                  <BulletList
                    items={[
                      "We prepare layouts showing furniture positions, storage and movement paths.",
                      "We suggest colour and material combinations at different price levels.",
                      "Vastu preferences can be included in the planning process.",
                    ]}
                  />
                  <p className="mt-3">
                    Read our guide on{" "}
                    <a
                      href="https://www.mtboss.in/blog/vastu-shastra-principles-for-modern-home-architecture"
                      className="text-blue-600 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Vastu principles for modern home architecture
                    </a>
                    .
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Stage 4: 3D Visuals and Approval
                  </h4>
                  <BulletList
                    items={[
                      "3D views help you see the result before work starts.",
                      "Once you approve the design and materials, the plan is locked to avoid confusion.",
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Stage 5: Quotation and Agreement
                  </h4>
                  <BulletList
                    items={[
                      "You receive an itemised quotation with a clear scope.",
                      "Payment stages and timelines are written into the agreement.",
                    ]}
                  />
                  <p className="mt-3">
                    Try our{" "}
                    <a
                      href="https://www.mtboss.in/calculator"
                      className="text-blue-600 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Budget Calculator
                    </a>{" "}
                    for early planning, and read our{" "}
                    <a
                      href="https://www.mtboss.in/blog/house-construction-cost-estimation-guide-india-2026"
                      className="text-blue-600 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      construction cost estimation guide
                    </a>
                    .
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Stage 6: Execution
                  </h4>
                  <BulletList
                    items={[
                      "Work follows the right order: civil and electrical work, then carpentry, ceiling, painting and final fittings.",
                      "Supervisors coordinate trades and check quality at each stage.",
                      "You receive progress updates so you stay informed.",
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Stage 7: Inspection and Handover
                  </h4>
                  <BulletList
                    items={[
                      "We check alignment, finishes, hardware, lighting and cleanliness.",
                      "Any snags are corrected before we hand over the project.",
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Stage 8: Ongoing Support
                  </h4>
                  <p>
                    Small repairs and maintenance can be arranged through our{" "}
                    <a
                      href="https://www.mtboss.in/quick"
                      className="text-blue-600 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Quick Home Services
                    </a>
                    .
                  </p>
                </div>
              </div>
            </section>

            <section>
              <SectionTitle>
                Why Homeowners and Businesses in Moradabad Choose MTBOSS
              </SectionTitle>
              <BulletList items={mtBossBenefits} />
              <p className="mt-4">
                Explore materials through{" "}
                <a
                  href="https://www.mtboss.in/ShopNow"
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shop Now
                </a>{" "}
                and connect with service professionals through our{" "}
                <a
                  href="https://www.mtboss.in/Services/professionals"
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  professionals network
                </a>
                .
              </p>
            </section>

            <section>
              <SectionTitle>
                Interior Design for Different Property Types
              </SectionTitle>

              <div className="space-y-5">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    1BHK and 2BHK Flats
                  </h4>
                  <BulletList
                    items={[
                      "Focus on multi-purpose furniture, sliding wardrobes and light colours to make rooms feel larger.",
                      "Use vertical storage and wall-mounted units to save floor space.",
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    3BHK Flats and Builder Floors
                  </h4>
                  <BulletList
                    items={[
                      "Balance a strong living area with comfortable bedrooms and a functional kitchen.",
                      "Add a study corner or home-office nook as a flexible space.",
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Villas and Kothis
                  </h4>
                  <BulletList
                    items={[
                      "Plan a cohesive theme across floors and use premium finishes in entrances and living areas.",
                      "Include lighting design for staircases, corridors and outdoor-facing areas.",
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Rented Homes
                  </h4>
                  <BulletList
                    items={[
                      "Use lightweight, movable furniture and simple finishes.",
                      "Avoid heavy structural changes to keep costs sensible.",
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Shops and Showrooms
                  </h4>
                  <BulletList
                    items={[
                      "Prioritise visibility, product display and customer flow.",
                      "Use lighting to highlight products and create a memorable brand feel.",
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Offices
                  </h4>
                  <BulletList
                    items={[
                      "Design for comfort, productivity and easy communication.",
                      "Include cable management, storage and quiet meeting spaces.",
                    ]}
                  />
                </div>
              </div>
            </section>

            <section>
              <SectionTitle>Popular Interior Styles We Design</SectionTitle>
              <BulletList
                items={[
                  {
                    title: "Modern:",
                    description:
                      "Clean lines, neutral palette and hidden storage.",
                  },
                  {
                    title: "Minimalist:",
                    description: "Simple forms with open, calm spaces.",
                  },
                  {
                    title: "Traditional:",
                    description:
                      "Warm woods, rich colours and classic details.",
                  },
                  {
                    title: "Luxury:",
                    description:
                      "Premium finishes, statement lighting and custom furniture.",
                  },
                  {
                    title: "Indian contemporary:",
                    description:
                      "Modern layouts blended with local craft and brass accents.",
                  },
                  {
                    title: "Industrial:",
                    description:
                      "Raw textures and metal for cafés, studios and creative offices.",
                  },
                  {
                    title: "Vastu-aligned:",
                    description:
                      "Room placement and colour choices guided by Vastu preferences.",
                  },
                ]}
              />
            </section>

            <section>
              <SectionTitle>
                Practical Tips to Get the Best Result from Your Interior Project
              </SectionTitle>
              <BulletList items={practicalTips} />
            </section>

            <section>
              <SectionTitle>Interior Trends in Moradabad for 2026</SectionTitle>
              <BulletList
                items={[
                  {
                    title: "Earthy neutrals:",
                    description:
                      "Beige, cream, olive and terracotta tones.",
                  },
                  {
                    title: "Fluted and textured panels:",
                    description:
                      "Popular for TV walls, headboards and reception desks.",
                  },
                  {
                    title: "Brass detailing:",
                    description:
                      "A natural fit for the Brass City, seen in handles, lamps and décor.",
                  },
                  {
                    title: "Space-saving furniture:",
                    description:
                      "Storage beds, fold-down tables and wall units.",
                  },
                  {
                    title: "Work-from-home corners:",
                    description:
                      "Compact desks integrated into living rooms or bedrooms.",
                  },
                  {
                    title: "Smart and layered lighting:",
                    description:
                      "Dimmers and warm accent lighting for a premium feel.",
                  },
                  {
                    title: "Low-maintenance finishes:",
                    description:
                      "Easy-clean surfaces suited to busy households.",
                  },
                  {
                    title: "Handmade local décor:",
                    description:
                      "Unique pieces that add character and support artisans.",
                  },
                ]}
              />
            </section>

            <section>
              <SectionTitle>Start Your Project with MTBOSS</SectionTitle>
              <p className="mb-3">
                Share your floor plan or photos, preferred style and approximate
                budget. Our team can discuss your requirements, arrange a site
                visit and provide a detailed quote with no pressure.
              </p>

              <BulletList
                items={[
                  {
                    title: "Company:",
                    description: "MTBOSS Construction Private Limited",
                  },
                ]}
              />

              <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                <li>
                  <strong>Phone / WhatsApp:</strong>{" "}
                  <a
                    href="tel:+919458410866"
                    className="text-blue-600 underline"
                  >
                    +91 94584 10866
                  </a>
                </li>
                <li>
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:mtboss2016@gmail.com"
                    className="text-blue-600 underline"
                  >
                    mtboss2016@gmail.com
                  </a>
                </li>
                <li>
                  <strong>Office:</strong> Harthala Kanth Road, behind KR
                  Collection, near Domino&apos;s, Moradabad, Uttar Pradesh
                </li>
                <li>
                  <strong>Website:</strong>{" "}
                  <a
                    href="https://www.mtboss.in"
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.mtboss.in
                  </a>
                </li>
                <li>
                  <strong>Contact Page:</strong>{" "}
                  <a
                    href="https://www.mtboss.in/contact"
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Send your requirement online
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <SectionTitle>Frequently Asked Questions</SectionTitle>

              <div className="space-y-5">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q1. How do I choose the best interior designing firm in
                    Moradabad?
                  </h4>
                  <p className="mt-1">
                    Check portfolios, ask for an itemised quote, confirm
                    materials and timelines, and prefer firms that communicate
                    clearly.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q2. What is the difference between an interior designer and
                    a design-and-build firm?
                  </h4>
                  <p className="mt-1">
                    A designer mainly plans the look. A design-and-build firm
                    also manages execution and coordination.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q3. Does MTBOSS handle both design and construction work?
                  </h4>
                  <p className="mt-1">
                    Yes. Our construction background lets us manage design,
                    civil work, electrical work, carpentry and finishing
                    together.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q4. Can you design shops and showrooms?
                  </h4>
                  <p className="mt-1">
                    Yes. We design retail shops, showrooms, offices, clinics
                    and hospitality spaces.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q5. Will I get to approve the design first?
                  </h4>
                  <p className="mt-1">
                    Yes. You approve layouts, visuals and materials before work
                    begins.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q6. Can you follow Vastu guidelines?
                  </h4>
                  <p className="mt-1">
                    Yes. Please share your Vastu preferences at the start of
                    the project.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q7. Is a site visit necessary before a quote?
                  </h4>
                  <p className="mt-1">
                    Yes. Measurements and site checks help provide a more
                    accurate quotation.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q8. How can I estimate my budget beforehand?
                  </h4>
                  <p className="mt-1">
                    Use our Budget Calculator and then discuss the project
                    details with the MTBOSS team.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q9. Do you offer help after project completion?
                  </h4>
                  <p className="mt-1">
                    Yes. Repairs and maintenance can be arranged through our
                    home services.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q10. Can I buy building materials from MTBOSS?
                  </h4>
                  <p className="mt-1">
                    Yes. Visit the{" "}
                    <a
                      href="https://www.mtboss.in/ShopNow"
                      className="text-blue-600 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Shop Now page
                    </a>{" "}
                    to explore available building materials.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full lg:w-[450px] p-8 order-2 lg:order-2">
          <div className="lg:sticky lg:top-28">
            <LandingEnquiry />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;