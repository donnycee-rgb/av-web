import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

const FPS = 25;
const pad = (n: number) => String(n).padStart(2, '0');

/**
 * A camera-style timecode (HH:MM:SS:FF) starting from `offsetSeconds`.
 * It jumps back to the offset whenever the offset changes, and only ticks while `running`.
 */
export function useTimecode(offsetSeconds = 0, running = true) {
  const [frames, setFrames] = useState(offsetSeconds * FPS);
  const reduced = useReducedMotion();

  useEffect(() => {
    setFrames(offsetSeconds * FPS);
  }, [offsetSeconds]);

  useEffect(() => {
    if (reduced || !running) return;
    // Advance a few frames at a time — smooth enough to read as "running" without re-rendering 25×/s
    const timer = window.setInterval(() => setFrames((f) => f + 5), 200);
    return () => window.clearInterval(timer);
  }, [reduced, running]);

  const totalSeconds = Math.floor(frames / FPS);
  return `${pad(Math.floor(totalSeconds / 3600))}:${pad(Math.floor(totalSeconds / 60) % 60)}:${pad(totalSeconds % 60)}:${pad(frames % FPS)}`;
}
