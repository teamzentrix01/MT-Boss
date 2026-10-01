
import React from "react";
import LandingEnquiry from "../../components/LandingEnquiry";

const SectionTitle = ({ children }) => (
  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
    {children}
  </h3>
);

const BulletList = ({ items }) => (
  <ul className="list-disc list-inside space-y-2 ml-4">
    {items.map((item, index) => (
      <li key={`${item.title || item}-${index}`}>
        {typeof item === "string" ? (
          item
        ) : (
          <>
            <strong>{item.title}</strong> {item.description}
          </>
        )}
      </li>
    ))}
  </ul>
);

const Content = () => {
  const luxuryMeaning = [
    {
      title: "Custom over ready-made:",
      description:
        "Furniture, cabinetry, ceilings and wall features are designed for your exact room, not picked from a catalogue.",
    },
    {
      title: "Quality of materials:",
      description:
        "Premium boards, veneers, natural stone, fine fabrics, quality hardware and durable finishes form the foundation.",
    },
    {
      title: "Attention to detail:",
      description:
        "Clean joints, aligned patterns, hidden fixtures, consistent gaps and perfect edges separate luxury from average work.",
    },
    {
      title: "Layered lighting:",
      description:
        "Light is treated as a design material, with cove, profile, accent and decorative lighting working together.",
    },
    {
      title: "Balanced simplicity:",
      description:
        "True luxury usually looks calm and uncluttered, rather than overloaded with decoration.",
    },
    {
      title: "Comfort and function:",
      description:
        "A luxurious space must be easy to live in, with excellent storage, ventilation, acoustics and ergonomics.",
    },
    {
      title: "Personal character:",
      description:
        "The design reflects your taste, family, culture and lifestyle, so it does not feel like a showroom copy.",
    },
    {
      title: "Timeless appeal:",
      description:
        "Good luxury design ages well and does not depend on passing trends.",
    },
  ];

  const whoNeeds = [
    {
      title: "Villa and kothi owners:",
      description:
        "Large homes need a cohesive plan across floors, staircases, courtyards and terraces.",
    },
    {
      title: "Premium apartment buyers:",
      description:
        "Owners of high-end flats often want a refined, move-in-ready interior.",
    },
    {
      title: "Business owners and exporters:",
      description:
        "Executive offices, buyer-meeting rooms and sample lounges should reflect business credibility.",
    },
    {
      title: "Showroom and boutique owners:",
      description:
        "Retail spaces need an elevated look that supports premium pricing.",
    },
    {
      title: "Hotel, resort and banquet owners:",
      description:
        "Guest experience depends on detailed, well-executed interiors.",
    },
    {
      title: "Restaurant and lounge owners:",
      description:
        "Ambience is a core part of the product.",
    },
    {
      title: "Families planning weddings and events at home:",
      description:
        "Guests notice design, and it leaves a lasting impression.",
    },
    {
      title: "Anyone who values quality:",
      description:
        "You do not need a huge home to appreciate careful design and craftsmanship.",
    },
  ];

  const commonMistakes = [
    {
      title: "Buying expensive items without a plan:",
      description:
        "Costly pieces without a cohesive design look disconnected.",
    },
    {
      title: "Overdecorating:",
      description:
        "Too many patterns, colours and accessories reduce elegance.",
    },
    {
      title: "Ignoring lighting:",
      description:
        "Even premium finishes look flat without good lighting.",
    },
    {
      title: "Poor detailing:",
      description:
        "Uneven joints, mismatched grains and visible fixtures spoil the effect.",
    },
    {
      title: "Weak preparation:",
      description:
        "Poor wall or ceiling preparation shows through the final finish.",
    },
    {
      title: "Choosing trends over timelessness:",
      description:
        "Very trendy features can look dated quickly.",
    },
    {
      title: "Skipping hardware quality:",
      description:
        "Premium doors and drawers need premium hinges and channels.",
    },
    {
      title: "Forgetting maintenance:",
      description:
        "Natural stone, veneer and fabrics need appropriate care.",
    },
    {
      title: "Ignoring scale:",
      description:
        "Furniture and décor must match the room's size and ceiling height.",
    },
    {
      title: "Working with too many vendors:",
      description:
        "Poor coordination leads to delays and mismatched work.",
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-0">
      <div className="flex flex-col lg:flex-row">
        {/* Content Section */}
        <div className="flex-1 px-4 sm:px-8 md:px-16 py-12 order-1 lg:order-1">
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-8 text-gray-900">
            Luxury Interior Designer in Moradabad: Refined Spaces, Crafted with
            Precision by MT Boss
          </h2>

          <div className="space-y-6 text-gray-700 leading-relaxed max-w-4xl">
            <section>
              <p>
                Luxury in interior design is not about spending the most money.
                It is about thoughtful planning, fine materials, precise
                craftsmanship and a space that feels personal, effortless and
                lasting.
              </p>

              <p className="mt-3">
                Moradabad&apos;s homes and businesses are changing. Villas,
                kothis, premium apartments, showrooms and export offices now ask
                for a level of design that matches their owners&apos; taste and
                success.
              </p>

              <p className="mt-3">
                A luxury interior needs more than expensive finishes. It needs
                proper structure, concealed services, exact measurements and
                careful supervision, or even the best materials can look
                ordinary.
              </p>

              <p className="mt-3">
                MT Boss, also known as MTBOSS Construction Private Limited, is a
                Moradabad-based construction and interiors company. Because we
                build as well as design, we understand how a luxurious look is
                actually achieved behind the walls.
              </p>

              <p className="mt-3">
                This guide explains what luxury interior design involves, the
                materials and details that define it, how to plan the budget,
                and how MT Boss handles premium projects from start to finish.
              </p>
            </section>

            <section>
              <SectionTitle>What Luxury Interior Design Really Means</SectionTitle>
              <BulletList items={luxuryMeaning} />
            </section>

            <section>
              <SectionTitle>
                Who Needs a Luxury Interior Designer in Moradabad
              </SectionTitle>
              <BulletList items={whoNeeds} />
            </section>

            <section>
              <SectionTitle>Our Luxury Interior Design Services</SectionTitle>

              <div className="space-y-5">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Luxury Villa and Bungalow Interiors
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Whole-house planning:",
                        description:
                          "A single design language runs across living rooms, bedrooms, kitchens, staircases and outdoor-facing areas.",
                      },
                      {
                        title: "Grand entrances:",
                        description:
                          "Foyers with statement lighting, feature walls, custom doors and stone or wood detailing.",
                      },
                      {
                        title: "Double-height spaces:",
                        description:
                          "Special lighting, wall treatments and chandelier planning for tall living areas.",
                      },
                      {
                        title: "Staircase design:",
                        description:
                          "Handrails, cladding, lighting and feature walls that make the staircase a focal point.",
                      },
                      {
                        title: "Home theatres and lounges:",
                        description:
                          "Acoustic planning, seating, lighting and concealed wiring.",
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Premium Apartment Interiors
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Efficient luxury:",
                        description:
                          "Clever storage, custom wardrobes and high-quality finishes that make compact homes feel refined.",
                      },
                      {
                        title: "Feature walls and ceilings:",
                        description:
                          "Statement elements that add depth without crowding the room.",
                      },
                      {
                        title: "Integrated lighting:",
                        description:
                          "Cove, profile and accent lights planned with switches and smart controls.",
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Luxury Living Rooms
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "TV and feature walls:",
                        description:
                          "Fluted panels, veneer, stone-look finishes, backlit panels and custom media units.",
                      },
                      {
                        title: "Layered ceilings:",
                        description:
                          "Cove ceilings, wooden accents and designer lighting.",
                      },
                      {
                        title: "Custom seating layouts:",
                        description:
                          "Sofa arrangement, side tables, rugs and accent pieces planned together.",
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Luxury Bedrooms
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Statement headboards:",
                        description:
                          "Upholstered, panelled or leather-finished designs.",
                      },
                      {
                        title: "Walk-in wardrobes:",
                        description:
                          "Custom interiors with lighting, drawers, mirrors and jewellery storage.",
                      },
                      {
                        title: "Dressing areas:",
                        description:
                          "Well-lit vanity units with premium finishes.",
                      },
                      {
                        title: "Soft, layered lighting:",
                        description:
                          "Dimmable lights for a calm, hotel-like feel.",
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Luxury Kitchens
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Premium finishes:",
                        description:
                          "Acrylic, PU or veneer shutters with quality hardware.",
                      },
                      {
                        title: "Countertops:",
                        description:
                          "Quartz or premium engineered stone.",
                      },
                      {
                        title: "Smart storage:",
                        description:
                          "Tall units, pull-outs, corner solutions and appliance garages.",
                      },
                      {
                        title: "Integrated appliances:",
                        description:
                          "Built-in chimney, hob, oven and dishwasher planned from the start.",
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Luxury Bathrooms and Powder Rooms
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Premium fittings:",
                        description:
                          "Quality fixtures, vanities, mirrors and lighting.",
                      },
                      {
                        title: "Material coordination:",
                        description:
                          "Stone, tiles and wall finishes planned with the interior style.",
                      },
                      {
                        title: "Waterproofing:",
                        description:
                          "Proper preparation so that finishes last.",
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Luxury Commercial Interiors
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Showrooms:",
                        description:
                          "Display design, lighting and brand-focused backdrops suited to Moradabad&apos;s brassware, handicraft and furniture businesses.",
                      },
                      {
                        title: "Executive offices:",
                        description:
                          "Refined cabins, reception areas and meeting rooms.",
                      },
                      {
                        title: "Boutique hotels and guest houses:",
                        description:
                          "Comfortable rooms, welcoming lobbies and dining spaces, supported by our hotel and hospitality construction experience.",
                      },
                      {
                        title: "Restaurants and lounges:",
                        description:
                          "Ambience-driven layouts with durable, premium finishes.",
                      },
                    ]}
                  />
                </div>
              </div>
            </section>

            <section>
              <SectionTitle>
                Materials and Finishes That Define Luxury
              </SectionTitle>

              <div className="space-y-5">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Woods, Veneers and Boards
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Veneer finishes:",
                        description:
                          "Natural wood veneers add warmth and richness to wardrobes, panels and doors.",
                      },
                      {
                        title: "Quality plywood and engineered boards:",
                        description:
                          "Marine or BWP plywood and HDHMR boards provide strong, moisture-resistant bases.",
                      },
                      {
                        title: "Solid wood accents:",
                        description:
                          "Used selectively for handles, trims and feature elements.",
                      },
                      {
                        title: "Grain matching:",
                        description:
                          "Careful alignment of veneer patterns gives a seamless, high-end look.",
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Stone, Marble and Surfaces
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Marble and marble-look surfaces:",
                        description:
                          "For flooring, feature walls and vanity tops.",
                      },
                      {
                        title: "Granite and quartz:",
                        description:
                          "Durable countertops suited to Indian kitchens.",
                      },
                      {
                        title: "Engineered stone:",
                        description:
                          "Consistent patterns with practical performance.",
                      },
                      {
                        title: "Sealing and care:",
                        description:
                          "Natural stone needs proper sealing and maintenance to prevent stains.",
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Wall Finishes
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Fluted and louvered panels:",
                        description: "Add depth and rhythm.",
                      },
                      {
                        title: "Textured plaster and premium paints:",
                        description:
                          "Smooth, subtle and elegant.",
                      },
                      {
                        title: "Leather, fabric or suede panels:",
                        description:
                          "Soft luxury for headboards and lounge walls.",
                      },
                      {
                        title: "Wallpaper and murals:",
                        description:
                          "Custom designs for feature walls.",
                      },
                      {
                        title: "Metal inlays and brass details:",
                        description:
                          "A natural fit for the Brass City, adding refined contrast through strips, handles and accents.",
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Glass and Metal
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Tinted or fluted glass:",
                        description:
                          "For partitions, wardrobe shutters and display units.",
                      },
                      {
                        title: "Mirror finishes:",
                        description:
                          "Enhance light and space in the right places.",
                      },
                      {
                        title: "Brass, bronze and stainless finishes:",
                        description:
                          "Used for handles, trims, lighting and furniture legs.",
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Hardware and Accessories
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Soft-close hinges and channels:",
                        description:
                          "Smooth, quiet and long-lasting.",
                      },
                      {
                        title: "Handleless profiles:",
                        description: "Clean, modern lines.",
                      },
                      {
                        title: "Pull-outs, carousels and tall units:",
                        description:
                          "Maximum functionality inside cabinets.",
                      },
                      {
                        title: "Smart locks and sensors:",
                        description:
                          "Optional additions for security and convenience.",
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Flooring
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Marble and premium tiles:",
                        description:
                          "Large-format tiles with minimal joints give a seamless look.",
                      },
                      {
                        title: "Wooden flooring:",
                        description:
                          "Engineered or solid wood adds warmth.",
                      },
                      {
                        title: "Cost guide for wooden laminate:",
                        description:
                          "Roughly ₹90 to ₹200 per sq ft, with premium wood flooring costing more.",
                      },
                      {
                        title: "Rugs and carpets:",
                        description:
                          "Add comfort, colour and acoustic softness.",
                      },
                    ]}
                  />
                </div>
              </div>
            </section>

            <section>
              <SectionTitle>The Heart of Luxury Interiors</SectionTitle>
              <BulletList
                items={[
                  {
                    title: "Layered approach:",
                    description:
                      "Combine ambient, task, accent and decorative lighting.",
                  },
                  {
                    title: "Cove and profile lighting:",
                    description:
                      "Creates a soft, glare-free glow along ceilings and walls.",
                  },
                  {
                    title: "Spotlights:",
                    description:
                      "Highlight artwork, textures and display shelves.",
                  },
                  {
                    title: "Chandeliers and pendants:",
                    description:
                      "Make strong statements in double-height rooms, dining areas and foyers.",
                  },
                  {
                    title: "Warm colour temperatures:",
                    description:
                      "Warm-white light feels welcoming and premium.",
                  },
                  {
                    title: "Dimming and scene control:",
                    description:
                      "Adjust brightness for family time, entertaining or relaxing.",
                  },
                  {
                    title: "Concealed fixtures:",
                    description:
                      "Hidden drivers and neatly placed lights keep the design clean.",
                  },
                  {
                    title: "Smart controls:",
                    description:
                      "Optional app or voice control for lighting and curtains.",
                  },
                  {
                    title: "Cost note:",
                    description:
                      "Concealed wiring, designer lights and smart switches can add around ₹30,000 to ₹1.5 lakh in a typical flat, and more in villas.",
                  },
                ]}
              />
            </section>

            <section>
              <SectionTitle>
                Ceilings, Walls and Architectural Details
              </SectionTitle>
              <BulletList
                items={[
                  {
                    title: "Layered false ceilings:",
                    description:
                      "Multi-level designs with cove lights add depth in larger rooms.",
                  },
                  {
                    title: "Gypsum ceiling cost guide:",
                    description:
                      "About ₹80 to ₹180 per sq ft for standard designs, with detailed work costing more.",
                  },
                  {
                    title: "Wooden and metal accents:",
                    description:
                      "Slats, beams and inlays add warmth and contrast.",
                  },
                  {
                    title: "Wall paneling:",
                    description:
                      "Fluted, veneer, stone-look and leather panels, generally about ₹150 to ₹450 per sq ft and more for premium materials.",
                  },
                  {
                    title: "Wainscoting and moulding:",
                    description:
                      "Classic details for traditional luxury styles.",
                  },
                  {
                    title: "Custom doors:",
                    description:
                      "Wooden, glass or metal-accented doors that match the design theme.",
                  },
                  {
                    title: "Niches and display shelves:",
                    description:
                      "Built-in spots for artwork, brass pieces and collectibles.",
                  },
                  {
                    title: "Acoustic treatment:",
                    description:
                      "Soft panels or fabric in lounges and home theatres.",
                  },
                ]}
              />
            </section>

            <section>
              <SectionTitle>Luxury Design Styles We Offer</SectionTitle>
              <BulletList
                items={[
                  {
                    title: "Contemporary luxury:",
                    description:
                      "Clean lines, natural textures, neutral palettes and hidden storage.",
                  },
                  {
                    title: "Modern classic:",
                    description:
                      "Traditional details such as mouldings and panelling, combined with a modern, uncluttered layout.",
                  },
                  {
                    title: "Indian luxury and fusion:",
                    description:
                      "Rich colours, handcrafted décor, carved details and brass accents, blended with modern comfort.",
                  },
                  {
                    title: "Minimal luxury:",
                    description:
                      "Simplicity with premium materials, perfect proportions and subtle lighting.",
                  },
                  {
                    title: "Art deco touches:",
                    description:
                      "Geometric patterns, metallic accents and bold contrasts.",
                  },
                  {
                    title: "Resort-style homes:",
                    description:
                      "Natural materials, warm lighting and relaxed comfort.",
                  },
                  {
                    title: "Vastu-aware luxury:",
                    description:
                      "Layouts and colours planned with Vastu preferences where required.",
                  },
                ]}
              />
            </section>

            <section>
              <SectionTitle>
                Luxury Interior Design Cost in Moradabad
              </SectionTitle>
              <BulletList
                items={[
                  {
                    title: "Luxury package range:",
                    description:
                      "Fully custom interiors usually begin around ₹3,000 per sq ft and above, depending on materials, detailing and automation.",
                  },
                  {
                    title: "Villa projects:",
                    description:
                      "Luxury villa interiors often start from around ₹15 lakh and go higher, depending on size and scope.",
                  },
                  {
                    title: "Main cost drivers:",
                    description:
                      "Veneer and stone quality, custom furniture, hardware, lighting, ceiling complexity and automation.",
                  },
                  {
                    title: "Design fees versus execution cost:",
                    description:
                      "Detailed drawings, 3D visuals and supervision are part of the value in luxury projects.",
                  },
                  {
                    title: "What may be extra:",
                    description:
                      "Civil changes, imported fittings, loose furniture, artwork, curtains, carpets and appliances.",
                  },
                  {
                    title: "Where to spend:",
                    description:
                      "Living areas, master bedroom, kitchen, lighting and hardware.",
                  },
                  {
                    title: "Where to save:",
                    description:
                      "Use premium finishes on focal areas and quality laminates on secondary spaces.",
                  },
                  {
                    title: "Itemised quotation:",
                    description:
                      "Every luxury project should have a written breakdown of materials, brands and labour.",
                  },
                ]}
              />

              <p className="mt-4">
                Estimate early using our{" "}
                <a
                  href="https://www.mtboss.in/calculator"
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Budget Calculator
                </a>{" "}
                and read our{" "}
                <a
                  href="https://www.mtboss.in/blog/house-construction-cost-estimation-guide-india-2026"
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  house construction cost estimation guide
                </a>
                .
              </p>
            </section>

            <section>
              <SectionTitle>
                How MT Boss Delivers Luxury Interiors: Step by Step
              </SectionTitle>

              <div className="space-y-5">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Step 1: Private Consultation
                  </h4>
                  <BulletList
                    items={[
                      "We discuss your lifestyle, taste, family needs, entertaining habits and budget.",
                      "We listen first and design second.",
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Step 2: Site Study and Measurement
                  </h4>
                  <BulletList
                    items={[
                      "Detailed measurements of rooms, ceiling heights, beams, windows and services.",
                      "Structural and services review to make sure the design is buildable.",
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Step 3: Concept Development
                  </h4>
                  <BulletList
                    items={[
                      "Space plans show furniture layouts, circulation and focal points.",
                      "Moodboards present palettes, textures and material combinations.",
                      "Vastu preferences can be included in the design process.",
                    ]}
                  />
                  <p className="mt-3">
                    Read our{" "}
                    <a
                      href="https://www.mtboss.in/blog/vastu-shastra-principles-for-modern-home-architecture"
                      className="text-blue-600 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Vastu principles for modern home architecture guide
                    </a>
                    .
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Step 4: 3D Visualisation and Detailing
                  </h4>
                  <BulletList
                    items={[
                      "3D views show the finished look before work begins.",
                      "Detailed drawings cover carpentry, ceilings, lighting and electrical layouts.",
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Step 5: Material Selection
                  </h4>
                  <BulletList
                    items={[
                      "We present samples of veneers, stones, fabrics, hardware and finishes.",
                      "You approve each choice, so the result matches your expectations.",
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Step 6: Quotation and Agreement
                  </h4>
                  <p>
                    You receive an itemised quote with scope, brands, timeline
                    and payment stages.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Step 7: Preparation and Services
                  </h4>
                  <BulletList
                    items={[
                      "Civil changes, electrical layouts, plumbing, ceiling frameworks and waterproofing are completed with care.",
                      "Good preparation is what makes final finishes look flawless.",
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Step 8: Execution and Craftsmanship
                  </h4>
                  <BulletList
                    items={[
                      "Skilled carpenters, painters, electricians and installers work under supervision.",
                      "Each stage is checked before the next begins.",
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Step 9: Styling and Final Touches
                  </h4>
                  <BulletList
                    items={[
                      "Lighting is tuned, hardware is adjusted and surfaces are inspected up close.",
                      "Curtains, rugs, artwork and accessories are placed to complete the design.",
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Step 10: Handover and Support
                  </h4>
                  <p>
                    We complete a detailed inspection, snag correction and
                    thorough cleaning before handover. For repairs and
                    maintenance, use our{" "}
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
                Why Choose MT Boss as Your Luxury Interior Designer in Moradabad
              </SectionTitle>
              <BulletList
                items={[
                  {
                    title: "Construction-backed expertise:",
                    description:
                      "We understand structure, services and finishing, so luxury details are executed properly, not just drawn.",
                  },
                  {
                    title: "Precision execution:",
                    description:
                      "Alignment, joints, finishes and lighting are checked closely at each stage.",
                  },
                  {
                    title: "Custom design:",
                    description:
                      "Your home is designed for you, not adapted from a template.",
                  },
                  {
                    title: "Transparent communication:",
                    description:
                      "Clear scope, itemised pricing and written timelines.",
                  },
                  {
                    title: "Material guidance:",
                    description:
                      "We help you choose finishes that look elegant and perform well in Moradabad&apos;s climate.",
                  },
                  {
                    title: "One responsible partner:",
                    description:
                      "Design, execution and coordination are handled together.",
                  },
                  {
                    title: "Residential and commercial experience:",
                    description:
                      "Homes, villas, showrooms, offices and hospitality spaces.",
                  },
                ]}
              />

              <p className="mt-4">
                Explore materials through{" "}
                <a
                  href="https://www.mtboss.in/ShopNow"
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shop Now
                </a>
                , connect with trained tradespeople through our{" "}
                <a
                  href="https://www.mtboss.in/Services/professionals"
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  professionals network
                </a>
                , and browse completed work in our{" "}
                <a
                  href="https://www.mtboss.in/FeaturedProjects/ProjectGallery"
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  project gallery
                </a>
                .
              </p>
            </section>

            <section>
              <SectionTitle>Common Luxury Interior Mistakes to Avoid</SectionTitle>
              <BulletList items={commonMistakes} />
            </section>

            <section>
              <SectionTitle>Caring for Luxury Interiors</SectionTitle>
              <BulletList
                items={[
                  {
                    title: "Clean gently:",
                    description:
                      "Use soft cloths and mild cleaners on veneers, stone and glass.",
                  },
                  {
                    title: "Seal natural stone:",
                    description:
                      "Regular sealing protects marble and granite from stains.",
                  },
                  {
                    title: "Protect from moisture:",
                    description:
                      "Ventilate rooms and fix leaks early to prevent swelling and damp.",
                  },
                  {
                    title: "Limit direct sunlight:",
                    description:
                      "Use curtains or blinds to protect fabrics and wood from fading.",
                  },
                  {
                    title: "Service fixtures:",
                    description:
                      "Check lights, hinges and channels regularly.",
                  },
                  {
                    title: "Handle heavy items carefully:",
                    description:
                      "Avoid dragging furniture across floors.",
                  },
                  {
                    title: "Refresh accessories:",
                    description:
                      "Update cushions, rugs and artwork to renew the look without major work.",
                  },
                  {
                    title: "Professional deep cleaning:",
                    description:
                      "Schedule periodic cleaning for upholstery, carpets and chandeliers.",
                  },
                ]}
              />
            </section>

            <section>
              <SectionTitle>
                Luxury Interior Trends in Moradabad for 2026
              </SectionTitle>
              <BulletList
                items={[
                  {
                    title: "Warm, earthy palettes:",
                    description:
                      "Beige, taupe, olive, terracotta and deep browns.",
                  },
                  {
                    title: "Fluted and textured surfaces:",
                    description:
                      "Rich depth on walls, doors and furniture.",
                  },
                  {
                    title: "Curved and organic forms:",
                    description:
                      "Rounded sofas, arches and soft edges.",
                  },
                  {
                    title: "Brass and metal inlays:",
                    description:
                      "A refined nod to Moradabad&apos;s brassware heritage.",
                  },
                  {
                    title: "Statement lighting:",
                    description:
                      "Sculptural chandeliers, pendants and wall lights.",
                  },
                  {
                    title: "Natural stone and wood:",
                    description:
                      "Authentic materials with visible texture.",
                  },
                  {
                    title: "Smart-home integration:",
                    description:
                      "Lighting, curtains and security controlled from a phone.",
                  },
                  {
                    title: "Personal collections on display:",
                    description:
                      "Art, handicrafts and collectibles lit with care.",
                  },
                  {
                    title: "Quiet luxury:",
                    description:
                      "Understated, high-quality design instead of loud decoration.",
                  },
                ]}
              />
            </section>

            <section>
              <SectionTitle>
                Contact MT Boss for Your Luxury Interior Project
              </SectionTitle>

              <p className="mb-3">
                Share your floor plan or photos, preferred style, inspiration
                images and budget range. You will receive a private discussion,
                a site visit and an itemised proposal.
              </p>

              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Company:</strong> MTBOSS Construction Private Limited
                </li>
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
                  <strong>Contact Page:</strong>{" "}
                  <a
                    href="https://www.mtboss.in/contact"
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Share your requirement online
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <SectionTitle>Frequently Asked Questions</SectionTitle>

              <div className="space-y-5">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q1. What does a luxury interior designer do?
                  </h4>
                  <p className="mt-1">
                    A luxury interior designer plans custom layouts, selects
                    premium materials, designs lighting and details, and
                    supervises precise execution.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q2. How much does luxury interior design cost in Moradabad?
                  </h4>
                  <p className="mt-1">
                    Fully custom luxury interiors usually start around ₹3,000
                    per sq ft and above, depending on materials and detailing.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q3. Do you design luxury villas and kothis?
                  </h4>
                  <p className="mt-1">
                    Yes. We plan whole-house interiors, from entrances and
                    living areas to bedrooms and staircases.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q4. Can you design luxury showrooms and offices?
                  </h4>
                  <p className="mt-1">
                    Yes. We handle showrooms, executive offices, restaurants and
                    hospitality spaces.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q5. Will I see the design before work starts?
                  </h4>
                  <p className="mt-1">
                    Yes. Layouts, 3D visuals and material samples are shared for
                    your approval.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q6. Can I choose my own materials and brands?
                  </h4>
                  <p className="mt-1">
                    Yes. We suggest suitable options, and the final choice is
                    always yours.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q7. Can you include smart-home features?
                  </h4>
                  <p className="mt-1">
                    Yes. Lighting, curtain and security controls can be planned,
                    subject to your requirements.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q8. Can the design follow Vastu?
                  </h4>
                  <p className="mt-1">
                    Yes, within your building&apos;s layout. Please share your
                    Vastu preferences at the start.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q9. Does the quote include furniture and artwork?
                  </h4>
                  <p className="mt-1">
                    Fixed carpentry is normally included. Loose furniture,
                    artwork and carpets are priced separately unless agreed in
                    the proposal.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q10. How do I get a proposal?
                  </h4>
                  <p className="mt-1">
                    Call or WhatsApp{" "}
                    <a
                      href="tel:+919458410866"
                      className="text-blue-600 underline"
                    >
                      +91 94584 10866
                    </a>{" "}
                    or use the website contact form. Our team will visit,
                    measure and share an itemised proposal.
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
