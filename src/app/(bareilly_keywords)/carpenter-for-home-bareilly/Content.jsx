import React from "react";
import LandingEnquiry from "../../components/LandingEnquiry";

const Content = () => {
  return (
    <div className="min-h-screen bg-white pt-0">
      <div className="flex flex-col lg:flex-row">
        {/* Content Section */}
        <div className="order-1 flex-1 px-4 py-12 sm:px-8 md:px-16 lg:order-1">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl md:text-3xl">
            One Plan for Every Room, Not Ten Different Contractors
          </h2>

          <div className="max-w-4xl space-y-6 leading-relaxed text-gray-700">
            <section>
              <p>
                A home needs woodwork in almost every room. The bedroom needs a
                wardrobe, the living room a TV unit, the kitchen cabinets, the
                entrance a shoe rack, the prayer corner a pooja unit, and every
                doorway a door that closes properly. When each job is given to
                a different person, the result often looks mismatched, costs
                more and takes longer. When one carpenter plans the whole home,
                the finish matches, the timing fits and the budget stays under
                control.
              </p>

              <p className="mt-3">
                If you are looking for a carpenter for your home in Bareilly,
                this page will help you do three things: understand how to plan
                woodwork across a whole home, know what to check before you
                hire, and see how MTBOSS handles home carpentry for new houses,
                renovations and flats. MTBOSS Construction Private Limited is
                an architect, interior designer and construction company
                serving Moradabad and Bareilly. It offers carpentry, modular
                kitchens, interiors, renovation, waterproofing and other home
                services with transparent pricing and on-time delivery.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Home Carpentry at a Glance
              </h3>

              <p className="mb-3">
                Your home, family and budget matter more than any template.
                MTBOSS helps you plan carpentry that suits how your household
                lives.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2">
                        Room or area
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Common carpentry needs
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Planning priority
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Entrance
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Main door, shoe rack, key unit, nameplate panel
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Strength, security, weather resistance
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Living room
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        TV unit, wall panel, shelves, console table
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Wiring, ventilation, style
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Bedrooms
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Wardrobes, beds, side tables, dressing unit
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Storage, comfort, matching finish
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Kitchen
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Cabinets, pantry unit, shelves
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Moisture resistance, hardware
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Dining area
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Dining table, crockery unit, bar counter
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Space, seating, storage
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Kids&apos; room
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Bed, study desk, toy storage
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Safety, growth, easy cleaning
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Study or home office
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Desk, bookshelves, cable-friendly storage
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Height, light, organisation
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Pooja corner
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Wall pooja unit, mandir, storage
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Size, ventilation, finish
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Doors and windows
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Room doors, frames, window shutters
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Fit, termite resistance, locks
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Balcony and terrace
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Bench, storage, pergola or cover
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Weather protection, drainage
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Home Carpentry Services Offered by MTBOSS for Bareilly Clients
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Home visit and measurement:</strong> Recording room
                  sizes, wall condition, door positions and fixing points.
                </li>
                <li>
                  <strong>Whole-home planning:</strong> A single carpentry plan
                  covering all rooms, so finishes and styles match.
                </li>
                <li>
                  <strong>Wardrobes and lofts:</strong> Hinged or sliding
                  wardrobes with shelves, drawers and hanging space.
                </li>
                <li>
                  <strong>Beds and bedroom furniture:</strong> Beds, side
                  tables, dressing units and storage options.
                </li>
                <li>
                  <strong>Living room woodwork:</strong> TV units, wall panels,
                  shelves and display units.
                </li>
                <li>
                  <strong>Kitchen and pantry woodwork:</strong> Cabinets,
                  shelves and storage units.
                </li>
                <li>
                  <strong>Doors and window woodwork:</strong> Supply and
                  fitting of doors, frames and shutters.
                </li>
                <li>
                  <strong>Dining and study furniture:</strong> Dining tables,
                  crockery units, study desks and bookshelves.
                </li>
                <li>
                  <strong>Pooja and mandir units:</strong> Wall-mounted or
                  floor units with shelves and storage.
                </li>
                <li>
                  <strong>Kids&apos; room carpentry:</strong> Beds, desks and
                  storage designed for safety and growth.
                </li>
                <li>
                  <strong>Repair and refresh work:</strong> Fixing hinges,
                  drawers, joints and finishes on existing woodwork.
                </li>
                <li>
                  <strong>Installation and handover:</strong> Fixing, levelling,
                  checking and a final walk-through.
                </li>
                <li>
                  <strong>Related home services:</strong> Painter, plumber,
                  electrician, tile and marble, false ceiling and waterproofing
                  through the same company.
                </li>
              </ul>

              <p className="mt-3">
                Final scope for each project is discussed and confirmed with
                the MTBOSS team before work begins.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Why Plan Home Carpentry as One Project
              </h3>

              <p className="mb-3">
                Even if you cannot afford everything at once, a whole-home plan
                lets you build in stages while keeping the design consistent.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2">
                        Point
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        One planned project
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Separate small jobs
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Matching finish
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Consistent colours and style
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Different carpenters, mismatched finish
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Scheduling
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Work planned in the right order
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Overlaps and waiting
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Material buying
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Planned quantities, fewer surprises
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Smaller orders, higher waste
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Hardware
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Same quality across rooms
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Mixed brands and quality
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Coordination
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        One team talks to painters and electricians
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        You coordinate everyone
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Budget control
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Single estimate, phase-wise payments
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Many quotes, harder to compare
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Accountability
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        One point of contact
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Blame moves between vendors
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                New Home vs Renovation: How Carpentry Planning Differs
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Carpentry for a New Home:</strong> Plan wardrobes,
                  wall units and pooja corners before painting and electrical
                  work, so wiring and lights fit the design. Decide door and
                  window sizes and styles early. Build storage into walls and
                  alcoves for a clean look. Choose a consistent material and
                  finish across rooms.
                </li>
                <li>
                  <strong>Carpentry During Renovation:</strong> Inspect
                  existing doors, frames and furniture for damage, moisture and
                  termites. Decide what to keep, repair or replace. Expect
                  uneven walls and older measurements, so exact site
                  measurement matters. Plan around painting and floor work to
                  avoid damage to new woodwork.
                </li>
                <li>
                  <strong>Carpentry for a Rented or Temporary Home:</strong>{" "}
                  Prefer movable furniture and light changes. Confirm with the
                  landlord before modifying fixed woodwork.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Choosing the Right Wood or Board for Your Home
              </h3>

              <p className="mb-3">
                Different rooms need different materials. The kitchen and any
                area near water need moisture-resistant boards. A dry bedroom
                can use a more economical option. A good home carpenter picks
                the right material for each room instead of using one material
                everywhere.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2">
                        Material
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Strength
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Moisture resistance
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Best for
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Cost level
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Solid wood (treated)
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Very high
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Good if treated
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Main doors, frames, beds, premium pieces
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        High
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        BWP / marine plywood
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        High
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        High
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Kitchens, bathrooms, damp areas
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Mid to high
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Commercial plywood
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Good
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Moderate
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Wardrobes, beds, storage in dry rooms
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Mid
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        HDHMR board
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Good
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Good
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Wardrobes, wall units, pooja units
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Mid
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        MDF
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Moderate
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Low
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Decorative panels, light-use items
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Low to mid
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Particle board
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Moderate
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Low
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Budget furniture in dry rooms
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Low
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                What a Good Home Carpenter Actually Does
              </h3>

              <p className="mb-3">
                The job is more than building a few pieces. A reliable home
                carpenter follows a sequence, and you should expect to see it.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Visits every room:</strong> Not only the one you are
                  worried about.
                </li>
                <li>
                  <strong>Listens to the household:</strong> Family size,
                  children, elders, pets and daily habits shape the design.
                </li>
                <li>
                  <strong>Measures exactly:</strong> Walls and floors in homes
                  are rarely perfectly square.
                </li>
                <li>
                  <strong>Plans for the whole home:</strong> Style, finish and
                  hardware stay consistent across rooms.
                </li>
                <li>
                  <strong>Prepares drawings:</strong> Sizes, shelves and
                  drawers are agreed before cutting starts.
                </li>
                <li>
                  <strong>Selects the right material for each room:</strong>{" "}
                  Moisture, load and use decide the choice.
                </li>
                <li>
                  <strong>Coordinates with other trades:</strong> Painting,
                  electrical and civil work are sequenced properly.
                </li>
                <li>
                  <strong>Builds with strong joinery:</strong> Joints and
                  fixing are made for daily family use.
                </li>
                <li>
                  <strong>Chooses quality hardware:</strong> Hinges, channels
                  and locks decide daily smoothness.
                </li>
                <li>
                  <strong>Finishes neatly and cleans up:</strong> Dust and
                  offcuts are removed, and the home is left tidy.
                </li>
                <li>
                  <strong>Checks everything before handover:</strong> Doors,
                  drawers, shutters and fixings are tested.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Questions to Ask Before You Hire a Carpenter for Your Home
              </h3>

              <p className="mb-3">
                Use these questions with any carpenter, including us.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>
                    Will you visit and measure every room before giving a
                    price?
                  </strong>{" "}
                  The answer should be yes.
                </li>
                <li>
                  <strong>
                    Can you plan the whole home, and let me build in stages?
                  </strong>{" "}
                  This helps match style and budget.
                </li>
                <li>
                  <strong>
                    Which wood or board will you use in each room, and why?
                  </strong>{" "}
                  Ask for reasons.
                </li>
                <li>
                  <strong>Which hardware brand is included?</strong> Get the
                  name written down.
                </li>
                <li>
                  <strong>
                    Will I get a drawing or design before work starts?
                  </strong>{" "}
                  You should approve it first.
                </li>
                <li>
                  <strong>
                    How will you protect my floors and walls during work?
                  </strong>{" "}
                  Home protection matters.
                </li>
                <li>
                  <strong>
                    How will you coordinate with the painter and electrician?
                  </strong>{" "}
                  Order of work matters.
                </li>
                <li>
                  <strong>
                    What is the timeline, and can I stay at home during the
                    work?
                  </strong>{" "}
                  Ask about dust, noise and schedule.
                </li>
                <li>
                  <strong>How are payments structured?</strong> They should
                  follow progress, not come all at once.
                </li>
                <li>
                  <strong>What warranty or follow-up is offered?</strong> Get
                  the terms written.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Warning Signs of a Weak Home Carpenter
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  Quotes a price without seeing the home or taking
                  measurements.
                </li>
                <li>
                  Cannot show any completed work in homes like yours.
                </li>
                <li>
                  Offers a lump-sum quote with no room-wise breakup.
                </li>
                <li>
                  Uses words like &quot;best quality&quot; without naming
                  materials or hardware.
                </li>
                <li>
                  Uses one material in every room, including damp areas.
                </li>
                <li>
                  Starts work without a drawing or agreement on sizes.
                </li>
                <li>
                  Does not protect floors, doors and walls during work.
                </li>
                <li>
                  Asks for the full payment before starting.
                </li>
                <li>
                  Leaves the home messy or the work unfinished.
                </li>
                <li>Gives no written timeline or warranty.</li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Planning Home Carpentry Room by Room
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Entrance and Foyer:</strong> The main door needs
                  strength and security, and the entrance often gets the most
                  weather. Add a shoe rack and key unit that keep the area
                  tidy.
                </li>
                <li>
                  <strong>Living Room:</strong> Plan the TV unit, wall panel
                  and shelves around the seating. Leave space for wiring,
                  ventilation and future appliances.
                </li>
                <li>
                  <strong>Bedrooms:</strong> Wardrobes are the biggest
                  carpentry item. Plan internal layout for hanging, folding,
                  drawers and a locker, and keep bed, side tables and dressing
                  unit in a matching finish.
                </li>
                <li>
                  <strong>Kitchen:</strong> Use moisture-resistant boards and
                  good hardware. The kitchen is also the room where carpentry
                  meets plumbing, tiling and electrical work, so coordination
                  is critical.
                </li>
                <li>
                  <strong>Dining Area:</strong> Match the table size to the
                  room and leave comfortable movement space. A crockery unit or
                  bar counter adds storage.
                </li>
                <li>
                  <strong>Kids&apos; Rooms:</strong> Choose rounded edges, safe
                  finishes and furniture that can grow with the child. Plan a
                  study desk and toy storage together.
                </li>
                <li>
                  <strong>Study or Home Office:</strong> Choose the right table
                  height, and plan for lights, cables and bookshelves.
                </li>
                <li>
                  <strong>Pooja Corner:</strong> Choose a size that fits the
                  space, with proper ventilation and storage for items. Keep
                  the finish simple and easy to clean.
                </li>
                <li>
                  <strong>Balcony and Terrace:</strong> Choose
                  weather-resistant materials and finishes, and make sure
                  drainage works properly.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Planning by Property Type
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Independent House or Villa:</strong> Multiple floors
                  and rooms benefit from a single carpentry plan. Coordinate
                  with painting, electrical and civil work for a clean result.
                </li>
                <li>
                  <strong>Apartment or Flat:</strong> Space is limited, so
                  built-in storage and multi-use furniture help. Confirm
                  working hours, lift use, noise and debris rules with your
                  society.
                </li>
                <li>
                  <strong>Duplex or Multi-Storey Home:</strong> Staircase
                  woodwork, railings and feature walls need structure checks
                  and careful planning.
                </li>
                <li>
                  <strong>Older Home:</strong> Old doors, frames and furniture
                  may show moisture or termite damage. An inspection shows what
                  can be saved and what should be replaced.
                </li>
                <li>
                  <strong>New Construction:</strong> The best time to plan home
                  carpentry. Wiring, lights and wall positions can be set to
                  suit the design.
                </li>
                <li>
                  <strong>Rented Home:</strong> Simple, movable furniture keeps
                  costs low and avoids problems with the landlord.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Bareilly Planning Notes for Home Carpentry
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Monsoon humidity:</strong> Wood and boards absorb
                  moisture, so seal edges and keep woodwork away from damp
                  walls.
                </li>
                <li>
                  <strong>Summer heat:</strong> Heat can dry and crack
                  untreated wood, so choose seasoned and treated material.
                </li>
                <li>
                  <strong>Winter dampness:</strong> Slow drying affects polish
                  and paint, so allow enough curing time.
                </li>
                <li>
                  <strong>Termite risk:</strong> Doors, frames and ground-level
                  furniture benefit from treated wood or termite-resistant
                  boards.
                </li>
                <li>
                  <strong>Older house walls:</strong> Uneven walls need careful
                  measurement and fixing.
                </li>
                <li>
                  <strong>Leaks and damp patches:</strong> Fix leakage and
                  waterproofing issues before fitting wood against walls.
                </li>
                <li>
                  <strong>Dust and cleaning:</strong> Closed units and smooth
                  finishes are easier to keep clean.
                </li>
                <li>
                  <strong>Festival and wedding seasons:</strong> Book early so
                  carpentry is complete before guests arrive.
                </li>
                <li>
                  <strong>Society rules:</strong> Check lift, parking, noise
                  and debris disposal rules before work.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Choose Your Home Carpentry Plan
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Single-room plan:</strong> One room, such as a
                  bedroom or living room, planned completely.
                </li>
                <li>
                  <strong>Wardrobe plan:</strong> Custom wardrobes across
                  bedrooms with a matching finish.
                </li>
                <li>
                  <strong>Doors and windows plan:</strong> Supply and fitting
                  of doors, frames and shutters for the whole home.
                </li>
                <li>
                  <strong>Kitchen and dining plan:</strong> Kitchen cabinets,
                  dining furniture and storage planned together.
                </li>
                <li>
                  <strong>Living area plan:</strong> TV unit, wall panel,
                  shelves and console as one design.
                </li>
                <li>
                  <strong>Kids&apos; room plan:</strong> Bed, desk and storage
                  designed for safety and growth.
                </li>
                <li>
                  <strong>Repair and refresh plan:</strong> Fixing and
                  refinishing existing woodwork across the home.
                </li>
                <li>
                  <strong>New home plan:</strong> All carpentry planned
                  together with painting, ceiling and electrical work.
                </li>
                <li>
                  <strong>Full-home interior plan:</strong> Carpentry, painting,
                  lighting and ceilings planned as one project.
                </li>
                <li>
                  <strong>Phase-wise plan:</strong> One complete plan carried
                  out in stages to match your budget.
                </li>
              </ul>

              <p className="mt-3">
                Scope and specifications are agreed in writing before work
                begins, so you know exactly what is included.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Factors That Affect Home Carpentry Cost in Bareilly
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Number of rooms and items:</strong> More rooms and
                  pieces increase the total.
                </li>
                <li>
                  <strong>Size of each item:</strong> Larger wardrobes, wall
                  units and tables cost more.
                </li>
                <li>
                  <strong>Material choice:</strong> Solid wood, plywood, HDHMR
                  and MDF sit at different price levels.
                </li>
                <li>
                  <strong>Finish:</strong> Laminate, veneer, paint, acrylic and
                  polish have different costs.
                </li>
                <li>
                  <strong>Hardware brand and type:</strong> Better hinges,
                  channels and locks cost more but last longer.
                </li>
                <li>
                  <strong>Design complexity:</strong> Carvings, curves, lights
                  and special details add labour.
                </li>
                <li>
                  <strong>Storage features:</strong> Drawers, lofts, pull-outs
                  and lifts raise the price.
                </li>
                <li>
                  <strong>Site condition:</strong> Uneven walls and difficult
                  access add effort.
                </li>
                <li>
                  <strong>Existing woodwork:</strong> Removal, repair or
                  matching adds work.
                </li>
                <li>
                  <strong>Timeline:</strong> Faster schedules can change the
                  price.
                </li>
              </ul>

              <p className="mt-3">
                Home carpentry is generally priced by item, size or scope, and
                the range is wide because choices differ. Your quote depends on
                the site visit, so use the free MTBOSS Budget Calculator on the
                website for a starting estimate and request a detailed quote
                after measurement.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Budget Priorities for Home Carpentry
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>First:</strong> Safety and function. Doors, locks,
                  railings and loose or broken items come first.
                </li>
                <li>
                  <strong>Second:</strong> Measurement and planning. A good
                  plan saves more than any discount.
                </li>
                <li>
                  <strong>Third:</strong> Wardrobes and kitchen storage. These
                  are used daily and add the most value.
                </li>
                <li>
                  <strong>Fourth:</strong> Core material and hardware. Choose
                  the right board and reliable fittings.
                </li>
                <li>
                  <strong>Fifth:</strong> Living and dining pieces. Plan these
                  to suit your lifestyle.
                </li>
                <li>
                  <strong>Sixth:</strong> Finish. Choose laminate, veneer,
                  paint or polish to suit use and budget.
                </li>
                <li>
                  <strong>Seventh:</strong> Decorative details. Panels, lights
                  and special features can follow later.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                How MTBOSS Approaches Home Carpentry
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Step 1 — Enquiry and discussion:</strong> Contact
                  MTBOSS through the website, phone or WhatsApp and share what
                  you need, which rooms are involved and your budget.
                </li>
                <li>
                  <strong>Step 2 — Budget Calculator:</strong> The free
                  calculator on our website gives a starting estimate before
                  the visit.
                </li>
                <li>
                  <strong>Step 3 — Home visit and measurement:</strong> The
                  team checks rooms, walls, floors, doors and fixing points.
                  Share your locality in Bareilly, and the team will confirm
                  arrangements.
                </li>
                <li>
                  <strong>Step 4 — Household and needs review:</strong> You and
                  the team discuss family size, daily habits, storage needs and
                  style.
                </li>
                <li>
                  <strong>Step 5 — Whole-home plan and drawings:</strong> The
                  team prepares a layout or drawings so you can see sizes,
                  positions and the overall look.
                </li>
                <li>
                  <strong>Step 6 — Material and hardware selection:</strong>{" "}
                  Boards, finishes and hardware are chosen with clear reasons
                  for each room.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Yearly Home Carpentry Care Checklist
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Before the monsoon:</strong> Check doors, windows and
                  wardrobes for swelling, and fix leaks near woodwork.
                </li>
                <li>
                  <strong>After the monsoon:</strong> Look for damp marks,
                  warping, fungus and termite signs.
                </li>
                <li>
                  <strong>Hinges and channels:</strong> Tighten loose screws
                  and adjust or oil moving parts once a year.
                </li>
                <li>
                  <strong>Doors and locks:</strong> Check alignment and smooth
                  operation.
                </li>
                <li>
                  <strong>Surfaces:</strong> Wipe with a soft, slightly damp
                  cloth, then dry them.
                </li>
                <li>
                  <strong>Heavy loads:</strong> Do not overload shelves,
                  drawers and wardrobes beyond their capacity.
                </li>
                <li>
                  <strong>Finish:</strong> Touch up or re-polish worn areas
                  early.
                </li>
                <li>
                  <strong>Records:</strong> Keep your quotation, specifications
                  and warranty terms, if provided, in a safe place.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Common Mistakes When Hiring a Carpenter for Your Home
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  Giving each room to a different carpenter and ending up with
                  mismatched finishes.
                </li>
                <li>
                  Choosing only on price without comparing materials and
                  hardware.
                </li>
                <li>
                  Using the same material in every room, including damp areas.
                </li>
                <li>
                  Skipping a drawing or size agreement before work begins.
                </li>
                <li>
                  Fixing woodwork before wiring, plastering and waterproofing
                  are complete.
                </li>
                <li>
                  Not planning storage around the family&apos;s actual
                  belongings.
                </li>
                <li>Ignoring termite and moisture protection.</li>
                <li>
                  Paying a large advance before design approval.
                </li>
                <li>
                  Not protecting floors, walls and furniture during work.
                </li>
                <li>
                  Not clarifying finish, timeline and warranty in writing.
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
                  <strong>Photos and videos:</strong> Each room involved, along
                  with doors, windows and existing furniture.
                </li>
                <li>
                  <strong>What you need:</strong> Wardrobes, TV unit, doors,
                  kitchen woodwork, pooja unit or a full plan.
                </li>
                <li>
                  <strong>Family details:</strong> Number of members, children,
                  elders and any special needs.
                </li>
                <li>
                  <strong>Storage needs:</strong> What you must store and what
                  you want to display.
                </li>
                <li>
                  <strong>Style and finish:</strong> Laminate, veneer, paint or
                  polish, and the colours you like.
                </li>
                <li>
                  <strong>Existing woodwork:</strong> What you want to keep,
                  repair, match or remove.
                </li>
                <li>
                  <strong>Budget range:</strong> The amount you are comfortable
                  spending.
                </li>
                <li>
                  <strong>Timeline:</strong> Any festival, wedding or move-in
                  date.
                </li>
                <li>
                  <strong>Access details:</strong> Floor, lift, parking, noise
                  rules and society restrictions.
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
                  <strong>Architecture and interior:</strong> Planned design
                  for kitchens, bedrooms, living areas and offices.
                </li>
                <li>
                  <strong>Doorstep home services:</strong> Carpenter, painter,
                  electrician, plumber, tile and marble, false ceiling and
                  more.
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
                Why Choose MTBOSS as Your Carpenter for Home in Bareilly
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Whole-home thinking:</strong> We plan carpentry
                  across rooms so style, finish and hardware match.
                </li>
                <li>
                  <strong>Measure first, build later:</strong> We study each
                  room before suggesting a design or price.
                </li>
                <li>
                  <strong>Material guidance by room:</strong> We explain which
                  wood or board suits each space and why.
                </li>
                <li>
                  <strong>Drawing before cutting:</strong> You see and approve
                  the plan first.
                </li>
                <li>
                  <strong>Builder and interior team together:</strong>{" "}
                  Carpentry is sequenced with painting, electrical, plumbing
                  and civil work.
                </li>
                <li>
                  <strong>Free Budget Calculator:</strong> A simple starting
                  estimate before you commit.
                </li>
                <li>
                  <strong>Transparent estimates:</strong> Written, itemised
                  quotes with materials and brands stated clearly.
                </li>
                <li>
                  <strong>Single point of contact:</strong> One team handles
                  design, fabrication, installation and handover.
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
                Contact MTBOSS: Carpenter for Home in Bareilly
              </h3>

              <p className="mb-3">
                If you are looking for a carpenter for your home in Bareilly,
                MTBOSS offers a single point of contact for measurement,
                design, fabrication, installation and handover, supported by a
                free budget calculator and a simple online quote request.
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
                    href="https://www.mtboss.in/quick/carpenter"
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.mtboss.in/quick/carpenter
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
                    Q1. What does a carpenter for home do in Bareilly?
                  </strong>
                  <br />
                  A home carpenter measures your rooms, designs and makes
                  wardrobes, units, doors and other woodwork, finishes them and
                  fits them in your home. The exact scope is written in the
                  agreement.
                </li>

                <li>
                  <strong>
                    Q2. Does MTBOSS provide carpenter services for homes in
                    Bareilly?
                  </strong>
                  <br />
                  MTBOSS Construction Private Limited serves Moradabad and
                  Bareilly and offers carpentry as one of its services. Share
                  your locality and requirements with the team to confirm scope
                  and arrangements.
                </li>

                <li>
                  <strong>
                    Q3. Should I hire one carpenter for the whole home?
                  </strong>
                  <br />
                  Often yes. One plan keeps finishes and hardware consistent,
                  simplifies scheduling and gives you a single estimate. You
                  can still build in stages to match your budget.
                </li>

                <li>
                  <strong>
                    Q4. When should I plan carpentry in a new home?
                  </strong>
                  <br />
                  Early, before painting and electrical work are finalised, so
                  wiring, lights and wall positions can match the carpentry
                  design.
                </li>

                <li>
                  <strong>
                    Q5. Can I stay at home while carpentry work is going on?
                  </strong>
                  <br />
                  Often yes, but dust, noise and limited access are common.
                  Discuss the schedule and protection with the team before work
                  begins.
                </li>

                <li>
                  <strong>
                    Q6. Which wood or board should I use in different rooms?
                  </strong>
                  <br />
                  Kitchens and areas near water need moisture-resistant boards.
                  Bedrooms and living rooms can use plywood or HDHMR. Doors and
                  frames benefit from treated solid wood.
                </li>

                <li>
                  <strong>
                    Q7. How much does home carpentry cost in Bareilly?
                  </strong>
                  <br />
                  The cost depends on the number of rooms, items, size,
                  material, finish, hardware and design complexity. Use the
                  free MTBOSS Budget Calculator for a starting estimate and
                  request a detailed quote after a site visit.
                </li>

                <li>
                  <strong>Q8. How long does home carpentry take?</strong>
                  <br />
                  A single piece takes less time than a whole-home plan. The
                  timeline depends on design, material availability and
                  coordination with other trades, and it is confirmed in your
                  agreement.
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