import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function MagneticLink({ enabled, children, className = '', ...props }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 180, damping: 18, mass: 0.25 });
  const smoothY = useSpring(y, { stiffness: 180, damping: 18, mass: 0.25 });
  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.a className={className} {...props} style={{ x: enabled ? smoothX : 0, y: enabled ? smoothY : 0 }}
      onPointerMove={(event) => {
        if (!enabled || event.pointerType === 'touch') return;
        const bounds = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - bounds.left - bounds.width / 2) * 0.16);
        y.set((event.clientY - bounds.top - bounds.height / 2) * 0.2);
      }} onPointerLeave={reset} onBlur={reset}>
      {children}
    </motion.a>
  );
}
