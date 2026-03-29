import { useEffect, useState, useRef } from "react";
import { ArrowDown, Github, FileText, GraduationCap, MapPin } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/useIsMobile";
import { usePerformanceMode } from "@/context/PerformanceContext";
import { smoothScrollTo } from "@/lib/utils";


const ROLES = ["developer", "designer", "builder"];

const credentials = [
  { icon: GraduationCap, label: "Leiden University" },
  { icon: MapPin, label: "Netherlands" },
  { label: "B.Sc. DSAI · 2027", mono: true },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
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
  const { isLowPerf } = usePerformanceMode();
  const noEffects = isMobile || isLowPerf;
  const [roleIndex, setRoleIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollY } = useScroll();

  const badgeY     = useTransform(scrollY, [0, 700], noEffects ? [0, 0] : [0, -50]);
  const headingY   = useTransform(scrollY, [0, 700], noEffects ? [0, 0] : [0, -90]);
  const subtitleY  = useTransform(scrollY, [0, 700], noEffects ? [0, 0] : [0, -70]);
  const buttonsY   = useTransform(scrollY, [0, 700], noEffects ? [0, 0] : [0, -50]);
  const heroOpacity   = useTransform(scrollY, [0, 500], noEffects ? [1, 1] : [1, 0]);
  const arrowOpacity  = useTransform(scrollY, [0, 200], noEffects ? [1, 1] : [1, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const scrollToProjects = () => smoothScrollTo("#projects");

  return (
    <section id="intro" className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden" ref={sectionRef}>
      <motion.div
        className="space-y-6 max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ opacity: heroOpacity }}
      >
        {/* Available badge */}
        <motion.div
          variants={itemVariants}
          style={{ y: badgeY }}
          whileHover={noEffects ? undefined : { scale: 1.05, boxShadow: "0 0 20px rgba(121,144,219,0.4)" }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm cursor-pointer"
        >
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          Available for work
        </motion.div>

        {/* Main heading — Cormorant Garamond display */}
        <motion.h1
          variants={itemVariants}
          className="font-display font-bold tracking-tight leading-none"
          style={{ y: headingY, fontSize: "clamp(4rem, 12vw, 7rem)" }}
        >
          I'm{" "}
          <span className="text-gradient">Nick</span>
        </motion.h1>

        {/* Role cycling */}
        <motion.p
          variants={itemVariants}
          style={{ y: subtitleY }}
          className="text-xl font-medium text-muted-foreground"
        >
          <motion.span
            layout
            style={{ display: "inline-block", whiteSpace: "nowrap" }}
            transition={{ type: "spring", stiffness: 180, damping: 22 }}
          >
            {"a "}
            <motion.span
              key={ROLES[roleIndex]}
              className="text-foreground font-display italic"
              style={{ display: "inline-block", fontSize: "1.3em", lineHeight: 1 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {ROLES[roleIndex]}
            </motion.span>
          </motion.span>
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={itemVariants}
          style={{ y: buttonsY }}
          className="flex flex-wrap items-center justify-center gap-3 pt-2"
        >
          {[
            {
              el: <Button onClick={scrollToProjects} size="lg">View Projects</Button>,
              scale: true,
            },
            {
              el: <Button variant="outline" size="lg" onClick={() => smoothScrollTo("#contact")}>Get in Touch</Button>,
              scale: true,
            },
            {
              el: (
                <Button variant="outline" size="lg" asChild>
                  <a href="https://github.com/nickpalade" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                </Button>
              ),
              scale: true,
            },
            {
              el: (
                <Button variant="outline" size="lg" asChild>
                  <Link to="/cv" className="inline-flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    View CV
                  </Link>
                </Button>
              ),
              scale: true,
            },
          ].map(({ el }, i) => (
            <motion.div
              key={i}
              whileHover={noEffects ? undefined : { scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {el}
            </motion.div>
          ))}
        </motion.div>

        {/* Credentials row — mimics Algoverse partner logos */}
        <motion.div
          variants={itemVariants}
          style={{ y: buttonsY }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4"
        >
          <div className="w-full section-divider mb-2 opacity-50" />
          {credentials.map(({ icon: Icon, label, mono }, i) => (
            <span
              key={i}
              className={`flex items-center gap-1.5 text-xs text-muted-foreground/70 ${mono ? "font-mono" : ""}`}
            >
              {Icon && <Icon className="h-3.5 w-3.5 text-primary/60" />}
              {label}
            </span>
          ))}
        </motion.div>

        {/* Scroll arrow */}
        <motion.button
          onClick={scrollToProjects}
          className="flex justify-center w-full text-muted-foreground hover:text-primary transition-colors animate-bounce"
          aria-label="Scroll down"
          style={{ opacity: arrowOpacity, marginTop: "clamp(16px, calc((100vh - 3.5rem - 480px) * 0.35), 4rem)" }}
          whileHover={noEffects ? undefined : { scale: 1.3, y: 4 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <ArrowDown className="h-6 w-6" />
        </motion.button>
      </motion.div>

      {/* Gradient separator at bottom */}
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}
