import { useRef } from "react";
import { useMotionValue, useMotionTemplate, useSpring, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/useIsMobile";
import { usePerformanceMode } from "@/context/PerformanceContext";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
}

export function SpotlightCard({ children, className }: SpotlightCardProps) {
  const isMobile = useIsMobile();
  const { isLowPerf } = usePerformanceMode();
  const ref = useRef<HTMLDivElement>(null);

  // MotionValues are created unconditionally (hooks must not be conditional),
  // but on mobile we return a plain div before mounting the motion overlay.
  const spotX = useMotionValue(50);
  const spotY = useMotionValue(50);
  const spotOpacityRaw = useMotionValue(0);
  const spotOpacity = useSpring(spotOpacityRaw, { stiffness: 80, damping: 20 });
  const spotColor = useMotionValue("rgba(121, 144, 219, 0.18)");
  const bg = useMotionTemplate`radial-gradient(circle at ${spotX}% ${spotY}%, ${spotColor} 0%, transparent 65%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    spotX.set(((e.clientX - rect.left) / rect.width) * 100);
    spotY.set(((e.clientY - rect.top) / rect.height) * 100);
    const isDark = document.documentElement.classList.contains("dark");
    spotColor.set(isDark ? "rgba(121, 144, 219, 0.18)" : "rgba(110, 80, 220, 0.14)");
    spotOpacityRaw.set(1);
  };

  // On mobile or low-perf: plain div — no overlay, no event handlers, no motion.div
  if (isMobile || isLowPerf) {
    return <div className={cn("relative", className)}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => spotOpacityRaw.set(0)}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-lg"
        style={{ background: bg, opacity: spotOpacity }}
      />
      {children}
    </div>
  );
}
