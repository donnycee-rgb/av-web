import type { Project } from '@/types';
import { useTimecode } from '@/hooks/useTimecode';

interface ProgramMonitorProps {
  project: Project;
  label: string;
  playing: boolean;
  /** Where the playhead sits, in seconds — drives the timecode */
  positionSeconds: number;
  clipNumber: number;
  clipCount: number;
  onPrev: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
}

const iconClass = 'h-4 w-4';

/** The editor's "program" viewer: the selected project large, with transport controls underneath. */
export function ProgramMonitor({
  project,
  label,
  playing,
  positionSeconds,
  clipNumber,
  clipCount,
  onPrev,
  onNext,
  onTogglePlay,
}: ProgramMonitorProps) {
  const timecode = useTimecode(Math.round(positionSeconds), playing);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
      {/* Picture */}
      <div className="relative aspect-video max-h-[54vh] w-full overflow-hidden">
        {/* Keyed on the project so each new clip fades in with a slow push-in */}
        <div key={project.slug} className="absolute inset-0 animate-fade-in">
          <img src={project.image} alt={project.title} className="h-full w-full animate-kenburns object-cover" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/40" />

        {/* Monitor chrome */}
        {(['left-4 top-4 border-l-2 border-t-2', 'right-4 top-4 border-r-2 border-t-2', 'bottom-4 left-4 border-b-2 border-l-2', 'bottom-4 right-4 border-b-2 border-r-2'] as const).map(
          (pos) => (
            <span key={pos} className={`pointer-events-none absolute h-5 w-5 border-white/70 ${pos}`} />
          ),
        )}
        <span className="absolute left-8 top-7 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
          <span className={`h-2 w-2 rounded-full ${playing ? 'animate-rec bg-red-500' : 'bg-white/40'}`} />
          {label} · {playing ? 'Playing' : 'Paused'}
        </span>
        <span className="absolute right-8 top-7 font-mono text-[11px] tracking-wider text-white/90 tabular-nums">{timecode}</span>
      </div>

      {/* Transport */}
      <div className="flex items-center justify-between gap-4 border-t border-white/10 px-4 py-3">
        <span className="font-mono text-[11px] tracking-wider text-white/50 tabular-nums">
          CLIP {String(clipNumber).padStart(2, '0')} / {String(clipCount).padStart(2, '0')}
        </span>
        <div className="flex items-center gap-1">
          <button type="button" onClick={onPrev} aria-label="Previous clip" className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white">
            <svg viewBox="0 0 16 16" className={iconClass} fill="currentColor" aria-hidden="true">
              <path d="M3 2h2v12H3zM14 2v12L6 8z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onTogglePlay}
            aria-label={playing ? 'Pause' : 'Play through the work'}
            aria-pressed={playing}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-ink hover:bg-brand-light"
          >
            {playing ? (
              <svg viewBox="0 0 16 16" className={iconClass} fill="currentColor" aria-hidden="true">
                <path d="M3 2h3.5v12H3zM9.5 2H13v12H9.5z" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" className={`${iconClass} ml-0.5`} fill="currentColor" aria-hidden="true">
                <path d="M3 1.5v13L14 8z" />
              </svg>
            )}
          </button>
          <button type="button" onClick={onNext} aria-label="Next clip" className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white">
            <svg viewBox="0 0 16 16" className={iconClass} fill="currentColor" aria-hidden="true">
              <path d="M11 2h2v12h-2zM2 2v12l8-6z" />
            </svg>
          </button>
        </div>
        <span className="hidden font-mono text-[11px] tracking-wider text-white/50 sm:inline">← → TO BROWSE</span>
      </div>
    </div>
  );
}
