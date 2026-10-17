import type { Rng } from '../../rng.js';
import { HX, HY, type Head } from './head.js';
import type { Palette } from './palette.js';
import { path, pt, smoothClosed } from '../util.js';

const JACKETS = ['#14141f', '#1d1b2e', '#262626', '#2d0f2a', '#0f2230'];

export interface Body {
  /** Hood, drawn behind the head. */
  back: string;
  front: string;
}

export function body(rng: Rng, head: Head, p: Palette): Body {
  const color = rng.pick(JACKETS);
  const style = rng.weighted([
    ['collar', 40],
    ['hoodie', 30],
    ['jacket', 30],
  ] as const);
  const sw = rng.float(34, 40);
  const fill = ` fill="${color}"`;
  const trim = ` fill="none" stroke="${p.neon2}" stroke-width=".9" stroke-linecap="round" stroke-linejoin="round"`;
  const torso = path(
    `M ${pt(HX - sw, 100)} C ${pt(HX - sw, 84)} ${pt(HX - sw + 8, 75)} ${pt(HX - 12, 74)}` +
      ` L ${pt(HX + 12, 74)} C ${pt(HX + sw - 8, 75)} ${pt(HX + sw, 84)} ${pt(HX + sw, 100)} Z`,
    fill,
  );

  switch (style) {
    case 'collar': {
      // Tall popped collar with a neon edge.
      const l = `M ${pt(HX - 15, 77)} L ${pt(HX - 11, 63)} L ${pt(HX - 6, 76)} Z`;
      const r = `M ${pt(HX + 15, 77)} L ${pt(HX + 11, 63)} L ${pt(HX + 6, 76)} Z`;
      return { back: '', front: torso + path(`${l} ${r}`, ` fill="${color}" stroke="#000" stroke-opacity=".4" stroke-width=".6"`) + path(`M ${pt(HX - 11, 63)} L ${pt(HX - 6, 76)} M ${pt(HX + 11, 63)} L ${pt(HX + 6, 76)}`, trim + p.glow) };
    }
    case 'hoodie': {
      const top = HY - head.ry - 4;
      const hood = smoothClosed([
        [HX - head.rx - 6, 76],
        [HX - head.rx - 6, HY],
        [HX - head.rx * 0.6, top + 2],
        [HX, top],
        [HX + head.rx * 0.6, top + 2],
        [HX + head.rx + 6, HY],
        [HX + head.rx + 6, 76],
      ]);
      return { back: path(hood, fill), front: torso + path(`M ${pt(HX - 4, 80)} L ${pt(HX - 4, 92)} M ${pt(HX + 4, 80)} L ${pt(HX + 4, 92)}`, trim) };
    }
    case 'jacket':
      return {
        back: '',
        front:
          torso +
          path(`M ${pt(HX - 9, 74)} L ${pt(HX, 92)} L ${pt(HX + 9, 74)} Z`, ' fill="#08080c"') +
          path(`M ${pt(HX - 9, 74)} L ${pt(HX - 2, 100)} M ${pt(HX + 9, 74)} L ${pt(HX + 2, 100)}`, trim + p.glow) +
          path(`M ${pt(HX - 9, 74)} L ${pt(HX - 2, 100)} M ${pt(HX + 9, 74)} L ${pt(HX + 2, 100)}`, trim),
      };
  }
}
