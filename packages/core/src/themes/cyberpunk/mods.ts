import type { Rng } from '../../rng.js';
import type { Eyes } from './eyes.js';
import { HX, HY, type Head } from './head.js';
import type { Palette } from './palette.js';
import { circle, path, pt, rect } from '../util.js';

/** Circuit-trace tattoo on one cheek. */
export function tattoo(rng: Rng, eyes: Eyes, p: Palette): string {
  if (!rng.chance(0.3)) return '';
  const s = rng.pick([-1, 1]);
  const x = HX + s * rng.float(6, 8);
  const y = eyes.y + rng.float(4, 6);
  const d = `M ${pt(x, y)} L ${pt(x + s * 2.5, y)} L ${pt(x + s * 4, y + 2)} L ${pt(x + s * 4, y + 4.5)}`;
  const style = ` fill="none" stroke="${p.neon2}" stroke-width=".7" stroke-linecap="round" stroke-linejoin="round"`;
  return path(d, style + p.glow) + path(d, style) + circle(x, y, 0.7, ` fill="${p.neon2}"`) + circle(x + s * 4, y + 4.5, 0.7, ` fill="${p.neon2}"`);
}

/** Metal plate on the temple with status LEDs. */
export function implant(rng: Rng, head: Head, p: Palette): string {
  if (!rng.chance(0.22)) return '';
  const s = rng.pick([-1, 1]);
  const x = HX + s * (head.rx - 3.5);
  const y = HY - rng.float(5, 8);
  return (
    rect(x - 2, y - 4, 4, 8, 1, ' fill="#2a2f3a" stroke="#6b7280" stroke-width=".5"') +
    circle(x, y - 1.8, 0.7, ` fill="${p.neon}"${p.glow}`) +
    circle(x, y - 1.8, 0.6, ` fill="${p.neon}"`) +
    circle(x, y + 0.6, 0.6, ` fill="${p.neon2}"`)
  );
}
