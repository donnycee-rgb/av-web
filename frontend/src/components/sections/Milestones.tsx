import { milestones, milestonesCopy as copy } from '@/content/studio';
import { Section } from '@/components/ui/Section';

/** The studio's milestones as a horizontal timeline (stacks on phones). */
export function Milestones() {
  return (
    <Section sheet>
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-brand-dark">{copy.eyebrow}</p>
      <h2 className="text-4xl leading-tight sm:text-5xl">{copy.title}</h2>
      <ol className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
        {/* The line the milestones sit on (desktop) */}
        <span aria-hidden="true" className="absolute left-0 right-0 top-[11px] hidden h-0.5 bg-ink/10 lg:block" />
        {milestones.map((m, i) => (
          <li key={m.year} className="relative lg:pr-8">
            <span
              aria-hidden="true"
              className={`relative z-10 block h-6 w-6 rounded-full border-4 border-paper ${i === milestones.length - 1 ? 'bg-brand' : 'bg-ink'}`}
            />
            <p className="mt-5 font-display text-5xl">{m.year}</p>
            <p className="mt-2 text-muted">{m.title}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
