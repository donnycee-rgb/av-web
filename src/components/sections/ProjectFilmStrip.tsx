import { useRef, type CSSProperties } from 'react';
import type { Project } from '@/types';
import { pages } from '@/content/pages';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { Sprockets } from '@/components/media/Sprockets';

interface ProjectFilmStripProps {
  project: Project;
}

/**
 * The project's frames as one strip of film. The screen pins while you scroll down,
 * and the strip slides sideways past it. With reduced motion it becomes a normal swipeable row.
 */
export function ProjectFilmStrip({ project }: ProjectFilmStripProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useScrollProgress(ref);
  const frames = [project.image, ...project.stills];

  // Scroll distance grows with the number of frames
  const sectionStyle: CSSProperties = reduced ? {} : { height: `calc(100svh + ${frames.length * 55}svh)` };

  return (
    <section ref={ref} className="spotlight relative bg-ink text-white" style={sectionStyle} aria-label={pages.project.stills}>
      <div
        className={`flex flex-col justify-center overflow-hidden ${reduced ? 'py-20' : 'sticky top-0 h-svh'}`}
        style={{ containerType: 'inline-size' }}
      >
        <div className="mb-8 flex items-baseline justify-between gap-4 px-4 sm:px-6 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">{pages.project.stills}</p>
          <p className="font-mono text-[11px] tracking-[0.2em] text-white/40">
            {String(frames.length).padStart(2, '0')} FRAMES
          </p>
        </div>

        <div className={reduced ? 'overflow-x-auto' : ''}>
          {/* 100cqw = the visible width; the strip moves left by its overflow as --p goes 0 → 1 */}
          <div
            className="flex w-max bg-film py-1 pl-[6vw] pr-[6vw] will-change-transform"
            style={reduced ? undefined : { transform: 'translateX(calc((100cqw - 100%) * var(--p, 0)))' }}
          >
            {frames.map((src, i) => (
              <figure key={src} className="flex shrink-0 flex-col border-r-[14px] border-film last:border-r-0">
                <Sprockets />
                <img
                  src={src}
                  alt={`${project.title} — frame ${i + 1}`}
                  // Eager: the strip is moved with transforms, so lazy-loading wouldn't see frames coming into view
                  loading="eager"
                  className="my-2 aspect-[3/2] h-[38svh] w-auto rounded-sm object-cover sm:h-[52svh]"
                />
                <div className="relative">
                  <Sprockets />
                  <figcaption className="absolute -bottom-6 left-0 font-mono text-[10px] tracking-[0.3em] text-brand">
                    AV 400 ▶ {i + 1}A
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
