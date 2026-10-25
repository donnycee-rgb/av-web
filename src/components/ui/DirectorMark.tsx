import { useRef, type ReactNode } from 'react';
import { useInView } from '@/hooks/useInView';

export type MarkType = 'circle' | 'underline';

export interface Mark {
  /** The word in the heading to mark (first occurrence) */
  word: string;
  type: MarkType;
}

interface DirectorMarkProps {
  children: ReactNode;
  type: MarkType;
  /** Stroke colour class, e.g. "text-brand" — the stroke uses currentColor */
  colorClass?: string;
  /** Milliseconds to wait after coming into view before drawing */
  delay?: number;
}

// Hand-drawn strokes, deliberately imperfect: the circle overshoots its start, the underline wobbles
const SHAPES: Record<MarkType, { viewBox: string; d: string; box: string }> = {
  circle: {
    viewBox: '0 0 200 100',
    d: 'M118 9 C 60 4, 12 20, 8 50 C 4 80, 50 96, 104 95 C 160 94, 200 74, 193 44 C 187 16, 130 4, 70 12',
    box: '-left-[9%] -right-[9%] -top-[20%] -bottom-[14%]',
  },
  underline: {
    viewBox: '0 0 200 20',
    d: 'M3 13 C 40 5, 82 18, 122 9 S 178 6, 197 11',
    box: 'left-0 right-0 -bottom-[0.22em] h-[0.32em]',
  },
};

/**
 * Wraps a word with a marker stroke — like a director annotating a script — that draws itself
 * once the word scrolls into view.
 */
export function DirectorMark({ children, type, colorClass = 'text-brand', delay = 250 }: DirectorMarkProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, 0.6);
  const shape = SHAPES[type];

  return (
    <span ref={ref} className="relative inline-block whitespace-nowrap">
      {children}
      <svg
        aria-hidden="true"
        viewBox={shape.viewBox}
        preserveAspectRatio="none"
        className={`pointer-events-none absolute overflow-visible ${shape.box} ${colorClass}`}
      >
        <path
          d={shape.d}
          pathLength={1}
          fill="none"
          stroke="currentColor"
          strokeWidth={type === 'circle' ? 3 : 4}
          strokeLinecap="round"
          style={{
            strokeDasharray: 1,
            strokeDashoffset: inView ? 0 : 1,
            transition: `stroke-dashoffset 900ms cubic-bezier(0.65, 0, 0.35, 1) ${delay}ms`,
          }}
        />
      </svg>
    </span>
  );
}

/** Renders `text` with its marked word wrapped in a DirectorMark (or plain text if no mark). */
export function withMark(text: string, mark: Mark | undefined, colorClass?: string) {
  if (!mark) return text;
  const at = text.indexOf(mark.word);
  if (at === -1) return text;
  return (
    <>
      {text.slice(0, at)}
      <DirectorMark type={mark.type} colorClass={colorClass}>
        {mark.word}
      </DirectorMark>
      {text.slice(at + mark.word.length)}
    </>
  );
}
