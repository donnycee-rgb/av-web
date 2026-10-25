import { useEffect } from 'react';

const FINE_POINTER = '(hover: hover) and (pointer: fine)';

/**
 * Moves the warm pointer glow on dark sections (anything with the class "spotlight" — the glow
 * itself is drawn in styles/global.css). One listener for the whole site: it lights the section
 * under the mouse and fades out the one it left. Mouse and trackpad only.
 */
export function Spotlight() {
  useEffect(() => {
    if (!window.matchMedia(FINE_POINTER).matches) return;
    let lit: HTMLElement | null = null;
    let frame = 0;
    let last = { x: 0, y: 0, target: null as Element | null };

    const update = () => {
      frame = 0;
      const section = last.target?.closest<HTMLElement>('.spotlight') ?? null;
      if (section !== lit) {
        lit?.style.setProperty('--spot', '0');
        lit = section;
      }
      if (!section) return;
      const rect = section.getBoundingClientRect();
      section.style.setProperty('--mx', `${(last.x - rect.left).toFixed(0)}px`);
      section.style.setProperty('--my', `${(last.y - rect.top).toFixed(0)}px`);
      section.style.setProperty('--spot', '1');
    };

    const onMove = (e: PointerEvent) => {
      last = { x: e.clientX, y: e.clientY, target: e.target as Element };
      if (!frame) frame = requestAnimationFrame(update);
    };
    // Scrolling moves the section under a still mouse, so re-aim at the element now under it
    const onScroll = () => {
      last.target = document.elementFromPoint(last.x, last.y);
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onLeave = () => {
      lit?.style.setProperty('--spot', '0');
      lit = null;
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return null;
}
