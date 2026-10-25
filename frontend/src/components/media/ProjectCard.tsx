import { Link } from '@/components/ui/TransitionLink';
import type { Project } from '@/types';
import { categoryName } from '@/content/projects';

interface ProjectCardProps {
  project: Project;
  className?: string;
}

/** Portrait project card: still, category and title, linking to the project page. */
export function ProjectCard({ project, className = '' }: ProjectCardProps) {
  return (
    <Link
      to={`/work/${project.slug}`}
      className={`group relative block overflow-hidden rounded-2xl bg-ink-soft ${className}`}
    >
      <img
        src={project.image}
        alt={project.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">{categoryName(project.categoryId)}</p>
        <h3 className="mt-1.5 text-2xl leading-tight text-white">{project.title}</h3>
        <p className="mt-2 max-h-0 overflow-hidden text-sm text-white/75 opacity-0 transition-all duration-300 group-hover:max-h-16 group-hover:opacity-100">
          {project.summary}
        </p>
      </div>
    </Link>
  );
}
