import { home } from '@/content/home';
import { featuredProjects } from '@/content/projects';
import { StackPanel } from '@/components/ui/StackPanel';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProjectCard } from '@/components/media/ProjectCard';

export function WorkSection() {
  const { work } = home;
  return (
    <StackPanel tone="dark" label="Selected work">
      <Container className="flex h-full flex-col justify-center gap-10 pb-10 pt-24">
        <SectionHeading eyebrow={work.eyebrow} title={work.title} link={work.link} onDark />
        {/* Swipeable row on phones, four columns on desktop */}
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0 md:grid md:grid-cols-4 md:overflow-visible [&::-webkit-scrollbar]:hidden">
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              className="h-[min(48vh,440px)] w-[72vw] shrink-0 snap-start sm:w-[44vw] md:w-auto"
            />
          ))}
        </div>
      </Container>
    </StackPanel>
  );
}
