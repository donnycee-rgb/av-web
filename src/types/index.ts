export interface NavItem {
  label: string;
  to: string;
}

export interface SocialLink {
  platform: 'Instagram' | 'YouTube' | 'Vimeo' | 'TikTok' | 'LinkedIn' | 'X';
  url: string;
}

export interface SiteInfo {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  socials: SocialLink[];
}

export interface Category {
  id: string;
  name: string;
}

export interface Project {
  slug: string;
  title: string;
  categoryId: Category['id'];
  /** One sentence — shown on cards */
  summary: string;
  /** Two or three sentences — shown on the project page */
  overview: string;
  /** What the studio did, e.g. ['Direction', 'Colour'] */
  role: string[];
  image: string;
  /** Extra frames shown on the project page */
  stills: string[];
  year: string;
  featured?: boolean;
}

export interface Service {
  id: string;
  title: string;
  summary: string;
  /** Short list of what's included */
  includes: string[];
}

export interface Client {
  name: string;
  /** Path to a logo file in /public — when missing, the name is shown as a wordmark */
  logo?: string;
  /**
   * How the logo is shown on the dark logo strip: 'mono' turns it white (for flat wordmarks),
   * 'colour' keeps its own colours (for emblems and illustrated badges). Default 'mono'.
   */
  tone?: 'mono' | 'colour';
}

export interface Testimonial {
  quote: string;
  /** A few words from the quote, shown inside its laurel */
  pull: string;
  name: string;
  role: string;
}

export interface Milestone {
  year: string;
  title: string;
}

export interface FlowStage {
  id: string;
  /** Short frame label, e.g. "Edit" */
  label: string;
  /** Which part of the branching reel: before the split, or the picture / sound branch */
  branch: 'shared' | 'picture' | 'sound';
  title: string;
  body: string;
  includes: string[];
}
