import type { Rng } from '../../rng.js';
import { HX, HY, INK } from './head.js';
import { circle, path, pt } from '../util.js';

export interface Eyes {
  svg: string;
  xs: readonly [number, number];
  y: number;
  /** Radius an eye may draw in. */
  size: number;
}

export function eyes(rng: Rng): Eyes {
  const happy = rng.chance(0.15);
  const spread = rng.float(6.5, 8);
  const xs = [HX - spread, HX + spread] as const;
  const y = HY + rng.float(0.5, 2.5);
  const r = rng.float(1.5, 1.9);
  const one = (x: number) =>
    happy
      ? path(`M ${pt(x - 1.8, y + 0.6)} Q ${pt(x, y - 1.6)} ${pt(x + 1.8, y + 0.6)}`, ` fill="none" stroke="${INK}" stroke-width="1.3" stroke-linecap="round"`)
      : circle(x, y, r, ` fill="${INK}"`);
  return { svg: one(xs[0]) + one(xs[1]), xs, y, size: happy ? 1.9 : r };
}
