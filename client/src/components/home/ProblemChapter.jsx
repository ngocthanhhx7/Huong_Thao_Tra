import { storyChapters, wellnessSignals } from '../../data/homeStoryData';

const ProblemChapter = () => (
  <section className="problem-section story-section relative isolate overflow-hidden px-4 py-28 text-white sm:px-6 lg:px-8">
    <div className="chapter-dark-bg" aria-hidden="true" />

    <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
      <div>
        <span className="reveal chapter-kicker chapter-kicker-danger">
          {storyChapters.problem.label}
        </span>
        <h2 className="reveal mt-6 font-display-h1 text-4xl leading-[1.08] text-[#f8fff2] md:text-6xl">
          {storyChapters.problem.heading}
        </h2>
        <p className="reveal mt-6 max-w-xl text-lg leading-8 text-slate-300">
          {storyChapters.problem.body}
        </p>
        <p className="reveal mt-6 max-w-xl text-xl font-black leading-8 text-[#add489]">
          {storyChapters.problem.emphasis}
        </p>
      </div>

      <div className="reveal diagnostic-board">
        <div className="diagnostic-header">
          <span className="diagnostic-live-dot" />
          <span>Hệ thống đọc tín hiệu cơ thể</span>
          <strong>LIVE</strong>
        </div>

        <div className="diagnostic-core">
          <div>
            <span>Trạng thái đô thị</span>
            <strong>Quá tải</strong>
          </div>
          <div>
            <span>Gợi ý tiếp theo</span>
            <strong>Làm dịu bằng thảo mộc</strong>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          {wellnessSignals.map((signal) => (
            <div key={signal.id} className="signal-row">
              <div className="signal-meter" style={{ '--meter': signal.value }} />
              <div>
                <strong>{signal.label}</strong>
                <p>{signal.text}</p>
              </div>
              <span>{signal.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default ProblemChapter;
