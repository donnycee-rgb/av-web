import { DETAILS_PATH, GROUND, KICC_PATH, ROOFLINE_PATH, SKYLINE_VIEWBOX, rooflineHeights } from '@/lib/nairobiSkyline';

const BARS = 160;
const HEIGHTS = rooflineHeights(BARS);
const BAR_STEP = SKYLINE_VIEWBOX.width / BARS;
/** The soundwave hangs below the ground line, down to the bottom of the drawing */
const WAVE_TOP = GROUND + 6;
const WAVE_DEPTH = SKYLINE_VIEWBOX.height - WAVE_TOP - 2;
const VIEWBOX = `0 0 ${SKYLINE_VIEWBOX.width} ${SKYLINE_VIEWBOX.height}`;

// Where the drawing sits on the section's scroll progress (--draw, 0–1): after the map has mostly drawn
const DRAW_START = 0.3;
const DRAW_LENGTH = 0.6;
/** Progress (0–1) of the line drawing, from --draw */
const progress = `clamp(0, (var(--draw, 1) - ${DRAW_START}) / ${DRAW_LENGTH}, 1)`;

interface SkylineWaveProps {
  className?: string;
}

/**
 * A full-width, line-art Nairobi skyline — one quiet roofline with each real landmark once, KICC
 * picked out in brand orange — with a soundwave "reflection" below it whose bars follow the
 * roofline: quiet between landmarks, peaking under the towers. Wave and skyline are one drawing,
 * so they stay aligned; on narrow screens the sides crop, keeping the landmarks in the middle.
 *
 * Scrubbed by scroll through the inherited CSS variable `--draw` (0–1): the roofline draws itself
 * left to right and each bar rises as the line passes over it. Scrolling back reverses it.
 * Without `--draw` set, it shows fully drawn.
 */
export function SkylineWave({ className = '' }: SkylineWaveProps) {
  return (
    <svg
      viewBox={VIEWBOX}
      preserveAspectRatio="xMidYMax slice"
      className={`block h-[var(--skyline-h)] w-full ${className}`}
      role="img"
      aria-label="Line drawing of the Nairobi skyline"
    >
      <defs>
        <linearGradient id="skyline-wave-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0.75" />
          <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* The roofline */}
      <path
        d={ROOFLINE_PATH}
        pathLength={1}
        fill="none"
        stroke="white"
        strokeOpacity={0.4}
        strokeWidth={1.5}
        strokeLinejoin="round"
        style={{ strokeDasharray: 1, strokeDashoffset: `calc(1 - ${progress})` }}
      />
      {/* Quiet details, once the line has passed */}
      <path d={DETAILS_PATH} fill="none" stroke="white" strokeOpacity={0.18} strokeWidth={1} style={{ opacity: `clamp(0, (${progress} - 0.4) * 3, 1)` }} />
      {/* KICC in brand orange, traced over the roofline as the line reaches it */}
      <path
        d={KICC_PATH}
        pathLength={1}
        fill="none"
        stroke="var(--color-brand)"
        strokeWidth={2}
        strokeLinejoin="round"
        style={{ strokeDasharray: 1, strokeDashoffset: `calc(1 - clamp(0, (${progress} - 0.2) * 6, 1))` }}
      />

      {/* The soundwave: one bar per slice of the roofline, rising as the line passes */}
      {HEIGHTS.map((h, i) => (
        <rect
          key={i}
          x={i * BAR_STEP + BAR_STEP * 0.3}
          y={WAVE_TOP}
          width={BAR_STEP * 0.4}
          height={2 + h * (WAVE_DEPTH - 2)}
          rx={BAR_STEP * 0.2}
          fill="url(#skyline-wave-fade)"
          style={{
            transformBox: 'fill-box',
            transformOrigin: 'top',
            transform: `scaleY(clamp(0, calc((${progress} - ${(i / BARS).toFixed(3)}) * 14), 1))`,
          }}
        />
      ))}
    </svg>
  );
}
