import { home } from '@/content/home';
import { placeholder, PLACEHOLDER_IDS } from '@/lib/images';
import { StackPanel } from '@/components/ui/StackPanel';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SplitFrame } from '@/components/media/SplitFrame';

/** The studio in one idea: a frame you split between its picture and its sound. */
export function StudioSection() {
  const { studio } = home;
  return (
    <StackPanel tone="light" label="The studio">
      <Container className="grid h-full items-center gap-10 pb-10 pt-24 md:grid-cols-12 md:gap-12">
        <SectionHeading
          eyebrow={studio.eyebrow}
          title={studio.title}
          mark={studio.mark}
          body={studio.body}
          link={studio.link}
          className="md:col-span-5"
        />

        <SplitFrame
          src={placeholder(PLACEHOLDER_IDS.filmSet, 1400)}
          alt="On set with the crew"
          labels={studio.split}
          className="aspect-[4/3] w-full md:col-span-7 md:max-h-[64svh] md:aspect-auto md:h-[64svh]"
        />
      </Container>
    </StackPanel>
  );
}
