
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
  const designerRoles = [
    {
      title: "Understands your lifestyle:",
      description:
        "Sleep habits, work-from-home needs, storage requirements, family size and personal taste all affect the design.",
    },
    {
      title: "Plans the layout:",
      description:
        "The designer decides where the bed, wardrobe, dressing unit, study desk and walkways go, so the room feels open and easy to use.",
    },
    {
      title: "Designs custom furniture:",
      description:
        "Wardrobes, beds, headboards, side tables and dressing units are made to fit your room&apos;s exact size.",
    },
    {
      title: "Selects finishes:",
      description:
        "Boards, laminates, paints, panels, fabrics and flooring are chosen for comfort, looks and budget.",
    },
    {
      title: "Plans lighting:",
      description:
        "Ceiling lights, bedside lamps, cove lighting and mood lighting are planned together with switch positions.",
    },
    {
      title: "Coordinates trades:",
      description:
        "Electricians, carpenters, painters and installers work in the correct sequence to avoid rework.",
    },
    {
      title: "Delivers a finished room:",
      description:
        "You should receive a clean, tested and ready-to-use bedroom.",
    },
  ];

  const whyDesignMatters = [
    {
      title: "Better sleep:",
      description:
        "Comfortable temperature, soft lighting and less noise and clutter help you rest better.",
    },
    {
      title: "Daily convenience:",
      description:
        "Well-planned storage makes dressing, packing and cleaning faster.",
    },
    {
      title: "Mental calm:",
      description:
        "A tidy, warm-toned room reduces stress at the end of the day.",
    },
    {
      title: "Privacy:",
      description:
        "Smart placement of doors, windows and furniture gives a more private feel.",
    },
    {
      title: "Health and comfort:",
      description:
        "Good ventilation and natural light improve air quality and mood.",
    },
    {
      title: "Property value:",
      description:
        "Well-finished bedrooms make a home more attractive for resale or rent.",
    },
    {
      title: "Long-term savings:",
      description:
        "Good materials and workmanship reduce repairs and replacements.",
    },
  ];

  const layoutPoints = [
    {
      title: "Bed placement:",
      description:
        "Position the bed so it does not block doors, windows or walking paths. A solid wall behind the headboard feels stable and cozy.",
    },
    {
      title: "Wardrobe position:",
      description:
        "Place it where doors can open fully without hitting the bed or other furniture. Sliding doors help in tight rooms.",
    },
    {
      title: "Walking space:",
      description:
        "Keep comfortable gaps around the bed and in front of the wardrobe.",
    },
    {
      title: "Window and light:",
      description:
        "Avoid blocking windows with tall furniture, and use natural light wisely.",
    },
    {
      title: "Dressing area:",
      description:
        "Position mirrors and dressing tables near good light, but away from direct glare.",
    },
    {
      title: "Study or work corner:",
      description:
        "If needed, add a compact desk near a window with proper lighting.",
    },
    {
      title: "TV placement:",
      description:
        "Position it at a comfortable eye level and reduce reflections from windows.",
    },
    {
      title: "Door swing and clearances:",
      description:
        "Plan all door movements before finalising furniture sizes.",
    },
    {
      title: "Attached bathroom coordination:",
      description:
        "Plan the door position and walkway to keep privacy and ease of use.",
    },
  ];

  const bedroomMistakes = [
    {
      title: "Oversized furniture:",
      description:
        "A huge bed or wardrobe in a small room makes it feel cramped.",
    },
    {
      title: "Poor lighting:",
      description:
        "Relying on a single ceiling light creates glare and shadows.",
    },
    {
      title: "Not enough storage:",
      description:
        "A stylish bedroom becomes messy without proper wardrobe planning.",
    },
    {
      title: "Ignoring door swing:",
      description:
        "Wardrobe doors that hit the bed or wall are frustrating.",
    },
    {
      title: "Too many colours or patterns:",
      description:
        "Busy designs reduce the calming effect.",
    },
    {
      title: "Cheap hardware:",
      description:
        "Weak hinges and channels wear out quickly.",
    },
    {
      title: "Blocking natural light:",
      description:
        "Tall furniture in front of windows makes the room dark.",
    },
    {
      title: "Forgetting sockets:",
      description:
        "Not enough charging points leads to messy extensions.",
    },
    {
      title: "Skipping curtains or blinds:",
      description:
        "Poor light control affects sleep.",
    },
    {
      title: "Ignoring ventilation:",
      description:
        "Stuffy air affects comfort and can cause damp.",
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-0">
      <div className="flex flex-col lg:flex-row">
        {/* Content Section */}
        <div className="flex-1 px-4 sm:px-8 md:px-16 py-12 order-1 lg:order-1">
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-8 text-gray-900">
            Interior Designer for Bedroom in Moradabad: Calm, Comfortable and
            Beautifully Planned Bedrooms by MT Boss
          </h2>

          <div className="space-y-6 text-gray-700 leading-relaxed max-w-4xl">
            <section>
              <p>
                Your bedroom is where your day begins and ends. It should be a
                calm, comfortable space that helps you rest, recharge and feel
                at home.
              </p>

              <p className="mt-3">
                A poorly planned bedroom leads to clutter, bad lighting,
                cramped movement, overflowing wardrobes and restless sleep.
              </p>

              <p className="mt-3">
                A well-designed bedroom balances comfort, storage, lighting,
                privacy and style without making the room feel crowded.
              </p>

              <p className="mt-3">
                MT Boss, also known as MTBOSS Construction Private Limited, is
                a Moradabad-based construction and interiors company. We design
                bedrooms with an understanding of structure, wiring, ventilation
                and finishing, not only decoration.
              </p>

              <p className="mt-3">
                Whether you need a master bedroom, kids&apos; room, guest room
                or a complete bedroom makeover, this guide explains layout,
                furniture, wardrobes, ceilings, lighting, colours, materials,
                Vastu and budget planning. You will also see how MT Boss
                handles a bedroom project from the first discussion to handover.
              </p>
            </section>

            <section>
              <SectionTitle>What a Bedroom Interior Designer Does</SectionTitle>
              <BulletList items={designerRoles} />
            </section>

            <section>
              <SectionTitle>Why Bedroom Design Matters</SectionTitle>
              <BulletList items={whyDesignMatters} />
            </section>

            <section>
              <SectionTitle>Types of Bedrooms We Design</SectionTitle>

              <div className="space-y-5">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Master Bedroom
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Purpose:",
                        description:
                          "The main private retreat for the homeowners.",
                      },
                      {
                        title: "Typical features:",
                        description:
                          "A large bed with headboard, a spacious wardrobe, a dressing unit, bedside tables, a false ceiling and a feature wall.",
                      },
                      {
                        title: "Extras:",
                        description:
                          "Walk-in wardrobe, attached bathroom coordination, TV unit, reading corner or a small work desk.",
                      },
                      {
                        title: "Design tip:",
                        description:
                          "Keep the palette calm and layer lighting for a relaxing atmosphere.",
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Kids&apos; Bedroom
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Purpose:",
                        description:
                          "A safe, playful and flexible space that grows with the child.",
                      },
                      {
                        title: "Typical features:",
                        description:
                          "Study table, bookshelf, bunk or storage bed, toy storage and durable finishes.",
                      },
                      {
                        title: "Safety points:",
                        description:
                          "Rounded edges, non-toxic paints, secure furniture and no sharp corners.",
                      },
                      {
                        title: "Design tip:",
                        description:
                          "Choose adaptable designs so the room can change as the child grows.",
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Teen and Student Room
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Purpose:",
                        description:
                          "Study, rest and personal space combined.",
                      },
                      {
                        title: "Typical features:",
                        description:
                          "A proper study desk, ergonomic chair space, shelves, pin-up boards and wardrobe.",
                      },
                      {
                        title: "Design tip:",
                        description:
                          "Good task lighting and a quiet corner improve focus.",
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Guest Bedroom
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Purpose:",
                        description:
                          "A simple, welcoming room for visitors.",
                      },
                      {
                        title: "Typical features:",
                        description:
                          "A comfortable bed, compact wardrobe, side table and luggage space.",
                      },
                      {
                        title: "Design tip:",
                        description:
                          "Keep it minimal and easy to maintain.",
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Parents&apos; or Senior Bedroom
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Purpose:",
                        description: "Comfort, safety and easy access.",
                      },
                      {
                        title: "Typical features:",
                        description:
                          "A slightly higher bed for easy sitting, grab-friendly furniture, non-slip flooring, soft night lighting and easy-reach storage.",
                      },
                      {
                        title: "Design tip:",
                        description:
                          "Avoid clutter, sharp edges and difficult-to-open cabinets.",
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Small Bedroom
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Purpose:",
                        description:
                          "Make limited space feel bigger and functional.",
                      },
                      {
                        title: "Typical features:",
                        description:
                          "Sliding wardrobes, storage beds, wall-mounted units and light colours.",
                      },
                      {
                        title: "Design tip:",
                        description:
                          "Use vertical storage and avoid oversized furniture.",
                      },
                    ]}
                  />
                </div>
              </div>
            </section>

            <section>
              <SectionTitle>Bedroom Layout Planning</SectionTitle>
              <BulletList items={layoutPoints} />
            </section>

            <section>
              <SectionTitle>Wardrobe Design for Bedrooms</SectionTitle>

              <div className="space-y-5">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Hinged Wardrobes
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Pros:",
                        description:
                          "Full access to the interior, classic look and typically lower cost.",
                      },
                      {
                        title: "Limitations:",
                        description:
                          "Needs space in front for doors to swing open.",
                      },
                      {
                        title: "Best for:",
                        description: "Medium to large bedrooms.",
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Sliding Wardrobes
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Pros:",
                        description:
                          "Saves space, looks sleek and suits smaller rooms.",
                      },
                      {
                        title: "Limitations:",
                        description:
                          "Only part of the wardrobe is open at once, and tracks need occasional cleaning.",
                      },
                      {
                        title: "Best for:",
                        description:
                          "Compact bedrooms and modern designs.",
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Walk-In Wardrobes
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Pros:",
                        description:
                          "Generous storage, easy organisation and a premium feel.",
                      },
                      {
                        title: "Limitations:",
                        description:
                          "Needs extra floor area and careful lighting.",
                      },
                      {
                        title: "Best for:",
                        description: "Larger master bedrooms.",
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Internal Wardrobe Planning
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Hanging space:",
                        description:
                          "Separate sections for long dresses, shirts, sarees and short garments.",
                      },
                      {
                        title: "Drawers:",
                        description:
                          "For innerwear, accessories, socks and small items.",
                      },
                      {
                        title: "Shelves:",
                        description:
                          "For folded clothes, bags and bedding.",
                      },
                      {
                        title: "Loft storage:",
                        description:
                          "For suitcases, seasonal clothes and rarely used items.",
                      },
                      {
                        title: "Extras:",
                        description:
                          "Pull-out trouser racks, tie holders, jewellery trays, shoe shelves, mirror and lighting.",
                      },
                      {
                        title: "Cost guide:",
                        description:
                          "Wardrobes generally range from about ₹900 to ₹2,200 per sq ft, depending on finish, accessories and door type.",
                      },
                    ]}
                  />
                </div>
              </div>
            </section>

            <section>
              <SectionTitle>Beds, Headboards and Bedside Furniture</SectionTitle>
              <BulletList
                items={[
                  {
                    title: "Storage beds:",
                    description:
                      "Hydraulic or drawer storage uses the space under the bed for bedding, clothes and seasonal items.",
                  },
                  {
                    title: "Upholstered headboards:",
                    description:
                      "Soft, comfortable and stylish, ideal for a cozy look.",
                  },
                  {
                    title: "Panelled headboards:",
                    description:
                      "Wooden or fluted panels create a strong feature wall.",
                  },
                  {
                    title: "Floating bedside tables:",
                    description:
                      "Wall-mounted tables save floor space and look modern.",
                  },
                  {
                    title: "Under-bed drawers:",
                    description:
                      "Useful in small rooms, but they need enough clearance to open.",
                  },
                  {
                    title: "Mattress size:",
                    description:
                      "Plan the bed size carefully so walkways remain comfortable.",
                  },
                  {
                    title: "Charging points:",
                    description:
                      "Add sockets and USB points at bedside level for convenience.",
                  },
                  {
                    title: "Materials:",
                    description:
                      "Use good plywood or engineered boards for strength and avoid weak joints.",
                  },
                ]}
              />
            </section>

            <section>
              <SectionTitle>False Ceiling and Lighting for Bedrooms</SectionTitle>

              <div className="space-y-5">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    False Ceiling Ideas
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Peripheral ceiling:",
                        description:
                          "A simple border with a recessed centre is elegant and economical.",
                      },
                      {
                        title: "Cove ceiling:",
                        description:
                          "Hidden lights give a soft, warm glow.",
                      },
                      {
                        title: "Layered ceiling:",
                        description:
                          "Multi-level designs add depth in larger rooms.",
                      },
                      {
                        title: "Wooden accents:",
                        description:
                          "Panels or strips add warmth and texture.",
                      },
                      {
                        title: "Cost guide:",
                        description:
                          "Gypsum ceilings generally cost around ₹80 to ₹180 per sq ft, while POP is often cheaper at ₹60 to ₹120 per sq ft.",
                      },
                    ]}
                  />
                  <p className="mt-3">
                    <strong>Tip:</strong> In smaller rooms, keep the ceiling
                    design simple so the room does not feel low.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Bedroom Lighting
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Ambient lighting:",
                        description:
                          "Soft, general light from ceiling panels or cove lights.",
                      },
                      {
                        title: "Task lighting:",
                        description:
                          "Bedside lamps or wall-mounted reading lights for reading.",
                      },
                      {
                        title: "Accent lighting:",
                        description:
                          "Lights behind the headboard, inside wardrobes or on artwork.",
                      },
                      {
                        title: "Warm light:",
                        description:
                          "Choose warm-white tones for a relaxing feel.",
                      },
                      {
                        title: "Dimmers:",
                        description:
                          "Allow you to lower the brightness at night.",
                      },
                      {
                        title: "Two-way switches:",
                        description:
                          "Let you control lights from the door and the bed.",
                      },
                      {
                        title: "Night lights:",
                        description:
                          "Low-level lights for safe movement at night.",
                      },
                    ]}
                  />
                </div>
              </div>
            </section>

            <section>
              <SectionTitle>Colours, Walls and Wall Treatments</SectionTitle>

              <div className="space-y-5">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Colour Ideas
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Soft neutrals:",
                        description:
                          "Beige, cream and light grey create a calm, timeless feel.",
                      },
                      {
                        title: "Earthy tones:",
                        description:
                          "Olive, sage and terracotta add warmth.",
                      },
                      {
                        title: "Cool shades:",
                        description:
                          "Light blue and soft green feel fresh and relaxing.",
                      },
                      {
                        title: "Darker accents:",
                        description:
                          "Deep blue or charcoal can work on one feature wall in larger rooms.",
                      },
                      {
                        title: "Avoid too many bright colours:",
                        description:
                          "They can feel tiring in a room meant for rest.",
                      },
                      {
                        title: "Painting cost:",
                        description:
                          "Roughly ₹18 to ₹45 per sq ft, depending on paint brand, coats and preparation.",
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Wall Treatments
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Fluted panels:",
                        description:
                          "Popular behind the bed or TV.",
                      },
                      {
                        title: "Wooden slats or louvers:",
                        description:
                          "Add texture and a premium feel.",
                      },
                      {
                        title: "Wallpaper:",
                        description:
                          "Good for feature walls or kids&apos; rooms.",
                      },
                      {
                        title: "Textured paint:",
                        description:
                          "Adds depth without heavy cost.",
                      },
                      {
                        title: "Mirror panels:",
                        description:
                          "Reflect light and make the room feel bigger.",
                      },
                      {
                        title: "Paneling cost:",
                        description:
                          "About ₹150 to ₹450 per sq ft, depending on material and finish.",
                      },
                    ]}
                  />
                </div>
              </div>
            </section>

            <section>
              <SectionTitle>Flooring, Curtains and Soft Furnishing</SectionTitle>
              <BulletList
                items={[
                  {
                    title: "Flooring options:",
                    description:
                      "Vitrified tiles, wooden laminate, marble and engineered wood are common choices.",
                  },
                  {
                    title: "Comfort underfoot:",
                    description:
                      "Wooden-look flooring or a soft rug feels warmer than plain tile.",
                  },
                  {
                    title: "Wooden laminate cost:",
                    description:
                      "Roughly ₹90 to ₹200 per sq ft.",
                  },
                  {
                    title: "Curtains:",
                    description:
                      "Use blackout or layered curtains for better sleep and privacy.",
                  },
                  {
                    title: "Blinds:",
                    description:
                      "Roller or Roman blinds suit modern, compact rooms.",
                  },
                  {
                    title: "Bedding and cushions:",
                    description:
                      "Choose breathable fabrics suited to Moradabad&apos;s hot summers and cooler winters.",
                  },
                  {
                    title: "Rugs:",
                    description:
                      "Add colour and comfort, but choose low-pile rugs that are easy to clean.",
                  },
                  {
                    title: "Curtain cost:",
                    description:
                      "Around ₹8,000 to ₹25,000 per window for good fabrics and rails.",
                  },
                ]}
              />
            </section>

            <section>
              <SectionTitle>Vastu Tips for Bedroom Design</SectionTitle>
              <BulletList
                items={[
                  {
                    title: "Master bedroom direction:",
                    description:
                      "Many people prefer the south-west for the master bedroom.",
                  },
                  {
                    title: "Bed position:",
                    description:
                      "Traditionally, sleeping with the head towards the south or east is preferred.",
                  },
                  {
                    title: "Mirror placement:",
                    description:
                      "Some people prefer not to place mirrors directly opposite the bed.",
                  },
                  {
                    title: "Colour choice:",
                    description:
                      "Soft, calm shades are often preferred.",
                  },
                  {
                    title: "Electronics:",
                    description:
                      "Keep heavy electronics away from the head of the bed where possible.",
                  },
                  {
                    title: "Practical approach:",
                    description:
                      "Not every home can follow every rule, so we adapt the design within your building&apos;s layout.",
                  },
                ]}
              />

              <p className="mt-4">
                Learn more through our{" "}
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
            </section>

            <section>
              <SectionTitle>Bedroom Interior Cost in Moradabad</SectionTitle>
              <BulletList
                items={[
                  {
                    title: "Typical range:",
                    description:
                      "A bedroom interior in Moradabad commonly ranges from about ₹80,000 to ₹3 lakh, depending on size, materials and design level.",
                  },
                  {
                    title: "Main cost drivers:",
                    description:
                      "Wardrobe size, bed and headboard design, false ceiling, paneling, lighting and finish quality.",
                  },
                  {
                    title: "Economy design:",
                    description:
                      "Laminate finishes, a simple ceiling and standard hardware keep the cost lower.",
                  },
                  {
                    title: "Premium design:",
                    description:
                      "Veneer, acrylic or PU finishes, detailed ceilings and layered lighting increase the budget.",
                  },
                  {
                    title: "Where to spend:",
                    description:
                      "Wardrobe quality, hardware, mattress and lighting.",
                  },
                  {
                    title: "Where to save:",
                    description:
                      "Keep the ceiling simple and use paint on the feature wall instead of expensive paneling.",
                  },
                  {
                    title: "What may be extra:",
                    description:
                      "Civil changes, new electrical points, appliances, curtains and loose furniture.",
                  },
                  {
                    title: "Itemised quotation:",
                    description:
                      "Ask for a written breakdown of materials, hardware and labour.",
                  },
                ]}
              />

              <p className="mt-4">
                Estimate early with our{" "}
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
                How MT Boss Designs Your Bedroom: Step by Step
              </SectionTitle>

              <div className="space-y-5">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Step 1: Consultation
                  </h4>
                  <BulletList
                    items={[
                      "Share your requirements, sleep habits, storage needs, style and budget.",
                      "For kids&apos; or senior rooms, we discuss safety and comfort needs.",
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Step 2: Site Visit and Measurement
                  </h4>
                  <BulletList
                    items={[
                      "We measure the room, windows, doors and beams, and mark electrical points.",
                      "We check walls for damp or cracks that need repair before finishing.",
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Step 3: Layout and Concept
                  </h4>
                  <BulletList
                    items={[
                      "We prepare layouts showing furniture positions and walkways.",
                      "Moodboards with colours and materials help you visualise the direction.",
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Step 4: Material Selection
                  </h4>
                  <BulletList
                    items={[
                      "We suggest boards, laminates, paints, panels and hardware at different budgets.",
                      "You approve the final choices before work starts.",
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Step 5: 3D Visualisation
                  </h4>
                  <p>
                    3D views help you see the finished bedroom and request
                    changes early.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Step 6: Quotation and Agreement
                  </h4>
                  <BulletList
                    items={[
                      "You receive an itemised quote with scope, materials and timeline.",
                      "Payment stages are agreed in writing.",
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Step 7: Preparation Work
                  </h4>
                  <p>
                    Wall repair, electrical changes, ceiling framework and paint
                    preparation are completed before finishing work begins.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Step 8: Carpentry and Finishing
                  </h4>
                  <BulletList
                    items={[
                      "Wardrobes, beds, headboards and other furniture are fitted.",
                      "Painting, lighting and final touches follow.",
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Step 9: Inspection and Handover
                  </h4>
                  <BulletList
                    items={[
                      "We check alignment, finish, lighting, hardware and cleanliness.",
                      "Any snags are corrected before handover.",
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Step 10: After-Service Support
                  </h4>
                  <p>
                    For small repairs, use our{" "}
                    <a
                      href="https://www.mtboss.in/quick"
                      className="text-blue-600 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Quick Home Services
                    </a>{" "}
                    or contact MT Boss directly.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <SectionTitle>
                Why Choose MT Boss as Your Bedroom Interior Designer in
                Moradabad
              </SectionTitle>

              <BulletList
                items={[
                  {
                    title: "Construction-backed knowledge:",
                    description:
                      "We understand walls, wiring, ventilation and finishing, not just styling.",
                  },
                  {
                    title: "Transparent pricing:",
                    description:
                      "Clear scope and itemised quotes help avoid surprises.",
                  },
                  {
                    title: "Custom design:",
                    description:
                      "Bedrooms are planned around your room and lifestyle, not copied from a template.",
                  },
                  {
                    title: "Quality materials:",
                    description:
                      "We guide you on boards, hardware, paints and finishes suited to local conditions.",
                  },
                  {
                    title: "One responsible partner:",
                    description:
                      "Design, execution and coordination are handled together.",
                  },
                  {
                    title: "Clear communication:",
                    description:
                      "Reach us by phone, WhatsApp, email or website forms.",
                  },
                  {
                    title: "Homes of all sizes:",
                    description:
                      "We work on flats, villas and builder floors.",
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
                , and see completed examples in our{" "}
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
              <SectionTitle>Common Bedroom Design Mistakes to Avoid</SectionTitle>
              <BulletList items={bedroomMistakes} />
            </section>

            <section>
              <SectionTitle>Bedroom Maintenance Tips</SectionTitle>
              <BulletList
                items={[
                  {
                    title: "Air the room daily:",
                    description:
                      "Open windows to let fresh air in and reduce moisture.",
                  },
                  {
                    title: "Clean wardrobe tracks and hinges:",
                    description:
                      "Keep sliding tracks free from dust for smooth movement.",
                  },
                  {
                    title: "Avoid overloading:",
                    description:
                      "Heavy loads can bend shelves and damage drawers.",
                  },
                  {
                    title: "Protect surfaces from moisture:",
                    description:
                      "Keep furniture slightly away from damp walls.",
                  },
                  {
                    title: "Use mild cleaners:",
                    description:
                      "Harsh chemicals can dull laminate and paint.",
                  },
                  {
                    title: "Wash curtains and bedding regularly:",
                    description:
                      "This keeps the room fresh and reduces dust.",
                  },
                  {
                    title: "Check lights and switches:",
                    description:
                      "Replace faulty bulbs and loose switches early.",
                  },
                  {
                    title: "Touch up paint:",
                    description:
                      "Small repairs prevent bigger damage.",
                  },
                ]}
              />
            </section>

            <section>
              <SectionTitle>Bedroom Design Trends in Moradabad for 2026</SectionTitle>
              <BulletList
                items={[
                  {
                    title: "Warm neutral palettes:",
                    description:
                      "Beige, cream, olive and earthy tones.",
                  },
                  {
                    title: "Fluted headboard walls:",
                    description:
                      "Textured panels behind the bed create a strong focal point.",
                  },
                  {
                    title: "Floating furniture:",
                    description:
                      "Wall-mounted bedside tables and dressing units make rooms look lighter.",
                  },
                  {
                    title: "Layered lighting:",
                    description:
                      "Cove lights, wall lamps and dimmers create a cozy mood.",
                  },
                  {
                    title: "Compact work corners:",
                    description:
                      "A small desk within the bedroom for study or remote work.",
                  },
                  {
                    title: "Textured and natural materials:",
                    description:
                      "Wood tones, fabric and cane details.",
                  },
                  {
                    title: "Brass accents:",
                    description:
                      "Lamps, handles and décor pieces that reflect Moradabad&apos;s brass heritage.",
                  },
                  {
                    title: "Clutter-free design:",
                    description:
                      "Closed storage and minimalist styling for a calmer room.",
                  },
                ]}
              />
            </section>

            <section>
              <SectionTitle>Contact MT Boss for Your Bedroom Project</SectionTitle>

              <p className="mb-3">
                Share room photos or measurements, your preferred style and
                budget. You will receive a clear discussion, a site visit and an
                itemised quote.
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
                    Q1. What does a bedroom interior designer do?
                  </h4>
                  <p className="mt-1">
                    A bedroom interior designer plans the layout, furniture,
                    storage, lighting, colours and finishes so the room is
                    comfortable and functional.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q2. How much does bedroom interior design cost in Moradabad?
                  </h4>
                  <p className="mt-1">
                    It generally ranges from about ₹80,000 to ₹3 lakh,
                    depending on the room size, materials and design level.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q3. Which wardrobe is best for a small bedroom?
                  </h4>
                  <p className="mt-1">
                    Sliding wardrobes are usually best because they do not need
                    space for doors to swing open.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q4. What colours suit a bedroom?
                  </h4>
                  <p className="mt-1">
                    Soft neutrals, earthy tones and light blues or greens help
                    create a calm and restful feel.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q5. Can you design a kids&apos; bedroom?
                  </h4>
                  <p className="mt-1">
                    Yes. We plan safe, durable and flexible kids&apos; rooms
                    with study and storage areas.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q6. Do you design according to Vastu?
                  </h4>
                  <p className="mt-1">
                    Yes. We can follow your Vastu preferences within the
                    practical limitations of your building layout.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q7. Can I see the design before work begins?
                  </h4>
                  <p className="mt-1">
                    Yes. Layouts and 3D visuals are shared for your approval
                    before work begins.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q8. Do you handle electrical and ceiling work too?
                  </h4>
                  <p className="mt-1">
                    Yes. We coordinate electrical points, false ceilings,
                    painting and furniture as part of the bedroom project.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q9. Can you redesign my existing bedroom?
                  </h4>
                  <p className="mt-1">
                    Yes. We can handle full bedroom makeovers, renovations and
                    upgrades of existing rooms.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q10. How do I get a quote?
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
                    measure and share an itemised quote.
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
