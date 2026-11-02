import React from "react";
import LandingEnquiry from "../../components/LandingEnquiry";

const Content = () => {
  return (
    <div className="min-h-screen bg-white pt-0">
      <div className="flex flex-col lg:flex-row">
        {/* Content Section */}
        <div className="order-1 flex-1 px-4 py-12 sm:px-8 md:px-16 lg:order-1">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl md:text-3xl">
            Respect What Is Strong, Fix What Is Hidden
          </h2>

          <div className="max-w-4xl space-y-6 leading-relaxed text-gray-700">
            <section>
              <p>
                An old house is not just a building. It may be a family home,
                an inheritance or a property you bought for its location and
                space. It often has thick walls, good ventilation and a solid
                feel that newer buildings lack. But it also carries years of
                wear: damp walls, weak plaster, cracked roofs, tired wiring,
                rusted pipes and termites in the wood. Painting over these
                problems looks good for a season. It does not solve them.
              </p>

              <p className="mt-3">
                If you are planning old house renovation in Bareilly, this page
                will help you do three things: understand what to inspect
                first, decide what to keep and what to replace, and plan the
                work in an order that protects your money and the building.
                MTBOSS Construction Private Limited is an architect, interior
                designer and construction company serving Moradabad and
                Bareilly. It offers renovation, repairs, waterproofing,
                interiors, modular kitchens, carpentry and other home services
                with transparent pricing and on-time delivery.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Old House Renovation at a Glance
              </h3>

              <p className="mb-3">
                Your house, its age and its condition matter more than any
                template. MTBOSS helps you plan renovation that respects the
                building you have.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2">
                        Area
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Common problem in old houses
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Planning priority
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Structure
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Cracks, settlement, weak lintels, bulging walls
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Safety, assessment before any work
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Roof and terrace
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Leaks, cracked surface, blocked drains, worn
                        waterproofing
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Stop water entry first
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Walls and plaster
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Damp, salt marks, peeling plaster, hollow patches
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Find the source of moisture
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Wiring
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Old, overloaded or unsafe wiring, few points
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Safety and capacity
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Plumbing
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Rusted pipes, leaks, slow drainage, old fittings
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Replace before finishing
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Flooring
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Cracked, uneven or hollow floors, worn finish
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Level and subfloor condition
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Doors and windows
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Termite damage, warped frames, weak locks
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Repair or replace
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Bathrooms and kitchen
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Outdated layout, seepage, poor ventilation
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Waterproofing and layout
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Termites and pests
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Mud trails, hollow wood, damaged frames
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Treatment before repair
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Layout and light
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Dark rooms, small windows, poor air flow
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Improve without weakening structure
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
                Old House Renovation Services Offered by MTBOSS for Bareilly
                Clients
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Site inspection and condition assessment:</strong>{" "}
                  Checking structure, roof, walls, floors, plumbing, wiring,
                  damp and termite signs.
                </li>
                <li>
                  <strong>Renovation planning:</strong> A written scope,
                  priorities and a phase-wise plan before work begins.
                </li>
                <li>
                  <strong>Crack and plaster repair:</strong> Repairing cracks,
                  hollow plaster, damp-affected walls and weak surfaces.
                </li>
                <li>
                  <strong>Roof and terrace waterproofing:</strong> Leak repair,
                  surface treatment and drainage correction.
                </li>
                <li>
                  <strong>Damp and seepage treatment:</strong> Finding sources
                  of moisture and treating walls and floors.
                </li>
                <li>
                  <strong>Rewiring and electrical upgrade:</strong> New wiring,
                  points, boards, earthing and lighting plans.
                </li>
                <li>
                  <strong>Plumbing replacement:</strong> New pipes, drainage
                  fixes and fixture replacement.
                </li>
                <li>
                  <strong>Flooring and tiling:</strong> Removal of old floors,
                  new tiles or polishing, and skirting.
                </li>
                <li>
                  <strong>Bathroom and kitchen renovation:</strong>{" "}
                  Remodelling with waterproofing, fittings and modular
                  kitchens.
                </li>
                <li>
                  <strong>Doors, windows and carpentry:</strong> Repair,
                  replacement, termite-safe frames, wardrobes and panels.
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
                Step One: Inspect Before You Decide Anything
              </h3>

              <p className="mb-3">
                In an old house, what you cannot see matters more than what you
                can. A proper inspection should cover the following.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Structure:</strong> Look for diagonal cracks, wide
                  cracks, bulging or leaning walls, sagging beams and signs of
                  settlement.
                </li>
                <li>
                  <strong>Roof and slabs:</strong> Check for leaks, cracks,
                  sagging, exposed or rusted reinforcement and blocked drainage.
                </li>
                <li>
                  <strong>Walls:</strong> Look for damp patches, salt deposits,
                  peeling paint and hollow-sounding plaster.
                </li>
                <li>
                  <strong>Foundation and plinth:</strong> Check for rising
                  damp, cracks near the base and water collection.
                </li>
                <li>
                  <strong>Wiring:</strong> Check age, type, overloaded
                  circuits, missing earthing and unsafe joints.
                </li>
                <li>
                  <strong>Plumbing:</strong> Check pipe material, leaks, water
                  pressure, drain speed and old fixtures.
                </li>
                <li>
                  <strong>Wood:</strong> Tap doors, frames and beams for hollow
                  sounds and look for termite trails.
                </li>
                <li>
                  <strong>Floors:</strong> Check level, hollow tiles, cracks
                  and surface wear.
                </li>
                <li>
                  <strong>Ventilation and light:</strong> Note dark rooms,
                  blocked windows and poor air flow.
                </li>
              </ul>

              <p className="mt-3">
                If the inspection finds serious structural signs, such as wide
                cracks, bulging walls or a sagging slab, a structural
                engineer&apos;s opinion should come before any cosmetic work.
                Safety comes first.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                What to Keep, Repair or Replace
              </h3>

              <p className="mb-3">
                Old houses often have good solid wood, thick walls and
                character details worth saving. Wiring and plumbing, however,
                are usually worth replacing completely, because they are
                hidden, hard to fix later and tied to safety.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2">
                        Item
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Usually keep and repair if
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Usually replace if
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Walls
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Structurally sound, cracks are minor
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Bulging, badly cracked or damp beyond repair
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Plaster
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Mostly firm, small patches loose
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Large hollow areas or salt-damaged
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Roof surface
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Structure is sound, waterproofing worn
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Slab shows serious damage
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Wiring
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Rarely suitable to keep in full
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Old, overloaded, no earthing, unsafe
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Plumbing
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Pipes in good condition
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Rusted, leaking or low-pressure lines
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Floors
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Level and firm, only the surface is worn
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Hollow, cracked or uneven badly
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Doors and frames
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Solid wood, no termite damage
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Termite-damaged, warped or weak
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Windows
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Frames sound, glass or hardware worn
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Frames rotted or badly damaged
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Old character features
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Arches, jaalis, wooden details in good shape
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Beyond repair or unsafe
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Damp, Seepage and Waterproofing in Old Houses
              </h3>

              <p className="mb-3">
                Damp is the most common problem in old Bareilly houses and the
                one most often hidden under fresh paint.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Rising damp:</strong> Moisture climbing from the
                  ground into walls, showing as damp patches and salt marks
                  near the base.
                </li>
                <li>
                  <strong>Roof leakage:</strong> Cracks and worn waterproofing
                  letting rain in, often visible on ceilings and upper walls.
                </li>
                <li>
                  <strong>Wall seepage:</strong> Rain entering through cracked
                  external plaster or damaged sunshades.
                </li>
                <li>
                  <strong>Bathroom and pipe leaks:</strong> Hidden leaks
                  causing damp patches on adjoining walls and ceilings below.
                </li>
                <li>
                  <strong>Poor drainage:</strong> Water collecting near the
                  foundation or on terraces.
                </li>
              </ul>

              <p className="mt-3">
                Treat the source first. Then repair plaster, and only then
                paint. Painting a damp wall without fixing the cause peels the
                paint within months.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Termites and Wood Problems
              </h3>

              <p className="mb-3">
                Wooden doors, frames, beams and old furniture are common
                targets in older homes.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Signs to look for:</strong> Mud trails, fine wood
                  dust, hollow sound when tapped and soft or crumbling wood.
                </li>
                <li>
                  <strong>Treatment first:</strong> Termite treatment should
                  come before repair or replacement work.
                </li>
                <li>
                  <strong>Replace weak wood:</strong> Damaged frames and beams
                  should not be patched over.
                </li>
                <li>
                  <strong>Use protected material:</strong> Treated wood or
                  termite-resistant boards for new work.
                </li>
                <li>
                  <strong>Fix the damp:</strong> Termites thrive in damp areas,
                  so moisture control is part of termite control.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Old Wiring and Plumbing: Replace Before You Decorate
              </h3>

              <p className="mb-3">
                Old wiring and plumbing sit behind walls and floors. They are
                expensive to reach later, so they are best replaced during
                renovation.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Electrical:</strong> Old wiring may not suit modern
                  loads from AC, geysers, induction and other appliances.
                  Missing earthing and brittle insulation are safety risks.
                  Plan enough points, a proper distribution board and safe
                  circuits. Plan lighting and ceiling work along with wiring.
                </li>
                <li>
                  <strong>Plumbing:</strong> Old pipes can be rusted, scaled
                  and leak-prone. Low water pressure and slow drainage often
                  point to blocked or corroded lines. Plan new lines with
                  proper slopes and good-quality fittings. Combine plumbing
                  replacement with bathroom and kitchen renovation to save
                  effort.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                The Correct Order of Work for an Old House
              </h3>

              <p className="mb-3">
                Skipping the early steps and jumping to paint and tiles is the
                most common and costly mistake in old house renovation.
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
                        Inspection and structural opinion if needed
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Safety and planning basis
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">2</td>
                      <td className="border border-gray-300 px-3 py-2">
                        Termite and pest treatment
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Protects wood and structure
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">3</td>
                      <td className="border border-gray-300 px-3 py-2">
                        Structural and crack repair
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Walls, slabs and openings must be sound
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">4</td>
                      <td className="border border-gray-300 px-3 py-2">
                        Roof, terrace and wall waterproofing
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Stops water before finishing begins
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">5</td>
                      <td className="border border-gray-300 px-3 py-2">
                        Damp treatment and plaster removal where needed
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Clears the source before repair
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">6</td>
                      <td className="border border-gray-300 px-3 py-2">
                        Plumbing and electrical replacement
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Hidden systems before finishes
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">7</td>
                      <td className="border border-gray-300 px-3 py-2">
                        Plaster and wall preparation
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Clean base for finishes
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">8</td>
                      <td className="border border-gray-300 px-3 py-2">
                        Flooring and wall tiling
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Sets the base for carpentry and fittings
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">9</td>
                      <td className="border border-gray-300 px-3 py-2">
                        False ceiling, doors, windows and carpentry
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Fitted into prepared spaces
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">10</td>
                      <td className="border border-gray-300 px-3 py-2">
                        Painting and polish
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Applied after dust-heavy work is done
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">11</td>
                      <td className="border border-gray-300 px-3 py-2">
                        Fixtures, lights and final fittings
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Fitted last to protect them
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">12</td>
                      <td className="border border-gray-300 px-3 py-2">
                        Testing, cleaning and handover
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Final check before use
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                What a Good Old House Renovation Contractor Does
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Inspects thoroughly:</strong> Looks beyond surface
                  finishes to structure, damp, wiring and plumbing.
                </li>
                <li>
                  <strong>Explains findings honestly:</strong> Tells you what
                  is serious, what is minor and what can wait.
                </li>
                <li>
                  <strong>Advises on safety:</strong> Recommends a structural
                  engineer when signs of serious problems appear.
                </li>
                <li>
                  <strong>Plans around the building:</strong> Respects thick
                  walls, old details and load paths.
                </li>
                <li>
                  <strong>Writes a clear scope:</strong> What will be done,
                  what will not, and in what order.
                </li>
                <li>
                  <strong>Uses suitable materials:</strong> Chooses repair
                  materials compatible with old walls and plaster.
                </li>
                <li>
                  <strong>Coordinates all trades:</strong> Civil,
                  waterproofing, plumbing, electrical, carpentry and painting
                  are sequenced.
                </li>
                <li>
                  <strong>Plans for surprises:</strong> Keeps a contingency for
                  hidden problems.
                </li>
                <li>
                  <strong>Supervises on site:</strong> Someone responsible
                  checks progress and quality.
                </li>
                <li>
                  <strong>Tests before handover:</strong> Water, power, drains,
                  doors and fittings are checked.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Questions to Ask Before You Hire for Old House Renovation
              </h3>

              <p className="mb-3">
                Use these questions with any contractor, including us.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>
                    Will you inspect the whole house, including roof, walls,
                    wiring and plumbing?
                  </strong>{" "}
                  The answer should be yes.
                </li>
                <li>
                  <strong>
                    Do you recommend a structural opinion for this house?
                  </strong>{" "}
                  Ask when and why.
                </li>
                <li>
                  <strong>
                    What is causing the damp and leaks, and how will you fix
                    the source?
                  </strong>{" "}
                  Ask for a clear explanation.
                </li>
                <li>
                  <strong>What will you keep, repair and replace?</strong> Ask
                  for reasons.
                </li>
                <li>
                  <strong>Will wiring and plumbing be replaced?</strong>{" "}
                  Clarify scope and materials.
                </li>
                <li>
                  <strong>How do you deal with termites?</strong> Ask about
                  treatment and prevention.
                </li>
                <li>
                  <strong>In what order will the work be done?</strong> Ask for
                  a stage-wise plan.
                </li>
                <li>
                  <strong>
                    How will hidden problems be handled and priced?
                  </strong>{" "}
                  It should be agreed in writing.
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
                Warning Signs of a Weak Old House Renovation Plan
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  Quotes a price without inspecting the whole house.
                </li>
                <li>
                  Starts with paint, tiles or decor before fixing damp, leaks
                  and wiring.
                </li>
                <li>Ignores cracks and structural signs.</li>
                <li>Cannot explain what is causing the damp.</li>
                <li>
                  Plans to keep old wiring and plumbing behind new finishes.
                </li>
                <li>Skips termite treatment.</li>
                <li>
                  Offers a lump-sum quote with no item-wise breakup.
                </li>
                <li>
                  Asks for a very large advance before work starts.
                </li>
                <li>
                  Has no written scope, timeline or warranty.
                </li>
                <li>
                  Removes walls or beams without checking if they carry load.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Safety Notes for Old House Renovation
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  Do not remove or cut walls, beams or columns without
                  professional advice. Some may carry load.
                </li>
                <li>
                  Get a structural opinion where cracks or sagging appear. This
                  protects the building and your family.
                </li>
                <li>
                  Check old paint and materials before heavy sanding or
                  demolition. Dust can be harmful, so use proper protection and
                  ventilation.
                </li>
                <li>
                  Turn off power and water before opening walls and floors. Old
                  lines can be live or pressurised.
                </li>
                <li>
                  Keep children, elders and pets away from work areas. Debris,
                  tools and open wiring are hazards.
                </li>
                <li>
                  Follow society, municipal and authority rules. Structural
                  changes and extensions may need approvals.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Planning by Type of Old Property
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Ancestral or Inherited Home:</strong> Often large,
                  with thick walls and sentimental value. Plan carefully, keep
                  valuable features and phase the work.
                </li>
                <li>
                  <strong>Old Independent House:</strong> Start with structure,
                  roof, damp and services. Interior upgrades follow.
                </li>
                <li>
                  <strong>Old Flat or Apartment:</strong> Work must follow
                  society rules, and structural changes usually need approval.
                  Old plumbing and wiring are common priorities.
                </li>
                <li>
                  <strong>Rented or Tenanted Old Home:</strong> Confirm
                  responsibilities with the owner and tenant before major work.
                </li>
                <li>
                  <strong>Property Bought for Renovation:</strong> Get a full
                  inspection before purchase or immediately after, so the
                  budget includes hidden repairs.
                </li>
                <li>
                  <strong>Pre-Sale or Pre-Rental Refresh:</strong> Focus on
                  safety, damp, paint, minor repairs, lighting and presentable
                  bathrooms and kitchens.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Bareilly Planning Notes for Old House Renovation
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Monsoon rain:</strong> Roof, terrace and wall
                  waterproofing should be completed before heavy rain, and
                  exterior finishing avoided during rain.
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
                  <strong>Ground moisture:</strong> Some low-lying areas hold
                  water, affecting plinths, ground-floor walls and basements.
                </li>
                <li>
                  <strong>Old plaster and masonry:</strong> Match repair
                  materials to the existing walls to avoid cracking and
                  peeling.
                </li>
                <li>
                  <strong>Termite risk:</strong> Old wooden frames, doors,
                  beams and furniture need treatment and inspection.
                </li>
                <li>
                  <strong>Narrow lanes and access:</strong> Old neighbourhoods
                  may restrict material delivery and debris removal, so plan
                  logistics.
                </li>
                <li>
                  <strong>Festival and wedding seasons:</strong> Plan
                  completion well before guests arrive, with buffer time for
                  delays.
                </li>
                <li>
                  <strong>Society and neighbour rules:</strong> Check working
                  hours, debris disposal and noise restrictions.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Choose Your Old House Renovation Plan
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Inspection and assessment plan:</strong> A full
                  condition report and prioritised repair plan.
                </li>
                <li>
                  <strong>Waterproofing and damp plan:</strong> Roof, wall and
                  plinth treatment before finishing.
                </li>
                <li>
                  <strong>Safety and services plan:</strong> Structural
                  repairs, rewiring and plumbing replacement.
                </li>
                <li>
                  <strong>Kitchen and bathroom plan:</strong> Remodelling with
                  waterproofing and new fittings.
                </li>
                <li>
                  <strong>Interior refresh plan:</strong> Flooring, ceilings,
                  carpentry and painting.
                </li>
                <li>
                  <strong>Full old house renovation plan:</strong> Structure,
                  services, waterproofing, interiors and finishing together.
                </li>
                <li>
                  <strong>Exterior renovation plan:</strong> Facade, roof,
                  boundary wall and balcony work.
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
                Factors That Affect Old House Renovation Cost in Bareilly
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Size and age of the house:</strong> Larger and older
                  houses usually need more work.
                </li>
                <li>
                  <strong>Structural condition:</strong> Cracks, settlement and
                  weak slabs add repair work.
                </li>
                <li>
                  <strong>Damp and leakage:</strong> More affected areas mean
                  more treatment and plaster repair.
                </li>
                <li>
                  <strong>Wiring and plumbing replacement:</strong> Full
                  replacement is a major part of the cost.
                </li>
                <li>
                  <strong>Termite damage:</strong> Treatment and replacement of
                  damaged wood add cost.
                </li>
                <li>
                  <strong>Scope and finish level:</strong> A refresh costs far
                  less than a full renovation.
                </li>
                <li>
                  <strong>Material and brand choices:</strong> Tiles, paint,
                  boards, fittings and fixtures vary widely in price.
                </li>
                <li>
                  <strong>Number of bathrooms and kitchens:</strong> These are
                  the most expensive areas per square foot.
                </li>
                <li>
                  <strong>Access and lane width:</strong> Narrow lanes and
                  upper floors add carrying effort.
                </li>
                <li>
                  <strong>Demolition and debris:</strong> Removing old material
                  adds cost.
                </li>
                <li>
                  <strong>Hidden problems:</strong> Old houses often reveal
                  extra work once walls and floors are opened.
                </li>
                <li>
                  <strong>Timeline:</strong> Faster schedules can change the
                  price.
                </li>
              </ul>

              <p className="mt-3">
                Old house renovation is generally priced by scope, area and
                material, and the range is wide because conditions differ. Your
                quote depends on the inspection, so use the free MTBOSS Budget
                Calculator on the website for a starting estimate and request a
                detailed quote after the site visit. Keep a contingency reserve
                for hidden problems.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Budget Priorities for Old House Renovation
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>First:</strong> Safety and structure. Address cracks,
                  sagging and unsafe areas before anything else.
                </li>
                <li>
                  <strong>Second:</strong> Water control. Roof, terrace, wall
                  and plinth waterproofing protect all later work.
                </li>
                <li>
                  <strong>Third:</strong> Termite and damp treatment. Protect
                  wood and plaster before repair.
                </li>
                <li>
                  <strong>Fourth:</strong> Services. Replace wiring and
                  plumbing before finishes.
                </li>
                <li>
                  <strong>Fifth:</strong> High-use areas. Kitchen and bathrooms
                  deliver the most daily value.
                </li>
                <li>
                  <strong>Sixth:</strong> Flooring, walls and carpentry. Choose
                  durable finishes for living areas.
                </li>
                <li>
                  <strong>Seventh:</strong> Decorative finishes. Painting,
                  lighting and decor can follow, and extras can be phased.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                How MTBOSS Approaches an Old House Renovation
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Step 1 — Enquiry and discussion:</strong> Contact
                  MTBOSS through the website, phone or WhatsApp and share the
                  age and type of the house, the problems you notice and your
                  budget.
                </li>
                <li>
                  <strong>Step 2 — Photos and details:</strong> Sending photos
                  or a short video of cracks, damp patches, roof and wiring
                  helps the team prepare before the visit.
                </li>
                <li>
                  <strong>Step 3 — Budget Calculator:</strong> The free
                  calculator on our website gives a starting estimate.
                </li>
                <li>
                  <strong>Step 4 — Site visit and inspection:</strong> The team
                  checks structure, roof, walls, plumbing, wiring, floors, wood
                  and damp. Share your locality in Bareilly, and the team will
                  confirm arrangements.
                </li>
                <li>
                  <strong>Step 5 — Findings and priorities:</strong> You and
                  the team discuss what is urgent, what can wait and whether a
                  structural opinion is needed.
                </li>
                <li>
                  <strong>Step 6 — Keep, repair or replace decisions:</strong>{" "}
                  The team explains options for each part of the house, with
                  reasons.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Care After Old House Renovation
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  Allow plaster, paint and polish to cure fully before heavy
                  use.
                </li>
                <li>
                  Clear drains, gutters and outlets before every monsoon.
                </li>
                <li>
                  Inspect the roof, terrace and walls once a year, ideally
                  before the monsoon.
                </li>
                <li>
                  Watch for new cracks, damp patches and termite signs, and
                  report them early.
                </li>
                <li>
                  Ventilate rooms regularly to limit damp and mould.
                </li>
                <li>
                  Service electrical points, switchboards and plumbing fittings
                  once a year.
                </li>
                <li>
                  Avoid drilling into waterproofed areas without advice.
                </li>
                <li>
                  Keep bills, specifications and warranty terms, if provided,
                  in a safe place.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Common Mistakes in Old House Renovation
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  Painting and decorating before fixing damp, leaks and wiring.
                </li>
                <li>
                  Ignoring cracks and signs of structural stress.
                </li>
                <li>
                  Removing walls or beams without professional advice.
                </li>
                <li>
                  Keeping old wiring and plumbing behind new finishes.
                </li>
                <li>
                  Skipping termite treatment before replacing wood.
                </li>
                <li>
                  Using repair materials that do not suit the old walls.
                </li>
                <li>
                  Not keeping a contingency for hidden problems.
                </li>
                <li>
                  Hiring on a phone quote without an inspection.
                </li>
                <li>
                  Choosing the cheapest quote without comparing scope and
                  materials.
                </li>
                <li>
                  Paying a large advance before work starts.
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
                  <strong>Property details:</strong> Locality in Bareilly, age
                  of the house, type and approximate area.
                </li>
                <li>
                  <strong>Photos and videos:</strong> Cracks, damp patches,
                  roof, wiring, pipes, floors and wooden parts.
                </li>
                <li>
                  <strong>Known problems:</strong> Leaks, termites, unsafe
                  wiring, sagging or structural worries.
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
                  <strong>Features you want to keep:</strong> Old doors,
                  arches, floors or details of sentimental value.
                </li>
                <li>
                  <strong>Budget range:</strong> The amount you are comfortable
                  spending, and how much reserve you can keep.
                </li>
                <li>
                  <strong>Timeline:</strong> Any festival, wedding, move-in or
                  exam deadline.
                </li>
                <li>
                  <strong>Living arrangements:</strong> Whether the family will
                  stay at home during the work.
                </li>
                <li>
                  <strong>Access details:</strong> Floor, lane width, parking,
                  debris disposal and society rules.
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
                Why Choose MTBOSS for Old House Renovation in Bareilly
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Inspect first, quote later:</strong> We study the
                  whole building before suggesting a plan or price.
                </li>
                <li>
                  <strong>Problems before polish:</strong> We treat damp,
                  leaks, termites, wiring and structure before finishing work.
                </li>
                <li>
                  <strong>Honest keep, repair or replace advice:</strong> We
                  explain what is worth saving and what is not.
                </li>
                <li>
                  <strong>Safety-first approach:</strong> We recommend
                  structural opinions where signs call for them.
                </li>
                <li>
                  <strong>Builder and interior team together:</strong> Civil,
                  waterproofing, plumbing, electrical, carpentry and painting
                  are planned as one project.
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
                Contact MTBOSS: Old House Renovation in Bareilly
              </h3>

              <p className="mb-3">
                If you are planning old house renovation in Bareilly, MTBOSS
                offers a single point of contact for inspection, planning,
                repair, finishing and handover, supported by a free budget
                calculator and a simple online quote request.
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
                    Q1. Is it worth renovating an old house in Bareilly?
                  </strong>
                  <br />
                  Often yes, if the structure is sound. Old houses frequently
                  have solid walls and good space. An inspection shows whether
                  repair or rebuilding makes more sense, and a structural
                  opinion helps where serious signs appear.
                </li>

                <li>
                  <strong>
                    Q2. Does MTBOSS provide old house renovation in Bareilly?
                  </strong>
                  <br />
                  MTBOSS Construction Private Limited serves Moradabad and
                  Bareilly and offers renovation as one of its services. Share
                  your locality and the condition of the house with the team to
                  confirm scope and arrangements.
                </li>

                <li>
                  <strong>
                    Q3. Where should I start when renovating an old house?
                  </strong>
                  <br />
                  Start with an inspection of structure, roof, damp, wiring,
                  plumbing and termites. Fix safety and water problems before
                  spending on finishes and decor.
                </li>

                <li>
                  <strong>
                    Q4. Should I replace all the wiring and plumbing?
                  </strong>
                  <br />
                  In most old houses, yes. Old wiring and pipes are hidden,
                  safety-related and expensive to fix later, so replacing them
                  during renovation is usually the wiser choice. An inspection
                  confirms the condition.
                </li>

                <li>
                  <strong>
                    Q5. How do I deal with damp walls in an old house?
                  </strong>
                  <br />
                  Find the source, such as rising damp, roof leaks or pipe
                  leaks, treat it, then repair the plaster and only then
                  repaint. Painting over damp without treatment fails quickly.
                </li>

                <li>
                  <strong>
                    Q6. Can I change the layout of my old house?
                  </strong>
                  <br />
                  Often yes, but walls and beams may carry load. Get
                  professional advice before removing or cutting any structural
                  element, and check whether approvals are needed.
                </li>

                <li>
                  <strong>
                    Q7. How much does old house renovation cost in Bareilly?
                  </strong>
                  <br />
                  The cost depends on size, age, condition, scope, materials
                  and hidden problems. Use the free MTBOSS Budget Calculator
                  for a starting estimate, request a detailed quote after a
                  site visit and keep a reserve for surprises.
                </li>

                <li>
                  <strong>
                    Q8. How long does old house renovation take?
                  </strong>
                  <br />
                  A full renovation takes longer than a refresh. The timeline
                  depends on scope, condition, material availability and
                  weather, and it is confirmed in your agreement.
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