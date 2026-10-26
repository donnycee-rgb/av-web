import type { KeyboardEvent } from 'react';
import { type TimelineClip, type Track, waveformFor } from '@/lib/timeline';

interface TimelineProps {
  tracks: Track[];
  clips: TimelineClip[];
  years: string[];
  activeSlug: string;
  /** Category id of the soloed track, or null when all tracks are live */
  solo: string | null;
  onSelect: (slug: string) => void;
  onSolo: (categoryId: string) => void;
  onStep: (direction: 1 | -1) => void;
}

const LABEL_COL = 'w-32 sm:w-44';

/** Editing-app style timeline: year ruler, one track per category, clips placed by year, and a playhead. */
export function Timeline({ tracks, clips, years, activeSlug, solo, onSelect, onSolo, onStep }: TimelineProps) {
  const active = clips.find((c) => c.project.slug === activeSlug);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      onStep(e.key === 'ArrowRight' ? 1 : -1);
    }
  };

  return (
    <div
      role="region"
      aria-label="Project timeline — use the arrow keys to move between clips"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="overflow-x-auto rounded-2xl border border-white/10 bg-ink-soft [scrollbar-width:thin]"
    >
      <div className="relative min-w-[760px]">
        {/* Ruler */}
        <div className="flex h-9 border-b border-white/10">
          <div className={`${LABEL_COL} sticky left-0 z-20 flex shrink-0 items-center bg-ink-soft px-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40`}>
            Timeline
          </div>
          <div className="relative flex-1">
            {years.map((year, i) => (
              <div key={year} className="absolute inset-y-0 border-l border-white/15" style={{ left: `${(i / years.length) * 100}%`, width: `${100 / years.length}%` }}>
                <span className="absolute left-2 top-2 font-mono text-[11px] text-white/70">{year}</span>
                {/* Minor ticks */}
                {[1, 2, 3].map((t) => (
                  <span key={t} className="absolute bottom-0 h-2 border-l border-white/15" style={{ left: `${t * 25}%` }} />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Tracks */}
        {tracks.map((track) => {
          const muted = solo !== null && solo !== track.category.id;
          const soloed = solo === track.category.id;
          return (
            <div key={track.code} className="flex h-16 border-b border-white/5 last:border-b-0">
              <div className={`${LABEL_COL} sticky left-0 z-20 flex shrink-0 items-center gap-2 border-r border-white/10 bg-ink-soft px-3`}>
                <span className={`font-mono text-xs font-semibold ${track.kind === 'audio' ? 'text-audio' : 'text-brand'}`}>{track.code}</span>
                <span className={`min-w-0 flex-1 truncate text-xs ${muted ? 'text-white/30' : 'text-white/80'}`}>{track.category.name}</span>
                <button
                  type="button"
                  onClick={() => onSolo(track.category.id)}
                  aria-pressed={soloed}
                  aria-label={`${soloed ? 'Un-solo' : 'Solo'} ${track.category.name}`}
                  title={soloed ? 'Show all tracks' : `Show only ${track.category.name}`}
                  className={`h-6 w-6 shrink-0 rounded font-mono text-[10px] font-bold transition-colors ${
                    soloed ? 'bg-brand text-ink' : 'border border-white/20 text-white/60 hover:border-white/60 hover:text-white'
                  }`}
                >
                  S
                </button>
              </div>

              <div className={`relative flex-1 bg-white/[0.02] transition-opacity ${muted ? 'opacity-30' : ''}`}>
                {clips
                  .filter((c) => c.trackCode === track.code)
                  .map((clip) => {
                    const isActive = clip.project.slug === activeSlug;
                    return (
                      <button
                        key={clip.project.slug}
                        type="button"
                        onClick={() => onSelect(clip.project.slug)}
                        aria-pressed={isActive}
                        aria-label={`${clip.project.title}, ${clip.project.year}`}
                        className={`absolute inset-y-2 overflow-hidden rounded-md text-left transition-shadow ${
                          isActive ? 'ring-2 ring-brand ring-offset-2 ring-offset-ink-soft' : 'ring-1 ring-white/10 hover:ring-white/50'
                        }`}
                        style={{ left: `${clip.left * 100}%`, width: `${clip.width * 100}%` }}
                      >
                        {track.kind === 'video' ? (
                          // Filmstrip: the still repeated along the clip, like thumbnails in an editor
                          <span
                            className="absolute inset-0 bg-repeat-x"
                            style={{ backgroundImage: `url(${clip.project.image})`, backgroundSize: 'auto 100%' }}
                          />
                        ) : (
                          <span className="absolute inset-0 flex items-center gap-[2px] bg-audio/15 px-1.5">
                            {waveformFor(clip.project.slug, 48).map((h, i) => (
                              <span key={i} className="flex-1 rounded-full bg-audio/80" style={{ height: `${h * 80}%` }} />
                            ))}
                          </span>
                        )}
                        <span className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                        <span className="absolute bottom-1 left-2 right-2 truncate text-[11px] font-semibold text-white">{clip.project.title}</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          );
        })}

        {/* Playhead — spans ruler and tracks, glides to the active clip */}
        {active && (
          <div className="pointer-events-none absolute inset-y-0 left-32 right-0 z-10 sm:left-44" aria-hidden="true">
            <div className="absolute inset-y-0 w-px bg-brand transition-[left] duration-500 ease-out" style={{ left: `${active.left * 100}%` }}>
              <span className="absolute -left-[5px] top-0 h-0 w-0 border-x-[5px] border-t-[8px] border-x-transparent border-t-brand" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
