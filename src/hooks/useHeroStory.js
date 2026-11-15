import { useEffect } from 'react';

export function useHeroStory(ref, enabled) {
  useEffect(() => {
    if (!enabled) return undefined;
    let cancelled = false;
    let context;
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([animation, plugin]) => {
      if (cancelled || !ref.current) return;
      const { gsap } = animation;
      const { ScrollTrigger } = plugin;
      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
        gsap.to('.hero-visual-parallax', {
          y: 65,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
      }, ref);
    }).catch(() => {
      // The hero remains visible if optional scroll effects cannot load.
    });
    return () => {
      cancelled = true;
      context?.revert();
    };
  }, [ref, enabled]);
}
