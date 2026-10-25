import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { Link } from '@/components/ui/TransitionLink';
import { footer, navigation, site } from '@/content/site';
import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/ui/Logo';

const FINE_POINTER = '(hover: hover) and (pointer: fine)';
/** How bright a patch of the wordmark the light fills (radius) */
const LIGHT_RADIUS = '13rem';

/** The studio's local time, e.g. "14:32", updated every few seconds */
function useLocalTime(timeZone: string) {
  const format = () => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone }).format(new Date());
  const [time, setTime] = useState(format);
  useEffect(() => {
    const timer = window.setInterval(() => setTime(format()), 15000);
    return () => window.clearInterval(timer);
  }, [timeZone]);
  return time;
}

/** The wordmark text, sized to the full width (the two layers must match exactly) */
function WordmarkText({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 1000 128" className={className} aria-hidden="true">
      <text
        x="0"
        y="112"
        textLength="1000"
        lengthAdjust="spacingAndGlyphs"
        style={{ fontFamily: 'var(--font-display)', fontSize: 150, letterSpacing: '-0.01em' }}
      >
        {footer.wordmark}
      </text>
    </svg>
  );
}

/**
 * Site footer: brand line, links and contact, then a giant outlined AV PRODUCTIONS that fills with
 * brand orange wherever the pointer's light falls (it sweeps across on its own on touch screens).
 * The bottom bar has the studio's local time, credits, and "Rewind" back to the top.
 */
export function Footer() {
  const socials = site.socials.filter((s) => s.url);
  const year = new Date().getFullYear();
  const time = useLocalTime(footer.clock.timeZone);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const [mouse] = useState(() => window.matchMedia(FINE_POINTER).matches);

  // The light on the wordmark follows the pointer anywhere over the footer
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const el = wordmarkRef.current;
    if (!el || e.pointerType !== 'mouse') return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--wx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--wy', `${e.clientY - rect.top}px`);
    el.style.setProperty('--wr', LIGHT_RADIUS);
  };
  const onPointerLeave = () => wordmarkRef.current?.style.setProperty('--wr', '0px');

  return (
    <footer onPointerMove={onPointerMove} onPointerLeave={onPointerLeave} className="spotlight overflow-hidden bg-ink text-white">
      <Container className="pt-16 sm:pt-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-6 max-w-sm font-display text-2xl leading-snug text-white">
              {footer.tagline} <span className="text-brand">{footer.taglineAccent}</span>
            </p>
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <h2 className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white/50">{footer.explore}</h2>
            <ul className="flex flex-col gap-2.5 text-sm">
              {navigation.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-white/80 hover:text-brand">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <h2 className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white/50">{footer.contact}</h2>
            <ul className="flex flex-col gap-2.5 text-sm text-white/80">
              <li>
                <a href={`mailto:${site.email}`} className="hover:text-brand">
                  {site.email}
                </a>
              </li>
              <li>
                <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="hover:text-brand">
                  {site.phone}
                </a>
              </li>
              <li>{site.location}</li>
              {socials.map((s) => (
                <li key={s.platform}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-brand">
                    {s.platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar: rights and credits · local time · rewind */}
        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>
              © {year} {site.name}. {footer.rights}
            </span>
            <details className="group">
              <summary className="cursor-pointer list-none underline-offset-4 hover:text-white hover:underline">{footer.credits}</summary>
              <ul className="mt-2 space-y-1">
                {footer.creditsList.map((c) => (
                  <li key={c.url}>
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className="hover:text-brand">
                      {c.text}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          </div>

          <p className="font-mono uppercase tracking-[0.2em]">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-brand align-middle" aria-hidden="true" />
            {footer.clock.city} · <time className="tabular-nums text-white/80">{time}</time> {footer.clock.zone}
          </p>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group inline-flex items-center gap-2 self-start font-mono uppercase tracking-[0.2em] text-white/70 hover:text-brand sm:self-auto"
          >
            {/* Rewind: two triangles pointing back (up) */}
            <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" fill="currentColor" aria-hidden="true">
              <path d="M12 3 4 12h16z M12 12 4 21h16z" />
            </svg>
            {footer.rewind}
          </button>
        </div>
      </Container>

      {/* The giant wordmark: outline always, orange fill only where the light is */}
      <div className="px-3 pb-3 pt-6 sm:px-6 sm:pt-10">
        <div ref={wordmarkRef} className={`wordmark relative ${mouse ? '' : 'wordmark-sweep'}`}>
          <WordmarkText className="block w-full fill-transparent stroke-white/20 [stroke-width:1]" />
          <WordmarkText className="wordmark-light absolute inset-0 block h-full w-full fill-brand" />
        </div>
      </div>
    </footer>
  );
}
