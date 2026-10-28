import React from "react";
import LandingEnquiry from "../../components/LandingEnquiry";

const Content = () => {
  return (
    <div className="min-h-screen bg-white pt-0">
      <div className="flex flex-col lg:flex-row">
        {/* Content Section */}
        <div className="order-1 flex-1 px-4 py-12 sm:px-8 md:px-16 lg:order-1">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl md:text-3xl">
            Interior Decorator in Bareilly: Styling, Colour, Lighting and
            Finishing Touches for Your Home
          </h2>

          <div className="max-w-4xl space-y-6 leading-relaxed text-gray-700">
            <section>
              <p>
                Sometimes a home does not need walls moved or a full renovation.
                It needs the right colours, better lighting, smarter furniture
                placement and a few well-chosen finishing touches. That is where
                an interior decorator helps. Decoration is often the fastest and
                most affordable way to change how a home looks and feels,
                especially for rooms that are structurally fine but feel flat,
                dull or unfinished.
              </p>

              <p className="mt-3">
                This page explains what an interior decorator does, how
                decoration differs from interior design, and how MTBOSS
                approaches styling and finishing for clients in Bareilly. MTBOSS
                Construction Private Limited is a Moradabad-based architect,
                interior designer and construction company that builds
                residential projects from affordable housing to luxury villas,
                serving Moradabad and Bareilly with quality work, transparent
                pricing and on-time delivery.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                What Does an Interior Decorator Do?
              </h3>

              <p className="mb-3">
                An interior decorator focuses on the surface and styling of a
                space: colours, paint and wall finishes, lighting, furniture
                arrangement, soft furnishings, wall decor and accessories.
                Decorators usually work within the existing layout and structure
                of the room.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2">
                        Area
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        What a decorator typically handles
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Colour and paint
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Colour schemes, paint finishes, accent walls, textures
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Lighting
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Placement of lamps, pendants, wall lights and bulbs
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Furniture arrangement
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Placing existing or new furniture for comfort and flow
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Soft furnishings
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Curtains, cushions, rugs, bedding and upholstery choices
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Wall decor
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Art, mirrors, shelves, wallpaper and panels
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Accessories and greenery
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Decor pieces, vases, plants and styling details
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Finishing touches
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Small repairs, hardware and final styling
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-3">
                Your room, style and budget matter more than the label. MTBOSS
                helps you decide what your space needs.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Interior Decorator or Interior Designer: Which Do You Need?
              </h3>

              <p className="mb-3">
                The two roles overlap, but they solve different problems.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2">
                        Question
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Interior decorator
                      </th>
                      <th className="border border-gray-300 px-3 py-2">
                        Interior designer
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Main focus
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Look, feel and styling
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Layout, function and overall planning
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Typical work
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Paint, lighting, furnishings, accessories
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Space planning, civil changes, kitchens, wardrobes,
                        ceilings
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Structural changes
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Usually none
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Often included or coordinated
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Best for
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Refreshing rooms, finishing a new home, styling
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        New homes, renovations, kitchens, full-home projects
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">
                        Project size
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Single rooms or full-home styling
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        Medium to large projects
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-3">
                Many projects need both: design to plan the space, and decoration
                to complete it. MTBOSS is an architect, interior designer and
                construction company, so planning and finishing can be
                coordinated under one roof.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                MTBOSS Construction Private Limited
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  Moradabad-based company offering construction services,
                  doorstep home services, verified property transactions and
                  building materials under one company.
                </li>
                <li>
                  Office at Harthala, Kanth Road, Behind KR Collection, near
                  Domino&apos;s, Moradabad.
                </li>
                <li>
                  Serving Moradabad and Bareilly with residential projects from
                  affordable housing to luxury villas.
                </li>
                <li>
                  Project gallery and blog available on the MTBOSS website.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Decoration and Finishing Support Offered by MTBOSS for Bareilly
                Clients
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Decor planning and styling advice:</strong> Colour
                  schemes, furniture placement and styling ideas shaped around
                  your room and taste.
                </li>
                <li>
                  <strong>Paint and wall finishes:</strong> Paint colours,
                  finishes and wall treatments, with attention to surface
                  preparation.
                </li>
                <li>
                  <strong>Lighting plans:</strong> Placement and mix of ambient,
                  task and accent lighting.
                </li>
                <li>
                  <strong>Ceiling and wall detailing:</strong> Simple ceiling
                  designs, panels and feature walls, planned together with
                  lighting.
                </li>
                <li>
                  <strong>Flooring and tile choices:</strong> Tile, marble or
                  other flooring selections that suit your style, with tiles
                  available through MTBOSS&apos;s wholesale supply.
                </li>
                <li>
                  <strong>Woodwork and carpentry:</strong> Doors, shelves, panels
                  and custom woodwork, and doorstep carpenter services for
                  smaller jobs.
                </li>
                <li>
                  <strong>Painting services:</strong> Doorstep painter services
                  for refreshing walls and woodwork.
                </li>
                <li>
                  <strong>Full interior design coordination:</strong> If your
                  project needs layout changes, kitchens, wardrobes or ceilings,
                  the interior design team can plan them together with the decor.
                </li>
                <li>
                  <strong>Renovation and remodelling:</strong> Updating existing
                  homes and workspaces, including repairs and waterproofing.
                </li>
              </ul>

              <p className="mt-3">
                Final scope for each project is discussed and confirmed with the
                MTBOSS team before work begins.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                The Elements of a Well-Decorated Room
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Colour:</strong> A clear palette, usually a base
                  colour, a secondary colour and one or two accents.
                </li>
                <li>
                  <strong>Light:</strong> A mix of natural light and layered
                  artificial lighting that suits different times of day.
                </li>
                <li>
                  <strong>Furniture placement:</strong> Comfortable seating,
                  clear walkways and a natural focus, such as a window, TV wall
                  or fireplace-style feature.
                </li>
                <li>
                  <strong>Texture:</strong> A mix of smooth and textured
                  materials, such as fabrics, wood, metal and wall finishes, for
                  depth.
                </li>
                <li>
                  <strong>Scale and proportion:</strong> Furniture and decor
                  that suit the size of the room.
                </li>
                <li>
                  <strong>Wall decor:</strong> Art, mirrors or shelves placed at
                  the right height and spacing.
                </li>
                <li>
                  <strong>Soft furnishings:</strong> Curtains, rugs and cushions
                  that add comfort and tie colours together.
                </li>
                <li>
                  <strong>Greenery:</strong> Plants or planters that bring life
                  and softness.
                </li>
                <li>
                  <strong>Restraint:</strong> Enough open space so the room does
                  not feel crowded.
                </li>
              </ul>

              <p className="mt-3">
                Good decoration is as much about what you leave out as what you
                add.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Decoration Ideas by Room
              </h3>

              <h4 className="mb-2 text-lg font-semibold text-gray-900">
                Living room
              </h4>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  A feature wall with soft lighting behind the sofa or TV.
                </li>
                <li>
                  A layered lighting plan with a ceiling light, floor lamp and
                  accent lights.
                </li>
                <li>
                  A rug that anchors the seating area, and curtains that frame
                  the windows.
                </li>
                <li>
                  A few well-chosen decor pieces rather than many small ones.
                </li>
              </ul>

              <h4 className="mb-2 mt-5 text-lg font-semibold text-gray-900">
                Bedroom
              </h4>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  A calm colour palette with a textured or panelled headboard
                  wall.
                </li>
                <li>Soft bedside lighting and warm bulbs.</li>
                <li>Layered bedding and curtains for comfort.</li>
                <li>Clutter-free surfaces with simple decor.</li>
              </ul>

              <h4 className="mb-2 mt-5 text-lg font-semibold text-gray-900">
                Dining area
              </h4>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>A pendant or cluster light above the table.</li>
                <li>A mirror or wall art that adds depth.</li>
                <li>A runner or centrepiece that suits the table size.</li>
              </ul>

              <h4 className="mb-2 mt-5 text-lg font-semibold text-gray-900">
                Kitchen
              </h4>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>A durable, easy-to-clean colour scheme.</li>
                <li>Task lighting under cabinets.</li>
                <li>
                  Simple, practical decor such as plants or neat open shelves.
                </li>
              </ul>

              <h4 className="mb-2 mt-5 text-lg font-semibold text-gray-900">
                Puja room
              </h4>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>Warm lighting and a calm, uncluttered layout.</li>
                <li>
                  Traditional or minimal decor, depending on your preference.
                </li>
              </ul>

              <h4 className="mb-2 mt-5 text-lg font-semibold text-gray-900">
                Entrance and foyer
              </h4>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>A welcoming nameplate, mirror or console with a lamp.</li>
                <li>A neat shoe and key storage arrangement.</li>
              </ul>

              <h4 className="mb-2 mt-5 text-lg font-semibold text-gray-900">
                Balcony
              </h4>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  Compact seating, plants and soft lighting for a relaxing
                  corner.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Budget-Friendly Ways to Refresh a Home
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Repaint with a new palette:</strong> A fresh colour
                  scheme can change a room more than new furniture.
                </li>
                <li>
                  <strong>Add an accent wall:</strong> One bold or textured wall
                  gives focus without a full renovation.
                </li>
                <li>
                  <strong>Upgrade the lighting:</strong> New fixtures and warmer
                  bulbs change the mood instantly.
                </li>
                <li>
                  <strong>Rearrange furniture:</strong> A new layout can improve
                  flow and light at no cost.
                </li>
                <li>
                  <strong>Change soft furnishings:</strong> New curtains,
                  cushions and rugs refresh the look quickly.
                </li>
                <li>
                  <strong>Declutter and style surfaces:</strong> Fewer,
                  better-placed items look more intentional.
                </li>
                <li>
                  <strong>Add greenery:</strong> Plants lift the feel of a room
                  and cost little.
                </li>
                <li>
                  <strong>Fix small issues first:</strong> Chipped paint, loose
                  handles and worn grout make even good decor look tired.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Decorating for Festivals and Family Occasions
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Plan lighting and colour themes:</strong> Warm lights
                  and simple colour accents suit festive seasons.
                </li>
                <li>
                  <strong>Prepare surfaces in advance:</strong> Fresh paint and
                  cleaned fittings before the occasion make decor look better.
                </li>
                <li>
                  <strong>Flexible furniture layouts:</strong> Arrange seating so
                  guests can move and gather comfortably.
                </li>
                <li>
                  <strong>Safe wiring for lights and decorations:</strong> Extra
                  lights need properly planned, safe electrical points.
                </li>
                <li>
                  <strong>Entrance first:</strong> The entrance and living area
                  make the first impression, so focus effort there.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Bareilly Planning Notes for Decor
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Summer heat:</strong> Light colours, breathable fabrics
                  and good ventilation keep rooms comfortable, and curtains or
                  blinds can reduce glare and heat.
                </li>
                <li>
                  <strong>Monsoon humidity:</strong> Moisture-resistant paint,
                  fabrics that dry quickly and good airflow protect finishes.
                </li>
                <li>
                  <strong>Winter chill:</strong> Warm lighting, rugs and layered
                  fabrics make rooms cosier.
                </li>
                <li>
                  <strong>Dust:</strong> Easy-to-clean surfaces and washable
                  fabrics reduce daily upkeep.
                </li>
                <li>
                  <strong>Festival and wedding seasons:</strong> Flexible layouts
                  and durable finishes handle extra guests and activity.
                </li>
                <li>
                  <strong>Power backup and lighting:</strong> Plan fixtures and
                  switches so lights work well with backup power.
                </li>
                <li>
                  <strong>Joint and extended families:</strong> Practical,
                  durable decor choices that suit different ages and tastes.
                </li>
              </ul>
            </section>

           

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Choosing Materials and Finishes for Decor That Lasts
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Paint:</strong> Washable, long-lasting systems suited
                  to Bareilly&apos;s weather, with proper surface preparation.
                </li>
                <li>
                  <strong>Wall textures and wallpapers:</strong> Durable options
                  that handle humidity and cleaning.
                </li>
                <li>
                  <strong>Lighting:</strong> Quality fixtures and bulbs with a
                  good mix of ambient, task and accent lighting.
                </li>
                <li>
                  <strong>Flooring:</strong> Tiles, vitrified or marble finishes,
                  with non-slip choices for bathrooms and balconies.
                </li>
                <li>
                  <strong>Woodwork:</strong> Quality boards and finishes for
                  shelves, panels and doors.
                </li>
                <li>
                  <strong>Hardware:</strong> Reliable handles, hinges and
                  fittings that last through daily use.
                </li>
                <li>
                  <strong>Fabrics:</strong> Durable, easy-to-clean choices for
                  curtains and upholstery.
                </li>
                <li>
                  <strong>Mirrors and glass:</strong> Safe, properly fixed
                  installations.
                </li>
              </ul>

              <p className="mt-3">
                Agree on specifications in writing before work begins, so quality
                and cost stay clear.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Factors That Affect Decoration Cost in Bareilly
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Number and size of rooms:</strong> The biggest cost
                  drivers.
                </li>
                <li>
                  <strong>Scope of work:</strong> Painting only, lighting and
                  styling, or a full refresh with woodwork and flooring.
                </li>
                <li>
                  <strong>Paint and finish level:</strong> Basic, standard and
                  premium paints and textures change the budget.
                </li>
                <li>
                  <strong>Lighting plan:</strong> Decorative and concealed
                  lighting adds to the total.
                </li>
                <li>
                  <strong>Wall treatments:</strong> Panels, wallpapers and
                  special finishes cost more than plain paint.
                </li>
                <li>
                  <strong>Woodwork and custom pieces:</strong> Made-to-measure
                  items cost more than ready-made ones.
                </li>
                <li>
                  <strong>Surface condition:</strong> Repairs, damp treatment and
                  levelling before decoration add to the cost.
                </li>
                <li>
                  <strong>Timeline:</strong> Faster schedules or changes in the
                  middle of work can affect cost.
                </li>
              </ul>

              <p className="mt-3">
                Start with the free MTBOSS Budget Calculator, then request a
                detailed quote after site visit and discussion.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Ways to Get More Value from Your Decor Budget
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Fix the basics first:</strong> Dampness, cracks and
                  wiring problems should be repaired before decoration.
                </li>
                <li>
                  <strong>Decide your palette early:</strong> A clear colour plan
                  prevents mismatched buying.
                </li>
                <li>
                  <strong>Invest in lighting and paint:</strong> They change the
                  look of a room more than most accessories.
                </li>
                <li>
                  <strong>Buy fewer, better pieces:</strong> Quality items last
                  longer and look better.
                </li>
                <li>
                  <strong>Plan in phases:</strong> Refresh the most-used rooms
                  first, and add details over time.
                </li>
                <li>
                  <strong>Keep records:</strong> Colour names, finish details and
                  fixture models help with future touch-ups.
                </li>
                <li>
                  <strong>Keep a contingency:</strong> A reserve protects against
                  price movement and design changes.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Keeping the Project on Track
              </h3>

              <p>
                MTBOSS supports a smooth project through stage-wise planning
                with clear milestones, regular site visits and single-team
                coordination.
              </p>

              <p className="mt-3">
                Tiles, paints and other materials are supplied on a wholesale
                basis through the Shop Now section of our website, so deliveries
                can be planned around progress and delays caused by shortages
                are reduced.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                What to Share at Your First Consultation
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Property details:</strong> Home, flat, office or shop,
                  with location in Bareilly and photos of the rooms.
                </li>
                <li>
                  <strong>Rooms to decorate:</strong> Full home or specific
                  rooms.
                </li>
                <li>
                  <strong>Current problems:</strong> What feels dull, dark,
                  cluttered or unfinished.
                </li>
                <li>
                  <strong>What you want to keep:</strong> Furniture, colours or
                  features you love.
                </li>
                <li>
                  <strong>Style preferences:</strong> Reference photos, colours
                  you like and colours you want to avoid.
                </li>
                <li>
                  <strong>Vastu and tradition:</strong> Any layout or colour
                  preferences.
                </li>
                <li>
                  <strong>Budget and timeline:</strong> Approximate figures help,
                  especially if you are preparing for an occasion.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                MTBOSS Services for Homeowners
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Construction and renovation:</strong> New homes, extra
                  floors, remodelling, repairs and waterproofing.
                </li>
                <li>
                  <strong>Property services:</strong> Verified property buying,
                  selling and renting in and around Moradabad, helpful if you
                  are still looking for a home.
                </li>
                <li>
                  <strong>Doorstep home services:</strong> Electrician, plumber,
                  AC repair, pest control, painter and carpenter services once
                  you move in.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Why Consider MTBOSS for Interior Decoration in Bareilly
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Architect, interior designer and builder:</strong>{" "}
                  Planning, finishing and construction coordinated together.
                </li>
                <li>
                  <strong>Residential range:</strong> From affordable homes to
                  luxury villas under one company.
                </li>
                <li>
                  <strong>Transparent estimates:</strong> Free Budget Calculator
                  and written quotes before work begins.
                </li>
                <li>
                  <strong>Material control:</strong> Direct supply of
                  construction materials, including tiles and paints.
                </li>
                <li>
                  <strong>Engineering-led approach:</strong> Focus on quality,
                  transparent pricing and on-time delivery.
                </li>
                <li>
                  <strong>Serving Moradabad and Bareilly:</strong> A team based
                  on Kanth Road, Moradabad, serving clients in both cities.
                </li>
                <li>
                  <strong>Visible track record:</strong> Project gallery and
                  blog on the MTBOSS website.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Contact MTBOSS: Interior Decoration for Bareilly
              </h3>

              <p className="mb-3">
                If you are planning to decorate or refresh your home in Bareilly,
                MTBOSS offers a single point of contact for styling, materials,
                finishing and handover.
              </p>

              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Company:</strong> MTBOSS Construction Private Limited
                </li>
                <li>
                  <strong>Website:</strong>{" "}
                  <a
                    href="https://www.MTBOSS.in"
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.MTBOSS.in
                  </a>
                </li>
                <li>
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:MTBOSS2016@gmail.com"
                    className="text-blue-600 underline"
                  >
                    MTBOSS2016@gmail.com
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
                  <strong>Office Address:</strong> Harthala, Kanth Road, Behind
                  KR Collection, near Domino&apos;s, Moradabad, Uttar Pradesh,
                  India.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                Frequently Asked Questions (FAQs)
              </h3>

              <ul className="ml-4 list-inside list-disc space-y-3">
                <li>
                  <strong>Q1. What does an interior decorator do?</strong>
                  <br />
                  An interior decorator styles a space using colours, paint,
                  lighting, furniture placement, soft furnishings, wall decor and
                  accessories, usually without changing the structure or layout.
                </li>

                <li>
                  <strong>
                    Q2. What is the difference between an interior decorator and
                    an interior designer?
                  </strong>
                  <br />
                  A decorator focuses on look, feel and styling, while a
                  designer also plans layouts, storage, ceilings, kitchens,
                  wardrobes and civil changes. Many projects use both.
                </li>

                <li>
                  <strong>
                    Q3. Does MTBOSS provide interior decoration in Bareilly?
                  </strong>
                  <br />
                  MTBOSS Construction Private Limited is an architect, interior
                  designer and construction company that serves Moradabad and
                  Bareilly. Share your project with the team to confirm the scope
                  and arrangements for your location.
                </li>

                <li>
                  <strong>Q4. Can I decorate only one room?</strong>
                  <br />
                  Yes. You can start with a single room, such as the living room
                  or bedroom, and extend later. Planning a colour and style
                  direction for the whole home helps rooms stay consistent.
                </li>

                <li>
                  <strong>
                    Q5. Can you refresh a home without major construction?
                  </strong>
                  <br />
                  Often, yes. Repainting, new lighting, rearranged furniture, new
                  soft furnishings and small woodwork can change a home&apos;s
                  look without structural work. A site visit helps the team
                  recommend what is worth doing.
                </li>

                <li>
                  <strong>
                    Q6. How much does interior decoration cost in Bareilly?
                  </strong>
                  <br />
                  Cost depends on the number and size of rooms, scope of work,
                  paint and finish level, lighting plan, wall treatments,
                  woodwork and the condition of surfaces. Use the free Budget
                  Calculator on the MTBOSS website, or request a detailed quote.
                </li>

                <li>
                  <strong>Q7. Where is the MTBOSS office located?</strong>
                  <br />
                  The office is located at Harthala, Kanth Road, Behind KR
                  Collection, near Domino&apos;s, Moradabad, Uttar Pradesh.
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