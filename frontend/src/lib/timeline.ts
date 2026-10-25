import type { Category, Project } from '@/types';

export interface Track {
  /** Short code shown like an editing app: V1, V2… for picture, A1 for sound */
  code: string;
  category: Category;
  kind: 'video' | 'audio';
}

export interface TimelineClip {
  project: Project;
  trackCode: string;
  /** Position and size as fractions (0–1) of the timeline width */
  left: number;
  width: number;
}

const AUDIO_CATEGORIES = new Set(['sound']);

/** One track per category: picture categories become V1, V2…; sound categories become A1, A2… */
export function buildTracks(categories: Category[]): Track[] {
  let v = 0;
  let a = 0;
  return categories.map((category) => {
    const kind = AUDIO_CATEGORIES.has(category.id) ? 'audio' : 'video';
    return { code: kind === 'audio' ? `A${++a}` : `V${++v}`, category, kind };
  });
}

/** The years shown on the ruler, oldest first. */
export function timelineYears(projects: Project[]): string[] {
  return [...new Set(projects.map((p) => p.year))].sort();
}

/**
 * Lays projects out as clips: each year is an equal slice of the ruler, and clips that share
 * a track and year split that slice between them.
 */
export function layoutClips(projects: Project[], tracks: Track[], years: string[]): TimelineClip[] {
  const slice = 1 / years.length;
  const GAP = 0.004;
  const clips: TimelineClip[] = [];

  for (const track of tracks) {
    for (const [yearIndex, year] of years.entries()) {
      const group = projects.filter((p) => p.categoryId === track.category.id && p.year === year);
      group.forEach((project, i) => {
        const width = slice / group.length;
        clips.push({
          project,
          trackCode: track.code,
          left: yearIndex * slice + i * width + GAP,
          width: width - GAP * 2,
        });
      });
    }
  }
  return clips;
}

/** Clips in playback order: left to right along the timeline, top track first on ties. */
export function playbackOrder(clips: TimelineClip[], tracks: Track[]): TimelineClip[] {
  const trackIndex = (code: string) => tracks.findIndex((t) => t.code === code);
  return [...clips].sort((a, b) => a.left - b.left || trackIndex(a.trackCode) - trackIndex(b.trackCode));
}

/** Deterministic pseudo-random waveform heights (0–1) from a string, for audio clips. */
export function waveformFor(seed: string, bars: number): number[] {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return Array.from({ length: bars }, (_, i) => {
    h = (h * 1103515245 + 12345) >>> 0;
    const envelope = Math.sin((i / (bars - 1)) * Math.PI) * 0.6 + 0.4;
    return Math.max(0.12, ((h % 1000) / 1000) * envelope);
  });
}
