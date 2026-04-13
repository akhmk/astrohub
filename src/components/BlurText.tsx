import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  direction?: "top" | "bottom";
}

export default function BlurText({
  text,
  className = "",
  delay = 100,
  direction = "bottom",
}: BlurTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const words = text.split(" ");

  return (
    <div ref={ref} className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{
            filter: "blur(10px)",
            opacity: 0,
            y: direction === "bottom" ? 50 : -50,
          }}
          animate={
            isInView
              ? {
                  filter: ["blur(10px)", "blur(5px)", "blur(0px)"],
                  opacity: [0, 0.5, 1],
                  y: [direction === "bottom" ? 50 : -50, -5, 0],
                }
              : {}
          }
          transition={{
            duration: 0.7,
            delay: (delay + i * 100) / 1000,
            times: [0, 0.5, 1],
            ease: "easeOut",
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}
