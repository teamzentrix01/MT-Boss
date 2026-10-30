import React from "react";
import LandingEnquiry from "../../components/LandingEnquiry";

const Content = () => {
  return (
    <div className="min-h-screen bg-white pt-0">
      <div className="flex flex-col lg:flex-row">
        {/* Content Section */}
        <div className="order-1 flex-1 px-4 py-12 sm:px-8 md:px-16 lg:order-1">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl md:text-3xl">
            Who Runs the Site Decides How the Project Ends
          </h2>

          <div className="max-w-4xl space-y-6 leading-relaxed text-gray-700">
            <section>
              <p>
                A renovation is not one job. It is a dozen jobs happening in a
                fixed order: civil repair, waterproofing, plumbing,
                electrical, plaster, flooring, ceilings, carpentry and
                painting. Each trade depends on the one before it. A
                contractor&apos;s real work is not holding a hammer. It is
                planning that order, supervising each stage, keeping materials
                on time and making sure one trade does not damage another&apos;s
                work.
              </p>

              <p className="mt-3">
                If you are looking for a home renovation contractor in
                Bareilly, this page will help you do three things: understand
                what a renovation contractor actually manages, know the
                different types of contracts and what to put in writing, and
                see how MTBOSS runs a renovation site from the first inspection
                to handover. MTBOSS Construction Private Limited is an
                architect, interior designer and construction company serving
                Moradabad and Bareilly. It offers renovation, repairs,
                waterproofing, interiors, modular kitchens, carpentry and other
                home services with transparent pricing and on-time delivery.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Renovation Contracting at a Glance
              </h3>

              <p className="mb-3">
                Your house, budget and timeline matter more than any template.
                MTBOSS helps you plan a renovation that is managed properly
                from start to finish.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2">
                        Contractor responsibility
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        What it involves
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Why it matters
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Inspection and scope
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Checks the house and writes what will be done
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Prevents disputes later
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Planning and sequencing
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Orders trades correctly
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Avoids damage and rework
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Materials
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Orders, checks and stores materials
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Keeps work on schedule
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Labour and trades
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Brings skilled workers for each stage
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Decides quality of workmanship
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Site supervision
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Monitors daily progress and quality
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Catches errors early
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Safety and protection
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Protects people, floors and belongings
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Avoids accidents and damage
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Coordination with you
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Updates, approvals and decisions
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Keeps the project on track
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Testing and handover
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Checks water, power, finish and fittings
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Ensures the work really works
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Aftercare
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Fixes defects and answers calls later
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Protects your investment
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
                Renovation Contractor Services Offered by MTBOSS for Bareilly
                Clients
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Site inspection and assessment:</strong> Checking
                  walls, roof, floors, plumbing, wiring, damp patches and
                  structure.
                </li>
                <li>
                  <strong>Scope and work plan:</strong> A written scope, order
                  of work and phase-wise plan before work begins.
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
                  <strong>Site management:</strong> Material scheduling,
                  supervision, cleaning and debris removal.
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
                Types of Renovation Contracts: Know What You Are Signing
              </h3>

              <p className="mb-3">
                Contractors offer different arrangements. Each has trade-offs.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2">
                        Contract type
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        What it means
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Good for
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Watch out for
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Labour-only
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        You buy materials, the contractor provides labour
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Homeowners who can manage purchases
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        You carry material risk, delays and waste
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Material plus labour
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Contractor supplies materials and labour for the agreed
                        scope
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Most home renovations
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Brands and quantities must be written down
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Turnkey
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Contractor handles design, materials, all trades and
                        handover
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Busy owners, full or major renovations
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Scope, inclusions and payment stages must be clear
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Phase-wise
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Work is divided into stages with separate scope and
                        payments
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Limited budgets, living at home
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Sequence must stay correct
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Item-rate
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Priced per unit, such as per sq ft of tiling or
                        painting
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Clearly measurable work
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Measurement and extras must be agreed
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Lump-sum
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        One total for a defined scope
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Clear, fixed scope
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Changes and extras should be priced in writing
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-3">
                Choose the type that matches your time, budget and ability to
                manage the site. For most homeowners, a material-plus-labour or
                turnkey contract with a written scope is the easiest to follow.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                What a Good Renovation Contractor Actually Does
              </h3>

              <p className="mb-3">
                The job is more than sending workers. A reliable renovation
                contractor follows a sequence, and you should expect to see it.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Inspects before quoting:</strong> A price given
                  without seeing the house is only a guess.
                </li>
                <li>
                  <strong>Finds the real problems:</strong> Cracks, leaks, damp,
                  old wiring and weak plaster are identified.
                </li>
                <li>
                  <strong>Writes a clear scope:</strong> What will be done,
                  what will not, and in what order.
                </li>
                <li>
                  <strong>Plans the sequence:</strong> Trades follow the right
                  order to protect finished work.
                </li>
                <li>
                  <strong>Arranges materials on time:</strong> Orders are
                  planned so work does not stop.
                </li>
                <li>
                  <strong>Brings skilled workers for each trade:</strong> Right
                  people for civil, plumbing, electrical, tiling, carpentry and
                  painting.
                </li>
                <li>
                  <strong>Supervises daily:</strong> Someone responsible checks
                  progress and quality.
                </li>
                <li>
                  <strong>Protects your home:</strong> Floors, furniture and
                  fixtures are covered and dust is managed.
                </li>
                <li>
                  <strong>Keeps you informed:</strong> Progress, decisions and
                  costs are shared clearly.
                </li>
                <li>
                  <strong>Controls variations:</strong> Changes are priced and
                  approved in writing before work.
                </li>
                <li>
                  <strong>Tests before handover:</strong> Water, power, drains,
                  doors and fittings are checked.
                </li>
                <li>
                  <strong>Cleans and hands over:</strong> The site is cleaned,
                  and the work is explained to you.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                The Correct Order of Work: What Your Contractor Should Follow
              </h3>

              <p className="mb-3">
                If a contractor cannot explain this order for your house, be
                careful.
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
                        Site protection and removal
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Clear working area, protected home
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">3</td>
                      <td className="border border-gray-300 px-3 py-2">
                        Structural and civil repairs
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Walls, slabs and openings must be sound
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">4</td>
                      <td className="border border-gray-300 px-3 py-2">
                        Waterproofing and leak repair
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Stops water before finishing begins
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">5</td>
                      <td className="border border-gray-300 px-3 py-2">
                        Plumbing and electrical first-fix
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Pipes and wires go behind finished surfaces
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">6</td>
                      <td className="border border-gray-300 px-3 py-2">
                        Plaster and wall preparation
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Prepares clean base for finishes
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">7</td>
                      <td className="border border-gray-300 px-3 py-2">
                        Flooring and wall tiling
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Sets the base for carpentry and fittings
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">8</td>
                      <td className="border border-gray-300 px-3 py-2">
                        False ceiling work
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Done before final painting
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">9</td>
                      <td className="border border-gray-300 px-3 py-2">
                        Carpentry, doors and windows
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
                  <strong>What type of contract do you offer?</strong>{" "}
                  Labour-only, material plus labour, turnkey or phase-wise.
                </li>
                <li>
                  <strong>What is included and excluded in the scope?</strong>{" "}
                  Get it in writing.
                </li>
                <li>
                  <strong>In what order will the work be done?</strong> Ask for
                  a stage-wise plan with dates.
                </li>
                <li>
                  <strong>Who supervises the site, and how often?</strong> You
                  should know who is responsible.
                </li>
                <li>
                  <strong>Who handles each trade?</strong> Ask whether workers
                  are in-house or outsourced.
                </li>
                <li>
                  <strong>Which materials and brands will be used?</strong> Get
                  names, not general words.
                </li>
                <li>
                  <strong>
                    How will you protect my home and manage dust and debris?
                  </strong>{" "}
                  Ask for specifics.
                </li>
                <li>
                  <strong>How are payments structured?</strong> They should
                  follow completed stages.
                </li>
                <li>
                  <strong>
                    What happens if the work is delayed or defective?
                  </strong>{" "}
                  Ask for terms in writing.
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
                  Uses words like &quot;premium&quot; and &quot;branded&quot;
                  without naming anything.
                </li>
                <li>
                  Asks for a very large advance or full payment upfront.
                </li>
                <li>Leaves the site unsupervised for days.</li>
                <li>
                  Has no written scope, timeline or warranty.
                </li>
                <li>
                  Changes the price repeatedly during the work without written
                  approval.
                </li>
                <li>Cannot show any completed projects.</li>
                <li>
                  Is hard to reach after receiving payment.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                What a Good Renovation Contract Should Contain
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
                  <strong>Contract type:</strong> Labour-only, material plus
                  labour, turnkey or phase-wise.
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
                  <strong>Variation clause:</strong> How extra work is priced
                  and approved in writing.
                </li>
                <li>
                  <strong>Site responsibilities:</strong> Who provides water,
                  power, storage space and access.
                </li>
                <li>
                  <strong>Debris and cleaning:</strong> Who removes waste and
                  when.
                </li>
                <li>
                  <strong>Delay and defect terms:</strong> What happens if work
                  is late or faulty.
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
                Managing a Renovation Site: How You Can Help
              </h3>

              <p className="mb-3">
                A good contractor does the heavy lifting, but a few habits from
                your side make the project smoother.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Decide early:</strong> Confirm tiles, paints and
                  fittings before work reaches that stage, since delays in
                  decisions delay the site.
                </li>
                <li>
                  <strong>Nominate one decision-maker:</strong> Mixed
                  instructions from the family cause confusion and rework.
                </li>
                <li>
                  <strong>Visit regularly:</strong> Check progress at key
                  stages, such as after waterproofing and before tiling.
                </li>
                <li>
                  <strong>Ask for photos:</strong> Photos of concealed work,
                  such as pipes and wiring, are useful records.
                </li>
                <li>
                  <strong>Keep changes in writing:</strong> Even a short
                  message avoids disputes about what was agreed.
                </li>
                <li>
                  <strong>Pay by stage:</strong> Release payments after you
                  have checked the completed stage.
                </li>
                <li>
                  <strong>Keep the site accessible:</strong> Clear access for
                  materials and workers saves time.
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
                Bareilly Planning Notes for Renovation Contractors
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
                  <strong>Labour availability:</strong> Festival and wedding
                  seasons can affect availability, so book early.
                </li>
                <li>
                  <strong>Lane access and storage:</strong> Narrow lanes and
                  limited storage affect material delivery and site planning.
                </li>
                <li>
                  <strong>Society and neighbour rules:</strong> Check working
                  hours, debris disposal and noise restrictions.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Choose Your Renovation Contract Plan
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
                  <strong>Interior renovation plan:</strong> Flooring,
                  ceilings, carpentry and painting.
                </li>
                <li>
                  <strong>Turnkey renovation plan:</strong> Design, materials,
                  all trades and handover under one contract.
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
                Factors That Affect Renovation Contractor Charges in Bareilly
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
                  <strong>Contract type:</strong> Turnkey contracts include
                  management and materials, labour-only does not.
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
                  <strong>Supervision and management:</strong> Good site
                  management has a cost, but it protects quality and timeline.
                </li>
                <li>
                  <strong>Access and floor level:</strong> Upper floors and
                  narrow lanes add carrying effort.
                </li>
                <li>
                  <strong>Debris and cleaning:</strong> Removing waste adds
                  cost.
                </li>
                <li>
                  <strong>Timeline:</strong> Faster schedules can change the
                  price.
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
                How MTBOSS Runs a Renovation Project
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
                  <strong>Step 6 — Scope and contract type:</strong> The team
                  proposes a scope and the contract arrangement that suits you.
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
                  bathrooms and walls for seepage after a water test or first
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
                Care After Renovation
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
                Common Mistakes When Hiring a Renovation Contractor
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  Hiring on a phone quote without an inspection.
                </li>
                <li>
                  Choosing the cheapest quote without comparing scope and
                  materials.
                </li>
                <li>
                  Signing without a written scope, timeline and payment plan.
                </li>
                <li>
                  Choosing a labour-only contract without being able to manage
                  materials and schedule.
                </li>
                <li>
                  Allowing finishing work before leaks, damp and wiring are
                  fixed.
                </li>
                <li>
                  Not asking who supervises the site and how often.
                </li>
                <li>
                  Agreeing to extra work without a written price.
                </li>
                <li>
                  Paying a large advance before work starts.
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
                  Hiring separate contractors for each trade and managing them
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
                  <strong>Contract preference:</strong> Turnkey, material plus
                  labour, labour-only or phase-wise.
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
                  <strong>Living arrangements:</strong> Whether the family will
                  stay at home during the work.
                </li>
                <li>
                  <strong>Access details:</strong> Floor, lift, parking, lane
                  width, debris disposal and society rules.
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
                Why Choose MTBOSS as Your Home Renovation Contractor in
                Bareilly
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Inspect first, quote later:</strong> We study the
                  property before suggesting a plan or price.
                </li>
                <li>
                  <strong>Written scope and contract type:</strong> You know
                  what is included before work begins.
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
                  <strong>Site supervision and updates:</strong> The team keeps
                  you informed at each stage.
                </li>
                <li>
                  <strong>Free Budget Calculator:</strong> A simple starting
                  estimate before you commit.
                </li>
                <li>
                  <strong>Transparent estimates:</strong> Written, itemised
                  quotes with materials and brands stated clearly.
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
                Contact MTBOSS: Home Renovation Contractor in Bareilly
              </h3>

              <p className="mb-3">
                If you are looking for a home renovation contractor in
                Bareilly, MTBOSS offers a single point of contact for
                inspection, planning, site management, finishing and handover,
                supported by a free budget calculator and a simple online quote
                request.
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
                    Q1. What does a home renovation contractor in Bareilly do?
                  </strong>
                  <br />
                  A renovation contractor inspects the house, plans the scope
                  and order of work, arranges materials and skilled workers for
                  each trade, supervises the site, tests the work and hands it
                  over. The exact scope is written in the agreement.
                </li>

                <li>
                  <strong>
                    Q2. Does MTBOSS work as a home renovation contractor in
                    Bareilly?
                  </strong>
                  <br />
                  MTBOSS Construction Private Limited serves Moradabad and
                  Bareilly and offers renovation as one of its services. Share
                  your locality and requirements with the team to confirm scope
                  and arrangements.
                </li>

                <li>
                  <strong>
                    Q3. What is the difference between labour-only and turnkey
                    contracts?
                  </strong>
                  <br />
                  In a labour-only contract you buy materials and the
                  contractor provides workers. In a turnkey contract the
                  contractor handles design, materials, trades and handover
                  under one arrangement.
                </li>

                <li>
                  <strong>
                    Q4. How do I choose the right contractor for renovation?
                  </strong>
                  <br />
                  Look for one who inspects first, explains the order of work,
                  gives an itemised written quote, names materials and brands,
                  supervises the site, shows past work and offers clear payment
                  stages.
                </li>

                <li>
                  <strong>
                    Q5. How should I pay a renovation contractor?
                  </strong>
                  <br />
                  Payments should follow completed stages and be written in the
                  agreement. Avoid paying the full amount upfront, and make the
                  final payment after the handover inspection.
                </li>

                <li>
                  <strong>
                    Q6. How much does a renovation contractor charge in
                    Bareilly?
                  </strong>
                  <br />
                  The cost depends on house size, scope, condition, contract
                  type, materials and design complexity. Use the free MTBOSS
                  Budget Calculator for a starting estimate and request a
                  detailed quote after a site visit.
                </li>

                <li>
                  <strong>
                    Q7. How long does a renovation project take?
                  </strong>
                  <br />
                  A repair and refresh takes less time than a full renovation.
                  The timeline depends on scope, condition, material
                  availability and weather, and it is confirmed in your
                  agreement.
                </li>

                <li>
                  <strong>Q8. Who supervises the work on site?</strong>
                  <br />
                  Supervision arrangements should be agreed before the contract
                  is signed. Ask who is responsible on site, how often they
                  visit and how progress will be shared with you.
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