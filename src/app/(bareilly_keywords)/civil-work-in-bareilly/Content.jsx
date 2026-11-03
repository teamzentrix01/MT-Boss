import React from "react";
import LandingEnquiry from "../../components/LandingEnquiry";

const Content = () => {
  return (
    <div className="min-h-screen bg-white pt-0">
      <div className="flex flex-col lg:flex-row">
        {/* Content Section */}
        <div className="flex-1 px-4 sm:px-8 md:px-16 py-12 order-1 lg:order-1">
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-8 text-gray-900">
            Civil Work in Bareilly: Planning Calendar, Stage Checklist and
            Owner&apos;s Guide by MTBOSS
          </h2>

          <div className="space-y-6 text-gray-700 leading-relaxed max-w-4xl">
            <section>
              <p>
                Good civil work is rarely the result of luck. It comes from decisions
                made in the right order: drawings before digging, waterproofing before
                tiles, payments tied to completed stages and weather planned around the
                monsoon. Owners who understand this sequence ask better questions, spot
                problems earlier and spend less on repairs. This guide to civil work in
                Bareilly is written for the person who owns the plot or building, so
                you know what to plan, what to check and what to keep in writing.
              </p>
              <p className="mt-3">
                MTBOSS is an architect, interior design and construction company
                serving Moradabad and Bareilly, known for quality work, transparent
                pricing and on-time delivery. We handle civil work for homes, shops and
                offices, with finishing trades available under the same company.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Civil Work Services at MTBOSS
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  New construction of houses, duplexes, shops, offices and small
                  commercial buildings
                </li>
                <li>Repair and renovation of old buildings</li>
                <li>Extensions and added floors, after structural assessment</li>
                <li>
                  Waterproofing for terraces, washrooms, balconies and walls
                </li>
                <li>Boundary walls, gates and external works</li>
                <li>
                  Finishing coordination with plumbing, electrical, tiles, carpentry,
                  ceilings and painting
                </li>
              </ul>
              <p className="mt-3">
                Each project is quoted after a site visit, because plots, designs and
                conditions differ.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Planning Before Any Work Starts
              </h3>
              <p className="mb-3">
                The most valuable civil work decisions happen before a single worker
                arrives.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Define the purpose: self-use, rent, business or resale</li>
                <li>Fix the budget range and keep a reserve for unknowns</li>
                <li>Prepare or review drawings: architectural and structural</li>
                <li>
                  Confirm approvals with the local development authority where required
                </li>
                <li>
                  Decide the contract type and how work will be measured and paid
                </li>
                <li>Plan access and storage for materials on site</li>
                <li>
                  Decide who will take decisions for the family or business
                </li>
              </ul>
              <p className="mt-3">
                Drawings and approvals come first. Starting with a verbal plan is the
                most common source of later disputes.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Seasonal Calendar for Bareilly
              </h3>
              <p className="mb-3">
                Bareilly has hot summers, humid monsoon months and cool winters, and
                each season suits some civil work better than others.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Winter and early spring.</strong> Comfortable working
                  conditions, good for foundations, concreting and masonry, with
                  careful attention to cold-morning curing where needed.
                </li>
                <li>
                  <strong>Summer.</strong> Longer working days, but concrete and plaster
                  dry quickly, so curing must be managed carefully.
                </li>
                <li>
                  <strong>Monsoon.</strong> Rain disturbs excavation, concreting and
                  plastering. It is also the best time to see where water collects and
                  where terraces and walls leak, which helps plan waterproofing and
                  drainage.
                </li>
                <li>
                  <strong>Post-monsoon.</strong> A good moment for repair, waterproofing
                  and external work once surfaces have dried.
                </li>
              </ul>
              <p className="mt-3">
                The right schedule depends on your project, so we discuss timing during
                the site visit instead of applying a fixed rule.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Stage-by-Stage Checklist
              </h3>
              <p className="mb-3">
                Use this checklist to follow a typical building project.
              </p>
              <ol className="list-decimal list-inside space-y-3 ml-4">
                <li>
                  <strong>Stage 1: Site Setting-Out</strong>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                    <li>Plot boundary matches your documents</li>
                    <li>Building lines match the drawing</li>
                    <li>Reference levels fixed from road and drainage</li>
                  </ul>
                </li>
                <li>
                  <strong>Stage 2: Excavation and Foundation</strong>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                    <li>Depth and width match the structural drawing</li>
                    <li>Reinforcement placed as drawn, with proper cover</li>
                    <li>Concrete placed and compacted properly</li>
                    <li>Curing arranged</li>
                  </ul>
                </li>
                <li>
                  <strong>Stage 3: Columns, Beams and Slabs</strong>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                    <li>Shuttering strong and level</li>
                    <li>Steel checked before concreting</li>
                    <li>Concrete placed and cured as specified</li>
                    <li>Shuttering removed only after adequate strength</li>
                  </ul>
                </li>
                <li>
                  <strong>Stage 4: Masonry</strong>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                    <li>Walls plumb and level</li>
                    <li>Openings match door and window schedule</li>
                    <li>Joints well filled</li>
                  </ul>
                </li>
                <li>
                  <strong>Stage 5: Concealed Services</strong>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                    <li>Conduits and pipes placed to layout</li>
                    <li>Pipes tested before covering</li>
                  </ul>
                </li>
                <li>
                  <strong>Stage 6: Plaster and Waterproofing</strong>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                    <li>Surfaces prepared and cured</li>
                    <li>Waterproofing applied and tested before tiles</li>
                  </ul>
                </li>
                <li>
                  <strong>Stage 7: Flooring Base and External Work</strong>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                    <li>Levels and slopes correct</li>
                    <li>Drainage outlets working</li>
                    <li>Boundary wall and gate built to plan</li>
                  </ul>
                </li>
                <li>
                  <strong>Stage 8: Handover to Finishing</strong>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                    <li>Civil work inspected and signed off</li>
                    <li>Finishing trades follow in the right order</li>
                  </ul>
                </li>
              </ol>
              <p className="mt-3">
                This list is a simplified guide. The structural engineer&apos;s drawings
                and instructions decide technical details.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Budget Buckets for Civil Work
              </h3>
              <p className="mb-3">
                Thinking in buckets avoids surprises.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Structure: foundation, RCC frame, walls</li>
                <li>Surfaces: plaster, flooring base, terrace treatment</li>
                <li>Waterproofing and drainage</li>
                <li>Concealed services: plumbing and electrical rough work</li>
                <li>External work: boundary wall, gate, driveway, drainage</li>
                <li>Labour and supervision</li>
                <li>Contingency: for soil, hidden defects and changes</li>
                <li>Approvals and professional services</li>
              </ul>
              <p className="mt-3">
                Cost depends on: plot size, number of floors, structural complexity,
                materials, site access and ground conditions. You can try the Budget
                Calculator on the MTBOSS website for a starting idea. Final pricing
                follows the site visit and scope discussion.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Risks and How to Reduce Them
              </h3>
              <p className="mb-3">
                Most civil problems are predictable. Naming them early helps.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Unclear scope.</strong> Reduce it with a written scope listing
                  inclusions and exclusions.
                </li>
                <li>
                  <strong>Work without drawings.</strong> Reduce it by insisting on
                  architectural and structural drawings before digging.
                </li>
                <li>
                  <strong>Weak concrete practice.</strong> Reduce it with checks on
                  mixing, compaction and curing.
                </li>
                <li>
                  <strong>Leakage.</strong> Reduce it by planning waterproofing and
                  drainage early, and testing before tiling.
                </li>
                <li>
                  <strong>Weather delays.</strong> Reduce them by scheduling around the
                  monsoon and protecting materials.
                </li>
                <li>
                  <strong>Cost drift.</strong> Reduce it with stage-wise payments,
                  change discussions in writing and a contingency reserve.
                </li>
                <li>
                  <strong>Structural surprises in old buildings.</strong> Reduce them
                  with inspection and a qualified structural engineer&apos;s opinion
                  before changes.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Drawings, Structure and Approvals
              </h3>
              <p>
                Architectural drawings show layout, openings and levels. Structural
                drawings, prepared by a qualified structural engineer, show foundations,
                columns, beams and slabs. Structural design and stability certification
                belong to that engineer. MTBOSS coordinates with a qualified structural
                professional and builds according to the drawings. If the site differs
                from a drawing, we raise it before changing anything.
              </p>
              <p className="mt-3">
                Rules on permissions vary by area and authority and change over time, so
                confirm them with the local development authority before work starts,
                and build according to the sanctioned plan.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Contract and Payment Planning
              </h3>
              <p className="mb-3">
                Decide these points in writing before work begins.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Scope of work and the drawings it is based on</li>
                <li>
                  Contract type, such as item-rate, lump-sum or material-inclusive
                </li>
                <li>Materials and quality levels</li>
                <li>Order of work and general schedule</li>
                <li>Payment stages linked to completed work</li>
                <li>How changes and extra work are handled</li>
                <li>Responsibility for cleaning and debris removal</li>
              </ul>
              <p className="mt-3">
                Be careful with any contractor who avoids writing things down or asks
                for a large advance before work.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Materials Planning
              </h3>
              <p className="mb-3">
                Materials affect strength, durability and cost.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Cement, steel, sand and aggregate from reliable sources</li>
                <li>Bricks or blocks suited to the building and budget</li>
                <li>Pipes, conduits and fittings for concealed services</li>
                <li>Waterproofing products suited to each location</li>
                <li>Protected storage, especially in the monsoon</li>
                <li>Records of deliveries and quantities</li>
              </ul>
              <p className="mt-3">
                We explain material choices and the reasoning behind them, so you can
                decide where to spend and where to save.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Waterproofing and Drainage Planning
              </h3>
              <p className="mb-3">
                Water causes more long-term damage than almost anything else, so plan
                for it early.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Terrace and roof with correct slope and outlets</li>
                <li>
                  Washrooms and kitchens waterproofed and tested before tiling
                </li>
                <li>Balconies sloped and drained</li>
                <li>External walls protected where required</li>
                <li>Rainwater and wastewater drainage around the building</li>
              </ul>
              <p className="mt-3">
                MTBOSS offers waterproofing as part of construction and renovation, so
                protection is built in from the start.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Civil Work for Existing Buildings
              </h3>
              <p className="mb-3">
                Repair and renovation need an inspection-first approach.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Record cracks, damp patches and visible defects</li>
                <li>Find causes before choosing repairs</li>
                <li>Repair structure and water problems before finishing</li>
                <li>Phase work where part of the building stays in use</li>
                <li>
                  Involve a qualified structural professional before removing walls,
                  adding floors or changing openings
                </li>
              </ul>
              <p className="mt-3">
                We do not issue structural safety certificates. If a crack is wide,
                growing or in a beam, column or slab, or if you notice sagging, a
                qualified structural engineer should assess the building.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                What Owners Should Do During Construction
              </h3>
              <p className="mb-3">
                Your involvement helps quality.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Visit the site regularly, at agreed times</li>
                <li>Keep drawings and approvals available on site</li>
                <li>Take dated photos at each stage</li>
                <li>Ask for explanations of anything unclear</li>
                <li>Make decisions on materials and finishes on time</li>
                <li>Put important instructions and changes in writing</li>
                <li>Check each stage before releasing the related payment</li>
              </ul>
              <p className="mt-3">
                Active, courteous involvement keeps the project honest without
                disturbing the work.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Supervision and Communication
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>A single point of contact for you</li>
                <li>Checks at key stages</li>
                <li>
                  Regular updates by phone or WhatsApp, with photos where useful
                </li>
                <li>Prompt reporting of problems and delays</li>
                <li>
                  Discussion before changes that affect cost or schedule
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Safety and Site Order
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Safe scaffolding, edge protection and excavation support
                </li>
                <li>Safe handling of materials and equipment</li>
                <li>Electrical safety for temporary connections</li>
                <li>Protection of neighbours and passers-by</li>
                <li>A clean, organised site with debris removal</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Handover Documents and Records
              </h3>
              <p className="mb-3">
                At the end of civil work, keep a clean record.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Final drawings, including any changes made during construction
                </li>
                <li>Approvals and related paperwork you hold</li>
                <li>
                  Photos of concealed work, such as foundations, steel and pipes
                </li>
                <li>Details of waterproofing treatments applied</li>
                <li>
                  Contact details of the people who carried out major trades
                </li>
                <li>
                  Care and maintenance guidance for terraces, washrooms and finishes
                </li>
              </ul>
              <p className="mt-3">
                These records help with future repairs, extensions and resale.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Coordination with Finishing Trades
              </h3>
              <p>
                Civil work connects to every trade that follows. MTBOSS offers building
                repair and renovation, waterproofing, plumber, electrician, tile and
                marble, carpenter, door and window install, false ceiling, PVC
                panel-louvers, painter, wallpaper installation, modular kitchen and pest
                control, so one team can sequence them in the right order.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Proof of Completed Work
              </h3>
              <p>
                Our Portfolio page shows examples of MTBOSS work, and we encourage you
                to ask any contractor for the same.
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
                  <strong>Site visit.</strong> We visit, measure and discuss your needs.
                </li>
                <li>
                  <strong>Scope and quotation.</strong> You receive a written scope.
                  Work begins only after you approve.
                </li>
                <li>
                  <strong>Planning.</strong> We finalise sequence, materials and labour.
                </li>
                <li>
                  <strong>Construction and supervision.</strong> Work is supervised,
                  with updates at key stages.
                </li>
                <li>
                  <strong>Finishing and handover.</strong> Work is inspected and handed
                  over, with finishing trades following if you choose.
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
                Plan the sequence, keep records and build on a strong base. Contact
                MTBOSS today for civil work in Bareilly.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Frequently Asked Questions
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Q1. Does MTBOSS provide civil work in Bareilly?</strong>
                  <br />
                  Yes. We serve Bareilly and Moradabad with construction, repair,
                  extension and finishing work.
                </li>
                <li>
                  <strong>Q2. Which season is best for civil work?</strong>
                  <br />
                  It depends on the work. Winter suits many tasks, while the monsoon
                  shows where leaks and drainage problems are.
                </li>
                <li>
                  <strong>Q3. Do you work from approved drawings?</strong>
                  <br />
                  Yes. Any site difference is raised before work is changed.
                </li>
                <li>
                  <strong>Q4. Does MTBOSS provide structural design?</strong>
                  <br />
                  We coordinate with a qualified structural professional, who provides
                  structural certification.
                </li>
                <li>
                  <strong>Q5. Can you handle small repairs?</strong>
                  <br />
                  Yes. We handle cracks, seepage, plaster, floors and small extensions
                  as well as new buildings.
                </li>
                <li>
                  <strong>Q6. Can you add a floor to my house?</strong>
                  <br />
                  Only after a qualified structural professional assesses the building.
                  We then plan and build.
                </li>
                <li>
                  <strong>Q7. How are payments handled?</strong>
                  <br />
                  Payment stages are agreed in writing and linked to progress.
                </li>
                <li>
                  <strong>Q8. Do you visit the site before quoting?</strong>
                  <br />
                  Yes. We visit, measure and share a written scope and quotation.
                </li>
                <li>
                  <strong>Q9. How much does civil work cost in Bareilly?</strong>
                  <br />
                  It depends on size, structure, materials and site conditions. Final
                  pricing follows the site visit.
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