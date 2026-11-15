import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress({ motionEnabled }) {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 180, damping: 35 });
  return <motion.div className="scroll-progress" aria-hidden="true"
    style={{ scaleX: motionEnabled ? smoothProgress : scrollYProgress }} />;
}
