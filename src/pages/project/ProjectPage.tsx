import { Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { findProject, nextProject } from '@/content/projects';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { ProjectHero } from '@/components/sections/ProjectHero';
import { ProjectInfo } from '@/components/sections/ProjectInfo';
import { ProjectFilmStrip } from '@/components/sections/ProjectFilmStrip';
import { ProjectCredits } from '@/components/sections/ProjectCredits';
import { NextProject } from '@/components/sections/NextProject';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { NotFoundPage } from '@/pages/not-found/NotFoundPage';

/**
 * A single project, played like a reel: the hero pulls back into a film frame, the stills
 * run past as a strip of film, credits roll, and a countdown leads into the next project.
 */
export function ProjectPage() {
  const { slug = '' } = useParams();
  const project = findProject(slug);
  useDocumentTitle(project?.title ?? 'Not found');

  if (!project) return <NotFoundPage />;

  return (
    // Keyed on the project so moving to the next one resets every animation (countdown, scroll effects)
    <Fragment key={project.slug}>
      <ProjectHero project={project} />
      <ProjectInfo project={project} />
      <ProjectFilmStrip project={project} />
      <ProjectCredits project={project} />
      <NextProject project={nextProject(project.slug)} />
      <ClosingCta />
    </Fragment>
  );
}
