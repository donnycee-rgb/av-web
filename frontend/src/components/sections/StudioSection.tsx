import { home } from '@/content/home';
import { milestones } from '@/content/studio';
import { placeholder, PLACEHOLDER_IDS } from '@/lib/images';
import { StackPanel } from '@/components/ui/StackPanel';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function StudioSection() {
  const { studio } = home;
  return (
    <StackPanel tone="light" label="The studio">
      <Container className="grid h-full items-center gap-10 pb-10 pt-24 md:grid-cols-2 md:gap-16">
        <div>
          <SectionHeading eyebrow={studio.eyebrow} title={studio.title} body={studio.body} link={studio.link} />
          <ol className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
            {milestones.map((m) => (
              <li key={m.year} className="border-t-2 border-brand pt-3">
                <span className="block font-display text-2xl">{m.year}</span>
                <span className="mt-1 block text-sm text-muted">{m.title}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Two overlapping stills */}
        <div className="relative hidden h-[60vh] max-h-[520px] md:block">
          <img
            src={placeholder(PLACEHOLDER_IDS.filmSet, 1200)}
            alt="On set with the crew"
            loading="lazy"
            className="absolute right-0 top-0 h-[78%] w-[78%] rounded-2xl object-cover"
          />
          <img
            src={placeholder(PLACEHOLDER_IDS.studio, 900)}
            alt="In the sound studio"
            loading="lazy"
            className="absolute bottom-0 left-0 h-[52%] w-[52%] rounded-2xl border-8 border-paper object-cover"
          />
        </div>
      </Container>
    </StackPanel>
  );
}
