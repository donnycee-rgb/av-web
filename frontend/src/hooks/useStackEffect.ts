import { useEffect, type RefObject } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * For a stack of sticky panels: as the next panel slides over a pinned one,
 * gently scale and dim the pinned panel's content so it reads as "pushed back".
 * Panels are the container's direct children; each needs a `[data-stack-inner]` child.
 */
export function useStackEffect(containerRef: RefObject<HTMLElement | null>) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const panels = Array.from(container.children) as HTMLElement[];
    const inners = panels.map((p) => p.querySelector<HTMLElement>('[data-stack-inner]'));

    if (reduced) {
      inners.forEach((el) => el && (el.style.transform = el.style.filter = ''));
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      panels.forEach((_panel, i) => {
        const inner = inners[i];
        const next = panels[i + 1];
        if (!inner || !next) return;
        // 0 when the next panel is a full screen away, 1 when it fully covers this one
        const progress = Math.min(1, Math.max(0, 1 - next.getBoundingClientRect().top / vh));
        inner.style.transform = progress ? `scale(${1 - progress * 0.06})` : '';
        inner.style.filter = progress ? `brightness(${1 - progress * 0.35})` : '';
      });
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
  }, [containerRef, reduced]);
}
