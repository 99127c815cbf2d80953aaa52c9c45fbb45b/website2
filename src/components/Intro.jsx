import { motion } from "framer-motion";
import "./Intro.css";

/* ------------------------------------------------------------------
   INTRO — plays once on initial mount.
   Timeline (~2.6s total):
     0.0s  wordmark fades + scales in, letters stagger
     ~1.2s hold
     ~1.8s smoke dissolve (blur 0 → 26px, opacity → 0, scale → 1.08)
     ~2.6s onComplete() fires → App unmounts this and cross-fades in main
   EDIT COPY: change WORDMARK_PARTS below.
------------------------------------------------------------------ */

// Each group gets its own colour, per the brand spec.
const WORDMARK_PARTS = [
  { text: "APH", color: "var(--coral)" },
  { text: "RO.", color: "var(--coral-warm)" },
];

const letters = WORDMARK_PARTS.flatMap((part, partIndex) =>
  part.text.split("").map((char, charIndex) => ({
    char,
    color: part.color,
    key: `${partIndex}-${charIndex}`,
  })),
);

export default function Intro({ onComplete }) {
  return (
    <motion.div
      className="intro"
      initial={{ opacity: 1 }}
      animate={{
        // Smoke dissolve: blur + fade + subtle scale-up, held then released.
        filter: ["blur(0px)", "blur(0px)", "blur(26px)"],
        opacity: [1, 1, 0],
        scale: [1, 1, 1.08],
      }}
      transition={{
        duration: 2.6,
        times: [0, 0.62, 1], // hold until 62% of the timeline, then dissolve
        ease: "easeOut",
      }}
      onAnimationComplete={onComplete}
    >
      <h1 className="intro__wordmark" aria-label="APHRO.">
        {letters.map(({ char, color, key }, i) => (
          <motion.span
            key={key}
            aria-hidden="true"
            style={{ color }}
            initial={{ opacity: 0, y: 28, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.7,
              delay: i * 0.07, // letter stagger
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {char}
          </motion.span>
        ))}
      </h1>
    </motion.div>
  );
}
