import { useRef, useState } from "react";
import { Mail, Github, Linkedin, FileText, Copy, Check, ImageIcon } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";


const EMAILS = {
  personal: "npalade09@gmail.com",
  business: "nick.a.palade@gmail.com",
} as const;

type EmailKey = keyof typeof EMAILS;

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  const [activeEmail, setActiveEmail] = useState<EmailKey | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!activeEmail) return;
    navigator.clipboard.writeText(EMAILS[activeEmail]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activateEmail = (key: EmailKey) => {
    if (activeEmail !== key) setCopied(false);
    setActiveEmail(key);
  };

  return (
    <section id="contact" className="bg-[#0d0d12] text-white overflow-hidden relative" ref={sectionRef}>
      {/* Subtle primary glow at top edge */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-[rgba(121,144,219,0.5)] to-transparent" />

      <div className="container mx-auto max-w-6xl px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-stretch min-h-[520px]">

          {/* LEFT — text + CTA */}
          <motion.div
            className="flex flex-col justify-center py-16 md:py-24 space-y-8"
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Section label — light version */}
            <div className="flex items-center gap-2.5">
              <span className="block w-1.5 h-5 rounded-full bg-[rgb(121,144,219)] flex-shrink-0" />
              <span className="text-xs font-mono uppercase tracking-[0.18em] text-[rgba(121,144,219,0.8)]">
                Contact
              </span>
            </div>

            <div className="space-y-4">
              <h2
                className="font-display font-bold tracking-tight leading-tight text-white"
                style={{ fontSize: "clamp(2.5rem, 5vw, 3.75rem)" }}
              >
                Get in Touch
              </h2>

            </div>

            {/* Email buttons */}
            <div
              className="space-y-4"
              onMouseLeave={() => setActiveEmail(null)}
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.div
                  onMouseEnter={() => activateEmail("personal")}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    size="lg"
                    asChild
                    className="bg-[rgb(121,144,219)] hover:bg-[rgb(140,160,230)] text-white border-0"
                    style={{ minHeight: "3.5rem", paddingLeft: "2rem", paddingRight: "2rem" }}
                  >
                    <a href="mailto:npalade09@gmail.com">
                      <Mail className="h-4 w-4 mr-2" />
                      Personal Email
                    </a>
                  </Button>
                </motion.div>
                <motion.div
                  onMouseEnter={() => activateEmail("business")}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="border-white/20 text-white hover:bg-white/10 hover:text-white"
                    style={{ minHeight: "3.5rem", paddingLeft: "2rem", paddingRight: "2rem" }}
                  >
                    <a href="mailto:nick.a.palade@gmail.com">
                      <Mail className="h-4 w-4 mr-2" />
                      Business Email
                    </a>
                  </Button>
                </motion.div>
              </div>

              {/* Copy address */}
              <button
                onClick={handleCopy}
                disabled={!activeEmail}
                className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-[opacity,color] duration-150"
                style={{ opacity: activeEmail ? 1 : 0, pointerEvents: activeEmail ? "auto" : "none" }}
              >
                {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span className={copied ? "text-green-400" : ""}>
                  {copied ? "Copied!" : activeEmail ? EMAILS[activeEmail] : "\u00a0"}
                </span>
              </button>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { icon: Github, href: "https://github.com/nickpalade", label: "GitHub" },
                { icon: Linkedin, href: "https://www.linkedin.com/in/nick-palade-7a9154262/", label: "LinkedIn" },
              ].map(({ icon: Icon, href, label }) => (
                <motion.div
                  key={label}
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                    title={label}
                    className="border-white/20 text-white/60 hover:bg-white/10 hover:text-white"
                  >
                    <a href={href} target="_blank" rel="noopener noreferrer">
                      <Icon className="h-5 w-5" />
                    </a>
                  </Button>
                </motion.div>
              ))}
              <motion.div
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  title="View CV"
                  className="border-white/20 text-white/60 hover:bg-white/10 hover:text-white"
                >
                  <Link to="/cv">
                    <FileText className="h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT — image placeholder (like Algoverse's CTA image) */}
          <motion.div
            className="relative hidden md:flex items-stretch"
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="absolute inset-y-8 left-0 right-0 rounded-2xl overflow-hidden border border-white/10">
              {/* Dot grid background */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: "radial-gradient(circle, rgba(121,144,219,0.2) 1px, transparent 1px)",
                  backgroundSize: "22px 22px",
                }}
              />
              {/* Warm overlay tint */}
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(121,144,219,0.08)] via-transparent to-[rgba(165,180,252,0.06)]" />

              {/* Placeholder content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10 bg-white/5">
                  <ImageIcon className="h-7 w-7 text-white/20" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/20">
                  Photo Placeholder
                </span>
              </div>

              {/* Large faded "N" monogram */}
              <span
                className="absolute bottom-4 right-6 font-display font-black leading-none select-none pointer-events-none"
                style={{ fontSize: "clamp(6rem, 12vw, 10rem)", color: "rgba(121,144,219,0.06)" }}
              >
                N
              </span>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Footer row */}
      <div className="border-t border-white/10 py-5">
        <div className="container mx-auto max-w-6xl px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/30 font-mono">
          <span>&copy; {new Date().getFullYear()} Nick Palade. All rights reserved.</span>
          <span>Built with React + TypeScript + Tailwind</span>
        </div>
      </div>
    </section>
  );
}
