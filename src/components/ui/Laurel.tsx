import type { ReactNode } from 'react';

interface LaurelProps {
  /** Leaves grow in (true) or stay hidden (false) */
  grown: boolean;
  /** Brighter, brand-coloured leaves */
  lit?: boolean;
  /** Extra wait (ms) before this wreath starts growing, to stagger several */
  delay?: number;
  children: ReactNode;
  className?: string;
}

const LEAVES = 9;
/** The wreath is half an ellipse each side, open at the top (drawing units, 200 × 120 box) */
const CENTRE = { x: 100, y: 58 };
const RADIUS = { x: 92, y: 54 };
/** Branch runs from just off the bottom (100°) round to the upper side (232°) */
const FROM = 100;
const TO = 232;

// Leaf positions along the left branch (the right branch mirrors it): alternating outside / inside the stem
const LEFT_LEAVES = Array.from({ length: LEAVES }, (_, i) => {
  const t = i / (LEAVES - 1);
  const angle = ((FROM + (TO - FROM) * t) * Math.PI) / 180;
  const x = CENTRE.x + RADIUS.x * Math.cos(angle);
  const y = CENTRE.y + RADIUS.y * Math.sin(angle);
  // Direction the stem runs here, so leaves point along it and lean out or in
  const tangent = (Math.atan2(RADIUS.y * Math.cos(angle), -RADIUS.x * Math.sin(angle)) * 180) / Math.PI;
  const lean = i % 2 ? 32 : -32;
  // Leaves get a little smaller towards the tips
  const size = 1 - t * 0.35;
  return { x, y, rotate: tangent + lean, size };
});

const STEM = (() => {
  const point = (deg: number) => {
    const a = (deg * Math.PI) / 180;
    return `${(CENTRE.x + RADIUS.x * Math.cos(a)).toFixed(1)} ${(CENTRE.y + RADIUS.y * Math.sin(a)).toFixed(1)}`;
  };
  return `M ${point(FROM - 6)} A ${RADIUS.x} ${RADIUS.y} 0 0 1 ${point(TO + 4)}`;
})();

/**
 * A festival laurel — the "Official Selection" wreath from film posters — with content in the
 * middle. When `grown` turns true the leaves grow in one by one from the bottom up.
 */
export function Laurel({ grown, lit = false, delay = 0, children, className = '' }: LaurelProps) {
  const branch = (
    <>
      <path d={STEM} fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" />
      {/* Each leaf is placed and angled by its group, and drawn at the origin so it grows from its own centre */}
      {LEFT_LEAVES.map((leaf, i) => (
        <g key={i} transform={`translate(${leaf.x.toFixed(1)} ${leaf.y.toFixed(1)}) rotate(${leaf.rotate.toFixed(1)})`}>
          <ellipse
            rx={10 * leaf.size}
            ry={3.8 * leaf.size}
            fill="currentColor"
            style={{
              scale: grown ? '1' : '0',
              opacity: grown ? 1 : 0,
              transition: `scale 500ms cubic-bezier(0.34, 1.56, 0.64, 1) ${delay + i * 70}ms, opacity 300ms ${delay + i * 70}ms`,
            }}
          />
        </g>
      ))}
    </>
  );

  return (
    <div className={`relative ${className}`} style={{ aspectRatio: '200 / 120' }}>
      <svg
        aria-hidden="true"
        viewBox="0 0 200 120"
        className={`absolute inset-0 h-full w-full transition-colors duration-500 ${lit ? 'text-brand' : 'text-white/45'}`}
      >
        {branch}
        <g transform="translate(200 0) scale(-1 1)">{branch}</g>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-[17%] text-center">{children}</div>
    </div>
  );
}
