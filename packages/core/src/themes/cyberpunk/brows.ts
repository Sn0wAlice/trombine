import type { Rng } from '../../rng.js';
import { INK } from './head.js';
import type { Eyes } from './eyes.js';
import { path, pt } from '../util.js';

/** Tapered brows, thick at the inner end, slightly angry. Hidden by a visor. */
export function brows(rng: Rng, eyes: Eyes): string {
  if (eyes.visor) return '';
  const y = eyes.y - rng.float(3.6, 4.4);
  const w = rng.float(2.8, 3.4);
  const tilt = rng.float(0.2, 1.3); // inner end lower
  const arch = rng.float(0.6, 1.4);
  const thick = rng.float(1.1, 1.5);
  // Upper edge arches; lower edge runs straighter, so the brow tapers to a point at the outer end.
  const d = eyes.xs.map((x, i) => {
    const inward = i === 0 ? 1 : -1;
    const [ox, oy] = [x - inward * (w + 0.8), y + 0.6];
    const [ix, iy] = [x + inward * w, y + tilt];
    return (
      `M ${pt(ox, oy)} Q ${pt(x - inward * 0.4, y - arch - 0.4)} ${pt(ix, iy - thick)}` +
      ` L ${pt(ix, iy)} Q ${pt(x, y - arch * 0.3 + 0.6)} ${pt(ox, oy)} Z`
    );
  });
  return path(d.join(' '), ` fill="${INK}" stroke="${INK}" stroke-width=".25" stroke-linejoin="round"`);
}
