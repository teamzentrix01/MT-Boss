import LandingEnquiry from "../../components/LandingEnquiry";
const Content = () => {
  const modularBenefits = [
    "Faster installation: most components are prepared beforehand, so on-site work is shorter.",
    "Cleaner finish: precise cutting means neat joints, even gaps and smooth edges.",
    "Less mess: much less sawing and dust inside your home compared to carpentry done fully on site.",
    "Space efficiency: smart drawers, corner units and lofts use every inch.",
    "Easy maintenance: wipe-clean surfaces and replaceable parts.",
    "Better consistency: every shutter and panel matches in size and finish.",
    "Flexibility: you can add or replace modules as your needs change.",
    "Value for money: less wastage and planned material use help control the budget.",
  ];

  const modularServices = [
    {
      title: "Modular Kitchen Design",
      items: [
        "Layouts in straight, L-shaped, U-shaped, parallel and island styles.",
        "Base units, wall units, tall units, corner units and pull-out organisers.",
        "Storage for cutlery, utensils, spices, groceries, cylinders and appliances.",
        "Smart placement of the sink, hob, chimney and refrigerator to follow the working triangle.",
        "Moisture-resistant materials and easy-to-clean countertops.",
        "Options for open, semi-open and closed kitchens.",
      ],
    },
    {
      title: "Modular Wardrobes",
      items: [
        "Sliding, hinged and walk-in wardrobe designs.",
        "Internal layouts with hanging space, drawers, shelves, shoe racks and tie or belt holders.",
        "Loft units for seasonal items and suitcases.",
        "Full-height mirror shutters and dressing units.",
        "Soft-close mechanisms for smooth, quiet use.",
      ],
    },
    {
      title: "Modular TV Units and Living Room Panels",
      items: [
        "Wall-mounted, floor-standing and floating TV units.",
        "Storage for media devices, books, décor and remote items.",
        "Cable management to hide wires neatly.",
        "Back panels, fluted panels and lighting to add style.",
      ],
    },
    {
      title: "Modular Bedroom Furniture",
      items: [
        "Beds with headboards, side tables and storage boxes.",
        "Dressing tables with mirrors and drawers.",
        "Study and work corners inside bedrooms.",
        "Kids' room furniture with safe edges and playful colours.",
      ],
    },
    {
      title: "Modular Crockery and Bar Units",
      items: [
        "Glass-front cabinets, display shelves and closed storage.",
        "Lighting to highlight crockery and décor items.",
        "Compact bar units for homes that like to entertain.",
      ],
    },
    {
      title: "Modular Pooja Units",
      items: [
        "Wall-mounted and floor units with cabinets and drawers.",
        "Space for idols, lamps, books and pooja items.",
        "Simple, peaceful designs with warm lighting.",
      ],
    },
    {
      title: "Modular Study and Home Office Units",
      items: [
        "Study tables with overhead shelves and drawers.",
        "Ergonomic layouts for students and remote workers.",
        "Space for laptops, books, printers and cables.",
      ],
    },
    {
      title: "Modular Bathroom Vanities and Storage",
      items: [
        "Moisture-resistant vanity cabinets with mirror units.",
        "Wall-mounted storage for toiletries and towels.",
        "Compact designs for small bathrooms.",
      ],
    },
    {
      title: "Modular Shoe Racks and Foyer Units",
      items: [
        "Closed and semi-open shoe cabinets with tilt-out or pull-out shelves.",
        "Seating benches with storage for hall and entry areas.",
        "Key holders, mirrors and utility shelves.",
      ],
    },
    {
      title: "Full Home Modular Packages",
      items: [
        "Coordinated modular design across the whole house.",
        "Matching colours, finishes and hardware in every room.",
        "A single team, a single quote and a single point of contact.",
      ],
    },
  ];

  const kitchenLayouts = [
    {
      title: "Straight Kitchen",
      items: [
        "Best for small flats and narrow spaces.",
        "All units are along one wall for a simple, economical design.",
      ],
    },
    {
      title: "L-Shaped Kitchen",
      items: [
        "Uses two adjacent walls and makes good use of the corner.",
        "Good for medium-sized kitchens and easy movement.",
      ],
    },
    {
      title: "U-Shaped Kitchen",
      items: [
        "Uses three walls for maximum storage and counter space.",
        "Ideal for larger kitchens and heavy cooking.",
      ],
    },
    {
      title: "Parallel Kitchen",
      items: [
        "Two facing counters with a walkway in between.",
        "Works well for long, narrow rooms and separates cooking and prep zones.",
      ],
    },
    {
      title: "Island Kitchen",
      items: [
        "A central counter for cooking, dining or extra storage.",
        "Suited to bigger, open-plan homes.",
      ],
    },
  ];

  const materials = [
    {
      title: "Core Boards",
      items: [
        "BWP or marine plywood: strong and moisture-resistant, ideal for kitchens and bathrooms.",
        "HDHMR boards: dense, moisture-resistant and stable for shutters and cabinets.",
        "MDF and particle board: budget-friendly choices for dry areas like living rooms and bedrooms.",
      ],
    },
    {
      title: "Shutter Finishes",
      items: [
        "Laminates: wide range of colours and textures with good durability.",
        "Acrylic: high-gloss, modern look that is easy to clean.",
        "PU and paint finishes: premium, smooth surfaces for a luxury look.",
        "Veneer: natural wood appearance for a classic feel.",
        "Membrane and vinyl: smooth wrap finishes for a seamless look.",
      ],
    },
    {
      title: "Countertops and Backsplashes",
      items: [
        "Granite, quartz and engineered stone for durable kitchen surfaces.",
        "Tile, glass or ceramic backsplashes to protect walls from oil and water.",
      ],
    },
    {
      title: "Hardware and Fittings",
      items: [
        "Soft-close hinges and drawer channels for smooth, quiet operation.",
        "Tandem boxes, pull-out baskets, corner carousels and bottle pull-outs.",
        "Sturdy handles, profile grooves and locks.",
      ],
    },
  ];

  const comparisonSections = [
    {
      title: "Installation Time",
      modular:
        "Components are prepared in advance, so on-site fitting is quicker.",
      traditional:
        "Most work is done on site, which takes longer and creates more dust.",
    },
    {
      title: "Finish and Accuracy",
      modular: "Uniform sizes, clean edges and tidy joints.",
      traditional:
        "Depends heavily on the carpenter's skill and can vary.",
    },
    {
      title: "Flexibility",
      modular: "Modules can be added, moved or replaced.",
      traditional: "Changes are harder once built.",
    },
    {
      title: "Cost",
      modular:
        "Often more predictable, and planned use of material reduces waste.",
      traditional: "Can suit unusual shapes and very custom designs.",
    },
  ];

  const processSteps = [
    {
      title: "Step 1: Consultation",
      items: [
        "We discuss your family needs, cooking habits, storage requirements and budget.",
        "You share your style ideas, colour preferences and reference photos.",
      ],
    },
    {
      title: "Step 2: Site Measurement",
      items: [
        "Exact measurements are taken of walls, corners, windows and services.",
        "We check plumbing, electrical points, ventilation and structural limits.",
      ],
    },
    {
      title: "Step 3: Design and Layout",
      items: [
        "We prepare a room-wise layout showing unit positions and storage plans.",
        "You review the design and suggest changes before anything is finalised.",
      ],
    },
    {
      title: "Step 4: Material and Finish Selection",
      items: [
        "We show board, shutter, hardware and countertop options at different price levels.",
        "You choose based on look, durability and budget.",
      ],
    },
    {
      title: "Step 5: Quotation and Approval",
      items: [
        "You receive a clear, itemised quote.",
        "Our Budget Calculator on the MT Boss website can give you an early estimate.",
      ],
    },
    {
      title: "Step 6: Preparation and Installation",
      items: [
        "Units are prepared to the approved dimensions.",
        "Installation is supervised for alignment, levelling and finish.",
        "Related work such as electrical points, plumbing and painting is coordinated.",
      ],
    },
    {
      title: "Step 7: Final Check and Handover",
      items: [
        "We check doors, drawers, hinges, lights and surfaces.",
        "Adjustments are made before handover, and we explain how to care for your new units.",
      ],
    },
  ];

  const whyChooseMtBoss = [
    "Construction know-how: we understand walls, plumbing, wiring and structure, which helps modular units fit correctly.",
    "One-team convenience: planning, materials, coordination and finishing come from a single company.",
    "Clear pricing: itemised quotes and simple explanations.",
    "Local service: based in Moradabad, so visits and follow-ups are easy.",
    "Material network: access to tiles, paints, cement and other essentials through the MT Boss shop.",
    "Flexible budgets: options from economy to premium.",
    "Timely delivery: realistic timelines with regular updates by call or WhatsApp.",
    "After-work support: we also provide electrician, plumber, painting, AC repair and pest control services.",
  ];

  const costFactors = [
    "Size and layout of the kitchen, wardrobe or room.",
    "Board type, such as BWP, HDHMR or MDF.",
    "Shutter finish, such as laminate, acrylic, PU or veneer.",
    "Hardware quality and number of accessories.",
    "Countertop material, appliances, chimney and hob.",
    "Special features like lighting, glass shutters or profile handles.",
    "Additional civil, tile, plumbing or electrical work.",
  ];

  const budgetTips = [
    "Set your top priorities. Kitchens and wardrobes usually deserve the highest quality.",
    "Use premium finishes on visible shutters and simpler ones inside.",
    "Invest in good hardware, since it is used every day.",
    "Finalise the design early to avoid changes and extra charges.",
    "Get an itemised quote so you can compare options fairly.",
    "Start with our Budget Calculator, then request a detailed quotation.",
  ];

  const modularDesignTips = [
    "Choose moisture-resistant boards for kitchens and bathrooms because of monsoon humidity.",
    "Plan storage first, then decide on colours and decoration.",
    "Use light shades in compact rooms to create a feeling of space.",
    "Keep the kitchen work triangle short between the sink, hob and refrigerator.",
    "Add proper lighting under wall units and inside wardrobes.",
    "Use vertical space with lofts and tall units in small homes.",
    "Select easy-to-clean finishes if you cook with oil and spices often.",
    "Ventilation matters, so fit a suitable chimney and keep airflow in mind.",
  ];

  const mistakesToAvoid = [
    "Choosing low-grade boards to save money in wet areas.",
    "Ignoring hardware quality and paying for it later in repairs.",
    "Not measuring appliances before finalising kitchen units.",
    "Overloading the design with too many colours or textures.",
    "Skipping lighting plans until the end.",
    "Forgetting to plan electrical and plumbing points early.",
    "Rushing decisions without seeing material samples.",
  ];

  const maintenanceTips = [
    "Wipe surfaces with a soft, slightly damp cloth and dry them.",
    "Avoid harsh chemicals and abrasive scrubbers on laminates and acrylic.",
    "Fix leaks under the sink quickly to protect base units.",
    "Do not overload drawers beyond their recommended capacity.",
    "Keep hinges and channels clean and free of dust.",
    "Ensure good ventilation in the kitchen to reduce oil and moisture build-up.",
  ];

  const beneficiaries = [
    "Families moving into a new flat or house.",
    "Homeowners renovating old kitchens and wardrobes.",
    "Builders and developers who need quick, consistent interiors.",
    "Landlords who want durable, attractive rental homes.",
    "Bungalow and villa owners looking for premium finishes.",
    "Working couples who want a fast, low-stress interior process.",
  ];

  const faqs = [
    {
      question:
        "Q1. Does MT Boss provide modular interior design in Moradabad?",
      answer:
        "Yes. We plan and deliver modular kitchens, wardrobes, TV units and other home interiors.",
    },
    {
      question: "Q2. How long does modular installation take?",
      answer:
        "It depends on the project size. Kitchens and wardrobes take less time than full homes, and we share a timeline after measurement.",
    },
    {
      question: "Q3. Which board is best for a modular kitchen?",
      answer:
        "BWP plywood or HDHMR is a good choice for moisture resistance. We help you pick based on your budget.",
    },
    {
      question: "Q4. Is modular furniture more expensive than carpentry?",
      answer:
        "Not always. Costs depend on materials, finishes and hardware, and modular work often reduces waste and delays.",
    },
    {
      question: "Q5. Can I customise the design and colours?",
      answer:
        "Yes. Sizes, finishes, layouts and accessories can be tailored to your needs.",
    },
    {
      question: "Q6. Can modular units be added later?",
      answer:
        "Yes. Most modular designs allow additions or replacements as your needs change.",
    },
    {
      question: "Q7. Do you handle the electrical and plumbing work too?",
      answer:
        "Yes. We coordinate related work so everything fits properly.",
    },
    {
      question: "Q8. How do I get a quotation?",
      answer:
        "Use our Budget Calculator, then call or WhatsApp +91 94584 10866 for a free quote.",
    },
    {
      question: "Q9. Do you serve areas around Moradabad?",
      answer:
        "Contact us with your location and requirements and we will confirm.",
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-0">
      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 px-4 sm:px-8 md:px-16 py-12 order-1 lg:order-1">
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-8 text-gray-900">
            Modular Interior Designer in Moradabad – MT Boss
          </h2>

          <div className="space-y-6 text-gray-700 leading-relaxed max-w-4xl">
            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Smart, Stylish and Ready-to-Fit Interiors
              </h3>

              <p className="mb-3">
                Modular interior design is now the preferred choice for
                homeowners in Moradabad who want clean looks, smart storage and
                faster work.
              </p>

              <p className="mb-3">
                MT Boss (Mtboss Construction Private Limited) is a
                Moradabad-based company offering construction, materials, home
                services and property solutions. Modular interiors are a
                natural fit with this range.
              </p>

              <p className="mb-3">
                Modular interiors use standard-size units, such as cabinets,
                shutters and shelves, that are designed to be assembled neatly
                at your home.
              </p>

              <p className="mb-3">
                The result is a tidy, precise finish with less mess, less noise
                and shorter installation time than traditional carpentry.
              </p>

              <p className="mb-3">
                Our team plans the layout, selects materials, coordinates the
                work and delivers a finished space that suits your lifestyle.
              </p>

              <p>
                Our office is at Harthala Kanth Road, Moradabad, so site visits
                and support are quick and convenient.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                What Is Modular Interior Design?
              </h3>

              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Modular design means furniture and storage are built from
                  ready-made units that fit together like building blocks.
                </li>
                <li>
                  Units are made with exact measurements, so they line up
                  cleanly and look uniform.
                </li>
                <li>
                  Components can be mixed, added or replaced later, which makes
                  the design flexible.
                </li>
                <li>
                  It applies to kitchens, wardrobes, TV walls, study tables,
                  shoe racks, pooja units, crockery units and bathroom
                  vanities.
                </li>
                <li>
                  It works well for compact flats as well as large houses and
                  bungalows.
                </li>
                <li>
                  Hardware such as hinges, channels and handles is chosen for
                  daily use and long life.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Why Choose Modular Interiors for Your Moradabad Home
              </h3>

              <ul className="list-disc list-inside space-y-1 ml-4">
                {modularBenefits.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Our Modular Interior Services in Moradabad
              </h3>

              {modularServices.map((service) => (
                <div key={service.title}>
                  <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                    {service.title}
                  </h4>

                  <ul className="list-disc list-inside space-y-1 ml-4">
                    {service.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Modular Kitchen Layouts Explained
              </h3>

              {kitchenLayouts.map((layout) => (
                <div key={layout.title}>
                  <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                    {layout.title}
                  </h4>

                  <ul className="list-disc list-inside space-y-1 ml-4">
                    {layout.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Materials Used in Modular Interiors
              </h3>

              {materials.map((material) => (
                <div key={material.title}>
                  <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                    {material.title}
                  </h4>

                  <ul className="list-disc list-inside space-y-1 ml-4">
                    {material.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}

              <p className="mt-3">
                Quality hardware matters as much as the boards, because it
                decides how long the unit works well.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Modular vs Traditional Carpentry: Which Is Better?
              </h3>

              {comparisonSections.map((comparison) => (
                <div key={comparison.title}>
                  <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                    {comparison.title}
                  </h4>

                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                      <strong>Modular:</strong> {comparison.modular}
                    </li>
                    <li>
                      <strong>Traditional:</strong> {comparison.traditional}
                    </li>
                  </ul>
                </div>
              ))}

              <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                Best Approach
              </h4>

              <p className="mb-3">
                Many homes use a mix of both. Kitchens and wardrobes work well
                as modular units, while special features can be custom-made.
              </p>

              <p>
                Our team advises you on the best combination for your home.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Our Modular Interior Design Process
              </h3>

              {processSteps.map((step) => (
                <div key={step.title}>
                  <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                    {step.title}
                  </h4>

                  <ul className="list-disc list-inside space-y-1 ml-4">
                    {step.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Why Choose MT Boss for Modular Interiors in Moradabad
              </h3>

              <ul className="list-disc list-inside space-y-1 ml-4">
                {whyChooseMtBoss.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Modular Interior Cost in Moradabad
              </h3>

              <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                What Affects the Price
              </h4>

              <ul className="list-disc list-inside space-y-1 ml-4">
                {costFactors.map((factor) => (
                  <li key={factor}>{factor}</li>
                ))}
              </ul>

              <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                Ways to Manage Your Budget
              </h4>

              <ul className="list-disc list-inside space-y-1 ml-4">
                {budgetTips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>

              <p className="mt-3">
                Final costs depend on your design and material choices, so a
                site visit is needed for an accurate estimate.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Modular Design Tips for Moradabad Homes
              </h3>

              <ul className="list-disc list-inside space-y-1 ml-4">
                {modularDesignTips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Common Modular Interior Mistakes to Avoid
              </h3>

              <ul className="list-disc list-inside space-y-1 ml-4">
                {mistakesToAvoid.map((mistake) => (
                  <li key={mistake}>{mistake}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Care and Maintenance Tips
              </h3>

              <ul className="list-disc list-inside space-y-1 ml-4">
                {maintenanceTips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Who Can Benefit From Our Modular Services
              </h3>

              <ul className="list-disc list-inside space-y-1 ml-4">
                {beneficiaries.map((beneficiary) => (
                  <li key={beneficiary}>{beneficiary}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                More From MT Boss
              </h3>

              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Construction: residential, commercial and industrial building
                  services.
                </li>
                <li>Property: buy, sell or rent verified properties.</li>
                <li>
                  Quick home services: electrical, plumbing, painting and more.
                </li>
                <li>
                  Materials: cement, TMT steel, bricks, tiles and paints.
                </li>
                <li>
                  Franchise and agent opportunities: join the MT Boss network.
                </li>
              </ul>

              <p className="mt-3">
                One company can support your plot, your house, your interiors
                and their upkeep.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Contact MT Boss for Modular Interiors
              </h3>

              <p className="mb-3">
                Get a free quote for modular kitchens, wardrobes, TV units,
                bedroom furniture or complete modular home interiors in
                Moradabad.
              </p>

              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  <strong>Company:</strong> Mtboss Construction Private Limited
                </li>

                <li>
                  <strong>Website:</strong>{" "}
                  <a
                    href="https://www.mtboss.in"
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.mtboss.in
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
                  <strong>Phone / Call:</strong> +91 94584 10866
                </li>

                <li>
                  <strong>WhatsApp:</strong>{" "}
                  <a
                    href="https://wa.me/9458410866"
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Chat on WhatsApp
                  </a>
                </li>

                <li>
                  <strong>Office Address:</strong> Harthala Kanth Road, Behind
                  Kr Collection, near Domino&apos;s, Moradabad, Uttar Pradesh,
                  India
                </li>
              </ul>

              <p className="mt-3">
                Use the Budget Calculator for an early estimate, then call or
                WhatsApp us for a detailed modular interior quotation.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Frequently Asked Questions
              </h3>

              <ul className="list-disc list-inside space-y-3 ml-4">
                {faqs.map((faq) => (
                  <li key={faq.question}>
                    <strong>{faq.question}</strong>
                    <br />
                    {faq.answer}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

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
