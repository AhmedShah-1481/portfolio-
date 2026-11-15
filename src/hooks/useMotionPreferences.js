import { useEffect, useState } from 'react';
import { useMediaQuery } from './useMediaQuery.js';

export function useMotionPreferences() {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const smallScreen = useMediaQuery('(max-width: 767px)');
  const [paused, setPaused] = useState(false);
  // Start with the light fallback until browser capabilities are known.
  const [lowPower, setLowPower] = useState(true);

  useEffect(() => {
    setLowPower(
      Boolean(navigator.connection?.saveData)
      || (navigator.hardwareConcurrency != null && navigator.hardwareConcurrency <= 4)
      || (navigator.deviceMemory != null && navigator.deviceMemory <= 4),
    );
  }, []);

  const motionEnabled = !reducedMotion && !paused;
  return {
    reducedMotion,
    motionEnabled,
    effectsEnabled: motionEnabled && !smallScreen && !lowPower,
    entranceEnabled: motionEnabled && !smallScreen && !lowPower,
    interactiveEnabled: motionEnabled && finePointer && !smallScreen && !lowPower,
    toggleMotion: () => setPaused((value) => !value),
  };
}
