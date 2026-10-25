/** Homepage copy. Keep every block short — one heading, one or two sentences. */
export const home = {
  hero: {
    // Each line: small lead word + big word (styled like a title card)
    lines: [
      { lead: 'We', word: 'Frame' },
      { lead: 'We', word: 'Sound' },
      { lead: 'We tell', word: 'Stories' },
    ],
    intro: 'A film and sound studio making commercials, music videos and stories that move people.',
    primary: { label: 'See our work', to: '/work' },
    secondary: { label: 'Book a production', to: '/contact' },
    showreelLabel: 'Showreel',
  },
  place: {
    eyebrow: 'Where we work',
    title: 'Made in Nairobi.',
    subtitle: 'Filmed across Kenya — and beyond.',
    body: 'Our perspective is shaped by the energy and stories of home. We bring it to every frame, from city streets to the coast.',
    link: { label: 'Our story', to: '/studio' },
  },
  studio: {
    eyebrow: 'The studio',
    title: 'Image and sound, treated as equals.',
    body: 'We direct, shoot, edit and mix in-house — so every project keeps one point of view from first idea to final master.',
    link: { label: 'Our studio', to: '/studio' },
  },
  work: {
    eyebrow: 'Selected work',
    title: 'Stories we’ve told.',
    link: { label: 'See all work', to: '/work' },
  },
  services: {
    eyebrow: 'What we do',
    title: 'From first idea to final mix.',
    link: { label: 'All services', to: '/studio' },
  },
  clients: {
    eyebrow: 'Clients',
    title: 'Trusted by brands and artists.',
  },
  cta: {
    title: 'Have a story to tell?',
    body: 'Tell us about it — we reply within a day.',
    primary: { label: 'Book a production', to: '/contact' },
  },
} as const;
