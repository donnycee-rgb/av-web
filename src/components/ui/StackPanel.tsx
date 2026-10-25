import type { ReactNode } from 'react';

type Tone = 'light' | 'mist' | 'dark' | 'brand';

interface StackPanelProps {
  children: ReactNode;
  tone?: Tone;
  /** The first panel sits flush under the header; the rest get rounded "sheet" corners */
  first?: boolean;
  id?: string;
  className?: string;
  /** Classes for the inner content wrapper (layout of the panel's content) */
  innerClassName?: string;
  label?: string;
}

const toneClasses: Record<Tone, string> = {
  light: 'bg-paper text-ink',
  mist: 'bg-mist text-ink',
  dark: 'bg-ink text-white spotlight',
  brand: 'bg-brand text-ink',
};

/**
 * One full-screen section in a <StackPanels> stack: exactly one viewport tall and pinned
 * while the next panel scrolls over it. On very short screens it falls back to normal flow.
 */
export function StackPanel({
  children,
  tone = 'light',
  first = false,
  id,
  className = '',
  innerClassName = '',
  label,
}: StackPanelProps) {
  return (
    // Dark backdrop shows around the card as it is pushed back by the next panel
    <section
      id={id}
      aria-label={label}
      className={`sticky top-0 h-svh overflow-hidden bg-ink [@media(max-height:620px)]:static [@media(max-height:620px)]:h-auto [@media(max-height:620px)]:min-h-svh ${
        first ? '' : 'rounded-t-sheet shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.35)]'
      } ${className}`}
    >
      <div
        data-stack-inner
        className={`relative h-full origin-top will-change-transform ${first ? '' : 'rounded-t-sheet'} ${
          toneClasses[tone]
        } ${innerClassName}`}
      >
        {children}
      </div>
    </section>
  );
}
