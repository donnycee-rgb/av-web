import { useEffect, useRef, useState } from 'react';
import { home } from '@/content/home';
import { clients, testimonials } from '@/content/studio';
import { useInView } from '@/hooks/useInView';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { StackPanel } from '@/components/ui/StackPanel';
import { Container } from '@/components/ui/Container';
import { Laurel } from '@/components/ui/Laurel';
import type { Client } from '@/types';

const FINE_POINTER = '(hover: hover) and (pointer: fine)';
/** How long each review shows before the next one comes up (hovering or tapping restarts the count) */
const REVIEW_MS = 6000;

/** A client's logo (white, or in its own colours), or its name as a stand-in when there's no logo file */
function ClientMark({ client, hidden = false }: { client: Client; hidden?: boolean }) {
  return (
    <li aria-hidden={hidden || undefined} className="flex h-14 shrink-0 items-center px-8 sm:h-16 sm:px-12">
      {client.logo ? (
        // Wordmarks turn white; emblems keep their own colours, a touch muted until hovered
        <img
          src={client.logo}
          alt={hidden ? '' : client.name}
          loading="lazy"
          className={`w-auto transition-opacity duration-300 hover:opacity-100 ${
            client.tone === 'colour' ? 'h-12 opacity-80 sm:h-14' : 'h-10 opacity-75 [filter:brightness(0)_invert(1)] sm:h-11'
          }`}
        />
      ) : (
        <span className="whitespace-nowrap font-display text-lg italic text-white/45 transition-colors duration-300 hover:text-white">{client.name}</span>
      )}
    </li>
  );
}

/**
 * Clients like the foot of a film poster: each review is a festival laurel, with the clients' logos
 * running along underneath. The reviews take turns on their own; hovering (or tapping) a laurel
 * jumps to its review.
 */
export function ClientsSection() {
  const { clients: copy } = home;
  const ref = useRef<HTMLDivElement>(null);
  const grown = useInView(ref, 0.4);
  const [active, setActive] = useState(0);
  const [mouse] = useState(() => window.matchMedia(FINE_POINTER).matches);
  const reduced = useReducedMotion();

  // Move on to the next review after a while — even if one was picked, so a visitor who never
  // hovers still sees them all. Any change of review restarts the count.
  useEffect(() => {
    if (!grown) return;
    const timer = window.setTimeout(() => setActive((i) => (i + 1) % testimonials.length), REVIEW_MS);
    return () => window.clearTimeout(timer);
  }, [active, grown]);

  return (
    <StackPanel tone="dark" label="Clients">
      <div ref={ref} className="flex h-full flex-col justify-center pb-10 pt-24 text-center">
        <Container>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand">{copy.eyebrow}</p>
          <h2 className="text-4xl leading-tight sm:text-5xl">{copy.title}</h2>

          {/* Laurels */}
          <ul className="mx-auto mt-6 grid max-w-5xl grid-cols-2 gap-x-4 gap-y-1 sm:mt-10 sm:gap-y-2 lg:grid-cols-4">
            {testimonials.map((t, i) => (
              <li key={t.name}>
                <button
                  type="button"
                  aria-pressed={i === active}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="group w-full rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <Laurel grown={grown} lit={i === active} delay={i * 180}>
                    <span
                      className={`font-display text-base italic leading-tight transition-colors duration-500 lg:text-lg ${
                        i === active ? 'text-white' : 'text-white/60'
                      }`}
                    >
                      {t.pull}
                    </span>
                    <span className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/45 sm:text-[10px]">{t.name}</span>
                  </Laurel>
                </button>
              </li>
            ))}
          </ul>

          {/* The full review. All four are stacked in one spot, so the box is always as tall as the longest
              and nothing below shifts when they change; only the current one is shown. */}
          <figure className="mx-auto mt-2 grid max-w-2xl sm:mt-4" aria-live="polite">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                aria-hidden={i !== active}
                className={`[grid-area:1/1] transition-opacity duration-500 ${i === active ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
              >
                <blockquote className="font-display text-lg italic leading-snug text-white/85 sm:text-2xl">“{t.quote}”</blockquote>
                <figcaption className="mt-2 text-sm text-white/45">
                  {t.name} · {t.role}
                </figcaption>
              </div>
            ))}
            {/* Fills up until the next review */}
            <div aria-hidden="true" className="mx-auto mt-3 h-px w-16 overflow-hidden bg-white/10">
              {grown && (
                <div key={active} className="h-full origin-left bg-brand" style={{ animation: `progress ${REVIEW_MS}ms linear forwards` }} />
              )}
            </div>
          </figure>
          <p className="sr-only">{mouse ? copy.hint : copy.hintTouch}</p>
        </Container>

        {/* Logo strip, edge to edge: two copies of the row slide left on a loop; hovering pauses it */}
        <div
          role="group"
          aria-label={copy.logosLabel}
          className="mt-6 border-t border-white/10 pt-6 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)] sm:mt-10 sm:pt-8"
        >
          {reduced ? (
            <ul className="flex flex-wrap justify-center">
              {clients.map((client) => (
                <ClientMark key={client.name} client={client} />
              ))}
            </ul>
          ) : (
            <ul className="flex w-max animate-[marquee_40s_linear_infinite] hover:[animation-play-state:paused]">
              {/* Each half holds the list twice, so even a short list fills very wide screens without a gap */}
              {[false, true].map((copyOfRow) =>
                [...clients, ...clients].map((client, i) => (
                  <ClientMark key={`${client.name}-${copyOfRow}-${i}`} client={client} hidden={copyOfRow || i >= clients.length} />
                )),
              )}
            </ul>
          )}
        </div>
      </div>
    </StackPanel>
  );
}
