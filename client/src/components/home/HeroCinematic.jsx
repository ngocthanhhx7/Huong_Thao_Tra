import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import StoryCityScene from './StoryCityScene';
import { heroContent } from '../../data/homeStoryData';
import { useMouseParallax } from '../../hooks/useMouseParallax';

const HeroCinematic = ({ mood = 'busy', growth = 0 }) => {
  const containerRef = useRef(null);
  const mouseOffset = useMouseParallax(true);
  const [glowStyle, setGlowStyle] = useState({ left: '50%', top: '35%', opacity: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const handleMouseMove = (event) => {
      const box = container.getBoundingClientRect();
      setGlowStyle({
        left: `${event.clientX - box.left}px`,
        top: `${event.clientY - box.top}px`,
        opacity: 0.18,
      });
    };

    const handleMouseLeave = () => {
      setGlowStyle((current) => ({ ...current, opacity: 0 }));
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="hero-story story-section relative isolate min-h-[calc(100vh-80px)] overflow-hidden px-4 pb-20 pt-28 sm:px-6 lg:px-8"
    >
      <div className="hero-atmosphere" aria-hidden="true" />
      <div className="cursor-glow" style={glowStyle} aria-hidden="true" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="max-w-2xl">
          <span className="hero-sequence home-pill">
            <span className="home-pill-dot" />
            {heroContent.label}
          </span>

          <h1 className="hero-sequence font-display-h1 mt-5 text-[2.38rem] leading-[1.04] text-[#17351f] sm:text-5xl lg:text-[4.72rem] xl:text-[5.1rem]">
            {heroContent.headline}
          </h1>

          <p className="hero-sequence mt-6 max-w-xl text-base leading-8 text-[#38513d] sm:text-lg">
            {heroContent.subheadline}
          </p>

          <div className="hero-sequence mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/ai-mix" className="wellness-focus home-btn home-btn-primary">
              {heroContent.primaryCta}
              <span aria-hidden="true">→</span>
            </Link>
            <Link to="/teas" className="wellness-focus home-btn home-btn-secondary">
              {heroContent.secondaryCta}
            </Link>
          </div>

          <div className="hero-sequence mt-9 hidden max-w-lg grid-cols-3 gap-3 sm:grid">
            <div className="hero-metric">
              <strong>04</strong>
              <span>Công thức trà</span>
            </div>
            <div className="hero-metric">
              <strong>AI</strong>
              <span>Trợ lý sức khỏe</span>
            </div>
            <div className="hero-metric">
              <strong>2.5D</strong>
              <span>Chuyển hóa đô thị</span>
            </div>
          </div>

          <p className="hero-sequence mt-5 text-sm font-extrabold text-[#568934]">
            {heroContent.scrollCue}
          </p>
        </div>

        <div className="city-sequence relative">
          <StoryCityScene mouseOffset={mouseOffset} mood={mood} growth={growth} />
        </div>
      </div>
    </section>
  );
};

HeroCinematic.propTypes = {
  mood: PropTypes.oneOf(['busy', 'healing']),
  growth: PropTypes.number,
};

export default HeroCinematic;
