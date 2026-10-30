import React from "react";
import LandingEnquiry from "../../components/LandingEnquiry";

const Content = () => {
  return (
    <div className="min-h-screen bg-white pt-0">
      <div className="flex flex-col lg:flex-row">
        {/* Content Section */}
        <div className="order-1 flex-1 px-4 py-12 sm:px-8 md:px-16 lg:order-1">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl md:text-3xl">
            How to Choose One You Can Trust
          </h2>

          <div className="max-w-4xl space-y-6 leading-relaxed text-gray-700">
            <section>
              <p>
                Almost every renovation company calls itself the best. The word
                is free, and anyone can print it on a visiting card. What you
                actually need is proof: a company that inspects before quoting,
                explains problems honestly, puts everything in writing, keeps
                the site under supervision and stays reachable after the work
                is done. A renovation touches your walls, roof, wiring,
                plumbing and daily life, so the wrong choice costs money, time
                and peace of mind.
              </p>

              <p className="mt-3">
                If you are looking for the best home renovation company in
                Bareilly, this page gives you a practical way to judge any
                company, including us: a scorecard, ten tests, red flags and a
                fair method to compare quotes. It also explains how MTBOSS
                Construction Private Limited approaches renovation. MTBOSS is
                an architect, interior designer and construction company
                serving Moradabad and Bareilly. It offers renovation, repairs,
                waterproofing, interiors, modular kitchens, carpentry and other
                home services with transparent pricing and on-time delivery.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                What Makes a Renovation Company &quot;Best&quot;? The Scorecard
              </h3>

              <p className="mb-3">
                A good company scores well on all of these points, not only
                one.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2">
                        Quality
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        What to look for
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        How to test it
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Inspection
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Checks the whole house before quoting
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Ask for a visit before any price
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Diagnosis
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Finds causes of leaks, damp and cracks
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Ask what is causing each problem
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Planning
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Gives a written scope and order of work
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Ask to see it on paper
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Transparency
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Item-wise quote with materials named
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Compare line by line
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Coordination
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Handles civil, plumbing, electrical and finishing
                        together
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Ask who manages each trade
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Supervision
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Responsible person on site
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Ask who will be there daily
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Quality control
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Tests before handover
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Ask how work is tested
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Communication
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Clear updates and quick replies
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Notice response before booking
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Track record
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Completed projects you can see
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Ask for photos or a gallery
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Aftercare
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Takes responsibility after handover
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Ask who you call later
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-3">
                Give each point a mark out of five when you speak to two or
                three companies. The total tells you more than any
                advertisement.
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
                Ten Tests to Find the Best Renovation Company in Bareilly
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-3">
                <li>
                  <strong>1. The inspection test</strong>
                  <br />
                  Does the company inspect the house, or quote from a phone
                  call? A real inspection takes time and includes the roof,
                  walls, bathrooms and services.
                </li>

                <li>
                  <strong>2. The diagnosis test</strong>
                  <br />
                  Ask what is causing each leak, crack or damp patch. A good
                  company explains the cause, not only the repair.
                </li>

                <li>
                  <strong>3. The scope test</strong>
                  <br />
                  Ask for a written scope that lists what will and will not be
                  done. Vague scope leads to disputes.
                </li>

                <li>
                  <strong>4. The order-of-work test</strong>
                  <br />
                  Ask in what order trades will work. A company that cannot
                  explain the sequence will damage finished work.
                </li>

                <li>
                  <strong>5. The materials test</strong>
                  <br />
                  Ask for the names and grades of tiles, boards, paints,
                  waterproofing products and fittings. &quot;Good quality&quot;
                  is not an answer.
                </li>

                <li>
                  <strong>6. The quote test</strong>
                  <br />
                  Is the quote item-wise, with quantities, rates and
                  inclusions? A lump sum hides details.
                </li>

                <li>
                  <strong>7. The supervision test</strong>
                  <br />
                  Ask who will be on site every day and who you can call.
                  Unsupervised sites run late and cut corners.
                </li>

                <li>
                  <strong>8. The past work test</strong>
                  <br />
                  Ask to see completed projects, in person or in photos. Look
                  at tile lines, paint edges, door gaps and bathroom finishing.
                </li>

                <li>
                  <strong>9. The honesty test</strong>
                  <br />
                  Ask what could increase the cost. A trustworthy company names
                  possible extras, such as hidden damp or old pipes, before
                  work starts.
                </li>

                <li>
                  <strong>10. The aftercare test</strong>
                  <br />
                  Ask who you call if a leak returns or a fitting loosens. A
                  clear answer matters more than a long warranty speech.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                What a Good Renovation Company Actually Does
              </h3>

              <p className="mb-3">
                The job is more than sending workers. A reliable renovation
                company follows a sequence, and you should expect to see it.
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
                How to Compare Renovation Quotes Fairly
              </h3>

              <p className="mb-3">
                Two quotes with different totals can describe very different
                work. Ask each company to quote for the same list of items,
                then compare.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2">
                        Item
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        What to compare
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Why it matters
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Scope
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Rooms and areas covered, exclusions
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Prevents hidden extras
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Civil and repair work
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Plaster, cracks, wall changes
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Often left out of cheap quotes
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Waterproofing
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        System, coats, areas covered
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Decides leak protection
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Plumbing and electrical
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Materials, points, quality
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Hidden but vital
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Flooring and tiles
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Brand, size, grade, laying method
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Decides look and durability
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Carpentry
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Board, hardware, finish
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Decides daily use
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Painting
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Number of coats, prep, brand
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Decides finish quality
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Debris and cleaning
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Removal and final cleaning
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Frequently missed
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Supervision
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Who is on site and how often
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Decides quality control
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Timeline
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Stage-wise dates
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Shows planning quality
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Payment terms
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Stage-wise or upfront
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Protects your money
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Warranty
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Written terms and coverage
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Gives you recourse
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-3">
                The lowest quote is often lowest because something is missing.
                Compare inclusions before you compare totals.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Warning Signs of a Weak Renovation Company
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>Quotes a price without inspecting the house.</li>
                <li>
                  Calls itself &quot;number one&quot; but cannot show any
                  completed projects.
                </li>
                <li>
                  Offers a lump-sum quote with no item-wise breakup.
                </li>
                <li>
                  Starts painting or finishing before fixing leaks and damp.
                </li>
                <li>Cannot explain the order of work.</li>
                <li>
                  Uses words like &quot;premium&quot; and &quot;branded&quot;
                  without naming anything.
                </li>
                <li>
                  Asks for a very large advance or full payment upfront.
                </li>
                <li>
                  Has no written scope, timeline or warranty.
                </li>
                <li>Leaves the site unsupervised for days.</li>
                <li>
                  Changes the price repeatedly during the work without written
                  approval.
                </li>
                <li>
                  Hard to reach after the first payment.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                What a Good Contract Should Contain
              </h3>

              <p className="mb-3">
                A written agreement protects both sides. Check that it includes
                the following.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Scope of work:</strong> A written list of what is and
                  is not included.
                </li>
                <li>
                  <strong>Materials and brands:</strong> Tiles, paints, boards,
                  waterproofing products and fittings by name.
                </li>
                <li>
                  <strong>Drawings and designs:</strong> Approved layouts where
                  relevant.
                </li>
                <li>
                  <strong>Timeline:</strong> Start date, stage-wise milestones
                  and handover date.
                </li>
                <li>
                  <strong>Payment schedule:</strong> Payments tied to completed
                  stages, not paid upfront.
                </li>
                <li>
                  <strong>Extra work:</strong> How additional work is priced
                  and approved in writing.
                </li>
                <li>
                  <strong>Site responsibilities:</strong> Who provides water,
                  power and storage space.
                </li>
                <li>
                  <strong>Debris and cleaning:</strong> Who removes waste and
                  when.
                </li>
                <li>
                  <strong>Warranty and support:</strong> Terms, coverage and
                  who to contact.
                </li>
                <li>
                  <strong>Taxes:</strong> Whether GST is included in the price.
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
                Factors That Affect Renovation Company Quotes in Bareilly
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
                  <strong>Supervision and management:</strong> Companies that
                  supervise and coordinate properly may price this in, and it
                  protects quality.
                </li>
                <li>
                  <strong>Demolition and debris:</strong> Removing old items
                  and waste adds cost.
                </li>
                <li>
                  <strong>Timeline:</strong> Faster schedules can change the
                  price.
                </li>
              </ul>

              <p className="mt-3">
                The cheapest company is rarely the best value, and the costliest
                is not always the best. Renovation is generally priced by
                scope, area and material, and the range is wide because choices
                differ. Your quote depends on the inspection, so use the free
                MTBOSS Budget Calculator on the website for a starting estimate
                and request a detailed quote after the site visit.
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
                How MTBOSS Approaches a Renovation Project
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
                Handover Checklist: What to Inspect Before Final Payment
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Walls and ceilings:</strong> Look for patches,
                  cracks, uneven paint and damp marks.
                </li>
                <li>
                  <strong>Floors and tiles:</strong> Check level, hollow
                  sounds, gaps and clean edges.
                </li>
                <li>
                  <strong>Bathrooms:</strong> Test drains, water flow, taps,
                  flush and any leaks.
                </li>
                <li>
                  <strong>Kitchen:</strong> Check cabinets, doors, drawers,
                  sink drainage and counter fixing.
                </li>
                <li>
                  <strong>Doors and windows:</strong> Open and close each one,
                  and check locks and alignment.
                </li>
                <li>
                  <strong>Electrical:</strong> Test every switch, socket and
                  light, and check the main board.
                </li>
                <li>
                  <strong>Plumbing:</strong> Run taps and drains and check
                  under sinks for leaks.
                </li>
                <li>
                  <strong>Waterproofed areas:</strong> Check terraces,
                  bathrooms and walls for seepage after water test or first
                  rain.
                </li>
                <li>
                  <strong>Cleanliness:</strong> Debris, paint marks and dust
                  should be removed.
                </li>
                <li>
                  <strong>Documents:</strong> Collect the final bill,
                  specifications and warranty terms, if provided.
                </li>
              </ul>

              <p className="mt-3">
                Make the final payment only after the list is complete and
                small defects are corrected.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Common Mistakes When Choosing a Renovation Company
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  Trusting words like &quot;best&quot; and &quot;number
                  one&quot; without checking past work.
                </li>
                <li>
                  Hiring on a phone quote without an inspection.
                </li>
                <li>
                  Choosing only on price without comparing scope and materials.
                </li>
                <li>
                  Skipping a written scope, timeline and payment plan.
                </li>
                <li>
                  Paying a large advance before work starts.
                </li>
                <li>
                  Allowing finishing work before leaks, damp and wiring are
                  fixed.
                </li>
                <li>
                  Not asking who will supervise the site.
                </li>
                <li>
                  Not planning for hidden problems and keeping no contingency
                  budget.
                </li>
                <li>
                  Skipping the handover inspection and paying in full
                  immediately.
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
                  <strong>Renovation goals:</strong> Repair, refresh, remodel
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
                Why Consider MTBOSS for Home Renovation in Bareilly
              </h3>

              <p className="mb-3">
                We do not ask you to take our word for it. We ask you to run
                the tests above and compare. Here is what you can check with
                us.
              </p>

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
                  <strong>Builder and interior team together:</strong> Civil,
                  waterproofing, plumbing, electrical, carpentry and painting
                  are planned as one project.
                </li>
                <li>
                  <strong>Written scope and itemised quote:</strong> Materials,
                  brands and specifications are stated clearly.
                </li>
                <li>
                  <strong>Free Budget Calculator:</strong> A simple starting
                  estimate before you commit.
                </li>
                <li>
                  <strong>Phase-wise planning:</strong> Work can be divided
                  into stages to match your budget and lifestyle.
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
                Contact MTBOSS: Home Renovation Company in Bareilly
              </h3>

              <p className="mb-3">
                If you are looking for the best home renovation company in
                Bareilly for your home, run the checklist on this page with
                every option you consider. MTBOSS offers a single point of
                contact for inspection, planning, repair, finishing and
                handover, supported by a free budget calculator and a simple
                online quote request.
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
                    Q1. How do I find the best home renovation company in
                    Bareilly?
                  </strong>
                  <br />
                  Compare two or three companies using the same checklist:
                  inspection, diagnosis, written scope, itemised quote,
                  supervision, past work, payment terms and aftercare. The one
                  that scores well across all points is usually the best fit.
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
                    Q3. What should a good renovation company check before
                    quoting?
                  </strong>
                  <br />
                  It should inspect the roof, walls, floors, plumbing, wiring,
                  doors, windows and damp areas, and explain what it finds
                  before giving a price.
                </li>

                <li>
                  <strong>
                    Q4. Is the cheapest renovation company a good choice?
                  </strong>
                  <br />
                  Not always. A very low quote often leaves out items, uses
                  basic materials or skips supervision. Compare inclusions, not
                  only the total.
                </li>

                <li>
                  <strong>
                    Q5. How should I pay a renovation company?
                  </strong>
                  <br />
                  Payments should follow completed stages and be written in the
                  agreement. Avoid paying the full amount upfront, and make the
                  final payment after the handover inspection.
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
                  <strong>Q7. How long does renovation take?</strong>
                  <br />
                  A repair and refresh takes less time than a full renovation.
                  The timeline depends on scope, condition, material
                  availability and weather, and it is confirmed in your
                  agreement.
                </li>

                <li>
                  <strong>
                    Q8. Can I live in my house during renovation?
                  </strong>
                  <br />
                  Often yes, if the work is planned in zones with dust and
                  safety precautions. For full renovations, a short temporary
                  stay can save time and stress.
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