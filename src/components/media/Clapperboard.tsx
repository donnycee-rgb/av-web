import { contact } from '@/content/contact';

interface ClapperboardProps {
  /** Values chalked onto the slate */
  prod: string;
  scene: string;
  date: string;
  director: string;
  /** When true the clapper stick snaps shut */
  closed: boolean;
  className?: string;
}

const STRIPES = 'repeating-linear-gradient(120deg, var(--color-paper) 0 18px, var(--color-ink) 18px 36px)';

/** A film clapperboard whose slate fills in live with the visitor's answers, and snaps shut on send. */
export function Clapperboard({ prod, scene, date, director, closed, className = '' }: ClapperboardProps) {
  const labels = contact.slate;
  const cell = (label: string, value: string) => (
    <div className="min-w-0">
      <p className="text-[9px] uppercase tracking-[0.25em] text-white/45">{label}</p>
      <p className={`mt-1 truncate text-base sm:text-lg ${value ? 'text-white' : 'text-white/25'}`}>{value || '—'}</p>
    </div>
  );

  return (
    <div aria-hidden="true" className={`select-none font-mono ${className}`}>
      {/* Clapper stick, hinged at its bottom-left corner */}
      <div
        className="relative z-10 h-7 rounded-t-md shadow-lg transition-transform ease-in sm:h-9"
        style={{
          background: STRIPES,
          transformOrigin: '6% 100%',
          transform: closed ? 'rotate(0deg)' : 'rotate(-16deg)',
          transitionDuration: closed ? '160ms' : '500ms',
        }}
      />
      {/* Board */}
      <div key={String(closed)} className={`rounded-b-xl bg-ink shadow-2xl shadow-black/30 ${closed ? 'animate-clap' : ''}`}>
        <div className="h-5 sm:h-6" style={{ background: STRIPES }} />
        <div className="space-y-4 p-5 sm:p-6">
          <div className="border-b border-white/15 pb-4">{cell(labels.prod, prod)}</div>
          <div className="grid grid-cols-2 gap-4 border-b border-white/15 pb-4">
            {cell(labels.scene, scene)}
            {cell(labels.take, '01')}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {cell(labels.date, date)}
            {cell(labels.director, director)}
          </div>
          <p className="pt-1 text-[10px] uppercase tracking-[0.3em] text-brand">AV Productions</p>
        </div>
      </div>
    </div>
  );
}
