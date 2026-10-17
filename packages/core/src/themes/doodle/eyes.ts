import type { Rng } from '../../rng.js';
import type { Head } from './head.js';
import { CX, CY, circle, dot, path, pt } from './util.js';

export interface Eyes {
  svg: string;
  /** Centers of the left and right eye. */
  xs: readonly [number, number];
  y: number;
  /** Radius of the area an eye may draw in. */
  size: number;
}

export function eyes(rng: Rng, head: Head): Eyes {
  const style = rng.weighted([
    ['dots', 30],
    ['pupils', 30],
    ['happy', 20],
    ['sleepy', 17],
    ['x', 3],
  ] as const);
  const spread = head.rx * rng.float(0.33, 0.42);
  const xs = [CX - spread, CX + spread] as const;
  const y = CY - head.ry * rng.float(0.05, 0.2);
  const s = rng.float(2.5, 4.5);
  // Gaze is only drawn for pupils; closed styles never get one.
  const [gx, gy] = style === 'pupils' ? [rng.float(-0.4, 0.4) * s, rng.float(-0.4, 0.4) * s] : [0, 0];

  const one = (x: number, outward: number): string => {
    switch (style) {
      case 'dots':
        return dot(x, y, s * 0.45);
      case 'pupils':
        return circle(x, y, s) + dot(x + gx, y + gy, s * 0.45);
      case 'happy':
        return path(`M ${pt(x - s, y + s * 0.4)} Q ${pt(x, y - s * 1.2)} ${pt(x + s, y + s * 0.4)}`);
      case 'sleepy': // drooping toward the outside, mirrored
        return path(`M ${pt(x - outward * s, y)} Q ${pt(x, y + s * 0.3)} ${pt(x + outward * s, y + s * 0.4)}`);
      case 'x': {
        const k = s * 0.7;
        return path(`M ${pt(x - k, y - k)} L ${pt(x + k, y + k)} M ${pt(x + k, y - k)} L ${pt(x - k, y + k)}`);
      }
    }
  };

  return { svg: one(xs[0], -1) + one(xs[1], 1), xs, y, size: s };
}
