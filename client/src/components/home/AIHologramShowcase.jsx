import { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { aiOptions, aiRecommendationMap, homeProducts, storyChapters, wellnessSignals } from '../../data/homeStoryData';
import { homeAssets } from '../../data/homeAssets';

const mapTeaToHomeProduct = (tea, mockFallback) => {
  if (!tea) return mockFallback;
  const ingredientNames = tea.ingredients?.map(ing => typeof ing === 'object' ? ing.name : ing) || [];
  return {
    id: tea._id || tea.id,
    name: tea.name,
    shortName: tea.name.replace('Trà ', ''),
    badge: tea.benefits?.[0] || 'Trà cao cấp',
    problem: tea.mixGoal || tea.description,
    benefit: tea.benefits?.join(', ') || tea.description,
    ingredients: ingredientNames.length > 0 ? ingredientNames : ['Thảo mộc tuyển chọn'],
    sensoryNote: tea.description || 'Hương thơm tinh khiết, hậu ngọt tự nhiên từ thảo dược.',
    ritual: 'Thưởng thức ấm nóng vào thời điểm thích hợp trong ngày, ngâm 5-10 phút.',
    aiReason: tea.mixGoal || 'Sản phẩm được đề xuất dựa trên nhu cầu sinh học tối ưu của cơ thể.',
    matchScore: tea.rating ? Math.round(tea.rating * 20) : 95,
    accent: '#568934',
    image: tea.image,
    tone: 'formula-calm',
    isReal: true,
  };
};

const getMatchingNeed = (id) => {
  switch (id) {
    case 'stress': return 'Giảm căng thẳng';
    case 'sleep': return 'Ngủ ngon hơn';
    case 'energy': return 'Tăng năng lượng';
    case 'detox': return 'Thanh lọc cơ thể';
    default: return '';
  }
};

const AIHologramShowcase = ({ onBeep = () => {}, showcaseTeas = null }) => {
  const [status, setStatus] = useState('idle');
  const [selectedOption, setSelectedOption] = useState('');
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);

  const recommendation = useMemo(() => {
    if (!selectedOption) return null;
    const mockRec = aiRecommendationMap[selectedOption];
    return {
      confidence: mockRec?.confidence || 95,
      reason: mockRec?.reason || `Công thức này hỗ trợ tối ưu cho mục tiêu ${selectedOption.toLowerCase()} của cơ thể bạn.`
    };
  }, [selectedOption]);

  const recommendedProduct = useMemo(() => {
    if (!selectedOption) return null;

    if (!showcaseTeas || showcaseTeas.length === 0) {
      // Use mock fallback
      const mockRec = aiRecommendationMap[selectedOption];
      return homeProducts.find((product) => product.id === mockRec?.productId) || homeProducts[0];
    }

    let teaIndex = 0;
    if (selectedOption === 'Ngủ ngon hơn') teaIndex = 0;
    else if (selectedOption === 'Giảm căng thẳng') teaIndex = 1;
    else if (selectedOption === 'Thanh lọc cơ thể') teaIndex = 2;
    else if (selectedOption === 'Tăng năng lượng') teaIndex = 3;

    const tea = showcaseTeas[teaIndex] || showcaseTeas[0];
    return mapTeaToHomeProduct(tea, homeProducts[teaIndex]);
  }, [selectedOption, showcaseTeas]);

  useEffect(() => {
    return () => window.clearInterval(timerRef.current);
  }, []);

  const handleSelectOption = (option) => {
    onBeep(); // Trigger the click audio feedback
    if (option === selectedOption && status === 'ready') return;

    window.clearInterval(timerRef.current);
    setSelectedOption(option);
    setStatus('analyzing');
    setProgress(0);

    let nextProgress = 0;
    timerRef.current = window.setInterval(() => {
      nextProgress += 5; // Ticks up by 5% every 40ms (0.8s total duration)
      const currentVal = Math.min(nextProgress, 100);
      setProgress(currentVal);

      if (currentVal >= 100) {
        window.clearInterval(timerRef.current);
        setStatus('ready');
      }
    }, 40);
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

        <div className="ai-hologram-shell relative">
          {/* Orbiting background lines */}
          <div className="ai-panel-layer ai-orbit" aria-hidden="true">
            <span className="orbit-dot orbit-dot-1" />
            <span className="orbit-dot orbit-dot-2" />
            <span className="orbit-dot orbit-dot-3" />
          </div>

          <div className="ai-panel-layer ai-console">
            <div className="ai-console-header mb-4 flex items-center justify-between">
              <span className="font-mono text-xs text-[#7dd8ff] tracking-wider">Smart Wellness AI v2.6</span>
              <strong className="flex items-center gap-1.5 font-mono text-xs text-emerald-400">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                SYSTEM ACTIVE
              </strong>
            </div>

            <h3 className="text-lg font-bold text-white mb-4">Hôm nay cơ thể bạn cần cải thiện gì?</h3>

            <div className="ai-chip-grid">
              {aiOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  disabled={status === 'analyzing'}
                  onClick={() => handleSelectOption(option)}
                  className={`wellness-focus ai-choice-chip ${selectedOption === option ? 'is-selected' : ''}`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Real-time Biological Signals Scan Panel */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-[10px] font-mono text-white/50 mb-3 uppercase tracking-widest flex items-center gap-1.5">
                <img src={homeAssets.icons.scan} className="h-3.5 w-3.5 filter invert brightness-200 animate-spin" style={{ animationDuration: '3s' }} alt="" aria-hidden="true" />
                {status === 'analyzing' ? 'Đang đọc tín hiệu...' : 'Bản quét sinh học hiện tại'}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {wellnessSignals.map((signal) => {
                  const isMatchingNeed = getMatchingNeed(signal.id) === selectedOption;
                  return (
                    <div 
                      key={signal.id} 
                      className={`p-2.5 rounded-lg border transition-all duration-300 flex flex-col justify-between ${
                        isMatchingNeed && status === 'analyzing'
                          ? 'border-[#7dd8ff] bg-[#7dd8ff]/10 animate-pulse'
                          : isMatchingNeed && status === 'ready'
                          ? 'border-[#add489] bg-[#add489]/10'
                          : 'border-white/5 bg-white/5'
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs gap-1.5">
                        <span className="text-white/70 font-semibold flex items-center gap-1.5">
                          <img src={homeAssets.icons[signal.id]} className="h-3.5 w-3.5 filter invert brightness-200 opacity-90 object-contain shrink-0" alt="" aria-hidden="true" />
                          {signal.label}
                        </span>
                        <span className={`font-mono font-bold ${isMatchingNeed ? 'text-[#add489]' : 'text-white/40'}`}>
                          {signal.value}
                        </span>
                      </div>
                      <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${isMatchingNeed ? 'bg-[#add489]' : 'bg-white/20'}`}
                          style={{ width: signal.value }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* AI Scan Progress Card */}
          <div className="ai-panel-layer ai-scan-card mt-4">
            <div className={`ai-scan-line ${status === 'analyzing' ? 'is-active' : ''}`} />
            <div className="flex items-center justify-between gap-4 font-mono text-xs font-bold">
              <span className="text-white flex items-center gap-1.5">
                <img src={homeAssets.icons.scan} className="h-3.5 w-3.5 filter invert brightness-200" alt="" aria-hidden="true" />
                {status === 'idle'
                  ? 'Chờ khởi tạo phân tích...'
                  : status === 'analyzing'
                  ? 'Đang tiến hành phân tích sinh học...'
                  : 'Bản quét hoàn tất'}
              </span>
              <strong className="text-[#add489]">{progress}%</strong>
            </div>
            <div className="ai-progress mt-2">
              <i style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Dynamic AI Recommendation Display */}
          <div 
            aria-live="polite"
            className={`ai-panel-layer ai-recommendation mt-4 transition-all duration-300 ${
              status === 'ready' ? 'opacity-100 scale-100' : 'opacity-40 blur-[1px] scale-[0.985] pointer-events-none'
            }`}
          >
            {status === 'ready' && recommendedProduct && recommendation ? (
              <>
                <div className="ai-badge-row flex flex-wrap justify-between items-center border-b border-leaf-100 pb-3 mb-4 gap-2">
                  <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <img src={homeAssets.icons.leaf} className="h-3.5 w-3.5" alt="" aria-hidden="true" />
                    Gợi ý công thức trà
                  </span>
                  <span className="font-mono text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <img src={homeAssets.icons.score} className="h-3.5 w-3.5" alt="" aria-hidden="true" />
                    Độ tin cậy: {recommendation.confidence}%
                  </span>
                </div>

                <div className="ai-product-preview flex items-center gap-4">
                  <div className="relative w-16 h-16 shrink-0 bg-emerald-800/10 rounded-xl border border-emerald-800/20 flex items-center justify-center p-1.5 overflow-hidden">
                    <img 
                      src={recommendedProduct.image || homeAssets.products[recommendedProduct.assetKey] || homeAssets.heroPack} 
                      className="w-full h-full object-contain"
                      alt={recommendedProduct.name} 
                    />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#568934] font-black block mb-1">
                      {recommendedProduct.badge}
                    </span>
                    <h3 className="text-lg font-bold text-[#17351f]">{recommendedProduct.name}</h3>
                    <p className="text-xs text-[#5c705d] mt-1">
                      {recommendedProduct.benefit}
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-leaf-50/50 rounded-xl border border-leaf-100/30">
                  <h4 className="text-xs font-bold text-[#17351f] uppercase tracking-wider mb-1">Tại sao phù hợp với bạn:</h4>
                  <p className="text-sm leading-relaxed text-[#425744]">
                    {recommendation.reason}
                  </p>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Link 
                    to={recommendedProduct.isReal ? `/teas/${recommendedProduct.id}` : `/teas?id=${recommendedProduct.id}`}
                    className="wellness-focus text-center flex-1 rounded-xl bg-gradient-to-r from-primary-700 to-primary-600 px-4 py-3 text-sm font-bold text-white shadow-md hover:from-primary-600 hover:to-primary-500 transition active:scale-95"
                  >
                    Xem chi tiết công thức
                  </Link>
                  <Link 
                    to="/ai-mix"
                    className="wellness-focus text-center flex-1 rounded-xl border border-leaf-200 bg-white px-4 py-3 text-sm font-bold text-primary-700 hover:bg-leaf-50 transition"
                  >
                    Chỉnh sửa công thức (AI Mix)
                  </Link>
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-gray-400">
                <div className="text-4xl mb-2">🔮</div>
                <p className="text-sm">Hologram đang ở trạng thái chờ kết nối...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

AIHologramShowcase.propTypes = {
  onBeep: PropTypes.func,
  showcaseTeas: PropTypes.arrayOf(PropTypes.object),
};

export default AIHologramShowcase;

