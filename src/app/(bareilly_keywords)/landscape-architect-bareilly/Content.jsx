import LandingEnquiry from '../../components/LandingEnquiry';

export default function Content() {
  return (
    <main className="bg-white px-4 py-10 text-gray-700 sm:px-8 md:px-16">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <article className="space-y-8 leading-relaxed">
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">
              Landscape design planned for the way you use your space
            </h2>
            <p>
              A well-planned landscape connects a building with its outdoor
              spaces. MTBOSS helps homeowners and businesses in Bareilly plan
              gardens, pathways, seating areas and practical planting around the
              site, taking access, drainage, sunlight and maintenance into
              account.
            </p>
          </section>

          <section>
            <h3 className="mb-3 text-xl font-semibold text-gray-900">
              Landscape planning that starts with your site
            </h3>
            <p>
              Every site has different levels, boundaries, soil and water needs.
              We begin with your requirements and the available space, then
              coordinate the outdoor plan with the building, entrances and
              circulation so the finished areas are useful as well as attractive.
            </p>
          </section>

          <section>
            <h3 className="mb-3 text-xl font-semibold text-gray-900">
              Outdoor spaces we can help plan
            </h3>
            <ul className="list-disc space-y-2 pl-6">
              <li>Home gardens, lawns and planting areas</li>
              <li>Courtyards, terraces and outdoor seating</li>
              <li>Site pathways, entry areas and boundary planting</li>
              <li>Landscape coordination for offices and commercial sites</li>
              <li>Drainage-conscious outdoor layouts and hardscape planning</li>
            </ul>
          </section>

          <section>
            <h3 className="mb-3 text-xl font-semibold text-gray-900">
              A practical approach from design to execution
            </h3>
            <p>
              Material choices, plant selection and maintenance requirements
              affect the long-term performance of an outdoor space. We discuss
              these decisions with you and coordinate landscape work with the
              wider construction plan. Scope, materials and pricing are
              confirmed for your project before work begins.
            </p>
          </section>
        </article>

        <aside>
          <LandingEnquiry landingPage="landscape-architect-bareilly" />
        </aside>
      </div>
    </main>
  );
}