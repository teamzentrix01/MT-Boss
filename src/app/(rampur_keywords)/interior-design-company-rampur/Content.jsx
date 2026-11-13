import React from "react";
import LandingEnquiry from "../../components/LandingEnquiry";

const Content = () => {
  return (
    <div className="min-h-screen bg-white pt-0">
      <div className="flex flex-col lg:flex-row">
        {/* Content Section */}
        <div className="flex-1 px-4 sm:px-8 md:px-16 py-12 order-1 lg:order-1">
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-8 text-gray-900">
            Interior Design Company Rampur – MTBOSS Interiors
          </h2>

          <div className="space-y-6 text-gray-700 leading-relaxed max-w-4xl">
            <section>
              <p>
                Choosing between a freelance designer, a local carpenter and an interior
                design company is one of the first decisions in any interior project. A
                company brings a team, a process, a written agreement and accountability.
                That matters when the project involves large budgets, many trades and tight
                deadlines.
              </p>
              <p className="mt-3">
                MTBOSS Construction Private Limited is an architecture, construction and
                interior company serving Rampur, Moradabad and Bareilly. Our interior
                division designs and executes homes, kitchens, offices, shops, clinics and
                hospitality spaces, and our construction background lets us handle civil
                changes, waterproofing, electrical and plumbing work alongside interiors.
                This page explains how a professional interior design company works, what
                you should expect and how MTBOSS delivers.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                What an Interior Design Company Does
              </h3>
              <p className="mb-3">
                Many people think interior design means choosing colours and furniture. A
                real interior design company handles much more.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Understanding requirements:</strong> Lifestyle, budget,
                  preferences and timeline.
                </li>
                <li>
                  <strong>Space planning:</strong> Deciding where furniture, storage and
                  walkways go.
                </li>
                <li>
                  <strong>Design development:</strong> 3D visuals, material boards, colour
                  schemes and lighting plans.
                </li>
                <li>
                  <strong>Technical drawings:</strong> Detailed drawings for carpentry,
                  ceilings, electrical points and plumbing.
                </li>
                <li>
                  <strong>Costing:</strong> Itemised quotations with quantities and
                  specifications.
                </li>
                <li>
                  <strong>Procurement:</strong> Sourcing boards, laminates, hardware,
                  tiles, fittings and fixtures.
                </li>
                <li>
                  <strong>Execution:</strong> Civil work, carpentry, ceilings, painting,
                  flooring and installation.
                </li>
                <li>
                  <strong>Project management:</strong> Scheduling, supervision, quality
                  checks and communication.
                </li>
                <li>
                  <strong>Handover and support:</strong> Final inspection, cleaning,
                  documentation and after-sales service.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Our Interior Design Services in Rampur
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Residential Interiors:</strong> Complete interiors for
                  apartments, independent houses, duplexes and villas. We plan living
                  rooms, bedrooms, kitchens, bathrooms, pooja rooms, study areas and
                  balconies as one connected design.
                </li>
                <li>
                  <strong>Modular Kitchens:</strong> Efficient layouts with the right work
                  triangle, storage, ventilation and hardware. Straight, L-shaped,
                  U-shaped, parallel and island designs are possible, with durable carcass
                  and shutter materials.
                </li>
                <li>
                  <strong>Wardrobes and Custom Furniture:</strong> Sliding and hinged
                  wardrobes, walk-in closets, beds with storage, TV units, study tables,
                  shoe racks and crockery units made to measure.
                </li>
                <li>
                  <strong>False Ceilings and Lighting:</strong> Gypsum and other ceiling
                  designs with cove, profile and spot lighting, planned along with
                  electrical layouts.
                </li>
                <li>
                  <strong>Flooring, Tiles and Wall Finishes:</strong> Tile, marble, granite
                  and wood-look flooring, plus paint, texture, wallpaper and panelling.
                </li>
                <li>
                  <strong>Commercial Interiors:</strong> Offices, shops, showrooms,
                  clinics, restaurants and banquet spaces, with layouts that support
                  customers, staff and brand identity.
                </li>
                <li>
                  <strong>Renovation and Remodelling:</strong> Updating existing homes and
                  shops with new layouts, storage, ceilings, kitchens, bathrooms and
                  finishes, often without a full rebuild.
                </li>
                <li>
                  <strong>Civil, Waterproofing and Repair Support:</strong> Wall changes,
                  plaster repair, waterproofing, electrical rewiring and plumbing
                  adjustments, which many decorator-only firms cannot manage.
                </li>
                <li>
                  <strong>Related Home Services:</strong> Painter, carpenter, electrician,
                  plumber, pest control, door and window installation and AC support.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Company vs Freelancer vs Local Carpenter: A Simple Comparison
              </h3>
              <p className="mb-3">
                Each option has a place, but the right choice depends on project size and
                risk.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 text-left text-sm sm:text-base">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-200 px-4 py-2 font-semibold">
                        Factor
                      </th>
                      <th className="border border-gray-200 px-4 py-2 font-semibold">
                        Interior Design Company
                      </th>
                      <th className="border border-gray-200 px-4 py-2 font-semibold">
                        Freelance Designer
                      </th>
                      <th className="border border-gray-200 px-4 py-2 font-semibold">
                        Local Carpenter / Contractor
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-medium">
                        Design and 3D visuals
                      </td>
                      <td className="border border-gray-200 px-4 py-2">Usually included</td>
                      <td className="border border-gray-200 px-4 py-2">Included</td>
                      <td className="border border-gray-200 px-4 py-2">
                        Often limited or none
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-medium">
                        Execution team
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        In-house or managed partners
                      </td>
                      <td className="border border-gray-200 px-4 py-2">Hired separately</td>
                      <td className="border border-gray-200 px-4 py-2">Carpentry only</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-medium">
                        Civil, electrical, plumbing
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        Can be handled together
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        Needs separate vendors
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        Usually not covered
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-medium">
                        Accountability
                      </td>
                      <td className="border border-gray-200 px-4 py-2">Single point</td>
                      <td className="border border-gray-200 px-4 py-2">
                        Split between parties
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        Limited to own work
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-medium">
                        Written agreement
                      </td>
                      <td className="border border-gray-200 px-4 py-2">Standard</td>
                      <td className="border border-gray-200 px-4 py-2">Varies</td>
                      <td className="border border-gray-200 px-4 py-2">Often informal</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-medium">
                        Large or full-home projects
                      </td>
                      <td className="border border-gray-200 px-4 py-2">Well suited</td>
                      <td className="border border-gray-200 px-4 py-2">
                        Possible with good management
                      </td>
                      <td className="border border-gray-200 px-4 py-2">Difficult</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-medium">
                        After-sales support
                      </td>
                      <td className="border border-gray-200 px-4 py-2">Structured</td>
                      <td className="border border-gray-200 px-4 py-2">
                        Depends on person
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        Depends on person
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3">
                A single kitchen or wardrobe may be fine with a trusted carpenter. A full
                home or commercial space usually benefits from a company&rsquo;s structure.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                How MTBOSS Runs an Interior Project
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Project Brief:</strong> We record your requirements, budget
                  range, timeline and special needs, such as vastu preferences, elderly
                  access or future expansion.
                </li>
                <li>
                  <strong>Site Survey:</strong> Our team measures the space, checks walls,
                  ceilings, electrical points, plumbing lines and moisture risk.
                </li>
                <li>
                  <strong>Design Stage:</strong> We prepare layouts and 3D designs, revise
                  them with you and finalise materials and colours.
                </li>
                <li>
                  <strong>Technical Planning:</strong> Working drawings, electrical
                  layouts, ceiling plans and carpentry details are prepared so that every
                  worker knows what to build.
                </li>
                <li>
                  <strong>Quotation and Agreement:</strong> You receive an itemised
                  quotation. After approval, a written agreement fixes scope, schedule and
                  payment stages.
                </li>
                <li>
                  <strong>Material Approval:</strong> Samples of boards, laminates,
                  hardware, tiles and fittings are shown and approved before ordering.
                </li>
                <li>
                  <strong>Execution Sequence:</strong> We follow the right order: civil and
                  services first, then ceilings, carpentry, painting, flooring finishes,
                  lighting and final installation. Wrong sequencing is a common reason for
                  damage and rework in poorly managed projects.
                </li>
                <li>
                  <strong>Supervision and Reporting:</strong> A site supervisor tracks
                  progress daily, and you receive updates with photos and milestones.
                </li>
                <li>
                  <strong>Handover:</strong> We conduct a final walkthrough, fix snags,
                  clean the site and hand over keys with warranty or care instructions
                  where applicable.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Pricing Models: What Interior Companies Usually Offer
              </h3>
              <p className="mb-3">
                Understanding how interiors are priced protects you from confusion.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Per Square Foot Rate:</strong> A rate applied to carpet or
                  built-up area. It is simple but can hide differences in material and
                  scope, so check exactly what the rate includes.
                </li>
                <li>
                  <strong>Itemised Quotation:</strong> Each item, such as wardrobe,
                  kitchen, ceiling or wall panel, is priced by size, material and finish.
                  This is the most transparent method for comparing quotes.
                </li>
                <li>
                  <strong>Package Pricing:</strong> Fixed packages for specific scopes,
                  such as kitchen and wardrobes. Useful for budget control, as long as the
                  scope is clearly written.
                </li>
                <li>
                  <strong>Turnkey Contract:</strong> One total price for design, supply,
                  execution and handover. It gives cost certainty if the scope is detailed.
                </li>
              </ul>
              <p className="mt-3">
                MTBOSS prefers itemised or clearly defined turnkey quotations, so that you
                can see what is included. We recommend that you compare quotes by
                materials, thickness, brands and scope, not just the final amount.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Quality Control in Interior Execution
              </h3>
              <p className="mb-3">
                Good interiors depend on invisible details, so we check them at each stage.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Boards and materials:</strong> Correct grade, thickness and
                  moisture resistance for each area.
                </li>
                <li>
                  <strong>Carpentry joinery:</strong> Proper edge banding, alignment and
                  fixing for long life.
                </li>
                <li>
                  <strong>Hardware:</strong> Hinges, channels, locks and handles of agreed
                  quality and tested movement.
                </li>
                <li>
                  <strong>Electrical:</strong> Safe wiring, correct switch positions and
                  neat concealed lines.
                </li>
                <li>
                  <strong>Plumbing:</strong> Pressure tests and leak checks in kitchens and
                  bathrooms.
                </li>
                <li>
                  <strong>Waterproofing:</strong> Treatment and testing in wet areas before
                  finishing.
                </li>
                <li>
                  <strong>Painting:</strong> Proper surface preparation, primer, putty and
                  coats.
                </li>
                <li>
                  <strong>Cleanliness:</strong> Dust control and daily cleaning, since
                  interior work happens in lived-in spaces.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Interior Cost Factors
              </h3>
              <p className="mb-3">
                Interior cost depends on choices, not just area. These are the main
                drivers:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Number of rooms and total area</li>
                <li>Amount of carpentry and custom furniture</li>
                <li>Grade of plywood, laminate and hardware</li>
                <li>Ceiling design and lighting complexity</li>
                <li>Flooring, tiles and wall finishes</li>
                <li>Kitchen size and accessories</li>
                <li>Civil, electrical and plumbing changes</li>
                <li>Brand and quality of fittings</li>
                <li>Timeline and site access</li>
              </ul>
              <p className="mt-3">Practical tips for budgeting:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Fix priorities before design: kitchen, wardrobes and storage usually
                  deserve the biggest share.
                </li>
                <li>Choose finishes early to avoid mid-project changes.</li>
                <li>Keep a reserve of around 8 to 10%.</li>
                <li>Do not compromise on waterproofing, wiring and hardware.</li>
                <li>Ask for material alternatives to compare cost and quality.</li>
              </ul>
              <p className="mt-3">
                Use the Construction Budget Calculator on the MTBOSS website for overall
                planning, and request a site visit for an accurate interior quotation.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Interior Design for Rampur&rsquo;s Homes and Businesses
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Climate:</strong> Hot summers, humid monsoons and cool winters
                  call for ventilation, moisture-resistant materials and smart colour
                  choices.
                </li>
                <li>
                  <strong>Family life:</strong> Homes often host extended families and
                  guests, so flexible seating, strong storage and easy-clean finishes are
                  useful.
                </li>
                <li>
                  <strong>Local taste:</strong> Many clients appreciate refined detail,
                  warm colours and craft-inspired elements, and we can add them to modern
                  designs.
                </li>
                <li>
                  <strong>Business spaces:</strong> Shops, clinics and offices need strong
                  first impressions, efficient layouts and durable finishes for heavy daily
                  use.
                </li>
              </ul>
              <p className="mt-3">
                We work with clients in Rampur, including Civil Lines and other residential
                and commercial localities, and also in Moradabad and Bareilly.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Documents and Records to Expect from a Professional Company
              </h3>
              <p className="mb-3">
                A good interior company should provide clear paperwork. With MTBOSS, you
                can expect:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>A written quotation with item descriptions</li>
                <li>Approved designs and drawings</li>
                <li>A material specification list with brands or grades</li>
                <li>An agreement with scope, schedule and payment stages</li>
                <li>Payment receipts</li>
                <li>Progress updates</li>
                <li>Handover checklist and care instructions</li>
              </ul>
              <p className="mt-3">
                Keep these documents safe. They help with warranty issues, future repairs
                and resale of your property.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Why Do Clients Choose MTBOSS as Their Interior Design Company?
              </h3>
              <p>
                Clients choose MTBOSS because we combine design thinking with construction
                discipline. Many interior problems, such as leakage, uneven walls, poor
                electrical planning and weak ceilings, are construction problems. Our team
                understands both sides, so we prevent issues rather than hide them. You get
                3D designs, itemised pricing, a clear schedule and one team accountable
                from the first sketch to the final clean-up. We also keep our language
                simple, so you always understand what you are paying for.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Is It Worth Hiring an Interior Design Company for a Small Home?
              </h3>
              <p>
                Yes, in many cases. Small homes need the most careful planning, because
                every inch counts. A professional plan with smart storage, multi-use
                furniture and good lighting can make a compact flat feel spacious. A
                company can also coordinate carpentry, painting and electrical work, so you
                do not have to chase several people. If you only need one item, such as a
                wardrobe, you can ask for a limited scope. We take projects of all sizes
                and will tell you honestly what is worth doing and what can wait.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Book a Free Consultation with MTBOSS Interiors
              </h3>
              <p className="mb-3">
                Planning your interiors? Share your space details, preferred style and
                budget range. Our team will visit your site, discuss ideas and give you a
                clear quotation and schedule.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Call:</strong>{" "}
                  <a
                    href="https://wa.me/9458410866"
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    +91 94584 10866
                  </a>
                </li>
                <li>
                  <strong>WhatsApp:</strong>{" "}
                  <a
                    href="https://wa.me/9458410866"
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    +91 94584 10866
                  </a>
                </li>
                <li>
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:MTBOSS2016@gmail.com"
                    className="text-blue-600 underline"
                  >
                    MTBOSS2016@gmail.com
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
              </ul>
              <p className="mt-3">
                <a
                  href="https://www.mtboss.in"
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get a Free Quote
                </a>{" "}
                |{" "}
                <a
                  href="https://wa.me/9458410866"
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chat on WhatsApp
                </a>{" "}
                |{" "}
                <a
                  href="https://www.mtboss.in"
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Estimate Your Budget
                </a>
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Frequently Asked Questions
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Q1. What does an interior design company do?</strong>
                  <br />
                  It plans, designs, costs and executes interiors, including layout, 3D
                  design, carpentry, ceilings, painting, flooring and handover.
                </li>
                <li>
                  <strong>Q2. Do you handle both design and execution?</strong>
                  <br />
                  Yes. Design, civil work, carpentry, finishing and installation are
                  managed by our team.
                </li>
                <li>
                  <strong>Q3. Can you design only a kitchen or a few rooms?</strong>
                  <br />
                  Yes. We take projects from a single modular kitchen to a full home or
                  commercial space.
                </li>
                <li>
                  <strong>Q4. Do you provide 3D designs and itemised quotations?</strong>
                  <br />
                  Yes. You can review visuals and a detailed estimate before work starts.
                </li>
                <li>
                  <strong>Q5. How long does an interior project take?</strong>
                  <br />
                  It depends on scope and complexity. We give a schedule with the quotation
                  after reviewing your site.
                </li>
                <li>
                  <strong>Q6. Do you offer renovation and repair services?</strong>
                  <br />
                  Yes. We handle remodelling, repainting, flooring, waterproofing and
                  repair work.
                </li>
                <li>
                  <strong>Q7. Do you serve Rampur and nearby cities?</strong>
                  <br />
                  Yes. We serve Rampur, Moradabad and Bareilly and can discuss nearby
                  locations.
                </li>
              </ul>
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