import { useCallback, useEffect, useRef, useState } from 'react';
import { useHomeScrollStory } from '../hooks/useHomeScrollStory';
import api from '../services/api';

import Footer from '../components/Footer';
import HeroCinematic from '../components/home/HeroCinematic';
import ProblemChapter from '../components/home/ProblemChapter';
import HerbalTransitionChapter from '../components/home/HerbalTransitionChapter';
import AIHologramShowcase from '../components/home/AIHologramShowcase';
import ProductShowcasePremium from '../components/home/ProductShowcasePremium';
import TrustPremiumSection from '../components/home/TrustPremiumSection';
import FinalWellnessCTA from '../components/home/FinalWellnessCTA';

const Home = () => {
  const rootRef = useRef(null);
  const [mood, setMood] = useState('healing');
  const [growth, setGrowth] = useState(1);
  const [showCurtain, setShowCurtain] = useState(() => {
    try {
      return window.sessionStorage.getItem('thvWelcomeSeen') !== '1';
    } catch {
      return true;
    }
  });
  const [homeSettings, setHomeSettings] = useState(null);

  useEffect(() => {
    const fetchHomeSettings = async () => {
      try {
        const { data } = await api.get('/teas/home-settings');
        setHomeSettings(data);
      } catch (err) {
        console.debug('Failed to fetch home settings:', err);
      }
    };

    fetchHomeSettings();
  }, []);

  const markWelcomeSeen = useCallback(() => {
    setShowCurtain(false);
    try {
      window.sessionStorage.setItem('thvWelcomeSeen', '1');
    } catch (err) {
      console.debug('Failed to store welcome state:', err);
    }
  }, []);

  useHomeScrollStory(rootRef, {
    setMood,
    setGrowth,
  });

  useEffect(() => {
    if (!showCurtain) return undefined;

    const curtainTimer = window.setTimeout(() => {
      markWelcomeSeen();
    }, 1600);

    return () => {
      window.clearTimeout(curtainTimer);
    };
  }, [markWelcomeSeen, showCurtain]);

  return (
    <div
      ref={rootRef}
      className={`home-story home-story--${mood} relative min-h-screen overflow-hidden bg-[#fbfff1] text-[#163323]`}
      style={{ '--story-growth': growth }}
    >
      <div className="scroll-sweep-bg" aria-hidden="true" />

      <div className={`cinematic-curtain ${!showCurtain ? 'is-hidden' : ''}`} aria-hidden={!showCurtain}>
        <div className="curtain-seal" aria-hidden="true">
          <span />
          <i />
        </div>
        <h2 className="curtain-title">Trà Hoa Việt kính chào</h2>
        <p className="curtain-sub">AI đang mở một hành trình lắng nghe cơ thể và tìm lại nhịp sống cân bằng.</p>
        <div className="curtain-ritual-line" aria-hidden="true">
          <span />
        </div>
        <button type="button" className="curtain-btn" onClick={markWelcomeSeen}>
          Bắt đầu hành trình
        </button>
      </div>

      <div className="home-continuity-trail" aria-hidden="true" />
      <div className="home-journey-thread" aria-hidden="true">
        <span className="thread-node thread-node-1" />
        <span className="thread-node thread-node-2" />
        <span className="thread-node thread-node-3" />
        <span className="thread-node thread-node-4" />
      </div>

      <HeroCinematic mood={mood} growth={growth} featuredTea={homeSettings?.featuredTea} />
      <ProblemChapter />
      <HerbalTransitionChapter />
      <AIHologramShowcase showcaseTeas={homeSettings?.showcaseTeas} />
      <ProductShowcasePremium homeSettings={homeSettings} />
      <TrustPremiumSection />
      <FinalWellnessCTA />

      <Footer />
    </div>
  );
};

export default Home;
