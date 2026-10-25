import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Index that advances every `interval` ms and wraps around `length`.
 * `delay` offsets the first tick so several cyclers don't change in sync.
 */
export function useCycle(length: number, interval = 3500, delay = 0) {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (length <= 1 || reduced) return;
    let timer: number;
    const start = window.setTimeout(() => {
      setIndex((i) => (i + 1) % length);
      timer = window.setInterval(() => setIndex((i) => (i + 1) % length), interval);
    }, interval + delay);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(timer);
    };
  }, [length, interval, delay, reduced]);

  return index;
}
