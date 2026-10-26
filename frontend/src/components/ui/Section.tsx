import type { ReactNode } from 'react';
import { Container } from './Container';

type Tone = 'light' | 'mist' | 'dark' | 'brand';

interface SectionProps {
  children: ReactNode;
  tone?: Tone;
  /** Rounded top corners that make the section look like a sheet layered over the one above */
  sheet?: boolean;
  id?: string;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  light: 'bg-paper text-ink',
  mist: 'bg-mist text-ink',
  dark: 'bg-ink text-white',
  brand: 'bg-brand text-ink',
};

/** A full-width page block. Stack several with alternating tones to build a page. */
export function Section({ children, tone = 'light', sheet = false, id, className = '' }: SectionProps) {
  return (
    <section
      id={id}
      className={`relative py-20 sm:py-28 ${toneClasses[tone]} ${
        sheet ? '-mt-8 rounded-t-sheet sm:-mt-10' : ''
      } ${className}`}
    >
      <Container>{children}</Container>
    </section>
  );
}
