import type { Rng } from '../../rng.js';
import { CX, CY, path, smoothClosed, type Pt } from './util.js';

export interface Head {
  svg: string;
  rx: number;
  ry: number;
  /** Point on the (un-wobbled) outline at angle t, 0 = right, -PI/2 = top. */
  edge(t: number): Pt;
}

export function head(rng: Rng): Head {
  const shape = rng.pick(['circle', 'egg', 'squircle'] as const);
  const rx = rng.float(27, 32);
  const ry = rng.float(29, 33);

  const edge = (t: number): Pt => {
    const c = Math.cos(t);
    const s = Math.sin(t);
    if (shape === 'squircle') {
      return [CX + rx * Math.sign(c) * Math.sqrt(Math.abs(c)), CY + ry * Math.sign(s) * Math.sqrt(Math.abs(s))];
    }
    const w = shape === 'egg' ? 1 + 0.1 * s : 1; // egg: narrow top, wide bottom
    return [CX + rx * w * c, CY + ry * s];
  };

  // Hand-drawn feel: sample the outline and jitter each point radially.
  const wobble = rng.chance(0.7) ? rng.float(0.015, 0.035) : 0;
  const count = rng.int(16, 24);
  const pts: Pt[] = [];
  for (let i = 0; i < count; i++) {
    const [x, y] = edge((i / count) * 2 * Math.PI);
    const j = 1 + rng.float(-wobble, wobble);
    pts.push([CX + (x - CX) * j, CY + (y - CY) * j]);
  }

  return { svg: path(smoothClosed(pts)), rx, ry, edge };
}
