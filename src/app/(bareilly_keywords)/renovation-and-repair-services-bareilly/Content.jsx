import React from "react";
import LandingEnquiry from "../../components/LandingEnquiry";

const Content = () => {
  return (
    <div className="min-h-screen bg-white pt-0">
      <div className="flex flex-col lg:flex-row">
        {/* Content Section */}
        <div className="order-1 flex-1 px-4 py-12 sm:px-8 md:px-16 lg:order-1">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl md:text-3xl">
            Find the Right Service for Every Room and Every Problem
          </h2>

          <div className="max-w-4xl space-y-6 leading-relaxed text-gray-700">
            <section>
              <p>
                Most homeowners do not know which service to call. A damp patch on
                the bedroom ceiling could be a roof leak, a bathroom leak above, a
                wall seepage problem or a pipe burst. A door that will not close
                could be swelling, a loose hinge or a frame that has moved. When you
                do not know the cause, you do not know whom to call, and the wrong
                call leads to a patch that fails.
              </p>

              <p className="mt-3">
                If you are looking for renovation and repair services in Bareilly,
                this page works as a guide: which services exist, which room or
                symptom points to which service, how work normally starts, how
                pricing works and what you should keep for your records. MTBOSS
                Construction Private Limited is an architect, interior designer and
                construction company serving Moradabad and Bareilly. It offers
                renovation, repairs, waterproofing, interiors, modular kitchens,
                carpentry and other home services with transparent pricing and
                on-time delivery.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Services at a Glance: Match the Symptom to the Service
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2">
                        What you notice
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Possible causes
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Service to ask for
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Damp patch or stain on ceiling
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Roof leak, bathroom above, pipe leak
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Inspection, then waterproofing or plumbing repair
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Peeling paint and salt marks on walls
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Seepage, rising damp, external cracks
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Damp diagnosis, wall treatment, repainting
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Cracks in walls
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Shrinkage, movement, moisture
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Crack inspection and repair, structural opinion if wide
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Low water pressure or slow drain
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Blocked or corroded lines
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Plumbing inspection and repair
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Switch heating, tripping, flickering
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Overload, loose connection, old wiring
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Electrical inspection and rewiring
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Door rubbing, sagging or not locking
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Swelling, hinges, frame shift
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Carpentry repair and door fitting
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Hollow or cracked tiles
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Weak bed, moisture, impact
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Tile repair or flooring replacement
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Mould and damp smell
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Poor ventilation, hidden moisture
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Moisture source repair, ventilation planning
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Outdated kitchen or bathroom
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Age, layout, worn fittings
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Kitchen or bathroom renovation
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Dull, tired interiors
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Age, worn finishes
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Painting, lighting, ceiling and carpentry refresh
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Termite trails or hollow wood
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Termite infestation
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Termite treatment and wood repair
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Rooms feel dark or cramped
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Layout, lighting, storage
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Interior planning and renovation
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-3">
                If you cannot match the symptom, do not worry. Send photos, and an
                inspection will find the cause.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                MTBOSS Construction Private Limited
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  A company offering construction services, doorstep home services,
                  verified property transactions and building materials under one
                  roof.
                </li>
                <li>
                  Office at Harthala, Kanth Road, Behind KR Collection, near
                  Domino&apos;s, Moradabad.
                </li>
                <li>
                  Serving Moradabad and Bareilly with residential, commercial and
                  renovation work.
                </li>
                <li>
                  A project gallery and blog on the website let prospective clients
                  review completed work.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Renovation and Repair Services Offered by MTBOSS for Bareilly
                Clients
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Inspection and diagnosis:</strong> Checking structure,
                  roof, walls, floors, plumbing, wiring, doors, windows and damp.
                </li>
                <li>
                  <strong>Waterproofing and leakage repair:</strong> Roof, terrace,
                  bathroom, wall and basement treatment.
                </li>
                <li>
                  <strong>Crack and plaster repair:</strong> Crack filling, plaster
                  restoration and surface preparation.
                </li>
                <li>
                  <strong>Plumbing work:</strong> Leak repair, drain fixes, fittings
                  and new lines.
                </li>
                <li>
                  <strong>Electrical work:</strong> Rewiring, switchboards, points
                  and lighting.
                </li>
                <li>
                  <strong>Carpentry:</strong> Doors, frames, windows, wardrobes and
                  furniture repair.
                </li>
                <li>
                  <strong>Flooring and tiling:</strong> Tile replacement, polishing,
                  new floors and skirting.
                </li>
                <li>
                  <strong>Painting:</strong> Interior and exterior painting with
                  proper preparation.
                </li>
                <li>
                  <strong>False ceiling and lighting:</strong> Repair and new
                  ceiling design.
                </li>
                <li>
                  <strong>Kitchen and bathroom renovation:</strong> From repairs to
                  full remodelling.
                </li>
                <li>
                  <strong>Interior renovation:</strong> Planned makeovers for rooms
                  and full homes.
                </li>
                <li>
                  <strong>Building repair and upkeep:</strong> Balcony, facade,
                  boundary wall and general maintenance.
                </li>
                <li>
                  <strong>Related home services:</strong> Painter, electrician,
                  plumber, carpenter, tile and marble, false ceiling, waterproofing
                  and other services through the same company.
                </li>
              </ul>

              <p className="mt-3">
                Final scope for each project is discussed and confirmed with the
                MTBOSS team before work begins.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Room-by-Room Guide to Repair and Renovation
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Roof and Terrace:</strong> Waterproofing, crack repair,
                  slope correction, drain clearing and surface restoration. Roof
                  problems often show up first as ceiling stains below. Fixing the
                  roof before the monsoon prevents most interior damage.
                </li>
                <li>
                  <strong>Living Room:</strong> Wall and ceiling repair, repainting,
                  flooring polish, false ceiling, TV panel and lighting refresh.
                  Check for damp patches and wiring before decorating.
                </li>
                <li>
                  <strong>Bedrooms:</strong> Wardrobe repair or replacement, door
                  and window fixes, painting, lighting and flooring. Dampness behind
                  wardrobes and on external walls is a frequent hidden problem.
                </li>
                <li>
                  <strong>Kitchen:</strong> Leak repair, tile and platform work,
                  cabinet replacement, chimney and ventilation, and plumbing or
                  wiring updates. Water, heat and grease make kitchens wear out
                  faster than other rooms.
                </li>
                <li>
                  <strong>Bathrooms:</strong> Waterproofing, drainage correction,
                  tile replacement, fittings and plumbing. Hidden leaks here often
                  damage the ceiling below, so inspection first is wise.
                </li>
                <li>
                  <strong>Balcony and Sunshades:</strong> Waterproofing, slope
                  correction, railing repair, tile work and edge sealing. Poor slope
                  sends water back toward the room.
                </li>
                <li>
                  <strong>Doors and Windows:</strong> Alignment, hinge and lock
                  repair, frame repair, termite treatment, polishing and
                  replacement.
                </li>
                <li>
                  <strong>External Walls and Boundary:</strong> Crack filling,
                  plaster repair, exterior painting, gate and boundary wall repair.
                  External cracks let rain in and show as damp patches inside.
                </li>
                <li>
                  <strong>Basement and Ground Floor:</strong> Damp treatment,
                  drainage correction, waterproofing and termite protection. Ground
                  moisture needs specific attention.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                How Work Normally Starts: Small Repair vs Larger Project
              </h3>

              <p className="mb-3">
                Not every job needs a long process. Knowing which path fits helps
                you ask the right questions.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2">
                        Type of job
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Typical examples
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        How it usually works
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Small repair
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Loose hinge, leaking tap, switch fault, small tile fix
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Share photos and details, get a visit, agree on price for
                        the job, complete and test
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Medium repair
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Wall seepage, door replacement, bathroom leak, painting a
                        few rooms
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Inspection, written scope and quote, scheduled work, testing
                        and handover
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Larger project
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Roof waterproofing, rewiring, kitchen or bathroom
                        renovation, full home renovation
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Inspection, scope and design, itemised estimate, written
                        agreement, stage-wise work and payments
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Maintenance visit
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Pre-monsoon check, yearly service
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Inspection of key areas, report with findings and
                        recommended work
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-3">
                For small jobs, a clear price before the work starts is enough. For
                larger projects, a written scope, itemised estimate and payment
                stages protect both sides.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                How Pricing Usually Works
              </h3>

              <p className="mb-3">
                Different jobs are priced in different ways. Ask which method is
                being used before you agree.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2">
                        Pricing method
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Used for
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Watch out for
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Per visit or per job
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Small repairs
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Confirm what is included, such as parts and testing
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Per item or unit
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Doors, taps, switches, fittings
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Check quality and brand of the item
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Per square foot or area
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Painting, flooring, waterproofing, false ceiling
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Confirm how area is measured and what is included
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Per running foot
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Cabinets, skirting, certain carpentry
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Confirm materials and hardware
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Itemised project estimate
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Renovation, remodelling, multi-trade work
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Check scope, quantities, rates and exclusions
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Lump sum for defined scope
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Clearly defined projects
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Confirm what changes will be priced separately
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-3">
                The cheapest price is not always the best value. Compare scope,
                materials and inclusions, not only the total.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                What a Good Repair and Renovation Team Does
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Responds clearly and quickly:</strong> Replies to
                  enquiries and explains the next step.
                </li>
                <li>
                  <strong>Asks for details and photos:</strong> Understands the
                  problem before visiting.
                </li>
                <li>
                  <strong>Inspects before quoting:</strong> A price for anything
                  beyond a tiny job needs a look at the site.
                </li>
                <li>
                  <strong>Finds the real cause:</strong> Fixes the source, not only
                  the visible symptom.
                </li>
                <li>
                  <strong>Explains options:</strong> Repair, partial replacement or
                  renovation, with costs and reasons.
                </li>
                <li>
                  <strong>Writes it down:</strong> Scope, price, timeline and
                  warranty are recorded for larger work.
                </li>
                <li>
                  <strong>Names materials and brands:</strong> You know what goes
                  into your home.
                </li>
                <li>
                  <strong>Coordinates trades:</strong> Civil, plumbing, electrical,
                  carpentry, tiling and painting work in the right order.
                </li>
                <li>
                  <strong>Protects your home:</strong> Floors, furniture and
                  fixtures are covered, and dust is managed.
                </li>
                <li>
                  <strong>Tests and cleans up:</strong> Water, power, drains, doors
                  and fittings are checked, and the site is left clean.
                </li>
                <li>
                  <strong>Stays reachable:</strong> You know whom to call if the
                  problem returns.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Questions to Ask Before You Book a Repair or Renovation Service
              </h3>

              <p className="mb-3">
                Use these questions with any provider, including us.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Do you inspect before quoting, and is there a visit
                  charge?</strong> Clarify this first.
                </li>
                <li>
                  <strong>What do you think is causing the problem?</strong> Ask for
                  an explanation, not just a price.
                </li>
                <li>
                  <strong>What is the plan, and in what order will the work be
                  done?</strong> Ask for steps.
                </li>
                <li>
                  <strong>Which pricing method are you using?</strong> Per job, per
                  area, per item or an itemised estimate.
                </li>
                <li>
                  <strong>What is included and excluded?</strong> Ask about
                  materials, labour, cleaning and debris removal.
                </li>
                <li>
                  <strong>Which materials and brands will be used?</strong> Get
                  names, not general words.
                </li>
                <li>
                  <strong>When can you start, and how long will it take?</strong>{" "}
                  Ask for dates.
                </li>
                <li>
                  <strong>How are payments structured?</strong> For larger work,
                  they should follow completed stages.
                </li>
                <li>
                  <strong>How will you test the work, and what happens if the
                  problem returns?</strong> Ask for terms in writing.
                </li>
                <li>
                  <strong>Whom do I contact after the work is done?</strong> Ask for
                  a clear contact.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Warning Signs of a Weak Service Provider
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>Gives a firm price over the phone without understanding the problem.</li>
                <li>Offers a quick cosmetic fix and ignores the cause.</li>
                <li>Cannot explain what is causing the issue.</li>
                <li>Gives a lump-sum quote for large work with no breakup.</li>
                <li>
                  Uses words like &quot;100 percent guarantee&quot; without written
                  terms.
                </li>
                <li>Pushes to start immediately and discourages comparison.</li>
                <li>Demands a large advance before starting.</li>
                <li>Cannot show any completed work.</li>
                <li>Does not clean up or test before leaving.</li>
                <li>Is hard to reach after the job.</li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Planning by Property Type
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Independent House or Villa:</strong> Large roofs, walls
                  and exteriors mean more points to check. A yearly inspection and a
                  phased plan keep costs under control.
                </li>
                <li>
                  <strong>Apartment or Flat:</strong> Leaks can affect neighbours,
                  and society rules affect working hours and debris. Confirm
                  permissions before larger work.
                </li>
                <li>
                  <strong>Older Home:</strong> Old buildings often need rewiring,
                  new plumbing, damp treatment and termite care. Inspect first, and
                  plan repairs before decoration.
                </li>
                <li>
                  <strong>Newly Bought or Built Home:</strong> Document any early
                  defects, such as seepage or cracks, and check them against builder
                  warranty terms.
                </li>
                <li>
                  <strong>Rented Home:</strong> Confirm responsibilities with the
                  owner, and keep repairs within what the lease allows.
                </li>
                <li>
                  <strong>Shop, Office or Commercial Space:</strong> Plan work to
                  limit downtime, and choose durable, easy-to-clean finishes.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Bareilly Planning Notes for Repair and Renovation
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Monsoon rain:</strong> Complete roof, terrace and external
                  wall repairs before heavy rain, and avoid external finishing
                  during rain.
                </li>
                <li>
                  <strong>Summer heat:</strong> Heat affects curing and work hours,
                  so plan schedules sensibly.
                </li>
                <li>
                  <strong>Winter fog and dampness:</strong> Slow drying affects
                  plaster, tile adhesive and paint, so allow extra curing time.
                </li>
                <li>
                  <strong>Humidity:</strong> Moisture-resistant materials and good
                  ventilation protect finishes.
                </li>
                <li>
                  <strong>Termite risk:</strong> Wooden frames, doors and furniture
                  benefit from inspection and treatment.
                </li>
                <li>
                  <strong>Older house walls:</strong> Uneven walls and old plaster
                  need careful preparation.
                </li>
                <li>
                  <strong>Festival and wedding seasons:</strong> Book early, and
                  plan completion well before guests arrive.
                </li>
                <li>
                  <strong>Society and neighbour rules:</strong> Check working hours,
                  debris disposal and noise restrictions.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Choose Your Service Plan
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Quick repair visit:</strong> A short visit for small
                  faults in plumbing, electrical, carpentry or fittings.
                </li>
                <li>
                  <strong>Leak and damp solution:</strong> Diagnosis and repair of
                  roof, wall, bathroom and pipe leaks.
                </li>
                <li>
                  <strong>Crack and plaster repair:</strong> Surface restoration
                  with advice on structural concerns.
                </li>
                <li>
                  <strong>Electrical safety plan:</strong> Inspection, repair and
                  rewiring where needed.
                </li>
                <li>
                  <strong>Plumbing plan:</strong> Leak fixes, drain clearing and
                  line replacement.
                </li>
                <li>
                  <strong>Carpentry and door plan:</strong> Repair and replacement
                  of doors, windows and wooden items.
                </li>
                <li>
                  <strong>Paint and finish plan:</strong> Surface preparation,
                  painting and touch-ups.
                </li>
                <li>
                  <strong>Kitchen and bathroom plan:</strong> From repair to full
                  renovation.
                </li>
                <li>
                  <strong>Room makeover plan:</strong> One room renovated
                  completely.
                </li>
                <li>
                  <strong>Full home renovation plan:</strong> Services,
                  waterproofing, interiors and finishing together.
                </li>
                <li>
                  <strong>Pre-monsoon maintenance plan:</strong> A yearly check of
                  roof, drains, walls and services.
                </li>
                <li>
                  <strong>Phase-wise plan:</strong> One complete plan carried out in
                  stages to match your budget.
                </li>
              </ul>

              <p className="mt-3">
                Scope and specifications are agreed in writing before work begins on
                larger projects, so you know exactly what is included.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Factors That Affect the Cost of Repair and Renovation in Bareilly
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Type of job:</strong> A small repair costs far less than a
                  renovation project.
                </li>
                <li>
                  <strong>Cause and extent:</strong> Fixing the source of a problem
                  costs more than a surface patch but lasts longer.
                </li>
                <li>
                  <strong>Area or quantity:</strong> More area or more items
                  increase the total.
                </li>
                <li>
                  <strong>Condition of the building:</strong> Old wiring, weak
                  plaster and damp add repair work.
                </li>
                <li>
                  <strong>Material and brand choices:</strong> Tiles, paint, boards,
                  fittings and fixtures vary widely in price.
                </li>
                <li>
                  <strong>Access and floor level:</strong> Upper floors, narrow
                  lanes and lack of lift add effort.
                </li>
                <li>
                  <strong>Urgency:</strong> Emergency or same-day work can affect
                  the price.
                </li>
                <li>
                  <strong>Number of trades involved:</strong> More trades mean more
                  coordination and cost.
                </li>
                <li>
                  <strong>Debris and cleaning:</strong> Removing waste adds cost.
                </li>
                <li>
                  <strong>Timeline and season:</strong> Faster schedules and
                  monsoon work can change the price.
                </li>
              </ul>

              <p className="mt-3">
                Repair and renovation are priced by job, area, item or scope, and
                the range is wide because conditions differ. Your quote depends on
                the inspection, so use the free MTBOSS Budget Calculator on the
                website for larger work and request a detailed quote after the site
                visit.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Budget Priorities for Repair and Renovation
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>First:</strong> Safety. Electrical hazards, gas issues and
                  structural concerns come first.
                </li>
                <li>
                  <strong>Second:</strong> Water control. Fix leaks and damp to stop
                  damage from spreading.
                </li>
                <li>
                  <strong>Third:</strong> Hidden systems. Repair or replace plumbing
                  and wiring before finishes.
                </li>
                <li>
                  <strong>Fourth:</strong> Security and wood. Repair doors, windows
                  and locks, and treat termites.
                </li>
                <li>
                  <strong>Fifth:</strong> High-use areas. Kitchen and bathrooms
                  deliver the most daily value.
                </li>
                <li>
                  <strong>Sixth:</strong> Flooring, walls and paint. Restore
                  finishes once the cause is fixed.
                </li>
                <li>
                  <strong>Seventh:</strong> Upgrades and decor. Extras can follow
                  gradually.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                How MTBOSS Approaches a Service Request
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Step 1 — Enquiry:</strong> Contact MTBOSS through the
                  website, phone or WhatsApp and describe the problem or the
                  renovation you have in mind.
                </li>
                <li>
                  <strong>Step 2 — Photos and details:</strong> Sending photos or a
                  short video helps the team understand the job before the visit.
                </li>
                <li>
                  <strong>Step 3 — Budget Calculator:</strong> For larger work, the
                  free calculator on our website gives a starting estimate.
                </li>
                <li>
                  <strong>Step 4 — Site visit and inspection:</strong> The team
                  checks the problem and nearby areas. Share your locality in
                  Bareilly, and the team will confirm arrangements.
                </li>
                <li>
                  <strong>Step 5 — Diagnosis and options:</strong> You and the team
                  discuss causes, priorities and options.
                </li>
                <li>
                  <strong>Step 6 — Scope and estimate:</strong> For small jobs, a
                  clear price. For larger work, an itemised written estimate.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                What to Keep for Your Records
              </h3>

              <p className="mb-3">Good records save time and money later.</p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Photos before and after:</strong> Show the condition
                  before work and the result.
                </li>
                <li>
                  <strong>Written scope and quote:</strong> What was agreed, with
                  materials and brands.
                </li>
                <li>
                  <strong>Bills and payment receipts:</strong> Proof of what was
                  paid and when.
                </li>
                <li>
                  <strong>Warranty terms:</strong> Coverage, duration and contact
                  details, if provided.
                </li>
                <li>
                  <strong>Test records:</strong> Water test, electrical test and
                  other checks, where done.
                </li>
                <li>
                  <strong>Product information:</strong> Brands, colours and
                  finishes, useful for future touch-ups.
                </li>
                <li>
                  <strong>Contact details:</strong> Names and numbers of the team
                  members.
                </li>
                <li>
                  <strong>Maintenance notes:</strong> Dates of inspections and
                  repairs.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Care After Repair and Renovation
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>Allow plaster, paint and polish to cure fully before heavy use.</li>
                <li>Clear drains, gutters and outlets before every monsoon.</li>
                <li>
                  Watch for new cracks, damp patches and termite signs, and report
                  them early.
                </li>
                <li>Fix leaking taps, pipes and cracks quickly.</li>
                <li>Ventilate rooms regularly to limit damp and mould.</li>
                <li>
                  Service electrical points, switchboards and plumbing fittings once
                  a year.
                </li>
                <li>Avoid drilling into waterproofed areas without advice.</li>
                <li>Keep your records in one safe place.</li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Common Mistakes When Booking Repair and Renovation Services
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  Choosing a service by the lowest price without asking about the
                  cause.
                </li>
                <li>
                  Accepting a phone price without an inspection for anything beyond
                  a tiny job.
                </li>
                <li>Painting over damp, cracks and leaks.</li>
                <li>
                  Calling a different person for each small job without a plan.
                </li>
                <li>Delaying small repairs until they become large ones.</li>
                <li>Ignoring electrical warning signs and growing cracks.</li>
                <li>Skipping a written scope for larger work.</li>
                <li>Paying a large advance before work starts.</li>
                <li>Not keeping records, photos and warranty terms.</li>
                <li>Forgetting to ask who to call if the problem returns.</li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                What to Share When You Request Service
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Property details:</strong> Locality in Bareilly, type of
                  property, age and floor.
                </li>
                <li>
                  <strong>Photos and videos:</strong> The problem, surrounding areas
                  and any damp or damage.
                </li>
                <li>
                  <strong>What is wrong:</strong> Leaks, cracks, electrical issues,
                  plumbing, doors, flooring, paint or other.
                </li>
                <li>
                  <strong>When it started:</strong> And whether it is getting worse.
                </li>
                <li>
                  <strong>Urgency:</strong> Whether it is a safety issue or can
                  wait.
                </li>
                <li>
                  <strong>Previous repairs:</strong> Anything done before and how
                  long ago.
                </li>
                <li>
                  <strong>Renovation goals:</strong> Any upgrades you are
                  considering along with repairs.
                </li>
                <li>
                  <strong>Budget range:</strong> The amount you are comfortable
                  spending.
                </li>
                <li>
                  <strong>Timeline:</strong> Any festival, wedding or move-in date.
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
                  <strong>Construction and renovation:</strong> New homes, extra
                  floors, remodelling, repairs and waterproofing.
                </li>
                <li>
                  <strong>Architecture and interior:</strong> Planned design for
                  kitchens, bedrooms, living areas and offices.
                </li>
                <li>
                  <strong>Doorstep home services:</strong> Carpenter, painter,
                  electrician, plumber, tile and marble, false ceiling and more.
                </li>
                <li>
                  <strong>Property services:</strong> Verified property buying,
                  selling and renting.
                </li>
                <li>
                  <strong>Building materials:</strong> Cement, steel, bricks, tiles
                  and more through the Shop Now section of the website.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Why Choose MTBOSS for Renovation and Repair Services in Bareilly
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Many services, one team:</strong> Repair, waterproofing,
                  plumbing, electrical, carpentry, painting and renovation are
                  planned together.
                </li>
                <li>
                  <strong>Diagnosis before work:</strong> We look for the cause
                  before suggesting a fix.
                </li>
                <li>
                  <strong>Honest guidance:</strong> We tell you what needs urgent
                  attention and what can wait.
                </li>
                <li>
                  <strong>Photos help us help you:</strong> Share a picture and the
                  team can prepare before visiting.
                </li>
                <li>
                  <strong>Free Budget Calculator:</strong> A simple starting
                  estimate for larger work.
                </li>
                <li>
                  <strong>Transparent estimates:</strong> Written, itemised quotes
                  with scope and specifications stated clearly for larger projects.
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
                  <strong>Serving Moradabad and Bareilly:</strong> A company based
                  on Kanth Road, Moradabad, working in both cities.
                </li>
                <li>
                  <strong>Visible track record:</strong> A project gallery and blog
                  on our website.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Areas Served in Bareilly
              </h3>

              <p className="mb-3">
                Civil Lines, Rampur Garden, Izatnagar, Subhash Nagar, Pilibhit
                Bypass Road, Prem Nagar, Rajendra Nagar, Kargaina, DD Puram, Model
                Town, Satellite and nearby localities. Share your location with the
                team to confirm arrangements.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Contact MTBOSS: Renovation and Repair Services in Bareilly
              </h3>

              <p className="mb-3">
                If you are looking for renovation and repair services in Bareilly,
                MTBOSS offers a single point of contact for inspection, repair,
                renovation and handover, supported by a free budget calculator and a
                simple online quote request.
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
                  <strong>Office Address:</strong> Harthala, Kanth Road, Behind KR
                  Collection, near Domino&apos;s, Moradabad, Uttar Pradesh, India.
                </li>
                <li>
                  <strong>Free Quote:</strong> Use the “Get a Construction Quote”
                  option on the website, or contact the team directly by phone or
                  WhatsApp.
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
                    Q1. What renovation and repair services can I get in Bareilly?
                  </strong>
                  <br />
                  Common services include leakage and waterproofing repair, crack
                  and plaster work, plumbing, electrical work, carpentry, flooring,
                  painting, kitchen and bathroom renovation, and full home
                  renovation. The exact scope is written in the agreement.
                </li>

                <li>
                  <strong>
                    Q2. Does MTBOSS provide renovation and repair services in
                    Bareilly?
                  </strong>
                  <br />
                  MTBOSS Construction Private Limited serves Moradabad and Bareilly
                  and offers renovation, repairs and waterproofing as part of its
                  services. Share your locality and the problem with the team to
                  confirm scope and arrangements.
                </li>

                <li>
                  <strong>Q3. How do I know which service I need?</strong>
                  <br />
                  Match the symptom to the likely cause, such as ceiling stains
                  pointing to leaks or tripping switches pointing to electrical
                  issues. If you are unsure, send photos and ask for an inspection.
                </li>

                <li>
                  <strong>Q4. Do I need an inspection for a small repair?</strong>
                  <br />
                  For a clearly defined small job, a price based on photos may be
                  enough. For leaks, cracks, damp or electrical issues, an
                  inspection helps find the real cause.
                </li>

                <li>
                  <strong>Q5. How is repair and renovation work priced?</strong>
                  <br />
                  It may be priced per job, per item, per area, per running foot or
                  as an itemised project estimate. Ask which method is used and what
                  is included.
                </li>

                <li>
                  <strong>
                    Q6. How do I avoid paying twice for the same repair?
                  </strong>
                  <br />
                  Fix the cause, not just the symptom, get a written scope for
                  larger work, ask about warranty terms and keep records of what was
                  done.
                </li>

                <li>
                  <strong>Q7. How long does repair and renovation work take?</strong>
                  <br />
                  A small repair may take a short visit, while larger work takes
                  longer. The timeline depends on scope, condition, material
                  availability and weather, and it is confirmed for larger projects
                  in your agreement.
                </li>

                <li>
                  <strong>Q8. Can I get repair and renovation done in phases?</strong>
                  <br />
                  Yes. A phase-wise plan lets you spread cost and keep the home
                  usable, as long as the order of work stays correct.
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