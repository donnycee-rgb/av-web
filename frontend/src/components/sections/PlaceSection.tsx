import { useRef } from 'react';
import { Link } from '@/components/ui/TransitionLink';
import mapSrc from '@/assets/illustrations/map.svg';
import { home } from '@/content/home';
import { useInView } from '@/hooks/useInView';
import { StackPanel } from '@/components/ui/StackPanel';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SkylineWave } from '@/components/media/SkylineWave';

/** "Made in Nairobi": where the studio is from — Africa map with Kenya, and the skyline as a soundwave. */
export function PlaceSection() {
  const { place } = home;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  return (
    <StackPanel tone="dark" id="place" label="Where we work">
      {/* --skyline-h sets the skyline strip's height; its width follows from the drawing's ratio */}
      <div ref={ref} className="flex h-full flex-col [--skyline-h:clamp(170px,34svh,380px)]">
        <Container className="relative grid min-h-0 flex-1 gap-6 pb-4 pt-24 md:grid-cols-2 md:grid-rows-[minmax(0,1fr)] md:items-center md:gap-12">
          {/* Map: right column on desktop, faint backdrop on phones */}
          <img
            src={mapSrc}
            alt="Map of Africa with Kenya highlighted"
            className="pointer-events-none absolute right-[-12%] top-24 h-[44%] w-auto opacity-40 md:static md:order-2 md:h-full md:max-h-full md:min-h-0 md:justify-self-center md:object-contain md:opacity-100"
          />

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

        {/* Skyline + soundwave, edge to edge along the bottom */}
        <SkylineWave play={inView} className="w-full shrink-0" />
      </div>
    </StackPanel>
  );
}
