import { pages } from '@/content/pages';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { PageIntro } from '@/components/sections/PageIntro';
import { SignalFlow } from '@/components/sections/SignalFlow';
import { Milestones } from '@/components/sections/Milestones';
import { ClosingCta } from '@/components/sections/ClosingCta';

/** Studio: the process as a signal-flow diagram, then milestones. */
export function StudioPage() {
  const { eyebrow, title, intro, mark } = pages.studio;
  useDocumentTitle('Studio');
  return (
    <>
      <PageIntro eyebrow={eyebrow} title={title} intro={intro} mark={mark} />
      <SignalFlow />
      <Milestones />
      <ClosingCta />
    </>
  );
}
