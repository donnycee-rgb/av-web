import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import filmMarkup from '@/assets/illustrations/film-branch.svg?raw';
import { reelFlow, reelFlowCopy as copy } from '@/content/studio';
import { FILM_FRAMES, FILM_ICONS, FILM_VIEWBOX, frameMatrix, iconTransform } from '@/lib/filmFrames';
import { useInView } from '@/hooks/useInView';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Container } from '@/components/ui/Container';
import type { FlowStage } from '@/types';

// The strip's inner markup (without its outer <svg>), so it can sit in our own SVG
const STRIP_INNER = filmMarkup.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const VIEWBOX = `0 0 ${FILM_VIEWBOX.width} ${FILM_VIEWBOX.height}`;
const ICON_SIZE = 9;
/** After the last frame comes the master */
const MASTER = reelFlow.length;
/** How long the projector holds each frame when the reel runs by itself */
const HOLD_MS = 3200;

type Branch = Exclude<FlowStage['branch'], 'shared'>;
const BRANCHES: Branch[] = ['picture', 'sound'];
const inBranch = (branch: Branch) => reelFlow.map((s, i) => (s.branch === branch ? i : -1)).filter((i) => i >= 0);

/** Phones: the stages as a list. */
function ReelList() {
  return (
    <ol className="space-y-10">
      {reelFlow.map((stage, i) => (
        <li key={stage.id} className="grid grid-cols-[2.5rem_1fr] gap-4">
          <svg viewBox="0 0 24 24" className="h-10 w-10 text-brand" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={FILM_ICONS[i]} />
          </svg>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand">
              {String(i + 1).padStart(2, '0')} · {copy.branches[stage.branch]}
            </p>
            <h3 className="mt-1 text-2xl">{stage.title}</h3>
            <p className="mt-2 text-white/70">{stage.body}</p>
          </div>
        </li>
      ))}
      <li className="grid grid-cols-[2.5rem_1fr] gap-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand font-mono text-xs font-bold text-ink">▶</span>
        <div>
          <h3 className="text-2xl">{copy.end.label}</h3>
          <p className="mt-2 text-white/70">{copy.end.body}</p>
        </div>
      </li>
    </ol>
  );
}

/**
 * The studio's process as a branching film strip in a screening room. Pick a frame and light passes
 * through it, throwing it big onto the screen beside the strip. At the split, a switch chooses which
 * craft lights up — picture or sound. When the section comes into view the reel runs once by itself
 * (idea → story → shoot → picture → sound → master), until the visitor takes over.
 */
export function FilmFlow() {
  const sectionRef = useRef<HTMLElement>(null);
  const roomRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<(SVGGElement | null)[]>([]);

  const [step, setStep] = useState(0);
  const [branch, setBranch] = useState<Branch>('picture');
  const [playing, setPlaying] = useState(false);
  const [beam, setBeam] = useState<string | null>(null);

  const reduced = useReducedMotion();
  const inView = useInView(sectionRef, 0.5);
  const isMaster = step === MASTER;

  // Tag the strip's three branches (trunk, upper, lower) so CSS can dim the one not chosen
  useEffect(() => {
    const root = stripRef.current?.querySelector('svg > g');
    ['reel-shared', 'reel-picture', 'reel-sound'].forEach((name, i) => root?.children[i]?.classList.add(name));
  }, []);

  // Run the reel once, by itself, the first time the section is properly in view
  useEffect(() => {
    if (inView && !reduced) setPlaying(true);
  }, [inView, reduced]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      const next = step + 1;
      show(next);
      if (next === MASTER) setPlaying(false);
    }, HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [playing, step]);

  // The beam: from the projected frame to the screen's face (or from the reel's end, for the master)
  useLayoutEffect(() => {
    const measure = () => {
      const room = roomRef.current?.getBoundingClientRect();
      const screen = screenRef.current?.getBoundingClientRect();
      const source = isMaster ? stripRef.current?.getBoundingClientRect() : frameRefs.current[step]?.getBoundingClientRect();
      if (!room || !screen || !source || source.width === 0) return setBeam(null);
      const sx = (isMaster ? source.right - source.width * 0.12 : source.left + source.width / 2) - room.left;
      const sy = source.top + source.height / 2 - room.top;
      const spread = isMaster ? 22 : 3;
      const x = screen.left - room.left;
      const top = screen.top - room.top + 6;
      const bottom = screen.bottom - room.top - 6;
      setBeam(`polygon(${sx}px ${sy - spread}px, ${x}px ${top}px, ${x}px ${bottom}px, ${sx}px ${sy + spread}px)`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (roomRef.current) observer.observe(roomRef.current);
    return () => observer.disconnect();
  }, [step, isMaster]);

  const show = (i: number) => {
    setStep(i);
    const stage = reelFlow[i];
    if (stage && stage.branch !== 'shared') setBranch(stage.branch);
  };

  // Any choice by the visitor stops the reel running by itself
  const select = (i: number) => {
    setPlaying(false);
    show(i);
  };

  // Flip the switch: if a frame from the other craft is on screen, swap to its counterpart
  const flip = (to: Branch) => {
    setPlaying(false);
    setBranch(to);
    const current = reelFlow[step];
    if (isMaster) setStep(inBranch(to)[0]);
    else if (current.branch !== 'shared' && current.branch !== to) {
      const position = inBranch(current.branch).indexOf(step);
      setStep(inBranch(to)[position] ?? inBranch(to)[0]);
    }
  };

  const togglePlay = () => {
    if (playing) return setPlaying(false);
    if (isMaster) show(0);
    setPlaying(true);
  };

  const onFrameKey = (i: number) => (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      select(i);
    }
  };

  const stage = reelFlow[step];
  const heading = (
    <div className="max-w-xl">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand">{copy.eyebrow}</p>
      <h2 className="text-4xl leading-tight xl:text-5xl">{copy.title}</h2>
      <p className="mt-3 text-white/60">{copy.intro}</p>
    </div>
  );

  return (
    <section ref={sectionRef} className="spotlight relative overflow-hidden bg-ink text-white md:pb-28 md:pt-16">
      {/* Phones: list */}
      <Container className="py-24 md:hidden">
        <div className="mb-10">{heading}</div>
        <ReelList />
      </Container>

      {/* Desktop: the screening room */}
      <Container className="hidden md:block">
        <div ref={roomRef} className="relative grid grid-cols-12 items-center gap-x-10 gap-y-6">
          {/* The light from the frame to the screen */}
          {beam && (
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 z-10 mix-blend-screen ${playing ? 'projector-beam' : ''}`}
              style={{
                clipPath: beam,
                background: 'linear-gradient(90deg, rgba(255,226,180,0) 0%, rgba(255,226,180,0.06) 45%, rgba(255,226,180,0.13) 100%)',
                transition: 'clip-path 0.9s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            />
          )}

          <div className="col-span-7 self-start">{heading}</div>

          {/* The screen */}
          <div className="col-span-5 row-span-2 self-center">
            <div
              ref={screenRef}
              aria-live="polite"
              className="relative flex aspect-[4/3.4] flex-col overflow-hidden rounded-sm border border-white/10 bg-[radial-gradient(ellipse_at_30%_40%,rgba(255,226,180,0.10),rgba(255,255,255,0.02)_70%)] p-7 shadow-[0_0_80px_-20px_rgba(255,226,180,0.25)]"
            >
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                <span className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full bg-brand ${playing ? 'animate-rec' : ''}`} />
                  {isMaster ? copy.end.label : copy.branches[stage.branch]}
                </span>
                <span>FR {String((step + 1) * 24).padStart(4, '0')}</span>
              </div>

              <div key={step} className="projector-in flex flex-1 flex-col justify-center">
                {isMaster ? (
                  <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand text-2xl text-ink">▶</span>
                ) : (
                  <svg viewBox="0 0 24 24" className="mb-5 h-16 w-16" fill="none" stroke="var(--color-brand)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={FILM_ICONS[step]} pathLength={1} className="trace-in" />
                  </svg>
                )}
                <h3 className="text-3xl leading-tight lg:text-4xl">{isMaster ? copy.end.label : stage.title}</h3>
                <p className="mt-3 text-white/70">{isMaster ? copy.end.body : stage.body}</p>
                {!isMaster && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {stage.includes.map((item) => (
                      <li key={item} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">{copy.hint}</p>
            </div>
          </div>

          {/* The strip */}
          <div className="col-span-7 self-end">
            <div
              ref={stripRef}
              data-branch={isMaster ? undefined : branch}
              className="reel-stage relative"
              style={{ width: `min(100%, calc((100svh - 415px) * ${FILM_VIEWBOX.width / FILM_VIEWBOX.height}))`, aspectRatio: `${FILM_VIEWBOX.width} / ${FILM_VIEWBOX.height}` } as CSSProperties}
            >
              <svg viewBox={VIEWBOX} fillRule="evenodd" className="absolute inset-0 h-full w-full" aria-hidden="true" dangerouslySetInnerHTML={{ __html: STRIP_INNER }} />

              <svg viewBox={VIEWBOX} className="absolute inset-0 h-full w-full overflow-visible" role="group" aria-label={copy.title}>
                {FILM_FRAMES.map((frame, i) => {
                  const lit = i === step || isMaster;
                  return (
                    <g key={reelFlow[i].id} transform={frameMatrix(frame)} data-frame-branch={reelFlow[i].branch}>
                      <g
                        ref={(el) => {
                          frameRefs.current[i] = el;
                        }}
                        transform={iconTransform(frame, ICON_SIZE)}
                        role="button"
                        tabIndex={0}
                        aria-label={`${reelFlow[i].label}: ${reelFlow[i].title}`}
                        aria-pressed={i === step}
                        onClick={() => select(i)}
                        onKeyDown={onFrameKey(i)}
                        className="group cursor-pointer outline-none"
                      >
                        <rect x={-6} y={-4} width={36} height={44} fill="transparent" />
                        <path
                          d={FILM_ICONS[i]}
                          fill="none"
                          stroke="var(--color-brand)"
                          strokeWidth={1.6}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="transition-[opacity,filter] duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
                          style={{
                            opacity: lit ? 1 : 0.5,
                            filter: lit ? 'drop-shadow(0 0 2.5px rgba(255,190,110,0.9))' : 'none',
                          }}
                        />
                        <text
                          x={12}
                          y={35}
                          textAnchor="middle"
                          className="font-mono uppercase transition-[fill] duration-500"
                          fontSize={6}
                          letterSpacing={0.6}
                          fill={i === step ? 'var(--color-brand)' : 'var(--color-paper)'}
                        >
                          {reelFlow[i].label}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* The switch at the split, and the projector's run button */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div role="radiogroup" aria-label="At the split" className="relative inline-flex rounded-full border border-white/15 p-1">
                <span
                  aria-hidden="true"
                  className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-brand transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ transform: `translateX(${branch === 'sound' ? '100%' : '0'})` }}
                />
                {BRANCHES.map((b) => (
                  <button
                    key={b}
                    type="button"
                    role="radio"
                    aria-checked={branch === b}
                    onClick={() => flip(b)}
                    className={`relative z-10 w-28 rounded-full py-2 text-sm font-semibold transition-colors duration-500 ${branch === b ? 'text-ink' : 'text-white/60 hover:text-white'}`}
                  >
                    {copy.branches[b]}
                  </button>
                ))}
              </div>

              <button type="button" onClick={togglePlay} className="group inline-flex items-center gap-3 text-sm font-semibold text-white/80 hover:text-white">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-xs transition-colors group-hover:border-brand group-hover:text-brand">
                  {playing ? '❚❚' : '▶'}
                </span>
                {playing ? copy.pause : isMaster ? copy.replay : copy.play}
              </button>

            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
