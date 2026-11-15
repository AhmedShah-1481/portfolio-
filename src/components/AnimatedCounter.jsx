import { useEffect, useRef } from 'react';
import { animate, useInView } from 'framer-motion';

export default function AnimatedCounter({ value, label, decimals = 0, motionEnabled }) {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true, amount: 0.7 });
  const started = useRef(false);
  const formatted = Number(value).toFixed(decimals);

  useEffect(() => {
    if (!motionEnabled || started.current) {
      ref.current.textContent = formatted;
      return undefined;
    }
    if (!visible) { ref.current.textContent = formatted; return undefined; }
    started.current = true;
    const animation = animate(0, value, {
      duration: 1.4, ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => { ref.current.textContent = decimals ? latest.toFixed(decimals) : String(Math.round(latest)); },
      onComplete: () => { ref.current.textContent = formatted; },
    });
    return () => animation.stop();
  }, [visible, value, decimals, motionEnabled, formatted]);

  return <div className="about-counter"><dt>{label}</dt><dd>
    <span className="sr-only">{formatted}</span><span ref={ref} aria-hidden="true" data-counter-value={formatted}>{formatted}</span>
  </dd></div>;
}
