import type { Category, Project } from '@/types';
import { placeholder, PLACEHOLDER_IDS as P } from '@/lib/images';

export const categories: Category[] = [
  { id: 'commercial', name: 'Commercials' },
  { id: 'narrative', name: 'Narrative' },
  { id: 'music', name: 'Music & Performance' },
  { id: 'sound', name: 'Sound' },
];

// Placeholder projects carried over from the MVP — replace with the studio's real work
export const projects: Project[] = [
  {
    slug: 'aura-chronograph',
    title: 'Aura Chronograph',
    categoryId: 'commercial',
    summary: 'A 60-second watch commercial about craft and precision.',
    overview:
      'A luxury watch film built around the quiet details of mechanical craft. Macro photography, controlled light and a restrained score let the movement itself tell the story.',
    role: ['Direction', 'Cinematography', 'Colour', 'Sound design'],
    image: placeholder(P.camera),
    stills: [placeholder(P.filmSet, 1200), placeholder(P.perfume, 1200), placeholder(P.studio, 1200)],
    year: '2026',
    featured: true,
  },
  {
    slug: 'monolith-motors',
    title: 'Solitude in Motion',
    categoryId: 'commercial',
    summary: 'A high-contrast car campaign shot at golden hour.',
    overview:
      'An automotive campaign shot in the last light of the day. Long lenses, tracking shots and deep contrast give the car a sense of calm power.',
    role: ['Direction', 'Cinematography', 'Editing'],
    image: placeholder(P.car),
    stills: [placeholder(P.camera, 1200), placeholder(P.cinema, 1200), placeholder(P.filmSet, 1200)],
    year: '2025',
    featured: true,
  },
  {
    slug: 'the-cartographer',
    title: 'The Cartographer',
    categoryId: 'narrative',
    summary: 'A short drama about memory, maps and family.',
    overview:
      'A short drama about a man mapping the streets of his childhood to hold on to fading memories. Natural light and an unhurried edit keep it intimate.',
    role: ['Story & treatment', 'Direction', 'Editing', 'Colour'],
    image: placeholder(P.clapper),
    stills: [placeholder(P.stage, 1200), placeholder(P.cinema, 1200), placeholder(P.camera, 1200)],
    year: '2025',
    featured: true,
  },
  {
    slug: 'elysium-quartet-live',
    title: 'Elysium Quartet — Live',
    categoryId: 'music',
    summary: 'A four-camera live session with spatial sound.',
    overview:
      'A live session captured with four cameras and a multi-mic setup inside a stone hall, mixed to keep the natural reverb of the room.',
    role: ['Multi-camera direction', 'Live recording', 'Mixing'],
    image: placeholder(P.stage),
    stills: [placeholder(P.studio, 1200), placeholder(P.synth, 1200), placeholder(P.cinema, 1200)],
    year: '2024',
    featured: true,
  },
  {
    slug: 'velvet-noir',
    title: 'Velvet Noir',
    categoryId: 'commercial',
    summary: 'A fragrance film in deep shadow and amber light.',
    overview:
      'A fragrance film lit like a still life: hard shadows, amber refractions through glass and a slow, sensual pace.',
    role: ['Direction', 'Lighting', 'Colour'],
    image: placeholder(P.perfume),
    stills: [placeholder(P.camera, 1200), placeholder(P.filmSet, 1200), placeholder(P.stage, 1200)],
    year: '2024',
  },
  {
    slug: 'neon-pulse',
    title: 'Neon Pulse',
    categoryId: 'music',
    summary: 'Music visuals built from analogue synth signals.',
    overview:
      'Visuals for an electronic release, generated from analogue synthesiser signals and cut tightly to the track.',
    role: ['Concept', 'Editing', 'Visual effects'],
    image: placeholder(P.synth),
    stills: [placeholder(P.studio, 1200), placeholder(P.stage, 1200), placeholder(P.clapper, 1200)],
    year: '2024',
  },
  {
    slug: 'intermission',
    title: 'Intermission at Twilight',
    categoryId: 'narrative',
    summary: 'Backstage portraits shot during dusk rehearsals.',
    overview:
      'A short portrait film made backstage during evening rehearsals — performers in the quiet moments before they go on.',
    role: ['Direction', 'Cinematography'],
    image: placeholder(P.cinema),
    stills: [placeholder(P.stage, 1200), placeholder(P.clapper, 1200), placeholder(P.filmSet, 1200)],
    year: '2023',
  },
  {
    slug: 'reference-master',
    title: 'Reference Master',
    categoryId: 'sound',
    summary: 'Mixing and mastering for film and music releases.',
    overview:
      'Mixing and mastering work for film and music: balanced dialogue, wide stereo images and masters that translate from cinema speakers to earphones.',
    role: ['Mixing', 'Mastering', 'Sound design'],
    image: placeholder(P.studio),
    stills: [placeholder(P.synth, 1200), placeholder(P.stage, 1200), placeholder(P.camera, 1200)],
    year: '2023',
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? '';

export const findProject = (slug: string) => projects.find((p) => p.slug === slug);

/** The project after this one, looping back to the first. */
export const nextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
