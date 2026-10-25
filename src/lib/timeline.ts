import type { Category } from '@/types';

export interface Track {
  /** Short code shown like an editing app: V1, V2… for picture, A1 for sound */
  code: string;
  category: Category;
  kind: 'video' | 'audio';
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
