import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

let _scrollRafId: number | null = null;

// True while a programmatic navigation scroll is running.
// The scroll-gravity system reads this to pause itself during nav scrolls.
export let scrollLocked = false;

// Registered by useScrollGravity so smoothScrollTo can sync its targetY on landing.
let _gravitySyncer: ((y: number) => void) | null = null;
export function registerGravitySyncer(fn: (y: number) => void) {
  _gravitySyncer = fn;
}

export function smoothScrollTo(target: string | Element | number, duration = 700) {
  if (_scrollRafId !== null) {
    cancelAnimationFrame(_scrollRafId);
    _scrollRafId = null;
  }
  let endY: number;
  if (typeof target === "number") {
    endY = target;
  } else {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    if (!el) return;
    endY = (el as HTMLElement).getBoundingClientRect().top + window.scrollY;
  }
  const startY = window.scrollY;
  const startTime = performance.now();
  scrollLocked = true;
  const easeInOut = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const step = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + (endY - startY) * easeInOut(progress));
    if (progress < 1) {
      _scrollRafId = requestAnimationFrame(step);
    } else {
      _scrollRafId = null;
      scrollLocked = false;
      _gravitySyncer?.(endY); // align gravity's targetY with where we landed
    }
  };
  _scrollRafId = requestAnimationFrame(step);
}
