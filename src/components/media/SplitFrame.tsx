import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { useInView } from '@/hooks/useInView';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SplitFrameProps {
  src: string;
  alt: string;
  labels: { picture: string; sound: string; hint: string; hintTouch: string; handle: string };
  className?: string;
}

const BARS = 56;
/** How quickly the split catches up with the pointer each frame (0–1) */
const EASE = 0.14;
/** The split can't go closer than this to either edge (%) */
const EDGE = 6;
/** The idle hint: the split sways to these positions (%) once, the first time it's seen */
const HINT = [50, 34, 66, 50];
const HINT_STEP_MS = 700;

// A made-up but natural-looking waveform: a couple of swells, with a little grain on every bar
const WAVE = Array.from({ length: BARS }, (_, i) => {
  const swell = Math.abs(Math.sin(i * 0.19) * Math.sin(i * 0.07 + 0.9));
  const grain = 0.65 + 0.35 * Math.abs(Math.sin(i * 12.9898) * 43758.5453 % 1);
  return 0.12 + 0.88 * swell * grain;
});

/**
 * One frame, shown two ways: picture on the left, its sound on the right (a waveform over the
 * dimmed shot). An "=" handle splits them; the split follows the mouse across the frame, can be
 * dragged on touch screens, and moves with the arrow keys. The first time it's seen it sways once
 * to show it moves. The split position reaches the CSS as --split (%).
 */
export function SplitFrame({ src, alt, labels, className = '' }: SplitFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(frameRef, 0.6);
  const handleRef = useRef<HTMLDivElement>(null);
  const split = useRef({ value: 50, target: 50, raf: 0, touched: false });
  const [mouse] = useState(() => window.matchMedia('(hover: hover) and (pointer: fine)').matches);

  const write = () => {
    frameRef.current?.style.setProperty('--split', `${split.current.value.toFixed(2)}%`);
    handleRef.current?.setAttribute('aria-valuenow', String(Math.round(split.current.value)));
  };

  // Ease the split towards its target
  const run = () => {
    const s = split.current;
    if (s.raf) return;
    const step = () => {
      s.value += (s.target - s.value) * (reduced ? 1 : EASE);
      if (Math.abs(s.target - s.value) < 0.05) s.value = s.target;
      write();
      s.raf = s.value === s.target ? 0 : requestAnimationFrame(step);
    };
    s.raf = requestAnimationFrame(step);
  };

  const moveTo = (percent: number) => {
    split.current.target = Math.min(100 - EDGE, Math.max(EDGE, percent));
    run();
  };

  // Once, when first seen: sway to show the frame can be split (skipped if the visitor got there first)
  useEffect(() => {
    if (!inView || reduced) return;
    const timers = HINT.map((position, i) =>
      window.setTimeout(() => {
        if (!split.current.touched) moveTo(position);
      }, 400 + i * HINT_STEP_MS),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [inView, reduced]);

  useEffect(() => () => cancelAnimationFrame(split.current.raf), []);

  const fromPointer = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    split.current.touched = true;
    moveTo(((e.clientX - rect.left) / rect.width) * 100);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    // Mouse: follows freely. Touch/pen: only while pressed (a drag)
    if (e.pointerType === 'mouse' || e.buttons) fromPointer(e);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const step = e.key === 'ArrowLeft' ? -5 : e.key === 'ArrowRight' ? 5 : 0;
    if (!step) return;
    e.preventDefault();
    split.current.touched = true;
    moveTo(split.current.target + step);
  };

  return (
    <div
      ref={frameRef}
      onPointerMove={onPointerMove}
      onPointerDown={fromPointer}
      onPointerLeave={(e) => e.pointerType === 'mouse' && moveTo(50)}
      className={`relative cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-2xl bg-ink [--split:50%] ${className}`}
    >
      {/* Picture */}
      <img src={src} alt={alt} draggable={false} className="absolute inset-0 h-full w-full object-cover" />

      {/* Sound: the same shot, dimmed, with its waveform — revealed right of the split */}
      <div aria-hidden="true" className="absolute inset-0" style={{ clipPath: 'inset(0 0 0 var(--split))' }}>
        <img src={src} alt="" draggable={false} className="absolute inset-0 h-full w-full object-cover [filter:grayscale(1)_brightness(0.35)]" />
        <div className="absolute inset-0 bg-navy/60" />
        <svg viewBox={`0 0 ${BARS * 2} 100`} preserveAspectRatio="none" className="absolute inset-x-[6%] top-1/2 h-[46%] w-[88%] -translate-y-1/2">
          {WAVE.map((h, i) => (
            <rect key={i} x={i * 2 + 0.35} y={50 - h * 50} width={1.3} height={h * 100} rx={0.65} fill="var(--color-brand)" />
          ))}
        </svg>
        {/* A slow playhead running across the sound */}
        {!reduced && <div className="absolute inset-y-[22%] w-px animate-[playhead_7s_linear_infinite] bg-white/60" />}
      </div>

      {/* Labels for each side */}
      <span className="absolute left-4 top-4 rounded-full bg-ink/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-white backdrop-blur-sm">
        {labels.picture}
      </span>
      <span className="absolute right-4 top-4 rounded-full bg-brand px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-ink">
        {labels.sound}
      </span>
      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/70">{mouse ? labels.hint : labels.hintTouch}</span>

      {/* The split, with its "=" handle */}
      <div className="pointer-events-none absolute inset-y-0 left-[var(--split)] w-0.5 -translate-x-1/2 bg-paper">
        <div
          ref={handleRef}
          role="slider"
          tabIndex={0}
          aria-label={labels.handle}
          aria-valuemin={EDGE}
          aria-valuemax={100 - EDGE}
          aria-valuenow={50}
          aria-valuetext={`${labels.picture} / ${labels.sound}`}
          onKeyDown={onKeyDown}
          className="pointer-events-auto absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-2xl font-semibold leading-none text-ink shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          =
        </div>
      </div>
    </div>
  );
}
