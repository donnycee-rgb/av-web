/** Homepage copy. Keep every block short — one heading, one or two sentences. */
export const home = {
  hero: {
    // Each line: small lead word + big word. Each big word gets its own craft: framed, sounded, told.
    lines: [
      { lead: 'We', word: 'Frame' },
      { lead: 'We', word: 'Sound' },
      { lead: 'We tell', word: 'Stories' },
    ],
    intro: 'A film and sound studio making commercials, music videos and stories that move people.',
    primary: { label: 'See our work', to: '/work' },
    secondary: { label: 'Book a production', to: '/contact' },
    showreel: {
      /** Path to the showreel video (e.g. '/videos/showreel.mp4'). Until it's set, project stills play instead. */
      video: '',
      /** The still shown behind the title when there's no video (empty = the first project's image) */
      image: '',
      label: 'Showreel',
      year: '2026',
      soundOn: 'Sound on',
      soundOff: 'Sound off',
    },
  },
  place: {
    eyebrow: 'Where we work',
    title: 'Made in Nairobi.',
    mark: { word: 'Nairobi', type: 'underline' },
    subtitle: 'Filmed across Kenya — and beyond.',
    body: 'Our perspective is shaped by the energy and stories of home. We bring it to every frame, from city streets to the coast.',
    link: { label: 'Our story', to: '/studio' },
  },
  studio: {
    eyebrow: 'The studio',
    title: 'Every shot, seen and heard.',
    mark: { word: 'heard', type: 'underline' },
    body: 'We direct, shoot, edit and mix in-house — picture and sound shaped by one team, so every project keeps one point of view.',
    link: { label: 'Our studio', to: '/studio' },
    split: { picture: 'Picture', sound: 'Sound', hint: 'Move across the frame', hintTouch: 'Drag across the frame', handle: 'Picture and sound split' },
  },
  work: {
    eyebrow: 'Selected work',
    title: 'Stories we’ve told.',
    link: { label: 'See all work', to: '/work' },
    mixer: { program: 'PGM', camera: 'CAM', view: 'View project', label: 'Featured projects' },
  },
  services: {
    eyebrow: 'What we do',
    title: 'From first idea to final mix.',
    link: { label: 'All services', to: '/studio#services' },
  },
  clients: {
    eyebrow: 'Clients',
    title: 'Trusted by brands and artists.',
    logosLabel: 'Client logos',
    hint: 'Hover a laurel to read the full review',
    hintTouch: 'Tap a laurel to read the full review',
  },
  cta: {
    /** Headline of the smaller closing block on inner pages (components/sections/ClosingCta) */
    title: 'Have a story to tell?',
    lights: 'Lights.',
    camera: 'Camera.',
    action: 'Action',
    body: 'Tell us your story — we reply within a day.',
    primary: { label: 'Book a production', to: '/contact' },
    reelLabel: 'A reel of our work',
  },
} as const;
