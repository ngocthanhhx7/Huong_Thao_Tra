import { Link } from 'react-router-dom';
import { storyChapters } from '../../data/homeStoryData';

const FinalWellnessCTA = () => (
  <section className="final-section story-section relative isolate overflow-hidden px-4 py-28 sm:px-6 lg:px-8">
    <div className="final-garden" aria-hidden="true">
      <span className="garden-line garden-line-a" />
      <span className="garden-line garden-line-b" />
      <span className="garden-line garden-line-c" />
      <span className="garden-leaf garden-leaf-a" />
      <span className="garden-leaf garden-leaf-b" />
      <span className="garden-leaf garden-leaf-c" />
    </div>

    <div className="relative z-10 mx-auto max-w-4xl text-center">
      <span className="reveal chapter-kicker chapter-kicker-herbal">
        {storyChapters.final.label}
      </span>
      <h2 className="reveal mt-6 font-display-h1 text-4xl leading-[1.08] text-[#17351f] md:text-6xl">
        {storyChapters.final.heading}
      </h2>
      <p className="reveal mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#49614d]">
        {storyChapters.final.body}
      </p>

      <div className="reveal mt-10 flex flex-col justify-center gap-4 sm:flex-row">
        <Link to="/ai-mix" className="wellness-focus home-btn home-btn-primary">
          Dùng AI tư vấn ngay
          <span className="ml-1" aria-hidden="true">→</span>
        </Link>
        <Link to="/teas" className="wellness-focus home-btn home-btn-secondary">
          Khám phá sản phẩm
        </Link>
      </div>
    </div>
  </section>
);

export default FinalWellnessCTA;
