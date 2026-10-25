import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { withMark, type Mark } from '@/components/ui/DirectorMark';

interface PageIntroProps {
  eyebrow: string;
  title: string;
  intro?: string;
  /** Optional hand-drawn mark on one word of the title */
  mark?: Mark;
  children?: ReactNode;
}

/** Dark opening block for a page: small label, big serif title, one line of intro. */
export function PageIntro({ eyebrow, title, intro, mark, children }: PageIntroProps) {
  return (
    <section className="bg-ink pb-24 pt-36 text-white sm:pb-32 sm:pt-44">
      <Container>
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-brand">{eyebrow}</p>
        <h1 className="max-w-4xl text-5xl leading-[1.05] sm:text-7xl">{withMark(title, mark)}</h1>
        {intro && <p className="mt-6 max-w-xl text-lg text-white/70">{intro}</p>}
        {children && <div className="mt-10 flex flex-wrap gap-3">{children}</div>}
      </Container>
    </section>
  );
}
