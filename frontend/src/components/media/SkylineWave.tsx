import skylineSrc from '@/assets/illustrations/nairobi-skyline.svg';
import { useSilhouetteHeights } from '@/hooks/useSilhouetteHeights';

// Proportions of the skyline drawing (its viewBox is 562.17 × 322.48)
const SKYLINE_ASPECT = 562.17 / 322.48;
const BARS_PER_COPY = 40;
// Enough copies to cover very wide screens; extra width is clipped
const COPIES = 5;

interface SkylineWaveProps {
  /** Start the reveal (set when the section scrolls into view) */
  play: boolean;
  className?: string;
}

/**
 * A full-width Nairobi skyline: the drawing repeated side by side (alternate copies mirrored,
 * so it reads as one city), revealed left to right like a camera pan, with a soundwave
 * "reflection" underneath whose bars follow the real building heights.
 */
export function SkylineWave({ play, className = '' }: SkylineWaveProps) {
  const heights = useSilhouetteHeights(skylineSrc, BARS_PER_COPY, SKYLINE_ASPECT);

  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className="flex justify-center transition-[clip-path] duration-[2200ms] ease-out"
        style={{ clipPath: play ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)' }}
      >
        {Array.from({ length: COPIES }, (_, copy) => (
          // Mirroring the whole column flips the skyline and its soundwave together
          <div key={copy} className={`flex shrink-0 flex-col ${copy % 2 === 1 ? '-scale-x-100' : ''}`} aria-hidden={copy !== 2}>
            <img
              src={skylineSrc}
              alt={copy === 2 ? 'Illustrated Nairobi skyline' : ''}
              className="block h-[var(--skyline-h)] w-auto max-w-none"
            />
            <svg
              viewBox={`0 0 ${BARS_PER_COPY} 10`}
              preserveAspectRatio="none"
              className="mt-1 block h-[clamp(32px,6vh,64px)] w-full"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id={`wave-fade-${copy}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f58a07" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#f58a07" stopOpacity="0.08" />
                </linearGradient>
              </defs>
              {heights.map((h, i) => (
                <rect
                  key={i}
                  x={i + 0.2}
                  y={0}
                  width={0.6}
                  height={Math.max(0.4, h * 10)}
                  rx={0.3}
                  fill={`url(#wave-fade-${copy})`}
                  className="origin-top transition-transform duration-700 ease-out"
                  style={{
                    transform: play ? 'scaleY(1)' : 'scaleY(0)',
                    transformBox: 'fill-box',
                    // Bars grow left to right across the whole strip, following the pan
                    // (mirrored copies count from the other end so the order stays left → right on screen)
                    transitionDelay: `${500 + (copy * BARS_PER_COPY + (copy % 2 ? BARS_PER_COPY - 1 - i : i)) * 8}ms`,
                  }}
                />
              ))}
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
