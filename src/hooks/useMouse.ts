import { useEffect } from "react";
import { useMotionValue } from "framer-motion";

export function useMouse() {
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const mouseX2 = useMotionValue(50);
  const mouseY2 = useMotionValue(50);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 100;
      const ny = (e.clientY / window.innerHeight) * 100;
      mouseX.set(nx);
      mouseY.set(ny);
      mouseX2.set(100 - nx);
      mouseY2.set(100 - ny);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []); // MotionValue identity is stable — runs once on mount only

  return { mouseX, mouseY, mouseX2, mouseY2 };
}
