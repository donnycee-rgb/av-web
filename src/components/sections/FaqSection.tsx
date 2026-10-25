import { useState } from 'react';
import { contact, faqs } from '@/content/contact';
import { Section } from '@/components/ui/Section';

/** Frequently asked questions as an accordion. */
export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section tone="mist" sheet>
      <div className="grid gap-10 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-4">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-brand-dark">{contact.faq.eyebrow}</p>
          <h2 className="text-4xl leading-tight sm:text-5xl">{contact.faq.title}</h2>
        </div>
        <ul className="md:col-span-8">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <li key={faq.question} className="border-b border-ink/10 first:border-t">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  className="group flex w-full items-center justify-between gap-6 py-5 text-left"
                >
                  <span className="font-display text-xl group-hover:text-brand-dark sm:text-2xl">{faq.question}</span>
                  <span
                    aria-hidden="true"
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink/15 text-lg transition-transform ${
                      isOpen ? 'rotate-45 bg-ink text-white' : ''
                    }`}
                  >
                    +
                  </span>
                </button>
                <div id={`faq-${i}`} className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] pb-6' : 'grid-rows-[0fr]'}`}>
                  <p className="overflow-hidden text-muted">{faq.answer}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
