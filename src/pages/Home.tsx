import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import { smoothScrollTo, scrollLocked, registerGravitySyncer } from "@/lib/utils";

// Skip #intro (page top) — only inter-section boundaries matter
const SECTION_IDS = ["about", "projects", "contact"];

function useScrollGravity() {
  useEffect(() => {
    let targetY = window.scrollY;
    let rafId: number | null = null;
    let boundaries: number[] = [];

    // Keep gravity's targetY in sync when smoothScrollTo lands
    registerGravitySyncer((y) => { targetY = y; });

    let navbarHeight = 0;

    function computeBoundaries() {
      const nav = document.querySelector("header");
      navbarHeight = nav ? nav.offsetHeight : 0;
      boundaries = SECTION_IDS
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null)
        .map((el) => Math.round(el.getBoundingClientRect().top + window.scrollY));
    }

    // DOWN: gravity pull toward next section, brief brake after crossing
    //   approaching (dist SETTLE→0)  : 1× → 3× quadratic pull
    //   just crossed (offset 0→THRESHOLD) : 0.3× landing brake
    //   settled (offset > THRESHOLD) : 1×
    //
    // UP (opposite feel): resist crossing, then snap back
    //   just crossed (offset 0→THRESHOLD) : 0.3× resistance
    //   offset THRESHOLD→SETTLE      : 3× → 1× rubberband
    //   settled (offset > SETTLE)    : 1×
    function getMultiplier(y: number, direction: number): number {
      // When scrolling down, offset by navbar so crossing = section top clears the navbar.
      // When scrolling up, use raw y so the section heading lands at the natural position.
      const y_ = direction > 0 ? y + navbarHeight : y;
      const vh = window.innerHeight - navbarHeight;
      const THRESHOLD = vh * 0.15;
      const SETTLE    = vh * 0.7;

      if (direction > 0) {
        // Slow brake if we just crossed a boundary
        let nearestBehind = -Infinity;
        for (const b of boundaries) {
          if (b < y_ && b > nearestBehind) nearestBehind = b;
        }
        if (nearestBehind !== -Infinity && y_ - nearestBehind < THRESHOLD) {
          // Taper from 3× at crossing down to 0.3× at threshold edge (matches approach speed)
          const t = (y_ - nearestBehind) / THRESHOLD; // 0 at crossing → 1 at threshold
          return 0.3 + 2.7 * (1 - t) * (1 - t);
        }

        // Pull toward next boundary ahead
        let nearestAhead = Infinity;
        for (const b of boundaries) {
          if (b > y_ && b < nearestAhead) nearestAhead = b;
        }
        if (nearestAhead !== Infinity) {
          const dist = nearestAhead - y_;
          if (dist < SETTLE) {
            const t = 1 - dist / SETTLE;
            return 1.0 + 2.0 * t * t;
          }
        }
        return 1.0;
      } else {
        // Most recently crossed boundary going up (closest one strictly below y_)
        let nearest = Infinity;
        for (const b of boundaries) {
          if (b > y_ && b < nearest) nearest = b;
        }
        if (nearest === Infinity) return 1.0;
        const offset = nearest - y_;
        if (offset >= SETTLE) return 1.0;
        if (offset >= THRESHOLD) {
          const t = (offset - THRESHOLD) / (SETTLE - THRESHOLD);
          return 3.0 - 2.0 * t;
        }
        // Taper from 0.3× at crossing up to 3× at threshold (matches rubberband entry)
        const t = offset / THRESHOLD; // 0 at crossing → 1 at threshold
        return 0.3 + 2.7 * t * t;
      }
    }

    // Velocity tracking — bypass gravity when scrolling too fast
    // Uses an exponential moving average of px/ms across events
    const HIGH_SPEED = 0.6; // px/ms (~600px/s) — only slow deliberate scrolls activate gravity
    let velocity = 0;
    let lastEventTime = 0;

    function updateVelocity(absDelta: number) {
      const now = performance.now();
      const dt = Math.max(now - lastEventTime, 1);
      lastEventTime = now;
      velocity = velocity * 0.6 + (absDelta / dt) * 0.4; // EMA
    }

    function scrollFrame() {
      // Yield to programmatic navigation scrolls
      if (scrollLocked) {
        rafId = null;
        return;
      }
      const current = window.scrollY;
      const diff = targetY - current;
      if (Math.abs(diff) < 0.5) {
        window.scrollTo(0, targetY);
        rafId = null;
        return;
      }
      window.scrollTo(0, current + diff * 0.18);
      rafId = requestAnimationFrame(scrollFrame);
    }

    function onWheel(e: WheelEvent) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      // Don't compete with a programmatic navigation scroll
      if (scrollLocked) return;

      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 40;
      if (e.deltaMode === 2) delta *= window.innerHeight;

      updateVelocity(Math.abs(delta));
      const multiplier = velocity > HIGH_SPEED ? 1.0 : getMultiplier(targetY, Math.sign(delta));
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetY = Math.max(0, Math.min(maxScroll, targetY + delta * multiplier));

      if (!rafId) rafId = requestAnimationFrame(scrollFrame);
    }

    let lastTouchY = 0;

    function onTouchStart(e: TouchEvent) {
      lastTouchY = e.touches[0].clientY;
    }

    function onTouchMove(e: TouchEvent) {
      const currentY = e.touches[0].clientY;
      const delta = lastTouchY - currentY; // positive = scrolling down
      lastTouchY = currentY;

      updateVelocity(Math.abs(delta));
      const bonus = velocity > HIGH_SPEED ? 0 : getMultiplier(window.scrollY, Math.sign(delta)) - 1.0;
      if (bonus !== 0) window.scrollBy(0, delta * bonus);
    }

    computeBoundaries();
    window.addEventListener("resize", computeBoundaries, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      window.removeEventListener("resize", computeBoundaries);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
}

export default function Home() {
  const location = useLocation();
  useScrollGravity();

  useEffect(() => {
    if (location.hash) {
      // Small delay lets the page render before scrolling
      const id = setTimeout(() => {
        const el = document.querySelector(location.hash);
        if (el) smoothScrollTo(el, 700);
      }, 80);
      return () => clearTimeout(id);
    }
  }, [location.hash]);

  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Contact />
    </>
  );
}
