import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MouseGradient } from "./MouseGradient";
import { User, Briefcase, Mail, Home, Sun, Moon, Github, Linkedin, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useState, useEffect } from "react";

function Navbar() {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<string>("#intro");

  const navLinks = [
    { name: "Home", href: "#intro", icon: Home },
    { name: "About", href: "#about", icon: User },
    { name: "Projects", href: "#projects", icon: Briefcase },
    { name: "Contact", href: "#contact", icon: Mail },
  ];

  useEffect(() => {
    const sectionIds = navLinks.map((link) => link.href.slice(1));
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${id}`);
          }
        },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (location.pathname === "/") {
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate("/" + href);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4 md:px-8 mx-auto">
        <div className="mr-4 md:mr-8 flex items-center gap-2">
          <motion.div
            className="h-8 w-8 rounded-full overflow-hidden border-2 border-primary/40"
            whileHover={isMobile ? undefined : { rotate: [0, -10, 10, -6, 6, 0], scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <img src="/img/me.jpg" alt="Nick" className="w-full h-full object-cover" />
          </motion.div>
          <span className="font-bold text-lg hidden sm:inline-block">Nick</span>
        </div>
        <nav className="flex items-center gap-4 md:gap-6 text-sm font-medium flex-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeSection === link.href;
            return (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNav(e, link.href)}
                className={cn(
                  "relative overflow-hidden flex items-center gap-2 transition-colors hover:text-primary",
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
                  <a href="/cv">
                    <FileText className="h-5 w-5" />
                  </a>
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
    </header>
  );
}

function Footer() {
  const isMobile = useIsMobile();

  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 md:px-8 text-sm text-muted-foreground">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          &copy; {new Date().getFullYear()} Nick. All rights reserved.
        </motion.p>
        <div className="flex items-center gap-4">
          <motion.a
            href="#about"
            className="hover:text-primary transition-colors"
            whileHover={isMobile ? undefined : { x: 3, color: "rgb(var(--primary))" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            About
          </motion.a>
          <motion.a
            href="#projects"
            className="hover:text-primary transition-colors"
            whileHover={isMobile ? undefined : { x: 3, color: "rgb(var(--primary))" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Projects
          </motion.a>
          <motion.a
            href="#contact"
            className="hover:text-primary transition-colors"
            whileHover={isMobile ? undefined : { x: 3, color: "rgb(var(--primary))" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Contact
          </motion.a>
        </div>
      </div>
    </footer>
  );
}

export function Layout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-transparent text-foreground">
      <MouseGradient />
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
