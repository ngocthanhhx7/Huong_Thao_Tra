import { homeProducts, storyChapters } from '../../data/homeStoryData';

const HerbalTransitionChapter = () => (
  <section className="herbal-section story-section relative isolate overflow-hidden px-4 py-28 sm:px-6 lg:px-8">
    <div className="herbal-wash" aria-hidden="true" />

    <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.04fr_0.96fr]">
      <div className="reveal herbal-transition-scene">
        <div className="mini-city-plate">
          <span className="mini-road mini-road-a" />
          <span className="mini-road mini-road-b" />
          <span className="mini-building mini-building-a" />
          <span className="mini-building mini-building-b" />
          <span className="mini-building mini-building-c" />
          <span className="mini-garden mini-garden-a" />
          <span className="mini-garden mini-garden-b" />
          <span className="mini-trail mini-trail-a" />
          <span className="mini-trail mini-trail-b" />
        </div>

        <div className="herbal-cup">
          <span className="tea-steam tea-steam-a" />
          <span className="tea-steam tea-steam-b" />
          <span className="tea-steam tea-steam-c" />
          <span className="tea-cup">
            <i className="tea-cup-body" />
            <i className="tea-cup-handle" />
            <i className="tea-cup-saucer" />
          </span>
        </div>

        {homeProducts[0].ingredients.map((ingredient, index) => (
          <span
            key={ingredient}
            className="floating-ingredient"
            style={{ '--i': index }}
          >
            {ingredient}
          </span>
        ))}
      </div>

      <div>
        <span className="reveal chapter-kicker chapter-kicker-herbal">
          {storyChapters.herbal.label}
        </span>
        <h2 className="reveal mt-6 font-display-h1 text-4xl leading-[1.08] text-[#17351f] md:text-6xl">
          {storyChapters.herbal.heading}
        </h2>
        <p className="reveal mt-6 max-w-xl text-lg leading-8 text-[#49614d]">
          {storyChapters.herbal.body}
        </p>
        <p className="reveal mt-6 max-w-xl text-2xl font-black text-[#568934]">
          {storyChapters.herbal.emphasis}
        </p>
      </div>
    </div>
  </section>
);

export default HerbalTransitionChapter;
