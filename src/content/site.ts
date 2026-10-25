import type { NavItem, SiteInfo } from '@/types';

/** Studio details used across the site (header, footer, contact page). */
export const site: SiteInfo = {
  name: 'AV Productions',
  tagline: 'Film & Sound Studio',
  email: 'projectfilesav@gmail.com',
  phone: '+254 759 514 351',
  location: 'Nairobi, Kenya', // TODO: confirm with the owner (assumed from the +254 number)
  // Add the studio's real profile URLs — links with an empty url are hidden
  socials: [
    { platform: 'Instagram', url: '' },
    { platform: 'YouTube', url: '' },
    { platform: 'Vimeo', url: '' },
  ],
};

/** Footer copy. The clock shows the studio's local time; credits list artwork that needs attribution. */
export const footer = {
  tagline: 'Stories that move people,',
  taglineAccent: 'framed and sounded with care.',
  explore: 'Explore',
  contact: 'Get in touch',
  clock: { city: 'Nairobi', timeZone: 'Africa/Nairobi', zone: 'EAT' }, // TODO: confirm location with the owner
  rewind: 'Rewind',
  rights: 'All rights reserved.',
  credits: 'Credits',
  creditsList: [
    {
      text: 'Balance scale illustration by HTGS (modified), CC BY-SA 4.0',
      url: 'https://commons.wikimedia.org/wiki/File:Balanced_justice_scale_silhouette,_small.svg',
    },
  ],
  wordmark: 'AV PRODUCTIONS',
};

/** Labels shown in the viewfinder cursor over project imagery (desktop). */
export const cursorLabels = {
  view: 'View',
  next: 'Next',
  load: 'Load',
};

/** Main navigation, in display order. */
export const navigation: NavItem[] = [
  { label: 'Work', to: '/work' },
  { label: 'Studio', to: '/studio' },
  { label: 'Contact', to: '/contact' },
];
