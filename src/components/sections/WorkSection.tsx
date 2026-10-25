import { useEffect, useRef, useState } from 'react';
import { home } from '@/content/home';
import { categoryName, featuredProjects } from '@/content/projects';
import { cursorLabels } from '@/content/site';
import { useInView } from '@/hooks/useInView';
import { useTimecode } from '@/hooks/useTimecode';
import { Link } from '@/components/ui/TransitionLink';
import { StackPanel } from '@/components/ui/StackPanel';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

/** How long a project stays on program before the mixer cuts to the next (a visitor's pick restarts the count) */
const CUT_EVERY_MS = 5000;

/**
 * Selected work as a vision mixer's multiview: one big PROGRAM monitor and a column of camera
 * previews. Hovering (or tapping) a preview cuts it to program — a hard cut with a flash — and its
 * tally light turns red. Left alone, the mixer cuts through the projects on its own.
 */
export function WorkSection() {
  const { work } = home;
  const copy = work.mixer;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, 0.4);
  const [active, setActive] = useState(0);
  const project = featuredProjects[active];
  // Each project gets its own spot on the timeline, so the program timecode jumps on every cut
  const timecode = useTimecode(3600 + active * 754, inView);

  useEffect(() => {
    if (!inView) return;
    const timer = window.setTimeout(() => setActive((i) => (i + 1) % featuredProjects.length), CUT_EVERY_MS);
    return () => window.clearTimeout(timer);
  }, [active, inView]);

  return (
    <StackPanel tone="dark" label="Selected work">
      <Container className="flex h-full flex-col justify-center gap-8 pb-10 pt-24">
        <SectionHeading eyebrow={work.eyebrow} title={work.title} link={work.link} onDark />

        <div ref={ref} role="group" aria-label={copy.label} className="flex flex-col gap-3 md:h-[min(52svh,460px)] md:flex-row">
          {/* Program monitor */}
          <Link
            to={`/work/${project.slug}`}
            data-cursor={cursorLabels.view}
            aria-live="polite"
            className="group relative block aspect-[4/3] overflow-hidden rounded-xl bg-black ring-2 ring-brand/80 md:aspect-auto md:flex-1"
          >
            {/* Keyed on the project: a hard cut, with a flash over it */}
            <div key={project.slug} className="absolute inset-0">
              <img src={project.image} alt="" className="h-full w-full object-cover transition-transform duration-[6000ms] ease-out group-hover:scale-105" />
              {/* Invisible at rest; only the animation brings it up, so if it can't run the picture still shows */}
              <div aria-hidden="true" className="absolute inset-0 animate-[cut-flash_260ms_ease-out] bg-white opacity-0" />
            </div>
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/40" />

            {/* Monitor overlays */}
            <div className="absolute inset-x-4 top-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-white sm:text-[11px]">
              <span className="flex items-center gap-2 rounded bg-brand px-2 py-1 font-semibold text-ink">
                <span className="h-1.5 w-1.5 animate-rec rounded-full bg-ink" />
                {copy.program}
              </span>
              <span className="tabular-nums text-white/80">{timecode}</span>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
                {categoryName(project.categoryId)} · {project.year}
              </p>
              <h3 className="mt-1.5 text-3xl leading-tight text-white sm:text-4xl">{project.title}</h3>
              <p className="mt-2 hidden max-w-lg text-white/75 sm:block">{project.summary}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:text-brand">
                {copy.view}
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </div>
          </Link>

          {/* Camera previews: a row on phones, a column beside program on desktop */}
          <ul className="grid grid-cols-4 gap-2 md:flex md:w-[min(30%,15rem)] md:flex-col md:gap-3">
            {featuredProjects.map((p, i) => {
              const live = i === active;
              return (
                <li key={p.slug} className="md:min-h-0 md:flex-1">
                  <button
                    type="button"
                    aria-pressed={live}
                    aria-label={`${p.title} — ${categoryName(p.categoryId)}`}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className={`relative block aspect-video h-full w-full overflow-hidden rounded-lg bg-black outline-none ring-2 transition-[box-shadow,opacity] duration-300 focus-visible:ring-brand md:aspect-auto ${
                      live ? 'ring-brand' : 'opacity-70 ring-white/10 hover:opacity-100'
                    }`}
                  >
                    <img src={p.image} alt="" loading="lazy" className="h-full w-full object-cover" />
                    {/* Tally light: lit when this camera is on program */}
                    <span
                      aria-hidden="true"
                      className={`absolute right-1.5 top-1.5 h-2 w-2 rounded-full transition-colors duration-200 ${live ? 'bg-brand shadow-[0_0_8px_rgba(245,138,7,0.9)]' : 'bg-white/30'}`}
                    />
                    <span className="absolute inset-x-0 bottom-0 hidden truncate bg-gradient-to-t from-black/90 to-transparent px-2 pb-1.5 pt-4 text-left font-mono text-[9px] uppercase tracking-[0.15em] text-white/85 sm:block">
                      {copy.camera} {i + 1} · {categoryName(p.categoryId)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </StackPanel>
  );
}
