import React from "react";
import LandingEnquiry from "../../components/LandingEnquiry";

const Content = () => {
  return (
    <div className="min-h-screen bg-white pt-0">
      <div className="flex flex-col lg:flex-row">
        {/* Content Section */}
        <div className="order-1 flex-1 px-4 py-12 sm:px-8 md:px-16 lg:order-1">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl md:text-3xl">
            Doors That Fit, Close and Last
          </h2>

          <div className="max-w-4xl space-y-6 leading-relaxed text-gray-700">
            <section>
              <p>
                A door does more than separate two rooms. It gives security,
                privacy, sound control and a first impression. A well-made door
                swings smoothly, closes with a soft click, locks securely and
                stays straight through every monsoon. A badly made door rubs
                against the frame, sags on its hinges, swells in humid weather
                and lets in dust, noise and insects.
              </p>

              <p className="mt-3">
                If you are looking for a carpenter for door work in Bareilly,
                this page will help you do three things: understand the choices
                in door types, frames, hardware and finish, know what to check
                before you hire, and see how MTBOSS plans and handles door work
                for homes, flats and offices. MTBOSS Construction Private
                Limited is an architect, interior designer and construction
                company serving Moradabad and Bareilly. It offers carpentry,
                door work, modular kitchens, interiors, renovation,
                waterproofing and other home services with transparent pricing
                and on-time delivery.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Door Work at a Glance
              </h3>

              <p className="mb-3">
                Your home, security needs and budget matter more than any
                template. MTBOSS helps you plan door work that suits your
                property.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2">
                        Door work
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Common examples
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Planning priority
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        New main door
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Solid wood, panel, carved, steel-wood combination
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Security, strength, weather resistance
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Room doors
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Flush doors, laminated doors, panel doors
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Look, weight, matching finish
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Bathroom doors
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Waterproof or moisture-resistant doors
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Water resistance, ventilation
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Door frames
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Wooden or composite frames
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Strength, termite resistance, alignment
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Door fitting
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Hanging, hinges, locks, handles, stoppers
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Level, gap, smooth swing
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Repair
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Rubbing, sagging, swelling, broken lock, loose frame
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Cause of problem, correct fix
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Safety and screen doors
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Mosquito mesh doors, grill doors, security doors
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Ventilation, safety, durability
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Sliding and folding doors
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Sliding doors for balconies, partitions
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Track quality, space, sealing
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Polish and finishing
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Polish, paint, laminate, veneer
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Even finish, matching colour
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
                Door Work Services Offered by MTBOSS for Bareilly Clients
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Site visit and measurement:</strong> Recording opening
                  size, wall thickness, frame condition and swing direction.
                </li>
                <li>
                  <strong>Main door supply and fitting:</strong> Strong doors
                  with frames, hinges, locks and finish for the entrance.
                </li>
                <li>
                  <strong>Room and bedroom doors:</strong> Flush, laminated or
                  panel doors with matching frames.
                </li>
                <li>
                  <strong>Bathroom and balcony doors:</strong>{" "}
                  Moisture-resistant doors suited to wet or exposed areas.
                </li>
                <li>
                  <strong>Door frame work:</strong> New frames, frame repair
                  and re-fixing of loose frames.
                </li>
                <li>
                  <strong>Door fitting and hanging:</strong> Levelling, hinge
                  fixing, gap setting and alignment.
                </li>
                <li>
                  <strong>Lock, handle and latch fitting:</strong> Mortise
                  locks, handles, bolts, tower bolts and door stoppers.
                </li>
                <li>
                  <strong>Door repair:</strong> Fixing rubbing, sagging,
                  swollen, warped or damaged doors.
                </li>
                <li>
                  <strong>Mosquito and safety doors:</strong> Mesh frames,
                  grills and security doors, where suitable.
                </li>
                <li>
                  <strong>Sliding and folding doors:</strong> Fitting of
                  sliding or folding doors for balconies and partitions,
                  subject to space.
                </li>
                <li>
                  <strong>Polish, paint and finishing:</strong> Polish, paint,
                  laminate or veneer, matched to the surrounding area.
                </li>
                <li>
                  <strong>Termite and moisture protection:</strong> Treated
                  wood or protective coatings for frames and doors.
                </li>
                <li>
                  <strong>Installation and handover:</strong> Fixing, levelling,
                  checking and a final walk-through.
                </li>
                <li>
                  <strong>Related home services:</strong> Painter, electrician,
                  tile and marble, waterproofing and other home services
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
                Types of Doors: Which One Suits Which Place?
              </h3>

              <p className="mb-3">
                The right door depends on where it goes. A main door needs
                strength and security. A bedroom door needs smooth operation
                and a good look. A bathroom door needs to withstand water. A
                good carpenter recommends by location, not only by price.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2">
                        Door type
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
                        Solid wood door
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Very high
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Good if treated
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Main doors, premium rooms
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        High
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Panel door (wood)
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        High
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Good if treated
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Main and room doors with classic look
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Mid to high
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Flush door (wood core)
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Good
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Moderate
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Bedrooms, living areas
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Mid
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Plywood or laminated door
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Good
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Moderate to good
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Interior doors with many finish choices
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Mid
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Moisture-resistant or waterproof door
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Good
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        High
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Bathrooms, balconies, utility areas
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Mid
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Composite or engineered door
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Good
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Good
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Bathrooms, humid areas, budget needs
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Low to mid
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Steel or metal-wood combination
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Very high
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        High
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Main doors, security-focused entrances
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Mid to high
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Glass or partly glazed door
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Varies
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Varies
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Balconies, partitions, light-filled areas
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Mid to high
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Door Frames: The Part You Rarely See but Always Depend On
              </h3>

              <p className="mb-3">
                A door is only as good as its frame. A strong door in a weak
                frame will still sag or rub.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Wooden frames:</strong> Strong and traditional, best
                  when seasoned and treated against termites.
                </li>
                <li>
                  <strong>Composite and engineered frames:</strong> Resistant
                  to moisture and termites, suitable for bathrooms and damp
                  areas.
                </li>
                <li>
                  <strong>Steel frames:</strong> Very strong and termite-proof,
                  often used with certain door types.
                </li>
                <li>
                  <strong>Size and fit:</strong> The frame must match the
                  opening and wall thickness exactly.
                </li>
                <li>
                  <strong>Fixing:</strong> Strong anchors or fixing into the
                  wall keep the frame from shifting.
                </li>
                <li>
                  <strong>Level and plumb:</strong> The frame must be perfectly
                  vertical and level, or the door will never hang well.
                </li>
                <li>
                  <strong>Gap and sealing:</strong> Even gaps and proper
                  sealing keep dust, insects and noise out.
                </li>
              </ul>

              <p className="mt-3">
                Replacing a door without checking the frame often leads to the
                same problems returning.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Hardware: Hinges, Locks and Fittings
              </h3>

              <p className="mb-3">
                Good hardware adds to the cost but makes a big difference in
                security and daily use. Ask for brand and type to be written in
                the quote.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2">
                        Item
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        What to check
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Hinges
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Strong, rust-resistant, correct size and number for
                        door weight
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Main door lock
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Secure mortise or multi-point lock, good quality body
                        and keys
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Latch and handle
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Smooth action, firm fixing, comfortable grip
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Bolts and tower bolts
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Solid construction, easy movement
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Door stopper
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Protects walls and doors from impact
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Door closer
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Suitable for heavy or main doors, where needed
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Eye viewer or smart lock
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Optional safety and convenience features
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Screws and fixing
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Correct length and strength for door and frame
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Common Door Problems and What Causes Them
              </h3>

              <p className="mb-3">
                A good carpenter finds the cause first. Planing a swollen door
                without fixing the moisture problem only gives a short-term
                fix.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2">
                        Problem
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Likely cause
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Usual fix
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Door rubs against the frame
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Swelling, loose hinges, frame shift
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Adjust hinges, plane edges, re-fix the frame
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Door sags or drops
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Weak or loose hinges, heavy door, damaged frame
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Replace or reinforce hinges, repair frame
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Door will not close or latch
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Misalignment, warped door, shifted frame
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Realign, adjust latch, correct the frame
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Door swells in monsoon
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Moisture absorption, unsealed edges
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Seal edges, treat surface, check ventilation
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Gap at top or sides
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Uneven frame, wrong size, poor fitting
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Re-hang, adjust or replace frame or door
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Door is warped
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Moisture, poor wood quality, uneven drying
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Repair if mild, replace if severe
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Lock is loose or stuck
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Worn parts, misalignment
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Repair or replace lock, realign strike plate
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Termite signs on door or frame
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Untreated wood, damp walls
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Treat, repair affected area, replace if weakened
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Door is noisy
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Dry hinges, loose parts
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Lubricate, tighten, replace worn parts
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                What a Good Door Carpenter Actually Does
              </h3>

              <p className="mb-3">
                The job is more than hanging a door. A reliable door carpenter
                follows a sequence, and you should expect to see it.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Measures the opening exactly:</strong> Width, height,
                  wall thickness and swing direction decide the door and frame.
                </li>
                <li>
                  <strong>Checks the wall and frame condition:</strong> Damp
                  walls, cracks and loose frames affect the result.
                </li>
                <li>
                  <strong>Recommends the right door for the place:</strong>{" "}
                  Main, bedroom, bathroom and balcony doors need different
                  choices.
                </li>
                <li>
                  <strong>Selects and treats the material:</strong> Seasoned,
                  treated wood or suitable boards protect against moisture and
                  termites.
                </li>
                <li>
                  <strong>Fixes the frame properly:</strong> Level, plumb and
                  anchored securely.
                </li>
                <li>
                  <strong>Hangs the door with even gaps:</strong> Gaps should
                  be equal on all sides.
                </li>
                <li>
                  <strong>Fits quality hardware:</strong> Hinges, locks and
                  latches are chosen for weight and security.
                </li>
                <li>
                  <strong>Finishes neatly:</strong> Polish, paint, laminate or
                  veneer is even, with clean edges.
                </li>
                <li>
                  <strong>Tests and adjusts:</strong> Swing, closing, locking
                  and latching are checked before handover.
                </li>
                <li>
                  <strong>Cleans up:</strong> Sawdust and offcuts are removed.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Questions to Ask Before You Hire a Door Carpenter
              </h3>

              <p className="mb-3">
                Use these questions with any carpenter, including us.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>
                    Will you visit and measure the opening before giving a
                    price?
                  </strong>{" "}
                  The answer should be yes.
                </li>
                <li>
                  <strong>
                    Which door type do you recommend for each location, and
                    why?
                  </strong>{" "}
                  Ask for reasons.
                </li>
                <li>
                  <strong>
                    Is the frame included, and what is it made of?
                  </strong>{" "}
                  Frame quality matters as much as the door.
                </li>
                <li>
                  <strong>
                    How is the wood protected against termites and moisture?
                  </strong>{" "}
                  Ask for treatment details.
                </li>
                <li>
                  <strong>Which hinge and lock brand is included?</strong> Get
                  the name written down.
                </li>
                <li>
                  <strong>How will you fix the frame to the wall?</strong> Ask
                  about anchors and levelling.
                </li>
                <li>
                  <strong>What finish is included?</strong> Polish, paint,
                  laminate or veneer should be stated.
                </li>
                <li>
                  <strong>
                    Is the old door removed and carried away?
                  </strong>{" "}
                  Clarify removal and debris.
                </li>
                <li>
                  <strong>What is the timeline and payment schedule?</strong>{" "}
                  Payments should follow progress.
                </li>
                <li>
                  <strong>What warranty or follow-up is offered?</strong> Get
                  the terms written.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Warning Signs of a Weak Door Carpenter
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  Quotes a price without measuring the opening or seeing the
                  frame.
                </li>
                <li>Cannot show any completed door work.</li>
                <li>
                  Offers a lump-sum quote with no breakup of door, frame and
                  hardware.
                </li>
                <li>
                  Uses words like &quot;pure wood&quot; without naming the type
                  or treatment.
                </li>
                <li>
                  Replaces the door but ignores a damaged or crooked frame.
                </li>
                <li>Fits a heavy door on weak hinges.</li>
                <li>Skips termite and moisture protection.</li>
                <li>
                  Leaves uneven gaps or a door that does not close properly.
                </li>
                <li>
                  Asks for the full payment before starting.
                </li>
                <li>Gives no written timeline or warranty.</li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Door Work Planning by Location and Property Type
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Main Entrance:</strong> Choose a strong door and
                  frame, a secure lock and weather-resistant finish. A door
                  closer and eye viewer can add convenience.
                </li>
                <li>
                  <strong>Bedrooms and Living Areas:</strong> Flush or
                  laminated doors with matching frames give a clean look and
                  smooth operation. Match finishes across rooms.
                </li>
                <li>
                  <strong>Bathrooms and Utility Areas:</strong> Choose
                  moisture-resistant or composite doors and frames. Allow
                  ventilation to prevent damp and swelling.
                </li>
                <li>
                  <strong>Balcony and Terrace:</strong> Choose doors that
                  handle sun and rain, with good sealing. Sliding or glass
                  doors need quality tracks and frames.
                </li>
                <li>
                  <strong>Independent House or Villa:</strong> Plan doors for
                  the whole house together so finishes and hardware match, and
                  coordinate with painting and flooring work.
                </li>
                <li>
                  <strong>Apartment or Flat:</strong> Doors need to meet society
                  rules and match the building&apos;s look. Confirm working
                  hours, lift use and noise rules before work.
                </li>
                <li>
                  <strong>Older Home:</strong> Old frames may be warped, damp or
                  termite-affected. An inspection shows what can be repaired
                  and what needs replacement.
                </li>
                <li>
                  <strong>New Construction:</strong> The best time to plan door
                  work. Frames can be fixed during construction, and doors hung
                  after plastering and painting preparation.
                </li>
                <li>
                  <strong>Commercial Office or Shop:</strong> Doors need
                  strength, security and a neat look. Work should be planned to
                  limit business downtime.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Bareilly Planning Notes for Door Work
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Monsoon humidity:</strong> Wood absorbs moisture and
                  swells. Seal all faces, including top and bottom edges, and
                  keep doors ventilated.
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
                  <strong>Termite risk:</strong> Frames, especially at ground
                  level, benefit from treated wood or termite-resistant
                  materials.
                </li>
                <li>
                  <strong>Damp walls:</strong> Fix leaks and dampness before
                  fixing frames into walls.
                </li>
                <li>
                  <strong>Dust and insects:</strong> Good sealing and mesh
                  doors keep rooms cleaner.
                </li>
                <li>
                  <strong>Security:</strong> Choose strong locks and frames for
                  main entrances.
                </li>
                <li>
                  <strong>Festival and wedding seasons:</strong> Plan door work
                  early so it is complete before guests arrive.
                </li>
                <li>
                  <strong>Society rules:</strong> Check lift, parking, noise
                  and debris disposal rules before work.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Choose Your Door Work Plan
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Repair visit plan:</strong> A short visit to fix
                  rubbing, sagging, loose hinges or broken locks.
                </li>
                <li>
                  <strong>Single door plan:</strong> One new door and frame
                  with matching finish.
                </li>
                <li>
                  <strong>Main door plan:</strong> Strong door, secure lock,
                  frame and weather-resistant finish.
                </li>
                <li>
                  <strong>Room doors plan:</strong> Matching doors and frames
                  for bedrooms, living areas and study.
                </li>
                <li>
                  <strong>Bathroom and balcony doors plan:</strong>{" "}
                  Moisture-resistant doors suited to wet or exposed areas.
                </li>
                <li>
                  <strong>Door and window plan:</strong> Doors and windows
                  planned together for matching finish and fixing.
                </li>
                <li>
                  <strong>Renovation plan:</strong> Replacing or repairing
                  doors and frames throughout an older home.
                </li>
                <li>
                  <strong>New home plan:</strong> All doors and frames planned
                  with painting and flooring.
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
                Factors That Affect Door Work Cost in Bareilly
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Type of door:</strong> Solid wood, panel, flush,
                  laminated and composite doors are priced differently.
                </li>
                <li>
                  <strong>Size and thickness:</strong> Larger or thicker doors
                  cost more.
                </li>
                <li>
                  <strong>Frame material:</strong> Wood, composite and steel
                  frames have different prices.
                </li>
                <li>
                  <strong>Number of doors:</strong> More doors increase the
                  total, and bulk orders may be planned differently.
                </li>
                <li>
                  <strong>Hardware brand and type:</strong> Better hinges,
                  locks and closers cost more but last longer.
                </li>
                <li>
                  <strong>Finish:</strong> Polish, paint, laminate, veneer and
                  carving have different costs.
                </li>
                <li>
                  <strong>Design complexity:</strong> Carving, glass panels and
                  special details add labour.
                </li>
                <li>
                  <strong>Treatment:</strong> Termite and moisture protection
                  adds cost but protects the work.
                </li>
                <li>
                  <strong>Site condition:</strong> Damaged frames, uneven walls
                  and old doors add preparation work.
                </li>
                <li>
                  <strong>Removal of old doors:</strong> Taking out and
                  carrying away old doors and frames adds effort.
                </li>
                <li>
                  <strong>Timeline:</strong> Faster schedules can change the
                  price.
                </li>
              </ul>

              <p className="mt-3">
                Door work is generally priced by door, size and scope, and the
                range is wide because choices differ. Your quote depends on the
                site visit, so use the free MTBOSS Budget Calculator on the
                website for a starting estimate and request a detailed quote
                after measurement.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Budget Priorities for Door Work
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>First:</strong> Security and safety. Main door, frame
                  and lock come before decorative upgrades.
                </li>
                <li>
                  <strong>Second:</strong> Measurement and fit. A well-fitted
                  door saves more than any discount.
                </li>
                <li>
                  <strong>Third:</strong> Frame quality. A strong, treated
                  frame prevents repeat problems.
                </li>
                <li>
                  <strong>Fourth:</strong> Door type by location. Match
                  material to moisture, load and use.
                </li>
                <li>
                  <strong>Fifth:</strong> Hardware. Hinges and locks are used
                  every day.
                </li>
                <li>
                  <strong>Sixth:</strong> Finish. Choose polish, paint,
                  laminate or veneer to suit use and budget.
                </li>
                <li>
                  <strong>Seventh:</strong> Extras. Carving, glass inserts,
                  smart locks and decorative details can follow later.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                How MTBOSS Approaches a Door Work Project
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Step 1 — Enquiry and discussion:</strong> Contact
                  MTBOSS through the website, phone or WhatsApp and share which
                  doors you need, whether new or repair, and your budget.
                </li>
                <li>
                  <strong>Step 2 — Photos and details:</strong> Sending photos
                  or a short video of the doors and frames helps the team
                  prepare before the visit.
                </li>
                <li>
                  <strong>Step 3 — Budget Calculator:</strong> The free
                  calculator on our website gives a starting estimate before
                  the visit.
                </li>
                <li>
                  <strong>Step 4 — Site visit and measurement:</strong> The
                  team checks opening size, wall thickness, frame condition and
                  swing direction. Share your locality in Bareilly, and the
                  team will confirm arrangements.
                </li>
                <li>
                  <strong>Step 5 — Diagnosis and options:</strong> You and the
                  team discuss repair, partial replacement or new work.
                </li>
                <li>
                  <strong>Step 6 — Door, frame and hardware selection:</strong>{" "}
                  Door type, frame material, hinges, locks and finish are
                  chosen with clear reasons.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Care After Your Door Work Is Done
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  Wipe doors with a soft, slightly damp cloth, then dry them.
                </li>
                <li>
                  Keep doors and frames away from constant water, and fix leaks
                  quickly.
                </li>
                <li>
                  Lubricate hinges and locks once or twice a year.
                </li>
                <li>
                  Tighten loose screws, hinges and handles early.
                </li>
                <li>
                  Do not slam doors or hang heavy items on them.
                </li>
                <li>
                  Keep bathroom doors ventilated to limit swelling.
                </li>
                <li>
                  Re-polish or repaint exposed doors when the finish fades,
                  especially main doors.
                </li>
                <li>
                  Inspect frames for termite signs, such as mud trails or fine
                  dust, at least once a year.
                </li>
                <li>
                  Keep your quotation, specifications and warranty terms, if
                  provided, in a safe place.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Common Mistakes in Door Work
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  Replacing the door but keeping a damaged or crooked frame.
                </li>
                <li>
                  Choosing a bedroom-type door for a bathroom or balcony.
                </li>
                <li>
                  Using weak or too few hinges on heavy doors.
                </li>
                <li>
                  Fixing frames into damp walls without fixing the dampness
                  first.
                </li>
                <li>Skipping termite and moisture protection.</li>
                <li>
                  Not sealing the top and bottom edges of wooden doors.
                </li>
                <li>
                  Choosing a lock only by looks and ignoring build quality.
                </li>
                <li>
                  Ignoring floor level and finished floor thickness, so the
                  door cannot swing freely.
                </li>
                <li>
                  Paying a large advance before measurements and design are
                  agreed.
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
                  of home, floor and location of each door.
                </li>
                <li>
                  <strong>Photos and videos:</strong> Doors, frames, walls and
                  floor near the door.
                </li>
                <li>
                  <strong>What you need:</strong> New doors, frame replacement,
                  repair, locks or a full set.
                </li>
                <li>
                  <strong>Approximate sizes:</strong> Opening width and height,
                  if you know them.
                </li>
                <li>
                  <strong>Current problems:</strong> Rubbing, sagging,
                  swelling, gaps, loose frame or damaged lock.
                </li>
                <li>
                  <strong>Security needs:</strong> Extra locks, safety doors or
                  mesh doors, if required.
                </li>
                <li>
                  <strong>Style and finish:</strong> Polish, paint, laminate or
                  veneer, and the colours you like.
                </li>
                <li>
                  <strong>Existing doors:</strong> What you want to keep,
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
                Why Choose MTBOSS as Your Door Work Carpenter in Bareilly
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Measure first, quote later:</strong> We study the
                  opening, frame and wall before suggesting a door or price.
                </li>
                <li>
                  <strong>Cause-first repairs:</strong> We find why a door
                  rubs, sags or swells before fixing it.
                </li>
                <li>
                  <strong>Right door for the right place:</strong> We explain
                  which door and frame suit each location and why.
                </li>
                <li>
                  <strong>
                    Frame and hardware included in the plan:
                  </strong>{" "}
                  Door, frame, hinges and locks are planned together.
                </li>
                <li>
                  <strong>Builder and interior team together:</strong> Door
                  work is sequenced with civil, painting and flooring work.
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
                  measurement, supply, fitting and handover.
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
                Contact MTBOSS: Carpenter for Door Work in Bareilly
              </h3>

              <p className="mb-3">
                If you are looking for a carpenter for door work in Bareilly,
                MTBOSS offers a single point of contact for measurement,
                supply, fitting, repair and handover, supported by a free
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
                    Q1. What does a carpenter for door work in Bareilly do?
                  </strong>
                  <br />
                  A door carpenter measures the opening, supplies and fits
                  doors and frames, installs hinges and locks, repairs problems
                  such as rubbing or sagging, and finishes the work. The exact
                  scope is written in the agreement.
                </li>

                <li>
                  <strong>
                    Q2. Does MTBOSS provide door work in Bareilly?
                  </strong>
                  <br />
                  MTBOSS Construction Private Limited serves Moradabad and
                  Bareilly and offers carpentry, including door work, as one of
                  its services. Share your locality and requirements with the
                  team to confirm scope and arrangements.
                </li>

                <li>
                  <strong>
                    Q3. Which door is best for a main entrance?
                  </strong>
                  <br />
                  A strong door with a sturdy, treated frame and a secure lock
                  suits a main entrance. Solid wood, panel and steel-wood
                  combinations are common. The right choice depends on budget,
                  look and security needs.
                </li>

                <li>
                  <strong>Q4. Which door is best for a bathroom?</strong>
                  <br />
                  Moisture-resistant or composite doors and frames handle water
                  better than ordinary wooden doors. Ventilation also helps
                  prevent swelling.
                </li>

                <li>
                  <strong>
                    Q5. Why does my door get stuck in the monsoon?
                  </strong>
                  <br />
                  Wood absorbs moisture and swells in humid weather. Sealing
                  all edges, treating the surface, fixing damp walls and
                  allowing ventilation help reduce the problem. A carpenter can
                  check the cause.
                </li>

                <li>
                  <strong>
                    Q6. Can you repair my door instead of replacing it?
                  </strong>
                  <br />
                  Often yes. Rubbing, sagging, loose hinges, broken locks and
                  worn finishes can usually be repaired, subject to inspection.
                  Badly warped or termite-damaged doors may need replacement.
                </li>

                <li>
                  <strong>
                    Q7. Do I need to replace the frame when I change the door?
                  </strong>
                  <br />
                  Not always. If the frame is straight, sound and the right
                  size, it can often be reused. A crooked, damaged or
                  termite-affected frame should be repaired or replaced.
                </li>

                <li>
                  <strong>
                    Q8. How much does door work cost in Bareilly?
                  </strong>
                  <br />
                  The cost depends on the type of door, size, frame, hardware,
                  finish and number of doors. Use the free MTBOSS Budget
                  Calculator for a starting estimate and request a detailed
                  quote after a site visit.
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