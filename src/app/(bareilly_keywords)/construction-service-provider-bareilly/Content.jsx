import React from "react";
import LandingEnquiry from "../../components/LandingEnquiry";

const Content = () => {
  return (
    <div className="min-h-screen bg-white pt-0">
      <div className="flex flex-col lg:flex-row">
        {/* Content Section */}
        <div className="flex-1 px-4 sm:px-8 md:px-16 py-12 order-1 lg:order-1">
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-8 text-gray-900">
            Construction Service Provider in Bareilly: One Team for Building,
            Repair and Finishing
          </h2>

          <div className="space-y-6 text-gray-700 leading-relaxed max-w-4xl">
            <section>
              <p>
                Most owners do not need &quot;a builder&quot; for one thing. They need a
                team for a whole chain of jobs: building the structure, waterproofing the
                terrace, finishing the floors, wiring the rooms, fitting the kitchen,
                repairing a crack two years later. Hiring a different person for each link
                means chasing several people, repeating the same explanation and finding
                that nobody accepts responsibility when two trades damage each
                other&apos;s work.
              </p>
              <p className="mt-3">
                A construction service provider answers that problem. It brings building,
                repair, renovation and finishing services under one roof, so a single team
                plans the sequence, supplies the right trades and stands behind the
                combined result. The value is not that every job is bigger. It is that the
                handoffs between jobs, where most mistakes happen, are managed by the same
                people.
              </p>
              <p className="mt-3">
                MTBoss is a construction and design company based at Harthala, Kanth Road,
                Moradabad, serving Bareilly and Moradabad. Our website lists construction
                categories alongside a long list of home and building services. This page
                explains what a construction service provider should offer, how a service
                request is handled from the first call to the final snag, and how to
                compare providers on equal terms.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Service Details and Benefits
              </h3>
              <p>
                A construction service provider is a company that offers a range of
                building-related services, from new construction to repair, renovation and
                finishing, rather than a single trade. Some customers need a complete
                building. Others need one specific service, such as waterproofing, a new
                floor or an extra room. A good provider can handle either, and tells you
                honestly when a job is outside what it does well.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Service Menu: What We Take Up
              </h3>
              <p className="mb-3">
                Our website lists the following categories and services. Pick one, or
                combine several.
              </p>

              <p className="mb-2 font-semibold text-gray-900">
                Construction categories
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Residential: independent houses, villas, builder floors and multi-storey
                  homes
                </li>
                <li>
                  Commercial buildings: shops, showrooms, offices, clinics and small
                  complexes
                </li>
                <li>Hotel and hospitality: guest houses, hotels and banquet halls</li>
                <li>
                  Industrial and warehousing: sheds, workshops and godowns
                </li>
                <li>
                  Infrastructure and roads: internal roads, paver blocks, drains, culverts,
                  retaining walls and boundary walls
                </li>
              </ul>

              <p className="mt-4 mb-2 font-semibold text-gray-900">
                Design and planning
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Architecture and interior design</li>
                <li>Building elevation</li>
                <li>
                  Budget guidance through the Budget Calculator on our website
                </li>
              </ul>

              <p className="mt-4 mb-2 font-semibold text-gray-900">
                Repair, renovation and protection
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Building renovation and building repair</li>
                <li>Waterproofing</li>
                <li>Pest control</li>
              </ul>

              <p className="mt-4 mb-2 font-semibold text-gray-900">
                Trades and finishing
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Building contractor services</li>
                <li>Electrician, plumber, carpenter and painter</li>
                <li>Tile and marble work</li>
                <li>False ceiling and PVC panel work</li>
                <li>Door and window installation</li>
                <li>Wallpaper installation</li>
                <li>Modular kitchen</li>
                <li>Readymade boundary</li>
              </ul>

              <p className="mt-4 mb-2 font-semibold text-gray-900">Other services</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>HVAC installation and AC repair</li>
                <li>
                  Construction materials through the Shop Now section
                </li>
              </ul>

              <p className="mt-3">
                If your need does not fit neatly into this menu, describe it and we will
                tell you honestly whether and how we can help.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Choosing Between a Package and a Single Service
              </h3>
              <p className="mb-3">
                Different needs call for different arrangements.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>A single service,</strong> such as waterproofing a terrace or
                  repairing a boundary wall, suits a clear, contained problem
                </li>
                <li>
                  <strong>A bundle of related services,</strong> such as renovating a
                  bathroom with waterproofing, tiling, plumbing and painting, suits owners
                  who want the trades coordinated
                </li>
                <li>
                  <strong>A full project,</strong> such as a new house with design,
                  construction and finishing, suits owners who want one team to carry
                  everything through
                </li>
              </ul>
              <p className="mt-3">
                A good provider helps you choose the smallest arrangement that solves your
                problem, and does not push the largest one.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                How a Service Request Is Handled
              </h3>
              <p className="mb-3">
                Every request, large or small, follows the same basic path, so nothing is
                lost between steps.
              </p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>
                  <strong>Request:</strong> you call, send a WhatsApp message, email or use
                  the quote form on our website, with photographs and a short description.
                </li>
                <li>
                  <strong>Review:</strong> we look at what you send and decide whether a
                  visit is needed.
                </li>
                <li>
                  <strong>Visit:</strong> an engineer or supervisor inspects the site,
                  measures and discusses the work. We agree visit arrangements, including
                  any charge, before we travel.
                </li>
                <li>
                  <strong>Proposal:</strong> you receive a written estimate listing the
                  work, quantities, materials, labour, timeline and payment stages.
                </li>
                <li>
                  <strong>Agreement:</strong> you approve the scope and price, and we
                  confirm the start date.
                </li>
                <li>
                  <strong>Work:</strong> trades are scheduled in the right order, and a
                  named person is responsible for the job.
                </li>
                <li>
                  <strong>Inspection:</strong> the finished work is checked, and any snags
                  are listed.
                </li>
                <li>
                  <strong>Handover and follow-up:</strong> we hand over the work, explain
                  care and tell you how to report a problem.
                </li>
              </ol>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Sequencing the Trades Correctly
              </h3>
              <p className="mb-3">
                Order matters, because later trades damage earlier work if done at the
                wrong time. A typical sequence for a renovation or a new interior runs like
                this:
              </p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Demolition and structural repair</li>
                <li>
                  Concealed plumbing, electrical and air-conditioning work
                </li>
                <li>Waterproofing and testing</li>
                <li>Plaster and wall preparation</li>
                <li>False ceiling frames and lighting points</li>
                <li>Flooring and tiling</li>
                <li>Carpentry, doors, windows and kitchens</li>
                <li>Painting and wall finishes</li>
                <li>Fixtures, switches, lights and sanitary ware</li>
                <li>Cleaning, snagging and handover</li>
              </ol>
              <p className="mt-3">
                Painting before the electrician has finished, or tiling before
                waterproofing is tested, creates rework and disputes. A provider that
                coordinates the trades avoids this.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Planning Around Occupied Homes
              </h3>
              <p className="mb-3">
                Many repair and renovation jobs happen while the family lives in the house.
                Practical arrangements help.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Work in sections, so at least one bathroom and sleeping area stay usable
                </li>
                <li>
                  Agree working hours that suit the household and any society rules
                </li>
                <li>Protect floors, furniture and doors before work begins</li>
                <li>
                  Control dust with sheeting, closed doors and daily cleaning
                </li>
                <li>Secure the home at the end of each day</li>
                <li>
                  Keep children, elderly members and pets away from work areas
                </li>
                <li>
                  Tell us about health needs, exams, events and travel plans, so the
                  schedule works around you.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Planning Around Shops and Offices
              </h3>
              <p>
                Businesses cannot always close. We plan work to suit your trading hours,
                using evenings, closed days or phased sections where possible, and we
                protect stock, equipment and customer routes. Tell us your busiest days and
                any fixed opening date, and we will say honestly what is realistic.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Quality Control Across Services
              </h3>
              <p className="mb-3">
                Each trade has its own pitfalls, but the habits that protect quality are
                common.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Specifications that name materials and products, not just &quot;good
                  quality&quot;
                </li>
                <li>Deliveries checked on arrival and stored properly</li>
                <li>
                  Surfaces prepared before coatings or finishes are applied
                </li>
                <li>
                  Work inspected before it is covered, such as concealed pipes, wires and
                  waterproofing
                </li>
                <li>
                  Testing where suitable, such as pressure tests for plumbing and ponding
                  tests for waterproofing
                </li>
                <li>Honest reporting when something must be redone</li>
                <li>A snag list agreed at handover</li>
              </ul>
              <p className="mt-3">
                Our engineers and supervisors carry out these checks, and we keep written
                notes and photographs of important stages.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Costs, Quotes and Comparing Providers
              </h3>
              <p className="mb-3">
                A single lump figure tells you nothing. A useful quotation lists each
                service or work item with quantity, rate, materials, labour and taxes,
                states what is excluded and sets payment stages and a schedule. When you
                compare providers, match the scope first. A lower figure that leaves out
                preparation, waterproofing or finishing is not cheaper, only less complete.
              </p>
              <p>
                Our website offers a Budget Calculator that gives an early idea of
                construction cost before you commit. After a site visit and a review of
                your drawings or photographs, we prepare an itemised estimate. Cost depends
                on the size and condition of the work, materials and finishes chosen,
                number of trades involved, site access and timeline.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Payments and Agreements
              </h3>
              <p>
                Put the arrangement in writing. A sound agreement states the scope,
                specifications, price and exclusions, the schedule, payment stages linked
                to completed work, how changes are priced and approved and what happens
                after handover. Ask for a tax invoice for every payment. Avoid paying most
                of the money upfront, or paying without receipts. Have a qualified legal
                professional review any agreement before you sign.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Materials Support
              </h3>
              <p>
                Materials decide quality, so choose them knowingly. Our website&apos;s
                Shop Now section lists building materials such as cement, steel and bricks,
                and our team can advise on grades and quantities. Whether we supply the
                materials or you buy them yourself, the specification should state grades
                and brands in writing, and deliveries should be checked on arrival.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Approvals and Paperwork
              </h3>
              <p>
                Some jobs need approvals, particularly new construction, extra floors and
                changes that alter an existing sanctioned plan. Depending on your location,
                the Bareilly Development Authority or another local body may be the
                sanctioning authority, and rules change over time, so confirm the correct
                authority and its current requirements for your plot. Where drawings are
                needed, our design team can prepare them. We cannot promise approval,
                because only the authority grants it.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Working With Us From Bareilly
              </h3>
              <p>
                Our office is in Moradabad, and we serve Bareilly through site visits,
                scheduled supervision and regular updates. We usually begin with a call or
                WhatsApp message and photographs, then visit the site for measurement and
                discussion. During the work, you receive photo and video updates between
                visits, and we agree the visit schedule before you sign. We do not claim a
                Bareilly office, and we would rather you hear that from us up front.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Warning Signs in a Service Provider
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>A price far below every other quotation, with no explanation</li>
                <li>A single lump figure with no breakdown</li>
                <li>&quot;Standard material&quot; with no grades named</li>
                <li>No named engineer or supervisor</li>
                <li>A large advance demanded before any paperwork</li>
                <li>No written agreement</li>
                <li>Reluctance to show finished or running work</li>
                <li>Different business names across documents</li>
                <li>Claims of registration that cannot be shown</li>
              </ul>
              <p className="mt-3">
                Any one of these is a reason to ask more questions.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                What Should You Ask Before You Sign?
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Who is responsible for my job, and how can I reach them?
                </li>
                <li>Can I see the quotation broken down by item?</li>
                <li>Which materials and brands are specified?</li>
                <li>
                  How are the trades sequenced, and who coordinates them?
                </li>
                <li>How are payments linked to progress?</li>
                <li>How are changes priced and approved?</li>
                <li>What happens if a defect appears after handover?</li>
              </ul>
              <p className="mt-3">
                A confident provider answers plainly and puts the answers in writing.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Why Choose MTBoss
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>One team across many services.</strong> MTBoss builds, renovates
                  and repairs homes, shops and commercial and industrial properties, and
                  our website lists the trades and finishing services around them, so one
                  team can coordinate the work.
                </li>
                <li>
                  <strong>A design team behind the work.</strong> We can prepare drawings
                  and elevations, so cost and buildability are checked together.
                </li>
                <li>
                  <strong>Itemised, written estimates.</strong> You see quantities,
                  materials, labour, timeline and payment stages before you commit.
                </li>
                <li>
                  <strong>Supervised stages.</strong> Engineers and supervisors check
                  important stages before they are covered, and we tell you who is
                  responsible for your job.
                </li>
                <li>
                  <strong>Flexible contracts.</strong> Choose turnkey, material plus
                  labour, labour only or item rate, whichever suits your budget and time.
                </li>
                <li>
                  <strong>Early budget guidance.</strong> The Budget Calculator on our
                  website gives a quick idea of cost before you spend anything.
                </li>
                <li>
                  <strong>Honest about promises.</strong> We do not guarantee approvals,
                  and we do not claim registrations or rankings we cannot show.
                </li>
                <li>
                  <strong>Easy to reach.</strong> Call, WhatsApp, email, use the quote form
                  on our website or visit our office on Kanth Road, Moradabad.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Contact MTBoss
              </h3>
              <p className="mb-3">
                Ready to hand your project to one team that coordinates the whole chain?
                Contact MTBoss today.
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
                    href="https://www.mtboss.in/"
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.mtboss.in
                  </a>{" "}
                  — click &quot;Get a Construction Quote&quot;
                </li>
                <li>
                  <strong>Office:</strong> Harthala, Kanth Road, Moradabad, behind KR
                  Collection, near Domino&apos;s
                </li>
              </ul>
              <p className="mt-3">
                Tell us which services you need, send photographs, your location and a
                short brief, and we will arrange a site visit and a written estimate.
              </p>
              <p className="mt-3">
                Hire one team with MTBoss: building, repair and finishing coordinated,
                costs itemised and terms in writing.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Frequently Asked Questions
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Q1. What services do you offer in Bareilly?</strong>
                  <br />
                  Construction, renovation, repair, waterproofing, interiors and finishing
                  trades, as listed on our website.
                </li>
                <li>
                  <strong>Q2. Can I book a single service?</strong>
                  <br />
                  Yes. Describe the job, and we will say what is needed.
                </li>
                <li>
                  <strong>Q3. What do you need to give an estimate?</strong>
                  <br />
                  Location, photographs, drawings or a brief and a budget range.
                </li>
                <li>
                  <strong>Q4. How do you coordinate several trades?</strong>
                  <br />
                  By planning the sequence and naming one person responsible for the job.
                </li>
                <li>
                  <strong>Q5. Do you provide itemised quotations?</strong>
                  <br />
                  Yes. We list work items, quantities, materials, labour, timeline and
                  payment stages.
                </li>
                <li>
                  <strong>Q6. How are payments structured?</strong>
                  <br />
                  In stages linked to completed work, with a tax invoice for each payment.
                </li>
                <li>
                  <strong>Q7. Can you work in an occupied home or shop?</strong>
                  <br />
                  Yes. We plan sections and working hours around your routine.
                </li>
                <li>
                  <strong>Q8. Can I check the likely cost first?</strong>
                  <br />
                  Yes. Use the Budget Calculator on{" "}
                  <a
                    href="https://www.mtboss.in/"
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.mtboss.in
                  </a>{" "}
                  for an early idea.
                </li>
                <li>
                  <strong>Q9. How do I contact MTBoss?</strong>
                  <br />
                  Call or WhatsApp +91 94584 10866, or use &quot;Get a Construction
                  Quote&quot; on{" "}
                  <a
                    href="https://www.mtboss.in/"
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.mtboss.in
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