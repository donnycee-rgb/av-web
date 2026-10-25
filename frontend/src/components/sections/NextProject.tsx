import { useRef } from 'react';
import { Link } from '@/components/ui/TransitionLink';
import type { Project } from '@/types';
import { categoryName } from '@/content/projects';
import { pages } from '@/content/pages';
import { useInView } from '@/hooks/useInView';
import { Container } from '@/components/ui/Container';
import { CountdownLeader } from '@/components/media/CountdownLeader';

interface NextProjectProps {
  project: Project;
}

/** "Next clip": a countdown leader (3 … 2 … 1 ▶) beside the next project's title. */
export function NextProject({ project }: NextProjectProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const inView = useInView(ref, 0.5);

  return (
    <Link ref={ref} to={`/work/${project.slug}`} className="group relative block overflow-hidden bg-film text-white">
      <img
        src={project.image}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-25 grayscale transition-all duration-700 group-hover:opacity-45 group-hover:grayscale-0"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-film via-film/70 to-transparent" />

      <Container className="relative flex min-h-[70svh] flex-col items-start justify-center gap-10 py-24 md:flex-row md:items-center md:gap-16">
        <CountdownLeader start={inView} className="w-40 shrink-0 sm:w-56" />
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand">{pages.project.next} →</p>
          <h2 className="mt-4 max-w-3xl text-5xl leading-[1.02] transition-transform duration-500 group-hover:translate-x-2 sm:text-7xl">
            {project.title}
          </h2>
          <p className="mt-4 text-white/70">
            {categoryName(project.categoryId)} · {project.year}
          </p>
        </div>
      </Container>
    </Link>
  );
}
