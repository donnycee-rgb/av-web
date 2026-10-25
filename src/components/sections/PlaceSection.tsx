import { useRef } from 'react';
import { Link } from '@/components/ui/TransitionLink';
import { home } from '@/content/home';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { StackPanel } from '@/components/ui/StackPanel';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SkylineWave } from '@/components/media/SkylineWave';
import { AnimatedMap } from '@/components/media/AnimatedMap';

/**
 * "Made in Nairobi": where the studio is from — Africa map with Kenya, and a line-art skyline with its soundwave.
 *
 * An invisible spacer after the panel keeps it pinned for extra scroll distance. Scrolling through
 * the spacer scrubs the drawings: the map draws first, then the skyline pans in with its soundwave;
 * scrolling back up reverses it. Then the next section slides over as usual.
 * Progress reaches the drawings as the CSS variable `--draw` (0 → 1). It starts at 1 (fully drawn),
 * which is what visitors with reduced motion, or on very short screens, keep.
 */
export function PlaceSection() {
  const { place } = home;
  const spacerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const reduced = useScrollProgress(
    spacerRef,
    (p) => contentRef.current?.style.setProperty('--draw', p.toFixed(4)),
    'entering',
  );

  return (
    <>
      <StackPanel tone="dark" id="place" label="Where we work">
        {/* --skyline-h sets the skyline strip's height; it always spans the full width (sides crop on narrow screens) */}
        <div
          ref={contentRef}
          className="place-scrub flex h-full flex-col [--draw:1] [--skyline-h:clamp(110px,min(30vw,32svh),340px)]"
        >
          <Container className="relative grid min-h-0 flex-1 gap-6 pb-4 pt-24 md:grid-cols-2 md:grid-rows-[minmax(0,1fr)] md:items-center md:gap-12">
            {/* Map: right column on desktop, faint backdrop on phones */}
            <AnimatedMap className="pointer-events-none absolute right-[-12%] top-24 h-[44%] opacity-40 md:static md:order-2 md:h-full md:max-h-full md:min-h-0 md:justify-self-center md:opacity-100" />

            <div className="relative md:order-1">
              <SectionHeading eyebrow={place.eyebrow} title={place.title} mark={place.mark} onDark />
              <p className="mt-3 font-display text-2xl italic text-brand sm:text-3xl">{place.subtitle}</p>
              <p className="mt-5 max-w-md text-white/70 sm:text-lg">{place.body}</p>
              <Link
                to={place.link.to}
                className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-brand"
              >
                {place.link.label}
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </Container>

          {/* Line-art skyline + soundwave, edge to edge along the bottom */}
          <SkylineWave className="w-full shrink-0" />
        </div>
      </StackPanel>

      {/* Scroll distance for the drawing; not needed with reduced motion or on very short screens */}
      {!reduced && <div ref={spacerRef} data-stack-spacer aria-hidden="true" className="h-[140svh] [@media(max-height:620px)]:h-0" />}
    </>
  );
}
