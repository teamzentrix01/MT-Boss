import React from "react";
import LandingEnquiry from "../../components/LandingEnquiry";

const Content = () => {
  return (
    <div className="min-h-screen bg-white pt-0">
      <div className="flex flex-col lg:flex-row">
        {/* Content Section */}
        <div className="order-1 flex-1 px-4 py-12 sm:px-8 md:px-16 lg:order-1">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl md:text-3xl">
            What You Will Really Pay and Why
          </h2>

          <div className="max-w-4xl space-y-6 leading-relaxed text-gray-700">
            <section>
              <p>
                &quot;How much will my house renovation cost?&quot; is the
                first question every homeowner asks, and the honest answer is:
                it depends on what is wrong, what you want and what you choose.
                A house that only needs paint and polish can be refreshed for a
                fraction of the cost of one that needs rewiring, waterproofing,
                new bathrooms and a new kitchen. Two houses of the same size
                can have very different bills.
              </p>

              <p className="mt-3">
                If you are planning house renovation in Bareilly, this page
                will help you do three things: understand how renovation cost
                is built up, see indicative ranges by scope and area, and learn
                how to plan a budget that does not collapse halfway through.
                MTBOSS Construction Private Limited is an architect, interior
                designer and construction company serving Moradabad and
                Bareilly. It offers renovation, repairs, waterproofing,
                interiors, modular kitchens, carpentry and other home services
                with transparent pricing and on-time delivery.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                House Renovation Cost at a Glance
              </h3>

              <p className="mb-3">
                These are indicative planning ranges. Your actual cost depends
                on the condition of the house, the scope you choose, the
                materials and brands you select and the inspection findings.
                MTBOSS gives a written, item-wise quote after a site visit.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2">
                        Renovation level
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        What it covers
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Indicative range (per sq ft of built-up area)
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Light refresh
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Painting, minor repairs, polish, fixtures
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        ₹250 to ₹600
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Moderate renovation
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Painting, flooring touch-ups, bathroom and kitchen
                        upgrades, some carpentry
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        ₹600 to ₹1,200
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Major renovation
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Rewiring, plumbing, new flooring, ceilings, carpentry,
                        bathrooms, kitchen, painting
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        ₹1,200 to ₹2,200
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Full remodel
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Layout changes, structural work, complete interiors
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        ₹2,200 and above
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
                Renovation Services Offered by MTBOSS for Bareilly Clients
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Site inspection and assessment:</strong> Checking
                  walls, roof, floors, plumbing, wiring, damp patches and
                  structure.
                </li>
                <li>
                  <strong>Scope and budget planning:</strong> A written scope,
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
                  <strong>Plumbing and electrical work:</strong> New lines,
                  fittings, rewiring, points and lighting plans.
                </li>
                <li>
                  <strong>Flooring and tiling:</strong> Tile, marble or stone
                  work, polishing and skirting.
                </li>
                <li>
                  <strong>Bathroom and kitchen renovation:</strong>{" "}
                  Remodelling with waterproofing, fittings and modular
                  kitchens.
                </li>
                <li>
                  <strong>Doors, windows and carpentry:</strong> Repair,
                  replacement, wardrobes, panels and units.
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
                Area-Wise Renovation Cost Guide
              </h3>

              <p className="mb-3">
                Costs vary by material, size and condition, but this table
                shows where the money usually goes.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2">
                        Area
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Typical work
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Indicative range
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Interior painting
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Surface prep, putty, primer, two coats
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        ₹20 to ₹45 per sq ft of wall area
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Exterior painting
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Cleaning, crack fill, weatherproof paint
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        ₹25 to ₹60 per sq ft of wall area
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Terrace waterproofing
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Crack repair, coating or membrane system
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        ₹45 to ₹140 per sq ft
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Bathroom waterproofing
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Floor and wall treatment before tiling
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        ₹60 to ₹150 per sq ft
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Flooring (tile)
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Removal, base prep, new tiles, laying
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        ₹90 to ₹300 per sq ft, plus tile cost
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Bathroom renovation
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Demolition, waterproofing, plumbing, tiles, fittings
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        ₹70,000 to ₹2.5 lakh per bathroom
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Kitchen renovation
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Layout, cabinets, countertop, tiles, services
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        ₹1.5 lakh to ₹5 lakh and above
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Rewiring
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        New wiring, points, switches, board
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        ₹80 to ₹220 per sq ft of built-up area
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Plumbing replacement
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        New lines, fittings, drainage fixes
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        ₹70 to ₹200 per sq ft of built-up area
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        False ceiling
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Gypsum or other systems with lighting
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        ₹70 to ₹160 per sq ft
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Doors
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        New door, frame, hardware, finish
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        ₹8,000 to ₹45,000 per door
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Wardrobes and carpentry
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Custom wardrobes, panels, units
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        ₹1,100 to ₹3,000 per sq ft
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-3">
                Ranges are indicative planning figures and exclude taxes unless
                stated. Actual rates depend on materials, brand, condition,
                access and quantity. MTBOSS prepares an item-wise quote after
                inspection.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                What Goes Into Renovation Cost
              </h3>

              <p className="mb-3">
                Renovation cost is the sum of several parts. Knowing them helps
                you read a quote properly.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Inspection and design:</strong> Surveying the house
                  and preparing scope and drawings.
                </li>
                <li>
                  <strong>Demolition and removal:</strong> Taking out old
                  tiles, fittings, cabinets and debris.
                </li>
                <li>
                  <strong>Civil and repair work:</strong> Plaster, cracks,
                  walls, platforms and openings.
                </li>
                <li>
                  <strong>Waterproofing:</strong> Protection for roof,
                  bathrooms and walls.
                </li>
                <li>
                  <strong>Services:</strong> Plumbing and electrical work,
                  which often sits behind finished walls.
                </li>
                <li>
                  <strong>Finishes:</strong> Flooring, tiles, paint, ceilings
                  and polish.
                </li>
                <li>
                  <strong>Carpentry and fittings:</strong> Doors, windows,
                  wardrobes, kitchen and bathroom fittings.
                </li>
                <li>
                  <strong>Labour and supervision:</strong> Skilled workers and
                  site management.
                </li>
                <li>
                  <strong>Transport and handling:</strong> Moving materials and
                  clearing waste.
                </li>
                <li>
                  <strong>Taxes and contingencies:</strong> GST and a reserve
                  for hidden problems.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Factors That Affect House Renovation Cost in Bareilly
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Size of the house:</strong> More area means more work
                  and material.
                </li>
                <li>
                  <strong>Scope of work:</strong> A refresh costs far less than
                  a full renovation.
                </li>
                <li>
                  <strong>Condition of the building:</strong> Cracks, damp, old
                  wiring and termite damage add repair work.
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
                  <strong>Waterproofing needs:</strong> Roof, bathroom and wall
                  treatment add to the budget.
                </li>
                <li>
                  <strong>Services replacement:</strong> Rewiring and re-piping
                  can be a major part of the total.
                </li>
                <li>
                  <strong>Layout changes:</strong> Moving walls, kitchens or
                  bathrooms increases cost and may need approvals.
                </li>
                <li>
                  <strong>Floor level and access:</strong> Upper floors, narrow
                  lanes and lack of lift raise labour and carrying cost.
                </li>
                <li>
                  <strong>Design complexity:</strong> Ceilings, panels and
                  special finishes add labour.
                </li>
                <li>
                  <strong>Timeline:</strong> Faster schedules can change the
                  price.
                </li>
                <li>
                  <strong>Season:</strong> Monsoon can slow exterior work and
                  affect schedules.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Hidden Costs Many Homeowners Miss
              </h3>

              <p className="mb-3">
                Ask whether your quote includes the following.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Hidden damp and structural repair:</strong> Often
                  found only after plaster is removed.
                </li>
                <li>
                  <strong>Old pipe and wiring replacement:</strong> Sometimes
                  discovered after opening walls.
                </li>
                <li>
                  <strong>Debris removal and cleaning:</strong> Waste carrying
                  can be a significant item.
                </li>
                <li>
                  <strong>Matching old finishes:</strong> Matching old tiles,
                  paint or wood is harder than it looks.
                </li>
                <li>
                  <strong>Electrical load upgrade:</strong> Added appliances
                  may need a higher load or new board.
                </li>
                <li>
                  <strong>Additional waterproofing:</strong> Seepage in
                  unexpected places.
                </li>
                <li>
                  <strong>Termite treatment:</strong> For doors, frames and
                  wooden fittings.
                </li>
                <li>
                  <strong>Society or authority charges:</strong> Deposits,
                  permissions and debris charges.
                </li>
                <li>
                  <strong>Temporary stay or storage:</strong> Moving out or
                  storing furniture during work.
                </li>
                <li>
                  <strong>GST and taxes:</strong> Confirm whether the quote
                  includes them.
                </li>
              </ul>

              <p className="mt-3">
                A good quote lists inclusions and exclusions clearly. If it is
                only a single lump sum, ask for a breakup.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                How to Set a Realistic Renovation Budget
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Start with an inspection.</strong> Know the condition
                  of the structure, roof, walls and services.
                </li>
                <li>
                  <strong>List needs and wants separately.</strong> Needs
                  include leaks, wiring and unsafe items. Wants include decor
                  and upgrades.
                </li>
                <li>
                  <strong>Pick your renovation level.</strong> Refresh,
                  moderate, major or full remodel.
                </li>
                <li>
                  <strong>Get an item-wise estimate.</strong> Ask for
                  quantities, materials and rates.
                </li>
                <li>
                  <strong>Add a contingency of 10 to 15 percent.</strong>{" "}
                  Hidden problems often appear once work begins.
                </li>
                <li>
                  <strong>Plan phases.</strong> Divide work into stages to
                  spread cost and keep the house usable.
                </li>
                <li>
                  <strong>Keep a small reserve for finishing.</strong>{" "}
                  Last-minute changes and small items add up.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Where to Spend and Where to Save
              </h3>

              <p className="mb-3">
                Spending on the hidden parts and saving on visible extras gives
                a renovation that still works well in ten years.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2">
                        Spend More On
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Save On
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Waterproofing and leak repair
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Expensive decorative panels
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Electrical and plumbing quality
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Premium paint in low-use rooms
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Bathroom and kitchen fittings you use daily
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Imported tiles in storage or utility areas
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Strong, treated doors and frames
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Over-detailed false ceilings in every room
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Proper surface preparation before paint
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Complicated lighting in all rooms
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Good hardware for wardrobes and kitchen
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Matching all furniture to a single costly theme
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Phase-Wise Renovation Plan to Control Cost
              </h3>

              <p className="mb-3">
                If you cannot do everything at once, this order protects your
                investment.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2">
                        Phase
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Work
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Why first
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Phase 1
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Structure, leaks, damp, termite, safety items
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Stops damage from spreading
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Phase 2
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Waterproofing, plumbing and electrical
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Hidden systems before finishes
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Phase 3
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Bathrooms and kitchen
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        High-use, high-value areas
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Phase 4
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Flooring, walls, ceilings
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Prepares clean base for finishes
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Phase 5
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Doors, windows and carpentry
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Fitted into finished surfaces
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Phase 6
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Painting and decor
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Final layer after dusty work
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-3">
                Starting with Phase 6 and skipping Phases 1 and 2 is the most
                expensive mistake in renovation.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                What a Good Renovation Contractor Does to Keep Costs Fair
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Inspects before quoting:</strong> A price given
                  without seeing the house is only a guess.
                </li>
                <li>
                  <strong>Prepares an item-wise quote:</strong> Quantities,
                  materials and rates are visible.
                </li>
                <li>
                  <strong>Explains options:</strong> Cheaper and costlier
                  choices are shown with reasons.
                </li>
                <li>
                  <strong>Names the materials:</strong> Grades and brands are
                  written in the quote.
                </li>
                <li>
                  <strong>Plans the order of work:</strong> Correct sequence
                  avoids damage and rework.
                </li>
                <li>
                  <strong>Controls waste and variations:</strong> Changes are
                  discussed and priced in writing.
                </li>
                <li>
                  <strong>Supervises on site:</strong> Someone responsible
                  checks progress and quality.
                </li>
                <li>
                  <strong>Uses stage-wise payments:</strong> Payments are
                  linked to completed work.
                </li>
                <li>
                  <strong>Keeps you informed:</strong> Costs and progress are
                  shared clearly.
                </li>
                <li>
                  <strong>Tests before handover:</strong> Work is checked
                  before final payment.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Questions to Ask Before You Accept a Renovation Quote
              </h3>

              <p className="mb-3">
                Use these questions with any contractor, including us.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>
                    Is the quote based on an inspection of the whole house?
                  </strong>{" "}
                  The answer should be yes.
                </li>
                <li>
                  <strong>What is included, and what is excluded?</strong> Get
                  it in writing.
                </li>
                <li>
                  <strong>Which materials and brands are included?</strong> Ask
                  for names, not general words.
                </li>
                <li>
                  <strong>Is waterproofing included, and where?</strong> Check
                  roof, bathrooms and walls.
                </li>
                <li>
                  <strong>
                    Are plumbing and electrical replacements included?
                  </strong>{" "}
                  Clarify scope and quality.
                </li>
                <li>
                  <strong>
                    How is debris removal and cleaning handled?
                  </strong>{" "}
                  Ask who pays and when.
                </li>
                <li>
                  <strong>How will extra work be priced?</strong> It should be
                  approved in writing before it is done.
                </li>
                <li>
                  <strong>How are payments structured?</strong> They should
                  follow completed stages.
                </li>
                <li>
                  <strong>Is GST included?</strong> Avoid surprises at the
                  final bill.
                </li>
                <li>
                  <strong>What warranty or follow-up is offered?</strong> Get
                  the terms written.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Warning Signs of an Unreliable Renovation Quote
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  A price given without inspecting the house.
                </li>
                <li>
                  A lump-sum quote with no item-wise breakup.
                </li>
                <li>
                  A very low rate with no mention of materials or inclusions.
                </li>
                <li>
                  No mention of waterproofing, debris removal or cleaning.
                </li>
                <li>
                  Words like &quot;branded&quot; and &quot;best quality&quot;
                  without names.
                </li>
                <li>
                  A very large advance demanded before work starts.
                </li>
                <li>
                  No written scope, timeline or warranty.
                </li>
                <li>
                  Pressure to book &quot;today&quot; for a special price.
                </li>
                <li>
                  Prices that change repeatedly during the work without written
                  approval.
                </li>
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
                  <strong>Apartment or Flat:</strong> Cost is often driven by
                  bathrooms, kitchen, flooring and carpentry. Society rules on
                  timing, noise and debris disposal can affect schedule and
                  cost.
                </li>
                <li>
                  <strong>Older or Inherited Home:</strong> Old buildings often
                  have outdated wiring, weak plaster, damp walls and termite
                  damage. Budget more for repairs and hidden problems.
                </li>
                <li>
                  <strong>Duplex or Multi-Storey Home:</strong> Staircases,
                  terraces and multiple bathrooms increase waterproofing and
                  plumbing cost.
                </li>
                <li>
                  <strong>Rented Home:</strong> Keep work light and reversible,
                  and confirm changes with the landlord.
                </li>
                <li>
                  <strong>Pre-Sale or Pre-Rental Refresh:</strong> Focus on
                  paint, minor repairs, lighting and presentable bathrooms and
                  kitchens for the best return.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Bareilly Planning Notes for Renovation Budgets
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Monsoon rain:</strong> Plan roof and wall
                  waterproofing before the heavy rains, since leaks left unfixed
                  raise repair costs.
                </li>
                <li>
                  <strong>Summer heat:</strong> Heat affects curing and work
                  hours, which can affect schedule and cost.
                </li>
                <li>
                  <strong>Winter fog and dampness:</strong> Slow drying affects
                  plaster, tile adhesive and paint, so allow extra time.
                </li>
                <li>
                  <strong>Older house walls:</strong> Uneven walls and old
                  plaster need extra preparation.
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
                  <strong>Festival and wedding seasons:</strong> Demand for
                  labour and materials rises, so book early.
                </li>
                <li>
                  <strong>Society and neighbour rules:</strong> Check working
                  hours, debris disposal and charges.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Choose Your Renovation Plan
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Light refresh plan:</strong> Painting, minor repairs,
                  polish and fixture replacement.
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
                  <strong>Major interior renovation plan:</strong> Electrical,
                  plumbing, flooring, carpentry, ceilings and painting
                  together.
                </li>
                <li>
                  <strong>Exterior renovation plan:</strong> Facade, roof,
                  boundary wall and balcony work.
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
                How MTBOSS Approaches a Renovation Project and Its Estimate
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
                Care After Renovation to Protect Your Investment
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
                  Fix leaking taps, pipes or cracks early.
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
                Common Budgeting Mistakes in House Renovation
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
                  Choosing the cheapest quote without comparing scope and
                  materials.
                </li>
                <li>Skipping a contingency reserve.</li>
                <li>
                  Overspending on finishes and underspending on waterproofing
                  and services.
                </li>
                <li>
                  Not clarifying inclusions such as debris removal, cleaning
                  and GST.
                </li>
                <li>
                  Changing the design midway without pricing the change.
                </li>
                <li>
                  Paying a large advance before work starts.
                </li>
                <li>
                  Not planning phases, and running out of money halfway.
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
                  <strong>Renovation goals:</strong> Refresh, remodel, extend
                  or a full makeover.
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
                  <strong>Budget range:</strong> The amount you are comfortable
                  spending, and how firm it is.
                </li>
                <li>
                  <strong>Priorities:</strong> What must be done first, and
                  what can be phased.
                </li>
                <li>
                  <strong>Style preferences:</strong> Colours, materials and
                  designs you like.
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
                Why Choose MTBOSS for House Renovation in Bareilly
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Inspect first, quote later:</strong> We study the
                  property before suggesting a plan or price.
                </li>
                <li>
                  <strong>Item-wise quotes:</strong> Quantities, materials and
                  rates are stated clearly.
                </li>
                <li>
                  <strong>Problems before polish:</strong> We fix leaks, damp,
                  wiring and structure before finishing work.
                </li>
                <li>
                  <strong>Phase-wise planning:</strong> Work can be divided
                  into stages to match your budget and lifestyle.
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
                Contact MTBOSS: House Renovation Cost and Quote in Bareilly
              </h3>

              <p className="mb-3">
                If you want to know your house renovation cost in Bareilly,
                start with the free MTBOSS Budget Calculator and book a site
                visit for an item-wise written quote from a single point of
                contact.
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
                    Q1. What is the average house renovation cost in Bareilly?
                  </strong>
                  <br />
                  It depends on the level of work. A light refresh costs far
                  less than a major renovation. Indicative planning ranges run
                  from a few hundred rupees per sq ft for a refresh to over a
                  thousand rupees per sq ft for major work, and your actual
                  cost depends on inspection findings and choices.
                </li>

                <li>
                  <strong>
                    Q2. How much does it cost to renovate an old house in
                    Bareilly?
                  </strong>
                  <br />
                  Old houses often need extra spending on wiring, plumbing,
                  waterproofing, plaster and termite treatment. A site
                  inspection is the only reliable way to estimate the cost.
                </li>

                <li>
                  <strong>
                    Q3. Does MTBOSS provide house renovation in Bareilly?
                  </strong>
                  <br />
                  MTBOSS Construction Private Limited serves Moradabad and
                  Bareilly and offers renovation as one of its services. Share
                  your locality and requirements with the team to confirm scope
                  and arrangements.
                </li>

                <li>
                  <strong>
                    Q4. What is the cost to renovate a bathroom or kitchen?
                  </strong>
                  <br />
                  Both vary widely by size, fittings, materials and
                  waterproofing needs. Use the free MTBOSS Budget Calculator
                  for a starting estimate and request an item-wise quote after
                  a site visit.
                </li>

                <li>
                  <strong>
                    Q5. How much extra should I keep for hidden problems?
                  </strong>
                  <br />
                  Many homeowners keep a contingency of around 10 to 15
                  percent. Hidden damp, old pipes and weak plaster often appear
                  once work begins.
                </li>

                <li>
                  <strong>
                    Q6. How can I reduce renovation cost without losing
                    quality?
                  </strong>
                  <br />
                  Fix waterproofing, wiring and plumbing first, choose
                  materials by area and use, phase the work, avoid layout
                  changes where not needed and compare item-wise quotes.
                </li>

                <li>
                  <strong>
                    Q7. Is it cheaper to renovate in phases?
                  </strong>
                  <br />
                  Phasing spreads the cost and keeps the house usable, but a
                  phased plan should still follow the correct order of work so
                  earlier work is not damaged later.
                </li>

                <li>
                  <strong>Q8. How long does renovation take?</strong>
                  <br />
                  A refresh takes less time than a full renovation. The
                  timeline depends on scope, condition, material availability
                  and weather, and it is confirmed in your agreement.
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