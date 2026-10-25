import { home } from '@/content/home';
import { site } from '@/content/site';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';

/** Orange closing block for inner pages (the homepage uses the stacking CtaSection). */
export function ClosingCta() {
  const { cta } = home;
  return (
    <Section tone="brand" sheet>
      <div className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="max-w-3xl text-5xl leading-[1.02] sm:text-7xl">{cta.title}</h2>
          <p className="mt-5 max-w-md text-lg text-ink/80">{cta.body}</p>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <Button to={cta.primary.to} variant="dark" className="!px-8 !py-4">
            {cta.primary.label}
          </Button>
          <a href={`mailto:${site.email}`} className="font-semibold underline-offset-4 hover:underline">
            {site.email}
          </a>
        </div>
      </div>
    </Section>
  );
}
