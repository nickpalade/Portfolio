import { useState, useRef } from "react";
import { ExternalLink, ImageIcon, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Link, useNavigate } from "react-router-dom";

import { useCardTransition } from "@/context/CardTransitionContext";

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
      "A React + Python full-stack tutor that listens for a wake word, streams responses out loud as they generate, and runs a YOLOv5 object detection model against your webcam the whole time. Hold your phone in frame for ten seconds and it interrupts whatever it is doing to call you out, even through a muted tab.",
    tags: ["React", "TypeScript", "Python", "Full-Stack", "Comp Vision", "LLM API"],
    accent: "#6366f1",
    link: { label: "GitHub", href: "https://github.com/nickpalade/HomeworkHacker" },
    slug: "homeworkhacker",
  },
  {
    title: "yupooscraper",
    description:
      "Yupoo is where wholesale clothing sellers post their catalogs, but there's no search. This scrapes a seller's entire catalog, runs images through k-means color clustering, and detects brand names even when sellers write them as \"N★ke\" to dodge takedowns.",
    tags: ["React", "TypeScript", "Python", "Full-Stack", "Comp Vision", "SQL"],
    accent: "#10b981",
    link: { label: "GitHub", href: "https://github.com/nickpalade/yupooscraper" },
    slug: "yupooscraper",
  },
  {
    title: "Paraphraser",
    description:
      "Right-click any word or phrase and five rephrasings stream back word by word. Forty words of context on either side make suggestions fit the document. Accepting one diffs the actual changes and only resets that part of the undo history.",
    tags: ["React", "TypeScript", "Frontend", "LLM API"],
    accent: "#8b5cf6",
    link: { label: "GitHub", href: "https://github.com/nickpalade/paraphraser" },
    slug: "paraphraser",
  },
  {
    title: "HabitHunter",
    description:
      "Drop in your Revolut CSV and it auto-categorizes transactions by merchant. Correct one wrong category and it fixes every other from that merchant. Spending forecasts via a linear regression engine built from scratch. 207 unit tests.",
    tags: ["Python", "Flask", "SQL", "Full-Stack"],
    accent: "#f59e0b",
    link: { label: "GitHub", href: "https://github.com/nickpalade/HabitHunter" },
    slug: "habithunter",
  },
  {
    title: "Social Media Website",
    description:
      "Raw PHP and vanilla JavaScript — no frameworks. Session handling, recursive thread system, and chronological feeds built by hand. Designed in reaction to how recommendation algorithms push people into opinion bubbles.",
    tags: ["PHP", "JavaScript", "CSS", "SQL", "Full-Stack"],
    accent: "#f43f5e",
    slug: "socialmedia",
  },
  {
    title: "Roblox Project",
    description:
      "A mining and progression game built solo: over 8,000 lines of type-annotated Luau, no borrowed scripts. All game logic runs on the server, clients only send input and receive results — stats cannot be faked.",
    tags: ["Lua", "Game Dev"],
    accent: "#f97316",
    link: { label: "Play on Roblox", href: "https://www.roblox.com/games/13230751727/" },
    slug: "roblox",
  },
];

const allTags = ["All", ...Array.from(new Set(projects.flatMap((p) => p.tags)))];

// Per-position layout config — drives image aspect, column span, and stagger offset
// Designed for the 6-project bento grid; repeats for filtered subsets
const LAYOUTS = [
  { colSpan: 2, imageAspect: "aspect-[16/9]", mt: 0,  horizontal: false }, // 0: wide, landscape
  { colSpan: 1, imageAspect: "aspect-[3/4]",  mt: 32, horizontal: false }, // 1: portrait, dropped
  { colSpan: 1, imageAspect: "aspect-[4/3]",  mt: 0,  horizontal: false }, // 2: normal
  { colSpan: 1, imageAspect: "aspect-[4/3]",  mt: 40, horizontal: false }, // 3: normal, dropped
  { colSpan: 1, imageAspect: "aspect-[4/3]",  mt: 16, horizontal: false }, // 4: normal, slight drop
  { colSpan: 3, imageAspect: "",              mt: 0,  horizontal: true  }, // 5: full-width horizontal
] as const;

// ── Image placeholder ───────────────────────────────────────────────────────

function ImgPlaceholder({ accent, className = "" }: { accent: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden w-full flex-shrink-0 ${className}`} style={{ backgroundColor: `${accent}08` }}>
      <div
        className="absolute inset-0"
        style={{ backgroundImage: `radial-gradient(circle, ${accent}28 1px, transparent 1px)`, backgroundSize: "18px 18px" }}
      />
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: accent }} />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{ backgroundColor: `${accent}10`, borderColor: `${accent}30` }}>
          <ImageIcon className="h-4 w-4" style={{ color: `${accent}70` }} />
        </div>
        <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: `${accent}45` }}>preview</span>
      </div>
    </div>
  );
}

// ── Single project card ─────────────────────────────────────────────────────

function ProjectCard({ project, layoutIndex, isMobile }: { project: Project; layoutIndex: number; isMobile: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const layout = LAYOUTS[layoutIndex % LAYOUTS.length];
  const { setOrigin } = useCardTransition();

  const handleClick = (e: React.MouseEvent) => {
    if (window.getSelection()?.toString()) return;
    if ((e.target as HTMLElement).closest("a, button")) return;
    if (project.slug) {
      const el = ref.current;
      if (el) {
        const r = el.getBoundingClientRect();
        setOrigin({ top: r.top, left: r.left, width: r.width, height: r.height, accent: project.accent });
      }
      navigate(`/projects/${project.slug}`);
    }
  };

  const inner = (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: layoutIndex * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="glass-card rounded-xl overflow-hidden cursor-pointer h-full flex flex-col"
      whileHover={isMobile ? undefined : { y: -5, boxShadow: "0 24px 56px rgba(0,0,0,0.22)" }}
      whileTap={{ scale: 0.99 }}
      onClick={handleClick}
    >
      {!layout.horizontal ? (
        <>
          {/* Vertical card — image on top */}
          <ImgPlaceholder accent={project.accent} className={layout.imageAspect} />
          <div className="flex-1 p-5 space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {project.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="rounded-full px-2.5 py-0.5 text-[11px] font-medium border"
                  style={{ borderColor: `${project.accent}35`, backgroundColor: `${project.accent}0d`, color: project.accent }}>
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="font-display font-semibold leading-snug"
              style={{
                fontSize: layoutIndex === 0 ? "clamp(1.5rem, 2.5vw, 2rem)" : "1.25rem",
                background: `linear-gradient(135deg, rgb(var(--foreground)), ${project.accent})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
              {project.title}
            </h3>
            <p className={`text-muted-foreground leading-relaxed ${layoutIndex === 0 ? "text-sm" : "text-xs line-clamp-3"}`}>
              {project.description}
            </p>
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              {project.link && (
                <Button variant="outline" size="sm" asChild style={{ borderColor: `${project.accent}40` }} className="text-xs h-7 px-2.5">
                  <a href={project.link.href} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3" />{project.link.label}
                  </a>
                </Button>
              )}
              {project.slug && (
                <Button variant="ghost" size="sm" asChild style={{ color: project.accent }} className="text-xs h-7 px-2">
                  <Link to={`/projects/${project.slug}`} className="inline-flex items-center gap-1">
                    Details <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Horizontal card — image left, content right */
        <div className="flex flex-col sm:flex-row h-full">
          <ImgPlaceholder accent={project.accent} className="sm:w-72 sm:h-auto aspect-[4/3] sm:aspect-auto flex-shrink-0" />
          <div className="flex-1 p-6 md:p-8 space-y-4 flex flex-col justify-center">
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span key={tag} className="rounded-full px-2.5 py-0.5 text-[11px] font-medium border"
                  style={{ borderColor: `${project.accent}35`, backgroundColor: `${project.accent}0d`, color: project.accent }}>
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="font-display font-semibold leading-snug"
              style={{
                fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                background: `linear-gradient(135deg, rgb(var(--foreground)), ${project.accent})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
              {project.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm">{project.description}</p>
            <div className="flex items-center gap-2 flex-wrap">
              {project.link && (
                <Button variant="outline" size="sm" asChild style={{ borderColor: `${project.accent}40` }}>
                  <a href={project.link.href} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />{project.link.label}
                  </a>
                </Button>
              )}
              {project.slug && (
                <Button variant="ghost" size="sm" asChild style={{ color: project.accent }}>
                  <Link to={`/projects/${project.slug}`} className="inline-flex items-center gap-1">
                    View Details <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.article>
  );

  return (
    <div
      style={{
        gridColumn: `span ${layout.colSpan} / span ${layout.colSpan}`,
        marginTop: isMobile ? 0 : layout.mt,
      }}
    >
      {inner}
    </div>
  );
}

// ── Section ─────────────────────────────────────────────────────────────────

export default function Projects() {
  const isMobile = useIsMobile();
  const [activeFilter, setActiveFilter] = useState("All");
  const sectionRef = useRef<HTMLElement>(null);

  const filtered = activeFilter === "All" ? projects : projects.filter((p) => p.tags.includes(activeFilter));

  const chipsRef = useRef(null);
  const chipsInView = useInView(chipsRef, { once: true, margin: "-40px" });

  return (
    <section id="projects" className="py-24" ref={sectionRef}>
      <div className="container mx-auto max-w-6xl px-4 md:px-8 space-y-10">

        {/* Header */}
        <div className="space-y-3">
          <motion.div className="section-label"
            initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5 }}>
            <span className="section-label-bar" />
            <span className="section-label-text">Projects</span>
          </motion.div>
          <motion.h2
            className="font-display font-bold tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)" }}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}
            whileHover={isMobile ? undefined : { x: 3 }}>
            My Projects
          </motion.h2>
          <motion.p className="text-muted-foreground text-lg"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6, delay: 0.1 }}>
            Things I've built that I'm proud of.
          </motion.p>
        </div>

        {/* Filter chips */}
        <motion.div ref={chipsRef}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: chipsInView ? 1 : 0, y: chipsInView ? 0 : 16 }}
          transition={{ duration: 0.4 }} className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <motion.button key={tag} onClick={() => setActiveFilter(tag)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeFilter === tag
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
              whileHover={isMobile ? undefined : { scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}>
              {tag}
            </motion.button>
          ))}
        </motion.div>

        {/* Bento grid — 3 cols on desktop, staggered heights */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 items-start"
        >
          {filtered.map((project, i) => (
            <ProjectCard key={project.title} project={project} layoutIndex={i} isMobile={isMobile} />
          ))}
        </div>

      </div>
    </section>
  );
}
