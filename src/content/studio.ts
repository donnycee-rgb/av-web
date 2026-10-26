import type { Client, FlowStage, Milestone, Service, Testimonial } from '@/types';

export const servicesCopy = {
  eyebrow: 'What we do',
  title: 'Five crafts, one crew.',
  hint: 'Move over a service to pull focus',
  hintTouch: 'Tap a service to pull focus',
  includes: 'Includes',
  /** Lens focus-scale markings, one per service, near to far */
  distances: ['0.5m', '1m', '2m', '5m', '∞'],
};

/** Services, in order. Shown on the Studio page (#services); the homepage lists their names. */
export const services: Service[] = [
  {
    id: 'direction',
    title: 'Cinematography & Direction',
    summary: 'From concept to the last shot on set.',
    includes: ['Creative direction', 'Lighting & camera', 'On-set production'],
  },
  {
    id: 'storycraft',
    title: 'Story & Treatments',
    summary: 'Scripts, storyboards and director treatments.',
    includes: ['Script development', 'Storyboards', 'Location scouting'],
  },
  {
    id: 'post',
    title: 'Editing & Colour',
    summary: 'Pacing with feeling, colour with intent.',
    includes: ['Editing', 'Colour grading', 'Social cut-downs'],
  },
  {
    id: 'music',
    title: 'Music Videos & Live Sessions',
    summary: 'Multi-camera performances and concept videos.',
    includes: ['Music videos', 'Live recording', 'Artist content'],
  },
  {
    id: 'sound',
    title: 'Sound Design & Mixing',
    summary: 'Sound that holds up in a cinema and in earphones.',
    includes: ['Sound design', 'Mixing & mastering', 'Voice-over'],
  },
];

export const reelFlowCopy = {
  eyebrow: 'The process',
  title: 'One story, two crafts.',
  intro: 'Every project starts as one idea. On set, picture and sound are captured together — then each gets its own craft before they meet again in the master.',
  hint: 'Click a frame to project it — or flip between picture and sound.',
  play: 'Run the reel',
  pause: 'Pause',
  replay: 'Run it again',
  branches: { shared: 'Together', picture: 'Picture', sound: 'Sound' },
  end: { label: 'Master', body: 'Picture and sound meet again: final masters and every version you need, for screens big and small.' },
};

/**
 * The studio's process, shown on the Studio page as frames on a branching film strip.
 * Order matters: the reel runs through the frames in this order (see lib/filmFrames.ts for where each sits).
 */
export const reelFlow: FlowStage[] = [
  {
    id: 'idea',
    label: 'Idea',
    branch: 'shared',
    title: 'It starts with a conversation.',
    body: 'We listen first — the brief, the audience, the feeling you’re after — and shape it into a clear creative direction.',
    includes: ['Creative direction', 'Concept', 'Moodboards'],
  },
  {
    id: 'story',
    label: 'Story',
    branch: 'shared',
    title: 'Story & treatments',
    body: 'Scripts, storyboards and director treatments that everyone can see and agree on before a single frame is shot.',
    includes: ['Script development', 'Storyboards', 'Location scouting'],
  },
  {
    id: 'shoot',
    label: 'Shoot',
    branch: 'shared',
    title: 'The shoot',
    body: 'Direction, camera and on-set sound, captured together — commercials, short films, music videos and live sessions.',
    includes: ['Direction', 'Lighting & camera', 'Location sound'],
  },
  {
    id: 'edit',
    label: 'Edit',
    branch: 'picture',
    title: 'Editing',
    body: 'Where the story really gets written: pacing with feeling, every cut earning its place.',
    includes: ['Offline & online edit', 'Motion graphics', 'Social cut-downs'],
  },
  {
    id: 'colour',
    label: 'Colour',
    branch: 'picture',
    title: 'Colour grading',
    body: 'A palette built for the mood of each film, consistent from the first frame to the last.',
    includes: ['Colour grading', 'Look development', 'Finishing'],
  },
  {
    id: 'sound-design',
    label: 'Sound design',
    branch: 'sound',
    title: 'Sound design',
    body: 'Half of what you feel is what you hear. We build the world of the film in sound — atmosphere, effects, foley.',
    includes: ['Sound design', 'Foley & effects', 'Voice-over'],
  },
  {
    id: 'mix',
    label: 'Mix',
    branch: 'sound',
    title: 'Mixing & mastering',
    body: 'Dialogue, music and effects balanced so the mix holds up in a cinema and in earphones.',
    includes: ['Mixing', 'Mastering', 'Stereo & surround'],
  },
];

export const milestonesCopy = { eyebrow: 'Along the way', title: 'How we got here.' };

export const milestones: Milestone[] = [
  { year: '2019', title: 'Studio founded' },
  { year: '2021', title: 'Sound & post facility' },
  { year: '2023', title: 'Commercial direction' },
  { year: '2026', title: 'AV Productions today' },
];

// Names from the MVP's client list — logo files to be supplied by the owner
// Logos cleaned from the traced files in src/assets/logos (backgrounds removed, cropped) into public/logos
export const clients: Client[] = [
  { name: 'UTQ', logo: '/logos/utq.svg' },
  { name: 'Davic DJ', logo: '/logos/davic.svg', tone: 'colour' },
  { name: 'Grapa Media', logo: '/logos/grapa-media.svg' },
  { name: 'LE', logo: '/logos/le.svg', tone: 'colour' },
  { name: 'UTQ Youth Network and OneHope', logo: '/logos/utq-onehope.svg' },
  { name: 'Nicakai', logo: '/logos/nicakai.svg', tone: 'colour' },
];

// Placeholder testimonials from the MVP — replace with real client quotes
export const testimonials: Testimonial[] = [
  {
    quote: 'They turned our brand anthem into something that felt like a festival film.',
    pull: 'A festival film.',
    name: 'Marcus Vance',
    role: 'Brand Director',
  },
  {
    quote: 'Effortless to work with. Their eye for light and sound is rare.',
    pull: 'A rare eye.',
    name: 'Elena Rostova',
    role: 'Producer',
  },
  {
    quote: 'The mix alone moved our screening room. The best team we’ve partnered with.',
    pull: 'It moved the room.',
    name: 'David Lindqvist',
    role: 'Creative Lead',
  },
  {
    quote: 'Beautiful work, delivered ahead of schedule.',
    pull: 'Ahead of schedule.',
    name: 'Sophie Chen',
    role: 'Marketing Manager',
  },
];
