import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const FINE_POINTER = '(hover: hover) and (pointer: fine)';
// How quickly the reticle catches up with the mouse each frame (0–1); lower = more cinematic lag
const EASE = 0.22;

/**
 * Desktop-only camera reticle that follows the mouse over anything marked `data-cursor="<label>"`
 * (project images, next-project links…). Elsewhere the normal cursor is used.
 * The native cursor is hidden on those elements by a rule in styles/global.css.
 */
export function ViewfinderCursor() {
  const reduced = useReducedMotion();
  const [enabled] = useState(() => window.matchMedia(FINE_POINTER).matches);
  const [label, setLabel] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || reduced) return;
    const target = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let frame = 0;

    const tick = () => {
      pos.x += (target.x - pos.x) * EASE;
      pos.y += (target.y - pos.y) * EASE;
      if (ref.current) ref.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      frame = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const el = (e.target as Element | null)?.closest<HTMLElement>('[data-cursor]');
      setLabel(el ? el.dataset.cursor ?? '' : null);
    };
    const onLeave = () => setLabel(null);

    frame = requestAnimationFrame(tick);
    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [enabled, reduced]);

  if (!enabled || reduced) return null;
  const visible = label !== null;

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[90]">
      <div
        className={`-translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out ${
          visible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`}
      >
        <div className="relative h-20 w-20 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
          {(['left-0 top-0 border-l-2 border-t-2', 'right-0 top-0 border-r-2 border-t-2', 'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2'] as const).map(
            (pos) => (
              <span key={pos} className={`absolute h-4 w-4 border-paper ${pos}`} />
            ),
          )}
          <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 animate-rec rounded-full bg-brand" />
        </div>
        <p className="mt-2 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-paper drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
          {label}
        </p>
      </div>
    </div>
  );
}
