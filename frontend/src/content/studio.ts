import type { Client, FlowStage, Milestone, Service, Testimonial } from '@/types';

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

export const signalFlowCopy = {
  eyebrow: 'Signal flow',
  title: 'From first idea to final master.',
  hint: 'Scroll to follow the signal — or click a stage.',
};

/**
 * The studio's process as a signal chain, shown on the Studio page.
 * Order matters: the cable runs through the stages in this order.
 */
export const signalFlow: FlowStage[] = [
  {
    id: 'idea',
    label: 'Idea',
    title: 'It starts with a conversation.',
    body: 'We listen first — the brief, the audience, the feeling you’re after — and shape it into a clear creative direction.',
    includes: ['Creative direction', 'Concept', 'Moodboards'],
  },
  {
    id: 'story',
    label: 'Story',
    title: 'Story & treatments',
    body: 'Scripts, storyboards and director treatments that everyone can see and agree on before a single frame is shot.',
    includes: ['Script development', 'Storyboards', 'Location scouting'],
  },
  {
    id: 'camera',
    label: 'Camera',
    title: 'Direction & cinematography',
    body: 'From lighting to the last shot on set — commercials, short films, music videos and live sessions.',
    includes: ['Direction', 'Lighting & camera', 'Music videos & live sessions'],
  },
  {
    id: 'edit',
    label: 'Edit',
    title: 'Editing',
    body: 'Where the story really gets written: pacing with feeling, every cut earning its place.',
    includes: ['Offline & online edit', 'Motion graphics', 'Social cut-downs'],
  },
  {
    id: 'colour',
    label: 'Colour',
    title: 'Colour grading',
    body: 'A palette built for the mood of each film, consistent from the first frame to the last.',
    includes: ['Colour grading', 'Look development', 'Finishing'],
  },
  {
    id: 'sound',
    label: 'Sound',
    title: 'Sound design & mixing',
    body: 'Half of what you feel is what you hear. We design and mix sound that holds up in a cinema and in earphones.',
    includes: ['Sound design', 'Mixing & mastering', 'Voice-over'],
  },
  {
    id: 'master',
    label: 'Master',
    title: 'Master & delivery',
    body: 'Final masters and every version you need — ready for TV, cinema, web and social.',
    includes: ['Master files', '9:16 · 4:5 · 1:1 versions', 'Final audio mix'],
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
export const clients: Client[] = [
  { name: 'Phoneplace Kenya' },
  { name: 'TTNT 6 Seasons' },
  { name: 'Zunguka Africa' },
  { name: 'FunCity Studios' },
  { name: 'Gold White Studios' },
  { name: 'Apex Motion' },
  { name: 'Horizon Cinema' },
  { name: 'Luminary Media' },
  { name: 'Red Print Creatives' },
  { name: 'E-White Visuals' },
];

// Placeholder testimonials from the MVP — replace with real client quotes
export const testimonials: Testimonial[] = [
  {
    quote: 'They turned our brand anthem into something that felt like a festival film.',
    name: 'Marcus Vance',
    role: 'Brand Director',
  },
  {
    quote: 'Effortless to work with. Their eye for light and sound is rare.',
    name: 'Elena Rostova',
    role: 'Producer',
  },
  {
    quote: 'The mix alone moved our screening room. The best team we’ve partnered with.',
    name: 'David Lindqvist',
    role: 'Creative Lead',
  },
  {
    quote: 'Beautiful work, delivered ahead of schedule.',
    name: 'Sophie Chen',
    role: 'Marketing Manager',
  },
];
