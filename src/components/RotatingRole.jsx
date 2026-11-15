import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { profile } from '../data/profile.js';

export default function RotatingRole({ enabled }) {
  const [index, setIndex] = useState(0);
  const roles = profile.site.roles;

  useEffect(() => {
    if (!enabled) return undefined;
    let interval;
    const update = () => {
      clearInterval(interval);
      if (!document.hidden) interval = setInterval(() => setIndex((value) => (value + 1) % roles.length), 3600);
    };
    update();
    document.addEventListener('visibilitychange', update);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', update);
    };
  }, [enabled, roles.length]);

  return (
    <div className="role-line">
      <span className="sr-only">{roles.join(', ')}</span>
      <span className="role-slash" aria-hidden="true">/</span>
      <div className="role-frame" aria-hidden="true">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={index} className="role-text"
            initial={enabled ? { y: '85%', opacity: 0 } : false}
            animate={{ y: 0, opacity: 1 }} exit={enabled ? { y: '-85%', opacity: 0 } : undefined}
            transition={{ duration: enabled ? 0.3 : 0 }}>
            {roles[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
