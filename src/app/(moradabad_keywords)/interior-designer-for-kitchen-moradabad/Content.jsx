
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
  const kitchenDesignerRoles = [
    {
      title: "Studies your cooking habits:",
      description:
        "Daily Indian cooking, such as frying, tempering, rolling rotis and heavy masala use, needs different planning than occasional cooking.",
    },
    {
      title: "Plans the layout:",
      description:
        "The designer decides where the sink, hob, refrigerator, chimney, storage and counters go, so movement is smooth and safe.",
    },
    {
      title: "Selects materials:",
      description:
        "Cabinet boards, shutters, countertops, backsplash tiles and hardware are chosen for your budget and kitchen conditions.",
    },
    {
      title: "Designs storage:",
      description:
        "Drawers, tall units, corner solutions, pull-outs and overhead cabinets are planned around what you actually store.",
    },
    {
      title: "Coordinates services:",
      description:
        "Plumbing, electrical points, gas line, exhaust and lighting must be planned before carpentry starts.",
    },
    {
      title: "Manages execution:",
      description:
        "Skilled carpenters and technicians must work in the correct order for a clean, long-lasting result.",
    },
    {
      title: "Checks quality:",
      description:
        "Alignment, finish, water resistance and hardware operation should be checked before handover.",
    },
  ];

  const specialCarePoints = [
    {
      title: "Heat and steam:",
      description:
        "Kitchens face high temperatures and moisture every day, which can damage weak boards and cheap finishes.",
    },
    {
      title: "Oil and grease:",
      description:
        "Surfaces must be easy to clean, or they quickly look old and sticky.",
    },
    {
      title: "Water exposure:",
      description:
        "The area around the sink needs moisture-resistant materials and proper sealing.",
    },
    {
      title: "Heavy use:",
      description:
        "Doors and drawers open and close hundreds of times a month, so hardware quality matters greatly.",
    },
    {
      title: "Safety:",
      description:
        "Gas, electricity and water are all present in one room, so wiring, ventilation and layout must be safe.",
    },
    {
      title: "Ergonomics:",
      description:
        "Counter height, reach distance and walking space affect comfort, especially for people who cook for long hours.",
    },
    {
      title: "Resale value:",
      description:
        "A good kitchen often becomes a strong selling point for the property.",
    },
  ];

  const storagePoints = [
    {
      title: "Base cabinets:",
      description:
        "Deep drawers for utensils, pots, pans and appliances are easier to use than shelves with doors.",
    },
    {
      title: "Wall cabinets:",
      description:
        "Keep daily items within reach, and store rarely used items higher up.",
    },
    {
      title: "Tall units:",
      description:
        "Perfect for pantry storage, grains, oils, cereals and packaged goods.",
    },
    {
      title: "Corner units:",
      description:
        "Carousel or magic-corner systems avoid dead space.",
    },
    {
      title: "Masala and spice storage:",
      description:
        "Pull-out racks near the hob keep spices handy and neat.",
    },
    {
      title: "Thali and plate storage:",
      description: "Dedicated racks reduce clutter.",
    },
    {
      title: "Appliance garage:",
      description:
        "Hidden space for a mixer, toaster and coffee maker keeps counters clear.",
    },
    {
      title: "Bulk storage:",
      description:
        "Plan space for large containers, a gas cylinder and a water can if needed.",
    },
    {
      title: "Trash management:",
      description:
        "A built-in dustbin cabinet with separate wet and dry bins keeps the kitchen tidy.",
    },
  ];

  const appliancePoints = [
    {
      title: "Chimney:",
      description:
        "Choose the right suction power and size for your hob and cooking style. Heavy frying needs a stronger unit.",
    },
    {
      title: "Hob:",
      description:
        "Decide between a gas hob, induction or a combination, and plan the gas line and power supply.",
    },
    {
      title: "Refrigerator:",
      description:
        "Leave enough ventilation space and easy door-opening clearance.",
    },
    {
      title: "Microwave and oven:",
      description:
        "Plan a built-in tall unit or a dedicated shelf with proper ventilation.",
    },
    {
      title: "Dishwasher:",
      description:
        "It requires plumbing, drainage and power, so it must be planned at the design stage.",
    },
    {
      title: "Water purifier:",
      description:
        "Plan a plumbing connection and power point within the sink area.",
    },
    {
      title: "Electrical points:",
      description:
        "Keep enough sockets at counter level for a mixer, kettle, toaster and other devices.",
    },
    {
      title: "Plumbing coordination:",
      description:
        "Proper slope and drainage prevent leaks and blockages.",
    },
  ];

  const mtBossBenefits = [
    {
      title: "Construction-backed knowledge:",
      description:
        "We understand plumbing, electrical points, walls and ventilation, not only cabinet styling.",
    },
    {
      title: "Transparent pricing:",
      description:
        "Clear scope and itemised quotes help you avoid surprises.",
    },
    {
      title: "Custom design:",
      description:
        "Kitchens are designed around your space and habits, rather than copied from a template.",
    },
    {
      title: "Material guidance:",
      description:
        "We help you choose the right boards, finishes and hardware for Moradabad&apos;s climate and your cooking style.",
    },
    {
      title: "Access to materials:",
      description:
        "Our supplier network helps us source materials at competitive prices.",
    },
    {
      title: "Verified professionals:",
      description:
        "Our network covers carpentry, plumbing, electrical work and painting.",
    },
    {
      title: "One responsible partner:",
      description:
        "Design, execution and coordination are handled together.",
    },
    {
      title: "Clear communication:",
      description:
        "You can reach us through phone, WhatsApp, email and website forms.",
    },
    {
      title: "Homes and commercial spaces:",
      description:
        "We can design kitchens for flats, villas, cafés, restaurants and canteens.",
    },
  ];

  const commonMistakes = [
    {
      title: "Ignoring the work triangle:",
      description:
        "Placing the sink, hob and fridge too far apart wastes energy and time.",
    },
    {
      title: "Choosing weak boards:",
      description:
        "Low-grade boards swell near water and lose their shape.",
    },
    {
      title: "Skipping soft-close hardware:",
      description:
        "Cheap hinges break quickly and become irritating in daily use.",
    },
    {
      title: "Too few sockets:",
      description:
        "Adding extension boards later looks messy and can be unsafe.",
    },
    {
      title: "Poor ventilation:",
      description:
        "A weak chimney or blocked window causes smoke, smell and oily walls.",
    },
    {
      title: "Wrong countertop for Indian cooking:",
      description:
        "Light marble can stain easily with oil, turmeric and spices.",
    },
    {
      title: "Not enough storage:",
      description:
        "A stylish kitchen without storage becomes cluttered quickly.",
    },
    {
      title: "Bad lighting:",
      description:
        "A single ceiling light leaves shadows over the counter.",
    },
    {
      title: "Overlooking the floor:",
      description:
        "Slippery tiles are dangerous in a wet and oily kitchen.",
    },
    {
      title: "Deciding appliances late:",
      description:
        "Changing appliance sizes after carpentry causes delays and extra cost.",
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-0">
      <div className="flex flex-col lg:flex-row">
        {/* Content Section */}
        <div className="flex-1 px-4 sm:px-8 md:px-16 py-12 order-1 lg:order-1">
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-8 text-gray-900">
            Interior Designer for Kitchen in Moradabad: Smart, Durable and
            Beautiful Kitchens by MT Boss
          </h2>

          <div className="space-y-6 text-gray-700 leading-relaxed max-w-4xl">
            <section>
              <p>
                The kitchen is the busiest and hardest-working room in your
                home. A well-designed kitchen saves time, reduces effort and
                makes cooking enjoyable.
              </p>

              <p className="mt-3">
                A poorly planned kitchen, on the other hand, can mean wasted
                steps, cluttered counters, weak hinges, leaks and constant
                repairs.
              </p>

              <p className="mt-3">
                MT Boss, also known as MTBOSS Construction Private Limited, is
                a Moradabad-based construction and interiors company. We plan
                kitchens with both the design side and the building side in
                mind.
              </p>

              <p className="mt-3">
                Because we understand plumbing lines, electrical loads,
                ventilation and wall structure, our kitchen designs are
                practical as well as attractive.
              </p>

              <p className="mt-3">
                Whether you are building a new home, renovating an old kitchen
                or setting up a commercial kitchen, this guide explains what
                you should know before hiring a kitchen interior designer in
                Moradabad. You will learn about layouts, materials, storage,
                appliances, lighting, Vastu, budget planning and how MT Boss
                handles the process from start to finish.
              </p>
            </section>

            <section>
              <SectionTitle>What a Kitchen Interior Designer Does</SectionTitle>
              <BulletList items={kitchenDesignerRoles} />
            </section>

            <section>
              <SectionTitle>Why Kitchen Design Needs Special Care</SectionTitle>
              <BulletList items={specialCarePoints} />
            </section>

            <section>
              <SectionTitle>Popular Modular Kitchen Layouts We Design</SectionTitle>

              <div className="space-y-5">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Straight Kitchen
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Best for:",
                        description: "Small flats, narrow spaces and single-wall setups.",
                      },
                      {
                        title: "Pros:",
                        description: "Simple, economical and easy to install.",
                      },
                      {
                        title: "Limitations:",
                        description:
                          "Less counter and storage space, with a longer walking distance between work zones.",
                      },
                      {
                        title: "Tip:",
                        description:
                          "Add tall units and wall cabinets to gain more storage.",
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    L-Shaped Kitchen
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Best for:",
                        description: "Most 2BHK and 3BHK homes in Moradabad.",
                      },
                      {
                        title: "Pros:",
                        description:
                          "Efficient work triangle, good counter space and easy space for a small dining nook.",
                      },
                      {
                        title: "Limitations:",
                        description:
                          "The corner needs a smart solution to avoid wasted space.",
                      },
                      {
                        title: "Tip:",
                        description:
                          "Use a corner carousel or magic-corner unit.",
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    U-Shaped Kitchen
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Best for:",
                        description: "Medium to large kitchens.",
                      },
                      {
                        title: "Pros:",
                        description:
                          "Maximum storage and counter space, with all zones within easy reach.",
                      },
                      {
                        title: "Limitations:",
                        description:
                          "It needs enough width, otherwise it can feel tight.",
                      },
                      {
                        title: "Tip:",
                        description:
                          "Keep a comfortable walking gap between the two parallel sides.",
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Parallel or Galley Kitchen
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Best for:",
                        description:
                          "Long, narrow rooms with two facing walls.",
                      },
                      {
                        title: "Pros:",
                        description:
                          "Very efficient, with cooking on one side and prep or storage on the other.",
                      },
                      {
                        title: "Limitations:",
                        description:
                          "It can feel closed in if the walkway is narrow.",
                      },
                      {
                        title: "Tip:",
                        description:
                          "Use light colours and good lighting to keep the space open.",
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Island and Peninsula Kitchen
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Best for:",
                        description:
                          "Large homes, villas and open-plan layouts.",
                      },
                      {
                        title: "Pros:",
                        description:
                          "Extra prep space, casual seating and a strong design statement.",
                      },
                      {
                        title: "Limitations:",
                        description:
                          "It needs generous floor area, and services under the island add cost.",
                      },
                      {
                        title: "Tip:",
                        description:
                          "Plan electrical and plumbing points early if the island includes a sink or hob.",
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Open Kitchen
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Best for:",
                        description:
                          "Modern flats and homes where the kitchen connects with the living or dining area.",
                      },
                      {
                        title: "Pros:",
                        description: "Social, spacious and bright.",
                      },
                      {
                        title: "Limitations:",
                        description:
                          "Smoke and smell can reach other rooms, so a strong chimney is important.",
                      },
                      {
                        title: "Tip:",
                        description:
                          "Choose easy-clean finishes and a powerful, well-fitted chimney.",
                      },
                    ]}
                  />
                </div>
              </div>
            </section>

            <section>
              <SectionTitle>
                Kitchen Materials: What Works Best in Moradabad Homes
              </SectionTitle>

              <div className="space-y-5">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Cabinet Carcass or Body
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Marine plywood or BWP plywood:",
                        description:
                          "Best for moisture resistance, especially near the sink and in humid months.",
                      },
                      {
                        title: "BWR plywood:",
                        description:
                          "A balanced option for most kitchen units.",
                      },
                      {
                        title: "HDHMR board:",
                        description:
                          "A dense, moisture-resistant board suited to modern designs and smooth finishes.",
                      },
                      {
                        title: "MR plywood or particle board:",
                        description:
                          "Cheaper options, but not ideal for wet areas.",
                      },
                    ]}
                  />
                  <p className="mt-3">
                    <strong>Tip:</strong> Use water-resistant boards for sink
                    and base units, even if you choose a more economical board
                    elsewhere.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Shutter Finishes
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Laminate:",
                        description:
                          "Affordable, available in many colours and easy to maintain.",
                      },
                      {
                        title: "Acrylic:",
                        description:
                          "Glossy, modern and easy to wipe, but it needs careful handling to avoid scratches.",
                      },
                      {
                        title: "PU finish:",
                        description:
                          "A premium look and smooth feel at a higher cost.",
                      },
                      {
                        title: "Membrane or PVC finish:",
                        description:
                          "Good for curved profiles and a seamless look.",
                      },
                      {
                        title: "Glass or aluminium-frame shutters:",
                        description:
                          "Stylish for wall cabinets and display units.",
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Countertops
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Granite:",
                        description:
                          "Strong, heat-resistant and popular for Indian cooking.",
                      },
                      {
                        title: "Quartz:",
                        description:
                          "Non-porous, stain-resistant and available in modern designs.",
                      },
                      {
                        title: "Engineered stone:",
                        description:
                          "A good option for consistent patterns.",
                      },
                      {
                        title: "Marble:",
                        description:
                          "Beautiful, but it can stain from oil, lemon and turmeric.",
                      },
                      {
                        title: "Stainless steel:",
                        description:
                          "Hygienic and durable, commonly used in commercial kitchens.",
                      },
                    ]}
                  />
                  <p className="mt-3">
                    <strong>Tip:</strong> For heavy Indian cooking, granite and
                    quartz are generally safer choices.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Backsplash and Wall Tiles
                  </h4>
                  <BulletList
                    items={[
                      {
                        title: "Ceramic or vitrified tiles:",
                        description:
                          "Easy to clean and available in many designs.",
                      },
                      {
                        title: "Glass backsplash:",
                        description: "Sleek and simple to wipe.",
                      },
                      {
                        title: "Tempered glass panels:",
                        description:
                          "Good behind the hob for easy cleaning.",
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
                        title: "Hinges and channels:",
                        description:
                          "Soft-close, good-quality hinges and drawer channels last longer and feel smoother.",
                      },
                      {
                        title: "Baskets and pull-outs:",
                        description:
                          "Cutlery trays, thali baskets, bottle pull-outs and plate racks improve organisation.",
                      },
                      {
                        title: "Tall units and corner solutions:",
                        description:
                          "They make full use of vertical and awkward spaces.",
                      },
                      {
                        title: "Handles or handleless profiles:",
                        description:
                          "Choose durable finishes that resist rust and wear.",
                      },
                    ]}
                  />
                  <p className="mt-3">
                    <strong>Tip:</strong> Spend more on hardware rather than
                    decoration because you use it every day.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <SectionTitle>Storage Planning for Indian Kitchens</SectionTitle>
              <BulletList items={storagePoints} />
            </section>

            <section>
              <SectionTitle>
                Appliances and Utilities: Plan Before You Build
              </SectionTitle>
              <BulletList items={appliancePoints} />
              <p className="mt-4">
                Our{" "}
                <a
                  href="https://www.mtboss.in/quick"
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Quick Home Services
                </a>{" "}
                can assist with electrical and plumbing tasks.
              </p>
            </section>

            <section>
              <SectionTitle>Kitchen Lighting and Ventilation</SectionTitle>
              <BulletList
                items={[
                  {
                    title: "General lighting:",
                    description:
                      "Bright ceiling lights provide even illumination across the room.",
                  },
                  {
                    title: "Task lighting:",
                    description:
                      "Under-cabinet LED strips light the counter where you chop and prepare food.",
                  },
                  {
                    title: "Accent lighting:",
                    description:
                      "Soft lights inside glass cabinets or above an island add style.",
                  },
                  {
                    title: "Natural light:",
                    description:
                      "Use windows wisely and avoid blocking them with tall cabinets.",
                  },
                  {
                    title: "Exhaust and chimney:",
                    description:
                      "Good airflow removes smoke, heat and smell.",
                  },
                  {
                    title: "Window ventilation:",
                    description:
                      "Cross-ventilation keeps the kitchen fresh and reduces moisture.",
                  },
                  {
                    title: "Warm versus cool light:",
                    description:
                      "Warm-white lights feel welcoming, while neutral-white light suits work areas.",
                  },
                ]}
              />
            </section>

            <section>
              <SectionTitle>Vastu Tips for Kitchen Design</SectionTitle>
              <BulletList
                items={[
                  {
                    title: "Preferred direction:",
                    description:
                      "Many people prefer the south-east direction for the kitchen because it is linked to the fire element.",
                  },
                  {
                    title: "Cooking direction:",
                    description:
                      "Some people prefer to face east while cooking.",
                  },
                  {
                    title: "Sink and stove separation:",
                    description:
                      "Traditional Vastu suggests keeping water and fire elements apart.",
                  },
                  {
                    title: "Colour choices:",
                    description:
                      "Warm, light shades are often preferred for kitchens.",
                  },
                  {
                    title: "Practical balance:",
                    description:
                      "Not every home can follow every rule, so we adapt layouts within your building&apos;s structure.",
                  },
                ]}
              />
              <p className="mt-4">
                Learn more in our{" "}
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
              <SectionTitle>Kitchen Design Cost Planning in Moradabad</SectionTitle>
              <BulletList
                items={[
                  {
                    title: "Typical range:",
                    description:
                      "A modular kitchen in Moradabad usually falls between ₹70,000 and ₹3.5 lakh, depending on size, layout, materials and appliances.",
                  },
                  {
                    title: "Main cost drivers:",
                    description:
                      "Board quality, shutter finish, countertop material, hardware brand, tall units and custom features.",
                  },
                  {
                    title: "Layout impact:",
                    description:
                      "Straight kitchens cost less, while U-shaped and island kitchens need more material.",
                  },
                  {
                    title: "Finish impact:",
                    description:
                      "Laminate is the most economical, while acrylic and PU finishes cost more.",
                  },
                  {
                    title: "Appliances:",
                    description:
                      "Chimney, hob, oven and dishwasher are often separate from the base price.",
                  },
                  {
                    title: "Where to spend:",
                    description:
                      "Hardware, water-resistant boards and countertops.",
                  },
                  {
                    title: "Where to save:",
                    description:
                      "Simple handle styles, standard sizes and laminate shutters in low-use areas.",
                  },
                  {
                    title: "Get an itemised quote:",
                    description:
                      "Ask for material grades, brands and hardware details in writing.",
                  },
                ]}
              />

              <p className="mt-4">
                Use our{" "}
                <a
                  href="https://www.mtboss.in/calculator"
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Budget Calculator
                </a>{" "}
                and read the{" "}
                <a
                  href="https://www.mtboss.in/blog/house-construction-cost-estimation-guide-india-2026"
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  house construction cost estimation guide
                </a>{" "}
                for wider planning.
              </p>
            </section>

            <section>
              <SectionTitle>
                How MT Boss Designs Your Kitchen: Step by Step
              </SectionTitle>

              <div className="space-y-5">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Step 1: Consultation
                  </h4>
                  <BulletList
                    items={[
                      "Tell us how you cook, how many people use the kitchen and your storage needs.",
                      "Share your preferred style and budget range.",
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Step 2: Site Visit and Measurement
                  </h4>
                  <BulletList
                    items={[
                      "We measure the room accurately and note windows, doors, beams, plumbing and electrical points.",
                      "We check wall condition, floor level and ventilation options.",
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Step 3: Layout and Concept
                  </h4>
                  <BulletList
                    items={[
                      "We prepare layout options showing the work triangle, counters and storage.",
                      "You see how the kitchen will function before any finish is selected.",
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Step 4: Material and Colour Selection
                  </h4>
                  <BulletList
                    items={[
                      "We suggest boards, shutters, countertops, tiles and hardware at different budgets.",
                      "Samples help you choose with confidence.",
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Step 5: 3D Visualisation
                  </h4>
                  <p>
                    3D views let you see the final look and request changes
                    before work begins.
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
                    Step 7: Civil, Electrical and Plumbing Preparation
                  </h4>
                  <BulletList
                    items={[
                      "Wall repairs, tiling, plumbing, gas line, exhaust and electrical points are completed first.",
                      "Proper preparation prevents rework after installation.",
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Step 8: Carpentry and Installation
                  </h4>
                  <BulletList
                    items={[
                      "Cabinets, shutters, countertop and accessories are fitted by skilled workers.",
                      "Supervisors check alignment, levels and finish.",
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Step 9: Final Inspection and Handover
                  </h4>
                  <BulletList
                    items={[
                      "We test drawers, hinges, lights, water flow and drainage.",
                      "Any snags are corrected and the kitchen is cleaned before handover.",
                    ]}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Step 10: After-Service Support
                  </h4>
                  <p>
                    For small repairs and adjustments, you can reach us by
                    phone or WhatsApp.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <SectionTitle>
                Why Choose MT Boss as Your Kitchen Interior Designer in
                Moradabad
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
                </a>
                , find tradespeople through our{" "}
                <a
                  href="https://www.mtboss.in/Services/professionals"
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  professionals network
                </a>
                , and view completed work in our{" "}
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
              <SectionTitle>Common Kitchen Design Mistakes to Avoid</SectionTitle>
              <BulletList items={commonMistakes} />
            </section>

            <section>
              <SectionTitle>Kitchen Maintenance Tips</SectionTitle>
              <BulletList
                items={[
                  {
                    title: "Wipe spills quickly:",
                    description:
                      "Oil and water left for a long time can stain or damage the finish.",
                  },
                  {
                    title: "Use mild cleaners:",
                    description:
                      "Harsh chemicals can dull laminate, acrylic and PU surfaces.",
                  },
                  {
                    title: "Clean the chimney filter regularly:",
                    description:
                      "This keeps suction strong and reduces grease buildup.",
                  },
                  {
                    title: "Check the sink area:",
                    description:
                      "Look for leaks and swelling in base cabinets.",
                  },
                  {
                    title: "Avoid dragging heavy items:",
                    description:
                      "This prevents scratches on countertops and shutters.",
                  },
                  {
                    title: "Keep drawers balanced:",
                    description:
                      "Do not overload a drawer beyond its recommended weight.",
                  },
                  {
                    title: "Air out the kitchen:",
                    description:
                      "Open windows or use the exhaust after cooking to reduce moisture.",
                  },
                  {
                    title: "Service appliances:",
                    description:
                      "Regular servicing extends the life of your chimney, hob and other equipment.",
                  },
                ]}
              />
            </section>

            <section>
              <SectionTitle>Kitchen Design Trends in Moradabad for 2026</SectionTitle>
              <BulletList
                items={[
                  {
                    title: "Two-tone kitchens:",
                    description:
                      "Combining a light and dark shade for a modern, balanced look.",
                  },
                  {
                    title: "Handleless cabinets:",
                    description:
                      "Clean profiles that look sleek and are easy to wipe.",
                  },
                  {
                    title: "Warm neutrals and earthy tones:",
                    description:
                      "Beige, olive, sage and terracotta shades.",
                  },
                  {
                    title: "Matt finishes:",
                    description:
                      "Fingerprint-resistant surfaces that look premium.",
                  },
                  {
                    title: "Open shelves with closed storage:",
                    description:
                      "A mix of display and practical storage.",
                  },
                  {
                    title: "Brass and metal accents:",
                    description:
                      "A subtle nod to Moradabad&apos;s brassware heritage.",
                  },
                  {
                    title: "Smart storage:",
                    description:
                      "Pull-out pantries, tall units and organised drawers.",
                  },
                  {
                    title: "Under-cabinet lighting:",
                    description:
                      "Practical and stylish task lighting.",
                  },
                  {
                    title: "Breakfast counters:",
                    description:
                      "Compact seating for quick meals in small homes.",
                  },
                ]}
              />
            </section>

            <section>
              <SectionTitle>Contact MT Boss for Your Kitchen Project</SectionTitle>
              <p className="mb-3">
                Share kitchen photos or measurements, your preferred layout,
                style and budget. You will receive a clear discussion, a site
                visit and an itemised quote.
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
                    Q1. What does a kitchen interior designer do?
                  </h4>
                  <p className="mt-1">
                    A kitchen interior designer plans the layout, storage,
                    materials, lighting and services, then coordinates the work
                    so the kitchen is functional and attractive.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q2. Which kitchen layout is best for a small flat?
                  </h4>
                  <p className="mt-1">
                    Straight or L-shaped kitchen layouts usually work best in
                    compact spaces.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q3. What is the cost of a modular kitchen in Moradabad?
                  </h4>
                  <p className="mt-1">
                    It generally ranges from ₹70,000 to ₹3.5 lakh, depending on
                    kitchen size, materials, layout, hardware and appliances.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q4. Which material is best for kitchen cabinets?
                  </h4>
                  <p className="mt-1">
                    Marine or BWP plywood and HDHMR boards resist moisture
                    well, especially in sink and base-cabinet areas.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q5. Which countertop suits Indian cooking?
                  </h4>
                  <p className="mt-1">
                    Granite and quartz usually handle heat, oil and spices
                    better than marble.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q6. Can you follow Vastu rules for my kitchen?
                  </h4>
                  <p className="mt-1">
                    Yes. Share your Vastu preferences at the beginning, and we
                    will adapt the layout within your building&apos;s practical
                    limitations.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q7. Do you handle plumbing and electrical work too?
                  </h4>
                  <p className="mt-1">
                    Yes. We coordinate plumbing, electrical points, gas lines
                    and exhaust planning as part of the kitchen project.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q8. Can I see the design before work starts?
                  </h4>
                  <p className="mt-1">
                    Yes. Layouts and 3D visuals are shared for your approval
                    before execution begins.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    Q9. Do you design commercial kitchens?
                  </h4>
                  <p className="mt-1">
                    Yes. We can plan kitchens for cafés, restaurants, canteens
                    and other commercial spaces.
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