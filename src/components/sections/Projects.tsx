import { useState, useRef } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Link, useNavigate } from "react-router-dom";

interface Project {
  title: string;
  description: string;
  tags: string[];
  accent: string;
  link?: { label: string; href: string };
  slug?: string;
}

const projects: Project[] = [
  {
    title: "HomeworkHacker",
    description:
      "An AI you can talk to while doing homework. Say \"hey buddy\" and it starts listening. The backend runs YOLOv5 on the camera. Hold your phone for ten seconds and the AI interrupts you, bypasses mute to do it. Two personality modes: patient tutor and sarcastic friend. Most of the complexity lives in 9 custom React hooks managing a four-state voice FSM, streaming Gemini responses, and screen capture.",
    tags: ["React", "TypeScript", "Python", "Full-Stack", "Comp Vision", "LLM API"],
    accent: "#6366f1",
    link: {
      label: "View on GitHub",
      href: "https://github.com/nickpalade/HomeworkHacker",
    },
    slug: "homeworkhacker",
  },
  {
    title: "yupooscraper",
    description:
      "Yupoo sellers have no search, just hundreds of album thumbnails and no way to filter any of it. This crawls a seller's listing, runs each cover image through a color clustering pipeline in OpenCV, tags by brightness, aspect ratio, and brand name, and stores everything locally. The frontend has compound tag search, color similarity matching, and live scrape progress via SSE. Every filter serializes into the URL so searches are shareable.",
    tags: ["React", "TypeScript", "Python", "Full-Stack", "Comp Vision", "SQL"],
    accent: "#10b981",
    link: {
      label: "View on GitHub",
      href: "https://github.com/nickpalade/yupooscraper",
    },
    slug: "yupooscraper",
  },
  {
    title: "Paraphraser",
    description:
      "Select text, get five rephrasings back, with surrounding context included in the model call so the output actually fits the document. Runs against OpenRouter or a local Ollama instance; the hook that picks the provider keeps the UI from caring which one is active. There's also a code editing mode with CodeMirror and word-level synonym replacement on top of the full-sentence paraphrasing.",
    tags: ["React", "TypeScript", "Frontend", "LLM API"],
    accent: "#8b5cf6",
    link: {
      label: "View on GitHub",
      href: "https://github.com/nickpalade/paraphraser",
    },
    slug: "paraphraser",
  },
  {
    title: "HabitHunter",
    description:
      "A personal finance tracker built to make sense of spending without the bloat of a full budgeting app. Imports directly from Revolut CSV exports, auto-categorizes transactions using a merchant mapping system, and runs linear regression to predict next month's spending by category. Has multi-currency support, monthly budget targets, and 207 tests.",
    tags: ["Python", "Flask", "SQL", "Full-Stack"],
    accent: "#f59e0b",
    link: {
      label: "View on GitHub",
      href: "https://github.com/nickpalade/HabitHunter",
    },
    slug: "habithunter",
  },
  {
    title: "Social Media Website",
    description:
      "Started this because of my fascination with the downsides of social media and its tendency to create echo chambers and spread misinformation. I set out to build a platform that encouraged healthy discussions and diverse perspectives, developed solo in the summer before my A-levels. Contains core social features: posting, commenting, liking, and browsing.",
    tags: ["PHP", "JavaScript", "CSS", "SQL", "Full-Stack"],
    accent: "#f43f5e",
    slug: "socialmedia",
  },
  {
    title: "Roblox Project",
    description:
      "A fully featured Roblox game with over 8,000 lines of Luau code, built entirely solo. Includes custom game mechanics, UI systems, and server-client architecture.",
    tags: ["Lua", "Game Dev"],
    accent: "#f97316",
    link: {
      label: "Play on Roblox",
      href: "https://www.roblox.com/games/13230751727/",
    },
    slug: "roblox",
  },
];

const allTags = ["All", ...Array.from(new Set(projects.flatMap((p) => p.tags)))];

function DecorativePanel({ index, accent, isMobile }: { index: number; accent: string; isMobile: boolean }) {
  return (
    <motion.div
      className="md:w-52 lg:w-60 flex-shrink-0 flex items-center justify-center relative overflow-hidden min-h-52 select-none"
      style={{ backgroundColor: `${accent}0a` }}
      whileHover={isMobile ? undefined : { backgroundColor: accent + "18" }}
      transition={{ duration: 0.3 }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, ${accent}38 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />
      {/* Large project number */}
      <motion.span
        className="relative font-black font-mono leading-none"
        style={{
          color: `${accent}1c`,
          fontSize: "clamp(5rem, 10vw, 8rem)",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </motion.span>
      {/* Accent line */}
      <div
        className={`absolute top-0 bottom-0 w-[3px] ${index % 2 === 1 ? "right-0" : "left-0"}`}
        style={{ backgroundColor: accent }}
      />
    </motion.div>
  );
}

function ProjectCard({ project, index, isMobile }: { project: Project; index: number; isMobile: boolean }) {
  const ref = useRef(null);
  const navigate = useNavigate();
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Parallax zeroed on mobile — still creates subscription but avoids per-card rAF overhead
  const cardY = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [30, -30]);

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if user was dragging to select text
    if (window.getSelection()?.toString()) return;
    // Let native link/button handlers do their thing
    if ((e.target as HTMLElement).closest("a, button")) return;
    if (project.slug) navigate(`/projects/${project.slug}`);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 40 }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ y: cardY }}
      className="glass-card rounded-lg overflow-hidden transition-shadow hover:shadow-lg cursor-pointer"
      whileHover={isMobile ? undefined : { scale: 1.012, y: -4, boxShadow: "0 20px 48px rgba(0,0,0,0.25)" }}
      whileTap={{ scale: 0.995 }}
      onClick={handleCardClick}
    >
      <SpotlightCard
        className={`rounded-lg flex flex-col md:flex-row gap-0 w-full overflow-hidden${
          index % 2 === 1 ? " md:flex-row-reverse" : ""
        }`}
      >
        <DecorativePanel index={index} accent={project.accent} isMobile={isMobile} />

        <div className="flex-1 p-4 sm:p-8 space-y-4">
          <h3
            className="text-2xl font-semibold"
            style={{
              background: `linear-gradient(135deg, rgb(var(--foreground)), ${project.accent})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {project.title}
          </h3>
          <p className="text-muted-foreground leading-relaxed">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <motion.span
                key={tag}
                className="rounded-full px-3 py-1 text-xs font-medium border"
                style={{
                  borderColor: `${project.accent}40`,
                  backgroundColor: `${project.accent}10`,
                  color: project.accent,
                }}
                whileHover={isMobile ? undefined : { scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
          <div className="pt-2 flex flex-wrap gap-2">
            {project.link && (
              <motion.div
                whileHover={isMobile ? undefined : { x: 4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ display: "inline-block" }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  style={{ borderColor: `${project.accent}40` }}
                  className="hover:bg-muted/50"
                >
                  <a href={project.link.href} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    {project.link.label}
                  </a>
                </Button>
              </motion.div>
            )}
            {project.slug && (
              <motion.div
                whileHover={isMobile ? undefined : { x: 4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ display: "inline-block" }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  style={{ color: project.accent }}
                  className="hover:bg-muted/50"
                >
                  <Link to={`/projects/${project.slug}`}>
                    View Details →
                  </Link>
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

export default function Projects() {
  const isMobile = useIsMobile();
  const [activeFilter, setActiveFilter] = useState("All");
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });

  const headingY = useTransform(scrollYProgress, [0, 0.5], isMobile ? [0, 0] : [40, -20]);
  const chipsY   = useTransform(scrollYProgress, [0, 0.5], isMobile ? [0, 0] : [30, -10]);

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.tags.includes(activeFilter));

  const chipsRef = useRef(null);
  const chipsInView = useInView(chipsRef, { once: true, margin: "-40px" });

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="min-h-screen flex flex-col justify-center md:px-4 py-24"
    >
      <div className="container mx-auto max-w-5xl space-y-12">
        <motion.div className="space-y-3" style={{ y: headingY }}>
          <motion.h2
            className="text-4xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={isMobile ? undefined : { x: 3 }}
          >
            My Projects
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            Things I've built that I'm proud of.
          </motion.p>
        </motion.div>

        <motion.div
          ref={chipsRef}
          style={{ y: chipsY }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: chipsInView ? 1 : 0, y: chipsInView ? 0 : 20 }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap gap-2"
        >
          {allTags.map((tag) => (
            <motion.button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeFilter === tag
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
              whileHover={isMobile ? undefined : { scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.93 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {tag}
            </motion.button>
          ))}
        </motion.div>

        <div className="space-y-8">
          {filteredProjects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} isMobile={isMobile} />
          ))}
        </div>
      </div>
    </section>
  );
}
