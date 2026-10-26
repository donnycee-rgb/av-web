import { home } from '@/content/home';
import { site } from '@/content/site';
import { StackPanel } from '@/components/ui/StackPanel';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export function CtaSection() {
  const { cta } = home;
  return (
    <StackPanel tone="brand" label="Get in touch">
      <Container className="flex h-full flex-col items-start justify-center pb-10 pt-24">
        <h2 className="max-w-4xl text-6xl leading-[0.98] sm:text-8xl lg:text-9xl">{cta.title}</h2>
        <p className="mt-8 max-w-md text-lg text-ink/80">{cta.body}</p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Button to={cta.primary.to} variant="dark" className="!px-8 !py-4">
            {cta.primary.label}
          </Button>
          <a href={`mailto:${site.email}`} className="font-semibold underline-offset-4 hover:underline">
            {site.email}
          </a>
        </div>
      </Container>
    </StackPanel>
  );
}
