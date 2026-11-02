import React from "react";
import LandingEnquiry from "../../components/LandingEnquiry";

const Content = () => {
  return (
    <div className="min-h-screen bg-white pt-0">
      <div className="flex flex-col lg:flex-row">
        {/* Content Section */}
        <div className="order-1 flex-1 px-4 py-12 sm:px-8 md:px-16 lg:order-1">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl md:text-3xl">
            Waterproofing Cost in Bareilly: What You Pay For, What Changes the
            Price and How to Get a Fair Quote
          </h2>

          <div className="max-w-4xl space-y-6 leading-relaxed text-gray-700">
            <section>
              <p>
                “How much will waterproofing cost?” is the first question
                almost every owner asks, and it is the right question. It is
                also the hardest one to answer without seeing the building. Two
                roofs of the same size can differ by a large amount, because
                one has sound concrete and good slope and the other has cracks,
                ponding and an old failed layer. The price follows the
                condition, the method and the detailing, not only the area.
              </p>

              <p className="mt-3">
                This page explains how waterproofing cost in Bareilly is built
                up, what typically changes the price, how to compare quotes
                fairly and how to avoid paying twice for the same job. MTBOSS
                Construction Private Limited is an architect, interior designer
                and construction company serving Moradabad and Bareilly. It
                offers waterproofing, building repair, renovation and other
                home services with transparent pricing and on-time delivery.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Waterproofing Cost at a Glance
              </h3>

              <p className="mb-3">
                The table below shows the main cost drivers by area. Figures
                are broad market guides only and are not fixed MTBOSS rates.
                Your actual price depends on inspection findings.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2">
                        Area
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Typical system
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Approximate market range
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        What moves the price
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Roof or terrace
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Cementitious, polymer or PU
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        ₹30 to ₹150 per sq ft
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Cracks, slope work, fixtures, number of coats
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Bathroom or toilet
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Cementitious or polymer on floor and walls
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        ₹60 to ₹200 per sq ft
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Pipe sleeves, wall height, tile removal
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Basement
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Crystalline, injection, membrane
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        ₹40 to ₹150 per sq ft
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Leak severity, joints, drainage or sump
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        External wall
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Crack filling and protective coat
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        ₹25 to ₹80 per sq ft
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Crack count, plaster condition, height and access
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Water tank or sump
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Crystalline or cementitious
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        ₹40 to ₹130 per sq ft
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Surface condition, joints, depth
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Balcony or sunshade
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Polymer or PU
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        ₹40 to ₹120 per sq ft
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Edges, railings, slope
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Crack or joint injection
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        PU or epoxy
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Priced by running length
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Crack length, depth and number of entries
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-3">
                These ranges move with material prices, labour and scope.
                Treat them as a starting point, then ask for an item-wise quote
                after a site visit.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                MTBOSS Construction Private Limited
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  A company offering construction services, doorstep home
                  services, verified property transactions and building
                  materials under one roof.
                </li>
                <li>
                  Office at Harthala, Kanth Road, Behind KR Collection, near
                  Domino&apos;s, Moradabad.
                </li>
                <li>
                  Serving Moradabad and Bareilly with residential, commercial
                  and renovation work.
                </li>
                <li>
                  A project gallery and blog on the website let prospective
                  clients review completed work.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Waterproofing Services Offered by MTBOSS for Bareilly Clients
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Site visit and inspection:</strong> Checking surfaces,
                  cracks, slope, drains, joints and the rooms affected.
                </li>
                <li>
                  <strong>Leak tracing:</strong> Finding the entry point, which
                  is often a different place from where water shows.
                </li>
                <li>
                  <strong>Roof and terrace waterproofing:</strong> Crack repair,
                  slope correction and coating or membrane systems.
                </li>
                <li>
                  <strong>Bathroom and toilet waterproofing:</strong> Sealing
                  floors, wall junctions and pipe sleeves.
                </li>
                <li>
                  <strong>Basement waterproofing:</strong> Injection,
                  crystalline coating, membrane and drainage.
                </li>
                <li>
                  <strong>External wall waterproofing:</strong> Crack filling
                  and protective coatings.
                </li>
                <li>
                  <strong>Balcony and sunshade treatment:</strong> Sealing
                  edges, railings and joints.
                </li>
                <li>
                  <strong>Water tank and sump waterproofing:</strong> Treating
                  overhead and underground tanks.
                </li>
                <li>
                  <strong>Crack injection:</strong> PU or epoxy injection for
                  active leaks and structural cracks.
                </li>
                <li>
                  <strong>Ceiling and wall restoration:</strong> Plaster repair
                  and repainting after the surface is dry.
                </li>
                <li>
                  <strong>Water test and handover:</strong> A ponding or
                  moisture test before sign-off.
                </li>
                <li>
                  <strong>Related home services:</strong> Painter, tile and
                  marble work, plumber and building repair through the same
                  company.
                </li>
              </ul>

              <p className="mt-3">
                Final scope for each project is discussed and confirmed with
                the MTBOSS team before work begins.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                How Waterproofing Cost Is Calculated
              </h3>

              <p className="mb-3">
                Most quotes are built from the same few parts. Knowing them
                helps you read any quotation.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Area × rate:</strong> The treated area is measured,
                  then multiplied by a rate for the chosen system.
                </li>
                <li>
                  <strong>Preparation work:</strong> Cleaning, removing old
                  layers and repairing the surface.
                </li>
                <li>
                  <strong>Crack and joint treatment:</strong> Often priced by
                  running length, separate from the main coating.
                </li>
                <li>
                  <strong>Detailing:</strong> Corners, parapets, pipes and
                  junctions need extra material and care.
                </li>
                <li>
                  <strong>Slope and drainage correction:</strong> Levelling and
                  outlet changes are added when needed.
                </li>
                <li>
                  <strong>Protection and finishing:</strong> Screed, topcoat,
                  tile relaying, plaster and paint.
                </li>
                <li>
                  <strong>Testing and handover:</strong> Ponding or moisture
                  testing and a final inspection.
                </li>
              </ul>

              <p className="mt-3">
                A clear quotation lists these items, not one lump sum. If a
                quote shows only a single number with no breakdown, ask for the
                details.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Factors That Affect Waterproofing Cost in Bareilly
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Area to be treated:</strong> Larger areas often cost
                  less per square foot, but the total rises.
                </li>
                <li>
                  <strong>System chosen:</strong> Cementitious, polymer, PU,
                  crystalline and membrane systems sit at different price
                  levels.
                </li>
                <li>
                  <strong>Surface condition:</strong> Cracks, hollow patches
                  and old layers add repair work.
                </li>
                <li>
                  <strong>Severity of the leak:</strong> Damp walls cost less
                  to treat than active water flow.
                </li>
                <li>
                  <strong>Number of coats and thickness:</strong> Thicker,
                  multi-coat systems cost more and perform better.
                </li>
                <li>
                  <strong>Detailing:</strong> More pipes, tanks, corners and
                  junctions mean more careful work.
                </li>
                <li>
                  <strong>Access:</strong> Hard-to-reach areas, high walls and
                  upper floors increase effort and time.
                </li>
                <li>
                  <strong>Drainage needs:</strong> A sump pit, pump or channel
                  adds to the budget.
                </li>
                <li>
                  <strong>Finishing work:</strong> Plaster, painting, tiling
                  and flooring after waterproofing.
                </li>
                <li>
                  <strong>Add-ons:</strong> Heat-reflective coats, protective
                  screed or insulation layers.
                </li>
                <li>
                  <strong>Timeline:</strong> Faster schedules or monsoon-time
                  work can affect cost.
                </li>
                <li>
                  <strong>Design changes:</strong> Changes after work starts
                  can add cost and delay.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Cost by Area: What to Expect
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Roof and terrace:</strong> The most common job. A
                  stable slab with good slope needs less work than an old roof
                  with cracks and ponding. A flexible membrane suits complex
                  roofs with many pipes and fixtures. Slope correction and old
                  layer removal raise the price, but they decide how long the
                  result lasts.
                </li>
                <li>
                  <strong>Bathroom and toilet:</strong> Cost depends on floor
                  area, wall height and the number of pipe entries. If tiles
                  must be removed and relaid, that adds to the budget, but
                  waterproofing under the tiles is where the job succeeds or
                  fails. A ponding test before retiling is a small cost that
                  prevents a large one.
                </li>
                <li>
                  <strong>Basement:</strong> Damp walls cost less than active
                  seepage. Injection grouting, joint treatment and drainage are
                  priced by scope. If groundwater is persistent, a sump pit and
                  pump may be needed, which adds to the cost but solves the
                  real problem.
                </li>
                <li>
                  <strong>External walls:</strong> Crack filling, plaster
                  repair and a protective coat are the main items. Height and
                  access, such as scaffolding or a cradle, can affect the price
                  noticeably.
                </li>
                <li>
                  <strong>Water tanks and sumps:</strong> Overhead tanks are
                  simpler than deep underground sumps. Joints, corners and
                  surface condition are the main factors, and materials must
                  suit stored water.
                </li>
                <li>
                  <strong>Balconies and sunshades:</strong> Smaller areas, but
                  edges, railings and drip lines need careful detailing, so the
                  rate per square foot may be higher.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Cost by Property Type
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Independent house or villa:</strong> Usually a
                  combination of roof, bathrooms, walls and balconies. A
                  planned, phase-wise approach spreads the cost.
                </li>
                <li>
                  <strong>Apartment or flat:</strong> Leaks cross between
                  flats, so coordination with neighbours or the society affects
                  scope.
                </li>
                <li>
                  <strong>Older building:</strong> More repair work before
                  waterproofing, so higher preparation cost.
                </li>
                <li>
                  <strong>Commercial building or showroom:</strong> Sectional
                  work and neat finishing can add to the cost, but protect
                  business hours.
                </li>
                <li>
                  <strong>School, clinic or hospital:</strong> Low-odour
                  materials and phased work may be required.
                </li>
                <li>
                  <strong>Warehouse or godown:</strong> Large areas lower the
                  rate per square foot, but need durable systems.
                </li>
                <li>
                  <strong>New construction:</strong> Waterproofing during
                  construction costs far less than repairs later.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                What Should Be Included in a Good Quote
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>Area measured and the method of measurement</li>
                <li>Waterproofing system and brand or grade of material</li>
                <li>Number of coats and curing time between them</li>
                <li>Surface preparation and crack repair</li>
                <li>Detailing at corners, pipes and parapets</li>
                <li>Drainage or slope work, if needed</li>
                <li>Testing method and handover</li>
                <li>Timeline and payment stages</li>
                <li>Warranty terms, if offered, in writing</li>
                <li>
                  What is not included, such as plaster, painting or tile work
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                How to Compare Waterproofing Quotes Fairly
              </h3>

              <p className="mb-3">
                A low price is only good if the work is the same. Compare these
                points before you decide.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Same scope:</strong> Are all quotes covering the same
                  area and the same preparation?
                </li>
                <li>
                  <strong>Same system:</strong> A cheap coating and a PU
                  membrane are not the same product.
                </li>
                <li>
                  <strong>Same coats:</strong> Two coats and four coats perform
                  very differently.
                </li>
                <li>
                  <strong>Same detailing:</strong> Does each quote include
                  corners, pipes and junctions?
                </li>
                <li>
                  <strong>Same testing:</strong> Does each contractor offer a
                  water test?
                </li>
                <li>
                  <strong>Same inclusions:</strong> Is finishing work included
                  or charged separately?
                </li>
                <li>
                  <strong>Written terms:</strong> Is everything documented,
                  including payment and timeline?
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Hidden Costs to Ask About
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>Removing old coba, tiles or screed</li>
                <li>Repairing damaged plaster or concrete</li>
                <li>Extra coats if the surface absorbs heavily</li>
                <li>Scaffolding or access equipment</li>
                <li>Drain, sump or pump installation</li>
                <li>Repainting or retiling afterwards</li>
                <li>Return visits if the first job fails</li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Ways to Control Waterproofing Cost Without Cutting Quality
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Fix leaks early:</strong> Small repairs cost little.
                  Delay increases the damage.
                </li>
                <li>
                  <strong>Do repairs and waterproofing together:</strong>{" "}
                  Combining jobs saves repeat labour and access cost.
                </li>
                <li>
                  <strong>Choose the right system:</strong> A more expensive
                  system on the wrong problem is wasted money.
                </li>
                <li>
                  <strong>Plan before the monsoon:</strong> Booking early
                  avoids rush-time pricing and rain delays.
                </li>
                <li>
                  <strong>Phase the work:</strong> Treat the most damaged areas
                  first and the rest later.
                </li>
                <li>
                  <strong>Keep surfaces accessible:</strong> Clear furniture
                  and fittings to reduce time.
                </li>
                <li>
                  <strong>Ask for an item-wise estimate:</strong> It shows
                  where the money goes and what can wait.
                </li>
                <li>
                  <strong>Avoid repeat work:</strong> Pay for proper
                  preparation once instead of coating again each year.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Bareilly Planning Notes for Waterproofing Budgets
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Monsoon rainfall:</strong> Heavy seasonal rain tests
                  every joint. Plan work before July and book early.
                </li>
                <li>
                  <strong>Summer heat:</strong> High temperatures affect some
                  materials, so choose a system that handles heat and sunlight.
                </li>
                <li>
                  <strong>Winter fog and humidity:</strong> Slow drying affects
                  curing, so schedule work in dry spells.
                </li>
                <li>
                  <strong>Ground moisture:</strong> Some low-lying areas hold
                  water after rain, which can affect basements and ground-floor
                  walls.
                </li>
                <li>
                  <strong>Older building stock:</strong> Many houses need extra
                  repair before waterproofing, so inspect before budgeting.
                </li>
                <li>
                  <strong>Apartment and society rules:</strong> Working hours
                  and material movement can affect scheduling.
                </li>
                <li>
                  <strong>Festival and wedding seasons:</strong> Finish roof,
                  bathroom and ceiling repairs before guests arrive.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Choose Your Waterproofing Package
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Essential package:</strong> Cleaning, crack repair
                  and a coating system for a standard area.
                </li>
                <li>
                  <strong>Flexible membrane package:</strong> PU system for
                  cracked, old or complex surfaces.
                </li>
                <li>
                  <strong>Roof and terrace package:</strong> Slope correction,
                  crack repair and a full waterproofing system.
                </li>
                <li>
                  <strong>Bathroom package:</strong> Floor and wall
                  waterproofing with a ponding test.
                </li>
                <li>
                  <strong>Basement package:</strong> Injection, coating and
                  drainage for damp or leaking basements.
                </li>
                <li>
                  <strong>External wall package:</strong> Crack filling and
                  protective coating.
                </li>
                <li>
                  <strong>Full-building plan:</strong> One prioritised plan
                  covering roof, bathrooms, walls and basement.
                </li>
                <li>
                  <strong>Phase-wise plan:</strong> One complete plan carried
                  out in stages to match your budget.
                </li>
              </ul>

              <p className="mt-3">
                Scope and specifications are agreed in writing before work
                begins, so you know exactly what is included.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Budget Priorities for Waterproofing
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>First:</strong> Stop active leaks and repair cracks.
                  Water already inside the structure does the most damage.
                </li>
                <li>
                  <strong>Second:</strong> Correct slope and drainage. Without
                  it, any system will struggle.
                </li>
                <li>
                  <strong>Third:</strong> Seal junctions, corners and pipe
                  entries. These are the weakest points.
                </li>
                <li>
                  <strong>Fourth:</strong> Apply the main waterproofing system
                  suited to the area and climate.
                </li>
                <li>
                  <strong>Fifth:</strong> Add protection, such as a topcoat or
                  screed.
                </li>
                <li>
                  <strong>Sixth:</strong> Restore finishes once the area is dry
                  and tested.
                </li>
                <li>
                  <strong>Seventh:</strong> Upgrades like insulation or new
                  flooring can follow later.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                How MTBOSS Approaches a Waterproofing Quote
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Step 1 — Enquiry and discussion:</strong> Contact
                  MTBOSS through the website, phone or WhatsApp and share the
                  problem area, size and your budget.
                </li>
                <li>
                  <strong>Step 2 — Budget Calculator:</strong> The free
                  calculator on our website gives a starting estimate before
                  the site visit.
                </li>
                <li>
                  <strong>Step 3 — Site visit and inspection:</strong> The team
                  studies cracks, slope, drains, joints and affected rooms.
                  Share your locality in Bareilly, and the team will confirm
                  arrangements.
                </li>
                <li>
                  <strong>Step 4 — Diagnosis and priority review:</strong> You
                  and the team decide what must be fixed first and what can
                  wait.
                </li>
                <li>
                  <strong>Step 5 — System recommendation:</strong> The team
                  explains the suggested treatment and why it suits your
                  property.
                </li>
                <li>
                  <strong>Step 6 — Itemised estimate:</strong> Current material
                  rates and a clear scope help prepare a realistic, item-wise
                  cost outline.
                </li>
                <li>
                  <strong>Step 7 — Specifications and agreement:</strong> Scope,
                  materials, coats, timeline and payment stages are written
                  down before work begins.
                </li>
                <li>
                  <strong>Step 8 — Surface preparation and repair:</strong>{" "}
                  Cleaning, removing failed layers, filling cracks and repairing
                  edges.
                </li>
                <li>
                  <strong>Step 9 — Junction and penetration treatment:</strong>{" "}
                  Pipes, corners and joints are sealed before the main coat.
                </li>
                <li>
                  <strong>Step 10 — Waterproofing application:</strong> The
                  chosen system is applied in coats, with proper drying between
                  layers.
                </li>
                <li>
                  <strong>Step 11 — Water or moisture test:</strong> The area
                  is tested, and the rooms below or beside it are checked.
                </li>
                <li>
                  <strong>Step 12 — Inspection and handover:</strong> A final
                  walk-through and correction of small defects precede
                  handover.
                </li>
                <li>
                  <strong>Step 13 — After-handover support:</strong> Painter,
                  tile and building repair services are available if you need
                  restoration.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Care After Waterproofing
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  Clear drains, gutters and outlets before every monsoon.
                </li>
                <li>
                  Avoid dragging heavy objects across treated surfaces.
                </li>
                <li>
                  Tell your contractor before drilling for solar, antenna or
                  railings.
                </li>
                <li>Fix leaking taps and pipes quickly.</li>
                <li>
                  Inspect the roof, bathrooms and walls once a year, ideally in
                  March or April.
                </li>
                <li>
                  Report new cracks early, since small repairs cost little.
                </li>
                <li>
                  Keep the treatment documents and warranty terms, if provided,
                  in a safe place.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Common Mistakes That Increase Waterproofing Cost
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  Choosing the cheapest quote and paying again next year.
                </li>
                <li>
                  Applying coatings on wet, dusty or loose surfaces.
                </li>
                <li>Coating over cracks without repairing them.</li>
                <li>Ignoring slope and drains.</li>
                <li>Skipping detailing at corners and pipes.</li>
                <li>Repainting before fixing the cause of the leak.</li>
                <li>Working during rain or high moisture.</li>
                <li>Skipping the water test.</li>
                <li>
                  Hiring separate agencies for repair, waterproofing and
                  finishing and managing them alone.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                What to Share to Get an Accurate Quote
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Property details:</strong> Locality in Bareilly, type
                  of building and approximate area.
                </li>
                <li>
                  <strong>Photos and videos:</strong> Damp patches, cracks,
                  stains and the affected rooms.
                </li>
                <li>
                  <strong>Leak history:</strong> When leaks started and when
                  they are worst.
                </li>
                <li>
                  <strong>Previous treatment:</strong> Any earlier coating or
                  repair and how long ago.
                </li>
                <li>
                  <strong>Area to be treated:</strong> Roof, bathroom,
                  basement, wall, tank or balcony.
                </li>
                <li>
                  <strong>Budget range:</strong> The amount you are comfortable
                  spending.
                </li>
                <li>
                  <strong>Timeline:</strong> Any festival, event or monsoon
                  deadline.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                MTBOSS Services for Homeowners and Building Owners
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Construction and renovation:</strong> New homes,
                  extra floors, remodelling, repairs and waterproofing.
                </li>
                <li>
                  <strong>Doorstep home services:</strong> Painter, electrician,
                  plumber, carpenter, tile and marble work and building repair
                  once waterproofing is done.
                </li>
                <li>
                  <strong>Property services:</strong> Verified property buying,
                  selling and renting.
                </li>
                <li>
                  <strong>Building materials:</strong> Cement, steel, bricks,
                  tiles and more through the Shop Now section of the website.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Why Choose MTBOSS for Waterproofing in Bareilly
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Diagnosis before pricing:</strong> We find the cause
                  before we write the quote.
                </li>
                <li>
                  <strong>Free Budget Calculator:</strong> A simple starting
                  estimate before you commit.
                </li>
                <li>
                  <strong>Transparent estimates:</strong> Written, itemised
                  quotes with scope and specifications stated clearly.
                </li>
                <li>
                  <strong>Builder and repair team together:</strong> Civil
                  repair, waterproofing and finishing planned as one job.
                </li>
                <li>
                  <strong>Wide coverage:</strong> Roofs, bathrooms, basements,
                  walls, balconies and tanks handled by one team.
                </li>
                <li>
                  <strong>Single point of contact:</strong> One team handles
                  inspection, repair, application, testing and handover.
                </li>
                <li>
                  <strong>On-time delivery focus:</strong> Work is scheduled in
                  sequence to avoid repeat visits.
                </li>
                <li>
                  <strong>Serving Moradabad and Bareilly:</strong> A company
                  based on Kanth Road, Moradabad, working in both cities.
                </li>
                <li>
                  <strong>Visible track record:</strong> A project gallery and
                  blog on our website.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Areas Served in Bareilly
              </h3>

              <p className="mb-3">
                Civil Lines, Rampur Garden, Izatnagar, Subhash Nagar, Pilibhit
                Bypass Road, Prem Nagar, Rajendra Nagar, Kargaina, DD Puram,
                Model Town, Satellite and nearby localities. Share your
                location with the team to confirm arrangements.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Contact MTBOSS: Waterproofing Quote in Bareilly
              </h3>

              <p className="mb-3">
                If you want a clear idea of waterproofing cost in Bareilly,
                MTBOSS offers a free budget calculator, a site inspection and
                an itemised written quote from a single point of contact.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Company:</strong> MTBOSS Construction Private Limited
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
                  <strong>Service page:</strong>{" "}
                  <a
                    href="https://www.mtboss.in/quick/water-proofing"
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.mtboss.in/quick/water-proofing
                  </a>
                </li>
                <li>
                  <strong>Budget Calculator:</strong>{" "}
                  <a
                    href="https://www.mtboss.in/calculator"
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.mtboss.in/calculator
                  </a>
                </li>
                <li>
                  <strong>Phone / Call:</strong>{" "}
                  <a
                    href="tel:+919458410866"
                    className="text-blue-600 underline"
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
                    Chat on WhatsApp
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
                  <strong>Office Address:</strong> Harthala, Kanth Road, Behind
                  KR Collection, near Domino&apos;s, Moradabad, Uttar Pradesh,
                  India.
                </li>
                <li>
                  <strong>Free Quote:</strong> Use the “Get a Construction
                  Quote” option on the website, or contact the team directly by
                  phone or WhatsApp.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Frequently Asked Questions (FAQs)
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-3">
                <li>
                  <strong>Q1. What is the waterproofing cost in Bareilly?</strong>
                  <br />
                  It depends on the area, system, surface condition, detailing
                  and finishing work. Broad market guides exist, but an accurate
                  figure needs a site inspection. Use the free MTBOSS Budget
                  Calculator for a starting estimate.
                </li>

                <li>
                  <strong>
                    Q2. What is the waterproofing rate per square foot in
                    Bareilly?
                  </strong>
                  <br />
                  Rates vary by system and area, from simple coatings to PU
                  membranes. Roofs, bathrooms and basements are priced
                  differently, so ask for an item-wise quote.
                </li>

                <li>
                  <strong>
                    Q3. Why do waterproofing quotes differ so much?
                  </strong>
                  <br />
                  Quotes differ in system, number of coats, preparation,
                  detailing, testing and inclusions. Compare the scope, not
                  only the price.
                </li>

                <li>
                  <strong>
                    Q4. Does MTBOSS provide waterproofing services in Bareilly?
                  </strong>
                  <br />
                  MTBOSS Construction Private Limited serves Moradabad and
                  Bareilly and offers waterproofing as one of its services.
                  Share your property details with the team to confirm scope
                  and arrangements.
                </li>

                <li>
                  <strong>
                    Q5. Is roof waterproofing more expensive than bathroom
                    waterproofing?
                  </strong>
                  <br />
                  It depends on the area and condition. Roofs are larger, but
                  bathrooms need detailed work at pipes and junctions, so the
                  rate per square foot can be higher.
                </li>

                <li>
                  <strong>Q6. Can I reduce waterproofing cost?</strong>
                  <br />
                  Yes. Fix leaks early, combine repair and waterproofing,
                  choose the right system, book before the monsoon and phase
                  the work. Avoid cutting preparation or detailing, which
                  usually costs more later.
                </li>

                <li>
                  <strong>
                    Q7. Are painting and tiling included in the waterproofing
                    cost?
                  </strong>
                  <br />
                  Not always. Ask for finishing work to be listed separately in
                  the quote.
                </li>

                <li>
                  <strong>
                    Q8. Does waterproofing cost more during the monsoon?
                  </strong>
                  <br />
                  Work during heavy rain can face delays and may affect cost.
                  Planning before or after the monsoon is usually better for
                  the full system.
                </li>
              </ul>
            </section>
          </div>
        </div>

        {/* Form Section */}
        <div className="order-2 w-full p-8 lg:order-2 lg:w-[450px]">
          <div className="lg:sticky lg:top-28">
            <LandingEnquiry />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;