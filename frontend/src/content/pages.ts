/** Titles and short intros for each page. Keep intros to one sentence. */
export const pages = {
  home: {
    eyebrow: 'Film & Sound Studio',
    title: 'Stories that move people.',
    intro: 'Commercials, music videos and films — directed, shot, edited and mixed in-house.',
  },
  work: {
    eyebrow: 'Work',
    title: 'Selected work',
    intro: 'Pick a clip on the timeline — or press play.',
    monitorLabel: 'Program',
    viewProject: 'View project',
    soloHint: 'Solo a track to see only that kind of work',
  },
  project: {
    back: 'All work',
    clipInfo: 'Clip info',
    overview: 'Overview',
    role: 'Our role',
    year: 'Year',
    category: 'Category',
    stills: 'Stills',
    credits: 'Credits',
    next: 'Next clip',
  },
  studio: {
    eyebrow: 'Studio',
    title: 'Image and sound, treated as equals.',
    intro: 'A small team that takes a project from first idea to final master.',
  },
  notFound: {
    eyebrow: '404',
    title: 'This scene was cut.',
    intro: 'The page you’re looking for doesn’t exist.',
  },
} as const;
