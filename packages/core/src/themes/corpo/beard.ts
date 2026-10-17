import type { Rng } from '../../rng.js';
import { HX, HY, type Head } from './head.js';
import { path, pt, smoothClosed, type Pt } from '../util.js';

/** Leaves a band of skin around the mouth, so the mouth stays readable on any beard color. */
export function beard(rng: Rng, head: Head, color: string): string {
  if (!rng.chance(0.22)) return '';
  const kind = rng.weighted([
    ['full', 40],
    ['stubble', 25],
    ['goatee', 20],
    ['mustache', 15],
  ] as const);
  const y = head.mouthY;
  const fill = ` fill="${color}"`;
  const mustache = path(`M ${pt(HX - 4.5, y - 1)} Q ${pt(HX, y - 4.5)} ${pt(HX + 4.5, y - 1)} Q ${pt(HX, y - 2)} ${pt(HX - 4.5, y - 1)} Z`, fill);

  const jaw: Pt[] = [];
  for (let i = 0; i <= 10; i++) jaw.push(head.around(0.15 + (i / 10) * (Math.PI - 0.3), 0.8));
  const full = smoothClosed([
    ...jaw,
    [HX - head.rx * 0.72, HY + 5],
    [HX - 5.5, y + 2.5],
    [HX, y + 3.5],
    [HX + 5.5, y + 2.5],
    [HX + head.rx * 0.72, HY + 5],
  ]);
  const chin = HY + head.ry;

  switch (kind) {
    case 'full':
      return path(full, fill) + mustache;
    case 'stubble':
      return path(full, `${fill} fill-opacity=".3"`);
    case 'goatee':
      return path(smoothClosed([[HX - 4, y + 2.5], [HX, y + 2], [HX + 4, y + 2.5], [HX + 3, chin - 0.5], [HX, chin + 0.5], [HX - 3, chin - 0.5]]), fill) + mustache;
    case 'mustache':
      return mustache;
  }
}
