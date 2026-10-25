/**
 * A line-art Nairobi skyline, drawn in code: one continuous roofline with each real landmark once,
 * roughly in the order seen looking across the CBD, with Upper Hill's towers rising on the right.
 * Shapes are simplified from the real buildings (not traced from a photo) — adjust here if needed.
 *
 * Drawing units: 1600 wide; ground at y = 210, with the soundwave below it down to y = 280.
 * Heights are loosely to scale. The landmarks are centred, so cropping the sides keeps them all.
 */
export const SKYLINE_VIEWBOX = { width: 1600, height: 280 };
export const GROUND = 210;
const G = GROUND;
/** Shifts the whole group of landmarks so it sits centred in the drawing */
const DX = 95;
/** Rooftop level of the low buildings between landmarks */
const LOW = G - 18;

type Point = [number, number];

// Each landmark: its outline from its left edge at the low rooftop level to its right edge
const landmarks: Record<string, (x: number) => Point[]> = {
  // Parliament: low block with the clock tower and its pyramid roof
  clockTower: (x) => [[x, LOW], [x, G - 36], [x + 20, G - 36], [x + 20, G - 62], [x + 29, G - 80], [x + 38, G - 62], [x + 38, G - 36], [x + 60, G - 36], [x + 60, LOW]],
  // KICC: the conical amphitheatre roof, then the round tower with its rooftop saucer
  kicc: (x) => [[x, LOW], [x, G - 26], [x + 30, G - 44], [x + 60, G - 28], [x + 70, G - 28], [x + 70, G - 92], [x + 62, G - 94], [x + 62, G - 100], [x + 108, G - 100], [x + 108, G - 94], [x + 100, G - 92], [x + 100, G - 28], [x + 116, G - 28], [x + 116, LOW]],
  // Times Tower: tall slab crowned by an open frame
  timesTower: (x) => [[x, LOW], [x, G - 120], [x + 4, G - 120], [x + 4, G - 132], [x + 38, G - 132], [x + 38, G - 120], [x + 42, G - 120], [x + 42, LOW]],
  // Teleposta Towers: slab with a sloping roof
  teleposta: (x) => [[x, LOW], [x, G - 86], [x + 44, G - 100], [x + 44, LOW]],
  // Nation Centre: twin towers with pointed caps
  nationCentre: (x) => [[x, LOW], [x, G - 70], [x + 11, G - 82], [x + 22, G - 70], [x + 22, G - 50], [x + 28, G - 50], [x + 28, G - 76], [x + 39, G - 88], [x + 50, G - 76], [x + 50, LOW]],
  // Hilton: the round tower
  hilton: (x) => [[x, LOW], [x, G - 55], [x + 8, G - 58], [x + 24, G - 58], [x + 32, G - 55], [x + 32, LOW]],
  // Anniversary Towers: slab with a flared crown
  anniversary: (x) => [[x, LOW], [x, G - 84], [x - 3, G - 89], [x + 39, G - 89], [x + 36, G - 84], [x + 36, LOW]],
  // Britam Tower (Upper Hill): the tapered prism with its sloped top
  britam: (x) => [[x, LOW], [x + 2, G - 158], [x + 44, G - 188], [x + 48, LOW]],
  // UAP Old Mutual Tower (Upper Hill): stepped top and spire
  uap: (x) => [[x, LOW], [x, G - 140], [x + 6, G - 146], [x + 15, G - 146], [x + 17, G - 170], [x + 19, G - 146], [x + 28, G - 146], [x + 34, G - 140], [x + 34, LOW]],
};

/** Where each landmark stands (its left edge), left to right */
const AT = {
  clockTower: 250 + DX,
  kicc: 345 + DX,
  timesTower: 500 + DX,
  teleposta: 590 + DX,
  nationCentre: 680 + DX,
  hilton: 770 + DX,
  anniversary: 850 + DX,
  britam: 1040 + DX,
  uap: 1130 + DX,
};
const PLACEMENT = Object.entries(AT) as [keyof typeof landmarks, number][];

/** Low buildings between and around the landmarks: [from x, to x, height above ground] */
const LOW_BLOCKS: [number, number, number][] = [
  [40, 90, 26], [130, 175, 32], [205, 255, 28], [290, 330, 24],
  ...([[470, 492, 30], [645, 668, 34], [736, 762, 28], [905, 950, 30], [975, 1020, 38], [1094, 1124, 26], [1185, 1240, 34], [1290, 1330, 28]] as [number, number, number][]).map(
    ([a, b, h]): [number, number, number] => [a + DX, b + DX, h],
  ),
  [1450, 1500, 26], [1530, 1575, 30],
];

function buildRoofline(): Point[] {
  const shapes = [
    ...PLACEMENT.map(([name, x]) => landmarks[name](x)),
    ...LOW_BLOCKS.map(([a, b, h]): Point[] => [[a, LOW], [a, G - h], [b, G - h], [b, LOW]]),
  ].sort((p, q) => p[0][0] - q[0][0]);
  return [[0, LOW], ...shapes.flat(), [SKYLINE_VIEWBOX.width, LOW]];
}

const toPath = (points: Point[]) => points.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');

export const ROOFLINE = buildRoofline();
export const ROOFLINE_PATH = toPath(ROOFLINE);
/** KICC on its own, drawn over the roofline in the brand colour */
export const KICC_PATH = toPath(landmarks.kicc(AT.kicc).slice(1, -1));

/** A few quiet inner lines that give the landmarks character (KICC's fins and mast, the clock, Times Tower's crown) */
const k = AT.kicc;
export const DETAILS_PATH = [
  `M${k + 77} 118 V182 M${k + 85} 118 V182 M${k + 93} 118 V182`, // KICC fins
  `M${k + 85} 110 V100`, // KICC mast
  `M${AT.timesTower + 4} 90 H${AT.timesTower + 38}`, // Times Tower crown frame
  `M${AT.clockTower + 29} 155 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0`, // Parliament clock face
  `M${AT.hilton} 165 H${AT.hilton + 32} M${AT.hilton} 175 H${AT.hilton + 32}`, // Hilton bands
].join(' ');

/**
 * The roofline's height at each of `count` evenly spaced points, for the soundwave: 0 at the low
 * rooftops between landmarks, 1 at the tallest tower — so the wave is quiet between landmarks.
 */
export function rooflineHeights(count: number): number[] {
  return Array.from({ length: count }, (_, i) => {
    const x = ((i + 0.5) / count) * SKYLINE_VIEWBOX.width;
    // Highest point of the roofline at this x
    let top = LOW;
    for (let k = 1; k < ROOFLINE.length; k++) {
      const [x1, y1] = ROOFLINE[k - 1];
      const [x2, y2] = ROOFLINE[k];
      if (x < Math.min(x1, x2) || x > Math.max(x1, x2)) continue;
      const y = x1 === x2 ? Math.min(y1, y2) : y1 + ((y2 - y1) * (x - x1)) / (x2 - x1);
      top = Math.min(top, y);
    }
    return G - top;
  }).map((h, _i, all) => Math.max(0, (h - (G - LOW)) / (Math.max(...all) - (G - LOW))));
}
