import { useEffect, useState } from 'react';

/**
 * Measures an image's silhouette: splits it into `bars` vertical strips and returns, for each,
 * how tall the drawing is there (0–1). Used to turn the skyline into a matching soundwave.
 * The image must be same-origin (e.g. imported from src/assets) so the canvas can be read.
 */
export function useSilhouetteHeights(src: string, bars: number, aspect: number) {
  const [heights, setHeights] = useState<number[]>([]);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      const width = 600;
      const height = Math.round(width / aspect);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, width, height);
      const { data } = ctx.getImageData(0, 0, width, height);

      const result: number[] = [];
      const strip = width / bars;
      for (let b = 0; b < bars; b++) {
        const x = Math.floor(b * strip + strip / 2);
        let top = height;
        for (let y = 0; y < height; y++) {
          if (data[(y * width + x) * 4 + 3] > 40) {
            top = y;
            break;
          }
        }
        result.push(1 - top / height);
      }
      if (!cancelled) setHeights(result);
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src, bars, aspect]);

  return heights;
}
