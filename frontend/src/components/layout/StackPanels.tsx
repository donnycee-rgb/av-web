import { useRef, type ReactNode } from 'react';
import { useStackEffect } from '@/hooks/useStackEffect';

interface StackPanelsProps {
  children: ReactNode;
}

/**
 * Wraps a run of <StackPanel>s. Each panel pins to the top of the screen and the
 * next one slides over it, while the covered panel is gently pushed back.
 */
export function StackPanels({ children }: StackPanelsProps) {
  const ref = useRef<HTMLDivElement>(null);
  useStackEffect(ref);
  return <div ref={ref}>{children}</div>;
}
