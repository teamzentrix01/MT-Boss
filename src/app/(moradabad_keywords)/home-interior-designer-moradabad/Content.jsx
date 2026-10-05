import React from "react";
import LandingEnquiry from "../../components/LandingEnquiry";

const SectionTitle = ({ children }) => (
  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
    {children}
  </h3>
);

const BulletList = ({ items, className = "" }) => (
  <ul className={`list-disc list-inside space-y-1 ml-4 ${className}`}>
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

const Content = () => {
  const whyNeedDesigner = [
    "Space is limited in most homes. A designer helps you use every corner well.",
    "A professional plan avoids costly mistakes such as wrong furniture sizes or badly placed switches.",
    "Designers know which materials suit Moradabad's climate, including summer heat and monsoon humidity.",
    "A clear design and budget stops projects from growing beyond your limit.",
    "A single accountable team saves you from chasing carpenters, painters and electricians separately.",
    "A well-finished interior also raises the resale and rental value of your property.",
  ];

  const interiorStyles = [
    "Modern: clean lines, neutral tones and functional furniture.",
    "Contemporary: stylish, current trends with a mix of textures.",
    "Minimalist: fewer items, more space, calm and clutter-free.",
    "Traditional and classic: rich woodwork, warm colours and detailed finishes.",
    "Indian fusion: modern layouts with local craft touches and warm colours. Moradabad is famous for its brass work, and a few well-chosen pieces can add character.",
    "Budget-friendly: smart material choices that look good and stay within your limit.",
  ];

  const chooseMtBoss = [
    "Construction and interior under one roof: one team understands both the structure and the finish.",
    "Transparent pricing: clear quotes and cost explanations from the start.",
    "Budget-friendly options: designs for every range, from affordable to premium.",
    "Local knowledge: we know Moradabad's weather, suppliers and design preferences.",
    "Material access: our materials network supports tiles, paints, cement, steel and more.",
    "Timely delivery: realistic schedules with milestone tracking.",
    "Digital convenience: online quote requests, a budget calculator and WhatsApp support.",
    "Full support: we also offer electrician, plumber, painting, AC repair and pest control services after your interiors are done.",
    "Customer-first communication: simple language, honest advice and quick responses.",
  ];

  const priceFactors = [
    "Size of the home and number of rooms.",
    "Quality of materials, such as plywood, laminates, hardware and paints.",
    "Complexity of design, including false ceilings, panelling and custom furniture.",
    "Choice of modular or on-site carpentry.",
    "Kitchen and bathroom fittings and appliances.",
    "Extra civil work like wall changes, plumbing or electrical rewiring.",
    "Project timeline and site conditions.",
  ];

  const moneySavingTips = [
    "Decide your priorities early. Spend more on the kitchen, wardrobes and bed, and less on decoration.",
    "Choose durable, mid-range materials for high-use areas.",
    "Avoid changing the design once work has started.",
    "Do the work in phases if your budget is tight.",
    "Get an itemised quote so you can compare properly.",
    "Start with our Budget Calculator, then request a detailed quote.",
  ];

  const materials = [
    "Plywood and boards: moisture-resistant and BWP-grade options for kitchens and bathrooms.",
    "Laminates and veneers: many textures and colours for wardrobes, TV units and panels.",
    "Paints: washable emulsions, texture paints and premium finishes.",
    "Tiles and flooring: vitrified, ceramic, marble-look and wooden-look tiles.",
    "Hardware: soft-close hinges, channels, handles and fittings from trusted brands.",
    "Lighting: LED lights, profile lights and decorative fixtures.",
    "Countertops: granite, quartz and other durable surfaces for kitchens.",
  ];

  const smartTips = [
    "Choose light colours in small rooms to make them look bigger.",
    "Use multi-purpose furniture, such as beds with storage and foldable tables.",
    "Plan for heat: good ventilation, light curtains and reflective finishes keep rooms cooler in summer.",
    "Protect against dampness: use waterproofing and moisture-resistant materials in bathrooms, kitchens and outer walls.",
    "Layer your lighting with ambient, task and accent lights.",
    "Leave room for storage, since clutter is the biggest enemy of a good interior.",
    "Add local character through brass pieces, handcrafted décor or traditional patterns.",
  ];

  const whoWeDesignFor = [
    "Families moving into a new flat or house.",
    "Homeowners who want to renovate an old property.",
    "Builders and developers who need show-flat interiors.",
    "Investors who want their rental property to look attractive.",
    "Bungalow and villa owners who want premium finishes.",
    "Working professionals who need a ready-to-live home without the stress.",
  ];

  const faqs = [
    {
      question: "Q1. Does MT Boss offer home interior design in Moradabad?",
      answer:
        "Yes. We handle interior design and execution for flats, houses, villas and bungalows.",
    },
    {
      question: "Q2. Can you do a full home interior in one package?",
      answer:
        "Yes. Our full-home package covers planning, materials, work and handover.",
    },
    {
      question: "Q3. How much does home interior design cost?",
      answer:
        "It depends on area, materials and design. Use our Budget Calculator, then request a free quote for an accurate figure.",
    },
    {
      question: "Q4. How long does an interior project take?",
      answer:
        "Small projects take a few weeks. Full homes take longer. We give a timeline after the site visit.",
    },
    {
      question: "Q5. Can I choose my own materials and style?",
      answer:
        "Yes. We guide you, but the final choice is always yours.",
    },
    {
      question: "Q6. Do you handle renovation of old homes?",
      answer:
        "Yes. We can repaint, redo flooring, upgrade kitchens and bathrooms, and make civil changes.",
    },
    {
      question: "Q7. Do you offer modular kitchens and wardrobes?",
      answer:
        "Yes. We design and install custom kitchens and storage solutions.",
    },
    {
      question: "Q8. Will I get regular updates on my project?",
      answer:
        "Yes. We share progress by phone or WhatsApp and welcome your site visits.",
    },
    {
      question: "Q9. How do I book a consultation?",
      answer:
        "Call or WhatsApp +91 94584 10866, email mtboss2016@gmail.com, or use the website enquiry form.",
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-0">
      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 px-4 sm:px-8 md:px-16 py-12 order-1 lg:order-1">
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-8 text-gray-900">
            Home Interior Designer in Moradabad – MT Boss
          </h2>

          <div className="space-y-6 text-gray-700 leading-relaxed max-w-4xl">
            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Interiors That Fit Your Life and Budget
              </h3>

              <p className="mb-3">
                MT Boss (Mtboss Construction Private Limited) is a
                Moradabad-based construction and home services company. We
                also help homeowners design and finish their interiors.
              </p>

              <p className="mb-3">
                A good interior is not only about looks. It should be
                comfortable, practical, easy to maintain and right for your
                budget.
              </p>

              <p className="mb-3">
                Our team plans, designs and executes interiors for flats,
                independent houses, villas and bungalows.
              </p>

              <p className="mb-3">
                Because we are also a construction company, we understand
                walls, wiring, plumbing and structure. This helps us avoid
                design mistakes that only show up later.
              </p>

              <p className="mb-3">
                If you are searching for a home interior designer in Moradabad,
                MT Boss gives you design, materials and execution through one
                team.
              </p>

              <p>
                Our office is at Harthala Kanth Road, Moradabad, so site visits
                and follow-ups are quick.
              </p>
            </section>

            <section>
              <SectionTitle>
                Why Homeowners in Moradabad Need a Professional Interior
                Designer
              </SectionTitle>
              <BulletList items={whyNeedDesigner} />
            </section>

            <section>
              <SectionTitle>
                Our Home Interior Design Services in Moradabad
              </SectionTitle>

              <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                Full Home Interior Design
              </h4>
              <BulletList
                items={[
                  "Complete interior work for 1BHK, 2BHK, 3BHK and larger homes.",
                  "One consistent design theme across living room, bedrooms, kitchen, dining and bathrooms.",
                  "Space planning, furniture layout, lighting, colours and finishing in one package.",
                  "Suitable for new homes and for full makeovers.",
                ]}
              />

              <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                Living Room Interior Design
              </h4>
              <BulletList
                items={[
                  "TV units, wall panelling, seating layouts and display shelves.",
                  "Lighting plans that work for both daytime and evening.",
                  "Modern, classic, minimal and traditional styles to match your taste.",
                  "Layouts that keep the room open and easy to move around.",
                ]}
              />

              <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                Modular Kitchen Design
              </h4>
              <BulletList
                items={[
                  "L-shaped, U-shaped, parallel and island kitchen layouts.",
                  "Storage planning for utensils, groceries, appliances and cleaning supplies.",
                  "Moisture-resistant materials, durable hardware and easy-to-clean countertops.",
                  "Placement of chimney, hob, sink and refrigerator for comfortable cooking.",
                ]}
              />

              <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                Bedroom Interior Design
              </h4>
              <BulletList
                items={[
                  "Beds, headboards, wardrobes and dressing units designed for comfort.",
                  "Calm colour palettes and soft lighting for better rest.",
                  "Kids' room designs with study areas, storage and safe furniture.",
                  "Guest and parents' room designs that are simple and easy to use.",
                ]}
              />

              <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                Wardrobe and Storage Solutions
              </h4>
              <BulletList
                items={[
                  "Sliding and hinged wardrobes, loft storage and walk-in closets.",
                  "Internal fittings such as drawers, shelves, hanging rods and shoe racks.",
                  "Storage under beds and stairs for small homes.",
                ]}
              />

              <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                False Ceiling and Lighting Design
              </h4>
              <BulletList
                items={[
                  "Gypsum, POP and designer false ceilings for living rooms and bedrooms.",
                  "Cove lighting, spotlights and decorative fixtures.",
                  "Ceiling designs that hide wiring and AC ducts neatly.",
                ]}
              />

              <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                Wall Painting, Texture and Wallpaper
              </h4>
              <BulletList
                items={[
                  "Interior painting with washable, low-odour, long-lasting paints.",
                  "Texture finishes and accent walls for a stylish look.",
                  "Wallpaper and wall panel options for feature walls.",
                  "Proper surface preparation, putty and primer for a smooth finish.",
                ]}
              />

              <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                Flooring, Tiles and Bathroom Interiors
              </h4>
              <BulletList
                items={[
                  "Tiles, marble, vitrified and wooden-look flooring options.",
                  "Anti-skid, easy-to-clean choices for kitchens and bathrooms.",
                  "Bathroom layouts with smart storage, good ventilation and proper waterproofing.",
                ]}
              />

              <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                Pooja Room and Study Room Design
              </h4>
              <BulletList
                items={[
                  "Compact, peaceful pooja units with storage for accessories.",
                  "Study and work-from-home corners with proper lighting and cable management.",
                ]}
              />

              <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                Bungalow and Villa Interiors
              </h4>
              <BulletList
                items={[
                  "Interior planning for larger homes with multiple floors and rooms.",
                  "Staircase, foyer, lounge and balcony designs that match the overall theme.",
                  "Premium finishes for clients who want a luxurious look.",
                ]}
              />

              <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                Home Renovation and Makeover
              </h4>
              <BulletList
                items={[
                  "Upgrade old homes without rebuilding.",
                  "Replace flooring, repaint, redo kitchens and bathrooms, and refresh lighting.",
                  "Civil changes such as wall removal or extension handled by our construction team.",
                ]}
              />
            </section>

            <section>
              <SectionTitle>Interior Styles We Design</SectionTitle>
              <BulletList items={interiorStyles} />
            </section>

            <section>
              <SectionTitle>Our Interior Design Process</SectionTitle>

              <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                Step 1: Free Consultation
              </h4>
              <BulletList
                items={[
                  "We understand your needs, family size, lifestyle habits and budget.",
                  "We collect your reference images, colour choices and must-have items.",
                ]}
              />

              <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                Step 2: Site Visit and Measurement
              </h4>
              <BulletList
                items={[
                  "Our team visits your home and takes exact measurements.",
                  "We check walls, electrical points, plumbing lines and natural light.",
                ]}
              />

              <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                Step 3: Concept and Layout Planning
              </h4>
              <BulletList
                items={[
                  "We prepare a layout and design direction for each room.",
                  "You see how furniture, storage and lighting will be arranged.",
                ]}
              />

              <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                Step 4: Material and Colour Selection
              </h4>
              <BulletList
                items={[
                  "We suggest materials, finishes and colours with clear pros and cons.",
                  "Options are offered at different price levels so you stay in control.",
                ]}
              />

              <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                Step 5: Quotation and Budget Approval
              </h4>
              <BulletList
                items={[
                  "You receive a clear, itemised quote with no confusing terms.",
                  "You can use the Budget Calculator on our website for an early estimate.",
                ]}
              />

              <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                Step 6: Execution and Supervision
              </h4>
              <BulletList
                items={[
                  "Carpenters, painters, electricians and plumbers work under one supervisor.",
                  "Regular quality checks are done during the work.",
                  "You receive progress updates through phone or WhatsApp.",
                ]}
              />

              <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                Step 7: Final Finishing and Handover
              </h4>
              <BulletList
                items={[
                  "A detailed inspection checks every corner, fitting and surface.",
                  "Small issues are fixed before the home is handed over.",
                  "We stay available for post-handover support.",
                ]}
              />
            </section>

            <section>
              <SectionTitle>
                Why Choose MT Boss as Your Interior Designer in Moradabad
              </SectionTitle>
              <BulletList items={chooseMtBoss} />
            </section>

            <section>
              <SectionTitle>Home Interior Design Cost in Moradabad</SectionTitle>

              <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                What Affects the Price
              </h4>
              <BulletList items={priceFactors} />

              <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                Tips to Save Money Without Losing Quality
              </h4>
              <BulletList items={moneySavingTips} />

              <p className="mt-3">
                Final costs vary by design and material choice, so a site visit
                is needed for an accurate estimate.
              </p>
            </section>

            <section>
              <SectionTitle>Materials and Finishes We Work With</SectionTitle>
              <BulletList items={materials} />

              <p className="mt-3">
                Our Shop Now section gives you access to key building essentials
                at competitive prices.
              </p>
            </section>

            <section>
              <SectionTitle>Smart Interior Tips for Moradabad Homes</SectionTitle>
              <BulletList items={smartTips} />
            </section>

            <section>
              <SectionTitle>Who We Design For</SectionTitle>
              <BulletList items={whoWeDesignFor} />
            </section>

            <section>
              <SectionTitle>More From MT Boss</SectionTitle>
              <BulletList
                items={[
                  "Construction services: build your house from the ground up with our residential construction team.",
                  "Property services: buy, sell or rent verified properties in and around Moradabad.",
                  "Quick home services: electrical, plumbing, painting, AC repair, pest control and more.",
                  "Materials: cement, TMT steel, bricks, tiles and paints for your project.",
                  "Franchise and agent opportunities: join the MT Boss network.",
                ]}
              />

              <p className="mt-3">
                This range lets you handle your plot, house, interiors and
                maintenance with one trusted company.
              </p>
            </section>

            <section>
              <SectionTitle>Contact MT Boss for Home Interior Design</SectionTitle>

              <p className="mb-3">
                Book a consultation for your flat, house, villa, bungalow or
                home renovation project in Moradabad.
              </p>

              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  <strong>Company:</strong> Mtboss Construction Private Limited
                </li>
                <li>
                  <strong>Phone / WhatsApp:</strong> +91 94584 10866
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
                  <strong>Office Address:</strong> Harthala Kanth Road,
                  Moradabad, Uttar Pradesh, India
                </li>
              </ul>
            </section>

            <section>
              <SectionTitle>Frequently Asked Questions</SectionTitle>

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