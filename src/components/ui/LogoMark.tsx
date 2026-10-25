// Letter shapes of the AV mark, from public/images/logo.svg (viewBox 0 0 800 700)
const PATHS = [
  // A — left leg with base serifs and counter
  'M 8 620 L 160 620 L 160 605 C 130 605 118 595 130 555 L 265 140 C 275 110 262 100 238 95 L 290 95 L 478 555 C 492 590 510 605 540 605 L 540 620 L 340 620 L 340 605 C 370 605 382 590 370 555 L 342 475 L 175 475 L 135 555 C 122 595 105 605 60 605 L 8 605 Z M 192 430 L 325 430 L 260 260 Z',
  // V — heavy left stem
  'M 250 95 L 455 95 L 455 112 C 410 112 390 128 368 180 L 515 545 L 540 605 L 520 605 L 305 180 C 290 145 275 112 250 112 Z',
  // V — right stem with top serif
  'M 520 605 L 535 605 C 550 575 640 330 748 112 C 768 112 778 112 788 112 L 788 95 L 632 95 L 632 112 C 660 112 675 125 662 155 L 528 590 Z',
];

interface LogoMarkProps {
  className?: string;
  /**
   * 'static'  — solid mark; a white stroke races round the letters when a parent `.group` is hovered.
   * 'drawing' — outline starts hidden; set `drawn` to true to trace it, then fill (used by the intro).
   */
  variant?: 'static' | 'drawing';
  drawn?: boolean;
}

/** The AV monogram as inline SVG, so it can be animated. */
export function LogoMark({ className = '', variant = 'static', drawn = false }: LogoMarkProps) {
  const drawing = variant === 'drawing';

  return (
    <svg viewBox="0 80 800 560" className={className} aria-hidden="true">
      {/* Solid letters */}
      <g
        fill="var(--color-brand)"
        style={drawing ? { fillOpacity: drawn ? 1 : 0, transition: 'fill-opacity 500ms ease-out 1000ms' } : undefined}
      >
        {PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      {/* Outline layer: traces the letters (intro), or on hover a short white dash travels the full
          outline — it starts just before the path (offset 0.25) and ends just past it (offset -1), so it is invisible at rest */}
      <g
        fill="none"
        stroke={drawing ? 'var(--color-brand)' : 'var(--color-paper)'}
        strokeWidth={drawing ? 5 : 9}
        strokeLinejoin="round"
        // Flat ends for the hover dash, so no cap peeks out while it waits off the path
        strokeLinecap={drawing ? 'round' : 'butt'}
      >
        {PATHS.map((d) => (
          <path
            key={d}
            d={d}
            pathLength={1}
            className={
              drawing
                ? ''
                : '[stroke-dasharray:0.25_2] [stroke-dashoffset:0.25] group-hover:[stroke-dashoffset:-1] group-hover:transition-[stroke-dashoffset] group-hover:duration-[900ms] group-hover:ease-out'
            }
            style={
              drawing
                ? { strokeDasharray: 1, strokeDashoffset: drawn ? 0 : 1, transition: 'stroke-dashoffset 1100ms cubic-bezier(0.65, 0, 0.35, 1)' }
                : undefined
            }
          />
        ))}
      </g>
    </svg>
  );
}
