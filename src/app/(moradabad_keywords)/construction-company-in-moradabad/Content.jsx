import React from "react";
import LandingEnquiry from "../../components/LandingEnquiry";

const Content = () => {
  return (
    <div className="min-h-screen bg-white pt-0">
      <div className="flex flex-col lg:flex-row">
        {/* Content Section */}
        <div className="flex-1 px-4 sm:px-8 md:px-16 py-12 order-1 lg:order-1">
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-8 text-gray-900">
            Construction Company in Moradabad
          </h2>

          <div className="space-y-8 text-gray-700 leading-relaxed max-w-4xl">
            <p>
              MTBOSS is a trusted construction company in Moradabad, delivering
              commercial, residential, and industrial construction with
              precision, transparency, and over 22 years of hands-on
              engineering experience. Whether you are building a home, a
              commercial complex, or an industrial facility, our team manages
              every stage of the project, from planning and design to final
              handover.
            </p>
            <p>
              Homeowners and businesses in Moradabad choose MTBOSS because we
              combine local market knowledge with disciplined project
              execution, so you get a build that matches your budget, your
              timeline, and your vision, without surprises along the way.
            </p>

            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Why Choose MTBOSS as Your Construction Company in Moradabad
            </h3>
            <p>
              Moradabad is growing fast, with new residential colonies,
              commercial complexes, and industrial units coming up across the
              city. This growth also brings more construction options, which
              makes it harder to know who to trust. Here is what sets MTBOSS
              apart for clients in Moradabad:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>22+ years of construction and engineering experience</li>
              <li>Transparent, itemized cost estimates before work begins</li>
              <li>In-house team covering structural, electrical, and finishing work</li>
              <li>Clear project timelines with regular progress updates</li>
              <li>Quality material sourcing at fair, verified rates</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Our Construction Services in Moradabad
            </h3>
            <p>
              MTBOSS offers end-to-end construction services for individuals,
              builders, and businesses across Moradabad, including:
            </p>

            <h4 className="text-lg sm:text-xl font-semibold text-gray-900">
              Residential Construction
            </h4>
            <p>
              Custom home construction, builder floors, and villa projects,
              planned around your family needs, budget, and preferred layout.
            </p>

            <h4 className="text-lg sm:text-xl font-semibold text-gray-900">
              Commercial Construction
            </h4>
            <p>
              Office buildings, retail spaces, and showrooms built for
              functionality, durability, and a professional appearance that
              represents your brand.
            </p>

            <h4 className="text-lg sm:text-xl font-semibold text-gray-900">
              Industrial &amp; Warehousing
            </h4>
            <p>
              Factory sheds, warehouses, and industrial units constructed to
              meet operational and safety requirements, with efficient use of
              space.
            </p>

            <h4 className="text-lg sm:text-xl font-semibold text-gray-900">
              Renovation &amp; Building Repair
            </h4>
            <p>
              Structural repairs, waterproofing, and renovation work for
              existing properties, carried out with minimal disruption to your
              daily routine.
            </p>

            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Our Construction Process
            </h3>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>
                <strong>Site Visit &amp; Consultation</strong> - Understanding
                your requirements, budget, and site conditions in Moradabad
                before any planning begins.
              </li>
              <li>
                <strong>Design &amp; Cost Estimation</strong> - Preparing a
                clear layout and a transparent, itemized cost breakdown so
                there are no hidden charges later.
              </li>
              <li>
                <strong>Construction &amp; Execution</strong> - Managing
                structural work, electrical, plumbing, and finishing with
                regular quality checks at each stage.
              </li>
              <li>
                <strong>Handover &amp; Support</strong> - Final inspection and
                handover, with support available for any post-construction
                queries.
              </li>
            </ol>

            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Plan Your Budget Before You Build
            </h3>
            <p>
              Not sure what your project will cost? Use our free construction
              cost calculator to get an instant estimate based on plot size,
              number of floors, and finish quality, so you can plan your
              project in Moradabad with confidence before requesting a formal
              quote.
            </p>

            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Get a Free Construction Quote in Moradabad
            </h3>
            <p>
              Whether you are planning a new home, a commercial project, or an
              industrial facility in Moradabad, MTBOSS is ready to help you
              build it right. Reach out to us at <strong>+91 94584 10866</strong> or{" "}
              <a href="mailto:mtboss2016@gmail.com" className="text-blue-600 hover:underline">mtboss2016@gmail.com</a>{" "}
              to discuss your requirements and get a free, no-obligation quote.
            </p>
            <p>
              Build with a construction company in Moradabad that values your
              time, your budget, and your trust.
            </p>
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