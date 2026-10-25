/** Contact page copy: the fill-in-the-script sentence, its blanks, and FAQs. */

export type ScriptFieldName = 'name' | 'type' | 'date' | 'location' | 'budget' | 'idea' | 'email';

/** The sentence, in order: plain text pieces and blanks (fields). Edit the wording here. */
export const script: ({ text: string } | { field: ScriptFieldName })[] = [
  { text: 'Hi AV, I’m ' },
  { field: 'name' },
  { text: '. We’re making ' },
  { field: 'type' },
  { text: ' and want to shoot around ' },
  { field: 'date' },
  { text: ' in ' },
  { field: 'location' },
  { text: '. The budget is ' },
  { field: 'budget' },
  { text: '. The idea, in a line: ' },
  { field: 'idea' },
  { text: '. Reach me at ' },
  { field: 'email' },
  { text: '.' },
];

interface TextBlank {
  kind: 'text' | 'email';
  label: string;
  placeholder: string;
  required?: boolean;
}
interface SelectBlank {
  kind: 'select';
  label: string;
  placeholder: string;
  required?: boolean;
  options: string[];
}

export const blanks: Record<ScriptFieldName, TextBlank | SelectBlank> = {
  name: { kind: 'text', label: 'Your name', placeholder: 'your name', required: true },
  type: {
    kind: 'select',
    label: 'What you’re making',
    placeholder: 'something',
    required: true,
    options: ['a commercial', 'a music video', 'a short film', 'a documentary', 'something with sound', 'something else'],
  },
  date: { kind: 'text', label: 'When', placeholder: 'next month' },
  location: { kind: 'text', label: 'Where', placeholder: 'Nairobi' },
  budget: {
    kind: 'select',
    label: 'Budget',
    placeholder: 'still open',
    // Placeholder ranges — confirm with the owner
    options: ['under KES 100k', 'KES 100k – 500k', 'KES 500k – 1M', 'over KES 1M', 'still open'],
  },
  idea: { kind: 'text', label: 'The idea in a line', placeholder: 'a love story in one take' },
  email: { kind: 'email', label: 'Your email', placeholder: 'you@email.com', required: true },
};

export const contact = {
  eyebrow: 'Contact',
  replyNote: 'We reply within a day.',
  send: 'Send it',
  sending: 'Sending…',
  missing: 'Fill in the highlighted blanks so we know who to call back.',
  invalidEmail: 'That email doesn’t look right — check it so we can reply.',
  failed: 'That didn’t send. Please try again, or email us directly.',
  pick: { sheet: 'Contact sheet', hint: 'Circle one' },
  slate: { prod: 'Prod', scene: 'Scene', date: 'Date', take: 'Take', director: 'Dir.' },
  success: {
    kicker: 'And…',
    title: 'Action.',
    body: (name: string) => `Got your script${name ? `, ${name}` : ''}. We’ll be in touch within a day.`,
    again: 'Write another',
    devNote: 'Local preview — nothing was actually sent. Submissions work once the site is deployed on Netlify.',
  },
  direct: { email: 'Email', whatsapp: 'WhatsApp', phone: 'Call' },
  faq: { eyebrow: 'Good to know', title: 'Before you ask.' },
};

// From the MVP's FAQ, shortened — confirm details with the owner
export const faqs = [
  {
    question: 'How long does a project take?',
    answer: 'Most commercials and short films take 3 to 6 weeks from treatment to final delivery. Rush jobs are possible — just ask.',
  },
  {
    question: 'What happens after I get in touch?',
    answer: 'We read your note, then call to talk through the idea, the scope and the schedule before anything is agreed.',
  },
  {
    question: 'Do you shoot on location?',
    answer: 'Yes. We travel with compact, cinema-grade kits for shoots across Kenya and beyond.',
  },
  {
    question: 'What do I get at the end?',
    answer: 'High-quality master files, cut-downs for social (9:16, 4:5, 1:1) and the final audio mix — plus anything else agreed upfront.',
  },
];
