"use client";

import { motion, useScroll, useSpring } from "framer-motion";

// A thin top-edge bar tracking scroll position — the small "you are here"
// detail that shows up on almost every scroll-narrative agency site.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX, top: "env(safe-area-inset-top)" }}
      className="fixed left-0 right-0 z-50 h-[2px] origin-left bg-[#39ff8e]"
    />
  );
}
