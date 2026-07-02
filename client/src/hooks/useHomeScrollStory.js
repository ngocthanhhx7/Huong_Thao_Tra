import { useEffect } from 'react';

export function useHomeScrollStory(rootRef, {
  setMood = () => {},
  setGrowth = () => {},
} = {}) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    setMood('healing');
    setGrowth(1);
    root.dataset.storyGrowth = '1';

    const sceneEl = root.querySelector('[data-home-scene]');
    if (sceneEl) {
      sceneEl.style.setProperty('--growth', '1');
      sceneEl.style.setProperty('--scene-progress', '1');
      sceneEl.style.setProperty('--scan', '1');
    }

    return undefined;
  }, [rootRef, setMood, setGrowth]);
}
