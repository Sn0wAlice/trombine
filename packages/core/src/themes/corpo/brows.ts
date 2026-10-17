import type { Rng } from '../../rng.js';
import type { Eyes } from './eyes.js';
import type { Glasses } from './glasses.js';
import { path, pt } from '../util.js';

/** Sits above the glasses frame when there is one. */
export function brows(rng: Rng, eyes: Eyes, glasses: Glasses | null, color: string): string {
  const y = (glasses ? glasses.top : eyes.y - eyes.size) - rng.float(1.8, 3);
  const w = rng.float(2.2, 3);
  const tilt = rng.float(-0.5, 1); // > 0 = outer end lower
  const d = eyes.xs
    .map((x, i) => {
      const out = i === 0 ? -1 : 1;
      return `M ${pt(x - out * w, y)} L ${pt(x + out * w, y + tilt)}`;
    })
    .join(' ');
  return path(d, ` fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round"`);
}
