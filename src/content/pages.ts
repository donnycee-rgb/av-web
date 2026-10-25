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
    tableIntro: 'Contact sheets on the light table. Bring the loupe to a frame.',
    tableIntroTouch: 'Contact sheets on the light table. Tap a frame to open it.',
    all: 'All',
    openHint: 'Click to open',
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
    mark: { word: 'equals', type: 'underline' },
    intro: 'A small team that takes a project from first idea to final master.',
  },
  notFound: {
    eyebrow: '404',
    title: 'This scene was cut.',
    intro: 'The page you’re looking for doesn’t exist.',
  },
} as const;
