import { useEffect, useRef, useState } from 'react';
import { home } from '@/content/home';
import { projects } from '@/content/projects';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTimecode } from '@/hooks/useTimecode';
import { StackPanel } from '@/components/ui/StackPanel';
import { Button } from '@/components/ui/Button';
import { INTRO_MS, introPending } from '@/components/layout/IntroCurtain';

/** After the letterbox opens, when the title's crafts come in (ms) */
const CRAFTS_AFTER = 700;
const WAVE_BARS = 28;
const CORNERS = ['-left-3 -top-1 border-l-[3px] border-t-[3px]', '-right-3 -top-1 border-r-[3px] border-t-[3px]', '-bottom-1 -left-3 border-b-[3px] border-l-[3px]', '-bottom-1 -right-3 border-b-[3px] border-r-[3px]'];

/**
 * The homepage opening, like a film starting. Black letterbox bars slide apart to reveal the
 * opening shot (one still image — or the showreel video once supplied), warmly graded in the brand orange.
 * Then each line of the title shows its craft: brackets frame "Frame", a waveform sounds under
 * "Sound", and "Stories" is told letter by letter. With a showreel video, a "Sound on" toggle
 * invites visitors to hear it. Waits for the first-visit intro curtain to lift before opening.
 */
export function HeroSection() {
  const { hero } = home;
  const reel = hero.showreel;
  const reduced = useReducedMotion();
  // Read before the intro starts: on a first visit the letterbox opens only once the curtain has lifted
  const [openAfter] = useState(() => (introPending() ? INTRO_MS : 150));
  const [open, setOpen] = useState(reduced);
  const [crafts, setCrafts] = useState(reduced);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timecode = useTimecode(0, open);

  useEffect(() => {
    if (reduced) return;
    const timers = [window.setTimeout(() => setOpen(true), openAfter), window.setTimeout(() => setCrafts(true), openAfter + CRAFTS_AFTER)];
    return () => timers.forEach(window.clearTimeout);
  }, [reduced, openAfter]);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !muted;
    setMuted(!muted);
    if (video.paused) void video.play();
  };

  const [frame, sound, stories] = hero.lines;
  const shown = (on: boolean) => `transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`;

  return (
    <StackPanel tone="dark" first label="Introduction">
      <div className="relative flex h-full items-center justify-center overflow-hidden px-4">
        {/* The opening shot: one still image (kept still, so the title has the stage), or the showreel video */}
        <div aria-hidden="true" className="absolute inset-0">
          {reel.video ? (
            <video ref={videoRef} src={reel.video} autoPlay muted loop playsInline className="h-full w-full object-cover" />
          ) : (
            <img src={reel.image || projects[0].image} alt="" className="h-full w-full object-cover" />
          )}
          {/* Warm brand grade, and enough shade for the title to read */}
          <div className="absolute inset-0 bg-ink/55" />
          <div className="absolute inset-0 bg-gradient-to-tr from-brand/45 via-transparent to-brand/10 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(11,18,32,0.75)_100%)]" />
        </div>

        {/* Letterbox: closed at first, then slides apart to widescreen bars */}
        <div aria-hidden="true" className={`absolute inset-x-0 top-0 z-20 bg-film transition-[height] duration-[1200ms] ease-[cubic-bezier(0.7,0,0.3,1)] ${open ? 'h-[7svh]' : 'h-1/2'}`} />
        <div className={`absolute inset-x-0 bottom-0 z-20 flex items-center bg-film transition-[height] duration-[1200ms] ease-[cubic-bezier(0.7,0,0.3,1)] ${open ? 'h-[7svh]' : 'h-1/2'}`}>
          <div className={`flex w-full items-center justify-between px-4 font-mono text-[10px] uppercase tracking-[0.25em] text-white/55 transition-opacity delay-700 duration-500 sm:px-8 ${open ? 'opacity-100' : 'opacity-0'}`}>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-rec rounded-full bg-brand" aria-hidden="true" />
              {reel.label} · {reel.year}
            </span>
            <span className="flex items-center gap-5">
              <span className="hidden tabular-nums sm:inline">{timecode}</span>
              {reel.video && (
                <button type="button" onClick={toggleSound} aria-pressed={!muted} className="flex items-center gap-2 text-white/80 hover:text-brand">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden="true">
                    <path d="M4 9h4l5-4v14l-5-4H4z" />
                    {muted ? <path d="M17 9l4 6M21 9l-4 6" /> : <path d="M17 8.5a5 5 0 0 1 0 7M19.5 6a8.5 8.5 0 0 1 0 12" />}
                  </svg>
                  {muted ? reel.soundOn : reel.soundOff}
                </button>
              )}
            </span>
          </div>
        </div>

        {/* Title card */}
        {/* Title sizes follow the screen's width and height, so it always fits between the letterbox bars */}
        <div className="relative z-10 flex max-w-4xl flex-col items-center pt-6 text-center text-white [--hero-lead:clamp(1.6rem,min(4.5vw,5.5svh),3rem)] [--hero-word:clamp(3.25rem,min(10vw,12svh),8rem)]">
          <h1 className="flex flex-col items-center gap-2 leading-[0.95] sm:gap-3">
            {/* We Frame — viewfinder brackets snap around the word */}
            <span className="flex items-baseline gap-3 sm:gap-5">
              <span className="text-[length:var(--hero-lead)] text-white/75">{frame.lead}</span>
              <span className="relative inline-block text-[length:var(--hero-word)]">
                {frame.word}
                {CORNERS.map((corner) => (
                  <span
                    key={corner}
                    aria-hidden="true"
                    className={`absolute h-4 w-4 border-brand transition-[opacity,transform] duration-500 sm:h-6 sm:w-6 ${corner} ${crafts ? 'scale-100 opacity-100' : 'scale-150 opacity-0'}`}
                  />
                ))}
              </span>
            </span>

            {/* We Sound — a waveform breathes underneath (inside the line's own space, so it covers nothing) */}
            <span className="flex items-baseline gap-3 sm:gap-5">
              <span className="text-[length:var(--hero-lead)] text-white/75">{sound.lead}</span>
              <span className="relative inline-block pb-4 text-6xl sm:pb-5 sm:text-8xl lg:text-9xl">
                {sound.word}
                <span aria-hidden="true" className={`absolute inset-x-0 bottom-0 flex h-3 items-center justify-between transition-opacity duration-700 sm:h-4 ${crafts ? 'opacity-100' : 'opacity-0'}`}>
                  {Array.from({ length: WAVE_BARS }, (_, i) => (
                    <span
                      key={i}
                      className="h-full w-[3px] origin-center rounded-full bg-brand"
                      style={{ animation: reduced ? undefined : `wave ${0.7 + ((i * 37) % 9) / 10}s ease-in-out ${(i % 7) * -0.13}s infinite`, transform: 'scaleY(0.5)' }}
                    />
                  ))}
                </span>
              </span>
            </span>

            {/* We tell Stories — told letter by letter */}
            <span className="flex items-baseline gap-3 sm:gap-5">
              <span className="text-[length:var(--hero-lead)] text-white/75">{stories.lead}</span>
              <span className="text-6xl italic text-brand sm:text-8xl lg:text-9xl" aria-label={stories.word}>
                {stories.word.split('').map((letter, i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    className={`inline-block transition-[opacity,transform] duration-500 ${crafts ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
                    style={{ transitionDelay: crafts ? `${300 + i * 70}ms` : '0ms' }}
                  >
                    {letter}
                  </span>
                ))}
              </span>
            </span>
          </h1>

          <p className={`mt-8 max-w-md text-base text-white/80 sm:text-lg ${shown(open)}`} style={{ transitionDelay: open ? '500ms' : '0ms' }}>
            {hero.intro}
          </p>
          <div className={`mt-8 flex flex-wrap justify-center gap-3 ${shown(open)}`} style={{ transitionDelay: open ? '650ms' : '0ms' }}>
            <Button to={hero.primary.to} variant="primary">
              {hero.primary.label}
            </Button>
            <Button to={hero.secondary.to} variant="outline-light">
              {hero.secondary.label}
            </Button>
          </div>
        </div>
      </div>
    </StackPanel>
  );
}
