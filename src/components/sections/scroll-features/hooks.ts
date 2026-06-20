import { useEffect, useRef, useState } from "react";

/** Respects OS reduced-motion preference. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/** Bumps when `isActive` transitions false → true — restarts CSS/JS animation cycles. */
export function useActiveAnimKey(isActive: boolean) {
  const [key, setKey] = useState(0);
  const prev = useRef(isActive);

  useEffect(() => {
    if (isActive && !prev.current) setKey((k) => k + 1);
    prev.current = isActive;
  }, [isActive]);

  return key;
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

/** Count-up helper — runs when step becomes active; shows `end` immediately if reduced motion. */
export function useCountUp(
  end: number,
  isActive: boolean,
  reduced: boolean,
  animKey: number,
  duration = 1400,
) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setValue(0);
      return;
    }
    if (reduced) {
      setValue(end);
      return;
    }

    setValue(0);
    let start: number | null = null;
    let raf = 0;

    const tick = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      setValue(Math.round(end * easeOutCubic(p)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isActive, reduced, animKey, end, duration]);

  return value;
}

export type VisualProps = { isActive: boolean };
