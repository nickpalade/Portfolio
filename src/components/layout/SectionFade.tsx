import { motion } from "framer-motion";
import React from "react";
import { useSectionContext } from "@/context/SectionContext";

type Props = React.PropsWithChildren<{
  id: string;
  className?: string;
}>;

const SectionFade = React.forwardRef<HTMLElement, Props>(({ id, className = "", children }, ref) => {
  const { activeSection } = useSectionContext();
  const active = activeSection === `#${id}`;

  return (
    <motion.section
      ref={ref as any}
      id={id}
      className={className}
      initial={false}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0.12, y: 12 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.section>
  );
});

SectionFade.displayName = "SectionFade";

export default SectionFade;
