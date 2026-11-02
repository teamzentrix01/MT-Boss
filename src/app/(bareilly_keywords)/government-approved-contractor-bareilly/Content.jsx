import React from "react";
import LandingEnquiry from "../../components/LandingEnquiry";

const Content = () => {
  return (
    <div className="min-h-screen bg-white pt-0">
      <div className="flex flex-col lg:flex-row">
        {/* Content Section */}
        <div className="flex-1 px-4 sm:px-8 md:px-16 py-12 order-1 lg:order-1">
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-8 text-gray-900">
            Government Approved Contractor in Bareilly: What the Term Means, How
            to Verify It and What Else Matters
          </h2>

          <div className="space-y-6 text-gray-700 leading-relaxed max-w-4xl">
            <section>
              <p>
                Many owners in Bareilly search for a &quot;government approved
                contractor&quot; because the phrase sounds like a guarantee. It is not.
                The words are used loosely, and they can describe very different things:
                registration with a government department, enlistment with a local body,
                eligibility to bid for public tenders, or simply a claim that has no
                paperwork behind it. Before you hire anyone on the strength of this
                phrase, it helps to know what it can mean, how to check it and which other
                qualities matter more for your own building.
              </p>
              <p className="mt-3">
                MTBOSS is an architect, interior design and construction company serving
                Moradabad and Bareilly, known for quality work, transparent pricing and
                on-time delivery. This page explains the term honestly, and states plainly
                what we share and what we do not claim.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                What Government Approved Can Mean
              </h3>
              <p className="mb-3">
                The phrase has no single legal definition, so ask what the speaker means.
                Common meanings include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Registration with a government department.</strong> Some
                  departments maintain lists of contractors who may bid for their works,
                  often grouped by category and value limits. The rules belong to each
                  department and change over time.
                </li>
                <li>
                  <strong>Enlistment with a local body or authority.</strong> A municipal
                  body or development authority may keep its own list of contractors for
                  certain works.
                </li>
                <li>
                  <strong>Eligibility for public tenders.</strong> A contractor may meet
                  the conditions needed to bid for government projects. This relates to
                  public works, not to private homes.
                </li>
                <li>
                  <strong>Statutory registrations.</strong> Business and labour-related
                  registrations, such as tax registration, are required for operating a
                  business, but they are different from being &quot;approved&quot; for
                  building work.
                </li>
                <li>
                  <strong>A professional or trade recognition.</strong> Some
                  certifications relate to quality systems or specific trades.
                </li>
                <li>
                  <strong>A loose claim.</strong> Some contractors use the phrase as a
                  slogan with no paperwork behind it.
                </li>
              </ul>
              <p className="mt-3">
                Knowing which meaning applies to the contractor in front of you is the
                first step.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Why the Term Matters for Government Work
              </h3>
              <p>
                If you are bidding for or managing a public project, registration usually
                matters a great deal. Tender documents typically specify which categories
                of contractors may apply, the value limits and the documents required.
                Rules, categories and eligibility are set by the relevant department and
                can change, so always read the current tender documents.
              </p>
              <p className="mt-3">
                For public works, owners and officials should check the
                contractor&apos;s registration directly with the issuing department, not
                rely on a copy handed over in a meeting.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Why the Term Matters Less for Private Buildings
              </h3>
              <p className="mb-3">
                If you are building a house, shop or office on your own plot,
                &quot;government approved&quot; is usually not a requirement to hire a
                contractor. What protects you is different.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  A sanctioned building plan, where required, for your project
                </li>
                <li>
                  Approved drawings, including structural drawings by a qualified
                  structural engineer
                </li>
                <li>
                  A clear written agreement with scope, payment stages and handling of
                  changes
                </li>
                <li>Supervision and quality checks at key stages</li>
                <li>
                  A contractor who is open about credentials, references and completed
                  work
                </li>
              </ul>
              <p className="mt-3">
                Registration with a department tells you little about how a contractor
                will build your home. Proof of completed work, supervision and clear terms
                tell you far more.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                How to Verify a Contractor&apos;s Claim
              </h3>
              <p className="mb-3">
                Whoever you hire, verify before you pay.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Ask exactly what the approval is: which department or body, what
                  category and what it allows
                </li>
                <li>Ask for the registration number and validity date</li>
                <li>
                  Check with the issuing authority, through its official channel, not only
                  through a copy of the certificate
                </li>
                <li>
                  Check that the name on the registration matches the company you are
                  signing with
                </li>
                <li>
                  Ask for other credentials, such as business and tax registrations, where
                  relevant
                </li>
                <li>Ask for references and completed projects you can see</li>
                <li>
                  Write the claims into your agreement, if they matter to you
                </li>
              </ul>
              <p className="mt-3">
                A genuine contractor will not mind these questions, and will usually share
                documents readily.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Warning Signs to Watch For
              </h3>
              <p className="mb-3">
                Be careful with a contractor who:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Uses &quot;government approved&quot; without saying what it means
                </li>
                <li>Cannot provide a registration number or name the issuing body</li>
                <li>
                  Shows a certificate that is expired or issued to a different name
                </li>
                <li>Claims special influence with officials</li>
                <li>Promises that your building plan will be sanctioned</li>
                <li>Quotes without visiting the site</li>
                <li>Demands a large advance before work</li>
                <li>Avoids showing completed projects or references</li>
                <li>Refuses to put terms in writing</li>
              </ul>
              <p className="mt-3">
                A contractor who is vague about credentials before you sign rarely becomes
                clearer afterwards.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                What MTBOSS Shares
              </h3>
              <p>
                We believe credentials should be shown, not just claimed. On request,
                MTBOSS shares verified details about our business and the professionals
                working on your project. We do not use the phrase &quot;government
                approved&quot; unless it is backed by verifiable registration, and we do
                not claim relationships with officials.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Construction Services at MTBOSS
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Houses, duplexes and bungalows</li>
                <li>Shops, showrooms and offices</li>
                <li>Multi-storey and mixed-use buildings</li>
                <li>Extensions and added floors, after structural assessment</li>
                <li>Renovation and repair of existing buildings</li>
                <li>
                  Waterproofing for terraces, washrooms, balconies and walls
                </li>
                <li>Boundary walls, gates and external works</li>
                <li>
                  Finishing trades: plumbing, electrical, tiles, carpentry, ceilings,
                  painting, wallpaper and modular kitchens
                </li>
              </ul>
              <p className="mt-3">
                Each project is quoted after a site visit, because plots, designs and
                conditions differ.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Approvals That Matter for Your Building
              </h3>
              <p className="mb-3">
                For private construction, the approvals that matter most relate to the
                building itself.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Building plan sanction from the local development authority, where
                  required
                </li>
                <li>
                  Compliance with applicable rules on setbacks, height, coverage and use
                </li>
                <li>
                  Fire and other clearances, depending on the building type and size
                </li>
                <li>Utility connections arranged properly</li>
              </ul>
              <p className="mt-3">
                Rules on permissions vary by area, building type and authority, and they
                change over time. Please confirm requirements with the local development
                authority before construction, and build according to the sanctioned plan.
                Building differently from the approved plan can cause problems at
                completion and resale.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Drawings and Structural Responsibility
              </h3>
              <p className="mb-3">
                A building should be built from drawings, not verbal instructions.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Architectural drawings define layout, openings and finishes</li>
                <li>
                  Structural drawings, prepared by a qualified structural engineer, define
                  foundations, columns, beams and slabs
                </li>
                <li>Service layouts guide plumbing and electrical work</li>
              </ul>
              <p className="mt-3">
                Structural design and stability certification belong to a qualified
                structural engineer. MTBOSS coordinates with a qualified structural
                professional and builds according to the drawings. If the site differs
                from a drawing, we raise it before changing anything.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Written Scope and Honest Pricing
              </h3>
              <p className="mb-3">
                Clarity before work prevents argument during it.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Site visit before quotation</li>
                <li>Written scope with inclusions and exclusions</li>
                <li>Drawings and specifications the scope is based on</li>
                <li>Materials and quality levels</li>
                <li>Payment stages linked to completed work</li>
                <li>Handling of changes discussed and agreed in writing</li>
              </ul>
              <p className="mt-3">Cost depends on:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Plot size and built-up area</li>
                <li>Number of floors</li>
                <li>Design and structural complexity</li>
                <li>Level of finishing and fittings</li>
                <li>Site access and ground conditions</li>
              </ul>
              <p className="mt-3">
                You can try the Budget Calculator on the MTBOSS website for a starting
                idea. Final pricing follows the site visit and scope discussion.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Supervision and Quality Checks
              </h3>
              <p className="mb-3">
                Many poor buildings result from missing supervision, not bad paperwork.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>A named point of contact for you</li>
                <li>
                  Checks at key stages, such as before concreting, plastering and tiling
                </li>
                <li>Attention to levels, alignment and curing</li>
                <li>Waterproofing tested before tiles</li>
                <li>Pipes and conduits tested before they are covered</li>
                <li>Final inspection of finished work</li>
              </ul>
              <p className="mt-3">
                Our checks are advisory records of what we observe, and they do not
                replace the responsibilities of your structural engineer or the authority.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Materials and Waterproofing
              </h3>
              <p className="mb-3">
                Quality shows in materials and in how water is handled.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Cement, steel, sand and aggregate from reliable sources</li>
                <li>Bricks or blocks suited to the building and budget</li>
                <li>
                  Terrace and roof with correct slope, outlets and suitable treatment
                </li>
                <li>
                  Washrooms and kitchens waterproofed and tested before tiling
                </li>
                <li>Balconies sloped and drained</li>
                <li>Protected storage on site, especially in the monsoon</li>
              </ul>
              <p className="mt-3">
                MTBOSS offers waterproofing as part of construction and renovation, so
                protection is built in from the start.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Coordination of Trades
              </h3>
              <p>
                A building needs many trades in the right order. MTBOSS offers building
                repair and renovation, waterproofing, plumber, electrician, tile and
                marble, carpenter, door and window install, false ceiling, PVC
                panel-louvers, painter, wallpaper installation, modular kitchen and pest
                control, so these trades follow one plan and one point of responsibility.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Safety on Site
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Safe scaffolding, edge protection and excavation support
                </li>
                <li>Careful handling of materials and equipment</li>
                <li>Electrical safety for temporary connections</li>
                <li>Protection of neighbours and passers-by</li>
                <li>A clean, organised site with regular debris removal</li>
              </ul>
              <p className="mt-3">
                Applicable legal and safety requirements for labour and construction
                should be followed, and they can change over time.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Local Conditions in Bareilly
              </h3>
              <p className="mb-3">
                Bareilly has hot summers, humid monsoon months and cool winters, and
                construction should respond.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Careful curing of concrete in hot weather</li>
                <li>
                  Scheduling that avoids rain damage and protects materials
                </li>
                <li>Drainage planning so water leaves the plot</li>
                <li>Roof treatment to reduce heat and prevent leakage</li>
                <li>Materials suited to heat, rain and humidity</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Agreement and Payments
              </h3>
              <p className="mb-3">
                A written agreement protects both sides. It should state:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>The scope of work and the drawings it is based on</li>
                <li>Materials and quality levels</li>
                <li>The order of work and general schedule</li>
                <li>Payment stages linked to completed work</li>
                <li>How changes and extra work are handled</li>
                <li>Responsibility for cleaning and debris removal</li>
                <li>Contact points for communication</li>
              </ul>
              <p className="mt-3">
                Be careful with any contractor who avoids writing things down or asks for
                a large advance before work begins.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                The MTBOSS Process
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Enquiry.</strong> Call or WhatsApp us with your location,
                  project type and a short description. Photos help.
                </li>
                <li>
                  <strong>Credentials and references.</strong> On request, we share
                  verified details and what references are available.
                </li>
                <li>
                  <strong>Site visit.</strong> We visit, measure and discuss your needs.
                </li>
                <li>
                  <strong>Scope and quotation.</strong> You receive a written scope. Work
                  begins only after you approve.
                </li>
                <li>
                  <strong>Construction and supervision.</strong> Work is supervised, with
                  updates at key stages.
                </li>
                <li>
                  <strong>Finishing and handover.</strong> Work is inspected and handed
                  over with records and care guidance.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Service Areas in Bareilly
              </h3>
              <p>
                MTBOSS serves clients in Bareilly, including areas such as Civil Lines,
                Rampur Garden, Izzatnagar, Subhash Nagar, DD Puram and Pilibhit Bypass
                Road. Our office is at Harthala Kanth Road, Moradabad. If your site is
                elsewhere in or around Bareilly, contact us and we will confirm
                availability.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Contact MTBOSS
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
                    href="mailto:mtboss2016@gmail.com"
                    className="text-blue-600 underline"
                  >
                    mtboss2016@gmail.com
                  </a>
                </li>
                <li>
                  <strong>Office:</strong> Harthala Kanth Road, behind KR Collection,
                  near Domino&apos;s, Moradabad, Uttar Pradesh
                </li>
              </ul>
              <p className="mt-3">
                Visit the{" "}
                <a
                  href="https://www.mtboss.in/"
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  MTBOSS website
                </a>{" "}
                to try the Budget Calculator and view our Portfolio.
              </p>
              <p className="mt-3">
                Ask for credentials, check them at the source and judge by completed work.
                Contact MTBOSS today for building services in Bareilly.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Frequently Asked Questions
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>
                    Q1. Is MTBOSS a government approved contractor in Bareilly?
                  </strong>
                  <br />
                  Please ask us for current registration details. We share only verified
                  information.
                </li>
                <li>
                  <strong>Q2. What does government approved contractor mean?</strong>
                  <br />
                  It usually means registration with a department or body, with category
                  and limits set by them.
                </li>
                <li>
                  <strong>Q3. Do I need a government approved contractor for my house?</strong>
                  <br />
                  Usually not. For private buildings, sanctioned plans, drawings and clear
                  agreements matter more.
                </li>
                <li>
                  <strong>Q4. How can I verify a contractor&apos;s registration?</strong>
                  <br />
                  Ask for the number, issuing body and validity, then check with the
                  issuing authority.
                </li>
                <li>
                  <strong>
                    Q5. Can a contractor guarantee my plan will be sanctioned?
                  </strong>
                  <br />
                  No. Sanction is decided by the authority. Be careful with anyone who
                  promises it.
                </li>
                <li>
                  <strong>Q6. Does MTBOSS provide structural design?</strong>
                  <br />
                  We coordinate with a qualified structural professional, who provides
                  structural certification.
                </li>
                <li>
                  <strong>Q7. Do you visit the site before quoting?</strong>
                  <br />
                  Yes. We visit, measure and share a written scope and quotation.
                </li>
                <li>
                  <strong>Q8. Do you build from approved drawings?</strong>
                  <br />
                  Yes. Any site difference is raised before work is changed.
                </li>
                <li>
                  <strong>Q9. How much does a building contractor charge in Bareilly?</strong>
                  <br />
                  It depends on size, design, finishing and site conditions. Final pricing
                  follows the site visit.
                </li>
                <li>
                  <strong>Q10. How do I contact MTBOSS?</strong>
                  <br />
                  Call or WhatsApp +91 94584 10866, or use the contact form on{" "}
                  <a
                    href="https://www.mtboss.in/"
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    mtboss.in
                  </a>
                  .
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