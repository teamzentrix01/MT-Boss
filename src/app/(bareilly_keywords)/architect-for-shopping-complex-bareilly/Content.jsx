import React from "react";
import LandingEnquiry from "../../components/LandingEnquiry";

const Content = () => {
  return (
    <div className="min-h-screen bg-white pt-0">
      <div className="flex flex-col lg:flex-row">
        {/* Content Section */}
        <div className="flex-1 px-4 sm:px-8 md:px-16 py-12 order-1 lg:order-1">
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-8 text-gray-900">
            Architect for Shopping Complex Bareilly: MTBoss
          </h2>

          <div className="space-y-6 text-gray-700 leading-relaxed max-w-4xl">
            <section>
              <p>
                An architect for a shopping complex in Bareilly plans the units,
                frontage, circulation, parking and services so that shops lease or
                sell well and the building earns for decades. MTBoss Construction
                Private Limited serves Bareilly and Moradabad with commercial design
                and construction under one team.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                A Shopping Complex Is an Income Asset
              </h3>
              <p>
                A shopping complex is judged by its rent roll, vacancy and resale
                value, not by its looks alone. Tenants rent where customers walk, so
                design decisions such as frontage, parking and corridor width show up
                directly in income.
              </p>
              <p className="mt-3">
                Good design lets every unit be seen, reached and served. MTBoss
                Construction Private Limited builds, renovates and repairs homes,
                shops and commercial properties across Moradabad and Bareilly.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Complex Types by Scale
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Strip or row of shops:</strong> A single frontage along a
                  road, with shops of similar size
                </li>
                <li>
                  <strong>Neighbourhood complex:</strong> Ground-plus-two, serving a
                  colony with groceries, clinics and services
                </li>
                <li>
                  <strong>Community complex:</strong> A larger block with an anchor
                  tenant, such as a supermarket, plus shops and offices above
                </li>
                <li>
                  <strong>Multi-storey mall or market:</strong> Several retail
                  floors, lifts or escalators and basement parking
                </li>
                <li>
                  <strong>Mixed-use complex:</strong> Shops below, offices, coaching
                  centres or residences above
                </li>
              </ul>
              <p className="mt-3">
                <span className="text-gray-500">
                  [Keep only the types MTBoss actually designs.]
                </span>{" "}
                Scale decides the structure, services and approvals, so settle it
                first.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Reading the Market and the Plot
              </h3>
              <p className="mb-3">
                Before drawing, study where customers come from and how they reach
                you{" "}
                <span className="text-gray-500">
                  [confirm each with the authority and local market advisers]
                </span>
                .
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Catchment:</strong> Nearby homes, offices, colleges,
                  hospitals and passing traffic
                </li>
                <li>
                  Competing complexes and what they lack, such as parking or lifts
                </li>
                <li>
                  <strong>Road width, type and speed:</strong> Busy roads give
                  exposure but make entry harder
                </li>
                <li>
                  <strong>Frontage length:</strong> More frontage means more prime
                  shops
                </li>
                <li>
                  <strong>Land use and permitted activity,</strong> including
                  commercial use and mixed use
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Unit Mix and Sizes
              </h3>
              <p className="mb-3">
                The right mix lets you lease quickly and keep rent steady{" "}
                <span className="text-gray-500">
                  [state how MTBoss helps owners decide the mix]
                </span>
                .
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Small shops:</strong> Compact units for mobiles, general
                  stores and services
                </li>
                <li>
                  <strong>Medium shops:</strong> The flexible core, easy to combine
                  or split
                </li>
                <li>
                  <strong>Large units or anchors:</strong> Supermarkets, showrooms
                  and banks that draw footfall for the rest
                </li>
                <li>
                  <strong>Food and café units:</strong> With exhaust, grease and
                  water provisions
                </li>
                <li>
                  <strong>Upper-floor offices, clinics and coaching centres:</strong>{" "}
                  Steady income with different access needs
                </li>
                <li>
                  Kiosks and pop-up spaces in corridors, if the layout allows
                </li>
              </ul>
              <p className="mt-3">
                Design units on a repeating grid, so walls can move and units can
                merge or split as tenants change.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Frontage and Visibility for Every Unit
              </h3>
              <p className="mb-3">
                Every tenant wants to be seen.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Equal, generous frontage per unit, with consistent shop heights
                </li>
                <li>
                  Good sightlines from the road and the parking
                </li>
                <li>
                  Corner units with double frontage, which command higher rent
                </li>
                <li>
                  Display glazing sized for brand signage
                </li>
                <li>
                  Canopy or arcade for sun and rain, keeping window displays visible
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Circulation: Corridors, Stairs and Lifts
              </h3>
              <p className="mb-3">
                Customers climb only as high as the design invites them.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Wide, well-lit corridors that give shoppers room to browse
                </li>
                <li>
                  Staircases and lifts placed so upper floors feel easy to reach
                </li>
                <li>
                  Escalators in larger complexes, where footfall and budget justify
                  them{" "}
                  <span className="text-gray-500">[confirm if offered]</span>
                </li>
                <li>
                  Atriums and voids that draw sight lines upward
                </li>
                <li>
                  Service lifts and back corridors separate from customer routes
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Parking Planning
              </h3>
              <p className="mb-3">
                Parking is the most common reason a complex struggles. Requirements
                come from the local authority and usually relate to built-up area and
                use{" "}
                <span className="text-gray-500">
                  [confirm the parking norm for your plot and zone]
                </span>
                .
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Basement parking:</strong> Protects frontage and adds
                  capacity, with ramps, ventilation and lighting
                </li>
                <li>
                  <strong>Stilt parking:</strong> Parking under the building, a
                  common option on smaller plots
                </li>
                <li>
                  <strong>Surface parking:</strong> Easy access, but it uses valuable
                  frontage
                </li>
                <li>
                  Two-wheeler zones, separate from car bays
                </li>
                <li>
                  Delivery and loading bay, away from customer entries
                </li>
                <li>
                  Pedestrian routes from parking to shops, safe and lit
                </li>
                <li>
                  Entry and exit lanes wide enough to avoid road queues
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Basement and Structure
              </h3>
              <p className="mb-3">
                Larger complexes often need a basement and a long-span frame{" "}
                <span className="text-gray-500">
                  [structural design must come from a qualified structural engineer;
                  confirm MTBoss&apos;s in-house or partner arrangement]
                </span>
                .
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Soil investigation to guide foundations and basement depth
                </li>
                <li>
                  Column grids that suit both parking and shop layouts
                </li>
                <li>
                  Slab depths and spans for heavy loads and services
                </li>
                <li>
                  Provision for future floors, if you may add them
                </li>
                <li>
                  Basement waterproofing and drainage, with a sump and pump where
                  groundwater demands it, which our Water Proofing service can
                  support
                </li>
                <li>
                  Expansion joints and movement provisions in long buildings
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Services Backbone
              </h3>
              <p className="mb-3">
                Services are cheaper to design in than to retrofit.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Power:</strong> Load estimate, transformer or sub-station,
                  meter rooms, backup generator and sub-metering for each unit{" "}
                  <span className="text-gray-500">
                    [Electrician service available through MTBoss]
                  </span>
                </li>
                <li>
                  <strong>Air conditioning:</strong> Central, packaged or
                  tenant-installed, with duct, shaft and outdoor unit space planned
                </li>
                <li>
                  <strong>Water:</strong> Supply, storage, pumping, fire water and
                  separate tenant meters where possible{" "}
                  <span className="text-gray-500">
                    [Plumber service available through MTBoss]
                  </span>
                </li>
                <li>
                  Drainage and sewage, with grease traps for food units
                </li>
                <li>
                  <strong>Garbage collection:</strong> A covered, ventilated room
                  with a service route
                </li>
                <li>
                  <strong>Data and CCTV:</strong> Cabling, security room and control
                </li>
                <li>
                  <strong>Lighting:</strong> Common areas, parking and exterior, with
                  controls to save energy
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Fire and Life Safety
              </h3>
              <p className="mb-3">
                A shopping complex is a public building, and safety shapes the plan{" "}
                <span className="text-gray-500">
                  [confirm all points with the local fire department, the authority
                  and a qualified fire consultant, and rely on their requirements]
                </span>
                .
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Enough, well-spaced exits and staircases, with travel distances kept
                  within rules
                </li>
                <li>
                  Fire alarms, extinguishers, hydrants and sprinklers where required
                </li>
                <li>
                  Smoke control in basements, atriums and corridors
                </li>
                <li>
                  Emergency lighting and clear signage
                </li>
                <li>
                  Fire-rated separation for risk areas, such as food units and
                  electrical rooms
                </li>
                <li>
                  Fire tender access around the building
                </li>
                <li>
                  Safe storage and refuse handling
                </li>
              </ul>
              <p className="mt-3">
                Don&apos;t assume any requirement applies or doesn&apos;t without
                checking.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Accessibility and Common Facilities
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Step-free entry, ramps, accessible toilets and lifts that suit
                  wheelchairs
                </li>
                <li>
                  Clean, sufficient toilets on each floor, with separate blocks for
                  men and women
                </li>
                <li>
                  Drinking water points and seating
                </li>
                <li>
                  Baby-care or rest areas, where space allows
                </li>
                <li>
                  Good lighting, non-slip floors and handrails
                </li>
                <li>
                  A management office and security room
                </li>
                <li>
                  Clear emergency evacuation maps
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Signage and Branding Framework
              </h3>
              <p className="mb-3">
                A tidy sign system protects the building&apos;s image and its rent.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Sign zones for each shop front, with agreed size, height and
                  lighting rules
                </li>
                <li>
                  A main building sign and a tenant directory at the entrance
                </li>
                <li>
                  Wayfinding signs inside, in clear language
                </li>
                <li>
                  Rules on hoardings and projections, along with local authority
                  limits{" "}
                  <span className="text-gray-500">[confirm]</span>
                </li>
                <li>
                  Safe fixings and electrical connections for lit signs
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Tenant Fit-Out Guidelines
              </h3>
              <p className="mb-3">
                Written fit-out rules keep tenants consistent and the building safe{" "}
                <span className="text-gray-500">
                  [state what MTBoss can prepare]
                </span>
                .
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Permitted changes to walls, floors and ceilings
                </li>
                <li>
                  Shopfront design and glazing standards
                </li>
                <li>
                  Electrical load limits and approved connection points
                </li>
                <li>
                  Air conditioning and exhaust routes
                </li>
                <li>
                  Floor loading limits and drilling restrictions
                </li>
                <li>
                  Waterproofing duties in wet areas
                </li>
                <li>
                  Working hours, deposits and debris rules for contractors
                </li>
                <li>
                  Fire safety requirements for tenants
                </li>
                <li>
                  Approval steps before fit-out begins
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Sale or Lease Model and Registrations
              </h3>
              <p className="mb-3">
                How you plan to earn changes the design and the paperwork{" "}
                <span className="text-gray-500">
                  [have a qualified legal professional advise]
                </span>
                .
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Leasing the whole complex:</strong> Flexible unit sizes,
                  shared services and a management plan
                </li>
                <li>
                  <strong>Selling shops:</strong> Clear unit boundaries, separate
                  meters and a registered project, where required
                </li>
                <li>
                  <strong>Mixed model:</strong> Sell some units and lease others,
                  with an agreed management structure
                </li>
              </ul>
              <p className="mt-3">
                Commercial projects may need registration under the Real Estate
                (Regulation and Development) Act, depending on size and the number of
                units, along with disclosures and escrow requirements{" "}
                <span className="text-gray-500">
                  [confirm the current UP-RERA thresholds and obligations with a
                  qualified professional]
                </span>
                .
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Phasing and Cash Flow
              </h3>
              <p className="mb-3">
                Many owners build in stages to match funds and leasing.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Phase one:</strong> Frontage shops and parking, with
                  services sized for later phases
                </li>
                <li>
                  <strong>Phase two:</strong> Upper floors and offices
                </li>
                <li>
                  <strong>Phase three:</strong> Extension, anchor or added basement
                  levels, if the structure was planned for it
                </li>
              </ul>
              <p className="mt-3">
                Early shops that lease quickly can fund later phases. Foundations,
                columns and service routes should anticipate expansion, because
                retrofitting is costly.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Budget Factors
              </h3>
              <p className="mb-3">
                Costs depend on area, structure, finish and approvals. Main factors
                include{" "}
                <span className="text-gray-500">
                  [state how MTBoss prepares estimates]
                </span>
                :
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Built-up area, floors and basement depth</li>
                <li>Structural system and span</li>
                <li>Facade and finish level</li>
                <li>Lifts or escalators</li>
                <li>
                  Air conditioning and electrical systems
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Drawings and Deliverables
              </h3>
              <p className="mb-3">
                A usable set normally includes{" "}
                <span className="text-gray-500">
                  [adjust to what MTBoss provides]
                </span>
                :
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Site survey and plot plan</li>
                <li>
                  Unit layout and area statement by floor
                </li>
                <li>
                  Floor plans, elevations, sections and 3D views
                </li>
                <li>Basement and parking plans</li>
                <li>
                  Structural drawings from a qualified engineer
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Mistakes to Avoid
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Designing the facade before checking the market and parking
                </li>
                <li>
                  Unequal or hidden frontage for some units
                </li>
                <li>
                  Narrow corridors and hard-to-find upper floors
                </li>
                <li>
                  Too little parking, or a steep, tight ramp
                </li>
                <li>
                  Under-sized power, air conditioning and drainage
                </li>
                <li>
                  No plan for tenant fit-outs and signage
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Checklist for Choosing a Design Partner
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  COA registration of the lead architect, and business details
                </li>
                <li>
                  Completed commercial, retail or mixed-use projects, with
                  photographs and client contacts{" "}
                  <span className="text-gray-500">[ask to see them]</span>
                </li>
                <li>
                  Understanding of leasing and income, shown in the first meeting
                </li>
                <li>
                  A written scope, stages, deliverables and fees
                </li>
                <li>
                  Clear division between architect, structural, services and fire
                  consultants
                </li>
              </ul>
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
                  <strong>Service:</strong> Commercial design and construction,
                  alongside home services
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
                  <strong>Income-first planning:</strong> Unit mix, frontage, parking
                  and services designed to earn
                </li>
                <li>
                  <strong>Commercial Buildings category on our website:</strong>{" "}
                  Shops, showrooms, offices and complexes
                </li>
                <li>
                  <strong>One team from design to construction:</strong> Civil,
                  electrical, plumbing, waterproofing and finishing
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
                We work with clients in Bareilly city and nearby main-road locations,
                depending on the project and location{" "}
                <span className="text-gray-500">
                  [confirm your real coverage and delete areas you do not serve]
                </span>
                . We also serve Moradabad and nearby towns of western Uttar Pradesh.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Plan Your Shopping Complex With MTBoss
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
                Share your plot location and size, intended use, budget range and
                funding stage, and we&apos;ll arrange a site study and a written
                proposal.
              </p>
              <p className="mt-3">
                Consider MTBoss for your shopping complex in Bareilly, with the
                units planned to lease, the parking planned to work and the services
                built to last.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Frequently Asked Questions
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Q1. Who designs shopping complexes in Bareilly?</strong>
                  <br />
                  MTBoss Construction offers commercial design and construction for
                  Bareilly and Moradabad{" "}
                  <span className="text-gray-500">[confirm registration]</span>.
                </li>
                <li>
                  <strong>Q2. What do you need from me to start?</strong>
                  <br />
                  Plot location and size, intended use, budget, funding stage and
                  sale or lease plan.
                </li>
                <li>
                  <strong>Q3. Can you plan the unit mix?</strong>
                  <br />
                  Yes, with advice on shop sizes, anchors and upper-floor uses{" "}
                  <span className="text-gray-500">[confirm]</span>.
                </li>
                <li>
                  <strong>Q4. How do you plan parking?</strong>
                  <br />
                  Through basement, stilt or surface options, within the local norm{" "}
                  <span className="text-gray-500">[confirm the norm]</span>.
                </li>
                <li>
                  <strong>Q5. Can you design a basement?</strong>
                  <br />
                  Yes, with soil checks, waterproofing and drainage{" "}
                  <span className="text-gray-500">
                    [confirm structural arrangement]
                  </span>
                  .
                </li>
                <li>
                  <strong>Q6. Do you plan fire safety and approvals?</strong>
                  <br />
                  We plan layouts with qualified consultants, and{" "}
                  <span className="text-gray-500">[state your approvals scope]</span>.
                </li>
                <li>
                  <strong>Q7. Can I build in phases?</strong>
                  <br />
                  Yes. We design the whole and plan the build in stages.
                </li>
                <li>
                  <strong>Q8. Do I need RERA registration to sell shops?</strong>
                  <br />
                  It may apply. Check the current rules with a qualified professional{" "}
                  <span className="text-gray-500">[confirm]</span>.
                </li>
                <li>
                  <strong>Q9. How can I book a site study?</strong>
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