import React from "react";
import LandingEnquiry from "../../components/LandingEnquiry";

const Content = () => {
  return (
    <div className="min-h-screen bg-white pt-0">
      <div className="flex flex-col lg:flex-row">
        {/* Content Section */}
        <div className="flex-1 px-4 sm:px-8 md:px-16 py-12 order-1 lg:order-1">
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-8 text-gray-900">
            Architect Fees in Bareilly: MTBoss
          </h2>

          <div className="space-y-6 text-gray-700 leading-relaxed max-w-4xl">
            <section>
              <p>
                Architect fees in Bareilly depend on the project&apos;s size, the
                stages you hire, the level of detail and whether site supervision is
                included. Fees are usually set as a fixed amount, a percentage of
                construction cost or a rate per square foot, and paid in stages. MT
                Boss Construction Private Limited writes a stage-wise fee proposal
                before work begins{" "}
                <span className="text-gray-500">
                  [confirm fee model and COA registration]
                </span>
                .
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Fee Snapshot
              </h3>
              <p className="mb-3">
                <span className="text-gray-500">
                  [Fill this block only with terms MTBoss will honour. Suggested
                  format:]
                </span>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  House design, concept to approval drawings: ₹
                  <span className="text-gray-500">[X]</span> per sq. ft. of built-up
                  area, or ₹<span className="text-gray-500">[X]</span> fixed, for
                  plots up to <span className="text-gray-500">[size]</span>
                </li>
                <li>
                  Approval submission and liaison: ₹
                  <span className="text-gray-500">[X]</span> plus authority fees paid
                  by the owner
                </li>
                <li>
                  Revisions beyond <span className="text-gray-500">[__]</span>{" "}
                  rounds: ₹<span className="text-gray-500">[X]</span> per round
                </li>
                <li>
                  Taxes:{" "}
                  <span className="text-gray-500">
                    [GST included or extra, as applicable]
                  </span>
                </li>
                <li>
                  Proposal validity: <span className="text-gray-500">[__]</span>{" "}
                  days
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Meaning of Architect Fees
              </h3>
              <p>
                An architect&apos;s fee pays for professional time, judgement and
                responsibility: studying your site, designing, coordinating
                consultants, preparing drawings, handling queries and answering for
                the advice given. It is not the cost of building, which is paid
                separately to the builder.
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
                Common Fee Models
              </h3>
              <p className="mb-3">
                Architects charge in several ways{" "}
                <span className="text-gray-500">[state which MTBoss uses]</span>.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Fixed fee.</strong> One agreed sum for defined stages. It
                  is predictable, and works best when the scope is clear.
                </li>
                <li>
                  <strong>Percentage of construction cost.</strong> A share of the
                  project&apos;s building cost. It scales with project size, and
                  raises the question of how cost is measured when the final bill is
                  still unknown.
                </li>
                <li>
                  <strong>Rate per square foot or square metre.</strong> A rate
                  applied to built-up area. It is common for houses and easy to
                  compare.
                </li>
                <li>
                  <strong>Time-based charges.</strong> An hourly or daily rate, used
                  for consultations, reviews and extra work.
                </li>
                <li>
                  <strong>Stage-wise lump sums.</strong> A separate fee for concept,
                  approval drawings, working drawings and supervision, so you can
                  stop or continue after each stage.
                </li>
                <li>
                  <strong>Hybrid.</strong> A fixed design fee plus a separate
                  supervision fee.
                </li>
              </ul>
              <p className="mt-3">
                Ask any architect to say which model applies, and to show the sum in
                rupees for your project.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Fees by Design Stage
              </h3>
              <p className="mb-3">
                Each stage has its own output, and the fee should follow it{" "}
                <span className="text-gray-500">
                  [adjust to MTBoss&apos;s stages]
                </span>
                .
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  <strong>Brief and site study:</strong> Understanding your needs,
                  visiting the plot, measuring and photographing it
                </li>
                <li>
                  <strong>Concept design:</strong> Layout options, massing and a
                  rough look
                </li>
                <li>
                  <strong>Design development:</strong> Refined plans, elevations,
                  sections, 3D views and a material palette
                </li>
                <li>
                  <strong>Approval drawings:</strong> Drawings prepared for the local
                  authority, where required
                </li>
                <li>
                  <strong>Working drawings:</strong> Detailed dimensions, schedules
                  and details the builder uses
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Factors That Move the Fee
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Built-up area and number of floors</li>
                <li>
                  Building type: a house, a shop, a factory and a hospital need
                  different effort
                </li>
                <li>
                  Complexity: curved forms, split levels, double heights and unusual
                  plots take longer
                </li>
                <li>
                  Level of detail: working drawings, 3D views and interior details
                  add time
                </li>
                <li>
                  Number of revisions and changes: more rounds, more hours
                </li>
                <li>
                  Approvals scope: whether the architect prepares and follows up
                  submissions
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                What Is Usually Included and What Is Not
              </h3>
              <p className="mb-3">
                Many disputes begin here. Ask the architect to list it in writing{" "}
                <span className="text-gray-500">
                  [state MTBoss&apos;s inclusions and exclusions]
                </span>
                .
              </p>
              <p className="mb-3">
                <strong>Usually included in a design fee:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Site visit and measurement</li>
                <li>
                  Concept options and a set number of revisions
                </li>
                <li>Plans, elevations and sections</li>
                <li>
                  Approval drawings and working drawings, if the stage is hired
                </li>
                <li>
                  A limited number of site visits
                </li>
              </ul>
              <p className="mt-3 mb-3">
                <strong>Often extra:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Structural design, unless the architect&apos;s team does it
                </li>
                <li>
                  Electrical, plumbing and fire design
                </li>
                <li>
                  Interior design and furniture detailing
                </li>
                <li>Landscape design</li>
                <li>
                  3D walkthroughs and rendered videos
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Reimbursable Expenses
              </h3>
              <p>
                Some costs are billed at actual rather than included in the fee, such
                as printing large drawing sets, travel outside the agreed area,
                authority fees, survey charges and special consultants. A fair
                proposal says which items are reimbursable, how they are billed and
                whether you must approve them in advance.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Payment Schedule
              </h3>
              <p className="mb-3">
                Payments should follow delivered work. A typical structure uses stage
                payments{" "}
                <span className="text-gray-500">
                  [state MTBoss&apos;s actual schedule]
                </span>
                :
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  On signing: an initial payment of{" "}
                  <span className="text-gray-500">[__]</span>%
                </li>
                <li>
                  After concept approval:{" "}
                  <span className="text-gray-500">[__]</span>%
                </li>
                <li>
                  After approval drawings:{" "}
                  <span className="text-gray-500">[__]</span>%
                </li>
                <li>
                  After working drawings:{" "}
                  <span className="text-gray-500">[__]</span>%
                </li>
                <li>
                  During construction:{" "}
                  <span className="text-gray-500">[__]</span>% in instalments, or per
                  visit
                </li>
                <li>On completion: the balance</li>
              </ul>
              <p className="mt-3">
                Avoid arrangements that ask for most of the fee before any drawing is
                produced. Insist on a tax invoice for each payment.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Renovation, Extension and Interior Fees
              </h3>
              <p className="mb-3">
                Work on existing buildings has its own logic.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Measured survey:</strong> Surveying an old building takes
                  extra time, and may be billed separately
                </li>
                <li>
                  <strong>Hidden conditions:</strong> Discoveries after opening walls
                  can change the design
                </li>
                <li>
                  <strong>Smaller jobs:</strong> Minimum fees often apply, since a
                  small job still needs a site visit, drawings and coordination
                </li>
                <li>
                  <strong>Interior design:</strong> Often priced per square foot or
                  as a percentage of the interior budget, with procurement and
                  supervision priced separately
                </li>
                <li>
                  <strong>Elevation redesign:</strong> May be a fixed fee for a
                  defined set of drawings and views
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Fees on Different Project Types
              </h3>
              <p>
                Fee levels and scope differ by type. Houses, builder floors, shops,
                showrooms, hotels, banquet halls, factories and apartment buildings
                each need different drawings and consultants.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Design-Only and Design-and-Build Fees
              </h3>
              <p className="mb-3">MTBoss offers both routes.</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Design only:</strong> You pay a design fee, then choose any
                  builder through quotes. This is the clearest way to compare
                  construction prices independently.
                </li>
                <li>
                  <strong>Design and build:</strong> One company designs and builds,
                  with a design fee, a construction price or both combined.
                </li>
              </ul>
              <p className="mt-3">
                Whichever route you choose, ask for the design fee and the
                construction quotation as separate lines. &ldquo;Free design&rdquo;
                offers are sometimes recovered through construction pricing, so ask
                what the condition is.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Reading a Fee Proposal Line by Line
              </h3>
              <p className="mb-3">
                A good proposal answers these points.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Who is the architect, with registration details
                </li>
                <li>
                  What is the project, including area and floors
                </li>
                <li>Which stages are included</li>
                <li>
                  Which drawings and documents you will receive
                </li>
                <li>
                  How many revisions are included
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Comparing Two Fee Proposals Fairly
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Match the scope: same building, same floors, same stages
                </li>
                <li>
                  Match the deliverables: working drawings, 3D views, approval set
                </li>
                <li>
                  Match the revisions and timelines
                </li>
                <li>
                  Match the consultants: structural and services included or not
                </li>
                <li>
                  Check supervision: visits included, and the charge for extras
                </li>
                <li>
                  Reduce each proposal to a total cost for the same package, then
                  compare.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Low Fees and What They Can Hide
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Fewer drawings, so the builder guesses on site
                </li>
                <li>
                  No site visits, so errors go unseen
                </li>
                <li>
                  Rushed design with little option study
                </li>
                <li>
                  Junior staff doing all the work
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Higher Fees and What They Should Deliver
              </h3>
              <p>
                A higher fee should bring something visible: more design options, a
                senior principal&apos;s time, detailed working drawings, coordination
                with consultants, regular site visits and stronger records. If you
                cannot name the extra value, ask for it in writing.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Fee Against the Cost of Mistakes
              </h3>
              <p>
                An architect&apos;s fee is usually small compared with the
                construction cost, and good design can save far more than it costs:
                smarter layouts, simpler structures, fewer changes on site and better
                energy performance. A weak design often costs more in rework, wasted
                area and maintenance than the fee you saved. Thinking in
                whole-project cost, not fee alone, gives a clearer picture.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Worked Example of a Fee Calculation
              </h3>
              <p className="mb-3">
                This illustration uses placeholders, not real rates.
              </p>
              <p className="mb-3">
                Suppose a house has a built-up area of 2,400 sq. ft.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Design fee: 2,400 sq. ft. × ₹
                  <span className="text-gray-500">[X]</span> per sq. ft. = ₹
                  <span className="text-gray-500">[A]</span>
                </li>
                <li>
                  Split by stage: concept{" "}
                  <span className="text-gray-500">[]</span>%, approval drawings{" "}
                  <span className="text-gray-500">[]</span>%, working drawings{" "}
                  <span className="text-gray-500">[__]</span>%
                </li>
                <li>
                  Structural design by a consulting engineer: ₹
                  <span className="text-gray-500">[B]</span>, if billed separately
                </li>
                <li>
                  Site supervision: <span className="text-gray-500">[__]</span>{" "}
                  visits × ₹<span className="text-gray-500">[C]</span> = ₹
                  <span className="text-gray-500">[D]</span>
                </li>
                <li>
                  Authority fees and printing, at actual: ₹
                  <span className="text-gray-500">[E]</span>
                </li>
                <li>
                  Taxes: ₹<span className="text-gray-500">[F]</span>, if applicable
                </li>
              </ul>
              <p className="mt-3">
                The total is the sum of these lines. The structure matters more than
                the numbers, because a proposal that shows only a single figure hides
                what it covers.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Negotiating Without Cutting Value
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Narrow the scope honestly,</strong> for example by taking
                  approval and working drawings now and interiors later
                </li>
                <li>
                  <strong>Fix the program before design,</strong> because changes
                  cost the most
                </li>
                <li>
                  <strong>Hire by stage,</strong> so you can pause after concept
                </li>
                <li>
                  <strong>Combine services,</strong> such as design, elevation and
                  interiors, if the firm offers a package rate
                </li>
                <li>
                  <strong>Be clear about decisions,</strong> since delay and revision
                  loops raise cost
                </li>
                <li>
                  <strong>Avoid asking for deep cuts on supervision,</strong> because
                  site checks protect the whole investment
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Tax, Invoices and Records
              </h3>
              <p>
                Professional services may attract GST and other taxes depending on
                turnover and the rules in force, and clients who deduct tax at source
                may have obligations{" "}
                <span className="text-gray-500">[confirm with your accountant]</span>
                . Ask for a proper tax invoice for each payment and a written
                agreement. Keep drawings, approvals, receipts and correspondence
                together for future repairs, resale and approvals.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Termination, Refunds and Ownership
              </h3>
              <p className="mb-3">
                Write down what happens if the project stops{" "}
                <span className="text-gray-500">
                  [have a qualified legal professional review any agreement]
                </span>
                :
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Fees due for work done up to that stage
                </li>
                <li>
                  Whether any advance is refundable and on what basis
                </li>
                <li>
                  Who owns the drawings, and whether you may use them for the same
                  plot with another builder
                </li>
                <li>
                  Whether the architect may reuse the design
                </li>
                <li>How disputes will be handled</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                How MTBoss Prepares a Fee Proposal
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
                  <strong>Scope discussion:</strong> Stages, deliverables and
                  revisions
                </li>
                <li>
                  <strong>Written proposal:</strong> Fee, payment schedule, timeline,
                  inclusions and exclusions
                </li>
              </ul>
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
                  <strong>Fee model:</strong>{" "}
                  <span className="text-gray-500">[state plainly]</span>
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
                Reasons Clients Consider MTBoss
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Written, stage-wise fee proposals:</strong> Scope,
                  deliverables and payments stated before work begins{" "}
                  <span className="text-gray-500">[confirm]</span>
                </li>
                <li>
                  <strong>Clear inclusions and exclusions:</strong> Nothing hidden
                  for later
                </li>
                <li>
                  <strong>Separate design and construction pricing,</strong> when
                  you want to compare
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
                Request a Written Fee Proposal
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
                and we will arrange a site study and send a stage-wise proposal.
              </p>
              <p className="mt-3">
                Ask MTBoss for a written fee proposal in Bareilly, with every stage
                priced, every extra named and the terms agreed before work begins.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Frequently Asked Questions
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Q1. What are architect fees in Bareilly?</strong>
                  <br />
                  They depend on size, stages and detail. We give a written proposal
                  after a site study{" "}
                  <span className="text-gray-500">[add range if published]</span>.
                </li>
                <li>
                  <strong>Q2. How do architects charge?</strong>
                  <br />
                  By fixed fee, percentage of cost, rate per square foot, time-based
                  charges or stages.
                </li>
                <li>
                  <strong>Q3. Which model does MTBoss use?</strong>
                  <br />
                  <span className="text-gray-500">[State your actual fee model.]</span>
                </li>
                <li>
                  <strong>Q4. What does the fee include?</strong>
                  <br />
                  Site study, concept, drawings, revisions and limited visits, as
                  listed in the proposal.
                </li>
                <li>
                  <strong>Q5. What is usually extra?</strong>
                  <br />
                  Structural and services design, interiors, 3D walkthroughs,
                  authority fees and extra revisions.
                </li>
                <li>
                  <strong>Q6. How are payments scheduled?</strong>
                  <br />
                  By stage, linked to delivered drawings{" "}
                  <span className="text-gray-500">[state your schedule]</span>.
                </li>
                <li>
                  <strong>
                    Q7. Is the design fee separate from construction cost?
                  </strong>
                  <br />
                  Yes. We keep design and construction quotations separate{" "}
                  <span className="text-gray-500">[confirm]</span>.
                </li>
                <li>
                  <strong>Q8. Is GST charged?</strong>
                  <br />
                  It may apply. We state it clearly in the proposal{" "}
                  <span className="text-gray-500">
                    [confirm with your accountant]
                  </span>
                  .
                </li>
                <li>
                  <strong>Q9. How can I get a fee proposal?</strong>
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