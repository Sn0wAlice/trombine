import type { Rng } from '../../rng.js';
import type { Eyes } from './eyes.js';
import { CX, circle, path, pt, rect } from './util.js';

export interface Glasses {
  svg: string;
  top: number;
  bottom: number;
}

/** Frames are centered on the eyes, so they always enclose them. */
export function glasses(rng: Rng, eyes: Eyes): Glasses | null {
  if (!rng.chance(0.3)) return null;
  const kind = rng.pick(['round', 'square', 'tiny'] as const);
  const [lx, rx] = eyes.xs;
  const { y, size } = eyes;
  // Leave a gap for the bridge; eye spacing guarantees r > size + stroke width.
  const r = Math.min((rx - lx) / 2 - 1.5, kind === 'tiny' ? size + 1.8 : size + rng.float(3, 5.5));

  const frame = (x: number) => (kind === 'square' ? rect(x - r, y - r * 0.85, 2 * r, 1.7 * r, r * 0.3) : circle(x, y, r));
  const bridge = path(`M ${pt(lx + r, y)} Q ${pt(CX, y - r * 0.4)} ${pt(rx - r, y)}`);
  const top = kind === 'square' ? y - r * 0.85 : y - r;
  return { svg: frame(lx) + frame(rx) + bridge, top, bottom: 2 * y - top };
}
