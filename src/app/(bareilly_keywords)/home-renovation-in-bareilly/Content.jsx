import React from "react";
import LandingEnquiry from "../../components/LandingEnquiry";

const Content = () => {
  return (
    <div className="min-h-screen bg-white pt-0">
      <div className="flex flex-col lg:flex-row">
        {/* Content Section */}
        <div className="order-1 flex-1 px-4 py-12 sm:px-8 md:px-16 lg:order-1">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl md:text-3xl">
            Plan It in the Right Order and Pay Only Once
          </h2>

          <div className="max-w-4xl space-y-6 leading-relaxed text-gray-700">
            <section>
              <p>
                A renovation can make an old house feel new, or it can turn
                into months of dust, delays and repeat work. The difference is
                rarely the budget. It is the order in which the work is
                planned. When wall repair, plumbing, wiring, waterproofing,
                flooring, carpentry and painting are done in the wrong
                sequence, new work gets damaged by the next trade, and you end
                up paying twice.
              </p>

              <p className="mt-3">
                If you are planning home renovation in Bareilly, this page will
                help you do three things: understand what a renovation
                involves, know what to check before you start, and see how
                MTBOSS plans and carries out renovation for houses, flats and
                older homes. MTBOSS Construction Private Limited is an
                architect, interior designer and construction company serving
                Moradabad and Bareilly. It offers renovation, repairs,
                waterproofing, interiors, modular kitchens, carpentry and other
                home services with transparent pricing and on-time delivery.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Home Renovation at a Glance
              </h3>

              <p className="mb-3">
                Your house, budget and priorities matter more than any
                template. MTBOSS helps you plan a renovation that fits your
                property and your timeline.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2">
                        Renovation area
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Common work
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Planning priority
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Structure and walls
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Crack repair, plaster repair, wall changes
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Safety, strength, damp control
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Roof and terrace
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Leak repair, waterproofing, slope correction
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Stopping water entry
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Plumbing
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        New lines, fittings, drainage repair
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Leak-free, correct slope
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Electrical
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Rewiring, new points, load upgrade, lighting
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Safety, capacity, positions
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Flooring
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Tile, marble or stone replacement, polishing
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Level, subfloor, finish
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Bathrooms
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Full remodel, waterproofing, new fittings
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Waterproofing, drainage, ventilation
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Kitchen
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        New layout, cabinets, tiles, countertop
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Services, moisture, storage
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Doors and windows
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Replacement, repair, new frames
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Fit, security, termite protection
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Interior carpentry
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Wardrobes, panels, units
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Material, hardware, finish
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        False ceiling and lighting
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        New ceilings, lights
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Wiring, height, look
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Painting
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Interior and exterior painting
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Surface preparation, finish
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Exterior
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Facade, boundary wall, balcony repairs
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Weather protection
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
                Home Renovation Services Offered by MTBOSS for Bareilly Clients
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Site inspection and assessment:</strong> Checking
                  walls, roof, floors, plumbing, wiring, damp patches and
                  structure.
                </li>
                <li>
                  <strong>Renovation planning:</strong> A written scope,
                  priorities and a phase-wise plan before work begins.
                </li>
                <li>
                  <strong>Civil and repair work:</strong> Plaster repair, crack
                  filling, wall changes and platform work.
                </li>
                <li>
                  <strong>Waterproofing:</strong> Roof, terrace, bathroom, wall
                  and basement waterproofing where needed.
                </li>
                <li>
                  <strong>Plumbing work:</strong> New lines, fittings, drainage
                  repair and fixture replacement.
                </li>
                <li>
                  <strong>Electrical work:</strong> Rewiring, switchboards,
                  additional points and lighting plans.
                </li>
                <li>
                  <strong>Flooring and tiling:</strong> Tile, marble or stone
                  work, polishing and skirting.
                </li>
                <li>
                  <strong>Bathroom renovation:</strong> Complete bathroom
                  remodelling with waterproofing and new fittings.
                </li>
                <li>
                  <strong>Kitchen renovation:</strong> New layout, modular
                  kitchen, tiles and countertop.
                </li>
                <li>
                  <strong>Doors and windows:</strong> Repair or replacement
                  with frames, locks and finish.
                </li>
                <li>
                  <strong>Carpentry and interiors:</strong> Wardrobes, wall
                  panels, units and furniture.
                </li>
                <li>
                  <strong>False ceiling and lighting:</strong> Ceiling design
                  and lighting plans.
                </li>
                <li>
                  <strong>Painting and finishing:</strong> Interior and
                  exterior painting with proper surface preparation.
                </li>
                <li>
                  <strong>Related home services:</strong> Painter, electrician,
                  plumber, carpenter, tile and marble, false ceiling and other
                  services through the same company.
                </li>
              </ul>

              <p className="mt-3">
                Final scope for each project is discussed and confirmed with
                the MTBOSS team before work begins.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Types of Renovation: Choose Your Level
              </h3>

              <p className="mb-3">
                Knowing your level helps you set the budget and timeline before
                you speak to any contractor.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2">
                        Level
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        What it covers
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Best for
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Repair and refresh
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Painting, minor repairs, polish, fixture replacement
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Homes in fair condition
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Partial renovation
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        One or two areas, such as a kitchen and bathrooms
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Targeted upgrades
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Full interior renovation
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Flooring, electrical, plumbing, ceilings, carpentry,
                        painting
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Older homes needing a complete refresh
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Structural renovation
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Wall changes, extra rooms, new floors
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Changing layout or expanding
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Exterior renovation
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Facade, roof, boundary wall, balcony
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Weather-damaged or dated exteriors
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Whole-house renovation
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Interior, exterior and services together
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Homes needing comprehensive work
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                First Inspect, Then Plan: What a Good Assessment Covers
              </h3>

              <p className="mb-3">
                A good renovation starts with inspection, not demolition.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Structure:</strong> Cracks, settlement, damp patches
                  and signs of structural stress.
                </li>
                <li>
                  <strong>Roof and terrace:</strong> Leaks, slope, drainage,
                  cracks and existing waterproofing condition.
                </li>
                <li>
                  <strong>Walls:</strong> Plaster condition, damp, seepage and
                  efflorescence.
                </li>
                <li>
                  <strong>Plumbing:</strong> Old pipes, leaks, water pressure,
                  drainage speed and fixtures.
                </li>
                <li>
                  <strong>Electrical:</strong> Wiring age, capacity, earthing,
                  switchboards and overloaded circuits.
                </li>
                <li>
                  <strong>Floors:</strong> Level, cracks, hollow tiles and
                  surface condition.
                </li>
                <li>
                  <strong>Doors and windows:</strong> Frame condition, termite
                  signs, alignment and security.
                </li>
                <li>
                  <strong>Ventilation and light:</strong> Air flow, natural
                  light and room layout.
                </li>
              </ul>

              <p className="mt-3">
                Fixing visible finishes without checking these hidden problems
                is the most common reason renovations fail.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                The Correct Order of Work in a Home Renovation
              </h3>

              <p className="mb-3">
                The sequence matters. A wrong order leads to broken tiles,
                damaged paint and repeat expense.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2">
                        Step
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Work
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Why this order
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">1</td>
                      <td className="border border-gray-300 px-3 py-2">
                        Inspection, design and scope
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Everything depends on the plan
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">2</td>
                      <td className="border border-gray-300 px-3 py-2">
                        Structural and civil repairs
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Walls, slabs and openings must be sound
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">3</td>
                      <td className="border border-gray-300 px-3 py-2">
                        Waterproofing and leak repair
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Stops water before finishing begins
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">4</td>
                      <td className="border border-gray-300 px-3 py-2">
                        Plumbing and electrical first-fix
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Pipes and wires go behind finished surfaces
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">5</td>
                      <td className="border border-gray-300 px-3 py-2">
                        Plaster and wall preparation
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Prepares clean base for finishes
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">6</td>
                      <td className="border border-gray-300 px-3 py-2">
                        Flooring and wall tiling
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Sets the base for carpentry and fittings
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">7</td>
                      <td className="border border-gray-300 px-3 py-2">
                        False ceiling work
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Done before final painting
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">8</td>
                      <td className="border border-gray-300 px-3 py-2">
                        Carpentry, doors and windows
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Fitted into prepared spaces
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">9</td>
                      <td className="border border-gray-300 px-3 py-2">
                        Painting and polish
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Applied after dust-heavy work is done
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">10</td>
                      <td className="border border-gray-300 px-3 py-2">
                        Fixtures, lights, hardware and final fittings
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Fitted last to protect them
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">11</td>
                      <td className="border border-gray-300 px-3 py-2">
                        Cleaning, inspection and handover
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Final check before use
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-3">
                Painting before civil and electrical work, or fitting carpentry
                before tiles, are common mistakes that waste money.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Waterproofing and Damp Control: Fix the Water First
              </h3>

              <p className="mb-3">
                In Bareilly, monsoon rain, humidity and older buildings make
                waterproofing a priority.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Roof and terrace:</strong> Leaks and cracks should be
                  treated before any interior work.
                </li>
                <li>
                  <strong>Bathrooms:</strong> Waterproofing under tiles and at
                  pipe entries prevents seepage to rooms below.
                </li>
                <li>
                  <strong>External walls:</strong> Cracks and weak plaster let
                  rain in and cause damp patches inside.
                </li>
                <li>
                  <strong>Basements and ground-floor walls:</strong> Rising
                  damp and seepage need special treatment.
                </li>
                <li>
                  <strong>Balconies and sunshades:</strong> Slope and edge
                  sealing prevent water collection.
                </li>
              </ul>

              <p className="mt-3">
                New paint, wood and flooring will not last on top of a leaking
                or damp surface.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                What a Good Renovation Contractor Actually Does
              </h3>

              <p className="mb-3">
                The job is more than hiring labour. A reliable renovation
                contractor follows a sequence, and you should expect to see it.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Inspects before quoting:</strong> A price given
                  without seeing the house is only a guess.
                </li>
                <li>
                  <strong>Finds the real problems:</strong> Cracks, leaks, damp
                  and old wiring are identified.
                </li>
                <li>
                  <strong>Prepares a written scope:</strong> What will be done,
                  what will not, and in what order.
                </li>
                <li>
                  <strong>Plans phases:</strong> Work is divided so you can
                  live in the house or manage costs.
                </li>
                <li>
                  <strong>Uses suitable materials:</strong> Boards, tiles,
                  paints and fittings are matched to each area.
                </li>
                <li>
                  <strong>Coordinates all trades:</strong> Civil, plumbing,
                  electrical, tiling, carpentry and painting are sequenced.
                </li>
                <li>
                  <strong>Protects your belongings:</strong> Furniture, floors
                  and fixtures are covered.
                </li>
                <li>
                  <strong>Supervises on site:</strong> Someone responsible
                  checks progress and quality.
                </li>
                <li>
                  <strong>Manages dust and debris:</strong> Cleaning and waste
                  removal are planned.
                </li>
                <li>
                  <strong>Tests before handover:</strong> Water, power, drains,
                  doors and fittings are checked.
                </li>
                <li>
                  <strong>Puts it in writing:</strong> Scope, price, timeline,
                  payments and warranty are recorded.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Questions to Ask Before You Hire a Renovation Contractor
              </h3>

              <p className="mb-3">
                Use these questions with any contractor, including us.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>
                    Will you inspect the whole house before quoting?
                  </strong>{" "}
                  The answer should be yes.
                </li>
                <li>
                  <strong>
                    What problems did you find, and how will you fix them?
                  </strong>{" "}
                  Ask for a clear explanation.
                </li>
                <li>
                  <strong>What is the scope, and what is excluded?</strong> Get
                  it in writing.
                </li>
                <li>
                  <strong>In what order will the work be done?</strong> Ask for
                  a stage-wise plan.
                </li>
                <li>
                  <strong>Who supervises the work on site?</strong> You should
                  know who is responsible.
                </li>
                <li>
                  <strong>Which materials and brands are included?</strong> Get
                  names, not general words.
                </li>
                <li>
                  <strong>
                    How will you protect my belongings and manage dust?
                  </strong>{" "}
                  Ask for specifics.
                </li>
                <li>
                  <strong>Can I stay at home during the work?</strong> Ask
                  about timing, noise and access.
                </li>
                <li>
                  <strong>How are payments structured?</strong> They should
                  follow completed stages.
                </li>
                <li>
                  <strong>What warranty or follow-up is offered?</strong> Get
                  the terms written.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Warning Signs of a Weak Renovation Contractor
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>Quotes a price without inspecting the house.</li>
                <li>Cannot explain the order of work.</li>
                <li>
                  Offers a lump-sum quote with no item-wise breakup.
                </li>
                <li>
                  Starts painting or finishing before fixing leaks and damp.
                </li>
                <li>
                  Uses words like &quot;best quality&quot; without naming
                  materials.
                </li>
                <li>
                  Asks for a very large advance before starting.
                </li>
                <li>
                  Has no written scope, timeline or warranty.
                </li>
                <li>Leaves the site unsupervised for days.</li>
                <li>
                  Changes the price repeatedly during the work without written
                  approval.
                </li>
                <li>Cannot show any completed projects.</li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Planning by Property Type
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Independent House or Villa:</strong> Larger properties
                  benefit from a phase-wise plan. Start with structure, roof and
                  services, then interiors and finishing.
                </li>
                <li>
                  <strong>Apartment or Flat:</strong> Work must follow society
                  rules on timing, noise and material movement. Structural
                  changes usually need approval. Confirm lift use and working
                  hours before starting.
                </li>
                <li>
                  <strong>Older or Inherited Home:</strong> Old buildings often
                  have outdated wiring, weak plaster, damp walls and termite
                  damage. A thorough inspection decides what to repair and what
                  to replace.
                </li>
                <li>
                  <strong>Duplex or Multi-Storey Home:</strong> Staircases,
                  terraces and multiple bathrooms increase waterproofing and
                  plumbing planning.
                </li>
                <li>
                  <strong>Rented Home:</strong> Check with the landlord before
                  making changes. Keep work light and reversible.
                </li>
                <li>
                  <strong>Commercial Property:</strong> Shops and offices need
                  work planned to limit business downtime, with a neat and
                  durable finish.
                </li>
                <li>
                  <strong>Pre-Sale or Pre-Rental Refresh:</strong> Focus on
                  paint, minor repairs, lighting and presentable bathrooms and
                  kitchens.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Bareilly Planning Notes for Home Renovation
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Monsoon rain:</strong> Complete roof, terrace and wall
                  waterproofing before the heavy rains, and avoid exterior
                  finishing during rain.
                </li>
                <li>
                  <strong>Summer heat:</strong> Heat affects curing and worker
                  comfort, so plan work hours and material handling sensibly.
                </li>
                <li>
                  <strong>Winter fog and dampness:</strong> Slow drying affects
                  plaster, tile adhesive and paint, so allow extra curing time.
                </li>
                <li>
                  <strong>Older house walls:</strong> Uneven walls and old
                  plaster need careful preparation.
                </li>
                <li>
                  <strong>Old wiring and plumbing:</strong> Many older houses
                  need new lines before finishing work.
                </li>
                <li>
                  <strong>Termite risk:</strong> Wooden frames, doors and
                  built-in furniture benefit from treatment.
                </li>
                <li>
                  <strong>Ground moisture:</strong> Some low-lying areas hold
                  water, affecting ground-floor walls and basements.
                </li>
                <li>
                  <strong>Festival and wedding seasons:</strong> Plan completion
                  well before guests arrive, with buffer time for delays.
                </li>
                <li>
                  <strong>Society and neighbour rules:</strong> Check working
                  hours, debris disposal and noise restrictions.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Choose Your Renovation Plan
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Repair and refresh plan:</strong> Painting, minor
                  repairs, polish and fixture replacement.
                </li>
                <li>
                  <strong>Kitchen and bathroom plan:</strong> Remodelling the
                  most-used and most water-prone areas.
                </li>
                <li>
                  <strong>Waterproofing and repair plan:</strong> Fixing leaks,
                  damp and cracks before any finishing.
                </li>
                <li>
                  <strong>Interior refresh plan:</strong> Flooring, ceilings,
                  carpentry and painting.
                </li>
                <li>
                  <strong>Full interior renovation plan:</strong> Electrical,
                  plumbing, flooring, carpentry, ceilings and painting
                  together.
                </li>
                <li>
                  <strong>Exterior renovation plan:</strong> Facade, roof,
                  boundary wall and balcony work.
                </li>
                <li>
                  <strong>Extension plan:</strong> Additional rooms or floors,
                  subject to structure and approvals.
                </li>
                <li>
                  <strong>Whole-house renovation plan:</strong> Interior and
                  exterior planned as one project.
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
                Factors That Affect Home Renovation Cost in Bareilly
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Size of the house:</strong> More area means more work
                  and material.
                </li>
                <li>
                  <strong>Scope and level:</strong> A refresh costs far less
                  than a full renovation.
                </li>
                <li>
                  <strong>Condition of the building:</strong> Structural, damp
                  and wiring problems add repair work.
                </li>
                <li>
                  <strong>Material and brand choices:</strong> Tiles, paint,
                  boards, fittings and fixtures vary widely in price.
                </li>
                <li>
                  <strong>Waterproofing needs:</strong> Roof, bathroom and wall
                  treatment add to the budget.
                </li>
                <li>
                  <strong>Plumbing and electrical work:</strong> Rewiring and
                  re-piping can be a major part of the cost.
                </li>
                <li>
                  <strong>Number of bathrooms and kitchens:</strong> These are
                  the most expensive areas per square foot.
                </li>
                <li>
                  <strong>Carpentry and interiors:</strong> Wardrobes, panels
                  and units add significant cost.
                </li>
                <li>
                  <strong>Demolition and debris:</strong> Removing old items
                  and waste adds cost.
                </li>
                <li>
                  <strong>Design complexity:</strong> Layout changes, ceilings
                  and special details add labour.
                </li>
                <li>
                  <strong>Timeline:</strong> Faster schedules can change the
                  price.
                </li>
                <li>
                  <strong>Permissions:</strong> Some work, especially
                  structural changes, may need approvals.
                </li>
              </ul>

              <p className="mt-3">
                Renovation is generally priced by scope, area and material, and
                the range is wide because choices differ. Your quote depends on
                the inspection, so use the free MTBOSS Budget Calculator on the
                website for a starting estimate and request a detailed quote
                after the site visit.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Budget Priorities for Home Renovation
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>First:</strong> Safety and structure. Fix cracks,
                  damp and unsafe wiring before anything else.
                </li>
                <li>
                  <strong>Second:</strong> Water control. Roof, terrace and
                  bathroom waterproofing protect all later work.
                </li>
                <li>
                  <strong>Third:</strong> Services. Plumbing and electrical
                  upgrades should be done before finishes.
                </li>
                <li>
                  <strong>Fourth:</strong> High-use areas. Kitchen and
                  bathrooms deliver the most daily value.
                </li>
                <li>
                  <strong>Fifth:</strong> Flooring and walls. Choose durable
                  finishes for living areas.
                </li>
                <li>
                  <strong>Sixth:</strong> Carpentry and storage. Add wardrobes
                  and units that suit your family.
                </li>
                <li>
                  <strong>Seventh:</strong> Decorative finishes. Painting,
                  lighting and decor can follow, and extras can be phased.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Living at Home During Renovation
              </h3>

              <p className="mb-3">
                Many families stay in the house during renovation. A little
                planning helps.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Renovate in zones:</strong> Complete one area at a
                  time, so you always have a usable kitchen and bathroom.
                </li>
                <li>
                  <strong>Protect floors and furniture:</strong> Ask for
                  covers, and move valuables away from work areas.
                </li>
                <li>
                  <strong>Plan dust control:</strong> Seal doors, cover vents
                  and ask for dust-heavy work to be done outside where
                  possible.
                </li>
                <li>
                  <strong>Plan for water and power cuts:</strong> Agree timings
                  in advance.
                </li>
                <li>
                  <strong>Keep children, elders and pets safe:</strong> Tools,
                  wires, debris and wet floors are hazards.
                </li>
                <li>
                  <strong>Agree working hours:</strong> Match the schedule with
                  your routine and society rules.
                </li>
                <li>
                  <strong>Keep one person in charge:</strong> Decisions should
                  come from one family member.
                </li>
                <li>
                  <strong>Consider temporary stay:</strong> For full
                  renovations, moving out for a short period may save time and
                  stress.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                How MTBOSS Approaches a Home Renovation Project
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Step 1 — Enquiry and discussion:</strong> Contact
                  MTBOSS through the website, phone or WhatsApp and share what
                  you want to renovate, the property type and your budget.
                </li>
                <li>
                  <strong>Step 2 — Photos and details:</strong> Sending photos
                  or a short video of problem areas helps the team prepare
                  before the visit.
                </li>
                <li>
                  <strong>Step 3 — Budget Calculator:</strong> The free
                  calculator on our website gives a starting estimate.
                </li>
                <li>
                  <strong>Step 4 — Site visit and inspection:</strong> The team
                  checks structure, roof, walls, plumbing, wiring, floors and
                  damp. Share your locality in Bareilly, and the team will
                  confirm arrangements.
                </li>
                <li>
                  <strong>Step 5 — Findings and priorities:</strong> You and
                  the team discuss what must be fixed first and what can wait.
                </li>
                <li>
                  <strong>Step 6 — Design and scope:</strong> The team prepares
                  a scope and layout, with drawings where needed.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Care After Your Renovation
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  Allow paint, polish and new plaster to cure fully before
                  heavy use.
                </li>
                <li>
                  Clear drains, gutters and outlets before every monsoon.
                </li>
                <li>
                  Fix any leaking taps, pipes or cracks early.
                </li>
                <li>
                  Ventilate rooms regularly to limit damp and mould.
                </li>
                <li>
                  Avoid drilling into waterproofed areas without advice.
                </li>
                <li>
                  Service electrical points, switchboards and plumbing fittings
                  once a year.
                </li>
                <li>
                  Touch up paint and polish when marks appear.
                </li>
                <li>
                  Keep bills, specifications and warranty terms, if provided,
                  in a safe place.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Common Mistakes in Home Renovation
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  Starting with paint and decor before fixing leaks, damp and
                  wiring.
                </li>
                <li>
                  Hiring on a phone quote without an inspection.
                </li>
                <li>
                  Skipping a written scope, timeline and payment plan.
                </li>
                <li>
                  Doing work in the wrong order and damaging finished surfaces.
                </li>
                <li>
                  Ignoring waterproofing in bathrooms, terraces and external
                  walls.
                </li>
                <li>
                  Choosing the cheapest quote without comparing scope and
                  materials.
                </li>
                <li>
                  Overspending on finishes and underspending on services and
                  waterproofing.
                </li>
                <li>
                  Not planning for hidden problems and keeping no contingency
                  budget.
                </li>
                <li>
                  Paying a large advance before work starts.
                </li>
                <li>
                  Not protecting furniture and floors during work.
                </li>
                <li>
                  Hiring separate agencies for each trade and managing them
                  alone.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                What to Share at Your First Consultation
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Property details:</strong> Locality in Bareilly, type
                  of property, age and approximate area.
                </li>
                <li>
                  <strong>Photos and videos:</strong> Problem areas, such as
                  leaks, cracks, damp walls and old fittings.
                </li>
                <li>
                  <strong>Renovation goals:</strong> Repair, refresh, remodel,
                  extend or a full makeover.
                </li>
                <li>
                  <strong>Rooms and areas involved:</strong> Kitchen,
                  bathrooms, bedrooms, roof, exterior and others.
                </li>
                <li>
                  <strong>Known problems:</strong> Leaks, termites, wiring
                  issues, damp patches and structural worries.
                </li>
                <li>
                  <strong>Family needs:</strong> Number of members, children,
                  elders and special requirements.
                </li>
                <li>
                  <strong>Style preferences:</strong> Colours, materials and
                  designs you like.
                </li>
                <li>
                  <strong>Budget range:</strong> The amount you are comfortable
                  spending.
                </li>
                <li>
                  <strong>Timeline:</strong> Any festival, wedding, move-in or
                  exam deadline.
                </li>
                <li>
                  <strong>Access details:</strong> Floor, lift, parking, debris
                  disposal and society rules.
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
                  <strong>Architecture and interior:</strong> Planned design
                  for kitchens, bedrooms, living areas and offices.
                </li>
                <li>
                  <strong>Doorstep home services:</strong> Carpenter, painter,
                  electrician, plumber, tile and marble, false ceiling and
                  more.
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
                Why Choose MTBOSS for Home Renovation in Bareilly
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Inspect first, quote later:</strong> We study the
                  property before suggesting a plan or price.
                </li>
                <li>
                  <strong>Problems before polish:</strong> We fix leaks, damp,
                  wiring and structure before finishing work.
                </li>
                <li>
                  <strong>Correct order of work:</strong> Each trade follows
                  the right sequence to protect your investment.
                </li>
                <li>
                  <strong>Builder and interior team together:</strong> Civil,
                  waterproofing, plumbing, electrical, carpentry and painting
                  are planned as one project.
                </li>
                <li>
                  <strong>Phase-wise planning:</strong> Work can be divided
                  into stages to match your budget and lifestyle.
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
                  <strong>Single point of contact:</strong> One team handles
                  inspection, repair, finishing and handover.
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
                Contact MTBOSS: Home Renovation in Bareilly
              </h3>

              <p className="mb-3">
                If you are planning home renovation in Bareilly, MTBOSS offers
                a single point of contact for inspection, planning, repair,
                finishing and handover, supported by a free budget calculator
                and a simple online quote request.
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
                    href="https://www.mtboss.in/quick/architecture-interior"
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.mtboss.in/quick/architecture-interior
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
                  <strong>
                    Q1. What does home renovation in Bareilly include?
                  </strong>
                  <br />
                  It can include repairs, waterproofing, plumbing, electrical
                  work, flooring, bathrooms, kitchens, carpentry, ceilings and
                  painting, depending on your scope. The exact scope is written
                  in the agreement.
                </li>

                <li>
                  <strong>
                    Q2. Does MTBOSS provide home renovation in Bareilly?
                  </strong>
                  <br />
                  MTBOSS Construction Private Limited serves Moradabad and
                  Bareilly and offers renovation as one of its services. Share
                  your locality and requirements with the team to confirm scope
                  and arrangements.
                </li>

                <li>
                  <strong>
                    Q3. Where should I start with home renovation?
                  </strong>
                  <br />
                  Start with an inspection to find structural problems, leaks,
                  damp, wiring and plumbing issues. Fix these before spending
                  on finishes and decor.
                </li>

                <li>
                  <strong>
                    Q4. In what order should renovation work be done?
                  </strong>
                  <br />
                  Generally: inspection and design, structural and civil
                  repairs, waterproofing, plumbing and electrical, plaster and
                  flooring, ceilings, carpentry and doors, painting, and then
                  fixtures and final cleaning.
                </li>

                <li>
                  <strong>
                    Q5. Can I live in my house during renovation?
                  </strong>
                  <br />
                  Often yes, if the work is planned in zones with dust and
                  safety precautions. For full renovations, a short temporary
                  stay can save time and stress.
                </li>

                <li>
                  <strong>
                    Q6. How much does home renovation cost in Bareilly?
                  </strong>
                  <br />
                  The cost depends on house size, scope, condition, materials,
                  waterproofing, services and design complexity. Use the free
                  MTBOSS Budget Calculator for a starting estimate and request
                  a detailed quote after a site visit.
                </li>

                <li>
                  <strong>
                    Q7. How long does home renovation take?
                  </strong>
                  <br />
                  A repair and refresh takes less time than a full renovation.
                  The timeline depends on scope, condition, material
                  availability and weather, and it is confirmed in your
                  agreement.
                </li>

                <li>
                  <strong>Q8. Do I need permission for renovation?</strong>
                  <br />
                  Cosmetic and interior work usually does not, but structural
                  changes, extensions and exterior alterations may need
                  approvals from the relevant authority or society. Check
                  before starting.
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