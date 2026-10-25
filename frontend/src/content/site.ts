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

/** Main navigation, in display order. */
export const navigation: NavItem[] = [
  { label: 'Work', to: '/work' },
  { label: 'Studio', to: '/studio' },
  { label: 'Contact', to: '/contact' },
];
