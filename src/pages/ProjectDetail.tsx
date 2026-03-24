import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Cpu,
  Camera,
  Zap,
  Brain,
  Volume2,
  Monitor,
  Server,
  Palette,
  Tag,
  Activity,
  Search,
  Link as LinkIcon,
  MousePointer2,
  Shuffle,
  GitMerge,
  AlignLeft,
  BookOpen,
  Code,
  FileUp,
  Map,
  TrendingUp,
  DollarSign,
  BarChart2,
  CheckSquare,
  CornerDownRight,
  Heart,
  Layout,
  List,
  Hash,
  Gamepad2,
  Database,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/useIsMobile";
import { projects } from "@/data/projects";

const ICONS: Record<string, React.ElementType> = {
  Cpu,
  Camera,
  Zap,
  Brain,
  Volume2,
  Monitor,
  Server,
  Palette,
  Tag,
  Activity,
  Search,
  Link: LinkIcon,
  MousePointer2,
  Shuffle,
  GitMerge,
  AlignLeft,
  BookOpen,
  Code,
  FileUp,
  Map,
  TrendingUp,
  DollarSign,
  BarChart2,
  CheckSquare,
  CornerDownRight,
  Heart,
  Layout,
  List,
  Hash,
  Gamepad2,
  Database,
};

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

// ─── Section wrapper with scroll trigger ──────────────────────────────────────
function Section({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 32 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Section heading ───────────────────────────────────────────────────────────
function SectionHeading({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent: string;
}) {
  return (
    <h2
      className="text-2xl md:text-3xl font-bold mb-8"
      style={{
        backgroundImage: `linear-gradient(135deg, rgb(var(--foreground)), ${accent})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </h2>
  );
}

// ─── Feature card ──────────────────────────────────────────────────────────────
function FeatureCard({
  icon,
  title,
  description,
  accent,
  index,
  isMobile,
}: {
  icon: string;
  title: string;
  description: string;
  accent: string;
  index: number;
  isMobile: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const Icon = ICONS[icon] ?? Code;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 28 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: EASE }}
    >
      <SpotlightCard className="h-full rounded-xl">
        <motion.div
          className="glass-card rounded-xl p-5 h-full flex flex-col gap-3"
          whileHover={isMobile ? undefined : { y: -3, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          {/* Icon circle */}
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${accent}18` }}
          >
            <Icon className="w-5 h-5" style={{ color: accent }} />
          </div>
          <h3 className="font-semibold text-sm leading-snug">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed flex-1">{description}</p>
        </motion.div>
      </SpotlightCard>
    </motion.div>
  );
}

// ─── Timeline step ─────────────────────────────────────────────────────────────
function TimelineStep({
  step,
  detail,
  number,
  accent,
  index,
  isLast,
}: {
  step: string;
  detail: string;
  number: number;
  accent: string;
  index: number;
  isLast: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -24 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: EASE }}
      className="flex gap-4"
    >
      {/* Number + line column */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold font-mono flex-shrink-0 z-10"
          style={{
            backgroundColor: `${accent}20`,
            color: accent,
            border: `1.5px solid ${accent}50`,
          }}
        >
          {String(number).padStart(2, "0")}
        </div>
        {!isLast && (
          <div
            className="w-px flex-1 mt-1 min-h-8"
            style={{ backgroundColor: `${accent}25` }}
          />
        )}
      </div>

      {/* Content */}
      <div className="pb-8 flex-1">
        <p className="font-semibold mb-1 leading-snug">{step}</p>
        <p className="text-muted-foreground text-sm leading-relaxed">{detail}</p>
      </div>
    </motion.div>
  );
}

// ─── Tech pill ─────────────────────────────────────────────────────────────────
function TechPill({
  name,
  purpose,
  accent,
  index,
  isMobile,
}: {
  name: string;
  purpose: string;
  accent: string;
  index: number;
  isMobile: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: EASE }}
      whileHover={
        isMobile
          ? undefined
          : { scale: 1.04, borderColor: `${accent}90` }
      }
      className="glass-card rounded-lg px-4 py-3 cursor-default"
      style={{ borderColor: `${accent}30` }}
    >
      <p className="font-semibold text-sm">{name}</p>
      <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">{purpose}</p>
    </motion.div>
  );
}

// ─── Highlight card ────────────────────────────────────────────────────────────
function HighlightCard({
  title,
  description,
  accent,
  index,
  isMobile,
}: {
  title: string;
  description: string;
  accent: string;
  index: number;
  isMobile: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 24 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: EASE }}
    >
      <motion.div
        className="glass-card gradient-border rounded-xl p-5 h-full"
        whileHover={isMobile ? undefined : { y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      >
        <h3
          className="font-semibold mb-2 text-sm"
          style={{ color: accent }}
        >
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </motion.div>
    </motion.div>
  );
}

// ─── Nav project card ──────────────────────────────────────────────────────────
function NavProjectCard({
  project,
  direction,
  isMobile,
  onNavigate,
}: {
  project: { slug: string; title: string; tagline: string; accent: string; index: number };
  direction: "prev" | "next";
  isMobile: boolean;
  onNavigate: (slug: string) => void;
}) {
  const handleClick = (e: React.MouseEvent) => {
    if (e.button === 0 && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      onNavigate(project.slug);
    }
  };

  return (
    <Link to={`/projects/${project.slug}`} className="flex-1 min-w-0" onClick={handleClick}>
      <motion.div
        className="glass-card rounded-xl p-5 h-full cursor-pointer"
        style={{ borderColor: `${project.accent}30` }}
        whileHover={
          isMobile
            ? undefined
            : {
                scale: 1.02,
                borderColor: `${project.accent}70`,
                boxShadow: `0 0 24px ${project.accent}22`,
              }
        }
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
      >
        <p
          className="text-xs font-mono mb-2"
          style={{ color: `${project.accent}90` }}
        >
          {direction === "prev" ? "← Previous" : "Next →"}
        </p>
        <p
          className="font-semibold mb-1"
          style={{ color: project.accent }}
        >
          {project.title}
        </p>
        <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed">
          {project.tagline}
        </p>
      </motion.div>
    </Link>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigateToProject = useCallback(
    async (targetSlug: string) => {
      setIsTransitioning(true);
      await new Promise((resolve) => setTimeout(resolve, 260));
      window.scrollTo(0, 0);
      navigate(`/projects/${targetSlug}`);
    },
    [navigate]
  );

  const project = projects.find((p) => p.slug === slug);

  useEffect(() => {
    setIsTransitioning(false);
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <p className="text-2xl font-semibold text-muted-foreground">Project not found.</p>
        <Button
          variant="outline"
          onClick={() => navigate("/#projects")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to projects
        </Button>
      </div>
    );
  }

  const { accent } = project;
  const currentIdx = projects.findIndex((p) => p.slug === slug);
  const prevProject = projects[(currentIdx - 1 + projects.length) % projects.length];
  const nextProject = projects[(currentIdx + 1) % projects.length];

  return (
    <article className="w-full">
      {/* ── Page transition overlay ───────────────────────────────────────────── */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 9999, backgroundColor: "rgb(var(--background))" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        )}
      </AnimatePresence>
      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[60vh] flex flex-col justify-end pb-16 overflow-hidden"
      >
        {/* Dot grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, ${accent}30 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        />
        {/* Gradient overlay so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />

        {/* Large faded project number */}
        <span
          className="absolute right-4 md:right-12 bottom-0 font-black font-mono leading-none select-none pointer-events-none"
          style={{
            color: `${accent}0d`,
            fontSize: "clamp(8rem, 22vw, 18rem)",
            lineHeight: 1,
          }}
        >
          {String(project.index).padStart(2, "0")}
        </span>

        {/* Back button — inside the hero, top-left */}
        <div className="container mx-auto max-w-5xl px-4 md:px-8 pt-8 pb-0 relative z-10">
          <motion.button
            onClick={() => navigate("/#projects")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
            whileHover={isMobile ? undefined : { x: -3 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to projects
          </motion.button>

          {/* Hero content */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="space-y-4 max-w-3xl"
          >
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, delay: 0.1 + i * 0.04, ease: EASE }}
                  className="rounded-full px-3 py-1 text-xs font-medium border"
                  style={{
                    borderColor: `${accent}40`,
                    backgroundColor: `${accent}10`,
                    color: accent,
                  }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
            >
              <h1
                className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-none break-words"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgb(var(--foreground)) 30%, ${accent})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {project.title}
              </h1>
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
            >
              {project.tagline}
            </motion.p>

            {/* Links */}
            {project.links && project.links.length > 0 && (
              <motion.div
                className="flex flex-wrap gap-3 pt-1"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
              >
                {project.links.map((link) => (
                  <motion.div
                    key={link.label}
                    whileHover={isMobile ? undefined : { y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      style={{ borderColor: `${accent}50`, color: accent }}
                      className="hover:bg-muted/50"
                    >
                      <a href={link.href} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {link.label}
                      </a>
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Overview ──────────────────────────────────────────────────────────── */}
      <div className="container mx-auto max-w-4xl px-4 md:px-8 py-16">
        <Section delay={0.05}>
          <p
            className="text-lg leading-relaxed pl-6 text-foreground/90"
            style={{ borderLeft: `3px solid ${accent}` }}
          >
            {project.overview}
          </p>
        </Section>
      </div>

      {/* ── Features ──────────────────────────────────────────────────────────── */}
      <div className="container mx-auto max-w-5xl px-4 md:px-8 pb-16">
        <Section>
          <SectionHeading accent={accent}>Key Features</SectionHeading>
        </Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {project.features.map((feature, i) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              accent={accent}
              index={i}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>

      {/* ── How It Works ──────────────────────────────────────────────────────── */}
      <div className="container mx-auto max-w-4xl px-4 md:px-8 pb-16">
        <Section>
          <SectionHeading accent={accent}>How It Works</SectionHeading>
        </Section>
        <div className="mt-2">
          {project.howItWorks.map((s, i) => (
            <TimelineStep
              key={s.step}
              step={s.step}
              detail={s.detail}
              number={i + 1}
              accent={accent}
              index={i}
              isLast={i === project.howItWorks.length - 1}
            />
          ))}
        </div>
      </div>

      {/* ── Tech Stack ────────────────────────────────────────────────────────── */}
      <div className="container mx-auto max-w-5xl px-4 md:px-8 pb-16">
        <Section>
          <SectionHeading accent={accent}>Tech Stack</SectionHeading>
        </Section>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {project.techStack.map((tech, i) => (
            <TechPill
              key={tech.name}
              name={tech.name}
              purpose={tech.purpose}
              accent={accent}
              index={i}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>

      {/* ── Under the Hood ────────────────────────────────────────────────────── */}
      <div className="container mx-auto max-w-5xl px-4 md:px-8 pb-20">
        <Section>
          <SectionHeading accent={accent}>Under the Hood</SectionHeading>
        </Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {project.highlights.map((h, i) => (
            <HighlightCard
              key={h.title}
              title={h.title}
              description={h.description}
              accent={accent}
              index={i}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>

      {/* ── Navigation footer ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        {/* Dot grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, ${accent}30 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background pointer-events-none" />
        <div className="container mx-auto max-w-5xl px-4 md:px-8 py-12 relative z-10">
          <Section>
            <h2 className="text-lg font-semibold text-muted-foreground mb-6">More Projects</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <NavProjectCard project={prevProject} direction="prev" isMobile={isMobile} onNavigate={navigateToProject} />
              <NavProjectCard project={nextProject} direction="next" isMobile={isMobile} onNavigate={navigateToProject} />
            </div>
          </Section>
        </div>
      </div>
    </article>
  );
}
