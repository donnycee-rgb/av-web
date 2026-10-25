import type { Project } from '@/types';
import { categoryName } from '@/content/projects';
import { pages } from '@/content/pages';
import { Section } from '@/components/ui/Section';

interface ProjectInfoProps {
  project: Project;
}

/** The project's overview, with a small editor-style "clip info" panel. Roles appear in the credits. */
export function ProjectInfo({ project }: ProjectInfoProps) {
  const copy = pages.project;
  return (
    <Section sheet>
      <div className="grid gap-12 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-8">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-brand-dark">{copy.overview}</p>
          <p className="font-display text-2xl leading-snug sm:text-4xl">{project.overview}</p>
        </div>

        <aside className="md:col-span-4 md:pt-10">
          <div className="rounded-2xl border border-ink/10 bg-mist p-6">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{copy.clipInfo}</p>
            <dl className="divide-y divide-ink/10">
              <div className="flex justify-between gap-6 py-3">
                <dt className="text-sm text-muted">{copy.year}</dt>
                <dd className="font-semibold">{project.year}</dd>
              </div>
              <div className="flex justify-between gap-6 py-3">
                <dt className="text-sm text-muted">{copy.category}</dt>
                <dd className="font-semibold">{categoryName(project.categoryId)}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </Section>
  );
}
