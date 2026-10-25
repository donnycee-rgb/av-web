import { useEffect, useRef, type RefObject } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Tracks how far the page has scrolled through a tall element: 0 when its top reaches the top
 * of the screen, 1 when its bottom reaches the bottom. The value is written to the element as
 * the CSS variable `--p`, so children animate with `calc(var(--p) …)` without React re-renders.
 * With reduced motion, `--p` stays at 0.
 *
 * `onProgress` (optional) also receives the value, for logic that needs it in JavaScript.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>, onProgress?: (p: number) => void) {
  const reduced = useReducedMotion();
  // Keep the latest callback without re-subscribing to scroll on every render
  const callback = useRef(onProgress);
  callback.current = onProgress;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      el.style.setProperty('--p', '0');
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const p = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
      el.style.setProperty('--p', p.toFixed(4));
      callback.current?.(p);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref, reduced]);

  return reduced;
}
