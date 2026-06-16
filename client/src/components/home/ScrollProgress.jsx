import { useEffect, useRef, useState } from 'react';

const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (frameRef.current) return;

      frameRef.current = window.requestAnimationFrame(() => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight <= 0) {
          setScrollProgress(0);
          frameRef.current = null;
          return;
        }

        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
        frameRef.current = null;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div className="scroll-progress fixed left-0 top-0 z-[100] h-1.5 w-full bg-slate-200/30">
      <div 
        className="scroll-progress__bar h-full bg-gradient-to-r from-[#add489] via-[#568934] to-[#add489]"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
      />
    </div>
  );
};

export default ScrollProgress;
