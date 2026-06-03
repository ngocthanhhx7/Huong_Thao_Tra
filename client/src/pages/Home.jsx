import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Footer from '../components/Footer';
import ScrollProgress from '../components/home/ScrollProgress';
import HeroCinematic from '../components/home/HeroCinematic';
import ProblemChapter from '../components/home/ProblemChapter';
import HerbalTransitionChapter from '../components/home/HerbalTransitionChapter';
import AIHologramShowcase from '../components/home/AIHologramShowcase';
import ProductShowcasePremium from '../components/home/ProductShowcasePremium';
import TrustPremiumSection from '../components/home/TrustPremiumSection';
import FinalWellnessCTA from '../components/home/FinalWellnessCTA';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Home = () => {
  const rootRef = useRef(null);
  const [mood, setMood] = useState('busy');
  const [growth, setGrowth] = useState(0);

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      setMood('healing');
      setGrowth(1);
      return;
    }

    gsap.set(['.city-world', '.continuity-trail', '.hero-sequence', '.city-sequence'], {
      willChange: 'transform, opacity',
    });

      gsap.from('.hero-sequence', {
        opacity: 0,
        y: 34,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
      });

      gsap.from('.city-sequence', {
        opacity: 0,
        y: 52,
        rotateX: 8,
        duration: 1.1,
        stagger: 0.08,
        delay: 0.2,
        ease: 'power3.out',
      });

      gsap.utils.toArray('.story-section').forEach((section, index) => {
        gsap.from(section.querySelectorAll('.reveal'), {
          opacity: 0,
          y: 42,
          duration: 0.85,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 74%',
            refreshPriority: index + 1,
          },
        });
      });

      gsap.to('.city-world', {
        yPercent: 10,
        rotate: -1.5,
        scale: 1.035,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-story',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
          refreshPriority: 0,
        },
      });

      gsap.to('.continuity-trail', {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: '.home-story',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          refreshPriority: 0,
        },
      });

      ScrollTrigger.create({
        trigger: '.problem-section',
        start: 'top center',
        end: 'bottom center',
        refreshPriority: 1,
        onEnter: () => setMood('busy'),
        onLeave: () => setMood('healing'),
        onEnterBack: () => setMood('busy'),
        onLeaveBack: () => setMood('busy'),
      });

      ScrollTrigger.create({
        trigger: '.herbal-section',
        start: 'top 70%',
        end: 'bottom 30%',
        scrub: 0.8,
        refreshPriority: 2,
        onUpdate: (self) => {
          const nextGrowth = Number(self.progress.toFixed(3));
          setGrowth(nextGrowth);
          if (nextGrowth > 0.45) setMood('healing');
        },
      });

      gsap.from('.signal-row', {
        opacity: 0,
        x: 26,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.problem-section',
          start: 'top 62%',
          refreshPriority: 1,
        },
      });

      gsap.from('.ai-panel-layer', {
        opacity: 0,
        y: 42,
        rotateX: 8,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.ai-section',
          start: 'top 68%',
          refreshPriority: 3,
        },
      });

      gsap.from('.formula-card', {
        opacity: 0,
        y: 55,
        rotateX: 10,
        duration: 0.85,
        stagger: 0.1,
        ease: 'back.out(1.35)',
        scrollTrigger: {
          trigger: '.products-section',
          start: 'top 70%',
          refreshPriority: 4,
        },
      });
  }, { scope: rootRef });

  return (
    <div
      ref={rootRef}
      className={`home-story home-story--${mood} relative min-h-screen overflow-hidden bg-[#fbfff1] text-[#163323]`}
      style={{ '--story-growth': growth }}
    >
      <ScrollProgress />
      <div className="continuity-trail" aria-hidden="true" />

      <HeroCinematic mood={mood} growth={growth} />
      <ProblemChapter />
      <HerbalTransitionChapter />
      <AIHologramShowcase />
      <ProductShowcasePremium />
      <TrustPremiumSection />
      <FinalWellnessCTA />

      <Footer />
    </div>
  );
};

export default Home;
