import React, { useRef } from "react";
import { motion, useInView, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { Code2, Gamepad2, Palette, UserCircle2 } from "lucide-react";
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
  "TypeScript", "Python", "Java", "React", "FastAPI", "Flask",
  "PyTorch", "OpenCV", "YOLO", "Node.js", "Tailwind CSS", "SQL", "PHP", "Lua", "Git",
];

function PhotoCard({ photoInView, isMobile }: { photoInView: boolean; isMobile: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseXRaw   = useMotionValue(50);
  const mouseYRaw   = useMotionValue(50);
  const hoverRaw    = useMotionValue(0);

  const mouseX      = useSpring(mouseXRaw,  { stiffness: 320, damping: 28 });
  const mouseY      = useSpring(mouseYRaw,  { stiffness: 320, damping: 28 });
  const hoverSpring = useSpring(hoverRaw,   { stiffness: 200, damping: 22 });

  const rotateX = useTransform(mouseY, [0, 100], [10, -10]);
  const rotateY = useTransform(mouseX, [0, 100], [-10, 10]);
  const glare   = useMotionTemplate`radial-gradient(circle at ${mouseX}% ${mouseY}%, rgba(255,255,255,0.22) 0%, transparent 58%)`;

  // Shadow animates independently — moves down + grows as card lifts
  const shadowY       = useTransform(hoverSpring, [0, 1], [0, 14]);
  const shadowOpacity = useTransform(hoverSpring, [0, 1], [0.25, 1]);
  const shadowScaleX  = useTransform(hoverSpring, [0, 1], [0.88, 1.08]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current!.getBoundingClientRect();
    mouseXRaw.set(((e.clientX - rect.left) / rect.width) * 100);
    mouseYRaw.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  return (
    <motion.div
      className="relative w-full max-w-[240px] mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={photoInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* ── Shadow — outside the perspective wrapper, never tilts ── */}
      {!isMobile && (
        <motion.div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: "100%",
            background: "radial-gradient(ellipse 100% 55% at 50% 100%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.45) 40%, transparent 72%)",
            filter: "blur(22px)",
            y: shadowY,
            opacity: shadowOpacity,
            scaleX: shadowScaleX,
            zIndex: 0,
            transformOrigin: "50% 100%",
          }}
        />
      )}

      {/* Ambient glow — also outside, never tilts */}
      <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-3xl pointer-events-none" style={{ zIndex: 0 }} />

      {/* ── Perspective wrapper — only the card lives here ── */}
      <div className="relative" style={{ perspective: "900px", zIndex: 1 }}>
        <motion.div
          ref={cardRef}
          className="relative cursor-default"
          style={isMobile ? {} : { rotateX, rotateY, transformStyle: "preserve-3d" } as any}
          onMouseMove={isMobile ? undefined : onMove}
          onMouseEnter={isMobile ? undefined : () => hoverRaw.set(1)}
          onMouseLeave={isMobile ? undefined : () => { hoverRaw.set(0); mouseXRaw.set(50); mouseYRaw.set(50); }}
          whileHover={isMobile ? undefined : { scale: 1.045 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
        >
          {/* Card */}
          <div className="relative rounded-2xl overflow-hidden border border-border/60 gradient-border aspect-[3/4]">
            <img
              src={`${import.meta.env.BASE_URL}img/me.jpg`}
              alt="Nick"
              loading="lazy"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
                const sibling = e.currentTarget.nextElementSibling as HTMLElement | null;
                if (sibling) sibling.style.opacity = "1";
              }}
            />

            {/* Placeholder */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-muted/30 transition-opacity"
              style={{ opacity: 0 }}
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: "radial-gradient(circle, rgba(121,144,219,0.18) 1px, transparent 1px)",
                  backgroundSize: "22px 22px",
                }}
              />
              <UserCircle2 className="h-20 w-20 text-primary/25 relative z-10" />
              <span className="text-xs font-mono text-muted-foreground/40 uppercase tracking-[0.2em] relative z-10">
                Profile Photo
              </span>
            </div>

            {/* Glare */}
            {!isMobile && (
              <motion.div
                className="absolute inset-0 pointer-events-none z-10 rounded-2xl"
                style={{ background: glare, opacity: hoverSpring }}
              />
            )}

            {/* Name overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent z-20">
              <p className="font-display font-semibold text-white text-lg leading-tight">Nick Palade</p>
              <p className="text-white/60 text-xs font-mono mt-0.5">B.Sc. DSAI · Leiden</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chip — outside perspective wrapper, never tilts */}
      <motion.div
        className="absolute -top-3 left-1/2 -translate-x-1/2 glass-card rounded-xl px-3 py-2 text-xs font-mono border border-primary/30 shadow-lg whitespace-nowrap backdrop-blur-md"
        style={{ zIndex: 2 }}
        initial={{ opacity: 0, y: -12 }}
        animate={photoInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse inline-block mr-1.5" />
        Open to work
      </motion.div>
    </motion.div>
  );
}

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

  const photoY = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [20, -40]);
  const bioY   = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [30, -30]);

  const photoRef = useRef(null);
  const photoInView = useInView(photoRef, { once: true, margin: "-80px" });

  const bioRef = useRef(null);
  const bioInView = useInView(bioRef, { once: true, margin: "-80px" });

  const techRef = useRef(null);
  const techInView = useInView(techRef, { once: true, margin: "-60px" });

  return (
    <section id="about" className="overflow-hidden" ref={sectionRef}>
      <div className="container mx-auto max-w-6xl px-4 md:px-8">

        {/* ── Two-column layout ── */}
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">

          {/* LEFT — portrait image panel */}
          <motion.div
            ref={photoRef}
            className="relative order-last md:order-first flex justify-center"
            style={{ y: photoY }}
          >
            <PhotoCard photoInView={photoInView} isMobile={isMobile} />
          </motion.div>

          {/* RIGHT — bio + numbered skills */}
          <motion.div
            ref={bioRef}
            className="pt-8 md:pt-0 space-y-10"
            style={{ y: bioY }}
            initial={{ opacity: 0 }}
            animate={bioInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="space-y-5">
              <div className="section-label">
                <span className="section-label-bar" />
                <span className="section-label-text">About</span>
              </div>
              <h2
                className="font-display font-bold tracking-tight leading-tight"
                style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)" }}
              >
                About Me
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                I'm studying Data Science & AI at Leiden University and building things on the side.
                I want to be part of a team where I ship something real and find out where it breaks.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                I'm drawn to companies that build their own internal software at scale — problems specific enough
                that generic solutions don't work. I do my best work when I own a full problem, not just a small task.
              </p>
            </div>

            {/* Numbered skills — Algoverse chevron steps */}
            <div className="space-y-7">
              {skills.map(({ icon: Icon, title, description }, i) => (
                <motion.div
                  key={title}
                  className="flex items-start gap-5"
                  initial={{ opacity: 0, x: -16 }}
                  animate={bioInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                >
                  {/* Large serif number */}
                  <span
                    className="font-display font-bold leading-none flex-shrink-0 select-none"
                    style={{ fontSize: "3.5rem", color: "rgb(var(--primary) / 0.15)", lineHeight: 1, width: "2.5rem", textAlign: "right" }}
                  >
                    {i + 1}
                  </span>
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                      <h3 className="font-display font-semibold text-xl leading-tight">{title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Tech stack + Education ── */}
        <div className="space-y-12 py-16 md:py-20">

          {/* Tech stack */}
          <motion.div
            ref={techRef}
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={techInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="section-label mb-0">
                <span className="section-label-bar" />
                <span className="section-label-text">Tech Stack</span>
              </div>
              <span className="text-xs font-mono text-muted-foreground/60 border border-border rounded-full px-2.5 py-0.5">
                15+ technologies
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, index) => (
                <motion.span
                  key={tech}
                  className="rounded-full border border-primary/30 bg-primary/10 text-primary px-3 py-1 text-xs font-mono cursor-default"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={techInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ type: "spring", stiffness: 400, damping: 17, delay: index * 0.04 }}
                  whileHover={isMobile ? undefined : { scale: 1.12, y: -3, boxShadow: "0 4px 16px rgba(121,144,219,0.35)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Education */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="section-label">
              <span className="section-label-bar" />
              <span className="section-label-text">Education</span>
            </div>
            <motion.div
              className="rounded-lg overflow-hidden cursor-pointer"
              whileHover={isMobile ? undefined : { boxShadow: "0 24px 64px rgba(121,144,219,0.2)" }}
              whileTap={{ scale: 0.995 }}
              transition={{ duration: 0.4 }}
              onClick={handleEduClick}
            >
              <SpotlightCard className="glass-card rounded-lg flex flex-col sm:flex-row">
                <div className="flex-shrink-0 flex items-center justify-center p-5 sm:p-6 sm:pl-6 sm:pr-2">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center border-2 border-border shadow-lg overflow-hidden p-2.5">
                      <img
                        src={`${import.meta.env.BASE_URL}img/Universiteit-Leiden-logo.png`}
                        alt="Leiden University"
                        className="w-full h-full object-contain"
                        draggable={false}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-6 space-y-1.5">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                    <span className="font-display font-semibold text-lg">B.Sc. Data Science &amp; Artificial Intelligence</span>
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

      </div>
    </section>
  );
}
