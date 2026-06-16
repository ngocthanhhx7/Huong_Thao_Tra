import { storyChapters } from '../../data/homeStoryData';

const HerbalTransitionChapter = () => (
  <section className="herbal-section story-section relative isolate overflow-hidden px-4 py-28 sm:px-6 lg:px-8">
    <div className="herbal-wash" aria-hidden="true" />

    <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.04fr_0.96fr]">
      <div className="reveal herbal-transition-scene relative w-full h-[32rem] sm:h-[36rem]">
        {/* Image 1: Main background tea pouring */}
        <div className="collage-card collage-card--1 absolute top-[8%] left-[6%] w-[56%] h-[60%] rounded-3xl overflow-hidden shadow-2xl border-[3px] border-white/90 z-10 hover:z-30">
          <img
            src="/assets/home/pexels-anna-pou-8329340.jpg"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-108"
            alt="Nghi thức pha trà và thảo mộc"
          />
        </div>

        {/* Image 2: Middle right tea set with flowers */}
        <div className="collage-card collage-card--2 absolute bottom-[8%] right-[6%] w-[52%] h-[58%] rounded-3xl overflow-hidden shadow-2xl border-[3px] border-white/90 z-20 hover:z-30">
          <img
            src="/assets/home/pexels-anna-pou-8329264.jpg"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-108"
            alt="Bộ ấm trà và hoa cúc khô"
          />
        </div>

        {/* Image 3: Foreground top-right detail closeup */}
        <div className="collage-card collage-card--3 absolute top-[16%] right-[12%] w-[36%] h-[40%] rounded-2xl overflow-hidden shadow-xl border-[3px] border-white/95 z-25 hover:z-30">
          <img
            src="/assets/home/pexels-anna-pou-8329273.jpg"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-108"
            alt="Chi tiết nụ hoa cúc vàng"
          />
        </div>
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
