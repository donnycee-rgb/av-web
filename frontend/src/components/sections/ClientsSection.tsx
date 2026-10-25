import { home } from '@/content/home';
import { clients, testimonials } from '@/content/studio';
import { useCycle } from '@/hooks/useCycle';
import { StackPanel } from '@/components/ui/StackPanel';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function ClientsSection() {
  const { clients: copy } = home;
  const active = useCycle(testimonials.length, 6000);
  const quote = testimonials[active];

  return (
    <StackPanel tone="light" label="Clients">
      <Container className="flex h-full flex-col justify-center gap-10 pb-10 pt-24 sm:gap-14">
        <SectionHeading eyebrow={copy.eyebrow} title={copy.title} />

        {/* Logo grid — names stand in until real logo files arrive */}
        <ul className="grid grid-cols-2 border-l border-t border-ink/10 sm:grid-cols-3 lg:grid-cols-5">
          {clients.map((client) => (
            <li key={client.name} className="flex h-14 items-center justify-center border-b border-r border-ink/10 px-3 sm:h-20">
              {client.logo ? (
                <img src={client.logo} alt={client.name} className="max-h-10 w-auto opacity-60 grayscale" />
              ) : (
                <span className="text-center font-display text-sm text-ink/55 sm:text-base">{client.name}</span>
              )}
            </li>
          ))}
        </ul>

        <figure className="max-w-3xl" aria-live="polite">
          <blockquote key={active} className="animate-fade-in font-display text-2xl italic leading-snug sm:text-3xl">
            “{quote.quote}”
          </blockquote>
          <figcaption className="mt-4 flex items-center gap-3 text-sm text-muted">
            <span className="font-semibold text-ink">{quote.name}</span>
            <span aria-hidden="true">·</span>
            <span>{quote.role}</span>
          </figcaption>
        </figure>
      </Container>
    </StackPanel>
  );
}
