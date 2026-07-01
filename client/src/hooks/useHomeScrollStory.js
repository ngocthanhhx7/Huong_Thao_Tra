import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function useHomeScrollStory(rootRef, {
  reduceMotion = false,
  setMood = () => {},
  setGrowth = () => {},
} = {}) {
  useGSAP(() => {
    if (!rootRef.current) return;

    if (reduceMotion) {
      // Reduced motion fallback: set final styles statically
      setMood('healing');
      setGrowth(1);
      
      // Set final states for CSS variables on the scene root
      const sceneEl = rootRef.current.querySelector('[data-home-scene]');
      if (sceneEl) {
        sceneEl.style.setProperty('--growth', '1');
        sceneEl.style.setProperty('--scene-progress', '1');
        sceneEl.style.setProperty('--scan', '1');
      }
      return;
    }

    // --- TIMELINES & TWEENS ---
    gsap.set('.hero-atmosphere, .hero-sequence, .city-sequence, .city-world, .diagnostic-board, .ai-panel-layer, .formula-featured-stage, .formula-selector-card, .trust-item', {
      willChange: 'transform, opacity',
    });

    gsap.set('.signal-meter, .mini-trail, .garden-line', {
      transformOrigin: 'left center',
    });

    gsap.set('.trust-item span, .orbit-dot, .garden-leaf', {
      transformOrigin: 'center center',
    });

    // 1. Hero Intro Sequence - upgraded to ultra premium cubic-bezier type physics
    const heroIntroTl = gsap.timeline();
    heroIntroTl
      .from('.hero-atmosphere', { opacity: 0, duration: 1.6, ease: 'power3.out' })
      .from('.hero-sequence', {
        opacity: 0,
        y: 35,
        duration: 1.1,
        stagger: 0.07,
        ease: 'power4.out',
      }, '-=1.1')
      .from('.city-sequence', {
        opacity: 0,
        y: 25,
        scale: 0.97,
        duration: 1.3,
        overwrite: 'auto',
        ease: 'back.out(1.1)',
      }, '-=1.0');

    // 2. Gentle ambient motion only. Avoid shaking HUD elements or large movement loops.
    gsap.to('.botanical-leaf, .city-holo-panel', {
      y: '+=3',
      duration: 9,
      repeat: -1,
      yoyo: true,
      stagger: 0.24,
      ease: 'sine.inOut',
    });

    const mm = gsap.matchMedia();

    mm.add('(min-width: 769px)', () => {
      // 3. Hero scroll sequence - desktop only. Avoid pinning so layout height stays consistent.
      const heroScrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.hero-story',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      heroScrollTl
        .to('.hero-atmosphere', {
          opacity: 0.78,
          ease: 'none',
        }, 0)
        .to('.hero-metric', {
          opacity: 0.55,
          y: -8,
          stagger: 0.04,
          ease: 'none',
        }, 0.12);
    });

    mm.add('(max-width: 768px)', () => {
      gsap.set('.city-world', {
        '--growth': 0.36,
        '--scene-progress': 0.35,
        clearProps: 'transform,rotate,yPercent',
      });

      gsap.set('.city-sequence', {
        clearProps: 'transform,opacity',
      });
    });

    // 4. Background continuity trail: subtle transform-only sunlight linkage.
    gsap.to('.home-continuity-trail', {
      yPercent: -5,
      ease: 'none',
      scrollTrigger: {
        trigger: rootRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
      },
    });

    // 5. Section Mood Switches
    ScrollTrigger.create({
      trigger: '.problem-section',
      start: 'top center',
      end: 'bottom center',
      onEnter: () => setMood('busy'),
      onLeave: () => setMood('healing'),
      onEnterBack: () => setMood('busy'),
      onLeaveBack: () => setMood('busy'),
    });

    ScrollTrigger.create({
      trigger: '.herbal-section',
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 1,
      onUpdate: (self) => {
        const nextGrowth = Number(self.progress.toFixed(2));
        if (nextGrowth === Number(rootRef.current.dataset.storyGrowth || -1)) return;

        rootRef.current.dataset.storyGrowth = nextGrowth.toString();
        setGrowth(nextGrowth);
        if (nextGrowth > 0.45) setMood('healing');
        
        // Update CSS variables dynamically
        const sceneEl = rootRef.current.querySelector('[data-home-scene]');
        if (sceneEl) {
          sceneEl.style.setProperty('--growth', nextGrowth.toString());
          sceneEl.style.setProperty('--scene-progress', self.progress.toString());
        }
      },
    });

    // 8. Problem Diagnostic Timelines - snappy entries with back easing
    const diagnosticTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.problem-section',
        start: 'top 62%',
      }
    });
    diagnosticTl
      .from('.diagnostic-board', {
        opacity: 0,
        y: 40,
        rotateX: 8,
        duration: 1.0,
        ease: 'power4.out',
      })
      .from('.diagnostic-core > div', {
        opacity: 0,
        y: 20,
        duration: 0.7,
        stagger: 0.06,
        ease: 'back.out(1.2)',
      }, '-=0.6')
      .from('.signal-row', {
        opacity: 0,
        x: 35,
        duration: 0.8,
        stagger: 0.06,
        ease: 'power3.out',
      }, '-=0.5')
      .from('.signal-meter', {
        scaleX: 0.1,
        opacity: 0,
        duration: 0.95,
        stagger: 0.06,
        ease: 'power3.out',
      }, '-=0.7');

    // 9. Herbal Growth & Stagger fly-in sequence
    const herbalTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.herbal-transition-scene',
        start: 'top 72%',
      },
    });
    herbalTl
      .from('.collage-card', {
        opacity: 0,
        y: 60,
        scale: 0.92,
        stagger: 0.12,
        duration: 1.1,
        ease: 'back.out(1.2)',
      });

    // 10. AI Hologram Timelines
    const aiHologramTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.ai-section',
        start: 'top 68%',
      }
    });
    aiHologramTl
      .from('.ai-choice-chip', {
        opacity: 0,
        y: 20,
        scale: 0.9,
        stagger: 0.06,
        duration: 0.85,
        ease: 'back.out(1.6)',
      })
      .from('.ai-panel-layer', {
        opacity: 0,
        y: 50,
        rotateX: 10,
        duration: 1.1,
        stagger: 0.1,
        ease: 'power4.out',
      }, '-=0.75')
      .from('.orbit-dot', {
        opacity: 0,
        scale: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'back.out(2.2)',
      }, '-=0.7');

    // 11. Product Reveal Timeline
    const productRevealTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.products-section',
        start: 'top 70%',
      }
    });
    productRevealTl
      .from('.formula-featured-stage', {
        opacity: 0,
        y: 65,
        rotateX: 5,
        duration: 1.1,
        ease: 'power4.out',
      })
      .from('.formula-featured-stage img', {
        opacity: 0,
        scale: 0.82,
        y: 25,
        duration: 0.9,
        stagger: 0.05,
        ease: 'back.out(1.2)',
      }, '-=0.75')
      .from('.formula-selector-card', {
        opacity: 0,
        x: 35,
        duration: 0.8,
        stagger: 0.06,
        ease: 'power3.out',
      }, '-=0.65');

    const trustTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.trust-section',
        start: 'top 74%',
      },
    });
    trustTl
      .from('.trust-item', {
        opacity: 0,
        y: 34,
        duration: 0.7,
        stagger: 0.09,
        ease: 'power2.out',
      })
      .from('.trust-item span', {
        scale: 0.72,
        opacity: 0,
        duration: 0.45,
        stagger: 0.08,
        ease: 'back.out(2)',
      }, '-=0.45');

    // 12. Final Calm Section Timeline
    const finalCalmTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.final-section',
        start: 'top 80%',
      }
    });
    finalCalmTl.from('.final-section .reveal', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
    })
    .from('.garden-line', {
      scaleX: 0,
      opacity: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: 'power2.out',
    }, '-=0.65')
    .from('.garden-leaf', {
      opacity: 0,
      scale: 0.72,
      y: 18,
      duration: 0.65,
      stagger: 0.1,
      ease: 'back.out(1.8)',
    }, '-=0.55');

    // 13. Staggered reveal on general storytelling sections - cinematic smooth slide up
    gsap.utils.toArray('.story-section').forEach((section) => {
      // Skip hero section since we handle it in heroIntroTl
      if (section.classList.contains('hero-story')) return;

      gsap.from(section.querySelectorAll('.reveal'), {
        opacity: 0,
        y: 40,
        duration: 1.1,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 76%',
        },
      });
    });

    let isActive = true;

    const refreshScroll = () => {
      if (!isActive) return;
      ScrollTrigger.refresh();
    };

    if (document.readyState === 'complete') {
      refreshScroll();
    } else {
      window.addEventListener('load', refreshScroll);
    }

    if (document.fonts?.ready) {
      document.fonts.ready.then(refreshScroll).catch(() => {});
    }

    const refreshTimer = window.setTimeout(refreshScroll, 600);

    return () => {
      isActive = false;
      mm.revert();
      window.clearTimeout(refreshTimer);
      window.removeEventListener('load', refreshScroll);
    };

  }, { scope: rootRef });
}
