import React from "react";
import LandingEnquiry from "../../components/LandingEnquiry";

const Content = () => {
  return (
    <div className="min-h-screen bg-white pt-0">
      <div className="flex flex-col lg:flex-row">
        {/* Content Section */}
        <div className="flex-1 px-4 sm:px-8 md:px-16 py-12 order-1 lg:order-1">
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-8 text-gray-900">
            Architect for Farmhouse Bareilly: MTBoss
          </h2>

          <div className="space-y-6 text-gray-700 leading-relaxed max-w-4xl">
            <section>
              <p>
                An architect for a farmhouse in Bareilly plans the house,
                outbuildings, water, power, wastewater and landscape on your plot,
                within the land&apos;s legal status and the local climate. MTBoss
                Construction Private Limited serves Bareilly and Moradabad with
                residential design and construction under one team{" "}
                <span className="text-gray-500">
                  [confirm architect registration and farmhouse experience]
                </span>
                .
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                A Farmhouse Starts With the Land
              </h3>
              <p>
                A town house sits on a plot with utilities at the gate. A farmhouse
                sits on land that may have no sewer, uncertain power, a seasonal
                drain across one corner and a road that turns to mud in the monsoon.
                Good farmhouse design begins by reading that land, not by choosing an
                elevation.
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
                Farmhouse Types
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Weekend retreat:</strong> A comfortable second home with
                  lawns, a sit-out and guest space
                </li>
                <li>
                  <strong>Working farmhouse:</strong> A home beside crops or an
                  orchard, with a store, pump room and caretaker quarters
                </li>
                <li>
                  <strong>Orchard or plantation home:</strong> Sited to protect
                  trees, with shaded outdoor living
                </li>
                <li>
                  <strong>Retirement farmhouse:</strong> Single-level living, easy
                  access and low maintenance
                </li>
                <li>
                  <strong>Event or agro-tourism farm:</strong> A main house with
                  guest cottages, a lawn and parking{" "}
                  <span className="text-gray-500">
                    [confirm permissions for commercial use]
                  </span>
                </li>
                <li>
                  <strong>Family compound:</strong> Several homes sharing land, water
                  and a boundary
                </li>
              </ul>
              <p className="mt-3">
                <span className="text-gray-500">
                  [Keep only the types MTBoss actually designs.]
                </span>{" "}
                Tell us how you will use the land, since use drives both design and
                permissions.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Land Status and Permissions First
              </h3>
              <p className="mb-3">
                Before paying for drawings, confirm what the land allows{" "}
                <span className="text-gray-500">
                  [confirm each with the revenue authority, the Bareilly Development
                  Authority or the relevant body, and a qualified legal professional]
                </span>
                .
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Land-use status:</strong> Agricultural, residential or
                  another category, and whether conversion or a declaration is needed
                  before building a house
                </li>
                <li>
                  <strong>Master-plan zone:</strong> Whether the plot falls inside a
                  regulated area or outside it
                </li>
                <li>
                  <strong>Permitted built-up area, height and setbacks</strong> for
                  the plot size
                </li>
                <li>
                  <strong>Title and records:</strong> Clean ownership papers and
                  boundaries
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Reading the Site
              </h3>
              <p className="mb-3">
                Our site study covers{" "}
                <span className="text-gray-500">
                  [adjust to MTBoss&apos;s method]
                </span>
                :
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  <strong>Levels and slope:</strong> Where water flows and where it
                  collects
                </li>
                <li>
                  <strong>Soil:</strong> Black cotton or clay soils swell and crack,
                  so foundation advice may need a soil test
                </li>
                <li>
                  <strong>Flood and drainage risk:</strong> Nearby drains, canals and
                  monsoon high-water marks
                </li>
                <li>
                  Water table and borewell options
                </li>
                <li>
                  Existing trees, orchards and crops to protect
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Access, Gate and Internal Roads
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  A road usable in the monsoon, with a firm base and side drains
                </li>
                <li>
                  A gate set back from the road, with space for a vehicle to stop
                  clear of traffic
                </li>
                <li>
                  A driveway wide enough for cars, a tractor or a delivery truck, with
                  turning space
                </li>
                <li>
                  Parking away from the house and from tree roots
                </li>
                <li>
                  Lighting for the drive and the approach
                </li>
                <li>
                  Separate farm and guest routes where the land allows
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Siting the House on the Land
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Place the house on the best-drained, firmest ground, usually
                  slightly raised
                </li>
                <li>
                  Orient living areas away from harsh west sun, and toward gentle
                  morning light and views
                </li>
                <li>
                  Keep distance from the road for quiet and privacy, and from the
                  borewell and septic for hygiene
                </li>
                <li>
                  Keep outbuildings, such as stores and sheds, downwind and downslope
                  of the house
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Building Programme for a Farmhouse
              </h3>
              <p className="mb-3">
                <span className="text-gray-500">
                  [State which of these MTBoss designs.]
                </span>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Main house with bedrooms, living, dining, kitchen and a wide
                  verandah
                </li>
                <li>Guest cottage or annexe</li>
                <li>
                  Caretaker or staff quarters with its own entry
                </li>
                <li>Farm store, pump room and tool shed</li>
                <li>
                  Cattle or poultry shelter, if you keep animals, placed away from
                  the house
                </li>
                <li>Garage or covered parking</li>
                <li>
                  Swimming pool or water feature, with safety fencing
                </li>
                <li>
                  Outdoor kitchen, pergola or barbecue area
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Climate-Smart Design
              </h3>
              <p className="mb-3">
                A farmhouse has no neighbours to shade it, so design must do the
                work.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Deep verandahs and chajjas that shade walls and windows
                </li>
                <li>
                  Cross-ventilation with openings on opposite sides
                </li>
                <li>
                  A courtyard or double-height space to let hot air rise
                </li>
                <li>
                  Insulated or ventilated roofs, and walls that slow heat
                </li>
                <li>
                  A raised plinth against monsoon water
                </li>
                <li>
                  Sun-facing windows for winter warmth, with shading for summer
                </li>
                <li>
                  Trees placed to shade the west side
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Water: Source, Storage and Quality
              </h3>
              <p className="mb-3">
                <span className="text-gray-500">
                  [confirm local rules and obtain professional advice]
                </span>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  <strong>Borewell or other source:</strong> Location, depth and
                  permissions
                </li>
                <li>
                  Water testing for drinking suitability before use
                </li>
                <li>
                  Storage: Underground and overhead tanks with covers
                </li>
                <li>
                  Rainwater harvesting: Collection from roofs and recharge pits
                </li>
                <li>
                  Irrigation planning: Drip lines, a separate pump or tank for the
                  farm
                </li>
                <li>
                  Pump room: Protected, ventilated and easy to service
                </li>
              </ul>
              <p className="mt-3">
                Our Plumber service can support the installation side.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Wastewater and Septic Planning
              </h3>
              <p className="mb-3">
                With no sewer line, wastewater stays on your land{" "}
                <span className="text-gray-500">
                  [confirm sizing, distances and rules with the authority and a
                  qualified engineer]
                </span>
                .
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  A septic tank and soak pit, or another treatment system, sized for
                  the number of users
                </li>
                <li>
                  Safe distance from the borewell and from boundaries, as the rules
                  require
                </li>
                <li>
                  Separate handling of kitchen and bathroom water, where useful
                </li>
                <li>
                  Reuse of treated water for the garden, if the design allows
                </li>
                <li>Easy access for cleaning</li>
              </ul>
              <p className="mt-3">
                Poor siting of the septic tank can contaminate your own drinking
                water.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Power, Solar and Backup
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Connection type and load:</strong> Domestic, agricultural
                  or commercial, each with its own rules and tariff{" "}
                  <span className="text-gray-500">
                    [confirm with the electricity company]
                  </span>
                </li>
                <li>
                  <strong>Solar panels:</strong> Roof or ground-mounted, for the
                  house and the pump{" "}
                  <span className="text-gray-500">[confirm if offered]</span>
                </li>
                <li>
                  <strong>Backup:</strong> Inverter or generator for outages
                </li>
                <li>
                  Pump panel and earthing, designed for safety in wet conditions
                </li>
                <li>
                  Outdoor and security lighting
                </li>
                <li>
                  Cable routes protected from rodents and digging
                </li>
              </ul>
              <p className="mt-3">
                Our Electrician service covers building-side works.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Snakes, Insects and Wildlife
              </h3>
              <p className="mb-3">
                Farmland brings creatures, and design can reduce contact.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  A raised plinth and a clean margin of gravel or paving around the
                  house
                </li>
                <li>
                  Mesh on windows, vents and drains
                </li>
                <li>
                  Sealed pipe and cable entries
                </li>
                <li>
                  Proper lighting along paths
                </li>
                <li>
                  Drainage that does not leave standing water, to cut mosquitoes
                </li>
                <li>
                  Well-fitted doors and thresholds
                </li>
                <li>
                  Tidy storage of grain, feed and waste, away from the house
                </li>
              </ul>
              <p className="mt-3">
                Our Pest Control service can treat termites, mosquitoes and rodents.
                For snake concerns, consult local wildlife or forest department
                guidance.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Security, Caretaker and Remote Monitoring
              </h3>
              <p className="mb-3">
                Many farmhouses stand empty for days.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Boundary:</strong> A wall, fence or a combination, with a
                  strong gate. Our Readymade Boundary service offers a quick option{" "}
                  <span className="text-gray-500">[confirm specifications]</span>
                </li>
                <li>
                  Caretaker quarters with a clear view of the gate
                </li>
                <li>
                  CCTV and alarms, with conduits laid during construction
                </li>
                <li>
                  Lighting around the house and along the boundary
                </li>
                <li>
                  Safe storage for tools and valuables
                </li>
                <li>
                  Remote monitoring through a phone-based system, where network
                  coverage allows
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Low-Maintenance Materials
              </h3>
              <p className="mb-3">
                Choose materials that cope with sun, rain, dust and little attention.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Durable external plaster and weather-resistant paint
                </li>
                <li>
                  Stone, brick or tile that ages well
                </li>
                <li>
                  Simple roof forms and good waterproofing, with our Water Proofing
                  service available
                </li>
                <li>
                  Hardwearing floors that survive muddy boots
                </li>
                <li>
                  Termite-resistant details and treated timber
                </li>
                <li>
                  Fewer complex joints, which means fewer leaks
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Landscape, Orchard and Outdoor Living
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Shade trees on the west and south
                </li>
                <li>
                  Lawn, kitchen garden and orchard zones, with water lines planned in
                  advance
                </li>
                <li>
                  Paths, sit-outs and a firepit or terrace for evenings
                </li>
                <li>
                  A pool, pond or water feature, with safety and drainage planned
                </li>
                <li>
                  Native, low-water plants that suit the climate
                </li>
                <li>
                  A windbreak where dust or wind is a problem
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Building on a Remote Site
              </h3>
              <p className="mb-3">
                Farmhouses are harder to build than town houses{" "}
                <span className="text-gray-500">
                  [state how MTBoss plans remote jobs]
                </span>
                .
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  <strong>Material transport:</strong> Road quality, truck access and
                  unloading space
                </li>
                <li>
                  <strong>Labour:</strong> Local skills, accommodation and attendance
                </li>
                <li>
                  <strong>Power and water during construction:</strong> Temporary
                  connections
                </li>
                <li>
                  <strong>Monsoon planning:</strong> Foundations and roofing done
                  before heavy rain
                </li>
                <li>
                  <strong>Supervision:</strong> Scheduled visits and photo or video
                  updates
                </li>
                <li>
                  Security of materials on an open site
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Phasing
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Land, access and boundary</li>
                <li>Water source, power and septic</li>
                <li>Main house shell and services</li>
                <li>Finishing and interiors</li>
                <li>
                  Outbuildings, landscape, pool and guest cottages
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Budget Factors
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Land preparation, access road and boundary
                </li>
                <li>Built-up area and finish level</li>
                <li>
                  Water source, tanks and treatment
                </li>
                <li>
                  Septic, solar and power connection
                </li>
                <li>
                  Outbuildings, pool and landscape
                </li>
              </ul>
              <p className="mt-3">
                Use the Budget Calculator on MTBoss.in for an early idea, then ask
                for an itemised estimate once the layout is fixed.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Drawings and Deliverables
              </h3>
              <p className="mb-3">
                <span className="text-gray-500">
                  [adjust to what MTBoss provides]
                </span>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Site survey and layout plan with access, house, outbuildings and
                  utilities
                </li>
                <li>
                  Floor plans, elevations, sections and 3D views
                </li>
                <li>
                  Structural drawings from a qualified engineer
                </li>
                <li>
                  Electrical, plumbing, water and septic layouts
                </li>
                <li>
                  Boundary, gate and landscape details
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Mistakes to Avoid
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Buying land before checking its status and access
                </li>
                <li>
                  Siting the house on low or poorly drained ground
                </li>
                <li>
                  Placing the septic tank near the borewell
                </li>
                <li>
                  Skipping soil tests on clay soils
                </li>
                <li>
                  Ignoring monsoon access and drainage
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Choosing a Design Partner
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  COA registration of the lead architect, and business details
                </li>
                <li>
                  Completed farmhouse or rural projects, with photographs and client
                  contacts{" "}
                  <span className="text-gray-500">[ask to see them]</span>
                </li>
                <li>
                  Willingness to visit and study the land before drawing
                </li>
                <li>
                  A written scope, stages, deliverables and fees
                </li>
                <li>
                  Clear division between architect, structural and services
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
                  <strong>Service:</strong> Residential design and construction,
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
                  <span className="text-gray-500">[state truthfully]</span>
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
                  <strong>Land-first approach:</strong> Status, access, water and
                  drainage checked before drawing
                </li>
                <li>
                  <strong>Residential Projects category on our website:</strong>{" "}
                  Homes and villas, with boundary and finishing services
                </li>
                <li>
                  <strong>One team from design to construction:</strong> Civil,
                  plumbing, electrical, waterproofing and boundary work
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
                We work with clients on farmland and outskirts around Bareilly,
                depending on the project and location{" "}
                <span className="text-gray-500">
                  [confirm your real coverage and name the roads and areas you
                  actually serve]
                </span>
                . We also serve Moradabad and nearby towns of western Uttar Pradesh.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Plan Your Farmhouse With MTBoss
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
                Share your land location pin, size, land papers, intended use and
                budget range, and we&apos;ll arrange a site study and a written
                proposal.
              </p>
              <p className="mt-3">
                Consider MTBoss for your farmhouse in Bareilly, with the land read
                first, the services planned for a site without a town grid and the
                house built to need little care.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Frequently Asked Questions
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Q1. Who designs farmhouses in Bareilly?</strong>
                  <br />
                  MTBoss Construction offers farmhouse design and construction for
                  Bareilly and Moradabad{" "}
                  <span className="text-gray-500">[confirm registration]</span>.
                </li>
                <li>
                  <strong>Q2. Can I build a house on agricultural land?</strong>
                  <br />
                  It depends on land status and local rules. Check with the authority
                  and a legal professional first{" "}
                  <span className="text-gray-500">[confirm]</span>.
                </li>
                <li>
                  <strong>Q3. What do you need from me to start?</strong>
                  <br />
                  Land location, size, papers, intended use and budget.
                </li>
                <li>
                  <strong>Q4. How is water arranged on a farm plot?</strong>
                  <br />
                  Through a borewell or other source, storage tanks and rainwater
                  harvesting, with water testing.
                </li>
                <li>
                  <strong>Q5. How is wastewater handled without a sewer?</strong>
                  <br />
                  By a septic tank and soak pit or other treatment, sited safely{" "}
                  <span className="text-gray-500">[confirm rules]</span>.
                </li>
                <li>
                  <strong>Q6. Can you design solar and backup power?</strong>
                  <br />
                  Yes, within a clear power plan{" "}
                  <span className="text-gray-500">[confirm solar scope]</span>.
                </li>
                <li>
                  <strong>Q7. How do you reduce snakes and pests?</strong>
                  <br />
                  With a raised plinth, mesh, drainage and tidy surroundings. Our
                  Pest Control service can help.
                </li>
                <li>
                  <strong>Q8. Can I build in phases?</strong>
                  <br />
                  Yes. We design the whole and plan the build in stages.
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