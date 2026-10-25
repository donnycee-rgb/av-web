import { useState } from 'react';
import { home } from '@/content/home';
import { services } from '@/content/studio';
import { StackPanel } from '@/components/ui/StackPanel';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function ServicesSection() {
  const { services: copy } = home;
  const [open, setOpen] = useState<string | null>(services[0].id);

  return (
    <StackPanel tone="mist" label="Services">
      <Container className="grid h-full items-center gap-10 pb-10 pt-24 md:grid-cols-12 md:gap-16">
        <SectionHeading eyebrow={copy.eyebrow} title={copy.title} link={copy.link} className="md:col-span-5" />

        <ul className="md:col-span-7">
          {services.map((service, i) => {
            const isOpen = open === service.id;
            return (
              <li key={service.id} className="border-b border-ink/10 first:border-t">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : service.id)}
                  aria-expanded={isOpen}
                  aria-controls={`service-${service.id}`}
                  className="group flex w-full items-center gap-5 py-4 text-left sm:py-5"
                >
                  <span className="text-xs font-semibold tabular-nums text-brand-dark">{String(i + 1).padStart(2, '0')}</span>
                  <span className="flex-1 font-display text-xl group-hover:text-brand-dark sm:text-2xl">{service.title}</span>
                  <span
                    aria-hidden="true"
                    className={`flex h-8 w-8 items-center justify-center rounded-full border border-ink/15 text-lg transition-transform ${
                      isOpen ? 'rotate-45 bg-ink text-white' : ''
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  id={`service-${service.id}`}
                  className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] pb-5' : 'grid-rows-[0fr]'}`}
                >
                  <div className="overflow-hidden pl-10">
                    <p className="text-muted">{service.summary}</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {service.includes.map((item) => (
                        <li key={item} className="rounded-full bg-white px-3 py-1 text-xs font-medium">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </StackPanel>
  );
}
