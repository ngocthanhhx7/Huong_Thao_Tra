import { storyChapters, trustCards } from '../../data/homeStoryData';

const TrustPremiumSection = () => (
  <section className="trust-section story-section relative isolate overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
    <div className="trust-bg" aria-hidden="true" />

    <div className="relative z-10 mx-auto max-w-7xl">
      <div className="reveal mx-auto mb-14 max-w-4xl text-center">
        <span className="chapter-kicker chapter-kicker-herbal">
          {storyChapters.trust.label}
        </span>
        <h2 className="mt-6 font-display-h1 text-4xl leading-[1.1] text-[#17351f] md:text-6xl">
          {storyChapters.trust.heading}
        </h2>
      </div>

      <div className="trust-grid">
        {trustCards.map((card) => (
          <article key={card.title} className="reveal trust-item">
            <span>{card.icon}</span>
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default TrustPremiumSection;
