
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
      title: "Understands how you live:",
      description:
        "Family size, guest frequency, TV habits, children, elders and hobbies all shape the design.",
    },
    {
      title: "Plans the layout:",
      description:
        "Decides where seating, TV unit, console, storage and walkways go, so the room feels open and easy to use.",
    },
    {
      title: "Designs custom units:",
      description:
        "TV walls, display shelves, crockery units and shoe racks are made to fit your room.",
    },
    {
      title: "Selects materials:",
      description:
        "Boards, laminates, panels, paints, flooring and fabrics are chosen for looks, durability and budget.",
    },
    {
      title: "Plans lighting:",
      description:
        "Ceiling lights, cove lighting, wall lights and lamps are planned along with switch positions.",
    },
    {
      title: "Coordinates trades:",
      description:
        "Electricians, carpenters, painters and installers work in the right order to avoid rework.",
    },
    {
      title: "Delivers a finished space:",
      description:
        "You should get a clean, tested and ready-to-use living room.",
    },
  ];

  const whyDesignMatters = [
    {
      title: "First impressions:",
      description:
        "Guests judge your home by the living room, so it sets the tone.",
    },
    {
      title: "Family comfort:",
      description:
        "A comfortable room encourages family time and relaxation.",
    },
    {
      title: "Multi-purpose use:",
      description:
        "It often serves as a TV area, dining extension, play area and work corner.",
    },
    {
      title: "Storage needs:",
      description:
        "Without planned storage, remote controls, toys, documents and décor create clutter.",
    },
    {
      title: "Resale and rental value:",
      description:
        "A well-finished living room raises the appeal of the property.",
    },
    {
      title: "Long-term savings:",
      description:
        "Good materials and workmanship reduce repairs and replacements.",
    },
  ];

  const layoutPoints = [
    {
      title: "Focal point:",
      description:
        "Decide whether the TV wall, window view or a feature wall will be the main focus, then arrange seating around it.",
    },
    {
      title: "Seating arrangement:",
      description:
        "Choose L-shaped sofas, sectionals, sofa-and-chairs combinations or a simple three-plus-two setup based on room size.",
    },
    {
      title: "Walking paths:",
      description:
        "Keep clear routes from the entrance to other rooms, so people do not have to walk around furniture.",
    },
    {
      title: "Distance from the TV:",
      description:
        "Seating should be at a comfortable viewing distance, and the screen should sit at eye level when seated.",
    },
    {
      title: "Natural light:",
      description:
        "Avoid blocking windows with tall furniture and use sunlight to make the room feel larger.",
    },
    {
      title: "Open-plan rooms:",
      description:
        "If the living room connects with the dining area or kitchen, use rugs, ceiling design or lighting to define each zone.",
    },
    {
      title: "Small living rooms:",
      description:
        "Choose compact furniture, wall-mounted units and light colours to avoid a crowded feel.",
    },
    {
      title: "Large living rooms:",
      description:
        "Create separate zones, such as a conversation area and a TV area, so the space does not feel empty.",
    },
    {
      title: "Door and window clearances:",
      description:
        "Plan door swings and window access before finalising furniture.",
    },
  ];

  const storageSolutions = [
    {
      title: "Console tables:",
      description:
        "Useful near the entrance for keys, mail and décor.",
    },
    {
      title: "Shoe rack or cabinet:",
      description:
        "Keeps footwear organised near the door.",
    },
    {
      title: "Crockery or display unit:",
      description:
        "Displays special items, with closed storage for clutter.",
    },
    {
      title: "TV unit drawers:",
      description:
        "Store remotes, games, chargers and documents.",
    },
    {
      title: "Bookshelves:",
      description:
        "Combine books with décor for a personal touch.",
    },
    {
      title: "Storage ottomans and benches:",
      description:
        "Hide blankets, toys and cushions.",
    },
    {
      title: "Wall shelves:",
      description:
        "Save floor space while adding display areas.",
    },
    {
      title: "Pooja unit:",
      description:
        "If placed in the living room, design a compact, respectful space with proper lighting.",
    },
    {
      title: "Kids&apos; zone storage:",
      description:
        "Low boxes or drawers help children tidy up their toys.",
    },
  ];

  const commonMistakes = [
    {
      title: "Oversized furniture:",
      description:
        "A large sofa or centre table in a small room blocks movement.",
    },
    {
      title: "Weak lighting:",
      description:
        "A single ceiling light leaves the room flat and shadowy.",
    },
    {
      title: "Ignoring cable planning:",
      description:
        "Visible wires around the TV look messy and can be unsafe.",
    },
    {
      title: "Too many colours or patterns:",
      description:
        "Busy designs make the room feel cluttered.",
    },
    {
      title: "No storage:",
      description:
        "Without planned storage, clutter builds up quickly.",
    },
    {
      title: "Wrong TV height or distance:",
      description:
        "Poor placement causes neck strain and eye fatigue.",
    },
    {
      title: "Blocking windows:",
      description:
        "Tall furniture in front of windows reduces light and airflow.",
    },
    {
      title: "Copying trends blindly:",
      description:
        "Choose designs that suit your home and routine, not only what is popular.",
    },
    {
      title: "Cheap finishes in high-use areas:",
      description:
        "Poor laminates and paints fade or peel early.",
    },
    {
      title: "Skipping curtains or blinds:",
      description:
        "Poor light control affects comfort and privacy.",
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-0">
      <div className="flex flex-col lg:flex-row">
        {/* Content Section */}
        <div className="flex-1 px-4 sm:px-8 md:px-16 py-12 order-1 lg:order-1">
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-8 text-gray-900">
            Interior Designer for Living Room in Moradabad: Stylish,
            Comfortable and Practical Spaces by MT Boss
          </h2>

          <div className="space-y-6 text-gray-700 leading-relaxed max-w-4xl">
            <section>
              <p>
                The living room is the heart of your home. It is where the
                family relaxes, guests are welcomed, festivals are celebrated
                and daily life comes together.
              </p>

              <p className="mt-3">
                It is also the first room visitors see, so it shapes the
                impression of your entire home.
              </p>

              <p className="mt-3">
                A poorly planned living room feels crowded, dark or
                disconnected, with awkward furniture, weak lighting and no
                storage. A well-designed room balances comfort, style, storage
                and lighting so that it works for both quiet evenings and busy
                gatherings.
              </p>

              <p className="mt-3">
                MT Boss, also known as MTBOSS Construction Private Limited, is
                a Moradabad-based construction and interiors company. We design
                living rooms with an understanding of structure, wiring,
                ventilation and finishing, not just decoration.
              </p>

              <p className="mt-3">
                This guide covers layout, seating, TV units, ceilings, lighting,
                walls, flooring, colours, Vastu, budget and process, so you can
                plan your living room with confidence.
              </p>
            </section>

            <section>
              <SectionTitle>
                What a Living Room Interior Designer Does
              </SectionTitle>
              <BulletList items={designerRoles} />
            </section>

            <section>
              <SectionTitle>Why Living Room Design Matters</SectionTitle>
              <BulletList items={whyDesignMatters} />
            </section>

            <section>
              <SectionTitle>Living Room Layout Planning</SectionTitle>
              <BulletList items={layoutPoints} />
            </section>

            <section>
              <SectionTitle>TV Unit and Wall Design</SectionTitle>

              <div className="space-y-5">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    TV Unit Styles
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Wall-mounted TV unit:",
                        description:
                          "A clean, modern look with storage below or beside the TV.",
                      },
                      {
                        title: "Floor-standing unit:",
                        description:
                          "Provides more storage and suits larger rooms.",
                      },
                      {
                        title: "Floating units:",
                        description:
                          "Wall-mounted cabinets create a light, airy feel.",
                      },
                      {
                        title: "Open shelving:",
                        description:
                          "Displays books, décor and plants while keeping the room lively.",
                      },
                      {
                        title: "Closed storage:",
                        description:
                          "Hides wires, gaming consoles, routers and clutter.",
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    TV Wall Finishes
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Fluted panels:",
                        description:
                          "Very popular for adding depth and texture.",
                      },
                      {
                        title: "Wooden slats or louvers:",
                        description: "Warm and modern.",
                      },
                      {
                        title: "Veneer or laminate paneling:",
                        description:
                          "Clean, durable and available in many designs.",
                      },
                      {
                        title: "Stone-look or marble-look sheets:",
                        description:
                          "Create a premium feel without the cost of real stone.",
                      },
                      {
                        title: "Textured paint:",
                        description:
                          "Adds interest at a lower cost.",
                      },
                      {
                        title: "Backlit panels:",
                        description:
                          "LED strips behind the panel create a soft glow.",
                      },
                      {
                        title: "Paneling cost guide:",
                        description:
                          "About ₹150 to ₹450 per sq ft, depending on material and finish.",
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Practical TV Unit Points
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Cable management:",
                        description:
                          "Plan concealed wiring for the TV, set-top box, sound system and router.",
                      },
                      {
                        title: "Ventilation:",
                        description:
                          "Leave space for heat from devices to escape.",
                      },
                      {
                        title: "Socket placement:",
                        description:
                          "Provide enough sockets behind and beside the unit.",
                      },
                      {
                        title: "Wall strength:",
                        description:
                          "Confirm the wall can hold the TV weight, especially with a heavy screen.",
                      },
                    ]}
                  />
                </div>
              </div>
            </section>

            <section>
              <SectionTitle>Seating and Furniture Planning</SectionTitle>
              <BulletList
                items={[
                  {
                    title: "Sofa size and shape:",
                    description:
                      "Measure the room first because an oversized sofa can make the room feel crowded.",
                  },
                  {
                    title: "Fabric choice:",
                    description:
                      "Choose durable, easy-to-clean fabrics, especially if you have children or pets.",
                  },
                  {
                    title: "Colour choice:",
                    description:
                      "Neutral sofas with colourful cushions are easy to refresh later.",
                  },
                  {
                    title: "Centre and side tables:",
                    description:
                      "Choose sizes that fit the room and leave enough space to walk.",
                  },
                  {
                    title: "Storage furniture:",
                    description:
                      "Ottomans with storage, side tables with shelves and console units help keep clutter hidden.",
                  },
                  {
                    title: "Recliners and accent chairs:",
                    description:
                      "Add comfort and personality but need extra space.",
                  },
                  {
                    title: "Dining extension:",
                    description:
                      "If the dining table is in the same room, keep its style consistent with the living area.",
                  },
                  {
                    title: "Material quality:",
                    description:
                      "Solid frames, good foam and strong joints make furniture last longer.",
                  },
                  {
                    title: "Loose furniture:",
                    description:
                      "Sofas and dining sets are usually priced separately from the fixed interior package.",
                  },
                ]}
              />
            </section>

            <section>
              <SectionTitle>False Ceiling and Lighting Design</SectionTitle>

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
                          "Hidden LED lights create a soft, warm glow.",
                      },
                      {
                        title: "Layered ceiling:",
                        description:
                          "Multi-level designs add depth in larger rooms.",
                      },
                      {
                        title: "Wooden or textured accents:",
                        description:
                          "Panels or strips create a premium feel.",
                      },
                      {
                        title: "Cost guide:",
                        description:
                          "Gypsum ceilings generally cost about ₹80 to ₹180 per sq ft, while POP is often cheaper at ₹60 to ₹120 per sq ft.",
                      },
                    ]}
                  />
                  <p className="mt-3">
                    <strong>Tip:</strong> In rooms with low height, keep the
                    ceiling design simple and light in colour.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Lighting Layers
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Ambient lighting:",
                        description:
                          "General light from ceiling panels or cove lights.",
                      },
                      {
                        title: "Task lighting:",
                        description:
                          "Reading lamps or floor lamps beside sofas.",
                      },
                      {
                        title: "Accent lighting:",
                        description:
                          "Spotlights on artwork, shelves or the TV wall.",
                      },
                      {
                        title: "Decorative lighting:",
                        description:
                          "Chandeliers or pendant lights add style, especially over seating or dining areas.",
                      },
                      {
                        title: "Warm versus cool light:",
                        description:
                          "Warm-white tones create a cozy feel, while neutral-white tones suit brighter, work-friendly rooms.",
                      },
                      {
                        title: "Dimmers and scenes:",
                        description:
                          "Adjustable brightness lets you switch between family time, movie night and guest evenings.",
                      },
                      {
                        title: "Switch planning:",
                        description:
                          "Group switches logically near the entrance and seating area.",
                      },
                      {
                        title: "Electrical cost guide:",
                        description:
                          "Concealed wiring changes, profile lights, chandeliers and smart switches can add around ₹30,000 to ₹1.5 lakh in a typical flat.",
                      },
                    ]}
                  />
                </div>
              </div>
            </section>

            <section>
              <SectionTitle>Colours and Wall Treatments</SectionTitle>

              <div className="space-y-5">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Colour Ideas
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Warm neutrals:",
                        description:
                          "Beige, cream, ivory and light greige feel welcoming and timeless.",
                      },
                      {
                        title: "Earthy tones:",
                        description:
                          "Olive, terracotta and sage give a natural, calm mood.",
                      },
                      {
                        title: "Cool shades:",
                        description:
                          "Light grey, soft blue and pale green feel airy and fresh.",
                      },
                      {
                        title: "Bold accent wall:",
                        description:
                          "Deep blue, forest green or charcoal can work on one wall in bigger rooms.",
                      },
                      {
                        title: "Small rooms:",
                        description:
                          "Light colours reflect more light and make the space look larger.",
                      },
                      {
                        title: "Painting cost guide:",
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
                        title: "Wallpaper:",
                        description:
                          "Adds patterns and texture for feature walls.",
                      },
                      {
                        title: "Textured paint or plaster:",
                        description:
                          "Gives depth and a premium look.",
                      },
                      {
                        title: "Mirror accents:",
                        description:
                          "Reflect light and make the room appear bigger.",
                      },
                      {
                        title: "Wall art and shelves:",
                        description:
                          "Add personality, photos and travel souvenirs.",
                      },
                      {
                        title: "Brass accents:",
                        description:
                          "Suit Moradabad&apos;s brassware heritage and add character through wall pieces and décor.",
                      },
                      {
                        title: "Moisture and repair:",
                        description:
                          "Damp patches and cracks should be fixed before painting so the finish lasts.",
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
                      "Vitrified tiles, marble, granite, wooden laminate and engineered wood.",
                  },
                  {
                    title: "Comfort and maintenance:",
                    description:
                      "Tiles are easy to clean, while wooden-look flooring feels warmer.",
                  },
                  {
                    title: "Wooden laminate cost guide:",
                    description:
                      "Roughly ₹90 to ₹200 per sq ft.",
                  },
                  {
                    title: "Rugs:",
                    description:
                      "Define the seating area and add colour, but choose easy-to-clean, low-pile styles.",
                  },
                  {
                    title: "Curtains:",
                    description:
                      "Layer sheer and heavy curtains for light control and privacy.",
                  },
                  {
                    title: "Blinds:",
                    description:
                      "Roller or Roman blinds suit modern, compact rooms.",
                  },
                  {
                    title: "Curtain cost guide:",
                    description:
                      "Around ₹8,000 to ₹25,000 per window for good fabrics and rails.",
                  },
                  {
                    title: "Cushions and throws:",
                    description:
                      "Easy, low-cost ways to refresh colours through the seasons.",
                  },
                  {
                    title: "Plants:",
                    description:
                      "Indoor plants bring life, but choose varieties suited to your light levels.",
                  },
                ]}
              />
            </section>

            <section>
              <SectionTitle>Storage Solutions for Living Rooms</SectionTitle>
              <BulletList items={storageSolutions} />
            </section>

            <section>
              <SectionTitle>Vastu Tips for Living Room Design</SectionTitle>
              <BulletList
                items={[
                  {
                    title: "Preferred direction:",
                    description:
                      "Many people prefer the north, north-east or east for the living room.",
                  },
                  {
                    title: "Seating position:",
                    description:
                      "Heavier furniture is traditionally placed toward the south or west side of the room.",
                  },
                  {
                    title: "TV placement:",
                    description:
                      "Some people prefer the TV toward the south-east area.",
                  },
                  {
                    title: "Colours:",
                    description:
                      "Light, soothing shades are often preferred.",
                  },
                  {
                    title: "Entrance:",
                    description:
                      "Keep the entrance area bright, clean and clutter-free.",
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
              <SectionTitle>Living Room Interior Cost in Moradabad</SectionTitle>
              <BulletList
                items={[
                  {
                    title: "Typical range:",
                    description:
                      "A living room interior in Moradabad commonly ranges from about ₹60,000 to ₹2.5 lakh, depending on size, materials and design level.",
                  },
                  {
                    title: "Main cost drivers:",
                    description:
                      "TV wall design, false ceiling, lighting, paneling, storage units and finish quality.",
                  },
                  {
                    title: "Economy design:",
                    description:
                      "Laminate finishes, a simple ceiling and standard lighting keep the cost lower.",
                  },
                  {
                    title: "Premium design:",
                    description:
                      "Veneer, fluted panels, layered ceilings, designer lights and custom units raise the budget.",
                  },
                  {
                    title: "Where to spend:",
                    description:
                      "The TV wall, ceiling and lighting, since they define the room&apos;s look.",
                  },
                  {
                    title: "Where to save:",
                    description:
                      "Use paint or textured finishes instead of expensive stone panels, and keep furniture simple.",
                  },
                  {
                    title: "What may be extra:",
                    description:
                      "Civil changes, new electrical points, loose furniture, curtains and appliances.",
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
                How MT Boss Designs Your Living Room: Step by Step
              </SectionTitle>

              <div className="space-y-5">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Step 1: Consultation
                  </h4>
                  <p>
                    Share how you use the living room, your family size, style
                    preferences and budget.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Step 2: Site Visit and Measurement
                  </h4>
                  <BulletList
                    items={[
                      "We measure the room, windows, doors, beams and electrical points.",
                      "We check walls for damp or cracks that need repair.",
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Step 3: Layout and Concept
                  </h4>
                  <BulletList
                    items={[
                      "We prepare layouts showing seating, TV wall, storage and walkways.",
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
                      "We suggest boards, panels, paints, flooring and lighting at different budgets.",
                      "You approve final choices before work begins.",
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Step 5: 3D Visualisation
                  </h4>
                  <p>
                    3D views help you see the finished room and request changes
                    early.
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
                    Wall repairs, electrical changes, ceiling framework and
                    paint preparation come first.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Step 8: Carpentry, Ceiling and Finishing
                  </h4>
                  <p>
                    TV units, storage, paneling, ceilings, painting and lighting
                    are installed in the correct order.
                  </p>
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
                    For small repairs, you can use our{" "}
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
                Why Choose MT Boss as Your Living Room Interior Designer in
                Moradabad
              </SectionTitle>

              <BulletList
                items={[
                  {
                    title: "Construction-backed knowledge:",
                    description:
                      "We understand walls, wiring, ventilation and finishing, not only styling.",
                  },
                  {
                    title: "Transparent pricing:",
                    description:
                      "Clear scope and itemised quotes help avoid surprises.",
                  },
                  {
                    title: "Custom design:",
                    description:
                      "Living rooms are planned around your space and lifestyle, not copied from a template.",
                  },
                  {
                    title: "Quality materials:",
                    description:
                      "We guide you on boards, panels, paints and finishes suited to local conditions.",
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
              <SectionTitle>
                Common Living Room Design Mistakes to Avoid
              </SectionTitle>
              <BulletList items={commonMistakes} />
            </section>

            <section>
              <SectionTitle>Living Room Maintenance Tips</SectionTitle>
              <BulletList
                items={[
                  {
                    title: "Dust regularly:",
                    description:
                      "Wipe surfaces and TV units with a soft, dry or slightly damp cloth.",
                  },
                  {
                    title: "Use mild cleaners:",
                    description:
                      "Harsh chemicals can dull laminates, paints and panels.",
                  },
                  {
                    title: "Protect from moisture:",
                    description:
                      "Keep furniture slightly away from damp walls and fix leaks early.",
                  },
                  {
                    title: "Clean fabrics:",
                    description:
                      "Vacuum sofas and wash cushion covers and curtains regularly.",
                  },
                  {
                    title: "Check lights:",
                    description:
                      "Replace faulty bulbs and loose switches early.",
                  },
                  {
                    title: "Avoid overloading shelves:",
                    description:
                      "Heavy loads can bend boards.",
                  },
                  {
                    title: "Ventilate:",
                    description:
                      "Open windows daily to keep the air fresh.",
                  },
                  {
                    title: "Touch up paint:",
                    description:
                      "Small repairs prevent larger damage.",
                  },
                ]}
              />
            </section>

            <section>
              <SectionTitle>
                Living Room Design Trends in Moradabad for 2026
              </SectionTitle>
              <BulletList
                items={[
                  {
                    title: "Warm neutral palettes:",
                    description:
                      "Beige, cream, olive and earthy tones.",
                  },
                  {
                    title: "Fluted and textured TV walls:",
                    description:
                      "A strong focal point with depth.",
                  },
                  {
                    title: "Layered lighting:",
                    description:
                      "Cove lights, spotlights and accent lamps for a warm, premium feel.",
                  },
                  {
                    title: "Curved furniture:",
                    description:
                      "Rounded sofas and tables soften the room.",
                  },
                  {
                    title: "Brass and metal accents:",
                    description:
                      "Lamps, wall art and décor that reflect Moradabad&apos;s brass heritage.",
                  },
                  {
                    title: "Multi-purpose spaces:",
                    description:
                      "A living room that includes a small work or study corner.",
                  },
                  {
                    title: "Natural materials:",
                    description:
                      "Wood tones, cane, stone textures and indoor plants.",
                  },
                  {
                    title: "Clutter-free design:",
                    description:
                      "Closed storage and clean lines for a calmer look.",
                  },
                ]}
              />
            </section>

            <section>
              <SectionTitle>
                Contact MT Boss for Your Living Room Project
              </SectionTitle>

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
                    Q1. What does a living room interior designer do?
                  </h4>
                  <p className="mt-1">
                    A living room interior designer plans the layout, seating,
                    TV wall, storage, lighting and finishes so the room is
                    comfortable and functional.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q2. How much does living room interior design cost in
                    Moradabad?
                  </h4>
                  <p className="mt-1">
                    It generally ranges from about ₹60,000 to ₹2.5 lakh,
                    depending on the room size, materials and design level.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q3. What is the best TV wall design?
                  </h4>
                  <p className="mt-1">
                    Fluted panels, wooden slats and veneer paneling are popular.
                    The best choice depends on your room, preferred style and
                    budget.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q4. Which false ceiling suits a living room?
                  </h4>
                  <p className="mt-1">
                    A peripheral or cove ceiling is simple and elegant. Layered
                    ceilings generally suit larger rooms.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q5. How can I make a small living room look bigger?
                  </h4>
                  <p className="mt-1">
                    Use light colours, compact furniture, wall-mounted units and
                    good lighting.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q6. Can you design according to Vastu?
                  </h4>
                  <p className="mt-1">
                    Yes. Share your Vastu preferences at the beginning, and we
                    will adapt the layout within your building&apos;s practical
                    limitations.
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
                    Yes. We coordinate electrical points, false ceiling,
                    painting and furniture as part of the project.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q9. Does the quote include the sofa and loose furniture?
                  </h4>
                  <p className="mt-1">
                    Usually, fixed carpentry is included. Sofas and loose
                    furniture are priced separately unless specifically agreed
                    in the quotation.
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
