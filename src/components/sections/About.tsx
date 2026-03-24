import React, { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Code2, Gamepad2, Palette } from "lucide-react";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { useIsMobile } from "@/hooks/useIsMobile";

const skills = [
  {
    icon: Code2,
    title: "Web Development",
    description: "Building full-stack web apps with a range of technologies from PHP and MySQL to modern JS frameworks.",
  },
  {
    icon: Palette,
    title: "Creative Design",
    description: "Designing clean, functional interfaces with a strong eye for layout, colour, and typography.",
  },
  {
    icon: Gamepad2,
    title: "Game Development",
    description: "Creating interactive experiences in Roblox with thousands of lines of Luau scripting.",
  },
];

const techStack = [
  "TypeScript",
  "Python",
  "Java",
  "React",
  "FastAPI",
  "Flask",
  "PyTorch",
  "OpenCV",
  "YOLO",
  "Node.js",
  "Tailwind CSS",
  "SQL",
  "PHP",
  "Lua",
  "Git",
];

const handleEduClick = (e: React.MouseEvent) => {
  if (window.getSelection()?.toString()) return;
  if ((e.target as HTMLElement).closest("a, button")) return;
  window.open(
    "https://www.universiteitleiden.nl/en/education/study-programmes/bachelor/data-science-and-artificial-intelligence",
    "_blank",
    "noopener,noreferrer"
  );
};

export default function About() {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });

  // Parallax layers — zeroed on mobile
  const photoY   = useTransform(scrollYProgress, [0, 1],   isMobile ? [0, 0]    : [60, -60]);
  const bioY     = useTransform(scrollYProgress, [0, 1],   isMobile ? [0, 0]    : [30, -30]);
  const headingY = useTransform(scrollYProgress, [0, 0.6], isMobile ? [0, 0]    : [40, -20]);
  const cardsY   = useTransform(scrollYProgress, [0, 1],   isMobile ? [0, 0]    : [20, -20]);
  const techY    = useTransform(scrollYProgress, [0.2, 1], isMobile ? [0, 0]    : [30, -10]);

  const bioRef = useRef(null);
  const bioInView = useInView(bioRef, { once: true, margin: "-100px" });

  const photoRef = useRef(null);
  const photoInView = useInView(photoRef, { once: true, margin: "-100px" });

  const cardsRef = useRef(null);
  const cardsInView = useInView(cardsRef, { once: true, margin: "-100px" });

  const techRef = useRef(null);
  const techInView = useInView(techRef, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={sectionRef} className="flex flex-col justify-center md:px-4 py-16">
      <div className="container mx-auto max-w-5xl space-y-12">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          <motion.div
            ref={bioRef}
            className="space-y-6"
            style={{ y: bioY }}
            initial={{ opacity: 0 }}
            animate={bioInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.h2
              className="text-4xl font-bold tracking-tight"
              style={{ y: headingY }}
            >
              About Me
            </motion.h2>
            <motion.p
              className="text-muted-foreground leading-relaxed text-lg"
              whileHover={isMobile ? undefined : { x: 4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              I'm studying Data Science & AI at Leiden University and building things on the side.
              I want to be part of a team where I ship something real and find out where it breaks.
            </motion.p>
            <motion.p
              className="text-muted-foreground leading-relaxed"
              whileHover={isMobile ? undefined : { x: 4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              I'm drawn to companies that build their own internal software at scale, problems specific enough
              that generic solutions don't work. I do my best work when I own a full problem, not just a small task.
            </motion.p>
          </motion.div>

          <motion.div
            ref={photoRef}
            className="flex justify-center"
            style={{ y: photoY }}
            initial={{ opacity: 0 }}
            animate={photoInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div style={{ perspective: "700px" }}>
              <motion.div
                style={{ transformStyle: "preserve-3d", position: "relative", width: "12rem", height: "12rem" }}
                initial={{ rotateY: 90 }}
                animate={photoInView ? { rotateY: 0 } : { rotateY: 90 }}
                transition={{ duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {/* Front face — photo */}
                <div
                  style={{ backfaceVisibility: "hidden", position: "absolute", inset: 0 }}
                  className="flex items-center justify-center"
                >
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl" />
                    <img
                      src={`${import.meta.env.BASE_URL}img/me.jpg`}
                      alt="Nick"
                      loading="lazy"
                      className="relative w-48 h-48 rounded-full object-cover border-4 border-border shadow-2xl"
                    />
                  </div>
                </div>
                {/* Back face — initials */}
                <div
                  style={{ backfaceVisibility: "hidden", position: "absolute", inset: 0, transform: "rotateY(180deg)" }}
                  className="flex items-center justify-center"
                >
                  <div
                    className="w-48 h-48 rounded-full border-4 border-primary/50 shadow-2xl flex items-center justify-center bg-card/80 backdrop-blur-sm"
                    style={{ background: "radial-gradient(circle at center, rgba(196,165,255,0.2), rgba(147,210,255,0.12))" }}
                  >
                    <span className="text-5xl font-black font-mono text-gradient select-none">NP</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div ref={cardsRef} className="grid gap-6 sm:grid-cols-3" style={{ y: cardsY }}>
          {skills.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 32 }}
              animate={cardsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
              whileHover={isMobile ? undefined : { y: -6, boxShadow: "0 16px 40px rgba(121,144,219,0.18)" }}
            >
              <SpotlightCard className="glass-card rounded-lg p-6 space-y-3 h-full">
                <motion.div
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
                  whileHover={isMobile ? undefined : { scale: 1.2, rotate: 12, backgroundColor: "rgba(var(--primary), 0.2)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <Icon className="h-5 w-5" />
                </motion.div>
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          ref={techRef}
          className="space-y-4"
          style={{ y: techY }}
          initial={{ opacity: 0 }}
          animate={techInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h3 className="text-xl font-semibold tracking-tight">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech, index) => (
              <motion.span
                key={tech}
                className="rounded-full border border-primary/30 bg-primary/10 text-primary px-3 py-1 text-xs font-mono cursor-default"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={techInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                transition={{ type: "spring", stiffness: 400, damping: 17, delay: index * 0.05 }}
                whileHover={isMobile ? undefined : { scale: 1.12, y: -3, boxShadow: "0 4px 16px rgba(121,144,219,0.35)" }}
                whileTap={{ scale: 0.95 }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h3 className="text-xl font-semibold tracking-tight">Education</h3>
          <motion.div
            className="rounded-lg overflow-hidden cursor-pointer"
            style={{ boxShadow: "0 0px 0px rgba(121,144,219,0)" }}
            whileHover={isMobile ? undefined : { boxShadow: "0 24px 64px rgba(121,144,219,0.25)" }}
            whileTap={{ scale: 0.995 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onClick={handleEduClick}
          >
            <SpotlightCard className="glass-card rounded-lg flex flex-col sm:flex-row">
              {/* Logo panel — flush edges, full height; outer corners clipped by parent overflow-hidden */}
              <div className="h-24 sm:h-auto sm:w-40 bg-white flex-shrink-0 flex items-center justify-center p-5">
                <img
                  src={`${import.meta.env.BASE_URL}img/Universiteit-Leiden-logo.png`}
                  alt="Leiden University"
                  className="h-full w-full object-contain"
                  draggable={false}
                />
              </div>
              {/* Content */}
              <div className="flex-1 p-6 space-y-1.5">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                  <span className="font-semibold text-base">B.Sc. Data Science &amp; Artificial Intelligence</span>
                  <span className="text-sm text-muted-foreground">Leiden University</span>
                  <span className="text-xs font-mono text-primary/70 ml-auto">Expected 2027</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Machine Learning · Neural Computing · Reinforcement Learning · Algorithms &amp; Data Structures · Databases · Software Development · Security · Symbolic AI · Research Methods in AI · Statistics
                </p>
              </div>
            </SpotlightCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
