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
  const [mood, setMood] = useState('busy');
  const [growth, setGrowth] = useState(0);
  const [showCurtain, setShowCurtain] = useState(() => {
    try {
      return window.sessionStorage.getItem('thvWelcomeSeen') !== '1';
    } catch {
      return true;
    }
  });
  const [audioActive, setAudioActive] = useState(false);
  const [homeSettings, setHomeSettings] = useState(null);

  const audioCtxRef = useRef(null);
  const ambientOscsRef = useRef([]);
  const ambientGainRef = useRef(null);

  const fetchHomeSettings = async () => {
    try {
      const { data } = await api.get('/teas/home-settings');
      setHomeSettings(data);
    } catch (err) {
      console.debug('Failed to fetch home settings:', err);
    }
  };

  useEffect(() => {
    fetchHomeSettings();
  }, []);


  const initAudio = () => {
    try {
      if (audioCtxRef.current) {
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }
        return;
      }

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 420;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 2.5);
      ambientGainRef.current = masterGain;

      masterGain.connect(filter);
      filter.connect(ctx.destination);

      const freqs = [261.63, 329.63, 392.0, 493.88];
      const oscs = [];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;

        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(0.012, ctx.currentTime);

        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.12 + idx * 0.04;

        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.007;

        lfo.connect(lfoGain);
        lfoGain.connect(noteGain.gain);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start();
        lfo.start();
        oscs.push({ osc, lfo, noteGain, lfoGain });
      });

      ambientOscsRef.current = oscs;
    } catch (err) {
      console.debug('Failed to initialize audio:', err);
    }
  };

  const playHologramBeep = () => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'suspended' || !audioActive) return;
    try {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(850, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1250, ctx.currentTime + 0.14);

      gainNode.gain.setValueAtTime(0.16, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.14);
    } catch (err) {
      console.debug('Failed to play beep:', err);
    }
  };

  const toggleAudio = () => {
    if (audioActive) {
      if (ambientGainRef.current && audioCtxRef.current) {
        const ctx = audioCtxRef.current;
        ambientGainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
        setTimeout(() => {
          if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
            audioCtxRef.current.suspend().catch((err) => {
              console.debug('Audio suspend failed:', err);
            });
          }
        }, 600);
      }
      setAudioActive(false);
    } else {
      initAudio();
      if (ambientGainRef.current && audioCtxRef.current) {
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume().catch((err) => {
            console.debug('Audio resume failed:', err);
          });
        }
        ambientGainRef.current.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 1.2);
      }
      setAudioActive(true);
    }
  };

  const markWelcomeSeen = useCallback(() => {
    setShowCurtain(false);
    try {
      window.sessionStorage.setItem('thvWelcomeSeen', '1');
    } catch (err) {
      console.debug('Failed to store welcome state:', err);
    }
  }, []);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  useHomeScrollStory(rootRef, {
    reduceMotion,
    setMood,
    setGrowth,
  });

  useEffect(() => {
    if (!showCurtain) return undefined;

    const curtainTimer = window.setTimeout(() => {
      markWelcomeSeen();
    }, 2600);

    return () => {
      window.clearTimeout(curtainTimer);
    };
  }, [markWelcomeSeen, showCurtain]);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch((err) => {
          console.debug('Failed to close AudioContext:', err);
        });
      }
    };
  }, []);

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
        <button
          type="button"
          className="curtain-btn"
          onClick={() => {
            markWelcomeSeen();
            initAudio();
            setAudioActive(true);
          }}
        >
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

      <button
        type="button"
        className={`speaker-control ${audioActive ? 'speaker-control--active' : ''}`}
        onClick={toggleAudio}
        aria-label={audioActive ? 'Tắt nhạc nền thiền định' : 'Bật nhạc nền thiền định'}
      >
        <svg className="speaker-icon" viewBox="0 0 24 24">
          {audioActive ? (
            <path d="M12 2L6.5 7.5H2v9h4.5L12 22V2zm7.5 10c0-1.8-1-3.3-2.5-4.1v8.2c1.5-.8 2.5-2.3 2.5-4.1z" />
          ) : (
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM12 4L6.5 9.5H2v5h4.5L12 20V4z" />
          )}
        </svg>
        <div className="speaker-waves">
          <span className="speaker-wave" />
          <span className="speaker-wave" />
          <span className="speaker-wave" />
        </div>
      </button>

      <HeroCinematic mood={mood} growth={growth} featuredTea={homeSettings?.featuredTea} />
      <ProblemChapter />
      <HerbalTransitionChapter />
      <AIHologramShowcase onBeep={playHologramBeep} showcaseTeas={homeSettings?.showcaseTeas} />
      <ProductShowcasePremium homeSettings={homeSettings} />
      <TrustPremiumSection />
      <FinalWellnessCTA />


      <Footer />
    </div>
  );
};

export default Home;
