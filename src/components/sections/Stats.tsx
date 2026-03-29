import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: "6", label: "Projects Shipped" },
  { value: "15+", label: "Technologies" },
  { value: "8k+", label: "Lines of Luau" },
];

export default function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div className="border-y border-border/60 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto max-w-5xl px-4 md:px-8 py-10 md:py-14" ref={ref}>
        <div className="grid grid-cols-3 gap-4 text-center">
          {stats.map(({ value, label }, i) => (
            <motion.div
              key={label}
              className="space-y-1"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
            >
              <div
                className="font-display font-bold text-gradient leading-none"
                style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)" }}
              >
                {value}
              </div>
              <div className="text-xs font-mono uppercase tracking-[0.15em] text-muted-foreground">
                {label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
