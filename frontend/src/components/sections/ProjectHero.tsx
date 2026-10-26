import { useRef } from 'react';
import { Link } from '@/components/ui/TransitionLink';
import type { Project } from '@/types';
import { categories, categoryName } from '@/content/projects';
import { pages } from '@/content/pages';
import { buildTracks } from '@/lib/timeline';
import { useTimecode } from '@/hooks/useTimecode';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { Container } from '@/components/ui/Container';
import { Sprockets } from '@/components/media/Sprockets';

const tracks = buildTracks(categories);

interface ProjectHeroProps {
  project: Project;
}

/**
 * Full-screen frame of the project. As you scroll, it pulls back into a single frame of film:
 * the picture shrinks, sprocket holes appear above and below, and the title card fades away.
 */
export function ProjectHero({ project }: ProjectHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useScrollProgress(ref);
  const timecode = useTimecode(0);
  const track = tracks.find((t) => t.category.id === project.categoryId);

  return (
    // Extra height = scroll distance for the pull-back
    <section ref={ref} className={`relative bg-black text-white ${reduced ? 'h-svh' : 'h-[185svh]'}`}>
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
        {/* The frame: shrinks and gains film edges as --p goes 0 → 1 */}
        <div
          className="absolute inset-0 flex origin-center flex-col overflow-hidden bg-film"
          style={{
            transform: 'scale(calc(1 - var(--p, 0) * 0.3))',
            borderRadius: 'calc(var(--p, 0) * 18px)',
          }}
        >
          <div className="flex shrink-0 items-center overflow-hidden" style={{ height: 'calc(var(--p, 0) * 2.75rem)', opacity: 'var(--p, 0)' }}>
            <Sprockets />
          </div>
          <div className="relative min-h-0 flex-1 overflow-hidden">
            <img key={project.slug} src={project.image} alt={project.title} className="h-full w-full animate-kenburns object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/50" />
          </div>
          <div className="relative flex shrink-0 items-center overflow-hidden" style={{ height: 'calc(var(--p, 0) * 2.75rem)', opacity: 'var(--p, 0)' }}>
            <Sprockets />
            <span className="absolute left-6 font-mono text-[10px] tracking-[0.3em] text-brand">AV 400 ▶ 1A</span>
          </div>
        </div>

        {/* Top bar stays put */}
        <Container className="absolute inset-x-0 top-0 pt-28">
          <div className="flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.2em]">
            <Link to="/work" className="text-white/80 hover:text-brand">
              ← {pages.project.back}
            </Link>
            <span className="flex items-center gap-2 text-white/70 tabular-nums" aria-hidden="true">
              <span className="h-1.5 w-1.5 animate-rec rounded-full bg-red-500" />
              {track?.code} · {timecode}
            </span>
          </div>
        </Container>

        {/* Title card fades out as the frame pulls back */}
        <div
          className="absolute inset-x-0 bottom-0 pb-14 sm:pb-16"
          style={{ opacity: 'calc(1 - var(--p, 0) * 2.4)', transform: 'translateY(calc(var(--p, 0) * -48px))' }}
        >
          <Container>
            <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand">
              {categoryName(project.categoryId)}
              <span aria-hidden="true" className="h-px w-8 bg-white/30" />
              <span className="text-white/70">{project.year}</span>
            </p>
            <h1 className="max-w-4xl text-5xl leading-[1.02] sm:text-7xl lg:text-8xl">{project.title}</h1>
            <p className="mt-6 max-w-xl text-lg text-white/75">{project.summary}</p>
          </Container>
        </div>
      </div>
    </section>
  );
}
