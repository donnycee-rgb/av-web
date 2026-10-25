/**
 * Placeholder photography (Unsplash) until the owner's real stills arrive.
 * Swap a project's `image` for a local file in /public/images when ready.
 */
export const placeholder = (photoId: string, width = 1600) =>
  `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=${width}&q=75`;

export const PLACEHOLDER_IDS = {
  camera: '1492691527719-9d1e07e534b4',
  clapper: '1485846234645-a62644f84728',
  cinema: '1489599849927-2ee91cede3ba',
  car: '1503376780353-7e6692767b70',
  synth: '1511671782779-c97d3d27a1d4',
  stage: '1518676590629-3dcbd9c5a5c9',
  perfume: '1547887537-6158d64c35b3',
  filmSet: '1574717024653-61fd2cf4d44d',
  studio: '1598488035139-bdbb2231ce04',
} as const;
