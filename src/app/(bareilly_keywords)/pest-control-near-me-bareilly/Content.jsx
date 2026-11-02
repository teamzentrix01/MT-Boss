import React from "react";
import LandingEnquiry from "../../components/LandingEnquiry";

const Content = () => {
  return (
    <div className="min-h-screen bg-white pt-0">
      <div className="flex flex-col lg:flex-row">
        {/* Content Section */}
        <div className="order-1 flex-1 px-4 py-12 sm:px-8 md:px-16 lg:order-1">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl md:text-3xl">
            A Local Guide to Quick Help, Safe Preparation and Lasting Results
          </h2>

          <div className="max-w-4xl space-y-6 leading-relaxed text-gray-700">
            <section>
              <p>
                When you find cockroaches in the kitchen, ants in the bedroom,
                a bed bug bite or a rat in the store room, you want help close
                by and you want it soon. Searching &quot;pest control near
                me&quot; is the right first step. But nearby is only the
                starting point. The best local service also knows Bareilly&apos;s
                weather, its building styles and its seasons, explains which
                pest you have and why, tells you how to stay safe and comes
                back to check that the problem is gone.
              </p>

              <p className="mt-3">
                This page helps you search with confidence. It explains what a
                good local pest control service offers, what to do while you
                wait for help, how to check a provider before booking and how
                MTBOSS works in Bareilly. MTBOSS Construction Private Limited
                is an architect, interior designer and construction company
                serving Moradabad and Bareilly. It offers pest control,
                waterproofing, building repair, renovation and other home
                services with transparent pricing and on-time delivery.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Local Pest Control Services at a Glance
              </h3>

              <p className="mb-3">
                Here are the common problems in Bareilly homes and businesses,
                and what usually helps.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2">
                        Pest problem
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        What you notice
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Typical help
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Planning priority
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Cockroaches
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Night activity, droppings, smell in the kitchen
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Gel baiting, crack and drain treatment
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Food, drains, hiding places
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Termites
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Mud tubes, hollow wood, damaged furniture
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Wood, wall and soil treatment
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Finding the colony and entry points
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Bed bugs
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Bites, blood spots, specks on mattress
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Targeted treatment and follow-up
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Preparation, nearby furniture and rooms
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Rodents
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Droppings, gnaw marks, night sounds
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Trapping, baiting, gap sealing
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Routes, nests and entry points
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Mosquitoes
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Bites at dusk, water standing near the building
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Source removal, larvae control, spray
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Breeding spots and resting areas
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Ants
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Trails on counters and floors
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Baiting and crack treatment
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Food source and nest
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Flies
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Kitchens, waste areas, restaurants
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Hygiene, waste management, spray
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Source of waste
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Spiders, silverfish and lizards
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Corners, books, cupboards
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Cleaning, targeted treatment
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Clutter and humidity
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-3">
                Your property, pest and budget matter more than any template.
                MTBOSS helps you plan a treatment that suits the actual
                condition of your home or business.
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
                  A project gallery and blog on the website let prospective
                  clients review completed work.
                </li>
              </ul>

              <p className="mt-3">
                Pest control is listed among the Quick Home Services on our
                website, alongside painter, plumber, electrician, AC repair and
                building repair.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Pest Control Services Offered by MTBOSS for Bareilly Clients
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Site visit and pest inspection:</strong> Checking
                  kitchens, bathrooms, drains, beds, wood, ceilings, stores and
                  outside areas.
                </li>
                <li>
                  <strong>Pest identification:</strong> Confirming which pest
                  it is before choosing a method.
                </li>
                <li>
                  <strong>General pest control:</strong> Cockroaches, ants,
                  spiders, silverfish and other crawling insects.
                </li>
                <li>
                  <strong>Anti-termite treatment:</strong> Treating existing
                  buildings and planning protection for new construction.
                </li>
                <li>
                  <strong>Bed bug treatment:</strong> Targeted treatment of
                  beds, sofas and cracks, with preparation guidance and
                  follow-up.
                </li>
                <li>
                  <strong>Rodent control:</strong> Trapping, baiting in secured
                  stations and sealing entry points.
                </li>
                <li>
                  <strong>Mosquito control:</strong> Source removal, larvae
                  control and treatment of resting areas.
                </li>
                <li>
                  <strong>Commercial pest control:</strong> Planned treatment
                  for restaurants, shops, offices, warehouses, schools and
                  hotels.
                </li>
                <li>
                  <strong>Crack and gap sealing:</strong> Closing hiding spots
                  and entry points with our building repair team.
                </li>
                <li>
                  <strong>Moisture and leak correction:</strong> Fixing the
                  damp that supports many pests, with our plumbing and
                  waterproofing services.
                </li>
                <li>
                  <strong>Follow-up visit and advice:</strong> Checking results
                  and giving prevention tips.
                </li>
                <li>
                  <strong>Related home services:</strong> Painter, plumber,
                  carpenter, tile and marble work and building repair through
                  the same company.
                </li>
              </ul>

              <p className="mt-3">
                Final scope for each project is discussed and confirmed with
                the MTBOSS team before work begins.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                What &quot;Near Me&quot; Should Really Mean
              </h3>

              <p className="mb-3">
                Distance helps, but it is only one part of a good local
                service.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Reachable for a site visit:</strong> A local team can
                  inspect your property without long delays, so the problem
                  does not grow.
                </li>
                <li>
                  <strong>Knows local conditions:</strong> Bareilly&apos;s
                  monsoon, summer heat, winter damp and typical building styles
                  all affect which pests appear and which treatment works.
                </li>
                <li>
                  <strong>Clear communication:</strong> You can call, message
                  and get answers in a language you are comfortable with.
                </li>
                <li>
                  <strong>Explains the pest and the plan:</strong> You
                  understand what is being treated and why.
                </li>
                <li>
                  <strong>Visible track record:</strong> A project gallery,
                  reviews or past work you can check.
                </li>
                <li>
                  <strong>Accountability:</strong> A real office address and a
                  team you can reach if something goes wrong.
                </li>
                <li>
                  <strong>Complete service:</strong> One team that can treat
                  the pest, seal the gaps and repair the damage, so you do not
                  chase several agencies.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                What to Do Right Now While You Wait for Help
              </h3>

              <p className="mb-3">
                These steps reduce the problem and protect your family. They
                are temporary measures, not a cure.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Do not spray everything:</strong> Random spraying can
                  scatter pests and make professional treatment harder.
                </li>
                <li>
                  <strong>Protect food:</strong> Cover or store food, grain,
                  pet food and snacks in sealed containers.
                </li>
                <li>
                  <strong>Clean the area:</strong> Wipe counters, sweep crumbs
                  and empty bins, but avoid heavy cleaning of spots where you
                  suspect nests until the inspection.
                </li>
                <li>
                  <strong>Keep children and pets away:</strong> Do not let them
                  touch pest droppings, traps, bait or any chemicals.
                </li>
                <li>
                  <strong>Dry the damp:</strong> Fix leaking taps, empty cooler
                  trays and plant saucers and remove standing water.
                </li>
                <li>
                  <strong>Photograph the problem:</strong> Take clear photos or
                  short videos of the pest, droppings, bites or damage. They
                  help the inspection.
                </li>
                <li>
                  <strong>Note when and where:</strong> Write down where you
                  see activity and at what time of day.
                </li>
                <li>
                  <strong>For bed bugs:</strong> Do not move bedding, clothes
                  or furniture to other rooms, because this can spread them.
                </li>
                <li>
                  <strong>For rodents:</strong> Do not touch droppings or dead
                  rodents with bare hands, and keep children and pets away.
                </li>
                <li>
                  <strong>For termites:</strong> Do not disturb mud tubes or
                  damaged wood, and avoid moving infested furniture to new
                  places before inspection.
                </li>
                <li>
                  <strong>For bites, allergies or a strong reaction:</strong>{" "}
                  See a doctor. Pest control does not replace medical advice.
                </li>
                <li>
                  <strong>Call for an inspection:</strong> The sooner the pest
                  and its source are identified, the easier the treatment.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                How to Check a Local Pest Control Provider
              </h3>

              <p className="mb-3">
                Before you book anyone, including us, check these points.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Do they inspect before quoting?</strong> A reliable
                  team visits first.
                </li>
                <li>
                  <strong>Do they identify the pest?</strong> You should hear
                  which pest it is and where it lives.
                </li>
                <li>
                  <strong>Do they explain the method?</strong> The method
                  should match the pest and the property.
                </li>
                <li>
                  <strong>Do they talk about safety?</strong> Ask for specific
                  preparation and re-entry instructions for children, elderly
                  family members and pets.
                </li>
                <li>
                  <strong>Do they put it in writing?</strong> Scope, method,
                  visits, timeline and payment stages should be documented.
                </li>
                <li>
                  <strong>Do they plan follow-up?</strong> Many pests need a
                  second check.
                </li>
                <li>
                  <strong>Can you see past work?</strong> Photos or a gallery
                  help you judge quality.
                </li>
                <li>
                  <strong>Do they have a real address?</strong> An office you
                  can visit adds accountability.
                </li>
                <li>
                  <strong>Do they handle repair?</strong> Sealing cracks and
                  fixing damp saves you coordination.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Warning Signs of a Weak Local Service
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  Quotes a price over the phone without seeing the property.
                </li>
                <li>
                  Promises &quot;100% guaranteed forever&quot; without a
                  written scope.
                </li>
                <li>
                  Sprays the same product in every room regardless of the pest.
                </li>
                <li>
                  Refuses to name products or explain safety steps.
                </li>
                <li>Pushes you to decide immediately.</li>
                <li>Offers no follow-up visit.</li>
                <li>Ignores moisture, cracks and food access.</li>
                <li>Cannot be reached after the job.</li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Read the Property Before Choosing the Treatment
              </h3>

              <p className="mb-3">
                The spray, bait or trap is only one part of the plan. What you
                find during inspection decides the result.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Identify the pest:</strong> Cockroaches, termites,
                  bed bugs, rodents and mosquitoes all need different methods.
                </li>
                <li>
                  <strong>Find the source:</strong> Check drains, cracks,
                  ducts, pipe gaps, tanks and outside walls.
                </li>
                <li>
                  <strong>Check moisture:</strong> Damp walls, leaking pipes
                  and standing water attract many pests.
                </li>
                <li>
                  <strong>Look at food and waste:</strong> Open food,
                  uncovered bins and clutter feed infestations.
                </li>
                <li>
                  <strong>Inspect wood and furniture:</strong> Doors, frames,
                  beds and cupboards show termite and bed bug signs.
                </li>
                <li>
                  <strong>Study hidden spaces:</strong> False ceilings, ducts,
                  behind cabinets and under stairs.
                </li>
                <li>
                  <strong>Look at the outside:</strong> Gardens, waste areas,
                  drains and neighbouring properties.
                </li>
                <li>
                  <strong>Note who lives there:</strong> Children, elderly
                  family members, pets, fish tanks and people with allergies.
                </li>
                <li>
                  <strong>Review past treatment:</strong> Earlier sprays may
                  have scattered the pests.
                </li>
              </ul>

              <p className="mt-3">
                Because many pests depend on damp, gaps and cracks, pest
                control often goes together with repair and waterproofing.
                MTBOSS can plan both under one roof.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Planning by Property Type
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Independent house or villa:</strong> Kitchens,
                  bathrooms, gardens, wooden fixtures, roof spaces and
                  boundaries need attention in a planned order.
                </li>
                <li>
                  <strong>Apartment or flat:</strong> Pests move between flats
                  through pipes and shafts, so coordinate with neighbours or
                  the society.
                </li>
                <li>
                  <strong>Newly built or renovated home:</strong> Plan
                  anti-termite and rodent proofing as part of the project.
                </li>
                <li>
                  <strong>Restaurant, cafe or canteen:</strong> Hygiene rules
                  matter. Treatment is planned around food handling and working
                  hours.
                </li>
                <li>
                  <strong>Shop, showroom and office:</strong> Pantries, storage
                  rooms, wiring and wet areas are common problem points.
                  Schedule treatment outside business hours.
                </li>
                <li>
                  <strong>Hostel, PG and guest house:</strong> Many rooms and
                  shared spaces make spread easy. A coordinated, room-by-room
                  plan works best.
                </li>
                <li>
                  <strong>Warehouse and godown:</strong> Stored goods and large
                  spaces need rodent and insect control plus proofing.
                </li>
                <li>
                  <strong>School, clinic and hospital:</strong> Choose
                  treatments and timing carefully, with attention to occupants.
                </li>
                <li>
                  <strong>Rental property:</strong> Regular treatment between
                  tenants keeps the property in good condition.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Bareilly Planning Notes for Pest Control
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Monsoon season:</strong> Humidity and rain push
                  cockroaches, ants, mosquitoes, termites and rodents indoors.
                  Plan treatment before or early in the rains.
                </li>
                <li>
                  <strong>Summer heat:</strong> Pests seek water and cool
                  spots, often drains and bathrooms. Coolers and stored water
                  can breed mosquitoes.
                </li>
                <li>
                  <strong>Winter:</strong> Cold weather drives rodents and
                  cockroaches to warm corners, and bed bugs can persist in
                  closed rooms.
                </li>
                <li>
                  <strong>Older buildings:</strong> Cracks, old woodwork and
                  expired protection give pests places to hide and enter.
                </li>
                <li>
                  <strong>Construction and renovation:</strong> Open walls, new
                  woodwork and stored materials can attract termites and
                  rodents.
                </li>
                <li>
                  <strong>Gardens, drains and markets:</strong> Vegetation,
                  standing water and waste increase pressure on nearby homes
                  and shops.
                </li>
                <li>
                  <strong>Apartment living:</strong> Shared pipes and shafts
                  let pests travel, so treat the whole line where possible.
                </li>
                <li>
                  <strong>Festival and wedding seasons:</strong> Guests, extra
                  bedding, large cooking and food storage increase risk. Treat
                  well before events, with time to air and clean the home.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Choose Your Pest Control Package
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Essential home package:</strong> General treatment
                  for cockroaches, ants and common crawling insects.
                </li>
                <li>
                  <strong>Kitchen focus package:</strong> Gel baiting, drain
                  and crack treatment.
                </li>
                <li>
                  <strong>Anti-termite package:</strong> Inspection and
                  treatment of wood, walls and soil.
                </li>
                <li>
                  <strong>Bed bug package:</strong> Targeted treatment with
                  preparation guidance and follow-up.
                </li>
                <li>
                  <strong>Rodent control package:</strong> Trapping, secured
                  stations and proofing of entry points.
                </li>
                <li>
                  <strong>Mosquito control package:</strong> Source removal,
                  larvae control and treatment of resting areas.
                </li>
                <li>
                  <strong>Commercial package:</strong> Planned treatment for
                  shops, offices, restaurants and warehouses.
                </li>
                <li>
                  <strong>Hostel and guest house package:</strong> Room-by-room
                  scheduled treatment.
                </li>
                <li>
                  <strong>Annual service plan:</strong> Regular visits for
                  prevention and early detection.
                </li>
                <li>
                  <strong>Repair and proofing add-on:</strong> Sealing cracks,
                  gaps and damp points.
                </li>
              </ul>

              <p className="mt-3">
                Scope and specifications are agreed in writing before work
                begins, so you know exactly what is included.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Factors That Affect Pest Control Cost in Bareilly
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Type of pest:</strong> Cockroach, termite, bed bug,
                  rodent and mosquito treatments are priced differently.
                </li>
                <li>
                  <strong>Severity of infestation:</strong> A new problem costs
                  less than an established one.
                </li>
                <li>
                  <strong>Property size:</strong> Larger homes and commercial
                  spaces need more time and material.
                </li>
                <li>
                  <strong>Number of rooms and areas:</strong> Kitchens,
                  bathrooms, store rooms, gardens and terraces all count.
                </li>
                <li>
                  <strong>Treatment method:</strong> Gel baiting, spray,
                  injection, trapping and larvae control differ in cost.
                </li>
                <li>
                  <strong>Number of visits:</strong> Some pests, such as bed
                  bugs and termites, need follow-up.
                </li>
                <li>
                  <strong>Access and preparation:</strong> Cluttered rooms,
                  fitted furniture and locked areas take longer.
                </li>
                <li>
                  <strong>Repairs and proofing:</strong> Sealing cracks and
                  fixing damp adds to the budget.
                </li>
                <li>
                  <strong>Commercial requirements:</strong> Food safety rules,
                  night work and scheduled plans affect planning.
                </li>
                <li>
                  <strong>Service plan:</strong> Annual plans may cost less per
                  visit than repeated one-off treatment.
                </li>
              </ul>

              <p className="mt-3">
                Your actual quote depends on inspection findings. Request a
                detailed quote after the site visit, and use the free MTBOSS
                Budget Calculator on the website for related construction work.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Budget Priorities for Pest Control
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>First:</strong> Identify the pest and treat the
                  active problem. Delay lets it spread.
                </li>
                <li>
                  <strong>Second:</strong> Find and remove the source. Nests,
                  moisture and food access keep pests coming back.
                </li>
                <li>
                  <strong>Third:</strong> Treat the highest-risk areas.
                  Kitchens, bathrooms, beds, wood, stores and drains usually
                  come first.
                </li>
                <li>
                  <strong>Fourth:</strong> Seal entry points. Cracks, pipe gaps
                  and damaged frames let pests return.
                </li>
                <li>
                  <strong>Fifth:</strong> Fix moisture and drainage. Dry homes
                  are harder for most pests to live in.
                </li>
                <li>
                  <strong>Sixth:</strong> Follow up. A second check confirms
                  the treatment worked.
                </li>
                <li>
                  <strong>Seventh:</strong> Plan prevention. Regular inspection
                  and good habits protect your investment.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                How MTBOSS Works with Bareilly Clients
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Step 1 — Enquiry and discussion:</strong> Contact
                  MTBOSS through the website, phone or WhatsApp and share the
                  pest problem, the property and your budget.
                </li>
                <li>
                  <strong>Step 2 — Photos and details:</strong> Send photos of
                  the pests, droppings, bites or damage, along with your
                  locality in Bareilly.
                </li>
                <li>
                  <strong>Step 3 — Site visit and inspection:</strong> The team
                  checks rooms, drains, cracks, wood, ceilings and outside
                  areas. Share your locality, and the team will confirm
                  arrangements.
                </li>
                <li>
                  <strong>Step 4 — Pest identification and diagnosis:</strong>{" "}
                  You and the team confirm which pest it is and where it lives.
                </li>
                <li>
                  <strong>Step 5 — Treatment recommendation:</strong> The team
                  explains the suggested method and why it suits the pest and
                  property.
                </li>
                <li>
                  <strong>Step 6 — Itemised estimate:</strong> A clear scope
                  and an item-wise cost outline are prepared.
                </li>
                <li>
                  <strong>Step 7 — Specifications and agreement:</strong> Scope,
                  method, number of visits, timeline and payment terms are
                  written down before work begins.
                </li>
                <li>
                  <strong>Step 8 — Preparation guidance:</strong> You are told
                  how to prepare food, utensils, bedding, pets and plants.
                </li>
                <li>
                  <strong>Step 9 — Treatment application:</strong> The chosen
                  method is carried out in the agreed areas.
                </li>
                <li>
                  <strong>Step 10 — Entry-point and repair advice:</strong>{" "}
                  Gaps, cracks and damp points are flagged, and repair can be
                  arranged through our building repair team.
                </li>
                <li>
                  <strong>Step 11 — Safety instructions:</strong> You are told
                  how long to stay away from treated areas and how to ventilate
                  and clean afterwards.
                </li>
                <li>
                  <strong>Step 12 — Follow-up and inspection:</strong> A
                  follow-up check confirms results and handles any remaining
                  activity.
                </li>
                <li>
                  <strong>Step 13 — After-treatment support:</strong> Painter,
                  plumber, carpenter and building repair services are available
                  for related fixes.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                How to Prepare Your Home or Office
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  Remove or tightly cover food, utensils and cooking items, as
                  advised.
                </li>
                <li>
                  Empty kitchen cabinets and drawers when asked, so hiding
                  places can be treated.
                </li>
                <li>
                  Wash and bag bedding and clothes before bed bug treatment.
                </li>
                <li>
                  Move furniture slightly away from walls so edges and cracks
                  are reachable.
                </li>
                <li>
                  Clear clutter, cartons and old newspapers from stores and
                  under sinks.
                </li>
                <li>
                  Keep children, elderly family members and pets out of treated
                  areas for the time advised.
                </li>
                <li>Cover or move fish tanks, pet food and bowls.</li>
                <li>
                  Clear access to store rooms, terraces, ceilings, tank rooms
                  and gardens.
                </li>
                <li>Secure valuables and sensitive electronics.</li>
                <li>
                  Ask about the products used and follow the safety
                  instructions provided.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Care After Pest Control
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  Ventilate treated rooms before returning, as advised.
                </li>
                <li>
                  Avoid wet-mopping treated cracks and baiting points for the
                  recommended period.
                </li>
                <li>
                  Keep food in sealed containers and clean spills quickly.
                </li>
                <li>Empty bins daily and keep kitchen drains clean.</li>
                <li>
                  Fix leaking taps, pipes and damp patches, and empty cooler
                  trays and plant saucers regularly.
                </li>
                <li>Seal gaps around pipes, doors and windows.</li>
                <li>
                  Avoid storing cardboard, old newspapers and clutter near
                  walls.
                </li>
                <li>
                  Inspect beds, wooden furniture, door frames, kitchen and
                  ceilings regularly.
                </li>
                <li>
                  Report heavy activity after the advised period so the team
                  can check.
                </li>
                <li>
                  Book follow-up visits and seasonal checks as recommended.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Common Mistakes When Searching for Local Pest Control
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  Choosing a provider only because they are the closest or the
                  cheapest.
                </li>
                <li>
                  Accepting a quote over the phone without a site visit.
                </li>
                <li>
                  Spraying store-bought products before the visit and
                  scattering the pests.
                </li>
                <li>Skipping preparation and safety instructions.</li>
                <li>
                  Not telling the provider about children, pets, allergies or
                  fish tanks.
                </li>
                <li>
                  Treating only what you see and ignoring the source.
                </li>
                <li>Ignoring moisture, leaks and drainage problems.</li>
                <li>
                  Expecting results in a day and skipping the follow-up.
                </li>
                <li>
                  Treating one flat in an apartment where pests travel between
                  units.
                </li>
                <li>
                  Hiring separate agencies for pest control, repair and
                  painting and managing them alone.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                What to Share When You Call
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Property details:</strong> Locality in Bareilly, type
                  of property and approximate size.
                </li>
                <li>
                  <strong>Pest details:</strong> What you see, where, when and
                  how often.
                </li>
                <li>
                  <strong>Photos and videos:</strong> Pests, droppings, bites,
                  damage or standing water.
                </li>
                <li>
                  <strong>History:</strong> How long the problem has existed
                  and any earlier treatment.
                </li>
                <li>
                  <strong>Occupants:</strong> Children, elderly family members,
                  pets, plants, fish tanks and people with allergies.
                </li>
                <li>
                  <strong>Areas to treat:</strong> Kitchen, bedrooms,
                  bathrooms, store room, garden, terrace, ceilings or whole
                  building.
                </li>
                <li>
                  <strong>Budget range:</strong> The amount you are comfortable
                  spending.
                </li>
                <li>
                  <strong>Timeline:</strong> Any move-in, event, inspection or
                  festival deadline.
                </li>
                <li>
                  <strong>Access details:</strong> Floor, stairs, parking and
                  any society rules.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                MTBOSS Services for Homeowners and Building Owners
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Construction and renovation:</strong> New homes,
                  extra floors, remodelling, repairs and waterproofing.
                </li>
                <li>
                  <strong>Doorstep home services:</strong> Pest control,
                  painter, electrician, plumber, carpenter, AC repair, tile and
                  marble work and building repair.
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
                Why Choose MTBOSS for Pest Control Near You in Bareilly
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Inspection first:</strong> We identify the pest and
                  find the source before recommending a treatment.
                </li>
                <li>
                  <strong>Local reach:</strong> We serve Moradabad and
                  Bareilly, and you can contact us by phone, WhatsApp, email or
                  the website.
                </li>
                <li>
                  <strong>Right method for the pest:</strong> Cockroaches,
                  termites, bed bugs, rodents and mosquitoes are not treated
                  the same way.
                </li>
                <li>
                  <strong>Written scope:</strong> Method, visits, timeline and
                  payment terms are documented before work begins.
                </li>
                <li>
                  <strong>Builder and repair team together:</strong> Pest
                  treatment, crack sealing, waterproofing and repair planned as
                  one job.
                </li>
                <li>
                  <strong>Free Budget Calculator:</strong> A simple starting
                  estimate for related construction work.
                </li>
                <li>
                  <strong>Single point of contact:</strong> One team handles
                  inspection, treatment, follow-up and repairs.
                </li>
                <li>
                  <strong>On-time delivery focus:</strong> Work is scheduled in
                  sequence to avoid repeat visits.
                </li>
                <li>
                  <strong>Real office and visible work:</strong> A company
                  based on Kanth Road, Moradabad, with a project gallery and
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
                Contact MTBOSS: Pest Control Near You in Bareilly
              </h3>

              <p className="mb-3">
                If you are searching for pest control near you in Bareilly,
                MTBOSS offers a single point of contact for inspection,
                treatment, follow-up and repair, supported by a free budget
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
                    href="https://www.mtboss.in/quick/pest-control"
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.mtboss.in/quick/pest-control
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
                    Q1. How do I find good pest control near me in Bareilly?
                  </strong>
                  <br />
                  Look for a team that inspects before quoting, identifies the
                  pest, explains the method and safety steps, gives a written
                  quote, plans follow-up and has a real office and phone
                  support. Check past work too.
                </li>

                <li>
                  <strong>
                    Q2. Does MTBOSS provide pest control services in Bareilly?
                  </strong>
                  <br />
                  MTBOSS Construction Private Limited serves Moradabad and
                  Bareilly and lists pest control among its Quick Home
                  Services. Share your property details with the team to
                  confirm scope and arrangements.
                </li>

                <li>
                  <strong>Q3. Which pests can be treated?</strong>
                  <br />
                  Common household and commercial pests such as cockroaches,
                  ants, termites, bed bugs, rodents, mosquitoes and flies,
                  subject to inspection and scope.
                </li>

                <li>
                  <strong>
                    Q4. What should I do before the team arrives?
                  </strong>
                  <br />
                  Keep food covered, keep children and pets away from affected
                  areas, fix leaks and standing water, take photos of the
                  problem and do not spray random products. For bed bugs, do
                  not move bedding or furniture between rooms.
                </li>

                <li>
                  <strong>
                    Q5. Is pest control safe for children and pets?
                  </strong>
                  <br />
                  Safety depends on the product, method and your preparation.
                  Ask the provider for specific instructions about keeping
                  children, elderly family members and pets away and
                  ventilating afterwards, and follow them.
                </li>

                <li>
                  <strong>Q6. Can I send photos before the visit?</strong>
                  <br />
                  Yes. Photos help the team understand the problem and prepare,
                  but the final diagnosis is made at the site.
                </li>

                <li>
                  <strong>Q7. How many visits will I need?</strong>
                  <br />
                  It depends on the pest and severity. Cockroaches and ants may
                  need one treatment with a check, while bed bugs, termites and
                  rodents often need follow-up visits.
                </li>

                <li>
                  <strong>Q8. Will pests come back after treatment?</strong>
                  <br />
                  They can if the source, moisture, food access or entry points
                  are not addressed. Follow-up visits, hygiene and sealing
                  cracks help prevent a return.
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