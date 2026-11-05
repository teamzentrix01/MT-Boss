import React from "react";
import LandingEnquiry from "../../components/LandingEnquiry";

const Content = () => {
  return (
    <div className="min-h-screen bg-white pt-0">
      <div className="flex flex-col lg:flex-row">
        {/* Content Section */}
        <div className="flex-1 px-4 sm:px-8 md:px-16 py-12 order-1 lg:order-1">
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-8 text-gray-900">
            Home Construction Cost per Sq Ft Bareilly: What the Number Covers and What It
            Hides
          </h2>

          <div className="space-y-6 text-gray-700 leading-relaxed max-w-4xl">
            <section>
              <p>
                Almost every owner starts a house project with the same question: what is
                the rate per square foot? It is a sensible place to begin, and a dangerous
                place to stop.
              </p>
              <p className="mt-3">
                Two builders can quote the same rate and deliver very different houses,
                because the figure says nothing about the materials, the finishes, the
                exclusions or the way the area was measured.
              </p>
              <p className="mt-3">
                A per-square-foot rate is a shortcut for comparing proposals. Used
                carefully, it helps you set a rough budget and spot a quotation that looks
                too good to be true. Used carelessly, it leads to bills that grow after
                work begins, because the items the rate left out turn up one by one.
              </p>
              <p className="mt-3">
                MTBoss is a construction and design company based at Harthala, Kanth Road,
                Moradabad, serving Bareilly and Moradabad. This page explains what a
                per-square-foot rate really means, which factors move it, how to compare
                two quotations and how to keep your final cost close to your first
                estimate.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Service Details and Benefits
              </h3>
              <p>
                A home construction estimate should show what is included, what is
                excluded, how the area is measured and how payments are linked to
                completed work. A single per-square-foot number can guide an early budget,
                but it cannot replace a written, itemised quotation.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Rate Snapshot
              </h3>
              <p className="mb-3">
                <strong>Owner note:</strong> Fill this block only with rates MTBoss will
                honour.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Basic specification:</strong> From ₹[X] to ₹[Y] per sq ft of
                  built-up area, covering [state what is included]
                </li>
                <li>
                  <strong>Standard specification:</strong> From ₹[X] to ₹[Y] per sq ft,
                  covering [state what is included]
                </li>
                <li>
                  <strong>Premium specification:</strong> From ₹[X] to ₹[Y] per sq ft,
                  covering [state what is included]
                </li>
                <li>
                  <strong>Labour-only contract:</strong> From ₹[X] per sq ft
                </li>
                <li>
                  <strong>Rates exclude:</strong> [List, such as boundary wall, interiors,
                  furniture, authority fees]
                </li>
                <li>
                  <strong>Taxes:</strong> [Included or extra]
                </li>
                <li>
                  <strong>Rates valid until:</strong> [Date, or &quot;subject to changes
                  in material prices&quot;]
                </li>
              </ul>
              <p className="mt-3">
                If you prefer not to publish figures, replace this block with &ldquo;Request
                an itemised estimate after a site visit&rdquo; and keep the rest of the
                page.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                What Does a Per Sq Ft Rate Actually Cover?
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Excavation, foundation and plinth</li>
                <li>Columns, beams, slabs and staircase</li>
                <li>Brickwork or block masonry</li>
                <li>Internal and external plaster</li>
                <li>Flooring and tiling, with the tile price band stated</li>
                <li>Doors, windows and grills, with materials named</li>
                <li>Electrical wiring, switches and basic fittings</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Built-Up Area, Carpet Area and Covered Area
              </h3>
              <p className="mb-3">
                The same house can be described by three different areas, and mixing them
                is a common source of confusion.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Carpet area:</strong> The usable floor inside the rooms,
                  excluding wall thickness
                </li>
                <li>
                  <strong>Built-up area:</strong> Carpet area plus the thickness of walls,
                  and usually balconies and sunshades as the builder counts them
                </li>
                <li>
                  <strong>Covered area:</strong> The whole footprint under a roof or slab
                  on each floor, which can include porches and stairwells
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Factors That Push the Rate Up or Down
              </h3>
              <p className="mb-3">
                The rate is the result of many choices, so it moves with each of them.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Quality of finishes:</strong> Tiles, sanitary ware, paint, doors
                  and windows are the largest swing factor
                </li>
                <li>
                  <strong>Structural design:</strong> Spans, number of floors, basement and
                  soil conditions affect concrete and steel quantities
                </li>
                <li>
                  <strong>Foundation type:</strong> Soft or filled soil may need deeper or
                  special foundations
                </li>
                <li>
                  <strong>Number of floors:</strong> The first floor costs less per sq ft
                  than a design with complex upper levels or a heavy terrace
                </li>
                <li>
                  <strong>Plan shape:</strong> Simple rectangular plans cost less than
                  plans with many corners, curves and projections
                </li>
                <li>
                  <strong>Elevation work:</strong> Cladding, large glass areas, projections
                  and decorative features add cost
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Specification Tiers Explained
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Basic:</strong> Economical materials, simple tiles, standard
                  sanitary ware and plain paint, suited to budget-led homes and rental
                  floors
                </li>
                <li>
                  <strong>Standard:</strong> Mid-range tiles, better fittings, quality
                  doors and windows and more finishing detail, suited to most family homes
                </li>
                <li>
                  <strong>Premium:</strong> Higher-grade materials, larger glazing, stone
                  or designer finishes, better fittings and detailed interiors
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Cost Layers Beyond the Construction Rate
              </h3>
              <p className="mb-3">
                The per-square-foot rate rarely covers the whole project. Budget separately
                for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Design fee:</strong> Architect or designer charges, and
                  structural engineer fees
                </li>
                <li>
                  <strong>Approvals:</strong> Authority fees and related charges for
                  sanctioning your plan
                </li>
                <li>Soil testing and survey</li>
                <li>Boundary wall, gate and external paving</li>
                <li>
                  <strong>Interiors and furniture:</strong> Kitchen, wardrobes, ceilings,
                  curtains and appliances
                </li>
                <li>Electricity and water connections</li>
                <li>Septic tank or sewer connection, where needed</li>
                <li>Rainwater harvesting and solar, where you choose to install them</li>
                <li>Taxes</li>
                <li>
                  <strong>Contingency:</strong> A reserve for price changes and surprises
                  on site
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Cost Differences by Floor and Structure
              </h3>
              <p className="mb-3">
                Per-square-foot figures change across a building.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Ground floor:</strong> Carries the foundation and plinth, so it
                  often costs more per sq ft than upper floors
                </li>
                <li>
                  <strong>Upper floors:</strong> Usually cost less per sq ft, though
                  stairs, lifts and services still add up
                </li>
                <li>
                  <strong>Terrace and headroom:</strong> Waterproofing, parapet and
                  staircase cover are costs that are easy to forget
                </li>
                <li>
                  <strong>Basement:</strong> Excavation, retaining walls, waterproofing and
                  ventilation make it more expensive than a regular floor
                </li>
                <li>
                  <strong>Balconies and projections:</strong> Structurally demanding, so
                  they may be charged at a different rate
                </li>
                <li>
                  <strong>Extra floors added later:</strong> Need a foundation designed to
                  carry them, so planning early is cheaper than strengthening later
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Worked Example of a Home Budget
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Construction at the chosen specification: 3,000 sq ft &times; ₹[X] =
                  ₹[A]
                </li>
                <li>
                  Staircase headroom and terrace parapet, if charged separately: ₹[B]
                </li>
                <li>Boundary wall and gate: ₹[C]</li>
                <li>Water tank, sump and external drainage: ₹[D]</li>
                <li>Electricity and water connection charges: ₹[E]</li>
                <li>Design fee and structural engineer: ₹[F]</li>
                <li>Authority fees: ₹[G]</li>
                <li>Interiors, kitchen and furniture: ₹[H]</li>
                <li>Contingency reserve: ₹[I]</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Labour-Only, Material Plus Labour and Turnkey Rates
              </h3>
              <p className="mb-3">
                The same house costs differently depending on who buys what.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Labour-only:</strong> The builder charges for workers and
                  supervision, and you buy materials. The rate is lower, but you carry the
                  risk of purchasing, wastage and quality checks
                </li>
                <li>
                  <strong>Material plus labour:</strong> The builder supplies both for an
                  agreed scope, so one party answers for the product and the work
                </li>
                <li>
                  <strong>Turnkey:</strong> The builder also handles design, approvals,
                  finishing and handover, so you receive a ready house
                </li>
                <li>
                  <strong>Item rate:</strong> Payment follows measured quantities, which
                  suits phased or complex work
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Hidden Costs That Surprise Owners
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Exclusions that were never discussed, such as waterproofing, tiles above
                  a certain price, grills and external works
                </li>
                <li>
                  Specification changes mid-project, where &ldquo;standard&rdquo; turns out
                  to mean something different from what you expected
                </li>
                <li>
                  Foundation surprises: Soft soil or a high water level found after digging
                </li>
                <li>Material price swings on long projects</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Ways to Control the Final Cost
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Fix the brief before design:</strong> Changes after construction
                  starts cost the most
                </li>
                <li>
                  <strong>Choose a simple plan shape:</strong> Fewer corners and
                  projections save money
                </li>
                <li>
                  <strong>Match the specification to your budget:</strong> Decide finishes
                  before work reaches them
                </li>
                <li>
                  <strong>Compare itemised quotations:</strong> Not just per-square-foot
                  rates
                </li>
                <li>
                  <strong>Ask for rates for extras in advance:</strong> So changes are
                  priced openly
                </li>
                <li>
                  <strong>Phase the work where sensible:</strong> Build the structure and
                  essential finishes first, and add interiors later
                </li>
                <li>
                  <strong>Plan for the monsoon:</strong> So schedule slips do not drive up
                  costs
                </li>
                <li>
                  <strong>Keep a contingency reserve:</strong> Treat it as part of the
                  budget
                </li>
                <li>
                  <strong>Keep a written record:</strong> For every approved change
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Method for Comparing Two Quotations
              </h3>
              <p className="mb-3">
                Reduce both quotations to the same basis before you compare them.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Convert both to the same area measure, and confirm how balconies and
                  terraces are counted
                </li>
                <li>List the inclusions and exclusions of each</li>
                <li>Compare materials by grade and brand, not by tier name</li>
                <li>Compare payment stages and how they link to completed work</li>
                <li>Compare the schedule and the defects period</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Bareilly Factors That Affect Cost
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Soil:</strong> Soil can vary from plot to plot, and some soils
                  need deeper or special foundations. A soil test on larger buildings helps
                  avoid surprises.
                </li>
                <li>
                  <strong>Monsoon:</strong> Heavy rain delays excavation and concreting and
                  can add costs for protection and rework.
                </li>
                <li>
                  <strong>Plot access:</strong> Narrow lanes and limited storage in dense
                  areas raise carrying and labour costs.
                </li>
                <li>
                  <strong>Local material prices:</strong> Cement, steel, sand, bricks and
                  labour rates change over time, so a quotation should state how long it
                  stays valid.
                </li>
                <li>
                  <strong>Authority requirements:</strong> Depending on your location, the
                  Bareilly Development Authority or another local body may sanction your
                  plan, and the rules may influence what you can build and how.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Payments and Agreements
              </h3>
              <p>
                Put the arrangement in writing. A sound agreement states the scope,
                specification, price and exclusions, the schedule, payment stages linked to
                completed work, how changes are priced and approved and the defects period
                after handover.
              </p>
              <p className="mt-3">
                Ask for a tax invoice for every payment. Avoid paying most of the money
                upfront, or paying without receipts. Have a qualified legal professional
                review any agreement before you sign.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Working With Us From Bareilly
              </h3>
              <p>
                Our office is in Moradabad, and we serve Bareilly through site visits,
                scheduled supervision and regular updates. We usually begin with a call or
                WhatsApp message and photographs, then visit your plot for measurement and
                discussion, with visit arrangements, including any charge, agreed first.
              </p>
              <p className="mt-3">
                We do not claim a Bareilly office, and we would rather you hear that from
                us up front.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Warning Signs in a Cost Quotation
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>A single per-square-foot figure with no list of inclusions</li>
                <li>A rate far below every other quotation, with no explanation</li>
                <li>
                  &ldquo;Standard material&rdquo; with no grades or brands named
                </li>
                <li>Exclusions that are not stated</li>
                <li>A large advance demanded before any paperwork</li>
                <li>No written agreement</li>
                <li>No named engineer or supervisor</li>
                <li>No validity date on the rate</li>
              </ul>
              <p className="mt-3">
                Any one of these is a reason to ask more questions.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                What to Ask Before You Accept a Rate
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Which area do you measure, and how are balconies and terraces counted?
                </li>
                <li>What exactly is included, and what is excluded?</li>
                <li>Which materials, grades and brands are specified?</li>
                <li>How long does the rate stay valid?</li>
                <li>How are payments linked to progress?</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Why Choose MTBoss
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Itemised, written estimates:</strong> You see quantities,
                  materials, labour, timeline and payment stages before you commit, not
                  just a single rate.
                </li>
                <li>
                  <strong>Design and construction under one team:</strong> MTBoss builds,
                  renovates and repairs homes, shops and commercial and industrial
                  properties, and our design team can prepare drawings, so cost and
                  buildability are checked together.
                </li>
                <li>
                  <strong>Early budget guidance:</strong> The Budget Calculator on our
                  website gives a quick idea of cost before you spend anything on design or
                  estimates.
                </li>
                <li>
                  <strong>Clear specifications:</strong> We name materials by grade, so
                  &ldquo;standard&rdquo; means the same thing to both of us.
                </li>
                <li>
                  <strong>Flexible contracts:</strong> Choose turnkey, material plus
                  labour, labour only or item rate, whichever suits your budget and time.
                </li>
                <li>
                  <strong>A wide range under one brand:</strong> Our website also lists
                  building elevation, architecture and interior, waterproofing,
                  electrician, plumber, painter, modular kitchen, false ceiling and
                  readymade boundary services, so one team can coordinate the work.
                </li>
                <li>
                  <strong>Honest about promises:</strong> We do not guarantee approvals,
                  and we do not claim registrations or rankings we cannot show.
                </li>
                <li>
                  <strong>Easy to reach:</strong> Call, WhatsApp, email, use the quote form
                  on our website or visit our office on Kanth Road, Moradabad.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Call to Action
              </h3>
              <p className="mb-3">
                Ready to turn a per-square-foot guess into an itemised estimate for your
                plot? Contact MTBoss today.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Phone / WhatsApp:</strong>{" "}
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
                  </a>{" "}
                  (click &ldquo;Get a Construction Quote&rdquo;)
                </li>
                <li>
                  <strong>Office:</strong> Harthala, Kanth Road, Moradabad (behind KR
                  Collection, near Domino&rsquo;s)
                </li>
              </ul>
              <p className="mt-3">
                Send your plot location and size, drawings if you have them, photographs
                and a short brief with your budget range, and we will arrange a site visit
                and a written estimate.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Frequently Asked Questions
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Q1. What is the home construction cost per sq ft in
                  Bareilly?</strong>
                  <br />
                  It depends on specification, design and site. We give an itemised
                  estimate after a site visit [add range if published].
                </li>
                <li>
                  <strong>Q2. Why do builders quote different rates?</strong>
                  <br />
                  Scope, materials, exclusions and how area is measured differ between
                  quotations.
                </li>
                <li>
                  <strong>Q3. Does the rate include everything?</strong>
                  <br />
                  Not always. Ask for inclusions and exclusions in writing.
                </li>
                <li>
                  <strong>Q4. Which area is the rate based on?</strong>
                  <br />
                  Usually built-up area. Ask how balconies and terraces are counted.
                </li>
                <li>
                  <strong>Q5. What costs sit outside the rate?</strong>
                  <br />
                  Design fees, approvals, boundary wall, connections, interiors and taxes.
                </li>
                <li>
                  <strong>Q6. Is labour-only cheaper?</strong>
                  <br />
                  The rate is lower, but you carry purchasing, wastage and quality risk.
                </li>
                <li>
                  <strong>Q7. How long does a quoted rate stay valid?</strong>
                  <br />
                  It is stated in the quotation, since material prices change [confirm
                  period].
                </li>
                <li>
                  <strong>Q8. Can I check my budget first?</strong>
                  <br />
                  Yes. Use the Budget Calculator on{" "}
                  <a
                    href="https://www.mtboss.in"
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.mtboss.in
                  </a>{" "}
                  for an early idea.
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