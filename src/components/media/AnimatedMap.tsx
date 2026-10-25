import { useEffect, useRef } from 'react';
// Raw SVG markup (our own cleaned file — see src/assets/illustrations/README.md), inlined so its paths can animate
import mapMarkup from '@/assets/illustrations/map.svg?raw';

interface AnimatedMapProps {
  className?: string;
}

/**
 * The Africa map, drawn in: country borders trace themselves, the land fills, then Kenya floods
 * orange. Scrubbed by scroll through the inherited CSS variable `--draw` (0–1); the timing lives in
 * styles/global.css (.map-draw…). Without `--draw` set, it shows fully drawn.
 */
export function AnimatedMap({ className = '' }: AnimatedMapProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Tag the two groups in the file (all countries, then Kenya) and normalise path lengths for the trace
  useEffect(() => {
    const svg = ref.current?.querySelector('svg');
    if (!svg) return;
    const [land, kenya] = Array.from(svg.querySelectorAll(':scope > g'));
    land?.classList.add('map-land');
    kenya?.classList.add('map-kenya');
    svg.querySelectorAll('path').forEach((path) => path.setAttribute('pathLength', '1'));
  }, []);

  return (
    <div
      ref={ref}
      className={`map-draw [&>svg]:h-full [&>svg]:w-full ${className}`}
      // Matches the map's viewBox (1145 × 1221), so the box keeps the drawing's proportions
      style={{ aspectRatio: '1145 / 1221' }}
      dangerouslySetInnerHTML={{ __html: mapMarkup }}
    />
  );
}
