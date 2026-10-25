import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { home } from '@/content/home';
import { projects } from '@/content/projects';
import { site } from '@/content/site';
import { useInView } from '@/hooks/useInView';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTimecode } from '@/hooks/useTimecode';
import { StackPanel } from '@/components/ui/StackPanel';
import { Container } from '@/components/ui/Container';

/** When each beat lands after the section comes into view (ms): lights, camera, action */
const BEATS = [350, 1700, 2700];
/** How long each still holds in the aperture's reel */
const REEL_MS = 4000;
/** The aperture: a hexagon, closed to a point at the centre or open (same shape as the page-change iris) */
const CLOSED = 'polygon(50% 48%, 51.7% 49%, 51.7% 51%, 50% 52%, 48.3% 51%, 48.3% 49%)';
const OPEN = 'polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)';
const CORNERS = ['left-0 top-0 border-l-2 border-t-2', 'right-0 top-0 border-r-2 border-t-2', 'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2'];

/**
 * The closing call to action, played like the start of a screening. The panel arrives in brand
 * orange; then the beats land one by one —
 *   LIGHTS: the house lights dim the panel to dark and the AV aperture irises open on a reel of work,
 *   CAMERA: viewfinder brackets frame it, with REC and a running timecode,
 *   ACTION: the last word is the button, which flashes and cuts to the Contact page.
 * After that a soft spotlight follows the mouse. With reduced motion everything is simply shown.
 */
export function CtaSection() {
  const { cta } = home;
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, 0.5);
  const [beat, setBeat] = useState(0);
  const [still, setStill] = useState(0);
  const [flash, setFlash] = useState(false);
  const timecode = useTimecode(0, beat >= 2);

  // The three beats, once, when the section is properly in view
  useEffect(() => {
    if (!inView) return;
    if (reduced) return setBeat(3);
    const timers = BEATS.map((at, i) => window.setTimeout(() => setBeat(i + 1), at));
    return () => timers.forEach(window.clearTimeout);
  }, [inView, reduced]);

  // The reel in the aperture
  useEffect(() => {
    if (beat < 1 || reduced) return;
    const timer = window.setInterval(() => setStill((s) => (s + 1) % projects.length), REEL_MS);
    return () => window.clearInterval(timer);
  }, [beat, reduced]);

  // Spotlight: follows the mouse over the dark panel
  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  // Action: a flash, then the cut to Contact
  const onAction = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || reduced) return;
    e.preventDefault();
    setFlash(true);
    window.setTimeout(() => navigate(cta.primary.to, { viewTransition: true }), 220);
  };

  const lit = beat >= 1;
  const word = (shown: boolean) =>
    `block transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`;

  return (
    <StackPanel tone="brand" label="Get in touch">
      <div ref={ref} onMouseMove={onMouseMove} className="relative h-full [--mx:70%] [--my:50%]">
        {/* House lights going down: the orange panel dims to dark */}
        <div aria-hidden="true" className={`absolute inset-0 bg-ink transition-opacity duration-[1400ms] ease-in-out ${lit ? 'opacity-100' : 'opacity-0'}`} />
        {/* The spotlight that follows the mouse */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ${lit ? 'opacity-100' : 'opacity-0'}`}
          style={{ background: 'radial-gradient(circle 32rem at var(--mx) var(--my), rgba(245,138,7,0.16), transparent 70%)' }}
        />

        <Container className="relative grid h-full items-center gap-8 pb-10 pt-24 md:grid-cols-12 md:gap-12">
          {/* The aperture, with its reel and the camera's viewfinder */}
          <div className="order-first mx-auto w-[min(70vw,34svh)] md:order-last md:col-span-5 md:w-full md:max-w-[min(100%,58svh)]">
            <div className="relative aspect-square p-4 sm:p-6">
              <div
                role="img"
                aria-label={cta.reelLabel}
                className="relative h-full w-full bg-black transition-[clip-path,transform] duration-[1400ms] ease-[cubic-bezier(0.7,0,0.3,1)]"
                style={{ clipPath: lit ? OPEN : CLOSED, transform: lit ? 'rotate(0deg)' : 'rotate(-60deg)' }}
              >
                {projects.map((p, i) => (
                  <img
                    key={p.slug}
                    src={p.image}
                    alt=""
                    loading="lazy"
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${i === still ? 'animate-kenburns opacity-100' : 'opacity-0'}`}
                  />
                ))}
                {/* A warm grade so the reel sits in the brand */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand/40 via-transparent to-ink/30 mix-blend-multiply" />
              </div>

              {/* Viewfinder: brackets, REC and timecode */}
              <div className={`pointer-events-none absolute inset-0 transition-[opacity,transform] duration-500 ${beat >= 2 ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}`}>
                {CORNERS.map((corner) => (
                  <span key={corner} className={`absolute h-8 w-8 border-brand ${corner}`} />
                ))}
                <span className="absolute -top-6 left-0 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/80">
                  <span className="h-1.5 w-1.5 animate-rec rounded-full bg-brand" />
                  Rec
                </span>
                <span className="absolute -top-6 right-0 font-mono text-[10px] tracking-[0.2em] text-white/60 tabular-nums">{timecode}</span>
              </div>
            </div>
          </div>

          {/* Lights. Camera. Action. */}
          <div className="text-center md:col-span-7 md:text-left">
            <h2 className="font-display text-6xl leading-[0.95] text-white sm:text-7xl lg:text-8xl">
              <span className={word(beat >= 1)}>{cta.lights}</span>
              <span className={word(beat >= 2)}>{cta.camera}</span>
              <span className="sr-only">{cta.action}</span>
            </h2>
            <a
              href={cta.primary.to}
              onClick={onAction}
              aria-label={cta.primary.label}
              className={`group mt-1 inline-flex items-center gap-4 font-display text-6xl italic leading-[1.05] text-brand outline-none sm:text-7xl lg:text-8xl focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-8 ${word(beat >= 3)}`}
            >
              {cta.action}
              <span
                aria-hidden="true"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-2xl not-italic text-ink transition-transform duration-300 group-hover:translate-x-2 sm:h-16 sm:w-16 sm:text-3xl"
              >
                →
              </span>
            </a>
            <p className={`mt-8 text-white/70 sm:text-lg ${word(beat >= 3)}`}>
              {cta.body}{' '}
              <a href={`mailto:${site.email}`} className="whitespace-nowrap font-semibold text-white underline-offset-4 hover:text-brand hover:underline">
                {site.email}
              </a>
            </p>
          </div>
        </Container>

        {/* The clap: a flash before cutting to Contact */}
        {flash && <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 animate-[cut-flash_220ms_ease-out] bg-paper opacity-0" />}
      </div>
    </StackPanel>
  );
}
