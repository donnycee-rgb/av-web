import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { services, servicesCopy as copy } from '@/content/studio';
import { useInView } from '@/hooks/useInView';
import { Section } from '@/components/ui/Section';

const FINE_POINTER = '(hover: hover) and (pointer: fine)';
/** How long focus rests on a service before racking to the next (a visitor's pick restarts the count) */
const HOLD_MS = 5000;

/**
 * The services as a rack focus: the titles sit as if seen through a lens with shallow focus — one
 * sharp, the rest soft. Moving over (or tapping) a title pulls focus to it, a lens focus scale
 * beside the list follows, and that service's details show in a fixed panel (so nothing shifts).
 * Left alone, focus racks through them on its own. Arriving from the homepage with a service picked
 * (link state `{ service: id }`) starts on that one.
 */
export function ServicesFocus() {
  const { state } = useLocation();
  const picked = services.findIndex((s) => s.id === (state as { service?: string } | null)?.service);
  const [active, setActive] = useState(Math.max(0, picked));
  const [mouse] = useState(() => window.matchMedia(FINE_POINTER).matches);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, 0.4);

  // Rack on to the next service after a while; any change restarts the count
  useEffect(() => {
    if (!inView) return;
    const timer = window.setTimeout(() => setActive((i) => (i + 1) % services.length), HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [active, inView]);

  return (
    <Section sheet id="services" className="scroll-mt-16">
      <div ref={ref} className="grid gap-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-brand-dark">{copy.eyebrow}</p>
          <h2 className="text-4xl leading-tight sm:text-5xl">{copy.title}</h2>

          <div className="mt-10 flex gap-5 sm:gap-8">
            {/* Lens focus scale: markings for each service, and the marker that follows focus */}
            <div aria-hidden="true" className="relative grid w-10 shrink-0 grid-rows-5 border-r border-ink/15 font-mono text-[10px] text-ink/40">
              {copy.distances.map((d, i) => (
                <span key={d} className={`flex items-center justify-end pr-2 transition-colors duration-500 ${i === active ? 'text-ink' : ''}`}>
                  {d}
                </span>
              ))}
              <span
                className="absolute -right-[7px] top-0 flex h-1/5 items-center transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
                style={{ transform: `translateY(${active * 100}%)` }}
              >
                <span className="h-0 w-0 border-y-[6px] border-r-[7px] border-y-transparent border-r-brand" />
              </span>
            </div>

            {/* The titles, one in focus */}
            <ul className="grid flex-1 grid-rows-5">
              {services.map((service, i) => {
                const sharp = i === active;
                return (
                  <li key={service.id}>
                    <button
                      type="button"
                      aria-pressed={sharp}
                      aria-controls="service-detail"
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      className="w-full py-1.5 text-left font-display text-xl leading-tight outline-none sm:py-2 lg:whitespace-nowrap transition-[filter,opacity,transform] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] focus-visible:underline focus-visible:decoration-brand focus-visible:underline-offset-8 sm:text-3xl xl:text-4xl"
                      style={{
                        filter: sharp ? 'blur(0px)' : 'blur(3.5px)',
                        opacity: sharp ? 1 : 0.4,
                        // Out-of-focus things look a touch smaller on a long lens
                        transform: sharp ? 'scale(1)' : 'scale(0.97)',
                        transformOrigin: 'left center',
                      }}
                    >
                      {service.title}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-ink/40">{mouse ? copy.hint : copy.hintTouch}</p>
        </div>

        {/* Details of the service in focus. All five are stacked in one spot so the panel never changes size. */}
        <div id="service-detail" aria-live="polite" className="grid self-center lg:col-span-5">
          {services.map((service, i) => (
            <div
              key={service.id}
              aria-hidden={i !== active}
              className={`rounded-2xl bg-white p-8 shadow-[0_20px_50px_-30px_rgba(10,20,40,0.35)] transition-opacity duration-500 [grid-area:1/1] ${
                i === active ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand-dark">
                {String(i + 1).padStart(2, '0')} · {copy.distances[i]}
              </p>
              <h3 className="mt-4 text-3xl leading-tight">{service.title}</h3>
              <p className="mt-3 text-lg text-muted">{service.summary}</p>
              <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-ink/40">{copy.includes}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {service.includes.map((item) => (
                  <li key={item} className="rounded-full bg-mist px-3 py-1.5 text-sm font-medium">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
