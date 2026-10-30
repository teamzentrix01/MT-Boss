import React from "react";
import LandingEnquiry from "../../components/LandingEnquiry";

const Content = () => {
  return (
    <div className="min-h-screen bg-white pt-0">
      <div className="flex flex-col lg:flex-row">
        {/* Content Section */}
        <div className="order-1 flex-1 px-4 py-12 sm:px-8 md:px-16 lg:order-1">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl md:text-3xl">
            Pest Control Services in Bareilly: Find the Source, Treat the Cause
            and Keep Pests Out
          </h2>

          <div className="max-w-4xl space-y-6 leading-relaxed text-gray-700">
            <section>
              <p>
                Most people notice pests only when they can no longer ignore
                them: cockroaches in the kitchen at night, a trail of ants
                across the floor, a bed bug bite, a rat in the store room, or
                wood that sounds hollow when tapped. By then the colony has
                usually been growing for weeks or months. Spraying a visible
                insect gives quick relief, but the nest, the entry point and
                the conditions that attract pests are still there.
              </p>

              <p className="mt-3">
                Good pest control services in Bareilly start with
                identification and inspection, not a standard spray. The pest,
                the property, the season and the people and pets in the
                building all decide what treatment is right. This page explains
                how to plan pest control, how to prepare your home or office
                and what to expect from MTBOSS. MTBOSS Construction Private
                Limited is an architect, interior designer and construction
                company serving Moradabad and Bareilly. It offers pest control,
                waterproofing, building repair, renovation and other home
                services with transparent pricing and on-time delivery.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Pest Control Services at a Glance
              </h3>

              <p className="mb-3">
                Different pests need different treatments. Here are the common
                problems in Bareilly homes and offices.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2">
                        Pest
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Where you notice it
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
                        Cockroaches
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Kitchen, bathroom, drains, cabinets
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Gel baiting, targeted spray
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Food storage, drains, gaps
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Termites
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Wooden doors, furniture, walls, mud tubes
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Drilling and injection, soil treatment
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Finding the colony, treating wood and soil
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Ants
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Kitchen counters, floors, cracks
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Baiting, crack treatment
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Trail tracing, food sources
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Bed bugs
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Mattresses, bed frames, sofas
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Targeted spray, repeat visit
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Clean-up, linen handling, follow-up
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Rodents
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Store rooms, ceilings, kitchen
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Baiting, trapping, proofing
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Entry points, waste and food access
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Mosquitoes
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Stagnant water, gardens, drains
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Larvicide, spray, fogging
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Removing standing water
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
                        Spray, waste management
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Hygiene and waste handling
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Spiders and silverfish
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Corners, books, cupboards
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Spray, clean-out
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
                condition of your home or office.
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
                  rooms, kitchens, drains, wood, cracks, storage areas and
                  outside spaces.
                </li>
                <li>
                  <strong>Pest identification:</strong> Confirming which pest
                  it is, since each needs a different method.
                </li>
                <li>
                  <strong>General pest control:</strong> Treatment for
                  cockroaches, ants, spiders, silverfish and other crawling
                  insects.
                </li>
                <li>
                  <strong>Anti-termite treatment:</strong> Treating wood, walls
                  and soil to stop and prevent termite activity.
                </li>
                <li>
                  <strong>Pre-construction anti-termite treatment:</strong>{" "}
                  Soil treatment during building, which suits new homes and
                  extra floors.
                </li>
                <li>
                  <strong>Bed bug treatment:</strong> Targeted treatment of
                  beds, sofas and cracks, with follow-up.
                </li>
                <li>
                  <strong>Rodent control:</strong> Baiting, trapping and
                  sealing entry points.
                </li>
                <li>
                  <strong>Mosquito and fly control:</strong> Treating breeding
                  areas and reducing nuisance.
                </li>
                <li>
                  <strong>Kitchen and restaurant pest control:</strong>{" "}
                  Treatment planned around food areas and hygiene needs.
                </li>
                <li>
                  <strong>Office, shop and warehouse pest control:</strong>{" "}
                  Scheduled work that avoids business hours.
                </li>
                <li>
                  <strong>Crack and gap sealing:</strong> Closing entry points
                  with the help of our building repair team.
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
                Signs You Need Pest Control
              </h3>

              <p className="mb-3">
                Look for these signs before the problem spreads.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  Cockroaches seen in daylight or in large numbers at night.
                </li>
                <li>Small black droppings in kitchen drawers and corners.</li>
                <li>Ant trails along walls, counters and floors.</li>
                <li>
                  Mud tubes on walls, hollow-sounding wood or tiny wings near
                  windows.
                </li>
                <li>
                  Tiny blood spots or dark specks on mattresses and bite marks
                  on skin.
                </li>
                <li>Gnaw marks on wires, food packets or furniture.</li>
                <li>Scratching sounds in ceilings or walls at night.</li>
                <li>A musty or oily smell in cupboards and store rooms.</li>
                <li>Mosquito swarms near drains, tanks and plants.</li>
                <li>Pest activity after renovation or new construction.</li>
              </ul>

              <p className="mt-3">
                If you see more than one sign, the infestation is probably
                established. Book an inspection.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Read the Property Before Choosing the Treatment
              </h3>

              <p className="mb-3">
                The spray you see is the last step. What you find during
                inspection decides how well the treatment works.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Identify the pest:</strong> Cockroaches, termites and
                  bed bugs need completely different methods.
                </li>
                <li>
                  <strong>Find the source:</strong> Check drains, cracks,
                  ducts, gaps around pipes and outside walls.
                </li>
                <li>
                  <strong>Check moisture:</strong> Damp walls, leaking pipes
                  and stagnant water attract many pests.
                </li>
                <li>
                  <strong>Look at food and waste:</strong> Open food,
                  uncovered bins and clutter feed infestations.
                </li>
                <li>
                  <strong>Inspect wood:</strong> Doors, frames, cupboards and
                  furniture show termite damage.
                </li>
                <li>
                  <strong>Note who lives there:</strong> Children, elderly
                  people, pets, aquariums and plants affect product and method
                  choice.
                </li>
                <li>
                  <strong>Check past treatment:</strong> Earlier sprays may
                  have scattered the pests without removing them.
                </li>
                <li>
                  <strong>Plan access:</strong> Locked rooms, stored goods and
                  furniture can limit treatment.
                </li>
              </ul>

              <p className="mt-3">
                Because damp attracts pests, pest control often goes together
                with waterproofing and repair. Fixing leaks and cracks supports
                the treatment and helps results last.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Planning by Pest Type
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Cockroaches:</strong> Common in kitchens, bathrooms
                  and drains. Gel baits and targeted treatment in cracks and
                  hiding places work better than spraying open surfaces. Food
                  storage and drain hygiene decide how fast they return.
                </li>
                <li>
                  <strong>Termites:</strong> Termites damage wood, books,
                  boards and sometimes plaster, often unseen. Treatment may
                  involve drilling, injection and soil treatment. Early
                  inspection protects furniture, doors and the structure.
                </li>
                <li>
                  <strong>Ants:</strong> Trace the trail and find the nest or
                  food source. Baiting is often better than killing visible
                  ants, because the colony needs to be reached.
                </li>
                <li>
                  <strong>Bed bugs:</strong> They hide in mattress seams, bed
                  frames, sofas and wall cracks. Treatment needs preparation,
                  such as washing linen and clearing the bed area, and often a
                  follow-up visit.
                </li>
                <li>
                  <strong>Rodents:</strong> Rats and mice enter through small
                  gaps. Treatment combines baits or traps with sealing entry
                  points and removing food access.
                </li>
                <li>
                  <strong>Mosquitoes and flies:</strong> Control starts with
                  removing standing water and waste. Treatment is then planned
                  around breeding areas, drains, gardens and food zones.
                </li>
                <li>
                  <strong>Spiders, silverfish and other insects:</strong>{" "}
                  These thrive in clutter and humidity. Cleaning, ventilation
                  and targeted treatment help.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Planning by Property Type
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Independent house or villa:</strong> Kitchens,
                  bathrooms, gardens, wooden fixtures and terrace areas need
                  attention in a planned order.
                </li>
                <li>
                  <strong>Apartment or flat:</strong> Pests move between flats
                  through pipes and ducts, so coordinate with neighbours or the
                  society.
                </li>
                <li>
                  <strong>Newly built or renovated home:</strong>{" "}
                  Pre-construction or post-renovation anti-termite treatment
                  protects the new woodwork and structure.
                </li>
                <li>
                  <strong>Restaurant, cafe or kitchen business:</strong>{" "}
                  Hygiene rules matter. Treatment is planned around food
                  handling and working hours.
                </li>
                <li>
                  <strong>Office, shop or showroom:</strong> Scheduled visits
                  outside business hours keep operations running.
                </li>
                <li>
                  <strong>School, clinic or hospital:</strong> Choose
                  treatments and timing carefully, with attention to occupants.
                </li>
                <li>
                  <strong>Warehouse or godown:</strong> Large spaces with
                  stored goods need rodent and insect control plus proofing.
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
                  cockroaches, ants, mosquitoes and termites indoors. Plan
                  treatment just before or early in the rains.
                </li>
                <li>
                  <strong>Summer heat:</strong> Pests seek water and cool
                  spots, often drains and bathrooms. Check kitchens and
                  bathrooms regularly.
                </li>
                <li>
                  <strong>Winter:</strong> Some pests become less visible but
                  remain in cracks and warm areas. Bed bugs and rodents can
                  persist.
                </li>
                <li>
                  <strong>Older buildings:</strong> Cracks, gaps and old
                  woodwork give pests places to hide and enter.
                </li>
                <li>
                  <strong>Construction and renovation:</strong> Dust, new
                  woodwork and open walls can attract termites and rodents.
                </li>
                <li>
                  <strong>Gardens and open drains:</strong> Nearby vegetation
                  and stagnant water increase mosquito and insect pressure.
                </li>
                <li>
                  <strong>Apartment living:</strong> Shared pipes and shafts
                  let pests travel, so treat the whole line where possible.
                </li>
                <li>
                  <strong>Festival and wedding seasons:</strong> Treat before
                  guests arrive, with time for the home to be aired and
                  cleaned.
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
                  and crack treatment for kitchens.
                </li>
                <li>
                  <strong>Anti-termite package:</strong> Inspection and
                  treatment of wood, walls and soil.
                </li>
                <li>
                  <strong>Pre-construction package:</strong> Soil treatment
                  during building for new homes and extra floors.
                </li>
                <li>
                  <strong>Bed bug package:</strong> Targeted treatment with
                  preparation guidance and a follow-up visit.
                </li>
                <li>
                  <strong>Rodent control package:</strong> Baiting, trapping
                  and proofing of entry points.
                </li>
                <li>
                  <strong>Mosquito and fly package:</strong> Breeding-area
                  treatment and seasonal spray.
                </li>
                <li>
                  <strong>Commercial package:</strong> Planned treatment for
                  shops, offices, restaurants and warehouses.
                </li>
                <li>
                  <strong>Annual service plan:</strong> Regular visits for
                  prevention and early detection.
                </li>
                <li>
                  <strong>Repair and proofing add-on:</strong> Sealing cracks,
                  gaps and damp points to support the treatment.
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
                  <strong>Type of pest:</strong> Cockroach, termite, bed bug
                  and rodent treatments are priced differently.
                </li>
                <li>
                  <strong>Severity of infestation:</strong> A new problem costs
                  less than an established colony.
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
                  injection, soil treatment and fogging differ in cost.
                </li>
                <li>
                  <strong>Number of visits:</strong> Some pests, such as bed
                  bugs, need follow-up treatment.
                </li>
                <li>
                  <strong>Access and preparation:</strong> Cluttered rooms or
                  locked areas take longer.
                </li>
                <li>
                  <strong>Wood and structure:</strong> Termite treatment
                  depends on how much wood, wall and soil is involved.
                </li>
                <li>
                  <strong>Repairs and proofing:</strong> Sealing cracks, gaps
                  and damp points adds to the budget.
                </li>
                <li>
                  <strong>Service plan:</strong> Annual plans may cost less per
                  visit than one-off treatment.
                </li>
              </ul>

              <p className="mt-3">
                Your actual quote depends on inspection findings, so use the
                free MTBOSS Budget Calculator on the website for a starting
                estimate for related construction work, and request a detailed
                pest control quote after the site visit.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Budget Priorities for Pest Control
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>First:</strong> Identify the pest and treat the
                  active infestation. Delay lets it spread.
                </li>
                <li>
                  <strong>Second:</strong> Find and remove the source. Nests,
                  moisture and food access keep pests coming back.
                </li>
                <li>
                  <strong>Third:</strong> Treat the highest-risk areas.
                  Kitchens, bathrooms, wood and store rooms usually come first.
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
                How MTBOSS Approaches a Pest Control Project
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Step 1 — Enquiry and discussion:</strong> Contact
                  MTBOSS through the website, phone or WhatsApp and share the
                  pest problem, the property and your budget.
                </li>
                <li>
                  <strong>Step 2 — Photos and details:</strong> Send photos of
                  the pests, droppings, damage or affected rooms, along with
                  your locality in Bareilly.
                </li>
                <li>
                  <strong>Step 3 — Site visit and inspection:</strong> The team
                  checks rooms, drains, cracks, wood and outside areas. Share
                  your locality, and the team will confirm arrangements.
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
                How to Prepare Your Home or Office for Pest Control
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  Remove or tightly cover food, utensils and cooking items, as
                  advised by the technician.
                </li>
                <li>
                  Empty kitchen cabinets and drawers when asked, so hiding
                  places can be treated.
                </li>
                <li>
                  Wash and bag bedding, clothes and soft furnishings before bed
                  bug treatment.
                </li>
                <li>
                  Move furniture slightly away from walls so edges and cracks
                  are reachable.
                </li>
                <li>
                  Keep children, elderly family members and pets out of treated
                  areas for the time advised.
                </li>
                <li>Cover or move fish tanks, pet food and bowls.</li>
                <li>
                  Switch off fans and cover sensitive items if the technician
                  asks.
                </li>
                <li>
                  Clear access to store rooms, terraces, gardens and
                  under-stair spaces.
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
                <li>Fix leaking taps, pipes and damp patches.</li>
                <li>Seal gaps around pipes, doors and windows.</li>
                <li>
                  Do not store cardboard, old newspapers and clutter near
                  walls.
                </li>
                <li>
                  Inspect wooden furniture and door frames regularly for
                  termite signs.
                </li>
                <li>
                  Remove standing water from pots, coolers and open containers.
                </li>
                <li>
                  Book follow-up visits and seasonal checks as recommended.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Common Pest Control Mistakes to Avoid
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  Spraying only what you see and ignoring the nest or source.
                </li>
                <li>
                  Using random store-bought sprays that scatter the pests.
                </li>
                <li>
                  Delaying termite inspection until furniture or wood is badly
                  damaged.
                </li>
                <li>
                  Skipping preparation, which reduces the effect of treatment.
                </li>
                <li>
                  Re-entering treated rooms too early or cleaning treated areas
                  too soon.
                </li>
                <li>Ignoring moisture, leaks and drainage problems.</li>
                <li>
                  Leaving food and waste uncovered after treatment.
                </li>
                <li>
                  Choosing the cheapest quote without asking about method,
                  products and follow-up.
                </li>
                <li>
                  Treating only one flat in an apartment where pests travel
                  between units.
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
                  of property and approximate area.
                </li>
                <li>
                  <strong>Pest details:</strong> What you see, where, when and
                  how often.
                </li>
                <li>
                  <strong>Photos and videos:</strong> Pests, droppings,
                  damage, mud tubes or affected furniture.
                </li>
                <li>
                  <strong>History:</strong> How long the problem has existed
                  and any earlier treatment.
                </li>
                <li>
                  <strong>Occupants:</strong> Children, elderly family members,
                  pets, plants and aquariums.
                </li>
                <li>
                  <strong>Areas to treat:</strong> Kitchen, bedrooms,
                  bathrooms, store room, garden, terrace or whole building.
                </li>
                <li>
                  <strong>Budget range:</strong> The amount you are comfortable
                  spending.
                </li>
                <li>
                  <strong>Timeline:</strong> Any move-in, event, inspection or
                  festival deadline.
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
                Why Choose MTBOSS for Pest Control Services in Bareilly
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Inspection first:</strong> We identify the pest and
                  find the source before recommending a treatment.
                </li>
                <li>
                  <strong>Right method for the pest:</strong> Cockroaches,
                  termites, bed bugs and rodents are not treated the same way.
                </li>
                <li>
                  <strong>Builder and repair team together:</strong> Pest
                  treatment, crack sealing, waterproofing and repair planned as
                  one job.
                </li>
                <li>
                  <strong>Pre-construction support:</strong> Anti-termite
                  planning for new homes and extra floors.
                </li>
                <li>
                  <strong>Free Budget Calculator:</strong> A simple starting
                  estimate for related construction work.
                </li>
                <li>
                  <strong>Transparent estimates:</strong> Written, itemised
                  quotes with scope and specifications stated clearly.
                </li>
                <li>
                  <strong>Single point of contact:</strong> One team handles
                  inspection, treatment, follow-up and related repairs.
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
                Contact MTBOSS: Pest Control Services in Bareilly
              </h3>

              <p className="mb-3">
                If you are looking for pest control services in Bareilly,
                MTBOSS offers a single point of contact for inspection,
                treatment, follow-up and related repairs, supported by a free
                budget calculator and a simple online quote request.
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
                    Q1. What do pest control services in Bareilly include?
                  </strong>
                  <br />
                  They usually include inspection, pest identification,
                  treatment of affected areas, safety instructions, a follow-up
                  check and prevention advice. The exact scope is written in
                  the agreement.
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
                  <strong>Q4. How do I know if I have termites?</strong>
                  <br />
                  Look for mud tubes on walls, hollow-sounding wood, damaged
                  furniture or doors and tiny wings near windows. Termites
                  often work unseen, so an inspection is the safest way to
                  confirm.
                </li>

                <li>
                  <strong>
                    Q5. Is anti-termite treatment needed in a new building?
                  </strong>
                  <br />
                  Yes. Treating the soil during construction protects the
                  structure and woodwork from the start and is easier than
                  treating later.
                </li>

                <li>
                  <strong>
                    Q6. How do I prepare my home for pest control?
                  </strong>
                  <br />
                  Cover or remove food and utensils, clear cabinets and
                  furniture edges, wash bedding for bed bug treatment, and keep
                  children, elderly family members and pets away as advised.
                </li>

                <li>
                  <strong>
                    Q7. How long should we stay out after treatment?
                  </strong>
                  <br />
                  It depends on the method and product used. The technician
                  will give specific instructions about time away and
                  ventilation, and you should follow them.
                </li>

                <li>
                  <strong>Q8. Will pests come back after treatment?</strong>
                  <br />
                  They can return if the source, moisture or entry points are
                  not addressed. Follow-up visits, hygiene and sealing cracks
                  help prevent repeat infestations.
                </li>

                <li>
                  <strong>
                    Q9. How much do pest control services cost in Bareilly?
                  </strong>
                  <br />
                  Cost depends on the pest, property size, severity, method and
                  number of visits. Request a detailed quote after the site
                  visit.
                </li>

                <li>
                  <strong>Q10. Where is the MTBOSS office located?</strong>
                  <br />
                  Harthala, Kanth Road, Behind KR Collection, near
                  Domino&apos;s, Moradabad, Uttar Pradesh.
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