import type { Rng } from '../../rng.js';
import type { Eyes } from './eyes.js';
import { HX, INK, type Head } from './head.js';
import { circle, path, pt, rect } from '../util.js';

export interface Glasses {
  svg: string;
  top: number;
}

/** Frames are centered on the eyes, so they always enclose them. */
export function glasses(rng: Rng, head: Head, eyes: Eyes): Glasses | null {
  if (!rng.chance(0.25)) return null;
  const square = rng.chance(0.5);
  const frameColor = rng.pick([INK, INK, '#6b4a32', '#8a8f98', '#9b2c2c']);
  const [lx, rx] = eyes.xs;
  const { y } = eyes;
  // Half width of one frame, capped so the two frames never touch.
  const w = Math.min(rng.float(3.8, 4.6), (rx - lx) / 2 - 1.2);
  const style = ` fill="#fff" fill-opacity=".2" stroke="${frameColor}" stroke-width="1.1"`;
  const frame = (x: number) => (square ? rect(x - w, y - w * 0.75, 2 * w, 1.5 * w, 1.5, style) : circle(x, y, w, style));
  const line = ` fill="none" stroke="${frameColor}" stroke-width="1.1" stroke-linecap="round"`;
  const bridge = path(`M ${pt(lx + w, y)} Q ${pt(HX, y - 1.5)} ${pt(rx - w, y)}`, line);
  const temples = path(`M ${pt(lx - w, y)} L ${pt(HX - head.rx + 0.5, y - 1)} M ${pt(rx + w, y)} L ${pt(HX + head.rx - 0.5, y - 1)}`, line);
  return { svg: temples + frame(lx) + frame(rx) + bridge, top: square ? y - w * 0.75 : y - w };
}
