import { pages } from '@/content/pages';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { PageIntro } from '@/components/sections/PageIntro';
import { BalanceScale } from '@/components/media/BalanceScale';
import { ServicesFocus } from '@/components/sections/ServicesFocus';
import { FilmFlow } from '@/components/sections/FilmFlow';
import { Milestones } from '@/components/sections/Milestones';
import { ClosingCta } from '@/components/sections/ClosingCta';

/** Studio: who we are, what we do (services), how we work (the process), then milestones. */
export function StudioPage() {
  const { eyebrow, title, intro, mark } = pages.studio;
  useDocumentTitle('Studio');
  return (
    <>
      <PageIntro
        eyebrow={eyebrow}
        title={title}
        intro={intro}
        mark={mark}
        art={<BalanceScale className="mx-auto w-full max-w-[17rem] sm:max-w-sm lg:max-w-md" />}
      />
      <ServicesFocus />
      <FilmFlow />
      <Milestones />
      <ClosingCta />
    </>
  );
}
