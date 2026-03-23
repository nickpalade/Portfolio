import { useEffect, useRef } from "react";

type Blob = {
  baseX: number;
  baseY: number;
  ampX: number;
  ampY: number;
  freqX: number;
  freqY: number;
  phaseX: number;
  phaseY: number;
  size: number;
  r: number; g: number; b: number; alpha: number;
  lr: number; lg: number; lb: number; lalpha: number;
  mouseDepth: number;
  scrollDepth: number;
};

const BLOBS: Blob[] = [
  {
    baseX: 0.11, baseY: 0.12,
    ampX: 0.26, ampY: 0.22,
    freqX: 0.00021, freqY: 0.00029,
    phaseX: 0, phaseY: 800,
    size: 0.62, r: 196, g: 165, b: 255, alpha: 0.22,
    lr: 130, lg: 80, lb: 220, lalpha: 0.39,
    mouseDepth: 0.117, scrollDepth: 0.9,
  },
  {
    baseX: 0.86, baseY: 0.49,
    ampX: 0.20, ampY: 0.28,
    freqX: 0.00016, freqY: 0.00025,
    phaseX: 2400, phaseY: 1800,
    size: 0.70, r: 147, g: 210, b: 255, alpha: 0.18,
    lr: 50, lg: 140, lb: 240, lalpha: 0.35,
    mouseDepth: 0.182, scrollDepth: 1.4,
  },
  {
    baseX: 0.51, baseY: 0.91,
    ampX: 0.32, ampY: 0.14,
    freqX: 0.00027, freqY: 0.00018,
    phaseX: 5000, phaseY: 3600,
    size: 0.55, r: 120, g: 140, b: 255, alpha: 0.16,
    lr: 90, lg: 60, lb: 210, lalpha: 0.32,
    mouseDepth: 0.078, scrollDepth: 0.6,
  },
  {
    baseX: 0.17, baseY: 0.84,
    ampX: 0.17, ampY: 0.30,
    freqX: 0.00012, freqY: 0.00038,
    phaseX: 1200, phaseY: 1000,
    size: 0.50, r: 210, g: 190, b: 255, alpha: 0.20,
    lr: 160, lg: 100, lb: 230, lalpha: 0.36,
    mouseDepth: 0.143, scrollDepth: 1.1,
  },
  {
    baseX: 0.89, baseY: 0.09,
    ampX: 0.14, ampY: 0.24,
    freqX: 0.00034, freqY: 0.00021,
    phaseX: 3500, phaseY: 2200,
    size: 0.58, r: 160, g: 220, b: 255, alpha: 0.18,
    lr: 60, lg: 160, lb: 255, lalpha: 0.34,
    mouseDepth: 0.130, scrollDepth: 1.0,
  },
  {
    baseX: 0.58, baseY: 0.38,
    ampX: 0.19, ampY: 0.25,
    freqX: 0.00017, freqY: 0.00033,
    phaseX: 8400, phaseY: 3200,
    size: 0.54, r: 196, g: 165, b: 255, alpha: 0.16,
    lr: 130, lg: 80, lb: 220, lalpha: 0.31,
    mouseDepth: 0.105, scrollDepth: 1.2,
  },
  {
    baseX: 0.22, baseY: 0.52,
    ampX: 0.16, ampY: 0.28,
    freqX: 0.00024, freqY: 0.00016,
    phaseX: 1700, phaseY: 7300,
    size: 0.60, r: 147, g: 210, b: 255, alpha: 0.15,
    lr: 50, lg: 140, lb: 240, lalpha: 0.29,
    mouseDepth: 0.150, scrollDepth: 0.85,
  },
];

// Mobile renders fewer blobs to reduce GPU fill cost
const MOBILE_BLOB_COUNT = 4;

const fmt = (n: number) => n.toFixed(3);
const BLOB_COLORS = BLOBS.map(blob => ({
  dark: [
    `rgba(${blob.r},${blob.g},${blob.b},${fmt(blob.alpha)})`,
    `rgba(${blob.r},${blob.g},${blob.b},${fmt(blob.alpha * 0.6)})`,
    `rgba(${blob.r},${blob.g},${blob.b},${fmt(blob.alpha * 0.18)})`,
    `rgba(${blob.r},${blob.g},${blob.b},${fmt(blob.alpha * 0.04)})`,
    `rgba(${blob.r},${blob.g},${blob.b},0)`,
  ] as [string, string, string, string, string],
  light: [
    `rgba(${blob.lr},${blob.lg},${blob.lb},${fmt(blob.lalpha)})`,
    `rgba(${blob.lr},${blob.lg},${blob.lb},${fmt(blob.lalpha * 0.6)})`,
    `rgba(${blob.lr},${blob.lg},${blob.lb},${fmt(blob.lalpha * 0.18)})`,
    `rgba(${blob.lr},${blob.lg},${blob.lb},${fmt(blob.lalpha * 0.04)})`,
    `rgba(${blob.lr},${blob.lg},${blob.lb},0)`,
  ] as [string, string, string, string, string],
}));

// Desktop FPS targets (ms per frame)
const FPS_60  = 16;   // fast scroll / mouse moving
const FPS_30  = 33;   // normal activity
const FPS_15  = 66;   // light activity
const FPS_10  = 100;  // idle
const FPS_5   = 200;  // deep idle

// Mobile FPS targets (no mouse, lower power budget)
const MOB_30  = 33;   // fast scroll
const MOB_10  = 100;  // light/idle scroll
const MOB_5   = 200;  // deep idle

export function MouseGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    const blobCount = isMobile ? MOBILE_BLOB_COUNT : BLOBS.length;

    // Mobile renders the pixel buffer at half resolution.
    // The canvas is displayed at full viewport size via CSS (fixed inset-0 w-full h-full),
    // so CSS stretches the half-res buffer — invisible at 60px blur.
    const PIXEL_RATIO = isMobile ? 0.5 : 1;

    let w = window.innerWidth;
    let h = window.innerHeight;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width  = Math.floor(w * PIXEL_RATIO);
      canvas.height = Math.floor(h * PIXEL_RATIO);
    };
    resize();
    window.addEventListener("resize", resize);

    // Cache theme to avoid DOM query on every frame
    let isDark = document.documentElement.classList.contains("dark");
    const themeObserver = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains("dark");
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // Mouse (desktop only) — raw and smoothed (normalized 0-1, centered at 0.5)
    let rawMouseX = 0.5;
    let rawMouseY = 0.5;
    let smoothMouseX = 0.5;
    let smoothMouseY = 0.5;
    let lastMouseTime = -Infinity;

    const onMouseMove = (e: MouseEvent) => {
      rawMouseX = e.clientX / w;
      rawMouseY = e.clientY / h;
      lastMouseTime = performance.now();
    };
    if (!isMobile) window.addEventListener("mousemove", onMouseMove);

    // Scroll tracking
    let lagScrollY = window.scrollY;
    let lastScrollY = window.scrollY;
    let scrollVel = 0;
    let smoothScrollVel = 0;
    let lastScrollTime = performance.now();

    const onScroll = () => { lastScrollTime = performance.now(); };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Dynamic FPS: lerp current frame budget toward target each frame.
    // Drives higher fps when action is happening, drops to near-static when idle.
    let currentMinFrameMs = isMobile ? MOB_10 : FPS_30;
    let lastFrameTime = 0;

    const computeTargetMs = (now: number): number => {
      const velMag = Math.abs(smoothScrollVel);
      const scrollIdleMs = now - lastScrollTime;

      if (isMobile) {
        if (velMag > 4)             return MOB_30;
        if (velMag > 0.5)           return MOB_10;
        if (scrollIdleMs < 2000)    return MOB_10;
        return MOB_5;
      }

      const mouseActive = (now - lastMouseTime) < 600;
      if (mouseActive || velMag > 4)  return FPS_60;
      if (velMag > 0.8)               return FPS_30;
      if (scrollIdleMs < 1500)        return FPS_30;
      if (scrollIdleMs < 3500)        return FPS_15;
      if (scrollIdleMs < 8000)        return FPS_10;
      return FPS_5;
    };

    const draw = (time: number) => {
      // Smoothly lerp the frame budget toward the target — avoids jarring fps jumps
      const targetMs = computeTargetMs(time);
      currentMinFrameMs += (targetMs - currentMinFrameMs) * 0.08;

      if (time - lastFrameTime < currentMinFrameMs) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      lastFrameTime = time;

      const cw = canvas.width;
      const ch = canvas.height;

      if (!isMobile) {
        smoothMouseX += (rawMouseX - smoothMouseX) * 0.06;
        smoothMouseY += (rawMouseY - smoothMouseY) * 0.06;
      }

      scrollVel = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      smoothScrollVel += (scrollVel - smoothScrollVel) * 0.14;
      lagScrollY += (window.scrollY - lagScrollY) * 0.015;

      ctx.clearRect(0, 0, cw, ch);
      ctx.globalCompositeOperation = isDark ? "lighter" : "multiply";
      const colorKey = isDark ? "dark" : "light";

      for (let i = 0; i < blobCount; i++) {
        const blob = BLOBS[i];
        const stops = BLOB_COLORS[i][colorKey];

        const baseX = blob.baseX + blob.ampX * Math.sin(blob.freqX * time + blob.phaseX);
        const baseY = blob.baseY + blob.ampY * Math.cos(blob.freqY * time + blob.phaseY);

        const mouseOffsetX = isMobile ? 0 : -(smoothMouseX - 0.5) * blob.mouseDepth * 2;
        const mouseOffsetY = isMobile ? 0 : -(smoothMouseY - 0.5) * blob.mouseDepth * 2;

        const lagOffset = (lagScrollY - window.scrollY) * blob.scrollDepth * 0.18;
        const velOffset = -smoothScrollVel * blob.scrollDepth * 3.2;
        const scrollOffsetY = lagOffset + velOffset;

        // Convert fractional positions to canvas pixel coordinates.
        // scrollOffsetY is in CSS pixels — scale by PIXEL_RATIO to match canvas space.
        const x = (baseX + mouseOffsetX) * cw;
        const y = (baseY + mouseOffsetY) * ch + scrollOffsetY * PIXEL_RATIO;
        const radius = blob.size * Math.min(cw, ch);

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0,    stops[0]);
        gradient.addColorStop(0.25, stops[1]);
        gradient.addColorStop(0.55, stops[2]);
        gradient.addColorStop(0.8,  stops[3]);
        gradient.addColorStop(1,    stops[4]);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, cw, ch);
      }

      if (!prefersReducedMotion) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };

    rafRef.current = requestAnimationFrame(draw);

    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current);
      } else {
        lastFrameTime = 0;
        rafRef.current = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      if (!isMobile) window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      themeObserver.disconnect();
    };
  }, []);

  // Blur is applied to the wrapper div rather than the canvas element itself.
  // On Safari iOS, filter on a position:fixed canvas causes flickering during scroll.
  // The canvas gets its own GPU layer via transform to stay stable during iOS momentum scroll.
  return (
    <div
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: -1, filter: "blur(60px)" }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ transform: "translateZ(0)" }}
      />
    </div>
  );
}
