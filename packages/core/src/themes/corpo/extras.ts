import type { Rng } from '../../rng.js';
import { HX, HY, type Head } from './head.js';
import { circle, path, pt, rect } from '../util.js';

const DARK = '#33363b';

/** Support/call-center headset. */
export function headset(rng: Rng, head: Head): string {
  if (!rng.chance(0.08)) return '';
  const x0 = HX - head.rx - 1.5;
  const x1 = HX + head.rx + 1.5;
  const top = HY - head.ry * 1.6;
  const line = ` fill="none" stroke="${DARK}" stroke-linecap="round"`;
  return (
    path(`M ${pt(x0, HY)} C ${pt(x0, top)} ${pt(x1, top)} ${pt(x1, HY)}`, `${line} stroke-width="2.4"`) +
    rect(x0 - 2.5, HY - 4, 5, 9, 2, ` fill="${DARK}"`) +
    rect(x1 - 2.5, HY - 4, 5, 9, 2, ` fill="${DARK}"`) +
    path(`M ${pt(x0, HY + 4)} Q ${pt(x0 + 3, head.mouthY + 3)} ${pt(HX - 5.5, head.mouthY + 1)}`, `${line} stroke-width="1.3"`) +
    circle(HX - 5.5, head.mouthY + 1, 1.4, ` fill="${DARK}"`)
  );
}

/** Lanyard and company badge. */
export function badge(rng: Rng): string {
  if (!rng.chance(0.12)) return '';
  const strap = rng.pick(['#d64545', '#2d6a9f', '#2f855a', '#b7791f']);
  const bx = HX + rng.float(4, 9);
  return (
    path(`M ${pt(HX - 7, 74)} L ${pt(bx, 87)} L ${pt(HX + 7, 74)}`, ` fill="none" stroke="${strap}" stroke-width="1.2" stroke-linejoin="round"`) +
    rect(bx - 4, 87, 8, 10, 1, ' fill="#fff"') +
    rect(bx - 4, 87, 8, 2.5, 1, ` fill="${strap}"`) +
    circle(bx, 92.5, 1.6, ' fill="#cbd5e0"')
  );
}
