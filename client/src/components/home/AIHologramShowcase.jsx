import { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { aiOptions, aiRecommendationMap, homeProducts, storyChapters } from '../../data/homeStoryData';

const getProductById = (id) => homeProducts.find((product) => product.id === id) || homeProducts[0];

const AIHologramShowcase = ({ onBeep = () => {} }) => {
  const [selectedOption, setSelectedOption] = useState(aiOptions[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(100);
  const timerRef = useRef(null);

  const recommendation = aiRecommendationMap[selectedOption] || aiRecommendationMap[aiOptions[0]];
  const recommendedProduct = useMemo(
    () => getProductById(recommendation.productId),
    [recommendation.productId]
  );

  useEffect(() => () => window.clearInterval(timerRef.current), []);

  const handleSelectOption = (option) => {
    onBeep(); // Trigger the click synthesizer audio effect
    if (option === selectedOption && !isAnalyzing) return;

    window.clearInterval(timerRef.current);
    setSelectedOption(option);
    setIsAnalyzing(true);
    setProgress(0);

    let nextProgress = 0;
    timerRef.current = window.setInterval(() => {
      nextProgress += 8;
      setProgress(Math.min(nextProgress, 100));

      if (nextProgress >= 100) {
        window.clearInterval(timerRef.current);
        setIsAnalyzing(false);
      }
    }, 70);
  };

  return (
    <section className="ai-section story-section relative isolate overflow-hidden px-4 py-28 sm:px-6 lg:px-8">
      <div className="ai-section-bg" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <span className="reveal chapter-kicker chapter-kicker-ai">
            {storyChapters.ai.label}
          </span>
          <h2 className="reveal mt-6 font-display-h1 text-4xl leading-[1.08] text-[#17351f] md:text-6xl">
            {storyChapters.ai.heading}
          </h2>
          <p className="reveal mt-6 max-w-xl text-lg leading-8 text-[#49614d]">
            {storyChapters.ai.body}
          </p>
        </div>

        <div className="ai-hologram-shell">
          <div className="ai-panel-layer ai-orbit" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div className="ai-panel-layer ai-console">
            <div className="ai-console-header">
              <span>Smart Wellness AI</span>
              <strong>ACTIVE</strong>
            </div>

            <h3>Hôm nay bạn muốn chăm sóc điều gì?</h3>

            <div className="ai-chip-grid">
              {aiOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelectOption(option)}
                  className={`wellness-focus ai-choice-chip ${selectedOption === option ? 'is-selected' : ''}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="ai-panel-layer ai-scan-card">
            <div className={`ai-scan-line ${isAnalyzing ? 'is-active' : ''}`} />
            <div className="flex items-center justify-between gap-4">
              <span>{isAnalyzing ? 'AI đang phân tích nhu cầu...' : 'Hoàn tất phân tích nhu cầu'}</span>
              <strong>{progress}%</strong>
            </div>
            <div className="ai-progress">
              <i style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className={`ai-panel-layer ai-recommendation ${isAnalyzing ? 'is-muted' : ''}`}>
            <div className="ai-badge-row">
              <span>Gợi ý bởi AI</span>
              <span>Mức phù hợp {recommendation.confidence}%</span>
              <span>Cá nhân hóa</span>
            </div>

            <div className="ai-product-preview">
              <div className={`formula-orb ${recommendedProduct.tone}`}>
                <span className="formula-steam" />
                <span className="formula-cup" />
              </div>
              <div>
                <p>Gợi ý phù hợp</p>
                <h3>{recommendedProduct.name}</h3>
                <span>{recommendedProduct.badge}</span>
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-[#425744]">
              {recommendation.reason}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

AIHologramShowcase.propTypes = {
  onBeep: PropTypes.func,
};

export default AIHologramShowcase;
