import { pages } from '@/content/pages';
import { PageIntro } from '@/components/sections/PageIntro';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  const { eyebrow, title, intro } = pages.notFound;
  return (
    <PageIntro eyebrow={eyebrow} title={title} intro={intro}>
      <Button to="/">Back to home</Button>
    </PageIntro>
  );
}
