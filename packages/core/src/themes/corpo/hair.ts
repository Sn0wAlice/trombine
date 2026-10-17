import type { Rng } from '../../rng.js';
import { HX, HY, type Head } from './head.js';
import { circle, path, smoothClosed, type Pt } from '../util.js';

const COLORS = [
  ['#1f1a17', 25],
  ['#3b2a20', 25],
  ['#6b4a32', 18],
  ['#9a4a2a', 8],
  ['#d8b26e', 12],
  ['#9a9a9a', 8],
  ['#e8e4dc', 4],
] as const;

export interface Hair {
  /** Behind the head (long hair, bun). */
  back: string;
  /** Over the head (cap, fringe, curls). */
  front: string;
  color: string;
  /** Brows and beard color: white hair gets slightly darker brows so they stay visible. */
  brow: string;
}

export function hair(rng: Rng, head: Head): Hair {
  const color = rng.weighted(COLORS);
  const style = rng.weighted([
    ['short', 30],
    ['side', 22],
    ['long', 18],
    ['curly', 12],
    ['bun', 10],
    ['buzz', 5],
    ['bald', 3],
  ] as const);
  const fill = ` fill="${color}"`;
  const { rx, ry } = head;

  // Cap: outer arc over the skull, then back along the hairline.
  const cap = (k: number, height: number, part: number): string => {
    const outer: Pt[] = [];
    for (let i = 0; i <= 12; i++) outer.push(head.around(Math.PI - 0.25 + (i / 12) * (Math.PI + 0.5), k));
    const line = HY - ry * height;
    const hairline: Pt[] = [
      [HX + rx * 0.88, HY + 1],
      [HX + rx * 0.5, line + 3 - part * 0.15],
      [HX + part, line],
      [HX - rx * 0.5, line + 3 + part * 0.15],
      [HX - rx * 0.88, HY + 1],
    ];
    return path(smoothClosed([...outer, ...hairline]), fill);
  };

  let back = '';
  let front = '';
  switch (style) {
    case 'short':
      front = cap(rng.float(2, 3), rng.float(0.4, 0.55), rng.float(-2, 2));
      break;
    case 'side':
      front = cap(rng.float(2, 3.2), rng.float(0.35, 0.5), rng.pick([-1, 1]) * rng.float(4, 7));
      break;
    case 'buzz':
      front = cap(0.8, rng.float(0.55, 0.65), 0);
      break;
    case 'bun':
      back = circle(HX, HY - ry - 3, rng.float(5, 6.5), fill);
      front = cap(1.8, rng.float(0.5, 0.6), 0);
      break;
    case 'long': {
      const len = ry * rng.float(0.5, 1.1);
      const top: Pt[] = [];
      for (let i = 0; i <= 8; i++) top.push(head.around(Math.PI + (i / 8) * Math.PI, 3));
      back = path(
        smoothClosed([
          [HX - rx - 3, HY + len],
          ...top,
          [HX + rx + 3, HY + len],
          [HX + rx * 0.6, HY + len + 2],
          [HX - rx * 0.6, HY + len + 2],
        ]),
        fill,
      );
      front = cap(rng.float(2, 3), rng.float(0.4, 0.55), rng.float(-5, 5));
      break;
    }
    case 'curly': {
      front = cap(2, rng.float(0.45, 0.55), 0);
      const r = rng.float(3, 4);
      for (let i = 0; i <= 10; i++) front += circle(...head.around(Math.PI - 0.1 + (i / 10) * (Math.PI + 0.2), 2), r, fill);
      break;
    }
    case 'bald':
      break;
  }

  return { back, front, color, brow: color === '#e8e4dc' ? '#a9a49c' : color };
}
