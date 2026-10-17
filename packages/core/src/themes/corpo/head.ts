import type { Rng } from '../../rng.js';
import { circle, path, rect, smoothClosed, type Pt } from '../util.js';

/** Head center. The bust sits below it. */
export const HX = 50;
export const HY = 46;
/** Dark ink for eyes, mouth, frames. */
export const INK = '#2b2522';

const SKINS = [
  ['#f7dccb', '#e7bea5'],
  ['#efc4a4', '#daa47f'],
  ['#dba57f', '#c38962'],
  ['#bd8058', '#a26a45'],
  ['#8f5c3d', '#774a30'],
  ['#5f3b27', '#4b2e1e'],
] as const;

export interface Head {
  svg: string;
  /** Drawn before the body so the collar covers its base. */
  neck: string;
  rx: number;
  ry: number;
  skin: string;
  shade: string;
  mouthY: number;
  /** Point on the outline at angle t, 0 = right, -PI/2 = top, PI/2 = chin. */
  edge(t: number): Pt;
  /** `edge(t)` pushed outward by `k` units. */
  around(t: number, k: number): Pt;
}

export function head(rng: Rng): Head {
  const [skin, shade] = rng.pick(SKINS);
  const rx = rng.float(14.5, 16.5);
  const ry = rng.float(17, 19);
  const jaw = rng.float(0.08, 0.18); // how much the chin narrows
  const neckW = rng.float(6, 7.5);

  const edge = (t: number): Pt => {
    const s = Math.sin(t);
    return [HX + rx * Math.cos(t) * (1 - jaw * Math.max(0, s)), HY + ry * s];
  };
  const around = (t: number, k: number): Pt => {
    const [x, y] = edge(t);
    return [HX + (x - HX) * (1 + k / rx), HY + (y - HY) * (1 + k / ry)];
  };

  const fill = ` fill="${skin}"`;
  const outline = Array.from({ length: 24 }, (_, i) => edge((i / 24) * 2 * Math.PI));
  const neckTop = HY + ry * 0.5;
  return {
    neck: rect(HX - neckW, neckTop, 2 * neckW, 76 - neckTop, 0, ` fill="${shade}"`),
    svg: circle(HX - rx + 0.5, HY + 2, 3, fill) + circle(HX + rx - 0.5, HY + 2, 3, fill) + path(smoothClosed(outline), fill),
    rx,
    ry,
    skin,
    shade,
    mouthY: HY + ry * 0.62,
    edge,
    around,
  };
}
