import { createContext, useContext, useEffect, useRef, useState } from "react";

interface PerformanceContextValue {
  isLowPerf: boolean;
  isReducedScrollPerf: boolean;
}

const PerformanceContext = createContext<PerformanceContextValue>({ isLowPerf: false, isReducedScrollPerf: false });

// ── Benchmark ────────────────────────────────────────────────────────────────
// Runs ~500 K sqrt iterations. On modern desktop hardware this completes in
// ~2–4 ms. At 6× CPU throttle it takes ~12–24 ms; at 10× it exceeds 30 ms.
// This is a direct measure of main-thread execution speed.
const BENCHMARK_ITERS     = 500_000;
// Dev mode React overhead inflates timing; use a higher threshold to avoid false positives.
const BENCHMARK_THRESHOLD = import.meta.env.DEV ? 25 : 7; // ms

function runBenchmark(): number {
  const start = performance.now();
  let sum = 0;
  for (let i = 0; i < BENCHMARK_ITERS; i++) {
    sum += Math.sqrt(i * 1.1);
  }
  // Prevent the loop from being dead-code-eliminated by the JIT.
  if (sum < 0) void sum;
  return performance.now() - start;
}

// ── rAF frame-time sampling (secondary / GPU-bound fallback) ─────────────────
// Skips the first WARMUP_MS, then samples for SAMPLE_MS.
// Triggers if ≥ SLOW_RATIO of frames exceed SLOW_THRESHOLD ms.
const WARMUP_MS      = 1000;
const SAMPLE_MS      = 3000;
const SLOW_THRESHOLD = 50;   // ms per frame (~20 fps)
// Reduced-scroll mode threshold: 50fps -> 20ms per frame
const REDUCED_SCROLL_THRESHOLD = 20; // ms per frame (~50 fps)
const SLOW_RATIO     = 0.35; // 35 % of sampled frames must be slow

// ── Shared logger ─────────────────────────────────────────────────────────────
function logLowPerf(reason: string, detail: string) {
  console.groupCollapsed(
    "%c[Portfolio] Low performance mode activated",
    "color:#f59e0b;font-weight:bold"
  );
  console.log(`Reason  : ${reason}`);
  console.log(`Detail  : ${detail}`);
  console.log("Effects : reduced blob count, lower canvas resolution, hover/parallax disabled.");
  console.groupEnd();
}

function logReducedScroll(reason: string, detail: string) {
  console.groupCollapsed(
    "%c[Portfolio] Reduced-scroll performance mode activated",
    "color:#60a5fa;font-weight:bold"
  );
  console.log(`Reason  : ${reason}`);
  console.log(`Detail  : ${detail}`);
  console.log("Effects : custom scrolling disabled (gravity). Other effects unchanged.");
  console.groupEnd();
}

export function PerformanceProvider({ children }: { children: React.ReactNode }) {
  const [isLowPerf, setIsLowPerf] = useState(false);
  const [isReducedScrollPerf, setIsReducedScrollPerf] = useState(false);
  const activatedRef = useRef(false);
  const rafRef = useRef<number>(0);

  const activate = (reason: string, detail: string) => {
    if (activatedRef.current) return;
    activatedRef.current = true;
    document.documentElement.classList.add("low-perf");
    logLowPerf(reason, detail);
    setIsLowPerf(true);
  };

  const activateReducedScroll = (reason: string, detail: string) => {
    if (isReducedScrollPerf || activatedRef.current) return;
    // do not flip the global activatedRef — reduced mode is lighter
    setIsReducedScrollPerf(true);
    logReducedScroll(reason, detail);
  };

  useEffect(() => {
    // ── 1. JS benchmark — defer 100 ms past first paint so it doesn't block render.
    const benchTimer = setTimeout(() => {
      const ms = runBenchmark();
      if (ms > BENCHMARK_THRESHOLD) {
        activate(
          "CPU benchmark slow",
          `${ms.toFixed(1)} ms for ${BENCHMARK_ITERS.toLocaleString()} iterations (threshold: ${BENCHMARK_THRESHOLD} ms)`
        );
      }
    }, 100);

    // ── 2. rAF frame-time sampling — catches GPU/composite-bound slowness.
    const frameTimes: number[] = [];
    const pageLoadTime = performance.now();
    let lastTime = pageLoadTime;
    let rafDone = false;

    const measure = (now: number) => {
      if (rafDone || activatedRef.current) return;

      if (now - pageLoadTime < WARMUP_MS) {
        lastTime = now;
        rafRef.current = requestAnimationFrame(measure);
        return;
      }

      const delta = now - lastTime;
      lastTime = now;
      // Ignore the transition frame coming out of warmup (can be anomalously large).
      if (delta < 500) frameTimes.push(delta);

      if (now - pageLoadTime >= WARMUP_MS + SAMPLE_MS) {
        rafDone = true;
        if (frameTimes.length > 10) {
          const slowCount = frameTimes.filter(t => t > SLOW_THRESHOLD).length;
          const ratio = slowCount / frameTimes.length;
          const avg = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
          if (ratio >= SLOW_RATIO) {
            activate(
              "Sustained low frame rate",
              `${slowCount}/${frameTimes.length} frames > ${SLOW_THRESHOLD} ms (${(ratio * 100).toFixed(0)}%), avg ${avg.toFixed(1)} ms`
            );
          }

          // Check reduced-scroll threshold (50fps -> 20ms)
          const slowCountReduced = frameTimes.filter(t => t > REDUCED_SCROLL_THRESHOLD).length;
          const ratioReduced = slowCountReduced / frameTimes.length;
          if (ratioReduced >= SLOW_RATIO) {
            activateReducedScroll(
              "Moderately low frame rate",
              `${slowCountReduced}/${frameTimes.length} frames > ${REDUCED_SCROLL_THRESHOLD} ms (${(ratioReduced * 100).toFixed(0)}%), avg ${avg.toFixed(1)} ms`
            );
          }
        }
        return;
      }

      rafRef.current = requestAnimationFrame(measure);
    };

    rafRef.current = requestAnimationFrame(measure);

    return () => {
      clearTimeout(benchTimer);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <PerformanceContext.Provider value={{ isLowPerf, isReducedScrollPerf }}>
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformanceMode(): PerformanceContextValue {
  return useContext(PerformanceContext);
}
