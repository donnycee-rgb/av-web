import { useEffect, useState } from 'react';
import { site } from '@/content/site';
import { LogoMark } from '@/components/ui/LogoMark';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const SEEN_KEY = 'av-intro-seen';
const DRAW_MS = 1700; // outline traces (1.1s) and fills (finishes ~1.5s), then a beat
const LIFT_MS = 600;

/** How long the first-visit intro covers the page, so the page can start its own entrance after it */
export const INTRO_MS = DRAW_MS + LIFT_MS;

const alreadySeen = () => {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false; // storage blocked: just show it
  }
};

/** True while the intro is still to play this session (read it before the intro starts, e.g. in a first render) */
export const introPending = () => !alreadySeen() && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * First-visit intro: the AV mark traces itself in orange, fills in, then the curtain lifts.
 * Shown once per browser session; click to skip; never shown with reduced motion.
 */
export function IntroCurtain() {
  const reduced = useReducedMotion();
  const [stage, setStage] = useState<'hidden' | 'drawing' | 'drawn' | 'lifting'>(() =>
    reduced || alreadySeen() ? 'hidden' : 'drawing',
  );

  useEffect(() => {
    if (stage === 'hidden') return;
    try {
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      // ignore — the intro may simply show again next visit
    }
    // Next frame: start the trace (so the hidden → drawn transition actually animates)
    const start = window.setTimeout(() => setStage((s) => (s === 'drawing' ? 'drawn' : s)), 60);
    const lift = window.setTimeout(() => setStage('lifting'), DRAW_MS);
    const done = window.setTimeout(() => setStage('hidden'), DRAW_MS + LIFT_MS);
    return () => [start, lift, done].forEach(window.clearTimeout);
    // Timers are set up once, when the intro starts (empty dependency list on purpose)
  }, []);

  if (stage === 'hidden') return null;

  return (
    <div
      aria-hidden="true"
      onClick={() => setStage('hidden')}
      className={`fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center gap-6 bg-ink transition-all ease-in-out ${
        stage === 'lifting' ? '-translate-y-full' : 'translate-y-0'
      }`}
      style={{ transitionDuration: `${LIFT_MS}ms` }}
    >
      <LogoMark variant="drawing" drawn={stage !== 'drawing'} className="h-24 w-auto sm:h-32" />
      <p
        className={`font-mono text-[11px] uppercase tracking-[0.35em] text-white/60 transition-opacity duration-500 ${
          stage === 'drawing' ? 'opacity-0' : 'opacity-100 delay-700'
        }`}
      >
        {site.name} · {site.tagline}
      </p>
    </div>
  );
}
