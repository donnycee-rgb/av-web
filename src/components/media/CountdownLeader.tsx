import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface CountdownLeaderProps {
  /** Start counting (e.g. when scrolled into view) */
  start: boolean;
  className?: string;
}

const STEP_MS = 900;

/**
 * A film countdown leader: crosshairs, a sweeping hand and 3 … 2 … 1, then a play symbol.
 * Counts once and stops — it never navigates by itself.
 */
export function CountdownLeader({ start, className = '' }: CountdownLeaderProps) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (!start || reduced || count === 0) return;
    const timer = window.setTimeout(() => setCount((c) => c - 1), STEP_MS);
    return () => window.clearTimeout(timer);
  }, [start, reduced, count]);

  const shown = reduced ? 0 : count;

  return (
    <div aria-hidden="true" className={`relative aspect-square overflow-hidden rounded-full border-2 border-white/80 ${className}`}>
      {/* Sweeping hand — restarts with each number */}
      {start && shown > 0 && (
        <div
          key={shown}
          className="absolute inset-0 animate-sweep"
          style={{ background: 'conic-gradient(from 0deg, rgba(245,138,7,0.45) 0deg, rgba(245,138,7,0.45) 40deg, transparent 40deg)' }}
        />
      )}
      {/* Crosshairs and inner ring */}
      <span className="absolute inset-x-0 top-1/2 h-px bg-white/40" />
      <span className="absolute inset-y-0 left-1/2 w-px bg-white/40" />
      <span className="absolute inset-[14%] rounded-full border border-white/40" />
      <span className="absolute inset-0 flex items-center justify-center font-display text-7xl text-white sm:text-8xl">
        {shown > 0 ? (
          shown
        ) : (
          <svg viewBox="0 0 16 16" className="ml-2 h-12 w-12 fill-brand sm:h-14 sm:w-14">
            <path d="M3 1.5v13L14 8z" />
          </svg>
        )}
      </span>
    </div>
  );
}
