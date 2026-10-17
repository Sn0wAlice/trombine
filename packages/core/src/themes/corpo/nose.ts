import type { Rng } from '../../rng.js';
import type { Eyes } from './eyes.js';
import { HX, type Head } from './head.js';
import { path, pt } from '../util.js';

export function nose(rng: Rng, head: Head, eyes: Eyes): string {
  const y = eyes.y + rng.float(4, 5);
  const d = rng.chance(0.5)
    ? `M ${pt(HX - 1.6, y)} Q ${pt(HX, y + 1.8)} ${pt(HX + 1.6, y)}`
    : `M ${pt(HX, y - 3)} Q ${pt(HX - 1.8, y + 0.5)} ${pt(HX + 0.8, y + 0.8)}`;
  return path(d, ` fill="none" stroke="${head.shade}" stroke-width="1.3" stroke-linecap="round"`);
}
