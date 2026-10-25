import { useId } from 'react';

// Hand-drawn loops (on a 200 × 100 grid), each overshooting its start like a quick marker circle
const LOOPS = [
  'M118 9 C 60 4, 12 20, 8 50 C 4 80, 50 96, 104 95 C 160 94, 200 74, 193 44 C 187 16, 130 4, 70 12',
  'M30 22 C 70 2, 170 4, 192 36 C 206 62, 160 96, 96 96 C 36 96, 2 74, 8 46 C 12 24, 52 10, 112 8',
  'M160 14 C 120 2, 30 6, 10 40 C -4 70, 40 98, 110 94 C 170 90, 202 62, 190 34 C 180 12, 140 8, 96 10 C 70 11, 52 16, 40 22',
];

interface PencilCircleProps {
  /** Drawn on (true) or rubbed out (false) */
  drawn: boolean;
  /** Which hand-drawn loop to use, so neighbouring circles don't look identical */
  variant?: number;
  /** Position/size (relative to a `relative` parent) and colour, e.g. "-inset-2 text-brand-dark" */
  className?: string;
  delay?: number;
}

/**
 * A grease-pencil circle — the waxy marker editors use on contact sheets. The stroke draws itself
 * on when `drawn` turns true and rubs out when it turns false. A little noise roughens its edges.
 * The stroke uses currentColor.
 */
export function PencilCircle({ drawn, variant = 0, className = '', delay = 0 }: PencilCircleProps) {
  const filterId = `pencil-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`;

  return (
    // The box takes the position; the SVG fills it (an SVG alone would keep its own 2:1 shape)
    <span aria-hidden="true" className={`pointer-events-none absolute block ${className}`}>
      <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          {/* Wax on paper: a slightly broken, wobbly edge */}
          <filter id={filterId} x="-10%" y="-20%" width="120%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={variant + 3} />
            <feDisplacementMap in="SourceGraphic" scale={2.5} />
          </filter>
        </defs>
        <path
          d={LOOPS[variant % LOOPS.length]}
          pathLength={1}
          fill="none"
          stroke="currentColor"
          strokeWidth={4.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${filterId})`}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: drawn ? 0 : 1,
            opacity: drawn ? 0.92 : 0,
            // Draws on in one quick sweep; rubs out faster
            transition: drawn
              ? `stroke-dashoffset 550ms cubic-bezier(0.6, 0, 0.3, 1) ${delay}ms, opacity 80ms ${delay}ms`
              : 'stroke-dashoffset 260ms ease-in, opacity 200ms ease-in 120ms',
          }}
        />
      </svg>
    </span>
  );
}
