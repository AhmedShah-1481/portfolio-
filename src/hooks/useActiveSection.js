import { useEffect, useState } from 'react';
import { profile } from '../data/profile.js';

export function useActiveSection() {
  const [activeId, setActiveId] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let nextId = 'home';
      for (const { id } of profile.site.navigation) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= window.innerHeight * 0.35) {
          nextId = id;
        }
      }
      setActiveId(nextId);
      setScrolled(window.scrollY > 24);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  return { activeId, scrolled };
}
