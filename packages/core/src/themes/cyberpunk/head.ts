import type { Rng } from '../../rng.js';
import type { Palette } from './palette.js';
import { circle, path, pt, rect, smoothClosed, type Pt } from '../util.js';

export const HX = 50;
export const HY = 46;
export const INK = '#0e0e14';

const SKINS: readonly (readonly [readonly [string, string], number])[] = [
  [['#f1c9b0', '#c4927a'], 20],
  [['#c98e6a', '#97644a'], 20],
  [['#8a5a3c', '#603c27'], 18],
  [['#4f3324', '#34211a'], 14],
  [['#cfd8e3', '#8794a9'], 14], // chrome
  [['#e9e4f5', '#a397c6'], 14], // pale synth
];

export interface Head {
  svg: string;
  /** Neck and the ear behind it, drawn before the body. */
  neck: string;
  rx: number;
  ry: number;
  mouthY: number;
  skin: string;
  shade: string;
  edge(t: number): Pt;
  around(t: number, k: number): Pt;
}

export function head(rng: Rng, p: Palette): Head {
  const [skin, shade] = rng.weighted(SKINS);
  const rx = rng.float(14, 15.5);
  const ry = rng.float(17, 18.5);
  const jaw = rng.float(0.2, 0.32); // chin narrowing
  const neckW = rng.float(5.5, 6.8);

  // Wide at the cheekbones, tapering into the jaw.
  const edge = (t: number): Pt => {
    const s = Math.sin(t);
    return [HX + rx * Math.cos(t) * (1 - jaw * Math.max(0, s) ** 1.6), HY + ry * s];
  };
  const around = (t: number, k: number): Pt => {
    const [x, y] = edge(t);
    return [HX + (x - HX) * (1 + k / rx), HY + (y - HY) * (1 + k / ry)];
  };
  const arc = (from: number, to: number, n: number) => Array.from({ length: n + 1 }, (_, i) => edge(from + ((to - from) * i) / n));
  const chin = HY + ry;

  // Ears at eye-to-nose height; the right one sits in shadow.
  const ear = (side: number, color: string) => {
    const x = HX + side * (rx - 1);
    const d = smoothClosed([
      [x, HY - 1.5],
      [x + side * 2.6, HY - 1],
      [x + side * 3, HY + 3],
      [x + side * 1.4, HY + 7],
      [x - side * 0.5, HY + 6],
    ]);
    const inner = `M ${pt(x + side * 1.6, HY + 0.2)} Q ${pt(x + side * 2.2, HY + 3)} ${pt(x + side * 0.8, HY + 5)}`;
    return path(d, ` fill="${color}"`) + path(inner, ' fill="none" stroke="#000" stroke-opacity=".3" stroke-width=".7" stroke-linecap="round"');
  };

  // Shadow under the jaw falls on the neck.
  const neckTop = HY + ry * 0.5;
  let neck =
    rect(HX - neckW, neckTop, 2 * neckW, 76 - neckTop, 0, ` fill="${shade}"`) +
    path(`M ${pt(HX - neckW, chin - 4)} Q ${pt(HX, chin + 5)} ${pt(HX + neckW, chin - 4)} Z`, ' fill="#000" fill-opacity=".3"');
  if (rng.chance(0.3)) {
    // Cybernetic neck rings.
    for (let y = chin + 2.5; y < 72; y += 3) {
      neck += rect(HX - neckW - 0.5, y, 2 * neckW + 1, 1.4, 0.6, ' fill="#2a2f3a"') + rect(HX + neckW - 3, y + 0.3, 1.6, 0.8, 0.3, ` fill="${p.neon}"`);
    }
  }
  const studs = rng.chance(0.35) ? circle(HX - rx - 0.6, HY + 5.6, 0.6, ` fill="${p.neon2}"${p.glow}`) + circle(HX - rx - 0.6, HY + 5.6, 0.5, ` fill="${p.neon2}"`) : '';

  // Shading follows the form: brow ridge, nose bridge, cheekbone, jaw.
  const face = path(smoothClosed(arc(0, 2 * Math.PI, 24).slice(0, -1)), ` fill="${skin}"`);
  const terminator: Pt[] = [
    ...arc(-Math.PI / 2 + 0.25, Math.PI / 2 - 0.1, 12),
    [HX + 1.5, chin - 1.5],
    [HX + rx * 0.35, HY + ry * 0.62],
    [HX + rx * 0.5, HY + ry * 0.3],
    [HX + 2, HY + 7.5],
    [HX + 1, HY + 2],
    [HX + rx * 0.3, HY - 3],
    [HX + rx * 0.2, HY - ry * 0.6],
  ];
  const shadow = path(smoothClosed(terminator), ` fill="${shade}" fill-opacity=".85"`);
  // Neon bouncing off the lit cheekbone.
  const bounce = circle(HX - rx * 0.55, HY + 5, 3.5, ` fill="${p.neon}" fill-opacity=".22"${p.soft}`);

  const rimD = arc(Math.PI / 2 + 0.3, (3 * Math.PI) / 2 - 0.2, 10)
    .map(([x, y], i) => `${i ? 'L' : 'M'} ${pt(x, y)}`)
    .join(' ');
  const rimStyle = ` fill="none" stroke="${p.neon}" stroke-width="1.1" stroke-linecap="round"`;
  const rim = path(rimD, rimStyle + p.glow) + path(rimD, rimStyle);

  return {
    svg: ear(-1, skin) + ear(1, shade) + studs + face + shadow + bounce + rim,
    neck,
    rx,
    ry,
    mouthY: HY + ry * 0.6,
    skin,
    shade,
    edge,
    around,
  };
}
