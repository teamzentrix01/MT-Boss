import React from "react";
import LandingEnquiry from "../../components/LandingEnquiry";

const Content = () => {
  return (
    <div className="min-h-screen bg-white pt-0">
      <div className="flex flex-col lg:flex-row">
        {/* Content Section */}
        <div className="order-1 flex-1 px-4 py-12 sm:px-8 md:px-16 lg:order-1">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl md:text-3xl">
            A Room-by-Room Guide to Keeping Your House Pest-Free
          </h2>

          <div className="max-w-4xl space-y-6 leading-relaxed text-gray-700">
            <section>
              <p>
                A home does not have one pest problem. It has several, and each
                room attracts different pests for different reasons. The
                kitchen draws cockroaches and ants because of food and water.
                The bedroom may host bed bugs. The bathroom and drains invite
                cockroaches, mosquitoes and silverfish. Wooden doors, wardrobes
                and false ceilings are where termites and rodents hide. A spray
                in one room does not protect the rest of the house.
              </p>

              <p className="mt-3">
                Good home pest control in Bareilly looks at the whole house,
                room by room, and connects the dots: which pest is where, how
                it entered, what it feeds on and how to stop it coming back.
                This page walks through each part of the home, explains how
                treatment is planned and shows what MTBOSS offers. MTBOSS
                Construction Private Limited is an architect, interior designer
                and construction company serving Moradabad and Bareilly. It
                offers pest control, waterproofing, building repair, renovation
                and other home services with transparent pricing and on-time
                delivery.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Home Pest Control at a Glance: Room by Room
              </h3>

              <p className="mb-3">
                Your house, family and budget matter more than any template.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2">
                        Part of the home
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Common pests
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Typical treatment
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Planning priority
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Kitchen
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Cockroaches, ants, flies, rodents
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Gel baiting, crack and drain treatment
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Food storage, drains, gaps behind appliances
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Bedroom
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Bed bugs, ants, spiders, mosquitoes
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Targeted treatment, preparation, follow-up
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Mattress seams, bed frame, cracks
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Bathroom and utility
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Cockroaches, mosquitoes, silverfish, drain flies
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Drain and crack treatment
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Moisture, floor traps, pipe gaps
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Living room and sofa
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Ants, spiders, bed bugs, termites
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Targeted and crack treatment
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Furniture, skirting, wood
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Store room and pantry
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Rodents, cockroaches, silverfish, grain pests
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Trapping, proofing, sealing
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Clutter, cartons, stored food
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Wardrobes, doors and wooden fixtures
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Termites, silverfish, powderpost beetles
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Wood and wall treatment
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Hidden damage, moisture
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Balcony, terrace and garden
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Mosquitoes, ants, termites, rodents
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Water control, outside treatment
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Standing water, vegetation, drains
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Ceilings and roof spaces
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Rodents, lizards, wasps
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Inspection, proofing, trapping
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Entry points, wiring
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-3">
                Your house, family and budget matter more than any template.
                MTBOSS helps you plan a treatment that suits the actual
                condition of your home.
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
                Home Pest Control Services Offered by MTBOSS for Bareilly
                Clients
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Site visit and home inspection:</strong> Checking
                  kitchens, bathrooms, bedrooms, living areas, stores, drains,
                  wood, ceilings and outside spaces.
                </li>
                <li>
                  <strong>Pest identification:</strong> Confirming which pests
                  are present and where they live.
                </li>
                <li>
                  <strong>General pest control for homes:</strong>{" "}
                  Cockroaches, ants, spiders, silverfish and other crawling
                  insects.
                </li>
                <li>
                  <strong>Anti-termite treatment:</strong> Treating existing
                  homes and planning protection for new construction or extra
                  floors.
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
                  <strong>Mosquito control for homes and gardens:</strong>{" "}
                  Source removal, larvae control and treatment of resting
                  areas.
                </li>
                <li>
                  <strong>Kitchen and drain treatment:</strong> Gel baiting,
                  crack treatment and drain care.
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
                Pest Control for Your Kitchen
              </h3>

              <p className="mb-3">
                The kitchen is the most common starting point because it offers
                food, water and warmth.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Common pests:</strong> Cockroaches, ants, flies,
                  rodents and grain pests.
                </li>
                <li>
                  <strong>Hiding places:</strong> Behind the stove and fridge,
                  inside cabinet hinges and back panels, under the sink, around
                  pipe entries and in drain pipes.
                </li>
                <li>
                  <strong>What helps:</strong> Gel baiting in hiding spots,
                  crack and crevice treatment, drain treatment and sealing
                  gaps.
                </li>
                <li>
                  <strong>What you can do:</strong> Store food and grain in
                  sealed containers, wipe the platform nightly, keep bins
                  covered and fix leaking taps.
                </li>
                <li>
                  <strong>What to avoid:</strong> Spraying open surfaces
                  randomly and mixing store-bought products with professional
                  treatment.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Pest Control for Your Bedroom
              </h3>

              <p className="mb-3">
                The bedroom needs careful, targeted treatment because of the
                time you spend there.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Common pests:</strong> Bed bugs, ants, spiders,
                  mosquitoes and silverfish.
                </li>
                <li>
                  <strong>Hiding places:</strong> Mattress seams, bed frame
                  joints, headboards, bedside tables, wall cracks and behind
                  switchboards.
                </li>
                <li>
                  <strong>What helps:</strong> Inspection, targeted treatment
                  of seams and cracks, preparation of bedding and a follow-up
                  visit.
                </li>
                <li>
                  <strong>What you can do:</strong> Wash bedding on a hot
                  setting where the fabric allows, keep clothes and bags off
                  the floor, vacuum seams and inspect after travel.
                </li>
                <li>
                  <strong>What to avoid:</strong> Moving bedding or furniture
                  to other rooms before treatment, and using foggers that
                  scatter bed bugs.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Pest Control for Bathrooms, Drains and Utility Areas
              </h3>

              <p className="mb-3">
                Moisture makes these areas attractive to many pests.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Common pests:</strong> Cockroaches, mosquitoes,
                  silverfish and drain flies.
                </li>
                <li>
                  <strong>Hiding places:</strong> Floor traps, drain pipes,
                  pipe sleeves, damp corners and under sinks.
                </li>
                <li>
                  <strong>What helps:</strong> Drain treatment, crack sealing,
                  fixing leaks and keeping floors dry.
                </li>
                <li>
                  <strong>What you can do:</strong> Keep floor traps covered,
                  clean drains, fix dripping taps and ventilate the room.
                </li>
                <li>
                  <strong>What to avoid:</strong> Leaving standing water, wet
                  laundry and damp clutter.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Pest Control for Living Rooms, Sofas and Furniture
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Common pests:</strong> Ants, spiders, bed bugs,
                  termites and carpet beetles.
                </li>
                <li>
                  <strong>Hiding places:</strong> Sofa seams and frames,
                  skirting boards, door and window frames, behind furniture and
                  in cracks.
                </li>
                <li>
                  <strong>What helps:</strong> Targeted treatment of furniture
                  and cracks, with wood treatment where termites are found.
                </li>
                <li>
                  <strong>What you can do:</strong> Move furniture
                  occasionally, vacuum seams and check wooden items for mud
                  tubes or hollow sounds.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Pest Control for Store Rooms, Pantries and Wardrobes
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Common pests:</strong> Rodents, cockroaches,
                  silverfish, grain pests and termites.
                </li>
                <li>
                  <strong>Hiding places:</strong> Cartons, sacks, old
                  newspapers, clothes, behind shelves and in dark corners.
                </li>
                <li>
                  <strong>What helps:</strong> Decluttering, sealed storage,
                  trapping where needed and proofing of gaps.
                </li>
                <li>
                  <strong>What you can do:</strong> Use airtight containers,
                  avoid storing cardboard on the floor and clear the room
                  regularly.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Pest Control for Doors, Frames and Wooden Fixtures
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Common pests:</strong> Termites and other
                  wood-damaging insects.
                </li>
                <li>
                  <strong>Signs:</strong> Hollow sounds, mud tubes, crumbling
                  wood, discarded wings and bubbling paint.
                </li>
                <li>
                  <strong>What helps:</strong> Termite inspection, wood and
                  wall treatment and, where damage is serious, carpenter
                  repair.
                </li>
                <li>
                  <strong>What you can do:</strong> Fix leaks and damp near
                  wooden items, and inspect doors and wardrobes yearly.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Pest Control for Balcony, Terrace and Garden
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Common pests:</strong> Mosquitoes, ants, termites,
                  rodents and wasps.
                </li>
                <li>
                  <strong>Problem spots:</strong> Plant trays, coolers, clogged
                  outlets, discarded containers, dense shrubs and buried wood.
                </li>
                <li>
                  <strong>What helps:</strong> Removing or treating standing
                  water, trimming vegetation and treating resting areas and
                  mounds.
                </li>
                <li>
                  <strong>What you can do:</strong> Empty trays and coolers
                  every few days, clear drains and keep plants away from walls.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Pest Control for Ceilings and Roof Spaces
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Common pests:</strong> Rodents, lizards, wasps and
                  sometimes bats.
                </li>
                <li>
                  <strong>Signs:</strong> Night scratching sounds, droppings,
                  gnaw marks, bad smells and electrical faults.
                </li>
                <li>
                  <strong>What helps:</strong> Inspection, trapping, entry
                  point sealing and, where needed, electrical checks.
                </li>
                <li>
                  <strong>What you can do:</strong> Seal visible gaps, trim
                  overhanging branches and report sounds early.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Read Your Home Before Choosing the Treatment
              </h3>

              <p className="mb-3">
                The spray is only one part of the plan. What you find during
                inspection decides the result.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Identify every pest:</strong> A home may have more
                  than one problem.
                </li>
                <li>
                  <strong>Map the activity:</strong> Which rooms, and where in
                  each room?
                </li>
                <li>
                  <strong>Check the moisture:</strong> Leaking pipes, damp
                  walls and standing water invite pests.
                </li>
                <li>
                  <strong>Look at food, waste and clutter:</strong> These feed
                  and shelter pests.
                </li>
                <li>
                  <strong>Inspect wood and furniture:</strong> Doors, frames,
                  beds and wardrobes show termite and bed bug signs.
                </li>
                <li>
                  <strong>Study entry points:</strong> Pipe sleeves, drains,
                  vents, door gaps and wall cracks.
                </li>
                <li>
                  <strong>Check hidden spaces:</strong> False ceilings, ducts,
                  under-stair spaces and behind cabinets.
                </li>
                <li>
                  <strong>Look at the outside:</strong> Gardens, drains, waste
                  areas and neighbouring properties.
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
                Because many household pests depend on damp, gaps and cracks,
                home pest control often goes together with repair and
                waterproofing. MTBOSS can plan both under one roof.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Planning by Type of Home
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Independent house or villa:</strong> Plan treatment
                  for each room, the garden, boundary and roof spaces in a
                  priority order.
                </li>
                <li>
                  <strong>Apartment or flat:</strong> Pests travel through
                  pipes, shafts and shared walls, so coordinate with
                  neighbours or the society.
                </li>
                <li>
                  <strong>Newly built home:</strong> Plan anti-termite and
                  rodent proofing as part of the project.
                </li>
                <li>
                  <strong>Home under renovation:</strong> Open walls, new
                  woodwork and stored materials can attract termites and
                  rodents.
                </li>
                <li>
                  <strong>Older home:</strong> Cracks, old woodwork and worn
                  plaster give pests many places to live, so inspection and
                  proofing are important.
                </li>
                <li>
                  <strong>Rented home:</strong> Treat between tenants and
                  document the work.
                </li>
                <li>
                  <strong>
                    Home with children or elderly family members:
                  </strong>{" "}
                  Ask for clear preparation and re-entry instructions, and use
                  targeted methods where possible.
                </li>
                <li>
                  <strong>Home with pets:</strong> Ask how to protect pets, pet
                  food and water, and keep them away from treated areas as
                  advised.
                </li>
                <li>
                  <strong>Home with a kitchen garden or plants:</strong> Tell
                  the team so methods and products can be chosen carefully.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                A Seasonal Home Pest Control Calendar for Bareilly
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Before the monsoon (April to June):</strong> Inspect
                  for termites and rodent entry points, clear drains, fix
                  leaks, cover tanks and treat the kitchen and drains.
                </li>
                <li>
                  <strong>Monsoon (July to September):</strong> Watch for
                  cockroaches, ants, mosquitoes and termites. Empty cooler
                  trays, clear outlets and keep food sealed.
                </li>
                <li>
                  <strong>After the monsoon (October to November):</strong>{" "}
                  Check basements, ceilings, wooden fixtures and damp walls,
                  and book a follow-up inspection.
                </li>
                <li>
                  <strong>Winter (December to February):</strong> Check for
                  rodents and cockroaches seeking warmth, and inspect beds and
                  sofas for bed bugs.
                </li>
                <li>
                  <strong>Festival and wedding seasons:</strong> Guests,
                  bedding and cooking increase risk. Treat before the event,
                  with time to air and clean the home.
                </li>
                <li>
                  <strong>Before and after travel or moving house:</strong>{" "}
                  Inspect luggage, furniture and bedding.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Bareilly Planning Notes for Home Pest Control
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Monsoon season:</strong> Humidity and rain push pests
                  indoors. Plan treatment before or early in the rains.
                </li>
                <li>
                  <strong>Summer heat:</strong> Pests seek water and cool
                  spots, often drains, bathrooms and coolers.
                </li>
                <li>
                  <strong>Winter:</strong> Rodents and cockroaches move to warm
                  corners, and bed bugs persist in closed rooms.
                </li>
                <li>
                  <strong>Older buildings:</strong> Cracks, old woodwork and
                  expired protection give pests easy routes.
                </li>
                <li>
                  <strong>Gardens, drains and markets:</strong> Vegetation,
                  standing water and waste increase pressure on nearby homes.
                </li>
                <li>
                  <strong>Apartment living:</strong> Shared pipes and shafts
                  let pests travel.
                </li>
                <li>
                  <strong>Construction and renovation:</strong> New woodwork
                  and open walls need protection.
                </li>
                <li>
                  <strong>Festival and wedding seasons:</strong> Plan treatment
                  well before guests arrive.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Choose Your Home Pest Control Package
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Essential home package:</strong> General treatment
                  for cockroaches, ants and common crawling insects across the
                  main rooms.
                </li>
                <li>
                  <strong>Kitchen and drain package:</strong> Gel baiting,
                  crack and drain treatment.
                </li>
                <li>
                  <strong>Whole-home package:</strong> Treatment of kitchen,
                  bathrooms, bedrooms, living areas, stores and outside entry
                  points.
                </li>
                <li>
                  <strong>Anti-termite package:</strong> Inspection and
                  treatment of wood, walls and soil.
                </li>
                <li>
                  <strong>Pre-construction package:</strong> Soil treatment for
                  new homes and extra floors.
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
                  <strong>Annual home service plan:</strong> Regular visits for
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
                Factors That Affect Home Pest Control Cost in Bareilly
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
                  <strong>Home size and number of rooms:</strong> Larger homes
                  need more time and material.
                </li>
                <li>
                  <strong>Areas to be treated:</strong> Kitchens, bathrooms,
                  bedrooms, balconies, terraces, gardens and store rooms all
                  count.
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
                  fitted furniture, false ceilings and locked areas take
                  longer.
                </li>
                <li>
                  <strong>Repairs and proofing:</strong> Sealing cracks and
                  fixing damp adds to the budget.
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
                Budget Priorities for Home Pest Control
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>First:</strong> Identify the pests and treat the
                  active problem. Delay lets it spread.
                </li>
                <li>
                  <strong>Second:</strong> Find and remove the source. Nests,
                  moisture and food access keep pests coming back.
                </li>
                <li>
                  <strong>Third:</strong> Treat the highest-risk rooms.
                  Kitchen, bedroom, bathroom, store room and wooden fixtures
                  usually come first.
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
                How MTBOSS Approaches Home Pest Control
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Step 1 — Enquiry and discussion:</strong> Contact
                  MTBOSS through the website, phone or WhatsApp and share the
                  pest problem, the home and your budget.
                </li>
                <li>
                  <strong>Step 2 — Photos and details:</strong> Send photos of
                  the pests, droppings, bites or damage, along with your
                  locality in Bareilly.
                </li>
                <li>
                  <strong>Step 3 — Site visit and home inspection:</strong>{" "}
                  The team checks each room, drains, cracks, wood, ceilings and
                  outside areas. Share your locality, and the team will confirm
                  arrangements.
                </li>
                <li>
                  <strong>Step 4 — Pest identification and diagnosis:</strong>{" "}
                  You and the team confirm which pests are present and where
                  they live.
                </li>
                <li>
                  <strong>Step 5 — Treatment recommendation:</strong> The team
                  explains the suggested method for each area and why it suits
                  your home.
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
                  method is carried out in the agreed rooms and areas.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                How to Prepare Your Home for Pest Control
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
                Care After Home Pest Control
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
                Common Home Pest Control Mistakes to Avoid
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  Treating only one room when pests are in several.
                </li>
                <li>
                  Spraying store-bought products and scattering the pests.
                </li>
                <li>Skipping preparation and safety instructions.</li>
                <li>Ignoring moisture, leaks and drainage problems.</li>
                <li>Leaving food, waste and clutter available.</li>
                <li>
                  Ignoring early signs such as droppings, mud tubes or bites.
                </li>
                <li>Skipping follow-up visits.</li>
                <li>
                  Treating one flat in an apartment where pests travel between
                  units.
                </li>
                <li>Leaving gaps and cracks unsealed.</li>
                <li>
                  Choosing the cheapest quote without asking about method,
                  scope and follow-up.
                </li>
                <li>
                  Hiring separate agencies for pest control, repair and
                  painting and managing them alone.
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
                  of home and number of rooms.
                </li>
                <li>
                  <strong>Pest details:</strong> What you see, in which rooms,
                  when and how often.
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
                  <strong>Household:</strong> Children, elderly family members,
                  pets, plants, fish tanks and people with allergies.
                </li>
                <li>
                  <strong>Areas to treat:</strong> Kitchen, bedrooms,
                  bathrooms, store room, garden, terrace, ceilings or whole
                  house.
                </li>
                <li>
                  <strong>Building details:</strong> New, old, under
                  renovation, apartment or independent.
                </li>
                <li>
                  <strong>Budget range:</strong> The amount you are comfortable
                  spending.
                </li>
                <li>
                  <strong>Timeline:</strong> Any move-in, event, guest visit or
                  festival deadline.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                MTBOSS Services for Homeowners
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
                Why Choose MTBOSS for Home Pest Control in Bareilly
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Whole-home view:</strong> We inspect every room and
                  connect the pests, sources and entry points.
                </li>
                <li>
                  <strong>Right method for each pest and room:</strong>{" "}
                  Kitchens, bedrooms, bathrooms and wooden fixtures need
                  different approaches.
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
                  <strong>Construction understanding:</strong> We can plan
                  anti-termite protection and proofing for new homes and
                  renovations.
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
                Contact MTBOSS: Home Pest Control in Bareilly
              </h3>

              <p className="mb-3">
                If you are planning home pest control in Bareilly, MTBOSS
                offers a single point of contact for inspection, treatment,
                follow-up and repair, supported by a free budget calculator and
                a simple online quote request.
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
                    Q1. What does home pest control in Bareilly include?
                  </strong>
                  <br />
                  It usually covers inspection of each room, pest
                  identification, treatment of affected areas, safety
                  instructions, a follow-up check and prevention advice. The
                  exact scope is written in the agreement.
                </li>

                <li>
                  <strong>
                    Q2. Does MTBOSS provide home pest control in Bareilly?
                  </strong>
                  <br />
                  MTBOSS Construction Private Limited serves Moradabad and
                  Bareilly and lists pest control among its Quick Home
                  Services. Share your home details with the team to confirm
                  scope and arrangements.
                </li>

                <li>
                  <strong>
                    Q3. Which pests can be treated at home?
                  </strong>
                  <br />
                  Common household pests such as cockroaches, ants, termites,
                  bed bugs, rodents, mosquitoes, flies, spiders and silverfish,
                  subject to inspection and scope.
                </li>

                <li>
                  <strong>Q4. Do I need to treat the whole house?</strong>
                  <br />
                  Not always. It depends on where the pests are and how they
                  travel. The team will advise after inspection, and often
                  recommends treating the main risk areas and entry points.
                </li>

                <li>
                  <strong>
                    Q5. How often should I get home pest control done?
                  </strong>
                  <br />
                  It depends on the pests, the home and the season. Many homes
                  benefit from a pre-monsoon check and treatment, with extra
                  visits as needed. An annual plan may suit homes with repeated
                  problems.
                </li>

                <li>
                  <strong>
                    Q6. Is home pest control safe for children and pets?
                  </strong>
                  <br />
                  Safety depends on the product, method and your preparation.
                  Ask the provider for specific instructions about keeping
                  children, elderly family members and pets away and
                  ventilating afterwards, and follow them.
                </li>

                <li>
                  <strong>
                    Q7. How do I prepare my home for pest control?
                  </strong>
                  <br />
                  Cover or remove food and utensils, clear cabinets and
                  furniture edges, wash and bag bedding for bed bug treatment,
                  declutter and keep children and pets away as advised.
                </li>

                <li>
                  <strong>
                    Q8. Will pests come back after treatment?
                  </strong>
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