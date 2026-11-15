import { useEffect, useRef } from 'react';

export function useSmoothScroll(enabled) {
  const controller = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;
    let cancelled = false;
    let instance;
    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return;
      instance = new Lenis({
        autoRaf: true,
        duration: 1.05,
        smoothWheel: true,
        syncTouch: false,
        prevent: (node) => node.closest('dialog') !== null,
      });
      controller.current = instance;
    }).catch(() => {
      // Native scrolling remains fully usable if the optional chunk fails.
    });
    return () => {
      cancelled = true;
      instance?.destroy();
      if (controller.current === instance) controller.current = null;
    };
  }, [enabled]);

  return controller;
}
