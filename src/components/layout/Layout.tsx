import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MouseGradient } from "./MouseGradient";
import { User, Briefcase, Mail, Home, Sun, Moon, Github, Linkedin, FileText } from "lucide-react";
import { cn, smoothScrollTo } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useState, useEffect } from "react";
import { SectionProvider } from "@/context/SectionContext";

function Navbar({ activeSection }: { activeSection: string }) {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [mouseNearTop, setMouseNearTop] = useState(false);

  const navLinks = [
    { name: "Home", href: "#intro", icon: Home },
    { name: "About", href: "#about", icon: User },
    { name: "Projects", href: "#projects", icon: Briefcase },
    { name: "Contact", href: "#contact", icon: Mail },
  ];

  // Navbar no longer manages intersection observers — Layout/SectionProvider does.

  useEffect(() => {
    if (isMobile) return;
    const onMouseMove = (e: MouseEvent) => setMouseNearTop(e.clientY < 80);
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [isMobile]);

  const hidden = location.pathname === "/" && activeSection === "#intro" && !mouseNearTop && !isMobile;

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (location.pathname === "/") {
      // #intro = page top (scrollY 0); other sections scroll to their element
      smoothScrollTo(href === "#intro" ? 0 : href, 900);
    } else {
      navigate("/" + href);
    }
  };

  return (
    <motion.header
      className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="container flex h-14 items-center px-4 md:px-8 mx-auto">
        <div className="mr-4 md:mr-8 flex items-center gap-2">
          <motion.div
            className="h-8 w-8 rounded-full overflow-hidden border-2 border-primary/40"
            whileHover={isMobile ? undefined : { rotate: [0, -10, 10, -6, 6, 0], scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <img src={`${import.meta.env.BASE_URL}img/me.jpg`} alt="Nick" className="w-full h-full object-cover" />
          </motion.div>
          <span className="font-bold text-lg hidden sm:inline-block">Nick</span>
        </div>
        <nav className="flex items-center gap-1 sm:gap-4 md:gap-6 text-sm font-medium flex-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeSection === link.href;
            return (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNav(e, link.href)}
                className={cn(
                  "relative overflow-hidden flex items-center gap-2 transition-colors hover:text-primary p-2 sm:p-0",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
                whileHover={isMobile ? undefined : { y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline-block">{link.name}</span>
                {!isMobile && (
                  <motion.span
                    className="absolute bottom-0 left-0 h-0.5 bg-primary rounded-full"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.a>
            );
          })}
        </nav>
        <div className="flex items-center justify-end gap-1 md:gap-2">
          {/* Social links hidden on mobile to keep navbar compact */}
          {!isMobile && (
            <>
              <motion.div whileHover={{ y: -2, scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" asChild className="h-9 w-9 text-muted-foreground hover:text-primary" title="GitHub">
                  <a href="https://github.com/nickpalade" target="_blank" rel="noopener noreferrer">
                    <Github className="h-5 w-5" />
                  </a>
                </Button>
              </motion.div>
              <motion.div whileHover={{ y: -2, scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" asChild className="h-9 w-9 text-muted-foreground hover:text-primary" title="LinkedIn">
                  <a href="https://www.linkedin.com/in/nick-palade-7a9154262/" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </Button>
              </motion.div>
              <motion.div whileHover={{ y: -2, scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" asChild className="h-9 w-9 text-muted-foreground hover:text-primary" title="View CV">
                  <Link to="/cv">
                    <FileText className="h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            </>
          )}
          <motion.div
            whileHover={isMobile ? undefined : { rotate: 180 }}
            whileTap={{ scale: 0.85 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 text-muted-foreground hover:text-primary"
              title="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}

function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container mx-auto flex items-center justify-center md:h-16 px-4 md:px-8 text-sm text-muted-foreground">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          &copy; {new Date().getFullYear()} Nick. All rights reserved.
        </motion.p>
      </div>
    </footer>
  );
}

export function Layout() {
  const [activeSection, setActiveSection] = useState<string>("#intro");
  const location = useLocation();

  useEffect(() => {
    const sectionIds = ["intro", "about", "projects", "contact"];
    const observers: IntersectionObserver[] = [];
    let retryTimer: number | null = null;

    const observerOptions = { rootMargin: "-40% 0px -55% 0px", threshold: 0 } as IntersectionObserverInit;

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${id}`);
          }
        },
        observerOptions
      );

      observer.observe(el);
      observers.push(observer);
    });

    // If the page was loaded with a hash (deep link), prefer that section when possible.
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setActiveSection(location.hash);
      } else {
        // Children might mount slightly later; try again shortly after.
        retryTimer = window.setTimeout(() => {
          const e = document.querySelector(location.hash);
          if (e) setActiveSection(location.hash);
        }, 120);
      }
    } else {
      // No hash — pick the closest section to the current scroll position as initial state.
      const docY = window.scrollY;
      let closestId = sectionIds[0];
      let closestDist = Infinity;
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = Math.round(el.getBoundingClientRect().top + window.scrollY);
        const dist = Math.abs(docY - top);
        if (dist < closestDist) {
          closestDist = dist;
          closestId = id;
        }
      });
      setActiveSection(`#${closestId}`);
    }

    return () => {
      observers.forEach((obs) => obs.disconnect());
      if (retryTimer) clearTimeout(retryTimer);
    };
    // Intentionally only run on mount + location changes (to handle deep links)
  }, [location.hash]);

  return (
    <SectionProvider value={{ activeSection, setActiveSection }}>
      <div className="relative flex min-h-screen flex-col bg-transparent text-foreground">
        <MouseGradient />
        <Navbar activeSection={activeSection} />
        <main className="flex-1 flex flex-col px-1 md:px-0 relative">
          <Outlet />
        </main>
        {/* Footer only on non-home pages; home uses Contact's built-in footer row */}
        {location.pathname !== "/" && <Footer />}
      </div>
    </SectionProvider>
  );
}
