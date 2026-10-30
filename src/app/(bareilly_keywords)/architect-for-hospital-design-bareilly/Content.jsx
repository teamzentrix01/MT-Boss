import React from "react";
import LandingEnquiry from "../../components/LandingEnquiry";

const Content = () => {
  return (
    <div className="min-h-screen bg-white pt-0">
      <div className="flex flex-col lg:flex-row">
        {/* Content Section */}
        <div className="flex-1 px-4 sm:px-8 md:px-16 py-12 order-1 lg:order-1">
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-8 text-gray-900">
            Architect for Hospital Design in Bareilly: Layouts Built Around Patient Care
          </h2>

          <div className="space-y-6 text-gray-700 leading-relaxed max-w-4xl">
            <section>
              <p>
                A hospital is not a large house or an office with more rooms. It is a
                building where a frightened patient, a stretcher, a surgeon, a visitor, a
                delivery of sterile supplies and a bag of waste all move through the same
                walls, and where the layout decides whether they cross paths or stay
                apart.
              </p>
              <p className="mt-3">
                Owners in Bareilly planning a clinic, nursing home, maternity centre or
                multi-specialty hospital often begin with the visible things: The
                entrance, the signboard, the number of beds.
              </p>
              <p className="mt-3">
                MTBoss is a design and construction company based at Harthala, Kanth
                Road, Moradabad, serving Bareilly and Moradabad. This page explains how a
                hospital building is planned around patient care, which decisions matter
                most, which specialists need to be involved and what to check before you
                commit to a design.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Service Details and Benefits
              </h3>
            </section>

            <section>
            
              <p>
                Hospital design is the planning of a building for medical care: How
                patients arrive, wait, are examined, treated, admitted and discharged,
                and how staff, supplies, waste and visitors move around them. It combines
                architecture with clinical planning, engineering services, fire safety
                and infection control.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Which Hospital Type Are You Planning?
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Clinic or consulting centre:</strong> Consulting rooms, a
                  waiting area, a small procedure room and a pharmacy or lab corner
                </li>
                <li>
                  <strong>Day-care or specialty centre:</strong> Dental, eye, dialysis,
                  physiotherapy or skin care, with equipment-driven layouts
                </li>
                <li>
                  <strong>Diagnostic centre:</strong> Imaging, pathology and sample
                  collection, with strict rules for radiology rooms
                </li>
                <li>
                  <strong>Maternity and nursing home:</strong> Labour rooms, an operation
                  theatre, wards and a nursery, usually on a small or medium plot
                </li>
                <li>
                  <strong>Multi-specialty hospital:</strong> Emergency, intensive care,
                  operation theatres, wards, diagnostics and several outpatient
                  departments
                </li>
                <li>
                  <strong>Super-specialty or teaching facility:</strong> Complex, with
                  large specialist teams and heavy services
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Starting With the Patient Journey
              </h3>
              <p className="mb-3">
                The best hospital plans start from the journey, not from the room list.
                Walk through it in your mind.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Arrival:</strong> By foot, car, ambulance or auto, often in
                  distress, so entries must be obvious and step-free
                </li>
                <li>
                  <strong>Registration and waiting:</strong> A calm, visible reception
                  with seating, privacy and clear signs
                </li>
                <li>
                  <strong>Examination and diagnosis:</strong> Short, logical routes
                  between consulting rooms, labs and imaging
                </li>
                <li>
                  <strong>Treatment or admission:</strong> A direct, private route to the
                  operation theatre, ward or day-care area
                </li>
                <li>
                  <strong>Recovery:</strong> Quiet rooms with daylight, nurse visibility
                  and space for a family member
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Separating Flows: Patients, Staff, Visitors, Supplies and Waste
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Patients and visitors use public routes, with controlled access to wards
                  and critical areas
                </li>
                <li>
                  Staff need their own routes, changing rooms and rest areas
                </li>
                <li>
                  Clean supplies, such as sterile items and linen, travel on routes that
                  do not meet waste
                </li>
                <li>
                  Waste leaves by a separate, covered route to a storage point away from
                  patient areas
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Department Adjacencies That Save Minutes
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Emergency near the entrance, an ambulance bay and imaging
                </li>
                <li>
                  Operation theatres, intensive care and recovery grouped, with a direct,
                  private route between them
                </li>
                <li>
                  Labour room, theatre and nursery close together in a maternity unit
                </li>
                <li>
                  Imaging and laboratory near outpatients and emergency, so patients do
                  not travel far
                </li>
                <li>
                  Pharmacy near the exit and the outpatient area
                </li>
                <li>
                  Wards away from noise, with nurse stations that see the corridors
                </li>
                <li>
                  Stores, kitchen and laundry reached from the service route, away from
                  patient areas
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Rooms That Need Special Care
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Operation theatres:</strong> Air handling, pressure control,
                  clean finishes and a clear separation of scrub, theatre and recovery
                  areas
                </li>
                <li>
                  <strong>Intensive care units:</strong> Visibility from the nurse
                  station, power and gas outlets at each bed, isolation options and
                  infection control
                </li>
                <li>
                  <strong>Labour rooms and nurseries:</strong> Privacy, warmth and quick
                  access to the theatre
                </li>
                <li>
                  <strong>Isolation rooms:</strong> Controlled air movement and a changing
                  lobby where needed
                </li>
                <li>
                  <strong>Radiology and imaging rooms:</strong> Radiation shielding and
                  layout must follow the radiation regulator&apos;s requirements, and a
                  qualified radiation-safety professional should design the shielding
                </li>
                <li>
                  <strong>Laboratories:</strong> Safe handling, ventilation and waste
                  disposal
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Finishes That Support Infection Control
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Floors:</strong> Seamless or tightly jointed, slip-resistant and
                  easy to clean, with coved edges where walls meet floors
                </li>
                <li>
                  <strong>Walls:</strong> Smooth, washable finishes without crevices in
                  clinical areas
                </li>
                <li>
                  <strong>Ceilings:</strong> Cleanable, with minimal gaps in critical
                  rooms
                </li>
                <li>
                  <strong>Handwash basins:</strong> Conveniently placed at entrances to
                  wards, theatres and rooms
                </li>
                <li>
                  <strong>Doors and handles:</strong> Wide enough for beds and trolleys,
                  with easy-to-clean hardware
                </li>
                <li>
                  <strong>Waterproofing:</strong> Carefully done in wet areas, since leaks
                  and damp invite mould and infection
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Movement of Beds, Stretchers and Ambulances
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Corridor widths that let two trolleys pass, as the applicable rules and
                  your equipment require
                </li>
                <li>
                  Door widths and thresholds suited to beds and equipment, with no steps
                </li>
                <li>
                  Ramps and lifts sized for stretchers and beds, with a dedicated service
                  lift if the building has several floors
                </li>
                <li>
                  Turning space at corridor corners and lift lobbies
                </li>
                <li>
                  Ambulance bay close to the emergency entrance, with space to turn and
                  wait
                </li>
                <li>
                  Separate parking for ambulances, staff, patients and visitors
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Services Backbone
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Power:</strong> A load estimate, a reliable supply, a generator
                  or other backup with an automatic changeover, and protected circuits for
                  critical equipment
                </li>
                <li>
                  <strong>Air conditioning and ventilation:</strong> Suited to each area,
                  with special systems for theatres and isolation rooms
                </li>
                <li>
                  <strong>Medical gases and suction,</strong> where required, with piping
                  routes and plant rooms planned early
                </li>
                <li>
                  <strong>Water supply:</strong> Storage, pumping and, where needed,
                  treatment
                </li>
                <li>
                  <strong>Drainage and sewage:</strong> Separate handling of clinical
                  waste water, with proper treatment as the rules require
                </li>
                <li>
                  <strong>Information and communication:</strong> Cabling for records,
                  imaging, nurse call and security
                </li>
                <li>
                  <strong>Lighting:</strong> Good general light, task light in examination
                  areas and dimmable light in recovery rooms
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Biomedical Waste and Utilities
              </h3>
              <p>
                Hospitals generate waste that must be separated, stored and collected
                safely. A good plan includes a clearly marked storage area that is easy to
                reach for collection vehicles and hard for the public to access,
                colour-coded bins at the points of use and a route that does not cross
                clean areas.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Fire Safety and Escape for Patients Who Cannot Walk
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Compartments that slow the spread of fire and smoke, so patients can be
                  moved to a safe area on the same floor
                </li>
                <li>
                  Wide corridors, doors and refuge areas suited to beds and wheelchairs
                </li>
                <li>
                  Protected staircases and lifts suitable for evacuation, as the rules
                  require
                </li>
                <li>
                  Alarms, extinguishers and other systems the regulations call for
                </li>
                <li>
                  Emergency lighting and clear signs
                </li>
                <li>
                  Safe storage of oxygen, medicines and other hazardous items
                </li>
                <li>
                  Fire tender access around the building
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Comfort, Privacy and Wayfinding
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Daylight and views in waiting areas and wards
                </li>
                <li>
                  Privacy at reception, in consulting rooms and in changing areas
                </li>
                <li>
                  Clear signs in simple language, with colour or number coding for
                  departments
                </li>
                <li>
                  Seating that suits elderly and unwell visitors
                </li>
                <li>
                  Clean, accessible toilets near waiting areas and wards
                </li>
                <li>
                  Space for a family member to stay with a patient
                </li>
                <li>
                  Acoustic comfort, so corridors and wards stay quiet
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                How Should a Small Hospital Plan for Growth?
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Size the foundation and columns for extra floors, if you may build up
                </li>
                <li>
                  Place stairs, lifts and service shafts so that new areas can plug into
                  them
                </li>
                <li>
                  Reserve space for plant rooms, generators and gas storage that will grow
                </li>
                <li>
                  Keep a clear zone for future departments, such as a second theatre or an
                  imaging suite
                </li>
                <li>
                  Arrange the entrance, parking and ambulance bay for a larger operation
                </li>
                <li>
                  Phase construction so the facility can keep working while new areas are
                  built
                </li>
              </ul>
              <p className="mt-3">
                Design the whole building first, then build it in stages.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Approvals and Registrations
              </h3>
              <p>
                A hospital may need many approvals, such as building plan sanction, fire
                clearance, pollution control and biomedical waste authorisation,
                electricity and water connections, registration of the clinical
                establishment with the health authorities, and permissions for imaging or
                specialised equipment. Requirements and timelines depend on the
                authorities, the facility type and the number of beds, and they change
                over time.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Budget and Cost Control
              </h3>
              <p>
                Hospital costs depend on the facility type, bed count, built-up area, the
                services engineered into the building, medical equipment, finishes, fire
                systems, approvals and contingency. Equipment is often a large share and
                is usually budgeted separately from construction.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Drawings You Should Receive
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  A site survey and plot plan with entries, ambulance route and parking
                </li>
                <li>
                  Floor plans for every level, with room data and dimensions
                </li>
                <li>
                  Flow and adjacency diagrams
                </li>
                <li>
                  Elevations, sections and, where included, realistic views
                </li>
                <li>
                  Structural drawings from a qualified engineer
                </li>
                <li>
                  A fire safety layout
                </li>
                <li>
                  Finish, door and window schedules
                </li>
                <li>
                  Working drawings your builder can build from
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Mistakes That Cost Hospital Owners Money
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Designing the facade before the clinical flow
                </li>
                <li>
                  Mixing clean and waste routes
                </li>
                <li>
                  Corridors, doors and lifts that cannot take a bed
                </li>
                <li>
                  Putting the emergency entrance far from imaging and theatre
                </li>
                <li>
                  Under-sizing power backup, air conditioning or water
                </li>
                <li>
                  Leaving services shafts and plant space as afterthoughts
                </li>
                <li>
                  Treating fire escape as if every patient could walk
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                What Should You Ask a Designer Before You Sign?
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Who will sign my drawings, and can I verify their registration?
                </li>
                <li>
                  Which healthcare or similar buildings can I see?
                </li>
                <li>
                  Which specialists will be involved, and who coordinates them?
                </li>
                <li>
                  How will you plan infection control, fire escape and services?
                </li>
                <li>
                  What is in the fee, and what is extra?
                </li>
                <li>
                  Can I take the drawings to another builder?
                </li>
              </ul>
              <p className="mt-3">
                A confident designer answers plainly and puts the answers in writing.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Choose MTBoss
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Design and construction under one team.</strong> MTBoss builds,
                  renovates and repairs homes, shops and commercial and industrial
                  properties, so our designers can check cost and buildability while they
                  draw.
                </li>
                <li>
                  <strong>Honest about specialists.</strong> We say plainly that a
                  hospital needs medical planners, services engineers and radiation-safety
                  experts, and we coordinate them instead of pretending to do everything
                  ourselves.
                </li>
                <li>
                  <strong>Planned around care and operations.</strong> We start from the
                  patient journey and the staff routes, so the building supports the
                  people who run it.
                </li>
                <li>
                  <strong>Clear about promises.</strong> We do not guarantee approvals and
                  we do not claim influence with any authority. We prepare rule-checked
                  drawings and respond to queries openly.
                </li>
                <li>
                  <strong>Flexible engagement.</strong> Take design only and use any
                  builder, or continue with us for construction, with design and
                  construction priced separately.
                </li>
                <li>
                  <strong>Open about credentials.</strong> Before work begins, we tell you
                  who will sign your drawings and share their registration details so you
                  can check them.
                </li>
                <li>
                  <strong>One brand for the finishing work.</strong> Our website also
                  lists architecture and interior, waterproofing, tile and marble, false
                  ceiling, electrician, plumber and painter services, so finishes and
                  services can be coordinated.
                </li>
                <li>
                  <strong>Easy to reach.</strong> Call, WhatsApp, email, use the quote
                  form on our website or visit our office on Kanth Road, Moradabad.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Call to Action
              </h3>
              <p className="mb-3">
                Ready to plan a hospital or clinic that supports patient care from day
                one? Contact MTBoss today.
              </p>
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
                  <strong>Website:</strong>{" "}
                  <a
                    href="https://www.mtboss.in"
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.mtboss.in
                  </a>{" "}
                  (click &ldquo;Get a Construction Quote&rdquo;)
                </li>
                <li>
                  <strong>Office:</strong> Harthala, Kanth Road, Moradabad (behind
                  KR Collection, near Domino&apos;s)
                </li>
              </ul>
              <p className="mt-3">
                Send your plot location and size, facility type, number of beds, services
                planned and budget range, and we will arrange a site study and a written
                proposal.
              </p>
              <p className="mt-3">
                Plan your hospital with MTBoss: Designed around patient care, coordinated
                with specialists, priced openly and ready to build.
              </p>
            </section>

            <section>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                Frequently Asked Questions
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Q1. Who designs hospitals in Bareilly?</strong>
                  <br />
                  MTBoss plans healthcare buildings for Bareilly and Moradabad,
                  coordinating specialist consultants.
                </li>
                <li>
                  <strong>Q2. What do you need to start?</strong>
                  <br />
                  Plot location and size, facility type, bed count, services planned and
                  budget range.
                </li>
                <li>
                  <strong>Q3. Do you design clinics and nursing homes?</strong>
                  <br />
                  Yes. We plan small clinics through to larger facilities, with the right
                  specialists involved.
                </li>
                <li>
                  <strong>Q4. Who designs the operation theatre and radiology rooms?</strong>
                  <br />
                  We coordinate with specialists, since regulator rules and radiation
                  safety need expert design.
                </li>
                <li>
                  <strong>Q5. How do you plan infection control?</strong>
                  <br />
                  By separating flows and choosing cleanable finishes, with specialist
                  input in critical rooms.
                </li>
                <li>
                  <strong>
                    Q6. Do you plan fire safety for patients who cannot walk?
                  </strong>
                  <br />
                  We plan layouts with qualified fire consultants, and requirements are
                  confirmed with the authority.
                </li>
                <li>
                  <strong>Q7. Do you help with approvals?</strong>
                  <br />
                  Where included in the agreed scope. We cannot guarantee approval.
                </li>
                <li>
                  <strong>Q8. Can I build in phases?</strong>
                  <br />
                  Yes. We design the whole building and build it in stages.
                </li>
                <li>
                  <strong>Q9. How do I contact MTBoss?</strong>
                  <br />
                  Call or WhatsApp{" "}
                  <a
                    href="https://wa.me/9458410866"
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    +91 94584 10866
                  </a>
                  , or use &ldquo;Get a Construction Quote&rdquo; on{" "}
                  <a
                    href="https://www.mtboss.in"
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.mtboss.in
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