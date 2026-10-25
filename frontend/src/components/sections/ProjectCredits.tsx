import { useRef } from 'react';
import type { Project } from '@/types';
import { site } from '@/content/site';
import { pages } from '@/content/pages';
import { useInView } from '@/hooks/useInView';
import { Container } from '@/components/ui/Container';

interface ProjectCreditsProps {
  project: Project;
}

/** End credits: each of the studio's roles on the project, rising into place line by line. */
export function ProjectCredits({ project }: ProjectCreditsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, 0.25);

  return (
    <section className="bg-black py-24 text-white sm:py-32">
      <Container>
        <div ref={ref} className="mx-auto max-w-xl text-center">
          <p className="mb-12 font-mono text-[11px] uppercase tracking-[0.35em] text-white/40">{pages.project.credits}</p>
          <p className="font-display text-3xl sm:text-4xl">{project.title}</p>
          <dl className="mt-12 space-y-5">
            {project.role.map((role, i) => (
              <div
                key={role}
                className="flex items-baseline gap-3 text-sm transition-all duration-700 ease-out sm:text-base"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(24px)',
                  transitionDelay: `${200 + i * 160}ms`,
                }}
              >
                <dt className="shrink-0 uppercase tracking-[0.2em] text-white/60">{role}</dt>
                <span aria-hidden="true" className="flex-1 border-b border-dotted border-white/25" />
                <dd className="shrink-0 font-semibold">{site.name}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
