import React from "react";
import LandingEnquiry from "../../components/LandingEnquiry";

const Content = () => {
  return (
    <div className="min-h-screen bg-white pt-0">
      <div className="flex flex-col lg:flex-row">
        {/* Content Section */}
        <div className="order-1 flex-1 px-4 py-12 sm:px-8 md:px-16 lg:order-1">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl md:text-3xl">
            How to Judge, Compare and Choose a Kitchen That Lasts
          </h2>

          <div className="max-w-4xl space-y-6 leading-relaxed text-gray-700">
            <section>
              <p>
                Everyone wants &quot;the best&quot; modular kitchen, and every
                provider says they offer it. The word is easy to print and hard
                to prove. A kitchen that looks excellent in a photograph can
                disappoint after two monsoons: swollen cabinet bases near the
                sink, drawers that drag, shutters that peel at the edges, a
                chimney that does not clear the smoke. The best kitchen is not
                the most expensive or the most colourful. It is the one that is
                planned well, built with the right materials, installed
                carefully and supported after handover.
              </p>

              <p className="mt-3">
                This page does not ask you to take our word for it. It gives
                you a practical way to judge any modular kitchen provider in
                Bareilly, including MTBOSS: what to check, which questions to
                ask, what to inspect on delivery and which warning signs to
                avoid. MTBOSS Construction Private Limited is an architect,
                interior designer and construction company serving Moradabad
                and Bareilly. It offers modular kitchens, waterproofing,
                building repair, renovation and other home services with
                transparent pricing and on-time delivery.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                What &quot;Best Modular Kitchen&quot; Should Mean: A Quick
                Checklist
              </h3>

              <p className="mb-3">
                Use this table to compare providers side by side.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2">
                        What to check
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        A strong provider
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        A weak provider
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Site visit and measurement
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Measures carefully, checks plumbing, walls and
                        electricals
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Quotes from a rough size over the phone
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Layout planning
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Plans around how you cook and your storage needs
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Pushes a standard package
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Materials
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Names the carcass, shutter, countertop and hardware in
                        writing
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Uses vague terms like &quot;premium quality&quot;
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Moisture protection
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Explains how the carcass and edges handle humidity
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Ignores the monsoon and the sink area
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Design preview
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Shows a 2D or 3D plan before manufacturing
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Starts production without approval
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Quote
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Item-wise, with scope and exclusions
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        One lump sum, vague inclusions
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Installation
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Skilled fitters, planned schedule, clean site
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Delays, rework and untidy finishing
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        After-sales
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Adjustments, service and clear terms
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Disappears after payment
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Accountability
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Real office, phone support and visible past work
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        No address or records
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-3">
                The best modular kitchen is built on honest planning and clear
                specifications, not on a catalogue photo.
              </p>
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
                  Modular Kitchen is listed among the Quick Home Services on
                  our website, alongside architecture and interior, carpenter,
                  plumber, electrician, tile and marble, painter, false ceiling
                  and building repair.
                </li>
                <li>
                  A project gallery and blog on the website let prospective
                  clients review completed work.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Modular Kitchen Services Offered by MTBOSS for Bareilly Clients
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Site visit and kitchen measurement:</strong>{" "}
                  Measuring the room and checking plumbing, electrical points,
                  windows, walls and floors.
                </li>
                <li>
                  <strong>Layout planning:</strong> Choosing a layout that
                  suits your space, cooking style and storage needs.
                </li>
                <li>
                  <strong>Kitchen design and 2D or 3D planning:</strong>{" "}
                  Showing how the kitchen will look and work before it is made.
                </li>
                <li>
                  <strong>Material and finish selection:</strong> Helping you
                  choose carcass, shutters, countertop, hardware and
                  backsplash.
                </li>
                <li>
                  <strong>Custom cabinets and storage:</strong> Base units,
                  wall units, tall units, corner solutions, pull-outs and
                  drawers.
                </li>
                <li>
                  <strong>Countertop, sink and backsplash:</strong> Selecting
                  and fitting suitable surfaces and fixtures.
                </li>
                <li>
                  <strong>Chimney, hob and appliance planning:</strong>{" "}
                  Allowing space and services for your appliances.
                </li>
                <li>
                  <strong>Plumbing, electrical and lighting planning:</strong>{" "}
                  Done with our plumber and electrician services.
                </li>
                <li>
                  <strong>Tile, marble and flooring work:</strong> Kitchen
                  floor and wall tiling through our tile and marble service.
                </li>
                <li>
                  <strong>False ceiling and painting:</strong> Ceiling design
                  and finishing through our false ceiling and painter services.
                </li>
                <li>
                  <strong>Kitchen renovation:</strong> Upgrading an existing
                  kitchen, with civil changes where needed.
                </li>
                <li>
                  <strong>Moisture and pest protection advice:</strong> Sealing
                  gaps and protecting the kitchen from damp and pests.
                </li>
                <li>
                  <strong>Installation and handover:</strong> Fitting,
                  adjustment, cleaning and a final walk-through.
                </li>
                <li>
                  <strong>After-installation support:</strong> Adjustments,
                  repairs and related home services.
                </li>
              </ul>

              <p className="mt-3">
                Final scope for each project is discussed and confirmed with
                the MTBOSS team before work begins.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Ten Questions to Ask Any Modular Kitchen Provider
              </h3>

              <p className="mb-3">
                Ask these before you book, whether you call us or someone else.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Will you visit and measure the site before
                  quoting?</strong> Accurate measurement is the base of a good
                  kitchen.
                </li>
                <li>
                  <strong>
                    Which carcass material will be used, and how does it handle
                    moisture?
                  </strong>{" "}
                  Ask specifically about the sink area and the monsoon.
                </li>
                <li>
                  <strong>
                    What shutter finish do you recommend for my cooking style?
                  </strong>{" "}
                  The answer should consider oil, heat and cleaning.
                </li>
                <li>
                  <strong>
                    Which hardware is used for hinges, channels and drawers?
                  </strong>{" "}
                  Ask for names and specifications in writing.
                </li>
                <li>
                  <strong>
                    Will I see a design plan before manufacturing starts?
                  </strong>{" "}
                  You should approve the layout and finishes.
                </li>
                <li>
                  <strong>What exactly is included in the quote?</strong>{" "}
                  Cabinets, countertop, sink, chimney, hob, tiling, electrical
                  and plumbing should be clearly listed or excluded.
                </li>
                <li>
                  <strong>
                    How long will the project take, and what could cause delay?
                  </strong>{" "}
                  A realistic timeline matters.
                </li>
                <li>
                  <strong>
                    Who installs the kitchen, and who is responsible if
                    something is wrong?
                  </strong>{" "}
                  You should know the team and the point of contact.
                </li>
                <li>
                  <strong>What warranty or service terms apply?</strong> Ask
                  for them in writing, including what is and is not covered.
                </li>
                <li>
                  <strong>
                    Can I see completed work or speak to a past customer?
                  </strong>{" "}
                  Photos, a gallery or references help.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Warning Signs of a Weak Modular Kitchen Provider
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>Quotes a price without measuring the site.</li>
                <li>
                  Uses vague material descriptions instead of naming
                  specifications.
                </li>
                <li>
                  Cannot explain how the kitchen will handle humidity and
                  water.
                </li>
                <li>Offers a very low price with no breakdown.</li>
                <li>Starts production without a design approval.</li>
                <li>
                  Pushes you to decide quickly or pay a large advance.
                </li>
                <li>
                  Makes big promises about warranty without putting them in
                  writing.
                </li>
                <li>Ignores plumbing, electrical and wall conditions.</li>
                <li>
                  Has no real address, gallery or past work to show.
                </li>
                <li>
                  Does not discuss installation, schedule or after-sales
                  support.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                What the Best Kitchens Get Right
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>A Layout That Fits Your Cooking:</strong> A good plan
                  starts with your routine: how many people cook, what you
                  cook, what you store and where you stand. The layout, the
                  work triangle and the storage follow from that.
                </li>
                <li>
                  <strong>The Right Carcass:</strong> The carcass is the hidden
                  structure of every cabinet. Moisture, weight and daily use
                  test it more than the shutter. A kitchen with a poor carcass
                  looks fine at first and fails early near the sink and stove.
                </li>
                <li>
                  <strong>Hardware That Feels Smooth Over Years:</strong>{" "}
                  Hinges, channels, drawers and baskets decide whether the
                  kitchen is pleasant or irritating to use. Good hardware is
                  rarely visible in photographs but is obvious in daily use.
                </li>
                <li>
                  <strong>A Chimney and Ventilation Plan:</strong> Oil, steam
                  and heat shorten the life of cabinets and walls. A kitchen
                  with a well-chosen chimney, correct duct routing and
                  ventilation stays cleaner and more comfortable.
                </li>
                <li>
                  <strong>Moisture, Gap and Pest Control:</strong> Gaps behind
                  cabinets, around pipes and along walls let in damp,
                  cockroaches and ants. Good installation seals them.
                </li>
                <li>
                  <strong>Services Planned Together:</strong> Plumbing,
                  electrical points, tiling, ceiling and painting should match
                  the kitchen plan, not fight it. Late changes cause delays and
                  ugly patchwork.
                </li>
                <li>
                  <strong>Clean Installation and Finishing:</strong> Straight
                  lines, even gaps, aligned shutters, sealed edges and a clean
                  site show care.
                </li>
                <li>
                  <strong>Honest After-Sales Support:</strong> Shutters settle,
                  hinges need adjustment and small faults appear. A provider
                  who comes back and fixes them is worth more than a discount.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                How to Compare Modular Kitchen Quotes Fairly
              </h3>

              <p className="mb-3">
                A lower price is only good if the kitchen is the same. Compare
                these points.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Same size and layout:</strong> Are the running
                  length, units and heights the same?
                </li>
                <li>
                  <strong>Same carcass material:</strong> A cheaper carcass can
                  fail early.
                </li>
                <li>
                  <strong>Same shutter finish:</strong> Laminate, acrylic,
                  membrane and PU finishes are not equal.
                </li>
                <li>
                  <strong>Same countertop:</strong> Material and thickness
                  differ.
                </li>
                <li>
                  <strong>Same hardware:</strong> Ask for names and types.
                </li>
                <li>
                  <strong>Same inclusions:</strong> Are chimney, hob, sink,
                  tiling, electrical and plumbing included or extra?
                </li>
                <li>
                  <strong>Same civil work:</strong> Are wall repairs,
                  waterproofing and floor levelling included?
                </li>
                <li>
                  <strong>Same timeline and payment terms:</strong> Are stages
                  tied to progress?
                </li>
                <li>
                  <strong>Same warranty and service terms:</strong> Are they
                  written down?
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                What to Verify Before You Pay Final Installments
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>Units match the approved design and measurements.</li>
                <li>
                  Shutters are aligned, with even gaps and no chips or
                  scratches.
                </li>
                <li>Edges near the sink and hob are sealed.</li>
                <li>
                  Drawers and doors open and close smoothly and quietly.
                </li>
                <li>Hinges, channels and handles are tight and level.</li>
                <li>
                  The countertop is level, joined neatly and sealed at the
                  edges and the wall.
                </li>
                <li>The sink, taps and drain work with no leaks.</li>
                <li>
                  The chimney is fixed properly, with a clear duct and working
                  lights and fan.
                </li>
                <li>
                  Sockets, switches and lighting work as planned.
                </li>
                <li>
                  The backsplash and wall tiles are neat and grouted.
                </li>
                <li>Gaps around pipes and walls are sealed.</li>
                <li>
                  The kitchen is clean, and no debris is left behind.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Read the Kitchen Before Choosing the Design
              </h3>

              <p className="mb-3">
                The finish is the last part of the job. What lies behind it
                decides how long the kitchen lasts.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Measure carefully:</strong> Accurate measurements
                  prevent gaps and misfits.
                </li>
                <li>
                  <strong>Check walls and floors:</strong> Uneven or damp walls
                  and floors affect cabinets and countertops.
                </li>
                <li>
                  <strong>Locate plumbing and drainage:</strong> Sink and water
                  line positions affect the layout.
                </li>
                <li>
                  <strong>Check electrical points:</strong> Plan sockets and
                  switches for appliances and lighting.
                </li>
                <li>
                  <strong>Study windows and doors:</strong> They affect
                  ventilation, light and unit placement.
                </li>
                <li>
                  <strong>Look at moisture:</strong> Leaks and damp walls must
                  be fixed before cabinets go in.
                </li>
                <li>
                  <strong>Check pests and gaps:</strong> Cracks and pipe gaps
                  invite cockroaches, ants and termites.
                </li>
                <li>
                  <strong>Plan the chimney path:</strong> Duct length and
                  routing affect performance.
                </li>
                <li>
                  <strong>Consider the load:</strong> Heavy countertops and
                  wall units need strong fixing points.
                </li>
              </ul>

              <p className="mt-3">
                Because kitchens deal with water, heat and food, modular
                kitchen work often goes together with plumbing, electrical,
                tile work, waterproofing and pest control. MTBOSS can plan
                these under one roof.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Planning by Type of Home
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Apartment or flat:</strong> Limited space and fixed
                  plumbing points make smart storage and layout important.
                  Check society rules for timings and material movement.
                </li>
                <li>
                  <strong>Independent house or villa:</strong> More freedom in
                  layout, with options for larger kitchens, islands and
                  separate utility areas.
                </li>
                <li>
                  <strong>New construction:</strong> Plan the kitchen early, so
                  plumbing, electrical points and walls match the design.
                </li>
                <li>
                  <strong>Renovation or kitchen upgrade:</strong> Decide what
                  to keep, what to replace and what civil changes are needed.
                </li>
                <li>
                  <strong>Open-plan home:</strong> Pay extra attention to
                  chimney performance, oil control and appearance.
                </li>
                <li>
                  <strong>Joint family home:</strong> Plan for larger storage,
                  bulk cooking and multiple cooks.
                </li>
                <li>
                  <strong>Small kitchen:</strong> Use tall units, corner
                  solutions and vertical space.
                </li>
                <li>
                  <strong>Rented home:</strong> Choose practical, durable
                  options and check with the owner.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Bareilly Planning Notes for Choosing a Modular Kitchen
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Monsoon humidity:</strong> Ask how the carcass, edges
                  and shutters handle moisture, and ensure the kitchen is
                  ventilated.
                </li>
                <li>
                  <strong>Summer heat:</strong> Plan ventilation, a suitable
                  chimney and heat-resistant surfaces near the hob.
                </li>
                <li>
                  <strong>Heavy cooking styles:</strong> Oil and masala cooking
                  need easy-to-clean shutters and a washable backsplash.
                </li>
                <li>
                  <strong>Pests:</strong> Seal gaps and avoid hidden voids,
                  since cockroaches, ants and termites are common in warm,
                  humid kitchens.
                </li>
                <li>
                  <strong>Water quality:</strong> If the water is hard, choose
                  taps and finishes that cope with it.
                </li>
                <li>
                  <strong>Older buildings:</strong> Walls, floors and plumbing
                  may need repair before installation.
                </li>
                <li>
                  <strong>Apartment rules:</strong> Check lift use, timings and
                  permission for drilling and noise.
                </li>
                <li>
                  <strong>Festival and wedding seasons:</strong> Plan well
                  before big cooking occasions, and allow time for delays.
                </li>
                <li>
                  <strong>Dust and construction:</strong> Protect nearby rooms
                  and furniture during installation.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Choose Your Modular Kitchen Package
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Essential modular kitchen package:</strong> Layout,
                  standard cabinets, countertop and installation for a
                  straightforward kitchen.
                </li>
                <li>
                  <strong>Custom kitchen package:</strong> Fully planned
                  storage, finishes and hardware chosen to your needs.
                </li>
                <li>
                  <strong>Compact kitchen package:</strong> Space-saving design
                  for small flats and narrow rooms.
                </li>
                <li>
                  <strong>L-shaped and U-shaped kitchen package:</strong>{" "}
                  Layouts planned around corner storage and the work triangle.
                </li>
                <li>
                  <strong>Island and open kitchen package:</strong> Planned
                  services, clearances and ventilation for larger spaces.
                </li>
                <li>
                  <strong>Kitchen renovation package:</strong> Upgrading an
                  existing kitchen with civil, plumbing and electrical changes.
                </li>
                <li>
                  <strong>Kitchen with tile and ceiling package:</strong>{" "}
                  Cabinets plus flooring, wall tiles, false ceiling and
                  painting.
                </li>
                <li>
                  <strong>Moisture and pest protection add-on:</strong>{" "}
                  Waterproofing, gap sealing and pest control around the
                  kitchen.
                </li>
                <li>
                  <strong>Phase-wise kitchen plan:</strong> One complete plan
                  carried out in stages to match your budget.
                </li>
              </ul>

              <p className="mt-3">
                Scope and specifications are agreed in writing before work
                begins, so you know exactly what is included.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Factors That Affect Modular Kitchen Cost in Bareilly
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Kitchen size and layout:</strong> More running length
                  and units mean more material and labour.
                </li>
                <li>
                  <strong>Carcass material:</strong> Moisture-resistant and
                  higher-grade materials cost more.
                </li>
                <li>
                  <strong>Shutter finish:</strong> Laminate, acrylic, membrane,
                  PU and glass finishes sit at different price levels.
                </li>
                <li>
                  <strong>Countertop material:</strong> Granite, quartz and
                  engineered stone differ in cost.
                </li>
                <li>
                  <strong>Hardware quality:</strong> Hinges, channels, drawers
                  and baskets affect both price and performance.
                </li>
                <li>
                  <strong>Storage features:</strong> Tall units, corner
                  solutions and pull-outs add to the cost.
                </li>
                <li>
                  <strong>Appliances:</strong> Chimney, hob and built-in
                  appliances are often priced separately.
                </li>
                <li>
                  <strong>Civil, plumbing and electrical work:</strong>{" "}
                  Changes to walls, pipes and wiring add to the budget.
                </li>
                <li>
                  <strong>Tiling, false ceiling and painting:</strong>{" "}
                  Finishing work around the kitchen.
                </li>
                <li>
                  <strong>Site conditions:</strong> Uneven walls, damp and
                  access affect time and cost.
                </li>
                <li>
                  <strong>Timeline and design changes:</strong> Faster
                  schedules and changes after approval can add cost.
                </li>
              </ul>

              <p className="mt-3">
                A low price is only a good price if the materials and scope are
                the same. Compare specifications, not just the amount. Your
                actual quote depends on the design, materials and site
                conditions. Use the free MTBOSS Budget Calculator on the
                website for a starting estimate for related construction work,
                and request a detailed quote after the site visit.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Budget Priorities for a Modular Kitchen
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>First:</strong> Fix the basics. Repair leaks, damp,
                  wiring and plumbing before cabinets go in.
                </li>
                <li>
                  <strong>Second:</strong> Get the layout right. A good layout
                  improves daily use more than any finish.
                </li>
                <li>
                  <strong>Third:</strong> Invest in the carcass and hardware.
                  These decide how long the kitchen lasts.
                </li>
                <li>
                  <strong>Fourth:</strong> Choose a suitable countertop and
                  backsplash. They take the most wear.
                </li>
                <li>
                  <strong>Fifth:</strong> Plan ventilation. A good chimney and
                  exhaust protect the walls and your comfort.
                </li>
                <li>
                  <strong>Sixth:</strong> Choose shutter finishes that suit
                  your budget and cleaning habits.
                </li>
                <li>
                  <strong>Seventh:</strong> Add upgrades later. Extra lighting
                  and special baskets can follow.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                How MTBOSS Approaches a Modular Kitchen Project
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Step 1 — Enquiry and discussion:</strong> Contact
                  MTBOSS through the website, phone or WhatsApp and share your
                  kitchen size, needs and budget.
                </li>
                <li>
                  <strong>Step 2 — Budget Calculator:</strong> The free
                  calculator on our website gives a starting estimate before
                  the site visit.
                </li>
                <li>
                  <strong>Step 3 — Site visit and measurement:</strong> The
                  team measures the kitchen and checks walls, floors, plumbing
                  and electrical points. Share your locality in Bareilly, and
                  the team will confirm arrangements.
                </li>
                <li>
                  <strong>Step 4 — Requirements and layout discussion:</strong>{" "}
                  You and the team talk through your cooking style, storage
                  needs and appliances.
                </li>
                <li>
                  <strong>Step 5 — Design and material selection:</strong> The
                  team proposes a layout and helps you choose materials,
                  finishes and hardware.
                </li>
                <li>
                  <strong>Step 6 — Itemised estimate:</strong> A clear scope
                  and an item-wise cost outline are prepared.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                How to Prepare Your Home for Installation
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  Clear the kitchen and nearby areas of food, utensils and
                  appliances.
                </li>
                <li>
                  Arrange temporary cooking and water arrangements for the
                  installation period.
                </li>
                <li>
                  Confirm the final design, measurements and finishes before
                  manufacturing begins.
                </li>
                <li>
                  Check society rules about timings, lift use and material
                  movement.
                </li>
                <li>
                  Protect nearby rooms, flooring and furniture from dust.
                </li>
                <li>Keep children and pets away from the work area.</li>
                <li>
                  Decide on appliances and their dimensions before final
                  measurements.
                </li>
                <li>
                  Keep delivery access clear for large boxes and units.
                </li>
                <li>
                  Plan time for adjustments and snagging after installation.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Modular Kitchen Care After Installation
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  Wipe spills, oil and water quickly, especially around the
                  sink and hob.
                </li>
                <li>
                  Use mild cleaners suited to your shutter and countertop
                  material.
                </li>
                <li>
                  Keep the area around the sink dry, and fix leaks immediately.
                </li>
                <li>
                  Clean the chimney filters regularly, as advised for your
                  model.
                </li>
                <li>
                  Avoid placing hot pans directly on countertops and shutters.
                </li>
                <li>
                  Do not overload drawers, baskets and wall units.
                </li>
                <li>
                  Ventilate the kitchen, especially during the monsoon.
                </li>
                <li>
                  Keep food in sealed containers and keep the kitchen clean to
                  discourage pests.
                </li>
                <li>
                  Check hinges, channels and handles occasionally, and tighten
                  if needed.
                </li>
                <li>
                  Keep your documents, specifications and warranty terms, if
                  provided, in a safe place.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Common Mistakes When Choosing a Modular Kitchen
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  Choosing the provider with the lowest price or the best
                  photographs.
                </li>
                <li>
                  Accepting a quote without measurement and a site visit.
                </li>
                <li>Not asking which materials and hardware are used.</li>
                <li>
                  Ignoring moisture protection, especially around the sink.
                </li>
                <li>Starting production without approving the design.</li>
                <li>Skipping specifications in writing.</li>
                <li>
                  Fitting cabinets before fixing leaks, damp walls and wiring.
                </li>
                <li>
                  Under-sizing the chimney or ignoring the duct route.
                </li>
                <li>
                  Forgetting waste bin, water purifier and appliance space.
                </li>
                <li>
                  Paying the full amount before checking the installation.
                </li>
                <li>
                  Hiring separate agencies for the kitchen, plumbing,
                  electrical and tile work and managing them alone.
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
                  of home and floor.
                </li>
                <li>
                  <strong>Kitchen size:</strong> Approximate dimensions and a
                  sketch or photos of the room.
                </li>
                <li>
                  <strong>Existing kitchen:</strong> What you want to keep,
                  remove or change.
                </li>
                <li>
                  <strong>Cooking style:</strong> Daily cooking, frying, number
                  of cooks and family size.
                </li>
                <li>
                  <strong>Appliances:</strong> What you already have or plan to
                  buy.
                </li>
                <li>
                  <strong>Storage needs:</strong> Groceries, utensils, crockery,
                  bulk items and appliances.
                </li>
                <li>
                  <strong>Style and colour preferences:</strong> Finishes you
                  like and reference pictures.
                </li>
                <li>
                  <strong>Budget range:</strong> The amount you are comfortable
                  spending.
                </li>
                <li>
                  <strong>Timeline:</strong> Any move-in date, festival or
                  event deadline.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                MTBOSS Services for Homeowners
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Architecture and interior:</strong> Design and
                  planning for homes and commercial spaces.
                </li>
                <li>
                  <strong>Construction and renovation:</strong> New homes,
                  extra floors, remodelling, repairs and waterproofing.
                </li>
                <li>
                  <strong>Doorstep home services:</strong> Modular kitchen,
                  carpenter, plumber, electrician, painter, tile and marble,
                  false ceiling, pest control, AC repair and building repair.
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
                Why Consider MTBOSS for a Modular Kitchen in Bareilly
              </h3>

              <p className="mb-3">
                Judge us on the same checklist as everyone else. Here is what
                we focus on.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Planning before selling:</strong> We start with your
                  space, cooking style and needs.
                </li>
                <li>
                  <strong>Written specifications:</strong> Materials, finishes,
                  timeline and payment terms are documented before work begins.
                </li>
                <li>
                  <strong>Kitchen and construction under one roof:</strong>{" "}
                  Cabinets, plumbing, electrical, tile, ceiling, painting and
                  waterproofing planned together.
                </li>
                <li>
                  <strong>Attention to humidity and pests:</strong> We consider
                  moisture, gaps and pest access as part of the design.
                </li>
                <li>
                  <strong>Free Budget Calculator:</strong> A simple starting
                  estimate for related construction work.
                </li>
                <li>
                  <strong>Single point of contact:</strong> One team handles
                  design, execution, installation and handover.
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
                Contact MTBOSS: Modular Kitchen in Bareilly
              </h3>

              <p className="mb-3">
                If you are comparing modular kitchen options in Bareilly,
                MTBOSS offers a single point of contact for design, execution,
                installation and handover, supported by a free budget
                calculator and a simple online quote request.
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
                    href="https://www.mtboss.in/quick/modular-kitchen"
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.mtboss.in/quick/modular-kitchen
                  </a>
                </li>
                <li>
                  <strong>Budget Calculator:</strong>{" "}
                  <a
                    href="https://www.mtboss.in/calculator"
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.mtboss.in/calculator
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
                    Q1. How do I find the best modular kitchen in Bareilly?
                  </strong>
                  <br />
                  Look for a provider who measures the site, plans around your
                  cooking style, names the carcass, shutter, countertop and
                  hardware in writing, shows a design before manufacturing,
                  gives an item-wise quote and supports you after installation.
                  Check past work too.
                </li>

                <li>
                  <strong>
                    Q2. Does MTBOSS provide modular kitchens in Bareilly?
                  </strong>
                  <br />
                  MTBOSS Construction Private Limited serves Moradabad and
                  Bareilly and lists Modular Kitchen among its Quick Home
                  Services. Share your kitchen details with the team to confirm
                  scope and arrangements.
                </li>

                <li>
                  <strong>Q3. Is the most expensive kitchen the best?</strong>
                  <br />
                  Not necessarily. The best kitchen has the right layout,
                  suitable materials, good hardware and careful installation
                  for your needs and budget. Compare specifications, not just
                  price.
                </li>

                <li>
                  <strong>
                    Q4. Which material is best for a modular kitchen in
                    Bareilly&apos;s humid climate?
                  </strong>
                  <br />
                  Moisture resistance matters, especially in the carcass near
                  the sink. Ask about the carcass material, edge sealing and
                  shutter finish, and get it in writing.
                </li>

                <li>
                  <strong>
                    Q5. What should I check when the kitchen is installed?
                  </strong>
                  <br />
                  Check alignment, gaps, smooth movement of drawers and doors,
                  sealed edges near the sink, a level countertop, working
                  fittings, chimney operation and a clean finish.
                </li>

                <li>
                  <strong>Q6. How long does a modular kitchen take?</strong>
                  <br />
                  It depends on design approval, site preparation,
                  manufacturing and installation. The team gives a timeline in
                  the quotation.
                </li>

                <li>
                  <strong>
                    Q7. What warranty or service terms should I ask for?
                  </strong>
                  <br />
                  Ask what is covered, for how long, what is excluded and who
                  to contact for adjustments. Get it in writing.
                </li>

                <li>
                  <strong>
                    Q8. Can MTBOSS handle plumbing, electrical and tile work as
                    well?
                  </strong>
                  <br />
                  MTBOSS lists plumber, electrician, tile and marble, false
                  ceiling and painter services among its Quick Home Services,
                  so related work can be planned together. Confirm scope with
                  the team.
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