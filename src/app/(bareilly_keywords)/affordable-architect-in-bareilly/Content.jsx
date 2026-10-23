import React from "react";
import LandingEnquiry from "../../components/LandingEnquiry";

const Content = () => {
  return (
    <div className="min-h-screen bg-white pt-0">
      <div className="flex flex-col lg:flex-row">
        {/* Content Section */}
        <div className="flex-1 px-4 sm:px-8 md:px-16 py-12 order-1 lg:order-1">
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-8 text-gray-900">
            Affordable Architect in Bareilly: MTBoss
          </h2>

          <div className="space-y-6 text-gray-700 leading-relaxed max-w-4xl">
            <section>
              <p>
                An affordable architect in Bareilly gives you sound, buildable design
                at a fair price, with a clear scope and no surprise charges. MTBoss
                Construction Private Limited offers stage-wise, itemised design
                proposals for Bareilly and Moradabad, so you can pay for what you
                need and add more later{" "}
                <span className="text-gray-500">
                  [confirm fee model and COA registration]
                </span>
                .
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Budget Snapshot
              </h3>
              <p className="mb-3">
                <span className="text-gray-500">
                  [Fill this block only with terms MTBoss will honour. Suggested
                  format:]
                </span>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Basic package (site study, concept and approval drawings): from ₹
                  <span className="text-gray-500">[X]</span> for plots up to{" "}
                  <span className="text-gray-500">[size]</span>
                </li>
                <li>
                  Standard package (adds working drawings and structural
                  coordination): from ₹<span className="text-gray-500">[X]</span>
                </li>
                <li>
                  Full package (adds interiors detail and site visits): from ₹
                  <span className="text-gray-500">[X]</span>
                </li>
                <li>
                  Extra revision round: ₹<span className="text-gray-500">[X]</span>
                </li>
                <li>
                  Site visits beyond those included: ₹
                  <span className="text-gray-500">[X]</span> each
                </li>
                <li>
                  Taxes: <span className="text-gray-500">[included or extra]</span>
                </li>
                <li>
                  Proposal valid for: <span className="text-gray-500">[__]</span>{" "}
                  days
                </li>
              </ul>
              <p className="mt-3">
                If you prefer not to publish figures, replace this block with
                &ldquo;Request a stage-wise proposal after a site study&rdquo; and
                keep the rest of the page.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Meaning of Affordable in Design Services
              </h3>
              <p>
                Affordable does not mean cheapest. A very low fee that skips
                structural coordination, working drawings and site checks usually
                costs far more later, through rework, wasted area and repairs. An
                affordable architect gives the best value for the money you can
                spend: clear scope, honest advice, efficient design and no padding.
              </p>
              <p className="mt-3">
                MTBoss Construction Private Limited builds, renovates and repairs
                homes, shops and commercial properties across Moradabad and
                Bareilly. Our work follows the promise on our website: planning to
                completion, with quality work, transparent pricing and on-time
                delivery.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                What Affordable Must Never Mean
              </h3>
              <p className="mb-3">
                Some savings are false economy. Do not accept a package that drops:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Structural design by a qualified engineer, since safety depends on
                  it
                </li>
                <li>
                  Soil or site checks where the plot calls for them
                </li>
                <li>
                  Working drawings, which stop the builder from guessing
                </li>
                <li>
                  Compliance with local rules, such as setbacks and coverage{" "}
                  <span className="text-gray-500">[confirm with the authority]</span>
                </li>
                <li>Written scope and fees</li>
                <li>
                  At least a few site visits at critical stages
                </li>
              </ul>
              <p className="mt-3">
                A design that lowers cost by weakening safety is not affordable. It
                is risky.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Ways to Get Good Design on a Tight Budget
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Settle the brief first.</strong> Changes after drawings are
                  made cost the most, so write down your needs and budget before
                  design begins.
                </li>
                <li>
                  <strong>Hire by stage.</strong> Take approval and working drawings
                  now, and interiors later, instead of paying for everything upfront.
                </li>
                <li>
                  <strong>Choose simple shapes and standard sizes.</strong> Regular
                  plans and common room sizes cut both design time and construction
                  cost.
                </li>
                <li>
                  <strong>Use the plot efficiently.</strong> A smart layout can
                  deliver the rooms you need in fewer square feet, saving
                  construction money.
                </li>
                <li>
                  <strong>Decide on time.</strong> Delay and revision loops use up
                  your included hours.
                </li>
                <li>
                  <strong>Keep supervision at key stages.</strong> Visits at
                  foundation, slab and services stages cost little and prevent
                  expensive errors.
                </li>
                <li>
                  <strong>Compare scope, not only price.</strong> A cheaper proposal
                  that leaves out half the drawings is not cheaper.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Service Tiers for Different Budgets
              </h3>
              <p className="mb-3">
                <span className="text-gray-500">
                  [State the tiers MTBoss actually offers.]
                </span>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Basic:</strong> Site study, concept layout, approval
                  drawings and a limited number of revisions. Suits owners with a
                  trusted builder who can work from clear drawings
                </li>
                <li>
                  <strong>Standard:</strong> Adds working drawings, door and window
                  schedules and coordination with a structural engineer. Suits most
                  homes and small shops
                </li>
                <li>
                  <strong>Full:</strong> Adds interior details, material
                  specifications, 3D views and scheduled site visits. Suits owners
                  who want close guidance through construction
                </li>
                <li>
                  <strong>Consultation only:</strong> A paid review of your existing
                  plan, a site visit and written suggestions, for owners who already
                  have drawings
                </li>
              </ul>
              <p className="mt-3">
                Choosing a tier honestly is the single biggest way to control spend.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Standard Plans Compared With Custom Design
              </h3>
              <p>
                Pre-drawn or catalogue plans are cheap and quick, and some are
                perfectly sound. But they ignore your plot&apos;s orientation,
                setbacks, road side, slope and neighbours, and they may not match
                local approval rules. A plan drawn for a north-facing plot can be
                uncomfortable on a south-facing one.
              </p>
              <p className="mt-3">
                Custom design costs more, and fits your plot, family and climate.
              </p>
              <p className="mt-3">
                A middle path is adapting a good base plan to your plot, with a
                registered professional checking structure, approvals and
                orientation. Ask whether MTBoss offers an adaptation service, and
                what it includes{" "}
                <span className="text-gray-500">[confirm]</span>.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Phased Design and Build
              </h3>
              <p className="mb-3">
                Building in stages spreads the cost without spoiling the design.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Design the whole house, so structure and services suit the final
                  form
                </li>
                <li>
                  Build the essential core first: Foundation, structure, kitchen, a
                  bathroom and bedrooms
                </li>
                <li>
                  Finish rooms as money allows: Paint, flooring and fittings
                </li>
                <li>
                  Add later floors or extensions on a structure already sized for
                  them
                </li>
              </ul>
              <p className="mt-3">
                The key is to design the whole before building any part, because
                retrofitting strength or services later is costly.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Small Plots and Builder Floors
              </h3>
              <p className="mb-3">
                Affordable design matters most on small Bareilly plots, where every
                square foot counts.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Stairs and light wells placed to use little area
                </li>
                <li>
                  Windows and ventilation planned for narrow, shared-wall plots
                </li>
                <li>
                  Stacked bathrooms to reduce plumbing cost
                </li>
                <li>
                  Parking planned so the ground floor stays useful
                </li>
                <li>
                  Rental-ready floors with separate entrances, if income matters
                </li>
                <li>
                  Simple elevations that look good without costly detailing
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Where to Spend and Where to Save
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Spend on:</strong> Structure, waterproofing, drainage,
                  electrical safety, good windows and a clear layout.
                </li>
                <li>
                  <strong>Save on:</strong> Decorative elevation features, premium
                  finishes you can upgrade later, custom furniture, imported fittings
                  and complex ceilings.
                </li>
                <li>
                  <strong>Delay:</strong> Landscaping, built-in storage, wallpaper
                  and décor items.
                </li>
              </ul>
              <p className="mt-3">
                Our engineers can show you where your money does the most work.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Savings From a Design-and-Build Team
              </h3>
              <p>
                When one company designs and builds, coordination is simpler, and
                cost can be checked while drawing, which may reduce redesign. MTBoss
                offers design-and-build or design-only{" "}
                <span className="text-gray-500">[confirm]</span>. For fairness, ask
                for a separate design fee and construction quotation, so you can
                compare builders independently. Treat &ldquo;free design&rdquo;
                offers with care, since the cost may be recovered through
                construction pricing.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Red Flags in Very Low Offers
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  A fee far below every other proposal, with no explanation
                </li>
                <li>
                  No written scope, or a single lump figure
                </li>
                <li>
                  No structural or services coordination mentioned
                </li>
                <li>Working drawings left out</li>
                <li>
                  No site visit before the quote
                </li>
                <li>
                  &ldquo;Free design&rdquo; with unclear conditions
                </li>
                <li>
                  Pressure to pay a large advance
                </li>
                <li>
                  No registration details or named designer
                </li>
                <li>
                  Promises of approval without checking local rules
                </li>
                <li>
                  Extra charges appearing after you sign
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Checks Before Hiring on a Budget
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  <strong>Registration:</strong> Ask for the COA number of anyone
                  using the title architect, and verify it
                </li>
                <li>
                  <strong>Scope in writing:</strong> Stages, drawings, revisions and
                  visits
                </li>
                <li>
                  <strong>Past work:</strong> Photographs of finished buildings
                  similar to yours, and a client reference if possible
                </li>
                <li>
                  <strong>Structural arrangement:</strong> Who designs it, and
                  whether it is included
                </li>
                <li>
                  <strong>Total cost for the same package:</strong> Compare proposals
                  line by line
                </li>
                <li>
                  <strong>Payment schedule:</strong> Linked to delivered stages, with
                  no large advance
                </li>
                <li>
                  <strong>Ownership of drawings:</strong> Whether you may reuse them
                  with another builder
                </li>
                <li>
                  <strong>Communication:</strong> How quickly and clearly the firm
                  answers
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Revisions, Changes and Hidden Extras
              </h3>
              <p className="mb-3">
                Affordable proposals go wrong when extras pile up. Ask:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  How many revision rounds are included
                </li>
                <li>
                  What a change after approval costs
                </li>
                <li>
                  Whether printing, travel and authority fees are extra
                </li>
                <li>
                  Whether supervision visits beyond the included number are charged
                </li>
                <li>
                  Whether taxes are in the quoted figure
                </li>
              </ul>
              <p className="mt-3">
                A clear proposal answers all of these before you sign{" "}
                <span className="text-gray-500">[state MTBoss&apos;s terms]</span>.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Approvals and Paperwork Without Surprises
              </h3>
              <p>
                Approvals can add cost and delay if mishandled{" "}
                <span className="text-gray-500">
                  [confirm the authority and what MTBoss handles]
                </span>
                . Ask who prepares and submits the drawings, who pays authority fees
                and how long the process normally takes. Having drawings ready and
                correct the first time avoids repeated submissions. For legal or
                ownership questions, please consult a qualified professional.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                How MTBoss Keeps Proposals Fair
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Enquiry:</strong> Call, WhatsApp or click Get a
                  Construction Quote on MTBoss.in, with your location pin, plot
                  papers and a short brief
                </li>
                <li>
                  <strong>Site study:</strong> A visit to your plot in Bareilly{" "}
                  <span className="text-gray-500">
                    [confirm visit policy and any travel charge]
                  </span>
                </li>
                <li>
                  <strong>Tier discussion:</strong> Which package fits your needs and
                  budget
                </li>
                <li>
                  <strong>Written proposal:</strong> Stages, deliverables, revisions,
                  fee and timeline, with inclusions and exclusions named
                </li>
                <li>
                  <strong>Your review:</strong> You compare it with other proposals
                </li>
                <li>
                  <strong>Agreement and start:</strong> Signed terms and a named
                  project contact
                </li>
              </ul>
              <p className="mt-3">
                Use the Budget Calculator on MTBoss.in for an early idea of
                construction cost.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Related Services From MTBoss
              </h3>
              <p>
                Through MTBoss.in, MTBoss also offers Architecture &amp; Interior,
                Building Elevation, Building Contractor, Building Renovation,
                Modular Kitchen, False Ceiling, Water Proofing, Painter, Electrician
                and Plumber, so design, construction and finishing can be
                coordinated.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                MTBoss Facts at a Glance
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  <strong>Business:</strong> MTBoss Construction Private Limited
                </li>
                <li>
                  <strong>Service:</strong> Architecture, interior and building
                  design, alongside construction and home services
                </li>
                <li>
                  <strong>Registered office:</strong> Harthala, Kanth Road, Moradabad
                  (behind KR Collection, near Domino&apos;s), Uttar Pradesh
                </li>
                <li>
                  <strong>Service area:</strong> Bareilly, Moradabad and nearby areas
                  of western Uttar Pradesh
                </li>
                <li>
                  <strong>Bareilly presence:</strong>{" "}
                  <span className="text-gray-500">
                    [state truthfully: visiting team, site office or branch, with
                    address if one exists]
                  </span>
                </li>
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
                    href="mailto:MTBoss2016@gmail.com"
                    className="text-blue-600 underline"
                  >
                    MTBoss2016@gmail.com
                  </a>
                </li>
                <li>
                  <strong>Website:</strong>{" "}
                  <a
                    href="https://www.MTBoss.in"
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.MTBoss.in
                  </a>
                </li>
                <li>
                  <strong>Design lead:</strong>{" "}
                  <span className="text-gray-500">
                    [name, qualification and COA registration number, if applicable]
                  </span>
                </li>
                <li>
                  <strong>Credentials:</strong>{" "}
                  <span className="text-gray-500">
                    [add company registration and GST details you can show]
                  </span>
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Reasons Owners Consider MTBoss
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Tiered, stage-wise proposals:</strong> Pay for what you
                  need{" "}
                  <span className="text-gray-500">[confirm]</span>
                </li>
                <li>
                  <strong>Clear inclusions and exclusions:</strong> Nothing hidden
                  for later
                </li>
                <li>
                  <strong>Safety-first scope:</strong> Structure, drawings and site
                  checks kept in
                </li>
                <li>
                  <strong>Separate design and construction pricing,</strong> when you
                  want to compare
                </li>
                <li>
                  <strong>Flexible engagement:</strong> Design only, or design and
                  build
                </li>
                <li>
                  <strong>Easy contact:</strong> Website, call, WhatsApp, email or
                  office visit
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Areas We Serve
              </h3>
              <p>
                We work with clients in Bareilly city and nearby areas, including
                Civil Lines, Izzatnagar, Rampur Garden, Subhash Nagar, Prem Nagar,
                Rajendra Nagar, DD Puram, Satellite, Pilibhit Bypass Road, Bithri
                Chainpur and Kargaina, depending on the project and location{" "}
                <span className="text-gray-500">
                  [confirm your real coverage and delete areas you do not serve]
                </span>
                . We also serve Moradabad and nearby towns of western Uttar Pradesh.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Request a Stage-Wise Proposal
              </h3>
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
                    href="mailto:MTBoss2016@gmail.com"
                    className="text-blue-600 underline"
                  >
                    MTBoss2016@gmail.com
                  </a>
                </li>
                <li>
                  <strong>Website:</strong>{" "}
                  <a
                    href="https://www.MTBoss.in"
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.MTBoss.in
                  </a>{" "}
                  (click &ldquo;Get a Construction Quote&rdquo;)
                </li>
                <li>
                  <strong>Office:</strong> Harthala, Kanth Road, Moradabad (behind
                  KR Collection, near Domino&apos;s)
                </li>
              </ul>
              <p className="mt-3">
                Share your plot size, location pin, building type and budget range,
                and we will arrange a site study and send a proposal that shows every
                stage.
              </p>
              <p className="mt-3">
                Ask MTBoss for an affordable design proposal in Bareilly, with the
                scope written down, the safety items kept in and the price clear
                before work begins.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Frequently Asked Questions
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Q1. Who is an affordable architect in Bareilly?</strong>
                  <br />
                  MTBoss offers stage-wise, clearly priced design for Bareilly and
                  Moradabad{" "}
                  <span className="text-gray-500">[confirm registration]</span>.
                </li>
                <li>
                  <strong>Q2. Does affordable mean lower quality?</strong>
                  <br />
                  No. We trim scope and extras, not structure, safety or drawings.
                </li>
                <li>
                  <strong>Q3. What do I get in the basic package?</strong>
                  <br />
                  Site study, concept, approval drawings and limited revisions{" "}
                  <span className="text-gray-500">[confirm contents]</span>.
                </li>
                <li>
                  <strong>Q4. Can I hire design in stages?</strong>
                  <br />
                  Yes. Take approval drawings first and add other stages later.
                </li>
                <li>
                  <strong>Q5. Is a ready-made plan cheaper?</strong>
                  <br />
                  Often yes, but it may not suit your plot or rules. We can adapt a
                  base plan <span className="text-gray-500">[confirm]</span>.
                </li>
                <li>
                  <strong>Q6. What should never be cut to save money?</strong>
                  <br />
                  Structural design, working drawings, local-rule checks and site
                  visits.
                </li>
                <li>
                  <strong>Q7. Are there hidden charges?</strong>
                  <br />
                  We list inclusions and exclusions in writing before you sign{" "}
                  <span className="text-gray-500">[confirm]</span>.
                </li>
                <li>
                  <strong>Q8. Can I take design only and use my own builder?</strong>
                  <br />
                  Yes <span className="text-gray-500">[confirm]</span>.
                </li>
                <li>
                  <strong>Q9. How can I get a proposal?</strong>
                  <br />
                  Click &ldquo;Get a Construction Quote&rdquo; on MTBoss.in, or call
                  or WhatsApp{" "}
                  <a
                    href="https://wa.me/9458410866"
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    +91 94584 10866
                  </a>
                  .
                </li>
                <li>
                  <strong>Q10. Which areas do you serve?</strong>
                  <br />
                  Bareilly, Moradabad and nearby areas of western Uttar Pradesh.
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