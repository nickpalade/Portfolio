import { useEffect, useState, useRef } from "react";
import { ArrowDown, Github, FileText } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/useIsMobile";

function smoothScrollTo(selector: string) {
  const target = document.querySelector(selector);
  if (!target) return;
  const startY = window.scrollY;
  const endY = (target as HTMLElement).getBoundingClientRect().top + startY;
  const duration = 500;
  const startTime = performance.now();
  const easeInOut = (t: number) =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  const step = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + (endY - startY) * easeInOut(progress));
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const ROLES = ["developer", "designer", "builder"];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function Hero() {
  const isMobile = useIsMobile();
  const [roleIndex, setRoleIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollY } = useScroll();

  // Parallax layers — zeroed out on mobile (no parallax, better perf)
  const badgeY    = useTransform(scrollY, [0, 700], isMobile ? [0, 0]  : [0, -50]);
  const headingY  = useTransform(scrollY, [0, 700], isMobile ? [0, 0]  : [0, -90]);
  const subtitleY = useTransform(scrollY, [0, 700], isMobile ? [0, 0]  : [0, -70]);
  const buttonsY  = useTransform(scrollY, [0, 700], isMobile ? [0, 0]  : [0, -50]);
  const heroOpacity  = useTransform(scrollY, [0, 500], isMobile ? [1, 1] : [1, 0]);
  const arrowOpacity = useTransform(scrollY, [0, 200], isMobile ? [1, 1] : [1, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const scrollToProjects = () => {
    smoothScrollTo("#projects");
  };

  return (
    <section
      id="intro"
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden"
    >
      <motion.div
        className="space-y-6 max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ opacity: heroOpacity }}
      >
        <motion.div
          variants={itemVariants}
          style={{ y: badgeY }}
          whileHover={isMobile ? undefined : { scale: 1.05, boxShadow: "0 0 20px rgba(121,144,219,0.4)" }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm cursor-pointer"
        >
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          Available for work
        </motion.div>

        <motion.h1
          variants={itemVariants}
          style={{ y: headingY }}
          className="text-5xl sm:text-6xl font-bold tracking-tight"
        >
          I'm{" "}
          <span className="text-gradient">Nick</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          style={{ y: subtitleY }}
          className="text-2xl font-medium text-muted-foreground"
        >
          <motion.span
            layout
            style={{ display: "inline-block", whiteSpace: "nowrap" }}
            transition={{ type: "spring", stiffness: 180, damping: 22 }}
          >
            {"a "}
            <motion.span
              key={ROLES[roleIndex]}
              className="text-foreground"
              style={{ display: "inline-block" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {ROLES[roleIndex]}
            </motion.span>
          </motion.span>
        </motion.p>

        <motion.p
          variants={itemVariants}
          style={{ y: subtitleY }}
          className="text-xl text-muted-foreground leading-relaxed"
        >
          I'm not here to waste your time. Just scroll down to see what I've built.
        </motion.p>

        <motion.div
          variants={itemVariants}
          style={{ y: buttonsY }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <motion.div
            whileHover={isMobile ? undefined : { scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button onClick={scrollToProjects} size="lg">
              View Projects
            </Button>
          </motion.div>
          <motion.div
            whileHover={isMobile ? undefined : { scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              variant="outline"
              size="lg"
              onClick={() => smoothScrollTo("#contact")}
            >
              Get in Touch
            </Button>
          </motion.div>
          <motion.div
            whileHover={isMobile ? undefined : { scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
          >
            <Button variant="outline" size="lg" asChild>
              <a
                href="https://github.com/nickpalade"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </Button>
          </motion.div>
          <motion.div
            whileHover={isMobile ? undefined : { scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button variant="outline" size="lg" asChild>
              <Link to="/cv" className="inline-flex items-center gap-2">
                <FileText className="h-4 w-4" />
                View CV
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.button
        onClick={scrollToProjects}
        className="absolute bottom-10 text-muted-foreground hover:text-primary transition-colors animate-bounce"
        aria-label="Scroll down"
        style={{ opacity: arrowOpacity }}
        whileHover={isMobile ? undefined : { scale: 1.3, y: 4 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <ArrowDown className="h-6 w-6" />
      </motion.button>
    </section>
  );
}
