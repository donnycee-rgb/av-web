import { useEffect, useRef, useState } from 'react';
import { signalFlow, signalFlowCopy as copy } from '@/content/studio';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { Container } from '@/components/ui/Container';

// Diagram coordinates (viewBox 0 0 1000 360): a snake — left to right, round the bend, back right to left
const VIEW_W = 1000;
const VIEW_H = 360;
const NODES = [
  { x: 80, y: 90 },
  { x: 330, y: 90 },
  { x: 580, y: 90 },
  { x: 830, y: 90 },
  { x: 830, y: 270 },
  { x: 500, y: 270 },
  { x: 170, y: 270 },
];
const CABLE = 'M80 90 H830 Q920 90 920 180 Q920 270 830 270 H170';
// The cable finishes drawing a little before the section ends, so the last stage gets time on screen
const DRAW_SPEED = 1.12;


/** Where each node sits along the cable (0–1), measured from the real SVG path. */
function useNodeFractions(path: SVGPathElement | null) {
  const [fractions, setFractions] = useState<number[]>(() => NODES.map((_, i) => i / (NODES.length - 1)));
  useEffect(() => {
    if (!path) return;
    const total = path.getTotalLength();
    const samples = Array.from({ length: 600 }, (_, i) => {
      const point = path.getPointAtLength((i / 599) * total);
      return { at: i / 599, x: point.x, y: point.y };
    });
    setFractions(
      NODES.map((n) => samples.reduce((best, s) => (Math.hypot(s.x - n.x, s.y - n.y) < Math.hypot(best.x - n.x, best.y - n.y) ? s : best)).at),
    );
  }, [path]);
  return fractions;
}

/** Mobile / reduced-motion version: the chain as a vertical list with every stage open. */
function FlowList() {
  return (
    <ol className="relative ml-3 border-l-2 border-brand pl-8">
      {signalFlow.map((stage, i) => (
        <li key={stage.id} className="relative pb-12 last:pb-0">
          <span className="absolute -left-[45px] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-brand font-mono text-xs font-bold text-ink">
            {i + 1}
          </span>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand">{stage.label}</p>
          <h3 className="mt-2 text-2xl">{stage.title}</h3>
          <p className="mt-3 text-white/70">{stage.body}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {stage.includes.map((item) => (
              <li key={item} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80">
                {item}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

/**
 * The studio's process as a signal-flow diagram. On desktop the screen pins while an orange cable
 * draws itself through each stage; stages light up as the signal reaches them, and the panel below
 * shows the current one.
 */
export function SignalFlow() {
  const sectionRef = useRef<HTMLElement>(null);
  const [path, setPath] = useState<SVGPathElement | null>(null);
  const fractions = useNodeFractions(path);
  const [active, setActive] = useState(0);

  const reduced = useScrollProgress(sectionRef, (p) => {
    const drawn = Math.min(1, p * DRAW_SPEED);
    let index = 0;
    fractions.forEach((f, i) => {
      if (drawn + 0.004 >= f) index = i;
    });
    setActive((current) => (current === index ? current : index));
  });

  const jumpTo = (i: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const travel = section.offsetHeight - window.innerHeight;
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + ((fractions[i] + 0.01) / DRAW_SPEED) * travel, behavior: 'smooth' });
  };

  const stage = signalFlow[active];

  const heading = (
    <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand">{copy.eyebrow}</p>
        <h2 className="text-4xl leading-tight sm:text-5xl">{copy.title}</h2>
      </div>
      <p className="hidden text-sm text-white/50 md:block">{copy.hint}</p>
    </div>
  );

  if (reduced) {
    return (
      <section className="bg-ink py-24 text-white">
        <Container>
          {heading}
          <FlowList />
        </Container>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative bg-ink text-white md:h-[calc(100svh+315svh)]">
      {/* Phones: vertical chain */}
      <Container className="py-24 md:hidden">
        {heading}
        <FlowList />
      </Container>

      {/* Desktop: pinned diagram */}
      <div className="sticky top-0 hidden h-svh flex-col justify-center pt-20 md:flex">
        <Container>
          {heading}

          {/* Diagram — width follows screen height so diagram + panel always fit */}
          <div className="relative mx-auto" style={{ width: `min(100%, calc(40svh * ${VIEW_W / VIEW_H}))`, aspectRatio: `${VIEW_W} / ${VIEW_H}` }}>
            <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
              <path d={CABLE} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="4" strokeLinecap="round" />
              <path
                ref={setPath}
                d={CABLE}
                pathLength={1}
                fill="none"
                stroke="var(--color-brand)"
                strokeWidth="4"
                strokeLinecap="round"
                style={{
                  strokeDasharray: 1,
                  strokeDashoffset: `calc(1 - min(1, var(--p, 0) * ${DRAW_SPEED}))`,
                  filter: 'drop-shadow(0 0 6px color-mix(in srgb, var(--color-brand) 70%, transparent))',
                }}
              />
              {/* Output arrow after the last stage */}
              <path d="M150 270 H95 M110 258 L95 270 L110 282" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            {signalFlow.map((s, i) => {
              const lit = i <= active;
              const isActive = i === active;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => jumpTo(i)}
                  aria-current={isActive ? 'step' : undefined}
                  aria-label={`${i + 1}. ${s.label}: ${s.title}`}
                  className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                  style={{ left: `${(NODES[i].x / VIEW_W) * 100}%`, top: `${(NODES[i].y / VIEW_H) * 100}%` }}
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 font-mono text-sm font-bold transition-all duration-300 lg:h-14 lg:w-14 ${
                      lit ? 'border-brand bg-brand text-ink shadow-[0_0_24px_color-mix(in_srgb,var(--color-brand)_55%,transparent)]' : 'border-white/25 bg-ink text-white/50 group-hover:border-white/60'
                    } ${isActive ? 'scale-110 ring-4 ring-brand/30' : ''}`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={`mt-2 font-mono text-[11px] uppercase tracking-[0.25em] transition-colors ${lit ? 'text-white' : 'text-white/40'}`}>
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Current stage */}
          <div key={stage.id} aria-live="polite" className="mx-auto mt-10 grid max-w-5xl animate-fade-in gap-6 border-t border-white/10 pt-8 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand">
                {String(active + 1).padStart(2, '0')} / {String(signalFlow.length).padStart(2, '0')} · {stage.label}
              </p>
              <h3 className="mt-2 text-3xl leading-tight">{stage.title}</h3>
            </div>
            <div className="md:col-span-7">
              <p className="text-white/70">{stage.body}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {stage.includes.map((item) => (
                  <li key={item} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
