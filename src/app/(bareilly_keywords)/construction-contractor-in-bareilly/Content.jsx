import React from "react";
import LandingEnquiry from "../../components/LandingEnquiry";

const Content = () => {
  return (
    <div className="min-h-screen bg-white pt-0">
      <div className="flex flex-col lg:flex-row">
        {/* Content Section */}
        <div className="flex-1 px-4 sm:px-8 md:px-16 py-12 order-1 lg:order-1">
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-8 text-gray-900">
            Construction Contractor in Bareilly: One Service, Different Needs for
            Every Kind of Owner
          </h2>

          <div className="space-y-6 text-gray-700 leading-relaxed max-w-4xl">
            <section>
              <p>
                A homeowner, a shop owner, a clinic operator and a landlord may
                all hire a contractor, but they are not buying the same thing.
                The homeowner wants comfort and durability, the shop owner wants
                speed and frontage, the institution wants safety and crowd flow,
                and the investor wants efficient floors that earn.
              </p>
              <p className="mt-3">
                MTBOSS is an architect, interior design and construction company
                serving Moradabad and Bareilly, known for quality work,
                transparent pricing and on-time delivery. This page explains how
                contracting differs by owner type, and how MTBOSS manages
                projects for each.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Construction Contracting Services at MTBOSS
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
                  Finishing trades: plumbing, electrical, tiles, carpentry,
                  ceilings, painting, wallpaper and modular kitchens
                </li>
              </ul>
              <p className="mt-3">
                Each project is quoted after a site visit, because plots, designs
                and conditions differ.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Project Size and Contractor Role
              </h3>
              <p className="mb-3">
                The contractor&apos;s role changes with the size of the job.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Small works.</strong> Repairs, partitions, boundary
                  sections and minor additions. A quick site assessment and a
                  simple written scope are usually enough.
                </li>
                <li>
                  <strong>Medium projects.</strong> Houses, shops and small
                  offices, where drawings, supervision and trade coordination
                  matter.
                </li>
                <li>
                  <strong>Larger projects.</strong> Multi-storey and commercial
                  buildings, where structure, safety, staging and services are
                  more complex.
                </li>
              </ul>
              <p className="mt-3">
                We adjust our approach to the size of the job, while keeping the
                same principles of written scope, supervision and open
                communication.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Homeowners
              </h3>
              <p className="mb-3">
                For a family building or renovating a home, the priorities are
                comfort, durability and clarity.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Layout that fits daily routines, from drawings the family has
                  reviewed
                </li>
                <li>
                  Strong basics: foundation, staircase, terrace drainage and
                  washroom waterproofing
                </li>
                <li>
                  Finishes chosen with care, since families live with them for
                  years
                </li>
                <li>
                  Patience with decisions, with reminders of decision dates so
                  work is not delayed
                </li>
                <li>
                  Simple communication by phone or WhatsApp, with photos
                </li>
              </ul>
              <p className="mt-3">
                We explain what is happening in plain language, so owners who are
                not technical still feel in control.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Shop and Office Owners
              </h3>
              <p className="mb-3">
                For businesses, time and customers matter as much as quality.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Frontage and entrance built to the design, since they bring in
                  customers
                </li>
                <li>Durable floors and finishes for heavy use</li>
                <li>
                  Provision for cooling, cabling and water before ceilings and
                  walls are closed
                </li>
                <li>Minimal disruption to neighbouring businesses</li>
                <li>
                  Realistic opening dates, with decisions made early so fit-out
                  is not held up
                </li>
              </ul>
              <p className="mt-3">
                Planning the sequence around your opening date is part of the
                service, though we do not promise timelines without seeing the
                site and scope.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Schools, Clinics and Institutional Owners
              </h3>
              <p className="mb-3">
                Institutional buildings carry added responsibility for the people
                who use them.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Safe circulation, with staircases, exits and corridors planned
                  for crowds
                </li>
                <li>
                  Hygiene and easy-clean finishes, especially in washrooms and
                  treatment or teaching areas
                </li>
                <li>
                  Reliable services, including power backup and water supply
                </li>
                <li>
                  Accessibility through ramps, wide doors and accessible
                  washrooms
                </li>
                <li>
                  Coordination with specialists for fire safety, medical or
                  laboratory requirements
                </li>
              </ul>
              <p className="mt-3">
                Specific safety and registration requirements depend on the type
                of institution and authority, so they should be confirmed with
                the relevant bodies. MTBOSS coordinates the building work around
                them.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Landlords and Investors
              </h3>
              <p className="mb-3">
                For rental or investment buildings, floor efficiency and running
                cost drive value.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Regular column grids and compact cores that keep floors usable
                </li>
                <li>Repeatable unit layouts that speed up construction</li>
                <li>
                  Stacked washrooms and kitchens that shorten plumbing runs
                </li>
                <li>Durable finishes that cut maintenance</li>
                <li>Parking and access that tenants expect</li>
                <li>
                  Phasing options so part of the building can start earning
                  earlier
                </li>
              </ul>
              <p className="mt-3">
                Good design and construction choices at the start tend to matter
                more to long-term returns than decoration.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Godowns and Light Industrial Buildings
              </h3>
              <p className="mb-3">
                Storage and workshop buildings need function above appearance.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Clear spans and strong floors for stacking and equipment
                </li>
                <li>Loading access for trucks and vans</li>
                <li>Drainage and waterproofing to protect stock</li>
                <li>Ventilation and light</li>
                <li>
                  Provision for pest control, since pests damage stored goods
                </li>
              </ul>
              <p className="mt-3">
                Heavy loads and special equipment need design input from a
                qualified structural professional.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Choosing the Contracting Model
              </h3>
              <p className="mb-3">
                Owners usually pick one of a few arrangements.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Structure-only.</strong> The contractor builds the
                  frame, walls, plaster and basic services, and the owner
                  arranges finishing separately.
                </li>
                <li>
                  <strong>Turnkey.</strong> The contractor delivers a building
                  ready for use, including finishing.
                </li>
                <li>
                  <strong>Staged.</strong> Structure first, with finishing added
                  later under the same contractor.
                </li>
                <li>
                  <strong>
                    Item-rate, lump-sum or material-inclusive pricing.
                  </strong>{" "}
                  Different ways to price the same work, each with its own
                  strengths and risks.
                </li>
              </ul>
              <p className="mt-3">
                We explain how each would work on your project before you decide,
                and we put the chosen model in writing.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Drawings, Structure and Approvals
              </h3>
              <p className="mb-3">
                A building should be built from drawings, not verbal
                instructions.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Architectural drawings define layout, openings and finishes
                </li>
                <li>
                  Structural drawings, prepared by a qualified structural
                  engineer, define foundations, columns, beams and slabs
                </li>
                <li>Service layouts guide plumbing and electrical work</li>
                <li>
                  A sanctioned building plan, where required, protects the owner
                </li>
              </ul>
              <p className="mt-3">
                Structural design and stability certification belong to a
                qualified structural engineer. MTBOSS coordinates with a
                qualified structural professional and builds according to the
                drawings. If the site differs from a drawing, we raise it before
                changing anything. Rules on permissions vary by area and
                authority and change over time, so confirm them with the local
                development authority before work starts.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Site Visit and Written Scope
              </h3>
              <p className="mb-3">Our process starts on site.</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Visit the plot or building and note access, levels, neighbours
                  and conditions
                </li>
                <li>Review drawings or discuss your plan</li>
                <li>Prepare a written scope with inclusions and exclusions</li>
                <li>Explain materials and quality levels</li>
                <li>
                  Share a quotation with clear stages and assumptions
                </li>
                <li>
                  Discuss unknowns, such as soil or hidden defects, and how they
                  would be handled
                </li>
              </ul>
              <p className="mt-3">
                Work begins only after you approve the scope and quotation.
              </p>
              <p className="mt-3">Cost depends on:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Plot size and built-up area</li>
                <li>Number of floors</li>
                <li>Design and structural complexity</li>
                <li>Level of finishing and fittings</li>
                <li>Site access and ground conditions</li>
              </ul>
              <p className="mt-3">
                You can try the Budget Calculator on the MTBOSS website for a
                starting idea. Final pricing follows the site visit and scope
                discussion.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Project Control
              </h3>
              <p className="mb-3">
                A project stays on track when someone is clearly responsible.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>A named point of contact for you</li>
                <li>
                  A work sequence from foundation to finishing, with weather
                  allowances
                </li>
                <li>Daily direction of workers and a clear work plan</li>
                <li>
                  Checks at key stages, such as before concreting, plastering and
                  tiling
                </li>
                <li>Attention to levels, alignment and curing</li>
                <li>Prompt reporting of problems and delays</li>
                <li>
                  Regular updates by phone or WhatsApp, with dated photos where
                  useful
                </li>
              </ul>
              <p className="mt-3">
                Our checks are advisory records of what we observe, and they do
                not replace the responsibilities of your structural engineer or
                the authority.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Materials and Workmanship
              </h3>
              <p className="mb-3">
                Quality shows in what goes into the building and how it is
                handled.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Cement, steel, sand and aggregate from reliable sources</li>
                <li>Bricks or blocks suited to the building and budget</li>
                <li>Pipes, wires and fittings that are hard to replace later</li>
                <li>Protected storage on site, especially in the monsoon</li>
                <li>Neat masonry, plaster and finishing</li>
              </ul>
              <p className="mt-3">
                We explain material choices and the reasoning behind them, so you
                can decide where to spend and where to save.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Waterproofing and Drainage
              </h3>
              <p className="mb-3">
                Leaks are the most common long-term complaint, so they are
                planned early.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Terrace and roof with correct slope and outlets</li>
                <li>
                  Washrooms and kitchens waterproofed and tested before tiling
                </li>
                <li>Balconies sloped and drained</li>
                <li>External walls protected where required</li>
                <li>
                  Rainwater and wastewater drainage around the building
                </li>
              </ul>
              <p className="mt-3">
                MTBOSS offers waterproofing as part of construction and
                renovation, so protection is built in from the start.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Coordination of Trades
              </h3>
              <p>
                A building needs civil work, plumbing, electrical, tiles,
                carpentry, ceilings and painting in the right order. MTBOSS
                offers building repair and renovation, waterproofing, plumber,
                electrician, tile and marble, carpenter, door and window install,
                false ceiling, PVC panel-louvers, painter, wallpaper
                installation, modular kitchen and pest control, so these trades
                follow one plan and one point of responsibility.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Handling Changes and Payments
              </h3>
              <p className="mb-3">
                Few projects run exactly to plan, so terms should be clear from
                the start.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Describe any change and the reason for it</li>
                <li>Check its effect on cost, schedule and other work</li>
                <li>Agree in writing before the work is done</li>
                <li>Link payment stages to completed work</li>
                <li>
                  Check each stage before releasing the related payment
                </li>
              </ul>
              <p className="mt-3">
                Be careful with any contractor who avoids writing things down or
                asks for a large advance before work begins.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Safety on Site
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Safe scaffolding, edge protection and excavation support</li>
                <li>Careful handling of materials and equipment</li>
                <li>Electrical safety for temporary connections</li>
                <li>Protection of neighbours and passers-by</li>
                <li>A clean, organised site with regular debris removal</li>
              </ul>
              <p className="mt-3">
                Applicable legal and safety requirements for labour and
                construction should be followed, and they can change over time.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Local Conditions in Bareilly
              </h3>
              <p className="mb-3">
                Bareilly has hot summers, humid monsoon months and cool winters,
                and construction should respond.
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
                Renovation and Extension
              </h3>
              <p className="mb-3">
                Existing buildings need inspection before action.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Record cracks, dampness, wiring and visible defects
                </li>
                <li>Find causes before choosing repairs</li>
                <li>Repair structure and water problems before finishing</li>
                <li>
                  Phase work where part of the building stays in use
                </li>
                <li>
                  Involve a qualified structural professional before removing
                  walls or adding floors
                </li>
              </ul>
              <p className="mt-3">
                We do not issue structural safety certificates. If a crack is
                wide, growing or in a beam, column or slab, or if you notice
                sagging, a qualified structural engineer should assess the
                building.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Handover and Records
              </h3>
              <p className="mb-3">
                A project is complete when you can use the building comfortably
                and understand it.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Final inspection of all work with you</li>
                <li>
                  Final drawings, including changes made during construction
                </li>
                <li>Photos of concealed work, such as steel and pipes</li>
                <li>Details of waterproofing treatments</li>
                <li>
                  Care and maintenance guidance for finishes, terraces and
                  washrooms
                </li>
                <li>Follow-up for issues you notice after moving in</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Proof of Completed Work
              </h3>
              <p>
                Our Portfolio page shows examples of MTBOSS work, and we
                encourage you to ask any contractor for the same.
              </p>
              <p className="mt-3">
                <strong>Owner note:</strong> Add verified details below before
                publishing, or remove this block.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Completed projects: [Number and types, with locations]</li>
                <li>Years of operation: [Years]</li>
                <li>Client references on request: [Yes or No]</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                The MTBOSS Process
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Enquiry.</strong> Call or WhatsApp us with your
                  location, project type and a short description. Photos help.
                </li>
                <li>
                  <strong>Site visit.</strong> We visit, measure and discuss your
                  needs.
                </li>
                <li>
                  <strong>Scope and quotation.</strong> You receive a written
                  scope. Work begins only after you approve.
                </li>
                <li>
                  <strong>Planning.</strong> We finalise sequence, materials and
                  labour.
                </li>
                <li>
                  <strong>Construction and supervision.</strong> Work is
                  supervised, with updates at key stages.
                </li>
                <li>
                  <strong>Finishing and handover.</strong> Work is inspected and
                  handed over with records and care guidance.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Service Areas in Bareilly
              </h3>
              <p>
                MTBOSS serves clients in Bareilly, including areas such as Civil
                Lines, Rampur Garden, Izzatnagar, Subhash Nagar, DD Puram and
                Pilibhit Bypass Road. Our office is at Harthala Kanth Road,
                Moradabad. If your site is elsewhere in or around Bareilly,
                contact us and we will confirm availability.
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
                  <strong>Office:</strong> Harthala Kanth Road, behind KR
                  Collection, near Domino&apos;s, Moradabad, Uttar Pradesh
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
                or the{" "}
                <a
                  href="https://www.mtboss.in/contact"
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact page
                </a>{" "}
                to try the Budget Calculator and view our Portfolio.
              </p>
              <p className="mt-3">
                Tell us who the building is for and we will plan around it.
                Contact MTBOSS today for construction contracting in Bareilly.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Frequently Asked Questions
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>
                    Q1. Does MTBOSS work as a construction contractor in
                    Bareilly?
                  </strong>
                  <br />
                  Yes. We serve Bareilly and Moradabad with construction,
                  renovation and finishing work.
                </li>
                <li>
                  <strong>
                    Q2. Which owners and projects do you serve?
                  </strong>
                  <br />
                  Homeowners, shop and office owners, institutions, landlords and
                  investors, across houses, shops, offices and multi-storey
                  buildings.
                </li>
                <li>
                  <strong>
                    Q3. Do you handle both construction and finishing?
                  </strong>
                  <br />
                  Yes. We offer civil work, plumbing, electrical, tiles,
                  carpentry, ceilings, painting and kitchens.
                </li>
                <li>
                  <strong>Q4. Do you visit the site before quoting?</strong>
                  <br />
                  Yes. We visit, measure and share a written scope and quotation.
                </li>
                <li>
                  <strong>Q5. Do you build from approved drawings?</strong>
                  <br />
                  Yes. Any site difference is raised before work is changed.
                </li>
                <li>
                  <strong>Q6. Does MTBOSS provide structural design?</strong>
                  <br />
                  We coordinate with a qualified structural professional, who
                  provides structural certification.
                </li>
                <li>
                  <strong>
                    Q7. Can you build godowns or industrial sheds?
                  </strong>
                  <br />
                  Please contact us with your requirements. We confirm what we
                  can take on after discussing the project.
                </li>
                <li>
                  <strong>
                    Q8. How are changes and payments handled?
                  </strong>
                  <br />
                  Changes are agreed in writing first, and payment stages are
                  linked to completed work.
                </li>
                <li>
                  <strong>
                    Q9. How much does a construction contractor charge in
                    Bareilly?
                  </strong>
                  <br />
                  It depends on size, design, finishing and site conditions.
                  Final pricing follows the site visit.
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