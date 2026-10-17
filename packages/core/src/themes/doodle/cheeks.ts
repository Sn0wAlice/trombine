import type { Rng } from '../../rng.js';
import type { Eyes } from './eyes.js';
import type { Glasses } from './glasses.js';
import { path, pt } from './util.js';

/** Two little "///" hatches under the eyes (below the glasses if any). */
export function cheeks(rng: Rng, eyes: Eyes, glasses: Glasses | null): string {
  if (!rng.chance(0.15)) return '';
  const out = rng.float(1, 3);
  const y = Math.max(eyes.y + rng.float(6, 8), glasses ? glasses.bottom + 2.5 : 0);
  let d = '';
  for (const [i, x] of eyes.xs.entries()) {
    const cx = x + (i ? out : -out);
    for (let k = -1; k <= 1; k++) d += ` M ${pt(cx + k * 2 - 0.8, y + 1.2)} L ${pt(cx + k * 2 + 0.8, y - 1.2)}`;
  }
  return path(d.trim(), ' stroke-width="1.4"');
}
